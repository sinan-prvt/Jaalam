import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Check, Loader2, Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { apiError } from '../../utils/apiError';
import { GST_RATES, inr } from '../../utils/gst';
import { productsUrl, type Product } from '../../utils/billing';

interface Draft { name: string; price: string; gst_rate: string; hsn_sac: string }
const EMPTY: Draft = { name: '', price: '', gst_rate: '', hsn_sac: '' };
const field = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/20';

/** The shop's saved products and services, tapped onto invoices like a POS. */
export default function ProductsPanel({ websiteId, defaultGst }: { websiteId: number; defaultGst: number }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null); // product id, or 0 for a new one
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');

  const load = () => axios.get(productsUrl(websiteId), { withCredentials: true })
    .then((res) => setProducts(res.data))
    .catch(() => setProducts([]));

  useEffect(() => {
    let alive = true;
    axios.get(productsUrl(websiteId), { withCredentials: true })
      .then((res) => { if (alive) setProducts(res.data); })
      .catch(() => { if (alive) setProducts([]); });
    return () => { alive = false; };
  }, [websiteId]);

  const startEdit = (p?: Product) => {
    setEditing(p ? p.id : 0);
    setDraft(p ? { name: p.name, price: String(Number(p.price)), gst_rate: p.gst_rate === null ? '' : String(Number(p.gst_rate)), hsn_sac: p.hsn_sac } : EMPTY);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return toast.error('Enter the product name');
    if (draft.price === '' || Number(draft.price) < 0) return toast.error('Enter the price');
    setSaving(true);
    const body = { name: draft.name, price: draft.price, gst_rate: draft.gst_rate === '' ? null : draft.gst_rate, hsn_sac: draft.hsn_sac };
    try {
      if (editing) await axios.patch(`/api/billing/products/${editing}/`, body, { withCredentials: true });
      else await axios.post(productsUrl(websiteId), body, { withCredentials: true });
      toast.success(editing ? 'Product updated' : 'Product added');
      setEditing(null);
      setDraft(EMPTY);
      load();
    } catch (err) {
      toast.error(apiError(err, 'Could not save the product'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? Invoices already made keep it.`)) return;
    try {
      await axios.delete(`/api/billing/products/${p.id}/`, { withCredentials: true });
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(apiError(err, 'Could not delete the product'));
    }
  };

  const form = (
    <form onSubmit={save} className="rounded-2xl border-2 border-orange-200 bg-orange-50/40 p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_120px_110px_120px]">
        <input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Product or service name" maxLength={150} className={`${field} col-span-2 md:col-span-1`} aria-label="Product name" />
        <input type="number" min="0" step="0.01" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Price ₹" className={field} aria-label="Price" />
        <select value={draft.gst_rate} onChange={(e) => setDraft({ ...draft, gst_rate: e.target.value })} className={field} aria-label="GST rate">
          <option value="">GST {defaultGst}% (default)</option>
          {GST_RATES.map((r) => <option key={r} value={r}>GST {r}%</option>)}
        </select>
        <input value={draft.hsn_sac} onChange={(e) => setDraft({ ...draft, hsn_sac: e.target.value.replace(/\D/g, '').slice(0, 8) })} placeholder="HSN/SAC (opt.)" className={`${field} font-mono col-span-2 md:col-span-1`} aria-label="HSN or SAC code" />
      </div>
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} {editing ? 'Save' : 'Add product'}
        </button>
        <button type="button" onClick={() => { setEditing(null); setDraft(EMPTY); }} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">
          <X size={15} /> Cancel
        </button>
      </div>
    </form>
  );

  const shown = (products || []).filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Products &amp; services</h3>
          <p className="text-sm text-slate-500">Save what you sell once. When billing, just tap them, like a POS.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className={`${field} pl-9`} />
          </div>
          {editing === null && (
            <button onClick={() => startEdit()} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white">
              <Plus size={16} /> Add
            </button>
          )}
        </div>
      </div>

      {editing === 0 && form}

      {products === null ? (
        <p className="py-10 text-center text-sm text-slate-400">Loading products…</p>
      ) : products.length === 0 && editing === null ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
          <Package size={40} className="text-slate-300" />
          <p className="mt-3 font-bold text-slate-600">No products yet</p>
          <p className="text-sm text-slate-400">Add your menu items, products or services with their prices.</p>
          <button onClick={() => startEdit()} className="mt-4 flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white">
            <Plus size={16} /> Add your first product
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {shown.map((p) => (
            <li key={p.id} className="p-3 sm:p-4">
              {editing === p.id ? form : (
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      GST {p.gst_rate === null ? `${defaultGst}% (default)` : `${Number(p.gst_rate)}%`}{p.hsn_sac && ` · HSN/SAC ${p.hsn_sac}`}
                    </p>
                  </div>
                  <span className="shrink-0 font-black text-slate-900">{inr(p.price)}</span>
                  <button onClick={() => startEdit(p)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${p.name}`}><Pencil size={15} /></button>
                  <button onClick={() => remove(p)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${p.name}`}><Trash2 size={15} /></button>
                </div>
              )}
            </li>
          ))}
          {shown.length === 0 && <li className="p-6 text-center text-sm text-slate-400">No products match.</li>}
        </ul>
      )}
    </div>
  );
}
