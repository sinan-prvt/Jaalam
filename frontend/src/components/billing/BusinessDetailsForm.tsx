import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { apiError } from '../../utils/apiError';
import { GST_STATES, gstinError } from '../../utils/gst';
import type { BusinessProfile } from '../../utils/billing';

const STATE_OPTIONS = Object.entries(GST_STATES).sort((a, b) => a[1].localeCompare(b[1]));
const input = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-orange-500/20 outline-none';
const label = 'block text-xs font-bold text-slate-500 uppercase mb-2';

/** The seller details printed on every invoice: name, GSTIN, state, UPI, contact, logo. */
export default function BusinessDetailsForm({ value, onChange }: { value: BusinessProfile; onChange: (p: BusinessProfile) => void }) {
  const [uploading, setUploading] = useState(false);
  const set = (field: keyof BusinessProfile, v: string) => onChange({ ...value, [field]: v });
  const gstError = gstinError(value.gstin);

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await axios.post('/api/websites/upload/', form, { withCredentials: true });
      set('logo_url', res.data.url);
    } catch (err) {
      toast.error(apiError(err, 'Could not upload the logo'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 flex items-center gap-4">
        {value.logo_url ? (
          <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
            <img src={value.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
            <button type="button" onClick={() => set('logo_url', '')} className="absolute top-0.5 right-0.5 bg-rose-500 text-white p-1 rounded-full shadow-sm" aria-label="Remove logo">
              <Trash2 size={10} />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <ImageIcon size={24} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploading}
            onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadLogo(file); e.target.value = ''; }}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          <p className="text-[10px] text-slate-400 mt-1">{uploading ? 'Uploading…' : 'Logo (optional), PNG or JPG'}</p>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="biz-name">Business name *</label>
        <input id="biz-name" value={value.legal_name} onChange={(e) => set('legal_name', e.target.value)} className={input} placeholder="Your registered business name" />
      </div>
      <div>
        <label className={label} htmlFor="biz-gstin">GSTIN (if registered)</label>
        <input
          id="biz-gstin"
          value={value.gstin}
          onChange={(e) => {
            const v = e.target.value.toUpperCase().replace(/\s/g, '');
            onChange({ ...value, gstin: v, state_code: v.length >= 2 && GST_STATES[v.slice(0, 2)] ? v.slice(0, 2) : value.state_code });
          }}
          maxLength={15}
          className={`${input} font-mono ${gstError && value.gstin ? 'border-rose-300' : ''}`}
          placeholder="27AAPFU0939F1ZV"
        />
        {gstError && value.gstin.length >= 15 && <p className="text-xs text-rose-600 mt-1">{gstError}</p>}
      </div>
      <div>
        <label className={label} htmlFor="biz-state">State</label>
        <select id="biz-state" value={value.state_code} onChange={(e) => set('state_code', e.target.value)} className={input}>
          <option value="">Select state</option>
          {STATE_OPTIONS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="biz-upi">UPI ID (for “Pay now”)</label>
        <input id="biz-upi" value={value.upi_id} onChange={(e) => set('upi_id', e.target.value.trim())} className={input} placeholder="shop@okicici" />
      </div>
      <div>
        <label className={label} htmlFor="biz-phone">Phone</label>
        <input id="biz-phone" type="tel" value={value.phone} onChange={(e) => set('phone', e.target.value)} className={input} />
      </div>
      <div>
        <label className={label} htmlFor="biz-email">Email</label>
        <input id="biz-email" type="email" value={value.email} onChange={(e) => set('email', e.target.value)} className={input} />
      </div>
      <div className="md:col-span-2">
        <label className={label} htmlFor="biz-address">Address</label>
        <textarea id="biz-address" value={value.address} onChange={(e) => set('address', e.target.value)} rows={2} className={input} />
      </div>
      <div>
        <label className={label} htmlFor="biz-prefix">Invoice number prefix</label>
        <input id="biz-prefix" value={value.invoice_prefix} onChange={(e) => set('invoice_prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 10))} className={`${input} font-mono`} placeholder="INV" />
      </div>
    </div>
  );
}
