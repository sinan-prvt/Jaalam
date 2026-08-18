import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

// Top Left Hanging Coconut Palm Fronds SVG
const CoconutPalmTopLeft = () => (
  <svg className="w-44 h-36 sm:w-64 sm:h-52 md:w-80 md:h-64" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main Palm Stem 1 */}
    <path d="M-20 -10 Q80 40 220 70" stroke="#1B5E20" strokeWidth="4" strokeLinecap="round" />
    {/* Leaves along Stem 1 */}
    <path d="M10 5 C30 35 15 50 15 50 M40 18 C65 52 50 68 50 68 M70 28 C100 68 80 88 80 88 M100 38 C135 80 115 102 115 102 M130 46 C165 92 145 114 145 114 M160 54 C195 98 178 122 178 122 M185 62 C215 104 200 126 200 126 M205 66 C232 104 218 124 218 124" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
    <path d="M25 10 C10 30 -5 45 -5 45 M55 22 C35 48 20 62 20 62 M85 32 C60 62 42 80 42 80 M115 42 C88 75 70 95 70 95 M145 52 C118 88 98 108 98 108 M175 60 C148 95 128 116 128 116" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Main Palm Stem 2 */}
    <path d="M-10 -20 Q120 20 280 30" stroke="#1B5E20" strokeWidth="3.5" strokeLinecap="round" />
    {/* Leaves along Stem 2 */}
    <path d="M30 -5 C50 25 35 40 35 40 M70 4 C95 38 80 54 80 54 M110 10 C140 48 122 66 122 66 M150 16 C182 56 162 76 162 76 M190 20 C222 62 202 82 202 82 M230 24 C260 64 242 82 242 82 M260 28 C285 60 270 78 270 78" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 0 C25 22 10 35 10 35 M80 8 C60 32 45 48 45 48 M120 14 C95 42 78 60 78 60 M160 18 C132 48 115 68 115 68 M200 22 C172 52 155 72 155 72" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" />

    {/* Main Palm Stem 3 */}
    <path d="M-30 30 Q60 90 170 160" stroke="#1B5E20" strokeWidth="3" strokeLinecap="round" />
    <path d="M10 50 C40 80 25 100 25 100 M40 68 C75 102 58 125 58 125 M75 88 C112 125 95 148 95 148 M110 110 C145 148 130 170 130 170" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Top Right Hanging Coconut Palm Fronds SVG
const CoconutPalmTopRight = () => (
  <div className="scale-x-[-1]">
    <CoconutPalmTopLeft />
  </div>
);

// Floating Vector Soft Clouds
const VectorClouds = () => (
  <svg className="w-full h-32 absolute top-4 left-0 pointer-events-none opacity-80" viewBox="0 0 1000 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 70 C50 50 70 35 95 40 C110 25 140 25 155 40 C175 35 195 50 195 70 C205 70 215 80 215 90 C215 100 205 110 195 110 L50 110 C35 110 25 100 25 90 C25 80 35 70 50 70 Z" fill="#FFFFFF" fillOpacity="0.85" />
    <path d="M780 50 C780 35 795 22 815 26 C827 14 850 14 862 26 C878 22 894 34 894 50 C902 50 910 58 910 66 C910 74 902 82 894 82 L780 82 C768 82 760 74 760 66 C760 58 768 50 780 50 Z" fill="#FFFFFF" fillOpacity="0.75" />
    <path d="M420 35 C420 22 432 12 448 15 C458 5 478 5 488 15 C500 12 514 22 514 35 C520 35 526 41 526 48 C526 55 520 60 514 60 L420 60 C410 60 404 55 404 48 C404 41 410 35 420 35 Z" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

// Lush Banana Plant Vector
const BananaTreeSide = ({ side = "left" }: { side?: "left" | "right" }) => (
  <svg className={`w-32 h-56 sm:w-48 sm:h-80 md:w-56 md:h-96 ${side === "right" ? "scale-x-[-1]" : ""}`} viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Trunk */}
    <path d="M40 340 Q55 240 70 180 Q80 140 90 100" stroke="#4D7C28" strokeWidth="14" strokeLinecap="round" />
    <path d="M40 340 Q55 240 70 180 Q80 140 90 100" stroke="#385E1A" strokeWidth="6" strokeLinecap="round" />

    {/* Broad Leaf 1 - Up Right */}
    <path d="M85 130 C120 80 180 60 200 70 C185 110 135 150 85 145 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="2" />
    <path d="M85 130 Q145 95 195 72" stroke="#A5D6A7" strokeWidth="2.5" />
    
    {/* Broad Leaf 2 - Top Center */}
    <path d="M80 120 C90 40 130 10 150 15 C145 60 115 110 75 125 Z" fill="#388E3C" stroke="#1B5E20" strokeWidth="2" />
    <path d="M80 120 Q115 60 148 18" stroke="#C8E6C9" strokeWidth="2.5" />

    {/* Broad Leaf 3 - Left Drooping */}
    <path d="M75 140 C30 110 -10 130 -20 150 C10 180 50 180 75 155 Z" fill="#43A047" stroke="#1B5E20" strokeWidth="2" />
    <path d="M75 140 Q25 135 -18 152" stroke="#C8E6C9" strokeWidth="2" />

    {/* Broad Leaf 4 - Mid Right */}
    <path d="M70 170 C120 140 185 155 195 180 C165 210 110 205 68 182 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="2" />
    <path d="M70 170 Q135 165 192 182" stroke="#A5D6A7" strokeWidth="2.5" />

    {/* Broad Leaf 5 - Lower Left */}
    <path d="M60 210 C15 180 -25 210 -30 230 C5 255 45 245 60 220 Z" fill="#388E3C" stroke="#1B5E20" strokeWidth="2" />
    <path d="M60 210 Q10 205 -28 232" stroke="#C8E6C9" strokeWidth="2" />
  </svg>
);

// Kerala Vallam Wooden Snake Boat with Traditional Bride & Groom Illustration SVG
const KeralaBoatWithCoupleSVG = () => (
  <div className="relative w-full max-w-[340px] sm:max-w-[460px] md:max-w-[540px] mx-auto flex flex-col items-center">
    <svg className="w-full h-auto drop-shadow-md" viewBox="0 0 520 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      
      {/* Background Serene Hills */}
      <path d="M0 160 Q80 120 180 145 T360 130 T520 150 L520 220 L0 220 Z" fill="#58B387" fillOpacity="0.5" />
      <path d="M0 175 Q120 140 240 165 T480 155 L520 170 L520 220 L0 220 Z" fill="#3AA373" fillOpacity="0.7" />

      {/* Backwater Lake Base */}
      <rect x="0" y="190" width="520" height="90" fill="#0290A9" />

      {/* Animated Backwater Wave Ripples */}
      <path d="M10 205 Q60 195 110 205 T210 205 T310 205 T410 205 T510 205" stroke="#E0F7FA" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M30 225 Q90 218 150 225 T270 225 T390 225 T510 225" stroke="#B2EBF2" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M0 245 Q70 238 140 245 T280 245 T420 245 T520 245" stroke="#80DEEA" strokeWidth="2" opacity="0.6" />

      {/* GROOM ILLUSTRATION (Standing Left on Boat) */}
      <g transform="translate(195, 45)">
        {/* Groom Hair */}
        <path d="M22 18 C22 8 36 6 46 12 C54 18 52 28 50 32 C42 26 30 24 22 18 Z" fill="#1A1A1A" />
        {/* Groom Head / Face */}
        <ellipse cx="36" cy="32" rx="14" ry="16" fill="#F3BA8B" />
        {/* Forehead Chandan/Tilak */}
        <path d="M30 24 H42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="24" r="1.5" fill="#D32F2F" />
        {/* Groom Eyes & Smile */}
        <circle cx="31" cy="32" r="1.8" fill="#263238" />
        <circle cx="41" cy="32" r="1.8" fill="#263238" />
        <path d="M32 40 Q36 44 40 40" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
        {/* Groom Torso & Kasavu Shirt */}
        <path d="M18 48 C18 48 36 44 54 48 L58 105 H14 L18 48 Z" fill="#FFFDF5" stroke="#E6C200" strokeWidth="2" />
        <path d="M36 46 V105" stroke="#E6C200" strokeWidth="2" />
        <path d="M18 48 L36 64 L54 48" stroke="#E6C200" strokeWidth="2" fill="none" />
        {/* Groom Kasavu Mundu (Lower Garment) */}
        <path d="M14 105 H58 V140 H14 Z" fill="#FFFDF7" />
        <path d="M14 134 H58" stroke="#E6C200" strokeWidth="4" />
        {/* Groom Flower Garland */}
        <path d="M22 48 Q36 85 50 48" stroke="#D32F2F" strokeWidth="6" strokeLinecap="round" />
        <path d="M22 48 Q36 85 50 48" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="3 3" strokeLinecap="round" />
      </g>

      {/* BRIDE ILLUSTRATION (Standing Right on Boat) */}
      <g transform="translate(265, 52)">
        {/* Bride Hair Bun & Jasmine Flowers */}
        <circle cx="48" cy="28" r="14" fill="#1A1A1A" />
        <path d="M36 18 C38 12 56 12 58 20" stroke="#FFFDF0" strokeWidth="5" strokeDasharray="4 2" />
        {/* Bride Head / Face */}
        <ellipse cx="36" cy="30" rx="13" ry="15" fill="#F5C49B" />
        {/* Bindi & Maang Tikka */}
        <circle cx="36" cy="23" r="2" fill="#D32F2F" />
        <line x1="36" y1="15" x2="36" y2="21" stroke="#FFD700" strokeWidth="1.5" />
        {/* Eyes & Smile */}
        <circle cx="31" cy="30" r="1.8" fill="#263238" />
        <circle cx="41" cy="30" r="1.8" fill="#263238" />
        <path d="M32 38 Q36 42 40 38" stroke="#5D4037" strokeWidth="1.5" fill="none" />
        {/* Gold Earrings */}
        <circle cx="21" cy="32" r="3" fill="#FFD700" />
        <circle cx="51" cy="32" r="3" fill="#FFD700" />
        {/* Kerala Kasavu Saree Body */}
        <path d="M20 45 Q36 42 52 45 L58 135 H14 L20 45 Z" fill="#FFFDF0" />
        {/* Saree Golden Border Pallu */}
        <path d="M22 45 Q38 80 54 135" stroke="#FFD700" strokeWidth="4" fill="none" />
        <path d="M14 128 H58" stroke="#FFD700" strokeWidth="5" />
        <path d="M14 120 H58" stroke="#D32F2F" strokeWidth="2" />
        {/* Gold Necklace */}
        <path d="M26 45 Q36 55 46 45" stroke="#FFD700" strokeWidth="3" fill="none" />
        {/* Bride Flower Garland */}
        <path d="M22 45 Q36 82 50 45" stroke="#D32F2F" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M22 45 Q36 82 50 45" stroke="#FFFFFF" strokeWidth="3.5" strokeDasharray="3 3" strokeLinecap="round" />
      </g>

      {/* KERALA VALLAM (WOODEN SNAKE BOAT) */}
      {/* Curved Stern Tail (Left) */}
      <path d="M30 155 Q50 110 35 75 Q40 65 50 75 Q60 110 90 175 Z" fill="#6A3811" stroke="#422005" strokeWidth="2" />
      <path d="M42 80 Q52 115 78 170" stroke="#FFD700" strokeWidth="2.5" />

      {/* Main Hull Body */}
      <path d="M60 175 Q260 215 470 170 C485 165 500 175 490 190 Q260 240 50 190 C40 185 45 175 60 175 Z" fill="#8B4513" stroke="#4A2306" strokeWidth="3" />
      
      {/* Decorative Gold Trim along Boat Side */}
      <path d="M65 182 Q260 220 475 178" stroke="#FFD700" strokeWidth="3.5" fill="none" />
      <path d="M75 190 Q260 226 465 186" stroke="#D32F2F" strokeWidth="2" fill="none" />

      {/* Front Bow Point (Right) */}
      <path d="M470 170 Q495 155 510 160 C500 175 480 185 470 170 Z" fill="#6A3811" stroke="#422005" strokeWidth="1.5" />
      <circle cx="495" cy="164" r="3" fill="#FFD700" />

      {/* Water Splash / Bow Waves */}
      <path d="M40 195 Q20 200 40 208" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M470 185 Q495 190 515 198" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

// Golden Ganesha Line Icon SVG
const GaneshaIcon = () => (
  <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 C35 10 25 22 25 35 C25 50 38 58 45 68 C48 72 45 80 38 80 C32 80 30 74 34 70" stroke="#C59B27" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 10 C65 10 75 22 75 35 C75 48 65 55 58 60" stroke="#C59B27" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="50" cy="22" r="3" fill="#D32F2F" />
    <path d="M35 28 Q50 34 65 28" stroke="#C59B27" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 65 C52 70 54 78 50 84 C46 90 38 90 34 84" stroke="#C59B27" strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="35" x2="12" y2="38" stroke="#C59B27" strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="35" x2="88" y2="38" stroke="#C59B27" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Date Double Line Flourish SVG
const DateFlourishLine = () => (
  <div className="flex items-center justify-center gap-2 my-2 opacity-90">
    <div className="w-12 sm:w-20 h-[1.5px] bg-[#1F4E5B]"></div>
    <div className="w-2 h-2 rounded-full bg-[#C59B27]"></div>
    <div className="w-12 sm:w-20 h-[1.5px] bg-[#1F4E5B]"></div>
  </div>
);

export default function SilkTraditionalLayout({ content, website }: WeddingLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const coupleNamesStr = content?.hero_title || 'Chiranjeev & Aarohi';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Chiranjeev';
  const brideName = nameParts[1]?.trim() || 'Aarohi';

  const date = content?.settings_json?.wedding?.date || content?.date || 'July 13, 2026 AT 1:30 PM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, Kerala";

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "9:00 AM Onwards", event: "Muhurtham", date: date, venue: location },
      { time: "7:00 PM Onwards", event: "Grand Reception", date: date, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "We met along the serene backwaters of Kerala and found a timeless love. We joyfully invite you to celebrate our new beginning.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Love Story";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-07-13T13:30";
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
      <section key="hero" className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#87D7F7] via-[#B6ECFF] to-[#0290A9] text-center pt-8 pb-4 px-4">
        
        {/* Vector Clouds */}
        <VectorClouds />

        {/* Hanging Coconut Palms - Top Corners */}
        <div className="absolute top-0 left-0 pointer-events-none z-20">
          <CoconutPalmTopLeft />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none z-20">
          <CoconutPalmTopRight />
        </div>

        {/* Top Header Card Info */}
        <div className="relative z-30 w-full max-w-lg mt-6 sm:mt-10 px-4">
          <div className="mb-2">
            <GaneshaIcon />
          </div>

          <p className="text-[#1D3B47] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-2 leading-relaxed font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU<br />TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#132B36] my-2 font-script drop-shadow-sm px-2" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
            {coupleNamesStr}
          </h1>

          <DateFlourishLine />

          <p className="text-[#1F4E5B] text-base sm:text-xl font-bold tracking-wider my-2 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          <DateFlourishLine />
        </div>

        {/* Center & Bottom Scenic Kerala Boat & Banana Trees Illustration */}
        <div className="relative z-20 w-full mt-auto pt-4 flex items-end justify-center overflow-hidden">
          {/* Side Banana Trees */}
          <div className="absolute bottom-0 -left-6 sm:left-4 z-10 pointer-events-none">
            <BananaTreeSide side="left" />
          </div>
          <div className="absolute bottom-0 -right-6 sm:right-4 z-10 pointer-events-none">
            <BananaTreeSide side="right" />
          </div>

          {/* Kerala Snake Boat with Bride & Groom */}
          <div className="relative z-20 w-full">
            <KeralaBoatWithCoupleSVG />
          </div>
        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#EBF9FD] text-[#132B36]">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-10 font-script text-[#132B36]" style={{ fontFamily: "'Great Vibes', cursive" }}>Family Details</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Groom Card */}
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-2 border-amber-300/70 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400"></div>
              {groomPhoto ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 mb-4 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mb-4 text-amber-700">
                  <Heart className="w-8 h-8 fill-amber-300" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#132B36] mb-1 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{groomName}</h3>
              <p className="text-xs text-emerald-800 uppercase tracking-widest mb-2 font-bold font-serif">Groom</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Son of</p>
              <p className="text-md font-semibold text-slate-800 font-serif">{groomParents}</p>
            </div>

            {/* Bride Card */}
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-2 border-amber-300/70 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400"></div>
              {bridePhoto ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 mb-4 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mb-4 text-amber-700">
                  <Heart className="w-8 h-8 fill-amber-300" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#132B36] mb-1 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{brideName}</h3>
              <p className="text-xs text-emerald-800 uppercase tracking-widest mb-2 font-bold font-serif">Bride</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Daughter of</p>
              <p className="text-md font-semibold text-slate-800 font-serif">{brideParents}</p>
            </div>

          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#D6F2FB]">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-200">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-6 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {storyTitle}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed font-serif">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#EBF9FD]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Schedule & Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-amber-500 text-center hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-[#132B36] mb-3 font-serif">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-teal-900">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span className="font-semibold">{item.date || date}</span>
              </div>
              <p className="text-amber-700 font-bold text-lg mb-2">{item.time}</p>
              <p className="text-slate-600 text-sm">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#D6F2FB]">
        <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border border-amber-200 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-teal-800">
              <MapPin className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-3xl font-bold text-[#132B36] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & Map</h3>
            <p className="text-xl font-semibold text-slate-800 mb-2 font-serif">{location}</p>
            <p className="text-md text-slate-500 max-w-md mx-auto mb-6 font-sans">We look forward to welcoming you to our joyous celebration.</p>

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
                className="inline-flex items-center gap-2 bg-[#132B36] hover:bg-[#0C1D25] text-amber-300 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-1">RSVP / Contact Numbers</p>
                <p className="text-base sm:text-lg font-bold text-slate-800 font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#EBF9FD]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-6 relative z-10 bg-[#132B36] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-8 text-center border-2 border-amber-400/40">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-amber-300 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Counting Down To</h2>
          <p className="text-base sm:text-lg italic mb-8 text-teal-200 font-serif">Our Wedding Day</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20">
                  <span className="text-xl sm:text-3xl font-bold text-amber-300 font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-teal-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-6 relative z-10 max-w-2xl mx-auto bg-[#D6F2FB]">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Will You Join Us?</h2>
          <p className="text-teal-900 mb-8 tracking-widest uppercase text-xs font-semibold">Please let us know if you can attend</p>

          <div className="bg-white/95 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border border-amber-200 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Name</label>
                  <input type="text" className="w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-4 py-3 outline-none focus:border-[#132B36] transition-all font-serif" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Message / Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-4 py-3 outline-none focus:border-[#132B36] transition-all font-serif resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-cyan-200 hover:border-[#132B36] bg-cyan-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#132B36]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-cyan-200 hover:border-[#132B36] bg-cyan-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#132B36]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#132B36] hover:bg-[#0C1D25] text-amber-300 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
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
    <div className={`min-h-screen bg-[#87D7F7] relative font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#132B36] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Overlay Envelope */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-gradient-to-b from-[#87D7F7] via-[#B6ECFF] to-[#0290A9] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'} overflow-hidden pt-6 pb-6 px-4`}>

        {/* Vector Clouds */}
        <VectorClouds />

        {/* Hanging Coconut Palms - Top Corners */}
        <div className="absolute top-0 left-0 pointer-events-none z-20">
          <CoconutPalmTopLeft />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none z-20">
          <CoconutPalmTopRight />
        </div>

        {/* Top Header Information */}
        <div className="relative z-30 w-full max-w-lg mt-6 sm:mt-10 text-center px-4">
          <div className="mb-2">
            <GaneshaIcon />
          </div>

          <p className="text-[#1D3B47] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-2 leading-relaxed font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU<br />TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#132B36] my-2 font-script drop-shadow-sm px-2" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
            {coupleNamesStr}
          </h1>

          <DateFlourishLine />

          <p className="text-[#1F4E5B] text-base sm:text-xl font-bold tracking-wider my-2 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          <DateFlourishLine />
        </div>

        {/* Center & Bottom Scenic Boat Illustration & OPEN INVITATION BUTTON */}
        <div className="relative z-30 w-full flex flex-col items-center justify-end overflow-hidden mt-auto">
          {/* Side Banana Trees */}
          <div className="absolute bottom-0 -left-6 sm:left-4 z-10 pointer-events-none">
            <BananaTreeSide side="left" />
          </div>
          <div className="absolute bottom-0 -right-6 sm:right-4 z-10 pointer-events-none">
            <BananaTreeSide side="right" />
          </div>

          {/* Kerala Snake Boat with Couple SVG */}
          <div className="relative z-20 w-full">
            <KeralaBoatWithCoupleSVG />
          </div>

          {/* OPEN INVITATION BUTTON */}
          <div className="relative z-40 my-4 sm:my-6">
            <button
              onClick={() => {
                setIsOpened(true);
                if (audioRef.current && musicUrl) {
                  audioRef.current.play().catch(console.error);
                }
              }}
              className="group relative overflow-hidden bg-[#132B36] hover:bg-[#0C1D25] text-amber-300 font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3.5 md:px-12 md:py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-amber-300/60 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2 font-serif">
                Open Invitation
              </span>
              <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#0C1D25] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-amber-400/30">
        <h2 className="text-3xl font-script mb-2 text-amber-300" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleNamesStr}</h2>
        <p className="text-teal-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
