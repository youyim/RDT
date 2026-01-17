import { useTranslation } from 'react-i18next';

import { Edit2, Lock, Trash2 } from 'lucide-react';

import { UserStatusBadge } from '@/components/user/UserStatusBadge';
import type { UserDTO } from '@/types/user';

interface UserListTableProps {
  data: UserDTO[];
  loading: boolean;
  onAction: (type: 'edit' | 'reset' | 'delete', user: UserDTO) => void;
}

export const UserListTable = ({ data, loading, onAction }: Readonly<UserListTableProps>) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="glass-panel w-full overflow-hidden rounded-2xl shadow-2xl">
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex animate-pulse items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-64 rounded bg-white/5" />
                <div className="h-3 w-48 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-panel flex min-h-96 flex-col items-center justify-center rounded-2xl p-8 text-center shadow-2xl">
        <div className="mb-4 rounded-full bg-white/5 p-4">
          <div className="h-12 w-12 text-slate-500 opacity-50">{t('user.empty', 'Empty')}</div>
        </div>
        <h3 className="text-lg font-medium text-white">{t('user.noUsers')}</h3>
        <p className="mt-2 text-sm text-slate-400">
          {t('user.noUsersDesc', 'No users found matching your criteria.')}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel flex w-full flex-col overflow-hidden rounded-2xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="p-5 text-xs font-black tracking-widest text-slate-500 uppercase">
                {t('user.nameLine', 'Avatar / User Name')}
              </th>
              <th className="p-5 text-xs font-black tracking-widest text-slate-500 uppercase">
                {t('user.email', 'Corporate Email')}
              </th>
              <th className="p-5 text-xs font-black tracking-widest text-slate-500 uppercase">
                {t('user.status', 'Account Status')}
              </th>
              <th className="sticky right-0 z-10 bg-slate-950 p-5 text-right text-xs font-black tracking-widest text-slate-500 uppercase shadow-xl">
                {t('user.action', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((user) => (
              <tr key={user.id} className="group transition-colors hover:bg-white/[0.02]">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-800">
                      {user.avatar ? (
                        <img
                          alt={user.username}
                          className="h-full w-full object-cover"
                          src={user.avatar}
                        />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{user.username}</span>
                      <span className="text-xs text-slate-500">
                        {t('user.userId', 'ID: {{id}}', { id: user.id })}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-sm text-slate-400">{user.email || '-'}</td>
                <td className="p-5">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="sticky right-0 border-b border-white/5 bg-slate-950 p-5 shadow-xl transition-colors group-hover:bg-slate-900">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="glass-icon-btn"
                      title={t('user.edit', 'Edit User')}
                      onClick={() => onAction('edit', user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="glass-icon-btn"
                      title={t('user.resetPassword', 'Reset Password')}
                      onClick={() => onAction('reset', user)}
                    >
                      <Lock className="h-4 w-4" />
                    </button>
                    <button
                      className="glass-icon-btn hover:border-red-400/50 hover:text-red-400"
                      title={t('user.delete', 'Delete')}
                      onClick={() => onAction('delete', user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.01] p-4">
        <span className="text-xs font-medium text-slate-500">
          {t('user.showingUsers', 'Showing {{count}} users', { count: data.length })}
        </span>
        <div className="pointer-events-none flex items-center gap-2 opacity-50">
          <button className="glass-icon-btn p-1.5">
            <span className="text-sm">←</span>
          </button>
          <button className="bg-primary shadow-primary/20 size-8 rounded-lg text-xs font-bold text-white shadow-lg">
            1
          </button>
          <button className="glass-icon-btn p-1.5">
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
