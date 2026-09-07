import React, { useState, useEffect, useRef } from 'react';
import { Gift, MapPin, Clock, Music, Volume2, VolumeX, Cloud, Star, Heart, Camera, PartyPopper } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function FirstPlayfulLayout({ content, website, colors }: BirthdayLayoutProps) {
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
    }, 1800);
  };

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Leo";
  const age = content?.settings_json?.birthday?.age || "One";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "Sarah & John";

  const story = content?.about_text || `Our little miracle is already turning ONE! It's been a year full of firsts, smiles, and so much love. We can't wait to celebrate this special milestone with you.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "Oh Baby!";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "Our Little Home";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Welcome & Cuddles", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "Smash Cake Time!", date: rawDateStr, venue: location },
      { time: "4:00 PM", event: "Play & Unwind", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.birthday?.venuePhoto || content?.venue?.image || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "A year of joy!";

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
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FFF8F0] p-0 overflow-hidden min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800&display=swap');
          .font-baby-title { font-family: 'Baloo 2', cursive; line-height: 1.1; }
          .font-baby-body { font-family: 'Nunito', sans-serif; }
          
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes slow-drift {
            0%, 100% { transform: translateX(0) scale(1); }
            50% { transform: translateX(20px) scale(1.05); }
          }
          .animate-gentle { animation: gentle-float 4s ease-in-out infinite; }
          .animate-drift { animation: slow-drift 8s ease-in-out infinite; }
          
          .soft-cloud-shadow {
            box-shadow: 0 10px 30px -5px rgba(255, 182, 193, 0.2);
          }
        `}</style>

        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#FFB6C1 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

        {/* Soft Background Clouds & Shapes */}
        <div className="absolute top-[10%] left-[5%] text-[#FFDAB9] animate-gentle opacity-60">
          <Cloud size={100} fill="currentColor" strokeWidth={0} />
        </div>
        <div className="absolute top-[20%] right-[10%] text-[#E6E6FA] animate-drift opacity-60">
          <Cloud size={140} fill="currentColor" strokeWidth={0} />
        </div>
        <div className="absolute bottom-[15%] left-[15%] text-[#B0E0E6] animate-gentle opacity-60" style={{ animationDelay: '1s' }}>
          <Cloud size={120} fill="currentColor" strokeWidth={0} />
        </div>
        
        <div className="absolute top-[15%] right-[25%] text-[#FFD700] animate-drift opacity-40">
          <Star size={40} fill="currentColor" strokeWidth={0} />
        </div>
        <div className="absolute bottom-[25%] right-[15%] text-[#FFB6C1] animate-gentle opacity-40">
          <Heart size={50} fill="currentColor" strokeWidth={0} />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <div className="bg-white/80 backdrop-blur-sm text-[#FFB6C1] font-baby-body font-bold uppercase tracking-widest text-xs px-6 py-2 rounded-full mb-8 shadow-sm">
            {quoteText}
          </div>

          <div className="relative mb-6">
            <h1 className="text-6xl sm:text-8xl font-baby-title text-[#7B8B9A] drop-shadow-sm">
              {name}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 mb-16 relative">
            <div className="absolute -inset-10 bg-[#FFB6C1] blur-[60px] opacity-20 -z-10 rounded-full"></div>
            <h2 className="text-3xl sm:text-5xl font-baby-title text-[#FFB6C1]">
              is turning {age}!
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] flex flex-col sm:flex-row items-center gap-8 soft-cloud-shadow border-4 border-white">
            <div className="flex flex-col items-center">
              <span className="text-[#B0E0E6] font-baby-title text-5xl mb-1">{dayNum}</span>
              <span className="text-[#9A9A9A] font-baby-body font-bold uppercase text-xs tracking-wider">{monthStr} {yearStr}</span>
            </div>
            <div className="hidden sm:block w-1.5 h-16 bg-[#FFF8F0] rounded-full"></div>
            <div className="flex flex-col items-center">
              <Clock className="text-[#FFDAB9] mb-2" size={32} strokeWidth={2.5} />
              <span className="text-[#9A9A9A] font-baby-body font-bold uppercase text-xs tracking-wider">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto text-center relative z-10 bg-[#FFF8F0] p-10 rounded-[3rem] soft-cloud-shadow border-4 border-white">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FFB6C1] rounded-full flex items-center justify-center border-4 border-white text-white">
            <Heart size={24} fill="currentColor" />
          </div>
          <span className="text-xs font-baby-body font-bold text-[#A8A8A8] uppercase tracking-widest block mb-3 mt-4">Hosted with love by</span>
          <span className="text-3xl sm:text-4xl font-baby-title text-[#7B8B9A]">{parentsName}</span>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-6 sm:px-12 relative z-10 bg-[#F0F8FF] overflow-hidden">
        
        <div className="absolute -top-20 -right-20 text-[#E6E6FA] opacity-50">
          <Cloud size={300} fill="currentColor" strokeWidth={0} />
        </div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center relative z-10">
          
          <div className="flex-1 w-full max-w-sm mx-auto relative group">
            <div className="absolute inset-0 bg-[#FFDAB9] rounded-full transform translate-x-4 translate-y-4 opacity-50"></div>
            <div className="relative aspect-square bg-white p-3 rounded-full soft-cloud-shadow border-4 border-white">
              <img src={mainPhoto} className="w-full h-full object-cover rounded-full" alt="Birthday Baby" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl sm:text-6xl font-baby-title text-[#7B8B9A] mb-8 relative">
              {storyTitle}
              <Star className="absolute -top-4 -right-8 text-[#FFD700] opacity-60 animate-spin" style={{ animationDuration: '6s' }} size={30} fill="currentColor" strokeWidth={0} />
            </h2>
            <div className="bg-white/80 p-8 rounded-[2rem] soft-cloud-shadow border-2 border-white">
              <p className="text-lg sm:text-xl text-[#788886] font-baby-body font-semibold leading-relaxed">
                {story}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl sm:text-6xl font-baby-title text-[#FFB6C1]">Party Schedule</h2>
            <p className="text-[#9A9A9A] font-baby-body font-bold mt-4 tracking-widest uppercase text-sm">A day of fun</p>
          </div>

          <div className="space-y-6">
            {schedule.map((item: any, idx: number) => {
              const bgColors = ['bg-[#FFF8F0]', 'bg-[#F0F8FF]', 'bg-[#F5FFFA]'];
              const iconColors = ['text-[#FFDAB9]', 'text-[#B0E0E6]', 'text-[#98FB98]'];
              
              return (
              <div key={idx} className={`${bgColors[idx % 3]} p-6 sm:p-8 rounded-[2rem] border-4 border-white soft-cloud-shadow flex flex-col sm:flex-row items-center gap-6 transform hover:-translate-y-1 transition-transform`}>
                <div className="bg-white text-[#7B8B9A] font-baby-title text-2xl px-6 py-3 rounded-full border-2 border-[#F0F0F0] whitespace-nowrap">
                  {item.time}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-baby-title text-[#7B8B9A]">{item.event}</h3>
                </div>
                <PartyPopper className={`${iconColors[idx % 3]} opacity-80`} size={40} />
              </div>
            )})}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 px-6 sm:px-12 relative z-10 bg-[#FFF8F0]">
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-white p-10 sm:p-16 rounded-[3rem] soft-cloud-shadow border-4 border-white">
           
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#E6E6FA] text-white mb-8 border-4 border-white soft-cloud-shadow">
             <MapPin size={40} fill="currentColor" strokeWidth={1} />
           </div>

           <h2 className="text-4xl sm:text-6xl font-baby-title text-[#7B8B9A] mb-8">Where to find us</h2>
           
           <p className="text-2xl sm:text-3xl font-baby-title text-[#FFB6C1] mb-10 px-4">
             {location}
           </p>

          {mapUrl && (
            <div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#B0E0E6] text-white font-baby-body font-bold text-sm uppercase tracking-widest px-10 py-5 rounded-full hover:bg-[#96d1da] transition-colors soft-cloud-shadow"
              >
                Get Directions
              </a>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-baby-title text-[#B0E0E6]">Cute Moments</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {validGallery.map((url: string, index: number) => {
              const borderColors = ['border-[#FFB6C1]', 'border-[#FFDAB9]', 'border-[#B0E0E6]', 'border-[#E6E6FA]'];
              const b = borderColors[index % borderColors.length];
              
              return (
              <div key={index} className={`break-inside-avoid relative rounded-[2rem] overflow-hidden border-8 border-white bg-[#F9F9F9] soft-cloud-shadow transform hover:scale-[1.02] transition-transform duration-300`}>
                <div className={`p-2 border-4 ${b} rounded-xl m-2`}>
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover rounded-lg" />
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 px-6 sm:px-12 relative z-10 bg-[#F5FFFA]">
        <div className="absolute top-[10%] right-[10%] text-[#E6E6FA] opacity-40 animate-gentle">
          <Cloud size={150} fill="currentColor" strokeWidth={0} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <h2 className="text-4xl sm:text-5xl font-baby-title text-[#98FB98] mb-16">Almost time for Cake!</h2>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0, color: 'text-[#FFB6C1]' },
              { label: 'Hours', value: timeLeft?.h ?? 0, color: 'text-[#B0E0E6]' },
              { label: 'Mins', value: timeLeft?.m ?? 0, color: 'text-[#FFDAB9]' },
              { label: 'Secs', value: timeLeft?.s ?? 0, color: 'text-[#E6E6FA]' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-[2rem] soft-cloud-shadow border-4 border-white w-28 sm:w-36">
                <span className={`text-5xl sm:text-6xl font-baby-title ${item.color} mb-2`}>
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-baby-body font-bold uppercase text-[#A8A8A8] tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 px-6 sm:px-12 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          
          <h2 className="text-4xl sm:text-6xl font-baby-title text-[#FFB6C1] mb-10">Sweet Wishes</h2>
          
          <div className="bg-[#FFF8F0] p-12 rounded-[3rem] border-4 border-white soft-cloud-shadow relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-[#FFB6C1] rounded-full p-4 soft-cloud-shadow border-4 border-white">
              <Heart size={40} fill="currentColor" strokeWidth={0} />
            </div>
            
            <span className="text-7xl font-baby-title text-[#7B8B9A] block mb-2 mt-6">{wishCount}</span>
            <span className="text-[#A8A8A8] font-baby-body font-bold uppercase tracking-widest text-sm">Wishes Received</span>
            
            <button 
              onClick={() => { setWishCount(prev => prev + 1); triggerConfettiPopper(); }}
              className="mt-10 bg-[#FFB6C1] hover:bg-[#ff9eaa] text-white px-10 py-5 rounded-full font-baby-body font-bold text-sm uppercase tracking-widest soft-cloud-shadow transition-colors w-full sm:w-auto border-2 border-white"
            >
              Send a Sweet Wish
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 px-6 sm:px-12 relative z-10 bg-[#F0F8FF]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-baby-title text-[#7B8B9A] mb-4">Are you coming?</h2>
            <p className="text-[#9A9A9A] font-baby-body font-bold text-lg">We would love to see you there!</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-[3rem] border-4 border-white soft-cloud-shadow">
            <form className="space-y-8 font-baby-body font-bold text-[#7B8B9A]" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2 ml-4">Who is coming?</label>
                <input type="text" className="w-full bg-[#F9F9F9] border-2 border-[#F0F0F0] rounded-full px-6 py-4 outline-none focus:border-[#B0E0E6] transition-colors text-lg" placeholder="Enter name(s)" />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider mb-2 ml-4">Message / Allergies?</label>
                <textarea rows={3} className="w-full bg-[#F9F9F9] border-2 border-[#F0F0F0] rounded-3xl px-6 py-4 outline-none focus:border-[#B0E0E6] transition-colors text-lg resize-none" placeholder="Any special notes?"></textarea>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border-2 border-[#F0F0F0] rounded-2xl bg-[#F9F9F9] hover:border-[#B0E0E6] transition-colors flex-1">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#B0E0E6]" />
                    <span className="text-lg">Yes, we'll be there!</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 cursor-pointer p-5 border-2 border-[#F0F0F0] rounded-2xl bg-[#F9F9F9] hover:border-[#FFB6C1] transition-colors flex-1">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#FFB6C1]" />
                    <span className="text-lg">Sorry, can't make it</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full bg-[#B0E0E6] hover:bg-[#96d1da] text-white font-baby-body font-bold text-sm uppercase tracking-widest py-6 rounded-full soft-cloud-shadow transition-colors border-2 border-white">
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
    <div className={`min-h-screen bg-white relative text-[#7B8B9A] flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {/* Soft Music Toggle Button */}
      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-white/90 backdrop-blur-sm border-4 border-white rounded-full flex items-center justify-center text-[#B0E0E6] hover:bg-[#F9F9F9] transition-transform soft-cloud-shadow"
        >
          {isMuted ? <VolumeX size={24} strokeWidth={2.5} /> : <Volume2 size={24} strokeWidth={2.5} />}
        </button>
      )}

      {/* Gentle Cloud Entrance */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1500ms] ease-in-out bg-[#FFF8F0] ${isOpened ? 'opacity-0 pointer-events-none scale-110 blur-md' : 'opacity-100 scale-100'} cursor-pointer selection:bg-transparent`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#FFB6C1 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

        <div className={`relative z-30 flex flex-col items-center justify-center transition-all duration-[1000ms] ${isOpening ? 'scale-75 opacity-0 -translate-y-10' : 'scale-100 opacity-100 translate-y-0'}`}>
           
           <div className="bg-white/90 backdrop-blur-sm p-12 sm:p-16 rounded-[4rem] border-8 border-white soft-cloud-shadow flex flex-col items-center max-w-[85vw] relative z-10 text-center animate-gentle">
             
             <div className="absolute -top-12 text-[#FFB6C1]">
               <Cloud size={100} fill="currentColor" strokeWidth={0} />
               <Heart size={30} fill="white" strokeWidth={0} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             
             <h1 className="text-5xl sm:text-7xl font-baby-title text-[#7B8B9A] mt-8 mb-4">
               {name} is 1!
             </h1>
             <p className="text-[#A8A8A8] font-baby-body font-bold text-sm uppercase tracking-widest mb-8">
               A year of magic
             </p>
             
             <div className="bg-[#B0E0E6] text-white font-baby-body font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-sm hover:bg-[#96d1da] transition-colors">
               Tap to open
             </div>
           </div>
           
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center bg-white text-[#D0D0D0] w-full border-t border-[#F0F0F0]">
        <span className="text-xs font-baby-body font-bold uppercase tracking-widest">Celebrated with ❤️ for {name}</span>
      </footer>

    </div>
  );
}
