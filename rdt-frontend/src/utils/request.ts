import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ui } from '@/utils/ui';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Authorization Header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // Direct return if it's a blob or not strict API JSON
    if (
      response.config.responseType === 'blob' ||
      response.headers['content-type']?.includes('text/event-stream')
    ) {
      return response;
    }

    const res = response.data as ApiResponse;

    // Check custom code if backend follows {code, message, data} pattern
    // Adjust 200/0 based on actual backend contract. Assuming 200 is success.
    if (res.code !== 200 && res.code !== 0) {
      // Some backends use 0 for success
      ui.error(res.message || 'Error');

      // Handle 401 Unauthorized
      if (res.code === 401) {
        localStorage.removeItem('token');
        globalThis.location.href = '/login';
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // Axios interceptor type requires AxiosResponse, but we transform to ApiResponse
    // Cast through unknown is intentional for response transformation
    return res as unknown as AxiosResponse;
  },
  (error: AxiosError<ApiResponse>) => {
    let message = 'Network Error';
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = 'Unauthorized';
          localStorage.removeItem('token');
          break;
        case 403:
          message = 'Forbidden';
          break;
        case 404:
          message = 'Resource Not Found';
          break;
        case 500:
          message = 'Internal Server Error';
          break;
        default:
          message = error.response.data?.message || `Error ${error.response.status}`;
      }
    }
    ui.error(message);
    return Promise.reject(error);
  }
);

export const request = service;
