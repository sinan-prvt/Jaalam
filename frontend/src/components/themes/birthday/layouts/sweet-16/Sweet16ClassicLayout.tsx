import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays, Clock, Heart, Flower2 } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function Sweet16ClassicLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
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

  const story = content?.about_text || "Please join us for a classic evening of joy, laughter, and celebration as we mark this beautiful milestone.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '16' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Sweet ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You are warmly invited to";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Rose Garden, 123 Blossom Lane";
  const venueName = location.split(',')[0] || "The Rose Garden";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Welcome Reception", venue: venueName },
      { time: "8:00 PM", event: "Dinner & Toasts", venue: venueName },
      { time: "9:30 PM", event: "Dancing", venue: venueName },
      { time: "11:00 PM", event: "Cake Cutting", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-24T19:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "A Timeless Celebration";

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
    }, 1500); // Wait for envelope animation
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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center p-0 min-h-[100vh] bg-[#fdfbf7] text-[#4a4a4a] overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        
        {/* Decorative corner florals */}
        <div className="absolute top-8 left-8 w-32 h-32 opacity-20 hidden sm:block border-t border-l border-[#d4b5b0]"></div>
        <div className="absolute top-8 right-8 w-32 h-32 opacity-20 hidden sm:block border-t border-r border-[#d4b5b0]"></div>
        <div className="absolute bottom-8 left-8 w-32 h-32 opacity-20 hidden sm:block border-b border-l border-[#d4b5b0]"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 opacity-20 hidden sm:block border-b border-r border-[#d4b5b0]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-2xl border border-[#d4b5b0]/30 bg-white/50 backdrop-blur-sm shadow-xl rounded-sm my-16 mx-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center gap-6 py-12 px-4 sm:px-12 w-full"
          >
            <span className="text-sm uppercase tracking-[0.3em] text-[#8c7b75]">{subtitle}</span>
            <div className="w-12 h-px bg-[#d4b5b0] my-2"></div>
            
            <h2 className="text-3xl sm:text-4xl italic text-[#c39b94] font-serif mb-2">
              {storyTitle}
            </h2>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif text-[#4a4a4a] tracking-wider mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {name}
            </h1>
            
            <div className="w-24 h-px bg-[#d4b5b0] my-6"></div>

            <div className="flex flex-col items-center space-y-4 text-[#6b625d] tracking-widest uppercase text-sm">
              <span>{rawDateStr}</span>
              <span>at {timeStr}</span>
            </div>

            <div className="w-12 h-px bg-[#d4b5b0] my-6"></div>

            <div className="flex flex-col items-center space-y-2 text-[#4a4a4a]">
              <span className="text-xl font-serif italic">{venueName}</span>
              <span className="text-xs uppercase tracking-widest text-[#8c7b75]">{location}</span>
            </div>
          </motion.div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-white text-[#4a4a4a]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        <div className="max-w-xl mx-auto text-center relative z-10">
          <Flower2 className="mx-auto text-[#d4b5b0] mb-6 opacity-60" size={32} strokeWidth={1} />
          <span className="text-xs uppercase tracking-[0.3em] text-[#8c7b75] block mb-4">Hosted With Love By</span>
          <h3 className="text-4xl sm:text-5xl font-serif italic text-[#4a4a4a]">{parentsName}</h3>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-[#fdfbf7] text-[#4a4a4a] border-y border-[#d4b5b0]/20">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-md mx-auto relative p-4 bg-white shadow-xl rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
            <div className="aspect-[4/5] overflow-hidden border border-[#d4b5b0]/20">
              <img src={mainPhoto} className="w-full h-full object-cover" alt="Birthday Celebrant" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-serif italic text-[#c39b94] mb-8">
              {quoteText}
            </h2>
            <p className="text-base sm:text-lg text-[#6b625d] leading-loose font-light">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#4a4a4a]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8c7b75] block mb-4">The Evening</span>
            <h2 className="text-5xl font-serif text-[#4a4a4a]">Order of Events</h2>
            <div className="w-16 h-px bg-[#d4b5b0] mx-auto mt-8"></div>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#d4b5b0]/50 before:to-transparent">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#d4b5b0] bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <div className="w-2 h-2 bg-[#d4b5b0] rounded-full"></div>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#fdfbf7] p-6 rounded border border-[#d4b5b0]/20 shadow-sm text-center">
                  <span className="text-[#8c7b75] text-xs uppercase tracking-widest font-bold mb-2 block">{item.time}</span>
                  <h3 className="text-2xl font-serif text-[#4a4a4a] italic">{item.event}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#fdfbf7] text-[#4a4a4a] border-y border-[#d4b5b0]/20">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 bg-white p-12 sm:p-20 shadow-xl border border-[#d4b5b0]/30 rounded-sm">
           <MapPin size={32} className="text-[#d4b5b0] mb-6" strokeWidth={1} />
           <span className="text-xs uppercase tracking-[0.3em] text-[#8c7b75] block mb-4">Location</span>
           <h2 className="text-4xl sm:text-5xl font-serif text-[#4a4a4a] mb-6">
             {venueName}
           </h2>
           <p className="text-lg text-[#6b625d] font-light mb-12 max-w-md">
             {location}
           </p>
           {mapUrl && (
             <a
               href={mapUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-block border border-[#d4b5b0] text-[#8c7b75] font-medium text-xs uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#d4b5b0] hover:text-white transition-colors"
             >
               View Map
             </a>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#4a4a4a]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif text-[#4a4a4a] mb-6">Gallery</h2>
            <div className="w-16 h-px bg-[#d4b5b0] mx-auto"></div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="break-inside-avoid relative p-3 bg-white shadow-md border border-[#d4b5b0]/20"
              >
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#fdfbf7] text-[#4a4a4a] border-y border-[#d4b5b0]/20">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <h2 className="text-4xl sm:text-5xl font-serif italic text-[#c39b94] mb-16">
            Awaiting the Celebration
          </h2>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-8 w-32 sm:w-40 shadow-sm border border-[#d4b5b0]/20 rounded-full aspect-square justify-center">
                <span className="text-4xl sm:text-5xl font-serif text-[#4a4a4a] mb-2">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase text-[#8c7b75] tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#4a4a4a]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl font-serif text-[#4a4a4a] mb-8">
            Guest Book
          </h2>
          <div className="w-16 h-px bg-[#d4b5b0] mx-auto mb-12"></div>
          
          <div className="bg-[#fdfbf7] p-12 sm:p-20 shadow-lg border border-[#d4b5b0]/30 relative text-center flex flex-col items-center mx-4">
            <Heart className="text-[#d4b5b0] w-8 h-8 mb-8 opacity-60" strokeWidth={1} />
            
            <p className="text-lg font-light text-[#6b625d] leading-relaxed mb-12 font-serif italic">
              &quot;Leave a wish for {name} to cherish for years to come.&quot;
            </p>
            
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-px bg-[#d4b5b0]/50"></div>
              <span className="text-5xl font-serif text-[#4a4a4a]">{wishCount}</span>
              <div className="w-12 h-px bg-[#d4b5b0]/50"></div>
            </div>
            
            <span className="text-[#8c7b75] text-xs uppercase tracking-widest mb-12">Wishes Shared</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-transparent text-[#8c7b75] border border-[#d4b5b0] px-12 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#d4b5b0] hover:text-white transition-colors"
            >
              Sign Guest Book
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#fdfbf7] text-[#4a4a4a] border-t border-[#d4b5b0]/20">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif text-[#4a4a4a] mb-6">
              RSVP
            </h2>
            <span className="text-xs uppercase tracking-[0.3em] text-[#8c7b75]">Kindly Respond</span>
          </div>

          <div className="bg-white p-10 sm:p-16 shadow-xl border border-[#d4b5b0]/30 rounded-sm">
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#d4b5b0]/50 pb-4 outline-none focus:border-[#c39b94] transition-colors text-[#4a4a4a] placeholder-[#8c7b75]/50 font-serif italic text-lg" placeholder="M.................................................." />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#d4b5b0]/50 pb-4 outline-none focus:border-[#c39b94] transition-colors text-[#4a4a4a] placeholder-[#8c7b75]/50 font-serif italic text-lg resize-none" placeholder="Any dietary restrictions or notes?"></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border border-[#d4b5b0]/30 bg-[#fdfbf7] hover:bg-[#d4b5b0]/10 transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#d4b5b0]" />
                    <span className="text-sm text-[#6b625d] font-medium tracking-wide uppercase">Accepts with Pleasure</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border border-[#d4b5b0]/30 bg-[#fdfbf7] hover:bg-[#d4b5b0]/10 transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-gray-400" />
                    <span className="text-sm text-[#6b625d] font-medium tracking-wide uppercase">Declines with Regret</span>
                  </label>
                </div>
              </div>

              <div className="pt-10 text-center">
                <button type="button" className="bg-[#4a4a4a] text-white text-xs uppercase tracking-[0.2em] py-5 px-16 hover:bg-[#c39b94] transition-colors">
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
    <div className={`min-h-screen bg-[#fdfbf7] relative text-[#4a4a4a] font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-white border border-[#d4b5b0] rounded-full flex items-center justify-center text-[#8c7b75] hover:bg-[#fdfbf7] transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1} /> : <Volume2 size={20} strokeWidth={1} />}
        </button>
      )}

      {/* Entrance Animation: Classic Envelope */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="classic-envelope"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#e0d5c1]"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Envelope Background Texture */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
            
            <div className="relative z-10 w-full max-w-lg aspect-[4/3] flex items-center justify-center perspective-1000">
              
              <motion.div 
                className="absolute inset-0 bg-[#fdfbf7] shadow-2xl rounded-sm border border-[#d4b5b0]/30"
                initial={{ rotateX: 0 }}
                animate={isOpening ? { rotateX: 180, opacity: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
              >
                {/* Envelope flap detail */}
                <div className="absolute top-0 w-full h-full border-t border-[#d4b5b0]/20 clip-triangle bg-white/50"></div>
                
                {/* Wax Seal */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#c39b94] to-[#a47b74] rounded-full shadow-lg flex flex-col items-center justify-center border-[3px] border-[#8a635d] cursor-pointer hover:scale-105 transition-transform"
                  animate={isOpening ? { scale: 0, opacity: 0 } : {}}
                >
                  <span className="text-white font-serif italic text-3xl sm:text-4xl shadow-sm">
                    {dynamicAgeNumber}
                  </span>
                </motion.div>
                
                {!isOpening && (
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 w-full text-center text-[#8a635d] text-xs uppercase tracking-widest font-medium"
                  >
                    Tap to Open
                  </motion.div>
                )}
              </motion.div>

              {/* Back of Envelope (Inside) */}
              <div className="absolute inset-0 bg-[#f5efe6] -z-10 shadow-inner rounded-sm border border-[#d4b5b0]/30"></div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      {isOpened && (
        <footer className="py-16 relative z-10 text-center bg-[#fdfbf7] text-[#8c7b75] w-full border-t border-[#d4b5b0]/20">
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
          <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-medium">A Classic Celebration for {name}</span>
        </footer>
      )}

      {/* Global styles for specific shapes if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-triangle {
          clip-path: polygon(0 0, 100% 0, 50% 50%);
        }
      `}} />
    </div>
  );
}
