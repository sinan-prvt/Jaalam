import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';

const FloralCornerSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 0C30 20 60 25 90 15C70 40 75 75 55 100C40 70 20 55 0 10" fill="currentColor" fillOpacity="0.18" />
    <path d="M5 25C25 15 55 35 65 5C45 25 25 55 5 25Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M25 5C35 25 55 45 25 65C15 45 5 25 25 5Z" fill="currentColor" fillOpacity="0.22" />
    <circle cx="35" cy="35" r="12" fill="currentColor" fillOpacity="0.15" />
    <circle cx="35" cy="35" r="7" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export default function RoyalNikkahLayout({ content, website }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const coupleNamesStr = content?.hero_title || 'Muhammad Patel & Samira Hadid';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Muhammad Patel';
  const brideName = nameParts[1]?.trim() || 'Samira Hadid';

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || 'November 22, 2030';
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '2:00 PM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Borcelle Restaurant, 000 Anywhere St., Any City";

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM Onwards", event: "Nikkah Ceremony", date: rawDateStr, venue: location },
      { time: "7:00 PM Onwards", event: "Grand Walima Reception", date: rawDateStr, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 000-000-0000";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "And We created you in pairs. (Surah An-Naba 78:8) — Solicit your prayers and blessings as we embark on this sacred journey together under Allah's guidance.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story & Sacred Union";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2030-11-22T14:00";
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

  // Parse Month, Day Number, Day Name, Year from date string or custom fields
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'NOVEMBER');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? dateObj.getDate() : '22');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'MONDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? dateObj.getFullYear() : '2030');

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'about', label: 'Family Details', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule & Events', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];
  const sections = content?.settings_json?.wedding?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-between text-center bg-cover bg-top bg-no-repeat p-0 overflow-hidden" style={{ backgroundImage: "url('/media/royal_nikkah_bg.png')" }}>

        {/* Animated Falling Petals & Leaves Effect */}
        <style>{`
          @keyframes petalFall {
            0% {
              transform: translateY(-5vh) rotate(0deg) translateX(0px);
              opacity: 0;
            }
            15% {
              opacity: 0.85;
            }
            85% {
              opacity: 0.85;
            }
            100% {
              transform: translateY(105vh) rotate(360deg) translateX(35px);
              opacity: 0;
            }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(14)].map((_, i) => {
            const isLeaf = i % 3 === 0;
            const leftPos = (i * 7 + 4) % 94;
            const delay = (i * 0.6) % 5;
            const duration = 7 + (i % 6);
            const size = 14 + (i % 4) * 4;

            return (
              <div
                key={i}
                className="absolute top-[-5%]"
                style={{
                  left: `${leftPos}%`,
                  animation: `petalFall ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                {isLeaf ? (
                  // Green Leaf SVG
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="#2D5A27" className="opacity-60 rotate-45">
                    <path d="M17,8C8,10 5,16 3,21C8,20 15,18 19,10C20,8 19,7 17,8Z" />
                  </svg>
                ) : (
                  // Soft White / Cream Rose Petal SVG
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFBF5" className="opacity-80 drop-shadow-sm">
                    <path d="M12,2 C15,5 19,8 19,13 C19,17.5 15.5,21 12,21 C8.5,21 5,17.5 5,13 C5,8 9,5 12,2 Z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>        {/* Top Calligraphy & Nikkah Title Block */}
        <div className="relative z-20 pt-20 sm:pt-28 md:pt-32 max-w-sm sm:max-w-md mx-auto flex flex-col items-center px-4 pb-8">

          {/* Bismillah Arabic Calligraphy */}
          <div className="mb-4 text-[#2C523C] font-serif">
            <span className="text-3xl sm:text-5xl tracking-wide font-bold block" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
            </span>
          </div>

          <p className="text-[#385E48] text-xs sm:text-sm font-semibold tracking-wider max-w-xs mx-auto mb-6 leading-relaxed font-serif">
            With the blessings of Allah we are delighted to invite you to the Nikkah ceremony of:
          </p>

          {/* Groom & Bride Names */}
          <h1 className="text-3xl sm:text-5xl font-bold text-[#2C523C] my-1 font-serif tracking-wide drop-shadow-sm">
            {groomName}
          </h1>

          <p className="text-xl sm:text-2xl text-[#2C523C] font-serif italic my-1 font-semibold">&</p>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#2C523C] my-1 font-serif tracking-wide drop-shadow-sm">
            {brideName}
          </h1>

          {/* Date Breakdown */}
          {/* Date Breakdown Block */}
          <div className="flex flex-col items-center my-4 text-[#2C523C]">
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase font-sans mb-2 opacity-90">{monthStr}</span>
            <div className="flex items-center justify-center gap-4">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-sans">{dayName}</span>
              <span className="text-3xl sm:text-5xl font-extrabold font-serif px-3 border-x-2 border-[#2C523C]/30">{dayNum}</span>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-sans">AT {timeStr}</span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] font-sans mt-2 opacity-90">{yearStr}</span>
          </div>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#F4F9F6] via-[#E8F3EE] to-[#F4F9F6] text-[#2C523C]">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-emerald-200/80 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">

          {/* Botanical Floral Corner Accents */}
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -left-4 w-28 sm:w-36 opacity-75 pointer-events-none z-10" />
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -right-4 w-28 sm:w-36 opacity-75 pointer-events-none z-10 -scale-x-100" />
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -bottom-4 -left-4 w-28 sm:w-36 opacity-75 pointer-events-none z-10 -scale-y-100" />
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -bottom-4 -right-4 w-28 sm:w-36 opacity-75 pointer-events-none z-10 -scale-x-100 -scale-y-100" />

          {/* Floral Decorative Header */}
          <div className="flex flex-col items-center mb-6 relative z-20">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#2C523C] to-transparent"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-100/80 border border-emerald-300 flex items-center justify-center text-[#2C523C]">
                <Sparkles size={16} className="text-[#2C523C] animate-pulse" />
              </div>
              <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#2C523C] to-transparent"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C523C] tracking-wide font-serif">PARENTS & FAMILY BLESSINGS</h2>
            <p className="text-[#385E48] text-xs sm:text-sm italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mt-2 font-serif">
              solicit your du'as & request the honour of your presence to grace the auspicious occasion of the Nikkah & Walima celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-4 relative z-20">
            {/* Groom Card */}
            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2C523C] mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-100/80 border border-emerald-300 flex items-center justify-center mb-3 text-[#2C523C]">
                  <Heart className="w-7 h-7 fill-emerald-200 animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#2C523C] mb-1 font-serif">{groomName}</h3>
              <p className="text-xs text-[#385E48] font-bold uppercase tracking-widest mb-1 font-serif">Groom</p>
              <p className="text-xs text-slate-600 font-serif">Son of {groomParents}</p>
            </div>

            {/* Bride Card */}
            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2C523C] mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-100/80 border border-emerald-300 flex items-center justify-center mb-3 text-[#2C523C]">
                  <Heart className="w-7 h-7 fill-emerald-200 animate-pulse" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#2C523C] mb-1 font-serif">{brideName}</h3>
              <p className="text-xs text-[#385E48] font-bold uppercase tracking-widest mb-1 font-serif">Bride</p>
              <p className="text-xs text-slate-600 font-serif">Daughter of {brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#E8F3EE] via-[#F4F9F6] to-[#E8F3EE]">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-emerald-200/80 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">

          <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -left-4 w-28 opacity-70 pointer-events-none z-10" />
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -right-4 w-28 opacity-70 pointer-events-none z-10 -scale-x-100" />

          <div className="relative z-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#2C523C]/40"></div>
              <Sparkles className="w-7 h-7 text-amber-600 animate-bounce" />
              <div className="h-[1px] w-12 bg-[#2C523C]/40"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C523C] mb-6 font-serif tracking-wide">
              {storyTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed font-serif">
              "{story}"
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-gradient-to-b from-[#F4F9F6] via-[#E8F3EE] to-[#F4F9F6]">
        {/* Section Header Flourish */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#2C523C] to-transparent"></div>
            <Calendar className="w-6 h-6 text-[#2C523C]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#2C523C] to-transparent"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C523C] font-serif tracking-wide">Schedule & Nikkah Events</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-[#2C523C] text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-emerald-100 relative overflow-hidden">
              <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-6 -right-6 w-24 opacity-50 pointer-events-none z-10 -scale-x-100" />
              <h3 className="text-2xl font-bold text-[#2C523C] mb-3 font-serif relative z-20">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-emerald-900 font-serif relative z-20">
                <Calendar className="w-5 h-5 text-[#2C523C]" />
                <span className="font-semibold">{item.date || rawDateStr}</span>
              </div>
              <p className="text-[#2C523C] font-bold text-lg mb-2 font-serif relative z-20">{item.time}</p>
              <p className="text-slate-600 text-sm font-serif relative z-20">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-gradient-to-b from-[#E8F3EE] via-[#F4F9F6] to-[#E8F3EE]">
        <div className="bg-white/95 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border-2 border-emerald-200/80 relative overflow-hidden">
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -left-4 w-32 opacity-75 pointer-events-none z-10" />
          <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -right-4 w-32 opacity-75 pointer-events-none z-10 -scale-x-100" />

          <div className="relative z-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#2C523C]">
              <MapPin className="w-8 h-8 text-[#2C523C] animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-[#2C523C] mb-3 font-serif tracking-wide">Venue & Map</h3>
            <p className="text-xl font-semibold text-slate-800 mb-2 font-serif">{location}</p>
            <p className="text-md text-slate-500 max-w-md mx-auto mb-6 font-serif">We look forward to welcoming you to our sacred Nikkah celebration.</p>

            {/* Google Maps Embed Iframe */}
            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-6 bg-white">
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
                className="inline-flex items-center gap-2 bg-[#2C523C] hover:bg-[#1e3b2b] text-amber-200 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6 hover:scale-105"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-1 font-serif">RSVP / Contact Numbers</p>
                <p className="text-base sm:text-lg font-bold text-slate-800 font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-16 px-4 sm:px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#F4F9F6]">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <div className="h-[1px] w-12 bg-[#2C523C]"></div>
            <Sparkles className="w-5 h-5 text-[#2C523C]" />
            <div className="h-[1px] w-12 bg-[#2C523C]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C523C] font-serif tracking-wide">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500 relative">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-4 sm:px-6 relative z-10 bg-[#2C523C] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-8 text-center border-2 border-amber-300/40">
        <FloralCornerSVG className="absolute top-0 left-0 w-28 h-28 text-amber-300 pointer-events-none z-10" />
        <FloralCornerSVG className="absolute bottom-0 right-0 w-28 h-28 text-amber-300 pointer-events-none z-10 rotate-180" />

        <div className="max-w-3xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-amber-300 font-serif">Counting Down To</h2>
          <p className="text-base sm:text-lg italic mb-8 text-emerald-100 font-serif">Our Royal Nikkah Ceremony</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20 hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-3xl font-bold text-amber-300 font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-emerald-200 font-serif">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-4 sm:px-6 relative z-10 max-w-2xl mx-auto bg-[#E8F3EE]">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="h-[1px] w-12 bg-[#2C523C]"></div>
              <Sparkles className="w-5 h-5 text-[#2C523C]" />
              <div className="h-[1px] w-12 bg-[#2C523C]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C523C] font-serif tracking-wide">Will You Join Us?</h2>
            <p className="text-[#385E48] tracking-widest uppercase text-xs font-semibold mt-1 font-serif">Please let us know if you can attend</p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border-2 border-emerald-200/80 text-left relative overflow-hidden">
            <img src="/media/floral_corner_accent.png" alt="" className="absolute -top-4 -right-4 w-28 opacity-75 pointer-events-none z-10 -scale-x-100" />

            <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-serif">Name</label>
                  <input type="text" className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-3 outline-none focus:border-[#2C523C] transition-all font-serif" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 font-serif">Du'as & Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-3 outline-none focus:border-[#2C523C] transition-all font-serif resize-none" placeholder="Share your warm du'as and wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 font-serif">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-emerald-200 hover:border-[#2C523C] bg-emerald-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#2C523C]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-serif">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-emerald-200 hover:border-[#2C523C] bg-emerald-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#2C523C]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs font-serif">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C523C] hover:bg-[#1e3b2b] text-amber-200 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
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
    <div className={`min-h-screen bg-[#F4F9F6] relative font-serif flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#1B4D3E] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Overlay Envelope */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex flex-col justify-between items-center text-center bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} overflow-hidden p-6 sm:p-12 cursor-pointer`}
        style={{ backgroundImage: "url('/media/islamic_envelope_clean_bg.png')" }}
      >

        {/* Top Title Flourish */}
        <div className={`relative z-20 pt-12 sm:pt-16 flex flex-col items-center transition-all duration-500 ${isOpening ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <span className="text-xl sm:text-3xl text-amber-200 font-serif tracking-widest my-1 font-bold" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
          </span>
        </div>

        {/* Center Gold Wax Seal Monogram Emblem with 3D Break Animation */}
        <div
          className="relative z-20 flex flex-col items-center justify-center my-auto group"
        >
          {/* Animated Glow Rings when opening */}
          {isOpening && (
            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
          )}

          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 p-2 shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out flex items-center justify-center border-2 border-amber-200/90 ${isOpening ? 'scale-125 rotate-12 opacity-80' : 'group-hover:scale-110 active:scale-95'}`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0D2E26] to-[#051814] border-2 border-amber-300/80 flex flex-col items-center justify-center p-4 text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <span className="text-amber-300 text-2xl sm:text-3xl font-extrabold font-serif tracking-wider drop-shadow">
                {groomName[0]} & {brideName[0]}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-200 tracking-widest uppercase font-serif mt-1.5 font-bold opacity-90">
                {isOpening ? 'UNSEALING...' : 'TAP TO UNSEAL'}
              </span>

              {/* Sparkles Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300/0 via-amber-200/30 to-amber-300/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>

          <h1 className={`text-2xl sm:text-4xl font-bold text-amber-100 mt-6 font-serif tracking-wide drop-shadow-md transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
            {groomName} & {brideName}
          </h1>
          <p className={`text-amber-200/90 text-xs sm:text-sm tracking-widest font-serif uppercase mt-1 transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
            {rawDateStr}
          </p>
        </div>

        {/* Bottom Spacing */}
        <div className="pb-8 sm:pb-12" />

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#12362b] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-amber-400/30">
        <h2 className="text-2xl font-serif mb-2 text-amber-300">{coupleNamesStr}</h2>
        <p className="text-emerald-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
