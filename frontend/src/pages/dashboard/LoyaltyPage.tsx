import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Gift, Lock, Stamp, Store, UserCheck, UserX, Users } from 'lucide-react';
import LoyaltyManager from '../../components/loyalty/LoyaltyManager';
import { LoyaltyIcon } from '../../components/loyalty/StampCard';
import { invitationCategories, otherEventCategories } from '../../utils/templateData';
import { STAMP_MODE_LABEL, rewardLine, type SiteOverview } from '../../utils/loyalty';

interface Site {
  id: number;
  slug: string;
  business_type: string;
  content?: { settings_json?: { website_name?: string } };
}

const siteLabel = (s: Site) => s.content?.settings_json?.website_name || s.slug;
const isBusiness = (type: string) => !invitationCategories.includes(type) && !otherEventCategories.includes(type);

function NoShops() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
      <Stamp className="mx-auto text-orange-500" size={36} />
      <h2 className="mt-3 text-xl font-black text-slate-900">Create a business website first</h2>
      <p className="mt-1 text-slate-500">Loyalty stamp cards work with shop, cafe, salon and other business websites.</p>
    </div>
  );
}

/**
 * Dashboard Loyalty tab. A client login (the shop) gets its daily view: today's code,
 * scanner, members. The agency/owner gets every shop at a glance and the full setup.
 */
export default function LoyaltyPage({ websites, role }: { websites: Site[]; role?: string }) {
  const sites = websites.filter((w) => isBusiness(w.business_type));
  if (!sites.length) return <NoShops />;
  return role === 'CLIENT' ? <ClientLoyalty sites={sites} /> : <AgencyLoyalty sites={sites} />;
}

function ClientLoyalty({ sites }: { sites: Site[] }) {
  const [picked, setPicked] = useState('');
  const site = sites.find((s) => s.slug === picked) || sites[0];
  const switcher = sites.length > 1 && (
    <select value={site.slug} onChange={(e) => setPicked(e.target.value)} aria-label="Shop"
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold">
      {sites.map((s) => <option key={s.id} value={s.slug}>{siteLabel(s)}</option>)}
    </select>
  );
  return (
    <LoyaltyManager key={site.slug} slug={site.slug} siteName={siteLabel(site)} businessType={site.business_type}
      view="client" siteSwitcher={switcher} />
  );
}

function AgencyLoyalty({ sites }: { sites: Site[] }) {
  const [rows, setRows] = useState<SiteOverview[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    axios.get('/api/loyalty/sites/', { withCredentials: true })
      .then((res) => { if (alive) setRows((res.data as SiteOverview[]).filter((r) => isBusiness(r.business_type))); })
      .catch(() => { if (alive) setRows([]); });
    return () => { alive = false; };
  }, [reload]);

  const openSite = open ? sites.find((s) => s.slug === open) : null;
  if (openSite) {
    return (
      <LoyaltyManager key={openSite.slug} slug={openSite.slug} siteName={siteLabel(openSite)} businessType={openSite.business_type}
        view="agency" onBack={() => { setOpen(null); setReload((n) => n + 1); }} />
    );
  }

  const list = rows ?? [];
  const live = list.filter((r) => r.program?.is_active);
  const totals = list.reduce((t, r) => ({
    members: t.members + (r.stats?.members ?? 0),
    stamps: t.stamps + (r.stats?.stamps_this_month ?? 0),
    rewards: t.rewards + (r.stats?.rewards_given ?? 0),
  }), { members: 0, stamps: 0, rewards: 0 });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Loyalty cards</h2>
        <p className="text-slate-500">Set up a stamp card for each client's shop. The shop runs it day to day from its own client login.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Shops with a card', value: `${live.length} / ${list.length}`, icon: <Store size={18} /> },
          { label: 'Members', value: totals.members, icon: <Users size={18} /> },
          { label: 'Stamps this month', value: totals.stamps, icon: <Stamp size={18} /> },
          { label: 'Rewards given', value: totals.rewards, icon: <Gift size={18} /> },
        ].map((t) => (
          <div key={t.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">{t.icon} {t.label}</div>
            <p className="mt-2 text-3xl font-black text-slate-900">{rows ? t.value : '–'}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-2 sm:p-3">
        {!rows ? (
          <p className="p-6 text-center text-sm text-slate-500">Loading shops…</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">No business websites yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((r) => {
              const status = !r.program ? 'Not set up' : r.program.is_active ? 'Live' : 'Paused';
              return (
                <li key={r.slug}>
                  <button type="button" onClick={() => setOpen(r.slug)}
                    className="flex w-full flex-wrap items-center gap-4 rounded-2xl p-3 sm:p-4 text-left hover:bg-slate-50">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                      style={{ backgroundColor: r.program?.color || '#cbd5e1' }}>
                      {r.program ? <LoyaltyIcon name={r.program.icon} size={22} /> : <Stamp size={22} />}
                    </span>
                    <span className="min-w-0 flex-1 basis-48">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-black text-slate-900">{r.business}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          status === 'Live' ? 'bg-emerald-100 text-emerald-700' : status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                          {status}
                        </span>
                        {!r.allowed && <span className="flex items-center gap-1 text-[10px] font-black uppercase text-fuchsia-600"><Lock size={11} /> Plan</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {r.business_type}
                        {r.program && ` · ${rewardLine(r.program)} · ${STAMP_MODE_LABEL[r.program.stamp_mode]}`}
                      </span>
                      <span className={`mt-1 flex items-center gap-1 text-xs font-semibold ${r.client ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {r.client ? <><UserCheck size={13} /> Client: {r.client}</> : <><UserX size={13} /> No client login</>}
                      </span>
                    </span>
                    {r.stats && (
                      <span className="flex gap-5 text-center">
                        <span><span className="block text-lg font-black text-slate-900">{r.stats.members}</span><span className="text-[11px] text-slate-500">members</span></span>
                        <span><span className="block text-lg font-black text-slate-900">{r.stats.stamps_this_month}</span><span className="text-[11px] text-slate-500">stamps / mo</span></span>
                        <span><span className="block text-lg font-black text-slate-900">{r.stats.ready_now}</span><span className="text-[11px] text-slate-500">ready</span></span>
                      </span>
                    )}
                    <span className={`flex shrink-0 items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold ${r.program ? 'border border-slate-200 text-slate-700' : 'bg-orange-500 text-white'}`}>
                      {r.program ? 'Manage' : 'Set up'} <ArrowRight size={15} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <b>How your clients use it:</b> the shop owner signs in with their client login and opens <b>Loyalty</b>.
        They see today's code, the scanner for giving rewards, members to remind on WhatsApp, and the counter QR to print.
      </p>
    </div>
  );
}
