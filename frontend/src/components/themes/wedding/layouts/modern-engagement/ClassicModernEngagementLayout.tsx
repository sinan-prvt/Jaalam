import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Volume2, VolumeX, ArrowRight, Diamond } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ClassicModernEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "With great joy, we invite you to share in the celebration of our engagement.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "THE CHRONICLE";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'December');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Conservatory";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Aperitifs & Welcomes", date: rawDateStr, venue: location },
      { time: "9:30 PM", event: "The Formal Toast", date: rawDateStr, venue: location },
      { time: "10:30 PM", event: "Dancing & Reverie", date: rawDateStr, venue: location }
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
      <section key="hero" className="relative w-full flex flex-col items-center bg-[#F5F5F0] text-[#1A362D] min-h-screen pt-12 sm:pt-20 px-6 sm:px-12 border-x-[12px] sm:border-x-[24px] border-[#1A362D]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Inter:wght@300;400;600&display=swap');
          .font-editorial { font-family: 'Playfair Display', serif; }
          .font-utility { font-family: 'Inter', sans-serif; }
        `}</style>
        
        <div className="w-full max-w-5xl mx-auto border-b border-[#1A362D]/20 pb-4 mb-20 flex justify-between items-end">
           <span className="font-utility text-[10px] tracking-[0.4em] uppercase text-[#1A362D]/60">Volume I</span>
           <span className="font-utility text-[10px] tracking-[0.4em] uppercase text-[#1A362D]/60">Issue 01</span>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full lg:w-7/12 text-center lg:text-left">
             <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
               <div className="h-[1px] w-12 bg-[#C5A880]"></div>
               <span className="font-utility text-xs tracking-[0.3em] uppercase text-[#C5A880]">The Engagement</span>
             </div>

             <h1 className="text-6xl sm:text-8xl lg:text-[110px] font-editorial leading-[0.9] tracking-tight mb-4 text-[#1A362D]">
               {groomFullName}
             </h1>
             <h2 className="text-5xl sm:text-7xl lg:text-[90px] font-editorial italic leading-[0.9] tracking-tight text-[#1A362D]/80 ml-0 lg:ml-20">
               &amp; {brideFullName}
             </h2>

             <p className="mt-12 font-utility text-sm sm:text-base font-light tracking-[0.2em] leading-relaxed max-w-md mx-auto lg:mx-0 text-[#1A362D]/70 uppercase">
               Cordially invite you to celebrate the commencement of their union.
             </p>
          </div>

          <div className="w-full lg:w-5/12">
            <div className="aspect-[3/4] relative w-full border border-[#C5A880]/30 p-2 sm:p-4">
              <div className="w-full h-full bg-[#1A362D]/5 overflow-hidden">
                {groomPhoto ? (
                  <img src={groomPhoto} className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" alt="Cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-utility text-xs tracking-[0.3em] uppercase text-[#1A362D]/30">Cover Portrait</div>
                )}
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#F5F5F0] px-4 py-2 font-editorial italic text-2xl text-[#C5A880]">
                {yearStr}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 w-full max-w-5xl border-t border-[#1A362D]/20 pt-8 pb-12 flex flex-col sm:flex-row justify-between font-utility text-xs tracking-[0.3em] uppercase text-[#1A362D]/70 gap-6">
           <div className="flex flex-col gap-2 text-center sm:text-left">
             <span className="text-[#1A362D] font-semibold">Date</span>
             <span>{monthStr} {dayNum}, {yearStr}</span>
           </div>
           <div className="flex flex-col gap-2 text-center sm:text-right">
             <span className="text-[#1A362D] font-semibold">Location</span>
             <span>{location}</span>
           </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#1A362D] text-[#F5F5F0] border-x-[12px] sm:border-x-[24px] border-[#F5F5F0]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
             <div className="relative aspect-[4/5] border border-[#C5A880]/30 p-4">
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-full h-full object-cover sepia-[0.3]" alt="The Story" />
               ) : (
                 <div className="w-full h-full bg-[#F5F5F0]/5 flex items-center justify-center font-utility text-xs tracking-[0.3em] uppercase text-[#F5F5F0]/30">Story Portrait</div>
               )}
               <div className="absolute top-1/2 -right-8 sm:-right-12 -translate-y-1/2 bg-[#C5A880] w-16 sm:w-24 h-16 sm:h-24 rounded-full flex items-center justify-center font-editorial italic text-2xl sm:text-3xl text-[#1A362D] shadow-xl">
                 Oui
               </div>
             </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
             <h3 className="font-utility text-xs tracking-[0.4em] uppercase text-[#C5A880] mb-6">{storyTitle}</h3>
             <h2 className="text-5xl sm:text-6xl font-editorial leading-tight mb-8">
               A timeless romance, <br/><span className="italic text-[#C5A880]">elegantly composed.</span>
             </h2>
             <p className="text-base sm:text-lg font-utility font-light leading-relaxed tracking-wide text-[#F5F5F0]/80">
               {story}
             </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#F5F5F0] text-[#1A362D] border-x-[12px] sm:border-x-[24px] border-[#1A362D]">
        <div className="max-w-4xl mx-auto text-center mb-20">
           <Diamond size={16} className="mx-auto text-[#C5A880] mb-6" />
           <h2 className="text-5xl sm:text-6xl font-editorial italic text-[#1A362D]">The Itinerary</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col sm:flex-row py-10 border-b border-[#1A362D]/10 last:border-0 group hover:bg-[#1A362D]/5 transition-colors px-6">
              <div className="sm:w-1/3 mb-4 sm:mb-0 flex items-center">
                <span className="font-utility text-sm font-semibold tracking-[0.2em] uppercase text-[#C5A880]">{item.time}</span>
              </div>
              <div className="sm:w-2/3">
                <h3 className="text-3xl sm:text-4xl font-editorial text-[#1A362D] mb-3">{item.event}</h3>
                <p className="font-utility text-xs uppercase tracking-[0.2em] text-[#1A362D]/60 flex items-center gap-2">
                  <MapPin size={12} className="text-[#C5A880]" /> {item.venue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#1A362D] text-[#F5F5F0] border-x-[12px] sm:border-x-[24px] border-[#F5F5F0]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
             <h3 className="font-utility text-xs tracking-[0.4em] uppercase text-[#C5A880] mb-6">The Locale</h3>
             <h2 className="text-5xl sm:text-7xl font-editorial leading-none mb-12">
               {location.split(' ').slice(0, 2).join(' ')} <br/>
               <span className="italic text-[#C5A880]">{location.split(' ').slice(2).join(' ')}</span>
             </h2>
             
             <div className="mt-12">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-4 border border-[#C5A880] text-[#C5A880] px-8 py-4 font-utility text-xs font-semibold tracking-[0.3em] uppercase hover:bg-[#C5A880] hover:text-[#1A362D] transition-colors"
                 >
                   View Coordinates <ArrowRight size={14} />
                 </a>
               )}
             </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/3] p-4 border border-[#C5A880]/30">
              {venuePhoto ? (
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale opacity-80" />
              ) : (
                <div className="w-full h-full bg-[#F5F5F0]/5 flex items-center justify-center font-utility text-xs tracking-[0.3em] uppercase text-[#F5F5F0]/30">Venue Illustration</div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#F5F5F0] text-[#1A362D] border-x-[12px] sm:border-x-[24px] border-[#1A362D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h3 className="font-utility text-xs tracking-[0.4em] uppercase text-[#C5A880] mb-4">Archives</h3>
             <h2 className="text-4xl sm:text-5xl font-editorial italic">The Collection</h2>
          </div>
          
          <div className="columns-2 md:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid relative overflow-hidden border-4 border-white shadow-md">
                <img src={url} alt={`Gallery ${index}`} className="w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#F5F5F0] text-[#1A362D] border-x-[12px] sm:border-x-[24px] border-[#1A362D] border-t border-[#1A362D]/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-utility text-xs font-semibold tracking-[0.4em] uppercase text-[#C5A880] mb-16">Anticipation</h2>

          <div className="flex flex-wrap gap-8 sm:gap-16 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-6xl sm:text-7xl md:text-[90px] font-editorial text-[#1A362D] leading-none mb-6">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-utility tracking-[0.3em] uppercase text-[#1A362D]/50 border-t border-[#1A362D]/20 pt-4 w-16 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 bg-[#1A362D] text-[#F5F5F0] border-x-[12px] sm:border-x-[24px] border-[#F5F5F0]">
        <div className="max-w-3xl mx-auto bg-[#132A22] border border-[#C5A880]/30 p-8 sm:p-16 relative">
          
          <div className="text-center mb-16">
            <h3 className="font-utility text-xs tracking-[0.4em] uppercase text-[#C5A880] mb-6">RSVP</h3>
            <h2 className="text-4xl sm:text-5xl font-editorial italic text-[#F5F5F0]">Réponez S'il Vous Plaît</h2>
          </div>

          <form className="space-y-10 font-utility" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#C5A880]/50 pb-4 text-lg outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#F5F5F0]/30 tracking-wider" placeholder="M. / Mme. Name" />
            </div>

            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#C5A880]/50 pb-4 text-lg outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#F5F5F0]/30 tracking-wider" placeholder="Dietary Preferences" />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-4 cursor-pointer group flex-1">
                <div className="w-5 h-5 border border-[#C5A880] flex items-center justify-center">
                  <input type="radio" name="attending" className="w-3 h-3 accent-[#C5A880] opacity-0 checked:opacity-100" />
                </div>
                <span className="font-light tracking-[0.2em] text-sm uppercase text-[#F5F5F0]/80">Accepts with Pleasure</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group flex-1">
                <div className="w-5 h-5 border border-[#C5A880] flex items-center justify-center">
                  <input type="radio" name="attending" className="w-3 h-3 accent-[#C5A880] opacity-0 checked:opacity-100" />
                </div>
                <span className="font-light tracking-[0.2em] text-sm uppercase text-[#F5F5F0]/80">Declines with Regret</span>
              </label>
            </div>

            <div className="pt-12 text-center">
              <button type="button" className="bg-[#C5A880] text-[#1A362D] font-semibold tracking-[0.3em] uppercase text-xs px-12 py-5 hover:bg-[#F5F5F0] transition-colors">
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#F5F5F0] relative text-[#1A362D] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Classic Editorial Opening Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1A362D] transition-transform duration-[1500ms] ease-in-out cursor-pointer ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="absolute inset-0 border-[12px] sm:border-[24px] border-[#F5F5F0]"></div>
        
        <div className={`flex flex-col items-center text-center px-6 transition-opacity duration-1000 ${isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
           <Diamond size={24} className="text-[#C5A880] mb-8" />
           
           <div className="font-editorial text-5xl sm:text-7xl text-[#F5F5F0] mb-2">
             {groomFullName}
           </div>
           <div className="font-editorial italic text-3xl sm:text-4xl text-[#C5A880] my-4">&amp;</div>
           <div className="font-editorial text-5xl sm:text-7xl text-[#F5F5F0] mt-2">
             {brideFullName}
           </div>

           <div className="mt-16 border border-[#C5A880] text-[#C5A880] px-8 py-3 font-utility font-light text-[10px] uppercase tracking-[0.4em] hover:bg-[#C5A880] hover:text-[#1A362D] transition-colors">
             Open Invitation
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-[#F5F5F0] border border-[#C5A880] shadow-xl flex items-center justify-center text-[#1A362D] hover:bg-[#C5A880] hover:text-[#F5F5F0] transition-colors duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Classic Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#1A362D] border border-[#C5A880] shadow-xl flex items-center justify-center text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A362D] transition-colors duration-300 ${isCounterPopping ? 'scale-110' : ''}`}
      >
        <Heart size={18} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-[#F5F5F0] border border-[#C5A880] text-[#1A362D] text-[10px] font-utility font-semibold tracking-wider w-7 h-7 flex items-center justify-center rounded-full shadow-md">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
