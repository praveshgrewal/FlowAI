export interface ExecutionLogItem {
  id: string;
  workflowId: string;
  workflowName: string;
  triggerType: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  durationMs: number;
  tokensUsed?: number;
  costUsd?: number;
  errorMessage?: string;
  nodeSteps: {
    nodeId: string;
    nodeName: string;
    category: string;
    durationMs: number;
    status: 'success' | 'failed' | 'skipped';
    inputData: Record<string, unknown> | string;
    outputData?: Record<string, unknown> | string;
    error?: string;
  }[];
}

export interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  executionGrowthPercentage: number;
  successRate: number;
  avgLatencyMs: number;
  tokensConsumed: number;
  tokensSavedPercentage: number;
}
