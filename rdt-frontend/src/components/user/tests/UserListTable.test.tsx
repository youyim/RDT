import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UserStatus } from '@/types/user';

import { UserListTable } from '../UserListTable';

const mockUsers = [
  {
    id: 1,
    username: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    status: UserStatus.ACTIVE,
    createdAt: '2023-01-01',
  },
];

describe('UserListTable', () => {
  it('should render table headers', () => {
    // Props might change, let's assume it accepts data props
    // Or if it reads from store internally?
    // The design doc said "Dumb Component" receiving props.
    // So let's update call to pass props.
    // But current skeletal component doesn't accept props.
    // TypeScript will complain in test if I pass props that don't exist in type.
    // So I need to update the Component type definition first?
    // Or cast it in test.
    // Let's assume prop interface: { data: UserDTO[], loading: boolean, onAction: ... }

    render(<UserListTable data={mockUsers} loading={false} onAction={() => {}} />);

    expect(screen.getByText('user.nameLine')).toBeInTheDocument();
    expect(screen.getByText('user.email')).toBeInTheDocument();
    expect(screen.getByText('user.status')).toBeInTheDocument();
    expect(screen.getByText('user.action')).toBeInTheDocument();
  });

  it('should render user data', () => {
    render(<UserListTable data={mockUsers} loading={false} onAction={() => {}} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
