import type { LoginResponse, User } from '@/types/auth';
import { request } from '@/utils/request';

export const auth = {
  login: (data: unknown) => {
    return request.post<LoginResponse>('/v1/auth/login', data);
  },
  logout: () => {
    return request.post<null>('/v1/auth/logout');
  },
  getCurrentUser: () => {
    return request.get<User>('/v1/user/me');
  },
};
