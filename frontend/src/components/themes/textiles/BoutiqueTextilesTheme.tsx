import React from 'react';
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react';

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function BoutiqueTextilesTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Kanjivaram Silks';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Bridal Kanjivaram Silk', price: '₹45,000', image: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=600&q=80', description: 'Pure silk with pure zari work.' },
    { name: 'Banarasi Brocade', price: '₹18,500', image: 'https://images.unsplash.com/photo-1583391733958-d15fa693d221?auto=format&fit=crop&w=600&q=80', description: 'Traditional weaving technique.' },
    { name: 'Soft Silk Saree', price: '₹8,500', image: 'https://images.unsplash.com/photo-1615886753866-79396abc446e?auto=format&fit=crop&w=600&q=80', description: 'Lightweight and elegant.' },
    { name: 'Handloom Cotton', price: '₹2,400', image: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&w=600&q=80', description: 'Comfortable daily wear.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FAFAF8] text-[#4A3B32] font-serif border-x-[16px] border-x-[#8C3A3A] box-border">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400&display=swap');
        .font-elegant { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
        .bg-pattern {
          background-color: #FAFAF8;
          background-image: radial-gradient(#D9C5B2 1px, transparent 1px);
          background-size: 20px 20px;
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="py-8 px-6 border-b border-[#D9C5B2] bg-white relative z-10">
        <div className="container mx-auto text-center">
          <Sparkles className="mx-auto text-[#D4AF37] mb-4" size={24} />
          <h1 className="font-elegant text-5xl md:text-6xl text-[#8C3A3A] tracking-wider mb-6">
            {siteName}
          </h1>
          <nav className="flex justify-center gap-10 font-body text-[10px] tracking-[0.3em] uppercase text-[#6B5A4E]">
            <a href="#collection" className="hover:text-[#8C3A3A] transition-colors">Collections</a>
            <a href="#heritage" className="hover:text-[#8C3A3A] transition-colors">Our Heritage</a>
            <a href="#visit" className="hover:text-[#8C3A3A] transition-colors">Visit Boutique</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-pattern relative">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
             <div className="absolute inset-0 bg-[#8C3A3A] translate-x-4 translate-y-4"></div>
             <img src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=800&q=80" alt="Silk Saree" className="relative z-10 w-full h-auto object-cover shadow-xl border-4 border-white" />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="font-elegant text-4xl md:text-5xl font-bold mb-6 text-[#4A3B32] leading-tight">
              {content.hero_title || 'Six Yards of Pure Elegance.'}
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto md:mx-0 mb-8"></div>
            <p className="font-elegant text-xl italic text-[#6B5A4E] mb-10 leading-relaxed">
              {content.hero_text || 'Exquisite handwoven silk sarees directly from the master weavers of Kanchipuram and Banaras.'}
            </p>
            <button className="bg-[#8C3A3A] hover:bg-[#7A3333] text-white font-body text-xs tracking-[0.2em] uppercase py-4 px-10 transition-colors">
              Explore Silks
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="collection" className="py-24 px-6 bg-white border-y border-[#D9C5B2]">
        <div className="container mx-auto max-w-6xl">
          <h3 className="font-elegant text-4xl text-center text-[#8C3A3A] mb-16 tracking-widest uppercase">Bridal Trousseau</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {products.map((p: any, i: number) => (
              <div key={i} className="flex gap-6 group cursor-pointer">
                <div className="w-1/2 aspect-[3/4] relative overflow-hidden bg-[#FAFAF8]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 border-2 border-[#D4AF37]/30 m-4 pointer-events-none"></div>
                </div>
                <div className="w-1/2 flex flex-col justify-center py-6 pr-6">
                  <h4 className="font-elegant text-2xl text-[#4A3B32] mb-3 leading-snug">{p.name}</h4>
                  <p className="font-body text-xs text-[#6B5A4E] leading-loose mb-6">{p.description}</p>
                  <div className="font-body text-[#8C3A3A] tracking-widest">{p.price}</div>
                  <button className="mt-8 border-b border-[#D4AF37] text-[#D4AF37] self-start font-body text-[10px] tracking-[0.2em] uppercase pb-1 group-hover:text-[#8C3A3A] group-hover:border-[#8C3A3A] transition-colors">
                    Inquire Now
                  </button>
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
      <footer id="visit" className="bg-[#4A3B32] text-[#FAFAF8] py-20 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h3 className="font-elegant text-4xl text-[#D4AF37] mb-8">{siteName}</h3>
          <p className="font-body text-xs tracking-widest leading-loose max-w-xl mx-auto mb-16 opacity-80">
            {content.about_text || "Preserving the rich weaving heritage of India. Every piece in our boutique is carefully selected to offer you the finest quality textiles."}
          </p>
          
          <div className="flex justify-center gap-6 mb-12">
             <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#4A3B32] transition-colors cursor-pointer"><Instagram size={18} /></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 font-body text-[10px] tracking-[0.2em] uppercase border-t border-[#6B5A4E] pt-12">
             <div className="flex flex-col items-center gap-3">
               <Phone className="text-[#D4AF37]" size={16} />
               <span>{content.contact_info?.phone || '98765 43210'}</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <MapPin className="text-[#D4AF37]" size={16} />
               <span>{content.contact_info?.address || 'Silk Street, Kerala'}</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Mail className="text-[#D4AF37]" size={16} />
               <span>{content.contact_info?.email || 'boutique@silks.com'}</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

