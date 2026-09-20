import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  Save, ArrowLeft, BookOpen, Clock,
  MapPin, Settings, Share2, Eye, QrCode, Smartphone, Monitor, Palette, Users, LayoutList, ArrowUp, ArrowDown, EyeOff, Lock,
  Image as ImageIcon, Gift, Upload, PlusCircle, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eventHierarchy } from '../../utils/templateData';

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
    <label className={`w-full mt-2 flex items-center justify-center py-2 px-4 rounded-xl font-bold text-xs cursor-pointer transition-all ${uploading ? 'bg-slate-200 text-slate-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-sm border border-emerald-100'}`}>
      <Upload size={14} className="mr-2" />
      {uploading ? 'Uploading...' : label}
      <input type="file" accept={accept} className="hidden" onChange={handleUpload} disabled={uploading} />
    </label>
  );
};

export default function ReligiousEventEditor() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [website, setWebsite] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('theme');
  const [mainEventCategory, setMainEventCategory] = useState('Religious Events');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await axios.get(`/api/websites/${websiteId}/`);
        setWebsite(res.data);

        const rawContent = res.data.content || {};
        const rawReligious = rawContent.settings_json?.religious_event || {};

        const defaultReligious = {
          tagline: rawReligious.tagline || rawContent.quote || 'In the name of God, the Most Gracious, the Most Merciful',
          organization_name: rawReligious.organization_name || rawContent.hero_title || 'Islamic Center',
          leader_title: rawReligious.leader_title || 'Imam / Priest',
          leader_name: rawReligious.leader_name || '',
          leader_photo: rawReligious.leader_photo || '',
          vision_mission: rawReligious.vision_mission || 'To serve the community and foster a deep sense of faith and belonging.',
          about_title: rawReligious.about_title || rawContent.about_title || 'About Us',
          about_description: rawReligious.about_description || rawContent.about_text || 'Welcome to our religious center...',
          cover_image: rawReligious.cover_image || rawContent.hero?.image || '',
          mapUrl: rawReligious.mapUrl || 'https://maps.app.goo.gl/Vg34LGmsU',
          contactNumbers: rawReligious.contactNumbers || '123-456-7890',
          schedule: rawReligious.schedule || [
            { id: 1, name: "Friday Prayer (Jummah)", time: "1:30 PM", description: "Weekly congregational prayer." }
          ],
          donations: rawReligious.donations || [
            { id: 1, cause: "General Fund", amount: "Any", description: "Support the operational costs." }
          ],
          gallery: rawReligious.gallery || [],
          sections: rawReligious.sections || [
            { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
            { id: 'about', label: 'About & Vision', visible: true },
            { id: 'schedule', label: 'Schedule & Prayers', visible: true },
            { id: 'donations', label: 'Donations', visible: true },
            { id: 'gallery', label: 'Gallery', visible: true },
            { id: 'contact', label: 'Location & Contact', visible: true }
          ],
          ...rawReligious
        };

        const mergedContent = {
          ...rawContent,
          settings_json: {
            ...(rawContent.settings_json || {}),
            religious_event: defaultReligious
          }
        };

        setContent(mergedContent);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load religious event website');
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

  if (loading || !website || !content) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-50/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const religiousData = content.settings_json?.religious_event || {};
  const setReligiousData = (updates: any) => {
    setContent((prev: any) => ({
      ...prev,
      settings_json: {
        ...(prev?.settings_json || {}),
        religious_event: { ...(prev?.settings_json?.religious_event || {}), ...updates }
      }
    }));
  };

  const tabs = [
    { id: 'theme', icon: <Palette size={16} />, label: 'Theme' },
    { id: 'hero', icon: <ImageIcon size={16} />, label: 'Hero' },
    { id: 'about', icon: <BookOpen size={16} />, label: 'About' },
    { id: 'leaders', icon: <Users size={16} />, label: 'Leaders' },
    { id: 'schedule', icon: <Clock size={16} />, label: 'Schedule' },
    { id: 'programs', icon: <Layers size={16} />, label: 'Programs' },
    { id: 'gallery', icon: <ImageIcon size={16} />, label: 'Gallery' },
    { id: 'contact', icon: <MapPin size={16} />, label: 'Contact' },
    { id: 'layout', icon: <LayoutList size={16} />, label: 'Layout' }
  ];
  const defaultSections = [
    { id: 'hero', label: 'Hero Section', visible: true, locked: true },
    { id: 'about', label: 'About & Vision', visible: true, locked: false },
    { id: 'leaders', label: 'Event Leaders', visible: true, locked: false },
    { id: 'schedule', label: 'Schedule & Prayers', visible: true, locked: false },
    { id: 'programs', label: 'Programs & Services', visible: true, locked: false },
    { id: 'gallery', label: 'Gallery', visible: true, locked: false },
    { id: 'contact', label: 'Contact Info', visible: true, locked: false }
  ];

  let currentSections = religiousData.sections && religiousData.sections.length > 0 
    ? religiousData.sections.map((s:any) => s.id === 'donations' ? { ...s, id: 'programs', label: 'Programs & Services' } : s)
    : defaultSections;

  // Ensure 'leaders' is injected if it's missing from a previously saved layout
  if (religiousData.sections && religiousData.sections.length > 0 && !currentSections.find((s:any) => s.id === 'leaders')) {
    const aboutIndex = currentSections.findIndex((s:any) => s.id === 'about');
    if (aboutIndex !== -1) {
      currentSections.splice(aboutIndex + 1, 0, { id: 'leaders', label: 'Event Leaders', visible: true, locked: false });
    } else {
      currentSections.push({ id: 'leaders', label: 'Event Leaders', visible: true, locked: false });
    }
  }

  return (
    <div className="flex h-screen bg-emerald-50/20 font-sans overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200 mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200 mix-blend-multiply filter blur-[120px] opacity-40"></div>
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-emerald-100 z-50 flex items-center justify-between px-4">
        <Link to="/dashboard" className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex bg-emerald-50 p-1 rounded-xl mx-1">
          <button onClick={() => setMobileView('editor')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mobileView === 'editor' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Edit</button>
          <button onClick={() => setMobileView('preview')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mobileView === 'preview' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Preview</button>
        </div>
      </div>

      <div className={`w-full lg:w-[420px] h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 bg-white/70 backdrop-blur-2xl lg:border-r border-emerald-100 shadow-xl flex flex-col relative z-20 ${mobileView === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
        <div className="hidden lg:flex p-5 border-b border-emerald-100 items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 hover:bg-emerald-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="font-serif italic font-bold text-slate-800 text-xl truncate px-2">{religiousData.organization_name || 'Religious Event'}</h2>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors">
              <Save size={16} />
            </button>
          </div>
        </div>

        <div className="flex p-3 gap-2 border-b border-emerald-100 overflow-x-auto scrollbar-hide shrink-0 bg-white/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-emerald-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Main Category (Read-Only)</label>
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
                      value={website.business_type || 'Mosque Event'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newTheme = eventHierarchy[mainEventCategory][val][0];
                        const newWebsite = { ...website, business_type: val, theme: newTheme };
                        setWebsite(newWebsite);
                        if (iframeRef.current?.contentWindow) {
                          iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_PREVIEW', website: newWebsite, content }, '*');
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm border-none shadow-sm cursor-pointer"
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
                    value={
                      (eventHierarchy[mainEventCategory]?.[website.business_type] || []).includes(website.theme)
                        ? website.theme
                        : (eventHierarchy[mainEventCategory]?.[website.business_type]?.[0] || 'Modern')
                    }
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
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm border-none shadow-sm cursor-pointer"
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

          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Cover / Hero Image</label>
                  {religiousData.cover_image && (
                    <div className="mb-2 w-full h-32 rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
                      <img src={religiousData.cover_image} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={religiousData.cover_image || ''}
                    onChange={(e) => setReligiousData({ cover_image: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Hero Image"
                    onChange={(url) => setReligiousData({ cover_image: url })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={religiousData.organization_name || ''}
                    onChange={(e) => setReligiousData({ organization_name: e.target.value })}
                    placeholder="Grand Mosque / St. Peter's Church"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tagline / Quote</label>
                  <textarea
                    rows={3}
                    value={religiousData.tagline || ''}
                    onChange={(e) => setReligiousData({ tagline: e.target.value })}
                    placeholder="In the name of God..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">About Title</label>
                  <input
                    type="text"
                    value={religiousData.about_title || ''}
                    onChange={(e) => setReligiousData({ about_title: e.target.value })}
                    placeholder="About Us"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">About Description</label>
                  <textarea
                    rows={6}
                    value={religiousData.about_description || ''}
                    onChange={(e) => setReligiousData({ about_description: e.target.value })}
                    placeholder="Welcome to our religious center..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Vision & Mission</label>
                  <textarea
                    rows={4}
                    value={religiousData.vision_mission || ''}
                    onChange={(e) => setReligiousData({ vision_mission: e.target.value })}
                    placeholder="To serve the community..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaders' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Event Leaders & Members</label>
                <button
                  onClick={() => {
                    const newId = (religiousData.leaders || []).length + 1;
                    setReligiousData({ leaders: [...(religiousData.leaders || []), { id: newId, name: '', title: '', role: '', photo: '' }] });
                  }}
                  className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-emerald-600 active:scale-95 flex items-center gap-1"
                >
                  <PlusCircle size={14} /> Add Leader
                </button>
              </div>

              {(religiousData.leaders || []).map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm space-y-3 relative pt-8">
                  <button
                    onClick={() => {
                      const newLeaders = [...religiousData.leaders];
                      newLeaders.splice(idx, 1);
                      setReligiousData({ leaders: newLeaders });
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-colors"
                  >
                    Remove
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Name</label>
                      <input type="text" value={item.name} onChange={e => {
                        const newLeaders = [...religiousData.leaders];
                        newLeaders[idx] = { ...item, name: e.target.value };
                        setReligiousData({ leaders: newLeaders });
                      }} placeholder="e.g. John Doe" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Title</label>
                      <input type="text" value={item.title} onChange={e => {
                        const newLeaders = [...religiousData.leaders];
                        newLeaders[idx] = { ...item, title: e.target.value };
                        setReligiousData({ leaders: newLeaders });
                      }} placeholder="e.g. Imam, Pastor" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Program Role</label>
                      <input type="text" value={item.role} onChange={e => {
                        const newLeaders = [...religiousData.leaders];
                        newLeaders[idx] = { ...item, role: e.target.value };
                        setReligiousData({ leaders: newLeaders });
                      }} placeholder="e.g. Inauguration Leader, Chief Guest" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Photo</label>
                    {item.photo && (
                      <div className="mb-2 w-16 h-16 rounded-full overflow-hidden border border-emerald-100">
                        <img src={item.photo} alt="Leader" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <FileUpload
                      accept="image/*"
                      label="Upload Photo"
                      onChange={(url) => {
                        const newLeaders = [...religiousData.leaders];
                        newLeaders[idx] = { ...item, photo: url };
                        setReligiousData({ leaders: newLeaders });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Schedule & Prayers</label>
                <button
                  onClick={() => {
                    const newId = (religiousData.schedule || []).length + 1;
                    setReligiousData({ schedule: [...(religiousData.schedule || []), { id: newId, name: 'New Prayer', time: '12:00 PM', description: '' }] });
                  }}
                  className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-emerald-600 active:scale-95 flex items-center gap-1"
                >
                  <PlusCircle size={14} /> Add
                </button>
              </div>

              {(religiousData.schedule || []).map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm space-y-3 relative pt-8">
                  <button
                    onClick={() => {
                      const newSchedule = [...religiousData.schedule];
                      newSchedule.splice(idx, 1);
                      setReligiousData({ schedule: newSchedule });
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-colors"
                  >
                    Remove
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={item.name} onChange={e => {
                      const newSchedule = [...religiousData.schedule];
                      newSchedule[idx] = { ...item, name: e.target.value };
                      setReligiousData({ schedule: newSchedule });
                    }} placeholder="Prayer / Event Name" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    
                    <input type="text" value={item.time} onChange={e => {
                      const newSchedule = [...religiousData.schedule];
                      newSchedule[idx] = { ...item, time: e.target.value };
                      setReligiousData({ schedule: newSchedule });
                    }} placeholder="Time (e.g. 5:00 AM)" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>

                  <textarea value={item.description} onChange={e => {
                    const newSchedule = [...religiousData.schedule];
                    newSchedule[idx] = { ...item, description: e.target.value };
                    setReligiousData({ schedule: newSchedule });
                  }} rows={2} placeholder="Description..." className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Programs & Services</label>
                <button
                  onClick={() => {
                    const newId = (religiousData.programs || []).length + 1;
                    setReligiousData({ programs: [...(religiousData.programs || []), { id: newId, name: 'New Program', timing: '', description: '' }] });
                  }}
                  className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-emerald-600 active:scale-95 flex items-center gap-1"
                >
                  <PlusCircle size={14} /> Add Program
                </button>
              </div>

              {(religiousData.programs || []).map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm space-y-3 relative pt-8">
                  <button
                    onClick={() => {
                      const newPrograms = [...religiousData.programs];
                      newPrograms.splice(idx, 1);
                      setReligiousData({ programs: newPrograms });
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-colors"
                  >
                    Remove
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={item.name} onChange={e => {
                      const newPrograms = [...religiousData.programs];
                      newPrograms[idx] = { ...item, name: e.target.value };
                      setReligiousData({ programs: newPrograms });
                    }} placeholder="Program Name (e.g. Youth Mentorship)" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    
                    <input type="text" value={item.timing} onChange={e => {
                      const newPrograms = [...religiousData.programs];
                      newPrograms[idx] = { ...item, timing: e.target.value };
                      setReligiousData({ programs: newPrograms });
                    }} placeholder="Timing (e.g. Every Saturday)" className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>

                  <textarea value={item.description} onChange={e => {
                    const newPrograms = [...religiousData.programs];
                    newPrograms[idx] = { ...item, description: e.target.value };
                    setReligiousData({ programs: newPrograms });
                  }} rows={2} placeholder="Description..." className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800">Photo Gallery</h3>
                    <p className="text-[10px] text-slate-400">Upload photos from library or add external image URLs.</p>
                  </div>
                  <button
                    onClick={() => {
                      const currentGallery = religiousData.gallery || [];
                      setReligiousData({ gallery: [...currentGallery, ""] });
                    }}
                    className="text-emerald-600 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  <FileUpload
                    accept="image/*"
                    label="Upload Photo to Gallery"
                    onChange={(url) => {
                      const currentGallery = religiousData.gallery || [];
                      setReligiousData({ gallery: [...currentGallery, url] });
                    }}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  {(religiousData.gallery || []).map((url: string, index: number) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 flex gap-2 items-center">
                      {url && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-100 shrink-0 bg-slate-200">
                          <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={url}
                        onChange={e => {
                          const newGallery = [...(religiousData.gallery || [])];
                          newGallery[index] = e.target.value;
                          setReligiousData({ gallery: newGallery });
                        }}
                        className="flex-1 px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-xs"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        onClick={() => {
                          const newGallery = (religiousData.gallery || []).filter((_: any, i: number) => i !== index);
                          setReligiousData({ gallery: newGallery });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Full Address</label>
                  <textarea
                    rows={3}
                    value={content.contact_info?.address || ''}
                    onChange={(e) => {
                      const newAddress = e.target.value;
                      setContent((prev: any) => ({
                        ...prev,
                        contact_info: { ...(prev?.contact_info || {}), address: newAddress },
                        settings_json: {
                          ...(prev?.settings_json || {}),
                          religious_event: {
                            ...(prev?.settings_json?.religious_event || {}),
                            mapUrl: `https://maps.google.com/maps?q=${encodeURIComponent(newAddress)}`
                          }
                        }
                      }));
                    }}
                    placeholder="123 Faith Lane, City, Country"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Contact Numbers</label>
                  <input
                    type="text"
                    value={religiousData.contactNumbers || ''}
                    onChange={(e) => setReligiousData({ contactNumbers: e.target.value })}
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <p className="text-xs text-slate-500 mb-4">Use arrows to reorder sections. Use the eye icon to hide sections you don't need.</p>
                <div className="space-y-3">
                  {currentSections.map((section: any, idx: number) => (
                    <div key={section.id} className={`flex items-center justify-between p-4 rounded-xl border ${section.visible ? 'bg-white border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (section.locked) return;
                            const newSections = [...currentSections];
                            newSections[idx].visible = !newSections[idx].visible;
                            setReligiousData({ sections: newSections });
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${section.locked ? 'text-slate-300 cursor-not-allowed' : section.visible ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'}`}
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
                            setReligiousData({ sections: newSections });
                          }}
                          disabled={idx === 0 || currentSections[idx - 1]?.locked || section.locked}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (idx === currentSections.length - 1 || section.locked) return;
                            const newSections = [...currentSections];
                            [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
                            setReligiousData({ sections: newSections });
                          }}
                          disabled={idx === currentSections.length - 1 || section.locked}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
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

        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className={`flex-1 relative z-10 w-full h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 ${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-col items-center p-4 lg:p-10 pt-12 lg:pt-12 overflow-x-hidden overflow-y-auto bg-slate-50/50`}>

        {/* Viewport Toggle */}
        <div className="flex bg-white rounded-full p-1 shadow-md border border-slate-200 mb-8 shrink-0 relative z-20">
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'mobile' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone size={16} /> Mobile
          </button>
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'desktop' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
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

          {/* Notch for Mobile */}
          {previewDevice === 'mobile' && (
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20 pointer-events-none">
              <div className="w-1/3 h-full bg-slate-900 rounded-b-2xl"></div>
            </div>
          )}

          {/* IFRAME WRAPPER */}
          <div className={`w-full h-full bg-white relative overflow-hidden flex flex-col ${previewDevice === 'mobile' ? 'rounded-[1.75rem]' : 'rounded-lg'}`}>
            <iframe ref={iframeRef} src="/_preview" className="w-full flex-1 border-0" title="Live Preview" sandbox="allow-scripts allow-same-origin" />
          </div>
        </div>
      </div>
    </div>
  );
}
