import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Info, Phone, Calendar, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SereneMosqueLayout({ website, content }: { website: any, content: any }) {
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

  // Serene Palette: Mint, Sky Blue, White
  const colors = {
    bgLight: 'bg-[#f0f9f6]', // Soft Mint
    bgWhite: 'bg-white',
    accent1: 'text-[#5d9c8c]', // Deep Mint
    accent1Bg: 'bg-[#5d9c8c]',
    accent2: 'text-[#7caeb8]', // Muted Blue
    textDark: 'text-[#2c403b]', // Dark Slate Green
    textDim: 'text-[#637d77]',
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
          <section key="hero" className={`relative min-h-[90vh] flex items-center justify-center text-center ${colors.bgLight} overflow-hidden`}>
            {/* Soft Blurred Gradients */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-[#d3efe4] rounded-full blur-[100px] opacity-60 pointer-events-none`}></div>
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#dcedf0] rounded-full blur-[100px] opacity-60 pointer-events-none`}></div>

            <div className="absolute inset-0 z-0 opacity-20 mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)">
              <img 
                src={religiousData.cover_image || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=2000&q=80'} 
                alt="Cover" 
                className="w-full h-full object-cover object-center filter blur-[2px]"
              />
            </div>
            
            <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center pt-10">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="space-y-6">
                <div className={`inline-flex px-6 py-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm border border-white/60 mb-4`}>
                  <span className={`text-xs font-medium tracking-widest uppercase ${colors.accent1}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                </div>
                
                <h1 className={`text-5xl md:text-7xl font-sans font-light ${colors.textDark} leading-[1.1] tracking-tight drop-shadow-sm`}>
                  {religiousData.organization_name || 'Organization Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl ${colors.textDim} font-sans font-light max-w-2xl mx-auto leading-relaxed`}>
                    {religiousData.tagline}
                  </p>
                )}
                
                <div className="pt-12">
                  <a href="#about" className={`inline-flex items-center gap-3 ${colors.accent1Bg} text-white px-8 py-4 rounded-full font-medium tracking-wide shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                    Begin Journey
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section key="about" id="about" className={`py-32 px-6 ${colors.bgWhite} relative`}>
            <div className="max-w-6xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                <h2 className={`text-xs font-semibold tracking-widest uppercase ${colors.accent2} mb-6`}>{religiousData.about_title || 'About Us'}</h2>
                <h3 className={`text-3xl md:text-5xl font-light ${colors.textDark} mb-12 max-w-4xl mx-auto leading-tight`}>
                  "{religiousData.about_description || 'We are a community dedicated to faith and service, welcoming all who seek peace and spiritual growth.'}"
                </h3>
              </motion.div>
              
              {religiousData.vision_mission && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                  <div className={`p-10 rounded-[3rem] bg-[#f5fbf9] shadow-sm border border-[#e4f5ef] text-left`}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className={`w-12 h-12 rounded-full ${colors.accent1Bg} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                        <Info size={24} />
                      </div>
                      <div>
                        <h4 className={`text-xl font-medium ${colors.textDark} mb-4`}>Our Purpose</h4>
                        <p className={`text-lg ${colors.textDim} leading-relaxed font-light whitespace-pre-wrap`}>
                          {religiousData.vision_mission}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        );

      case 'leaders':
        if (!religiousData.leaders || religiousData.leaders.length === 0) return null;
        return (
          <section key="leaders" id="leaders" className={`py-32 px-6 ${colors.bgLight} relative`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-xs font-semibold tracking-widest uppercase ${colors.accent1} mb-4`}>Leadership</h2>
                <h3 className={`text-3xl md:text-4xl font-light ${colors.textDark}`}>Those Who Guide Us</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`w-32 h-32 rounded-full mb-6 overflow-hidden bg-[#e4f5ef] ring-4 ring-[#e4f5ef] ring-offset-4 group-hover:ring-[#5d9c8c] transition-all duration-500`}>
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={40} className={colors.accent1} />
                        </div>
                      )}
                    </div>
                    <h4 className={`text-xl font-medium ${colors.textDark} mb-1`}>{leader.name || 'Leader Name'}</h4>
                    {leader.title && (
                      <p className={`${colors.accent2} font-light mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${colors.textDim}`}>{leader.role}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <section key="schedule" id="schedule" className={`py-32 px-6 ${colors.bgWhite}`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-xs font-semibold tracking-widest uppercase ${colors.accent2} mb-4`}>Schedule</h2>
                <h3 className={`text-3xl md:text-4xl font-light ${colors.textDark}`}>Daily Prayers & Services</h3>
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-[2rem] bg-[#fafdfc] border border-[#e4f5ef] hover:border-[#5d9c8c]/40 transition-colors group`}
                  >
                    <div className="md:w-1/3 mb-4 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start">
                      <div className={`w-12 h-12 rounded-full ${colors.bgLight} flex items-center justify-center mb-3 group-hover:${colors.accent1Bg} group-hover:text-white transition-colors text-[#5d9c8c]`}>
                        <Clock size={20} />
                      </div>
                      <span className={`text-xl font-medium ${colors.textDark}`}>{item.time || '12:00 PM'}</span>
                    </div>
                    <div className="md:w-2/3 md:pl-8 text-center md:text-left md:border-l border-[#e4f5ef]">
                      <h4 className={`text-2xl font-light ${colors.textDark} mb-2`}>{item.name || 'Service'}</h4>
                      {item.description && <p className={`${colors.textDim} font-light`}>{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-stone-400 font-light">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-32 px-6 ${colors.bgLight}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-xs font-semibold tracking-widest uppercase ${colors.accent1} mb-4`}>Community</h2>
                <h3 className={`text-3xl md:text-4xl font-light ${colors.textDark}`}>Programs & Activities</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 rounded-[2.5rem] bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <Heart size={28} className={`${colors.accent2} mb-6`} strokeWidth={1.5} />
                    <h4 className={`text-2xl font-medium ${colors.textDark} mb-4`}>{item.name || 'Program Name'}</h4>
                    <p className={`${colors.textDim} mb-8 flex-1 leading-relaxed font-light`}>{item.description}</p>
                    
                    {item.timing && (
                      <div className="mt-auto pt-6 border-t border-[#f0f9f6] flex items-center gap-2">
                        <span className={`text-xs font-bold ${colors.accent1} uppercase tracking-widest`}>Timing:</span>
                        <span className={`text-sm font-medium ${colors.textDark}`}>{item.timing}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-stone-400 font-light">No programs listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-32 px-6 ${colors.bgWhite}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className={`text-xs font-semibold tracking-widest uppercase ${colors.accent2} mb-4`}>Gallery</h2>
                <h3 className={`text-3xl md:text-4xl font-light ${colors.textDark}`}>Visual Journey</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`aspect-square overflow-hidden rounded-[2rem] bg-[#f0f9f6] group cursor-pointer`}
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-32 px-6 ${colors.bgLight} relative overflow-hidden`}>
            {/* Background elements */}
            <div className={`absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-white rounded-full blur-[80px] opacity-60 pointer-events-none`}></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                  <h2 className={`text-xs font-semibold tracking-widest uppercase ${colors.accent1} mb-4`}>Contact Us</h2>
                  <h3 className={`text-4xl md:text-5xl font-light ${colors.textDark} mb-12`}>Reach Out</h3>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-12 h-12 rounded-2xl ${colors.bgWhite} flex items-center justify-center shrink-0 shadow-sm text-[#5d9c8c]`}>
                        <MapPin size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase ${colors.textDim} mb-1`}>Location</h4>
                        <p className={`text-xl font-light ${colors.textDark} leading-relaxed`}>
                          {content.contact_info?.address || '123 Faith Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className={`w-12 h-12 rounded-2xl ${colors.bgWhite} flex items-center justify-center shrink-0 shadow-sm text-[#5d9c8c]`}>
                        <Phone size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase ${colors.textDim} mb-1`}>Contact</h4>
                        <p className={`text-xl font-light ${colors.textDark}`}>
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                  <div className={`p-3 bg-white rounded-[3rem] shadow-lg border border-[#e4f5ef]`}>
                    <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden bg-[#f0f9f6]">
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
            className={`fixed inset-0 z-50 flex items-center justify-center ${colors.bgLight}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-6`}>
                <div className={`w-8 h-8 rounded-full ${colors.accent1Bg} animate-ping`}></div>
              </div>
              <h2 className={`text-xl font-light ${colors.accent1} tracking-[0.2em] uppercase`}>Loading</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased ${colors.bgWhite} ${colors.textDark} selection:bg-[#5d9c8c] selection:text-white overflow-x-hidden min-h-screen`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
