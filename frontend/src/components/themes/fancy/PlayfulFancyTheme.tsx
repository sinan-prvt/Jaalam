import React from 'react';
import { Star, Gift, ShoppingCart, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function PlayfulFancyTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Pixie Dust';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Unicorn Hair Clips', price: '₹150', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Cute colorful hair accessories.' },
    { name: 'Glitter Nail Paint Set', price: '₹299', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80', description: 'Safe, peel-off glitter nail polish.' },
    { name: 'Mermaid Tail Pouch', price: '₹350', image: 'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80', description: 'Sequin mermaid pouch.' },
    { name: 'Rainbow Choker', price: '₹99', image: 'https://images.unsplash.com/photo-1599643478514-4a4208bd50d6?auto=format&fit=crop&w=600&q=80', description: 'Bright and colorful choker necklace.' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-purple-900 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&family=Nunito:wght@400;700;900&display=swap');
        .font-playful { font-family: 'Balsamiq Sans', cursive; }
        .font-body { font-family: 'Nunito', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b-4 border-pink-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-current animate-bounce" size={28} />
            <span className="font-playful text-3xl font-bold text-pink-500 tracking-wider">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-6 font-body font-bold text-lg text-purple-600">
            <a href="#shop" className="hover:text-pink-500 hover:-translate-y-1 transition-transform">Shop</a>
            <a href="#about" className="hover:text-pink-500 hover:-translate-y-1 transition-transform">About</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6 text-center overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-purple-100">
        <div className="absolute top-10 left-10 text-pink-300 opacity-50 rotate-12"><Heart size={64} fill="currentColor" /></div>
        <div className="absolute bottom-10 right-10 text-yellow-300 opacity-50 -rotate-12"><Star size={80} fill="currentColor" /></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-block bg-white border-2 border-pink-300 text-pink-500 font-playful px-6 py-2 rounded-full mb-8 shadow-md">
             ✨ Magic Awaits! ✨
          </div>
          <h1 className="font-playful text-6xl md:text-8xl text-purple-800 mb-8 leading-tight drop-shadow-sm">
            {content.hero_title || 'Cute Finds for Cute Minds!'}
          </h1>
          <p className="font-body font-bold text-xl text-purple-600 mb-12 max-w-2xl mx-auto">
            {content.hero_text || 'Dive into our magical collection of fun accessories, colorful cosmetics, and adorable lifestyle items.'}
          </p>
          <a href="#shop" className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-body font-black text-xl py-4 px-12 rounded-full shadow-[0_6px_0_#d81b60] active:translate-y-2 active:shadow-none transition-all">
            <Gift size={24} /> Shop Now
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <section id="shop" className="py-20 px-6 bg-white relative">
        <div className="absolute top-[-20px] left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.8,188.94,98.67,243.64,82.52,284.18,63.36,321.39,56.44Z" className="fill-[#FFF0F5]"></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-6xl mt-10">
          <h2 className="font-playful text-4xl text-center text-pink-500 mb-16">
            🌈 Featured Goodies
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} className="bg-purple-50 rounded-[2rem] p-4 border-4 border-purple-200 hover:border-pink-400 hover:-translate-y-2 hover:shadow-xl transition-all group">
                <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-white relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-yellow-400 text-white font-playful px-3 py-1 rounded-full text-sm shadow-sm rotate-12">
                    {p.price}
                  </div>
                </div>
                <div className="px-2 pb-2 text-center">
                  <h3 className="font-playful text-xl text-purple-800 mb-2">{p.name}</h3>
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-body font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCart size={18} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-purple-800 text-purple-100 py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Star className="text-yellow-400 fill-current" size={32} />
            <span className="font-playful text-4xl font-bold text-white tracking-wider">{siteName}</span>
          </div>
          <p className="font-body text-lg max-w-lg mx-auto mb-12 font-bold">
            {content.about_text || "Bringing smiles with every accessory! The cutest fancy store in town."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body font-bold bg-purple-900/50 p-6 rounded-3xl">
            <div className="flex flex-col items-center gap-2"><Phone className="text-pink-400" /> {content.contact_info?.phone || '98765 43210'}</div>
            <div className="flex flex-col items-center gap-2"><Mail className="text-yellow-400" /> {content.contact_info?.email || 'hello@pixiedust.in'}</div>
            <div className="flex flex-col items-center gap-2"><MapPin className="text-green-400" /> {content.contact_info?.address || 'Fun Street, Kerala'}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

