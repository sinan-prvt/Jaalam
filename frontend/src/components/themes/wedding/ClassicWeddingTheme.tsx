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
  const category = website?.business_type || 'Wedding Invitation';

  // 1. Set base colors and background based on Category (business_type)
  let bgClass = "bg-[#fdfbf7]";
  let sectionBg = "bg-[#f9f7f1]";
  let accentText = "text-[#d4af37]";
  let accentBg = "bg-[#d4af37]";
  let accentHover = "hover:bg-[#b5952f]";
  let borderClass = "border-[#d4af37]";
  let heroOpacity = "opacity-40";
  let heroBg = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80";

  if (category === 'Islamic Invitation') {
    bgClass = "bg-emerald-50/30";
    sectionBg = "bg-white";
    accentText = "text-emerald-700";
    accentBg = "bg-emerald-700";
    accentHover = "hover:bg-emerald-800";
    borderClass = "border-emerald-200";
    heroOpacity = "opacity-30";
    heroBg = "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'South Indian Wedding') {
    bgClass = "bg-amber-50/40";
    sectionBg = "bg-white";
    accentText = "text-red-700";
    accentBg = "bg-red-700";
    accentHover = "hover:bg-red-800";
    borderClass = "border-amber-200";
    heroOpacity = "opacity-30";
    heroBg = "https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Kerala Traditional') {
    bgClass = "bg-[#Fdfaf4]";
    sectionBg = "bg-white";
    accentText = "text-[#8C1C13]";
    accentBg = "bg-[#8C1C13]";
    accentHover = "hover:bg-[#73150F]";
    borderClass = "border-[#d4af37]";
    heroOpacity = "opacity-20";
    heroBg = "https://images.unsplash.com/photo-1629813589433-2ba920ee9b5e?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Punjabi Traditional') {
    bgClass = "bg-fuchsia-50/50";
    sectionBg = "bg-white";
    accentText = "text-fuchsia-600";
    accentBg = "bg-fuchsia-600";
    accentHover = "hover:bg-fuchsia-700";
    borderClass = "border-fuchsia-200";
    heroOpacity = "opacity-40";
    heroBg = "https://images.unsplash.com/photo-1579227114347-15d08fc37cae?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Bengali Wedding') {
    bgClass = "bg-rose-50/40";
    sectionBg = "bg-white";
    accentText = "text-rose-700";
    accentBg = "bg-rose-700";
    accentHover = "hover:bg-rose-800";
    borderClass = "border-red-200";
    heroOpacity = "opacity-30";
    heroBg = "https://images.unsplash.com/photo-1601296200639-89349ce767cb?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Christian Invitation') {
    bgClass = "bg-white";
    sectionBg = "bg-slate-50";
    accentText = "text-slate-500";
    accentBg = "bg-slate-800";
    accentHover = "hover:bg-slate-900";
    borderClass = "border-slate-200";
    heroOpacity = "opacity-50 grayscale";
    heroBg = "https://images.unsplash.com/photo-1532712938730-4e36c457b9c7?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Engagement Invitation') {
    bgClass = "bg-indigo-50/40";
    sectionBg = "bg-white";
    accentText = "text-indigo-500";
    accentBg = "bg-indigo-500";
    accentHover = "hover:bg-indigo-600";
    borderClass = "border-indigo-100";
    heroOpacity = "opacity-40";
    heroBg = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1920&q=80";
  }

  // 2. Set typography and layout based on Theme (theme)
  let fontClass = "font-serif";
  let italicClass = "italic";
  let titleFont = `font-serif ${accentText}`;

  if (theme === 'Modern') {
    fontClass = "font-sans tracking-tight";
    italicClass = "";
    titleFont = `font-sans font-black uppercase tracking-tighter ${accentText}`;
  } else if (theme === 'Floral') {
    fontClass = "font-serif font-light";
    italicClass = "italic";
    titleFont = `font-serif font-light ${accentText}`;
  } else if (theme === 'Minimal') {
    fontClass = "font-mono uppercase tracking-widest text-xs";
    italicClass = "";
    titleFont = `font-mono font-medium tracking-[-0.05em] ${accentText}`;
  } else if (theme === 'Elegant') {
    fontClass = "font-serif";
    italicClass = "italic";
    titleFont = `font-serif font-light tracking-widest ${accentText}`;
  }

  return (
    <div className={`min-h-screen ${bgClass} text-slate-800 ${fontClass} selection:${accentBg} selection:text-white pb-20 transition-all duration-700`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Wedding Cover" 
            className={`w-full h-full object-cover mix-blend-multiply ${heroOpacity} transition-all duration-1000`}
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
