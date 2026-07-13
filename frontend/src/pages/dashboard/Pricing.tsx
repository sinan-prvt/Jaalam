import { useState } from 'react';
import axios from 'axios';
import { Check, X, Zap, Crown, Building2, Beaker } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { loginSuccess } from '../../authSlice';
import { useRazorpay } from 'react-razorpay';

export default function Pricing({ onSubscribeSuccess }: { onSubscribeSuccess?: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isUserLocked = user && (user as any).has_completed_onboarding === false;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { Razorpay } = useRazorpay();

  const plans = [
    {
      id: 'TEST',
      name: 'Test Mode',
      price: 'Free',
      icon: <Beaker size={24} className="text-emerald-500" />,
      features: [
        { name: '1 Website', included: true },
        { name: 'Basic Templates', included: true },
        { name: 'Free Hosting & SSL', included: true },
        { name: 'QR Code & Contact Form', included: true },
        { name: 'Basic SEO', included: true },
        { name: 'AI Website Builder', included: false },
        { name: 'Analytics Dashboard', included: false },
        { name: 'Custom Domain', included: false },
        { name: 'Priority Support', included: false },
      ],
      color: 'emerald'
    },
    {
      id: 'STARTER',
      name: 'Starter',
      price: '₹199',
      icon: <Zap size={24} className="text-blue-500" />,
      features: [
        { name: 'Up to 2 Websites', included: true },
        { name: 'All Standard Templates', included: true },
        { name: 'Free Hosting & SSL', included: true },
        { name: 'QR Code & Contact Form', included: true },
        { name: 'Basic SEO', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Email Support', included: true },
        { name: 'AI Website Builder', included: false },
      ],
      color: 'blue'
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      badge: 'Popular',
      price: '₹499',
      icon: <Building2 size={24} className="text-indigo-500" />,
      features: [
        { name: 'Up to 10 Websites', included: true },
        { name: 'All Standard Templates', included: true },
        { name: 'AI Website Builder', included: true },
        { name: 'Custom Domain & SSL', included: true },
        { name: 'Advanced SEO & Analytics', included: true },
        { name: 'Online Booking', included: true },
        { name: 'Remove Jaalam Branding', included: true },
        { name: 'Priority Support', included: true },
      ],
      color: 'indigo'
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: '₹999',
      icon: <Crown size={24} className="text-fuchsia-500" />,
      features: [
        { name: 'Unlimited Websites', included: true },
        { name: 'All + Premium Templates', included: true },
        { name: 'AI Website Builder', included: true },
        { name: 'Custom Domain & SSL', included: true },
        { name: 'Advanced SEO & Analytics', included: true },
        { name: 'Online Booking', included: true },
        { name: 'Remove Jaalam Branding', included: true },
        { name: '24/7 Premium Support', included: true },
      ],
      color: 'fuchsia'
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === user?.membership && !isUserLocked) {
      toast.error('You are already on this plan');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://jaalam-backend.onrender.com/api/users/subscriptions/create_order/', { plan_type: planId }, {
        withCredentials: true
      });

      if (res.data.status === 'success' && res.data.plan === 'TEST') {
        // Free tier update
        toast.success('Successfully switched to Test Mode');
        const meRes = await axios.get('https://jaalam-backend.onrender.com/api/users/me/', { withCredentials: true });
        dispatch(loginSuccess(meRes.data));
        setLoading(false);
        if (onSubscribeSuccess) onSubscribeSuccess();
        return;
      }

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Jaalam Web Builder",
        description: `${planId} Plan Subscription`,
        order_id: res.data.order_id,
        handler: async function (response: any) {
          try {
            await axios.post('https://jaalam-backend.onrender.com/api/users/subscriptions/verify_payment/', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }, {
              withCredentials: true
            });
            toast.success('Subscription activated successfully!');
            const meRes = await axios.get('https://jaalam-backend.onrender.com/api/users/me/', { withCredentials: true });
            dispatch(loginSuccess(meRes.data));
            if (onSubscribeSuccess) onSubscribeSuccess();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.username || '',
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Could not initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Pricing Plans</h2>
        <p className="text-slate-500 text-lg">Choose the perfect lifetime plan for your business. Pay once, build forever.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = user?.membership === plan.id && !isUserLocked;

          return (
            <div key={plan.id} className={`bg-white/70 backdrop-blur-xl border-2 rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl ${isCurrentPlan ? `border-${plan.color}-500 ring-4 ring-${plan.color}-100` : 'border-white/80'}`}>
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-${plan.color}-50 flex items-center justify-center mb-4`}>
                {plan.icon}
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                {plan.id !== 'TEST' && <span className="text-sm font-bold text-slate-500">/ lifetime</span>}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || isCurrentPlan || user?.is_test_user}
                className={`w-full py-3 rounded-xl font-black transition-all mb-8 ${isCurrentPlan || user?.is_test_user ? `bg-${plan.color}-50 text-${plan.color}-500 border border-${plan.color}-100 cursor-default` : `bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg`}`}
              >
                {user?.is_test_user ? 'Free for Test Users' : isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : plan.id === 'TEST' ? 'Start Free' : 'Subscribe'}
              </button>

              <div className="flex-1 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={`flex items-start gap-3 ${feature.included ? 'text-slate-700' : 'text-slate-400 opacity-60'}`}>
                    <div className="mt-0.5">
                      {feature.included ? <Check size={16} className={`text-${plan.color}-500`} /> : <X size={16} />}
                    </div>
                    <span className="text-sm font-medium leading-tight">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
