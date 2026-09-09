import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Volume2, VolumeX, CalendarDays, Clock, Heart, Flower2, Leaf } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export function Sweet16FloralLayout({ content, website, updateContent, isEditor }: BirthdayLayoutProps) {
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

  const story = content?.about_text || "Join us in a garden of celebration as we mark a beautiful coming of age. A night of blooming memories awaits.";
  const dynamicAgeNumber = isNaN(Number(age)) ? '16' : age;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || `Sweet ${dynamicAgeNumber}`;
  const subtitle = content?.hero_subtitle || "You are cordially invited to";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Oct');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Botanical Gardens, 123 Flora Way";
  const venueName = location.split(',')[0] || "Botanical Gardens";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Garden Arrival & Mocktails", venue: venueName },
      { time: "5:30 PM", event: "Twilight Dinner", venue: venueName },
      { time: "7:00 PM", event: "Dancing Under the Stars", venue: venueName },
      { time: "9:00 PM", event: "Cake & Wishes", venue: venueName }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  
  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-24T16:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";
  const quoteText = content?.quote || content?.tagline || content?.settings_json?.birthday?.quote || "Watch me Bloom";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center p-0 min-h-[100vh] bg-[#fdfaf6] text-[#5e6b55] overflow-hidden border-b-8 border-[#e6ebdf]">
        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/floral-flourish.png')] mix-blend-multiply"></div>
        
        {/* Watercolor floral corner accents (simulated with CSS gradients/blur for now) */}
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] max-w-md max-h-md bg-gradient-to-br from-[#d4e0ce] via-[#f2e6e8] to-transparent rounded-full blur-[80px] opacity-70 transform -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] max-w-md max-h-md bg-gradient-to-tl from-[#eed6d3] via-[#e5eadd] to-transparent rounded-full blur-[80px] opacity-70 transform translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-3xl my-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 py-16 px-4 w-full bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-[0_20px_60px_-15px_rgba(94,107,85,0.1)] relative"
          >
            <div className="absolute -top-6 text-[#a7bda6]"><Flower2 size={48} strokeWidth={1} /></div>
            
            <span className="text-sm uppercase tracking-[0.4em] text-[#8fa38c] font-medium">{subtitle}</span>
            
            <h2 className="text-3xl sm:text-4xl italic text-[#c8a9a6] font-serif mb-2">
              {storyTitle}
            </h2>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif text-[#5e6b55] tracking-wide my-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {name}
            </h1>
            
            <div className="flex items-center gap-4 my-6 text-[#a7bda6]">
              <Leaf size={16} />
              <div className="w-16 h-px bg-[#a7bda6]/50"></div>
              <Leaf size={16} />
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-12 text-[#5e6b55] font-serif italic text-lg sm:text-xl divide-x divide-[#a7bda6]/30">
              <div className="px-4 text-right">
                <span className="block font-sans text-xs not-italic uppercase tracking-widest text-[#8fa38c] mb-1">Date</span>
                {monthStr} {dayNum}
              </div>
              <div className="px-4 text-center">
                <span className="block font-sans text-xs not-italic uppercase tracking-widest text-[#8fa38c] mb-1">Time</span>
                {timeStr}
              </div>
              <div className="px-4 text-left">
                <span className="block font-sans text-xs not-italic uppercase tracking-widest text-[#8fa38c] mb-1">Venue</span>
                {venueName}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-[#f9f5f0] text-[#5e6b55]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/floral-flourish.png')]"></div>
        <div className="max-w-xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8fa38c] block mb-4">Hosted With Love</span>
          <h3 className="text-4xl sm:text-5xl font-serif text-[#5e6b55] italic">{parentsName}</h3>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#5e6b55] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f4eaea] rounded-full blur-[120px] opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-lg mx-auto relative group">
            <div className="absolute -inset-4 bg-[#e5eadd] rounded-[3rem] transform rotate-3 transition-transform duration-700 group-hover:rotate-6"></div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-xl">
              <img src={mainPhoto} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Birthday Celebrant" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem]"></div>
            </div>
            
            {/* Floating leaf accents */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 -right-6 text-[#a7bda6] bg-white p-3 rounded-full shadow-lg">
              <Leaf size={24} strokeWidth={1.5} />
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl sm:text-6xl font-serif text-[#c8a9a6] mb-8 leading-tight">
              {quoteText}
            </h2>
            <div className="w-20 h-px bg-[#a7bda6] mb-8"></div>
            <p className="text-lg text-[#7c8b73] leading-relaxed font-light">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f9f5f0] text-[#5e6b55]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/floral-flourish.png')] mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif text-[#5e6b55] mb-6">Day in Bloom</h2>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8fa38c]">Schedule of Events</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm p-10 rounded-3xl border border-white/80 shadow-[0_10px_30px_-15px_rgba(94,107,85,0.1)] flex flex-col items-center text-center hover:bg-white transition-colors duration-500 group">
                <Clock className="text-[#c8a9a6] mb-6 transform group-hover:rotate-12 transition-transform duration-500" size={28} strokeWidth={1.5} />
                <span className="text-[#8fa38c] text-xs font-bold uppercase tracking-widest mb-3 block">{item.time}</span>
                <h3 className="text-2xl font-serif text-[#5e6b55] italic">{item.event}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#5e6b55] border-t border-[#e6ebdf]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
           
           <div className="flex-1 text-center md:text-left order-2 md:order-1">
             <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8fa38c] block mb-6">Location</span>
             <h2 className="text-5xl sm:text-6xl font-serif text-[#5e6b55] mb-6 leading-tight">
               {venueName}
             </h2>
             <p className="text-lg text-[#7c8b73] font-light mb-10 max-w-md mx-auto md:mx-0">
               {location}
             </p>
             {mapUrl && (
               <a
                 href={mapUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-3 bg-[#e5eadd] text-[#5e6b55] font-medium text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#d4e0ce] transition-colors"
               >
                 <MapPin size={16} /> Open Map
               </a>
             )}
           </div>

           <div className="flex-1 w-full relative order-1 md:order-2">
             <div className="aspect-square bg-[#f9f5f0] rounded-full overflow-hidden border-8 border-white shadow-xl relative">
               {/* Map placeholder/image */}
               <div className="absolute inset-0 flex items-center justify-center opacity-30 bg-[url('https://www.transparenttextures.com/patterns/floral-flourish.png')]"></div>
               {mapUrl && (
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x0%3A0x0!2zM!3zM!4v1600000000000!5m2!1sen!2sus" 
                   className="absolute inset-0 w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-700"
                   style={{ border: 0 }}
                   allowFullScreen
                   loading="lazy"
                 ></iframe>
               )}
             </div>
             
             {/* Decorative flowers around map */}
             <div className="absolute -bottom-4 -left-4 text-[#c8a9a6] bg-white p-4 rounded-full shadow-lg"><Flower2 size={32} strokeWidth={1} /></div>
           </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f9f5f0] text-[#5e6b55]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif text-[#5e6b55] mb-6 italic">Memories in Bloom</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div 
                key={index} 
                className="break-inside-avoid relative rounded-[2rem] overflow-hidden shadow-sm group"
              >
                <div className="absolute inset-0 bg-[#5e6b55]/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#5e6b55] overflow-hidden border-t border-[#e6ebdf]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-2xl max-h-2xl bg-[#f4eaea] rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <CalendarDays size={32} className="text-[#a7bda6] mb-8" strokeWidth={1} />
          <h2 className="text-4xl sm:text-5xl font-serif text-[#5e6b55] mb-16">
            The countdown begins...
          </h2>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white/60 backdrop-blur-sm p-8 w-32 sm:w-40 shadow-lg border border-white rounded-[2rem] justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#f9f5f0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="text-4xl sm:text-5xl font-serif text-[#c8a9a6] mb-2 relative z-10">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold uppercase text-[#8fa38c] tracking-widest relative z-10">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#f9f5f0] text-[#5e6b55]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/floral-flourish.png')] mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl font-serif text-[#5e6b55] mb-12 italic">
            Wishes & Love
          </h2>
          
          <div className="bg-white p-12 sm:p-20 shadow-xl rounded-[3rem] relative text-center flex flex-col items-center border border-white/50">
            <Heart className="text-[#eed6d3] w-12 h-12 mb-8 fill-current opacity-50" strokeWidth={1} />
            
            <p className="text-xl font-light text-[#7c8b73] leading-relaxed mb-12">
              Leave a note for the guest of honor to read and remember.
            </p>
            
            <div className="flex items-center gap-6 mb-12">
              <Leaf className="text-[#a7bda6]" size={20} />
              <span className="text-6xl font-serif text-[#5e6b55]">{wishCount}</span>
              <Leaf className="text-[#a7bda6] transform scale-x-[-1]" size={20} />
            </div>
            
            <span className="text-[#8fa38c] font-bold text-xs uppercase tracking-widest mb-12">Notes Left So Far</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-[#c8a9a6] text-white px-12 py-4 rounded-full font-medium text-xs uppercase tracking-[0.2em] hover:bg-[#b89592] hover:shadow-lg transition-all duration-300"
            >
              Write a Message
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-white text-[#5e6b55] border-t border-[#e6ebdf]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif text-[#5e6b55] mb-4">
              RSVP
            </h2>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8fa38c]">We'd love to see you there</span>
          </div>

          <div className="bg-[#f9f5f0] p-10 sm:p-16 shadow-inner rounded-[3rem] border border-[#e6ebdf]">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-white border border-[#e6ebdf] p-5 rounded-2xl outline-none focus:border-[#a7bda6] focus:ring-1 focus:ring-[#a7bda6] transition-all text-[#5e6b55] placeholder-[#a7bda6] font-serif text-lg" placeholder="Name(s)" />
              </div>

              <div>
                <textarea rows={3} className="w-full bg-white border border-[#e6ebdf] p-5 rounded-2xl outline-none focus:border-[#a7bda6] focus:ring-1 focus:ring-[#a7bda6] transition-all text-[#5e6b55] placeholder-[#a7bda6] font-serif text-lg resize-none" placeholder="Any special notes or dietary requests?"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#e6ebdf] bg-white rounded-2xl hover:border-[#a7bda6] transition-colors flex-1 has-[:checked]:bg-[#e5eadd] has-[:checked]:border-[#a7bda6] group">
                    <input type="radio" name="attending" className="hidden" />
                    <span className="text-sm text-[#5e6b55] font-medium tracking-wide uppercase">Joyfully Accept</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#e6ebdf] bg-white rounded-2xl hover:border-[#e6ebdf] transition-colors flex-1 has-[:checked]:bg-gray-100 has-[:checked]:text-gray-500 group">
                    <input type="radio" name="attending" className="hidden" />
                    <span className="text-sm text-[#5e6b55] font-medium tracking-wide uppercase group-has-[:checked]:text-gray-500">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="w-full bg-[#5e6b55] text-white text-sm font-medium uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-[#4a5543] hover:shadow-lg transition-all duration-300">
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
    <div className={`min-h-screen bg-white relative text-[#5e6b55] font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Music Toggle */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-white/80 backdrop-blur-md border border-[#e6ebdf] rounded-full flex items-center justify-center text-[#5e6b55] hover:bg-[#f9f5f0] transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX size={24} strokeWidth={1.5} /> : <Volume2 size={24} strokeWidth={1.5} />}
        </button>
      )}

      {/* Entrance Animation: Blooming Flower / Wreath Reveal */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="floral-reveal"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#f9f5f0]"
            onClick={handleOpen}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/floral-flourish.png')] mix-blend-multiply"></div>
            
            <motion.div
              animate={isOpening ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeIn" }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#e6ebdf] bg-white shadow-2xl flex items-center justify-center"
              >
                {/* Simulated floral wreath with CSS rotations and icons */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border border-[#d4e0ce] border-dashed"></motion.div>
                
                <div className="absolute top-2 text-[#c8a9a6]"><Flower2 size={24} /></div>
                <div className="absolute bottom-2 text-[#c8a9a6]"><Flower2 size={24} /></div>
                <div className="absolute left-2 text-[#a7bda6]"><Leaf size={24} /></div>
                <div className="absolute right-2 text-[#a7bda6] transform scale-x-[-1]"><Leaf size={24} /></div>

                <div className="flex flex-col items-center text-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8fa38c] font-bold mb-2">Celebrating</span>
                  <span className="text-7xl font-serif text-[#c8a9a6] italic">
                    {dynamicAgeNumber}
                  </span>
                </div>
              </motion.div>
              
              {!isOpening && (
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-12 text-[#8fa38c] text-xs font-bold uppercase tracking-[0.2em] bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white"
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

      {isOpened && (
        <footer className="py-16 relative z-10 text-center bg-[#f9f5f0] text-[#8fa38c] w-full border-t border-[#e6ebdf]">
          <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold">A Beautiful Celebration for {name}</span>
        </footer>
      )}

    </div>
  );
}
