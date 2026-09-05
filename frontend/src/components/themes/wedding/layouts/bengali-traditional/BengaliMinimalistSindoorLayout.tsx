import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function BengaliMinimalistSindoorLayout({ content, website, colors }: WeddingLayoutProps) {
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

  const rawCoupleNames = content?.hero_title || "Rhea & Ishaan";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "Rhea").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "Ishaan").toUpperCase();

  const groomWords = groomFullName.split(/\s+/);
  const brideWords = brideFullName.split(/\s+/);

  const story = content?.about_text || "Two souls, one journey. We invite you to witness the beginning of our forever.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 23, 2027";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'OCTOBER');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '23');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2027');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '5:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Taj Bengal, Kolkata";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Arrival & Welcoming", date: rawDateStr, venue: location },
      { time: "6:00 PM", event: "Wedding Ceremony", date: rawDateStr, venue: location },
      { time: "8:00 PM", event: "Dinner & Reception", date: rawDateStr, venue: location }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Sen";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Roy";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence is our greatest gift. Should you wish to bless us further, our registry is available.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2027-10-23T17:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "CELEBRATING LOVE, TRADITION, AND A NEW BEGINNING";

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
        className="relative w-full flex flex-col justify-center items-center text-center bg-white text-[#1F2937] p-0 overflow-hidden py-16 sm:py-24 min-h-screen"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
        `}</style>
        
        {/* Stark White Minimalist Background */}
        <div className="absolute inset-0 bg-white" />

        {/* Hero Content Block */}
        <div className="relative z-30 max-w-lg mx-auto flex flex-col items-center px-6 pt-10">
          
          <div className="mb-12 flex flex-col items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shadow-[0_0_15px_rgba(225,29,72,0.5)]" />
             <div className="h-16 w-px bg-gradient-to-b from-[#E11D48] to-transparent" />
          </div>

          <p className="text-[#1F2937] text-[9px] sm:text-[10px] font-semibold tracking-[0.4em] uppercase mb-10 font-inter opacity-60">
            TOGETHER WITH THEIR FAMILIES
          </p>

          <div className="flex flex-col items-center leading-none">
             <h1 className="text-5xl sm:text-7xl font-playfair tracking-wide text-[#1F2937]">
                {groomFullName}
             </h1>
          </div>

          <div className="my-6">
            <span className="text-xl sm:text-2xl text-[#E11D48] font-playfair italic opacity-90">
              and
            </span>
          </div>

          <div className="flex flex-col items-center leading-none">
             <h1 className="text-5xl sm:text-7xl font-playfair tracking-wide text-[#1F2937]">
                {brideFullName}
             </h1>
          </div>

          <div className="my-16 text-center text-[#1F2937] font-inter text-[9px] sm:text-[10px] tracking-[0.25em] uppercase leading-relaxed max-w-sm opacity-60 font-medium">
            {quoteText}
          </div>

          {/* Minimalist Date Block */}
          <div className="flex flex-col items-center gap-4 w-full">
             <span className="text-[#E11D48] font-inter font-bold tracking-[0.2em] text-[10px] uppercase">{dayName}</span>
             <div className="flex items-center gap-6">
                <span className="text-sm font-inter tracking-[0.2em] uppercase text-[#1F2937] opacity-60">{monthStr}</span>
                <span className="text-4xl sm:text-5xl font-playfair text-[#1F2937]">{dayNum}</span>
                <span className="text-sm font-inter tracking-[0.2em] uppercase text-[#1F2937] opacity-60">{yearStr}</span>
             </div>
             <span className="text-[#1F2937] opacity-50 font-inter font-medium tracking-[0.1em] text-[10px] uppercase mt-2">{timeStr}</span>
          </div>

          <div className="mt-12">
             <span className="font-semibold text-[#1F2937] font-inter tracking-[0.15em] text-[10px] uppercase opacity-70">{location}</span>
          </div>

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-[#FAFAFA] text-[#1F2937]">
        <div className="flex flex-col items-center mb-16">
           <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mb-6" />
           <h2 className="text-2xl sm:text-4xl font-playfair text-[#1F2937] tracking-wider uppercase">Key People</h2>
           <div className="w-8 h-px bg-[#1F2937]/20 mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 relative z-20">
          {/* Groom Block */}
          <div className="flex flex-col items-center group">
            {groomPhoto ? (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mb-8 border border-[#1F2937]/10">
                <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-[#1F2937]/10 flex items-center justify-center mb-8 text-[#1F2937]">
                <span className="text-5xl font-playfair">{groomFullName.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-xl sm:text-2xl text-[#1F2937] mb-2 font-playfair tracking-wide uppercase">{groomFullName}</h3>
            <p className="text-[9px] text-[#E11D48] font-bold uppercase tracking-[0.25em] mb-4 font-inter">The Groom</p>
            {groomParents && <p className="text-xs text-[#1F2937]/60 font-inter uppercase tracking-[0.1em]">Son of {groomParents}</p>}
          </div>

          {/* Bride Block */}
          <div className="flex flex-col items-center group">
            {bridePhoto ? (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mb-8 border border-[#1F2937]/10">
                <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-[#1F2937]/10 flex items-center justify-center mb-8 text-[#1F2937]">
                <span className="text-5xl font-playfair">{brideFullName.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-xl sm:text-2xl text-[#1F2937] mb-2 font-playfair tracking-wide uppercase">{brideFullName}</h3>
            <p className="text-[9px] text-[#E11D48] font-bold uppercase tracking-[0.25em] mb-4 font-inter">The Bride</p>
            {brideParents && <p className="text-xs text-[#1F2937]/60 font-inter uppercase tracking-[0.1em]">Daughter of {brideParents}</p>}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center bg-white text-[#1F2937]">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
           <h2 className="text-2xl sm:text-4xl text-[#1F2937] mb-12 font-playfair tracking-widest uppercase">
             {storyTitle}
           </h2>
           <p className="text-lg sm:text-xl text-[#1F2937]/80 leading-loose font-inter font-light">
             "{story}"
           </p>
           <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mt-12" />
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-[#FAFAFA] text-[#1F2937]">
        <div className="flex flex-col items-center mb-20">
          <h2 className="text-2xl sm:text-4xl text-[#1F2937] font-playfair tracking-widest uppercase">Itinerary</h2>
          <div className="w-8 h-px bg-[#1F2937]/20 mt-6" />
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#1F2937]/10 -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-12">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row items-center justify-between w-full relative">
                <div className="md:w-5/12 text-center md:text-right md:pr-10">
                   <div className="text-[#E11D48] font-semibold font-inter tracking-[0.15em] text-[10px] mb-2 uppercase">
                     {item.time}
                   </div>
                   <h3 className="text-lg text-[#1F2937] font-playfair uppercase tracking-wider">{item.event}</h3>
                </div>
                
                <div className="w-3 h-3 rounded-full bg-white border border-[#E11D48] z-10 my-4 md:my-0 hidden md:flex items-center justify-center">
                   <div className="w-1 h-1 rounded-full bg-[#E11D48]" />
                </div>
                
                <div className="md:w-5/12 text-center md:text-left md:pl-10">
                   <p className="text-[#1F2937]/60 text-xs font-inter tracking-wide uppercase">{item.venue || location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 max-w-5xl mx-auto bg-white text-[#1F2937]">
        <div className="text-center">
          <div className="flex flex-col items-center mb-16">
            <h3 className="text-2xl sm:text-4xl text-[#1F2937] font-playfair tracking-widest uppercase">Location</h3>
            <div className="w-8 h-px bg-[#1F2937]/20 mt-6" />
          </div>

          <p className="text-lg text-[#1F2937] mb-3 font-inter uppercase tracking-[0.15em] font-light">{location}</p>
          <p className="text-xs text-[#1F2937]/50 max-w-md mx-auto mb-16 font-inter uppercase tracking-[0.1em]">We look forward to celebrating with you.</p>

          <div className="max-w-4xl mx-auto">
            {venuePhoto && (
              <div className="w-full h-64 sm:h-[28rem] overflow-hidden mb-12 grayscale">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden border border-[#1F2937]/10 mb-12 bg-gray-50 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white border border-[#1F2937] hover:bg-[#1F2937] hover:text-white text-[#1F2937] px-10 py-4 font-medium tracking-[0.2em] uppercase transition-colors text-[10px] mb-12 font-inter"
              >
                Directions
              </a>
            )}

            {contactNumbers && (
              <div className="pt-8 flex flex-col items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mb-4" />
                <p className="text-[8px] tracking-[0.3em] uppercase font-bold text-[#1F2937]/50 mb-2 font-inter">Inquiries</p>
                <p className="text-sm font-light tracking-[0.1em] text-[#1F2937] font-inter uppercase">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 text-center max-w-6xl mx-auto bg-[#FAFAFA] text-[#1F2937]">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl sm:text-4xl text-[#1F2937] font-playfair tracking-widest uppercase">Moments</h2>
          <div className="w-8 h-px bg-[#1F2937]/20 mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square overflow-hidden bg-gray-100 group">
               <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white text-[#1F2937] text-center border-y border-[#1F2937]/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-4xl mb-16 text-[#1F2937] font-playfair tracking-widest uppercase">Anticipation</h2>

          <div className="flex justify-center divide-x divide-[#1F2937]/10">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center px-4 sm:px-10">
                <span className="text-3xl sm:text-6xl font-playfair text-[#1F2937] mb-4">{item.value}</span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase font-bold text-[#E11D48] font-inter">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#FAFAFA] text-[#1F2937]">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-16">
            <h2 className="text-2xl sm:text-4xl text-[#1F2937] font-playfair tracking-widest uppercase mb-4">Blessings</h2>
            <p className="text-[#1F2937]/50 tracking-[0.2em] uppercase text-[9px] font-semibold font-inter">Tap to send wishes</p>
          </div>

          <div className="flex flex-col items-center justify-center group relative">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-40 h-40 rounded-full border border-[#E11D48]/30 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-20 h-20 rounded-full bg-white border border-[#E11D48] flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer mb-8 relative z-20 ${pulseRing ? 'scale-110 bg-[#E11D48]/5' : 'hover:scale-105 active:scale-95 hover:bg-[#E11D48]/5'}`}
            >
              <Heart className={`w-8 h-8 stroke-[#E11D48] ${pulseRing ? 'fill-[#E11D48]' : 'fill-transparent'} transition-all duration-300 group-hover:fill-[#E11D48]/20`} />
            </button>

            <div className="flex flex-col items-center">
              <span className={`text-4xl sm:text-5xl font-playfair text-[#1F2937] block transition-transform duration-200 ${isCounterPopping ? 'scale-110 text-[#E11D48]' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-[9px] font-semibold text-[#1F2937]/50 uppercase tracking-[0.2em] font-inter mt-3">Received</span>
            </div>

          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto bg-white text-[#1F2937] text-center border-t border-[#1F2937]/5">
        <div className="flex flex-col items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mb-8" />
          <h2 className="text-2xl sm:text-4xl text-[#1F2937] font-playfair tracking-widest uppercase mb-6">Registry</h2>
          <p className="text-sm text-[#1F2937]/60 leading-relaxed max-w-md mx-auto mb-10 font-inter font-light">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-[#1F2937] hover:bg-[#1F2937] hover:text-white text-[#1F2937] px-10 py-4 font-medium tracking-[0.2em] uppercase transition-colors text-[10px] font-inter"
            >
              View Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#FAFAFA] text-[#1F2937]">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl text-[#1F2937] font-playfair tracking-widest uppercase mb-4">RSVP</h2>
          <div className="w-8 h-px bg-[#1F2937]/20 mx-auto mt-6" />
        </div>

        <div className="bg-white p-8 sm:p-12 border border-[#1F2937]/10 text-left relative shadow-sm">
          <form className="space-y-8 relative z-20" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-8">
              <div>
                <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/60 mb-2 font-inter">Name</label>
                <input type="text" className="w-full bg-transparent border-b border-[#1F2937]/20 py-3 outline-none focus:border-[#E11D48] transition-colors font-playfair text-lg text-[#1F2937] placeholder-[#1F2937]/30 rounded-none" placeholder="Enter full name" />
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/60 mb-2 font-inter">Message</label>
                <textarea rows={3} className="w-full bg-transparent border-b border-[#1F2937]/20 py-3 outline-none focus:border-[#E11D48] transition-colors font-playfair text-lg text-[#1F2937] placeholder-[#1F2937]/30 resize-none rounded-none" placeholder="Any message..."></textarea>
              </div>

              <div className="pt-4">
                <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/60 mb-6 font-inter">Attendance</label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-4 cursor-pointer group flex-1">
                    <div className="w-4 h-4 rounded-full border border-[#1F2937]/30 flex items-center justify-center group-hover:border-[#E11D48] transition-colors">
                       <input type="radio" name="attending" className="w-2 h-2 appearance-none rounded-full bg-[#E11D48] opacity-0 checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[#1F2937] font-inter uppercase tracking-[0.1em] text-[10px] group-hover:text-[#E11D48] transition-colors">Accepts</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group flex-1">
                    <div className="w-4 h-4 rounded-full border border-[#1F2937]/30 flex items-center justify-center group-hover:border-[#E11D48] transition-colors">
                       <input type="radio" name="attending" className="w-2 h-2 appearance-none rounded-full bg-[#E11D48] opacity-0 checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[#1F2937] font-inter uppercase tracking-[0.1em] text-[10px] group-hover:text-[#E11D48] transition-colors">Declines</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-10 text-center">
              <button type="button" className="inline-block bg-[#1F2937] hover:bg-[#E11D48] text-white px-12 py-4 font-medium tracking-[0.2em] uppercase transition-colors text-[10px] font-inter">
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Minimalist Floating Audio Control */}
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
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white text-[#1F2937] border border-[#1F2937]/10 hover:border-[#E11D48] hover:text-[#E11D48] transition-all mix-blend-difference"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* Welcome Screen: Minimalist Sindoor Dot */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-[1500ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer`}
      >
        <div className={`relative flex flex-col items-center justify-center transition-all duration-[2000ms] ease-in-out ${isOpening ? 'scale-[20] opacity-0' : 'scale-100 opacity-100'}`}>
          
          <div className="w-12 h-12 rounded-full bg-[#E11D48] shadow-[0_0_40px_rgba(225,29,72,0.4)] animate-pulse relative group">
             {/* Interaction ring */}
             <div className="absolute inset-0 rounded-full border border-[#E11D48] animate-ping opacity-50" />
          </div>
          
          <div className={`absolute top-20 text-center w-64 transition-all duration-700 ${isOpening ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
             <p className="text-[9px] text-[#1F2937]/50 font-inter font-medium tracking-[0.3em] uppercase">
                Tap to enter
             </p>
          </div>
          
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-16 relative z-10 text-center bg-white text-[#1F2937] w-full border-t border-[#1F2937]/10">
        <h2 className="text-xl font-playfair mb-4 tracking-widest uppercase">{rawCoupleNames}</h2>
        <p className="text-[#1F2937]/40 text-[8px] tracking-[0.4em] uppercase font-inter">Created by Jaalam</p>
      </footer>

    </div>
  );
}
