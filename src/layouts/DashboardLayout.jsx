import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart, LogOut, Menu, X, Bell, ChevronRight, Search,
  Home, PlayCircle, BookOpen, MessageSquare, Calendar, User, Sparkles,
  LayoutDashboard, Clock, DollarSign, Users, Video, UserPlus, CreditCard,
  BarChart2, ShieldCheck, Zap, Info as InfoIcon, CheckCircle2 as CheckIcon, AlertCircle,
  Link as LinkIcon, Image as ImageIcon, ChevronDown, GraduationCap, Award
} from 'lucide-react';

const ROLE_CONFIG = {
  member: {
    label: 'My Wellness',
    basePath: '/app',
    navItems: [
      { name: 'Home', icon: Home, path: '/app' },
      { name: 'Explore', icon: Search, path: '/app/explore' },
      { name: 'My Learning', icon: PlayCircle, path: '/app/learning' },
      { name: 'Books', icon: BookOpen, path: '/app/books' },
      { name: 'AI Sakhi', icon: Sparkles, path: '/app/ai-sakhi' },
      { name: 'Academy', icon: GraduationCap, path: '/academy' },
      { name: 'Book Session', icon: Calendar, path: '/app/sessions' },
    ],
    sakhiModules: [
      { name: 'Meditation Sakhi', icon: PlayCircle, path: '/app/meditation' },
      { name: 'To-Do List', icon: CheckIcon, path: '/app/todo' },
      { name: 'Home Budget Sakhi', icon: CreditCard, path: '/app/finance' },
      { name: 'Affirmations', icon: Sparkles, path: '/app/affirmation' },
      { name: 'Mental Health', icon: Heart, path: '/app/mental-health' },
      { name: 'Love Sakhi', icon: Users, path: '/app/relationship' },
      { name: 'Grooming Sakhi', icon: User, path: '/app/grooming' },
      { name: 'Spiritual Sakhi', icon: Zap, path: '/app/spiritual' },
    ],
    userName: ' HealthSakhi Priya',
    sidebarBg: 'bg-[#15192c]',
    sidebarActive: 'bg-[#ff69b4]',
    avatarBg: 'FDEEF1',
    userSubtitle: 'Wellness Member',
  },
  advisor: {
    label: 'Advisor Portal',
    basePath: '/advisor',
    userName: 'Dr. Sakshi Sharma',
    userSubtitle: 'Wellness Advisor',
    avatarBg: 'FDEEF1',
    accentClass: 'bg-[#ff69b4]',
    sidebarBg: 'bg-slate-900',
    sidebarActive: 'bg-[#ff69b4]',
    navItems: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/advisor' },
      { name: 'Appointments', icon: Calendar, path: '/advisor/appointments' },
      { name: 'My Users', icon: Users, path: '/advisor/users' },
      { name: 'Consultations', icon: Heart, path: '/advisor/consultations' },
      { name: 'Chat', icon: MessageSquare, path: '/advisor/chat' },
      { name: 'Availability', icon: Clock, path: '/advisor/availability' },
      { name: 'Earnings', icon: DollarSign, path: '/advisor/earnings' },
    ],
  },
  admin: {
    label: 'Admin Console',
    basePath: '/admin',
    userName: 'Admin User',
    userSubtitle: 'System Administrator',
    avatarBg: 'FDEEF1',
    accentClass: 'bg-[#15192c]',
    sidebarBg: 'bg-slate-900',
    sidebarActive: 'bg-[#15192c]',
    navItems: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'User Management', icon: Users, path: '/admin/users' },
      { name: 'Content Management', icon: Video, path: '/admin/content' },
      { name: 'Book Management', icon: BookOpen, path: '/admin/books' },
      { name: 'Advisor Management', icon: UserPlus, path: '/admin/advisors' },
      { name: 'Appointments', icon: Calendar, path: '/admin/appointments' },
      { name: 'Plan Management', icon: ShieldCheck, path: '/admin/plans' },
      { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
      { name: 'Sakhi Management', icon: Sparkles, path: '/admin/sakhi-cms' },
      { name: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
      { name: 'Campaigns', icon: Zap, path: '/admin/notifications' },
    ],
  },
  partner: {
    label: 'Partner Dashboard',
    basePath: '/affiliate',
    userName: 'Sakhi Partner',
    userSubtitle: 'Growth Affiliate',
    avatarBg: 'FDEEF1',
    navItems: [
      { name: 'Home', icon: LayoutDashboard, path: '/affiliate' },
      { name: 'Get Links', icon: LinkIcon, path: '/affiliate/links' },
      { name: 'My Earnings', icon: DollarSign, path: '/affiliate/earnings' },
      { name: 'Marketing Assets', icon: ImageIcon, path: '/affiliate/assets' },
    ],
  },
};

// ─── Website Navbar (for Members) ─────────────────────────────────────────────
const MemberNavbar = ({ config, isActive }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSakhiDropdown, setShowSakhiDropdown] = useState(false);
  const [isMobileSakhiOpen, setIsMobileSakhiOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [coins, setCoins] = useState(480);

  // Calculate dynamic balance
  const calculateBalance = () => {
    const rewards = JSON.parse(localStorage.getItem('hs_book_rewards') || '[]');
    const earned = rewards.reduce((sum, r) => sum + (r.points || 0), 0);
    return 480 + earned;
  };

  useEffect(() => {
    // Initial load
    setCoins(calculateBalance());

    // Listen for custom balance update event (same tab)
    const handleBalanceUpdate = () => {
      setCoins(calculateBalance());
    };

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'hs_book_rewards') setCoins(calculateBalance());
    };

    window.addEventListener('hs_balance_update', handleBalanceUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('hs_balance_update', handleBalanceUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const notifications = [
    { id: 1, text: "Your session with Dr. Sakshi is in 30 mins.", time: "30m ago" },
    { id: 2, text: "New wellness module added: Navigating PCOD.", time: "2h ago" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSakhiDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b w-full relative z-[100]" style={{ borderColor: '#F5E6EA' }}>
        <div className="w-full h-full flex items-center justify-between px-4 md:px-10">
          <Link to={config.basePath} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-sm bg-white border border-rose-100">
              <img src="/Images/logo.png" alt="HealthSakhi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ color: '#15192c' }}>HealthSakhi</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 max-w-[70%]">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 pr-4">
              {config.navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all relative whitespace-nowrap shrink-0"
                  style={{ color: isActive(item.path) ? '#ff69b4' : '#9A8A8E' }}
                >
                  {item.name}
                  {isActive(item.path) && <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#ff69b4' }} />}
                </Link>
              ))}
            </div>

            {/* Persistent Sakhi Modules Navigation Bar */}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Premium Reward Balance Pill */}
            <Link 
              to="/app/rewards" 
              className="group relative flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Animated Glow Backdrop */}
              <div className="absolute inset-0 bg-[#15192c] rounded-2xl shadow-[0_8px_16px_-6px_rgba(21,25,44,0.3)] group-hover:shadow-[0_12px_24px_-8px_rgba(255,105,180,0.4)] transition-all duration-300" />
              
              {/* Glassmorphism Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon with Glowing Aura */}
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-[#ff69b4] blur-md rounded-full opacity-40 group-hover:opacity-60"
                />
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#ff69b4] to-[#e05297] rounded-xl flex items-center justify-center text-white shadow-lg border border-white/20">
                  <Award size={14} className="sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Text Content */}
              <div className="relative flex flex-col items-start">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#ff69b4] mb-0.5 group-hover:text-pink-300 transition-colors">Balance</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] sm:text-[15px] font-black text-white tracking-tight leading-none">
                    {coins}
                  </span>
                  <span className="text-[11px] sm:text-[12px] opacity-90">🪙</span>
                </div>
              </div>

              {/* Subtle Right Arrow on Hover */}
              <ChevronRight size={12} className="relative text-white/20 group-hover:text-[#ff69b4] group-hover:translate-x-0.5 transition-all -ml-1 opacity-0 group-hover:opacity-100" />
            </Link>

            <div className="relative z-[110]">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl hover:bg-rose-50 relative transition-all" style={{ color: '#C4A0AC' }}>
                <Bell size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#ff69b4' }} />
              </button>
              {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border p-4 z-[200] animate-in fade-in zoom-in duration-200" style={{ borderColor: '#F5E6EA' }}>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: '#15192c' }}>Notifications</h3>
                    <span className="text-[10px] font-black uppercase text-[#ff69b4] cursor-pointer hover:opacity-70 transition-opacity">Mark all as read</span>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 rounded-xl border" style={{ background: '#FFF7F8', borderColor: '#F5E6EA' }}>
                        <p className="text-[13px] font-bold leading-snug mb-1" style={{ color: '#15192c' }}>{n.text}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#C4A0AC' }}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to={`${config.basePath}/profile`} className="flex items-center gap-3 pl-2 sm:pl-4 border-l group hover:opacity-80 transition-opacity" style={{ borderColor: '#F5E6EA' }}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-sm border border-rose-100">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(config.userName)}&background=FDEEF1&color=C4607A&bold=true`} alt={config.userName} />
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-xl" style={{ color: '#15192c' }}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Persistent Breadcrumb Navigation for All Modules */}
      {config.sakhiModules && config.sakhiModules.length > 0 && (
        <nav className="bg-rose-50/50 backdrop-blur-md h-12 border-b flex items-center px-4 md:px-10 overflow-x-auto no-scrollbar relative z-50" style={{ borderColor: '#F5E6EA' }}>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#C4A0AC] whitespace-nowrap">
            {config.sakhiModules.map((module, i) => (
              <React.Fragment key={module.path}>
                <Link 
                  to={module.path} 
                  className={`transition-all flex items-center gap-2 hover:text-[#ff69b4] relative py-1 ${isActive(module.path) ? 'text-[#ff69b4]' : ''}`}
                >
                  <module.icon size={12} className={isActive(module.path) ? 'text-[#ff69b4]' : 'text-[#C4A0AC]'} />
                  {module.name}
                  {isActive(module.path) && (
                    <motion.div 
                      layoutId="activeSakhi"
                      className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#ff69b4] rounded-full"
                    />
                  )}
                </Link>
                {i < config.sakhiModules.length - 1 && <span className="opacity-20">|</span>}
              </React.Fragment>
            ))}
          </div>
        </nav>
      )}

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b shadow-2xl p-6 space-y-2 max-h-[80vh] overflow-y-auto" style={{ borderColor: '#F5E6EA' }}>
          {config.navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl font-bold bg-rose-50/50"
              style={{ color: isActive(item.path) ? '#ff69b4' : '#15192c' }}
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}

          {/* Mobile Sakhi Dropdown Section */}
          {config.sakhiModules && config.sakhiModules.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FDEEF1]/30">
              <button
                onClick={() => setIsMobileSakhiOpen(!isMobileSakhiOpen)}
                className="flex items-center justify-between w-full font-bold text-[#15192c] mb-2"
              >
                <span>All Sakhi Modules</span>
                <ChevronDown size={20} className={`transition-transform ${isMobileSakhiOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isMobileSakhiOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 gap-2 overflow-hidden"
                  >
                    {config.sakhiModules.map((module) => (
                      <Link
                        key={module.path}
                        to={module.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 px-4 rounded-xl font-bold text-[13px] bg-white border border-rose-100"
                        style={{ color: '#15192c' }}
                      >
                        <module.icon size={16} className="text-[#ff69b4]" /> {module.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button onClick={() => { sessionStorage.clear(); navigate('/'); }} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-rose-500 w-full mt-4">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Shared Dashboard Navbar (for Advisor/Admin) ─────────────────────────────
const DashboardNavbar = ({ config, pageTitle }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "System update scheduled for midnight.", time: "1h ago" },
    { id: 2, text: "You have 3 new messages.", time: "3h ago" },
  ];

  return (
    <header className="h-16 bg-white border-b px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40" style={{ borderColor: '#F5E6EA' }}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => config.toggleSidebar?.()}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-50"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-bold" style={{ color: '#15192c' }}>{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl hover:bg-rose-50 transition-all" style={{ color: '#C4A0AC' }}>
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#ff69b4' }} />
          </button>
          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border p-4 z-[100] animate-in fade-in zoom-in duration-200" style={{ borderColor: '#F5E6EA' }}>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: '#15192c' }}>Alerts</h3>
                <span className="text-[10px] font-black uppercase text-[#ff69b4] cursor-pointer hover:opacity-70 transition-opacity">Clear all</span>
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 rounded-xl border" style={{ background: '#FFF7F8', borderColor: '#F5E6EA' }}>
                    <p className="text-[13px] font-bold leading-snug mb-1" style={{ color: '#15192c' }}>{n.text}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#C4A0AC' }}>{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link to={`${config.basePath}/profile`} className="flex items-center gap-3 pl-5 border-l cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor: '#F5E6EA' }}>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none" style={{ color: '#15192c' }}>{config.userName}</p>
            <p className="text-[10px] font-medium mt-1 uppercase tracking-widest text-[#C4A0AC]">{config.userSubtitle}</p>
          </div>
          <div className="w-9 h-9 rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: '#F5E6EA' }}>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(config.userName)}&background=${config.avatarBg || 'slate-100'}&color=C4607A&bold=true`} alt="User" />
          </div>
        </Link>
      </div>
    </header>
  );
};

// ─── Standard Sidebar ─────────────────────────────────────────────────────────
const Sidebar = ({ config, isActive, isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 z-50 lg:relative lg:z-0
        ${config.sidebarBg} border-r flex flex-col shrink-0
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="p-8 pb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 overflow-hidden flex items-center justify-center shadow-lg`}>
              <img src="/Images/logo.png" alt="HealthSakhi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-white">HealthSakhi</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {config.navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive(item.path) ? `${config.sidebarActive} text-white` : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={() => { sessionStorage.clear(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 w-full text-white/40 hover:text-white font-bold text-sm">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── Final Dashboard Layout ───────────────────────────────────────────────────
const DashboardLayout = ({ role = 'member' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.member;
  const isActive = (path) => {
    if (path === config.basePath) return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  const isTopNav = role === 'member' || role === 'partner';
  const pageTitle = config.navItems.find(i => isActive(i.path))?.name || config.label;

  // Add toggle function to config so DashboardNavbar can access it
  const configWithToggle = {
    ...config,
    toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen)
  };

  if (isTopNav) {
    return (
      <div className="min-h-screen flex flex-col font-sans" style={{ background: '#FFF7F8' }}>
        <MemberNavbar config={config} isActive={isActive} />
        <main className="flex-1 pt-32 lg:pt-36 pb-10 w-full transition-all duration-300">
          <div className="w-full px-4 md:px-6 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex w-full font-sans bg-slate-50 overflow-hidden">
      <Sidebar
        config={config}
        isActive={isActive}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar config={configWithToggle} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

