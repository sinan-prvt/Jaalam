import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, CalendarDays, Clock, GlassWater, Sparkles, ChevronDown } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function AdultNoirLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 30;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Alexander";
  const age = content?.settings_json?.birthday?.age || "30";

  const story = content?.about_text || "Join us for an evening of sophisticated celebration, fine drinks, and exceptional company as we toast to a new chapter.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '30' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Chapter ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You are invited to celebrate";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, November 14, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'November');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '14');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Velvet Lounge, 45 Nightshade Blvd";
  const venueName = location.split(',')[0] || "The Velvet Lounge";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Cocktail Reception", venue: venueName },
      { time: "9:00 PM", event: "Intimate Dinner", venue: venueName },
      { time: "11:00 PM", event: "Midnight Toast", venue: venueName },
      { time: "11:30 PM", event: "After Hours", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1574360741695-18db0c7e0cce?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-11-14T20:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "Aged to Perfection";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center p-0 min-h-screen bg-[#070707] text-white overflow-hidden">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
        
        {/* Soft elegant gradient mesh */}
        <div className="absolute top-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-b from-[#1a1a1a] to-transparent rounded-full blur-[100px] opacity-60 transform -translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-2xl my-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center w-full relative"
          >
            <span className="text-xs uppercase tracking-[0.5em] text-[#888] font-light mb-8">{subtitle}</span>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif text-[#e5e5e5] tracking-widest my-2 uppercase font-light leading-none">
              {name}
            </h1>
            
            <div className="flex items-center gap-6 my-10 w-full justify-center opacity-50">
              <div className="h-px bg-gradient-to-r from-transparent to-[#ccc] flex-1 max-w-[100px]"></div>
              <span className="font-serif italic text-2xl text-[#ccc]">{storyTitle}</span>
              <div className="h-px bg-gradient-to-l from-transparent to-[#ccc] flex-1 max-w-[100px]"></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-12 text-[#a0a0a0] font-sans text-sm uppercase tracking-widest mt-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#555] mb-2">Date</span>
                <span className="text-white">{monthStr} {dayNum}</span>
              </div>
              <div className="w-px h-8 bg-[#333] hidden sm:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#555] mb-2">Time</span>
                <span className="text-white">{timeStr}</span>
              </div>
              <div className="w-px h-8 bg-[#333] hidden sm:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#555] mb-2">Location</span>
                <span className="text-white">{venueName}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 text-[#555]"
        >
          <ChevronDown size={24} strokeWidth={1} />
        </motion.div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0c0c0c] text-[#d0d0d0] border-t border-[#1a1a1a]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-md mx-auto relative group">
            <div className="relative aspect-[3/4] overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000 border border-[#222]">
              <img src={mainPhoto} className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000" alt="Birthday Celebrant" />
            </div>
            {/* Elegant framing line */}
            <div className="absolute -inset-4 border border-[#333] pointer-events-none transition-all duration-700 group-hover:-inset-2 group-hover:border-[#555]"></div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pl-0 md:pl-12">
            <span className="text-xs uppercase tracking-[0.4em] text-[#666] mb-6">The Occasion</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#fff] mb-10 leading-tight italic font-light">
              &quot;{quoteText}&quot;
            </h2>
            <div className="w-12 h-px bg-[#444] mb-10"></div>
            <p className="text-sm sm:text-base text-[#888] leading-loose font-sans font-light tracking-wide max-w-lg">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#070707] text-[#e0e0e0]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-xs uppercase tracking-[0.4em] text-[#666] mb-4 block">The Evening</span>
            <h2 className="text-4xl font-serif text-[#fff] font-light tracking-widest uppercase">Itinerary</h2>
          </div>

          <div className="flex flex-col relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#333] before:to-transparent">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="relative flex items-center justify-between w-full mb-12 last:mb-0 group">
                {/* Center Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#555] bg-[#070707] transition-all duration-500 group-hover:bg-[#fff] group-hover:border-[#fff] z-10"></div>
                
                {/* Left Side (Time) */}
                <div className="w-1/2 pr-12 text-right">
                  <span className="text-[#888] text-xs font-sans uppercase tracking-[0.2em]">{item.time}</span>
                </div>

                {/* Right Side (Event) */}
                <div className="w-1/2 pl-12 text-left">
                  <h3 className="text-xl font-serif text-[#d0d0d0] font-light italic group-hover:text-white transition-colors duration-300">{item.event}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0c0c0c] text-[#d0d0d0] border-y border-[#1a1a1a]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
           
           <span className="text-xs uppercase tracking-[0.4em] text-[#666] mb-6 block">Location</span>
           <h2 className="text-4xl sm:text-5xl font-serif text-[#fff] mb-6 tracking-widest uppercase font-light leading-tight">
             {venueName}
           </h2>
           <p className="text-sm text-[#888] font-sans font-light mb-12 max-w-md tracking-wide leading-relaxed">
             {location}
           </p>
           
           {mapUrl && (
             <div className="w-full max-w-2xl aspect-video bg-[#111] border border-[#222] relative overflow-hidden mb-12 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
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
               className="inline-flex items-center gap-3 border border-[#333] text-[#a0a0a0] font-sans text-xs uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#fff] hover:text-[#000] hover:border-[#fff] transition-all duration-500"
             >
               <MapPin size={14} /> Open Maps
             </a>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#070707] text-[#d0d0d0]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif text-[#fff] tracking-widest uppercase font-light">Gallery</h2>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="break-inside-avoid relative overflow-hidden border border-[#222] group"
              >
                <div className="absolute inset-0 bg-[#000]/40 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-auto object-cover grayscale contrast-125 transform transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0c0c0c] text-[#d0d0d0] border-y border-[#1a1a1a]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <span className="text-xs uppercase tracking-[0.4em] text-[#666] mb-12 block">Anticipation</span>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[80px]">
                <span className="text-5xl sm:text-7xl font-serif text-[#fff] mb-4 font-light tracking-tighter">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-sans uppercase text-[#555] tracking-[0.3em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#070707] text-[#d0d0d0]">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-[#666] mb-6 block">Guest Book</span>
          <h2 className="text-4xl font-serif text-[#fff] mb-16 tracking-widest uppercase font-light">
            Leave a Note
          </h2>
          
          <div className="border border-[#222] p-12 sm:p-20 relative text-center flex flex-col items-center bg-[#0a0a0a]">
            <GlassWater className="text-[#444] w-10 h-10 mb-10" strokeWidth={1} />
            
            <p className="text-sm font-light text-[#888] leading-relaxed mb-16 font-sans tracking-wide max-w-md">
              Raise a glass and leave a message. Your words are the perfect pairing for this occasion.
            </p>
            
            <div className="flex items-center gap-8 mb-12 w-full justify-center opacity-70">
              <div className="h-px bg-gradient-to-r from-transparent to-[#444] flex-1 max-w-[80px]"></div>
              <span className="text-5xl font-serif text-[#fff] font-light">{wishCount}</span>
              <div className="h-px bg-gradient-to-l from-transparent to-[#444] flex-1 max-w-[80px]"></div>
            </div>
            
            <span className="text-[#555] font-sans text-[9px] uppercase tracking-[0.3em] mb-12">Messages Received</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-transparent text-[#a0a0a0] border border-[#333] px-12 py-4 text-xs font-sans uppercase tracking-[0.2em] hover:bg-[#fff] hover:text-[#000] hover:border-[#fff] transition-all duration-500"
            >
              Write Message
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0c0c0c] text-[#d0d0d0] border-t border-[#1a1a1a]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] mix-blend-overlay"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.4em] text-[#666] mb-6 block">Attendance</span>
            <h2 className="text-4xl font-serif text-[#fff] tracking-widest uppercase font-light">
              RSVP
            </h2>
          </div>

          <div className="bg-[#0a0a0a] p-10 sm:p-16 border border-[#222]">
            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#333] pb-4 outline-none focus:border-[#fff] transition-all duration-500 text-[#fff] placeholder-[#555] font-sans text-sm tracking-widest uppercase rounded-none" placeholder="Guest Name(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#333] pb-4 outline-none focus:border-[#fff] transition-all duration-500 text-[#fff] placeholder-[#555] font-sans text-sm tracking-widest uppercase resize-none rounded-none" placeholder="Dietary Notes"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#333] bg-transparent hover:border-[#888] transition-all duration-500 flex-1 has-[:checked]:border-[#fff] has-[:checked]:bg-[#fff] group">
                    <input type="radio" name="attending" className="hidden" />
                    <span className="text-[10px] text-[#888] font-sans tracking-[0.2em] uppercase group-has-[:checked]:text-[#000]">Accepts</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#333] bg-transparent hover:border-[#888] transition-all duration-500 flex-1 has-[:checked]:border-[#555] has-[:checked]:bg-[#111] group">
                    <input type="radio" name="attending" className="hidden" />
                    <span className="text-[10px] text-[#888] font-sans tracking-[0.2em] uppercase group-has-[:checked]:text-[#555]">Declines</span>
                  </label>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="w-full bg-[#fff] text-[#000] text-xs font-sans uppercase tracking-[0.3em] py-5 hover:bg-[#d0d0d0] transition-colors duration-300">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#070707] relative text-[#e0e0e0] font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-transparent border border-[#333] rounded-full flex items-center justify-center text-[#888] hover:border-[#fff] hover:text-[#fff] transition-all duration-500 bg-[#070707]/50 backdrop-blur-md"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
        </button>
      )}

      {/* Entrance Animation: Noir Spotlight / Velvet Rope Reveal */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="noir-reveal"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#000]"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Spotlight effect */}
            <motion.div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-[100vh] bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,rgba(255,255,255,0.03)_140deg,rgba(255,255,255,0.08)_180deg,rgba(255,255,255,0.03)_220deg,transparent_360deg)] pointer-events-none"
              animate={isOpening ? { opacity: 0, scale: 2 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            ></motion.div>
            
            <motion.div
              animate={isOpening ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#555] mb-8 font-sans">You are invited</span>
                
                {/* The "Card" */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="w-64 h-80 sm:w-72 sm:h-96 border border-[#222] bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] mix-blend-overlay"></div>
                  
                  <Sparkles className="text-[#333] mb-8" size={24} strokeWidth={1} />
                  <span className="text-7xl sm:text-8xl font-serif text-[#fff] font-light italic opacity-90 drop-shadow-md">
                    {dynamicAgeNumber}
                  </span>
                  
                  <div className="w-12 h-px bg-[#333] mt-8"></div>
                </motion.div>
                
              </div>
              
              {!isOpening && (
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-16 text-[#555] text-[9px] font-sans uppercase tracking-[0.4em]"
                >
                  Click to enter
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
        <footer className="py-24 relative z-10 text-center bg-[#070707] text-[#444] w-full border-t border-[#1a1a1a]">
          <span className="relative z-10 text-[9px] uppercase tracking-[0.5em] font-sans">A celebration for {name}</span>
        </footer>
      )}

    </div>
  );
}
