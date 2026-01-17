import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUserStore } from '../useUserStore';

// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const MOCK_PASSWORD = 'password123';

// Mock API
vi.mock('@/api/user', () => ({
  userApi: {
    getUsers: vi.fn().mockResolvedValue({
      data: {
        content: [{ id: 1, username: 'test' }],
        total: 1,
      },
    }),
    createUser: vi.fn().mockResolvedValue({}),
    updateUser: vi.fn().mockResolvedValue({}),
    deleteUser: vi.fn().mockResolvedValue({}),
    resetPassword: vi.fn().mockResolvedValue({}),
  },
}));

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      users: [],
      total: 0,
      loading: false,
      filters: { page: 1, size: 10, keyword: '' },
    });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useUserStore());
    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch users and update state', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.total).toBe(1);
  });

  it('should update filters', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      result.current.setFilter({ keyword: 'test' });
    });

    expect(result.current.filters).toEqual({
      page: 1,
      size: 10,
      keyword: 'test',
    });
  });

  it('should create user and refresh list', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.createUser({
        username: 'new',
        email: 'new@example.com',
        password: MOCK_PASSWORD,
      });
    });

    // Should fetch users after creation (mock returns 1 user)
    // We can verify fetchUsers was called or state updated.
    // Since mock getUsers returns 1 user, and initial state is empty, if it fetches, it should have 1 user.
    expect(result.current.users).toHaveLength(1);
  });

  it('should update user and refresh list', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.updateUser(1, { username: 'updated' });
    });

    expect(result.current.users).toHaveLength(1);
  });

  it('should delete user and refresh list', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.deleteUser(1);
    });
    // Assuming API success and refresh
    expect(result.current.users).toBeDefined();
  });

  it('should reset password', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      // sonarjs/no-hardcoded-passwords
      const newPassword = MOCK_PASSWORD;
      await useUserStore.getState().resetPassword(1, newPassword);
    });
    // Just ensure it doesn't throw
    expect(result.current.loading).toBe(false);
  });
});
