import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthCard } from './ForgotPassword';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('The two passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/users/password_reset_confirm/', { uid, token, new_password: password });
      toast.success('Password updated. You can sign in now.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Could not reset the password.');
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <AuthCard title="Reset password" subtitle="This link is incomplete.">
        <p className="text-center text-sm"><Link to="/forgot-password" className="font-semibold text-indigo-600 hover:underline">Request a new link</Link></p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Use at least 8 characters, and avoid common passwords.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold text-slate-600">New password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-slate-600">Repeat new password</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} autoComplete="new-password"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-50">
          {loading ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </AuthCard>
  );
}
