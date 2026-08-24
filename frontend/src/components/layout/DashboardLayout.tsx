import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ClipboardList, LogOut, History, Heart, ChevronRight, Brain, ShieldAlert, Sparkles, MessageSquareHeart } from 'lucide-react';
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

  const navItems = [
    { name: 'Dashboard',         path: '/dashboard',  icon: LayoutDashboard,    description: 'Overview & trends' },
    { name: 'Saathi Companion', path: '/sukhoon',    icon: MessageSquareHeart, description: 'Your wellbeing companion' },
    { name: 'New Assessment',    path: '/assessment', icon: ClipboardList,      description: 'Start screening' },
    { name: 'History',           path: '/history',    icon: History,            description: 'Past results' },
    { name: 'Mood Tracker',      path: '/mood',       icon: Heart,              description: 'Daily check-in' },
    { name: 'Counselor Portal',  path: '/counselor',  icon: ShieldAlert,        description: 'Privacy oversight', isSpecial: true },
  ];

  return (
    <div className="flex h-screen bg-[#1D1722] text-[#E6E2EB] overflow-hidden relative font-sans">
      
      {/* Ambient Twilight Background Glows */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 10% 10%, rgba(198, 172, 214, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(142, 168, 195, 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside 
        className="w-64 flex-shrink-0 bg-[#261F2E]/60 border-r border-[#C6ACD6]/15 flex flex-col relative z-20 backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#C6ACD6]/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#81B29A]/15 border border-[#81B29A]/30 flex items-center justify-center">
              <Brain className="text-[#94D2BD] w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-title text-xl font-bold tracking-wider text-[#FFE8C2]">MindScreen</h1>
              <p className="text-[10px] text-[#C6ACD6]/60 uppercase tracking-widest">
                Multimodal AI Screening
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] text-[#C6ACD6]/50 uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-[#FFE8C2]/15 text-[#FFE8C2] border border-[#FFE8C2]/30 font-bold shadow-[0_0_15px_rgba(255,232,194,0.15)]'
                      : 'bg-[#81B29A]/15 text-[#94D2BD] border border-[#81B29A]/30 font-semibold'
                    : item.isSpecial
                    ? 'text-[#FFE8C2]/80 hover:text-[#FFE8C2] hover:bg-[#FFE8C2]/10 border border-[#FFE8C2]/20 mt-4'
                    : 'text-[#C6ACD6]/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? item.isSpecial ? 'bg-[#FFE8C2]/25' : 'bg-[#81B29A]/25'
                    : item.isSpecial ? 'bg-[#FFE8C2]/10' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-tight">{item.name}</p>
                  <p className="text-[11px] text-[#C6ACD6]/50 leading-tight">{item.description}</p>
                </div>
                {isActive && (
                  <ChevronRight className={`w-3.5 h-3.5 ml-auto flex-shrink-0 ${item.isSpecial ? 'text-[#FFE8C2]' : 'text-[#94D2BD]'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-[#C6ACD6]/15">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] mb-2 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#81B29A] via-[#8EA8C3] to-[#C6ACD6] flex items-center justify-center text-slate-950 font-bold text-sm flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-slate-100">{user?.email?.split('@')[0] || 'Student'}</p>
              <p className="text-[11px] text-[#C6ACD6]/60 truncate">{user?.email || 'demo@mindscreen.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C6ACD6]/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Persistent Floating Button: 🌿 Talk to Saathi */}
      <button
        onClick={() => setIsSaathiOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(129,178,154,0.45)] flex items-center gap-2.5 transition-all hover:scale-105"
      >
        <span className="text-base">🌿</span>
        <span>Talk to Saathi</span>
      </button>

      {/* Saathi Companion Drawer */}
      <SaathiDrawer isOpen={isSaathiOpen} onClose={() => setIsSaathiOpen(false)} />

    </div>
  );
}
