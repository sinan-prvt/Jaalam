import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Loader2, MapPin, RotateCcw, ShieldCheck } from 'lucide-react';
import StampCard from '../../components/loyalty/StampCard';
import { apiError } from '../../utils/apiError';
import { currentPosition, forgetSavedCard, readSavedCard, saveCard, type PublicProgram } from '../../utils/loyalty';

type StampFailure = { message: string; needJoin?: boolean };

/**
 * The QR at the shop opens this (/:businessSlug/rewards). New customers join in 10 seconds.
 * Scanned from the counter screen (?t=code) or the printed QR in self-scan mode (?stamp=1),
 * it also adds today's stamp: straight away for a returning customer, right after joining
 * for a new one.
 */
export default function LoyaltyJoin() {
  const { businessSlug = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('t') || '';
  const wantStamp = !!token || params.get('stamp') === '1';

  const [program, setProgram] = useState<PublicProgram | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedCode, setSavedCode] = useState(() => readSavedCard(businessSlug));
  const [stampError, setStampError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [pin, setPin] = useState('');
  const codeMode = wantStamp && program?.stamp_mode === 'CODE';
  const autoTried = useRef(false);

  useEffect(() => {
    axios.get(`/api/loyalty/public/${businessSlug}/`)
      .then((res) => setProgram(res.data))
      .catch((err) => setError(err?.response?.status === 404
        ? 'This shop does not have a rewards card yet.'
        : 'Could not load the rewards card. Please check your internet and try again.'));
  }, [businessSlug]);

  useEffect(() => {
    if (program) document.title = `${program.business} rewards`;
  }, [program]);

  /** Add today's stamp to this card, then open it. Throws a StampFailure. */
  const selfStamp = async (code: string, mode: PublicProgram['stamp_mode']) => {
    const body: Record<string, unknown> = { code, token, pin };
    if (mode === 'PRINTED') {
      try {
        Object.assign(body, await currentPosition());
      } catch {
        throw { message: 'Please allow location: it shows you are at the shop. Then tap Try again.' } as StampFailure;
      }
    }
    try {
      await axios.post(`/api/loyalty/public/${businessSlug}/self-stamp/`, body, { withCredentials: false });
      navigate(`/card/${code}?stamped=1`, { replace: true });
    } catch (err) {
      const data = (err as { response?: { data?: { join?: boolean; already?: boolean } } })?.response?.data;
      if (data?.already) {
        navigate(`/card/${code}?already=1`, { replace: true }); // the card page says why
        return;
      }
      throw { message: apiError(err, 'Could not add your stamp. Please try again.'), needJoin: !!data?.join } as StampFailure;
    }
  };

  const failed = (f: StampFailure) => {
    if (f.needJoin) {
      forgetSavedCard(businessSlug); // card from an old program or another shop: join again
      setSavedCode(null);
    }
    setStampError(f.needJoin ? '' : f.message);
  };

  // Returning customer scanned the shop's QR: stamp without asking anything
  // (in code mode they type today's code first)
  useEffect(() => {
    if (!program || !wantStamp || !savedCode || autoTried.current || program.stamp_mode === 'STAFF' || program.stamp_mode === 'CODE') return;
    autoTried.current = true;
    selfStamp(savedCode, program.stamp_mode).catch(failed);
  });

  const retry = async () => {
    if (!program || !savedCode) return;
    setRetrying(true);
    setStampError('');
    try { await selfStamp(savedCode, program.stamp_mode); } catch (f) { failed(f as StampFailure); } finally { setRetrying(false); }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return setStampError("Enter the 4-digit code the cashier gave you.");
    await retry();
  };

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim()) return setFormError('Please enter your name.');
    if (phone.replace(/\D/g, '').length < 10) return setFormError('Please enter your 10-digit mobile number.');
    if (codeMode && pin.length !== 4) return setFormError("Enter today's 4-digit code. The cashier will tell you after you pay.");
    setSaving(true);
    try {
      const res = await axios.post(`/api/loyalty/public/${businessSlug}/join/`, { name, phone }, { withCredentials: false });
      const code: string = res.data.code;
      saveCard(businessSlug, code);
      if (wantStamp && program && program.stamp_mode !== 'STAFF') {
        autoTried.current = true;
        setSavedCode(code);
        try { await selfStamp(code, program.stamp_mode); } catch (f) { failed(f as StampFailure); setSaving(false); }
        return;
      }
      navigate(`/card/${code}${res.data.existing ? '' : '?welcome=1'}`, { replace: true });
    } catch (err) {
      setFormError(apiError(err, 'Could not join right now. Please try again.'));
      setSaving(false);
    }
  };

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 text-center text-slate-600 font-medium">{error}</div>;
  }
  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  const stampingNow = wantStamp && !!savedCode && !stampError && (program.stamp_mode === 'SCREEN' || program.stamp_mode === 'PRINTED');
  const pinInput = (id: string) => (
    <input
      id={id}
      value={pin}
      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
      inputMode="numeric"
      autoComplete="one-time-code"
      placeholder="• • • •"
      className="mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-center text-3xl font-black tracking-[0.5em] text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
    />
  );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <StampCard program={program} business={program.business} stamps={0} />

        {codeMode && savedCode ? (
          <form onSubmit={submitCode} className="mt-5 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
            <h1 className="text-xl font-black text-slate-900">Get today's stamp</h1>
            <p className="mt-1 text-sm text-slate-500">Ask the cashier for today's code after you pay, and type it here.</p>
            <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="loyalty-pin">Today's code</label>
            {pinInput('loyalty-pin')}
            {stampError && <p className="mt-3 text-sm font-semibold text-rose-600">{stampError}</p>}
            <button type="submit" disabled={retrying}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-black text-white shadow-lg disabled:opacity-70"
              style={{ backgroundColor: program.color }}>
              {retrying && <Loader2 size={18} className="animate-spin" />} Get my stamp
            </button>
            <Link to={`/card/${savedCode}`} className="mt-3 block text-center text-sm font-bold text-slate-500 hover:text-slate-700">Open my card</Link>
          </form>
        ) : stampingNow ? (
          <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-200">
            <Loader2 size={32} className="animate-spin" style={{ color: program.color }} />
            <p className="text-lg font-black text-slate-900">Adding your stamp…</p>
            {program.stamp_mode === 'PRINTED' && (
              <p className="flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> Checking you are at the shop</p>
            )}
          </div>
        ) : stampError && savedCode ? (
          <div className="mt-5 rounded-3xl bg-white p-6 text-center shadow-sm border border-slate-200">
            <p className="text-lg font-black text-slate-900">No stamp this time</p>
            <p className="mt-1 text-sm text-slate-600">{stampError}</p>
            <div className={`mt-5 grid gap-2 ${program.stamp_mode === 'PRINTED' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {/* A screen code can't be retried (scan the screen again); a location check can */}
              {program.stamp_mode === 'PRINTED' && (
                <button onClick={retry} disabled={retrying}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-black text-white disabled:opacity-60" style={{ backgroundColor: program.color }}>
                  {retrying ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />} Try again
                </button>
              )}
              <Link to={`/card/${savedCode}`} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700">
                Open my card
              </Link>
            </div>
          </div>
        ) : (
          <>
            {savedCode && (
              <Link
                to={`/card/${savedCode}`}
                className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white font-bold shadow-lg"
              >
                You already have a card here. Open my card <ArrowRight size={18} />
              </Link>
            )}

            <form onSubmit={join} className="mt-5 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
              <h1 className="text-xl font-black text-slate-900">
                {wantStamp ? 'Join to get your first stamp' : savedCode ? 'New here on this phone?' : 'Get your free card'}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {program.stamp_mode === 'STAFF'
                  ? 'Show your card at the counter each visit to collect a stamp. No app to install.'
                  : program.stamp_mode === 'CODE'
                    ? "Each visit, scan the QR at the counter and type the code the cashier gives you after you pay. No app to install."
                    : 'Each visit, scan the QR at the counter to collect a stamp. No app to install.'}
              </p>

              <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="loyalty-name">Your name</label>
              <input
                id="loyalty-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={150}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                placeholder="e.g. Asha"
              />

              <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="loyalty-phone">Mobile number</label>
              <input
                id="loyalty-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                placeholder="98470 12345"
              />

              {codeMode && (
                <>
                  <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="loyalty-join-pin">Today's code (ask the cashier)</label>
                  {pinInput('loyalty-join-pin')}
                </>
              )}

              {formError && <p className="mt-3 text-sm font-semibold text-rose-600">{formError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-black text-white shadow-lg disabled:opacity-70"
                style={{ backgroundColor: program.color }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                {saving ? 'Creating your card…' : wantStamp ? 'Join & get my stamp' : 'Get my card'}
              </button>

              <p className="mt-4 flex items-start gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                Your number is only shared with {program.business}, so they can find your card if you change phones.
              </p>
            </form>
          </>
        )}

        {program.terms && <p className="mt-4 px-2 text-center text-xs text-slate-500">{program.terms}</p>}
        <p className="mt-6 text-center text-xs text-slate-400">Powered by Jaalam</p>
      </div>
    </div>
  );
}
