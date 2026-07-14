import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Crown, Star, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function LuxuryFancyTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'L\'OR';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Diamond Tennis Bracelet', price: '₹45,000', image: 'https://images.unsplash.com/photo-1599643478514-4a4208bd50d6?auto=format&fit=crop&w=600&q=80', description: 'Cubic zirconia tennis bracelet.' },
    { name: 'Signature Fragrance', price: '₹8,500', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', description: 'Exclusive midnight orchid scent.' },
    { name: 'Emerald Cut Ring', price: '₹12,500', image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=600&q=80', description: 'Simulated emerald in a platinum-plated setting.' },
    { name: 'Silk Scarves Collection', price: '₹3,200', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: '100% Mulberry silk printed scarves.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#050505] text-[#E5C158] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@200;300;400&display=swap');
        .font-luxury { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#E5C158]/20 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex flex-col items-center gap-1">
            {!content?.settings_json?.logo_image && <Crown size={20} className="text-[#E5C158]" />}
            <span className="font-luxury text-xl tracking-[0.3em] uppercase">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          <nav className="hidden md:flex gap-12 font-body text-[10px] tracking-[0.3em] uppercase text-gray-400">
            <a href="#exclusive" className="hover:text-[#E5C158] transition-colors">Exclusive</a>
            <a href="#about" className="hover:text-[#E5C158] transition-colors">Maison</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a48fb3c274d?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="font-body text-xs tracking-[0.4em] text-gray-400 mb-6 uppercase">The Art of Adornment</p>
          <h1 className="font-luxury text-6xl md:text-8xl font-bold mb-8 text-white drop-shadow-2xl">
            {content.hero_title || 'Pure Opulence.'}
          </h1>
          <a href="#exclusive" className="inline-flex items-center gap-4 border border-[#E5C158] text-[#E5C158] hover:bg-[#E5C158] hover:text-black px-12 py-5 font-body uppercase tracking-[0.2em] text-[10px] transition-all duration-500">
            View Collection <ChevronRight size={14} />
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="exclusive" className="py-32 px-6 bg-[#050505]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-20">
             <Star size={16} className="text-[#E5C158] mb-4" />
             <h2 className="font-luxury text-4xl text-white tracking-widest text-center">Masterpieces</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
                <div className="relative aspect-square overflow-hidden mb-8 border border-[#E5C158]/20 bg-[#0A0A0A] flex items-center justify-center p-8">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <img loading="lazy" src={p.image} alt={p.name} className="relative z-10 max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className="text-center">
                  <h3 className="font-luxury text-2xl text-white mb-3 tracking-wide">{p.name}</h3>
                  <div className="w-8 h-px bg-[#E5C158]/50 mx-auto mb-3"></div>
                  <div className="font-body text-xs tracking-widest text-[#E5C158]">{p.price}</div>
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
      <footer id="about" className="py-24 px-6 bg-[#0A0A0A] border-t border-[#E5C158]/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-luxury text-3xl text-white mb-8 tracking-widest uppercase">{siteName}</h3>
          <p className="font-body text-xs text-gray-400 tracking-widest leading-loose max-w-lg mx-auto mb-16">
            {content.about_text || "Curating the finest luxury accessories, fragrances, and statement jewelry pieces."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-body text-[10px] tracking-widest text-gray-500">
            <div className="flex flex-col items-center gap-3 hover:text-[#E5C158] transition-colors cursor-pointer">
              <Phone size={16} />
              <span>{content.contact_info?.phone || 'VIP: +91 98765 43210'}</span>
            </div>
            <div className="flex flex-col items-center gap-3 hover:text-[#E5C158] transition-colors cursor-pointer">
              <Mail size={16} />
              <span>{content.contact_info?.email || 'concierge@lor.in'}</span>
            </div>
            <div className="flex flex-col items-center gap-3 hover:text-[#E5C158] transition-colors cursor-pointer">
              <MapPin size={16} />
              <span className="text-center">{content.contact_info?.address || 'The Luxury Mall, Kerala'}</span>
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

