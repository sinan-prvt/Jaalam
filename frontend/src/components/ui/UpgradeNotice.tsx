import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeNoticeProps {
  title: string;
  message: string;
  className?: string;
}

/** "This needs a higher plan" banner with a button to the Pricing tab. */
export default function UpgradeNotice({ title, message, className = '' }: UpgradeNoticeProps) {
  const navigate = useNavigate();
  return (
    <div className={`rounded-2xl border border-fuchsia-200 bg-fuchsia-50/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 ${className}`} role="note">
      <Lock size={18} className="text-fuchsia-600 shrink-0" />
      <div className="flex-1 text-sm">
        <p className="font-black text-slate-900">{title}</p>
        <p className="text-slate-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/dashboard', { state: { tab: 'Pricing' } })}
        className="shrink-0 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-slate-700"
      >
        See plans
      </button>
    </div>
  );
}
