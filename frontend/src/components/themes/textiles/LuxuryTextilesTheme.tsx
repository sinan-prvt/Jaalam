import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Diamond, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function LuxuryTextilesTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
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
            {!content?.settings_json?.logo_image && <Diamond className="text-[#D4AF37]" size={20} />}
            <span className="font-luxury text-2xl tracking-[0.2em] uppercase">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-body text-[10px] tracking-widest uppercase text-gray-400">
            <a href="#collections" className="hover:text-[#D4AF37] transition-colors">Collections</a>
            <a href="#atelier" className="hover:text-[#D4AF37] transition-colors">The Atelier</a>
            <button className="text-[#D4AF37] border-b border-[#D4AF37] pb-1" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Book Appointment
            </button>
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
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
                <div className="aspect-[2/3] overflow-hidden mb-8 relative border border-[#1A1A1A]">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 group-hover:scale-105 transition-all duration-1000" />
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
          <div className="mt-10 mb-4 text-center w-full flex justify-center col-span-full">
            <button 
              onClick={() => setShowAllProducts(true)} 
              className="px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-bold tracking-wide shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              View All Products
            </button>
          </div>

        </div>
      </section>

      
      
      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-2xl mx-auto text-black">
              {content.about_text || 'Welcome to our store! We are dedicated to bringing you the best quality products and services. Our team works hard to ensure customer satisfaction and continuous improvement.'}
            </p>
          </div>
        </section>
      )}

      {/* Injected Services Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-16 px-6 bg-black/5 border-b border-black/5">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services_json?.length ? content.services_json : [
                { title: 'Quality Assurance', description: 'We guarantee the highest quality in all our offerings.' },
                { title: 'Fast Delivery', description: 'Quick and reliable delivery to your doorstep.' },
                { title: 'Customer Support', description: '24/7 dedicated support for all your needs.' }
              ]).map((srv: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto bg-black/5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-black">{srv.title}</h3>
                  <p className="opacity-75 text-black">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length ? content.gallery_json : [
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/5">
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-black/5">
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Contact Us</h2>
            <p className="opacity-80 mb-8 max-w-lg mx-auto text-black">Get in touch with us for any inquiries or support.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">📞</span>
                <span className="font-bold text-black">{content.contact_info?.phone || '1800 123 4567'}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">✉️</span>
                <span className="font-bold break-all text-black">{content.contact_info?.email || 'hello@example.com'}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">📍</span>
                <span className="font-bold text-black">{content.contact_info?.address || '123 Market Street'}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
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
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

