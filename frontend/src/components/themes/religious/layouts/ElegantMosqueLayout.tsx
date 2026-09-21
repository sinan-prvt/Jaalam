import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Info, Phone, Calendar, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ElegantMosqueLayout({ website, content }: { website: any, content: any }) {
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

  // Elegant Navy & Champagne Gold Palette
  const colors = {
    navyDark: 'bg-[#050B14]',
    navyLight: 'bg-[#0a192f]',
    pearl: 'bg-[#f8f9fa]',
    gold: 'text-[#d4af37]',
    goldBorder: 'border-[#d4af37]',
    goldBg: 'bg-[#d4af37]',
    textLight: 'text-slate-200',
    textDim: 'text-slate-400',
    textDark: 'text-[#0a192f]',
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
          <section key="hero" className={`relative min-h-[90vh] flex items-center justify-center text-center ${colors.navyDark} overflow-hidden`}>
            {/* Elegant Glow Effects */}
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${colors.goldBg} opacity-[0.03] rounded-full blur-[100px]`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${colors.goldBg} opacity-[0.03] rounded-full blur-[100px]`}></div>

            <div className="absolute inset-0 z-0">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay filter grayscale-[50%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent"></div>
            </div>
            
            <div className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center pt-20">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="space-y-8 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-[1px] ${colors.goldBg} opacity-50`}></div>
                  <span className={`inline-block ${colors.gold} text-sm font-serif italic tracking-widest uppercase`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                  <div className={`w-12 h-[1px] ${colors.goldBg} opacity-50`}></div>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-serif text-white font-normal leading-tight drop-shadow-2xl">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl ${colors.textLight} font-serif max-w-2xl mx-auto opacity-90 leading-relaxed font-light`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <div className="pt-16">
                  <a href="#about" className={`inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37]/30 ${colors.gold} hover:bg-[#d4af37]/10 transition-colors animate-bounce`}>
                    <ArrowRight size={20} className="rotate-90" />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-32 px-6 ${colors.navyLight} relative`}>
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="lg:col-span-5 relative z-10">
                  <div className={`p-12 border ${colors.goldBorder} bg-[#050B14]/80 backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.05)] rounded-tl-[4rem] rounded-br-[4rem]`}>
                    <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold} mb-6`}>{religiousData.about_title || 'About Us'}</h2>
                    <p className={`text-xl font-serif ${colors.textLight} leading-relaxed font-light`}>
                      {religiousData.about_description || 'We are a community dedicated to faith and service, welcoming all who seek peace and spiritual growth.'}
                    </p>
                  </div>
                </motion.div>
                
                <div className="lg:col-span-7">
                  {religiousData.vision_mission && (
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }} className="pl-0 lg:pl-12">
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 shrink-0 flex items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 ${colors.gold}`}>
                          <Info size={28} strokeWidth={1} />
                        </div>
                        <div>
                          <h4 className={`text-2xl font-serif ${colors.textLight} mb-6`}>Vision & Mission</h4>
                          <p className={`${colors.textDim} leading-relaxed whitespace-pre-wrap font-light text-lg`}>
                            {religiousData.vision_mission}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-32 px-6 ${colors.pearl} relative border-y border-stone-200`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-8 h-[1px] ${colors.goldBg}`}></div>
                  <h3 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold}`}>Leadership</h3>
                  <div className={`w-8 h-[1px] ${colors.goldBg}`}></div>
                </div>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.textDark}`}>Guiding Our Community</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className={`w-48 h-48 rounded-full p-2 border border-stone-300 group-hover:${colors.goldBorder} mb-6 bg-white relative overflow-hidden transition-all duration-700 shadow-sm group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-stone-50 flex items-center justify-center">
                          <User size={40} className="text-stone-300" />
                        </div>
                      )}
                    </div>
                    <h3 className={`text-2xl font-serif ${colors.textDark} mb-1`}>{leader.name || 'Leader Name'}</h3>
                    {leader.title && (
                      <p className={`${colors.gold} text-sm font-serif italic mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <p className={`text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500`}>{leader.role}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-32 px-6 ${colors.navyDark}`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20 flex flex-col items-center">
                <Calendar className={`${colors.gold} mx-auto mb-6 opacity-80`} size={40} strokeWidth={1} />
                <h2 className="text-4xl md:text-5xl font-serif text-white">Schedule & Prayers</h2>
              </div>
              
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] ${colors.goldBg} opacity-20 hidden md:block`}></div>
                
                <div className="space-y-12">
                  {(religiousData.schedule || []).map((item: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className={`flex flex-col md:flex-row items-center justify-between relative group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      {/* Timeline Dot */}
                      <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${colors.navyDark} border border-[#d4af37] items-center justify-center z-10 group-hover:scale-150 group-hover:bg-[#d4af37] transition-all duration-500`}>
                        <div className={`w-1 h-1 rounded-full ${colors.goldBg} group-hover:bg-white transition-colors`}></div>
                      </div>

                      <div className={`md:w-5/12 w-full ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'} bg-[#0a192f]/50 border border-white/5 p-8 rounded-2xl backdrop-blur-sm group-hover:border-[#d4af37]/30 transition-colors`}>
                        <div className={`flex items-center gap-3 mb-4 ${idx % 2 === 0 ? 'justify-start' : 'md:justify-end'}`}>
                          <Clock size={16} className={colors.gold} />
                          <span className={`text-xl font-serif ${colors.gold}`}>{item.time || '12:00 PM'}</span>
                        </div>
                        <h4 className="text-2xl font-serif text-white mb-3">{item.name || 'Service'}</h4>
                        {item.description && <p className={`${colors.textDim} font-light leading-relaxed`}>{item.description}</p>}
                      </div>
                      
                      <div className="md:w-5/12 w-full"></div>
                    </motion.div>
                  ))}
                  {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                    <p className="text-center text-slate-500 font-light">No schedule available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-32 px-6 ${colors.navyLight} relative overflow-hidden`}>
            {/* Subtle background glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 ${colors.goldBg} opacity-[0.02] rounded-full blur-[120px] pointer-events-none`}></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className={`w-12 h-[1px] ${colors.goldBg} opacity-50`}></div>
                  <h3 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold}`}>Community</h3>
                  <div className={`w-12 h-[1px] ${colors.goldBg} opacity-50`}></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white">Programs & Services</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 border border-white/5 bg-[#050B14]/40 backdrop-blur-sm flex flex-col h-full hover:border-[#d4af37]/30 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${colors.goldBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <BookOpen size={32} className={`${colors.gold} mb-8 opacity-80 group-hover:opacity-100 transition-opacity`} strokeWidth={1} />
                    <h3 className="text-2xl font-serif text-white mb-4">{item.name || 'Program Name'}</h3>
                    <p className={`${colors.textDim} mb-8 flex-1 leading-relaxed font-light`}>{item.description}</p>
                    
                    {item.timing && (
                      <div className="mt-auto border-t border-white/10 pt-6 flex items-center gap-3">
                        <Clock size={14} className={colors.gold} />
                        <span className={`text-xs font-bold ${colors.gold} uppercase tracking-widest`}>{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-slate-500 font-light">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-32 px-6 ${colors.pearl}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-8 h-[1px] ${colors.goldBg}`}></div>
                  <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.gold}`}>Gallery</h2>
                  <div className={`w-8 h-[1px] ${colors.goldBg}`}></div>
                </div>
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.textDark}`}>Moments of Grace</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`aspect-[3/4] overflow-hidden group cursor-pointer relative border border-stone-200 shadow-sm ${idx % 2 !== 0 ? 'md:mt-12' : ''}`}
                  >
                    <div className="absolute inset-4 border border-white/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-32 px-6 ${colors.navyDark} relative border-t border-white/5`}>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="lg:col-span-5">
                  <h2 className="text-5xl md:text-6xl font-serif text-white mb-12 font-light">Visit Us</h2>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:${colors.goldBorder} transition-colors duration-500`}>
                        <MapPin size={24} className={colors.gold} strokeWidth={1} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold tracking-[0.2em] uppercase ${colors.textDim} mb-3`}>Location</h4>
                        <p className={`text-white text-xl leading-relaxed font-serif font-light`}>
                          {content.contact_info?.address || '123 Faith Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:${colors.goldBorder} transition-colors duration-500`}>
                        <Phone size={24} className={colors.gold} strokeWidth={1} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold tracking-[0.2em] uppercase ${colors.textDim} mb-3`}>Contact</h4>
                        <p className={`text-white text-xl font-serif font-light`}>
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="lg:col-span-7">
                  <div className="p-4 rounded-tl-[4rem] rounded-br-[4rem] border border-[#d4af37]/20 bg-[#0a192f]/50 backdrop-blur-sm relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${colors.goldBg} opacity-10 rounded-full blur-[50px]`}></div>
                    <div className="aspect-square md:aspect-[16/10] w-full bg-[#050B14] rounded-tl-[3.5rem] rounded-br-[3.5rem] overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-700 border border-white/5">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Faith Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
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
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 z-50 flex items-center justify-center ${colors.navyDark}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <div className={`w-20 h-20 border-[1px] ${colors.goldBorder} rotate-45 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)]`}>
                <div className={`w-16 h-16 border-[1px] ${colors.goldBorder} flex items-center justify-center`}>
                  <div className={`w-2 h-2 ${colors.goldBg} rounded-full animate-ping`}></div>
                </div>
              </div>
              <h2 className={`text-xl font-serif ${colors.gold} tracking-[0.3em] uppercase font-light`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.navyDark} text-white selection:bg-[#d4af37] selection:text-[#050B14] overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
