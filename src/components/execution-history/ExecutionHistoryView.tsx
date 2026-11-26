import React, { useState } from 'react';
import { 
  History, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Terminal, 
  X, 
  ChevronRight,
  Filter,
  Cpu
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ExecutionLogItem } from '../../types/execution';

export const ExecutionHistoryView: React.FC = () => {
  const { executions } = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [selectedExecution, setSelectedExecution] = useState<ExecutionLogItem | null>(null);

  const filteredExecutions = executions.filter((exec) => {
    const matchesSearch = 
      exec.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.triggerType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || exec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Execution History & Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of automated pipeline runs, execution latency, and token consumption
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Total Logged Runs: <strong className="text-slate-200">{executions.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by execution ID, workflow name, or trigger type..."
            className="w-full bg-[#111728] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'success', 'failed'] as const).map((status) => (
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

      {/* Execution Logs Table */}
      <div className="rounded-2xl bg-[#111728] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Execution ID</th>
                <th className="px-5 py-3">Workflow</th>
                <th className="px-5 py-3">Trigger Source</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Tokens</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredExecutions.map((exec) => (
                <tr
                  key={exec.id}
                  onClick={() => setSelectedExecution(exec)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                        exec.status === 'success'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : exec.status === 'failed'
                          ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 animate-pulse'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          exec.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      {exec.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">
                    {exec.id}
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {exec.workflowName}
                  </td>

                  <td className="px-5 py-3.5 font-mono text-slate-400">
                    {exec.triggerType}
                  </td>

                  <td className="px-5 py-3.5 font-mono text-emerald-400">
                    {exec.durationMs}ms
                  </td>

                  <td className="px-5 py-3.5 font-mono text-indigo-300">
                    {exec.tokensUsed ? `${exec.tokensUsed}` : '—'}
                  </td>

                  <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                    {new Date(exec.startTime).toLocaleTimeString()}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs text-indigo-400 group-hover:text-indigo-300 font-medium">
                      Inspect &rarr;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trace Inspection Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#111728] border border-white/10 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  Execution Payload Trace: {selectedExecution.id}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      selectedExecution.status === 'success'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {selectedExecution.status.toUpperCase()}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedExecution.workflowName} • {selectedExecution.durationMs}ms total latency
                </p>
              </div>

              <button
                onClick={() => setSelectedExecution(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              {selectedExecution.errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300">
                  <div className="font-semibold mb-1">Execution Failure Reason:</div>
                  <div className="text-[11px]">{selectedExecution.errorMessage}</div>
                </div>
              )}

              {selectedExecution.nodeSteps && selectedExecution.nodeSteps.length > 0 ? (
                selectedExecution.nodeSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-slate-200 font-semibold">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        {step.nodeName}
                      </span>
                      <span className="text-emerald-400">{step.durationMs}ms</span>
                    </div>

                    {step.inputData && (
                      <div>
                        <div className="text-[10px] text-slate-500 mb-0.5">Node Input:</div>
                        <pre className="text-[10px] text-slate-400 bg-black/60 p-2 rounded overflow-x-auto">
                          {JSON.stringify(step.inputData, null, 2)}
                        </pre>
                      </div>
                    )}

                    {step.outputData && (
                      <div>
                        <div className="text-[10px] text-indigo-400 mb-0.5">Node Output:</div>
                        <pre className="text-[10px] text-emerald-300 bg-black/60 p-2 rounded overflow-x-auto">
                          {JSON.stringify(step.outputData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  Simulated production run completed without step-level capture.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
