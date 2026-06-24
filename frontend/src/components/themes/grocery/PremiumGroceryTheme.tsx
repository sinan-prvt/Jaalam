import React from 'react';
import { Wine, Search, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function PremiumGroceryTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Luxe Gourmet';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Truffle Infused Olive Oil', price: '₹2,400', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', origin: 'Italy' },
    { name: 'Artisanal Sourdough', price: '₹350', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', origin: 'House Bakery' },
    { name: 'Aged Balsamic Vinegar', price: '₹1,800', image: 'https://images.unsplash.com/photo-1548811579-017fd2a2a2c5?auto=format&fit=crop&w=600&q=80', origin: 'Modena' },
    { name: 'Organic Heirloom Tomatoes', price: '₹450/kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', origin: 'Local Farm' }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#E0D8C8] font-sans selection:bg-[#C9A66B] selection:text-[#111111]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400&display=swap');
        .font-premium { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Lato', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#C9A66B]/30 bg-[#0A0A0A]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Wine className="text-[#C9A66B]" size={28} />
            <span className="font-premium text-3xl tracking-widest text-[#C9A66B] uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#curated" className="hover:text-[#C9A66B] transition-colors">Curated Selection</a>
            <a href="#visit" className="hover:text-[#C9A66B] transition-colors">Boutique</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606103920295-9a091573f160?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="font-body text-[#C9A66B] tracking-[0.3em] text-xs uppercase mb-6">Fine Foods & Groceries</p>
          <h1 className="font-premium text-5xl md:text-7xl font-bold mb-8 text-white tracking-wide leading-tight max-w-4xl mx-auto">
            {content.hero_title || 'An Epicurean Journey Awaits.'}
          </h1>
          <p className="font-premium italic text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {content.hero_text || 'Discover a meticulously curated selection of gourmet ingredients, imported delicacies, and organic local produce.'}
          </p>
          <button className="border border-[#C9A66B] text-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#111111] px-10 py-4 font-body text-xs uppercase tracking-widest transition-all duration-300">
            Explore the Aisles
          </button>
        </div>
      </section>

      {/* Products */}
      <section id="curated" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-20">
             <div className="w-px h-16 bg-[#C9A66B] mb-8"></div>
             <h2 className="font-premium text-4xl text-[#C9A66B] uppercase tracking-widest text-center">The Reserve Collection</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative bg-[#1A1A1A]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#C9A66B]/20 pointer-events-none"></div>
                </div>
                <div className="text-center">
                  <div className="font-body text-[10px] text-gray-500 uppercase tracking-widest mb-3">{p.origin}</div>
                  <h3 className="font-premium text-lg text-white mb-3 group-hover:text-[#C9A66B] transition-colors">{p.name}</h3>
                  <div className="font-body text-[#C9A66B] text-sm tracking-wider">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="visit" className="bg-[#111111] pt-24 pb-12 px-6 border-t border-[#1A1A1A]">
        <div className="container mx-auto max-w-5xl text-center">
          <Wine size={32} className="mx-auto text-[#1A1A1A] fill-[#C9A66B] mb-8" />
          <h3 className="font-premium text-3xl text-white mb-6 tracking-widest uppercase">{siteName}</h3>
          <p className="font-body text-sm text-gray-500 tracking-wider leading-loose max-w-lg mx-auto mb-16">
            {content.about_text || "Purveyors of excellence since 2010. Offering an unparalleled grocery shopping experience for the discerning palate."}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 font-body text-xs tracking-widest text-gray-400 border-t border-[#1A1A1A] pt-12">
            <div className="flex flex-col items-center gap-3">
               <span className="text-[#C9A66B] uppercase">Boutique</span>
               <span>{content.contact_info?.address || '1 Heritage Square, Kerala'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
               <span className="text-[#C9A66B] uppercase">Concierge</span>
               <span>{content.contact_info?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
               <span className="text-[#C9A66B] uppercase">Inquiries</span>
               <span>{content.contact_info?.email || 'concierge@luxegourmet.in'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

