import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ElegantGoldenLayout({ content, website }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
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

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || '2030-02-01';
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '7:00 PM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Palace Hall, City Center";

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Rahman";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. Iqbal & Mrs. Shabana";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "07:00 PM", event: "Nikkah Ceremony", date: rawDateStr, venue: location },
      { time: "10:00 PM", event: "Grand Walima Reception", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "And We created you in pairs. (Surah An-Naba 78:8) — Solicit your du'as and blessings as we unite in holy matrimony under Allah's guidance.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Sacred Nikkah Union";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2030-02-01T19:00";
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

  // Parse Month, Day Number, Day Name, Year from date string & custom breakdown inputs
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Feb');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '1');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }) : 'Friday');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2030');

  const getSuffix = (d: string | number) => {
    const num = parseInt(String(d), 10);
    if (isNaN(num)) return '';
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const hasCustomDateFields = Boolean(
    content?.settings_json?.wedding?.dateMonth ||
    content?.settings_json?.wedding?.dateDay ||
    content?.settings_json?.wedding?.dateWeekday ||
    content?.settings_json?.wedding?.dateYear
  );

  const formattedDateLine = hasCustomDateFields
    ? `${dayName}, ${dayNum}${getSuffix(dayNum)} of ${monthStr} ${yearStr}`
    : (isDateValid
        ? `${dateObj.toLocaleString('en-US', { weekday: 'long' })}, ${dateObj.getDate()}${getSuffix(dateObj.getDate())} of ${dateObj.toLocaleString('en-US', { month: 'short' })} ${dateObj.getFullYear()}`
        : 'Friday, 1st of Feb 2030');

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "In the name of Allah, the most Gracious, the most Merciful";

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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-between items-center text-center bg-cover bg-center bg-no-repeat p-0 overflow-hidden" style={{ backgroundImage: "url('/media/elegant_golden_nikkah_bg.png')" }}>

        {/* Soft Shimmer Sparkle Effect */}
        <style>{`
          @keyframes softLanternGlow {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(251,191,36,0.5)); }
            50% { filter: drop-shadow(0 0 25px rgba(251,191,36,0.9)); }
          }
        `}</style>

        {/* Hero Card Text Block */}
        <div className="relative z-20 pt-20 sm:pt-24 md:pt-28 max-w-xs sm:max-w-md mx-auto flex flex-col items-center px-4 pb-2">

          {/* Bismillah Calligraphy */}
          <div className="mb-2 text-[#4A2E2B] font-serif">
            <span className="text-2xl sm:text-4xl tracking-wide font-bold block drop-shadow-sm" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
            </span>
          </div>

          <p className="text-[#6E4B3C] text-[10px] sm:text-xs font-semibold italic tracking-wide max-w-xs sm:max-w-md mx-auto mb-2 font-serif">
            {quoteText}
          </p>

          {/* Diamond Flourish Divider */}
          <div className="flex items-center justify-center gap-2 my-1 text-[#A67B5B] opacity-80">
            <span className="h-[1px] w-6 bg-[#A67B5B]"></span>
            <span className="rotate-45 w-1.5 h-1.5 border border-[#A67B5B] bg-[#A67B5B]"></span>
            <span className="h-[1px] w-6 bg-[#A67B5B]"></span>
          </div>

          {/* Groom & Bride Names in Elegant Cursive Font */}
          <h2 className="text-3xl sm:text-5xl font-serif italic text-[#4A2E2B] my-0.5 tracking-wide drop-shadow-sm font-bold">
            {groomName}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#8C6551] font-serif italic mb-0.5 font-medium">(S/o {groomParents})</p>

          <p className="text-xs sm:text-sm text-[#8C6551] font-serif italic my-0.5 font-light">with</p>

          <h2 className="text-3xl sm:text-5xl font-serif italic text-[#4A2E2B] my-0.5 tracking-wide drop-shadow-sm font-bold">
            {brideName}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#8C6551] font-serif italic mb-2 font-medium">(D/o {brideParents})</p>

        </div>

        {/* Spacing for bottom artwork (Bride & Groom + Taj Mahal) */}
        <div className="pb-52 sm:pb-64 md:pb-72" />

      </section>
    ),
    about: (
      <section key="about" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FAF0F2] via-[#FFF5F7] to-[#FAF0F2] text-[#4A2E2B]">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-rose-200/80 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">

          <div className="flex flex-col items-center mb-6 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
              <Sparkles size={16} className="text-[#C69B31] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A2E2B] tracking-wide font-serif">FAMILY BLESSINGS & INVITATION</h2>
            <p className="text-[#6E4B3C] text-xs sm:text-sm italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-2 font-serif">
              solicit your du'as & request the honour of your presence to grace the auspicious occasion of the Nikkah & Walima
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Bride Card */}
            <div className="bg-[#FFF5F7] p-6 rounded-2xl border border-rose-200 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-rose-300 animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#4A2E2B] mb-1 font-serif">{brideName}</h3>
              <p className="text-xs text-[#8C6551] font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              <p className="text-xs text-slate-600 font-serif">Daughter of {brideParents}</p>
            </div>

            {/* Groom Card */}
            <div className="bg-[#FFF5F7] p-6 rounded-2xl border border-rose-200 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-rose-300 animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#4A2E2B] mb-1 font-serif">{groomName}</h3>
              <p className="text-xs text-[#8C6551] font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              <p className="text-xs text-slate-600 font-serif">Son of {groomParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FFF5F7] via-[#FAF0F2] to-[#FFF5F7]">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-rose-200/80 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
              <Sparkles className="w-7 h-7 text-[#C69B31] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A2E2B] mb-6 font-serif tracking-wide">
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
      <section key="schedule" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#FAF0F2] via-[#FFF5F7] to-[#FAF0F2]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#C69B31]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A2E2B] font-serif tracking-wide">Schedule & Nikkah Events</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-[#C69B31] text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-rose-200 relative overflow-hidden">
              <h3 className="text-2xl font-bold text-[#4A2E2B] mb-3 font-serif relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#6E4B3C] font-serif relative z-20">
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
      <section key="venue" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-gradient-to-b from-[#FFF5F7] via-[#FAF0F2] to-[#FFF5F7]">
        <div className="bg-white/95 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border-2 border-rose-200/80 relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#C69B31]">
              <MapPin className="w-8 h-8 text-[#C69B31] animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-[#4A2E2B] mb-3 font-serif tracking-wide">Venue & Map</h3>
            <p className="text-xl font-semibold text-slate-800 mb-2 font-serif">{location}</p>
            <p className="text-md text-slate-500 max-w-md mx-auto mb-6 font-serif">We look forward to welcoming you to our sacred Nikkah celebration.</p>

            {/* Venue Image */}
            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-rose-200 mb-6 relative group">
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
                className="inline-flex items-center gap-2 bg-[#4A2E2B] hover:bg-[#34201E] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6 hover:scale-105"
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
      <section key="gallery" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF0F2]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            <Sparkles className="w-5 h-5 text-[#C69B31]" />
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A2E2B] font-serif tracking-wide">Photo Gallery</h2>
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
      <section key="countdown" className="py-16 px-4 sm:px-6 relative z-10 bg-[#4A2E2B] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-8 text-center border-2 border-amber-300/40">
        <div className="max-w-3xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-amber-300 font-serif">Counting Down To</h2>
          <p className="text-base sm:text-lg italic mb-8 text-rose-100 font-serif">Our Elegant Golden Nikkah</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20 hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-3xl font-bold text-amber-300 font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-rose-200 font-sans">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-16 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto">
        <div className="text-center relative z-20">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
              <Sparkles className="w-5 h-5 text-[#C69B31] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A2E2B] font-serif tracking-wide">Send Your Blessings</h2>
            <p className="text-[#6E4B3C] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send du'as & love to the couple</p>
          </div>

          {/* Clean Glassmorphism Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-xl border-2 border-rose-200/80 relative overflow-hidden flex flex-col items-center justify-center text-slate-800">
            
            {/* Pulsing Aura Ring */}
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-amber-400/40 animate-ping"></div>
              </div>
            )}

            {/* Glowing Royal Heart Medallion Button */}
            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#4A2E2B] to-[#34201E] border-4 border-amber-300 flex items-center justify-center shadow-xl shadow-rose-950/20 transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-amber-300/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a blessing!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            {/* Counter */}
            <div className="flex flex-col items-center mb-6 relative z-20">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#4A2E2B] font-serif block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans mt-1">Sacred Blessings Received</span>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#4A2E2B] hover:bg-[#34201E] text-amber-200 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans border border-amber-300/30 relative z-20"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Tap to Send Wish & Blessing ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#FAF0F2]">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
              <Sparkles className="w-5 h-5 text-[#C69B31]" />
              <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A2E2B] font-serif tracking-wide">Will You Join Us?</h2>
            <p className="text-[#6E4B3C] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border-2 border-rose-200/80 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-sans">Name</label>
                  <input type="text" className="w-full bg-[#FFF5F7] border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-[#4A2E2B] transition-all font-serif text-[#4A2E2B]" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-sans">Du'as & Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-[#FFF5F7] border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-[#4A2E2B] transition-all font-serif text-[#4A2E2B] resize-none" placeholder="Share your warm du'as and wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 font-sans">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-rose-200 hover:border-[#4A2E2B] bg-[#FFF5F7] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#4A2E2B]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-sans">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-rose-200 hover:border-[#4A2E2B] bg-[#FFF5F7] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#4A2E2B]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-sans">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A2E2B] hover:bg-[#34201E] text-amber-200 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
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
    <div className={`min-h-screen bg-[#FAF0F2] relative font-serif flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#4A2E2B] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Interactive Pocket Envelope */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex flex-col justify-between items-center text-center bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} overflow-hidden p-6 sm:p-12 cursor-pointer bg-[#FDF0F2]`}
        style={{ backgroundImage: "url('/media/islamic_cream_envelope_bg.png')" }}
      >

        {/* Top Title Flourish */}
        <div className={`relative z-20 pt-12 sm:pt-16 flex flex-col items-center transition-all duration-500 ${isOpening ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <span className="text-xl sm:text-3xl text-[#4A2E2B] font-serif tracking-widest my-1 font-bold" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
          </span>
        </div>

        {/* Center Gold Wax Seal Monogram Emblem */}
        <div
          className="relative z-20 flex flex-col items-center justify-center my-auto translate-y-6 sm:translate-y-8 group"
        >
          {/* Animated Glow Rings when opening */}
          {isOpening && (
            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-rose-400/40 animate-ping pointer-events-none" />
          )}

          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 p-2 shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition-all duration-700 ease-out flex items-center justify-center border-2 border-amber-200/90 ${isOpening ? 'scale-125 rotate-12 opacity-80' : 'group-hover:scale-110 active:scale-95'}`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#4A2E2B] to-[#34201E] border-2 border-amber-300/80 flex flex-col items-center justify-center p-3 text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Sparkles size={12} className="text-amber-300 animate-pulse" />
                <Heart size={12} className="fill-amber-300 text-amber-300" />
                <Sparkles size={12} className="text-amber-300 animate-pulse" />
              </div>
              <span className="text-amber-300 text-xs sm:text-sm font-extrabold font-serif tracking-widest uppercase drop-shadow leading-tight px-1">
                {groomName.length > 2 && brideName.length > 2 ? `${groomName} & ${brideName}` : 'SACRED NIKKAH'}
              </span>
              <span className="text-[8px] sm:text-[9px] text-amber-200 tracking-[0.2em] uppercase font-serif mt-1 font-bold opacity-90">
                {isOpening ? 'UNSEALING...' : 'TAP TO UNSEAL'}
              </span>

              {/* Sparkles Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300/0 via-amber-200/30 to-amber-300/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>

          <h1 className={`text-2xl sm:text-4xl font-bold text-[#4A2E2B] mt-6 font-serif tracking-wide drop-shadow-sm transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
            {brideName} & {groomName}
          </h1>
          <p className={`text-[#8C6551] text-xs sm:text-sm tracking-widest font-serif uppercase mt-1 transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
            {formattedDateLine}
          </p>
        </div>

        {/* Bottom Spacing */}
        <div className="pb-8 sm:pb-12" />

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#4A2E2B] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-amber-400/30">
        <h2 className="text-2xl font-serif mb-2 text-amber-300">{coupleNamesStr}</h2>
        <p className="text-rose-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
