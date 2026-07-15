import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Menu, X } from 'lucide-react';
export default function PopGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'FreshPOP';

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Oat Milk', price: '₹250', size: '1L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80', description: 'Creamy oat milk.' },
    { name: 'Coffee Beans', price: '₹450', size: '250g', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80', description: 'Premium arabica beans.' },
    { name: 'Honey Jar', price: '₹320', size: '500g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', description: 'Wild forest honey.' },
    { name: 'Olive Oil', price: '₹850', size: '500ml', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', description: 'Cold pressed extra virgin.' },
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: '🌿 Organic First', description: 'Every product is sustainably sourced and certified organic.' },
    { title: '⚡ Express Delivery', description: 'From our store to your door in under 2 hours.' },
    { title: '🎁 Loyalty Rewards', description: 'Earn points on every purchase and redeem for free products.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;import ProductBuyButton from '../../payments/ProductBuyButton';
600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .font-pop { font-family: 'Nunito', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .float-anim { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Colorful Nav */}
      <nav style={{ order: 0 }} className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-pop text-2xl font-black text-emerald-600 flex items-center gap-3">
          {content.settings_json?.logo_image && (
            <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-9 w-auto object-contain" />
          )}
          <span>{siteName}</span>
        </span>
        <button className="md:hidden text-emerald-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className="hidden md:flex items-center gap-8 font-body text-sm font-semibold text-gray-600">
          {!hiddenSections.includes('menu') && <a href="#shop" className="hover:text-emerald-600 transition-colors">Shop</a>}
          {!hiddenSections.includes('about') && <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>}
          {!hiddenSections.includes('services') && <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>}
          {!hiddenSections.includes('gallery') && <a href="#gallery" className="hover:text-emerald-600 transition-colors">Gallery</a>}
          {!hiddenSections.includes('contact') && (
            <a href="#contact" className="bg-emerald-500 text-white px-6 py-2.5 rounded-full hover:bg-emerald-600 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 font-bold">
              Contact
            </a>
          )}
        </div>
        
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg md:hidden flex flex-col font-body text-sm font-semibold text-gray-600">
            {!hiddenSections.includes('menu') && <a href="#shop" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Shop</a>}
            {!hiddenSections.includes('about') && <a href="#about" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">About</a>}
            {!hiddenSections.includes('services') && <a href="#services" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Services</a>}
            {!hiddenSections.includes('gallery') && <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Gallery</a>}
            {!hiddenSections.includes('contact') && <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-emerald-600">Contact</a>}
          </div>
        )}
      </nav>

      {/* Hero — Split Layout with bold color */}
      {!hiddenSections.includes('hero') && (
        <section id="hero" style={{ order: sectionOrder.indexOf('hero') + 1 }} className="pt-24 pb-0 min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 bg-emerald-50 px-8 md:px-16 py-20 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-2 rounded-full mb-8 w-fit">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Fresh & Organic
            </div>
            <h1 className="font-pop text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-6">
              {content.hero_title || 'Fresh. Bold.\nDelicious.'}
            </h1>
            <p className="font-body text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
              {content.hero_text || 'Your neighbourhood supermarket, reimagined. Discover fresh produce, artisan goods, and everyday essentials — all in one place.'}
            </p>
            <div className="flex flex-wrap gap-4">
              {!hiddenSections.includes('menu') && (
                <a href="#shop" className="font-pop font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all text-base">
                  Shop Now 🛒
                </a>
              )}
              {!hiddenSections.includes('about') && (
                <a href="#about" className="font-pop font-bold bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 px-8 py-4 rounded-2xl hover:-translate-y-1 transition-all text-base">
                  Our Story
                </a>
              )}
            </div>
            {/* Stats row */}
            <div className="mt-12 flex gap-10 border-t border-emerald-100 pt-8">
              <div>
                <div className="font-pop text-2xl font-black text-emerald-600">500+</div>
                <div className="font-body text-xs text-gray-500 font-medium">Products</div>
              </div>
              <div>
                <div className="font-pop text-2xl font-black text-emerald-600">100%</div>
                <div className="font-body text-xs text-gray-500 font-medium">Fresh</div>
              </div>
              <div>
                <div className="font-pop text-2xl font-black text-emerald-600">2hr</div>
                <div className="font-body text-xs text-gray-500 font-medium">Delivery</div>
              </div>
            </div>
          </div>
          {/* Right: Image */}
          <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-0 bg-emerald-500 overflow-hidden">
            <img loading="lazy" src={content.settings_json?.about_image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"} 
              alt="Hero" 
              className="w-full h-full object-cover absolute inset-0" 
            />
            {/* Decorative blobs */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-3xl" />
            <div className="absolute top-10 right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
          </div>
        </section>
      )}

      {/* About */}
      {!hiddenSections.includes('about') && (
        <section id="about" style={{ order: sectionOrder.indexOf('about') + 1 }} className="py-24 px-6 md:px-16 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <span className="font-pop text-sm font-bold tracking-widest uppercase text-emerald-500 mb-4 block">Our Story</span>
            <h2 className="font-pop text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
              {content.settings_json?.about_title || 'We Bring Farm Freshness to Your Table'}
            </h2>
            <p className="font-body text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {content.settings_json?.about_description || content.about_text || 'Founded with a passion for fresh, quality food — we work directly with local farmers and trusted suppliers to bring you the best produce every single day. No middlemen, no compromises.'}
            </p>
          </div>
        </section>
      )}

      {/* Services — Colorful cards */}
      {!hiddenSections.includes('services') && (
        <section id="services" style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-24 px-6 md:px-16 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-pop text-sm font-bold tracking-widest uppercase text-violet-500 mb-4 block">Why Choose Us</span>
              <h2 className="font-pop text-4xl md:text-5xl font-black text-gray-900">Our Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv: any, i: number) => {
                const colors = [
                  'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
                  'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                  'bg-violet-50 border-violet-200 hover:bg-violet-100',
                ];
                const numColors = ['bg-emerald-500', 'bg-yellow-500', 'bg-violet-500'];
                return (
                  <div key={i} className={`${colors[i % 3]} border-2 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg`}>
                    <div className={`${numColors[i % 3]} text-white w-12 h-12 rounded-2xl flex items-center justify-center font-pop font-black text-lg mb-6 shadow-md`}>
                      {i + 1}
                    </div>
                    <h3 className="font-pop text-xl font-black text-gray-900 mb-3">{srv.title}</h3>
                    <p className="font-body text-gray-600 leading-relaxed text-sm">{srv.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Products — Bright cards */}
      {!hiddenSections.includes('menu') && (
        <section id="shop" style={{ order: sectionOrder.indexOf('menu') + 1 }} className="py-24 px-6 md:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
              <div>
                <span className="font-pop text-sm font-bold tracking-widest uppercase text-cyan-500 mb-4 block">Products</span>
                <h2 className="font-pop text-4xl md:text-5xl font-black text-gray-900">Fresh Picks</h2>
              </div>
              <div className="text-right">
                <button onClick={() => setShowAllProducts(true)} className="font-pop font-bold text-sm text-gray-500 border-2 border-gray-200 px-6 py-3 rounded-full hover:border-emerald-400 hover:text-emerald-600 transition-all">
                  View All →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p: any, i: number) => (
                <div key={i} onClick={() => setSelectedProduct(p)} className="group cursor-pointer bg-gray-50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-emerald-100">
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-pop font-bold text-gray-900 text-lg mb-1 truncate">{p.name}</h3>
                    {p.size && <span className="font-body text-xs text-gray-400 block mb-3">{p.size}</span>}
                    <div className="flex items-center justify-between">
                      <span className="font-pop font-black text-emerald-600 text-lg">{p.price}</span>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
                      <button className="bg-emerald-100 text-emerald-700 p-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery — Rounded, colorful */}
      {!hiddenSections.includes('gallery') && (
        <section id="gallery" style={{ order: sectionOrder.indexOf('gallery') + 1 }} className="py-24 px-6 md:px-16 bg-emerald-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-pop text-sm font-bold tracking-widest uppercase text-pink-500 mb-4 block">Gallery</span>
              <h2 className="font-pop text-4xl md:text-5xl font-black text-gray-900">Fresh from the Store</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.slice(0, 8).map((img: any, i: number) => {
                const imgUrl = typeof img === 'string' ? img : img.url;
                return (
                  <div key={i} className={`rounded-3xl overflow-hidden cursor-pointer group relative bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
                    onClick={() => setSelectedGalleryImage(imgUrl)}>
                    <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white font-pop font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 px-4 py-2 rounded-full">View</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact — Dark card with map */}
      {!hiddenSections.includes('contact') && (
        <section id="contact" style={{ order: sectionOrder.indexOf('contact') + 1 }} className="py-24 px-6 md:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-14 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

              <div className="relative z-10 grid md:grid-cols-2 gap-12">
                <div>
                  <span className="font-pop text-sm font-bold tracking-widest uppercase text-emerald-400 mb-4 block">Contact Us</span>
                  <h2 className="font-pop text-4xl md:text-5xl font-black text-white mb-10">Let's Talk!</h2>
                  <div className="space-y-6">
                    {content.contact_info?.phone && (
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-xl">📞</div>
                        <div>
                          <div className="font-body text-xs text-gray-400 uppercase tracking-wider mb-0.5">Phone</div>
                          <div className="font-pop font-bold text-white">{content.contact_info.phone}</div>
                        </div>
                      </div>
                    )}
                    {content.contact_info?.email && (
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 text-xl">✉️</div>
                        <div>
                          <div className="font-body text-xs text-gray-400 uppercase tracking-wider mb-0.5">Email</div>
                          <div className="font-pop font-bold text-white">{content.contact_info.email}</div>
                        </div>
                      </div>
                    )}
                    {content.contact_info?.address && (
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 text-xl">📍</div>
                        <div>
                          <div className="font-body text-xs text-gray-400 uppercase tracking-wider mb-0.5">Address</div>
                          <div className="font-pop font-bold text-white">{content.contact_info.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Hours */}
                  <div className="mt-10 p-6 bg-white/5 rounded-2xl">
                    <div className="font-pop text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">🕒 Store Hours</div>
                    <ul className="space-y-2 font-body text-sm text-gray-400">
                      {content.contact_info?.hours ? (
                        <li className="whitespace-pre-wrap text-white">{content.contact_info.hours}</li>
                      ) : (
                        <>
                          <li className="flex justify-between"><span>Mon – Fri</span><span className="text-white font-semibold">9 AM – 8 PM</span></li>
                          <li className="flex justify-between"><span>Saturday</span><span className="text-white font-semibold">10 AM – 6 PM</span></li>
                          <li className="flex justify-between"><span>Sunday</span><span className="text-gray-600">Closed</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                  {/* Social */}
                  {(content.contact_info?.instagram || content.contact_info?.facebook || content.contact_info?.twitter) && (
                    <div className="mt-8 flex gap-3">
                      {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 bg-white/10 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                      </a>}
                      {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-11 h-11 bg-white/10 hover:bg-pink-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                      </a>}
                      {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-11 h-11 bg-white/10 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                      </a>}
                    </div>
                  )}
                </div>
                {content.contact_info?.address && (
                  <div className="rounded-2xl overflow-hidden min-h-[350px] relative">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      width="100%" height="100%" style={{ border: 0, minHeight: '350px' }}
                      allowFullScreen={false} loading="lazy" title="Store Location"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom blocks */}
      {!hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-20 px-6 md:px-16 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-10">
            {content.custom_blocks_json.map((block: any, idx: number) => {
              if (block.type === 'heading') return <h2 key={idx} className="font-pop text-4xl font-black text-gray-900">{block.content}</h2>;
              if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-body text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={idx} src={block.url} alt="Custom" className="w-full rounded-3xl shadow-xl" />;
              if (block.type === 'divider') return <div key={idx} className="w-full h-0.5 bg-gray-100 my-10" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ order: 999 }} className="py-12 px-6 md:px-16 bg-gray-900 text-center mt-auto">
        <span className="font-pop text-2xl font-black text-emerald-400 block mb-2">{siteName}</span>
        <p className="font-body text-sm text-gray-500">© {new Date().getFullYear()} {siteName}. Bringing freshness to your door. 🌿</p>
      </footer>

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[9999] bg-gray-900/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors" onClick={() => setSelectedGalleryImage(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="View" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
