import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation, Crosshair } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ChristianClassicLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 1200);
  };

  const coupleNames = content?.hero_title || "Alex & Jordan";
  const names = coupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomName = names[0]?.trim() || "Alex";
  const brideName = names[1]?.trim() || "Jordan";

  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "September 15, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'SEP');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Grand Estate, New York";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Holy Wedding Ceremony", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "Cocktail Hour & Greetings", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Grand Gala Dinner & Dancing", date: rawDateStr, venue: location }
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

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "Together with their families, invite you to celebrate their wedding";

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

  const CardWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-200/60 relative overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-slate-50/30 opacity-80 z-0"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );

  const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="flex flex-col items-center mb-12 text-center relative z-20">
      <div className="flex items-center gap-4 mb-4 opacity-70">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <Sparkles size={16} className="text-slate-400 animate-pulse" />
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      </div>
      <h2 className="text-3xl sm:text-5xl font-playfair font-black text-slate-800 tracking-wide">{title}</h2>
      {subtitle && <p className="text-slate-500 text-sm italic leading-relaxed mt-4 font-garamond">{subtitle}</p>}
    </div>
  );

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAFAFA] p-0 overflow-hidden py-24 min-h-screen">

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,800;0,900;1,400&family=Great+Vibes&family=Inter:wght@300;400;600&display=swap');
          .font-garamond { font-family: 'Cormorant Garamond', serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-script { font-family: 'Great Vibes', cursive; }
          .font-sans-elegant { font-family: 'Inter', sans-serif; }
          @keyframes floatWhiteParticles {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            50% { opacity: 0.6; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }
          @keyframes slowPulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}</style>
        
        {/* Soft Heavenly Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#F8F9FA] to-[#F1F3F5] z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply z-0"></div>

        {/* Ethereal Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-[-5%] w-3 h-3 rounded-full bg-white opacity-40 shadow-[0_0_15px_rgba(255,255,255,0.8)] filter blur-[1px]"
              style={{
                left: `${(i * 11 + 3) % 100}%`,
                animation: `floatWhiteParticles ${10 + (i % 8)}s linear infinite`,
                animationDelay: `${(i % 5)}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Central Block */}
        <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center px-4 font-playfair animate-[slowPulse_8s_ease-in-out_infinite]">

          <div className="mb-6 flex flex-col items-center">
            <span className="w-px h-16 bg-gradient-to-b from-transparent to-slate-300 mb-4"></span>
            <span className="text-slate-400 text-xs sm:text-sm font-sans-elegant tracking-[0.4em] uppercase font-semibold">
              The Wedding Celebration
            </span>
          </div>

          <div className="relative my-8 flex flex-col items-center w-full">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-800 tracking-tight leading-none mb-2">
              {groomName}
            </h1>
            
            <div className="flex items-center justify-center gap-6 my-4 w-full text-slate-300">
              <span className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-slate-300"></span>
              <span className="text-4xl sm:text-6xl font-script text-slate-400 px-2 italic">&</span>
              <span className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-slate-300"></span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-800 tracking-tight leading-none">
              {brideName}
            </h1>
          </div>

          <p className="text-slate-500 text-sm font-garamond italic tracking-widest uppercase max-w-md mx-auto mb-12 leading-relaxed">
            {quoteText}
          </p>

          {/* Minimalist Date Block */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 mt-6 mb-10 px-8 py-6 rounded-[2rem] bg-white/60 backdrop-blur-md border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-400 tracking-[0.3em] uppercase">{monthStr}</span>
              <span className="text-xs font-semibold text-slate-400 tracking-[0.2em] uppercase mt-1">{dayName}</span>
            </div>
            <div className="w-px h-12 bg-slate-300"></div>
            <span className="text-5xl sm:text-6xl font-black text-slate-800">{dayNum}</span>
            <div className="w-px h-12 bg-slate-300"></div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-400 tracking-[0.3em] uppercase">{yearStr}</span>
              <span className="text-xs font-semibold text-slate-400 tracking-[0.2em] uppercase mt-1">{timeStr}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 text-sm font-sans-elegant text-slate-500 tracking-widest mt-4">
            <MapPin size={16} className="text-slate-400 mb-1" />
            <span className="uppercase">{location}</span>
          </div>

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="Key People" subtitle="With the blessings of our beloved families" />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mt-16 relative z-20">
            {[ 
              { role: 'Groom', name: groomName, parents: groomParents, photo: groomPhoto },
              { role: 'Bride', name: brideName, parents: brideParents, photo: bridePhoto }
            ].map((person, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-8">
                  {/* Decorative Frame */}
                  <div className="absolute inset-0 rounded-full border border-slate-300 scale-[1.15] group-hover:scale-[1.2] transition-transform duration-700 pointer-events-none"></div>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-xl group-hover:shadow-2xl transition-all duration-500 z-10 relative">
                    {person.photo ? (
                      <img src={person.photo} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                        <Heart className="w-12 h-12 fill-slate-200" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-3xl font-playfair font-black text-slate-800 mb-3">{person.name}</h3>
                <p className="text-xs text-slate-400 font-sans-elegant font-bold uppercase tracking-[0.3em] mb-4">{person.role}</p>
                {person.parents && <p className="text-base text-slate-500 font-garamond italic">Child of {person.parents}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <CardWrapper>
            <SectionHeading title={storyTitle} />
            <div className="relative mt-8">
              <span className="absolute -top-10 -left-6 text-8xl text-slate-100 font-serif font-black select-none pointer-events-none">"</span>
              <p className="text-xl sm:text-2xl text-slate-600 font-garamond leading-loose italic relative z-10 px-4 sm:px-8">
                {story}
              </p>
              <span className="absolute -bottom-16 -right-6 text-8xl text-slate-100 font-serif font-black select-none pointer-events-none">"</span>
            </div>
          </CardWrapper>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="Itinerary" subtitle="Join us through these joyous moments" />

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mt-16">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-[2rem] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-400 group-hover:bg-slate-100 transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-slate-800 mb-4">{item.event}</h3>
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 font-sans-elegant text-xs font-bold tracking-widest uppercase mb-4">{item.time}</span>
                <p className="text-slate-500 font-garamond italic text-lg leading-relaxed">{item.venue || location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <CardWrapper className="text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-400 shadow-inner">
              <MapPin className="w-8 h-8" />
            </div>
            
            <h3 className="text-4xl font-playfair font-black text-slate-800 mb-6">The Venue</h3>
            <p className="text-2xl font-garamond italic text-slate-600 mb-12">{location}</p>

            {venuePhoto && (
              <div className="w-full h-72 sm:h-96 rounded-[2rem] overflow-hidden shadow-2xl mb-12 group relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-inner border border-slate-200 mb-12 bg-slate-50 p-2 relative group">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '1.5rem' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-sans-elegant text-sm font-semibold tracking-widest uppercase transition-all shadow-lg hover:-translate-y-1"
                >
                  <Navigation size={16} />
                  Get Directions
                </a>
              )}
              {contactNumbers && (
                <div className="px-10 py-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-sans-elegant text-sm font-semibold tracking-widest">
                  RSVP: {contactNumbers}
                </div>
              )}
            </div>
          </CardWrapper>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Captured Moments" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative bg-white group border border-slate-100">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <CardWrapper className="text-center">
            <SectionHeading title="The Countdown Begins" subtitle="Awaiting the beautiful day" />

            <div className="flex gap-4 sm:gap-8 justify-center mt-12">
              {[
                { label: 'Days', value: timeLeft?.d ?? 0 },
                { label: 'Hours', value: timeLeft?.h ?? 0 },
                { label: 'Minutes', value: timeLeft?.m ?? 0 },
                { label: 'Seconds', value: timeLeft?.s ?? 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center mb-4 transition-transform hover:-translate-y-2">
                    <span className="text-2xl sm:text-4xl font-playfair font-black text-slate-800">{item.value}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold text-slate-400 font-sans-elegant">{item.label}</span>
                </div>
              ))}
            </div>
          </CardWrapper>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto">
          <CardWrapper className="text-center border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <SectionHeading title="Share Your Love" subtitle="Tap the heart to send warm wishes" />

            <div className="relative flex flex-col items-center mt-12">
              {pulseRing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-16">
                  <div className="w-56 h-56 rounded-full border-4 border-rose-200 animate-ping"></div>
                </div>
              )}

              <button
                type="button"
                onClick={handleTapWish}
                className={`w-36 h-36 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 group cursor-pointer mb-8 relative z-20 border border-rose-50 ${pulseRing ? 'scale-110 shadow-2xl' : 'hover:scale-105 active:scale-95'}`}
              >
                <Heart className={`w-14 h-14 transition-all duration-300 ${pulseRing ? 'scale-125 rotate-12 fill-rose-500 text-rose-500' : 'fill-slate-200 text-slate-200 group-hover:fill-rose-400 group-hover:text-rose-400 group-hover:scale-110'}`} />
              </button>

              <div className="flex flex-col items-center mb-10">
                <span className={`text-6xl sm:text-8xl font-playfair font-black text-slate-800 block transition-transform duration-300 ${isCounterPopping ? 'scale-110 text-rose-500' : 'scale-100'}`}>
                  {wishCount}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-sans-elegant mt-4">Wishes Received</span>
              </div>
            </div>
          </CardWrapper>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Gift size={48} className="text-slate-300 mx-auto mb-8" />
          <h2 className="text-4xl font-playfair font-black text-slate-800 mb-6">Registry</h2>
          <p className="text-lg text-slate-500 font-garamond italic max-w-xl mx-auto mb-10 leading-relaxed">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white border border-slate-300 hover:border-slate-800 text-slate-600 hover:text-slate-900 px-10 py-4 rounded-full font-sans-elegant text-sm font-semibold tracking-widest uppercase transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              View Our Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <CardWrapper>
            <SectionHeading title="RSVP" subtitle="We kindly request your response" />

            <form className="space-y-8 relative z-20 font-sans-elegant mt-12 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 ml-4">Guest Name</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-full px-8 py-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-slate-800 placeholder-slate-400 shadow-sm" placeholder="Enter your full name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 ml-4">Message</label>
                  <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-6 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-slate-800 placeholder-slate-400 resize-none shadow-sm" placeholder="Leave a message for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-4 ml-4">Attendance</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-slate-200 hover:border-slate-400 bg-white rounded-[2rem] flex-1 transition-all shadow-sm hover:shadow-md">
                      <input type="radio" name="attending" className="w-5 h-5 accent-slate-800" />
                      <span className="text-slate-700 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-slate-200 hover:border-slate-400 bg-white rounded-[2rem] flex-1 transition-all shadow-sm hover:shadow-md">
                      <input type="radio" name="attending" className="w-5 h-5 accent-slate-800" />
                      <span className="text-slate-700 font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold tracking-widest uppercase text-sm px-14 py-5 rounded-full shadow-lg transition-all hover:-translate-y-1">
                  <Send size={16} />
                  Send Response
                </button>
              </div>
            </form>
          </CardWrapper>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative font-serif text-slate-800 flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-200 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Interactive Grand White Palace Double Door Opening Reveal */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-all duration-[1500ms] ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >

        {/* Full Screen Background Ethereal Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100" />

        {/* Ethereal Floating Orbs on Welcome Screen */}
        <style>{`
          @keyframes orbFloat {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translate(0, -100vh) scale(1.5); opacity: 0; }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-[-10%] rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,1)] filter blur-[2px]"
              style={{
                left: `${(i * 15 + 5) % 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animation: `orbFloat ${15 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Left Grand Door Panel (Soft White Velvet/Marble texture) */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-slate-50 transition-all duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-20 border-r border-slate-200 shadow-[10px_0_40px_rgba(0,0,0,0.03)] flex justify-end items-center overflow-hidden ${isOpening ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        >
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply"></div>
           <div className="w-1/2 h-[80%] border-r-2 border-y-2 border-slate-200/50 rounded-r-[4rem] mr-8 shadow-inner"></div>
        </div>

        {/* Right Grand Door Panel */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-slate-50 transition-all duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] z-20 border-l border-slate-200 shadow-[-10px_0_40px_rgba(0,0,0,0.03)] flex justify-start items-center overflow-hidden ${isOpening ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        >
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply"></div>
           <div className="w-1/2 h-[80%] border-l-2 border-y-2 border-slate-200/50 rounded-l-[4rem] ml-8 shadow-inner"></div>
        </div>

        {/* Top Header Banner */}
        <div className={`absolute top-16 sm:top-20 z-30 flex flex-col items-center text-center px-4 transition-all duration-1000 ${isOpening ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}>
          <span className="text-xs sm:text-sm text-slate-400 font-sans-elegant tracking-[0.4em] uppercase font-bold mb-4">
            The Wedding Of
          </span>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="h-px w-12 bg-slate-300"></span>
            <Heart size={12} className="fill-slate-200 text-slate-200" />
            <span className="h-px w-12 bg-slate-300"></span>
          </div>
        </div>

        {/* Center Classic Minimalist Seal / Entrance Button */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-[1200ms] ${isOpening ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
          
          <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-slate-200 animate-ping pointer-events-none opacity-50" />

          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white p-2 shadow-[0_15px_50px_rgba(0,0,0,0.08)] transition-transform duration-500 hover:scale-105 active:scale-95 border border-slate-100 group flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
            
            <div className="w-full h-full rounded-full border-2 border-slate-100 flex flex-col items-center justify-center p-6 text-center relative bg-white">
              <span className="text-4xl sm:text-5xl font-script text-slate-800 leading-tight mb-2">
                {groomName.charAt(0)} & {brideName.charAt(0)}
              </span>

              <span className="text-[9px] sm:text-[10px] font-bold font-sans-elegant tracking-[0.25em] uppercase text-slate-400 my-2">
                Open Invitation
              </span>

              <div className="mt-2 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Tap</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-playfair font-black text-slate-800 mt-10 tracking-wide">
            {groomName} & {brideName}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm tracking-[0.2em] font-sans-elegant uppercase mt-3 font-semibold">
            {rawDateStr}
          </p>
        </div>

        {/* Bottom Re-open Hint */}
        <div className={`absolute bottom-12 inset-x-0 mx-auto px-4 z-30 flex flex-col items-center justify-center text-center transition-all duration-700 ${isOpening ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] sm:text-xs text-slate-400 font-sans-elegant tracking-[0.3em] uppercase font-bold animate-pulse">
            Tap the seal to enter
          </p>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-16 relative z-10 text-center bg-white text-slate-800 w-full border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <Heart className="w-8 h-8 text-slate-200 fill-slate-100 mb-6" />
          <h2 className="text-3xl font-playfair font-black mb-4 tracking-wide">{coupleNames}</h2>
          <p className="text-slate-400 text-xs tracking-[0.3em] uppercase font-sans-elegant font-semibold">Crafted with love by Jaalam</p>
        </div>
      </footer>

    </div>
  );
}
