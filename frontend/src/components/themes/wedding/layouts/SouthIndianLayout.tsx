import React from 'react';
import { Heart, Calendar, MapPin, Music, Coffee, Camera, PartyPopper } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

// Icons for South Indian Wedding
const GaneshaIcon = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C40 20 30 25 30 35C30 45 40 50 50 50C60 50 70 45 70 35C70 25 60 20 50 20Z" fill="#d4af37" />
    <path d="M50 50C35 50 25 60 25 75C25 85 35 90 50 90C65 90 75 85 75 75C75 60 65 50 50 50Z" fill="#d4af37" />
    <circle cx="45" cy="40" r="2" fill="white" />
    <circle cx="55" cy="40" r="2" fill="white" />
  </svg>
);

const BananaLeaf = ({ className }: { className?: string }) => (
  <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M60 0C60 0 10 50 10 100C10 150 60 200 60 200C60 200 110 150 110 100C110 50 60 0 60 0Z" fill="#2e7d32" opacity="0.8" />
    <path d="M60 0V200" stroke="#1b5e20" strokeWidth="2" />
    <path d="M60 50L30 30M60 80L20 60M60 110L25 90M60 140L35 125M60 60L90 40M60 90L100 70M60 120L95 100M60 150L85 135" stroke="#1b5e20" strokeWidth="1" />
  </svg>
);

const LotusIcon = ({ className }: { className?: string }) => (
  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 40C30 40 10 30 10 15C10 0 30 10 30 10C30 10 50 0 50 15C50 30 30 40 30 40Z" fill="#e91e63" />
    <path d="M30 40C30 40 20 35 20 20C20 5 30 15 30 15C30 15 40 5 40 20C40 35 30 40 30 40Z" fill="#f06292" />
    <path d="M30 40C30 40 25 35 25 25C25 15 30 20 30 20C30 20 35 15 35 25C35 35 30 40 30 40Z" fill="#f8bbd0" />
  </svg>
);

export default function SouthIndianLayout({ content, website, updateContent, isEditor, colors }: WeddingLayoutProps) {
  const t = (text: string) => text;

  // We use placeholder caricature if not provided
  const caricatureUrl = "https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={`min-h-screen font-serif bg-amber-50 relative overflow-hidden text-amber-900`}>
      {/* Background Decor Elements */}
      <div className="absolute top-0 left-0 w-full h-12 bg-amber-600 flex justify-around items-end overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-yellow-400 rounded-full translate-y-4 mx-1 flex items-center justify-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
          </div>
        ))}
      </div>
      
      <div className="absolute top-12 left-0 z-0">
        <BananaLeaf className="transform -rotate-12 origin-top-left -ml-10" />
      </div>
      <div className="absolute top-12 right-0 z-0">
        <BananaLeaf className="transform rotate-12 origin-top-right -mr-10 scale-x-[-1]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 pb-32">
        {/* Header section */}
        <div className="text-center mb-16 relative">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200">
               <GaneshaIcon />
            </div>
          </div>
          <p className="text-sm tracking-[0.2em] uppercase mb-4 text-amber-700 font-semibold">
            {t('We solicit your gracious presence')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 my-8">
            <h1 className="text-5xl md:text-7xl font-bold text-red-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {content?.bride?.name || 'Bhoomika'}
            </h1>
            <span className="text-3xl text-amber-600 font-light italic">&amp;</span>
            <h1 className="text-5xl md:text-7xl font-bold text-red-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {content?.groom?.name || 'Prashant'}
            </h1>
          </div>
        </div>

        {/* Couple Illustration / Photo Area */}
        <div className="relative mb-20 max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-red-800 rounded-t-full transform scale-105 opacity-10"></div>
          <div className="absolute -inset-4 border-2 border-dashed border-amber-600 rounded-t-full opacity-30"></div>
          <div className="aspect-[3/4] md:aspect-[4/3] rounded-t-full overflow-hidden border-8 border-white shadow-2xl relative">
             {/* If there's an actual couple photo provided, use it, else default */}
            <img 
              src={content?.hero?.image || caricatureUrl} 
              alt="Couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full flex justify-around p-4 opacity-80">
                <LotusIcon />
                <LotusIcon />
                <LotusIcon />
            </div>
          </div>
        </div>

        {/* Events / Muhurtham Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 relative">
            <div className="bg-white/80 backdrop-blur border border-amber-200 rounded-2xl p-8 text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-red-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Muhurtham</h3>
                <div className="flex items-center justify-center gap-3 mb-4 text-amber-800">
                    <Calendar className="w-5 h-5 text-red-700" />
                    <span className="font-semibold text-lg">{content?.date || 'Friday, 29th August 2025'}</span>
                </div>
                <div className="flex flex-col gap-2 text-amber-700">
                    <p className="text-xl font-medium">9:00 AM Onwards</p>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur border border-amber-200 rounded-2xl p-8 text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-red-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Reception</h3>
                <div className="flex items-center justify-center gap-3 mb-4 text-amber-800">
                    <Calendar className="w-5 h-5 text-red-700" />
                    <span className="font-semibold text-lg">{content?.date || 'Friday, 29th August 2025'}</span>
                </div>
                <div className="flex flex-col gap-2 text-amber-700">
                    <p className="text-xl font-medium">7:00 PM Onwards</p>
                </div>
            </div>
        </div>

        {/* Venue Section */}
        <div className="bg-gradient-to-br from-amber-100 to-red-50 rounded-2xl p-10 text-center shadow-xl border-2 border-amber-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-20">
                <BananaLeaf className="transform rotate-90" />
             </div>
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-red-700">
                    <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-red-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Venue</h3>
                <p className="text-2xl font-medium text-amber-900 mb-2">{content?.venue?.name || 'Sundex Multi Hall'}</p>
                <p className="text-lg text-amber-700 max-w-md mx-auto mb-6">{content?.venue?.address || 'Goparasanallur, Chennai 600 077'}</p>
                
                {content?.venue?.mapUrl && (
                    <a 
                      href={content?.venue?.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition-colors shadow-lg"
                    >
                      Get Directions
                    </a>
                )}
             </div>
        </div>
      </div>
      
      {/* Bottom Lotus Border */}
      <div className="absolute bottom-0 w-full h-16 bg-teal-800 flex items-end justify-around pb-2">
         {[...Array(8)].map((_, i) => (
             <LotusIcon key={i} className="transform scale-75 opacity-90" />
         ))}
      </div>
    </div>
  );
}
