import React from 'react';
import { 
  LayoutDashboard, 
  Wand2, 
  Workflow, 
  FileCode2, 
  Puzzle, 
  History, 
  Settings, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { useWorkflow, NavigationPage } from '../../context/WorkflowContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activePage, setActivePage, createNewBlankWorkflow, stats } = useWorkflow();

  const navigationItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'builder', label: 'AI Workflow Builder', icon: <Wand2 className="w-4 h-4" />, badge: 'AI' },
    { id: 'workflows', label: 'My Workflows', icon: <Workflow className="w-4 h-4" />, badge: `${stats.activeWorkflows}` },
    { id: 'templates', label: 'Templates', icon: <FileCode2 className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Puzzle className="w-4 h-4" />, badge: 'n8n' },
    { id: 'history', label: 'Execution History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (pageId: NavigationPage) => {
    setActivePage(pageId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D1220] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                FlowAI
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                AI Workflow Engine
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 hover:border-white/15 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-200">Acme Cloud Org</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">PROD</span>
          </div>
        </div>

        {/* Quick New Workflow CTA */}
        <div className="px-4 py-3">
          <button
            onClick={() => {
              createNewBlankWorkflow();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Workflow</span>
          </button>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : item.badge === 'AI' || item.badge === 'n8n'
                        ? 'bg-[#FF6D5A]/20 text-[#FF6D5A] border border-[#FF6D5A]/30'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Telemetry & Operational Health */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              n8n & AI Nodes
            </span>
            <span className="text-emerald-400 font-mono">Operational</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
              PR
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-medium text-slate-200 truncate">
                Pravesh Grewal
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                Enterprise Admin
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
