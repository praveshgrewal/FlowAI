import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  Workflow, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  ArrowUpRight, 
  Play, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  Terminal, 
  X,
  ExternalLink
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ExecutionLogItem } from '../../types/execution';

export const DashboardView: React.FC = () => {
  const { 
    stats, 
    executions, 
    workflowsList, 
    setActivePage, 
    loadWorkflowById, 
    generateWorkflowFromPrompt, 
    createNewBlankWorkflow 
  } = useWorkflow();

  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedExecution, setSelectedExecution] = useState<ExecutionLogItem | null>(null);

  const handleQuickGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    generateWorkflowFromPrompt(quickPrompt.trim());
  };

  const statCards = [
    {
      title: 'Total Executions',
      value: stats.totalExecutions.toLocaleString(),
      change: `+${stats.executionGrowthPercentage}% this month`,
      isPositive: true,
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      subtext: 'Across all active worker pools'
    },
    {
      title: 'Active Workflows',
      value: `${stats.activeWorkflows} / ${stats.totalWorkflows}`,
      change: '18 running in production',
      isPositive: true,
      icon: <Workflow className="w-5 h-5 text-emerald-400" />,
      subtext: 'Auto-scaled with zero queue lag'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+0.4% SLA adherence',
      isPositive: true,
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
      subtext: '99.4% first-attempt completion'
    },
    {
      title: 'Average Latency',
      value: `${stats.avgLatencyMs}ms`,
      change: '-45ms vs last week',
      isPositive: true,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      subtext: 'Edge execution routing'
    },
    {
      title: 'AI Tokens Processed',
      value: `${(stats.tokensConsumed / 1000000).toFixed(2)}M`,
      change: `${stats.tokensSavedPercentage}% cached tokens`,
      isPositive: true,
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      subtext: 'Claude 3.5 & GPT-4o inference'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner & Quick AI Generator Input */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-900/40 via-[#111728] to-[#151C30] border border-indigo-500/30 p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                FlowAI Automation Cloud
              </span>
              <span className="text-xs text-slate-400 font-mono">Cluster: US-East • n8n Connected</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">
              Welcome back, Pravesh
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              All 18 automated production pipelines are operational. AI nodes processed 42.8k requests today with zero security alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActivePage('builder')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open AI Builder</span>
            </button>
            <button
              onClick={createNewBlankWorkflow}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
            >
              <span>Blank Canvas</span>
            </button>
          </div>
        </div>

        {/* Quick Prompt Bar inside dashboard */}
        <form onSubmit={handleQuickGenerate} className="mt-4">
          <div className="flex items-center gap-2 rounded-xl bg-[#090D17]/90 border border-white/10 p-2 focus-within:border-indigo-500 transition-all">
            <Sparkles className="w-4 h-4 text-indigo-400 ml-2 shrink-0" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Describe what you want to automate (e.g., 'Summarize incoming customer tickets with Claude 3.5 and alert Slack')..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={!quickPrompt.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 shrink-0"
            >
              Generate with AI
            </button>
          </div>
        </form>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#111728]/80 border border-white/10 p-4 shadow-xl hover:border-indigo-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.title}</span>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
            </div>

            <div className="text-2xl font-bold text-slate-100 mt-2 font-mono tracking-tight">
              {stat.value}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stat.change}</span>
            </div>

            <div className="text-[10px] text-slate-500 mt-1 truncate font-mono">
              {stat.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Main Two Columns: Active Production Workflows & Live Execution Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Production Workflows */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111728]/80 border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Active Production Workflows
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pipelines with active webhook listeners and cron triggers
              </p>
            </div>

            <button
              onClick={() => setActivePage('workflows')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {workflowsList.slice(0, 4).map((wf) => (
              <div
                key={wf.id}
                onClick={() => loadWorkflowById(wf.id)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {wf.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {wf.executionCount.toLocaleString()} runs
                      </span>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {wf.successRate}% success
                      </span>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {wf.lastExecutionAt || 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                  <div className="p-1 rounded text-slate-400 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Integration Bar */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#FF6D5A]" />
              Synced with n8n Cluster: <strong className="text-slate-200">18 scenarios</strong>
            </span>
            <button
              onClick={() => setActivePage('integrations')}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
            >
              Manage Integrations &rarr;
            </button>
          </div>
        </div>

        {/* Right Col: Live Activity Stream */}
        <div className="rounded-2xl bg-[#111728]/80 border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Recent Activity
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time trigger executions
              </p>
            </div>

            <button
              onClick={() => setActivePage('history')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Full Logs
            </button>
          </div>

          <div className="space-y-3">
            {executions.slice(0, 5).map((exec) => (
              <div
                key={exec.id}
                onClick={() => setSelectedExecution(exec)}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        exec.status === 'success'
                          ? 'bg-emerald-400'
                          : exec.status === 'failed'
                          ? 'bg-rose-400'
                          : 'bg-indigo-400 animate-pulse'
                      }`}
                    />
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {exec.workflowName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {exec.durationMs}ms
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span className="truncate">{exec.triggerType}</span>
                  {exec.tokensUsed ? (
                    <span className="text-indigo-300">{exec.tokensUsed} tokens</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Detail Modal / Drawer */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#111728] border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  Execution Trace: {selectedExecution.id}
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

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 font-mono text-xs">
              {selectedExecution.nodeSteps && selectedExecution.nodeSteps.length > 0 ? (
                selectedExecution.nodeSteps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-slate-200 font-semibold">
                      <span>{step.nodeName}</span>
                      <span className="text-emerald-400">{step.durationMs}ms</span>
                    </div>
                    {step.outputData && (
                      <pre className="text-[10px] text-slate-400 bg-black/60 p-2 rounded overflow-x-auto">
                        {JSON.stringify(step.outputData, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  Step telemetry persisted in archival storage.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
