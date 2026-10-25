import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import CommandPalette from './components/ui/CommandPalette';
import { resolveHost, rememberNotCustom, type HostMode } from './utils/host';

// Lazy load all page components for better performance
const LandingPage = lazy(() => import('./pages/marketing/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const WebsiteEditor = lazy(() => import('./pages/website/WebsiteEditor'));
const WeddingEditor = lazy(() => import('./pages/website/WeddingEditor'));
const BirthdayEditor = lazy(() => import('./pages/website/BirthdayEditor'));
const HousewarmingEditor = lazy(() => import('./pages/website/HousewarmingEditor'));
const CollegeFestEditor = lazy(() => import('./pages/website/CollegeFestEditor'));
const ReligiousEventEditor = lazy(() => import('./pages/website/ReligiousEventEditor'));
const PublicWebsite = lazy(() => import('./pages/website/PublicWebsite'));
const LivePreview = lazy(() => import('./pages/website/LivePreview'));
const PublicInvoice = lazy(() => import('./pages/billing/PublicInvoice'));
const LoyaltyJoin = lazy(() => import('./pages/loyalty/LoyaltyJoin'));
const LoyaltyCard = lazy(() => import('./pages/loyalty/LoyaltyCard'));
const StampScanner = lazy(() => import('./pages/loyalty/StampScanner'));
const CounterScreen = lazy(() => import('./pages/loyalty/CounterScreen'));
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

function Router() {
  const [hostMode, setHostMode] = useState<HostMode>(() => resolveHost());

  // A website shown on its own domain or platform subdomain
  if (hostMode.mode !== 'app') {
    const site = hostMode.mode === 'custom'
      ? (
        <PublicWebsite
          customHost={hostMode.host}
          onDomainMissing={() => {
            // Not a connected custom domain: carry on as before (legacy subdomain or the app itself)
            rememberNotCustom(hostMode.host);
            setHostMode(hostMode.fallbackSlug ? { mode: 'site', slug: hostMode.fallbackSlug } : { mode: 'app' });
          }}
        />
      )
      : <PublicWebsite />;
    return (
      <BrowserRouter>
        <CommandPalette />
        <LoadingScreen>
          <MaintenanceWrapper>
            <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#FAFAFC]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
              <Routes>
                <Route path="*" element={site} />
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
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
              <Route
                path="/birthday-editor/:websiteId"
                element={<ProtectedRoute component={BirthdayEditor} />}
              />
              <Route
                path="/housewarming-editor/:websiteId"
                element={<ProtectedRoute component={HousewarmingEditor} />}
              />
              <Route
                path="/fest-editor/:websiteId"
                element={<ProtectedRoute component={CollegeFestEditor} />}
              />
              <Route
                path="/religious-editor/:websiteId"
                element={<ProtectedRoute component={ReligiousEventEditor} />}
              />
              <Route path="/_preview" element={<LivePreview />} />
              <Route path="/invoice/:token" element={<PublicInvoice />} />
              <Route path="/card/:code" element={<LoyaltyCard />} />
              <Route path="/counter/:key" element={<CounterScreen />} />
              <Route
                path="/dashboard/scan"
                element={<ProtectedRoute component={StampScanner} />}
              />
              <Route path="/:businessSlug/rewards" element={<LoyaltyJoin />} />

              <Route path="/:businessSlug" element={<PublicWebsite />} />
            </Routes>
          </Suspense>
        </MaintenanceWrapper>
      </LoadingScreen>
    </BrowserRouter>
  );
}

export default Router;
