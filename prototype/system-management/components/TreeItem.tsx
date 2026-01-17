import React from 'react';
import { ConfigNode } from '../types';

interface TreeItemProps {
  node: ConfigNode;
  activeId: string | null;
  level: number;
  onSelect: (node: ConfigNode) => void;
  onToggleExpand: (nodeId: string, e: React.MouseEvent) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({ node, activeId, level, onSelect, onToggleExpand }) => {
  const isSelected = activeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  
  // Dynamic indentation
  const paddingLeft = `${level * 16 + 12}px`;

  return (
    <div className="flex flex-col select-none">
      <div
        className={`
          group flex items-center gap-2 py-2 pr-3 cursor-pointer transition-all duration-200 border-l-2
          ${isSelected 
            ? 'bg-primary/10 border-primary text-white' 
            : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'}
        `}
        style={{ paddingLeft }}
        onClick={() => onSelect(node)}
      >
        {/* Expand/Collapse Toggle */}
        <div 
          className={`
            p-0.5 rounded-md transition-colors hover:bg-white/10
            ${node.type === 'SYSTEM' ? 'visible' : 'invisible'}
          `}
          onClick={(e) => {
             e.stopPropagation();
             onToggleExpand(node.id, e);
          }}
        >
          <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${node.expanded ? 'rotate-90' : ''}`}>
            chevron_right
          </span>
        </div>

        {/* Icon based on Type */}
        <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-primary' : ''}`}>
          {node.type === 'SYSTEM' ? 'dns' : 'settings_input_component'}
        </span>

        {/* Label */}
        <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : ''}`}>
          {node.name}
        </span>
        
        {/* Count Badge for Systems */}
        {node.type === 'SYSTEM' && node.children && (
          <span className="ml-auto text-[10px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-white/30 group-hover:bg-white/10">
            {node.children.length}
          </span>
        )}
      </div>

      {/* Recursive Children */}
      {node.type === 'SYSTEM' && node.expanded && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              activeId={activeId}
              level={level + 1}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeItem;
