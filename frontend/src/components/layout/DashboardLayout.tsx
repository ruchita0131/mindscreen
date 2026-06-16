import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FileText, LogOut, Activity } from 'lucide-react';
import { Button } from '../ui/Button';

export function DashboardLayout() {
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Assessment', path: '/assessment', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#0D1B2A] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 backdrop-blur-md flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Activity className="text-brand-teal w-8 h-8" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-tealL to-brand-amber bg-clip-text text-transparent">MindScreen</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-teal/20 text-brand-tealL border border-brand-teal/30 shadow-[0_0_15px_rgba(10,147,150,0.15)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-medium truncate">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 border-white/10 hover:bg-white/5 text-gray-300"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Background ambient glow */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-teal/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="p-8 max-w-7xl mx-auto relative z-10 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
