import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Controls } from './components/Controls';
import { UserRow } from './components/UserRow';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-6 md:px-12 py-8">
        {/* Page Title & Main Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-black text-white tracking-tight">Global User Management</h2>
            <p className="text-slate-400">Manage organizational personnel, technical capacities, and system access.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(19,127,236,0.4)] transition-all">
            <span className="material-symbols-outlined">person_add</span>
            + Add New User
          </button>
        </div>

        {/* Search & Filters */}
        <Controls />

        {/* Data Table Panel */}
        <div className="flex-1 glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[1000px]">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/10">
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Avatar / User Name</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Corporate Email</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Account Status</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_USERS.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Showing {MOCK_USERS.length} of 128 registered users</span>
            <div className="flex items-center gap-2">
              <button className="glass-icon-btn p-1.5"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="size-8 rounded-lg bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">1</button>
              <button className="size-8 rounded-lg bg-white/5 text-slate-400 text-xs font-bold hover:bg-white/10 border border-white/5">2</button>
              <button className="size-8 rounded-lg bg-white/5 text-slate-400 text-xs font-bold hover:bg-white/10 border border-white/5">3</button>
              <button className="glass-icon-btn p-1.5"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default App;
