import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Cpu, Monitor, Smartphone, Headphones, ShoppingCart, Search, Menu, X, ArrowRight, ChevronRight } from 'lucide-react';

const Github = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.98a5.1 5.1 0 0 0-.1-3.18s-1.03-.33-3.37 1.25a11.6 11.6 0 0 0-6 0C7.23 1.47 6.2 1.8 6.2 1.8a5.1 5.1 0 0 0-.1 3.18A5.44 5.44 0 0 0 4 8.98c0 5.45 3.3 6.65 6.44 7A4.8 4.8 0 0 0 9.4 19.33V22"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
);

const Twitter = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4.01c-1 .49-1.98.68-3 .99-1.12-1.21-2.74-1.72-4.4-1.23-1.63.48-2.9 1.76-3.38 3.39-.1.34-.14.7-.14 1.05C6.1 8.09 3.1 5.92 1.6 3.18 1.1 4.03 1.01 5.16 1.48 6.09c.47.93 1.25 1.57 2.19 1.83-.8-.03-1.57-.25-2.27-.64v.04c.01 1.49 1.02 2.75 2.47 3.09-.43.12-.88.16-1.33.12.4 1.25 1.56 2.16 2.87 2.19-1.18.93-2.65 1.44-4.17 1.41-.3 0-.61-.02-.91-.05 1.47.95 3.18 1.46 4.96 1.46 5.86 0 9.17-4.73 9.4-9.31v-.48c1.03-.75 1.93-1.64 2.63-2.67z"/></svg>
);

const Facebook = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const MessageCircle = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);

export default function TechGadgetTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'NEXUS TECH';

  const defaultProducts = [
    { name: 'Premium Urban Backpack', price: '₹120', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', description: 'Water-resistant, anti-theft design with integrated charging port.' },
    { name: 'Wireless Noise-Cancelling Earbuds', price: '₹150', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80', description: 'Immersive sound with 24-hour battery life and adaptive EQ.' },
    { name: 'Minimalist Aluminum Watch', price: '₹199', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', description: 'Precision-machined casing with scratch-resistant sapphire glass.' },
    { name: 'Smart Climate Jacket', price: '₹250', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', description: 'Auto-regulating temperature control built into a sleek silhouette.' }
  ];

  const products = content.products_json?.length > 0 ? content.products_json : defaultProducts;
  
  const defaultServices = [
    { title: 'Global Delivery', description: 'Express shipping to over 150 countries worldwide.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=600&q=80' },
    { title: '24/7 Concierge Support', description: 'Priority assistance and dedicated customer service.', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80' },
    { title: 'Hassle-Free Returns', description: '30-day seamless return policy with no questions asked.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80' }
  ];
  const services = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const defaultGallery = [
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'
  ];
  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json : defaultGallery;

  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#050B14] text-[#8ab4f8] selection:bg-[#4285F4] selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        .tg-display { font-family: 'Rajdhani', sans-serif; }
        .tg-mono { font-family: 'Share Tech Mono', monospace; }
        
        .tg-grid-bg {
          background-image: 
            linear-gradient(to right, rgba(66, 133, 244, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(66, 133, 244, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .tg-glass {
          background: rgba(10, 20, 35, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(66, 133, 244, 0.2);
        }
        
        .tg-glass:hover {
          border-color: rgba(66, 133, 244, 0.5);
          box-shadow: 0 0 20px rgba(66, 133, 244, 0.15);
        }
        
        .tg-glow-text {
          text-shadow: 0 0 10px rgba(66, 133, 244, 0.5);
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Grid Background */}
      
      
      {/* Glow Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#4285F4] rounded-full mix-blend-screen filter blur-[120px] opacity-20 z-0 pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#9b72cb] rounded-full mix-blend-screen filter blur-[120px] opacity-10 z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="tg-glass sticky top-0 z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {content.settings_json?.logo_image ? (
            <img src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-[#4285F4]" />
          ) : (
            <Cpu className="text-[#4285F4]" size={28} />
          )}
          <span className="tg-display font-bold text-2xl tracking-widest text-white tg-glow-text uppercase">
            {siteName}
          </span>
        </div>
        
        <nav className="hidden md:flex gap-8 tg-mono text-sm">
          <a href="#hardware" className="hover:text-white hover:tg-glow-text transition-all">/products</a>
          <a href="#specs" className="hover:text-white hover:tg-glow-text transition-all">/about</a>
          <a href="#services" className="hover:text-white hover:tg-glow-text transition-all">/services</a>
          <a href="#gallery" className="hover:text-white hover:tg-glow-text transition-all">/gallery</a>
          <a href="#contact" className="hover:text-white hover:tg-glow-text transition-all">/contact</a>
        </nav>

        <div className="flex items-center gap-6">
          <Search size={20} className="hidden md:block cursor-pointer hover:text-white transition-colors" />

          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 tg-glass z-[60] flex flex-col p-6">
          <button className="self-end hover:text-white" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          <nav className="flex flex-col gap-8 mt-12 tg-mono text-2xl">
            <a href="#hardware" onClick={() => setIsMenuOpen(false)} className="hover:text-white">/products</a>
            <a href="#specs" onClick={() => setIsMenuOpen(false)} className="hover:text-white">/about</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="hover:text-white">/services</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="hover:text-white">/gallery</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-white">/contact</a>
          </nav>
        </div>
      )}

      {/* Content Sections mapped by section_order */}
      {sectionOrder.map(sectionId => {
        if (hiddenSections.includes(sectionId)) return null;

        if (sectionId === 'hero') return (
          <section key="hero" className="relative z-10 pt-20 pb-32 px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 tg-mono text-xs border border-[#4285F4]/30 rounded-full px-4 py-1 mb-8 bg-[#4285F4]/10 text-[#4285F4]">
              <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse"></span>
              SYSTEM ONLINE
            </div>
            <h1 className="tg-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight max-w-5xl mx-auto break-all sm:break-words whitespace-pre-wrap">
              {content.hero_title || 'ENGINEERED FOR EXCELLENCE'}
            </h1>
            <p className="tg-mono text-lg md:text-xl max-w-2xl mx-auto mb-12 text-[#8ab4f8]/80 leading-relaxed break-all sm:break-words whitespace-pre-wrap">
              {content.about_text || 'Experience the next generation of premium retail. Discover carefully curated collections built for modern living.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#hardware" className="bg-[#4285F4] hover:bg-[#3367D6] text-white tg-mono px-8 py-3 rounded tracking-wider flex items-center justify-center gap-2 transition-colors">
                SHOP_COLLECTION() <ArrowRight size={18} />
              </a>
              <a href="#specs" className="tg-glass text-white tg-mono px-8 py-3 rounded tracking-wider hover:bg-white/5 transition-colors flex items-center justify-center">
                LEARN_MORE
              </a>
            </div>
          </section>
        );

        if (sectionId === 'about') return (
          <section key="about" id="specs" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="tg-glass rounded-xl p-8 md:p-12 border border-[#4285F4]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu size={200} />
              </div>
              <div className="relative z-10 max-w-3xl">
                <h2 className="tg-mono text-sm text-[#4285F4] mb-4">// BRAND_VALUES</h2>
                <h3 className="tg-display text-4xl md:text-5xl font-bold text-white mb-6 break-all sm:break-words whitespace-pre-wrap">
                  {content.settings_json?.about_title || 'BEYOND EXPECTATIONS'}
                </h3>
                <p className="tg-mono text-lg text-[#8ab4f8]/80 leading-relaxed mb-8 break-all sm:break-words whitespace-pre-wrap">
                  {content.settings_json?.about_description || 'We don\'t just sell products. We provide the infrastructure for tomorrow\'s digital realities. Every item is rigorously tested and verified for premium quality.'}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#4285F4]/20 pt-8 mt-8">
                  <div>
                    <div className="tg-display text-3xl font-bold text-white tg-glow-text mb-1">100%</div>
                    <div className="tg-mono text-xs text-[#8ab4f8]/60">PREMIUM</div>
                  </div>
                  <div>
                    <div className="tg-display text-3xl font-bold text-white tg-glow-text mb-1">24/7</div>
                    <div className="tg-mono text-xs text-[#8ab4f8]/60">SUPPORT</div>
                  </div>
                  <div>
                    <div className="tg-display text-3xl font-bold text-white tg-glow-text mb-1">FAST</div>
                    <div className="tg-mono text-xs text-[#8ab4f8]/60">SHIPPING</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

        if (sectionId === 'menu') return (
          <section key="menu" id="hardware" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-end justify-between mb-12 border-b border-[#4285F4]/20 pb-4">
              <div>
                <h2 className="tg-mono text-sm text-[#4285F4] mb-2">// FEATURED_PRODUCTS</h2>
                <h3 className="tg-display text-4xl font-bold text-white">NEW ARRIVALS</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((p: any, i: number) => (
                <div key={i} className="tg-glass rounded-lg overflow-hidden flex flex-col group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-[4/3] bg-black relative overflow-hidden p-6 flex items-center justify-center border-b border-[#4285F4]/20">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(66,133,244,0.3)] group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]/30"></span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="tg-display font-bold text-xl text-white mb-2 flex-1 break-words">{p.name}</h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="tg-mono text-[#4285F4]">{p.price}</span>
                      <ChevronRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length > 0 && (
              <div className="mt-12 text-center flex justify-center">
                <button onClick={() => setShowAllProducts(true)} className="tg-glass text-white tg-mono px-8 py-3 rounded tracking-wider hover:bg-white/5 transition-colors flex items-center gap-2 border border-[#4285F4]/50 hover:border-[#4285F4]">
                  VIEW MORE <ArrowRight size={18} />
                </button>
              </div>
            )}
          </section>
        );

        if (sectionId === 'services') return (
          <section key="services" id="services" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-end justify-between mb-12 border-b border-[#4285F4]/20 pb-4">
              <div>
                <h2 className="tg-mono text-sm text-[#4285F4] mb-2">// OPERATIONS</h2>
                <h3 className="tg-display text-4xl font-bold text-white">OUR SERVICES</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s: any, i: number) => (
                <div key={i} className="tg-glass rounded-lg overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                  {s.image && (
                    <div className="aspect-[16/9] relative overflow-hidden border-b border-[#4285F4]/20">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="tg-display font-bold text-2xl text-white mb-3 break-words">{s.title}</h4>
                    <p className="tg-mono text-[#8ab4f8]/70 leading-relaxed break-words">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

        if (sectionId === 'gallery') return (
          <section key="gallery" id="gallery" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-end justify-between mb-12 border-b border-[#4285F4]/20 pb-4">
              <div>
                <h2 className="tg-mono text-sm text-[#4285F4] mb-2">// VISUAL_DATA</h2>
                <h3 className="tg-display text-4xl font-bold text-white">SYSTEM GALLERY</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-black border border-[#4285F4]/20 overflow-hidden relative group cursor-pointer" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4285F4]/50 flex items-center justify-center transition-colors">
                    <Search size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(66,133,244,0.8)]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

        if (sectionId === 'contact') return (
          <section key="contact" id="contact" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-end justify-between mb-12 border-b border-[#4285F4]/20 pb-4">
              <div>
                <h2 className="tg-mono text-sm text-[#4285F4] mb-2">// COMMS_LINK</h2>
                <h3 className="tg-display text-4xl font-bold text-white">CONTACT HQ</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="tg-glass rounded-xl p-8 md:p-12 border border-[#4285F4]/30">
                <div className="space-y-8">
                  <div>
                    <h4 className="tg-mono text-[#4285F4] mb-2 text-sm">// LOCATION</h4>
                    <p className="tg-display text-2xl text-white font-bold">{content.contact_info?.address || 'Sector 7, Silicon Valley'}</p>
                  </div>
                  <div>
                    <h4 className="tg-mono text-[#4285F4] mb-2 text-sm">// TRANSMISSION</h4>
                    <p className="tg-display text-xl text-white mb-1">{content.contact_info?.email || 'root@nexus.tech'}</p>
                    <p className="tg-display text-xl text-white">{content.contact_info?.phone || '192.168.1.1'}</p>
                  </div>
                  <div>
                    <h4 className="tg-mono text-[#4285F4] mb-2 text-sm">// OPERATING_HOURS</h4>
                    <p className="tg-mono text-[#8ab4f8]/80 leading-relaxed break-words">{content.contact_info?.hours || '09:00 - 18:00 (SYSTEM_TIME)'}</p>
                  </div>
                  <div className="pt-8 border-t border-[#4285F4]/20 flex gap-4">
                    <a href={content.contact_info?.facebook || '#'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] hover:bg-[#4285F4] hover:text-white transition-colors">
                      <Facebook size={20} />
                    </a>
                    <a href={content.contact_info?.instagram || '#'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] hover:bg-[#4285F4] hover:text-white transition-colors">
                      <Instagram size={20} />
                    </a>
                    <a href={content.contact_info?.whatsapp || '#'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] hover:bg-[#4285F4] hover:text-white transition-colors">
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="h-80 lg:h-auto tg-glass rounded-xl border border-[#4285F4]/30 p-2 overflow-hidden relative group">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Silicon Valley')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.2)' }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
            </div>
          </section>
        );

        if (sectionId === 'custom') return (
          <section key="custom" id="custom" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="tg-glass rounded-xl p-8 md:p-16 border border-[#4285F4]/30 text-center">
              {content.custom_blocks_json && content.custom_blocks_json.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-10">
                  {content.custom_blocks_json.map((block: any) => {
                    if (block.type === 'heading') return <h2 key={block.id} className="tg-display text-4xl md:text-5xl font-bold text-white break-words w-full">{block.content}</h2>;
                    if (block.type === 'paragraph') return <p key={block.id} className="tg-mono text-lg text-[#8ab4f8]/80 leading-relaxed break-words whitespace-pre-wrap w-full">{block.content}</p>;
                    if (block.type === 'image') return block.url ? <img key={block.id} src={block.url} alt="" className="w-full h-auto rounded border border-[#4285F4]/20 shadow-[0_0_20px_rgba(66,133,244,0.15)]" /> : null;
                    if (block.type === 'divider') return <div key={block.id} className="w-full h-px bg-gradient-to-r from-transparent via-[#4285F4]/50 to-transparent my-10"></div>;
                    return null;
                  })}
                </div>
              ) : (
                <>
                  <h2 className="tg-mono text-sm text-[#4285F4] mb-4">// CUSTOM_MODULE</h2>
                  <h3 className="tg-display text-4xl md:text-6xl font-bold text-white mb-6 break-words max-w-4xl mx-auto">
                    {content.settings_json?.custom_title || 'PREMIUM EXPERIENCE'}
                  </h3>
                  <p className="tg-mono text-lg text-[#8ab4f8]/80 leading-relaxed mb-8 max-w-2xl mx-auto break-words">
                    {content.settings_json?.custom_description || 'Join our exclusive club. Get VIP access to limited drops and special events.'}
                  </p>
                  <button className="bg-[#4285F4] hover:bg-[#3367D6] text-white tg-mono px-10 py-4 rounded tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(66,133,244,0.4)]">
                    {content.settings_json?.custom_button || 'INITIALIZE'}
                  </button>
                </>
              )}
            </div>
          </section>
        );

        return null;
      })}

      
      
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
      <footer className="relative z-10 border-t border-[#4285F4]/20 mt-auto bg-[#050B14]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {content.settings_json?.logo_image ? (
                <img src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-[#4285F4]" />
              ) : (
                <Cpu className="text-[#4285F4]" size={24} />
              )}
              <span className="tg-display font-bold text-xl tracking-widest text-white uppercase">{siteName}</span>
            </div>
            <p className="tg-mono text-sm text-[#8ab4f8]/60 max-w-sm break-words">Redefining the modern retail experience. Premium products for those who demand excellence.</p>
          </div>
          
          <div>
            <h4 className="tg-mono text-white mb-6 uppercase">// Connect</h4>
            <div className="space-y-3 tg-mono text-sm text-[#8ab4f8]/60">
              <p className="break-words">Email: {content.contact_info?.email || 'root@nexus.tech'}</p>
              <p className="break-words">Ping: {content.contact_info?.phone || '192.168.1.1'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="tg-mono text-white mb-6 uppercase">// Location</h4>
            <p className="tg-mono text-sm text-[#8ab4f8]/60 leading-relaxed break-words">
              {content.contact_info?.address || 'Sector 7, Silicon Valley'}
            </p>
          </div>
        </div>
        
        <div className="border-t border-[#4285F4]/10 py-6 text-center">
          <p className="tg-mono text-xs text-[#8ab4f8]/40">
            SYSTEM VERSION 2.0.4 | &copy; {new Date().getFullYear()} {siteName}
          </p>
        </div>
      </footer>

      {/* All Products Modal */}

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-[#050B14]/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onClick={() => setSelectedProduct(null)}>
          <div className="tg-glass w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hide rounded-xl border border-[#4285F4]/40 flex flex-col md:flex-row relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-50 text-[#8ab4f8] hover:text-white bg-black/50 rounded-full p-1 md:bg-transparent" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            
            <div className="w-full md:w-1/2 p-6 md:p-8 bg-black/50 border-r border-[#4285F4]/20 flex items-center justify-center relative min-h-[200px]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="relative z-10 w-full max-h-48 md:max-h-64 object-contain filter drop-shadow-[0_0_20px_rgba(66,133,244,0.4)]" />
            </div>
            
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <h2 className="tg-display text-3xl md:text-4xl font-bold text-white mb-4 break-words">{selectedProduct.name}</h2>
              <div className="tg-mono text-2xl text-[#4285F4] mb-8 bg-[#4285F4]/10 inline-block px-4 py-2 rounded self-start border border-[#4285F4]/20">
                {selectedProduct.price}
              </div>
              <div className="space-y-4 mb-8">
                <p className="tg-mono text-[#8ab4f8]/80 leading-relaxed break-words">{selectedProduct.description}</p>
                <div className="tg-mono text-xs text-[#8ab4f8]/50 mt-4 border border-[#4285F4]/20 p-3 rounded bg-black/30">
                  STATUS: IN_STOCK<br/>
                  SHIPPING: IMMEDIATE_DISPATCH
                </div>
              </div>
              <button className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white tg-mono py-4 rounded tracking-wider flex items-center justify-center gap-2 transition-colors mt-auto" onClick={() => setSelectedProduct(null)}>
                <ShoppingCart size={18} /> ADD_TO_CART()
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Image Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[110] bg-[#050B14]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 z-50 text-[#8ab4f8] hover:text-white bg-black/50 p-2 rounded-full border border-[#4285F4]/30" onClick={() => setSelectedGalleryImage(null)}>
            <X size={32} />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center relative">
            <img src={selectedGalleryImage} alt="Gallery Full View" className="max-w-full max-h-[90vh] object-contain rounded border border-[#4285F4]/30 shadow-[0_0_30px_rgba(66,133,244,0.3)]" onClick={e => e.stopPropagation()} />
          </div>
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

