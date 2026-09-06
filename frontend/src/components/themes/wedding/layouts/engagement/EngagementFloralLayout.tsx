import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function EngagementFloralLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "Our love has blossomed. We invite you to join us in an enchanted garden as we celebrate our engagement and the beautiful journey ahead.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Love in Bloom";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Botanical Gardens, Rose Pavilion";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Garden Welcome & Drinks", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "The Engagement Toast", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Twilight Dancing", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T16:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Rooted in love, blooming with joy.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAF7F2] text-[#4A5D4E] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400&family=Pinyon+Script&display=swap');
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .font-pinyon { font-family: 'Pinyon Script', cursive; }
          
          .floral-corner-tl {
            background-image: url('https://images.unsplash.com/photo-1578335032549-05244510000a?auto=format&fit=crop&w=800&q=80');
            mask-image: radial-gradient(ellipse at top left, black 30%, transparent 70%);
            -webkit-mask-image: radial-gradient(ellipse at top left, black 30%, transparent 70%);
          }
          .floral-corner-br {
            background-image: url('https://images.unsplash.com/photo-1496309732348-3627f3f040ee?auto=format&fit=crop&w=800&q=80');
            mask-image: radial-gradient(ellipse at bottom right, black 30%, transparent 70%);
            -webkit-mask-image: radial-gradient(ellipse at bottom right, black 30%, transparent 70%);
          }
        `}</style>

        {/* Soft Floral Edges */}
        <div className="absolute inset-0 floral-corner-tl bg-cover bg-center opacity-30 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute inset-0 floral-corner-br bg-cover bg-center opacity-30 pointer-events-none mix-blend-multiply"></div>

        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center px-4 py-20">
          
          <span className="text-[10px] sm:text-xs font-montserrat tracking-[0.4em] uppercase text-[#8F9779] mb-12">
            Engagement Celebration
          </span>

          <h1 className="text-6xl sm:text-8xl font-cormorant tracking-widest text-[#2C3E30] uppercase mb-2">
            {groomFullName}
          </h1>
          <span className="text-5xl font-pinyon text-[#D4B5B0] my-4 transform -rotate-12">&amp;</span>
          <h2 className="text-6xl sm:text-8xl font-cormorant tracking-widest text-[#2C3E30] uppercase mt-2">
            {brideFullName}
          </h2>

          <div className="mt-16 flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-cormorant italic text-[#4A5D4E] mb-4">{monthStr} {dayNum}, {yearStr}</span>
            <span className="text-[9px] sm:text-[10px] font-montserrat tracking-[0.3em] text-[#8F9779] uppercase max-w-xs leading-relaxed">{location}</span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2D7D5]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart size={24} className="text-[#D4B5B0] mx-auto mb-6" strokeWidth={1} />
          <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C3E30] tracking-[0.15em] uppercase mb-16">{storyTitle}</h2>
          
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center mb-16">
            <div className="w-56 h-72 sm:w-64 sm:h-80 bg-[#FAF7F2] p-4 shadow-sm rounded-t-full relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-[#8F9779]"></div>
              {groomPhoto ? <img src={groomPhoto} className="w-full h-full object-cover rounded-t-[10rem]" alt="Groom" /> : <div className="w-full h-full bg-[#EAE4D9] rounded-t-[10rem]"></div>}
            </div>
            
            <div className="w-56 h-72 sm:w-64 sm:h-80 bg-[#FAF7F2] p-4 shadow-sm rounded-b-full relative md:translate-y-12">
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-[#8F9779]"></div>
               {bridePhoto ? <img src={bridePhoto} className="w-full h-full object-cover rounded-b-[10rem]" alt="Bride" /> : <div className="w-full h-full bg-[#EAE4D9] rounded-b-[10rem]"></div>}
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-[#4A5D4E] font-cormorant italic leading-relaxed max-w-2xl mx-auto md:mt-24">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C3E30] tracking-[0.15em] uppercase">The Festivities</h2>
            <div className="w-16 h-px bg-[#8F9779] mx-auto mt-6"></div>
          </div>

          <div className="flex flex-col gap-10 max-w-2xl mx-auto">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-8 sm:p-10 border border-[#EAE4D9] rounded-lg shadow-[0_10px_30px_rgba(44,62,48,0.03)] hover:-translate-y-1 transition-transform duration-500">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-0">
                  <span className="text-[#8F9779] font-pinyon text-2xl mb-1">Event {idx + 1}</span>
                  <h3 className="text-xl font-cormorant tracking-[0.1em] text-[#2C3E30] uppercase mb-2">{item.event}</h3>
                  <p className="text-[#888] text-[10px] font-montserrat tracking-[0.15em] uppercase">{item.venue || location}</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#FAF7F2] w-24 h-24 rounded-full border border-[#D4B5B0]/30 shrink-0">
                  <span className="text-sm font-montserrat font-medium text-[#4A5D4E] tracking-[0.1em]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto text-center">
           <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C3E30] tracking-[0.15em] uppercase mb-6">The Garden</h2>
           <p className="text-sm font-montserrat tracking-widest text-[#8F9779] uppercase mb-16">Join us at</p>

           <p className="text-2xl sm:text-3xl font-cormorant text-[#2C3E30] tracking-widest uppercase mb-12">{location}</p>

          <div className="w-full max-w-4xl mx-auto aspect-[16/9] overflow-hidden bg-[#FAF7F2] rounded-[2rem] p-4 border border-[#EAE4D9] shadow-md relative group">
             <div className="absolute inset-0 bg-[#D4B5B0]/20 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
             {venuePhoto && (
               <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover rounded-[1.5rem] filter contrast-[0.9] saturate-[0.8] group-hover:contrast-100 group-hover:saturate-100 transition-all duration-700" />
             )}
          </div>

          <div className="flex justify-center mt-12">
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white border border-[#4A5D4E] hover:bg-[#4A5D4E] hover:text-white text-[#4A5D4E] px-10 py-4 font-montserrat text-[10px] tracking-[0.2em] uppercase rounded-full transition-all duration-500"
              >
                <Navigation size={12} />
                Map & Directions
              </a>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C3E30] tracking-[0.15em] uppercase">Captured Moments</h2>
            <div className="w-16 h-px bg-[#8F9779] mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className={`relative overflow-hidden bg-white p-2 rounded-lg shadow-sm border border-[#EAE4D9] group ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} aspect-square`}>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-[10px] font-montserrat tracking-[0.4em] uppercase text-[#8F9779] mb-16">Until The Day</h2>

          <div className="flex gap-4 sm:gap-12 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-[#FAF7F2] w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#D4B5B0]/30 flex items-center justify-center shadow-sm">
                <span className="text-2xl sm:text-4xl font-cormorant text-[#2C3E30] mb-1">{item.value}</span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-montserrat text-[#8F9779]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C3E30] tracking-[0.15em] uppercase">RSVP</h2>
            <p className="text-[#8F9779] font-montserrat text-[10px] tracking-widest uppercase mt-4">We would be delighted to have you</p>
          </div>

          <div className="bg-white p-8 sm:p-16 border border-[#EAE4D9] rounded-2xl shadow-[0_10px_40px_rgba(44,62,48,0.05)] mt-12 relative overflow-hidden">
            
            {/* Soft decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2D7D5]/30 rounded-bl-[100%] pointer-events-none"></div>

            <form className="space-y-8 font-montserrat max-w-xl mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#D4B5B0] px-2 py-3 outline-none focus:border-[#4A5D4E] transition-colors text-[#2C3E30] text-[11px] tracking-widest uppercase placeholder-[#A0A0A0]" placeholder="Guest Name(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#D4B5B0] px-2 py-3 outline-none focus:border-[#4A5D4E] transition-colors text-[#2C3E30] text-[11px] tracking-widest uppercase placeholder-[#A0A0A0] resize-none" placeholder="Leave a wish or dietary note"></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#EAE4D9] rounded-lg hover:border-[#8F9779] transition-colors flex-1 justify-center">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#4A5D4E]" />
                    <span className="text-[#4A5D4E] uppercase tracking-widest text-[10px] font-medium">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#EAE4D9] rounded-lg hover:border-[#8F9779] transition-colors flex-1 justify-center">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#4A5D4E]" />
                    <span className="text-[#4A5D4E] uppercase tracking-widest text-[10px] font-medium">Regretfully Declines</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-[#2C3E30] hover:bg-[#4A5D4E] text-white font-montserrat tracking-[0.2em] uppercase text-[10px] py-5 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2">
                  <Send size={12} /> Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative text-[#2C3E30] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}
      
      {/* Floating Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-white/80 backdrop-blur-sm border border-[#EAE4D9] rounded-full shadow-[0_4px_20px_rgba(44,62,48,0.1)] flex items-center justify-center text-[#4A5D4E] hover:bg-white transition-all duration-300 hover:scale-110"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Enchanted Floral Blooming Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[2000ms] ease-in-out bg-[#FAF7F2] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          @keyframes subtleBloom {
            0% { transform: scale(0.9) rotate(0deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(1.1) rotate(5deg); opacity: 0.2; }
          }
          @keyframes floatingPetal {
            0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; }
          }
        `}</style>
        
        {/* Soft Background Blooms */}
        <div className={`absolute inset-0 transition-transform duration-[2000ms] z-0 ${isOpening ? 'scale-150 blur-xl opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F2D7D5]/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#8F9779]/20 rounded-full blur-[100px]"></div>
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578335032549-05244510000a?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        </div>

        {/* Central Wreath Seal */}
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpening ? 'opacity-0 scale-[3] blur-lg' : 'opacity-100 scale-100 delay-300'}`}>
           <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white/60 backdrop-blur-md border border-[#D4B5B0]/50 shadow-[0_20px_50px_rgba(44,62,48,0.1)] flex flex-col items-center justify-center p-8 group transition-all duration-1000 hover:scale-105 relative">
             
             {/* Spinning Floral Border */}
             <div className="absolute inset-2 border-[1px] border-dashed border-[#8F9779]/40 rounded-full animate-[spin_40s_linear_infinite]"></div>
             <div className="absolute inset-4 border-[1px] border-[#D4B5B0]/30 rounded-full"></div>

             <Heart className="text-[#D4B5B0] mb-4 group-hover:scale-110 transition-transform duration-500" size={24} strokeWidth={1} />
             
             <div className="text-center font-cormorant text-4xl sm:text-5xl text-[#2C3E30] uppercase tracking-widest leading-none">
               {groomFullName[0]}
               <span className="text-2xl font-pinyon text-[#8F9779] mx-4 lowercase">&amp;</span>
               {brideFullName[0]}
             </div>
             
             <div className="w-12 h-[1px] bg-[#D4B5B0]/50 my-6"></div>

             <div className="text-[#8F9779] text-[8px] font-montserrat font-semibold uppercase tracking-[0.4em] transition-all">
               {isOpening ? 'BLOOMING...' : 'TAP TO ENTER'}
             </div>
           </div>
        </div>

        {/* Falling Petals Effect (Only when opening) */}
        {isOpening && (
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-4 h-4 bg-[#F2D7D5] rounded-full opacity-0 shadow-sm mix-blend-multiply"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  clipPath: 'path("M0,10 C0,10 5,0 10,0 C15,0 20,10 20,10 C20,10 15,20 10,20 C5,20 0,10 0,10 Z")',
                  animation: `floatingPetal ${2 + Math.random() * 2}s ease-in-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-[#FAF7F2] text-[#8F9779] w-full border-t border-[#EAE4D9]">
        <h2 className="text-sm font-cormorant tracking-[0.2em] uppercase">{rawCoupleNames}</h2>
      </footer>

    </div>
  );
}
