import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CalendarDays, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export interface HousewarmingLayoutProps {
  content: any;
}

export function ModernFloralLayout({ content }: HousewarmingLayoutProps) {
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
      if (!content?.date) return { month: 'OCT', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
      const d = new Date(content.date);
      return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate().toString().padStart(2, '0'),
        year: d.getFullYear().toString(),
        weekday: d.toLocaleString('en-US', { weekday: 'long' }),
        time: housewarmingData.time || '9:00 AM'
      };
    } catch {
      return { month: 'OCT', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
    }
  };
  const dateInfo = parseDateTime();

  const handleOpen = () => {
    setShowOpening(false);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
  };

  // Color Palette Constants - Moody Floral & Rose Gold
  const colors = {
    textMain: 'text-[#F5F2F0]', // Soft off-white
    accent: 'text-[#E0A96D]', // Rose Gold/Blush Gold
    accentBg: 'bg-[#E0A96D]', 
    accentBorder: 'border-[#E0A96D]',
    glassBg: 'bg-black/30 backdrop-blur-xl',
    glassBorder: 'border border-white/10'
  };

  const floralBg = "https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2000&auto=format&fit=crop"; 
  // moody dark floral background image placeholder

  return (
    <div className={`font-sans bg-[#1A1A1A] ${colors.textMain} min-h-screen selection:bg-[#E0A96D] selection:text-black ${showOpening ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {/* Global Floral Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
        style={{ backgroundImage: `url(${floralBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
      </div>

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
          className={`fixed bottom-8 left-8 z-50 p-4 rounded-full ${colors.glassBg} ${colors.glassBorder} shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group`}
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
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer`}
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)', transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
            
            <div className="text-center z-10 w-full px-6 flex flex-col items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className={`text-[10px] uppercase ${colors.accent} mb-12 font-medium tracking-widest`}
              >
                You are Cordially Invited
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                className="mb-12 relative"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-tight text-white mb-2 leading-tight">
                  {content?.hero_title || 'A New Chapter'}
                </h1>
                <p className={`text-3xl md:text-5xl font-light tracking-widest uppercase ${colors.accent}`}>
                  Begins
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className={`text-[10px] uppercase tracking-[0.4em] ${colors.glassBg} ${colors.glassBorder} px-10 py-4 hover:bg-white hover:text-black transition-all duration-500`}
              >
                Enter Invitation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${colors.glassBg} ${colors.glassBorder} border-t-0 border-x-0`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollTo('hero')}>
              <span className={`text-xl md:text-2xl font-serif italic ${colors.accent}`}>{housewarmingData.hostName || 'Housewarming'}</span>
            </div>
            
            <div className="hidden md:flex space-x-8 lg:space-x-12">
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
                    <motion.div layoutId="navIndicatorFloral" className={`absolute -bottom-4 left-0 right-0 h-[1px] ${colors.accentBg}`} />
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
              className={`md:hidden ${colors.glassBg} ${colors.glassBorder} border-x-0 border-t-0`}
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

      <main className="pt-24 relative z-10">
        {getOrderedSections().map((section: any, index: number) => {
          switch (section.id) {
            case 'hero':
              return (
                <section key="hero" id="hero" className={`relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 py-20`}>
                  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`lg:col-span-7 flex flex-col items-start ${colors.glassBg} ${colors.glassBorder} p-8 md:p-12 lg:p-16 rounded-sm backdrop-blur-2xl`}
                    >
                      <div className={`text-[9px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-8 flex items-center gap-4`}>
                        <div className={`w-8 h-[1px] ${colors.accentBg}`}></div>
                        {housewarmingData.tagline || 'Housewarming Celebration'}
                      </div>
                      
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[1.1] mb-8">
                        The Start of <br/>
                        <span className={`font-serif italic ${colors.accent}`}>Our New Chapter.</span>
                      </h1>
                      
                      <p className={`text-base md:text-lg font-light leading-relaxed text-white/80 max-w-lg mb-12`}>
                        Join us as we open the doors to our new home and celebrate this milestone with those who mean the most.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-10 md:gap-16 border-t border-white/10 pt-8 w-full">
                        <div className="flex flex-col">
                          <span className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent} mb-2`}>Date</span>
                          <span className="text-xl md:text-2xl font-light">{dateInfo.day} {dateInfo.month}</span>
                          <span className={`text-[10px] uppercase tracking-widest text-white/50 mt-1`}>{dateInfo.year}</span>
                        </div>
                        <div className="hidden sm:block w-[1px] h-12 bg-white/10"></div>
                        <div className="flex flex-col">
                          <span className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent} mb-2`}>Time</span>
                          <span className="text-xl md:text-2xl font-light">{dateInfo.time}</span>
                          <span className={`text-[10px] uppercase tracking-widest text-white/50 mt-1`}>{dateInfo.weekday}</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className="lg:col-span-5 h-[50vh] lg:h-[70vh] w-full relative group"
                    >
                      <div className={`absolute -inset-4 ${colors.glassBorder} z-0 translate-x-4 translate-y-4`}></div>
                      <div className={`w-full h-full relative z-10 overflow-hidden bg-black/40`}>
                        {housewarmingData.venuePhoto ? (
                          <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center ${colors.glassBg}`}>
                            <span className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent}`}>Featured Image</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'hosts':
              return (
                <section key="hosts" id="hosts" className={`py-32 px-6 lg:px-12 flex items-center justify-center relative`}>
                  <div className="max-w-4xl mx-auto w-full text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className={`flex flex-col items-center ${colors.glassBg} ${colors.glassBorder} p-12 md:p-20 backdrop-blur-2xl rounded-sm`}
                    >
                      <h3 className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-12`}>The Hosts</h3>
                      
                      {housewarmingData.hostPhoto && (
                        <div className="mb-12 relative inline-block">
                          <div className={`w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden relative z-10 ${colors.glassBorder} p-2`}>
                            <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover rounded-full" />
                          </div>
                        </div>
                      )}
                      
                      <h2 className={`text-4xl md:text-5xl font-serif italic text-white mb-8`}>{housewarmingData.hostName}</h2>
                      <p className={`text-base md:text-lg leading-loose font-light text-white/70 max-w-2xl mx-auto`}>
                        We are thrilled to invite you to celebrate our new beginning. Your blessings and presence will make our house a home.
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'story':
              return (
                <section key="story" id="story" className={`py-40 px-6 lg:px-12`}>
                  <div className="max-w-5xl mx-auto text-center relative">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className={`${colors.glassBg} ${colors.glassBorder} p-12 md:p-24 backdrop-blur-3xl rounded-sm`}
                    >
                      <div className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-12`}>
                        {content?.about_title || 'Our Story'}
                      </div>
                      <p className={`text-2xl md:text-4xl lg:text-5xl font-light leading-[1.5] tracking-tight text-white/90`}>
                        "{content?.about_text}"
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'schedule':
              return (
                <section key="schedule" id="schedule" className={`py-32 px-6 lg:px-12`}>
                  <div className={`max-w-6xl mx-auto ${colors.glassBg} ${colors.glassBorder} p-8 md:p-16 lg:p-24 rounded-sm backdrop-blur-2xl`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="mb-20 flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-8 gap-8"
                    >
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white">The Itinerary</h3>
                      <p className={`text-[10px] uppercase tracking-[0.3em] ${colors.accent} mb-2`}>Events of the day</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                      {(housewarmingData.schedule || []).map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="group border-b border-white/5 pb-8 flex justify-between items-start"
                        >
                          <div>
                            <div className={`text-[9px] font-medium uppercase tracking-[0.3em] ${colors.accent} mb-4`}>
                              {item.time}
                            </div>
                            <h4 className="text-xl md:text-2xl font-light text-white mb-2">{item.event}</h4>
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
                <section key="venue" id="venue" className={`py-32 px-6 lg:px-12`}>
                  <div className={`max-w-7xl mx-auto ${colors.glassBg} ${colors.glassBorder} p-8 md:p-16 rounded-sm backdrop-blur-2xl`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="order-2 lg:order-1"
                      >
                        <h3 className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-6`}>Location</h3>
                        <h2 className="text-5xl md:text-6xl font-serif italic mb-12 text-white">The Venue</h2>
                        
                        <div className="space-y-12">
                          <p className={`text-lg md:text-xl font-light leading-relaxed text-white/80`}>
                            {content?.contact_info?.address || housewarmingData.venue}
                          </p>
                          
                          <a 
                            href={housewarmingData.mapUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`inline-flex items-center gap-4 text-[9px] font-medium uppercase tracking-[0.3em] border-b ${colors.accentBorder} pb-2 ${colors.accent} hover:text-white hover:border-white transition-all duration-300`}
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
                        className="order-1 lg:order-2 w-full aspect-square md:aspect-[4/5] p-2 border border-white/10 bg-black/20"
                      >
                        {housewarmingData.venuePhoto ? (
                          <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale-[20%]" />
                        ) : (
                          <div className={`w-full h-full bg-black/40 flex items-center justify-center`}>
                            <span className={`text-[9px] uppercase tracking-[0.3em] ${colors.accent}`}>Venue Photograph</span>
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
                <section key="gallery" id="gallery" className={`py-32 px-6 lg:px-12`}>
                  <div className={`max-w-7xl mx-auto ${colors.glassBg} ${colors.glassBorder} p-8 md:p-16 rounded-sm backdrop-blur-2xl`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="text-center mb-16"
                    >
                      <h3 className="text-4xl md:text-5xl font-serif italic text-white mb-6">Gallery</h3>
                      <div className={`w-12 h-[1px] ${colors.accentBg} mx-auto`}></div>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gallery.map((url: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`relative aspect-square border border-white/10 p-2 overflow-hidden group bg-black/20`}
                        >
                          <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'rsvp':
              return (
                <section key="rsvp" id="rsvp" className={`py-40 px-6 lg:px-12 flex flex-col items-center justify-center text-center relative`}>
                  <div className="max-w-3xl mx-auto relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className={`${colors.glassBg} ${colors.glassBorder} p-12 md:p-24 rounded-sm backdrop-blur-2xl`}
                    >
                      <div className={`text-[10px] font-medium uppercase tracking-[0.4em] ${colors.accent} mb-8`}>RSVP</div>
                      <h3 className="text-5xl md:text-7xl font-serif italic text-white mb-10">Join Us</h3>
                      <p className={`text-base md:text-lg font-light text-white/70 mb-12 leading-relaxed max-w-xl mx-auto`}>
                        Kindly let us know if you can make it. We look forward to celebrating this special milestone with you.
                      </p>
                      
                      <div className={`inline-flex items-center gap-6 border border-white/20 px-10 py-5 bg-black/20 hover:bg-white/5 transition-colors`}>
                        <Phone size={20} className={colors.accent} strokeWidth={1.5} />
                        <span className="text-2xl md:text-3xl font-light tracking-wide text-white">
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
      <footer className={`py-12 px-6 flex flex-col items-center ${colors.glassBg} ${colors.glassBorder} border-x-0 border-b-0 backdrop-blur-xl relative z-10`}>
        <div className={`text-[9px] uppercase tracking-[0.5em] text-white/40`}>
          Curated by Jaalam
        </div>
      </footer>
    </div>
  );
}
