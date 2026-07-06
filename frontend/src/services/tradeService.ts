import api from './api';
import { PortfolioResponse, Transaction } from '../types';

export const tradeService = {
  portfolio() {
    return api.get<PortfolioResponse>('/trade/portfolio').then((res) => res.data);
  },
  buy(payload: { stockId: string; quantity: number }) {
    return api.post('/trade/buy', payload).then((res) => res.data);
  },
  sell(payload: { stockId: string; quantity: number }) {
    return api.post('/trade/sell', payload).then((res) => res.data);
  },
  transactions() {
    return api.get<Transaction[]>('/trade/transactions').then((res) => res.data);
  },
};

