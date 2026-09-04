import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Heart, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

// Traditional Netipattam (Elephant Caparison) Motif
const Netipattam = ({ className = "w-24 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 L 90 40 L 80 120 L 50 140 L 20 120 L 10 40 Z" fill="#D4AF37" />
    <path d="M50 15 L 85 43 L 76 117 L 50 135 L 24 117 L 15 43 Z" fill="#997A00" />
    <circle cx="50" cy="40" r="8" fill="#FFD700" />
    <circle cx="50" cy="65" r="10" fill="#FFD700" />
    <circle cx="50" cy="95" r="12" fill="#FFD700" />
    <circle cx="35" cy="50" r="6" fill="#FFD700" />
    <circle cx="65" cy="50" r="6" fill="#FFD700" />
    <circle cx="30" cy="75" r="7" fill="#FFD700" />
    <circle cx="70" cy="75" r="7" fill="#FFD700" />
    <path d="M40 145 L 40 150 M 50 145 L 50 150 M 60 145 L 60 150" stroke="#D4AF37" strokeWidth="2" />
  </svg>
);

// Ornate Corner Pattern
const OrnateCorner = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L 100 0 C 100 0, 80 20, 50 20 C 20 20, 0 50, 0 100 Z" fill="#D4AF37" opacity="0.3" />
    <path d="M0 0 L 80 0 C 80 0, 60 15, 40 15 C 15 15, 0 40, 0 80 Z" fill="#D4AF37" opacity="0.5" />
    <path d="M0 0 L 60 0 C 60 0, 45 10, 30 10 C 10 10, 0 30, 0 60 Z" fill="#D4AF37" opacity="0.8" />
  </svg>
);

export default function TraditionalElegantLayout({ content, website }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      } catch (err) {}
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
      } catch (err) {}
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

  const rawCoupleNames = content?.hero_title || "A & B";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = parts[0]?.trim() || "Groom";
  const brideFullName = parts[1]?.trim() || "Bride";
  const story = content?.about_text || "Ours is a journey woven with love and blessed by the divine. We invite you to celebrate our union.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Royal Saga";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "15 March 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());
  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'MARCH');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '9:00 AM';
  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Palakkad, Kerala";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "9:00 AM", event: "Thalikettu", date: rawDateStr, venue: fullLocation },
    { time: "12:00 PM", event: "Grand Sadya", date: rawDateStr, venue: fullLocation },
    { time: "6:30 PM", event: "Royal Reception", date: rawDateStr, venue: fullLocation }
  ];
  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Panicker";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Pillai";
  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: +91 9400850505";
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];
  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your blessings are our treasure.";
  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T09:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";
  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "INVITING YOU TO OUR ROYAL UNION";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      let targetTime: number | null = null;
      if (countdownDate) {
        let d = new Date(countdownDate);
        if (!isNaN(d.getTime())) targetTime = d.getTime();
        else {
          d = new Date(String(countdownDate).replace(' ', 'T'));
          if (!isNaN(d.getTime())) targetTime = d.getTime();
        }
      }
      if (!targetTime || targetTime <= new Date().getTime()) {
        targetTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
      }
      const distance = targetTime - new Date().getTime();
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

  return (
    <div className={`min-h-screen bg-[#4A0E17] text-[#FDFBF7] font-serif relative flex flex-col items-center w-full ${!isOpened ? 'max-h-screen overflow-hidden' : 'overflow-hidden'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Pinyon+Script&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-pinyon { font-family: 'Pinyon Script', cursive; }
        
        .ornate-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H24v-2zm0 4h20v2H24v-2zm0 4h20v2H24v-2zm0 4h20v2H24v-2z' fill='%23d4af37' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        
        .gate-door-left {
          transform-origin: left;
        }
        .gate-door-right {
          transform-origin: right;
        }
      `}</style>

      {/* Opening Overlay (Palace Doors) */}
      {!isOpened && (
        <div className="absolute inset-0 z-[100] flex overflow-hidden pointer-events-none">
          {/* Left Door */}
          <div className={`relative w-1/2 h-full bg-[#3A0B12] border-r-4 border-[#D4AF37] shadow-[10px_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-center items-end pr-2 transition-all duration-[1200ms] ease-in-out gate-door-left ${isOpening ? '-rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'} pointer-events-auto`}>
            <div className="absolute inset-0 ornate-bg"></div>
            <OrnateCorner className="absolute top-0 left-0 w-48 h-48" />
            <OrnateCorner className="absolute bottom-0 left-0 w-48 h-48 -scale-y-100" />
            
            {/* Latch left half */}
            <button onClick={handleOpen} className="relative z-10 w-24 h-48 bg-[#D4AF37] rounded-l-full flex items-center justify-center hover:bg-[#FFE55C] transition-colors shadow-xl -mr-3 border-r-2 border-black/20 cursor-pointer overflow-hidden">
              <img src="/media/netipattam.png" alt="Netipattam" className="w-20 h-28 mr-4 mix-blend-multiply object-contain" />
            </button>
          </div>

          {/* Right Door */}
          <div className={`relative w-1/2 h-full bg-[#3A0B12] border-l-4 border-[#D4AF37] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-center items-start pl-2 transition-all duration-[1200ms] ease-in-out gate-door-right ${isOpening ? 'rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'} pointer-events-auto`}>
            <div className="absolute inset-0 ornate-bg"></div>
            <OrnateCorner className="absolute top-0 right-0 w-48 h-48 -scale-x-100" />
            <OrnateCorner className="absolute bottom-0 right-0 w-48 h-48 -scale-x-100 -scale-y-100" />
            
            {/* Latch right half */}
            <button onClick={handleOpen} className="relative z-10 w-24 h-48 bg-[#D4AF37] rounded-r-full flex items-center justify-center hover:bg-[#FFE55C] transition-colors shadow-xl -ml-3 border-l-2 border-black/20 cursor-pointer">
              <div className="flex flex-col items-center ml-2">
                <span className="text-[#3A0B12] font-cinzel font-bold tracking-widest text-[10px] uppercase mb-1">Open</span>
                <Sparkles className="w-4 h-4 text-[#3A0B12]" />
              </div>
            </button>
          </div>
          
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500 ${isOpening ? 'opacity-0' : 'opacity-100'} z-[110]`}>
            <h1 className="text-4xl sm:text-6xl font-pinyon text-[#D4AF37] drop-shadow-lg mb-2">{groomFullName} & {brideFullName}</h1>
            <p className="text-[#FDFBF7] font-cinzel tracking-[0.3em] text-xs uppercase shadow-black drop-shadow-md">{monthStr} {dayNum}, {yearStr}</p>
          </div>
        </div>
      )}

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}
      {musicUrl && (
        <button onClick={() => {
            if (audioRef.current) {
              isMuted ? audioRef.current.play() : audioRef.current.pause();
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#D4AF37] text-[#4A0E17] shadow-xl hover:scale-110 transition-all border-2 border-[#4A0E17]"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={2} /> : <Volume2 size={20} strokeWidth={2} />}
        </button>
      )}

      {/* Main Content */}
      <div className="w-full flex flex-col items-center z-10 ornate-bg">
        {/* HERO */}
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 text-center px-4">
          <OrnateCorner className={`absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 transition-all duration-[1500ms] transform ${isOpened ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-10 -translate-y-10 opacity-0'} delay-500`} />
          <OrnateCorner className={`absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 -scale-x-100 transition-all duration-[1500ms] transform ${isOpened ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-10 -translate-y-10 opacity-0'} delay-500`} />
          
          <div className={`mb-10 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-300`}>
            <img src="/media/netipattam.png" alt="Netipattam" className="w-28 h-36 mx-auto mix-blend-multiply object-contain drop-shadow-2xl brightness-110" />
          </div>

          <p className={`text-[#D4AF37] text-[10px] sm:text-xs font-cinzel font-bold tracking-[0.4em] uppercase mb-10 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-500`}>
            {quoteText}
          </p>
          
          <h1 className={`text-6xl sm:text-8xl font-pinyon text-[#FDFBF7] my-2 drop-shadow-xl transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-700`}>
            {groomFullName}
          </h1>
          <span className={`text-sm sm:text-lg text-[#D4AF37] font-cinzel italic my-4 transition-all duration-1000 transform ${isOpened ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} delay-1000`}>And</span>
          <h1 className={`text-6xl sm:text-8xl font-pinyon text-[#FDFBF7] my-2 drop-shadow-xl transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-700`}>
            {brideFullName}
          </h1>

          <div className={`mt-12 bg-[#3A0B12]/80 backdrop-blur-md border-2 border-[#D4AF37] p-8 rounded-sm shadow-2xl max-w-sm w-full mx-4 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-[1200ms] relative`}>
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]"></div>
            
            <p className="text-[#D4AF37] text-sm font-cinzel font-bold tracking-[0.3em] uppercase mb-4 border-b border-[#D4AF37]/30 pb-4">
              {monthStr} <span className="text-3xl mx-2 text-[#FDFBF7] drop-shadow-md">{dayNum}</span> {yearStr}
            </p>
            <p className="text-[#FDFBF7] text-xs font-cinzel tracking-[0.2em] uppercase mt-4">
              {dayName} • {timeStr}
            </p>
          </div>
          
          <div className={`mt-10 flex items-center gap-3 text-[#D4AF37] font-cinzel text-xs tracking-widest uppercase transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-[1500ms] bg-[#3A0B12]/60 px-6 py-3 rounded-full border border-[#D4AF37]/50`}>
            <MapPin size={16} className="text-[#FDFBF7]" />
            <span>{fullLocation}</span>
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-24 w-full max-w-5xl mx-auto px-4 z-10">
          <div className="bg-[#3A0B12]/90 border-2 border-[#D4AF37] p-10 sm:p-16 rounded-sm shadow-2xl relative text-center">
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-16">The Couple</h2>
            <div className="grid md:grid-cols-2 gap-16 relative">
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-[#D4AF37] p-1 mb-6 relative shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <div className="absolute inset-0 rounded-full border border-[#D4AF37] m-1 border-dashed"></div>
                  {groomPhoto ? (
                    <img src={groomPhoto} alt="Groom" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#4A0E17] flex items-center justify-center text-5xl font-pinyon text-[#D4AF37]">{groomFullName[0]}</div>
                  )}
                </div>
                <h3 className="text-2xl font-cinzel font-bold uppercase tracking-widest text-[#FDFBF7]">{groomFullName}</h3>
                <p className="text-[#D4AF37] text-xs font-cinzel font-bold uppercase tracking-[0.3em] mt-3">Groom</p>
                <p className="text-[#FDFBF7]/70 text-xs mt-3 font-cinzel uppercase tracking-widest">Son of {groomParents}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-[#D4AF37] p-1 mb-6 relative shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <div className="absolute inset-0 rounded-full border border-[#D4AF37] m-1 border-dashed"></div>
                  {bridePhoto ? (
                    <img src={bridePhoto} alt="Bride" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#4A0E17] flex items-center justify-center text-5xl font-pinyon text-[#D4AF37]">{brideFullName[0]}</div>
                  )}
                </div>
                <h3 className="text-2xl font-cinzel font-bold uppercase tracking-widest text-[#FDFBF7]">{brideFullName}</h3>
                <p className="text-[#D4AF37] text-xs font-cinzel font-bold uppercase tracking-[0.3em] mt-3">Bride</p>
                <p className="text-[#FDFBF7]/70 text-xs mt-3 font-cinzel uppercase tracking-widest">Daughter of {brideParents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="py-24 w-full max-w-4xl mx-auto text-center px-4 z-10">
          <img src="/media/netipattam.png" alt="Netipattam" className="w-20 h-28 mx-auto mb-10 opacity-50 mix-blend-multiply object-contain brightness-150" />
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-10">{storyTitle}</h2>
          <div className="relative p-10">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]"></div>
            <p className="text-lg sm:text-xl font-cinzel leading-loose text-[#FDFBF7] italic">
              "{story}"
            </p>
          </div>
        </section>

        {/* SCHEDULE */}
        <section className="py-24 w-full max-w-5xl mx-auto px-4 z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-16">Itinerary</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-[#3A0B12] border border-[#D4AF37]/50 p-8 flex flex-col items-center hover:bg-[#D4AF37] hover:text-[#4A0E17] transition-all duration-300 group shadow-lg">
                <Clock className="w-8 h-8 text-[#D4AF37] group-hover:text-[#4A0E17] mb-6 transition-colors" strokeWidth={1.5} />
                <h3 className="text-xl font-cinzel font-bold uppercase tracking-widest text-[#FDFBF7] group-hover:text-[#4A0E17] mb-4 transition-colors">{item.event}</h3>
                <p className="text-[#D4AF37] group-hover:text-[#4A0E17] font-cinzel font-bold text-sm tracking-[0.2em] mb-3 transition-colors">{item.time}</p>
                <p className="text-[#FDFBF7]/70 group-hover:text-[#4A0E17]/80 text-xs font-cinzel uppercase tracking-widest transition-colors">{item.venue}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VENUE */}
        <section className="py-24 w-full max-w-4xl mx-auto text-center px-4 z-10">
          <div className="bg-[#3A0B12]/90 border-2 border-[#D4AF37] p-8 sm:p-12 rounded-sm shadow-2xl">
            <MapPin className="w-10 h-10 text-[#D4AF37] mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Location</h2>
            <p className="text-base text-[#FDFBF7] font-cinzel uppercase tracking-widest mb-10">{fullLocation}</p>
            
            {venuePhoto && (
              <img src={venuePhoto} alt="Venue" className="w-full max-w-2xl mx-auto h-64 object-cover mb-10 border border-[#D4AF37] shadow-lg" />
            )}
            
            <div className="w-full max-w-2xl mx-auto aspect-video mb-10 border border-[#D4AF37] shadow-lg bg-[#4A0E17]">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#4A0E17] font-bold px-8 py-4 font-cinzel uppercase tracking-[0.2em] text-xs hover:bg-[#FFE55C] transition-colors shadow-lg">
                <Navigation size={16} strokeWidth={2} /> Get Directions
              </a>
            )}
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="py-24 w-full max-w-3xl mx-auto text-center px-4 z-10">
          <h2 className="text-sm font-cinzel font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12">The Countdown Begins</h2>
          <div className="flex justify-center gap-4 sm:gap-8">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-[#3A0B12] border border-[#D4AF37] w-20 sm:w-28 py-6 shadow-xl relative">
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#D4AF37]/50"></div>
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#D4AF37]/50"></div>
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#D4AF37]/50"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#D4AF37]/50"></div>
                
                <span className="text-3xl sm:text-5xl font-cinzel font-bold text-[#FDFBF7] mb-3">{item.value}</span>
                <span className="text-[9px] sm:text-xs uppercase font-cinzel font-bold tracking-[0.2em] text-[#D4AF37]">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* WISHES */}
        <section className="py-24 w-full max-w-2xl mx-auto text-center px-4 z-10">
          <div className="bg-[#3A0B12]/90 border border-[#D4AF37] p-12 shadow-2xl relative">
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 relative z-10">Blessings</h2>
            <p className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#FDFBF7]/80 mb-12 relative z-10">Shower your blessings upon us</p>
            
            <div className="relative inline-block mb-8">
              {pulseRing && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="w-32 h-32 rounded-full border-2 border-[#D4AF37] animate-ping"></div>
                </div>
              )}
              <button
                onClick={handleTapWish}
                className={`w-24 h-24 rounded-full bg-[#D4AF37] border-4 border-[#3A0B12] flex items-center justify-center mx-auto relative z-10 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-transform ${isCounterPopping ? 'scale-110' : 'hover:scale-105'}`}
              >
                <Heart className={`w-10 h-10 text-[#4A0E17] ${isCounterPopping ? 'fill-[#4A0E17] animate-bounce' : ''}`} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="mt-2 relative z-10 border-t border-[#D4AF37]/30 pt-6">
              <span className="text-4xl font-cinzel font-bold text-[#FDFBF7]">{wishCount}</span>
              <span className="block text-[#D4AF37] text-xs font-cinzel uppercase tracking-[0.2em] mt-2">Wishes Received</span>
            </div>
          </div>
        </section>

        {/* RSVP */}
        <section className="py-24 w-full max-w-2xl mx-auto px-4 z-10 mb-20">
          <div className="bg-[#3A0B12] border-2 border-[#D4AF37] p-10 sm:p-16 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-12 text-center">RSVP</h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" placeholder="GUEST NAME" className="w-full bg-transparent border-b-2 border-[#D4AF37]/50 px-4 py-4 text-[#FDFBF7] font-cinzel text-sm tracking-[0.2em] uppercase placeholder-[#FDFBF7]/40 focus:outline-none focus:border-[#D4AF37] transition-colors" />
              </div>
              <div>
                <textarea rows={3} placeholder="MESSAGE" className="w-full bg-transparent border-b-2 border-[#D4AF37]/50 px-4 py-4 text-[#FDFBF7] font-cinzel text-sm tracking-[0.2em] uppercase placeholder-[#FDFBF7]/40 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"></textarea>
              </div>
              <div className="flex gap-8 justify-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="attend" className="accent-[#D4AF37] w-4 h-4" />
                  <span className="text-sm uppercase font-cinzel font-bold tracking-[0.2em] text-[#D4AF37] group-hover:text-[#FFE55C] transition-colors">Accept</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="attend" className="accent-[#D4AF37] w-4 h-4" />
                  <span className="text-sm uppercase font-cinzel font-bold tracking-[0.2em] text-[#D4AF37] group-hover:text-[#FFE55C] transition-colors">Decline</span>
                </label>
              </div>
              <div className="text-center mt-12">
                <button className="bg-[#D4AF37] text-[#4A0E17] font-cinzel font-bold text-sm uppercase tracking-[0.3em] px-12 py-5 shadow-xl hover:bg-[#FFE55C] hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto">
                  <Send size={18} strokeWidth={2} /> Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
