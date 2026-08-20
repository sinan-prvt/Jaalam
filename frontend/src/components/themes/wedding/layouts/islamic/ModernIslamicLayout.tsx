import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ModernIslamicLayout({ content, website }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Multi-Click Heart Wish State with Party Confetti Popper
  const [wishCount, setWishCount] = useState<number>(() => {
    const saved = localStorage.getItem(`wishes_count_${website?.slug || content?.id || 'wedding'}`);
    return saved ? parseInt(saved, 10) : 48;
  });
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  const handleTapWish = (e?: React.MouseEvent) => {
    const newCount = wishCount + 1;
    setWishCount(newCount);
    localStorage.setItem(`wishes_count_${website?.slug || content?.id || 'wedding'}`, newCount.toString());

    setIsCounterPopping(true);
    setPulseRing(true);
    setTimeout(() => setIsCounterPopping(false), 300);
    setTimeout(() => setPulseRing(false), 600);

    triggerConfettiPopper(e);
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

  const coupleNamesStr = content?.hero_title || 'Ameer & Bushra';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Ameer';
  const brideName = nameParts[1]?.trim() || 'Bushra';

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || '10 MARCH 2024';
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '5:00 PM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Palace Hall, City Center";

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Rahman";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Khan";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "5:00 PM", event: "Nikkah Ceremony", date: rawDateStr, venue: location },
      { time: "7:30 PM", event: "Walima Reception", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP TO GROOM'S DAD | 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "And We created you in pairs. (Surah An-Naba 78:8) — Solicit your du'as and blessings as we unite in holy matrimony under Allah's guidance.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Sacred Nikkah Union";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-10T17:00";
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

  // Parse Month, Day Number, Day Name, Year from date string
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'MARCH');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? dateObj.getDate() : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'MONDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? dateObj.getFullYear() : '2024');

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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-between text-center bg-cover bg-top bg-no-repeat p-0 overflow-hidden" style={{ backgroundImage: "url('/media/modern_islamic_arch_bg.png')" }}>

        {/* Animated Falling Petals Effect */}
        <style>{`
          @keyframes petalFall {
            0% {
              transform: translateY(-5vh) rotate(0deg) translateX(0px);
              opacity: 0;
            }
            15% {
              opacity: 0.85;
            }
            85% {
              opacity: 0.85;
            }
            100% {
              transform: translateY(105vh) rotate(360deg) translateX(35px);
              opacity: 0;
            }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(14)].map((_, i) => {
            const isLeaf = i % 3 === 0;
            const leftPos = (i * 7 + 4) % 94;
            const delay = (i * 0.6) % 5;
            const duration = 7 + (i % 6);
            const size = 14 + (i % 4) * 4;

            return (
              <div
                key={i}
                className="absolute top-[-5%]"
                style={{
                  left: `${leftPos}%`,
                  animation: `petalFall ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                {isLeaf ? (
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="#946B5C" className="opacity-50 rotate-45">
                    <path d="M17,8C8,10 5,16 3,21C8,20 15,18 19,10C20,8 19,7 17,8Z" />
                  </svg>
                ) : (
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E8C3B9" className="opacity-70 drop-shadow-sm">
                    <path d="M12,2 C15,5 19,8 19,13 C19,17.5 15.5,21 12,21 C8.5,21 5,17.5 5,13 C5,8 9,5 12,2 Z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Top Calligraphy & Nikkah Invitation Block (Exact Match to Reference Image 2) */}
        <div className="relative z-20 pt-20 sm:pt-24 md:pt-28 max-w-sm sm:max-w-md mx-auto flex flex-col items-center px-4 pb-12">

          {/* Gold Quranic Calligraphy: Surah An-Naba 78:8 */}
          <div className="mb-3 text-[#C69B31] font-serif">
            <span className="text-3xl sm:text-5xl tracking-wide font-bold block drop-shadow-sm" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
              وَخَلَقْنَاكُمْ أَزْوَاجًا
            </span>
          </div>

          <p className="text-[#5A504B] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase max-w-xs sm:max-w-md mx-auto mb-4 leading-relaxed font-sans">
            {content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "TOGETHER WITH OUR FAMILIES, WE REQUEST THE HONOUR OF YOUR PRESENCE AT THE"}
          </p>

          {/* Nikkah Uniting Calligraphy */}
          <h1 className="text-5xl sm:text-7xl font-serif italic text-[#C69B31] my-1 tracking-wide drop-shadow-sm">
            Nikkah
          </h1>
          <p className="text-[10px] sm:text-xs font-bold text-[#5A504B] uppercase tracking-[0.3em] mb-4 font-sans">
            UNITING
          </p>

          {/* Groom & Bride Names in Signature Script */}
          <h2 className="text-4xl sm:text-6xl font-serif italic text-[#2B2523] my-0.5 tracking-wide drop-shadow-sm">
            {groomName}
          </h2>

          <p className="text-xl sm:text-2xl text-[#6B5A53] font-serif italic my-0.5 font-light">with</p>

          <h2 className="text-4xl sm:text-6xl font-serif italic text-[#2B2523] my-0.5 tracking-wide drop-shadow-sm">
            {brideName}
          </h2>

          <p className="text-[11px] sm:text-xs font-bold text-[#6B5A53] tracking-[0.25em] uppercase mt-3 mb-6 font-sans">
            INSHA'ALLAH
          </p>

          {/* Date Breakdown Block */}
          <div className="flex flex-col items-center my-3 text-[#2B2523]">
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase font-sans mb-2 text-[#5A504B]">{monthStr}</span>
            <div className="flex items-center justify-center gap-4 text-[#2B2523]">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-sans">{dayName}</span>
              <span className="text-3xl sm:text-5xl font-bold font-serif px-3 border-x-2 border-[#2B2523]/30">{dayNum}</span>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-sans">AT {timeStr}</span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] font-sans mt-2 text-[#5A504B]">{yearStr}</span>
          </div>

          {/* Venue Location */}
          <p className="text-[#2B2523] text-sm sm:text-base font-bold tracking-wide mt-4 font-serif">
            {location}
          </p>

          {/* RSVP Line */}
          <p className="text-[#6B5A53] text-[11px] font-semibold tracking-widest uppercase font-sans mt-3">
            {contactNumbers.includes('RSVP') ? contactNumbers : `RSVP TO ${contactNumbers}`}
          </p>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FAF6F3] via-[#F3EBE6] to-[#FAF6F3] text-[#2B2523]">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-[#D4C3B9]/80 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">

          <div className="flex flex-col items-center mb-6 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
              <Sparkles size={16} className="text-[#C69B31] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2523] tracking-wide font-serif">FAMILY & BLESSINGS</h2>
            <p className="text-[#6B5A53] text-xs sm:text-sm italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-2 font-serif">
              solicit your du'as & request the honour of your presence to grace the auspicious occasion of the Nikkah & Walima
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-[#FAF6F3] p-6 rounded-2xl border border-[#E8D9CF] flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#F3EBE6] border border-[#D4C3B9] flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-[#E8C3B9] animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#2B2523] mb-1 font-serif">{groomName}</h3>
              <p className="text-xs text-[#8C7A71] font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              <p className="text-xs text-slate-600 font-serif">{groomParents}</p>
            </div>

            {/* Bride Card */}
            <div className="bg-[#FAF6F3] p-6 rounded-2xl border border-[#E8D9CF] flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#F3EBE6] border border-[#D4C3B9] flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-[#E8C3B9] animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#2B2523] mb-1 font-serif">{brideName}</h3>
              <p className="text-xs text-[#8C7A71] font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              <p className="text-xs text-slate-600 font-serif">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#F3EBE6] via-[#FAF6F3] to-[#F3EBE6]">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-[#D4C3B9]/80 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
              <Sparkles className="w-7 h-7 text-[#C69B31] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2523] mb-6 font-serif tracking-wide">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed font-serif">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FAF6F3] via-[#F3EBE6] to-[#FAF6F3]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#C69B31]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2B2523] font-serif tracking-wide">Schedule & Events</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-[#C69B31] text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-[#E8D9CF] relative overflow-hidden">
              <h3 className="text-2xl font-bold text-[#2B2523] mb-3 font-serif relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#6B5A53] font-serif relative z-20">
                <Calendar className="w-5 h-5 text-[#C69B31]" />
                <span className="font-semibold">{item.date || rawDateStr}</span>
              </div>
              <p className="text-[#C69B31] font-bold text-lg mb-2 font-serif relative z-20">{item.time}</p>
              <p className="text-slate-600 text-sm font-serif relative z-20">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-gradient-to-b from-[#F3EBE6] via-[#FAF6F3] to-[#F3EBE6]">
        <div className="bg-white/95 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border-2 border-[#D4C3B9]/80 relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-16 h-16 bg-[#F3EBE6] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#C69B31]">
              <MapPin className="w-8 h-8 text-[#C69B31] animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-[#2B2523] mb-3 font-serif tracking-wide">Venue & Map</h3>
            <p className="text-xl font-semibold text-slate-800 mb-2 font-serif">{location}</p>
            <p className="text-md text-slate-500 max-w-md mx-auto mb-6 font-serif">We look forward to welcoming you to our sacred Nikkah celebration.</p>

            {/* Venue Image */}
            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-amber-200/50 mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-6 bg-white">
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
                className="inline-flex items-center gap-2 bg-[#2B2523] hover:bg-[#1A1615] text-[#C69B31] px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6 hover:scale-105"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-1 font-sans">RSVP / Contact</p>
                <p className="text-base sm:text-lg font-bold text-slate-800 font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF6F3]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            <Sparkles className="w-5 h-5 text-[#C69B31]" />
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2B2523] font-serif tracking-wide">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500 relative">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-4 sm:px-6 relative z-10 bg-[#2B2523] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-8 text-center border-2 border-[#C69B31]/40">
        <div className="max-w-3xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#C69B31] font-serif">Counting Down To</h2>
          <p className="text-base sm:text-lg italic mb-8 text-rose-100 font-serif">Our Modern Nikkah Celebration</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20 hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-3xl font-bold text-[#C69B31] font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-rose-200 font-sans">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-gradient-to-b from-[#FBF8F6] via-[#FAF3EE] to-[#FBF8F6]">
        <div className="max-w-md mx-auto text-center relative z-20">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
              <Heart className="w-6 h-6 text-[#C69B31] fill-[#C69B31]/20 animate-pulse" />
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2523] font-serif tracking-wide">Send Your Blessings</h2>
            <p className="text-[#6B5A53] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send love & prayers to the couple</p>
          </div>

          {/* Interactive Wish Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border-2 border-amber-200/80 relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* Pulsing Aura Ring */}
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-amber-400/50 animate-ping"></div>
              </div>
            )}



            {/* Heart Icon Button */}
            <button
              type="button"
              onClick={handleTapWish}
              className={`w-28 h-28 rounded-full bg-gradient-to-br from-amber-50 to-rose-50 border-4 border-amber-200 flex items-center justify-center text-rose-500 shadow-xl hover:shadow-amber-200/60 transition-all duration-300 group cursor-pointer mb-5 relative ${pulseRing ? 'scale-110 border-amber-400 ring-8 ring-amber-200/50' : 'hover:scale-105 active:scale-90'}`}
              title="Tap to send a blessing!"
            >
              <Heart className={`w-14 h-14 fill-rose-500 text-rose-500 transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#2B2523] font-serif block transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-amber-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans mt-1">Blessings & Hearts Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#2B2523] hover:bg-[#1A1615] text-[#C69B31] shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans border border-amber-400/20"
            >
              <Sparkles className="w-4 h-4 text-[#C69B31]" />
              Tap to Send Wish & Blessing ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#F3EBE6]">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
              <Sparkles className="w-5 h-5 text-[#C69B31]" />
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2523] font-serif tracking-wide">Will You Join Us?</h2>
            <p className="text-[#6B5A53] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border-2 border-[#D4C3B9]/80 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-sans">Name</label>
                  <input type="text" className="w-full bg-[#FAF6F3] border border-[#E8D9CF] rounded-xl px-4 py-3 outline-none focus:border-[#C69B31] transition-all font-serif" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-sans">Du'as & Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-[#FAF6F3] border border-[#E8D9CF] rounded-xl px-4 py-3 outline-none focus:border-[#C69B31] transition-all font-serif resize-none" placeholder="Share your warm du'as and wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 font-sans">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8D9CF] hover:border-[#C69B31] bg-[#FAF6F3] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#C69B31]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-sans">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8D9CF] hover:border-[#C69B31] bg-[#FAF6F3] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#C69B31]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-sans">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2B2523] hover:bg-[#1A1615] text-[#C69B31] font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
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
    <div className={`min-h-screen bg-[#FAF6F3] relative font-serif flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#2B2523] text-[#C69B31] shadow-2xl border border-[#C69B31]/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Interactive 3D Pocket Envelope */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1D1A19]/85 backdrop-blur-md transition-all duration-1000 ease-in-out ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} p-4 cursor-pointer`}
      >
        {/* Envelope Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[520px] sm:h-[570px] rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] overflow-hidden bg-[#FAF6F3] border-2 border-[#C69B31]/60 flex flex-col justify-between">

          {/* Card Inside Envelope (Slides UP when opening) */}
          <div className={`absolute inset-3 rounded-xl bg-cover bg-top p-6 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out z-10 ${isOpening ? '-translate-y-20 scale-105 opacity-100' : 'translate-y-0 opacity-90'}`} style={{ backgroundImage: "url('/media/modern_islamic_arch_bg.png')" }}>
            <span className="text-xl sm:text-2xl font-serif text-[#C69B31] font-bold tracking-widest mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
              وَخَلَقْنَاكُمْ أَزْوَاجًا
            </span>
            <p className="text-[#6B5A53] text-[9px] font-bold tracking-[0.2em] uppercase font-sans mb-3">INVITATION TO THE NIKKAH</p>
            <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2B2523] my-1">{groomName} with {brideName}</h2>
            <p className="text-xs font-sans tracking-widest text-[#6B5A53] uppercase mt-2">{rawDateStr}</p>
          </div>

          {/* Top V-Shaped Envelope Flap */}
          <div className={`absolute top-0 inset-x-0 h-[260px] sm:h-[285px] z-20 origin-top transition-all duration-700 ease-in-out ${isOpening ? '-translate-y-full opacity-0' : 'translate-y-0'}`}>
            <svg viewBox="0 0 400 280" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
              <polygon points="0,0 400,0 200,240" fill="#F3EBE6" fillOpacity="0.97" />
              <polyline points="0,0 200,240 400,0" fill="none" stroke="#C69B31" strokeWidth="2.5" strokeOpacity="0.6" />
            </svg>
            <div className="absolute top-8 inset-x-0 text-center">
              <span className="text-xl sm:text-2xl text-[#C69B31] font-serif font-bold tracking-widest drop-shadow-sm" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
                وَخَلَقْنَاكُمْ أَزْوَاجًا
              </span>
            </div>
          </div>

          {/* Left & Right & Bottom Envelope Pocket Folds */}
          <div className="absolute bottom-0 inset-x-0 h-[300px] z-20 pointer-events-none">
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
              <polygon points="0,0 0,300 200,160" fill="#FAF6F3" fillOpacity="0.96" />
              <line x1="0" y1="0" x2="200" y2="160" stroke="#C69B31" strokeWidth="1.5" strokeOpacity="0.3" />
              <polygon points="400,0 400,300 200,160" fill="#F6F0EC" fillOpacity="0.96" />
              <line x1="400" y1="0" x2="200" y2="160" stroke="#C69B31" strokeWidth="1.5" strokeOpacity="0.3" />
              <polygon points="0,300 400,300 200,175" fill="#EDE4DC" fillOpacity="0.98" />
              <polyline points="0,300 200,175 400,300" fill="none" stroke="#C69B31" strokeWidth="2" strokeOpacity="0.5" />
            </svg>
          </div>

          {/* Center Metallic Gold Wax Seal Monogram Emblem */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#FFE89C] via-[#C69B31] to-[#8C6B1C] p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out flex items-center justify-center border-2 border-white/60 pointer-events-auto ${isOpening ? 'scale-150 rotate-45 opacity-0' : 'hover:scale-110 active:scale-95'}`}>
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2B2523] to-[#1A1615] border-2 border-[#FFE89C]/80 flex flex-col items-center justify-center p-2 text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <Sparkles className="w-4 h-4 text-[#C69B31] mb-0.5 animate-pulse" />
                <span className="text-[#FFE89C] text-xl sm:text-2xl font-extrabold font-serif tracking-wider drop-shadow">
                  {groomName[0]} & {brideName[0]}
                </span>
                <span className="text-[8px] sm:text-[9px] text-amber-200 tracking-widest uppercase font-sans mt-0.5 font-bold opacity-90">
                  {isOpening ? 'OPENING...' : 'TAP TO OPEN'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#2B2523] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-[#C69B31]/40">
        <h2 className="text-2xl font-serif mb-2 text-[#C69B31]">{coupleNamesStr}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2 font-sans">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
