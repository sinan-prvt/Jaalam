import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import WebsiteEditor from './pages/WebsiteEditor';
import PublicWebsite from './pages/PublicWebsite';
import LivePreview from './pages/LivePreview';
import ProtectedRoute from './components/ProtectedRoute';

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
