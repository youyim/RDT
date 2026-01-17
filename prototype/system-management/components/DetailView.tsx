import React, { useState, useEffect } from 'react';
import { ConfigNode } from '../types';

interface DetailViewProps {
  node: ConfigNode;
  breadcrumbs: string[];
  isCreating: boolean;
  onSave: (updatedNode: ConfigNode) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onAddSubsystem: (parentId: string) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ 
  node, 
  breadcrumbs, 
  isCreating,
  onSave, 
  onDelete,
  onCancel,
  onAddSubsystem
}) => {
  const [formData, setFormData] = useState<ConfigNode>(node);
  const [isDirty, setIsDirty] = useState(false);

  // Sync state when node changes
  useEffect(() => {
    setFormData(node);
    setIsDirty(false);
  }, [node]);

  const handleChange = (field: keyof ConfigNode, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSaveClick = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
    setIsDirty(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-panel-border bg-black/10 backdrop-blur-sm sticky top-0 z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/40 overflow-hidden">
           {breadcrumbs.map((crumb, index) => (
             <React.Fragment key={index}>
               {index > 0 && <span>/</span>}
               <span className={index === breadcrumbs.length - 1 ? 'text-white font-medium' : ''}>
                 {crumb}
               </span>
             </React.Fragment>
           ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Add Subsystem Button (Only visible for existing Systems) */}
          {!isCreating && node.type === 'SYSTEM' && (
            <button 
              onClick={() => onAddSubsystem(node.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-primary/10 transition-colors mr-2 border border-primary/20"
            >
               <span className="material-symbols-outlined text-[16px]">add_circle</span>
               Add Subsystem
            </button>
          )}

          {isCreating ? (
            <button 
              onClick={onCancel}
              className="px-4 py-1.5 rounded text-xs font-medium text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={() => onDelete(node.id)}
              className="w-8 h-8 flex items-center justify-center rounded text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete System"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}

          <button 
            onClick={handleSaveClick}
            disabled={isCreating ? !formData.name : !isDirty}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold transition-all
              ${(isCreating ? formData.name : isDirty)
                ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'}
            `}
          >
            <span className="material-symbols-outlined text-[16px]">{isCreating ? 'add' : 'save'}</span>
            {isCreating ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Top Section: Basic Info */}
          <section className="glass-panel p-6 rounded-xl space-y-6">
             <div className="grid grid-cols-1 gap-6">
                <div>
                   <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">System Name</label>
                   <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="glass-input w-full px-4 py-3 rounded-lg text-lg font-medium text-white placeholder-white/20 focus:ring-2 focus:ring-primary/50"
                      placeholder={node.type === 'SYSTEM' ? "e.g., Payment Gateway" : "e.g., Payment Frontend"}
                      autoFocus
                   />
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-wide">Description</label>
                   <textarea 
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                      className="glass-input w-full px-4 py-3 rounded-lg text-sm text-white/80 placeholder-white/20 resize-none"
                      placeholder="Describe the purpose and scope of this system..."
                   />
                </div>
             </div>
          </section>

          {/* Subsystem Specific: Technical Specs */}
          {node.type === 'SUBSYSTEM' && (
            <section className="glass-panel p-6 rounded-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-2 mb-2 text-primary">
                  <span className="material-symbols-outlined text-[18px]">code</span>
                  <h3 className="text-xs font-bold uppercase tracking-widest">Technical Specifications</h3>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2">Git Repository URL</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-white/20 material-symbols-outlined text-[18px]">link</span>
                      <input 
                          type="text" 
                          value={formData.gitUrl || ''}
                          onChange={(e) => handleChange('gitUrl', e.target.value)}
                          className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-green-400 font-mono placeholder-white/20"
                          placeholder="https://github.com/org/repo.git"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2">Primary Stack / Language</label>
                    <div className="relative">
                       <select 
                          value={formData.language || ''}
                          onChange={(e) => handleChange('language', e.target.value)}
                          className="glass-input w-full pl-4 pr-10 py-2.5 rounded-lg text-sm text-white appearance-none cursor-pointer"
                       >
                          <option value="" disabled>Select a technology</option>
                          <option value="React / TypeScript">React / TypeScript</option>
                          <option value="Vue.js">Vue.js</option>
                          <option value="Go v1.21">Go v1.21</option>
                          <option value="Rust">Rust</option>
                          <option value="Java / Spring Batch">Java / Spring Batch</option>
                          <option value="Python / Django">Python / Django</option>
                          <option value="Node.js">Node.js</option>
                       </select>
                       <span className="absolute right-3 top-3 text-white/40 material-symbols-outlined text-[18px] pointer-events-none">expand_more</span>
                    </div>
                  </div>
               </div>
            </section>
          )}

          {/* NOTE: Ownership section removed as per user request */}
          
        </div>
      </div>
    </div>
  );
};

export default DetailView;