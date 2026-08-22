import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import AdminLayout from './layouts/AdminLayout';

import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import ManageTrips  from './pages/ManageTrips';
import TripPackages from './pages/TripPackages';
import ManageCities from './pages/ManageCities';
import ManageActivities from './pages/ManageActivities';
import SeasonalChecklists from './pages/SeasonalChecklists';
import Analytics    from './pages/Analytics';
import ManageUsers  from './pages/ManageUsers';
import Community    from './pages/Community';
import Reports      from './pages/Reports';
import Settings     from './pages/Settings';
import Notifications from './pages/Notifications';
import Profile      from './pages/Profile';

/* ── Route Guards ────────────────────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { admin, loading } = useAuthStore();
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F7F6F2' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div className="spinner" style={{ width:40, height:40 }} />
        <p style={{ fontSize:'0.875rem', color:'#6B7280', fontWeight:500 }}>Loading Globetrotter Admin...</p>
      </div>
    </div>
  );
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { admin } = useAuthStore();
  if (admin) return <Navigate to="/dashboard" replace />;
  return children;
}

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => { checkAuth(); }, []);

  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public */}
        <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Protected admin shell */}
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="trips"      element={<ManageTrips />} />
          <Route path="packages"   element={<TripPackages />} />
          <Route path="cities"     element={<ManageCities />} />
          <Route path="activities" element={<ManageActivities />} />
          <Route path="checklists" element={<SeasonalChecklists />} />
          <Route path="analytics"  element={<Analytics />} />
          <Route path="users"      element={<ManageUsers />} />
          <Route path="community"      element={<Community />} />
          <Route path="reports"        element={<Reports />} />
          <Route path="settings"       element={<Settings />} />
          <Route path="notifications"  element={<Notifications />} />
          <Route path="profile"        element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
