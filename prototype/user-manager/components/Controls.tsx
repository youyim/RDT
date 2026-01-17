import React from 'react';

export const Controls: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-1 w-full md:max-w-md items-center gap-4">
        <label className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-500 transition-all" 
            placeholder="Search by name or email..." 
            type="text"
          />
        </label>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-slate-200">
          <span className="material-symbols-outlined text-lg text-slate-400">filter_alt</span>
          Filters
        </button>
        <button className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-slate-200">
          <span className="material-symbols-outlined text-lg text-slate-400">download</span>
          Export
        </button>
      </div>
    </div>
  );
};
