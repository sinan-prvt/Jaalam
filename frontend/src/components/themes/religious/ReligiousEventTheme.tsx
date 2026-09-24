import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, Heart, ArrowRight, User, Info, Phone, Mail, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernMosqueLayout from './layouts/ModernMosqueLayout';
import ClassicMosqueLayout from './layouts/ClassicMosqueLayout';
import MinimalMosqueLayout from './layouts/MinimalMosqueLayout';
import ElegantMosqueLayout from './layouts/ElegantMosqueLayout';
import RoyalMosqueLayout from './layouts/RoyalMosqueLayout';
import SereneMosqueLayout from './layouts/SereneMosqueLayout';
import ChristianTraditionalLayout from './layouts/ChristianTraditionalLayout';
import ChristianModernLayout from './layouts/ChristianModernLayout';
import ChristianClassicLayout from './layouts/ChristianClassicLayout';
import ChristianFloralLayout from './layouts/ChristianFloralLayout';
import ChristianMinimalLayout from './layouts/ChristianMinimalLayout';
import HinduTraditionalLayout from './layouts/HinduTraditionalLayout';
import HinduClassicLayout from './layouts/HinduClassicLayout';
import HinduFloralLayout from './layouts/HinduFloralLayout';
import HinduMinimalLayout from './layouts/HinduMinimalLayout';
import HinduElegantLayout from './layouts/HinduElegantLayout';

export default function ReligiousEventTheme({ website, content }: { website: any, content: any }) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
  if (website.business_type === 'Mosque Event' && website.theme === 'Modern') {
    return <ModernMosqueLayout website={website} content={content} />;
  }
  if (website.business_type === 'Mosque Event' && website.theme === 'Classic') {
    return <ClassicMosqueLayout website={website} content={content} />;
  }
  if (website.business_type === 'Mosque Event' && website.theme === 'Minimal') {
    return <MinimalMosqueLayout website={website} content={content} />;
  }
  if (website.business_type === 'Mosque Event' && website.theme === 'Elegant') {
    return <ElegantMosqueLayout website={website} content={content} />;
  }
  if (website.business_type === 'Mosque Event' && website.theme === 'Royal') {
    return <RoyalMosqueLayout website={website} content={content} />;
  }
  if (website.business_type === 'Mosque Event' && website.theme === 'Serene') {
    return <SereneMosqueLayout website={website} content={content} />;
  }
  if (website.business_type === 'Church Event' && website.theme === 'Christian Traditional') {
    return <ChristianTraditionalLayout website={website} content={content} />;
  }
  if (website.business_type === 'Church Event' && website.theme === 'Classic') {
    return <ChristianClassicLayout website={website} content={content} />;
  }
  if (website.business_type === 'Church Event' && website.theme === 'Floral') {
    return <ChristianFloralLayout website={website} content={content} />;
  }
  if (website.business_type === 'Church Event' && website.theme === 'Minimal') {
    return <ChristianMinimalLayout website={website} content={content} />;
  }
  if (website.business_type === 'Church Event' && website.theme === 'Modern') {
    return <ChristianModernLayout website={website} content={content} />;
  }
  if (website.business_type === 'Temple Event' && website.theme === 'Classic') {
    return <HinduClassicLayout website={website} content={content} />;
  }
  if (website.business_type === 'Temple Event' && website.theme === 'Elegant') {
    return <HinduElegantLayout website={website} content={content} />;
  }
  if (website.business_type === 'Temple Event' && website.theme === 'Minimal') {
    return <HinduMinimalLayout website={website} content={content} />;
  }
  if (website.business_type === 'Temple Event' && website.theme === 'Floral') {
    return <HinduFloralLayout website={website} content={content} />;
  }
  if (website.business_type === 'Temple Event' && website.theme === 'Hindu Traditional') {
    return <HinduTraditionalLayout website={website} content={content} />;
  }

  const religiousData = content?.settings_json?.religious_event || {};
  
  // Theme color mapping based on business_type and theme
  const getThemeStyles = () => {
    const type = website.business_type;
    const theme = website.theme;
    
    if (type === 'Mosque Event') {
      if (theme === 'Islamic Traditional') return { primary: 'bg-emerald-800', text: 'text-emerald-800', border: 'border-emerald-200', light: 'bg-emerald-50' };
      if (theme === 'Modern') return { primary: 'bg-teal-900', text: 'text-teal-900', border: 'border-teal-200', light: 'bg-teal-50' };
      return { primary: 'bg-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' };
    }
    if (type === 'Church Event') {
      if (theme === 'Christian Traditional') return { primary: 'bg-rose-900', text: 'text-rose-900', border: 'border-rose-200', light: 'bg-rose-50' };
      if (theme === 'Modern') return { primary: 'bg-indigo-900', text: 'text-indigo-900', border: 'border-indigo-200', light: 'bg-indigo-50' };
      return { primary: 'bg-rose-800', text: 'text-rose-800', border: 'border-rose-200', light: 'bg-rose-50' };
    }
    if (type === 'Temple Event') {
      if (theme === 'Hindu Traditional') return { primary: 'bg-orange-600', text: 'text-orange-700', border: 'border-orange-200', light: 'bg-orange-50' };
      if (theme === 'Modern') return { primary: 'bg-amber-700', text: 'text-amber-800', border: 'border-amber-200', light: 'bg-amber-50' };
      return { primary: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200', light: 'bg-orange-50' };
    }
    
    return { primary: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-200', light: 'bg-slate-50' };
  };

  const styles = getThemeStyles();
  const sections = religiousData.sections || [];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // order based on sections array
  const orderedSections = sections.filter((s:any) => s.visible).map((s:any) => s.id === 'donations' ? 'programs' : s.id);
  // default order if sections is empty
  let renderOrder = orderedSections.length > 0 ? orderedSections : ['hero', 'about', 'leaders', 'schedule', 'programs', 'gallery', 'contact'];

  // Ensure 'leaders' is injected if it's missing from a previously saved layout
  if (orderedSections.length > 0 && !orderedSections.includes('leaders')) {
    const aboutIndex = renderOrder.indexOf('about');
    if (aboutIndex !== -1) {
      renderOrder.splice(aboutIndex + 1, 0, 'leaders');
    } else {
      renderOrder.push('leaders');
    }
  }

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center">
            <div className="absolute inset-0">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center"
              />
              <div className={`absolute inset-0 ${styles.primary} opacity-70 mix-blend-multiply`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            
            <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium tracking-widest uppercase">
                  {religiousData.subtitle || website.business_type}
                </span>
                <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                {religiousData.tagline && (
                  <p className="text-xl md:text-2xl text-white/90 font-medium italic max-w-2xl mx-auto drop-shadow-md">
                    "{religiousData.tagline}"
                  </p>
                )}
                <div className="pt-8">
                  <a href="#about" className={`inline-flex items-center gap-2 bg-white ${styles.text} px-8 py-3.5 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl`}>
                    Learn More <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-24 px-6 ${styles.light}`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-serif font-bold ${styles.text} mb-4`}>{religiousData.about_title || 'About Us'}</h2>
                <div className={`w-24 h-1 mx-auto ${styles.primary} rounded-full opacity-30`}></div>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
                    <div className={`absolute top-0 left-0 w-2 h-full ${styles.primary} rounded-l-3xl`}></div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {religiousData.about_description || 'We are a community dedicated to faith and service.'}
                    </p>
                  </div>
                  
                  {religiousData.vision_mission && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                      <h3 className={`text-xl font-bold ${styles.text} mb-4 flex items-center gap-2`}><Info size={20} /> Vision & Mission</h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {religiousData.vision_mission}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-serif font-bold ${styles.text} mb-4`}>Event Leaders</h2>
                <div className={`w-24 h-1 mx-auto ${styles.primary} rounded-full opacity-30`}></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-slate-50 rounded-[3rem] p-8 text-center relative overflow-hidden group hover:shadow-xl transition-shadow border border-slate-100"
                  >
                    <div className={`absolute top-0 inset-x-0 h-32 ${styles.primary} opacity-10 transition-opacity group-hover:opacity-20`}></div>
                    <div className="relative z-10">
                      {leader.photo ? (
                        <div className={`w-40 h-40 mx-auto rounded-full p-2 bg-white shadow-lg mb-6 border-2 ${styles.border} group-hover:scale-105 transition-transform`}>
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                      ) : (
                        <div className={`w-40 h-40 mx-auto rounded-full p-2 bg-white shadow-lg mb-6 flex items-center justify-center border-2 ${styles.border} ${styles.light} ${styles.text}`}>
                          <User size={64} opacity={0.5} />
                        </div>
                      )}
                      <h3 className={`text-2xl font-bold ${styles.text}`}>{leader.name || 'Leader Name'}</h3>
                      {leader.title && (
                        <p className="text-slate-500 font-medium mt-1 tracking-widest uppercase text-sm">{leader.title}</p>
                      )}
                      {leader.role && (
                        <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-white text-slate-700 text-xs font-bold shadow-sm border border-slate-200">
                          {leader.role}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-serif font-bold ${styles.text} mb-4 flex items-center justify-center gap-3`}>
                  <Calendar className={styles.text} size={36} /> Schedule & Prayers
                </h2>
                <div className={`w-24 h-1 mx-auto ${styles.primary} rounded-full opacity-30`}></div>
              </div>
              
              <div className="space-y-4">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border ${styles.border} ${styles.light} hover:shadow-md transition-shadow`}
                  >
                    <div>
                      <h4 className={`text-xl font-bold ${styles.text}`}>{item.name || 'Service'}</h4>
                      {item.description && <p className="text-slate-600 mt-1">{item.description}</p>}
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 shrink-0">
                      <Clock className="text-slate-400" size={18} />
                      <span className="font-bold text-slate-700">{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-slate-500">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-24 px-6 ${styles.light}`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-serif font-bold ${styles.text} mb-4 flex items-center justify-center gap-3`}>
                  <BookOpen className={styles.text} size={36} /> Programs & Services
                </h2>
                <div className={`w-24 h-1 mx-auto ${styles.primary} rounded-full opacity-30`}></div>
                <p className="text-slate-600 max-w-2xl mx-auto mt-6">Explore the various programs, classes, and services we offer to support and engage our community.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${styles.light} flex items-center justify-center mb-6`}>
                      <BookOpen className={styles.text} size={24} />
                    </div>
                    <h3 className={`text-2xl font-bold ${styles.text} mb-2`}>{item.name || 'Program Name'}</h3>
                    {item.description && <p className="text-slate-500 mb-6 flex-1">{item.description}</p>}
                    
                    {item.timing && (
                      <div className={`mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl ${styles.light} border ${styles.border}`}>
                        <Clock size={16} className={styles.text} />
                        <span className={`text-sm font-bold ${styles.text}`}>{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-slate-500">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-serif font-bold ${styles.text} mb-4`}>Gallery</h2>
                <div className={`w-24 h-1 mx-auto ${styles.primary} rounded-full opacity-30`}></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 px-6 ${styles.primary} text-white`}>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-serif font-bold mb-8">Visit Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-full shrink-0"><MapPin size={24} /></div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Location</h4>
                      {!hiddenFields.includes('contact_address') && (
                                    <p className="text-white/80 leading-relaxed max-w-sm">
                                                            {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                          </p>
                                    )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-full shrink-0"><Phone size={24} /></div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Contact</h4>
                      <p className="text-white/80 leading-relaxed">
                        {religiousData.contactNumbers || '+1 234 567 890'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl backdrop-blur-sm border border-white/10">
                <div className="aspect-square md:aspect-video w-full bg-black/20 rounded-2xl overflow-hidden flex items-center justify-center relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Faith Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 z-50 flex items-center justify-center ${styles.primary}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-full border-t-2 border-r-2 border-white flex items-center justify-center mb-6 animate-spin`}>
                <div className={`w-16 h-16 rounded-full border-t-2 border-l-2 border-white/50 animate-spin`}></div>
              </div>
              <h2 className={`text-xl font-sans text-white tracking-[0.2em] uppercase`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-slate-800 selection:${styles.primary} selection:text-white overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
