import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/users/password_reset/', { email });
      setSent(true);
    } catch (err: any) {
      toast.error(err.response?.status === 429 ? 'Too many requests. Please try again later.' : 'Could not send the email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot password" subtitle="For client accounts with a username and password. Google sign-ins don't need a password.">
      {sent ? (
        <p className="text-sm text-slate-600 text-center">
          If an account uses <strong>{email}</strong>, we've sent a link to reset its password. Check your inbox (and spam folder).
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-slate-600">Account email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-50">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-indigo-600 hover:underline">Back to sign in</Link></p>
    </AuthCard>
  );
}

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-white">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" className="w-14 h-14 object-contain" alt="Jaalam Logo" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 text-center">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-2 mb-8 text-sm text-center">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
