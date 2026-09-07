import React, { useState, useEffect, useRef } from 'react';
import { Gift, MapPin, Clock, Music, Volume2, VolumeX, Mail, Camera, Heart, CalendarHeart } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function KidsClassicLayout({ content, website, colors }: BirthdayLayoutProps) {
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

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Olivia";
  const age = content?.settings_json?.birthday?.age || "One";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Smith Family";

  const story = content?.about_text || `We can't believe it's already been ${age} year! Please join us in celebrating our little one's special day with love, laughter, and sweet memories.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "You are warmly invited";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Our Home Garden";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Welcome & Refreshments", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "Cake Cutting Ceremony", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Games & Activities", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "Join us in celebrating";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#fdfbf7] p-0 overflow-hidden min-h-screen border-[12px] border-[#e8f0f3]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
          .font-serif-classic { font-family: 'Cormorant Garamond', serif; }
          .font-sans-classic { font-family: 'Montserrat', sans-serif; letter-spacing: 2px; }
          .bunting {
            background-image: 
              linear-gradient(135deg, transparent 50%, rgba(200,215,220,0.4) 50%),
              linear-gradient(225deg, transparent 50%, rgba(200,215,220,0.4) 50%);
            background-size: 40px 40px;
            background-position: 0 0, 20px 0;
            height: 20px;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
          }
          .soft-shadow {
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
          }
        `}</style>

        <div className="bunting"></div>
        <div className="bunting transform rotate-180" style={{ top: 'auto', bottom: 0 }}></div>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <span className="text-sm font-sans-classic text-[#8a9b9a] uppercase mb-8">
            {quoteText}
          </span>

          <div className="relative mb-12">
            <h1 className="text-6xl sm:text-8xl font-serif-classic text-[#4a5553] leading-none">
              {name}
            </h1>
            <div className="absolute -top-10 -right-8 text-[#e3a8b0] opacity-40">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[1px] w-12 bg-[#c8d7dc]"></div>
            <h2 className="text-2xl font-serif-classic italic text-[#788886]">
              is turning {age}
            </h2>
            <div className="h-[1px] w-12 bg-[#c8d7dc]"></div>
          </div>

          <div className="bg-white soft-shadow px-10 py-8 rounded-2xl flex flex-col items-center border border-[#f0f4f5]">
            <div className="flex flex-col items-center mb-6">
              <span className="text-[#e3a8b0] font-serif-classic text-5xl mb-1">{dayNum}</span>
              <span className="text-[#788886] font-sans-classic uppercase text-xs tracking-[0.2em]">{monthStr} {yearStr}</span>
            </div>
            <div className="w-full h-[1px] bg-[#f0f4f5] mb-6"></div>
            <div className="flex flex-col items-center">
              <Clock className="text-[#c8d7dc] mb-2" size={20} strokeWidth={1.5} />
              <span className="text-[#788886] font-sans-classic uppercase text-xs tracking-[0.1em]">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[#e8f0f3]">
            <Heart size={40} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="text-xs font-sans-classic text-[#8a9b9a] uppercase tracking-[0.2em] block mb-4 mt-8">Hosted By</span>
          <span className="text-3xl font-serif-classic text-[#4a5553]">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-[#faf8f5] overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-sm mx-auto relative">
            <div className="absolute inset-0 bg-[#e8f0f3] rounded-t-full transform translate-y-6"></div>
            <div className="relative aspect-[3/4] bg-white p-3 rounded-t-full soft-shadow border border-[#f0f4f5]">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-t-full" alt="Birthday Child" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-serif-classic text-[#4a5553] mb-8">{storyTitle}</h2>
            <div className="w-16 h-[2px] bg-[#e3a8b0] mb-8"></div>
            <p className="text-lg text-[#788886] font-sans-classic font-normal leading-[2] tracking-wide">
              {story}
            </p>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 relative">
            <span className="text-xs font-sans-classic text-[#8a9b9a] uppercase tracking-[0.2em] block mb-4">The Events</span>
            <h2 className="text-4xl sm:text-5xl font-serif-classic text-[#4a5553]">Party Itinerary</h2>
          </div>

          <div className="relative border-l-2 border-[#f0f4f5] ml-4 sm:ml-8 space-y-12 pb-8">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="relative pl-12 sm:pl-16">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#fdfbf7] border-2 border-[#e8f0f3] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#e3a8b0]"></div>
                </div>
                
                <div className="bg-[#faf8f5] p-8 rounded-2xl border border-[#f0f4f5] hover:bg-[#fdfbf7] transition-colors soft-shadow">
                  <span className="text-[#c8d7dc] font-sans-classic text-sm uppercase tracking-[0.1em] block mb-3">
                    {item.time}
                  </span>
                  <h3 className="text-2xl font-serif-classic text-[#4a5553] mb-2">{item.event}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-[#fdfbf7] border-y border-[#f0f4f5]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
           
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e8f0f3] text-[#788886] mb-8">
             <MapPin size={32} strokeWidth={1} />
           </div>
           
           <span className="text-xs font-sans-classic text-[#8a9b9a] uppercase tracking-[0.2em] block mb-4">Location</span>
           <h2 className="text-4xl font-serif-classic text-[#4a5553] mb-8">Where to find us</h2>
           
           <p className="text-xl sm:text-2xl font-serif-classic italic text-[#788886] mb-12 max-w-2xl mx-auto leading-relaxed">
             {location}
           </p>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#788886] font-sans-classic text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full border border-[#c8d7dc] hover:bg-[#e8f0f3] transition-colors soft-shadow"
            >
              View on Map
            </a>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-sans-classic text-[#8a9b9a] uppercase tracking-[0.2em] block mb-4">Memories</span>
            <h2 className="text-4xl sm:text-5xl font-serif-classic text-[#4a5553]">Gallery</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="break-inside-avoid relative rounded-xl overflow-hidden soft-shadow bg-[#faf8f5] p-2 border border-[#f0f4f5] transform hover:-translate-y-1 transition-transform">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#e8f0f3]">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <CalendarHeart className="text-[#a0bac2] mb-6" size={40} strokeWidth={1} />
          <h2 className="text-3xl sm:text-4xl font-serif-classic text-[#4a5553] mb-16">Anticipating the joy...</h2>

          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl w-28 sm:w-36 soft-shadow border border-white/60">
                <span className="text-4xl sm:text-5xl font-serif-classic text-[#4a5553] mb-2">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-sans-classic uppercase text-[#788886] tracking-[0.1em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <Gift className="text-[#e3a8b0] mx-auto mb-6" size={40} strokeWidth={1} />
          <h2 className="text-4xl font-serif-classic text-[#4a5553] mb-12">Leave a Blessing</h2>
          
          <div className="bg-[#faf8f5] p-12 rounded-3xl border border-[#f0f4f5] soft-shadow relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 rounded-full border border-[#f0f4f5]">
              <span className="text-sm font-sans-classic text-[#c8d7dc] uppercase tracking-[0.2em]">{wishCount} Received</span>
            </div>
            
            <p className="text-[#788886] font-serif-classic italic text-xl mb-10 mt-6">
              "Every wish is a precious gift."
            </p>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-[#4a5553] hover:bg-[#3a4442] text-white px-10 py-4 rounded-full font-sans-classic text-xs uppercase tracking-[0.2em] transition-colors soft-shadow w-full sm:w-auto"
            >
              Send Your Love
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 px-6 sm:px-12 relative z-10 bg-[#fdfbf7] border-t border-[#f0f4f5]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <Mail className="text-[#c8d7dc] mx-auto mb-6" size={40} strokeWidth={1} />
            <h2 className="text-4xl sm:text-5xl font-serif-classic text-[#4a5553] mb-4">Kindly Reply</h2>
            <p className="text-[#788886] font-sans-classic text-sm uppercase tracking-[0.1em]">We look forward to celebrating with you</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-[2rem] border border-[#f0f4f5] soft-shadow">
            <form className="space-y-8 font-sans-classic text-sm" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[#8a9b9a] uppercase tracking-[0.1em] text-xs mb-3 ml-2">Guest Name(s)</label>
                <input type="text" className="w-full bg-transparent border-b-2 border-[#e8f0f3] px-2 py-3 outline-none focus:border-[#c8d7dc] transition-colors text-[#4a5553]" placeholder="Enter your name" />
              </div>

              <div>
                <label className="block text-[#8a9b9a] uppercase tracking-[0.1em] text-xs mb-3 ml-2">Message or Dietary Needs</label>
                <textarea rows={3} className="w-full bg-transparent border-b-2 border-[#e8f0f3] px-2 py-3 outline-none focus:border-[#c8d7dc] transition-colors text-[#4a5553] resize-none" placeholder="Write a note..."></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border border-[#e8f0f3] rounded-xl hover:border-[#c8d7dc] hover:bg-[#faf8f5] transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#4a5553]" />
                    <span className="text-[#4a5553] tracking-widest text-xs uppercase">Joyfully Accept</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border border-[#e8f0f3] rounded-xl hover:border-[#c8d7dc] hover:bg-[#faf8f5] transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#4a5553]" />
                    <span className="text-[#4a5553] tracking-widest text-xs uppercase">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="bg-[#e3a8b0] hover:bg-[#d69ba2] text-white font-sans-classic tracking-[0.2em] uppercase text-xs px-12 py-5 rounded-full transition-colors soft-shadow w-full sm:w-auto">
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
    <div className={`min-h-screen bg-white relative text-[#4a5553] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Elegant Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-white/80 backdrop-blur-md border border-[#f0f4f5] rounded-full flex items-center justify-center text-[#788886] hover:bg-[#fdfbf7] transition-all soft-shadow"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
        </button>
      )}

      {/* Classic Envelope Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1200ms] ease-out bg-[#e8f0f3] ${isOpened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'} cursor-pointer selection:bg-transparent`}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#a0bac2 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700 ${isOpening ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
           
           <div className="bg-white p-12 rounded-t-[4rem] rounded-b-3xl soft-shadow border border-[#f0f4f5] flex flex-col items-center max-w-[85vw] relative">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#f0f4f5] rounded-full"></div>
             
             <div className="w-20 h-20 bg-[#faf8f5] rounded-full flex items-center justify-center mb-8 border border-[#e8f0f3]">
               <Gift className="text-[#e3a8b0]" size={32} strokeWidth={1} />
             </div>
             
             <span className="text-[#8a9b9a] font-sans-classic text-xs uppercase tracking-[0.2em] mb-4">You are invited</span>
             
             <h1 className="text-4xl sm:text-5xl font-serif-classic text-[#4a5553] text-center mb-10">
               {name}'s<br/><span className="italic text-[#788886]">Birthday</span>
             </h1>
             
             <div className="bg-[#4a5553] text-white font-sans-classic text-[10px] uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:bg-[#3a4442] transition-colors">
               Tap to Open
             </div>
           </div>
           
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center bg-white text-[#a0bac2] w-full border-t border-[#f0f4f5]">
        <span className="text-[10px] font-sans-classic uppercase tracking-[0.3em]">Celebrated with ❤️ for {name}</span>
      </footer>

    </div>
  );
}
