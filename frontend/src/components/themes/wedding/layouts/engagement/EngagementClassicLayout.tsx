import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function EngagementClassicLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "We're taking the next big step! Join us for an evening of champagne, laughter, and love as we celebrate our engagement.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "We're Engaged!";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Sapphire Room, Downtown";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Cocktails & Welcome", date: rawDateStr, venue: location },
      { time: "8:30 PM", event: "Dinner & Toast", date: rawDateStr, venue: location },
      { time: "10:00 PM", event: "Celebration & Dancing", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T19:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Join us to celebrate our engagement.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#0F172A] text-white p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&family=Montserrat:wght@300;400;500&display=swap');
          .font-bodoni { font-family: 'Bodoni Moda', serif; }
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .champagne-gradient { background: linear-gradient(135deg, #F3E7E9 0%, #E3EEFF 99%, #E3EEFF 100%); }
          .gold-text { background: linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37); -webkit-background-clip: text; color: transparent; }
        `}</style>

        {/* Midnight Blue Background with subtle stars/sparkles */}
        <div className="absolute inset-0 bg-[#0F172A] z-0">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none mix-blend-screen"></div>
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#1E293B] to-transparent pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-20">
          
          <div className="mb-10 animate-pulse">
            <Sparkles className="text-[#D4AF37]" size={28} strokeWidth={1} />
          </div>

          <span className="text-xs sm:text-sm font-montserrat tracking-[0.4em] uppercase text-[#94A3B8] mb-10 font-light">
            {quoteText}
          </span>

          <h1 className="text-6xl sm:text-8xl font-bodoni tracking-widest text-white uppercase mb-6 drop-shadow-lg">
            {groomFullName}
          </h1>
          <span className="text-3xl font-bodoni italic gold-text mb-6">&</span>
          <h2 className="text-6xl sm:text-8xl font-bodoni tracking-widest text-white uppercase drop-shadow-lg">
            {brideFullName}
          </h2>

          <div className="w-16 h-[1px] bg-[#D4AF37]/50 my-12"></div>

          <div className="flex flex-col items-center">
             <span className="text-lg sm:text-2xl font-bodoni tracking-[0.2em] uppercase text-white mb-2">{monthStr} {dayNum}, {yearStr}</span>
             <span className="text-xs sm:text-sm font-montserrat tracking-[0.3em] text-[#D4AF37] uppercase">{location}</span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bodoni text-[#0F172A] uppercase tracking-[0.1em] mb-12">The Proposal</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-16">
            <div className="w-48 h-64 sm:w-56 sm:h-72 bg-[#F8FAFC] border border-[#E2E8F0] p-3 shadow-lg rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
              {groomPhoto ? <img src={groomPhoto} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Groom" /> : <div className="w-full h-full bg-[#E2E8F0] animate-pulse"></div>}
            </div>
            <div className="w-48 h-64 sm:w-56 sm:h-72 bg-[#F8FAFC] border border-[#E2E8F0] p-3 shadow-lg rotate-[3deg] hover:rotate-0 transition-transform duration-500">
               {bridePhoto ? <img src={bridePhoto} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Bride" /> : <div className="w-full h-full bg-[#E2E8F0] animate-pulse"></div>}
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-[#334155] font-bodoni italic leading-relaxed px-4">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#0F172A] text-white border-y border-[#1E293B]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none mix-blend-screen"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bodoni tracking-[0.2em] uppercase gold-text">Evening Schedule</h2>
          </div>

          <div className="flex flex-col max-w-2xl mx-auto border-l border-[#D4AF37]/30 pl-8 ml-4 sm:ml-auto">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="relative mb-12 last:mb-0">
                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#0F172A] border-2 border-[#D4AF37]"></div>
                <h3 className="text-xl sm:text-2xl font-bodoni tracking-[0.1em] text-white uppercase mb-1">{item.event}</h3>
                <span className="text-[#94A3B8] font-montserrat text-sm tracking-[0.2em]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl sm:text-5xl font-bodoni text-[#0F172A] uppercase tracking-[0.1em] mb-4">The Celebration</h2>
             <p className="text-[#64748B] font-montserrat text-sm tracking-widest uppercase">Join us for a toast</p>
          </div>

          <div className="mt-12 text-center bg-white p-8 sm:p-16 border border-[#E2E8F0] shadow-sm">
            <p className="text-2xl sm:text-3xl font-bodoni text-[#0F172A] tracking-widest uppercase mb-12">{location}</p>

            {venuePhoto && (
              <div className="w-full h-72 sm:h-96 overflow-hidden bg-[#eee] mb-12 border border-[#E2E8F0]">
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex justify-center mt-8">
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#0F172A] hover:bg-[#1E293B] text-white px-10 py-4 font-montserrat text-xs tracking-[0.2em] uppercase transition-all"
                >
                  <Navigation size={14} />
                  Open in Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl sm:text-5xl font-bodoni text-[#0F172A] uppercase tracking-[0.1em]">Memories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className={`bg-[#F8FAFC] overflow-hidden group ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''} aspect-square`}>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-montserrat tracking-[0.4em] uppercase text-[#D4AF37] mb-12">Counting Down To Forever</p>

          <div className="flex gap-4 sm:gap-12 justify-center border border-[#1E293B] p-8 sm:p-12">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl font-bodoni mb-2">{item.value}</span>
                <span className="text-[9px] sm:text-xs tracking-[0.3em] uppercase font-montserrat text-[#94A3B8]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bodoni text-[#0F172A] uppercase tracking-[0.1em]">RSVP</h2>
            <p className="text-[#64748B] font-montserrat text-sm tracking-widest uppercase mt-4">Kindly reply by September 1st</p>
          </div>

          <div className="bg-white p-8 sm:p-16 border border-[#E2E8F0] mt-12 shadow-md">
            <form className="space-y-8 font-montserrat max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b-2 border-[#E2E8F0] px-2 py-4 outline-none focus:border-[#0F172A] transition-colors text-[#0F172A] text-sm tracking-widest uppercase placeholder-[#94A3B8]" placeholder="Full Name(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b-2 border-[#E2E8F0] px-2 py-4 outline-none focus:border-[#0F172A] transition-colors text-[#0F172A] text-sm tracking-widest uppercase placeholder-[#94A3B8] resize-none" placeholder="Leave a message for the couple"></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E2E8F0] hover:border-[#0F172A] transition-colors flex-1 justify-center">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#0F172A]" />
                    <span className="text-[#0F172A] uppercase tracking-widest text-xs font-semibold">Accepts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E2E8F0] hover:border-[#0F172A] transition-colors flex-1 justify-center">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#0F172A]" />
                    <span className="text-[#0F172A] uppercase tracking-widest text-xs font-semibold">Declines</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-montserrat font-bold tracking-[0.3em] uppercase text-xs py-5 transition-colors">
                  Submit RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative text-[#0F172A] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Special Engagement Opening: Shooting Star Diagonal Split */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-[2000ms] bg-transparent ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          .diagonal-split-top {
            clip-path: polygon(0 0, 100% 0, 100% 100%);
          }
          .diagonal-split-bottom {
            clip-path: polygon(0 0, 100% 100%, 0 100%);
          }
          @keyframes shootingStar {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateX(200%) translateY(200%) rotate(45deg); opacity: 0; }
          }
          @keyframes floatingParticle {
            0% { transform: translateY(0) scale(1); opacity: 0.5; }
            50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
            100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
          }
        `}</style>
        
        {/* Top-Right Triangle Background */}
        <div className={`absolute inset-0 bg-[#0F172A] diagonal-split-top transition-transform duration-[2500ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 ${isOpening ? 'translate-x-full -translate-y-full opacity-80' : 'translate-x-0 translate-y-0 opacity-100'}`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen pointer-events-none"></div>
        </div>

        {/* Bottom-Left Triangle Background */}
        <div className={`absolute inset-0 bg-[#0F172A] diagonal-split-bottom transition-transform duration-[2500ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 ${isOpening ? '-translate-x-full translate-y-full opacity-80' : 'translate-x-0 translate-y-0 opacity-100'}`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen pointer-events-none"></div>
        </div>

        {/* Central Elegance Opening Card */}
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isOpening ? 'opacity-0 scale-150 blur-xl translate-y-[-20px]' : 'opacity-100 scale-100'}`}>
           <div className="w-64 h-80 sm:w-80 sm:h-96 border border-[#1E293B] bg-[#0B1221]/90 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-8 group transition-all duration-700 hover:border-[#D4AF37]/50 hover:shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
             
             {/* Subtle Inner Glow */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

             <Sparkles className="text-[#D4AF37] mb-6 animate-pulse" size={24} strokeWidth={1.5} />
             
             <h3 className="text-[#94A3B8] font-montserrat text-[10px] uppercase tracking-[0.4em] mb-4">We Are Engaged</h3>
             
             <div className="text-center font-bodoni text-4xl sm:text-5xl text-white uppercase tracking-widest leading-tight relative z-10">
               {groomFullName}<br/>
               <span className="text-xl gold-text italic lowercase block my-3">&amp;</span>
               {brideFullName}
             </div>

             <div className="mt-12 bg-white text-[#0F172A] px-8 py-3 text-[10px] font-montserrat font-bold uppercase tracking-[0.3em] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500 relative z-10 shadow-lg">
               {isOpening ? 'CELEBRATING...' : 'ENTER'}
             </div>
           </div>
        </div>

        {/* Shooting Star Line Effect (Only visible when opening) */}
        {isOpening && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="absolute w-[200vw] h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-white shadow-[0_0_30px_10px_rgba(212,175,55,0.8)] animate-[shootingStar_1.5s_ease-in-out_forwards]"></div>
          </div>
        )}

        {/* Golden Champagne Particles floating up */}
        {isOpening && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {[...Array(25)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,1)]"
                style={{
                  left: `${(i * 17) % 100}%`,
                  bottom: `${-10 + (i % 5) * 5}%`,
                  animation: `floatingParticle ${1.5 + Math.random()}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center bg-[#0F172A] text-[#D4AF37] w-full border-t border-[#1E293B]">
        <h2 className="text-xl font-bodoni tracking-[0.3em] uppercase">{rawCoupleNames}</h2>
      </footer>

    </div>
  );
}
