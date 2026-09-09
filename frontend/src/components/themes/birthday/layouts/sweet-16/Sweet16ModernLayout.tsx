import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays, Clock, MessageSquare, ArrowRight, ArrowDown } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function Sweet16ModernLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
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

  const story = content?.about_text || "A modern celebration of a milestone. Clean aesthetics, great music, and unforgettable memories.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '16' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Sweet ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You're Invited";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Glasshouse, 123 Modern Art Ave";
  const venueName = location.split(',')[0] || "The Glasshouse";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Arrival & Cocktails", venue: venueName },
      { time: "8:00 PM", event: "Dinner Service", venue: venueName },
      { time: "9:30 PM", event: "The Party Begins", venue: venueName },
      { time: "11:00 PM", event: "Cake & Toasts", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-24T19:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "A Modern Milestone";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center p-0 min-h-[90vh] bg-white text-black overflow-hidden">
        <div className="absolute inset-0 bg-[#f8f9fa] opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="text-xs uppercase tracking-[0.4em] font-medium text-gray-500">{subtitle}</span>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter leading-none text-black">
              {name}
            </h1>
            <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-[0.2em] text-gray-400 mt-4">
              {storyTitle}
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-16 flex flex-col sm:flex-row items-center gap-8 sm:gap-16 border-t border-black/10 pt-12"
          >
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-sm text-gray-400 uppercase tracking-widest mb-1">Date</span>
              <span className="text-xl font-medium">{monthStr} {dayNum}</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-black/10"></div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-sm text-gray-400 uppercase tracking-widest mb-1">Time</span>
              <span className="text-xl font-medium">{timeStr}</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-black/10"></div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-sm text-gray-400 uppercase tracking-widest mb-1">Location</span>
              <span className="text-xl font-medium truncate max-w-[200px]">{venueName}</span>
            </div>
          </motion.div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-black text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/20 pb-24">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-[0.3em] block mb-2">Hosted By</span>
            <h3 className="text-3xl sm:text-4xl font-light tracking-wide">{parentsName}</h3>
          </div>
          <ArrowRight className="text-white/50 w-12 h-12 hidden md:block" strokeWidth={1} />
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 text-left relative z-10">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-8 leading-none text-white/90">
              {quoteText}
            </h2>
            <div className="w-24 h-1 bg-white mb-8"></div>
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-lg">
              {story}
            </p>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden relative group">
              <img src={mainPhoto} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale hover:grayscale-0" alt="Birthday Celebrant" />
              <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
            </div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-l border-b border-white hidden sm:block"></div>
            <div className="absolute -top-8 -right-8 w-32 h-32 border-r border-t border-white hidden sm:block"></div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-black">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-black/10 pb-8">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
              Itinerary
            </h2>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-[0.3em] whitespace-nowrap">Schedule of Events</span>
          </div>

          <div className="space-y-0 border-l border-black/10 ml-4 sm:ml-8">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="relative pl-8 sm:pl-16 py-10 border-b border-black/5 hover:bg-gray-50 transition-colors group">
                <div className="absolute -left-[5px] top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-black rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <span className="text-black font-bold text-lg uppercase tracking-widest w-32">
                    {item.time}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light text-black flex-1">{item.event}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f8f9fa] text-black border-t border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
           <div className="flex-1 relative w-full aspect-video bg-gray-200 overflow-hidden">
             {/* Map placeholder/image */}
             <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={48} className="text-gray-400" strokeWidth={1} />
             </div>
             {mapUrl && (
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x0%3A0x0!2zM!3zM!4v1600000000000!5m2!1sen!2sus" 
                 className="absolute inset-0 w-full h-full grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
               ></iframe>
             )}
           </div>

           <div className="flex-1 flex flex-col items-start w-full">
             <span className="text-sm font-medium text-gray-500 uppercase tracking-[0.3em] block mb-6">Location</span>
             <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6 leading-none">
               {venueName}
             </h2>
             <p className="text-xl text-gray-600 font-light mb-10 max-w-md">
               {location}
             </p>
             {mapUrl && (
               <a
                 href={mapUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-4 bg-black text-white font-medium text-xs uppercase tracking-widest px-8 py-4 hover:bg-gray-800 transition-colors"
               >
                 View on Map <ArrowRight size={16} />
               </a>
             )}
           </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-black/10 pb-8">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none">Gallery</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {validGallery.map((url: string, index: number) => {
              const isLarge = index === 0;
              return (
              <div 
                key={index} 
                className={`relative overflow-hidden bg-gray-100 group ${isLarge ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
              >
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale hover:grayscale-0" 
                />
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-black text-white overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 border-t border-b border-white/20 py-20">
          
          <div className="text-left flex-1">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-white/90">
              The<br/>Countdown
            </h2>
            <div className="w-16 h-1 bg-white mb-4"></div>
            <p className="text-gray-400 font-light uppercase tracking-widest text-sm">Until the Celebration</p>
          </div>

          <div className="flex gap-4 sm:gap-8 flex-1 justify-end">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hrs', value: timeLeft?.h ?? 0 },
              { label: 'Min', value: timeLeft?.m ?? 0 },
              { label: 'Sec', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl font-light text-white mb-2 leading-none">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs font-medium uppercase text-gray-500 tracking-[0.2em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f8f9fa] text-black">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <MessageSquare className="text-gray-300 w-16 h-16 mb-8" strokeWidth={1} />
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
              Leave a Note
            </h2>
            
            <p className="text-lg font-light text-gray-600 leading-relaxed mb-16 max-w-xl">
              Your wishes make this milestone even more memorable. Leave a message for the guest of honor.
            </p>
            
            <div className="flex items-center gap-8 mb-16 border-y border-black/10 py-8 w-full justify-center">
              <span className="text-6xl sm:text-7xl font-light text-black">{wishCount}</span>
              <div className="text-left">
                <span className="block text-sm font-bold uppercase tracking-widest">Messages</span>
                <span className="block text-gray-500 font-light">Received so far</span>
              </div>
            </div>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-black text-white px-12 py-5 font-medium text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Write Message
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-black">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-16 border-l-4 border-black pl-8">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
              RSVP
            </h2>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">Please respond by Oct 10</p>
          </div>

          <div className="bg-[#f8f9fa] p-8 sm:p-16 border border-black/5">
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Guest Name(s)</label>
                <input type="text" className="w-full bg-transparent border-b border-black/20 pb-4 outline-none focus:border-black transition-colors text-black text-lg placeholder-gray-300 rounded-none" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Message / Dietary Requirements</label>
                <textarea rows={2} className="w-full bg-transparent border-b border-black/20 pb-4 outline-none focus:border-black transition-colors text-black text-lg placeholder-gray-300 resize-none rounded-none" placeholder="Any notes for the host..."></textarea>
              </div>

              <div className="pt-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Will you attend?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center justify-center p-5 border border-black/20 bg-white hover:border-black transition-colors flex-1 cursor-pointer has-[:checked]:bg-black has-[:checked]:text-white group">
                    <input type="radio" name="attending" className="hidden" />
                    <span className="text-sm font-medium uppercase tracking-wider group-has-[:checked]:text-white">Accept</span>
                  </label>
                  <label className="flex items-center justify-center p-5 border border-black/20 bg-white hover:border-black transition-colors flex-1 cursor-pointer has-[:checked]:bg-gray-200 has-[:checked]:text-black group">
                    <input type="radio" name="attending" className="hidden" />
                    <span className="text-sm font-medium uppercase tracking-wider text-gray-500 group-has-[:checked]:text-black">Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-10">
                <button type="button" className="w-full bg-black hover:bg-gray-800 text-white font-medium text-sm uppercase tracking-widest py-6 transition-colors">
                  Submit Response
                </button>
              </div>
            </form>
          </div>
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
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-white border border-black/10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
        </button>
      )}

      {/* Entrance Animation: Modern Minimalist Reveal */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="modern-door"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer bg-white overflow-hidden"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Split panels opening */}
            <motion.div 
              exit={{ y: '-100%' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute top-0 left-0 w-full h-1/2 bg-black flex items-end justify-center pb-px"
            >
              <div className="text-white text-[150px] leading-none font-black tracking-tighter opacity-10 overflow-hidden h-[75px]">
                SWEET
              </div>
            </motion.div>
            
            <motion.div 
              exit={{ y: '100%' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute bottom-0 left-0 w-full h-1/2 bg-black flex items-start justify-center pt-px"
            >
              <div className="text-white text-[150px] leading-none font-black tracking-tighter opacity-10 overflow-hidden h-[75px] -mt-[75px]">
                SWEET
              </div>
            </motion.div>

            {/* Center Lock / Ticket */}
            <motion.div
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="bg-white px-12 py-8 border border-black/10 shadow-2xl flex flex-col items-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-black transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="absolute bottom-0 right-0 w-full h-1 bg-black transform origin-right transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                
                <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4">Admit One</span>
                <span className="text-8xl font-black text-black leading-none tracking-tighter">
                  {dynamicAgeNumber}
                </span>
                <div className="w-full border-t border-dashed border-gray-300 my-6"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  Tap to Enter <ArrowDown size={14} className="animate-bounce" />
                </span>
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 w-full bg-transparent">
        {isOpened && sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      {isOpened && (
        <footer className="py-12 relative z-10 text-center bg-black text-gray-600 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">A Modern Celebration for {name}</span>
        </footer>
      )}

    </div>
  );
}
