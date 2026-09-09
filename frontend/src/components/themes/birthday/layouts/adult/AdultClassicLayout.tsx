import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, CalendarDays, Clock, Wine, Star } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function AdultClassicLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 40;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "William's";
  const age = content?.settings_json?.birthday?.age || "50";

  const story = content?.about_text || "Please join us for a classic evening of fine dining, excellent wine, and cherished memories as we celebrate a milestone birthday.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '50' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Celebrating ${dynamicAgeNumber} Years`;
  const subtitle = content?.hero_subtitle || "You are cordially invited to";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'December');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Grand Hotel, 100 Majesty Row";
  const venueName = location.split(',')[0] || "The Grand Hotel";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Arrival & Aperitifs", venue: venueName },
      { time: "8:00 PM", event: "Dinner Service", venue: venueName },
      { time: "9:30 PM", event: "Speeches & Toasts", venue: venueName },
      { time: "10:30 PM", event: "Music & Dancing", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-12-12T19:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "A Classic Celebration";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center p-0 min-h-screen bg-[#f8f9fa] text-[#1e293b] overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        
        {/* Navy & Gold border frame */}
        <div className="absolute inset-4 sm:inset-8 border-[1px] border-[#0f172a] pointer-events-none z-0"></div>
        <div className="absolute inset-5 sm:inset-9 border-[2px] border-[#d4af37] pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-3xl my-16 bg-white/90 backdrop-blur-sm border border-[#e2e8f0] shadow-2xl mx-4 py-20 px-8 sm:px-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center w-full relative"
          >
            <div className="text-[#d4af37] mb-8">
              <Star size={32} fill="#d4af37" strokeWidth={0} className="inline-block" />
            </div>
            
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#64748b] font-medium mb-6">{subtitle}</span>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#0f172a] tracking-wide my-4 leading-tight">
              {name}
            </h1>
            
            <div className="flex items-center gap-4 my-8 w-full justify-center">
              <div className="h-px bg-[#d4af37] w-16"></div>
              <span className="font-serif italic text-2xl sm:text-3xl text-[#0f172a]">{storyTitle}</span>
              <div className="h-px bg-[#d4af37] w-16"></div>
            </div>

            <div className="flex flex-col items-center space-y-4 text-[#475569] font-sans text-sm uppercase tracking-[0.2em] mt-4 font-medium">
              <span>{monthStr} {dayNum}</span>
              <div className="w-1 h-1 rounded-full bg-[#d4af37]"></div>
              <span>{timeStr}</span>
              <div className="w-1 h-1 rounded-full bg-[#d4af37]"></div>
              <span>{venueName}</span>
            </div>
          </motion.div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#1e293b] border-t border-[#e2e8f0]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-md mx-auto relative group">
            {/* Double classic border */}
            <div className="absolute -inset-3 border border-[#0f172a]"></div>
            <div className="absolute -inset-2 border border-[#d4af37]"></div>
            <div className="relative aspect-[3/4] overflow-hidden bg-[#f1f5f9]">
              <img src={mainPhoto} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100" alt="Birthday Celebrant" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#0f172a] mb-8 leading-tight">
              {quoteText}
            </h2>
            <div className="w-16 h-px bg-[#d4af37] mb-8"></div>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-serif font-light">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0f172a] text-[#f8f9fa]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#d4af37] mb-6">Program of Events</h2>
            <div className="w-24 h-[2px] bg-[#d4af37] mx-auto opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="flex flex-col border-b border-[#334155] pb-6">
                <span className="text-[#d4af37] text-sm font-sans uppercase tracking-[0.2em] font-semibold mb-2">{item.time}</span>
                <h3 className="text-2xl font-serif text-white">{item.event}</h3>
                {item.venue && item.venue !== venueName && (
                  <span className="text-[#94a3b8] text-sm mt-2 italic font-serif">{item.venue}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f8f9fa] text-[#1e293b]">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 bg-white p-16 sm:p-24 border border-[#e2e8f0] shadow-sm">
           
           <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-8 border border-[#cbd5e1]">
             <MapPin size={20} className="text-[#0f172a]" strokeWidth={1.5} />
           </div>
           
           <h2 className="text-4xl sm:text-5xl font-serif text-[#0f172a] mb-6">
             {venueName}
           </h2>
           
           <p className="text-base text-[#475569] font-sans mb-10 max-w-md tracking-wide">
             {location}
           </p>
           
           {mapUrl && (
             <a
               href={mapUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-block border border-[#0f172a] text-[#0f172a] font-sans text-xs uppercase tracking-[0.2em] font-semibold px-12 py-4 hover:bg-[#0f172a] hover:text-white transition-colors duration-300"
             >
               Directions
             </a>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#1e293b] border-t border-[#e2e8f0]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#0f172a] mb-6">Gallery</h2>
            <div className="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="relative aspect-square overflow-hidden border-4 border-white shadow-md group"
              >
                <div className="absolute inset-0 bg-[#0f172a]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0f172a] text-[#f8f9fa]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <h2 className="text-3xl sm:text-4xl font-serif text-[#d4af37] mb-16 italic">
            The celebration approaches...
          </h2>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-24 sm:w-32">
                <div className="w-full aspect-square border border-[#334155] bg-[#1e293b] flex items-center justify-center mb-4 rounded-sm shadow-inner">
                  <span className="text-4xl sm:text-5xl font-serif text-white font-light">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#94a3b8] font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#1e293b] border-b border-[#e2e8f0]">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-serif text-[#0f172a] mb-12">
            Guest Book
          </h2>
          
          <div className="border border-[#cbd5e1] p-12 sm:p-20 relative text-center flex flex-col items-center bg-[#f8f9fa] shadow-sm">
            <Wine className="text-[#0f172a] w-10 h-10 mb-8 opacity-80" strokeWidth={1} />
            
            <p className="text-lg font-serif italic text-[#475569] leading-relaxed mb-12 max-w-md">
              "A word of advice, a cherished memory, or simply a toast. Please sign our guest book."
            </p>
            
            <div className="flex items-center gap-8 mb-12">
              <div className="w-16 h-px bg-[#cbd5e1]"></div>
              <span className="text-4xl font-serif text-[#0f172a]">{wishCount}</span>
              <div className="w-16 h-px bg-[#cbd5e1]"></div>
            </div>
            
            <span className="text-[#64748b] font-sans text-xs uppercase tracking-[0.2em] font-semibold mb-12">Signatures</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-[#0f172a] text-white px-10 py-4 text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#1e293b] transition-colors duration-300"
            >
              Sign Book
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f8f9fa] text-[#1e293b]">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#0f172a] mb-6">
              Répondez s'il vous plaît
            </h2>
            <div className="w-12 h-1 bg-[#d4af37] mx-auto"></div>
          </div>

          <div className="bg-white p-10 sm:p-16 border border-[#e2e8f0] shadow-md relative">
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#0f172a]"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#0f172a]"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#0f172a]"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#0f172a]"></div>

            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#64748b] font-semibold mb-2">M.</label>
                <input type="text" className="w-full bg-transparent border-b border-[#cbd5e1] pb-3 outline-none focus:border-[#0f172a] transition-colors text-[#0f172a] font-serif text-lg" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#64748b] font-semibold mb-2">Dietary Restrictions</label>
                <input type="text" className="w-full bg-transparent border-b border-[#cbd5e1] pb-3 outline-none focus:border-[#0f172a] transition-colors text-[#0f172a] font-serif text-lg" />
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors w-full group">
                    <input type="radio" name="attending" className="accent-[#0f172a] w-4 h-4" />
                    <span className="text-sm text-[#334155] font-serif italic">Accepts with pleasure</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors w-full group">
                    <input type="radio" name="attending" className="accent-[#0f172a] w-4 h-4" />
                    <span className="text-sm text-[#334155] font-serif italic">Declines with regret</span>
                  </label>
                </div>
              </div>

              <div className="pt-10 text-center">
                <button type="button" className="bg-[#0f172a] text-white text-xs font-sans uppercase tracking-[0.2em] font-semibold py-5 px-16 hover:bg-[#1e293b] transition-colors duration-300">
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
    <div className={`min-h-screen bg-[#f8f9fa] relative text-[#1e293b] font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-white border border-[#cbd5e1] rounded-full flex items-center justify-center text-[#64748b] hover:border-[#0f172a] hover:text-[#0f172a] transition-all shadow-md"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
        </button>
      )}

      {/* Entrance Animation: Classic Envelope */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="classic-envelope"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#0f172a]"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Subtle texture for envelope */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay"></div>
            
            <div className="relative z-10 w-full max-w-lg aspect-[4/3] flex items-center justify-center perspective-1000">
              
              <motion.div 
                className="absolute inset-0 bg-[#1e293b] shadow-2xl rounded-sm border border-[#334155]"
                initial={{ rotateX: 0 }}
                animate={isOpening ? { rotateX: 180, opacity: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
              >
                {/* Envelope flap detail */}
                <div className="absolute top-0 w-full h-full border-t border-[#334155] bg-[#0f172a]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }}></div>
                
                {/* Gold Wax Seal */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-[#d4af37] rounded-full shadow-lg flex flex-col items-center justify-center border-[2px] border-[#b49020] cursor-pointer hover:scale-105 transition-transform z-20"
                  style={{
                    background: 'radial-gradient(ellipse at center, #f3da7a 0%, #d4af37 60%, #b49020 100%)'
                  }}
                  animate={isOpening ? { scale: 0, opacity: 0 } : {}}
                >
                  <span className="text-[#0f172a] font-serif text-4xl sm:text-5xl opacity-80 drop-shadow-sm font-bold">
                    {dynamicAgeNumber}
                  </span>
                </motion.div>
                
                {!isOpening && (
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 w-full text-center text-[#94a3b8] text-[10px] uppercase tracking-widest font-sans font-semibold"
                  >
                    Tap to Open
                  </motion.div>
                )}
              </motion.div>

              {/* Back of Envelope (Inside) showing the edge of the card */}
              <div className="absolute inset-0 bg-[#f8f9fa] -z-10 shadow-inner rounded-sm border border-[#e2e8f0]">
                {/* The top edge of the invitation card */}
                <div className="absolute top-4 left-4 right-4 h-20 bg-white border border-[#e2e8f0]"></div>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      {isOpened && (
        <footer className="py-16 relative z-10 text-center bg-[#0f172a] text-[#64748b] w-full">
          <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-sans font-semibold">A Classic Event for {name}</span>
        </footer>
      )}

    </div>
  );
}
