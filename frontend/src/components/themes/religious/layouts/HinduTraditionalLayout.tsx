import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, User, Info, Phone, Heart, ArrowRight, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HinduTraditionalLayout({ website, content }: { website: any, content: any }) {
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

  // Hindu Traditional Theme Colors
  const colors = {
    saffron: 'text-[#ea580c]',
    saffronBg: 'bg-[#ea580c]',
    crimson: 'text-[#991b1b]',
    crimsonBg: 'bg-[#991b1b]',
    gold: 'text-[#d97706]',
    goldBg: 'bg-[#fef3c7]',
    lightCream: 'bg-[#fffbeb]',
    darkText: 'text-[#451a03]',
    mutedText: 'text-[#78350f]',
    borderOrnate: 'border-[#fbbf24]',
  };

  const OrnateDivider = () => (
    <div className="flex justify-center items-center gap-4 my-8">
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d97706]"></div>
      <div className="w-3 h-3 rotate-45 bg-[#ea580c] shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
      <div className="w-3 h-3 rotate-45 bg-[#f59e0b] -ml-2"></div>
      <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d97706]"></div>
    </div>
  );

  const BackgroundMandala = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden flex items-center justify-center">
      {/* Decorative repeating mandala-like circle using CSS */}
      <div className="w-[800px] h-[800px] rounded-full border-[40px] border-dashed border-[#991b1b] animate-[spin_120s_linear_infinite]"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full border-[20px] border-dotted border-[#ea580c] animate-[spin_90s_linear_infinite_reverse]"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full border-[10px] border-double border-[#d97706]"></div>
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
                  src={religiousData.cover_image || 'https://images.unsplash.com/photo-1590396009804-00d9b4b08709?auto=format&fit=crop&w=2000&q=80'} 
                  alt="Temple Cover" 
                  className="w-full h-full object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#451a03] via-[#451a03]/60 to-transparent"></div>
              </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-[#fffbeb]/90 backdrop-blur-md p-10 md:p-16 border-[4px] border-double border-[#d97706] relative shadow-[0_20px_50px_-20px_rgba(234,88,12,0.4)]"
              >
                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#ea580c]"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#ea580c]"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#ea580c]"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#ea580c]"></div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className={`font-serif tracking-[0.3em] uppercase text-sm font-bold ${colors.crimson}`}>
                    {religiousData.subtitle || website.business_type}
                  </span>
                </div>
                
                <h1 className={`text-5xl md:text-7xl font-serif ${colors.darkText} tracking-tight leading-[1.1] mb-6 drop-shadow-sm`}>
                  {religiousData.organization_name || 'Sri Venkateswara Temple'}
                </h1>
                
                <OrnateDivider />
                
                {religiousData.tagline && (
                  <p className={`text-xl md:text-2xl ${colors.mutedText} font-serif italic mb-10 max-w-2xl mx-auto leading-relaxed`}>
                    "{religiousData.tagline}"
                  </p>
                )}
                
                <a href="#about" className={`inline-flex items-center gap-2 bg-gradient-to-r from-[#ea580c] to-[#991b1b] text-white px-10 py-3.5 font-serif text-lg tracking-wider hover:from-[#c2410c] hover:to-[#7f1d1d] transition-all duration-300 shadow-[0_4px_14px_0_rgba(234,88,12,0.39)]`}>
                  Enter Temple
                </a>
              </motion.div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key="about" id="about" className={`py-24 lg:py-32 px-6 ${colors.lightCream} relative overflow-hidden`}>
            <BackgroundMandala />
            
            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className={`text-sm font-sans font-bold tracking-[0.2em] uppercase ${colors.saffron} mb-2 block`}>History & Heritage</span>
                <h2 className={`text-4xl md:text-5xl font-serif ${colors.crimson} mb-4`}>
                  {religiousData.about_title || 'About the Temple'}
                </h2>
                <OrnateDivider />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p className={`text-xl leading-loose ${colors.darkText} font-serif mb-12`}>
                  {religiousData.about_description || 'We are a community dedicated to faith, preserving ancient traditions and serving society.'}
                </p>
                
                {religiousData.vision_mission && (
                  <div className={`p-10 bg-white border-2 border-[#fef3c7] relative shadow-md`}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#ea580c] to-[#991b1b] rounded-full flex items-center justify-center shadow-lg border-[3px] border-white">
                      <Sun size={20} className="text-[#fef3c7]" />
                    </div>
                    <h3 className={`text-2xl font-serif ${colors.darkText} mb-4 mt-2`}>Vision & Mission</h3>
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
          <section key="leaders" id="leaders" className="py-24 lg:py-32 px-6 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMTBoMjB2MTBIMHoiIGZpbGw9IiNmZWZDYyNyIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.saffron} mb-2 block`}>Priests & Administration</span>
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.crimson}`}>Temple Leadership</h3>
                <OrnateDivider />
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {religiousData.leaders.map((leader: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col items-center group bg-[#fffbeb] p-8 border border-[#fbbf24] shadow-[0_4px_20px_-10px_rgba(234,88,12,0.2)] hover:shadow-[0_8px_30px_-10px_rgba(234,88,12,0.4)] transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#fef3c7] rounded-full blur-2xl opacity-60"></div>
                    
                    <div className="relative mb-6 w-40 h-40 border-[3px] border-[#ea580c] p-1 rounded-full group-hover:scale-105 transition-transform duration-500 bg-white">
                      <div className="w-full h-full overflow-hidden rounded-full border border-[#fbbf24]">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-[#fef3c7] flex items-center justify-center ${colors.mutedText}`}>
                            <User size={48} opacity={0.5} />
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className={`text-2xl font-serif font-bold ${colors.darkText} mb-1 text-center`}>{leader.name || 'Name'}</h4>
                    {leader.title && (
                      <p className={`text-base font-serif italic ${colors.crimson} mb-3 text-center`}>{leader.title}</p>
                    )}
                    {leader.role && (
                      <div className={`mt-2 px-6 py-1 bg-white border border-[#fbbf24] text-[#ea580c] text-xs font-sans font-bold uppercase tracking-widest`}>
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
          <section key="schedule" id="schedule" className={`py-24 lg:py-32 px-6 ${colors.lightCream} relative`}>
            <BackgroundMandala />
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.crimson}`}>Pooja Timings</h3>
                <OrnateDivider />
              </div>
              
              <div className="space-y-6">
                {(religiousData.schedule || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#fbbf24] shadow-sm hover:border-[#ea580c] transition-colors relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ea580c] to-[#991b1b]"></div>
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Sun size={24} className={colors.saffron} />
                      </div>
                      <div>
                        <h4 className={`text-2xl font-serif font-bold ${colors.darkText}`}>{item.name || 'Aarti / Pooja'}</h4>
                        {item.description && <p className={`text-[#78350f] font-serif mt-1`}>{item.description}</p>}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-6 py-3 bg-[#fffbeb] border border-[#fef3c7] shrink-0`}>
                      <Clock size={18} className={colors.crimson} />
                      <span className="font-serif font-bold text-[#451a03] text-lg tracking-wide">{item.time || '12:00 PM'}</span>
                    </div>
                  </motion.div>
                ))}
                {(!religiousData.schedule || religiousData.schedule.length === 0) && (
                  <p className="text-center text-[#78350f] font-serif italic">No schedule available.</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key="programs" id="programs" className="py-24 lg:py-32 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <span className={`font-serif tracking-[0.2em] uppercase text-sm font-bold ${colors.saffron} mb-2 block`}>Sevas & Activities</span>
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.crimson}`}>Temple Services</h3>
                <OrnateDivider />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(religiousData.programs || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-[#fffbeb] p-8 border-t-4 border-[#ea580c] shadow-md hover:shadow-lg transition-shadow flex flex-col h-full relative group"
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMTBoMjB2MTBIMHoiIGZpbGw9IiNmZWZDYyNyIvPjwvc3ZnPg==')] opacity-50"></div>
                    
                    <div className="mb-6 relative z-10">
                      <h4 className={`text-2xl font-serif font-bold ${colors.darkText} mb-3`}>{item.name || 'Service Name'}</h4>
                      {item.description && <p className={`text-[#78350f] font-serif leading-relaxed`}>{item.description}</p>}
                    </div>
                    
                    {item.timing && (
                      <div className="mt-auto pt-6 border-t border-[#fbbf24] relative z-10">
                        <div className="flex items-center gap-2 text-[#991b1b] font-serif font-bold">
                          <Calendar size={18} />
                          <span className="text-base tracking-wide">{item.timing}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!religiousData.programs || religiousData.programs.length === 0) && (
                  <div className="col-span-full text-center text-[#78350f] font-serif italic">No services listed.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        if (!religiousData.gallery || religiousData.gallery.length === 0) return null;
        return (
          <section key="gallery" id="gallery" className={`py-24 lg:py-32 px-6 ${colors.lightCream} relative border-y border-[#fbbf24]`}>
            <BackgroundMandala />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h3 className={`text-4xl md:text-5xl font-serif ${colors.crimson}`}>Temple Gallery</h3>
                <OrnateDivider />
              </div>
              
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {religiousData.gallery.map((url: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                    className="break-inside-avoid relative group border-4 border-white shadow-md hover:shadow-xl transition-all"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-auto" />
                    <div className="absolute inset-0 border-2 border-[#fbbf24] m-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" id="contact" className={`py-24 lg:py-32 px-6 bg-[#451a03] text-[#fffbeb] relative overflow-hidden`}>
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
               <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ea580c 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <span className={`text-sm font-sans font-bold tracking-[0.2em] uppercase text-[#fbbf24] mb-4 block`}>Get in Touch</span>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-white drop-shadow-md">Contact Us</h3>
                  
                  <div className="w-20 h-1 bg-gradient-to-r from-[#ea580c] to-[#fbbf24] mb-12"></div>
                  
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className="mt-1 w-12 h-12 bg-white/10 border border-[#fbbf24]/30 flex items-center justify-center group-hover:bg-[#ea580c]/20 transition-colors">
                        <MapPin size={24} className="text-[#fbbf24]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold mb-2 tracking-wide text-white">Temple Location</h4>
                        <p className="text-[#fef3c7] font-serif leading-relaxed text-lg max-w-sm">
                          {content.contact_info?.address || '123 Sacred Lane, City, Country'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="mt-1 w-12 h-12 bg-white/10 border border-[#fbbf24]/30 flex items-center justify-center group-hover:bg-[#ea580c]/20 transition-colors">
                        <Phone size={24} className="text-[#fbbf24]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold mb-2 tracking-wide text-white">Contact Phone</h4>
                        <p className="text-[#fef3c7] font-serif text-lg">
                          {religiousData.contactNumbers || '+1 234 567 890'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 bg-gradient-to-br from-[#ea580c] to-[#991b1b] shadow-2xl">
                  <div className="aspect-square md:aspect-[4/3] w-full bg-[#fef3c7] flex items-center justify-center relative border-4 border-[#451a03]">
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
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#451a03]`}
          >
            <div className="absolute inset-0 opacity-10">
               <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ea580c 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>
            <div className="relative flex flex-col items-center z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-8 relative w-32 h-32 flex items-center justify-center"
              >
                {/* Traditional rotating geometric/mandala loader */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[6px] border-dotted border-[#ea580c] rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-[4px] border-dashed border-[#fbbf24] rounded-full"
                ></motion.div>
                <Sun size={40} className="text-[#fef3c7] drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm font-sans font-bold text-[#fef3c7] tracking-[0.4em] uppercase`}
              >
                Loading
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`font-sans antialiased text-[#451a03] selection:bg-[#ea580c] selection:text-white overflow-x-hidden min-h-screen bg-[#fffbeb]`}>
        {renderOrder.map(renderSection)}
      </div>
    </>
  );
}
