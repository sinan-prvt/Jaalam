import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, User, Info, Phone, Heart, Flower2, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChristianFloralLayout({ website, content }: { website: any, content: any }) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
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

  // Floral Christian Theme Colors
  const colors = {
    primary: 'bg-[#cbd5e1]', // Soft slate
    primaryText: 'text-[#475569]',
    accent: 'text-[#86efac]', // Sage Green
    accentBg: 'bg-[#86efac]',
    accentDark: 'text-[#166534]',
    blush: 'bg-[#fbcfe8]',
    blushText: 'text-[#db2777]',
    lightBg: 'bg-[#f8fafc]',
    white: 'bg-white',
    darkText: 'text-[#1e293b]',
    mutedText: 'text-[#64748b]',
    borderLight: 'border-[#e2e8f0]',
  };

  const LeafDivider = () => (
    <div className="flex justify-center items-center gap-4 my-8 opacity-60">
      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#86efac]"></div>
      <Leaf size={20} className={colors.accentDark} strokeWidth={1.5} />
      <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#86efac]"></div>
    </div>
  );

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className="relative min-h-[90vh] flex items-center justify-center bg-[#f8fafc] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <motion.div 
                initial={{ scale: 1.05, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Church" 
                  className="w-full h-full object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
              </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-white/80 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-white shadow-[0_20px_50px_-20px_rgba(134,239,172,0.3)]"
              >
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Flower2 size={16} className={colors.blushText} />
                  <span className={`font-serif tracking-[0.2em] uppercase text-sm ${colors.blushText}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                  <Flower2 size={16} className={colors.blushText} />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-serif text-[#1e293b] tracking-tight leading-[1.1] mb-6">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className="text-xl md:text-2xl text-[#64748b] font-serif italic font-light mb-10 max-w-2xl mx-auto">
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <a href="#about" className={`inline-flex items-center gap-2 bg-[#166534] text-white px-8 py-3.5 rounded-full font-serif text-lg tracking-wide hover:bg-[#14532d] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1`}>
                  Welcome
                </a>
              </motion.div>
            </div>
            
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#fbcfe8] rounded-full blur-3xl opacity-40"></div>
            <div className="absolute top-10 -right-20 w-80 h-80 bg-[#86efac] rounded-full blur-3xl opacity-30"></div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 bg-white relative overflow-hidden`}>
            {/* Background floral watermark */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none -rotate-12 translate-x-1/4 -translate-y-1/4">
              <Flower2 size={400} />
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.darkText} mb-4`}>
                  {religiousData.about_title || 'About Us'}
                </h2>
                <LeafDivider />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p className={`text-xl leading-relaxed ${colors.mutedText} font-serif font-light mb-12`}>
                  {religiousData.about_description || 'We are a community dedicated to faith and service.'}
                </p>
                
                {religiousData.vision_mission && (
                  <div className={`p-10 rounded-[2.5rem] bg-[#f8fafc] border border-[#f1f5f9] relative`}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Info size={20} className={colors.accentDark} />
                    </div>
                    <h3 className={`text-xl font-serif italic ${colors.darkText} mb-4`}>Our Vision & Mission</h3>
                    <p className={`text-lg leading-relaxed ${colors.mutedText} font-light whitespace-pre-wrap`}>
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
          <section key="leaders" id="leaders" className="py-24 lg:py-32 px-6 bg-[#f8fafc] relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm ${colors.blushText} mb-2 block`}>Leadership</span>
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.darkText}`}>Pastoral Team</h3>
                <LeafDivider />
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col items-center group bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative mb-6 w-48 h-48 rounded-full p-2 border border-dashed border-[#86efac] transition-transform duration-500 group-hover:rotate-[15deg]">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-sm group-hover:-rotate-[15deg] transition-transform duration-500">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-[#f8fafc] flex items-center justify-center ${colors.mutedText}`}>
                            <User size={48} opacity={0.5} />
                          </div>
                        )}
                      </div>
                      {/* Decorative dot */}
                      <div className="absolute top-2 right-6 w-3 h-3 bg-[#fbcfe8] rounded-full border border-white"></div>
                    </div>
                    <h4 className={`text-2xl font-serif font-bold ${colors.darkText} mb-1`}>{leader.name || 'Leader Name'}</h4>
                    {leader.title && (
                      <p className={`text-sm font-serif italic ${colors.accentDark} mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className={`mt-2 px-4 py-1.5 bg-[#f8fafc] rounded-full text-slate-500 text-xs font-sans uppercase tracking-widest`}>
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
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 bg-white`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.darkText}`}>Service Times</h3>
                <LeafDivider />
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group bg-[#f8fafc] p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-transparent hover:border-[#86efac]/30 hover:bg-[#f0fdf4]/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Calendar size={18} className={colors.accentDark} />
                      </div>
                      <div>
                        <h4 className={`text-xl font-serif font-bold ${colors.darkText}`}>{item.name || 'Service'}</h4>
                        {item.description && <p className={`text-[#64748b] font-light mt-1`}>{item.description}</p>}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-sm`}>
                      <Clock size={16} className={colors.blushText} />
                      <span className="font-serif font-medium text-slate-700">{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-slate-500 font-serif italic">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className="py-24 lg:py-32 px-6 bg-[#f8fafc] relative">
            <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
              <Leaf size={300} />
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.darkText}`}>Ministries</h3>
                <LeafDivider />
                <p className={`text-lg ${colors.mutedText} font-serif max-w-2xl mx-auto font-light`}>
                  Explore the various programs, classes, and groups we offer to support and engage our community.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full border border-slate-100 group"
                  >
                    <div className="mb-6">
                      <div className="w-12 h-12 bg-[#f0fdf4] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Heart size={20} className={colors.accentDark} />
                      </div>
                      <h4 className={`text-2xl font-serif font-bold ${colors.darkText} mb-3`}>{item.name || 'Program Name'}</h4>
                      {item.description && <p className={`text-[#64748b] font-light leading-relaxed`}>{item.description}</p>}
                    </div>
                    
                    {item.timing && (
                      <div className="mt-auto pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={16} className={colors.blushText} />
                          <span className="text-sm font-medium">{item.timing}</span>
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
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 bg-white`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.darkText}`}>Gallery</h3>
                <LeafDivider />
              </div>
              
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                    className="break-inside-avoid relative group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-auto rounded-[2rem] transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500 rounded-[2rem]"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 bg-[#166534] text-white relative overflow-hidden`}>
            {/* Background elements */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#14532d] rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#86efac] rounded-full blur-3xl opacity-10"></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-white">Visit Us</h3>
                  <div className="w-16 h-[2px] bg-[#86efac] mb-12 opacity-60"></div>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className="mt-1 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <MapPin size={24} className="text-[#86efac]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold mb-2 tracking-wide text-white">Location</h4>
                        {!hiddenFields.includes('contact_address') && (
                                        <p className="text-white/80 font-light leading-relaxed text-lg max-w-sm">
                                                                  {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                                </p>
                                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="mt-1 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Phone size={24} className="text-[#86efac]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold mb-2 tracking-wide text-white">Contact</h4>
                        <p className="text-white/80 font-light text-lg">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white/10 rounded-[3rem] backdrop-blur-md border border-white/20">
                  <div className="aspect-square md:aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden flex items-center justify-center relative bg-[#14532d]">
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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f8fafc]`}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                {/* Soft blooming floral/leaf animation */}
                <div className="relative w-24 h-24 flex items-center justify-center text-[#86efac]">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5], rotate: [0, 90, 180] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <Flower2 size={48} strokeWidth={1} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [1, 0.5, 1], rotate: [180, 270, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute text-[#fbcfe8]"
                  >
                    <Flower2 size={48} strokeWidth={1} />
                  </motion.div>
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm font-serif text-[#166534] tracking-[0.4em] uppercase`}
              >
                Loading
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-[#1e293b] selection:bg-[#86efac] selection:text-[#166534] overflow-x-hidden min-h-screen bg-[#f8fafc]`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
