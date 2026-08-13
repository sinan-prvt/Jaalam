import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift } from 'lucide-react';
import type { WeddingLayoutProps } from './types';
import { eventHierarchy } from '../../../../utils/templateData';

export default function SouthIndianLayout({ content, website, colors }: WeddingLayoutProps) {
  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "With the blessings of our elders, we are embarking on a beautiful journey together.";
  const date = content?.settings_json?.wedding?.date || "September 15, 2026";
  const location = content?.contact_info?.address || "The Grand Estate, New York";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "9:00 AM", event: "Muhurtham" },
    { time: "12:30 PM", event: "Sadhya / Feast" },
    { time: "7:00 PM", event: "Reception" }
  ];
  const groomParents = content?.settings_json?.wedding?.groomParents || "";
  const brideParents = content?.settings_json?.wedding?.brideParents || "";
  const mapUrl = content?.settings_json?.wedding?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "";
  const countdownDate = content?.settings_json?.wedding?.countdownDate || "";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number} | null>(null);

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

  const names = coupleNames.split(/\s*&\s*|\s+and\s+/i);
  const person1Name = names[0] || "Alex";
  const person2Name = names[1] || "";

  let mainCategory = 'Wedding';
  for (const [main, subCats] of Object.entries(eventHierarchy)) {
    if (website?.business_type && Object.keys(subCats).includes(website.business_type)) {
      mainCategory = main;
      break;
    }
  }

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'registry', label: 'Registry', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];
  const sections = content?.settings_json?.wedding?.sections || defaultSections;

  // South Indian specific styles overriding colors if necessary, though we will rely on ClassicWeddingTheme to pass good ones.
  // Ideally, accentText = red-700 (maroon), accentBg = red-700, borderClass = amber-400, bgClass = amber-50
  
  // Custom floral/mandala SVG pattern for background
  const mandalaPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b45309' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-amber-50" style={{ backgroundImage: mandalaPattern }}>
        {/* Decorative Top Border (Marigold Garland feel) */}
        <div className="absolute top-0 left-0 w-full h-8 bg-orange-500/80 flex space-x-4 overflow-hidden shadow-sm">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-yellow-400 -mt-1 shadow-sm shrink-0"></div>
            ))}
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
            
            {/* Traditional Arch Container */}
            <div className="w-full bg-white/80 backdrop-blur-sm border-[12px] border-double border-amber-600/70 rounded-t-[140px] md:rounded-t-[200px] shadow-2xl p-8 md:p-16 flex flex-col items-center text-center relative mt-8">
                
                {/* Image / Caricature Placeholder inside the arch */}
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-amber-500 overflow-hidden mb-8 shadow-inner z-20 relative bg-amber-100 flex items-center justify-center -mt-24 md:-mt-32">
                    {gallery && gallery.length > 0 ? (
                        <img src={gallery[0]} alt="Couple" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-amber-800 text-center p-4">
                            <span className="block text-sm font-bold uppercase tracking-widest mb-2">Upload Photo</span>
                            <span className="text-xs opacity-70">to replace this placeholder</span>
                        </div>
                    )}
                </div>

                <div className="mb-4 text-orange-600 font-serif tracking-widest uppercase text-sm font-semibold">
                    We invite you to celebrate
                </div>

                <div className="flex flex-col items-center justify-center w-full">
                    <h1 className="text-5xl md:text-7xl font-serif text-red-800 tracking-wide font-bold mb-2">
                        {person1Name}
                    </h1>
                    {groomParents && (
                        <div className="flex flex-col items-center text-slate-700 mb-4">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-orange-600 mb-1">Son of</span>
                            <p className="text-[14px] md:text-base font-serif opacity-90">
                                {groomParents}
                            </p>
                        </div>
                    )}
                    
                    {person2Name && (
                        <span className="text-3xl md:text-5xl font-serif text-amber-500 my-4 md:my-6">
                            &
                        </span>
                    )}
                    
                    {person2Name && (
                        <>
                            <h1 className="text-5xl md:text-7xl font-serif text-red-800 tracking-wide font-bold mb-2">
                                {person2Name}
                            </h1>
                            {brideParents && (
                                <div className="flex flex-col items-center text-slate-700 mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-orange-600 mb-1">Daughter of</span>
                                    <p className="text-[14px] md:text-base font-serif opacity-90">
                                        {brideParents}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-8"></div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-slate-800 font-semibold tracking-wider text-sm md:text-base mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <Calendar size={24} className="text-red-700" />
                        <span>{date}</span>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-amber-300"></div>
                    <div className="flex flex-col items-center gap-2">
                        <MapPin size={24} className="text-red-700" />
                        <span className="text-center max-w-[200px]">{location}</span>
                    </div>
                </div>

                {timeLeft && (
                    <div className="mt-6 flex gap-4 md:gap-6 justify-center">
                        {[
                            { label: 'Days', value: timeLeft.d },
                            { label: 'Hours', value: timeLeft.h },
                            { label: 'Mins', value: timeLeft.m },
                            { label: 'Secs', value: timeLeft.s }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center mb-1 shadow-sm">
                                    <span className="text-xl md:text-2xl font-bold text-red-800 font-serif">{item.value}</span>
                                </div>
                                <span className="text-[9px] md:text-[11px] tracking-widest uppercase font-bold text-amber-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-4 bg-[#fdfaf6] relative">
        <div className="max-w-3xl mx-auto text-center border-x-4 border-amber-500/30 px-6 md:px-12 py-10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-amber-500">
                <Heart size={32} className="fill-current" />
            </div>
          <h2 className="text-3xl md:text-4xl font-serif text-red-800 mb-8 font-bold">Our Story</h2>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-serif italic text-amber-900/80">
            "{story}"
          </p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-24 px-4 bg-amber-50" style={{ backgroundImage: mandalaPattern }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-red-800 font-bold mb-4">Auspicious Timings</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center text-center p-8 bg-white border border-amber-200 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-tl-3xl rounded-br-3xl hover:border-red-400 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 text-red-700">
                    <Clock size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-wide font-serif">
                  {item.event}
                </h3>
                <p className="text-amber-600 font-bold text-lg">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: mapUrl ? (
      <section key="venue" className="py-24 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-red-800 font-bold mb-4">Venue</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-12"></div>
          <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border-8 border-amber-100 shadow-xl relative">
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    ) : null,
    gallery: gallery.length > 1 ? (
      <section key="gallery" className="py-24 px-4 bg-amber-900 text-amber-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Moments</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-16"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
            {gallery.slice(1).map((url: string, index: number) => (
              <div key={index} className="aspect-square overflow-hidden shadow-xl border-4 border-amber-700/50 rounded-lg group">
                <img src={url} alt={`Gallery Image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    registry: registryUrl ? (
      <section key="registry" className="py-24 px-4 bg-amber-50 border-t border-amber-200">
        <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-3xl shadow-sm border border-amber-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={36} className="text-red-700" />
          </div>
          <h2 className="text-3xl font-serif text-red-800 font-bold mb-6">Blessings & Gifts</h2>
          {registryMessage && <p className="text-slate-600 mb-8">{registryMessage}</p>}
          <a href={registryUrl} target="_blank" rel="noreferrer" className="inline-block px-10 py-4 bg-red-700 hover:bg-red-800 text-white font-bold tracking-wider uppercase rounded-full shadow-lg transition-colors">
            Our Registry
          </a>
        </div>
      </section>
    ) : null,
    rsvp: (
      <section key="rsvp" className="py-24 px-4 bg-white relative">
        <div className="max-w-2xl mx-auto text-center border-[8px] border-double border-amber-200 p-8 md:p-14 relative bg-[#fdfaf6]">
          <h2 className="text-3xl md:text-4xl font-serif text-red-800 font-bold mb-4">RSVP</h2>
          <p className="text-amber-700 mb-10 tracking-widest uppercase text-sm font-semibold">We would be delighted by your presence</p>
          
          <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-amber-800 mb-2">First Name</label>
                <input type="text" className="w-full border-b-2 border-amber-300 py-2 outline-none focus:border-red-700 transition-colors bg-transparent" placeholder="First Name" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-amber-800 mb-2">Last Name</label>
                <input type="text" className="w-full border-b-2 border-amber-300 py-2 outline-none focus:border-red-700 transition-colors bg-transparent" placeholder="Last Name" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-amber-800 mb-2">Will you be attending?</label>
              <div className="flex flex-col sm:flex-row gap-4 mt-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-amber-200 bg-white hover:border-red-500 rounded-lg flex-1 justify-center transition-colors">
                  <input type="radio" name="attending" className="w-4 h-4 accent-red-700" />
                  <span className="text-slate-800 font-serif font-semibold">
                    Joyfully Accepts
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-amber-200 bg-white hover:border-red-500 rounded-lg flex-1 justify-center transition-colors">
                  <input type="radio" name="attending" className="w-4 h-4 accent-red-700" />
                  <span className="text-slate-800 font-serif font-semibold">
                    Regretfully Declines
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-8 text-center">
              <button type="button" className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white font-bold tracking-[0.2em] uppercase rounded-full shadow-lg transition-colors">
                Send RSVP
              </button>
              {contactNumbers && (
                <p className="mt-8 text-sm text-slate-700 font-bold tracking-wide">
                  Contact: <span className="text-red-700">{contactNumbers}</span>
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 font-sans selection:bg-amber-200 selection:text-red-900 pb-0 transition-all duration-700">
      {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      
      {/* Footer */}
      <footer className="py-12 bg-amber-950 text-center text-amber-500/60 text-xs tracking-widest uppercase">
        <Heart size={16} className="inline-block mx-2 text-red-500/80" />
        <p className="mt-4 font-serif text-sm text-amber-400/80">
          We can't wait to see you
        </p>
      </footer>
      
      {/* Background Music */}
      {musicUrl && (
        <audio autoPlay loop className="hidden">
          <source src={musicUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}
