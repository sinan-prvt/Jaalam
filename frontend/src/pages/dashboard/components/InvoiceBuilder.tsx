import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, ChevronLeft, Image as ImageIcon, Copy, ExternalLink, MessageCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import InvoiceDocument, { type InvoiceView } from '../../../components/billing/InvoiceDocument';
import { apiError } from '../../../utils/apiError';
import { GST_RATES, GST_STATES, computeTotals, gstinError, invoiceLink, whatsappInvoiceLink, type DraftItem } from '../../../utils/gst';

interface BusinessProfile {
  legal_name: string;
  gstin: string;
  address: string;
  state_code: string;
  phone: string;
  email: string;
  upi_id: string;
  logo_url: string;
  invoice_prefix: string;
  terms: string;
}

interface InvoiceBuilderProps {
  onBack: () => void;
  websiteId: number | string;
  initialBusinessName?: string;
  onSuccess: () => void;
}

const EMPTY_PROFILE: BusinessProfile = {
  legal_name: '', gstin: '', address: '', state_code: '', phone: '', email: '',
  upi_id: '', logo_url: '', invoice_prefix: 'INV', terms: '',
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const STATE_OPTIONS = Object.entries(GST_STATES).sort((a, b) => a[1].localeCompare(b[1]));

const input = 'w-full border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500/20 outline-none';
const label = 'block text-xs font-bold text-slate-500 uppercase mb-2';

export default function InvoiceBuilder({ onBack, websiteId, initialBusinessName, onSuccess }: InvoiceBuilderProps) {
  const [profile, setProfile] = useState<BusinessProfile>(EMPTY_PROFILE);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', gstin: '', address: '' });
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<DraftItem[]>([{ description: '', hsn_sac: '', quantity: 1, price: 0, gst_rate: null }]);
  const [gstRate, setGstRate] = useState(18);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState<(InvoiceView & { public_token: string }) | null>(null);

  useEffect(() => {
    axios.get('/api/billing/invoices/profile/', { withCredentials: true })
      .then((res) => {
        const p = { ...EMPTY_PROFILE, ...res.data };
        if (!p.legal_name) p.legal_name = initialBusinessName || '';
        setProfile(p);
        if (p.terms) setNotes(p.terms);
      })
      .catch(() => setProfile((p) => ({ ...p, legal_name: initialBusinessName || '' })));
  }, [initialBusinessName]);

  const setP = (field: keyof BusinessProfile, value: string) => setProfile((p) => ({ ...p, [field]: value }));

  const sellerGstinError = gstinError(profile.gstin);
  const customerGstinError = gstinError(customer.gstin);
  // Without an explicit choice, the customer's GSTIN tells their state, else it's a local sale.
  const supplyState = placeOfSupply || (!customerGstinError && customer.gstin ? customer.gstin.slice(0, 2).toUpperCase() : '') || profile.state_code;
  const totals = computeTotals(items, gstRate, profile.state_code, supplyState);

  const updateItem = (index: number, field: keyof DraftItem, value: string) => {
    setItems((list) => list.map((item, i) => {
      if (i !== index) return item;
      if (field === 'description' || field === 'hsn_sac') return { ...item, [field]: value };
      if (field === 'gst_rate') return { ...item, gst_rate: value === '' ? null : Number(value) };
      return { ...item, [field]: value === '' ? 0 : Number(value) };
    }));
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await axios.post('/api/websites/upload/', form, { withCredentials: true });
      setP('logo_url', res.data.url);
    } catch (err) {
      toast.error(apiError(err, 'Could not upload the logo'));
    } finally {
      setUploading(false);
    }
  };

  const preview: InvoiceView = useMemo(() => ({
    invoice_number: saved?.invoice_number || `${profile.invoice_prefix || 'INV'}/…`,
    issue_date: issueDate,
    due_date: dueDate || null,
    seller_name: profile.legal_name,
    seller_gstin: sellerGstinError ? '' : profile.gstin.toUpperCase(),
    seller_address: profile.address,
    seller_state_name: GST_STATES[profile.state_code],
    seller_phone: profile.phone,
    seller_email: profile.email,
    seller_logo: profile.logo_url,
    seller_upi: profile.upi_id,
    customer_name: customer.name,
    customer_gstin: customerGstinError ? '' : customer.gstin.toUpperCase(),
    customer_address: customer.address,
    customer_phone: customer.phone,
    customer_email: customer.email,
    place_of_supply_name: GST_STATES[supplyState],
    items: items.map((item) => ({ ...item, total: (item.quantity || 0) * (item.price || 0) })),
    gst_percentage: gstRate,
    subtotal: totals.subtotal,
    gst_amount: totals.tax,
    tax_type: totals.taxType,
    cgst_amount: totals.cgst,
    sgst_amount: totals.sgst,
    igst_amount: totals.igst,
    total_amount: totals.total,
    notes,
  }), [saved, profile, issueDate, dueDate, sellerGstinError, customer, customerGstinError, supplyState, items, gstRate, totals, notes]);

  const handleSave = async () => {
    if (!profile.legal_name.trim()) return toast.error('Add your business name');
    if (!customer.name.trim()) return toast.error('Add the customer name');
    if (items.length === 0 || items.some((item) => !item.description.trim())) return toast.error('Every item needs a description');
    if (sellerGstinError) return toast.error(`Your GSTIN: ${sellerGstinError}`);
    if (customerGstinError) return toast.error(`Customer GSTIN: ${customerGstinError}`);
    if (profile.gstin && !profile.state_code) return toast.error('Choose your state');
    if (dueDate && dueDate < issueDate) return toast.error('The due date is before the invoice date');

    setLoading(true);
    try {
      // Business details are saved once and reused (and snapshotted) on every invoice.
      await axios.patch('/api/billing/invoices/profile/', { ...profile, gstin: profile.gstin.toUpperCase() }, { withCredentials: true });
      const res = await axios.post('/api/billing/invoices/', {
        website: websiteId,
        customer_name: customer.name,
        customer_email: customer.email || null,
        customer_phone: customer.phone,
        customer_gstin: customer.gstin.toUpperCase(),
        customer_address: customer.address,
        place_of_supply: supplyState,
        issue_date: issueDate,
        due_date: dueDate || null,
        notes,
        status: 'UNPAID',
        gst_percentage: gstRate,
        items: items.map(({ description, hsn_sac, quantity, price, gst_rate }) => ({ description, hsn_sac, quantity, price, gst_rate })),
      }, { withCredentials: true });
      setSaved(res.data);
      toast.success(`Invoice ${res.data.invoice_number} created`);
    } catch (err) {
      console.error(err);
      toast.error(apiError(err, 'Failed to create invoice'));
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!saved) return;
    try {
      await navigator.clipboard.writeText(invoiceLink(saved.public_token));
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button onClick={saved ? onSuccess : onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" aria-label="Back">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900">{saved ? saved.invoice_number : 'New Invoice'}</h2>
        </div>
        {!saved && (
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Save size={16} /> {loading ? 'Saving…' : 'Save Invoice'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col xl:flex-row gap-6">
        {saved ? (
          <div className="xl:w-[380px] shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 size={28} />
                <div>
                  <p className="font-black text-slate-900">Invoice saved</p>
                  <p className="text-sm text-slate-500">Send the link so your customer can view, download and pay it.</p>
                </div>
              </div>
              <a href={whatsappInvoiceLink(saved)} target="_blank" rel="noreferrer" className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700">
                <MessageCircle size={18} /> Send on WhatsApp
              </a>
              <button onClick={copyLink} className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200">
                <Copy size={18} /> Copy link
              </button>
              <a href={`${invoiceLink(saved.public_token)}?print=1`} target="_blank" rel="noreferrer" className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200">
                <ExternalLink size={18} /> Open / Save as PDF
              </a>
              <button onClick={onSuccess} className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-700">
                Back to invoices
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900">Your business details</h3>
              <p className="text-xs text-slate-500 mb-4">Saved for your next invoices too.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center gap-4">
                  {profile.logo_url ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                      <img src={profile.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                      <button onClick={() => setP('logo_url', '')} className="absolute top-0.5 right-0.5 bg-rose-500 text-white p-1 rounded-full shadow-sm" aria-label="Remove logo">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploading}
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadLogo(file); e.target.value = ''; }}
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">{uploading ? 'Uploading…' : 'Logo (optional), PNG or JPG'}</p>
                  </div>
                </div>
                <div>
                  <label className={label}>Business name</label>
                  <input value={profile.legal_name} onChange={(e) => setP('legal_name', e.target.value)} className={input} placeholder="Your registered business name" />
                </div>
                <div>
                  <label className={label}>GSTIN (if registered)</label>
                  <input
                    value={profile.gstin}
                    onChange={(e) => {
                      const v = e.target.value.toUpperCase().replace(/\s/g, '');
                      setProfile((p) => ({ ...p, gstin: v, state_code: v.length >= 2 && GST_STATES[v.slice(0, 2)] ? v.slice(0, 2) : p.state_code }));
                    }}
                    maxLength={15}
                    className={`${input} font-mono ${sellerGstinError ? 'border-rose-300' : ''}`}
                    placeholder="27AAPFU0939F1ZV"
                  />
                  {sellerGstinError && profile.gstin.length >= 15 && <p className="text-xs text-rose-600 mt-1">{sellerGstinError}</p>}
                </div>
                <div>
                  <label className={label}>State</label>
                  <select value={profile.state_code} onChange={(e) => setP('state_code', e.target.value)} className={input}>
                    <option value="">Select state</option>
                    {STATE_OPTIONS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label}>UPI ID (for “Pay now”)</label>
                  <input value={profile.upi_id} onChange={(e) => setP('upi_id', e.target.value.trim())} className={input} placeholder="shop@okicici" />
                </div>
                <div>
                  <label className={label}>Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setP('phone', e.target.value)} className={input} />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setP('email', e.target.value)} className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className={label}>Address</label>
                  <textarea value={profile.address} onChange={(e) => setP('address', e.target.value)} rows={2} className={input} />
                </div>
                <div>
                  <label className={label}>Invoice number prefix</label>
                  <input value={profile.invoice_prefix} onChange={(e) => setP('invoice_prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 10))} className={`${input} font-mono`} placeholder="INV" />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Customer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Customer name</label>
                  <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className={input} placeholder="John Doe" />
                </div>
                <div>
                  <label className={label}>Phone (for WhatsApp)</label>
                  <input type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className={input} placeholder="9876543210" />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className={input} placeholder="john@example.com" />
                </div>
                <div>
                  <label className={label}>Customer GSTIN (B2B)</label>
                  <input
                    value={customer.gstin}
                    onChange={(e) => setCustomer({ ...customer, gstin: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    maxLength={15}
                    className={`${input} font-mono ${customerGstinError ? 'border-rose-300' : ''}`}
                    placeholder="Optional"
                  />
                  {customerGstinError && customer.gstin.length >= 15 && <p className="text-xs text-rose-600 mt-1">{customerGstinError}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={label}>Billing address</label>
                  <textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} rows={2} className={input} />
                </div>
                <div>
                  <label className={label}>Place of supply</label>
                  <select value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} className={input}>
                    <option value="">{supplyState ? `Auto: ${GST_STATES[supplyState]}` : 'Same as my state'}</option>
                    {STATE_OPTIONS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                  </select>
                  {totals.taxType && (
                    <p className="text-xs text-slate-500 mt-1">{totals.taxType === 'INTRA' ? 'Same state: CGST + SGST' : 'Other state: IGST'}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={label}>Invoice date</label>
                    <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value || today())} className={input} />
                  </div>
                  <div>
                    <label className={label}>Due date</label>
                    <input type="date" value={dueDate} min={issueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-slate-900">Items</h3>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    Default GST
                    <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="border border-slate-200 rounded-lg px-2 py-1 text-sm">
                      {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </label>
                  <button onClick={() => setItems([...items, { description: '', hsn_sac: '', quantity: 1, price: 0, gst_rate: null }])} className="text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-orange-100">
                    <Plus size={14} /> Add item
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 md:grid-cols-[1fr_90px_70px_110px_80px_auto] gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <input value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Item description" className="col-span-2 md:col-span-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <input value={item.hsn_sac} onChange={(e) => updateItem(index, 'hsn_sac', e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="HSN/SAC" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono outline-none" />
                    <input type="number" min="1" value={item.quantity || ''} onChange={(e) => updateItem(index, 'quantity', e.target.value)} placeholder="Qty" aria-label="Quantity" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <input type="number" min="0" step="0.01" value={item.price || ''} onChange={(e) => updateItem(index, 'price', e.target.value)} placeholder="Rate (₹)" aria-label="Rate" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <select value={item.gst_rate ?? ''} onChange={(e) => updateItem(index, 'gst_rate', e.target.value)} aria-label="GST rate" className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm">
                      <option value="">{gstRate}%</option>
                      {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                    <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg justify-self-end" aria-label="Remove item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {items.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">No items added yet.</div>}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className={label}>Notes &amp; terms</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={input} placeholder="e.g. Payment within 7 days. Thank you!" />
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={!!notes && notes === profile.terms} onChange={(e) => setP('terms', e.target.checked ? notes : '')} />
                Use these notes on every invoice
              </label>
            </section>
          </div>
        )}

        <div className="w-full xl:w-[560px] shrink-0">
          <div className="bg-slate-200 p-3 sm:p-4 rounded-3xl">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-3">Preview</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <InvoiceDocument invoice={saved || preview} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
