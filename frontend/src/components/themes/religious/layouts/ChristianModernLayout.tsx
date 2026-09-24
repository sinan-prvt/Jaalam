import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, ArrowRight, User, Info, Phone, Heart, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChristianModernLayout({ website, content }: { website: any, content: any }) {
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

  // Modern Christian Theme Colors
  const colors = {
    primary: 'bg-indigo-900', // #312e81
    accent: 'text-indigo-600', // Electric Blue #4f46e5 approx
    accentBg: 'bg-indigo-600',
    lightBg: 'bg-slate-50',
    darkText: 'text-slate-900',
    mutedText: 'text-slate-500',
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className="relative min-h-screen flex items-center bg-white overflow-hidden">
            <div className="absolute top-0 right-0 w-full lg:w-[60%] h-[50vh] lg:h-full z-0">
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1.5 }}
                className="w-full h-full"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Church" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-white/80 to-white"></div>
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay"></div>
              </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 flex items-center mt-20 lg:mt-0">
              <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }} 
                className="max-w-2xl bg-white/90 backdrop-blur-xl p-10 lg:p-16 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className={`inline-block font-sans font-bold tracking-[0.2em] uppercase text-xs mb-6 ${colors.accent}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                  <h1 className={`text-5xl md:text-6xl lg:text-7xl font-sans font-bold ${colors.darkText} tracking-tight leading-[1.1] mb-8`}>
                    {religiousData.organization_name || 'Organization Name'}
                  </h1>
                  {religiousData.tagline && (
                    <p className={`text-xl ${colors.mutedText} font-light leading-relaxed mb-10`}>
                      {religiousData.tagline}
                    </p>
                  )}
                  <a href="#about" className={`inline-flex items-center gap-3 ${colors.accentBg} text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1`}>
                    Discover More <ArrowRight size={20} />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 ${colors.lightBg} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.accent} mb-4`}>About Us</h2>
                  <h3 className={`text-4xl md:text-5xl font-bold ${colors.darkText} tracking-tight mb-8`}>
                    {religiousData.about_title || 'Welcome to Our Church'}
                  </h3>
                  <div className="w-12 h-1 bg-indigo-600 mb-8 rounded-full"></div>
                  <p className={`text-lg md:text-xl ${colors.mutedText} font-light leading-relaxed mb-12`}>
                    {religiousData.about_description || 'We are a community dedicated to faith and service.'}
                  </p>
                </motion.div>
                
                {religiousData.vision_mission && (
                  <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="bg-white p-10 lg:p-12 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(49,46,129,0.1)] border border-slate-100">
                      <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 rotate-12">
                        <Info size={24} />
                      </div>
                      <h4 className={`text-2xl font-bold ${colors.darkText} mb-6`}>Our Vision & Mission</h4>
                      <p className={`text-lg ${colors.mutedText} font-light leading-relaxed whitespace-pre-wrap`}>
                        {religiousData.vision_mission}
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
          <section key="leaders" id="leaders" className="py-24 lg:py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.accent} mb-4`}>Our Leadership</h2>
                <h3 className={`text-4xl md:text-5xl font-bold ${colors.darkText} tracking-tight`}>Pastoral Team</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(49,46,129,0.1)] hover:-translate-y-2 h-full flex flex-col items-center text-center">
                      <div className="w-48 h-48 mb-8 rounded-[2rem] overflow-hidden rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-xl shadow-slate-200/50">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-slate-200 flex items-center justify-center ${colors.mutedText}`}>
                            <User size={64} opacity={0.5} />
                          </div>
                        )}
                      </div>
                      <h4 className={`text-2xl font-bold ${colors.darkText} mb-2`}>{leader.name || 'Leader Name'}</h4>
                      {leader.title && (
                        <p className={`text-sm font-bold tracking-widest uppercase ${colors.accent} mb-4`}>{leader.title}</p>
                      )}
                      {leader.role && (
                        <p className={`text-slate-500 font-light`}>{leader.role}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 ${colors.lightBg}`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.accent} mb-4`}>Join Us</h2>
                <h3 className={`text-4xl md:text-5xl font-bold ${colors.darkText} tracking-tight`}>Service Times</h3>
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-[0_10px_40px_-15px_rgba(49,46,129,0.1)] transition-all"
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors ${colors.accent}`}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h4 className={`text-xl font-bold ${colors.darkText} mb-2`}>{item.name || 'Service'}</h4>
                        {item.description && <p className={`text-slate-500 font-light`}>{item.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl shrink-0 self-start md:self-auto border border-slate-100">
                      <Clock className={colors.accent} size={20} />
                      <span className={`font-bold ${colors.darkText}`}>{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-slate-500 font-light">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className="py-24 lg:py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <div>
                  <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.accent} mb-4`}>Ministries</h2>
                  <h3 className={`text-4xl md:text-5xl font-bold ${colors.darkText} tracking-tight max-w-xl`}>Connect & Grow</h3>
                </div>
                <p className={`text-lg ${colors.mutedText} font-light max-w-md`}>
                  Explore the various programs, classes, and groups we offer to support and engage our community.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="h-full bg-slate-50 p-10 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-[0_20px_50px_-15px_rgba(49,46,129,0.1)] transition-all duration-300 flex flex-col">
                      <div className="mb-8">
                        <div className={`w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ${colors.accent}`}>
                          <Heart size={28} />
                        </div>
                        <h4 className={`text-2xl font-bold ${colors.darkText} mb-4`}>{item.name || 'Program Name'}</h4>
                        {item.description && <p className={`text-slate-500 font-light leading-relaxed`}>{item.description}</p>}
                      </div>
                      
                      {item.timing && (
                        <div className="mt-auto pt-6 border-t border-slate-200">
                          <div className="flex items-center gap-3">
                            <Clock size={18} className={colors.accent} />
                            <span className={`text-sm font-bold ${colors.darkText}`}>{item.timing}</span>
                          </div>
                        </div>
                      )}
                    </div>
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
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 ${colors.lightBg}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.accent} mb-4`}>Gallery</h2>
                <h3 className={`text-4xl md:text-5xl font-bold ${colors.darkText} tracking-tight`}>Community Life</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`rounded-[2rem] overflow-hidden relative group aspect-square ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-colors duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 ${colors.primary} text-white relative overflow-hidden`}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div>
                  <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-300 mb-4">Contact</h2>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-12">Get in Touch</h3>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-indigo-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-indigo-700/50 group-hover:bg-indigo-600 transition-colors">
                        <MapPin size={24} className="text-indigo-200 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-3">Location</h4>
                        {!hiddenFields.includes('contact_address') && (
                                        <p className="text-indigo-200 font-light leading-relaxed max-w-sm text-lg">
                                                                  {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                                </p>
                                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-indigo-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-indigo-700/50 group-hover:bg-indigo-600 transition-colors">
                        <Phone size={24} className="text-indigo-200 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-3">Contact</h4>
                        <p className="text-indigo-200 font-light text-lg">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-30"></div>
                  <div className="relative bg-indigo-950/50 p-4 rounded-[2.5rem] backdrop-blur-md border border-indigo-800/50">
                    <div className="aspect-square md:aspect-[4/3] w-full rounded-[2rem] overflow-hidden flex items-center justify-center relative bg-indigo-900/50">
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
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-indigo-950`}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                {/* Modern minimalist cross/geometry animation */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <motion.div
                    animate={{ height: ["0%", "100%"] }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="absolute w-1 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 1, ease: "circOut", delay: 0.3 }}
                    className="absolute h-1 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-24 h-24 rounded-full border border-indigo-400"
                  />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className={`text-sm font-sans font-bold text-white tracking-[0.3em] uppercase`}
              >
                Loading
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-slate-800 selection:bg-indigo-600 selection:text-white overflow-x-hidden min-h-screen bg-white`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
