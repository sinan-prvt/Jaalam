import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

// Golden Temple Parasol / Umbrella (Kudamattom SVG)
const GoldenUmbrella = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Umbrella Canopy */}
    <path d="M100 30 C50 30 20 70 15 90 H185 C180 70 150 30 100 30 Z" fill="#F4B41A" stroke="#B87D0E" strokeWidth="3"/>
    {/* Tier Stripes */}
    <path d="M100 30 C70 30 45 70 40 90" stroke="#E67E22" strokeWidth="4"/>
    <path d="M100 30 C130 30 155 70 160 90" stroke="#E67E22" strokeWidth="4"/>
    <path d="M100 30 C85 30 70 70 65 90" stroke="#F1C40F" strokeWidth="3"/>
    <path d="M100 30 C115 30 130 70 135 90" stroke="#F1C40F" strokeWidth="3"/>
    {/* Scallop Trim */}
    <path d="M15 90 Q25 100 35 90 Q45 100 55 90 Q65 100 75 90 Q85 100 95 90 Q105 100 115 90 Q125 100 135 90 Q145 100 155 90 Q165 100 175 90 Q185 100 185 90" fill="#E67E22" stroke="#96520B" strokeWidth="2"/>
    {/* Tassels */}
    {[25, 45, 65, 85, 105, 125, 145, 165, 175].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="95" x2={x} y2="115" stroke="#F1C40F" strokeWidth="2.5" />
        <circle cx={x} cy="117" r="3" fill="#D35400" />
      </g>
    ))}
    {/* Pole & Finial */}
    <line x1="100" y1="15" x2="100" y2="30" stroke="#D4AF37" strokeWidth="4"/>
    <circle cx="100" cy="12" r="5" fill="#D4AF37"/>
    <line x1="100" y1="90" x2="100" y2="180" stroke="#7A4A14" strokeWidth="5"/>
  </svg>
);

// Golden Nilavilakku (Brass Oil Lamp SVG)
const Nilavilakku = ({ className = "w-16 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flame */}
    <path d="M50 5 C45 20 40 30 50 40 C60 30 55 20 50 5 Z" fill="#FF8C00"/>
    <path d="M50 12 C47 22 44 28 50 35 C56 28 53 22 50 12 Z" fill="#FFD700"/>
    {/* Lamp Top Bowl */}
    <ellipse cx="50" cy="45" rx="20" ry="6" fill="#D4AF37" stroke="#997A15" strokeWidth="2"/>
    {/* Stem & Moldings */}
    <path d="M46 51 H54 V70 H46 Z" fill="#C59B27"/>
    <circle cx="50" cy="75" r="8" fill="#D4AF37" stroke="#997A15" strokeWidth="2"/>
    <path d="M47 83 H53 V115 H47 Z" fill="#C59B27"/>
    <circle cx="50" cy="120" r="10" fill="#D4AF37" stroke="#997A15" strokeWidth="2"/>
    <path d="M44 130 H56 V150 H44 Z" fill="#C59B27"/>
    {/* Base Pedestal */}
    <path d="M25 175 C25 155 35 150 50 150 C65 150 75 155 75 175 Z" fill="#D4AF37" stroke="#997A15" strokeWidth="2"/>
  </svg>
);

// Banana Leaf Graphic Corner
const BananaLeafLeft = () => (
  <svg className="w-32 h-40 md:w-44 md:h-56 opacity-85" viewBox="0 0 150 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-20 200 C30 150 60 80 140 10 C100 50 30 110 -20 200 Z" fill="#2D7053"/>
    <path d="M-20 200 C10 130 50 50 120 0 C70 40 10 120 -20 200 Z" fill="#3A8866"/>
    <path d="M-20 200 C-10 160 20 100 90 20 C50 60 0 130 -20 200 Z" fill="#4F9B73"/>
  </svg>
);

const BananaLeafRight = () => (
  <svg className="w-32 h-40 md:w-44 md:h-56 opacity-85 scale-x-[-1]" viewBox="0 0 150 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-20 200 C30 150 60 80 140 10 C100 50 30 110 -20 200 Z" fill="#2D7053"/>
    <path d="M-20 200 C10 130 50 50 120 0 C70 40 10 120 -20 200 Z" fill="#3A8866"/>
    <path d="M-20 200 C-10 160 20 100 90 20 C50 60 0 130 -20 200 Z" fill="#4F9B73"/>
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

  const date = content?.settings_json?.wedding?.date || content?.date || '13 July, 2026 AT 10:30 AM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, City";
  const venue = location;

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';
  const quote = content?.settings_json?.wedding?.quote || content?.quote || 'Two hearts united in love, starting a beautiful journey together.';

  const coupleImage = content?.hero?.image || "/media/south_indian_couple.png";

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
      <section key="hero" className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#92D4D1] text-center pt-16 pb-12 px-4">
        {/* Background Mandala Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] rounded-full border-[3px] border-[#6BB8B5]/40 flex items-center justify-center">
            <div className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-[#6BB8B5]/30 flex items-center justify-center">
              <div className="w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] rounded-full border-[2px] border-dashed border-[#6BB8B5]/50"></div>
            </div>
          </div>
        </div>

        {/* Top Corner Banana Leaves & Golden Umbrella */}
        <div className="absolute top-0 left-0 pointer-events-none z-10">
          <BananaLeafLeft />
        </div>
        <div className="absolute top-4 right-2 sm:right-6 pointer-events-none z-20">
          <GoldenUmbrella className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44" />
        </div>

        {/* Bottom Corner Banana Leaves & Nilavilakku Lamps */}
        <div className="absolute bottom-0 left-0 pointer-events-none z-10">
          <BananaLeafRight />
          <div className="absolute bottom-4 left-4 z-20">
            <Nilavilakku className="w-12 h-20 sm:w-16 sm:h-28" />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-10">
          <BananaLeafLeft />
          <div className="absolute bottom-4 right-4 z-20">
            <Nilavilakku className="w-12 h-20 sm:w-16 sm:h-28" />
          </div>
        </div>

        {/* Center Golden Umbrellas Left & Right */}
        <div className="absolute bottom-20 left-2 sm:left-6 pointer-events-none z-10">
          <GoldenUmbrella className="w-24 h-24 sm:w-32 sm:h-32 transform -scale-x-100 rotate-12" />
        </div>

        {/* Main Content Card / Circle Frame */}
        <div className="relative z-20 max-w-lg mx-auto text-center mt-12 sm:mt-16 px-4 flex flex-col items-center">

          {/* Golden Ganesha Emblem */}
          <div className="mb-4">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-14 h-14 sm:w-18 sm:h-18 object-contain mx-auto filter drop-shadow-md" />
          </div>

          <p className="text-[#2C4E5E] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-4 opacity-80" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#1E3E4B] mb-4 font-script whitespace-nowrap drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {coupleNamesStr}
          </h1>

          {/* Decorative Divider Line */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="w-12 sm:w-16 h-[1px] bg-[#2C4E5E]/40"></div>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <div className="w-12 sm:w-16 h-[1px] bg-[#2C4E5E]/40"></div>
          </div>

          <p className="text-[#1E3E4B] text-base sm:text-xl font-bold tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          <p className="text-[#2C4E5E] text-xs sm:text-sm font-medium italic opacity-90 max-w-xs mx-auto mb-6">
            {location}
          </p>

          {/* Golden Bride / Accent Flourish */}
          <div className="my-2 opacity-80">
            <svg className="w-16 h-12 text-[#D4AF37]" viewBox="0 0 100 60" fill="none">
              <path d="M10 30 Q30 10 50 30 Q70 50 90 30" stroke="#D4AF37" strokeWidth="2"/>
              <circle cx="50" cy="30" r="4" fill="#D4AF37"/>
            </svg>
          </div>

        </div>

        {/* Couple Illustration / Frame at Bottom */}
        {coupleImage && (
          <div className="relative z-20 w-full flex justify-center mt-6">
            <div className="relative max-w-[240px] sm:max-w-xs md:max-w-sm w-full mx-auto flex justify-center">
              <img
                src={coupleImage}
                alt="Couple"
                className="w-full h-auto max-h-[320px] object-contain object-bottom rounded-2xl"
                style={{ mixBlendMode: 'multiply' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/south_indian_couple.png';
                }}
              />
            </div>
          </div>
        )}
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#84C9C6] text-[#1E3E4B]">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-10 font-script text-[#1E3E4B]" style={{ fontFamily: "'Great Vibes', cursive" }}>Family Details</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white/80 p-8 rounded-3xl shadow-lg border border-teal-200/50 flex flex-col items-center">
              {groomPhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300 mb-4 shadow-md">
                  <img src={groomPhoto} alt={groomName} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#1E3E4B] mb-2 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{groomName}</h3>
              <p className="text-xs text-teal-800 uppercase tracking-widest mb-1 font-bold">Son of</p>
              <p className="text-md font-medium text-slate-800">{groomParents}</p>
            </div>

            <div className="bg-white/80 p-8 rounded-3xl shadow-lg border border-teal-200/50 flex flex-col items-center">
              {bridePhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300 mb-4 shadow-md">
                  <img src={bridePhoto} alt={brideName} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#1E3E4B] mb-2 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{brideName}</h3>
              <p className="text-xs text-teal-800 uppercase tracking-widest mb-1 font-bold">Daughter of</p>
              <p className="text-md font-medium text-slate-800">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#92D4D1]">
        <div className="max-w-2xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-amber-200">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3E4B] mb-6 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {storyTitle}
          </h2>
          <p className="text-lg text-slate-700 italic leading-relaxed">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#84C9C6]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1E3E4B] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Schedule & Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-amber-400">
              <h3 className="text-2xl font-bold text-[#1E3E4B] mb-3 font-serif">{item.event}</h3>
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
      <section key="venue" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#92D4D1]">
        <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border border-amber-200 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-teal-800">
              <MapPin className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-3xl font-bold text-[#1E3E4B] mb-4 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & Map</h3>
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
                className="inline-flex items-center gap-2 bg-[#1E3E4B] hover:bg-[#152D37] text-white px-8 py-3.5 rounded-full font-bold tracking-wide transition-colors shadow-lg text-sm mb-6"
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
      <section key="gallery" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#84C9C6]">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3E4B] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Gallery</h2>
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
      <section key="countdown" className="py-16 px-6 relative z-10 bg-[#1E3E4B] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-6 text-center">
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
      <section key="rsvp" className="py-16 px-6 relative z-10 max-w-2xl mx-auto bg-[#92D4D1]">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3E4B] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Will You Join Us?</h2>
          <p className="text-teal-900 mb-8 tracking-widest uppercase text-xs font-semibold">Please let us know if you can make it</p>

          <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border border-amber-200 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Name</label>
                  <input type="text" className="w-full bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-3 outline-none focus:border-[#1E3E4B] transition-all font-serif" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Message / Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-3 outline-none focus:border-[#1E3E4B] transition-all font-serif resize-none" placeholder="Your wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-teal-100 hover:border-[#1E3E4B] bg-teal-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#1E3E4B]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-teal-100 hover:border-[#1E3E4B] bg-teal-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#1E3E4B]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto bg-[#1E3E4B] hover:bg-[#152D37] text-white font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-colors">
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
    <div className="min-h-screen bg-[#92D4D1] relative font-sans flex flex-col items-center overflow-hidden w-full">

      {/* Audio Element */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control */}
      {musicUrl && (
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#1E3E4B] text-amber-300 shadow-2xl border border-amber-300/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#152D37] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-script mb-2 text-amber-300" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleNamesStr}</h2>
        <p className="text-teal-200/70 text-xs tracking-widest uppercase mb-2">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
