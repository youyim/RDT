import React, { useState } from 'react';
import { 
  Layout, 
  FileText, 
  GitPullRequest, 
  Database,
  Bell,
  Settings,
  ChevronRight,
  PanelLeft,
  LogOut
} from 'lucide-react';
import RequirementEditor from './components/RequirementEditor';
import DecompositionBoard from './components/DecompositionBoard';
import DesignCanvas from './components/DesignCanvas';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.EDITOR);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderView = () => {
    switch(currentView) {
      case ViewMode.EDITOR:
        return <RequirementEditor />;
      case ViewMode.DECOMPOSITION:
        return <DecompositionBoard />;
      case ViewMode.DESIGN:
        return <DesignCanvas />;
      default:
        return <RequirementEditor />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background text-slate-300 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside 
        className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-surface border-r border-white/5 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out`}
      >
        <div>
          {/* Logo Area */}
          <div className={`h-16 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-6'} border-b border-white/5 overflow-hidden`}>
             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary neon-glow text-white font-bold text-lg shrink-0">
                R
             </div>
             <span className={`ml-3 font-bold text-white tracking-tight whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>R&D Core</span>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-2">
            <button 
              onClick={() => setCurrentView(ViewMode.EDITOR)}
              title={isSidebarCollapsed ? "Requirements" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${currentView === ViewMode.EDITOR ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FileText size={20} className={`shrink-0 ${currentView === ViewMode.EDITOR ? 'neon-glow' : ''}`} />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>Requirements</span>
              {currentView === ViewMode.EDITOR && !isSidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
            </button>

            <button 
              onClick={() => setCurrentView(ViewMode.DECOMPOSITION)}
              title={isSidebarCollapsed ? "Decomposition" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${currentView === ViewMode.DECOMPOSITION ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <GitPullRequest size={20} className="shrink-0" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>Decomposition</span>
              {currentView === ViewMode.DECOMPOSITION && !isSidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
            </button>

            <button 
              onClick={() => setCurrentView(ViewMode.DESIGN)}
              title={isSidebarCollapsed ? "System Design" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${currentView === ViewMode.DESIGN ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Database size={20} className="shrink-0" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>System Design</span>
              {currentView === ViewMode.DESIGN && !isSidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Toggle Sidebar"
          >
            <PanelLeft size={20} className="shrink-0" />
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>Collapse</span>
          </button>

          <button 
            className={`flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Settings"
          >
            <Settings size={20} className="shrink-0" />
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4 text-sm">
             <span className="text-slate-500">Project Alpha</span>
             <ChevronRight size={14} className="text-slate-600" />
             <span className="text-slate-300">{currentView.charAt(0) + currentView.slice(1).toLowerCase()}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Box Removed */}
            
            <div className="flex items-center gap-4">
              <button className="relative text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 border border-white/20 flex items-center justify-center text-xs font-bold text-white cursor-pointer shadow-lg shadow-primary/20">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden relative">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;