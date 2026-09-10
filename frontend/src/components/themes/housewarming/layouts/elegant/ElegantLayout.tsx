import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Heart, Volume2, VolumeX, Sparkles, Key, Navigation } from 'lucide-react';
import type { HousewarmingLayoutProps } from '../../../../themes/housewarming/layouts/traditional/TraditionalLayout';

export function ElegantLayout({ content }: { content: any }) {
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
    }, 1800); // Wait for the grand reveal animation
  };

  const gallery = housewarmingData.gallery || [];
  
  return (
    <div className={`font-serif bg-[#fbf9f6] text-[#0f172a] min-h-screen selection:bg-[#cda776] selection:text-[#0b1b3d] ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Elegant Audio Control */}
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#0b1b3d] text-[#e0c38c] shadow-[0_10px_30px_rgba(11,27,61,0.3)] border border-[#cda776]/30 hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* GRAND ELEGANT OPENING */}
      <div 
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none delay-500' : 'opacity-100'} cursor-pointer bg-[#0b1b3d] overflow-hidden`}
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Animated Golden Frame */}
        <div className={`absolute inset-6 sm:inset-10 border-[1px] border-[#cda776]/40 transition-all duration-[1500ms] ease-in-out ${isOpening ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#cda776]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#cda776]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#cda776]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#cda776]"></div>
        </div>

        {/* Center Card */}
        <div className={`relative z-30 transition-all duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpening ? 'scale-150 opacity-0 blur-md' : 'scale-100 opacity-100 blur-0'}`}>
          <div className="w-[85vw] max-w-sm bg-gradient-to-br from-[#132347] to-[#0b1b3d] rounded-sm p-1 border border-[#cda776]/50 shadow-[0_0_50px_rgba(205,167,118,0.15)] relative overflow-hidden group">
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            
            <div className="bg-[#0b1b3d] p-8 sm:p-12 h-full flex flex-col items-center justify-center text-center border border-[#cda776]/20">
              
              <div className="mb-6 flex justify-center text-[#cda776]">
                <Key size={32} strokeWidth={1} />
              </div>
              
              <p className="text-[10px] sm:text-xs text-[#cda776] tracking-[0.4em] uppercase font-bold mb-4">
                You are cordially invited
              </p>
              
              <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2 leading-tight">
                {housewarmingData.hostName || 'The Family'}
              </h1>
              <p className="text-lg font-serif italic text-[#a3b1c6] mb-8">
                Grihapravesham
              </p>
              
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#cda776] to-transparent mx-auto mb-10" />
              
              <div className="px-6 py-3 border border-[#cda776]/50 text-[10px] tracking-[0.2em] uppercase text-[#cda776] hover:bg-[#cda776] hover:text-[#0b1b3d] transition-colors duration-500">
                Tap to Reveal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full bg-[#fbf9f6]">
        
        {/* HERO SECTION */}
        {isVisible('hero') && (
          <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center border-b-[8px] border-[#0b1b3d]">
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative z-10 max-w-4xl mx-auto w-full pt-16"
            >
              <div className="mb-8 flex justify-center text-[#0b1b3d]">
                <Key size={40} strokeWidth={1} />
              </div>
              
              <p className="text-[#0b1b3d] uppercase tracking-[0.4em] text-xs font-bold mb-6">
                {housewarmingData.tagline || 'Join us in celebrating'}
              </p>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#0b1b3d] mb-4 leading-[1.1]">
                Our New Home
              </h1>
              
              <p className="text-2xl md:text-3xl font-serif italic text-[#cda776] mb-12">
                {housewarmingData.hostName || content?.hero_title || 'The Family'}
              </p>
              
              <div className="bg-white p-1 max-w-2xl mx-auto rounded-sm border border-[#cda776]/30 shadow-xl">
                <div className="border border-[#cda776]/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#fdfdfc]">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8a98a5] mb-2">The Date</p>
                    <p className="text-2xl font-serif text-[#0b1b3d]">{dateInfo.month} {dateInfo.day}, {dateInfo.year}</p>
                  </div>
                  
                  <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-[#cda776]/50 to-transparent"></div>
                  <div className="md:hidden w-32 h-px bg-gradient-to-r from-transparent via-[#cda776]/50 to-transparent my-2"></div>
                  
                  <div className="flex-1 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8a98a5] mb-2">The Time</p>
                    <p className="text-2xl font-serif text-[#0b1b3d]">{dateInfo.time}</p>
                  </div>
                </div>
              </div>
              
            </motion.div>
          </section>
        )}

        {/* HOSTS SECTION */}
        {isVisible('hosts') && (
          <section id="hosts" className="py-24 md:py-32 px-6 relative bg-white">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20"
            >
              <div className="md:w-1/2 relative">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-[#cda776] translate-x-4 translate-y-4"></div>
                <div className="aspect-[3/4] relative bg-[#f4ece1] z-10 shadow-2xl">
                  {housewarmingData.hostPhoto ? (
                    <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-[#cda776]/30" strokeWidth={1} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2 text-center md:text-left z-20">
                <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                  <span className="w-12 h-[1px] bg-[#cda776]"></span>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#cda776]">The Hosts</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-serif text-[#0b1b3d] mb-6">{housewarmingData.hostName}</h3>
                
                <p className="text-[#64748b] text-lg font-serif italic leading-relaxed">
                  "It is our absolute pleasure to invite you to share in the joy of our new beginnings. We have prepared a beautiful evening to celebrate this milestone together."
                </p>
              </div>
            </motion.div>
          </section>
        )}

        {/* DETAILS SECTION */}
        {isVisible('story') && content?.about_text && (
          <section id="story" className="py-32 px-6 bg-[#0b1b3d] text-white relative">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="max-w-3xl mx-auto text-center relative z-10"
            >
              <Sparkles className="w-8 h-8 text-[#cda776] mx-auto mb-8" strokeWidth={1} />
              <h2 className="text-3xl md:text-4xl font-serif text-[#e0c38c] mb-10">{content.about_title || 'A New Chapter'}</h2>
              <p className="text-[#a3b1c6] leading-relaxed text-xl md:text-2xl font-serif italic">
                "{content.about_text}"
              </p>
            </motion.div>
          </section>
        )}

        {/* SCHEDULE SECTION */}
        {isVisible('schedule') && (housewarmingData.schedule?.length > 0) && (
          <section id="schedule" className="py-32 px-6 bg-[#fbf9f6] relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-serif text-[#0b1b3d] mb-6">Order of Events</h2>
                <div className="w-24 h-[1px] bg-[#cda776] mx-auto"></div>
              </div>
              
              <div className="space-y-12">
                {(housewarmingData.schedule || []).map((item: any, index: number) => (
                  <div key={index} className="flex flex-col md:flex-row items-center md:items-start group">
                    <div className="md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right md:pr-10 mb-4 md:mb-0 border-b md:border-b-0 md:border-r border-[#cda776]/30 pb-4 md:pb-0">
                      <span className="text-[#cda776] font-bold tracking-[0.2em] text-sm uppercase mb-2">{item.time}</span>
                      <span className="text-[10px] text-[#8a98a5] uppercase tracking-widest">{dateInfo.month} {dateInfo.day}</span>
                    </div>
                    
                    <div className="hidden md:flex flex-col items-center justify-center relative w-10">
                      <div className="absolute top-0 bottom-0 w-px bg-transparent"></div>
                      <div className="w-3 h-3 bg-[#cda776] rotate-45 transform group-hover:scale-150 transition-transform duration-500 absolute -left-1.5 top-1.5"></div>
                    </div>

                    <div className="md:w-2/3 md:pl-10 text-center md:text-left pt-2 md:pt-0">
                      <h4 className="text-2xl font-serif text-[#0b1b3d] mb-3">{item.event}</h4>
                      <p className="text-[#64748b] text-sm flex items-center justify-center md:justify-start">
                        <MapPin size={14} className="mr-2 text-[#cda776]" />
                        {item.venue || 'Our New Home'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* VENUE SECTION */}
        {isVisible('venue') && (
          <section id="venue" className="py-24 md:py-32 px-6 bg-white border-y border-[#0b1b3d]/10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16"
            >
              <div className="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                  <span className="w-8 h-[1px] bg-[#cda776]"></span>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#cda776]">The Location</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-serif text-[#0b1b3d] mb-8">Our New Address</h3>
                <p className="text-[#64748b] mb-12 leading-relaxed font-serif text-lg">
                  {content?.contact_info?.address || housewarmingData.venue || '123 New Home Lane, City, State 12345'}
                </p>
                
                {housewarmingData.mapUrl && (
                  <a 
                    href={housewarmingData.mapUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-[#0b1b3d] text-white font-bold text-[10px] uppercase tracking-[0.3em] px-10 py-5 hover:bg-[#cda776] hover:text-[#0b1b3d] transition-colors duration-500"
                  >
                    Get Directions
                    <Navigation size={14} />
                  </a>
                )}
              </div>

              <div className="lg:w-1/2 w-full order-1 lg:order-2">
                <div className="aspect-[4/3] relative shadow-[0_20px_50px_rgba(11,27,61,0.1)] p-2 bg-white border border-[#cda776]/30">
                  {housewarmingData.venuePhoto ? (
                    <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#f4ece1] flex flex-col items-center justify-center text-[#cda776]">
                      <MapPin size={40} className="mb-4 opacity-50" strokeWidth={1} />
                      <span className="font-serif italic">Venue Location</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* GALLERY SECTION */}
        {isVisible('gallery') && gallery.length > 0 && (
          <section id="gallery" className="py-32 px-6 bg-[#fbf9f6]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-serif text-[#0b1b3d] mb-6">Gallery</h2>
                <div className="w-24 h-[1px] bg-[#cda776] mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-[4/5] p-2 bg-white shadow-xl border border-[#cda776]/20 group relative overflow-hidden">
                    <div className="w-full h-full relative overflow-hidden">
                      <img 
                        src={img} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* RSVP SECTION */}
        {isVisible('share') && (
          <section id="rsvp" className="py-32 px-6 bg-[#0b1b3d] text-white text-center relative overflow-hidden border-t-[8px] border-[#cda776]">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-xl mx-auto relative z-10"
            >
              <h2 className="text-5xl md:text-6xl font-serif text-[#e0c38c] mb-8">RSVP</h2>
              <p className="text-[#a3b1c6] mb-16 font-serif italic text-xl">
                Please respond to let us know if you will be joining us.
              </p>
              
              <div className="p-1 bg-gradient-to-br from-[#cda776] to-[#8c6b41] max-w-sm mx-auto">
                <div className="bg-[#0b1b3d] p-10 flex flex-col items-center">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#cda776] mb-4">Contact Number</p>
                  <p className="text-2xl font-serif text-white">
                    {housewarmingData.contactNumbers || content?.contact_info?.phone || 'No phone provided'}
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-[#06112a] py-12 text-center text-[#475569]">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#a3b1c6]">Designed by Jaalam</p>
      </footer>

    </div>
  );
}
