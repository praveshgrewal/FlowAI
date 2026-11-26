import React from 'react';
import { X, Trash2, Sliders, Play, Code, CheckCircle, Database } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

export const NodeInspector: React.FC = () => {
  const { currentWorkflow, selectedNodeId, setSelectedNodeId, updateNodeData, deleteSelectedNode } = useWorkflow();

  const selectedNode = currentWorkflow.nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const data = selectedNode.data as any;

  return (
    <div className="w-88 w-[360px] h-full bg-[#111728]/95 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl animate-fade-in z-20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Node Inspector</h3>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {data.category} • {selectedNode.id}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSelectedNodeId(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Configuration Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label Field */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Node Label
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={data.description || ''}
            onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
            className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* AI SPECIFIC CONFIG */}
        {data.category === 'ai' && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              LLM Model Parameters
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Foundation Model
              </label>
              <select
                value={data.model || 'claude-3-5-sonnet'}
                onChange={(e) => updateNodeData(selectedNode.id, { model: e.target.value as any })}
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="gpt-4o">GPT-4o (Omni)</option>
                <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
                <option value="deepseek-r1">DeepSeek-R1 (Reasoning)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Temperature</label>
                <span className="text-xs font-mono text-amber-400">{data.temperature ?? 0.2}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={data.temperature ?? 0.2}
                onChange={(e) => updateNodeData(selectedNode.id, { temperature: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                System Instructions
              </label>
              <textarea
                rows={3}
                value={data.systemPrompt || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { systemPrompt: e.target.value })}
                placeholder="Persona and operational constraints..."
                className="w-full bg-[#090D17] border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                User Prompt Template
              </label>
              <textarea
                rows={4}
                value={data.userPrompt || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { userPrompt: e.target.value })}
                placeholder="Prompt text... use {{ $json.field }} for dynamic payload injection"
                className="w-full bg-[#090D17] border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Supports mustache variable interpolation, e.g. <code className="text-indigo-400">{'{{ $json.body }}'}</code>
              </span>
            </div>
          </div>
        )}

        {/* TRIGGER SPECIFIC CONFIG */}
        {data.category === 'trigger' && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Trigger Specifications
            </div>

            {data.triggerType === 'webhook' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Webhook Endpoint Path
                </label>
                <div className="flex items-center bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300">
                  <span className="text-slate-500 mr-1">/api/v1/</span>
                  <input
                    type="text"
                    value={data.config?.webhookPath || ''}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        config: { ...data.config, webhookPath: e.target.value }
                      })
                    }
                    className="bg-transparent focus:outline-none w-full text-indigo-300"
                  />
                </div>
              </div>
            )}

            {data.triggerType === 'schedule' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cron Expression (UTC)
                </label>
                <input
                  type="text"
                  value={data.config?.cronExpression || '0 9 * * *'}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, cronExpression: e.target.value }
                    })
                  }
                  className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {data.triggerType === 'gmail_event' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gmail Search Filter
                </label>
                <input
                  type="text"
                  value={data.config?.emailFilter || 'is:unread'}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      config: { ...data.config, emailFilter: e.target.value }
                    })
                  }
                  className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* LOGIC SPECIFIC CONFIG */}
        {data.category === 'logic' && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Branching Condition
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                JSON Property Field
              </label>
              <input
                type="text"
                value={data.conditionField || 'status'}
                onChange={(e) => updateNodeData(selectedNode.id, { conditionField: e.target.value })}
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Evaluation Operator
              </label>
              <select
                value={data.operator || 'equals'}
                onChange={(e) => updateNodeData(selectedNode.id, { operator: e.target.value as any })}
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              >
                <option value="equals">equals (==)</option>
                <option value="contains">contains</option>
                <option value="greater_than">greater than (&gt;)</option>
                <option value="regex">matches regex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Compare Target Value
              </label>
              <input
                type="text"
                value={data.compareValue || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { compareValue: e.target.value })}
                className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* INTEGRATION SPECIFIC CONFIG */}
        {data.category === 'integration' && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {data.service?.toUpperCase()} Parameters
            </div>

            {data.service === 'slack' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Channel Target
                  </label>
                  <input
                    type="text"
                    value={data.parameters?.channel || '#general'}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        parameters: { ...data.parameters, channel: e.target.value }
                      })
                    }
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Message Template
                  </label>
                  <textarea
                    rows={3}
                    value={data.parameters?.message || ''}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        parameters: { ...data.parameters, message: e.target.value }
                      })
                    }
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </>
            )}

            {data.service === 'n8n' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    n8n Webhook / Scenario URL
                  </label>
                  <input
                    type="text"
                    value={data.parameters?.webhookUrl || 'https://n8n.your-domain.com/webhook/...'}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        parameters: { ...data.parameters, webhookUrl: e.target.value }
                      })
                    }
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Scenario Identifier
                  </label>
                  <input
                    type="text"
                    value={data.parameters?.scenarioId || 'crm-sync-v1'}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        parameters: { ...data.parameters, scenarioId: e.target.value }
                      })
                    }
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {data.service === 'google_sheets' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Spreadsheet ID
                  </label>
                  <input
                    type="text"
                    value={data.parameters?.spreadsheetId || ''}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        parameters: { ...data.parameters, spreadsheetId: e.target.value }
                      })
                    }
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Sheet Name
                  </label>
                  <input
                    type="text"
                    value={data.parameters?.sheetName || 'Sheet1'}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        parameters: { ...data.parameters, sheetName: e.target.value }
                      })
                    }
                    className="w-full bg-[#090D17] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Last Output Trace if executed */}
        {data.lastOutput && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
              <span>Last Execution Output</span>
              {data.executionTime && <span className="font-mono text-[10px]">{data.executionTime}ms</span>}
            </div>
            <pre className="p-2.5 bg-black/60 border border-white/5 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-36">
              {JSON.stringify(data.lastOutput, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
        <button
          onClick={deleteSelectedNode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>

        <span className="text-[10px] text-slate-500 font-mono">
          Auto-saved
        </span>
      </div>
    </div>
  );
};
