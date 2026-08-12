import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function ModernLayout({ colors, coupleNames, date, location, story, schedule }: any) {
  return (
    <div className={`min-h-screen ${colors.bgClass} text-zinc-900 font-sans selection:${colors.accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row overflow-hidden m-4 md:m-8 rounded-3xl bg-white shadow-2xl">
        <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative z-10 bg-white">
          <div className="animate-in slide-in-from-left-8 duration-1000">
            <span className={`inline-block px-4 py-1.5 ${colors.accentBg} text-white text-xs font-black uppercase tracking-widest mb-8 rounded-full shadow-lg`}>
              We Are Getting Married
            </span>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 text-zinc-900 drop-shadow-sm">
              {coupleNames.replace(' & ', '\n&\n')}
            </h1>
            
            <div className="flex flex-col gap-6 font-bold tracking-widest uppercase text-sm border-l-4 pl-6 animate-in slide-in-from-left-8 duration-1000 delay-300" style={{borderColor: 'currentColor'}}>
              <div className="flex items-center gap-4 text-zinc-800">
                <Calendar size={24} className={colors.accentText} />
                {date}
              </div>
              <div className="flex items-center gap-4 text-zinc-800">
                <MapPin size={24} className={colors.accentText} />
                {location}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 relative min-h-[50vh] md:min-h-full">
          <div className="absolute inset-0 bg-zinc-900 z-10 animate-slide-up-fade origin-bottom" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}></div>
          <img 
            src={colors.heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover grayscale mix-blend-luminosity opacity-80 scale-105 hover:scale-110 hover:grayscale-0 transition-all duration-[2000ms]`}
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-16">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-900 md:w-1/3 sticky top-32">
          Our<br/>Story
          <div className={`w-32 h-2 ${colors.accentBg} mt-8`}></div>
        </h2>
        <div className="md:w-2/3">
          <p className="text-2xl md:text-4xl font-medium text-zinc-600 leading-tight tracking-tight">
            {story}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className={`py-32 px-8 ${colors.sectionBg} rounded-[3rem] mx-4 md:mx-8 shadow-inner`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
              The<br/>Details
            </h2>
            <ArrowRight size={64} className={`${colors.accentText} animate-pulse hidden md:block`} />
          </div>
          
          <div className="flex flex-col gap-4">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 md:p-12 bg-white rounded-3xl hover:bg-zinc-900 hover:text-white transition-colors duration-500 shadow-sm border border-zinc-100 cursor-default">
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <Clock size={48} className={`${colors.accentText} group-hover:text-white transition-colors`} />
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                    {item.event}
                  </h3>
                </div>
                <p className={`${colors.accentText} group-hover:text-white transition-colors font-bold text-2xl md:text-3xl tracking-wider`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-40 px-8 relative max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-zinc-900 mb-6">RSVP</h2>
          <div className={`w-32 h-4 ${colors.accentBg} mx-auto`}></div>
        </div>
        
        <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative group">
              <input type="text" id="modern-fname" className="peer w-full border-b-4 border-zinc-200 py-4 outline-none focus:border-zinc-900 transition-colors bg-transparent text-2xl font-bold placeholder-transparent" placeholder="Jane" />
              <label htmlFor="modern-fname" className="absolute left-0 -top-6 text-sm font-black tracking-widest uppercase text-zinc-400 peer-placeholder-shown:text-xl peer-placeholder-shown:top-4 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-900 transition-all cursor-text">First Name</label>
            </div>
            <div className="relative group">
              <input type="text" id="modern-lname" className="peer w-full border-b-4 border-zinc-200 py-4 outline-none focus:border-zinc-900 transition-colors bg-transparent text-2xl font-bold placeholder-transparent" placeholder="Doe" />
              <label htmlFor="modern-lname" className="absolute left-0 -top-6 text-sm font-black tracking-widest uppercase text-zinc-400 peer-placeholder-shown:text-xl peer-placeholder-shown:top-4 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-zinc-900 transition-all cursor-text">Last Name</label>
            </div>
          </div>
          
          <div className="pt-8">
            <h3 className="text-sm font-black tracking-widest uppercase text-zinc-900 mb-8">Will you be attending?</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <label className="flex-1 cursor-pointer group">
                <input type="radio" name="attending" className="peer sr-only" />
                <div className={`p-8 border-4 border-zinc-200 rounded-2xl peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white transition-all text-center`}>
                  <span className="font-black uppercase tracking-widest text-xl">Accepts</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer group">
                <input type="radio" name="attending" className="peer sr-only" />
                <div className={`p-8 border-4 border-zinc-200 rounded-2xl peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white transition-all text-center`}>
                  <span className="font-black uppercase tracking-widest text-xl">Declines</span>
                </div>
              </label>
            </div>
          </div>
          
          <button className={`w-full py-8 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] text-2xl transition-transform hover:scale-[1.02] mt-12 rounded-2xl shadow-2xl`}>
            Send RSVP
          </button>
        </form>
      </section>
    </div>
  );
}
