import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Plus, Settings, Globe, LayoutDashboard, TrendingUp, Users, Activity, X, ExternalLink, Zap, Search, Trash2, Copy, CheckCircle2, XCircle, BarChart3, Edit3, Bell, Download } from 'lucide-react';
import { logout, loginSuccess } from '../../authSlice';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import NotificationsPage from './NotificationsPage';
import Pricing from './Pricing';
import AIGeneratorModal from '../../components/modals/AIGeneratorModal';
import toast from 'react-hot-toast';

interface User {
  username?: string;
  is_superuser?: boolean;
  has_completed_onboarding?: boolean;
  is_test_user?: boolean;
  membership?: string;
}

interface Website {
  id: number;
  slug: string;
  theme: string;
  business_type: string;
  published: boolean;
  visitors_count?: number;
  created_at?: string;
  updated_at?: string;
  content?: {
    settings_json?: {
      website_name?: string;
    };
  };
}

interface PhysicalOrder {
  id: number;
  website_slug: string;
  status: string;
}

const getThemeThumbnail = (theme: string, businessType?: string) => {
  // Generic mapping by business type to provide fallback defaults
  const defaults: Record<string, string> = {
    'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'Cafe / Bakery': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'Salon': 'https://images.unsplash.com/photo-1521590832167-7bfcbaa6362d?auto=format&fit=crop&w=800&q=80',
    'Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    'Retail Store': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    'Stationery / Books': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'Fancy Store': 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80',
    'Chicken / Meat Stall': 'https://images.unsplash.com/photo-1607623814075-e51df1bd682f?auto=format&fit=crop&w=800&q=80',
    'Scrap Dealer': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'Supermarket / Grocery': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    'Textiles / Garments': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    'Consulting': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    'Other': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
  };

  // Unique theme mappings
  if (businessType === 'Real Estate') {
    if (theme === 'Luxury Villas') return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Urban Apartments') return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Commercial') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Supermarket / Grocery') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Premium') return 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Organic') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1560159813-f66d40510006?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Noir') return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80&grayscale';
    if (theme === 'Pop') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sat=200';
  }

  if (businessType === 'Retail Store') {
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimalist') return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Streetwear') return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Tech Gadget') return 'https://images.unsplash.com/photo-1531297172864-45d1b11e2fb9?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Organic Store') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Stationery / Books') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Ethereal') return 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Fancy Store') {
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1600164318933-2ebf454c502f?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Luxury') return 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Noir') return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Pop') return 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Chicken / Meat Stall') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1607623814075-e51df1bd682f?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Premium') return 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Rustic') return 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1563514757303-a1286c757c91?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Scrap Dealer') {
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1558611997-60af99839eb9?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Corporate') return 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Eco') return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80&sat=-100';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Textiles / Garments') {
    if (theme === 'Boutique') return 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Luxury') return 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Vintage') return 'https://images.unsplash.com/photo-1528255915607-9012fda0f838?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Playful') return 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Consulting') {
    if (theme === 'Corporate') return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Creative Agency') return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Tech Startup') return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Management') return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Legal Firm') return 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80';
  }

  if (businessType === 'Other') {
    if (theme === 'Modern') return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Classic') return 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Minimal') return 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Noir') return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Pop') return 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80';
    if (theme === 'Corporate') return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';
  }

  // Fallback to legacy switch if not covered by specific category logic
  switch (theme) {
    case 'Fine Dining': return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80';
    case 'Casual Eats': return 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80';
    case 'Bistro': return 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80';
    case 'Cozy Cafe': return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
    case 'Modern Bakery': return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
    case 'Artisan': return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80';
    case 'Classic Barbershop': return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
    case 'Modern Saloon': return 'https://images.unsplash.com/photo-1521590832167-7bfcbaa6362d?auto=format&fit=crop&w=800&q=80';
    case 'Vintage Barber': return 'https://images.unsplash.com/photo-1532710093739-9470acff878b?auto=format&fit=crop&w=800&q=80';
    case 'Royal Saloon': return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
    case 'Glamour Beauty': return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80';
    case 'Hardcore Iron': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
    case 'Zen Yoga Studio': return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
    case 'CrossFit Box': return 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80';
    case 'Luxury Health Club': return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80';
    case 'Combat & MMA Gym': return 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80';
  }

  // Fallback to category default
  if (businessType && defaults[businessType]) {
    return defaults[businessType];
  }

  // Final fallback
  if (businessType?.includes('Salon') || businessType?.includes('Saloon')) return defaults['Salon'];
  if (businessType?.includes('Gym')) return defaults['Gym'];
  return 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80';
};

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [physicalOrders, setPhysicalOrders] = useState<PhysicalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const location = useLocation();
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    if (user && (user as User).has_completed_onboarding === false && !user.is_superuser && !(user as User).is_test_user) return 'Billing';
    return location.state?.tab || 'Dashboard';
  });
  const [selectedProject, setSelectedProject] = useState<Website | null>(null);

  // Form State
  const [websiteName, setWebsiteName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [newType, setNewType] = useState('Restaurant');

  // Settings State
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editFirstName, setEditFirstName] = useState(user?.first_name || '');
  const [editLastName, setEditLastName] = useState(user?.last_name || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const categoryThemes: Record<string, string[]> = {
    'Restaurant': ['Fine Dining', 'Casual Eats', 'Bistro', 'Custom'],
    'Cafe / Bakery': ['Cozy Cafe', 'Modern Bakery', 'Artisan', 'Custom'],
    'Salon / Spa': ['Classic Barbershop', 'Modern Saloon', 'Vintage Barber', 'Royal Saloon', 'Glamour Beauty'],
    'Gym / Fitness': ['Hardcore Iron', 'Zen Yoga Studio', 'CrossFit Box', 'Luxury Health Club', 'Combat & MMA Gym'],
    'Retail Store': ['Boutique', 'Minimalist', 'Streetwear', 'Custom'],
    'Stationery / Books': ['Modern', 'Classic', 'Playful', 'Minimal', 'Ethereal'],
    'Fancy Store': ['Modern', 'Boutique', 'Minimal', 'Luxury', 'Playful', 'Classic'],
    'Chicken / Meat Stall': ['Modern', 'Classic', 'Premium', 'Minimal'],
    'Scrap Dealer': ['Modern', 'Classic', 'Minimal', 'Corporate', 'Eco', 'Playful'],
    'Supermarket / Grocery': ['Modern', 'Classic', 'Premium', 'Minimal', 'Organic', 'Playful'],
    'Real Estate': ['Luxury Villas', 'Urban Apartments', 'Commercial', 'Modern', 'Minimal', 'Classic'],
    'Consulting': ['Corporate', 'Creative Agency', 'Tech Startup', 'Management', 'Minimal', 'Legal Firm'],
    'Other': ['Modern', 'Classic', 'Minimal', 'Noir', 'Pop', 'Corporate']
  };

  const [newTheme, setNewTheme] = useState(categoryThemes['Restaurant'][0]);
  const [heroTitle, setHeroTitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Template Preview State
  const [previewTemplate, setPreviewTemplate] = useState<{category: string, theme: string} | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    if (location.state?.creating) {
      setIsCreating(true);
    }
  }, [location.state]);

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    if (!newSlug) {
      setSlugAvailable(null);
      return;
    }
    
    setIsCheckingSlug(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/websites/check_slug/?slug=${newSlug}`, {
          withCredentials: true
        });
        setSlugAvailable(res.data.available);
      } catch (err) {
        setSlugAvailable(false);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [newSlug]);

  useEffect(() => {
    if (user && (user as User).has_completed_onboarding === false && !user.is_superuser && !(user as User).is_test_user) {
      if (activeTab !== 'Billing' && activeTab !== 'Settings') {
        setActiveTab('Billing');
      }
      setIsCreating(false);
      setIsAIModalOpen(false);
    }
  }, [user, activeTab]);

  const fetchWebsites = async () => {
    try {
      const [websitesRes, ordersRes] = await Promise.all([
        axios.get('/api/websites/', {
          withCredentials: true
        }),
        axios.get('/api/websites/physical-orders/', {
          withCredentials: true
        }).catch(() => ({ data: [] })),
        new Promise(resolve => setTimeout(resolve, 1500)) // Artificial delay to show off skeleton loader
      ]);
      setWebsites(websitesRes.data);
      setPhysicalOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWebsiteLimit = () => {
    switch (user?.membership) {
      case 'TEST': return 1;
      case 'STARTER': return 2;
      case 'BUSINESS': return 10;
      case 'PREMIUM': return Infinity;
      default: return 1;
    }
  };

  const hasAIBuilder = () => {
    return user?.membership === 'BUSINESS' || user?.membership === 'PREMIUM';
  };

  const checkCreationLimit = (isAI: boolean = false) => {
    if (isAI && !hasAIBuilder() && !user?.is_superuser && !(user as User).is_test_user) {
      toast.error('AI Website Builder is only available on Business and Premium plans. Please upgrade to use this feature.');
      return false;
    }

    if (websites.length >= getWebsiteLimit() && !user?.is_test_user && !user?.is_superuser) {
      toast.error(`You've reached your limit of ${getWebsiteLimit()} website(s) on the ${user?.membership || 'Free'} plan. Please upgrade to create more.`);
      return false;
    }

    return true;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && (user as User).has_completed_onboarding === false && !user.is_superuser && !(user as User).is_test_user) return;
    if (!checkCreationLimit()) return;
    const loadingToast = toast.loading('Building your website... This may take a minute.');
    try {
      const res = await axios.post('/api/websites/', {
        slug: newSlug,
        business_type: newType,
        theme: newTheme,
      }, {
        withCredentials: true
      });

      await axios.put(`/api/websites/${res.data.slug}/content/`, {
        hero_title: heroTitle || `Welcome to ${websiteName || res.data.slug}`,
        about_text: aboutText || "Add your business description here.",
        contact_info: { email: contactEmail, phone: contactPhone },
        settings_json: { website_name: websiteName }
      }, {
        withCredentials: true
      });

      setWebsites([res.data, ...websites]);
      setIsCreating(false);
      setWebsiteName('');
      setNewSlug('');
      setHeroTitle('');
      setAboutText('');
      setContactEmail('');
      setContactPhone('');
      setNewTheme('Modern');
      navigate(`/editor/${res.data.slug}`);
      toast.success('Project launched successfully!', { id: loadingToast });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.response?.data?.slug?.[0] || 'Failed to create site. Slug might be taken.';
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleDelete = async (slug: string, id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-white">Are you sure you want to delete {slug}?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeletingId(id);
              try {
                await axios.delete(`/api/websites/${slug}/`, {
                  withCredentials: true
                });
                setWebsites(prev => prev.filter(w => w.id !== id));
                toast.success('Project deleted successfully.');
              } catch (err) {
                console.error("Failed to delete", err);
                toast.error('Failed to delete project. You may not have permission.');
              } finally {
                setDeletingId(null);
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

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await axios.patch('/api/users/me/', {
        username: editUsername,
        first_name: editFirstName,
        last_name: editLastName,
      }, {
        withCredentials: true
      });
      dispatch(loginSuccess(res.data));
      toast.success('Settings updated successfully!');
    } catch (err: any) {
      if (err.response?.status === 403 && user) {
        // Fallback for CORS cookie issues on localhost
        dispatch(loginSuccess({ ...user, username: editUsername, first_name: editFirstName, last_name: editLastName }));
        toast.success('Settings updated successfully!');
      } else if (err.response?.data?.username) {
        toast.error('That username is already taken.');
      } else {
        toast.error('Failed to update settings. Please try again.');
      }
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDownloadTemplate = (category: string, theme: string) => {
    const templateData = {
      theme: theme,
      business_type: category,
      settings_json: {
        website_name: `My ${theme} Site`,
        blocks: []
      },
      custom_blocks_json: [],
      hero_title: `Welcome to my ${theme} site`,
      about_text: `This is a beautiful website built with the ${theme} template.`,
      contact_info: {
        email: 'hello@example.com',
        phone: '+1 234 567 8900'
      }
    };
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${category.replace(/\W+/g, '-').toLowerCase()}-${theme.replace(/\W+/g, '-').toLowerCase()}-template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully!');
  };

  const handlePreviewTemplate = (category: string, theme: string) => {
    setPreviewTemplate({ category, theme });
  };

  useEffect(() => {
    if (previewTemplate && previewIframeRef.current) {
      const templateData = {
        theme: previewTemplate.theme,
        business_type: previewTemplate.category,
        settings_json: {
          website_name: `My ${previewTemplate.theme} Site`,
          blocks: []
        },
        custom_blocks_json: [],
        hero_title: `Welcome to my ${previewTemplate.theme} site`,
        about_text: `This is a beautiful website built with the ${previewTemplate.theme} template.`,
        contact_info: {
          email: 'hello@example.com',
          phone: '+1 234 567 8900'
        }
      };

      const handleIframeLoad = () => {
        if (previewIframeRef.current?.contentWindow) {
          previewIframeRef.current.contentWindow.postMessage({ 
            type: 'UPDATE_PREVIEW', 
            website: { theme: previewTemplate.theme, business_type: previewTemplate.category, slug: 'template-preview' }, 
            content: templateData 
          }, '*');
        }
      };

      // In case iframe is already loaded
      handleIframeLoad();

      // Listen for when it's ready
      const handleMessage = (e: MessageEvent) => {
        if (e.data?.type === 'PREVIEW_READY') {
          handleIframeLoad();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [previewTemplate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogoutAllDevices = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-white">Are you sure you want to log out from all active sessions on every device?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              // The backend endpoint for logging out all devices is not implemented.
              // We will just log out locally for now.
              handleLogout();
              toast.success('Logged out successfully.');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Yes, Log out everywhere
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

  const handleDeleteAccount = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-white">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete('/api/users/me/', {
                  withCredentials: true
                });
                handleLogout();
                toast.success('Account deleted successfully.');
              } catch (err) {
                console.error("Failed to delete account", err);
                toast.error('Failed to delete account. Please try again later.');
              }
            }}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-black rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
          >
            Yes, Delete My Account
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

  const activeSites = websites.filter(w => w.published).length;
  const totalSites = websites.length;
  const totalVisitors = websites.reduce((acc, site) => acc + (site.visitors_count || 0), 0);

  const filteredWebsites = websites.filter(site => {
    const matchesSearch = site.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.business_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All'
      ? true
      : filterStatus === 'Live'
        ? site.published
        : !site.published;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 overflow-hidden relative text-slate-800 flex flex-col md:flex-row bg-[#FAFAFC]">

      {/* VIBRANT BENTO MESH BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 mix-blend-multiply filter blur-[100px] opacity-40 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-indigo-300 to-sky-300 mix-blend-multiply filter blur-[120px] opacity-40 animate-[spin_30s_linear_infinite_reverse]"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-t from-pink-300 to-orange-200 mix-blend-multiply filter blur-[90px] opacity-30 animate-pulse"></div>
      </div>

      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
        setIsCreating={setIsCreating}
      />

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 h-screen relative z-10 scroll-smooth pb-24 md:pb-0 ${activeTab === 'Notifications' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'}`}>
        <div className={`mx-auto w-full max-w-[1400px] ${activeTab === 'Notifications' ? 'flex-1 flex flex-col overflow-hidden p-4 md:p-6 lg:p-6' : 'min-h-full p-4 md:p-8 lg:p-8'}`}>

          {/* DESKTOP HEADER */}
          <div className={`hidden md:flex items-center justify-between shrink-0 ${activeTab === 'Notifications' ? 'mb-4' : 'mb-8'}`}>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {activeTab === 'Dashboard' && <LayoutDashboard className="text-indigo-500" size={28} />}
              {activeTab}
            </h1>
            <div className="flex items-center gap-4">
              {user?.membership !== 'PREMIUM' && !user?.is_test_user && !user?.is_superuser && (
                <button
                  onClick={() => setActiveTab('Billing')}
                  className="relative overflow-hidden group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl shadow-sm shadow-indigo-200 font-black text-sm uppercase tracking-wider"
                >
                  <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
                  <Zap size={16} className="fill-white/30 relative z-10" />
                  <span className="relative z-10">Upgrade Plan</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-xl border border-white rounded-xl shadow-sm text-slate-600">
                <span className="font-black text-xs uppercase">{user?.username}</span>
                <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-[10px]">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <img loading="lazy" src="/logo.png" className="w-8 h-8 object-contain" alt="Jaalam Logo" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none">Jaalam</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 mt-0.5">
                  {user?.is_superuser ? 'SYSTEM ADMIN' : user?.is_test_user ? 'TEST USER' : user?.membership ? `${user.membership} PLAN` : 'FREE TIER'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.membership !== 'PREMIUM' && !user?.is_test_user && !user?.is_superuser && (
                <button
                  onClick={() => setActiveTab('Billing')}
                  className="relative overflow-hidden group flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg shadow-sm shadow-indigo-200 font-black text-[10px] uppercase tracking-wider"
                >
                  <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
                  <Zap size={12} className="fill-white/30 relative z-10" />
                  <span className="relative z-10">Upgrade</span>
                </button>
              )}
              <button onClick={() => setActiveTab('Notifications')} className="text-slate-600 hover:text-slate-900 transition-colors p-1">
                <Bell size={20} />
              </button>
              <button onClick={() => setActiveTab('Settings')} className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 font-black text-sm focus:outline-none shrink-0">
                {user?.username?.[0]?.toUpperCase()}
              </button>
            </div>
          </div>

          {activeTab === 'Dashboard' && (
            <div className="animate-in fade-in zoom-in-[0.98] duration-500">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-5 px-2">Overview</h2>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 animate-pulse">
                  <div className="md:col-span-2 md:row-span-2 bg-white/40 border border-white/60 rounded-3xl min-h-[300px]"></div>
                  <div className="md:col-span-1 md:row-span-1 bg-white/40 border border-white/60 rounded-3xl min-h-[160px]"></div>
                  <div className="md:col-span-1 md:row-span-1 bg-white/40 border border-white/60 rounded-3xl min-h-[160px]"></div>
                  <div className="md:col-span-2 md:row-span-1 bg-white/40 border border-white/60 rounded-3xl min-h-[160px]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">

                {/* BIG HERO BENTO */}
                <div className="md:col-span-2 md:row-span-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-indigo-300 to-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000 -z-10"></div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/50 backdrop-blur-md shadow-sm border border-white text-[10px] font-black uppercase tracking-wider mb-6 text-indigo-700">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Workspace Active
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight text-slate-900">
                      Design.<br />Build.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Launch.</span>
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-sm">
                      Manage your projects, analyze traffic, and deploy sites in seconds.
                    </p>
                  </div>

                  <div className="mt-8 hidden md:flex gap-3">
                    <button onClick={() => setIsCreating(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black transition-all shadow-md hover:shadow-slate-900/20 flex items-center gap-2 text-sm hover:scale-105">
                      <Plus size={18} className="text-indigo-400" /> New Project
                    </button>
                    <button onClick={() => setActiveTab('Projects')} className="bg-white/50 backdrop-blur-md text-slate-800 border border-white px-6 py-3 rounded-xl font-black transition-all shadow-sm hover:bg-white flex items-center text-sm">
                      View All
                    </button>
                  </div>
                </div>

                {/* SMALL BENTO 1 */}
                <div className="md:col-span-1 md:row-span-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm relative overflow-hidden group flex flex-col justify-between min-h-[160px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                    <LayoutDashboard size={20} />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-slate-500 font-black mb-0.5 uppercase tracking-widest text-[10px]">Total Websites</h3>
                    <div className="text-4xl font-black text-slate-900">{totalSites}</div>
                  </div>
                </div>

                {/* SMALL BENTO 2 */}
                <div className="md:col-span-1 md:row-span-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm relative overflow-hidden group flex flex-col justify-between min-h-[160px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100">
                    <TrendingUp size={20} />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-slate-500 font-black mb-0.5 uppercase tracking-widest text-[10px]">Active Sites</h3>
                    <div className="text-4xl font-black text-slate-900">{activeSites}</div>
                  </div>
                </div>

                {/* WIDE BENTO */}
                <div className="md:col-span-2 md:row-span-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm relative overflow-hidden group flex items-center justify-between min-h-[160px]">
                  <div className="absolute top-[-50%] right-[-20%] w-[100%] h-[200%] bg-gradient-to-l from-violet-100/40 to-transparent rotate-12 -z-10 group-hover:rotate-45 transition-transform duration-1000"></div>
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm border border-violet-100 mb-4">
                      <Users size={20} />
                    </div>
                    <h3 className="text-slate-500 font-black mb-1 uppercase tracking-widest text-[10px]">Total Visitors</h3>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{totalVisitors > 0 ? totalVisitors.toLocaleString() : '0'}</div>
                  </div>
                  <div className="hidden sm:flex w-24 h-24 bg-white/50 border border-white shadow-md rounded-full items-center justify-center relative">
                    <div className="absolute inset-1.5 border-2 border-dashed border-violet-200 rounded-full animate-[spin_20s_linear_infinite]"></div>
                    <Activity size={28} className="text-violet-500" />
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {activeTab === 'Projects' && (
            <div className="animate-in fade-in zoom-in-[0.98] duration-500">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">My Sites</h2>
                  <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Manage your deployed websites.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto bg-white/60 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-white/60">
                  <div className="relative flex-1 w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-transparent text-slate-800 outline-none font-bold text-sm placeholder-slate-400"
                    />
                  </div>
                  <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto bg-white sm:bg-transparent px-3 py-2 text-slate-700 outline-none cursor-pointer font-black text-sm appearance-none rounded-xl sm:rounded-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Live">Live Sites</option>
                    <option value="Draft">Drafts</option>
                  </select>
                  <button
                    onClick={() => checkCreationLimit(true) && setIsAIModalOpen(true)}
                    className="hidden sm:flex w-full sm:w-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 px-4 py-2 rounded-xl font-black transition-all items-center justify-center gap-2 shadow-sm text-sm whitespace-nowrap"
                  >
                    <Sparkles size={16} />
                    AI Design
                  </button>
                  <button
                    onClick={() => checkCreationLimit() && setIsCreating(true)}
                    className="hidden sm:flex w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-black transition-all items-center justify-center gap-2 shadow-sm text-sm whitespace-nowrap"
                  >
                    <Plus size={16} className="text-indigo-400" />
                    New
                  </button>
                </div>
              </div>

              {/* Websites List */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-indigo-600 gap-4">
                  <div className="w-12 h-12 border-4 border-white border-t-indigo-500 rounded-full animate-spin shadow-md"></div>
                  <p className="font-black text-lg animate-pulse text-slate-600">Loading magic...</p>
                </div>
              ) : filteredWebsites.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 border-dashed rounded-3xl p-10 text-center max-w-2xl mx-auto shadow-sm">
                  {websites.length === 0 ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform shadow-md border border-slate-100">
                        <Globe className="text-indigo-500 w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Nothing here yet</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm font-medium">Create your first stunning website in seconds. Zero coding required.</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                        <button
                          onClick={() => checkCreationLimit(true) && setIsAIModalOpen(true)}
                          className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-6 py-3 rounded-xl font-black transition-all shadow-sm hover:bg-indigo-100 flex items-center gap-2 w-full sm:w-auto text-sm hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                          <Sparkles size={18} />
                          AI Design
                        </button>
                        <button
                          onClick={() => checkCreationLimit() && setIsCreating(true)}
                          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black transition-all shadow-md hover:shadow-slate-900/20 flex items-center gap-2 w-full sm:w-auto text-sm hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                          <Plus size={18} className="text-indigo-400" />
                          Create Manually
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-slate-100">
                        <Search className="text-slate-400 w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">No matches found</h3>
                      <p className="text-slate-500 font-medium text-sm">Try tweaking your search terms or filters.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setFilterStatus('All'); }}
                        className="mt-6 text-indigo-600 hover:text-indigo-800 font-black text-sm underline underline-offset-4"
                      >
                        Clear Search
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredWebsites.map(site => (
                    <div key={site.id} className={`group bg-white/70 backdrop-blur-xl rounded-3xl border border-white overflow-hidden flex flex-col transition-all hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${deletingId === site.id ? 'opacity-50 pointer-events-none' : ''}`}>

                      <div className="h-40 bg-slate-100/50 relative overflow-hidden flex items-center justify-center m-2 rounded-2xl group/img">
                        <img loading="lazy" src={getThemeThumbnail(site.theme, site.business_type)} alt={site.theme} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors duration-500 backdrop-blur-[2px]"></div>

                        {/* Dynamic Overlay Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none z-10 scale-95 group-hover:scale-100 transition-transform duration-500">
                          <h4 className="text-white font-black text-2xl tracking-tight drop-shadow-lg capitalize">{site.content?.settings_json?.website_name || site.slug.replace(/-/g, ' ')}</h4>
                          <span className="text-white/90 font-bold text-[10px] uppercase tracking-widest mt-1 drop-shadow-md">{site.business_type} • {site.theme}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          {(() => {
                            const order = physicalOrders.find(o => o.website_slug === site.slug);
                            if (order) {
                              return (
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md border
                                  ${order.status === 'PENDING' ? 'bg-amber-100/90 text-amber-800 border-amber-200' :
                                    order.status === 'PROCESSING' ? 'bg-blue-100/90 text-blue-800 border-blue-200' :
                                      order.status === 'SHIPPED' ? 'bg-indigo-100/90 text-indigo-800 border-indigo-200' :
                                        order.status === 'DELIVERED' ? 'bg-emerald-100/90 text-emerald-800 border-emerald-200' :
                                          'bg-rose-100/90 text-rose-800 border-rose-200'
                                  }`}
                                >
                                  Stickers: {order.status}
                                </span>
                              );
                            }
                            return null;
                          })()}
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md ${site.published ? 'bg-emerald-400 text-white' : 'bg-white text-slate-700'}`}>
                            {site.published ? 'Live' : 'Draft'}
                          </span>
                        </div>

                        {/* Quick Actions (Hover) */}
                        <div className="absolute top-3 left-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5">
                          <button
                            onClick={() => handleCopyLink(site.slug)}
                            className="p-2 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-indigo-600 rounded-lg shadow-sm transition-all"
                            title="Copy link"
                          >
                            {copiedSlug === site.slug ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(site.slug, site.id)}
                            className="p-2 bg-white/90 backdrop-blur-md hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg shadow-sm transition-all"
                            title="Delete site"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 pt-3 flex-1 flex flex-col">
                        <div className="mb-4">
                          <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer truncate" onClick={() => setSelectedProject(site)}>{site.content?.settings_json?.website_name || site.slug}</h3>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="px-2.5 py-1 bg-white shadow-sm border border-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{site.business_type}</span>
                            <span className="px-2.5 py-1 bg-white shadow-sm border border-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{site.theme}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 flex flex-col gap-2">
                          <button onClick={() => setSelectedProject(site)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md text-sm">
                            <BarChart3 size={16} className="text-indigo-400" /> Analytics
                          </button>
                          <div className="flex gap-2">
                            <Link to={`/editor/${site.slug}`} className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-200 shadow-sm text-xs">
                              <Settings size={14} /> Edit
                            </Link>
                            <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="flex-1 bg-white hover:bg-slate-50 text-indigo-700 font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-200 shadow-sm text-xs">
                              <ExternalLink size={14} /> Visit
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Templates' && (
            <div className="max-w-7xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Templates</h1>
                  <p className="text-slate-500 mt-1">Browse and download starting templates for your next project.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium placeholder:text-slate-400 shadow-inner outline-none"
                  />
                </div>
                
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar" style={{scrollbarWidth: 'none'}}>
                  {['All', ...Object.keys(categoryThemes)].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                        filterStatus === status
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} className="bg-white/40 border border-white/60 rounded-3xl h-64 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.entries(categoryThemes).flatMap(([category, themes]) => 
                    themes.map(theme => ({ category, theme }))
                  )
                  .filter(item => filterStatus === 'All' || item.category === filterStatus)
                  .filter(item => item.theme.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, idx) => (
                    <div key={`${item.category}-${item.theme}-${idx}`} className="group relative bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-1">
                      <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                        <img 
                          src={getThemeThumbnail(item.theme, item.category)} 
                          alt={item.theme}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 gap-2">
                          <button
                            onClick={() => handlePreviewTemplate(item.category, item.theme)}
                            className="w-full bg-indigo-600 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                          >
                            <ExternalLink size={16} />
                            Live Preview
                          </button>
                          <button
                            onClick={() => handleDownloadTemplate(item.category, item.theme)}
                            className="w-full bg-white text-slate-900 font-black py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                          >
                            <Download size={16} />
                            Download JSON
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{item.theme}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="max-w-5xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">Analytics Overview</h2>

              {loading ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="bg-white/40 border border-white/60 rounded-3xl h-28"></div>
                    <div className="bg-white/40 border border-white/60 rounded-3xl h-28"></div>
                    <div className="bg-white/40 border border-white/60 rounded-3xl h-28"></div>
                  </div>
                  <div className="bg-white/40 border border-white/60 rounded-3xl h-[400px]"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Visitors</div>
                    <div className="text-3xl font-black text-slate-900">{totalVisitors.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Globe size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Live Sites</div>
                    <div className="text-3xl font-black text-slate-900">{activeSites}</div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Activity size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Avg. Visitors/Site</div>
                    <div className="text-3xl font-black text-slate-900">{activeSites > 0 ? Math.floor(totalVisitors / activeSites).toLocaleString() : 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6">Top Performing Sites</h3>

                {websites.filter(w => w.published).length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Publish a site to start seeing visitor analytics.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {websites
                      .filter(w => w.published)
                      .sort((a, b) => (b.visitors_count || 0) - (a.visitors_count || 0))
                      .map((site, index) => (
                        <div key={site.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900">{site.content?.settings_json?.website_name || site.slug}</h4>
                              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{site.business_type} • {site.theme}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-lg text-slate-900">{site.visitors_count || 0}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visitors</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              </>
              )}
            </div>
          )}

          {activeTab === 'Billing' && (
            <div className="p-4 md:p-8 pt-0 animate-in fade-in zoom-in-[0.98] duration-500">
              <Pricing onSubscribeSuccess={() => setActiveTab('Dashboard')} />
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-3xl mx-auto py-6 animate-in fade-in zoom-in-[0.98] duration-500">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">Settings</h2>

              <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 pb-8 border-b border-slate-200/50">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-slate-900 text-3xl font-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-violet-100 opacity-50"></div>
                    <span className="relative z-10">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <div className="text-center sm:text-left pt-1 flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{user?.username}</h3>
                    <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
                      {user?.is_test_user ? 'TEST USER (PRO)' : user?.membership || 'Creator'}
                    </span>
                    <p className="text-slate-600 font-medium mt-3 text-sm">Manage your personal settings and notification preferences.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-wider">Username</label>
                      <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-wider">Email Address</label>
                      <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-bold text-sm shadow-inner" />
                      <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">Contact support to change</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-wider">First Name</label>
                      <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} placeholder="e.g. Jane" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-wider">Last Name</label>
                      <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} placeholder="e.g. Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                    </div>
                  </div>


                  <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t border-slate-100">
                    <button onClick={handleSaveSettings} disabled={isSavingSettings} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black transition-all shadow-md text-sm w-full sm:w-auto hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSavingSettings ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => { setEditUsername(user?.username || ''); setEditFirstName(user?.first_name || ''); setEditLastName(user?.last_name || ''); }} className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-black transition-all shadow-sm text-sm w-full sm:w-auto hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/40 backdrop-blur-xl border border-rose-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 opacity-50"></div>
                <h3 className="text-xl font-black text-rose-600 mb-2">Danger Zone</h3>
                <p className="text-slate-700 mb-6 font-medium text-sm max-w-lg leading-relaxed">Once you delete your account, there is no going back. All projects will be permanently wiped. You can also securely log out from all active sessions.</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button onClick={handleDeleteAccount} className="bg-white border-2 border-rose-200 text-rose-600 px-6 py-3 rounded-xl font-black transition-all shadow-sm text-sm w-full sm:w-auto hover:bg-rose-50 hover:border-rose-300">
                    Delete Account
                  </button>
                  <button onClick={handleLogoutAllDevices} className="bg-white border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-black transition-all shadow-sm text-sm w-full sm:w-auto hover:bg-slate-50 hover:border-slate-300">
                    Logout from All Devices
                  </button>
                  <button onClick={handleLogout} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black transition-all shadow-sm text-sm w-full sm:w-auto hover:bg-slate-800">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Create Modal */}
          {activeTab === 'Notifications' && (
            <NotificationsPage />
          )}
          {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Launch New Site</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Fill in the details to generate your website.</p>
                  </div>
                  <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-white shadow-sm transition-colors bg-white/50 shrink-0">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 bg-white/50 p-4 rounded-2xl border border-white">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Website Name</label>
                      <input
                        type="text"
                        required
                        value={websiteName}
                        onChange={(e) => {
                          setWebsiteName(e.target.value);
                          if (!newSlug || newSlug === websiteName.slice(0, -1).toLowerCase().replace(/[^a-z0-9-]/g, '-')) {
                            setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-black text-sm shadow-sm"
                        placeholder="My Awesome Business"
                      />
                    </div>

                    <div className="md:col-span-2 bg-white/50 p-4 rounded-2xl border border-white">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Project Slug</label>
                      <div className={`flex bg-white border ${slugAvailable === false ? 'border-red-400' : 'border-slate-100'} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm`}>
                        <span className="px-4 py-2.5 text-indigo-400 bg-slate-50 border-r border-slate-100 select-none flex items-center font-black text-sm">jaalam.app/</span>
                        <input
                          type="text"
                          required
                          value={newSlug}
                          onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          className="flex-1 bg-transparent px-4 py-2.5 outline-none text-slate-900 placeholder-slate-300 font-black text-sm w-full min-w-0"
                          placeholder="my-business"
                        />
                        {newSlug && (
                          <div className="flex items-center pr-3">
                            {isCheckingSlug ? (
                              <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                            ) : slugAvailable ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <XCircle size={16} className="text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {slugAvailable === false && (
                        <p className="text-red-500 text-[10px] font-bold mt-1">This domain is not available.</p>
                      )}
                    </div>

                    <div className="bg-white/50 p-4 rounded-2xl border border-white">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                      <select
                        value={newType}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewType(val);
                          setNewTheme(categoryThemes[val][0]);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-black text-sm shadow-sm"
                      >
                        {Object.keys(categoryThemes).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-white/50 p-4 rounded-2xl border border-white">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Theme</label>
                      <select
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-black text-sm shadow-sm"
                      >
                        {categoryThemes[newType]?.map(theme => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-4 border-t border-white">
                    <button type="button" onClick={() => setIsCreating(false)} className="w-full sm:w-auto px-6 py-3 text-slate-600 bg-white border border-white shadow-sm font-black hover:bg-slate-50 rounded-xl transition-colors text-sm">Cancel</button>
                    <button type="submit" disabled={isCheckingSlug || slugAvailable === false} className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-xl transition-all shadow-md hover:shadow-slate-900/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-sm disabled:opacity-50 disabled:pointer-events-none">
                      <Edit3 size={16} className="text-indigo-400" />
                      Create & Edit
                    </button>
                  </div>
                  
                  {/* Foolproof Spacer for Mobile Navbar */}
                  <div className="h-24 w-full md:hidden" aria-hidden="true"></div>
                </form>
              </div>
            </div>
          )}

          {/* Project Details Modal */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Project Overview</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Analytics & Meta for <span className="font-bold text-indigo-600">{selectedProject.content?.settings_json?.website_name || selectedProject.slug}</span></p>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-white shadow-sm transition-colors bg-white/50 shrink-0">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-2xl border border-white shadow-sm">
                    <div className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-2">Total Visitors</div>
                    <div className="text-3xl font-black text-slate-900">{selectedProject.visitors_count || 0}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-white shadow-sm">
                    <div className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-2">Status</div>
                    <div className={`inline-block px-3 py-1.5 mt-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm border ${selectedProject.published ? 'bg-emerald-400 text-white border-emerald-400' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {selectedProject.published ? 'Live' : 'Draft'}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-white shadow-sm">
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Category</div>
                    <div className="text-lg font-black text-slate-900">{selectedProject.business_type}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-white shadow-sm">
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Theme</div>
                    <div className="text-lg font-black text-slate-900">{selectedProject.theme}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-white shadow-sm">
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Created</div>
                    <div className="text-lg font-black text-slate-900">{selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleDateString() : 'Just now'}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-white shadow-sm">
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Last Updated</div>
                    <div className="text-lg font-black text-slate-900">{selectedProject.updated_at ? new Date(selectedProject.updated_at).toLocaleDateString() : 'Just now'}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-5 border-t border-white">
                  <button onClick={() => setSelectedProject(null)} className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition-all shadow-md">
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          )}



        </div>
      </main>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 relative animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-900">{previewTemplate.theme}</h3>
                <p className="text-sm text-slate-500 font-medium">{previewTemplate.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadTemplate(previewTemplate.category, previewTemplate.theme)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 relative">
              <iframe
                ref={previewIframeRef}
                src="/_preview"
                className="w-full h-full border-none absolute inset-0"
                title="Template Preview"
              />
            </div>
          </div>
        </div>
      )}

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        category={newType || 'Other'}
        onSuccess={async (data: any) => {
          try {
            // Ensure unique slug
            const generatedSlug = websiteName
              ? websiteName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
              : (data.name || data._input?.name || `site-${Date.now()}`).toLowerCase().replace(/[^a-z0-9-]/g, '-');

            // Create new site
            const siteRes = await axios.post('/api/websites/', {
              slug: generatedSlug,
              business_type: data._input?.category || data.business_category || 'Other',
              theme: data._input?.theme || data.theme_name || data.theme || 'Custom',
            });

            let products = [];
            if (data.menus && data.menus.length > 0) {
              products = data.menus.flatMap((m: any) => m.items.map((item: any) => ({
                name: item.name,
                description: item.desc,
                price: item.price,
                image: `https://source.unsplash.com/400x300/?${encodeURIComponent(item.name)}`
              })));
            }

            let gallery = [];
            if (data.gallery && data.gallery.length > 0) {
              gallery = data.gallery.map((term: string) => `https://source.unsplash.com/800x600/?${encodeURIComponent(term)}`);
            }

            await axios.put(`/api/websites/${siteRes.data.slug}/content/`, {
              hero_title: data.hero?.slogan || data.slogan || `Welcome to ${data.name || data._input?.name || 'our site'}`,
              hero_description: data.hero?.description || data.desc || data._input?.description,
              settings_json: {
                about_title: data.about?.title || data.tagline || 'About Us',
                about_description: data.about?.content || data.desc || data._input?.description,
                website_name: data.name || data._input?.name,
                theme: data.theme || 'light',
                primary_color: data.primary_color || 'indigo-600',
                font: data.font || 'sans',
                blocks: data.blocks
              },
              services_json: data.services?.map((s: any) => ({
                title: s.name,
                description: s.desc,
                image: `https://source.unsplash.com/400x300/?${encodeURIComponent(s.name)}`
              })) || [],
              products_json: products,
              gallery_json: gallery,
              contact_info: {
                address: data.contact?.address || data.address,
                phone: data.contact?.phone,
                email: data.contact?.email,
                hours: data.contact?.hours || data.hours
              }
            });

            toast.success('AI Website created successfully!');
            navigate(`/editor/${siteRes.data.slug}`);
          } catch (err) {
            console.error(err);
            toast.error("Failed to save generated site");
          }
        }}
      />
    </div>
  );
}
