import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


// Only the logged-in app (dashboard, admin, editors) should bounce to /login on a 401.
// Public websites (subdomains, /:slug pages, the landing page and the live preview)
// make anonymous API calls and must never redirect visitors to the login screen.
const PROTECTED_PATH = /^\/(dashboard|admin|editor|[a-z-]+-editor)(\/|$)/;

const isPublicSiteHost = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== '127';
  }
  if (host.includes('vercel.app')) return parts.length >= 4;
  return parts.length >= 3 && parts[0] !== 'www';
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (!isPublicSiteHost() && PROTECTED_PATH.test(path)) {
        // Session expired inside the app: clear it and send the user to log in again
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const GOOGLE_CLIENT_ID = "984276662605-si55rovch6a7a7v57asisljevg3q1d05.apps.googleusercontent.com"; // User will need to change this

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
