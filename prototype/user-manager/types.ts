export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Inactive';
  avatarUrl: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}
