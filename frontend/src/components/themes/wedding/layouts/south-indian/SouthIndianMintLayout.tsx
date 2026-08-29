import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Heart, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

// Golden Temple Parasol / Umbrella (Kudamattom SVG)
const GoldenUmbrella = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 270" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 C50 20 15 65 10 90 H190 C185 65 150 20 100 20 Z" fill="#F4B41A" stroke="#B87D0E" strokeWidth="3" />
    <path d="M10 90 Q100 120 190 90 L185 105 Q100 135 15 105 Z" fill="#6B3A0A" stroke="#4A2604" strokeWidth="2" />
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

// Golden Nilavilakku (Brass Oil Lamp SVG)
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

// Banana Leaf Group Left Top
const BananaLeafTopLeft = () => (
  <svg className="w-28 h-40 sm:w-40 sm:h-56" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#1B4D3E" />
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#2D7A60" />
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#3DA382" />
  </svg>
);

// Banana Leaf Group Right Bottom
const BananaLeafBottomRight = () => (
  <svg className="w-28 h-40 sm:w-40 sm:h-56 scale-x-[-1]" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#1B4D3E" />
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#2D7A60" />
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#3DA382" />
  </svg>
);

// Concentric Mandala Rings SVG
const MandalaRingsSVG = () => (
  <svg className="w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] md:w-[660px] md:h-[660px] animate-[spin_60s_linear_infinite]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="250" r="212" fill="#D4F4F0" opacity="0.8" />
    <circle cx="250" cy="250" r="240" stroke="#3D9B91" strokeWidth="2.5" opacity="0.6" />
    <circle cx="250" cy="250" r="230" stroke="#3D9B91" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />
    {[...Array(24)].map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <g key={i} transform={`rotate(${angle} 250 250)`}>
          <path d="M250 20 C242 40 240 55 250 65 C260 55 258 40 250 20 Z" fill="none" stroke="#2D7A60" strokeWidth="1.5" opacity="0.6" />
          <circle cx="250" cy="43" r="3" fill="#2D7A60" opacity="0.6" />
        </g>
      );
    })}
    <circle cx="250" cy="250" r="212" stroke="#3D9B91" strokeWidth="2" opacity="0.8" />
    <circle cx="250" cy="250" r="185" stroke="#3D9B91" strokeWidth="1.5" opacity="0.6" />
    <circle cx="250" cy="250" r="165" stroke="#3D9B91" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
  </svg>
);

// Bride Saree / Drapery Line Ornament SVG
const BrideSareeFlourish = () => (
  <svg className="w-28 h-18 mx-auto my-2" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 5 C45 20 30 40 18 55 C35 50 50 60 60 65 C70 60 85 50 102 55 C90 40 75 20 60 5 Z" stroke="#D4AF37" strokeWidth="2" fill="none" />
    <path d="M60 5 Q48 30 28 45 M60 5 Q72 30 92 45" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="2 2" />
    <path d="M38 50 Q60 62 82 50" stroke="#D4AF37" strokeWidth="1.5" />
  </svg>
);

export default function SouthIndianMintLayout({ content, website }: WeddingLayoutProps) {
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

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const coupleNamesStr = content?.hero_title || 'Chiranjeev & Aarohi';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Chiranjeev';
  const brideName = nameParts[1]?.trim() || 'Aarohi';

  const story = content?.about_text || "We met at a coffee shop and found a love that lasts forever. Join us as we celebrate our journey together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || '15 March 2026';
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'MARCH');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '9:00 AM';

  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, Kottakkal";

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Mr. & Mrs. Smith';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Mr. & Mrs. Johnson';

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "9:00 AM Onwards", event: "Muhurtham", date: rawDateStr, venue: fullLocation },
      { time: "7:00 PM Onwards", event: "Reception", date: rawDateStr, venue: fullLocation }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 9400850505";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your blessings and presence at our wedding are the greatest gifts of all.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2027-03-25T09:00";
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "WE INVITE YOU TO CELEBRATE OUR WEDDING";

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
      <section key="hero" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#A3DFD8] via-[#8FD5CD] to-[#7BCBC2] text-center py-16 px-4">
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Cinzel:wght@600;700&display=swap');
          .font-script-vibes {
            font-family: 'Great Vibes', cursive, serif;
          }
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          @keyframes goldParticleFloat {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.7; }
            80% { opacity: 0.7; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        {/* Floating Sparkle Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(12)].map((_, i) => {
            const leftPos = (i * 8 + 5) % 92;
            const delay = (i * 0.6) % 5;
            const duration = 7 + (i % 5);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-3 h-3 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF2B2] opacity-50 filter blur-[0.5px]"
                style={{
                  left: `${leftPos}%`,
                  animation: `goldParticleFloat ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Background Mandala Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <MandalaRingsSVG />
        </div>

        {/* Banana Leaves - Corners */}
        <div className="absolute top-4 left-0 pointer-events-none z-10">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10">
          <BananaLeafBottomRight />
        </div>

        {/* Top Right Golden Parasol / Umbrella */}
        <div className="absolute top-0 -right-8 sm:top-2 sm:-right-8 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform -rotate-[32deg]" />
        </div>

        {/* Bottom Left Golden Parasol / Umbrella */}
        <div className="absolute bottom-0 -left-10 sm:bottom-2 sm:-left-8 md:bottom-4 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform rotate-[35deg]" />
        </div>

        {/* Bottom Corner Golden Nilavilakku Brass Oil Lamps */}
        <div className="absolute bottom-3 left-4 sm:left-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>
        <div className="absolute bottom-3 right-4 sm:right-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>

        {/* Center Main Invitation Content */}
        <div className="relative z-30 w-full max-w-[320px] sm:max-w-[420px] flex flex-col items-center justify-center text-center mx-auto my-auto p-4 sm:p-6 bg-white/40 backdrop-blur-md rounded-[2.5rem] border-2 border-[#D4AF37]/50 shadow-[0_15px_40px_rgba(27,77,62,0.25)]">

          {/* Golden Ganesha Line Icon */}
          <div className="mb-2">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-10 h-10 sm:w-14 sm:h-14 object-contain mx-auto filter drop-shadow-sm" />
          </div>

          <p className="text-[#1E333C] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-2 opacity-95 leading-relaxed font-playfair">
            {quoteText}
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#1C3A35] mb-2 font-script-vibes whitespace-nowrap drop-shadow-sm px-2">
            {groomName} & {brideName}
          </h1>

          {/* Teal Line Flourish with Center Dot above Date */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-85">
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#2D7A60]"></div>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#2D7A60]"></div>
          </div>

          {/* Date & Time Display */}
          <p className="text-[#1C3A35] text-sm sm:text-lg font-bold tracking-widest my-1 font-playfair">
            {monthStr} {dayNum}, {yearStr} • {timeStr}
          </p>

          {/* Teal Line Flourish with Center Dot below Date */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-85">
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#2D7A60]"></div>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#2D7A60]"></div>
          </div>

          {/* Venue Line */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1C3A35] uppercase tracking-wider mt-1 max-w-xs text-center font-playfair">
            <MapPin size={14} className="text-[#D4AF37] shrink-0" />
            <span>{fullLocation}</span>
          </div>

          {/* Golden Bride Saree Drapery Flourish */}
          <BrideSareeFlourish />

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#7BCBC2] text-[#1C3A35] font-playfair">
        <div className="text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-[#D4AF37]"></div>
              <Sparkles size={18} className="text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#1C3A35] font-script-vibes">Family Blessings & Details</h2>
            <p className="text-[#1E333C] text-xs sm:text-sm italic font-playfair mt-1">
              request the honour of your presence to celebrate their wedding union
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Groom Card */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border-2 border-[#D4AF37]/50 flex flex-col items-center hover:-translate-y-1.5 transition-all">
              {groomPhoto ? (
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#D4AF37] mb-4 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#E2F5F3] border-4 border-[#D4AF37] flex items-center justify-center mb-4 text-[#1C3A35]">
                  <span className="text-3xl font-bold font-script-vibes">{groomName.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#1C3A35] mb-1 font-script-vibes">{groomName}</h3>
              <p className="text-xs text-[#2D7A60] uppercase tracking-widest mb-1 font-bold font-sans">Groom</p>
              {groomParents && <p className="text-sm font-medium text-slate-700 font-playfair">Son of {groomParents}</p>}
            </div>

            {/* Bride Card */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border-2 border-[#D4AF37]/50 flex flex-col items-center hover:-translate-y-1.5 transition-all">
              {bridePhoto ? (
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#D4AF37] mb-4 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#E2F5F3] border-4 border-[#D4AF37] flex items-center justify-center mb-4 text-[#1C3A35]">
                  <span className="text-3xl font-bold font-script-vibes">{brideName.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#1C3A35] mb-1 font-script-vibes">{brideName}</h3>
              <p className="text-xs text-[#2D7A60] uppercase tracking-widest mb-1 font-bold font-sans">Bride</p>
              {brideParents && <p className="text-sm font-medium text-slate-700 font-playfair">Daughter of {brideParents}</p>}
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#8FD5CD]">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 shadow-xl border-2 border-[#D4AF37]/50">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <Sparkles className="w-6 h-6 text-[#D4AF37] animate-bounce" />
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C3A35] mb-6 font-script-vibes">
            {storyTitle}
          </h2>
          <p className="text-base sm:text-xl text-slate-800 italic leading-relaxed font-playfair">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#7BCBC2] font-playfair">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-[#D4AF37]"></div>
            <Calendar className="w-6 h-6 text-[#D4AF37]" />
            <div className="h-[1px] w-12 sm:w-16 bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C3A35] font-script-vibes">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-t-4 border-[#D4AF37] border-x border-b border-teal-200">
              <h3 className="text-2xl font-bold text-[#1C3A35] mb-3 font-serif">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#2D7A60]">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">{item.time}</span>
              </div>
              <p className="text-slate-600 text-sm mt-2">{item.venue || fullLocation}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#8FD5CD] font-playfair">
        <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-8 sm:p-12 text-center shadow-xl border-2 border-[#D4AF37]/50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-amber-100/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#D4AF37]/40 text-[#1C3A35]">
              <MapPin className="w-8 h-8 text-[#D4AF37] animate-bounce" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-[#1C3A35] mb-3 font-script-vibes">Venue & Location</h3>
            <p className="text-xl font-bold text-[#1C3A35] mb-2">{fullLocation}</p>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#D4AF37]/40 mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-6 bg-white">
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
                className="inline-flex items-center gap-2 bg-[#1C3A35] hover:bg-[#122623] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-xs mb-6 hover:scale-105 cursor-pointer font-sans"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-1 font-sans">RSVP / Contact Info</p>
                <p className="text-base sm:text-lg font-bold text-slate-800">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#7BCBC2] font-playfair">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C3A35] font-script-vibes">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500 relative bg-white">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#8FD5CD] font-playfair">
        <div className="bg-[#1C3A35] rounded-[2.5rem] p-8 sm:p-12 text-center shadow-2xl border-2 border-[#D4AF37]/50 relative overflow-hidden max-w-2xl mx-auto text-white">
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 font-script-vibes">Counting Down To The Big Day</h2>
            <p className="text-teal-200 uppercase tracking-widest text-xs font-semibold mt-1 font-sans">Traditional Kerala Wedding Celebration</p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto justify-items-center relative z-20 font-sans">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center mb-2 shadow-md border border-amber-300/30 hover:scale-105 transition-transform">
                  <span className="text-lg sm:text-2xl font-bold">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-teal-200 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto font-playfair">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#1C3A35] font-script-vibes">Send Your Blessings & Wishes</h2>
            <p className="text-[#1E333C] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-[#D4AF37]/50 relative overflow-hidden flex flex-col items-center justify-center text-slate-800">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-teal-400/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#1C3A35] to-[#2D7A60] border-4 border-[#D4AF37] flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-teal-300/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20 font-sans">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#1C3A35] block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#1C3A35] hover:bg-[#122623] text-amber-200 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans relative z-20"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Tap to Send Wish & Love ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#8FD5CD] font-playfair">
        <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-[#D4AF37]/50 text-center relative overflow-hidden">
          <Gift size={44} className="text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C3A35] mb-3 font-script-vibes">Gift Registry</h2>
          <p className="text-sm text-slate-700 leading-relaxed max-w-md mx-auto mb-6 font-playfair">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1C3A35] hover:bg-[#122623] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all shadow-lg hover:scale-105 cursor-pointer font-sans"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#7BCBC2] font-playfair">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1C3A35] font-script-vibes">Will You Join Us?</h2>
            <p className="text-[#1E333C] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-[#D4AF37]/50 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#1C3A35] mb-2 font-sans">Name</label>
                  <input type="text" className="w-full bg-[#E2F5F3] border border-teal-200 rounded-xl px-4 py-3 outline-none focus:border-[#1C3A35] transition-all font-playfair text-[#1C3A35]" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#1C3A35] mb-2 font-sans">Warm Wishes & Message</label>
                  <textarea rows={4} className="w-full bg-[#E2F5F3] border border-teal-200 rounded-xl px-4 py-3 outline-none focus:border-[#1C3A35] transition-all font-playfair text-[#1C3A35] resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#1C3A35] mb-3 font-sans">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-teal-200 hover:border-[#1C3A35] bg-[#E2F5F3] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#1C3A35]" />
                      <span className="text-[#1C3A35] font-bold uppercase tracking-widest text-xs font-sans">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-teal-200 hover:border-[#1C3A35] bg-[#E2F5F3] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#1C3A35]" />
                      <span className="text-[#1C3A35] font-bold uppercase tracking-widest text-xs font-sans">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3A35] hover:bg-[#122623] text-amber-200 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer border border-[#D4AF37]/40">
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
    <div className={`min-h-screen bg-[#A3DFD8] relative font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-[#1C3A35]/90 backdrop-blur-md text-amber-300 shadow-2xl border border-amber-300/40 hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Welcome Screen Interactive Cover Overlay with Unseal Animation */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#A3DFD8] transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        {/* Background Mandala Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <MandalaRingsSVG />
        </div>

        {/* Banana Leaves - Corners */}
        <div className="absolute top-4 left-0 pointer-events-none z-10">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10">
          <BananaLeafBottomRight />
        </div>

        {/* Top Right Golden Parasol / Umbrella */}
        <div className="absolute top-0 -right-8 sm:top-2 sm:-right-8 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform -rotate-[32deg]" />
        </div>

        {/* Bottom Left Golden Parasol / Umbrella */}
        <div className="absolute bottom-0 -left-10 sm:bottom-2 sm:-left-8 md:bottom-4 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform rotate-[35deg]" />
        </div>

        {/* Bottom Corner Golden Nilavilakku Brass Oil Lamps */}
        <div className="absolute bottom-3 left-4 sm:left-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>
        <div className="absolute bottom-3 right-4 sm:right-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>

        {/* Center Card Content inside Mandala */}
        <div className={`relative z-30 w-full max-w-[320px] sm:max-w-[400px] aspect-square flex flex-col items-center justify-center text-center mx-auto my-auto p-4 sm:p-6 transition-all duration-700 ${isOpening ? 'scale-125 opacity-0 blur-md' : 'scale-100 opacity-100'}`}>

          {/* Golden Ganesha Line Icon */}
          <div className="mb-2">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-9 h-9 sm:w-12 sm:h-12 object-contain mx-auto filter drop-shadow-sm" />
          </div>

          <p className="text-[#1E333C] text-[9px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-2 opacity-90 leading-tight font-playfair">
            {quoteText}
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#1C3A35] mb-2 font-script-vibes whitespace-nowrap drop-shadow-sm px-2">
            {groomName} & {brideName}
          </h1>

          {/* Teal Line Flourish with Center Dot above Date */}
          <div className="flex items-center justify-center gap-2 my-1.5 opacity-85">
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#2D7A60]"></div>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#2D7A60]"></div>
          </div>

          <p className="text-[#1C3A35] text-xs sm:text-base font-bold tracking-wider my-0.5 font-playfair">
            {monthStr} {dayNum}, {yearStr}
          </p>

          {/* Teal Line Flourish with Center Dot below Date */}
          <div className="flex items-center justify-center gap-2 my-1.5 opacity-85">
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#2D7A60]"></div>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#2D7A60]"></div>
          </div>

          {/* Golden Bride Saree Drapery Flourish */}
          <BrideSareeFlourish />

        </div>

        {/* OPEN INVITATION BUTTON (Positioned below center) */}
        <div className={`relative z-40 mb-8 sm:mb-12 flex-shrink-0 transition-all duration-700 ${isOpening ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}>
          <button
            onClick={handleOpen}
            className="group relative overflow-hidden bg-gradient-to-r from-[#1C3A35] to-[#2D7A60] hover:from-[#122623] hover:to-[#1C3A35] text-amber-300 font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3.5 md:px-12 md:py-4 rounded-full shadow-[0_10px_30px_rgba(28,58,53,0.4)] transition-all hover:scale-105 active:scale-95 border-2 border-[#D4AF37] cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              {isOpening ? 'Opening...' : 'Open Invitation'}
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#1C3A35] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-[#D4AF37]/30">
        <h2 className="text-2xl font-script-vibes mb-2 text-amber-300">{coupleNamesStr}</h2>
        <p className="text-teal-200/70 text-xs tracking-widest uppercase mb-2">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
