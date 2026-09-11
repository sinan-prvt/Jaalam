import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Sparkles, Diamond, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ElegantEngagementLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const story = content?.about_text || "We invite you to share in our joy as we celebrate our engagement. An evening of elegance and romance awaits.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '7:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Plaza Hotel, Ballroom";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM", event: "Welcome Reception", date: rawDateStr, venue: location },
      { time: "8:30 PM", event: "Formal Dinner", date: rawDateStr, venue: location },
      { time: "10:00 PM", event: "Dancing", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-24T19:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Two souls, one beautifully elegant journey.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#F8F9FA] text-[#1E293B] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
          .font-serif { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Montserrat', sans-serif; }
          .elegant-border { border: 1px solid rgba(30, 41, 59, 0.1); }
        `}</style>
        
        {/* Subtle geometric lines */}
        <div className="absolute inset-4 sm:inset-8 border-[1px] border-[#1E293B]/10 pointer-events-none z-0 mix-blend-multiply"></div>
        <div className="absolute inset-5 sm:inset-10 border-[1px] border-[#1E293B]/5 pointer-events-none z-0 mix-blend-multiply"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-6 py-20">
          
          <div className="flex items-center gap-4 mb-16 opacity-70">
            <div className="w-12 h-[1px] bg-[#1E293B]"></div>
            <Diamond size={12} className="text-[#1E293B]" />
            <div className="w-12 h-[1px] bg-[#1E293B]"></div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif text-[#1E293B] tracking-[0.1em] mb-4 uppercase">
            {groomFullName}
          </h1>
          <span className="text-2xl sm:text-4xl font-serif italic text-[#64748B] my-2">&amp;</span>
          <h2 className="text-4xl sm:text-6xl font-serif text-[#1E293B] tracking-[0.1em] mt-4 uppercase">
            {brideFullName}
          </h2>

          <div className="mt-20 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-[#64748B] mb-6 font-medium">
              Are Getting Engaged
            </span>
            <div className="flex flex-col items-center border border-[#1E293B]/10 p-6 sm:p-10 bg-white shadow-sm">
               <span className="text-sm sm:text-base font-sans tracking-[0.2em] text-[#1E293B] uppercase font-medium">
                 {monthStr}
               </span>
               <span className="text-4xl sm:text-6xl font-serif text-[#1E293B] my-4">
                 {dayNum}
               </span>
               <span className="text-sm sm:text-base font-sans tracking-[0.2em] text-[#1E293B] uppercase font-medium">
                 {yearStr}
               </span>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="flex items-center gap-4 mb-12 opacity-60">
             <div className="w-8 h-[1px] bg-[#1E293B]"></div>
             <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#1E293B] font-medium">{storyTitle}</span>
             <div className="w-8 h-[1px] bg-[#1E293B]"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16 w-full max-w-2xl mx-auto">
            <div className="w-full md:w-1/2 aspect-[4/5] relative z-10 overflow-hidden shadow-md">
              {groomPhoto ? (
                <img src={groomPhoto} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Groom" />
              ) : (
                <div className="w-full h-full bg-[#F8F9FA] flex items-center justify-center font-sans font-light text-[#94A3B8] tracking-widest uppercase text-xs">His Portrait</div>
              )}
            </div>
            <div className="w-full md:w-1/2 aspect-[4/5] relative z-10 overflow-hidden shadow-md md:mt-12">
               {bridePhoto ? (
                 <img src={bridePhoto} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Bride" />
               ) : (
                 <div className="w-full h-full bg-[#F8F9FA] flex items-center justify-center font-sans font-light text-[#94A3B8] tracking-widest uppercase text-xs">Her Portrait</div>
               )}
            </div>
          </div>

          <div className="relative p-8 sm:p-12 border border-[#1E293B]/10 max-w-2xl bg-[#F8F9FA]/50">
            <Diamond size={16} className="text-[#1E293B]/20 absolute -top-2 -left-2 bg-white" />
            <Diamond size={16} className="text-[#1E293B]/20 absolute -top-2 -right-2 bg-white" />
            <Diamond size={16} className="text-[#1E293B]/20 absolute -bottom-2 -left-2 bg-white" />
            <Diamond size={16} className="text-[#1E293B]/20 absolute -bottom-2 -right-2 bg-white" />
            
            <p className="text-lg sm:text-xl font-serif italic leading-relaxed text-center text-[#334155]">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#F8F9FA]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16">
            <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#64748B] mb-4">The Evening</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1E293B]">Itinerary</h2>
          </div>

          <div className="flex flex-col max-w-xl mx-auto">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-8 py-8 border-b border-[#1E293B]/10 last:border-b-0">
                <div className="w-1/3 flex flex-col items-end text-right">
                  <span className="font-sans text-xs tracking-[0.2em] text-[#1E293B] font-medium">{item.time}</span>
                </div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className="w-[1px] h-[120%] bg-[#1E293B]/10 absolute -top-[10%]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#1E293B] relative z-10 ring-4 ring-[#F8F9FA]"></div>
                </div>
                <div className="w-2/3 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#1E293B] mb-1">{item.event}</h3>
                  <p className="font-sans text-[#64748B] text-[10px] uppercase tracking-widest">{item.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {venuePhoto && (
            <div className="w-full lg:w-1/2">
              <div className="relative p-2 bg-white border border-[#1E293B]/10 shadow-sm">
                 <img src={venuePhoto} alt="Venue" className="w-full aspect-[4/3] object-cover" />
                 <div className="absolute inset-4 border border-white/50 pointer-events-none"></div>
              </div>
            </div>
          )}
          
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
             <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#64748B] mb-4">Location</span>
             <h2 className="text-3xl sm:text-4xl font-serif text-[#1E293B] mb-8">The Venue</h2>
             
             <p className="text-lg font-serif italic text-[#334155] leading-relaxed max-w-md">
               {location}
             </p>

             <div className="pt-10">
               {mapUrl && (
                 <a
                   href={mapUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 bg-[#1E293B] hover:bg-[#334155] text-white px-10 py-4 font-sans text-xs tracking-[0.3em] uppercase transition-all duration-300 shadow-md"
                 >
                   View Directions
                 </a>
               )}
             </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#64748B] mb-4">Moments</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1E293B]">Gallery</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="overflow-hidden aspect-square relative group bg-white p-1 border border-[#1E293B]/5 shadow-sm">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#1E293B]/0 group-hover:bg-[#1E293B]/10 transition-colors duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto text-center border-y border-[#1E293B]/10 py-16 relative">
          <Diamond size={12} className="text-[#1E293B] absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-1" />
          <Diamond size={12} className="text-[#1E293B] absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-white px-1" />
          
          <h3 className="text-xl font-serif text-[#1E293B] mb-12 italic">Anticipating the Day</h3>

          <div className="flex flex-wrap gap-8 sm:gap-16 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[4rem] sm:min-w-[5rem]">
                <span className="text-4xl sm:text-6xl font-serif text-[#1E293B] mb-3">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[9px] tracking-[0.3em] uppercase font-sans text-[#64748B] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#1E293B] text-white">
        <div className="max-w-2xl mx-auto relative">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#94A3B8] mb-4 block">RSVP</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">Will You Join Us?</h2>
            <div className="w-12 h-[1px] bg-[#475569] mx-auto"></div>
          </div>

          <form className="space-y-8 font-sans" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#94A3B8] mb-2 font-medium">Guest Name(s)</label>
              <input type="text" className="w-full bg-transparent border-b border-[#475569] px-0 py-3 outline-none focus:border-white transition-colors text-white text-sm" />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#94A3B8] mb-2 font-medium">Dietary Restrictions</label>
              <textarea rows={2} className="w-full bg-transparent border-b border-[#475569] px-0 py-3 outline-none focus:border-white transition-colors text-white text-sm resize-none"></textarea>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-8 justify-center">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="w-4 h-4 border border-[#475569] group-hover:border-white rounded-full flex items-center justify-center transition-colors">
                  <input type="radio" name="attending" className="w-2 h-2 accent-white opacity-0 checked:opacity-100" />
                </div>
                <span className="text-white uppercase tracking-[0.2em] text-xs font-medium">Joyfully Accept</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="w-4 h-4 border border-[#475569] group-hover:border-white rounded-full flex items-center justify-center transition-colors">
                  <input type="radio" name="attending" className="w-2 h-2 accent-white opacity-0 checked:opacity-100" />
                </div>
                <span className="text-white uppercase tracking-[0.2em] text-xs font-medium">Regretfully Decline</span>
              </label>
            </div>

            <div className="pt-10 text-center">
              <button type="button" className="bg-white text-[#1E293B] hover:bg-[#F8F9FA] font-sans tracking-[0.3em] uppercase text-xs px-12 py-5 transition-colors font-semibold shadow-lg shadow-black/20">
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] relative text-[#1E293B] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Opening Elegant Reveal Effect */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 bg-transparent ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer`}
      >
        <div className={`absolute inset-0 bg-[#F8F9FA] transition-all duration-1000 ease-[cubic-bezier(0.8,0,0.2,1)] z-10 flex ${isOpening ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          {/* Subtle paper texture */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
          {/* Edge border */}
          <div className="absolute inset-4 border border-[#1E293B]/10"></div>
        </div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-[1200ms] ${isOpening ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
           <div className="flex flex-col items-center text-center px-12 py-16 bg-white border border-[#1E293B]/10 shadow-2xl relative">
             
             {/* Corner Accents */}
             <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#1E293B]/30"></div>
             <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#1E293B]/30"></div>
             <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#1E293B]/30"></div>
             <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#1E293B]/30"></div>

             <span className="text-[#64748B] font-sans text-[9px] uppercase tracking-[0.5em] mb-10 font-medium">Engagement Invitation</span>
             
             <div className="font-serif text-3xl sm:text-5xl text-[#1E293B] tracking-[0.1em] uppercase mb-4">
               {groomFullName}
             </div>
             <span className="font-serif italic text-xl text-[#94A3B8] my-2">&amp;</span>
             <div className="font-serif text-3xl sm:text-5xl text-[#1E293B] tracking-[0.1em] uppercase mt-4 mb-12">
               {brideFullName}
             </div>

             <div className="flex flex-col items-center gap-3">
               <span className="text-[#1E293B] text-[9px] font-sans uppercase tracking-[0.4em] border-b border-[#1E293B]/30 pb-1">
                 Tap to Open
               </span>
             </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-[#F8F9FA] text-[#64748B] w-full border-t border-[#1E293B]/10">
        <h2 className="text-[10px] font-sans tracking-[0.4em] uppercase">{rawCoupleNames}</h2>
        <div className="mt-4 opacity-30">
          <Diamond size={10} className="inline mx-2" />
          <Diamond size={10} className="inline mx-2" />
          <Diamond size={10} className="inline mx-2" />
        </div>
      </footer>

      {/* Music Control Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-white rounded-full shadow-lg shadow-black/10 border border-[#1E293B]/10 flex items-center justify-center text-[#1E293B] hover:bg-[#F8F9FA] hover:scale-105 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Elegant Wish Button */}
      <button
        onClick={handleTapWish}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#1E293B] rounded-full shadow-lg shadow-black/20 flex items-center justify-center text-white hover:bg-[#334155] hover:scale-105 transition-all duration-300 ${isCounterPopping ? 'scale-110' : ''}`}
      >
        <Heart size={20} fill={isCounterPopping ? 'currentColor' : 'none'} className={isCounterPopping ? 'animate-ping' : ''} />
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#1E293B] border border-[#1E293B]/10 text-[9px] font-sans font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
            {wishCount > 99 ? '99+' : wishCount}
          </span>
        )}
      </button>
    </div>
  );
}
