import React from 'react';
import { Home, Search, MapPin, ChevronRight, Phone } from 'lucide-react';

export default function ModernRealEstateTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Haven Real Estate';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Modern Family Home', price: '₹1.5 Cr', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', location: 'Suburbs', beds: 4, baths: 3 },
    { name: 'Minimalist Townhouse', price: '₹2.1 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', location: 'City Center', beds: 3, baths: 2 },
    { name: 'Lakefront Cabin', price: '₹85 L', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80', location: 'Lake District', beds: 2, baths: 1 },
    { name: 'Contemporary Villa', price: '₹3.2 Cr', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', location: 'Hills', beds: 5, baths: 4 }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-800 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        .font-modern { font-family: 'Poppins', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Home className="text-white" size={24} />
            </div>
            <span className="font-modern font-bold text-xl text-slate-900">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-modern text-sm font-medium">
            <a href="#buy" className="text-slate-600 hover:text-emerald-500 transition-colors">Buy</a>
            <a href="#rent" className="text-slate-600 hover:text-emerald-500 transition-colors">Rent</a>
            <a href="#sell" className="text-slate-600 hover:text-emerald-500 transition-colors">Sell</a>
          </nav>
          <div className="flex items-center gap-4">
             <button className="hidden md:block font-modern text-sm font-semibold text-emerald-500">Sign In</button>
             <button className="bg-slate-900 text-white font-modern text-sm font-semibold py-2 px-5 rounded-lg hover:bg-slate-800 transition-colors">
               Add Listing
             </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6">
        <div className="container mx-auto bg-emerald-50 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative">
          <div className="w-full md:w-1/2 p-10 md:p-16 z-10">
            <h1 className="font-modern text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {content.hero_title || 'Find your perfect place.'}
            </h1>
            <p className="font-modern text-slate-600 mb-10 text-lg max-w-md">
              {content.hero_text || 'Discover homes that match your lifestyle. Buying or renting, we make it easy.'}
            </p>
            
            <div className="bg-white p-3 rounded-2xl shadow-lg flex gap-2 w-full max-w-md">
               <div className="flex-1 flex items-center px-3 bg-slate-50 rounded-xl">
                 <Search size={20} className="text-slate-400 mr-2" />
                 <input type="text" placeholder="Search location..." className="bg-transparent w-full outline-none font-modern text-sm py-3" />
               </div>
               <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl transition-colors">
                 <Search size={24} />
               </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-full min-h-[500px] bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center md:absolute right-0 top-0">
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="buy" className="py-20 px-6 container mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-modern text-3xl font-bold text-slate-900 mb-2">Explore Homes</h2>
            <p className="font-modern text-slate-500">Handpicked properties for you</p>
          </div>
          <button className="text-emerald-500 font-modern font-semibold flex items-center gap-1 hover:gap-2 transition-all">
             See All <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden relative p-3 pb-0">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-slate-900 font-modern font-bold text-sm px-3 py-1 rounded-lg shadow-sm">
                  {p.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-modern font-bold text-lg text-slate-900 mb-1 truncate">{p.name}</h3>
                <div className="flex items-center gap-1 text-slate-500 font-modern text-sm mb-4">
                  <MapPin size={14} /> {p.location}
                </div>
                <div className="flex gap-4 border-t border-slate-100 pt-4 text-slate-600 font-modern text-sm">
                   <div className="flex items-center gap-1"><span className="font-bold text-slate-900">{p.beds}</span> Beds</div>
                   <div className="flex items-center gap-1"><span className="font-bold text-slate-900">{p.baths}</span> Baths</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="sell" className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-4 gap-12 font-modern">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-emerald-500 p-2 rounded-lg inline-block">
                <Home className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-slate-900">{siteName}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
              {content.about_text || "We're on a mission to change how real estate works. Transparent, digital, and customer-first."}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li>Search Properties</li>
              <li>Sell your Home</li>
              <li>Mortgage Calculator</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact Us</h4>
            <div className="space-y-3 text-slate-500 text-sm">
               <div className="flex items-center gap-2">
                 <Phone size={16} className="text-emerald-500" /> {content.contact_info?.phone || '98765 43210'}
               </div>
               <div className="flex items-start gap-2">
                 <MapPin size={16} className="text-emerald-500 mt-1 shrink-0" />
                 <span>{content.contact_info?.address || 'Tech Hub, Kerala'}</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

