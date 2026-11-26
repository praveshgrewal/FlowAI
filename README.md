# FlowAI — Autonomous AI Workflow Builder

FlowAI is a modern, responsive SaaS platform for designing, testing, and orchestrating autonomous AI workflows and multi-step data pipelines.

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **@xyflow/react** (React Flow v12).

---

## 🚀 Key Features

### 1. Modern SaaS Dashboard & Telemetry
- **Key Metrics**: Real-time stats on total executions, active workflows in production, success rate (99.4%), average latency, and cached LLM token savings.
- **Recent Activity Stream**: Live feed with trigger source (Gmail, Webhook, Cron, GitHub), execution latency, and 1-click execution trace inspection modal.
- **Quick Workflow Launchpad**: Inline natural language prompt bar to generate pipelines immediately.

### 2. Autonomous AI Workflow Builder
- **Large AI Prompt Synthesizer**: `"Describe what you want to automate..."` with pre-configured prompt pills for customer support, lead enrichment, executive briefings, and DevOps bug triaging.
- **Model Selector**: Switch between Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro, and DeepSeek-R1.
- **Visual Node Canvas**: Built with `@xyflow/react` featuring custom nodes, smooth edge curves, zoom/pan controls, and responsive minimap:
  - **Trigger Node**: Webhook HTTP POST, Cron Schedule, Gmail Inbox Event, Slack Mentions.
  - **AI Reasoning Node**: Model pill, temperature slider, prompt template interpolation with `{{ $json.field }}`.
  - **Logic & Branch Node**: Dual branch handles (`TRUE` and `FALSE`) with operator evaluation (`equals`, `contains`, `greater_than`, `regex`).
  - **Integration Node**: Native cards for **n8n**, **Make**, **Gmail**, **Google Sheets**, and **Slack**.
  - **Transform Node**: JSON/JavaScript mapper.
  - **Output Node**: Status code and webhook response dispatch.
- **Node Inspector Drawer**: Slide-out configuration panel to customize node parameters, prompts, and webhook routes.
- **Interactive Test Run Simulator**: Sequential execution animation where nodes glow green as each simulated step runs with real-time output payload generation.
- **Export to n8n**: Generates native n8n-compatible JSON format ready to paste into self-hosted or cloud n8n instances.

### 3. Enterprise Integrations Hub
- Dedicated page showcasing **n8n**, **Make**, **Gmail**, **Google Sheets**, and **Slack** (plus OpenAI, Anthropic, PostgreSQL, and GitHub).
- Real configuration parameters (API keys, instance URLs, webhook paths, OAuth scopes).
- Strict adherence to real-world integration architecture: credentials are vaulted with KMS encryption and forwarded through authenticated reverse proxies.

### 4. Workflow Lifecycle & Templates
- **My Workflows**: Filterable grid and table with status toggles (Active, Paused, Draft), execution counters, and instant canvas editing.
- **Curated Templates**: Pre-built production pipelines across AI Agents, Sales & Marketing, Customer Support, DevOps, and Data & Automation.
- **Execution History**: Detailed log audit trail with expandable JSON payloads and duration analysis.

---

## 🛠️ Architecture & Directory Structure

```
src/
├── types/
│   ├── workflow.ts          # FlowAI node types, edges, and trigger/action interfaces
│   ├── integration.ts       # Integration specs and KMS vault metadata
│   ├── execution.ts         # Execution logs and step telemetry
│   └── templates.ts         # Pre-built template data types
├── context/
│   └── WorkflowContext.tsx  # Central state management (current workflow, nodes, test simulation)
├── services/
│   ├── n8nAdapter.ts        # FlowAI DAG to n8n native JSON schema translator
│   ├── aiWorkflowGenerator.ts # Natural language prompt parser & DAG synthesizer
│   └── backendContract.ts   # Backend API specification & security architecture
├── data/
│   ├── mockIntegrations.ts  # n8n, Make, Gmail, Google Sheets, Slack, etc.
│   ├── mockWorkflows.ts     # Realistic multi-step pipelines
│   ├── mockExecutions.ts    # Execution traces and telemetry
│   ├── mockTemplates.ts     # Production templates
│   └── mockStats.ts         # Dashboard analytics
└── components/
    ├── layout/              # Responsive Sidebar, Topbar, and Shell
    ├── dashboard/           # Dashboard telemetry & recent activity
    ├── workflow-builder/    # Visual Canvas, AIPromptBar, NodeInspector, ExportN8nModal
    │   └── nodes/           # Custom Trigger, AI, Logic, Integration, Transform, Output nodes
    ├── my-workflows/        # Workflow list and search
    ├── templates/           # Pre-built template library
    ├── integrations/        # Integrations hub & configuration modals
    ├── execution-history/   # Execution logs and JSON trace viewer
    └── settings/            # Workspace, n8n sync, and model defaults
```

---

## 🔌 n8n Engine Sync Specifications

FlowAI graphs export directly to n8n workflow schemas:
- Triggers compile to `n8n-nodes-base.webhook` or `n8n-nodes-base.cron`.
- AI Nodes compile to `@n8n/n8n-nodes-langchain.agent`.
- Slack, Gmail, and Google Sheets compile to their respective native n8n nodes.
- Logic nodes compile to `n8n-nodes-base.if` with true/false connection arrays.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run TypeScript compilation & build
npm run build
```
