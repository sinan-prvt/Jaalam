import { useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import {
  AtSign, BarChart3, Camera, CirclePlay, Eye, Globe, Inbox, Link2, MessageCircle, Monitor, QrCode,
  Search, Smartphone, ThumbsUp, TrendingDown, TrendingUp, Users,
} from 'lucide-react';

interface AnalyticsData {
  days: number;
  totals: { visitors: number; previous: number; today: number; all_time: number; enquiries: number; live_sites: number; sites: number };
  daily: { date: string; visitors: number }[];
  sources: { source: string; visitors: number }[];
  devices: { mobile: number; desktop: number };
  sites: { slug: string; name: string; business_type: string; published: boolean; visitors: number; all_time: number; enquiries: number }[];
}

const PERIODS = [7, 30, 90];

const SOURCE_INFO: Record<string, { label: string; icon: ReactNode }> = {
  direct: { label: 'Direct link', icon: <Link2 size={16} /> },
  qr: { label: 'QR code scans', icon: <QrCode size={16} /> },
  search: { label: 'Google & search', icon: <Search size={16} /> },
  whatsapp: { label: 'WhatsApp', icon: <MessageCircle size={16} /> },
  instagram: { label: 'Instagram', icon: <Camera size={16} /> },
  facebook: { label: 'Facebook', icon: <ThumbsUp size={16} /> },
  youtube: { label: 'YouTube', icon: <CirclePlay size={16} /> },
  x: { label: 'X (Twitter)', icon: <AtSign size={16} /> },
  other: { label: 'Other websites', icon: <Globe size={16} /> },
};

const card = 'bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm';
const num = (n: number) => n.toLocaleString('en-IN');
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);
const dayLabel = (iso: string, long = false) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', long ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });

/** Visitors for the user's sites: how many, when, from where, on what device, and which site. */
export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    axios.get('/api/websites/analytics/', { params: { days } })
      .then((res) => { if (alive) { setData(res.data); setError(false); } })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [days]);

  const t = data?.totals;
  const change = t && t.previous ? Math.round(((t.visitors - t.previous) / t.previous) * 100) : null;

  return (
    <div className="max-w-5xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-500 font-medium">How people find and use your websites.</p>
        <div className="inline-flex rounded-xl bg-white/70 border border-white/60 p-1 shadow-sm" role="radiogroup" aria-label="Period">
          {PERIODS.map((d) => (
            <button
              key={d}
              role="radio"
              aria-checked={days === d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${days === d ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {error && <div className={`${card} p-6 text-center text-slate-500 font-medium`}>Could not load analytics. Please refresh the page.</div>}

      {!data && !error && (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="bg-white/40 rounded-3xl h-28" />)}</div>
          <div className="bg-white/40 rounded-3xl h-72" />
        </div>
      )}

      {data && t && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={<Users size={20} />} tone="bg-orange-50 text-orange-600" label={`Visitors · ${days} days`} value={num(t.visitors)}>
              {change !== null && (
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {change >= 0 ? '+' : ''}{change}% vs previous {days} days
                </span>
              )}
            </Stat>
            <Stat icon={<Eye size={20} />} tone="bg-sky-50 text-sky-600" label="Today" value={num(t.today)} />
            <Stat icon={<Inbox size={20} />} tone="bg-violet-50 text-violet-600" label="Enquiries & RSVPs" value={num(t.enquiries)}>
              <span className="text-xs font-medium text-slate-500">{t.visitors ? `${t.enquiries && !pct(t.enquiries, t.visitors) ? 'Under 1' : pct(t.enquiries, t.visitors)}% of visitors` : `in ${days} days`}</span>
            </Stat>
            <Stat icon={<Globe size={20} />} tone="bg-emerald-50 text-emerald-600" label="All-time visitors" value={num(t.all_time)}>
              <span className="text-xs font-medium text-slate-500">{t.live_sites} of {t.sites} sites live</span>
            </Stat>
          </div>

          <div className={`${card} p-6`}>
            <h3 className="text-lg font-black text-slate-900">Visitors per day</h3>
            <p className="text-sm text-slate-500 mb-5">Last {days} days</p>
            {t.visitors === 0 ? (
              <Empty>
                No visits in this period yet. Share your website link on WhatsApp or print your QR code to bring visitors in.
              </Empty>
            ) : (
              <DailyChart daily={data.daily} />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${card} p-6`}>
              <h3 className="text-lg font-black text-slate-900 mb-4">Where visitors come from</h3>
              {data.sources.length === 0 ? (
                <Empty>Shows once your sites get visitors.</Empty>
              ) : (
                <div className="space-y-3">
                  {data.sources.map((s) => {
                    const info = SOURCE_INFO[s.source] || SOURCE_INFO.other;
                    return (
                      <Meter key={s.source} icon={info.icon} label={info.label} value={s.visitors} total={t.visitors} />
                    );
                  })}
                </div>
              )}
            </div>
            <div className={`${card} p-6`}>
              <h3 className="text-lg font-black text-slate-900 mb-4">Phone or computer</h3>
              {t.visitors === 0 ? (
                <Empty>Shows once your sites get visitors.</Empty>
              ) : (
                <div className="space-y-3">
                  <Meter icon={<Smartphone size={16} />} label="Phone & tablet" value={data.devices.mobile} total={t.visitors} />
                  <Meter icon={<Monitor size={16} />} label="Computer" value={data.devices.desktop} total={t.visitors} />
                  <p className="pt-2 text-xs text-slate-500">
                    {data.devices.mobile >= data.devices.desktop
                      ? 'Most visitors use a phone: check how your site looks in the editor’s Mobile view.'
                      : 'Most visitors use a computer.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={`${card} p-6`}>
            <h3 className="text-lg font-black text-slate-900 mb-4">Your sites</h3>
            {data.sites.length === 0 ? (
              <Empty>Create a website to see its visitors here.</Empty>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-2 pb-3">Site</th>
                      <th className="px-2 pb-3 text-right whitespace-nowrap">{days} days</th>
                      <th className="px-2 pb-3 text-right whitespace-nowrap">All time</th>
                      <th className="px-2 pb-3 text-right">Enquiries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sites.map((s) => (
                      <tr key={s.slug} className="border-t border-slate-100">
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{s.name}</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${s.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {s.published ? 'Live' : 'Draft'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">{s.business_type}</div>
                        </td>
                        <td className="px-2 py-3 text-right font-black text-slate-900">{num(s.visitors)}</td>
                        <td className="px-2 py-3 text-right text-slate-600">{num(s.all_time)}</td>
                        <td className="px-2 py-3 text-right text-slate-600">{num(s.enquiries)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ icon, tone, label, value, children }: { icon: ReactNode; tone: string; label: string; value: string; children?: ReactNode }) {
  return (
    <div className={`${card} p-5`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tone}`}>{icon}</div>
      <div className="text-slate-500 text-[11px] font-bold mb-0.5">{label}</div>
      <div className="text-3xl font-black text-slate-900">{value}</div>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}

function Meter({ icon, label, value, total }: { icon: ReactNode; label: string; value: number; total: number }) {
  const share = pct(value, total);
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="flex items-center gap-2 font-bold text-slate-700"><span className="text-slate-400">{icon}</span>{label}</span>
        <span className="text-slate-500"><span className="font-black text-slate-900">{num(value)}</span> · {share}%</span>
      </div>
      <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
        <div className="h-full rounded-full bg-orange-600" style={{ width: `${Math.max(share, value ? 2 : 0)}%` }} />
      </div>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <BarChart3 size={20} className="text-slate-400" />
      </div>
      <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">{children}</p>
    </div>
  );
}

/** One column per day; hover or focus a column for its date and count. */
function DailyChart({ daily }: { daily: { date: string; visitors: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...daily.map((d) => d.visitors), 1);
  // Round the top of the scale to a clean number
  const step = 10 ** Math.floor(Math.log10(max));
  // At least 0-1-2, so the three ticks never repeat a value
  const top = Math.max(Math.ceil(max / step) * step, 2);
  const ticks = [top, Math.round(top / 2), 0];
  const point = active !== null ? daily[active] : null;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between h-44 text-[11px] text-slate-400 text-right w-8 shrink-0 -mt-1.5">
        {ticks.map((v) => <span key={v}>{num(v)}</span>)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="relative h-44" onMouseLeave={() => setActive(null)}>
          {ticks.map((v) => (
            <div key={v} className="absolute inset-x-0 border-t border-slate-200" style={{ bottom: `${(v / top) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {daily.map((d, i) => (
              <div
                key={d.date}
                tabIndex={0}
                role="img"
                aria-label={`${dayLabel(d.date, true)}: ${d.visitors} visitors`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="relative flex-1 h-full flex items-end justify-center outline-none cursor-default"
              >
                <div
                  className={`w-full max-w-6 rounded-t-[4px] transition-colors ${active === i ? 'bg-orange-500' : 'bg-orange-600'}`}
                  style={{ height: `${(d.visitors / top) * 100}%`, minHeight: d.visitors ? 3 : 0 }}
                />
              </div>
            ))}
          </div>
          {point && active !== null && (
            <div
              className="absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-center shadow-lg pointer-events-none whitespace-nowrap"
              style={{ left: `${((active + 0.5) / daily.length) * 100}%` }}
            >
              <div className="text-sm font-black text-white">{num(point.visitors)} visitors</div>
              <div className="text-[11px] text-slate-300">{dayLabel(point.date, true)}</div>
            </div>
          )}
        </div>
        {/* First, middle and last day: fits even on a phone */}
        <div className="relative h-4 mt-2 text-[11px] text-slate-400 whitespace-nowrap">
          <span className="absolute left-0">{dayLabel(daily[0].date)}</span>
          <span className="absolute left-1/2 -translate-x-1/2">{dayLabel(daily[Math.floor(daily.length / 2)].date)}</span>
          <span className="absolute right-0">{dayLabel(daily[daily.length - 1].date)}</span>
        </div>
      </div>
    </div>
  );
}
