import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function EngagementElegantLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 2000);
  };

  const rawCoupleNames = content?.hero_title || "Alex & Jamie";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ALEX");
  const brideFullName = (parts[1]?.trim() || "JAMIE");

  const story = content?.about_text || "Our journey has been nothing short of magical. Join us for an evening of elegance and celebration as we mark the beginning of our forever.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Engagement";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Pearl Hotel, Crystal Ballroom";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Champagne Reception", date: rawDateStr, venue: location },
      { time: "8:30 PM", event: "Gourmet Dinner", date: rawDateStr, venue: location },
      { time: "10:00 PM", event: "Orchestra & Dancing", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T19:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "An Evening of Elegance";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FCFBF9] text-[#2C2C2C] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lato:wght@300;400;700&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-lato { font-family: 'Lato', sans-serif; }
          .gold-gradient { background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C); -webkit-background-clip: text; color: transparent; }
          .gold-border { border-image: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) 1; }
        `}</style>

        {/* Subtle Silk Background Effect */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FFFDF8] via-[#FCFBF9] to-[#F3F0E6] pointer-events-none opacity-80"></div>
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-[90%] max-w-4xl mx-auto h-[90vh] border-[1px] border-[#D4AF37]/30 p-4 sm:p-12 flex flex-col justify-between items-center bg-white/40 backdrop-blur-sm shadow-[0_0_60px_rgba(212,175,55,0.05)] my-8">
          
          <div className="flex flex-col items-center mt-12">
            <span className="text-[10px] sm:text-xs font-lato tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-4">
              Engagement Celebration
            </span>
            <div className="w-12 h-[1px] bg-[#D4AF37]/50"></div>
          </div>

          <div className="flex flex-col items-center w-full">
            <h1 className="text-5xl sm:text-7xl font-playfair tracking-widest text-[#2C2C2C] uppercase mb-4 w-full">
              {groomFullName}
            </h1>
            <span className="text-3xl font-playfair italic text-[#D4AF37] my-4">&amp;</span>
            <h2 className="text-5xl sm:text-7xl font-playfair tracking-widest text-[#2C2C2C] uppercase mt-4 w-full">
              {brideFullName}
            </h2>
          </div>

          <div className="mb-12 flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-playfair italic text-[#555] mb-6">{monthStr} {dayNum}, {yearStr}</span>
            <div className="w-[1px] h-12 bg-[#D4AF37]/40 mb-6"></div>
            <span className="text-[10px] sm:text-xs font-lato tracking-[0.3em] text-[#2C2C2C] uppercase">{location}</span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#FFFDF8]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[3/4] relative p-4 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#D4AF37]/10 z-10">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover filter contrast-[1.05]" alt="Couple" />
              ) : (
                <div className="w-full h-full bg-[#FCFBF9] flex items-center justify-center border border-[#D4AF37]/20">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-lato">Our Journey</span>
                </div>
              )}
            </div>
            
            <div className="absolute top-12 -left-8 w-full h-full border border-[#D4AF37]/30 z-0"></div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <span className="text-[10px] font-lato tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-6 block">The Beginning</span>
            <h2 className="text-4xl sm:text-5xl font-playfair text-[#2C2C2C] tracking-wide mb-10">{storyTitle}</h2>
            
            <p className="text-lg sm:text-xl text-[#555] font-lato font-light leading-loose">
              {story}
            </p>

            <div className="mt-12 text-center lg:text-left">
              <span className="font-playfair text-3xl italic text-[#D4AF37] opacity-60">Forever</span>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#FCFBF9]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-lato tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-4 block">Celebration</span>
            <h2 className="text-4xl sm:text-5xl font-playfair text-[#2C2C2C] tracking-wide">The Evening</h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 bg-white shadow-sm border border-[#D4AF37]/10 group hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-[#D4AF37] font-playfair italic text-xl mb-4">{item.time}</div>
                <h3 className="text-xl font-playfair text-[#2C2C2C] mb-4 group-hover:text-[#D4AF37] transition-colors">{item.event}</h3>
                <div className="w-6 h-[1px] bg-[#EAE4D9] mb-4"></div>
                <p className="text-[#888] text-[10px] font-lato tracking-[0.2em] uppercase">{item.venue || location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#FFFDF8]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] p-3 bg-white shadow-[0_20px_60px_rgba(212,175,55,0.08)] relative z-10">
              <div className="w-full h-full border border-[#D4AF37]/20 p-2">
                {venuePhoto ? (
                  <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover filter contrast-[1.05]" />
                ) : (
                  <div className="w-full h-full bg-[#FCFBF9] flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-lato">The Venue</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
             <span className="text-[10px] font-lato tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-6 block">Join Us At</span>
             <h2 className="text-3xl sm:text-5xl font-playfair text-[#2C2C2C] tracking-wide mb-8 leading-tight">
               {location}
             </h2>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-4 bg-transparent border border-[#D4AF37] text-[#2C2C2C] hover:bg-[#D4AF37] hover:text-white px-8 py-4 font-lato text-[11px] tracking-[0.2em] uppercase transition-all duration-500"
              >
                <Navigation size={14} />
                Get Directions
              </a>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#FCFBF9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-lato tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-4 block">Memories</span>
            <h2 className="text-4xl sm:text-5xl font-playfair text-[#2C2C2C] tracking-wide">Captured Moments</h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-8"></div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid relative overflow-hidden bg-white p-2 shadow-sm group">
                <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-500 z-10 pointer-events-none m-2"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover filter contrast-[1.05] group-hover:scale-[1.02] transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#FFFDF8]">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <span className="text-[10px] font-lato tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-16 block">The Countdown</span>

          <div className="flex gap-4 sm:gap-16 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <span className="text-4xl sm:text-7xl font-playfair text-[#2C2C2C] mb-6">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-lato text-[#888]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#FCFBF9]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-playfair text-[#2C2C2C] tracking-wide mb-6">RSVP</h2>
            <p className="text-[#888] font-lato text-[11px] tracking-widest uppercase">Kindly reply by September 1st, 2026</p>
          </div>

          <div className="bg-white p-8 sm:p-16 border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(212,175,55,0.03)] relative">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-[#D4AF37]"></div>

            <form className="space-y-10 font-lato" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#EAE4D9] px-2 py-4 outline-none focus:border-[#D4AF37] transition-colors text-[#2C2C2C] text-xs tracking-widest uppercase placeholder-[#A0A0A0]" placeholder="Name(s) of Guest(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#EAE4D9] px-2 py-4 outline-none focus:border-[#D4AF37] transition-colors text-[#2C2C2C] text-xs tracking-widest uppercase placeholder-[#A0A0A0] resize-none" placeholder="Dietary Requirements & Notes"></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <label className="flex items-center gap-4 cursor-pointer group justify-center flex-1">
                    <div className="w-5 h-5 border border-[#D4AF37] rounded-full flex items-center justify-center">
                       <input type="radio" name="attending" className="w-3 h-3 opacity-0 group-hover:opacity-100 bg-[#D4AF37] rounded-full appearance-none transition-all" />
                    </div>
                    <span className="text-[#2C2C2C] uppercase tracking-widest text-[10px] font-bold">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group justify-center flex-1">
                    <div className="w-5 h-5 border border-[#D4AF37] rounded-full flex items-center justify-center">
                       <input type="radio" name="attending" className="w-3 h-3 opacity-0 group-hover:opacity-100 bg-[#D4AF37] rounded-full appearance-none transition-all" />
                    </div>
                    <span className="text-[#2C2C2C] uppercase tracking-widest text-[10px] font-bold">Regretfully Declines</span>
                  </label>
                </div>
              </div>

              <div className="pt-10 flex justify-center">
                <button type="button" className="bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] text-[#2C2C2C] hover:text-white font-lato font-bold tracking-[0.2em] uppercase text-[10px] px-16 py-5 transition-all duration-500">
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
    <div className={`min-h-screen bg-[#FCFBF9] relative text-[#2C2C2C] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Floating Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-white/90 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:scale-110"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
        </button>
      )}

      {/* Elegant Wax Seal Reveal Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[2500ms] ease-in-out bg-[#FCFBF9] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          @keyframes goldSparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
          }
          @keyframes sealDissolve {
            0% { opacity: 1; transform: scale(1); filter: blur(0); }
            40% { opacity: 1; transform: scale(1.2); filter: blur(0); }
            100% { opacity: 0; transform: scale(2); filter: blur(20px); }
          }
        `}</style>
        
        {/* Soft Background Blur Out */}
        <div className={`absolute inset-0 transition-transform duration-[2000ms] z-0 ${isOpening ? 'scale-110 blur-xl opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#FCFBF9] to-[#F3F0E6] pointer-events-none opacity-80"></div>
        </div>

        {/* Central Golden Seal */}
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpening ? 'animate-[sealDissolve_1.5s_forwards]' : 'opacity-100 scale-100'}`}>
           <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#E2C778] via-[#D4AF37] to-[#AA771C] shadow-[0_15px_40px_rgba(212,175,55,0.4)] border-4 border-white/30 flex flex-col items-center justify-center p-4 group transition-all duration-700 hover:scale-105 hover:shadow-[0_20px_50px_rgba(212,175,55,0.6)] relative overflow-hidden">
             
             {/* Inner Ring */}
             <div className="absolute inset-2 border-[1px] border-white/40 rounded-full"></div>

             <div className="text-center font-playfair text-4xl sm:text-5xl text-white tracking-widest leading-none">
               {groomFullName[0]}
               <span className="text-2xl font-playfair italic text-white/80 mx-2">&amp;</span>
               {brideFullName[0]}
             </div>
             
             <div className="text-white/80 text-[8px] font-lato font-bold uppercase tracking-[0.4em] mt-6 transition-all">
               {isOpening ? 'OPENING...' : 'TAP TO REVEAL'}
             </div>
           </div>
        </div>

        {/* Magical Gold Sparkles Effect (Only when opening) */}
        {isOpening && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-2 bg-[#FCF6BA] rounded-full shadow-[0_0_10px_#D4AF37]"
                style={{
                  left: `calc(50% + ${(Math.random() - 0.5) * 300}px)`,
                  top: `calc(50% + ${(Math.random() - 0.5) * 300}px)`,
                  animation: `goldSparkle ${0.8 + Math.random() * 1}s ease-in-out forwards`,
                  animationDelay: `${Math.random() * 0.4}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-[#FFFDF8] text-[#D4AF37] w-full border-t border-[#D4AF37]/10">
        <h2 className="text-[10px] font-lato tracking-[0.4em] uppercase font-bold">{rawCoupleNames}</h2>
      </footer>

    </div>
  );
}
