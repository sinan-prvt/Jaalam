import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { LoyaltyIcon } from '../../components/loyalty/StampCard';
import { rewardLine, screenStampLink, type CounterScreen as Screen } from '../../utils/loyalty';

/**
 * The counter screen (/counter/:key): an old phone or tablet at the till. Customers scan
 * this QR to get their stamp; it changes every 30 seconds so a photo of it is useless later.
 * The shop opens the secret link once and leaves the screen on.
 */
export default function CounterScreen() {
  const { key = '' } = useParams();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [loadedAt, setLoadedAt] = useState(() => Date.now());

  // Fetch a fresh code whenever the current one runs out
  useEffect(() => {
    let timer = 0;
    let alive = true;
    const load = () => axios.get(`/api/loyalty/counter/${key}/`, { withCredentials: false })
      .then((res) => {
        if (!alive) return;
        setScreen(res.data);
        setLoadedAt(Date.now());
        setError('');
        timer = window.setTimeout(load, Math.max(1, res.data.refresh_in) * 1000 + 300);
      })
      .catch((err) => {
        if (!alive) return;
        if (err?.response?.status === 404) setError('This counter screen link is no longer valid. Open the new link from your Loyalty page.');
        else timer = window.setTimeout(load, 5000); // offline for a moment: keep trying
      });
    load();
    return () => { alive = false; window.clearTimeout(timer); };
  }, [key]);

  // Countdown ring
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Keep the screen awake while it sits at the counter
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    const request = () => nav.wakeLock?.request('screen').then((l) => { lock = l; }).catch(() => {});
    request();
    const onVisible = () => { if (document.visibilityState === 'visible') request(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { document.removeEventListener('visibilitychange', onVisible); lock?.release().catch(() => {}); };
  }, []);

  useEffect(() => {
    if (screen) document.title = `${screen.business} · counter screen`;
  }, [screen]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 p-8 text-center text-lg font-semibold text-white/80">{error}</div>;
  }
  if (!screen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
      </div>
    );
  }

  const left = Math.max(0, screen.refresh_in - Math.floor((now - loadedAt) / 1000));
  const paused = !screen.is_active || screen.stamp_mode !== 'SCREEN';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-10 text-white text-center"
      style={{ background: `radial-gradient(circle at 30% 10%, ${screen.color} 0%, #0f172a 75%)` }}>
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-white/15 p-3"><LoyaltyIcon name={screen.icon} size={28} /></span>
        <p className="text-2xl sm:text-3xl font-black">{screen.business}</p>
      </div>

      {paused ? (
        <p className="max-w-md text-xl font-bold text-white/80">
          {screen.is_active ? 'Self-scan is turned off. Turn on "Customers scan the counter screen" in your Loyalty page.' : 'The rewards card is paused.'}
        </p>
      ) : (
        <>
          <div>
            <p className="text-4xl sm:text-5xl font-black leading-tight">Scan to get your stamp</p>
            <p className="mt-2 text-lg font-semibold text-white/80">{rewardLine(screen)}</p>
          </div>
          <div className="rounded-[32px] bg-white p-5 shadow-2xl">
            <QRCodeSVG value={screenStampLink(screen.slug, screen.token)} size={300} level="M" />
          </div>
          <div className="w-72 max-w-full">
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${(left / 30) * 100}%` }} />
            </div>
            <p className="mt-2 text-sm font-semibold text-white/70">New code in {left}s · Open your phone camera and point it here</p>
          </div>
          <p className="text-sm text-white/60">First time? Scanning also creates your free card. No app needed.</p>
        </>
      )}
    </div>
  );
}
