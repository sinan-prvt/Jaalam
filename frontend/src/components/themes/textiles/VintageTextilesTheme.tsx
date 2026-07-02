import React from 'react';
import { Scissors, MapPin, Mail, Phone } from 'lucide-react';

export default function VintageTextilesTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Heritage Handlooms';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Khadi Kurta Set', price: '₹1,850', image: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&w=600&q=80', description: 'Handspun cotton, natural dyes.' },
    { name: 'Block Print Saree', price: '₹3,200', image: 'https://images.unsplash.com/photo-1615886753866-79396abc446e?auto=format&fit=crop&w=600&q=80', description: 'Traditional Ajrakh printing.' },
    { name: 'Linen Trousers', price: '₹1,500', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80', description: 'Breathable pure linen.' },
    { name: 'Ikat Dupatta', price: '₹950', image: 'https://images.unsplash.com/photo-1604055276329-8cbba80b8893?auto=format&fit=crop&w=600&q=80', description: 'Handwoven Ikat patterns.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F4EFE6] text-[#3D312A] font-serif border-x-[12px] border-[#D4C3A3] box-border">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Karla:wght@400;700&display=swap');
        .font-vintage { font-family: 'Old Standard TT', serif; }
        .font-body { font-family: 'Karla', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b-2 border-[#3D312A] py-8 px-6 text-center bg-[#F4EFE6] relative z-10">
        <div className="container mx-auto">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-4">Established 1982</p>
          <h1 className="font-vintage text-5xl md:text-7xl font-bold tracking-tight mb-6">
            {siteName}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-[#3D312A]"></div>
            <Scissors size={20} className="text-[#8C4A32]" />
            <div className="w-16 h-px bg-[#3D312A]"></div>
          </div>
          <nav className="flex justify-center gap-8 font-body text-sm font-bold tracking-widest uppercase">
            <a href="#shop" className="hover:text-[#8C4A32] transition-colors">Catalog</a>
            <a href="#about" className="hover:text-[#8C4A32] transition-colors">Our Story</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-[#EBE3D5] border-b border-[#D4C3A3]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-vintage text-4xl italic mb-6 text-[#8C4A32]">
            {content.hero_title || 'Reviving the Art of the Loom.'}
          </h2>
          <p className="font-body text-lg mb-10 leading-relaxed max-w-2xl mx-auto text-[#5C4A3D]">
            {content.hero_text || 'Embrace the charm of slow fashion with our collection of hand-loomed textiles, crafted using age-old techniques.'}
          </p>
          <div className="border-4 border-[#3D312A] p-2 inline-block bg-[#F4EFE6] transform rotate-1 shadow-lg">
             <img src="https://images.unsplash.com/photo-1605808365542-bc9884a15a50?auto=format&fit=crop&w=800&q=80" alt="Weaving" className="w-full h-auto max-w-lg filter sepia-[0.3] contrast-125" />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="shop" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="font-vintage text-4xl text-center mb-16 underline decoration-[#8C4A32] underline-offset-8">Featured Garments</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {products.map((p: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-full aspect-square bg-[#EBE3D5] mb-6 p-4 border border-[#D4C3A3]">
                  <div className="w-full h-full border border-dashed border-[#8C4A32]/50 p-2">
                     <img src={p.image} alt={p.name} className="w-full h-full object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-500" />
                  </div>
                </div>
                <h4 className="font-vintage text-2xl font-bold mb-2 group-hover:text-[#8C4A32] transition-colors">{p.name}</h4>
                <p className="font-body text-sm text-[#5C4A3D] mb-4 italic">{p.description}</p>
                <div className="font-body font-bold text-lg tracking-widest">{p.price}</div>
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
      <footer id="about" className="bg-[#3D312A] text-[#F4EFE6] py-16 px-6 border-t-8 border-[#8C4A32]">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-vintage text-3xl mb-6">{siteName}</h3>
          <p className="font-body text-sm max-w-md mx-auto mb-12 opacity-80 leading-relaxed italic">
            {content.about_text || "A tribute to the artisans who weave magic with their hands."}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-10 font-body text-sm tracking-widest uppercase border-t border-[#5C4A3D] pt-10">
            <div className="flex items-center gap-2"><Phone className="text-[#8C4A32]" size={16} /> {content.contact_info?.phone || '98765 43210'}</div>
            <div className="flex items-center gap-2"><MapPin className="text-[#8C4A32]" size={16} /> {content.contact_info?.address || 'Old Market, Kerala'}</div>
            <div className="flex items-center gap-2"><Mail className="text-[#8C4A32]" size={16} /> {content.contact_info?.email || 'post@heritage.in'}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

