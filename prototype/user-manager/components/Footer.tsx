import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8">
      <div className="glass-panel p-4 rounded-full flex flex-col md:flex-row items-center justify-between shadow-2xl px-8 gap-4 md:gap-0">
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            System Live
          </span>
          <div className="hidden md:block w-px h-4 bg-white/10"></div>
          <span className="text-xs">Database sync successful: Just now</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-slate-500 mr-2">Quick actions:</span>
          <button className="px-4 py-2 rounded-full bg-white/5 text-white font-bold text-xs hover:bg-white/10 transition-all border border-white/10">
            Bulk Import
          </button>
          <button className="px-4 py-2 rounded-full bg-white/5 text-white font-bold text-xs hover:bg-white/10 transition-all border border-white/10">
            User Permissions Map
          </button>
        </div>
      </div>
    </footer>
  );
};
