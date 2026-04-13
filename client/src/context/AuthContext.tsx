import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken]       = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));

  const login = useCallback(async (user: string, password: string) => {
    const response = await authService.login(user, password);
    localStorage.setItem('token',    response.token);
    localStorage.setItem('username', response.username);
    setToken(response.token);
    setUsername(response.username);
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setToken(null);
      setUsername(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
