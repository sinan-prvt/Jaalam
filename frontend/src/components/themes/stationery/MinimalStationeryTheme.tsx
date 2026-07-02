import React, { useState } from 'react';
import { Menu, X, ArrowRight, MessageCircle } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function MinimalStationeryTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'MINIMAL';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Monolith Notebook', price: '₹1200', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Pure black edges. 120gsm unlined paper. Distraction-free.' },
    { name: 'Titanium Pen', price: '₹4500', image: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=600&q=80', description: 'Machined from a single block of titanium. Perfectly balanced.' },
    { name: 'Architect Scale', price: '₹1800', image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80', description: 'Matte aluminum. Precision engraved.' },
    { name: 'Blank Canvas', price: '₹800', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: 'A5 sketchpad. Bleed-proof paper.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&display=swap');
        .font-minimal { font-family: 'Inter', sans-serif; }
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
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4 z-50">
            {content.settings_json?.logo_image && (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 object-cover rounded-full" />
            )}
            <span className="font-minimal font-extrabold text-xl tracking-tighter uppercase">{siteName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-10 font-minimal text-xs font-semibold tracking-widest uppercase">
            <a href="#about" onClick={() => setShowAllProducts(false)} className="hover:opacity-50 transition-opacity">About</a>
            <a href="#collection" onClick={() => setShowAllProducts(false)} className="hover:opacity-50 transition-opacity">Object</a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:opacity-50 transition-opacity py-2 focus:outline-none">
                Explore <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="absolute top-full left-0 w-40 bg-white border border-black shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col">
                <a href="#gallery" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-black hover:text-white transition-colors text-left border-b border-gray-100">Gallery</a>
                <a href="#custom" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-black hover:text-white transition-colors text-left">Custom</a>
              </div>
            </div>
            <a href="#contact" onClick={() => setShowAllProducts(false)} className="hover:opacity-50 transition-opacity">Contact</a>
          </nav>

          <button className="md:hidden z-50 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center gap-8 font-minimal text-2xl font-bold tracking-tighter uppercase pt-20">
          <a href="#about" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-gray-500">About</a>
          <a href="#collection" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-gray-500">Object</a>
          <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-gray-500">Gallery</a>
          <a href="#custom" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-gray-500">Custom</a>
          <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-gray-500">Contact</a>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20">
        {!showAllProducts ? (
          <>
            {sectionOrder.map((sectionId: string) => {
              if (hiddenSections.includes(sectionId)) return null;

              if (sectionId === 'hero') return (
                <section key="hero" className="min-h-[85vh] flex flex-col justify-center px-6 py-20 max-w-7xl mx-auto">
                  <h1 className="font-minimal text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.9] mb-8">
                    {content.hero_title || 'ESSENTIAL\nTOOLS\nFOR\nTHOUGHT.'}
                  </h1>
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between border-t border-black pt-8">
                    <p className="font-minimal text-lg md:text-xl font-light max-w-md text-gray-600">
                      {content.about_text || 'Premium, functional, and beautifully designed stationery for the modern workspace. Stripped of all the unnecessary.'}
                    </p>
                    <a href="#collection" className="inline-flex items-center gap-2 font-minimal text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
                      Discover <ArrowRight size={16} />
                    </a>
                  </div>
                </section>
              );

              if (sectionId === 'about') return (
                <section key="about" id="about" className="py-32 px-6 bg-black text-white">
                  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                    <h2 className="font-minimal text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                      {content.settings_json?.about_title || 'REMOVING THE NOISE.'}
                    </h2>
                    <p className="font-minimal text-xl font-light text-gray-400 leading-relaxed">
                      {content.settings_json?.about_description || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. We believe in subtraction. When you remove the unnecessary, what remains is essential.'}
                    </p>
                  </div>
                </section>
              );

              if (sectionId === 'services') return (
                <section key="services" id="services" className="py-32 px-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-y-16 gap-x-8 border-t border-black pt-16">
                      {(content.services_json?.length > 0 ? content.services_json : [
                        { title: 'Bespoke', description: 'Tailored specifically to your uncompromising standards.' },
                        { title: 'Corporate', description: 'Elevate your entire workspace aesthetic seamlessly.' },
                        { title: 'Global', description: 'Shipping worldwide, packaged with absolute minimal waste.' }
                      ]).map((srv: any, idx: number) => {
                        const title = typeof srv === 'string' ? srv : (srv.title || '');
                        const description = typeof srv === 'string' ? '' : (srv.description || '');
                        const image = typeof srv === 'string' ? '' : (srv.image || '');
                        return (
                          <div key={idx} className="group">
                            {image && (
                              <div className="w-16 h-16 mb-6 rounded-none overflow-hidden bg-gray-100 filter grayscale">
                                <img src={image} alt={title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <h3 className="font-minimal text-2xl font-bold tracking-tighter mb-4">{title}</h3>
                            <p className="font-minimal text-sm text-gray-500 max-w-xs">{description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'collection' || sectionId === 'products' || sectionId === 'menu') return (
                <section key="collection" id="collection" className="py-32 px-6 bg-gray-50">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16 border-b border-black pb-8">
                      <h2 className="font-minimal text-4xl md:text-6xl font-extrabold tracking-tighter">OBJECTS</h2>
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="font-minimal text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
                      >
                        View All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {products.slice(0, 4).map((p: any, i: number) => (
                        <div key={i} className="group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                          <div className="aspect-[3/4] bg-gray-200 mb-6 overflow-hidden">
                            <img 
                              src={p.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'} 
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'; }}
                              alt={p.name} 
                              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                            />
                          </div>
                          <div className="flex justify-between items-start font-minimal">
                            <h3 className="font-bold text-sm uppercase tracking-wider">{p.name}</h3>
                            <span className="text-sm text-gray-500">{p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="py-32 px-6">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="font-minimal text-4xl md:text-6xl font-extrabold tracking-tighter mb-16 border-b border-black pb-8">EXHIBIT</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
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
                          <div key={idx} className="aspect-square overflow-hidden cursor-pointer group bg-gray-100" onClick={() => setSelectedImage(imgUrl)}>
                            <img 
                              src={imgUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'} 
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'; }}
                              alt={`Gallery ${idx + 1}`} 
                              className="w-full h-full object-cover filter grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700" 
                            />
                          </div>
                         );
                       })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'contact') return (
                <section key="contact" id="contact" className="py-32 px-6 bg-black text-white">
                  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                    <div>
                      <h2 className="font-minimal text-4xl md:text-6xl font-extrabold tracking-tighter mb-8">INITIATE.</h2>
                      <div className="space-y-6 font-minimal text-sm uppercase tracking-widest text-gray-400">
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-800 pb-2 gap-2">
                          <span className="text-white shrink-0">EMAIL</span> 
                          <span className="sm:text-right break-all">{content.contact_info?.email || 'studio@minimal.com'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-800 pb-2 gap-2">
                          <span className="text-white shrink-0">PHONE</span> 
                          <span className="sm:text-right break-words">{content.contact_info?.phone || '+1 234 567 890'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-800 pb-2 gap-2">
                          <span className="text-white shrink-0">STUDIO</span> 
                          <span className="sm:text-right break-words">{content.contact_info?.address || '101 Nowhere St, Void City'}</span>
                        </div>
                        
                        {(content.contact_info?.hours || content.settings_json?.office_hours) && (
                          <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-800 pb-2 gap-2">
                            <span className="text-white shrink-0">HOURS</span> 
                            <span className="sm:text-right break-words whitespace-pre-line">{content.contact_info?.hours || content.settings_json?.office_hours}</span>
                          </div>
                        )}
                        
                        {(content.social_links?.facebook || content.social_links?.instagram || content.social_links?.whatsapp) && (
                           <div className="flex justify-start sm:justify-end gap-6 pt-4 border-b border-gray-800 pb-4">
                             {content.social_links?.facebook && (
                               <a href={content.social_links.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors">
                                 <Facebook size={24} />
                               </a>
                             )}
                             {content.social_links?.instagram && (
                               <a href={content.social_links.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors">
                                 <Instagram size={24} />
                               </a>
                             )}
                             {content.social_links?.whatsapp && (
                               <a href={`https://wa.me/${content.social_links.whatsapp}`} target="_blank" rel="noreferrer" className="text-white hover:text-gray-400 transition-colors">
                                 <MessageCircle size={24} />
                               </a>
                             )}
                           </div>
                        )}
                      </div>
                    </div>
                    <div className="aspect-[4/3] bg-gray-900 overflow-hidden relative">
                      <iframe 
                        src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || content.address || 'Tokyo')}&output=embed`}
                        className="w-full h-full border-0 filter grayscale opacity-80" 
                        allowFullScreen={false} 
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="py-32 px-6 bg-white border-t border-black">
                  <div className="max-w-7xl mx-auto">
                    {content.custom_blocks_json.map((block: any, idx: number) => (
                      <div key={idx} className="mb-24 last:mb-0">
                        <h2 className="font-minimal text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 uppercase">{block.title}</h2>
                        <div className="grid md:grid-cols-2 gap-16">
                          <p className="font-minimal text-xl font-light text-gray-600 leading-relaxed whitespace-pre-line">{block.content}</p>
                          {block.image && (
                            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                              <img src={block.image} alt={block.title} className="w-full h-full object-cover filter grayscale" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

              return null;
            })}
          </>
        ) : (
          <section className="py-32 px-6 max-w-7xl mx-auto min-h-screen">
            <button 
              onClick={() => { setShowAllProducts(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mb-16 flex items-center gap-2 font-minimal text-xs font-bold uppercase tracking-widest hover:-translate-x-2 transition-transform"
            >
              <ArrowRight size={16} className="rotate-180" /> Back
            </button>
            <h2 className="font-minimal text-6xl md:text-8xl font-extrabold tracking-tighter mb-16 border-b border-black pb-8">ALL OBJECTS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((p: any, i: number) => (
                <div key={i} className="group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-[3/4] bg-gray-100 mb-6 overflow-hidden">
                    <img 
                      src={p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                      alt={p.name} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <div className="font-minimal">
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-1">{p.name}</h3>
                    <div className="text-sm text-gray-500">{p.price}</div>
                  </div>
                </div>
              ))}
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-minimal text-xs font-bold uppercase tracking-widest text-gray-500">
          <div>&copy; {new Date().getFullYear()} {siteName}.</div>
          <div className="flex items-center gap-6">
            <a href={content.social_links?.whatsapp ? `https://wa.me/${content.social_links.whatsapp}` : "#"} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href={content.social_links?.instagram || "#"} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
              <Instagram size={20} />
            </a>
            <a href={content.social_links?.facebook || "#"} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 bg-white/90 backdrop-blur-md" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full h-full md:h-auto md:max-h-[80vh] max-w-5xl flex flex-col md:flex-row shadow-2xl border border-gray-100 overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-12 md:p-24 relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 md:hidden text-black">
                <X size={24} />
              </button>
              <div className="w-full aspect-square filter grayscale contrast-125 mix-blend-multiply">
                <img 
                  src={selectedProduct.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-12 right-12 hidden md:block text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
              <div className="font-minimal text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Item Details</div>
              <h2 className="font-minimal text-4xl md:text-5xl font-black tracking-tighter mb-4">{selectedProduct.name}</h2>
              <div className="font-minimal text-2xl mb-8">{selectedProduct.price}</div>
              <p className="font-minimal text-lg leading-relaxed text-gray-600 mb-8 max-w-md">
                {selectedProduct.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity">
            <X size={32} />
          </button>
          <img src={selectedImage} alt="Gallery" className="max-w-full max-h-[90vh] object-contain filter grayscale" />
        </div>
      )}
    </div>
  );
}
