import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import LandingPage from './pages/marketing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import WebsiteEditor from './pages/website/WebsiteEditor';
import PublicWebsite from './pages/website/PublicWebsite';
import LivePreview from './pages/website/LivePreview';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import MaintenancePage from './pages/marketing/MaintenancePage';

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
      return <MaintenancePage />;
    }
  }

  return <>{children}</>;
};

function Router() {
  return (
    <BrowserRouter>
      <LoadingScreen>
        <MaintenanceWrapper>
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
        </MaintenanceWrapper>
      </LoadingScreen>
    </BrowserRouter>
  );
}

export default Router;
