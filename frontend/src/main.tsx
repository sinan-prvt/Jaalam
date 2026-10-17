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

// CSRF protection: the backend checks the X-CSRFToken header on every logged-in request that
// changes data. Same-origin, axios copies it from the csrftoken cookie; the token from
// /api/users/csrf/ also covers a backend on another origin (VITE_API_URL), whose cookie
// this page cannot read. Django rotates the token at login, so a rejected token is
// refreshed and the request retried once.
let csrfToken: string | null = null;
const CSRF_URL = '/api/users/csrf/';
const UNSAFE_METHODS = ['post', 'put', 'patch', 'delete'];
const refreshCsrfToken = async () => {
  const res = await axios.get(CSRF_URL);
  csrfToken = res.data?.csrfToken || null;
  return csrfToken;
};

axios.interceptors.request.use(async (config) => {
  if (UNSAFE_METHODS.includes((config.method || 'get').toLowerCase()) && config.url !== CSRF_URL) {
    if (!csrfToken) {
      try { await refreshCsrfToken(); } catch { /* backend unreachable: let the request fail on its own */ }
    }
    if (csrfToken) config.headers.set('X-CSRFToken', csrfToken);
  }
  return config;
});

axios.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  const isCsrfFailure = error.response?.status === 403 && /csrf/i.test(String(error.response?.data?.detail || ''));
  if (isCsrfFailure && config && !config._csrfRetried) {
    config._csrfRetried = true;
    await refreshCsrfToken();
    if (csrfToken) config.headers.set('X-CSRFToken', csrfToken);
    return axios(config);
  }
  return Promise.reject(error);
});


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
