import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, User, Phone, ArrowRight, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HinduMinimalLayout({ website, content }: { website: any, content: any }) {
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

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className="relative min-h-[95vh] flex items-center bg-white px-6 md:px-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-[40vw] h-full hidden lg:block bg-stone-100 z-0"></div>
            
            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center z-10 relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-[1px] bg-orange-600"></div>
                  <span className="font-sans tracking-[0.2em] uppercase text-xs font-bold text-orange-600">
                    {religiousData.subtitle || website.business_type}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-light text-stone-900 tracking-tight leading-[1.1] mb-8">
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className="text-xl md:text-2xl text-stone-500 font-sans font-light mb-12 leading-relaxed">
                    {religiousData.tagline}
                  </p>
                )}
                
                <div>
                  <a href="#about" className="inline-flex items-center gap-4 text-stone-900 font-sans uppercase tracking-widest text-sm font-bold group">
                    <span>Enter Temple</span>
                    <span className="w-10 h-[1px] bg-stone-900 group-hover:w-16 transition-all duration-300"></span>
                  </a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1, delay: 0.3 }}
                className="relative h-[60vh] lg:h-[80vh] w-full"
              >
                <img 
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1500&q=80'} 
                  alt="Temple Cover" 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 object-center"
                />
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className="py-32 md:py-48 px-6 md:px-16 bg-white border-t border-stone-100">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-3xl md:text-5xl font-sans font-light text-stone-900">
                    {religiousData.about_title || 'About Us'}
                  </h2>
                  <div className="w-12 h-[1px] bg-orange-600 mt-8"></div>
                </motion.div>
              </div>
              
              <div className="lg:col-span-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                  <p className="text-2xl md:text-3xl font-sans font-light leading-relaxed text-stone-800 mb-16">
                    {religiousData.about_description || 'We are a community dedicated to faith, preserving ancient traditions and serving society.'}
                  </p>
                  
                  {religiousData.vision_mission && (
                    <div className="border-l border-stone-200 pl-8">
                      <span className="font-sans tracking-[0.2em] uppercase text-xs font-bold text-stone-400 mb-4 block">Vision & Mission</span>
                      <p className="text-lg leading-loose text-stone-500 font-sans whitespace-pre-wrap max-w-3xl">
                        {religiousData.vision_mission}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className="py-32 md:py-48 px-6 md:px-16 bg-stone-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                <div>
                  <h3 className="text-3xl md:text-5xl font-sans font-light text-stone-900 mb-6">Leadership</h3>
                  <div className="w-12 h-[1px] bg-orange-600"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col group"
                  >
                    <div className="mb-8 w-full aspect-[4/5] overflow-hidden bg-stone-200 relative">
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <User size={64} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <h4 className="text-2xl font-sans font-light text-stone-900 mb-2">{leader.name || 'Name'}</h4>
                    {leader.title && (
                      <p className="text-base font-sans text-stone-500 mb-4">{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className="text-orange-600 text-xs font-sans font-bold uppercase tracking-widest mt-auto">
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
          <section key="schedule" id="schedule" className="py-32 md:py-48 px-6 md:px-16 bg-white border-t border-stone-100">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <h3 className="text-3xl md:text-5xl font-sans font-light text-stone-900 mb-6">Timings</h3>
                <div className="w-12 h-[1px] bg-orange-600"></div>
              </div>
              
              <div className="lg:col-span-8">
                <div className="space-y-0">
                  {(religiousData.schedule || []).map((item: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="py-8 border-b border-stone-200 flex flex-col md:flex-row md:items-baseline justify-between gap-6 group"
                    >
                      <div className="flex-1">
                        <h4 className="text-2xl font-sans font-light text-stone-900 group-hover:text-orange-600 transition-colors">{item.name || 'Aarti / Pooja'}</h4>
                        {item.description && <p className="text-stone-500 font-sans mt-3 text-lg font-light leading-relaxed max-w-xl">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-stone-400">
                        <Clock size={16} />
                        <span className="font-sans text-stone-900 text-xl font-light">{item.time || '12:00 PM'}</span>
                      </div>
                    </motion.div>
                  ))}
                  {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                    <p className="text-stone-400 font-sans italic py-8 border-b border-stone-200">No schedule available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className="py-32 md:py-48 px-6 md:px-16 bg-white border-t border-stone-100">
            <div className="max-w-7xl mx-auto">
              <div className="mb-24">
                <h3 className="text-3xl md:text-5xl font-sans font-light text-stone-900 mb-6">Services</h3>
                <div className="w-12 h-[1px] bg-orange-600"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col group"
                  >
                    <div className="flex-1">
                      <h4 className="text-2xl font-sans font-light text-stone-900 mb-6">{item.name || 'Service Name'}</h4>
                      <p className="text-stone-500 font-sans font-light leading-relaxed text-lg mb-8">{item.description}</p>
                    </div>
                    
                    {item.timing && (
                      <div className="flex items-center gap-3 text-stone-400 mt-auto pt-6 border-t border-stone-100">
                        <Calendar size={16} />
                        <span className="text-sm font-sans tracking-wide">{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-stone-400 font-sans italic">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className="py-32 md:py-48 px-6 md:px-16 bg-stone-50">
            <div className="max-w-7xl mx-auto">
              <div className="mb-24">
                <h3 className="text-3xl md:text-5xl font-sans font-light text-stone-900 mb-6">Gallery</h3>
                <div className="w-12 h-[1px] bg-orange-600"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
                    className="aspect-square overflow-hidden bg-stone-200 group"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className="py-32 md:py-48 px-6 md:px-16 bg-stone-900 text-white">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
              <div>
                <h3 className="text-4xl md:text-6xl font-sans font-light mb-8">Contact</h3>
                <div className="w-12 h-[1px] bg-orange-600 mb-20"></div>
                
                <div className="space-y-16">
                  <div>
                    <h4 className="text-xs font-sans font-bold tracking-[0.2em] uppercase mb-4 text-stone-500">Address</h4>
                    <p className="font-sans font-light text-2xl leading-relaxed max-w-sm text-stone-300">
                      {content.contact_info?.address || '123 Sacred Lane, City, Country'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-bold tracking-[0.2em] uppercase mb-4 text-stone-500">Phone</h4>
                    <p className="font-sans font-light text-2xl text-stone-300">
                      {religiousData.contactNumbers || '+1 234 567 890'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-full min-h-[400px] w-full bg-stone-800 relative filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content?.contact_info?.address || '123 Sacred Lane, City, Country')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
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
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 100 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-[1px] bg-stone-900 mb-8"
              ></motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xs font-sans font-bold text-stone-400 tracking-[0.4em] uppercase"
              >
                Loading
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="font-sans antialiased text-stone-900 selection:bg-orange-600 selection:text-white overflow-x-hidden min-h-screen bg-white">
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
