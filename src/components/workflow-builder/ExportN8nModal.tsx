import React, { useState } from 'react';
import { X, Copy, Download, Check, Layers, ExternalLink, ShieldCheck, FileJson } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { N8nWorkflowAdapter } from '../../services/n8nAdapter';

export const ExportN8nModal: React.FC = () => {
  const { currentWorkflow, isN8nModalOpen, setIsN8nModalOpen } = useWorkflow();
  const [activeTab, setActiveTab] = useState<'n8n_json' | 'architecture'>('n8n_json');
  const [hasCopied, setHasCopied] = useState(false);

  if (!isN8nModalOpen) return null;

  const n8nExportData = N8nWorkflowAdapter.exportToN8n(currentWorkflow);
  const jsonString = JSON.stringify(n8nExportData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentWorkflow.name.toLowerCase().replace(/\s+/g, '-')}-n8n-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#111728] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FF6D5A]/15 border border-[#FF6D5A]/30 text-[#FF6D5A]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Export to n8n Workflow Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v1.2 Native Format
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready to paste or import into self-hosted n8n instances or n8n cloud
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsN8nModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-white/5 bg-[#0D1220]">
          <button
            onClick={() => setActiveTab('n8n_json')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'n8n_json'
                ? 'border-[#FF6D5A] text-slate-100'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            n8n Workflow JSON
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-slate-100'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Backend Sync Architecture
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'n8n_json' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Converted {n8nExportData.nodes.length} FlowAI nodes & {Object.keys(n8nExportData.connections).length} edge connections
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-all font-mono text-xs"
                  >
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6D5A] hover:bg-[#FF6D5A]/90 text-white font-medium transition-all text-xs shadow-lg shadow-[#FF6D5A]/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .json</span>
                  </button>
                </div>
              </div>

              {/* Code viewer */}
              <div className="relative rounded-xl bg-[#090D17] border border-white/10 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed">
                <pre>{jsonString}</pre>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-200">How to use in n8n:</div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono">1.</span>
                  <span>In your n8n canvas, click the three-dots menu <code className="text-slate-300">"..."</code> in the top right.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono">2.</span>
                  <span>Select <code className="text-slate-300">"Import from Clipboard"</code> (or <code className="text-slate-300">"Import from File"</code>).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono">3.</span>
                  <span>n8n will render the LangChain AI agent, Webhooks, and Slack/Sheets nodes with pre-wired coordinates!</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                <h4 className="font-semibold text-indigo-300 text-sm mb-1">
                  Enterprise Production Integration Architecture
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  FlowAI connects to self-hosted n8n instances and cloud backends without client-side credential exposure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#090D17] border border-white/5">
                  <div className="font-semibold text-slate-200 mb-1">1. Vault Credential Isolation</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    API keys for n8n, Slack, and OpenAI are stored in KMS/Vault encrypted tables. Nodes reference credential pointers (<code className="text-amber-400">flowai-vault-*</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090D17] border border-white/5">
                  <div className="font-semibold text-slate-200 mb-1">2. Bi-directional Webhooks</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Incoming webhooks trigger FlowAI execution workers, which forward structured payloads into n8n webhook listeners with HMAC-SHA256 headers.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090D17] border border-white/5">
                  <div className="font-semibold text-slate-200 mb-1">3. Automated Subworkflow Polling</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Long-running n8n scenarios report state back to FlowAI via WebSocket execution logs, maintaining unified telemetry in the Execution History tab.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090D17] border border-white/5">
                  <div className="font-semibold text-slate-200 mb-1">4. Zero-Faked Integrations Rule</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Integrations adhere to strict real-world configuration parameters. When backend is connected, actual TLS handshakes and OAuth PKCE exchanges are completed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
