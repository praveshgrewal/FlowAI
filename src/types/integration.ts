export type IntegrationCategory = 
  | 'workflow_engines' 
  | 'communication' 
  | 'productivity' 
  | 'ai_models' 
  | 'databases' 
  | 'developer_tools';

export type ConnectionStatus = 'connected' | 'available' | 'configured' | 'pending';

export interface IntegrationAuthField {
  id: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'select';
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: { label: string; value: string }[];
}

export interface IntegrationItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: IntegrationCategory;
  categoryLabel: string;
  icon: string;
  color: string;
  badge?: string;
  status: ConnectionStatus;
  connectedAt?: string;
  environment?: 'production' | 'staging' | 'sandbox';
  authType: 'api_key' | 'oauth2' | 'webhook_url' | 'self_hosted';
  fields: IntegrationAuthField[];
  architectureNote: string;
  backendConfig: {
    webhookReceiverEndpoint?: string;
    vaultKeyName?: string;
    n8nCompatible?: boolean;
    syncProtocol?: 'webhook' | 'polling' | 'event_stream';
  };
}
