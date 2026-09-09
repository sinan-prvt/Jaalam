import React, { useState, useEffect, useRef } from 'react';
import { Gift, Calendar, MapPin, Clock, Music, PartyPopper, Sparkles, Send, Volume2, VolumeX } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';
import GiftBoxAnimation from '../../../../ui/GiftBoxAnimation';

export default function KidsPlayfulLayout({ content, website, colors }: BirthdayLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const initialCountFromProp = content?.settings_json?.birthday?.wish_count || 12;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);

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
    }, 1500);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Leo";
  const age = content?.settings_json?.birthday?.age || "5";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "Sarah & John";

  const story = content?.about_text || `Our little star is turning ${age}! Join us for a magical day filled with fun, games, and lots of cake.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "You're Invited!";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'Oct');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Magic Bounce Park, Funville";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Welcome & Games", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "Cake Cutting", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Magic Show & Snacks", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || "https://images.unsplash.com/photo-1530103862676-de3c9da59c6b?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "Let's party!";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FFDF73] text-[#333] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
          .font-fredoka { font-family: 'Fredoka One', cursive; }
          .font-nunito { font-family: 'Nunito', sans-serif; }
          .zigzag-bg {
            background-color: #FFDF73;
            background-image:  linear-gradient(135deg, #FFC436 25%, transparent 25%), linear-gradient(225deg, #FFC436 25%, transparent 25%), linear-gradient(45deg, #FFC436 25%, transparent 25%), linear-gradient(315deg, #FFC436 25%, #FFDF73 25%);
            background-position:  10px 0, 10px 0, 0 0, 0 0;
            background-size: 20px 20px;
            background-repeat: repeat;
            opacity: 0.3;
          }
        `}</style>

        <div className="absolute inset-0 zigzag-bg pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <div className="w-24 h-24 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-8 transform -rotate-12 hover:rotate-12 transition-all duration-300">
             <span className="text-white font-fredoka text-5xl">{age}</span>
          </div>

          <span className="text-sm font-nunito font-black tracking-widest text-[#FF6B6B] uppercase mb-4 bg-white px-4 py-1 rounded-full shadow-sm">
            {quoteText}
          </span>

          <h1 className="text-6xl sm:text-8xl font-fredoka text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] uppercase mb-4">
            {name}
          </h1>
          <h2 className="text-2xl sm:text-4xl font-fredoka text-[#4ECDC4] drop-shadow-[0_2px_0_rgba(0,0,0,0.1)]">
            is turning {age}!
          </h2>

          <div className="mt-12 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row gap-6 items-center border-4 border-white">
            <div className="flex flex-col items-center">
              <span className="text-[#FF6B6B] font-fredoka text-3xl">{dayNum}</span>
              <span className="text-[#333] font-nunito font-black uppercase text-xs">{monthStr} {yearStr}</span>
            </div>
            <div className="hidden sm:block w-1 h-12 bg-[#FFDF73] rounded-full"></div>
            <div className="flex flex-col items-center">
              <Clock className="text-[#4ECDC4] mb-1" size={24} strokeWidth={3} />
              <span className="text-[#333] font-nunito font-black uppercase text-xs">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-16 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto text-center bg-[#F4F4F4] rounded-3xl p-8 border-4 border-[#FFDF73]">
          <span className="text-sm font-nunito font-black text-[#888] uppercase tracking-widest block mb-2">Hosted with love by</span>
          <span className="text-3xl font-fredoka text-[#4ECDC4]">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-white overflow-hidden">
        
        {/* Playful Floating Shapes */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-[#FF6B6B] rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-[#4ECDC4] rotate-45 opacity-20"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 border-4 border-[#FFDF73] rounded-full opacity-30"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center relative z-10">
          
          <div className="flex-1 relative w-full max-w-sm mx-auto">
            <div className="absolute inset-0 bg-[#FFDF73] rounded-[3rem] transform rotate-6 translate-x-2 translate-y-2"></div>
            <div className="relative aspect-square bg-white border-4 border-[#333] rounded-[3rem] overflow-hidden p-2">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-[2.5rem]" alt="Birthday Star" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-fredoka text-[#FF6B6B] mb-6">{storyTitle}</h2>
            <p className="text-xl text-[#555] font-nunito font-bold leading-relaxed bg-[#F4F4F4] p-6 rounded-3xl relative">
              <span className="absolute -top-4 -left-4 text-4xl">🎈</span>
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-[#4ECDC4]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl sm:text-5xl font-fredoka text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.1)]">Party Schedule</h2>
            <Sparkles className="absolute top-0 right-1/4 text-[#FFDF73] animate-pulse hidden sm:block" size={32} />
          </div>

          <div className="space-y-6">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-[0_8px_0_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center gap-6 hover:translate-y-1 hover:shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all">
                <div className="bg-[#FFDF73] text-[#333] font-fredoka text-2xl px-6 py-3 rounded-2xl whitespace-nowrap border-2 border-transparent">
                  {item.time}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-nunito font-black text-[#333] mb-1">{item.event}</h3>
                </div>
                {idx % 2 === 0 ? <PartyPopper className="text-[#FF6B6B]" size={32} /> : <Music className="text-[#4ECDC4]" size={32} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFDF73]">
        <div className="max-w-4xl mx-auto text-center bg-white p-8 sm:p-16 rounded-[3rem] shadow-[0_12px_0_rgba(0,0,0,0.05)] relative overflow-hidden">
           
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF6B6B] rounded-full opacity-10"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4ECDC4] rounded-full opacity-10"></div>

           <MapPin className="text-[#FF6B6B] mx-auto mb-6" size={48} strokeWidth={2.5} />
           <h2 className="text-3xl sm:text-4xl font-fredoka text-[#333] mb-4">Where's the Party?</h2>
           
           <p className="text-2xl sm:text-3xl font-nunito font-black text-[#4ECDC4] mb-10 px-4">
             {location}
           </p>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-nunito font-black tracking-widest uppercase text-sm px-10 py-5 rounded-full shadow-[0_6px_0_#d32f2f] active:shadow-[0_0px_0_#d32f2f] active:translate-y-[6px] transition-all"
            >
              Get Directions
            </a>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-fredoka text-[#333]">Fun Times!</h2>
          </div>
          
          <div className="columns-2 sm:columns-3 gap-4 space-y-4">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid relative rounded-2xl overflow-hidden border-4 border-[#FFDF73] shadow-md transform hover:rotate-2 hover:scale-105 transition-all">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FF6B6B]">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <h2 className="text-3xl sm:text-4xl font-fredoka text-white mb-16">Countdown to Fun!</h2>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-4 sm:p-6 rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.2)] w-24 sm:w-32">
                <span className="text-4xl sm:text-6xl font-fredoka text-[#333] mb-2">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-nunito font-black uppercase text-[#FF6B6B]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 px-6 sm:px-12 relative z-10 bg-[#4ECDC4]">
        <div className="max-w-2xl mx-auto text-center">
          <Gift className="text-[#FFDF73] mx-auto mb-4" size={48} />
          <h2 className="text-4xl sm:text-5xl font-fredoka text-white mb-8">Wishes & Blessings</h2>
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border-4 border-[#333]">
            <span className="text-7xl font-fredoka text-[#FF6B6B] block mb-2">{wishCount}</span>
            <span className="text-[#888] font-nunito font-black uppercase tracking-widest text-sm">Happy Wishes Received</span>
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="mt-8 bg-[#FFDF73] hover:bg-[#FFC436] text-[#333] px-10 py-4 rounded-full font-nunito font-black tracking-widest uppercase shadow-[0_6px_0_#e6b800] active:shadow-[0_0px_0_#e6b800] active:translate-y-[6px] transition-all"
            >
              Send a Wish!
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 px-6 sm:px-12 relative z-10 bg-[#F4F4F4]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-fredoka text-[#333] mb-4">Are you coming?</h2>
            <p className="text-[#888] font-nunito font-bold">Please let us know so we can prepare!</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl border-4 border-[#333]">
            <form className="space-y-6 font-nunito font-bold" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm text-[#555] mb-2 ml-4">Who is coming?</label>
                <input type="text" className="w-full bg-[#F9F9F9] border-2 border-[#E5E5E5] rounded-full px-6 py-4 outline-none focus:border-[#4ECDC4] transition-colors text-[#333] text-lg" placeholder="Enter name(s)" />
              </div>

              <div>
                <label className="block text-sm text-[#555] mb-2 ml-4">Message / Allergies?</label>
                <textarea rows={3} className="w-full bg-[#F9F9F9] border-2 border-[#E5E5E5] rounded-3xl px-6 py-4 outline-none focus:border-[#4ECDC4] transition-colors text-[#333] text-lg resize-none" placeholder="Any special notes?"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-[#E5E5E5] rounded-2xl hover:border-[#FF6B6B] transition-colors flex-1 bg-[#F9F9F9]">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#FF6B6B]" />
                    <span className="text-[#333] text-lg">Yes, I'll be there!</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-[#E5E5E5] rounded-2xl hover:border-[#FF6B6B] transition-colors flex-1 bg-[#F9F9F9]">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#FF6B6B]" />
                    <span className="text-[#333] text-lg">Sorry, can't make it</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-[#4ECDC4] hover:bg-[#3bb9b0] text-white font-fredoka tracking-wide text-2xl py-5 rounded-full shadow-[0_6px_0_#2b9c94] active:shadow-[0_0px_0_#2b9c94] active:translate-y-[6px] transition-all">
                  Send RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#F4F4F4] relative text-[#333] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Floating Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#FFDF73] border-4 border-white rounded-full flex items-center justify-center text-[#333] hover:scale-110 transition-transform shadow-lg"
        >
          {isMuted ? <VolumeX size={24} strokeWidth={3} /> : <Volume2 size={24} strokeWidth={3} />}
        </button>
      )}

      {/* Playful Entrance */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1000ms] ease-in bg-[#4ECDC4] ${isOpened ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100'} selection:bg-transparent overflow-hidden`}
      >
        <style>{`
          .polka-bg {
            background-image: radial-gradient(#ffffff 20%, transparent 20%);
            background-size: 30px 30px;
            opacity: 0.15;
          }
        `}</style>
        
        <div className="absolute inset-0 polka-bg pointer-events-none"></div>

        <div className={`relative z-30 transition-all duration-[500ms] ${isOpening ? 'scale-110 opacity-0' : 'scale-100'}`}>
          <GiftBoxAnimation 
            onOpen={handleOpen} 
            title={`${name}'s Birthday`} 
            subtitle="Tap to Open!"
            boxColor="#FFDF73"
            ribbonColor="#FF6B6B"
          />
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-12 relative z-10 text-center bg-[#F4F4F4] text-[#A0A0A0] w-full">
        <span className="text-sm font-nunito font-black uppercase">Made with ❤️ for {name}</span>
      </footer>

    </div>
  );
}
