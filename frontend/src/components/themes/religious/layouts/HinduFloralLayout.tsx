import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, User, Info, Phone, ArrowRight, Flower2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HinduFloralLayout({ website, content }: { website: any, content: any }) {
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

  // Temple Floral Theme Colors
  const colors = {
    pink: 'text-[#db2777]', // Lotus Pink
    pinkBg: 'bg-[#db2777]',
    marigold: 'text-[#f59e0b]', // Orange/Yellow
    marigoldBg: 'bg-[#f59e0b]',
    rose: 'bg-[#fff1f2]', // Soft Rose Cream
    white: 'bg-white',
    darkText: 'text-[#4c1d95]', // Deep purple for contrast
    mutedText: 'text-[#831843]', // Dark pink text
    borderFloral: 'border-[#fbcfe8]',
  };

  const FloralDivider = () => (
    <div className="flex justify-center items-center gap-4 my-8">
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#db2777]/50 rounded-full"></div>
      <Flower2 size={24} className="text-[#db2777] animate-[spin_10s_linear_infinite]" strokeWidth={1.5} />
      <Flower2 size={16} className="text-[#f59e0b] -ml-3 z-10" strokeWidth={2} />
      <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#db2777]/50 rounded-full"></div>
    </div>
  );

  const BackgroundPetals = () => (
    <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
      <div className="absolute top-10 left-10 text-[#db2777] rotate-45"><Flower2 size={200} /></div>
      <div className="absolute bottom-20 right-10 text-[#f59e0b] -rotate-12"><Flower2 size={300} /></div>
      <div className="absolute top-1/2 left-1/3 text-[#be185d] rotate-90"><Flower2 size={150} /></div>
    </div>
  );

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <section key="hero" id="hero" className={`relative min-h-[95vh] flex items-center justify-center bg-[#fdf2f8] overflow-hidden`}>
            {/* Glowing orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#fbcfe8] rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#fde68a] rounded-full blur-[100px] opacity-40"></div>
            
            <div className="absolute inset-0 z-0 flex justify-center items-center opacity-10">
              <Flower2 size={800} className="text-[#db2777] animate-[spin_60s_linear_infinite]" strokeWidth={0.5} />
            </div>
            
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.2 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-[#fbcfe8] shadow-sm mb-8">
                  <Flower2 size={16} className={colors.marigold} />
                  <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.pink}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                  <Flower2 size={16} className={colors.marigold} />
                </div>
                
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif ${colors.darkText} tracking-tight leading-[1.05] mb-8 drop-shadow-sm`}>
                  {religiousData.organization_name || 'Temple Name'}
                </h1>
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl ${colors.mutedText} font-serif italic mb-10 max-w-xl leading-relaxed`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <div className="flex justify-center lg:justify-start">
                  <a href="#about" className={`inline-flex items-center gap-3 bg-gradient-to-r from-[#db2777] to-[#be185d] text-white px-10 py-4 rounded-full font-serif text-lg tracking-wide hover:shadow-[0_10px_40px_-10px_rgba(219,39,119,0.8)] hover:-translate-y-1 transition-all duration-300`}>
                    Join the Celebration <ArrowRight size={20} />
                  </a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }} 
                animate={{ opacity: 1, scale: 1, rotate: 0 }} 
                transition={{ duration: 1.2, delay: 0.4 }}
                className="flex-1 relative w-full max-w-md mx-auto"
              >
                <div className="aspect-[4/5] rounded-t-[150px] rounded-b-[40px] overflow-hidden relative border-8 border-white shadow-2xl z-10 bg-[#fbcfe8]">
                  <img 
                    src={religiousData.cover_image || 'https://images.unsplash.com/photo-1601004655452-f673fa6c5897?auto=format&fit=crop&w=1000&q=80'} 
                    alt="Temple Cover" 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#db2777]/20 to-transparent mix-blend-overlay"></div>
                </div>
                
                {/* Decorative floating elements */}
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-10 -right-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-[#fbcfe8] z-20">
                  <Flower2 size={40} className={colors.marigold} />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#fde68a] z-20">
                  <Heart size={30} className={colors.pink} />
                </motion.div>
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 ${colors.white} relative overflow-hidden`}>
            <BackgroundPetals />
            
            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className={`text-sm font-sans font-bold tracking-[0.2em] uppercase ${colors.marigold} mb-4 block`}>Our Essence</span>
                <h2 className={`text-4xl md:text-6xl font-serif ${colors.pink} mb-4`}>
                  {religiousData.about_title || 'About Us'}
                </h2>
                <FloralDivider />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p className={`text-xl md:text-2xl leading-relaxed ${colors.darkText} font-serif mb-16 px-4`}>
                  {religiousData.about_description || 'We are a community dedicated to faith, preserving ancient traditions and serving society with love and joy.'}
                </p>
                
                {religiousData.vision_mission && (
                  <div className={`p-10 md:p-14 bg-[#fff1f2] rounded-[3rem] border border-[#fbcfe8] relative shadow-sm`}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md border border-[#fbcfe8]">
                      <Info size={28} className={colors.pink} />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-serif ${colors.pink} mb-6 mt-4`}>Vision & Mission</h3>
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
          <section key="leaders" id="leaders" className={`py-24 lg:py-32 px-6 ${colors.rose} relative`}>
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.marigold} mb-4 block`}>Community</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.pink}`}>Our Leaders</h3>
                <FloralDivider />
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
                    <div className="relative mb-8 w-56 h-56 rounded-full p-2 bg-gradient-to-tr from-[#db2777] to-[#f59e0b] shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                      <div className="w-full h-full overflow-hidden rounded-full border-4 border-white bg-white">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-white flex items-center justify-center ${colors.mutedText}`}>
                            <User size={64} opacity={0.2} />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-4 -right-2 bg-white rounded-full p-2 shadow-md">
                        <Flower2 size={24} className={colors.pink} />
                      </div>
                    </div>
                    <h4 className={`text-2xl font-serif ${colors.darkText} mb-2`}>{leader.name || 'Name'}</h4>
                    {leader.title && (
                      <p className={`text-base font-serif italic ${colors.pink} mb-3`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className={`mt-2 px-5 py-1.5 rounded-full bg-white text-[#db2777] text-xs font-sans font-bold uppercase tracking-[0.1em] border border-[#fbcfe8] shadow-sm`}>
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
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 ${colors.white} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#fbcfe8] rounded-full blur-[100px] opacity-30"></div>
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.marigold} mb-4 block`}>Rituals & Offerings</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.pink}`}>Pooja Timings</h3>
                <FloralDivider />
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`bg-white p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#fbcfe8] shadow-sm hover:shadow-lg hover:border-[#db2777]/30 transition-all group`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 w-10 h-10 rounded-full bg-[#fff1f2] flex items-center justify-center shrink-0">
                         <Flower2 size={18} className={colors.pink} />
                      </div>
                      <div>
                        <h4 className={`text-2xl font-serif ${colors.darkText} group-hover:text-[#db2777] transition-colors`}>{item.name || 'Aarti / Pooja'}</h4>
                        {item.description && <p className={`text-[#831843] font-serif mt-2`}>{item.description}</p>}
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 shrink-0 bg-[#fff1f2] px-6 py-3 rounded-full border border-[#fbcfe8]`}>
                      <Clock size={20} className={colors.marigold} />
                      <span className="font-serif text-[#4c1d95] text-lg font-medium tracking-wide">{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-[#831843] font-serif italic py-8">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className={`py-24 lg:py-32 px-6 ${colors.rose} relative`}>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.marigold} mb-4 block`}>Joyful Activities</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.pink}`}>Temple Events</h3>
                <FloralDivider />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-white p-10 rounded-[3rem] border border-[#fbcfe8] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col h-full group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#fbcfe8] flex items-center justify-center mb-8 shadow-md">
                      <Heart size={28} className="text-white" />
                    </div>
                    <div className="mb-8 flex-1">
                      <h4 className={`text-2xl font-serif ${colors.darkText} mb-4`}>{item.name || 'Event Name'}</h4>
                      <p className={`text-[#831843] font-serif leading-relaxed`}>{item.description}</p>
                    </div>
                    
                    {item.timing && (
                      <div className="pt-6 border-t border-[#fbcfe8]">
                        <div className="flex items-center gap-2 text-[#db2777] font-serif">
                          <Calendar size={18} />
                          <span className="text-base tracking-wide font-medium">{item.timing}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-[#831843] font-serif italic py-12">No events listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 ${colors.white} relative overflow-hidden`}>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.marigold} mb-4 block`}>Celebrations</span>
                <h3 className={`text-4xl md:text-6xl font-serif ${colors.pink}`}>Gallery</h3>
                <FloralDivider />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                    className="aspect-square relative rounded-full overflow-hidden shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-500 border-4 border-[#fff1f2]"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#db2777]/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 bg-gradient-to-br from-[#db2777] to-[#be185d] text-white relative rounded-t-[4rem] mt-12 mx-4 mb-4`}>
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
               <Flower2 size={400} />
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="lg:pr-12">
                  <span className={`text-sm font-sans font-bold tracking-[0.2em] uppercase text-[#fde68a] mb-4 block`}>Connect</span>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-12 text-white">Visit the Temple</h3>
                  
                  <div className="space-y-12">
                    <div className="flex items-start gap-6 group">
                      <div className="mt-1 flex-shrink-0 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                        <MapPin size={24} className="text-[#fde68a]" />
                      </div>
                      <div>
                        <h4 className="text-base font-sans font-bold tracking-[0.1em] uppercase mb-2 text-[#fde68a]">Address</h4>
                        <p className="text-white font-serif leading-relaxed text-xl max-w-sm">
                          {content.contact_info?.address || '123 Sacred Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="mt-1 flex-shrink-0 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                        <Phone size={24} className="text-[#fde68a]" />
                      </div>
                      <div>
                        <h4 className="text-base font-sans font-bold tracking-[0.1em] uppercase mb-2 text-[#fde68a]">Phone</h4>
                        <p className="text-white font-serif text-xl">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/10 rounded-[3rem] backdrop-blur-md border border-white/20 shadow-2xl">
                  <div className="aspect-square md:aspect-[4/3] w-full bg-[#fbcfe8] rounded-[2.5rem] overflow-hidden relative border-4 border-white">
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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fff1f2]`}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-8 relative flex items-center justify-center w-32 h-32"
              >
                {/* Blooming lotus loader */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Flower2 size={64} className="text-[#db2777] opacity-50" strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2], rotate: [180, 270, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Flower2 size={64} className="text-[#f59e0b] opacity-80" strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white w-12 h-12 rounded-full absolute flex items-center justify-center shadow-lg"
                >
                  <Heart size={20} className="text-[#db2777]" fill="#db2777" />
                </motion.div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm font-sans font-bold text-[#db2777] tracking-[0.3em] uppercase`}
              >
                Blossoming...
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-[#4c1d95] selection:bg-[#db2777] selection:text-white overflow-x-hidden min-h-screen bg-white`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
