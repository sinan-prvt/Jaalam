import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function MinimalLayout({ colors, coupleNames, date, location, story, schedule }: any) {
  return (
    <div className={`min-h-screen ${colors.bgClass} text-zinc-900 font-mono selection:${colors.accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center px-8 md:px-24">
        <div className="absolute top-12 left-12 right-12 bottom-12 border border-zinc-200 pointer-events-none z-20"></div>
        
        <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-8 ml-2">
            The Wedding Of
          </p>
          
          <h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-none mb-16 text-zinc-900 uppercase">
            {coupleNames.replace(' & ', ' \n & \n ')}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs uppercase tracking-[0.2em] text-zinc-500 border-t border-zinc-200 pt-8 max-w-2xl">
            <div className="flex items-center gap-4">
              <Calendar size={14} className="text-zinc-900" />
              {date}
            </div>
            <div className="flex items-center gap-4">
              <MapPin size={14} className="text-zinc-900" />
              {location}
            </div>
          </div>
        </div>

        {/* Minimal Hero Image - offset */}
        <div className="absolute top-24 right-24 w-1/3 h-2/3 hidden lg:block z-0 animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <img 
            src={colors.heroBg} 
            alt="Wedding Cover" 
            className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 object-top"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 px-8 md:px-24 border-t border-zinc-200 bg-white">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-12">
            01 — Our Story
          </p>
          <p className="text-2xl md:text-4xl leading-relaxed font-light tracking-tight text-zinc-800">
            {story}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className={`py-32 px-8 md:px-24 border-t border-zinc-200 ${colors.sectionBg}`}>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-20">
          02 — Itinerary
        </p>
          
        <div className="flex flex-col">
          {schedule.map((item: any, index: number) => (
            <div key={index} className="group grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-zinc-200 hover:border-zinc-900 transition-colors cursor-default">
              <div className="md:col-span-3 text-sm md:text-base font-medium tracking-widest uppercase text-zinc-500 group-hover:text-zinc-900 transition-colors">
                {item.time}
              </div>
              <div className="md:col-span-9 flex justify-between items-center">
                <h3 className="text-3xl md:text-5xl font-medium tracking-tighter uppercase text-zinc-900">
                  {item.event}
                </h3>
                <Clock size={24} className="text-zinc-300 group-hover:text-zinc-900 transition-colors opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-40 px-8 md:px-24 border-t border-zinc-200 bg-white">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-16">
            03 — RSVP
          </p>
          
          <form className="space-y-16" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 relative">
                <label className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-900 mb-4 block">First Name</label>
                <input type="text" className="w-full bg-zinc-50 px-6 py-5 outline-none focus:bg-zinc-100 transition-colors text-sm uppercase tracking-widest placeholder-zinc-300" placeholder="JANE" />
              </div>
              <div className="flex-1 relative">
                <label className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-900 mb-4 block">Last Name</label>
                <input type="text" className="w-full bg-zinc-50 px-6 py-5 outline-none focus:bg-zinc-100 transition-colors text-sm uppercase tracking-widest placeholder-zinc-300" placeholder="DOE" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-900 mb-6 block">Attendance</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-6 h-6 border border-zinc-300 rounded-none flex items-center justify-center group-hover:border-zinc-900 transition-colors">
                    <input type="radio" name="attending" className="w-3 h-3 appearance-none checked:bg-zinc-900 transition-colors" />
                  </div>
                  <span className="text-sm tracking-widest uppercase text-zinc-500 group-hover:text-zinc-900 transition-colors">Accepts</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-6 h-6 border border-zinc-300 rounded-none flex items-center justify-center group-hover:border-zinc-900 transition-colors">
                    <input type="radio" name="attending" className="w-3 h-3 appearance-none checked:bg-zinc-900 transition-colors" />
                  </div>
                  <span className="text-sm tracking-widest uppercase text-zinc-500 group-hover:text-zinc-900 transition-colors">Declines</span>
                </label>
              </div>
            </div>
            
            <button className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium tracking-[0.3em] uppercase px-12 py-6 transition-colors">
              Submit RSVP
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
