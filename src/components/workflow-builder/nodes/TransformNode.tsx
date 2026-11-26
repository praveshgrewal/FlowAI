import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Binary, Code2 } from 'lucide-react';
import { TransformNodeData } from '../../../types/workflow';
import { useWorkflow } from '../../../context/WorkflowContext';

interface TransformNodeProps {
  id: string;
  data: TransformNodeData;
  selected?: boolean;
}

export const TransformNode: React.FC<TransformNodeProps> = ({ id, data, selected }) => {
  const { selectedNodeId, setSelectedNodeId } = useWorkflow();
  const isSelected = selected || selectedNodeId === id;

  const getStatusBorder = () => {
    if (data.status === 'running') return 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] ring-2 ring-cyan-500/50 animate-pulse';
    if (data.status === 'success') return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (isSelected) return 'border-cyan-500/80 ring-2 ring-cyan-500/30';
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
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-400">
              Transform
            </span>
            <div className="text-[11px] text-slate-400 font-mono">
              JSON / JS Mapper
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
          {data.label}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {data.description || 'Transforms data structure'}
        </p>

        {data.codeSnippet && (
          <div className="mt-2.5 p-2 bg-black/50 border border-white/5 rounded text-[10px] font-mono text-cyan-300/90 line-clamp-2">
            {data.codeSnippet}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#0B0F17] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};
