import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Heart, Gift, Sparkles, Send, Volume2, VolumeX, Navigation, ChevronRight, Flower2 } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function KeralaModernLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Global Live Multi-Click Heart Wish State
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
      } catch (err) {
        // Silent fallback
      }
    };
    fetchGlobalWishes();
    const interval = setInterval(fetchGlobalWishes, 4000);
    return () => clearInterval(interval);
  }, [website?.slug]);

  const handleTapWish = async (e?: React.MouseEvent) => {
    setWishCount(prev => prev + 1);
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
    }, 1200);
  };

  const rawCoupleNames = content?.hero_title || "Anjali & Rahul";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = parts[0]?.trim() || "Anjali";
  const brideFullName = parts[1]?.trim() || "Rahul";

  const story = content?.about_text || "Our paths crossed beautifully, and what started as friendship evolved into a love story we are thrilled to celebrate with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "15 March 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());
  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'March');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Sunday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '10:00 AM';

  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Hyatt, Kochi";
  
  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "09:30 AM", event: "Muhurtham", date: rawDateStr, venue: fullLocation },
      { time: "12:30 PM", event: "Grand Sadya", date: rawDateStr, venue: fullLocation },
      { time: "07:00 PM", event: "Reception", date: rawDateStr, venue: fullLocation }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Nair";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Menon";
  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: +91 94000 00000";
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];
  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your blessings are our greatest gift.";
  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T10:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";
  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Join us as we step into our forever.";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      let targetTime: number | null = null;
      if (countdownDate) {
        let d = new Date(countdownDate);
        if (!isNaN(d.getTime())) targetTime = d.getTime();
        else {
          d = new Date(String(countdownDate).replace(' ', 'T'));
          if (!isNaN(d.getTime())) targetTime = d.getTime();
        }
      }
      if (!targetTime || targetTime <= new Date().getTime()) {
        targetTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000);
      }
      const distance = targetTime - new Date().getTime();
      setTimeLeft({
        d: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        h: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        m: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        s: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [countdownDate]);

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'about', label: 'Family Details', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule & Events', visible: true },
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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#070b09] text-white p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap');
          .font-outfit { font-family: 'Outfit', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
        `}</style>

        {/* Abstract Modern Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-amber-600/10 rounded-full blur-[100px] mix-blend-screen" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
        </div>

        {/* Hero Content Wrapper */}
        <div className="relative z-30 pt-16 max-w-sm sm:max-w-xl mx-auto flex flex-col items-center px-4 pb-12 w-full font-outfit">
          
          <div className="inline-block border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase mb-8 px-4 py-1.5 rounded-full backdrop-blur-md">
            Wedding Celebration
          </div>

          <h1 className="text-5xl sm:text-7xl font-playfair text-white font-medium tracking-tight leading-tight mb-2 flex flex-col gap-1">
            <span className="block text-left relative left-[-5%]">{groomFullName}</span>
            <span className="block text-center text-amber-500 text-3xl sm:text-4xl italic font-light">&</span>
            <span className="block text-right relative right-[-5%]">{brideFullName}</span>
          </h1>

          <div className="mt-8 mb-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />

          <p className="text-white/70 text-sm font-light tracking-[0.1em] uppercase mb-12 max-w-sm leading-relaxed">
            {quoteText}
          </p>

          {/* Date & Time Glass Card */}
          <div className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex w-full items-center justify-between px-2 mb-4">
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60 w-1/3 text-left">{dayName}</span>
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60 w-1/3 text-center">{monthStr}</span>
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60 w-1/3 text-right">{yearStr}</span>
            </div>

            <div className="text-6xl sm:text-8xl font-playfair font-medium text-amber-400 mb-4 bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-600">
              {dayNum}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest bg-white/[0.05] px-4 py-2 rounded-full border border-white/5">
              <Clock size={14} className="text-amber-500" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Venue Line */}
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-light text-white/70 uppercase tracking-wider mt-8">
            <MapPin size={16} className="text-amber-500" />
            <span>{fullLocation}</span>
          </div>

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-4 sm:px-6 relative z-10 bg-[#070b09] text-white font-outfit">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-playfair mb-3 text-amber-400">The Couple</h2>
            <div className="h-px w-16 bg-amber-500/40 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
            {/* Groom */}
            <div className="flex flex-col items-center bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-amber-500/30 mb-6 relative group">
                {groomPhoto ? (
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full bg-emerald-900/40 flex items-center justify-center text-4xl font-playfair text-amber-400">
                    {groomFullName.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-playfair text-white mb-2">{groomFullName}</h3>
              <p className="text-xs text-amber-500 tracking-widest uppercase mb-3">Groom</p>
              {groomParents && <p className="text-sm text-white/50">Son of {groomParents}</p>}
            </div>

            {/* Bride */}
            <div className="flex flex-col items-center bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-amber-500/30 mb-6 relative group">
                {bridePhoto ? (
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full bg-emerald-900/40 flex items-center justify-center text-4xl font-playfair text-amber-400">
                    {brideFullName.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-playfair text-white mb-2">{brideFullName}</h3>
              <p className="text-xs text-amber-500 tracking-widest uppercase mb-3">Bride</p>
              {brideParents && <p className="text-sm text-white/50">Daughter of {brideParents}</p>}
            </div>
            
            {/* Center abstract joiner for desktop */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#070b09] rounded-full border border-amber-500/30 items-center justify-center z-10 text-amber-500">
              <Heart size={16} />
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-4 sm:px-6 relative z-10 bg-[#0a110e] font-outfit">
        <div className="max-w-3xl mx-auto text-center">
          <Flower2 className="w-8 h-8 text-amber-500/50 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-playfair mb-8 text-white">{storyTitle}</h2>
          <p className="text-base sm:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
            {story}
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-4 sm:px-6 relative z-10 bg-[#070b09] font-outfit">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-playfair text-amber-400 mb-4">Itinerary</h2>
            <div className="h-px w-16 bg-amber-500/40" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white/[0.02] rounded-3xl p-8 border border-white/[0.05] hover:border-amber-500/30 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
                <h3 className="text-xl font-playfair text-white mb-4 relative z-10">{item.event}</h3>
                <div className="flex items-center gap-2 mb-3 text-amber-400 text-sm relative z-10">
                  <Clock size={16} />
                  <span className="font-medium tracking-wide">{item.time}</span>
                </div>
                <p className="text-white/50 text-sm font-light relative z-10">{item.venue || fullLocation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 px-4 sm:px-6 relative z-10 bg-[#0a110e] font-outfit">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.02] rounded-[2.5rem] p-8 sm:p-12 border border-white/[0.05] text-center relative overflow-hidden">
            <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-6" />
            <h3 className="text-3xl sm:text-4xl font-playfair text-white mb-4">Venue & Location</h3>
            <p className="text-lg text-amber-400/90 mb-8 font-light">{fullLocation}</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-black/50 border border-white/5">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#070b09] px-8 py-3.5 rounded-full font-medium tracking-wide transition-all hover:bg-amber-400 text-sm mb-6"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && (
              <div className="pt-8 border-t border-white/[0.05]">
                <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Reach out to us</p>
                <p className="text-lg font-medium text-amber-400">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-4 sm:px-6 relative z-10 bg-[#070b09] font-outfit">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-playfair text-amber-400 mb-4">Gallery</h2>
            <div className="h-px w-16 bg-amber-500/40" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-square rounded-2xl overflow-hidden relative group">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-20 px-4 sm:px-6 relative z-10 bg-[#0a110e] font-outfit text-white">
        <div className="max-w-3xl mx-auto text-center bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 sm:p-14">
          <h2 className="text-3xl sm:text-4xl font-playfair mb-10 text-white">Counting Down</h2>
          <div className="grid grid-cols-4 gap-4 sm:gap-8 justify-items-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <span className="text-3xl sm:text-5xl font-playfair font-medium text-amber-400 mb-2">{item.value}</span>
                <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-20 px-4 sm:px-6 relative z-10 bg-[#070b09] font-outfit text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-playfair mb-4 text-amber-400">Blessings</h2>
          <p className="text-white/60 text-sm mb-12 font-light">Send your warm wishes to the couple</p>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleTapWish}
              className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all hover:bg-white/[0.05] mb-8 group"
            >
              <Heart className="w-10 h-10 text-rose-400 transition-transform group-hover:scale-110 group-active:scale-95" fill="currentColor" />
            </button>

            <div className="flex flex-col items-center mb-8">
              <span className={`text-5xl font-playfair text-white mb-2 transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-amber-400' : ''}`}>
                {wishCount}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-white/40">Wishes Received</span>
            </div>
          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-20 px-4 sm:px-6 relative z-10 bg-[#0a110e] font-outfit">
        <div className="max-w-2xl mx-auto text-center bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-12">
          <Gift className="w-10 h-10 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-playfair text-white mb-4">Gift Registry</h2>
          <p className="text-white/60 mb-8 font-light">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 text-[#070b09] px-8 py-3.5 rounded-full font-medium tracking-wide transition-all hover:bg-amber-400 text-sm"
            >
              View Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-20 px-4 sm:px-6 relative z-10 bg-[#070b09] font-outfit">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-playfair text-amber-400 mb-4">RSVP</h2>
            <p className="text-white/60 text-sm font-light">We would love to have you celebrate with us</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 sm:p-12">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs tracking-widest uppercase text-white/60 mb-2">Name</label>
                <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all text-white placeholder-white/20" placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-white/60 mb-2">Message</label>
                <textarea rows={3} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all text-white placeholder-white/20 resize-none" placeholder="Your wishes..."></textarea>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-white/60 mb-3">Attending?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-white/10 hover:border-amber-500/30 bg-white/[0.03] rounded-xl flex-1 transition-colors">
                    <input type="radio" name="attending" className="w-4 h-4 accent-amber-500" />
                    <span className="text-white/80 font-medium text-sm">Yes, gladly</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-white/10 hover:border-amber-500/30 bg-white/[0.03] rounded-xl flex-1 transition-colors">
                    <input type="radio" name="attending" className="w-4 h-4 accent-amber-500" />
                    <span className="text-white/80 font-medium text-sm">Regretfully no</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button type="button" className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 text-[#070b09] font-medium tracking-wide px-8 py-4 rounded-xl transition-all hover:bg-amber-400">
                  <Send size={16} />
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
    <div className={`min-h-screen bg-[#070b09] relative font-outfit text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {musicUrl && isOpened && (
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) audioRef.current.play();
              else audioRef.current.pause();
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/20 transition-all"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Sleek Modern Gate Reveal */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer`}
      >
        <div className="absolute inset-0 bg-[#070b09]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
        
        <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${isOpening ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'}`}>
          <div className="w-20 h-20 mb-8 border border-amber-500/30 rounded-full flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ChevronRight className="w-5 h-5 text-amber-400 ml-0.5" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-playfair text-white tracking-wide mb-2 text-center">
            {groomFullName} <span className="text-amber-500 italic">&</span> {brideFullName}
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-8">Tap to enter</p>
        </div>
      </div>

      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-[#050806] w-full border-t border-white/[0.05]">
        <h2 className="text-2xl font-playfair mb-3 text-white/80">{rawCoupleNames}</h2>
        <p className="text-white/40 text-[10px] tracking-widest uppercase">Made with love by Jaalam</p>
      </footer>
    </div>
  );
}
