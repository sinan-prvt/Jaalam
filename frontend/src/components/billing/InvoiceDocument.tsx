import { QRCodeSVG } from 'qrcode.react';
import { amountInWords, inr, upiLink } from '../../utils/gst';

export interface InvoiceViewItem {
  description: string;
  hsn_sac?: string;
  quantity: number;
  price: string | number;
  gst_rate?: string | number | null;
  total: string | number;
}

/** The invoice as the server returns it (also built from the draft for the live preview). */
export interface InvoiceView {
  invoice_number: string;
  issue_date?: string | null;
  due_date?: string | null;
  seller_name: string;
  seller_gstin?: string;
  seller_address?: string;
  seller_state_name?: string;
  seller_phone?: string;
  seller_email?: string;
  seller_logo?: string;
  seller_upi?: string;
  customer_name: string;
  customer_gstin?: string;
  customer_address?: string;
  customer_phone?: string | null;
  customer_email?: string | null;
  place_of_supply_name?: string;
  items: InvoiceViewItem[];
  gst_percentage: string | number;
  subtotal: string | number;
  gst_amount: string | number;
  tax_type?: string;
  cgst_amount?: string | number;
  sgst_amount?: string | number;
  igst_amount?: string | number;
  total_amount: string | number;
  amount_paid?: string | number;
  balance_due?: string | number;
  notes?: string;
  display_status?: string;
}

const fmtDate = (d?: string | null) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const STATUS_STAMP: Record<string, string> = {
  PAID: 'border-emerald-500 text-emerald-600',
  OVERDUE: 'border-rose-500 text-rose-600',
  CANCELLED: 'border-slate-400 text-slate-500',
};

/** One invoice layout, used for the builder preview, the customer's link and printing / Save as PDF. */
export default function InvoiceDocument({ invoice }: { invoice: InvoiceView }) {
  const registered = !!invoice.seller_gstin;
  const balance = Number(invoice.balance_due ?? invoice.total_amount);
  const paid = Number(invoice.amount_paid || 0);
  const showUpi = !!invoice.seller_upi && balance > 0 && invoice.display_status !== 'CANCELLED';
  const stamp = invoice.display_status && STATUS_STAMP[invoice.display_status];

  return (
    <div className="invoice-document relative bg-white text-slate-800 p-5 sm:p-8 text-sm leading-relaxed">
      {stamp && (
        <div className={`absolute top-6 right-6 rotate-12 border-4 rounded-lg px-3 py-1 font-black text-lg tracking-widest opacity-80 ${stamp}`}>
          {invoice.display_status}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
        <div className="flex items-start gap-4 min-w-0">
          {invoice.seller_logo ? (
            <img src={invoice.seller_logo} alt="" className="w-16 h-16 object-contain shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shrink-0">
              {(invoice.seller_name || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900 break-words">{invoice.seller_name || 'Your business'}</h2>
            {invoice.seller_address && <p className="whitespace-pre-line text-slate-600">{invoice.seller_address}</p>}
            {invoice.seller_state_name && <p className="text-slate-600">State: {invoice.seller_state_name}</p>}
            {(invoice.seller_phone || invoice.seller_email) && (
              <p className="text-slate-600">{[invoice.seller_phone, invoice.seller_email].filter(Boolean).join(' · ')}</p>
            )}
            {registered && <p className="font-bold text-slate-900">GSTIN: {invoice.seller_gstin}</p>}
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <h1 className="text-2xl font-black tracking-widest uppercase text-slate-900">{registered ? 'Tax Invoice' : 'Invoice'}</h1>
          <p className="font-mono font-bold mt-1">{invoice.invoice_number || 'DRAFT'}</p>
          {invoice.issue_date && <p className="text-slate-600">Date: {fmtDate(invoice.issue_date)}</p>}
          {invoice.due_date && <p className="text-slate-600">Due: {fmtDate(invoice.due_date)}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 py-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Bill to</p>
          <p className="font-bold text-slate-900">{invoice.customer_name || 'Customer name'}</p>
          {invoice.customer_address && <p className="whitespace-pre-line text-slate-600">{invoice.customer_address}</p>}
          {(invoice.customer_phone || invoice.customer_email) && (
            <p className="text-slate-600">{[invoice.customer_phone, invoice.customer_email].filter(Boolean).join(' · ')}</p>
          )}
          {invoice.customer_gstin && <p className="font-bold">GSTIN: {invoice.customer_gstin}</p>}
        </div>
        {invoice.place_of_supply_name && (
          <div className="sm:text-right">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Place of supply</p>
            <p className="font-bold">{invoice.place_of_supply_name}</p>
          </div>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <th className="py-2 px-2">Item</th>
            <th className="py-2 px-2 text-right">Qty</th>
            <th className="py-2 px-2 text-right">Rate</th>
            <th className="py-2 px-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b border-slate-100 align-top">
              <td className="py-2 px-2 break-words">
                <p className="font-medium">{item.description || '—'}</p>
                <p className="text-[11px] text-slate-500">
                  {[item.hsn_sac && `HSN/SAC ${item.hsn_sac}`, `GST ${Number(item.gst_rate ?? invoice.gst_percentage)}%`].filter(Boolean).join(' · ')}
                </p>
              </td>
              <td className="py-2 px-2 text-right">{item.quantity}</td>
              <td className="py-2 px-2 text-right whitespace-nowrap">{inr(item.price)}</td>
              <td className="py-2 px-2 text-right font-bold whitespace-nowrap">{inr(item.total)}</td>
            </tr>
          ))}
          {invoice.items.length === 0 && (
            <tr><td colSpan={4} className="py-6 text-center text-slate-400">No items yet</td></tr>
          )}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row justify-between gap-6 pt-6 break-inside-avoid">
        <div className="flex-1 space-y-4">
          <p className="text-xs text-slate-600"><span className="font-bold">Amount in words:</span> {amountInWords(invoice.total_amount)}</p>
          {showUpi && (
            <div className="flex items-center gap-4">
              <div className="bg-white p-1.5 border border-slate-200 rounded-lg">
                <QRCodeSVG value={upiLink(invoice.seller_upi!, invoice.seller_name, balance, invoice.invoice_number || 'Invoice')} size={96} level="M" />
              </div>
              <div className="text-xs text-slate-600">
                <p className="font-bold text-slate-900">Scan to pay {inr(balance)} by UPI</p>
                <p className="font-mono">{invoice.seller_upi}</p>
              </div>
            </div>
          )}
          {invoice.notes && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Notes &amp; terms</p>
              <p className="whitespace-pre-line text-xs text-slate-600">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="w-full sm:w-72 space-y-1.5">
          <Row label="Taxable value" value={inr(invoice.subtotal)} />
          {invoice.tax_type === 'INTRA' ? (
            <>
              <Row label="CGST" value={inr(invoice.cgst_amount || 0)} />
              <Row label="SGST" value={inr(invoice.sgst_amount || 0)} />
            </>
          ) : invoice.tax_type === 'INTER' ? (
            <Row label="IGST" value={inr(invoice.igst_amount || 0)} />
          ) : (
            <Row label="GST" value={inr(invoice.gst_amount)} />
          )}
          <div className="flex justify-between border-t-2 border-slate-900 pt-2 mt-2 text-lg font-black text-slate-900">
            <span>Total</span>
            <span>{inr(invoice.total_amount)}</span>
          </div>
          {paid > 0 && (
            <>
              <Row label="Paid" value={`− ${inr(paid)}`} />
              <div className="flex justify-between font-black text-slate-900">
                <span>Balance due</span>
                <span>{inr(balance)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-10 pt-4 border-t border-dashed border-slate-200">
        Thank you for your business!
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
