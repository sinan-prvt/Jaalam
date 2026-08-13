import React from 'react';
import { Calendar, MapPin, Camera } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

const GaneshaIcon = () => (
  <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C40 20 30 25 30 35C30 45 40 50 50 50C60 50 70 45 70 35C70 25 60 20 50 20Z" fill="#d4af37" />
    <path d="M50 50C35 50 25 60 25 75C25 85 35 90 50 90C65 90 75 85 75 75C75 60 65 50 50 50Z" fill="#d4af37" />
    <circle cx="45" cy="40" r="2" fill="#fff" />
    <circle cx="55" cy="40" r="2" fill="#fff" />
    <path d="M50 90C45 90 40 95 40 100H60C60 95 55 90 50 90Z" fill="#d4af37" />
  </svg>
);

const Toran = () => (
  <div className="absolute top-0 w-full flex justify-between px-2 overflow-hidden pointer-events-none" style={{ height: '60px' }}>
    {[...Array(15)].map((_, i) => (
      <div key={i} className="flex flex-col items-center -mt-2">
         <div className="w-8 h-8 rounded-full bg-green-700 rounded-br-none rotate-45 transform scale-y-150 shadow-md"></div>
         <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 shadow-sm"></div>
         <div className="w-3 h-3 rounded-full bg-yellow-400 mt-1 shadow-sm"></div>
      </div>
    ))}
  </div>
);

const BananaLeaf = ({ className }: { className?: string }) => (
  <svg width="150" height="250" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M60 0C60 0 10 50 10 100C10 150 60 200 60 200C60 200 110 150 110 100C110 50 60 0 60 0Z" fill="#2e7d32" opacity="0.9" />
    <path d="M60 0V200" stroke="#1b5e20" strokeWidth="2" />
    <path d="M60 50L30 30M60 80L20 60M60 110L25 90M60 140L35 125M60 60L90 40M60 90L100 70M60 120L95 100M60 150L85 135" stroke="#1b5e20" strokeWidth="1" />
  </svg>
);

export default function SouthIndianRoyalLayout({ content, website, updateContent, isEditor }: WeddingLayoutProps) {
  const caricatureUrl = "https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=800&q=80";
  const displayImage = content?.hero?.image || caricatureUrl;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && updateContent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateContent({
          ...content,
          hero: {
            ...content?.hero,
            image: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen font-serif bg-gradient-to-b from-blue-100 via-sky-50 to-amber-50 relative overflow-hidden text-slate-800">
      
      {/* Side Pillars */}
      <div className="absolute left-0 top-0 bottom-0 w-4 md:w-8 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-2xl z-20 border-r-2 border-amber-900/50"></div>
      <div className="absolute right-0 top-0 bottom-0 w-4 md:w-8 bg-gradient-to-l from-amber-600 via-yellow-400 to-amber-700 shadow-2xl z-20 border-l-2 border-amber-900/50"></div>

      <Toran />

      {/* Decorative Leaves */}
      <div className="absolute top-20 left-4 md:left-8 z-0 pointer-events-none">
        <BananaLeaf className="transform -rotate-12 origin-top-left -ml-10 drop-shadow-xl" />
      </div>
      <div className="absolute top-40 right-4 md:right-8 z-0 pointer-events-none">
        <BananaLeaf className="transform rotate-12 origin-top-right -mr-10 scale-x-[-1] drop-shadow-xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-8 md:px-12 py-24 pb-32 flex flex-col items-center text-center">
        
        <div className="mb-6 drop-shadow-lg">
           <GaneshaIcon />
        </div>
        
        <p className="text-sm md:text-base tracking-widest text-slate-700 font-medium italic mb-1 max-w-lg">
          We solicit your gracious presence
        </p>
        <p className="text-sm tracking-wide text-slate-600 italic mb-8 max-w-lg">
          with family &amp; friends on the auspicious occasion of the Marriage of
        </p>

        <h1 className="text-5xl md:text-6xl font-bold text-rose-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {content?.bride?.name || 'Bhoomika'}
        </h1>
        <p className="text-sm font-medium text-teal-900 tracking-wide mb-4">
          D/O {content?.settings_json?.wedding?.brideParents || 'Smt. V Thirupurasundari & Sri. K. Vinayagam'}
        </p>
        
        <span className="text-3xl text-slate-500 font-light italic mb-4">&amp;</span>
        
        <h1 className="text-5xl md:text-6xl font-bold text-rose-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {content?.groom?.name || 'Prashant'}
        </h1>
        <p className="text-sm font-medium text-teal-900 tracking-wide mb-10">
          S/O {content?.settings_json?.wedding?.groomParents || 'Smt. Meenakshi Sundaram & Sri. S. Paraniselvi'}
        </p>

        {/* Caricature Image with Editor Upload */}
        <div className="relative mb-12 max-w-[280px] md:max-w-[350px] w-full mx-auto group">
          <div className="aspect-[3/4] overflow-hidden shadow-2xl relative bg-transparent rounded-t-[100px] border-[10px] border-white/50 backdrop-blur-sm">
             <img 
              src={displayImage} 
              alt="Couple Caricature"
              className="w-full h-full object-cover rounded-t-[100px]"
             />
             
             {isEditor && (
               <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-t-[100px]">
                 <Camera className="text-white w-10 h-10 mb-2" />
                 <span className="text-white font-medium text-sm">Upload Caricature</span>
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               </label>
             )}
          </div>
          {isEditor && (
             <p className="text-xs text-slate-500 mt-2 font-sans bg-white/80 py-1 px-3 rounded-full shadow-sm inline-block">
               Click image to upload custom caricature
             </p>
          )}
        </div>

        {/* Date and Venue Block */}
        <div className="w-full bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-xl border-t-4 border-amber-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-6 py-1 rounded-full text-xs font-bold tracking-widest">
            MUHURTHAM
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
            <div className="text-center md:text-right md:border-r border-slate-300 md:pr-8">
               <h3 className="text-2xl font-bold text-rose-800 mb-2">
                 {content?.date || 'Friday | 29th | August 2025'}
               </h3>
               <p className="text-lg font-medium text-slate-700">9:00 AM Onwards</p>
            </div>
            
            <div className="text-center md:text-left">
               <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif italic">Venue</h3>
               <p className="text-md font-medium text-slate-800">{content?.venue?.name || 'Sundex Multi Hall'}</p>
               <p className="text-sm text-slate-600">{content?.venue?.address || 'Goparasanallur, Chennai 600 077'}</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom decorative band */}
      <div className="absolute bottom-0 w-full h-12 bg-gradient-to-r from-rose-800 via-rose-700 to-rose-800 border-t-4 border-amber-400 z-30">
        <div className="flex justify-around items-center h-full opacity-60">
           {[...Array(10)].map((_, i) => (
             <div key={i} className="w-4 h-4 bg-yellow-300 rounded-full rotate-45"></div>
           ))}
        </div>
      </div>
    </div>
  );
}
