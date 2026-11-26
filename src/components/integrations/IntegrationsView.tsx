import React, { useState } from 'react';
import { 
  Puzzle, 
  Search, 
  Check, 
  Settings2, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Zap,
  Mail,
  FileSpreadsheet,
  MessageSquare,
  Shuffle,
  Database,
  Cpu,
  GitPullRequest
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { IntegrationItem, IntegrationCategory } from '../../types/integration';
import { IntegrationModal } from './IntegrationModal';

export const IntegrationsView: React.FC = () => {
  const { integrations } = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<IntegrationItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'workflow_engines', label: 'Workflow Engines (n8n & Make)' },
    { id: 'communication', label: 'Communication (Gmail & Slack)' },
    { id: 'productivity', label: 'Productivity (Google Sheets)' },
    { id: 'ai_models', label: 'AI & Models' },
    { id: 'databases', label: 'Databases & Tools' }
  ];

  const filteredIntegrations = integrations.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getIntegrationIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" style={{ color }} />;
      case 'Shuffle': return <Shuffle className="w-5 h-5" style={{ color }} />;
      case 'Mail': return <Mail className="w-5 h-5" style={{ color }} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5" style={{ color }} />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" style={{ color }} />;
      case 'Database': return <Database className="w-5 h-5" style={{ color }} />;
      case 'GitPullRequest': return <GitPullRequest className="w-5 h-5" style={{ color }} />;
      case 'Cpu': return <Cpu className="w-5 h-5" style={{ color }} />;
      default: return <Zap className="w-5 h-5" style={{ color }} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#111728] via-[#141C33] to-[#111728] border border-white/10 p-6 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Connected Ecosystem
              </span>
              <span className="text-xs text-slate-400 font-mono">
                n8n • Make • Gmail • Google Sheets • Slack
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">
              Enterprise Integrations Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Connect FlowAI with external services, self-hosted workflow engines, messaging channels, and spreadsheets. Credentials are securely vaulted using KMS-encrypted schemas.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 font-mono space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>n8n Engine: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Vault KMS: Operational</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations (e.g. n8n, Make, Gmail, Slack, Sheets)..."
              className="w-full bg-[#090D17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-[#111728]/90 border border-white/10 p-5 shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Top: Icon & Status */}
              <div className="flex items-start justify-between">
                <div
                  className="p-3 rounded-xl border group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: `${item.color}15`,
                    borderColor: `${item.color}35`
                  }}
                >
                  {getIntegrationIcon(item.icon, item.color)}
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.badge}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      item.status === 'connected'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'configured'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="mt-3.5">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Architecture specs pill */}
              <div className="mt-3.5 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Auth: {item.authType}</span>
                {item.connectedAt && (
                  <span className="text-emerald-400">Synced {item.connectedAt}</span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                {item.categoryLabel}
              </span>

              <button
                onClick={() => setActiveModalItem(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 hover:border-indigo-500/40 transition-all"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{item.status === 'connected' ? 'Configure' : 'Connect'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {activeModalItem && (
        <IntegrationModal
          integration={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </div>
  );
};
