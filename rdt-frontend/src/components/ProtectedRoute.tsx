import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  readonly children: ReactNode;
}

/**
 * Protected Route Component
 * Check authentication status before rendering children
 * @param props - The component props
 * @param props.children - The child elements to render if authenticated
 * @returns The children if authenticated, otherwise redirects to login
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Mock authentication check for skeleton
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
}
