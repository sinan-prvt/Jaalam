import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ChristianElegantLaceLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 2000); // Wait for the veil animation
  };

  const rawCoupleNames = content?.hero_title || "Lydia & Matthew";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "LYDIA");
  const brideFullName = (parts[1]?.trim() || "MATTHEW");

  const story = content?.about_text || "Two lives, one love, bound by His grace. Join us as we celebrate the beginning of our forever.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Love Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'OCT');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Saturday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '3:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grace Cathedral, Downtown";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "3:00 PM", event: "Holy Matrimony", date: rawDateStr, venue: location },
      { time: "6:00 PM", event: "Dinner & Dancing", date: rawDateStr, venue: "Grand Ballroom" }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Anderson";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Peterson";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence at our wedding is the greatest gift of all. Should you wish to honor us with a gift, a registry is available below.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T15:00";
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
    { id: 'about', label: 'Key People & Family', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes & Blessings', visible: true },
    { id: 'registry', label: 'Registry', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  let rawSections = content?.settings_json?.wedding?.sections || defaultSections;
  if (!rawSections.some((s: any) => s.id === 'wishes')) {
    const rsvpIdx = rawSections.findIndex((s: any) => s.id === 'rsvp');
    if (rsvpIdx !== -1) {
      rawSections = [...rawSections.slice(0, rsvpIdx), { id: 'wishes', label: 'Wishes & Blessings', visible: true }, ...rawSections.slice(rsvpIdx)];
    } else {
      rawSections = [...rawSections, { id: 'wishes', label: 'Wishes & Blessings', visible: true }];
    }
  }
  const sections = rawSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAFAFA] text-[#2C2C2C] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&display=swap');
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          .font-cursive { font-family: 'Great Vibes', cursive; }
          
          /* Intricate Lace Pattern overlay */
          .lace-pattern {
            background-color: transparent;
            background-image: radial-gradient(#d1d5db 1px, transparent 1px), radial-gradient(#d1d5db 1px, transparent 1px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            opacity: 0.15;
          }
          
          /* Ethereal Vignette */
          .ethereal-vignette {
            background: radial-gradient(circle, transparent 40%, #FAFAFA 100%);
          }
        `}</style>

        <div className="absolute inset-0 lace-pattern z-0 pointer-events-none"></div>
        <div className="absolute inset-0 ethereal-vignette z-0 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-20">
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 border border-[#D4AF37] rounded-full flex items-center justify-center mb-8 bg-white/50 backdrop-blur-sm shadow-sm">
            <span className="font-cormorant italic text-[#D4AF37] text-2xl sm:text-3xl">&</span>
          </div>

          <span className="text-[10px] sm:text-xs font-cormorant tracking-[0.3em] uppercase text-[#666] mb-8">
            {quoteText}
          </span>

          <h1 className="text-5xl sm:text-7xl font-cormorant tracking-widest text-[#2C2C2C] uppercase mb-4">
            {groomFullName}
          </h1>
          <h2 className="text-5xl sm:text-7xl font-cormorant tracking-widest text-[#2C2C2C] uppercase">
            {brideFullName}
          </h2>

          <div className="mt-12 flex flex-col items-center">
            <div className="flex items-center gap-6 text-[#2C2C2C] font-cormorant tracking-[0.2em]">
              <span className="text-base sm:text-lg uppercase">{monthStr}</span>
              <span className="text-3xl sm:text-4xl font-medium">{dayNum}</span>
              <span className="text-base sm:text-lg uppercase">{yearStr}</span>
            </div>
            <span className="mt-4 text-xs sm:text-sm font-cormorant tracking-[0.3em] text-[#666] uppercase">{dayName} • {timeStr}</span>
          </div>
          
          <div className="mt-10 pt-10 border-t border-[#D4AF37]/30 w-32 flex justify-center">
            <span className="text-[10px] font-sans tracking-[0.3em] text-[#888] uppercase">{location}</span>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase">The Couple</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 mt-16">
            {[ 
              { role: 'The Groom', name: groomFullName, parents: groomParents, photo: groomPhoto },
              { role: 'The Bride', name: brideFullName, parents: brideParents, photo: bridePhoto }
            ].map((person, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-64 h-80 sm:w-72 sm:h-96 relative mb-8 rounded-[1rem] overflow-hidden bg-[#FAFAFA] border border-[#eee] shadow-sm p-3">
                  <div className="w-full h-full rounded-[0.5rem] overflow-hidden relative">
                     {person.photo ? (
                      <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#D4AF37]/50 lace-pattern">
                         <Heart size={32} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-cormorant tracking-[0.1em] text-[#2C2C2C] uppercase">{person.name}</h3>
                <p className="text-xs font-sans text-[#D4AF37] uppercase tracking-[0.2em] mt-3">{person.role}</p>
                {person.parents && <p className="text-sm font-cormorant italic text-[#888] mt-4">Son of {person.parents}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAFAFA] text-center overflow-hidden">
        <div className="absolute inset-0 lace-pattern z-0 pointer-events-none opacity-[0.08]"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Heart size={24} className="text-[#D4AF37] mx-auto mb-8" strokeWidth={1} />
          <h2 className="text-xs font-sans tracking-[0.3em] uppercase text-[#888] mb-8">
            {storyTitle}
          </h2>
          <p className="text-2xl sm:text-3xl text-[#2C2C2C] font-cormorant italic leading-relaxed px-4">
            "{story}"
          </p>
          <div className="mt-12 opacity-50 flex justify-center">
            <div className="w-12 h-px bg-[#D4AF37]"></div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase">Events</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>

          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-8 sm:p-10 border border-[#eee] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-0">
                  <h3 className="text-xl font-cormorant tracking-[0.1em] text-[#2C2C2C] uppercase mb-2">{item.event}</h3>
                  <p className="text-[#888] text-[10px] font-sans tracking-[0.15em] uppercase">{item.venue || location}</p>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-sm font-sans font-medium text-[#D4AF37] tracking-[0.2em]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase">Location</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>

          <div className="mt-12 text-center">
            
            <p className="text-xl sm:text-2xl font-cormorant text-[#2C2C2C] tracking-widest uppercase mb-4">{location}</p>
            <p className="text-base font-cormorant italic text-[#888] mb-12">We cannot wait to celebrate with you.</p>

            {venuePhoto && (
              <div className="w-full h-72 sm:h-96 overflow-hidden bg-[#eee] mb-12 rounded-lg p-2 border border-[#eaeaea] shadow-sm">
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover rounded shadow-inner opacity-90 hover:opacity-100 transition-opacity duration-700" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#2C2C2C] hover:bg-[#1a1a1a] text-white px-10 py-4 font-sans text-[10px] tracking-[0.2em] uppercase rounded shadow-md transition-all"
                >
                  <Navigation size={12} />
                  Get Directions
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
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase">Gallery</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 mt-12">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[4/5] bg-[#FAFAFA] p-3 border border-[#eee] rounded-lg shadow-sm">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAFAFA] border-y border-[#eee]">
        <div className="absolute inset-0 lace-pattern z-0 pointer-events-none opacity-[0.05]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase mb-16">The Countdown</h2>

          <div className="flex gap-6 sm:gap-12 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-full border border-[#eee] shadow-[0_10px_30px_rgba(0,0,0,0.03)] min-w-[5rem] sm:min-w-[7rem]">
                <span className="text-2xl sm:text-4xl font-cormorant text-[#D4AF37] mb-2">{item.value}</span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-sans text-[#888]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto text-center">
           <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase">Blessings</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>

          <div className="bg-[#FAFAFA] p-12 sm:p-20 border border-[#eee] rounded-xl mt-12 flex flex-col items-center shadow-sm">
            <button
              type="button"
              onClick={handleTapWish}
              className="w-24 h-24 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center transition-all duration-300 hover:bg-[#D4AF37] group cursor-pointer mb-8 shadow-md hover:shadow-lg"
            >
              <Heart className="w-10 h-10 text-[#D4AF37] group-hover:text-white transition-colors duration-300" strokeWidth={1} />
            </button>

            <div className="flex flex-col items-center">
              <span className={`text-6xl sm:text-7xl font-cormorant text-[#2C2C2C] block transition-transform duration-300 ${isCounterPopping ? 'scale-125 text-[#D4AF37]' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-[10px] text-[#888] uppercase tracking-[0.2em] font-sans mt-4">Wishes Received</span>
            </div>
          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAFAFA]">
        <div className="max-w-2xl mx-auto text-center">
          <Gift size={24} className="text-[#D4AF37] mx-auto mb-8" strokeWidth={1} />
          
          <h2 className="text-2xl sm:text-3xl font-cormorant tracking-[0.2em] text-[#2C2C2C] mb-6 uppercase">Registry</h2>
          <p className="text-base text-[#666] font-cormorant italic max-w-lg mx-auto mb-10 leading-relaxed">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-10 py-4 font-sans text-[10px] font-semibold tracking-[0.2em] uppercase rounded shadow-sm transition-colors"
            >
              View Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant text-[#2C2C2C] tracking-[0.15em] uppercase">RSVP</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>

          <div className="bg-[#FAFAFA] p-8 sm:p-16 border border-[#eee] rounded-xl shadow-sm mt-12">
            <form className="space-y-8 font-sans max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-3">Name</label>
                <input type="text" className="w-full bg-white border border-[#e0e0e0] rounded px-4 py-3 outline-none focus:border-[#D4AF37] transition-colors text-[#2C2C2C]" placeholder="Your Name" />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-3">Message</label>
                <textarea rows={3} className="w-full bg-white border border-[#e0e0e0] rounded px-4 py-3 outline-none focus:border-[#D4AF37] transition-colors text-[#2C2C2C] resize-none" placeholder="A brief message..."></textarea>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-4">Attendance</label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-[#666] uppercase tracking-[0.1em] text-[10px]">Accepts with Pleasure</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-[#666] uppercase tracking-[0.1em] text-[10px]">Declines with Regret</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button type="button" className="w-full bg-[#2C2C2C] hover:bg-[#1a1a1a] text-white font-sans tracking-[0.2em] uppercase text-[10px] py-4 rounded shadow-md transition-colors flex justify-center items-center gap-2">
                  <Send size={12} />
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
    <div className={`min-h-screen bg-white relative text-[#2C2C2C] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* 3D Elegant Gate Unlocking Animation */}
      <div
        onClick={handleOpen}
        style={{ perspective: '1500px' }}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-[1500ms] ease-out bg-transparent ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          .lace-pattern-gate {
            background-color: #FAFAFA;
            background-image: radial-gradient(#d1d5db 1px, transparent 1px), radial-gradient(#d1d5db 1px, transparent 1px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
          }
          .lace-scalloped-left {
            mask-image: radial-gradient(circle at 100% 50%, transparent 15px, black 16px);
            mask-size: 100% 40px;
            mask-repeat: repeat-y;
            mask-position: right;
            border-right: 4px double #D4AF37;
          }
          .lace-scalloped-right {
            mask-image: radial-gradient(circle at 0% 50%, transparent 15px, black 16px);
            mask-size: 100% 40px;
            mask-repeat: repeat-y;
            mask-position: left;
            border-left: 4px double #D4AF37;
          }
        `}</style>
        
        {/* Left 3D Gate */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full lace-pattern-gate lace-scalloped-left flex items-center justify-end pr-8 sm:pr-16 transition-all duration-[2500ms] ease-[cubic-bezier(0.6,0.05,0.15,0.95)] z-10 origin-left shadow-[20px_0_60px_rgba(0,0,0,0.1)] ${isOpening ? '-rotate-y-105 scale-110 opacity-70' : 'rotate-y-0 scale-100 opacity-100'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5"></div>
        </div>

        {/* Right 3D Gate */}
        <div 
          className={`absolute top-0 right-0 w-1/2 h-full lace-pattern-gate lace-scalloped-right flex items-center justify-start pl-8 sm:pl-16 transition-all duration-[2500ms] ease-[cubic-bezier(0.6,0.05,0.15,0.95)] z-10 origin-right shadow-[-20px_0_60px_rgba(0,0,0,0.1)] ${isOpening ? 'rotate-y-105 scale-110 opacity-70' : 'rotate-y-0 scale-100 opacity-100'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5"></div>
        </div>
        
        {/* Center Unlocking Seal */}
        <div className={`relative z-30 flex flex-col items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpening ? 'opacity-0 scale-[3] blur-md translate-y-[-10vh]' : 'opacity-100 scale-100 translate-y-0 delay-300'}`}>
          <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white border border-[#D4AF37]/30 shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-1000 ${isOpening ? 'rotate-[360deg]' : 'rotate-0 hover:shadow-[0_30px_80px_rgba(212,175,55,0.2)] hover:scale-105'}`}>
            
            {/* Spinning Intricate Lace ring */}
            <div className="absolute inset-2 border-2 border-dashed border-[#D4AF37]/40 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            <div className="absolute inset-4 border border-[#eee] rounded-full"></div>
            
            {/* Gold foil effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>

            <Heart size={20} className="text-[#D4AF37] mb-2 group-hover:scale-110 group-hover:fill-[#D4AF37]/10 transition-transform duration-500" strokeWidth={1.5} />
            <h1 className="font-cormorant italic text-3xl sm:text-4xl text-[#2C2C2C] mb-2">{groomFullName[0]} & {brideFullName[0]}</h1>
            <div className="w-12 h-[1px] bg-[#D4AF37]/40 my-2"></div>
            <span className="text-[8px] font-sans tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">{isOpening ? 'UNLOCKING...' : 'TAP TO UNLOCK'}</span>
            
            {/* Inner glow on hover */}
            <div className="absolute inset-0 border-[3px] border-[#D4AF37] rounded-full scale-90 opacity-0 group-hover:scale-95 group-hover:opacity-20 transition-all duration-700 pointer-events-none" />
          </div>
        </div>

        {/* Ethereal Light Burst */}
        {isOpening && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_100px_100px_rgba(255,255,255,0.8)] animate-ping duration-[2000ms]"></div>
          </div>
        )}
      </div>

      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-[#FAFAFA] text-[#2C2C2C] w-full border-t border-[#eee]">
        <h2 className="text-2xl font-cormorant tracking-[0.2em] mb-2 uppercase">{rawCoupleNames}</h2>
        <p className="text-[#888] text-[9px] tracking-[0.3em] uppercase font-sans">Forever Begins</p>
      </footer>

    </div>
  );
}
