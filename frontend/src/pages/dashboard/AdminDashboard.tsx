import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Globe, ShieldCheck, Printer, X, ShieldBan, Trash2, ExternalLink, Activity, DollarSign, TrendingUp, Search, UserMinus, ShieldAlert, CheckCircle2, ChevronRight, Menu, LogOut, Plus, Beaker } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import NotificationBell from '../../components/ui/NotificationBell';
import NotificationsPage from './NotificationsPage';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  membership: string;
  is_superuser: boolean;
  is_active: boolean;
  is_test_user: boolean;
}

interface Website {
  id: number;
  slug: string;
  theme: string;
  business_type: string;
  published: boolean;
  is_blocked: boolean;
  visitors_count: number;
  user: number;
  created_at: string;
}

interface PhysicalOrder {
  id: number;
  website_slug: string;
  user_email: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [physicalOrders, setPhysicalOrders] = useState<PhysicalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'websites' | 'notifications' | 'orders'>('overview');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [selectedUserForWebsites, setSelectedUserForWebsites] = useState<AdminUser | null>(null);
  const [websiteSortBy, setWebsiteSortBy] = useState<'newest' | 'visitors'>('newest');
  const [websiteFilterStatus, setWebsiteFilterStatus] = useState<'all' | 'live' | 'draft'>('all');
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<Website | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<PhysicalOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, websitesRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users/', { withCredentials: true }),
        axios.get('http://localhost:8000/api/websites/?all=true', { withCredentials: true }),
        axios.get('http://localhost:8000/api/websites/physical-orders/', { withCredentials: true }),
      ]);
      setUsers(usersRes.data);
      setWebsites(websitesRes.data);
      setPhysicalOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlockUser = async (userId: number) => {
    if (String(userId) === String(user?.id)) return alert("You cannot block yourself.");
    try {
      await axios.post(`http://localhost:8000/api/users/${userId}/toggle_block/`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRoleUser = async (userId: number) => {
    if (String(userId) === String(user?.id)) return alert("You cannot change your own role.");
    try {
      await axios.post(`http://localhost:8000/api/users/${userId}/toggle_role/`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_superuser: !u.is_superuser } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTestUser = async (userId: number) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/users/${userId}/toggle_test_user/`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_test_user: res.data.is_test_user } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (String(userId) === String(user?.id)) return alert("You cannot delete yourself.");
    if (!window.confirm("Are you sure you want to completely delete this user? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/${userId}/`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlockWebsite = async (slug: string) => {
    const isCurrentlyBlocked = websites.find(w => w.slug === slug)?.is_blocked;
    const confirmMessage = isCurrentlyBlocked
      ? `Are you sure you want to unblock ${slug}?`
      : `WARNING: Are you sure you want to block ${slug}? This will immediately suspend the website and hide it from the public.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await axios.post(`http://localhost:8000/api/websites/${slug}/toggle_block/`);
      setWebsites(websites.map(w => w.slug === slug ? { ...w, is_blocked: !w.is_blocked } : w));
      if (selectedProjectDetails?.slug === slug) {
        setSelectedProjectDetails({ ...selectedProjectDetails, is_blocked: !selectedProjectDetails.is_blocked });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWebsite = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete website ${slug}?`)) return;
    try {
      await axios.delete(`http://localhost:8000/api/websites/${slug}/?all=true`, { withCredentials: true });
      setWebsites(websites.filter(w => w.slug !== slug));
      if (selectedProjectDetails?.slug === slug) {
        setSelectedProjectDetails(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`http://localhost:8000/api/websites/physical-orders/${id}/`, { status }, { withCredentials: true });
      setPhysicalOrders(physicalOrders.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrderDetails?.id === id) {
        setSelectedOrderDetails({ ...selectedOrderDetails, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredWebsites = websites.filter(w => w.slug.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOrders = physicalOrders.filter(o => o.website_slug.toLowerCase().includes(searchQuery.toLowerCase()) || o.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Analytics Math
  const totalVisitors = websites.reduce((acc, curr) => acc + (curr.visitors_count || 0), 0);
  const activeUsers = users.filter(u => u.is_active).length;
  // Mock earnings based on "CREATOR PRO" membership count (mock $29/mo)
  const proUsers = users.filter(u => u.membership.toUpperCase().includes('PRO')).length;
  const mrr = proUsers * 29;

  if (!user?.is_superuser) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shrink-0 shadow-2xl`}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2 text-primary-400">
            <ShieldCheck size={24} />
            <span className="font-black text-lg tracking-tight text-white">SYSTEM ADMIN</span>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-3">Management</div>

          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'overview' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Activity size={18} /> Overview & Analytics
          </button>

          <button
            onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><Users size={18} /> Users</div>
            <span className="bg-slate-800 text-slate-300 py-0.5 px-2 rounded-full text-xs">{users.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('websites'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'websites' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><Globe size={18} /> Websites</div>
            <span className="bg-slate-800 text-slate-300 py-0.5 px-2 rounded-full text-xs">{websites.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('notifications'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'notifications' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <ShieldAlert size={18} /> Support Tickets
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'orders' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><Printer size={18} /> QR Orders</div>
            {physicalOrders.filter(o => o.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white font-bold py-0.5 px-2 rounded-full text-xs">{physicalOrders.filter(o => o.status === 'PENDING').length}</span>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
          >
            <LogOut size={16} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* TOPNAV */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-slate-800 capitalize">
              {activeTab === 'overview' ? 'Command Center' : `${activeTab} Management`}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {activeTab !== 'overview' && (
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none w-64 transition-all"
                />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-black flex items-center justify-center text-sm border border-primary-200">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
              <p className="font-bold">Loading system data...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* STAT CARDS */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 text-slate-50 opacity-50 group-hover:scale-110 transition-transform"><Users size={120} /></div>
                      <span className="text-slate-500 font-bold text-sm tracking-wide uppercase mb-1 relative z-10">Total Users</span>
                      <span className="text-4xl font-black text-slate-800 tracking-tight relative z-10">{users.length}</span>
                      <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-bold relative z-10">
                        <TrendingUp size={16} /> +{users.filter(u => u.is_active).length} Active
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 text-slate-50 opacity-50 group-hover:scale-110 transition-transform"><Globe size={120} /></div>
                      <span className="text-slate-500 font-bold text-sm tracking-wide uppercase mb-1 relative z-10">Live Websites</span>
                      <span className="text-4xl font-black text-slate-800 tracking-tight relative z-10">{websites.filter(w => w.published).length}</span>
                      <div className="mt-4 flex items-center gap-1 text-slate-400 text-sm font-bold relative z-10">
                        {websites.length} Total Created
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 text-slate-50 opacity-50 group-hover:scale-110 transition-transform"><Activity size={120} /></div>
                      <span className="text-slate-500 font-bold text-sm tracking-wide uppercase mb-1 relative z-10">Global Traffic</span>
                      <span className="text-4xl font-black text-slate-800 tracking-tight relative z-10">{totalVisitors.toLocaleString()}</span>
                      <div className="mt-4 flex items-center gap-1 text-indigo-500 text-sm font-bold relative z-10">
                        <Activity size={16} /> Visitors across all sites
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 flex flex-col relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 text-slate-700 opacity-50 group-hover:scale-110 transition-transform"><DollarSign size={120} /></div>
                      <span className="text-slate-400 font-bold text-sm tracking-wide uppercase mb-1 relative z-10">Monthly Revenue (MRR)</span>
                      <span className="text-4xl font-black text-emerald-400 tracking-tight relative z-10">${mrr.toLocaleString()}</span>
                      <div className="mt-4 flex items-center gap-1 text-slate-300 text-sm font-bold relative z-10">
                        {proUsers} Active PRO Subscriptions
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Globe className="text-primary-500" /> Recent Websites</h3>
                      <div className="space-y-4">
                        {websites.slice(0, 5).map(site => (
                          <div key={site.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                              <div className="font-bold text-slate-900">{site.slug}</div>
                              <div className="text-xs font-medium text-slate-500">{site.business_type}</div>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${site.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                {site.published ? 'LIVE' : 'DRAFT'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Users className="text-primary-500" /> Newest Users</h3>
                      <div className="space-y-4">
                        {users.slice(0, 5).map(u => (
                          <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-600 text-sm">
                                {u.username[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{u.username}</div>
                                <div className="text-xs font-medium text-slate-500">{u.email || 'No email'}</div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase tracking-wider">{u.membership}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB: USERS */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">User</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Role</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="flex items-center gap-3 whitespace-nowrap">
                                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-sm border-2 ${u.is_superuser ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                  {u.username[0].toUpperCase()}
                                </div>
                                <div className="whitespace-nowrap">
                                  <div className="font-black text-slate-900 whitespace-nowrap">{u.username}</div>
                                  <div className="text-xs text-slate-500 whitespace-nowrap">{u.email || 'No email provided'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {u.is_active ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                  <CheckCircle2 size={12} /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                                  <ShieldBan size={12} /> Blocked
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {u.is_superuser ? (
                                <span className="text-purple-700 font-black text-xs uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"><ShieldCheck size={14} /> Admin</span>
                              ) : u.is_test_user ? (
                                <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"><Beaker size={14} /> Test User</span>
                              ) : (
                                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider whitespace-nowrap">User</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setSelectedUserForWebsites(u)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View User's Websites"
                                >
                                  <Globe size={18} />
                                </button>
                                <button
                                  onClick={() => handleToggleRoleUser(u.id)}
                                  className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  title={u.is_superuser ? "Demote to User" : "Promote to Admin"}
                                >
                                  {u.is_superuser ? <UserMinus size={18} /> : <ShieldCheck size={18} />}
                                </button>
                                <button
                                  onClick={() => handleToggleTestUser(u.id)}
                                  className={`p-2 rounded-lg transition-colors ${u.is_test_user ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                  title={u.is_test_user ? "Remove Test User Status" : "Mark as Test User"}
                                >
                                  <Beaker size={18} />
                                </button>
                                <button
                                  onClick={() => handleToggleBlockUser(u.id)}
                                  className={`p-2 rounded-lg transition-colors ${u.is_active ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-amber-600 bg-amber-50 hover:bg-amber-100'}`}
                                  title={u.is_active ? "Block User" : "Unblock User"}
                                >
                                  <ShieldBan size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: WEBSITES */}
              {activeTab === 'websites' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                  {selectedUserForWebsites ? (
                    <>
                      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                        <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                          <button onClick={() => setSelectedUserForWebsites(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 shrink-0 mt-1 md:mt-0">
                            <ChevronRight className="rotate-180" size={20} />
                          </button>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-black text-slate-800 flex flex-wrap items-center gap-2">
                              <span className="truncate">Websites by {selectedUserForWebsites.username}</span>
                              <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">{websites.filter(w => w.user === selectedUserForWebsites.id).length} Sites</span>
                            </h2>
                            <p className="text-xs font-medium text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                              <span className="truncate">{selectedUserForWebsites.email}</span>
                              <span className="text-slate-300 hidden sm:inline">•</span>
                              <span className="flex items-center gap-1 font-bold text-slate-600 shrink-0">
                                <Activity size={12} className="text-primary-500" />
                                {websites.filter(w => w.user === selectedUserForWebsites.id).reduce((sum, w) => sum + (w.visitors_count || 0), 0)} total visitors
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                          <select
                            value={websiteFilterStatus}
                            onChange={(e) => setWebsiteFilterStatus(e.target.value as 'all' | 'live' | 'draft')}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 font-bold shadow-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="live">Live Only</option>
                            <option value="draft">Draft Only</option>
                          </select>
                          <select
                            value={websiteSortBy}
                            onChange={(e) => setWebsiteSortBy(e.target.value as 'newest' | 'visitors')}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 font-bold shadow-sm"
                          >
                            <option value="newest">Sort: Newest</option>
                            <option value="visitors">Sort: Most Visited</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                        {websites.filter(w => w.user === selectedUserForWebsites.id).length === 0 ? (
                          <div className="text-center text-slate-500 py-10 font-bold">This user has no websites.</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...websites.filter(w => w.user === selectedUserForWebsites.id)]
                              .filter(w => {
                                if (websiteFilterStatus === 'live') return w.published;
                                if (websiteFilterStatus === 'draft') return !w.published;
                                return true;
                              })
                              .sort((a, b) => {
                                if (websiteSortBy === 'visitors') {
                                  return (b.visitors_count || 0) - (a.visitors_count || 0);
                                }
                                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                              })
                              .map(w => (
                                <div
                                  key={w.id}
                                  className="border border-slate-200 rounded-xl p-5 flex flex-col gap-3 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer bg-white group/card"
                                  onClick={() => setSelectedProjectDetails(w)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-black text-xl text-slate-900 group-hover/card:text-primary-600 transition-colors">{w.slug}</div>
                                      <div className="text-xs text-slate-500 font-bold uppercase mt-1">{w.business_type} • {w.theme}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${w.is_blocked ? 'bg-rose-100 text-rose-700' : w.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                      {w.is_blocked ? 'Suspended' : w.published ? 'Live' : 'Draft'}
                                    </span>
                                  </div>
                                  <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                      <Activity size={16} className="text-slate-400" /> {w.visitors_count || 0} visitors
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="text-lg font-black text-slate-800">Select a User</h2>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white border-b border-slate-200">
                              <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Creator</th>
                              <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider text-center whitespace-nowrap">Total Websites</th>
                              <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider text-center whitespace-nowrap">Total Traffic</th>
                              <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {users
                              .filter(u => websites.some(w => w.user === u.id))
                              .filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map((u) => {
                                const userWebsites = websites.filter(w => w.user === u.id);
                                const totalTraffic = userWebsites.reduce((sum, w) => sum + (w.visitors_count || 0), 0);
                                return (
                                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedUserForWebsites(u)}>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                      <div className="flex items-center gap-3 whitespace-nowrap">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">
                                          {u.username[0].toUpperCase()}
                                        </div>
                                        <div className="whitespace-nowrap">
                                          <div className="font-black text-slate-900 text-lg group-hover:text-primary-600 transition-colors whitespace-nowrap">{u.username}</div>
                                          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">{u.email || 'No email'}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                      <span className="font-black text-slate-700">{userWebsites.length}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                      <span className="font-black text-slate-700">{totalTraffic}</span>
                                    </td>
                                    <td className="py-4 px-6 text-right whitespace-nowrap">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedUserForWebsites(u); }}
                                        className="px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 font-bold rounded-lg transition-colors text-sm inline-flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap"
                                      >
                                        View Websites <ChevronRight size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                      <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Website</th>
                      <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Customer Info</th>
                      <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-bold whitespace-nowrap">No orders found.</td>
                      </tr>
                    ) : filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-black text-slate-700 whitespace-nowrap">#{o.id}</td>
                        <td className="py-4 px-6 font-bold text-primary-600 whitespace-nowrap">{o.website_slug}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{o.name}</div>
                          <div className="text-xs text-slate-500">{o.email}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap
                            ${o.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              o.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                o.status === 'SHIPPED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrderDetails(o)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-lg transition-colors text-xs whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="flex-1 w-full h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] overflow-y-auto lg:overflow-hidden bg-transparent">
              <NotificationsPage />
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Printer className="text-primary-500" /> Order #{selectedOrderDetails.id}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                For website:
                <a
                  href={`/${selectedOrderDetails.website_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-bold hover:underline flex items-center gap-1"
                >
                  {selectedOrderDetails.website_slug}
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Name</div>
                  <div className="font-bold text-slate-800">{selectedOrderDetails.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</div>
                  <div className="font-bold text-slate-800">{selectedOrderDetails.phone}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</div>
                  <div className="font-bold text-slate-800">{selectedOrderDetails.email}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Shipping Address</div>
                  <div className="font-medium text-slate-700 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedOrderDetails.address}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Order Status</div>
                <div className="flex gap-2 flex-wrap">
                  {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${selectedOrderDetails.status === status
                          ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={`${window.location.origin}/${selectedOrderDetails.website_slug}`}
                    size={40}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <button
                  onClick={() => {
                    // Open the existing print-friendly QR code modal
                    setSelectedWebsite({ slug: selectedOrderDetails.website_slug } as Website);
                  }}
                  className="px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 font-bold rounded-xl flex items-center gap-2 transition-colors border border-primary-200 whitespace-nowrap"
                >
                  <Printer size={16} /> Print Sticker
                </button>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 bg-slate-800 text-white font-bold hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedWebsite && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedWebsite(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-8 pb-6 border-b border-slate-100 text-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900 mb-1">QR Sticker</h3>
              <p className="text-slate-500 font-medium">Ready to print for {selectedWebsite.slug}</p>
            </div>
            <div className="p-8 flex justify-center">
              <div className="bg-white p-6 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center">
                <div className="font-black text-xl mb-4 text-slate-800 tracking-tight">{selectedWebsite.slug.toUpperCase()}</div>
                <QRCodeSVG
                  value={`${window.location.origin}/${selectedWebsite.slug}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  className="mb-4"
                />
                <div className="text-xs text-slate-400 font-black tracking-widest uppercase">SCAN TO VISIT</div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSelectedWebsite(null)}
                className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-colors shadow-lg shadow-primary-600/30"
              >
                <Printer size={18} /> Print Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProjectDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[110] print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col">
            <button
              onClick={() => setSelectedProjectDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="text-2xl font-black text-slate-900 mb-1">Project Details</h3>
              <p className="text-slate-500 font-medium">Detailed overview for {selectedProjectDetails.slug}</p>
            </div>
            {selectedProjectDetails.is_blocked && (
              <div className="bg-rose-600 text-white p-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                <ShieldBan size={18} /> THIS SITE IS CURRENTLY BLOCKED
              </div>
            )}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
                  <div className="font-black text-slate-800 flex items-center gap-2">
                    {selectedProjectDetails.is_blocked ? (
                      <span className="text-rose-600 flex items-center gap-1"><ShieldBan size={16} /> Suspended</span>
                    ) : selectedProjectDetails.published ? (
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16} /> Live</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">Draft</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Business Type</div>
                  <div className="font-black text-slate-800 capitalize">{selectedProjectDetails.business_type}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Theme Used</div>
                  <div className="font-black text-slate-800 capitalize">{selectedProjectDetails.theme}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Visitors</div>
                  <div className="font-black text-slate-800 flex items-center gap-1">
                    <Activity size={16} className="text-slate-400" /> {selectedProjectDetails.visitors_count || 0}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Creation Date</div>
                    <div className="font-black text-slate-800">
                      {selectedProjectDetails.created_at ? new Date(selectedProjectDetails.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date Unknown'}
                    </div>
                  </div>
                  <div className="flex flex-col items-center mr-4">
                    <QRCodeSVG
                      value={`${window.location.origin}/${selectedProjectDetails.slug}`}
                      size={64}
                      level="H"
                      includeMargin={false}
                      className="rounded shadow-sm"
                    />
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest">SCAN QR</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-6 border-t border-slate-100 mt-6 gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedProjectDetails(null); setSelectedWebsite(selectedProjectDetails); }}
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors bg-slate-50 border border-slate-200 focus:outline-none"
                    title="Print QR Code"
                  >
                    <Printer size={18} />
                  </button>
                  <button
                    onClick={() => handleToggleBlockWebsite(selectedProjectDetails.slug)}
                    className={`p-2.5 rounded-xl transition-colors border focus:outline-none ${selectedProjectDetails.is_blocked ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 bg-slate-50 border-slate-200'}`}
                    title={selectedProjectDetails.is_blocked ? "Unblock/Restore Site" : "Suspend/Block Site"}
                  >
                    <ShieldBan size={18} />
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteWebsite(selectedProjectDetails.slug);
                      setSelectedProjectDetails(null);
                    }}
                    className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors bg-slate-50 border border-slate-200 focus:outline-none"
                    title="Delete Site"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <a
                  href={`/${selectedProjectDetails.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-colors shadow-lg shadow-primary-600/30 whitespace-nowrap"
                >
                  Visit Website <ExternalLink size={18} className="shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print-only View */}
      {selectedWebsite && (
        <div className="hidden print:flex fixed inset-0 bg-white z-[9999] items-center justify-center">
          <div className="flex flex-col items-center border-4 border-black p-10 rounded-[3rem] w-[400px]">
            <div className="font-black text-3xl mb-8 uppercase text-center tracking-wider">{selectedWebsite.slug}</div>
            <QRCodeSVG
              value={`${window.location.origin}/${selectedWebsite.slug}`}
              size={250}
              level="H"
              includeMargin={false}
              className="mb-8"
            />
            <div className="text-xl font-bold tracking-[0.2em] text-center">SCAN TO VISIT US</div>
          </div>
        </div>
      )}
    </div>
  );
}
