import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Info, Phone, Calendar, User, Heart, Cross } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChristianTraditionalLayout({ website, content }: { website: any, content: any }) {
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

  // Christian Traditional Palette: Deep Crimson, Gold, Pure White
  const colors = {
    bgDark: 'bg-[#7f1d1d]', // Deep Crimson
    bgLight: 'bg-[#fdfbf7]', // Ivory/Off-White
    gold: 'text-[#d4af37]',
    goldBorder: 'border-[#d4af37]',
    goldBg: 'bg-[#d4af37]',
    textDark: 'text-[#3f0f0f]',
    textLight: 'text-[#fdfbf7]',
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
          <section key="hero" className={`relative min-h-[90vh] flex items-center justify-center text-center ${colors.bgDark} overflow-hidden`}>
            {/* Stained Glass Hint Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.15]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0L120 60L60 120L0 60Z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3Cpath d='M60 20L100 60L60 100L20 60Z' fill='%237f1d1d' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '120px'
            }}></div>
            
            <div className="absolute inset-0 z-0">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1438032005730-c779502fac39?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7f1d1d] via-[#7f1d1d]/80 to-transparent"></div>
            </div>
            
            {/* Arch Framing */}
            <div className="absolute inset-4 md:inset-8 border-4 border-double border-[#d4af37]/40 z-0 pointer-events-none rounded-t-[1000px]"></div>
            
            <div className="relative z-10 px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="space-y-6 md:space-y-8 flex flex-col items-center pt-20">
                <span className={`inline-block ${colors.gold} text-xs md:text-sm font-serif italic tracking-[0.3em] uppercase mb-4`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white font-bold leading-[1.1] drop-shadow-2xl">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-lg md:text-2xl ${colors.gold} font-serif italic max-w-md md:max-w-2xl mx-auto drop-shadow-md`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <div className="pt-12">
                  <a href="#about" className={`inline-flex items-center gap-2 ${colors.goldBg} ${colors.textDark} px-10 py-3 rounded-full font-serif font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#7f1d1d] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]`}>
                    Welcome
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-32 px-6 ${colors.bgLight} relative`}>
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#7f1d1d]/10 to-transparent"></div>
            
            <div className="max-w-6xl mx-auto text-center pt-8">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-8">
                  <div className={`w-[2px] h-16 ${colors.goldBg}`}></div>
                </div>
                <h2 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-6`}>{religiousData.about_title || 'About Us'}</h2>
                <h3 className={`text-3xl md:text-5xl font-serif ${colors.textDark} font-bold mb-10 leading-snug`}>Faith, Hope, & Love</h3>
                <p className={`text-xl font-serif text-stone-700 leading-relaxed mb-16`}>
                  {religiousData.about_description || 'We are a community dedicated to faith and service, welcoming all who seek peace and spiritual growth.'}
                </p>
              </motion.div>
              
              {religiousData.vision_mission && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                  <div className={`p-12 border border-[#d4af37]/30 bg-white relative shadow-xl rounded-t-[100px]`}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-4">
                      <div className={`w-12 h-12 rounded-full border-2 ${colors.goldBorder} flex items-center justify-center`}>
                        <div className={`w-2 h-2 ${colors.goldBg} rounded-full`}></div>
                      </div>
                    </div>
                    <h4 className={`text-2xl font-serif ${colors.textDark} font-bold mb-6 pt-4`}>Our Mission</h4>
                    <p className={`text-stone-700 leading-relaxed whitespace-pre-wrap font-serif italic text-lg`}>
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
          <section key="leaders" id="leaders" className={`py-32 px-6 ${colors.bgLight} relative border-t border-[#d4af37]/20`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h3 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-4`}>Leadership</h3>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.textDark} font-bold`}>Our Clergy</h2>
                <div className={`w-24 h-[1px] ${colors.goldBg} mx-auto mt-8`}></div>
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
                    <div className={`w-48 h-64 p-2 border border-[#d4af37]/50 mb-8 bg-white relative overflow-hidden transition-all duration-700 rounded-t-[100px] shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-t-[90px] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full rounded-t-[90px] bg-stone-100 flex items-center justify-center">
                          <User size={50} className="text-stone-300" />
                        </div>
                      )}
                    </div>
                    <h3 className={`text-2xl font-serif ${colors.textDark} font-bold mb-2`}>{leader.name || 'Leader Name'}</h3>
                    {leader.title && (
                      <p className={`${colors.gold} text-lg font-serif italic mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <p className={`text-xs uppercase tracking-[0.2em] font-bold text-stone-400`}>{leader.role}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-32 px-6 ${colors.bgDark} relative`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20L20 0Z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '40px'
            }}></div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-20 flex flex-col items-center">
                <h3 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${colors.gold} mb-4`}>Schedule</h3>
                <h2 className={`text-4xl md:text-5xl font-serif text-white font-bold`}>Worship Services</h2>
                <div className={`w-[2px] h-12 ${colors.goldBg} mx-auto mt-8`}></div>
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center p-8 bg-[#631414] border border-[#d4af37]/20 shadow-xl relative overflow-hidden`}
                  >
                    <div className="md:w-1/3 mb-6 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-[#d4af37]/20 pb-6 md:pb-0 md:pr-8">
                      <span className={`text-3xl font-serif font-bold ${colors.gold} mb-2`}>{item.time || '10:00 AM'}</span>
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock size={16} />
                        <span className="text-sm uppercase tracking-widest">Time</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 md:pl-10 text-center md:text-left">
                      <h4 className={`text-2xl font-serif text-white font-bold mb-3`}>{item.name || 'Sunday Service'}</h4>
                      {item.description && <p className={`text-[#fdfbf7]/70 font-serif italic text-lg`}>{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-white/50 font-serif italic">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-32 px-6 ${colors.bgLight}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h3 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-4`}>Community</h3>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.textDark} font-bold`}>Ministries & Programs</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 border border-[#d4af37]/30 bg-white shadow-lg flex flex-col h-full rounded-t-[50px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                  >
                    <div className="flex justify-center mb-8">
                      <div className={`w-16 h-16 rounded-full border border-[#d4af37]/50 flex items-center justify-center text-[#7f1d1d] group-hover:bg-[#7f1d1d] group-hover:text-white transition-colors duration-300`}>
                        <Heart size={24} />
                      </div>
                    </div>
                    <h3 className={`text-2xl font-serif ${colors.textDark} font-bold mb-4 text-center`}>{item.name || 'Program Name'}</h3>
                    <p className={`text-stone-600 mb-8 flex-1 leading-relaxed font-serif text-center`}>{item.description}</p>
                    
                    {item.timing && (
                      <div className="mt-auto border-t border-[#d4af37]/20 pt-6 flex flex-col items-center gap-2">
                        <span className={`text-xs font-bold text-stone-400 uppercase tracking-[0.2em]`}>Timing</span>
                        <span className={`text-sm font-serif font-bold ${colors.gold}`}>{item.timing}</span>
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
          <section key="gallery" id="gallery" className={`py-32 px-6 ${colors.bgLight} border-t border-[#d4af37]/20`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20 flex flex-col items-center">
                <h3 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${colors.textDark} mb-4`}>Gallery</h3>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.textDark} font-bold`}>Moments of Fellowship</h2>
                <div className={`w-16 h-[2px] ${colors.goldBg} mx-auto mt-8`}></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`aspect-[4/5] overflow-hidden group cursor-pointer relative shadow-md rounded-t-[100px] border-4 border-white`}
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-[#7f1d1d]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-32 px-6 ${colors.bgDark} relative border-t-8 border-double border-[#d4af37]/40`}>
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                  <h3 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${colors.gold} mb-4`}>Contact Us</h3>
                  <h2 className={`text-4xl md:text-6xl font-serif text-white font-bold mb-12`}>Join Us in Worship</h2>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className={`w-14 h-14 rounded-full border border-[#d4af37]/50 flex items-center justify-center shrink-0 bg-[#631414] shadow-lg`}>
                        <MapPin size={24} className={colors.gold} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-serif font-bold tracking-widest uppercase text-white/50 mb-2`}>Location</h4>
                        <p className={`text-xl font-serif text-white leading-relaxed`}>
                          {content.contact_info?.address || '123 Faith Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className={`w-14 h-14 rounded-full border border-[#d4af37]/50 flex items-center justify-center shrink-0 bg-[#631414] shadow-lg`}>
                        <Phone size={24} className={colors.gold} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-serif font-bold tracking-widest uppercase text-white/50 mb-2`}>Contact</h4>
                        <p className={`text-xl font-serif text-white`}>
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                  <div className={`p-4 bg-white/5 border border-[#d4af37]/30 shadow-2xl rounded-t-[150px] overflow-hidden`}>
                    <div className="aspect-[4/5] w-full bg-white overflow-hidden rounded-t-[140px]">
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
              <div className={`w-20 h-28 border-2 ${colors.goldBorder} rounded-t-full flex items-center justify-center mb-8`}>
                <div className={`w-1 h-12 ${colors.goldBg} relative`}>
                  <div className={`absolute top-4 -left-3 w-7 h-1 ${colors.goldBg}`}></div>
                </div>
              </div>
              <h2 className={`text-xl font-serif ${colors.gold} tracking-[0.3em] uppercase`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.bgLight} ${colors.textDark} selection:bg-[#7f1d1d] selection:text-white overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
