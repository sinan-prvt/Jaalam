import React from 'react';
import { ShoppingCart, Search, Menu, User, MapPin, Clock, Phone, ChevronRight } from 'lucide-react';

export default function ModernGroceryTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'FreshMart';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Fresh Hass Avocado', price: '₹120/pc', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80', category: 'Fruits' },
    { name: 'Organic Bananas', price: '₹60/kg', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', category: 'Fruits' },
    { name: 'Whole Wheat Bread', price: '₹50/pack', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', category: 'Bakery' },
    { name: 'Farm Fresh Milk', price: '₹35/500ml', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', category: 'Dairy' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-modern { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-2 px-6 text-xs font-medium flex justify-between items-center">
        <div className="flex gap-4">
           <span className="hidden md:inline">Free delivery on orders over ₹500!</span>
        </div>
        <div className="flex gap-4">
           <span className="flex items-center gap-1"><MapPin size={14} /> Deliver to: Kerala 682001</span>
           <span className="flex items-center gap-1"><Clock size={14} /> Delivery in 30 mins</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Menu className="text-slate-500 cursor-pointer md:hidden" />
            <span className="font-modern text-2xl font-bold text-emerald-600 tracking-tight">{siteName}</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search for groceries, staples, and more..." 
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
            />
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors">
              <User size={24} />
              <span className="text-sm font-medium">Sign In</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
              <ShoppingCart size={24} />
              <span className="text-sm font-bold">₹0.00</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 px-6">
        <div className="container mx-auto bg-emerald-50 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">100% Fresh Guarantee</span>
            <h1 className="font-modern text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              {content.hero_title || 'Groceries delivered in minutes.'}
            </h1>
            <p className="font-modern text-slate-600 mb-8 max-w-md">
              {content.hero_text || 'Shop from 5000+ daily essentials, fresh fruits, vegetables, and more.'}
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-lg flex items-center gap-2 transition-colors">
              Shop Now <ChevronRight size={18} />
            </button>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-96 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
          </div>
        </div>
      </section>

      {/* Categories (Mock) */}
      <section className="py-8 px-6 border-b border-slate-200 bg-white">
        <div className="container mx-auto flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Snacks', 'Beverages'].map((cat, i) => (
            <div key={i} className="flex-shrink-0 bg-slate-50 border border-slate-200 px-6 py-3 rounded-full text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 cursor-pointer transition-colors">
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6 container mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-modern text-2xl font-bold text-slate-900">Trending Today</h2>
          <span className="text-emerald-600 font-medium text-sm cursor-pointer hover:underline">View All</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p: any, i: number) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-square bg-slate-50 relative p-4">
                 <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-400 mb-1">{p.category}</div>
                <h3 className="font-modern font-semibold text-slate-800 text-sm md:text-base mb-3 line-clamp-2 h-10">{p.name}</h3>
                <div className="flex justify-between items-center">
                  <div className="font-modern font-bold text-slate-900">{p.price}</div>
                  <button className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold py-1.5 px-3 rounded-md text-sm transition-colors border border-emerald-200 hover:border-emerald-600">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
           <div className="md:col-span-2">
             <h4 className="font-modern font-bold text-xl text-white mb-4">{siteName}</h4>
             <p className="text-sm max-w-sm leading-relaxed mb-6">
               {content.about_text || "Your trusted neighborhood supermarket, now online. Quality products delivered fast."}
             </p>
             <div className="flex gap-4">
               {/* App Store Badges Mock */}
               <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-xs cursor-pointer">Download on iOS</div>
               <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-xs cursor-pointer">Get it on Android</div>
             </div>
           </div>
           <div>
             <h4 className="font-modern font-semibold text-white mb-4">Customer Support</h4>
             <ul className="space-y-2 text-sm">
               <li className="flex items-center gap-2"><Phone size={14} /> {content.contact_info?.phone || '1800 123 4567'}</li>
               <li>Help Center</li>
               <li>Returns & Refunds</li>
             </ul>
           </div>
           <div>
             <h4 className="font-modern font-semibold text-white mb-4">Our Store</h4>
             <p className="text-sm leading-relaxed">
               <MapPin size={14} className="inline mr-1" /> {content.contact_info?.address || '123 Market Street, Kerala'}
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
}

