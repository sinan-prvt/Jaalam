import React from 'react';
import { ShoppingBasket, MapPin, Phone, Tag } from 'lucide-react';

export default function ClassicGroceryTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Family Supermarket';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Basmati Rice (Premium)', price: '₹220/kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=600&q=80', originalPrice: '₹250' },
    { name: 'Refined Sunflower Oil', price: '₹145/L', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', originalPrice: '₹160' },
    { name: 'Red Onions', price: '₹40/kg', image: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?auto=format&fit=crop&w=600&q=80', originalPrice: '₹55' },
    { name: 'Washing Powder', price: '₹190/kg', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80', originalPrice: '₹210' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        .font-classic { font-family: 'Roboto', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="bg-[#E50914] text-white sticky top-0 z-50 border-b-4 border-[#0033A0]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <ShoppingBasket size={32} className="text-[#FFD100]" />
              <span className="font-classic text-3xl font-black italic tracking-tighter shadow-sm">{siteName}</span>
            </div>
            <div className="hidden md:flex items-center gap-6 font-classic font-bold text-sm">
              <a href="#offers" className="hover:text-[#FFD100] transition-colors flex items-center gap-1"><Tag size={16}/> Weekly Offers</a>
              <a href="#visit" className="hover:text-[#FFD100] transition-colors">Find Us</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0033A0] transform skew-x-12 translate-x-16 opacity-10"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative z-10">
          <div className="w-full md:w-1/2 pr-0 md:pr-12">
            <h1 className="font-classic text-4xl md:text-6xl font-black text-[#0033A0] mb-4 uppercase leading-none">
              {content.hero_title || 'Everyday Low Prices.'}
            </h1>
            <p className="font-classic text-xl font-medium text-gray-600 mb-8">
              {content.hero_text || 'Your one-stop shop for daily groceries, household items, and fresh produce at unbeatable rates.'}
            </p>
            <button className="bg-[#FFD100] hover:bg-[#F2C700] text-[#212529] font-classic font-bold text-lg py-3 px-8 rounded shadow-[2px_2px_0_#212529] active:shadow-none active:translate-y-[2px] transition-all">
              View Weekly Flyer
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
             <div className="bg-white p-4 border-4 border-[#0033A0] transform rotate-2 shadow-xl">
               <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80" alt="Supermarket Aisle" className="w-full h-auto" />
             </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="offers" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-classic text-3xl font-black text-[#E50914] uppercase bg-white px-4 py-2 border-2 border-[#E50914] inline-block shadow-[4px_4px_0_#E50914]">
              Mega Savings
            </h2>
            <div className="h-1 flex-1 bg-[#0033A0]"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p: any, i: number) => (
              <div key={i} className="bg-white border-2 border-gray-200 p-4 hover:border-[#0033A0] transition-colors flex flex-col h-full relative">
                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-[#E50914] text-white font-black text-xs px-2 py-1 rounded shadow-sm z-10">
                  SAVE!
                </div>
                
                <div className="aspect-square bg-white mb-4 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <h3 className="font-classic font-bold text-lg text-[#0033A0] leading-tight mb-2 flex-grow">{p.name}</h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <div className="text-gray-400 line-through text-sm font-medium">{p.originalPrice}</div>
                    <div className="font-classic font-black text-2xl text-[#E50914]">{p.price}</div>
                  </div>
                  <button className="bg-[#0033A0] hover:bg-[#002277] text-white px-4 py-2 font-bold text-sm rounded transition-colors">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="visit" className="bg-[#212529] text-white py-12 px-4 border-t-8 border-[#FFD100]">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="font-classic text-2xl font-black italic mb-4 text-[#FFD100]">{siteName}</h3>
          <p className="font-classic mb-8 text-gray-400 max-w-md mx-auto">
            {content.about_text || "Serving the community with quality products and friendly service since 1995."}
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 font-classic font-bold bg-[#343A40] p-6 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="text-[#FFD100]" /> 
              <span>{content.contact_info?.phone || '0484 234 5678'}</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <MapPin className="text-[#FFD100]" /> 
              <span>{content.contact_info?.address || 'Main Road Junction, Kerala'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

