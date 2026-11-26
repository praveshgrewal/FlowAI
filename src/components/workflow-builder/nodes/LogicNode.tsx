import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitFork, Split } from 'lucide-react';
import { LogicNodeData } from '../../../types/workflow';
import { useWorkflow } from '../../../context/WorkflowContext';

interface LogicNodeProps {
  id: string;
  data: LogicNodeData;
  selected?: boolean;
}

export const LogicNode: React.FC<LogicNodeProps> = ({ id, data, selected }) => {
  const { selectedNodeId, setSelectedNodeId } = useWorkflow();
  const isSelected = selected || selectedNodeId === id;

  const getStatusBorder = () => {
    if (data.status === 'running') return 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-2 ring-emerald-500/50 animate-pulse';
    if (data.status === 'success') return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (isSelected) return 'border-emerald-500/80 ring-2 ring-emerald-500/30';
    return 'border-white/10 hover:border-white/20';
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-72 rounded-xl bg-[#111728]/95 backdrop-blur-md border ${getStatusBorder()} transition-all duration-200 shadow-xl cursor-pointer select-none group`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />

      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <GitFork className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400">
              Logic & Branch
            </span>
            <div className="text-[11px] text-slate-400 font-mono">
              If / Else Condition
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
          {data.label}
        </h4>
        <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/5 rounded text-[11px] font-mono text-slate-300">
          <span className="text-emerald-400">{data.conditionField || 'status'}</span>
          <span className="text-slate-500">{data.operator || '=='}</span>
          <span className="text-amber-300">"{data.compareValue || 'true'}"</span>
        </div>
      </div>

      {/* Dual Handles: True & False branches */}
      <div className="absolute right-0 top-[35%] translate-x-1.5 flex items-center gap-1">
        <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-[#0B0F17] px-1 rounded -translate-x-2">
          TRUE
        </span>
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          style={{ top: '35%' }}
          className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
        />
      </div>

      <div className="absolute right-0 top-[75%] translate-x-1.5 flex items-center gap-1">
        <span className="text-[9px] font-mono font-semibold text-rose-400 bg-[#0B0F17] px-1 rounded -translate-x-2">
          FALSE
        </span>
        <Handle
          type="source"
          position={Position.Right}
          id="false"
          style={{ top: '75%' }}
          className="!w-3 !h-3 !bg-rose-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
        />
      </div>
    </div>
  );
};
