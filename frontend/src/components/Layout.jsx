import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, PlusCircle, Globe, Search as SearchIcon, Users,
  User, LogOut, Compass, Menu, X, Bell, Settings, Shield
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to:'/dashboard', icon:LayoutDashboard, label:'Dashboard' },
  { to:'/trips',     icon:Map,             label:'My Trips' },
  { to:'/trips/new', icon:PlusCircle,      label:'New Trip' },
  { to:'/cities',    icon:Globe,           label:'City Search' },
  { to:'/activities',icon:SearchIcon,      label:'Activities' },
  { to:'/community', icon:Users,           label:'Community' },
];

/* ── Sidebar component ──────────────────────────────────────────────────── */
function Sidebar({ user, handleLogout, setSidebarOpen }) {
  return (
    <aside className="flex flex-col h-full w-64"
      style={{
        background: 'rgba(247,246,242,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(214,122,74,0.12)',
      }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom:'1px solid rgba(214,122,74,0.1)' }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background:'linear-gradient(135deg,#F2683A,#FB8A4C)' }}>
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold font-display text-[#B33E1A]">Globetrotter</span>
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
                  isActive ? 'bg-[#F2683A] shadow-md' : 'bg-transparent'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-4 pt-3" style={{ borderTop:'1px solid rgba(214,122,74,0.1)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] px-3 mb-2">Account</p>
          <NavLink to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#F2683A]' : ''}`}>
                  <User className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                </div>
                Profile
              </>
            )}
          </NavLink>
          <button onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:bg-red-50 hover:text-red-500">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center">
              <LogOut className="w-3.5 h-3.5" />
            </div>
            Sign Out
          </button>
          
          <div className="my-2 border-t border-dashed" style={{ borderColor: 'rgba(214,122,74,0.2)' }} />
          
          <a href="http://localhost:5174/admin" target="_blank" rel="noreferrer"
            className="sidebar-link w-full text-[#B33E1A] hover:bg-[#B33E1A]/10 font-medium">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-[#B33E1A]/10">
              <Shield className="w-3.5 h-3.5 text-[#B33E1A]" />
            </div>
            Admin Console
          </a>
        </div>
      </nav>

      {/* User chip */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl"
          style={{ background:'rgba(242,104,58,0.07)', border:'1px solid rgba(214,122,74,0.18)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background:'linear-gradient(135deg,#F2683A,#FB8A4C)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1F2937] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#9CA3AF] truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Topbar ─────────────────────────────────────────────────────────────── */
function Topbar({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3.5"
      style={{
        background: 'rgba(247,246,242,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(214,122,74,0.1)',
      }}>
      {/* Mobile menu */}
      <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-icon shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#F2683A,#FB8A4C)' }}>
          <Compass className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold font-display text-[#B33E1A] text-sm">Globetrotter</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xl hidden md:block">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input
          type="search"
          placeholder="Search destinations, trips, cities…"
          className="input pl-11 pr-4 py-2.5 text-sm rounded-2xl w-full"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="btn-icon relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F2683A] border-2 border-white" />
        </button>
        <button className="btn-icon">
          <Settings className="w-4 h-4" />
        </button>
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
    <div className="flex h-screen overflow-hidden" style={{ background:'#F7F6F2' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full shrink-0">
        <Sidebar user={user} handleLogout={handleLogout} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="md:hidden fixed inset-0 z-50 flex"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div className="flex flex-col h-full"
              initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:'spring', damping:28, stiffness:280 }}>
              <Sidebar user={user} handleLogout={handleLogout} setSidebarOpen={setSidebarOpen} />
            </motion.div>
            <motion.div className="flex-1 bg-black/30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
