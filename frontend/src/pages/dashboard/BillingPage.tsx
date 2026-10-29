import { useState, useEffect } from 'react';
import axios from 'axios';
import { Receipt, Plus, FileText, CheckCircle2, Clock, Search, Download, Trash2, MessageCircle, Link2, Mail, IndianRupee, X, Package, CalendarDays, Store, Pencil, Loader2, Globe } from 'lucide-react';
import InvoiceBuilder from './components/InvoiceBuilder';
import BusinessDetailsForm from '../../components/billing/BusinessDetailsForm';
import ProductsPanel from '../../components/billing/ProductsPanel';
import toast from 'react-hot-toast';
import usePlan from '../../hooks/usePlan';
import UpgradeNotice from '../../components/ui/UpgradeNotice';
import { apiError } from '../../utils/apiError';
import { inr, invoiceLink, whatsappInvoiceLink } from '../../utils/gst';
import { invitationCategories, otherEventCategories } from '../../utils/templateData';
import {
  EMPTY_PROFILE, businessProblem, customerLabel, monthKey, profileUrl, reportLink,
  type BusinessProfile, type MonthlyReport,
} from '../../utils/billing';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: string;
  total: string;
}

interface Invoice {
  id: number;
  website: number;
  invoice_number: string;
  public_token: string;
  seller_name: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  subtotal: string;
  gst_percentage: string;
  gst_amount: string;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  status: string;
  display_status: string;
  issue_date?: string | null;
  due_date?: string | null;
  created_at: string;
  items?: InvoiceItem[];
}

interface Site {
  id: number;
  slug: string;
  business_type: string;
  content?: { settings_json?: { website_name?: string } };
}

const STATUS_STYLE: Record<string, string> = {
  PAID: 'bg-emerald-100 text-emerald-700',
  UNPAID: 'bg-amber-100 text-amber-700',
  PARTIALLY_PAID: 'bg-sky-100 text-sky-700',
  OVERDUE: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
  DRAFT: 'bg-slate-100 text-slate-700',
};
const STATUS_LABEL: Record<string, string> = { PARTIALLY_PAID: 'PART PAID' };
const siteName = (s: Site) => s.content?.settings_json?.website_name || s.slug;
type Tab = 'invoices' | 'products' | 'report';

export default function BillingPage() {
  const { can, requiredPlan } = usePlan();
  const canInvoice = can('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [siteId, setSiteId] = useState<number | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [savedProfile, setSavedProfile] = useState<BusinessProfile | null>(null); // to undo unsaved edits
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [tab, setTab] = useState<Tab>('invoices');
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [month, setMonth] = useState(monthKey());
  const [report, setReport] = useState<MonthlyReport | null>(null);

  const fetchInvoices = () => axios.get('/api/billing/invoices/', { withCredentials: true })
    .then((res) => setInvoices(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));

  useEffect(() => {
    let alive = true;
    axios.get('/api/billing/invoices/', { withCredentials: true })
      .then((res) => { if (alive) setInvoices(res.data); })
      .catch((err) => console.error(err))
      .finally(() => { if (alive) setLoading(false); });
    axios.get('/api/websites/', { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        const all: Site[] = res.data;
        // Shops first; invitations only if that's all there is
        const shops = all.filter((s) => !invitationCategories.includes(s.business_type) && !otherEventCategories.includes(s.business_type));
        setSites(shops.length ? shops : all);
      })
      .catch(() => { if (alive) setSites([]); });
    return () => { alive = false; };
  }, []);

  const site = sites?.find((s) => s.id === siteId) || sites?.[0] || null;

  // The shop's business details: needed before the first invoice
  useEffect(() => {
    if (!site) return;
    let alive = true;
    axios.get(profileUrl(site.id), { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        const p = { ...EMPTY_PROFILE, ...res.data, legal_name: res.data.legal_name || '' };
        setSavedProfile(p);
        // A head start for the setup form: the shop's name (not saved until they press Save)
        setProfile(p.legal_name ? p : { ...p, legal_name: siteName(site) });
      })
      .catch(() => { if (alive) setProfile({ ...EMPTY_PROFILE }); });
    return () => { alive = false; };
  }, [site]);

  useEffect(() => {
    if (tab !== 'report' || !site) return;
    let alive = true;
    axios.get(`/api/billing/invoices/report/?month=${month}&website=${site.id}`, { withCredentials: true })
      .then((res) => { if (alive) setReport(res.data); })
      .catch((err) => { if (alive) toast.error(apiError(err, 'Could not load the report')); });
    return () => { alive = false; };
  }, [tab, month, site]);

  const saveBusiness = async () => {
    if (!profile || !site) return;
    const problem = businessProblem(profile);
    if (problem) return toast.error(problem);
    setSavingBusiness(true);
    try {
      const res = await axios.patch(profileUrl(site.id), { ...profile, gstin: profile.gstin.toUpperCase() }, { withCredentials: true });
      setProfile({ ...EMPTY_PROFILE, ...res.data });
      setSavedProfile({ ...EMPTY_PROFILE, ...res.data });
      setEditingBusiness(false);
      toast.success('Business details saved');
    } catch (err) {
      toast.error(apiError(err, 'Could not save your business details'));
    } finally {
      setSavingBusiness(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`/api/billing/invoices/${id}/`, { status: newStatus }, { withCredentials: true });
      fetchInvoices();
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteInvoice = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-bold">Delete invoice {invoices.find((i) => i.id === id)?.invoice_number || `#${id}`}?</p>
          <p className="text-sm opacity-80 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="cursor-pointer px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/billing/invoices/${id}/`, { withCredentials: true });
                fetchInvoices();
                toast.success('Invoice deleted successfully');
              } catch {
                toast.error('Failed to delete invoice');
              }
            }}
            className="cursor-pointer px-3 py-1.5 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  // The customer's invoice page doubles as the printable / "Save as PDF" version.
  const openPdf = (inv: Invoice) => window.open(`${invoiceLink(inv.public_token)}?print=1`, '_blank', 'noopener');

  const copyLink = async (inv: Invoice) => {
    try {
      await navigator.clipboard.writeText(invoiceLink(inv.public_token));
      toast.success('Invoice link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  const emailInvoice = async (inv: Invoice) => {
    if (!inv.customer_email) return toast.error('This invoice has no customer email');
    const id = toast.loading('Sending…');
    try {
      await axios.post(`/api/billing/invoices/${inv.id}/send_email/`, {}, { withCredentials: true });
      toast.success(`Sent to ${inv.customer_email}`, { id });
    } catch (err) {
      toast.error(apiError(err, 'Could not send the email'), { id });
    }
  };

  const recordPayment = async () => {
    if (!paying) return;
    try {
      await axios.post(`/api/billing/invoices/${paying.id}/record_payment/`, { amount: payAmount }, { withCredentials: true });
      toast.success('Payment recorded');
      setPaying(null);
      fetchInvoices();
    } catch (err) {
      toast.error(apiError(err, 'Could not record the payment'));
    }
  };

  // --- Before anything: a website, and the shop's business details ----------------------

  if (sites === null || (site && profile === null)) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={28} /></div>;
  }
  if (!site || !profile) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <Globe className="mx-auto text-orange-500" size={36} />
        <h2 className="mt-3 text-xl font-black text-slate-900">Create a website first</h2>
        <p className="mt-1 text-slate-500">Invoices are made for one of your websites (your shop).</p>
      </div>
    );
  }

  const sitePicker = sites.length > 1 && (
    <select value={site.id} onChange={(e) => { setSiteId(Number(e.target.value)); setProfile(null); setReport(null); setIsCreating(false); setEditingBusiness(false); }}
      aria-label="Shop" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold">
      {sites.map((s) => <option key={s.id} value={s.id}>{siteName(s)}</option>)}
    </select>
  );

  const firstTime = !savedProfile?.legal_name.trim();
  if (firstTime || editingBusiness) {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-5 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            {firstTime && <p className="text-xs font-black uppercase tracking-widest text-orange-600">Step 1 of 1 · before your first invoice</p>}
            <h2 className="text-2xl font-black text-slate-900">{firstTime ? 'Set up your business' : 'Business details'}</h2>
            <p className="text-slate-500">
              {firstTime
                ? `These details are printed on every invoice of ${siteName(site)}. You enter them once.`
                : 'Changes apply to new invoices. Invoices already made keep the old details.'}
            </p>
          </div>
          {sitePicker}
        </div>
        <section className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <BusinessDetailsForm value={profile} onChange={setProfile} />
        </section>
        <div className="flex flex-wrap gap-3">
          <button onClick={saveBusiness} disabled={savingBusiness}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-black text-white shadow-lg shadow-orange-600/20 disabled:opacity-60">
            {savingBusiness && <Loader2 size={18} className="animate-spin" />} {firstTime ? 'Save and continue' : 'Save details'}
          </button>
          {!firstTime && (
            <button onClick={() => { setEditingBusiness(false); if (savedProfile) setProfile(savedProfile); }} className="rounded-xl px-6 py-3 font-bold text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="h-full w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <InvoiceBuilder
          websiteId={site.id}
          profile={profile}
          onBack={() => setIsCreating(false)}
          onEditBusiness={() => { setIsCreating(false); setEditingBusiness(true); }}
          onManageProducts={() => { setIsCreating(false); setTab('products'); }}
          onThemeUsed={(invoice_theme) => setProfile({ ...profile, invoice_theme })}
          onSuccess={() => {
            fetchInvoices();
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  const siteInvoices = invoices.filter((inv) => inv.website === site.id);
  const query = search.toLowerCase();
  const filteredInvoices = siteInvoices.filter(inv => inv.customer_name.toLowerCase().includes(query) || (inv.invoice_number || '').toLowerCase().includes(query));
  const live = siteInvoices.filter(i => i.status !== 'CANCELLED' && i.status !== 'DRAFT');
  const totalRevenue = live.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0);
  const pendingAmount = live.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0);
  const overdueCount = siteInvoices.filter(i => i.display_status === 'OVERDUE').length;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'invoices', label: 'Invoices', icon: <FileText size={16} /> },
    { id: 'products', label: 'Products', icon: <Package size={16} /> },
    { id: 'report', label: 'Monthly report', icon: <CalendarDays size={16} /> },
  ];

  return (
    <div className="h-full flex-1 flex flex-col animate-in fade-in zoom-in-[0.98] duration-500 overflow-hidden">
      {!canInvoice && (
        <UpgradeNotice
          className="mb-4 shrink-0"
          title="Creating invoices needs a paid plan"
          message={`Upgrade to ${requiredPlan('invoices')} or higher to create and send invoices. Existing invoices stay available to view and download.`}
        />
      )}

      {/* Shop + business */}
      <div className="mb-4 flex flex-wrap items-center gap-3 shrink-0">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Store size={18} /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-black text-slate-900">{profile.legal_name}</p>
            <p className="truncate text-xs text-slate-500">{profile.gstin || 'No GSTIN'}{profile.upi_id && ` · UPI ${profile.upi_id}`}</p>
          </div>
          <button onClick={() => setEditingBusiness(true)} className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold text-orange-600 hover:bg-orange-50">
            <Pencil size={14} /> <span className="hidden sm:inline">Business details</span>
          </button>
        </div>
        {sitePicker}
      </div>

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 shrink-0">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">Total Invoices</p>
            <h3 className="text-3xl font-black text-slate-900">{siteInvoices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt size={24} />
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1">Received</p>
            <h3 className="text-3xl font-black text-emerald-900">{inr(totalRevenue)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-1">Pending Amount</p>
            <h3 className="text-3xl font-black text-amber-900">{inr(pendingAmount)}</h3>
            {overdueCount > 0 && <p className="text-xs font-bold text-rose-600 mt-1">{overdueCount} overdue</p>}
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[420px]">
        <div className="p-4 sm:p-5 border-b border-white/50 bg-white/40 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          <div className="flex max-w-full gap-1 self-start overflow-x-auto rounded-xl bg-slate-100 p-1" role="tablist">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          {tab === 'invoices' && (
            <div className="flex items-center gap-3 w-full xl:w-auto">
              <div className="relative flex-1 min-w-0 xl:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search customer or number..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                onClick={() => setIsCreating(true)}
                disabled={!canInvoice}
                title={canInvoice ? undefined : `Invoices need the ${requiredPlan('invoices')} plan`}
                className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors shadow-sm shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={18} /> <span className="hidden sm:inline">New Invoice</span>
              </button>
            </div>
          )}
          {tab === 'report' && (
            <div className="flex items-center gap-2">
              <input type="month" value={month} max={monthKey()} onChange={(e) => { if (e.target.value) { setMonth(e.target.value); setReport(null); } }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold" aria-label="Month" />
              <a href={reportLink(month, site.id)} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700">
                <Download size={16} /> Download PDF
              </a>
            </div>
          )}
        </div>

        {tab === 'products' && <ProductsPanel websiteId={site.id} defaultGst={18} />}

        {tab === 'report' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {!report ? (
              <p className="py-10 text-center text-sm text-slate-400">Loading {month}…</p>
            ) : (
              <div className="space-y-5">
                <h3 className="text-lg font-black text-slate-900">{report.label}</h3>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    { label: 'Total billed', value: inr(report.totals.total), note: `${report.totals.count} invoice${report.totals.count === 1 ? '' : 's'}` },
                    { label: 'Received', value: inr(report.totals.received), note: 'payments recorded' },
                    { label: 'Still due', value: inr(report.totals.due), note: 'to collect' },
                    { label: 'GST', value: inr(report.totals.gst), note: `on ${inr(report.totals.taxable)} taxable` },
                  ].map((t) => (
                    <div key={t.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.label}</p>
                      <p className="mt-1 text-2xl font-black text-slate-900">{t.value}</p>
                      <p className="text-xs text-slate-400">{t.note}</p>
                    </div>
                  ))}
                </div>
                {report.invoices.length === 0 ? (
                  <p className="rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">No invoices in {report.label}.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="mb-2 text-sm font-black text-slate-900">Day by day</p>
                      <ul className="divide-y divide-slate-100 text-sm">
                        {report.by_day.map((d) => (
                          <li key={d.date} className="flex justify-between py-2">
                            <span className="text-slate-600">{new Date(`${d.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })} · {d.count}</span>
                            <span className="font-bold text-slate-900">{inr(d.total)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="mb-2 text-sm font-black text-slate-900">Top items</p>
                      <ul className="divide-y divide-slate-100 text-sm">
                        {report.top_items.map((it) => (
                          <li key={it.description} className="flex justify-between gap-3 py-2">
                            <span className="truncate text-slate-600">{it.description} × {it.quantity}</span>
                            <span className="shrink-0 font-bold text-slate-900">{inr(it.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-400">Totals leave out drafts and cancelled invoices ({report.totals.cancelled} cancelled). "Download PDF" opens the full report with every invoice: choose "Save as PDF".</p>
              </div>
            )}
          </div>
        )}

        {tab === 'invoices' && (
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 h-full">
                <Receipt size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-500">No invoices yet</p>
                <p className="text-sm mt-1">Tap "New Invoice", then tap your products to bill.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/60 bg-white/40">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Number</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100/50 hover:bg-white/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 group-hover:text-indigo-600 transition-colors whitespace-nowrap">{inv.invoice_number || `#${inv.id}`}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{customerLabel(inv.customer_name)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(inv.issue_date ? `${inv.issue_date}T00:00:00` : inv.created_at).toLocaleDateString('en-IN')}
                        {inv.due_date && <span className="block text-[11px] text-slate-400">Due {new Date(`${inv.due_date}T00:00:00`).toLocaleDateString('en-IN')}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                          title="Change status"
                          className={`outline-none appearance-none cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[inv.display_status] || STATUS_STYLE.DRAFT}`}
                        >
                          <option value="UNPAID">{inv.status === 'UNPAID' ? STATUS_LABEL[inv.display_status] || inv.display_status : 'UNPAID'}</option>
                          <option value="PAID">PAID</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="DRAFT">DRAFT</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-black text-slate-900">{inr(inv.total_amount)}</span>
                        {Number(inv.amount_paid) > 0 && inv.status !== 'PAID' && (
                          <span className="block text-[11px] text-slate-500">Due {inr(inv.balance_due)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <a href={whatsappInvoiceLink(inv)} target="_blank" rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Send on WhatsApp">
                            <MessageCircle size={16} />
                          </a>
                          <button onClick={() => copyLink(inv)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy customer link">
                            <Link2 size={16} />
                          </button>
                          <button onClick={() => emailInvoice(inv)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Email to customer">
                            <Mail size={16} />
                          </button>
                          {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                            <button onClick={() => { setPaying(inv); setPayAmount(inv.balance_due); }} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Record payment">
                              <IndianRupee size={16} />
                            </button>
                          )}
                          <button onClick={() => openPdf(inv)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print / Save as PDF">
                            <Download size={16} />
                          </button>
                          <button onClick={() => deleteInvoice(inv.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Invoice">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {paying && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setPaying(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-black text-slate-900">Record payment</h3>
                <p className="text-sm text-slate-500">{paying.invoice_number} · {customerLabel(paying.customer_name)} · due {inr(paying.balance_due)}</p>
              </div>
              <button onClick={() => setPaying(null)} className="p-1 text-slate-400 hover:text-slate-600" aria-label="Close"><X size={18} /></button>
            </div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount received (₹)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') recordPayment(); }}
              autoFocus
              className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setPaying(null)} className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={recordPayment} className="px-4 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700">Save payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
