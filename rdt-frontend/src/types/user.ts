export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  createdAt: string;
}

export const UserStatus = {
  DISABLED: 0,
  ACTIVE: 1,
  LOCKED: 2,
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  avatar: string;
  status: UserStatus;
  createdAt: string;
}

export interface UserFilter {
  page: number;
  size: number;
  keyword?: string;
}

export interface UserListResponse {
  total: number;
  current: number;
  size: number;
  pages: number;
  records: UserDTO[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  status?: UserStatus;
}
