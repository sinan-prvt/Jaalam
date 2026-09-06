import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation, ChevronDown } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ChristianModernChapelLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Global Live Multi-Click Heart Wish State
  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

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
      } catch (err) {
        // Silent fallback
      }
    };
    fetchGlobalWishes();
    const interval = setInterval(fetchGlobalWishes, 4000);
    return () => clearInterval(interval);
  }, [website?.slug]);

  const handleTapWish = async (e?: React.MouseEvent) => {
    const newCount = wishCount + 1;
    setWishCount(newCount);
    setIsCounterPopping(true);
    setPulseRing(true);
    setTimeout(() => setIsCounterPopping(false), 300);
    setTimeout(() => setPulseRing(false), 600);
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
    }, 1200);
  };

  const rawCoupleNames = content?.hero_title || "ALEX & JORDAN";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ALEX").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "JORDAN").toUpperCase();

  const story = content?.about_text || "We invite you to witness the beginning of our new chapter. A celebration of modern love, cherished moments, and our shared future.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "The Beginning";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 24, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'OCT');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '24');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Glass Pavilion, New York";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "The Vows", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "Cocktails & Canapés", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Dinner & Dancing", date: rawDateStr, venue: location }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Smith";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Johnson";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence is the greatest gift. If you wish to honor us with a contribution, our registry details are below.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-24T16:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "INVITE YOU TO CELEBRATE THEIR UNION";

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

  const ModernHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="flex flex-col items-center mb-16 relative z-20 text-center">
      <span className="text-[10px] tracking-[0.4em] text-slate-400 font-sans uppercase font-semibold mb-4 block">{subtitle || "DETAILS"}</span>
      <h2 className="text-4xl md:text-5xl font-cinzel text-slate-900 tracking-widest">{title}</h2>
      <div className="w-16 h-px bg-slate-900 mt-8"></div>
    </div>
  );

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAFAFA] text-slate-900 p-0 overflow-hidden min-h-screen">
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-outfit { font-family: 'Outfit', sans-serif; }
          @keyframes subtleZoom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}</style>

        {/* Minimalist Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center px-4 pt-16 pb-20 animate-[subtleZoom_15s_ease-in-out_infinite]">
          
          <div className="flex flex-col items-center space-y-12 w-full">
            <span className="text-[10px] sm:text-xs font-outfit tracking-[0.4em] uppercase text-slate-500">
              {quoteText}
            </span>

            <div className="flex flex-col items-center w-full">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-cinzel tracking-widest text-slate-900 leading-none">
                {groomFullName}
              </h1>
              <div className="my-6 sm:my-8 flex items-center justify-center gap-6">
                <span className="w-12 sm:w-20 h-px bg-slate-300"></span>
                <span className="text-xl sm:text-2xl font-cinzel text-slate-400 italic font-light">&</span>
                <span className="w-12 sm:w-20 h-px bg-slate-300"></span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-cinzel tracking-widest text-slate-900 leading-none">
                {brideFullName}
              </h1>
            </div>

            {/* Date Block */}
            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center gap-8 text-slate-900 font-cinzel tracking-widest">
                <span className="text-xl sm:text-2xl uppercase">{monthStr}</span>
                <span className="text-4xl sm:text-5xl font-semibold">{dayNum}</span>
                <span className="text-xl sm:text-2xl">{yearStr}</span>
              </div>
              <span className="mt-4 text-xs font-outfit tracking-[0.3em] text-slate-500 uppercase">{dayName} • {timeStr}</span>
            </div>

            {/* Location Block */}
            <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col items-center">
              <span className="text-sm sm:text-base font-cinzel tracking-widest text-slate-800 uppercase">{location}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-outfit tracking-[0.3em] uppercase text-slate-400">Scroll</span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <ModernHeader title="The Couple" subtitle="With Joy & Love" />

          <div className="grid md:grid-cols-2 gap-16 mt-16 relative z-20">
            {[ 
              { role: 'Groom', name: groomFullName, parents: groomParents, photo: groomPhoto },
              { role: 'Bride', name: brideFullName, parents: brideParents, photo: bridePhoto }
            ].map((person, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-56 h-72 sm:w-72 sm:h-96 relative mb-8 overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-700 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Heart className="w-12 h-12 fill-slate-200" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-cinzel tracking-widest text-slate-900 mb-2 uppercase">{person.name}</h3>
                <p className="text-[10px] font-outfit text-slate-500 uppercase tracking-[0.3em] mb-4">{person.role}</p>
                {person.parents && <p className="text-sm text-slate-600 font-outfit font-light italic">Child of {person.parents}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50 text-center">
        <div className="max-w-4xl mx-auto">
          <ModernHeader title={storyTitle} subtitle="Our Journey" />
          <div className="mt-12 bg-white rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-200/60 relative">
            <span className="absolute -top-6 -left-2 text-7xl text-slate-200 font-cinzel opacity-50 select-none">"</span>
            <p className="text-lg sm:text-2xl text-slate-700 font-outfit font-light leading-relaxed relative z-10">
              {story}
            </p>
            <span className="absolute -bottom-10 -right-2 text-7xl text-slate-200 font-cinzel opacity-50 select-none">"</span>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <ModernHeader title="Itinerary" subtitle="Celebration Details" />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 z-0 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-sm font-cinzel font-semibold text-slate-900 tracking-widest border-b border-slate-900 pb-2 mb-6">{item.time}</span>
                  <h3 className="text-xl font-outfit font-medium text-slate-800 mb-4 text-center">{item.event}</h3>
                  <p className="text-slate-500 text-xs font-outfit tracking-[0.2em] uppercase text-center">{item.venue || location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <ModernHeader title="The Venue" subtitle="Where we celebrate" />

          <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-200/60 text-center relative overflow-hidden mt-12">
            
            <p className="text-2xl sm:text-3xl font-cinzel text-slate-900 tracking-widest mb-4">{location}</p>
            <p className="text-sm font-outfit font-light text-slate-500 mb-10">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-72 sm:h-[28rem] rounded-[2rem] overflow-hidden shadow-lg mb-12 relative group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden border border-slate-200 mb-12 bg-slate-100 p-2">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '1.5rem' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 pointer-events-none md:pointer-events-auto"
              ></iframe>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-outfit text-xs font-semibold tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <Navigation size={14} />
                  Get Directions
                </a>
              )}
              {contactNumbers && (
                <div className="px-10 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-outfit text-xs font-semibold tracking-widest uppercase">
                  RSVP: {contactNumbers}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <ModernHeader title="Gallery" subtitle="Captured Moments" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 relative bg-slate-100 group">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <ModernHeader title="The Wait" subtitle="Counting the moments" />

          <div className="flex gap-4 sm:gap-12 justify-center mt-12">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 transition-transform hover:-translate-y-1">
                  <span className="text-2xl sm:text-4xl font-cinzel font-semibold text-slate-900">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold text-slate-500 font-outfit">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <ModernHeader title="Blessings" subtitle="Share your joy" />

          <div className="bg-slate-50 rounded-[3rem] p-12 sm:p-16 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 mt-12 relative flex flex-col items-center">
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-16">
                <div className="w-48 h-48 rounded-full border border-slate-900/20 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-28 h-28 rounded-full bg-slate-900 flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-8 relative z-20 ${pulseRing ? 'scale-110 shadow-2xl' : 'hover:scale-105 active:scale-95'}`}
            >
              <Heart className={`w-10 h-10 transition-all duration-300 ${pulseRing ? 'scale-125 rotate-12 fill-white text-white' : 'fill-slate-700 text-slate-700 group-hover:fill-white group-hover:text-white group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-10">
              <span className={`text-6xl sm:text-8xl font-cinzel font-semibold text-slate-900 block transition-transform duration-300 ${isCounterPopping ? 'scale-110' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.3em] font-outfit mt-4">Wishes Received</span>
            </div>
          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <Gift size={32} className="text-slate-900 mx-auto mb-8" />
          <h2 className="text-3xl sm:text-4xl font-cinzel tracking-widest text-slate-900 mb-6 uppercase">Registry</h2>
          <p className="text-sm text-slate-600 font-outfit font-light max-w-lg mx-auto mb-10 leading-relaxed">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white border border-slate-200 hover:border-slate-900 text-slate-900 px-10 py-4 rounded-full font-outfit text-xs font-semibold tracking-widest uppercase transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              View Registry Details
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <ModernHeader title="RSVP" subtitle="Kindly Reply" />

          <div className="bg-slate-50 rounded-[3rem] p-8 sm:p-16 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 mt-12">
            <form className="space-y-8 font-outfit max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-3 ml-2">Name</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-full px-8 py-4 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900 placeholder-slate-400" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-3 ml-2">Message</label>
                  <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-6 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900 placeholder-slate-400 resize-none" placeholder="Leave a message..."></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-4 ml-2">Attendance</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-slate-200 hover:border-slate-900 bg-white rounded-full flex-1 transition-all">
                      <input type="radio" name="attending" className="w-4 h-4 accent-slate-900" />
                      <span className="text-slate-900 font-semibold uppercase tracking-widest text-[10px]">Accepts with Joy</span>
                    </label>
                    <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-slate-200 hover:border-slate-900 bg-white rounded-full flex-1 transition-all">
                      <input type="radio" name="attending" className="w-4 h-4 accent-slate-900" />
                      <span className="text-slate-900 font-semibold uppercase tracking-widest text-[10px]">Declines with Regret</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold tracking-widest uppercase text-xs px-12 py-5 rounded-full shadow-lg transition-all hover:-translate-y-1">
                  <Send size={14} />
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative font-sans text-slate-900 flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {musicUrl && isOpened && (
        <button
          onClick={() => {
            if (audioRef.current) {
              isMuted ? audioRef.current.play() : audioRef.current.pause();
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-200 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Special Modern Chapel Opening: Geometric Arch Drawing & Diagonal Split */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? 'pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent bg-transparent`}
      >
        {/* Top-Left Diagonal Panel */}
        <div 
          className={`absolute inset-0 bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] transition-transform duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 ${isOpening ? '-translate-x-full -translate-y-full' : 'translate-x-0 translate-y-0'}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        ></div>

        {/* Bottom-Right Diagonal Panel */}
        <div 
          className={`absolute inset-0 bg-slate-50 shadow-[0_0_50px_rgba(0,0,0,0.05)] transition-transform duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 ${isOpening ? 'translate-x-full translate-y-full' : 'translate-x-0 translate-y-0'}`}
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        ></div>

        {/* Central SVG Line Drawing Arch (Hidden after opening) */}
        <div className={`relative z-20 flex flex-col items-center justify-center transition-all duration-700 ${isOpening ? 'scale-150 opacity-0 blur-md' : 'scale-100 opacity-100 blur-0'}`}>
          
          <div className="relative w-64 h-80 sm:w-80 sm:h-96 flex flex-col items-center justify-center group">
            
            {/* SVG Animated Arch Border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 125" preserveAspectRatio="none">
              <style>{`
                @keyframes drawArch {
                  0% { stroke-dashoffset: 400; }
                  100% { stroke-dashoffset: 0; }
                }
                .arch-path {
                  stroke-dasharray: 400;
                  animation: drawArch 3s ease-in-out forwards;
                }
              `}</style>
              <path 
                className="arch-path"
                d="M10,120 L10,50 Q10,10 50,10 Q90,10 90,50 L90,120" 
                fill="none" 
                stroke="#0f172a" 
                strokeWidth="0.5" 
              />
              <line x1="10" y1="120" x2="90" y2="120" stroke="#0f172a" strokeWidth="0.5" />
            </svg>

            {/* Glowing Aura on Tap */}
            <div className={`absolute inset-0 bg-white rounded-t-full transition-all duration-700 -z-10 ${isOpening ? 'scale-110 shadow-[0_0_100px_rgba(255,255,255,1)] opacity-100' : 'opacity-0'}`}></div>

            <span className="text-[9px] tracking-[0.5em] text-slate-400 font-outfit uppercase font-semibold mt-12 opacity-0 animate-[fadeIn_1s_ease-in_2s_forwards]">
              Join Us
            </span>
            
            <div className="flex-1 flex flex-col justify-center items-center opacity-0 animate-[fadeIn_1.5s_ease-in_1s_forwards]">
              <h1 className="text-5xl sm:text-6xl font-cinzel text-slate-900 tracking-widest mb-2 leading-none">
                {groomFullName.charAt(0)}
              </h1>
              <div className="w-8 h-px bg-slate-300 my-3"></div>
              <h1 className="text-5xl sm:text-6xl font-cinzel text-slate-900 tracking-widest leading-none">
                {brideFullName.charAt(0)}
              </h1>
            </div>

            <div className="mb-8 w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-outfit uppercase tracking-widest text-slate-500 bg-white group-hover:bg-slate-900 group-hover:text-white transition-all cursor-pointer opacity-0 animate-[fadeIn_1s_ease-in_2.5s_forwards] hover:scale-110">
              {isOpening ? '...' : 'Tap'}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col items-center opacity-0 animate-[fadeIn_1s_ease-in_2.5s_forwards]">
            <h1 className="text-lg sm:text-xl font-cinzel font-semibold text-slate-900 tracking-[0.2em] uppercase">
              {groomFullName} & {brideFullName}
            </h1>
            <p className="text-slate-500 text-[9px] sm:text-[10px] tracking-[0.3em] font-outfit uppercase mt-3 font-semibold">
              {rawDateStr}
            </p>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-white text-slate-900 w-full border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="w-12 h-px bg-slate-900 mb-8"></div>
          <h2 className="text-2xl font-cinzel tracking-widest mb-4 uppercase">{rawCoupleNames}</h2>
          <p className="text-slate-400 text-[10px] tracking-[0.4em] uppercase font-outfit font-semibold">Modern Chapel Theme by Jaalam</p>
        </div>
      </footer>

    </div>
  );
}
