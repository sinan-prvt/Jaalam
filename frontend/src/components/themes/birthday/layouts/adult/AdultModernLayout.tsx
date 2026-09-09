import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, CalendarDays, Clock, MessageSquare, ArrowRight, ArrowDown } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function AdultModernLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 50;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Victoria";
  const age = content?.settings_json?.birthday?.age || "40";

  const story = content?.about_text || "Join me for a modern celebration of life, milestones, and the future. Minimal fuss, maximum impact.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '40' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Level ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You're Invited";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Friday, October 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '9:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Glasshouse, 100 Skyline Ave";
  const venueName = location.split(',')[0] || "The Glasshouse";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "21:00", event: "Arrival & Drinks", venue: venueName },
      { time: "22:30", event: "Late Dinner", venue: venueName },
      { time: "00:00", event: "Midnight Toast", venue: venueName },
      { time: "01:00", event: "DJ Set", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-15T21:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "Bold. Unapologetic. Modern.";

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
    }, 1200); 
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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center p-0 min-h-screen bg-white text-black overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[#f5f5f5]"></div>
        
        {/* Geometric accent */}
        <div className="absolute -top-1/4 -right-1/4 w-[150vw] h-[150vw] sm:w-[80vw] sm:h-[80vw] bg-black rounded-full mix-blend-difference pointer-events-none opacity-5"></div>

        <div className="relative z-10 flex flex-col justify-center w-full max-w-5xl px-6 sm:px-16 py-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full relative"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/50 mb-10 pl-1 block border-l-2 border-black">
              &nbsp;&nbsp;{subtitle}
            </span>
            
            <h1 className="text-7xl sm:text-[8rem] md:text-[10rem] font-bold text-black tracking-tighter leading-[0.8] mb-8 uppercase break-words">
              {name}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-10 mt-10">
              <div className="bg-black text-white px-8 py-4 w-max">
                <span className="font-bold text-3xl sm:text-4xl tracking-tighter uppercase">{storyTitle}</span>
              </div>
              
              <div className="flex gap-12 text-black text-xs font-bold uppercase tracking-[0.2em]">
                <div>
                  <span className="block text-black/40 mb-1">When</span>
                  <span>{monthStr} {dayNum} <br/> {timeStr}</span>
                </div>
                <div>
                  <span className="block text-black/40 mb-1">Where</span>
                  <span>{venueName}</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 right-12 text-black hidden sm:block"
        >
          <ArrowDown size={32} strokeWidth={1.5} />
        </motion.div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-black text-white font-sans overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-stretch relative z-10">
          
          <div className="flex-1 flex flex-col justify-center text-left order-2 md:order-1">
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-10 leading-[1.1] tracking-tighter uppercase max-w-md">
              {quoteText}
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-light max-w-md mb-12">
              {story}
            </p>
            <div className="w-full h-px bg-white/20"></div>
          </div>

          <div className="flex-1 w-full max-w-lg mx-auto relative group order-1 md:order-2">
            <div className="absolute inset-0 bg-white transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
            <div className="relative aspect-[4/5] overflow-hidden grayscale contrast-125 bg-zinc-900 border border-white/10">
              <img src={mainPhoto} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" alt="Birthday Celebrant" />
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-white text-black font-sans">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-baseline gap-6 mb-24 border-b-2 border-black pb-8">
            <h2 className="text-6xl sm:text-7xl font-bold text-black tracking-tighter uppercase m-0">Timeline</h2>
            <span className="text-xs uppercase tracking-[0.4em] text-black/50 font-bold m-0">Event Flow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="flex flex-col group cursor-default">
                <span className="text-black/40 text-4xl sm:text-5xl font-bold tracking-tighter mb-4 transition-colors duration-300 group-hover:text-black">{item.time}</span>
                <h3 className="text-2xl font-bold text-black uppercase tracking-tight">{item.event}</h3>
                {item.venue && item.venue !== venueName && (
                  <span className="text-black/60 text-sm mt-2 font-medium">{item.venue}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-zinc-100 text-black font-sans">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-stretch relative z-10">
           
           <div className="flex-1 flex flex-col justify-center p-8 sm:p-16 bg-white shadow-sm border border-black/5">
             <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-bold mb-8 block">Destination</span>
             <h2 className="text-5xl sm:text-6xl font-bold text-black mb-8 tracking-tighter uppercase leading-[1.1]">
               {venueName}
             </h2>
             <p className="text-base text-black/60 font-medium mb-12 max-w-sm leading-relaxed">
               {location}
             </p>
             
             {mapUrl && (
               <a
                 href={mapUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-4 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-5 hover:bg-black/80 transition-colors w-max"
               >
                 <MapPin size={16} /> Open Maps
               </a>
             )}
           </div>

           {mapUrl && (
             <div className="flex-1 w-full min-h-[400px] bg-zinc-200 relative overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x0%3A0x0!2zM!3zM!4v1600000000000!5m2!1sen!2sus" 
                 className="absolute inset-0 w-full h-full"
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
               ></iframe>
             </div>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-black text-white font-sans">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6 mb-24 border-b border-white/20 pb-8">
            <h2 className="text-6xl sm:text-7xl font-bold text-white tracking-tighter uppercase m-0">Archive</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="relative aspect-square overflow-hidden bg-zinc-900 group"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover grayscale contrast-125 transform transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-white text-black font-sans">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-start">
          
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8 block">T-Minus</span>

          <div className="grid grid-cols-2 md:grid-cols-4 w-full border-t-2 border-l-2 border-black">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-8 sm:p-12 border-b-2 border-r-2 border-black aspect-square">
                <span className="text-5xl sm:text-7xl lg:text-8xl font-bold text-black tracking-tighter leading-none mb-4">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-zinc-100 text-black font-sans">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white p-12 sm:p-24 shadow-sm border border-black/5 relative flex flex-col md:flex-row gap-16 items-center">
            
            <div className="flex-1 text-center md:text-left">
              <MessageSquare className="text-black mb-8 mx-auto md:mx-0 w-12 h-12" strokeWidth={1.5} />
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 tracking-tight uppercase">
                Leave a Mark
              </h2>
              <p className="text-base font-medium text-black/60 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                Drop a message, a memory, or just sign the board.
              </p>
              
              <button 
                onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
                className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors duration-300 w-full sm:w-auto"
              >
                Sign Board
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full md:w-auto border-t md:border-t-0 md:border-l border-black/10 pt-12 md:pt-0 md:pl-12">
              <span className="text-[150px] font-bold text-black leading-none tracking-tighter opacity-10">{wishCount}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mt-4 block">Total Signatures</span>
            </div>
            
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-black text-white font-sans">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-16 border-b border-white/20 pb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-4 block">Confirm Status</span>
            <h2 className="text-5xl sm:text-6xl font-bold text-white tracking-tighter uppercase m-0">
              RSVP
            </h2>
          </div>

          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-transparent border-b-2 border-white/20 pb-4 outline-none focus:border-white transition-colors text-white font-bold text-xl sm:text-2xl placeholder-white/20 rounded-none tracking-tight" placeholder="FULL NAME(S)" />
            </div>

            <div>
              <input type="text" className="w-full bg-transparent border-b-2 border-white/20 pb-4 outline-none focus:border-white transition-colors text-white font-bold text-xl sm:text-2xl placeholder-white/20 rounded-none tracking-tight" placeholder="DIETARY REQUIREMENTS" />
            </div>

            <div className="pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center justify-center p-6 border-2 border-white/20 cursor-pointer hover:border-white/50 transition-colors flex-1 has-[:checked]:bg-white has-[:checked]:border-white group">
                  <input type="radio" name="attending" className="hidden" />
                  <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase group-has-[:checked]:text-black">Confirm</span>
                </label>
                <label className="flex items-center justify-center p-6 border-2 border-white/20 cursor-pointer hover:border-white/50 transition-colors flex-1 has-[:checked]:bg-white/10 has-[:checked]:border-white/30 group">
                  <input type="radio" name="attending" className="hidden" />
                  <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase group-has-[:checked]:text-white/50">Decline</span>
                </label>
              </div>
            </div>

            <div className="pt-12">
              <button type="button" className="w-full bg-white text-black text-sm font-bold uppercase tracking-[0.3em] py-6 hover:bg-white/90 transition-colors duration-300">
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative text-black font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-black border-none flex items-center justify-center text-white hover:bg-black/80 transition-all shadow-xl"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={2} /> : <Volume2 size={20} strokeWidth={2} />}
        </button>
      )}

      {/* Entrance Animation: Stark Geometric Split */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="modern-split"
            className="fixed inset-0 z-[100] flex flex-col cursor-pointer bg-white"
            onClick={handleOpen}
          >
            {/* Top Half */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2 bg-black flex items-end justify-center pb-2 border-b border-white/10 overflow-hidden"
              animate={isOpening ? { y: '-100%' } : { y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.div 
                animate={{ opacity: isOpening ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="transform translate-y-[55%]"
              >
                <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] font-bold text-white tracking-tighter leading-none block h-[0.5em] overflow-hidden">
                  {dynamicAgeNumber}
                </span>
              </motion.div>
            </motion.div>

            {/* Bottom Half */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-black flex items-start justify-center pt-2 border-t border-white/10 overflow-hidden"
              animate={isOpening ? { y: '100%' } : { y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.div 
                animate={{ opacity: isOpening ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="transform -translate-y-[45%]"
              >
                <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] font-bold text-white tracking-tighter leading-none block h-[0.5em] overflow-hidden">
                  {dynamicAgeNumber}
                </span>
              </motion.div>
              
              {!isOpening && (
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-16 text-white text-[9px] font-bold uppercase tracking-[0.5em]"
                >
                  Tap to Reveal
                </motion.div>
              )}
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

    </div>
  );
}
