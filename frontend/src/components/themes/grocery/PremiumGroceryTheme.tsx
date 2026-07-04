import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Wine, Search, MapPin, Mail, Phone, ChevronRight, Menu, X } from 'lucide-react';

export default function PremiumGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Luxe Gourmet';

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Truffle Infused Olive Oil', price: '₹2,400', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', origin: 'Italy' },
    { name: 'Artisanal Sourdough', price: '₹350', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', origin: 'House Bakery' },
    { name: 'Aged Balsamic Vinegar', price: '₹1,800', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', origin: 'Modena' },
    { name: 'Organic Heirloom Tomatoes', price: '₹450/kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', origin: 'Local Farm' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#111111] text-[#E0D8C8] font-sans selection:bg-[#C9A66B] selection:text-[#111111]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400&display=swap');
        .font-premium { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Lato', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#C9A66B]/30 bg-[#0A0A0A]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-10 w-auto object-contain shrink-0" />
            ) : (
              <Wine className="text-[#C9A66B] shrink-0 h-6 w-6 md:h-7 md:w-7" />
            )}
            <span className="font-premium text-xl md:text-3xl tracking-wider md:tracking-widest text-[#C9A66B] uppercase truncate block">{siteName}</span>
          </div>
          <button className="md:hidden text-[#C9A66B]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#curated" className="hover:text-[#C9A66B] transition-colors">Curated Selection</a>
            <a href="#visit" className="hover:text-[#C9A66B] transition-colors">Boutique</a>
          </nav>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A] border-t border-[#C9A66B]/30 px-6 py-4 flex flex-col gap-4 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#curated" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A66B] py-2 transition-colors">Curated Selection</a>
            <a href="#visit" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A66B] py-2 transition-colors">Boutique</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606103920295-9a091573f160?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <p className="font-body text-[#C9A66B] tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-6">Fine Foods & Groceries</p>
          <h1 className="font-premium text-4xl sm:text-5xl md:text-7xl font-bold mb-8 text-white tracking-wide leading-tight max-w-4xl mx-auto px-2 break-words">
            {content.hero_title || 'An Epicurean Journey Awaits.'}
          </h1>
          <p className="font-premium italic text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {content.hero_text || 'Discover a meticulously curated selection of gourmet ingredients, imported delicacies, and organic local produce.'}
          </p>
          <button
            onClick={() => (document.getElementById('curated') || document.getElementById('menu') || document.getElementById('products'))?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-[#C9A66B] text-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#111111] px-10 py-4 font-body text-xs uppercase tracking-widest transition-all duration-300">
            Explore the Aisles
          </button>
        </div>
      </section>

      {/* Products */}
      <section id="curated" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-20">
            <div className="w-px h-16 bg-[#C9A66B] mb-8"></div>
            <h2 className="font-premium text-4xl text-[#C9A66B] uppercase tracking-widest text-center">The Reserve Collection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative bg-[#1A1A1A]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#C9A66B]/20 pointer-events-none"></div>
                </div>
                <div className="text-center">
                  <div className="font-body text-[10px] text-gray-500 uppercase tracking-widest mb-3">{p.origin}</div>
                  <h3 className="font-premium text-lg text-white mb-3 group-hover:text-[#C9A66B] transition-colors">{p.name}</h3>
                  <div className="font-body text-[#C9A66B] text-sm tracking-wider">{p.price}</div>
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
                    {srv.image ? <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
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
                <div key={i} onClick={() => setSelectedGalleryImage(img)} className="aspect-square rounded-xl overflow-hidden bg-black/5 cursor-pointer group relative">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View
                    </span>
                  </div>
                </div>
              ))}
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}


      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-[#0A0A0A] border-t border-black/20">
          <div className="container mx-auto max-w-4xl bg-[#111111] rounded-2xl p-8 md:p-12 shadow-sm border border-[#C9A66B]/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Have questions or want to reach out? Contact our support team.</p>
            <div className="flex flex-col md:flex-row gap-12 text-left">
              <div className="flex-1 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#C9A66B]/30 flex items-center justify-center text-[#C9A66B] shrink-0">📞</div>
                  <div>
                    <span className="font-body text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Concierge</span>
                    <span className="font-premium text-white text-xl">{content.contact_info?.phone || '1800 123 4567'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#C9A66B]/30 flex items-center justify-center text-[#C9A66B] shrink-0">✉️</div>
                  <div>
                    <span className="font-body text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Inquiries</span>
                    <span className="font-premium text-white text-xl break-all">{content.contact_info?.email || 'hello@example.com'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#C9A66B]/30 flex items-center justify-center text-[#C9A66B] shrink-0">📍</div>
                  <div>
                    <span className="font-body text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Boutique</span>
                    <span className="font-premium text-white text-xl">{content.contact_info?.address || '123 Main Street'}</span>
                  </div>
                </div>

                {/* Social Links */}
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter) && (
                  <div className="pt-8 border-t border-[#C9A66B]/20">
                    <span className="font-body text-[10px] text-gray-500 uppercase tracking-widest block mb-4">Connect</span>
                    <div className="flex gap-4">
                      {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#C9A66B]/30 rounded-full flex items-center justify-center hover:bg-[#C9A66B] hover:text-[#111111] transition-all text-[#C9A66B] font-body text-xs">FB</a>}
                      {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#C9A66B]/30 rounded-full flex items-center justify-center hover:bg-[#C9A66B] hover:text-[#111111] transition-all text-[#C9A66B] font-body text-xs">IG</a>}
                      {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#C9A66B]/30 rounded-full flex items-center justify-center hover:bg-[#C9A66B] hover:text-[#111111] transition-all text-[#C9A66B] font-body text-xs">TW</a>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-8">
                <div>
                  <h3 className="font-premium text-2xl mb-4 text-white">Opening Hours</h3>
                  <ul className="space-y-4 font-body text-gray-400">
                    {content.contact_info?.hours ? (
                      <li className="whitespace-pre-wrap text-white">{content.contact_info.hours}</li>
                    ) : (
                      <>
                        <li className="flex justify-between border-b border-[#C9A66B]/10 pb-2"><span>Monday - Friday</span> <span className="text-white">9:00 AM - 9:00 PM</span></li>
                        <li className="flex justify-between border-b border-[#C9A66B]/10 pb-2"><span>Saturday</span> <span className="text-white">10:00 AM - 8:00 PM</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-[#C9A66B]">Closed</span></li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Embedded Map */}
                <div className="w-full rounded-none overflow-hidden border border-[#C9A66B]/20 relative flex-1 min-h-[250px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '123 Main Street')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Store Location"
                    className="absolute inset-0 grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  ></iframe>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="visit" className="bg-[#111111] pt-24 pb-12 px-6 border-t border-[#1A1A1A]">
        <div className="container mx-auto max-w-5xl text-center">
          <Wine size={32} className="mx-auto text-[#1A1A1A] fill-[#C9A66B] mb-8" />
          <h3 className="font-premium text-3xl text-white mb-6 tracking-widest uppercase">{siteName}</h3>
          <p className="font-body text-sm text-gray-500 tracking-wider leading-loose max-w-lg mx-auto mb-16">
            {content.about_text || "Purveyors of excellence since 2010. Offering an unparalleled grocery shopping experience for the discerning palate."}
          </p>

          <div className="grid md:grid-cols-3 gap-8 font-body text-xs tracking-widest text-gray-400 border-t border-[#1A1A1A] pt-12">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#C9A66B] uppercase">Boutique</span>
              <span>{content.contact_info?.address || '1 Heritage Square, Kerala'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#C9A66B] uppercase">Concierge</span>
              <span>{content.contact_info?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#C9A66B] uppercase">Inquiries</span>
              <span>{content.contact_info?.email || 'concierge@luxegourmet.in'}</span>
            </div>
          </div>
        </div>
      </footer>


      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 rounded-full w-12 h-12 flex items-center justify-center transition-colors border border-white/30"
            onClick={(e) => { e.stopPropagation(); setSelectedGalleryImage(null); }}
          >
            <span className="text-2xl font-bold">×</span>
          </button>
          <img src={selectedGalleryImage} alt="Gallery full size" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}

