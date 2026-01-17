import React from 'react';
import { User } from '../types';

interface UserRowProps {
  user: User;
}

export const UserRow: React.FC<UserRowProps> = ({ user }) => {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
            <img 
              alt={user.name} 
              className="w-full h-full object-cover" 
              src={user.avatarUrl} 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{user.name}</span>
            <span className="text-[11px] text-slate-500">{user.role}</span>
          </div>
        </div>
      </td>
      
      <td className="p-5 text-sm text-slate-400">{user.email}</td>
      
      <td className="p-5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border 
          ${user.status === 'Active' 
            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
            : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
          }`}>
          <span className={`size-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
          {user.status}
        </span>
      </td>
      
      <td className="p-5">
        <div className="flex items-center justify-end gap-2">
          <button className="glass-icon-btn" title="Edit User">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button className="glass-icon-btn" title="Reset Password">
            <span className="material-symbols-outlined text-sm">lock_reset</span>
          </button>
          <button className="glass-icon-btn hover:text-red-400 hover:border-red-400/50" title="Delete / Archive">
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
