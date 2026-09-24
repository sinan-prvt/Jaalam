import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, ArrowRight, User, Info, Phone, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChristianMinimalLayout({ website, content }: { website: any, content: any }) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
  const religiousData = content?.settings_json?.religious_event || {};
  const sections = religiousData.sections || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
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

  // Modern Minimal Christian Theme Colors
  const colors = {
    bg: 'bg-white',
    text: 'text-[#09090b]', // Zinc 950
    textMuted: 'text-[#71717a]', // Zinc 500
    border: 'border-[#e4e4e7]', // Zinc 200
    accent: 'text-[#09090b]',
    surface: 'bg-[#fafafa]', // Zinc 50
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className={`relative min-h-[95vh] flex items-center ${colors.bg} overflow-hidden`}>
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-24">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col justify-center order-2 lg:order-1"
              >
                <div className="flex items-center gap-4 mb-10">
                  <span className={`font-sans tracking-[0.2em] uppercase text-xs font-bold ${colors.text}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                  <div className={`w-12 h-[1px] bg-[#09090b]`}></div>
                </div>
                
                <h1 className={`text-6xl md:text-7xl lg:text-8xl font-sans font-medium ${colors.text} tracking-tighter leading-[0.95] mb-8`}>
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl ${colors.textMuted} font-sans font-light leading-relaxed max-w-md mb-12`}>
                    {religiousData.tagline}
                  </p>
                )}
                
                <div>
                  <a href="#about" className={`inline-flex items-center justify-center gap-3 bg-[#09090b] text-white px-8 py-4 rounded-full hover:bg-[#27272a] transition-all duration-300 font-sans text-sm font-medium tracking-wide group`}>
                    Explore Community
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="order-1 lg:order-2 h-[50vh] lg:h-[80vh] w-full rounded-[2rem] overflow-hidden"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Church Cover" 
                  className="w-full h-full object-cover object-center filter grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 ${colors.surface}`}>
            <div className="max-w-[1400px] mx-auto">
              <div className="grid lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-5">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h2 className={`text-xs font-sans font-bold tracking-[0.2em] uppercase ${colors.textMuted} mb-4`}>
                      About Us
                    </h2>
                    <h3 className={`text-4xl md:text-5xl font-sans font-medium ${colors.text} tracking-tight leading-tight`}>
                      {religiousData.about_title || 'Who we are'}
                    </h3>
                  </motion.div>
                </div>
                
                <div className="lg:col-span-7">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <p className={`text-2xl md:text-3xl leading-snug ${colors.text} font-sans font-light mb-12`}>
                      {religiousData.about_description || 'We are a community dedicated to faith and service, embracing simplicity and modern life.'}
                    </p>
                    
                    {religiousData.vision_mission && (
                      <div className={`pl-8 border-l-2 ${colors.border}`}>
                        <h4 className={`text-sm font-sans font-bold tracking-[0.1em] uppercase ${colors.text} mb-4`}>Vision & Mission</h4>
                        <p className={`text-lg leading-relaxed ${colors.textMuted} font-light whitespace-pre-wrap`}>
                          {religiousData.vision_mission}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-24 lg:py-32 px-6 ${colors.bg}`}>
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-20">
                <h3 className={`text-4xl md:text-5xl font-sans font-medium ${colors.text} tracking-tight`}>Leadership</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className={`mb-6 w-full aspect-[4/5] bg-zinc-100 rounded-[1.5rem] overflow-hidden`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${colors.textMuted}`}>
                          <User size={48} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xl font-sans font-medium ${colors.text}`}>{leader.name || 'Leader Name'}</h4>
                      {leader.title && (
                        <p className={`text-sm font-sans font-normal ${colors.textMuted} mt-1`}>{leader.title}</p>
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
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 ${colors.surface}`}>
            <div className="max-w-[1400px] mx-auto">
              <div className="grid lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-5">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                    <h3 className={`text-4xl md:text-5xl font-sans font-medium ${colors.text} tracking-tight mb-6`}>
                      Gatherings
                    </h3>
                    <p className={`text-lg ${colors.textMuted} font-light max-w-md`}>Join us for our regular services and events.</p>
                  </motion.div>
                </div>
                
                <div className="lg:col-span-7">
                  <div className={`border-t border-[#09090b]`}>
                    {(religiousData.schedule || []).map((item: any, idx: number) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`py-8 border-b ${colors.border} flex flex-col sm:flex-row sm:items-start justify-between gap-6 group`}
                      >
                        <div className="flex-1">
                          <h4 className={`text-2xl font-sans font-medium ${colors.text} mb-2 group-hover:translate-x-2 transition-transform duration-300`}>{item.name || 'Service'}</h4>
                          {item.description && <p className={`text-base ${colors.textMuted} font-light`}>{item.description}</p>}
                        </div>
                        <div className={`flex items-center gap-3 ${colors.text} shrink-0 bg-white px-4 py-2 rounded-full border ${colors.border}`}>
                          <Clock size={16} strokeWidth={2} />
                          <span className="font-sans font-medium text-sm">{item.time || '12:00 PM'}</span>
                        </div>
                      </motion.div>
                    ))}
                    {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                      <p className={`py-8 text-left ${colors.textMuted} font-light`}>No schedule available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-24 lg:py-32 px-6 ${colors.bg}`}>
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-20">
                <h3 className={`text-4xl md:text-5xl font-sans font-medium ${colors.text} tracking-tight`}>Ministries</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`p-10 bg-zinc-50 rounded-[2rem] flex flex-col h-full hover:bg-zinc-100 transition-colors duration-300`}
                  >
                    <div className="mb-8 flex-1">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                        <Activity size={20} strokeWidth={2} className={colors.text} />
                      </div>
                      <h4 className={`text-2xl font-sans font-medium ${colors.text} mb-4`}>{item.name || 'Program Name'}</h4>
                      {item.description && <p className={`text-base ${colors.textMuted} font-light leading-relaxed`}>{item.description}</p>}
                    </div>
                    
                    {item.timing && (
                      <div className={`pt-6 border-t ${colors.border}`}>
                        <div className={`flex items-center gap-2 ${colors.text}`}>
                          <Clock size={16} strokeWidth={2} />
                          <span className="text-sm font-sans font-medium">{item.timing}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className={`col-span-full py-12 text-center ${colors.textMuted} font-light`}>No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 ${colors.surface}`}>
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-16">
                <h3 className={`text-4xl md:text-5xl font-sans font-medium ${colors.text} tracking-tight`}>Gallery</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: (idx % 4) * 0.1 }}
                    className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-200 group"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 bg-[#09090b] text-white rounded-t-[3rem] mt-12 mx-4 mb-4`}>
            <div className="max-w-[1400px] mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h3 className="text-5xl md:text-6xl font-sans font-medium mb-12 tracking-tight">Visit Us</h3>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6">
                      <div className="mt-1 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <MapPin size={20} strokeWidth={2} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-sans font-bold tracking-[0.1em] uppercase mb-2 text-zinc-400">Location</h4>
                        {!hiddenFields.includes('contact_address') && (
                                        <p className="text-white font-light text-xl leading-relaxed max-w-sm">
                                                                  {content.contact_info?.address || '123 Faith Lane, City, Country'}
                                                                </p>
                                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="mt-1 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Phone size={20} strokeWidth={2} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-sans font-bold tracking-[0.1em] uppercase mb-2 text-zinc-400">Phone</h4>
                        <p className="text-white font-light text-xl">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-square md:aspect-video w-full rounded-[2rem] overflow-hidden relative bg-zinc-900 border border-white/10">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(1.2)' }}
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
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-white`}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                {/* Modern minimalist spinner */}
                <div className="w-12 h-12 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-xs font-sans font-bold text-zinc-900 tracking-[0.3em] uppercase`}
              >
                Loading
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.text} selection:bg-zinc-900 selection:text-white overflow-x-hidden min-h-screen ${colors.bg}`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
