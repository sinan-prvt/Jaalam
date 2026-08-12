import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function ModernLayout({ content, colors }: WeddingLayoutProps) {
  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const date = content?.settings_json?.wedding?.date || "September 15, 2026";
  const location = content?.contact_info?.address || "The Grand Estate, New York";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "4:00 PM", event: "Ceremony" },
    { time: "5:30 PM", event: "Cocktail Hour" },
    { time: "7:00 PM", event: "Dinner & Dancing" }
  ];

  const { bgClass, sectionBg, accentText, accentBg, accentHover, heroBg, heroOpacity } = colors;

  return (
    <div className={`min-h-screen ${bgClass} text-slate-900 font-sans tracking-tight selection:${accentBg} selection:text-white transition-all duration-700`}>
      {/* Hero Section - Split Screen */}
      <section className="h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden group">
          <img 
            src={heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover ${heroOpacity} group-hover:scale-110 transition-transform duration-[10000ms] ease-out`}
          />
          <div className="absolute inset-0 bg-black/20 md:bg-black/10"></div>
        </div>
        
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8 md:p-16 relative overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 w-full h-full bg-slate-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-lg">
            <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-slate-400 mb-4 animate-in slide-in-from-left-8 duration-700">
              The Wedding Of
            </p>
            <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-8 ${accentText} animate-in slide-in-from-right-12 duration-1000`}>
              {coupleNames.replace(' & ', ' \n&\n ')}
            </h1>
            
            <div className="grid grid-cols-2 gap-8 text-slate-800 font-bold uppercase text-xs tracking-widest mt-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
              <div>
                <p className="text-slate-400 mb-2">When</p>
                <p className="border-l-2 border-slate-900 pl-3">{date}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-2">Where</p>
                <p className="border-l-2 border-slate-900 pl-3">{location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Brutalist Typography */}
      <section className="py-32 px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-1/3 h-full ${accentBg} opacity-10 blur-[100px]`}></div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-4">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">The<br/>Story</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl font-medium leading-tight text-slate-300">
              {story}
            </p>
          </div>
        </div>
      </section>

      {/* Schedule - Sticky scrolling effect */}
      <section className={`py-32 px-8 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3 relative">
            <div className="sticky top-32">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Itinerary</h2>
              <div className={`w-full h-2 ${accentBg} mt-8`}></div>
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-8">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-white hover:bg-slate-900 hover:text-white transition-colors duration-500 shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-slate-800 transition-colors`}>
                    <Clock size={20} className="group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    {item.event}
                  </h3>
                </div>
                <div className={`text-xl font-bold tracking-widest uppercase ${accentText} group-hover:text-white transition-colors flex items-center gap-4`}>
                  {item.time}
                  <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-32 px-8 bg-slate-100">
        <div className="max-w-4xl mx-auto bg-white p-12 md:p-24 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${accentBg}`}></div>
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/2">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">RSVP</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Join us for the celebration. Let us know if you'll be there to share this moment.
              </p>
            </div>
            
            <div className="md:w-1/2">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input type="text" className="w-full border-b-2 border-slate-900 py-4 text-xl font-bold placeholder-slate-300 outline-none focus:border-slate-500 transition-colors bg-transparent uppercase tracking-wider" placeholder="FULL NAME" />
                </div>
                
                <div className="space-y-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Attendance</p>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-6 h-6 border-2 border-slate-900 group-hover:bg-slate-900 transition-colors flex items-center justify-center">
                      <input type="radio" name="attending" className="opacity-0 absolute" />
                      <div className="w-3 h-3 bg-white hidden group-hover:block"></div>
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter">Accept</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-6 h-6 border-2 border-slate-900 group-hover:bg-slate-900 transition-colors flex items-center justify-center">
                      <input type="radio" name="attending" className="opacity-0 absolute" />
                      <div className="w-3 h-3 bg-white hidden group-hover:block"></div>
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-900 transition-colors">Decline</span>
                  </label>
                </div>

                <button type="button" className={`w-full ${accentBg} ${accentHover} text-white py-6 text-xl font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95`}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 text-center text-slate-900 bg-slate-50">
        <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">{coupleNames}</h3>
        <p className="text-sm font-bold tracking-[0.3em] uppercase text-slate-400">{date}</p>
      </footer>
    </div>
  );
}
