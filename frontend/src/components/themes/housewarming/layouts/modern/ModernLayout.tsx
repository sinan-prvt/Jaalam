import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CalendarDays, Home, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export interface HousewarmingLayoutProps {
  content: any;
}

export function ModernLayout({ content }: HousewarmingLayoutProps) {
  const [showOpening, setShowOpening] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const housewarmingData = content?.settings_json?.housewarming || {};
  const musicUrl = housewarmingData.musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const sections = housewarmingData.sections || [];

  const getOrderedSections = () => {
    return sections.filter((s: any) => s.visible !== false);
  };

  const parseDateTime = () => {
    try {
      if (!content?.date) return { month: 'Oct', day: '25', year: '2026', weekday: 'Sunday', time: '9:00 AM' };
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

  // Color Palette Constants
  const colors = {
    bgMain: 'bg-[#0F1012]',
    bgAlt: 'bg-[#18191B]',
    textMain: 'text-[#F9F6F0]',
    textMuted: 'text-[#8A8B8D]',
    accent: 'text-[#C5B396]', // Champagne Gold
    border: 'border-[#2A2B2D]'
  };

  return (
    <div className={`font-sans ${colors.bgMain} ${colors.textMain} min-h-screen selection:bg-[#C5B396] selection:text-black ${showOpening ? 'max-h-screen overflow-hidden' : ''}`}>
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
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/5 backdrop-blur-xl ${colors.textMain} shadow-2xl ${colors.border} border hover:scale-105 active:scale-95 transition-all`}
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Cinematic Opening Sequence */}
      <AnimatePresence>
        {showOpening && (
          <motion.div
            key="opening"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer bg-[#0A0A0B]"
            onClick={handleOpen}
            exit={{ 
              filter: "blur(20px)",
              opacity: 0,
              scale: 1.05,
              transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
            }}
          >
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[40vh] bg-[#C5B396] opacity-[0.03] blur-[120px] pointer-events-none rounded-full"></div>
            
            <div className="text-center z-10 w-full max-w-4xl px-6 relative">
              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.2em' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className={`text-[10px] md:text-xs uppercase ${colors.accent} mb-12 font-medium tracking-widest`}
              >
                You are invited
              </motion.div>
              
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
                  className="text-6xl md:text-8xl lg:text-[10rem] font-light leading-tight tracking-tighter pb-2"
                >
                  <span className="italic pr-4 font-serif">A</span>New
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-16">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 1 }}
                  className="text-6xl md:text-8xl lg:text-[10rem] font-light leading-tight tracking-tighter pb-4"
                >
                  Beginning.
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="flex items-center justify-center gap-6"
              >
                <div className={`h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[#C5B396]/50`} />
                <button className={`uppercase text-[10px] md:text-xs tracking-[0.3em] ${colors.textMain} hover:${colors.accent} transition-colors flex items-center gap-3 group`}>
                  Enter Experience
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className={`h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-[#C5B396]/50`} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - No Navbar */}
      <main className="relative">
        {getOrderedSections().map((section: any, index: number) => {
          switch (section.id) {
            case 'hero':
              return (
                <section key="hero" id="hero" className={`relative min-h-[100svh] flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-24 ${colors.bgMain}`}>
                  <div className="absolute top-0 right-0 w-[60vw] h-[80vh] bg-gradient-to-bl from-[#C5B396]/[0.02] to-transparent pointer-events-none"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-end">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                      className="md:col-span-8"
                    >
                      <h2 className={`text-xs md:text-sm font-medium uppercase tracking-[0.4em] ${colors.accent} mb-8`}>
                        {housewarmingData.tagline || 'Housewarming Celebration'}
                      </h2>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.1] mb-6">
                        {content?.hero_title || 'Welcome to our new home.'}
                      </h1>
                      <div className="w-24 h-[2px] bg-[#C5B396]/30 mb-8 mt-12"></div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                      className="md:col-span-4 flex flex-col items-start md:items-end justify-end"
                    >
                      <div className={`p-8 border border-white/10 bg-white/[0.01] backdrop-blur-sm relative overflow-hidden group w-full md:w-auto`}>
                        <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#C5B396] group-hover:h-full transition-all duration-700"></div>
                        <p className={`text-xs uppercase tracking-[0.2em] ${colors.textMuted} mb-2`}>{dateInfo.weekday}</p>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl font-light">{dateInfo.month} {dateInfo.day}</span>
                          <span className={`text-sm ${colors.textMuted}`}>{dateInfo.year}</span>
                        </div>
                        <p className={`text-xs uppercase tracking-[0.2em] ${colors.accent} mt-6 mb-1`}>Time</p>
                        <p className="text-lg font-medium">{dateInfo.time}</p>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'hosts':
              return (
                <section key="hosts" id="hosts" className={`py-32 px-6 md:px-12 lg:px-24 ${colors.bgAlt} relative overflow-hidden`}>
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                      className="relative h-[60vh] lg:h-[80vh] w-full"
                    >
                      {housewarmingData.hostPhoto ? (
                        <div className="w-full h-full relative">
                          <div className="absolute inset-4 border border-white/20 z-10 translate-x-4 translate-y-4 pointer-events-none"></div>
                          <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 object-center relative z-20 shadow-2xl" />
                        </div>
                      ) : (
                        <div className={`w-full h-full ${colors.bgMain} border border-white/10 flex items-center justify-center`}>
                          <span className={`text-xs tracking-[0.2em] uppercase ${colors.textMuted}`}>No Image Provided</span>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                      className="flex flex-col justify-center"
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-[#C5B396]"></div>
                        <span className={`text-[10px] uppercase tracking-[0.3em] ${colors.accent}`}>The Hosts</span>
                      </div>
                      
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
                        {housewarmingData.hostName}
                      </h3>
                      
                      <p className={`text-lg md:text-xl font-light leading-relaxed ${colors.textMuted} max-w-xl`}>
                        We cordially invite you and your family to grace the occasion of our housewarming. Your presence will add to our joy and make this milestone truly unforgettable.
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'story':
              return (
                <section key="story" id="story" className={`py-40 px-6 md:px-12 lg:px-24 ${colors.bgMain} flex items-center justify-center`}>
                  <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <div className={`text-[10px] uppercase tracking-[0.3em] ${colors.accent} mb-12`}>
                        {content?.about_title || 'Welcome Note'}
                      </div>
                      <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.4] text-white tracking-tight">
                        "{content?.about_text}"
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'schedule':
              return (
                <section key="schedule" id="schedule" className={`py-32 px-6 md:px-12 lg:px-24 ${colors.bgAlt}`}>
                  <div className="max-w-5xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                      className="mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-8"
                    >
                      <h3 className="text-5xl md:text-6xl font-light tracking-tighter">Itinerary</h3>
                      <p className={`text-xs uppercase tracking-[0.2em] ${colors.accent}`}>Events of the day</p>
                    </motion.div>
                    
                    <div className="space-y-0">
                      {(housewarmingData.schedule || []).map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                          className="group border-b border-white/10 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors -mx-6 px-6 md:-mx-12 md:px-12 cursor-default"
                        >
                          <div className="flex items-center gap-12 md:gap-24 flex-1">
                            <div className={`text-sm tracking-widest font-mono ${colors.accent} w-24 shrink-0`}>
                              {item.time}
                            </div>
                            <h4 className="text-2xl md:text-3xl font-light text-white group-hover:translate-x-2 transition-transform duration-500">
                              {item.event}
                            </h4>
                          </div>
                          <div className={`flex items-center gap-3 text-xs tracking-widest uppercase ${colors.textMuted}`}>
                            <CalendarDays size={14} />
                            <span>{item.date}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'venue':
              return (
                <section key="venue" id="venue" className={`py-32 px-6 md:px-12 lg:px-24 ${colors.bgMain}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="lg:col-span-5 order-2 lg:order-1"
                      >
                        <div className={`text-[10px] uppercase tracking-[0.3em] ${colors.accent} mb-8`}>Location</div>
                        <h3 className="text-5xl md:text-6xl font-light tracking-tighter mb-12">The Venue</h3>
                        
                        <div className="space-y-12">
                          <div>
                            <p className={`text-xl md:text-2xl font-light leading-relaxed ${colors.textMuted} mb-8`}>
                              {content?.contact_info?.address || housewarmingData.venue}
                            </p>
                          </div>
                          
                          <a 
                            href={housewarmingData.mapUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-4 border border-white/20 px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all duration-300 group"
                          >
                            Get Directions
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="lg:col-span-7 order-1 lg:order-2 h-[50vh] lg:h-[70vh] w-full"
                      >
                        {housewarmingData.venuePhoto ? (
                          <div className="w-full h-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                            <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                          </div>
                        ) : (
                          <div className={`w-full h-full ${colors.bgAlt} border border-white/10 flex items-center justify-center`}>
                            <Home size={48} className="text-white/20" />
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
                <section key="gallery" id="gallery" className={`py-32 px-6 md:px-12 lg:px-24 ${colors.bgAlt}`}>
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                      className="mb-16 flex items-center justify-between"
                    >
                      <h3 className="text-4xl md:text-5xl font-light tracking-tighter">Gallery</h3>
                      <div className={`h-[1px] flex-1 ml-12 bg-white/10 hidden md:block`}></div>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {gallery.map((url: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                          className={`relative aspect-[4/5] group overflow-hidden bg-[#0A0A0B] ${i % 3 === 1 ? 'lg:translate-y-12' : ''}`}
                        >
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                        </motion.div>
                      ))}
                    </div>
                    {/* Add padding at the bottom for the staggered middle column */}
                    <div className="h-12 hidden lg:block"></div>
                  </div>
                </section>
              );

            case 'rsvp':
              return (
                <section key="rsvp" id="rsvp" className={`py-40 px-6 md:px-12 lg:px-24 ${colors.bgMain} flex flex-col items-center justify-center relative overflow-hidden`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#C5B396] opacity-[0.02] blur-[100px] rounded-full pointer-events-none"></div>
                  
                  <div className="max-w-2xl mx-auto text-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <h3 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-8">RSVP</h3>
                      <p className={`text-lg md:text-xl font-light ${colors.textMuted} mb-16`}>
                        Please confirm your presence to help us prepare for your arrival.
                      </p>
                      
                      <div className="inline-block relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#C5B396]/0 via-[#C5B396]/30 to-[#C5B396]/0 blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className={`relative flex items-center gap-6 bg-white/[0.03] backdrop-blur-md border border-white/10 px-10 py-6`}>
                          <Phone className={colors.accent} size={24} strokeWidth={1.5} />
                          <span className="text-2xl md:text-3xl font-light tracking-wide">
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

      {/* Minimal Footer */}
      <footer className={`${colors.bgMain} py-12 px-6 flex flex-col items-center border-t border-white/5`}>
        <div className={`text-[9px] uppercase tracking-[0.4em] ${colors.textMuted}`}>
          Crafted on Jaalam
        </div>
      </footer>
    </div>
  );
}
