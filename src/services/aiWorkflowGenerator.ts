import { FlowAINode, FlowAIEdge } from '../types/workflow';

export interface GenerationStep {
  step: number;
  label: string;
  detail: string;
  status: 'pending' | 'processing' | 'done';
}

export interface GeneratedWorkflowResult {
  title: string;
  description: string;
  nodes: FlowAINode[];
  edges: FlowAIEdge[];
  tags: string[];
  reasoningNotes: string[];
}

/**
 * Rule-based intelligent workflow synthesizer for prompts.
 * Generates tailored, production-ready node trees and connections with realistic coordinates and prefilled parameters.
 */
export class AIWorkflowGenerator {
  static parsePromptToWorkflow(promptText: string): GeneratedWorkflowResult {
    const text = promptText.toLowerCase();

    // Default template structure based on intent recognition
    if (text.includes('email') || text.includes('gmail') || text.includes('newsletter') || text.includes('inbox')) {
      return this.buildEmailSummaryPipeline(promptText);
    } 
    
    if (text.includes('lead') || text.includes('typeform') || text.includes('crm') || text.includes('hubspot') || text.includes('clearbit')) {
      return this.buildLeadEnrichmentPipeline(promptText);
    }

    if (text.includes('github') || text.includes('pr') || text.includes('issue') || text.includes('discord') || text.includes('code')) {
      return this.buildDevOpsTriagePipeline(promptText);
    }

    if (text.includes('sheet') || text.includes('scrape') || text.includes('notion') || text.includes('database')) {
      return this.buildDataExtractionPipeline(promptText);
    }

    // Generic Intelligent Orchestrator for open-ended prompts
    return this.buildGeneralAgentPipeline(promptText);
  }

  private static buildEmailSummaryPipeline(prompt: string): GeneratedWorkflowResult {
    const nodes: FlowAINode[] = [
      {
        id: 'node-1',
        type: 'triggerNode',
        position: { x: 50, y: 180 },
        data: {
          label: 'Gmail New Incoming Email',
          category: 'trigger',
          triggerType: 'gmail_event',
          description: 'Triggers on unread emails matching filter label:newsletters',
          config: {
            emailFilter: 'label:newsletters OR from:*@substack.com',
            authRequired: true
          }
        }
      },
      {
        id: 'node-2',
        type: 'transformNode',
        position: { x: 380, y: 180 },
        data: {
          label: 'HTML Parser & Content Stripper',
          category: 'transform',
          transformType: 'json_map',
          description: 'Cleans markup, extracts sender, subject and plaintext body',
          codeSnippet: 'return {\n  sender: $json.from,\n  subject: $json.subject,\n  body: sanitizeHtml($json.bodyHtml).slice(0, 4000)\n};'
        }
      },
      {
        id: 'node-3',
        type: 'aiNode',
        position: { x: 710, y: 180 },
        data: {
          label: 'Claude 3.5 Executive Synthesizer',
          category: 'ai',
          model: 'claude-3-5-sonnet',
          systemPrompt: 'You are an executive chief of staff. Condense emails into 3 high-impact bullet points and identify required action items.',
          userPrompt: 'Summarize the following newsletter:\nSender: {{ $json.sender }}\nSubject: {{ $json.subject }}\nBody:\n{{ $json.body }}',
          temperature: 0.3,
          maxTokens: 1000,
          responseFormat: 'json',
          description: 'Generates structured TL;DR and prioritized action items'
        }
      },
      {
        id: 'node-4',
        type: 'integrationNode',
        position: { x: 1060, y: 80 },
        data: {
          label: 'Slack Executive Digest',
          category: 'integration',
          service: 'slack',
          action: 'post_message',
          description: 'Posts Markdown summary card to #executive-briefings',
          parameters: {
            channel: '#executive-briefings',
            message: ':newspaper: *Daily AI Digest: {{ $json.subject }}*\n*Source:* {{ $json.sender }}\n\n*Key Takeaways:*\n{{ $json.summary }}\n\n*Action Items:*\n{{ $json.action_items }}'
          }
        }
      },
      {
        id: 'node-5',
        type: 'integrationNode',
        position: { x: 1060, y: 280 },
        data: {
          label: 'Google Sheets Archive',
          category: 'integration',
          service: 'google_sheets',
          action: 'append_row',
          description: 'Logs row to Knowledge Repository spreadsheet',
          parameters: {
            spreadsheetId: '1F4Xz...executive_knowledge_base',
            sheetName: 'Newsletter Archives',
            rowValues: ['{{ $timestamp }}', '{{ $json.sender }}', '{{ $json.subject }}', '{{ $json.summary }}']
          }
        }
      }
    ];

    const edges: FlowAIEdge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e3-4', source: 'node-3', target: 'node-4', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e3-5', source: 'node-3', target: 'node-5', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
    ];

    return {
      title: 'Gmail AI Executive Digest & Sheets Archiver',
      description: 'Automatically detects new newsletter or priority emails, generates structured executive takeaways via Claude 3.5, and dispatches to Slack + Google Sheets.',
      nodes,
      edges,
      tags: ['Gmail', 'Claude 3.5', 'Slack', 'Google Sheets'],
      reasoningNotes: [
        'Selected Gmail Trigger configured with unread label filter to prevent re-processing.',
        'Inserted HTML normalization step to preserve LLM token context.',
        'Routed dual branches from AI synthesis to Slack instant alert and Google Sheets permanent storage.',
        'n8n export ready with credential mapping keys.'
      ]
    };
  }

  private static buildLeadEnrichmentPipeline(prompt: string): GeneratedWorkflowResult {
    const nodes: FlowAINode[] = [
      {
        id: 'node-1',
        type: 'triggerNode',
        position: { x: 50, y: 200 },
        data: {
          label: 'Webhook: Typeform Inbound',
          category: 'trigger',
          triggerType: 'webhook',
          description: 'Receives instant JSON payload from website demo request form',
          config: {
            webhookPath: 'leads/inbound-v1',
            authRequired: true
          }
        }
      },
      {
        id: 'node-2',
        type: 'aiNode',
        position: { x: 380, y: 200 },
        data: {
          label: 'GPT-4o ICP & Intent Scorer',
          category: 'ai',
          model: 'gpt-4o',
          systemPrompt: 'You are an enterprise RevOps qualification engine. Classify the lead into Tier-1 (Enterprise, >100 seats), Tier-2 (Mid-market), or Tier-3 (Self-serve). Output JSON with tier, score (0-100), and rationale.',
          userPrompt: 'Lead Information:\nName: {{ $json.name }}\nEmail: {{ $json.email }}\nCompany: {{ $json.company }}\nRole: {{ $json.role }}\nUse Case: {{ $json.notes }}',
          temperature: 0.2,
          maxTokens: 500,
          responseFormat: 'json',
          description: 'Calculates Ideal Customer Profile score and intent tier'
        }
      },
      {
        id: 'node-3',
        type: 'logicNode',
        position: { x: 720, y: 200 },
        data: {
          label: 'Tier-1 Enterprise Filter',
          category: 'logic',
          logicType: 'condition',
          conditionField: 'score',
          operator: 'greater_than',
          compareValue: '75',
          description: 'Routes high-value prospects to direct SDR Slack escalation'
        }
      },
      {
        id: 'node-4',
        type: 'integrationNode',
        position: { x: 1060, y: 80 },
        data: {
          label: 'Slack #enterprise-leads Bot',
          category: 'integration',
          service: 'slack',
          action: 'post_message',
          description: 'Mentions @sales-reps with 1-click booking link',
          parameters: {
            channel: '#enterprise-leads',
            message: ':fire: *New Enterprise Lead Qualified (Score: {{ $json.score }})*\n*Company:* {{ $json.company }} ({{ $json.role }})\n*Intent:* {{ $json.rationale }}'
          }
        }
      },
      {
        id: 'node-5',
        type: 'integrationNode',
        position: { x: 1060, y: 320 },
        data: {
          label: 'n8n HubSpot & CRM Sync',
          category: 'integration',
          service: 'n8n',
          action: 'trigger_subworkflow',
          description: 'Dispatches lead to n8n CRM sync scenario',
          parameters: {
            scenarioId: 'hubspot-contact-upsert-v3',
            webhookUrl: 'https://n8n.internal.company/webhook/leads-sync'
          }
        }
      }
    ];

    const edges: FlowAIEdge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e3-4', source: 'node-3', target: 'node-4', sourceHandle: 'true', animated: true, label: 'Score > 75 (High Priority)', style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e3-5', source: 'node-3', target: 'node-5', sourceHandle: 'false', animated: true, label: 'Standard Route', style: { stroke: '#64748b', strokeWidth: 2 } }
    ];

    return {
      title: 'Inbound Lead AI Qualifier & n8n CRM Dispatcher',
      description: 'Ingests inbound leads via webhook, classifies buyer intent and ICP fit with GPT-4o, and notifies high-priority sales channels while syncing to n8n CRM.',
      nodes,
      edges,
      tags: ['Webhook', 'GPT-4o', 'Slack', 'n8n CRM', 'RevOps'],
      reasoningNotes: [
        'Configured authenticated webhook endpoint with JSON body validation.',
        'Prompted GPT-4o with strict enterprise qualification rubric.',
        'Added binary conditional router (true/false) for SLA prioritization.',
        'Created n8n subworkflow trigger to integrate with existing self-hosted CRM flows.'
      ]
    };
  }

  private static buildDevOpsTriagePipeline(prompt: string): GeneratedWorkflowResult {
    const nodes: FlowAINode[] = [
      {
        id: 'node-1',
        type: 'triggerNode',
        position: { x: 50, y: 180 },
        data: {
          label: 'GitHub Issue & PR Watcher',
          category: 'trigger',
          triggerType: 'webhook',
          description: 'Listens for issues.opened or pull_request.opened events',
          config: {
            webhookPath: 'github/events',
            authRequired: true
          }
        }
      },
      {
        id: 'node-2',
        type: 'aiNode',
        position: { x: 380, y: 180 },
        data: {
          label: 'Gemini 1.5 Pro Semantic Bug Classifier',
          category: 'ai',
          model: 'gemini-1-5-pro',
          systemPrompt: 'Analyze technical issue description, stack traces, and steps to reproduce. Determine severity (P0, P1, P2), affected subsystem, and potential duplicate signatures.',
          userPrompt: 'Issue Title: {{ $json.issue.title }}\nBody:\n{{ $json.issue.body }}\nAuthor: {{ $json.issue.user.login }}',
          temperature: 0.1,
          maxTokens: 800,
          responseFormat: 'json',
          description: 'Evaluates severity, stack traces and recommended fix tags'
        }
      },
      {
        id: 'node-3',
        type: 'integrationNode',
        position: { x: 740, y: 80 },
        data: {
          label: 'Slack #engineering-alerts',
          category: 'integration',
          service: 'slack',
          action: 'post_message',
          description: 'Alerts on-call engineers for critical regressions',
          parameters: {
            channel: '#engineering-alerts',
            message: ':warning: *{{ $json.severity }} Issue Reported: {{ $json.title }}*\n*Subsystem:* {{ $json.subsystem }}\n*AI Diagnosis:* {{ $json.diagnosis }}'
          }
        }
      },
      {
        id: 'node-4',
        type: 'outputNode',
        position: { x: 740, y: 280 },
        data: {
          label: 'Webhook Response: Auto-Label JSON',
          category: 'output',
          outputType: 'webhook_response',
          statusCode: 200,
          description: 'Returns applied labels and automated triage comment'
        }
      }
    ];

    const edges: FlowAIEdge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-4', source: 'node-2', target: 'node-4', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
    ];

    return {
      title: 'Autonomous GitHub Issue Triage & Severity Alerting',
      description: 'Instantly classifies incoming GitHub bugs using Gemini 1.5 Pro, identifies urgency, alerts on-call teams on Slack, and returns auto-label metadata.',
      nodes,
      edges,
      tags: ['GitHub', 'Gemini 1.5 Pro', 'Slack', 'DevOps'],
      reasoningNotes: [
        'Configured Gemini 1.5 Pro with zero-shot deterministic temperature for reproducibility.',
        'Extracted severity badges and root-cause summaries.',
        'Linked dual outputs to chat alerting and GitHub Webhook ACK response.'
      ]
    };
  }

  private static buildDataExtractionPipeline(prompt: string): GeneratedWorkflowResult {
    const nodes: FlowAINode[] = [
      {
        id: 'node-1',
        type: 'triggerNode',
        position: { x: 50, y: 180 },
        data: {
          label: 'Cron: Daily 8:00 AM UTC',
          category: 'trigger',
          triggerType: 'schedule',
          description: 'Scheduled cron recurrence rule',
          config: {
            cronExpression: '0 8 * * *',
            scheduleReadable: 'Every morning at 8:00 AM UTC'
          }
        }
      },
      {
        id: 'node-2',
        type: 'integrationNode',
        position: { x: 380, y: 180 },
        data: {
          label: 'Make / Webhook Poller',
          category: 'integration',
          service: 'make',
          action: 'poll_records',
          description: 'Fetches raw sync records from enterprise source',
          parameters: {
            scenarioId: 'data-lake-fetch-v2',
            batchSize: 50
          }
        }
      },
      {
        id: 'node-3',
        type: 'aiNode',
        position: { x: 710, y: 180 },
        data: {
          label: 'Claude 3.5 Deduplication & Normalizer',
          category: 'ai',
          model: 'claude-3-5-sonnet',
          systemPrompt: 'Normalize unstructured records, match duplicate customer profiles, and output clean JSON rows.',
          userPrompt: 'Data Batch:\n{{ $json.batch }}',
          temperature: 0.1,
          maxTokens: 1500,
          responseFormat: 'json',
          description: 'Matches records, corrects formatting inconsistencies'
        }
      },
      {
        id: 'node-4',
        type: 'integrationNode',
        position: { x: 1060, y: 180 },
        data: {
          label: 'Google Sheets Live Sync',
          category: 'integration',
          service: 'google_sheets',
          action: 'batch_update',
          description: 'Updates central master dashboard sheet',
          parameters: {
            spreadsheetId: '1AbC...master_reporting',
            sheetName: 'Normalized Data'
          }
        }
      }
    ];

    const edges: FlowAIEdge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e3-4', source: 'node-3', target: 'node-4', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
    ];

    return {
      title: 'Scheduled Data Normalizer & Google Sheets Syncer',
      description: 'Triggers on a daily cron, orchestrates Make data polling, transforms messy rows with Claude 3.5, and appends to Google Sheets.',
      nodes,
      edges,
      tags: ['Cron', 'Make', 'Claude 3.5', 'Google Sheets'],
      reasoningNotes: [
        'Cron configured for predictable scheduled execution.',
        'Integrated Make connector for batch ingestion.',
        'Used high-precision Claude 3.5 Sonnet normalizer.',
        'Direct streaming write to Google Sheets API.'
      ]
    };
  }

  private static buildGeneralAgentPipeline(prompt: string): GeneratedWorkflowResult {
    const nodes: FlowAINode[] = [
      {
        id: 'node-1',
        type: 'triggerNode',
        position: { x: 50, y: 180 },
        data: {
          label: 'Inbound Webhook Trigger',
          category: 'trigger',
          triggerType: 'webhook',
          description: 'Event trigger listening on authenticated HTTP endpoint',
          config: {
            webhookPath: 'orchestrator/v1',
            authRequired: true
          }
        }
      },
      {
        id: 'node-2',
        type: 'aiNode',
        position: { x: 380, y: 180 },
        data: {
          label: 'AI Reasoning Engine',
          category: 'ai',
          model: 'claude-3-5-sonnet',
          systemPrompt: `You are an autonomous AI orchestration engine responding to the workflow prompt: "${prompt}". Execute steps cleanly and output actionable JSON.`,
          userPrompt: 'Input Payload:\n{{ $json }}',
          temperature: 0.3,
          maxTokens: 1000,
          responseFormat: 'json',
          description: 'Parses payload intent and computes automation payload'
        }
      },
      {
        id: 'node-3',
        type: 'integrationNode',
        position: { x: 720, y: 80 },
        data: {
          label: 'Slack Notification Dispatcher',
          category: 'integration',
          service: 'slack',
          action: 'post_message',
          description: 'Broadcasts execution results to Slack channel',
          parameters: {
            channel: '#ai-automations',
            message: ':sparkles: *FlowAI Workflow Executed*\nResult: {{ $json.result }}'
          }
        }
      },
      {
        id: 'node-4',
        type: 'outputNode',
        position: { x: 720, y: 280 },
        data: {
          label: 'JSON API Response',
          category: 'output',
          outputType: 'webhook_response',
          statusCode: 200,
          description: 'Sends 200 OK with processed AI output to caller'
        }
      }
    ];

    const edges: FlowAIEdge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e2-4', source: 'node-2', target: 'node-4', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
    ];

    return {
      title: 'Autonomous AI Multi-Step Orchestrator',
      description: `Synthesized workflow tailored for: "${prompt.slice(0, 80)}..."`,
      nodes,
      edges,
      tags: ['AI Agent', 'Webhook', 'Slack', 'Automation'],
      reasoningNotes: [
        'Parsed input requirements and generated multi-step DAG structure.',
        'Added AI node with prompt context injection.',
        'Connected parallel notification and HTTP response branches.'
      ]
    };
  }
}
