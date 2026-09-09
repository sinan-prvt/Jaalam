import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays, Clock, Heart, Sparkles, Star } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function Sweet16ElegantLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
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
  const age = content?.settings_json?.birthday?.age || "Sixteen";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Martinez Family";

  const story = content?.about_text || "A night of elegance, dancing, and memories to last a lifetime. Join us as we celebrate a beautiful milestone.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '16' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Sweet ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "Join us in celebrating";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Grand Plaza, 123 Elegance Blvd, NY";
  const venueName = location.split(',')[0] || "The Grand Plaza";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Red Carpet Arrival", date: rawDateStr, venue: venueName },
      { time: "8:00 PM", event: "Dinner & Toasts", date: rawDateStr, venue: venueName },
      { time: "9:30 PM", event: "Dancing Starts", date: rawDateStr, venue: venueName },
      { time: "11:00 PM", event: "Cake Cutting", date: rawDateStr, venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-24T19:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "An Elegant Evening";

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
        <div className="relative z-10 w-full max-w-lg p-8 sm:p-12 mx-auto mt-12 mb-24">
          <div className="absolute inset-0 border border-[#d4af37]/20 rounded-2xl bg-[#111111]/80 backdrop-blur-md shadow-2xl"></div>
          
          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#d4af37]/50"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#d4af37]/50"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#d4af37]/50"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#d4af37]/50"></div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <p className="text-[#d4af37] tracking-[0.2em] text-sm uppercase font-light">
                {subtitle}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-wide font-serif">
                {name}
              </h1>
              <h2 className="text-3xl sm:text-4xl text-[#d4af37] italic font-serif">
                {storyTitle}
              </h2>
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

            <div className="space-y-4 text-gray-300 font-sans font-light tracking-wide text-sm sm:text-base">
              <p>{rawDateStr}</p>
              <p>{timeStr}</p>
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

            <div className="space-y-2">
              <p className="text-white text-lg font-medium tracking-wider uppercase">
                {venueName}
              </p>
              <p className="text-gray-400 font-sans text-sm">
                {location}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-[#050505]">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <Star size={20} className="text-[#d4af37] mx-auto mb-6" strokeWidth={1} />
          <span className="text-[10px] font-sans text-[#a0a0a0] uppercase tracking-[0.3em] block mb-4">Hosted with joy by</span>
          <span className="text-3xl font-serif text-[#d4af37] italic">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-20"></div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          <div className="flex-1 w-full max-w-sm mx-auto relative group">
            <div className="absolute -inset-4 bg-[#d4af37] rounded-[2rem] opacity-10 blur-2xl transition-opacity duration-700 group-hover:opacity-20"></div>
            <div className="relative aspect-[3/4] bg-transparent p-2 rounded-t-full rounded-b-md border border-[#d4af37]/30">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-t-full rounded-b-sm grayscale hover:grayscale-0 transition-all duration-700" alt="Birthday Celebrant" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-serif text-white italic mb-10">
              {quoteText}
            </h2>
            <div className="bg-[#111] p-10 rounded-2xl relative border border-[#d4af37]/20 shadow-2xl">
              <Sparkles className="absolute -top-3 -left-3 text-[#d4af37]" size={24} strokeWidth={1} />
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-[2.5] font-light">
                {story}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#050505]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-24 relative">
            <span className="font-sans text-[10px] text-[#a0a0a0] uppercase tracking-[0.3em] block mb-4">The Evening's Flow</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#d4af37] italic">Order of Events</h2>
          </div>

          <div className="relative border-l border-[#d4af37]/30 ml-4 sm:ml-8 space-y-16 pb-8">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="relative pl-12 sm:pl-16 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#111] border border-[#d4af37] flex items-center justify-center transition-transform duration-500 group-hover:scale-125">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></div>
                </div>
                
                <div className="bg-[#111] p-8 rounded-2xl border border-[#d4af37]/10 transition-all duration-500 hover:border-[#d4af37]/40 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.2)]">
                  <span className="text-[#d4af37] font-sans text-[10px] uppercase tracking-widest block mb-4">
                    {item.time}
                  </span>
                  <h3 className="text-2xl font-serif text-white font-light">{item.event}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d4af37] blur-[150px] opacity-5 pointer-events-none"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10 bg-[#111]/80 backdrop-blur-md p-16 rounded-full aspect-square flex flex-col items-center justify-center border border-[#d4af37]/20 shadow-2xl">
           <MapPin size={32} strokeWidth={0.5} className="text-[#d4af37] mb-8" />
           <span className="text-[10px] font-sans text-gray-400 uppercase tracking-[0.3em] block mb-4">Join Us At</span>
           
           <h2 className="text-3xl sm:text-4xl font-serif text-white italic mb-10 px-4 leading-relaxed">
             {venueName}
           </h2>

          {mapUrl && (
            <div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent text-[#d4af37] font-sans text-[10px] uppercase tracking-[0.2em] px-8 py-3 rounded-full border border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-colors"
              >
                View Map
              </a>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#050505]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#d4af37] italic">Gallery</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid relative rounded-sm overflow-hidden p-2 bg-[#111] shadow-sm border border-[#d4af37]/20 group">
                <div className="overflow-hidden rounded-sm">
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover transform transition-transform duration-[20s] group-hover:scale-110 grayscale hover:grayscale-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          <CalendarDays size={24} strokeWidth={1} className="text-[#d4af37] mb-8" />
          <h2 className="text-4xl font-serif text-white italic mb-20">Anticipating the day...</h2>

          <div className="flex flex-wrap gap-8 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-[#111] border border-[#d4af37]/20 p-8 rounded-full aspect-square w-32 sm:w-40 justify-center shadow-lg">
                <span className="text-4xl sm:text-5xl font-serif text-[#d4af37] mb-2 font-light">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-sans uppercase text-gray-400 tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#050505]">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-serif text-[#d4af37] italic mb-16">A Note of Love</h2>
          
          <div className="bg-[#111] p-16 rounded-[2rem] border border-[#d4af37]/20 shadow-2xl relative text-center flex flex-col items-center">
            <p className="text-sm font-sans text-gray-300 leading-loose mb-12 font-light">
              &quot;Your love and presence are the most beautiful gifts we could ask for.&quot;
            </p>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-[#d4af37]/30"></div>
              <span className="text-4xl font-serif text-[#d4af37]">{wishCount}</span>
              <div className="w-12 h-[1px] bg-[#d4af37]/30"></div>
            </div>
            
            <span className="text-gray-400 font-sans uppercase tracking-[0.2em] text-[9px] mb-12">Wishes Received</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-transparent text-[#d4af37] px-10 py-4 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] border border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-all duration-300 w-full sm:w-auto"
            >
              Leave a Message
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Mail size={24} strokeWidth={1} className="text-[#d4af37] mx-auto mb-8" />
            <h2 className="text-4xl font-serif text-white italic mb-6">RSVP</h2>
            <p className="text-[#d4af37] font-sans text-[10px] uppercase tracking-widest">Kindly respond</p>
          </div>

          <div className="bg-[#111] p-10 sm:p-16 rounded-[2rem] border border-[#d4af37]/20 shadow-2xl">
            <form className="space-y-12 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#d4af37]/30 pb-4 outline-none focus:border-[#d4af37] transition-colors text-sm text-white placeholder-gray-500" placeholder="Name(s) of Guest(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#d4af37]/30 pb-4 outline-none focus:border-[#d4af37] transition-colors text-sm text-white placeholder-gray-500 resize-none" placeholder="A brief note or dietary requests..."></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-8">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border border-[#d4af37]/30 rounded-xl bg-transparent hover:bg-[#d4af37]/5 transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#d4af37]" />
                    <span className="text-xs text-gray-300 tracking-wider">Joyfully Accept</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border border-[#d4af37]/30 rounded-xl bg-transparent hover:bg-[#d4af37]/5 transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-gray-500" />
                    <span className="text-xs text-gray-300 tracking-wider">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-12 text-center">
                <button type="button" className="bg-[#d4af37] hover:bg-[#b08d27] text-[#111] font-sans text-[10px] uppercase tracking-[0.3em] py-5 px-16 rounded-full transition-colors font-bold">
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] relative text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-[#0a0a0a] to-[#050505]"></div>
      </div>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-[#111] border border-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37] hover:bg-[#111]/80 hover:border-[#d4af37] transition-colors shadow-xl"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
        </button>
      )}

      {/* Doors Entrance Animation */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="doors"
            className="fixed inset-0 z-[100] flex cursor-pointer overflow-hidden bg-[#0a0a0a]"
            onClick={handleOpen}
          >
            {/* Left Door */}
            <motion.div
              exit={{ x: '-100%' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-1/2 h-full bg-[#0a0a0a] border-r border-[#d4af37]/40 relative flex items-center justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#d4af37]/10"></div>
              <div className="absolute w-[200%] h-full bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent"></div>
              <div className="w-2 h-full bg-gradient-to-b from-transparent via-[#d4af37]/30 to-transparent absolute right-4"></div>
              <div className="w-[1px] h-3/4 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent absolute right-12"></div>
            </motion.div>

            {/* Right Door */}
            <motion.div
              exit={{ x: '100%' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-1/2 h-full bg-[#0a0a0a] border-l border-[#d4af37]/40 relative flex items-center justify-start"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#d4af37]/10"></div>
              <div className="absolute w-[200%] h-full bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent left-0"></div>
              <div className="w-2 h-full bg-gradient-to-b from-transparent via-[#d4af37]/30 to-transparent absolute left-4"></div>
              <div className="w-[1px] h-3/4 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent absolute left-12"></div>
            </motion.div>

            {/* Center Lock / Button */}
            <motion.div
              exit={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#d4af37] via-[#f9e596] to-[#aa8c2c] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] border-4 border-[#0a0a0a] relative group"
              >
                <motion.div 
                  className="absolute inset-0 border-[3px] border-dashed border-[#0a0a0a]/30 rounded-full m-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#0a0a0a] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="text-[#d4af37] font-serif text-4xl sm:text-5xl italic relative z-10 tracking-widest pl-1">
                    {isNaN(Number(age)) ? '16' : age}
                  </span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="mt-8 flex flex-col items-center w-full"
              >
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4af37] to-transparent mb-4"></div>
                <p className="text-[#d4af37] tracking-[0.5em] text-xs sm:text-sm uppercase font-light whitespace-nowrap text-center pl-[0.5em]">
                  Tap to Reveal
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      {isOpened && (
        <footer className="py-20 relative z-10 text-center bg-[#050505] text-gray-500 w-full border-t border-[#d4af37]/20">
          <span className="text-[9px] font-sans uppercase tracking-[0.4em]">An Elegant Celebration for {name}</span>
        </footer>
      )}

    </div>
  );
}
