import { useState, useEffect } from 'react';
import axios from 'axios';
import { Receipt, Plus, FileText, CheckCircle2, Clock, Search, Download, Trash2, MessageCircle, Link2, Mail, IndianRupee, X } from 'lucide-react';
import InvoiceBuilder from './components/InvoiceBuilder';
import toast from 'react-hot-toast';
import usePlan from '../../hooks/usePlan';
import UpgradeNotice from '../../components/ui/UpgradeNotice';
import { apiError } from '../../utils/apiError';
import { inr, invoiceLink, whatsappInvoiceLink } from '../../utils/gst';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: string;
  total: string;
}

interface Invoice {
  id: number;
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

const STATUS_STYLE: Record<string, string> = {
  PAID: 'bg-emerald-100 text-emerald-700',
  UNPAID: 'bg-amber-100 text-amber-700',
  PARTIALLY_PAID: 'bg-sky-100 text-sky-700',
  OVERDUE: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
  DRAFT: 'bg-slate-100 text-slate-700',
};
const STATUS_LABEL: Record<string, string> = { PARTIALLY_PAID: 'PART PAID' };

export default function BillingPage() {
  const { can, requiredPlan } = usePlan();
  const canInvoice = can('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [activeWebsite, setActiveWebsite] = useState<any>(null);
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const fetchInvoices = async () => {
    try {
      // Fetch both invoices and websites
      const [invRes, siteRes] = await Promise.all([
        axios.get('/api/billing/invoices/', { withCredentials: true }),
        axios.get('/api/websites/', { withCredentials: true })
      ]);
      setInvoices(invRes.data);
      if (siteRes.data && siteRes.data.length > 0) {
        setActiveWebsite(siteRes.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`/api/billing/invoices/${id}/`, { status: newStatus }, { withCredentials: true });
      fetchInvoices();
      toast.success('Status updated');
    } catch (err) {
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
              } catch (err) {
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

  if (isCreating) {
    return (
      <div className="h-full w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <InvoiceBuilder 
          websiteId={activeWebsite?.id || 1} 
          initialBusinessName={activeWebsite?.content?.settings_json?.website_name || activeWebsite?.slug || 'My Business'} 
          onBack={() => setIsCreating(false)} 
          onSuccess={() => {
            fetchInvoices();
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  const query = search.toLowerCase();
  const filteredInvoices = invoices.filter(inv => inv.customer_name.toLowerCase().includes(query) || (inv.invoice_number || '').toLowerCase().includes(query));
  const live = invoices.filter(i => i.status !== 'CANCELLED' && i.status !== 'DRAFT');
  const totalRevenue = live.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0);
  const pendingAmount = live.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0);
  const overdueCount = invoices.filter(i => i.display_status === 'OVERDUE').length;

  return (
    <div className="h-full flex-1 flex flex-col animate-in fade-in zoom-in-[0.98] duration-500 overflow-hidden">
      {!canInvoice && (
        <UpgradeNotice
          className="mb-4 shrink-0"
          title="Creating invoices needs a paid plan"
          message={`Upgrade to ${requiredPlan('invoices')} or higher to create and send invoices. Existing invoices stay available to view and download.`}
        />
      )}

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">Total Invoices</p>
            <h3 className="text-3xl font-black text-slate-900">{invoices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt size={24} />
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1">Received</p>
            <h3 className="text-3xl font-black text-emerald-900">{inr(totalRevenue)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex items-center justify-between shadow-sm">
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

      {/* INVOICE LIST */}
      <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/50 bg-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" />
            Billing & Invoices
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
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
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Create Invoice</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 h-full">
              <Receipt size={48} className="mb-4 opacity-20" />
              <p className="font-bold text-slate-500">No invoices found</p>
              <p className="text-sm mt-1">Create your first invoice to get started.</p>
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
                  <tr key={inv.id} className="border-b border-slate-100/50 hover:bg-white/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 group-hover:text-indigo-600 transition-colors whitespace-nowrap">{inv.invoice_number || `#${inv.id}`}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(inv.issue_date ? `${inv.issue_date}T00:00:00` : inv.created_at).toLocaleDateString('en-IN')}
                      {inv.due_date && <span className="block text-[11px] text-slate-400">Due {new Date(`${inv.due_date}T00:00:00`).toLocaleDateString('en-IN')}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={inv.status}
                        onClick={(e) => e.stopPropagation()}
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
                        <a
                          href={whatsappInvoiceLink(inv)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Send on WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <button onClick={(e) => { e.stopPropagation(); copyLink(inv); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy customer link">
                          <Link2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); emailInvoice(inv); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Email to customer">
                          <Mail size={16} />
                        </button>
                        {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                          <button onClick={(e) => { e.stopPropagation(); setPaying(inv); setPayAmount(inv.balance_due); }} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Record payment">
                            <IndianRupee size={16} />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); openPdf(inv); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print / Save as PDF">
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteInvoice(inv.id); }} 
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                          title="Delete Invoice"
                        >
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
      </div>

      {paying && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setPaying(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-black text-slate-900">Record payment</h3>
                <p className="text-sm text-slate-500">{paying.invoice_number} · {paying.customer_name} · due {inr(paying.balance_due)}</p>
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
