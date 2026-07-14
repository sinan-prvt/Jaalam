import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Sparkles, ArrowRight, X, Heart, MapPin, Mail, Droplet, Clock, MessageCircle, Phone } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function EtherealStationeryTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'Ethereal';

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Crystal Glass Dip Pen', price: '₹1500', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Translucent glass with stardust ink.' },
    { name: 'Cloud Cover Journal', price: '₹950', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: 'Soft, padded cover. Pages like air.' },
    { name: 'Aura Stickers', price: '₹300', image: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=600&q=80', description: 'Holographic gradients for your planner.' },
    { name: 'Pastel Highlighters', price: '₹400', image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80', description: 'Soft, gentle colors that won\'t bleed.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F0E6FA] text-[#4A3B69] font-sans selection:bg-[#B49FCC] selection:text-white relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap');
        .font-ethereal { font-family: 'Outfit', sans-serif; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px 0 rgba(138, 115, 166, 0.15);
        }
        .animated-blob {
          position: absolute;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.6;
          animation: float 20s infinite ease-in-out alternate;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 50px) scale(1.2); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Animated Background Blobs */}
      <div className="animated-blob bg-[#FFD1E8] w-[600px] h-[600px] rounded-full top-[-100px] left-[-100px]"></div>
      <div className="animated-blob bg-[#C6D2FF] w-[500px] h-[500px] rounded-full bottom-[10%] right-[-50px]" style={{ animationDelay: '-5s' }}></div>
      <div className="animated-blob bg-[#E4C8FF] w-[400px] h-[400px] rounded-full top-[40%] left-[30%]" style={{ animationDelay: '-10s' }}></div>

      <div className="relative z-10">
        <header className="fixed top-0 left-0 w-full z-50 p-4 md:p-6">
          <div className="glass-panel rounded-full max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {content.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 object-cover rounded-full" />
              ) : (
                <Sparkles className="text-[#8A73A6]" size={20} />
              )}
              <span className="font-ethereal font-bold text-xl tracking-wide">{siteName}</span>
            </div>
            <nav className="hidden md:flex gap-8 font-ethereal text-sm font-medium items-center">
              <a href="#about" onClick={() => setShowAllProducts(false)} className="hover:text-[#8A73A6] transition-colors">Vision</a>
              <a href="#collection" onClick={() => setShowAllProducts(false)} className="hover:text-[#8A73A6] transition-colors">Treasures</a>
              
              <div className="relative group">
                <button className="hover:text-[#8A73A6] transition-colors focus:outline-none flex items-center gap-1">
                  Explore ▾
                </button>
                <div className="absolute top-full left-0 w-40 glass-panel rounded-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col mt-4 border border-white/50">
                  <a href="#gallery" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-white/50 transition-colors">Gallery</a>
                  <a href="#custom" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-white/50 transition-colors">Custom</a>
                </div>
              </div>
              
              <a href="#contact" onClick={() => setShowAllProducts(false)} className="hover:text-[#8A73A6] transition-colors">Connect</a>
            </nav>
            <button className="md:hidden text-[#8A73A6]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <>
                  <div className="w-6 h-0.5 bg-current mb-1.5 rounded"></div>
                  <div className="w-4 h-0.5 bg-current mb-1.5 rounded ml-auto"></div>
                  <div className="w-6 h-0.5 bg-current rounded"></div>
                </>
              )}
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 glass-panel !bg-white/90 rounded-2xl p-4 flex flex-col gap-2 font-ethereal text-center shadow-xl border border-white/50 z-50 md:hidden">
              <a href="#about" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8A73A6] transition-colors py-2 border-b border-[#8A73A6]/10">Vision</a>
              <a href="#collection" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8A73A6] transition-colors py-2 border-b border-[#8A73A6]/10">Treasures</a>
              <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8A73A6] transition-colors py-2 border-b border-[#8A73A6]/10">Gallery</a>
              <a href="#custom" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8A73A6] transition-colors py-2 border-b border-[#8A73A6]/10">Custom</a>
              <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8A73A6] transition-colors py-2">Connect</a>
            </div>
          )}
        </header>

        <main className="pt-32">
          {!showAllProducts ? (
            <>
              {sectionOrder.map((sectionId: string) => {
                if (hiddenSections.includes(sectionId)) return null;

                if (sectionId === 'hero') return (
                  <section key="hero" className="min-h-[80vh] flex flex-col justify-center px-6 py-12 max-w-5xl mx-auto text-center relative">
                    <div className="inline-flex items-center justify-center gap-2 glass-panel px-4 py-2 rounded-full font-ethereal text-xs font-bold uppercase tracking-widest text-[#8A73A6] mx-auto mb-8">
                      <Droplet size={14} /> New Collection Dropped
                    </div>
                    <h1 className="font-ethereal text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#6A4C93] via-[#B49FCC] to-[#FF9CEE]">
                      {content.hero_title || 'Dreamy Stationery.'}
                    </h1>
                    <p className="font-ethereal text-lg md:text-xl font-light text-[#6A4C93]/80 max-w-2xl mx-auto mb-12">
                      {content.hero_text || content.about_text || 'Enhance your desk space with soft colors, gentle textures, and inspiring tools that make every day feel like a daydream.'}
                    </p>
                  </section>
                );

                if (sectionId === 'about') return (
                  <section key="about" id="about" className="py-24 px-6 max-w-6xl mx-auto">
                    <div className="glass-panel rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
                      <div className="flex-1">
                        <h2 className="font-ethereal text-4xl md:text-5xl font-bold mb-6">{content.settings_json?.about_title || 'Our Vision'}</h2>
                        <p className="font-ethereal text-lg leading-relaxed text-[#6A4C93]/80">
                          {content.settings_json?.about_description || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. We believe your workspace should be a sanctuary of calm and inspiration.'}
                        </p>
                      </div>
                      <div className="flex-1 w-full aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white/50">
                        <img loading="lazy" src="https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=800&q=80" alt="About" className="w-full h-full object-cover filter brightness-110 saturate-50 hue-rotate-15" />
                      </div>
                    </div>
                  </section>
                );

                if (sectionId === 'collection' || sectionId === 'products' || sectionId === 'menu') return (
                  <section key="collection" id="collection" className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="font-ethereal text-4xl md:text-6xl font-bold mb-4">Little Treasures</h2>
                      <p className="font-ethereal text-[#6A4C93]/70">Curated pieces for your aesthetic.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                      {products.slice(0, 4).map((p: any, i: number) => (
                        <div key={i} className="glass-panel rounded-2xl p-4 cursor-pointer group hover:-translate-y-2 transition-transform duration-300" onClick={() => setSelectedProduct(p)}>
                          <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                            <img loading="lazy" src={p.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'} 
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'; }}
                              alt={p.name} 
                              className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-500 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#B49FCC]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          <div className="font-ethereal text-center">
                            <h3 className="font-bold text-lg text-[#6A4C93] mb-1">{p.name}</h3>
                            <div className="text-sm font-medium opacity-70">{p.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="glass-panel hover:bg-white/60 transition-colors rounded-full px-8 py-4 font-ethereal font-bold text-[#6A4C93] inline-flex items-center gap-2"
                      >
                        View Everything <ArrowRight size={18} />
                      </button>
                    </div>
                  </section>
                );

                if (sectionId === 'services') return (
                  <section key="services" id="services" className="py-24 px-6 max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                      {(content.services_json?.length > 0 ? content.services_json : [
                        { title: 'Gift Magic', description: 'Wrapped in iridescent paper with a handwritten note.' },
                        { title: 'Global Post', description: 'Floating to your doorstep anywhere in the world.' },
                        { title: 'Custom Art', description: 'Personalized engravings and custom colorways.' }
                      ]).map((srv: any, idx: number) => {
                        const title = typeof srv === 'string' ? srv : (srv.title || '');
                        const description = typeof srv === 'string' ? '' : (srv.description || '');
                        const image = typeof srv === 'string' ? '' : (srv.image || '');
                        return (
                          <div key={idx} className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer">
                            {image && (
                              <div className="w-16 h-16 mb-6 rounded-2xl overflow-hidden shadow-inner border border-white/30">
                                <img loading="lazy" src={image} alt={title} className="w-full h-full object-cover filter saturate-50 hue-rotate-15" />
                              </div>
                            )}
                            {!image && <Heart className="w-10 h-10 mb-6 text-[#FF9CEE]" />}
                            <h3 className="font-ethereal text-2xl font-bold mb-4">{title}</h3>
                            <p className="font-ethereal text-sm opacity-80 leading-relaxed">{description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );

                if (sectionId === 'contact') return (
                  <section key="contact" id="contact" className="py-24 px-6 max-w-4xl mx-auto text-center">
                    <div className="glass-panel rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9CEE]/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C6D2FF]/20 rounded-full blur-3xl"></div>
                      
                      <h2 className="font-ethereal text-4xl md:text-6xl font-bold mb-8 relative z-10">Say Hello</h2>
                      <div className="space-y-4 font-ethereal text-lg relative z-10 mb-8">
                        <div className="flex items-center justify-center gap-3"><Phone className="text-[#8A73A6]" /> {content.contact_info?.phone || '+1 234 567 8900'}</div>
                        <div className="flex items-center justify-center gap-3"><Mail className="text-[#8A73A6]" /> {content.contact_info?.email || 'hello@ethereal.com'}</div>
                        <div className="flex items-center justify-center gap-3"><MapPin className="text-[#8A73A6]" /> {content.contact_info?.address || 'Cloud Nine, Dream City'}</div>
                        <div className="flex items-center justify-center gap-3"><Clock className="text-[#8A73A6]" /> <span className="whitespace-pre-line">{content.contact_info?.hours || 'Mon-Fri: 10AM - 6PM'}</span></div>
                      </div>
                      
                      <div className="flex justify-center gap-6 relative z-10">
                        {content.contact_info?.instagram && (
                          <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[#8A73A6] hover:text-[#B49FCC] hover:scale-110 transition-all">
                            <Instagram size={20} />
                          </a>
                        )}
                        {content.contact_info?.facebook && (
                          <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[#8A73A6] hover:text-[#B49FCC] hover:scale-110 transition-all">
                            <Facebook size={20} />
                          </a>
                        )}
                        {content.contact_info?.whatsapp && (
                          <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[#8A73A6] hover:text-[#B49FCC] hover:scale-110 transition-all">
                            <MessageCircle size={20} />
                          </a>
                        )}
                      </div>
                      
                      <div className="relative z-10 mt-12 rounded-3xl overflow-hidden glass-panel p-2 shadow-inner border border-white/50">
                        <iframe
                          width="100%"
                          height="300"
                          style={{ border: 0, borderRadius: '1.5rem' }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Cloud Nine, Dream City')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      </div>
                    </div>
                  </section>
                );

                if (sectionId === 'gallery') return (
                  <section key="gallery" id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="font-ethereal text-4xl md:text-6xl font-bold mb-4">Gallery</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {(content.gallery_json?.length > 0 ? content.gallery_json : [
                         'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
                         'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=800&q=80',
                         'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=800&q=80',
                         'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=800&q=80',
                         'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
                         'https://images.unsplash.com/photo-1522881113591-b661eb10a26e?auto=format&fit=crop&w=800&q=80'
                       ]).map((item: any, idx: number) => {
                         const imgUrl = typeof item === 'string' ? item : (item.image || item.url || '');
                         return (
                          <div key={idx} className="glass-panel aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedImage(imgUrl)}>
                            <img loading="lazy" src={imgUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'} 
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'; }}
                              alt={`Gallery ${idx + 1}`} 
                              className="w-full h-full object-cover filter saturate-50 hover:saturate-100 transition-all duration-500" 
                            />
                          </div>
                         );
                       })}
                    </div>
                  </section>
                );

                if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                  <section key="custom" id="custom" className="py-24 px-6 max-w-6xl mx-auto">
                    {content.custom_blocks_json.map((block: any, idx: number) => (
                      <div key={idx} className="glass-panel rounded-[3rem] p-8 md:p-16 mb-12 last:mb-0 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                          <h2 className="font-ethereal text-4xl md:text-5xl font-bold mb-6">{block.title}</h2>
                          <p className="font-ethereal text-lg leading-relaxed text-[#6A4C93]/80 whitespace-pre-line">{block.content}</p>
                        </div>
                        {block.image && (
                          <div className="flex-1 w-full aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white/50">
                            <img loading="lazy" src={block.image} alt={block.title} className="w-full h-full object-cover filter brightness-110 saturate-50 hue-rotate-15" />
                          </div>
                        )}
                      </div>
                    ))}
                  </section>
                );

                return null;
              })}
            </>
          ) : (
            <section className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
              <button 
                onClick={() => { setShowAllProducts(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="mb-12 glass-panel rounded-full px-6 py-2 font-ethereal text-sm font-bold inline-flex items-center gap-2 hover:bg-white/60 transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" /> Go Back
              </button>
              
              <h2 className="font-ethereal text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6A4C93] to-[#B49FCC]">All Treasures</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p: any, i: number) => (
                  <div key={i} className="glass-panel rounded-2xl p-4 cursor-pointer group hover:-translate-y-2 transition-transform duration-300" onClick={() => setSelectedProduct(p)}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                      <img loading="lazy" src={p.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'; }}
                        alt={p.name} 
                        className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-500" 
                      />
                    </div>
                    <div className="font-ethereal text-center">
                      <h3 className="font-bold text-lg text-[#6A4C93] mb-1">{p.name}</h3>
                      <div className="text-sm font-medium opacity-70">{p.price}</div>
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

      <footer className="mt-12 py-8 text-center font-ethereal text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} {siteName}. Floating in the clouds.</p>
        </footer>
      </div>

      {/* Product Details Modal */}
      {/* Gallery Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-white/40 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-2 bg-white/50 rounded-full text-[#6A4C93] hover:bg-white transition-colors">
            <X size={20} />
          </button>
          <img loading="lazy" src={selectedImage} alt="Gallery" className="max-w-full max-h-[90vh] object-contain filter saturate-50 hue-rotate-15 rounded-2xl glass-panel p-2" />
        </div>
      )}
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
