import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Globe, Smartphone, Edit3, LayoutTemplate, MessageSquare, QrCode, Layers, Image as ImageIcon, ExternalLink, Rocket, Palette, ShoppingCart, Monitor, Upload, X, ArrowUp, ArrowDown, ArrowUpDown, PlusCircle, Type, Minus, Eye, EyeOff, Link2, CheckCircle2, Copy, Download, Sparkles, Gamepad2 } from 'lucide-react';
import QRCodeLib from 'react-qr-code';
const QRCode = (QRCodeLib as any).default || QRCodeLib;
import toast from 'react-hot-toast';
import AIGeneratorModal from '../../components/modals/AIGeneratorModal';
import MiniGame from '../../components/games/MiniGame';
import { useRazorpay } from 'react-razorpay';

const categoryThemes: Record<string, string[]> = {
  'Restaurant': ['Fine Dining', 'Casual Eats', 'Bistro', 'Vegan Cafe', 'Seafood Grill'],
  'Cafe / Bakery': ['Cozy Cafe', 'App Style', 'Modern Bakery', 'Artisan', 'Boutique'],
  'Salon / Spa': ['Classic Barbershop', 'Modern Saloon', 'Vintage Barber', 'Royal Saloon', 'Glamour Beauty'],
  'Salon': ['Classic Barbershop', 'Modern Saloon', 'Vintage Barber', 'Royal Saloon', 'Glamour Beauty'],
  'Saloon': ['Classic Barbershop', 'Modern Saloon', 'Vintage Barber', 'Royal Saloon', 'Glamour Beauty'],
  'Gym / Fitness': ['Hardcore Iron', 'Zen Yoga Studio', 'CrossFit Box', 'Luxury Health Club', 'Combat & MMA Gym'],
  'Retail Store': ['Boutique', 'Minimalist', 'Streetwear', 'Tech Gadget', 'Organic Store'],
  'Real Estate': ['Luxury Villas', 'Urban Apartments', 'Commercial', 'Modern', 'Minimal', 'Classic'],
  'Consulting': ['Corporate', 'Creative Agency', 'Tech Startup', 'Management', 'Minimal', 'Legal Firm'],
  'Stationery / Books': ['Modern', 'Classic', 'Playful', 'Minimal', 'Ethereal'],
  'Chicken / Meat Stall': ['Modern', 'Classic', 'Premium', 'Minimal'],
  'Supermarket / Grocery': ['Modern', 'Classic', 'Premium', 'Minimal', 'Organic', 'Playful', 'Noir', 'Pop'],
  'Other': ['Modern', 'Classic', 'Minimal', 'Noir', 'Pop', 'Corporate']
};

const ImageUpload = ({ value, onChange, label, hint }: any) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:8000/api/websites/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.url);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">{label}</label>
          {hint && <span className="text-[9px] font-bold text-slate-400 normal-case bg-slate-100 px-2 py-0.5 rounded-md inline-block w-fit">{hint}</span>}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {value && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onChange('')}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-sm"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        <label className={`w-full flex items-center justify-center py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${uploading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm border border-indigo-100'}`}>
          <Upload size={16} className="mr-2" />
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

export default function WebsiteEditor() {
  const { websiteId } = useParams();
  const { Razorpay } = useRazorpay();
  const [website, setWebsite] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-chat');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Mobile View Toggle ('editor' | 'preview')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  
  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatImages, setChatImages] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState([{ role: 'ai', content: 'Hi! I designed this website for you. What would you like to change? (Tip: You can upload images, or even ask me to generate AI images for you!)' }]);
  const [isChatting, setIsChatting] = useState(false);
  const [uploadingChatImage, setUploadingChatImage] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);

  // Preview Device Mode
  // Preview Device Mode
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [domainSearch, setDomainSearch] = useState('');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDomain, setConnectedDomain] = useState('');

  const [showOrderStickerModal, setShowOrderStickerModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchWebsiteData();
  }, [websiteId]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_READY') {
        setIframeReady(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Sync state to iframe live preview
  useEffect(() => {
    if (website && content && iframeReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_PREVIEW', website, content }, '*');
    }
  }, [website, content, iframeReady, previewDevice]);

  const isDynamicAI = content?.settings_json?.blocks !== undefined;

  // Set default tab based on whether it's an AI site or manual site
  useEffect(() => {
    if (isDynamicAI && activeTab !== 'ai-chat' && activeTab !== 'domain' && activeTab !== 'qr') {
      setActiveTab('ai-chat');
    } else if (!isDynamicAI && activeTab === 'ai-chat') {
      setActiveTab('theme');
    }
  }, [isDynamicAI, activeTab]);

  const fetchWebsiteData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/websites/${websiteId}/`);
      setWebsite(res.data);
      let fetchedContent = res.data.content || {};
      if (fetchedContent.contact_info?.address && typeof fetchedContent.contact_info.address === 'object') {
        const addr = fetchedContent.contact_info.address;
        fetchedContent.contact_info.address = Object.values(addr).filter(Boolean).join(', ');
      }
      setContent(fetchedContent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Theme explicitly
      await axios.patch(`http://localhost:8000/api/websites/${websiteId}/`, { theme: website.theme });
      // Save Content
      const res = await axios.patch(`http://localhost:8000/api/websites/${websiteId}/content/`, content);
      setContent(res.data);
      toast.success('Saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploadingChatImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:8000/api/websites/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setChatImages(prev => [...prev, res.data.url]);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploadingChatImage(false);
    }
  };

  const handleChatImageUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') !== -1 || item.type.indexOf('video') !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          await uploadFile(file);
          break;
        }
      }
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() && chatImages.length === 0) return;
    const prompt = chatInput;
    const attachedImages = [...chatImages];
    setChatInput('');
    setChatImages([]);
    setChatHistory([...chatHistory, { role: 'user', content: attachedImages.length > 0 ? `[Attached ${attachedImages.length} media file(s)] ${prompt}` : prompt }]);
    setIsChatting(true);

    try {
      const res = await axios.post(`http://localhost:8000/api/websites/chat/`, {
        prompt: prompt,
        current_content: content.settings_json || {},
        image_urls: attachedImages
      });
      const newJsonString = JSON.stringify(res.data);
      const oldJsonString = JSON.stringify(content.settings_json || {});
      
      let aiResponseMsg = 'I have updated the website layout as requested! The changes are now live in the preview.';
      
      let imageMissing = false;
      if (attachedImages.length > 0) {
        for (const imgUrl of attachedImages) {
          if (!newJsonString.includes(imgUrl)) {
            imageMissing = true;
            break;
          }
        }
      }

      let failedToGenerateImage = false;
      const lowerPrompt = prompt.toLowerCase();
      if ((lowerPrompt.includes('generate') || lowerPrompt.includes('image') || lowerPrompt.includes('picture')) && attachedImages.length === 0) {
        // If they asked for an image but didn't attach one, the AI should have added a pollinations URL
        if (!newJsonString.includes('pollinations.ai') && newJsonString.match(/(https?:\/\/[^\s]+)/g)?.length === oldJsonString.match(/(https?:\/\/[^\s]+)/g)?.length) {
          failedToGenerateImage = true;
        }
      }

      if (imageMissing) {
        aiResponseMsg = "I updated the layout, but I wasn't sure exactly where to place your uploaded image based on your instructions. Could you be more specific? (e.g., 'replace the hero image with this')";
      } else if (failedToGenerateImage) {
        aiResponseMsg = "I tried to update the layout, but I wasn't able to generate the image you requested. Could you try rephrasing your prompt to be more descriptive about the image?";
      } else if (newJsonString === oldJsonString) {
        aiResponseMsg = "I'm sorry, I couldn't figure out how to apply your request to the layout. Could you try rephrasing your instructions?";
      }

      setContent({ ...content, settings_json: res.data });
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponseMsg }]);
      
      if (imageMissing || failedToGenerateImage || newJsonString === oldJsonString) {
        toast.error('AI was unable to complete all instructions.');
      } else {
        toast.success('Website updated by AI!');
      }
    } catch (err) {
      console.error(err);
      toast.error('AI failed to modify website.');
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error while trying to update the website. Please try again.' }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleTogglePublish = async () => {
    setSaving(true);
    const newStatus = !website.published;
    try {
      await axios.patch(`http://localhost:8000/api/websites/${websiteId}/`, { published: newStatus });
      setWebsite({ ...website, published: newStatus });
      if (newStatus) {
        toast.success('Site Published! It is now Live.');
      } else {
        toast.success('Site Unpublished. It is no longer publicly accessible.');
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${newStatus ? 'publish' : 'unpublish'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFC]">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-slate-500 animate-pulse">Loading Editor...</p>
    </div>
  );

  if (!website || !content) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FAFAFC]">
      <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Website Not Found</h2>
        <Link to="/dashboard" className="text-indigo-600 font-bold hover:underline">Return to Dashboard</Link>
      </div>
    </div>
  );

  const publicUrl = `http://localhost:5173/${website.slug}`;

  const tabs = isDynamicAI ? [
    { id: 'ai-chat', icon: <Sparkles size={16} />, label: 'AI Chat' },
    { id: 'domain', icon: <Link2 size={16} />, label: 'Domain' },
    { id: 'qr', icon: <QrCode size={16} />, label: 'QR Code' }
  ] : [
    { id: 'theme', icon: <Palette size={16} />, label: 'Theme' },
    { id: 'hero', icon: <LayoutTemplate size={16} />, label: 'Hero' },
    { id: 'about', icon: <MessageSquare size={16} />, label: 'About' },
    { id: 'services', icon: <Layers size={16} />, label: 'Services' },
    { id: 'products', icon: <ShoppingCart size={16} />, label: 'Menu' },
    { id: 'gallery', icon: <ImageIcon size={16} />, label: 'Gallery' },
    { id: 'contact', icon: <Globe size={16} />, label: 'Contact' },
    { id: 'custom', icon: <PlusCircle size={16} />, label: 'Custom' },
    { id: 'layout', icon: <ArrowUpDown size={16} />, label: 'Layout' },
    { id: 'domain', icon: <Link2 size={16} />, label: 'Domain' },
    { id: 'qr', icon: <QrCode size={16} />, label: 'QR Code' }
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFC] font-sans selection:bg-indigo-500/30 overflow-hidden relative">

      {/* VIBRANT BENTO MESH BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 mix-blend-multiply filter blur-[100px] opacity-40 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-indigo-300 to-sky-300 mix-blend-multiply filter blur-[120px] opacity-40 animate-[spin_30s_linear_infinite_reverse]"></div>
      </div>

      {/* MOBILE TOGGLE BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-white/50 z-50 flex items-center justify-between px-4 shadow-sm">
        <Link to="/dashboard" state={{ tab: 'Projects' }} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>

        <div className="flex bg-slate-100/80 p-0.5 sm:p-1 rounded-xl mx-1 shrink-0">
          <button
            onClick={() => setMobileView('editor')}
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${mobileView === 'editor' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            <Edit3 size={14} className="sm:w-4 sm:h-4" /> Edit
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${mobileView === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            <Smartphone size={14} className="sm:w-4 sm:h-4" /> Preview
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-1.5 sm:p-2 bg-white text-slate-700 rounded-xl shadow-sm border border-slate-200 disabled:opacity-70 transition-all"
          >
            <Save size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm disabled:opacity-70 transition-all font-bold text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 ${website.published ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}
          >
            <Rocket size={12} className="sm:w-3.5 sm:h-3.5" /> {website.published ? 'Published' : 'Publish'}
          </button>
        </div>
      </div>

      {/* LEFT PANEL: EDITOR CONTROLS */}
      <div className={`w-full lg:w-[420px] h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] mt-16 lg:mt-4 lg:ml-4 bg-white/70 backdrop-blur-2xl lg:border border-white/80 lg:rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex flex-col relative z-20 ${mobileView === 'editor' ? 'flex' : 'hidden lg:flex'}`}>

        {/* Desktop Header */}
        <div className="hidden lg:flex p-5 border-b border-white/40 items-center justify-between">
          <Link to="/dashboard" state={{ tab: 'Projects' }} className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="font-black text-slate-900 truncate px-2 text-lg">{content?.settings_json?.website_name || website.slug}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-70 whitespace-nowrap shrink-0"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={handleTogglePublish}
              disabled={saving}
              className={`px-4 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70 whitespace-nowrap shrink-0 ${website.published ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            >
              <Rocket size={16} /> {website.published ? 'Published' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-3 gap-2 border-b border-white/40 overflow-x-auto scrollbar-hide shrink-0 bg-white/30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl capitalize whitespace-nowrap transition-all shadow-sm shrink-0 ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Forms */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">

          {activeTab === 'ai-chat' && (
            <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col min-h-[400px]">
              <div className="bg-indigo-600 p-6 text-white rounded-2xl relative shadow-md shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={24} className="text-indigo-100" />
                  <h2 className="text-xl font-black">AI Editor</h2>
                </div>
                <p className="text-indigo-100 text-sm font-medium">Chat with the AI to redesign or modify your website layout instantly.</p>
              </div>
              
              <div className="flex-1 bg-white/50 border border-white shadow-inner rounded-2xl p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 text-white ml-auto' : 'bg-white shadow-sm border border-slate-100 text-slate-800'}`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                {isChatting && (
                  <div className="bg-white shadow-sm border border-slate-100 text-slate-800 p-3 rounded-xl max-w-[85%] w-fit">
                    <div className="flex items-center gap-2 text-indigo-600 mb-3">
                      <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span className="text-xs font-bold">
                        {(() => {
                          const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user')?.content;
                          if (lastUserMsg) {
                            const instruction = lastUserMsg.replace(/\[Attached .*?\] /, '');
                            return `Executing: "${instruction.length > 45 ? instruction.slice(0, 45) + '...' : instruction}"`;
                          }
                          return "AI is modifying the layout...";
                        })()}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowGameModal(true)}
                      className="text-xs w-full bg-indigo-50 text-indigo-700 py-2 px-3 rounded-lg font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Gamepad2 size={14} /> Play a Mini-Game while waiting
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 relative shrink-0">
                {chatImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {chatImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm self-start bg-slate-900 flex items-center justify-center shrink-0">
                        {img.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={img} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                        ) : (
                          <img src={img} alt="Attached" className="w-full h-full object-cover" />
                        )}
                        <button
                          onClick={() => setChatImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 relative shrink-0">
                  <label className={`p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors flex items-center justify-center shrink-0 ${uploadingChatImage ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}>
                    <ImageIcon size={20} />
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleChatImageUpload} disabled={isChatting || uploadingChatImage} />
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Generate a modern logo, or upload images..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                    onPaste={handlePaste}
                    disabled={isChatting}
                    className="w-full px-4 py-3 bg-white border border-white shadow-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm font-medium"
                  />
                  <button 
                    onClick={handleChatSubmit}
                    disabled={isChatting || (!chatInput.trim() && chatImages.length === 0)}
                    className="bg-indigo-600 text-white px-5 rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold shrink-0 whitespace-nowrap"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category (Read Only)</label>
                <input
                  type="text"
                  disabled
                  value={website.business_type}
                  className="w-full px-4 py-3 bg-white/40 border border-slate-100 rounded-xl outline-none font-bold text-sm shadow-inner text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Select Theme</label>
                <select
                  value={website.theme}
                  onChange={e => setWebsite({ ...website, theme: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-black text-sm shadow-sm"
                >
                  {(categoryThemes[website.business_type] || categoryThemes['Other']).map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
                <p className="mt-3 text-xs text-slate-500 font-medium">Changing the theme will instantly update the preview on the right. Don't forget to Save!</p>
              </div>

              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm mt-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Website Name</label>
                  <input
                    type="text"
                    value={content.settings_json?.website_name ?? website.slug}
                    onChange={e => setContent({ ...content, settings_json: { ...(content.settings_json || {}), website_name: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="Enter your website name"
                  />
                </div>
                <ImageUpload
                  label="Logo Image (Optional)"
                  hint="Please use a transparent logo without a background"
                  value={content.settings_json?.logo_image || ''}
                  onChange={(val: string) => setContent({ ...content, settings_json: { ...(content.settings_json || {}), logo_image: val } })}
                />
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={content.hero_title || ''}
                    onChange={e => setContent({ ...content, hero_title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="e.g., Welcome to my site!"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Hero Description</label>
                  <textarea
                    rows={5}
                    value={content.hero_description || content.hero_text || ''}
                    onChange={e => setContent({ ...content, hero_description: e.target.value, hero_text: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-sm shadow-inner resize-none leading-relaxed"
                    placeholder="A brief description for your hero section..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">About Title</label>
                  <input
                    type="text"
                    value={content.settings_json?.about_title || content.about_title || ''}
                    onChange={e => setContent({ ...content, about_title: e.target.value, settings_json: { ...(content.settings_json || {}), about_title: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="e.g., Tradition Meets Modern Gastronomy"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">About Description</label>
                  <textarea
                    rows={8}
                    value={content.settings_json?.about_description || content.about_text || ''}
                    onChange={e => setContent({ ...content, about_text: e.target.value, settings_json: { ...(content.settings_json || {}), about_description: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none font-medium text-sm shadow-inner leading-relaxed"
                    placeholder="Tell your visitors about your business..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Services / Features</label>
                {(content.services_json || []).length < 4 && (
                  <button
                    onClick={() => setContent({ ...content, services_json: [...(content.services_json || []), { title: 'New Service', description: 'Description', image: '' }] })}
                    className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-indigo-600 active:scale-95"
                  >+ Add Service</button>
                )}
              </div>

              {(content.services_json || []).map((srv: any, idx: number) => {
                // Backward compatibility for old string array format
                const title = typeof srv === 'string' ? srv : (srv.title || '');
                const description = typeof srv === 'string' ? '' : (srv.description || '');
                const image = typeof srv === 'string' ? '' : (srv.image || '');

                return (
                  <div key={idx} className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm space-y-3 relative pt-8">
                    <button
                      onClick={() => {
                        const newSrv = [...content.services_json];
                        newSrv.splice(idx, 1);
                        setContent({ ...content, services_json: newSrv });
                      }}
                      className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg text-[10px] uppercase tracking-wider font-black transition-colors"
                    >Remove</button>
                    <input type="text" value={title} onChange={e => {
                      const newSrv = [...content.services_json];
                      newSrv[idx] = { title: e.target.value, description: description, image: image };
                      setContent({ ...content, services_json: newSrv });
                    }} placeholder="Service Name" className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />

                    <textarea value={description} onChange={e => {
                      const newSrv = [...content.services_json];
                      newSrv[idx] = { title: title, description: e.target.value, image: image };
                      setContent({ ...content, services_json: newSrv });
                    }} rows={3} placeholder="Service Description..." className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />

                    <ImageUpload
                      value={image}
                      onChange={(url: string) => {
                        const newSrv = [...content.services_json];
                        newSrv[idx] = { title: title, description: description, image: url };
                        setContent({ ...content, services_json: newSrv });
                      }}
                      placeholder="Service Image URL"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gallery Images</label>
                {(content.gallery_json || []).length < 6 && (
                  <button
                    onClick={() => setContent({ ...content, gallery_json: [...(content.gallery_json || []), ''] })}
                    className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-indigo-600 active:scale-95"
                  >+ Add Image</button>
                )}
              </div>

              {(content.gallery_json || []).map((imgUrl: string, idx: number) => (
                <div key={idx} className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm space-y-3 relative pt-8">
                  <button
                    onClick={() => {
                      const newGal = [...content.gallery_json];
                      newGal.splice(idx, 1);
                      setContent({ ...content, gallery_json: newGal });
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg text-[10px] uppercase tracking-wider font-black transition-colors"
                  >Remove</button>
                  <ImageUpload
                    value={imgUrl}
                    onChange={(url: string) => {
                      const newGal = [...content.gallery_json];
                      newGal[idx] = url;
                      setContent({ ...content, gallery_json: newGal });
                    }}
                    placeholder="Image URL"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Products / Menu</label>
                <button
                  onClick={() => setContent({ ...content, products_json: [...(content.products_json || []), { name: 'New Item', price: '₹10', image: '', description: 'Description of the item...' }] })}
                  className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-indigo-600 active:scale-95"
                >+ Add Item</button>
              </div>

              {(content.products_json || []).map((prod: any, idx: number) => (
                <div key={idx} className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm space-y-3 relative pt-8">
                  <button
                    onClick={() => {
                      const newProds = [...content.products_json];
                      newProds.splice(idx, 1);
                      setContent({ ...content, products_json: newProds });
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg text-[10px] uppercase tracking-wider font-black transition-colors"
                  >Remove</button>
                  <input type="text" value={prod.name || ''} onChange={e => {
                    const newProds = [...content.products_json];
                    newProds[idx] = { ...newProds[idx], name: e.target.value };
                    setContent({ ...content, products_json: newProds });
                  }} placeholder="Name (e.g. Burger)" className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />

                  <input type="text" value={prod.price || ''} onChange={e => {
                    const newProds = [...content.products_json];
                    newProds[idx] = { ...newProds[idx], price: e.target.value };
                    setContent({ ...content, products_json: newProds });
                  }} placeholder="Price (e.g. ₹12.99)" className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />

                  <textarea value={prod.description || ''} onChange={e => {
                    const newProds = [...content.products_json];
                    newProds[idx] = { ...newProds[idx], description: e.target.value };
                    setContent({ ...content, products_json: newProds });
                  }} rows={2} placeholder="Description (e.g. Delicious homemade pasta...)" className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />

                  <ImageUpload
                    value={prod.image || ''}
                    onChange={(url: string) => {
                      const newProds = [...content.products_json];
                      newProds[idx] = { ...newProds[idx], image: url };
                      setContent({ ...content, products_json: newProds });
                    }}
                    placeholder="Image URL"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Phone</label>
                  <input
                    type="text"
                    value={content.contact_info?.phone || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, phone: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
                  <input
                    type="email"
                    value={content.contact_info?.email || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, email: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="hello@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Address</label>
                  <input
                    type="text"
                    value={content.contact_info?.address || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, address: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="123 Business St."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Office / Opening Hours</label>
                  <textarea
                    rows={2}
                    value={content.contact_info?.hours || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, hours: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner resize-none"
                    placeholder="Mon-Sun: 11:00 AM - 11:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Facebook Link</label>
                  <input
                    type="text"
                    value={content.contact_info?.facebook || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, facebook: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">WhatsApp Link</label>
                  <input
                    type="text"
                    value={content.contact_info?.whatsapp || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, whatsapp: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="https://wa.me/..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Instagram Link</label>
                  <input
                    type="text"
                    value={content.contact_info?.instagram || ''}
                    onChange={e => setContent({ ...content, contact_info: { ...content.contact_info, instagram: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm shadow-inner"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Section Order</label>
                <div className="space-y-2">
                  {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((section: string, idx: number, arr: string[]) => {
                    const isHidden = (content.settings_json?.hidden_sections || []).includes(section);
                    const isHero = section === 'hero';
                    return (
                      <div key={section} className={`flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-opacity ${isHidden && !isHero ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex items-center gap-3">
                          <button
                            disabled={isHero}
                            onClick={() => {
                              if (isHero) return;
                              const hidden = content.settings_json?.hidden_sections || [];
                              const newHidden = isHidden ? hidden.filter((s: string) => s !== section) : [...hidden, section];
                              setContent({ ...content, settings_json: { ...(content.settings_json || {}), hidden_sections: newHidden } });
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${isHero ? 'text-indigo-300 bg-indigo-50/50 cursor-not-allowed' : (isHidden ? 'text-slate-400 hover:text-indigo-600 bg-slate-100' : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50')}`}
                            title={isHero ? "Hero section cannot be hidden" : (isHidden ? "Show Section" : "Hide Section")}
                          >
                            {isHidden && !isHero ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <span className={`font-bold text-sm uppercase tracking-wider ${isHidden && !isHero ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{section}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            disabled={idx === 0 || isHero || (idx === 1 && arr[0] === 'hero')}
                            onClick={() => {
                              const newOrder = [...arr];
                              const temp = newOrder[idx - 1];
                              newOrder[idx - 1] = newOrder[idx];
                              newOrder[idx] = temp;
                              setContent({ ...content, settings_json: { ...(content.settings_json || {}), section_order: newOrder } });
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            disabled={idx === arr.length - 1 || isHero}
                            onClick={() => {
                              const newOrder = [...arr];
                              const temp = newOrder[idx + 1];
                              newOrder[idx + 1] = newOrder[idx];
                              newOrder[idx] = temp;
                              setContent({ ...content, settings_json: { ...(content.settings_json || {}), section_order: newOrder } });
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Custom Section</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => {
                      const newBlocks = [...(content.custom_blocks_json || []), { id: Date.now().toString(), type: 'heading', content: 'New Heading' }];
                      setContent({ ...content, custom_blocks_json: newBlocks });
                    }} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors"><Type size={14} /> Heading</button>
                    <button onClick={() => {
                      const newBlocks = [...(content.custom_blocks_json || []), { id: Date.now().toString(), type: 'paragraph', content: 'Type some text here...' }];
                      setContent({ ...content, custom_blocks_json: newBlocks });
                    }} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors"><Type size={14} /> Text</button>
                    <button onClick={() => {
                      const newBlocks = [...(content.custom_blocks_json || []), { id: Date.now().toString(), type: 'image', url: '' }];
                      setContent({ ...content, custom_blocks_json: newBlocks });
                    }} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors"><ImageIcon size={14} /> Image</button>
                    <button onClick={() => {
                      const newBlocks = [...(content.custom_blocks_json || []), { id: Date.now().toString(), type: 'divider' }];
                      setContent({ ...content, custom_blocks_json: newBlocks });
                    }} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors"><Minus size={14} /> Divider</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(content.custom_blocks_json || []).map((block: any, idx: number, arr: any[]) => (
                    <div key={block.id} className="p-5 bg-white border border-slate-200 rounded-xl flex gap-4 items-start relative group shadow-sm">
                      <button
                        onClick={() => {
                          const newBlocks = arr.filter((_, i) => i !== idx);
                          setContent({ ...content, custom_blocks_json: newBlocks });
                        }}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>

                      <div className="flex-1 w-full mt-2 pr-6">
                        {block.type === 'heading' && (
                          <input type="text" value={block.content} onChange={e => {
                            const newBlocks = [...arr];
                            newBlocks[idx] = { ...block, content: e.target.value };
                            setContent({ ...content, custom_blocks_json: newBlocks });
                          }} className="w-full text-lg font-bold border-b-2 border-slate-100 focus:border-indigo-500 outline-none pb-2 transition-colors bg-transparent" placeholder="Enter Heading..." />
                        )}
                        {block.type === 'paragraph' && (
                          <textarea rows={3} value={block.content} onChange={e => {
                            const newBlocks = [...arr];
                            newBlocks[idx] = { ...block, content: e.target.value };
                            setContent({ ...content, custom_blocks_json: newBlocks });
                          }} className="w-full text-sm border-2 border-slate-100 focus:border-indigo-500 rounded-xl p-3 outline-none resize-none transition-colors bg-transparent" placeholder="Enter text..." />
                        )}
                        {block.type === 'image' && (
                          <ImageUpload value={block.url} onChange={(url: string) => {
                            const newBlocks = [...arr];
                            newBlocks[idx] = { ...block, url };
                            setContent({ ...content, custom_blocks_json: newBlocks });
                          }} />
                        )}
                        {block.type === 'divider' && (
                          <div className="w-full flex items-center justify-center py-2">
                            <div className="w-full h-px bg-slate-200"></div>
                            <span className="absolute bg-white px-2 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Divider</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!content.custom_blocks_json || content.custom_blocks_json.length === 0) && (
                    <div className="text-center py-12 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-3">
                      <PlusCircle size={24} className="text-slate-300" />
                      <span>Build a custom section by adding elements above.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center pt-10 pb-6 animate-in fade-in zoom-in-95 duration-500">
              {!website.published ? (
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <Rocket size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-900 mb-2">Your site is unpublished</h3>
                  <p className="text-slate-500 text-sm max-w-[250px] mx-auto mb-6">
                    Publish your site to generate a live shareable link and QR code.
                  </p>
                  <button onClick={handleTogglePublish} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-colors flex items-center gap-2 mx-auto">
                    <Rocket size={16} /> Publish Now
                  </button>
                </div>
              ) : (
                <>
                  <div id="qr-code-wrapper" className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 mb-8 transform hover:scale-105 transition-transform duration-300">
                    <QRCode value={publicUrl} size={180} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">Ready to Share!</h3>
                  <p className="text-center text-slate-500 text-sm mb-6 max-w-[250px] font-medium">
                    Scan this QR code to view your website instantly on any mobile device.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-sm">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-6 py-3 rounded-xl font-black transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
                    >
                      <ExternalLink size={16} /> Open Link
                    </a>
                    <button
                      onClick={() => {
                        const svg = document.querySelector('#qr-code-wrapper svg');
                        if (!svg) return;
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        const img = new Image();
                        img.onload = () => {
                          canvas.width = img.width + 40; // Add padding
                          canvas.height = img.height + 40;
                          if (ctx) {
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 20, 20); // Draw with offset for padding
                          }
                          const pngFile = canvas.toDataURL("image/png");
                          const downloadLink = document.createElement("a");
                          downloadLink.download = `${website?.slug || 'website'}-qr.png`;
                          downloadLink.href = pngFile;
                          downloadLink.click();
                        };
                        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-black transition-colors flex items-center justify-center gap-2 shadow-md text-sm active:scale-95"
                    >
                      <Download size={16} /> Save QR Code
                    </button>
                  </div>
                  <button
                    onClick={() => setShowOrderStickerModal(true)}
                    className="w-full max-w-sm mt-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-black transition-colors flex items-center justify-center gap-2 shadow-sm text-sm border border-emerald-200"
                  >
                    <ShoppingCart size={16} /> Order Physical Stickers
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/50 p-5 rounded-2xl border border-white shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl">
                  Active
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Free Subdomain</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Included with your plan</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 font-bold text-sm text-slate-700 flex items-center justify-between shadow-inner">
                  <span>jaalam.app/{website.slug}</span>
                  <a href={publicUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-lg transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-indigo-100 to-transparent rounded-full mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                    <Link2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Custom Domain</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Purchase or connect existing</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
                    <span className="px-3 py-2.5 text-slate-400 bg-slate-100 border-r border-slate-200 select-none flex items-center font-bold text-sm">www.</span>
                    <input
                      type="text"
                      value={domainSearch}
                      onChange={(e) => setDomainSearch(e.target.value)}
                      className="flex-1 bg-transparent px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 font-bold text-sm w-full min-w-0"
                      placeholder="yourbusiness.com"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (domainSearch.trim()) {
                        window.open(`https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domainSearch.trim())}`, '_blank');
                      }
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} className="text-emerald-400" />
                    Check Availability
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-slate-500 font-medium">Already own a domain? </span>
                    <button
                      onClick={() => setShowDomainModal(true)}
                      className="text-[11px] font-black text-indigo-600 hover:underline"
                    >
                      Connect it here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className={`flex-1 relative z-10 w-full h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 ${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-col items-center p-4 lg:p-10 pt-12 lg:pt-12 overflow-x-hidden overflow-y-auto bg-slate-50/50`}>

        {/* Viewport Toggle */}
        <div className="flex bg-white rounded-full p-1 shadow-md border border-slate-200 mb-8 shrink-0 relative z-20">
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'mobile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone size={16} /> Mobile
          </button>
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'desktop' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Monitor size={16} /> Desktop
          </button>
        </div>

        {/* DEVICE FRAME */}
        <div
          className={`transition-all duration-500 flex flex-col bg-white overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] shrink-0 mb-auto
          ${previewDevice === 'mobile'
              ? 'w-[340px] h-[600px] rounded-[2.5rem] border-[8px] border-slate-900'
              : 'w-[1024px] lg:w-full lg:max-w-[1280px] h-[70vh] min-h-[550px] max-h-[800px] rounded-xl border-[8px] border-slate-800'
            }
        `}
          style={
            windowWidth < 1024
              ? previewDevice === 'desktop'
                ? {
                  transform: `scale(${Math.max(0.2, (windowWidth - 32) / 1024)})`,
                  transformOrigin: 'top center',
                  height: `calc(max(550px, 70vh) / ${Math.max(0.2, (windowWidth - 32) / 1024)})`,
                  maxHeight: `calc(800px / ${Math.max(0.2, (windowWidth - 32) / 1024)})`
                } as any
                : { transform: `scale(${Math.min(0.85, (windowWidth - 32) / 340)})`, transformOrigin: 'top center' } as any
              : {}
          }
        >

          {previewDevice === 'mobile' ? (
            <>
              {/* iPhone Notch */}
              <div className="h-6 w-full absolute top-0 z-50 flex justify-center pointer-events-none">
                <div className="w-[120px] h-[24px] bg-slate-900 rounded-b-[1rem]"></div>
              </div>
            </>
          ) : (
            <>
              {/* Browser Header */}
              <div className="h-10 bg-slate-800 w-full flex items-center px-4 gap-2 z-50 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="mx-auto min-w-[200px] h-6 bg-slate-700 rounded-md text-[10px] text-slate-400 flex items-center justify-center font-mono px-4 truncate">
                  {website?.slug}.jaalam.app
                </div>
              </div>
            </>
          )}

          {/* Live Website Content inside the frame */}
          <div className="flex-1 overflow-hidden bg-white relative">
            <iframe
              ref={iframeRef}
              src="/_preview"
              className="w-full h-full border-none"
              title="Live Preview"
            />
          </div>

          {previewDevice === 'mobile' && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full z-50 pointer-events-none"></div>
          )}
        </div>
      </div>


      {/* Domain Connection Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl relative overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in zoom-in-95 duration-300">

            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Connect Domain</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Custom DNS Setup</p>
                </div>
              </div>
              <button
                onClick={() => { setShowDomainModal(false); setConnectedDomain(''); setIsConnecting(false); setCustomDomain(''); }}
                className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors bg-white/50"
              >
                <X size={20} />
              </button>
            </div>

            {connectedDomain ? (
              <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center shadow-inner">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-0.5">Domain Connected!</h3>
                  <p className="text-sm font-medium text-emerald-700">Your domain <strong className="text-emerald-900">{connectedDomain}</strong> has been linked.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider text-center">Next Steps: Configure DNS</p>
                  <p className="text-xs text-slate-500 mb-3 text-center leading-relaxed px-4">
                    Login to your domain registrar and add the following<br />
                    <strong>A Record</strong> to point your domain to our servers:
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                      <span className="text-xs font-black text-slate-400 uppercase">Type</span>
                      <span className="text-sm font-black text-slate-900">A</span>
                    </div>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                      <span className="text-xs font-black text-slate-400 uppercase">Name</span>
                      <span className="text-sm font-black text-slate-900">@</span>
                    </div>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                      <span className="text-xs font-black text-slate-400 uppercase">Value</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">104.21.45.89</span>
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="Copy"><Copy size={14} /></button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center mt-3 italic">DNS propagation may take up to 48 hours.</p>
                </div>

                <button
                  onClick={() => { setShowDomainModal(false); setConnectedDomain(''); }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                >
                  Got it, close
                </button>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Enter the domain you already own. We will provide you with the DNS records needed to point it to your Jaalam website.
                </p>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Your Domain</label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
                    <span className="px-4 py-3 text-slate-400 bg-slate-100 border-r border-slate-200 select-none flex items-center font-bold text-sm">https://</span>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-900 placeholder-slate-400 font-bold text-sm w-full min-w-0"
                      placeholder="www.myrestaurant.com"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!customDomain.trim()) return;
                    setIsConnecting(true);
                    setTimeout(() => {
                      setConnectedDomain(customDomain);
                      setIsConnecting(false);
                    }, 1500);
                  }}
                  disabled={isConnecting || !customDomain.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Connecting...</>
                  ) : (
                    <><Link2 size={16} /> Verify & Connect</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Order Sticker Modal */}
      {showOrderStickerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl relative overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in zoom-in-95 duration-300">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Stickers</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Physical Delivery</p>
                </div>
              </div>
              <button
                onClick={() => { setShowOrderStickerModal(false); setOrderSuccess(false); setIsOrdering(false); }}
                className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors bg-white/50"
              >
                <X size={20} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center shadow-inner">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-0.5">Order Placed!</h3>
                  <p className="text-sm font-medium text-emerald-700">Your QR code stickers are being printed and will be shipped to your address.</p>
                </div>
                <button
                  onClick={() => { setShowOrderStickerModal(false); setOrderSuccess(false); }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                >
                  Got it, close
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Get premium physical QR code stickers shipped directly to your restaurant. Perfect for tables, windows, and counters.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">Premium Vinyl Stickers</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={orderForm.name}
                          onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-slate-400"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Phone No.</label>
                        <input
                          type="tel"
                          value={orderForm.phone}
                          onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-slate-400"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={orderForm.email}
                        onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-slate-400"
                        placeholder="john@restaurant.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Full Address (with Pincode)</label>
                      <textarea
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none h-20 shadow-sm placeholder:text-slate-400"
                        placeholder="123 Food Street, City, State, 123456"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const isValid = orderForm.name && orderForm.phone && orderForm.email && orderForm.address;
                    if (!isValid) return;
                    setIsOrdering(true);
                    try {
                      // 1. Create Physical Order
                      const res = await axios.post('http://localhost:8000/api/websites/physical-orders/', {
                        ...orderForm,
                        website: website?.id
                      }, { withCredentials: true });
                      
                      // 2. Create Razorpay Order
                      const rzpRes = await axios.post('http://localhost:8000/api/users/subscriptions/create_physical_order/', {
                        order_id: res.data.id
                      }, { withCredentials: true });
                      
                      const options = {
                        key: rzpRes.data.key,
                        amount: rzpRes.data.amount,
                        currency: rzpRes.data.currency,
                        name: "Jaalam QR Stickers",
                        description: `Physical QR Code Order`,
                        order_id: rzpRes.data.order_id,
                        handler: async function (response: any) {
                          try {
                            await axios.post('http://localhost:8000/api/users/subscriptions/verify_physical_order/', {
                              razorpay_payment_id: response.razorpay_payment_id,
                              razorpay_order_id: response.razorpay_order_id,
                              razorpay_signature: response.razorpay_signature
                            }, { withCredentials: true });
                            setOrderSuccess(true);
                            setOrderForm({ name: '', phone: '', email: '', address: '' });
                            toast.success('Order placed successfully!');
                          } catch (err) {
                            toast.error('Payment verification failed');
                          }
                        },
                        prefill: {
                          name: orderForm.name,
                          email: orderForm.email,
                          contact: orderForm.phone
                        },
                        theme: {
                          color: "#10b981", // emerald-500
                        },
                      };
                      
                      const rzp = new window.Razorpay(options);
                      rzp.open();
                    } catch (err) {
                      console.error(err);
                      toast.error('Failed to initiate order. Please try again.');
                    } finally {
                      setIsOrdering(false);
                    }
                  }}
                  disabled={isOrdering || !(orderForm.name && orderForm.phone && orderForm.email && orderForm.address)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2 mt-4"
                >
                  {isOrdering ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing Order...</>
                  ) : (
                    <><ShoppingCart size={16} /> Place Order Now at just ₹100</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {showGameModal && (
        <MiniGame onClose={() => setShowGameModal(false)} isAiFinished={!isChatting} />
      )}
    </div>
  );
}
