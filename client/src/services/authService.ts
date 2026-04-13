import { apiRequest } from './apiClient';

interface LoginResponse {
  token: string;
  username: string;
}

export const authService = {
  login: (username: string, password: string) =>
    apiRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    apiRequest<{ message: string }>('/logout', {
      method: 'POST',
      auth: true,
    }),
};
