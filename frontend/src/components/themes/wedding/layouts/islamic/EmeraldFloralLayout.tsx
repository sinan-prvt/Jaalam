import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function EmeraldFloralLayout({ content, website }: WeddingLayoutProps) {
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

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const rawTitle = content?.hero_title;
  const isDefaultTitle = !rawTitle || rawTitle === 'A & B' || rawTitle === 'Welcome to A & B' || rawTitle === 'A';
  const groomName = isDefaultTitle ? 'Zayb Azad' : (rawTitle.split(/&| and /i)[0]?.trim() || 'Zayb Azad');
  const brideName = isDefaultTitle ? 'Farha Hasan' : (rawTitle.split(/&| and /i)[1]?.trim() || 'Farha Hasan');
  const coupleNamesStr = `${groomName} & ${brideName}`;

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || 'OCTOBER 26, 2025';
  const timeStr = content?.settings_json?.wedding?.time || content?.time || 'AT 4PM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "At 123 Anywhere St., Any City, ST 12345";

  const groomParents = content?.settings_json?.wedding?.groomParents || "Groom's Family";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Bride's Family";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: timeStr, event: "Sacred Nikkah Ceremony", date: rawDateStr, venue: location },
      { time: "7:00 PM", event: "Grand Walima Reception", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "And We created you in pairs. (Surah An-Naba 78:8) — Solicit your du'as and blessings as we unite in holy matrimony under Allah's grace.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Sacred Union";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2025-10-26T16:00";
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

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'OCTOBER');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? dateObj.getDate() : '26');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? dateObj.getFullYear() : '2025');

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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#53685E]">
        
        {/* Full-Bleed Edge-to-Edge Image Container */}
        <div className="w-full h-full min-h-screen relative flex flex-col items-center justify-center">
          
          {/* Full-Bleed Artwork Image (100% Edge-to-Edge Fit to Page!) */}
          <img
            src={isDefaultTitle ? "/media/emerald_floral_card_master.png" : "/media/emerald_floral_exact_card_bg.png"}
            alt="Emerald Floral Invitation"
            className="w-full h-full min-h-screen object-cover select-none"
          />

          {/* Dynamic Text Overlay over the exact card zones when customized */}
          {!isDefaultTitle && (
            <div className="absolute inset-0 flex flex-col items-center text-center pt-[15%] sm:pt-[12%] px-6 pointer-events-none">
              
              {/* Header Subtitle */}
              <p className="text-[#53685E] font-serif text-[11px] sm:text-xs tracking-wide font-medium mb-[3%]">
                Together with their families
              </p>

              {/* Groom Name in Cursive Script Calligraphy */}
              <h1 className="font-cursive text-3xl sm:text-4xl text-[#3A4A41] font-normal leading-tight tracking-wide">
                {groomName}
              </h1>

              {/* AND */}
              <p className="text-[10px] uppercase tracking-[0.25em] font-serif font-bold text-[#53685E] my-[1.5%]">
                AND
              </p>

              {/* Bride Name in Cursive Script Calligraphy */}
              <h1 className="font-cursive text-3xl sm:text-4xl text-[#3A4A41] font-normal leading-tight tracking-wide mb-[3%]">
                {brideName}
              </h1>

              {/* Invitation Line */}
              <p className="text-[10px] sm:text-[11px] text-[#566A5F] font-serif tracking-wide mb-[2.5%] max-w-[240px] leading-relaxed">
                Joyfully invite you to their wedding celebration on
              </p>

              {/* Month Header */}
              <p className="text-[11px] sm:text-xs font-bold font-serif tracking-[0.2em] text-[#2D3B33] uppercase mb-[1%]">
                {monthStr}
              </p>

              {/* Date Row with Divider Lines */}
              <div className="w-full max-w-[220px] flex items-center justify-center gap-3 py-[1%] my-[1%] border-y border-[#53685E]/40">
                <span className="text-[10px] sm:text-[11px] font-serif font-bold tracking-widest text-[#2D3B33] uppercase">{dayName}</span>
                <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#2D3B33] px-1">{dayNum}</span>
                <span className="text-[10px] sm:text-[11px] font-serif font-bold tracking-widest text-[#2D3B33] uppercase">{timeStr}</span>
              </div>

              {/* Year */}
              <p className="text-[11px] font-serif font-bold tracking-widest text-[#2D3B33] mt-[1%] mb-[2%]">
                {yearStr}
              </p>

              {/* Address */}
              <p className="text-[10px] sm:text-[11px] text-[#53685E] font-serif max-w-[220px] leading-relaxed">
                {location}
              </p>

            </div>
          )}

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">Family Details</h2>
          <div className="h-[2px] w-16 bg-white/60 mx-auto mt-2"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Groom */}
          <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-200">
            {groomPhoto ? (
              <img src={groomPhoto} alt={groomName} className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-[#53685E] mb-4 shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#53685E]/10 text-[#53685E] flex items-center justify-center mx-auto mb-4 font-serif text-3xl font-bold border-2 border-[#53685E]/30">
                {groomName[0]}
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-800 font-serif mb-1">{groomName}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 font-serif">The Groom</p>
            <p className="text-xs text-slate-600 font-serif italic">Beloved Son of</p>
            <p className="text-sm font-semibold text-slate-800 font-serif mt-1">{groomParents}</p>
          </div>

          {/* Bride */}
          <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-200">
            {bridePhoto ? (
              <img src={bridePhoto} alt={brideName} className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-[#53685E] mb-4 shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#53685E]/10 text-[#53685E] flex items-center justify-center mx-auto mb-4 font-serif text-3xl font-bold border-2 border-[#53685E]/30">
                {brideName[0]}
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-800 font-serif mb-1">{brideName}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 font-serif">The Bride</p>
            <p className="text-xs text-slate-600 font-serif italic">Beloved Daughter of</p>
            <p className="text-sm font-semibold text-slate-800 font-serif mt-1">{brideParents}</p>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-16 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-200 relative overflow-hidden">
          <Sparkles className="w-8 h-8 text-[#53685E] mx-auto mb-4 opacity-75" />
          <h2 className="text-3xl font-bold text-slate-800 font-serif mb-4">{storyTitle}</h2>
          <div className="h-[2px] w-16 bg-[#53685E]/30 mx-auto mb-6"></div>
          <p className="text-slate-600 font-serif leading-relaxed text-sm md:text-base italic max-w-xl mx-auto">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">Schedule & Events</h2>
          <div className="h-[2px] w-16 bg-white/60 mx-auto mt-2"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#53685E] uppercase tracking-widest block mb-2 font-serif">{item.time}</span>
                <h3 className="text-xl font-bold text-slate-800 font-serif mb-2">{item.event}</h3>
                <p className="text-xs text-slate-500 font-serif mb-1">{item.date}</p>
                <p className="text-xs text-slate-600 font-serif font-medium">{item.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">Venue & Location</h2>
          <div className="h-[2px] w-16 bg-white/60 mx-auto mt-2"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-200 max-w-3xl mx-auto text-center space-y-6">
          {venuePhoto && (
            <img src={venuePhoto} alt="Venue" className="w-full h-56 md:h-64 object-cover rounded-2xl border border-slate-200 shadow-md mb-6" />
          )}

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800 font-serif">Wedding Reception & Nikkah Venue</h3>
            <p className="text-sm text-slate-600 font-serif max-w-md mx-auto">{location}</p>
            <p className="text-xs font-semibold text-[#53685E] font-serif pt-2">{contactNumbers}</p>
          </div>

          {mapUrl && (
            <div className="pt-2">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#53685E] hover:bg-[#43544B] text-white font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-105"
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
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">Precious Moments</h2>
          <div className="h-[2px] w-16 bg-white/60 mx-auto mt-2"></div>
        </div>

        {validGallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {validGallery.map((imgUrl: string, idx: number) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:scale-105 transition-transform duration-300 bg-white">
                <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 font-serif max-w-md mx-auto shadow-md">
            Photo gallery will be uploaded soon.
          </div>
        )}
      </section>
    ),
    countdown: (
      <section key="countdown" className="py-16 px-4 sm:px-6 relative z-10 max-w-3xl mx-auto text-center">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-serif mb-2">Counting Down To The Big Day</h2>
          <p className="text-xs uppercase tracking-widest text-[#53685E] font-bold font-serif mb-8">Sacred Nikkah Ceremony</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#53685E]/10 flex items-center justify-center mb-2 shadow-inner border border-[#53685E]/20">
                  <span className="text-xl sm:text-3xl font-bold text-[#53685E] font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-slate-600 font-serif">{item.label}</span>
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
              <div className="h-[1px] w-12 bg-white/60"></div>
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="h-[1px] w-12 bg-white/60"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">Send Your Blessings</h2>
            <p className="text-white/80 tracking-widest uppercase text-xs font-semibold mt-1 font-serif">Tap the heart to send du'as & love to the couple</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center text-slate-800">
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-48 rounded-full border-4 border-[#53685E]/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-[#53685E] border-4 border-[#53685E]/20 flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer mb-5 relative z-20 ${pulseRing ? 'scale-110 ring-8 ring-[#53685E]/40' : 'hover:scale-105 active:scale-95'}`}
              title="Tap to send a blessing!"
            >
              <Heart className={`w-12 h-12 fill-rose-500 text-rose-500 drop-shadow-md transition-transform duration-300 ${pulseRing ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-6 relative z-20">
              <span className={`text-4xl sm:text-5xl font-extrabold text-[#53685E] font-serif block tracking-wider transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-rose-600' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-serif mt-1">Sacred Blessings Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#53685E] hover:bg-[#43544B] text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-serif border border-white/30 relative z-20"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">Will You Join Us?</h2>
            <p className="text-white/80 tracking-widest uppercase text-xs font-semibold mt-1 font-serif">Please let us know if you can attend</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-200 text-left relative overflow-hidden">
            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-serif">Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#53685E] transition-all font-serif" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-serif">Du'as & Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#53685E] transition-all font-serif resize-none" placeholder="Share your warm du'as and wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 font-serif">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-300 hover:border-[#53685E] bg-slate-50 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#53685E]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-serif">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-300 hover:border-[#53685E] bg-slate-50 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#53685E]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-serif">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#53685E] hover:bg-[#43544B] text-white font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer font-serif">
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
    <div className="min-h-screen bg-[#53685E] relative font-serif flex flex-col items-center overflow-hidden w-full text-slate-800">
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#53685E] text-white shadow-2xl border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer"
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
      <footer className="w-full py-8 text-center text-white/70 text-xs font-serif border-t border-white/20 relative z-20 bg-[#43544B]">
        <p className="font-bold tracking-widest text-white">{coupleNamesStr}</p>
        <p className="mt-1 opacity-75">MADE WITH LOVE BY JAALAM</p>
      </footer>
    </div>
  );
}
