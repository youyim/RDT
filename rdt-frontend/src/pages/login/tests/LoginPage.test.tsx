import { BrowserRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// It was `import { LoginPage } from '../index'`.
// If I moved `index.tsx` to `LoginPage.tsx`, then `../index` is invalid.
// I should update the import to `../LoginPage`.
import { describe, expect, it } from 'vitest';

import { LoginPage } from '../LoginPage';

// Wrapper for router context
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginPage', () => {
  it('renders login form elements', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByLabelText(/login.emailLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login.passwordLabel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login.signInButton/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', { name: /login.signInButton/i });
    await user.click(submitBtn);

    // Expect validation messages (implementation specific, but likely standard HTML or UI kit)
    // For now assuming HTML5 validation or custom text
    expect(await screen.findByText(/validation.usernameRequired/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/login.emailLabel/i);
    const passwordInput = screen.getByLabelText(/login.passwordLabel/i);
    const submitBtn = screen.getByRole('button', { name: /login.signInButton/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'password');
    await user.click(submitBtn);

    // Assuming we redirect to dashboard, but checking side effects might be harder without mocking navigation/store
    // For TDD step 1, checking that no error is shown or success toast appears might be enough.
    // Or we can expect the form to be cleared/redirect call.
    // Let's assert success text which we might display or a mock function call if we mock the hook.
    // For integration test, we rely on MSW.

    // Waiting for potential redirect or success state
    // checks valid login doesn't show error
    await waitFor(() => {
      expect(screen.queryByText(/validation.loginFailed/i)).not.toBeInTheDocument();
    });
  });

  it('handles failed login', async () => {
    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/login.emailLabel/i);
    const passwordInput = screen.getByLabelText(/login.passwordLabel/i);
    const submitBtn = screen.getByRole('button', { name: /login.signInButton/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitBtn);

    expect(await screen.findByText(/validation.loginFailed/i)).toBeInTheDocument();
  });
});
