import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CalendarDays, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export interface HousewarmingLayoutProps {
  content: any;
}

export function ModernClassicLayout({ content }: HousewarmingLayoutProps) {
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
      if (!content?.date) return { month: 'October', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
      const d = new Date(content.date);
      return {
        month: d.toLocaleString('en-US', { month: 'long' }),
        day: d.getDate().toString(),
        year: d.getFullYear().toString(),
        weekday: d.toLocaleString('en-US', { weekday: 'long' }),
        time: housewarmingData.time || '9:00 AM'
      };
    } catch {
      return { month: 'October', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
    }
  };
  const dateInfo = parseDateTime();

  const handleOpen = () => {
    setShowOpening(false);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
  };

  // Color Palette Constants - Classic Elegance
  const colors = {
    bgMain: 'bg-[#F9F7F1]', // Soft Cream
    bgAlt: 'bg-[#F2EFE8]', // Slightly darker beige
    textMain: 'text-[#3E3A35]', // Deep charcoal/brown
    textMuted: 'text-[#7D766D]', // Muted warm grey
    accent: 'text-[#B89B72]', // Soft Gold/Brass
    border: 'border-[#E5DFD3]',
    borderDark: 'border-[#D1C9BA]'
  };

  return (
    <div className={`font-serif ${colors.bgMain} ${colors.textMain} min-h-screen selection:bg-[#B89B72] selection:text-white ${showOpening ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control Button */}
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
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg border ${colors.borderDark} hover:scale-105 active:scale-95 transition-all`}
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={18} className={colors.textMain} /> : <Volume2 size={18} className={colors.textMain} />}
        </button>
      )}

      {/* Elegant Envelope/Card Opening */}
      <AnimatePresence>
        {showOpening && (
          <motion.div
            key="opening"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer bg-[#3E3A35]/40 backdrop-blur-sm"
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`relative bg-[#F9F7F1] w-full max-w-lg mx-4 rounded-sm shadow-2xl flex flex-col items-center justify-center py-20 px-8 md:px-12 border ${colors.borderDark}`}
            >
              {/* Inner Decorative Border */}
              <div className="absolute inset-4 border border-[#B89B72]/40 pointer-events-none"></div>
              <div className="absolute inset-5 border border-[#B89B72]/20 pointer-events-none"></div>
              
              <div className="z-10 text-center w-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className={`text-xs uppercase tracking-[0.3em] ${colors.textMuted} mb-6`}
                >
                  You are invited to
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 text-[#3E3A35] leading-tight break-words hyphens-auto"
                >
                  {content?.hero_title || 'Our Housewarming'}
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="w-16 h-[1px] bg-[#B89B72] mx-auto mb-8"
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className={`italic font-serif text-lg md:text-xl ${colors.textMain} mb-12`}
                >
                  {housewarmingData.hostName}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, 5, 0] }}
                  transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`text-[10px] uppercase tracking-[0.2em] font-sans ${colors.accent}`}
                >
                  Tap to Open
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classic Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#F9F7F1]/95 backdrop-blur-md border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollTo('hero')}>
              <span className="text-xl md:text-2xl font-serif tracking-widest">{housewarmingData.hostName || 'Housewarming'}</span>
            </div>
            
            <div className="hidden md:flex space-x-12">
              {navItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-[10px] uppercase tracking-[0.2em] font-sans transition-colors duration-300 relative ${
                    activeSection === item.id 
                      ? colors.textMain 
                      : colors.textMuted + ` hover:${colors.textMain}`
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div layoutId="navIndicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B89B72]" />
                  )}
                </button>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none p-2">
                <div className="flex flex-col gap-[5px] justify-center w-6 h-6">
                  <span className={`block h-[1px] w-full bg-[#3E3A35] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
                  <span className={`block h-[1px] w-full bg-[#3E3A35] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-[1px] w-full bg-[#3E3A35] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></span>
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
              className={`md:hidden ${colors.bgMain} border-b ${colors.border}`}
            >
              <div className="px-6 py-6 space-y-6 flex flex-col items-center">
                {navItems.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`block w-full text-center text-[10px] uppercase tracking-[0.3em] font-sans ${
                      activeSection === item.id ? colors.textMain : colors.textMuted
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

      <main className="pt-20">
        {getOrderedSections().map((section: any, index: number) => {
          switch (section.id) {
            case 'hero':
              return (
                <section key="hero" id="hero" className={`relative min-h-[90vh] flex flex-col items-center justify-center p-6 lg:p-12 ${colors.bgMain}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto text-center relative z-10 w-full"
                  >
                    <div className="flex flex-col items-center justify-center p-12 md:p-24 border border-[#D1C9BA]/60 bg-white/40">
                      <h2 className={`text-[10px] md:text-xs font-sans uppercase tracking-[0.4em] ${colors.accent} mb-12`}>
                        {housewarmingData.tagline || 'Please join us'}
                      </h2>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[1.1] mb-12 text-[#3E3A35]">
                        {content?.hero_title || 'A New Chapter Begins'}
                      </h1>
                      
                      <div className="flex items-center gap-6 mb-12">
                        <div className="w-12 h-[1px] bg-[#B89B72]/50"></div>
                        <div className="w-2 h-2 rounded-full bg-[#B89B72]/50"></div>
                        <div className="w-12 h-[1px] bg-[#B89B72]/50"></div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <div className="text-center">
                          <p className={`text-[10px] font-sans uppercase tracking-[0.2em] ${colors.textMuted} mb-2`}>{dateInfo.weekday}</p>
                          <p className="text-xl md:text-2xl font-serif">{dateInfo.month} {dateInfo.day}</p>
                          <p className={`text-sm italic ${colors.textMuted}`}>{dateInfo.year}</p>
                        </div>
                        <div className="hidden md:block w-[1px] h-16 bg-[#D1C9BA]"></div>
                        <div className="md:hidden h-[1px] w-16 bg-[#D1C9BA]"></div>
                        <div className="text-center">
                          <p className={`text-[10px] font-sans uppercase tracking-[0.2em] ${colors.textMuted} mb-2`}>Time</p>
                          <p className="text-xl md:text-2xl font-serif">{dateInfo.time}</p>
                          <p className={`text-sm italic ${colors.textMuted}`}>Onwards</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </section>
              );

            case 'hosts':
              return (
                <section key="hosts" id="hosts" className={`py-32 px-6 lg:px-12 ${colors.bgAlt} flex items-center justify-center`}>
                  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="order-2 md:order-1 text-center md:text-left"
                    >
                      <h3 className={`text-[10px] font-sans uppercase tracking-[0.3em] ${colors.accent} mb-6`}>Hosted By</h3>
                      <h2 className="text-4xl md:text-5xl font-serif mb-8 text-[#3E3A35]">{housewarmingData.hostName}</h2>
                      <p className={`text-base md:text-lg leading-relaxed font-serif italic ${colors.textMuted}`}>
                        We are thrilled to invite you to celebrate our new beginning. Your blessings and presence will make our house a home.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="order-1 md:order-2 flex justify-center"
                    >
                      <div className="relative p-4 border border-[#D1C9BA]">
                        <div className="absolute inset-1 border border-[#D1C9BA]/50 pointer-events-none"></div>
                        {housewarmingData.hostPhoto ? (
                          <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-64 h-80 object-cover object-center grayscale-[20%]" />
                        ) : (
                          <div className={`w-64 h-80 ${colors.bgMain} flex items-center justify-center`}>
                            <span className={`text-[10px] font-sans tracking-[0.2em] uppercase ${colors.textMuted}`}>Portrait</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'story':
              return (
                <section key="story" id="story" className={`py-40 px-6 lg:px-12 ${colors.bgMain} flex items-center justify-center text-center`}>
                  <div className="max-w-3xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <h3 className={`text-[10px] font-sans uppercase tracking-[0.3em] ${colors.accent} mb-8`}>
                        {content?.about_title || 'Our Story'}
                      </h3>
                      <p className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-relaxed text-[#3E3A35]">
                        "{content?.about_text}"
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'schedule':
              return (
                <section key="schedule" id="schedule" className={`py-32 px-6 lg:px-12 ${colors.bgAlt}`}>
                  <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="mb-20"
                    >
                      <h3 className="text-4xl md:text-5xl font-serif text-[#3E3A35] mb-4">Itinerary</h3>
                      <div className="w-12 h-[1px] bg-[#B89B72] mx-auto"></div>
                    </motion.div>
                    
                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[#D1C9BA] before:to-transparent">
                      {(housewarmingData.schedule || []).map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                        >
                          <div className="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-3 h-3 rounded-full bg-[#B89B72] border-4 border-[#F2EFE8]"></div>
                          
                          <div className="w-full ml-12 md:ml-0 md:w-5/12 text-left md:odd:text-right md:even:text-left py-2">
                            <h4 className="text-xl md:text-2xl font-serif text-[#3E3A35] mb-2">{item.event}</h4>
                            <div className={`flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] ${colors.textMuted} md:odd:justify-end md:even:justify-start`}>
                              <CalendarDays size={12} />
                              <span>{item.date}</span>
                              <span className="px-2">•</span>
                              <span>{item.time}</span>
                            </div>
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
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-center md:text-left"
                      >
                        <h3 className={`text-[10px] font-sans uppercase tracking-[0.3em] ${colors.accent} mb-6`}>Location</h3>
                        <h2 className="text-4xl md:text-5xl font-serif mb-12 text-[#3E3A35]">The Venue</h2>
                        
                        <div className="space-y-10">
                          <p className={`text-lg md:text-xl font-serif leading-relaxed ${colors.textMain}`}>
                            {content?.contact_info?.address || housewarmingData.venue}
                          </p>
                          
                          <a 
                            href={housewarmingData.mapUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`inline-flex items-center gap-3 px-8 py-4 border border-[#3E3A35] text-[10px] font-sans uppercase tracking-[0.2em] text-[#3E3A35] hover:bg-[#3E3A35] hover:text-[#F9F7F1] transition-all duration-500`}
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
                        className="w-full aspect-[4/3] p-4 border border-[#D1C9BA]"
                      >
                        {housewarmingData.venuePhoto ? (
                          <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full ${colors.bgAlt} flex items-center justify-center`}>
                            <span className={`text-[10px] font-sans tracking-[0.2em] uppercase ${colors.textMuted}`}>Venue Photograph</span>
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
                      <h3 className="text-4xl md:text-5xl font-serif text-[#3E3A35] mb-4">Gallery</h3>
                      <div className="w-12 h-[1px] bg-[#B89B72] mx-auto"></div>
                    </motion.div>
                    
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {gallery.map((url: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`break-inside-avoid relative p-2 border border-[#D1C9BA] bg-[#F9F7F1]`}
                        >
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-auto object-cover" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'rsvp':
              return (
                <section key="rsvp" id="rsvp" className={`py-40 px-6 lg:px-12 ${colors.bgMain} flex flex-col items-center justify-center text-center`}>
                  <div className="max-w-2xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <h3 className="text-5xl md:text-6xl font-serif text-[#3E3A35] mb-8">RSVP</h3>
                      <p className={`text-base md:text-lg font-serif italic ${colors.textMuted} mb-12`}>
                        Kindly respond to let us know if you will be joining us. We look forward to celebrating together.
                      </p>
                      
                      <div className="inline-flex flex-col items-center">
                        <div className={`text-[10px] font-sans uppercase tracking-[0.3em] ${colors.accent} mb-4`}>Contact Us</div>
                        <div className="flex items-center gap-4 text-[#3E3A35]">
                          <Phone size={20} strokeWidth={1.5} />
                          <span className="text-2xl md:text-3xl font-serif tracking-wide">
                            {housewarmingData.contactNumbers || content?.contact_info?.phone}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );
            default: return null;
          }
        })}
      </main>

      {/* Elegant Footer */}
      <footer className={`${colors.bgMain} py-12 px-6 flex flex-col items-center border-t ${colors.border}`}>
        <div className="w-12 h-[1px] bg-[#D1C9BA] mb-8"></div>
        <div className={`text-[9px] font-sans uppercase tracking-[0.3em] ${colors.textMuted}`}>
          Crafted with Jaalam
        </div>
      </footer>
    </div>
  );
}
