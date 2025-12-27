import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Wrench, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Bell 
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
    { name: 'Equipment', path: '/equipment', icon: <Package size={20} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">GearGuard</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className={`mr-3 ${location.pathname === item.path ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center w-full p-2 rounded-lg bg-gray-50 border border-gray-100 mb-3">
             <img 
                src={user?.avatarUrl} 
                alt="Profile" 
                className="h-9 w-9 rounded-full bg-gray-200 border border-white shadow-sm" 
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
              </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <span className="ml-3 text-lg font-bold text-gray-900">GearGuard</span>
          </div>
          <div className="flex items-center">
             <img src={user?.avatarUrl} alt="User" className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-gray-800 bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
                  <span className="text-lg font-bold text-gray-900">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               <nav className="flex-1 py-4 px-2 space-y-1">
                 {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-base font-medium rounded-lg ${
                          isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </NavLink>
                 ))}
               </nav>
               <div className="p-4 border-t border-gray-200">
                 <button onClick={handleLogout} className="flex items-center text-red-600 font-medium">
                   <LogOut size={20} className="mr-2" /> Sign Out
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};