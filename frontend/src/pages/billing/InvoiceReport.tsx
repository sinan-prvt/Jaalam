import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Printer } from 'lucide-react';
import { apiError } from '../../utils/apiError';
import { inr } from '../../utils/gst';
import type { MonthlyReport } from '../../utils/billing';

const STATUS: Record<string, string> = { PAID: 'Paid', UNPAID: 'Unpaid', CANCELLED: 'Cancelled', DRAFT: 'Draft' };
const fmtDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

/**
 * Monthly invoice report (/dashboard/invoice-report?month=2026-10&website=5): every invoice of
 * the month with totals, GST split and day-by-day summary. Opens the print dialog so it can be
 * saved as a PDF ("Save as PDF").
 */
export default function InvoiceReport() {
  const [params] = useSearchParams();
  const month = params.get('month') || '';
  const website = params.get('website') || '';
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/billing/invoices/report/?month=${encodeURIComponent(month)}&website=${encodeURIComponent(website)}`, { withCredentials: true })
      .then((res) => setReport(res.data))
      .catch((err) => setError(apiError(err, 'Could not load the report.')));
  }, [month, website]);

  useEffect(() => {
    if (!report) return;
    document.title = `${report.business?.legal_name || 'Invoices'} - ${report.label} report`;
    const id = window.setTimeout(() => window.print(), 700); // let fonts and layout settle
    return () => window.clearTimeout(id);
  }, [report]);

  if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 text-center font-medium text-slate-600">{error}</div>;
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  const b = report.business;
  const t = report.totals;
  const th = 'px-2 py-2 text-left text-[10px] font-black uppercase tracking-wider text-slate-500';
  const td = 'px-2 py-1.5 text-xs text-slate-800';

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-6 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-4xl items-center justify-between gap-3 print:hidden">
        <Link to="/dashboard?tab=Billing" className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Back to invoices
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">
          <Printer size={16} /> Save as PDF / Print
        </button>
      </div>

      <div className="mx-auto max-w-4xl bg-white p-6 sm:p-10 shadow-sm print:shadow-none print:max-w-none print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            {b?.logo_url && <img src={b.logo_url} alt="" className="h-12 w-12 object-contain" />}
            <div>
              <h1 className="text-xl font-black text-slate-900">{b?.legal_name || 'Business'}</h1>
              <p className="text-xs text-slate-500">
                {b?.gstin && <>GSTIN {b.gstin} · </>}{b?.state_name}{b?.phone && <> · {b.phone}</>}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Monthly sales report</p>
            <p className="text-2xl font-black text-slate-900">{report.label}</p>
            <p className="text-[11px] text-slate-400">Generated {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4">
          {[
            ['Total billed', inr(t.total), `${t.count} invoice${t.count === 1 ? '' : 's'}`],
            ['Received', inr(t.received), 'payments recorded'],
            ['Still due', inr(t.due), 'to collect'],
            ['GST collected', inr(t.gst), `on ${inr(t.taxable)}`],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-xl border border-slate-200 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</p>
              <p className="text-lg font-black text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-400">{note}</p>
            </div>
          ))}
        </section>

        <section className="mt-3 flex flex-wrap gap-x-6 gap-y-1 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span>Taxable value: <b>{inr(t.taxable)}</b></span>
          <span>CGST: <b>{inr(t.cgst)}</b></span>
          <span>SGST: <b>{inr(t.sgst)}</b></span>
          <span>IGST: <b>{inr(t.igst)}</b></span>
          {t.cancelled > 0 && <span>Cancelled (not counted): <b>{t.cancelled}</b></span>}
        </section>

        <h2 className="mt-6 mb-2 text-sm font-black text-slate-900">All invoices</h2>
        {report.invoices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-500">No invoices in {report.label}.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="border-b border-slate-300">
              <tr>
                <th className={th}>Date</th><th className={th}>Invoice</th><th className={th}>Customer</th><th className={th}>Status</th>
                <th className={`${th} text-right`}>Taxable</th><th className={`${th} text-right`}>GST</th>
                <th className={`${th} text-right`}>Total</th><th className={`${th} text-right`}>Due</th>
              </tr>
            </thead>
            <tbody>
              {report.invoices.map((i) => {
                const off = i.status === 'CANCELLED' || i.status === 'DRAFT';
                return (
                  <tr key={i.id} className={`border-b border-slate-100 break-inside-avoid ${off ? 'text-slate-400 line-through' : ''}`}>
                    <td className={td}>{fmtDate(i.issue_date)}</td>
                    <td className={`${td} font-mono`}>{i.invoice_number}</td>
                    <td className={td}>{i.customer_name}</td>
                    <td className={td}>{i.status === 'UNPAID' && Number(i.amount_paid) > 0 ? 'Part paid' : STATUS[i.status] || i.status}</td>
                    <td className={`${td} text-right`}>{inr(i.subtotal)}</td>
                    <td className={`${td} text-right`}>{inr(i.gst_amount)}</td>
                    <td className={`${td} text-right font-bold`}>{inr(i.total_amount)}</td>
                    <td className={`${td} text-right`}>{off ? '–' : inr(i.balance_due)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-900">
              <tr>
                <td className={`${td} font-black`} colSpan={4}>Month total ({t.count} invoices)</td>
                <td className={`${td} text-right font-black`}>{inr(t.taxable)}</td>
                <td className={`${td} text-right font-black`}>{inr(t.gst)}</td>
                <td className={`${td} text-right font-black`}>{inr(t.total)}</td>
                <td className={`${td} text-right font-black`}>{inr(t.due)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {report.by_day.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2 break-inside-avoid">
            <div>
              <h2 className="mb-2 text-sm font-black text-slate-900">Day by day</h2>
              <table className="w-full border-collapse">
                <tbody>
                  {report.by_day.map((d) => (
                    <tr key={d.date} className="border-b border-slate-100">
                      <td className={td}>{fmtDate(d.date)}</td>
                      <td className={`${td} text-slate-500`}>{d.count} invoice{d.count === 1 ? '' : 's'}</td>
                      <td className={`${td} text-right font-bold`}>{inr(d.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-black text-slate-900">Top items</h2>
              <table className="w-full border-collapse">
                <tbody>
                  {report.top_items.map((it) => (
                    <tr key={it.description} className="border-b border-slate-100">
                      <td className={td}>{it.description}</td>
                      <td className={`${td} text-slate-500`}>× {it.quantity}</td>
                      <td className={`${td} text-right font-bold`}>{inr(it.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
          Totals leave out drafts and cancelled invoices. Made with Jaalam.
        </p>
      </div>
    </div>
  );
}
