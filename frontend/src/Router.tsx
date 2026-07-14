import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import CommandPalette from './components/ui/CommandPalette';

// Lazy load all page components for better performance
const LandingPage = lazy(() => import('./pages/marketing/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const WebsiteEditor = lazy(() => import('./pages/website/WebsiteEditor'));
const PublicWebsite = lazy(() => import('./pages/website/PublicWebsite'));
const LivePreview = lazy(() => import('./pages/website/LivePreview'));
const MaintenancePage = lazy(() => import('./pages/marketing/MaintenancePage'));

const MaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/users/system-settings/');
        setIsMaintenance(res.data.maintenance_mode);
      } catch (e) {
        console.error('Failed to fetch system settings', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return null; // Let the outer LoadingScreen handle initial load if needed, or just return null

  if (isMaintenance && !user?.is_superuser) {
    if (location.pathname !== '/login') {
      return (
        <Suspense fallback={null}>
          <MaintenancePage />
        </Suspense>
      );
    }
  }

  return <>{children}</>;
};

function Router() {
  return (
    <BrowserRouter>
      <CommandPalette />
      <LoadingScreen>
        <MaintenanceWrapper>
          <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#FAFAFC]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route
                path="/dashboard"
                element={<ProtectedRoute component={Dashboard} />}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute component={AdminDashboard} />}
              />
              <Route
                path="/editor/:websiteId"
                element={<ProtectedRoute component={WebsiteEditor} />}
              />
              <Route path="/_preview" element={<LivePreview />} />

              <Route path="/:businessSlug" element={<PublicWebsite />} />
            </Routes>
          </Suspense>
        </MaintenanceWrapper>
      </LoadingScreen>
    </BrowserRouter>
  );
}

export default Router;
