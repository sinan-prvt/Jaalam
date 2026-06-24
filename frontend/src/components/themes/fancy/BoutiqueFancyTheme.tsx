import React from 'react';
import { Gem, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export default function BoutiqueFancyTheme({ website, content }: any) {
  const siteName = content.settings_json?.website_name || website.slug || 'Maison Rouge';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Bridal Set - The Heritage', price: '₹4,500', image: 'https://images.unsplash.com/photo-1599643478514-4a4208bd50d6?auto=format&fit=crop&w=600&q=80', description: 'Heavy imitation Kundan bridal set.' },
    { name: 'Evening Clutch', price: '₹1,200', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: 'Velvet clutch with Zardosi embroidery.' },
    { name: 'Chandelier Earrings', price: '₹850', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Gold-plated statement earrings.' },
    { name: 'Designer Bindi Book', price: '₹250', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Premium collection of stone bindis.' }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C1E16] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Jost:wght@300;400;500&display=swap');
        .font-boutique { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Jost', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="py-8 border-b border-[#E8E1D5]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-boutique text-4xl tracking-[0.2em] uppercase mb-4 text-[#8C2323]">{siteName}</h1>
          <nav className="flex justify-center gap-10 font-body text-xs tracking-widest uppercase text-[#5A4A42]">
            <a href="#collections" className="hover:text-[#8C2323] transition-colors">Collections</a>
            <a href="#about" className="hover:text-[#8C2323] transition-colors">The Boutique</a>
            <a href="#contact" className="hover:text-[#8C2323] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 md:pr-12">
            <p className="font-body text-[#8C2323] text-sm tracking-widest uppercase mb-4">Exquisite Collections</p>
            <h2 className="font-boutique text-5xl md:text-6xl leading-tight mb-6">
              {content.hero_title || 'Redefining Elegance for the Modern Woman.'}
            </h2>
            <p className="font-body text-lg text-[#5A4A42] font-light leading-relaxed mb-8">
              {content.hero_text || 'Step into a world of curated beauty. From bridal imitation jewelry to imported cosmetics, find your perfect statement piece.'}
            </p>
            <a href="#collections" className="inline-flex items-center gap-4 bg-[#8C2323] text-white px-8 py-4 font-body text-xs uppercase tracking-widest hover:bg-[#6b1a1a] transition-colors">
              Discover More <ArrowRight size={16} />
            </a>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 border border-[#8C2323] translate-x-4 translate-y-4"></div>
              <img src="https://images.unsplash.com/photo-1515562141207-7a48fb3c274d?auto=format&fit=crop&w=800&q=80" alt="Boutique" className="relative z-10 w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section id="collections" className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-between items-end mb-16 border-b border-[#E8E1D5] pb-4">
            <h3 className="font-boutique text-3xl text-[#8C2323]">Signature Pieces</h3>
            <a href="#" className="font-body text-sm uppercase tracking-widest text-[#5A4A42] hover:text-[#8C2323]">View All</a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <h4 className="font-boutique text-lg mb-1">{p.name}</h4>
                <div className="font-body text-[#8C2323] tracking-widest">{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 px-6 border-t border-[#E8E1D5]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-12">
          <div className="w-full md:w-1/3">
             <h3 className="font-boutique text-2xl tracking-[0.1em] uppercase mb-6 text-[#8C2323]">{siteName}</h3>
             <p className="font-body text-sm text-[#5A4A42] leading-relaxed">
               {content.about_text || "The ultimate destination for luxury fancy items and bridal collections."}
             </p>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-sm text-[#5A4A42]">
             <div>
               <h4 className="uppercase tracking-widest text-[#8C2323] mb-6 border-b border-[#E8E1D5] pb-2 inline-block">Contact</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-3"><Phone size={16} /> {content.contact_info?.phone || '+91 98765 43210'}</div>
                 <div className="flex items-center gap-3"><Mail size={16} /> {content.contact_info?.email || 'boutique@maisonrouge.in'}</div>
               </div>
             </div>
             <div>
               <h4 className="uppercase tracking-widest text-[#8C2323] mb-6 border-b border-[#E8E1D5] pb-2 inline-block">Visit</h4>
               <div className="flex items-start gap-3"><MapPin size={16} className="shrink-0 mt-1" /> <span className="leading-relaxed">{content.contact_info?.address || 'The High Street Boutique, Kerala'}</span></div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

