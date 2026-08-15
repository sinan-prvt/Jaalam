import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function SouthIndianLayout({ content, website }: WeddingLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);

  const coupleNamesStr = content?.hero_title || 'Mahesh & Namrata';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Mahesh';
  const brideName = nameParts[1]?.trim() || 'Namrata';

  const date = content?.settings_json?.wedding?.date || content?.date || '25/11/24';
  const venue = content?.contact_info?.address || content?.venue?.name || 'Shalimar Garden, Tagore Hall, near Rani Ghat';
  
  const groomParents = content?.settings_json?.wedding?.groomParents || 'Sahil Sharma';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Divya Anand';
  const quote = content?.settings_json?.wedding?.quote || content?.quote || 'Two hearts united in love, starting a beautiful journey together.';

  const coupleImage = content?.hero?.image || "/media/south_indian_couple.png";
  
  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "9:00 AM Onwards", event: "Muhurtham", date: date, venue: venue },
    { time: "7:00 PM Onwards", event: "Reception", date: date, venue: venue }
  ];
  
  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl;
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const story = content?.about_text || "";
  const location = content?.contact_info?.address || venue;

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'about', label: 'About the Couple', visible: true },
    { id: 'schedule', label: 'Wedding Events', visible: true },
    { id: 'gallery', label: 'Captured Moments', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'venue', label: 'When & Where', visible: true }
  ];
  const sections = content?.settings_json?.wedding?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-96 overflow-hidden">
        {/* Arch / Decor Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img src="/media/south_indian_arch.png" alt="Arch Decoration" className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply" />
        </div>

      {/* Main Content Content */}
      <div className="relative z-10 max-w-md mx-auto text-center px-8 sm:px-12 mt-24 sm:mt-32">
        
        <p className="text-rose-900 font-bold mb-4 tracking-widest text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
          || ॐ गणपतये नमः ||
        </p>

        {quote && (
          <p className="text-rose-900 text-xs sm:text-sm italic font-serif leading-relaxed mb-6 px-4 opacity-90 max-w-xs mx-auto">
            "{quote}"
          </p>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center md:gap-3 mb-6">
          <h1 className="text-4xl sm:text-6xl font-script text-orange-500 font-bold whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {groomName}
          </h1>
          <span className="text-rose-900 font-medium text-xs italic mx-2 my-1 md:mt-3 block md:inline" style={{ fontFamily: "'Playfair Display', serif" }}>with</span>
          <h1 className="text-4xl sm:text-6xl font-script text-orange-500 font-bold whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {brideName}
          </h1>
        </div>

        <p className="text-rose-900 text-lg sm:text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
          {date}
        </p>

        <p className="text-rose-800 text-xs sm:text-sm font-medium italic mb-8 opacity-90" style={{ fontFamily: "'Playfair Display', serif" }}>
          {venue}
        </p>
        
      </div>

      {/* Couple Illustration at the bottom of hero */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none z-20">
        <img 
          src={coupleImage} 
          alt="Couple Illustration" 
          className="w-full max-w-lg h-auto object-contain object-bottom"
          onError={(e) => {
            // Fallback if image doesn't exist
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-red-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>About the Couple</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white/80 p-8 rounded-2xl shadow-md border-2 border-amber-100 flex flex-col items-center">
              {groomPhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-200 mb-4">
                  <img src={groomPhoto} alt={groomName} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-orange-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{groomName}</h3>
              <p className="text-sm text-amber-700 uppercase tracking-widest mb-1">Son of</p>
              <p className="text-md font-medium text-amber-900">{groomParents}</p>
            </div>
            <div className="bg-white/80 p-8 rounded-2xl shadow-md border-2 border-amber-100 flex flex-col items-center">
              {bridePhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-200 mb-4">
                  <img src={bridePhoto} alt={brideName} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-orange-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{brideName}</h3>
              <p className="text-sm text-amber-700 uppercase tracking-widest mb-1">Daughter of</p>
              <p className="text-md font-medium text-amber-900">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Wedding Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/80 backdrop-blur border-2 border-amber-100 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-orange-600 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-amber-800">
                  <Calendar className="w-5 h-5 text-red-700" />
                  <span className="font-semibold">{item.date}</span>
              </div>
              <p className="text-amber-700 font-medium">{item.time}</p>
              <p className="text-amber-600 text-sm mt-2">{item.venue}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: mapUrl || location ? (
      <section key="venue" className="py-20 px-6 relative z-10">
        <div className="bg-gradient-to-br from-amber-100/50 to-orange-50 rounded-3xl p-10 text-center shadow-lg border border-amber-200 relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-red-700">
                    <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-red-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Venue</h3>
                <p className="text-xl font-medium text-amber-900 mb-2">{location || venue}</p>
                <p className="text-md text-amber-700 max-w-md mx-auto mb-8">Join us to celebrate our joyous occasion.</p>
                
                {mapUrl && (
                    <a 
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-bold tracking-wide hover:bg-red-800 transition-colors shadow-md text-sm"
                    >
                      Get Directions
                    </a>
                )}
             </div>
        </div>
      </section>
    ) : null,
    gallery: gallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Captured Moments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-md">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    story: story ? (
      <section key="story" className="py-20 px-6 relative z-10 text-center">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-3xl p-10 shadow-md border-2 border-amber-100">
          <h2 className="text-3xl font-bold text-red-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Our Story</h2>
          <p className="text-lg text-amber-900 font-medium italic leading-relaxed">
            "{story}"
          </p>
        </div>
      </section>
    ) : null
  };

  return (
    <div className="min-h-screen bg-[#FDF9EE] relative font-sans flex flex-col items-center overflow-hidden">
      
      {/* Welcome Screen / Envelope Overlay */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF9EE] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>
        
        {/* Arch / Decor Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img src="/media/south_indian_arch.png" alt="Arch Decoration" className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-8 sm:px-12 py-10 mt-24 sm:mt-32 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <p className="text-rose-900 font-bold mb-6 tracking-[0.2em] text-sm md:text-base animate-pulse" style={{ fontFamily: "'Playfair Display', serif" }}>
            || ॐ गणपतये नमः ||
          </p>

          <p className="text-rose-900 text-xs md:text-sm font-semibold uppercase mb-6 tracking-widest text-opacity-90" style={{ fontFamily: "'Playfair Display', serif" }}>
            You are invited to the wedding of
          </p>

          <h1 className="text-5xl md:text-7xl font-script text-orange-500 font-bold mb-10 drop-shadow-sm whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {coupleNamesStr}
          </h1>

          <button
            onClick={() => setIsOpened(true)}
            className="group relative overflow-hidden bg-rose-900 hover:bg-rose-950 text-white font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3 md:px-12 md:py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-20 border border-rose-950/50 flex-shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Invitation
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 space-y-24 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>
      
    </div>
  );
}
