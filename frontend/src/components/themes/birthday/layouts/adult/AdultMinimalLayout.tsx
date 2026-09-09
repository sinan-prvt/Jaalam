import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, ArrowDown, ChevronDown } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function AdultMinimalLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 20;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Sophia";
  const age = content?.settings_json?.birthday?.age || "35";

  const story = content?.about_text || "A simple gathering to celebrate good health, great friends, and another year around the sun.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '35' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Turning ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You're Invited";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, August 22, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Aug');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '22');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '6:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Minimalist Space, 12 Blank Canvas St";
  const venueName = location.split(',')[0] || "The Minimalist Space";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "18:00", event: "Drinks", venue: venueName },
      { time: "19:30", event: "Dinner", venue: venueName },
      { time: "21:00", event: "Dessert & Music", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-08-22T18:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "Less is more.";

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
    }, 1000); 
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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center p-0 min-h-screen bg-[#faf9f6] text-[#2c2c2a] font-sans">
        <div className="relative z-10 flex flex-col justify-center w-full max-w-4xl px-8 sm:px-12 py-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center w-full relative"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] mb-12 block font-light">
              {subtitle}
            </span>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-light text-[#2c2c2a] tracking-tight mb-8">
              {name}
            </h1>
            
            <div className="text-lg text-[#8a8984] font-light mb-12">
              <span className="inline-block px-4">{monthStr} {dayNum}</span>
              <span className="inline-block px-4 border-l border-[#e0dfdc]">{timeStr}</span>
              <span className="inline-block px-4 border-l border-[#e0dfdc]">{venueName}</span>
            </div>
            
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 text-[#b5b4af]"
        >
          <ChevronDown size={24} strokeWidth={1} />
        </motion.div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#2c2c2a] font-sans">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          
          <h2 className="text-3xl sm:text-4xl font-light text-[#2c2c2a] mb-10 leading-tight">
            {quoteText}
          </h2>
          <div className="w-8 h-px bg-[#e0dfdc] mb-10"></div>
          <p className="text-lg sm:text-xl text-[#8a8984] leading-relaxed font-light max-w-2xl">
            {story}
          </p>
          
          <div className="mt-20 w-full max-w-2xl mx-auto relative group">
            <div className="aspect-[16/9] overflow-hidden bg-[#faf9f6]">
              <img src={mainPhoto} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100" alt="Birthday Celebrant" />
            </div>
          </div>

        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#faf9f6] text-[#2c2c2a] font-sans">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-20 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] font-light">Itinerary</span>
          </div>

          <div className="flex flex-col space-y-12">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-baseline gap-4 sm:gap-12 border-b border-[#e0dfdc] pb-8">
                <span className="text-[#8a8984] text-lg font-light w-24 shrink-0">{item.time}</span>
                <div>
                  <h3 className="text-2xl font-light text-[#2c2c2a]">{item.event}</h3>
                  {item.venue && item.venue !== venueName && (
                    <span className="text-[#b5b4af] text-sm mt-1 block font-light">{item.venue}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#2c2c2a] font-sans">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">
           
           <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] font-light mb-10 block">Location</span>
           <h2 className="text-3xl sm:text-4xl font-light text-[#2c2c2a] mb-8">
             {venueName}
           </h2>
           <p className="text-lg text-[#8a8984] font-light mb-16 max-w-md leading-relaxed">
             {location}
           </p>
           
           {mapUrl && (
             <a
               href={mapUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 text-[#2c2c2a] font-light text-sm hover:text-[#8a8984] transition-colors border-b border-[#2c2c2a] pb-1 hover:border-[#8a8984]"
             >
               View on Map <ArrowDown size={14} className="-rotate-90" />
             </a>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#faf9f6] text-[#2c2c2a] font-sans">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] font-light">Gallery</span>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="relative break-inside-avoid overflow-hidden bg-[#e0dfdc] group"
              >
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-auto object-cover grayscale opacity-90 transition-all duration-700 group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:opacity-100" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#2c2c2a] font-sans">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] font-light mb-16 block">Time Remaining</span>

          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-5xl sm:text-6xl font-light text-[#2c2c2a] mb-4">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8984] font-light">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#faf9f6] text-[#2c2c2a] font-sans">
        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] font-light mb-10 block">Notes</span>
          
          <p className="text-lg font-light text-[#8a8984] leading-relaxed mb-16">
            Leave a simple message or memory.
          </p>
          
          <div className="flex items-center gap-6 mb-16 justify-center">
            <span className="text-4xl font-light text-[#2c2c2a]">{wishCount}</span>
            <span className="text-[#b5b4af] text-sm font-light">Messages left</span>
          </div>
          
          <button 
            onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
            className="text-[#2c2c2a] text-xs uppercase tracking-[0.2em] font-light border-b border-[#2c2c2a] pb-1 hover:text-[#8a8984] hover:border-[#8a8984] transition-colors"
          >
            Add Yours
          </button>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#2c2c2a] font-sans">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8a8984] font-light block mb-4">Attendance</span>
            <h2 className="text-3xl font-light text-[#2c2c2a]">
              RSVP
            </h2>
          </div>

          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#e0dfdc] pb-4 outline-none focus:border-[#2c2c2a] transition-colors text-[#2c2c2a] font-light text-lg placeholder-[#b5b4af]" placeholder="Name" />
            </div>

            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#e0dfdc] pb-4 outline-none focus:border-[#2c2c2a] transition-colors text-[#2c2c2a] font-light text-lg placeholder-[#b5b4af]" placeholder="Dietary Notes (Optional)" />
            </div>

            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center justify-center p-4 border border-[#e0dfdc] cursor-pointer hover:bg-[#faf9f6] transition-colors flex-1 has-[:checked]:border-[#2c2c2a] has-[:checked]:bg-[#faf9f6]">
                  <input type="radio" name="attending" className="hidden" />
                  <span className="text-sm font-light text-[#2c2c2a]">Accept</span>
                </label>
                <label className="flex items-center justify-center p-4 border border-[#e0dfdc] cursor-pointer hover:bg-[#faf9f6] transition-colors flex-1 has-[:checked]:border-[#2c2c2a] has-[:checked]:bg-[#faf9f6]">
                  <input type="radio" name="attending" className="hidden" />
                  <span className="text-sm font-light text-[#2c2c2a]">Decline</span>
                </label>
              </div>
            </div>

            <div className="pt-8 text-center">
              <button type="button" className="bg-[#2c2c2a] text-white text-xs uppercase tracking-[0.2em] font-light py-4 px-12 hover:bg-[#525251] transition-colors">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#faf9f6] relative text-[#2c2c2a] font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-10 h-10 bg-transparent border border-[#e0dfdc] rounded-full flex items-center justify-center text-[#8a8984] hover:text-[#2c2c2a] hover:border-[#2c2c2a] transition-colors"
        >
          {isMuted ? <VolumeX size={16} strokeWidth={1} /> : <Volume2 size={16} strokeWidth={1} />}
        </button>
      )}

      {/* Entrance Animation: Gentle Fade */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="minimal-reveal"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer bg-[#faf9f6]"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              animate={isOpening ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-6xl sm:text-8xl font-light text-[#2c2c2a] tracking-tighter mb-4">
                {dynamicAgeNumber}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a8984] font-light">
                {name}
              </span>
              
              {!isOpening && (
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-16 text-[#b5b4af] text-[9px] uppercase tracking-[0.2em] font-light"
                >
                  Enter
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
        <footer className="py-12 relative z-10 text-center bg-white text-[#b5b4af] w-full border-t border-[#e0dfdc]">
          <span className="relative z-10 text-[9px] uppercase tracking-[0.3em] font-light">{name}</span>
        </footer>
      )}

    </div>
  );
}
