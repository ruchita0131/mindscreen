import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ClipboardList, LogOut, History, Heart, ChevronRight, Brain, ShieldAlert, Sun } from 'lucide-react';
import { AmbientSunBackground } from '../ui/AmbientSunBackground';

export function DashboardLayout() {
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Overview & trends' },
    { name: 'New Assessment', path: '/assessment', icon: ClipboardList, description: 'Start screening' },
    { name: 'History', path: '/history', icon: History, description: 'Past results' },
    { name: 'Mood Tracker', path: '/mood', icon: Heart, description: 'Daily check-in' },
    { name: 'Counselor Portal', path: '/counselor', icon: ShieldAlert, description: 'Privacy oversight', isSpecial: true },
  ];

  return (
    <div className="flex h-screen bg-[#161722] text-white overflow-hidden relative">
      {/* Soothing Ambient Sun Background */}
      <AmbientSunBackground />

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/[0.03] border-r border-white/10 flex flex-col relative z-20" style={{ backdropFilter: 'blur(20px)' }}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center">
              <Brain className="text-brand-tealL w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">MindScreen</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Sun className="w-3 h-3 text-brand-amber inline" /> Calming Multimodal AI
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest px-3 mb-3">Navigation</p>
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
                      ? 'bg-brand-amber/20 text-brand-amber border border-brand-amber/40 font-bold'
                      : 'bg-brand-teal/15 text-brand-tealL border border-brand-teal/25 font-semibold'
                    : item.isSpecial
                    ? 'text-brand-amber/80 hover:text-brand-amber hover:bg-brand-amber/10 border border-brand-amber/20 mt-4'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? item.isSpecial ? 'bg-brand-amber/30' : 'bg-brand-teal/20'
                    : item.isSpecial ? 'bg-brand-amber/10' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-tight">{item.name}</p>
                  <p className="text-[11px] text-gray-500 leading-tight">{item.description}</p>
                </div>
                {isActive && <ChevronRight className={`w-3.5 h-3.5 ml-auto flex-shrink-0 ${item.isSpecial ? 'text-brand-amber' : 'text-brand-teal'}`} />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-amber via-brand-teal to-brand-purple flex items-center justify-center text-[#0D1B2A] font-bold text-sm flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.email?.split('@')[0] || 'Student'}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email || 'demo@mindscreen.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
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
    </div>
  );
}
