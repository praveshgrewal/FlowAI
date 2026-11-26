import { WorkflowDefinition } from '../types/workflow';

export const INITIAL_DEFAULT_WORKFLOW: WorkflowDefinition = {
  id: 'wf-demo-1',
  name: 'AI Customer Support Auto-Triage & Escalation',
  description: 'Classifies inbound customer emails using Claude 3.5 Sonnet, flags urgent churn risks to Slack #support-escalations, and appends resolution summaries to Google Sheets.',
  status: 'active',
  createdAt: '2026-11-20T10:14:00Z',
  updatedAt: '2026-11-26T14:32:00Z',
  tags: ['Customer Support', 'Claude 3.5', 'Slack', 'Google Sheets', 'n8n Sync'],
  executionCount: 1482,
  successRate: 99.6,
  lastExecutionAt: '3 mins ago',
  aiPromptOrigin: 'Whenever a customer support email comes in, analyze sentiment with Claude 3.5, alert Slack if urgent, and log to Google Sheets.',
  nodes: [
    {
      id: 'node-trigger-1',
      type: 'triggerNode',
      position: { x: 40, y: 160 },
      data: {
        label: 'Gmail: Inbound Support Email',
        category: 'trigger',
        triggerType: 'gmail_event',
        description: 'Monitors support@flowai.io for new incoming tickets',
        config: {
          emailFilter: 'to:support@flowai.io is:unread',
          authRequired: true
        }
      }
    },
    {
      id: 'node-ai-1',
      type: 'aiNode',
      position: { x: 380, y: 160 },
      data: {
        label: 'Claude 3.5 Sentiment & Urgency Triage',
        category: 'ai',
        model: 'claude-3-5-sonnet',
        systemPrompt: 'You are an enterprise support triage specialist. Analyze sentiment (Positive, Neutral, Negative, Churn Risk), extract the primary software issue, and assign urgency (Urgent vs Standard). Format as strict JSON.',
        userPrompt: 'Email Details:\nSender: {{ $json.sender }}\nSubject: {{ $json.subject }}\nBody:\n{{ $json.body }}',
        temperature: 0.2,
        maxTokens: 600,
        responseFormat: 'json',
        description: 'Extracts customer sentiment, urgency level, and summary'
      }
    },
    {
      id: 'node-logic-1',
      type: 'logicNode',
      position: { x: 730, y: 160 },
      data: {
        label: 'Urgent Churn Risk Condition',
        category: 'logic',
        logicType: 'condition',
        conditionField: 'urgency',
        operator: 'equals',
        compareValue: 'Urgent',
        description: 'Branches based on AI urgency classification'
      }
    },
    {
      id: 'node-slack-urgent',
      type: 'integrationNode',
      position: { x: 1080, y: 50 },
      data: {
        label: 'Slack #vip-escalations Alert',
        category: 'integration',
        service: 'slack',
        action: 'post_message',
        description: 'Instant notification to On-Call Support Leads',
        parameters: {
          channel: '#vip-escalations',
          message: ':rotating_light: *URGENT SUPPORT TICKET*\n*Customer:* {{ $json.sender }}\n*Issue:* {{ $json.issueSummary }}\n*Sentiment:* {{ $json.sentiment }}\n\nCC: @support-leads'
        }
      }
    },
    {
      id: 'node-sheets-log',
      type: 'integrationNode',
      position: { x: 1080, y: 260 },
      data: {
        label: 'Google Sheets CRM Log',
        category: 'integration',
        service: 'google_sheets',
        action: 'append_row',
        description: 'Appends ticket metadata to central operational ledger',
        parameters: {
          spreadsheetId: '1AbX...support_telemetry',
          sheetName: 'All Tickets',
          rowValues: ['{{ $timestamp }}', '{{ $json.sender }}', '{{ $json.urgency }}', '{{ $json.sentiment }}']
        }
      }
    },
    {
      id: 'node-n8n-sync',
      type: 'integrationNode',
      position: { x: 1420, y: 160 },
      data: {
        label: 'n8n Subworkflow: Zendesk Sync',
        category: 'integration',
        service: 'n8n',
        action: 'trigger_subworkflow',
        description: 'Dispatches payload to self-hosted n8n instance',
        parameters: {
          scenarioId: 'zendesk-ticket-enrichment',
          webhookUrl: 'https://n8n.internal.corp/webhook/zendesk-sync'
        }
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'node-trigger-1', target: 'node-ai-1', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
    { id: 'e2-3', source: 'node-ai-1', target: 'node-logic-1', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
    { id: 'e3-4', source: 'node-logic-1', target: 'node-slack-urgent', sourceHandle: 'true', animated: true, label: 'Urgent', style: { stroke: '#ef4444', strokeWidth: 2 } },
    { id: 'e3-5', source: 'node-logic-1', target: 'node-sheets-log', sourceHandle: 'false', animated: true, label: 'Standard', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e4-6', source: 'node-slack-urgent', target: 'node-n8n-sync', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
    { id: 'e5-6', source: 'node-sheets-log', target: 'node-n8n-sync', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
  ]
};

export const MOCK_WORKFLOW_LIST: WorkflowDefinition[] = [
  INITIAL_DEFAULT_WORKFLOW,
  {
    id: 'wf-demo-2',
    name: 'Inbound Lead Enrichment & SDR Router',
    description: 'Catches web demo forms, scores prospects against Ideal Customer Profile using GPT-4o, and notifies enterprise sales reps on Slack.',
    status: 'active',
    createdAt: '2026-11-15T08:30:00Z',
    updatedAt: '2026-11-25T19:10:00Z',
    tags: ['RevOps', 'GPT-4o', 'Slack', 'Webhook'],
    executionCount: 3820,
    successRate: 99.8,
    lastExecutionAt: '12 mins ago',
    nodes: [],
    edges: []
  },
  {
    id: 'wf-demo-3',
    name: 'Daily Executive Market Intelligence Digest',
    description: 'Polls industry RSS feeds and financial news every morning at 7:00 AM UTC, summarizes macro developments using Claude 3.5, and generates a PDF digest in Google Drive.',
    status: 'active',
    createdAt: '2026-11-18T14:00:00Z',
    updatedAt: '2026-11-26T07:00:00Z',
    tags: ['Schedule', 'Cron', 'Claude 3.5', 'Executive'],
    executionCount: 42,
    successRate: 100,
    lastExecutionAt: 'Today at 7:00 AM',
    nodes: [],
    edges: []
  },
  {
    id: 'wf-demo-4',
    name: 'GitHub Pull Request AI Security & Code Reviewer',
    description: 'Scans PR diffs on GitHub, checks for SQL injection, hardcoded secrets, and stylistic deviations with Gemini 1.5 Pro, and comments findings.',
    status: 'active',
    createdAt: '2026-11-10T12:00:00Z',
    updatedAt: '2026-11-24T18:40:00Z',
    tags: ['GitHub', 'Gemini 1.5 Pro', 'DevOps', 'Security'],
    executionCount: 914,
    successRate: 98.9,
    lastExecutionAt: '1 hour ago',
    nodes: [],
    edges: []
  },
  {
    id: 'wf-demo-5',
    name: 'Stripe Refund Request n8n Verification Flow',
    description: 'Catches charge.refund.updated webhook, verifies anti-fraud heuristics, and triggers n8n audit scenario.',
    status: 'paused',
    createdAt: '2026-11-05T09:20:00Z',
    updatedAt: '2026-11-22T11:00:00Z',
    tags: ['Stripe', 'n8n', 'FinTech', 'Webhook'],
    executionCount: 204,
    successRate: 97.5,
    lastExecutionAt: '4 days ago',
    nodes: [],
    edges: []
  },
  {
    id: 'wf-demo-6',
    name: 'Customer Churn Predictor & NPS Follow-up',
    description: 'Draft workflow experimenting with DeepSeek-R1 reasoning models to identify low-engagement customer signals.',
    status: 'draft',
    createdAt: '2026-11-25T16:45:00Z',
    updatedAt: '2026-11-25T17:15:00Z',
    tags: ['AI Agent', 'DeepSeek-R1', 'Draft'],
    executionCount: 0,
    successRate: 0,
    nodes: [],
    edges: []
  }
];
