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

// Marigold & Jasmine Toran Garland Top SVG Component
const KeralaToranGarland = () => (
  <svg className="w-full h-10 sm:h-12" viewBox="0 0 600 40" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 5 Q75 35 150 5 Q225 35 300 5 Q375 35 450 5 Q525 35 600 5" stroke="#2D6A4F" strokeWidth="3" fill="none" />
    {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
      <g key={i} transform={`translate(${x}, 12)`}>
        {/* Marigold Orange Blossom */}
        <circle cx="0" cy="8" r="7" fill="#FF7700" stroke="#D97706" strokeWidth="1" />
        <circle cx="0" cy="8" r="4" fill="#FFDD00" />
        {/* Jasmine Flower Tag */}
        <ellipse cx="0" cy="18" rx="2.5" ry="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
      </g>
    ))}
  </svg>
);

// Netipattam (Elephant Gold Caparison Medallion) Latch SVG
const NetipattamMedallion = ({ className = "w-36 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Crest Shape */}
    <path d="M80 10 L150 50 V130 C150 170 80 210 80 210 C80 210 10 170 10 130 V50 Z" fill="url(#netiGold)" stroke="#8C6D10" strokeWidth="3" />
    <path d="M80 22 L138 56 V124 C138 158 80 194 80 194 C80 194 22 158 22 124 V56 Z" fill="#8C1C13" stroke="#D4AF37" strokeWidth="2" />
    {/* Gold Bubbles / Beads */}
    {[
      [80, 40], [55, 55], [105, 55], [40, 80], [80, 75], [120, 80],
      [55, 105], [105, 105], [80, 110], [60, 140], [100, 140], [80, 160]
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="7" fill="#FFD700" stroke="#B87D0E" strokeWidth="1.5" />
    ))}
    {/* Hanging Tassels at Bottom */}
    <path d="M50 200 L45 220 M80 205 L80 225 M110 200 L115 220" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
    <circle cx="45" cy="222" r="3.5" fill="#8C1C13" />
    <circle cx="80" cy="227" r="4" fill="#8C1C13" />
    <circle cx="115" cy="222" r="3.5" fill="#8C1C13" />
    <defs>
      <linearGradient id="netiGold" x1="0" y1="0" x2="160" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#AA7C11" />
      </linearGradient>
    </defs>
  </svg>
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
    }, 900);
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
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#120703] text-amber-100 p-0 overflow-hidden py-14 sm:py-20 min-h-screen font-serif"
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

        {/* Marigold Toran Garland hanging at top */}
        <div className="w-full absolute top-4 left-0 z-30 pointer-events-none">
          <KeralaToranGarland />
        </div>

        {/* Background Dark Wood Royal Radial Gradient */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2A1508] via-[#1D0E05] to-[#120703] opacity-95" />

        {/* Banana Leaf Corners */}
        <div className="absolute top-10 left-0 pointer-events-none z-10 opacity-80">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10 opacity-80">
          <BananaLeafBottomRight />
        </div>

        {/* Floating Golden Jasmine Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(14)].map((_, i) => {
            const leftPos = (i * 8 + 5) % 92;
            const delay = (i * 0.6) % 5;
            const duration = 8 + (i % 5);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-3 h-3 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#FFF2B2] to-amber-300 opacity-70 filter blur-[0.5px]"
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
        <div className="absolute top-8 -right-6 sm:top-10 sm:-right-6 pointer-events-none z-20">
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
        <div className="relative z-30 pt-14 sm:pt-16 max-w-xs sm:max-w-md md:max-w-lg mx-auto flex flex-col items-center px-4 pb-12 font-garamond">
          
          {/* Ganesha Motif Icon */}
          <div className="mb-2">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-10 h-10 sm:w-14 sm:h-14 object-contain mx-auto filter drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]" />
          </div>

          <p className="text-[#FFD700] text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            താലികെട്ട് കല്യാണം
          </p>

          <p className="text-amber-200/90 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 max-w-xs sm:max-w-md leading-relaxed drop-shadow">
            {quoteText}
          </p>

          {/* Groom & Bride Names in Deep Royal Gold Style */}
          <h1 className="text-4xl sm:text-6xl font-script-alex text-[#FFD700] my-1 tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-normal">
            {groomFullName}
          </h1>

          <span className="text-xs sm:text-sm text-[#FFD700] font-bold tracking-[0.3em] uppercase my-2 drop-shadow">
            AND
          </span>

          <h1 className="text-4xl sm:text-6xl font-script-alex text-[#FFD700] my-1 tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-normal">
            {brideFullName}
          </h1>

          {/* Gold Kasavu Diamond Flourish Divider */}
          <div className="flex items-center justify-center gap-3 my-4 text-[#FFD700]">
            <span className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#FFD700]"></span>
            <span className="rotate-45 w-2 h-2 border border-[#FFD700] bg-[#FFD700]"></span>
            <span className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-[#FFD700]"></span>
          </div>

          {/* Date Breakdown Card */}
          <div className="w-full max-w-[290px] sm:max-w-sm bg-gradient-to-b from-[#2A1508] via-[#1D0E05] to-[#120703] border-2 border-[#FFD700] rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex flex-col items-center my-4 relative overflow-hidden">
            {/* Top Zari Accent */}
            <div className="w-full h-1 bg-[#FFD700] absolute top-0 inset-x-0" />

            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#FFD700] mb-2 font-sans">
              {monthStr} {yearStr}
            </span>

            <div className="w-full flex items-center justify-between gap-2 px-2 my-1 border-y border-[#FFD700]/40 py-2">
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-200 font-sans whitespace-nowrap flex-1 text-center">
                {dayName}
              </span>
              <div className="px-3 py-0.5 bg-[#8C1C13] text-[#FFD700] font-serif font-bold text-2xl sm:text-3xl rounded-lg shadow-md border border-[#FFD700] shrink-0 whitespace-nowrap">
                {dayNum}
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-200 font-sans whitespace-nowrap flex-1 text-center">
                {timeStr}
              </span>
            </div>
          </div>

          {/* Venue Location */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wider mt-4 text-center">
            <MapPin size={15} className="text-[#FFD700] shrink-0 animate-bounce" />
            <span>{fullLocation}</span>
          </div>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#1D0E05] text-amber-100 font-garamond">
        <div className="max-w-3xl mx-auto bg-[#2A1508]/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-14 shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
              <Sparkles size={18} className="text-[#FFD700] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] tracking-wide drop-shadow">Family Blessings & Invitation</h2>
            <p className="text-amber-200/80 text-xs sm:text-sm italic font-serif max-w-xs sm:max-w-sm mx-auto mt-2">
              request the honour of your presence to celebrate their wedding union
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-[#1A0B05] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/60 flex flex-col items-center hover:-translate-y-1.5 hover:border-[#FFD700] hover:shadow-[0_10px_25px_rgba(255,215,0,0.2)] transition-all duration-300 shadow-md">
              {groomPhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#FFD700] mb-4 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#3A1F0D] to-[#1D0E05] border-2 border-[#FFD700] flex flex-col items-center justify-center mb-4 shadow-md text-[#FFD700]">
                  <span className="text-3xl sm:text-4xl font-serif font-bold">{groomFullName.charAt(0) || 'G'}</span>
                  <Heart size={14} className="fill-[#FFD700] text-[#FFD700] mt-1" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-serif italic text-[#FFD700] mb-1 font-bold">{groomFullName}</h3>
              <p className="text-[11px] text-amber-300 font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              {groomParents && <p className="text-xs text-amber-100/80 font-serif">Son of {groomParents}</p>}
            </div>

            {/* Bride Card */}
            <div className="bg-[#1A0B05] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/60 flex flex-col items-center hover:-translate-y-1.5 hover:border-[#FFD700] hover:shadow-[0_10px_25px_rgba(255,215,0,0.2)] transition-all duration-300 shadow-md">
              {bridePhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#FFD700] mb-4 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#3A1F0D] to-[#1D0E05] border-2 border-[#FFD700] flex flex-col items-center justify-center mb-4 shadow-md text-[#FFD700]">
                  <span className="text-3xl sm:text-4xl font-serif font-bold">{brideFullName.charAt(0) || 'B'}</span>
                  <Heart size={14} className="fill-[#FFD700] text-[#FFD700] mt-1" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-serif italic text-[#FFD700] mb-1 font-bold">{brideFullName}</h3>
              <p className="text-[11px] text-amber-300 font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              {brideParents && <p className="text-xs text-amber-100/80 font-serif">Daughter of {brideParents}</p>}
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#120703] font-garamond">
        <div className="max-w-3xl mx-auto bg-[#2A1508]/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-14 shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#FFD700]/40"></div>
              <Sparkles className="w-6 h-6 text-[#FFD700] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#FFD700]/40"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] mb-6 drop-shadow">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-xl text-amber-100/90 italic leading-relaxed font-serif max-w-2xl mx-auto">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#1D0E05] font-garamond">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#FFD700]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] tracking-wide drop-shadow">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#2A1508] rounded-3xl p-6 sm:p-8 shadow-xl border-t-4 border-[#FFD700] border-x border-b border-[#D4AF37]/50 text-center hover:-translate-y-2 hover:border-[#FFD700] hover:shadow-[0_10px_25px_rgba(255,215,0,0.2)] transition-all duration-300 relative overflow-hidden">
              <h3 className="text-lg font-serif italic text-[#FFD700] font-bold mb-3 relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-amber-200 font-serif relative z-20">
                <Clock className="w-4 h-4 text-[#FFD700]" />
                <span className="font-semibold text-sm">{item.time}</span>
              </div>
              <p className="text-amber-100/70 text-xs font-serif relative z-20">{item.venue || fullLocation}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#120703] font-garamond">
        <div className="bg-[#2A1508]/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-14 text-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-14 h-14 bg-[#1A0B05] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-[#FFD700]/60 text-[#FFD700]">
              <MapPin className="w-7 h-7 text-[#FFD700] animate-bounce" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] mb-3 drop-shadow">Venue & Location</h3>
            <p className="text-lg sm:text-xl font-serif italic text-amber-100 mb-2">{fullLocation}</p>
            <p className="text-sm text-amber-200/80 max-w-md mx-auto mb-6 font-serif">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#FFD700]/60 mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border-2 border-[#FFD700]/50 mb-6 bg-black">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter contrast-105"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8C1C13] via-[#A31D1D] to-[#8C1C13] hover:from-[#A31D1D] hover:to-[#6D140C] text-[#FFD700] px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-xl text-xs mb-6 hover:scale-105 cursor-pointer border border-[#FFD700] font-sans"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#FFD700]/30 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-[#FFD700] mb-1 font-sans">RSVP / Contact Info</p>
                <p className="text-base sm:text-lg font-bold text-amber-100 font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#1D0E05] font-garamond">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#FFD700]"></div>
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <div className="h-[1px] w-12 bg-[#FFD700]"></div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] tracking-wide drop-shadow">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFD700]/70 hover:scale-105 transition-transform duration-500 relative bg-[#1A0B05]">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#120703] font-garamond">
        <div className="bg-[#2A1508]/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-14 text-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 relative overflow-hidden max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#FFD700]"></div>
              <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#FFD700]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] drop-shadow">Counting Down To The Big Day</h2>
            <p className="text-amber-200 tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Kerala Traditional Wedding Celebration</p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto justify-items-center relative z-20">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#8C1C13] to-[#4D0805] text-[#FFD700] flex items-center justify-center mb-2 shadow-xl border-2 border-[#FFD700] hover:scale-105 transition-transform">
                  <span className="text-lg sm:text-2xl font-bold font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#FFD700] font-sans text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#1D0E05] font-garamond">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#FFD700]"></div>
              <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#FFD700]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] drop-shadow">Send Your Blessings & Wishes</h2>
            <p className="text-amber-200/90 tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-[#2A1508]/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 relative overflow-hidden flex flex-col items-center justify-center text-amber-100">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-[#FFD700]/60 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#8C1C13] to-[#5C0D08] border-4 border-[#FFD700] flex items-center justify-center shadow-2xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-[#FFD700]/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20 font-sans">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#FFD700] font-serif block tracking-wider transition-transform duration-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${isCounterPopping ? 'scale-125 text-amber-300' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-amber-200/80 uppercase tracking-widest mt-1">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#8C1C13] via-[#A31D1D] to-[#8C1C13] hover:from-[#A31D1D] hover:to-[#6D140C] text-[#FFD700] shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans border border-[#FFD700] relative z-20"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              Tap to Send Wish & Love ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#120703] font-garamond">
        <div className="bg-[#2A1508]/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 text-center relative overflow-hidden">
          <Gift size={44} className="text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] mb-3 drop-shadow">Gift Registry</h2>
          <p className="text-sm text-amber-200/80 leading-relaxed max-w-md mx-auto mb-6 font-serif">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8C1C13] via-[#A31D1D] to-[#8C1C13] hover:from-[#A31D1D] hover:to-[#6D140C] text-[#FFD700] px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all shadow-xl hover:scale-105 cursor-pointer border border-[#FFD700] font-sans"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#120703] font-garamond">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#FFD700]"></div>
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <div className="h-[1px] w-12 bg-[#FFD700]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#FFD700] drop-shadow">Will You Join Us?</h2>
            <p className="text-amber-200/90 tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-[#2A1508]/90 backdrop-blur rounded-[2.5rem] p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#FFD700]/70 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#FFD700] mb-2">Name</label>
                  <input type="text" className="w-full bg-[#1A0B05] border border-[#D4AF37]/60 rounded-xl px-4 py-3 outline-none focus:border-[#FFD700] transition-all text-amber-100 placeholder-amber-200/40" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#FFD700] mb-2">Warm Wishes & Message</label>
                  <textarea rows={4} className="w-full bg-[#1A0B05] border border-[#D4AF37]/60 rounded-xl px-4 py-3 outline-none focus:border-[#FFD700] transition-all text-amber-100 placeholder-amber-200/40 resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#FFD700] mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/60 hover:border-[#FFD700] bg-[#1A0B05] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#FFD700]" />
                      <span className="text-amber-200 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/60 hover:border-[#FFD700] bg-[#1A0B05] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#FFD700]" />
                      <span className="text-amber-200 font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C1C13] via-[#A31D1D] to-[#8C1C13] hover:from-[#A31D1D] hover:to-[#6D140C] text-[#FFD700] font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105 cursor-pointer border border-[#FFD700]">
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
    <div className={`min-h-screen bg-[#120703] relative font-serif text-amber-100 flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-[#8C1C13] text-[#FFD700] shadow-2xl border border-[#FFD700]/70 hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Unique Royal Kerala Nalukettu Palace Double Wooden Door Opening Reveal Screen */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1A0B05] transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent perspective-[1000px]`}
      >

        {/* Kasavu Gold Zari Border Header */}
        <div className="w-full absolute top-0 left-0 z-50">
          <KasavuGoldZariBorder />
        </div>

        {/* Marigold Toran Garland hanging at top */}
        <div className="w-full absolute top-4 left-0 z-50 pointer-events-none">
          <KeralaToranGarland />
        </div>

        {/* Fullscreen Backdrop (Soft Kerala Backwaters & Coconut Palms) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url('/media/kerala_couple_boat_bg.png')" }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>

        {/* LEFT KERALA NALUKETTU PALACE WOODEN DOOR PANEL */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-[#2A1508] border-r-4 border-[#D4AF37] shadow-[15px_0_40px_rgba(0,0,0,0.9)] transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-30 flex flex-col justify-between p-6 ${isOpening ? '-translate-x-full opacity-0 -rotate-y-90' : 'translate-x-0 opacity-100 rotate-y-0'}`}
          style={{ backgroundImage: "radial-gradient(ellipse at left, #3A1F0D 0%, #1D0E05 100%)" }}
        >
          <div className="mt-12">
            <BananaLeafTopLeft />
          </div>
          <div className="my-auto self-end pr-4">
            <Nilavilakku className="w-16 h-32" />
          </div>
          <div className="mb-6 opacity-40 text-xs font-serif text-[#D4AF37] uppercase tracking-widest">
            ശ്രീ ഭഗവതി ശരണം
          </div>
        </div>

        {/* RIGHT KERALA NALUKETTU PALACE WOODEN DOOR PANEL */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-[#2A1508] border-l-4 border-[#D4AF37] shadow-[-15px_0_40px_rgba(0,0,0,0.9)] transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-30 flex flex-col justify-between p-6 ${isOpening ? 'translate-x-full opacity-0 rotate-y-90' : 'translate-x-0 opacity-100 rotate-y-0'}`}
          style={{ backgroundImage: "radial-gradient(ellipse at right, #3A1F0D 0%, #1D0E05 100%)" }}
        >
          <div className="mt-12 self-end">
            <div className="scale-x-[-1]">
              <BananaLeafTopLeft />
            </div>
          </div>
          <div className="my-auto self-start pl-4">
            <Nilavilakku className="w-16 h-32" />
          </div>
          <div className="mb-6 opacity-40 text-xs font-serif text-[#D4AF37] uppercase tracking-widest text-right">
            മംഗളം ഭവതു
          </div>
        </div>

        {/* CENTER BRASS ELEPHANT CAPARISON (NETIPATTAM) LATCH BUTTON */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpening ? 'scale-[2.2] opacity-0 blur-lg rotate-12' : 'scale-100 opacity-100 rotate-0'}`}>
          
          {/* Outer Pulsing Golden Aura Ring */}
          <div className="absolute w-56 h-64 sm:w-68 sm:h-80 rounded-3xl border-2 border-[#D4AF37]/50 animate-ping pointer-events-none" />

          {/* Netipattam Brass Caparison Medallion Latch */}
          <div className="relative group flex flex-col items-center cursor-pointer transition-transform duration-500 hover:scale-105 active:scale-95">
            <NetipattamMedallion className="w-48 h-64 sm:w-56 sm:h-76 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]" />

            {/* Interactive Unseal Action Pill Tag over Netipattam */}
            <div className="absolute bottom-10 inset-x-0 mx-auto w-[85%] bg-gradient-to-r from-[#8C1C13] via-[#A31D1D] to-[#8C1C13] text-white py-2.5 px-4 rounded-full border-2 border-[#FFD700] shadow-xl text-center flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-[11px] sm:text-xs font-bold font-sans tracking-[0.2em] uppercase text-[#FFD700]">
                {isOpening ? 'UNSEALING...' : 'തുറക്കുക • OPEN'}
              </span>
              <span className="text-[8px] sm:text-[9px] text-amber-100 tracking-widest uppercase font-serif mt-0.5">
                {groomFullName} & {brideFullName}
              </span>
            </div>
          </div>

          {/* Title Subtitle below Medallion */}
          <h1 className="text-xl sm:text-2xl font-serif text-[#FFD700] mt-6 font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center">
            മംഗളകരമായ താലികെട്ട്
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm tracking-[0.2em] font-sans uppercase mt-1 font-semibold drop-shadow">
            {monthStr} {dayNum}, {yearStr}
          </p>

        </div>

        {/* Bottom Unlatching Hint */}
        <div className={`absolute bottom-6 sm:bottom-10 inset-x-0 mx-auto px-4 z-40 flex flex-col items-center justify-center text-center transition-all duration-500 ${isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] sm:text-xs text-[#FFD700] font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center max-w-[280px] sm:max-w-xs leading-relaxed">
            ✨ Tap Netipattam latch to open Nalukettu doors ✨
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-8 relative z-10 text-center bg-[#1A0B05] text-[#FFD700] rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-8 border-t-2 border-[#FFD700]/60 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <h2 className="text-3xl font-script-alex mb-2 text-[#FFD700] drop-shadow">{rawCoupleNames}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2 font-sans">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
