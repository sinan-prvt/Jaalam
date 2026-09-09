import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays, Clock, Sparkles, Music, Star, Zap } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function Sweet16PopLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 16;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Isabella's";
  const age = content?.settings_json?.birthday?.age || "16";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Martinez Family";

  const story = content?.about_text || "Get ready for the most electrifying night of the year! Bring your best moves and let's party.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '16' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Sweet ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You're Invited to";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Oct');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Neon Nights Club, 123 Party Lane";
  const venueName = location.split(',')[0] || "Neon Nights Club";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Doors Open & Mocktails", venue: venueName },
      { time: "9:00 PM", event: "DJ Starts Spinning", venue: venueName },
      { time: "10:30 PM", event: "Midnight Snacks & Cake", venue: venueName },
      { time: "11:30 PM", event: "Dance Off", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1543807535-ecec30f4d3cb?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-24T20:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "Let's Glow Crazy!";

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
    }, 800); // Faster, snappy open
  };

  if (!mounted) return null;

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'about', label: 'Hosted By', visible: true },
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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center p-0 overflow-hidden min-h-screen pt-20">
        
        {/* Dynamic Background Shapes */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#ff1493]/20 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#00ffff]/20 rounded-full blur-[100px]"
        />

        <div className="relative z-10 w-full max-w-xl p-8 sm:p-12 mx-auto mt-12 mb-24">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_80px_rgba(255,20,147,0.3)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff1493] via-[#00ffff] to-[#ccff00]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 rounded-full bg-[#ff1493]/20 border border-[#ff1493]/50 text-[#ff1493] text-xs font-bold tracking-widest uppercase">
                {subtitle}
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 uppercase tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {name}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-1 bg-[#00ffff]"></div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#00ffff] uppercase italic" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {storyTitle}
                </h2>
                <div className="w-12 h-1 bg-[#00ffff]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                <CalendarDays size={24} className="text-[#ff1493] mb-2" />
                <span className="text-white font-bold text-lg">{monthStr} {dayNum}</span>
                <span className="text-gray-400 text-xs uppercase">{rawDateStr.split(',')[0]}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                <Clock size={24} className="text-[#00ffff] mb-2" />
                <span className="text-white font-bold text-lg">{timeStr}</span>
                <span className="text-gray-400 text-xs uppercase">Start Time</span>
              </div>
            </div>

            <div className="w-full bg-[#ff1493] p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <MapPin size={24} className="text-white mb-2 relative z-10" />
              <p className="text-white font-black text-xl uppercase tracking-wider relative z-10">
                {venueName}
              </p>
              <p className="text-white/80 text-xs font-bold mt-1 relative z-10 truncate w-full px-4">
                {location}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-[#090909]">
        <div className="max-w-xl mx-auto text-center relative z-10 flex flex-col items-center">
          <Zap size={32} className="text-[#ccff00] mb-6 animate-pulse" strokeWidth={2} />
          <span className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] block mb-4">The Hosts</span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00ffff] uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {parentsName}
          </span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0f0f15] overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
          <div className="flex-1 w-full max-w-md mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1493] to-[#00ffff] rounded-[3rem] transform rotate-6 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"></div>
            <div className="relative aspect-square bg-[#0a0a0a] rounded-[3rem] overflow-hidden border-4 border-[#0a0a0a]">
              <img src={mainPhoto} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" alt="Birthday Celebrant" />
            </div>
            
            {/* Pop elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-[#ccff00] rounded-full flex items-center justify-center text-black font-black text-2xl border-4 border-[#0f0f15] shadow-xl"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              VIP
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tight mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {quoteText}
            </h2>
            <div className="bg-white/5 backdrop-blur-sm p-8 sm:p-10 rounded-3xl relative border border-white/10 w-full">
              <Sparkles className="absolute -top-4 -left-4 text-[#ff1493] w-8 h-8" />
              <p className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed">
                {story}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#090909]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-24 relative">
            <span className="font-bold text-sm text-[#00ffff] uppercase tracking-[0.3em] block mb-4">The Lineup</span>
            <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Event Schedule
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                className="bg-[#111] p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#ff1493] to-[#00ffff] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col h-full">
                  <span className="inline-block bg-white/10 text-white font-bold text-xs uppercase px-3 py-1 rounded-full w-max mb-4">
                    {item.time}
                  </span>
                  <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{item.event}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0f0f15]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-r from-[#ff1493] to-[#8a2be2] rounded-[3rem] p-12 sm:p-16 relative overflow-hidden">
           
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           
           <div className="relative z-10 flex-1 text-center md:text-left">
             <span className="text-sm font-bold text-[#ccff00] uppercase tracking-[0.3em] block mb-4">Location</span>
             <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
               {venueName}
             </h2>
             <p className="text-xl text-white/90 font-medium mb-8">
               {location}
             </p>
             {mapUrl && (
               <a
                 href={mapUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-block bg-[#ccff00] text-black font-black text-sm uppercase tracking-widest px-10 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(204,255,0,0.5)]"
               >
                 Get Directions
               </a>
             )}
           </div>

           <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-full flex items-center justify-center">
             <MapPin size={80} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
           </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#090909]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Vibes
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {validGallery.map((url: string, index: number) => {
              // Create dynamic layout with some tall and wide images
              const isLarge = index === 0 || index === 4;
              return (
              <div 
                key={index} 
                className={`relative rounded-3xl overflow-hidden group ${isLarge ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff1493]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0f0f15] overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2 mb-12 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse"></span>
            <span className="text-[#00ffff] font-bold text-sm uppercase tracking-widest">Counting Down</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-gradient-to-b from-[#1a1a24] to-[#111118] border border-white/5 p-8 rounded-3xl justify-center shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#ff1493] rounded-full blur-[30px] opacity-20 group-hover:opacity-50 transition-opacity"></div>
                <span className="text-5xl sm:text-7xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-[0.2em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#090909]">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tight mb-16" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Hype Squad
          </h2>
          
          <div className="bg-[#111] p-12 sm:p-20 rounded-[3rem] border border-white/5 relative text-center flex flex-col items-center shadow-2xl">
            <Music className="text-[#00ffff] w-12 h-12 mb-8 opacity-50" />
            
            <p className="text-xl sm:text-2xl font-medium text-white mb-12">
              Drop a message for the birthday VIP!
            </p>
            
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-2 bg-[#ff1493] rounded-full"></div>
              <span className="text-6xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{wishCount}</span>
              <div className="w-16 h-2 bg-[#ff1493] rounded-full"></div>
            </div>
            
            <span className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs mb-12">Messages Dropped</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-gradient-to-r from-[#ff1493] to-[#8a2be2] text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(255,20,147,0.4)] transition-all duration-300 w-full sm:w-auto"
            >
              Leave a Message
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0f0f15]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              RSVP
            </h2>
            <p className="text-[#00ffff] font-bold text-sm uppercase tracking-widest">Are you in?</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-16 rounded-[3rem] border border-white/10 shadow-2xl">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-[#111] border border-white/10 p-6 rounded-2xl outline-none focus:border-[#ff1493] transition-colors text-white font-medium placeholder-gray-600 text-lg" placeholder="Your Name" />
              </div>

              <div>
                <textarea rows={3} className="w-full bg-[#111] border border-white/10 p-6 rounded-2xl outline-none focus:border-[#ff1493] transition-colors text-white font-medium placeholder-gray-600 text-lg resize-none" placeholder="Any dietary requirements?"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-6 border-2 border-white/10 rounded-2xl bg-[#111] hover:border-[#ccff00] hover:bg-[#ccff00]/10 transition-colors flex-1 group has-[:checked]:border-[#ccff00] has-[:checked]:bg-[#ccff00]/20">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#ccff00]" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">I'm In!</span>
                  </label>
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-6 border-2 border-white/10 rounded-2xl bg-[#111] hover:border-gray-500 transition-colors flex-1 group has-[:checked]:border-gray-500">
                    <input type="radio" name="attending" className="w-5 h-5 accent-gray-500" />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Can't Make It</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-[#ccff00] hover:bg-white text-black font-black text-lg uppercase tracking-widest py-6 rounded-2xl transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                  Send RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#050505] relative text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-[#ff1493] border-none rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,20,147,0.5)]"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      {/* Entrance Animation: Vinyl Record / DJ Deck Pop Open */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="pop-door"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#0a0a0a]"
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Background effects */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'conic-gradient(from 0deg, #ff1493, #00ffff, #ccff00, #ff1493)'
              }}
            />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Vinyl Record */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#111] border-8 border-gray-900 shadow-2xl flex items-center justify-center relative overflow-hidden"
              >
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border border-gray-800"></div>
                <div className="absolute inset-8 rounded-full border border-gray-800"></div>
                <div className="absolute inset-12 rounded-full border border-gray-800"></div>
                <div className="absolute inset-16 rounded-full border border-gray-800"></div>
                
                {/* Center Label */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#ff1493] to-[#00ffff] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-black"></div>
                </div>
              </motion.div>
              
              <div className="mt-12 bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-[0.3em] text-sm shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Tap to Play
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent font-sans">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      {isOpened && (
        <footer className="py-12 relative z-10 text-center bg-[#050505] text-gray-600 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">An Epic Party for {name}</span>
        </footer>
      )}

    </div>
  );
}
