import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { 
  Scale, LayoutDashboard, Search, FolderOpen, Clock, 
  FileText, BrainCircuit, Mic, Calendar, Shield, 
  Bell, User, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

export const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { name: t('searchCase'), icon: Search, path: '/search' },
    { name: t('myCases'), icon: FolderOpen, path: '/cases' },
    { name: t('documents'), icon: FileText, path: '/documents' },
    { name: t('aiCaseExplanation'), icon: BrainCircuit, path: '/ai-explain' },
    { name: t('voiceAssistant'), icon: Mic, path: '/voice' },
    { name: t('hearingsReminders'), icon: Calendar, path: '/hearings' },
    { name: t('legalServices'), icon: Shield, path: '/legal-services' },
    { name: t('notifications'), icon: Bell, path: '/notifications' },
    { name: t('profile'), icon: User, path: '/profile' },
    { name: t('settings'), icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d111a]/55 backdrop-blur-3xl text-slate-300 w-64 flex-shrink-0 border-r border-white/10">
      <div className="p-6 flex items-center gap-3 text-white border-b border-white/10">
        <Scale size={28} className="text-amber-400" />
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-white font-hero">NYAYA SETU</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('subtitle')}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 dark-scrollbar">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 space-y-4">
        <button 
          onClick={toggleLanguage}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white border border-white/10"
        >
          {language === 'en' ? 'తెలుగు' : 'English'}
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#07090e] text-[#e2e8f0] overflow-hidden select-none">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 grain-overlay opacity-40 mix-blend-overlay" />
        </div>

        {/* Top Navbar */}
        <header className="bg-[#07090e]/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0 relative">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className="pl-10 pr-4 py-2 border border-white/10 rounded-xl text-sm w-64 lg:w-96 focus:outline-none focus:border-amber-400 transition-all bg-white/5 text-white placeholder-slate-500 font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
            </button>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold border border-amber-500/30">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-200 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 dark-scrollbar relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

