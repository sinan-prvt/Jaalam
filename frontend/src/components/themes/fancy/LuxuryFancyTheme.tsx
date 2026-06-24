import React from 'react';
import { Crown, Star, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function LuxuryFancyTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'L\'OR';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Diamond Tennis Bracelet', price: '₹45,000', image: 'https://images.unsplash.com/photo-1599643478514-4a4208bd50d6?auto=format&fit=crop&w=600&q=80', description: 'Cubic zirconia tennis bracelet.' },
    { name: 'Signature Fragrance', price: '₹8,500', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', description: 'Exclusive midnight orchid scent.' },
    { name: 'Emerald Cut Ring', price: '₹12,500', image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=600&q=80', description: 'Simulated emerald in a platinum-plated setting.' },
    { name: 'Silk Scarves Collection', price: '₹3,200', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: '100% Mulberry silk printed scarves.' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5C158] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@200;300;400&display=swap');
        .font-luxury { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#E5C158]/20 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex flex-col items-center gap-1">
            <Crown size={20} className="text-[#E5C158]" />
            <span className="font-luxury text-xl tracking-[0.3em] uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-12 font-body text-[10px] tracking-[0.3em] uppercase text-gray-400">
            <a href="#exclusive" className="hover:text-[#E5C158] transition-colors">Exclusive</a>
            <a href="#about" className="hover:text-[#E5C158] transition-colors">Maison</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a48fb3c274d?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="font-body text-xs tracking-[0.4em] text-gray-400 mb-6 uppercase">The Art of Adornment</p>
          <h1 className="font-luxury text-6xl md:text-8xl font-bold mb-8 text-white drop-shadow-2xl">
            {content.hero_title || 'Pure Opulence.'}
          </h1>
          <a href="#exclusive" className="inline-flex items-center gap-4 border border-[#E5C158] text-[#E5C158] hover:bg-[#E5C158] hover:text-black px-12 py-5 font-body uppercase tracking-[0.2em] text-[10px] transition-all duration-500">
            View Collection <ChevronRight size={14} />
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="exclusive" className="py-32 px-6 bg-[#050505]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-20">
             <Star size={16} className="text-[#E5C158] mb-4" />
             <h2 className="font-luxury text-4xl text-white tracking-widest text-center">Masterpieces</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {products.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden mb-8 border border-[#E5C158]/20 bg-[#0A0A0A] flex items-center justify-center p-8">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <img src={p.image} alt={p.name} className="relative z-10 max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className="text-center">
                  <h3 className="font-luxury text-2xl text-white mb-3 tracking-wide">{p.name}</h3>
                  <div className="w-8 h-px bg-[#E5C158]/50 mx-auto mb-3"></div>
                  <div className="font-body text-xs tracking-widest text-[#E5C158]">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-24 px-6 bg-[#0A0A0A] border-t border-[#E5C158]/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-luxury text-3xl text-white mb-8 tracking-widest uppercase">{siteName}</h3>
          <p className="font-body text-xs text-gray-400 tracking-widest leading-loose max-w-lg mx-auto mb-16">
            {content.about_text || "Curating the finest luxury accessories, fragrances, and statement jewelry pieces."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-body text-[10px] tracking-widest text-gray-500">
            <div className="flex flex-col items-center gap-3 hover:text-[#E5C158] transition-colors cursor-pointer">
              <Phone size={16} />
              <span>{content.contact_info?.phone || 'VIP: +91 98765 43210'}</span>
            </div>
            <div className="flex flex-col items-center gap-3 hover:text-[#E5C158] transition-colors cursor-pointer">
              <Mail size={16} />
              <span>{content.contact_info?.email || 'concierge@lor.in'}</span>
            </div>
            <div className="flex flex-col items-center gap-3 hover:text-[#E5C158] transition-colors cursor-pointer">
              <MapPin size={16} />
              <span className="text-center">{content.contact_info?.address || 'The Luxury Mall, Kerala'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

