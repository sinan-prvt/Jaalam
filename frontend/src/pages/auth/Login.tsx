import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../authSlice';
import axios from 'axios';
import type { RootState } from '../../store';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    dispatch(loginStart());
    try {
      const res = await axios.post('http://localhost:8000/api/users/google_login/', {
        credential: credentialResponse.credential,
      });
      dispatch(loginSuccess(res.data));
      toast.success('Successfully logged in!');
      if (res.data.is_new_user) {
        navigate('/dashboard', { state: { tab: 'Billing' } });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.error || 'Login failed'));
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  const handleGoogleError = () => {
    dispatch(loginFailure('Google Login Failed'));
    toast.error('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-white">
          
          <div className="flex justify-center mb-8">
            <img src="/logo.png" className="w-16 h-16 object-contain" alt="Jaalam Logo" />
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jaalam</h2>
            <p className="text-slate-500 mt-2 font-medium">Log in to manage your websites</p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {loading && (
            <div className="text-indigo-600 text-sm mb-6 flex justify-center items-center gap-2 font-medium">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </div>
          )}

          <div className="flex justify-center w-full transform transition hover:-translate-y-0.5">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="rectangular"
              size="large"
              theme="outline"
              text="continue_with"
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              By continuing, you agree to our <br/> <a href="#" className="text-indigo-500 hover:text-indigo-600 hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-indigo-500 hover:text-indigo-600 hover:underline transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
