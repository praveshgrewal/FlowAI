import { Node, Edge } from '@xyflow/react';

export type NodeTypeCategory = 
  | 'trigger' 
  | 'ai' 
  | 'logic' 
  | 'integration' 
  | 'transform' 
  | 'output';

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'failed' | 'skipped';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  category: NodeTypeCategory;
  description?: string;
  icon?: string;
  status?: ExecutionStatus;
  executionTime?: number;
  lastOutput?: Record<string, unknown> | string;
  error?: string;
}

export interface TriggerNodeData extends BaseNodeData {
  category: 'trigger';
  triggerType: 'webhook' | 'schedule' | 'gmail_event' | 'slack_event' | 'form_submission';
  config: {
    webhookPath?: string;
    cronExpression?: string;
    scheduleReadable?: string;
    emailFilter?: string;
    slackChannel?: string;
    authRequired?: boolean;
  };
}

export interface AINodeData extends BaseNodeData {
  category: 'ai';
  model: 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro' | 'deepseek-r1';
  systemPrompt?: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  responseFormat?: 'text' | 'json';
  extractedVariables?: string[];
}

export interface LogicNodeData extends BaseNodeData {
  category: 'logic';
  logicType: 'condition' | 'router' | 'filter' | 'delay';
  conditionField?: string;
  operator?: 'equals' | 'contains' | 'greater_than' | 'regex';
  compareValue?: string;
  delaySeconds?: number;
}

export interface IntegrationNodeData extends BaseNodeData {
  category: 'integration';
  service: 'slack' | 'gmail' | 'google_sheets' | 'n8n' | 'make' | 'postgres' | 'github';
  action: string;
  credentialsId?: string;
  parameters: Record<string, unknown>;
}

export interface TransformNodeData extends BaseNodeData {
  category: 'transform';
  transformType: 'json_map' | 'js_code' | 'format_text' | 'aggregate';
  codeSnippet?: string;
  outputKey?: string;
}

export interface OutputNodeData extends BaseNodeData {
  category: 'output';
  outputType: 'webhook_response' | 'log' | 'storage_save' | 'dispatch_event';
  statusCode?: number;
  responseBodyTemplate?: string;
}

export type CustomNodeData = 
  | TriggerNodeData 
  | AINodeData 
  | LogicNodeData 
  | IntegrationNodeData 
  | TransformNodeData 
  | OutputNodeData;

export type FlowAINode = Node<CustomNodeData>;
export type FlowAIEdge = Edge;

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  createdAt: string;
  updatedAt: string;
  nodes: FlowAINode[];
  edges: FlowAIEdge[];
  tags: string[];
  executionCount: number;
  successRate: number;
  lastExecutionAt?: string;
  aiPromptOrigin?: string;
}
