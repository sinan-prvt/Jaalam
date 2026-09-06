import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation, ArrowRight } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function EngagementModernLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);

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
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1500);
  };

  const rawCoupleNames = content?.hero_title || "Alex & Jamie";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ALEX");
  const brideFullName = (parts[1]?.trim() || "JAMIE");

  const story = content?.about_text || "We're taking the next big step! Join us for a modern celebration of love and commitment.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "THE PROPOSAL";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'OCT');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Glasshouse, Downtown Arts District";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "20:00", event: "Arrival & Cocktails", date: rawDateStr, venue: location },
      { time: "21:30", event: "Toast & Hors d'oeuvres", date: rawDateStr, venue: location },
      { time: "23:00", event: "Afterparty & DJ", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T20:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "MODERN LOVE";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-start text-left bg-[#0A0A0A] text-white p-0 overflow-hidden min-h-screen pt-20">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@200;300;400;500;700&display=swap');
          .font-space { font-family: 'Space Grotesk', sans-serif; }
          .font-outfit { font-family: 'Outfit', sans-serif; }
          .gradient-text { background: linear-gradient(135deg, #FFFFFF 0%, #A3A3A3 100%); -webkit-background-clip: text; color: transparent; }
          .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
        `}</style>

        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-b from-[#3B82F6]/10 to-[#8B5CF6]/10 blur-[100px]"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-[#EC4899]/10 to-[#8B5CF6]/10 blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 py-10 flex flex-col h-full justify-between">
          
          <div className="flex items-center gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-8 h-[2px] bg-white/50"></div>
            <span className="text-xs sm:text-sm font-space tracking-[0.4em] uppercase text-white/70">
              ENGAGEMENT CELEBRATION
            </span>
          </div>

          <div className="flex flex-col gap-2 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h1 className="text-7xl sm:text-9xl font-outfit font-bold tracking-tighter text-white uppercase leading-[0.9]">
              {groomFullName}
            </h1>
            <h1 className="text-7xl sm:text-9xl font-outfit font-bold tracking-tighter text-white/20 uppercase leading-[0.9] ml-12 sm:ml-24">
              &amp; {brideFullName}
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-space tracking-widest text-white/50 uppercase">Date</span>
              <span className="text-base sm:text-xl font-outfit font-light">{dayNum} {monthStr} {yearStr}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-space tracking-widest text-white/50 uppercase">Time</span>
              <span className="text-base sm:text-xl font-outfit font-light">{timeStr}</span>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <span className="text-[10px] font-space tracking-widest text-white/50 uppercase">Location</span>
              <span className="text-base sm:text-xl font-outfit font-light truncate">{location}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#0A0A0A] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/20 to-[#EC4899]/20 blur-2xl transform group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative aspect-[3/4] glass-panel p-4 overflow-hidden rounded-2xl">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-700" alt="Couple" />
              ) : (
                <div className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-space tracking-[0.4em] uppercase text-[#EC4899] font-bold">01 —</span>
               <h2 className="text-2xl sm:text-3xl font-outfit font-bold tracking-tight uppercase">{storyTitle}</h2>
            </div>
            
            <p className="text-lg sm:text-2xl text-white/70 font-space font-light leading-relaxed">
              {story}
            </p>
            
            <div className="w-24 h-[1px] bg-gradient-to-r from-[#3B82F6] to-[#EC4899] mt-4"></div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#121212] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
             <span className="text-[10px] font-space tracking-[0.4em] uppercase text-[#3B82F6] font-bold">02 —</span>
             <h2 className="text-2xl sm:text-3xl font-outfit font-bold tracking-tight uppercase">Itinerary</h2>
          </div>

          <div className="flex flex-col">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center py-8 border-t border-white/10 group hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-lg">
                <div className="w-48 font-space text-3xl font-light text-white/40 group-hover:text-white transition-colors mb-4 md:mb-0">
                  {item.time}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="text-xl sm:text-2xl font-outfit font-semibold tracking-tight">{item.event}</h3>
                  <span className="text-sm font-space text-white/50 uppercase tracking-widest">{item.venue || location}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-white/0 group-hover:text-[#EC4899] transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 hidden md:block" />
              </div>
            ))}
            <div className="border-t border-white/10 w-full"></div>
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#0A0A0A] text-white">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 flex flex-col gap-8 w-full">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-space tracking-[0.4em] uppercase text-[#8B5CF6] font-bold">03 —</span>
               <h2 className="text-2xl sm:text-3xl font-outfit font-bold tracking-tight uppercase">Location</h2>
            </div>
            
            <p className="text-3xl sm:text-5xl font-outfit font-bold uppercase tracking-tighter leading-tight gradient-text">
              {location}
            </p>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-3 bg-white text-[#0A0A0A] hover:bg-white/90 px-8 py-4 font-space font-bold text-xs tracking-widest uppercase transition-all rounded-full w-full sm:w-auto"
              >
                <Navigation size={14} />
                Get Directions
              </a>
            )}
          </div>

          <div className="flex-1 w-full">
            {venuePhoto ? (
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel relative group">
                 <div className="absolute inset-0 bg-[#8B5CF6]/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700"></div>
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" />
              </div>
            ) : (
               <div className="w-full aspect-[4/3] rounded-2xl glass-panel bg-white/5 flex items-center justify-center">
                 <MapPin className="w-12 h-12 text-white/20" />
               </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#121212] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-space tracking-[0.4em] uppercase text-white/50 font-bold">04 —</span>
               <h2 className="text-2xl sm:text-3xl font-outfit font-bold tracking-tight uppercase">Gallery</h2>
            </div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid rounded-xl overflow-hidden glass-panel group relative">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm z-10">
                   <Sparkles className="text-white w-8 h-8 opacity-50" />
                </div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#0A0A0A] text-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
           <span className="text-[30vw] font-outfit font-bold tracking-tighter whitespace-nowrap">SOON</span>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="flex gap-4 sm:gap-12 justify-center w-full">
            {[
              { label: 'DD', value: timeLeft?.d ?? 0 },
              { label: 'HH', value: timeLeft?.h ?? 0 },
              { label: 'MM', value: timeLeft?.m ?? 0 },
              { label: 'SS', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <span className="text-5xl sm:text-8xl font-outfit font-bold tracking-tighter mb-2 tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-space text-white/40">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#121212] text-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-16 justify-center">
             <span className="text-[10px] font-space tracking-[0.4em] uppercase text-[#EC4899] font-bold">05 —</span>
             <h2 className="text-2xl sm:text-3xl font-outfit font-bold tracking-tight uppercase">RSVP</h2>
          </div>

          <div className="glass-panel p-8 sm:p-12 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899]"></div>
            
            <form className="space-y-8 font-space" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-white text-sm placeholder-white/30" placeholder="Full Name(s)" />
              </div>

              <div>
                <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-white text-sm placeholder-white/30 resize-none" placeholder="Message or Dietary Requirements"></textarea>
              </div>

              <div className="pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex-1">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#EC4899]" />
                    <span className="text-white uppercase tracking-widest text-xs font-bold">Attending</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex-1">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#EC4899]" />
                    <span className="text-white uppercase tracking-widest text-xs font-bold">Declining</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button type="button" className="w-full bg-white hover:bg-white/90 text-[#0A0A0A] font-space font-bold tracking-[0.2em] uppercase text-xs py-5 rounded-lg transition-all flex justify-center items-center gap-2">
                  Send Response <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] relative text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Modern Iris/Split Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1500ms] bg-[#0A0A0A] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          .split-top { clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); }
          .split-bottom { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%); }
        `}</style>
        
        {/* Top Half Panel */}
        <div className={`absolute inset-0 bg-[#121212] split-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 flex flex-col justify-end items-center pb-2 ${isOpening ? '-translate-y-full' : 'translate-y-0'}`}>
           <h1 className="text-6xl sm:text-8xl font-outfit font-bold tracking-tighter text-white uppercase translate-y-[50%]">
             {groomFullName}
           </h1>
        </div>

        {/* Bottom Half Panel */}
        <div className={`absolute inset-0 bg-[#121212] split-bottom transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 flex flex-col justify-start items-center pt-2 ${isOpening ? 'translate-y-full' : 'translate-y-0'}`}>
           <h1 className="text-6xl sm:text-8xl font-outfit font-bold tracking-tighter text-white uppercase -translate-y-[50%]">
             &amp; {brideFullName}
           </h1>
           <div className="absolute bottom-16 w-full text-center">
             <span className="text-[10px] font-space tracking-[0.4em] uppercase text-white/50 animate-pulse">Tap Anywhere</span>
           </div>
        </div>

        {/* Center Geometric Unlock Line */}
        <div className={`absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EC4899] to-transparent z-20 transition-all duration-700 ease-in-out ${isOpening ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}></div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-[#0A0A0A] text-white/50 w-full border-t border-white/5">
        <h2 className="text-sm font-outfit font-bold tracking-[0.2em] uppercase">{rawCoupleNames}</h2>
      </footer>

    </div>
  );
}
