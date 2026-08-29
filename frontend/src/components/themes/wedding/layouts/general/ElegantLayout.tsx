import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ElegantLayout({ content, website }: WeddingLayoutProps) {
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
  const rawCoupleNames = content?.hero_title || "Alex & Jordan";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "Alex").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "Jordan").toUpperCase();

  const groomWords = groomFullName.split(/\s+/);
  const brideWords = brideFullName.split(/\s+/);

  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, September 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'SEPTEMBER');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Estate, New York";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Holy Wedding Ceremony", date: rawDateStr, venue: fullLocation },
      { time: "5:30 PM", event: "Cocktail Hour & Greetings", date: rawDateStr, venue: fullLocation },
      { time: "7:00 PM", event: "Grand Gala Dinner & Dancing", date: rawDateStr, venue: fullLocation }
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

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2027-03-25T09:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "REQUEST THE HONOR OF YOUR PRESENCE AT THE CELEBRATION OF THEIR MARRIAGE";

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
      <section
        key="hero"
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#090A0D] text-white p-0 overflow-hidden py-14 sm:py-20 min-h-[95vh]"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
          .font-script-alex {
            font-family: 'Alex Brush', 'Great Vibes', cursive, serif;
          }
          .font-cinzel {
            font-family: 'Cinzel', 'Cormorant Garamond', serif;
          }
          .font-garamond {
            font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          }
          @keyframes elegantGoldFloat {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        {/* Ambient Dark Gold Background with Vignetting */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1C1810] via-[#0D0D11] to-[#050507] opacity-90" />

        {/* Floating Gold Sparkle Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(14)].map((_, i) => {
            const leftPos = (i * 7 + 4) % 94;
            const delay = (i * 0.6) % 5;
            const duration = 7 + (i % 6);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF2B2] opacity-60 filter blur-[0.5px]"
                style={{
                  left: `${leftPos}%`,
                  animation: `elegantGoldFloat ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Top Decorative Gold Line */}
        <div className="relative z-20 flex flex-col items-center mb-6">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37]/30" />
          <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse my-2" />
        </div>

        {/* Hero Central Card Block */}
        <div className="relative z-20 max-w-xs sm:max-w-md md:max-w-lg mx-auto flex flex-col items-center px-4 pb-6 font-cinzel">
          
          <p className="text-[#D4AF37] text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase mb-4 drop-shadow">
            THE WEDDING CELEBRATION OF
          </p>

          {/* Groom Name */}
          <div className="flex flex-col items-center leading-none my-1">
            {groomWords.map((word: string, idx: number) => (
              <h1 key={idx} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] my-0.5">
                {word}
              </h1>
            ))}
          </div>

          {/* AND Script Flourish */}
          <span className="text-3xl sm:text-5xl text-[#D4AF37] font-script-alex italic my-2 font-normal drop-shadow">
            and
          </span>

          {/* Bride Name */}
          <div className="flex flex-col items-center leading-none my-1">
            {brideWords.map((word: string, idx: number) => (
              <h1 key={idx} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] my-0.5">
                {word}
              </h1>
            ))}
          </div>

          {/* Diamond Gold Flourish Divider */}
          <div className="flex items-center justify-center gap-3 my-6 text-[#D4AF37]">
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <span className="rotate-45 w-2 h-2 border border-[#D4AF37] bg-[#D4AF37]"></span>
            <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>

          {/* Tagline / Invitation Quote */}
          <p className="text-slate-300 text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase font-medium max-w-xs sm:max-w-md mx-auto mb-6 leading-relaxed">
            {quoteText}
          </p>

          {/* Date & Time Breakdown Box */}
          <div className="relative z-20 bg-[#12131A]/90 border border-[#D4AF37]/40 rounded-2xl px-6 py-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center my-2 text-white">
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-1">
              {monthStr}
            </span>
            <div className="flex items-center justify-center gap-4 my-1">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-300">
                {dayName}
              </span>
              <span className="text-3xl sm:text-4xl font-black px-4 border-x-2 border-[#D4AF37] text-white">
                {dayNum}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-300">
                AT {timeStr.toUpperCase()}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-[#D4AF37] mt-1">
              {yearStr}
            </span>
          </div>

          {/* Venue Line */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-widest mt-6 max-w-xs text-center">
            <MapPin size={15} className="text-[#D4AF37] shrink-0" />
            <span>{fullLocation}</span>
          </div>

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#0B0B0E] text-white font-cinzel">
        <div className="max-w-3xl mx-auto bg-[#121318]/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
              <Sparkles size={18} className="text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">Family Blessings & Invitation</h2>
            <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-2 font-garamond">
              request the honour of your presence to celebrate their wedding union
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-[#181A22] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 flex flex-col items-center hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-300">
              {groomPhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#D4AF37] mb-4 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#20222C] to-[#121318] border-2 border-[#D4AF37] flex flex-col items-center justify-center mb-4 shadow-md text-[#D4AF37]">
                  <span className="text-3xl sm:text-4xl font-bold">{groomFullName.charAt(0) || 'G'}</span>
                  <Heart size={14} className="fill-[#D4AF37] text-[#D4AF37] mt-1" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{groomFullName}</h3>
              <p className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              {groomParents && <p className="text-xs text-slate-300 font-garamond italic">Son of {groomParents}</p>}
            </div>

            {/* Bride Card */}
            <div className="bg-[#181A22] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 flex flex-col items-center hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-300">
              {bridePhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#D4AF37] mb-4 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#20222C] to-[#121318] border-2 border-[#D4AF37] flex flex-col items-center justify-center mb-4 shadow-md text-[#D4AF37]">
                  <span className="text-3xl sm:text-4xl font-bold">{brideFullName.charAt(0) || 'B'}</span>
                  <Heart size={14} className="fill-[#D4AF37] text-[#D4AF37] mt-1" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{brideFullName}</h3>
              <p className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              {brideParents && <p className="text-xs text-slate-300 font-garamond italic">Daughter of {brideParents}</p>}
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="max-w-3xl mx-auto bg-[#121318]/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#D4AF37]/40"></div>
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#D4AF37]/40"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#D4AF37] mb-6 uppercase tracking-widest">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-xl text-slate-200 italic leading-relaxed font-garamond max-w-2xl mx-auto">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#D4AF37]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#121318] rounded-3xl p-6 sm:p-8 shadow-xl border-t-4 border-[#D4AF37] border-x border-b border-[#D4AF37]/30 text-center hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] transition-all duration-300 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-3 relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#D4AF37] font-sans relative z-20">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold text-sm">{item.time}</span>
              </div>
              <p className="text-slate-400 text-xs font-sans relative z-20">{item.venue || fullLocation}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="bg-[#121318]/90 rounded-[2.5rem] p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-14 h-14 bg-[#1C1810] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#D4AF37]/40 text-[#D4AF37]">
              <MapPin className="w-7 h-7 text-[#D4AF37] animate-bounce" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-widest uppercase">Venue & Location</h3>
            <p className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-2">{fullLocation}</p>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 font-garamond">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#D4AF37]/40 mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border-2 border-[#D4AF37]/30 mb-6 bg-[#0B0B0E]">
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-slate-950 px-8 py-3.5 rounded-full font-bold tracking-widest uppercase transition-all shadow-lg text-xs mb-6 hover:scale-105 cursor-pointer font-sans"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#D4AF37]/30 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-[#D4AF37] mb-1 font-sans">RSVP / Contact Info</p>
                <p className="text-base sm:text-lg font-bold text-white font-sans">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:scale-105 transition-all duration-500 relative bg-[#121318]">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="bg-[#121318]/90 rounded-[2.5rem] p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 relative overflow-hidden max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">Counting Down To The Big Day</h2>
            <p className="text-[#D4AF37] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Elegant Royal Wedding Celebration</p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto justify-items-center relative z-20">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#1C1810] to-[#0D0D11] text-[#D4AF37] flex items-center justify-center mb-2 shadow-md border border-[#D4AF37]/40 hover:scale-105 transition-transform">
                  <span className="text-lg sm:text-2xl font-bold font-sans">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-slate-300 font-sans text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto font-cinzel">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">Send Your Blessings & Wishes</h2>
            <p className="text-[#D4AF37] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-[#121318]/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 relative overflow-hidden flex flex-col items-center justify-center text-white">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-[#D4AF37]/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] border-4 border-[#FFF2B2] flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-[#D4AF37]/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-12 h-12 fill-white text-white drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20 font-sans">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#D4AF37] block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-400' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-slate-950 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans relative z-20"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Tap to Send Wish & Love ❤️
            </button>

          </div>

        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="bg-[#121318]/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 text-center relative overflow-hidden">
          <Gift size={44} className="text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase mb-3">Gift Registry</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6 font-garamond">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-slate-950 px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all shadow-lg hover:scale-105 cursor-pointer font-sans"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-14 sm:py-20 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#0B0B0E] font-cinzel">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">Will You Join Us?</h2>
            <p className="text-[#D4AF37] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-[#121318]/90 backdrop-blur rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4AF37] mb-2">Name</label>
                  <input type="text" className="w-full bg-[#181A22] border border-[#D4AF37]/40 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37] transition-all text-white placeholder-slate-500" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4AF37] mb-2">Warm Wishes & Message</label>
                  <textarea rows={4} className="w-full bg-[#181A22] border border-[#D4AF37]/40 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37] transition-all text-white placeholder-slate-500 resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4AF37] mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#181A22] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#D4AF37]" />
                      <span className="text-white font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#181A22] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#D4AF37]" />
                      <span className="text-white font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-slate-950 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
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
    <div className={`min-h-screen bg-[#0B0B0E] relative font-serif text-slate-100 flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-[#181A22]/90 backdrop-blur-md text-[#D4AF37] shadow-2xl border border-[#D4AF37]/40 hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Welcome Screen Interactive Royal Gold Wax Seal / Medallion Overlay */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#070709] transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        {/* Background Image (Dark Luxury Royal Backdrop) */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${isOpening ? 'scale-110 blur-md opacity-0' : 'scale-100 blur-0 opacity-80'}`}
          style={{ backgroundImage: "url('/media/laptop_royal_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        {/* Floating Gold Sparkles / Bokeh Particles */}
        <style>{`
          @keyframes goldSparkleFloat {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.7; }
            80% { opacity: 0.7; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(12)].map((_, i) => {
            const leftPos = (i * 8 + 4) % 92;
            const delay = (i * 0.7) % 5;
            const duration = 7 + (i % 5);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-3 h-3 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF2B2] opacity-50 filter blur-[0.5px]"
                style={{
                  left: `${leftPos}%`,
                  animation: `goldSparkleFloat ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Top Header Tag */}
        <div className={`absolute top-10 sm:top-14 z-30 flex flex-col items-center text-center px-4 transition-all duration-700 ${isOpening ? 'opacity-0 -translate-y-8 scale-90' : 'opacity-100 translate-y-0 scale-100'}`}>
          <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
            <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
            <Sparkles size={14} className="animate-pulse text-[#D4AF37]" />
            <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
          </div>
          <span className="text-xs sm:text-sm text-amber-100 font-cinzel tracking-[0.35em] uppercase font-bold drop-shadow">
            YOU ARE CORDIALLY INVITED
          </span>
        </div>

        {/* Central Royal Gold Wax Seal Medallion Button */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpening ? 'scale-[2.2] opacity-0 blur-md rotate-12' : 'scale-100 opacity-100 rotate-0'}`}>
          
          {/* Outer Pulsing Aura Rings */}
          <div className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full border border-[#D4AF37]/30 animate-ping pointer-events-none" />

          {/* Royal Gold Wax Seal Medallion */}
          <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F5D77F] to-[#AA7C11] p-3 shadow-[0_0_60px_rgba(212,175,55,0.35)] border-2 border-[#FFF2B2] transition-transform duration-500 hover:scale-105 active:scale-95 group flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Shimmer Light Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/0 via-amber-100/40 to-amber-200/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Inner Dark Disc with Script Monogram & Open Button */}
            <div className="w-full h-full rounded-full border-2 border-[#D4AF37]/50 flex flex-col items-center justify-center p-4 bg-[#0D0E12]/90 backdrop-blur-md shadow-inner relative z-10">
              
              <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1.5">
                <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
                <Heart size={15} className="fill-[#D4AF37] text-[#D4AF37] drop-shadow-sm" />
                <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
              </div>

              <span className="text-2xl sm:text-3xl font-script-alex text-[#D4AF37] font-normal leading-tight">
                {groomFullName.split(' ')[0]} & {brideFullName.split(' ')[0]}
              </span>

              <span className="text-[10px] sm:text-xs font-bold font-cinzel tracking-[0.25em] uppercase text-slate-200 my-1.5">
                EXCLUSIVE INVITATION
              </span>

              <span className="text-[9px] sm:text-[10px] text-slate-950 tracking-[0.2em] font-sans font-extrabold uppercase mt-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-1.5 rounded-full shadow-md border border-amber-200/50 group-hover:scale-105 transition-transform">
                {isOpening ? 'OPENING...' : 'OPEN INVITATION'}
              </span>

            </div>
          </div>

          {/* Couple Names & Date Subtitle */}
          <h1 className="text-xl sm:text-3xl font-cinzel text-white mt-6 font-bold tracking-[0.2em] uppercase drop-shadow-md text-center">
            {groomFullName} & {brideFullName}
          </h1>
          <p className="text-[#D4AF37] text-xs sm:text-sm tracking-[0.25em] font-cinzel uppercase mt-1 font-semibold">
            {monthStr} {dayNum}, {yearStr}
          </p>

        </div>

        {/* Bottom Floating Hint */}
        <div className={`absolute bottom-6 sm:bottom-10 inset-x-0 mx-auto px-4 z-30 flex flex-col items-center justify-center text-center transition-all duration-500 ${isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] sm:text-xs text-[#D4AF37] font-cinzel tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold animate-bounce drop-shadow text-center max-w-[280px] sm:max-w-xs leading-relaxed">
            ✨ Tap medallion to open invitation ✨
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-8 relative z-10 text-center bg-[#070709] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-8 border-t-2 border-[#D4AF37]/30">
        <h2 className="text-2xl font-cinzel mb-2 text-[#D4AF37]">{rawCoupleNames}</h2>
        <p className="text-slate-400 text-xs tracking-widest uppercase mb-2 font-sans">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
