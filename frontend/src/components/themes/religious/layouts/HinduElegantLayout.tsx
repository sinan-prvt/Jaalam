import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, User, Phone, ArrowRight, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HinduElegantLayout({ website, content }: { website: any, content: any }) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
  const religiousData = content?.settings_json?.religious_event || {};
  const sections = religiousData.sections || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

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

  // Temple Elegant Theme Colors
  const colors = {
    emerald: 'text-[#064e3b]', // Deep Emerald Green
    emeraldBg: 'bg-[#064e3b]',
    gold: 'text-[#d4af37]', // Antique Gold
    goldBg: 'bg-[#d4af37]',
    ivory: 'bg-[#fafaf9]', // Pearl White/Ivory
    white: 'bg-white',
    darkText: 'text-[#1c1917]',
    mutedText: 'text-[#44403c]',
    borderGold: 'border-[#d4af37]',
  };

  const ElegantDivider = () => (
    <div className="flex justify-center items-center gap-6 my-10 opacity-70">
      <div className="w-32 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></div>
      <Sparkles size={16} className="text-[#d4af37]" strokeWidth={1.5} />
      <div className="w-32 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></div>
    </div>
  );

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className={`relative min-h-[90vh] flex items-center justify-center bg-[#064e3b] overflow-hidden px-4 md:px-8 py-12`}>
            {/* Background elements */}
            <div className="absolute inset-0 z-0 opacity-40">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
              <motion.div 
                initial={{ scale: 1.1, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-full h-full"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1590396009804-00d9b4b08709?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Temple Cover" 
                  className="w-full h-full object-cover object-center mix-blend-luminosity filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b] via-[#064e3b]/80 to-transparent"></div>
              </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-6xl mx-auto h-[75vh] flex items-center justify-center">
              {/* Elegant Gold Frame */}
              <div className="absolute inset-0 border border-[#d4af37]/30 pointer-events-none rounded-sm"></div>
              <div className="absolute inset-2 border border-[#d4af37]/50 pointer-events-none rounded-sm"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1.2, delay: 0.5 }}
                className="text-center px-6 max-w-4xl"
              >
                <span className={`font-sans tracking-[0.3em] uppercase text-xs font-bold text-[#d4af37] mb-8 block`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif text-[#fafaf9] tracking-tight leading-[1.1] mb-8 drop-shadow-xl`}>
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                <ElegantDivider />
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl text-[#fafaf9]/80 font-serif italic mb-12 leading-relaxed max-w-2xl mx-auto`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <a href="#about" className={`inline-flex items-center gap-3 bg-transparent text-[#d4af37] px-10 py-4 font-serif text-lg tracking-widest border border-[#d4af37] hover:bg-[#d4af37] hover:text-[#064e3b] transition-all duration-500 uppercase text-sm`}>
                  Discover More
                </a>
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-32 px-6 ${colors.ivory} relative`}>
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            
            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.emerald} mb-6`}>
                  {religiousData.about_title || 'Our Heritage'}
                </h2>
                <ElegantDivider />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p className={`text-2xl leading-loose ${colors.darkText} font-serif mb-16`}>
                  {religiousData.about_description || 'We are a community dedicated to faith, preserving ancient traditions and serving society.'}
                </p>
                
                {religiousData.vision_mission && (
                  <div className={`p-12 border border-[#d4af37]/40 relative bg-white shadow-[0_20px_50px_-20px_rgba(6,78,59,0.1)]`}>
                    <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-[#d4af37]"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-[#d4af37]"></div>
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-[#d4af37]"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-[#d4af37]"></div>
                    
                    <h3 className={`text-xl font-sans tracking-[0.2em] uppercase ${colors.emerald} mb-6`}>Vision & Mission</h3>
                    <p className={`text-lg leading-relaxed ${colors.mutedText} font-serif whitespace-pre-wrap`}>
                      {religiousData.vision_mission}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-32 px-6 ${colors.white} relative border-y border-[#d4af37]/20`}>
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-24">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.emerald}`}>Temple Leadership</h3>
                <ElegantDivider />
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="relative mb-8 w-56 h-56 p-1 border border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors duration-500 rounded-full">
                      <div className="w-full h-full overflow-hidden rounded-full bg-[#fafaf9]">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover filter sepia-[0.3] group-hover:sepia-0 transition-all duration-700" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${colors.mutedText}`}>
                            <User size={48} opacity={0.3} />
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className={`text-3xl font-serif ${colors.darkText} mb-2`}>{leader.name || 'Name'}</h4>
                    {leader.title && (
                      <p className={`text-lg font-serif italic text-[#d4af37] mb-4`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className={`mt-2 font-sans text-xs tracking-[0.2em] uppercase ${colors.emerald}`}>
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
          <section key="schedule" id="schedule" className={`py-32 px-6 ${colors.ivory} relative`}>
            <div className="max-w-5xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-5 text-center lg:text-left sticky top-12">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.emerald} mb-6`}>Pooja Timings</h3>
                <div className="w-24 h-[1px] bg-[#d4af37] mx-auto lg:mx-0 mb-8"></div>
                <p className={`text-lg font-serif ${colors.mutedText} leading-relaxed`}>
                  Join us for our daily rituals and find peace within the sacred chants and offerings.
                </p>
              </div>
              
              <div className="lg:col-span-7 space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`bg-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-[#d4af37]/20 shadow-sm hover:shadow-[0_10px_30px_rgba(6,78,59,0.05)] transition-shadow`}
                  >
                    <div className="flex-1">
                      <h4 className={`text-2xl font-serif ${colors.darkText}`}>{item.name || 'Aarti / Pooja'}</h4>
                      {item.description && <p className={`text-[#44403c] font-serif mt-3 text-lg`}>{item.description}</p>}
                    </div>
                    <div className={`flex items-center gap-3 shrink-0`}>
                      <Clock size={18} className={colors.gold} />
                      <span className="font-sans text-[#064e3b] text-xl font-light tracking-wider">{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-[#44403c] font-serif italic">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-32 px-6 ${colors.white} relative border-y border-[#d4af37]/20`}>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-24">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.emerald}`}>Temple Services</h3>
                <ElegantDivider />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-[#fafaf9] p-12 border border-[#d4af37]/20 flex flex-col h-full group hover:bg-white hover:border-[#d4af37]/60 transition-all duration-500"
                  >
                    <div className="mb-8">
                      <h4 className={`text-2xl font-serif ${colors.darkText} mb-4`}>{item.name || 'Service Name'}</h4>
                      <p className={`text-[#44403c] font-serif leading-relaxed text-lg`}>{item.description}</p>
                    </div>
                    
                    {item.timing && (
                      <div className="mt-auto pt-8 border-t border-[#d4af37]/20">
                        <div className="flex items-center gap-3 text-[#064e3b] font-sans text-sm tracking-widest uppercase">
                          <Calendar size={16} />
                          <span>{item.timing}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-[#44403c] font-serif italic py-12">No services listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-32 px-6 ${colors.ivory} relative`}>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-24">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.emerald}`}>Gallery</h3>
                <ElegantDivider />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
                    className="aspect-square relative overflow-hidden group border border-[#d4af37]/20"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-1000" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-32 px-6 bg-[#064e3b] text-[#fafaf9] relative`}>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-20">
                <div className="flex flex-col justify-center">
                  <h3 className="text-4xl md:text-5xl font-serif mb-12 text-[#d4af37]">Visit Us</h3>
                  
                  <div className="space-y-12">
                    <div className="flex items-start gap-8 border-b border-[#d4af37]/20 pb-8">
                      <div className="mt-1">
                        <MapPin size={32} className="text-[#d4af37]" strokeWidth={1} />
                      </div>
                      <div>
                        <h4 className="text-xs font-sans font-bold tracking-[0.3em] uppercase mb-3 text-[#d4af37]">Location</h4>
                        {!hiddenFields.includes('contact_address') && (
                                        <p className="text-[#fafaf9] font-serif leading-relaxed text-2xl">
                                                                  {content.contact_info?.address || '123 Sacred Lane, City, Country'}
                                                                </p>
                                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-8">
                      <div className="mt-1">
                        <Phone size={32} className="text-[#d4af37]" strokeWidth={1} />
                      </div>
                      <div>
                        <h4 className="text-xs font-sans font-bold tracking-[0.3em] uppercase mb-3 text-[#d4af37]">Contact</h4>
                        <p className="text-[#fafaf9] font-serif text-2xl">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative p-6 border border-[#d4af37]/30 bg-[#064e3b]">
                  <div className="aspect-square md:aspect-[4/3] w-full relative z-10">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'grayscale(0.8) contrast(1.2)' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Sacred Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                  {/* Decorative corner blocks */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#d4af37]"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#d4af37]"></div>
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
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#064e3b]`}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-10 relative flex items-center justify-center w-40 h-40"
              >
                {/* Elegant glowing mandala/sun loader */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[1px] border-[#d4af37]/30 rounded-full flex items-center justify-center"
                >
                  <div className="w-full h-[1px] bg-[#d4af37]/30 absolute"></div>
                  <div className="w-[1px] h-full bg-[#d4af37]/30 absolute"></div>
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-[2px] border-dotted border-[#d4af37] rounded-full"
                ></motion.div>
                <Sun size={48} className="text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" strokeWidth={1} />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm font-sans font-light text-[#d4af37] tracking-[0.5em] uppercase`}
              >
                Awakening
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-[#1c1917] selection:bg-[#d4af37] selection:text-[#064e3b] overflow-x-hidden min-h-screen bg-[#fafaf9]`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
