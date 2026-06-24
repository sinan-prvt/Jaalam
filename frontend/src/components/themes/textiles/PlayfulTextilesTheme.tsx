import React from 'react';
import { ShoppingBag, MapPin, Mail, Phone, Star } from 'lucide-react';

export default function PlayfulTextilesTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Color Pop Apparel';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Graphic Print Tee', price: '₹499', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', tag: 'New!' },
    { name: 'Kids Denim Overalls', price: '₹899', image: 'https://images.unsplash.com/photo-1519238263530-99abca9665ae?auto=format&fit=crop&w=600&q=80', tag: 'Cute!' },
    { name: 'Colorful Sneaker Socks', price: '₹299', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80', tag: 'Pack of 3' },
    { name: 'Neon Windbreaker', price: '₹1,299', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', tag: 'Trending' }
  ];

  return (
    <div className="min-h-screen bg-[#F0F4FF] text-[#1D3557] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800;900&display=swap');
        .font-fun { font-family: 'Fredoka One', cursive; }
        .font-body { font-family: 'Nunito', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="p-4 md:p-8 relative z-10">
        <div className="container mx-auto bg-white rounded-full border-4 border-[#1D3557] shadow-[6px_6px_0_#1D3557] px-8 py-4 flex justify-between items-center transform rotate-1">
          <span className="font-fun text-3xl text-[#E63946]">{siteName}</span>
          <nav className="hidden md:flex gap-8 font-fun text-[#457B9D] text-lg">
            <a href="#shop" className="hover:text-[#E63946] transition-colors">Shop</a>
            <a href="#contact" className="hover:text-[#E63946] transition-colors">Contact</a>
            <span className="bg-[#E63946] text-white px-4 py-1 rounded-full border-2 border-[#1D3557]">Cart (0)</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 text-center relative">
        <div className="absolute top-10 left-10 text-[#FFD166] animate-spin-slow"><Star size={60} /></div>
        <div className="absolute bottom-10 right-20 text-[#06D6A0] animate-bounce"><Star size={40} /></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="font-fun text-6xl md:text-8xl text-[#1D3557] mb-8 leading-tight">
            {content.hero_title || 'Dress Happy!'}
          </h1>
          <p className="font-body font-black text-2xl text-[#E63946] mb-12 bg-white inline-block px-8 py-3 rounded-2xl border-4 border-[#1D3557] shadow-[4px_4px_0_#457B9D] transform -rotate-2">
            {content.hero_text || 'Fun, colorful, and super comfy clothes for kids and adults who are young at heart.'}
          </p>
          <div className="flex justify-center">
            <a href="#shop" className="bg-[#06D6A0] hover:bg-[#05b586] text-white font-fun text-3xl py-5 px-12 rounded-full border-4 border-[#1D3557] shadow-[8px_8px_0_#1D3557] active:translate-y-2 active:shadow-none transition-all flex items-center gap-4">
              <ShoppingBag size={32} /> Let's Go!
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-fun text-5xl text-center text-[#E63946] mb-16">Fresh Drops 🔥</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} className={`bg-white rounded-3xl p-4 border-4 border-[#1D3557] shadow-[6px_6px_0_#E63946] hover:-translate-y-3 transition-transform relative ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <div className="absolute -top-4 -left-4 bg-[#FFD166] text-[#1D3557] font-fun text-sm px-4 py-2 rounded-xl border-2 border-[#1D3557] transform -rotate-12 z-10">
                  {p.tag}
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-[#F0F4FF]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-fun text-xl text-[#1D3557] mb-2">{p.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-body font-black text-2xl text-[#457B9D]">{p.price}</span>
                  <button className="bg-[#E63946] text-white p-3 rounded-full hover:bg-red-600 transition-colors border-2 border-[#1D3557]">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#1D3557] text-white py-16 px-6 mt-12 border-t-[12px] border-[#E63946]">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-fun text-4xl mb-6 text-[#FFD166]">{siteName}</h3>
          <p className="font-body font-bold text-xl mb-12 max-w-md mx-auto">
            {content.about_text || "Bringing color to your wardrobe everyday!"}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 font-fun text-xl">
            <div className="bg-white/10 p-6 rounded-3xl border-2 border-[#457B9D] flex flex-col items-center gap-3 hover:bg-[#E63946] transition-colors">
               <Phone size={32} />
               <span>{content.contact_info?.phone || '98765 43210'}</span>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border-2 border-[#457B9D] flex flex-col items-center gap-3 hover:bg-[#06D6A0] transition-colors">
               <MapPin size={32} />
               <span>{content.contact_info?.address || 'Fashion Hub, Kerala'}</span>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border-2 border-[#457B9D] flex flex-col items-center gap-3 hover:bg-[#FFD166] transition-colors text-white hover:text-[#1D3557]">
               <Mail size={32} />
               <span>{content.contact_info?.email || 'hello@colorpop.com'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

