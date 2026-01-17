import { create } from 'zustand';

import { userApi } from '@/api/user';
import type { CreateUserRequest, UpdateUserRequest, UserDTO, UserFilter } from '@/types/user';

interface UserState {
  users: UserDTO[];
  total: number;
  loading: boolean;
  filters: UserFilter;
  requestLoading: boolean;
  fetchUsers: () => Promise<void>;
  setFilter: (patch: Partial<UserFilter>) => void;
  createUser: (data: CreateUserRequest) => Promise<void>;
  updateUser: (id: number, data: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  resetPassword: (id: number, password: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  filters: {
    page: 1,
    size: 10,
    keyword: '',
  },
  requestLoading: false,
  fetchUsers: async () => {
    const { loading, filters } = get();
    if (loading) return;

    set({ loading: true });
    try {
      const response = await userApi.getUsers(filters);
      const payload = response.data;
      if (payload) {
        set({
          users: payload.records || [],
          total: payload.total || 0,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error(error);
    }
  },
  setFilter: (patch) => {
    set((state) => ({ filters: { ...state.filters, ...patch } }));
    get()
      .fetchUsers()
      .catch((error) => console.error(error));
  },
  createUser: async (data) => {
    set({ requestLoading: true });
    try {
      await userApi.createUser(data);
      await get().fetchUsers();
    } finally {
      set({ requestLoading: false });
    }
  },
  updateUser: async (id, data) => {
    set({ requestLoading: true });
    try {
      await userApi.updateUser(id, data);
      await get().fetchUsers();
    } finally {
      set({ requestLoading: false });
    }
  },
  deleteUser: async (id) => {
    set({ requestLoading: true });
    try {
      await userApi.deleteUser(id);
      await get().fetchUsers();
    } finally {
      set({ requestLoading: false });
    }
  },
  resetPassword: async (id, password) => {
    set({ requestLoading: true });
    try {
      await userApi.resetPassword(id, { password });
    } finally {
      set({ requestLoading: false });
    }
  },
}));
