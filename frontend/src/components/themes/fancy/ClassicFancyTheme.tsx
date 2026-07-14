import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Sparkles, MapPin, Mail, Phone, Diamond, Menu, X, Clock } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Twitter = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

export default function ClassicFancyTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'The Classic Collection';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Plan Choker Set', price: '₹3,500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Traditional heavy kundan choker with earrings.' },
    { name: 'Bridal Bindi Collection', price: '₹450', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Handcrafted stone bindis for special occasions.' },
    { name: 'Gold Plated Bangles', price: '₹1,200', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Set of 4 intricately designed bangles.' },
    { name: 'Embroidered Potli Bag', price: '₹850', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: 'Silk potli bag with pearl tassels.' },
    { name: 'Elegant Sun Hat', price: '₹899', image: 'https://images.unsplash.com/photo-1521369909029-2afed882ba28?auto=format&fit=crop&w=600&q=80', description: 'Wide-brim straw hat perfect for summer days.' }
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
    <div className="min-h-screen theme-root flex flex-col bg-[#FDF8F5] text-[#3D2B1F] font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-classic { font-family: 'Libre Baskerville', serif; }
        .font-sans { font-family: 'Lato', sans-serif; }
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
      <header className="bg-white border-b-2 border-[#D9C5B2] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between md:justify-center items-center">
            <div className="flex items-center gap-3 text-[#8C3A3A] md:mb-4">
              {content.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="h-8 object-contain" />
              ) : (
                <Diamond size={24} />
              )}
              <span className="font-classic text-2xl md:text-3xl font-bold">{siteName}</span>
            </div>
            <button
              className="md:hidden text-[#8C3A3A]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <nav className="hidden md:flex justify-center gap-8 font-sans text-xs md:text-sm tracking-[0.1em] md:tracking-[0.2em] uppercase text-[#6B5A4E]">
            <a href="#about" onClick={() => setShowAllProducts(false)} className="hover:text-[#8C3A3A] transition-colors whitespace-nowrap">About</a>
            <a href="#services" onClick={() => setShowAllProducts(false)} className="hover:text-[#8C3A3A] transition-colors whitespace-nowrap">Services</a>
            <a href="#menu" onClick={() => setShowAllProducts(false)} className="hover:text-[#8C3A3A] transition-colors whitespace-nowrap">Collection</a>
            <a href="#gallery" onClick={() => setShowAllProducts(false)} className="hover:text-[#8C3A3A] transition-colors whitespace-nowrap">Gallery</a>
            <a href="#contact" onClick={() => setShowAllProducts(false)} className="hover:text-[#8C3A3A] transition-colors whitespace-nowrap">Contact</a>
          </nav>

          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-[#D9C5B2] flex flex-col gap-4 font-sans text-sm tracking-[0.2em] uppercase text-[#6B5A4E] text-center">
              <a href="#about" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8C3A3A] transition-colors">About</a>
              <a href="#services" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8C3A3A] transition-colors">Services</a>
              <a href="#menu" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8C3A3A] transition-colors">Collection</a>
              <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8C3A3A] transition-colors">Gallery</a>
              <a href="#contact" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="hover:text-[#8C3A3A] transition-colors">Contact</a>
            </nav>
          )}
        </div>
      </header>

      <main>
        {!showAllProducts ? (
          <>
            {sectionOrder.map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="relative py-24 px-6 overflow-hidden">
              <div className="container mx-auto max-w-4xl text-center relative z-10">
                <p className="font-sans text-[#8C3A3A] tracking-[0.3em] uppercase text-xs mb-6 font-bold">Bridal & Imitation Jewelry</p>
                <h1 className="font-classic text-5xl md:text-7xl font-bold mb-8 leading-tight text-[#2B1B12]">
                  {content.hero_title || 'Timeless Beauty & Elegance'}
                </h1>
                <div className="w-24 h-[2px] bg-[#D9C5B2] mx-auto mb-8"></div>
                <p className="font-classic italic text-lg text-[#6B5A4E] mb-12 max-w-2xl mx-auto leading-relaxed">
                  {content.hero_description || content.settings_json?.hero_description || content.about_text || content.hero_text || 'An exquisite collection of traditional imitation jewelry, imported cosmetics, and fancy accessories for your most cherished moments.'}
                </p>
                <img loading="lazy" src={content.hero_image || "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=80"} alt="Classic Fancy Store" className="w-full h-96 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm" />
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-24 px-6 bg-white border-y border-[#D9C5B2]/50">
              <div className="container mx-auto max-w-5xl">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="md:w-1/2">
                    <h2 className="font-classic text-4xl text-[#2B1B12] mb-6">{content.settings_json?.about_title || content.about_title || 'Our Heritage'}</h2>
                    <div className="w-16 h-[2px] bg-[#8C3A3A] mb-8"></div>
                    <p className="font-sans text-[#6B5A4E] leading-relaxed mb-6 whitespace-pre-line">
                      {content.settings_json?.about_description || content.about_description || 'Welcome to a world of classic beauty. We have been curating the finest imitation jewelry and imported cosmetics since our inception, focusing on timeless elegance.'}
                    </p>
                  </div>
                  <div className="md:w-1/2 w-full">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm border-8 border-[#FDF8F5] shadow-lg">
                      <img loading="lazy" src={content.about_image || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"} alt="About Us" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-24 px-6">
              <div className="container mx-auto max-w-6xl text-center">
                <h2 className="font-classic text-4xl text-[#2B1B12] mb-6">Our Services</h2>
                <div className="w-16 h-[2px] bg-[#8C3A3A] mx-auto mb-16"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {services.map((srv: any, idx: number) => {
                    const title = typeof srv === 'string' ? srv : srv.title;
                    const description = typeof srv === 'string' ? '' : srv.description;
                    const image = typeof srv !== 'string' ? srv.image : null;
                    return (
                      <div key={idx} className="bg-white p-12 border border-[#E8DFD8] hover:border-[#8C3A3A] transition-colors group">
                        {image ? (
                          <div className="w-24 h-24 mx-auto mb-6 overflow-hidden rounded-full border-4 border-[#FDF8F5] shadow-sm">
                            <img loading="lazy" src={image} alt={title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <Diamond className="text-[#D9C5B2] group-hover:text-[#8C3A3A] mx-auto mb-6 transition-colors" size={32} />
                        )}
                        <h3 className="font-classic text-xl font-bold text-[#2B1B12] mb-4">{title}</h3>
                        <p className="font-sans text-[#6B5A4E] leading-relaxed">{description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="menu" className="py-24 bg-white border-y border-[#D9C5B2]/50">
              <div className="container mx-auto px-6 max-w-6xl">
                <h2 className="font-classic text-4xl text-center mb-6 text-[#2B1B12]">Our Collection</h2>
                <div className="w-16 h-[2px] bg-[#8C3A3A] mx-auto mb-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} className="flex gap-6 items-center group cursor-pointer bg-[#FDF8F5] p-4 border border-[#E8DFD8] hover:border-[#8C3A3A] transition-colors" onClick={() => setSelectedProduct(p)}>
                      <div className="w-1/2 aspect-square overflow-hidden bg-white">
                        <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="w-1/2 flex flex-col justify-center">
                        <h3 className="font-classic text-xl font-bold text-[#2B1B12] mb-2 leading-snug">{p.name}</h3>
                        <div className="font-sans font-bold tracking-widest text-[#8C3A3A] mb-4">{p.price}</div>
                        <p className="font-sans text-sm text-[#6B5A4E] leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length > 4 && (
                  <div className="text-center mt-16">
                    <button 
                      onClick={() => {
                        setShowAllProducts(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-block bg-[#FDF8F5] border border-[#8C3A3A] text-[#8C3A3A] hover:bg-[#8C3A3A] hover:text-white font-sans font-bold tracking-widest uppercase py-4 px-8 transition-colors"
                    >
                      View More
                    </button>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-24 px-6">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-classic text-4xl text-center text-[#2B1B12] mb-6">Gallery</h2>
                <div className="w-16 h-[2px] bg-[#8C3A3A] mx-auto mb-16"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {gallery.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <div key={idx} className="aspect-square overflow-hidden border-4 border-white shadow-md cursor-pointer" onClick={() => setSelectedGalleryImage(imgUrl)}>
                        <img loading="lazy" src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-24 px-6 bg-white border-y border-[#D9C5B2]/50">
              <div className="container mx-auto max-w-6xl">
                {content.custom_blocks_json.map((block: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-12 items-center mb-20 last:mb-0">
                    <div className="flex-1">
                      <h2 className="font-classic text-4xl font-bold text-[#2B1B12] mb-6">{block.title}</h2>
                      <div className="w-16 h-[2px] bg-[#8C3A3A] mb-8"></div>
                      <p className="font-sans text-lg text-[#6B5A4E] leading-relaxed whitespace-pre-line">{block.content}</p>
                    </div>
                    {block.image && (
                      <div className="flex-1 w-full aspect-square border-8 border-[#FDF8F5] shadow-lg">
                        <img loading="lazy" src={block.image} alt={block.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-24 px-6">
              <div className="container mx-auto max-w-4xl bg-white p-12 md:p-20 border border-[#D9C5B2] shadow-xl relative text-center">
                <Diamond className="text-[#8C3A3A] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDF8F5] p-2 rounded-full" size={48} />
                <h2 className="font-classic text-4xl font-bold text-[#2B1B12] mb-12">Visit Us</h2>
                <div className="flex flex-col gap-8 font-sans text-lg text-[#6B5A4E] items-center mb-12">
                  <div className="flex items-center gap-4"><Phone className="text-[#8C3A3A]" /> {content.contact_info?.phone || '+91 98765 43210'}</div>
                  <div className="flex items-center gap-4"><Mail className="text-[#8C3A3A]" /> {content.contact_info?.email || 'contact@classiccollection.in'}</div>
                  <div className="flex items-center gap-4"><MapPin className="text-[#8C3A3A]" /> {content.contact_info?.address || 'Main Bazaar, Kerala'}</div>
                  {content.contact_info?.hours && (
                    <div className="flex items-center gap-4"><Clock className="text-[#8C3A3A]" /> {content.contact_info.hours}</div>
                  )}
                </div>
                
                {/* Social Links */}
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter) && (
                  <div className="flex justify-center gap-6 mb-12">
                    {content.contact_info.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="text-[#8C3A3A] hover:text-[#2B1B12] transition-colors">
                        <Facebook size={24} />
                      </a>
                    )}
                    {content.contact_info.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="text-[#8C3A3A] hover:text-[#2B1B12] transition-colors">
                        <Instagram size={24} />
                      </a>
                    )}
                    {content.contact_info.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noopener noreferrer" className="text-[#8C3A3A] hover:text-[#2B1B12] transition-colors">
                        <Twitter size={24} />
                      </a>
                    )}
                  </div>
                )}
                {content.contact_info?.address && (
                  <div className="w-full h-64 md:h-80 border-4 border-[#FDF8F5] shadow-sm mb-12">
                    <iframe
                      title="Google Maps"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </section>
          );

          return null;
        })}
          </>
        ) : (
          <section className="py-32 px-6 min-h-screen bg-[#FDF8F5]">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 border-b border-[#D9C5B2] pb-8">
                <h2 className="font-classic text-4xl md:text-5xl font-bold text-[#2B1B12]">All Collection</h2>
                <button 
                  onClick={() => {
                    setShowAllProducts(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-sans font-bold tracking-widest text-[#8C3A3A] hover:text-[#2B1B12] uppercase transition-colors"
                >
                  &larr; Back to Home
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {products.map((p: any, i: number) => (
                  <div key={i} className="flex gap-6 items-center group cursor-pointer bg-white p-4 border border-[#E8DFD8] hover:border-[#8C3A3A] transition-colors" onClick={() => setSelectedProduct(p)}>
                    <div className="w-1/2 aspect-square overflow-hidden bg-white">
                      <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="w-1/2 flex flex-col justify-center">
                      <h3 className="font-classic text-xl font-bold text-[#2B1B12] mb-2 leading-snug">{p.name}</h3>
                      <div className="font-sans font-bold tracking-widest text-[#8C3A3A] mb-4">{p.price}</div>
                      <p className="font-sans text-sm text-[#6B5A4E] leading-relaxed">{p.description}</p>
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
      <footer id="visit" className="bg-[#2B1B12] text-[#E8DFD8] py-20">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <Sparkles size={32} className="mx-auto mb-8 text-[#8C3A3A]" />
          <h3 className="font-classic text-3xl font-bold mb-6">{siteName}</h3>
          <p className="font-sans text-sm max-w-md mx-auto mb-12 leading-relaxed opacity-80">
            {content.about_text || "Serving elegance since 1990. Your trusted destination for high-quality imitation jewelry and cosmetics."}
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10 font-sans text-xs tracking-widest uppercase border-t border-[#4A3B32] pt-10">
            <div className="flex items-center gap-3"><Phone size={16} className="text-[#8C3A3A]" /> {content.contact_info?.phone || '+91 98765 43210'}</div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-[#8C3A3A]" /> {content.contact_info?.email || 'contact@classiccollection.in'}</div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-[#8C3A3A]" /> {content.contact_info?.address || 'Main Bazaar, Kerala'}</div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#2B1B12]/90 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 md:-right-12 bg-white/10 p-2 rounded-full text-white hover:bg-white hover:text-[#2B1B12] transition-colors z-10"
              onClick={() => setSelectedGalleryImage(null)}
            >
              <X size={24} />
            </button>
            <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[85vh] object-contain border-8 border-white shadow-2xl" />
          </div>
        </div>
      )}
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
