import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import {
  LayoutDashboard, Map, PackageCheck, Globe, Activity,
  CheckSquare, BarChart3, Users, Megaphone, FileText,
  Settings, LogOut, Shield, Menu, X, Bell, Search,
  PlusCircle, ChevronRight, UserCircle, ExternalLink
} from 'lucide-react';

const NAV = [
  { section: 'Overview', items: [
    { to:'/dashboard', icon:LayoutDashboard, label:'Dashboard' },
    { to:'/analytics',  icon:BarChart3,       label:'Analytics' },
  ]},
  { section: 'Content', items: [
    { to:'/trips',      icon:Map,          label:'Manage Trips' },
    { to:'/packages',   icon:PackageCheck, label:'Trip Packages' },
    { to:'/cities',     icon:Globe,        label:'Popular Cities' },
    { to:'/activities', icon:Activity,     label:'Activities' },
    { to:'/checklists', icon:CheckSquare,  label:'Checklists' },
  ]},
  { section: 'Platform', items: [
    { to:'/users',         icon:Users,       label:'Users' },
    { to:'/community',     icon:Megaphone,   label:'Community' },
    { to:'/reports',       icon:FileText,    label:'Reports' },
    { to:'/notifications', icon:Bell,        label:'Notifications' },
    { to:'/settings',      icon:Settings,    label:'Settings' },
    { to:'/profile',       icon:UserCircle,  label:'My Profile' },
  ]},
];

function Sidebar({ onClose }) {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 256,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(247,246,242,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(214,122,74,0.12)',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(214,122,74,0.1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
          <div style={{
            width:36, height:36, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
            background:'linear-gradient(135deg,#B33E1A,#F2683A)', boxShadow:'0 4px 12px rgba(242,104,58,0.3)'
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:'0.9375rem', color:'#B33E1A' }}>Globetrotter</p>
            <p style={{ fontSize:'0.625rem', color:'#9CA3AF', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>Admin Console</p>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'0.75rem' }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom:'0.75rem' }}>
            <p className="label-xs" style={{ padding:'0.25rem 0.75rem', marginBottom:'0.25rem' }}>{section}</p>
            {items.map(({ to, icon:Icon, label }) => (
              <NavLink key={to} to={to} end={to==='/dashboard'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={onClose}>
                {({ isActive }) => (
                  <>
                    <div style={{
                      width:28, height:28, borderRadius:10,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      background: isActive ? 'linear-gradient(135deg,#F2683A,#FB8A4C)' : 'transparent',
                      boxShadow: isActive ? '0 4px 10px rgba(242,104,58,0.3)' : 'none',
                      flexShrink: 0, transition:'all 0.2s'
                    }}>
                      <Icon size={14} color={isActive ? '#fff' : '#6B7280'} />
                    </div>
                    <span style={{ flex:1 }}>{label}</span>
                    {isActive && <ChevronRight size={14} style={{ opacity:0.4 }} />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User chip */}
      <div style={{ padding:'0.75rem' }}>
        <a href="http://localhost:5173" target="_blank" rel="noreferrer"
          className="nav-link" style={{ width:'100%', color:'#F2683A', background:'rgba(242,104,58,0.04)', border:'1px solid rgba(242,104,58,0.15)', marginBottom:'0.5rem', textDecoration:'none' }}>
          <ExternalLink size={14} />
          View Live Website
        </a>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="nav-link" style={{ width:'100%', color:'#EF4444', background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.15)', marginBottom:'0.5rem' }}>
          <LogOut size={14} />
          Sign Out
        </button>
        <div style={{
          display:'flex', alignItems:'center', gap:'0.625rem',
          padding:'0.65rem 0.75rem', borderRadius:16,
          background:'rgba(242,104,58,0.07)', border:'1px solid rgba(214,122,74,0.18)'
        }}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background:'linear-gradient(135deg,#B33E1A,#F2683A)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontSize:'0.75rem', fontWeight:700, flexShrink:0
          }}>
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:'0.8125rem', fontWeight:600, color:'#1F2937', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{admin?.name || 'Admin'}</p>
            <p style={{ fontSize:'0.625rem', color:'#F2683A', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F7F6F2' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ flexShrink:0 }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="md:hidden" style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:'spring', damping:28, stiffness:280 }} style={{ flexShrink:0 }}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
            <motion.div style={{ flex:1, background:'rgba(0,0,0,0.35)' }}
              onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        {/* Topbar */}
        <header style={{
          display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem',
          background:'rgba(247,246,242,0.92)', backdropFilter:'blur(20px)',
          WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(214,122,74,0.1)',
          position:'sticky', top:0, zIndex:30,
        }}>
          <button className="md:hidden btn-icon" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>

          <div style={{ flex:1, maxWidth:520, display:'none' }} className="md:block">
            <div style={{ position:'relative' }}>
              <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
              <input className="input" placeholder="Search trips, cities, users..." style={{ paddingLeft:40, paddingTop:'0.55rem', paddingBottom:'0.55rem', fontSize:'0.8125rem' }} />
            </div>
          </div>

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <motion.button whileHover={{ scale:1.02 }} className="btn btn-primary admin-quick-add" style={{ padding:'0.5rem 1rem', fontSize:'0.75rem', borderRadius:12 }}>
              <PlusCircle size={14} /> <span className="quick-add-label">Quick Add</span>
            </motion.button>
            <button className="btn-icon" style={{ position:'relative' }}>
              <Bell size={16} />
              <span style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:'#F2683A', border:'2px solid #F7F6F2' }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex:1, overflowY:'auto' }}>
          <div className="admin-page-wrap">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
