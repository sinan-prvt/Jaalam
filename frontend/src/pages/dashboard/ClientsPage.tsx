import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Mail, User, Shield, Lock, Loader2, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import usePlan from '../../hooks/usePlan';
import UpgradeNotice from '../../components/ui/UpgradeNotice';
import { apiError } from '../../utils/apiError';
import type { RootState } from '../../store';

interface Client {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  has_completed_onboarding: boolean;
  websites?: { slug: string; name: string }[];
}

interface AgencySite {
  slug: string;
  business_type: string;
  client?: number | null;
  content?: { settings_json?: { website_name?: string } };
}

/** Tick the agency's websites this client may manage. A site has one client at a time. */
function WebsiteAccess({ sites, clients, selfId, value, onChange }: {
  sites: AgencySite[];
  clients: Client[];
  selfId?: number;
  value: string[];
  onChange: (slugs: string[]) => void;
}) {
  const nameOf = (id?: number | null) => clients.find((c) => c.id === id)?.username;
  return (
    <div>
      <span className="block text-sm font-bold text-slate-700 mb-1">Website access</span>
      {sites.length === 0 ? (
        <p className="text-sm text-slate-500">You have no websites yet. Create one in My Sites first.</p>
      ) : (
        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
          {sites.map((s) => {
            const on = value.includes(s.slug);
            const other = s.client && s.client !== selfId ? nameOf(s.client) : null;
            return (
              <label key={s.slug} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50">
                <input type="checkbox" checked={on} className="h-4 w-4 accent-orange-600"
                  onChange={() => onChange(on ? value.filter((x) => x !== s.slug) : [...value, s.slug])} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">{s.content?.settings_json?.website_name || s.slug}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {s.business_type}{other && !on ? ` · now with ${other}` : ''}{other && on ? ` · moves from ${other}` : ''}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
      <p className="mt-1 text-xs text-slate-500">They can edit these sites and see their enquiries, invoices and loyalty card. They can't delete them.</p>
    </div>
  );
}

export default function ClientsPage() {
  const { can, requiredPlan } = usePlan();
  const canAddClients = can('client_accounts');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ username: '', password: '', email: '', websites: [] as string[] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editData, setEditData] = useState({ username: '', email: '', password: '', websites: [] as string[] });
  const [sites, setSites] = useState<AgencySite[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);

  const loadSites = () => axios.get('/api/websites/', { withCredentials: true })
    .then((res) => setSites(res.data))
    .catch(() => setSites([]));

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/users/clients/', { withCredentials: true });
      setClients(res.data);
      loadSites(); // who has which site changed
    } catch (err) {
      console.error(err);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    axios.get('/api/users/clients/', { withCredentials: true })
      .then((res) => { if (alive) setClients(res.data); })
      .catch((err) => { console.error(err); if (alive) toast.error('Failed to load clients'); })
      .finally(() => { if (alive) setLoading(false); });
    axios.get('/api/websites/', { withCredentials: true })
      .then((res) => { if (alive) setSites(res.data); })
      .catch(() => { if (alive) setSites([]); });
    return () => { alive = false; };
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/users/clients/', newClient, { withCredentials: true });
      toast.success('Client created successfully!');
      setIsModalOpen(false);
      setNewClient({ username: '', password: '', email: '', websites: [] });
      fetchClients();
    } catch (err) {
      toast.error(apiError(err, 'Failed to create client'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: number, username: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-white">Are you sure you want to delete {username}?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/users/${id}/manage_client/`, { withCredentials: true });
                toast.success('Client deleted successfully');
                fetchClients();
              } catch {
                toast.error('Failed to delete client');
              }
            }}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-black rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-black rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setIsSubmitting(true);
    
    try {
      await axios.put(`/api/users/${editingClient.id}/manage_client/`, editData, { withCredentials: true });
      toast.success('Client updated successfully!');
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      toast.error(apiError(err, 'Failed to update client'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role === 'CLIENT') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Shield className="w-20 h-20 text-slate-300 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-md">You do not have permission to view this page. Only Agency accounts can manage clients.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500 px-4 md:px-0">
      {!canAddClients && (
        <UpgradeNotice
          className="mb-6"
          title="Client accounts are part of the Business plan"
          message={`Upgrade to ${requiredPlan('client_accounts')} to give your clients their own logins. Existing clients keep working.`}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            Clients
          </h1>
          <p className="text-slate-500 font-medium">Manage sub-accounts for your website owners.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!canAddClients}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Plus size={20} />
          <span>New Client</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white/60 border border-slate-200 border-dashed rounded-3xl p-10 text-center shadow-sm">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No clients yet</h3>
          <p className="text-slate-500 mb-6">Create a client account to give website owners access to their own CRM and Analytics.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!canAddClients}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-orange-100 hover:border-orange-500 text-orange-600 rounded-xl font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            <span>Create First Client</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-700 font-black text-xl shrink-0">
                  {client.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 truncate" title={client.username}>{client.username}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-1 min-w-0">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{client.email || 'No email provided'}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => { setEditingClient(client); setEditData({ username: client.username, email: client.email || '', password: '', websites: (client.websites || []).map((w) => w.slug) }); }} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit Client">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteClient(client.id, client.username)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Client">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                    Active
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-slate-500 font-medium shrink-0">Websites</span>
                  <span className="min-w-0 text-right font-bold text-slate-900">
                    {client.websites?.length
                      ? client.websites.map((w) => w.name).join(', ')
                      : <span className="font-semibold text-amber-600">None yet: assign one in My Sites</span>}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CLIENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <User size={24} className="text-orange-500" />
                Create Client Account
              </h2>
            </div>
            
            <form onSubmit={handleCreateClient} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Username (Login ID)</label>
                  <input
                    type="text"
                    required
                    value={newClient.username}
                    onChange={e => setNewClient({...newClient, username: e.target.value.replace(/\s/g, '')})}
                    autoCapitalize="none"
                    autoComplete="off"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                    placeholder="e.g. cafeowner123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                    placeholder="client@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between items-center">
                    <span>Password</span>
                    <span className="text-xs font-normal text-slate-500">Provide this to your client</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={newClient.password}
                      onChange={e => setNewClient({...newClient, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <WebsiteAccess sites={sites} clients={clients} value={newClient.websites}
                  onChange={(websites) => setNewClient({ ...newClient, websites })} />
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingClient(null)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Edit2 size={24} className="text-orange-500" />
                Edit Client Account
              </h2>
            </div>
            
            <form onSubmit={handleUpdateClient} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Username (Login ID)</label>
                  <input
                    type="text"
                    required
                    value={editData.username}
                    onChange={e => setEditData({...editData, username: e.target.value.replace(/\s/g, '')})}
                    autoCapitalize="none"
                    autoComplete="off"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={e => setEditData({...editData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between items-center">
                    <span>New Password</span>
                    <span className="text-xs font-normal text-slate-500">Leave blank to keep unchanged</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      minLength={6}
                      value={editData.password}
                      onChange={e => setEditData({...editData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <WebsiteAccess sites={sites} clients={clients} selfId={editingClient.id} value={editData.websites}
                  onChange={(websites) => setEditData({ ...editData, websites })} />
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    'Update Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
