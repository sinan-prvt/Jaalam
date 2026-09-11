import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, ArrowDown, Sparkles, Navigation, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function MinimalEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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
  const groomFullName = (parts[0]?.trim() || "ALEXANDER");
  const brideFullName = (parts[1]?.trim() || "ISABELLA");

  const story = content?.about_text || "A new chapter begins. We are thrilled to invite you to celebrate our engagement.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "The Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, August 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'August');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '6:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Modern Art Museum, City Center";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "6:00 PM", event: "Cocktails", date: rawDateStr, venue: location },
      { time: "7:30 PM", event: "Dinner", date: rawDateStr, venue: location },
      { time: "9:00 PM", event: "After Party", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-08-15T18:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Less is more. Love is everything.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FDFDFD] text-[#1A1A1A] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;700&display=swap');
          .font-serif { font-family: 'Cormorant Garamond', serif; }
          .font-sans { font-family: 'Outfit', sans-serif; }
          .minimal-border { border: 1px solid #E5E5E5; }
        `}</style>
        
        <div className="absolute inset-8 sm:inset-12 border-[1px] border-[#E5E5E5] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20 mt-10">
          <span className="text-[10px] sm:text-xs font-sans tracking-[0.4em] uppercase text-[#666] mb-16 sm:mb-24">
            {quoteText}
          </span>

          <h1 className="text-4xl sm:text-7xl font-sans font-light text-[#1A1A1A] tracking-wider mb-2">
            {groomFullName}
          </h1>
          <span className="text-2xl sm:text-4xl font-serif italic text-[#999] my-4">&amp;</span>
          <h2 className="text-4xl sm:text-7xl font-sans font-light text-[#1A1A1A] tracking-wider mt-2">
            {brideFullName}
          </h2>

          <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-xs sm:text-sm font-sans tracking-[0.2em] text-[#1A1A1A] uppercase mb-4">
               {monthStr} {dayNum}, {yearStr}
            </span>
            <div className="w-[1px] h-12 sm:h-24 bg-[#E5E5E5]"></div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 sm:py-48 px-4 sm:px-6 relative z-10 bg-[#FDFDFD]">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-sm font-sans uppercase tracking-[0.5em] text-[#999] mb-16">
            {storyTitle}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-24 w-full">
            <div className="w-full md:w-1/2 aspect-[3/4] relative z-10 bg-[#F5F5F0] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover" alt="Groom" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-sans font-light text-[#999] tracking-widest uppercase text-xs">His Photo</div>
              )}
            </div>
            <div className="w-full md:w-1/2 aspect-[3/4] relative z-10 bg-[#F5F5F0] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 md:mt-24">
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-full h-full object-cover" alt="Bride" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center font-sans font-light text-[#999] tracking-widest uppercase text-xs">Her Photo</div>
               )}
            </div>
          </div>

          <p className="text-2xl sm:text-4xl font-serif italic leading-relaxed text-center max-w-2xl text-[#1A1A1A]">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FDFDFD]">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-sm font-sans uppercase tracking-[0.5em] text-[#999] mb-20 text-center">Itinerary</h2>

          <div className="flex flex-col">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row border-t border-[#E5E5E5] py-10 group hover:bg-[#FAFAFA] transition-colors">
                <div className="sm:w-1/3 mb-4 sm:mb-0 sm:pr-8 flex flex-col justify-center">
                  <span className="font-sans text-sm tracking-[0.2em] text-[#1A1A1A] uppercase">{item.time}</span>
                </div>
                <div className="sm:w-2/3 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] mb-2">{item.event}</h3>
                  <p className="font-sans text-[#999] text-xs uppercase tracking-widest">{item.venue}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-[#E5E5E5]"></div>
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#1A1A1A] text-[#FDFDFD]">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
             <h2 className="text-sm font-sans uppercase tracking-[0.5em] text-[#999]">The Venue</h2>
             
             <p className="text-3xl sm:text-5xl font-serif leading-tight">
               {location}
             </p>

             <div className="pt-8 flex justify-center lg:justify-start">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 border border-[#FDFDFD] hover:bg-[#FDFDFD] hover:text-[#1A1A1A] px-10 py-4 font-sans text-xs tracking-[0.3em] uppercase transition-all duration-300"
                 >
                   Directions
                 </a>
               )}
             </div>
          </div>

          {venuePhoto && (
            <div className="w-full lg:w-1/2">
              <div className="aspect-[3/4] overflow-hidden grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-4 sm:px-6 relative z-10 bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-24 text-center">
             <h2 className="text-sm font-sans uppercase tracking-[0.5em] text-[#999]">Gallery</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="overflow-hidden aspect-square relative group bg-[#F5F5F0]">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" />
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors m-4 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-4 sm:px-6 relative z-10 bg-[#F5F5F0]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap gap-8 sm:gap-16 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl font-sans font-light text-[#1A1A1A] tracking-tighter mb-4">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#999]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 sm:py-48 px-4 sm:px-6 relative z-10 bg-[#FDFDFD]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-sans uppercase tracking-[0.5em] text-[#999] mb-4">RSVP</h2>
            <p className="text-[#1A1A1A] font-serif text-2xl italic mt-6">Kindly respond by July 15th</p>
          </div>

          <form className="space-y-10 font-sans" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#E5E5E5] px-0 py-4 outline-none focus:border-[#1A1A1A] transition-colors text-[#1A1A1A] text-sm tracking-widest uppercase placeholder-[#999]" placeholder="Guest Name(s)" />
            </div>

            <div>
              <textarea rows={2} className="w-full bg-transparent border-b border-[#E5E5E5] px-0 py-4 outline-none focus:border-[#1A1A1A] transition-colors text-[#1A1A1A] text-sm tracking-widest uppercase placeholder-[#999] resize-none" placeholder="Dietary Restrictions"></textarea>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-6 justify-center">
              <label className="flex items-center gap-4 cursor-pointer flex-1 group">
                <div className="w-5 h-5 border border-[#E5E5E5] group-hover:border-[#1A1A1A] flex items-center justify-center transition-colors">
                  <input type="radio" name="attending" className="w-3 h-3 accent-[#1A1A1A] opacity-0 checked:opacity-100" />
                </div>
                <span className="text-[#1A1A1A] uppercase tracking-widest text-xs">Accept</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer flex-1 group">
                <div className="w-5 h-5 border border-[#E5E5E5] group-hover:border-[#1A1A1A] flex items-center justify-center transition-colors">
                  <input type="radio" name="attending" className="w-3 h-3 accent-[#1A1A1A] opacity-0 checked:opacity-100" />
                </div>
                <span className="text-[#1A1A1A] uppercase tracking-widest text-xs">Decline</span>
              </label>
            </div>

            <div className="pt-12">
              <button type="button" className="w-full bg-[#1A1A1A] hover:bg-[#333] text-[#FDFDFD] font-sans tracking-[0.4em] uppercase text-xs py-5 transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#FDFDFD] relative text-[#1A1A1A] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Opening Minimal Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 bg-transparent ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer`}
      >
        <div className={`absolute inset-0 bg-[#FDFDFD] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-10 ${isOpening ? '-translate-y-full' : 'translate-y-0'}`}>
        </div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-opacity duration-500 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
           <div className="flex flex-col items-center text-center">
             
             <span className="text-[#999] font-sans text-[10px] uppercase tracking-[0.5em] mb-12">Engagement</span>
             
             <div className="font-sans font-light text-3xl sm:text-4xl text-[#1A1A1A] tracking-widest mb-4">
               {groomFullName}
             </div>
             <span className="font-serif italic text-2xl text-[#999] my-2">&amp;</span>
             <div className="font-sans font-light text-3xl sm:text-4xl text-[#1A1A1A] tracking-widest mt-4 mb-16">
               {brideFullName}
             </div>

             <div className="flex flex-col items-center gap-4 group">
               <span className="text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-500">
                 Tap to Enter
               </span>
               <ArrowDown size={14} className="text-[#999] animate-bounce" />
             </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-24 relative z-10 text-center bg-[#1A1A1A] text-[#FDFDFD] w-full">
        <h2 className="text-[9px] font-sans tracking-[0.4em] uppercase text-[#6B7280]">{rawCoupleNames}</h2>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-white rounded-full shadow-lg shadow-black/5 border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A] hover:bg-[#F9FAFB] hover:scale-105 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Minimal Floating Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-white rounded-full shadow-lg border border-[#E5E5E5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 ${isCounterPopping ? 'scale-110' : ''}`}
      >
        <Heart size={20} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[9px] tracking-widest w-6 h-6 flex items-center justify-center rounded-full">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
