import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, Sparkles, Send, Volume2, VolumeX, Navigation, ChevronDown } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function ChristianMinimalistCrossLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Global Live Multi-Click Heart Wish State
  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  useEffect(() => {
    if (!website?.slug) return;
    const fetchGlobalWishes = async () => {
      try {
        const res = await fetch(`/api/websites/${website.slug}/wish/`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.wish_count === 'number') {
            setWishCount(data.wish_count);
          }
        }
      } catch (err) {}
    };
    fetchGlobalWishes();
    const interval = setInterval(fetchGlobalWishes, 4000);
    return () => clearInterval(interval);
  }, [website?.slug]);

  const handleTapWish = async (e?: React.MouseEvent) => {
    const newCount = wishCount + 1;
    setWishCount(newCount);
    setIsCounterPopping(true);
    setPulseRing(true);
    setTimeout(() => setIsCounterPopping(false), 300);
    setTimeout(() => setPulseRing(false), 600);
    triggerConfettiPopper(e);

    if (website?.slug) {
      try {
        await fetch(`/api/websites/${website.slug}/wish/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ increment: 1 })
        });
      } catch (err) {}
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
    }, 1500);
  };

  const rawCoupleNames = content?.hero_title || "ELIAS & ANNA";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "ELIAS").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "ANNA").toUpperCase();

  const story = content?.about_text || "Drawn together by faith and bound by love. We invite you to witness our commitment to each other.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "OUR JOURNEY";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Saturday, October 10, 2026";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'OCT');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '10');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SATURDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2026');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '3:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "First Assembly Church, Downtown";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "3:00 PM", event: "The Ceremony", date: rawDateStr, venue: location },
      { time: "5:00 PM", event: "Dinner Reception", date: rawDateStr, venue: location }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Anderson";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Peterson";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your prayers and presence are the greatest gifts. If you wish to bless us further, our registry is below.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-10-10T15:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "WITH JOYFUL HEARTS";

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
    { id: 'about', label: 'Key People & Family', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes & Blessings', visible: true },
    { id: 'registry', label: 'Registry', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  let rawSections = content?.settings_json?.wedding?.sections || defaultSections;
  if (!rawSections.some((s: any) => s.id === 'wishes')) {
    const rsvpIdx = rawSections.findIndex((s: any) => s.id === 'rsvp');
    if (rsvpIdx !== -1) {
      rawSections = [...rawSections.slice(0, rsvpIdx), { id: 'wishes', label: 'Wishes & Blessings', visible: true }, ...rawSections.slice(rsvpIdx)];
    } else {
      rawSections = [...rawSections, { id: 'wishes', label: 'Wishes & Blessings', visible: true }];
    }
  }
  const sections = rawSections;

  const MinimalSectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="flex flex-col items-center mb-16 relative z-20 text-center">
      {subtitle && <span className="text-[9px] tracking-[0.5em] text-slate-400 font-sans uppercase font-semibold mb-3">{subtitle}</span>}
      <h2 className="text-2xl sm:text-3xl font-playfair text-slate-900 tracking-[0.2em] uppercase">{title}</h2>
      <div className="w-12 h-px bg-slate-200 mt-6"></div>
    </div>
  );

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full flex flex-col justify-center items-center text-center bg-[#FFFFFF] text-slate-900 p-0 overflow-hidden min-h-[90vh]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          @keyframes floatSubtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>

        {/* Minimalist Ethereal Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none"></div>

        <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center px-4 pt-16 pb-20 animate-[floatSubtle_6s_ease-in-out_infinite]">
          
          {/* Subtle Minimalist Cross Graphic */}
          <div className="mb-12 flex flex-col items-center opacity-60">
            <div className="w-[1px] h-12 bg-slate-300 relative">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-slate-300"></div>
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <span className="text-[9px] sm:text-[10px] font-inter tracking-[0.4em] uppercase text-slate-400 mb-8 font-semibold">
              {quoteText}
            </span>

            <h1 className="text-4xl sm:text-6xl font-playfair tracking-[0.25em] text-slate-900 uppercase">
              {groomFullName}
            </h1>
            <div className="my-6 sm:my-8 text-xl font-playfair text-slate-400 italic">
              and
            </div>
            <h1 className="text-4xl sm:text-6xl font-playfair tracking-[0.25em] text-slate-900 uppercase">
              {brideFullName}
            </h1>
          </div>

          {/* Date Block */}
          <div className="mt-16 flex flex-col items-center">
            <div className="flex items-center gap-6 text-slate-900 font-playfair tracking-widest">
              <span className="text-sm uppercase tracking-[0.3em]">{monthStr}</span>
              <span className="text-3xl sm:text-4xl font-medium">{dayNum}</span>
              <span className="text-sm uppercase tracking-[0.3em]">{yearStr}</span>
            </div>
            <span className="mt-6 text-[9px] font-inter tracking-[0.4em] text-slate-500 uppercase font-medium">{dayName} • {timeStr}</span>
          </div>

          {/* Location Block */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center w-32">
            <span className="text-[10px] font-inter tracking-[0.3em] text-slate-600 uppercase whitespace-nowrap">{location}</span>
          </div>
        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <MinimalSectionHeader title="The Couple" subtitle="Bound in faith" />

          <div className="grid md:grid-cols-2 gap-12 sm:gap-20 mt-16 relative z-20">
            {[ 
              { role: 'Groom', name: groomFullName, parents: groomParents, photo: groomPhoto },
              { role: 'Bride', name: brideFullName, parents: brideParents, photo: bridePhoto }
            ].map((person, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-56 h-72 sm:w-64 sm:h-80 relative mb-8 overflow-hidden rounded-sm bg-white shadow-sm border border-slate-100 transition-all duration-700 hover:shadow-lg">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <div className="w-[1px] h-12 bg-slate-200 relative"><div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-slate-200"></div></div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-playfair tracking-[0.2em] text-slate-900 mb-2 uppercase">{person.name}</h3>
                <p className="text-[9px] font-inter text-slate-400 uppercase tracking-[0.4em] mb-4 font-semibold">{person.role}</p>
                {person.parents && <p className="text-xs text-slate-500 font-playfair italic">Child of {person.parents}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white text-center border-y border-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 opacity-30 flex justify-center">
            <div className="w-6 h-[1px] bg-slate-400"></div>
          </div>
          <h2 className="text-sm font-inter tracking-[0.4em] uppercase text-slate-400 font-semibold mb-8">
            {storyTitle}
          </h2>
          <p className="text-xl sm:text-2xl text-slate-800 font-playfair font-light leading-relaxed px-4">
            {story}
          </p>
          <div className="mt-10 opacity-30 flex justify-center">
            <div className="w-6 h-[1px] bg-slate-400"></div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <MinimalSectionHeader title="Events" subtitle="The Day's Order" />

          <div className="flex flex-col gap-10 mt-16 max-w-2xl mx-auto">
            {schedule.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-8 sm:p-10 border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-0">
                  <h3 className="text-lg font-playfair tracking-[0.15em] text-slate-900 uppercase mb-2">{item.event}</h3>
                  <p className="text-slate-500 text-[10px] font-inter tracking-[0.2em] uppercase">{item.venue || location}</p>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-sm font-inter font-medium text-slate-900 tracking-[0.2em]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <MinimalSectionHeader title="Location" subtitle="Join Us At" />

          <div className="mt-12 text-center">
            
            <p className="text-xl sm:text-2xl font-playfair text-slate-900 tracking-widest uppercase mb-4">{location}</p>
            <p className="text-sm font-playfair italic text-slate-500 mb-12">We are humbled to share this sacred space with you.</p>

            {venuePhoto && (
              <div className="w-full h-72 sm:h-96 overflow-hidden bg-slate-100 mb-12">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] bg-slate-100 mb-12 p-1 border border-slate-200">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 pointer-events-none md:pointer-events-auto"
              ></iframe>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-12 py-4 font-inter text-[10px] font-semibold tracking-[0.2em] uppercase transition-all"
                >
                  <Navigation size={12} />
                  Directions
                </a>
              )}
              {contactNumbers && (
                <div className="px-12 py-4 bg-white border border-slate-200 text-slate-700 font-inter text-[10px] font-semibold tracking-[0.2em] uppercase">
                  RSVP: {contactNumbers}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <MinimalSectionHeader title="Gallery" subtitle="Memories" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mt-12">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-square bg-slate-100 overflow-hidden group">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white border-y border-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-inter tracking-[0.4em] uppercase text-slate-400 font-semibold mb-12">Time Remaining</p>

          <div className="flex gap-8 sm:gap-16 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 0 },
              { label: 'Hours', value: timeLeft?.h ?? 0 },
              { label: 'Mins', value: timeLeft?.m ?? 0 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-playfair text-slate-900 mb-4">{item.value}</span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-medium text-slate-400 font-inter">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50/50">
        <div className="max-w-2xl mx-auto text-center">
          <MinimalSectionHeader title="Blessings" subtitle="Your Prayers" />

          <div className="bg-white p-12 sm:p-20 border border-slate-100 mt-12 relative flex flex-col items-center">
            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-12">
                <div className="w-40 h-40 rounded-full border border-slate-300 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center transition-all duration-500 group cursor-pointer mb-10 relative z-20 ${pulseRing ? 'scale-110 shadow-lg' : 'hover:bg-slate-900 active:scale-95'}`}
            >
              <Heart className={`w-8 h-8 transition-all duration-500 ${pulseRing ? 'scale-125 fill-slate-900 text-slate-900' : 'text-slate-400 group-hover:fill-white group-hover:text-white'}`} strokeWidth={1} />
            </button>

            <div className="flex flex-col items-center">
              <span className={`text-5xl sm:text-7xl font-playfair text-slate-900 block transition-transform duration-300 ${isCounterPopping ? 'scale-110' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.4em] font-inter mt-4">Wishes Received</span>
            </div>
          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-[1px] h-12 bg-slate-300 mx-auto mb-8 relative"><div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-[1px] bg-slate-300"></div></div>
          
          <h2 className="text-2xl sm:text-3xl font-playfair tracking-[0.2em] text-slate-900 mb-6 uppercase">Registry</h2>
          <p className="text-sm text-slate-500 font-playfair italic max-w-lg mx-auto mb-10 leading-relaxed">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center bg-transparent border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 px-12 py-4 font-inter text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors"
            >
              View Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <MinimalSectionHeader title="RSVP" subtitle="Kindly Reply" />

          <div className="bg-white p-8 sm:p-16 border border-slate-100 mt-12">
            <form className="space-y-10 font-inter max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-8">
                <div>
                  <label className="block text-[9px] font-semibold tracking-[0.3em] uppercase text-slate-400 mb-3">Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-slate-200 py-3 outline-none focus:border-slate-900 transition-colors text-slate-900 placeholder-slate-300" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-[9px] font-semibold tracking-[0.3em] uppercase text-slate-400 mb-3">Message</label>
                  <textarea rows={3} className="w-full bg-transparent border-b border-slate-200 py-3 outline-none focus:border-slate-900 transition-colors text-slate-900 placeholder-slate-300 resize-none" placeholder="A brief message..."></textarea>
                </div>

                <div>
                  <label className="block text-[9px] font-semibold tracking-[0.3em] uppercase text-slate-400 mb-4">Attendance</label>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="attending" className="peer appearance-none w-4 h-4 border border-slate-300 rounded-none checked:bg-slate-900 transition-colors cursor-pointer" />
                      </div>
                      <span className="text-slate-600 font-medium uppercase tracking-[0.1em] text-[10px] group-hover:text-slate-900 transition-colors">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="attending" className="peer appearance-none w-4 h-4 border border-slate-300 rounded-none checked:bg-slate-900 transition-colors cursor-pointer" />
                      </div>
                      <span className="text-slate-600 font-medium uppercase tracking-[0.1em] text-[10px] group-hover:text-slate-900 transition-colors">Declines with Regret</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button type="button" className="w-full inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold tracking-[0.2em] uppercase text-[10px] py-5 transition-colors">
                  <Send size={12} />
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
    <div className={`min-h-screen bg-white relative font-inter text-slate-900 flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      {musicUrl && isOpened && (
        <button
          onClick={() => {
            if (audioRef.current) {
              isMuted ? audioRef.current.play() : audioRef.current.pause();
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-8 right-8 z-50 p-4 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors rounded-none"
        >
          {isMuted ? <VolumeX size={16} strokeWidth={1} /> : <Volume2 size={16} strokeWidth={1} />}
        </button>
      )}

      {/* Welcome Screen: True Minimalist Cross Opening */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-[1500ms] ease-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer selection:bg-transparent`}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          @keyframes drawVertical {
            0% { height: 0; opacity: 0; }
            100% { height: 8rem; opacity: 1; }
          }
          @keyframes drawHorizontal {
            0% { width: 0; opacity: 0; }
            100% { width: 4rem; opacity: 1; }
          }
          @keyframes fadeText {
            0% { opacity: 0; transform: translateY(10px) tracking-[0.2em]; }
            100% { opacity: 1; transform: translateY(0) tracking-[0.4em]; }
          }
        `}</style>

        {/* The Minimalist Animated Cross */}
        <div className={`relative z-40 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out ${isOpening ? 'scale-[20] opacity-0 blur-md' : 'scale-100 opacity-100'}`}>
          
          <div className="relative w-16 h-32 flex items-center justify-center mb-12">
            {/* Vertical Line */}
            <div className="absolute top-0 w-[1px] bg-slate-900 animate-[drawVertical_1.5s_ease-out_forwards]"></div>
            {/* Horizontal Line */}
            <div className="absolute top-10 h-[1px] bg-slate-900 animate-[drawHorizontal_1.5s_ease-out_0.5s_forwards]" style={{ width: '0', opacity: '0' }}></div>
          </div>
          
          <div className="flex flex-col items-center opacity-0 animate-[fadeText_2s_ease-out_1.5s_forwards]">
            <h1 className="text-xl sm:text-2xl font-playfair tracking-[0.3em] text-slate-900 uppercase">
              {groomFullName} & {brideFullName}
            </h1>
            <p className="text-slate-400 text-[9px] sm:text-[10px] tracking-[0.4em] font-inter uppercase mt-6 font-semibold">
              {isOpening ? 'ENTER' : 'TAP ANYWHERE'}
            </p>
          </div>
        </div>

      </div>

      <div className="relative z-30 w-full bg-white">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      <footer className="py-24 relative z-10 text-center bg-white text-slate-900 w-full">
        <div className="w-[1px] h-8 bg-slate-300 mx-auto mb-8"></div>
        <h2 className="text-xl font-playfair tracking-[0.3em] mb-4 uppercase">{rawCoupleNames}</h2>
        <p className="text-slate-400 text-[9px] tracking-[0.4em] uppercase font-inter font-semibold">Faith & Love</p>
      </footer>

    </div>
  );
}
