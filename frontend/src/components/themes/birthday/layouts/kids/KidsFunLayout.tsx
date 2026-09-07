import React, { useState, useEffect, useRef } from 'react';
import { Gift, MapPin, Clock, Music, Volume2, VolumeX, PartyPopper, Sparkles, Star, Camera, CalendarHeart, Smile, Send } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function KidsFunLayout({ content, website, colors }: BirthdayLayoutProps) {
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

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Maya";
  const age = content?.settings_json?.birthday?.age || "6";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "Alex & Jamie";

  const story = content?.about_text || `It's time for some serious fun! Our favorite troublemaker is turning ${age} and we're throwing the most awesome party ever. Get ready to dance, play, and eat WAY too much cake!`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "PARTY TIME!";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Oct');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Crazy Bounce House";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Arrive & Go Crazy", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "Sugar Rush (Cake!)", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "More Bouncing", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1530103862676-de3c9da59c6b?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "Get ready to PARTY!";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#1E0B36] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Quicksand:wght@600;700&display=swap');
          .font-fun-title { font-family: 'Lilita One', cursive; letter-spacing: 1px; }
          .font-fun-body { font-family: 'Quicksand', sans-serif; }
          
          .blob-shape-1 { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          .blob-shape-2 { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delay { animation: float 7s ease-in-out infinite 2s; }
          
          .grid-pattern {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          }
        `}</style>

        <div className="absolute inset-0 grid-pattern pointer-events-none"></div>

        {/* Fun floating abstract shapes */}
        <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-[#FF007F] blob-shape-1 animate-float opacity-80 blur-[2px]"></div>
        <div className="absolute top-[60%] right-[10%] w-48 h-48 bg-[#00F0FF] blob-shape-2 animate-float-delay opacity-80 blur-[2px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-24 h-24 bg-[#FFEA00] rounded-full animate-float opacity-90 blur-[1px]"></div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <div className="bg-[#FFEA00] text-[#1E0B36] font-fun-body font-bold uppercase tracking-widest text-sm px-6 py-2 rounded-full transform -rotate-3 mb-10 shadow-[4px_4px_0_#FF007F]">
            {quoteText}
          </div>

          <div className="relative w-full max-w-[80vw] mx-auto flex justify-center items-center mb-6">
            <h1 className="text-7xl sm:text-9xl font-fun-title text-white uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
              <span className="text-[#00F0FF] block transform -rotate-6 hover:rotate-2 transition-transform duration-300">
                {name}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 mb-16 transform rotate-2">
            <h2 className="text-3xl sm:text-5xl font-fun-title text-[#39FF14] uppercase drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
              Turns {age}!
            </h2>
          </div>

          <div className="bg-[#FF007F] text-white p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 shadow-[8px_8px_0_#1E0B36,8px_8px_0_4px_#00F0FF] transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center">
              <span className="text-[#FFEA00] font-fun-title text-5xl mb-1">{dayNum}</span>
              <span className="text-white font-fun-body font-bold uppercase text-sm tracking-wider">{monthStr} {yearStr}</span>
            </div>
            <div className="hidden sm:block w-1.5 h-16 bg-[#1E0B36] rounded-full"></div>
            <div className="flex flex-col items-center">
              <Clock className="text-[#39FF14] mb-1" size={28} strokeWidth={3} />
              <span className="text-white font-fun-body font-bold uppercase text-sm tracking-wider">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 sm:px-12 relative z-10 bg-[#FFEA00]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1E0B36 2px, transparent 2px)', backgroundSize: '30px 30px', opacity: 0.1 }}></div>
        <div className="max-w-2xl mx-auto text-center relative z-10 bg-white p-8 rounded-[3rem] shadow-[10px_10px_0_#00F0FF] transform -rotate-1 border-4 border-[#1E0B36]">
          <span className="text-sm font-fun-body font-bold text-[#FF007F] uppercase tracking-widest block mb-2">Brought to you by</span>
          <span className="text-4xl font-fun-title text-[#1E0B36] uppercase">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-[#00F0FF] overflow-hidden">
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #1E0B36 1px, transparent 1px), linear-gradient(to bottom, #1E0B36 1px, transparent 1px)' }}></div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-sm mx-auto relative group">
            <div className="absolute inset-0 bg-[#FF007F] rounded-[3rem] transform rotate-6 group-hover:rotate-12 transition-transform duration-300 shadow-[10px_10px_0_#1E0B36]"></div>
            <div className="relative aspect-square bg-white p-3 rounded-[3rem] border-4 border-[#1E0B36] shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-[2rem]" alt="Birthday Star" />
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-[#39FF14] w-24 h-24 rounded-full flex items-center justify-center border-4 border-[#1E0B36] shadow-[6px_6px_0_#1E0B36] animate-spin" style={{ animationDuration: '10s' }}>
              <Star className="text-[#1E0B36] fill-[#1E0B36]" size={40} />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl sm:text-7xl font-fun-title text-[#1E0B36] mb-8 uppercase drop-shadow-[4px_4px_0_#FFEA00]">{storyTitle}</h2>
            <div className="bg-[#1E0B36] p-8 rounded-[2rem] relative">
              <p className="text-xl text-white font-fun-body font-bold leading-relaxed relative z-10">
                {story}
              </p>
              <div className="absolute -top-4 -left-4 bg-[#FF007F] w-12 h-12 rounded-full border-4 border-[#1E0B36] flex items-center justify-center transform -rotate-12">
                <Smile className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FF007F]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="text-5xl sm:text-7xl font-fun-title text-white uppercase drop-shadow-[4px_4px_0_#1E0B36] transform -rotate-2">The Master Plan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {schedule.map((item: any, idx: number) => {
              const bgColors = ['bg-[#FFEA00]', 'bg-[#00F0FF]', 'bg-[#39FF14]'];
              const textColors = ['text-[#1E0B36]', 'text-[#1E0B36]', 'text-[#1E0B36]'];
              const rotate = idx % 2 === 0 ? 'rotate-2' : '-rotate-2';
              
              return (
              <div key={idx} className={`${bgColors[idx % 3]} p-8 rounded-[2.5rem] border-4 border-[#1E0B36] shadow-[8px_8px_0_#1E0B36] transform hover:scale-105 ${rotate} transition-transform flex flex-col items-center text-center relative`}>
                <div className="bg-[#1E0B36] text-white font-fun-title text-2xl px-6 py-2 rounded-full mb-6 absolute -top-6 border-4 border-transparent">
                  {item.time}
                </div>
                <h3 className={`text-3xl font-fun-title ${textColors[idx % 3]} uppercase mt-4 mb-4 leading-tight`}>{item.event}</h3>
                <PartyPopper className={`${textColors[idx % 3]} opacity-60 mt-auto`} size={48} />
              </div>
            )})}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-[#1E0B36]">
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-[#39FF14] p-10 sm:p-16 rounded-[4rem] shadow-[15px_15px_0_#FF007F] border-4 border-[#1E0B36] overflow-hidden">
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>

           <MapPin className="text-[#1E0B36] mx-auto mb-6 fill-white" size={72} strokeWidth={2} />
           <h2 className="text-5xl sm:text-7xl font-fun-title text-[#1E0B36] mb-8 uppercase drop-shadow-[3px_3px_0_#fff]">Party HQ</h2>
           
           <p className="text-2xl sm:text-4xl font-fun-title text-white bg-[#1E0B36] px-8 py-4 rounded-2xl mb-12 inline-block transform rotate-1 border-4 border-[#1E0B36] shadow-[6px_6px_0_#00F0FF]">
             {location}
           </p>

          {mapUrl && (
            <div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFEA00] text-[#1E0B36] font-fun-title text-2xl uppercase tracking-wider px-12 py-5 rounded-full border-4 border-[#1E0B36] shadow-[8px_8px_0_#1E0B36] hover:translate-y-1 hover:shadow-[4px_4px_0_#1E0B36] active:translate-y-2 active:shadow-none transition-all"
              >
                Let's Go!
              </a>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFEA00]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#FF007F 3px, transparent 3px)', backgroundSize: '40px 40px', opacity: 0.15 }}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl sm:text-8xl font-fun-title text-[#1E0B36] uppercase drop-shadow-[5px_5px_0_#fff] transform rotate-1">Awesome Pics</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => {
              const borderColors = ['border-[#FF007F]', 'border-[#00F0FF]', 'border-[#39FF14]', 'border-[#1E0B36]'];
              const bgColors = ['bg-[#FF007F]', 'bg-[#00F0FF]', 'bg-[#39FF14]', 'bg-[#1E0B36]'];
              const b = borderColors[index % borderColors.length];
              const bg = bgColors[(index+1) % bgColors.length];
              const rot = index % 2 === 0 ? 'rotate-2' : '-rotate-3';
              
              return (
              <div key={index} className={`break-inside-avoid relative rounded-[2rem] overflow-hidden border-8 ${b} shadow-[10px_10px_0_rgba(30,11,54,1)] transform ${rot} hover:scale-105 hover:z-20 transition-all duration-300 bg-white`}>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover" />
                <div className={`absolute bottom-4 right-4 ${bg} w-10 h-10 rounded-full border-4 border-white flex items-center justify-center`}>
                  <Camera size={16} className="text-white" />
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#00F0FF]">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <h2 className="text-5xl sm:text-7xl font-fun-title text-[#1E0B36] uppercase mb-16 drop-shadow-[4px_4px_0_#FF007F] transform -rotate-1">Counting Down!</h2>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0, color: 'text-[#FF007F]', bg: 'bg-[#FFEA00]' },
              { label: 'Hours', value: timeLeft?.h ?? 0, color: 'text-[#39FF14]', bg: 'bg-[#1E0B36]' },
              { label: 'Mins', value: timeLeft?.m ?? 0, color: 'text-[#00F0FF]', bg: 'bg-[#FF007F]' },
              { label: 'Secs', value: timeLeft?.s ?? 0, color: 'text-[#FFEA00]', bg: 'bg-[#39FF14]' }
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-col items-center ${item.bg} p-6 sm:p-8 rounded-[2rem] border-4 border-[#1E0B36] shadow-[8px_8px_0_#1E0B36] w-28 sm:w-40 transform hover:-translate-y-4 transition-transform duration-300`}>
                <span className={`text-5xl sm:text-7xl font-fun-title ${item.color} mb-2 drop-shadow-[2px_2px_0_#1E0B36]`}>
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className={`text-sm sm:text-base font-fun-body font-bold uppercase ${item.bg === 'bg-[#1E0B36]' ? 'text-white' : 'text-[#1E0B36]'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 px-6 sm:px-12 relative z-10 bg-[#1E0B36]">
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          
          <h2 className="text-5xl sm:text-7xl font-fun-title text-[#FFEA00] uppercase mb-12 drop-shadow-[4px_4px_0_#FF007F]">Show Some Love!</h2>
          
          <div className="bg-[#FF007F] p-12 rounded-[3rem] border-4 border-[#39FF14] shadow-[12px_12px_0_#39FF14] relative transform rotate-1">
            <div className="absolute -top-10 -right-10 text-[#FFEA00] animate-spin" style={{ animationDuration: '8s' }}>
              <Star size={100} fill="currentColor" strokeWidth={0} />
            </div>
            
            <span className="text-7xl font-fun-title text-white block mb-2 drop-shadow-[3px_3px_0_#1E0B36]">{wishCount}</span>
            <span className="text-[#FFEA00] font-fun-body font-bold uppercase tracking-widest text-lg">High-Fives Received</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="mt-10 bg-[#39FF14] hover:bg-[#32e011] text-[#1E0B36] px-12 py-5 rounded-full font-fun-title text-3xl uppercase border-4 border-[#1E0B36] shadow-[8px_8px_0_#1E0B36] active:translate-y-2 active:shadow-none transition-all w-full sm:w-auto"
            >
              SEND A HIGH-FIVE!
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 px-6 sm:px-12 relative z-10 bg-[#39FF14]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl sm:text-8xl font-fun-title text-[#1E0B36] mb-4 uppercase drop-shadow-[4px_4px_0_#fff]">You In?</h2>
            <p className="text-[#1E0B36] font-fun-body font-bold text-2xl">Don't miss the best party of the year!</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-[3rem] border-4 border-[#1E0B36] shadow-[15px_15px_0_#1E0B36] transform -rotate-1">
            <form className="space-y-8 font-fun-body font-bold" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xl text-[#FF007F] mb-2 uppercase">Who's Coming?</label>
                <input type="text" className="w-full bg-[#f4f4f4] border-4 border-[#1E0B36] rounded-2xl px-6 py-4 outline-none focus:bg-[#FFEA00] transition-colors text-[#1E0B36] text-xl" placeholder="Enter your name" />
              </div>

              <div>
                <label className="block text-xl text-[#00F0FF] mb-2 uppercase">Special Requests / Notes?</label>
                <textarea rows={3} className="w-full bg-[#f4f4f4] border-4 border-[#1E0B36] rounded-2xl px-6 py-4 outline-none focus:bg-[#FFEA00] transition-colors text-[#1E0B36] text-xl resize-none" placeholder="Allergies? Favorite song?"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border-4 border-[#1E0B36] rounded-2xl bg-[#00F0FF] hover:bg-[#00d0e0] transition-colors flex-1 shadow-[6px_6px_0_#1E0B36] active:translate-y-1 active:shadow-[2px_2px_0_#1E0B36]">
                    <input type="radio" name="attending" className="w-6 h-6 accent-[#FF007F]" />
                    <span className="text-[#1E0B36] text-2xl font-fun-title uppercase">HECK YES!</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border-4 border-[#1E0B36] rounded-2xl bg-[#ff99cc] hover:bg-[#ff80bf] transition-colors flex-1 shadow-[6px_6px_0_#1E0B36] active:translate-y-1 active:shadow-[2px_2px_0_#1E0B36]">
                    <input type="radio" name="attending" className="w-6 h-6 accent-[#1E0B36]" />
                    <span className="text-[#1E0B36] text-2xl font-fun-title uppercase">SADLY NO</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-[#FF007F] hover:bg-[#e00070] text-white font-fun-title text-4xl uppercase tracking-wider py-6 rounded-full border-4 border-[#1E0B36] shadow-[8px_8px_0_#1E0B36] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4">
                  <Send size={32} /> SUBMIT RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#1E0B36] relative text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Fun Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-16 h-16 bg-[#00F0FF] border-4 border-[#1E0B36] rounded-full flex items-center justify-center text-[#1E0B36] hover:scale-110 hover:rotate-12 transition-transform shadow-[6px_6px_0_#FF007F]"
        >
          {isMuted ? <VolumeX size={32} strokeWidth={3} /> : <Volume2 size={32} strokeWidth={3} />}
        </button>
      )}

      {/* Chaotic Fun Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[600ms] ease-in-out bg-[#FFEA00] ${isOpened ? 'opacity-0 pointer-events-none scale-[2] blur-xl' : 'opacity-100 scale-100'} cursor-pointer selection:bg-transparent`}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#FF007F 6px, transparent 6px)', backgroundSize: '60px 60px', opacity: 0.3 }}></div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-500 ${isOpening ? 'scale-0 opacity-0 rotate-[720deg]' : 'scale-100 opacity-100'}`}>
           
           <div className="relative">
             <div className="absolute -inset-8 bg-[#39FF14] rounded-full blur-xl opacity-60 animate-pulse"></div>
             <div className="bg-[#1E0B36] p-12 sm:p-16 rounded-[4rem] border-8 border-[#00F0FF] shadow-[20px_20px_0_#FF007F] flex flex-col items-center max-w-[90vw] relative z-10 transform -rotate-3 hover:rotate-0 transition-transform">
               
               <div className="absolute -top-12 -right-6 text-[#FFEA00] animate-bounce">
                 <Sparkles size={80} fill="currentColor" />
               </div>
               
               <h1 className="text-6xl sm:text-8xl font-fun-title text-white text-center mb-6 uppercase tracking-wider drop-shadow-[4px_4px_0_#FF007F]">
                 {name}'s<br/>
                 <span className="text-[#39FF14]">Party!</span>
               </h1>
               
               <div className="bg-[#FFEA00] text-[#1E0B36] font-fun-title text-3xl uppercase px-10 py-4 rounded-full border-4 border-[#1E0B36] shadow-[6px_6px_0_#1E0B36] animate-pulse">
                 TAP TO START
               </div>
             </div>
           </div>
           
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-[#1E0B36] text-[#FF007F] w-full border-t-8 border-[#39FF14]">
        <span className="text-xl font-fun-title uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">Made with ❤️ for {name}</span>
      </footer>

    </div>
  );
}
