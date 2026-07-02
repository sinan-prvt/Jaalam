import React from 'react';
import { Type, Stamp, PenTool, MapPin, Mail, Phone } from 'lucide-react';

export default function VintageStationeryTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'The Old Typewriter';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Antique Brass Compass', price: '₹1450', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Working brass compass in a leather pouch.' },
    { name: 'Sepia Ink Bottle', price: '₹350', image: 'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80', description: 'Authentic sepia toned ink for dip pens.' },
    { name: 'Handmade Paper Stack', price: '₹550', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: '100 sheets of deckle-edged cotton paper.' },
    { name: 'Vintage Map Journal', price: '₹800', image: 'https://images.unsplash.com/photo-1590740924976-13a8fc6470aa?auto=format&fit=crop&w=600&q=80', description: 'Journal covered in a replica of an 18th-century map.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#EFE9E1] text-[#3E362E] font-serif relative border-x-8 border-y-8 border-[#8B7355]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cutive+Mono&family=IM+Fell+English:ital@0;1&display=swap');
        .font-typewriter { font-family: 'Cutive Mono', monospace; }
        .font-vintage { font-family: 'IM Fell English', serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-wall.png')] z-50"></div>

      {/* Header */}
      <header className="border-b-4 border-double border-[#8B7355] py-8 mx-6">
        <div className="container mx-auto text-center">
          <div className="inline-block border-2 border-[#8B7355] p-2 mb-4">
             <Type size={32} className="text-[#5C4A3D]" />
          </div>
          <h1 className="font-vintage text-5xl md:text-6xl text-[#3E362E] tracking-wider uppercase mb-2">{siteName}</h1>
          <p className="font-typewriter text-xs tracking-[0.3em] text-[#8B7355]">EST. 1920 • FINE STATIONERY & SUPPLIES</p>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
           <img src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80" alt="Vintage Desk" className="w-full h-auto rounded-none border border-[#8B7355] p-2 bg-white shadow-xl rotate-1" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="font-vintage text-4xl mb-6 italic text-[#5C4A3D]">
            {content.hero_title || 'Relive the Golden Age of Correspondence'}
          </h2>
          <p className="font-typewriter text-sm leading-relaxed mb-8 text-[#5C4A3D] border-l-2 border-[#8B7355] pl-4">
            {content.hero_text || content.about_text || 'We source the finest antiquarian writing instruments, handcrafted papers, and authentic inks to bring the past back to life upon your desk.'}
          </p>
          <a href="#catalogue" className="inline-block border border-[#8B7355] text-[#3E362E] px-6 py-3 font-typewriter uppercase text-sm hover:bg-[#8B7355] hover:text-white transition-colors">
            [ View Catalogue ]
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <section id="catalogue" className="py-20 px-6 max-w-5xl mx-auto border-t border-dashed border-[#8B7355]">
        <h3 className="font-vintage text-3xl text-center mb-12 uppercase tracking-widest text-[#5C4A3D]">Goods & Wares</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {products.map((p: any, i: number) => (
            <div key={i} className="flex gap-4 p-4 border border-[#8B7355] bg-[#F7F4F0] relative group">
              <div className="absolute top-2 right-2 opacity-20"><Stamp size={48} /></div>
              <div className="w-32 h-32 shrink-0 border border-[#8B7355] p-1 bg-white">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover filter sepia contrast-125" />
              </div>
              <div className="flex flex-col justify-center z-10">
                <h4 className="font-vintage text-xl font-bold mb-1 text-[#3E362E]">{p.name}</h4>
                <p className="font-typewriter text-xs text-[#5C4A3D] mb-3 leading-tight">{p.description}</p>
                <div className="font-vintage italic text-lg text-[#8B7355]">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto border-t border-dashed border-[#8B7355]">
        <div className="text-center">
          <h3 className="font-vintage text-4xl mb-6 uppercase tracking-widest text-[#5C4A3D]">Our History</h3>
          <p className="font-typewriter text-sm leading-relaxed max-w-2xl mx-auto text-[#5C4A3D]">
            {content.about_text || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. Our curated collections are designed to inspire.'}
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6 max-w-5xl mx-auto border-t border-dashed border-[#8B7355]">
        <h3 className="font-vintage text-4xl text-center mb-12 uppercase tracking-widest text-[#5C4A3D]">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-[#8B7355] bg-[#F7F4F0] hover:bg-[#8B7355] hover:text-[#EFE9E1] transition-all cursor-pointer group text-center">
            <h4 className="font-vintage text-2xl font-bold mb-4 group-hover:text-white">Custom Monograms</h4>
            <p className="font-typewriter text-xs leading-relaxed group-hover:text-[#EFE9E1] text-[#5C4A3D]">Personalized stationery tailored to your exact specifications.</p>
          </div>
          <div className="p-8 border border-[#8B7355] bg-[#F7F4F0] hover:bg-[#8B7355] hover:text-[#EFE9E1] transition-all cursor-pointer group text-center">
            <h4 className="font-vintage text-2xl font-bold mb-4 group-hover:text-white">Archival Sourcing</h4>
            <p className="font-typewriter text-xs leading-relaxed group-hover:text-[#EFE9E1] text-[#5C4A3D]">Rare and vintage supplies procured upon request.</p>
          </div>
          <div className="p-8 border border-[#8B7355] bg-[#F7F4F0] hover:bg-[#8B7355] hover:text-[#EFE9E1] transition-all cursor-pointer group text-center">
            <h4 className="font-vintage text-2xl font-bold mb-4 group-hover:text-white">Wax Sealing</h4>
            <p className="font-typewriter text-xs leading-relaxed group-hover:text-[#EFE9E1] text-[#5C4A3D]">Beautiful, elegant wrapping for those special occasions.</p>
          </div>
        </div>
      </section>

      {/* Menus */}
      <section id="menus" className="py-20 px-6 max-w-5xl mx-auto border-t border-dashed border-[#8B7355] text-center">
        <h3 className="font-vintage text-4xl mb-12 uppercase tracking-widest text-[#5C4A3D]">Index of Wares</h3>
        <div className="flex flex-wrap justify-center gap-4">
           {['Fountain Pens', 'Parchment', 'Inkwells', 'Wax Seals', 'Ledgers', 'Calligraphy'].map((item, idx) => (
              <div key={idx} className="px-6 py-2 border border-[#8B7355] hover:bg-[#8B7355] hover:text-[#EFE9E1] transition-colors cursor-pointer font-typewriter uppercase text-xs">
                [{item}]
              </div>
           ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 px-6 max-w-5xl mx-auto border-t border-dashed border-[#8B7355]">
        <h3 className="font-vintage text-4xl text-center mb-12 uppercase tracking-widest text-[#5C4A3D]">Exhibition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=400&q=80',
             'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
             'https://images.unsplash.com/photo-1590740924976-13a8fc6470aa?auto=format&fit=crop&w=400&q=80',
             'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=400&q=80'
           ].map((img, idx) => (
              <div key={idx} className="aspect-square border-4 border-[#F7F4F0] shadow-md bg-white p-2 transform transition-transform hover:scale-105 hover:-rotate-1">
                <img src={img} alt="Gallery image" className="w-full h-full object-cover filter sepia contrast-125" />
              </div>
           ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact-info" className="py-20 px-6 max-w-5xl mx-auto border-t border-dashed border-[#8B7355]">
        <h3 className="font-vintage text-4xl text-center mb-12 uppercase tracking-widest text-[#5C4A3D]">Post & Telegraph</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#F7F4F0] p-8 border border-[#8B7355]">
          <div className="space-y-6 font-typewriter text-sm text-[#5C4A3D]">
            <div className="border-b border-[#8B7355] border-dashed pb-4">
              <span className="font-bold">TELEPHONE:</span> {content.contact_info?.phone || '+91 98765 43210'}
            </div>
            <div className="border-b border-[#8B7355] border-dashed pb-4">
              <span className="font-bold">TELEGRAM:</span> {content.contact_info?.email || 'hello@stationery.com'}
            </div>
            <div className="border-b border-[#8B7355] border-dashed pb-4">
              <span className="font-bold">ADDRESS:</span> {content.contact_info?.address || '123 Paper Street, Design District'}
            </div>
            
            <div className="pt-4">
              <span className="font-bold block mb-4">SOCIAL CORRESPONDENCE:</span>
              <div className="flex gap-6 text-xl">
                <a href="#" className="hover:text-[#3E362E] transition-colors">FB</a>
                <a href="#" className="hover:text-[#3E362E] transition-colors">IG</a>
                <a href="#" className="hover:text-[#3E362E] transition-colors">TW</a>
              </div>
            </div>
          </div>
          <div className="h-80 border-2 border-[#8B7355] p-2 bg-white relative shadow-inner">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531550415!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1605677273934!5m2!1sen!2sau" 
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] border-0 filter sepia opacity-80" 
              allowFullScreen={false} 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Custom Section */}
      <section id="custom" className="py-24 px-6 max-w-3xl mx-auto border-t border-dashed border-[#8B7355] text-center">
        <h3 className="font-vintage text-4xl mb-8 uppercase tracking-widest text-[#5C4A3D]">Our Pledge</h3>
        <p className="font-typewriter text-sm leading-relaxed mb-10 text-[#5C4A3D]">
          We believe that the right tools can inspire your best work. That's why we carefully source every item in our collection for unparalleled quality, thoughtful design, and sustainability.
        </p>
        <button className="inline-block border border-[#8B7355] text-[#3E362E] px-8 py-3 font-typewriter uppercase text-sm hover:bg-[#8B7355] hover:text-[#EFE9E1] transition-colors">
          [ Read More ]
        </button>
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
      <footer className="bg-[#3E362E] text-[#EFE9E1] py-16 px-6 mt-12 border-t-8 border-[#2A231F]">
        <div className="max-w-4xl mx-auto text-center font-typewriter text-xs leading-loose">
          <PenTool size={24} className="mx-auto mb-6 text-[#8B7355]" />
          <p className="mb-8 max-w-lg mx-auto">{content.about_text || "Purveyors of fine antiquarian writing instruments and ephemera."}</p>
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
            <span>TELEGRAPH: {content.contact_info?.phone || '00-192-837'}</span>
            <span>POST: {content.contact_info?.address || '14 Heritage Lane, Kerala'}</span>
          </div>
          <p className="opacity-50">© {new Date().getFullYear()} {siteName}</p>
        </div>
      </footer>
    </div>
  );
}

