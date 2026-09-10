import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Heart, Volume2, VolumeX, Sparkles, Navigation, ArrowDown, ChevronRight, Home } from 'lucide-react';
import type { HousewarmingLayoutProps } from '../../../../themes/housewarming/layouts/traditional/TraditionalLayout';

export function MinimalLayout({ content }: { content: any }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const housewarmingData = content?.settings_json?.housewarming || {};
  const musicUrl = housewarmingData.musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const sections = housewarmingData.sections || [];
  
  const isVisible = (id: string) => sections.find((s: any) => s.id === id)?.visible !== false;

  const parseDateTime = () => {
    try {
      if (!content?.date) return { month: 'OCT', day: '25', year: '2026', weekday: 'SUNDAY', time: '9:00 AM' };
      const d = new Date(content.date);
      return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate().toString(),
        year: d.getFullYear().toString(),
        weekday: d.toLocaleString('en-US', { weekday: 'long' }).toUpperCase(),
        time: housewarmingData.time || '9:00 AM'
      };
    } catch {
      return { month: 'OCT', day: '25', year: '2026', weekday: 'SUNDAY', time: '9:00 AM' };
    }
  };
  const dateInfo = parseDateTime();

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1500); // Cinematic fade out duration
  };

  const gallery = housewarmingData.gallery || [];
  
  return (
    <div className={`font-sans bg-[#ffffff] text-[#111111] min-h-screen selection:bg-[#111111] selection:text-white ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Subtle Audio Control Button */}
      {musicUrl && isOpened && (
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
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#111111] text-white hover:bg-[#333333] transition-colors"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* MINIMAL OPENING ANIMATION */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            onClick={handleOpen}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#111111] text-white flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-8 font-light">
                {housewarmingData.tagline || "You're Invited"}
              </p>
              
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                {housewarmingData.hostName || 'The Family'}
              </h1>
              
              <div className="w-px h-16 bg-white/20 mx-auto my-8" />
              
              <p className="text-xs uppercase tracking-widest text-white/70 font-medium">
                Housewarming
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Enter</span>
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={14} className="text-white/40" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 w-full bg-white">
        
        {/* HERO SECTION */}
        {isVisible('hero') && (
          <section id="hero" className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-16 pt-24 border-b border-black/5">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
            >
              <div className="flex-1 text-left w-full">
                <p className="text-[11px] uppercase tracking-[0.3em] text-black/50 mb-6 font-medium">
                  {housewarmingData.tagline || 'Please join us'}
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-[#111] mb-8 leading-[1.1]">
                  New <br />
                  <span className="text-black/30 italic font-serif">Beginnings</span>
                </h1>
                
                <div className="flex items-center gap-8 text-sm">
                  <div>
                    <p className="text-black/40 text-[10px] uppercase tracking-widest mb-1">Date</p>
                    <p className="font-medium">{dateInfo.month} {dateInfo.day}, {dateInfo.year}</p>
                  </div>
                  <div className="w-px h-8 bg-black/10" />
                  <div>
                    <p className="text-black/40 text-[10px] uppercase tracking-widest mb-1">Time</p>
                    <p className="font-medium">{dateInfo.time}</p>
                  </div>
                </div>
              </div>

              {/* Minimal Line Art Graphic / Image */}
              <div className="flex-1 w-full max-w-sm aspect-[3/4] bg-[#f8f8f8] relative overflow-hidden group">
                {housewarmingData.venuePhoto ? (
                  <img src={housewarmingData.venuePhoto} alt="Hero" className="w-full h-full object-cover grayscale transition-transform duration-[2s] group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border border-black/10 flex items-center justify-center rotate-45 transition-transform duration-1000 group-hover:rotate-90">
                      <div className="w-16 h-16 border border-black/20 flex items-center justify-center -rotate-45">
                        <Home className="text-black/20 w-6 h-6" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </section>
        )}

        {/* HOSTS SECTION */}
        {isVisible('hosts') && (
          <section id="hosts" className="py-32 px-6 md:px-16 border-b border-black/5">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16"
            >
              <div className="md:w-1/3 text-left">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-black/50 font-medium mb-4">The Hosts</h2>
                <h3 className="text-3xl font-light tracking-tight">{housewarmingData.hostName}</h3>
              </div>
              
              <div className="md:w-2/3 flex flex-col md:flex-row items-center gap-8">
                <div className="w-40 h-40 bg-[#f4f4f4] rounded-full overflow-hidden shrink-0">
                  {housewarmingData.hostPhoto ? (
                    <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/10">
                      <Heart className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <p className="text-black/60 text-lg md:text-xl font-light leading-relaxed max-w-md">
                  "We look forward to welcoming you to our new space, filled with hope and good energy."
                </p>
              </div>
            </motion.div>
          </section>
        )}

        {/* DETAILS SECTION */}
        {isVisible('story') && content?.about_text && (
          <section id="story" className="py-32 px-6 md:px-16 bg-[#fafafa]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 font-medium mb-8">
                {content.about_title || 'About'}
              </p>
              <p className="text-2xl md:text-4xl text-[#111] leading-snug tracking-tight font-light">
                {content.about_text}
              </p>
            </motion.div>
          </section>
        )}

        {/* SCHEDULE SECTION */}
        {isVisible('schedule') && (housewarmingData.schedule?.length > 0) && (
          <section id="schedule" className="py-32 px-6 md:px-16 border-b border-black/5">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-black/50 font-medium mb-16">Itinerary</h2>
              
              <div className="flex flex-col">
                {(housewarmingData.schedule || []).map((item: any, index: number) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-baseline py-8 border-t border-black/10 group">
                    <div className="md:w-1/4 mb-2 md:mb-0">
                      <span className="text-sm font-medium text-black/50">{item.time}</span>
                    </div>
                    <div className="md:w-1/2 mb-2 md:mb-0">
                      <h4 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-black/50 transition-colors">{item.event}</h4>
                    </div>
                    <div className="md:w-1/4 md:text-right">
                      <span className="text-xs uppercase tracking-widest text-black/40">{item.venue || 'Our Home'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* VENUE SECTION */}
        {isVisible('venue') && (
          <section id="venue" className="py-32 px-6 md:px-16 border-b border-black/5">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16"
            >
              <div className="lg:w-1/2">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-black/50 font-medium mb-16">Location</h2>
                
                <h3 className="text-4xl font-light tracking-tight mb-6">Our New Address</h3>
                <p className="text-black/60 text-lg mb-12 max-w-sm leading-relaxed">
                  {content?.contact_info?.address || housewarmingData.venue || '123 New Home Lane, City, State 12345'}
                </p>
                
                {housewarmingData.mapUrl && (
                  <a 
                    href={housewarmingData.mapUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium text-[#111] hover:text-black/50 transition-colors"
                  >
                    <span>View Map</span>
                    <ChevronRight size={14} />
                  </a>
                )}
              </div>

              <div className="lg:w-1/2 aspect-[4/3] bg-[#f8f8f8] relative overflow-hidden">
                {housewarmingData.venuePhoto ? (
                  <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                    <MapPin size={32} strokeWidth={1} className="mb-4" />
                    <span className="text-xs uppercase tracking-widest">Venue Location</span>
                  </div>
                )}
              </div>
            </motion.div>
          </section>
        )}

        {/* GALLERY SECTION */}
        {isVisible('gallery') && gallery.length > 0 && (
          <section id="gallery" className="py-32 px-6 md:px-16 border-b border-black/5">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto"
            >
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-black/50 font-medium mb-16">Gallery</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-[#f8f8f8] relative overflow-hidden group">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* RSVP SECTION */}
        {isVisible('share') && (
          <section id="rsvp" className="py-32 px-6 md:px-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-[#111]">Join Us</h2>
              <p className="text-black/50 mb-16 text-lg">
                Kindly confirm your attendance.
              </p>
              
              <div className="inline-block p-10 border border-black/10 text-left">
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/40 mb-3">RSVP Contact</p>
                <p className="text-xl tracking-wider">
                  {housewarmingData.contactNumbers || content?.contact_info?.phone || 'No phone provided'}
                </p>
              </div>
            </motion.div>
          </section>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-white py-12 text-center border-t border-black/5">
        <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-black/30">Jaalam</p>
      </footer>

    </div>
  );
}
