import React, { useState, useEffect } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ArrowRight, X, Menu } from 'lucide-react';

export default function MinimalFancyTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showAllProducts]);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'AURA';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Matte Liquid Lipstick', price: '₹650', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', description: 'Long lasting formula.' },
    { name: 'Minimal Gold Hoops', price: '₹350', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Everyday essential.' },
    { name: 'Eau De Parfum', price: '₹1250', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80', description: 'Floral and woody notes.' },
    { name: 'Leather Crossbody Bag', price: '₹999', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: 'Compact and versatile.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Personal Styling', description: 'Curated looks just for you.' },
    { title: 'Worldwide Shipping', description: 'Beauty delivered anywhere.' },
    { title: 'Authentic Quality', description: '100% genuine products.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .font-minimal { font-family: 'DM Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="p-8 fixed w-full top-0 bg-white/95 backdrop-blur z-50 transition-all border-b border-transparent data-[scrolled=true]:border-black">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            {content.settings_json?.logo_image && (
              <img src={content.settings_json.logo_image} alt="Logo" className="h-8 object-contain" />
            )}
            <span className="font-minimal text-xl font-bold tracking-tighter">{siteName}.</span>
          </div>

          <nav className="hidden md:flex gap-8 font-minimal text-sm font-medium uppercase">
            {sectionOrder.map((section: string) => {
               if (hiddenSections.includes(section)) return null;
               const sectionNames: any = { hero: 'Home', about: 'Info', services: 'Services', menu: 'Shop', gallery: 'Gallery', contact: 'Contact', custom: 'More' };
               return <a key={section} href={`#${section}`} onClick={() => setShowAllProducts(false)} className="hover:opacity-50 transition-opacity">{sectionNames[section]}</a>;
            })}
          </nav>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-8 flex flex-col gap-6 font-minimal text-lg font-medium uppercase text-center border-t border-black pt-8">
            {sectionOrder.map((section: string) => {
               if (hiddenSections.includes(section)) return null;
               const sectionNames: any = { hero: 'Home', about: 'Info', services: 'Services', menu: 'Shop', gallery: 'Gallery', contact: 'Contact', custom: 'More' };
               return (
                 <a 
                   key={section} 
                   href={`#${section}`} 
                   onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} 
                   className="hover:opacity-50 transition-opacity"
                 >
                   {sectionNames[section]}
                 </a>
               );
            })}
          </nav>
        )}
      </header>

      <main>
        {!showAllProducts ? (
          <>
            {sectionOrder.map((sectionId: string) => {
              if (hiddenSections.includes(sectionId)) return null;

              if (sectionId === 'hero') return (
                <section key="hero" id="hero" className="pt-40 pb-20 px-8">
                  <h1 className="font-minimal text-5xl md:text-8xl font-bold tracking-tighter max-w-4xl leading-none mb-12">
                    {content.hero_title || 'Elevating the everyday.'}
                  </h1>
                  <p className="font-minimal text-lg max-w-xl text-gray-500 mb-12 whitespace-pre-line">
                    {content.about_text || content.hero_text || 'Carefully selected accessories and beauty essentials for the modern minimalist.'}
                  </p>
                  <a href="#menu" className="inline-flex items-center gap-2 font-minimal font-bold border-b-2 border-black pb-1 hover:pr-4 transition-all">
                    Explore the curation <ArrowRight size={18} />
                  </a>
                </section>
              );

              if (sectionId === 'about') return (
                <section key="about" id="about" className="py-20 px-8 border-t border-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div>
                      <h2 className="font-minimal text-4xl font-bold tracking-tighter mb-8">{content.settings_json?.about_title || content.about_title || 'Our Philosophy'}</h2>
                      <p className="text-gray-500 max-w-md whitespace-pre-line leading-relaxed text-lg">
                        {content.settings_json?.about_description || content.about_description || 'Simplicity is the ultimate sophistication. We believe in providing products that are both beautiful and functional.'}
                      </p>
                    </div>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img src={content.about_image || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"} alt="About" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'services') return (
                <section key="services" id="services" className="py-20 px-8 border-t border-black">
                  <h2 className="font-minimal text-4xl font-bold tracking-tighter mb-16">Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((srv: any, idx: number) => {
                      const title = typeof srv === 'string' ? srv : srv.title;
                      const description = typeof srv === 'string' ? '' : srv.description;
                      const image = typeof srv !== 'string' ? srv.image : null;
                      return (
                        <div key={idx} className="group">
                          {image && <div className="aspect-[4/3] bg-gray-100 mb-6 overflow-hidden"><img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" /></div>}
                          <h3 className="font-minimal font-bold text-xl mb-2">{title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

              if (sectionId === 'menu' || sectionId === 'products') return (
                <section key="menu" id="menu" className="py-20 px-8 border-t border-black">
                  <div className="flex justify-between items-end mb-16">
                    <h2 className="font-minimal text-4xl font-bold tracking-tighter">Shop</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.slice(0, 4).map((p: any, i: number) => (
                      <div key={i} className="group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                        <div className="aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                        </div>
                        <div className="flex justify-between items-start font-minimal">
                          <div>
                            <h3 className="font-bold text-base mb-1">{p.name}</h3>
                            <p className="text-sm text-gray-500">{p.description}</p>
                          </div>
                          <span className="font-medium">{p.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {products.length > 4 && (
                    <div className="mt-20 text-center">
                      <button
                        onClick={() => {
                          setShowAllProducts(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="font-minimal font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-all uppercase tracking-widest text-sm"
                      >
                        View All Products
                      </button>
                    </div>
                  )}
                </section>
              );

              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="py-20 px-8 border-t border-black">
                  <h2 className="font-minimal text-4xl font-bold tracking-tighter mb-16">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((img: any, idx: number) => {
                      const imgUrl = typeof img === 'string' ? img : img.url;
                      return (
                        <div key={idx} className="aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setSelectedGalleryImage(imgUrl)}>
                          <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out" />
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="py-20 px-8 border-t border-black">
                  {content.custom_blocks_json.map((block: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 last:mb-0">
                      <div>
                        <h2 className="font-minimal text-4xl font-bold tracking-tighter mb-8">{block.title}</h2>
                        <p className="text-gray-500 max-w-md whitespace-pre-line leading-relaxed text-lg">{block.content}</p>
                      </div>
                      {block.image && (
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                          <img src={block.image} alt={block.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              );

              if (sectionId === 'contact') return (
                <section key="contact" id="contact" className="py-20 px-8 border-t border-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h2 className="font-minimal text-4xl font-bold tracking-tighter mb-8">Get in Touch</h2>
                      <div className="space-y-4 text-lg">
                        {content.contact_info?.email && <p><span className="font-bold mr-4">E.</span> {content.contact_info.email}</p>}
                        {content.contact_info?.phone && <p><span className="font-bold mr-4">P.</span> {content.contact_info.phone}</p>}
                        {content.contact_info?.hours && <p><span className="font-bold mr-4">H.</span> {content.contact_info.hours}</p>}
                      </div>
                      <div className="mt-8 flex gap-6">
                        {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-50 border-b border-black font-bold text-sm uppercase tracking-widest pb-1">Facebook</a>}
                        {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-50 border-b border-black font-bold text-sm uppercase tracking-widest pb-1">Instagram</a>}
                        {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-50 border-b border-black font-bold text-sm uppercase tracking-widest pb-1">Twitter</a>}
                      </div>
                    </div>
                    <div>
                      <h2 className="font-minimal text-4xl font-bold tracking-tighter mb-8">Location</h2>
                      <p className="text-gray-500 max-w-sm whitespace-pre-line text-lg mb-8">{content.contact_info?.address || 'Sector 9, Minimalist Road, Kerala'}</p>
                      {content.contact_info?.address && (
                        <div className="w-full h-64 bg-gray-100 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden">
                          <iframe 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={false} 
                            loading="lazy"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );

              return null;
            })}
          </>
        ) : (
          <section className="pt-40 pb-20 px-8 min-h-screen">
            <div className="flex justify-between items-center mb-20 border-b border-black pb-8">
              <h2 className="font-minimal text-5xl md:text-6xl font-bold tracking-tighter">All Collection</h2>
              <button
                onClick={() => {
                  setShowAllProducts(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-minimal font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-all text-sm tracking-widest uppercase"
              >
                Back to Home
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((p: any, i: number) => (
                <div key={i} className="group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  </div>
                  <div className="flex justify-between items-start font-minimal">
                    <div>
                      <h3 className="font-bold text-base mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.description}</p>
                    </div>
                    <span className="font-medium">{p.price}</span>
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

          </section>
        )}
      </main>

      {/* Static Footer */}
      
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

      <footer className="p-8 pb-12 font-minimal border-t border-black pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="text-xl font-bold tracking-tighter mb-4 block">{siteName}.</span>
            <p className="text-gray-500 max-w-sm whitespace-pre-line">{content.settings_json?.about_description || "Simplicity is the ultimate sophistication."}</p>
          </div>
          <div className="md:text-right text-gray-500 text-sm flex flex-col justify-end">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-white/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 md:-right-12 bg-gray-100 p-2 rounded-full text-black hover:bg-black hover:text-white transition-colors z-10"
              onClick={() => setSelectedGalleryImage(null)}
            >
              <X size={24} />
            </button>
            <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[85vh] object-contain shadow-2xl" />
          </div>
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
