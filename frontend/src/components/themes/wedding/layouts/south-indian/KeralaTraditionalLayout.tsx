import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Heart, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

// Golden Kerala Kudamattom Temple Parasol / Umbrella SVG
const GoldenUmbrella = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 270" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 C50 20 15 65 10 90 H190 C185 65 150 20 100 20 Z" fill="#F4B41A" stroke="#B87D0E" strokeWidth="3" />
    <path d="M10 90 Q100 120 190 90 L185 105 Q100 135 15 105 Z" fill="#8C1C13" stroke="#590E08" strokeWidth="2" />
    <path d="M100 20 C65 20 40 65 35 90" stroke="#D97706" strokeWidth="3" />
    <path d="M100 20 C135 20 160 65 165 90" stroke="#D97706" strokeWidth="3" />
    <path d="M100 20 C82 20 68 65 65 90" stroke="#FBBF24" strokeWidth="2.5" />
    <path d="M100 20 C118 20 132 65 135 90" stroke="#FBBF24" strokeWidth="2.5" />
    <path d="M10 90 Q20 102 30 90 Q40 102 50 90 Q60 102 70 90 Q80 102 90 90 Q100 102 110 90 Q120 102 130 90 Q140 102 150 90 Q160 102 170 90 Q180 102 190 90" fill="#E67E22" stroke="#96520B" strokeWidth="2" />
    {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="95" x2={x} y2="120" stroke="#FBBF24" strokeWidth="2.5" />
        <circle cx={x} cy="122" r="3.5" fill="#D97706" />
      </g>
    ))}
    <line x1="100" y1="5" x2="100" y2="20" stroke="#D4AF37" strokeWidth="4" />
    <circle cx="100" cy="5" r="4.5" fill="#D4AF37" />
    <line x1="100" y1="90" x2="100" y2="260" stroke="#5C3407" strokeWidth="6" />
  </svg>
);

// Traditional Kerala Brass Nilavilakku Oil Lamp SVG
const Nilavilakku = ({ className = "w-16 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="animate-pulse">
      <path d="M50 5 C43 20 38 30 50 42 C62 30 57 20 50 5 Z" fill="#FF7700" />
      <path d="M50 14 C46 23 43 28 50 36 C57 28 54 23 50 14 Z" fill="#FFDD00" />
    </g>
    <ellipse cx="50" cy="46" rx="22" ry="7" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
    <path d="M45 53 H55 V72 H45 Z" fill="#B89220" />
    <circle cx="50" cy="78" r="9" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
    <path d="M46 87 H54 V118 H46 Z" fill="#B89220" />
    <circle cx="50" cy="124" r="11" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
    <path d="M43 135 H57 V152 H43 Z" fill="#B89220" />
    <path d="M20 178 C20 156 32 150 50 150 C68 150 75 156 80 178 Z" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
  </svg>
);

// Kerala Banana Leaves Top Left
const BananaLeafTopLeft = () => (
  <svg className="w-28 h-40 sm:w-40 sm:h-56" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#1B4D2E" />
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#2D6A4F" />
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#40916C" />
  </svg>
);

// Kerala Banana Leaves Bottom Right
const BananaLeafBottomRight = () => (
  <svg className="w-28 h-40 sm:w-40 sm:h-56 scale-x-[-1]" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#1B4D2E" />
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#2D6A4F" />
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#40916C" />
  </svg>
);

// Authentic Kasavu Gold Zari Border Pattern Component
const KasavuGoldZariBorder = () => (
  <div className="w-full h-4 bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] flex items-center justify-around overflow-hidden shadow-inner border-y border-[#8C6D10]">
    {[...Array(30)].map((_, i) => (
      <div key={i} className="w-2 h-2 rotate-45 border border-[#8C1C13] bg-[#D4AF37] shrink-0" />
    ))}
  </div>
);

export default function KeralaTraditionalLayout({ content, website }: WeddingLayoutProps) {
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

  // Names processing
  const rawCoupleNames = content?.hero_title || "A & B";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = parts[0]?.trim() || "Groom";
  const brideFullName = parts[1]?.trim() || "Bride";

  const story = content?.about_text || "We met in a coffee shop and found a love that lasts forever. Join us as we celebrate our journey together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "15 March 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'MARCH');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '9:00 AM Onwards';

  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Kottakkal, Kerala";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "9:00 AM Onwards", event: "Muhurtham & Thalikettu", date: rawDateStr, venue: fullLocation },
      { time: "12:00 PM Onwards", event: "Traditional Kerala Sadya", date: rawDateStr, venue: fullLocation },
      { time: "6:30 PM Onwards", event: "Grand Wedding Reception", date: rawDateStr, venue: fullLocation }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Nair";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Menon";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: +91 9400850505";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence and blessings on our auspicious day is the greatest gift of all.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T09:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "CORDIALLY INVITE YOU TO THE AUSPICIOUS WEDDING CELEBRATION";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      let targetTime: number | null = null;
      if (countdownDate) {
        let d = new Date(countdownDate);
        if (!isNaN(d.getTime())) {
          targetTime = d.getTime();
        } else {
          d = new Date(String(countdownDate).replace(' ', 'T'));
          if (!isNaN(d.getTime())) {
            targetTime = d.getTime();
          }
        }
      }

      if (!targetTime || targetTime <= new Date().getTime()) {
        const defaultFuture = new Date().getTime() + (30 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000);
        targetTime = defaultFuture;
      }

      const now = new Date().getTime();
      const distance = targetTime - now;

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
      <section
        key="hero"
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#FDFBF7] text-[#2C1810] p-0 overflow-hidden py-14 sm:py-20 min-h-screen font-serif"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-script-alex {
            font-family: 'Alex Brush', 'Great Vibes', cursive, serif;
          }
          .font-garamond {
            font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          }
          @keyframes keralaJasmineFloat {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        {/* Kasavu Gold Zari Border Header Line */}
        <div className="w-full absolute top-0 left-0 z-30">
          <KasavuGoldZariBorder />
        </div>

        {/* Background Subtle Kasavu Cream Gradient */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFFDF9] via-[#FAF5EA] to-[#F3EAD7] opacity-95" />

        {/* Banana Leaf Corners */}
        <div className="absolute top-8 left-0 pointer-events-none z-10 opacity-90">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10 opacity-90">
          <BananaLeafBottomRight />
        </div>

        {/* Floating Golden Jasmine Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(12)].map((_, i) => {
            const leftPos = (i * 8 + 5) % 92;
            const delay = (i * 0.6) % 5;
            const duration = 8 + (i % 5);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-3 h-3 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF2B2] to-amber-200 opacity-60 filter blur-[0.5px]"
                style={{
                  left: `${leftPos}%`,
                  animation: `keralaJasmineFloat ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Top Golden Parasol / Kudamattom */}
        <div className="absolute top-4 -right-6 sm:top-6 sm:-right-6 pointer-events-none z-20">
          <GoldenUmbrella className="w-32 h-44 sm:w-44 sm:h-56 md:w-48 md:h-60 transform -rotate-[28deg]" />
        </div>

        {/* Bottom Left Parasol */}
        <div className="absolute bottom-4 -left-8 sm:bottom-6 sm:-left-6 pointer-events-none z-20">
          <GoldenUmbrella className="w-32 h-44 sm:w-44 sm:h-56 md:w-48 md:h-60 transform rotate-[30deg]" />
        </div>

        {/* Nilavilakku Oil Lamps */}
        <div className="absolute bottom-4 left-4 sm:left-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>
        <div className="absolute bottom-4 right-4 sm:right-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>

        {/* Hero Card Container */}
        <div className="relative z-30 pt-10 sm:pt-14 max-w-xs sm:max-w-md md:max-w-lg mx-auto flex flex-col items-center px-4 pb-12 font-garamond">
          
          {/* Ganesha Motif Icon */}
          <div className="mb-2">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-10 h-10 sm:w-14 sm:h-14 object-contain mx-auto filter drop-shadow-sm" />
          </div>

          <p className="text-[#8C1C13] text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-2">
            താലികെട്ട് കല്യാണം
          </p>

          <p className="text-[#6E543B] text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 max-w-xs sm:max-w-md leading-relaxed">
            {quoteText}
          </p>

          {/* Groom & Bride Names in Deep Maroon Kasavu Style */}
          <h1 className="text-4xl sm:text-6xl font-script-alex text-[#8C1C13] my-1 tracking-wide leading-tight drop-shadow-sm font-normal">
            {groomFullName}
          </h1>

          <span className="text-xs sm:text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase my-2">
            AND
          </span>

          <h1 className="text-4xl sm:text-6xl font-script-alex text-[#8C1C13] my-1 tracking-wide leading-tight drop-shadow-sm font-normal">
            {brideFullName}
          </h1>

          {/* Gold Kasavu Diamond Flourish Divider */}
          <div className="flex items-center justify-center gap-3 my-4 text-[#D4AF37]">
            <span className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <span className="rotate-45 w-2 h-2 border border-[#D4AF37] bg-[#D4AF37]"></span>
            <span className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>

          {/* Date Breakdown Card */}
          <div className="bg-[#FFFFFF]/90 border-2 border-[#D4AF37]/60 rounded-2xl px-6 py-4 shadow-md flex flex-col items-center my-3 text-[#2C1810]">
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#8C1C13] mb-1 font-sans">
              {monthStr}
            </span>
            <div className="flex items-center justify-center gap-4 my-1">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#5C3D2E] font-sans">
                {dayName}
              </span>
              <span className="text-3xl sm:text-4xl font-bold px-4 border-x-2 border-[#D4AF37] text-[#8C1C13] font-serif">
                {dayNum}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#5C3D2E] font-sans">
                AT {timeStr.toUpperCase()}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-[#8C1C13] mt-1 font-sans">
              {yearStr}
            </span>
          </div>

          {/* Venue Location */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#5C3D2E] uppercase tracking-wider mt-4 text-center">
            <MapPin size={15} className="text-[#8C1C13] shrink-0" />
            <span>{fullLocation}</span>
          </div>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF5EA] text-[#2C1810] font-garamond">
        <div className="max-w-3xl mx-auto bg-[#FFFFFF] rounded-[2.5rem] p-8 sm:p-14 shadow-xl border-2 border-[#D4AF37]/60 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#8C1C13] to-transparent"></div>
              <Sparkles size={18} className="text-[#8C1C13] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#8C1C13] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13] tracking-wide">Family Blessings & Invitation</h2>
            <p className="text-[#6E543B] text-xs sm:text-sm italic font-serif max-w-xs sm:max-w-sm mx-auto mt-2">
              request the honour of your presence to celebrate their wedding union
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/50 flex flex-col items-center hover:-translate-y-1.5 hover:border-[#8C1C13] hover:shadow-xl transition-all duration-300 shadow-sm">
              {groomPhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#8C1C13] mb-4 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FFF5E5] to-[#F3EAD7] border-2 border-[#8C1C13] flex flex-col items-center justify-center mb-4 shadow-md text-[#8C1C13]">
                  <span className="text-3xl sm:text-4xl font-serif font-bold">{groomFullName.charAt(0) || 'G'}</span>
                  <Heart size={14} className="fill-[#8C1C13] text-[#8C1C13] mt-1" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-serif italic text-[#8C1C13] mb-1 font-bold">{groomFullName}</h3>
              <p className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              {groomParents && <p className="text-xs text-slate-700 font-serif">Son of {groomParents}</p>}
            </div>

            {/* Bride Card */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/50 flex flex-col items-center hover:-translate-y-1.5 hover:border-[#8C1C13] hover:shadow-xl transition-all duration-300 shadow-sm">
              {bridePhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#8C1C13] mb-4 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FFF5E5] to-[#F3EAD7] border-2 border-[#8C1C13] flex flex-col items-center justify-center mb-4 shadow-md text-[#8C1C13]">
                  <span className="text-3xl sm:text-4xl font-serif font-bold">{brideFullName.charAt(0) || 'B'}</span>
                  <Heart size={14} className="fill-[#8C1C13] text-[#8C1C13] mt-1" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-serif italic text-[#8C1C13] mb-1 font-bold">{brideFullName}</h3>
              <p className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              {brideParents && <p className="text-xs text-slate-700 font-serif">Daughter of {brideParents}</p>}
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="max-w-3xl mx-auto bg-[#FFFFFF] rounded-[2.5rem] p-8 sm:p-14 shadow-xl border-2 border-[#D4AF37]/60 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#8C1C13]/40"></div>
              <Sparkles className="w-6 h-6 text-[#8C1C13] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#8C1C13]/40"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13] mb-6">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-xl text-[#2C1810] italic leading-relaxed font-serif max-w-2xl mx-auto">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#8C1C13] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#8C1C13]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#8C1C13] to-transparent"></div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13] tracking-wide">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 shadow-xl border-t-4 border-[#8C1C13] border-x border-b border-[#D4AF37]/50 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <h3 className="text-lg font-serif italic text-[#8C1C13] font-bold mb-3 relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#5C3D2E] font-serif relative z-20">
                <Clock className="w-4 h-4 text-[#8C1C13]" />
                <span className="font-semibold text-sm">{item.time}</span>
              </div>
              <p className="text-slate-600 text-xs font-serif relative z-20">{item.venue || fullLocation}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="bg-[#FFFFFF] rounded-[2.5rem] p-8 sm:p-14 text-center shadow-xl border-2 border-[#D4AF37]/60 relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-14 h-14 bg-[#FFF5E5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#8C1C13]/40 text-[#8C1C13]">
              <MapPin className="w-7 h-7 text-[#8C1C13] animate-bounce" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13] mb-3">Venue & Location</h3>
            <p className="text-lg sm:text-xl font-serif italic text-[#2C1810] mb-2">{fullLocation}</p>
            <p className="text-sm text-[#6E543B] max-w-md mx-auto mb-6 font-serif">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#D4AF37]/50 mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border-2 border-[#D4AF37]/40 mb-6 bg-white">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
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
                className="inline-flex items-center gap-2 bg-[#8C1C13] hover:bg-[#6D140C] text-white px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-xs mb-6 hover:scale-105 cursor-pointer border border-[#D4AF37]/40 font-sans"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#D4AF37]/40 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-[#8C1C13] mb-1 font-sans">RSVP / Contact Info</p>
                <p className="text-base sm:text-lg font-bold text-[#2C1810] font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
            <Sparkles className="w-5 h-5 text-[#8C1C13]" />
            <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13] tracking-wide">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-[#D4AF37]/50 hover:scale-105 transition-transform duration-500 relative bg-white">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="bg-[#FFFFFF] rounded-[2.5rem] p-8 sm:p-14 text-center shadow-xl border-2 border-[#D4AF37]/60 relative overflow-hidden max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
              <Sparkles className="w-5 h-5 text-[#8C1C13] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13]">Counting Down To The Big Day</h2>
            <p className="text-[#D4AF37] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Kerala Traditional Wedding Celebration</p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto justify-items-center relative z-20">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#8C1C13] to-[#5C0D08] text-white flex items-center justify-center mb-2 shadow-md border border-[#D4AF37]/40 hover:scale-105 transition-transform">
                  <span className="text-lg sm:text-2xl font-bold font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#8C1C13] font-sans text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto font-garamond">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
              <Sparkles className="w-5 h-5 text-[#8C1C13] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13]">Send Your Blessings & Wishes</h2>
            <p className="text-[#6E543B] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-[#FFFFFF] backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-[#D4AF37]/60 relative overflow-hidden flex flex-col items-center justify-center text-slate-800">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-rose-400/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#8C1C13] to-[#5C0D08] border-4 border-[#D4AF37] flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-rose-300/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20 font-sans">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#8C1C13] font-serif block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#8C1C13] hover:bg-[#6D140C] text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans border border-[#D4AF37]/40 relative z-20"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Tap to Send Wish & Love ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="bg-[#FFFFFF] backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-[#D4AF37]/60 text-center relative overflow-hidden">
          <Gift size={44} className="text-[#8C1C13] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13] mb-3">Gift Registry</h2>
          <p className="text-sm text-[#6E543B] leading-relaxed max-w-md mx-auto mb-6 font-serif">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#8C1C13] hover:bg-[#6D140C] text-white px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all shadow-lg hover:scale-105 cursor-pointer border border-[#D4AF37]/40 font-sans"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#FAF5EA] font-garamond">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
              <Sparkles className="w-5 h-5 text-[#8C1C13]" />
              <div className="h-[1px] w-12 bg-[#8C1C13]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#8C1C13]">Will You Join Us?</h2>
            <p className="text-[#6E543B] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-[#FFFFFF] backdrop-blur rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-[#D4AF37]/60 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8C1C13] mb-2">Name</label>
                  <input type="text" className="w-full bg-[#FFFDF9] border border-[#D4AF37]/50 rounded-xl px-4 py-3 outline-none focus:border-[#8C1C13] transition-all text-[#2C1810]" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8C1C13] mb-2">Warm Wishes & Message</label>
                  <textarea rows={4} className="w-full bg-[#FFFDF9] border border-[#D4AF37]/50 rounded-xl px-4 py-3 outline-none focus:border-[#8C1C13] transition-all text-[#2C1810] resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8C1C13] mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/50 hover:border-[#8C1C13] bg-[#FFFDF9] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#8C1C13]" />
                      <span className="text-[#8C1C13] font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/50 hover:border-[#8C1C13] bg-[#FFFDF9] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#8C1C13]" />
                      <span className="text-[#8C1C13] font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8C1C13] hover:bg-[#6D140C] text-white font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer border border-[#D4AF37]/40">
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
    <div className={`min-h-screen bg-[#FAF5EA] relative font-serif text-[#2C1810] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-[#8C1C13] text-[#D4AF37] shadow-2xl border border-[#D4AF37]/40 hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Welcome Screen Interactive Kerala Traditional Kasavu Envelope / Medallion Overlay */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7] transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        {/* Kasavu Gold Zari Border Header */}
        <div className="w-full absolute top-0 left-0 z-30">
          <KasavuGoldZariBorder />
        </div>

        {/* Background Image (Kerala Kasavu Background) */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${isOpening ? 'scale-110 blur-md opacity-0' : 'scale-100 blur-0 opacity-90'}`}
          style={{ backgroundImage: "url('/media/kerala_couple_boat_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-[#FDFBF7]/60 backdrop-blur-[2px]" />
        </div>

        {/* Banana Leaves - Corners */}
        <div className="absolute top-8 left-0 pointer-events-none z-10 opacity-90">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10 opacity-90">
          <BananaLeafBottomRight />
        </div>

        {/* Kudamattom Parasol & Nilavilakku */}
        <div className="absolute top-4 -right-6 sm:top-6 sm:-right-6 pointer-events-none z-20">
          <GoldenUmbrella className="w-32 h-44 sm:w-44 sm:h-56 transform -rotate-[28deg]" />
        </div>
        <div className="absolute bottom-4 left-4 sm:left-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>
        <div className="absolute bottom-4 right-4 sm:right-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>

        {/* Top Header Tag */}
        <div className={`absolute top-10 sm:top-14 z-30 flex flex-col items-center text-center px-4 transition-all duration-700 ${isOpening ? 'opacity-0 -translate-y-8 scale-90' : 'opacity-100 translate-y-0 scale-100'}`}>
          <div className="flex items-center gap-2 text-[#8C1C13] mb-1">
            <span className="h-[1px] w-8 bg-[#8C1C13]"></span>
            <Sparkles size={14} className="animate-pulse text-[#8C1C13]" />
            <span className="h-[1px] w-8 bg-[#8C1C13]"></span>
          </div>
          <span className="text-xs sm:text-sm text-[#8C1C13] font-serif tracking-[0.3em] uppercase font-bold drop-shadow-sm">
            താലികെട്ട് കല്യാണം
          </span>
        </div>

        {/* Central Kasavu Gold Medallion Button */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpening ? 'scale-[2.2] opacity-0 blur-md rotate-6' : 'scale-100 opacity-100 rotate-0'}`}>
          
          {/* Outer Pulsing Aura Rings */}
          <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-[#D4AF37]/40 animate-ping pointer-events-none" />

          {/* Kasavu Gold Medallion */}
          <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F3EAD7] p-3 shadow-[0_15px_45px_rgba(140,28,19,0.2)] border-2 border-[#D4AF37] transition-transform duration-500 hover:scale-105 active:scale-95 group flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Shimmer Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/0 via-amber-100/40 to-amber-200/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Inner Ring */}
            <div className="w-full h-full rounded-full border-2 border-[#D4AF37]/50 flex flex-col items-center justify-center p-4 bg-[#FFFFFF]/90 backdrop-blur-md shadow-inner relative z-10">
              
              <div className="flex items-center gap-1.5 text-[#8C1C13] mb-1">
                <Sparkles size={14} className="text-[#8C1C13] animate-pulse" />
                <Heart size={15} className="fill-[#8C1C13] text-[#8C1C13] drop-shadow-sm" />
                <Sparkles size={14} className="text-[#8C1C13] animate-pulse" />
              </div>

              <span className="text-2xl sm:text-3xl font-script-alex text-[#8C1C13] font-normal leading-tight">
                {groomFullName.split(' ')[0]} & {brideFullName.split(' ')[0]}
              </span>

              <span className="text-[10px] sm:text-xs font-bold font-sans tracking-[0.25em] uppercase text-[#D4AF37] my-1">
                KERALA TRADITIONAL
              </span>

              <span className="text-[9px] sm:text-[10px] text-white tracking-[0.2em] font-sans font-extrabold uppercase mt-1 bg-[#8C1C13] px-4 py-1.5 rounded-full shadow-md border border-[#D4AF37]/40 group-hover:scale-105 transition-transform">
                {isOpening ? 'OPENING...' : 'OPEN INVITATION'}
              </span>

            </div>
          </div>

          {/* Couple Names & Date subtitle */}
          <h1 className="text-xl sm:text-2xl font-script-alex text-[#8C1C13] mt-5 font-normal tracking-wide drop-shadow-sm text-center">
            {groomFullName} & {brideFullName}
          </h1>
          <p className="text-[#D4AF37] text-xs sm:text-sm tracking-[0.22em] font-sans uppercase mt-1 font-bold">
            {monthStr} {dayNum}, {yearStr}
          </p>

        </div>

        {/* Bottom Floating Hint */}
        <div className={`absolute bottom-6 sm:bottom-10 inset-x-0 mx-auto px-4 z-30 flex flex-col items-center justify-center text-center transition-all duration-500 ${isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] sm:text-xs text-[#8C1C13] font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold animate-bounce drop-shadow-sm text-center max-w-[280px] sm:max-w-xs leading-relaxed">
            ✨ Tap button to open invitation ✨
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-8 relative z-10 text-center bg-[#8C1C13] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-8 border-t-2 border-[#D4AF37]/40">
        <h2 className="text-2xl font-script-alex mb-2 text-[#D4AF37]">{rawCoupleNames}</h2>
        <p className="text-amber-100/70 text-xs tracking-widest uppercase mb-2 font-sans">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
