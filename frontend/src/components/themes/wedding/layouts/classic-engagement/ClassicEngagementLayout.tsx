import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Navigation, Sparkles, Star, Compass, Volume2, VolumeX } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ClassicEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "Together with our families, we invite you to celebrate the beginning of our forever.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "We Are Engaged";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'December');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Ballroom, 123 Luxury Ave";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Welcome Reception", date: rawDateStr, venue: location },
      { time: "8:00 PM", event: "Ring Exchange & Toast", date: rawDateStr, venue: location },
      { time: "9:30 PM", event: "Dinner & Dancing", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-12-12T19:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Two souls, one heart.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FDFBF7] text-[#1A1A1D] p-0 overflow-hidden min-h-[90vh]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          .gold-accent { color: #C5A880; }
          .bg-gold-accent { background-color: #C5A880; }
        `}</style>
        
        {/* Ornate border overlay */}
        <div className="absolute inset-4 sm:inset-8 border-[1px] border-[#C5A880]/40 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C5A880]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C5A880]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C5A880]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C5A880]"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20">
          <span className="text-xs sm:text-sm font-inter tracking-[0.3em] uppercase gold-accent mb-12 font-light">
            {quoteText}
          </span>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-playfair text-[#1A1A1D] mb-4">
            {groomFullName}
          </h1>
          <span className="text-4xl font-playfair italic gold-accent my-2">and</span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-playfair text-[#1A1A1D] mt-4">
            {brideFullName}
          </h2>

          <div className="w-12 h-[1px] bg-gold-accent my-12"></div>

          <div className="flex flex-col items-center space-y-3">
             <span className="text-lg sm:text-xl font-playfair tracking-[0.1em] text-[#1A1A1D] uppercase">
               {monthStr} {dayNum}, {yearStr}
             </span>
             <span className="text-xs sm:text-sm font-inter tracking-[0.2em] text-[#666] uppercase">
               {location}
             </span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#1A1A1D] text-[#FDFBF7]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <Star className="gold-accent mb-6" size={24} strokeWidth={1} />
          <h2 className="text-3xl sm:text-5xl font-playfair uppercase tracking-widest mb-16 gold-accent">
            {storyTitle}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[1px] bg-gold-accent/30 hidden md:block z-0"></div>
            
            <div className="w-56 h-72 sm:w-64 sm:h-80 relative z-10 bg-[#121215] p-2 border border-[#333]">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Groom" />
              ) : (
                <div className="w-full h-full bg-[#333] flex items-center justify-center font-playfair text-[#666]">Him</div>
              )}
            </div>
            <div className="w-56 h-72 sm:w-64 sm:h-80 relative z-10 bg-[#121215] p-2 border border-[#333] mt-8 md:mt-12">
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Bride" />
               ) : (
                 <div className="w-full h-full bg-[#333] flex items-center justify-center font-playfair text-[#666]">Her</div>
               )}
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-playfair italic leading-relaxed px-4 max-w-2xl text-[#E5E5E5]">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-playfair tracking-[0.1em] uppercase text-[#1A1A1D] mb-4">The Festivities</h2>
            <div className="w-16 h-[1px] bg-gold-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col border-t border-[#C5A880]/30 pt-6">
                <span className="font-inter text-xs tracking-[0.2em] gold-accent mb-2 uppercase">{item.time}</span>
                <h3 className="text-2xl sm:text-3xl font-playfair text-[#1A1A1D] mb-3">{item.event}</h3>
                <p className="font-inter text-[#666] text-sm uppercase tracking-wider">{item.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#F5F2EA]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
             <h2 className="text-3xl sm:text-5xl font-playfair text-[#1A1A1D] uppercase tracking-wider">Venue</h2>
             <div className="w-12 h-[1px] bg-gold-accent mx-auto md:mx-0"></div>
             
             <p className="text-xl font-playfair text-[#333] leading-relaxed">
               {location}
             </p>

             <div className="pt-4 flex justify-center md:justify-start">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 border border-[#1A1A1D] hover:bg-[#1A1A1D] hover:text-white text-[#1A1A1D] px-8 py-3 font-inter text-xs tracking-[0.2em] uppercase transition-all duration-300"
                 >
                   <MapPin size={14} />
                   Get Directions
                 </a>
               )}
             </div>
          </div>

          {venuePhoto && (
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/5] overflow-hidden bg-white p-3 shadow-xl">
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-4 sm:px-6 relative z-10 bg-[#1A1A1D]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-3xl sm:text-4xl font-playfair text-[#FDFBF7] uppercase tracking-[0.1em] mb-4">Captured Moments</h2>
             <div className="w-16 h-[1px] bg-gold-accent mx-auto"></div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid overflow-hidden group">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-4 sm:px-6 relative z-10 bg-[#FDFBF7] border-b border-[#EAE5D9]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-playfair italic text-[#1A1A1D] mb-12">Waiting for the day</h3>

          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-20 sm:w-24">
                <span className="text-4xl sm:text-5xl font-playfair text-[#1A1A1D] mb-3">{item.value}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-inter gold-accent">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#F5F2EA]">
        <div className="max-w-2xl mx-auto bg-white p-10 sm:p-16 shadow-2xl border border-[#EAE5D9]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair text-[#1A1A1D] uppercase tracking-[0.1em] mb-4">RSVP</h2>
            <div className="w-10 h-[1px] bg-gold-accent mx-auto mb-6"></div>
            <p className="text-[#666] font-inter text-xs tracking-widest uppercase">Kindly reply by December 1st</p>
          </div>

          <form className="space-y-8 font-inter" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#C5A880] px-2 py-3 outline-none focus:border-[#1A1A1D] transition-colors text-[#1A1A1D] text-sm tracking-wider placeholder-[#999]" placeholder="Guest Name(s)" />
            </div>

            <div>
              <textarea rows={2} className="w-full bg-transparent border-b border-[#C5A880] px-2 py-3 outline-none focus:border-[#1A1A1D] transition-colors text-[#1A1A1D] text-sm tracking-wider placeholder-[#999] resize-none" placeholder="Message or Dietary Requirements"></textarea>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#C5A880] hover:bg-[#FDFBF7] transition-colors flex-1 justify-center">
                <input type="radio" name="attending" className="w-4 h-4 accent-[#1A1A1D]" />
                <span className="text-[#1A1A1D] uppercase tracking-wider text-xs font-semibold">Joyfully Accept</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#C5A880] hover:bg-[#FDFBF7] transition-colors flex-1 justify-center">
                <input type="radio" name="attending" className="w-4 h-4 accent-[#1A1A1D]" />
                <span className="text-[#1A1A1D] uppercase tracking-wider text-xs font-semibold">Regretfully Decline</span>
              </label>
            </div>

            <div className="pt-6">
              <button type="button" className="w-full bg-[#1A1A1D] hover:bg-[#333] text-[#FDFBF7] font-inter font-bold tracking-[0.2em] uppercase text-xs py-4 transition-colors">
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#FDFBF7] relative text-[#1A1A1D] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Opening Envelope Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 bg-transparent ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer`}
      >
        <div className={`absolute inset-0 bg-[#1A1A1D] transition-transform duration-1000 ease-in-out z-10 ${isOpening ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        </div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isOpening ? 'opacity-0 scale-110 translate-y-[-20px]' : 'opacity-100 scale-100'}`}>
           <div className="w-72 sm:w-96 border-[2px] border-[#C5A880] bg-[#1A1A1D] p-10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-[1px] bg-[#C5A880] mb-6"></div>
             
             <h3 className="text-[#FDFBF7] font-inter text-[10px] uppercase tracking-[0.3em] mb-4">You are invited to the engagement of</h3>
             
             <div className="font-playfair text-3xl sm:text-4xl text-white uppercase tracking-widest leading-tight mb-6">
               {groomFullName}<br/>
               <span className="text-lg gold-accent italic lowercase block my-2">&</span>
               {brideFullName}
             </div>

             <div className="w-12 h-[1px] bg-[#C5A880] mb-8"></div>

             <div className="text-white border border-[#C5A880] px-8 py-3 text-[10px] font-inter font-bold uppercase tracking-[0.2em] hover:bg-[#C5A880] hover:text-[#1A1A1D] transition-colors duration-300">
               Open Invitation
             </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-[#1A1A1D] text-white w-full border-t border-[#333]">
        <h2 className="text-sm font-playfair tracking-widest uppercase text-[#C5A880]">{rawCoupleNames}</h2>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-[#1A1A1D] rounded-full shadow-lg shadow-black/20 border border-[#C5A880]/30 flex items-center justify-center text-[#FDFBF7] hover:bg-[#2A2A2D] hover:scale-105 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Floating Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1A1A1D] rounded-full shadow-lg border border-[#C5A880] flex items-center justify-center text-[#C5A880] hover:scale-110 hover:bg-[#C5A880] hover:text-[#1A1A1D] transition-all duration-300 ${isCounterPopping ? 'scale-125' : ''}`}
      >
        <Heart size={24} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#1A1A1D] text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border border-[#C5A880] shadow-sm">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
