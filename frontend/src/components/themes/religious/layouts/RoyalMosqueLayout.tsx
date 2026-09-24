import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Info, Phone, Calendar, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoyalMosqueLayout({ website, content }: { website: any, content: any }) {
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

  // Royal Palette: Deep Burgundy, Rich Gold, Cream
  const colors = {
    bgDark: 'bg-[#4a0410]', // Deep Burgundy
    bgLight: 'bg-[#fffdf7]', // Cream
    gold: 'text-[#d4af37]',
    goldBorder: 'border-[#d4af37]',
    goldBg: 'bg-[#d4af37]',
    textLight: 'text-[#fffdf7]',
    textDark: 'text-[#4a0410]',
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
          <section key="hero" className={`relative min-h-[95vh] flex items-center justify-center text-center ${colors.bgDark} overflow-hidden`}>
            {/* Ornate Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45L50 0Z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '80px'
            }}></div>

            <div className="absolute inset-4 md:inset-8 border-4 border-double border-[#d4af37]/30 z-0 pointer-events-none rounded-[2rem]"></div>
            
            <div className="absolute inset-0 z-0">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4a0410] via-transparent to-[#4a0410]/50"></div>
            </div>
            
            <div className="relative z-10 px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="space-y-6 md:space-y-10 flex flex-col items-center p-8 md:p-12 bg-[#4a0410]/70 backdrop-blur-md rounded-3xl md:rounded-full shadow-[0_0_60px_rgba(212,175,55,0.2)] border border-[#d4af37]/40 md:aspect-square justify-center w-[90%] md:w-auto mx-auto max-w-full">
                <span className={`inline-block ${colors.gold} text-xs md:text-sm font-serif italic tracking-widest uppercase mb-2 md:mb-4`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg uppercase tracking-widest px-2">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-base md:text-2xl ${colors.gold} font-serif italic max-w-md md:max-w-2xl mx-auto drop-shadow-md px-4`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <div className="pt-4 md:pt-8">
                  <a href="#about" className={`inline-flex items-center gap-2 ${colors.goldBg} ${colors.textDark} px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors border-2 border-transparent hover:border-[#d4af37]`}>
                    Enter
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-32 px-6 ${colors.bgLight} relative`}>
            <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iNSIgZmlsbD0iI2Q0YWYzNyIgZmlsbC1vcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-50"></div>
            
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center pt-8">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                <h2 className={`text-sm font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-6 border-l-4 ${colors.goldBorder} pl-4`}>{religiousData.about_title || 'About Us'}</h2>
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.textDark} font-bold mb-8 leading-tight`}>Our Heritage & Faith</h3>
                <p className={`text-xl font-serif text-stone-700 leading-relaxed`}>
                  {religiousData.about_description || 'We are a community dedicated to faith and service, welcoming all who seek peace and spiritual growth.'}
                </p>
              </motion.div>
              
              {religiousData.vision_mission && (
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }}>
                  <div className={`p-10 border-4 border-double ${colors.goldBorder} bg-white shadow-xl relative`}>
                    <div className={`absolute -top-6 -left-6 w-12 h-12 ${colors.goldBg} text-white flex items-center justify-center shadow-lg rounded-sm transform rotate-45`}>
                      <Info size={20} className="-rotate-45" strokeWidth={2} />
                    </div>
                    <h4 className={`text-2xl font-serif ${colors.textDark} font-bold mb-6 text-center`}>Vision & Mission</h4>
                    <p className={`text-stone-700 leading-relaxed whitespace-pre-wrap font-serif italic text-lg text-center`}>
                      "{religiousData.vision_mission}"
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
          <section key="leaders" id="leaders" className={`py-32 px-6 ${colors.bgDark} relative`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h3 className={`text-sm font-bold tracking-[0.3em] uppercase ${colors.gold} mb-4`}>Leadership</h3>
                <h2 className={`text-4xl md:text-6xl font-serif text-white font-bold`}>Guiding Voices</h2>
                <div className={`w-32 h-[3px] ${colors.goldBg} mx-auto mt-8`}></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className={`w-56 h-72 p-2 border-2 ${colors.goldBorder} mb-8 bg-[#4a0410] relative overflow-hidden transition-all duration-700 rounded-t-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-t-full grayscale-[30%] sepia-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full rounded-t-full bg-[#3a030c] flex items-center justify-center">
                          <User size={50} className={colors.gold} />
                        </div>
                      )}
                    </div>
                    <h3 className={`text-3xl font-serif text-white font-bold mb-2`}>{leader.name || 'Leader Name'}</h3>
                    {leader.title && (
                      <p className={`${colors.gold} text-lg font-serif italic mb-4`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <p className={`text-xs uppercase tracking-[0.2em] font-bold text-[#fdfbf7]/60`}>{leader.role}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-32 px-6 ${colors.bgLight}`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20 flex flex-col items-center">
                <h3 className={`text-sm font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-4`}>Schedule</h3>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.textDark} font-bold`}>Services & Prayers</h2>
                <Calendar className={`${colors.gold} mx-auto mt-8`} size={40} strokeWidth={1.5} />
              </div>
              
              <div className="space-y-8">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-[#d4af37]/30 shadow-lg relative group`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${colors.goldBg}`}></div>
                    
                    <div className="md:w-1/3 mb-4 md:mb-0 text-center md:text-left pl-4 border-b md:border-b-0 md:border-r border-[#d4af37]/20 pb-4 md:pb-0 md:pr-8">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <Clock size={20} className={colors.textDark} />
                        <span className={`text-2xl font-serif font-bold ${colors.textDark}`}>{item.time || '12:00 PM'}</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 md:pl-8 text-center md:text-left">
                      <h4 className={`text-2xl font-serif ${colors.textDark} font-bold mb-3`}>{item.name || 'Service'}</h4>
                      {item.description && <p className={`text-stone-600 font-serif italic`}>{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-stone-500 font-serif italic">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-32 px-6 ${colors.bgLight} border-t border-[#d4af37]/20`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h3 className={`text-sm font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-4`}>Community</h3>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.textDark} font-bold`}>Programs & Initiatives</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 border-2 border-transparent hover:border-[#d4af37] bg-white shadow-md flex flex-col h-full transition-all duration-300"
                  >
                    <div className={`w-16 h-16 rounded-full ${colors.bgDark} text-white flex items-center justify-center mb-8 shadow-md`}>
                      <BookOpen size={24} />
                    </div>
                    <h3 className={`text-2xl font-serif ${colors.textDark} font-bold mb-4`}>{item.name || 'Program Name'}</h3>
                    <p className={`text-stone-600 mb-8 flex-1 leading-relaxed font-serif`}>{item.description}</p>
                    
                    {item.timing && (
                      <div className="mt-auto border-t border-dashed border-[#d4af37]/50 pt-4 flex items-center justify-between">
                        <span className={`text-xs font-bold ${colors.textDark} uppercase tracking-widest`}>Timing</span>
                        <span className={`text-sm font-bold ${colors.gold} uppercase tracking-widest`}>{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-stone-500 font-serif">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-32 px-6 ${colors.bgDark}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20 flex flex-col items-center">
                <h3 className={`text-sm font-bold tracking-[0.3em] uppercase ${colors.gold} mb-4`}>Gallery</h3>
                <h2 className={`text-4xl md:text-5xl font-serif text-white font-bold`}>Moments of Grace</h2>
                <div className={`w-32 h-[3px] ${colors.goldBg} mx-auto mt-8`}></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`aspect-square overflow-hidden group cursor-pointer relative border-4 border-double ${colors.goldBorder} shadow-lg`}
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-[#4a0410]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-32 px-6 ${colors.bgLight} relative border-t-8 border-double border-[#4a0410]`}>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                  <h3 className={`text-sm font-bold tracking-[0.3em] uppercase ${colors.gold} mb-4 border-l-4 ${colors.goldBorder} pl-4`}>Contact Us</h3>
                  <h2 className={`text-5xl md:text-6xl font-serif ${colors.textDark} font-bold mb-12`}>Get In Touch</h2>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className={`w-16 h-16 rounded-full border-2 ${colors.goldBorder} flex items-center justify-center shrink-0 bg-white shadow-md`}>
                        <MapPin size={28} className={colors.textDark} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold tracking-widest uppercase ${colors.textDark} mb-2`}>Location</h4>
                        {!hiddenFields.includes('contact_address') && (
                                        <p className={`text-xl font-serif text-stone-700 leading-relaxed`}>
                                                                  {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                                </p>
                                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className={`w-16 h-16 rounded-full border-2 ${colors.goldBorder} flex items-center justify-center shrink-0 bg-white shadow-md`}>
                        <Phone size={28} className={colors.textDark} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold tracking-widest uppercase ${colors.textDark} mb-2`}>Contact</h4>
                        <p className={`text-xl font-serif text-stone-700`}>
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                  <div className={`p-4 bg-white border-4 border-double ${colors.goldBorder} shadow-2xl`}>
                    <div className="aspect-square w-full bg-[#fdfbf7] overflow-hidden border border-stone-200">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
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
            className={`fixed inset-0 z-50 flex items-center justify-center ${colors.bgDark}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 border-4 border-double ${colors.goldBorder} rotate-45 flex items-center justify-center mb-6`}>
                <div className={`w-16 h-16 border-4 border-double ${colors.goldBorder} flex items-center justify-center -rotate-45`}>
                  <div className={`w-3 h-3 ${colors.goldBg} rounded-full animate-pulse`}></div>
                </div>
              </div>
              <h2 className={`text-xl font-serif ${colors.gold} tracking-[0.3em] uppercase`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.bgLight} ${colors.textDark} selection:bg-[#4a0410] selection:text-white overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
