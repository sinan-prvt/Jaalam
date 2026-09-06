import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation, ArrowUpRight } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function EngagementMinimalLayout({ content, website, colors }: WeddingLayoutProps) {
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
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1800);
  };

  const rawCoupleNames = content?.hero_title || "Alex & Jamie";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ALEX");
  const brideFullName = (parts[1]?.trim() || "JAMIE");

  const story = content?.about_text || "A quiet moment. A simple question. A lifelong promise. We invite you to share in our joy.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "The Engagement";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "10.10.2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: '2-digit' }) : '10');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()).padStart(2, '0') : '10');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()).slice(-2) : '26');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '18:00';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Minimalist Gallery, West End";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "18:00", event: "Drinks Reception", date: rawDateStr, venue: location },
      { time: "19:30", event: "Dinner & Toasts", date: rawDateStr, venue: location },
      { time: "21:00", event: "Music & Celebration", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T18:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Less, but better.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#F9F9F9] text-[#111111] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .outline-text {
            color: transparent;
            -webkit-text-stroke: 1px #111111;
          }
        `}</style>

        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#E5E5E5]"></div>
        <div className="absolute top-0 left-6 w-[1px] h-full bg-[#E5E5E5]"></div>
        <div className="absolute top-0 right-6 w-[1px] h-full bg-[#E5E5E5]"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-12 py-20 flex flex-col items-center justify-center h-full">
          
          <span className="text-[9px] sm:text-[10px] font-inter tracking-[0.5em] uppercase text-[#666] mb-24">
            {quoteText}
          </span>

          <div className="flex flex-col items-center justify-center relative w-full">
            <h1 className="text-7xl sm:text-[9rem] font-inter font-light tracking-tighter text-[#111111] uppercase leading-[0.85] z-10 bg-[#F9F9F9] px-4">
              {groomFullName}
            </h1>
            <span className="text-3xl font-inter font-light text-[#A0A0A0] my-4 z-10 bg-[#F9F9F9] px-4">/</span>
            <h2 className="text-7xl sm:text-[9rem] font-inter font-light tracking-tighter outline-text uppercase leading-[0.85] z-10 bg-[#F9F9F9] px-4">
              {brideFullName}
            </h2>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#111111] z-0 -translate-y-1/2"></div>
          </div>

          <div className="mt-32 flex items-center gap-12 font-inter text-xs tracking-widest uppercase text-[#666]">
            <span>{dayNum}.{monthStr}.{yearStr}</span>
            <span className="w-1 h-1 bg-[#111111] rounded-full"></span>
            <span>{location}</span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/5] bg-[#F4F4F4] overflow-hidden p-2">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700" alt="Couple" />
              ) : (
                <div className="w-full h-full bg-[#E5E5E5] flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">Image Placeholder</span>
                </div>
              )}
            </div>
            {/* Absolute offset image if bride photo exists */}
            {bridePhoto && (
               <div className="absolute -bottom-16 -right-8 w-48 aspect-[3/4] bg-white p-2 shadow-2xl hidden md:block">
                 <img src={bridePhoto} className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700" alt="Couple Details" />
               </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[9px] font-inter tracking-[0.4em] uppercase text-[#A0A0A0] mb-8">01 — {storyTitle}</span>
            <p className="text-2xl sm:text-4xl text-[#111111] font-inter font-light leading-[1.4] tracking-tight">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#111111] text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-[9px] font-inter tracking-[0.4em] uppercase text-[#666] mb-16 block">02 — Itinerary</span>

          <div className="flex flex-col border-t border-[#333]">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row items-baseline py-10 border-b border-[#333] group hover:bg-[#1A1A1A] transition-colors -mx-6 px-6 sm:-mx-12 sm:px-12">
                <div className="w-32 font-inter text-sm font-light text-[#888] group-hover:text-white transition-colors mb-2 md:mb-0">
                  {item.time}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="text-2xl sm:text-3xl font-inter font-light tracking-tight">{item.event}</h3>
                </div>
                <div className="text-[10px] font-inter text-[#666] uppercase tracking-widest mt-4 md:mt-0 text-right">
                  {item.venue || location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#F9F9F9] text-[#111111]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">
          
          <div className="flex-1 lg:pr-24 flex flex-col justify-center border-l border-[#E5E5E5] pl-8 sm:pl-12 mb-16 lg:mb-0">
            <span className="text-[9px] font-inter tracking-[0.4em] uppercase text-[#A0A0A0] mb-8">03 — Location</span>
            
            <p className="text-4xl sm:text-6xl font-inter font-light uppercase tracking-tighter leading-none mb-12">
              {location}
            </p>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 text-[#111111] hover:text-[#666] font-inter text-[11px] tracking-[0.2em] uppercase transition-colors border-b border-[#111111] pb-2 w-max"
              >
                View Map <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          <div className="flex-1 w-full">
            {venuePhoto ? (
              <div className="w-full aspect-[4/3] bg-white p-2">
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover filter grayscale" />
              </div>
            ) : (
               <div className="w-full aspect-[4/3] bg-[#E5E5E5] flex items-center justify-center p-2">
                 <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">Venue Image</span>
               </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-white border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <span className="text-[9px] font-inter tracking-[0.4em] uppercase text-[#A0A0A0] mb-16 block text-center">04 — Archives</span>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-square bg-[#F4F4F4] p-1 overflow-hidden">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#F9F9F9] text-[#111111]">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-[9px] font-inter tracking-[0.4em] uppercase text-[#A0A0A0] mb-20 block">05 — T-Minus</span>
          
          <div className="flex gap-4 sm:gap-16 justify-center w-full">
            {[
              { label: 'DD', value: timeLeft?.d ?? 0 },
              { label: 'HH', value: timeLeft?.h ?? 0 },
              { label: 'MM', value: timeLeft?.m ?? 0 },
              { label: 'SS', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 relative">
                {idx !== 0 && <div className="absolute left-[-50%] top-1/2 -translate-y-1/2 text-2xl font-light text-[#D0D0D0]">:</div>}
                <span className="text-5xl sm:text-8xl font-inter font-light tracking-tighter mb-4">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-inter text-[#666]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto">
          <span className="text-[9px] font-inter tracking-[0.4em] uppercase text-[#A0A0A0] mb-16 block text-center">06 — RSVP</span>

          <div className="border border-[#111111] p-8 sm:p-16">
            <form className="space-y-10 font-inter" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#666] mb-2">Guest Name</label>
                <input type="text" className="w-full bg-transparent border-b border-[#E5E5E5] px-0 py-4 outline-none focus:border-[#111111] transition-colors text-[#111111] text-sm" placeholder="Enter full name" />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#666] mb-2">Message</label>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#E5E5E5] px-0 py-4 outline-none focus:border-[#111111] transition-colors text-[#111111] text-sm resize-none" placeholder="Any dietary requirements?"></textarea>
              </div>

              <div className="pt-4">
                <label className="block text-[10px] tracking-widest uppercase text-[#666] mb-6">Attendance</label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-4 cursor-pointer group flex-1">
                    <div className="w-4 h-4 border border-[#E5E5E5] rounded-full group-hover:border-[#111111] flex items-center justify-center transition-colors">
                       <input type="radio" name="attending" className="w-2 h-2 opacity-0 group-hover:opacity-100 bg-[#111111] rounded-full appearance-none transition-all" />
                    </div>
                    <span className="text-[#111111] uppercase tracking-widest text-[11px] font-medium">Attending</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group flex-1">
                    <div className="w-4 h-4 border border-[#E5E5E5] rounded-full group-hover:border-[#111111] flex items-center justify-center transition-colors">
                       <input type="radio" name="attending" className="w-2 h-2 opacity-0 group-hover:opacity-100 bg-[#111111] rounded-full appearance-none transition-all" />
                    </div>
                    <span className="text-[#111111] uppercase tracking-widest text-[11px] font-medium">Declining</span>
                  </label>
                </div>
              </div>

              <div className="pt-12 border-t border-[#E5E5E5]">
                <button type="button" className="w-full bg-[#111111] hover:bg-[#333] text-white font-inter font-medium tracking-[0.2em] uppercase text-[10px] py-6 transition-colors">
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
    <div className={`min-h-screen bg-[#F9F9F9] relative text-[#111111] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Floating Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-white/90 backdrop-blur-sm border border-[#E5E5E5] rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
        </button>
      )}

      {/* Minimalist Line Reveal Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[2000ms] ease-in-out bg-[#F9F9F9] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          .split-left { clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%); }
          .split-right { clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%); }
          
          @keyframes drawLine {
            0% { height: 0; opacity: 0; }
            40% { height: 100%; opacity: 1; }
            80% { height: 100%; opacity: 1; }
            100% { height: 100%; opacity: 0; }
          }
        `}</style>
        
        {/* Left Panel */}
        <div className={`absolute inset-0 bg-white split-left transition-transform duration-[1500ms] ease-[cubic-bezier(0.85,0,0.15,1)] z-10 ${isOpening ? '-translate-x-[50vw]' : 'translate-x-0'}`}>
        </div>

        {/* Right Panel */}
        <div className={`absolute inset-0 bg-white split-right transition-transform duration-[1500ms] ease-[cubic-bezier(0.85,0,0.15,1)] z-10 ${isOpening ? 'translate-x-[50vw]' : 'translate-x-0'}`}>
        </div>

        {/* Central Vertical Draw Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#111111] z-20 animate-[drawLine_2.5s_ease-in-out_forwards]"></div>

        {/* Central Entrance Text */}
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-[800ms] ease-in-out ${isOpening ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 delay-[800ms]'}`}>
           
           <div className="bg-white px-8 py-12 flex flex-col items-center">
             <span className="text-[9px] font-inter tracking-[0.5em] uppercase text-[#666] mb-6">
               Engagement
             </span>
             <h1 className="text-3xl font-inter font-light text-[#111111] tracking-widest uppercase text-center leading-relaxed">
               {groomFullName[0]} &amp; {brideFullName[0]}
             </h1>
             <div className="mt-12 text-[9px] font-inter uppercase tracking-widest text-[#111111] border-b border-[#111111] pb-1 animate-pulse">
               Tap to reveal
             </div>
           </div>
           
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-24 relative z-10 text-center bg-white text-[#A0A0A0] w-full border-t border-[#E5E5E5]">
        <h2 className="text-[10px] font-inter tracking-[0.4em] uppercase">{rawCoupleNames}</h2>
      </footer>

    </div>
  );
}
