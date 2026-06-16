import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

# Types
write_file('frontend/src/types/auth.ts', '''
export interface User {
  id: number;
  email: string;
  role: 'student' | 'counsellor' | 'admin';
  has_consented: boolean;
}
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
''')

write_file('frontend/src/types/assessment.ts', '''
export interface PHQSubmitRequest {
  answers: number[];
}
export interface PredictTextRequest {
  text: string;
}
export interface RiskResponse {
  risk_level: 'minimal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
  probabilities: {
    minimal: number;
    mild: number;
    moderate: number;
    severe: number;
  };
  shap_explanation: {
    words?: { word: string; value: number }[];
    phq_factors?: { question: string; value: number }[];
  } | null;
  crisis_flag: boolean;
  helplines?: string[] | null;
}
''')

# API
write_file('frontend/src/api/auth.ts', '''
import { apiClient } from './client';
import { User, TokenResponse } from '../types/auth';

export const login = async (data: any): Promise<TokenResponse> => {
  const res = await apiClient.post('/api/auth/login', data);
  return res.data;
};
export const register = async (data: any): Promise<TokenResponse> => {
  const res = await apiClient.post('/api/auth/register', data);
  return res.data;
};
export const getMe = async (): Promise<User> => {
  const res = await apiClient.get('/api/auth/me');
  return res.data;
};
''')

write_file('frontend/src/api/assessment.ts', '''
import { apiClient } from './client';
import { PHQSubmitRequest, PredictTextRequest, RiskResponse } from '../types/assessment';

export const predictFused = async (phq: PHQSubmitRequest, text: PredictTextRequest): Promise<RiskResponse> => {
  const res = await apiClient.post('/api/predict/fused', { answers: phq.answers, text: text.text });
  return res.data;
};
''')

# Hooks
write_file('frontend/src/hooks/useAssessment.ts', '''
import { useMutation } from '@tanstack/react-query';
import { predictFused } from '../api/assessment';
import { PHQSubmitRequest, PredictTextRequest } from '../types/assessment';

export const usePredictFused = () => {
  return useMutation({
    mutationFn: ({ phq, text }: { phq: PHQSubmitRequest; text: PredictTextRequest }) => predictFused(phq, text),
  });
};
''')

# Context
write_file('frontend/src/context/AuthContext.tsx', '''
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getMe().then(setUser).catch(() => logoutUser()).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
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
''')

# Layout
write_file('frontend/src/components/layout/ProtectedRoute.tsx', '''
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{allowedRoles?: string[]}> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
''')

# App
write_file('frontend/src/App.tsx', '''
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

const queryClient = new QueryClient();

const Dummy = ({ title }: { title: string }) => <div className="p-10 text-2xl font-bold">{title}</div>;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Dummy title="Login Page" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dummy title="Dashboard" />} />
              <Route path="/assessment" element={<Dummy title="Assessment" />} />
            </Route>
            <Route path="*" element={<Dummy title="404 Not Found" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
''')

# Main
write_file('frontend/src/main.tsx', '''
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
''')

print("Frontend setup complete!")
