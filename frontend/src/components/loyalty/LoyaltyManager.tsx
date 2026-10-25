import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as htmlToImage from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft, Check, ChevronDown, Copy, Download, ExternalLink, Gift, Info, KeyRound, Loader2, MapPin, MessageCircle,
  MonitorSmartphone, Printer, QrCode, RefreshCw, ScanLine, Search, Settings2, Smartphone, Stamp, UserCheck, UserX, Users,
} from 'lucide-react';
import StampCard, { LoyaltyIcon } from './StampCard';
import UpgradeNotice from '../ui/UpgradeNotice';
import { apiError } from '../../utils/apiError';
import { waNumber } from '../../utils/crm';
import {
  DEFAULT_LOYALTY, LOYALTY_COLORS, LOYALTY_ICONS, cardLink, counterLink, currentPosition, defaultFor, joinLink, presetsFor,
  printedStampLink, rewardLine,
  type LoyaltyMember, type LoyaltyPreset, type LoyaltySettings, type SiteProgram, type StampMode,
} from '../../utils/loyalty';

const STEPS: Record<StampMode, { icon: typeof Gift; title: string; text: string }[]> = {
  CODE: [
    { icon: Printer, title: 'Keep the QR on the billing table', text: 'Download and print the QR. It stays there all the time.' },
    { icon: KeyRound, title: "Tell today's code after payment", text: 'Only customers who pay hear the 4-digit code. It changes every day by itself.' },
    { icon: Smartphone, title: 'Customer scans and types it', text: 'First time they also type their name and phone. The stamp is added at once. No app.' },
    { icon: Gift, title: 'Give the reward', text: 'When a card is full, the customer shows it. Scan it with "Open scanner" and tap "Give reward".' },
  ],
  SCREEN: [
    { icon: Gift, title: 'Pick your reward', text: 'Choose a ready-made card for your business, or write your own, then press Start.' },
    { icon: MonitorSmartphone, title: 'Put a screen at the counter', text: 'Open the counter screen link on an old phone or tablet and leave it on. Its QR changes every 30 seconds.' },
    { icon: Smartphone, title: 'Customers scan it', text: 'First time: they type their name and phone and get the first stamp. Next visits: one scan, stamp added. No app.' },
    { icon: Gift, title: 'Give the reward', text: 'When a card is full, the customer shows it. Scan it with "Open scanner" and tap "Give reward".' },
  ],
  PRINTED: [
    { icon: Gift, title: 'Pick your reward', text: 'Choose a ready-made card for your business, or write your own, then press Start.' },
    { icon: MapPin, title: 'Set the shop location', text: 'Stand in the shop and tap "Use my location", so only phones at the shop can get a stamp.' },
    { icon: Printer, title: 'Print the QR', text: 'Download it and keep it at the counter. Customers scan it each visit and the stamp is added by itself.' },
    { icon: Gift, title: 'Give the reward', text: 'When a card is full, the customer shows it. Scan it with "Open scanner" and tap "Give reward".' },
  ],
  STAFF: [
    { icon: Gift, title: 'Pick your reward', text: 'Choose a ready-made card for your business, or write your own, then press Start.' },
    { icon: Printer, title: 'Put up the counter QR', text: 'Download it, print it and keep it at the billing counter or on the tables.' },
    { icon: Smartphone, title: 'Customers join', text: 'They scan it, type their name and phone, and the card opens on their phone. No app.' },
    { icon: QrCode, title: 'Stamp every visit', text: 'Tap "Open scanner" and scan the QR on their card. When it is full, tap "Give reward".' },
  ],
};

const MODES: { value: StampMode; title: string; text: string; tag: string }[] = [
  { value: 'CODE', title: "Printed QR + today's code", tag: 'Recommended', text: "The QR stays on the billing table. After payment the cashier says a 4-digit code (new every day); the customer types it. People who didn't buy don't get the code." },
  { value: 'SCREEN', title: 'Customers scan a counter screen', tag: 'Needs a spare phone', text: 'No work for staff. An old phone/tablet shows a QR that changes every 30 sec, so a photo of it is useless at home.' },
  { value: 'PRINTED', title: 'Customers scan a printed QR', tag: 'No screen needed', text: 'No work for staff. The phone must be at the shop (location check). Good, but location can be faked by tech-savvy users.' },
  { value: 'STAFF', title: 'Staff scan the customer', tag: 'Most secure', text: 'Staff scan the QR on the customer\'s card and tap "Add stamp". Best when someone is always at the counter.' },
];

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400 focus:bg-white';
const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500';

interface Props {
  slug: string;
  siteName: string;
  businessType: string;
  /** agency: set up and look after a client's shop. client: the shop's own daily view. */
  view: 'agency' | 'client';
  onBack?: () => void;
  siteSwitcher?: ReactNode;
}

/** One shop's loyalty card: setup, today's code / counter screen, counter QR, stats and members. */
export default function LoyaltyManager({ slug, siteName, businessType: siteType, view, onBack, siteSwitcher }: Props) {
  const [data, setData] = useState<SiteProgram | null>(null);
  const [form, setForm] = useState<LoyaltySettings>(DEFAULT_LOYALTY);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [query, setQuery] = useState('');
  const [onlyReady, setOnlyReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [locating, setLocating] = useState(false);
  const standeeRef = useRef<HTMLDivElement>(null);

  const loadMembers = (q = '') => {
    axios.get(`/api/loyalty/sites/${slug}/members/`, { params: q ? { q } : {}, withCredentials: true })
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]));
  };

  useEffect(() => {
    let alive = true;
    axios.get(`/api/loyalty/sites/${slug}/members/`, { withCredentials: true })
      .then((res) => { if (alive) setMembers(res.data); })
      .catch(() => { if (alive) setMembers([]); });
    axios.get(`/api/loyalty/sites/${slug}/`, { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        setData(res.data);
        setForm(res.data.exists ? res.data.program : defaultFor(res.data.business_type));
      })
      .catch((err) => toast.error(apiError(err, 'Could not load the loyalty card.')));
    return () => { alive = false; };
  }, [slug]);

  const applyPreset = (p: LoyaltyPreset) => setForm((f) => ({
    ...f, reward: p.reward, stamps_required: p.stamps_required, icon: p.icon, color: p.color, terms: p.terms,
  }));
  const set = <K extends keyof LoyaltySettings>(key: K, value: LoyaltySettings[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`/api/loyalty/sites/${slug}/`, form, { withCredentials: true });
      setData(res.data);
      setForm(res.data.program);
      toast.success(data?.exists ? 'Loyalty card saved' : 'Loyalty card is live! Print the counter QR.');
    } catch (err) {
      toast.error(apiError(err, 'Could not save. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const downloadStandee = async () => {
    if (!standeeRef.current) return;
    setDownloading(true);
    try {
      await document.fonts.ready;
      const url = await htmlToImage.toPng(standeeRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-rewards-qr.png`;
      a.click();
    } catch {
      toast.error('Could not create the image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const setShopLocation = async () => {
    setLocating(true);
    try {
      const pos = await currentPosition();
      setForm((f) => ({ ...f, latitude: Number(pos.latitude.toFixed(6)), longitude: Number(pos.longitude.toFixed(6)) }));
      toast.success('Shop location set. Press Save to keep it.');
    } catch {
      toast.error('Could not get your location. Allow location for this site and try again, standing in the shop.');
    } finally {
      setLocating(false);
    }
  };

  const resetCounter = async () => {
    const question = data?.program.stamp_mode === 'CODE'
      ? "Make a new code now? Today's old code stops working at once. (If you also use a counter screen, its link changes too.)"
      : "Make a new counter screen link? The old screen will stop working until you open the new link on it. (Today's code changes too.)";
    if (!window.confirm(question)) return;
    try {
      const res = await axios.post(`/api/loyalty/sites/${slug}/reset-counter/`, {}, { withCredentials: true });
      setData((d) => (d ? { ...d, counter_key: res.data.counter_key, today_code: res.data.today_code } : d));
      toast.success(data?.program.stamp_mode === 'CODE' ? `New code: ${res.data.today_code}` : 'New counter screen link made');
    } catch (err) {
      toast.error(apiError(err, 'Could not make a new link.'));
    }
  };

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast.success('Link copied'); } catch { toast.error('Could not copy'); }
  };

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  const business = data.business || siteName;
  const allowed = data.allowed;
  const stats = data.stats;
  const businessType = data.business_type || siteType;
  const presets = presetsFor(businessType);
  const shownPresets = showAllPresets ? [...presets.suggested, ...presets.others] : presets.suggested;
  // The links shown work with the saved settings, not unsaved edits
  const savedMode = data.exists ? data.program.stamp_mode : form.stamp_mode;
  const posterLink = savedMode === 'PRINTED' || savedMode === 'CODE' ? printedStampLink(slug) : joinLink(slug);
  const shownMembers = onlyReady ? members.filter((m) => m.reward_ready) : members;
  const scannerButton = data.exists && (
    <Link to={`/dashboard/scan?site=${slug}`} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">
      <ScanLine size={16} /> Open scanner
    </Link>
  );

  // --- Pieces ---------------------------------------------------------------------------

  const planNotice = !allowed && (data.is_owner ? (
    <UpgradeNotice
      title={`Loyalty cards are on the ${data.required_plan} plan`}
      message="Upgrade to turn on QR stamp cards for this website. You can still try the design below."
    />
  ) : (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="note">
      <Info size={18} className="mt-0.5 shrink-0" />
      <p><b>Loyalty cards are not turned on for this website yet.</b> Ask the person who made your website to switch on the {data.required_plan} plan. You can still try the design below.</p>
    </div>
  ));

  const howItWorks = (
    <section className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/60 p-5 sm:p-6">
      <h3 className="text-lg font-black text-slate-900">How it works</h3>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS[form.stamp_mode].map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-2xl bg-white/80 p-4 border border-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white"><s.icon size={18} /></span>
            <div>
              <p className="font-black text-slate-900"><span className="text-orange-500">{i + 1}.</span> {s.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-slate-600">
        {form.stamp_mode === 'STAFF' ? (
          <><b>Who can stamp?</b> The website owner and its client login. Sign in with either one on the counter phone and keep the scanner open.
          Customers can only see their own card, and can't add stamps themselves.</>
        ) : (
          <><b>Why can't customers cheat?</b> {form.stamp_mode === 'CODE'
            ? "Scanning alone gives nothing: the stamp needs today's code, which only paying customers hear. It changes every day, and a card is locked for the day after 5 wrong guesses"
            : form.stamp_mode === 'SCREEN'
              ? 'A stamp needs a scan at the shop: the screen\'s code changes every 30 seconds, so an old photo or a shared link stops working within 2 minutes'
              : 'A stamp needs a scan at the shop: the phone\'s location must be inside the shop area'}. And each card gets only {form.max_stamps_per_day} stamp{form.max_stamps_per_day === 1 ? '' : 's'} a day.
          Only giving the reward needs the staff.</>
        )}
      </p>
    </section>
  );

  const statsRow = stats && (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        { label: 'Members', value: stats.members, note: `+${stats.joined_this_month} this month`, icon: <Users size={18} /> },
        { label: 'Stamps this month', value: stats.stamps_this_month, note: `${stats.active_30_days} active in 30 days`, icon: <Stamp size={18} /> },
        { label: 'Rewards given', value: stats.rewards_given, note: 'all time', icon: <Gift size={18} /> },
        { label: 'Ready to claim', value: stats.ready_now, note: 'cards are full', icon: <LoyaltyIcon name={form.icon} size={18} /> },
      ].map((t) => (
        <div key={t.label} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">{t.icon} {t.label}</div>
          <p className="mt-2 text-3xl font-black text-slate-900">{t.value}</p>
          <p className="text-xs text-slate-400">{t.note}</p>
        </div>
      ))}
    </div>
  );

  const todayCodeCard = data.exists && savedMode === 'CODE' && data.today_code && (
    <div className="rounded-3xl border-2 border-orange-200 bg-white p-5 text-center">
      <h3 className="flex items-center justify-center gap-2 font-black text-slate-900"><KeyRound size={18} /> Today's code</h3>
      <p className="mt-3 text-5xl font-black tracking-[0.3em] text-orange-600">{data.today_code}</p>
      <p className="mt-3 text-sm text-slate-500">Tell this to customers after they pay. It changes by itself every night at 12.</p>
      <button onClick={resetCounter} className="mx-auto mt-4 flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
        <RefreshCw size={15} /> New code now
      </button>
      <p className="mt-2 text-xs text-slate-400">Use "New code now" if the code got shared around.</p>
    </div>
  );

  const counterScreenCard = data.exists && savedMode === 'SCREEN' && data.counter_key && (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="flex items-center gap-2 font-black text-slate-900"><MonitorSmartphone size={18} /> Counter screen</h3>
      <p className="mt-1 text-sm text-slate-500">
        Open this link on an old phone or tablet, put it on the counter facing customers and leave it on (charging).
        No login needed on that device. Keep the link private.
      </p>
      <a href={counterLink(data.counter_key)} target="_blank" rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25">
        Open counter screen <ExternalLink size={15} />
      </a>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button onClick={() => copy(counterLink(data.counter_key!))} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700">
          <Copy size={16} /> Copy link
        </button>
        <button onClick={resetCounter} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700">
          <RefreshCw size={16} /> New link
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-400">Tip: send the link to the counter phone on WhatsApp and open it there. Lost the phone? Tap "New link".</p>
    </div>
  );

  const posterCard = data.exists && savedMode !== 'SCREEN' && (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="font-black text-slate-900">Counter QR</h3>
      <p className="text-sm text-slate-500">
        {savedMode === 'CODE'
          ? "Print it and keep it on the billing table. Customers scan it and type today's code to get their stamp."
          : savedMode === 'PRINTED'
            ? 'Print it and keep it at the counter. Customers scan it each visit to get their stamp.'
            : 'Print it and keep it at the billing counter. Customers scan it to join.'}
      </p>
      <div ref={standeeRef} className="mt-4 rounded-3xl p-6 text-center text-white" style={{ backgroundColor: form.color }}>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/80">{business}</p>
        <p className="mt-2 text-2xl font-black leading-tight">{savedMode === 'PRINTED' || savedMode === 'CODE' ? 'Scan to get your stamp' : 'Scan to collect stamps'}</p>
        <p className="mt-1 text-sm font-semibold text-white/85">{rewardLine(form)}</p>
        <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-3">
          <QRCodeSVG value={posterLink} size={170} level="M" />
        </div>
        <p className="mt-3 text-xs font-bold text-white/80">
          {savedMode === 'CODE' ? 'Ask the cashier for today\'s code after you pay' : 'No app needed · Free to join'}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={downloadStandee} disabled={downloading} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Download
        </button>
        <button onClick={() => copy(posterLink)} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700">
          <Copy size={16} /> Copy link
        </button>
      </div>
      <a href={joinLink(slug)} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-1.5 text-sm font-bold text-orange-600">
        Open join page <ExternalLink size={14} />
      </a>
    </div>
  );

  const setupForm = (
    <>
      <div>
        <span className={labelClass}>How do customers get a stamp?</span>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {MODES.map((m) => (
            <button key={m.value} type="button" onClick={() => set('stamp_mode', m.value)}
              className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors ${form.stamp_mode === m.value ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${form.stamp_mode === m.value ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'}`}>
                {form.stamp_mode === m.value && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-sm font-black text-slate-900">
                  {m.title}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500">{m.tag}</span>
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{m.text}</span>
              </span>
            </button>
          ))}
        </div>

        {form.stamp_mode === 'PRINTED' && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-900">Shop location</p>
            <p className="text-xs text-slate-500">Stand inside the shop with this phone or laptop and tap the button.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={setShopLocation} disabled={locating}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-bold text-white disabled:opacity-60">
                {locating ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />}
                {form.latitude !== null ? 'Update location' : 'Use my location'}
              </button>
              <select value={form.radius_m} onChange={(e) => set('radius_m', Number(e.target.value))} aria-label="Allowed distance"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                {[100, 150, 300, 500].map((r) => <option key={r} value={r}>Within {r} m</option>)}
              </select>
            </div>
            <p className={`mt-2 text-xs font-semibold ${form.latitude !== null ? 'text-emerald-700' : 'text-amber-700'}`}>
              {form.latitude !== null && form.longitude !== null
                ? <>Location set ({form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}) · <a className="underline" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${form.latitude},${form.longitude}`}>check on map</a></>
                : 'Location not set yet: the printed QR can\'t give stamps until you set it.'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <span className={labelClass}>{showAllPresets ? 'Ready-made cards' : `Suggested for ${businessType}`}</span>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {shownPresets.map((p) => {
            const on = form.reward === p.reward && form.icon === p.icon && form.stamps_required === p.stamps_required;
            return (
              <button key={p.id} type="button" onClick={() => applyPreset(p)}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${on ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: p.color }}>
                  <LoyaltyIcon name={p.icon} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-slate-900">{p.label}</span>
                  <span className="block truncate text-xs text-slate-500">{p.stamps_required} stamps, get {p.reward}</span>
                </span>
                {on && <Check size={18} className="shrink-0 text-orange-500" />}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => setShowAllPresets((v) => !v)} className="mt-2 text-sm font-bold text-orange-600 hover:underline">
          {showAllPresets ? 'Show fewer' : `More ideas for other businesses (${presets.others.length})`}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="loy-reward">Reward</label>
          <input id="loy-reward" value={form.reward} maxLength={120} onChange={(e) => set('reward', e.target.value)} className={fieldClass} placeholder="e.g. a free haircut, ₹100 off your bill" />
        </div>
        <div>
          <label className={labelClass} htmlFor="loy-stamps">Stamps to get it: {form.stamps_required}</label>
          <input id="loy-stamps" type="range" min={2} max={30} value={form.stamps_required}
            onChange={(e) => set('stamps_required', Number(e.target.value))} className="mt-3 w-full accent-orange-500" />
        </div>
        <div>
          <label className={labelClass} htmlFor="loy-daily">Stamps per customer per day</label>
          <select id="loy-daily" value={form.max_stamps_per_day} onChange={(e) => set('max_stamps_per_day', Number(e.target.value))} className={fieldClass}>
            {[1, 2, 3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <span className={labelClass}>Stamp icon</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {LOYALTY_ICONS.map((ic) => (
              <button key={ic.value} type="button" onClick={() => set('icon', ic.value)} title={ic.label} aria-label={ic.label}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 ${form.icon === ic.value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <LoyaltyIcon name={ic.value} size={20} />
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <span className={labelClass}>Card colour</span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {LOYALTY_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => set('color', c)} aria-label={`Colour ${c}`}
                className={`h-9 w-9 rounded-full border-4 ${form.color === c ? 'border-slate-900' : 'border-white shadow'}`} style={{ backgroundColor: c }} />
            ))}
            <input type="color" value={form.color} onChange={(e) => set('color', e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200" aria-label="Custom colour" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="loy-terms">Small print (optional)</label>
          <input id="loy-terms" value={form.terms} maxLength={300} onChange={(e) => set('terms', e.target.value)} className={fieldClass}
            placeholder="One stamp per visit of ₹100 or more. Not valid with other offers." />
        </div>
        {data.exists && (
          <label className="sm:col-span-2 flex items-center gap-3 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="h-5 w-5 accent-orange-500" />
            Card is on (turn off to pause new joins and stamps; stamps are kept)
          </label>
        )}
      </div>
      <button onClick={save} disabled={saving || !allowed}
        className="mt-6 flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/25 disabled:opacity-50">
        {saving && <Loader2 size={18} className="animate-spin" />}
        {data.exists ? 'Save changes' : view === 'agency' ? 'Start the loyalty card' : 'Start my loyalty card'}
      </button>
    </>
  );

  const modeChangeNotice = data.exists && savedMode !== form.stamp_mode && (
    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
      Press <b>Save changes</b> to switch how customers get stamps.
    </p>
  );

  const setupWithPreview = (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-black text-slate-900">Card setup</h3>
        {setupForm}
      </section>
      <aside className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)] xl:content-start">
        <StampCard program={form} business={business} stamps={Math.min(3, form.stamps_required)} name="Preview" />
        {modeChangeNotice}
        {view === 'agency' && todayCodeCard}
        {view === 'agency' && counterScreenCard}
        {view === 'agency' && posterCard}
      </aside>
    </div>
  );

  const membersSection = data.exists && (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black text-slate-900">Members</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setOnlyReady((v) => !v)}
            className={`rounded-xl border px-3 py-2 text-xs font-bold ${onlyReady ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'}`}>
            <Gift size={13} className="mr-1 inline" /> Reward ready only
          </button>
          <form onSubmit={(e) => { e.preventDefault(); loadMembers(query.trim()); }} className="flex gap-2 sm:w-72">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or phone" className={`${fieldClass} !mt-0`} />
            <button type="submit" className="shrink-0 rounded-xl bg-slate-900 px-3.5 text-white" aria-label="Search members"><Search size={16} /></button>
          </form>
        </div>
      </div>
      {shownMembers.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-500">
          {query || onlyReady ? 'No members match.' : 'No members yet. Put the counter QR where customers pay.'}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {shownMembers.map((m) => {
            const wa = waNumber(m.phone);
            const left = Math.max(0, form.stamps_required - m.stamps);
            const text = m.reward_ready
              ? `Hi ${m.name}, your ${business} rewards card is full! Your reward (${form.reward}) is waiting for you. ${cardLink(m.code)}`
              : `Hi ${m.name}, you have ${m.stamps} of ${form.stamps_required} stamps at ${business}. Just ${left} more to get ${form.reward}! ${cardLink(m.code)}`;
            return (
              <li key={m.code} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">
                    {m.phone} · {m.last_stamp_at ? `last visit ${new Date(m.last_stamp_at).toLocaleDateString()}` : 'no stamps yet'}
                    {m.rewards_redeemed > 0 && ` · ${m.rewards_redeemed} reward${m.rewards_redeemed === 1 ? '' : 's'}`}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${m.reward_ready ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {m.reward_ready ? 'Reward ready' : `${m.stamps}/${form.stamps_required}`}
                </span>
                <Link to={`/card/${m.code}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  {m.reward_ready ? 'Give reward' : 'Open card'}
                </Link>
                {wa && (
                  <a href={`https://wa.me/${wa}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  // --- Client (shop) view: what the counter needs today ----------------------------------

  if (view === 'client') {
    const todayHelp: Record<StampMode, string> = {
      CODE: "After a customer pays, tell them today's code. They scan the QR on the table and type it.",
      SCREEN: 'Keep the counter screen on. Customers scan it and the stamp is added by itself.',
      PRINTED: 'Customers scan the printed QR while in the shop. The stamp is added by itself.',
      STAFF: "Scan each customer's card QR with the scanner and tap \"Add stamp\".",
    };
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{business} rewards</h2>
            <p className="text-slate-500">{data.exists ? `${rewardLine(form)}.` : 'Reward your regular customers. No app needed.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">{siteSwitcher}{scannerButton}</div>
        </div>
        {planNotice}

        {data.exists ? (
          <>
            {!form.is_active && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                Your loyalty card is paused. Turn it on again in Card settings below.
              </p>
            )}
            <section className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">At the counter today</p>
                <p className="mt-2 text-lg font-bold text-white/90">{todayHelp[savedMode]}</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                  <Link to={`/dashboard/scan?site=${slug}`} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 hover:bg-white/15">
                    <ScanLine size={24} className="shrink-0 text-orange-300" />
                    <span><span className="block font-black">Give a reward</span><span className="text-xs text-white/70">Scan a full card, tap "Give reward"</span></span>
                  </Link>
                  <button type="button" onClick={() => { setOnlyReady(true); document.getElementById('loyalty-members')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-left hover:bg-white/15">
                    <Gift size={24} className="shrink-0 text-orange-300" />
                    <span><span className="block font-black">{stats?.ready_now ?? 0} reward{stats?.ready_now === 1 ? '' : 's'} waiting</span><span className="text-xs text-white/70">Remind them on WhatsApp</span></span>
                  </button>
                </div>
              </div>
              {todayCodeCard || counterScreenCard || (
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <StampCard program={form} business={business} stamps={Math.min(3, form.stamps_required)} name="Your card" />
                </div>
              )}
            </section>
            {statsRow}
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
              <div id="loyalty-members">{membersSection}</div>
              <aside className="w-full max-w-md space-y-5">{posterCard}</aside>
            </div>
            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 sm:p-6">
                <span className="flex items-center gap-2 text-lg font-black text-slate-900"><Settings2 size={18} /> Card settings</span>
                <ChevronDown size={18} className="text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-slate-100 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div>{setupForm}</div>
                <aside className="space-y-4">
                  <StampCard program={form} business={business} stamps={Math.min(3, form.stamps_required)} name="Preview" />
                  {modeChangeNotice}
                </aside>
              </div>
            </details>
          </>
        ) : (
          <>
            {howItWorks}
            {setupWithPreview}
          </>
        )}
      </div>
    );
  }

  // --- Agency view: set up and look after a client's shop --------------------------------

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          {onBack && (
            <button onClick={onBack} className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800">
              <ArrowLeft size={16} /> All shops
            </button>
          )}
          <h2 className="text-2xl font-black text-slate-900">{business}</h2>
          <p className="text-slate-500">{businessType} · {data.exists ? rewardLine(form) : 'Loyalty card not set up yet'}</p>
        </div>
        <div className="flex flex-wrap gap-2">{scannerButton}</div>
      </div>
      {planNotice}

      {data.client ? (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <UserCheck size={18} className="mt-0.5 shrink-0" />
          <p>
            <b>Client login: {data.client}.</b> When they sign in and open Loyalty, they see today's code, the scanner, members and the counter QR,
            so the shop can run the card day to day without you.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <UserX size={18} className="mt-0.5 shrink-0" />
          <p>
            <b>No client login for this shop yet.</b> Create one in <b>Clients</b> and assign it to this website in <b>My Sites</b>,
            so the shop owner can see today's code and give rewards from their own phone.
          </p>
        </div>
      )}

      {howItWorks}
      {statsRow}
      {setupWithPreview}
      {membersSection}
    </div>
  );
}
