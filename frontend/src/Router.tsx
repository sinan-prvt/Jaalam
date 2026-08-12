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
const WeddingEditor = lazy(() => import('./pages/website/WeddingEditor'));
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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFCFF] z-[9999] fixed inset-0">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Connecting to server...</p>
        </div>
      </div>
    );
  }

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

const getSubdomain = () => {
  const host = window.location.hostname;
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const parts = host.split('.');
    if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== '127') return parts[0];
  } else if (host.includes('vercel.app')) {
    const parts = host.split('.');
    if (parts.length >= 4) return parts[0];
  } else {
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') return parts[0];
  }
  return null;
};

function Router() {
  const subdomain = getSubdomain();

  if (subdomain) {
    return (
      <BrowserRouter>
        <CommandPalette />
        <LoadingScreen>
          <MaintenanceWrapper>
            <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#FAFAFC]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
              <Routes>
                <Route path="*" element={<PublicWebsite />} />
              </Routes>
            </Suspense>
          </MaintenanceWrapper>
        </LoadingScreen>
      </BrowserRouter>
    );
  }

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
              <Route
                path="/wedding-editor/:websiteId"
                element={<ProtectedRoute component={WeddingEditor} />}
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
