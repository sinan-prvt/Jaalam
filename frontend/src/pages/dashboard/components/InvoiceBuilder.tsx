import { useEffect, useMemo, useState } from 'react';
import { Plus, Minus, Trash2, Save, ChevronLeft, Copy, ExternalLink, MessageCircle, CheckCircle2, Search, Package, Pencil, Store } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import InvoiceDocument, { type InvoiceView } from '../../../components/billing/InvoiceDocument';
import { apiError } from '../../../utils/apiError';
import { GST_RATES, GST_STATES, computeTotals, gstinError, inr, invoiceLink, whatsappInvoiceLink, type DraftItem } from '../../../utils/gst';
import { productsUrl, profileUrl, type BusinessProfile, type Product } from '../../../utils/billing';

type Line = DraftItem & { product_id?: number };

interface InvoiceBuilderProps {
  websiteId: number;
  profile: BusinessProfile;
  onBack: () => void;
  onSuccess: () => void;
  onEditBusiness: () => void;
  onManageProducts: () => void;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const STATE_OPTIONS = Object.entries(GST_STATES).sort((a, b) => a[1].localeCompare(b[1]));

const input = 'w-full border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500/20 outline-none';
const label = 'block text-xs font-bold text-slate-500 uppercase mb-2';

/**
 * New invoice, POS-style: tap saved products to add them (tap again for one more), adjust
 * quantities with +/−, or add a custom line. Seller details come from the shop's saved
 * business details (set up once on the Invoices page).
 */
export default function InvoiceBuilder({ websiteId, profile, onBack, onSuccess, onEditBusiness, onManageProducts }: InvoiceBuilderProps) {
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', gstin: '', address: '' });
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState(profile.terms || '');
  const [useNotesAlways, setUseNotesAlways] = useState(!!profile.terms);
  const [items, setItems] = useState<Line[]>([]);
  const [gstRate, setGstRate] = useState(18);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<(InvoiceView & { public_token: string }) | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [productQuery, setProductQuery] = useState('');

  useEffect(() => {
    let alive = true;
    axios.get(productsUrl(websiteId), { withCredentials: true })
      .then((res) => { if (alive) setProducts(res.data); })
      .catch(() => { if (alive) setProducts([]); });
    return () => { alive = false; };
  }, [websiteId]);

  const customerGstinError = gstinError(customer.gstin);
  // Without an explicit choice, the customer's GSTIN tells their state, else it's a local sale.
  const supplyState = placeOfSupply || (!customerGstinError && customer.gstin ? customer.gstin.slice(0, 2).toUpperCase() : '') || profile.state_code;
  const totals = computeTotals(items, gstRate, profile.state_code, supplyState);

  /** Tap a product: add it, or one more of it. */
  const addProduct = (p: Product) => {
    setItems((list) => {
      const at = list.findIndex((l) => l.product_id === p.id);
      if (at >= 0) return list.map((l, i) => (i === at ? { ...l, quantity: (l.quantity || 0) + 1 } : l));
      return [...list, {
        product_id: p.id, description: p.name, hsn_sac: p.hsn_sac, quantity: 1,
        price: Number(p.price), gst_rate: p.gst_rate === null ? null : Number(p.gst_rate),
      }];
    });
  };

  const updateItem = (index: number, field: keyof DraftItem, value: string) => {
    setItems((list) => list.map((item, i) => {
      if (i !== index) return item;
      if (field === 'description' || field === 'hsn_sac') return { ...item, [field]: value };
      if (field === 'gst_rate') return { ...item, gst_rate: value === '' ? null : Number(value) };
      return { ...item, [field]: value === '' ? 0 : Number(value) };
    }));
  };

  const stepQty = (index: number, delta: number) => setItems((list) => list
    .map((item, i) => (i === index ? { ...item, quantity: (item.quantity || 0) + delta } : item))
    .filter((item) => item.quantity > 0));

  const preview: InvoiceView = useMemo(() => ({
    invoice_number: saved?.invoice_number || `${profile.invoice_prefix || 'INV'}/…`,
    issue_date: issueDate,
    due_date: dueDate || null,
    seller_name: profile.legal_name,
    seller_gstin: gstinError(profile.gstin) ? '' : profile.gstin.toUpperCase(),
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
  }), [saved, profile, issueDate, dueDate, customer, customerGstinError, supplyState, items, gstRate, totals, notes]);

  const handleSave = async () => {
    if (!customer.name.trim()) return toast.error('Add the customer name');
    if (items.length === 0) return toast.error('Tap a product or add an item');
    if (items.some((item) => !item.description.trim())) return toast.error('Every item needs a description');
    if (customerGstinError) return toast.error(`Customer GSTIN: ${customerGstinError}`);
    if (dueDate && dueDate < issueDate) return toast.error('The due date is before the invoice date');

    setLoading(true);
    try {
      // "Use these notes on every invoice" is part of the shop's saved details
      const terms = useNotesAlways ? notes : '';
      if (terms !== (profile.terms || '')) {
        await axios.patch(profileUrl(websiteId), { terms }, { withCredentials: true });
      }
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

  const shownProducts = (products || []).filter((p) => p.name.toLowerCase().includes(productQuery.toLowerCase()));
  const qtyOf = (id: number) => items.find((l) => l.product_id === id)?.quantity || 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button onClick={saved ? onSuccess : onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" aria-label="Back">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900">{saved ? saved.invoice_number : 'New Invoice'}</h2>
            {!saved && items.length > 0 && <p className="text-xs font-bold text-slate-500">{items.reduce((n, l) => n + l.quantity, 0)} items · {inr(totals.total)}</p>}
          </div>
        </div>
        {!saved && (
          <button
            onClick={handleSave}
            disabled={loading}
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
            {/* Seller: set up once */}
            <section className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><Store size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Billing as</p>
                <p className="truncate font-black text-slate-900">
                  {profile.legal_name}{profile.gstin && <span className="ml-2 font-mono text-xs font-bold text-slate-500">{profile.gstin}</span>}
                </p>
              </div>
              <button onClick={onEditBusiness} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold text-orange-600 hover:bg-orange-50">
                <Pencil size={14} /> Edit
              </button>
            </section>

            {/* POS: tap products */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-slate-900">Tap to add</h3>
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input value={productQuery} onChange={(e) => setProductQuery(e.target.value)} placeholder="Search products" className={`${input} pl-9`} />
                </div>
              </div>
              {products === null ? (
                <p className="py-6 text-center text-sm text-slate-400">Loading products…</p>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-slate-200 py-8 text-center">
                  <Package size={32} className="text-slate-300" />
                  <p className="mt-2 text-sm font-bold text-slate-600">No saved products yet</p>
                  <p className="text-xs text-slate-400">Save them once and bill with a tap. Or add a custom item below.</p>
                  <button onClick={onManageProducts} className="mt-3 rounded-xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-100">
                    Add products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-4">
                  {shownProducts.map((p) => {
                    const qty = qtyOf(p.id);
                    return (
                      <button key={p.id} type="button" onClick={() => addProduct(p)}
                        className={`relative rounded-xl border-2 p-3 text-left transition-all active:scale-95 ${qty ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}`}>
                        {qty > 0 && (
                          <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-600 px-1.5 text-xs font-black text-white">{qty}</span>
                        )}
                        <span className="block truncate text-sm font-bold text-slate-900" title={p.name}>{p.name}</span>
                        <span className="mt-0.5 block text-sm font-black text-orange-700">{inr(p.price)}</span>
                      </button>
                    );
                  })}
                  {shownProducts.length === 0 && <p className="col-span-full py-4 text-center text-sm text-slate-400">No products match.</p>}
                </div>
              )}
            </section>

            {/* Bill */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-slate-900">Bill</h3>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    Default GST
                    <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="border border-slate-200 rounded-lg px-2 py-1 text-sm">
                      {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </label>
                  <button onClick={() => setItems([...items, { description: '', hsn_sac: '', quantity: 1, price: 0, gst_rate: null }])} className="text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-orange-100">
                    <Plus size={14} /> Custom item
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_120px_110px_80px_auto] gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <input value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Item description" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <div className="flex items-center justify-end gap-1 md:justify-start" role="group" aria-label="Quantity">
                      <button onClick={() => stepQty(index, -1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100" aria-label="One less"><Minus size={14} /></button>
                      <input type="number" min="1" value={item.quantity || ''} onChange={(e) => updateItem(index, 'quantity', e.target.value)} aria-label="Quantity" className="h-9 w-12 rounded-lg border border-slate-200 bg-white text-center text-sm font-bold outline-none" />
                      <button onClick={() => stepQty(index, 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100" aria-label="One more"><Plus size={14} /></button>
                    </div>
                    <input type="number" min="0" step="0.01" value={item.price || ''} onChange={(e) => updateItem(index, 'price', e.target.value)} placeholder="Rate (₹)" aria-label="Rate" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <select value={item.gst_rate ?? ''} onChange={(e) => updateItem(index, 'gst_rate', e.target.value)} aria-label="GST rate" className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm">
                      <option value="">{gstRate}%</option>
                      {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-black text-slate-900 md:hidden">{inr((item.quantity || 0) * (item.price || 0))}</span>
                      <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">Tap a product above, or add a custom item.</div>}
              </div>

              {items.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
                  <span className="text-sm font-bold text-white/70">Total (incl. GST {inr(totals.tax)})</span>
                  <span className="text-xl font-black">{inr(totals.total)}</span>
                </div>
              )}
            </section>

            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Customer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Customer name *</label>
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

            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <label className={label}>Notes &amp; terms</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={input} placeholder="e.g. Payment within 7 days. Thank you!" />
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={useNotesAlways} onChange={(e) => setUseNotesAlways(e.target.checked)} />
                Use these notes on every invoice
              </label>
            </section>
          </div>
        )}

        <div className="w-full xl:w-[520px] shrink-0">
          <div className="bg-slate-200 p-3 sm:p-4 rounded-3xl xl:sticky xl:top-0">
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
