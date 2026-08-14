import React from 'react';
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
  const brideName = content?.bride?.name || 'Namrata';
  const groomName = content?.groom?.name || 'Mahesh';
  const date = content?.date || '25/11/24';
  const venue = content?.venue?.name || 'Shalimar Garden, Tagore Hall, near Rani Ghat';

  return (
    <div className="min-h-screen bg-[#FDF9EE] relative overflow-hidden font-sans flex flex-col items-center pt-24 pb-96">
      
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
          {content?.parents?.names || 'Sahil Sharma & Divya Anand'}
        </p>
        
        <p className="text-red-700 text-xs font-semibold leading-relaxed mb-6 px-4 uppercase">
          Request your gracious presence and<br/>
          blessing on the auspicious<br/>
          occasion of the wedding
        </p>

        <p className="text-red-700 text-xs font-medium uppercase mb-6">
          Of Their Son
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          <h1 className="text-5xl font-script text-orange-500 font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {groomName}
          </h1>
          <span className="text-red-700 font-medium text-sm italic mx-2 mt-4">with</span>
          <h1 className="text-5xl font-script text-orange-500 font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>
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

      {/* Couple Illustration at the bottom */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none z-20">
        <img 
          src="/media/south_indian_couple.png" 
          alt="Couple Illustration" 
          className="w-full max-w-lg h-auto object-contain object-bottom"
          onError={(e) => {
            // Fallback if image doesn't exist
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>
      
    </div>
  );
}
