import React, { useState } from 'react';
import { ConfigNode } from '../types';

interface SystemPageProps {
  systems: ConfigNode[];
  onAdd: (system: ConfigNode) => void;
  onUpdate: (system: ConfigNode) => void;
  onDelete: (id: string) => void;
}

const SystemPage: React.FC<SystemPageProps> = ({ systems, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<ConfigNode | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ConfigNode>>({});

  const openCreateModal = () => {
    setEditingNode(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (node: ConfigNode) => {
    setEditingNode(node);
    setFormData({ name: node.name, description: node.description });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingNode) {
      onUpdate({ ...editingNode, name: formData.name, description: formData.description });
    } else {
      const newSystem: ConfigNode = {
        id: `sys-${Date.now()}`,
        parentId: null,
        name: formData.name,
        type: 'SYSTEM',
        description: formData.description,
        children: []
      };
      onAdd(newSystem);
    }
    setIsModalOpen(false);
  };

  // Consistent Input Styles
  const inputClass = "w-full px-3 py-2 rounded text-white text-sm bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors placeholder-white/20";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 px-8 border-b border-panel-border flex items-center justify-between bg-black/10 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white">System Configuration</h1>
          <p className="text-sm text-white/40 mt-1">Manage top-level architectural domains</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New System
        </button>
      </header>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map(sys => (
            <div key={sys.id} className="glass-panel rounded-xl p-5 hover:border-primary/30 transition-all group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">dns</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(sys)}
                    className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button 
                    onClick={() => onDelete(sys.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-white mb-1">{sys.name}</h3>
              <p className="text-sm text-white/50 line-clamp-2 h-10 mb-4">{sys.description || 'No description provided.'}</p>
              
              <div className="flex items-center gap-2 text-xs font-mono text-white/30 pt-4 border-t border-white/5">
                <span className="material-symbols-outlined text-[14px]">account_tree</span>
                {sys.children?.length || 0} Subsystems
              </div>
            </div>
          ))}
          
          {systems.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-xl">
                <span className="material-symbols-outlined text-4xl mb-2">dns</span>
                <p>No systems found. Create one to get started.</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#16181d] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="font-bold text-lg">{editingNode ? 'Edit System' : 'Create System'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">System Name</label>
                <input 
                  autoFocus
                  type="text" 
                  className={inputClass}
                  placeholder="e.g. Finance Core"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Brief description..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded hover:bg-white/5 text-sm text-white/60 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!formData.name}
                  className="px-6 py-2 rounded bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {editingNode ? 'Save Changes' : 'Create System'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemPage;