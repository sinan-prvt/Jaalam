import React, { useState, useEffect, useRef } from 'react';
import { Gift, Calendar, MapPin, Clock, Zap, Star, Shield, Music, Volume2, VolumeX, Flame } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function KidsSuperheroLayout({ content, website, colors }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 12;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    triggerConfettiPopper();
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1200);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Hero";
  const age = content?.settings_json?.birthday?.age || "5";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Team";

  const story = content?.about_text || `Calling all superheroes! Our brave hero is turning ${age}. Join forces with us for an epic day of fun, games, and saving the world (after cake)!`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "SUPER MISSION!";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Oct');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Secret Headquarters";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Assemble & Games", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "Power-up Cake Time", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Superhero Training", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "BOOM! KAPOW! PARTY!";

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
    { id: 'story', label: 'Details', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Location', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  const sections = content?.settings_json?.birthday?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#0d1b2a] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@700&display=swap');
          .font-bangers { font-family: 'Bangers', cursive; letter-spacing: 2px; }
          .font-comic { font-family: 'Comic Neue', cursive; font-weight: 700; }
          .halftone-bg {
            background: radial-gradient(circle, #ff0000 2px, transparent 2.5px);
            background-size: 15px 15px;
            background-color: #0d1b2a;
            opacity: 0.15;
          }
          .comic-border {
            border: 4px solid #000;
            box-shadow: 6px 6px 0px #000;
          }
          .speech-bubble {
            position: relative;
            background: #fff;
            border-radius: 50%;
            border: 4px solid #000;
          }
          .speech-bubble::before {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 20%;
            border-width: 20px 20px 0 0;
            border-style: solid;
            border-color: #000 transparent transparent transparent;
          }
          .speech-bubble::after {
            content: '';
            position: absolute;
            bottom: -14px;
            left: 21%;
            border-width: 16px 16px 0 0;
            border-style: solid;
            border-color: #fff transparent transparent transparent;
          }
          .action-lines {
            background: repeating-conic-gradient(from 0deg, #ffcc00 0deg 15deg, #ff9900 15deg 30deg);
          }
        `}</style>

        <div className="absolute inset-0 halftone-bg pointer-events-none"></div>

        <div className="absolute inset-0 action-lines opacity-30 animate-spin" style={{ animationDuration: '60s' }}></div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
          
          <div className="relative mb-8 transform hover:scale-110 transition-transform duration-300">
            <div className="absolute -inset-4 bg-yellow-400 rotate-45 comic-border"></div>
            <div className="absolute -inset-4 bg-red-600 -rotate-12 comic-border"></div>
            <div className="relative w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center comic-border z-10 text-white font-bangers text-7xl shadow-inner">
               {age}
            </div>
          </div>

          <div className="speech-bubble px-6 py-3 mb-8 transform -rotate-2">
            <span className="text-xl font-bangers text-red-600 uppercase tracking-widest">
              {quoteText}
            </span>
          </div>

          <div className="relative">
             <h1 className="text-7xl sm:text-9xl font-bangers text-yellow-400 drop-shadow-[4px_4px_0_#000] sm:drop-shadow-[6px_6px_0_#000] uppercase mb-2 transform -skew-y-3">
               {name}
             </h1>
             <div className="absolute -inset-2 border-4 border-black rounded-lg transform skew-x-12 opacity-0 -z-10"></div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bangers text-white drop-shadow-[3px_3px_0_#000] uppercase mb-12 transform skew-y-2">
            Is turning {age}!
          </h2>

          <div className="bg-white p-6 comic-border flex flex-col sm:flex-row gap-6 items-center transform rotate-1">
            <div className="flex flex-col items-center">
              <span className="text-red-600 font-bangers text-4xl">{dayNum}</span>
              <span className="text-black font-comic uppercase text-sm">{monthStr} {yearStr}</span>
            </div>
            <div className="hidden sm:block w-1 h-12 bg-black"></div>
            <div className="flex flex-col items-center">
              <Zap className="text-yellow-400 mb-1 fill-yellow-400" size={24} strokeWidth={2} />
              <span className="text-black font-comic uppercase text-sm">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-16 px-6 sm:px-12 relative z-10 bg-yellow-400 border-t-8 border-b-8 border-black">
        <div className="absolute inset-0 halftone-bg opacity-10"></div>
        <div className="max-w-2xl mx-auto text-center bg-white rounded-lg p-8 comic-border relative z-10 transform -rotate-1">
          <span className="text-sm font-comic text-gray-500 uppercase tracking-widest block mb-2">Sidekicks & Hosts</span>
          <span className="text-4xl font-bangers text-blue-600 tracking-wider">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-blue-600 overflow-hidden border-b-8 border-black">
        
        {/* Comic Action Shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-red-600 rotate-45 comic-border"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-yellow-400 comic-border"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-yellow-400 comic-border transform rotate-6 translate-x-4 translate-y-4"></div>
            <div className="relative aspect-[4/5] bg-white comic-border overflow-hidden p-2">
              <img src={mainPhoto} className="w-full h-full object-cover border-2 border-black" alt="Birthday Hero" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-red-600 text-white font-bangers text-3xl px-6 py-2 comic-border transform -rotate-12">
              BAM!
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl sm:text-6xl font-bangers text-yellow-400 drop-shadow-[3px_3px_0_#000] mb-8 transform -skew-y-2">{storyTitle}</h2>
            <div className="text-xl text-black font-comic leading-relaxed bg-white p-8 comic-border relative">
              <Shield className="absolute -top-6 -left-6 text-red-600 fill-red-600 bg-white rounded-full border-4 border-black p-2" size={48} />
              {story}
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-red-600 border-b-8 border-black">
        <div className="absolute inset-0 halftone-bg opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="text-5xl sm:text-7xl font-bangers text-white drop-shadow-[4px_4px_0_#000] uppercase tracking-widest transform skew-y-1">Mission Log</h2>
          </div>

          <div className="space-y-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-6 comic-border flex flex-col sm:flex-row items-center gap-6 transform hover:scale-[1.02] transition-transform shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] relative">
                {/* Connecting Line for desktop */}
                {idx !== schedule.length - 1 && (
                   <div className="hidden sm:block absolute left-[5rem] top-full h-8 w-2 bg-black z-0"></div>
                )}
                
                <div className="bg-yellow-400 text-black font-bangers text-3xl px-6 py-3 comic-border whitespace-nowrap transform -rotate-2">
                  {item.time}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bangers text-blue-700 tracking-wider mb-1">{item.event}</h3>
                </div>
                {idx % 2 === 0 ? <Zap className="text-red-600 fill-red-600 hidden sm:block" size={40} /> : <Star className="text-blue-600 fill-blue-600 hidden sm:block" size={40} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-yellow-400 border-b-8 border-black">
        <div className="max-w-4xl mx-auto text-center bg-white p-8 sm:p-16 comic-border shadow-[12px_12px_0_rgba(0,0,0,1)] relative overflow-hidden transform -rotate-1">
           
           <div className="absolute -top-12 -right-12 text-blue-100 opacity-50">
             <MapPin size={200} />
           </div>

           <MapPin className="text-red-600 mx-auto mb-6 relative z-10 fill-white border-black" size={56} strokeWidth={2} />
           <h2 className="text-4xl sm:text-6xl font-bangers text-black mb-4 relative z-10 tracking-wide uppercase">HQ Location</h2>
           
           <p className="text-2xl sm:text-3xl font-comic font-bold text-blue-700 mb-10 px-4 relative z-10">
             {location}
           </p>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block relative z-10 bg-red-600 hover:bg-red-500 text-white font-bangers tracking-widest text-2xl px-12 py-4 comic-border transform hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-[0_0px_0_#000] transition-all"
            >
              LAUNCH MAP
            </a>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-blue-600 border-b-8 border-black">
        <div className="absolute inset-0 halftone-bg opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-7xl font-bangers text-white drop-shadow-[4px_4px_0_#000] uppercase tracking-wider transform -skew-y-1">Hero Action Shots!</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {validGallery.map((url: string, index: number) => {
              // Alternate rotations for comic panel effect
              const rotations = ['rotate-2', '-rotate-2', 'rotate-1', '-rotate-3', 'rotate-3'];
              const rot = rotations[index % rotations.length];
              
              return (
              <div key={index} className={`relative bg-white p-3 comic-border shadow-[8px_8px_0_rgba(0,0,0,1)] transform ${rot} hover:scale-105 hover:z-20 transition-all duration-300`}>
                <div className="overflow-hidden border-2 border-black aspect-square bg-gray-100">
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#0d1b2a] border-b-8 border-black overflow-hidden">
        <div className="absolute inset-0 action-lines opacity-20"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="bg-red-600 px-8 py-3 comic-border mb-16 transform rotate-2">
            <h2 className="text-4xl sm:text-5xl font-bangers text-yellow-400 drop-shadow-[2px_2px_0_#000] uppercase tracking-widest">Time to Launch!</h2>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-4 sm:p-6 comic-border shadow-[6px_6px_0_rgba(255,204,0,1)] w-24 sm:w-32 transform hover:-translate-y-2 transition-transform">
                <span className="text-4xl sm:text-6xl font-bangers text-blue-600 mb-1">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-sm font-comic font-bold uppercase text-black">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 px-6 sm:px-12 relative z-10 bg-yellow-400 border-b-8 border-black">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="relative inline-block mb-8">
            <Flame className="text-red-600 fill-red-600 mx-auto transform scale-150 relative z-10" size={48} />
            <div className="absolute inset-0 bg-white rounded-full blur-xl -z-10"></div>
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bangers text-black uppercase tracking-wider mb-8 drop-shadow-[2px_2px_0_#fff]">Super Power Level</h2>
          
          <div className="bg-white p-12 comic-border shadow-[12px_12px_0_rgba(0,0,0,1)] transform rotate-1">
            <span className="text-7xl font-bangers text-blue-600 block mb-2">{wishCount}</span>
            <span className="text-black font-comic font-bold uppercase tracking-widest text-sm">Energy Boosts Received</span>
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="mt-8 bg-red-600 hover:bg-red-500 text-white px-10 py-4 font-bangers tracking-widest text-2xl uppercase comic-border shadow-[6px_6px_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_rgba(0,0,0,1)] active:translate-y-[6px] transition-all w-full sm:w-auto"
            >
              BOOST POWER!
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 px-6 sm:px-12 relative z-10 bg-blue-600">
        <div className="absolute inset-0 halftone-bg opacity-20"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl sm:text-7xl font-bangers text-yellow-400 drop-shadow-[4px_4px_0_#000] mb-4 uppercase tracking-wider">Are you in?</h2>
            <p className="text-white font-comic text-xl font-bold">Join the squad! Confirm your status below.</p>
          </div>

          <div className="bg-white p-8 sm:p-12 comic-border shadow-[12px_12px_0_rgba(0,0,0,1)] transform -rotate-1">
            <form className="space-y-6 font-comic font-bold" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-lg text-black mb-2 uppercase">Hero Name(s)</label>
                <input type="text" className="w-full bg-gray-50 border-4 border-black px-6 py-4 outline-none focus:bg-yellow-50 focus:ring-0 transition-colors text-black text-lg font-comic shadow-[4px_4px_0_rgba(0,0,0,0.2)]" placeholder="Enter name(s)" />
              </div>

              <div>
                <label className="block text-lg text-black mb-2 uppercase">Secret Messages / Allergies?</label>
                <textarea rows={3} className="w-full bg-gray-50 border-4 border-black px-6 py-4 outline-none focus:bg-yellow-50 transition-colors text-black text-lg font-comic resize-none shadow-[4px_4px_0_rgba(0,0,0,0.2)]" placeholder="Any special notes?"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border-4 border-black bg-yellow-400 hover:bg-yellow-300 transition-colors flex-1 shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0_rgba(0,0,0,1)]">
                    <input type="radio" name="attending" className="w-5 h-5 accent-red-600" />
                    <span className="text-black text-xl font-bangers tracking-wider">YES! I'M READY!</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border-4 border-black bg-gray-200 hover:bg-gray-300 transition-colors flex-1 shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0_rgba(0,0,0,1)]">
                    <input type="radio" name="attending" className="w-5 h-5 accent-red-600" />
                    <span className="text-black text-xl font-bangers tracking-wider">CAN'T MAKE IT</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-red-600 hover:bg-red-500 text-white font-bangers tracking-widest text-3xl py-6 comic-border shadow-[6px_6px_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_rgba(0,0,0,1)] active:translate-y-[6px] transition-all">
                  SEND CONFIRMATION!
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-gray-900 relative text-black flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Floating Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[4px_4px_0_rgba(0,0,0,1)]"
        >
          {isMuted ? <VolumeX size={24} strokeWidth={3} /> : <Volume2 size={24} strokeWidth={3} />}
        </button>
      )}

      {/* Comic Book Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[800ms] ease-in-out bg-red-600 ${isOpened ? 'opacity-0 pointer-events-none scale-150' : 'opacity-100 scale-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
            70% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0); opacity: 1; }
          }
          .comic-bg-stripes {
            background: repeating-linear-gradient(
              45deg,
              #e50000,
              #e50000 20px,
              #ff1a1a 20px,
              #ff1a1a 40px
            );
          }
        `}</style>
        
        <div className="absolute inset-0 comic-bg-stripes pointer-events-none opacity-50"></div>
        <div className="absolute inset-0 halftone-bg pointer-events-none"></div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-[500ms] ${isOpening ? 'scale-150 opacity-0' : 'animate-[popIn_0.5s_ease-out_forwards]'}`}>
           
           <div className="relative">
              {/* Comic Action Burst Background */}
              <div className="absolute -inset-10 bg-yellow-400 comic-border rotate-12 transform scale-110 -z-10"></div>
              <div className="absolute -inset-6 bg-blue-600 comic-border -rotate-6 transform scale-105 -z-10"></div>
              
              <div className="bg-white p-10 comic-border flex flex-col items-center max-w-[90vw] relative z-10">
                <Shield className="text-red-600 fill-yellow-400 mb-6 border-black" size={80} strokeWidth={1.5} />
                <h1 className="text-5xl sm:text-7xl font-bangers text-black text-center mb-2 uppercase tracking-wider drop-shadow-[2px_2px_0_#ffcc00]">
                  {name}'s<br/>Birthday!
                </h1>
                <div className="mt-8 relative animate-pulse">
                  <div className="absolute inset-0 bg-black translate-x-1 translate-y-1"></div>
                  <div className="bg-red-600 text-white font-bangers text-3xl px-8 py-3 uppercase relative border-2 border-black whitespace-nowrap tracking-widest">
                    TAP TO ASSEMBLE!
                  </div>
                </div>
              </div>
           </div>
           
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-gray-900 text-gray-500 w-full border-t-4 border-black">
        <span className="text-sm font-comic font-bold uppercase tracking-widest">Powered up with ❤️ for {name}</span>
      </footer>

    </div>
  );
}
