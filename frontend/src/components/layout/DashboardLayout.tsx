import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ClipboardList, LogOut, History, Heart, ChevronRight, Brain, ShieldAlert } from 'lucide-react';

export function DashboardLayout() {
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard',       path: '/dashboard',  icon: LayoutDashboard, description: 'Overview & trends' },
    { name: 'New Assessment',  path: '/assessment', icon: ClipboardList,   description: 'Start screening' },
    { name: 'History',         path: '/history',    icon: History,         description: 'Past results' },
    { name: 'Mood Tracker',    path: '/mood',       icon: Heart,           description: 'Daily check-in' },
    { name: 'Counselor Portal',path: '/counselor',  icon: ShieldAlert,     description: 'Privacy oversight', isSpecial: true },
  ];

  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{ background: '#F0E8D8', color: '#3D3128' }}
    >
      {/* Subtle ambient gradient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 10% 10%, rgba(200,175,130,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(139,168,196,0.14) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── SIDEBAR ── */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col relative z-20"
        style={{
          background: 'rgba(250, 246, 238, 0.75)',
          borderRight: '1px solid rgba(61, 49, 40, 0.10)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div
          className="p-5 pb-4"
          style={{ borderBottom: '1px solid rgba(61, 49, 40, 0.09)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(90, 122, 154, 0.12)', border: '1px solid rgba(90, 122, 154, 0.22)' }}
            >
              <Brain className="w-5 h-5" style={{ color: '#5A7A9A' }} />
            </div>
            <div>
              <h1
                className="text-base font-bold"
                style={{ color: '#3D3128' }}
              >
                MindScreen
              </h1>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: '#A89E95' }}
              >
                Multimodal AI
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p
            className="text-[10px] uppercase tracking-widest px-3 mb-3"
            style={{ color: '#A89E95' }}
          >
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                style={{
                  background: isActive
                    ? item.isSpecial ? 'rgba(136,112,168,0.12)' : 'rgba(90,122,154,0.12)'
                    : 'transparent',
                  border: isActive
                    ? item.isSpecial ? '1px solid rgba(136,112,168,0.28)' : '1px solid rgba(90,122,154,0.22)'
                    : '1px solid transparent',
                  marginTop: item.isSpecial ? '0.75rem' : 0,
                  color: isActive
                    ? item.isSpecial ? '#8870A8' : '#5A7A9A'
                    : '#7A6E65',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive
                      ? item.isSpecial ? 'rgba(136,112,168,0.18)' : 'rgba(90,122,154,0.18)'
                      : 'rgba(61,49,40,0.06)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  <p
                    className="text-[11px] leading-tight"
                    style={{ color: '#A89E95' }}
                  >
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight
                    className="w-3.5 h-3.5 ml-auto flex-shrink-0"
                    style={{ color: item.isSpecial ? '#8870A8' : '#5A7A9A' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div
          className="p-3"
          style={{ borderTop: '1px solid rgba(61, 49, 40, 0.09)' }}
        >
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
            style={{ background: 'rgba(61, 49, 40, 0.05)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: '#5A7A9A', color: '#F0E8D8' }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#3D3128' }}>
                {user?.email?.split('@')[0] || 'Student'}
              </p>
              <p className="text-[11px] truncate" style={{ color: '#A89E95' }}>
                {user?.email || 'demo@mindscreen.ai'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: '#A89E95' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(180, 60, 60, 0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = '#C05050';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#A89E95';
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
