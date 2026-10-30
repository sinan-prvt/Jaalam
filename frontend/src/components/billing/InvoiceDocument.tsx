import { QRCodeSVG } from 'qrcode.react';
import { amountInWords, inr, upiLink } from '../../utils/gst';
import { invoiceTheme } from './invoiceThemes';
import { customerLabel } from '../../utils/billing';

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
  theme?: string;
}

const fmtDate = (d?: string | null) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const STATUS_STAMP: Record<string, string> = {
  PAID: 'border-emerald-500 text-emerald-600',
  OVERDUE: 'border-rose-500 text-rose-600',
  CANCELLED: 'border-slate-400 text-slate-500',
};

/**
 * One invoice, used for the builder preview, the customer's link and printing / Save as PDF.
 * `theme` (or invoice.theme) picks the design, see invoiceThemes.ts.
 */
export default function InvoiceDocument({ invoice, theme }: { invoice: InvoiceView; theme?: string }) {
  const t = invoiceTheme(theme ?? invoice.theme);
  const centered = t.layout === 'centered';
  const band = t.layout === 'band';
  const registered = !!invoice.seller_gstin;
  const balance = Number(invoice.balance_due ?? invoice.total_amount);
  const paid = Number(invoice.amount_paid || 0);
  const showUpi = !!invoice.seller_upi && balance > 0 && invoice.display_status !== 'CANCELLED';
  const stamp = invoice.display_status && STATUS_STAMP[invoice.display_status];

  return (
    // Coloured headers and bands keep their colours when printed / saved as PDF
    <div className={`invoice-document relative p-5 sm:p-8 text-sm leading-relaxed [print-color-adjust:exact] [-webkit-print-color-adjust:exact] ${t.root}`}>
      {stamp && (
        <div className={`absolute top-6 right-6 z-10 rotate-12 border-4 rounded-lg px-3 py-1 font-black text-lg tracking-widest opacity-80 bg-white/70 ${stamp}`}>
          {invoice.display_status}
        </div>
      )}

      <div className={`flex gap-6 pb-6 ${t.header} ${band ? '-mx-5 -mt-5 sm:-mx-8 sm:-mt-8 px-5 pt-5 sm:px-8 sm:pt-8' : ''} ${centered ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-start justify-between'}`}>
        <div className={`flex gap-4 min-w-0 ${centered ? 'flex-col items-center' : 'items-start'}`}>
          {invoice.seller_logo ? (
            <img src={invoice.seller_logo} alt="" className={`object-contain shrink-0 ${band ? 'w-16 h-16 rounded-lg bg-white p-1' : 'w-16 h-16'}`} />
          ) : (
            <div className={`w-14 h-14 flex items-center justify-center font-black text-2xl shrink-0 ${t.logoFallback}`}>
              {(invoice.seller_name || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h2 className={`text-xl font-black break-words ${t.sellerName}`}>{invoice.seller_name || 'Your business'}</h2>
            {invoice.seller_address && <p className={`whitespace-pre-line ${t.muted}`}>{invoice.seller_address}</p>}
            {invoice.seller_state_name && <p className={t.muted}>State: {invoice.seller_state_name}</p>}
            {(invoice.seller_phone || invoice.seller_email) && (
              <p className={t.muted}>{[invoice.seller_phone, invoice.seller_email].filter(Boolean).join(' · ')}</p>
            )}
            {registered && <p className={`font-bold ${t.sellerName}`}>GSTIN: {invoice.seller_gstin}</p>}
          </div>
        </div>
        <div className={`shrink-0 ${centered ? '' : 'sm:text-right'}`}>
          <h1 className={`text-2xl ${t.title}`}>{registered ? 'Tax Invoice' : 'Invoice'}</h1>
          <p className={`mt-1 ${t.number}`}>{invoice.invoice_number || 'DRAFT'}</p>
          {invoice.issue_date && <p className={t.muted}>Date: {fmtDate(invoice.issue_date)}</p>}
          {invoice.due_date && <p className={t.muted}>Due: {fmtDate(invoice.due_date)}</p>}
        </div>
      </div>

      <div className={`grid gap-6 py-6 ${centered ? 'text-center' : 'sm:grid-cols-2'}`}>
        <div>
          <p className={`text-[11px] mb-1 ${t.label}`}>Bill to</p>
          <p className="font-bold">{customerLabel(invoice.customer_name)}</p>
          {invoice.customer_address && <p className="whitespace-pre-line opacity-80">{invoice.customer_address}</p>}
          {(invoice.customer_phone || invoice.customer_email) && (
            <p className="opacity-80">{[invoice.customer_phone, invoice.customer_email].filter(Boolean).join(' · ')}</p>
          )}
          {invoice.customer_gstin && <p className="font-bold">GSTIN: {invoice.customer_gstin}</p>}
        </div>
        {invoice.place_of_supply_name && (
          <div className={centered ? '' : 'sm:text-right'}>
            <p className={`text-[11px] mb-1 ${t.label}`}>Place of supply</p>
            <p className="font-bold">{invoice.place_of_supply_name}</p>
          </div>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className={`text-left text-[11px] uppercase tracking-wider ${t.tableHead}`}>
            <th className="py-2 px-2 font-bold">Item</th>
            <th className="py-2 px-2 text-right font-bold">Qty</th>
            <th className="py-2 px-2 text-right font-bold">Rate</th>
            <th className="py-2 px-2 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className={`align-top ${t.row}`}>
              <td className="py-2 px-2 break-words">
                <p className="font-medium">{item.description || '—'}</p>
                <p className="text-[11px] opacity-60">
                  {[item.hsn_sac && `HSN/SAC ${item.hsn_sac}`, `GST ${Number(item.gst_rate ?? invoice.gst_percentage)}%`].filter(Boolean).join(' · ')}
                </p>
              </td>
              <td className="py-2 px-2 text-right">{item.quantity}</td>
              <td className="py-2 px-2 text-right whitespace-nowrap">{inr(item.price)}</td>
              <td className="py-2 px-2 text-right font-bold whitespace-nowrap">{inr(item.total)}</td>
            </tr>
          ))}
          {invoice.items.length === 0 && (
            <tr><td colSpan={4} className="py-6 text-center opacity-50">No items yet</td></tr>
          )}
        </tbody>
      </table>

      <div className={`flex gap-6 pt-6 break-inside-avoid ${centered ? 'flex-col-reverse' : 'flex-col sm:flex-row justify-between'}`}>
        <div className={`flex-1 space-y-4 ${centered ? 'text-center' : ''}`}>
          <p className="text-xs opacity-80"><span className="font-bold">Amount in words:</span> {amountInWords(invoice.total_amount)}</p>
          {showUpi && (
            <div className={`flex items-center gap-4 ${centered ? 'flex-col' : ''}`}>
              <div className="bg-white p-1.5 border border-slate-200 rounded-lg">
                <QRCodeSVG value={upiLink(invoice.seller_upi!, invoice.seller_name, balance, invoice.invoice_number || 'Invoice')} size={96} level="M" />
              </div>
              <div className="text-xs opacity-80">
                <p className="font-bold">Scan to pay {inr(balance)} by UPI</p>
                <p className="font-mono">{invoice.seller_upi}</p>
              </div>
            </div>
          )}
          {invoice.notes && (
            <div>
              <p className={`text-[11px] mb-1 ${t.label}`}>Notes &amp; terms</p>
              <p className="whitespace-pre-line text-xs opacity-80">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className={`w-full space-y-1.5 ${centered ? '' : 'sm:w-72'}`}>
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
          <div className={`flex justify-between pt-2 mt-2 text-lg font-black ${t.total}`}>
            <span>Total</span>
            <span>{inr(invoice.total_amount)}</span>
          </div>
          {paid > 0 && (
            <>
              <Row label="Paid" value={`− ${inr(paid)}`} />
              <div className="flex justify-between font-black">
                <span>Balance due</span>
                <span>{inr(balance)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <p className={`text-center text-xs mt-10 pt-4 ${t.footer}`}>
        Thank you for your business!
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="opacity-70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
