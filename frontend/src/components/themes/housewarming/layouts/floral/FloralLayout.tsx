import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Heart, Volume2, VolumeX, Sparkles, Leaf, Flower2, Navigation, Home } from 'lucide-react';
import type { HousewarmingLayoutProps } from '../../../../themes/housewarming/layouts/traditional/TraditionalLayout';

export function FloralLayout({ content }: { content: any }) {
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
    }, 1200); // Wait for the door split animation to finish
  };

  const gallery = housewarmingData.gallery || [];
  
  // High quality floral imagery from Unsplash for the theme
  const floralBgUrl = 'https://images.unsplash.com/photo-1490750967868-88cb4aca8fba?q=80&w=2070&auto=format&fit=crop';
  const softFloralUrl = 'https://images.unsplash.com/photo-1460500063983-994d4c27756c?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className={`font-serif bg-[#fdfaf6] text-[#2c3d30] min-h-screen selection:bg-[#d4a5a5] selection:text-white ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control Button */}
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/80 backdrop-blur-md text-[#2c3d30] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* SPLIT DOOR OPENING ANIMATION */}
      <div 
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer`}
      >
        {/* Left Panel */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full bg-cover bg-left bg-no-repeat transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-20 ${isOpening ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ backgroundImage: `url('${floralBgUrl}')` }}
        >
          <div className="absolute inset-0 bg-[#2c3d30]/20" />
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/40 shadow-[1px_0_10px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Right Panel */}
        <div 
          className={`absolute top-0 right-0 w-1/2 h-full bg-cover bg-right bg-no-repeat transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-20 ${isOpening ? 'translate-x-full' : 'translate-x-0'}`}
          style={{ backgroundImage: `url('${floralBgUrl}')` }}
        >
          <div className="absolute inset-0 bg-[#2c3d30]/20" />
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/40 shadow-[-1px_0_10px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Center Seal / Invitation Badge */}
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700 ${isOpening ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white/95 backdrop-blur-md rounded-full shadow-2xl flex flex-col items-center justify-center p-6 border-4 border-[#fdfaf6] relative group">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-50" />
            
            <Flower2 className="w-8 h-8 text-[#d4a5a5] mb-2 group-hover:rotate-180 transition-transform duration-1000" strokeWidth={1} />
            <span className="text-[10px] sm:text-xs text-[#8a9a86] tracking-[0.3em] uppercase font-bold mb-1">
              You're Invited
            </span>
            <h1 className="text-xl sm:text-2xl font-serif text-[#2c3d30] text-center leading-tight font-bold">
              {housewarmingData.hostName || 'The Family'}'s
              <br />
              <span className="italic text-[#d4a5a5]">Housewarming</span>
            </h1>
            <div className="mt-4 px-4 py-1.5 bg-[#fdfaf6] rounded-full text-[9px] tracking-[0.2em] uppercase font-bold text-[#2c3d30] group-hover:bg-[#d4a5a5] group-hover:text-white transition-colors">
              Tap to Open
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full bg-[#fdfaf6]">
        
        {/* HERO SECTION */}
        {isVisible('hero') && (
          <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Full background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
              style={{ backgroundImage: `url('${softFloralUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf6]/80 via-[#fdfaf6]/40 to-[#fdfaf6]" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative z-10 max-w-3xl mx-auto w-full px-6 flex flex-col items-center text-center mt-12"
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white p-10 sm:p-16 rounded-t-full rounded-b-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full">
                
                <div className="flex justify-center mb-6">
                  <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#d4a5a5]"></div>
                </div>

                <p className="text-[#8a9a86] uppercase tracking-[0.3em] text-xs font-bold mb-4">
                  {housewarmingData.tagline || 'Please join us for'}
                </p>
                
                <h1 className="text-5xl md:text-7xl font-serif text-[#2c3d30] mb-2 font-bold leading-tight">
                  Grihapravesham
                </h1>
                
                <p className="text-2xl md:text-3xl font-serif italic text-[#d4a5a5] mb-8">
                  {housewarmingData.hostName || content?.hero_title || 'Our New Home'}
                </p>
                
                <div className="flex items-center justify-center gap-4 my-8">
                  <span className="w-12 h-[1px] bg-[#d4a5a5]/40"></span>
                  <Leaf className="w-4 h-4 text-[#8a9a86]" strokeWidth={1} />
                  <span className="w-12 h-[1px] bg-[#d4a5a5]/40"></span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mt-4 text-[#2c3d30]">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8a9a86] mb-1">Date</p>
                    <p className="text-xl font-serif">{dateInfo.month} {dateInfo.day}, {dateInfo.year}</p>
                  </div>
                  <div className="hidden sm:block w-[1px] h-10 bg-[#d4a5a5]/40"></div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8a9a86] mb-1">Time</p>
                    <p className="text-xl font-serif">{dateInfo.time}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </section>
        )}

        {/* HOSTS SECTION */}
        {isVisible('hosts') && (
          <section id="hosts" className="py-24 px-6 relative overflow-hidden bg-white">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#f9f1f0] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto text-center relative z-10"
            >
              <h2 className="text-3xl md:text-5xl font-serif text-[#2c3d30] mb-16 font-bold">Hosted With Love</h2>
              
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 border border-[#d4a5a5] rounded-t-full rounded-b-full scale-105 transition-transform duration-500 group-hover:scale-110"></div>
                  <div className="w-48 h-64 mx-auto rounded-t-full rounded-b-full overflow-hidden shadow-2xl relative bg-[#fdfaf6] z-10">
                    {housewarmingData.hostPhoto ? (
                      <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d4a5a5]/50">
                        <Flower2 className="w-16 h-16" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="mt-8">
                    <h3 className="text-3xl font-serif text-[#2c3d30] font-bold mb-2">{housewarmingData.hostName}</h3>
                    <p className="text-[#8a9a86] italic font-serif text-lg">We welcome you to our humble abode.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* DETAILS SECTION */}
        {isVisible('story') && content?.about_text && (
          <section id="story" className="py-24 px-6 relative bg-[#f9f1f0]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Flower2 className="w-8 h-8 text-[#d4a5a5] mx-auto mb-6" strokeWidth={1} />
              <h2 className="text-3xl font-serif text-[#2c3d30] mb-8 font-bold">{content.about_title || 'A New Beginning'}</h2>
              <p className="text-[#59695d] leading-relaxed text-xl md:text-2xl font-serif italic">"{content.about_text}"</p>
            </motion.div>
          </section>
        )}

        {/* SCHEDULE SECTION */}
        {isVisible('schedule') && (housewarmingData.schedule?.length > 0) && (
          <section id="schedule" className="py-24 px-6 bg-white relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-[#2c3d30] font-bold mb-4">Festivities</h2>
                <div className="w-px h-12 bg-gradient-to-b from-[#d4a5a5] to-transparent mx-auto mt-6"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(housewarmingData.schedule || []).map((item: any, index: number) => (
                  <div key={index} className="bg-[#fdfaf6] p-8 rounded-tr-3xl rounded-bl-3xl border border-[#e6d8d6] hover:border-[#d4a5a5] transition-colors shadow-sm hover:shadow-xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#f9f1f0] to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
                    <div className="flex items-center text-[#d4a5a5] mb-4">
                      <Clock size={16} className="mr-2" />
                      <span className="font-bold tracking-widest text-xs uppercase">{item.time}</span>
                    </div>
                    <h4 className="text-2xl font-serif text-[#2c3d30] font-bold mb-3 group-hover:text-[#d4a5a5] transition-colors">{item.event}</h4>
                    <p className="text-[#8a9a86] text-sm flex items-center">
                      <MapPin size={14} className="mr-1.5 opacity-70" />
                      {item.venue || 'Our New Home'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* VENUE SECTION */}
        {isVisible('venue') && (
          <section id="venue" className="py-24 px-6 bg-[#f9f1f0] relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                
                {/* Image Side */}
                <div className="lg:w-1/2 relative min-h-[300px]">
                  {housewarmingData.venuePhoto ? (
                    <img src={housewarmingData.venuePhoto} alt="Venue" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[#fdfaf6] flex flex-col items-center justify-center text-[#8a9a86]">
                      <Home size={48} className="mb-4 opacity-50" strokeWidth={1} />
                      <span className="font-serif italic text-lg">Our Beautiful Home</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
                </div>

                <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center text-center lg:text-left relative">
                  
                  <h2 className="text-3xl md:text-5xl font-serif text-[#2c3d30] font-bold mb-6">The Location</h2>
                  <p className="text-[#59695d] mb-10 leading-relaxed font-serif text-lg">
                    {content?.contact_info?.address || housewarmingData.venue || '123 New Home Lane, City, State 12345'}
                  </p>
                  
                  {housewarmingData.mapUrl && (
                    <a 
                      href={housewarmingData.mapUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center lg:justify-start gap-2 text-[#2c3d30] font-bold text-[11px] uppercase tracking-[0.2em] group"
                    >
                      <span className="w-10 h-10 rounded-full border border-[#2c3d30] flex items-center justify-center group-hover:bg-[#2c3d30] group-hover:text-white transition-colors">
                        <Navigation size={14} />
                      </span>
                      Get Directions
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </section>
        )}

        {/* GALLERY SECTION */}
        {isVisible('gallery') && gallery.length > 0 && (
          <section id="gallery" className="py-24 px-6 bg-white relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-[#2c3d30] font-bold mb-4">Captured Moments</h2>
                <p className="text-[#8a9a86] font-serif italic text-lg">A glimpse into our journey</p>
              </div>
              
              {/* Masonry-like abstract grid */}
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden shadow-md group relative">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#2c3d30]/0 group-hover:bg-[#2c3d30]/20 transition-colors duration-500"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* RSVP SECTION */}
        {isVisible('share') && (
          <section id="rsvp" className="py-32 px-6 bg-[#2c3d30] text-[#fdfaf6] relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url('${floralBgUrl}')` }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-xl mx-auto text-center relative z-10"
            >
              <Heart className="w-10 h-10 text-[#d4a5a5] mx-auto mb-8 fill-[#d4a5a5]/20" strokeWidth={1} />
              
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white drop-shadow-md">We wait for you</h2>
              <p className="text-[#a4b49f] mb-12 leading-relaxed font-serif italic text-xl md:text-2xl">
                Your presence is our biggest present.
              </p>
              
              <div className="pt-8 border-t border-[#fdfaf6]/20">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#d4a5a5] mb-4">RSVP via Phone</p>
                <p className="text-2xl font-serif tracking-widest">
                  {housewarmingData.contactNumbers || content?.contact_info?.phone || 'No phone provided'}
                </p>
              </div>
            </motion.div>
          </section>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-[#1f2c22] py-8 text-center text-[#a4b49f]">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Crafted with love by Jaalam</p>
      </footer>

    </div>
  );
}
