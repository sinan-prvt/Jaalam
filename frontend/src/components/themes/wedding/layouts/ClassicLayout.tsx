import React from 'react';
import { Calendar, MapPin, Clock, Heart } from 'lucide-react';

export default function ClassicLayout({ colors, coupleNames, date, location, story, schedule }: any) {
  return (
    <div className={`min-h-screen ${colors.bgClass} text-slate-800 font-serif selection:${colors.accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-[16px] border-white/50 m-4 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={colors.heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover mix-blend-multiply ${colors.heroOpacity} transition-all duration-1000 scale-105 animate-pulse`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Heart size={32} className={`${colors.accentText} fill-current`} />
          </div>
          
          <h1 className={`text-6xl md:text-8xl text-slate-900 mb-6 font-serif italic transition-all duration-700 drop-shadow-sm`}>
            {coupleNames}
          </h1>
          
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-slate-800 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 drop-shadow-md">
            Are getting married
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-slate-900 font-bold tracking-widest uppercase text-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 bg-white/70 backdrop-blur-md px-10 py-5 rounded-full shadow-lg border border-white">
            <div className={`flex items-center gap-3 border-b pb-2 md:border-b-0 md:border-r md:pr-12 ${colors.borderClass}`}>
              <Calendar size={18} className={colors.accentText} />
              {date}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className={colors.accentText} />
              {location}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 px-4 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className={`text-5xl font-serif italic text-slate-900 mb-8 transition-all`}>Our Story</h2>
          <div className={`w-24 h-px ${colors.accentBg} mx-auto mb-12`}></div>
          <p className="text-xl text-slate-700 leading-loose font-serif drop-shadow-sm">
            {story}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className={`py-32 px-4 ${colors.sectionBg} transition-colors duration-700`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-serif italic text-slate-900 mb-6 transition-all`}>Schedule of Events</h2>
            <div className={`w-24 h-px ${colors.accentBg} mx-auto`}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {schedule.map((item: any, index: number) => (
              <div key={index} className={`flex flex-col items-center text-center p-10 bg-white border ${colors.borderClass} shadow-xl hover:-translate-y-2 transition-transform duration-500 rounded-lg`}>
                <Clock size={32} className={`${colors.accentText} mb-8`} />
                <h3 className="text-2xl font-serif italic text-slate-900 mb-4">
                  {item.event}
                </h3>
                <p className={`${colors.accentText} font-bold text-lg font-sans tracking-widest uppercase`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-32 px-4 bg-white relative">
        <div className={`max-w-2xl mx-auto text-center border-8 border-[#f9f7f1] p-16 relative bg-white z-10 shadow-2xl`}>
          <h2 className={`text-5xl font-serif italic text-slate-900 mb-6 transition-all`}>RSVP</h2>
          <p className="text-slate-500 mb-12 tracking-widest uppercase text-sm">Please let us know if you can make it</p>
          
          <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">First Name</label>
                <input type="text" className={`w-full border-b-2 border-slate-200 py-3 outline-none focus:${colors.borderClass} transition-colors bg-transparent text-lg`} placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Last Name</label>
                <input type="text" className={`w-full border-b-2 border-slate-200 py-3 outline-none focus:${colors.borderClass} transition-colors bg-transparent text-lg`} placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">Will you be attending?</label>
              <div className="flex flex-col sm:flex-row gap-6 mt-3">
                <label className="flex items-center gap-4 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 flex-1">
                  <input type="radio" name="attending" className="w-5 h-5 accent-slate-900" />
                  <span className={`text-slate-700 italic font-serif text-xl`}>Joyfully Accepts</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 flex-1">
                  <input type="radio" name="attending" className="w-5 h-5 accent-slate-900" />
                  <span className={`text-slate-700 italic font-serif text-xl`}>Regretfully Declines</span>
                </label>
              </div>
            </div>
            
            <button className={`w-full py-5 ${colors.accentBg} hover:opacity-90 text-white font-serif italic text-2xl tracking-wide transition-colors mt-8 shadow-xl rounded-lg`}>
              Send RSVP
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
