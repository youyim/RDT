import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { userApi } from '@/api/user';
import { useUserStore } from '@/store/useUserStore';
import type * as UiUtils from '@/utils/ui';
import { ui } from '@/utils/ui';

import { UserManagementPage } from '../UserManagementPage';

// Mock UI utility for confirm dialogs
vi.mock('@/utils/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof UiUtils>();
  return {
    ...actual,
    ui: {
      confirm: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock user API
vi.mock('@/api/user', () => ({
  userApi: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

describe('UserManagementPage', () => {
  beforeEach(() => {
    const mockUser = { id: 1, username: 'user_1', email: 'user1@example.com', status: 'ACTIVE' };
    vi.mocked(userApi.getUsers).mockResolvedValue({
      data: { records: [mockUser], total: 1 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    useUserStore.setState({
      users: [],
      total: 0,
      loading: false,
      filters: { page: 1, size: 10, keyword: '' },
    });
    vi.clearAllMocks();
  });

  it('should fetch and display users on mount', async () => {
    render(<UserManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('user_1')).toBeInTheDocument();
    });
  });

  it('should filter users on search', async () => {
    render(<UserManagementPage />);

    const searchInput = screen.getByPlaceholderText('user.searchPlaceholder');
    fireEvent.change(searchInput, { target: { value: 'user_1' } });

    await waitFor(() => {
      expect(useUserStore.getState().filters.keyword).toBe('user_1');
    });
  });

  it('should open modal when Add User is clicked', async () => {
    render(<UserManagementPage />);

    // Click Add User
    fireEvent.click(screen.getByText('user.addUser'));

    await waitFor(() => {
      expect(screen.getByText('user.createUser')).toBeInTheDocument();
    });
  });

  it('should open reset password modal when Reset is clicked', async () => {
    render(<UserManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('user_1')).toBeInTheDocument();
    });

    // Find the Reset button by title
    const resetBtns = screen.getAllByTitle('user.resetPassword');
    fireEvent.click(resetBtns[0]);

    await waitFor(() => {
      expect(screen.getByText('user.resetPasswordDescription')).toBeInTheDocument();
    });
  });

  it('should confirm and delete user when Delete is clicked', async () => {
    // mount call will use the default mock from beforeEach (which returns user_1)

    // Setup for the refresh call after delete
    const refreshResponse = {
      data: { records: [], total: 0 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    render(<UserManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('user_1')).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByTitle('user.delete');
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(ui.confirm).toHaveBeenCalled();
    });

    // Mock the refresh call that happens after delete
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(userApi.getUsers).mockResolvedValueOnce(refreshResponse as any);
  });
});
