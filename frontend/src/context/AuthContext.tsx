import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sb_stocks_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sb_stocks_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('sb_stocks_token')));

  const persistSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem('sb_stocks_token', nextToken);
    localStorage.setItem('sb_stocks_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then((freshUser) => {
        localStorage.setItem('sb_stocks_user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        localStorage.removeItem('sb_stocks_token');
        localStorage.removeItem('sb_stocks_user');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      async register(name, email, password) {
        const response = await authService.register({ name, email, password });
        persistSession(response.token, response.user);
        toast.success('Welcome to SB Stocks');
        return response.user;
      },
      async login(email, password) {
        const response = await authService.login({ email, password });
        persistSession(response.token, response.user);
        toast.success('Login successful');
        return response.user;
      },
      async adminLogin(email, password) {
        const response = await authService.adminLogin({ email, password });
        persistSession(response.token, response.user);
        toast.success('Admin login successful');
        return response.user;
      },
      async logout() {
        try {
          await authService.logout();
        } catch {
          // Logout still clears the browser session if the token has already expired.
        }

        localStorage.removeItem('sb_stocks_token');
        localStorage.removeItem('sb_stocks_user');
        setToken(null);
        setUser(null);
        toast.success('Logged out');
      },
      updateUser(nextUser) {
        localStorage.setItem('sb_stocks_user', JSON.stringify(nextUser));
        setUser(nextUser);
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
