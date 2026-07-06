import api from './api';
import { Stock, StockFormPayload } from '../types';

export const stockService = {
  list(params?: { q?: string; sector?: string; sort?: string }) {
    return api.get<Stock[]>('/stocks', { params }).then((res) => res.data);
  },
  get(id: string) {
    return api.get<Stock>(`/stocks/${id}`).then((res) => res.data);
  },
  create(payload: StockFormPayload) {
    return api.post<{ message: string; stock: Stock }>('/stocks', payload).then((res) => res.data);
  },
  update(id: string, payload: StockFormPayload) {
    return api.put<{ message: string; stock: Stock }>(`/stocks/${id}`, payload).then((res) => res.data);
  },
  remove(id: string) {
    return api.delete<{ message: string }>(`/stocks/${id}`).then((res) => res.data);
  },
};

