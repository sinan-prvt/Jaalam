import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Volume2, VolumeX, ArrowRight, Zap, Star } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function PopModernEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 1000);
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

  const rawCoupleNames = content?.hero_title || "Alex & Jamie";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ALEX");
  const brideFullName = (parts[1]?.trim() || "JAMIE");

  const story = content?.about_text || "Ready for our next big adventure! Let's pop the champagne and celebrate.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "THE STORY";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'DEC');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'SATURDAY');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Neon Club";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Drinks & Vibes", date: rawDateStr, venue: location },
      { time: "9:30 PM", event: "Pop The Question Toast", date: rawDateStr, venue: location },
      { time: "11:00 PM", event: "Dance Floor Open", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-12-12T20:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center bg-[#FBBF24] text-[#09090B] min-h-screen px-4 py-20 overflow-hidden border-b-8 border-[#09090B]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
          .font-pop { font-family: 'Outfit', sans-serif; }
          .neo-shadow { box-shadow: 8px 8px 0px 0px rgba(9,9,11,1); }
          .neo-shadow-lg { box-shadow: 16px 16px 0px 0px rgba(9,9,11,1); }
          @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
          .animate-marquee { display: flex; width: 200%; animation: marquee 20s linear infinite; }
        `}</style>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#EC4899] border-4 border-[#09090B] rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3B82F6] border-4 border-[#09090B] neo-shadow rotate-12 flex items-center justify-center">
           <Star fill="#09090B" size={48} className="animate-spin-slow" style={{ animationDuration: '4s' }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="bg-[#FFFFFF] border-4 border-[#09090B] px-8 py-3 rounded-full mb-12 neo-shadow flex items-center gap-3 rotate-[-5deg]">
             <Zap fill="#FBBF24" size={24} className="text-[#09090B]" />
             <span className="font-pop text-xl font-black uppercase text-[#09090B] tracking-wider">Engagement Party</span>
          </div>

          <div className="bg-[#3B82F6] border-[6px] border-[#09090B] p-8 sm:p-12 neo-shadow-lg w-full text-center relative rotate-[2deg] hover:rotate-0 transition-transform duration-300">
             <h1 className="text-5xl sm:text-8xl md:text-[100px] font-pop font-black uppercase text-[#FFFFFF] drop-shadow-[4px_4px_0_#09090B] leading-none mb-2">
               {groomFullName}
             </h1>
             <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#EC4899] border-4 border-[#09090B] text-[#FFFFFF] w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-6xl font-black font-pop z-20 neo-shadow rotate-[-15deg]">
               &amp;
             </div>
             <h2 className="text-5xl sm:text-8xl md:text-[100px] font-pop font-black uppercase text-[#FBBF24] drop-shadow-[4px_4px_0_#09090B] leading-none mt-2">
               {brideFullName}
             </h2>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6">
             <div className="bg-[#EC4899] border-4 border-[#09090B] px-8 py-4 neo-shadow text-[#FFFFFF] font-pop font-black text-2xl uppercase rotate-[-3deg]">
               {monthStr} {dayNum}
             </div>
             <div className="bg-[#FFFFFF] border-4 border-[#09090B] px-8 py-4 neo-shadow text-[#09090B] font-pop font-black text-2xl uppercase rotate-[4deg]">
               {yearStr}
             </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 relative z-10 bg-[#FFFFFF] border-b-8 border-[#09090B] overflow-hidden">
        {/* Marquee Header */}
        <div className="absolute top-0 left-0 w-full bg-[#09090B] text-[#FBBF24] border-b-4 border-[#09090B] py-3 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee font-pop font-black text-2xl uppercase tracking-widest flex">
            {Array(10).fill(`${storyTitle} • `).map((text, i) => <span key={i} className="mx-4">{text}</span>)}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
             <div className="bg-[#3B82F6] border-4 border-[#09090B] neo-shadow absolute top-4 left-4 w-full h-full"></div>
             <div className="bg-[#FFFFFF] border-4 border-[#09090B] p-4 relative z-10 rotate-[-2deg]">
                <div className="flex gap-2">
                  <div className="w-1/2 aspect-[4/5] bg-[#EC4899] border-2 border-[#09090B] overflow-hidden">
                    {groomPhoto && <img src={groomPhoto} className="w-full h-full object-cover grayscale mix-blend-multiply" alt="Groom" />}
                  </div>
                  <div className="w-1/2 aspect-[4/5] bg-[#FBBF24] border-2 border-[#09090B] overflow-hidden">
                    {bridePhoto && <img src={bridePhoto} className="w-full h-full object-cover grayscale mix-blend-multiply" alt="Bride" />}
                  </div>
                </div>
                <div className="mt-4 text-center font-pop font-black text-xl uppercase border-t-2 border-[#09090B] pt-4">Us.</div>
             </div>
          </div>
          
          <div className="w-full md:w-1/2">
             <div className="bg-[#EC4899] border-4 border-[#09090B] p-8 sm:p-10 neo-shadow rotate-[2deg]">
               <h3 className="font-pop font-black text-5xl text-[#FFFFFF] drop-shadow-[3px_3px_0_#09090B] mb-6 uppercase">How it <br/>Started</h3>
               <p className="text-xl sm:text-2xl font-pop font-bold text-[#09090B] leading-relaxed">
                 "{story}"
               </p>
             </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 relative z-10 bg-[#3B82F6] border-b-8 border-[#09090B]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#09090B] text-[#FFFFFF] inline-block border-4 border-[#09090B] px-10 py-4 neo-shadow rotate-[-2deg] mb-16">
            <h2 className="font-pop font-black text-5xl uppercase">The Plan</h2>
          </div>

          <div className="flex flex-col gap-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-[#FFFFFF] border-4 border-[#09090B] p-6 sm:p-8 neo-shadow flex flex-col sm:flex-row sm:items-center justify-between hover:-translate-y-2 hover:-translate-x-2 transition-transform duration-300">
                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div className="bg-[#FBBF24] border-4 border-[#09090B] text-[#09090B] font-pop font-black text-xl px-4 py-2 rotate-[-5deg]">
                    {item.time}
                  </div>
                  <h3 className="font-pop font-black text-3xl sm:text-4xl text-[#09090B] uppercase">{item.event}</h3>
                </div>
                <div className="bg-[#EC4899] border-4 border-[#09090B] px-4 py-2 font-pop font-bold text-[#FFFFFF] uppercase text-sm flex items-center gap-2 max-w-[200px] text-center justify-center">
                  <MapPin size={16} fill="#FFFFFF" className="text-[#09090B]" />
                  <span className="truncate">{item.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 relative z-10 bg-[#FBBF24] border-b-8 border-[#09090B]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
             <h2 className="font-pop font-black text-6xl sm:text-7xl text-[#09090B] drop-shadow-[4px_4px_0_#FFFFFF] uppercase leading-none mb-8">
               Where to <br/> <span className="bg-[#EC4899] text-[#FFFFFF] px-4 py-1 border-4 border-[#09090B] inline-block rotate-[-3deg]">Party!</span>
             </h2>
             <div className="bg-[#FFFFFF] border-4 border-[#09090B] p-6 neo-shadow inline-block">
               <p className="font-pop font-black text-2xl sm:text-3xl text-[#09090B]">
                 {location}
               </p>
             </div>
             <div className="mt-12">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-4 bg-[#3B82F6] text-[#FFFFFF] border-4 border-[#09090B] px-8 py-4 neo-shadow hover:-translate-y-1 hover:-translate-x-1 transition-transform font-pop font-black text-xl uppercase"
                 >
                   Get Directions <ArrowRight size={24} />
                 </a>
               )}
             </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-[#FFFFFF] border-[8px] border-[#09090B] p-4 neo-shadow rotate-[3deg]">
              {venuePhoto ? (
                <img src={venuePhoto} alt="Venue" className="w-full aspect-[4/3] object-cover border-4 border-[#09090B]" />
              ) : (
                <div className="w-full aspect-[4/3] bg-[#EC4899] border-4 border-[#09090B] flex items-center justify-center font-pop font-black text-[#FFFFFF] text-2xl uppercase">Venue Photo</div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 relative z-10 bg-[#EC4899] border-b-8 border-[#09090B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-[#FBBF24] border-4 border-[#09090B] text-[#09090B] font-pop font-black text-5xl px-8 py-4 neo-shadow inline-block rotate-[2deg] uppercase">
              Photo Dump
            </span>
          </div>
          
          <div className="columns-2 md:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => {
              const rotation = (index % 3 === 0) ? '-2deg' : (index % 2 === 0) ? '3deg' : '-1deg';
              return (
                <div key={index} className={`break-inside-avoid bg-[#FFFFFF] border-4 border-[#09090B] p-3 neo-shadow transition-transform hover:z-20 hover:scale-105`} style={{ transform: `rotate(${rotation})` }}>
                  <img src={url} alt={`Gallery ${index}`} className="w-full border-2 border-[#09090B]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 relative z-10 bg-[#09090B] border-b-8 border-[#09090B]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-pop font-black text-4xl sm:text-6xl text-[#FFFFFF] uppercase mb-16">It's Almost <span className="text-[#FBBF24]">Time</span></h2>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0, color: 'bg-[#EC4899]' },
              { label: 'Hours', value: timeLeft?.h ?? 0, color: 'bg-[#3B82F6]' },
              { label: 'Mins', value: timeLeft?.m ?? 0, color: 'bg-[#FBBF24]' },
              { label: 'Secs', value: timeLeft?.s ?? 0, color: 'bg-[#FFFFFF]' }
            ].map((item, idx) => (
              <div key={idx} className={`${item.color} border-4 border-[#09090B] w-28 h-28 sm:w-40 sm:h-40 flex flex-col items-center justify-center neo-shadow rotate-${idx % 2 === 0 ? '[-2deg]' : '[3deg]'}`}>
                <span className={`text-4xl sm:text-6xl font-pop font-black ${item.color === 'bg-[#FFFFFF]' || item.color === 'bg-[#FBBF24]' ? 'text-[#09090B]' : 'text-[#FFFFFF]'} leading-none drop-shadow-[2px_2px_0_#09090B]`}>
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className={`text-sm sm:text-lg font-pop font-black uppercase mt-2 border-t-4 border-[#09090B] w-full text-center pt-2 ${item.color === 'bg-[#FFFFFF]' || item.color === 'bg-[#FBBF24]' ? 'text-[#09090B]' : 'text-[#FFFFFF]'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 relative z-10 bg-[#3B82F6]">
        <div className="max-w-3xl mx-auto bg-[#FFFFFF] border-8 border-[#09090B] p-8 sm:p-16 neo-shadow-lg relative">
          
          <div className="absolute -top-8 -right-8 bg-[#FBBF24] border-4 border-[#09090B] w-24 h-24 rounded-full flex items-center justify-center animate-spin-slow" style={{ animationDuration: '6s' }}>
             <Star fill="#09090B" size={40} className="text-[#09090B]" />
          </div>

          <h2 className="font-pop font-black text-5xl sm:text-6xl text-[#09090B] uppercase text-center mb-12">RSVP <br/><span className="text-[#EC4899]">Now!</span></h2>

          <form className="space-y-8 font-pop" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xl font-black uppercase mb-2 text-[#09090B]">Full Name</label>
              <input type="text" className="w-full bg-[#FAFAFA] border-4 border-[#09090B] p-4 text-xl font-bold outline-none focus:bg-[#FBBF24] transition-colors neo-shadow placeholder:text-[#09090B]/30" placeholder="e.g. Andy Warhol" />
            </div>

            <div>
              <label className="block text-xl font-black uppercase mb-2 text-[#09090B]">Any Dietary Quirks?</label>
              <input type="text" className="w-full bg-[#FAFAFA] border-4 border-[#09090B] p-4 text-xl font-bold outline-none focus:bg-[#3B82F6] focus:text-[#FFFFFF] transition-colors neo-shadow placeholder:text-[#09090B]/30" placeholder="Nope, eat anything!" />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-4 cursor-pointer group flex-1 bg-[#FAFAFA] border-4 border-[#09090B] p-4 neo-shadow hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors">
                <input type="radio" name="attending" className="w-6 h-6 accent-[#EC4899]" />
                <span className="font-black uppercase text-xl">I'm In!</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group flex-1 bg-[#FAFAFA] border-4 border-[#09090B] p-4 neo-shadow hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors">
                <input type="radio" name="attending" className="w-6 h-6 accent-[#EC4899]" />
                <span className="font-black uppercase text-xl">Can't Make It</span>
              </label>
            </div>

            <div className="pt-8">
              <button type="button" className="w-full bg-[#EC4899] text-[#FFFFFF] font-black text-3xl uppercase py-6 border-4 border-[#09090B] neo-shadow hover:-translate-y-2 hover:-translate-x-2 transition-transform">
                Send It!
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#09090B] relative text-[#09090B] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Pop Opening Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FBBF24] transition-all duration-700 cursor-pointer ${isOpened ? 'opacity-0 pointer-events-none scale-150' : 'opacity-100 scale-100'}`}
      >
        <div className="absolute inset-0 border-[16px] sm:border-[24px] border-[#09090B]"></div>
        
        <div className={`flex flex-col items-center text-center p-8 transition-transform duration-[600ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${isOpening ? 'scale-0' : 'scale-100'}`}>
           <div className="bg-[#EC4899] border-[6px] border-[#09090B] p-8 sm:p-16 neo-shadow rotate-[-4deg]">
             <h1 className="font-pop font-black text-6xl sm:text-8xl md:text-[120px] text-[#FFFFFF] tracking-tighter uppercase leading-none drop-shadow-[4px_4px_0_#09090B]">
               {groomFullName}
             </h1>
             <div className="font-pop font-black text-4xl sm:text-6xl text-[#3B82F6] my-2 drop-shadow-[3px_3px_0_#09090B]">&amp;</div>
             <h1 className="font-pop font-black text-6xl sm:text-8xl md:text-[120px] text-[#FFFFFF] tracking-tighter uppercase leading-none drop-shadow-[4px_4px_0_#09090B]">
               {brideFullName}
             </h1>
           </div>

           <div className="mt-12 bg-[#09090B] text-[#FBBF24] border-4 border-[#09090B] px-8 py-4 font-pop font-black text-2xl uppercase neo-shadow animate-pulse">
             Tap to Pop!
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center w-full bg-[#09090B] text-[#FFFFFF]">
        <h2 className="text-xl font-pop font-black tracking-[0.2em] uppercase">{rawCoupleNames}</h2>
      </footer>

      {/* Pop Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-16 h-16 bg-[#FBBF24] border-4 border-[#09090B] flex items-center justify-center text-[#09090B] neo-shadow hover:-translate-y-1 hover:-translate-x-1 transition-transform"
        >
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      )}

      {/* Pop Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#3B82F6] border-4 border-[#09090B] flex items-center justify-center text-[#FFFFFF] neo-shadow hover:-translate-y-1 hover:-translate-x-1 transition-transform ${isCounterPopping ? 'bg-[#EC4899] scale-125' : ''}`}
      >
        <Heart size={28} fill={isCounterPopping ? '#FFFFFF' : 'none'} className={isCounterPopping ? 'animate-bounce' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-4 -right-4 bg-[#FFFFFF] border-4 border-[#09090B] text-[#09090B] text-sm font-pop font-black w-10 h-10 rounded-full flex items-center justify-center shadow-[4px_4px_0_0_rgba(9,9,11,1)]">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
