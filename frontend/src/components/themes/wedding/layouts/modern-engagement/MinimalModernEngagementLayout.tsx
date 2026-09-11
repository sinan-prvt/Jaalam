import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Volume2, VolumeX, ArrowRight, CornerRightDown } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function MinimalModernEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 1200);
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

  const story = content?.about_text || "A new chapter begins. Join us as we celebrate our engagement.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "THE STORY";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'December');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Modern Art Museum";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Arrival & Drinks", date: rawDateStr, venue: location },
      { time: "9:30 PM", event: "The Toast", date: rawDateStr, venue: location },
      { time: "11:00 PM", event: "Music & Dance", date: rawDateStr, venue: location }
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
      <section key="hero" className="relative w-full flex flex-col justify-between items-center bg-[#FAFAFA] text-[#0A0A0A] p-0 min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
        `}</style>
        
        <div className="w-full flex justify-between p-6 sm:p-12 z-10 font-sans uppercase tracking-[0.3em] text-[10px] font-bold">
           <span>Engagement</span>
           <span>Invitation</span>
        </div>

        <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 px-4">
          <div className="w-[1px] h-24 bg-[#0A0A0A] mb-12"></div>
          <h1 className="text-[12vw] sm:text-8xl md:text-[140px] font-sans font-black uppercase tracking-tighter leading-none text-center">
            {groomFullName}
          </h1>
          <h2 className="text-[12vw] sm:text-8xl md:text-[140px] font-sans font-black uppercase tracking-tighter leading-none text-center relative -mt-4 sm:-mt-8 text-[#0A0A0A] mix-blend-difference">
            <span className="absolute -left-6 sm:-left-12 top-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-light tracking-normal opacity-50">&amp;</span>
            {brideFullName}
          </h2>
          <div className="w-[1px] h-24 bg-[#0A0A0A] mt-12"></div>
        </div>

        <div className="w-full flex justify-between p-6 sm:p-12 z-10 font-sans uppercase tracking-[0.3em] text-[10px] font-bold border-t border-[#0A0A0A]/10">
           <span>{monthStr} {dayNum} {yearStr}</span>
           <span>{location}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-[#0A0A0A] text-[#FAFAFA]">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="w-full lg:w-1/3 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-sans font-bold uppercase tracking-[0.4em] mb-4 text-white/50">01</h2>
              <h3 className="text-4xl sm:text-6xl font-sans font-black uppercase tracking-tighter leading-none">{storyTitle}</h3>
            </div>
            
            <div className="hidden lg:block">
              <CornerRightDown size={48} strokeWidth={1} className="opacity-30" />
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 flex flex-col gap-12">
            <p className="text-2xl sm:text-4xl font-sans font-light leading-tight tracking-tight text-white/90">
              "{story}"
            </p>

            <div className="flex gap-4 w-full aspect-[2/1] overflow-hidden">
               {groomPhoto ? (
                 <img src={groomPhoto} className="w-1/2 h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Groom" />
               ) : (
                 <div className="w-1/2 h-full bg-white/5 flex items-center justify-center font-sans font-bold text-white/20 tracking-[0.3em] uppercase text-[10px]">Photo 1</div>
               )}
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-1/2 h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Bride" />
               ) : (
                 <div className="w-1/2 h-full bg-white/5 flex items-center justify-center font-sans font-bold text-white/20 tracking-[0.3em] uppercase text-[10px]">Photo 2</div>
               )}
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-[#FAFAFA] text-[#0A0A0A] border-b border-[#0A0A0A]/10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-24 flex items-end justify-between border-b-2 border-[#0A0A0A] pb-8">
             <h3 className="text-4xl sm:text-6xl font-sans font-black uppercase tracking-tighter leading-none">Agenda</h3>
             <h2 className="text-sm font-sans font-bold uppercase tracking-[0.4em] text-[#0A0A0A]/50">02</h2>
          </div>

          <div className="flex flex-col">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row py-12 border-b border-[#0A0A0A]/10 last:border-0 group hover:bg-[#0A0A0A] hover:text-[#FAFAFA] transition-colors duration-500 px-8 -mx-8 cursor-default">
                <div className="sm:w-1/3 mb-4 sm:mb-0">
                  <span className="font-sans text-sm font-bold tracking-[0.3em] uppercase opacity-50 group-hover:opacity-80">{item.time}</span>
                </div>
                <div className="sm:w-2/3 flex flex-col justify-center">
                  <h4 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight mb-4">{item.event}</h4>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 group-hover:opacity-80 flex items-center gap-2">
                    <MapPin size={12} /> {item.venue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-[#FAFAFA] text-[#0A0A0A]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
             <div>
               <h2 className="text-sm font-sans font-bold uppercase tracking-[0.4em] mb-4 text-[#0A0A0A]/50">03</h2>
               <h3 className="text-4xl sm:text-6xl font-sans font-black uppercase tracking-tighter leading-none mb-12">Location</h3>
               <p className="text-2xl sm:text-3xl font-sans font-light leading-tight tracking-tight max-w-sm">
                 {location}
               </p>
             </div>

             <div className="pt-16">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-4 bg-[#0A0A0A] text-[#FAFAFA] px-10 py-5 font-sans text-xs font-bold tracking-[0.3em] uppercase hover:bg-black/80 transition-colors"
                 >
                   View Map <ArrowRight size={14} />
                 </a>
               )}
             </div>
          </div>

          <div className="w-full lg:w-1/2">
            {venuePhoto ? (
              <img src={venuePhoto} alt="Venue" className="w-full aspect-[4/5] object-cover grayscale" />
            ) : (
              <div className="w-full aspect-[4/5] bg-[#0A0A0A]/5 flex items-center justify-center font-sans font-bold text-[#0A0A0A]/30 tracking-[0.3em] uppercase text-xs">Venue Image</div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-[#0A0A0A] text-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex items-end justify-between border-b-2 border-white/20 pb-8">
             <h3 className="text-4xl sm:text-6xl font-sans font-black uppercase tracking-tighter leading-none">Gallery</h3>
             <h2 className="text-sm font-sans font-bold uppercase tracking-[0.4em] text-white/50">04</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-square relative group overflow-hidden bg-white/5">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-[#FAFAFA] text-[#0A0A0A] border-b border-[#0A0A0A]/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-sm font-sans font-bold uppercase tracking-[0.4em] text-[#0A0A0A]/50 mb-16">05 — T-Minus</h2>

          <div className="flex flex-wrap gap-x-12 gap-y-16 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-6xl sm:text-8xl md:text-[120px] font-sans font-black tracking-tighter leading-none mb-4">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase opacity-50">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 sm:py-48 px-6 sm:px-12 relative z-10 bg-[#FAFAFA] text-[#0A0A0A]">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-24 flex items-end justify-between border-b-2 border-[#0A0A0A] pb-8">
             <h3 className="text-4xl sm:text-6xl font-sans font-black uppercase tracking-tighter leading-none">RSVP</h3>
             <h2 className="text-sm font-sans font-bold uppercase tracking-[0.4em] text-[#0A0A0A]/50">06</h2>
          </div>

          <form className="space-y-12 font-sans" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] uppercase mb-4 opacity-50">Full Name</label>
              <input type="text" className="w-full bg-transparent border-b-2 border-[#0A0A0A]/20 pb-4 text-2xl sm:text-3xl font-light outline-none focus:border-[#0A0A0A] transition-colors placeholder:text-[#0A0A0A]/20" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] uppercase mb-4 opacity-50">Dietary Needs</label>
              <input type="text" className="w-full bg-transparent border-b-2 border-[#0A0A0A]/20 pb-4 text-xl font-light outline-none focus:border-[#0A0A0A] transition-colors placeholder:text-[#0A0A0A]/20" placeholder="None" />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-6 cursor-pointer group flex-1">
                <div className="w-6 h-6 border-2 border-[#0A0A0A]/20 group-hover:border-[#0A0A0A] flex items-center justify-center transition-colors">
                  <input type="radio" name="attending" className="w-3 h-3 accent-[#0A0A0A] opacity-0 checked:opacity-100" />
                </div>
                <span className="font-bold uppercase tracking-[0.2em] text-sm">Accept</span>
              </label>
              <label className="flex items-center gap-6 cursor-pointer group flex-1">
                <div className="w-6 h-6 border-2 border-[#0A0A0A]/20 group-hover:border-[#0A0A0A] flex items-center justify-center transition-colors">
                  <input type="radio" name="attending" className="w-3 h-3 accent-[#0A0A0A] opacity-0 checked:opacity-100" />
                </div>
                <span className="font-bold uppercase tracking-[0.2em] text-sm">Decline</span>
              </label>
            </div>

            <div className="pt-16">
              <button type="button" className="w-full bg-[#0A0A0A] text-[#FAFAFA] font-bold tracking-[0.3em] uppercase text-xs py-8 hover:bg-black/80 transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#FAFAFA] relative text-[#0A0A0A] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Brutalist Opening Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAFAFA] transition-transform duration-[1500ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'} cursor-pointer`}
      >
        <div className="absolute top-0 left-0 w-full h-full border-[16px] sm:border-[32px] border-[#0A0A0A] pointer-events-none"></div>
        
        <div className={`flex flex-col items-center text-center px-6 transition-opacity duration-700 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
           <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] mb-12">Engagement</span>
           
           <div className="font-sans font-black text-6xl sm:text-8xl md:text-[120px] text-[#0A0A0A] tracking-tighter uppercase leading-none">
             {groomFullName}
           </div>
           <span className="font-sans font-light text-3xl text-[#0A0A0A]/30 my-4">&amp;</span>
           <div className="font-sans font-black text-6xl sm:text-8xl md:text-[120px] text-[#0A0A0A] tracking-tighter uppercase leading-none">
             {brideFullName}
           </div>

           <div className="mt-24 border-b-2 border-[#0A0A0A] pb-2 text-[#0A0A0A] font-sans font-bold text-[10px] uppercase tracking-[0.4em] hover:text-[#0A0A0A]/50 transition-colors cursor-pointer">
             Enter
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-24 relative z-10 text-center w-full bg-[#0A0A0A] text-[#FAFAFA]">
        <h2 className="text-[10px] font-sans font-bold tracking-[0.5em] uppercase opacity-50">{rawCoupleNames}</h2>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-14 h-14 bg-[#FAFAFA] border-2 border-[#0A0A0A] flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FAFAFA] transition-colors duration-300"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Brutalist Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#0A0A0A] border-2 border-[#0A0A0A] flex items-center justify-center text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#0A0A0A] transition-colors duration-300 ${isCounterPopping ? 'scale-110' : ''}`}
      >
        <Heart size={20} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-[#FAFAFA] border-2 border-[#0A0A0A] text-[#0A0A0A] text-[10px] font-sans font-black w-8 h-8 flex items-center justify-center shadow-none">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
