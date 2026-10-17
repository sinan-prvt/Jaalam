import ThemeThumbnail from '../../components/themes/invitation-modern/ThemeThumbnail';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, Globe, ShieldCheck, Printer, X, ShieldBan, Trash2, ExternalLink, Activity, DollarSign, TrendingUp, Search, UserMinus, ShieldAlert, CheckCircle2, ChevronRight, Menu, LogOut, Beaker, MessageSquare, Paperclip, Send, LayoutTemplate, Plus, FileText, Edit } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getWebsiteUrl } from '../../utils/url';

import NotificationsPage from './NotificationsPage';
import { categoryThemes } from '../../utils/templateData';
import TemplateBuilderModal from '../../components/modals/TemplateBuilderModal';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  membership: string;
  is_superuser: boolean;
  is_active: boolean;
  is_test_user: boolean;
  plan_expires_at?: string | null;
  plan_period?: string;
  plan?: { code: string; name: string; period: string | null; expires_at: string | null };
  subscription_details?: {
    plan_type: string;
    status: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    amount: string;
    created_at: string;
  } | null;
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
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [physicalOrders, setPhysicalOrders] = useState<PhysicalOrder[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Messaging state
  const [messagingUser, setMessagingUser] = useState<AdminUser | 'ALL' | null>(null);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'websites' | 'notifications' | 'orders' | 'revenue' | 'templates' | 'blogs'>('overview');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [selectedUserForWebsites, setSelectedUserForWebsites] = useState<AdminUser | null>(null);
  const [websiteSortBy, setWebsiteSortBy] = useState<'newest' | 'visitors'>('newest');
  const [websiteFilterStatus, setWebsiteFilterStatus] = useState<'all' | 'live' | 'draft'>('all');
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<Website | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<PhysicalOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [templateFilterStatus, setTemplateFilterStatus] = useState<string>('All');
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogFormData, setBlogFormData] = useState({ title: '', content: '', image_url: '', published: false });
  const [isSavingBlog, setIsSavingBlog] = useState(false);

  const navigate = useNavigate();

  async function fetchData() {
    setLoading(true);
    try {
      const [usersRes, websitesRes, ordersRes, blogsRes] = await Promise.all([
        axios.get('/api/users/', { withCredentials: true }),
        axios.get('/api/websites/?all=true', { withCredentials: true }),
        axios.get('/api/websites/physical-orders/', { withCredentials: true }),
        axios.get('/api/marketing/blogs/', { withCredentials: true }),
        loading ? new Promise(resolve => setTimeout(resolve, 1500)) : Promise.resolve()
      ]);
      setUsers(usersRes.data);
      setWebsites(websitesRes.data);
      setPhysicalOrders(ordersRes.data);
      setBlogs(blogsRes.data);
      
      try {
        const settingsRes = await axios.get('/api/users/system-settings/', { withCredentials: true });
        setMaintenanceMode(settingsRes.data.maintenance_mode);
      } catch (e) {
        console.error("Settings error:", e);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const res = await axios.post('/api/users/system-settings/', {
        maintenance_mode: !maintenanceMode
      }, { withCredentials: true });
      setMaintenanceMode(res.data.maintenance_mode);
      toast.success(res.data.maintenance_mode ? 'Maintenance Mode ENABLED' : 'Maintenance Mode DISABLED');
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle maintenance mode');
    }
  };

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/dashboard');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [user, navigate]);

  const handleToggleBlockUser = async (userId: number) => {
    if (String(userId) === String(user?.id)) {
      toast.error("You cannot block yourself.");
      return;
    }
    try {
      await axios.post(`/api/users/${userId}/toggle_block/`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
      toast.success("User status updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user.");
    }
  };

  const handleToggleRoleUser = async (userId: number) => {
    const adminCount = users.filter(u => u.is_superuser).length;
    const targetUser = users.find(u => u.id === userId);
    
    if (targetUser?.is_superuser && adminCount <= 1) {
      toast.error("Action denied: There must be at least one System Admin.");
      return;
    }
    
    try {
      await axios.post(`/api/users/${userId}/toggle_role/`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_superuser: !u.is_superuser } : u));
      toast.success("User role updated.");
      
      // If the user demoted themselves, they will lose access to the admin dashboard,
      // but we let the useEffect handle the redirection on the next fetch/render if needed,
      // or we can explicitly redirect if they are no longer an admin.
      if (String(userId) === String(user?.id)) {
        navigate('/dashboard');
        toast('You have demoted yourself and left the Admin Dashboard.', { icon: '👋' });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role.");
    }
  };

  // Grant or change a plan by hand (e.g. cash/bank payment). Value: "TEST", "BUSINESS:30", "PREMIUM:lifetime"...
  const handleSetPlan = async (userId: number, value: string) => {
    if (!value) return;
    const [plan, term] = value.split(':');
    try {
      const res = await axios.post(`/api/users/${userId}/set_plan/`, term === 'lifetime' ? { plan, lifetime: true } : { plan, days: Number(term || 30) });
      setUsers(users.map(u => u.id === userId ? { ...u, ...res.data } : u));
      toast.success(`Plan updated for ${res.data.username}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Could not update the plan');
    }
  };

  const handleToggleTestUser = async (userId: number) => {
    try {
      const res = await axios.post(`/api/users/${userId}/toggle_test_user/`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_test_user: res.data.is_test_user } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const adminCount = users.filter(u => u.is_superuser).length;
    const targetUser = users.find(u => u.id === userId);

    if (targetUser?.is_superuser && adminCount <= 1) {
      toast.error("Action denied: You cannot delete the last System Admin.");
      return;
    }
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-slate-700/50 p-6`}>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-white">Are you sure you want to completely delete this user? This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/users/${userId}/`, { withCredentials: true });
                setUsers(prev => prev.filter(u => u.id !== userId));
                toast.success("User deleted permanently.");
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete user.");
              }
            }} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-rose-900/50">Yes, Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleSendMessage = async () => {
    if (!messagingUser || !messageTitle.trim() || !messageContent.trim()) return;
    setIsSendingMessage(true);
    try {
      if (messagingUser === 'ALL') {
        // Send to all users
        const promises = users.map(u =>
          axios.post('/api/users/notifications/', {
            title: messageTitle,
            message: messageContent,
            notification_type: 'SYSTEM',
            user: u.id
          }, { withCredentials: true }).catch(err => console.error(`Failed for ${u.username}`, err))
        );
        await Promise.all(promises);
        toast.success(`Message broadcasted to all ${users.length} users!`);
      } else {
        // Send to specific user
        await axios.post('/api/users/notifications/', {
          title: messageTitle,
          message: messageContent,
          notification_type: 'SYSTEM',
          user: messagingUser.id
        }, { withCredentials: true });
        toast.success(`Message sent to ${messagingUser.username}!`);
      }
      setMessagingUser(null);
      setMessageTitle('');
      setMessageContent('');
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleToggleBlockWebsite = async (slug: string) => {
    const isCurrentlyBlocked = websites.find(w => w.slug === slug)?.is_blocked;
    const confirmMessage = isCurrentlyBlocked
      ? `Are you sure you want to unblock ${slug}?`
      : `WARNING: Are you sure you want to block ${slug}? This will immediately suspend the website and hide it from the public.`;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-white">{confirmMessage}</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.post(`/api/websites/${slug}/toggle_block/`);
                setWebsites(prev => prev.map(w => w.slug === slug ? { ...w, is_blocked: !w.is_blocked } : w));
                if (selectedProjectDetails && selectedProjectDetails.slug === slug) {
                  setSelectedProjectDetails({ ...selectedProjectDetails, is_blocked: !selectedProjectDetails.is_blocked });
                }
                toast.success('Website status updated.');
              } catch (err) {
                console.error(err);
                toast.error('Failed to update website status.');
              }
            }}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-black rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
          >
            Yes, Continue
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-black rounded-lg transition-colors">Cancel</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleDeleteWebsite = async (slug: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-white">Are you sure you want to delete website {slug}?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/websites/${slug}/?all=true`, { withCredentials: true });
                setWebsites(prev => prev.filter(w => w.slug !== slug));
                if (selectedProjectDetails?.slug === slug) {
                  setSelectedProjectDetails(null);
                }
                toast.success('Website deleted successfully.');
              } catch (err) {
                console.error(err);
                toast.error('Failed to delete website.');
              }
            }}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-black rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
          >
            Yes, Delete
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-black rounded-lg transition-colors">Cancel</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleSaveBlog = async () => {
    if (!blogFormData.title || !blogFormData.content) {
      toast.error('Title and Content are required.');
      return;
    }
    setIsSavingBlog(true);
    try {
      if (editingBlog) {
        const res = await axios.put(`/api/marketing/blogs/${editingBlog.id}/`, blogFormData, { withCredentials: true });
        setBlogs(blogs.map(b => b.id === editingBlog.id ? res.data : b));
        toast.success('Blog updated successfully.');
      } else {
        const res = await axios.post('/api/marketing/blogs/', blogFormData, { withCredentials: true });
        setBlogs([res.data, ...blogs]);
        toast.success('Blog created successfully.');
      }
      setIsBlogModalOpen(false);
      setEditingBlog(null);
      setBlogFormData({ title: '', content: '', image_url: '', published: false });
    } catch (err) {
      console.error(err);
      toast.error('Failed to save blog.');
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`/api/marketing/blogs/${id}/`, { withCredentials: true });
      setBlogs(blogs.filter(b => b.id !== id));
      toast.success('Blog deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete blog.');
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/api/websites/physical-orders/${id}/`, { status }, { withCredentials: true });
      setPhysicalOrders(physicalOrders.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrderDetails && selectedOrderDetails.id === id) {
        setSelectedOrderDetails({ ...selectedOrderDetails, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
   
  const filteredWebsites = websites
    .filter(w => w.slug.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOrders = physicalOrders.filter(o => o.website_slug.toLowerCase().includes(searchQuery.toLowerCase()) || o.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Revenue Analytics
  const subscriptionTransactions = users.filter(u => u.subscription_details).map(u => ({
    id: `sub_${u.id}`,
    email: u.email,
    type: 'Subscription',
    planType: u.subscription_details?.plan_type,
    amount: parseFloat(u.subscription_details?.amount || '0'),
    status: u.subscription_details?.status,
    paymentId: u.subscription_details?.razorpay_payment_id,
    date: u.subscription_details?.created_at
  }));

  const orderTransactions = physicalOrders.filter(o => o.payment_status !== 'FAILED').map(o => ({
    id: `ord_${o.id}`,
    email: o.user_email || o.email,
    type: 'QR Order',
    planType: 'QR Stickers',
    amount: 100, // Fixed price for physical QR order
    status: o.payment_status || 'SUCCESS',
    paymentId: o.razorpay_payment_id,
    date: o.created_at
  }));

  const allTransactions = [...subscriptionTransactions, ...orderTransactions].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  const totalRevenue = allTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const subscriptionRevenue = subscriptionTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const qrRevenue = orderTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Overview Analytics
  const totalVisitors = websites.reduce((acc, curr) => acc + (curr.visitors_count || 0), 0);
   
  const activeUsers = users.filter(u => u.is_active).length;
   
  const proUsers = users.filter(u => u.membership.toUpperCase().includes('PRO')).length;

  // ── Command Center helpers ──────────────────────────────────────────────
  const pendingOrders = physicalOrders.filter(o => o.status === 'PENDING').length;
  const liveSites = websites.filter(w => w.published).length;
  const draftSites = websites.length - liveSites;
  const blockedSites = websites.filter(w => w.is_blocked).length;
  const recentSites = [...websites].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 5);
  const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeAgo = (iso?: string) => {
    if (!iso) return '';
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 60) return mins <= 1 ? 'just now' : `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return days < 30 ? `${days}d ago` : new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  const avatarTones = ['bg-[#fde7d6] text-[#b8673a]', 'bg-emerald-100 text-emerald-700', 'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700', 'bg-amber-100 text-amber-700'];
  const toneFor = (s: string) => avatarTones[(s.charCodeAt(0) || 0) % avatarTones.length];

  type AdminTab = typeof activeTab;
  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: { title: 'Command Center', subtitle: '' },
    revenue: { title: 'Revenue', subtitle: 'Subscriptions and QR order payments' },
    users: { title: 'Users', subtitle: 'Accounts, plans and access' },
    websites: { title: 'Websites', subtitle: 'Every site built on Jaalam' },
    templates: { title: 'Templates', subtitle: 'Theme library by category' },
    blogs: { title: 'Blogs', subtitle: 'Posts on the Jaalam blog' },
    notifications: { title: 'Support Tickets', subtitle: 'Messages from users' },
    orders: { title: 'QR Orders', subtitle: 'Physical QR sticker orders' },
  };

  const navSections: { label: string; items: { tab: AdminTab; label: string; icon: ReactNode; badge?: string | number; alert?: boolean }[] }[] = [
    {
      label: 'Insights',
      items: [
        { tab: 'overview', label: 'Overview', icon: <Activity size={18} /> },
        { tab: 'revenue', label: 'Revenue', icon: <DollarSign size={18} />, badge: `₹${totalRevenue.toLocaleString()}` },
      ],
    },
    {
      label: 'Manage',
      items: [
        { tab: 'users', label: 'Users', icon: <Users size={18} />, badge: users.length },
        { tab: 'websites', label: 'Websites', icon: <Globe size={18} />, badge: websites.length },
        { tab: 'templates', label: 'Templates', icon: <LayoutTemplate size={18} />, badge: Object.values(categoryThemes).flat().length },
        { tab: 'blogs', label: 'Blogs', icon: <FileText size={18} />, badge: blogs.length },
      ],
    },
    {
      label: 'Operations',
      items: [
        { tab: 'notifications', label: 'Support Tickets', icon: <MessageSquare size={18} /> },
        { tab: 'orders', label: 'QR Orders', icon: <Printer size={18} />, badge: pendingOrders || undefined, alert: pendingOrders > 0 },
      ],
    },
  ];

  const goTab = (tab: AdminTab) => { setActiveTab(tab); setMobileMenuOpen(false); setSearchQuery(''); };

  const neuCard = 'bg-[var(--neu-bg)] rounded-[24px] shadow-[8px_8px_18px_var(--neu-shadow-dark),-8px_-8px_18px_var(--neu-shadow-light)]';
  const neuInset = 'shadow-[inset_3px_3px_6px_var(--neu-shadow-dark),inset_-3px_-3px_6px_var(--neu-shadow-light)]';

  if (!user?.is_superuser) return null;

  return (
    <div className="min-h-screen bg-[var(--neu-bg)] flex text-slate-800 font-sans">

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] md:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[264px] flex flex-col bg-[var(--neu-bg)] px-[18px] py-[22px] transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          md:translate-x-0 md:static md:shrink-0 md:my-4 md:ml-4 md:h-[calc(100vh-32px)] md:rounded-[26px] md:shadow-[10px_10px_22px_var(--neu-shadow-dark),-10px_-10px_22px_var(--neu-shadow-light)]`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between mb-7 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-[13px] flex items-center justify-center font-black text-[17px] text-[#d08757] bg-[var(--neu-bg)] shrink-0 shadow-[6px_7px_13px_rgba(212,206,199,0.72),-6px_-7px_13px_rgba(255,255,255,0.98)]">
              J
              <span className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#e49b6b] to-[#d08757] text-white flex items-center justify-center ring-2 ring-[var(--neu-bg)]">
                <ShieldCheck size={11} />
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-[16px] text-slate-800 tracking-tight leading-[1.2]">Jaalam</h2>
              <p className="text-[10px] font-semibold text-[#d08757] tracking-[0.6px] uppercase mt-[1px]">Admin Console</p>
            </div>
          </div>
          <button className="md:hidden w-8 h-8 rounded-[10px] flex items-center justify-center text-slate-500 hover:text-[#d08757]" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide space-y-5 pb-4">
          {navSections.map(section => (
            <div key={section.label}>
              <div className="text-[10px] font-bold tracking-[1.5px] text-slate-400 uppercase mx-2 mb-2">{section.label}</div>
              <div className="flex flex-col gap-1.5">
                {section.items.map(item => {
                  const isActive = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => goTab(item.tab)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-[14px] px-[14px] py-[11px] rounded-xl text-[14px] font-medium transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? 'text-white bg-gradient-to-br from-[#e49b6b] to-[#d08757] shadow-md'
                          : 'text-slate-500 hover:text-slate-800 hover:shadow-[inset_3px_3px_6px_var(--neu-shadow-dark),inset_-3px_-3px_6px_var(--neu-shadow-light)]'
                      }`}
                    >
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
                      <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${
                          item.alert ? 'bg-rose-500 text-white' : isActive ? 'bg-white/25 text-white' : 'bg-[#efe6dc] text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin profile + exit */}
        <div className={`rounded-2xl p-3 ${neuInset}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e49b6b] to-[#d08757] text-white font-black flex items-center justify-center text-sm shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">{user?.username}</div>
              <div className="text-[11px] font-medium text-slate-500">System admin</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold text-slate-600 bg-[var(--neu-bg)] shadow-[4px_4px_9px_var(--neu-shadow-dark),-4px_-4px_9px_var(--neu-shadow-light)] hover:text-[#d08757] active:scale-[0.98] transition-all"
          >
            <LogOut size={15} /> Exit admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
        {/* TOP BAR */}
        <header className="shrink-0 flex items-center justify-between gap-4 px-5 md:px-10 pt-6 md:pt-8 pb-4 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 bg-[var(--neu-bg)] shadow-[4px_4px_9px_var(--neu-shadow-dark),-4px_-4px_9px_var(--neu-shadow-light)]`}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-[28px] font-black text-slate-900 tracking-tight leading-tight truncate">
                {activeTab === 'overview' ? `${greeting}, ${user?.username}` : tabTitles[activeTab].title}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5 truncate">
                {activeTab === 'overview' ? `${todayLabel} · here's how Jaalam is doing` : tabTitles[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTab !== 'overview' && activeTab !== 'notifications' && (
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${tabTitles[activeTab].title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 w-64 rounded-xl bg-[var(--neu-bg)] border-none text-sm outline-none focus:ring-2 focus:ring-[#e49b6b]/40 transition-all ${neuInset}`}
                />
              </div>
            )}
            <span className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${maintenanceMode ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
              <span className={`w-2 h-2 rounded-full ${maintenanceMode ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
              {maintenanceMode ? 'Maintenance on' : 'All systems live'}
            </span>
          </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto px-5 md:px-10 pb-10 pt-2">
          {loading ? (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {[0, 1, 2, 3].map(i => <div key={i} className={`${neuCard} h-36`} />)}
              <div className={`${neuCard} col-span-1 md:col-span-4 h-[360px]`} />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">


              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  {/* KPI CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[
                      {
                        label: 'Users', value: users.length.toLocaleString(), icon: <Users size={20} />, tone: 'bg-sky-100 text-sky-600',
                        meta: `${activeUsers} active · ${proUsers} on Pro`, bar: pct(activeUsers, users.length), barTone: 'bg-sky-400', onClick: () => goTab('users'),
                      },
                      {
                        label: 'Live websites', value: liveSites.toLocaleString(), icon: <Globe size={20} />, tone: 'bg-emerald-100 text-emerald-600',
                        meta: `${pct(liveSites, websites.length)}% of ${websites.length} created`, bar: pct(liveSites, websites.length), barTone: 'bg-emerald-400', onClick: () => goTab('websites'),
                      },
                      {
                        label: 'Visitors', value: totalVisitors.toLocaleString(), icon: <TrendingUp size={20} />, tone: 'bg-violet-100 text-violet-600',
                        meta: `Across ${websites.length} site${websites.length === 1 ? '' : 's'}`, bar: undefined, barTone: '', onClick: () => goTab('websites'),
                      },
                    ].map(card => (
                      <button key={card.label} type="button" onClick={card.onClick} className={`${neuCard} p-6 text-left group transition-transform hover:-translate-y-0.5`}>
                        <div className="flex items-center justify-between mb-5">
                          <span className="text-[13px] font-bold text-slate-500">{card.label}</span>
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.tone}`}>{card.icon}</span>
                        </div>
                        <div className="text-[34px] leading-none font-black text-slate-900 tracking-tight tabular-nums">{card.value}</div>
                        <div className="mt-3 text-[13px] font-medium text-slate-500">{card.meta}</div>
                        {card.bar !== undefined && (
                          <div className={`mt-4 h-1.5 rounded-full overflow-hidden ${neuInset}`}>
                            <div className={`h-full rounded-full ${card.barTone} transition-all duration-700`} style={{ width: `${card.bar}%` }} />
                          </div>
                        )}
                      </button>
                    ))}

                    {/* Revenue: the highlight card */}
                    <button
                      type="button"
                      onClick={() => goTab('revenue')}
                      className="relative overflow-hidden rounded-[24px] p-6 text-left text-white bg-gradient-to-br from-[#e49b6b] to-[#c4764a] shadow-[8px_8px_18px_var(--neu-shadow-dark),-8px_-8px_18px_var(--neu-shadow-light)] transition-transform hover:-translate-y-0.5"
                    >
                      <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-white/10" aria-hidden />
                      <div className="absolute right-8 -top-10 w-24 h-24 rounded-full bg-white/10" aria-hidden />
                      <div className="relative flex items-center justify-between mb-5">
                        <span className="text-[13px] font-bold text-white/85">Total revenue</span>
                        <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20"><DollarSign size={20} /></span>
                      </div>
                      <div className="relative text-[34px] leading-none font-black tracking-tight tabular-nums">₹{totalRevenue.toLocaleString()}</div>
                      <div className="relative mt-3 text-[13px] font-medium text-white/85">
                        ₹{subscriptionRevenue.toLocaleString()} plans · ₹{qrRevenue.toLocaleString()} QR
                      </div>
                      <div className="relative mt-4 h-1.5 rounded-full bg-white/25 overflow-hidden">
                        <div className="h-full rounded-full bg-white" style={{ width: `${pct(subscriptionRevenue, totalRevenue)}%` }} />
                      </div>
                    </button>
                  </div>

                  {/* ATTENTION + SYSTEM CONTROLS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`${neuCard} p-6 lg:col-span-2`}>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-black text-slate-900">Needs your attention</h3>
                        <span className="text-xs font-semibold text-slate-400">Updated just now</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Pending QR orders', value: pendingOrders, hint: pendingOrders ? 'Waiting to be printed' : 'All caught up', icon: <Printer size={18} />, hot: pendingOrders > 0, onClick: () => goTab('orders') },
                          { label: 'Draft websites', value: draftSites, hint: 'Created but not published', icon: <FileText size={18} />, hot: false, onClick: () => { setWebsiteFilterStatus('draft'); goTab('websites'); } },
                          { label: 'Blocked websites', value: blockedSites, hint: blockedSites ? 'Hidden from visitors' : 'None blocked', icon: <ShieldBan size={18} />, hot: false, onClick: () => goTab('websites') },
                        ].map(item => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            className={`group text-left rounded-2xl p-4 transition-all ${neuInset} hover:bg-white/40`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.hot ? 'bg-rose-100 text-rose-600' : 'bg-[#fde7d6] text-[#c4764a]'}`}>{item.icon}</span>
                              <ChevronRight size={16} className="text-slate-300 group-hover:text-[#d08757] group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <div className={`mt-3 text-2xl font-black tabular-nums ${item.hot ? 'text-rose-600' : 'text-slate-900'}`}>{item.value}</div>
                            <div className="text-[13px] font-bold text-slate-700">{item.label}</div>
                            <div className="text-xs font-medium text-slate-400 mt-0.5">{item.hint}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`${neuCard} p-6 flex flex-col`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-black text-slate-900">Maintenance mode</h3>
                          <p className="text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">
                            Takes every site and the builder offline for everyone except system admins.
                          </p>
                        </div>
                        <button
                          onClick={handleToggleMaintenance}
                          role="switch"
                          aria-checked={maintenanceMode}
                          aria-label="Toggle maintenance mode"
                          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-rose-500' : neuInset}`}
                        >
                          <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className={`mt-auto pt-5`}>
                        <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold ${maintenanceMode ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {maintenanceMode ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                          {maintenanceMode ? 'Platform is in maintenance' : 'Platform is live for everyone'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RECENT ACTIVITY */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`${neuCard} p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-black text-slate-900">Recent websites</h3>
                        <button type="button" onClick={() => goTab('websites')} className="text-[13px] font-bold text-[#d08757] hover:text-[#b8673a] flex items-center gap-0.5">
                          View all <ChevronRight size={15} />
                        </button>
                      </div>
                      {recentSites.length === 0 ? (
                        <div className="py-10 text-center text-sm font-medium text-slate-400">No websites yet</div>
                      ) : (
                        <ul className="divide-y divide-[#ece3d9]">
                          {recentSites.map(site => (
                            <li key={site.id}>
                              <button type="button" onClick={() => setSelectedProjectDetails(site)} className="w-full flex items-center gap-3 py-3 text-left group">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${toneFor(site.slug)}`}>
                                  {site.slug[0]?.toUpperCase()}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block font-bold text-slate-900 truncate group-hover:text-[#c4764a] transition-colors">{site.slug}</span>
                                  <span className="block text-xs font-medium text-slate-500 truncate">{site.business_type}{site.theme ? ` · ${site.theme}` : ''}</span>
                                </span>
                                <span className="hidden sm:block text-xs font-medium text-slate-400 shrink-0">{timeAgo(site.created_at)}</span>
                                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  site.is_blocked ? 'bg-rose-50 text-rose-600' : site.published ? 'bg-emerald-50 text-emerald-700' : 'bg-[#efe6dc] text-slate-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${site.is_blocked ? 'bg-rose-500' : site.published ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                  {site.is_blocked ? 'Blocked' : site.published ? 'Live' : 'Draft'}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className={`${neuCard} p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-black text-slate-900">Newest users</h3>
                        <button type="button" onClick={() => goTab('users')} className="text-[13px] font-bold text-[#d08757] hover:text-[#b8673a] flex items-center gap-0.5">
                          View all <ChevronRight size={15} />
                        </button>
                      </div>
                      {users.length === 0 ? (
                        <div className="py-10 text-center text-sm font-medium text-slate-400">No users yet</div>
                      ) : (
                        <ul className="divide-y divide-[#ece3d9]">
                          {users.slice(0, 5).map(u => (
                            <li key={u.id}>
                              <button
                                type="button"
                                onClick={() => { setSelectedUserForWebsites(u); goTab('websites'); }}
                                className="w-full flex items-center gap-3 py-3 text-left group"
                                title="View this user's websites"
                              >
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${toneFor(u.username)}`}>
                                  {u.username[0]?.toUpperCase()}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 truncate group-hover:text-[#c4764a] transition-colors">{u.username}</span>
                                    {u.is_superuser && <ShieldCheck size={14} className="text-[#d08757] shrink-0" />}
                                    {u.is_test_user && <Beaker size={13} className="text-violet-500 shrink-0" />}
                                  </span>
                                  <span className="block text-xs font-medium text-slate-500 truncate">{u.email || 'No email'}</span>
                                </span>
                                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                                  u.membership.toUpperCase().includes('PRO') || u.membership.toUpperCase().includes('PREMIUM')
                                    ? 'bg-gradient-to-br from-[#e49b6b] to-[#d08757] text-white'
                                    : u.membership.toUpperCase() === 'FREE' ? 'bg-[#efe6dc] text-slate-600' : 'bg-[#fde7d6] text-[#b8673a]'
                                }`}>
                                  {u.membership}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TAB: USERS */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-primary-500" /> All Users</h3>
                    <button
                      onClick={() => setMessagingUser('ALL')}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-bold rounded-lg shadow-md shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <MessageSquare size={16} /> Broadcast Message
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">User</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider whitespace-nowrap">Membership</th>
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
                              <div className="flex flex-col gap-1">
                                <span className={`inline-flex w-fit px-2 py-0.5 rounded text-xs font-bold ${u.membership === 'PREMIUM' ? 'bg-amber-100 text-amber-700' :
                                    u.membership === 'BUSINESS' ? 'bg-blue-100 text-blue-700' :
                                      u.membership === 'STARTER' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-slate-100 text-slate-700'
                                  }`}>
                                  {u.plan?.name || u.membership}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {u.plan?.period === 'LIFETIME' ? 'Lifetime' : u.plan?.expires_at ? `until ${new Date(u.plan.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                                </span>
                                <select
                                  aria-label={`Set plan for ${u.username}`}
                                  value=""
                                  onChange={(e) => handleSetPlan(u.id, e.target.value)}
                                  className="mt-1 w-fit rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-600"
                                >
                                  <option value="">Set plan…</option>
                                  <option value="TEST">Free</option>
                                  {['STARTER', 'BUSINESS', 'PREMIUM'].map(code => (
                                    <optgroup key={code} label={code.charAt(0) + code.slice(1).toLowerCase()}>
                                      <option value={`${code}:30`}>30 days</option>
                                      <option value={`${code}:365`}>1 year</option>
                                      <option value={`${code}:lifetime`}>Lifetime</option>
                                    </optgroup>
                                  ))}
                                </select>
                                {u.subscription_details && u.subscription_details.razorpay_payment_id && u.membership !== 'STARTER' && !u.is_test_user && (
                                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                                    <span className="font-bold">PAY:</span> {u.subscription_details.razorpay_payment_id}
                                    {u.subscription_details.status === 'SUCCESS' && <span className="ml-1 text-emerald-500 font-bold">(Paid ₹{u.subscription_details.amount || '0'})</span>}
                                  </div>
                                )}
                              </div>
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
                                  onClick={() => setMessagingUser(u)}
                                  className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                  title="Send Message"
                                >
                                  <MessageSquare size={18} />
                                </button>
                                <button
                                  onClick={() => setSelectedUserForWebsites(u)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View User's Websites"
                                >
                                  <Globe size={18} />
                                </button>
                                <button
                                  onClick={() => handleToggleRoleUser(u.id)}
                                  disabled={u.is_superuser && users.filter(a => a.is_superuser).length <= 1}
                                  className={`p-2 rounded-lg transition-colors ${u.is_superuser && users.filter(a => a.is_superuser).length <= 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'}`}
                                  title={u.is_superuser && users.filter(a => a.is_superuser).length <= 1 ? "Cannot demote last admin" : u.is_superuser ? "Demote to User" : "Promote to Admin"}
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
                                  disabled={u.is_superuser && users.filter(a => a.is_superuser).length <= 1}
                                  className={`p-2 rounded-lg transition-colors ${u.is_superuser && users.filter(a => a.is_superuser).length <= 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                                  title={u.is_superuser && users.filter(a => a.is_superuser).length <= 1 ? "Cannot delete last admin" : "Delete User"}
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

              {/* TAB: TEMPLATES */}
              {activeTab === 'templates' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                    <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-black text-slate-800 flex flex-wrap items-center gap-2">
                          <span className="truncate">Global Templates</span>
                          <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">{Object.values(categoryThemes).flat().length} Total</span>
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                      <select
                        value={templateFilterStatus}
                        onChange={(e) => setTemplateFilterStatus(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 font-bold shadow-sm"
                      >
                        <option value="All">All Categories</option>
                        {Object.keys(categoryThemes).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Object.entries(categoryThemes).flatMap(([category, themes]) => 
                        themes.map(theme => ({ category, theme }))
                      )
                      .filter(item => templateFilterStatus === 'All' || item.category === templateFilterStatus)
                      .filter(item => item.theme.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item, idx) => (
                        <div key={`${item.category}-${item.theme}-${idx}`} className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                          <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                            <ThemeThumbnail theme={item.theme} category={item.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to delete the "${item.theme}" template?`)) {
                                    categoryThemes[item.category] = categoryThemes[item.category].filter(t => t !== item.theme);
                                    setWebsites([...websites]); // force re-render
                                    toast.success('Template deleted successfully');
                                  }
                                }}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm transition-colors"
                                title="Delete Template"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col justify-between h-24">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[9px] font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                                  {item.category}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-slate-800 tracking-tight">{item.theme}</h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BLOGS */}
              {activeTab === 'blogs' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <FileText className="text-primary-500" /> Platform Blogs
                    </h2>
                    <button
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogFormData({ title: '', content: '', image_url: '', published: false });
                        setIsBlogModalOpen(true);
                      }}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} /> Create Blog
                    </button>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-slate-200">
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider">Title</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="py-4 px-6 font-bold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {blogs.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-500 font-bold">No blogs found.</td></tr>
                        ) : blogs.map(blog => (
                          <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 font-bold text-slate-800">{blog.title}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${blog.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-slate-600">
                              {new Date(blog.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingBlog(blog);
                                    setBlogFormData({ title: blog.title, content: blog.content, image_url: blog.image_url || '', published: blog.published });
                                    setIsBlogModalOpen(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Blog"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Blog"
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

          {activeTab === 'revenue' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <DollarSign className="text-emerald-500 w-8 h-8" />
                    Revenue Management
                  </h1>
                  <p className="text-slate-500 mt-1 font-medium text-sm">View all subscription payments and revenue details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</div>
                  <div className="text-4xl font-black text-slate-800">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-emerald-500 font-bold text-xs mt-2 flex items-center gap-1"><TrendingUp size={14} /> Lifetime earnings</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-cyan-500"></div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Subscriptions</div>
                  <div className="text-4xl font-black text-slate-800">₹{subscriptionRevenue.toLocaleString()}</div>
                  <div className="text-cyan-500 font-bold text-xs mt-2 flex items-center gap-1"><Users size={14} /> {subscriptionTransactions.length} payments</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-orange-500"></div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">QR Orders</div>
                  <div className="text-4xl font-black text-slate-800">₹{qrRevenue.toLocaleString()}</div>
                  <div className="text-orange-500 font-bold text-xs mt-2 flex items-center gap-1"><Printer size={14} /> {orderTransactions.length} orders</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">User Email</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Item/Plan</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Payment ID</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allTransactions.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500 italic font-medium">No payments recorded yet.</td></tr>
                      ) : (
                        allTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{tx.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap ${tx.type === 'Subscription' ? 'bg-cyan-100 text-cyan-700' : 'bg-orange-100 text-orange-700'}`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700">{tx.planType}</td>
                            <td className="px-6 py-4 font-black text-emerald-600">₹{tx.amount}</td>
                            <td className="px-6 py-4">
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap"><CheckCircle2 size={12} />{tx.status}</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.paymentId || 'N/A'}</td>
                            <td className="px-6 py-4 font-medium text-slate-600">{new Date(tx.date || '').toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
                                o.status === 'SHIPPED' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
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
              <NotificationsPage isAdminView={true} />
            </div>
          )}

          {/* SEND MESSAGE MODAL */}
          {messagingUser && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-8 duration-300">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 shadow-inner">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">
                        {messagingUser === 'ALL' ? 'Broadcast Message' : 'Send Message'}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {messagingUser === 'ALL' ? `To: All ${users.length} Users` : `To: ${(messagingUser as AdminUser).username} (${(messagingUser as AdminUser).email})`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setMessagingUser(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Subject</label>
                    <input
                      type="text"
                      value={messageTitle}
                      onChange={e => setMessageTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-medium"
                      placeholder="e.g. Account Update"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Message</label>
                    <div className="relative">
                      <textarea
                        value={messageContent}
                        onChange={e => setMessageContent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-4 py-3 pb-12 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all min-h-[150px] resize-none"
                        placeholder="Type your message to the user here..."
                      ></textarea>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: Event) => {
                            const target = e.target as HTMLInputElement;
                            const file = target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64 = reader.result as string;
                                setMessageContent(prev => prev + (prev ? '\n\n' : '') + `[ATTACHMENT:${file.name}:${base64}]`);
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="absolute bottom-3 left-3 text-slate-400 hover:text-cyan-500 transition-colors p-2 bg-white rounded-lg border border-slate-200 hover:bg-cyan-50 shadow-sm"
                        title="Attach Image/Screenshot"
                      >
                        <Paperclip size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex justify-end gap-3">
                  <button onClick={() => setMessagingUser(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !messageTitle.trim() || !messageContent.trim()}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSendingMessage ? 'Sending...' : <><Send size={16} /> Send Message</>}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Printer className="text-primary-500" /> Order #{selectedOrderDetails.id}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                For website:
                <a
                  href={getWebsiteUrl(selectedOrderDetails.website_slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-bold hover:underline flex items-center gap-1"
                >
                  {selectedOrderDetails.website_slug}
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>

            <div className="flex flex-col md:flex-row overflow-y-auto">
              <div className="p-6 md:w-2/3 space-y-6 md:border-r border-slate-100">
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

              <div className="p-6 md:w-1/3 bg-slate-50/50 space-y-6">
                <h4 className="font-black text-slate-800 border-b border-slate-200 pb-2 mb-4">Payment Info</h4>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payment Status</div>
                  <div className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm ${selectedOrderDetails.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {selectedOrderDetails.payment_status || 'PENDING'}
                  </div>
                </div>
                {(selectedOrderDetails.razorpay_order_id || selectedOrderDetails.razorpay_payment_id) && (
                  <div className="space-y-4">
                    {selectedOrderDetails.razorpay_payment_id && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Razorpay Payment ID</div>
                        <div className="font-mono text-slate-700 text-xs break-all bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">{selectedOrderDetails.razorpay_payment_id}</div>
                      </div>
                    )}
                    {selectedOrderDetails.razorpay_order_id && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Razorpay Order ID</div>
                        <div className="font-mono text-slate-700 text-xs break-all bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">{selectedOrderDetails.razorpay_order_id}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center gap-4 shrink-0">
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
                  value={getWebsiteUrl(selectedWebsite.slug)}
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
                  href={getWebsiteUrl(selectedProjectDetails.slug)}
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

      {/* Modals */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[120]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={blogFormData.title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Content *</label>
                <textarea
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none min-h-[200px]"
                  placeholder="Enter blog content (you can use basic HTML)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  value={blogFormData.image_url}
                  onChange={(e) => setBlogFormData({ ...blogFormData, image_url: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={blogFormData.published}
                  onChange={(e) => setBlogFormData({ ...blogFormData, published: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                />
                <label htmlFor="published" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Publish immediately
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlog}
                disabled={isSavingBlog}
                className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingBlog ? 'Saving...' : 'Save Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isTemplateBuilderOpen && (
        <TemplateBuilderModal onClose={() => setIsTemplateBuilderOpen(false)} />
      )}
    </div>
  );
}
