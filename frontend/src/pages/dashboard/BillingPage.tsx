import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Receipt, Plus, FileText, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import InvoiceBuilder from './components/InvoiceBuilder';

interface Invoice {
  id: number;
  customer_name: string;
  total_amount: string;
  status: string;
  created_at: string;
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
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100/50 hover:bg-white/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">#{inv.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'UNPAID' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.status === 'PAID' ? <CheckCircle2 size={12} /> : 
                         inv.status === 'UNPAID' ? <Clock size={12} /> : <XCircle size={12} />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">
                      ₹{Number(inv.total_amount).toFixed(2)}
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
