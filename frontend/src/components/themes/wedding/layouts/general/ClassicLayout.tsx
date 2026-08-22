import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { eventHierarchy } from '../../../../../utils/templateData';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ClassicLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Global Live Multi-Click Heart Wish State
  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  // Poll global wish count every 4s for real-time live sync
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
      } catch (err) {
        // Silent catch
      }
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
    }, 600);
  };

  const coupleNames = content?.hero_title || "Alex & Jordan";
  const names = coupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomName = names[0]?.trim() || "Alex";
  const brideName = names[1]?.trim() || "Jordan";

  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "September 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'SEPTEMBER');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Estate, New York";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Holy Wedding Ceremony", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "Cocktail Hour & Greetings", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Grand Gala Dinner & Dancing", date: rawDateStr, venue: location }
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
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a cash contribution towards our honeymoon registry would be warmly appreciated.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-09-15T16:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Together with their families, invite you to celebrate their wedding";

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
      rawSections = [
        ...rawSections.slice(0, rsvpIdx),
        { id: 'wishes', label: 'Wishes & Blessings', visible: true },
        ...rawSections.slice(rsvpIdx)
      ];
    } else {
      rawSections = [...rawSections, { id: 'wishes', label: 'Wishes & Blessings', visible: true }];
    }
  }
  const sections = rawSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-cover bg-center bg-no-repeat p-0 overflow-hidden py-10 sm:py-14" style={{ backgroundImage: "url('/media/classic_wedding_hero_bg.png')" }}>

        {/* Soft Golden Petal & Bokeh Animation */}
        <style>{`
          @keyframes goldenFloat {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(12)].map((_, i) => {
            const leftPos = (i * 8 + 5) % 92;
            const delay = (i * 0.7) % 5;
            const duration = 8 + (i % 5);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-3 h-3 rounded-full bg-gradient-to-tr from-amber-200 to-amber-400 opacity-60 filter blur-[1px]"
                style={{
                  left: `${leftPos}%`,
                  animation: `goldenFloat ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Hero Central Card Block */}
        <div className="relative z-20 pt-10 sm:pt-14 md:pt-16 max-w-xs sm:max-w-md mx-auto flex flex-col items-center px-4 pb-2">

          <div className="mb-2 text-[#7A5A32] font-serif">
            <Sparkles className="w-6 h-6 text-[#C69B31] animate-pulse mx-auto mb-1" />
          </div>

          <p className="text-[#6E543B] text-[10px] sm:text-xs font-semibold italic tracking-[0.15em] uppercase max-w-xs sm:max-w-md mx-auto mb-2 font-serif">
            {quoteText}
          </p>

          {/* Diamond Flourish Divider */}
          <div className="flex items-center justify-center gap-2 my-1 text-[#C69B31] opacity-80">
            <span className="h-[1px] w-6 bg-[#C69B31]"></span>
            <span className="rotate-45 w-1.5 h-1.5 border border-[#C69B31] bg-[#C69B31]"></span>
            <span className="h-[1px] w-6 bg-[#C69B31]"></span>
          </div>

          {/* Groom & Bride Names */}
          <h1 className="text-3xl sm:text-5xl font-serif italic text-[#4A3525] my-0.5 tracking-wide drop-shadow-sm font-bold">
            {groomName}
          </h1>
          {groomParents && (
            <p className="text-[11px] sm:text-xs text-[#8C6B4B] font-serif italic mb-0.5 font-medium">(S/o {groomParents})</p>
          )}

          <p className="text-xs sm:text-sm text-[#8C6B4B] font-serif italic my-0.5 font-light">&</p>

          <h1 className="text-3xl sm:text-5xl font-serif italic text-[#4A3525] my-0.5 tracking-wide drop-shadow-sm font-bold">
            {brideName}
          </h1>
          {brideParents && (
            <p className="text-[11px] sm:text-xs text-[#8C6B4B] font-serif italic mb-2 font-medium">(D/o {brideParents})</p>
          )}

          {/* Diamond Flourish Divider */}
          <div className="flex items-center justify-center gap-2 my-1 text-[#C69B31] opacity-80">
            <span className="h-[1px] w-6 bg-[#C69B31]"></span>
            <span className="rotate-45 w-1.5 h-1.5 border border-[#C69B31] bg-[#C69B31]"></span>
            <span className="h-[1px] w-6 bg-[#C69B31]"></span>
          </div>

          {/* Subtitle / Getting Married */}
          <p className="text-xs sm:text-sm font-bold text-[#4A3525] font-serif tracking-[0.2em] uppercase my-1">
            ARE GETTING MARRIED
          </p>

          {/* Date & Time Breakdown Block */}
          <div className="relative z-20 flex flex-col items-center my-3 text-[#4A3525] font-serif">
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-1 text-[#8C6B4B]">
              {monthStr}
            </span>
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-0.5">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#8C6B4B]">
                {dayName}
              </span>
              <span className="text-2xl sm:text-4xl font-bold px-3 sm:px-4 border-x-2 border-[#C69B31]/60 text-[#4A3525]">
                {dayNum}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#8C6B4B]">
                AT {timeStr.toUpperCase()}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#8C6B4B] mt-1">
              {yearStr}
            </span>
          </div>

          {/* Venue Line */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-[#4A3525] uppercase tracking-wider mt-1 max-w-xs text-center">
            <MapPin size={14} className="text-[#C69B31] shrink-0" />
            <span>{location}</span>
          </div>

        </div>

        {/* Bottom spacing */}
        <div className="pb-6 sm:pb-8" />

      </section>
    ),
    about: (
      <section key="about" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FAF6F0] via-[#F4EBE0] to-[#FAF6F0] text-[#4A3525]">
        <div className="max-w-2xl mx-auto bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border-2 border-[#C69B31]/60 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">

          {/* Top Flourish Ornament */}
          <div className="flex flex-col items-center mb-6 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
              <Sparkles size={18} className="text-[#C69B31] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3525] tracking-wide font-serif">FAMILY BLESSINGS & INVITATION</h2>
            <p className="text-[#6E543B] text-xs sm:text-sm italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-2 font-serif">
              request the honour of your presence to celebrate their wedding union
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border-2 border-[#C69B31]/40 flex flex-col items-center hover:-translate-y-1 hover:border-[#C69B31] hover:shadow-lg transition-all duration-300 shadow-sm">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-amber-200 animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#4A3525] mb-1 font-serif">{groomName}</h3>
              <p className="text-xs text-[#8C6B4B] font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              {groomParents && <p className="text-xs text-slate-600 font-serif">Son of {groomParents}</p>}
            </div>

            {/* Bride Card */}
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border-2 border-[#C69B31]/40 flex flex-col items-center hover:-translate-y-1 hover:border-[#C69B31] hover:shadow-lg transition-all duration-300 shadow-sm">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-amber-200 animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#4A3525] mb-1 font-serif">{brideName}</h3>
              <p className="text-xs text-[#8C6B4B] font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              {brideParents && <p className="text-xs text-slate-600 font-serif">Daughter of {brideParents}</p>}
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#F4EBE0] via-[#FAF6F0] to-[#F4EBE0]">
        <div className="max-w-2xl mx-auto bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border-2 border-[#C69B31]/60 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
              <Sparkles className="w-7 h-7 text-[#C69B31] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A3525] mb-6 font-serif tracking-wide">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#4A3525] italic leading-relaxed font-serif">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FAF6F0] via-[#F4EBE0] to-[#FAF6F0]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#C69B31]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3525] font-serif tracking-wide">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#FFFDF9] rounded-3xl p-8 shadow-xl border-t-4 border-[#C69B31] border-x border-b border-[#C69B31]/40 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <h3 className="text-xl font-bold text-[#4A3525] mb-3 font-serif relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#6E543B] font-serif relative z-20">
                <Clock className="w-4 h-4 text-[#C69B31]" />
                <span className="font-semibold">{item.time}</span>
              </div>
              <p className="text-slate-600 text-xs font-serif relative z-20">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-gradient-to-b from-[#F4EBE0] via-[#FAF6F0] to-[#F4EBE0]">
        <div className="bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-10 text-center shadow-2xl border-2 border-[#C69B31]/60 relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-16 h-16 bg-amber-100/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#C69B31]/40 text-[#C69B31]">
              <MapPin className="w-8 h-8 text-[#C69B31] animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-[#4A3525] mb-3 font-serif tracking-wide">Venue & Location</h3>
            <p className="text-xl font-semibold text-[#4A3525] mb-2 font-serif">{location}</p>
            <p className="text-md text-[#6E543B] max-w-md mx-auto mb-6 font-serif">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#C69B31]/50 mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border-2 border-[#C69B31]/40 mb-6 bg-white">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#4A3525] hover:bg-[#342418] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6 hover:scale-105 cursor-pointer border border-[#C69B31]/40"
              >
                <Navigation size={16} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#C69B31]/30 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-[#8C6B4B] mb-1 font-sans">RSVP / Contact Info</p>
                <p className="text-base sm:text-lg font-bold text-[#4A3525] font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF6F0]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            <Sparkles className="w-5 h-5 text-[#C69B31]" />
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3525] font-serif tracking-wide">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-[#C69B31]/40 hover:scale-105 transition-transform duration-500 relative bg-white">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 bg-gradient-to-br from-[#3E291C] via-[#2D1B11] to-[#1F120A] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-4 text-center border-2 border-[#C69B31]/60">
        <div className="max-w-3xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-amber-300 font-serif">Counting Down To The Big Day</h2>
          <p className="text-base sm:text-lg italic mb-8 text-amber-100 font-serif">Our Classic Wedding Celebration</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-amber-300/30 hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-3xl font-bold text-amber-300 font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-amber-200 font-sans">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
              <Sparkles className="w-5 h-5 text-[#C69B31] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A3525] font-serif tracking-wide">Send Your Blessings & Wishes</h2>
            <p className="text-[#6E543B] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-[#FFFDF9] backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-[#C69B31]/60 relative overflow-hidden flex flex-col items-center justify-center text-slate-800">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-amber-400/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#4A3525] to-[#342418] border-4 border-amber-300 flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-amber-300/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#4A3525] font-serif block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans mt-1">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#4A3525] hover:bg-[#342418] text-amber-200 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans border border-amber-300/30 relative z-20"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Tap to Send Wish & Love ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#FAF6F0]">
        <div className="bg-[#FFFDF9] backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-[#C69B31]/60 text-center relative overflow-hidden">
          <Gift size={44} className="text-[#C69B31] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#4A3525] font-serif mb-3">Gift Registry</h2>
          <p className="text-sm text-[#6E543B] leading-relaxed max-w-md mx-auto mb-6 font-serif">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#4A3525] hover:bg-[#342418] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all shadow-lg hover:scale-105 cursor-pointer border border-[#C69B31]/40"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#FAF6F0]">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
              <Sparkles className="w-5 h-5 text-[#C69B31]" />
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A3525] font-serif tracking-wide">Will You Join Us?</h2>
            <p className="text-[#6E543B] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-[#FFFDF9] backdrop-blur rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-[#C69B31]/60 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8C6B4B] mb-2 font-sans">Name</label>
                  <input type="text" className="w-full bg-[#FDFBF7] border border-[#C69B31]/40 rounded-xl px-4 py-3 outline-none focus:border-[#4A3525] transition-all font-serif text-[#4A3525]" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8C6B4B] mb-2 font-sans">Warm Wishes & Message</label>
                  <textarea rows={4} className="w-full bg-[#FDFBF7] border border-[#C69B31]/40 rounded-xl px-4 py-3 outline-none focus:border-[#4A3525] transition-all font-serif text-[#4A3525] resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8C6B4B] mb-3 font-sans">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#C69B31]/40 hover:border-[#4A3525] bg-[#FDFBF7] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#4A3525]" />
                      <span className="text-[#4A3525] font-bold uppercase tracking-widest text-xs font-sans">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#C69B31]/40 hover:border-[#4A3525] bg-[#FDFBF7] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#4A3525]" />
                      <span className="text-[#4A3525] font-bold uppercase tracking-widest text-xs font-sans">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A3525] hover:bg-[#342418] text-amber-200 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer border border-[#C69B31]/40">
                  <Send size={14} />
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
    <div className={`min-h-screen bg-[#FAF6F0] relative font-serif flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control Button */}
      {musicUrl && isOpened && (
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#4A3525] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Interactive Grand Royal Palace Double Door Opening Reveal */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1A120B] transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >

        {/* Full Screen Background Image (Grand Palace Architecture) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url('/media/royal_palace_doors.png')" }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>

        {/* Left Grand Door Panel (Swings open to left) */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-cover bg-left bg-no-repeat transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-20 border-r-2 border-amber-300/60 shadow-[10px_0_30px_rgba(0,0,0,0.8)] ${isOpening ? '-translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`}
          style={{ backgroundImage: "url('/media/royal_palace_doors.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-amber-950/60" />
        </div>

        {/* Right Grand Door Panel (Swings open to right) */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-cover bg-right bg-no-repeat transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-20 border-l-2 border-amber-300/60 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] ${isOpening ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`}
          style={{ backgroundImage: "url('/media/royal_palace_doors.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-amber-950/60" />
        </div>

        {/* Top Header Banner */}
        <div className={`absolute top-12 sm:top-16 z-30 flex flex-col items-center text-center px-4 transition-all duration-700 ${isOpening ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center gap-2 text-amber-300 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <span className="h-[1px] w-8 bg-amber-300"></span>
            <Sparkles size={14} className="animate-pulse" />
            <span className="h-[1px] w-8 bg-amber-300"></span>
          </div>
          <span className="text-xs sm:text-sm text-amber-100 font-serif tracking-[0.3em] uppercase font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            YOU ARE CORDIALLY INVITED
          </span>
        </div>

        {/* Center Classic Gold Diamond Crest Latch Button (Distinct Diamond Arch Shape) */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-700 ${isOpening ? 'scale-150 opacity-0 rotate-45' : 'scale-100 opacity-100 rotate-0'}`}>
          {/* Pulsing Aura Rings */}
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rotate-45 rounded-3xl bg-amber-400/20 animate-ping pointer-events-none" />

          {/* Silk Ribbon Accent Top */}
          <div className="w-2 h-8 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 -mb-4 rounded-t-full shadow-md z-30 pointer-events-none" />

          {/* Golden Diamond Crest Latch */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rotate-45 bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 p-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-110 active:scale-95 border-2 border-amber-200/90 rounded-3xl group flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#342418] via-[#24170E] to-[#140C07] border-2 border-amber-300/80 flex flex-col items-center justify-center p-3 text-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] relative overflow-hidden -rotate-45">

              <div className="flex items-center justify-center gap-1 text-amber-300 mb-1">
                <Sparkles size={13} className="text-amber-300 animate-pulse" />
                <Heart size={13} className="fill-amber-300 text-amber-300" />
                <Sparkles size={13} className="text-amber-300 animate-pulse" />
              </div>

              <span className="text-amber-300 text-[10px] sm:text-xs font-extrabold font-serif tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight px-1 whitespace-nowrap">
                OPEN INVITATION
              </span>

              <span className="text-[8px] sm:text-[9px] text-amber-200 tracking-[0.25em] uppercase font-serif mt-1 font-bold opacity-90">
                {isOpening ? 'UNSEALING...' : 'TAP TO ENTER'}
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-amber-300/0 via-amber-200/40 to-amber-300/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>

          {/* Couple Names under Medallion */}
          <h1 className="text-2xl sm:text-4xl font-bold text-amber-100 mt-6 font-serif tracking-wide drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]">
            {groomName} & {brideName}
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm tracking-[0.2em] font-serif uppercase mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            {rawDateStr}
          </p>
        </div>

        {/* Bottom Re-open Hint */}
        <div className={`absolute bottom-6 sm:bottom-10 inset-x-0 mx-auto px-4 z-30 flex flex-col items-center justify-center text-center transition-all duration-500 ${isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold animate-bounce drop-shadow text-center max-w-[280px] sm:max-w-xs leading-relaxed">
            ✨ Tap anywhere to unlatch doors ✨
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-8 relative z-10 text-center bg-[#4A3525] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-8 border-t-2 border-amber-400/30">
        <h2 className="text-2xl font-serif mb-2 text-amber-300">{coupleNames}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );ds
  ds
  dsd
  sd
  sd
  sds
  ds
  d
  sd
  sd
  sds
  d
}
