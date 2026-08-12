import React from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Camera } from 'lucide-react';

interface ClassicWeddingThemeProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function ClassicWeddingTheme({ content, website, updateContent, isEditor }: ClassicWeddingThemeProps) {
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

  const theme = website?.theme || 'Classic';

  let fontClass = "font-serif";
  let bgClass = "bg-[#fdfbf7]";
  let sectionBg = "bg-[#f9f7f1]";
  let accentText = "text-[#d4af37]";
  let accentBg = "bg-[#d4af37]";
  let accentHover = "hover:bg-[#b5952f]";
  let borderClass = "border-[#d4af37]";
  let italicClass = "italic";
  let titleFont = "font-serif";
  let heroOpacity = "opacity-40";

  if (theme === 'Modern') {
    fontClass = "font-sans tracking-tight";
    bgClass = "bg-white";
    sectionBg = "bg-zinc-50";
    accentText = "text-zinc-900";
    accentBg = "bg-zinc-900";
    accentHover = "hover:bg-zinc-800";
    borderClass = "border-zinc-200";
    italicClass = "";
    titleFont = "font-sans font-black uppercase tracking-tighter";
    heroOpacity = "opacity-30 grayscale";
  } else if (theme === 'Floral') {
    fontClass = "font-serif font-light";
    bgClass = "bg-rose-50/30";
    sectionBg = "bg-rose-50/60";
    accentText = "text-rose-500";
    accentBg = "bg-rose-400";
    accentHover = "hover:bg-rose-500";
    borderClass = "border-rose-200";
    italicClass = "italic";
    titleFont = "font-serif";
    heroOpacity = "opacity-60";
  } else if (theme === 'Minimal') {
    fontClass = "font-mono uppercase tracking-widest text-xs";
    bgClass = "bg-[#F3F4F6]";
    sectionBg = "bg-white";
    accentText = "text-slate-800";
    accentBg = "bg-slate-800";
    accentHover = "hover:bg-slate-900";
    borderClass = "border-slate-300";
    italicClass = "";
    titleFont = "font-mono font-medium tracking-[-0.05em]";
    heroOpacity = "opacity-20 sepia";
  }

  return (
    <div className={`min-h-screen ${bgClass} text-slate-800 ${fontClass} selection:${accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80" 
            alt="Wedding Cover" 
            className="w-full h-full object-cover opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          {theme !== 'Minimal' && (
            <div className="mb-6 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Heart size={32} className={`${accentText} fill-current`} />
            </div>
          )}
          
          <h1 className={`text-5xl md:text-7xl lg:text-8xl text-slate-900 mb-6 ${titleFont} ${italicClass} transition-all duration-700`}>
            {coupleNames}
          </h1>
          
          <p className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-slate-700 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Are getting married
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-slate-800 font-bold tracking-widest uppercase text-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className={`flex items-center gap-3 border-b pb-2 md:border-b-0 md:border-r md:pr-12 ${borderClass}`}>
              <Calendar size={18} className={accentText} />
              {date}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className={accentText} />
              {location}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl ${titleFont} ${italicClass} text-slate-900 mb-8 transition-all`}>Our Story</h2>
          <div className={`w-16 h-px ${accentBg} mx-auto mb-10`}></div>
          <p className="text-lg text-slate-600 leading-relaxed">
            {story}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className={`py-24 px-4 ${sectionBg} transition-colors duration-700`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl ${titleFont} ${italicClass} text-slate-900 mb-6 transition-all`}>Schedule of Events</h2>
            <div className={`w-16 h-px ${accentBg} mx-auto`}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {schedule.map((item: any, index: number) => (
              <div key={index} className={`flex flex-col items-center text-center p-8 bg-white border ${borderClass} shadow-sm transition-all`}>
                <Clock size={28} className={`${accentText} mb-6`} />
                <h3 className="text-xl font-medium text-slate-900 mb-3 uppercase tracking-widest">
                  {item.event}
                </h3>
                <p className={`${accentText} font-bold text-lg ${titleFont} ${italicClass}`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className={`max-w-2xl mx-auto text-center border-8 ${theme === 'Minimal' ? 'border-zinc-100' : 'border-[#f9f7f1]'} p-12 relative bg-white z-10 transition-colors`}>
          <h2 className={`text-4xl ${titleFont} ${italicClass} text-slate-900 mb-4 transition-all`}>RSVP</h2>
          <p className="text-slate-500 mb-10 tracking-widest uppercase text-sm">Please let us know if you can make it</p>
          
          <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">First Name</label>
                <input type="text" className={`w-full border-b-2 border-slate-200 py-3 outline-none focus:${borderClass} transition-colors bg-transparent`} placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Last Name</label>
                <input type="text" className={`w-full border-b-2 border-slate-200 py-3 outline-none focus:${borderClass} transition-colors bg-transparent`} placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Will you be attending?</label>
              <div className="flex gap-6 mt-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="attending" className="w-4 h-4" />
                  <span className={`text-slate-700 ${italicClass} ${titleFont} text-lg`}>Joyfully Accepts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="attending" className="w-4 h-4" />
                  <span className={`text-slate-700 ${italicClass} ${titleFont} text-lg`}>Regretfully Declines</span>
                </label>
              </div>
            </div>

            <div className="pt-8">
              <button type="button" className={`w-full ${accentBg} ${accentHover} text-white py-4 font-bold tracking-[0.2em] uppercase text-sm transition-colors shadow-lg`}>
                Send RSVP
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm tracking-widest uppercase">
        <Heart size={16} className={`inline-block mx-2 ${accentText}`} />
        <p className="mt-4">We can't wait to see you</p>
      </footer>
    </div>
  );
}
