import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

# Card Component
write_file('frontend/src/components/ui/Card.tsx', '''
import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-white/5 backdrop-blur-lg text-card-foreground shadow", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
''')

# Input Component
write_file('frontend/src/components/ui/Input.tsx', '''
import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
''')

# Progress Component
write_file('frontend/src/components/ui/Progress.tsx', '''
import * as React from "react"
import { cn } from "../../lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200/20", className)} {...props}>
    <div className="h-full w-full flex-1 bg-brand-teal transition-all duration-300" style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
''')

# Layout
write_file('frontend/src/components/layout/DashboardLayout.tsx', '''
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Activity, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export function DashboardLayout() {
  const { user, logoutUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Activity className="h-8 w-8 text-brand-teal" />
          <h1 className="text-xl font-bold tracking-wider text-brand-tealL">MindScreen</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/assessment" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
            <Activity className="h-5 w-5" />
            Assessment
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="px-3 py-2 mb-2 text-sm text-gray-400 truncate">
            {user?.email}
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
''')

# Login Page
write_file('frontend/src/pages/Login.tsx', '''
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { login, register } from '../api/auth';
import { useAuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await login({ email, password });
        loginUser(res.access_token, res.refresh_token);
        navigate('/dashboard');
      } else {
        const res = await register({ email, password });
        loginUser(res.access_token, res.refresh_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-brand-navy/50 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-[#1B2A3B]/80 border-white/10 z-10 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-teal/20 p-3 rounded-full">
              <Activity className="h-8 w-8 text-brand-tealL" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <p className="text-gray-400 text-sm mt-2">MindScreen Mental Health Platform</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md text-sm">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>
            
            <Button type="submit" className="w-full bg-brand-teal hover:bg-brand-tealL hover:text-brand-navy transition-all">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-amber hover:text-white text-sm transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
''')

# Dashboard Page
write_file('frontend/src/pages/Dashboard.tsx', '''
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hello, {user?.email?.split('@')[0]}</h1>
        <p className="text-gray-400">Track your mental wellness and insights.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-brand-teal/20 to-[#1B2A3B] border-brand-teal/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <BrainCircuit className="mr-2 h-5 w-5 text-brand-amber" />
              MindScreen Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Our multimodal AI combines your PHQ-9 answers with clinical text analysis to provide deeper insights into your mental state.
            </p>
            <Button onClick={() => navigate('/assessment')} className="bg-brand-teal text-white w-full">
              Start Assessment Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1B2A3B]/80 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Activity className="mr-2 h-5 w-5 text-brand-coral" />
              Recent History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p>No recent assessments.</p>
              <p className="text-sm mt-1">Take your first one to see history here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
''')

# App.tsx Update
write_file('frontend/src/App.tsx', '''
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

const Dummy = ({ title }: { title: string }) => <div className="p-10 text-2xl font-bold text-white">{title}</div>;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assessment" element={<Dummy title="Assessment Coming Soon..." />} />
                <Route path="/results" element={<Dummy title="Results" />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
''')

print("UI components created successfully!")
