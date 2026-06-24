import React from 'react';
import { Briefcase, MapPin, Building, ArrowRight } from 'lucide-react';

export default function CommercialTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Apex Commercial';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Financial District Tower', price: 'Lease: ₹250/sqft', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', location: 'CBD', type: 'Office Space' },
    { name: 'Tech Park Campus', price: 'Lease: ₹180/sqft', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', location: 'Silicon Valley', type: 'Tech Hub' },
    { name: 'Premium Retail Outlet', price: 'Lease: ₹400/sqft', image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&w=800&q=80', location: 'High Street', type: 'Retail' },
    { name: 'Logistics Warehouse', price: 'Lease: ₹80/sqft', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', location: 'Industrial Area', type: 'Warehouse' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Open+Sans:wght@400;600&display=swap');
        .font-corp { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Open Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-4 border-[#004B87] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="text-[#004B87]" size={28} />
            <span className="font-corp font-extrabold text-2xl tracking-tighter text-[#004B87] uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-corp font-semibold text-sm text-[#495057]">
            <a href="#properties" className="hover:text-[#004B87] transition-colors">Properties</a>
            <a href="#services" className="hover:text-[#004B87] transition-colors">Services</a>
            <button className="bg-[#004B87] text-white px-5 py-2 hover:bg-[#003366] transition-colors">Contact Agent</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-[#004B87] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-3/5">
            <h1 className="font-corp text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {content.hero_title || 'Strategic Spaces for Business Growth.'}
            </h1>
            <p className="font-body text-lg md:text-xl text-[#E9ECEF] mb-10 max-w-2xl leading-relaxed">
              {content.hero_text || 'Premium office spaces, retail locations, and industrial properties for modern enterprises.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 font-corp font-semibold">
              <button className="bg-white text-[#004B87] px-8 py-4 hover:bg-[#F8F9FA] transition-colors shadow-lg">
                Find Office Space
              </button>
              <button className="border-2 border-white text-white px-8 py-4 hover:bg-white/10 transition-colors">
                List Your Property
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-2/5">
             <div className="bg-white p-6 rounded shadow-2xl text-[#212529]">
                <h3 className="font-corp font-bold text-xl mb-4 text-[#004B87]">Quick Property Search</h3>
                <div className="space-y-4 font-body">
                  <select className="w-full p-3 border border-[#DEE2E6] bg-[#F8F9FA] focus:outline-none focus:border-[#004B87]">
                    <option>Property Type</option>
                    <option>Office Space</option>
                    <option>Retail</option>
                    <option>Industrial</option>
                  </select>
                  <select className="w-full p-3 border border-[#DEE2E6] bg-[#F8F9FA] focus:outline-none focus:border-[#004B87]">
                    <option>Location / District</option>
                    <option>CBD</option>
                    <option>Tech Park</option>
                    <option>Suburbs</option>
                  </select>
                  <button className="w-full bg-[#004B87] text-white font-corp font-bold py-3 mt-2 hover:bg-[#003366] transition-colors flex items-center justify-center gap-2">
                    Search Now <ArrowRight size={18} />
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="py-20 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-corp text-3xl font-extrabold text-[#212529] mb-4">Featured Commercial Properties</h2>
          <div className="w-24 h-1 bg-[#004B87] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((p: any, i: number) => (
            <div key={i} className="bg-white border border-[#DEE2E6] hover:shadow-xl transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-[#004B87] text-white font-corp font-bold text-xs px-3 py-1 shadow-md">
                  {p.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-corp font-bold text-lg text-[#212529] mb-2 line-clamp-1">{p.name}</h3>
                <div className="flex items-center gap-2 text-[#6C757D] font-body text-sm mb-4">
                  <MapPin size={16} className="text-[#004B87]" /> {p.location}
                </div>
                <div className="border-t border-[#DEE2E6] pt-4 flex justify-between items-center">
                  <span className="font-corp font-bold text-[#004B87]">{p.price}</span>
                  <Building className="text-[#CED4DA]" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="services" className="bg-[#212529] text-[#F8F9FA] py-16 px-6 border-t-8 border-[#004B87]">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-12 font-body">
          <div>
            <div className="flex items-center gap-2 mb-6">
               <Briefcase className="text-[#004B87]" size={24} />
               <span className="font-corp font-extrabold text-xl tracking-tighter uppercase">{siteName}</span>
            </div>
            <p className="text-[#ADB5BD] text-sm leading-relaxed">
              {content.about_text || "Specializing in commercial real estate solutions. From leasing office spaces to large scale industrial acquisitions, we are your corporate real estate partner."}
            </p>
          </div>
          <div>
            <h4 className="font-corp font-bold mb-6 text-white uppercase tracking-wider">Corporate Office</h4>
            <div className="space-y-4 text-sm text-[#ADB5BD]">
              <p>{content.contact_info?.address || 'Level 12, Apex Tower\nBusiness District, Kerala'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-corp font-bold mb-6 text-white uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-4 text-sm text-[#ADB5BD]">
              <p>Sales: {content.contact_info?.phone || '1800 123 4567'}</p>
              <p>Email: {content.contact_info?.email || 'corporate@apex.com'}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

