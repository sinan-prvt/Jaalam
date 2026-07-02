import React from 'react';
import { Diamond, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function LuxuryTextilesTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'MAISON D\'OR';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Embroidered Velvet Gown', price: '₹85,000', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80', collection: 'Evening Wear' },
    { name: 'Silk Organza Saree', price: '₹42,000', image: 'https://images.unsplash.com/photo-1583391733958-d15fa693d221?auto=format&fit=crop&w=600&q=80', collection: 'Bridal' },
    { name: 'Bespoke Suit', price: '₹65,000', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', collection: 'Menswear' },
    { name: 'Handcrafted Sherwani', price: '₹95,000', image: 'https://images.unsplash.com/photo-1559582798-678dfc71cee4?auto=format&fit=crop&w=600&q=80', collection: 'Couture' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#050505] text-[#D4AF37] font-sans selection:bg-[#D4AF37] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;500&display=swap');
        .font-luxury { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#D4AF37]/20 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Diamond className="text-[#D4AF37]" size={20} />
            <span className="font-luxury text-2xl tracking-[0.2em] uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-body text-[10px] tracking-widest uppercase text-gray-400">
            <a href="#collections" className="hover:text-[#D4AF37] transition-colors">Collections</a>
            <a href="#atelier" className="hover:text-[#D4AF37] transition-colors">The Atelier</a>
            <button className="text-[#D4AF37] border-b border-[#D4AF37] pb-1">Book Appointment</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="w-px h-24 bg-[#D4AF37] mb-8"></div>
          <h1 className="font-luxury text-4xl md:text-6xl font-bold mb-6 text-white tracking-widest uppercase leading-tight">
            {content.hero_title || 'Haute Couture.'}
          </h1>
          <p className="font-body text-xs text-[#D4AF37] tracking-[0.3em] uppercase max-w-2xl mx-auto mb-12 leading-loose">
            {content.hero_text || 'Exquisite craftsmanship meets contemporary luxury. Discover our latest designer collection.'}
          </p>
          <button className="flex items-center gap-4 text-white hover:text-[#D4AF37] font-body text-xs tracking-widest uppercase transition-colors group">
             Explore <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Products */}
      <section id="collections" className="py-32 px-6 bg-[#050505]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-luxury text-3xl text-center mb-24 text-white tracking-[0.2em] uppercase">Signature Pieces</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {products.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[2/3] overflow-hidden mb-8 relative border border-[#1A1A1A]">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 group-hover:scale-105 transition-all duration-1000" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-body text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] mb-3">{p.collection}</div>
                    <h3 className="font-luxury text-xl text-white tracking-wider">{p.name}</h3>
                  </div>
                  <div className="font-body text-sm text-gray-400 tracking-wider">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
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
      <footer id="atelier" className="py-24 px-6 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="font-luxury text-2xl text-white mb-8 tracking-[0.3em] uppercase">{siteName}</h3>
          <p className="font-body text-xs text-gray-500 tracking-[0.2em] leading-loose max-w-xl mx-auto mb-16 uppercase">
            {content.about_text || "Bespoke tailoring and luxury pret-a-porter. Experience fashion at its finest."}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-12 font-body text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">
            <div className="flex items-center gap-3"><Phone size={14} /> {content.contact_info?.phone || 'VIP Concierge: +91 98765 43210'}</div>
            <div className="flex items-center gap-3"><MapPin size={14} /> {content.contact_info?.address || 'Luxury Avenue, Kerala'}</div>
            <div className="flex items-center gap-3"><Mail size={14} /> {content.contact_info?.email || 'atelier@maisondor.in'}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

