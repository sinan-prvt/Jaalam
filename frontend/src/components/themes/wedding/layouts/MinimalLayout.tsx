import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Menu, X } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function MinimalLayout({ content, colors }: WeddingLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const date = content?.settings_json?.wedding?.date || "September 15, 2026";
  const location = content?.contact_info?.address || "The Grand Estate, New York";
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "4:00 PM", event: "Ceremony" },
    { time: "5:30 PM", event: "Cocktail Hour" },
    { time: "7:00 PM", event: "Dinner & Dancing" }
  ];

  const { accentText, heroBg } = colors;

  return (
    <div className={`min-h-screen bg-zinc-50 text-zinc-900 font-mono selection:bg-zinc-900 selection:text-white transition-all duration-700`}>
      {/* Hidden Menu */}
      <button 
        onClick={() => setMenuOpen(true)}
        className="fixed top-8 right-8 z-50 p-4 mix-blend-difference text-white hover:scale-90 transition-transform"
      >
        <Menu size={24} strokeWidth={1} />
      </button>

      <div className={`fixed inset-0 bg-zinc-900 text-white z-50 transition-all duration-700 flex flex-col justify-center items-center ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => setMenuOpen(false)}
          className="absolute top-8 right-8 p-4 hover:rotate-90 transition-transform duration-500"
        >
          <X size={24} strokeWidth={1} />
        </button>
        
        <nav className="flex flex-col gap-8 text-center text-xs uppercase tracking-[0.5em]">
          <a href="#home" onClick={() => setMenuOpen(false)} className="hover:text-zinc-500 transition-colors">Home</a>
          <a href="#story" onClick={() => setMenuOpen(false)} className="hover:text-zinc-500 transition-colors">Story</a>
          <a href="#schedule" onClick={() => setMenuOpen(false)} className="hover:text-zinc-500 transition-colors">Schedule</a>
          <a href="#rsvp" onClick={() => setMenuOpen(false)} className="hover:text-zinc-500 transition-colors">RSVP</a>
        </nav>
      </div>

      {/* Hero Section */}
      <section id="home" className="h-screen flex flex-col justify-between p-8 md:p-16 relative">
        <div className="absolute inset-x-16 inset-y-16 z-0 overflow-hidden">
          <img 
            src={heroBg} 
            alt="Minimal Cover" 
            className="w-full h-full object-cover grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-[3000ms] animate-in blur-sm hover:blur-none"
          />
        </div>

        <div className="relative z-10 w-full flex justify-between items-start text-xs uppercase tracking-widest text-zinc-500">
          <div>{date}</div>
          <div>{location.split(',')[0]}</div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          <h1 className="text-4xl md:text-7xl font-light uppercase tracking-[-0.05em] mb-4 text-center mix-blend-difference text-white">
            {coupleNames}
          </h1>
          <div className="w-px h-24 bg-zinc-300 mt-8 animate-pulse"></div>
        </div>
      </section>

      {/* Our Story - Stark, whitespace */}
      <section id="story" className="py-40 px-8 max-w-4xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-16">01. The Story</h2>
        <p className={`text-2xl md:text-4xl font-light leading-snug tracking-tight text-zinc-800 ${accentText}`}>
          {story}
        </p>
      </section>

      {/* Schedule - Minimal lines */}
      <section id="schedule" className="py-40 px-8 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-16">02. Itinerary</h2>
          
          <div className="flex flex-col">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="group relative border-b border-zinc-100 py-12 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="absolute bottom-0 left-0 w-0 h-px bg-zinc-900 group-hover:w-full transition-all duration-1000 ease-out"></div>
                
                <h3 className="text-2xl font-light tracking-tight text-zinc-900 mb-4 md:mb-0">
                  {item.event}
                </h3>
                
                <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-900 transition-colors">
                  <Clock size={14} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section - Ultra minimal form */}
      <section id="rsvp" className="min-h-screen flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-16 text-center">03. RSVP</h2>
          
          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <input type="text" id="name" className="w-full bg-transparent border-b border-zinc-300 py-4 text-xl font-light outline-none peer text-zinc-900" placeholder=" " />
              <label htmlFor="name" className="absolute left-0 top-4 text-zinc-400 text-xs uppercase tracking-[0.2em] transition-all peer-focus:-top-4 peer-focus:text-xs peer-placeholder-shown:text-xl peer-placeholder-shown:top-4 peer-placeholder-shown:tracking-normal">
                Full Name
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-zinc-900 group-focus-within:w-full transition-all duration-500"></div>
            </div>
            
            <div className="flex justify-between gap-8 pt-8">
              <label className="flex-1 cursor-pointer group text-center">
                <input type="radio" name="attending" className="hidden" />
                <div className="py-4 border border-zinc-200 group-hover:border-zinc-900 transition-colors text-xs uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-900">
                  Accept
                </div>
              </label>
              <label className="flex-1 cursor-pointer group text-center">
                <input type="radio" name="attending" className="hidden" />
                <div className="py-4 border border-zinc-200 group-hover:border-zinc-900 transition-colors text-xs uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-900">
                  Decline
                </div>
              </label>
            </div>

            <div className="pt-16">
              <button type="button" className="w-full bg-zinc-900 text-white py-6 text-xs uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 text-center border-t border-zinc-100">
        <p className="text-xs text-zinc-400 tracking-[0.5em] uppercase">{coupleNames}</p>
      </footer>
    </div>
  );
}
