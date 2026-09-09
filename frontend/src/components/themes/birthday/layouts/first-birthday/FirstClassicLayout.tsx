import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Volume2, VolumeX, Mail, Clock, BookOpen, Heart, Sparkles } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function FirstClassicLayout({ content }: BirthdayLayoutProps) {
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
    }, 2000);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Theodore";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Hastings";

  const story = content?.about_text || `Once upon a time, a beautiful baby boy was born. A year has passed like a fleeting dream, and our little prince is turning one. Join us for a classic celebration of a magical first year.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "Chapter One";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Rose Garden";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "A Royal Welcome", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "The Grand Cake Cutting", date: rawDateStr, venue: location },
      { time: "5:00 PM", event: "A Fond Farewell", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "A timeless tale.";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FBF8F1] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;500;600&display=swap');
          .font-classic-title { font-family: 'Cormorant Garamond', serif; }
          .font-classic-body { font-family: 'Cinzel', serif; letter-spacing: 0.1em; }
          
          .vintage-border {
            border: 2px solid #C19A6B;
            padding: 8px;
            position: relative;
          }
          .vintage-border::before {
            content: '';
            position: absolute;
            inset: 4px;
            border: 1px solid rgba(193, 154, 107, 0.5);
          }
          .storybook-page {
            transform-origin: left center;
            transition: transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 1s ease 0.5s;
          }
          .storybook-page.opening {
            transform: perspective(2000px) rotateY(-120deg);
            opacity: 0;
          }
        `}</style>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <div className="mb-12 vintage-border rounded-full p-1 inline-block animate-fade-in-up">
            <div className="bg-[#FFFFFF] text-[#C19A6B] font-classic-body text-[10px] uppercase px-8 py-3 rounded-full">
              {quoteText}
            </div>
          </div>

          <div className="relative mb-12 w-full px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-6xl sm:text-8xl font-classic-title text-[#4A3B32] font-semibold mb-4 leading-none">
              {name}
            </h1>
            <p className="font-classic-title text-[#A3B1C6] text-3xl sm:text-4xl italic">
              is turning one
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto relative mb-16 vintage-border bg-white p-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             <img src={mainPhoto} alt={name} className="w-full aspect-[4/5] object-cover sepia-[0.2]" />
          </div>

          <div className="flex flex-row items-center gap-12 sm:gap-24 text-[#4A3B32] animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col items-center">
              <span className="font-classic-title text-4xl mb-2">{dayNum}</span>
              <span className="font-classic-body text-[10px] uppercase text-[#8B7D72]">{monthStr}</span>
            </div>
            <div className="w-[1px] h-16 bg-[#C19A6B] opacity-50"></div>
            <div className="flex flex-col items-center">
              <span className="font-classic-title text-2xl mb-2">{timeStr}</span>
              <span className="font-classic-body text-[10px] uppercase text-[#8B7D72]">Arrival</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <BookOpen size={24} strokeWidth={1} className="text-[#C19A6B] mx-auto mb-6" />
          <span className="text-[10px] font-classic-body text-[#8B7D72] uppercase tracking-[0.2em] block mb-4">Hosted by</span>
          <span className="text-2xl font-classic-title text-[#4A3B32] block mb-12 italic">{parentsName}</span>
          
          <div className="w-24 h-[1px] bg-[#C19A6B] mx-auto mb-12 opacity-50"></div>
          
          <h2 className="text-4xl sm:text-5xl font-classic-title text-[#4A3B32] mb-8 font-semibold">{storyTitle}</h2>
          <p className="text-[#6D5C51] text-xl font-classic-title leading-loose italic">
            {story}
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FBF8F1]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-classic-title text-[#4A3B32] font-semibold mb-4">The Festivities</h2>
            <div className="w-16 h-1 bg-[#C19A6B] mx-auto opacity-60"></div>
          </div>

          <div className="relative border-l border-[#C19A6B]/30 ml-4 sm:ml-8 space-y-16 pb-8">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => {
              return (
              <div key={idx} className="relative pl-12 sm:pl-16 group">
                <div className="absolute -left-[6px] top-2 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#C19A6B] transition-transform duration-500 group-hover:scale-125">
                </div>
                
                <div className="bg-white vintage-border p-8 transition-all duration-500 hover:shadow-lg">
                  <span className="text-[#C19A6B] font-classic-body text-[10px] uppercase tracking-widest block mb-4">
                    {item.time}
                  </span>
                  <h3 className="text-2xl font-classic-title text-[#4A3B32] font-semibold">{item.event}</h3>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <span className="text-[10px] font-classic-body text-[#8B7D72] uppercase tracking-[0.2em] block mb-4">The Grand Location</span>
            <h2 className="text-4xl sm:text-5xl font-classic-title text-[#4A3B32] mb-8 font-semibold leading-tight">
              {location}
            </h2>
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent text-[#4A3B32] font-classic-body text-[10px] uppercase tracking-[0.2em] px-8 py-4 border border-[#4A3B32] hover:bg-[#4A3B32] hover:text-white transition-colors"
              >
                View Directions
              </a>
            )}
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="vintage-border bg-[#FBF8F1] p-2 aspect-square">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="sepia-[0.3] grayscale-[0.2]"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border border-[#C19A6B]/30">
                  <MapPin size={32} strokeWidth={1} className="text-[#C19A6B] mb-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#4A3B32] text-white">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <Sparkles size={24} strokeWidth={1} className="text-[#C19A6B] mb-8" />
          <h2 className="text-4xl sm:text-5xl font-classic-title text-[#FBF8F1] mb-16 italic">Awaiting the celebration...</h2>

          <div className="flex flex-wrap gap-6 sm:gap-12 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-24 sm:w-32">
                <span className="text-5xl sm:text-7xl font-classic-title text-[#C19A6B] mb-4">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-classic-body uppercase text-[#A3B1C6] tracking-[0.2em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FBF8F1]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
             <h2 className="text-4xl sm:text-5xl font-classic-title text-[#4A3B32] font-semibold mb-4">Memories & Milestones</h2>
             <div className="w-16 h-1 bg-[#C19A6B] mx-auto opacity-60"></div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => {
              return (
              <div key={index} className="break-inside-avoid vintage-border bg-white p-2">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover sepia-[0.15] hover:sepia-0 transition-all duration-700" />
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-2xl mx-auto text-center">
          
          <h2 className="text-4xl sm:text-5xl font-classic-title text-[#4A3B32] mb-12 italic">The Guestbook</h2>
          
          <div className="vintage-border bg-[#FBF8F1] p-16 relative text-center flex flex-col items-center">
            
            <p className="text-lg font-classic-title text-[#6D5C51] italic leading-loose mb-12">
              "Your blessings are the greatest gift."
            </p>
            
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-[1px] bg-[#C19A6B] opacity-50"></div>
              <span className="text-5xl font-classic-title text-[#4A3B32]">{wishCount}</span>
              <div className="w-16 h-[1px] bg-[#C19A6B] opacity-50"></div>
            </div>
            
            <span className="text-[#8B7D72] font-classic-body uppercase tracking-[0.2em] text-[9px] mb-12">Wishes Received</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-[#4A3B32] hover:bg-[#322721] text-white px-10 py-4 font-classic-body text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              Sign the Book
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FBF8F1]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Mail size={24} strokeWidth={1} className="text-[#C19A6B] mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-classic-title text-[#4A3B32] font-semibold mb-4">RSVP</h2>
            <p className="text-[#8B7D72] font-classic-body text-[10px] uppercase tracking-[0.2em]">Kindly reply</p>
          </div>

          <div className="vintage-border bg-white p-10 sm:p-16">
            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#C19A6B]/40 pb-4 outline-none focus:border-[#4A3B32] transition-colors text-xl font-classic-title italic text-[#4A3B32] placeholder-[#A3B1C6]" placeholder="Name(s) of Guest(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#C19A6B]/40 pb-4 outline-none focus:border-[#4A3B32] transition-colors text-xl font-classic-title italic text-[#4A3B32] placeholder-[#A3B1C6] resize-none" placeholder="A brief note or dietary requests..."></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-8">
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-6 border border-[#C19A6B]/40 bg-transparent hover:bg-[#FBF8F1] transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#C19A6B]" defaultChecked />
                    <span className="text-[#4A3B32] font-classic-body text-[10px] uppercase tracking-widest">Joyfully Accept</span>
                  </label>
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-6 border border-[#C19A6B]/40 bg-transparent hover:bg-[#FBF8F1] transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#4A3B32]" />
                    <span className="text-[#4A3B32] font-classic-body text-[10px] uppercase tracking-widest">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="bg-[#4A3B32] hover:bg-[#322721] text-white font-classic-body text-[10px] uppercase tracking-[0.2em] py-5 px-16 transition-colors">
                  Send Response
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
    <div className={`min-h-screen bg-[#FBF8F1] relative text-[#4A3B32] flex flex-col items-center w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Elegant Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-white vintage-border flex items-center justify-center text-[#C19A6B] hover:bg-[#FBF8F1] transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1} /> : <Volume2 size={20} strokeWidth={1} />}
        </button>
      )}

      {/* Vintage Storybook Entrance */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-[1500ms] bg-[#2C231D] ${isOpened ? 'opacity-0 pointer-events-none delay-1000' : 'opacity-100'}`}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>
        
        {/* The Book Container */}
        <div className="relative w-full max-w-[500px] aspect-[3/4] perspective-[2000px] flex items-center justify-center">
           {/* Book Back/Inside */}
           <div className={`absolute inset-4 bg-[#FBF8F1] vintage-border transition-opacity duration-1000 delay-500 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
           </div>

           {/* Book Cover (Flips open) */}
           <div 
             onClick={handleOpen}
             className={`absolute inset-0 bg-[#4A3B32] cursor-pointer shadow-2xl storybook-page flex flex-col items-center justify-center p-8 sm:p-12 text-center border-l-8 border-[#322721] ${isOpening ? 'opening' : ''}`}
           >
              <div className="absolute inset-2 border-2 border-[#C19A6B] opacity-50"></div>
              <div className="absolute inset-4 border border-[#C19A6B] opacity-30"></div>
              
              <Sparkles size={32} strokeWidth={1} className="text-[#C19A6B] mb-12" />
              
              <h1 className="text-4xl sm:text-6xl font-classic-title text-[#FBF8F1] mb-6 font-semibold">
                {name}&apos;s
              </h1>
              <h2 className="text-2xl sm:text-4xl font-classic-title text-[#C19A6B] italic mb-16">
                1st Birthday
              </h2>
              
              <div className="w-16 h-[1px] bg-[#C19A6B] opacity-50 mb-16"></div>
              
              <div className="text-[#A3B1C6] font-classic-body text-[10px] uppercase tracking-[0.2em] border border-[#A3B1C6]/30 px-6 py-3 hover:bg-[#A3B1C6]/10 transition-colors">
                Open Book
              </div>
           </div>
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-[#2C231D] text-[#A3B1C6] w-full">
        <p className="font-classic-body text-[9px] uppercase tracking-[0.3em] mb-4">A Classic Celebration</p>
        <p className="font-classic-title italic text-sm text-[#8B7D72]">Est. {dateObj.getFullYear()}</p>
      </footer>

    </div>
  );
}
