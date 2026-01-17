import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserDTO,
  UserFilter,
  UserListResponse,
} from '@/types/user';
import { request } from '@/utils/request';

export const userApi = {
  getUsers: (params: UserFilter) => {
    return request.get<UserListResponse>('/v1/users', { params });
  },

  getUser: (id: number) => {
    return request.get<UserDTO>(`/v1/users/${id}`);
  },

  createUser: (data: CreateUserRequest) => {
    return request.post<UserDTO>('/v1/users', data);
  },

  updateUser: (id: number, data: UpdateUserRequest) => {
    return request.put<UserDTO>(`/v1/users/${id}`, data);
  },

  deleteUser: (id: number) => {
    return request.delete<null>(`/v1/users/${id}`);
  },

  resetPassword: (id: number, data: { password: string }) => {
    return request.post<null>(`/v1/users/${id}/reset-password`, data);
  },
};
