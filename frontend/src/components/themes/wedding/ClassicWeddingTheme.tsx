import React from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Camera } from 'lucide-react';

interface ClassicWeddingThemeProps {
  content?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function ClassicWeddingTheme({ content, updateContent, isEditor }: ClassicWeddingThemeProps) {
  const defaultContent = {
    date: "September 15, 2026",
    location: "The Grand Estate, New York",
    schedule: [
      { time: "4:00 PM", event: "Ceremony" },
      { time: "5:30 PM", event: "Cocktail Hour" },
      { time: "7:00 PM", event: "Dinner & Dancing" }
    ],
    primaryColor: "#fdfbf7",
    accentColor: "#d4af37",
    textColor: "#333333"
  };

  const coupleNames = content?.hero_title || "Alex & Jordan";
  const story = content?.about_text || "We met in a little coffee shop on a rainy Tuesday, and the rest is history. We are so excited to celebrate this next chapter of our lives with you.";
  const date = content?.settings_json?.wedding?.date || defaultContent.date;
  const location = content?.contact_info?.address || defaultContent.location;
  const schedule = content?.settings_json?.wedding?.schedule || defaultContent.schedule;


  const handleChange = (field: string, value: any) => {
    if (!isEditor || !updateContent) return;
    updateContent({
      ...content,
      settings_json: {
        ...content?.settings_json,
        wedding: {
          ...data,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#333] font-serif selection:bg-[#d4af37] selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80" 
            alt="Wedding Cover" 
            className="w-full h-full object-cover opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/50 via-transparent to-[#fdfbf7]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Heart size={32} className="text-[#d4af37] fill-[#d4af37]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-wide text-slate-900 mb-6 font-serif italic">
            {coupleNames}
          </h1>
          
          <p className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-slate-700 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Are getting married
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-slate-600 font-medium tracking-widest uppercase text-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="flex items-center gap-3 border-b pb-2 md:border-b-0 md:border-r md:pr-12 border-[#d4af37]/30">
              <Calendar size={18} className="text-[#d4af37]" />
              {date}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#d4af37]" />
              {location}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif italic text-slate-900 mb-8">Our Story</h2>
          <div className="w-16 h-px bg-[#d4af37] mx-auto mb-10"></div>
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {story}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-24 px-4 bg-[#f9f7f1]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif italic text-slate-900 mb-6">Schedule of Events</h2>
            <div className="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center text-center p-8 bg-white border border-[#d4af37]/20 shadow-sm">
                <Clock size={28} className="text-[#d4af37] mb-6" />
                <h3 className="text-xl font-medium text-slate-900 mb-3 uppercase tracking-widest">
                  {item.event}
                </h3>
                <p className="text-[#d4af37] font-bold text-lg font-serif italic">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-2xl mx-auto text-center border-8 border-[#f9f7f1] p-12 relative bg-white z-10">
          <h2 className="text-4xl font-serif italic text-slate-900 mb-4">RSVP</h2>
          <p className="text-slate-500 mb-10 tracking-widest uppercase text-sm">Please let us know if you can make it</p>
          
          <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">First Name</label>
                <input type="text" className="w-full border-b-2 border-slate-200 py-3 outline-none focus:border-[#d4af37] transition-colors bg-transparent" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Last Name</label>
                <input type="text" className="w-full border-b-2 border-slate-200 py-3 outline-none focus:border-[#d4af37] transition-colors bg-transparent" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Will you be attending?</label>
              <div className="flex gap-6 mt-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="attending" className="accent-[#d4af37] w-4 h-4" />
                  <span className="text-slate-700 italic font-serif text-lg">Joyfully Accepts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="attending" className="accent-[#d4af37] w-4 h-4" />
                  <span className="text-slate-700 italic font-serif text-lg">Regretfully Declines</span>
                </label>
              </div>
            </div>

            <div className="pt-8">
              <button type="button" className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-white py-4 font-bold tracking-[0.2em] uppercase text-sm transition-colors shadow-lg shadow-[#d4af37]/20">
                Send RSVP
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm tracking-widest uppercase">
        <Heart size={16} className="inline-block mx-2 text-[#d4af37]" />
        <p className="mt-4">We can't wait to see you</p>
      </footer>
    </div>
  );
}
