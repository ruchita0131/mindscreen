import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Heart, 
  Calendar, 
  BookOpen, 
  Mic, 
  Wind, 
  Sparkles, 
  Moon, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  MessageSquareHeart 
} from 'lucide-react';
import { SaathiDrawer } from '../saathi/SaathiDrawer';

export function DashboardLayout() {
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaathiOpen, setIsSaathiOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navJourney = [
    { name: 'Overview',         path: '/dashboard',  icon: LayoutDashboard, desc: 'Your wellbeing space' },
    { name: 'Mood Tracker',    path: '/mood',       icon: Heart,           desc: 'Daily check-in' },
    { name: 'Check-ins',       path: '/assessment', icon: Calendar,        desc: 'PHQ-9 screening' },
    { name: 'History',         path: '/history',    icon: BookOpen,        desc: 'Past reflections' },
  ];

  const navTools = [
    { name: 'Breathing Space', path: '#breathing', icon: Wind,     desc: '4-7-8 Pranayama', onClick: () => setIsSaathiOpen(true) },
    { name: 'Self-care Library',path: '#selfcare',  icon: Sparkles, desc: 'Grounding tools',  onClick: () => setIsSaathiOpen(true) },
    { name: 'Relax & Meditate', path: '#relax',     icon: Moon,     desc: 'Calm audio',       onClick: () => setIsSaathiOpen(true) },
  ];

  return (
    <div className="flex h-screen bg-[#FAF7F2] text-[#2D3B30] overflow-hidden relative font-sans">
      
      {/* Subtle Organic Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 10% 10%, rgba(212, 224, 204, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 85%, rgba(248, 223, 216, 0.4) 0%, transparent 60%)
          `
        }}
      />

      {/* ── SIDEBAR (Matching Screenshot media_1787549566641.jpg) ── */}
      <aside className="w-64 flex-shrink-0 bg-[#F4EFE6] border-r border-[#E3EBDC] flex flex-col relative z-20">
        
        {/* Logo */}
        <div className="p-6 border-b border-[#E3EBDC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#3A4D3F] flex items-center justify-center text-white shadow-xs">
              <span className="text-lg">🌿</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-[#2D3B30]">MindScreen</h1>
              <p className="text-[11px] text-[#526656] font-medium">your wellbeing space</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          
          {/* JOURNEY SECTION */}
          <div>
            <p className="text-[10px] text-[#526656] uppercase tracking-widest font-bold px-3 mb-2">
              JOURNEY
            </p>
            <div className="space-y-1">
              {navJourney.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#E3EBDC] text-[#2D3B30] font-bold shadow-2xs'
                        : 'text-[#526656] hover:bg-[#E3EBDC]/50 hover:text-[#2D3B30]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#3A4D3F]' : 'text-[#526656]'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* WELLBEING TOOLS SECTION */}
          <div>
            <p className="text-[10px] text-[#526656] uppercase tracking-widest font-bold px-3 mb-2">
              WELLBEING TOOLS
            </p>
            <div className="space-y-1">
              {navTools.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[#526656] hover:bg-[#E3EBDC]/50 hover:text-[#2D3B30] transition-all text-left"
                  >
                    <Icon className="w-4 h-4 text-[#526656]" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRIVACY CARD */}
          <div className="p-4 rounded-2xl bg-[#E3EBDC]/60 border border-[#D4E0CC] space-y-1">
            <div className="flex items-center gap-2 text-[#3A4D3F] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#3A4D3F]" />
              <span>Your privacy matters</span>
            </div>
            <p className="text-[11px] text-[#526656] leading-snug">
              All your data is private, confidential, and secure.
            </p>
          </div>

        </div>

        {/* User Footer with Botanical Touch */}
        <div className="p-4 border-t border-[#E3EBDC] bg-[#F4EFE6]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/70 mb-2 border border-[#E3EBDC]">
            <div className="w-8 h-8 rounded-full bg-[#F8DFD8] text-[#3A4D3F] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'R'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate text-[#2D3B30]">{user?.email?.split('@')[0] || 'Ruchita'}</p>
              <p className="text-[10px] text-[#526656] truncate">{user?.email || 'ruchita@mindscreen.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#526656] hover:text-red-600 hover:bg-rose-50 transition-all font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto relative z-10">
        
        {/* Top Bar Header (Good morning, Ruchita) */}
        <header className="sticky top-0 z-30 px-8 py-4 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E3EBDC] flex items-center justify-end gap-4">
          <button 
            onClick={() => setIsSaathiOpen(true)}
            className="px-4 py-2 rounded-full bg-[#E3EBDC] hover:bg-[#D4E0CC] text-[#3A4D3F] font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
          >
            <span>🌿 Talk to Saathi</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-medium text-[#526656]">
            <span>Good morning, {user?.email?.split('@')[0] || 'Ruchita'} 🌿</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-70px)]">
          <Outlet />
        </div>
      </main>

      {/* Persistent Floating Button: 🌿 Talk to Saathi (Bottom Right) */}
      <button
        onClick={() => setIsSaathiOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full bg-[#3A4D3F] hover:bg-[#2D3B30] text-[#FAF7F2] font-bold text-sm shadow-xl flex items-center gap-2.5 transition-all hover:scale-105"
      >
        <span className="text-base">🌿</span>
        <span>Talk to Saathi</span>
      </button>

      {/* Saathi Companion Drawer */}
      <SaathiDrawer isOpen={isSaathiOpen} onClose={() => setIsSaathiOpen(false)} />

    </div>
  );
}
