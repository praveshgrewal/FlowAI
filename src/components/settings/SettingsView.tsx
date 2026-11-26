import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  Layers, 
  Cpu, 
  Save, 
  Check, 
  Server, 
  BellRing, 
  Users 
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

export const SettingsView: React.FC = () => {
  const [hasSaved, setHasSaved] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('Acme Corporation');
  const [defaultModel, setDefaultModel] = useState('claude-3-5-sonnet');
  const [n8nUrl, setN8nUrl] = useState('https://n8n.internal.acme.corp');
  const [concurrencyLimit, setConcurrencyLimit] = useState('50');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Settings & Backend Architecture
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure FlowAI workspace parameters, n8n webhook sync, and AI model defaults
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Configuration */}
        <div className="rounded-2xl bg-[#111728] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <Server className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Workspace Environment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Deployment Region
              </label>
              <select className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
              </select>
            </div>
          </div>
        </div>

        {/* n8n Integration & Webhook Sync Gateway */}
        <div className="rounded-2xl bg-[#111728] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <Layers className="w-4 h-4 text-[#FF6D5A]" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                n8n Workflow Engine Sync
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready for Production
                </span>
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                n8n Instance URL (Self-Hosted or Cloud)
              </label>
              <input
                type="url"
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                placeholder="https://n8n.yourcompany.com"
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                FlowAI pushes synthesized visual workflows to this endpoint using the n8n REST API.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Webhook Concurrency Limit
                </label>
                <input
                  type="number"
                  value={concurrencyLimit}
                  onChange={(e) => setConcurrencyLimit(e.target.value)}
                  className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  HMAC Webhook Signature
                </label>
                <input
                  type="password"
                  value="flowai_secret_hmac_sha256_xxxx"
                  disabled
                  className="w-full bg-[#090D17]/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Defaults */}
        <div className="rounded-2xl bg-[#111728] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Default AI Reasoning Engine
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Primary Foundation Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Recommended)</option>
                <option value="gpt-4o">GPT-4o (Omni)</option>
                <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
                <option value="deepseek-r1">DeepSeek-R1 (Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Vault Credentials Key
              </label>
              <div className="p-2 bg-[#090D17] border border-white/10 rounded-lg text-xs font-mono text-emerald-400">
                vault-kms-managed-keys (Active)
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {hasSaved ? (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Settings successfully persisted.
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-mono">
              Auto-sync enabled for production cluster
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
