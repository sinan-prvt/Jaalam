import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Phone, Mail, MessageCircle, CalendarClock, StickyNote, Users, ArrowRightLeft, Save } from 'lucide-react';
import { apiError } from '../../../utils/apiError';
import { LEAD_SOURCES, LEAD_STATUSES, waNumber, type Lead } from '../../../utils/crm';

interface Activity {
  id: number;
  kind: string;
  text: string;
  created_at: string;
  created_by_name: string;
}

const KIND_ICON: Record<string, typeof Phone> = {
  CALL: Phone, WHATSAPP: MessageCircle, EMAIL: Mail, MEETING: Users, NOTE: StickyNote, STATUS: ArrowRightLeft, FOLLOW_UP: CalendarClock,
};
const KIND_LABEL: Record<string, string> = {
  CALL: 'Call', WHATSAPP: 'WhatsApp', EMAIL: 'Email', MEETING: 'Meeting', NOTE: 'Note', STATUS: 'Status', FOLLOW_UP: 'Follow-up',
};

/** "2026-10-18T10:00" in the browser's time zone, for datetime-local inputs. */
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const inDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return toLocalInput(d.toISOString());
};

const field = 'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/20';
const label = 'block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5';

interface LeadDrawerProps {
  lead: Lead;
  siteName: string;
  onClose: () => void;
  onChange: (lead: Lead) => void;
}

export default function LeadDrawer({ lead, siteName, onClose, onChange }: LeadDrawerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [form, setForm] = useState({
    status: lead.status, source: lead.source, value: lead.value ?? '', notes: lead.notes ?? '',
    follow_up_at: toLocalInput(lead.follow_up_at), follow_up_note: lead.follow_up_note || '',
  });
  const [logKind, setLogKind] = useState('CALL');
  const [logText, setLogText] = useState('');
  const [saving, setSaving] = useState(false);

  const loadActivities = () =>
    axios.get(`/api/customers/${lead.id}/activities/`, { withCredentials: true })
      .then((res) => setActivities(res.data))
      .catch(() => toast.error('Could not load the timeline'));

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  const dirty = form.status !== lead.status || form.source !== lead.source || String(form.value) !== String(lead.value ?? '')
    || form.notes !== (lead.notes ?? '') || form.follow_up_at !== toLocalInput(lead.follow_up_at) || form.follow_up_note !== (lead.follow_up_note || '');

  const save = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`/api/customers/${lead.id}/`, {
        status: form.status,
        source: form.source,
        value: form.value === '' ? null : form.value,
        notes: form.notes,
        follow_up_at: form.follow_up_at ? new Date(form.follow_up_at).toISOString() : null,
        follow_up_note: form.follow_up_at ? form.follow_up_note : '',
      }, { withCredentials: true });
      onChange(res.data);
      loadActivities();
      toast.success('Saved');
    } catch (err) {
      toast.error(apiError(err, 'Could not save'));
    } finally {
      setSaving(false);
    }
  };

  const logActivity = async () => {
    if (logKind === 'NOTE' && !logText.trim()) return toast.error('Write a note first');
    try {
      await axios.post(`/api/customers/${lead.id}/activities/`, { kind: logKind, text: logText }, { withCredentials: true });
      setLogText('');
      const res = await axios.get(`/api/customers/${lead.id}/`, { withCredentials: true });
      onChange(res.data);
      setForm((f) => ({ ...f, status: res.data.status }));
      loadActivities();
    } catch (err) {
      toast.error(apiError(err, 'Could not add to the timeline'));
    }
  };

  const phone = waNumber(lead.whatsapp || lead.phone);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900 truncate">{lead.name}</h2>
            <p className="text-sm text-slate-500">{siteName} · added {new Date(lead.created_at).toLocaleDateString('en-IN')}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100" aria-label="Close"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <a href={lead.phone ? `tel:${lead.phone}` : undefined} aria-disabled={!lead.phone}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-bold ${lead.phone ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-50 text-slate-300 pointer-events-none'}`}>
              <Phone size={18} /> Call
            </a>
            <a href={phone ? `https://wa.me/${phone}` : undefined} target="_blank" rel="noreferrer" aria-disabled={!phone}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-bold ${phone ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-50 text-slate-300 pointer-events-none'}`}>
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={lead.email ? `mailto:${lead.email}` : undefined} aria-disabled={!lead.email}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-bold ${lead.email ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-50 text-slate-300 pointer-events-none'}`}>
              <Mail size={18} /> Email
            </a>
          </div>
          <div className="text-sm text-slate-600 space-y-0.5">
            {lead.phone && <p>📞 {lead.phone}</p>}
            {lead.email && <p>✉️ {lead.email}</p>}
          </div>

          {lead.message && (
            <div>
              <p className={label}>Their message</p>
              <p className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-700 whitespace-pre-line">{lead.message}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={field}>
                {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={field}>
                {LEAD_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={label}>Expected value (₹)</label>
              <input type="number" min="0" step="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={field} placeholder="e.g. 15000" />
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 space-y-3">
            <p className="font-bold text-slate-900 flex items-center gap-2"><CalendarClock size={16} className="text-orange-600" /> Follow-up</p>
            <div className="flex flex-wrap gap-2">
              {[['Tomorrow', 1], ['In 3 days', 3], ['Next week', 7]].map(([text, days]) => (
                <button key={text} type="button" onClick={() => setForm({ ...form, follow_up_at: inDays(days as number) })}
                  className="px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700 hover:bg-orange-100">
                  {text}
                </button>
              ))}
              {form.follow_up_at && (
                <button type="button" onClick={() => setForm({ ...form, follow_up_at: '', follow_up_note: '' })} className="px-3 py-1 rounded-full text-xs font-bold text-slate-500 hover:bg-white">
                  Clear
                </button>
              )}
            </div>
            <input type="datetime-local" value={form.follow_up_at} onChange={(e) => setForm({ ...form, follow_up_at: e.target.value })} className={field} aria-label="Follow-up date and time" />
            {form.follow_up_at && (
              <input value={form.follow_up_note} maxLength={200} onChange={(e) => setForm({ ...form, follow_up_note: e.target.value })} className={field} placeholder="What to do, e.g. Send the quote" />
            )}
          </div>

          <div>
            <label className={label}>Private notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={field} placeholder="Only you can see these" />
          </div>

          <button onClick={save} disabled={!dirty || saving} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 disabled:opacity-40">
            <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
          </button>

          <div>
            <p className={label}>Timeline</p>
            <div className="flex gap-2 mb-3">
              <select value={logKind} onChange={(e) => setLogKind(e.target.value)} className="border border-slate-200 rounded-xl px-2 py-2 text-sm bg-white" aria-label="Activity type">
                {['CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'NOTE'].map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
              </select>
              <input value={logText} onChange={(e) => setLogText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') logActivity(); }}
                className={field} placeholder={logKind === 'NOTE' ? 'Write a note' : 'What happened? (optional)'} />
              <button onClick={logActivity} className="shrink-0 px-4 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700">Add</button>
            </div>
            <ol className="space-y-3">
              {activities.map((a) => {
                const Icon = KIND_ICON[a.kind] || StickyNote;
                return (
                  <li key={a.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"><Icon size={14} /></div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-800"><span className="font-bold">{KIND_LABEL[a.kind] || a.kind}</span>{a.text ? ` · ${a.text}` : ''}</p>
                      <p className="text-[11px] text-slate-400">{new Date(a.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}{a.created_by_name ? ` · ${a.created_by_name}` : ''}</p>
                    </div>
                  </li>
                );
              })}
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><Users size={14} /></div>
                <div>
                  <p className="text-sm text-slate-800"><span className="font-bold">Lead created</span> · {LEAD_SOURCES.find((s) => s.value === lead.source)?.label || lead.source}</p>
                  <p className="text-[11px] text-slate-400">{new Date(lead.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
