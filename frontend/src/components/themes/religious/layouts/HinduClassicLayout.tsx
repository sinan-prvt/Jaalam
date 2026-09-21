import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, User, Info, Phone, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HinduClassicLayout({ website, content }: { website: any, content: any }) {
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

  // Temple Classic Theme Colors
  const colors = {
    maroon: 'text-[#7f1d1d]', // Burgundy
    maroonBg: 'bg-[#7f1d1d]',
    brass: 'text-[#b45309]', // Brass/Gold
    brassBg: 'bg-[#b45309]',
    ivory: 'bg-[#fefce8]', // Warm Cream
    white: 'bg-white',
    darkText: 'text-[#451a03]', // Dark brown
    mutedText: 'text-[#78350f]',
    borderBrass: 'border-[#b45309]',
  };

  const ClassicDivider = () => (
    <div className="flex justify-center items-center gap-4 my-8 opacity-80">
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#b45309]"></div>
      <div className="w-2 h-2 rounded-full bg-[#7f1d1d]"></div>
      <div className="w-3 h-3 rounded-full border border-[#b45309]"></div>
      <div className="w-2 h-2 rounded-full bg-[#7f1d1d]"></div>
      <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#b45309]"></div>
    </div>
  );

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className={`relative min-h-[90vh] flex items-center justify-center bg-[#451a03] overflow-hidden`}>
            <div className="absolute inset-0 z-0">
              <motion.div 
                initial={{ scale: 1.05, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1621217333649-650a3ccb8ec5?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Temple Cover" 
                  className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#451a03]/50 to-[#451a03]"></div>
              </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-[#fefce8]/95 backdrop-blur-sm p-12 md:p-20 border-y-4 border-[#b45309] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-full relative"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#7f1d1d]"></div>
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#7f1d1d]"></div>
                
                <span className={`font-serif tracking-[0.4em] uppercase text-xs font-bold ${colors.maroon} mb-6 block`}>
                  {religiousData.subtitle || website.business_type}
                </span>
                
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif ${colors.darkText} tracking-tight leading-[1.05] mb-8`}>
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                <ClassicDivider />
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl ${colors.mutedText} font-serif italic mb-12 max-w-2xl mx-auto leading-relaxed`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <a href="#about" className={`inline-flex items-center gap-3 bg-[#7f1d1d] text-[#fefce8] px-10 py-4 font-serif text-lg tracking-widest hover:bg-[#451a03] transition-colors duration-300 border border-[#b45309]`}>
                  Enter the Temple
                </a>
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 ${colors.ivory} relative overflow-hidden border-b border-[#b45309]/20`}>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#b45309 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className={`text-sm font-sans font-bold tracking-[0.2em] uppercase ${colors.brass} mb-4 block`}>History & Heritage</span>
                <h2 className={`text-4xl md:text-6xl font-serif ${colors.maroon} mb-4`}>
                  {religiousData.about_title || 'About the Temple'}
                </h2>
                <ClassicDivider />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p className={`text-xl md:text-2xl leading-relaxed ${colors.darkText} font-serif mb-16 px-4`}>
                  {religiousData.about_description || 'We are a community dedicated to faith, preserving ancient traditions and serving society.'}
                </p>
                
                {religiousData.vision_mission && (
                  <div className={`p-12 bg-white border border-[#b45309]/30 relative shadow-lg`}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#fefce8] px-6 py-2 border border-[#b45309]">
                      <Info size={24} className={colors.maroon} />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-serif ${colors.maroon} mb-6 mt-4`}>Vision & Mission</h3>
                    <p className={`text-lg leading-relaxed ${colors.mutedText} font-serif whitespace-pre-wrap px-4`}>
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
          <section key="leaders" id="leaders" className={`py-24 lg:py-32 px-6 ${colors.white} relative border-b border-[#b45309]/20`}>
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.brass} mb-4 block`}>Administration</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.maroon}`}>Temple Leadership</h3>
                <ClassicDivider />
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="relative mb-8 w-48 h-48 rounded-full border border-[#b45309] p-2 bg-[#fefce8] shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                      <div className="w-full h-full overflow-hidden rounded-full">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                        ) : (
                          <div className={`w-full h-full bg-white flex items-center justify-center ${colors.mutedText}`}>
                            <User size={48} opacity={0.3} />
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className={`text-2xl font-serif ${colors.darkText} mb-2`}>{leader.name || 'Name'}</h4>
                    {leader.title && (
                      <p className={`text-base font-serif italic ${colors.maroon} mb-4`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className={`mt-2 px-4 py-1 border-t border-b border-[#b45309]/30 text-[#b45309] text-xs font-sans font-bold uppercase tracking-[0.2em]`}>
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
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 ${colors.ivory} relative border-b border-[#b45309]/20`}>
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.brass} mb-4 block`}>Daily Rituals</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.maroon}`}>Pooja Timings</h3>
                <ClassicDivider />
              </div>
              
              <div className="space-y-0 border-y-2 border-[#7f1d1d]">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`bg-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#b45309]/20 hover:bg-white transition-colors group`}
                  >
                    <div className="flex-1">
                      <h4 className={`text-2xl font-serif ${colors.darkText} group-hover:text-[#7f1d1d] transition-colors`}>{item.name || 'Aarti / Pooja'}</h4>
                      {item.description && <p className={`text-[#78350f] font-serif mt-2`}>{item.description}</p>}
                    </div>
                    <div className={`flex items-center gap-3 shrink-0`}>
                      <Clock size={20} className={colors.brass} />
                      <span className="font-serif text-[#451a03] text-xl tracking-wide">{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-[#78350f] font-serif italic py-8">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-24 lg:py-32 px-6 ${colors.white} relative border-b border-[#b45309]/20`}>
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.brass} mb-4 block`}>Services</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.maroon}`}>Temple Programs</h3>
                <ClassicDivider />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-[#fefce8] p-10 border border-[#b45309]/30 shadow-sm hover:shadow-xl transition-all flex flex-col h-full text-center group"
                  >
                    <div className="mb-8 flex justify-center">
                      <BookOpen size={32} className={colors.maroon} strokeWidth={1.5} />
                    </div>
                    <div className="mb-8 flex-1">
                      <h4 className={`text-2xl font-serif ${colors.darkText} mb-4 group-hover:text-[#7f1d1d] transition-colors`}>{item.name || 'Service Name'}</h4>
                      <p className={`text-[#78350f] font-serif leading-relaxed`}>{item.description}</p>
                    </div>
                    
                    {item.timing && (
                      <div className="pt-6 border-t border-[#b45309]/20 flex justify-center">
                        <div className="flex items-center gap-2 text-[#7f1d1d] font-serif">
                          <Calendar size={18} />
                          <span className="text-base tracking-wide italic">{item.timing}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-[#78350f] font-serif italic py-12">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 ${colors.ivory} relative border-b border-[#b45309]/20`}>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.brass} mb-4 block`}>Visuals</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.maroon}`}>Gallery</h3>
                <ClassicDivider />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                    className="aspect-square relative p-3 bg-white shadow-md border border-[#b45309]/20 group"
                  >
                    <div className="w-full h-full overflow-hidden relative border border-[#b45309]/10">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 bg-[#451a03] text-[#fefce8] relative`}>
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 p-4 bg-[#7f1d1d] shadow-2xl border border-[#b45309]">
                  <div className="aspect-square md:aspect-[4/3] w-full bg-[#fefce8] relative">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'sepia(30%)' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Sacred Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                </div>

                <div className="order-1 lg:order-2 lg:pl-12 text-center lg:text-left">
                  <span className={`text-sm font-sans font-bold tracking-[0.2em] uppercase text-[#b45309] mb-4 block`}>Get in Touch</span>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-12 text-[#fefce8]">Contact Us</h3>
                  
                  <div className="space-y-12 inline-block text-left">
                    <div className="flex items-start gap-6">
                      <div className="mt-1 flex-shrink-0">
                        <MapPin size={28} className="text-[#b45309]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-sm font-sans font-bold tracking-[0.2em] uppercase mb-3 text-[#b45309]">Location</h4>
                        <p className="text-[#fefce8] font-serif leading-relaxed text-xl max-w-sm">
                          {content.contact_info?.address || '123 Sacred Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="mt-1 flex-shrink-0">
                        <Phone size={28} className="text-[#b45309]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-sm font-sans font-bold tracking-[0.2em] uppercase mb-3 text-[#b45309]">Phone</h4>
                        <p className="text-[#fefce8] font-serif text-xl">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
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
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#451a03]`}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-10 relative flex items-center justify-center"
              >
                {/* Classic glowing symmetrical loader */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#b45309] rounded-full blur-2xl opacity-30"
                ></motion.div>
                <div className="w-24 h-24 border border-[#b45309] rotate-45 absolute"></div>
                <div className="w-24 h-24 border border-[#b45309] absolute"></div>
                <div className="w-4 h-4 bg-[#fefce8] rounded-full animate-pulse"></div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm font-serif italic text-[#b45309] tracking-widest`}
              >
                Entering...
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-[#451a03] selection:bg-[#7f1d1d] selection:text-white overflow-x-hidden min-h-screen bg-[#fefce8]`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
