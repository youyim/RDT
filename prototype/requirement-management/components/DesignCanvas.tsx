import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  ZoomIn, 
  ZoomOut, 
  MousePointer2, 
  Hand, 
  Settings, 
  Download,
  Database,
  Table
} from 'lucide-react';
import { TableNode, RelationLink } from '../types';

const INITIAL_NODES: TableNode[] = [
  { 
    id: 'user_accounts', 
    name: 'User_Accounts', 
    x: 100, 
    y: 100,
    columns: [
      { name: 'user_id', type: 'UUID', isPk: true },
      { name: 'username', type: 'VARCHAR(50)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ]
  },
  { 
    id: 'login_history', 
    name: 'Login_History', 
    x: 500, 
    y: 250,
    columns: [
      { name: 'entry_id', type: 'BIGINT', isPk: true },
      { name: 'user_id', type: 'UUID', isFk: true },
      { name: 'ip_addr', type: 'INET' },
      { name: 'ts', type: 'TIMESTAMP' }
    ]
  },
  {
    id: 'profiles',
    name: 'User_Profiles',
    x: 150,
    y: 400,
    columns: [
        { name: 'profile_id', type: 'UUID', isPk: true },
        { name: 'user_id', type: 'UUID', isFk: true },
        { name: 'bio', type: 'TEXT' }
    ]
  }
];

const INITIAL_LINKS: RelationLink[] = [
  { source: 'user_accounts', target: 'login_history', label: '1:N' },
  { source: 'user_accounts', target: 'profiles', label: '1:1' }
];

const DesignCanvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  
  // Basic D3 curve calculation
  const getPath = (source: TableNode, target: TableNode) => {
    // Simple S-curve
    const startX = source.x + 240; // width of card roughly
    const startY = source.y + 50;
    const endX = target.x;
    const endY = target.y + 50;
    
    const midX = (startX + endX) / 2;
    
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-4 bg-surface/80 backdrop-blur border border-white/10 p-2 rounded-xl shadow-lg">
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          <button className="p-1.5 text-white bg-primary/20 rounded hover:bg-primary/30"><MousePointer2 size={18}/></button>
          <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Hand size={18}/></button>
        </div>
        <div className="w-px h-6 bg-white/10"></div>
        <h2 className="text-sm font-semibold text-slate-300 pr-2">Interactive ER Diagram: <span className="text-white">User Schema</span></h2>
      </div>

      <div className="absolute top-4 right-6 z-20 flex gap-3">
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-primary/20 transition-all">
          <Download size={14} /> Export SQL
        </button>
      </div>

      {/* Main Canvas Area */}
      <div ref={wrapperRef} className="flex-1 bg-[#0a0b10] relative overflow-auto cursor-grab active:cursor-grabbing">
        {/* Background Grid */}
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
                backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
        ></div>

        <svg ref={svgRef} className="absolute inset-0 w-full h-full min-w-[1000px] min-h-[800px] pointer-events-none z-0">
          <defs>
             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" opacity="0.5" />
             </marker>
          </defs>
          {INITIAL_LINKS.map((link, i) => {
             const s = nodes.find(n => n.id === link.source);
             const t = nodes.find(n => n.id === link.target);
             if (!s || !t) return null;
             return (
               <g key={i}>
                 <path 
                    d={getPath(s, t)} 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                    strokeOpacity="0.5"
                    markerEnd="url(#arrowhead)"
                 />
               </g>
             )
          })}
        </svg>

        {/* HTML Nodes overlaying SVG */}
        <div className="absolute inset-0 w-full h-full min-w-[1000px] min-h-[800px] z-10 pointer-events-none">
          {nodes.map(node => (
            <div
              key={node.id}
              style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
              className="absolute w-60 glass-panel rounded-xl overflow-hidden shadow-2xl pointer-events-auto group hover:ring-1 hover:ring-primary/50 transition-all"
            >
              {/* Node Header */}
              <div className="bg-primary/10 px-4 py-2 border-b border-white/5 flex items-center justify-between group-hover:bg-primary/20 transition-colors">
                <div className="flex items-center gap-2">
                  <Table size={14} className="text-primary" />
                  <span className="text-xs font-bold text-white tracking-wide">{node.name}</span>
                </div>
                <Settings size={12} className="text-white/20 cursor-pointer hover:text-white" />
              </div>
              
              {/* Node Columns */}
              <div className="p-3 flex flex-col gap-2">
                {node.columns.map((col, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] h-5 hover:bg-white/5 px-1 rounded">
                    <div className="flex items-center gap-2">
                      {col.isPk && <span className="text-yellow-500 font-bold w-4">PK</span>}
                      {col.isFk && <span className="text-blue-500 font-bold w-4">FK</span>}
                      {!col.isPk && !col.isFk && <span className="w-4"></span>}
                      <span className="text-slate-300 font-medium">{col.name}</span>
                    </div>
                    <span className="text-slate-600 font-mono text-[9px]">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Properties Panel */}
      <div className="w-72 bg-surface border-l border-white/5 p-4 flex flex-col gap-6 z-20">
         <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Version Control</h3>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 relative">
                <div className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">CURRENT</div>
                <p className="text-xs font-bold text-primary mb-1">v2.4.1 (Draft)</p>
                <p className="text-[10px] text-slate-400">Edited 2m ago by You</p>
            </div>
         </div>
         
         <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Audit Trail</h3>
             <div className="relative pl-4 space-y-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                <div className="relative">
                    <div className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-surface"></div>
                    <p className="text-[11px] text-slate-300">Added <span className="font-mono text-primary">ip_addr</span> to Login_History</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">Today, 10:42 AM</p>
                </div>
                 <div className="relative opacity-60">
                    <div className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full bg-slate-600 ring-4 ring-surface"></div>
                    <p className="text-[11px] text-slate-300">Created User_Profiles</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">Yesterday</p>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default DesignCanvas;