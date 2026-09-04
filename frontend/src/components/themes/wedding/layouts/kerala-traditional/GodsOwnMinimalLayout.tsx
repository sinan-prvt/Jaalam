import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Heart, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

const MinimalLamp = ({ className = "w-12 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 C45 30 42 40 50 50 C58 40 55 30 50 20 Z" fill="#D4AF37" className="animate-pulse" />
    <path d="M50 25 C47 32 45 38 50 45 C55 38 53 32 50 25 Z" fill="#FFD700" className="animate-pulse" />
    <line x1="30" y1="60" x2="70" y2="60" stroke="#8C1C13" strokeWidth="3" strokeLinecap="round" />
    <line x1="50" y1="60" x2="50" y2="140" stroke="#8C1C13" strokeWidth="3" />
    <path d="M20 150 Q50 140 80 150" stroke="#8C1C13" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const MinimalLeaf = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 C 20 60, 50 30, 90 10 C 60 20, 30 50, 10 90 Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
  </svg>
);

export default function GodsOwnMinimalLayout({ content, website }: WeddingLayoutProps) {
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
  const story = content?.about_text || "Ours is a simple story built on love and cherished traditions. Join us as we step into our new life together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "The Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "15 March 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());
  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'MARCH');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '15');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '9:00 AM';
  const fullLocation = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Thrissur, Kerala";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "9:00 AM", event: "Muhurtham", date: rawDateStr, venue: fullLocation },
    { time: "12:00 PM", event: "Sadya", date: rawDateStr, venue: fullLocation },
    { time: "6:30 PM", event: "Reception", date: rawDateStr, venue: fullLocation }
  ];
  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Nair";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Menon";
  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: +91 9400850505";
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];
  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence is our biggest blessing.";
  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T09:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";
  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "WITH THE BLESSINGS OF GOD";

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
    <div className={`min-h-screen bg-[#Fdfaf4] text-[#8C1C13] font-serif relative flex flex-col items-center w-full ${!isOpened ? 'max-h-screen overflow-hidden' : 'overflow-hidden'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease forwards;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Opening Overlay */}
      {!isOpened && (
        <div
          className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ${
            isOpening ? 'opacity-0 pointer-events-none transform scale-110' : 'opacity-100'
          }`}
          style={{ background: '#Fdfaf4' }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <button
            onClick={handleOpen}
            className={`relative z-10 w-40 h-40 rounded-full border border-[#D4AF37] flex flex-col items-center justify-center hover:bg-[#8C1C13]/5 transition-all duration-500 hover:scale-105 cursor-pointer ${
              isOpening ? 'rotate-90 scale-75 opacity-0' : 'opacity-100'
            }`}
          >
            <div className="absolute inset-2 border border-[#D4AF37] rounded-full opacity-50 border-dashed animate-[spin_20s_linear_infinite]"></div>
            <img 
              src="/media/kerala_lamp.png" 
              alt="Traditional Motif" 
              className="w-16 h-16 object-contain mb-2 mix-blend-multiply contrast-125"
            />
            <span className="text-[#8C1C13] font-montserrat tracking-[0.3em] text-[9px] uppercase font-light">Open</span>
          </button>
          
          <div className={`mt-12 text-center transition-all duration-1000 delay-100 ${isOpening ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <h1 className="text-3xl font-cormorant text-[#8C1C13] tracking-widest uppercase">{groomFullName} & {brideFullName}</h1>
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
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-transparent border border-[#D4AF37] text-[#8C1C13] hover:bg-[#8C1C13]/5 transition-all"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
        </button>
      )}

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <MinimalLeaf className="absolute -top-4 -left-4 w-32 h-32 opacity-30" />
        <MinimalLeaf className="absolute -top-4 -right-4 w-32 h-32 -scale-x-100 opacity-30" />
      </div>

      <div className="w-full flex flex-col items-center z-10 px-4">
        {/* HERO */}
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 text-center">
          <p className={`text-[#D4AF37] text-[10px] sm:text-xs font-montserrat tracking-[0.4em] uppercase mb-10 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-300 font-light`}>
            {quoteText}
          </p>
          
          <h1 className={`text-4xl sm:text-6xl font-cormorant text-[#8C1C13] uppercase tracking-widest my-4 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-500`}>
            {groomFullName}
          </h1>
          <span className={`text-sm sm:text-base text-[#D4AF37] font-cormorant italic my-2 transition-all duration-1000 transform ${isOpened ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} delay-700`}>and</span>
          <h1 className={`text-4xl sm:text-6xl font-cormorant text-[#8C1C13] uppercase tracking-widest my-4 transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-500`}>
            {brideFullName}
          </h1>

          <div className={`mt-10 mb-8 flex items-center justify-center gap-4 transition-all duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0'} delay-1000`}>
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#8C1C13]"></div>
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          </div>
          
          <div className={`flex flex-col items-center transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-[1200ms]`}>
            <p className="text-[#8C1C13] text-sm font-montserrat tracking-[0.3em] uppercase mb-2">
              {monthStr} <span className="text-xl font-cormorant mx-2">{dayNum}</span> {yearStr}
            </p>
            <p className="text-[#D4AF37] text-xs font-montserrat tracking-[0.2em] uppercase mt-2">
              {dayName} • {timeStr}
            </p>
          </div>
          
          <div className={`mt-8 flex items-center gap-2 text-[#8C1C13] font-montserrat text-xs tracking-widest uppercase transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} delay-[1500ms]`}>
            <MapPin size={12} className="text-[#D4AF37]" strokeWidth={1.5} />
            <span>{fullLocation}</span>
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-24 w-full max-w-4xl mx-auto text-center border-t border-[#D4AF37]/30">
          <MinimalLamp className="w-8 h-12 mx-auto mb-10 opacity-70" />
          <h2 className="text-2xl sm:text-3xl font-cormorant uppercase tracking-widest text-[#8C1C13] mb-12">The Couple</h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex flex-col items-center">
              {groomPhoto ? (
                <img src={groomPhoto} alt="Groom" className="w-32 h-32 rounded-full object-cover border border-[#D4AF37] mb-6 p-1" />
              ) : (
                <div className="w-32 h-32 rounded-full border border-[#D4AF37] flex items-center justify-center mb-6 text-4xl font-cormorant p-1 text-[#D4AF37]">{groomFullName[0]}</div>
              )}
              <h3 className="text-xl font-cormorant uppercase tracking-widest text-[#8C1C13]">{groomFullName}</h3>
              <p className="text-[#D4AF37] text-[10px] font-montserrat uppercase tracking-[0.3em] mt-3">Groom</p>
              <p className="text-[#8C1C13]/60 text-xs mt-3 font-montserrat uppercase tracking-widest">Son of {groomParents}</p>
            </div>
            <div className="flex flex-col items-center">
              {bridePhoto ? (
                <img src={bridePhoto} alt="Bride" className="w-32 h-32 rounded-full object-cover border border-[#D4AF37] mb-6 p-1" />
              ) : (
                <div className="w-32 h-32 rounded-full border border-[#D4AF37] flex items-center justify-center mb-6 text-4xl font-cormorant p-1 text-[#D4AF37]">{brideFullName[0]}</div>
              )}
              <h3 className="text-xl font-cormorant uppercase tracking-widest text-[#8C1C13]">{brideFullName}</h3>
              <p className="text-[#D4AF37] text-[10px] font-montserrat uppercase tracking-[0.3em] mt-3">Bride</p>
              <p className="text-[#8C1C13]/60 text-xs mt-3 font-montserrat uppercase tracking-widest">Daughter of {brideParents}</p>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="py-24 w-full max-w-3xl mx-auto text-center border-t border-[#D4AF37]/30">
          <h2 className="text-2xl sm:text-3xl font-cormorant uppercase tracking-widest text-[#8C1C13] mb-8">{storyTitle}</h2>
          <p className="text-base sm:text-lg font-cormorant italic text-[#8C1C13]/80 leading-loose">
            "{story}"
          </p>
        </section>

        {/* SCHEDULE */}
        <section className="py-24 w-full max-w-5xl mx-auto text-center border-t border-[#D4AF37]/30">
          <h2 className="text-2xl sm:text-3xl font-cormorant uppercase tracking-widest text-[#8C1C13] mb-12">Itinerary</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-[#D4AF37] mb-4" strokeWidth={1} />
                <h3 className="text-lg font-cormorant uppercase tracking-widest text-[#8C1C13] mb-3">{item.event}</h3>
                <p className="text-[#8C1C13] text-[11px] font-montserrat tracking-[0.2em] mb-2">{item.time}</p>
                <p className="text-[#8C1C13]/60 text-[10px] font-montserrat uppercase tracking-widest">{item.venue}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VENUE */}
        <section className="py-24 w-full max-w-4xl mx-auto text-center border-t border-[#D4AF37]/30">
          <MapPin className="w-6 h-6 text-[#D4AF37] mx-auto mb-6" strokeWidth={1} />
          <h2 className="text-2xl sm:text-3xl font-cormorant uppercase tracking-widest text-[#8C1C13] mb-6">Location</h2>
          <p className="text-sm text-[#8C1C13]/80 font-montserrat uppercase tracking-widest mb-10">{fullLocation}</p>
          
          {venuePhoto && (
            <img src={venuePhoto} alt="Venue" className="w-full max-w-2xl mx-auto h-64 object-cover mb-10 grayscale hover:grayscale-0 transition-all duration-700 opacity-90" />
          )}
          
          <div className="w-full max-w-2xl mx-auto aspect-video mb-10 grayscale">
            <iframe
              src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-[#D4AF37] text-[#8C1C13] px-8 py-4 font-montserrat uppercase tracking-[0.2em] text-[10px] hover:bg-[#8C1C13]/5 transition-colors">
              <Navigation size={12} strokeWidth={1.5} /> Directions
            </a>
          )}
        </section>

        {/* COUNTDOWN */}
        <section className="py-24 w-full max-w-3xl mx-auto text-center border-t border-[#D4AF37]/30">
          <h2 className="text-[10px] font-montserrat uppercase tracking-[0.4em] text-[#D4AF37] mb-10">Counting Down</h2>
          <div className="flex justify-center gap-6 sm:gap-12">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-cormorant text-[#8C1C13] mb-3">{item.value}</span>
                <span className="text-[9px] uppercase font-montserrat tracking-[0.3em] text-[#D4AF37]">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* WISHES */}
        <section className="py-24 w-full max-w-2xl mx-auto text-center border-t border-[#D4AF37]/30">
          <h2 className="text-2xl sm:text-3xl font-cormorant uppercase tracking-widest text-[#8C1C13] mb-4 relative z-10">Blessings</h2>
          <p className="text-[10px] font-montserrat uppercase tracking-[0.2em] text-[#8C1C13]/60 mb-10 relative z-10">Tap to send a wish</p>
          
          <div className="relative inline-block mb-6">
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-32 h-32 rounded-full border border-[#D4AF37] animate-ping"></div>
              </div>
            )}
            <button
              onClick={handleTapWish}
              className={`w-20 h-20 rounded-full border border-[#D4AF37] flex items-center justify-center mx-auto relative z-10 transition-transform ${isCounterPopping ? 'scale-110' : 'hover:scale-105'} bg-[#Fdfaf4]`}
            >
              <Heart className={`w-6 h-6 text-[#8C1C13] ${isCounterPopping ? 'fill-[#8C1C13] animate-bounce' : ''}`} strokeWidth={1} />
            </button>
          </div>
          
          <div className="mt-2 relative z-10">
            <span className="text-2xl font-cormorant text-[#8C1C13]">{wishCount}</span>
          </div>
        </section>

        {/* RSVP */}
        <section className="py-24 w-full max-w-2xl mx-auto border-t border-[#D4AF37]/30 mb-20">
          <h2 className="text-2xl sm:text-3xl font-cormorant uppercase tracking-widest text-[#8C1C13] mb-12 text-center">RSVP</h2>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="border-b border-[#D4AF37]/50">
              <input type="text" placeholder="GUEST NAME" className="w-full bg-transparent border-none px-2 py-3 text-[#8C1C13] font-montserrat text-xs tracking-[0.2em] uppercase placeholder-[#8C1C13]/40 focus:outline-none focus:ring-0" />
            </div>
            <div className="border-b border-[#D4AF37]/50">
              <textarea rows={2} placeholder="MESSAGE" className="w-full bg-transparent border-none px-2 py-3 text-[#8C1C13] font-montserrat text-xs tracking-[0.2em] uppercase placeholder-[#8C1C13]/40 focus:outline-none focus:ring-0 resize-none"></textarea>
            </div>
            <div className="flex gap-6 justify-center pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="attend" className="accent-[#8C1C13] w-3 h-3" />
                <span className="text-[10px] uppercase font-montserrat tracking-[0.2em] text-[#8C1C13]">Accept</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="attend" className="accent-[#8C1C13] w-3 h-3" />
                <span className="text-[10px] uppercase font-montserrat tracking-[0.2em] text-[#8C1C13]">Decline</span>
              </label>
            </div>
            <div className="text-center mt-10">
              <button className="border border-[#D4AF37] text-[#8C1C13] font-montserrat text-[10px] uppercase tracking-[0.3em] px-12 py-4 hover:bg-[#8C1C13]/5 transition-colors flex items-center justify-center gap-3 mx-auto">
                <Send size={12} strokeWidth={1.5} /> Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
