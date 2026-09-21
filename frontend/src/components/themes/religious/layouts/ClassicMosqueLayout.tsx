import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, Heart, ArrowRight, User, Info, Phone, Mail, BookOpen, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClassicMosqueLayout({ website, content }: { website: any, content: any }) {
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

  // Classic Emerald, Ivory, and Antique Gold Palette
  const colors = {
    emerald: 'bg-[#064e3b]',
    emeraldLight: 'bg-[#065f46]',
    ivory: 'bg-[#fdfbf7]',
    gold: 'text-[#b8860b]',
    goldBorder: 'border-[#b8860b]',
    goldBg: 'bg-[#b8860b]',
    textDark: 'text-[#1e293b]',
    textEmerald: 'text-[#064e3b]',
    textLight: 'text-[#fdfbf7]',
    bgDark: 'bg-[#064e3b]',
    bgLight: 'bg-[#fdfbf7]',
    textPrimary: 'text-[#1e293b]',
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
          <section key="hero" className={`relative h-[85vh] min-h-[600px] flex items-center justify-center text-center ${colors.emerald} overflow-hidden`}>
            {/* Elegant Corner Ornaments */}
            <div className={`absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 ${colors.goldBorder} opacity-60`}></div>
            <div className={`absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 ${colors.goldBorder} opacity-60`}></div>
            <div className={`absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 ${colors.goldBorder} opacity-60`}></div>
            <div className={`absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 ${colors.goldBorder} opacity-60`}></div>

            <div className="absolute inset-0 opacity-20">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center mix-blend-multiply filter grayscale"
              />
              <div className={`absolute inset-0 ${colors.emeraldLight} mix-blend-overlay`}></div>
            </div>
            
            <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="space-y-8 bg-[#064e3b]/80 p-12 rounded-t-full border-t-2 border-l-2 border-r-2 border-[#b8860b]/40 backdrop-blur-md">
                <span className={`inline-block px-4 py-1 border-y border-[#b8860b] ${colors.gold} text-sm font-serif italic tracking-widest uppercase`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className="text-5xl md:text-7xl font-serif text-[#fdfbf7] font-bold leading-tight drop-shadow-md">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-24 h-[1px] ${colors.goldBg}`}></div>
                    <p className={`text-xl md:text-2xl ${colors.textLight} font-serif max-w-2xl mx-auto opacity-90`}>
                      "{religiousData.tagline}"
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-24 px-6 ${colors.ivory} relative border-b-4 border-double border-[#064e3b]/20`}>
            <div className="max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-serif font-bold ${colors.textEmerald} mb-6`}>{religiousData.about_title || 'About Us'}</h2>
                <div className={`w-32 h-[2px] mx-auto ${colors.goldBg}`}></div>
              </motion.div>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-6 text-lg text-slate-700 leading-relaxed font-serif">
                  <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#064e3b] first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px]">
                    {religiousData.about_description || 'We are a community dedicated to faith and service, welcoming all who seek peace and spiritual growth.'}
                  </p>
                </motion.div>
                
                {religiousData.vision_mission && (
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                    <div className={`bg-white p-12 border-2 ${colors.goldBorder} relative shadow-xl`}>
                      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-6 ${colors.gold}`}>
                        <Info size={32} />
                      </div>
                      <h4 className={`text-2xl font-serif font-bold ${colors.textEmerald} mb-6 text-center mt-4`}>Vision & Mission</h4>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-serif text-center italic">
                        "{religiousData.vision_mission}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-24 px-6 bg-white relative`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h3 className={`text-4xl md:text-5xl font-serif font-bold ${colors.textEmerald} mb-6`}>Leadership</h3>
                <div className={`w-32 h-[2px] mx-auto ${colors.goldBg}`}></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className={`w-48 h-56 rounded-t-full p-2 border-2 ${colors.goldBorder} mb-6 shadow-lg bg-white relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-t-full sepia-[0.3]" />
                      ) : (
                        <div className="w-full h-full rounded-t-full bg-slate-50 flex items-center justify-center">
                          <User size={48} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <h3 className={`text-2xl font-serif font-bold ${colors.textEmerald} mb-2`}>{leader.name || 'Leader Name'}</h3>
                    {leader.title && (
                      <p className={`${colors.gold} text-sm font-serif italic mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className="inline-block px-5 py-1 border border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-semibold">
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
          <section key="schedule" id="schedule" className={`py-24 px-6 ${colors.ivory} border-y-4 border-double border-[#064e3b]/20`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-serif font-bold ${colors.textEmerald} mb-6`}>Schedule & Prayers</h2>
                <div className={`w-32 h-[2px] mx-auto ${colors.goldBg}`}></div>
              </div>
              
              <div className="space-y-8">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-[#b8860b]/30 shadow-md relative group hover:border-[#b8860b] transition-colors"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${colors.emeraldLight}`}></div>
                    <div className="flex-1 md:pr-8 text-center md:text-left mb-6 md:mb-0 pl-4">
                      <h4 className={`text-2xl font-serif font-bold ${colors.textEmerald} mb-3`}>{item.name || 'Service'}</h4>
                      {item.description && <p className="text-slate-600 font-serif italic">{item.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 bg-[#fdfbf7] px-6 py-4 border border-slate-200 shadow-inner rounded-full shrink-0">
                      <Clock size={20} className={colors.gold} />
                      <span className={`text-xl font-serif font-bold ${colors.textDark}`}>{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-slate-500 font-serif italic">No schedule available at this time.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className="py-24 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h3 className={`text-4xl md:text-5xl font-serif font-bold ${colors.textEmerald} mb-6`}>Programs & Services</h3>
                <div className={`w-32 h-[2px] mx-auto ${colors.goldBg}`}></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 border border-slate-200 bg-[#fdfbf7] text-center flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <BookOpen size={40} className={`${colors.gold} mx-auto mb-6`} strokeWidth={1} />
                    <h3 className={`text-2xl font-serif font-bold ${colors.textEmerald} mb-4`}>{item.name || 'Program Name'}</h3>
                    <p className="text-slate-600 mb-8 flex-1 font-serif italic leading-relaxed">{item.description}</p>
                    
                    {item.timing && (
                      <div className={`mt-auto border-t border-dashed ${colors.goldBorder} pt-6`}>
                        <span className={`text-sm font-bold ${colors.textDark} uppercase tracking-widest`}>{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-slate-500 font-serif italic">No programs listed currently.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 px-6 ${colors.ivory} border-t-4 border-double border-[#064e3b]/20`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-serif font-bold ${colors.textEmerald} mb-6`}>Gallery</h2>
                <div className={`w-32 h-[2px] mx-auto ${colors.goldBg}`}></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`aspect-square p-2 bg-white border border-slate-200 shadow-md group cursor-pointer`}
                  >
                    <div className="w-full h-full overflow-hidden relative">
                       <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover sepia-[0.4] group-hover:sepia-0 group-hover:scale-110 transition-all duration-700" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 px-6 ${colors.emerald} text-[#fdfbf7] relative`}>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className={`text-4xl md:text-5xl font-serif font-bold text-white mb-6`}>Visit Us</h2>
                <div className={`w-24 h-[2px] ${colors.goldBg} mb-12`}></div>
                
                <div className="space-y-10">
                  <div className="flex items-start gap-6">
                    <div className={`mt-1 ${colors.gold}`}>
                      <MapPin size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-serif font-bold ${colors.gold} mb-2 uppercase tracking-widest`}>Location</h4>
                      <p className="text-white text-xl leading-relaxed font-serif opacity-90">
                        {content.contact_info?.address || '123 Faith Lane, City, Country'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className={`mt-1 ${colors.gold}`}>
                      <Phone size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-serif font-bold ${colors.gold} mb-2 uppercase tracking-widest`}>Contact</h4>
                      <p className="text-white text-xl font-serif opacity-90">
                        {religiousData.contactNumbers || '+1 234 567 890'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <div className={`p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl`}>
                  <div className="aspect-square md:aspect-[4/3] w-full bg-[#064e3b] overflow-hidden border border-white/10">
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
            className={`fixed inset-0 z-50 flex items-center justify-center ${colors.bgDark}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 border-4 border-double ${colors.goldBorder} rounded-t-full flex items-center justify-center mb-6`}>
                <div className={`w-3 h-3 ${colors.goldBg} rounded-full animate-bounce`}></div>
              </div>
              <h2 className={`text-2xl font-serif ${colors.gold} tracking-[0.2em] uppercase`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-serif antialiased ${colors.bgLight} ${colors.textPrimary} selection:bg-[#b8860b] selection:text-white overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
