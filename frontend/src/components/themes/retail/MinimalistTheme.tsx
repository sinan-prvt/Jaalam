import React, { useState } from 'react';
import { Search, ShoppingCart, ArrowRight, Menu, X } from 'lucide-react';

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Twitter = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4.01c-1 .49-1.98.68-3 .99-1.12-1.21-2.74-1.72-4.4-1.23-1.63.48-2.9 1.76-3.38 3.39-.1.34-.14.7-.14 1.05C6.1 8.09 3.1 5.92 1.6 3.18 1.1 4.03 1.01 5.16 1.48 6.09c.47.93 1.25 1.57 2.19 1.83-.8-.03-1.57-.25-2.27-.64v.04c.01 1.49 1.02 2.75 2.47 3.09-.43.12-.88.16-1.33.12.4 1.25 1.56 2.16 2.87 2.19-1.18.93-2.65 1.44-4.17 1.41-.3 0-.61-.02-.91-.05 1.47.95 3.18 1.46 4.96 1.46 5.86 0 9.17-4.73 9.4-9.31v-.48c1.03-.75 1.93-1.64 2.63-2.67z" /></svg>
);

export default function MinimalistTheme({ website, content }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewProductsPage, setViewProductsPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const siteName = content.settings_json?.website_name || website.slug || 'MINIMAL';
  const address = content.contact_info?.address || '123 Minimalist Way, NY 10012';

  const defaultProducts = [
    { name: 'Ceramic Vase', price: '?85', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', description: 'Handcrafted unglazed ceramic vase.' },
    { name: 'Linen Throw', price: '?120', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', description: 'Pure organic linen throw blanket.' },
    { name: 'Oak Stool', price: '?195', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80', description: 'Solid oak wood stool with matte finish.' },
    { name: 'Table Lamp', price: '?150', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', description: 'Minimalist powder-coated steel lamp.' },
    { name: 'Incense Burner', price: '?45', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', description: 'Brass incense holder with ash tray.' },
    { name: 'Glass Carafe', price: '?65', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80', description: 'Hand-blown glass carafe and cup set.' }
  ];

  const defaultServices = [
    { title: 'Personal Shopping', description: 'Curated selections tailored to your unique style and needs.', image: '' },
    { title: 'Interior Styling', description: 'Expert advice on creating minimalist, functional living spaces.', image: '' },
    { title: 'Gift Concierge', description: 'Thoughtful, beautifully wrapped gifts for any occasion.', image: '' }
  ];

  const products = content.products_json?.length > 0 ? content.products_json : defaultProducts;
  const services = content.services_json?.length > 0 ? content.services_json : defaultServices;
  const hiddenSections = content.settings_json?.hidden_sections || [];

  let galleryImages = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .min-sans { font-family: 'Inter', sans-serif; }
        .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-4px); }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="min-sans font-semibold tracking-widest uppercase text-xl">{siteName}</span>
          <nav className="hidden md:flex gap-6 min-sans text-sm text-gray-500">
            <a href="#shop" className="hover:text-black transition-colors">Shop</a>
            <a href="#about" className="hover:text-black transition-colors">About</a>
            {!hiddenSections.includes('gallery') && <a href="#gallery" className="hover:text-black transition-colors">Gallery</a>}
            {!hiddenSections.includes('contact') && <a href="#contact" className="hover:text-black transition-colors">Contact</a>}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Search size={20} className="hidden md:block cursor-pointer hover:text-gray-500 transition-colors" />
          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] p-6 flex flex-col">
          <button className="self-end mb-12" onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
          <nav className="flex flex-col gap-6 min-sans text-2xl font-light">
            <a href="#shop" onClick={() => setIsMenuOpen(false)}>Shop</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            {!hiddenSections.includes('gallery') && <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>}
            {!hiddenSections.includes('contact') && <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>}
          </nav>
        </div>
      )}

      {/* Hero */}
      {!hiddenSections.includes('hero') && (
        <section className="pt-24 md:pt-32 pb-12 px-6 md:px-12">
          <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 relative overflow-hidden group">
            <img
              src={content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=80'}
              alt="Hero"
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <h1 className="min-sans text-4xl md:text-6xl font-light bg-white/90 backdrop-blur-sm px-8 py-4 break-words whitespace-pre-wrap">
                {content.hero_title || 'Focus on the essential.'}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {!hiddenSections.includes('about') && (
        <section id="about" className="py-24 px-6 md:px-12 bg-gray-50 mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="min-sans text-3xl md:text-4xl font-light mb-8 leading-snug break-words whitespace-pre-wrap">
              {content.settings_json?.about_title || 'Design rooted in simplicity and function.'}
            </h2>
            <p className="min-sans text-gray-500 leading-relaxed max-w-xl mx-auto break-words whitespace-pre-wrap">
              {content.settings_json?.about_description || 'We curate objects that elevate everyday rituals. Minimalist design, sustainable materials, and honest craftsmanship are at the core of everything we offer.'}
            </p>
          </div>
        </section>
      )}

      {/* Services */}
      {!hiddenSections.includes('services') && services.length > 0 && (
        <section id="services" className="py-24 px-6 md:px-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="min-sans text-2xl font-medium mb-16 text-center">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {services.map((service: any, i: number) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  {service.image ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-8 bg-gray-50">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center mb-6 min-sans text-xl font-light text-gray-400 border-b border-gray-200 pb-4 w-full">
                      0{i + 1}
                    </div>
                  )}
                  <h3 className="font-medium text-lg mb-4 break-all">{service.title || service.name || 'Service'}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed break-all whitespace-pre-wrap max-w-sm">
                    {service.description || 'Focus on the essential details and curated experiences.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid Products */}
      {!hiddenSections.includes('menu') && (
        <section id="shop" className="py-12 px-6 md:px-12">
          <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
            <h2 className="min-sans text-2xl font-medium">New Arrivals</h2>
            <button onClick={() => setViewProductsPage(true)} className="min-sans text-sm text-gray-500 hover:text-black flex items-center gap-2">View All <ArrowRight size={16} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.slice(0, 6).map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer hover-lift" onClick={() => setSelectedProduct(p)}>
                <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex justify-between items-start min-sans">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-medium text-sm mb-1 break-all">{p.name}</h3>
                    <p className="text-gray-500 text-xs break-all line-clamp-1">{p.description}</p>
                  </div>
                  <span className="text-sm shrink-0">{p.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button onClick={() => setViewProductsPage(true)} className="border border-black text-black hover:bg-black hover:text-white px-8 py-3 transition-colors min-sans text-sm tracking-widest uppercase">
              View More
            </button>
          </div>
        </section>
      )}

      {/* Gallery */}
      {!hiddenSections.includes('gallery') && (
        <section id="gallery" className="py-24 px-6 md:px-12 bg-white">
          <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
            <h2 className="min-sans text-2xl font-medium">Spaces</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-gray-50 overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(img)}>
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {!hiddenSections.includes('contact') && (
        <section id="contact" className="py-24 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="min-sans text-3xl font-light mb-8">Get in touch.</h2>
              <div className="space-y-6 text-gray-600 min-sans text-sm">
                <div className="flex items-start gap-4">
                  <span className="font-medium text-black w-24 shrink-0">Visit</span>
                  <p className="flex-1 break-words">{address}</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-medium text-black w-24 shrink-0">Email</span>
                  <p className="flex-1 break-words">{content.contact_info?.email || 'hello@minimal.com'}</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-medium text-black w-24 shrink-0">Phone</span>
                  <p className="flex-1 break-words">{content.contact_info?.phone || '+1 800 123 4567'}</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-medium text-black w-24 shrink-0">Hours</span>
                  <p className="flex-1 break-words whitespace-pre-wrap">{content.contact_info?.hours || "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"}</p>
                </div>
              </div>
              <div className="mt-12 flex gap-6">
                <a href={content.contact_info?.instagram || "#"} className="text-black hover:text-gray-500 transition-colors"><Instagram size={20} /></a>
                <a href={content.contact_info?.facebook || "#"} className="text-black hover:text-gray-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href={content.contact_info?.whatsapp || "#"} className="text-black hover:text-gray-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>
              </div>
            </div>
            <div className="h-80 md:h-full min-h-[300px] bg-gray-200">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 py-12 px-6 md:px-12 min-sans text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-medium mb-4">{siteName}</h4>
            <p className="text-gray-500 max-w-xs break-words">Curated essentials for modern living.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-500">
              <li className="break-words">{content.contact_info?.email || 'hello@minimal.com'}</li>
              <li className="break-words">{content.contact_info?.phone || '+1 800 123 4567'}</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-3 text-xs text-gray-400 mt-12">
          <div className="text-center">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</div>
          <div className="text-center text-gray-500">Designed with <span className="font-medium text-black">Jaalam</span></div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm p-4 md:p-6 animate-in fade-in flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-12" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full z-10" onClick={() => setSelectedProduct(null)}>
              <X size={20} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              <div className="h-48 md:h-auto md:aspect-square bg-gray-50">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex flex-col justify-center min-sans">
                <h2 className="text-xl md:text-3xl font-medium mb-2 break-all">{selectedProduct.name}</h2>
                <p className="text-lg md:text-xl text-gray-500 mb-4 md:mb-8">{selectedProduct.price}</p>
                <div className="w-8 md:w-12 h-px bg-black mb-4 md:mb-8"></div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 md:mb-12 break-all">{selectedProduct.description}</p>
                <button className="bg-black text-white py-3 md:py-4 px-8 w-full hover:bg-gray-800 transition-colors" onClick={() => setSelectedProduct(null)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Products Page */}
      {viewProductsPage && (
        <div className="fixed inset-0 z-[300] bg-white overflow-y-auto animate-in slide-in-from-bottom">
          <div className="min-h-screen py-24 px-6 md:px-12 relative">
            <button onClick={() => setViewProductsPage(false)} className="absolute top-8 right-8 text-black hover:text-gray-500 min-sans font-medium uppercase tracking-widest flex items-center gap-2 transition-colors">
              Close <X size={24} />
            </button>

            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="min-sans text-4xl md:text-5xl font-light mb-4">All Products</h2>
                <p className="min-sans text-gray-500">Our complete collection.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {products.map((p: any, i: number) => (
                  <div key={i} className="group cursor-pointer hover-lift" onClick={() => { setSelectedProduct(p); }}>
                    <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex justify-between items-start min-sans">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-medium text-sm mb-1 break-all">{p.name}</h3>
                        <p className="text-gray-500 text-xs break-all line-clamp-1">{p.description}</p>
                      </div>
                      <span className="text-sm shrink-0">{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full" onClick={() => setSelectedImage(null)}>
            <X size={24} />
          </button>
          <img src={selectedImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain shadow-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

