import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, Copy, CheckCircle2, Megaphone, Camera, Share2, Mail, MessageSquare, Image as ImageIcon, Smartphone, Video, Palette, Download, Star } from 'lucide-react';

interface Website {
  id: number;
  slug: string;
  theme: string;
  business_type: string;
  content?: {
    settings_json?: {
      website_name?: string;
    };
  };
}

interface MarketingData {
  instagram: string;
  facebook: string;
  whatsapp: string;
  email_subject: string;
  email_body: string;
  sms: string;
  banner_text: string;
  video_script: string;
}

interface MarketingPageProps {
  websites: Website[];
}

export default function MarketingPage({ websites }: MarketingPageProps) {
  const [selectedSite, setSelectedSite] = useState<number | ''>('');
  const [promotionDetails, setPromotionDetails] = useState('');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'campaign' | 'poster'>('poster');

  const [posterPrompt, setPosterPrompt] = useState('');
  const [posterBrandName, setPosterBrandName] = useState('');
  const [posterHeadline, setPosterHeadline] = useState('');
  const [posterOffer, setPosterOffer] = useState('');
  const [posterCTA, setPosterCTA] = useState('');
  const [posterWebsite, setPosterWebsite] = useState('');
  const [posterLayout, setPosterLayout] = useState('split-right');
  const [posterColor, setPosterColor] = useState('bg-[#6b2158] text-white');
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);

  const handleGeneratePoster = async () => {
    if (!posterPrompt) {
      toast.error('Please enter a description for the poster');
      return;
    }

    setIsGeneratingPoster(true);
    const loadingToast = toast.loading('AI is designing your poster...');

    try {
      const res = await axios.post('/api/marketing/poster/', {
        prompt: posterPrompt
      }, { withCredentials: true });

      setPosterImage(res.data.image);
      toast.success('Poster generated successfully!', { id: loadingToast });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate poster', { id: loadingToast });
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSite) {
      toast.error('Please select a website first');
      return;
    }
    if (!promotionDetails) {
      toast.error('Please enter promotion details');
      return;
    }

    const site = websites.find(w => w.id === selectedSite);
    if (!site) return;

    setIsGenerating(true);
    const loadingToast = toast.loading('AI is crafting your marketing campaign...');

    try {
      const res = await axios.post('/api/marketing/generate/', {
        business_name: site.content?.settings_json?.website_name || site.slug,
        business_type: site.business_type,
        promotion_details: promotionDetails,
        language: language
      }, { withCredentials: true });

      setMarketingData(res.data);
      toast.success('Campaign generated successfully!', { id: loadingToast });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate campaign', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-indigo-600 rounded-lg shadow-sm border border-slate-200 backdrop-blur-md transition-all"
      title="Copy to clipboard"
    >
      {copiedField === field ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
    </button>
  );

  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-500 pb-20">
      
      {/* Tabs */}
      <div className="flex p-1 mb-8 bg-slate-200/50 rounded-2xl w-fit backdrop-blur-sm border border-slate-200/60">
        <button
          onClick={() => setActiveTab('campaign')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'campaign' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
        >
          <Megaphone size={18} className={activeTab === 'campaign' ? 'text-fuchsia-500' : ''} />
          Campaign Generator
        </button>
        <button
          onClick={() => setActiveTab('poster')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'poster' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
        >
          <Palette size={18} className={activeTab === 'poster' ? 'text-emerald-500' : ''} />
          AI Poster Designer
        </button>
      </div>

      {activeTab === 'campaign' && (
        <>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 border border-fuchsia-500/20 text-fuchsia-700 text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles size={14} className="text-fuchsia-500" />
          AI Marketing Center
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Generator</h2>
        <p className="text-slate-500 mt-2 font-medium text-sm max-w-2xl">
          Instantly generate high-converting copy for all your marketing channels with one click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Megaphone className="text-indigo-500" size={20} />
              Campaign Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Select Website
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="">-- Choose a project --</option>
                  {websites.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.content?.settings_json?.website_name || w.slug} ({w.business_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Output Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="English">English</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Promotion Details
                </label>
                <textarea
                  value={promotionDetails}
                  onChange={(e) => setPromotionDetails(e.target.value)}
                  placeholder="e.g. Summer Sale 20% off all items this weekend only!"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none h-32"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedSite || !promotionDetails}
                className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white shadow-md transition-all ${
                  isGenerating || !selectedSite || !promotionDetails
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                }`}
              >
                {!isGenerating && <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>}
                <Sparkles size={18} className={isGenerating ? "animate-spin" : ""} />
                <span className="relative z-10">{isGenerating ? 'Generating Magic...' : 'Generate Campaign'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8">
          {marketingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group">
                <div className="flex items-center gap-2 mb-3 text-pink-600">
                  <Camera size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">Instagram Post</h4>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap font-medium pr-8">{marketingData.instagram}</div>
                <CopyButton text={marketingData.instagram} field="instagram" />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group">
                <div className="flex items-center gap-2 mb-3 text-blue-600">
                  <Share2 size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">Facebook Post</h4>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap font-medium pr-8">{marketingData.facebook}</div>
                <CopyButton text={marketingData.facebook} field="facebook" />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group">
                <div className="flex items-center gap-2 mb-3 text-emerald-500">
                  <MessageSquare size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">WhatsApp Broadcast</h4>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap font-medium pr-8">{marketingData.whatsapp}</div>
                <CopyButton text={marketingData.whatsapp} field="whatsapp" />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group">
                <div className="flex items-center gap-2 mb-3 text-orange-500">
                  <ImageIcon size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">Banner Headline</h4>
                </div>
                <div className="text-sm text-slate-700 font-medium pr-8">{marketingData.banner_text}</div>
                <CopyButton text={marketingData.banner_text} field="banner_text" />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group md:col-span-2">
                <div className="flex items-center gap-2 mb-3 text-indigo-500">
                  <Mail size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">Email Campaign</h4>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Subject:</span>
                  <div className="text-sm font-black text-slate-900 mt-1">{marketingData.email_subject}</div>
                </div>
                <div className="w-full h-px bg-slate-100 my-3"></div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap font-medium pr-8">{marketingData.email_body}</div>
                <CopyButton text={`Subject: ${marketingData.email_subject}\n\n${marketingData.email_body}`} field="email" />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group md:col-span-2">
                <div className="flex items-center gap-2 mb-3 text-slate-600">
                  <Smartphone size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">SMS Blast</h4>
                </div>
                <div className="text-sm text-slate-700 font-medium pr-8">{marketingData.sms}</div>
                <CopyButton text={marketingData.sms} field="sms" />
                </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm relative group md:col-span-2">
                <div className="flex items-center gap-2 mb-3 text-rose-500">
                  <Video size={18} />
                  <h4 className="font-black text-sm uppercase tracking-wider">Video Script (TikTok/Reels)</h4>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap font-medium pr-8">{marketingData.video_script}</div>
                <CopyButton text={marketingData.video_script} field="video_script" />
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white/20">
              <Sparkles size={48} className="mb-4 opacity-20" />
              <p className="font-bold text-lg">Your generated campaign will appear here</p>
              <p className="text-sm font-medium mt-1">Fill out the details on the left and click generate.</p>
            </div>
          )}
      </div>
        </>
      )}

      {/* Poster Generator Section */}
      {activeTab === 'poster' && (
        <>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-black uppercase tracking-wider mb-4">
          <Palette size={14} className="text-emerald-500" />
          AI Poster Designer
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Poster Generator</h2>
        <p className="text-slate-500 mt-2 font-medium text-sm max-w-2xl">
          Create stunning promotional graphics and posters in seconds. Powered by Hugging Face.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon className="text-emerald-500" size={20} />
              Poster Details
            </h3>
            
            <div className="space-y-4">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    1. Choose a Design Template
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPosterLayout('centered')} className={`p-3 border rounded-xl text-xs font-bold transition-all ${posterLayout === 'centered' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Classic Centered</button>
                    <button onClick={() => setPosterLayout('split-right')} className={`p-3 border rounded-xl text-xs font-bold transition-all ${posterLayout === 'split-right' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Modern Split (Right)</button>
                    <button onClick={() => setPosterLayout('split-left')} className={`p-3 border rounded-xl text-xs font-bold transition-all ${posterLayout === 'split-left' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Modern Split (Left)</button>
                    <button onClick={() => setPosterLayout('bottom-banner')} className={`p-3 border rounded-xl text-xs font-bold transition-all ${posterLayout === 'bottom-banner' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Bottom Banner</button>
                  </div>
                </div>

                {posterLayout !== 'centered' && (
                  <div className="mt-4">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                      Theme Color
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => setPosterColor('bg-[#6b2158] text-white')} className={`w-8 h-8 rounded-full bg-[#6b2158] border-2 transition-all ${posterColor.includes('6b2158') ? 'border-emerald-500 scale-110' : 'border-transparent shadow-sm'}`} title="Plum"></button>
                      <button onClick={() => setPosterColor('bg-emerald-800 text-white')} className={`w-8 h-8 rounded-full bg-emerald-800 border-2 transition-all ${posterColor.includes('emerald-800') ? 'border-emerald-500 scale-110' : 'border-transparent shadow-sm'}`} title="Emerald"></button>
                      <button onClick={() => setPosterColor('bg-slate-900 text-white')} className={`w-8 h-8 rounded-full bg-slate-900 border-2 transition-all ${posterColor.includes('slate-900') ? 'border-emerald-500 scale-110' : 'border-transparent shadow-sm'}`} title="Dark"></button>
                      <button onClick={() => setPosterColor('bg-white/95 text-slate-900')} className={`w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 transition-all ${posterColor.includes('white/95') ? 'border-emerald-500 scale-110' : 'shadow-sm'}`} title="Light"></button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Brand or Boutique Name
                </label>
                <input
                  type="text"
                  value={posterBrandName}
                  onChange={(e) => setPosterBrandName(e.target.value)}
                  placeholder="e.g. LUMINAIRE"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Headline Text
                </label>
                <input
                  type="text"
                  value={posterHeadline}
                  onChange={(e) => setPosterHeadline(e.target.value)}
                  placeholder="e.g. NEW COLLECTION"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Offer or Subheading
                </label>
                <input
                  type="text"
                  value={posterOffer}
                  onChange={(e) => setPosterOffer(e.target.value)}
                  placeholder="e.g. UP TO 30% OFF"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Call to Action (Button)
                </label>
                <input
                  type="text"
                  value={posterCTA}
                  onChange={(e) => setPosterCTA(e.target.value)}
                  placeholder="e.g. SHOP NOW"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Website / Contact
                </label>
                <input
                  type="text"
                  value={posterWebsite}
                  onChange={(e) => setPosterWebsite(e.target.value)}
                  placeholder="e.g. www.yourboutique.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Background Image Prompt
                </label>
                <textarea
                  value={posterPrompt}
                  onChange={(e) => setPosterPrompt(e.target.value)}
                  placeholder="e.g. A vibrant retro 80s style poster for a summer coffee sale, high quality, digital art"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none h-32"
                />
              </div>

              <button
                onClick={handleGeneratePoster}
                disabled={isGeneratingPoster || !posterPrompt}
                className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white shadow-md transition-all ${
                  isGeneratingPoster || !posterPrompt
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/25 hover:-translate-y-0.5'
                }`}
              >
                {!isGeneratingPoster && <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>}
                <Palette size={18} className={isGeneratingPoster ? "animate-pulse" : ""} />
                <span className="relative z-10">{isGeneratingPoster ? 'Designing Poster...' : 'Generate Poster'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8">
          {posterImage ? (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center">
              
              <div className="relative w-full max-w-2xl mb-6 overflow-hidden rounded-2xl shadow-md border border-slate-200 group bg-slate-100 flex items-center justify-center min-h-[400px]">
                <img src={posterImage} alt="Generated Poster" className="w-full h-auto object-contain" />
                
                {/* CSS Text Overlays based on Layout */}
                
                {/* 1. Classic Centered Layout */}
                {posterLayout === 'centered' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center drop-shadow-2xl pointer-events-none z-10">
                    <div className="w-full flex flex-col items-center gap-4">
                      {posterBrandName && (
                        <div className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.3em] opacity-90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mt-2">
                          {posterBrandName}
                        </div>
                      )}
                      {posterHeadline && (
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-widest mt-2 break-words w-full" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)' }}>
                          {posterHeadline}
                        </h2>
                      )}
                    </div>
                    {posterOffer && (
                      <div className="bg-white/95 backdrop-blur-sm text-slate-900 px-8 py-4 rounded-xl border border-white/50 shadow-2xl mb-8 transform -rotate-2 inline-block">
                        <p className="text-2xl sm:text-3xl font-black tracking-tight uppercase break-words">
                          {posterOffer}
                        </p>
                      </div>
                    )}
                    <div className="w-full flex flex-col items-center gap-6 mb-4">
                      {posterCTA && (
                        <div className="bg-emerald-500 text-white px-8 py-3 rounded-full text-lg font-black tracking-widest shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] uppercase">
                          {posterCTA}
                        </div>
                      )}
                      {posterWebsite && (
                        <div className="text-sm sm:text-base font-bold text-white tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                          {posterWebsite}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Modern Split Layouts */}
                {(posterLayout === 'split-right' || posterLayout === 'split-left') && (
                  <div className={`absolute inset-0 flex flex-col p-6 sm:p-8 pointer-events-none z-10 ${posterLayout === 'split-right' ? 'items-end' : 'items-start'}`}>
                    <div className={`w-[50%] h-full ${posterColor} rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-white/20 backdrop-blur-md`}>
                      <div className="w-full flex flex-col items-center gap-2">
                        {posterBrandName && (
                          <div className="text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.2em] opacity-90 mb-4 pb-4 border-b-2 border-current w-3/4">
                            {posterBrandName}
                          </div>
                        )}
                        {posterHeadline && (
                          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight break-words w-full leading-tight drop-shadow-sm">
                            {posterHeadline}
                          </h2>
                        )}
                      </div>
                      
                      {posterOffer && (
                        <div className="py-6 px-2 w-full">
                          <p className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-md">
                            {posterOffer}
                          </p>
                          <div className="flex items-center justify-center gap-3 mt-4 opacity-70">
                             <span className="w-12 h-[2px] bg-current"></span>
                             <Star size={16} fill="currentColor" />
                             <span className="w-12 h-[2px] bg-current"></span>
                          </div>
                        </div>
                      )}

                      <div className="w-full flex flex-col items-center gap-4 mt-auto">
                        {posterCTA && (
                          <div className={`px-8 py-3 rounded-full text-xs sm:text-sm font-black tracking-wider shadow-lg uppercase w-full max-w-[200px] ${posterColor.includes('text-slate-900') ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                            {posterCTA}
                          </div>
                        )}
                        {posterWebsite && (
                          <div className="text-[10px] sm:text-xs font-bold tracking-widest opacity-80 mt-2">
                            {posterWebsite}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Bottom Banner Layout */}
                {posterLayout === 'bottom-banner' && (
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center pointer-events-none z-10">
                    <div className={`w-full ${posterColor} p-6 sm:p-8 flex flex-col justify-center items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md`}>
                      {posterBrandName && (
                        <div className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] opacity-80 mb-3">
                          {posterBrandName}
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-6 w-full max-w-2xl mt-2 mb-2">
                        {posterHeadline && (
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight flex-1 text-right border-r-2 border-current/20 pr-6">
                            {posterHeadline}
                          </h2>
                        )}
                        {posterOffer && (
                          <div className="flex-1 text-left pl-2">
                            <p className="text-2xl sm:text-3xl font-black tracking-tighter uppercase drop-shadow-sm">
                              {posterOffer}
                            </p>
                            {posterWebsite && <p className="text-[10px] sm:text-xs font-bold tracking-widest opacity-80 mt-1">{posterWebsite}</p>}
                          </div>
                        )}
                      </div>
                      {posterCTA && (
                        <div className="absolute -top-5 sm:-top-6 bg-emerald-500 text-white px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black tracking-widest shadow-xl uppercase border-4 border-slate-100">
                          {posterCTA}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <a
                href={posterImage}
                download="generated-poster-background.jpg"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black shadow-md hover:bg-slate-800 transition-colors"
              >
                <Download size={18} />
                Download Background Image
              </a>
              <p className="text-xs text-slate-500 mt-4 font-medium text-center">
                Note: AI models generate art, not text. We added your text as a CSS overlay on top of the image! <br/>
                To save the final poster with text, take a screenshot of the image above.
              </p>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white/20">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <p className="font-bold text-lg">Your generated poster will appear here</p>
              <p className="text-sm font-medium mt-1">Describe what you want to see and click generate.</p>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
