import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Sparkles, Navigation, Calendar, Clock, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ModernEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "Welcome to the beginning of our forever. We are thrilled to celebrate this milestone with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "The Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, December 12, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'December');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '12');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '8:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Skyline Lounge & Terrace";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "8:00 PM", event: "Cocktails & Welcome", date: rawDateStr, venue: location },
      { time: "9:30 PM", event: "The Proposal Toast", date: rawDateStr, venue: location },
      { time: "10:30 PM", event: "Afterparty & Dancing", date: rawDateStr, venue: location }
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
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;600&display=swap');
          .font-heading { font-family: 'Outfit', sans-serif; }
          .font-body { font-family: 'Inter', sans-serif; }
          .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
          .text-gradient { background: linear-gradient(to right, #ffffff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}</style>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-20 mt-10">
          
          <div className="glass-panel rounded-full px-6 py-2 mb-16 flex items-center gap-3">
             <Sparkles size={14} className="text-indigo-400" />
             <span className="font-heading text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-white/80">We Are Engaged</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white/70 tracking-tight leading-none">
            {groomFullName}
          </h1>
          <span className="text-4xl sm:text-6xl font-heading font-light text-indigo-400/80 my-4">&amp;</span>
          <h2 className="text-5xl sm:text-8xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white/70 via-indigo-100 to-white tracking-tight leading-none">
            {brideFullName}
          </h2>

          <div className="mt-20 flex gap-4 sm:gap-8 text-white/80 font-body text-xs sm:text-sm tracking-widest uppercase">
            <span className="glass-panel px-6 py-3 rounded-2xl">{monthStr} {dayNum}</span>
            <span className="glass-panel px-6 py-3 rounded-2xl">{yearStr}</span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">{storyTitle}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent ml-4"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 flex gap-4">
               <div className="w-1/2 aspect-[3/4] glass-panel rounded-3xl overflow-hidden shadow-2xl relative translate-y-8">
                 {groomPhoto ? (
                   <img src={groomPhoto} className="w-full h-full object-cover" alt="Groom" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center font-heading font-bold text-white/20 tracking-widest uppercase text-xs">Photo 1</div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent"></div>
               </div>
               <div className="w-1/2 aspect-[3/4] glass-panel rounded-3xl overflow-hidden shadow-2xl relative">
                  {bridePhoto ? (
                    <img src={bridePhoto} className="w-full h-full object-cover" alt="Bride" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-heading font-bold text-white/20 tracking-widest uppercase text-xs">Photo 2</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent"></div>
               </div>
            </div>

            <div className="w-full lg:w-1/2 pt-12 lg:pt-0 lg:pl-12">
               <p className="text-lg sm:text-xl font-body font-light leading-relaxed text-white/70">
                 "{story}"
               </p>
               <div className="mt-8 flex items-center gap-2 text-indigo-400 font-heading text-sm tracking-widest uppercase font-bold">
                 <span>Explore Our Journey</span>
                 <ArrowRight size={16} />
               </div>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-20 justify-end">
             <div className="h-[1px] flex-1 bg-gradient-to-l from-indigo-500/50 to-transparent mr-4"></div>
             <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">The Agenda</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="glass-panel p-8 rounded-3xl flex flex-col group hover:bg-white/5 transition-colors duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-3 mb-6 text-indigo-400">
                  <Clock size={20} />
                  <span className="font-heading text-sm tracking-widest font-semibold uppercase">{item.time}</span>
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-white mb-2">{item.event}</h3>
                <p className="font-body text-white/50 text-xs uppercase tracking-wider flex items-center gap-2 mt-auto pt-8">
                  <MapPin size={12} />
                  {item.venue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
             <div className="inline-flex items-center gap-3 glass-panel px-4 py-2 rounded-full text-indigo-400 font-heading text-[10px] uppercase tracking-[0.2em] font-bold">
               <MapPin size={14} /> Location
             </div>
             
             <h2 className="text-4xl sm:text-6xl font-heading font-bold text-white leading-tight">
               Where We <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Celebrate</span>
             </h2>
             
             <p className="text-xl font-body font-light text-white/70 max-w-md">
               {location}
             </p>

             <div className="pt-4">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-[#0F172A] px-8 py-4 rounded-2xl font-heading text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xl"
                 >
                   Get Directions <Navigation size={16} />
                 </a>
               )}
             </div>
          </div>

          {venuePhoto && (
            <div className="w-full lg:w-1/2 relative">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20 -z-10 rounded-full"></div>
               <div className="glass-panel p-3 rounded-[3rem]">
                 <img src={venuePhoto} alt="Venue" className="w-full aspect-square md:aspect-video object-cover rounded-[2.5rem]" />
               </div>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16 justify-center">
             <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">Gallery</h2>
          </div>
          
          <div className="columns-2 md:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="glass-panel p-2 rounded-3xl break-inside-avoid relative group overflow-hidden">
                <img src={url} alt={`Gallery ${index}`} className="w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                   <Heart className="text-white/80 w-8 h-8 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center glass-panel p-12 sm:p-20 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full -z-10"></div>
          
          <h3 className="text-sm font-heading font-bold tracking-[0.4em] uppercase text-indigo-400 mb-12">Time Remaining</h3>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-black/20 px-6 sm:px-8 py-6 rounded-3xl min-w-[5rem] sm:min-w-[8rem] backdrop-blur-md border border-white/5">
                <span className="text-4xl sm:text-6xl font-heading font-bold text-white mb-2">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-body text-white/50">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 sm:py-48 px-4 sm:px-6 relative z-10">
        <div className="max-w-xl mx-auto glass-panel p-8 sm:p-16 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -z-10"></div>

          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">RSVP</h2>
            <p className="text-white/50 font-body text-sm">Please let us know if you can make it.</p>
          </div>

          <form className="space-y-6 font-body" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all text-white placeholder-white/30" placeholder="Your Full Name" />
            </div>

            <div>
              <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all text-white placeholder-white/30 resize-none" placeholder="Dietary Requirements or Notes"></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex-1 justify-center group relative overflow-hidden">
                <input type="radio" name="attending" className="peer sr-only" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 peer-checked:opacity-100 transition-opacity -z-10"></div>
                <span className="text-white font-heading uppercase tracking-wider text-xs font-bold">Attending</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex-1 justify-center group relative overflow-hidden">
                <input type="radio" name="attending" className="peer sr-only" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 peer-checked:opacity-100 transition-opacity -z-10"></div>
                <span className="text-white font-heading uppercase tracking-wider text-xs font-bold">Declining</span>
              </label>
            </div>

            <div className="pt-8">
              <button type="button" className="w-full bg-white text-[#0F172A] font-heading tracking-widest font-bold uppercase text-sm py-5 rounded-2xl hover:bg-gray-100 transition-colors shadow-xl">
                Send RSVP
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#0F172A] relative text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Global Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* Opening Glass Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.8,0,0.2,1)] bg-[#0F172A]/80 backdrop-blur-xl ${isOpened ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'} cursor-pointer`}
      >
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700 delay-100 ${isOpening ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}`}>
           <div className="glass-panel border-white/20 p-12 sm:p-20 rounded-[3rem] shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
             
             {/* Inner ambient glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-40 blur-[50px] rounded-full"></div>

             <Sparkles className="text-white mb-8 w-8 h-8 opacity-80" />
             
             <div className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase mb-2 relative z-10">
               {groomFullName}
             </div>
             <span className="font-heading font-light text-2xl text-white/50 my-2 relative z-10">&amp;</span>
             <div className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase mt-2 mb-10 relative z-10">
               {brideFullName}
             </div>

             <div className="relative z-10 glass-panel rounded-full px-6 py-3 border-white/10 text-white/80 text-[10px] font-heading font-bold uppercase tracking-[0.3em] flex items-center gap-3">
               Tap to Unlock <ArrowRight size={14} />
             </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center w-full border-t border-white/5 bg-[#0F172A]/50 backdrop-blur-md">
        <h2 className="text-[10px] font-heading font-bold tracking-[0.4em] uppercase text-white/40">{rawCoupleNames}</h2>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 glass-panel rounded-full shadow-lg shadow-black/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Glass Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 glass-panel border-white/20 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ${isCounterPopping ? 'scale-110 bg-indigo-500/50' : ''}`}
      >
        <Heart size={22} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-[10px] font-heading font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
