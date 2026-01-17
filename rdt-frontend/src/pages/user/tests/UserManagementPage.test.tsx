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

describe('UserManagementPage', () => {
  beforeEach(() => {
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

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'user_1' } });

    await waitFor(() => {
      expect(useUserStore.getState().filters.keyword).toBe('user_1');
    });
  });

  it('should open modal when Add User is clicked', async () => {
    render(<UserManagementPage />);

    // Click Add User
    fireEvent.click(screen.getByText(/Add User/i));

    await waitFor(() => {
      expect(screen.getByText(/Create User/i)).toBeInTheDocument();
    });
  });

  it('should open reset password modal when Reset is clicked', async () => {
    render(<UserManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('user_1')).toBeInTheDocument();
    });

    // Find the Reset button by title
    const resetBtns = screen.getAllByTitle('Reset Password');
    fireEvent.click(resetBtns[0]);

    await waitFor(() => {
      expect(screen.getByText(/Reset password for/i)).toBeInTheDocument();
    });
  });

  it('should confirm and delete user when Delete is clicked', async () => {
    // Mock confirm to return true
    const mockResponse = {
      data: { content: [], total: 0 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(userApi.getUsers).mockResolvedValueOnce(mockResponse as any);

    render(<UserManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('user_1')).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByTitle('Delete');
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(ui.confirm).toHaveBeenCalled();
    });
  });
});
