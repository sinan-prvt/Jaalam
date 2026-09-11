import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Sparkles, Navigation, Volume2, VolumeX } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function FloralEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!website?.slug) return;
    const fetchGlobalWishes = async () => {
      try {
        const res = await fetch(`/api/websites/${website.slug}/wish/`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.wish_count === 'number') {
            setWishCount(data.wish_count);
          }
        }
      } catch (err) {}
    };
    fetchGlobalWishes();
    const interval = setInterval(fetchGlobalWishes, 4000);
    return () => clearInterval(interval);
  }, [website?.slug]);

  const handleTapWish = async (e?: React.MouseEvent) => {
    const newCount = wishCount + 1;
    setWishCount(newCount);
    setIsCounterPopping(true);
    setTimeout(() => setIsCounterPopping(false), 300);
    triggerConfettiPopper(e);

    if (website?.slug) {
      try {
        await fetch(`/api/websites/${website.slug}/wish/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ increment: 1 })
        });
      } catch (err) {}
    }
  };

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    if (audioRef.current && musicUrl && !isMuted) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1500);
  };

  const toggleMusic = () => {
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

  const rawCoupleNames = content?.hero_title || "Alexander & Isabella";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "Alexander");
  const brideFullName = (parts[1]?.trim() || "Isabella");

  const story = content?.about_text || "Like a flower blooming in spring, our love has grown. We are so excited to celebrate our engagement with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Love Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, May 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'May');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Botanical Gardens, 123 Floral Way";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Garden Party Arrivals", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "Champagne Toast", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Dinner Under The Stars", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-05-15T16:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Love is the flower you've got to let grow.";

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

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  const sections = content?.settings_json?.wedding?.sections || defaultSections;

  // Custom Colors for Floral
  const c = {
    bg: "#FFF6F7",
    text: "#2E3A31",
    accent: "#D98880",
    light: "#FDF9F9",
    border: "#EAD6D8"
  };

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FFF6F7] text-[#2E3A31] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400&display=swap');
          .font-cursive { font-family: 'Great Vibes', cursive; }
          .font-serif { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Lato', sans-serif; }
          @keyframes floatUp {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
        
        {/* Floating Petals Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-[#D98880]/30"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 30}px`,
                animation: `floatUp ${10 + Math.random() * 15}s linear infinite`,
                animationDelay: `${Math.random() * -10}s`
              }}
            >
              🌸
            </div>
          ))}
          {/* Subtle floral watercolor texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/floral-texture.png')] mix-blend-multiply"></div>
        </div>

        {/* Ornate corner flowers */}
        <img src="https://images.unsplash.com/photo-1550993098-b8004f21dbbd?auto=format&fit=crop&w=400&q=80" alt="flower border" className="absolute top-0 left-0 w-48 sm:w-64 opacity-40 mix-blend-multiply rotate-180 -translate-x-8 -translate-y-8" />
        <img src="https://images.unsplash.com/photo-1550993098-b8004f21dbbd?auto=format&fit=crop&w=400&q=80" alt="flower border" className="absolute bottom-0 right-0 w-48 sm:w-64 opacity-40 mix-blend-multiply translate-x-8 translate-y-8" />

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20">
          <span className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase text-[#D98880] mb-8 font-light">
            {quoteText}
          </span>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <h1 className="text-5xl sm:text-7xl font-serif text-[#2E3A31] m-0">
              {groomFullName}
            </h1>
            <span className="text-6xl sm:text-8xl font-cursive text-[#D98880] -mt-4 md:mt-0">&amp;</span>
            <h2 className="text-5xl sm:text-7xl font-serif text-[#2E3A31] m-0">
              {brideFullName}
            </h2>
          </div>

          <div className="flex items-center gap-6 mt-16 text-[#2E3A31]">
             <div className="h-[1px] w-12 sm:w-24 bg-[#D98880]"></div>
             <div className="flex flex-col items-center">
               <span className="text-xl sm:text-2xl font-serif">{monthStr}</span>
               <span className="text-3xl sm:text-4xl font-serif font-bold my-1 text-[#D98880]">{dayNum}</span>
               <span className="text-xl sm:text-2xl font-serif">{yearStr}</span>
             </div>
             <div className="h-[1px] w-12 sm:w-24 bg-[#D98880]"></div>
          </div>
          
          <span className="text-sm sm:text-base font-sans tracking-[0.2em] text-[#8A9A8E] uppercase mt-12">
            {location}
          </span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="mb-6 opacity-60">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D98880" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
              <path d="M12 8V12" />
              <path d="M12 16H12.01" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-6xl font-cursive text-[#D98880] mb-4">
            {storyTitle}
          </h2>
          <div className="w-16 h-[1px] bg-[#EAD6D8] mb-16"></div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-16 items-center">
            <div className="w-48 h-64 sm:w-64 sm:h-80 relative z-10 rounded-full overflow-hidden border-4 border-[#FFF6F7] shadow-xl p-1 bg-white">
              <div className="w-full h-full rounded-full overflow-hidden">
                {groomPhoto ? (
                  <img src={groomPhoto} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt="Groom" />
                ) : (
                  <div className="w-full h-full bg-[#FDF9F9] flex items-center justify-center font-serif text-[#8A9A8E]">Him</div>
                )}
              </div>
            </div>
            <div className="w-48 h-64 sm:w-64 sm:h-80 relative z-10 rounded-full overflow-hidden border-4 border-[#FFF6F7] shadow-xl p-1 bg-white md:mt-16">
               <div className="w-full h-full rounded-full overflow-hidden">
                 {bridePhoto ? (
                   <img src={bridePhoto} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt="Bride" />
                 ) : (
                   <div className="w-full h-full bg-[#FDF9F9] flex items-center justify-center font-serif text-[#8A9A8E]">Her</div>
                 )}
               </div>
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-serif italic leading-relaxed px-4 max-w-2xl text-[#2E3A31]">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FDF9F9]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#2E3A31] mb-4">Itinerary</h2>
            <div className="w-16 h-[1px] bg-[#D98880] mx-auto"></div>
          </div>

          <div className="flex flex-col space-y-12 sm:space-y-16 max-w-2xl mx-auto">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group">
                <div className="sm:w-1/3 flex flex-col sm:items-end">
                  <span className="font-serif text-2xl text-[#D98880]">{item.time}</span>
                  <span className="font-sans text-[10px] tracking-widest text-[#8A9A8E] uppercase mt-1">{dayName}</span>
                </div>
                <div className="hidden sm:flex flex-col items-center justify-center relative">
                  <div className="w-[1px] h-full bg-[#EAD6D8] absolute -top-8 -bottom-8 group-last:bottom-auto"></div>
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-[#D98880] relative z-10"></div>
                </div>
                <div className="sm:w-2/3 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#2E3A31] mb-2">{item.event}</h3>
                  <p className="font-sans text-[#8A9A8E] text-sm uppercase tracking-wider">{item.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
          {venuePhoto && (
            <div className="w-full md:w-1/2">
              <div className="relative p-4 bg-[#FFF6F7]">
                 <img src={venuePhoto} alt="Venue" className="w-full aspect-[4/5] object-cover shadow-sm" />
                 <div className="absolute inset-0 border border-[#D98880]/30 m-2 pointer-events-none"></div>
              </div>
            </div>
          )}
          
          <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
             <h2 className="text-3xl sm:text-5xl font-serif text-[#2E3A31]">The Location</h2>
             <div className="w-12 h-[1px] bg-[#D98880] mx-auto md:mx-0"></div>
             
             <p className="text-lg font-sans text-[#2E3A31] leading-relaxed max-w-md mx-auto md:mx-0">
               {location}
             </p>

             <div className="pt-4 flex justify-center md:justify-start">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 border border-[#D98880] bg-[#FFF6F7] hover:bg-[#D98880] hover:text-white text-[#D98880] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-full"
                 >
                   <MapPin size={14} />
                   View on Map
                 </a>
               )}
             </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-4 sm:px-6 relative z-10 bg-[#FFF6F7]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-4xl sm:text-6xl font-cursive text-[#D98880] mb-4">A Glimpse of Us</h2>
             <div className="w-16 h-[1px] bg-[#EAD6D8] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className={`overflow-hidden rounded-tr-3xl rounded-bl-3xl shadow-sm ${index % 4 === 0 ? 'row-span-2 aspect-[2/3]' : 'aspect-square'}`}>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-4 sm:px-6 relative z-10 bg-white border-b border-[#FDF9F9]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-serif text-[#2E3A31] mb-12">Counting the Days</h3>

          <div className="flex flex-wrap gap-4 sm:gap-10 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-[#EAD6D8] bg-[#FDF9F9]">
                <span className="text-2xl sm:text-4xl font-serif text-[#D98880] mb-1">{item.value}</span>
                <span className="text-[9px] tracking-widest uppercase font-sans text-[#8A9A8E]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FFF6F7]">
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-16 shadow-xl rounded-2xl relative overflow-hidden">
          {/* Floral graphic corner */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/floral-texture.png')] mix-blend-multiply rounded-bl-full pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl font-cursive text-[#D98880] mb-2">RSVP</h2>
            <p className="text-[#8A9A8E] font-sans text-xs tracking-[0.15em] uppercase">Please Respond By April 1st</p>
          </div>

          <form className="space-y-6 font-sans relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-[#FDF9F9] border-none px-4 py-4 rounded-lg outline-none focus:ring-1 focus:ring-[#D98880] transition-shadow text-[#2E3A31] text-sm placeholder-[#A3B1A7]" placeholder="Name(s) of Guest(s)" />
            </div>

            <div>
              <textarea rows={3} className="w-full bg-[#FDF9F9] border-none px-4 py-4 rounded-lg outline-none focus:ring-1 focus:ring-[#D98880] transition-shadow text-[#2E3A31] text-sm placeholder-[#A3B1A7] resize-none" placeholder="Any dietary restrictions or special notes?"></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#FDF9F9] rounded-lg hover:bg-[#FDECEE] transition-colors flex-1 justify-center">
                <input type="radio" name="attending" className="w-4 h-4 accent-[#D98880]" />
                <span className="text-[#2E3A31] uppercase tracking-wider text-xs font-semibold">Accepts with Pleasure</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#FDF9F9] rounded-lg hover:bg-[#FDECEE] transition-colors flex-1 justify-center">
                <input type="radio" name="attending" className="w-4 h-4 accent-[#D98880]" />
                <span className="text-[#2E3A31] uppercase tracking-wider text-xs font-semibold">Declines with Regret</span>
              </label>
            </div>

            <div className="pt-6">
              <button type="button" className="w-full bg-[#D98880] hover:bg-[#C2736C] text-white font-sans font-bold tracking-[0.2em] uppercase text-xs py-4 rounded-full transition-colors shadow-md shadow-[#D98880]/30">
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#FFF6F7] relative text-[#2E3A31] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Opening Floral Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 bg-transparent ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer`}
      >
        <div className={`absolute inset-0 bg-[#FFF6F7] transition-all duration-[1500ms] ease-in-out z-10 ${isOpening ? 'scale-150 opacity-0 blur-md' : 'scale-100 opacity-100'}`}>
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/floral-texture.png')] mix-blend-multiply"></div>
        </div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isOpening ? 'opacity-0 scale-125' : 'opacity-100 scale-100'}`}>
           <div className="w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full border-[1px] border-[#D98880] bg-white p-6 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
             
             <div className="absolute inset-0 bg-[#FFF6F7] rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-[800ms] ease-out z-0"></div>

             <div className="relative z-10 flex flex-col items-center">
               <h3 className="text-[#D98880] font-sans text-[10px] uppercase tracking-[0.3em] mb-4">Together with their families</h3>
               
               <div className="font-cursive text-5xl sm:text-6xl text-[#2E3A31] leading-tight mb-2">
                 {groomFullName}
               </div>
               <span className="font-sans text-sm text-[#D98880] tracking-widest block my-1">&amp;</span>
               <div className="font-cursive text-5xl sm:text-6xl text-[#2E3A31] leading-tight mb-6">
                 {brideFullName}
               </div>

               <div className="mt-4 text-[#2E3A31] bg-transparent border border-[#D98880] rounded-full px-8 py-3 text-[10px] font-sans font-bold uppercase tracking-[0.2em] group-hover:bg-[#D98880] group-hover:text-white group-hover:border-transparent transition-colors duration-500">
                 Tap to Open
               </div>
             </div>
           </div>
        </div>

        {/* Petals exploding out on open */}
        {isOpening && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="absolute text-[#D98880]"
                style={{
                  left: '50%',
                  top: '50%',
                  fontSize: `${10 + Math.random() * 20}px`,
                  animation: `explodePetal ${1 + Math.random()}s ease-out forwards`,
                  transformOrigin: 'center center',
                  ['--tx' as any]: `${(Math.random() - 0.5) * 200}vw`,
                  ['--ty' as any]: `${(Math.random() - 0.5) * 200}vh`,
                  ['--rot' as any]: `${Math.random() * 720}deg`
                }}
              >
                🌸
              </div>
            ))}
            <style>{`
              @keyframes explodePetal {
                0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 0; }
              }
            `}</style>
          </div>
        )}
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-white text-[#8A9A8E] w-full border-t border-[#FFF6F7]">
        <h2 className="text-xl font-serif text-[#D98880]">{rawCoupleNames}</h2>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg shadow-black/10 border border-[#D98880]/30 flex items-center justify-center text-[#D98880] hover:bg-white hover:scale-105 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-white rounded-full shadow-lg border border-[#EAD6D8] flex items-center justify-center text-[#D98880] hover:scale-110 hover:bg-[#D98880] hover:text-white transition-all duration-300 ${isCounterPopping ? 'scale-125' : ''}`}
      >
        <Heart size={24} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#D98880] text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
