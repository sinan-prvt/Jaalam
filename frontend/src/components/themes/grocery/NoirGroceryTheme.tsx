import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Menu, X } from 'lucide-react';
export default function NoirGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'NOIR MARKET';

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Truffle Oil', price: '₹950', size: '250ml', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', description: 'Premium Italian truffle oil.' },
    { name: 'Black Salt', price: '₹180', size: '500g', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', description: 'Himalayan black salt crystals.' },
    { name: 'Dark Coffee', price: '₹520', size: '250g', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80', description: 'Single-origin dark roast.' },
    { name: 'Squid Ink Pasta', price: '₹320', size: '400g', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', description: 'Artisan squid ink pasta.' },
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Curated Selection', description: 'Only the finest, hand-selected products make it to our shelves.' },
    { title: 'Same-Day Delivery', description: 'Premium delivery directly to your door.' },
    { title: 'Members Club', description: 'Exclusive access to rare and limited-edition products.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-300 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;import ProductBuyButton from '../../payments/ProductBuyButton';
400;600;700&family=Jost:wght@300;400;500&display=swap');
        .font-noir { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'Jost', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Nav */}
      <nav style={{ order: 0 }} className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-zinc-900 px-4 md:px-16 py-4 md:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          {content.settings_json?.logo_image && (
            <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-8 w-auto object-contain filter invert shrink-0" />
          )}
          <span className="font-noir text-base md:text-2xl font-semibold tracking-wider md:tracking-[0.3em] text-white uppercase truncate block">
            {siteName}
          </span>
        </div>
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className="hidden md:flex items-center gap-10 font-body text-xs tracking-[0.2em] uppercase text-zinc-500">
          {!hiddenSections.includes('menu') && <a href="#shop" className="hover:text-white transition-colors">Shop</a>}
          {!hiddenSections.includes('about') && <a href="#about" className="hover:text-white transition-colors">About</a>}
          {!hiddenSections.includes('gallery') && <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>}
          {!hiddenSections.includes('contact') && <a href="#contact" className="border border-zinc-700 px-5 py-2 text-zinc-400 hover:border-white hover:text-white transition-all">Contact</a>}
        </div>
        
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur border-b border-zinc-900 md:hidden flex flex-col font-body text-xs tracking-[0.2em] uppercase text-zinc-500">
            {!hiddenSections.includes('menu') && <a href="#shop" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-t border-zinc-900 hover:text-white transition-colors">Shop</a>}
            {!hiddenSections.includes('about') && <a href="#about" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-t border-zinc-900 hover:text-white transition-colors">About</a>}
            {!hiddenSections.includes('gallery') && <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-t border-zinc-900 hover:text-white transition-colors">Gallery</a>}
            {!hiddenSections.includes('contact') && <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-t border-zinc-900 hover:text-white transition-colors text-zinc-400">Contact</a>}
          </div>
        )}
      </nav>

      {/* Hero */}
      {!hiddenSections.includes('hero') && (
        <section id="hero" style={{ order: sectionOrder.indexOf('hero') + 1 }} className="min-h-screen flex flex-col justify-end px-6 md:px-16 pb-20 pt-32 relative overflow-hidden">
          {content.settings_json?.about_image && (
            <div className="absolute inset-0">
              <img loading="lazy" src={content.settings_json.about_image} alt="Hero" className="w-full h-full object-cover opacity-30 filter grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            </div>
          )}
          {!content.settings_json?.about_image && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-[#0a0a0a]" />
          )}
          <div className="relative z-10 max-w-4xl w-full">
            <span className="font-body text-[10px] md:text-xs tracking-[0.4em] uppercase text-zinc-600 block mb-6 md:mb-8">Premium Grocery</span>
            <h1 className="font-noir text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-light text-white leading-[1.1] md:leading-[0.9] mb-6 md:mb-8 tracking-tight break-words">
              {content.hero_title || 'Dark Market'}
            </h1>
            <p className="font-body text-zinc-500 text-lg max-w-lg leading-relaxed font-light mb-12">
              {content.hero_text || 'Rare ingredients for discerning palates. Curated with obsession, delivered with precision.'}
            </p>
            {!hiddenSections.includes('menu') && (
              <a href="#shop" className="inline-flex items-center gap-4 font-body text-xs tracking-[0.3em] uppercase text-white border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-all duration-500">
                Explore Collection
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            )}
          </div>
          {/* Decorative line */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 w-[1px] h-48 bg-gradient-to-b from-transparent via-zinc-700 to-transparent hidden md:block" />
        </section>
      )}

      {/* About */}
      {!hiddenSections.includes('about') && (
        <section id="about" style={{ order: sectionOrder.indexOf('about') + 1 }} className="py-32 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-zinc-600 block mb-6 border-l border-zinc-700 pl-4">Our Philosophy</span>
              <h2 className="font-noir text-5xl md:text-6xl text-white font-light leading-tight mb-8">
                {content.settings_json?.about_title || 'Quality Without Compromise'}
              </h2>
            </div>
            <div>
              <p className="font-body text-zinc-400 text-lg leading-relaxed font-light">
                {content.settings_json?.about_description || content.about_text || 'We source only the rarest and finest ingredients from around the world. Every product is meticulously vetted, every supplier personally visited. This is not just grocery shopping — this is a culinary experience.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {!hiddenSections.includes('services') && (
        <section id="services" style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-24 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-zinc-600 block mb-16 text-center">Our Promise</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900">
              {services.map((srv: any, i: number) => (
                <div key={i} className="bg-[#0a0a0a] p-10 hover:bg-zinc-950 transition-colors group">
                  <span className="font-body text-[10px] tracking-widest text-zinc-700 block mb-6">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-noir text-2xl text-white mb-4 font-normal">{srv.title}</h3>
                  <p className="font-body text-zinc-500 text-sm leading-relaxed font-light">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {!hiddenSections.includes('menu') && (
        <section id="shop" style={{ order: sectionOrder.indexOf('menu') + 1 }} className="py-24 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-zinc-600 block mb-4">Products</span>
                <h2 className="font-noir text-5xl text-white font-light">The Collection</h2>
              </div>
              <div className="text-right">
                <button onClick={() => setShowAllProducts(true)} className="font-body text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                  View All
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900">
              {products.slice(0, 8).map((p: any, i: number) => (
                <div key={i} onClick={() => setSelectedProduct(p)} className="bg-[#0a0a0a] group cursor-pointer hover:bg-zinc-950 transition-colors">
                  <div className="aspect-square overflow-hidden bg-zinc-950">
                    <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-70 group-hover:opacity-100" />
                  </div>
                  <div className="p-6 border-t border-zinc-900">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-noir text-xl text-white font-normal">{p.name}</h3>
                      <span className="font-body text-sm text-zinc-400">{p.price}</span>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
                    </div>
                    {p.size && <span className="font-body text-xs text-zinc-700">{p.size}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => setShowAllProducts(true)} className="font-body text-xs tracking-[0.3em] uppercase text-zinc-500 border border-zinc-800 px-10 py-4 hover:border-white hover:text-white transition-all duration-300">
                View All Products
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {!hiddenSections.includes('gallery') && (
        <section id="gallery" style={{ order: sectionOrder.indexOf('gallery') + 1 }} className="py-24 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-zinc-600 block mb-16 text-center">Visual Archive</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {gallery.slice(0, 8).map((img: any, i: number) => {
                const imgUrl = typeof img === 'string' ? img : img.url;
                return (
                  <div key={i} className={`overflow-hidden cursor-pointer group relative ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`} onClick={() => setSelectedGalleryImage(imgUrl)}>
                    <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/0 transition-colors duration-700" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {!hiddenSections.includes('contact') && (
        <section id="contact" style={{ order: sectionOrder.indexOf('contact') + 1 }} className="py-24 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-zinc-600 block mb-8">Get In Touch</span>
              <h2 className="font-noir text-5xl md:text-6xl text-white font-light mb-12">Contact Us</h2>
              <ul className="space-y-8">
                {content.contact_info?.phone && (
                  <li className="border-b border-zinc-900 pb-8">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-zinc-600 block mb-2">Phone</span>
                    <span className="font-noir text-2xl text-white">{content.contact_info.phone}</span>
                  </li>
                )}
                {content.contact_info?.email && (
                  <li className="border-b border-zinc-900 pb-8">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-zinc-600 block mb-2">Email</span>
                    <span className="font-noir text-2xl text-white">{content.contact_info.email}</span>
                  </li>
                )}
                {content.contact_info?.address && (
                  <li className="border-b border-zinc-900 pb-8">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-zinc-600 block mb-2">Location</span>
                    <span className="font-noir text-2xl text-white">{content.contact_info.address}</span>
                  </li>
                )}
              </ul>
              {/* Working Hours */}
              <div className="mt-10 p-6 border border-zinc-900">
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-zinc-600 block mb-4">Store Hours</span>
                <ul className="space-y-2 font-body text-sm text-zinc-500">
                  {content.contact_info?.hours ? (
                    <li className="whitespace-pre-wrap text-zinc-300">{content.contact_info.hours}</li>
                  ) : (
                    <>
                      <li className="flex justify-between"><span>Mon – Fri</span><span>9:00 AM – 8:00 PM</span></li>
                      <li className="flex justify-between"><span>Saturday</span><span>10:00 AM – 6:00 PM</span></li>
                      <li className="flex justify-between"><span>Sunday</span><span className="text-zinc-700">Closed</span></li>
                    </>
                  )}
                </ul>
              </div>
              {/* Social */}
              {(content.contact_info?.instagram || content.contact_info?.facebook || content.contact_info?.twitter) && (
                <div className="mt-8 flex gap-6">
                  {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="font-body text-xs tracking-widest uppercase text-zinc-600 hover:text-white transition-colors">Facebook</a>}
                  {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="font-body text-xs tracking-widest uppercase text-zinc-600 hover:text-white transition-colors">Instagram</a>}
                  {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="font-body text-xs tracking-widest uppercase text-zinc-600 hover:text-white transition-colors">Twitter</a>}
                </div>
              )}
            </div>
            {content.contact_info?.address && (
              <div className="h-full min-h-[400px] border border-zinc-900">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%" height="100%" style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen={false} loading="lazy"
                  className="filter grayscale invert contrast-125 hover:grayscale-0 hover:invert-0 transition-all duration-1000"
                  title="Store Location"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {!hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-20 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto space-y-10">
            {content.custom_blocks_json.map((block: any, idx: number) => {
              if (block.type === 'heading') return <h2 key={idx} className="font-noir text-5xl text-white font-light">{block.content}</h2>;
              if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-body text-zinc-400 text-lg leading-relaxed font-light whitespace-pre-wrap">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={idx} src={block.url} alt="Custom" className="w-full filter grayscale contrast-125" />;
              if (block.type === 'divider') return <div key={idx} className="w-full h-px bg-zinc-900 my-10" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ order: 999 }} className="py-16 px-6 md:px-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
        <span className="font-noir text-xl text-zinc-600 tracking-[0.3em] uppercase">{siteName}</span>
        <p className="font-body text-xs text-zinc-700">© {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
      </footer>

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={() => setSelectedGalleryImage(null)}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="View" className="max-w-full max-h-[90vh] object-contain filter grayscale contrast-125" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
