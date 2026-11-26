import React, { useState } from 'react';
import { 
  FileCode2, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Clock, 
  Headphones, 
  Target, 
  GitPullRequest, 
  Database, 
  Layers 
} from 'lucide-react';
import { MOCK_TEMPLATES } from '../../data/mockTemplates';
import { useWorkflow } from '../../context/WorkflowContext';
import { WorkflowTemplate } from '../../types/templates';

export const TemplatesView: React.FC = () => {
  const { loadTemplateIntoBuilder } = useWorkflow();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'AI Agents',
    'Customer Support',
    'Sales & Marketing',
    'DevOps & Engineering',
    'Data & Automation'
  ];

  const filteredTemplates = MOCK_TEMPLATES.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const getTemplateIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Headphones': return <Headphones className="w-5 h-5" style={{ color }} />;
      case 'Target': return <Target className="w-5 h-5" style={{ color }} />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" style={{ color }} />;
      case 'GitPullRequest': return <GitPullRequest className="w-5 h-5" style={{ color }} />;
      case 'Database': return <Database className="w-5 h-5" style={{ color }} />;
      case 'Layers': return <Layers className="w-5 h-5" style={{ color }} />;
      default: return <Zap className="w-5 h-5" style={{ color }} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-900/30 via-[#111728] to-[#141B2D] border border-white/10 p-6 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                Pre-Built Solutions
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Production-Ready Pipelines
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">
              AI Workflow Templates
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Start with tested enterprise pipelines. 1-click import into the visual canvas with pre-configured prompts, conditions, and n8n webhook parameters.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl bg-[#111728]/90 border border-white/10 p-5 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div
                  className="p-3 rounded-xl border group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: `${template.color}15`,
                    borderColor: `${template.color}35`
                  }}
                >
                  {getTemplateIcon(template.iconName, template.color)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {template.complexity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {template.estimatedRuntime}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors mt-3.5">
                {template.title}
              </h3>

              <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                {template.description}
              </p>

              {/* Tags */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {template.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                By {template.author}
              </span>

              <button
                onClick={() => loadTemplateIntoBuilder(template)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
