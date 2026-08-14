import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

const MarigoldGarland = () => (
  <div className="flex justify-center w-full overflow-hidden absolute top-0 pt-4 z-10 pointer-events-none opacity-90">
    {[...Array(15)].map((_, i) => (
      <div key={i} className="flex flex-col items-center mx-1">
        <div className="w-6 h-6 rounded-full bg-orange-500 shadow-sm border border-orange-600 mb-1"></div>
        <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-sm border border-yellow-500"></div>
      </div>
    ))}
  </div>
);

const BananaLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 0C50 0 10 50 10 100C10 150 50 200 50 200C50 200 90 150 90 100C90 50 50 0 50 0Z" fill="#4ade80" opacity="0.8" />
    <path d="M50 0V200" stroke="#166534" strokeWidth="2" />
    <path d="M50 40L20 20M50 80L15 60M50 120L20 100M50 160L30 140M50 40L80 20M50 80L85 60M50 120L80 100M50 160L70 140" stroke="#166534" strokeWidth="1" />
  </svg>
);

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
  const parentsText = (content?.settings_json?.wedding?.groomParents || content?.settings_json?.wedding?.brideParents) 
    ? `${groomParents} & ${brideParents}`
    : 'Sahil Sharma & Divya Anand';

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

        {/* Arch / Decor Borders */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 border-[20px] border-[#FDF9EE] border-opacity-50 box-border">
          <div className="w-full h-full border-4 border-amber-900/10 rounded-t-[5rem]"></div>
        </div>

      <MarigoldGarland />
      
      {/* Banana Leaves */}
      <BananaLeaf className="absolute top-20 -left-8 w-32 h-64 transform rotate-12 opacity-80" />
      <BananaLeaf className="absolute top-20 -right-8 w-32 h-64 transform -rotate-12 scale-x-[-1] opacity-80" />

      {/* Main Content Content */}
      <div className="relative z-10 max-w-md mx-auto text-center px-6 mt-10">
        
        <p className="text-red-700 font-bold mb-8 tracking-widest text-sm">
          || ॐ गणपतये नमः ||
        </p>

        <p className="text-red-700 font-medium text-sm mb-2 uppercase tracking-wide">
          {parentsText}
        </p>
        
        <p className="text-red-700 text-xs font-semibold leading-relaxed mb-6 px-4 uppercase">
          Request your gracious presence and<br/>
          blessing on the auspicious<br/>
          occasion of the wedding
        </p>

        <p className="text-red-700 text-xs font-medium uppercase mb-6">
          Of Their Son
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center md:gap-2 mb-8">
          <h1 className="text-4xl md:text-6xl font-script text-orange-500 font-bold whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {groomName}
          </h1>
          <span className="text-red-700 font-medium text-sm italic mx-2 my-2 md:mt-4 block md:inline">with</span>
          <h1 className="text-4xl md:text-6xl font-script text-orange-500 font-bold whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {brideName}
          </h1>
        </div>

        <p className="text-red-700 text-xl font-bold mb-4">
          {date}
        </p>

        <p className="text-red-700 text-sm font-medium italic">
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
        
        {/* Arch / Decor Borders */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 border-[20px] border-[#FDF9EE] border-opacity-50 box-border">
          <div className="w-full h-full border-4 border-amber-900/10 rounded-[3rem]"></div>
        </div>

        <MarigoldGarland />

        <div className="relative z-10 text-center px-6 py-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <p className="text-red-700 font-bold mb-8 tracking-widest text-sm md:text-base animate-pulse">
            || ॐ गणपतये नमः ||
          </p>

          <p className="text-red-700 text-xs md:text-sm font-semibold uppercase mb-4 tracking-widest text-opacity-80">
            You are invited to the wedding of
          </p>

          <h1 className="text-6xl md:text-8xl font-script text-orange-500 font-bold mb-12 drop-shadow-sm whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {coupleNamesStr}
          </h1>

          <button
            onClick={() => setIsOpened(true)}
            className="group relative overflow-hidden bg-red-800 hover:bg-red-900 text-white font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3 md:px-12 md:py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-20 border border-red-950/50 flex-shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Invitation
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>
      </div>

      {sectionMap['hero']}

      {/* Sections Below */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 py-16 space-y-24">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>
      
    </div>
  );
}
