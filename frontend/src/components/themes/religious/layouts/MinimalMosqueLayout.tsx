import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Info, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MinimalMosqueLayout({ website, content }: { website: any, content: any }) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
  const religiousData = content?.settings_json?.religious_event || {};
  const sections = religiousData.sections || [];
  const orderedSections = sections.filter((s: any) => s.visible).map((s: any) => s.id === 'donations' ? 'programs' : s.id);
  let renderOrder = orderedSections.length > 0 ? orderedSections : ['hero', 'about', 'leaders', 'schedule', 'programs', 'gallery', 'contact'];

  if (orderedSections.length > 0 && !orderedSections.includes('leaders')) {
    const aboutIndex = renderOrder.indexOf('about');
    if (aboutIndex !== -1) {
      renderOrder.splice(aboutIndex + 1, 0, 'leaders');
    } else {
      renderOrder.push('leaders');
    }
  }

  // Soft, Elegant Minimalist Palette
  const colors = {
    bg: 'bg-stone-50', // Warm off-white
    textPrimary: 'text-stone-800',
    textSecondary: 'text-stone-500',
    border: 'border-stone-200',
    accent: 'text-stone-400', 
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" className={`relative min-h-screen flex items-center justify-center ${colors.bg} pt-20 pb-32`}>
            <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-16">
                <span className={`inline-block ${colors.textSecondary} text-xs font-serif italic tracking-widest mb-6`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className={`text-5xl md:text-7xl font-serif ${colors.textPrimary} leading-tight mb-8 max-w-4xl mx-auto`}>
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-lg md:text-xl ${colors.textSecondary} font-light max-w-2xl mx-auto`}>
                    {religiousData.tagline}
                  </p>
                )}
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }} className="w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl shadow-2xl shadow-stone-200/50 relative">
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-24 px-6 ${colors.bg}`}>
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className={`text-sm font-serif italic tracking-widest ${colors.textSecondary} mb-8`}>{religiousData.about_title || 'Our Story'}</h2>
                <p className={`text-2xl md:text-4xl font-serif ${colors.textPrimary} leading-relaxed mb-16`}>
                  "{religiousData.about_description || 'We are a community dedicated to faith and service, welcoming all who seek peace and spiritual growth.'}"
                </p>
              </motion.div>
              
              {religiousData.vision_mission && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="inline-block text-left bg-white p-10 rounded-3xl shadow-sm border border-stone-100 max-w-2xl mx-auto">
                  <div className="flex items-start gap-4">
                    <Info size={24} className={`${colors.accent} shrink-0 mt-1`} strokeWidth={1.5} />
                    <div>
                      <h4 className={`text-sm font-serif font-bold ${colors.textPrimary} mb-4`}>Vision & Mission</h4>
                      <p className={`text-base ${colors.textSecondary} leading-relaxed whitespace-pre-wrap`}>
                        {religiousData.vision_mission}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-24 px-6 ${colors.bg}`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h3 className={`text-sm font-serif italic tracking-widest ${colors.textSecondary}`}>Leadership</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-40 h-40 rounded-full mb-6 overflow-hidden bg-stone-100 shadow-md">
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <span className="text-4xl font-serif">{leader.name?.charAt(0) || 'L'}</span>
                        </div>
                      )}
                    </div>
                    <h3 className={`text-xl font-serif ${colors.textPrimary} mb-1`}>{leader.name || 'Leader Name'}</h3>
                    {leader.title && (
                      <p className={`${colors.textSecondary} text-sm font-light mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <p className={`text-xs uppercase tracking-widest ${colors.accent}`}>{leader.role}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-24 px-6 bg-white border-y ${colors.border}`}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={`text-sm font-serif italic tracking-widest ${colors.textSecondary} mb-16`}>Schedule & Prayers</h2>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100"
                  >
                    <div className="md:w-1/4 mb-4 md:mb-0 text-left md:text-right md:pr-8 md:border-r border-stone-200">
                      <span className={`text-lg font-serif ${colors.textPrimary}`}>{item.time || '12:00 PM'}</span>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-left">
                      <h4 className={`text-xl font-serif ${colors.textPrimary} mb-2`}>{item.name || 'Service'}</h4>
                      {item.description && <p className={`text-sm ${colors.textSecondary} font-light leading-relaxed`}>{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className={`py-10 text-sm ${colors.textSecondary}`}>No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-24 px-6 ${colors.bg}`}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h3 className={`text-sm font-serif italic tracking-widest ${colors.textSecondary}`}>Programs & Services</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col h-full hover:shadow-md transition-shadow"
                  >
                    <h3 className={`text-2xl font-serif ${colors.textPrimary} mb-4`}>{item.name || 'Program Name'}</h3>
                    <p className={`${colors.textSecondary} font-light leading-relaxed mb-8 flex-1`}>{item.description}</p>
                    
                    {item.timing && (
                      <div className="mt-auto flex items-center gap-2 pt-6 border-t border-stone-100">
                        <Clock size={14} className={colors.accent} />
                        <span className={`text-xs font-medium uppercase tracking-widest ${colors.textSecondary}`}>{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className={`col-span-full text-center text-sm ${colors.textSecondary}`}>No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 px-6 bg-white`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-sm font-serif italic tracking-widest ${colors.textSecondary}`}>Gallery</h2>
              </div>
              
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: (idx % 4) * 0.1 }}
                    viewport={{ once: true }}
                    className="break-inside-avoid rounded-2xl overflow-hidden bg-stone-100 group"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 px-6 ${colors.bg}`}>
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-[3rem] shadow-sm border border-stone-100 p-8 md:p-16 grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                  <h2 className={`text-4xl font-serif ${colors.textPrimary} mb-12`}>Visit Us</h2>
                  
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <MapPin size={24} className={`${colors.accent} shrink-0 mt-1`} strokeWidth={1.5} />
                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase ${colors.textSecondary} mb-2`}>Location</h4>
                        {!hiddenFields.includes('contact_address') && (
                                        <p className={`text-lg font-serif ${colors.textPrimary} leading-relaxed`}>
                                                                  {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                                </p>
                                        )}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Phone size={24} className={`${colors.accent} shrink-0 mt-1`} strokeWidth={1.5} />
                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase ${colors.textSecondary} mb-2`}>Contact</h4>
                        <p className={`text-lg font-serif ${colors.textPrimary}`}>
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                  <div className="aspect-square w-full bg-stone-100 rounded-3xl overflow-hidden shadow-inner border border-stone-200">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Faith Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                </motion.div>
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
            transition={{ duration: 0.5 }}
            className={`fixed inset-0 z-50 flex items-center justify-center ${colors.bg}`}
          >
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-8">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-stone-800"></motion.div>
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-stone-800"></motion.div>
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-stone-800"></motion.div>
              </div>
              <h2 className={`text-sm font-sans ${colors.textPrimary} tracking-[0.4em] uppercase font-bold`}>Loading</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.bg} text-stone-800 selection:bg-stone-200 selection:text-stone-900 overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
