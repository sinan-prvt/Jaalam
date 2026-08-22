import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function FloralLayout({ content, website, colors }: WeddingLayoutProps) {
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

  // Couple names processing to match Image 2 Sunflower style
  const rawCoupleNames = content?.hero_title || "ELIZABETH & JONATHAN";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ELIZABETH").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "JONATHAN").toUpperCase();

  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, September 25, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'SEPT');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '25');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '3:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "WALNUT HILL FARM, TENNESSEE";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "3:00 PM", event: "Holy Wedding Ceremony", date: rawDateStr, venue: location },
      { time: "4:30 PM", event: "Garden Cocktail Hour", date: rawDateStr, venue: location },
      { time: "6:00 PM", event: "Dinner & Evening Reception", date: rawDateStr, venue: location }
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

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-09-25T15:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "invite you to celebrate their wedding";

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
      <section
        key="hero"
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAF6F0] text-[#4A382C] p-0 overflow-hidden py-10 sm:py-14 min-h-[90vh] bg-cover bg-center bg-no-repeat font-serif"
        style={{ backgroundImage: "url('/media/sunflower_bg.png')" }}
      >
        {/* Soft warmth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/60 via-transparent to-[#FAF6F0]/80 pointer-events-none z-10" />

        {/* Soft Golden Flower Petals Float */}
        <style>{`
          @keyframes sunflowerFloat {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(10)].map((_, i) => {
            const leftPos = (i * 9 + 4) % 92;
            const delay = (i * 0.7) % 5;
            const duration = 8 + (i % 5);
            return (
              <div
                key={i}
                className="absolute top-[-5%] w-3 h-3 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 opacity-60 filter blur-[1px]"
                style={{
                  left: `${leftPos}%`,
                  animation: `sunflowerFloat ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Hero Card Container - Styled Exact to Image 2 (Sunflower Theme) */}
        <div className="relative z-30 pt-4 sm:pt-6 max-w-xs sm:max-w-md mx-auto flex flex-col items-center px-4 pb-4">
          
          {/* Inner Notched Frame Box */}
          <div className="w-full bg-[#FAF7F2]/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl border-2 border-[#D6C5B3] shadow-xl relative flex flex-col items-center text-center">
            
            {/* Top Header Lines matching Image 2 */}
            <p className="text-[#6E5646] text-xs sm:text-sm font-bold tracking-[0.35em] uppercase font-serif mb-1">
              TOGETHER
            </p>
            <p className="text-[#8B7160] text-xs sm:text-sm italic font-serif mb-5">
              with their loving families
            </p>

            {/* Groom Name */}
            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-[0.15em] text-[#4A382C] uppercase drop-shadow-sm my-0.5">
              {groomFullName}
            </h1>

            {/* Ampersand Flourish */}
            <div className="my-2 flex items-center justify-center gap-3">
              <span className="h-[1px] w-8 bg-[#D6C5B3]"></span>
              <span className="text-xl sm:text-2xl text-[#8B7160] font-serif italic">and</span>
              <span className="h-[1px] w-8 bg-[#D6C5B3]"></span>
            </div>

            {/* Bride Name */}
            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-[0.15em] text-[#4A382C] uppercase drop-shadow-sm my-0.5">
              {brideFullName}
            </h1>

            {/* Tagline / Invitation Request Line */}
            <p className="text-[#8B7160] text-xs sm:text-sm italic font-serif my-5 max-w-xs leading-relaxed">
              {quoteText}
            </p>

            {/* Date Layout matching Image 2 */}
            <div className="my-2 text-center flex flex-col items-center">
              <span className="text-[#6E5646] text-xs font-bold tracking-[0.25em] uppercase font-serif mb-1">
                {dayName}
              </span>
              <div className="flex items-center gap-3 text-[#4A382C] font-serif my-1">
                <span className="text-sm font-bold tracking-widest uppercase">{monthStr}</span>
                <span className="text-3xl sm:text-4xl font-extrabold px-3 border-x-2 border-[#D6C5B3]">{dayNum}</span>
                <span className="text-sm font-bold tracking-widest uppercase">{yearStr}</span>
              </div>
              <span className="text-[#8B7160] text-xs italic font-serif mt-1">
                at {timeStr.toLowerCase()} in the afternoon
              </span>
            </div>

            {/* Location Line matching Image 2 */}
            <div className="mt-5 pt-4 border-t border-[#D6C5B3]/60 text-center flex flex-col items-center">
              <p className="text-[#4A382C] text-sm sm:text-base font-bold tracking-[0.18em] uppercase font-serif">
                {location}
              </p>
            </div>

          </div>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF6F0] text-[#4A382C]">
        <div className="max-w-2xl mx-auto bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border-2 border-[#D6C5B3] hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-6 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
              <Sparkles size={18} className="text-[#C69B31] animate-pulse" />
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] tracking-wide font-serif">FAMILY BLESSINGS & INVITATION</h2>
            <p className="text-[#8B7160] text-xs sm:text-sm italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-2 font-serif">
              request the honour of your presence to celebrate their wedding union
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border-2 border-[#D6C5B3] flex flex-col items-center hover:-translate-y-1 hover:border-[#C69B31] hover:shadow-lg transition-all duration-300 shadow-sm">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-amber-200 animate-pulse" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-[#4A382C] mb-1 font-serif">{groomFullName}</h3>
              <p className="text-xs text-[#8B7160] font-bold uppercase tracking-widest mb-1 font-sans">Groom</p>
              {groomParents && <p className="text-xs text-slate-600 font-serif">Son of {groomParents}</p>}
            </div>

            {/* Bride Card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border-2 border-[#D6C5B3] flex flex-col items-center hover:-translate-y-1 hover:border-[#C69B31] hover:shadow-lg transition-all duration-300 shadow-sm">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C69B31] mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center mb-3 text-[#C69B31]">
                  <Heart className="w-7 h-7 fill-amber-200 animate-pulse" />
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-[#4A382C] mb-1 font-serif">{brideFullName}</h3>
              <p className="text-xs text-[#8B7160] font-bold uppercase tracking-widest mb-1 font-sans">Bride</p>
              {brideParents && <p className="text-xs text-slate-600 font-serif">Daughter of {brideParents}</p>}
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF6F0]">
        <div className="max-w-2xl mx-auto bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border-2 border-[#D6C5B3] hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
              <Sparkles className="w-7 h-7 text-[#C69B31] animate-bounce" />
              <div className="h-[1px] w-12 bg-[#C69B31]/40"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] mb-6 font-serif tracking-wide uppercase">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#4A382C] italic leading-relaxed font-serif">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF6F0]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#C69B31]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C69B31] to-transparent"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] font-serif tracking-wide uppercase">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#FFFDF9] rounded-3xl p-6 shadow-xl border-t-4 border-[#C69B31] border-x border-b border-[#D6C5B3] text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <h3 className="text-lg font-bold text-[#4A382C] mb-3 font-serif relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#8B7160] font-serif relative z-20">
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
      <section key="venue" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#FAF6F0]">
        <div className="bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-10 text-center shadow-2xl border-2 border-[#D6C5B3] relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-14 h-14 bg-amber-100/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#C69B31]/40 text-[#C69B31]">
              <MapPin className="w-7 h-7 text-[#C69B31] animate-bounce" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#4A382C] mb-3 font-serif tracking-wide uppercase">Venue & Location</h3>
            <p className="text-lg font-semibold text-[#4A382C] mb-2 font-serif">{location}</p>
            <p className="text-sm text-[#8B7160] max-w-md mx-auto mb-6 font-serif">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#D6C5B3] mb-6 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border-2 border-[#D6C5B3] mb-6 bg-white">
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
                className="inline-flex items-center gap-2 bg-[#4A382C] hover:bg-[#34271E] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-xs mb-6 hover:scale-105 cursor-pointer border border-[#C69B31]/40"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#D6C5B3] pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-[#8B7160] mb-1 font-sans">RSVP / Contact Info</p>
                <p className="text-base sm:text-lg font-bold text-[#4A382C] font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#FAF6F0]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
            <Sparkles className="w-5 h-5 text-[#C69B31]" />
            <div className="h-[1px] w-12 bg-[#C69B31]"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] font-serif tracking-wide uppercase">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-[#D6C5B3] hover:scale-105 transition-transform duration-500 relative bg-white">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 bg-[#4A382C] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-4 text-center border-2 border-[#C69B31]/60">
        <div className="max-w-3xl mx-auto relative z-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-amber-300 font-serif uppercase tracking-wide">Counting Down To The Big Day</h2>
          <p className="text-sm sm:text-base italic mb-6 text-amber-100 font-serif">Our Sunflower Wedding Celebration</p>

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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] font-serif tracking-wide uppercase">Send Your Blessings & Wishes</h2>
            <p className="text-[#8B7160] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-[#FFFDF9] backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-[#D6C5B3] relative overflow-hidden flex flex-col items-center justify-center text-slate-800">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-amber-400/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#4A382C] to-[#34271E] border-4 border-amber-300 flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-amber-300/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#4A382C] font-serif block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans mt-1">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#4A382C] hover:bg-[#34271E] text-amber-200 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans border border-amber-300/30 relative z-20"
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
        <div className="bg-[#FFFDF9] backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-[#D6C5B3] text-center relative overflow-hidden">
          <Gift size={40} className="text-[#C69B31] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] font-serif mb-3 uppercase">Gift Registry</h2>
          <p className="text-sm text-[#8B7160] leading-relaxed max-w-md mx-auto mb-6 font-serif">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#4A382C] hover:bg-[#34271E] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs transition-all shadow-lg hover:scale-105 cursor-pointer border border-[#C69B31]/40"
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A382C] font-serif tracking-wide uppercase">Will You Join Us?</h2>
            <p className="text-[#8B7160] tracking-widest uppercase text-xs font-semibold mt-1 font-sans">Please let us know if you can attend</p>
          </div>

          <div className="bg-[#FFFDF9] backdrop-blur rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-[#D6C5B3] text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8B7160] mb-2 font-sans">Name</label>
                  <input type="text" className="w-full bg-[#FAF7F2] border border-[#D6C5B3] rounded-xl px-4 py-3 outline-none focus:border-[#4A382C] transition-all font-serif text-[#4A382C]" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8B7160] mb-2 font-sans">Warm Wishes & Message</label>
                  <textarea rows={4} className="w-full bg-[#FAF7F2] border border-[#D6C5B3] rounded-xl px-4 py-3 outline-none focus:border-[#4A382C] transition-all font-serif text-[#4A382C] resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8B7160] mb-3 font-sans">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D6C5B3] hover:border-[#4A382C] bg-[#FAF7F2] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#4A382C]" />
                      <span className="text-[#4A382C] font-bold uppercase tracking-widest text-xs font-sans">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D6C5B3] hover:border-[#4A382C] bg-[#FAF7F2] rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#4A382C]" />
                      <span className="text-[#4A382C] font-bold uppercase tracking-widest text-xs font-sans">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A382C] hover:bg-[#34271E] text-amber-200 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer border border-[#C69B31]/40">
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#4A382C] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen: Blooming Sunflower Petal Aperture Reveal */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF6F0] transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${isOpening ? 'scale-125 blur-lg opacity-0' : 'scale-100 opacity-90'}`}
          style={{ backgroundImage: "url('/media/sunflower_bg.png')" }}
        >
          <div className="absolute inset-0 bg-[#FAF6F0]/60 backdrop-blur-[1px]" />
        </div>

        {/* Top Header Tag */}
        <div className={`absolute top-12 sm:top-16 z-30 flex flex-col items-center text-center px-4 transition-all duration-700 ${isOpening ? 'opacity-0 -translate-y-8 scale-90' : 'opacity-100 translate-y-0 scale-100'}`}>
          <div className="flex items-center gap-2 text-[#C69B31] mb-1">
            <span className="h-[1px] w-8 bg-[#C69B31]"></span>
            <Sparkles size={14} className="animate-pulse" />
            <span className="h-[1px] w-8 bg-[#C69B31]"></span>
          </div>
          <span className="text-xs sm:text-sm text-[#4A382C] font-serif tracking-[0.3em] uppercase font-bold drop-shadow-sm">
            YOU ARE CORDIALLY INVITED
          </span>
        </div>

        {/* Center Blooming Sunflower Petal Aperture */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpening ? 'scale-[3] rotate-[180deg] opacity-0' : 'scale-100 rotate-0 opacity-100'}`}>
          
          {/* Animated Glowing Sunburst Outer Rings */}
          <div className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-amber-400/50 transition-all duration-1000 ${isOpening ? 'scale-[3.5] opacity-0' : 'animate-ping opacity-30'}`} />
          
          {/* Sunflower Petals Disc Ring (12 Blooming Petals) */}
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
            
            {/* 12 Radiant Golden Sunflower Petals */}
            {[...Array(12)].map((_, i) => {
              const rotationDegree = i * 30;
              return (
                <div
                  key={i}
                  className="absolute w-6 h-20 sm:w-8 sm:h-24 rounded-t-full bg-gradient-to-t from-amber-500 via-amber-300 to-amber-400 border border-amber-200/80 shadow-md origin-bottom transition-transform duration-700"
                  style={{
                    transform: `rotate(${rotationDegree}deg) translateY(-50%)`,
                    top: '50%',
                    left: 'calc(50% - 12px)',
                  }}
                />
              );
            })}

            {/* Inner Dark Bronze Sunflower Core Disc */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#4A382C] via-[#3A2A20] to-[#251A14] border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center p-3 text-center relative z-20 group hover:scale-105 transition-transform duration-300">
              
              {/* Shimmer Light */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300/0 via-amber-200/30 to-amber-300/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="flex items-center justify-center gap-1 text-amber-300 mb-1">
                <Sparkles size={13} className="text-amber-300 animate-pulse" />
                <Heart size={13} className="fill-amber-300 text-amber-300" />
                <Sparkles size={13} className="text-amber-300 animate-pulse" />
              </div>

              <span className="text-amber-300 text-[10px] sm:text-xs font-extrabold font-serif tracking-wider uppercase leading-tight px-1 whitespace-nowrap drop-shadow">
                SUNFLOWER INVITATION
              </span>

              <span className="text-[8px] sm:text-[9px] text-amber-100 tracking-[0.2em] font-sans font-bold uppercase mt-2 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/40">
                {isOpening ? 'BLOOMING...' : 'TAP TO BLOOM'}
              </span>

            </div>

          </div>

          {/* Couple Names & Date */}
          <h1 className="text-2xl sm:text-4xl font-bold text-[#4A382C] mt-6 font-serif tracking-wide drop-shadow-sm">
            {groomFullName} & {brideFullName}
          </h1>
          <p className="text-[#8B7160] text-xs sm:text-sm tracking-[0.2em] font-serif uppercase mt-1 font-bold">
            {rawDateStr}
          </p>

        </div>

        {/* Bottom Floating Hint */}
        <div className={`absolute bottom-6 sm:bottom-10 inset-x-0 mx-auto px-4 z-30 flex flex-col items-center justify-center text-center transition-all duration-500 ${isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] sm:text-xs text-[#8B7160] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold animate-bounce drop-shadow text-center max-w-[280px] sm:max-w-xs leading-relaxed">
            ✨ Tap sunflower medallion to bloom & open invitation ✨
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-8 relative z-10 text-center bg-[#4A382C] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-8 border-t-2 border-amber-400/30">
        <h2 className="text-2xl font-serif mb-2 text-amber-300">{rawCoupleNames}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
