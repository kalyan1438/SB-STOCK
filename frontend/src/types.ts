export type Role = 'user' | 'admin';
export type TradeType = 'BUY' | 'SELL';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  virtualBalance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

export interface Stock {
  _id: string;
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  description?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  logoUrl?: string;
  history: StockHistoryPoint[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioItem {
  _id: string;
  stock: Stock;
  quantity: number;
  averagePrice: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  updatedAt: string;
}

export interface PortfolioResponse {
  holdings: PortfolioItem[];
  summary: {
    investedAmount: number;
    currentValue: number;
    gainLoss: number;
    gainLossPercent: number;
  };
}

export interface Transaction {
  _id: string;
  user?: Pick<User, '_id' | 'name' | 'email'>;
  stock: Pick<Stock, '_id' | 'symbol' | 'name' | 'currentPrice'>;
  order?: {
    _id: string;
    status: string;
  };
  type: TradeType;
  quantity: number;
  price: number;
  total: number;
  balanceAfter: number;
  note?: string;
  createdAt: string;
}

export interface UserDashboard {
  balance: number;
  portfolioValue: number;
  investedAmount: number;
  totalEquity: number;
  gainLoss: number;
  holdingsCount: number;
  recentTransactions: Transaction[];
  watchlist: Stock[];
}

export interface AdminDashboard {
  usersCount: number;
  stocksCount: number;
  ordersCount: number;
  transactionsCount: number;
  tradeVolume: number;
  recentTransactions: Transaction[];
}

export interface StockFormPayload {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  description: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  logoUrl?: string;
}

