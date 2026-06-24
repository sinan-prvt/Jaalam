import React from 'react';
import { Home, MapPin, Phone, Mail, Award } from 'lucide-react';

export default function ClassicRealEstateTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Heritage Homes';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Colonial Estate', price: '₹8.5 Cr', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', location: 'Heritage District', details: '5 Beds | 4 Baths | Large Garden' },
    { name: 'Suburban Family Home', price: '₹2.2 Cr', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', location: 'Oakwood Suburbs', details: '4 Beds | 3 Baths | 2 Car Garage' },
    { name: 'Country Manor', price: '₹12 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', location: 'Countryside', details: '6 Beds | 5 Baths | Pool' },
    { name: 'Classic Townhouse', price: '₹3.8 Cr', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', location: 'City Historic Center', details: '3 Beds | 2.5 Baths | Terrace' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] font-serif border-t-8 border-[#1A252C]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+Pro:wght@400;600&display=swap');
        .font-classic { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Source Sans Pro', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="py-6 px-6 border-b border-[#EAE3D2] bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Home className="text-[#1A252C]" size={32} />
            <span className="font-classic text-3xl font-bold tracking-tight text-[#1A252C]">{siteName}</span>
          </div>
          <div className="flex gap-8 font-body font-semibold text-[#5A6C7D] uppercase tracking-wider text-sm">
            <a href="#featured" className="hover:text-[#1A252C] transition-colors">Featured Listings</a>
            <a href="#about" className="hover:text-[#1A252C] transition-colors">Our History</a>
            <div className="flex items-center gap-2 text-[#1A252C]">
               <Phone size={16} />
               <span>{content.contact_info?.phone || '1-800-ESTATE'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-6 text-[#8B9DAE]">
               <Award size={20} />
               <span className="font-body font-semibold uppercase tracking-widest text-sm">Trusted Since 1985</span>
            </div>
            <h1 className="font-classic text-5xl md:text-6xl font-bold mb-6 text-[#1A252C] leading-tight">
              {content.hero_title || 'Tradition. Trust. Real Estate.'}
            </h1>
            <p className="font-body text-lg text-[#5A6C7D] mb-10 leading-relaxed max-w-md">
              {content.hero_text || 'Guiding families to their dream homes with integrity and generations of local market expertise.'}
            </p>
            <button className="bg-[#1A252C] hover:bg-[#2C3E50] text-white font-body font-semibold py-4 px-10 transition-colors shadow-lg">
              Search Properties
            </button>
          </div>
          <div className="w-full md:w-1/2 relative p-4 bg-white border border-[#EAE3D2] shadow-sm">
             <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" alt="Classic Home" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="featured" className="py-20 px-6 bg-[#EFECE5]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-classic text-4xl font-bold text-[#1A252C] mb-4">Featured Listings</h2>
            <p className="font-body text-[#5A6C7D]">A selection of our finest properties currently on the market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((p: any, i: number) => (
              <div key={i} className="bg-white border border-[#EAE3D2] p-4 flex flex-col md:flex-row gap-6 group hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="w-full md:w-3/5 py-2 flex flex-col justify-between">
                  <div>
                    <h3 className="font-classic font-bold text-2xl text-[#1A252C] mb-2 group-hover:text-[#3B5266] transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-1 text-[#8B9DAE] font-body text-sm mb-4">
                      <MapPin size={16} /> {p.location}
                    </div>
                  </div>
                  <div>
                    <div className="font-body text-[#5A6C7D] mb-4 pb-4 border-b border-[#EAE3D2] text-sm">
                      {p.details}
                    </div>
                    <div className="font-classic font-bold text-2xl text-[#1A252C]">
                      {p.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-[#1A252C] text-[#EFECE5] py-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <Home className="mx-auto text-[#8B9DAE] mb-6" size={40} />
          <h3 className="font-classic text-3xl mb-6">{siteName}</h3>
          <p className="font-body max-w-2xl mx-auto mb-12 text-[#8B9DAE] leading-relaxed">
            {content.about_text || "With over 35 years of experience, we pride ourselves on building lasting relationships and providing unmatched real estate services to our community."}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 font-body border-t border-[#2C3E50] pt-12">
            <div className="flex flex-col items-center gap-2">
               <Phone size={20} className="text-[#EFECE5]" />
               <span className="font-semibold">{content.contact_info?.phone || '1-800-ESTATE'}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <MapPin size={20} className="text-[#EFECE5]" />
               <span className="font-semibold">{content.contact_info?.address || '100 Main Street, Kerala'}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <Mail size={20} className="text-[#EFECE5]" />
               <span className="font-semibold">{content.contact_info?.email || 'contact@heritagehomes.com'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

