import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Image as ImageIcon } from 'lucide-react';
import type { WeddingLayoutProps } from './types';
import { eventHierarchy } from '../../../../utils/templateData';

export default function ClassicLayout({ content, website, colors }: WeddingLayoutProps) {
  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const date = content?.settings_json?.wedding?.date || "September 15, 2026";
  const location = content?.contact_info?.address || "The Grand Estate, New York";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "4:00 PM", event: "Ceremony" },
    { time: "5:30 PM", event: "Cocktail Hour" },
    { time: "7:00 PM", event: "Dinner & Dancing" }
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

  const { bgClass, sectionBg, accentText, accentBg, accentHover, borderClass, heroOpacity, heroBg } = colors;

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

  const getSubTitle = () => {
    switch (mainCategory) {
      case 'Birthday': return "Are celebrating a Birthday";
      case 'Housewarming': return "Invite you to their new home";
      case 'Baby Shower': return "Are welcoming a new life";
      case 'Engagement': return "Are engaged";
      case 'Farewell': return "Saying Goodbye";
      case 'College Fest': return "Join the Fest";
      case 'Corporate Event': return "Join us";
      case 'Religious Events': return "Join us in celebration";
      default: return "Are getting married";
    }
  };

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

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover mix-blend-multiply ${heroOpacity} transition-all duration-1000 scale-105 animate-in zoom-in duration-[10000ms]`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="mb-6 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Heart size={32} className={`${accentText} fill-current`} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-10 w-full">
            <div className="flex flex-col items-center text-center">
              <h1 className={`text-6xl md:text-7xl lg:text-8xl text-slate-900 font-serif italic ${accentText} transition-all duration-700 leading-none`}>
                {person1Name}
              </h1>
              {groomParents && (
                <div className="mt-4 flex flex-col items-center text-slate-800">
                  {mainCategory === 'Wedding' && <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-slate-500 mb-1 opacity-80">S/o</span>}
                  <p className="text-[15px] md:text-lg font-serif italic max-w-[260px] leading-tight opacity-90">
                    {groomParents}
                  </p>
                </div>
              )}
            </div>
            
            {person2Name && (
              <span className={`text-4xl md:text-5xl font-serif italic text-slate-400 my-6 md:my-0 md:mx-10 opacity-70`}>
                &
              </span>
            )}
            
            {person2Name && (
              <div className="flex flex-col items-center text-center">
                <h1 className={`text-6xl md:text-7xl lg:text-8xl text-slate-900 font-serif italic ${accentText} transition-all duration-700 leading-none`}>
                  {person2Name}
                </h1>
                {brideParents && (
                  <div className="mt-4 flex flex-col items-center text-slate-800">
                    {mainCategory === 'Wedding' && <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-slate-500 mb-1 opacity-80">D/o</span>}
                    <p className="text-[15px] md:text-lg font-serif italic max-w-[260px] leading-tight opacity-90">
                      {brideParents}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm md:text-lg font-light tracking-[0.3em] uppercase text-slate-700 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {getSubTitle()}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-slate-800 font-bold tracking-widest uppercase text-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className={`flex items-center gap-3 border-b pb-2 md:border-b-0 md:border-r md:pr-12 ${borderClass}`}>
              <Calendar size={18} className={accentText} />
              {date}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className={accentText} />
              {location}
            </div>
          </div>
          
          {timeLeft && (
            <div className={`mt-8 flex gap-4 md:gap-8 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700`}>
              {[
                { label: 'Days', value: timeLeft.d },
                { label: 'Hours', value: timeLeft.h },
                { label: 'Mins', value: timeLeft.m },
                { label: 'Secs', value: timeLeft.s }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 ${borderClass} bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2`}>
                    <span className="text-xl md:text-2xl font-bold text-slate-800 font-serif italic">{item.value}</span>
                  </div>
                  <span className="text-[10px] md:text-xs tracking-widest uppercase font-bold text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-24 px-4 bg-white/50 backdrop-blur-sm border-y border-dashed border-slate-300">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl font-serif italic text-slate-900 mb-8 transition-all`}>Our Story</h2>
          <div className={`w-16 h-px ${accentBg} mx-auto mb-10`}></div>
          <p className="text-lg text-slate-600 leading-relaxed border-l-2 border-r-2 px-8 border-slate-200">
            {story}
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className={`py-24 px-4 ${sectionBg} transition-colors duration-700`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-serif italic text-slate-900 mb-6 transition-all`}>Schedule of Events</h2>
            <div className={`w-16 h-px ${accentBg} mx-auto`}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {schedule.map((item: any, index: number) => (
              <div key={index} className={`flex flex-col items-center text-center p-8 bg-white border-2 ${borderClass} shadow-md hover:shadow-xl transition-all duration-500 rounded-sm`}>
                <Clock size={28} className={`${accentText} mb-6`} />
                <h3 className="text-xl font-medium text-slate-900 mb-3 uppercase tracking-widest">
                  {item.event}
                </h3>
                <p className={`${accentText} font-bold text-lg font-serif italic`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    venue: mapUrl ? (
      <section key="venue" className={`py-24 px-4 bg-white/50 backdrop-blur-sm border-y border-dashed border-slate-300`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl font-serif italic text-slate-900 mb-6 transition-all`}>Getting There</h2>
          <div className={`w-16 h-px ${accentBg} mx-auto mb-10`}></div>
          <div className="w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border-[6px] border-white shadow-xl">
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
    gallery: gallery.length > 0 ? (
      <section key="gallery" className={`py-24 px-4 ${sectionBg} transition-colors duration-700`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-4xl font-serif italic text-slate-900 mb-6 transition-all`}>Gallery</h2>
          <div className={`w-16 h-px ${accentBg} mx-auto mb-16`}></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((url: string, index: number) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md group relative">
                <img src={url} alt={`Gallery Image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    registry: registryUrl ? (
      <section key="registry" className="py-24 px-4 bg-white/50 backdrop-blur-sm border-y border-dashed border-slate-300">
        <div className="max-w-2xl mx-auto text-center">
          <Gift size={48} className={`${accentText} mx-auto mb-6 opacity-80`} />
          <h2 className={`text-4xl font-serif italic text-slate-900 mb-6 transition-all`}>Gift Registry</h2>
          <div className={`w-16 h-px ${accentBg} mx-auto mb-10`}></div>
          {registryMessage && <p className="text-lg text-slate-600 leading-relaxed mb-10">{registryMessage}</p>}
          <a href={registryUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center px-10 py-4 ${accentBg} ${accentHover} text-white font-bold tracking-[0.2em] uppercase text-sm transition-colors shadow-lg hover:shadow-xl`}>
            View Our Registry
          </a>
        </div>
      </section>
    ) : null,
    rsvp: (
      <section key="rsvp" className="py-24 px-4 bg-white relative">
        <div className={`max-w-2xl mx-auto text-center border-4 double ${borderClass} p-12 relative bg-white z-10 transition-colors shadow-2xl`}>
          <h2 className={`text-4xl font-serif italic text-slate-900 mb-4 transition-all`}>RSVP</h2>
          <p className="text-slate-500 mb-10 tracking-widest uppercase text-sm">Please let us know if you can make it</p>
          
          <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">First Name</label>
                <input type="text" className={`w-full border-b border-slate-300 py-3 outline-none focus:${borderClass} transition-colors bg-transparent italic`} placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Last Name</label>
                <input type="text" className={`w-full border-b border-slate-300 py-3 outline-none focus:${borderClass} transition-colors bg-transparent italic`} placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Will you be attending?</label>
              <div className="flex flex-col sm:flex-row gap-6 mt-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 hover:border-slate-400 flex-1 justify-center transition-colors">
                  <input type="radio" name="attending" className="w-4 h-4 accent-slate-800" />
                  <span className={`text-slate-700 italic font-serif text-lg`}>
                    {mainCategory === 'Corporate Event' ? "Attending" : "Joyfully Accepts"}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 hover:border-slate-400 flex-1 justify-center transition-colors">
                  <input type="radio" name="attending" className="w-4 h-4 accent-slate-800" />
                  <span className={`text-slate-700 italic font-serif text-lg`}>
                    {mainCategory === 'Corporate Event' ? "Not Attending" : "Regretfully Declines"}
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-8 text-center">
              <button type="button" className={`px-12 py-4 ${accentBg} ${accentHover} text-white font-bold tracking-[0.2em] uppercase text-sm transition-colors shadow-lg hover:shadow-xl`}>
                Send RSVP
              </button>
              {contactNumbers && (
                <p className="mt-8 text-sm text-slate-600 font-bold tracking-widest uppercase">
                  RSVP / Contact: <span className={accentText}>{contactNumbers}</span>
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen ${bgClass} text-slate-800 font-serif selection:${accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      
      
      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm tracking-widest uppercase">
        <Heart size={16} className={`inline-block mx-2 ${accentText}`} />
        <p className="mt-4 font-serif italic">
          {mainCategory === 'Corporate Event' || mainCategory === 'College Fest' ? "Thank you" : "We can't wait to see you"}
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
