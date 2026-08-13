import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

// Temple graphic line art
const TempleGraphic = () => (
  <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 10L100 50V140H20V50L60 10Z" stroke="#8C1C13" strokeWidth="2"/>
    <path d="M40 140V90H80V140" stroke="#8C1C13" strokeWidth="2"/>
    <path d="M60 10L60 0" stroke="#d4af37" strokeWidth="3"/>
    <path d="M30 40H90" stroke="#8C1C13" strokeWidth="2"/>
    <path d="M20 70H100" stroke="#8C1C13" strokeWidth="2"/>
    <path d="M20 100H100" stroke="#8C1C13" strokeWidth="2"/>
  </svg>
);

export default function TempleMinimalLayout({ content, colors }: WeddingLayoutProps) {
  const caricatureUrl = "https://images.unsplash.com/photo-1629813589433-2ba920ee9b5e?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={`min-h-screen font-serif bg-[#Fdfaf4] relative overflow-hidden text-[#8C1C13] border-[12px] border-[#8C1C13]`}>
      <div className="absolute inset-0 border-[4px] border-[#d4af37] m-2 pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 pb-32">
        <div className="text-center mb-12 relative flex flex-col items-center">
          <TempleGraphic />
          <p className="text-sm tracking-[0.3em] uppercase mt-8 text-[#d4af37] font-semibold">
            Wedding Invitation
          </p>
          <div className="flex flex-col items-center justify-center gap-2 my-8">
            <h1 className="text-4xl md:text-6xl font-light text-[#8C1C13]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {content?.bride?.name || 'Laxam'}
            </h1>
            <span className="text-2xl text-[#d4af37] font-light italic">and</span>
            <h1 className="text-4xl md:text-6xl font-light text-[#8C1C13]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {content?.groom?.name || 'Sujata'}
            </h1>
          </div>
        </div>

        <div className="relative mb-16 max-w-xl mx-auto">
          <div className="aspect-square overflow-hidden border-2 border-[#d4af37] rounded-full p-2">
            <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                src={content?.hero?.image || caricatureUrl} 
                alt="Couple"
                className="w-full h-full object-cover"
                />
            </div>
          </div>
        </div>

        <div className="text-center space-y-12">
            <div>
                <h3 className="text-2xl font-light tracking-widest text-[#8C1C13] mb-4 uppercase">Muhurtham</h3>
                <p className="text-lg text-gray-700">{content?.date || '16th March 2026'}</p>
                <p className="text-md text-[#d4af37]">9:00 AM Onwards</p>
            </div>
            
            <div className="relative inline-block">
                 <div className="absolute top-1/2 left-[-40px] w-8 h-[1px] bg-[#d4af37]"></div>
                 <MapPin className="w-6 h-6 text-[#8C1C13] mx-auto mb-2" />
                 <div className="absolute top-1/2 right-[-40px] w-8 h-[1px] bg-[#d4af37]"></div>
            </div>

            <div>
                <h3 className="text-2xl font-light tracking-widest text-[#8C1C13] mb-4 uppercase">Venue</h3>
                <p className="text-lg font-medium text-[#8C1C13] mb-2">{content?.venue?.name || 'Grand Hotel Ballroom'}</p>
                <p className="text-md text-gray-700 max-w-sm mx-auto">{content?.venue?.address || '123 Heritage Road, Bangalore, Karnataka'}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
