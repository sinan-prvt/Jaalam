import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Phone, Mail, Search, Plus, CalendarClock, X, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import LeadDrawer from './components/LeadDrawer';
import RsvpList from './components/RsvpList';
import { apiError } from '../../utils/apiError';
import { inr } from '../../utils/gst';
import { LEAD_SOURCES, LEAD_STATUSES, followUpState, isOpen, type Lead } from '../../utils/crm';
import { invitationCategories } from '../../utils/templateData';

const FOLLOW_UP_STYLE = { overdue: 'text-rose-600 font-bold', today: 'text-orange-600 font-bold', upcoming: 'text-slate-500' };

const EMPTY_LEAD = { website: '', name: '', phone: '', email: '', source: 'WALK_IN', value: '', notes: '' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Lead[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'leads' | 'rsvps'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebsite, setSelectedWebsite] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newLead, setNewLead] = useState(EMPTY_LEAD);

  const fetchData = async () => {
    try {
      const [customersRes, websitesRes] = await Promise.all([
        axios.get('/api/customers/', { withCredentials: true }),
        axios.get('/api/websites/', { withCredentials: true })
      ]);
      setCustomers(customersRes.data);
      setWebsites(websitesRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const replace = (lead: Lead) => setCustomers((list) => list.map((c) => (c.id === lead.id ? lead : c)));

  const updateCustomerStatus = async (id: number, status: string) => {
    try {
      const res = await axios.patch(`/api/customers/${id}/`, { status }, { withCredentials: true });
      replace(res.data);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const addLead = async () => {
    if (!newLead.website) return toast.error('Choose a website');
    if (!newLead.name.trim()) return toast.error('Enter a name');
    try {
      const res = await axios.post('/api/customers/', { ...newLead, value: newLead.value || null }, { withCredentials: true });
      setCustomers((list) => [res.data, ...list]);
      setAdding(false);
      setNewLead(EMPTY_LEAD);
      setSelectedId(res.data.id);
    } catch (err) {
      toast.error(apiError(err, 'Could not add the lead'));
    }
  };

  const query = searchQuery.toLowerCase();
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phone && c.phone.includes(searchQuery));
    const matchesWebsite = selectedWebsite === 'all' || c.website.toString() === selectedWebsite;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'open' ? isOpen(c) : c.status === statusFilter);
    return matchesSearch && matchesWebsite && matchesStatus;
  });

  const dueLeads = customers
    .filter((c) => ['overdue', 'today'].includes(followUpState(c) || ''))
    .sort((a, b) => a.follow_up_at!.localeCompare(b.follow_up_at!));
  const openLeads = customers.filter(isOpen);
  const pipeline = openLeads.reduce((sum, c) => sum + Number(c.value || 0), 0);
  const won = customers.filter((c) => c.status === 'COMPLETED');
  const decided = won.length + customers.filter((c) => c.status === 'LOST').length;

  const getWebsiteName = (websiteId: number) => {
    const site = websites.find(w => w.id === websiteId);
    return site?.content?.settings_json?.website_name || site?.slug || 'Unknown Site';
  };
  const invitationSites = websites.filter((w) => invitationCategories.includes(w.business_type));
  const businessSites = websites.filter((w) => !invitationCategories.includes(w.business_type));
  const selected = customers.find((c) => c.id === selectedId) || null;

  return (
    <div className="max-w-7xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <p className="text-slate-500">Enquiries from your websites, follow-ups and invitation RSVPs.</p>
        {tab === 'leads' && (
          <button onClick={() => { setNewLead({ ...EMPTY_LEAD, website: String(businessSites[0]?.id || websites[0]?.id || '') }); setAdding(true); }}
            className="bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 shadow-sm">
            <Plus size={18} /> Add lead
          </button>
        )}
      </div>

      <div className="inline-flex bg-slate-100 rounded-xl p-1 mb-6">
        {([['leads', 'Leads', Users], ['rsvps', 'RSVPs', MailOpen]] as const).map(([key, text, Icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon size={16} /> {text}
          </button>
        ))}
      </div>

      {tab === 'rsvps' ? (
        loading ? null : <RsvpList sites={invitationSites} />
      ) : (
        <>
          {!loading && customers.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Open leads', value: String(openLeads.length) },
                { label: 'Follow-ups due', value: String(dueLeads.length), style: dueLeads.length ? 'text-orange-600' : '' },
                { label: 'Pipeline value', value: inr(pipeline).replace(/\.00$/, '') },
                { label: 'Win rate', value: decided ? `${Math.round((won.length / decided) * 100)}%` : '—' },
              ].map((card) => (
                <div key={card.label} className="bg-white/70 rounded-2xl border border-slate-200 p-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className={`text-2xl font-black text-slate-900 ${card.style || ''}`}>{card.value}</p>
                </div>
              ))}
            </div>
          )}

          {dueLeads.length > 0 && (
            <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
              <p className="font-black text-slate-900 flex items-center gap-2 mb-3"><CalendarClock size={18} className="text-orange-600" /> Follow up today</p>
              <div className="flex flex-wrap gap-2">
                {dueLeads.map((c) => (
                  <button key={c.id} onClick={() => setSelectedId(c.id)} className="text-left bg-white rounded-xl border border-orange-100 px-3 py-2 hover:border-orange-300 max-w-xs">
                    <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                    <p className={`text-xs ${FOLLOW_UP_STYLE[followUpState(c)!]}`}>
                      {followUpState(c) === 'overdue' ? 'Overdue · ' : ''}
                      {new Date(c.follow_up_at!).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                      {c.follow_up_note ? ` · ${c.follow_up_note}` : ''}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-3 bg-white/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm font-medium placeholder:text-slate-400 shadow-inner outline-none"
              />
            </div>
            <div className="w-full lg:w-auto grid grid-cols-2 gap-2">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status"
                className="px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none cursor-pointer">
                <option value="open">Open leads</option>
                <option value="all">All leads</option>
                {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <select value={selectedWebsite} onChange={(e) => setSelectedWebsite(e.target.value)} aria-label="Website"
                className="px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none cursor-pointer">
                <option value="all">All sites</option>
                {websites.map(site => (
                  <option key={site.id} value={site.id}>{site.content?.settings_json?.website_name || site.slug}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="bg-white/60 border border-slate-200 border-dashed rounded-3xl p-10 text-center shadow-sm">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-900 mb-2">No customers yet</h3>
              <p className="text-slate-500">When someone submits a contact form on your website, they will appear here. You can also add walk-in or phone enquiries with “Add lead”.</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No leads match these filters.</div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-black">
                      <th className="p-4 pl-6">Name</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Website</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Follow-up</th>
                      <th className="p-4">Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((customer) => {
                      const due = followUpState(customer);
                      const status = LEAD_STATUSES.find((s) => s.value === customer.status);
                      return (
                        <tr key={customer.id} onClick={() => setSelectedId(customer.id)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-700 font-black shrink-0">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900">{customer.name}</div>
                                <div className="text-[11px] text-slate-400">
                                  {LEAD_SOURCES.find((s) => s.value === customer.source)?.label}
                                  {customer.value ? ` · ${inr(customer.value).replace(/\.00$/, '')}` : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col text-sm text-slate-500">
                              {customer.email && <div className="flex items-center gap-1"><Mail size={12}/> {customer.email}</div>}
                              {customer.phone && <div className="flex items-center gap-1 mt-1"><Phone size={12}/> {customer.phone}</div>}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200 whitespace-nowrap">
                              {getWebsiteName(customer.website)}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={customer.status}
                              onChange={(e) => updateCustomerStatus(customer.id, e.target.value)}
                              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border outline-none ${status?.style || ''}`}
                              aria-label="Status"
                            >
                              {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          </td>
                          <td className={`p-4 text-sm whitespace-nowrap ${due ? FOLLOW_UP_STYLE[due] : 'text-slate-300'}`}>
                            {customer.follow_up_at && due
                              ? `${due === 'overdue' ? 'Overdue · ' : due === 'today' ? 'Today · ' : ''}${new Date(customer.follow_up_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                              : '—'}
                          </td>
                          <td className="p-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                            {new Date(customer.created_at).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {selected && (
        <LeadDrawer key={selected.id} lead={selected} siteName={getWebsiteName(selected.website)} onClose={() => setSelectedId(null)} onChange={replace} />
      )}

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setAdding(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Add lead</h2>
              <button onClick={() => setAdding(false)} className="p-1 text-slate-400 hover:text-slate-700" aria-label="Close"><X size={20} /></button>
            </div>
            {[
              ['name', 'Name', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email'], ['value', 'Expected value (₹)', 'number'],
            ].map(([key, text, type]) => (
              <label key={key} className="block">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">{text}</span>
                <input type={type} value={newLead[key as keyof typeof newLead]} onChange={(e) => setNewLead({ ...newLead, [key]: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Source</span>
                <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm">
                  {LEAD_SOURCES.filter((s) => s.value !== 'WEBSITE').map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Website</span>
                <select value={newLead.website} onChange={(e) => setNewLead({ ...newLead, website: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm">
                  {websites.map((site) => <option key={site.id} value={site.id}>{site.content?.settings_json?.website_name || site.slug}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Notes</span>
              <textarea value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
            </label>
            <button onClick={addLead} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700">Add lead</button>
          </div>
        </div>
      )}
    </div>
  );
}
