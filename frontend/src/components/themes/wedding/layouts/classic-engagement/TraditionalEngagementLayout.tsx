import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Navigation, Compass, CircleDot, Volume2, VolumeX } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function TraditionalEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "With the blessings of our elders and the grace of the divine, we invite you to our engagement ceremony.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Auspicious Beginning";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, November 28, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'November');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '28');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '10:00 AM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Heritage Palace Gardens";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "10:00 AM", event: "Welcome & High Tea", date: rawDateStr, venue: location },
      { time: "11:30 AM", event: "Ring Ceremony", date: rawDateStr, venue: location },
      { time: "1:00 PM", event: "Grand Feast", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-11-28T10:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Two families unite, two hearts become one.";

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

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FDFBF7] text-[#6B1724] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          .font-serif { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Lato', sans-serif; }
          .gold-border { border: 2px solid #D4AF37; }
        `}</style>
        
        {/* Ornate Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply pointer-events-none"></div>

        {/* Traditional Gold Borders */}
        <div className="absolute inset-4 sm:inset-8 border-2 border-[#D4AF37]/40 pointer-events-none z-0">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37] -translate-x-1 -translate-y-1"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37] translate-x-1 -translate-y-1"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37] -translate-x-1 translate-y-1"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37] translate-x-1 translate-y-1"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20 mt-10">
          <div className="mb-12">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="text-[#D4AF37] opacity-80">
              <path d="M50 0L55 40L95 50L55 60L50 100L45 60L5 50L45 40L50 0Z" fill="currentColor"/>
            </svg>
          </div>

          <h1 className="text-4xl sm:text-7xl font-serif text-[#6B1724] tracking-wider mb-2 font-semibold">
            {groomFullName}
          </h1>
          <span className="text-3xl sm:text-5xl font-serif italic text-[#D4AF37] my-4">&amp;</span>
          <h2 className="text-4xl sm:text-7xl font-serif text-[#6B1724] tracking-wider mt-2 font-semibold">
            {brideFullName}
          </h2>

          <div className="mt-16 flex flex-col items-center">
            <span className="text-xs sm:text-sm font-sans tracking-[0.2em] text-[#6B1724] uppercase mb-4 font-bold">
               {monthStr} {dayNum}, {yearStr}
            </span>
            <div className="w-[2px] h-16 sm:h-24 bg-[#D4AF37]"></div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white border-y-[6px] border-[#6B1724]">
        {/* Subtle texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <CircleDot size={12} className="text-[#D4AF37]" />
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest text-[#6B1724]">
              {storyTitle}
            </h2>
            <CircleDot size={12} className="text-[#D4AF37]" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-16 w-full">
            <div className="w-full md:w-1/2 aspect-[3/4] relative z-10 p-2 border-2 border-[#D4AF37] bg-white overflow-hidden shadow-xl">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover" alt="Groom" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-sans font-bold text-[#D4AF37] tracking-widest uppercase text-xs bg-[#FDFBF7]">His Photo</div>
              )}
            </div>
            <div className="w-full md:w-1/2 aspect-[3/4] relative z-10 p-2 border-2 border-[#D4AF37] bg-white overflow-hidden shadow-xl md:mt-16">
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-full h-full object-cover" alt="Bride" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center font-sans font-bold text-[#D4AF37] tracking-widest uppercase text-xs bg-[#FDFBF7]">Her Photo</div>
               )}
            </div>
          </div>

          <div className="relative p-8 border border-[#D4AF37]/40 max-w-3xl text-center bg-[#FDFBF7]">
            <p className="text-xl sm:text-2xl font-serif leading-loose text-[#6B1724]">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FDFBF7]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#6B1724] mb-4">Auspicious Timings</h2>
            <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="flex flex-col gap-12">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group">
                <div className="sm:w-1/3 flex flex-col sm:items-end pt-1">
                  <span className="font-sans text-xl font-bold tracking-wider text-[#D4AF37] uppercase">{item.time}</span>
                </div>
                <div className="hidden sm:flex flex-col items-center justify-center relative">
                  <div className="w-[2px] h-[150%] bg-[#D4AF37]/30 absolute -top-[25%] group-last:h-[100%] group-last:-top-[25%] group-last:bottom-auto"></div>
                  <div className="w-4 h-4 rotate-45 bg-[#6B1724] relative z-10 outline outline-2 outline-offset-2 outline-[#D4AF37]"></div>
                </div>
                <div className="sm:w-2/3 flex flex-col">
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#6B1724] mb-2 font-semibold">{item.event}</h3>
                  <p className="font-sans text-[#6B1724]/70 text-sm uppercase tracking-widest">{item.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#6B1724] text-[#FDFBF7]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
             <h2 className="text-sm font-sans uppercase tracking-[0.5em] text-[#D4AF37] font-bold">The Venue</h2>
             
             <p className="text-3xl sm:text-5xl font-serif leading-tight">
               {location}
             </p>

             <div className="pt-8 flex justify-center lg:justify-start">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#B3932F] text-[#6B1724] px-10 py-4 font-sans text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 shadow-xl"
                 >
                   View Directions
                 </a>
               )}
             </div>
          </div>

          {venuePhoto && (
            <div className="w-full lg:w-1/2">
              <div className="p-4 bg-[#FDFBF7]/10 border-2 border-[#D4AF37] relative">
                 <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37]"></div>
                 <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37]"></div>
                 <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37]"></div>
                 <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37]"></div>
                 <img src={venuePhoto} alt="Venue" className="w-full aspect-[4/3] object-cover shadow-2xl" />
              </div>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FDFBF7]">
        <div className="absolute inset-0 z-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-3xl sm:text-5xl font-serif text-[#6B1724] mb-4">Treasured Moments</h2>
             <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="overflow-hidden aspect-square relative group p-2 border border-[#D4AF37]/30 bg-white shadow-md">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#6B1724]/0 group-hover:bg-[#6B1724]/20 transition-colors m-2 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white border-y-[6px] border-[#6B1724]">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl sm:text-4xl font-serif text-[#6B1724] mb-16 font-semibold">Counting the Days</h3>

          <div className="flex flex-wrap gap-8 sm:gap-12 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#D4AF37] bg-[#FDFBF7] shadow-xl relative">
                <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-full pointer-events-none"></div>
                <span className="text-3xl sm:text-5xl font-serif text-[#6B1724] font-bold mb-1">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#D4AF37] font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 sm:py-48 px-4 sm:px-6 relative z-10 bg-[#FDFBF7]">
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-16 border-2 border-[#D4AF37] shadow-2xl relative">
          
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#6B1724] flex items-center justify-center">
            <div className="w-8 h-8 border border-[#D4AF37] rotate-45"></div>
          </div>
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#6B1724] flex items-center justify-center">
            <div className="w-8 h-8 border border-[#D4AF37] rotate-45"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#6B1724] flex items-center justify-center">
            <div className="w-8 h-8 border border-[#D4AF37] rotate-45"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-[#6B1724] flex items-center justify-center">
            <div className="w-8 h-8 border border-[#D4AF37] rotate-45"></div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#6B1724] mb-4">RSVP</h2>
            <p className="text-[#D4AF37] font-sans font-bold text-xs uppercase tracking-[0.2em]">Please Respond By October 15th</p>
          </div>

          <form className="space-y-8 font-sans" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-[#FDFBF7] border border-[#D4AF37]/50 px-4 py-4 outline-none focus:border-[#D4AF37] transition-colors text-[#6B1724] font-medium placeholder-[#6B1724]/40" placeholder="Names of Attendees" />
            </div>

            <div>
              <textarea rows={3} className="w-full bg-[#FDFBF7] border border-[#D4AF37]/50 px-4 py-4 outline-none focus:border-[#D4AF37] transition-colors text-[#6B1724] font-medium placeholder-[#6B1724]/40 resize-none" placeholder="Any special requests or dietary needs?"></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-6 justify-center">
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-[#FDFBF7] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors flex-1 justify-center">
                <input type="radio" name="attending" className="w-4 h-4 accent-[#6B1724]" />
                <span className="text-[#6B1724] uppercase tracking-wider text-xs font-bold">Will Attend</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-[#FDFBF7] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors flex-1 justify-center">
                <input type="radio" name="attending" className="w-4 h-4 accent-[#6B1724]" />
                <span className="text-[#6B1724] uppercase tracking-wider text-xs font-bold">Unable to Attend</span>
              </label>
            </div>

            <div className="pt-8">
              <button type="button" className="w-full bg-[#6B1724] hover:bg-[#821D2D] text-[#FDFBF7] font-sans tracking-[0.3em] font-bold uppercase text-xs py-5 transition-colors shadow-lg">
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#FDFBF7] relative text-[#6B1724] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Opening Traditional Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1500ms] ease-in-out bg-[#6B1724] ${isOpened ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'} cursor-pointer overflow-hidden`}
      >
        {/* Intricate background pattern for the doors */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply"></div>
        
        {/* Left Door */}
        <div className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#6B1724] border-r-4 border-[#D4AF37] transition-transform duration-[1200ms] ease-in-out z-10 flex justify-end items-center ${isOpening ? '-translate-x-full' : 'translate-x-0'}`}>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply"></div>
           <div className="w-16 h-32 border-l-4 border-y-4 border-[#D4AF37] rounded-l-full mr-2"></div>
        </div>

        {/* Right Door */}
        <div className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#6B1724] border-l-4 border-[#D4AF37] transition-transform duration-[1200ms] ease-in-out z-10 flex justify-start items-center ${isOpening ? 'translate-x-full' : 'translate-x-0'}`}>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply"></div>
           <div className="w-16 h-32 border-r-4 border-y-4 border-[#D4AF37] rounded-r-full ml-2"></div>
        </div>

        {/* Center Plaque */}
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700 ${isOpening ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
           <div className="bg-[#FDFBF7] border-4 border-[#D4AF37] p-8 sm:p-12 shadow-2xl flex flex-col items-center relative">
             <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37] bg-[#6B1724]"></div>
             <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37] bg-[#6B1724]"></div>
             <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37] bg-[#6B1724]"></div>
             <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37] bg-[#6B1724]"></div>

             <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="text-[#D4AF37] mb-6">
               <path d="M50 0L55 40L95 50L55 60L50 100L45 60L5 50L45 40L50 0Z" fill="currentColor"/>
             </svg>
             
             <div className="font-serif text-3xl sm:text-5xl text-[#6B1724] tracking-widest uppercase mb-4 font-bold text-center">
               {groomFullName}
             </div>
             <span className="font-serif italic text-2xl text-[#D4AF37] my-2">&amp;</span>
             <div className="font-serif text-3xl sm:text-5xl text-[#6B1724] tracking-widest uppercase mt-4 mb-8 font-bold text-center">
               {brideFullName}
             </div>

             <div className="mt-4 bg-[#6B1724] text-[#FDFBF7] px-8 py-3 text-[10px] font-sans font-bold uppercase tracking-[0.3em] hover:bg-[#821D2D] transition-colors border border-[#D4AF37]">
               Tap to Open
             </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center bg-[#6B1724] text-[#D4AF37] w-full border-t-[6px] border-[#D4AF37]">
        <h2 className="text-[12px] font-sans font-bold tracking-[0.4em] uppercase">{rawCoupleNames}</h2>
        <div className="mt-4 opacity-50 flex justify-center gap-4">
           <div className="w-2 h-2 rotate-45 bg-[#D4AF37]"></div>
           <div className="w-2 h-2 rotate-45 bg-[#D4AF37]"></div>
           <div className="w-2 h-2 rotate-45 bg-[#D4AF37]"></div>
        </div>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-[#FDFBF7] rounded-none border-2 border-[#D4AF37] shadow-xl flex items-center justify-center text-[#6B1724] hover:bg-[#D4AF37] hover:text-[#FDFBF7] transition-all duration-300 rotate-45"
        >
          <div className="-rotate-45 relative flex items-center justify-center w-full h-full">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </div>
        </button>
      )}

      {/* Ornate Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#FDFBF7] rounded-none border-2 border-[#D4AF37] shadow-xl flex items-center justify-center text-[#6B1724] hover:bg-[#D4AF37] hover:text-[#FDFBF7] transition-all duration-300 rotate-45 ${isCounterPopping ? 'scale-110' : ''}`}
      >
        <div className="-rotate-45 relative flex items-center justify-center w-full h-full">
          <Heart size={24} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
          {wishCount > 0 && (
            <span className="absolute -top-4 -right-4 bg-[#6B1724] text-[#FDFBF7] border border-[#D4AF37] text-[10px] font-sans font-bold w-7 h-7 flex items-center justify-center rounded-full shadow-sm">
              {wishCount > 99 ? '99+' : wishCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
