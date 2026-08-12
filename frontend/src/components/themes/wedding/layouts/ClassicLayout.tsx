import React from 'react';
import { Heart, Calendar, MapPin, Clock } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function ClassicLayout({ content, colors }: WeddingLayoutProps) {
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

  const { bgClass, sectionBg, accentText, accentBg, accentHover, borderClass, heroOpacity, heroBg } = colors;

  const names = coupleNames.split(/\s*&\s*|\s+and\s+/i);
  const person1Name = names[0] || "Alex";
  const person2Name = names[1] || "";

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
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
                  <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-slate-500 mb-1 opacity-80">S/o</span>
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
                    <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-slate-500 mb-1 opacity-80">D/o</span>
                    <p className="text-[15px] md:text-lg font-serif italic max-w-[260px] leading-tight opacity-90">
                      {brideParents}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm md:text-lg font-light tracking-[0.3em] uppercase text-slate-700 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Are getting married
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
                  <span className={`text-slate-700 italic font-serif text-lg`}>Joyfully Accepts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 hover:border-slate-400 flex-1 justify-center transition-colors">
                  <input type="radio" name="attending" className="w-4 h-4 accent-slate-800" />
                  <span className={`text-slate-700 italic font-serif text-lg`}>Regretfully Declines</span>
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
        <p className="mt-4 font-serif italic">We can't wait to see you</p>
      </footer>
    </div>
  );
}
