import React from 'react';
import { Square, ArrowRight } from 'lucide-react';

export default function MinimalRealEstateTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'AURA';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Villa No. 14', price: '₹5.5 Cr', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', info: '4 Bed / 4 Bath / 4200 Sqft' },
    { name: 'Penthouse B', price: '₹3.2 Cr', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', info: '3 Bed / 2 Bath / 2800 Sqft' },
    { name: 'Studio 09', price: '₹95 L', image: 'https://images.unsplash.com/photo-1502672260266-1c158bf92faa?auto=format&fit=crop&w=800&q=80', info: '1 Bed / 1 Bath / 850 Sqft' },
    { name: 'Estate 04', price: '₹12 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', info: '6 Bed / 7 Bath / 9500 Sqft' }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap');
        .font-min { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="p-8 md:p-12 flex justify-between items-center bg-white sticky top-0 z-50">
        <span className="font-min font-bold text-2xl tracking-tighter uppercase">{siteName}</span>
        <div className="flex gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#properties" className="hover:opacity-50 transition-opacity">Properties</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-32 px-8 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-end">
          <div>
            <h1 className="font-min text-5xl md:text-7xl font-medium tracking-tighter leading-[1.1] mb-8 uppercase">
              {content.hero_title || 'Curated Spaces.'}
            </h1>
            <p className="font-min text-lg text-gray-500 max-w-md leading-relaxed">
              {content.hero_text || 'A minimalist approach to luxury real estate. Discover properties that speak for themselves.'}
            </p>
          </div>
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" alt="Architecture" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="py-20 px-8 md:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-white/20 pb-8">
             <h2 className="font-min text-3xl font-medium tracking-tighter uppercase">Available Now</h2>
             <Square size={24} className="text-white/50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {properties.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/2] overflow-hidden mb-6 bg-gray-900">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start font-min">
                   <div>
                     <h3 className="text-xl uppercase tracking-tighter mb-2">{p.name}</h3>
                     <div className="text-gray-400 text-sm tracking-wide">{p.info}</div>
                   </div>
                   <span className="text-xl">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-32 px-8 md:px-12 bg-white text-black font-min">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 border-t border-black pt-16">
          <div>
            <span className="font-bold text-3xl tracking-tighter uppercase block mb-8">{siteName}</span>
            <p className="text-gray-500 leading-relaxed max-w-sm text-sm">
              {content.about_text || "Redefining real estate through design, architecture, and simplicity."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm uppercase tracking-wide">
            <div>
               <div className="font-bold mb-6">Inquiries</div>
               <div className="space-y-4 text-gray-500">
                 <div>{content.contact_info?.email || 'hello@aura.com'}</div>
                 <div>{content.contact_info?.phone || '+91 98765 43210'}</div>
               </div>
            </div>
            <div>
               <div className="font-bold mb-6">Studio</div>
               <div className="text-gray-500 leading-relaxed">
                 {content.contact_info?.address || 'Design Park\nKerala, India'}
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

