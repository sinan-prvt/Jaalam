import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Camera, CameraOff, Gift, Loader2, Search } from 'lucide-react';
import { codeFromScan, type LoyaltyMember } from '../../utils/loyalty';
import { invitationCategories, otherEventCategories } from '../../utils/templateData';

// Chrome/Android has BarcodeDetector built in; Safari does not (staff there use the camera app).
interface Detector { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> }
type DetectorClass = new (opts: { formats: string[] }) => Detector;
const BarcodeDetectorImpl = (window as unknown as { BarcodeDetector?: DetectorClass }).BarcodeDetector;

interface Site { id: number; slug: string; business_type: string }

/** Staff scanner (/dashboard/scan): scan a customer's card QR, or find them by name/phone. */
export default function StampScanner() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(!!BarcodeDetectorImpl);
  const [cameraError, setCameraError] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LoyaltyMember[] | null>(null);
  const [searching, setSearching] = useState(false);

  const site = params.get('site') || sites[0]?.slug || '';

  useEffect(() => {
    document.title = 'Stamp scanner';
    axios.get('/api/websites/', { withCredentials: true })
      .then((res) => setSites((res.data as Site[]).filter(
        (w) => !invitationCategories.includes(w.business_type) && !otherEventCategories.includes(w.business_type))))
      .catch(() => setSites([]));
  }, []);

  useEffect(() => {
    if (!cameraOn || !BarcodeDetectorImpl) return;
    let stream: MediaStream | null = null;
    let timer = 0;
    let stopped = false;
    const detector = new BarcodeDetectorImpl({ formats: ['qr_code'] });

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        if (stopped) { s.getTracks().forEach((t) => t.stop()); return; }
        stream = s;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = s;
        video.play().catch(() => {});
        timer = window.setInterval(async () => {
          if (video.readyState < 2) return;
          try {
            const found = await detector.detect(video);
            const code = found.map((f) => codeFromScan(f.rawValue)).find(Boolean);
            if (code && !stopped) {
              stopped = true;
              navigator.vibrate?.(80);
              navigate(`/card/${code}`);
            }
          } catch { /* frame not ready */ }
        }, 300);
      })
      .catch(() => {
        setCameraError('Camera blocked. Allow camera access in your browser, or search for the customer below.');
        setCameraOn(false);
      });

    return () => {
      stopped = true;
      window.clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOn, navigate]);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeFromScan(query);
    if (code && /[A-Za-z_-]/.test(code) && code.length >= 10) return navigate(`/card/${code}`); // a typed card code
    if (!site || !query.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get(`/api/loyalty/sites/${site}/members/`, { params: { q: query.trim() }, withCredentials: true });
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-3">
          <Link to="/dashboard?tab=Loyalty" className="flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          {BarcodeDetectorImpl && (
            <button
              onClick={() => { setCameraError(''); setCameraOn((v) => !v); }}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"
            >
              {cameraOn ? <><CameraOff size={14} /> Stop camera</> : <><Camera size={14} /> Start camera</>}
            </button>
          )}
        </div>

        <h1 className="mt-5 text-2xl font-black">Scan a rewards card</h1>
        <p className="mt-1 text-sm text-white/60">Point the camera at the QR on the customer's phone.</p>

        <div className="relative mt-5 aspect-square overflow-hidden rounded-3xl bg-black border border-white/10">
          {cameraOn ? (
            <>
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-[18%] rounded-3xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Camera size={40} className="text-white/40" />
              <p className="text-sm font-semibold text-white/70">
                {cameraError || (BarcodeDetectorImpl
                  ? 'Camera is off.'
                  : "This browser can't scan here. Open your phone's camera app and point it at the customer's QR: it opens their card with your stamp buttons.")}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={search} className="mt-6 rounded-3xl bg-white p-4 text-slate-900">
          <p className="text-sm font-black">No QR? Find the customer</p>
          {sites.length > 1 && (
            <select
              value={site}
              onChange={(e) => { setParams({ site: e.target.value }, { replace: true }); setResults(null); }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold"
              aria-label="Shop"
            >
              {sites.map((s) => <option key={s.id} value={s.slug}>{s.slug}</option>)}
            </select>
          )}
          <div className="mt-3 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, phone or card code"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-slate-400"
            />
            <button type="submit" disabled={searching} className="shrink-0 rounded-xl bg-slate-900 px-4 text-white" aria-label="Search">
              {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>

          {results && (
            <ul className="mt-3 divide-y divide-slate-100">
              {results.length === 0 && <li className="py-3 text-sm text-slate-500">No one found. Check the spelling or number.</li>}
              {results.map((m) => (
                <li key={m.code}>
                  <Link to={`/card/${m.code}`} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{m.name}</span>
                      <span className="block text-xs text-slate-500">{m.phone}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black">
                      {m.reward_ready && <Gift size={12} className="text-emerald-600" />}{m.stamps} stamps
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
}
