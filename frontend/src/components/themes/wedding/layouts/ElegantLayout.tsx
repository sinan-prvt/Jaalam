import React from 'react';
import { Calendar, MapPin, Clock, Diamond } from 'lucide-react';

export default function ElegantLayout({ colors, coupleNames, date, location, story, schedule }: any) {
  return (
    <div className={`min-h-screen ${colors.bgClass} text-slate-800 font-serif selection:${colors.accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={colors.heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover opacity-80 scale-100 hover:scale-105 transition-transform duration-[3000ms]`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80"></div>
          
          {/* Subtle gold overlay for elegant effect */}
          <div className="absolute inset-0 bg-[#d4af37]/10 mix-blend-overlay pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto p-12 flex flex-col items-center border border-[#d4af37]/30 bg-black/20 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <div className="mb-12 opacity-90 animate-pulse">
            <Diamond size={32} className={`text-[#d4af37] fill-current`} />
          </div>
          
          <h1 className={`text-5xl md:text-7xl lg:text-8xl text-white mb-8 font-serif tracking-widest uppercase transition-all duration-700 font-light`}>
            {coupleNames}
          </h1>
          
          <div className="w-px h-24 bg-gradient-to-b from-[#d4af37] to-transparent mb-12 animate-in slide-in-from-top-12 duration-1000 delay-500"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 text-[#d4af37] font-light tracking-[0.3em] uppercase text-xs md:text-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <div className={`flex items-center gap-4`}>
              {date}
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#d4af37]"></div>
            <div className="flex items-center gap-4">
              {location}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-40 px-6 bg-zinc-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-serif font-light text-white tracking-[0.2em] uppercase mb-16 transition-all`}>Our Story</h2>
          <p className="text-xl md:text-2xl text-zinc-400 leading-[2.5] font-serif font-light">
            {story}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className={`py-40 px-6 bg-zinc-950 transition-colors duration-700 relative`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className={`text-4xl md:text-5xl font-serif font-light text-[#d4af37] tracking-[0.2em] uppercase mb-8 transition-all`}>Itinerary</h2>
            <div className={`w-px h-16 bg-gradient-to-b from-[#d4af37]/50 to-transparent mx-auto`}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {schedule.map((item: any, index: number) => (
              <div key={index} className={`flex flex-col items-center text-center p-14 bg-zinc-900 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all duration-700 group`}>
                <Clock size={24} className={`text-[#d4af37] mb-10 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`} />
                <h3 className="text-xl md:text-2xl font-serif font-light text-white tracking-widest uppercase mb-6">
                  {item.event}
                </h3>
                <p className={`text-[#d4af37] font-light text-sm tracking-[0.3em] uppercase`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-40 px-6 bg-zinc-900 relative">
        <div className={`max-w-3xl mx-auto text-center border border-[#d4af37]/30 p-12 md:p-20 relative bg-zinc-950/80 backdrop-blur-sm z-10 shadow-2xl`}>
          <div className="flex justify-center mb-10">
            <Diamond size={24} className={`text-[#d4af37] opacity-80`} />
          </div>
          <h2 className={`text-4xl md:text-5xl font-serif font-light text-white tracking-[0.2em] uppercase mb-6 transition-all`}>RSVP</h2>
          <p className="text-zinc-500 mb-16 tracking-[0.2em] uppercase text-xs">Kindly Respond</p>
          
          <form className="space-y-12 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <input type="text" className={`w-full border-b border-[#d4af37]/30 py-4 outline-none focus:border-[#d4af37] transition-colors bg-transparent text-lg text-white font-serif font-light tracking-wide placeholder-zinc-700 text-center`} placeholder="First Name" />
              </div>
              <div>
                <input type="text" className={`w-full border-b border-[#d4af37]/30 py-4 outline-none focus:border-[#d4af37] transition-colors bg-transparent text-lg text-white font-serif font-light tracking-wide placeholder-zinc-700 text-center`} placeholder="Last Name" />
              </div>
            </div>
            
            <div className="pt-8">
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <label className={`flex items-center justify-center gap-4 cursor-pointer px-8 py-5 border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-colors group flex-1`}>
                  <input type="radio" name="attending" className="w-4 h-4 accent-[#d4af37]" />
                  <span className={`text-zinc-400 group-hover:text-white font-serif font-light tracking-widest uppercase text-sm transition-colors`}>Accepts with Pleasure</span>
                </label>
                <label className={`flex items-center justify-center gap-4 cursor-pointer px-8 py-5 border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-colors group flex-1`}>
                  <input type="radio" name="attending" className="w-4 h-4 accent-[#d4af37]" />
                  <span className={`text-zinc-400 group-hover:text-white font-serif font-light tracking-widest uppercase text-sm transition-colors`}>Declines with Regret</span>
                </label>
              </div>
            </div>
            
            <button className={`w-full py-6 bg-[#d4af37] text-zinc-950 font-serif tracking-[0.3em] uppercase text-sm transition-all hover:bg-white hover:text-zinc-950 mt-16 shadow-[0_0_30px_rgba(212,175,55,0.2)]`}>
              Submit RSVP
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
