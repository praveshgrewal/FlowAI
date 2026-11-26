import React from 'react';
import { 
  Plus, 
  Zap, 
  Sparkles, 
  GitFork, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MessageSquare, 
  FileSpreadsheet, 
  Shuffle 
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

export const NodePalette: React.FC = () => {
  const { addNodeToCanvas } = useWorkflow();

  const paletteGroups = [
    {
      group: 'Triggers',
      items: [
        { label: 'Webhook', category: 'trigger', subType: 'webhook', icon: <Zap className="w-3.5 h-3.5 text-indigo-400" /> },
        { label: 'Cron / Schedule', category: 'trigger', subType: 'schedule', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
        { label: 'Gmail Event', category: 'trigger', subType: 'gmail_event', icon: <Mail className="w-3.5 h-3.5 text-red-400" /> },
        { label: 'Slack Mention', category: 'trigger', subType: 'slack_event', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> }
      ]
    },
    {
      group: 'AI & Models',
      items: [
        { label: 'Claude 3.5 Sonnet', category: 'ai', subType: 'claude', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
        { label: 'GPT-4o (Omni)', category: 'ai', subType: 'gpt', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: 'Gemini 1.5 Pro', category: 'ai', subType: 'gemini', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> }
      ]
    },
    {
      group: 'Logic & Flow',
      items: [
        { label: 'If / Else Branch', category: 'logic', subType: 'condition', icon: <GitFork className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: 'JSON Transform', category: 'transform', subType: 'transform', icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" /> }
      ]
    },
    {
      group: 'Integrations',
      items: [
        { label: 'n8n Subworkflow', category: 'integration', subType: 'n8n', icon: <Layers className="w-3.5 h-3.5 text-[#FF6D5A]" /> },
        { label: 'Slack Alert', category: 'integration', subType: 'slack', icon: <MessageSquare className="w-3.5 h-3.5 text-[#ECB22E]" /> },
        { label: 'Google Sheets', category: 'integration', subType: 'google_sheets', icon: <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F9D58]" /> },
        { label: 'Make Scenario', category: 'integration', subType: 'make', icon: <Shuffle className="w-3.5 h-3.5 text-[#6F3FF5]" /> }
      ]
    },
    {
      group: 'Output',
      items: [
        { label: 'Webhook Response', category: 'output', subType: 'response', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> }
      ]
    }
  ];

  return (
    <div className="bg-[#111728]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1 flex items-center justify-between">
        <span>Node Library</span>
        <span className="text-[10px] text-slate-500 font-normal">Click to insert</span>
      </div>

      <div className="space-y-3">
        {paletteGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="text-[10px] font-medium text-slate-500 mb-1.5 px-1">
              {group.group}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  onClick={() => addNodeToCanvas(item.category, item.subType)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-indigo-500/30 text-left transition-all group"
                >
                  <div className="p-1 rounded bg-black/40 border border-white/5 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white font-medium truncate">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
