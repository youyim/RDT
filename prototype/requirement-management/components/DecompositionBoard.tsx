import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Plus, 
  GitBranch, 
  Code, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { BusinessRequirement, SystemRequirement, Task } from '../types';

// Mock Data
const MOCK_BRS: BusinessRequirement[] = [
  { id: '1', code: 'BR-102', title: 'Order System Refactoring', description: 'Decouple auth from core', status: 'Approved', priority: 'P0', owner: 'Team Alpha' },
  { id: '2', code: 'BR-105', title: 'Payment Gateway SDK 2.0', description: 'Update Stripe integration', status: 'Review', priority: 'P1', owner: 'Team Beta' },
  { id: '3', code: 'BR-108', title: 'Legacy Data Cleanup', description: 'Archive 2023 logs', status: 'Draft', priority: 'P2', owner: 'Team Ops' },
];

const MOCK_SRS: SystemRequirement[] = [
  { id: 's1', brId: '1', code: 'SR-544-A', title: 'API Gateway Auth Update', atomicSystem: 'Auth-Core-v2', uiChange: false },
  { id: 's2', brId: '1', code: 'SR-544-B', title: 'Inventory Service Migration', atomicSystem: 'Inv-Dist-Prod', uiChange: false },
  { id: 's3', brId: '2', code: 'SR-601-A', title: 'Frontend SDK Integration', atomicSystem: 'Web-Client', uiChange: true },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', srId: 's1', title: 'Update JWT Middleware', type: 'Development', assignee: 'Sarah M.', estimate: 4, status: 'In Progress' },
  { id: 't2', srId: 's1', title: 'Refactor Route Guard', type: 'Development', assignee: 'Alex K.', estimate: 2, status: 'Todo' },
  { id: 't3', srId: 's1', title: 'Security Regression Test', type: 'QA', assignee: 'Dave L.', estimate: 8, status: 'Todo' },
];

const DecompositionBoard: React.FC = () => {
  const [selectedBrId, setSelectedBrId] = useState<string>('1');
  const [selectedSrId, setSelectedSrId] = useState<string>('s1');

  const filteredSrs = MOCK_SRS.filter(sr => sr.brId === selectedBrId);
  const filteredTasks = MOCK_TASKS.filter(task => task.srId === selectedSrId);

  return (
    <div className="flex h-full p-6 gap-4 overflow-hidden">
      
      {/* Column 1: Business Requirements */}
      <div className="flex flex-col w-1/4 glass-panel rounded-xl overflow-hidden min-w-[300px]">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="font-bold text-xs tracking-widest uppercase text-slate-400">Business Req (BR)</h3>
            <p className="text-[10px] text-slate-600 mt-1">{MOCK_BRS.length} active objectives</p>
          </div>
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400"><Filter size={14}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {MOCK_BRS.map(br => (
            <div 
              key={br.id}
              onClick={() => setSelectedBrId(br.id)}
              className={`p-4 rounded-lg cursor-pointer border transition-all ${
                selectedBrId === br.id 
                  ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(19,127,236,0.1)]' 
                  : 'glass-card border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border tracking-tighter ${
                  selectedBrId === br.id ? 'text-primary bg-primary/10 border-primary/20' : 'text-slate-500 bg-white/5 border-white/10'
                }`}>
                  {br.code}
                </span>
                <MoreHorizontal size={14} className="text-slate-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-200 leading-tight mb-2">{br.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{br.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Connector */}
      <div className="flex flex-col justify-center text-slate-700">
        <ChevronRight size={24} />
      </div>

      {/* Column 2: System Requirements */}
      <div className="flex flex-col w-1/3 glass-panel rounded-xl overflow-hidden min-w-[320px]">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="font-bold text-xs tracking-widest uppercase text-slate-400">System Req (SR)</h3>
            <p className="text-[10px] text-slate-600 mt-1">Linked to {MOCK_BRS.find(b => b.id === selectedBrId)?.code}</p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-primary/90 transition-all">
            <Plus size={14} /> Add SR
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {filteredSrs.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                <p className="text-xs">No System Requirements yet</p>
             </div>
          ) : (
            filteredSrs.map(sr => (
              <div 
                key={sr.id}
                onClick={() => setSelectedSrId(sr.id)}
                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                  selectedSrId === sr.id 
                    ? 'bg-primary/10 border-primary/50' 
                    : 'glass-card border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-400 tracking-tighter">{sr.code}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase">{sr.uiChange ? 'UI Change' : 'Backend Only'}</span>
                    <div className={`w-2 h-2 rounded-full ${sr.uiChange ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-200 mb-4">{sr.title}</h4>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase block mb-1">Atomic System</label>
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                    <GitBranch size={12} /> {sr.atomicSystem}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Arrow Connector */}
      <div className="flex flex-col justify-center text-slate-700">
        <ChevronRight size={24} />
      </div>

      {/* Column 3: Tasks */}
      <div className="flex flex-col flex-1 glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="font-bold text-xs tracking-widest uppercase text-slate-400">Execution Tasks</h3>
            <p className="text-[10px] text-slate-600 mt-1">Active SR: {MOCK_SRS.find(s => s.id === selectedSrId)?.code || 'None'}</p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
            <Plus size={14} /> Add Task
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-black/20">
          {/* Group: Development */}
          <div className="px-4 py-2 bg-white/5 border-y border-white/5 flex items-center gap-2">
            <Code size={12} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Development</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {filteredTasks.filter(t => t.type === 'Development').map(task => (
              <div key={task.id} className="glass-card p-3 rounded-lg flex items-center gap-4 group hover:bg-white/[0.07]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium text-slate-200">{task.title}</h5>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      task.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={10} /> {task.estimate}h</span>
                    <span>{task.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Group: QA */}
          <div className="px-4 py-2 bg-white/5 border-y border-white/5 flex items-center gap-2 mt-2">
            <CheckCircle2 size={12} className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quality Assurance</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
             {filteredTasks.filter(t => t.type === 'QA').map(task => (
              <div key={task.id} className="glass-card p-3 rounded-lg flex items-center gap-4 group hover:bg-white/[0.07]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium text-slate-200">{task.title}</h5>
                     <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      task.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={10} /> {task.estimate}h</span>
                    <span>{task.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex justify-between items-center">
            <div className="text-xs text-slate-400">Total Effort: <span className="text-white font-bold">{filteredTasks.reduce((acc, t) => acc + t.estimate, 0)}h</span></div>
            <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">Generate Spec</button>
        </div>
      </div>

    </div>
  );
};

export default DecompositionBoard;