import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CalendarDays, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export interface HousewarmingLayoutProps {
  content: any;
}

export function ModernElegantLayout({ content }: HousewarmingLayoutProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOpening, setShowOpening] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const housewarmingData = content?.settings_json?.housewarming || {};
  const musicUrl = housewarmingData.musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const sections = housewarmingData.sections || [];

  const getOrderedSections = () => {
    return sections.filter((s: any) => s.visible !== false);
  };

  const navItems = getOrderedSections().map((s: any) => ({
    id: s.id,
    label: s.label
  }));

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      
      const sectionElements = navItems.map((item: any) => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i];
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= windowHeight * 0.4) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const parseDateTime = () => {
    try {
      if (!content?.date) return { month: 'OCTOBER', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
      const d = new Date(content.date);
      return {
        month: d.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
        day: d.getDate().toString().padStart(2, '0'),
        year: d.getFullYear().toString(),
        weekday: d.toLocaleString('en-US', { weekday: 'long' }),
        time: housewarmingData.time || '9:00 AM'
      };
    } catch {
      return { month: 'OCTOBER', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
    }
  };
  const dateInfo = parseDateTime();

  const handleOpen = () => {
    setShowOpening(false);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
  };

  // Color Palette Constants - Luxury Emerald & Gold
  const colors = {
    bgMain: 'bg-[#06291C]', // Deep Emerald/Forest Green
    bgAlt: 'bg-[#051F14]', // Darker shade for contrast
    textMain: 'text-[#F5F5F0]', // Soft off-white
    textMuted: 'text-[#9CA3AF]', // Muted grey
    accent: 'text-[#D4AF37]', // Gold Foil
    border: 'border-[#D4AF37]/30', // Subtle gold borders
    borderSolid: 'border-[#D4AF37]'
  };

  return (
    <div className={`font-sans ${colors.bgMain} ${colors.textMain} min-h-screen selection:bg-[#D4AF37] selection:text-[#06291C] ${showOpening ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control */}
      {musicUrl && !showOpening && (
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
              setIsMuted(!isMuted);
            }
          }}
          className={`fixed bottom-8 left-8 z-50 p-4 rounded-full bg-white/5 backdrop-blur-xl shadow-2xl border ${colors.border} hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group`}
        >
          {isMuted ? <VolumeX size={16} className={colors.accent} /> : <Volume2 size={16} className={colors.accent} />}
          <span className={`text-[10px] uppercase tracking-[0.3em] font-medium hidden md:block opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden whitespace-nowrap`}>
            {isMuted ? 'Unmute' : 'Mute'} Sound
          </span>
        </button>
      )}

      {/* Dramatic Opening Sequence */}
      <AnimatePresence>
        {showOpening && (
          <motion.div
            key="opening"
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer ${colors.bgMain}`}
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)', transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } }}
          >
            {/* Ambient luxury glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] max-w-[800px] max-h-[800px] bg-[#D4AF37] opacity-[0.05] blur-[150px] pointer-events-none rounded-full"></div>
            
            <div className="text-center z-10 w-full px-6 flex flex-col items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className={`text-[10px] uppercase ${colors.accent} mb-8 font-medium`}
              >
                You are Cordially Invited
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-tight text-[#D4AF37] mb-2 leading-tight break-words hyphens-auto max-w-4xl mx-auto">
                  {content?.hero_title || 'A New Chapter'}
                </h1>
                <p className="text-3xl md:text-5xl font-light tracking-widest uppercase mt-4">
                  Begins
                </p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                className={`w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-12`}
              />

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className={`text-[10px] uppercase tracking-[0.4em] border border-[#D4AF37]/50 px-8 py-3 hover:bg-[#D4AF37] hover:text-[#06291C] transition-all duration-500`}
              >
                Enter Invitation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${colors.bgAlt}/90 backdrop-blur-xl border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollTo('hero')}>
              <span className={`text-xl md:text-2xl font-serif italic ${colors.accent}`}>{housewarmingData.hostName || 'Housewarming'}</span>
            </div>
            
            <div className="hidden md:flex space-x-10">
              {navItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 relative ${
                    activeSection === item.id 
                      ? colors.accent 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div layoutId="navIndicatorElegant" className="absolute -bottom-3 left-0 right-0 h-[1px] bg-[#D4AF37]" />
                  )}
                </button>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none p-2 text-white">
                <div className="flex flex-col gap-[6px] justify-center w-6 h-6">
                  <span className={`block h-[1px] w-full bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                  <span className={`block h-[1px] w-full bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-[1px] w-full bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${colors.bgAlt} border-b ${colors.border}`}
            >
              <div className="px-6 py-8 space-y-8 flex flex-col items-center">
                {navItems.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`block w-full text-center text-[10px] uppercase tracking-[0.4em] font-medium ${
                      activeSection === item.id ? colors.accent : 'text-white/60'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-24">
        {getOrderedSections().map((section: any, index: number) => {
          switch (section.id) {
            case 'hero':
              return (
                <section key="hero" id="hero" className={`relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 ${colors.bgMain}`}>
                  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-12 md:mt-0">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="lg:col-span-7 flex flex-col items-start"
                    >
                      <div className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-8 flex items-center gap-4`}>
                        <div className="w-8 h-[1px] bg-[#D4AF37]"></div>
                        {housewarmingData.tagline || 'Housewarming Celebration'}
                      </div>
                      
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-tight mb-8">
                        The Start of <br/>
                        <span className={`font-serif italic ${colors.accent}`}>Something Beautiful.</span>
                      </h1>
                      
                      <p className={`text-lg md:text-xl font-light leading-relaxed text-white/70 max-w-lg mb-12`}>
                        Join us as we open the doors to our new home and celebrate this milestone with those who mean the most.
                      </p>
                      
                      <div className="flex items-center gap-12">
                        <div className="flex flex-col">
                          <span className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent} mb-2`}>Date</span>
                          <span className="text-xl font-light">{dateInfo.day} {dateInfo.month}</span>
                          <span className={`text-xs text-white/50 mt-1`}>{dateInfo.year}</span>
                        </div>
                        <div className="w-[1px] h-12 bg-white/20"></div>
                        <div className="flex flex-col">
                          <span className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent} mb-2`}>Time</span>
                          <span className="text-xl font-light">{dateInfo.time}</span>
                          <span className={`text-xs text-white/50 mt-1`}>{dateInfo.weekday}</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className="lg:col-span-5 h-[60vh] w-full relative hidden lg:block"
                    >
                      <div className={`absolute -inset-4 border border-[#D4AF37]/30 z-0`}></div>
                      <div className={`w-full h-full bg-[#051F14] relative z-10 overflow-hidden flex items-center justify-center`}>
                        {housewarmingData.venuePhoto ? (
                          <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover opacity-80" />
                        ) : (
                          <div className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent}`}>Featured Image</div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'hosts':
              return (
                <section key="hosts" id="hosts" className={`py-32 px-6 lg:px-12 ${colors.bgAlt} flex items-center justify-center`}>
                  <div className="max-w-5xl mx-auto w-full text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-[1px] h-16 bg-[#D4AF37]/50 mb-8"></div>
                      <h3 className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-12`}>The Hosts</h3>
                      
                      {housewarmingData.hostPhoto && (
                        <div className="mb-12 relative inline-block">
                          <div className="absolute inset-[-15px] border border-[#D4AF37]/30 rounded-full"></div>
                          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden relative z-10 border border-[#D4AF37]/50">
                            <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                      
                      <h2 className={`text-4xl md:text-6xl font-serif italic ${colors.accent} mb-8`}>{housewarmingData.hostName}</h2>
                      <p className={`text-base md:text-lg leading-loose font-light text-white/70 max-w-2xl mx-auto`}>
                        We are thrilled to invite you to celebrate our new beginning. Your blessings and presence will make our house a home.
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'story':
              return (
                <section key="story" id="story" className={`py-40 px-6 lg:px-12 ${colors.bgMain} border-t ${colors.border}`}>
                  <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <div className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-12`}>
                        {content?.about_title || 'Our Story'}
                      </div>
                      <p className={`text-3xl md:text-5xl font-light leading-[1.4] tracking-tight ${colors.textMain}`}>
                        "{content?.about_text}"
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'schedule':
              return (
                <section key="schedule" id="schedule" className={`py-32 px-6 lg:px-12 ${colors.bgAlt}`}>
                  <div className="max-w-6xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="mb-24 flex flex-col md:flex-row items-end justify-between border-b border-[#D4AF37]/20 pb-8 gap-8"
                    >
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#D4AF37]">The Itinerary</h3>
                      <p className={`text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2`}>Events of the day</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                      {(housewarmingData.schedule || []).map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="group border-b border-white/10 pb-8 flex justify-between items-start"
                        >
                          <div>
                            <div className={`text-[10px] font-medium uppercase tracking-[0.3em] ${colors.accent} mb-4`}>
                              {item.time}
                            </div>
                            <h4 className="text-2xl md:text-3xl font-light text-white mb-2">{item.event}</h4>
                          </div>
                          <div className={`text-[9px] uppercase tracking-widest text-white/40 mt-1`}>
                            {item.date}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'venue':
              return (
                <section key="venue" id="venue" className={`py-32 px-6 lg:px-12 ${colors.bgMain}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="order-2 lg:order-1"
                      >
                        <h3 className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-6`}>Location</h3>
                        <h2 className="text-5xl md:text-7xl font-serif italic mb-12 text-[#D4AF37]">The Venue</h2>
                        
                        <div className="space-y-12">
                          <p className={`text-xl md:text-2xl font-light leading-relaxed text-white/80`}>
                            {content?.contact_info?.address || housewarmingData.venue}
                          </p>
                          
                          <a 
                            href={housewarmingData.mapUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`inline-flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] border-b border-[#D4AF37] pb-2 text-[#D4AF37] hover:text-white hover:border-white transition-all duration-300`}
                          >
                            Get Directions
                            <ArrowRight size={14} />
                          </a>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="order-1 lg:order-2 w-full aspect-[4/5] p-6 border border-[#D4AF37]/30"
                      >
                        {housewarmingData.venuePhoto ? (
                          <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full ${colors.bgAlt} flex items-center justify-center`}>
                            <span className={`text-[10px] uppercase tracking-[0.3em] ${colors.accent}`}>Venue Photograph</span>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </section>
              );

            case 'gallery':
              const gallery = housewarmingData.gallery || [];
              if (gallery.length === 0) return null;
              return (
                <section key="gallery" id="gallery" className={`py-32 px-6 lg:px-12 ${colors.bgAlt}`}>
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="text-center mb-20"
                    >
                      <h3 className="text-5xl md:text-6xl font-serif italic text-[#D4AF37] mb-8">Gallery</h3>
                      <div className="w-[1px] h-16 bg-[#D4AF37]/50 mx-auto"></div>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gallery.map((url: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`relative aspect-square border border-[#D4AF37]/20 p-2 overflow-hidden group`}
                        >
                          <div className="absolute inset-2 bg-[#06291C]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none mix-blend-multiply"></div>
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'rsvp':
              return (
                <section key="rsvp" id="rsvp" className={`py-40 px-6 lg:px-12 ${colors.bgMain} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] bg-[#D4AF37] opacity-[0.03] blur-[100px] pointer-events-none"></div>
                  
                  <div className="max-w-3xl mx-auto relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <div className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-8`}>RSVP</div>
                      <h3 className="text-6xl md:text-8xl font-serif italic text-white mb-12">Join Us</h3>
                      <p className={`text-lg md:text-xl font-light text-white/70 mb-16 leading-relaxed`}>
                        Kindly let us know if you can make it. We look forward to celebrating this special milestone with you.
                      </p>
                      
                      <div className="inline-flex items-center gap-6 border border-[#D4AF37]/40 px-12 py-6 bg-white/[0.02] backdrop-blur-md">
                        <Phone size={24} className={colors.accent} strokeWidth={1.5} />
                        <span className="text-3xl md:text-4xl font-light tracking-wide text-white">
                          {housewarmingData.contactNumbers || content?.contact_info?.phone}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );
            default: return null;
          }
        })}
      </main>

      {/* Luxury Footer */}
      <footer className={`${colors.bgMain} py-16 px-6 flex flex-col items-center border-t border-[#D4AF37]/20`}>
        <div className={`text-[9px] uppercase tracking-[0.5em] text-[#D4AF37]/70`}>
          Curated by Jaalam
        </div>
      </footer>
    </div>
  );
}
