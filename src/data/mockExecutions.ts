import { ExecutionLogItem, WorkflowStats } from '../types/execution';

export const MOCK_STATS: WorkflowStats = {
  totalWorkflows: 24,
  activeWorkflows: 18,
  totalExecutions: 142850,
  executionGrowthPercentage: 28.4,
  successRate: 99.4,
  avgLatencyMs: 640,
  tokensConsumed: 4820000,
  tokensSavedPercentage: 34.2
};

export const MOCK_EXECUTIONS: ExecutionLogItem[] = [
  {
    id: 'exec-849201',
    workflowId: 'wf-demo-1',
    workflowName: 'AI Customer Support Auto-Triage & Escalation',
    triggerType: 'Gmail Inbound Event',
    status: 'success',
    startTime: '2026-11-26T14:28:12Z',
    durationMs: 720,
    tokensUsed: 420,
    costUsd: 0.0018,
    nodeSteps: [
      {
        nodeId: 'node-trigger-1',
        nodeName: 'Gmail: Inbound Support Email',
        category: 'trigger',
        durationMs: 85,
        status: 'success',
        inputData: { filter: 'to:support@flowai.io is:unread' },
        outputData: {
          sender: 'alex.rivera@enterprise-client.com',
          subject: 'Production API downtime on EU cluster',
          body: 'We are experiencing 504 timeouts across our enterprise cluster. This is affecting 20,000 active users. Need immediate attention.'
        }
      },
      {
        nodeId: 'node-ai-1',
        nodeName: 'Claude 3.5 Sentiment & Urgency Triage',
        category: 'ai',
        durationMs: 380,
        status: 'success',
        inputData: { model: 'claude-3-5-sonnet', promptLength: 180 },
        outputData: {
          sentiment: 'Negative / Churn Risk',
          urgency: 'Urgent',
          issueSummary: 'EU cluster 504 outage impacting 20k users',
          suggestedPriority: 'P0'
        }
      },
      {
        nodeId: 'node-logic-1',
        nodeName: 'Urgent Churn Risk Condition',
        category: 'logic',
        durationMs: 5,
        status: 'success',
        inputData: { field: 'urgency', value: 'Urgent' },
        outputData: { branch: 'true', action: 'Route to VIP Escalation' }
      },
      {
        nodeId: 'node-slack-urgent',
        nodeName: 'Slack #vip-escalations Alert',
        category: 'integration',
        durationMs: 140,
        status: 'success',
        inputData: { channel: '#vip-escalations' },
        outputData: { messageId: '1732627692.00192', status: 'posted' }
      },
      {
        nodeId: 'node-n8n-sync',
        nodeName: 'n8n Subworkflow: Zendesk Sync',
        category: 'integration',
        durationMs: 110,
        status: 'success',
        inputData: { scenarioId: 'zendesk-ticket-enrichment' },
        outputData: { n8nExecutionId: 'n8n-exec-9921', status: 'queued' }
      }
    ]
  },
  {
    id: 'exec-849200',
    workflowId: 'wf-demo-2',
    workflowName: 'Inbound Lead Enrichment & SDR Router',
    triggerType: 'Webhook POST /leads/inbound',
    status: 'success',
    startTime: '2026-11-26T14:24:05Z',
    durationMs: 610,
    tokensUsed: 310,
    costUsd: 0.0012,
    nodeSteps: [
      {
        nodeId: 'node-1',
        nodeName: 'Typeform Webhook Inbound',
        category: 'trigger',
        durationMs: 40,
        status: 'success',
        inputData: { body: { name: 'Sarah Chen', email: 'schen@stripe.com', seats: '250' } }
      },
      {
        nodeId: 'node-2',
        nodeName: 'GPT-4o ICP Scorer',
        category: 'ai',
        durationMs: 410,
        status: 'success',
        inputData: { model: 'gpt-4o' },
        outputData: { score: 94, tier: 'Tier-1 Enterprise', routing: 'Direct Account Exec' }
      },
      {
        nodeId: 'node-3',
        nodeName: 'Slack #enterprise-leads',
        category: 'integration',
        durationMs: 160,
        status: 'success',
        inputData: { channel: '#enterprise-leads' }
      }
    ]
  },
  {
    id: 'exec-849199',
    workflowId: 'wf-demo-4',
    workflowName: 'GitHub Pull Request AI Security & Code Reviewer',
    triggerType: 'GitHub Webhook (PR #418)',
    status: 'success',
    startTime: '2026-11-26T13:58:30Z',
    durationMs: 1250,
    tokensUsed: 1240,
    costUsd: 0.0049,
    nodeSteps: [
      {
        nodeId: 'node-gh',
        nodeName: 'GitHub PR Event',
        category: 'trigger',
        durationMs: 110,
        status: 'success',
        inputData: { repo: 'acme-corp/core-api', pr: 418 }
      },
      {
        nodeId: 'node-gemini',
        nodeName: 'Gemini 1.5 Pro Security Scanner',
        category: 'ai',
        durationMs: 980,
        status: 'success',
        inputData: { filesChanged: 4, linesAdded: 182 },
        outputData: { findings: 0, status: 'APPROVED_WITH_NO_RISK' }
      },
      {
        nodeId: 'node-gh-comment',
        nodeName: 'GitHub Review Comment',
        category: 'integration',
        durationMs: 160,
        status: 'success',
        inputData: { action: 'approve' }
      }
    ]
  },
  {
    id: 'exec-849198',
    workflowId: 'wf-demo-5',
    workflowName: 'Stripe Refund Request n8n Verification Flow',
    triggerType: 'Stripe Webhook',
    status: 'failed',
    startTime: '2026-11-26T12:15:10Z',
    durationMs: 480,
    errorMessage: 'n8n Subscenario returned 429 Too Many Requests (Rate limit reached)',
    nodeSteps: [
      {
        nodeId: 'node-stripe',
        nodeName: 'Stripe Refund Hook',
        category: 'trigger',
        durationMs: 50,
        status: 'success',
        inputData: { chargeId: 'ch_3M4...' }
      },
      {
        nodeId: 'node-n8n-call',
        nodeName: 'n8n Verification Subflow',
        category: 'integration',
        durationMs: 430,
        status: 'failed',
        inputData: { scenarioId: 'fraud-eval' },
        error: 'HTTP 429: Rate limit quota exceeded on n8n webhook listener.'
      }
    ]
  },
  {
    id: 'exec-849197',
    workflowId: 'wf-demo-1',
    workflowName: 'AI Customer Support Auto-Triage & Escalation',
    triggerType: 'Gmail Inbound Event',
    status: 'success',
    startTime: '2026-11-26T11:42:00Z',
    durationMs: 650,
    tokensUsed: 380,
    nodeSteps: []
  },
  {
    id: 'exec-849196',
    workflowId: 'wf-demo-3',
    workflowName: 'Daily Executive Market Intelligence Digest',
    triggerType: 'Cron Schedule (0 7 * * *)',
    status: 'success',
    startTime: '2026-11-26T07:00:01Z',
    durationMs: 2450,
    tokensUsed: 4200,
    nodeSteps: []
  }
];
