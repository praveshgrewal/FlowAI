import { IntegrationItem } from '../types/integration';

export const MOCK_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'n8n',
    name: 'n8n Workflow Engine',
    tagline: 'Self-hosted & cloud workflow automation engine',
    description: 'Bi-directionally sync FlowAI node pipelines directly with your self-hosted or cloud n8n instance. Execute complex sub-scenarios and trigger n8n webhooks seamlessly.',
    category: 'workflow_engines',
    categoryLabel: 'Workflow Engines',
    icon: 'Layers',
    color: '#FF6D5A',
    badge: 'Core Engine',
    status: 'connected',
    connectedAt: '2 days ago',
    environment: 'production',
    authType: 'self_hosted',
    fields: [
      {
        id: 'instanceUrl',
        label: 'n8n Instance URL',
        type: 'url',
        placeholder: 'https://n8n.your-company.com',
        required: true,
        helpText: 'The root URL where your n8n server is hosted.'
      },
      {
        id: 'apiKey',
        label: 'n8n API Key',
        type: 'password',
        placeholder: 'n8n_api_key_xxxxxxxxxxxx',
        required: true,
        helpText: 'Generated in your n8n instance under Settings > API.'
      },
      {
        id: 'webhookPrefix',
        label: 'Webhook Base Path',
        type: 'text',
        placeholder: 'webhook / webhook-test',
        required: false,
        helpText: 'Custom webhook prefix if running behind a reverse proxy.'
      }
    ],
    architectureNote: 'FlowAI compiles DAG visual nodes into n8n JSON schemas. Authenticated requests are forwarded through a secure reverse proxy to your n8n instance API without exposing keys to clients.',
    backendConfig: {
      n8nCompatible: true,
      syncProtocol: 'webhook',
      vaultKeyName: 'vault_n8n_prod_creds'
    }
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    tagline: 'Visual platform to design, build, and automate workflows',
    description: 'Trigger Make scenarios from FlowAI nodes or ingest webhook payloads from Make modules for complex multi-app data routing.',
    category: 'workflow_engines',
    categoryLabel: 'Workflow Engines',
    icon: 'Shuffle',
    color: '#6F3FF5',
    badge: 'Popular',
    status: 'available',
    environment: 'production',
    authType: 'api_key',
    fields: [
      {
        id: 'apiToken',
        label: 'Make API Token',
        type: 'password',
        placeholder: 'mk_live_xxxxxxxxxxxxxxxx',
        required: true,
        helpText: 'Obtain from Make Account Settings > API Access.'
      },
      {
        id: 'organizationId',
        label: 'Organization ID',
        type: 'text',
        placeholder: 'org_12345',
        required: true,
        helpText: 'Your numerical or slug identifier on Make.'
      },
      {
        id: 'environmentZone',
        label: 'Hosting Zone',
        type: 'select',
        required: true,
        options: [
          { label: 'EU1 (make.com)', value: 'eu1' },
          { label: 'US1 (us1.make.com)', value: 'us1' },
          { label: 'EU2 (eu2.make.com)', value: 'eu2' }
        ]
      }
    ],
    architectureNote: 'In production, FlowAI registers scenario triggers and forwards event bodies via encrypted HTTPS webhooks signed with HMAC.',
    backendConfig: {
      syncProtocol: 'webhook',
      vaultKeyName: 'vault_make_creds'
    }
  },
  {
    id: 'gmail',
    name: 'Gmail & Google Workspace',
    tagline: 'Google mail triggers, automated drafts, and digest broadcasting',
    description: 'Monitor inbound inbox threads, parse customer requests, trigger auto-draft responses, or send automated executive briefings.',
    category: 'communication',
    categoryLabel: 'Communication',
    icon: 'Mail',
    color: '#EA4335',
    badge: 'Google Verified',
    status: 'connected',
    connectedAt: '1 week ago',
    environment: 'production',
    authType: 'oauth2',
    fields: [
      {
        id: 'monitoredLabels',
        label: 'Monitored Label / Query',
        type: 'text',
        placeholder: 'label:inbox is:unread',
        required: true,
        helpText: 'Gmail search query used for polling or Push Pub/Sub topic.'
      },
      {
        id: 'sendAsEmail',
        label: 'Default Send-As Alias',
        type: 'text',
        placeholder: 'support-ai@company.com',
        required: false,
        helpText: 'Configured Google Workspace alias.'
      }
    ],
    architectureNote: 'Integrated via Google Cloud Pub/Sub push notifications for real-time zero-polling triggers. Access tokens are refreshed via OAuth2 PKCE backend cycle.',
    backendConfig: {
      syncProtocol: 'event_stream',
      vaultKeyName: 'vault_gsuite_oauth'
    }
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    tagline: 'Cloud spreadsheet append, row lookup, and batch updating',
    description: 'Read or append structured AI results directly to Google Sheets tables. Perfect for leads CRM logging, survey sentiment records, and financial summaries.',
    category: 'productivity',
    categoryLabel: 'Productivity',
    icon: 'FileSpreadsheet',
    color: '#0F9D58',
    status: 'connected',
    connectedAt: '3 weeks ago',
    environment: 'production',
    authType: 'oauth2',
    fields: [
      {
        id: 'defaultSpreadsheetId',
        label: 'Default Spreadsheet ID',
        type: 'text',
        placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        required: false,
        helpText: 'The alphanumeric ID found in the Google Sheets document URL.'
      },
      {
        id: 'serviceAccountEmail',
        label: 'Service Account Delegate',
        type: 'text',
        placeholder: 'flowai-worker@gcp-project.iam.gserviceaccount.com',
        required: false,
        helpText: 'Share your sheet with this email for server-to-server writes.'
      }
    ],
    architectureNote: 'High-throughput updates use Google Sheets v4 BatchUpdate API with auto-throttling and backoff to respect Google 60 requests/minute quota.',
    backendConfig: {
      syncProtocol: 'polling',
      vaultKeyName: 'vault_gsheets_service_creds'
    }
  },
  {
    id: 'slack',
    name: 'Slack',
    tagline: 'Interactive channel alerts, bot interactions, and mentions',
    description: 'Send AI-generated markdown blocks, interactive approval buttons, alerts to specific sales/dev channels, and listen to @FlowAI bot mentions.',
    category: 'communication',
    categoryLabel: 'Communication',
    icon: 'MessageSquare',
    color: '#4A154B',
    badge: 'Enterprise Bot',
    status: 'connected',
    connectedAt: 'Yesterday',
    environment: 'production',
    authType: 'oauth2',
    fields: [
      {
        id: 'defaultChannel',
        label: 'Default Broadcast Channel',
        type: 'text',
        placeholder: '#general or #engineering-alerts',
        required: true,
        helpText: 'Channel name or C01234567 channel ID.'
      },
      {
        id: 'botDisplayName',
        label: 'Bot Display Name',
        type: 'text',
        placeholder: 'FlowAI Assistant',
        required: false,
        helpText: 'Customized avatar and sender name in Slack.'
      }
    ],
    architectureNote: 'Powered by Slack Events API with verification token checks and socket-mode connection support for firewall-protected enterprise workspaces.',
    backendConfig: {
      syncProtocol: 'event_stream',
      vaultKeyName: 'vault_slack_bot_token'
    }
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o & o1)',
    tagline: 'State-of-the-art multimodal and reasoning models',
    description: 'Power your AI workflow nodes with GPT-4o, GPT-4o-mini, o1-preview, and text embeddings for classification, generation, and extraction.',
    category: 'ai_models',
    categoryLabel: 'AI & Models',
    icon: 'Sparkles',
    color: '#10A37F',
    badge: 'Native Provider',
    status: 'connected',
    connectedAt: '1 month ago',
    environment: 'production',
    authType: 'api_key',
    fields: [
      {
        id: 'apiKey',
        label: 'OpenAI Secret Key',
        type: 'password',
        placeholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxx',
        required: true,
        helpText: 'Generated from platform.openai.com/api-keys'
      },
      {
        id: 'organizationId',
        label: 'Organization ID (Optional)',
        type: 'text',
        placeholder: 'org-xxxxxxxxxx',
        required: false
      }
    ],
    architectureNote: 'Direct streaming API integration supporting structured JSON schema outputs and tool-calling execution primitives.',
    backendConfig: {
      vaultKeyName: 'vault_openai_master'
    }
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    tagline: 'Claude 3.5 Sonnet & Haiku with 200k context windows',
    description: 'Use Claude 3.5 Sonnet for nuanced document analysis, long-context reasoning, code review workflows, and complex decision trees.',
    category: 'ai_models',
    categoryLabel: 'AI & Models',
    icon: 'Cpu',
    color: '#D97706',
    badge: 'Popular for Logic',
    status: 'connected',
    connectedAt: '2 weeks ago',
    environment: 'production',
    authType: 'api_key',
    fields: [
      {
        id: 'apiKey',
        label: 'Anthropic API Key',
        type: 'password',
        placeholder: 'sk-ant-api03-xxxxxxxxxxxxxxxx',
        required: true
      }
    ],
    architectureNote: 'High-speed inference via Anthropic Messages API with strict temperature enforcement and prompt caching support.',
    backendConfig: {
      vaultKeyName: 'vault_anthropic_prod'
    }
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    tagline: 'Direct SQL queries, data mutation, and CDC change events',
    description: 'Run parameterized SQL queries, listen to WAL replication events, or insert transformed AI data straight into transactional tables.',
    category: 'databases',
    categoryLabel: 'Databases & Storage',
    icon: 'Database',
    color: '#336791',
    status: 'available',
    environment: 'production',
    authType: 'api_key',
    fields: [
      {
        id: 'connectionUri',
        label: 'PostgreSQL Connection URI',
        type: 'password',
        placeholder: 'postgresql://user:password@db.supabase.co:5432/postgres?sslmode=require',
        required: true,
        helpText: 'Standard PostgreSQL connection string with SSL enabled.'
      },
      {
        id: 'poolSize',
        label: 'Connection Pool Max',
        type: 'text',
        placeholder: '10',
        required: false
      }
    ],
    architectureNote: 'Queries execute inside isolated network sandboxes with prepared statement parameterization to guard against SQL injection.',
    backendConfig: {
      vaultKeyName: 'vault_postgres_primary'
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    tagline: 'Repository webhooks, PR automation, and issue triaging',
    description: 'Automate code reviews, detect security vulnerabilities in pull requests, and orchestrate release changelog summaries.',
    category: 'developer_tools',
    categoryLabel: 'Developer Tools',
    icon: 'GitPullRequest',
    color: '#24292E',
    status: 'configured',
    connectedAt: '3 days ago',
    environment: 'production',
    authType: 'oauth2',
    fields: [
      {
        id: 'repositories',
        label: 'Target Repositories',
        type: 'text',
        placeholder: 'acme-corp/core-api, acme-corp/web-app',
        required: true,
        helpText: 'Comma-separated list of monitored repositories.'
      }
    ],
    architectureNote: 'Installed via GitHub App with fine-grained read/write permissions for issues and pull requests.',
    backendConfig: {
      syncProtocol: 'webhook',
      vaultKeyName: 'vault_github_app'
    }
  }
];
