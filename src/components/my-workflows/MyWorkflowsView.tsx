import React, { useState } from 'react';
import { 
  Workflow, 
  Search, 
  Plus, 
  Play, 
  Edit3, 
  Trash2, 
  Copy, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WorkflowDefinition } from '../../types/workflow';

export const MyWorkflowsView: React.FC = () => {
  const { 
    workflowsList, 
    loadWorkflowById, 
    createNewBlankWorkflow, 
    setCurrentWorkflow, 
    setIsN8nModalOpen 
  } = useWorkflow();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');

  const filteredWorkflows = workflowsList.filter((wf) => {
    const matchesSearch = 
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            My Workflows
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage, edit, and monitor your autonomous multi-step pipelines
          </p>
        </div>

        <button
          onClick={createNewBlankWorkflow}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows by title, description or tag..."
            className="w-full bg-[#111728] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'active', 'draft', 'paused'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkflows.map((wf) => (
          <div
            key={wf.id}
            className="rounded-2xl bg-[#111728]/90 border border-white/10 p-5 shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Title and Status */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {wf.name}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize shrink-0 ${
                    wf.status === 'active'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : wf.status === 'paused'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {wf.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {wf.description}
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {wf.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Telemetry Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">Executions</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {wf.executionCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Success</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {wf.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Last Run</div>
                  <div className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
                    {wf.lastExecutionAt || 'Never'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => {
                  loadWorkflowById(wf.id);
                  setIsN8nModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs text-[#FF6D5A] hover:text-[#ff8777] font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Export n8n</span>
              </button>

              <button
                onClick={() => loadWorkflowById(wf.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Canvas</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
