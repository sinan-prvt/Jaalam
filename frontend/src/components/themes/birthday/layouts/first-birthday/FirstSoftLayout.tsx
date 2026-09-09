import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Volume2, VolumeX, Mail, CalendarDays, Clock, Heart, Sparkles } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';
import GiftBoxAnimation from '../../../../ui/GiftBoxAnimation';

export default function FirstSoftLayout({ content }: BirthdayLayoutProps) {
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
    triggerConfettiPopper(); // keeping for celebration, maybe style later
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 2000);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Emma";
  const age = content?.settings_json?.birthday?.age || "One";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Miller Family";

  const story = content?.about_text || `A year of tiny yawns, sweet smiles, and endless love. Please join us as we celebrate our beautiful little one's very first birthday in a gentle, warm gathering.`;
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
      { time: "2:00 PM", event: "Welcome & Soft Music", date: rawDateStr, venue: location },
      { time: "3:00 PM", event: "Sweet Cake Cutting", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Gentle Goodbyes", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const _venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "A beautiful year";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAFAF8] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Raleway:wght@300;400;500&display=swap');
          .font-soft-title { font-family: 'Playfair Display', serif; font-weight: 400; }
          .font-soft-body { font-family: 'Raleway', sans-serif; font-weight: 300; letter-spacing: 2px; }
          
          @keyframes soft-pulse {
            0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.4; }
            50% { transform: scale(1.1) translate(20px, -20px); opacity: 0.6; }
          }
          @keyframes soft-pulse-alt {
            0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
            50% { transform: scale(1.05) translate(-20px, 20px); opacity: 0.5; }
          }
          
          .blob-1 { animation: soft-pulse 15s ease-in-out infinite alternate; }
          .blob-2 { animation: soft-pulse-alt 18s ease-in-out infinite alternate; }
          .blob-3 { animation: soft-pulse 20s ease-in-out infinite alternate-reverse; }
          
          .glass-panel {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 8px 32px 0 rgba(143, 150, 163, 0.05);
          }
        `}</style>

        {/* Ethereal Watercolor Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E9D5CA] blur-[120px] blob-1 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#D6E4E5] blur-[150px] blob-2 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#F6E6D8] blur-[100px] blob-3 mix-blend-multiply pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <div className="font-soft-body uppercase text-[10px] text-[#8C8279] tracking-[0.3em] mb-12 relative">
            <span className="relative z-10">{quoteText}</span>
            <div className="absolute top-1/2 left-[-30px] w-5 h-[1px] bg-[#D1C8C1]"></div>
            <div className="absolute top-1/2 right-[-30px] w-5 h-[1px] bg-[#D1C8C1]"></div>
          </div>

          <div className="relative mb-8 text-center">
            <h1 className="text-7xl sm:text-9xl font-soft-title text-[#5C554F] italic mb-4">
              {name}
            </h1>
            <p className="font-soft-body text-sm sm:text-base text-[#8C8279] tracking-widest lowercase">
              is turning {age}
            </p>
          </div>

          <div className="glass-panel px-10 py-8 rounded-full flex flex-row items-center gap-12 mt-12">
            <div className="flex flex-col items-center">
              <span className="text-[#A2AAB0] font-soft-title text-4xl mb-1">{dayNum}</span>
              <span className="text-[#8C8279] font-soft-body uppercase text-[10px] tracking-widest">{monthStr}</span>
            </div>
            <div className="w-[1px] h-12 bg-[#D1C8C1] opacity-50"></div>
            <div className="flex flex-col items-center">
              <Clock className="text-[#D6B5A7] mb-2" size={24} strokeWidth={1} />
              <span className="text-[#8C8279] font-soft-body uppercase text-[10px] tracking-widest">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <Heart size={20} className="text-[#D6B5A7] mx-auto mb-6" strokeWidth={1} />
          <span className="text-[10px] font-soft-body text-[#8C8279] uppercase tracking-[0.3em] block mb-4">Hosted tenderly by</span>
          <span className="text-3xl font-soft-title text-[#5C554F] italic">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-32 px-6 sm:px-12 relative z-10 bg-white overflow-hidden">
        
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E9D5CA] to-transparent opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D6E4E5] to-transparent opacity-30"></div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-sm mx-auto relative group">
            <div className="absolute -inset-4 bg-[#F6E6D8] rounded-[2rem] opacity-30 blur-2xl transition-opacity duration-700 group-hover:opacity-50"></div>
            <div className="relative aspect-[3/4] bg-transparent p-2 rounded-t-full rounded-b-md border border-[#F0EBE6]">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-t-full rounded-b-sm" alt="Birthday Baby" style={{ filter: 'brightness(1.05) contrast(0.95)' }} />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-soft-title text-[#5C554F] italic mb-10">
              {storyTitle}
            </h2>
            <div className="glass-panel p-10 rounded-2xl relative">
              <Sparkles className="absolute -top-3 -left-3 text-[#D6E4E5]" size={24} strokeWidth={1} />
              <p className="text-sm sm:text-base text-[#7A7169] font-soft-body leading-[2.5] font-light">
                {story}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-24 relative">
            <span className="font-soft-body text-[10px] text-[#8C8279] uppercase tracking-[0.3em] block mb-4">The Flow of the Day</span>
            <h2 className="text-4xl sm:text-5xl font-soft-title text-[#5C554F] italic">Gathering Moments</h2>
          </div>

          <div className="relative border-l border-[#E6DFD9] ml-4 sm:ml-8 space-y-16 pb-8">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => {
              return (
              <div key={idx} className="relative pl-12 sm:pl-16 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border border-[#D6B5A7] flex items-center justify-center transition-transform duration-500 group-hover:scale-125">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E9D5CA]"></div>
                </div>
                
                <div className="glass-panel p-8 rounded-2xl transition-all duration-500 hover:bg-white/60 hover:shadow-[0_10px_40px_-10px_rgba(214,228,229,0.4)]">
                  <span className="text-[#A2AAB0] font-soft-body text-[10px] uppercase tracking-widest block mb-4">
                    {item.time}
                  </span>
                  <h3 className="text-2xl font-soft-title text-[#5C554F] font-light">{item.event}</h3>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#F6E6D8] blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="max-w-2xl mx-auto text-center relative z-10 glass-panel p-16 rounded-full aspect-square flex flex-col items-center justify-center border border-[#F0EBE6]">
           
           <MapPin size={32} strokeWidth={0.5} className="text-[#A2AAB0] mb-8" />
           <span className="text-[10px] font-soft-body text-[#8C8279] uppercase tracking-[0.3em] block mb-4">Join Us At</span>
           
           <h2 className="text-3xl sm:text-4xl font-soft-title text-[#5C554F] italic mb-10 px-4 leading-relaxed">
             {location}
           </h2>

          {mapUrl && (
            <div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent text-[#8C8279] font-soft-body text-[10px] uppercase tracking-[0.2em] px-8 py-3 rounded-full border border-[#D1C8C1] hover:bg-[#FAFAF8] transition-colors"
              >
                View Map
              </a>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-soft-title text-[#5C554F] italic">Precious Memories</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => {
              return (
              <div key={index} className={`break-inside-avoid relative rounded-sm overflow-hidden p-3 bg-white shadow-sm border border-[#F0EBE6] group`}>
                <div className="overflow-hidden rounded-sm">
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover transform transition-transform duration-[20s] group-hover:scale-110" style={{ filter: 'brightness(1.05) contrast(0.95)' }} />
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-white overflow-hidden">
        <div className="absolute top-0 right-[10%] w-[400px] h-[400px] rounded-full bg-[#D6E4E5] blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full bg-[#E9D5CA] blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <CalendarDays size={24} strokeWidth={1} className="text-[#D6B5A7] mb-8" />
          <h2 className="text-4xl font-soft-title text-[#5C554F] italic mb-20">Anticipating the day...</h2>

          <div className="flex flex-wrap gap-8 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center glass-panel p-8 rounded-full aspect-square w-32 sm:w-40 justify-center">
                <span className="text-4xl sm:text-5xl font-soft-title text-[#8C8279] mb-2 font-light">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-soft-body uppercase text-[#A2AAB0] tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          
          <h2 className="text-4xl font-soft-title text-[#5C554F] italic mb-16">A Note of Love</h2>
          
          <div className="glass-panel p-16 rounded-[2rem] border border-[#F0EBE6] relative text-center flex flex-col items-center">
            
            <p className="text-sm font-soft-body text-[#8C8279] leading-loose mb-12 font-light">
              &quot;Your love and presence are the most beautiful gifts we could ask for.&quot;
            </p>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-[#E6DFD9]"></div>
              <span className="text-4xl font-soft-title text-[#D6B5A7]">{wishCount}</span>
              <div className="w-12 h-[1px] bg-[#E6DFD9]"></div>
            </div>
            
            <span className="text-[#A2AAB0] font-soft-body uppercase tracking-[0.2em] text-[9px] mb-12">Wishes Received</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="bg-transparent text-[#8C8279] px-10 py-4 rounded-full font-soft-body text-[10px] uppercase tracking-[0.2em] border border-[#D1C8C1] hover:bg-white hover:border-transparent hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 w-full sm:w-auto"
            >
              Leave a Message
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Mail size={24} strokeWidth={1} className="text-[#A2AAB0] mx-auto mb-8" />
            <h2 className="text-4xl font-soft-title text-[#5C554F] italic mb-6">RSVP</h2>
            <p className="text-[#8C8279] font-soft-body text-[10px] uppercase tracking-widest">Kindly respond</p>
          </div>

          <div className="glass-panel p-10 sm:p-16 rounded-[2rem] border border-[#F0EBE6]">
            <form className="space-y-12 font-soft-body" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input type="text" className="w-full bg-transparent border-b border-[#E6DFD9] pb-4 outline-none focus:border-[#D6B5A7] transition-colors text-sm text-[#5C554F] placeholder-[#C2BCB6]" placeholder="Name(s) of Guest(s)" />
              </div>

              <div>
                <textarea rows={2} className="w-full bg-transparent border-b border-[#E6DFD9] pb-4 outline-none focus:border-[#D6B5A7] transition-colors text-sm text-[#5C554F] placeholder-[#C2BCB6] resize-none" placeholder="A brief note or dietary requests..."></textarea>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-8">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border border-[#E6DFD9] rounded-xl bg-transparent hover:bg-[#FAFAF8] transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#D6B5A7]" />
                    <span className="text-xs text-[#7A7169] tracking-wider">Joyfully Accept</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border border-[#E6DFD9] rounded-xl bg-transparent hover:bg-[#FAFAF8] transition-colors flex-1 group">
                    <input type="radio" name="attending" className="w-4 h-4 accent-[#A2AAB0]" />
                    <span className="text-xs text-[#7A7169] tracking-wider">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-12 text-center">
                <button type="button" className="bg-[#5C554F] hover:bg-[#4A443F] text-white font-soft-body text-[10px] uppercase tracking-[0.3em] py-5 px-16 rounded-full transition-colors">
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-white relative text-[#7A7169] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Elegant Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-12 h-12 glass-panel border border-[#F0EBE6] rounded-full flex items-center justify-center text-[#A2AAB0] hover:bg-white/60 transition-colors"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
        </button>
      )}

      {/* Gentle Fade Entrance */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[2500ms] ease-in-out bg-[#FAFAF8] ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} selection:bg-transparent`}
      >
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#E9D5CA] blur-[150px] opacity-40 blob-1 pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#D6E4E5] blur-[150px] opacity-40 blob-2 pointer-events-none"></div>

        <div className={`relative z-30 transition-all duration-[2000ms] ease-out ${isOpening ? 'scale-110 filter blur-sm' : 'scale-100 filter-none'}`}>
          <GiftBoxAnimation 
            onOpen={handleOpen} 
            title={`${name}'s 1st Birthday`} 
            subtitle="Tap gently to open"
            boxColor="#F6E6D8"
            ribbonColor="#D6B5A7"
          />
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      <footer className="py-20 relative z-10 text-center bg-[#FAFAF8] text-[#C2BCB6] w-full">
        <span className="text-[9px] font-soft-body uppercase tracking-[0.4em]">Lovingly celebrated for {name}</span>
      </footer>

    </div>
  );
}
