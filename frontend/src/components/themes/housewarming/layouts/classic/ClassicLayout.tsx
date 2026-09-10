import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, CalendarDays, Clock, Home, Heart, Volume2, VolumeX, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { HousewarmingLayoutProps } from '../../../../themes/housewarming/layouts/traditional/TraditionalLayout';

export function ClassicLayout({ content }: { content: any }) {
  const [showOpening, setShowOpening] = useState(true);
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
    setShowOpening(false);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
  };

  const gallery = housewarmingData.gallery || [];

  return (
    <div className={`font-serif bg-[#fdfbf7] text-[#3e342f] min-h-screen selection:bg-[#cda776] selection:text-white ${showOpening ? 'max-h-screen overflow-hidden' : ''}`}>
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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3.5 rounded-full bg-white/90 backdrop-blur-md text-[#6c5b4e] shadow-xl border border-[#e6d5c3] hover:scale-105 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      )}

      {/* Opening Animation Component */}
      <AnimatePresence>
        {showOpening && (
          <motion.div
            key="opening"
            className="fixed inset-0 z-50 bg-[#f4ece1] flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleOpen}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)", transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
          >
            {/* Elegant Floral Background for Opening */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6c5b4e 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center z-10 p-10 border border-[#cda776]/40 shadow-2xl rounded-2xl max-w-sm w-full mx-4 relative bg-[#fdfbf7]"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#fdfbf7] px-4">
                <Home className="w-10 h-10 text-[#cda776]" />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-serif tracking-[0.2em] uppercase text-[#8a7b71] mb-4 text-xs font-bold mt-4"
              >
                You are invited to
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="font-serif text-3xl md:text-4xl text-[#3e342f] mb-3 leading-tight font-bold"
              >
                Our Housewarming
              </motion.h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="h-px w-16 bg-[#cda776] mx-auto my-5"
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="font-serif text-[#6c5b4e] italic text-lg"
              >
                {housewarmingData.hostName || 'The Family'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -5, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="mt-10 flex flex-col items-center justify-center text-[#cda776]"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Tap to Open</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e6d5c3] via-[#cda776] to-[#e6d5c3] z-40"></div>

      {/* Main Content */}
      <main className="pb-24">
        
        {/* HERO SECTION */}
        {isVisible('hero') && (
          <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#fdfbf7]">
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#3e342f 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative z-10 max-w-2xl mx-auto flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full border border-[#cda776]/50 flex items-center justify-center mb-8">
                 <Home className="w-8 h-8 text-[#cda776]" />
              </div>
              
              <p className="text-[#8a7b71] uppercase tracking-[0.25em] text-xs font-bold mb-4">
                {housewarmingData.tagline || 'Please join us in celebrating'}
              </p>
              
              <h1 className="text-4xl md:text-6xl font-serif text-[#3e342f] mb-6 font-bold leading-tight drop-shadow-sm">
                {housewarmingData.hostName || content?.hero_title || 'Our New Home'}
              </h1>
              
              <div className="flex items-center gap-4 my-6 opacity-60">
                <span className="w-12 h-px bg-[#cda776]"></span>
                <Sparkles className="w-4 h-4 text-[#cda776]" />
                <span className="w-12 h-px bg-[#cda776]"></span>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm border border-[#e6d5c3] p-8 rounded-2xl shadow-sm my-6 inline-block">
                <p className="text-[#cda776] uppercase tracking-[0.2em] font-bold text-sm mb-2">{dateInfo.month}</p>
                <div className="flex items-center gap-6 my-2">
                  <span className="text-[#8a7b71] font-medium tracking-widest text-sm">{dateInfo.weekday}</span>
                  <span className="text-4xl font-serif text-[#3e342f] border-x border-[#e6d5c3] px-6 py-2">{dateInfo.day}</span>
                  <span className="text-[#8a7b71] font-medium tracking-widest text-sm">{dateInfo.time}</span>
                </div>
                <p className="text-[#cda776] uppercase tracking-[0.2em] font-bold text-sm mt-2">{dateInfo.year}</p>
              </div>
              
            </motion.div>
          </section>
        )}

        {/* HOSTS SECTION */}
        {isVisible('hosts') && (
          <section id="hosts" className="py-20 px-6 bg-white relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-[#3e342f] mb-12 font-bold">The Hosts</h2>
              
              <div className="flex justify-center">
                <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-[#e6d5c3] shadow-sm max-w-md w-full hover:shadow-md transition-shadow">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 relative bg-[#f4ece1]">
                    {housewarmingData.hostPhoto ? (
                      <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#cda776]">
                        <Heart className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-[#3e342f] font-bold mb-2">{housewarmingData.hostName}</h3>
                  <p className="text-[#8a7b71] italic">We can't wait to welcome you to our new home.</p>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* DETAILS SECTION */}
        {isVisible('story') && content?.about_text && (
          <section id="story" className="py-24 px-6 bg-[#f4ece1] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#cda776]/30 to-transparent"></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-[#e6d5c3]"
            >
              <h2 className="text-3xl font-serif text-[#3e342f] mb-8 font-bold">{content.about_title || 'A New Chapter'}</h2>
              <p className="text-[#6c5b4e] leading-relaxed text-lg font-serif italic">"{content.about_text}"</p>
            </motion.div>
          </section>
        )}

        {/* SCHEDULE SECTION */}
        {isVisible('schedule') && (housewarmingData.schedule?.length > 0) && (
          <section id="schedule" className="py-20 px-6 bg-[#fdfbf7]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif text-[#3e342f] font-bold mb-4">Event Schedule</h2>
                <div className="w-16 h-px bg-[#cda776] mx-auto"></div>
              </div>
              
              <div className="space-y-6">
                {(housewarmingData.schedule || []).map((item: any, index: number) => (
                  <div key={index} className="flex flex-col md:flex-row bg-white p-6 rounded-2xl border border-[#e6d5c3] shadow-sm hover:shadow-md transition-shadow group">
                    <div className="md:w-1/3 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-[#e6d5c3] pb-4 md:pb-0 md:pr-6 mb-4 md:mb-0">
                      <div className="flex items-center text-[#cda776] mb-1">
                        <Clock size={16} className="mr-2" />
                        <span className="font-bold tracking-widest text-sm">{item.time}</span>
                      </div>
                      <span className="text-xs text-[#8a7b71] uppercase font-bold tracking-widest">{dateInfo.month} {dateInfo.day}</span>
                    </div>
                    <div className="md:w-2/3 md:pl-6 flex flex-col justify-center text-center md:text-left">
                      <h4 className="text-xl font-serif text-[#3e342f] font-bold mb-2 group-hover:text-[#cda776] transition-colors">{item.event}</h4>
                      <p className="text-[#6c5b4e] text-sm flex items-center justify-center md:justify-start">
                        <MapPin size={14} className="mr-1.5 opacity-70" />
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
          <section id="venue" className="py-20 px-6 bg-white border-t border-[#f4ece1]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif text-[#3e342f] font-bold mb-4">Location</h2>
                <div className="w-16 h-px bg-[#cda776] mx-auto"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#e6d5c3] shadow-sm bg-[#f4ece1]">
                    {housewarmingData.venuePhoto ? (
                      <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <Home className="w-20 h-20 text-[#3e342f]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-1 md:order-2 text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f4ece1] text-[#cda776] mb-6">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-2xl font-serif text-[#3e342f] font-bold mb-4">Our New Home</h3>
                  <p className="text-[#6c5b4e] mb-8 leading-relaxed">
                    {content?.contact_info?.address || housewarmingData.venue || '123 New Home Lane, City, State 12345'}
                  </p>
                  
                  {housewarmingData.mapUrl && (
                    <a 
                      href={housewarmingData.mapUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-[#3e342f] font-bold text-xs uppercase tracking-[0.15em] border border-[#cda776] px-8 py-4 rounded-full hover:bg-[#f4ece1] transition-colors shadow-sm"
                    >
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
          <section id="gallery" className="py-20 px-6 bg-[#fdfbf7]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif text-[#3e342f] font-bold mb-4">Gallery</h2>
                <div className="w-16 h-px bg-[#cda776] mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-[#e6d5c3] group bg-white">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* RSVP SECTION */}
        {isVisible('share') && (
          <section id="rsvp" className="py-24 px-6 bg-white border-t border-[#e6d5c3]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-16 h-16 bg-[#f4ece1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-[#cda776]" size={24} />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif text-[#3e342f] font-bold mb-6">Hope to see you!</h2>
              <p className="text-[#6c5b4e] mb-10 leading-relaxed font-serif italic text-lg">
                Please let us know if you can make it.
              </p>
              
              <div className="bg-[#fdfbf7] p-8 rounded-2xl border border-[#e6d5c3] shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#8a7b71] mb-2">Contact to RSVP</p>
                <p className="text-2xl font-serif text-[#3e342f]">
                  {housewarmingData.contactNumbers || content?.contact_info?.phone || 'No phone provided'}
                </p>
              </div>
            </motion.div>
          </section>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-[#f4ece1] py-10 text-center border-t border-[#e6d5c3]">
        <p className="text-[#8a7b71] font-serif mb-2">We can't wait to see you</p>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#cda776]">Made with Jaalam</p>
      </footer>

    </div>
  );
}
