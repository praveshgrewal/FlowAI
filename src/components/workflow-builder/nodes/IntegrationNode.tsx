import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers, MessageSquare, Mail, FileSpreadsheet, Shuffle, Database, GitPullRequest } from 'lucide-react';
import { IntegrationNodeData } from '../../../types/workflow';
import { useWorkflow } from '../../../context/WorkflowContext';

interface IntegrationNodeProps {
  id: string;
  data: IntegrationNodeData;
  selected?: boolean;
}

export const IntegrationNode: React.FC<IntegrationNodeProps> = ({ id, data, selected }) => {
  const { selectedNodeId, setSelectedNodeId } = useWorkflow();
  const isSelected = selected || selectedNodeId === id;

  const getServiceConfig = () => {
    switch (data.service) {
      case 'n8n':
        return {
          name: 'n8n Workflow',
          color: 'text-[#FF6D5A]',
          bg: 'bg-[#FF6D5A]/10 border-[#FF6D5A]/30',
          icon: <Layers className="w-4 h-4 text-[#FF6D5A]" />
        };
      case 'slack':
        return {
          name: 'Slack',
          color: 'text-[#E01E5A]',
          bg: 'bg-[#4A154B]/20 border-[#E01E5A]/30',
          icon: <MessageSquare className="w-4 h-4 text-[#ECB22E]" />
        };
      case 'gmail':
        return {
          name: 'Gmail',
          color: 'text-[#EA4335]',
          bg: 'bg-[#EA4335]/10 border-[#EA4335]/30',
          icon: <Mail className="w-4 h-4 text-[#EA4335]" />
        };
      case 'google_sheets':
        return {
          name: 'Google Sheets',
          color: 'text-[#0F9D58]',
          bg: 'bg-[#0F9D58]/10 border-[#0F9D58]/30',
          icon: <FileSpreadsheet className="w-4 h-4 text-[#0F9D58]" />
        };
      case 'make':
        return {
          name: 'Make',
          color: 'text-[#6F3FF5]',
          bg: 'bg-[#6F3FF5]/10 border-[#6F3FF5]/30',
          icon: <Shuffle className="w-4 h-4 text-[#6F3FF5]" />
        };
      case 'postgres':
        return {
          name: 'PostgreSQL',
          color: 'text-[#336791]',
          bg: 'bg-[#336791]/10 border-[#336791]/30',
          icon: <Database className="w-4 h-4 text-[#336791]" />
        };
      case 'github':
        return {
          name: 'GitHub',
          color: 'text-slate-200',
          bg: 'bg-white/10 border-white/20',
          icon: <GitPullRequest className="w-4 h-4 text-slate-200" />
        };
      default:
        return {
          name: data.service,
          color: 'text-indigo-400',
          bg: 'bg-indigo-500/10 border-indigo-500/30',
          icon: <Layers className="w-4 h-4 text-indigo-400" />
        };
    }
  };

  const service = getServiceConfig();

  const getStatusBorder = () => {
    if (data.status === 'running') return 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] ring-2 ring-indigo-500/50 animate-pulse';
    if (data.status === 'success') return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (isSelected) return 'border-indigo-500/80 ring-2 ring-indigo-500/30';
    return 'border-white/10 hover:border-white/20';
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-76 rounded-xl bg-[#111728]/95 backdrop-blur-md border ${getStatusBorder()} transition-all duration-200 shadow-xl cursor-pointer select-none group`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />

      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${service.bg}`}>
            {service.icon}
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              Integration
            </span>
            <div className={`text-[11px] font-medium ${service.color}`}>
              {service.name}
            </div>
          </div>
        </div>

        {data.status === 'success' && (
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {data.executionTime ? `${data.executionTime}ms` : 'Sent'}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
          {data.label}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {data.description || data.action}
        </p>

        {data.parameters?.channel ? (
          <div className="mt-2 px-2 py-1 bg-black/40 border border-white/5 rounded text-[11px] font-mono text-slate-300">
            Channel: <span className="text-indigo-400">{String(data.parameters.channel)}</span>
          </div>
        ) : null}

        {data.parameters?.sheetName ? (
          <div className="mt-2 px-2 py-1 bg-black/40 border border-white/5 rounded text-[11px] font-mono text-slate-300">
            Sheet: <span className="text-emerald-400">{String(data.parameters.sheetName)}</span>
          </div>
        ) : null}

        {data.parameters?.scenarioId ? (
          <div className="mt-2 px-2 py-1 bg-black/40 border border-white/5 rounded text-[11px] font-mono text-slate-300 truncate">
            Scenario: <span className="text-amber-400">{String(data.parameters.scenarioId)}</span>
          </div>
        ) : null}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};
