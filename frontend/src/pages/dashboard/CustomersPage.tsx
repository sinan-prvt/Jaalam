import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Phone, Mail, FileText, Search, User, CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  last_contact_date: string;
  website: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/customers/', { withCredentials: true });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/api/customers/${id}/`, { status }, { withCredentials: true });
      setCustomers(customers.map(c => c.id === id ? { ...c, status } : c));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="max-w-7xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Customers (CRM)</h1>
          <p className="text-slate-500 mt-1">Manage inquiries and clients from your websites.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium placeholder:text-slate-400 shadow-inner outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white/60 border border-slate-200 border-dashed rounded-3xl p-10 text-center shadow-sm">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No customers yet</h3>
          <p className="text-slate-500">When someone submits a contact form on your website, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-black">
                  <th className="p-4 pl-6">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-black">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-900">{customer.name}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-sm text-slate-500">
                        {customer.email && <div className="flex items-center gap-1"><Mail size={12}/> {customer.email}</div>}
                        {customer.phone && <div className="flex items-center gap-1 mt-1"><Phone size={12}/> {customer.phone}</div>}
                      </div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={customer.status}
                        onChange={(e) => updateCustomerStatus(customer.id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border outline-none
                          ${customer.status === 'NEW' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            customer.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            'bg-blue-50 text-blue-700 border-blue-200'}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <h2 className="text-2xl font-black mb-6">Customer Details</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                <div className="text-lg font-bold text-slate-900">{selectedCustomer.name}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                  <div className="text-slate-700">{selectedCustomer.phone || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="text-slate-700">{selectedCustomer.email || '-'}</div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <div className="text-slate-700 font-bold">{selectedCustomer.status}</div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-h-[100px] text-sm text-slate-600">
                  {selectedCustomer.notes || 'No notes added yet.'}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Close
              </button>
              {selectedCustomer.phone && (
                <a 
                  href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 font-bold rounded-xl transition-colors"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
