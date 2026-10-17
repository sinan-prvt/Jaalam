import { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, Zap, Crown, Building2, Sparkles, CalendarClock, Infinity as InfinityIcon, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { loginSuccess } from '../../authSlice';
import { useRazorpay } from 'react-razorpay';
import usePlan from '../../hooks/usePlan';
import type { CatalogPlan } from '../../utils/plan';

type Period = 'MONTHLY' | 'YEARLY';

// Shown if the catalog can't be loaded; the backend (users/plans.py) is the source of truth.
const FALLBACK_PLANS: CatalogPlan[] = [
  { code: 'TEST', name: 'Free', monthly_price: 0, yearly_price: 0, limits: { websites: 1, ai_generations: 0 }, features: ['crm'], highlights: ['1 website', 'All standard templates', 'Free hosting & SSL', 'QR code & contact form', 'Lead inbox'] },
  { code: 'STARTER', name: 'Starter', monthly_price: 199, yearly_price: 1990, limits: { websites: 2, ai_generations: 0 }, features: [], highlights: ['2 websites', 'All standard templates', 'GST invoices', 'Visitor analytics', 'Custom domain', 'Email support'] },
  { code: 'BUSINESS', name: 'Business', monthly_price: 499, yearly_price: 4990, limits: { websites: 10, ai_generations: 50 }, features: [], highlights: ['10 websites', 'Remove Jaalam branding', 'AI marketing (50 / month)', 'Client accounts for agencies', 'Everything in Starter', 'Priority support'], badge: 'Popular' },
  { code: 'PREMIUM', name: 'Premium', monthly_price: 999, yearly_price: 9990, limits: { websites: null, ai_generations: 300 }, features: [], highlights: ['Unlimited websites', 'Premium modern templates', 'AI marketing (300 / month)', 'Everything in Business', '24/7 premium support'] },
];

const PLAN_STYLE: Record<string, { icon: React.ReactNode; tile: string; ring: string; check: string }> = {
  TEST: { icon: <Sparkles size={24} className="text-emerald-500" />, tile: 'bg-emerald-50', ring: 'border-emerald-500 ring-4 ring-emerald-100', check: 'text-emerald-500' },
  STARTER: { icon: <Zap size={24} className="text-blue-500" />, tile: 'bg-blue-50', ring: 'border-blue-500 ring-4 ring-blue-100', check: 'text-blue-500' },
  BUSINESS: { icon: <Building2 size={24} className="text-orange-500" />, tile: 'bg-orange-50', ring: 'border-orange-500 ring-4 ring-orange-100', check: 'text-orange-500' },
  PREMIUM: { icon: <Crown size={24} className="text-fuchsia-500" />, tile: 'bg-fuchsia-50', ring: 'border-fuchsia-500 ring-4 ring-fuchsia-100', check: 'text-fuchsia-500' },
};

const ORDER = ['TEST', 'STARTER', 'BUSINESS', 'PREMIUM'];
const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Pricing({ onSubscribeSuccess }: { onSubscribeSuccess?: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isUserLocked = user && user.has_completed_onboarding === false;
  const dispatch = useDispatch();
  const { Razorpay } = useRazorpay();
  const { plan, unrestricted } = usePlan();
  const [catalog, setCatalog] = useState<CatalogPlan[]>(FALLBACK_PLANS);
  const [period, setPeriod] = useState<Period>(plan?.period === 'YEARLY' ? 'YEARLY' : 'MONTHLY');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/users/subscriptions/plans/')
      .then((res) => { if (Array.isArray(res.data?.plans) && res.data.plans.length) setCatalog(res.data.plans); })
      .catch(() => undefined);
  }, []);

  const refreshUser = async () => {
    const meRes = await axios.get('/api/users/me/');
    dispatch(loginSuccess(meRes.data));
  };

  const currentCode = plan?.code || user?.membership || 'TEST';
  const isLifetime = plan?.period === 'LIFETIME';
  const expiringSoon = !!plan && plan.is_paid && !isLifetime && plan.days_left !== null && plan.days_left <= 7;

  const handleSubscribe = async (code: string) => {
    if (code === 'TEST' && plan?.is_paid && !isLifetime && !window.confirm('Switch to Free now? Your remaining paid days will be lost.')) return;
    setLoadingPlan(code);
    try {
      const res = await axios.post('/api/users/subscriptions/create_order/', { plan_type: code, billing_period: period });

      if (res.data.status === 'success' && res.data.plan === 'TEST') {
        toast.success('You are on the Free plan');
        await refreshUser();
        onSubscribeSuccess?.();
        return;
      }

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'Jaalam Web Builder',
        description: `${res.data.plan_name || code} plan · ${period === 'YEARLY' ? '1 year' : '1 month'}`,
        order_id: res.data.order_id,
        handler: async (response: any) => {
          try {
            await axios.post('/api/users/subscriptions/verify_payment/', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful — your plan is active!');
            await refreshUser();
            onSubscribeSuccess?.();
          } catch {
            toast.error('Payment verification failed. If money was deducted, it will be applied automatically within a few minutes.');
          }
        },
        prefill: { name: user?.username || '', email: user?.email || '' },
        theme: { color: '#ea580c' },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Could not start the payment');
    } finally {
      setLoadingPlan(null);
    }
  };

  const buttonFor = (p: CatalogPlan) => {
    const isCurrent = p.code === currentCode && !isUserLocked;
    const rank = ORDER.indexOf(p.code) - ORDER.indexOf(currentCode);
    if (unrestricted) return { label: 'Included for you', disabled: true };
    // A lifetime plan already covers itself and everything below it.
    const lifetimeRank = ORDER.indexOf(user?.lifetime_plan || '');
    if (lifetimeRank > 0 && ORDER.indexOf(p.code) <= lifetimeRank && !isCurrent) return { label: 'Included in your lifetime plan', disabled: true };
    if (isCurrent && p.code === 'TEST') return { label: 'Current plan', disabled: true };
    if (isCurrent && isLifetime) return { label: 'Lifetime — yours', disabled: true };
    if (isCurrent) return { label: expiringSoon || plan?.in_grace ? 'Renew now' : 'Extend plan', disabled: false, highlight: expiringSoon || plan?.in_grace };
    if (p.code === 'TEST') return { label: isUserLocked ? 'Start free' : 'Switch to Free', disabled: false };
    return { label: rank > 0 ? 'Upgrade' : 'Switch', disabled: false };
  };

  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-500">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Pricing Plans</h2>
        <p className="text-slate-500 text-lg">Pick a plan, pay monthly or yearly, and change any time. Unused days carry over when you switch.</p>
      </div>

      {/* Current plan status */}
      {plan && !unrestricted && !isUserLocked && (
        <div className={`max-w-3xl mx-auto mb-8 rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 ${plan.expired || plan.in_grace ? 'bg-red-50 border-red-200' : expiringSoon ? 'bg-amber-50 border-amber-200' : 'bg-white/70 border-white'}`}>
          <div className="flex items-center gap-3 flex-1">
            {isLifetime ? <InfinityIcon className="text-fuchsia-500 shrink-0" /> : plan.expired || plan.in_grace ? <AlertTriangle className="text-red-500 shrink-0" /> : <CalendarClock className="text-orange-500 shrink-0" />}
            <div className="text-sm">
              <p className="font-black text-slate-900">You're on {plan.name}{isLifetime ? ' — lifetime' : plan.period ? ` (${plan.period.toLowerCase()})` : ''}</p>
              <p className="text-slate-600">
                {plan.expired
                  ? 'Your paid plan has ended. Renew to restore your features and paused websites.'
                  : plan.in_grace
                    ? `Expired on ${formatDate(plan.expires_at!)} — features stay on for a few more days. Renew now to avoid interruption.`
                    : plan.expires_at
                      ? `Renews on ${formatDate(plan.expires_at)} · ${plan.days_left} day(s) left`
                      : isLifetime ? 'Bought under one-time pricing: it never expires.' : 'No payment needed.'}
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 sm:text-right">
            {plan.usage.websites} / {plan.limits.websites ?? '∞'} websites
            {(plan.limits.ai_generations ?? 0) > 0 && <><br />{plan.usage.ai_generations} / {plan.limits.ai_generations} AI this month</>}
          </div>
        </div>
      )}

      {/* Monthly / yearly */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-white/80 border border-white p-1 shadow-sm" role="radiogroup" aria-label="Billing period">
          {(['MONTHLY', 'YEARLY'] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={period === p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-full text-sm font-black transition-all ${period === p ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {p === 'MONTHLY' ? 'Monthly' : 'Yearly'}
              {p === 'YEARLY' && <span className={`ml-2 text-[10px] font-black uppercase ${period === p ? 'text-emerald-300' : 'text-emerald-600'}`}>2 months free</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {catalog.map((p) => {
          const style = PLAN_STYLE[p.code] || PLAN_STYLE.TEST;
          const isCurrent = p.code === currentCode && !isUserLocked && !unrestricted;
          const price = period === 'YEARLY' ? p.yearly_price : p.monthly_price;
          const btn = buttonFor(p);
          const busy = loadingPlan === p.code;
          return (
            <div key={p.code} className={`bg-white/70 backdrop-blur-xl border-2 rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl ${isCurrent ? style.ring : 'border-white/80'}`}>
              {(p.badge || isCurrent) && (
                <div className={`absolute top-0 right-0 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest ${isCurrent ? 'bg-slate-900' : 'bg-orange-500'}`}>
                  {isCurrent ? 'Your plan' : p.badge}
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl ${style.tile} flex items-center justify-center mb-4`}>{style.icon}</div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-slate-900">{rupees(price)}</span>
                {price > 0 && <span className="text-sm font-bold text-slate-500">/ {period === 'YEARLY' ? 'year' : 'month'}</span>}
              </div>
              <p className="text-xs font-semibold text-slate-400 mb-6 h-4">
                {price > 0 && period === 'YEARLY' ? `${rupees(Math.round(p.yearly_price / 12))} / month, billed yearly` : ''}
              </p>

              <button
                onClick={() => handleSubscribe(p.code)}
                disabled={btn.disabled || loadingPlan !== null}
                className={`w-full py-3 rounded-xl font-black transition-all mb-8 ${btn.disabled ? 'bg-slate-100 text-slate-500 cursor-default' : btn.highlight ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-md' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'}`}
              >
                {busy ? 'Processing…' : btn.label}
              </button>

              <div className="flex-1 space-y-3">
                {p.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3 text-slate-700">
                    <Check size={16} className={`mt-0.5 shrink-0 ${style.check}`} />
                    <span className="text-sm font-medium leading-tight">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
        Prices include all features listed. When a paid plan ends you get a short grace period; after that, websites over your plan's limit are paused (never deleted) until you renew.
      </p>
    </div>
  );
}
