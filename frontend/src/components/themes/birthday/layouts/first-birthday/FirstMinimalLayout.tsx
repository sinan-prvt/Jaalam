import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays, ArrowRight } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function FirstMinimalLayout({ content }: BirthdayLayoutProps) {
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
    }, 1500);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Emma";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Miller Family";

  const story = content?.about_text || `A year of tiny yawns and gentle sighs. We invite you to share in the quiet joy of ${name}'s first year.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "You're Invited";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Our Sunlit Garden";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Arrival & Welcome", date: rawDateStr, venue: location },
      { time: "3:00 PM", event: "Cake Cutting", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Farewells", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "A quiet year of joy.";

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

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-between items-center text-center bg-[#F9F9F9] p-0 overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@200;300;400&display=swap');
          .font-editorial-title { font-family: 'Playfair Display', serif; font-weight: 400; letter-spacing: -0.02em; }
          .font-editorial-body { font-family: 'Inter', sans-serif; font-weight: 300; letter-spacing: 0.25em; }
          .sharp-border { border: 1px solid #111111; }
          .thin-border { border: 1px solid #E5E5E5; }
        `}</style>
        
        {/* Top Navbar Area */}
        <div className="w-full p-8 flex justify-between items-start z-10 animate-fade-in-up">
          <div className="text-left">
            <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#111111] block mb-1">01</span>
            <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#888888]">Chapter</span>
          </div>
          <div className="text-right">
            <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#111111] block mb-1">{dateObj.getFullYear()}</span>
            <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#888888]">Year</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative mb-12">
            <h1 className="text-[5rem] sm:text-[9rem] md:text-[12rem] font-editorial-title text-[#111111] leading-[0.8] z-20 relative mix-blend-difference text-white">
              {name.toUpperCase()}
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-2xl aspect-[16/9] z-10 bg-black">
              <img src={mainPhoto} alt={name} className="w-full h-full object-cover opacity-80 grayscale" />
            </div>
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             <span className="font-editorial-title italic text-3xl sm:text-4xl text-[#111111]">is turning one</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full border-t border-[#E5E5E5] flex justify-between p-8 bg-white z-10">
           <div className="flex flex-col items-start">
             <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#888888] mb-1">Date</span>
             <span className="font-editorial-body text-[11px] uppercase tracking-widest text-[#111111]">{monthStr} {dayNum}, {yearStr}</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#888888] mb-1">Time</span>
             <span className="font-editorial-body text-[11px] uppercase tracking-widest text-[#111111]">{timeStr}</span>
           </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-start">
          <div className="flex-1">
            <span className="font-editorial-body text-[9px] text-[#888888] uppercase tracking-[0.4em] block mb-8">Details</span>
            <h2 className="text-4xl sm:text-6xl font-editorial-title text-[#111111] mb-8 leading-tight">{storyTitle}</h2>
          </div>
          <div className="flex-1 pt-2 md:pt-12">
            <p className="text-[#111111] text-lg font-light font-editorial-title italic leading-relaxed mb-12">
              {story}
            </p>
            <div className="thin-border p-8 inline-block">
              <span className="font-editorial-body text-[9px] text-[#888888] uppercase tracking-[0.4em] block mb-4">Hosted By</span>
              <span className="text-xl font-editorial-title text-[#111111] uppercase tracking-widest block">{parentsName}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#F9F9F9] border-t border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20">
            <span className="font-editorial-body text-[9px] text-[#888888] uppercase tracking-[0.4em] block mb-4">Schedule</span>
            <h2 className="text-4xl sm:text-5xl font-editorial-title text-[#111111]">Order of Events</h2>
          </div>

          <div className="w-full border-t border-[#111111]">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 border-b border-[#E5E5E5] group hover:bg-white transition-colors px-4 -mx-4">
                <div className="flex-1">
                  <span className="text-[#111111] font-editorial-title text-2xl sm:text-3xl transition-transform duration-300 group-hover:translate-x-4 inline-block">{item.event}</span>
                </div>
                <div className="flex-shrink-0 mt-4 sm:mt-0">
                  <span className="text-[#888888] font-editorial-body text-[10px] uppercase tracking-[0.3em]">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-0 border border-[#E5E5E5]">
          <div className="flex-1 p-16 sm:p-24 flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-[#E5E5E5]">
            <MapPin size={24} strokeWidth={1} className="text-[#111111] mb-12" />
            <span className="text-[9px] font-editorial-body text-[#888888] uppercase tracking-[0.4em] block mb-6">Location</span>
            <h3 className="text-4xl font-editorial-title text-[#111111] mb-12 leading-tight">{location}</h3>
            
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-[#111111]">
                <span className="font-editorial-body text-[10px] uppercase tracking-widest border-b border-[#111111] pb-1">Get Directions</span>
                <ArrowRight size={16} strokeWidth={1} className="transition-transform duration-300 group-hover:translate-x-2" />
              </a>
            )}
          </div>
          
          <div className="flex-1 min-h-[400px] bg-[#F9F9F9]">
             {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <span className="text-[#888888] font-editorial-body text-[9px] uppercase tracking-widest">Map view unavailable</span>
                </div>
              )}
          </div>
        </div>
      </section>
    ),
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#111111] text-white text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="font-editorial-body text-[9px] text-[#888888] uppercase tracking-[0.4em] block mb-20">Anticipation</span>
          
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-24 sm:w-32">
                <span className="text-6xl sm:text-8xl font-editorial-title mb-6">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-editorial-body uppercase text-[#888888] tracking-[0.3em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 flex justify-between items-end">
            <div>
              <span className="font-editorial-body text-[9px] text-[#888888] uppercase tracking-[0.4em] block mb-4">Gallery</span>
              <h2 className="text-4xl font-editorial-title text-[#111111]">Captured Moments</h2>
            </div>
            <span className="font-editorial-body text-[9px] text-[#111111] uppercase tracking-[0.4em] hidden sm:block">Volume I</span>
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => {
              return (
                <div key={index} className="break-inside-avoid relative overflow-hidden group">
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
                  <div className="absolute inset-0 border border-[#111111] opacity-0 group-hover:opacity-100 transition-opacity duration-500 m-4 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ) : null,
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#F9F9F9] border-t border-[#E5E5E5]">
        <div className="max-w-2xl mx-auto text-center">
          <Mail size={24} strokeWidth={1} className="text-[#111111] mx-auto mb-10" />
          <h2 className="text-4xl font-editorial-title text-[#111111] mb-12 italic">Guestbook</h2>
          
          <div className="flex items-center justify-center gap-8 mb-16">
            <button 
              onClick={() => setWishCount(Math.max(0, wishCount - 1))}
              className="text-[#888888] hover:text-[#111111] transition-colors font-editorial-body text-xl"
            >-</button>
            <div className="w-32 text-center border-b border-[#111111] pb-2">
              <span className="text-6xl font-editorial-title text-[#111111]">{wishCount}</span>
            </div>
            <button 
              onClick={() => { setWishCount(wishCount + 1); triggerConfettiPopper(); }}
              className="text-[#888888] hover:text-[#111111] transition-colors font-editorial-body text-xl"
            >+</button>
          </div>
          
          <p className="text-[#888888] font-editorial-body text-[9px] uppercase tracking-widest mb-16">Messages Received</p>
          
          <button className="bg-transparent border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] font-editorial-body text-[9px] uppercase tracking-[0.3em] py-6 px-16 transition-colors">
            Leave a Message
          </button>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-24">
            <span className="font-editorial-body text-[9px] text-[#888888] uppercase tracking-[0.4em] block mb-4">Response</span>
            <h2 className="text-5xl font-editorial-title text-[#111111]">RSVP</h2>
          </div>
          
          <form className="flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input type="text" id="name" className="peer w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#111111] py-4 outline-none text-xl text-[#111111] font-editorial-title italic placeholder-transparent transition-colors" placeholder="Name(s)" />
              <label htmlFor="name" className="absolute left-0 top-4 text-[#888888] font-editorial-body text-[9px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[#111111] peer-focus:text-[8px] peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:[text-8px]">Name(s) of Guest(s)</label>
            </div>
            
            <div className="relative mt-4">
              <textarea id="note" rows={1} className="peer w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#111111] py-4 outline-none text-xl text-[#111111] font-editorial-title italic placeholder-transparent transition-colors resize-none" placeholder="Note"></textarea>
              <label htmlFor="note" className="absolute left-0 top-4 text-[#888888] font-editorial-body text-[9px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[#111111] peer-focus:text-[8px] peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:[text-8px]">A brief note...</label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 mt-8">
              <label className="flex items-center justify-start gap-4 cursor-pointer flex-1 group">
                <div className="relative w-5 h-5 flex items-center justify-center">
                   <input type="radio" name="attendance" className="peer appearance-none w-full h-full border border-[#E5E5E5] checked:border-[#111111] transition-colors cursor-pointer" defaultChecked />
                   <div className="absolute w-2 h-2 bg-[#111111] scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                <span className="text-[#111111] font-editorial-body text-[10px] uppercase tracking-widest">Accept</span>
              </label>
              
              <label className="flex items-center justify-start gap-4 cursor-pointer flex-1 group">
                <div className="relative w-5 h-5 flex items-center justify-center">
                   <input type="radio" name="attendance" className="peer appearance-none w-full h-full border border-[#E5E5E5] checked:border-[#111111] transition-colors cursor-pointer" />
                   <div className="absolute w-2 h-2 bg-[#111111] scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                <span className="text-[#888888] group-hover:text-[#111111] transition-colors font-editorial-body text-[10px] uppercase tracking-widest">Decline</span>
              </label>
            </div>
            
            <div className="mt-12 text-center">
              <button type="button" className="w-full bg-[#111111] hover:bg-[#000000] text-white font-editorial-body text-[10px] uppercase tracking-[0.4em] py-6 transition-colors">
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'about', label: 'Details', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Location', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  const sections = content?.settings_json?.birthday?.sections || defaultSections;

  return (
    <div className={`min-h-screen bg-[#FFFFFF] relative text-[#111111] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Elegant Music Toggle Button */}
      {musicUrl && isOpened && (
        <button 
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center text-[#111111] hover:bg-[#F9F9F9] transition-colors"
        >
          {isMuted ? <VolumeX size={16} strokeWidth={1} /> : <Volume2 size={16} strokeWidth={1} />}
        </button>
      )}

      {/* Minimal Editorial Split Entrance */}
      <div className={`fixed inset-0 z-[100] pointer-events-none flex`}>
        {/* Left Door */}
        <div 
          className={`w-1/2 h-full bg-[#FFFFFF] transition-transform duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened || isOpening ? '-translate-x-full' : 'translate-x-0'} border-r border-[#E5E5E5]`}
        ></div>
        {/* Right Door */}
        <div 
          className={`w-1/2 h-full bg-[#FFFFFF] transition-transform duration-[1500ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened || isOpening ? 'translate-x-full' : 'translate-x-0'}`}
        ></div>

        {/* Center Content */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-auto ${isOpening || isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div 
            onClick={handleOpen}
            className="group cursor-pointer flex flex-col items-center justify-center p-12 bg-[#FFFFFF] border border-[#111111] transition-transform duration-500 hover:scale-105"
          >
             <span className="text-[#888888] font-editorial-body text-[9px] uppercase tracking-[0.4em] mb-4">You are invited</span>
             <h1 className="text-3xl font-editorial-title text-[#111111] mb-8">{name.toUpperCase()}</h1>
             <div className="w-[1px] h-12 bg-[#111111] mb-8 group-hover:h-16 transition-all duration-500"></div>
             <span className="font-editorial-body text-[9px] uppercase tracking-widest text-[#111111]">Tap to Reveal</span>
          </div>
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      <footer className="py-24 relative z-10 text-center bg-[#111111] text-[#FFFFFF] w-full">
        <p className="font-editorial-body text-[9px] uppercase tracking-[0.5em] mb-4">A Quiet Celebration</p>
        <p className="font-editorial-title italic text-sm text-[#888888]">{dateObj.getFullYear()}</p>
      </footer>
    </div>
  );
}
