import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  Check, 
  Key, 
  Lock, 
  AlertCircle, 
  Terminal,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { IntegrationItem } from '../../types/integration';
import { useWorkflow } from '../../context/WorkflowContext';

interface IntegrationModalProps {
  integration: IntegrationItem | null;
  onClose: () => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({ integration, onClose }) => {
  const { updateIntegrationStatus } = useWorkflow();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!integration) return null;

  const handleInputChange = (fieldId: string, val: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    // Simulate architecture validation
    await new Promise((r) => setTimeout(r, 600));

    updateIntegrationStatus(integration.id, 'connected');
    setIsSaving(false);
    setStatusMessage('Configuration saved. Credentials registered for secure backend vaulting.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#111728] border border-white/10 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-white shadow-lg"
              style={{ backgroundColor: `${integration.color}25`, borderColor: `${integration.color}50` }}
            >
              <span style={{ color: integration.color }}>{integration.name.slice(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Configure {integration.name}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {integration.authType.toUpperCase()}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{integration.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Architecture Callout */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-indigo-300">Backend & Vault Security Architecture</div>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                {integration.architectureNote}
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveConnection} className="space-y-3.5">
            {integration.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="">Select option...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono placeholder:text-slate-600"
                  />
                )}

                {field.helpText && (
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {field.helpText}
                  </span>
                )}
              </div>
            ))}

            {statusMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>KMS AES-256 encrypted</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating Schema...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Activate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
