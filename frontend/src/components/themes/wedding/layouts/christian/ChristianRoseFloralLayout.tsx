import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ChristianRoseFloralLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Global Live Multi-Click Heart Wish State
  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

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
    }, 1200);
  };

  const rawCoupleNames = content?.hero_title || "ISABELLA & ALEXANDER";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ISABELLA").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "ALEXANDER").toUpperCase();

  const story = content?.about_text || "Like a rose unfolding its petals, our love has grown beautifully over time. We cannot wait to celebrate our union with all of you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Love Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, May 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'MAY');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Rose Garden Estate, California";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Garden Ceremony", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "Rose Terrace Cocktails", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Grand Reception", date: rawDateStr, venue: location }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Davis";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Miller";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence is our greatest gift. Should you wish to honor us with a present, our registry is linked below.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-05-15T16:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "REQUEST THE PLEASURE OF YOUR COMPANY";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      if (!countdownDate) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      let targetTime: number | null = null;
      let d = new Date(countdownDate);
      if (!isNaN(d.getTime())) {
        targetTime = d.getTime();
      } else {
        d = new Date(String(countdownDate).replace(' ', 'T'));
        if (!isNaN(d.getTime())) {
          targetTime = d.getTime();
        }
      }

      if (!targetTime) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
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
      rawSections = [...rawSections.slice(0, rsvpIdx), { id: 'wishes', label: 'Wishes & Blessings', visible: true }, ...rawSections.slice(rsvpIdx)];
    } else {
      rawSections = [...rawSections, { id: 'wishes', label: 'Wishes & Blessings', visible: true }];
    }
  }
  const sections = rawSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section
        key="hero"
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#FFF5F7] text-[#4A1525] p-0 overflow-hidden py-16 sm:py-20 min-h-[95vh] bg-cover bg-center bg-no-repeat font-serif"
        style={{ backgroundImage: "url('/media/rose_floral_bg.png')" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&display=swap');
          .font-garamond { font-family: 'Cormorant Garamond', serif; }
          .font-vibes { font-family: 'Great Vibes', cursive; }
        `}</style>
        
        {/* Soft blush pink gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7]/80 via-transparent to-[#FFF5F7]/90 pointer-events-none z-10" />

        {/* Floating Rose Petals */}
        <style>{`
          @keyframes petalFall {
            0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(110vh) rotate(360deg) scale(1.2); opacity: 0; }
          }
          @keyframes slowBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(12)].map((_, i) => {
            const leftPos = (i * 8 + 3) % 95;
            const delay = (i * 0.9) % 7;
            const duration = 10 + (i % 6);
            return (
              <div
                key={i}
                className="absolute top-[-10%] w-4 h-4 rounded-full bg-gradient-to-br from-rose-200 to-rose-400 opacity-40 filter blur-[2px]"
                style={{
                  left: `${leftPos}%`,
                  borderTopRightRadius: '50%',
                  borderBottomLeftRadius: '50%',
                  animation: `petalFall ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Hero Card Container */}
        <div className="relative z-30 max-w-lg mx-auto flex flex-col items-center px-4 animate-[slowBreath_8s_ease-in-out_infinite]">
          
          {/* Inner Elegance Box */}
          <div className="w-full bg-white/60 backdrop-blur-md p-8 sm:p-14 rounded-t-full rounded-b-[4rem] border border-rose-200 shadow-[0_20px_50px_rgba(225,29,72,0.05)] relative flex flex-col items-center text-center">
            
            <div className="flex items-center gap-3 mb-6 opacity-70">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B76E79]"></span>
              <Heart size={14} className="fill-[#B76E79] text-[#B76E79]" />
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B76E79]"></span>
            </div>

            <p className="text-[#800020] text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase font-garamond mb-2">
              WITH JOYFUL HEARTS
            </p>
            <p className="text-[#B76E79] text-sm sm:text-base italic font-garamond mb-8">
              we invite you to our wedding
            </p>

            {/* Groom Name */}
            <h1 className="text-4xl sm:text-6xl font-semibold font-garamond tracking-[0.1em] text-[#4A1525] uppercase my-1">
              {groomFullName}
            </h1>

            {/* Elegant Script Ampersand */}
            <div className="my-2">
              <span className="text-5xl sm:text-7xl text-[#B76E79] font-vibes drop-shadow-sm">&</span>
            </div>

            {/* Bride Name */}
            <h1 className="text-4xl sm:text-6xl font-semibold font-garamond tracking-[0.1em] text-[#4A1525] uppercase my-1">
              {brideFullName}
            </h1>

            {/* Tagline */}
            <p className="text-[#B76E79] text-xs sm:text-sm tracking-[0.2em] font-garamond font-medium uppercase mt-8 mb-6 max-w-xs leading-relaxed">
              {quoteText}
            </p>

            {/* Floral Divider */}
            <svg width="100" height="20" viewBox="0 0 100 20" className="opacity-40 mb-6">
              <path d="M0,10 L40,10 M60,10 L100,10" stroke="#B76E79" strokeWidth="1" />
              <circle cx="50" cy="10" r="3" fill="#B76E79" />
              <circle cx="43" cy="10" r="1.5" fill="#B76E79" />
              <circle cx="57" cy="10" r="1.5" fill="#B76E79" />
            </svg>

            {/* Date Layout */}
            <div className="my-2 text-center flex flex-col items-center">
              <div className="flex items-center gap-6 text-[#4A1525] font-garamond my-1">
                <span className="text-sm font-bold tracking-[0.2em] uppercase">{monthStr}</span>
                <span className="text-4xl sm:text-5xl font-semibold">{dayNum}</span>
                <span className="text-sm font-bold tracking-[0.2em] uppercase">{yearStr}</span>
              </div>
              <span className="text-[#B76E79] text-xs sm:text-sm tracking-[0.2em] font-garamond uppercase font-semibold mt-4">
                {dayName} • {timeStr}
              </span>
            </div>

            {/* Location Line */}
            <div className="mt-8 pt-6 border-t border-rose-100/50 w-full text-center flex flex-col items-center">
              <p className="text-[#4A1525] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase font-garamond">
                {location}
              </p>
            </div>

          </div>
        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-[#FFF5F7] text-[#4A1525]">
        <div className="bg-white/80 backdrop-blur-lg rounded-[3rem] p-8 sm:p-16 shadow-[0_20px_50px_rgba(225,29,72,0.03)] border border-rose-100 hover:shadow-[0_30px_60px_rgba(225,29,72,0.05)] transition-all duration-700 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-12 relative z-20">
            <h2 className="text-3xl sm:text-4xl font-garamond font-semibold text-[#4A1525] tracking-widest uppercase">The Couple</h2>
            <p className="text-[#B76E79] text-lg sm:text-xl italic mt-3 font-garamond">Two souls, one heart</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 relative z-20">
            {[ {role: 'Groom', name: groomFullName, parents: groomParents, photo: groomPhoto}, 
               {role: 'Bride', name: brideFullName, parents: brideParents, photo: bridePhoto} ].map((person, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="relative w-48 h-64 sm:w-56 sm:h-72 mb-8 rounded-t-full rounded-b-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-700">
                  <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-50 to-rose-100 flex flex-col items-center justify-center text-[#B76E79]">
                      <Heart size={32} className="fill-rose-200" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-semibold font-garamond text-[#4A1525] mb-2 tracking-widest uppercase">{person.name}</h3>
                <p className="text-[10px] text-[#B76E79] font-bold uppercase tracking-[0.4em] mb-3">{person.role}</p>
                {person.parents && <p className="text-sm text-slate-500 font-garamond italic">Child of {person.parents}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-white">
        <div className="max-w-3xl mx-auto relative z-20">
          <Heart size={32} className="text-rose-200 fill-rose-50 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-semibold font-garamond text-[#4A1525] tracking-widest uppercase mb-10">
            {storyTitle}
          </h2>
          <p className="text-xl sm:text-2xl text-[#6E2C3F] font-garamond italic leading-loose">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#FFF5F7]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold font-garamond text-[#4A1525] tracking-widest uppercase">Itinerary</h2>
            <p className="text-[#B76E79] text-lg sm:text-xl italic mt-3 font-garamond">Celebrate with us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-t-full rounded-b-3xl p-8 pt-16 shadow-[0_10px_30px_rgba(225,29,72,0.03)] border border-rose-100 flex flex-col items-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(225,29,72,0.06)] transition-all duration-500 relative">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center mb-6 absolute top-8 border border-rose-100">
                  <Clock size={20} />
                </div>
                <h3 className="text-xl font-semibold text-[#4A1525] mb-2 font-garamond tracking-widest uppercase mt-6">{item.event}</h3>
                <span className="text-[#B76E79] text-xs font-bold tracking-[0.2em] mb-4 uppercase">{item.time}</span>
                <p className="text-slate-500 text-sm font-garamond italic">{item.venue || location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto bg-[#FFF5F7] rounded-[3rem] p-8 sm:p-16 shadow-lg border border-rose-100 text-center relative overflow-hidden">
          
          <MapPin size={32} className="text-rose-300 mx-auto mb-6" />
          <h3 className="text-3xl sm:text-4xl font-semibold font-garamond text-[#4A1525] mb-4 tracking-widest uppercase">The Venue</h3>
          <p className="text-xl sm:text-2xl font-garamond italic text-[#800020] mb-2">{location}</p>
          <p className="text-sm text-slate-500 font-garamond italic mb-12 max-w-lg mx-auto">We look forward to celebrating our special day with you amidst the beautiful blooms.</p>

          {venuePhoto && (
            <div className="w-full h-64 sm:h-[28rem] rounded-[2rem] overflow-hidden shadow-xl mb-12 relative group">
              <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          )}

          <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-inner border border-rose-200 mb-12 bg-white">
            <iframe
              src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none md:pointer-events-auto opacity-90 hover:opacity-100 transition-opacity"
            ></iframe>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#800020] hover:bg-[#4A1525] text-rose-50 px-8 py-4 rounded-full font-semibold tracking-widest transition-all shadow-md hover:shadow-lg text-xs uppercase"
              >
                <Navigation size={14} />
                Get Directions
              </a>
            )}
            {contactNumbers && (
              <div className="px-8 py-4 rounded-full bg-white border border-rose-200 text-[#800020] font-semibold tracking-widest text-xs uppercase shadow-sm">
                RSVP: {contactNumbers}
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#FFF5F7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#4A1525] font-garamond tracking-widest uppercase mb-16">Captured Moments</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 relative bg-white border-4 border-white group">
                <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto text-center border border-rose-100 rounded-[3rem] p-12 sm:p-16 shadow-[0_10px_40px_rgba(225,29,72,0.02)]">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3 text-[#4A1525] font-garamond uppercase tracking-widest">Awaiting the Day</h2>
          <p className="text-lg italic mb-12 text-[#B76E79] font-garamond">Let the countdown begin</p>

          <div className="flex gap-4 sm:gap-10 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#FFF5F7] border border-rose-200 flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-2xl sm:text-4xl font-semibold text-[#800020] font-garamond">{item.value}</span>
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-slate-400 font-sans">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#4A1525] font-garamond tracking-widest uppercase">Leave a Blessing</h2>
          <p className="text-[#B76E79] text-lg italic mt-3 font-garamond">Shower the couple with love</p>
        </div>

        <div className="bg-white rounded-[3rem] p-12 sm:p-16 shadow-[0_20px_50px_rgba(225,29,72,0.04)] border border-rose-100 relative flex flex-col items-center">
          {pulseRing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-16">
              <div className="w-56 h-56 rounded-full border border-rose-300 animate-ping"></div>
            </div>
          )}

          <button
            type="button"
            onClick={handleTapWish}
            className={`w-32 h-32 rounded-full bg-[#FFF5F7] border border-rose-200 flex items-center justify-center shadow-md transition-all duration-300 group cursor-pointer mb-8 relative z-20 ${pulseRing ? 'scale-110 shadow-xl' : 'hover:scale-105 active:scale-95'}`}
          >
            <Heart className={`w-12 h-12 transition-all duration-300 ${pulseRing ? 'scale-125 rotate-12 fill-[#800020] text-[#800020]' : 'fill-[#B76E79] text-[#B76E79] group-hover:fill-[#800020] group-hover:text-[#800020]'}`} />
          </button>

          <div className="flex flex-col items-center">
            <span className={`text-6xl sm:text-8xl font-semibold text-[#4A1525] font-garamond block transition-transform duration-300 ${isCounterPopping ? 'scale-110' : 'scale-100'}`}>
              {wishCount}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4">Wishes Received</span>
          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center bg-[#FFF5F7]">
        <Gift size={40} className="text-rose-300 mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#4A1525] font-garamond tracking-widest uppercase mb-6">Registry</h2>
        <p className="text-lg text-[#6E2C3F] font-garamond italic max-w-lg mx-auto mb-10 leading-relaxed">{registryMessage}</p>
        {registryUrl && (
          <a
            href={registryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#800020] hover:bg-[#4A1525] text-rose-50 px-10 py-4 rounded-full font-semibold tracking-widest uppercase text-xs transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            View Our Registry
          </a>
        )}
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#4A1525] font-garamond tracking-widest uppercase">RSVP</h2>
            <p className="text-[#B76E79] text-lg italic mt-3 font-garamond">Kindly respond</p>
          </div>

          <div className="bg-[#FFF5F7] rounded-[3rem] p-8 sm:p-16 shadow-[0_10px_40px_rgba(225,29,72,0.03)] border border-rose-100">
            <form className="space-y-8 font-sans max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-3 ml-4">Name</label>
                  <input type="text" className="w-full bg-white border border-rose-200 rounded-full px-8 py-4 outline-none focus:border-[#800020] transition-all text-[#4A1525] placeholder-slate-300 shadow-sm" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-3 ml-4">Message</label>
                  <textarea rows={4} className="w-full bg-white border border-rose-200 rounded-[2rem] px-8 py-6 outline-none focus:border-[#800020] transition-all text-[#4A1525] placeholder-slate-300 resize-none shadow-sm" placeholder="Leave a beautiful message..."></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-4 ml-4">Attendance</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-rose-200 hover:border-[#800020] bg-white rounded-full flex-1 transition-all shadow-sm hover:shadow-md">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#800020]" />
                      <span className="text-[#4A1525] font-bold uppercase tracking-widest text-[10px]">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-rose-200 hover:border-[#800020] bg-white rounded-full flex-1 transition-all shadow-sm hover:shadow-md">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#800020]" />
                      <span className="text-[#4A1525] font-bold uppercase tracking-widest text-[10px]">Declines with Regret</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#800020] hover:bg-[#4A1525] text-rose-50 font-bold tracking-widest uppercase text-xs px-12 py-5 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                  <Send size={14} />
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative font-garamond flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {musicUrl && isOpened && (
        <button
          onClick={() => {
            if (audioRef.current) {
              isMuted ? audioRef.current.play() : audioRef.current.pause();
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white text-[#800020] shadow-[0_10px_30px_rgba(225,29,72,0.1)] border border-rose-200 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen: Blooming Rose Petal Opening */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? 'pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent bg-transparent`}
      >
        {/* Left Blooming Petal */}
        <div
          className={`absolute inset-0 bg-[#FFF5F7] transition-all duration-[2000ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 origin-bottom-left shadow-[20px_0_50px_rgba(225,29,72,0.1)] ${isOpening ? '-translate-x-full -rotate-12 scale-110 opacity-0' : 'translate-x-0 rotate-0 scale-100 opacity-100'}`}
          style={{ clipPath: 'ellipse(120% 150% at 0% 50%)' }}
        >
          {/* Subtle inner floral texture */}
          <div className="absolute inset-0 bg-[url('/media/rose_floral_bg.png')] bg-cover opacity-10 mix-blend-multiply"></div>
        </div>

        {/* Right Blooming Petal */}
        <div
          className={`absolute inset-0 bg-white transition-all duration-[2000ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-10 origin-top-right shadow-[-20px_0_50px_rgba(225,29,72,0.1)] ${isOpening ? 'translate-x-full rotate-12 scale-110 opacity-0' : 'translate-x-0 rotate-0 scale-100 opacity-100'}`}
          style={{ clipPath: 'ellipse(120% 150% at 100% 50%)' }}
        >
          <div className="absolute inset-0 bg-[url('/media/rose_floral_bg.png')] bg-cover opacity-5 mix-blend-multiply"></div>
        </div>

        {/* Additional Ethereal Back Petal (Bottom) */}
        <div
          className={`absolute inset-0 bg-rose-50 transition-all duration-[1800ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-0 origin-bottom shadow-[0_-20px_50px_rgba(225,29,72,0.05)] ${isOpening ? 'translate-y-full rotate-6 opacity-0 scale-110' : 'translate-y-0 rotate-0 opacity-100 scale-100'}`}
          style={{ clipPath: 'ellipse(150% 120% at 50% 100%)' }}
        ></div>

        {/* Delicate Golden Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-rose-300 opacity-50 ${isOpening ? 'animate-ping' : 'animate-pulse'}`}
              style={{
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 11) % 100}%`,
                animationDelay: `${(i * 0.2) % 2}s`,
                transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isOpening 
                  ? `translate(${(i % 2 === 0 ? 1 : -1) * (150 + i * 10)}px, ${(i % 3 === 0 ? 1 : -1) * (150 + i * 10)}px) scale(${1 + i * 0.1})` 
                  : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Center Romantic Medallion */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpening ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'}`}>
          
          {/* Pulsing Aura Rings */}
          <div className={`absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-rose-300 transition-all duration-[1500ms] ${isOpening ? 'scale-[4] opacity-0' : 'animate-[ping_4s_ease-in-out_infinite] opacity-50'}`} />
          <div className={`absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-rose-200 transition-all duration-[1500ms] ${isOpening ? 'scale-[3] opacity-0' : 'animate-[ping_4s_ease-in-out_infinite] opacity-30 delay-700'}`} />
          
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-white/90 backdrop-blur-2xl border-4 border-white shadow-[0_30px_80px_rgba(225,29,72,0.15)] flex flex-col items-center justify-center p-8 text-center relative z-20 group hover:shadow-[0_40px_100px_rgba(225,29,72,0.25)] hover:scale-105 transition-all duration-700 cursor-pointer overflow-hidden">
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-100/50 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            
            <Heart size={32} className="text-rose-400 fill-rose-100 mb-5 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 ease-out drop-shadow-md" />
            
            <span className="text-[#800020] text-[10px] sm:text-xs font-bold font-garamond tracking-[0.4em] uppercase leading-tight px-1 z-10 mb-2">
              ROSE FLORAL
            </span>
            <span className="text-[#B76E79] text-[9px] sm:text-[10px] font-bold font-sans tracking-[0.3em] uppercase leading-tight z-10 mb-8">
              INVITATION
            </span>

            <div className="bg-gradient-to-r from-[#800020] to-[#6E2C3F] group-hover:from-[#4A1525] group-hover:to-[#800020] text-rose-50 text-[8px] sm:text-[9px] tracking-[0.3em] font-sans font-bold uppercase px-8 py-3 rounded-full transition-all duration-700 z-10 shadow-lg group-hover:shadow-rose-900/30">
              {isOpening ? 'BLOOMING...' : 'TAP TO ENTER'}
            </div>

            <div className="absolute inset-0 border border-rose-200 rounded-full scale-90 opacity-40 group-hover:scale-95 group-hover:opacity-60 transition-all duration-700 pointer-events-none" />
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#4A1525] font-garamond tracking-[0.15em] uppercase mt-14 drop-shadow-md">
            {groomFullName} & {brideFullName}
          </h1>
          <p className="text-[#B76E79] text-xs sm:text-sm tracking-[0.3em] font-garamond uppercase mt-4 font-semibold">
            {rawDateStr}
          </p>
        </div>
      </div>

      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-white text-[#4A1525] rounded-t-[3rem] w-full border-t border-rose-100 mt-12">
        <Heart size={24} className="fill-rose-100 text-rose-200 mx-auto mb-6" />
        <h2 className="text-2xl font-garamond font-semibold tracking-widest mb-4 uppercase">{rawCoupleNames}</h2>
        <p className="text-slate-400 text-[10px] tracking-[0.4em] uppercase font-sans font-semibold">Crafted with love by Jaalam</p>
      </footer>

    </div>
  );
}
