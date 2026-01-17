import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UserFormModal } from '../UserFormModal';

describe('UserFormModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  it('should not render when isOpen is false', () => {
    render(<UserFormModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render form fields when open', () => {
    render(<UserFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<UserFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid data', async () => {
    render(<UserFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } });

    // If password is required for create
    const passwordInput = screen.queryByLabelText(/password/i);
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    }

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
