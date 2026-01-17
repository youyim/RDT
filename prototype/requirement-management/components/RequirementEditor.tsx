import React, { useState } from 'react';
import { 
  BarChart2, 
  Share2, 
  Type,
  List,
  Link,
  Image as ImageIcon,
  CheckSquare,
  PanelRightClose,
  PanelRight,
  Eye,
  PenLine
} from 'lucide-react';

const RequirementEditor: React.FC = () => {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [riceValues, setRiceValues] = useState({
    reach: 1500,
    impact: 3,
    confidence: 80,
    effort: 4
  });

  const [content, setContent] = useState(`### 1. Objective
The primary goal of this requirement is to decouple the order validation logic from the monolithic legacy core and migrate it to the new asynchronous event-driven architecture.

### 2. Functional Requirements
* The system MUST validate inventory levels before finalizing the payment intent.
* The system SHOULD trigger a 'OrderInitiated' event to the Kafka cluster.
* Real-time notifications must be pushed via WebSocket for status updates.

> Note: Ensure backwards compatibility with Mobile App v4.2 clients.`);

  const riceScore = Math.round(
    (riceValues.reach * riceValues.impact * (riceValues.confidence / 100)) / riceValues.effort
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Editor Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          {/* Header Inputs */}
          <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface/50 p-6 rounded-xl border border-white/5">
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Requirement Title</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xl font-semibold text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 outline-none"
                placeholder="e.g. Next-Gen Order Processing Logic"
                defaultValue="Order System Refactoring"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Priority</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-300 outline-none focus:border-primary">
                <option>P0 - Critical Path</option>
                <option>P1 - High Priority</option>
                <option>P2 - Normal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Product Phase</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-300 outline-none focus:border-primary">
                <option>E-Commerce Core / Q4 Refactor</option>
                <option>Billing Service V2</option>
              </select>
            </div>
          </div>

          {/* Editor Area (Dual Column) */}
          <div className="flex-1 flex flex-col border border-white/10 rounded-xl overflow-hidden bg-surface min-h-0">
            {/* Toolbar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Type size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><List size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Link size={18} /></button>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ImageIcon size={18} /></button>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 mr-2">Markdown Enabled</span>
                 <button 
                   onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isRightPanelOpen ? 'bg-primary/10 text-primary border-primary/20' : 'text-slate-400 border-white/10 hover:text-white'}`}
                 >
                   {isRightPanelOpen ? <PanelRightClose size={14} /> : <PanelRight size={14} />}
                   {isRightPanelOpen ? 'Hide Panel' : 'Show Panel'}
                 </button>
              </div>
            </div>
            
            {/* Content Split */}
            <div className="flex-1 flex overflow-hidden">
               {/* Edit Pane */}
               <div className="flex-1 flex flex-col border-r border-white/10 min-w-0">
                  <div className="shrink-0 px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                     <PenLine size={12} /> Write
                  </div>
                  <textarea 
                     className="flex-1 bg-transparent p-6 text-slate-300 font-mono text-sm resize-none outline-none focus:bg-white/[0.02] transition-colors"
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     spellCheck={false}
                  />
               </div>
               
               {/* Preview Pane */}
               <div className="flex-1 flex flex-col bg-black/20 min-w-0">
                  <div className="shrink-0 px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                     <Eye size={12} /> Preview
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto">
                     <div className="prose prose-invert prose-sm max-w-none">
                        {content.split('\n').map((line, i) => {
                           if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">{line.replace('### ', '')}</h3>
                           if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.replace('## ', '')}</h2>
                           if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>
                           if (line.startsWith('> ')) return <div key={i} className="p-3 bg-primary/10 border-l-4 border-primary text-primary-200 text-sm my-4 rounded-r">{line.replace('> ', '')}</div>
                           if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-slate-400 my-1">{line.replace('* ', '')}</li>
                           if (line.trim() === '') return <div key={i} className="h-4" />
                           return <p key={i} className="mb-2 leading-relaxed text-slate-300">{line}</p>
                        })}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Meta & Analysis */}
      <div className={`${isRightPanelOpen ? 'w-80 border-l border-white/5' : 'w-0 opacity-0 overflow-hidden'} transition-all duration-300 ease-in-out bg-surface shrink-0`}>
        <div className="w-80 flex flex-col gap-6 p-6 h-full overflow-y-auto">
          {/* RICE Score Card */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="text-primary" size={20} />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Value Assessment</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-bold uppercase">Reach</span>
                  <span className="text-white">{riceValues.reach} users</span>
                </div>
                <input 
                  type="range" 
                  min="100" max="5000" step="100"
                  value={riceValues.reach}
                  onChange={(e) => setRiceValues({...riceValues, reach: parseInt(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-bold uppercase">Impact</span>
                  <span className="text-primary font-bold">{riceValues.impact}.0</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="5" step="0.5"
                  value={riceValues.impact}
                  onChange={(e) => setRiceValues({...riceValues, impact: parseFloat(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-bold uppercase">Confidence</span>
                  <span className="text-white">{riceValues.confidence}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="10"
                  value={riceValues.confidence}
                  onChange={(e) => setRiceValues({...riceValues, confidence: parseInt(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">RICE Score</p>
                <p className="text-4xl font-bold text-white tracking-tighter">{riceScore}</p>
              </div>
            </div>
          </div>

          {/* Impact Analysis */}
          <div className="glass-panel rounded-xl p-6">
             <div className="flex items-center gap-2 mb-4">
              <Share2 className="text-primary" size={20} />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Impact Analysis</h3>
            </div>
            <div className="space-y-3">
               {['Database Schema Change', 'API Contract Break', 'Security Audit Required'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 cursor-pointer">
                    <div className="mt-0.5">
                      <CheckSquare size={16} className={i === 0 ? "text-primary" : "text-slate-600"} />
                    </div>
                    <p className="text-xs font-bold text-slate-300">{item}</p>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementEditor;