import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, Bot, Layers, CheckCircle, Loader2 } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

const EXAMPLE_PROMPTS = [
  {
    label: 'Customer Support Triage',
    prompt: 'Whenever a customer support email comes in, analyze sentiment with Claude 3.5, alert Slack if urgent, and log to Google Sheets.'
  },
  {
    label: 'Inbound Lead Enrichment',
    prompt: 'When a lead fills out Typeform, enrich with GPT-4o, alert #sales in Slack, and dispatch to n8n CRM sync.'
  },
  {
    label: 'Morning Executive Briefing',
    prompt: 'Every morning at 8:00 AM summarize unread Gmail newsletters and save key bullets to Google Sheets.'
  },
  {
    label: 'GitHub PR Security Review',
    prompt: 'Watch GitHub pull request events, classify severity with Gemini 1.5 Pro, and alert engineering on Slack.'
  }
];

export const AIPromptBar: React.FC = () => {
  const { 
    generateWorkflowFromPrompt, 
    isGenerating, 
    generationSteps, 
    currentGeneratingPrompt 
  } = useWorkflow();

  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<'claude-3-5-sonnet' | 'gpt-4o' | 'gemini-1-5-pro' | 'deepseek-r1'>('claude-3-5-sonnet');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isGenerating) return;
    generateWorkflowFromPrompt(promptInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#141B2D] to-[#0D1220] border border-white/10 p-5 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Subtle ambient glow behind input */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-28 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Autonomous AI Workflow Synthesizer
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                  v2.4 Natural Engine
                </span>
              </h2>
            </div>
          </div>

          {/* Model selector pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Generator Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-[#192238] border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500/60 font-mono transition-colors"
            >
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Recommended)</option>
              <option value="gpt-4o">GPT-4o (Omni)</option>
              <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
              <option value="deepseek-r1">DeepSeek-R1 (Reasoning)</option>
            </select>
          </div>
        </div>

        {/* Large Prompt Input Form */}
        <form onSubmit={handleSubmit} className="relative mt-2">
          <div className="relative rounded-xl bg-[#090D17]/80 border border-white/10 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-3 shadow-inner">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Describe what you want to automate in plain English (e.g., 'Whenever a customer support email comes in, analyze sentiment with Claude 3.5, alert Slack if urgent, and log to Google Sheets')..."
              rows={3}
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
            />

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-slate-400">
                  ⌘ + Enter
                </kbd>
                <span>to generate</span>
              </div>

              <button
                type="submit"
                disabled={!promptInput.trim() || isGenerating}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                  promptInput.trim() && !isGenerating
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Workflow...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Workflow with AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Prompts Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Quick Starters:
          </span>
          {EXAMPLE_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(item.prompt);
              }}
              className="text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 rounded-lg px-2.5 py-1 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live AI Reasoning Modal / Dialog when generating */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111728] border border-indigo-500/40 p-6 shadow-2xl animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 animate-spin">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Synthesizing Autonomous Workflow
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono truncate max-w-sm">
                  "{currentGeneratingPrompt}"
                </p>
              </div>
            </div>

            {/* Step Progression List */}
            <div className="space-y-3 my-5">
              {generationSteps.map((step) => (
                <div
                  key={step.step}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    step.status === 'done'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : step.status === 'processing'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-500/30'
                      : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="mt-0.5">
                    {step.status === 'done' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : step.status === 'processing' ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        {step.step}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{step.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-slate-500 font-mono">
              Generating React Flow node graph & n8n schema mapping...
            </div>
          </div>
        </div>
      )}
    </>
  );
};
