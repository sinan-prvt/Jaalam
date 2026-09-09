import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, CalendarDays, Clock, GlassWater, Diamond } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function AdultElegantLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 45;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Eleanor's";
  const age = content?.settings_json?.birthday?.age || "60";

  const story = content?.about_text || "You are cordially invited to an evening of elegance and celebration to mark a truly special milestone.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '60' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `The ${dynamicAgeNumber}th Celebration`;
  const subtitle = content?.hero_subtitle || "Join us for an elegant evening";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Friday, September 18, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'September');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '18');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '7:30 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Sapphire Room, 500 Prestige Way";
  const venueName = location.split(',')[0] || "The Sapphire Room";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:30 PM", event: "Champagne Reception", venue: venueName },
      { time: "8:30 PM", event: "Gala Dinner", venue: venueName },
      { time: "10:00 PM", event: "Toasts & Cake", venue: venueName },
      { time: "10:30 PM", event: "Live Band & Dancing", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-09-18T19:30";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "An Evening of Elegance";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    if (!countdownDate) return;
    const target = new Date(countdownDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownDate]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    triggerConfettiPopper(); 
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1500); 
  };

  if (!mounted) return null;

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'story', label: 'Details', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Location', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  const sections = content?.settings_json?.birthday?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center p-0 min-h-screen bg-[#2c1e16] text-[#f7e7ce] overflow-hidden font-serif">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        
        {/* Elegant glowing orb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-[#d4af37]/20 to-transparent rounded-full blur-[120px] pointer-events-none opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-4xl border border-[#d4af37]/20 bg-[#2c1e16]/80 backdrop-blur-md shadow-2xl mx-4 my-16 py-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center w-full relative"
          >
            <Diamond className="text-[#d4af37] mb-10 opacity-70" size={24} strokeWidth={1} />
            
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#bda88a] font-sans font-light mb-8 text-center px-4 leading-loose">{subtitle}</span>
            
            <h1 className="text-6xl sm:text-7xl md:text-[5.5rem] text-[#f7e7ce] tracking-wide mb-6 leading-none text-center">
              {name}
            </h1>
            
            <div className="flex items-center gap-6 my-10 w-full justify-center px-8">
              <div className="h-px bg-gradient-to-r from-transparent to-[#d4af37] flex-1 max-w-[150px] opacity-50"></div>
              <span className="italic text-2xl sm:text-3xl text-[#d4af37] font-light">{storyTitle}</span>
              <div className="h-px bg-gradient-to-l from-transparent to-[#d4af37] flex-1 max-w-[150px] opacity-50"></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-16 text-[#bda88a] font-sans text-xs uppercase tracking-[0.2em] font-light mt-4">
              <span>{monthStr} {dayNum}</span>
              <div className="w-1 h-1 rotate-45 bg-[#d4af37] opacity-50 hidden sm:block"></div>
              <span>{timeStr}</span>
              <div className="w-1 h-1 rotate-45 bg-[#d4af37] opacity-50 hidden sm:block"></div>
              <span>{venueName}</span>
            </div>
          </motion.div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-[#1e140f] text-[#f7e7ce] border-t border-[#d4af37]/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-lg mx-auto relative group">
            <div className="absolute inset-4 sm:inset-6 border border-[#d4af37]/30 z-20 pointer-events-none transition-all duration-700 group-hover:inset-2"></div>
            <div className="relative aspect-[3/4] overflow-hidden bg-[#2c1e16]">
              <img src={mainPhoto} className="w-full h-full object-cover opacity-80 mix-blend-luminosity transform transition-transform duration-1000 group-hover:scale-105 group-hover:mix-blend-normal group-hover:opacity-100" alt="Birthday Celebrant" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:pl-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-sans mb-6">A Milestone</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] mb-8 leading-tight italic font-light">
              {quoteText}
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-10 mx-auto md:mx-0"></div>
            <p className="text-lg text-[#bda88a] leading-relaxed font-light max-w-lg font-serif">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#2c1e16] text-[#f7e7ce]">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-sans mb-4 block">The Evening</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] font-light">Order of Events</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-10 opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="flex flex-col border-b border-[#d4af37]/10 pb-6 group">
                <span className="text-[#d4af37] text-sm font-sans uppercase tracking-[0.3em] font-light mb-3 block">{item.time}</span>
                <h3 className="text-3xl font-serif text-[#f7e7ce] font-light group-hover:text-[#d4af37] transition-colors">{item.event}</h3>
                {item.venue && item.venue !== venueName && (
                  <span className="text-[#bda88a] text-sm mt-3 italic font-serif opacity-80">{item.venue}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#1e140f] text-[#f7e7ce] border-y border-[#d4af37]/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
           
           <Diamond size={20} className="text-[#d4af37] mb-8 opacity-70" strokeWidth={1} />
           <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-sans mb-4 block">Location</span>
           <h2 className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] mb-8 font-light">
             {venueName}
           </h2>
           <p className="text-lg text-[#bda88a] font-serif font-light mb-12 max-w-md">
             {location}
           </p>
           
           {mapUrl && (
             <div className="w-full max-w-3xl aspect-[21/9] border border-[#d4af37]/20 relative overflow-hidden mb-12 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x0%3A0x0!2zM!3zM!4v1600000000000!5m2!1sen!2sus" 
                 className="absolute inset-0 w-full h-full"
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
               ></iframe>
             </div>
           )}

           {mapUrl && (
             <a
               href={mapUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 text-[#d4af37] font-sans text-xs uppercase tracking-[0.3em] font-light border-b border-[#d4af37]/50 pb-2 hover:border-[#d4af37] transition-all"
             >
               <MapPin size={14} /> Get Directions
             </a>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#2c1e16] text-[#f7e7ce]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] font-light mb-6">A Look Back</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto opacity-50"></div>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="break-inside-avoid relative overflow-hidden border border-[#d4af37]/10 group p-2 bg-[#1e140f]"
              >
                <div className="relative overflow-hidden w-full h-full">
                  <div className="absolute inset-0 bg-[#2c1e16]/40 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                  <img 
                    src={url} 
                    alt={`Gallery ${index}`} 
                    className="w-full h-auto object-cover transform transition-all duration-1000 group-hover:scale-105" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#1e140f] text-[#f7e7ce] border-y border-[#d4af37]/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <h2 className="text-3xl sm:text-4xl font-serif text-[#f7e7ce] mb-16 font-light italic">
            Counting the moments...
          </h2>

          <div className="flex flex-wrap justify-center gap-10 sm:gap-20 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl font-serif text-[#d4af37] mb-6 font-light">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-sans uppercase text-[#bda88a] tracking-[0.4em] font-light">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#2c1e16] text-[#f7e7ce]">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-sans mb-4 block">Guest Book</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] mb-16 font-light">
            Words of Love
          </h2>
          
          <div className="border border-[#d4af37]/20 p-12 sm:p-24 relative text-center flex flex-col items-center bg-[#1e140f]/50 backdrop-blur-sm">
            <GlassWater className="text-[#d4af37] w-12 h-12 mb-10 opacity-70" strokeWidth={1} />
            
            <p className="text-lg font-light text-[#bda88a] leading-relaxed mb-16 font-serif italic max-w-md">
              "We would be honored if you would sign the guest book with a message, memory, or toast."
            </p>
            
            <div className="flex items-center gap-8 mb-16 w-full justify-center">
              <div className="h-px bg-gradient-to-r from-transparent to-[#d4af37] flex-1 max-w-[100px] opacity-30"></div>
              <span className="text-5xl font-serif text-[#f7e7ce] font-light">{wishCount}</span>
              <div className="h-px bg-gradient-to-l from-transparent to-[#d4af37] flex-1 max-w-[100px] opacity-30"></div>
            </div>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-transparent text-[#d4af37] border border-[#d4af37]/50 px-12 py-5 text-[10px] font-sans uppercase tracking-[0.3em] font-light hover:bg-[#d4af37] hover:text-[#2c1e16] transition-all duration-500"
            >
              Sign Book
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#1e140f] text-[#f7e7ce] border-t border-[#d4af37]/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] mb-6 font-light">
              RSVP
            </h2>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-sans block">Kindly Respond</span>
          </div>

          <div className="p-8 sm:p-16 border border-[#d4af37]/20 relative bg-[#2c1e16]/80 backdrop-blur-md">
            {/* Elegant corner accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#d4af37]/50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#d4af37]/50"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#d4af37]/50"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#d4af37]/50"></div>

            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#d4af37]/30 pb-4 outline-none focus:border-[#d4af37] transition-all duration-500 text-[#f7e7ce] placeholder-[#bda88a]/50 font-serif text-xl italic" placeholder="M..............................................." />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#d4af37]/30 pb-4 outline-none focus:border-[#d4af37] transition-all duration-500 text-[#f7e7ce] placeholder-[#bda88a]/50 font-serif text-xl italic resize-none" placeholder="Dietary restrictions or notes..."></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-5 border border-[#d4af37]/30 bg-transparent hover:bg-[#d4af37]/5 transition-all duration-500 flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#d4af37] grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-sm text-[#f7e7ce] font-sans font-light tracking-[0.1em] uppercase">Accepts</span>
                  </label>
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-5 border border-[#d4af37]/30 bg-transparent hover:bg-[#d4af37]/5 transition-all duration-500 flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#d4af37] grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-sm text-[#f7e7ce] font-sans font-light tracking-[0.1em] uppercase">Declines</span>
                  </label>
                </div>
              </div>

              <div className="pt-10 text-center">
                <button type="button" className="w-full bg-[#d4af37] text-[#2c1e16] text-[10px] font-sans uppercase tracking-[0.4em] py-6 hover:bg-[#bda88a] transition-colors duration-300">
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#2c1e16] relative text-[#f7e7ce] font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-transparent border border-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-500 backdrop-blur-md"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
        </button>
      )}

      {/* Entrance Animation: Elegant Envelope/Seal */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="elegant-reveal"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#1e140f]"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Soft background texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
            
            <motion.div
              animate={isOpening ? { y: -50, opacity: 0, scale: 1.1 } : { y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Elegant Geometric Frame */}
              <div className="relative w-64 h-80 sm:w-80 sm:h-96 flex flex-col items-center justify-center">
                <div className="absolute inset-0 border border-[#d4af37]/30 rotate-45 transform scale-75 hidden sm:block"></div>
                <div className="absolute inset-0 border border-[#d4af37]/20 bg-[#2c1e16] shadow-2xl flex flex-col items-center justify-center p-8 text-center">
                  <Diamond size={32} className="text-[#d4af37] mb-8" strokeWidth={0.5} />
                  
                  <span className="text-4xl sm:text-5xl font-serif text-[#f7e7ce] font-light mb-4 italic">
                    {dynamicAgeNumber}
                  </span>
                  
                  <div className="w-12 h-px bg-[#d4af37] my-6"></div>
                  
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#d4af37] font-sans">
                    You're Invited
                  </span>
                </div>
              </div>
              
              {!isOpening && (
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-16 text-[#bda88a] text-[9px] font-sans uppercase tracking-[0.4em] font-light"
                >
                  Click to open
                </motion.div>
              )}
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      {isOpened && (
        <footer className="py-20 relative z-10 text-center bg-[#1e140f] text-[#bda88a] w-full border-t border-[#d4af37]/10">
          <span className="relative z-10 text-[9px] uppercase tracking-[0.5em] font-sans font-light">An elegant celebration for {name}</span>
        </footer>
      )}

    </div>
  );
}
