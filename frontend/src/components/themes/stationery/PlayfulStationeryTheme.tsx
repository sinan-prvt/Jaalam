import React, { useState } from 'react';
import { Pencil, Scissors, Search, MapPin, Mail, Phone, Heart, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function PlayfulStationeryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'Doodle & Co.';
  
  const hiddenSections = content.settings_json?.hidden_sections || [];
  const sectionOrder = content.settings_json?.section_order || ['hero', 'about', 'collection', 'services', 'gallery', 'custom', 'contact'];

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Pastel Highlighters', price: '₹199', image: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=600&q=80', description: 'Set of 6 macaron color highlighters.' },
    { name: 'Cute Washi Tapes', price: '₹250', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80', description: 'Decorative tapes for journaling.' },
    { name: 'Spiral Sketchbook', price: '₹350', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: '180gsm paper for all your doodling needs.' },
    { name: 'Kawaii Pencil Case', price: '₹450', image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80', description: 'Spacious and cute plush pencil case.' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-[#4A4A4A] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;600;700&display=swap');
        .font-playful { font-family: 'Fredoka One', cursive; }
        .font-body { font-family: 'Quicksand', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Decorative blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-50 py-6 px-6">
        <div className="container mx-auto bg-white rounded-full shadow-lg px-8 py-4 flex justify-between items-center border-4 border-[#FF6B6B]">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 object-cover rounded-full border-2 border-[#FF6B6B]" />
            ) : (
              <div className="bg-[#FF6B6B] p-2 rounded-full text-white transform -rotate-12"><Pencil size={20} /></div>
            )}
            <span className="font-playful text-2xl text-[#FF6B6B]">{siteName}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 font-playful text-[#4ECDC4]">
            <a href="#about" onClick={() => setShowAllProducts(false)} className="hover:text-[#FF6B6B] hover:scale-110 transition-transform">About</a>
            <a href="#collection" onClick={() => setShowAllProducts(false)} className="hover:text-[#FF6B6B] hover:scale-110 transition-transform">Shop</a>
            
            <div className="relative group">
              <button className="hover:text-[#FF6B6B] hover:scale-110 transition-transform focus:outline-none flex items-center gap-1">
                Explore ▾
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border-4 border-[#FF6B6B] rounded-2xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col mt-4">
                <a href="#gallery" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-[#FFF0F5] hover:text-[#FF6B6B] transition-colors border-b-2 border-gray-100 text-center">Gallery</a>
                <a href="#custom" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-[#FFF0F5] hover:text-[#FF6B6B] transition-colors text-center">Custom Blocks</a>
              </div>
            </div>
            
            <a href="#contact" onClick={() => setShowAllProducts(false)} className="hover:text-[#FF6B6B] hover:scale-110 transition-transform">Contact</a>
          </nav>
          
          <button 
            className="md:hidden text-[#FF6B6B] p-2 bg-[#FFF0F5] rounded-full border-2 border-[#FF6B6B]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-6 right-6 bg-white border-4 border-[#FF6B6B] rounded-3xl shadow-xl z-40 mt-2 p-6 flex flex-col gap-4 font-playful text-xl text-center text-[#4ECDC4]">
            <a href="#about" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#FF6B6B]">About</a>
            <a href="#collection" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#FF6B6B]">Shop</a>
            <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#FF6B6B]">Gallery</a>
            <a href="#custom" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#FF6B6B]">Custom</a>
            <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#FF6B6B]">Contact</a>
          </div>
        )}
      </header>

      <main>
        {!showAllProducts ? (
          <>
            {sectionOrder.map((sectionId: string) => {
              if (hiddenSections.includes(sectionId)) return null;

              if (sectionId === 'hero') return (
                <section key="hero" className="relative z-10 py-20 px-6 text-center">
                  <div className="container mx-auto max-w-4xl">
                    <div className="inline-block bg-[#4ECDC4] text-white font-playful px-6 py-2 rounded-full mb-8 transform rotate-3 shadow-md">
                      New Collection is here! 🎉
                    </div>
                    <h1 className="font-playful text-6xl md:text-8xl text-[#2D3142] mb-8 leading-tight">
                      {content.hero_title || 'Make Your Desk Happy!'}
                    </h1>
                    <p className="font-body font-bold text-xl text-[#4A4A4A] mb-12 max-w-2xl mx-auto">
                      {content.hero_text || content.about_text || 'Super cute stationery, colorful pens, and everything you need to make studying and working fun.'}
                    </p>
                    <button onClick={() => setShowAllProducts(true)} className="inline-block bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-playful text-xl py-4 px-12 rounded-full shadow-[0_8px_0_#c0392b] active:translate-y-2 active:shadow-none transition-all">
                      Start Shopping
                    </button>
                  </div>
                </section>
              );

              if (sectionId === 'about') return (
                <section key="about" id="about" className="py-20 px-6 relative z-10">
                  <div className="container mx-auto max-w-4xl text-center bg-white rounded-3xl p-12 shadow-xl border-4 border-[#FF6B6B]">
                    <h2 className="font-playful text-3xl md:text-5xl text-[#2D3142] mb-6">{content.settings_json?.about_title || 'About Us'}</h2>
                    <p className="font-body text-lg font-bold text-[#4A4A4A] leading-relaxed">
                      {content.settings_json?.about_description || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. Our curated collections are designed to inspire.'}
                    </p>
                  </div>
                </section>
              );

              if (sectionId === 'services') return (
                <section key="services" id="services" className="py-20 px-6 relative z-10">
                  <div className="container mx-auto max-w-6xl">
                    <h2 className="font-playful text-3xl md:text-5xl text-[#2D3142] text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
                      Our Services
                      <div className="absolute -bottom-4 left-0 w-full h-2 bg-[#4ECDC4] rounded-full transform rotate-2"></div>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      {(content.services_json?.length > 0 ? content.services_json : [
                        { title: 'Custom Orders', description: 'Personalized stationery tailored to your exact specifications.' },
                        { title: 'Bulk Orders', description: 'Premium supplies for your entire team or office space.' },
                        { title: 'Gift Wrapping', description: 'Beautiful, elegant wrapping for those special occasions.' }
                      ]).map((srv: any, idx: number) => {
                        const title = typeof srv === 'string' ? srv : (srv.title || '');
                        const description = typeof srv === 'string' ? '' : (srv.description || '');
                        const image = typeof srv === 'string' ? '' : (srv.image || '');
                        const colors = ['border-[#4ECDC4]', 'border-[#FF6B6B]', 'border-yellow-400'];
                        const colorClass = colors[idx % colors.length];
                        
                        return (
                          <div key={idx} className={`p-8 bg-white rounded-3xl border-4 ${colorClass} hover:-translate-y-4 hover:shadow-2xl transition-all cursor-pointer`}>
                            {image && (
                              <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden border-2 border-dashed border-gray-200">
                                <img src={image} alt={title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <h3 className="font-playful text-2xl text-[#2D3142] mb-4">{title}</h3>
                            <p className="font-body font-bold text-[#4A4A4A]">{description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'collection' || sectionId === 'products' || sectionId === 'menu') return (
                <section key="collection" id="collection" className="relative z-10 py-20 px-6">
                  <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16 relative">
                      <h2 className="font-playful text-4xl text-[#2D3142] inline-block relative">
                        Trending Items
                        <div className="absolute -bottom-4 left-0 w-full h-2 bg-yellow-400 rounded-full transform -rotate-2"></div>
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                      {products.slice(0, 4).map((p: any, i: number) => (
                        <div key={i} className="bg-white rounded-3xl p-4 border-4 border-[#4ECDC4] hover:-translate-y-4 hover:shadow-2xl transition-all cursor-pointer" onClick={() => setSelectedProduct(p)}>
                          <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 border-2 border-dashed border-gray-200">
                            <img 
                              src={p.image || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80'} 
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80'; }}
                              alt={p.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <h3 className="font-playful text-lg text-[#2D3142] mb-2">{p.name}</h3>
                          <div className="flex justify-between items-center">
                            <span className="font-body font-bold text-xl text-[#FF6B6B]">{p.price}</span>
                            <button className="bg-yellow-400 p-2 rounded-full text-white hover:bg-yellow-500" onClick={(e) => { e.stopPropagation(); }}><Heart size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center mt-12">
                      <button 
                        onClick={() => { setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="inline-flex items-center gap-2 bg-[#2D3142] hover:bg-[#1a1c26] text-white font-playful text-lg py-4 px-8 rounded-full shadow-[0_6px_0_#000] active:translate-y-2 active:shadow-none transition-all"
                      >
                        View Everything <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="py-20 px-6 relative z-10">
                  <div className="container mx-auto max-w-6xl">
                    <h2 className="font-playful text-3xl md:text-5xl text-[#2D3142] text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
                      Gallery
                      <div className="absolute -bottom-4 left-0 w-full h-2 bg-yellow-400 rounded-full transform -rotate-1"></div>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                       {(content.gallery_json?.length > 0 ? content.gallery_json : [
                         'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
                         'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=400&q=80',
                         'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=400&q=80',
                         'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=400&q=80',
                         'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80',
                         'https://images.unsplash.com/photo-1522881113591-b661eb10a26e?auto=format&fit=crop&w=400&q=80'
                       ]).map((item: any, idx: number) => {
                         const imgUrl = typeof item === 'string' ? item : (item.image || item.url || '');
                         return (
                          <div key={idx} className="aspect-square overflow-hidden rounded-3xl border-4 border-[#4ECDC4] cursor-pointer group" onClick={() => setSelectedImage(imgUrl)}>
                            <img 
                              src={imgUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'} 
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'; }}
                              alt={`Gallery ${idx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                          </div>
                         );
                       })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="py-24 px-6 relative z-10">
                  <div className="container mx-auto max-w-5xl">
                    {content.custom_blocks_json.map((block: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-[3rem] p-8 md:p-16 mb-16 shadow-xl border-4 border-[#4ECDC4] flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="font-playful text-3xl md:text-5xl text-[#2D3142] mb-6">{block.title}</h2>
                          <p className="font-body font-bold text-lg text-[#4A4A4A] leading-relaxed whitespace-pre-line">{block.content}</p>
                        </div>
                        {block.image && (
                          <div className="w-full md:w-1/2 aspect-square rounded-3xl overflow-hidden border-4 border-yellow-400 transform rotate-3">
                            <img src={block.image} alt={block.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

              if (sectionId === 'contact') return (
                <section key="contact" id="contact" className="py-20 px-6 relative z-10">
                  <div className="container mx-auto max-w-6xl bg-white rounded-[3rem] p-12 shadow-xl border-4 border-[#FF6B6B]">
                    <h2 className="font-playful text-3xl md:text-5xl text-[#2D3142] text-center mb-16">Contact & Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-8 font-body font-bold text-[#4A4A4A]">
                        <h3 className="font-playful text-2xl text-[#2D3142] mb-4">Get in Touch</h3>
                        <div className="flex items-center gap-4 text-lg">
                          <span className="text-2xl">📞</span> 
                          <span>{content.contact_info?.phone || '+91 98765 43210'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-lg">
                          <span className="text-2xl">✉️</span> 
                          <span>{content.contact_info?.email || 'hello@stationery.com'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-lg">
                          <span className="text-2xl">📍</span> 
                          <span>{content.contact_info?.address || '123 Paper Street, Design District'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-lg">
                          <span className="text-2xl">⏰</span> 
                          <span className="whitespace-pre-line">{content.contact_info?.hours || 'Mon-Fri: 9AM - 6PM'}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t-2 border-dashed border-gray-200">
                          {content.contact_info?.facebook && (
                            <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FFF0F5] text-[#FF6B6B] rounded-full flex items-center justify-center border-2 border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors">
                              <Facebook size={20} />
                            </a>
                          )}
                          {content.contact_info?.instagram && (
                            <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FFF0F5] text-[#FF6B6B] rounded-full flex items-center justify-center border-2 border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors">
                              <Instagram size={20} />
                            </a>
                          )}
                          {content.contact_info?.whatsapp && (
                            <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FFF0F5] text-[#FF6B6B] rounded-full flex items-center justify-center border-2 border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors">
                              <MessageCircle size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="h-80 md:h-full min-h-[300px] border-4 border-[#4ECDC4] rounded-3xl overflow-hidden relative">
                        <iframe 
                          src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || content.address || 'Tokyo')}&output=embed`}
                          className="absolute inset-0 w-full h-full border-0" 
                          allowFullScreen={false} 
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </section>
              );

              return null;
            })}
          </>
        ) : (
          <section className="py-20 px-6 relative z-10">
            <div className="container mx-auto max-w-6xl">
              <button 
                onClick={() => { setShowAllProducts(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="mb-8 inline-flex items-center gap-2 bg-white text-[#FF6B6B] font-playful border-4 border-[#FF6B6B] px-6 py-2 rounded-full hover:bg-[#FFF0F5] transition-colors shadow-[0_4px_0_#FF6B6B] active:translate-y-1 active:shadow-none"
              >
                <ArrowRight size={20} className="rotate-180" /> Back to Home
              </button>
              
              <h2 className="font-playful text-4xl md:text-6xl text-[#2D3142] mb-16 text-center">All Cute Stuff!</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((p: any, i: number) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border-4 border-[#4ECDC4] hover:-translate-y-4 hover:shadow-2xl transition-all cursor-pointer" onClick={() => setSelectedProduct(p)}>
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 border-2 border-dashed border-gray-200">
                      <img 
                        src={p.image || 'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80'} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80'; }}
                        alt={p.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h3 className="font-playful text-lg text-[#2D3142] mb-2">{p.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-body font-bold text-xl text-[#FF6B6B]">{p.price}</span>
                      <button className="bg-yellow-400 p-2 rounded-full text-white hover:bg-yellow-500" onClick={(e) => { e.stopPropagation(); }}><Heart size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#2D3142] text-white py-16 mt-20 rounded-t-[3rem]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="font-playful text-4xl text-yellow-400 mb-8 block">{siteName}</span>
          <div className="flex flex-col md:flex-row justify-center gap-8 font-body font-bold text-lg mb-12">
            <div className="flex items-center justify-center gap-2"><Phone className="text-[#FF6B6B]" /> {content.contact_info?.phone || 'Call Us: 98765 43210'}</div>
            <div className="flex items-center justify-center gap-2"><Mail className="text-[#4ECDC4]" /> {content.contact_info?.email || 'hello@doodleco.in'}</div>
          </div>
          <p className="font-body text-gray-400">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2D3142]/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-3xl rounded-[2rem] overflow-hidden border-8 border-[#4ECDC4] shadow-2xl flex flex-col md:flex-row max-h-[85vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 aspect-square p-4 md:p-6">
              <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-dashed border-gray-200">
                <img 
                  src={selectedProduct.image || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80'} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 relative flex flex-col justify-center">
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 right-4 p-2 bg-[#FFF0F5] text-[#FF6B6B] rounded-full border-2 border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
              
              <div className="inline-block bg-yellow-400 text-white font-playful px-4 py-1 rounded-full text-xs mb-3 w-max transform -rotate-2">Featured Item!</div>
              <h2 className="font-playful text-3xl text-[#2D3142] mb-3 leading-tight">{selectedProduct.name}</h2>
              <div className="font-body font-bold text-2xl text-[#FF6B6B] mb-4">{selectedProduct.price}</div>
              
              <p className="font-body font-bold text-[#4A4A4A] leading-relaxed text-sm md:text-base">
                {selectedProduct.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#2D3142]/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button 
            onClick={() => setSelectedImage(null)} 
            className="absolute top-6 right-6 p-4 bg-yellow-400 text-white rounded-full border-4 border-white hover:scale-110 transition-transform shadow-lg"
          >
            <X size={24} strokeWidth={4} />
          </button>
          <img src={selectedImage} alt="Gallery" className="max-w-full max-h-[85vh] object-contain rounded-3xl border-8 border-white shadow-2xl transform rotate-1" />
        </div>
      )}
    </div>
  );
}
