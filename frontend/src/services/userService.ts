import api from './api';
import { AdminDashboard, Transaction, User, UserDashboard } from '../types';

export const userService = {
  dashboard() {
    return api.get<UserDashboard>('/dashboard').then((res) => res.data);
  },
  adminDashboard() {
    return api.get<AdminDashboard>('/dashboard/admin').then((res) => res.data);
  },
  profile() {
    return api.get<User>('/users/profile').then((res) => res.data);
  },
  updateProfile(payload: { name?: string; password?: string }) {
    return api.put<{ message: string; user: User }>('/users/profile', payload).then((res) => res.data);
  },
  allUsers() {
    return api.get<User[]>('/users').then((res) => res.data);
  },
  allTransactions() {
    return api.get<Transaction[]>('/users/transactions').then((res) => res.data);
  },
};

