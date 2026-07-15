import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Sparkles, ArrowRight, MapPin, Mail, Phone, Heart, Menu, X, MessageCircle, Clock } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function ModernFancyTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'Lumina Accessories';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Crystal Hair Pins', price: '₹299', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Set of 4 elegant crystal embedded hair pins.' },
    { name: 'Rose Gold Watch', price: '₹1499', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', description: 'Minimalist mesh band watch in rose gold.' },
    { name: 'Pearl Drop Earrings', price: '₹450', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Freshwater pearl earrings with sterling silver.' },
    { name: 'Velvet Choker', price: '₹199', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', description: 'Classic black velvet choker with a silver moon charm.' },
    { name: 'Elegant Sun Hat', price: '₹899', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Wide-brim straw hat perfect for summer days.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Personal Styling', description: 'Get a personalized look curated just for you.' },
    { title: 'Fast Delivery', description: 'Free express shipping on all premium orders.' },
    { title: 'Gift Wrapping', description: 'Beautiful premium packaging for your loved ones.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] text-slate-800 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;import ProductBuyButton from '../../payments/ProductBuyButton';
400;600;800&display=swap');
        .font-modern { font-family: 'Poppins', sans-serif; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
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

      {/* Decorative Orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 z-0 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="glass-panel sticky top-4 mx-4 md:mx-auto max-w-6xl rounded-2xl z-50 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          {content.settings_json?.logo_image ? (
            <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 object-cover rounded-full" />
          ) : (
            <Sparkles className="text-purple-500" size={24} />
          )}
          <span className="font-modern text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{siteName}</span>
        </div>

        <nav className="hidden md:flex gap-8 font-modern text-sm font-semibold text-slate-600">
          <a href="#about" onClick={() => setShowAllProducts(false)} className="hover:text-purple-600 transition-colors">About</a>
          <a href="#services" onClick={() => setShowAllProducts(false)} className="hover:text-purple-600 transition-colors">Services</a>
          <a href="#menu" onClick={() => setShowAllProducts(false)} className="hover:text-purple-600 transition-colors">Shop</a>
          <a href="#gallery" onClick={() => setShowAllProducts(false)} className="hover:text-purple-600 transition-colors">Gallery</a>
          <a href="#contact" onClick={() => setShowAllProducts(false)} className="hover:text-purple-600 transition-colors">Contact</a>
        </nav>

        <button
          className="md:hidden text-purple-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-purple-100 rounded-2xl shadow-xl p-4 flex flex-col gap-2 font-modern text-center z-50 md:hidden">
            <a href="#about" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="text-slate-600 hover:text-purple-600 font-semibold py-2 border-b border-purple-50">About</a>
            <a href="#services" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="text-slate-600 hover:text-purple-600 font-semibold py-2 border-b border-purple-50">Services</a>
            <a href="#menu" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="text-slate-600 hover:text-purple-600 font-semibold py-2 border-b border-purple-50">Shop</a>
            <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="text-slate-600 hover:text-purple-600 font-semibold py-2 border-b border-purple-50">Gallery</a>
            <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="text-slate-600 hover:text-purple-600 font-semibold py-2">Contact</a>
          </div>
        )}
      </header>

      <main>
        {!showAllProducts ? (
          <>
            {sectionOrder.map((sectionId: string) => {
              if (hiddenSections.includes(sectionId)) return null;

              if (sectionId === 'hero') return (
                <section key="hero" id="hero" className="relative z-10 pt-32 pb-20 px-6 text-center">
                  <div className="container mx-auto max-w-4xl">
                    <span className="inline-block py-1 px-4 rounded-full bg-white/80 border border-purple-100 text-purple-600 font-modern text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                      New Arrivals Available
                    </span>
                    <h1 className="font-modern text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                      {content.hero_title || 'Elevate Your Everyday Style'}
                    </h1>
                    <p className="font-modern text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                      {content.hero_text || content.about_text || 'Discover a curated collection of trendy accessories, cosmetics, and lifestyle products designed to make you shine.'}
                    </p>
                    <a href="#menu" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-modern font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1">
                      Shop Collection <ArrowRight size={18} />
                    </a>
                  </div>
                </section>
              );

              if (sectionId === 'about') return (
                <section key="about" id="about" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-5xl glass-panel rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                      <h2 className="font-modern text-4xl font-bold text-slate-900 mb-6">{content.settings_json?.about_title || 'About Us'}</h2>
                      <p className="font-modern text-lg text-slate-500 leading-relaxed">
                        {content.settings_json?.about_description || 'We bring you the latest in fashion accessories, blending modern aesthetics with premium quality.'}
                      </p>
                    </div>
                    <div className="flex-1 w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
                      <img loading="lazy" src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" alt="About" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'services') return (
                <section key="services" id="services" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-6xl">
                    <h2 className="font-modern text-4xl font-bold text-center text-slate-900 mb-16">Our Services</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      {services.map((srv: any, idx: number) => {
                        const title = typeof srv === 'string' ? srv : srv.title;
                        const description = typeof srv === 'string' ? '' : srv.description;
                        const image = typeof srv !== 'string' ? srv.image : null;
                        return (
                          <div key={idx} className="glass-panel p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
                            {image && (
                              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-sm">
                                <img loading="lazy" src={image} alt={title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <h3 className="font-modern text-2xl font-bold text-slate-900 mb-4">{title}</h3>
                            <p className="font-modern text-slate-500 leading-relaxed">{description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'menu' || sectionId === 'products') return (
                <section key="menu" id="menu" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-6xl">
                    <h2 className="font-modern text-4xl font-bold text-center text-slate-900 mb-16">Trending Accessories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                      {products.slice(0, 4).map((p: any, i: number) => (
                        <div key={i} className="glass-panel rounded-3xl p-4 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                            <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <button
                              className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full text-slate-400 hover:text-pink-500 transition-colors shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Heart size={18} />
                            </button>
                          </div>
                          <div className="px-2">
                            <h3 className="font-modern font-semibold text-slate-900 mb-1">{p.name}</h3>
                            <div className="font-modern font-bold text-purple-600">{p.price}</div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {products.length > 4 && (
                      <div className="text-center mt-12">
                        <button
                          onClick={() => {
                            setShowAllProducts(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white font-modern font-bold py-3 px-8 rounded-xl transition-all"
                        >
                          View More <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              );

              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-6xl">
                    <h2 className="font-modern text-4xl font-bold text-center text-slate-900 mb-16">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {gallery.map((img: any, idx: number) => {
                        const imgUrl = typeof img === 'string' ? img : img.url;
                        return (
                          <div key={idx} className="glass-panel rounded-2xl overflow-hidden aspect-square hover:scale-105 transition-transform duration-300">
                            <img loading="lazy" src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-6xl">
                    {content.custom_blocks_json.map((block: any, idx: number) => (
                      <div key={idx} className="glass-panel rounded-3xl p-8 md:p-16 mb-12 last:mb-0 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                          <h2 className="font-modern text-4xl font-bold text-slate-900 mb-6">{block.title}</h2>
                          <p className="font-modern text-lg text-slate-500 leading-relaxed whitespace-pre-line">{block.content}</p>
                        </div>
                        {block.image && (
                          <div className="flex-1 w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
                            <img loading="lazy" src={block.image} alt={block.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

              if (sectionId === 'contact') return (
                <section key="contact" id="contact" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-4xl text-center glass-panel rounded-3xl p-12 md:p-16">
                    <h2 className="font-modern text-4xl font-bold text-slate-900 mb-12">Contact Us</h2>
                    <div className="space-y-6 text-slate-600 font-modern text-lg mb-12">
                      <div className="flex justify-center items-center gap-3"><Phone className="text-purple-500" /> {content.contact_info?.phone || '+1 234 567 8900'}</div>
                      <div className="flex justify-center items-center gap-3"><Mail className="text-pink-500" /> {content.contact_info?.email || 'hello@lumina.co'}</div>
                      <div className="flex justify-center items-center gap-3"><MapPin className="text-purple-500" /> {content.contact_info?.address || 'Fashion Street, High Street'}</div>
                      <div className="flex justify-center items-center gap-3"><Clock className="text-pink-500" /> {content.contact_info?.hours || 'Mon-Sun: 11:00 AM - 11:00 PM'}</div>
                    </div>
                    <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-12 shadow-sm">
                      <iframe
                        title="Google Maps"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Fashion Street, High Street')}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex justify-center gap-6">
                      {content.contact_info?.instagram && (
                        <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:text-white transition-all">
                          <Instagram size={20} />
                        </a>
                      )}
                      {content.contact_info?.facebook && (
                        <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:text-white transition-all">
                          <Facebook size={20} />
                        </a>
                      )}
                      {content.contact_info?.whatsapp && (
                        <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:text-white transition-all">
                          <MessageCircle size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </section>
              );

              return null;
            })}
          </>
        ) : (
          <section className="relative z-10 py-32 px-6 min-h-screen">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="font-modern text-4xl md:text-5xl font-bold text-slate-900">All Collection</h2>
                <button
                  onClick={() => {
                    setShowAllProducts(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-purple-600 hover:text-purple-800 font-modern font-bold flex items-center gap-2"
                >
                  &larr; Back to Home
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {products.map((p: any, i: number) => (
                  <div key={i} className="glass-panel rounded-3xl p-4 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                      <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button
                        className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full text-slate-400 hover:text-pink-500 transition-colors shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className="px-2">
                      <h3 className="font-modern font-semibold text-slate-900 mb-1">{p.name}</h3>
                      <div className="font-modern font-bold text-purple-600">{p.price}</div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
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

      {/* Footer */}
      <footer className="relative z-10 bg-white/50 backdrop-blur-md border-t border-white py-16 mt-20">
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              {content.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 object-cover rounded-full" />
              ) : (
                <Sparkles className="text-purple-500" size={24} />
              )}
              <span className="font-modern text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{siteName}</span>
            </div>
            <p className="font-modern text-slate-500 text-sm leading-relaxed max-w-sm">
              {content.settings_json?.about_description || "Your premium destination for modern, trendy, and high-quality fancy items and accessories."}
            </p>
          </div>
          <div className="space-y-4 font-modern text-sm text-slate-600">
            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider">Contact Info</h4>
            <div className="flex items-center gap-3"><Phone size={16} className="text-purple-500" /> {content.contact_info?.phone || '+91 98765 43210'}</div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-pink-500" /> {content.contact_info?.email || 'hello@lumina.co'}</div>
          </div>
          <div className="space-y-4 font-modern text-sm text-slate-600">
            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider">Visit Us</h4>
            <div className="flex items-start gap-3"><MapPin size={16} className="text-purple-500 shrink-0 mt-1" /> <span className="leading-relaxed">{content.contact_info?.address || 'Fashion Street, High Street Mall, Kerala'}</span></div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
