import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';

export default function MinimalMeatTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'CUTS.';
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewProductsPage, setViewProductsPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'CHICKEN BREAST', price: '₹280', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', description: '500G PACK' },
    { name: 'MUTTON MINCE', price: '₹450', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: '500G PACK' },
    { name: 'WHOLE CHICKEN', price: '₹220', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', description: '1KG BIRD' },
    { name: 'MUTTON CHOPS', price: '₹800', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: '500G PACK' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'EXPRESS DELIVERY', description: 'DELIVERED IN UNDER 45 MINUTES.' },
    { title: 'CUSTOM CUTS', description: 'SLICED EXACTLY HOW YOU LIKE IT.' },
    { title: 'HYGIENE GUARANTEED', description: 'PROCESSED IN A CERTIFIED CLEAN FACILITY.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans uppercase tracking-widest">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');
        .font-minimal { font-family: 'Space Grotesk', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="p-8 flex justify-between items-center fixed w-full top-0 bg-white z-50 border-b border-gray-200">
        {content.settings_json?.logo_image ? (
          <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="h-8 object-contain" />
        ) : (
          <span className="font-minimal text-2xl font-bold">{siteName}</span>
        )}
        <nav className="hidden md:flex gap-8 font-minimal text-xs font-bold">
          <a href="#menu" className="hover:text-red-600">SHOP</a>
          <a href="#about" className="hover:text-red-600">INFO</a>
        </nav>
      </header>

      <main className="pt-24">
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="pt-24 pb-20 px-8 text-center border-b border-gray-200 relative overflow-hidden">
              <h1 className="font-minimal text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 text-red-600 relative z-10 break-words px-2 leading-none md:leading-none">
                {content.hero_title || 'RAW. FRESH.'}
              </h1>
              <p className="font-minimal text-sm max-w-md mx-auto text-gray-500 mb-12 leading-loose relative z-10">
                {content.about_text || content.hero_text || 'NO NONSENSE. JUST HIGH QUALITY MEAT CUT TO PERFECTION EVERY MORNING.'}
              </p>
              {content.settings_json?.about_image && (
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                  <img loading="lazy" src={content.settings_json.about_image} alt="Background" className="w-full h-full object-cover filter grayscale" />
                </div>
              )}
              <a href="#about" className="w-16 h-16 rounded-full bg-red-600 mx-auto flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform relative z-10">
                ↓
              </a>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-20 px-8 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="flex flex-col justify-center">
                  <h2 className="font-minimal text-4xl font-bold mb-8 text-black">{content.settings_json?.about_title || content.about_title || 'ABOUT US'}</h2>
                  <p className="text-gray-500 leading-loose text-sm">
                    {content.settings_json?.about_description || content.about_description || 'WE BELIEVE IN CLEAN CUTS AND TRANSPARENT SOURCING. OUR MEAT IS ALWAYS FRESH, NEVER FROZEN, AND HYGIENICALLY PACKED.'}
                  </p>
                </div>
                {content.settings_json?.about_image && (
                  <div className="aspect-square border border-gray-200 p-2 bg-white">
                    <img loading="lazy" src={content.settings_json.about_image} alt="About" className="w-full h-full object-cover filter grayscale" />
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-20 px-8 border-b border-gray-200">
              <h2 className="font-minimal text-3xl font-bold text-center mb-16">OUR SERVICES</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 max-w-6xl mx-auto">
                {services.map((srv: any, idx: number) => {
                  const title = typeof srv === 'string' ? srv : srv.title;
                  const desc = typeof srv === 'string' ? '' : srv.description;
                  return (
                    <div key={idx} className={`p-8 ${idx !== 2 ? 'border-b md:border-b-0 md:border-r border-gray-200' : ''}`}>
                      {srv.image && <img loading="lazy" src={srv.image} alt={title} className="w-full h-40 object-cover mb-6 filter grayscale" />}
                      <h3 className="font-minimal font-bold text-red-600 mb-4">{title}</h3>
                      <p className="text-gray-500 text-xs leading-loose">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="shop" className="py-20 px-8 border-b border-gray-200">
              <h2 className="font-minimal text-3xl font-bold text-center mb-16">SHOP CATALOG</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 max-w-7xl mx-auto">
                {products.slice(0, 4).map((p: any, i: number) => (
                  <div key={i} onClick={() => setSelectedProduct(p)} className="group border-r border-b border-gray-200 p-6 flex flex-col hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="aspect-[4/3] bg-gray-100 mb-6 overflow-hidden border border-gray-200">
                      <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                    </div>
                    <h3 className="font-minimal font-bold text-sm mb-1 uppercase">{p.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 flex-1">{p.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="font-minimal font-bold text-red-600">{p.price}</span>
                      <button className="text-[10px] md:text-xs font-minimal font-bold uppercase tracking-widest text-black border border-gray-200 px-3 py-1 hover:border-black transition-colors">
                        VIEW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-16 text-center">
                <button onClick={() => setViewProductsPage(true)} className="inline-block border border-black bg-white text-black font-minimal text-sm font-bold px-8 py-4 hover:bg-black hover:text-white transition-colors uppercase tracking-widest">
                  VIEW FULL CATALOG
                </button>
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-20 px-8 border-b border-gray-200 bg-gray-50">
              <h2 className="font-minimal text-3xl font-bold text-center mb-16">GALLERY</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {gallery.map((img: any, idx: number) => {
                  const imgUrl = typeof img === 'string' ? img : img.url;
                  return (
                    <div key={idx} onClick={() => setSelectedImage(imgUrl)} className="aspect-square border border-gray-200 overflow-hidden bg-white cursor-pointer group">
                      <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                    </div>
                  );
                })}
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-20 px-8 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
                <div>
                  <h2 className="font-minimal text-4xl font-bold mb-12">CONTACT.</h2>
                  <div className="space-y-8 font-minimal text-xs">
                    {content.contact_info?.email && (
                      <div>
                        <div className="font-bold mb-2 border-b border-gray-200 pb-2 inline-block text-red-600">EMAIL</div>
                        <div className="text-gray-600">{content.contact_info.email}</div>
                      </div>
                    )}
                    {content.contact_info?.phone && (
                      <div>
                        <div className="font-bold mb-2 border-b border-gray-200 pb-2 inline-block text-red-600">PHONE</div>
                        <div className="text-gray-600">{content.contact_info.phone}</div>
                      </div>
                    )}
                    {content.contact_info?.address && (
                      <div>
                        <div className="font-bold mb-2 border-b border-gray-200 pb-2 inline-block text-red-600">LOCATION</div>
                        <div className="text-gray-600 leading-loose whitespace-pre-wrap">{content.contact_info.address}</div>
                      </div>
                    )}
                    {content.contact_info?.hours && (
                      <div>
                        <div className="font-bold mb-2 border-b border-gray-200 pb-2 inline-block text-red-600">HOURS</div>
                        <div className="text-gray-600 leading-loose whitespace-pre-wrap">{content.contact_info.hours}</div>
                      </div>
                    )}
                  </div>
                </div>
                {content.contact_info?.address && (
                  <div className="w-full aspect-square border border-gray-200 bg-gray-50 p-4">
                    <iframe 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                      className="filter grayscale"
                    ></iframe>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-20 px-8 border-b border-gray-200 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-12">
                {content.custom_blocks_json.map((block: any, idx: number) => {
                  if (block.type === 'heading') return <h2 key={idx} className="font-minimal text-3xl font-bold text-center border-b border-black pb-4 inline-block">{block.content}</h2>;
                  if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="text-gray-600 leading-loose text-sm text-center">{block.content}</p>;
                  if (block.type === 'image' && block.url) return <div key={idx} className="border border-gray-200 p-2 bg-white"><img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto filter grayscale hover:grayscale-0 transition-all" /></div>;
                  if (block.type === 'divider') return <div key={idx} className="w-full h-px bg-gray-200 my-8"></div>;
                  return null;
                })}
              </div>
            </section>
          );

          return null;
        })}
      </main>

      {/* Full Catalog Overlay */}
      

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[600] bg-white/95 backdrop-blur-sm p-4 md:p-8 animate-in fade-in flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.1)] p-5 md:p-12 border border-gray-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 md:top-8 md:right-8 p-2 text-gray-400 hover:text-black transition-colors z-10" onClick={() => setSelectedProduct(null)}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 relative z-10">
              <div className="h-48 md:h-auto md:aspect-[4/5] bg-gray-100 border border-gray-200 overflow-hidden">
                <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col justify-center mt-2 md:mt-0">
                <p className="text-[10px] md:text-xs font-minimal text-gray-400 tracking-widest mb-2 md:mb-4">PRODUCT DETAILS</p>
                <h2 className="text-2xl md:text-5xl font-minimal font-bold mb-2 md:mb-4 text-black uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                <div className="flex items-center gap-4 mb-4 md:mb-8">
                  <p className="text-lg md:text-3xl font-minimal font-bold text-red-600">{selectedProduct.price}</p>
                </div>
                <div className="w-full h-px bg-gray-200 mb-4 md:mb-8"></div>
                <p className="text-sm md:text-base text-gray-500 leading-loose mb-6 md:mb-12 uppercase">{selectedProduct.description}</p>
                
                <div className="mt-auto">
                  <button className="bg-black text-white font-minimal font-bold text-sm py-3 md:py-4 px-6 md:px-8 hover:bg-red-600 transition-colors w-full uppercase tracking-widest" onClick={() => setSelectedProduct(null)}>
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[700] bg-white/95 backdrop-blur-sm p-4 animate-in fade-in flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-gray-400 hover:text-black transition-colors z-10" onClick={() => setSelectedImage(null)}>
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full border-4 border-gray-100 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img loading="lazy" src={selectedImage} alt="Gallery view" className="w-full h-full object-contain max-h-[90vh]" />
          </div>
        </div>
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
      <footer id="info" className="p-8 pb-16 font-minimal text-xs bg-black text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-gray-800">
          <div>
            <div className="font-bold mb-4 border-b border-gray-800 pb-2 inline-block text-red-500">ABOUT</div>
            <p className="text-gray-400">{content.about_text || "CLEAN CUTS. TRANSPARENT SOURCING."}</p>
          </div>
          <div>
            <div className="font-bold mb-4 border-b border-gray-800 pb-2 inline-block text-red-500">CONTACT</div>
            <div className="text-gray-400 mb-2">{content.contact_info?.email || 'ORDER@CUTS.COM'}</div>
            <div className="text-gray-400">{content.contact_info?.phone || '98765 43210'}</div>
          </div>
          <div>
            <div className="font-bold mb-4 border-b border-gray-800 pb-2 inline-block text-red-500">LOCATION</div>
            <div className="text-gray-400">{content.contact_info?.address || 'UNIT 4, MEAT MARKET, KERALA'}</div>
          </div>
        </div>
        <div className="mt-16 text-center text-gray-600">
          © {new Date().getFullYear()} {siteName}. ALL RIGHTS RESERVED.
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
