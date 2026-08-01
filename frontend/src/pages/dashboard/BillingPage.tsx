import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Receipt, Plus, FileText, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import InvoiceBuilder from './components/InvoiceBuilder';

import toast from 'react-hot-toast';
import { Download, Printer, Trash2 } from 'lucide-react';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: string;
  total: string;
}

interface Invoice {
  id: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  subtotal: string;
  gst_percentage: string;
  gst_amount: string;
  total_amount: string;
  status: string;
  created_at: string;
  items?: InvoiceItem[];
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [activeWebsite, setActiveWebsite] = useState<any>(null);

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
          <p className="font-bold text-slate-900">Delete Invoice #{id}?</p>
          <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
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
            className="px-3 py-1.5 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  const generateInvoiceHTML = (inv: Invoice) => {
    return `
      <html>
        <head>
          <title>Invoice #${inv.id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; }
            body { font-family: 'Courier New', Courier, monospace, system-ui; color: #000; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 14px; line-height: 1.4; }
            .receipt-container { width: 100%; }
            
            .header { text-align: center; margin-bottom: 15px; }
            .title { font-size: 22px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; text-transform: uppercase; }
            .subtitle { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
            .date { font-size: 12px; color: #555; }
            
            .divider { border-bottom: 1px dashed #000; margin: 15px 0; }
            
            .details { margin-bottom: 15px; text-align: center; }
            .details-label { font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; text-decoration: underline; }
            .customer-name { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
            .customer-contact { font-size: 14px; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th { font-size: 12px; text-transform: uppercase; font-weight: bold; border-bottom: 1px dashed #000; border-top: 1px dashed #000; padding: 8px 2px; text-align: left; }
            td { padding: 8px 2px; text-align: left; word-break: break-word; font-size: 14px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            
            .totals-container { display: flex; justify-content: flex-end; width: 100%; page-break-inside: avoid; }
            .totals { width: 100%; max-width: 250px; }
            .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
            .totals-row.bold { font-weight: bold; font-size: 16px; border-top: 1px dashed #000; border-bottom: 1px dashed #000; margin-top: 8px; padding: 8px 0; }
            
            .footer { text-align: center; margin-top: 30px; font-size: 14px; font-weight: bold; }
            
            @media print {
              body { padding: 0; width: 100%; max-width: 100%; }
              @page { margin: 5mm; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="title">TAX INVOICE</div>
              <div class="subtitle">Invoice #${inv.id}</div>
              <div class="date">${new Date(inv.created_at).toLocaleString()}</div>
            </div>
            
            <div class="divider"></div>

            <div class="details">
              <div class="details-label">BILL TO</div>
              <div class="customer-name">${inv.customer_name}</div>
              ${inv.customer_phone ? `<div class="customer-contact">${inv.customer_phone}</div>` : ''}
              ${inv.customer_email ? `<div class="customer-contact">${inv.customer_email}</div>` : ''}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${inv.items?.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">${item.price}</td>
                    <td class="text-right">${item.total}</td>
                  </tr>
                `).join('') || `<tr><td colspan="4" class="text-center">No items</td></tr>`}
              </tbody>
            </table>
            
            <div class="totals-container">
              <div class="totals">
                <div class="totals-row">
                  <span>Subtotal</span>
                  <span>${inv.subtotal || 0}</span>
                </div>
                <div class="totals-row">
                  <span>GST (${inv.gst_percentage || 0}%)</span>
                  <span>${inv.gst_amount || 0}</span>
                </div>
                <div class="totals-row bold">
                  <span>TOTAL</span>
                  <span>Rs. ${inv.total_amount || 0}</span>
                </div>
              </div>
            </div>
            
            <div class="footer">
              Thank you for your business!
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const printInvoice = (inv: Invoice) => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(generateInvoiceHTML(inv));
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 250);
    }
  };

  const downloadInvoice = async (inv: Invoice) => {
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('TAX INVOICE', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Invoice #${inv.id}`, 105, 30, { align: 'center' });
      doc.text(new Date(inv.created_at).toLocaleString(), 105, 35, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('Bill To:', 20, 50);
      doc.setFontSize(10);
      doc.text(inv.customer_name, 20, 57);
      if (inv.customer_phone) doc.text(inv.customer_phone, 20, 62);
      if (inv.customer_email) doc.text(inv.customer_email, 20, 67);
      
      let y = 85;
      doc.setFontSize(10);
      doc.text('Item', 20, y);
      doc.text('Qty', 130, y, { align: 'right' });
      doc.text('Price', 160, y, { align: 'right' });
      doc.text('Total', 190, y, { align: 'right' });
      
      doc.line(20, y + 2, 190, y + 2);
      y += 10;
      
      inv.items?.forEach(item => {
        doc.text(item.description.substring(0, 40), 20, y);
        doc.text(String(item.quantity), 130, y, { align: 'right' });
        doc.text(`Rs. ${item.price}`, 160, y, { align: 'right' });
        doc.text(`Rs. ${item.total}`, 190, y, { align: 'right' });
        y += 8;
      });
      
      doc.line(20, y, 190, y);
      y += 10;
      
      doc.text('Subtotal:', 150, y);
      doc.text(`Rs. ${inv.subtotal || 0}`, 190, y, { align: 'right' });
      y += 8;
      
      doc.text(`GST (${inv.gst_percentage || 0}%):`, 150, y);
      doc.text(`Rs. ${inv.gst_amount || 0}`, 190, y, { align: 'right' });
      y += 10;
      
      doc.setFontSize(12);
      doc.text('TOTAL:', 150, y);
      doc.text(`Rs. ${inv.total_amount || 0}`, 190, y, { align: 'right' });
      
      doc.save(`Invoice_${inv.id}_${inv.customer_name.replace(/\s+/g, '_')}.pdf`);
      toast.success('Downloaded!', { id: 'pdf' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: 'pdf' });
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

  const filteredInvoices = invoices.filter(inv => inv.customer_name.toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + Number(inv.total_amount), 0);
  const pendingAmount = invoices.filter(i => i.status === 'UNPAID').reduce((sum, inv) => sum + Number(inv.total_amount), 0);

  return (
    <div className="h-full flex-1 flex flex-col animate-in fade-in zoom-in-[0.98] duration-500 overflow-hidden">
      
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
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1">Revenue (Paid)</p>
            <h3 className="text-3xl font-black text-emerald-900">₹{totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-1">Pending Amount</p>
            <h3 className="text-3xl font-black text-amber-900">₹{pendingAmount.toFixed(2)}</h3>
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
                placeholder="Search customers..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button 
              onClick={() => setIsCreating(true)} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
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
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">ID</th>
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
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">#{inv.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={inv.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        className={`outline-none appearance-none cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                          inv.status === 'UNPAID' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="UNPAID">UNPAID</option>
                        <option value="PAID">PAID</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="DRAFT">DRAFT</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">
                      ₹{Number(inv.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); printInvoice(inv); }} 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                          title="Print"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); downloadInvoice(inv); }} 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                          title="Download PDF"
                        >
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
    </div>
  );
}
