import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';

// Golden Temple Parasol / Umbrella (Kudamattom SVG)
const GoldenUmbrella = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 270" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 C50 20 15 65 10 90 H190 C185 65 150 20 100 20 Z" fill="#F4B41A" stroke="#B87D0E" strokeWidth="3" />
    <path d="M10 90 Q100 120 190 90 L185 105 Q100 135 15 105 Z" fill="#6B3A0A" stroke="#4A2604" strokeWidth="2" />
    <path d="M100 20 C65 20 40 65 35 90" stroke="#D97706" strokeWidth="3" />
    <path d="M100 20 C135 20 160 65 165 90" stroke="#D97706" strokeWidth="3" />
    <path d="M100 20 C82 20 68 65 65 90" stroke="#FBBF24" strokeWidth="2.5" />
    <path d="M100 20 C118 20 132 65 135 90" stroke="#FBBF24" strokeWidth="2.5" />
    <path d="M10 90 Q20 102 30 90 Q40 102 50 90 Q60 102 70 90 Q80 102 90 90 Q100 102 110 90 Q120 102 130 90 Q140 102 150 90 Q160 102 170 90 Q180 102 190 90" fill="#E67E22" stroke="#96520B" strokeWidth="2" />
    {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="95" x2={x} y2="120" stroke="#FBBF24" strokeWidth="2.5" />
        <circle cx={x} cy="122" r="3.5" fill="#D97706" />
      </g>
    ))}
    <line x1="100" y1="5" x2="100" y2="20" stroke="#D4AF37" strokeWidth="4" />
    <circle cx="100" cy="5" r="4.5" fill="#D4AF37" />
    <line x1="100" y1="90" x2="100" y2="260" stroke="#5C3407" strokeWidth="6" />
  </svg>
);

// Golden Nilavilakku (Brass Oil Lamp SVG)
const Nilavilakku = ({ className = "w-16 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Glowing Flame with Flicker Animation */}
    <g className="animate-pulse">
      <path d="M50 5 C43 20 38 30 50 42 C62 30 57 20 50 5 Z" fill="#FF7700" />
      <path d="M50 14 C46 23 43 28 50 36 C57 28 54 23 50 14 Z" fill="#FFDD00" />
    </g>
    <ellipse cx="50" cy="46" rx="22" ry="7" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
    <path d="M45 53 H55 V72 H45 Z" fill="#B89220" />
    <circle cx="50" cy="78" r="9" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
    <path d="M46 87 H54 V118 H46 Z" fill="#B89220" />
    <circle cx="50" cy="124" r="11" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
    <path d="M43 135 H57 V152 H43 Z" fill="#B89220" />
    <path d="M20 178 C20 156 32 150 50 150 C68 150 75 156 80 178 Z" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2" />
  </svg>
);

// Banana Leaf Group Left Top
const BananaLeafTopLeft = () => (
  <svg className="w-28 h-40 sm:w-40 sm:h-56" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#24694C" />
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#318762" />
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#44A579" />
  </svg>
);

// Banana Leaf Group Right Bottom
const BananaLeafBottomRight = () => (
  <svg className="w-28 h-40 sm:w-40 sm:h-56 scale-x-[-1]" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#24694C" />
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#318762" />
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#44A579" />
  </svg>
);

// Concentric Mandala Rings SVG with Continuous Slow Rotation Animation
const MandalaRingsSVG = () => (
  <svg className="w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] md:w-[660px] md:h-[660px] animate-[spin_60s_linear_infinite]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="250" r="212" fill="#D4F4F0" opacity="0.8" />
    <circle cx="250" cy="250" r="240" stroke="#5AA89F" strokeWidth="2.5" opacity="0.6" />
    <circle cx="250" cy="250" r="230" stroke="#5AA89F" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />
    {[...Array(24)].map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <g key={i} transform={`rotate(${angle} 250 250)`}>
          <path d="M250 20 C242 40 240 55 250 65 C260 55 258 40 250 20 Z" fill="none" stroke="#4F9B92" strokeWidth="1.5" opacity="0.6" />
          <circle cx="250" cy="43" r="3" fill="#4F9B92" opacity="0.6" />
        </g>
      );
    })}
    <circle cx="250" cy="250" r="212" stroke="#5AA89F" strokeWidth="2" opacity="0.8" />
    <circle cx="250" cy="250" r="185" stroke="#5AA89F" strokeWidth="1.5" opacity="0.6" />
    <circle cx="250" cy="250" r="165" stroke="#5AA89F" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
  </svg>
);

// Bride Saree / Drapery Line Ornament SVG
const BrideSareeFlourish = () => (
  <svg className="w-28 h-18 mx-auto my-2" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 5 C45 20 30 40 18 55 C35 50 50 60 60 65 C70 60 85 50 102 55 C90 40 75 20 60 5 Z" stroke="#E0B84C" strokeWidth="2" fill="none" />
    <path d="M60 5 Q48 30 28 45 M60 5 Q72 30 92 45" stroke="#E0B84C" strokeWidth="1.2" strokeDasharray="2 2" />
    <path d="M38 50 Q60 62 82 50" stroke="#E0B84C" strokeWidth="1.5" />
  </svg>
);

export default function SouthIndianMintLayout({ content, website }: WeddingLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const coupleNamesStr = content?.hero_title || 'Chiranjeev & Aarohi';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Chiranjeev';
  const brideName = nameParts[1]?.trim() || 'Aarohi';

  const date = content?.settings_json?.wedding?.date || content?.date || '13 July, 2026 AT 1:30 AM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, City";

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "9:00 AM Onwards", event: "Muhurtham", date: date, venue: location },
      { time: "7:00 PM Onwards", event: "Reception", date: date, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "We met at a coffee shop and found a love that lasts forever. Join us as we celebrate our journey together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-07-13T09:00";
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
      <section key="hero" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#A3DFD8] text-center py-16 px-4">

        {/* Background Mandala Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <MandalaRingsSVG />
        </div>

        {/* Banana Leaves - Corners */}
        <div className="absolute top-6 left-0 pointer-events-none z-10">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10">
          <BananaLeafBottomRight />
        </div>

        {/* Top Right Golden Parasol / Umbrella (Stick Tip Disappearing Past Right Border) */}
        <div className="absolute top-0 -right-8 sm:top-2 sm:-right-8 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform -rotate-[32deg]" />
        </div>

        {/* Bottom Left Golden Parasol / Umbrella (Stick Tip Disappearing Past Left Border) */}
        <div className="absolute bottom-0 -left-10 sm:bottom-2 sm:-left-8 md:bottom-4 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform rotate-[35deg]" />
        </div>

        {/* Bottom Corner Golden Nilavilakku Brass Oil Lamps */}
        <div className="absolute bottom-3 left-4 sm:left-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>
        <div className="absolute bottom-3 right-4 sm:right-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>

        {/* Center Main Invitation Content */}
        <div className="relative z-30 w-full max-w-[320px] sm:max-w-[400px] aspect-square flex flex-col items-center justify-center text-center mx-auto my-auto p-4 sm:p-6 scale-95 sm:scale-100 translate-y-14 sm:translate-y-16">

          {/* Golden Ganesha Line Icon */}
          <div className="mb-3">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-10 h-10 sm:w-14 sm:h-14 object-contain mx-auto filter drop-shadow-sm" />
          </div>

          <p className="text-[#354359] text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-3 opacity-90 leading-relaxed font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU<br />TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#354359] mb-3 font-script whitespace-nowrap drop-shadow-sm px-2" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
            {coupleNamesStr}
          </h1>

          {/* Teal Line Flourish with Center Dot above Date */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-85">
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#5AA89F]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#5AA89F]"></div>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#5AA89F]"></div>
          </div>

          <p className="text-[#354359] text-sm sm:text-lg font-bold tracking-wider my-1 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          {/* Teal Line Flourish with Center Dot below Date */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-85">
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#5AA89F]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#5AA89F]"></div>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#5AA89F]"></div>
          </div>

          {/* Golden Bride Saree Drapery Flourish */}
          <BrideSareeFlourish />

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#88D3CB] text-[#2A4450]">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-10 font-script text-[#2A4450]" style={{ fontFamily: "'Great Vibes', cursive" }}>Family Details</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white/85 p-8 rounded-3xl shadow-lg border border-teal-200/50 flex flex-col items-center">
              {groomPhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300 mb-4 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#2A4450] mb-2 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{groomName}</h3>
              <p className="text-xs text-teal-800 uppercase tracking-widest mb-1 font-bold">Son of</p>
              <p className="text-md font-medium text-slate-800">{groomParents}</p>
            </div>

            <div className="bg-white/85 p-8 rounded-3xl shadow-lg border border-teal-200/50 flex flex-col items-center">
              {bridePhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300 mb-4 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#2A4450] mb-2 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{brideName}</h3>
              <p className="text-xs text-teal-800 uppercase tracking-widest mb-1 font-bold">Daughter of</p>
              <p className="text-md font-medium text-slate-800">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#A3DFD8]">
        <div className="max-w-2xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-amber-200">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A4450] mb-6 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {storyTitle}
          </h2>
          <p className="text-lg text-slate-700 italic leading-relaxed">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#88D3CB]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#2A4450] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Schedule & Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-amber-400">
              <h3 className="text-2xl font-bold text-[#2A4450] mb-3 font-serif">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-teal-900">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span className="font-semibold">{item.date || date}</span>
              </div>
              <p className="text-amber-700 font-bold">{item.time}</p>
              <p className="text-slate-600 text-sm mt-2">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#A3DFD8]">
        <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border border-amber-200 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-teal-800">
              <MapPin className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-3xl font-bold text-[#2A4450] mb-4 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & Map</h3>
            <p className="text-xl font-medium text-slate-800 mb-2">{location}</p>
            <p className="text-md text-slate-500 max-w-md mx-auto mb-6">Join us to celebrate our joyous occasion.</p>

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
                className="inline-flex items-center gap-2 bg-[#2A4450] hover:bg-[#1E333C] text-white px-8 py-3.5 rounded-full font-bold tracking-wide transition-colors shadow-lg text-sm mb-6"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-1">RSVP / Contact Numbers</p>
                <p className="text-base sm:text-lg font-bold text-slate-800">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#88D3CB]">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2A4450] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-white">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-6 relative z-10 bg-[#2A4450] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-6 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-amber-300 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Counting Down To</h2>
          <p className="text-lg italic mb-8 text-teal-200">Our Special Day</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20">
                  <span className="text-xl sm:text-3xl font-bold text-white">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-amber-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-6 relative z-10 max-w-2xl mx-auto bg-[#A3DFD8]">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A4450] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Will You Join Us?</h2>
          <p className="text-teal-900 mb-8 tracking-widest uppercase text-xs font-semibold">Please let us know if you can make it</p>

          <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border border-amber-200 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Name</label>
                  <input type="text" className="w-full bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-3 outline-none focus:border-[#2A4450] transition-all font-serif" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Message / Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-3 outline-none focus:border-[#2A4450] transition-all font-serif resize-none" placeholder="Your wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-teal-100 hover:border-[#2A4450] bg-teal-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#2A4450]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-teal-100 hover:border-[#2A4450] bg-teal-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#2A4450]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto bg-[#2A4450] hover:bg-[#1E333C] text-white font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-colors">
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
    <div className={`min-h-screen bg-[#A3DFD8] relative font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {/* Audio Element */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control */}
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#2A4450] text-amber-300 shadow-2xl border border-amber-300/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Overlay Envelope */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#A3DFD8] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'} overflow-hidden`}>

        {/* Background Mandala Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <MandalaRingsSVG />
        </div>

        {/* Banana Leaves - Corners */}
        <div className="absolute top-6 left-0 pointer-events-none z-10">
          <BananaLeafTopLeft />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10">
          <BananaLeafBottomRight />
        </div>

        {/* Top Right Golden Parasol / Umbrella (Stick Tip Disappearing Past Right Border) */}
        <div className="absolute top-0 -right-8 sm:top-2 sm:-right-8 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform -rotate-[32deg]" />
        </div>

        {/* Bottom Left Golden Parasol / Umbrella (Stick Tip Disappearing Past Left Border) */}
        <div className="absolute bottom-0 -left-10 sm:bottom-2 sm:-left-8 md:bottom-4 pointer-events-none z-20">
          <GoldenUmbrella className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 transform rotate-[35deg]" />
        </div>

        {/* Bottom Corner Golden Nilavilakku Brass Oil Lamps */}
        <div className="absolute bottom-3 left-4 sm:left-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>
        <div className="absolute bottom-3 right-4 sm:right-10 pointer-events-none z-30">
          <Nilavilakku className="w-12 h-24 sm:w-16 sm:h-32" />
        </div>

        {/* Center Main Invitation Content (Strictly Enclosed Inside Inner Circle) */}
        <div className="relative z-30 w-full max-w-[320px] sm:max-w-[400px] aspect-square flex flex-col items-center justify-center text-center mx-auto my-auto p-4 sm:p-6 scale-95 sm:scale-100 translate-y-14 sm:translate-y-16">

          {/* Golden Ganesha Line Icon */}
          <div className="mb-2">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-8 h-8 sm:w-11 sm:h-11 object-contain mx-auto filter drop-shadow-sm" />
          </div>

          <p className="text-[#354359] text-[9px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2 opacity-90 leading-tight font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU<br />TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#354359] mb-2 font-script whitespace-nowrap drop-shadow-sm px-2" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
            {coupleNamesStr}
          </h1>

          {/* Teal Line Flourish with Center Dot above Date */}
          <div className="flex items-center justify-center gap-2 my-1.5 opacity-85">
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#5AA89F]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#5AA89F]"></div>
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#5AA89F]"></div>
          </div>

          <p className="text-[#354359] text-xs sm:text-base font-bold tracking-wider my-0.5 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          {/* Teal Line Flourish with Center Dot below Date */}
          <div className="flex items-center justify-center gap-2 my-1.5 opacity-85">
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#5AA89F]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#5AA89F]"></div>
            <div className="w-10 sm:w-14 h-[1.5px] bg-[#5AA89F]"></div>
          </div>

          {/* Golden Bride Saree Drapery Flourish */}
          <BrideSareeFlourish />

        </div>

        {/* OPEN INVITATION BUTTON (Positioned below the circle) */}
        <div className="relative z-40 mb-6 sm:mb-10 flex-shrink-0">
          <button
            onClick={() => {
              setIsOpened(true);
              if (audioRef.current && musicUrl) {
                audioRef.current.play().catch(console.error);
              }
            }}
            className="group relative overflow-hidden bg-[#354359] hover:bg-[#2A3547] text-amber-300 font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3.5 md:px-12 md:py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border border-amber-300/40 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Invitation
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#1E333C] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-script mb-2 text-amber-300" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleNamesStr}</h2>
        <p className="text-teal-200/70 text-xs tracking-widest uppercase mb-2">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
