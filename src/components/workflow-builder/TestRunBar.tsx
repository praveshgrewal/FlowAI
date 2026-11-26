import React from 'react';
import { 
  Play, 
  Save, 
  Layers, 
  Check, 
  Loader2, 
  Plus, 
  History, 
  X, 
  Terminal, 
  ArrowRight, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

interface TestRunBarProps {
  onTogglePalette: () => void;
  isPaletteOpen: boolean;
}

export const TestRunBar: React.FC<TestRunBarProps> = ({ onTogglePalette, isPaletteOpen }) => {
  const { 
    currentWorkflow, 
    setCurrentWorkflow, 
    saveCurrentWorkflow, 
    runWorkflowSimulation, 
    isExecutingTest, 
    setIsN8nModalOpen,
    isTestResultsOpen,
    setIsTestResultsOpen,
    testRunResults,
    activeTestStepNodeId,
    clearTestState
  } = useWorkflow();

  const handleStatusToggle = () => {
    setCurrentWorkflow((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active'
    }));
  };

  return (
    <>
      {/* Top Action Toolbar above canvas */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#111728]/90 backdrop-blur-md border-b border-white/10 z-10">
        {/* Left: Workflow Title & Status */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={currentWorkflow.name}
            onChange={(e) => setCurrentWorkflow((prev) => ({ ...prev, name: e.target.value }))}
            className="text-base font-semibold text-slate-100 bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5 rounded"
          />

          {/* Status Toggle Pill */}
          <button
            onClick={handleStatusToggle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              currentWorkflow.status === 'active'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentWorkflow.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="capitalize">{currentWorkflow.status}</span>
          </button>

          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            {currentWorkflow.nodes.length} Nodes • {currentWorkflow.edges.length} Connections
          </span>
        </div>

        {/* Right: Actions (Add Node, Test Run, Export n8n, Save) */}
        <div className="flex items-center gap-2">
          {/* Add Node Button */}
          <button
            onClick={onTogglePalette}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isPaletteOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </button>

          {/* Test Run Execution Button */}
          <button
            onClick={runWorkflowSimulation}
            disabled={isExecutingTest || currentWorkflow.nodes.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExecutingTest ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Test Run</span>
              </>
            )}
          </button>

          {/* Export to n8n */}
          <button
            onClick={() => setIsN8nModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FF6D5A]/15 hover:bg-[#FF6D5A]/25 text-[#FF6D5A] border border-[#FF6D5A]/30 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Export to n8n</span>
          </button>

          {/* Save Workflow */}
          <button
            onClick={saveCurrentWorkflow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all hover:border-white/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Test Execution Trace Drawer / Bottom Sheet */}
      {isTestResultsOpen && (
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-[500px] max-h-[380px] bg-[#111728]/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-30 animate-slide-up">
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-200">
                Execution Simulation Trace
              </span>
              {isExecutingTest && (
                <span className="flex items-center gap-1 text-[10px] text-indigo-300 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> Running step by step
                </span>
              )}
            </div>

            <button
              onClick={clearTestState}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {testRunResults.length === 0 && isExecutingTest && (
              <div className="text-center py-6 text-xs text-slate-400">
                Initializing trigger event payload...
              </div>
            )}

            {testRunResults.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>{step.nodeName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">
                    {step.durationMs}ms
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 pl-6">
                  Output: <span className="text-indigo-300">{JSON.stringify(step.output).slice(0, 100)}...</span>
                </div>
              </div>
            ))}

            {!isExecutingTest && testRunResults.length > 0 && (
              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <span>Simulation completed successfully (100% passed)</span>
                <span className="font-mono text-[10px]">
                  {testRunResults.reduce((acc, r) => acc + r.durationMs, 0)}ms Total
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
