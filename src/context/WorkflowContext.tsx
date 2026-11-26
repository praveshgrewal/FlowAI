import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FlowAINode, FlowAIEdge, WorkflowDefinition, CustomNodeData, ExecutionStatus } from '../types/workflow';
import { IntegrationItem } from '../types/integration';
import { ExecutionLogItem, WorkflowStats } from '../types/execution';
import { WorkflowTemplate } from '../types/templates';
import { INITIAL_DEFAULT_WORKFLOW, MOCK_WORKFLOW_LIST } from '../data/mockWorkflows';
import { MOCK_INTEGRATIONS } from '../data/mockIntegrations';
import { MOCK_EXECUTIONS, MOCK_STATS } from '../data/mockExecutions';
import { AIWorkflowGenerator, GenerationStep } from '../services/aiWorkflowGenerator';

export type NavigationPage = 
  | 'dashboard' 
  | 'builder' 
  | 'workflows' 
  | 'templates' 
  | 'integrations' 
  | 'history' 
  | 'settings';

interface TestStepResult {
  nodeId: string;
  nodeName: string;
  category: string;
  durationMs: number;
  status: ExecutionStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}

interface WorkflowContextType {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  currentWorkflow: WorkflowDefinition;
  setCurrentWorkflow: React.Dispatch<React.SetStateAction<WorkflowDefinition>>;
  workflowsList: WorkflowDefinition[];
  integrations: IntegrationItem[];
  executions: ExecutionLogItem[];
  stats: WorkflowStats;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  
  // Node manipulation
  updateNodeData: (id: string, updates: Partial<CustomNodeData>) => void;
  addNodeToCanvas: (category: string, subType?: string) => void;
  deleteSelectedNode: () => void;
  onNodesChangeInternal: (nodes: FlowAINode[]) => void;
  onEdgesChangeInternal: (edges: FlowAIEdge[]) => void;

  // AI Generation
  isGenerating: boolean;
  generationSteps: GenerationStep[];
  currentGeneratingPrompt: string;
  generateWorkflowFromPrompt: (prompt: string) => Promise<void>;

  // Execution Simulation
  isExecutingTest: boolean;
  activeTestStepNodeId: string | null;
  testRunResults: TestStepResult[];
  runWorkflowSimulation: () => Promise<void>;
  clearTestState: () => void;

  // Navigation & Actions
  loadWorkflowById: (id: string) => void;
  loadTemplateIntoBuilder: (template: WorkflowTemplate) => void;
  createNewBlankWorkflow: () => void;
  saveCurrentWorkflow: () => void;
  updateIntegrationStatus: (integrationId: string, status: IntegrationItem['status']) => void;
  
  // Modals
  isN8nModalOpen: boolean;
  setIsN8nModalOpen: (open: boolean) => void;
  isTestResultsOpen: boolean;
  setIsTestResultsOpen: (open: boolean) => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowDefinition>(INITIAL_DEFAULT_WORKFLOW);
  const [workflowsList, setWorkflowsList] = useState<WorkflowDefinition[]>(MOCK_WORKFLOW_LIST);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(MOCK_INTEGRATIONS);
  const [executions, setExecutions] = useState<ExecutionLogItem[]>(MOCK_EXECUTIONS);
  const [stats, setStats] = useState<WorkflowStats>(MOCK_STATS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);
  const [isTestResultsOpen, setIsTestResultsOpen] = useState(false);

  // AI Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingPrompt, setCurrentGeneratingPrompt] = useState('');
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);

  // Test Run Simulation
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [activeTestStepNodeId, setActiveTestStepNodeId] = useState<string | null>(null);
  const [testRunResults, setTestRunResults] = useState<TestStepResult[]>([]);

  // Update node data
  const updateNodeData = useCallback((id: string, updates: Partial<CustomNodeData>) => {
    setCurrentWorkflow((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      nodes: prev.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates
            } as CustomNodeData
          };
        }
        return node;
      })
    }));
  }, []);

  const onNodesChangeInternal = useCallback((nodes: FlowAINode[]) => {
    setCurrentWorkflow((prev) => ({
      ...prev,
      nodes
    }));
  }, []);

  const onEdgesChangeInternal = useCallback((edges: FlowAIEdge[]) => {
    setCurrentWorkflow((prev) => ({
      ...prev,
      edges
    }));
  }, []);

  // Add node to canvas
  const addNodeToCanvas = useCallback((category: string, subType?: string) => {
    const newNodeId = `node-${Date.now().toString().slice(-4)}`;
    const randomOffset = Math.floor(Math.random() * 50);

    let newNode: FlowAINode;

    switch (category) {
      case 'trigger':
        newNode = {
          id: newNodeId,
          type: 'triggerNode',
          position: { x: 100 + randomOffset, y: 150 + randomOffset },
          data: {
            label: subType === 'webhook' ? 'Custom Webhook Trigger' : 'Scheduled Cron Trigger',
            category: 'trigger',
            triggerType: (subType as any) || 'webhook',
            description: 'Triggers on incoming HTTP POST payload',
            config: {
              webhookPath: `webhook/${newNodeId}`,
              authRequired: true
            }
          }
        };
        break;

      case 'ai':
        newNode = {
          id: newNodeId,
          type: 'aiNode',
          position: { x: 420 + randomOffset, y: 150 + randomOffset },
          data: {
            label: 'Claude 3.5 Reasoning Node',
            category: 'ai',
            model: 'claude-3-5-sonnet',
            systemPrompt: 'You are an intelligent data processing agent.',
            userPrompt: 'Process payload:\n{{ $json }}',
            temperature: 0.2,
            maxTokens: 800,
            responseFormat: 'json',
            description: 'Analyzes inputs and formats structured JSON output'
          }
        };
        break;

      case 'logic':
        newNode = {
          id: newNodeId,
          type: 'logicNode',
          position: { x: 740 + randomOffset, y: 150 + randomOffset },
          data: {
            label: 'Condition Filter Router',
            category: 'logic',
            logicType: 'condition',
            conditionField: 'priority',
            operator: 'equals',
            compareValue: 'high',
            description: 'Evaluates if conditions match for branching'
          }
        };
        break;

      case 'integration':
        newNode = {
          id: newNodeId,
          type: 'integrationNode',
          position: { x: 980 + randomOffset, y: 150 + randomOffset },
          data: {
            label: subType === 'n8n' ? 'n8n Subworkflow Dispatcher' : 'Slack Notification',
            category: 'integration',
            service: (subType as any) || 'slack',
            action: subType === 'n8n' ? 'trigger_subworkflow' : 'post_message',
            description: `Connects to ${subType || 'Slack'} API`,
            parameters: subType === 'n8n' 
              ? { scenarioId: 'subscenario-01', webhookUrl: 'https://n8n.internal/webhook/...' }
              : { channel: '#general', message: 'FlowAI Automated Alert: {{ $json.message }}' }
          }
        };
        break;

      case 'transform':
        newNode = {
          id: newNodeId,
          type: 'transformNode',
          position: { x: 500 + randomOffset, y: 280 + randomOffset },
          data: {
            label: 'JSON Data Transform',
            category: 'transform',
            transformType: 'json_map',
            description: 'Maps, parses, and cleans payload fields',
            codeSnippet: 'return {\n  ...item,\n  processedAt: new Date().toISOString()\n};'
          }
        };
        break;

      case 'output':
      default:
        newNode = {
          id: newNodeId,
          type: 'outputNode',
          position: { x: 1200 + randomOffset, y: 150 + randomOffset },
          data: {
            label: 'Webhook Response 200 OK',
            category: 'output',
            outputType: 'webhook_response',
            statusCode: 200,
            description: 'Returns HTTP response to caller'
          }
        };
    }

    setCurrentWorkflow((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      nodes: [...prev.nodes, newNode]
    }));

    setSelectedNodeId(newNodeId);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;

    setCurrentWorkflow((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      nodes: prev.nodes.filter((n) => n.id !== selectedNodeId),
      edges: prev.edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
    }));

    setSelectedNodeId(null);
  }, [selectedNodeId]);

  // AI Workflow Generation from prompt with realistic streaming steps
  const generateWorkflowFromPrompt = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setCurrentGeneratingPrompt(prompt);

    const steps: GenerationStep[] = [
      { step: 1, label: 'Intent & Architecture Analysis', detail: 'Deconstructing automation prompt and isolating trigger conditions...', status: 'processing' },
      { step: 2, label: 'Integration Schema Mapping', detail: 'Selecting optimal services (Gmail, Slack, OpenAI, n8n) and auth protocols...', status: 'pending' },
      { step: 3, label: 'DAG Node & Edge Synthesis', detail: 'Constructing dependency tree, conditional branches, and data flows...', status: 'pending' },
      { step: 4, label: 'Validating n8n & API Compatibility', detail: 'Verifying parameter variables, error handles, and JSON schemas...', status: 'pending' }
    ];

    setGenerationSteps([...steps]);

    // Simulate progressive streaming step 1 -> 2
    await new Promise((r) => setTimeout(r, 600));
    steps[0].status = 'done';
    steps[1].status = 'processing';
    setGenerationSteps([...steps]);

    // Step 2 -> 3
    await new Promise((r) => setTimeout(r, 700));
    steps[1].status = 'done';
    steps[2].status = 'processing';
    setGenerationSteps([...steps]);

    // Step 3 -> 4
    await new Promise((r) => setTimeout(r, 700));
    steps[2].status = 'done';
    steps[3].status = 'processing';
    setGenerationSteps([...steps]);

    // Finalize
    await new Promise((r) => setTimeout(r, 500));
    steps[3].status = 'done';
    setGenerationSteps([...steps]);

    const generated = AIWorkflowGenerator.parsePromptToWorkflow(prompt);

    const newWorkflow: WorkflowDefinition = {
      id: `wf-ai-${Date.now().toString().slice(-5)}`,
      name: generated.title,
      description: generated.description,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: generated.tags,
      executionCount: 0,
      successRate: 100,
      aiPromptOrigin: prompt,
      nodes: generated.nodes,
      edges: generated.edges
    };

    setCurrentWorkflow(newWorkflow);
    setWorkflowsList((prev) => [newWorkflow, ...prev]);
    setIsGenerating(false);
    setActivePage('builder');
  }, []);

  // Workflow Test Execution Simulation
  const runWorkflowSimulation = useCallback(async () => {
    if (isExecutingTest || currentWorkflow.nodes.length === 0) return;

    setIsExecutingTest(true);
    setTestRunResults([]);
    setIsTestResultsOpen(true);

    // Reset all nodes to idle
    setCurrentWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle'
        } as CustomNodeData
      }))
    }));

    const results: TestStepResult[] = [];
    const orderedNodes = [...currentWorkflow.nodes].sort((a, b) => a.position.x - b.position.x);

    for (const node of orderedNodes) {
      setActiveTestStepNodeId(node.id);

      // Set node to running
      setCurrentWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, status: 'running' } as CustomNodeData }
            : n
        )
      }));

      // Simulate realistic execution delay per node
      const durationMs = Math.floor(150 + Math.random() * 350);
      await new Promise((r) => setTimeout(r, durationMs));

      // Mock output payload
      let stepOutput: Record<string, unknown> = {};
      if (node.data.category === 'trigger') {
        stepOutput = {
          event: 'webhook_received',
          sender: 'lead@enterprise.com',
          company: 'Acme Global',
          seats: 500,
          timestamp: new Date().toISOString()
        };
      } else if (node.data.category === 'ai') {
        stepOutput = {
          sentiment: 'High Priority Enterprise Lead',
          icpScore: 96,
          summary: 'Verified 500 seat enterprise expansion request.',
          suggestedAction: 'Route to Strategic SDR team'
        };
      } else if (node.data.category === 'logic') {
        stepOutput = {
          conditionResult: true,
          matchedRule: 'icpScore > 80',
          branch: 'true'
        };
      } else if (node.data.category === 'integration') {
        stepOutput = {
          service: (node.data as any).service || 'service',
          status: 'success',
          externalId: `msg_${Date.now()}`
        };
      } else {
        stepOutput = {
          status: 'ok',
          statusCode: 200,
          message: 'Execution payload delivered'
        };
      }

      // Mark node success
      setCurrentWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => 
          n.id === node.id 
            ? { 
                ...n, 
                data: { 
                  ...n.data, 
                  status: 'success', 
                  executionTime: durationMs,
                  lastOutput: stepOutput 
                } as CustomNodeData 
              }
            : n
        )
      }));

      results.push({
        nodeId: node.id,
        nodeName: node.data.label,
        category: node.data.category,
        durationMs,
        status: 'success',
        input: { nodeType: node.data.category },
        output: stepOutput
      });

      setTestRunResults([...results]);
    }

    setActiveTestStepNodeId(null);
    setIsExecutingTest(false);

    // Add new execution log to execution history
    const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);
    const newExec: ExecutionLogItem = {
      id: `exec-${Date.now().toString().slice(-6)}`,
      workflowId: currentWorkflow.id,
      workflowName: currentWorkflow.name,
      triggerType: 'Manual Test Execution',
      status: 'success',
      startTime: new Date().toISOString(),
      durationMs: totalDuration,
      tokensUsed: 460,
      costUsd: 0.0019,
      nodeSteps: results.map((r) => ({
        nodeId: r.nodeId,
        nodeName: r.nodeName,
        category: r.category,
        durationMs: r.durationMs,
        status: r.status as any,
        inputData: r.input,
        outputData: r.output
      }))
    };

    setExecutions((prev) => [newExec, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalExecutions: prev.totalExecutions + 1
    }));
  }, [currentWorkflow, isExecutingTest]);

  const clearTestState = useCallback(() => {
    setIsExecutingTest(false);
    setActiveTestStepNodeId(null);
    setIsTestResultsOpen(false);
    setCurrentWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle'
        } as CustomNodeData
      }))
    }));
  }, []);

  const loadWorkflowById = useCallback((id: string) => {
    const found = workflowsList.find((w) => w.id === id);
    if (found) {
      // If the workflow doesn't have nodes populated, generate standard pipeline or use default
      if (!found.nodes || found.nodes.length === 0) {
        const generated = AIWorkflowGenerator.parsePromptToWorkflow(found.name + ' ' + found.description);
        setCurrentWorkflow({
          ...found,
          nodes: generated.nodes,
          edges: generated.edges
        });
      } else {
        setCurrentWorkflow(found);
      }
      setSelectedNodeId(null);
      setActivePage('builder');
    }
  }, [workflowsList]);

  const loadTemplateIntoBuilder = useCallback((template: WorkflowTemplate) => {
    const generated = AIWorkflowGenerator.parsePromptToWorkflow(template.title + ' ' + template.description);
    const newWorkflow: WorkflowDefinition = {
      id: `wf-from-tmpl-${Date.now().toString().slice(-4)}`,
      name: template.title,
      description: template.description,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: template.tags,
      executionCount: 0,
      successRate: 100,
      nodes: generated.nodes,
      edges: generated.edges
    };

    setCurrentWorkflow(newWorkflow);
    setWorkflowsList((prev) => [newWorkflow, ...prev]);
    setSelectedNodeId(null);
    setActivePage('builder');
  }, []);

  const createNewBlankWorkflow = useCallback(() => {
    const newBlank: WorkflowDefinition = {
      id: `wf-new-${Date.now().toString().slice(-4)}`,
      name: 'Untitled AI Workflow',
      description: 'Custom AI workflow constructed from scratch.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['Custom'],
      executionCount: 0,
      successRate: 100,
      nodes: [
        {
          id: 'node-trigger-1',
          type: 'triggerNode',
          position: { x: 100, y: 180 },
          data: {
            label: 'Webhook Trigger',
            category: 'trigger',
            triggerType: 'webhook',
            description: 'Inbound HTTP webhook',
            config: {
              webhookPath: 'webhook/v1',
              authRequired: true
            }
          }
        }
      ],
      edges: []
    };

    setCurrentWorkflow(newBlank);
    setWorkflowsList((prev) => [newBlank, ...prev]);
    setSelectedNodeId('node-trigger-1');
    setActivePage('builder');
  }, []);

  const saveCurrentWorkflow = useCallback(() => {
    setWorkflowsList((prev) => {
      const exists = prev.some((w) => w.id === currentWorkflow.id);
      if (exists) {
        return prev.map((w) => (w.id === currentWorkflow.id ? { ...currentWorkflow, updatedAt: new Date().toISOString() } : w));
      }
      return [{ ...currentWorkflow, updatedAt: new Date().toISOString() }, ...prev];
    });
  }, [currentWorkflow]);

  const updateIntegrationStatus = useCallback((integrationId: string, status: IntegrationItem['status']) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === integrationId
          ? {
              ...item,
              status,
              connectedAt: status === 'connected' ? 'Just now' : item.connectedAt
            }
          : item
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      currentWorkflow,
      setCurrentWorkflow,
      workflowsList,
      integrations,
      executions,
      stats,
      selectedNodeId,
      setSelectedNodeId,
      updateNodeData,
      addNodeToCanvas,
      deleteSelectedNode,
      onNodesChangeInternal,
      onEdgesChangeInternal,
      isGenerating,
      generationSteps,
      currentGeneratingPrompt,
      generateWorkflowFromPrompt,
      isExecutingTest,
      activeTestStepNodeId,
      testRunResults,
      runWorkflowSimulation,
      clearTestState,
      loadWorkflowById,
      loadTemplateIntoBuilder,
      createNewBlankWorkflow,
      saveCurrentWorkflow,
      updateIntegrationStatus,
      isN8nModalOpen,
      setIsN8nModalOpen,
      isTestResultsOpen,
      setIsTestResultsOpen
    }),
    [
      activePage,
      currentWorkflow,
      workflowsList,
      integrations,
      executions,
      stats,
      selectedNodeId,
      updateNodeData,
      addNodeToCanvas,
      deleteSelectedNode,
      onNodesChangeInternal,
      onEdgesChangeInternal,
      isGenerating,
      generationSteps,
      currentGeneratingPrompt,
      generateWorkflowFromPrompt,
      isExecutingTest,
      activeTestStepNodeId,
      testRunResults,
      runWorkflowSimulation,
      clearTestState,
      loadWorkflowById,
      loadTemplateIntoBuilder,
      createNewBlankWorkflow,
      saveCurrentWorkflow,
      updateIntegrationStatus,
      isN8nModalOpen,
      isTestResultsOpen
    ]
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
