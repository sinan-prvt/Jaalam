import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function BengaliRedGoldModernLayout({ content, website, colors }: WeddingLayoutProps) {
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
    }, 800);
  };

  const rawCoupleNames = content?.hero_title || "Aditi & Rahul";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "Aditi").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "Rahul").toUpperCase();

  const groomWords = groomFullName.split(/\s+/);
  const brideWords = brideFullName.split(/\s+/);

  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, November 28, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'NOVEMBER');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '28');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "ITC Royal Bengal, Kolkata";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Gaye Holud", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Wedding Ceremony", date: rawDateStr, venue: location },
      { time: "9:00 PM", event: "Grand Reception", date: rawDateStr, venue: location }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Sharma";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Chatterjee";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a cash contribution towards our honeymoon registry would be warmly appreciated.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2027-01-15T16:00";
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
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAFAFA] text-[#1A1A1A] p-0 overflow-hidden py-10 sm:py-14 min-h-[90vh]"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          .font-outfit { font-family: 'Outfit', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          @keyframes subtleFloat {
            0% { transform: translateY(0px); opacity: 0.1; }
            50% { transform: translateY(-20px); opacity: 0.3; }
            100% { transform: translateY(0px); opacity: 0.1; }
          }
        `}</style>
        
        {/* Subtle geometric overlay */}
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D90429]/5 to-[#F59E0B]/10 blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#D90429]/5 to-[#F59E0B]/10 blur-3xl opacity-60" />

        {/* Hero Card Content Block */}
        <div className="relative z-30 pt-16 max-w-lg mx-auto flex flex-col items-center px-4 pb-4">
          
          <div className="mb-8 flex items-center justify-center gap-4">
             <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#F59E0B]" />
             <Sparkles className="w-5 h-5 text-[#F59E0B]" />
             <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#F59E0B]" />
          </div>

          <p className="text-[#D90429] text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase max-w-xs sm:max-w-md mx-auto mb-6 font-outfit">
            TOGETHER WITH THEIR FAMILIES
          </p>

          <div className="flex flex-col items-center leading-tight">
             <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-outfit tracking-tight text-[#1A1A1A] uppercase">
                {groomFullName}
             </h1>
          </div>

          <span className="text-3xl sm:text-4xl text-[#F59E0B] font-playfair italic my-4 font-normal">
            &
          </span>

          <div className="flex flex-col items-center leading-tight">
             <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-outfit tracking-tight text-[#1A1A1A] uppercase">
                {brideFullName}
             </h1>
          </div>

          <div className="mt-8 mb-4 text-center space-y-1 text-[#4A4A4A] font-outfit text-[11px] sm:text-xs tracking-[0.2em] font-medium uppercase leading-relaxed max-w-sm">
            {quoteText}
          </div>

          <div className="w-px h-16 bg-gradient-to-b from-[#F59E0B]/50 to-transparent my-6" />

          {/* Minimalist Date Block */}
          <div className="flex flex-col items-center gap-1">
             <span className="text-[#D90429] font-outfit font-bold tracking-[0.2em] text-xs uppercase">{monthStr} {yearStr}</span>
             <span className="text-4xl sm:text-5xl font-playfair font-bold text-[#1A1A1A]">{dayNum}</span>
             <span className="text-[#F59E0B] font-outfit font-bold tracking-[0.2em] text-[10px] uppercase">{dayName} | {timeStr}</span>
          </div>

          <div className="mt-8 px-6 py-2 bg-white/80 backdrop-blur-md rounded-full border border-[#D90429]/10 shadow-sm text-center">
             <span className="font-bold text-[#1A1A1A] font-outfit tracking-[0.1em] text-xs uppercase">{location}</span>
          </div>

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-white text-[#1A1A1A]">
        <div className="flex flex-col items-center mb-12">
           <div className="text-[#D90429] text-[10px] font-bold tracking-[0.3em] uppercase mb-3 font-outfit">The Couple</div>
           <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight font-outfit">Key People & Family</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-20">
          {/* Groom Card */}
          <div className="group bg-[#FAFAFA] p-8 rounded-[2rem] border border-[#E5E5E5] flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:border-[#D90429]/30 transition-all duration-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#D90429]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            
            {groomPhoto ? (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 relative z-10">
                <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mb-6 text-[#D90429] shadow-lg relative z-10">
                <span className="text-5xl font-outfit font-black">{groomFullName.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2 font-outfit">{groomFullName}</h3>
            <p className="text-xs text-[#F59E0B] font-bold uppercase tracking-[0.2em] mb-3 font-outfit">The Groom</p>
            {groomParents && <p className="text-sm text-[#737373] font-playfair italic">Son of {groomParents}</p>}
          </div>

          {/* Bride Card */}
          <div className="group bg-[#FAFAFA] p-8 rounded-[2rem] border border-[#E5E5E5] flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:border-[#D90429]/30 transition-all duration-500 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F59E0B]/10 rounded-tr-full -ml-4 -mb-4 transition-transform group-hover:scale-110" />

            {bridePhoto ? (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 relative z-10">
                <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mb-6 text-[#D90429] shadow-lg relative z-10">
                <span className="text-5xl font-outfit font-black">{brideFullName.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2 font-outfit">{brideFullName}</h3>
            <p className="text-xs text-[#F59E0B] font-bold uppercase tracking-[0.2em] mb-3 font-outfit">The Bride</p>
            {brideParents && <p className="text-sm text-[#737373] font-playfair italic">Daughter of {brideParents}</p>}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 text-center bg-[#FAFAFA] text-[#1A1A1A] border-y border-[#E5E5E5]">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
           <Heart className="w-8 h-8 text-[#D90429] mb-6 animate-pulse" />
           <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] mb-8 font-outfit tracking-tight">
             {storyTitle}
           </h2>
           <p className="text-lg sm:text-2xl text-[#4A4A4A] italic leading-relaxed font-playfair">
             "{story}"
           </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-white text-[#1A1A1A]">
        <div className="flex flex-col items-center mb-16">
          <div className="text-[#F59E0B] text-[10px] font-bold tracking-[0.3em] uppercase mb-3 font-outfit">Itinerary</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] font-outfit tracking-tight">Schedule of Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#FAFAFA] rounded-2xl p-8 shadow-sm border border-[#E5E5E5] text-left hover:-translate-y-2 hover:shadow-xl hover:border-[#D90429]/40 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                 <Clock className="w-12 h-12 text-[#D90429]" />
              </div>
              <div className="text-[#F59E0B] font-bold font-outfit tracking-[0.15em] text-sm mb-3">
                 {item.time}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 font-outfit relative z-20">{item.event}</h3>
              <p className="text-[#737373] text-sm font-playfair relative z-20">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 max-w-5xl mx-auto bg-white text-[#1A1A1A]">
        <div className="bg-[#FAFAFA] rounded-[3rem] p-8 sm:p-16 text-center shadow-lg border border-[#E5E5E5] relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md border border-[#F59E0B]/20 text-[#D90429] rotate-3 hover:rotate-12 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] mb-4 font-outfit tracking-tight">Venue & Location</h3>
            <p className="text-xl font-semibold text-[#D90429] mb-3 font-outfit">{location}</p>
            <p className="text-base text-[#737373] max-w-md mx-auto mb-10 font-playfair">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-64 sm:h-96 rounded-[2rem] overflow-hidden shadow-xl mb-10 relative group">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-inner border border-[#E5E5E5] mb-8 bg-gray-100">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#D90429] text-white px-8 py-4 rounded-full font-bold tracking-[0.15em] uppercase transition-all shadow-md text-xs mb-8 hover:scale-105 font-outfit"
              >
                <Navigation size={16} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#E5E5E5] pt-8 mt-4">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#F59E0B] mb-2 font-outfit">RSVP / Contact Info</p>
                <p className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-outfit">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 text-center max-w-6xl mx-auto bg-white text-[#1A1A1A]">
        <div className="flex flex-col items-center mb-12">
          <div className="text-[#D90429] text-[10px] font-bold tracking-[0.3em] uppercase mb-3 font-outfit">Memories</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] font-outfit tracking-tight">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-[2rem] overflow-hidden shadow-sm border border-[#E5E5E5] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative bg-gray-50">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 bg-[#D90429] text-white my-8 mx-4 sm:mx-8 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay" />
        
        <div className="max-w-4xl mx-auto relative z-20 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white font-outfit tracking-tight">Counting Down To The Big Day</h2>
          <p className="text-sm sm:text-lg mb-10 text-white/80 font-playfair italic">Our Bengali Wedding Celebration</p>

          <div className="flex gap-4 sm:gap-8 justify-center flex-wrap">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-lg border border-white/20">
                  <span className="text-3xl sm:text-5xl font-black text-white font-outfit">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold text-white/90 font-outfit">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto bg-white text-[#1A1A1A]">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] font-outfit tracking-tight mb-3">Send Your Blessings</h2>
            <p className="text-[#D90429] tracking-[0.15em] uppercase text-xs font-bold font-outfit">Tap the heart to send warm wishes to the couple</p>
          </div>

          <div className="bg-[#FAFAFA] rounded-[3rem] p-10 md:p-16 shadow-lg border border-[#E5E5E5] relative overflow-hidden flex flex-col items-center justify-center group hover:border-[#F59E0B]/50 transition-colors">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-64 rounded-full border-4 border-[#D90429]/30 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-32 h-32 rounded-full bg-gradient-to-tr from-[#D90429] to-[#E11D48] border-8 border-white flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer mb-8 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-[#D90429]/20' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-14 h-14 fill-white text-white drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-10 relative z-20">
              <span className={`text-6xl sm:text-7xl font-black text-[#1A1A1A] font-outfit block tracking-tighter transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-[#D90429]' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-[#737373] uppercase tracking-[0.2em] font-outfit mt-2">Warm Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.15em] bg-[#1A1A1A] hover:bg-[#D90429] text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-outfit relative z-20"
            >
              <Sparkles className="w-4 h-4" />
              Tap to Send Wish & Love ❤️
            </button>

          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto bg-white text-[#1A1A1A]">
        <div className="bg-[#FAFAFA] rounded-[3rem] p-10 md:p-16 shadow-lg border border-[#E5E5E5] text-center relative overflow-hidden">
          <Gift size={48} className="text-[#F59E0B] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] font-outfit tracking-tight mb-4">Gift Registry</h2>
          <p className="text-base text-[#4A4A4A] leading-relaxed max-w-lg mx-auto mb-8 font-playfair">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D90429] to-[#E11D48] hover:brightness-110 text-white px-10 py-4 rounded-full font-bold tracking-[0.15em] uppercase text-xs transition-all shadow-xl hover:scale-105 cursor-pointer font-outfit"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto bg-white text-[#1A1A1A]">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] font-outfit tracking-tight mb-3">Will You Join Us?</h2>
          <p className="text-[#F59E0B] tracking-[0.15em] uppercase text-xs font-bold font-outfit">Please let us know if you can attend</p>
        </div>

        <div className="bg-[#FAFAFA] rounded-[3rem] p-8 md:p-12 shadow-xl border border-[#E5E5E5] text-left relative overflow-hidden">
          <form className="space-y-8 relative z-20" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] uppercase text-[#1A1A1A] mb-2 font-outfit">Name</label>
                <input type="text" className="w-full bg-white border border-[#E5E5E5] rounded-2xl px-5 py-4 outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] transition-all font-outfit text-[#1A1A1A] placeholder-gray-400 shadow-sm" placeholder="Your Full Name" />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.15em] uppercase text-[#1A1A1A] mb-2 font-outfit">Warm Wishes & Message</label>
                <textarea rows={4} className="w-full bg-white border border-[#E5E5E5] rounded-2xl px-5 py-4 outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] transition-all font-outfit text-[#1A1A1A] placeholder-gray-400 resize-none shadow-sm" placeholder="Share your warm wishes for the couple..."></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.15em] uppercase text-[#1A1A1A] mb-4 font-outfit">Will you be attending?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-4 cursor-pointer p-5 border border-[#E5E5E5] hover:border-[#D90429] bg-white rounded-2xl flex-1 transition-colors shadow-sm group">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#D90429]" />
                    <span className="text-[#1A1A1A] font-bold uppercase tracking-[0.1em] text-xs font-outfit group-hover:text-[#D90429] transition-colors">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer p-5 border border-[#E5E5E5] hover:border-[#D90429] bg-white rounded-2xl flex-1 transition-colors shadow-sm group">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#D90429]" />
                    <span className="text-[#1A1A1A] font-bold uppercase tracking-[0.1em] text-xs font-outfit group-hover:text-[#D90429] transition-colors">Regretfully Declines</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#D90429] text-white font-bold tracking-[0.15em] uppercase text-xs px-12 py-5 rounded-full shadow-xl transition-all hover:scale-105 cursor-pointer font-outfit">
                <Send size={16} />
                Submit RSVP
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white text-[#D90429] shadow-2xl border border-[#E5E5E5] hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen: Modern Geometric Lotus */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#D90429] transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${isOpened ? 'opacity-0 scale-110 pointer-events-none blur-sm' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        {/* Background Image with modern styling */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ${isOpening ? 'scale-125' : 'scale-100'}`}
          style={{ backgroundImage: "url('/images/bengali_modern_red_gold.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#D90429]/60 via-[#D90429]/40 to-[#D90429]/80 mix-blend-multiply" />
        </div>

        {/* Central Geometric Modern Block */}
        <div className={`relative z-40 flex flex-col items-center justify-center my-auto transition-all duration-700 ease-in-out ${isOpening ? 'scale-50 opacity-0 -translate-y-20' : 'scale-100 opacity-100'}`}>
          
          <div className="w-72 h-96 sm:w-80 sm:h-[28rem] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-white/15 transition-all">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/20 blur-2xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 blur-2xl rounded-full" />

            <div className="w-20 h-20 mb-8 border border-[#F59E0B]/50 rounded-full flex items-center justify-center relative bg-[#D90429]/50 shadow-inner">
               <div className="absolute inset-0 border border-[#F59E0B]/30 rounded-full animate-ping opacity-50" />
               <Sparkles className="w-8 h-8 text-[#F59E0B]" />
            </div>
            
            <span className="text-[10px] sm:text-xs text-white/90 font-outfit font-bold tracking-[0.3em] uppercase mb-4">
              Modern Celebration
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit tracking-tight uppercase leading-none drop-shadow-md">
              {groomFullName}
              <span className="block text-[#F59E0B] text-2xl my-2 italic font-playfair">&</span>
              {brideFullName}
            </h1>

            <div className="mt-10 px-8 py-3 bg-white text-[#D90429] rounded-full font-bold text-xs uppercase tracking-[0.15em] shadow-xl group-hover:scale-105 transition-transform font-outfit border border-transparent group-hover:border-[#F59E0B]/30">
               Tap To Unlock
            </div>

          </div>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full bg-[#FAFAFA]">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#1A1A1A] text-white w-full border-t border-[#E5E5E5]">
        <h2 className="text-3xl font-outfit font-bold mb-3 tracking-tight">{rawCoupleNames}</h2>
        <p className="text-gray-400 text-[10px] tracking-[0.3em] uppercase font-outfit font-bold">Crafted with love by Jaalam</p>
      </footer>

    </div>
  );
}
