import React, { useState, useEffect, useRef } from 'react';
import { Gift, MapPin, Clock, Star, Sparkles, Moon, Wand2, Volume2, VolumeX } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function KidsMagicLayout({ content, website, colors }: BirthdayLayoutProps) {
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
    }, 2500);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Oliver";
  const age = content?.settings_json?.birthday?.age || "7";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "Sarah & John";

  const story = content?.about_text || `Calling all wizards, fairies, and magical creatures! ${name} is turning ${age}. Join us for a spellbinding celebration full of magic and mystery.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "A Magical Gathering!";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 31, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '31');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '4:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Enchanted Forest Castle";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "4:00 PM", event: "Sorting Ceremony & Games", date: rawDateStr, venue: location },
      { time: "5:30 PM", event: "Magical Feast", date: rawDateStr, venue: location },
      { time: "6:30 PM", event: "The Great Magic Show", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || "https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-31T16:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=magic-in-the-air-43177.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "Expecto Partium!";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#0F0C29] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Quicksand:wght@300;400;600;700&display=swap');
          .font-cinzel { font-family: 'Cinzel Decorative', cursive; }
          .font-quicksand { font-family: 'Quicksand', sans-serif; }
          .star-bg {
            background-image: 
              radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: twinkle 4s infinite alternate;
          }
          .gradient-text {
            background: linear-gradient(to right, #FBBF24, #FDE68A, #FBBF24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          @keyframes twinkle {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0C29] via-[#302B63] to-[#24243E]"></div>
        <div className="absolute inset-0 star-bg"></div>

        {/* Floating Magical Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#8B5CF6]/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FBBF24]/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]"></div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center h-full border border-[#FBBF24]/20 rounded-[2rem] bg-[#0F0C29]/40 backdrop-blur-sm m-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
          
          <div className="mb-8 relative">
             <Moon className="text-[#FBBF24] absolute -top-4 -left-8 animate-pulse" size={24} />
             <Star className="text-[#FBBF24] absolute -bottom-2 -right-6 animate-pulse delay-700" size={16} />
             <span className="text-sm font-quicksand font-bold tracking-[0.3em] text-[#E0E7FF] uppercase">
               {quoteText}
             </span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-cinzel gradient-text mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            {name}
          </h1>
          
          <div className="flex items-center gap-4 my-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#FBBF24]"></div>
            <h2 className="text-2xl sm:text-3xl font-cinzel text-[#A78BFA]">
              is turning {age}
            </h2>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#FBBF24]"></div>
          </div>

          <div className="mt-8 flex flex-col items-center border border-[#FBBF24]/30 rounded-2xl p-6 bg-white/5 backdrop-blur-md">
            <span className="text-[#FBBF24] font-cinzel text-xl mb-2">{monthStr} {dayNum}, {yearStr}</span>
            <span className="text-[#E0E7FF] font-quicksand font-semibold tracking-widest uppercase text-xs">{timeStr}</span>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-[#24243E] overflow-hidden">
        <div className="absolute inset-0 star-bg opacity-30"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-md mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6] to-[#FBBF24] rounded-t-full opacity-50 blur-xl group-hover:opacity-70 transition-opacity duration-700"></div>
            <div className="relative aspect-[3/4] rounded-t-full overflow-hidden p-1 bg-gradient-to-b from-[#FBBF24] to-transparent">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-t-full" alt="Birthday Wizard" />
            </div>
            {/* Sparkles around photo */}
            <Sparkles className="absolute -top-6 -right-6 text-[#FBBF24] animate-[float_4s_ease-in-out_infinite]" size={40} />
            <Sparkles className="absolute bottom-12 -left-8 text-[#A78BFA] animate-[float_5s_ease-in-out_infinite_reverse]" size={32} />
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Wand2 className="text-[#FBBF24] mb-6 animate-pulse" size={48} />
            <h2 className="text-4xl sm:text-5xl font-cinzel gradient-text mb-8">{storyTitle}</h2>
            <p className="text-lg text-[#E0E7FF] font-quicksand leading-relaxed tracking-wide mb-8">
              {story}
            </p>
            <div className="border-t border-[#FBBF24]/30 pt-8 w-full">
              <span className="text-xs font-quicksand font-bold text-[#A78BFA] uppercase tracking-[0.2em] block mb-2">Summoned by</span>
              <span className="text-2xl font-cinzel text-white">{parentsName}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-[#0F0C29]">
        <div className="max-w-4xl mx-auto relative">
          
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl sm:text-5xl font-cinzel gradient-text">Order of Events</h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto mt-6"></div>
          </div>

          {/* Magic glowing line connecting timeline */}
          <div className="absolute top-32 bottom-0 left-[27px] sm:left-1/2 w-[2px] bg-gradient-to-b from-[#FBBF24]/50 to-transparent sm:-translate-x-1/2 z-0"></div>

          <div className="space-y-12 relative z-10">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[15px] sm:left-1/2 w-6 h-6 rounded-full bg-[#302B63] border-2 border-[#FBBF24] sm:-translate-x-1/2 shadow-[0_0_15px_#FBBF24] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-ping"></div>
                </div>

                <div className={`pl-16 sm:pl-0 sm:w-1/2 flex flex-col ${idx % 2 === 0 ? 'sm:items-start sm:text-left' : 'sm:items-end sm:text-right'}`}>
                   <div className="bg-[#302B63]/60 backdrop-blur-sm border border-[#8B5CF6]/30 p-6 rounded-2xl hover:border-[#FBBF24]/50 transition-colors shadow-xl w-full">
                     <span className="text-[#FBBF24] font-cinzel text-xl mb-2 block">{item.time}</span>
                     <h3 className="text-xl font-quicksand font-bold text-white mb-2">{item.event}</h3>
                     <p className="text-[#A78BFA] text-xs font-quicksand uppercase tracking-widest">{item.venue || location}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-gradient-to-b from-[#0F0C29] to-[#24243E]">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 border border-[#8B5CF6]/20 rounded-[3rem] bg-[#302B63]/20 p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
           
           <div className="flex-1 text-center lg:text-left">
             <MapPin className="text-[#FBBF24] mx-auto lg:mx-0 mb-6 animate-bounce" size={40} />
             <h2 className="text-3xl sm:text-4xl font-cinzel text-white mb-6">The Enchanted Location</h2>
             
             <p className="text-2xl font-quicksand font-bold gradient-text mb-8">
               {location}
             </p>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-[#FBBF24] text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#0F0C29] font-quicksand font-bold tracking-widest uppercase text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)]"
              >
                Reveal Map
              </a>
            )}
           </div>

           <div className="flex-1 w-full relative">
             <div className="aspect-[4/3] rounded-[2rem] border-2 border-[#FBBF24]/30 overflow-hidden relative">
               <div className="absolute inset-0 bg-[#8B5CF6]/20 mix-blend-overlay z-10"></div>
               {venuePhoto ? (
                 <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-[#1A1A2E] flex items-center justify-center">
                   <Moon className="text-[#FBBF24] opacity-50" size={64} />
                 </div>
               )}
             </div>
           </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-[#24243E]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-cinzel gradient-text">Magical Memories</h2>
          </div>
          
          <div className="columns-2 md:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid relative rounded-xl overflow-hidden group border border-[#8B5CF6]/30">
                <div className="absolute inset-0 bg-[#FBBF24]/0 group-hover:bg-[#FBBF24]/20 mix-blend-overlay transition-all duration-500 z-10"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover filter contrast-[1.1] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#0F0C29] overflow-hidden">
        <div className="absolute inset-0 star-bg"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center bg-[#302B63]/40 backdrop-blur-sm border border-[#8B5CF6]/30 p-12 rounded-[3rem] shadow-[0_0_50px_rgba(139,92,246,0.1)]">
          
          <h2 className="text-3xl sm:text-4xl font-cinzel text-white mb-16">The Magic Begins In...</h2>

          <div className="flex flex-wrap gap-6 sm:gap-12 justify-center w-full">
            {[
              { label: 'Moons', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Spells', value: timeLeft?.m ?? 0 },
              { label: 'Blinks', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-20 sm:w-28 relative">
                <div className="absolute inset-0 bg-[#FBBF24]/10 rounded-full blur-xl animate-pulse"></div>
                <span className="text-5xl sm:text-7xl font-cinzel gradient-text mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-quicksand font-bold tracking-widest uppercase text-[#A78BFA]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-gradient-to-t from-[#0F0C29] to-[#24243E]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-cinzel gradient-text mb-6">Send Your Owl</h2>
            <p className="text-[#A78BFA] font-quicksand tracking-wider uppercase text-sm">RSVP to the celebration</p>
          </div>

          <div className="bg-[#302B63]/50 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] border border-[#FBBF24]/20 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <form className="space-y-8 font-quicksand" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#FBBF24] mb-3 ml-2">Name of Wizard / Witch</label>
                <input type="text" className="w-full bg-[#1A1A2E]/80 border-b-2 border-[#8B5CF6]/50 px-4 py-4 outline-none focus:border-[#FBBF24] transition-colors text-white text-lg rounded-t-lg" placeholder="Enter name(s)" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#FBBF24] mb-3 ml-2">Magical Messages & Potions (Allergies)</label>
                <textarea rows={3} className="w-full bg-[#1A1A2E]/80 border-b-2 border-[#8B5CF6]/50 px-4 py-4 outline-none focus:border-[#FBBF24] transition-colors text-white text-lg resize-none rounded-t-lg" placeholder="Any special notes?"></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-4 cursor-pointer p-4 border border-[#8B5CF6]/30 rounded-xl hover:border-[#FBBF24]/80 transition-all flex-1 bg-[#1A1A2E]/50 group">
                    <div className="w-5 h-5 rounded-full border-2 border-[#8B5CF6] group-hover:border-[#FBBF24] flex items-center justify-center">
                       <input type="radio" name="attending" className="w-2 h-2 opacity-0 group-hover:opacity-100 bg-[#FBBF24] rounded-full appearance-none transition-all" />
                    </div>
                    <span className="text-white text-lg">Will Appear</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer p-4 border border-[#8B5CF6]/30 rounded-xl hover:border-[#FBBF24]/80 transition-all flex-1 bg-[#1A1A2E]/50 group">
                    <div className="w-5 h-5 rounded-full border-2 border-[#8B5CF6] group-hover:border-[#FBBF24] flex items-center justify-center">
                       <input type="radio" name="attending" className="w-2 h-2 opacity-0 group-hover:opacity-100 bg-[#FBBF24] rounded-full appearance-none transition-all" />
                    </div>
                    <span className="text-white text-lg">Cannot Materialize</span>
                  </label>
                </div>
              </div>

              <div className="pt-10">
                <button type="button" className="w-full bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#FBBF24] hover:opacity-90 text-[#0F0C29] font-cinzel font-bold tracking-widest text-xl py-5 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all">
                  Deliver Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#0F0C29] relative text-white flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Floating Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#302B63]/80 backdrop-blur-md border border-[#FBBF24]/50 rounded-full flex items-center justify-center text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#0F0C29] hover:scale-110 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      {/* Magical Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[2000ms] ease-in-out bg-[#0F0C29] ${isOpened ? 'opacity-0 pointer-events-none scale-110 blur-xl' : 'opacity-100 scale-100'} cursor-pointer selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          @keyframes wandReveal {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; filter: brightness(1.5); }
            100% { transform: scale(2) rotate(45deg); opacity: 0; filter: blur(20px); }
          }
          @keyframes sparkleExplode {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
          }
        `}</style>
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0C29] via-[#302B63] to-[#24243E] opacity-80"></div>
        <div className="absolute inset-0 star-bg"></div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all ${isOpening ? 'animate-[wandReveal_1.5s_forwards]' : ''}`}>
           
           <div className="relative flex flex-col items-center group">
             <div className="absolute inset-0 bg-[#FBBF24] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
             
             <Wand2 className="text-[#FBBF24] mb-8 animate-[float_4s_ease-in-out_infinite]" size={80} strokeWidth={1.5} />
             
             <h1 className="text-4xl sm:text-5xl font-cinzel text-white text-center mb-6 tracking-widest uppercase drop-shadow-[0_0_10px_#FBBF24]">
               {name}'s<br/>Magical Party
             </h1>
             <div className="text-[#FBBF24] font-quicksand font-bold tracking-[0.3em] uppercase text-sm animate-pulse border-b border-[#FBBF24]/30 pb-2">
               Tap to Cast Spell
             </div>
           </div>

           {isOpening && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
               {[...Array(20)].map((_, i) => (
                 <Sparkles 
                   key={i} 
                   className="absolute text-[#FBBF24] animate-[sparkleExplode_1s_ease-out_forwards]"
                   style={{
                     left: `calc(50% + ${(Math.random() - 0.5) * 400}px)`,
                     top: `calc(50% + ${(Math.random() - 0.5) * 400}px)`,
                     animationDelay: `${Math.random() * 0.3}s`
                   }}
                   size={Math.random() * 30 + 10}
                 />
               ))}
             </div>
           )}
           
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-[#0F0C29] text-[#A78BFA] w-full border-t border-[#8B5CF6]/20">
        <span className="text-xs font-quicksand tracking-widest uppercase">Mischief Managed • {name}'s Birthday</span>
      </footer>

    </div>
  );
}
