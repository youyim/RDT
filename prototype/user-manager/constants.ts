import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alex Rivers',
    role: 'Senior Staff Engineer',
    email: 'alex.rivers@corp.tech',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/id/64/100/100'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Principal Architect',
    email: 's.chen@corp.tech',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/id/65/100/100'
  },
  {
    id: '3',
    name: 'Mark Foster',
    role: 'QA Automation Lead',
    email: 'm.foster@corp.tech',
    status: 'Inactive',
    avatarUrl: 'https://picsum.photos/id/91/100/100'
  },
  {
    id: '4',
    name: 'James Huxley',
    role: 'DevOps Engineer',
    email: 'j.huxley@corp.tech',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/id/103/100/100'
  }
];
