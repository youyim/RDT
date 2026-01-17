import React, { useState, useMemo } from 'react';
import { ConfigNode } from '../types';

interface SubsystemPageProps {
  systems: ConfigNode[];
  onAdd: (subsystem: ConfigNode, parentId: string) => void;
  onUpdate: (subsystem: ConfigNode, parentId: string) => void;
  onDelete: (id: string) => void;
}

// Flattened structure for display
interface FlatSubsystem extends ConfigNode {
  parentName: string;
  parentId: string;
}

const SubsystemPage: React.FC<SubsystemPageProps> = ({ systems, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<ConfigNode | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ConfigNode>>({});
  const [selectedParentId, setSelectedParentId] = useState<string>('');

  // Derived flat list
  const flatSubsystems = useMemo(() => {
    const list: FlatSubsystem[] = [];
    systems.forEach(sys => {
      if (sys.children) {
        sys.children.forEach(sub => {
          list.push({
            ...sub,
            parentId: sys.id,
            parentName: sys.name
          });
        });
      }
    });
    return list;
  }, [systems]);

  const openCreateModal = () => {
    setEditingNode(null);
    setFormData({ name: '', description: '', gitUrl: '', language: '' });
    // Default to first system if available
    setSelectedParentId(systems.length > 0 ? systems[0].id : '');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: FlatSubsystem) => {
    setEditingNode(sub);
    setFormData({
      name: sub.name,
      description: sub.description,
      gitUrl: sub.gitUrl,
      language: sub.language
    });
    setSelectedParentId(sub.parentId);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !selectedParentId) return;

    const nodePayload: ConfigNode = {
      id: editingNode ? editingNode.id : `sub-${Date.now()}`,
      parentId: selectedParentId,
      name: formData.name,
      type: 'SUBSYSTEM',
      description: formData.description,
      gitUrl: formData.gitUrl,
      language: formData.language,
    };

    if (editingNode) {
      onUpdate(nodePayload, selectedParentId);
    } else {
      onAdd(nodePayload, selectedParentId);
    }
    setIsModalOpen(false);
  };

  // Shared input class string for consistency
  const inputClass = "w-full px-3 py-2 rounded text-white text-sm bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors placeholder-white/20";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 px-8 border-b border-panel-border flex items-center justify-between bg-black/10 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white">Subsystem Configuration</h1>
          <p className="text-sm text-white/40 mt-1">Manage modules, services, and frontends</p>
        </div>
        <button 
          onClick={openCreateModal}
          disabled={systems.length === 0}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={systems.length === 0 ? "Create a System first" : ""}
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Subsystem
        </button>
      </header>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/40 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Subsystem Name</th>
                <th className="px-6 py-4">Belongs To System</th>
                <th className="px-6 py-4">Git Repo</th>
                <th className="px-6 py-4">Stack</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {flatSubsystems.map(sub => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{sub.name}</div>
                    <div className="text-xs text-white/40 mt-1 truncate max-w-[200px]">{sub.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {sub.parentName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-green-400">
                    {sub.gitUrl ? (
                      <a href={sub.gitUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">link</span>
                        Repo
                      </a>
                    ) : (
                      <span className="text-white/20">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {sub.language || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(sub)} className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => onDelete(sub.id)} className="p-1.5 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {flatSubsystems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                    No subsystems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#16181d] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="font-bold text-lg">{editingNode ? 'Edit Subsystem' : 'Create Subsystem'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">Parent System</label>
                    <div className="relative">
                      <select 
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={selectedParentId}
                        onChange={e => setSelectedParentId(e.target.value)}
                      >
                        {systems.map(sys => (
                          <option key={sys.id} value={sys.id} className="bg-[#16181d] text-white">
                            {sys.name}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-white/40 pointer-events-none text-[18px]">expand_more</span>
                    </div>
                 </div>

                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">Subsystem Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      className={inputClass}
                      placeholder="e.g. Core API"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>

                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">Description</label>
                    <textarea 
                      rows={2}
                      className={`${inputClass} resize-none`}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">Git URL</label>
                    <input 
                      type="text" 
                      className={`${inputClass} font-mono`}
                      placeholder="https://..."
                      value={formData.gitUrl}
                      onChange={e => setFormData({...formData, gitUrl: e.target.value})}
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1.5">Tech Stack</label>
                    <input 
                      type="text" 
                      className={inputClass}
                      placeholder="e.g. React"
                      value={formData.language}
                      onChange={e => setFormData({...formData, language: e.target.value})}
                    />
                 </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2 border-t border-white/5 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded hover:bg-white/5 text-sm text-white/60 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!formData.name || !selectedParentId}
                  className="px-6 py-2 rounded bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {editingNode ? 'Save Changes' : 'Create Subsystem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubsystemPage;