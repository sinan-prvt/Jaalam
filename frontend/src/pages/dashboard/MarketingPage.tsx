import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, Copy, CheckCircle2, Megaphone, Camera, Share2, Mail, MessageSquare, Image as ImageIcon, Smartphone, Video } from 'lucide-react';

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
      </div>
    </div>
  );
}
