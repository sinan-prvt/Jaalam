import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, Heart, ArrowRight, User, Info, Phone, Mail, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernMosqueLayout({ website, content }: { website: any, content: any }) {
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

  // Deep Teal & Gold Palette
  const colors = {
    bgDark: 'bg-[#0a191c]', // Very deep teal
    bgLight: 'bg-[#0a191c]',
    bgCard: 'bg-[#122b30]', // Slightly lighter teal for cards
    gold: 'text-[#d4af37]',
    goldBorder: 'border-[#d4af37]',
    goldBg: 'bg-[#d4af37]',
    textLight: 'text-slate-200',
    textDim: 'text-slate-400',
    textMuted: 'text-stone-500',
    textPrimary: 'text-white'
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
          <section key="hero" className={`relative h-[90vh] min-h-[600px] flex items-center justify-center text-center ${colors.bgDark} overflow-hidden`}>
            {/* Islamic Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l4 14 14 4-14 4-4 14-4-14-14-4 14-4z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '120px'
            }}></div>
            
            <div className="absolute inset-0">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a191c] via-[#0a191c]/50 to-transparent"></div>
            </div>
            
            <div className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-8">
                <span className={`inline-block px-6 py-2 rounded-full border ${colors.goldBorder} ${colors.gold} text-xs font-bold tracking-[0.3em] uppercase bg-black/30 backdrop-blur-sm`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className="text-5xl md:text-8xl font-serif text-white font-normal leading-tight">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <div className="flex items-center justify-center gap-4">
                    <div className={`w-12 h-[1px] ${colors.goldBg} opacity-50`}></div>
                    <p className={`text-xl md:text-2xl ${colors.gold} font-serif italic max-w-2xl mx-auto`}>
                      "{religiousData.tagline}"
                    </p>
                    <div className={`w-12 h-[1px] ${colors.goldBg} opacity-50`}></div>
                  </div>
                )}
                
                <div className="pt-12">
                  <a href="#about" className={`inline-flex items-center gap-3 ${colors.goldBg} text-[#0a191c] px-10 py-4 rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest text-sm`}>
                    Discover <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-24 px-6 ${colors.bgDark} relative border-t border-white/5`}>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold} mb-4`}>Our Purpose</h2>
                <h3 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                  {religiousData.about_title || 'About Us'}
                </h3>
                
                <div className={`space-y-6 ${colors.textLight} text-lg leading-relaxed`}>
                  <p>{religiousData.about_description || 'We are a community dedicated to faith and service.'}</p>
                </div>
              </motion.div>
              
              {religiousData.vision_mission && (
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                  <div className={`${colors.bgCard} p-10 md:p-14 rounded-3xl border border-white/10 relative overflow-hidden group`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${colors.goldBg} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>
                    <Info size={32} className={`${colors.gold} mb-6`} />
                    <h4 className="text-2xl font-serif text-white mb-4">Vision & Mission</h4>
                    <p className={`${colors.textDim} leading-relaxed whitespace-pre-wrap`}>
                      {religiousData.vision_mission}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-24 px-6 ${colors.bgDark} relative`}>
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37] via-transparent to-transparent"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold} mb-4`}>Leadership</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-white">Event Leaders</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`${colors.bgCard} p-8 rounded-[2rem] border border-white/5 text-center group hover:border-[#d4af37]/30 transition-all duration-500`}
                  >
                    <div className={`w-32 h-32 mx-auto rounded-full p-1 border-2 border-white/10 group-hover:${colors.goldBorder} transition-colors mb-6 overflow-hidden`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                          <User size={40} className={colors.textDim} />
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-1">{leader.name || 'Leader Name'}</h3>
                    {leader.title && (
                      <p className={`${colors.gold} text-sm font-bold tracking-widest uppercase mb-4`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs border border-white/10">
                        {leader.role}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-24 px-6 ${colors.bgDark} border-t border-white/5`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Calendar className={`${colors.gold} mx-auto mb-6`} size={40} strokeWidth={1.5} />
                <h2 className="text-4xl md:text-5xl font-serif text-white">Schedule & Prayers</h2>
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`${colors.bgCard} flex flex-col md:flex-row md:items-center p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all`}
                  >
                    <div className="md:w-1/4 mb-4 md:mb-0 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className={colors.gold} />
                        <span className={`text-xl font-serif ${colors.gold}`}>{item.time || '12:00 PM'}</span>
                      </div>
                    </div>
                    <div className="md:w-3/4 md:pl-6">
                      <h4 className="text-2xl font-serif text-white mb-2">{item.name || 'Service'}</h4>
                      {item.description && <p className={colors.textDim}>{item.description}</p>}
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
          <section key="programs" id="programs" className={`py-24 px-6 ${colors.bgDark} relative`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold} mb-4`}>Community</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-white">Programs & Services</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`${colors.bgCard} p-10 rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-colors flex flex-col h-full`}
                  >
                    <BookOpen size={32} className={`${colors.gold} mb-6`} strokeWidth={1.5} />
                    <h3 className="text-2xl font-serif text-white mb-4">{item.name || 'Program Name'}</h3>
                    {item.description && <p className={`${colors.textDim} mb-8 flex-1 leading-relaxed`}>{item.description}</p>}
                    
                    {item.timing && (
                      <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3">
                        <Clock size={16} className={colors.gold} />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">{item.timing}</span>
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
          <section key="gallery" id="gallery" className={`py-24 px-6 ${colors.bgDark} border-t border-white/5`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif text-white">Gallery</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer relative"
                  >
                    <div className={`absolute inset-0 ${colors.goldBg} opacity-0 group-hover:opacity-20 transition-opacity z-10 mix-blend-overlay`}></div>
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 px-6 ${colors.bgDark} relative border-t border-[#d4af37]/20`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-12">Connect With Us</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:${colors.goldBorder} transition-colors`}>
                      <MapPin size={20} className={colors.gold} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.textDim} mb-2`}>Location</h4>
                      {!hiddenFields.includes('contact_address') && (
                                    <p className="text-white text-lg leading-relaxed">
                                                            {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                          </p>
                                    )}
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:${colors.goldBorder} transition-colors`}>
                      <Phone size={20} className={colors.gold} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.textDim} mb-2`}>Contact</h4>
                      <p className="text-white text-lg">
                        {religiousData.contactNumbers || '+1 234 567 890'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <div className="p-2 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="aspect-square md:aspect-[4/3] w-full bg-[#0a191c] rounded-[1.5rem] overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '300px', filter: 'invert(90%) hue-rotate(180deg)' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Faith Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                </div>
              </motion.div>
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
            className={`fixed inset-0 z-50 flex items-center justify-center ${colors.bgLight}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 border-r-4 border-b-4 ${colors.goldBorder} rounded-full flex items-center justify-center mb-6 animate-spin`}>
                <div className={`w-3 h-3 ${colors.goldBg} rounded-full`}></div>
              </div>
              <h2 className={`text-xl font-sans ${colors.gold} tracking-[0.3em] uppercase`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.bgLight} ${colors.textPrimary} selection:bg-[#0f766e] selection:text-white overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
