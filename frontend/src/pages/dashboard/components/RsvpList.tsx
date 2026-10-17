import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Download, Trash2, MailOpen } from 'lucide-react';

interface Rsvp {
  id: number;
  name: string;
  attending: '' | 'YES' | 'NO';
  message: string;
  answers: Record<string, string>;
  created_at: string;
}

interface Site {
  id: number;
  slug: string;
  content?: { settings_json?: { website_name?: string } };
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** The guest list for one invitation: who's coming, who isn't, and what they wrote. */
export default function RsvpList({ sites }: { sites: Site[] }) {
  const [slug, setSlug] = useState(sites[0]?.slug || '');
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [summary, setSummary] = useState({ total: 0, attending: 0, declined: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    axios.get(`/api/websites/${slug}/rsvps/`, { withCredentials: true })
      .then((res) => { if (!cancelled) { setRsvps(res.data.results); setSummary(res.data.summary); } })
      .catch(() => toast.error('Could not load RSVPs'))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const remove = async (rsvp: Rsvp) => {
    if (!window.confirm(`Delete ${rsvp.name}'s reply?`)) return;
    try {
      await axios.delete(`/api/websites/${slug}/rsvps/${rsvp.id}/`, { withCredentials: true });
      setRsvps((list) => list.filter((r) => r.id !== rsvp.id));
      setSummary((s) => ({
        total: s.total - 1,
        attending: s.attending - (rsvp.attending === 'YES' ? 1 : 0),
        declined: s.declined - (rsvp.attending === 'NO' ? 1 : 0),
      }));
    } catch {
      toast.error('Could not delete the reply');
    }
  };

  const downloadCsv = () => {
    const keys = Array.from(new Set(rsvps.flatMap((r) => Object.keys(r.answers))));
    const rows = [
      ['Name', 'Reply', 'Message', ...keys, 'Date'],
      ...rsvps.map((r) => [
        r.name, r.attending === 'YES' ? 'Attending' : r.attending === 'NO' ? 'Not attending' : '',
        r.message, ...keys.map((k) => r.answers[k] || ''), new Date(r.created_at).toLocaleString('en-IN'),
      ]),
    ];
    const blob = new Blob(['﻿' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rsvps-${slug}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (sites.length === 0) {
    return (
      <div className="bg-white/60 border border-slate-200 border-dashed rounded-3xl p-10 text-center">
        <MailOpen className="w-14 h-14 text-slate-300 mx-auto mb-3" />
        <p className="font-black text-slate-900">No invitations yet</p>
        <p className="text-sm text-slate-500">Create a wedding or birthday invitation and guests' RSVPs will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <select value={slug} onChange={(e) => { setLoading(true); setSlug(e.target.value); }}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none" aria-label="Invitation">
          {sites.map((s) => <option key={s.slug} value={s.slug}>{s.content?.settings_json?.website_name || s.slug}</option>)}
        </select>
        <button onClick={downloadCsv} disabled={rsvps.length === 0} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 disabled:opacity-40">
          <Download size={16} /> Download guest list (CSV)
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Replies', value: summary.total, style: 'text-slate-900' },
          { label: 'Attending', value: summary.attending, style: 'text-emerald-600' },
          { label: 'Not attending', value: summary.declined, style: 'text-rose-500' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className={`text-3xl font-black ${card.style}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading…</div>
        ) : rsvps.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No replies yet. Share your invitation link with guests.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rsvps.map((r) => (
              <li key={r.id} className="p-4 flex gap-3 items-start">
                {r.attending === 'NO'
                  ? <XCircle className="text-rose-400 shrink-0 mt-0.5" size={20} />
                  : <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{r.name} <span className="font-medium text-slate-500 text-sm">· {r.attending === 'NO' ? 'not attending' : r.attending === 'YES' ? 'attending' : 'replied'}</span></p>
                  {r.message && <p className="text-sm text-slate-600 whitespace-pre-line mt-1">{r.message}</p>}
                  {Object.entries(r.answers).map(([k, v]) => <p key={k} className="text-xs text-slate-500 mt-1"><span className="font-bold">{k}:</span> {v}</p>)}
                  <p className="text-[11px] text-slate-400 mt-1">{new Date(r.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <button onClick={() => remove(r)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete reply"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
