import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, ArrowRight, User, Info, Phone, BookOpen, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChristianClassicLayout({ website, content }: { website: any, content: any }) {
  const religiousData = content?.settings_json?.religious_event || {};
  const sections = religiousData.sections || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
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

  // Classic Christian Theme Colors
  const colors = {
    primary: 'bg-[#7f1d1d]', // Deep Burgundy
    primaryText: 'text-[#7f1d1d]',
    accent: 'text-[#d97706]', // Warm Gold
    accentBg: 'bg-[#d97706]',
    lightBg: 'bg-[#fefce8]', // Cream
    darkText: 'text-slate-900',
    mutedText: 'text-slate-600',
    borderLight: 'border-[#fde68a]',
    borderDark: 'border-[#7f1d1d]'
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <motion.div 
                initial={{ scale: 1.1 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-full h-full"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1548625361-ec853c604b34?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Church" 
                  className="w-full h-full object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#7f1d1d]/80"></div>
              </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full"
              >
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className={`h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent to-[#d97706]`}></div>
                  <span className={`font-serif tracking-[0.3em] uppercase text-sm md:text-base ${colors.accent}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                  <div className={`h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent to-[#d97706]`}></div>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-wide leading-tight mb-8 drop-shadow-2xl">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className="text-xl md:text-2xl text-white/90 font-serif italic font-light mb-12 max-w-2xl mx-auto">
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <a href="#about" className={`inline-flex items-center gap-2 border border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-white px-8 py-3 rounded-sm font-serif uppercase tracking-widest transition-all duration-300`}>
                  Enter <ChevronRight size={18} />
                </a>
              </motion.div>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-[#d97706]"></div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 ${colors.lightBg} relative`}>
            {/* Corner Ornaments */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#7f1d1d]/20"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#7f1d1d]/20"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#7f1d1d]/20"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#7f1d1d]/20"></div>
            
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <h2 className={`text-4xl md:text-5xl font-serif ${colors.primaryText} mb-6`}>
                    {religiousData.about_title || 'About Us'}
                  </h2>
                  <div className="flex justify-center items-center gap-2 mb-8">
                    <div className="w-12 h-[1px] bg-[#d97706]"></div>
                    <div className="w-2 h-2 rotate-45 bg-[#7f1d1d]"></div>
                    <div className="w-12 h-[1px] bg-[#d97706]"></div>
                  </div>
                </motion.div>
              </div>
              
              <div className="grid md:grid-cols-5 gap-12 items-center">
                <div className="md:col-span-3">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <p className={`text-lg leading-relaxed ${colors.darkText} font-serif mb-8`}>
                      {religiousData.about_description || 'We are a community dedicated to faith and service.'}
                    </p>
                    {religiousData.vision_mission && (
                      <div className={`p-8 border ${colors.borderLight} bg-white shadow-sm relative`}>
                        <div className={`absolute -top-3 left-8 bg-white px-2 text-sm font-serif tracking-widest uppercase ${colors.accent}`}>Our Mission</div>
                        <p className={`text-base leading-relaxed ${colors.mutedText} whitespace-pre-wrap`}>
                          {religiousData.vision_mission}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
                <div className="md:col-span-2 hidden md:block">
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="aspect-[3/4] p-4 border border-[#7f1d1d]/20 relative">
                      <div className={`absolute inset-0 bg-white shadow-lg m-4 flex items-center justify-center p-8 text-center border ${colors.borderLight}`}>
                        <div>
                          <div className={`text-6xl font-serif ${colors.primaryText} opacity-20 mb-4`}>&ldquo;</div>
                          <p className="font-serif italic text-lg text-slate-700">Faith is taking the first step even when you don't see the whole staircase.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className="py-24 lg:py-32 px-6 bg-white relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-sm font-serif tracking-[0.2em] uppercase ${colors.accent} mb-4`}>Our Leadership</h2>
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.primaryText}`}>Pastoral Team</h3>
                <div className="flex justify-center items-center gap-2 mt-6">
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                  <div className="w-2 h-2 rotate-45 bg-[#7f1d1d]"></div>
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="relative mb-8 w-64 h-64 p-2 border border-[#7f1d1d]/20 rounded-full transition-transform duration-500 group-hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-md">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-[#fefce8] flex items-center justify-center ${colors.primaryText}`}>
                            <User size={64} opacity={0.5} />
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className={`text-2xl font-serif font-bold ${colors.darkText} mb-2`}>{leader.name || 'Leader Name'}</h4>
                    {leader.title && (
                      <p className={`text-sm font-serif italic ${colors.primaryText} mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className={`mt-2 px-4 py-1 border ${colors.borderLight} text-slate-600 text-xs font-serif uppercase tracking-widest`}>
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
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 ${colors.lightBg} border-y border-[#7f1d1d]/10`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.primaryText} mb-6`}>Service Times</h3>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                  <Calendar size={16} className={colors.accent} />
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                </div>
              </div>
              
              <div className="bg-white p-8 md:p-12 shadow-md border border-[#7f1d1d]/10 relative">
                {/* Traditional corner embellishments */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#7f1d1d]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#7f1d1d]"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#7f1d1d]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#7f1d1d]"></div>

                <div className="space-y-6">
                  {(religiousData.schedule || []).map((item: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 last:border-0 last:pb-0 gap-4"
                    >
                      <div>
                        <h4 className={`text-xl font-serif font-bold ${colors.darkText}`}>{item.name || 'Service'}</h4>
                        {item.description && <p className={`text-slate-500 font-serif mt-1 text-sm italic`}>{item.description}</p>}
                      </div>
                      <div className={`flex items-center gap-2 ${colors.primaryText}`}>
                        <Clock size={18} />
                        <span className="font-serif font-bold">{item.time || '12:00 PM'}</span>
                      </div>
                    </motion.div>
                  ))}
                  {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                    <p className="text-center text-slate-500 font-serif italic">No schedule available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className="py-24 lg:py-32 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.primaryText} mb-6`}>Ministries & Programs</h3>
                <div className="flex justify-center items-center gap-2 mb-6">
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                  <BookOpen size={16} className={colors.accent} />
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                </div>
                <p className={`text-lg ${colors.mutedText} font-serif max-w-2xl mx-auto`}>
                  Explore the various programs, classes, and groups we offer to support and engage our community.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="border border-[#7f1d1d]/10 bg-[#fefce8]/30 p-8 flex flex-col h-full hover:shadow-md transition-shadow group"
                  >
                    <div className="mb-6">
                      <h4 className={`text-2xl font-serif font-bold ${colors.darkText} mb-3 group-hover:text-[#7f1d1d] transition-colors`}>{item.name || 'Program Name'}</h4>
                      <div className="w-8 h-[2px] bg-[#d97706] mb-4"></div>
                      {item.description && <p className={`text-slate-600 font-serif leading-relaxed`}>{item.description}</p>}
                    </div>
                    
                    {item.timing && (
                      <div className="mt-auto pt-6 border-t border-[#7f1d1d]/10">
                        <div className="flex items-center gap-2 text-slate-500 font-serif">
                          <Clock size={16} />
                          <span className="text-sm italic">{item.timing}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-slate-500 font-serif italic">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 ${colors.lightBg} border-y border-[#7f1d1d]/10`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.primaryText} mb-6`}>Gallery</h3>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                  <div className="w-2 h-2 rotate-45 bg-[#7f1d1d]"></div>
                  <div className="w-12 h-[1px] bg-[#d97706]"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 bg-white border border-[#7f1d1d]/10 shadow-sm">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="aspect-[4/3] overflow-hidden relative group border-2 border-white shadow-sm"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#7f1d1d]/0 group-hover:bg-[#7f1d1d]/20 transition-colors duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 ${colors.primary} text-[#fefce8] relative overflow-hidden`}>
            {/* Traditional pattern background overlay */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-[#fefce8]">Visit Us</h3>
                  <div className="w-16 h-[2px] bg-[#d97706] mb-12"></div>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6">
                      <div className="mt-1">
                        <MapPin size={28} className="text-[#d97706]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold mb-3 tracking-wide text-white">Location</h4>
                        <p className="text-white/80 font-serif leading-relaxed text-lg max-w-sm">
                          {content.contact_info?.address || '123 Faith Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="mt-1">
                        <Phone size={28} className="text-[#d97706]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold mb-3 tracking-wide text-white">Contact</h4>
                        <p className="text-white/80 font-serif text-lg">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-[#d97706]/30 bg-black/20">
                  <div className="aspect-square md:aspect-[4/3] w-full flex items-center justify-center relative bg-white border-4 border-[#fefce8]/10 overflow-hidden">
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
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#7f1d1d]`}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                {/* Classic fading cross animation */}
                <div className="relative w-16 h-16 flex items-center justify-center text-[#d97706]">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Plus size={64} strokeWidth={1} />
                  </motion.div>
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm font-serif text-[#d97706] tracking-[0.4em] uppercase`}
              >
                Loading
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-slate-800 selection:bg-[#7f1d1d] selection:text-[#fefce8] overflow-x-hidden min-h-screen bg-white`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
