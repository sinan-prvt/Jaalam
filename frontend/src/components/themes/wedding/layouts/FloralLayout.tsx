import React from 'react';
import { Calendar, MapPin, Clock, Flower2 } from 'lucide-react';

export default function FloralLayout({ colors, coupleNames, date, location, story, schedule }: any) {
  return (
    <div className={`min-h-screen ${colors.bgClass} text-slate-800 font-serif selection:${colors.accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={colors.heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover blur-[2px] scale-110`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto p-12 md:p-24 bg-white/60 backdrop-blur-md rounded-full shadow-[0_0_60px_rgba(255,255,255,0.8)] border-4 border-white/80 animate-in fade-in zoom-in duration-1000">
          <div className="mb-8 opacity-90 animate-spin-slow flex justify-center">
            <Flower2 size={48} className={`${colors.accentText} fill-current opacity-80`} />
          </div>
          
          <h1 className={`text-6xl md:text-8xl text-slate-800 mb-8 font-serif italic transition-all duration-700 tracking-wide`}>
            {coupleNames}
          </h1>
          
          <p className={`text-xl md:text-3xl font-serif italic ${colors.accentText} mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300`}>
            Are getting married
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-slate-600 font-medium tracking-widest uppercase text-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className={`flex items-center gap-3 border-b pb-2 md:border-b-0 md:border-r md:pr-16 ${colors.borderClass}`}>
              <Calendar size={20} className={colors.accentText} />
              {date}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className={colors.accentText} />
              {location}
            </div>
          </div>
        </div>
        
        {/* Floating petals animation could go here in a real impl */}
      </section>

      {/* Our Story */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-white/40 p-12 md:p-20 rounded-[3rem] backdrop-blur-sm border border-white shadow-xl">
          <div className="flex justify-center mb-8">
            <Flower2 size={32} className={`${colors.accentText} opacity-60`} />
          </div>
          <h2 className={`text-5xl font-serif italic ${colors.accentText} mb-8 transition-all`}>Our Story</h2>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-serif italic px-4 md:px-12">
            "{story}"
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className={`py-32 px-4 ${colors.sectionBg} transition-colors duration-700 relative`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-serif italic ${colors.accentText} mb-6 transition-all`}>Schedule of Events</h2>
            <div className={`w-32 h-px bg-gradient-to-r from-transparent via-${colors.accentText} to-transparent mx-auto opacity-30`}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schedule.map((item: any, index: number) => (
              <div key={index} className={`relative flex flex-col items-center text-center p-12 bg-white/80 backdrop-blur-md rounded-[2rem] border ${colors.borderClass} shadow-lg hover:-translate-y-4 hover:shadow-2xl transition-all duration-700 group overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${colors.accentBg} opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-700`}></div>
                <Clock size={36} className={`${colors.accentText} mb-8 opacity-70`} />
                <h3 className="text-2xl font-serif italic text-slate-800 mb-4">
                  {item.event}
                </h3>
                <p className={`${colors.accentText} font-medium text-lg font-serif tracking-widest uppercase`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-40 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[800px] bg-gradient-to-tr from-pink-50 via-white to-purple-50 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className={`max-w-3xl mx-auto text-center border px-8 py-20 md:p-24 rounded-[4rem] relative bg-white/80 backdrop-blur-xl z-10 shadow-2xl ${colors.borderClass}`}>
          <div className="flex justify-center mb-6">
            <Flower2 size={40} className={`${colors.accentText} opacity-80`} />
          </div>
          <h2 className={`text-5xl md:text-6xl font-serif italic ${colors.accentText} mb-6 transition-all`}>RSVP</h2>
          <p className="text-slate-500 mb-16 tracking-widest uppercase text-sm font-medium">Please let us know if you can make it</p>
          
          <form className="space-y-10 text-left max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-8">
              <div>
                <input type="text" className={`w-full border-b border-slate-300 py-4 outline-none focus:${colors.borderClass} transition-colors bg-transparent text-xl font-serif italic text-center placeholder-slate-300`} placeholder="First Name" />
              </div>
              <div>
                <input type="text" className={`w-full border-b border-slate-300 py-4 outline-none focus:${colors.borderClass} transition-colors bg-transparent text-xl font-serif italic text-center placeholder-slate-300`} placeholder="Last Name" />
              </div>
            </div>
            
            <div className="pt-8">
              <div className="flex flex-col gap-4">
                <label className={`flex items-center justify-center gap-4 cursor-pointer p-6 border ${colors.borderClass} rounded-full hover:bg-slate-50 transition-colors group`}>
                  <input type="radio" name="attending" className="w-5 h-5 accent-pink-400" />
                  <span className={`text-slate-600 group-hover:${colors.accentText} italic font-serif text-2xl transition-colors`}>Joyfully Accepts</span>
                </label>
                <label className={`flex items-center justify-center gap-4 cursor-pointer p-6 border ${colors.borderClass} rounded-full hover:bg-slate-50 transition-colors group`}>
                  <input type="radio" name="attending" className="w-5 h-5 accent-pink-400" />
                  <span className={`text-slate-600 group-hover:${colors.accentText} italic font-serif text-2xl transition-colors`}>Regretfully Declines</span>
                </label>
              </div>
            </div>
            
            <button className={`w-full py-6 ${colors.accentBg} text-white font-serif italic text-2xl tracking-wide transition-all hover:scale-105 hover:shadow-xl mt-12 rounded-full`}>
              Send RSVP
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
