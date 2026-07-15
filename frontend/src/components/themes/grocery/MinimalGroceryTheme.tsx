import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Menu, X } from 'lucide-react';

export default function MinimalGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'essential.';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Oat Milk', price: '₹250', size: '1L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coffee Beans', price: '₹450', size: '250g', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sea Salt', price: '₹120', size: '500g', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Olive Oil', price: '₹850', size: '500ml', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;import ProductBuyButton from '../../payments/ProductBuyButton';
500;700&display=swap');
        .font-min { font-family: 'DM Sans', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Navigation */}
      <nav className="p-4 md:p-12 flex flex-col md:flex-row justify-between items-center fixed w-full top-0 bg-white/90 backdrop-blur z-50 gap-4 md:gap-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-8 w-auto object-contain grayscale shrink-0" />
            ) : (
              <div className="w-6 h-6 md:w-8 md:h-8 bg-black flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[10px] md:text-xs">M</span>
              </div>
            )}
            <span className="text-lg md:text-2xl font-bold tracking-tighter uppercase truncate block">{siteName}</span>
          </div>
          <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        <div className="hidden md:flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium whitespace-nowrap">
          <a href="#shop" className="hover:opacity-50 transition-opacity">shop</a>
          <a href="#about" className="hover:opacity-50 transition-opacity">about</a>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden w-full mt-4 pt-4 border-t border-black/10 flex flex-col gap-4 text-sm font-medium">
            <a href="#shop" onClick={() => setIsMenuOpen(false)} className="hover:opacity-50 py-2 transition-opacity">shop</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:opacity-50 py-2 transition-opacity">about</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 max-w-5xl mx-auto">
        <h1 className="font-min text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight break-words hyphens-auto">
          {content.hero_title || 'just the good stuff.'}
        </h1>
        <p className="font-min text-xl text-gray-500 max-w-xl leading-relaxed mb-12">
          {content.hero_text || 'curated daily essentials. no clutter, no overwhelming choices. just quality products.'}
        </p>
      </section>

      {/* Products */}
      <section id="shop" className="px-8 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((p: any, i: number) => (
            <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer flex flex-col">
              <div className="aspect-[4/5] bg-gray-50 mb-6 overflow-hidden">
                <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-min font-medium text-lg">{p.name}</h3>
                 <span className="font-min font-bold">{p.price}</span>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
              </div>
              <div className="text-gray-400 text-sm mb-4">{p.size}</div>
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
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/5 relative group cursor-pointer" onClick={() => setSelectedGalleryImage(img)}>
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-bold tracking-widest uppercase text-sm border border-white px-4 py-2 rounded-full">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-black/5">
          <div className="container mx-auto max-w-5xl bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Contact Us</h2>
            <p className="opacity-80 mb-8 max-w-lg mx-auto text-black">Get in touch with us for any inquiries or support.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12">
              <div className="flex flex-col items-center p-6 bg-black/5 rounded-xl">
                <span className="text-3xl mb-3">📞</span>
                <span className="font-bold text-black">{content.contact_info?.phone || '1800 123 4567'}</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-black/5 rounded-xl">
                <span className="text-3xl mb-3">✉️</span>
                <span className="font-bold break-all text-black">{content.contact_info?.email || 'hello@example.com'}</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-black/5 rounded-xl">
                <span className="text-3xl mb-3">📍</span>
                <span className="font-bold text-black">{content.contact_info?.address || '123 Market Street'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-8">
                <div className="bg-black/5 p-6 rounded-xl">
                  <h3 className="font-bold text-xl mb-4 text-black flex items-center gap-2"><span>🕒</span> Working Hours</h3>
                  <ul className="space-y-3 opacity-80 text-black font-medium">
                    {content.contact_info?.hours ? (
                      <li className="whitespace-pre-wrap">{content.contact_info.hours}</li>
                    ) : (
                      <>
                        <li className="flex justify-between border-b border-black/10 pb-2"><span>Monday - Friday</span> <span>9:00 AM - 8:00 PM</span></li>
                        <li className="flex justify-between border-b border-black/10 pb-2"><span>Saturday</span> <span>10:00 AM - 6:00 PM</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-red-500 font-bold">Closed</span></li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="bg-black/5 p-6 rounded-xl">
                  <h3 className="font-bold text-xl mb-4 text-black flex items-center gap-2"><span>🌐</span> Connect With Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="p-3 bg-white rounded-full hover:bg-gray-100 hover:scale-110 transition-all shadow-sm text-blue-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="p-3 bg-white rounded-full hover:bg-gray-100 hover:scale-110 transition-all shadow-sm text-pink-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="p-3 bg-white rounded-full hover:bg-gray-100 hover:scale-110 transition-all shadow-sm text-blue-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-black/5 p-3 rounded-xl h-full min-h-[350px]">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '123 Market Street')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: '0.5rem' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                  className="min-h-[350px]"
                ></iframe>
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
      <footer id="about" className="bg-gray-50 py-24 px-8 md:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 font-min">
          <div>
            <span className="font-bold text-xl block mb-6">{siteName}</span>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              {content.about_text || "rethinking the supermarket experience through thoughtful curation and minimal design."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
               <div className="font-medium mb-4">contact</div>
               <div className="text-gray-500 space-y-2">
                 <div>{content.contact_info?.email || 'hello@essential.com'}</div>
                 <div>{content.contact_info?.phone || '98765 43210'}</div>
               </div>
            </div>
            <div>
               <div className="font-medium mb-4">visit</div>
               <div className="text-gray-500">
                 {content.contact_info?.address || 'studio 4, quiet lane, kerala'}
               </div>
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
      
      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 rounded-full p-2 z-10"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

