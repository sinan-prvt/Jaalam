import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';

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
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1200);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Emma";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Miller Family";

  const story = content?.about_text || `A year of tiny yawns and gentle sighs. We invite you to share in the quiet joy of Emma's first year.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "You're Invited";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const _yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Our Sunlit Garden";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Welcome & Quiet Music", date: rawDateStr, venue: location },
      { time: "3:00 PM", event: "Cake Cutting", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Gentle Goodbyes", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const _venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FCFCFC] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500&display=swap');
          .font-minimal-title { font-family: 'Playfair Display', serif; font-weight: 400; }
          .font-minimal-body { font-family: 'Inter', sans-serif; font-weight: 300; letter-spacing: 0.1em; }
          
          .minimal-panel {
            background: #FFFFFF;
            border: 1px solid #EAE6DF;
          }
        `}</style>
        
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-[#A3A3A3] font-minimal-body uppercase text-[9px] tracking-[0.4em] block mb-4">First Birthday</span>
            <h1 className="text-6xl sm:text-7xl font-minimal-title text-[#2A2A2A] leading-tight mt-6 mb-4">{name}</h1>
          </div>

          <div className="w-full relative px-4 sm:px-12 mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="minimal-panel p-2 rounded-xl relative">
              <img src={mainPhoto} alt={name} className="w-full h-auto aspect-[4/5] object-cover rounded-lg grayscale-[20%]" />
            </div>
          </div>
          
          <div className="minimal-panel px-12 py-8 rounded-full flex flex-row items-center gap-16 mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-minimal-body uppercase text-[#A3A3A3] tracking-[0.3em] mb-2">{monthStr}</span>
              <span className="text-4xl font-minimal-title text-[#2A2A2A]">{dayNum}</span>
            </div>
            <div className="w-[1px] h-12 bg-[#EAE6DF]"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-minimal-body uppercase text-[#A3A3A3] tracking-[0.3em] mb-2">Time</span>
              <span className="text-lg font-minimal-body text-[#2A2A2A]">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <span className="text-[9px] font-minimal-body text-[#A3A3A3] uppercase tracking-[0.4em] block mb-6">Hosted By</span>
          <span className="text-3xl font-minimal-title text-[#2A2A2A] block mb-16">{parentsName}</span>
          
          <div className="w-12 h-[1px] bg-[#EAE6DF] mx-auto mb-16"></div>
          
          <h2 className="text-4xl font-minimal-title text-[#2A2A2A] mb-8">{storyTitle}</h2>
          <p className="text-[#2A2A2A] text-lg font-minimal-body leading-relaxed mb-10 max-w-lg mx-auto">
            {story}
          </p>
          <div className="minimal-panel px-8 py-6 rounded-2xl inline-block mt-4">
            <p className="text-[#A3A3A3] font-minimal-title text-xl italic leading-relaxed">
              &quot;{quoteText}&quot;
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FCFCFC]">
        <div className="max-w-2xl mx-auto flex flex-col gap-16 items-center relative z-10">
          <div className="text-center">
            <span className="font-minimal-body text-[9px] text-[#A3A3A3] uppercase tracking-[0.4em] block mb-6">Schedule</span>
            <h2 className="text-4xl sm:text-5xl font-minimal-title text-[#2A2A2A]">Order of Events</h2>
          </div>

          <div className="relative border-l border-[#EAE6DF] ml-4 sm:ml-8 space-y-16 pb-8 w-full max-w-md mx-auto">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => {
              return (
              <div key={idx} className="relative pl-12 sm:pl-16 group">
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[#EAE6DF] transition-transform duration-500 group-hover:scale-150">
                </div>
                
                <div className="minimal-panel p-8 rounded-xl transition-all duration-500 hover:shadow-sm">
                  <span className="text-[#A3A3A3] font-minimal-body text-[9px] uppercase tracking-widest block mb-4">
                    {item.time}
                  </span>
                  <h3 className="text-xl font-minimal-title text-[#2A2A2A]">{item.event}</h3>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-2xl mx-auto text-center relative z-10 minimal-panel p-16 rounded-xl aspect-square flex flex-col items-center justify-center">
           <MapPin size={24} strokeWidth={1} className="text-[#A3A3A3] mb-8" />
           <span className="text-[9px] font-minimal-body text-[#A3A3A3] uppercase tracking-[0.4em] block mb-4">Join Us At</span>
           <h3 className="text-3xl font-minimal-title text-[#2A2A2A] mb-8 leading-relaxed max-w-sm mx-auto">{location}</h3>
           
           <div className="mt-8 w-full h-[300px] bg-[#FCFCFC] rounded-lg overflow-hidden border border-[#EAE6DF]">
             {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <MapPin size={24} strokeWidth={1} className="text-[#EAE6DF] mb-4" />
                  <span className="text-[#A3A3A3] font-minimal-body text-[9px] uppercase tracking-widest">Location map</span>
                </div>
              )}
           </div>
        </div>
      </section>
    ),
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="font-minimal-body text-[9px] text-[#A3A3A3] uppercase tracking-[0.4em] block mb-12">The Celebration Begins In</span>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center minimal-panel rounded-xl aspect-square w-28 sm:w-36 justify-center">
                <span className="text-4xl sm:text-5xl font-minimal-title text-[#2A2A2A] mb-3">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-minimal-body uppercase text-[#A3A3A3] tracking-[0.3em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-minimal-body text-[9px] text-[#A3A3A3] uppercase tracking-[0.4em] block mb-4">Gallery</span>
            <h2 className="text-4xl font-minimal-title text-[#2A2A2A]">Captured Moments</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {validGallery.map((url: string, index: number) => {
              const isLarge = index % 5 === 0;
              return (
                <div key={index} className={`relative overflow-hidden minimal-panel p-1 rounded-lg ${isLarge ? 'aspect-square md:col-span-2 md:row-span-2' : 'aspect-square'}`}>
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded-md grayscale-[15%] transition-transform duration-700 hover:scale-105" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ) : null,
    wishes: (
      <section key="wishes" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FCFCFC]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-16">
            <Mail size={24} strokeWidth={1} className="text-[#A3A3A3] mx-auto mb-6" />
            <h2 className="text-4xl font-minimal-title text-[#2A2A2A] mb-4">Well Wishes</h2>
            <p className="text-[#A3A3A3] font-minimal-body text-[9px] uppercase tracking-[0.3em]">Leave a message</p>
          </div>
          
          <div className="minimal-panel p-10 sm:p-16 rounded-xl relative text-center flex flex-col items-center">
            <div className="flex items-center gap-4 mb-10">
              <button 
                onClick={() => setWishCount(Math.max(0, wishCount - 1))}
                className="w-10 h-10 rounded-full border border-[#EAE6DF] flex items-center justify-center text-[#2A2A2A] hover:bg-[#F9F9F9] transition-colors"
              >-</button>
              <div className="w-20 text-center">
                <span className="text-3xl font-minimal-title text-[#2A2A2A]">{wishCount}</span>
              </div>
              <button 
                onClick={() => setWishCount(wishCount + 1)}
                className="w-10 h-10 rounded-full border border-[#EAE6DF] flex items-center justify-center text-[#2A2A2A] hover:bg-[#F9F9F9] transition-colors"
              >+</button>
            </div>
            <p className="text-[#A3A3A3] font-minimal-body text-[10px] uppercase tracking-widest mb-10">Wishes received so far</p>
            
            <button className="bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white font-minimal-body text-[9px] uppercase tracking-[0.3em] py-5 px-12 rounded-lg transition-colors w-full">
              Sign the Guestbook
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="font-minimal-body text-[9px] text-[#A3A3A3] uppercase tracking-[0.4em] block mb-4">Attendance</span>
            <h2 className="text-4xl font-minimal-title text-[#2A2A2A]">RSVP</h2>
          </div>
          
          <div className="minimal-panel p-10 sm:p-16 rounded-xl">
            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <input type="text" className="w-full bg-transparent border-b border-[#EAE6DF] pb-4 outline-none focus:border-[#2A2A2A] transition-colors text-sm text-[#2A2A2A] placeholder-[#A3A3A3] font-minimal-body" placeholder="Name(s) of Guest(s)" />
              </div>
              
              <div className="flex flex-col gap-2">
                <textarea rows={3} className="w-full bg-transparent border-b border-[#EAE6DF] pb-4 outline-none focus:border-[#2A2A2A] transition-colors text-sm text-[#2A2A2A] placeholder-[#A3A3A3] font-minimal-body resize-none" placeholder="A brief note or dietary requests..."></textarea>
              </div>
              
              <div className="flex gap-4 mt-4">
                <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#EAE6DF] rounded-lg bg-transparent hover:bg-[#FCFCFC] transition-colors flex-1 group">
                  <input type="radio" name="attendance" className="accent-[#2A2A2A]" defaultChecked />
                  <span className="text-[#2A2A2A] font-minimal-body text-[10px] uppercase tracking-widest">Joyfully Accept</span>
                </label>
                <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border border-[#EAE6DF] rounded-lg bg-transparent hover:bg-[#FCFCFC] transition-colors flex-1 group">
                  <input type="radio" name="attendance" className="accent-[#2A2A2A]" />
                  <span className="text-[#2A2A2A] font-minimal-body text-[10px] uppercase tracking-widest">Regretfully Decline</span>
                </label>
              </div>
              
              <div className="mt-8">
                <button type="button" className="w-full bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white font-minimal-body text-[10px] uppercase tracking-[0.3em] py-5 rounded-lg transition-colors">
                  Send RSVP
                </button>
              </div>
            </form>
          </div>
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
    <div className={`min-h-screen bg-[#FCFCFC] relative text-[#2A2A2A] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Elegant Music Toggle Button */}
      {musicUrl && isOpened && (
        <button 
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 minimal-panel rounded-full flex items-center justify-center text-[#2A2A2A] hover:bg-[#F9F9F9] transition-colors"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
        </button>
      )}

      {/* Minimal Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ease-in-out bg-[#FFFFFF] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} cursor-pointer selection:bg-transparent`}
      >
        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700 ease-out ${isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
           <div className="minimal-panel p-16 sm:p-24 rounded-xl aspect-[3/4] flex flex-col items-center justify-center max-w-[85vw] max-h-[85vh] relative z-10 text-center w-[360px] sm:w-[420px]">
             
             <span className="text-[#A3A3A3] font-minimal-body text-[9px] uppercase tracking-[0.4em] mb-6">You are invited</span>
             
             <h1 className="text-4xl font-minimal-title text-[#2A2A2A] mb-8">{name} is 1</h1>
             
             <CalendarDays size={24} strokeWidth={1} className="text-[#EAE6DF] mb-12" />
             
             <div className="mt-8 border border-[#2A2A2A] rounded-full px-10 py-4 hover:bg-[#FCFCFC] transition-colors">
               <span className="text-[#2A2A2A] font-minimal-body text-[9px] uppercase tracking-[0.3em]">Tap to Reveal</span>
             </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center bg-[#FCFCFC] text-[#A3A3A3] w-full border-t border-[#EAE6DF]">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-[#EAE6DF]"></div>
          <p className="font-minimal-body text-[9px] uppercase tracking-[0.4em]">Thank You</p>
          <div className="w-8 h-[1px] bg-[#EAE6DF]"></div>
        </div>
      </footer>
    </div>
  );
}
