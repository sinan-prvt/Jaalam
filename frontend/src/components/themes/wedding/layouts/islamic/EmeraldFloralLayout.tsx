import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

// Ornate Vector Maroon Mandala Corner Ornament (Top Right & Bottom Left - Exact Replica of Image 2)
const MaroonMandalaCorner = ({ position }: { position: 'top-right' | 'bottom-left' }) => {
  const isTopRight = position === 'top-right';
  return (
    <div className={`absolute ${isTopRight ? 'top-0 right-0' : 'bottom-0 left-0'} w-44 sm:w-60 h-44 sm:h-60 pointer-events-none z-10 opacity-95 overflow-hidden`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${isTopRight ? '' : 'rotate-180'}`}
      >
        <g stroke="#7A0C16" strokeWidth="1.2">
          {/* Outer Pattern Rings */}
          <circle cx="200" cy="0" r="190" strokeDasharray="3 3" strokeWidth="1.5" />
          <circle cx="200" cy="0" r="175" strokeWidth="2" />
          <circle cx="200" cy="0" r="160" strokeDasharray="4 2" />
          
          {/* Radial Rays & Petal Accents */}
          {[0, 15, 30, 45, 60, 75, 90].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 - 160 * Math.cos(rad);
            const y1 = 160 * Math.sin(rad);
            const x2 = 200 - 190 * Math.cos(rad);
            const y2 = 190 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" />
                <circle cx={x1} cy={y1} r="3" fill="#7A0C16" />
              </g>
            );
          })}

          {/* Middle Decorative Arch Loops */}
          <circle cx="200" cy="0" r="130" strokeWidth="2" />
          <circle cx="200" cy="0" r="110" strokeDasharray="2 2" />

          {[5, 20, 35, 50, 65, 80].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 200 - 120 * Math.cos(rad);
            const cy = 120 * Math.sin(rad);
            return <circle key={i} cx={cx} cy={cy} r="5" fill="#7A0C16" opacity="0.85" />;
          })}

          {/* Inner Medallion Hub */}
          <circle cx="200" cy="0" r="80" strokeWidth="2.5" />
          <circle cx="200" cy="0" r="55" strokeWidth="1.5" fill="#7A0C16" opacity="0.15" />
          <circle cx="200" cy="0" r="30" fill="#7A0C16" />
        </g>
      </svg>
    </div>
  );
};

export default function EmeraldFloralLayout({ content, website }: WeddingLayoutProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
  const isDefaultTitle = !rawTitle || rawTitle === 'A & B' || rawTitle === 'Welcome to A & B' || rawTitle === 'A';
  const groomName = isDefaultTitle ? 'Muntasir Safwat' : (rawTitle.split(/&| and /i)[0]?.trim() || 'Muntasir Safwat');
  const brideName = isDefaultTitle ? 'Malika Sibal' : (rawTitle.split(/&| and /i)[1]?.trim() || 'Malika Sibal');
  const coupleNamesStr = `${groomName} & ${brideName}`;

  const parentsTitle = content?.settings_json?.wedding?.parentsTitle || "Mr. & Mrs. Safwat Abdul-Karim";
  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || 'Friday, 20th January 2023';
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '05:00 Pm';
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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-center items-center p-3 sm:p-6 overflow-hidden bg-[#F5EFE6] text-[#7A0C16]">
        
        {/* Parchment Wedding Invitation Card Container (100% Exact Replica of Image 2) */}
        <div className="w-full max-w-[420px] relative bg-[#F7F2E8] border border-[#7A0C16]/20 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center my-auto overflow-hidden">
          
          {/* Top-Right Maroon Arabesque Mandala Corner */}
          <MaroonMandalaCorner position="top-right" />
          
          {/* Bottom-Left Maroon Arabesque Mandala Corner */}
          <MaroonMandalaCorner position="bottom-left" />

          {/* Bismillah Calligraphy Header */}
          <div className="relative z-20 mt-2 mb-2">
            <p className="font-serif text-[#7A0C16] text-3xl sm:text-4xl font-bold tracking-widest select-none leading-relaxed">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>

          {/* Quranic Subtitle Translation */}
          <p className="relative z-20 font-serif italic text-xs sm:text-sm text-[#7A0C16] font-medium tracking-wide mb-3 max-w-[280px]">
            In the name of ALLAH, the Most Merciful and the Most Beneficent
          </p>

          {/* Parents Line */}
          <h2 className="relative z-20 font-serif text-xl sm:text-2xl font-extrabold text-[#7A0C16] tracking-tight mb-1">
            {parentsTitle}
          </h2>

          {/* Invitation Line */}
          <p className="relative z-20 font-serif italic text-xs sm:text-sm text-[#7A0C16] mb-5">
            You're invited to the wedding of their beloved son/daughter
          </p>

          {/* Groom Name */}
          <h1 className="relative z-20 font-serif text-2xl sm:text-3xl font-bold text-[#7A0C16] tracking-wide">
            {groomName}
          </h1>

          {/* With Divider */}
          <p className="relative z-20 font-serif italic text-xs text-[#7A0C16] my-1 font-semibold">
            - With -
          </p>

          {/* Bride Name */}
          <h1 className="relative z-20 font-serif text-2xl sm:text-3xl font-bold text-[#7A0C16] tracking-wide mb-5">
            {brideName}
          </h1>

          {/* Barat Programme Header */}
          <div className="relative z-20 w-full max-w-[280px] text-center space-y-1 my-2">
            <p className="font-serif italic text-sm font-bold text-[#7A0C16]">
              Barat Programme (In sha Allah)
            </p>
            <p className="font-serif italic text-xs font-semibold text-[#7A0C16]">
              On {rawDateStr}
            </p>

            {/* Dotted Schedule List */}
            <div className="pt-2 space-y-1.5 text-xs font-serif italic text-[#7A0C16] max-w-[240px] mx-auto">
              {schedule.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-baseline border-b border-dotted border-[#7A0C16]/30 pb-0.5">
                  <span>{item.event}</span>
                  <span className="font-semibold">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Section */}
          <div className="relative z-20 mt-4 space-y-0.5">
            <p className="font-serif font-bold text-xs text-[#7A0C16]">Venue:</p>
            <p className="font-serif italic text-xs text-[#7A0C16] max-w-[240px] mx-auto whitespace-pre-line">
              {location}
            </p>
          </div>

          {/* RSVP Section */}
          <div className="relative z-20 mt-4 pt-1">
            <p className="font-serif font-extrabold text-xs tracking-widest text-[#7A0C16] uppercase">R.S.V.P</p>
            <p className="font-serif italic text-xs text-[#7A0C16] whitespace-pre-line mt-0.5">
              {contactNumbers}
            </p>
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
      <section key="countdown" className="py-16 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center">
        <div className="bg-[#F7F2E8] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-[#7A0C16]/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#7A0C16] font-serif mb-2">Counting Down To The Big Day</h2>
          <p className="text-xs uppercase tracking-widest text-[#7A0C16] font-bold font-serif mb-8">Sacred Nikkah Ceremony</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#7A0C16]/10 flex items-center justify-center mb-2 shadow-inner border border-[#7A0C16]/20">
                  <span className="text-xl sm:text-3xl font-bold text-[#7A0C16] font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#7A0C16]/80 font-serif">{item.label}</span>
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
