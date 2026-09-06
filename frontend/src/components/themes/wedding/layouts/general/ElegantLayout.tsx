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
    }, 1000);
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

  // Reusable Section Background with Glassmorphism and Elegant Borders
  const SectionContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`max-w-4xl mx-auto p-[2px] bg-gradient-to-b from-[#D4AF37]/40 via-transparent to-[#D4AF37]/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="bg-[#0C0D11]/95 backdrop-blur-xl rounded-[calc(3rem-2px)] p-8 sm:p-14 relative z-10">
        {children}
      </div>
    </div>
  );

  const TitleDivider = () => (
    <div className="flex items-center justify-center gap-4 mb-8 opacity-90 w-full max-w-xs mx-auto">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]/30"></div>
      <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse shrink-0" />
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]/30"></div>
    </div>
  );

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section
        key="hero"
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#050608] text-white p-0 overflow-hidden py-24 min-h-[100vh]"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&display=swap');
          .font-script-alex {
            font-family: 'Great Vibes', cursive;
          }
          .font-cinzel {
            font-family: 'Cinzel', serif;
          }
          .font-garamond {
            font-family: 'Cormorant Garamond', serif;
          }
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          @keyframes floatSlow {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            50% { transform: translateY(-50vh) scale(1.5); opacity: 0.6; }
            100% { transform: translateY(-100vh) scale(1); opacity: 0; }
          }
          @keyframes revealFade {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-reveal {
            animation: revealFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Ambient Rich Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#241d0e] via-[#050608] to-black opacity-90" />
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-[-10%] rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5D77F] opacity-40 blur-[1px]"
              style={{
                left: `${(i * 13) % 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animation: `floatSlow ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Central Block */}
        <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center px-4 font-cinzel animate-reveal">
          
          <p className="text-[#D4AF37] text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase mb-8 drop-shadow-md">
            The Wedding Celebration
          </p>

          <div className="relative mb-8 flex flex-col items-center w-full">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C3] via-[#D4AF37] to-[#8C6D1F] uppercase drop-shadow-[0_10px_20px_rgba(212,175,55,0.15)] leading-none my-1">
              {groomFullName}
            </h1>
            
            <div className="relative flex items-center justify-center w-full my-6">
              <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent to-[#D4AF37]/50"></div>
              <span className="text-4xl sm:text-6xl text-[#D4AF37] font-script-alex italic font-normal px-6 drop-shadow-lg">
                &
              </span>
              <div className="h-[1px] w-1/4 bg-gradient-to-l from-transparent to-[#D4AF37]/50"></div>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C3] via-[#D4AF37] to-[#8C6D1F] uppercase drop-shadow-[0_10px_20px_rgba(212,175,55,0.15)] leading-none my-1">
              {brideFullName}
            </h1>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm font-playfair tracking-[0.3em] uppercase font-medium max-w-lg mx-auto mb-10 leading-relaxed text-center opacity-90">
            {quoteText}
          </p>

          {/* Date Box with Glassmorphism */}
          <div className="relative z-20 bg-[#121318]/40 border border-[#D4AF37]/30 rounded-3xl px-8 py-6 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col items-center hover:bg-[#121318]/60 hover:border-[#D4AF37]/60 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-3 relative z-10">
              {monthStr}
            </span>
            <div className="flex items-center justify-center gap-6 my-2 relative z-10">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-300">
                {dayName}
              </span>
              <span className="text-4xl sm:text-5xl font-black px-6 border-x border-[#D4AF37]/30 text-white drop-shadow-md">
                {dayNum}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-300">
                AT {timeStr.toUpperCase()}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.4em] text-[#D4AF37] mt-3 relative z-10">
              {yearStr}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-widest mt-12 max-w-sm text-center">
            <MapPin size={18} className="text-[#D4AF37] shrink-0" />
            <span className="leading-snug">{fullLocation}</span>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#07080A] font-cinzel">
        <SectionContainer>
          <div className="flex flex-col items-center mb-10 relative z-20">
            <TitleDivider />
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase drop-shadow-lg">Family Blessings</h2>
            <p className="text-[#D4AF37] text-sm sm:text-base italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-4 font-playfair tracking-wide">
              Request the honour of your presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-20 mt-12">
            {[ 
              { role: 'Groom', name: groomFullName, parents: groomParents, photo: groomPhoto },
              { role: 'Bride', name: brideFullName, parents: brideParents, photo: bridePhoto }
            ].map((person, idx) => (
              <div key={idx} className="bg-gradient-to-b from-[#15171F] to-[#0D0E14] p-8 rounded-[2rem] border border-[#D4AF37]/20 flex flex-col items-center hover:-translate-y-2 hover:border-[#D4AF37]/60 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FFF5C3] to-[#8C6D1F] mb-6 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-full bg-[#15171F] overflow-hidden flex items-center justify-center">
                    {person.photo ? (
                      <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl sm:text-5xl font-black text-[#D4AF37] drop-shadow-md">{person.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-wide">{person.name}</h3>
                <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em] mb-4 font-sans bg-[#D4AF37]/10 px-4 py-1 rounded-full">{person.role}</p>
                {person.parents && <p className="text-sm text-slate-300 font-playfair italic leading-relaxed">Child of {person.parents}</p>}
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>
    ),
    story: (
      <section key="story" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#050608] font-cinzel">
        <SectionContainer className="max-w-5xl">
          <div className="relative z-20">
            <TitleDivider />
            <h2 className="text-3xl sm:text-5xl font-bold text-[#D4AF37] mb-8 uppercase tracking-widest drop-shadow-md">
              {storyTitle}
            </h2>
            <div className="relative max-w-3xl mx-auto">
              <span className="absolute -top-8 -left-4 text-6xl text-[#D4AF37]/20 font-serif font-black">"</span>
              <p className="text-lg sm:text-2xl text-slate-200 italic leading-loose font-playfair relative z-10 px-6">
                {story}
              </p>
              <span className="absolute -bottom-10 -right-4 text-6xl text-[#D4AF37]/20 font-serif font-black">"</span>
            </div>
          </div>
        </SectionContainer>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#07080A] font-cinzel">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <TitleDivider />
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase drop-shadow-md">Itinerary</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-b from-[#15171F] to-[#0D0E14] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#D4AF37]/20 text-center hover:-translate-y-3 hover:border-[#D4AF37]/50 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <h3 className="text-xl font-bold text-white mb-6 relative z-20 tracking-wide leading-snug">{item.event}</h3>
                
                <div className="inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 mb-6 group-hover:bg-[#D4AF37]/10 transition-colors w-full">
                  <Clock className="w-6 h-6 text-[#D4AF37] mb-2" />
                  <span className="font-bold text-lg text-[#D4AF37] tracking-widest font-sans">{item.time}</span>
                </div>
                
                <p className="text-slate-400 text-sm font-playfair relative z-20 italic line-clamp-2">{item.venue || fullLocation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#050608] font-cinzel">
        <SectionContainer className="text-center">
          <div className="relative z-20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-[2px] rounded-full mx-auto mb-6 shadow-xl">
              <div className="w-full h-full bg-[#15171F] rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-[#D4AF37]" />
              </div>
            </div>
            
            <h3 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-widest uppercase">The Venue</h3>
            <p className="text-xl sm:text-2xl font-bold text-[#D4AF37] mb-4 tracking-wide">{fullLocation}</p>
            <p className="text-base text-slate-300 max-w-lg mx-auto mb-10 font-playfair italic">Join us for a magical evening of celebration and love.</p>

            {venuePhoto && (
              <div className="w-full h-64 sm:h-96 rounded-[2rem] overflow-hidden shadow-2xl border border-[#D4AF37]/30 mb-10 relative group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-inner border border-[#D4AF37]/30 mb-10 bg-[#0B0B0E] relative p-1">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '1.8rem' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#FFF5C3] hover:to-[#D4AF37] text-slate-900 px-10 py-4 rounded-full font-bold tracking-widest uppercase transition-all shadow-[0_10px_20px_rgba(212,175,55,0.3)] text-sm mb-10 hover:-translate-y-1 cursor-pointer font-sans"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#D4AF37]/20 pt-8 mt-4">
                <p className="text-xs tracking-[0.2em] uppercase font-bold text-slate-400 mb-2 font-sans">Contact Information</p>
                <p className="text-lg sm:text-xl font-bold text-[#D4AF37] tracking-widest font-sans">{contactNumbers}</p>
              </div>
            )}
          </div>
        </SectionContainer>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#07080A] font-cinzel">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <TitleDivider />
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase drop-shadow-md">Captured Moments</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/80 hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] transition-all duration-500 relative bg-[#121318] group">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#050608] font-cinzel">
        <SectionContainer className="text-center">
          <div className="relative z-20">
            <div className="flex flex-col items-center mb-12">
              <TitleDivider />
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase drop-shadow-md">The Countdown Begins</h2>
              <p className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold mt-3 font-sans">Awaiting the magical day</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto justify-items-center">
              {[
                { label: 'Days', value: timeLeft?.d ?? 0 },
                { label: 'Hours', value: timeLeft?.h ?? 0 },
                { label: 'Minutes', value: timeLeft?.m ?? 0 },
                { label: 'Seconds', value: timeLeft?.s ?? 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-full group">
                  <div className="w-full aspect-square max-w-[120px] rounded-[2rem] bg-gradient-to-br from-[#1A1C23] to-[#0D0E14] text-[#D4AF37] flex items-center justify-center mb-4 shadow-xl border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] group-hover:-translate-y-2 transition-all duration-500">
                    <span className="text-3xl sm:text-5xl font-black font-sans tracking-tight">{item.value}</span>
                  </div>
                  <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-slate-400 font-sans">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#07080A] font-cinzel">
        <SectionContainer className="text-center">
          <div className="relative z-20 flex flex-col items-center">

            <div className="flex flex-col items-center mb-10">
              <TitleDivider />
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase drop-shadow-md">Share Your Blessings</h2>
            </div>

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-64 rounded-full border-4 border-[#D4AF37]/30 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#FFF5C3] to-[#8C6D1F] p-1 shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all duration-300 group cursor-pointer mb-8 relative z-20 ${pulseRing ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <div className="w-full h-full rounded-full bg-[#15171F] flex items-center justify-center">
                <Heart className={`w-14 h-14 fill-[#D4AF37] text-[#D4AF37] drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12 fill-rose-500 text-rose-500' : 'group-hover:scale-110 group-hover:fill-rose-400 group-hover:text-rose-400'}`} />
              </div>
            </button>

            <div className="flex flex-col items-center mb-10 relative z-20 font-sans">
              <span className={`text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C3] to-[#D4AF37] block tracking-widest transition-transform duration-200 ${isCounterPopping ? 'scale-125' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 font-playfair">Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#FFF5C3] hover:to-[#D4AF37] text-slate-900 shadow-[0_10px_20px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 cursor-pointer font-sans relative z-20"
            >
              <Sparkles className="w-5 h-5" />
              Tap to Send Love
            </button>

          </div>
        </SectionContainer>
      </section>
    ),
    registry: (
      <section key="registry" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#050608] font-cinzel">
        <SectionContainer className="text-center">
          <Gift size={56} className="text-[#D4AF37] mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase mb-6 drop-shadow-md">Registry</h2>
          <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto mb-10 font-playfair italic">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-transparent border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-slate-900 px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all shadow-lg hover:-translate-y-1 cursor-pointer font-sans"
            >
              View Our Registry
            </a>
          )}
        </SectionContainer>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-20 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#07080A] font-cinzel">
        <SectionContainer className="max-w-3xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <TitleDivider />
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-widest uppercase drop-shadow-md">RSVP</h2>
            <p className="text-[#D4AF37] tracking-[0.2em] uppercase text-sm font-semibold mt-3 font-sans">We hope you can join us</p>
          </div>

          <form className="space-y-8 relative z-20 font-sans mt-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-3 ml-2">Guest Name</label>
                <input type="text" className="w-full bg-[#15171F] border border-[#D4AF37]/20 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-white placeholder-slate-600 shadow-inner" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-3 ml-2">Message to the Couple</label>
                <textarea rows={4} className="w-full bg-[#15171F] border border-[#D4AF37]/20 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-white placeholder-slate-600 resize-none shadow-inner" placeholder="Share your warm wishes..."></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4 ml-2">Attendance</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#D4AF37]/20 hover:border-[#D4AF37] bg-[#15171F] hover:bg-[#D4AF37]/5 rounded-2xl flex-1 transition-all">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#D4AF37]" />
                    <span className="text-white font-bold uppercase tracking-widest text-sm">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#D4AF37]/20 hover:border-[#D4AF37] bg-[#15171F] hover:bg-[#D4AF37]/5 rounded-2xl flex-1 transition-all">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#D4AF37]" />
                    <span className="text-white font-bold uppercase tracking-widest text-sm">Regretfully Declines</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#FFF5C3] hover:to-[#D4AF37] text-slate-900 font-bold tracking-widest uppercase text-sm px-14 py-5 rounded-full shadow-[0_10px_20px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-1 cursor-pointer">
                <Send size={18} />
                Send Response
              </button>
            </div>
          </form>
        </SectionContainer>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#050608] relative font-serif text-slate-100 flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#15171F]/80 backdrop-blur-xl text-[#D4AF37] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#D4AF37]/30 hover:scale-110 active:scale-95 transition-all"
          title={isMuted ? "Play Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Interactive Royal Gold Wax Seal / Medallion Overlay */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#000] transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpened ? 'opacity-0 pointer-events-none scale-105 blur-md' : 'opacity-100 scale-100 blur-0'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        {/* Background Image (Dark Luxury Royal Backdrop) */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-out ${isOpening ? 'scale-110 opacity-0 blur-xl' : 'scale-100 opacity-70 blur-0'}`}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507676184212-d0330a15233c?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[4px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Floating Gold Sparkles / Bokeh Particles */}
        <style>{`
          @keyframes majesticFloat {
            0% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0; }
            30% { opacity: 0.8; }
            70% { opacity: 0.8; }
            100% { transform: translateY(-100vh) scale(1.5) rotate(180deg); opacity: 0; }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 40px rgba(212,175,55,0.2); }
            50% { box-shadow: 0 0 80px rgba(212,175,55,0.5); }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(25)].map((_, i) => {
            const leftPos = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 6 + Math.random() * 8;
            const size = Math.random() * 4 + 2;
            return (
              <div
                key={i}
                className="absolute bottom-[-10%] rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF5C3] opacity-60 blur-[1px]"
                style={{
                  left: `${leftPos}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `majesticFloat ${duration}s ease-in infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Top Header Tag */}
        <div className={`absolute top-16 z-30 flex flex-col items-center text-center px-4 transition-all duration-[1200ms] ${isOpening ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center gap-4 text-[#D4AF37] mb-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <Sparkles size={16} className="animate-pulse text-[#D4AF37]" />
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>
          <span className="text-sm text-slate-300 font-cinzel tracking-[0.5em] uppercase font-bold drop-shadow-md">
            The Wedding Of
          </span>
        </div>

        {/* Central Royal Gold Wax Seal Medallion Button */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-[1500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpening ? 'scale-[3] opacity-0 blur-xl rotate-[30deg]' : 'scale-100 opacity-100 rotate-0'}`}>
          
          {/* Outer Pulsing Aura Rings */}
          <div className="absolute w-[22rem] h-[22rem] rounded-full border border-[#D4AF37]/20 animate-[spinSlow_20s_linear_infinite] pointer-events-none flex items-center justify-center">
             <div className="w-[110%] h-[110%] rounded-full border border-[#D4AF37]/10 border-dashed animate-[spinSlow_30s_linear_infinite_reverse]"></div>
          </div>
          <div className="absolute w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-3xl animate-pulse pointer-events-none"></div>

          {/* Royal Gold Medallion */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#E6C762] via-[#D4AF37] to-[#8C6D1F] p-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.5)] transition-transform duration-500 hover:scale-105 active:scale-95 group flex flex-col items-center justify-center text-center relative overflow-hidden" style={{ animation: 'pulseGlow 4s infinite' }}>
            
            {/* Shimmer Light Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out z-20" />

            {/* Inner Dark Disc with Script Monogram & Open Button */}
            <div className="w-full h-full rounded-full border-4 border-[#0D0E12] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1A1C23] to-[#0D0E12] shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)] relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 mix-blend-overlay"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 text-[#D4AF37] mb-4">
                  <Sparkles size={16} className="text-[#D4AF37] animate-pulse" />
                  <Heart size={20} className="fill-[#D4AF37] text-[#D4AF37] drop-shadow-md" />
                  <Sparkles size={16} className="text-[#D4AF37] animate-pulse" />
                </div>

                <span className="text-4xl sm:text-5xl font-script-alex text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C3] to-[#D4AF37] font-normal leading-tight mb-2 drop-shadow-lg">
                  {groomFullName.charAt(0)} & {brideFullName.charAt(0)}
                </span>

                <span className="text-xs font-bold font-cinzel tracking-[0.3em] uppercase text-[#D4AF37] my-3 opacity-90">
                  Open Invitation
                </span>

                <div className="mt-4 w-12 h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-[10px] text-slate-900 font-bold">TAP</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Floating Hint */}
        <div className={`absolute bottom-12 inset-x-0 mx-auto px-4 z-30 flex flex-col items-center justify-center text-center transition-all duration-[1200ms] ${isOpening ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <p className="text-xs sm:text-sm text-[#D4AF37] font-cinzel tracking-[0.3em] uppercase font-bold animate-bounce drop-shadow-lg text-center max-w-sm leading-relaxed">
            Tap the seal to enter
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-16 relative z-10 text-center bg-[#000] text-white w-full border-t border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <Heart className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37] mb-6 opacity-80" />
          <h2 className="text-3xl font-cinzel mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF5C3] tracking-widest uppercase">{rawCoupleNames}</h2>
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase font-sans">Elegantly crafted by Jaalam</p>
        </div>
      </footer>

    </div>
  );
}
