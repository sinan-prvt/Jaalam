import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

// Golden Temple Parasol / Umbrella (Kudamattom SVG)
const GoldenUmbrella = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 C50 20 15 65 10 90 H190 C185 65 150 20 100 20 Z" fill="#F4B41A" stroke="#B87D0E" strokeWidth="3"/>
    <path d="M10 90 Q100 120 190 90 L185 105 Q100 135 15 105 Z" fill="#6B3A0A" stroke="#4A2604" strokeWidth="2"/>
    <path d="M100 20 C65 20 40 65 35 90" stroke="#D97706" strokeWidth="3"/>
    <path d="M100 20 C135 20 160 65 165 90" stroke="#D97706" strokeWidth="3"/>
    <path d="M100 20 C82 20 68 65 65 90" stroke="#FBBF24" strokeWidth="2.5"/>
    <path d="M100 20 C118 20 132 65 135 90" stroke="#FBBF24" strokeWidth="2.5"/>
    <path d="M10 90 Q20 102 30 90 Q40 102 50 90 Q60 102 70 90 Q80 102 90 90 Q100 102 110 90 Q120 102 130 90 Q140 102 150 90 Q160 102 170 90 Q180 102 190 90" fill="#E67E22" stroke="#96520B" strokeWidth="2"/>
    {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="95" x2={x} y2="120" stroke="#FBBF24" strokeWidth="2.5" />
        <circle cx={x} cy="122" r="3.5" fill="#D97706" />
      </g>
    ))}
    <line x1="100" y1="5" x2="100" y2="20" stroke="#D4AF37" strokeWidth="4"/>
    <circle cx="100" cy="5" r="4.5" fill="#D4AF37"/>
    <line x1="100" y1="90" x2="100" y2="210" stroke="#5C3407" strokeWidth="6"/>
  </svg>
);

// Golden Nilavilakku (Brass Oil Lamp SVG)
const Nilavilakku = ({ className = "w-16 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 C43 20 38 30 50 42 C62 30 57 20 50 5 Z" fill="#FF7700"/>
    <path d="M50 14 C46 23 43 28 50 36 C57 28 54 23 50 14 Z" fill="#FFDD00"/>
    <ellipse cx="50" cy="46" rx="22" ry="7" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2"/>
    <path d="M45 53 H55 V72 H45 Z" fill="#B89220"/>
    <circle cx="50" cy="78" r="9" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2"/>
    <path d="M46 87 H54 V118 H46 Z" fill="#B89220"/>
    <circle cx="50" cy="124" r="11" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2"/>
    <path d="M43 135 H57 V152 H43 Z" fill="#B89220"/>
    <path d="M20 178 C20 156 32 150 50 150 C68 150 80 156 80 178 Z" fill="#D4AF37" stroke="#8C6D10" strokeWidth="2"/>
  </svg>
);

// Banana Leaf Group Left
const BananaLeafGroupLeft = () => (
  <svg className="w-36 h-48 sm:w-48 sm:h-64" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#24694C"/>
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#318762"/>
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#44A579"/>
  </svg>
);

// Banana Leaf Group Right
const BananaLeafGroupRight = () => (
  <svg className="w-36 h-48 sm:w-48 sm:h-64 scale-x-[-1]" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-30 240 C20 180 50 90 160 10 C120 60 40 130 -30 240 Z" fill="#24694C"/>
    <path d="M-30 240 C0 150 40 60 130 0 C80 50 10 130 -30 240 Z" fill="#318762"/>
    <path d="M-30 240 C-10 190 20 120 100 30 C60 80 0 150 -30 240 Z" fill="#44A579"/>
  </svg>
);

// Concentric Mandala Rings SVG
const MandalaRingsSVG = () => (
  <svg className="w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="250" r="240" stroke="#68B6AD" strokeWidth="2.5" opacity="0.6"/>
    <circle cx="250" cy="250" r="230" stroke="#68B6AD" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"/>
    {[...Array(24)].map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <g key={i} transform={`rotate(${angle} 250 250)`}>
          <path d="M250 20 C242 40 240 55 250 65 C260 55 258 40 250 20 Z" fill="none" stroke="#5DAAA1" strokeWidth="1.5" opacity="0.6"/>
          <circle cx="250" cy="43" r="3" fill="#5DAAA1" opacity="0.6"/>
        </g>
      );
    })}
    <circle cx="250" cy="250" r="185" stroke="#68B6AD" strokeWidth="3" opacity="0.7"/>
    <circle cx="250" cy="250" r="176" stroke="#68B6AD" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="250" cy="250" r="165" stroke="#68B6AD" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
  </svg>
);

// Bride Saree / Drapery Line Ornament SVG
const BrideSareeFlourish = () => (
  <svg className="w-24 h-14 mx-auto my-2" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 5 C45 20 30 40 18 55 C35 50 50 60 60 65 C70 60 85 50 102 55 C90 40 75 20 60 5 Z" stroke="#D4AF37" strokeWidth="1.8" fill="none"/>
    <path d="M60 5 Q48 30 28 45 M60 5 Q72 30 92 45" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="2 2"/>
    <path d="M38 50 Q60 62 82 50" stroke="#D4AF37" strokeWidth="1.5"/>
  </svg>
);

export default function SouthIndianMintLayout({ content, website, isEditor }: WeddingLayoutProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'scroll'>('card');
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

  const coupleImage = content?.hero?.image || "";

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

  const pages = [
    { id: 1, label: 'Page 1' },
    { id: 2, label: 'Page 2' },
    { id: 3, label: 'Page 3' },
    { id: 4, label: 'Page 4' },
    { id: 5, label: 'Page 5' }
  ];

  return (
    <div className="min-h-screen bg-[#8FCFCA] relative font-sans flex flex-col items-center justify-start py-4 px-2 sm:px-4 w-full">

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#2A4450] text-amber-300 shadow-2xl border border-amber-300/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Top Controls Header */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3 mb-4 z-40">
        
        {/* Page 1, Page 2, Page 3, Page 4, Page 5 Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur-md p-1.5 rounded-full shadow-md border border-white/40 max-w-full overflow-x-auto">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => {
                setCurrentPage(page.id);
                setViewMode('card');
              }}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full transition-all whitespace-nowrap ${currentPage === page.id && viewMode === 'card' ? 'bg-amber-400 text-slate-900 shadow-sm border border-amber-500/30' : 'bg-transparent text-slate-700 hover:bg-white/50'}`}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* View Mode Selector Switch (Card Suite vs Full Website) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${viewMode === 'card' ? 'bg-[#2A4450] text-white shadow-sm' : 'bg-white/40 text-slate-700'}`}
          >
            Multi-Page E-Card Mode
          </button>
          <button
            onClick={() => setViewMode('scroll')}
            className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${viewMode === 'scroll' ? 'bg-[#2A4450] text-white shadow-sm' : 'bg-white/40 text-slate-700'}`}
          >
            Full Website Mode
          </button>
        </div>

      </div>

      {/* ===================== MULTI-PAGE E-CARD MODE ===================== */}
      {viewMode === 'card' && (
        <div className="w-full max-w-md mx-auto flex flex-col items-center z-30">
          
          {/* Card Container Frame */}
          <div className="relative w-full aspect-[3/4.8] sm:aspect-[3/4.5] rounded-[2.5rem] shadow-2xl overflow-hidden bg-[#9EDCD6] border-4 border-white/60 flex flex-col items-center justify-between p-6 text-center select-none transition-all duration-500">
            
            {/* Background Graphic Asset */}
            <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
              <img src="/media/mint_card_frame.png" alt="Background Artwork" className="w-full h-full object-cover" />
            </div>

            {/* Background Mandala Rings SVG Fallback */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <MandalaRingsSVG />
            </div>

            {/* Corner Parasols & Lamps */}
            <div className="absolute -top-4 -right-4 pointer-events-none z-20">
              <GoldenUmbrella className="w-40 h-40 sm:w-52 sm:h-52 transform -rotate-12" />
            </div>
            <div className="absolute bottom-12 -left-6 pointer-events-none z-20">
              <GoldenUmbrella className="w-36 h-36 sm:w-48 sm:h-48 transform rotate-[35deg]" />
            </div>
            <div className="absolute bottom-2 left-4 pointer-events-none z-30">
              <Nilavilakku className="w-10 h-20 sm:w-14 sm:h-28" />
            </div>
            <div className="absolute bottom-2 right-4 pointer-events-none z-30">
              <Nilavilakku className="w-10 h-20 sm:w-14 sm:h-28" />
            </div>

            {/* Banana Leaves Corners */}
            <div className="absolute top-8 left-0 pointer-events-none z-10">
              <BananaLeafGroupLeft />
            </div>
            <div className="absolute bottom-4 right-0 pointer-events-none z-10">
              <BananaLeafGroupRight />
            </div>

            {/* CARD CONTENT PAGES */}
            <div className="relative z-30 w-full h-full flex flex-col items-center justify-center py-4 my-auto">
              
              {/* PAGE 1: COVER CARD */}
              {currentPage === 1 && (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 my-auto">
                  <div className="mb-3">
                    <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-12 h-12 sm:w-16 sm:h-16 object-contain filter drop-shadow-sm" />
                  </div>

                  <p className="text-[#333E5A] text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-3 opacity-90 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                    WE INVITE YOU<br/>TO CELEBRATE OUR WEDDING
                  </p>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#333E5A] mb-3 font-script whitespace-nowrap drop-shadow-sm px-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
                    {coupleNamesStr}
                  </h1>

                  <div className="flex items-center justify-center gap-2 my-2 opacity-80">
                    <div className="w-10 sm:w-14 h-[1.5px] bg-[#68B6AD]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#68B6AD]"></div>
                    <div className="w-10 sm:w-14 h-[1.5px] bg-[#68B6AD]"></div>
                  </div>

                  <p className="text-[#333E5A] text-sm sm:text-lg font-bold tracking-wider my-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {date}
                  </p>

                  <div className="flex items-center justify-center gap-2 my-2 opacity-80">
                    <div className="w-10 sm:w-14 h-[1.5px] bg-[#68B6AD]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#68B6AD]"></div>
                    <div className="w-10 sm:w-14 h-[1.5px] bg-[#68B6AD]"></div>
                  </div>

                  <BrideSareeFlourish />
                </div>
              )}

              {/* PAGE 2: FAMILY DETAILS CARD */}
              {currentPage === 2 && (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 max-w-xs my-auto">
                  <h2 className="text-3xl font-bold text-[#333E5A] mb-4 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Family Blessings</h2>
                  
                  <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/60 mb-3 w-full text-center">
                    <h3 className="text-xl font-bold text-[#2A4450] font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Groom: {groomName}</h3>
                    <p className="text-[10px] text-teal-800 uppercase font-bold tracking-widest">Son of</p>
                    <p className="text-xs font-semibold text-slate-800">{groomParents}</p>
                  </div>

                  <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/60 w-full text-center">
                    <h3 className="text-xl font-bold text-[#2A4450] font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Bride: {brideName}</h3>
                    <p className="text-[10px] text-teal-800 uppercase font-bold tracking-widest">Daughter of</p>
                    <p className="text-xs font-semibold text-slate-800">{brideParents}</p>
                  </div>
                </div>
              )}

              {/* PAGE 3: OUR STORY CARD */}
              {currentPage === 3 && (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 max-w-xs my-auto">
                  <h2 className="text-3xl font-bold text-[#333E5A] mb-4 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{storyTitle}</h2>
                  <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl shadow-md border border-white/60">
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      "{story}"
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 4: SCHEDULE & EVENTS CARD */}
              {currentPage === 4 && (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 max-w-xs my-auto w-full">
                  <h2 className="text-3xl font-bold text-[#333E5A] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Events & Muhurtham</h2>
                  <div className="space-y-3 w-full">
                    {schedule.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white/85 backdrop-blur-md p-4 rounded-2xl shadow-md border-l-4 border-amber-400 text-center">
                        <h4 className="text-lg font-bold text-[#2A4450]">{item.event}</h4>
                        <p className="text-xs text-amber-700 font-bold">{item.time}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.venue || location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAGE 5: VENUE & RSVP CARD */}
              {currentPage === 5 && (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 max-w-xs my-auto w-full">
                  <h2 className="text-3xl font-bold text-[#333E5A] mb-2 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & RSVP</h2>
                  
                  <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/60 text-center w-full mb-3">
                    <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-800">{location}</p>
                    {contactNumbers && (
                      <p className="text-xs font-semibold text-teal-800 mt-2">RSVP: {contactNumbers}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setViewMode('scroll')}
                    className="bg-[#2A4450] text-amber-300 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all"
                  >
                    View Full Directions & Map
                  </button>
                </div>
              )}

            </div>

            {/* CARD BOTTOM ACTION BUTTON */}
            <div className="relative z-40 w-full pt-2 pb-1">
              <button
                onClick={() => {
                  if (audioRef.current && musicUrl) {
                    audioRef.current.play().catch(console.error);
                  }
                  if (currentPage < 5) {
                    setCurrentPage(currentPage + 1);
                  } else {
                    setViewMode('scroll');
                  }
                }}
                className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold tracking-wide text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{currentPage < 5 ? `Next: Page ${currentPage + 1}` : 'Customise the card'}</span>
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* Prev / Next Page Quick Controls Below Card */}
          <div className="flex items-center justify-between w-full mt-4 px-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-white/60 hover:bg-white px-4 py-2 rounded-full disabled:opacity-40 shadow-sm"
            >
              <ChevronLeft size={16} /> Prev Page
            </button>

            <span className="text-xs font-bold text-slate-800 bg-white/40 px-3 py-1 rounded-full">
              Page {currentPage} of 5
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
              disabled={currentPage === 5}
              className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-white/60 hover:bg-white px-4 py-2 rounded-full disabled:opacity-40 shadow-sm"
            >
              Next Page <ChevronRight size={16} />
            </button>
          </div>

        </div>
      )}

      {/* ===================== FULL SCROLL WEBSITE MODE ===================== */}
      {viewMode === 'scroll' && (
        <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 z-30">
          
          {/* Hero Section */}
          <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-[#9EDCD6] rounded-[3rem] text-center p-8 shadow-2xl border-4 border-white/60">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <MandalaRingsSVG />
            </div>

            <div className="relative z-30 max-w-lg mx-auto text-center px-4 flex flex-col items-center justify-center">
              <div className="mb-3">
                <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-14 h-14 object-contain mx-auto filter drop-shadow-sm" />
              </div>

              <p className="text-[#333E5A] text-xs font-semibold tracking-[0.22em] uppercase mb-3 opacity-90 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                WE INVITE YOU<br/>TO CELEBRATE OUR WEDDING
              </p>

              <h1 className="text-5xl sm:text-7xl font-bold text-[#333E5A] mb-4 font-script whitespace-nowrap drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {coupleNamesStr}
              </h1>

              <div className="flex items-center justify-center gap-2 my-2 opacity-80">
                <div className="w-14 h-[1.5px] bg-[#68B6AD]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#68B6AD]"></div>
                <div className="w-14 h-[1.5px] bg-[#68B6AD]"></div>
              </div>

              <p className="text-[#333E5A] text-xl font-bold tracking-wider my-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {date}
              </p>

              <BrideSareeFlourish />
            </div>
          </section>

          {/* Family Details */}
          <section className="py-16 px-6 bg-white/85 backdrop-blur-md rounded-[3rem] shadow-xl text-center border border-white/60">
            <h2 className="text-4xl font-bold mb-8 font-script text-[#2A4450]" style={{ fontFamily: "'Great Vibes', cursive" }}>Family Blessings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-teal-50/50 rounded-2xl border border-teal-100">
                <h3 className="text-2xl font-bold text-[#2A4450] font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Groom: {groomName}</h3>
                <p className="text-xs text-teal-800 uppercase font-bold tracking-widest mt-1">Son of</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{groomParents}</p>
              </div>
              <div className="p-6 bg-teal-50/50 rounded-2xl border border-teal-100">
                <h3 className="text-2xl font-bold text-[#2A4450] font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Bride: {brideName}</h3>
                <p className="text-xs text-teal-800 uppercase font-bold tracking-widest mt-1">Daughter of</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{brideParents}</p>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="py-16 px-6 bg-white/85 backdrop-blur-md rounded-[3rem] shadow-xl text-center border border-white/60">
            <h2 className="text-4xl font-bold text-[#2A4450] mb-8 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Schedule & Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {schedule.map((item: any, idx: number) => (
                <div key={idx} className="bg-teal-50/50 p-6 rounded-2xl border-l-4 border-amber-400 text-center">
                  <h3 className="text-xl font-bold text-[#2A4450]">{item.event}</h3>
                  <p className="text-sm text-amber-700 font-bold mt-1">{item.time}</p>
                  <p className="text-xs text-slate-600 mt-1">{item.venue || location}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Venue & Map */}
          <section className="py-16 px-6 bg-white/85 backdrop-blur-md rounded-[3rem] shadow-xl text-center border border-white/60">
            <MapPin className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h2 className="text-4xl font-bold text-[#2A4450] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & Location</h2>
            <p className="text-lg font-bold text-slate-800 mb-6">{location}</p>

            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-6">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="pointer-events-auto"
              ></iframe>
            </div>
          </section>

        </div>
      )}

      {/* Footer */}
      <footer className="py-8 relative z-10 text-center text-slate-800 text-xs tracking-widest uppercase mt-8 opacity-75">
        <p>{coupleNamesStr} • Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
