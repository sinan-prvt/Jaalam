import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Download, Smartphone } from 'lucide-react';
import InvoiceDocument, { type InvoiceView } from '../../components/billing/InvoiceDocument';
import { inr, upiLink } from '../../utils/gst';

/** The customer's "view & pay" page for a shared invoice link (/invoice/:token). */
export default function PublicInvoice() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const [invoice, setInvoice] = useState<InvoiceView | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/billing/public/${token}/`)
      .then((res) => setInvoice(res.data))
      .catch((err) => setError(err?.response?.status === 404 ? 'This invoice link is not valid.' : 'Could not load the invoice. Please try again.'));
  }, [token]);

  useEffect(() => {
    if (!invoice) return;
    document.title = `Invoice ${invoice.invoice_number} · ${invoice.seller_name}`;
    if (params.get('print') === '1') {
      const id = window.setTimeout(() => window.print(), 600); // let the logo and QR render
      return () => window.clearTimeout(id);
    }
  }, [invoice, params]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 text-center text-slate-600 font-medium">{error}</div>;
  }
  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  const balance = Number(invoice.balance_due ?? invoice.total_amount);
  const payable = !!invoice.seller_upi && balance > 0 && invoice.display_status !== 'CANCELLED';

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-3 sm:px-6 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden">
          <div>
            <p className="text-sm text-slate-500">Invoice from</p>
            <p className="font-black text-slate-900">{invoice.seller_name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {payable && (
              <a href={upiLink(invoice.seller_upi!, invoice.seller_name, balance, invoice.invoice_number)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm">
                <Smartphone size={18} /> Pay {inr(balance)}
              </a>
            )}
            <button onClick={() => window.print()} className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50">
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
        {payable && (
          <p className="text-xs text-slate-500 mb-4 print:hidden">“Pay” opens your UPI app (GPay, PhonePe, Paytm…) on your phone. On a computer, scan the QR code on the invoice instead.</p>
        )}
        {invoice.display_status === 'PAID' && (
          <p className="mb-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold px-4 py-3 print:hidden">This invoice has been paid. Thank you!</p>
        )}
        <div className="rounded-2xl overflow-hidden shadow-sm print:shadow-none print:rounded-none">
          <InvoiceDocument invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
