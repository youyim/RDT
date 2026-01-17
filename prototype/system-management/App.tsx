import React, { useState } from 'react';
import { ConfigNode } from './types';
import { INITIAL_DATA } from './constants';
import SystemPage from './components/SystemPage';
import SubsystemPage from './components/SubsystemPage';

type ViewMode = 'systems' | 'subsystems';

const App: React.FC = () => {
  const [data, setData] = useState<ConfigNode[]>(INITIAL_DATA);
  const [currentView, setCurrentView] = useState<ViewMode>('systems');

  // --- CRUD Helpers ---

  // 1. Systems
  const handleAddSystem = (newSystem: ConfigNode) => {
    setData(prev => [...prev, newSystem]);
  };

  const handleUpdateSystem = (updatedSystem: ConfigNode) => {
    setData(prev => prev.map(sys => sys.id === updatedSystem.id ? { ...updatedSystem, children: sys.children } : sys));
  };

  const handleDeleteSystem = (systemId: string) => {
    if (confirm('Delete this system? All subsystems will be removed.')) {
      setData(prev => prev.filter(sys => sys.id !== systemId));
    }
  };

  // 2. Subsystems
  const handleAddSubsystem = (newSubsystem: ConfigNode, parentId: string) => {
    setData(prev => prev.map(sys => {
      if (sys.id === parentId) {
        return { ...sys, children: [...(sys.children || []), newSubsystem] };
      }
      return sys;
    }));
  };

  const handleUpdateSubsystem = (updatedNode: ConfigNode, newParentId: string) => {
    setData(prev => {
      // 1. Find current parent and remove the node
      // 2. Add to new parent (or same parent)
      
      // Deep copy to avoid mutation issues during filter/push
      let newData = JSON.parse(JSON.stringify(prev)) as ConfigNode[];
      
      // Remove from old parent
      newData = newData.map(sys => ({
        ...sys,
        children: sys.children?.filter(sub => sub.id !== updatedNode.id) || []
      }));

      // Add to new parent
      newData = newData.map(sys => {
        if (sys.id === newParentId) {
          return {
            ...sys,
            children: [...(sys.children || []), updatedNode]
          };
        }
        return sys;
      });

      return newData;
    });
  };

  const handleDeleteSubsystem = (subsystemId: string) => {
    if (confirm('Are you sure you want to delete this subsystem?')) {
      setData(prev => prev.map(sys => ({
        ...sys,
        children: sys.children?.filter(sub => sub.id !== subsystemId) || []
      })));
    }
  };

  return (
    <div className="flex h-screen w-full bg-bg-dark text-white font-sans selection:bg-primary/30 overflow-hidden">
      
      {/* Navigation Sidebar */}
      <aside className="w-64 flex flex-col border-r border-panel-border bg-black/20">
        <div className="h-16 flex items-center px-6 border-b border-panel-border">
          <span className="material-symbols-outlined text-primary text-3xl mr-2">hub</span>
          <span className="font-bold text-lg tracking-tight">Config Center</span>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => setCurrentView('systems')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentView === 'systems' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">dns</span>
            System Config
          </button>
          
          <button
            onClick={() => setCurrentView('subsystems')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentView === 'subsystems' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">settings_input_component</span>
            Subsystem Config
          </button>
        </nav>

        <div className="mt-auto p-6 border-t border-panel-border">
           <div className="text-xs text-white/30 text-center">
              v1.0.0 &copy; 2024
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-gradient-to-br from-bg-dark to-[#0e1016]">
        {currentView === 'systems' ? (
          <SystemPage 
            systems={data} 
            onAdd={handleAddSystem}
            onUpdate={handleUpdateSystem}
            onDelete={handleDeleteSystem}
          />
        ) : (
          <SubsystemPage 
            systems={data}
            onAdd={handleAddSubsystem}
            onUpdate={handleUpdateSubsystem}
            onDelete={handleDeleteSubsystem}
          />
        )}
      </main>
    </div>
  );
};

export default App;