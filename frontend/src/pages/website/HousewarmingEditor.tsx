import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  Save, ArrowLeft, Home, BookOpen, Clock,
  MapPin, Share2, Eye, EyeOff, Lock,
  Image as ImageIcon, LayoutList, ArrowUp, ArrowDown,
  Upload, Users, Smartphone, Monitor
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

export default function HousewarmingEditor() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [website, setWebsite] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('theme');
  const [mainEventCategory, setMainEventCategory] = useState('Housewarming');
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

        const rawContent = res.data.content || {};
        const rawHousewarming = rawContent.settings_json?.housewarming || {};

        const defaultHousewarming = {
          tagline: rawHousewarming.tagline || rawContent.quote || "We've found our new nest!",
          hostName: rawHousewarming.hostName || rawContent.hero_title || 'The Sharma Family',
          hostPhoto: rawHousewarming.hostPhoto || '',
          story_title: rawHousewarming.story_title || rawContent.about_title || 'Our Journey',
          venue: rawHousewarming.venue || rawContent.contact_info?.address || '123 New Beginnings Lane',
          venuePhoto: rawHousewarming.venuePhoto || '',
          mapUrl: rawHousewarming.mapUrl || 'https://maps.app.goo.gl/Vg34LGmsU',
          contactNumbers: rawHousewarming.contactNumbers || '9876543210',
          schedule: rawHousewarming.schedule || [
            { event: "Vastu Shanti / Puja", date: rawContent.date || "25 Oct 2026", time: "9:00 AM", venue: 'New Home' },
            { event: "Housewarming Lunch", date: rawContent.date || "25 Oct 2026", time: "1:00 PM", venue: 'New Home' }
          ],
          gallery: rawHousewarming.gallery || [],
          sections: rawHousewarming.sections || [
            { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
            { id: 'hosts', label: 'Host Details', visible: true },
            { id: 'story', label: 'Welcome Message', visible: true },
            { id: 'schedule', label: 'Event Schedule', visible: true },
            { id: 'venue', label: 'New Home Location', visible: true },
            { id: 'gallery', label: 'Gallery', visible: true },
            { id: 'rsvp', label: 'RSVP', visible: true }
          ],
          ...rawHousewarming
        };

        const mergedContent = {
          ...rawContent,
          hero_title: rawContent.hero_title || defaultHousewarming.hostName,
          date: rawContent.date || '25 October 2026',
          about_title: rawContent.about_title || defaultHousewarming.story_title,
          about_text: rawContent.about_text || 'Please join us as we celebrate our new home and create beautiful memories.',
          contact_info: {
            address: defaultHousewarming.venue,
            ...(rawContent.contact_info || {})
          },
          settings_json: {
            ...(rawContent.settings_json || {}),
            housewarming: defaultHousewarming
          }
        };

        setContent(mergedContent);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load housewarming invitation');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
  }, [websiteId, navigate]);

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

  const housewarmingData = content.settings_json?.housewarming || {};
  const setHousewarmingData = (updates: any) => {
    setContent((prev: any) => ({
      ...prev,
      settings_json: {
        ...(prev?.settings_json || {}),
        housewarming: { ...(prev?.settings_json?.housewarming || {}), ...updates }
      }
    }));
  };

  const tabs = [
    { id: 'theme', icon: <Home size={16} />, label: 'Theme' },
    { id: 'hosts', icon: <Users size={16} />, label: 'Hosts' },
    { id: 'story', icon: <BookOpen size={16} />, label: 'Details' },
    { id: 'schedule', icon: <Clock size={16} />, label: 'Schedule' },
    { id: 'venue', icon: <MapPin size={16} />, label: 'New Home' },
    { id: 'gallery', icon: <ImageIcon size={16} />, label: 'Gallery' },
    { id: 'layout', icon: <LayoutList size={16} />, label: 'Layout' },
    { id: 'share', icon: <Share2 size={16} />, label: 'Share' },
  ];

  const currentSections = housewarmingData.sections || [];
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const publicUrl = isLocal ? `${window.location.origin}/${website.slug}` : `https://${website.slug}.jaalam.app`;

  return (
    <div className="flex h-screen bg-emerald-50/20 font-sans overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200 mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200 mix-blend-multiply filter blur-[120px] opacity-40"></div>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-emerald-100 z-50 flex items-center justify-between px-4">
        <Link to="/dashboard" className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex bg-emerald-50 p-1 rounded-xl mx-1">
          <button onClick={() => setMobileView('editor')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mobileView === 'editor' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Edit</button>
          <button onClick={() => setMobileView('preview')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mobileView === 'preview' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Preview</button>
        </div>
      </div>

      {/* Left Panel */}
      <div className={`w-full lg:w-[420px] h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 bg-white/70 backdrop-blur-2xl lg:border-r border-emerald-100 shadow-xl flex flex-col relative z-20 ${mobileView === 'editor' ? 'flex' : 'hidden lg:flex'}`}>

        <div className="hidden lg:flex p-5 border-b border-emerald-100 items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 hover:bg-emerald-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="font-serif italic font-bold text-slate-800 text-xl truncate px-2">{content.hero_title || 'Housewarming'}</h2>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors">
              <Save size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Forms */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
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
                      value={website.business_type || 'Traditional Housewarming'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newTheme = eventHierarchy[mainEventCategory][val][0];
                        const newWebsite = { ...website, business_type: val, theme: newTheme };
                        setWebsite(newWebsite);
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
                        : (eventHierarchy[mainEventCategory]?.[website.business_type]?.[0] || 'Traditional')
                    }
                    onChange={e => {
                      const newWebsite = { ...website, theme: e.target.value };
                      setWebsite(newWebsite);
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

          {activeTab === 'layout' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <p className="text-xs text-slate-500 mb-4">Use arrows to reorder sections. Hide sections using the eye icon.</p>
                <div className="space-y-3">
                  {currentSections.map((section: any, idx: number) => (
                    <div key={section.id} className={`flex items-center justify-between p-4 rounded-xl border ${section.visible ? 'bg-white border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (section.locked) return;
                            const newSections = [...currentSections];
                            newSections[idx].visible = !newSections[idx].visible;
                            setHousewarmingData({ sections: newSections });
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
                            setHousewarmingData({ sections: newSections });
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
                            setHousewarmingData({ sections: newSections });
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

          {activeTab === 'hosts' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Host / Family Name</label>
                  <input
                    type="text"
                    value={housewarmingData.hostName || ''}
                    onChange={(e) => setHousewarmingData({ hostName: e.target.value })}
                    placeholder="The Sharma Family"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Host / Family Photo</label>
                  {housewarmingData.hostPhoto && (
                    <div className="mb-2 h-36 rounded-xl overflow-hidden border border-emerald-100">
                      <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={housewarmingData.hostPhoto || ''}
                    onChange={(e) => setHousewarmingData({ hostPhoto: e.target.value })}
                    placeholder="https://example.com/family.jpg"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Photo"
                    onChange={(url) => setHousewarmingData({ hostPhoto: url })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tagline / Short Quote</label>
                  <input
                    type="text"
                    value={housewarmingData.tagline || ''}
                    onChange={(e) => setHousewarmingData({ tagline: e.target.value })}
                    placeholder="We've found our new nest!"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Message Title</label>
                  <input
                    type="text"
                    value={housewarmingData.story_title || ''}
                    onChange={(e) => setHousewarmingData({ story_title: e.target.value })}
                    placeholder="Our Journey"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Welcome Message</label>
                  <textarea
                    rows={6}
                    value={content.about_text || ''}
                    onChange={(e) => setContent({ ...content, about_text: e.target.value })}
                    placeholder="Please join us as we celebrate our new home..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800">Event Schedule</h3>
                  <button
                    onClick={() => {
                      const currentSchedule = housewarmingData.schedule || [];
                      setHousewarmingData({ schedule: [...currentSchedule, { event: "New Event", time: "10:00 AM", date: "25 Oct", venue: "New Home" }] });
                    }}
                    className="text-emerald-600 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {(housewarmingData.schedule || []).map((item: any, index: number) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                      <button
                        onClick={() => {
                          const newSchedule = [...housewarmingData.schedule];
                          newSchedule.splice(index, 1);
                          setHousewarmingData({ schedule: newSchedule });
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <EyeOff size={14} />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Event Name</label>
                          <input type="text" value={item.event} onChange={e => {
                            const newSchedule = [...housewarmingData.schedule];
                            newSchedule[index].event = e.target.value;
                            setHousewarmingData({ schedule: newSchedule });
                          }} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 outline-none text-sm font-medium" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Date</label>
                            <input type="text" value={item.date} onChange={e => {
                              const newSchedule = [...housewarmingData.schedule];
                              newSchedule[index].date = e.target.value;
                              setHousewarmingData({ schedule: newSchedule });
                            }} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 outline-none text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Time</label>
                            <input type="text" value={item.time} onChange={e => {
                              const newSchedule = [...housewarmingData.schedule];
                              newSchedule[index].time = e.target.value;
                              setHousewarmingData({ schedule: newSchedule });
                            }} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 outline-none text-sm font-medium" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'venue' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">New Home Photo</label>
                  {housewarmingData.venuePhoto && (
                    <div className="mb-3 h-36 rounded-xl overflow-hidden border border-emerald-100 shadow-sm relative group">
                      <img src={housewarmingData.venuePhoto} alt="New Home" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={housewarmingData.venuePhoto || ''}
                    onChange={(e) => setHousewarmingData({ venuePhoto: e.target.value })}
                    placeholder="https://example.com/house.jpg"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm mb-2"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload Home Photo"
                    onChange={(url) => setHousewarmingData({ venuePhoto: url })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">New Address</label>
                  <textarea
                    rows={3}
                    value={housewarmingData.venue || ''}
                    onChange={(e) => {
                      const newAddress = e.target.value;
                      setHousewarmingData({ 
                        venue: newAddress,
                        mapUrl: `https://maps.google.com/maps?q=${encodeURIComponent(newAddress)}`
                      });
                      setContent((prev: any) => ({
                        ...prev,
                        contact_info: { ...(prev?.contact_info || {}), address: newAddress }
                      }));
                    }}
                    placeholder="123 New Beginnings Lane"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">RSVP Contact Number</label>
                  <input
                    type="text"
                    value={housewarmingData.contactNumbers || ''}
                    onChange={(e) => setHousewarmingData({ contactNumbers: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800">Photo Gallery</h3>
                  <button
                    onClick={() => {
                      const currentGallery = housewarmingData.gallery || [];
                      setHousewarmingData({ gallery: [...currentGallery, ""] });
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
                      const currentGallery = housewarmingData.gallery || [];
                      setHousewarmingData({ gallery: [...currentGallery, url] });
                    }}
                  />
                </div>
                <div className="space-y-3 pt-2">
                  {(housewarmingData.gallery || []).map((url: string, index: number) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex gap-2 items-center">
                        {url && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-100 shrink-0 bg-slate-200">
                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input
                          type="text"
                          value={url}
                          onChange={e => {
                            const newGallery = [...(housewarmingData.gallery || [])];
                            newGallery[index] = e.target.value;
                            setHousewarmingData({ gallery: newGallery });
                          }}
                          className="flex-1 px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-xs"
                        />
                        <button
                          onClick={() => {
                            const newGallery = (housewarmingData.gallery || []).filter((_: any, i: number) => i !== index);
                            setHousewarmingData({ gallery: newGallery });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        >
                          <EyeOff size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 text-center space-y-4">
                <h3 className="font-bold text-slate-800 text-lg mb-2">Share Your Invitation</h3>
                <p className="text-sm text-slate-500 mb-6">Your website is live at:</p>
                <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200 mb-6 group hover:border-emerald-200 transition-colors">
                  <span className="text-slate-700 font-medium truncate select-all">{publicUrl}</span>
                  <a href={publicUrl} target="_blank" rel="noreferrer" className="ml-4 bg-white p-2 rounded-lg text-emerald-600 shadow-sm hover:shadow-md transition-all border border-slate-100 flex-shrink-0">
                    <Share2 size={18} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className={`flex-1 relative z-10 w-full h-[calc(100vh-64px)] lg:h-screen mt-16 lg:mt-0 ${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'} flex-col items-center p-4 lg:p-10 pt-12 lg:pt-12 overflow-x-hidden overflow-y-auto`}>

        <div className="flex bg-white rounded-full p-1 shadow-md border border-emerald-100 mb-8 shrink-0 relative z-20">
          <button onClick={() => setPreviewDevice('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'mobile' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
            <Smartphone size={16} /> Mobile
          </button>
          <button onClick={() => setPreviewDevice('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${previewDevice === 'desktop' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
            <Monitor size={16} /> Desktop
          </button>
        </div>

        {/* Device Frame */}
        <div className={`transition-all duration-500 flex flex-col bg-white overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] shrink-0 mb-auto
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
                {website?.slug}.jaalam.app
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
