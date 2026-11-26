import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Clock, Mail, MessageSquare, Terminal } from 'lucide-react';
import { TriggerNodeData } from '../../../types/workflow';
import { useWorkflow } from '../../../context/WorkflowContext';

interface TriggerNodeProps {
  id: string;
  data: TriggerNodeData;
  selected?: boolean;
}

export const TriggerNode: React.FC<TriggerNodeProps> = ({ id, data, selected }) => {
  const { selectedNodeId, setSelectedNodeId } = useWorkflow();
  const isSelected = selected || selectedNodeId === id;

  const getIcon = () => {
    switch (data.triggerType) {
      case 'schedule':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'gmail_event':
        return <Mail className="w-4 h-4 text-red-400" />;
      case 'slack_event':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getStatusBorder = () => {
    if (data.status === 'running') return 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] ring-2 ring-indigo-500/50 animate-pulse';
    if (data.status === 'success') return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/40';
    if (data.status === 'failed') return 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
    if (isSelected) return 'border-indigo-500 ring-2 ring-indigo-500/30';
    return 'border-white/10 hover:border-white/20';
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-72 rounded-xl bg-[#111728]/95 backdrop-blur-md border ${getStatusBorder()} transition-all duration-200 shadow-xl cursor-pointer select-none group`}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            {getIcon()}
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
              Trigger
            </span>
            <div className="text-[11px] text-slate-400 font-mono">
              {data.triggerType === 'webhook' ? 'HTTP POST' : data.triggerType}
            </div>
          </div>
        </div>

        {data.status === 'running' && (
          <span className="flex items-center gap-1 text-[10px] text-indigo-300 font-medium bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            Executing
          </span>
        )}

        {data.status === 'success' && (
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {data.executionTime ? `${data.executionTime}ms` : 'Passed'}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="p-3.5">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
          {data.label}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {data.description || 'Listens for trigger event'}
        </p>

        {data.config?.webhookPath && (
          <div className="mt-2.5 flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/5 rounded text-[11px] font-mono text-slate-300">
            <Terminal className="w-3 h-3 text-slate-500" />
            <span className="truncate">/{data.config.webhookPath}</span>
          </div>
        )}

        {data.config?.cronExpression && (
          <div className="mt-2.5 px-2 py-1 bg-black/40 border border-white/5 rounded text-[11px] font-mono text-amber-300 flex items-center justify-between">
            <span>{data.config.cronExpression}</span>
            <span className="text-[10px] text-slate-400">UTC</span>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};
