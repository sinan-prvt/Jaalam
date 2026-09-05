import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Heart, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

// Lotus Flower Motif (Realistic)
const LotusFlower = ({ className = "w-24 h-24" }: { className?: string }) => (
  <img src="/images/lotus.png" alt="Lotus" className={`object-cover rounded-full shadow-lg ${className}`} />
);

// Houseboat (Kettuvallam) SVG Motif
const Houseboat = ({ className = "w-32 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 70 Q 100 90 190 70 L 170 80 Q 100 100 30 80 Z" fill="#8B5A2B" />
    <path d="M30 70 L 170 70 L 160 40 C 130 20, 70 20, 40 40 Z" fill="#CD853F" />
    <path d="M50 50 L 150 50 L 140 30 C 120 15, 80 15, 60 30 Z" fill="#D2B48C" />
    <line x1="70" y1="50" x2="70" y2="30" stroke="#8B5A2B" strokeWidth="2" />
    <line x1="100" y1="50" x2="100" y2="25" stroke="#8B5A2B" strokeWidth="2" />
    <line x1="130" y1="50" x2="130" y2="30" stroke="#8B5A2B" strokeWidth="2" />
  </svg>
);

// Coconut Leaf Outline
const CoconutLeaf = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 Q 50 50 90 10 Q 80 40 60 60 Q 50 80 10 90 Z" fill="#12705E" opacity="0.8" />
    <path d="M15 85 Q 30 60 50 40" stroke="#064253" strokeWidth="1.5" />
    <path d="M25 80 Q 40 60 60 45" stroke="#064253" strokeWidth="1.5" />
    <path d="M35 75 Q 50 55 70 40" stroke="#064253" strokeWidth="1.5" />
    <path d="M45 70 Q 60 55 80 35" stroke="#064253" strokeWidth="1.5" />
  </svg>
);

export default function BackwaterFloralLayout({ content, website }: WeddingLayoutProps) {
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
    }, 900);
  };

  const rawCoupleNames = content?.hero_title || "A & B";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = parts[0]?.trim() || "Groom";
  const brideFullName = parts[1]?.trim() || "Bride";
  const story = content?.about_text || "We met by the gentle backwaters, where love blossomed like a lotus. Join us to celebrate our eternal bond.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Love Story";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "15 March 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());
  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'MARCH');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '9:00 AM Onwards';
  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Kumarakom, Kerala";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "9:00 AM", event: "Muhurtham", date: rawDateStr, venue: fullLocation },
    { time: "12:00 PM", event: "Grand Sadya", date: rawDateStr, venue: fullLocation },
    { time: "6:30 PM", event: "Reception", date: rawDateStr, venue: fullLocation }
  ];
  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Sharma";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Varma";
  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: +91 9400850505";
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];
  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your blessings are the most precious gift to us.";
  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T09:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";
  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "INVITING YOU TO OUR SERENE BACKWATER WEDDING";

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

  let rawSections = content?.settings_json?.wedding?.sections || [
    { id: 'hero', label: 'Cover', visible: true },
    { id: 'about', label: 'Family', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Events', visible: true },
    { id: 'venue', label: 'Venue', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes', visible: true },
    { id: 'registry', label: 'Registry', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];
  if (!rawSections.some((s: any) => s.id === 'wishes')) {
    rawSections.push({ id: 'wishes', label: 'Wishes & Blessings', visible: true });
  }

  return (
    <div className={`min-h-screen bg-[#064253] text-[#F9F6F0] font-serif relative flex flex-col items-center w-full ${!isOpened ? 'max-h-screen overflow-hidden' : 'overflow-hidden'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-vibes { font-family: 'Great Vibes', cursive; }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes floatLotus {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .water-bg {
          background: radial-gradient(circle at bottom, #12705E 0%, #0F4C5C 40%, #064253 100%);
        }
      `}</style>

      {/* Lotus Gate Opening Overlay */}
      {!isOpened && (
        <div
          className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ${
            isOpening ? 'opacity-0 pointer-events-none transform scale-110' : 'opacity-100'
          }`}
          style={{ background: 'linear-gradient(to bottom, #064253, #0F4C5C)' }}
        >
          {/* Top Coconut Leaves */}
          <CoconutLeaf className="absolute -top-10 -left-10 w-64 h-64 rotate-90 opacity-40 pointer-events-none" />
          <CoconutLeaf className="absolute -top-10 -right-10 w-64 h-64 -scale-x-100 opacity-40 pointer-events-none" />

          {/* Golden Lotus Medallion */}
          <button
            onClick={handleOpen}
            className={`relative z-10 w-48 h-48 rounded-full bg-[#12705E]/40 border-4 border-[#F4B41A] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(244,180,26,0.3)] backdrop-blur-md cursor-pointer transition-transform duration-500 hover:scale-110 ${
              isOpening ? 'rotate-90 scale-50' : 'animate-pulse'
            }`}
          >
            <LotusFlower className="w-20 h-20 mb-2" />
            <span className="text-[#F4B41A] font-bold tracking-widest text-xs uppercase">Tap to Open</span>
          </button>

          {/* Couple Names */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-100 ${isOpening ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <h1 className="text-4xl font-vibes text-white">{groomFullName} & {brideFullName}</h1>
            <p className="text-[#F4B41A] mt-2 font-playfair italic text-lg">{monthStr} {dayNum}, {yearStr}</p>
          </div>

          <p className={`absolute bottom-10 text-white/60 text-xs tracking-widest uppercase transition-opacity duration-500 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
            Welcome to the Backwaters
          </p>
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
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-[#FF8FA3] text-white shadow-lg hover:scale-110 transition-all"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Decorative Overlays */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <CoconutLeaf className="absolute -top-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 rotate-90 opacity-60" />
        <CoconutLeaf className="absolute -top-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 -scale-x-100 opacity-60" />
        
        {/* Floating Lotuses */}
        <div className="absolute bottom-10 left-10 opacity-70" style={{ animation: 'floatLotus 6s ease-in-out infinite' }}>
          <LotusFlower className="w-16 h-16 sm:w-24 sm:h-24" />
        </div>
        <div className="absolute bottom-24 right-16 opacity-70" style={{ animation: 'floatLotus 7s ease-in-out infinite 1s' }}>
          <LotusFlower className="w-12 h-12 sm:w-20 sm:h-20" />
        </div>
      </div>

      <div className="w-full water-bg flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-4 text-center z-10 overflow-hidden">
          <div className={`mb-6 relative transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-300`}>
            <Houseboat className="w-24 h-12 sm:w-32 sm:h-16 opacity-90 mx-auto" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-white/20 blur-md rounded-full"></div>
          </div>
          
          <p className={`text-[#F4B41A] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4 max-w-md mx-auto transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-500`}>
            {quoteText}
          </p>
          
          <h1 className={`text-5xl sm:text-7xl font-vibes text-white my-2 drop-shadow-lg transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-700`}>
            {groomFullName}
          </h1>
          <span className={`text-lg sm:text-xl text-[#FF8FA3] font-playfair italic my-2 transition-all duration-1000 transform ${isOpened ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} delay-1000`}>and</span>
          <h1 className={`text-5xl sm:text-7xl font-vibes text-white my-2 drop-shadow-lg transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-700`}>
            {brideFullName}
          </h1>

          <div className={`mt-8 mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#F4B41A] to-transparent transition-all duration-1000 ${isOpened ? 'opacity-100 w-32' : 'opacity-0 w-0'} delay-1000`}></div>
          
          <div className={`bg-[#12705E]/40 backdrop-blur-md border border-[#1B998B] p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-[1200ms]`}>
            <p className="text-[#F4B41A] text-sm font-bold tracking-widest uppercase mb-2">
              {monthStr} {yearStr}
            </p>
            <div className="flex justify-between items-center px-4 py-2 border-y border-[#1B998B]/50 my-2">
              <span className="text-xs uppercase tracking-widest text-white/90">{dayName}</span>
              <span className="text-3xl font-playfair font-bold text-white bg-[#064253] px-4 py-1 rounded-lg border border-[#F4B41A] shadow-inner">{dayNum}</span>
              <span className="text-xs uppercase tracking-widest text-white/90">{timeStr}</span>
            </div>
          </div>
          
          <div className={`mt-6 flex items-center gap-2 text-white/90 font-playfair italic transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-[1500ms]`}>
            <MapPin size={16} className="text-[#F4B41A] animate-bounce" />
            <span>{fullLocation}</span>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-20 px-4 w-full max-w-5xl mx-auto z-10">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <LotusFlower className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A] mb-8">The Couple</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center">
                {groomPhoto ? (
                  <img src={groomPhoto} alt="Groom" className="w-32 h-32 rounded-full object-cover border-4 border-[#12705E] mb-4 shadow-lg" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#12705E]/50 border-4 border-[#F4B41A] flex items-center justify-center mb-4 text-4xl font-vibes">{groomFullName[0]}</div>
                )}
                <h3 className="text-2xl font-playfair font-bold text-white">{groomFullName}</h3>
                <p className="text-[#F4B41A] text-xs uppercase tracking-widest mt-1">Groom</p>
                <p className="text-white/70 text-sm mt-2 font-playfair italic">Son of {groomParents}</p>
              </div>
              <div className="flex flex-col items-center">
                {bridePhoto ? (
                  <img src={bridePhoto} alt="Bride" className="w-32 h-32 rounded-full object-cover border-4 border-[#12705E] mb-4 shadow-lg" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#12705E]/50 border-4 border-[#F4B41A] flex items-center justify-center mb-4 text-4xl font-vibes">{brideFullName[0]}</div>
                )}
                <h3 className="text-2xl font-playfair font-bold text-white">{brideFullName}</h3>
                <p className="text-[#F4B41A] text-xs uppercase tracking-widest mt-1">Bride</p>
                <p className="text-white/70 text-sm mt-2 font-playfair italic">Daughter of {brideParents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="py-20 px-4 w-full max-w-4xl mx-auto text-center z-10">
          <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A] mb-6">{storyTitle}</h2>
          <div className="h-px w-24 bg-[#FF8FA3] mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl font-playfair italic text-white/90 leading-relaxed max-w-2xl mx-auto">
            "{story}"
          </p>
        </section>

        {/* SCHEDULE SECTION */}
        <section className="py-20 px-4 w-full max-w-5xl mx-auto z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A]">Wedding Itinerary</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-[#064253]/60 border border-[#12705E] rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition-transform">
                <Clock className="w-6 h-6 text-[#FF8FA3] mx-auto mb-3" />
                <h3 className="text-xl font-playfair font-bold text-white mb-2">{item.event}</h3>
                <p className="text-[#F4B41A] text-sm font-semibold tracking-wider mb-2">{item.time}</p>
                <p className="text-white/70 text-xs italic">{item.venue}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VENUE SECTION */}
        <section className="py-20 px-4 w-full max-w-4xl mx-auto z-10">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <MapPin className="w-8 h-8 text-[#FF8FA3] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A] mb-4">The Venue</h2>
            <p className="text-lg text-white font-playfair italic mb-6">{fullLocation}</p>
            {venuePhoto && (
              <img src={venuePhoto} alt="Venue" className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md border-2 border-[#12705E]" />
            )}
            <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#12705E] mb-6">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#F4B41A] text-[#064253] px-6 py-3 rounded-full font-bold uppercase text-xs hover:bg-[#FF8FA3] hover:text-white transition-colors">
                <Navigation size={14} /> Get Directions
              </a>
            )}
          </div>
        </section>

        {/* COUNTDOWN SECTION */}
        <section className="py-20 px-4 w-full max-w-3xl mx-auto z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A] mb-8">Counting Down</h2>
          <div className="flex justify-center gap-4 sm:gap-8">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#12705E]/40 border border-[#F4B41A] rounded-2xl flex items-center justify-center mb-2 shadow-lg backdrop-blur-sm">
                  <span className="text-2xl sm:text-3xl font-playfair font-bold text-white">{item.value}</span>
                </div>
                <span className="text-xs uppercase tracking-widest text-[#F4B41A]">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* WISHES SECTION */}
        <section className="py-20 px-4 w-full max-w-2xl mx-auto z-10 text-center">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-48 h-48 rounded-full border-4 border-[#FF8FA3]/50 animate-ping"></div>
              </div>
            )}
            <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A] mb-2 relative z-10">Send Blessings</h2>
            <p className="text-sm text-white/80 mb-8 relative z-10">Tap the lotus heart to send your warm wishes</p>
            
            <button
              onClick={handleTapWish}
              className={`w-24 h-24 rounded-full bg-[#12705E] border-4 border-[#FF8FA3] flex items-center justify-center shadow-xl mx-auto relative z-10 transition-transform ${isCounterPopping ? 'scale-110' : 'hover:scale-105'}`}
            >
              <Heart className={`w-10 h-10 text-[#FF8FA3] fill-[#FF8FA3] ${isCounterPopping ? 'animate-bounce' : ''}`} />
            </button>
            <div className="mt-4 relative z-10">
              <span className="text-4xl font-playfair font-bold text-white">{wishCount}</span>
              <span className="block text-xs uppercase tracking-widest text-[#F4B41A] mt-1">Wishes Received</span>
            </div>
          </div>
        </section>

        {/* RSVP SECTION */}
        <section className="py-20 px-4 w-full max-w-2xl mx-auto z-10 mb-20">
          <div className="bg-[#064253] border-2 border-[#12705E] rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-vibes text-[#F4B41A] mb-6 text-center">RSVP</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="w-full bg-[#0F4C5C] border border-[#12705E] rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#F4B41A]" />
              <textarea rows={3} placeholder="Your Message" className="w-full bg-[#0F4C5C] border border-[#12705E] rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#F4B41A]"></textarea>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-2 p-3 border border-[#12705E] bg-[#0F4C5C] rounded-xl cursor-pointer hover:border-[#F4B41A]">
                  <input type="radio" name="attend" className="accent-[#F4B41A]" />
                  <span className="text-xs uppercase tracking-widest text-white">Accept</span>
                </label>
                <label className="flex-1 flex items-center gap-2 p-3 border border-[#12705E] bg-[#0F4C5C] rounded-xl cursor-pointer hover:border-[#F4B41A]">
                  <input type="radio" name="attend" className="accent-[#F4B41A]" />
                  <span className="text-xs uppercase tracking-widest text-white">Decline</span>
                </label>
              </div>
              <button className="w-full bg-[#F4B41A] text-[#064253] font-bold uppercase tracking-widest py-4 rounded-xl mt-4 hover:bg-[#FF8FA3] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Send size={16} /> Send RSVP
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
