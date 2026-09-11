import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CalendarDays, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export interface HousewarmingLayoutProps {
  content: any;
}

export function ModernMinimalLayout({ content }: HousewarmingLayoutProps) {
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
      if (!content?.date) return { month: 'OCT', day: '25', year: '2026', weekday: 'SUNDAY', time: '09:00 AM' };
      const d = new Date(content.date);
      return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate().toString().padStart(2, '0'),
        year: d.getFullYear().toString(),
        weekday: d.toLocaleString('en-US', { weekday: 'long' }).toUpperCase(),
        time: housewarmingData.time || '09:00 AM'
      };
    } catch {
      return { month: 'OCT', day: '25', year: '2026', weekday: 'SUNDAY', time: '09:00 AM' };
    }
  };
  const dateInfo = parseDateTime();

  const handleOpen = () => {
    setShowOpening(false);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
  };

  // Color Palette Constants - Stark Black and White
  const colors = {
    bgMain: 'bg-white',
    textMain: 'text-black',
    textMuted: 'text-neutral-400',
    border: 'border-black'
  };

  return (
    <div className={`font-sans ${colors.bgMain} ${colors.textMain} min-h-screen selection:bg-black selection:text-white ${showOpening ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Minimal Floating Audio Control Button */}
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
          className={`fixed bottom-8 right-8 z-50 p-3 bg-white text-black border ${colors.border} hover:bg-black hover:text-white transition-colors duration-300`}
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
        </button>
      )}

      {/* Stark Mechanical Opening Sequence */}
      <AnimatePresence>
        {showOpening && (
          <motion.div
            key="opening"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer bg-white"
            onClick={handleOpen}
            exit={{ 
              y: '-100%',
              transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] } 
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black"></div>
            
            <div className="text-center z-10 w-full px-6 flex flex-col items-center">
              <div className="overflow-hidden mb-8">
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
                  className={`text-[10px] md:text-xs uppercase font-medium tracking-[0.3em]`}
                >
                  Invitation
                </motion.div>
              </div>
              
              <div className="overflow-hidden mb-12">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.85, 0, 0.15, 1], delay: 0.4 }}
                  className="text-7xl md:text-9xl lg:text-[12rem] font-bold leading-none tracking-tighter uppercase"
                >
                  Enter
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                className="w-16 h-[2px] bg-black"
              />
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
                <section key="hero" id="hero" className={`relative min-h-[100svh] pt-32 px-6 md:px-12 lg:px-24 flex flex-col justify-between ${colors.bgMain}`}>
                  <div className="w-full flex justify-between items-start border-b border-black pb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                    >
                      <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4`}>
                        {housewarmingData.tagline || 'Housewarming'}
                      </h2>
                      <p className={`text-xs uppercase tracking-widest ${colors.textMuted}`}>{dateInfo.year}</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.85, 0, 0.15, 1] }}
                      className="text-right"
                    >
                      <p className={`text-xs uppercase tracking-[0.2em] mb-2`}>{dateInfo.weekday}</p>
                      <div className="text-xl font-bold tracking-tight">
                        {dateInfo.day}.{dateInfo.month}
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center my-16">
                    <motion.h1
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.85, 0, 0.15, 1] }}
                      className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none uppercase"
                      style={{ wordSpacing: '-0.1em' }}
                    >
                      {content?.hero_title || 'New Home'}
                    </motion.h1>
                  </div>
                </section>
              );

            case 'hosts':
              return (
                <section key="hosts" id="hosts" className={`py-32 px-6 md:px-12 lg:px-24 border-t border-black`}>
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                      className="lg:col-span-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border-b border-black inline-block pb-1">The Hosts</div>
                        <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 uppercase">
                          {housewarmingData.hostName}
                        </h3>
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${colors.textMuted} uppercase tracking-widest max-w-sm mt-8 lg:mt-0`}>
                        We cordially invite you and your family to grace the occasion of our housewarming.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.85, 0, 0.15, 1] }}
                      className="lg:col-span-8 aspect-[16/9] bg-neutral-100 overflow-hidden"
                    >
                      {housewarmingData.hostPhoto ? (
                        <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center`}>
                          <span className={`text-[10px] tracking-[0.2em] uppercase ${colors.textMuted}`}>Image Placeholder</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </section>
              );

            case 'story':
              return (
                <section key="story" id="story" className={`py-40 px-6 md:px-12 lg:px-24 border-t border-black flex items-center justify-center`}>
                  <div className="max-w-5xl mx-auto text-center relative">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                    >
                      <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-12`}>
                        {content?.about_title || 'About'}
                      </div>
                      <p className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.3] tracking-tight uppercase" style={{ wordSpacing: '0.1em' }}>
                        {content?.about_text}
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'schedule':
              return (
                <section key="schedule" id="schedule" className={`border-t border-black`}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh]">
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-black p-6 md:p-12 lg:p-24 flex flex-col justify-between bg-neutral-50">
                      <h3 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Itinerary</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-8`}>Events</p>
                    </div>
                    
                    <div className="lg:col-span-8 flex flex-col">
                      {(housewarmingData.schedule || []).map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.85, 0, 0.15, 1] }}
                          className="group border-b border-black last:border-b-0 p-6 md:p-12 lg:p-16 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:bg-black hover:text-white transition-colors duration-500"
                        >
                          <div className="flex flex-col gap-2">
                            <h4 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">
                              {item.event}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] tracking-widest font-bold uppercase opacity-60">
                              <CalendarDays size={12} strokeWidth={2} />
                              <span>{item.date}</span>
                            </div>
                          </div>
                          
                          <div className={`text-lg tracking-widest font-mono font-bold uppercase`}>
                            {item.time}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'venue':
              return (
                <section key="venue" id="venue" className={`border-t border-black`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="border-b lg:border-b-0 lg:border-r border-black aspect-square lg:aspect-auto"
                    >
                      {housewarmingData.venuePhoto ? (
                        <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className={`w-full h-full bg-neutral-50 flex items-center justify-center`}>
                          <span className={`text-[10px] tracking-[0.2em] uppercase ${colors.textMuted}`}>Location Image</span>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                      className="p-6 md:p-12 lg:p-24 flex flex-col justify-center"
                    >
                      <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-12`}>Location</div>
                      
                      <div className="space-y-16">
                        <div>
                          <p className={`text-2xl md:text-3xl lg:text-4xl font-medium leading-snug tracking-tight uppercase`}>
                            {content?.contact_info?.address || housewarmingData.venue}
                          </p>
                        </div>
                        
                        <a 
                          href={housewarmingData.mapUrl || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-2 hover:opacity-50 transition-opacity"
                        >
                          Directions
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'gallery':
              const gallery = housewarmingData.gallery || [];
              if (gallery.length === 0) return null;
              return (
                <section key="gallery" id="gallery" className={`py-32 px-6 md:px-12 lg:px-24 border-t border-black`}>
                  <div className="max-w-[2000px] mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                      className="mb-16 flex items-center justify-between border-b border-black pb-8"
                    >
                      <h3 className="text-2xl font-bold tracking-tighter uppercase">Gallery</h3>
                      <div className={`text-[10px] font-bold uppercase tracking-[0.3em]`}>Visuals</div>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-black border border-black">
                      {gallery.map((url: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`relative aspect-square bg-white overflow-hidden group`}
                        >
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'rsvp':
              return (
                <section key="rsvp" id="rsvp" className={`border-t border-black bg-black text-white`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[50vh]">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                      className="p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col justify-center"
                    >
                      <h3 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-8">RSVP</h3>
                      <p className={`text-sm uppercase tracking-widest leading-relaxed max-w-sm text-neutral-400 font-medium`}>
                        Please confirm your presence to help us prepare.
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.85, 0, 0.15, 1] }}
                      className="p-6 md:p-12 lg:p-24 flex items-center justify-start lg:justify-center bg-black hover:bg-white hover:text-black transition-colors duration-500 group cursor-pointer"
                    >
                      <div className={`flex flex-col gap-6`}>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] group-hover:text-black text-neutral-400 transition-colors">Contact</div>
                        <div className="flex items-center gap-6">
                          <Phone size={24} strokeWidth={2} />
                          <span className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
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
      <footer className={`${colors.bgMain} py-8 px-6 flex flex-col items-center border-t border-black`}>
        <div className={`text-[8px] font-bold uppercase tracking-[0.4em]`}>
          Jaalam
        </div>
      </footer>
    </div>
  );
}
