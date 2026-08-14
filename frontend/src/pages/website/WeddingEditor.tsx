import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  Save, ArrowLeft, Heart, BookOpen, Clock,
  MapPin, Settings, Share2, Eye, QrCode, Smartphone, Monitor, Palette, Users, LayoutList, ArrowUp, ArrowDown, EyeOff, Lock,
  Image as ImageIcon, Gift, Music as MusicIcon, Hourglass, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCodeLib from 'react-qr-code';
const QRCode = (QRCodeLib as any).default || QRCodeLib;
import { categoryThemes, eventHierarchy } from '../../utils/templateData';

const FileUpload = ({ onChange, accept, label }: { onChange: (url: string) => void, accept: string, label: string }) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/websites/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.url);
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className={`w-full mt-2 flex items-center justify-center py-2 px-4 rounded-xl font-bold text-xs cursor-pointer transition-all ${uploading ? 'bg-slate-200 text-slate-400' : 'bg-pink-50 text-pink-600 hover:bg-pink-100 shadow-sm border border-pink-100'}`}>
      <Upload size={14} className="mr-2" />
      {uploading ? 'Uploading...' : label}
      <input type="file" accept={accept} className="hidden" onChange={handleUpload} disabled={uploading} />
    </label>
  );
};

export default function WeddingEditor() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [website, setWebsite] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('theme');
  const [mainEventCategory, setMainEventCategory] = useState('Wedding');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (website?.business_type) {
      for (const [main, subCats] of Object.entries(eventHierarchy)) {
        if (Object.keys(subCats).includes(website.business_type)) {
          setMainEventCategory(main);
          break;
        }
      }
    }
  }, [website?.business_type]);

  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await axios.get(`/api/websites/${websiteId}/`);
        setWebsite(res.data);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load wedding invitation');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
  }, [websiteId, navigate]);

  // Sync with iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        setIframeReady(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (iframeReady && iframeRef.current && content) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'UPDATE_PREVIEW',
        website,
        content
      }, '*');
    }
  }, [content, iframeReady, website]);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    const loadingToast = toast.loading('Saving changes...');
    try {
      await axios.patch(`/api/websites/${websiteId}/`, {
        theme: website.theme,
        business_type: website.business_type
      });
      await axios.put(`/api/websites/${websiteId}/content/`, content);
      toast.success('Changes saved!', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`/api/websites/${websiteId}/`, {
        published: !website.published
      });
      setWebsite(res.data);
      toast.success(res.data.published ? 'Invitation is now live!' : 'Invitation unpublished.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !website || !content) {
    return (
      <div className="flex items-center justify-center h-screen bg-pink-50/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Ensure default wedding struct exists
  const weddingData = content.settings_json?.wedding || {};
  const setWeddingData = (updates: any) => {
    setContent({
      ...content,
      settings_json: {
        ...(content.settings_json || {}),
        wedding: { ...weddingData, ...updates }
      }
    });
  };

  const tabs = [
    { id: 'theme', icon: <Palette size={16} />, label: 'Theme' },
    { id: 'couple', icon: <Heart size={16} />, label: 'Key People' },
    { id: 'family', icon: <Users size={16} />, label: 'Family' },
    { id: 'story', icon: <BookOpen size={16} />, label: 'Story' },
    { id: 'schedule', icon: <Clock size={16} />, label: 'Schedule' },
    { id: 'venue', icon: <MapPin size={16} />, label: 'Venue' },
    { id: 'gallery', icon: <ImageIcon size={16} />, label: 'Gallery' },
    { id: 'music', icon: <MusicIcon size={16} />, label: 'Music' },
    { id: 'countdown', icon: <Hourglass size={16} />, label: 'Countdown' },
    { id: 'share', icon: <Share2 size={16} />, label: 'Share' },
    { id: 'layout', icon: <LayoutList size={16} />, label: 'Layout' },
  ];

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  const currentSections = weddingData.sections || defaultSections;

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const publicUrl = isLocal ? `${window.location.origin}/${website.slug}` : `https://${website.slug}.jaalam.app`;

  return (
    <div className="flex h-screen bg-pink-50/20 font-sans overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-200 mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200 mix-blend-multiply filter blur-[120px] opacity-40"></div>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-pink-100 z-50 flex items-center justify-between px-4">
        <Link to="/dashboard" className="p-2 bg-pink-50 rounded-xl text-pink-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex bg-pink-50 p-1 rounded-xl mx-1">
          <button onClick={() => setMobileView('editor')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mobileView === 'editor' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500'}`}>Edit</button>
          <button onClick={() => setMobileView('preview')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mobileView === 'preview' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500'}`}>Preview</button>
        </div>
      </div>

      {/* Left Panel */}
      <div className={`w-full lg:w-[420px] h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 bg-white/70 backdrop-blur-2xl lg:border-r border-pink-100 shadow-xl flex flex-col relative z-20 ${mobileView === 'editor' ? 'flex' : 'hidden lg:flex'}`}>

        <div className="hidden lg:flex p-5 border-b border-pink-100 items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="font-serif italic font-bold text-slate-800 text-xl truncate px-2">{content.hero_title || 'Wedding Invite'}</h2>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-pink-100 transition-colors">
              <Save size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-3 gap-2 border-b border-pink-100 overflow-x-auto scrollbar-hide shrink-0 bg-white/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-pink-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Main Event Type (Read-Only)</label>
                    <input
                      type="text"
                      value={mainEventCategory}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-100/50 text-slate-500 rounded-xl outline-none font-bold text-sm border-none shadow-inner cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Sub-Category</label>
                    <select
                      value={website.business_type || 'Wedding Invitation'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newTheme = eventHierarchy[mainEventCategory][val][0];
                        const newWebsite = { ...website, business_type: val, theme: newTheme };
                        setWebsite(newWebsite);
                        if (iframeRef.current?.contentWindow) {
                          iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_PREVIEW', website: newWebsite, content }, '*');
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium text-sm border-none shadow-sm cursor-pointer"
                    >
                      {Object.keys(eventHierarchy[mainEventCategory] || {}).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Select Theme</label>
                  <select
                    value={website.theme || 'Classic'}
                    onChange={e => {
                      const newWebsite = { ...website, theme: e.target.value };
                      setWebsite(newWebsite);
                      if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage({
                          type: 'UPDATE_PREVIEW',
                          website: newWebsite,
                          content
                        }, '*');
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium text-sm border-none shadow-sm cursor-pointer"
                  >
                    {(eventHierarchy[mainEventCategory]?.[website.business_type] || []).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <p className="mt-3 text-xs text-slate-500 font-medium">Changing the theme will instantly update the preview on the right.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <p className="text-xs text-slate-500 mb-4">Use arrows to reorder sections. Use the eye icon to hide sections you don't need.</p>

                <div className="space-y-3">
                  {currentSections.map((section: any, idx: number) => (
                    <div key={section.id} className={`flex items-center justify-between p-4 rounded-xl border ${section.visible ? 'bg-white border-pink-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (section.locked) return;
                            const newSections = [...currentSections];
                            newSections[idx].visible = !newSections[idx].visible;
                            setWeddingData({ sections: newSections });
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${section.locked ? 'text-slate-300 cursor-not-allowed' : section.visible ? 'text-pink-500 hover:bg-pink-50' : 'text-slate-400 hover:bg-slate-200'}`}
                        >
                          {section.locked ? <Lock size={16} /> : (section.visible ? <Eye size={16} /> : <EyeOff size={16} />)}
                        </button>
                        <span className={`font-bold text-sm ${section.visible ? 'text-slate-700' : 'text-slate-400'}`}>{section.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (idx === 0 || currentSections[idx - 1]?.locked || section.locked) return;
                            const newSections = [...currentSections];
                            [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
                            setWeddingData({ sections: newSections });
                          }}
                          disabled={idx === 0 || currentSections[idx - 1]?.locked || section.locked}
                          className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (idx === currentSections.length - 1 || section.locked) return;
                            const newSections = [...currentSections];
                            [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
                            setWeddingData({ sections: newSections });
                          }}
                          disabled={idx === currentSections.length - 1 || section.locked}
                          className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'couple' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Couple Image</label>
                  <input
                    type="text"
                    value={content.hero?.image || ''}
                    onChange={(e) => setContent({ ...content, hero: { ...(content.hero || {}), image: e.target.value } })}
                    placeholder="https://example.com/couple.jpg"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium text-sm"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Image"
                    onChange={(url) => setContent({ ...content, hero: { ...(content.hero || {}), image: url } })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Couple Names</label>
                  <input
                    type="text"
                    value={content.hero_title || ''}
                    onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                    placeholder="Alex & Jordan"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Wedding Date</label>
                  <input
                    type="text"
                    value={weddingData.date || ''}
                    onChange={(e) => setWeddingData({ date: e.target.value })}
                    placeholder="September 15, 2026"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Groom's Parents & Family</label>
                  <input
                    type="text"
                    value={weddingData.groomParents || ''}
                    onChange={(e) => setWeddingData({ groomParents: e.target.value })}
                    placeholder="Mr. & Mrs. Smith (Smith Family)"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium"
                  />
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Groom's Photo</label>
                    {weddingData.groomPhoto && (
                      <div className="mb-2 w-20 h-20 rounded-full overflow-hidden border-2 border-pink-100">
                        <img src={weddingData.groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <FileUpload
                      accept="image/*"
                      label={weddingData.groomPhoto ? "Change Photo" : "Upload Groom's Photo"}
                      onChange={(url) => setWeddingData({ groomPhoto: url })}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Bride's Parents & Family</label>
                  <input
                    type="text"
                    value={weddingData.brideParents || ''}
                    onChange={(e) => setWeddingData({ brideParents: e.target.value })}
                    placeholder="Mr. & Mrs. Doe (Doe Family)"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium"
                  />
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Bride's Photo</label>
                    {weddingData.bridePhoto && (
                      <div className="mb-2 w-20 h-20 rounded-full overflow-hidden border-2 border-pink-100">
                        <img src={weddingData.bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <FileUpload
                      accept="image/*"
                      label={weddingData.bridePhoto ? "Change Photo" : "Upload Bride's Photo"}
                      onChange={(url) => setWeddingData({ bridePhoto: url })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Our Story</label>
                  <textarea
                    rows={6}
                    value={content.about_text || ''}
                    onChange={(e) => setContent({ ...content, about_text: e.target.value })}
                    placeholder="We met at a coffee shop..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'venue' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Full Address & Landmarks</label>
                  <textarea
                    rows={3}
                    value={content.contact_info?.address || ''}
                    onChange={(e) => setContent({ ...content, contact_info: { ...(content.contact_info || {}), address: e.target.value } })}
                    placeholder="Grand Convention Center, Near Main Junction..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={weddingData.mapUrl || ''}
                    onChange={(e) => setWeddingData({ mapUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium"
                  />
                  <p className="mt-2 text-xs text-slate-400">Go to Google Maps, click Share &gt; Embed a map, and copy the 'src' link.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">RSVP / Contact Numbers</label>
                  <input
                    type="text"
                    value={weddingData.contactNumbers || ''}
                    onChange={(e) => setWeddingData({ contactNumbers: e.target.value })}
                    placeholder="+91 9876543210, +91 9876543211"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Photo Gallery</h3>
                  <button
                    onClick={() => {
                      const currentGallery = weddingData.gallery || [];
                      setWeddingData({ gallery: [...currentGallery, ""] });
                    }}
                    className="text-pink-600 text-xs font-bold bg-pink-50 px-3 py-1.5 rounded-lg"
                  >
                    + Add Image URL
                  </button>
                </div>
                {(weddingData.gallery || []).map((url: string, index: number) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={url}
                      onChange={e => {
                        const newGallery = [...(weddingData.gallery || [])];
                        newGallery[index] = e.target.value;
                        setWeddingData({ gallery: newGallery });
                      }}
                      className="flex-1 px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      onClick={() => {
                        const newGallery = (weddingData.gallery || []).filter((_: any, i: number) => i !== index);
                        setWeddingData({ gallery: newGallery });
                      }}
                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    >
                      <EyeOff size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Background Music (MP3 URL)</label>
                  <input
                    type="text"
                    value={weddingData.musicUrl || ''}
                    onChange={e => setWeddingData({ musicUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium text-sm"
                    placeholder="https://example.com/audio.mp3"
                  />
                  <FileUpload
                    accept="audio/*"
                    label="Upload MP3 File"
                    onChange={(url) => setWeddingData({ musicUrl: url })}
                  />
                  <p className="text-[10px] text-slate-400 mt-3">Provide a direct link or upload an MP3 file to enable background music on your site.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'countdown' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Target Date & Time</label>
                  <input
                    type="datetime-local"
                    value={weddingData.countdownDate || ''}
                    onChange={e => setWeddingData({ countdownDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none font-medium text-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">A live countdown will appear on the hero section.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Events</label>
                  <button
                    onClick={() => {
                      const currentSched = weddingData.schedule || [];
                      setWeddingData({ schedule: [...currentSched, { time: "12:00 PM", event: "New Event" }] });
                    }}
                    className="text-xs text-pink-600 font-bold"
                  >
                    + Add Event
                  </button>
                </div>
                {(weddingData.schedule || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const newSched = [...(weddingData.schedule || [])];
                          newSched[idx] = { ...newSched[idx], time: e.target.value };
                          setWeddingData({ schedule: newSched });
                        }}
                        placeholder="Time"
                        className="w-full bg-white px-3 py-1.5 rounded-lg text-sm border-none shadow-sm focus:ring-1 focus:ring-pink-500"
                      />
                      <input
                        type="text"
                        value={item.event}
                        onChange={(e) => {
                          const newSched = [...(weddingData.schedule || [])];
                          newSched[idx] = { ...newSched[idx], event: e.target.value };
                          setWeddingData({ schedule: newSched });
                        }}
                        placeholder="Event Name"
                        className="w-full bg-white px-3 py-1.5 rounded-lg text-sm border-none shadow-sm focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newSched = (weddingData.schedule || []).filter((_: any, i: number) => i !== idx);
                        setWeddingData({ schedule: newSched });
                      }}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 text-center">
                <button onClick={handlePublish} disabled={saving} className={`w-full py-3 rounded-xl font-bold mb-6 transition-colors shadow-sm ${website.published ? 'bg-red-50 text-red-600' : 'bg-pink-600 text-white'}`}>
                  {website.published ? 'Unpublish Invitation' : 'Publish Invitation'}
                </button>

                {website.published && (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 inline-block">
                      <QRCode value={publicUrl} size={150} />
                    </div>
                    <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-pink-600 flex items-center justify-center gap-2 mb-2">
                      <Share2 size={16} /> Open Public Link
                    </a>
                    <p className="text-xs text-slate-400">{publicUrl}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className={`flex-1 relative z-10 w-full h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 ${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-col items-center p-4 lg:p-10 pt-12 lg:pt-12 overflow-x-hidden overflow-y-auto`}>

        <div className="flex bg-white rounded-full p-1 shadow-md border border-pink-100 mb-8 shrink-0 relative z-20">
          <button onClick={() => setPreviewDevice('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'mobile' ? 'bg-pink-50 text-pink-600' : 'text-slate-400'}`}>
            <Smartphone size={16} /> Mobile
          </button>
          <button onClick={() => setPreviewDevice('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'desktop' ? 'bg-pink-50 text-pink-600' : 'text-slate-400'}`}>
            <Monitor size={16} /> Desktop
          </button>
        </div>

        {/* Device Frame */}
        <div className={`transition-all duration-500 flex flex-col bg-white overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(236,72,153,0.3)] shrink-0 mb-auto
          ${previewDevice === 'mobile'
            ? 'w-[340px] h-[600px] rounded-[2.5rem] border-[8px] border-slate-900'
            : 'w-[1024px] lg:w-full lg:max-w-[1280px] h-[70vh] min-h-[550px] max-h-[800px] rounded-xl border-[8px] border-slate-800'
          }`}
          style={
            windowWidth < 1024
              ? previewDevice === 'desktop'
                ? { transform: `scale(${Math.max(0.2, (windowWidth - 32) / 1024)})`, transformOrigin: 'top center', height: `calc(max(550px, 70vh) / ${Math.max(0.2, (windowWidth - 32) / 1024)})` } as any
                : { transform: `scale(${Math.min(0.85, (windowWidth - 32) / 340)})`, transformOrigin: 'top center' } as any
              : {}
          }
        >
          {previewDevice === 'mobile' ? (
            <div className="h-6 w-full absolute top-0 z-50 flex justify-center pointer-events-none">
              <div className="w-[120px] h-[24px] bg-slate-900 rounded-b-[1rem]"></div>
            </div>
          ) : (
            <div className="h-10 bg-slate-800 w-full flex items-center px-4 gap-2 z-50 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="mx-auto min-w-[200px] h-6 bg-slate-700 rounded-md text-[10px] text-slate-400 flex items-center justify-center font-mono px-4 truncate">
                {website.slug}.jaalam.app
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden bg-white relative">
            <iframe ref={iframeRef} src="/_preview" className="w-full h-full border-none"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
