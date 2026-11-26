import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, Cpu, Bot } from 'lucide-react';
import { AINodeData } from '../../../types/workflow';
import { useWorkflow } from '../../../context/WorkflowContext';

interface AINodeProps {
  id: string;
  data: AINodeData;
  selected?: boolean;
}

export const AINode: React.FC<AINodeProps> = ({ id, data, selected }) => {
  const { selectedNodeId, setSelectedNodeId } = useWorkflow();
  const isSelected = selected || selectedNodeId === id;

  const getModelBadge = () => {
    switch (data.model) {
      case 'claude-3-5-sonnet':
        return { name: 'Claude 3.5 Sonnet', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'gpt-4o':
        return { name: 'GPT-4o', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'gemini-1-5-pro':
        return { name: 'Gemini 1.5 Pro', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      case 'deepseek-r1':
        return { name: 'DeepSeek-R1', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      default:
        return { name: data.model, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    }
  };

  const modelInfo = getModelBadge();

  const getStatusBorder = () => {
    if (data.status === 'running') return 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-500/50 animate-pulse';
    if (data.status === 'success') return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/40';
    if (data.status === 'failed') return 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
    if (isSelected) return 'border-amber-500/80 ring-2 ring-amber-500/30';
    return 'border-white/10 hover:border-white/20';
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-80 rounded-xl bg-[#111728]/95 backdrop-blur-md border ${getStatusBorder()} transition-all duration-200 shadow-xl cursor-pointer select-none group`}
    >
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-400">
              AI Reasoning
            </span>
            <div className="text-[11px] text-slate-400 font-mono">
              Temp: {data.temperature ?? 0.2}
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${modelInfo.color}`}>
          {modelInfo.name}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-3.5">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
          {data.label}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {data.description || data.userPrompt || 'Executes prompt inference'}
        </p>

        {/* Prompt Preview Snippet */}
        <div className="mt-2.5 p-2 bg-black/40 border border-white/5 rounded text-[11px] text-slate-300 font-mono line-clamp-2">
          <span className="text-amber-400/80 mr-1">&gt;</span>
          {data.userPrompt?.slice(0, 90) || 'Prompt...'}
        </div>

        {data.status === 'success' && data.executionTime && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded font-mono">
            <span>Inferenced</span>
            <span>{data.executionTime}ms</span>
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};
