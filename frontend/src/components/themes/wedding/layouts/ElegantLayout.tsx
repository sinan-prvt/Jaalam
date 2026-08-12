import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function ElegantLayout({ content, colors }: WeddingLayoutProps) {
  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const date = content?.settings_json?.wedding?.date || "September 15, 2026";
  const location = content?.contact_info?.address || "The Grand Estate, New York";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "4:00 PM", event: "Ceremony" },
    { time: "5:30 PM", event: "Cocktail Hour" },
    { time: "7:00 PM", event: "Dinner & Dancing" }
  ];

  const { bgClass, sectionBg, accentText, accentBg, borderClass, heroBg } = colors;

  return (
    <div className={`min-h-screen ${bgClass} text-slate-100 font-serif selection:${accentBg} selection:text-white transition-all duration-700 bg-black`}>
      {/* Cinematic Hero */}
      <section className="relative h-[120vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Elegant Cover" 
            className="w-full h-full object-cover opacity-60 scale-110 translate-y-[-10%] parallax-bg"
            style={{ transform: 'translateY(calc(var(--scroll, 0) * 0.5px)) scale(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
          <div className="w-px h-32 bg-gradient-to-b from-transparent to-white/50 mb-12 animate-in slide-in-from-top-full duration-1000"></div>
          
          <p className={`text-sm md:text-base font-light tracking-[0.4em] uppercase mb-6 ${accentText} animate-in fade-in duration-1000 delay-300`}>
            The Wedding Celebration Of
          </p>
          
          <h1 className={`text-6xl md:text-8xl lg:text-[10rem] text-white mb-12 font-serif font-light tracking-widest uppercase leading-none drop-shadow-2xl animate-in zoom-in-95 duration-1000 delay-500`}>
            {coupleNames.split('&')[0].trim()}
            <span className={`block text-3xl md:text-5xl my-4 ${accentText} italic lowercase font-medium`}>and</span>
            {coupleNames.split('&')[1]?.trim() || "Jordan"}
          </h1>
          
          <div className="flex items-center gap-12 text-white font-light tracking-widest uppercase text-xs md:text-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <div className="flex items-center gap-3">
              <Calendar size={16} className={accentText} />
              {date}
            </div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className={accentText} />
              {location}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Gold foil shimmer effects (simulated with gradients) */}
      <section className="py-32 px-4 relative z-10 bg-black">
        <div className="max-w-4xl mx-auto relative">
          {/* Decorative frame */}
          <div className={`absolute -inset-8 border ${borderClass} opacity-20 pointer-events-none`}></div>
          <div className={`absolute -inset-12 border border-white/5 pointer-events-none`}></div>
          
          <div className="bg-zinc-950 p-16 text-center shadow-2xl relative overflow-hidden group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
            
            <h2 className={`text-4xl md:text-5xl font-light uppercase tracking-widest text-white mb-12 ${accentText}`}>The Story</h2>
            <p className="text-xl md:text-2xl font-light text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              {story}
            </p>
            <div className={`w-px h-16 bg-gradient-to-b from-${accentText.replace('text-', '')} to-transparent mx-auto mt-16 opacity-50`}></div>
          </div>
        </div>
      </section>

      {/* Schedule - Overlapping elegant cards */}
      <section className={`py-40 px-4 ${sectionBg} bg-zinc-950 relative overflow-hidden`}>
        {/* Background glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${accentBg} opacity-5 blur-[150px] rounded-full`}></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className={`text-4xl md:text-5xl font-light uppercase tracking-widest text-white mb-6 ${accentText}`}>Itinerary</h2>
            <p className="text-zinc-500 tracking-[0.2em] uppercase text-sm">A Day to Remember</p>
          </div>
          
          <div className="flex flex-col gap-12">
            {schedule.map((item: any, index: number) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} group`}>
                <div className="md:w-1/2 flex justify-center">
                  <div className={`w-48 h-64 md:w-64 md:h-80 border ${borderClass} opacity-30 p-4 relative group-hover:opacity-100 transition-opacity duration-700`}>
                    <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:-200%_0,0_0] hover:duration-[1500ms]"></div>
                      <Clock size={32} className={`${accentText} mb-6 opacity-80`} strokeWidth={1} />
                      <p className="text-2xl font-light tracking-widest text-white">{item.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`md:w-1/2 text-center ${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-4xl font-light uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors duration-500 mb-4">
                    {item.event}
                  </h3>
                  <div className={`w-24 h-px ${accentBg} opacity-50 ${index % 2 !== 0 ? 'ml-auto' : 'mr-auto'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section - Immersive dark */}
      <section className="py-40 px-4 bg-black relative">
        <div className="max-w-3xl mx-auto border-y border-white/10 py-24 text-center">
          <h2 className={`text-4xl md:text-5xl font-light uppercase tracking-widest text-white mb-8 ${accentText}`}>Reserve Your Seat</h2>
          <p className="text-zinc-500 mb-16 tracking-[0.2em] uppercase text-sm">We request the honor of your presence</p>
          
          <form className="space-y-12 text-left px-8 md:px-0" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="block text-xs font-light tracking-[0.2em] uppercase text-zinc-500 mb-4">First Name</label>
                <input type="text" className={`w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-white text-white transition-colors uppercase tracking-widest font-light`} />
              </div>
              <div>
                <label className="block text-xs font-light tracking-[0.2em] uppercase text-zinc-500 mb-4">Last Name</label>
                <input type="text" className={`w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-white text-white transition-colors uppercase tracking-widest font-light`} />
              </div>
            </div>
            
            <div className="pt-8">
              <label className="block text-xs font-light tracking-[0.2em] uppercase text-zinc-500 mb-8 text-center">Will you attend?</label>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <label className="cursor-pointer group">
                  <input type="radio" name="attending" className="hidden" />
                  <div className={`px-12 py-5 border border-white/20 text-center group-hover:border-white transition-all bg-black/50 backdrop-blur-sm`}>
                    <span className={`text-zinc-300 font-light tracking-widest uppercase text-sm`}>Accepts with Pleasure</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="radio" name="attending" className="hidden" />
                  <div className={`px-12 py-5 border border-white/20 text-center group-hover:border-white transition-all bg-black/50 backdrop-blur-sm`}>
                    <span className={`text-zinc-300 font-light tracking-widest uppercase text-sm`}>Declines with Regret</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-16 text-center">
              <button type="button" className={`px-16 py-6 ${accentBg} text-white font-light tracking-[0.3em] uppercase text-sm transition-all hover:brightness-110 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-24 text-center bg-black">
        <div className={`w-8 h-8 mx-auto border ${borderClass} opacity-50 rotate-45 mb-12`}></div>
        <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase">A Celebration of Love</p>
      </footer>
    </div>
  );
}
