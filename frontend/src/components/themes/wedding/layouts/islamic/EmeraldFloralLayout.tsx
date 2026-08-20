import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

// Ornate Vector Maroon Mandala Corner Ornament (Top Right & Bottom Left - Exact Match to Reference Design)
const MaroonMandalaCorner = ({ position }: { position: 'top-right' | 'bottom-left' }) => {
  const isTopRight = position === 'top-right';
  return (
    <img
      src="/media/maroon_mandala_corner.png"
      alt=""
      className={`absolute ${isTopRight ? 'top-0 right-0' : 'bottom-0 left-0 -scale-100'} w-36 sm:w-52 h-36 sm:h-52 pointer-events-none z-10 mix-blend-multiply opacity-95 object-contain`}
    />
  );
};

// Royal Islamic Envelope Opening Overlay Component
const RoyalEnvelopeOverlay = ({
  groomName,
  brideName,
  isOpen,
  isOpening,
  onOpen
}: {
  groomName: string;
  brideName: string;
  isOpen: boolean;
  isOpening: boolean;
  onOpen: (e: React.MouseEvent) => void;
}) => {
  if (isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2B0609]/90 backdrop-blur-md p-4 transition-opacity duration-700 ${isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

      {/* Royal Envelope Card Container */}
      <div className={`relative w-full max-w-sm sm:max-w-md bg-[#6B0D15] border-2 border-[#C69B31]/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-between min-h-[380px] sm:min-h-[440px] overflow-hidden transition-all duration-700 transform ${isOpening ? 'scale-110 -translate-y-12' : 'scale-100'}`}>

        {/* Envelope Top Flap Decorative Ornament */}
        <div className="absolute top-0 inset-x-0 h-28 bg-[#540910] border-b-2 border-[#C69B31]/50 clip-path-triangle flex items-center justify-center">
          <img src="/media/maroon_mandala_corner.png" alt="" className="w-24 h-24 mix-blend-multiply opacity-40 rotate-45 pointer-events-none" />
        </div>

        {/* Bismillah Header */}
        <div className="relative z-20 mt-8">
          <p className="font-serif text-[#F3E5AB] text-2xl sm:text-3xl font-bold tracking-widest select-none drop-shadow" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>

        {/* Couple Names */}
        <div className="relative z-20 my-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide">
            {groomName}
          </h2>
          <p className="font-serif italic text-sm text-[#C69B31] my-0.5 font-bold">&</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide">
            {brideName}
          </h2>
        </div>

        {/* Interactive Gold Wax Seal Button */}
        <div className="relative z-20 my-2 flex flex-col items-center">
          <button
            onClick={onOpen}
            className="group relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#8B6508] via-[#D4AF37] to-[#F9E8A2] p-1 shadow-2xl border-4 border-[#540910] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {/* Pulsing Outer Glow Ring */}
            <span className="absolute -inset-2 rounded-full bg-[#D4AF37]/30 animate-ping pointer-events-none"></span>

            <div className="w-full h-full rounded-full bg-[#7A0C16] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-center shadow-inner">
              <span className="font-serif text-amber-200 text-xs sm:text-sm font-bold tracking-widest">
                OPEN
              </span>
              <Sparkles size={14} className="text-[#D4AF37] mt-0.5 animate-pulse" />
            </div>
          </button>

          <p className="mt-4 font-serif italic text-xs text-amber-200/90 font-semibold tracking-widest animate-bounce">
            Click to Open Invitation
          </p>
        </div>

      </div>

    </div>
  );
};

export default function EmeraldFloralLayout({ content, website }: WeddingLayoutProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Royal Envelope State
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);

  const handleOpenEnvelope = (e: React.MouseEvent) => {
    setIsEnvelopeOpening(true);
    triggerConfettiPopper(e);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    }
    setTimeout(() => {
      setIsEnvelopeOpen(true);
      setIsEnvelopeOpening(false);
    }, 700);
  };

  // Global Live Multi-Click Heart Wish State
  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  // Poll global wish count every 4s for real-time live sync across all devices
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

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const rawTitle = content?.hero_title;
  const titleParts = (rawTitle && rawTitle.trim() !== '') ? rawTitle.split(/&| and /i) : [];
  const groomName = titleParts[0]?.trim() || 'Muntasir Safwat';
  const brideName = titleParts[1]?.trim() ?? 'Malika Sibal';
  const coupleNamesStr = brideName ? `${groomName} & ${brideName}` : groomName;

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "With the blessings of Allah we are delighted to invite you to the Nikkah ceremony of:";

  const parentsTitle = content?.settings_json?.wedding?.parentsTitle || "Mr. & Mrs. Safwat Abdul-Karim";
  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || '';
  const rawTimeVal = content?.settings_json?.wedding?.time || content?.time || '2: 00 AM';
  const parsedDate = new Date(rawDateStr);
  const isInvalidDate = isNaN(parsedDate.getTime());

  const monthStr = (content?.settings_json?.wedding?.dateMonth || (isInvalidDate ? 'NOVEMBER' : parsedDate.toLocaleString('en-US', { month: 'long' }))).toUpperCase();
  const dayNum = content?.settings_json?.wedding?.dateDay || (isInvalidDate ? '23' : parsedDate.getDate());
  const dayName = (content?.settings_json?.wedding?.dateWeekday || (isInvalidDate ? 'MONDAY' : parsedDate.toLocaleString('en-US', { weekday: 'long' }))).toUpperCase();
  const yearStr = content?.settings_json?.wedding?.dateYear || (isInvalidDate ? '2008' : parsedDate.getFullYear());
  const formattedTimeStr = rawTimeVal.toUpperCase().startsWith('AT') ? rawTimeVal.toUpperCase() : `AT ${rawTimeVal.toUpperCase()}`;

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Add your Venue here";

  const groomParents = content?.settings_json?.wedding?.groomParents || "Groom's Family";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Bride's Family";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { event: "Event Name", time: "05:00 Pm" },
      { event: "Departure", time: "06:00 Pm" },
      { event: "Dinner", time: "08:00 Pm" }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "Ziad Labeeb Deeb\n+00 123 456 789";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "In the name of ALLAH, the Most Merciful and the Most Beneficent — You're invited to the wedding of their beloved son and daughter.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Sacred Islamic Wedding";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2025-01-20T17:00";
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
    { id: 'about', label: 'Family Details', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule & Events', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes & Blessings', visible: true },
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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-center items-center text-center p-6 sm:p-10 overflow-hidden bg-[#F7F2E8] text-[#7A0C16]">

        {/* Top-Right Maroon Arabesque Mandala Corner */}
        <MaroonMandalaCorner position="top-right" />

        {/* Bottom-Left Maroon Arabesque Mandala Corner */}
        <MaroonMandalaCorner position="bottom-left" />

        {/* Full-width Centered Invitation Content */}
        <div className="relative z-20 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center my-auto px-4 py-8">

          {/* Bismillah Calligraphy Header */}
          <div className="relative z-20 mb-3 sm:mb-4">
            <p className="font-serif text-[#7A0C16] text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest select-none leading-relaxed" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>

          {/* Nikkah Invitation Subtitle */}
          <p className="relative z-20 font-serif italic text-xs sm:text-sm md:text-base text-[#7A0C16] font-semibold tracking-wide my-2 sm:my-3 max-w-xs sm:max-w-md leading-relaxed text-center">
            {quoteText}
          </p>

          {/* Groom Name */}
          <h1 className="relative z-20 font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#7A0C16] tracking-wide my-1 sm:my-2 whitespace-nowrap drop-shadow-sm">
            {groomName}
          </h1>

          {/* & Divider */}
          <p className="relative z-20 font-serif italic text-lg sm:text-2xl text-[#7A0C16] my-1 font-bold">
            &
          </p>

          {/* Bride Name */}
          <h1 className="relative z-20 font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#7A0C16] tracking-wide mb-6 sm:mb-8 whitespace-nowrap drop-shadow-sm">
            {brideName}
          </h1>

          {/* Date Breakdown Block */}
          <div className="relative z-20 flex flex-col items-center my-2 sm:my-4 text-[#7A0C16] font-serif">
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] uppercase mb-2">{monthStr}</span>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase">{dayName}</span>
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold px-3 sm:px-4 border-x-2 border-[#7A0C16]/30">{dayNum}</span>
              <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase">{formattedTimeStr}</span>
            </div>
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] mt-2">{yearStr}</span>
          </div>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7A0C16] font-serif tracking-wide">Family Details</h2>
          <div className="h-[2px] w-16 bg-[#7A0C16]/40 mx-auto mt-2"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Groom */}
          <div className="bg-[#F7F2E8] rounded-3xl p-8 text-center shadow-xl border border-[#7A0C16]/20">
            {groomPhoto ? (
              <img src={groomPhoto} alt={groomName} className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-[#7A0C16] mb-4 shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#7A0C16]/10 text-[#7A0C16] flex items-center justify-center mx-auto mb-4 font-serif text-3xl font-bold border-2 border-[#7A0C16]/30">
                {groomName[0]}
              </div>
            )}
            <h3 className="text-2xl font-bold text-[#7A0C16] font-serif mb-1">{groomName}</h3>
            <p className="text-xs font-bold text-[#7A0C16]/70 uppercase tracking-widest mb-3 font-serif">The Groom</p>
            <p className="text-xs text-[#7A0C16] font-serif italic">Beloved Son of</p>
            <p className="text-sm font-semibold text-[#7A0C16] font-serif mt-1">{groomParents}</p>
          </div>

          {/* Bride */}
          <div className="bg-[#F7F2E8] rounded-3xl p-8 text-center shadow-xl border border-[#7A0C16]/20">
            {bridePhoto ? (
              <img src={bridePhoto} alt={brideName} className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-[#7A0C16] mb-4 shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#7A0C16]/10 text-[#7A0C16] flex items-center justify-center mx-auto mb-4 font-serif text-3xl font-bold border-2 border-[#7A0C16]/30">
                {brideName[0]}
              </div>
            )}
            <h3 className="text-2xl font-bold text-[#7A0C16] font-serif mb-1">{brideName}</h3>
            <p className="text-xs font-bold text-[#7A0C16]/70 uppercase tracking-widest mb-3 font-serif">The Bride</p>
            <p className="text-xs text-[#7A0C16] font-serif italic">Beloved Daughter of</p>
            <p className="text-sm font-semibold text-[#7A0C16] font-serif mt-1">{brideParents}</p>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-16 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center">
        <div className="bg-[#F7F2E8] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[#7A0C16]/20 relative overflow-hidden">
          <Sparkles className="w-8 h-8 text-[#7A0C16] mx-auto mb-4 opacity-75" />
          <h2 className="text-3xl font-bold text-[#7A0C16] font-serif mb-4">{storyTitle}</h2>
          <div className="h-[2px] w-16 bg-[#7A0C16]/30 mx-auto mb-6"></div>
          <p className="text-[#7A0C16] font-serif leading-relaxed text-sm md:text-base italic max-w-xl mx-auto">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7A0C16] font-serif tracking-wide">Schedule & Events</h2>
          <div className="h-[2px] w-16 bg-[#7A0C16]/40 mx-auto mt-2"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#F7F2E8] rounded-3xl p-6 shadow-xl border border-[#7A0C16]/20 flex flex-col justify-between text-center">
              <div>
                <span className="text-xs font-bold text-[#7A0C16] uppercase tracking-widest block mb-2 font-serif">{item.time}</span>
                <h3 className="text-xl font-bold text-[#7A0C16] font-serif mb-2">{item.event}</h3>
                <p className="text-xs text-[#7A0C16]/80 font-serif mb-1">{rawDateStr}</p>
                <p className="text-xs text-[#7A0C16] font-serif font-medium">{location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7A0C16] font-serif tracking-wide">Venue & Location</h2>
          <div className="h-[2px] w-16 bg-[#7A0C16]/40 mx-auto mt-2"></div>
        </div>

        <div className="bg-[#F7F2E8] rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-[#7A0C16]/20 max-w-3xl mx-auto text-center space-y-6">
          {venuePhoto && (
            <img src={venuePhoto} alt="Venue" className="w-full h-56 md:h-64 object-cover rounded-2xl border border-[#7A0C16]/20 shadow-md mb-6" />
          )}

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#7A0C16] font-serif">Wedding Reception & Nikkah Venue</h3>
            <p className="text-sm text-[#7A0C16] font-serif max-w-md mx-auto">{location}</p>
            <p className="text-xs font-semibold text-[#7A0C16] font-serif pt-2 whitespace-pre-line">{contactNumbers}</p>
          </div>

          {mapUrl && (
            <div className="pt-2">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#7A0C16] hover:bg-[#600911] text-white font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-105"
              >
                <Navigation size={14} />
                Get Driving Directions
              </a>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: (
      <section key="gallery" className="py-16 px-4 sm:px-6 relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7A0C16] font-serif tracking-wide">Precious Moments</h2>
          <div className="h-[2px] w-16 bg-[#7A0C16]/40 mx-auto mt-2"></div>
        </div>

        {validGallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {validGallery.map((imgUrl: string, idx: number) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-[#7A0C16]/20 hover:scale-105 transition-transform duration-300 bg-[#F7F2E8]">
                <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#F7F2E8] rounded-3xl p-8 text-center text-[#7A0C16]/70 font-serif max-w-md mx-auto shadow-md">
            Photo gallery will be uploaded soon.
          </div>
        )}
      </section>
    ),
    countdown: (
      <section key="countdown" className="py-12 sm:py-16 px-3 sm:px-6 relative z-10 w-full max-w-2xl mx-auto text-center">
        <div className="bg-[#F7F2E8] rounded-3xl p-5 sm:p-8 shadow-xl border border-[#7A0C16]/20 mx-auto w-full">
          <h2 className="text-xl sm:text-3xl font-bold text-[#7A0C16] font-serif mb-1">Counting Down To The Big Day</h2>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7A0C16] font-bold font-serif mb-6">Sacred Nikkah Ceremony</p>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center max-w-xs sm:max-w-md mx-auto">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div className="w-full aspect-square max-w-[60px] sm:max-w-[72px] rounded-xl sm:rounded-2xl bg-[#7A0C16]/10 flex items-center justify-center mb-1.5 shadow-inner border border-[#7A0C16]/20 mx-auto">
                  <span className="text-base sm:text-2xl font-bold text-[#7A0C16] font-serif">{item.value}</span>
                </div>
                <span className="text-[9px] sm:text-xs tracking-widest uppercase font-bold text-[#7A0C16]/80 font-serif">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-16 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto">
        <div className="text-center relative z-20">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#7A0C16]/60"></div>
              <Sparkles className="w-5 h-5 text-[#7A0C16] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#7A0C16]/60"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#7A0C16] font-serif tracking-wide">Send Your Blessings</h2>
            <p className="text-[#7A0C16]/80 tracking-widest uppercase text-xs font-semibold mt-1 font-serif">Tap the heart to send du'as & love to the couple</p>
          </div>

          <div className="bg-[#F7F2E8] rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-[#7A0C16]/20 relative overflow-hidden flex flex-col items-center justify-center text-[#7A0C16]">
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-[#7A0C16]/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-[#7A0C16] border-4 border-[#7A0C16]/20 flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-[#7A0C16]/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a blessing!"
            >
              <Heart className={`w-12 h-12 fill-rose-400 text-rose-400 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#7A0C16] font-serif block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-700' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-[#7A0C16]/70 uppercase tracking-widest font-serif mt-1">Sacred Blessings Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#7A0C16] hover:bg-[#600911] text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-serif border border-white/30 relative z-20"
            >
              <Sparkles className="w-4 h-4 text-white" />
              Tap to Send Wish & Blessing ❤️
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#7A0C16] font-serif tracking-wide">Will You Join Us?</h2>
            <p className="text-[#7A0C16]/80 tracking-widest uppercase text-xs font-semibold mt-1 font-serif">Please let us know if you can attend</p>
          </div>

          <div className="bg-[#F7F2E8] rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-[#7A0C16]/20 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#7A0C16] mb-2 font-serif">Name</label>
                  <input type="text" className="w-full bg-white border border-[#7A0C16]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7A0C16] transition-all font-serif" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#7A0C16] mb-2 font-serif">Du'as & Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-white border border-[#7A0C16]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7A0C16] transition-all font-serif resize-none" placeholder="Share your warm du'as and wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#7A0C16] mb-3 font-serif">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#7A0C16]/30 hover:border-[#7A0C16] bg-white rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#7A0C16]" />
                      <span className="text-[#7A0C16] font-bold uppercase tracking-widest text-xs font-serif">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#7A0C16]/30 hover:border-[#7A0C16] bg-white rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#7A0C16]" />
                      <span className="text-[#7A0C16] font-bold uppercase tracking-widest text-xs font-serif">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7A0C16] hover:bg-[#600911] text-white font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer font-serif">
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
    <div className="min-h-screen bg-[#F5EFE6] relative font-serif flex flex-col items-center overflow-hidden w-full text-[#7A0C16]">
      {/* Audio Player */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* Royal Envelope Opening Overlay */}
      <RoyalEnvelopeOverlay
        groomName={groomName}
        brideName={brideName}
        isOpen={isEnvelopeOpen}
        isOpening={isEnvelopeOpening}
        onOpen={handleOpenEnvelope}
      />

      {/* Re-open Envelope Button */}
      {isEnvelopeOpen && (
        <button
          onClick={() => setIsEnvelopeOpen(false)}
          className="fixed top-4 right-4 z-40 px-3.5 py-1.5 rounded-full bg-[#7A0C16] text-amber-100 text-xs font-serif shadow-2xl border border-amber-200/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles size={13} className="text-[#D4AF37]" /> Envelope
        </button>
      )}

      {/* Floating Audio Control Floating Button */}
      {musicUrl && (
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.play();
                setIsMuted(false);
              } else {
                audioRef.current.pause();
                setIsMuted(true);
              }
            }
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#7A0C16] text-white shadow-2xl border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-bounce" />}
        </button>
      )}

      {/* Main Page Layout Renderer */}
      <main className="w-full relative z-20 flex flex-col items-center">
        {sections.map((section: any) => {
          if (!section.visible) return null;
          return sectionMap[section.id] || null;
        })}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[#7A0C16]/80 text-xs font-serif border-t border-[#7A0C16]/20 relative z-20 bg-[#EFE8DC]">
        <p className="font-bold tracking-widest text-[#7A0C16]">{coupleNamesStr}</p>
        <p className="mt-1 opacity-75">MADE WITH LOVE BY JAALAM</p>
      </footer>
    </div>
  );
}
