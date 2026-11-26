import { FlowAINode, FlowAIEdge, WorkflowDefinition } from '../types/workflow';

/**
 * n8n Node Representation conforming to n8n Workflow JSON format
 */
export interface N8nNode {
  parameters: Record<string, unknown>;
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  credentials?: Record<string, { id: string; name: string }>;
}

export interface N8nConnectionItem {
  node: string;
  type: string;
  index: number;
}

export interface N8nWorkflowExport {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, { main: N8nConnectionItem[][] }>;
  active: boolean;
  settings: {
    executionOrder: 'v1';
    saveManualExecutions: boolean;
    callerPolicy: 'workflowsFromSameOwner';
  };
  meta: {
    templateCredsSetupCompleted: boolean;
    flowAiVersion: string;
    generatedAt: string;
  };
}

/**
 * Adapter converting FlowAI graph representation to n8n native workflow JSON
 */
export class N8nWorkflowAdapter {
  static exportToN8n(workflow: WorkflowDefinition): N8nWorkflowExport {
    const n8nNodes: N8nNode[] = workflow.nodes.map((node) => {
      let n8nType = 'n8n-nodes-base.noOp';
      const params: Record<string, unknown> = {};

      switch (node.data.category) {
        case 'trigger': {
          const trig = node.data;
          if (trig.triggerType === 'webhook') {
            n8nType = 'n8n-nodes-base.webhook';
            params.path = trig.config.webhookPath || `flowai-${node.id}`;
            params.httpMethod = 'POST';
            params.responseMode = 'onReceived';
          } else if (trig.triggerType === 'schedule') {
            n8nType = 'n8n-nodes-base.cron';
            params.triggerTimes = {
              item: [{ mode: 'custom', cronExpression: trig.config.cronExpression || '0 9 * * *' }]
            };
          } else if (trig.triggerType === 'gmail_event') {
            n8nType = 'n8n-nodes-base.gmailTrigger';
            params.event = 'messageReceived';
            params.filters = { q: trig.config.emailFilter || 'is:unread' };
          } else {
            n8nType = 'n8n-nodes-base.webhook';
          }
          break;
        }

        case 'ai': {
          const ai = node.data;
          n8nType = '@n8n/n8n-nodes-langchain.agent';
          params.promptType = 'define';
          params.text = ai.userPrompt;
          params.systemMessage = ai.systemPrompt || 'You are an autonomous workflow assistant.';
          params.model = ai.model;
          params.temperature = ai.temperature;
          break;
        }

        case 'integration': {
          const integ = node.data;
          if (integ.service === 'slack') {
            n8nType = 'n8n-nodes-base.slack';
            params.resource = 'message';
            params.operation = 'post';
            params.channel = integ.parameters?.channel || '#general';
            params.text = integ.parameters?.message || '={{ $json.output }}';
          } else if (integ.service === 'google_sheets') {
            n8nType = 'n8n-nodes-base.googleSheets';
            params.operation = 'append';
            params.sheetName = integ.parameters?.sheetName || 'Sheet1';
          } else if (integ.service === 'gmail') {
            n8nType = 'n8n-nodes-base.gmail';
            params.resource = 'message';
            params.operation = 'send';
          } else if (integ.service === 'make' || integ.service === 'n8n') {
            n8nType = 'n8n-nodes-base.httpRequest';
            params.method = 'POST';
            params.url = integ.parameters?.webhookUrl || 'https://n8n.instance/webhook/...';
          }
          break;
        }

        case 'logic': {
          const logic = node.data;
          if (logic.logicType === 'condition') {
            n8nType = 'n8n-nodes-base.if';
            params.conditions = {
              string: [{
                value1: `={{ $json.${logic.conditionField || 'status'} }}`,
                operation: logic.operator || 'equals',
                value2: logic.compareValue || 'true'
              }]
            };
          } else {
            n8nType = 'n8n-nodes-base.code';
            params.jsCode = `// FlowAI custom logic router\nreturn $input.all();`;
          }
          break;
        }

        case 'transform': {
          n8nType = 'n8n-nodes-base.code';
          params.jsCode = (node.data as any).codeSnippet || `// FlowAI Data Transform\nreturn $input.all().map(item => ({\n  ...item.json,\n  processedAt: new Date().toISOString()\n}));`;
          break;
        }

        case 'output': {
          n8nType = 'n8n-nodes-base.respondToWebhook';
          params.respondWith = 'json';
          params.responseBody = (node.data as any).responseBodyTemplate || '={{ $json }}';
          break;
        }

        default:
          n8nType = 'n8n-nodes-base.noOp';
      }

      return {
        id: node.id,
        name: node.data.label || `Node_${node.id}`,
        type: n8nType,
        typeVersion: 1,
        position: [Math.round(node.position.x), Math.round(node.position.y)],
        parameters: params,
        credentials: node.data.category === 'integration' ? {
          serviceAuth: {
            id: `flowai-vault-${(node.data as any).service}`,
            name: `${(node.data as any).service.toUpperCase()} Vault Credentials`
          }
        } : undefined
      };
    });

    // Build connections graph
    const connections: Record<string, { main: N8nConnectionItem[][] }> = {};

    workflow.edges.forEach((edge) => {
      const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
      if (!sourceNode) return;

      const sourceName = sourceNode.data.label || `Node_${sourceNode.id}`;
      const targetNode = workflow.nodes.find((n) => n.id === edge.target);
      if (!targetNode) return;

      const targetName = targetNode.data.label || `Node_${targetNode.id}`;

      if (!connections[sourceName]) {
        connections[sourceName] = { main: [[]] };
      }

      // Check if source is a condition node with true/false branches
      let connectionIndex = 0;
      if (edge.sourceHandle === 'false') {
        connectionIndex = 1;
        while (connections[sourceName].main.length <= 1) {
          connections[sourceName].main.push([]);
        }
      }

      connections[sourceName].main[connectionIndex].push({
        node: targetName,
        type: 'main',
        index: 0
      });
    });

    return {
      name: workflow.name,
      nodes: n8nNodes,
      connections,
      active: workflow.status === 'active',
      settings: {
        executionOrder: 'v1',
        saveManualExecutions: true,
        callerPolicy: 'workflowsFromSameOwner'
      },
      meta: {
        templateCredsSetupCompleted: true,
        flowAiVersion: '1.2.0',
        generatedAt: new Date().toISOString()
      }
    };
  }
}
