import React from 'react';
import { Building2, Search, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function UrbanApartmentsTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Metro Living';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Skyline Penthouse', price: '₹4.5 Cr', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', location: 'Downtown', type: '3 BHK' },
    { name: 'Loft Studio', price: '₹1.2 Cr', image: 'https://images.unsplash.com/photo-1502672260266-1c158bf92faa?auto=format&fit=crop&w=800&q=80', location: 'Arts District', type: 'Studio' },
    { name: 'Highrise Suite', price: '₹2.8 Cr', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', location: 'Tech Park', type: '2 BHK' },
    { name: 'Garden Duplex', price: '₹3.5 Cr', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', location: 'Suburbs', type: '4 BHK' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap');
        .font-urban { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className="p-6 md:p-8 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
           <Building2 size={24} className="text-blue-600" />
           <span className="font-urban font-black text-xl tracking-tight">{siteName}</span>
        </div>
        <div className="hidden md:flex gap-8 font-urban text-sm font-medium text-slate-500">
          <a href="#search" className="hover:text-blue-600 transition-colors">Search</a>
          <a href="#properties" className="hover:text-blue-600 transition-colors">Listings</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h1 className="font-urban text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-slate-900">
              {content.hero_title || 'Find your place in the city.'}
            </h1>
            <p className="font-urban text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
              {content.hero_text || 'Modern apartments, lofts, and penthouses in the most desirable urban neighborhoods.'}
            </p>
            
            <div id="search" className="flex bg-slate-50 border border-slate-200 rounded-xl p-2 max-w-md focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
               <div className="flex-1 flex items-center px-4">
                 <Search size={20} className="text-slate-400 mr-2" />
                 <input type="text" placeholder="Search by neighborhood..." className="bg-transparent w-full outline-none font-urban text-sm" />
               </div>
               <button className="bg-blue-600 hover:bg-blue-700 text-white font-urban font-medium py-3 px-6 rounded-lg transition-colors">
                 Search
               </button>
            </div>
          </div>
          <div className="w-full md:w-1/2">
             <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" className="rounded-2xl rounded-tr-[4rem] shadow-xl" alt="Urban Appt" />
               <img src="https://images.unsplash.com/photo-1502672260266-1c158bf92faa?auto=format&fit=crop&w=600&q=80" className="rounded-2xl rounded-bl-[4rem] shadow-xl mt-12" alt="Urban Loft" />
             </div>
          </div>
        </div>
      </section>

      {/* Properties List */}
      <section id="properties" className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-urban text-3xl font-black tracking-tight text-slate-900">Latest Listings</h2>
            <button className="text-blue-600 font-urban font-medium flex items-center gap-1 hover:gap-2 transition-all">
               View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="aspect-square overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 font-urban font-bold text-xs px-2 py-1 rounded-md">
                    {p.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-blue-600 font-urban font-black text-xl mb-1">{p.price}</div>
                  <h3 className="font-urban font-bold text-slate-900 mb-2 truncate">{p.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 font-urban text-xs mb-4">
                    <MapPin size={12} /> {p.location}
                  </div>
                  <button className="w-full border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-urban font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm">
                    View Details <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-4 gap-12 font-urban">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <Building2 size={24} className="text-blue-400" />
               <span className="font-black text-xl tracking-tight">{siteName}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {content.about_text || "Your trusted partner in navigating the urban real estate market. We make finding your next home simple and transparent."}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-2 text-slate-400 text-sm">
              <p>{content.contact_info?.email || 'hello@metroliving.com'}</p>
              <p>{content.contact_info?.phone || '0484 234 5678'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Office</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {content.contact_info?.address || 'Level 4, Business Tower\nUrban District, Kerala'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

