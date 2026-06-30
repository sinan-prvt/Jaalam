import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/marketing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import WebsiteEditor from './pages/website/WebsiteEditor';
import PublicWebsite from './pages/website/PublicWebsite';
import LivePreview from './pages/website/LivePreview';
import ProtectedRoute from './components/layout/ProtectedRoute';

function Router() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default Router;
