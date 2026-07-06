import api from './api';
import { User } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  register(payload: { name: string; email: string; password: string }) {
    return api.post<AuthResponse>('/auth/register', payload).then((res) => res.data);
  },
  login(payload: { email: string; password: string }) {
    return api.post<AuthResponse>('/auth/login', payload).then((res) => res.data);
  },
  adminLogin(payload: { email: string; password: string }) {
    return api.post<AuthResponse>('/auth/admin/login', payload).then((res) => res.data);
  },
  me() {
    return api.get<{ user: User }>('/auth/me').then((res) => res.data.user);
  },
  logout() {
    return api.post<{ message: string }>('/auth/logout').then((res) => res.data);
  },
};

