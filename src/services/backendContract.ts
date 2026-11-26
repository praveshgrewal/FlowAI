/**
 * FlowAI Backend API Contract and Service Abstraction
 * 
 * In production, this module coordinates with:
 * 1. FlowAI Core API (Node.js/Go backend for DAG execution and persistence)
 * 2. HashiCorp Vault / AWS KMS (Secure credentials encryption for OAuth tokens & API keys)
 * 3. n8n Self-Hosted / Cloud Gateway (Bidirectional sync via n8n public REST API v1)
 * 4. Temporal / BullMQ / Celery (Distributed workflow execution engine)
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface BackendSyncConfig {
  backendBaseUrl: string;
  n8nInstanceUrl: string;
  n8nApiKeyConfigured: boolean;
  webhookGatewayUrl: string;
  environment: 'production' | 'staging' | 'development';
}

export const BACKEND_ARCHITECTURE_SPECS = {
  version: '2.4.0',
  endpoints: {
    workflows: {
      list: 'GET /api/v1/workflows',
      create: 'POST /api/v1/workflows',
      get: 'GET /api/v1/workflows/:id',
      update: 'PUT /api/v1/workflows/:id',
      delete: 'DELETE /api/v1/workflows/:id',
      triggerTest: 'POST /api/v1/workflows/:id/execute-test'
    },
    n8nSync: {
      testConnection: 'POST /api/v1/n8n/verify-connection',
      pushWorkflow: 'POST /api/v1/n8n/workflows/sync',
      pullWorkflows: 'GET /api/v1/n8n/workflows',
      webhookRelay: 'POST /api/v1/n8n/webhooks/relay'
    },
    integrations: {
      listAvailable: 'GET /api/v1/integrations',
      saveCredentials: 'POST /api/v1/integrations/:id/credentials', // Vault encrypted
      testCredentials: 'POST /api/v1/integrations/:id/test'
    },
    executions: {
      list: 'GET /api/v1/executions',
      getTrace: 'GET /api/v1/executions/:id/trace',
      cancel: 'POST /api/v1/executions/:id/cancel'
    }
  },
  securityArchitecture: {
    credentialsStorage: 'Encrypted at rest using AES-256-GCM via KMS / Vault with per-tenant encryption keys.',
    webhookVerification: 'HMAC-SHA256 signature verification on all incoming webhook triggers.',
    n8nAuthentication: 'Scoped n8n API tokens stored in server-side session cookies or vaulted secret store.',
    rateLimiting: 'Distributed token bucket algorithm (1,000 req/min per tenant).'
  }
};
