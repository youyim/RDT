import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-xl px-6 md:px-12 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(19,127,236,0.3)]">
              <span className="material-symbols-outlined text-white font-bold">group</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
              R&D Process Manager
            </h1>
          </div>
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <a className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="#">Dashboard</a>
            <a className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="#">Resource Scheduler</a>
            <a className="text-sm font-medium text-white border-b-2 border-primary pb-1" href="#">User Console</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-slate-400">settings</span>
          </button>
          <div className="size-9 rounded-full bg-gradient-to-tr from-accent-blue to-blue-400 p-[1px]">
            <div className="w-full h-full rounded-full bg-[#0a0b10] flex items-center justify-center overflow-hidden">
              <img 
                alt="Admin" 
                className="w-full h-full object-cover" 
                src="https://picsum.photos/id/237/200/200"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
