export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}
