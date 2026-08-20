import React from 'react';
import { Calendar, MapPin, Clock, Flower2 } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';

export default function FloralLayout({ content, colors }: WeddingLayoutProps) {
  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const date = content?.settings_json?.wedding?.date || "September 15, 2026";
  const location = content?.contact_info?.address || "The Grand Estate, New York";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "4:00 PM", event: "Ceremony" },
    { time: "5:30 PM", event: "Cocktail Hour" },
    { time: "7:00 PM", event: "Dinner & Dancing" }
  ];

  const { bgClass, sectionBg, accentText, accentBg, accentHover, borderClass, heroBg, heroOpacity } = colors;

  return (
    <div className={`min-h-screen ${bgClass} text-slate-800 font-serif font-light selection:${accentBg} selection:text-white transition-all duration-700`}>
      {/* Floating Particles Background (simulated) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-white/40 blur-[1px] animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-4 h-4 rounded-full bg-white/30 blur-[2px] animate-bounce delay-75"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/50 blur-[1px] animate-ping delay-150"></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-20 z-10">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={heroBg} 
            alt="Floral Cover" 
            className="w-full h-full object-cover mix-blend-overlay animate-in fade-in duration-[3000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center bg-white/40 backdrop-blur-sm p-12 md:p-20 rounded-[100px] border border-white/50 shadow-[0_0_50px_rgba(255,255,255,0.5)]">
          <Flower2 size={40} className={`${accentText} mb-8 animate-spin-slow opacity-80`} strokeWidth={1} />
          
          <h1 className={`text-6xl md:text-8xl lg:text-9xl mb-8 italic ${accentText} animate-in zoom-in-95 duration-1000`}>
            {coupleNames}
          </h1>
          
          <p className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-slate-600 mb-8 animate-in fade-in duration-1000 delay-300">
            Joyfully Invite You
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent mb-8"></div>
          
          <div className="flex flex-col items-center justify-center gap-4 text-slate-600 font-medium tracking-widest uppercase text-sm animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-3">
              <Calendar size={16} className={accentText} />
              {date}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className={accentText} />
              {location}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Soft, rounded, blooming */}
      <section className="py-32 px-4 relative z-10 overflow-hidden">
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/60 rounded-full blur-3xl"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className={`text-5xl italic text-slate-800 mb-12`}>Our Story</h2>
          <div className="bg-white/70 backdrop-blur-md p-12 rounded-[50px] shadow-xl border border-white">
            <p className="text-xl text-slate-600 leading-loose italic">
              "{story}"
            </p>
          </div>
        </div>
      </section>

      {/* Schedule - Watercolor style dividers */}
      <section className={`py-32 px-4 ${sectionBg} relative z-10 rounded-[100px] mx-4 md:mx-12 shadow-inner border border-white/50 mb-32`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <Flower2 size={24} className={`${accentText} mx-auto mb-6 opacity-60`} strokeWidth={1} />
            <h2 className={`text-5xl italic text-slate-800 mb-8`}>The Celebration</h2>
            <div className={`w-32 h-1 bg-gradient-to-r from-transparent via-${borderClass.replace('border-', '')} to-transparent mx-auto rounded-full`}></div>
          </div>
          
          <div className="space-y-16">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-8 group">
                <div className="md:w-1/2 text-right md:pr-12 border-b md:border-b-0 md:border-r border-slate-200/50 pb-6 md:pb-0 relative">
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-300 rounded-full hidden md:block group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-3xl italic text-slate-700 mb-2">{item.event}</h3>
                </div>
                <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <Clock size={20} className={`${accentText} opacity-70`} />
                    <p className={`text-xl font-medium tracking-widest uppercase ${accentText}`}>
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section - Soft rounded cards */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-16 rounded-[80px] shadow-2xl border border-white text-center">
          <Flower2 size={32} className={`${accentText} mx-auto mb-6 opacity-80`} strokeWidth={1} />
          <h2 className={`text-5xl italic text-slate-800 mb-6`}>RSVP</h2>
          <p className="text-slate-500 mb-12 tracking-widest uppercase text-xs font-medium">Kindly reply by August 15th</p>
          
          <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div>
                <input type="text" className="w-full border-b border-slate-300 py-4 outline-none focus:border-slate-500 transition-colors bg-transparent italic text-lg text-center placeholder-slate-400" placeholder="Names of Guests" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <label className="cursor-pointer group flex-1">
                <input type="radio" name="attending" className="hidden" />
                <div className="px-6 py-4 rounded-full border-2 border-slate-200 text-center group-hover:border-slate-400 transition-all">
                  <span className={`text-slate-600 italic text-lg`}>Will Attend</span>
                </div>
              </label>
              <label className="cursor-pointer group flex-1">
                <input type="radio" name="attending" className="hidden" />
                <div className="px-6 py-4 rounded-full border-2 border-slate-200 text-center group-hover:border-slate-400 transition-all">
                  <span className={`text-slate-600 italic text-lg`}>Unable to Attend</span>
                </div>
              </label>
            </div>

            <div className="pt-12 text-center">
              <button type="button" className={`px-16 py-5 rounded-full ${accentBg} ${accentHover} text-white font-medium tracking-[0.2em] uppercase text-sm transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl`}>
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-20 text-center">
        <h3 className={`text-3xl italic ${accentText} mb-4`}>{coupleNames}</h3>
        <p className="text-slate-400 text-xs tracking-[0.3em] uppercase">Forever & Always</p>
      </footer>
    </div>
  );
}
