import { FlowAINode, FlowAIEdge } from './workflow';

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: 'AI Agents' | 'Sales & Marketing' | 'Customer Support' | 'DevOps & Engineering' | 'Data & Automation';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  estimatedRuntime: string;
  author: string;
  iconName: string;
  color: string;
  integrationsUsed: string[];
  nodes: FlowAINode[];
  edges: FlowAIEdge[];
}
