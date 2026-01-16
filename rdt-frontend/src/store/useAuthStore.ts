import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token: string, user: User) => {
        set({ isAuthenticated: true, token, user });
      },
      logout: () => {
        set({ isAuthenticated: false, token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
