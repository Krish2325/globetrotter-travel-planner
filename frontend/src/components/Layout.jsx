import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, PlusCircle, Globe, Search as SearchIcon, Users,
  User, LogOut, Compass, Menu, X, Bell, Settings, Package, CheckSquare
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to:'/dashboard',   icon:LayoutDashboard, label:'Dashboard' },
  { to:'/packages',    icon:Package,         label:'Trip Packages' },
  { to:'/trips',       icon:Map,             label:'My Trips' },
  { to:'/trips/new',   icon:PlusCircle,      label:'New Trip' },
  { to:'/checklists',  icon:CheckSquare,     label:'Checklists' },
  { to:'/cities',      icon:Globe,           label:'City Search' },
  { to:'/activities',icon:SearchIcon,      label:'Activities' },
  { to:'/community', icon:Users,           label:'Community' },
];

/* ── Sidebar component ──────────────────────────────────────────────────── */
function Sidebar({ user, setSidebarOpen }) {
  return (
    <aside className="flex flex-col h-full w-64"
      style={{
        background: 'rgba(245, 245, 252,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241,0.12)',
      }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom:'1px solid rgba(99, 102, 241,0.1)' }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background:'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold font-display text-gradient">Globetrotter</span>
          <p className="text-[10px] text-[#9CA3AF] -mt-0.5">Smart travel planner</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] px-3 mb-2">Menu</p>
        {navItems.map(({ to, icon:Icon, label }) => (
          <NavLink key={to} to={to} end={to==='/trips/new'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#4F46E5] shadow-md' : 'bg-transparent'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User chip */}
      <div className="px-3 pb-4">
        <Link to="/profile" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-[rgba(79,70,229,0.1)]"
          style={{ background:'rgba(79, 70, 229,0.07)', border:'1px solid rgba(99, 102, 241,0.18)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background:'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1F2937] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#9CA3AF] truncate">{user?.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

/* ── Topbar ─────────────────────────────────────────────────────────────── */
function Topbar({ setSidebarOpen, handleLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/cities?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3.5"
      style={{
        background: 'rgba(245, 245, 252,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241,0.1)',
      }}>
      {/* Mobile menu */}
      <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-icon shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
          <Compass className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold font-display text-gradient text-sm">Globetrotter</span>
      </div>

      {/* Search */}
      <form onSubmit={submitSearch} className="relative flex-1 max-w-xl hidden md:block">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, trips, cities…"
          className="input pl-11 pr-4 py-2.5 text-sm rounded-2xl w-full"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotifOpen(v => !v)} className="btn-icon relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F46E5] border-2 border-white" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl p-4 z-20"
                  style={{ background: '#fff', border: '1px solid rgba(99, 102, 241,0.15)', boxShadow: '0 16px 40px rgba(31,41,55,0.12)' }}>
                  <p className="text-sm font-bold text-[#1F2937] mb-1">Notifications</p>
                  <p className="text-xs text-[#9CA3AF] py-4 text-center">No new notifications</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile, Sign out — grouped next to Settings */}
        <Link to="/profile" className="btn-icon" title="Profile">
          <User className="w-4 h-4" />
        </Link>
        <button onClick={handleLogout} className="btn-icon" title="Sign out">
          <LogOut className="w-4 h-4" />
        </button>
        <Link to="/profile" className="btn-icon" title="Settings">
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}

/* ── Layout ─────────────────────────────────────────────────────────────── */
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'#F5F5FC' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full shrink-0">
        <Sidebar user={user} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="md:hidden fixed inset-0 z-50 flex"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div className="flex flex-col h-full"
              initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:'spring', damping:28, stiffness:280 }}>
              <Sidebar user={user} setSidebarOpen={setSidebarOpen} />
            </motion.div>
            <motion.div className="flex-1 bg-black/30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
