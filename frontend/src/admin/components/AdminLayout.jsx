import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../useAdminAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, Map, Globe, Activity, PackageCheck, Users,
  BarChart3, Settings, LogOut, Shield, Menu, Bell, Search,
  PlusCircle, FileText, CheckSquare, Megaphone, MapPin
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard',        exact: true },
      { to: '/admin/analytics', icon: BarChart3,       label: 'Analytics' },
    ]
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/trips',      icon: Map,          label: 'Manage Trips' },
      { to: '/admin/packages',   icon: PackageCheck, label: 'Trip Packages' },
      { to: '/admin/cities',     icon: Globe,        label: 'Popular Cities' },
      { to: '/admin/activities', icon: Activity,     label: 'Activities' },
      { to: '/admin/checklists', icon: CheckSquare,  label: 'Season Checklists' },
    ]
  },
  {
    title: 'Platform',
    items: [
      { to: '/admin/users',      icon: Users,     label: 'Users' },
      { to: '/admin/community',  icon: Megaphone, label: 'Community' },
      { to: '/admin/reports',    icon: FileText,  label: 'Reports' },
      { to: '/admin/settings',   icon: Settings,  label: 'Settings' },
    ]
  },
];

function AdminSidebar({ admin, adminLogout, close }) {
  const navigate = useNavigate();
  const handleLogout = () => { adminLogout(); navigate('/admin/login'); };

  return (
    <aside className="flex flex-col h-full w-64 shrink-0" style={{
      background: 'rgba(247,246,242,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(124,154,126,0.12)',
    }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom:'1px solid rgba(124,154,126,0.1)' }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background:'linear-gradient(135deg,#1E5E52,#2E7D6B)' }}>
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-base font-bold font-display" style={{ color:'#1E5E52' }}>Globetrotter</span>
          <p className="text-[10px] -mt-0.5 font-semibold uppercase tracking-widest" style={{ color:'#9CA3AF' }}>Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {NAV_SECTIONS.map(({ title, items }) => (
          <div key={title}>
            <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5" style={{ color:'#9CA3AF' }}>{title}</p>
            <div className="space-y-0.5">
              {items.map(({ to, icon:Icon, label, exact }) => (
                <NavLink key={to} to={to} end={exact}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={close}>
                  {({ isActive }) => (
                    <>
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${isActive ? 'shadow-md' : ''}`}
                        style={{ background: isActive ? 'linear-gradient(135deg,#2E7D6B,#3D9B85)' : 'transparent' }}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`}
                          style={{ color: isActive ? undefined : '#6B7280' }} />
                      </div>
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout + user */}
      <div className="px-3 pb-4 space-y-2" style={{ borderTop:'1px solid rgba(124,154,126,0.1)', paddingTop:'0.75rem' }}>
        <button onClick={handleLogout} className="sidebar-link w-full" style={{ color:'#EF4444' }}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          Sign Out
        </button>
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl" style={{
          background:'rgba(46,125,107,0.07)', border:'1px solid rgba(124,154,126,0.18)'
        }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background:'linear-gradient(135deg,#1E5E52,#2E7D6B)' }}>
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color:'#1F2937' }}>{admin?.name || 'Admin'}</p>
            <p className="text-[10px] truncate font-medium" style={{ color:'#2E7D6B' }}>Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const { admin, adminLogout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'#F7F6F2' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full shrink-0">
        <AdminSidebar admin={admin} adminLogout={adminLogout} close={() => {}} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="md:hidden fixed inset-0 z-50 flex"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:'spring', damping:28, stiffness:280 }}>
              <AdminSidebar admin={admin} adminLogout={adminLogout} close={() => setSidebarOpen(false)} />
            </motion.div>
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3.5" style={{
          background:'rgba(247,246,242,0.9)', backdropFilter:'blur(20px)',
          WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(124,154,126,0.1)'
        }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-icon">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
            <input type="search" placeholder="Search users, trips, cities, activities…"
              className="input pl-11 py-2.5 text-sm rounded-2xl w-full" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <motion.button whileHover={{ scale:1.05 }} className="btn-primary py-2 px-4 text-xs">
              <PlusCircle className="w-3.5 h-3.5" /> Quick Add
            </motion.button>
            <button className="btn-icon relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                style={{ background:'#2E7D6B' }} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
