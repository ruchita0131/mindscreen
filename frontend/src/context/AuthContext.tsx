import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { getMe } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginUser: (token: string, refresh: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'demo@mindscreen.ai',
    role: 'student',
    has_consented: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Demo mode: Do nothing, user is already set
  }, []);

  const loginUser = (token: string, refresh: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refresh);
    getMe().then(setUser);
  };

  const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isLoading, loginUser, logoutUser }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
};
