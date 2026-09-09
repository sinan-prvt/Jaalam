import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Volume2, VolumeX, Mail, Flower2, Leaf } from 'lucide-react';
import type { BirthdayLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function FirstFloralLayout({ content }: BirthdayLayoutProps) {
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

  const name = content?.hero_title || content?.settings_json?.birthday?.name || "Lily";
  const parentsName = content?.settings_json?.birthday?.parentsName || content?.parents_names || "The Evans Family";

  const story = content?.about_text || `Our little flower is blooming! It has been a beautiful year watching her grow. Please join us for an afternoon in the garden to celebrate her first birthday.`;
  const storyTitle = content?.about_title || content?.settings_json?.birthday?.story_title || "Our Little Blossom";

  const rawDateStr = content?.settings_json?.birthday?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.birthday?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'October');
  const dayNum = content?.settings_json?.birthday?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const yearStr = content?.settings_json?.birthday?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.birthday?.time || content?.time || '2:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.birthday?.venue || "The Botanical Gardens";

  const rawSchedule = content?.settings_json?.birthday?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "2:00 PM", event: "Garden Welcome", date: rawDateStr, venue: location },
      { time: "3:30 PM", event: "Cake & Petals", date: rawDateStr, venue: location },
      { time: "4:30 PM", event: "Farewell Blooms", date: rawDateStr, venue: location }
    ];

  const mainPhoto = content?.settings_json?.birthday?.mainPhoto || content?.hero?.image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80";
  const mapUrl = content?.settings_json?.birthday?.mapUrl || content?.venue?.mapUrl || "";

  const gallery = content?.settings_json?.birthday?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.birthday?.countdownDate || "2026-10-10T14:00";
  const musicUrl = content?.settings_json?.birthday?.musicUrl || content?.music_url || "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-122430.mp3";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.birthday?.quote || "Blooming beautifully.";

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
    { id: 'about', label: 'Details', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Location', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  const sections = content?.settings_json?.birthday?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FAF9F6] p-0 overflow-hidden min-h-screen border-b-8 border-[#8F9779]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Italianno&family=Montserrat:wght@300;400;500&display=swap');
          .font-floral-title { font-family: 'Italianno', cursive; }
          .font-floral-body { font-family: 'Montserrat', sans-serif; letter-spacing: 0.1em; }
          
          .floral-mask {
            mask-image: radial-gradient(circle, white 40%, transparent 70%);
            -webkit-mask-image: radial-gradient(circle, white 40%, transparent 70%);
          }
          
          .organic-blob {
            border-radius: 43% 57% 70% 30% / 30% 41% 59% 70%;
            animation: blobBounce 8s ease-in-out infinite alternate;
          }
          @keyframes blobBounce {
            0% { border-radius: 43% 57% 70% 30% / 30% 41% 59% 70%; transform: rotate(0deg); }
            100% { border-radius: 56% 44% 33% 67% / 60% 50% 50% 40%; transform: rotate(3deg); }
          }
        `}</style>

        {/* Watercolor Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-[#DDA7A5] opacity-10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#8F9779] opacity-15 rounded-full blur-[100px]"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          
          <div className="mb-8">
            <span className="font-floral-body text-[10px] uppercase tracking-[0.3em] text-[#8F9779] border-b border-[#DDA7A5] pb-2">
              {quoteText}
            </span>
          </div>

          <div className="relative mb-16 w-full flex flex-col items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center pointer-events-none opacity-20">
               <Flower2 size={400} strokeWidth={0.5} className="text-[#8F9779] animate-spin-slow" style={{ animationDuration: '40s' }} />
            </div>
            
            <h1 className="text-8xl sm:text-[10rem] font-floral-title text-[#2F3E2C] leading-[0.8] mb-2 relative z-10 drop-shadow-sm">
              {name}
            </h1>
            <p className="font-floral-body text-[#DDA7A5] text-sm uppercase tracking-[0.4em] relative z-10 mt-6">
              is turning one
            </p>
          </div>

          <div className="w-[70vw] max-w-[400px] aspect-[3/4] relative mb-16 organic-blob overflow-hidden shadow-2xl p-2 bg-white/50 backdrop-blur-sm">
             <div className="w-full h-full organic-blob overflow-hidden">
               <img src={mainPhoto} alt={name} className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s]" />
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-16 text-[#2F3E2C] bg-white/40 backdrop-blur-md px-12 py-6 rounded-full border border-[#8F9779]/20 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="font-floral-body text-[10px] uppercase text-[#8F9779] mb-1">Date</span>
              <span className="font-floral-body text-sm font-medium">{monthStr} {dayNum}</span>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-[#DDA7A5] opacity-50"></div>
            <div className="flex flex-col items-center">
              <span className="font-floral-body text-[10px] uppercase text-[#8F9779] mb-1">Time</span>
              <span className="font-floral-body text-sm font-medium">{timeStr}</span>
            </div>
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF] overflow-hidden">
        <Leaf size={200} strokeWidth={0.5} className="absolute -left-16 top-10 text-[#8F9779] opacity-[0.03] -rotate-45" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Flower2 size={32} strokeWidth={1} className="text-[#DDA7A5] mx-auto mb-8 animate-pulse" />
          <span className="text-[10px] font-floral-body text-[#8F9779] uppercase tracking-[0.3em] block mb-6">With Love</span>
          
          <h2 className="text-6xl sm:text-7xl font-floral-title text-[#2F3E2C] mb-8 leading-tight">{storyTitle}</h2>
          <p className="text-[#5A6C56] text-lg sm:text-xl font-floral-body font-light leading-loose mb-12">
            {story}
          </p>
          
          <div className="inline-block border-t border-b border-[#DDA7A5]/30 py-4 px-12">
            <span className="font-floral-body text-[9px] text-[#8F9779] uppercase tracking-[0.3em] block mb-2">Hosted by</span>
            <span className="text-xl font-floral-title text-[#2F3E2C]">{parentsName}</span>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-6xl sm:text-7xl font-floral-title text-[#2F3E2C] mb-4">The Garden Party</h2>
            <div className="w-24 h-[1px] bg-[#8F9779] mx-auto opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schedule.map((item: { time: string; event: string; venue?: string }, idx: number) => {
              return (
              <div key={idx} className="bg-white p-10 rounded-t-full text-center shadow-[0_10px_40px_-15px_rgba(143,151,121,0.2)] border border-[#8F9779]/10 group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 mx-auto bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6 text-[#DDA7A5] border border-[#DDA7A5]/20 group-hover:bg-[#DDA7A5] group-hover:text-white transition-colors">
                  <Leaf size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[#8F9779] font-floral-body text-[10px] font-medium uppercase tracking-[0.2em] block mb-4">
                  {item.time}
                </span>
                <h3 className="text-3xl font-floral-title text-[#2F3E2C]">{item.event}</h3>
              </div>
            )})}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 w-full relative">
             <div className="absolute inset-0 bg-[#8F9779] rounded-t-full transform translate-x-4 translate-y-4 opacity-10"></div>
             <div className="w-full aspect-square rounded-t-full overflow-hidden bg-[#FAF9F6] p-4 relative z-10 border border-[#8F9779]/20">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '9999px 9999px 0 0' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-t-full">
                  <MapPin size={40} strokeWidth={1} className="text-[#DDA7A5] mb-4" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <Flower2 size={40} strokeWidth={0.5} className="text-[#8F9779] mx-auto lg:mx-0 mb-8 opacity-50" />
            <h2 className="text-6xl sm:text-7xl font-floral-title text-[#2F3E2C] mb-8 leading-none">
              Where the <br/>flowers bloom
            </h2>
            <p className="text-xl font-floral-body font-light text-[#5A6C56] mb-12">
              {location}
            </p>
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#8F9779] text-white font-floral-body text-[10px] uppercase tracking-[0.3em] px-10 py-5 hover:bg-[#7a8266] transition-colors rounded-full shadow-lg shadow-[#8F9779]/20"
              >
                Find the Garden
              </a>
            )}
          </div>
        </div>
      </section>
    ),
    countdown: (
      <section key="countdown" className="py-32 px-6 sm:px-12 relative z-10 bg-[#8F9779] text-[#FAF9F6] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Flower2 size={500} strokeWidth={0.5} className="absolute -right-40 -bottom-40 text-white" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <span className="font-floral-body text-[10px] uppercase tracking-[0.4em] mb-6 text-[#E8EAE3]">Anticipation</span>
          <h2 className="text-5xl sm:text-7xl font-floral-title text-white mb-16">Waiting to blossom...</h2>

          <div className="flex flex-wrap gap-4 sm:gap-12 justify-center w-full">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Minutes', value: timeLeft?.m ?? 0 },
              { label: 'Seconds', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white/10 backdrop-blur-md p-8 rounded-full aspect-square justify-center w-28 sm:w-36 border border-white/20">
                <span className="text-4xl sm:text-5xl font-floral-body font-light text-white mb-2">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-floral-body uppercase tracking-[0.2em] text-[#E8EAE3]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
             <h2 className="text-6xl sm:text-7xl font-floral-title text-[#2F3E2C] mb-4">Captured Blooms</h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {validGallery.map((url: string, index: number) => {
              return (
              <div key={index} className={`break-inside-avoid relative group ${index % 2 === 0 ? 'rounded-t-full' : 'rounded-b-full'} overflow-hidden shadow-lg shadow-[#8F9779]/10`}>
                <div className="absolute inset-0 bg-[#DDA7A5] opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
              </div>
            )})}
          </div>
        </div>
      </section>
    ) : null,
    wishes: (
      <section key="wishes" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FFFFFF]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-6xl sm:text-7xl font-floral-title text-[#2F3E2C] mb-12">Petals & Wishes</h2>
          
          <div className="bg-[#FAF9F6] p-16 rounded-[40px] relative text-center flex flex-col items-center border border-[#8F9779]/10">
            <Flower2 size={40} strokeWidth={1} className="absolute -top-6 text-[#DDA7A5] bg-white rounded-full p-2" />
            
            <p className="text-xl font-floral-title text-[#5A6C56] leading-loose mb-10">
              Leave a little wish for her to read when she grows up.
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-12 w-full">
              <button 
                onClick={() => setWishCount(Math.max(0, wishCount - 1))}
                className="text-[#8F9779] hover:text-[#2F3E2C] transition-colors"
              ><Leaf size={20} strokeWidth={1} /></button>
              
              <div className="text-7xl font-floral-title text-[#2F3E2C] w-24 text-center">{wishCount}</div>
              
              <button 
                onClick={() => { setWishCount(wishCount + 1); triggerConfettiPopper(); }}
                className="text-[#8F9779] hover:text-[#2F3E2C] transition-colors"
              ><Leaf size={20} strokeWidth={1} className="scale-x-[-1]" /></button>
            </div>
            
            <button className="bg-transparent border border-[#2F3E2C] text-[#2F3E2C] hover:bg-[#2F3E2C] hover:text-white px-10 py-4 font-floral-body text-[10px] uppercase tracking-[0.3em] transition-colors rounded-full">
              Leave a Wish
            </button>
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-32 px-6 sm:px-12 relative z-10 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl sm:text-7xl font-floral-title text-[#2F3E2C] mb-4">RSVP</h2>
            <p className="text-[#8F9779] font-floral-body text-[10px] uppercase tracking-[0.3em]">Kindly reply</p>
          </div>

          <div className="bg-white p-10 sm:p-16 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(143,151,121,0.15)]">
            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input type="text" className="peer w-full bg-transparent border-b-2 border-[#FAF9F6] pb-4 outline-none focus:border-[#8F9779] transition-colors text-lg font-floral-body text-[#2F3E2C] placeholder-transparent" id="rsvpName" placeholder="Name" />
                <label htmlFor="rsvpName" className="absolute left-0 -top-4 text-[#8F9779] font-floral-body text-[10px] uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-4 peer-focus:text-[10px]">Guest Name(s)</label>
              </div>

              <div className="relative">
                <textarea rows={2} className="peer w-full bg-transparent border-b-2 border-[#FAF9F6] pb-4 outline-none focus:border-[#8F9779] transition-colors text-lg font-floral-body text-[#2F3E2C] placeholder-transparent resize-none" id="rsvpNote" placeholder="Note"></textarea>
                <label htmlFor="rsvpNote" className="absolute left-0 -top-4 text-[#8F9779] font-floral-body text-[10px] uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-4 peer-focus:text-[10px]">A brief note...</label>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-6 rounded-2xl bg-[#FAF9F6] hover:bg-[#8F9779]/10 transition-colors flex-1 group border border-transparent hover:border-[#8F9779]/30">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#8F9779]" defaultChecked />
                    <span className="text-[#2F3E2C] font-floral-body text-[10px] uppercase tracking-widest font-medium">Joyfully Accept</span>
                  </label>
                  <label className="flex items-center justify-center gap-4 cursor-pointer p-6 rounded-2xl bg-[#FAF9F6] hover:bg-[#DDA7A5]/10 transition-colors flex-1 group border border-transparent hover:border-[#DDA7A5]/30">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#DDA7A5]" />
                    <span className="text-[#2F3E2C] font-floral-body text-[10px] uppercase tracking-widest font-medium">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              <div className="pt-8 text-center">
                <button type="button" className="bg-[#8F9779] hover:bg-[#7a8266] text-white font-floral-body text-[10px] uppercase tracking-[0.3em] py-5 px-16 transition-colors rounded-full shadow-lg shadow-[#8F9779]/30">
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
    <div className={`min-h-screen bg-[#FAF9F6] relative text-[#2F3E2C] flex flex-col items-center w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {musicUrl && isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#8F9779] hover:bg-white hover:scale-110 transition-all shadow-[0_10px_30px_rgba(143,151,121,0.2)] border border-[#8F9779]/10"
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
        </button>
      )}

      {/* Blooming Wreath Entrance */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out bg-[#FAF9F6] ${isOpened ? 'opacity-0 pointer-events-none delay-1000' : 'opacity-100'}`}
      >
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
           <Flower2 size={600} strokeWidth={0.5} className="absolute -top-40 -right-40 text-[#8F9779] animate-spin-slow" style={{ animationDuration: '60s' }} />
        </div>
        
        <div className={`relative w-full max-w-sm aspect-square flex items-center justify-center transition-all duration-[1500ms] ease-out ${isOpening ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'}`}>
           
           {/* Decorative Wreath Ring */}
           <div className="absolute inset-0 border-[1px] border-dashed border-[#8F9779]/40 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }}></div>
           
           {/* Center Content */}
           <div 
             onClick={handleOpen}
             className="relative z-10 w-[80%] h-[80%] bg-white rounded-full shadow-[0_0_60px_rgba(143,151,121,0.2)] flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-transform duration-500"
           >
              <Leaf size={24} strokeWidth={1} className="text-[#DDA7A5] mb-4" />
              <h1 className="text-6xl font-floral-title text-[#2F3E2C] mb-2">{name}</h1>
              <p className="font-floral-body text-[8px] uppercase tracking-[0.3em] text-[#8F9779] mb-6">is turning one</p>
              
              <div className="text-[#5A6C56] font-floral-body text-[9px] uppercase tracking-[0.2em] bg-[#FAF9F6] px-6 py-2 rounded-full border border-[#8F9779]/20">
                Tap to bloom
              </div>
           </div>
           
           {/* Floating Petals */}
           <Flower2 size={24} strokeWidth={1} className="absolute -top-4 left-1/2 text-[#DDA7A5] animate-pulse" />
           <Flower2 size={24} strokeWidth={1} className="absolute -bottom-4 left-1/2 text-[#8F9779] animate-pulse" style={{ animationDelay: '1s' }} />
           <Flower2 size={16} strokeWidth={1} className="absolute top-1/2 -left-4 text-[#DDA7A5] animate-pulse" style={{ animationDelay: '0.5s' }} />
           <Flower2 size={16} strokeWidth={1} className="absolute top-1/2 -right-4 text-[#8F9779] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      <div className="relative z-30 w-full bg-transparent">
        {sections.filter((s: { id: string; visible: boolean }) => s.visible).map((s: { id: string; visible: boolean }) => sectionMap[s.id])}
      </div>

      <footer className="py-16 relative z-10 text-center bg-[#2F3E2C] text-[#E8EAE3] w-full">
        <Flower2 size={20} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
        <p className="font-floral-body text-[9px] uppercase tracking-[0.4em] mb-4">A Botanical Celebration</p>
      </footer>

    </div>
  );
}
