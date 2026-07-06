import axios, { AxiosError } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_stocks_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: { message: string }[] }>) => {
    const validationMessage = error.response?.data?.errors?.[0]?.message;
    const message = validationMessage || error.response?.data?.message || error.message;

    return Promise.reject(new Error(message));
  },
);

export default api;

