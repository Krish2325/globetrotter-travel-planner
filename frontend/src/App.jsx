import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { useAdminAuth } from './admin/useAdminAuth';
import Layout from './components/Layout';

// User pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import ItineraryBuilder from './pages/ItineraryBuilder';
import BudgetPage from './pages/BudgetPage';
import ChecklistPage from './pages/ChecklistPage';
import NotesPage from './pages/NotesPage';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import CommunityPage from './pages/CommunityPage';
import PublicItinerary from './pages/PublicItinerary';
import ProfilePage from './pages/ProfilePage';

// Admin pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminSignup from './admin/pages/AdminSignup';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import ManageTrips from './admin/pages/ManageTrips';
import TripPackages from './admin/pages/TripPackages';
import ManageCities from './admin/pages/ManageCities';
import ManageActivities from './admin/pages/ManageActivities';
import ManageUsers from './admin/pages/ManageUsers';
import Analytics from './admin/pages/Analytics';
import SeasonalChecklists from './admin/pages/SeasonalChecklists';
import Reports from './admin/pages/Reports';
import CommunityManagement from './admin/pages/CommunityManagement';
import AdminSettings from './admin/pages/AdminSettings';

/* ── Guards ─────────────────────────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background:'#F7F6F2' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-10 h-10 border-[3px]" />
        <p className="text-sm font-medium" style={{ color:'#6B7280' }}>Loading Globetrotter…</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background:'#F7F6F2' }}>
      <div className="spinner w-10 h-10 border-[3px]" />
    </div>
  );
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

function AdminPublicRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  if (admin) return <Navigate to="/admin" replace />;
  return children;
}

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── User public ─────────────────────────────────────────── */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/community/:slug" element={<PublicItinerary />} />

            {/* ── User protected ──────────────────────────────────────── */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard"                element={<Dashboard />} />
              <Route path="/trips"                    element={<MyTrips />} />
              <Route path="/trips/new"                element={<CreateTrip />} />
              <Route path="/trips/:id"                element={<TripDetail />} />
              <Route path="/trips/:id/itinerary"      element={<ItineraryBuilder />} />
              <Route path="/trips/:id/budget"         element={<BudgetPage />} />
              <Route path="/trips/:id/checklist"      element={<ChecklistPage />} />
              <Route path="/trips/:id/notes"          element={<NotesPage />} />
              <Route path="/cities"                   element={<CitySearch />} />
              <Route path="/activities"               element={<ActivitySearch />} />
              <Route path="/community"                element={<CommunityPage />} />
              <Route path="/profile"                  element={<ProfilePage />} />
            </Route>

            {/* ── Admin public ────────────────────────────────────────── */}
            <Route path="/admin/login"  element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
            <Route path="/admin/signup" element={<AdminPublicRoute><AdminSignup /></AdminPublicRoute>} />

            {/* ── Admin protected ─────────────────────────────────────── */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index                  element={<AdminDashboard />} />
              <Route path="trips"           element={<ManageTrips />} />
              <Route path="packages"        element={<TripPackages />} />
              <Route path="cities"          element={<ManageCities />} />
              <Route path="activities"      element={<ManageActivities />} />
              <Route path="users"           element={<ManageUsers />} />
              <Route path="analytics"       element={<Analytics />} />
              <Route path="checklists"      element={<SeasonalChecklists />} />
              <Route path="reports"         element={<Reports />} />
              <Route path="community"       element={<CommunityManagement />} />
              <Route path="settings"        element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
