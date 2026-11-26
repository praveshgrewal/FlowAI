import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sparkles, 
  ExternalLink, 
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { useWorkflow, NavigationPage } from '../../context/WorkflowContext';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { activePage, stats, setIsN8nModalOpen } = useWorkflow();

  const getPageTitle = (page: NavigationPage) => {
    switch (page) {
      case 'dashboard': return 'Dashboard & Telemetry';
      case 'builder': return 'AI Workflow Canvas';
      case 'workflows': return 'My Workflows';
      case 'templates': return 'Workflow Templates';
      case 'integrations': return 'Integrations Hub';
      case 'history': return 'Execution History';
      case 'settings': return 'Workspace Settings';
      default: return 'FlowAI';
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0D1220]/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">FlowAI</span>
          <span className="text-xs text-slate-600">/</span>
          <h1 className="text-sm font-semibold text-slate-100">
            {getPageTitle(activePage)}
          </h1>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Quick Global Stats Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Success: <strong className="text-emerald-400">{stats.successRate}%</strong></span>
          <span className="text-slate-600">|</span>
          <span>Avg: <strong className="text-indigo-400">{stats.avgLatencyMs}ms</strong></span>
        </div>

        {/* Quick n8n Sync Link */}
        <button
          onClick={() => setIsN8nModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-[#FF6D5A]" />
          <span>n8n Sync</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </div>
      </div>
    </header>
  );
};
