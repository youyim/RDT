import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/pages/login/LoginPage';

/**
 * Application Router Configuration
 * Minimal skeleton - add your routes below
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Add protected routes here
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Navigate replace to="/auth/login" />,
  },
];

const router = createBrowserRouter(routes);

export { router };
