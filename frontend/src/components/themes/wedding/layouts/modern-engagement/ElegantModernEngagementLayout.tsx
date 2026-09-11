import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Volume2, VolumeX, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ElegantModernEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 1800);
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

  const story = content?.about_text || "We invite you to share in the magic of our beginning.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'DEC');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Sapphire Room";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Evening Cocktails", date: rawDateStr, venue: location },
      { time: "9:30 PM", event: "A Toast to Love", date: rawDateStr, venue: location },
      { time: "10:30 PM", event: "Midnight Dancing", date: rawDateStr, venue: location }
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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-transparent p-0 min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@200;300;400;600&display=swap');
          .font-elegant { font-family: 'Cormorant Garamond', serif; }
          .font-sleek { font-family: 'Montserrat', sans-serif; }
          .text-copper { color: #CD7F32; }
          .bg-copper { background-color: #CD7F32; }
          .border-copper { border-color: #CD7F32; }
        `}</style>
        
        <div className="absolute inset-0 bg-[#0A0A0A]">
           <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#CD7F32]/5 blur-[120px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#CD7F32]/5 blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20">
          
          <div className="flex items-center gap-6 mb-16">
             <div className="h-[1px] w-12 bg-copper/40"></div>
             <span className="font-sleek text-[9px] tracking-[0.4em] uppercase text-copper font-semibold">Join us in Celebration</span>
             <div className="h-[1px] w-12 bg-copper/40"></div>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[100px] font-elegant font-light text-[#FFFFF0] tracking-wider leading-[1.1]">
            {groomFullName}
          </h1>
          <span className="font-elegant italic text-4xl sm:text-5xl text-copper my-6">&amp;</span>
          <h2 className="text-6xl sm:text-8xl md:text-[100px] font-elegant font-light text-[#FFFFF0] tracking-wider leading-[1.1]">
            {brideFullName}
          </h2>

          <div className="mt-24 w-[1px] h-24 bg-gradient-to-b from-copper/50 to-transparent"></div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <Sparkles size={20} className="text-copper mb-8 opacity-70" />
          <h3 className="font-sleek text-[10px] tracking-[0.4em] uppercase text-copper mb-8 font-semibold">{storyTitle}</h3>
          
          <p className="text-2xl sm:text-4xl font-elegant font-light leading-relaxed tracking-wide text-[#FFFFF0] max-w-3xl">
            "{story}"
          </p>
          
          <div className="mt-20 flex gap-8 w-full max-w-2xl justify-center items-center">
             <div className="w-1/3 aspect-[3/4] relative group">
               <div className="absolute inset-0 bg-copper opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700"></div>
               {groomPhoto ? (
                 <img src={groomPhoto} className="w-full h-full object-cover rounded-t-full border border-copper/30 relative z-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Groom" />
               ) : (
                 <div className="w-full h-full bg-[#111] rounded-t-full border border-copper/30 relative z-10 flex items-center justify-center font-sleek text-[9px] tracking-widest text-[#FFFFF0]/30 uppercase">Photo 1</div>
               )}
             </div>
             <div className="w-1/3 aspect-[3/4] relative group translate-y-12">
               <div className="absolute inset-0 bg-copper opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700"></div>
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-full h-full object-cover rounded-b-full border border-copper/30 relative z-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Bride" />
               ) : (
                 <div className="w-full h-full bg-[#111] rounded-b-full border border-copper/30 relative z-10 flex items-center justify-center font-sleek text-[9px] tracking-widest text-[#FFFFF0]/30 uppercase">Photo 2</div>
               )}
             </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 w-[1px] bg-gradient-to-b from-transparent via-copper/30 to-transparent sm:-translate-x-1/2"></div>
          
          <div className="text-center mb-24 relative z-10 bg-[#0A0A0A] inline-block sm:w-full mx-auto">
             <h2 className="text-4xl sm:text-5xl font-elegant italic text-[#FFFFF0]">The Evening</h2>
          </div>

          <div className="flex flex-col gap-16 relative z-10">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className={`flex flex-col sm:flex-row items-start sm:items-center w-full group pl-12 sm:pl-0`}>
                
                <div className={`sm:w-1/2 flex justify-start sm:justify-end sm:pr-12 w-full ${idx % 2 !== 0 ? 'sm:order-2 sm:justify-start sm:pl-12' : 'sm:order-1'}`}>
                  <div className="text-left sm:text-right">
                    <div className={`font-sleek text-xs font-semibold tracking-[0.3em] uppercase text-copper mb-2 ${idx % 2 !== 0 ? 'sm:text-left' : 'sm:text-right'}`}>{item.time}</div>
                    <h3 className={`text-2xl sm:text-3xl font-elegant text-[#FFFFF0] mb-2 ${idx % 2 !== 0 ? 'sm:text-left' : 'sm:text-right'}`}>{item.event}</h3>
                    <p className={`font-sleek text-[9px] uppercase tracking-[0.2em] text-[#FFFFF0]/50 flex items-center gap-2 ${idx % 2 !== 0 ? 'sm:justify-start' : 'sm:justify-end'}`}>
                      <MapPin size={10} className="text-copper" /> {item.venue}
                    </p>
                  </div>
                </div>

                <div className="absolute left-[13px] sm:left-1/2 w-2 h-2 rounded-full bg-copper sm:-translate-x-1/2 group-hover:scale-150 group-hover:shadow-[0_0_15px_#CD7F32] transition-all duration-300 mt-6 sm:mt-0"></div>
                
                <div className={`hidden sm:block sm:w-1/2 ${idx % 2 !== 0 ? 'sm:order-1' : 'sm:order-2'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
           <h3 className="font-sleek text-[10px] tracking-[0.4em] uppercase text-copper mb-6 font-semibold">Location</h3>
           <h2 className="text-4xl sm:text-5xl font-elegant italic text-[#FFFFF0] mb-12 text-center">
             {location}
           </h2>
           
           <div className="w-full max-w-3xl aspect-[16/9] relative mb-12 group">
             <div className="absolute inset-0 border border-copper/30 m-4 sm:m-6 z-20 pointer-events-none"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10"></div>
             {venuePhoto ? (
               <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" />
             ) : (
               <div className="w-full h-full bg-[#111] flex items-center justify-center font-sleek text-[10px] tracking-[0.3em] uppercase text-[#FFFFF0]/30">Venue View</div>
             )}
           </div>

           {mapUrl && (
             <a
               href={mapUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-4 bg-transparent border border-copper text-[#FFFFF0] px-8 py-4 font-sleek text-[10px] font-semibold tracking-[0.3em] uppercase hover:bg-copper hover:text-[#0A0A0A] transition-colors duration-500"
             >
               View Map <Navigation size={12} />
             </a>
           )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-elegant italic text-[#FFFFF0] mb-20">Moments</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[3/4] relative group overflow-hidden">
                <div className="absolute inset-0 border border-copper/0 group-hover:border-copper/50 m-4 z-20 transition-all duration-500 pointer-events-none"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10 border-t border-copper/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-sleek text-[10px] font-semibold tracking-[0.4em] uppercase text-copper mb-16">The Wait Is Almost Over</h3>

          <div className="flex flex-wrap gap-8 sm:gap-16 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-20 sm:w-24">
                <span className="text-5xl sm:text-6xl font-elegant font-light text-[#FFFFF0] mb-4">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[9px] font-sleek font-semibold tracking-[0.3em] uppercase text-[#FFFFF0]/40">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-6 sm:px-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-elegant italic text-copper mb-6">RSVP</h2>
            <p className="font-sleek text-[10px] font-semibold tracking-[0.2em] uppercase text-[#FFFFF0]/60">Please reply by November 1st, 2026</p>
          </div>

          <form className="space-y-12 font-sleek text-sm" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#FFFFF0]/20 pb-4 outline-none focus:border-copper transition-colors placeholder:text-[#FFFFF0]/30 tracking-widest uppercase text-[10px] text-[#FFFFF0]" placeholder="Guest Name(s)" />
            </div>

            <div>
              <input type="text" className="w-full bg-transparent border-b border-[#FFFFF0]/20 pb-4 outline-none focus:border-copper transition-colors placeholder:text-[#FFFFF0]/30 tracking-widest uppercase text-[10px] text-[#FFFFF0]" placeholder="Dietary Restrictions" />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-4 cursor-pointer group flex-1">
                <div className="w-4 h-4 rounded-full border border-copper flex items-center justify-center">
                  <input type="radio" name="attending" className="w-2 h-2 rounded-full bg-copper opacity-0 checked:opacity-100 appearance-none" />
                </div>
                <span className="font-light tracking-[0.2em] uppercase text-[10px] text-[#FFFFF0]/80">Joyfully Accepts</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group flex-1">
                <div className="w-4 h-4 rounded-full border border-copper flex items-center justify-center">
                  <input type="radio" name="attending" className="w-2 h-2 rounded-full bg-copper opacity-0 checked:opacity-100 appearance-none" />
                </div>
                <span className="font-light tracking-[0.2em] uppercase text-[10px] text-[#FFFFF0]/80">Regretfully Declines</span>
              </label>
            </div>

            <div className="pt-16 text-center">
              <button type="button" className="bg-transparent border border-copper text-copper font-semibold tracking-[0.3em] uppercase text-[10px] px-16 py-4 hover:bg-copper hover:text-[#0A0A0A] transition-colors duration-500">
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] relative text-[#FFFFF0] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Elegant Opening Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] transition-all duration-[2000ms] ease-out cursor-pointer ${isOpened ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-copper/10 via-transparent to-transparent opacity-50"></div>
        <div className="absolute inset-0 border border-copper/20 m-6 sm:m-12"></div>
        
        <div className={`flex flex-col items-center text-center px-6 transition-all duration-[1500ms] ${isOpening ? 'opacity-0 translate-y-8 blur-md' : 'opacity-100 translate-y-0 blur-0'}`}>
           <span className="font-sleek text-[9px] font-semibold uppercase tracking-[0.5em] text-copper mb-8">You are invited</span>
           
           <div className="w-16 h-[1px] bg-copper/50 mb-8"></div>

           <div className="font-elegant text-5xl sm:text-7xl text-[#FFFFF0] font-light tracking-wide mb-2">
             {groomFullName}
           </div>
           <div className="font-elegant italic text-3xl sm:text-4xl text-copper my-2">&amp;</div>
           <div className="font-elegant text-5xl sm:text-7xl text-[#FFFFF0] font-light tracking-wide mt-2">
             {brideFullName}
           </div>

           <div className="w-16 h-[1px] bg-copper/50 mt-12 mb-12"></div>

           <div className="font-sleek font-semibold text-[9px] uppercase tracking-[0.4em] text-[#FFFFF0]/50 hover:text-copper transition-colors cursor-pointer flex items-center gap-3">
             <ArrowRight size={12} className="text-copper" /> Enter <ArrowRight size={12} className="text-copper" />
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center w-full bg-[#050505] text-[#FFFFF0]/40 border-t border-copper/20">
        <h2 className="text-[9px] font-sleek font-semibold tracking-[0.5em] uppercase">{rawCoupleNames}</h2>
      </footer>

      {/* Elegant Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-transparent border border-copper rounded-full flex items-center justify-center text-copper hover:bg-copper hover:text-[#0A0A0A] transition-colors duration-500 backdrop-blur-md"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* Elegant Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#0A0A0A] border border-copper rounded-full flex items-center justify-center text-copper hover:bg-copper hover:text-[#0A0A0A] transition-colors duration-500 shadow-[0_0_20px_rgba(205,127,50,0.15)] ${isCounterPopping ? 'scale-110' : ''}`}
      >
        <Heart size={16} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-pulse' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-copper text-[#0A0A0A] text-[9px] font-sleek font-bold tracking-wider w-6 h-6 flex items-center justify-center rounded-full shadow-md">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
