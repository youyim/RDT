import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Plus } from 'lucide-react';

import { ResetPasswordModal } from '@/components/user/ResetPasswordModal';
import { UserFormModal } from '@/components/user/UserFormModal';
import { UserListTable } from '@/components/user/UserListTable';
import { UserSearch } from '@/components/user/UserSearch';
import { useUserStore } from '@/store/useUserStore';
import type { CreateUserRequest, UserDTO } from '@/types/user';
import { ui } from '@/utils/ui';

export const UserManagementPage = () => {
  const { t } = useTranslation();
  const {
    users,
    loading,
    fetchUsers,
    setFilter,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
  } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | undefined>(undefined);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (keyword: string) => {
    setFilter({ keyword, page: 1 });
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleCloseResetModal = () => {
    setIsResetModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleSubmit = async (data: CreateUserRequest) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        ui.success(t('user.updateSuccess'));
      } else {
        await createUser(data);
        ui.success(t('user.createSuccess'));
      }
    } catch (error) {
      console.error(error);
      ui.error(t('user.operationFailed'));
    }
  };

  const handleResetSubmit = async (password: string) => {
    if (!selectedUser) return;
    try {
      await resetPassword(selectedUser.id, password);
      ui.success(t('user.resetSuccess'));
    } catch (error) {
      console.error(error);
      ui.error(t('user.resetFailed'));
    }
  };

  const handleAction = async (type: 'edit' | 'reset' | 'delete', user: UserDTO) => {
    if (type === 'edit') {
      setSelectedUser(user);
      setIsModalOpen(true);
    } else if (type === 'delete') {
      // Confirm delete
      const confirmed = ui.confirm(t('user.deleteConfirm'));
      if (confirmed) {
        try {
          await deleteUser(user.id);
          ui.success(t('user.deleteSuccess'));
        } catch (error) {
          console.error(error);
          ui.error(t('user.deleteFailed'));
        }
      }
    } else if (type === 'reset') {
      setSelectedUser(user);
      setIsResetModalOpen(true);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 md:px-12">
        {/* Page Title & Main Action */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-black tracking-tight text-white">
              {t('user.title', 'Global User Management')}
            </h2>
            <p className="text-slate-400">
              {t(
                'user.description',
                'Manage organizational personnel, technical capacities, and system access.'
              )}
            </p>
          </div>
          <button
            className="bg-primary shadow-primary/40 flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110"
            onClick={() => handleCreate()}
          >
            <Plus className="h-4 w-4" />
            {t('user.addUser', 'Add New User')}
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <UserSearch onSearch={handleSearch} />
        </div>

        {/* Data Table Panel */}
        <UserListTable
          data={users}
          loading={loading}
          onAction={(type, user) => void handleAction(type, user)}
        />

        <UserFormModal
          initialData={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />

        <ResetPasswordModal
          isOpen={isResetModalOpen}
          user={selectedUser}
          onClose={handleCloseResetModal}
          onSubmit={handleResetSubmit}
        />
      </main>
    </div>
  );
};
