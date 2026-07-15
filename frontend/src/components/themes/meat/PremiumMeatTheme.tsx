import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Crown, Star, MapPin, Mail, Phone, Flame, Check } from 'lucide-react';

export default function PremiumMeatTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Wagyu & Co.';
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [viewProductsPage, setViewProductsPage] = React.useState(false);
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'A5 Wagyu Ribeye', price: '₹4,500/steak', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: 'Perfect marbling, melt-in-your-mouth texture.' },
    { name: 'Dry-Aged Tomahawk', price: '₹3,200/kg', image: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=600&q=80', description: '30-day dry-aged premium cut.' },
    { name: 'Organic Free-Range Chicken', price: '₹650/kg', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', description: 'Pasture-raised, grain-fed.' },
    { name: 'Premium Lamb Chops', price: '₹1,800/kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', description: 'French-trimmed tender lamb chops.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Dry Aging', description: 'Bespoke aging process in our climate-controlled Himalayan salt brick room.' },
    { title: 'Concierge Delivery', description: 'White-glove delivery in temperature-controlled luxury vehicles.' },
    { title: 'Private Chef Prep', description: 'Cuts prepared precisely to your private chefs specifications.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#0A0A0A] text-[#D4AF37] font-sans selection:bg-[#D4AF37] selection:text-black pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;import ProductBuyButton from '../../payments/ProductBuyButton';
600;700&family=Montserrat:wght@300;400;500&display=swap');
        .font-premium { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#D4AF37]/30 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="h-10 object-contain" />
            ) : (
              <>
                <Crown size={24} className="text-[#D4AF37]" />
                <span className="font-premium text-2xl tracking-widest uppercase">{siteName}</span>
              </>
            )}
          </div>
          <nav className="hidden md:flex gap-8 font-body text-xs tracking-widest uppercase text-gray-400">
            <a href="#cuts" className="hover:text-[#D4AF37] transition-colors">Selection</a>
            <a href="#about" className="hover:text-[#D4AF37] transition-colors">Philosophy</a>
          </nav>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-[#1A1A1A]">
              <div className="absolute inset-0">
                <img loading="lazy" src={content.settings_json?.hero_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1600&q=80"} alt="Hero Background" className="w-full h-full object-cover opacity-30 mix-blend-luminosity filter contrast-125" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50"></div>
              
              <div className="container mx-auto px-6 relative z-10 text-center">
                <Flame size={48} className="mx-auto mb-6 text-[#8C2323]" />
                <h1 className="font-premium text-5xl md:text-7xl font-bold mb-6 text-white tracking-wider">
                  {content.hero_title || 'The Art of Meat.'}
                </h1>
                <p className="font-body text-sm text-gray-300 tracking-widest uppercase max-w-2xl mx-auto mb-10 leading-loose">
                  {content.about_text || content.hero_text || 'Exclusive purveyors of dry-aged steaks, wagyu, and artisanal cuts for the true connoisseur.'}
                </p>
                <a href="#cuts" className="inline-block border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-10 py-3 font-body uppercase tracking-[0.2em] text-xs transition-colors">
                  View Selection
                </a>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-24 px-6 bg-[#0A0A0A]">
              <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-[#D4AF37] w-12"></div>
                    <span className="font-body text-xs tracking-[0.3em] uppercase text-[#D4AF37]">Our Philosophy</span>
                  </div>
                  <h2 className="font-premium text-4xl text-white mb-8 leading-tight">{content.settings_json?.about_title || content.about_title || 'Mastery in Every Cut.'}</h2>
                  <p className="font-body text-gray-400 leading-loose text-sm font-light mb-8">
                    {content.settings_json?.about_description || content.about_description || 'We source only the highest grade meats from sustainable, ethical farms worldwide. Our master butchers treat each piece with the reverence it deserves, ensuring an unparalleled culinary experience at your table.'}
                  </p>
                  <div className="flex gap-8">
                     <div className="text-center">
                       <div className="font-premium text-3xl text-white mb-1">100%</div>
                       <div className="font-body text-[10px] text-gray-500 tracking-widest uppercase">Ethical Sourcing</div>
                     </div>
                     <div className="text-center">
                       <div className="font-premium text-3xl text-white mb-1">30+</div>
                       <div className="font-body text-[10px] text-gray-500 tracking-widest uppercase">Days Dry Aged</div>
                     </div>
                  </div>
                </div>
                <div className="md:w-1/2 w-full relative">
                  <div className="absolute inset-0 bg-[#D4AF37] translate-x-4 translate-y-4 opacity-20 border border-[#D4AF37]"></div>
                  <div className="relative aspect-[4/5] bg-[#111]">
                    <img loading="lazy" src={content.settings_json?.about_image || content.about_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80"} alt="About" className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-1000" />
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-24 px-6 bg-[#111] border-y border-[#1A1A1A]">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <Crown size={24} className="text-[#D4AF37] mx-auto mb-4" />
                  <h2 className="font-premium text-3xl text-white tracking-widest uppercase">Bespoke Services</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((srv: any, idx: number) => {
                    const title = typeof srv === 'string' ? srv : srv.title;
                    const desc = typeof srv === 'string' ? '' : srv.description;
                    return (
                      <div key={idx} className="border border-[#1A1A1A] p-10 hover:border-[#D4AF37]/30 transition-colors bg-[#0A0A0A] group">
                        {srv.image ? (
                          <img loading="lazy" src={srv.image} alt={title} className="w-full h-32 object-cover mb-6 filter grayscale contrast-125 border border-[#1A1A1A]" />
                        ) : (
                          <Check size={20} className="text-[#8C2323] mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                        <h3 className="font-premium text-xl text-white mb-4">{title}</h3>
                        <p className="font-body text-xs text-gray-500 leading-loose">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="cuts" className="py-24 px-6 bg-[#0A0A0A]">
              <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col items-center mb-16">
                  <Star size={16} className="text-[#D4AF37] mb-4" />
                  <h2 className="font-premium text-3xl text-center text-white tracking-widest uppercase">The Reserve Collection</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {products.map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="flex flex-col md:flex-row gap-6 items-center group cursor-pointer border border-[#1A1A1A] p-4 hover:border-[#D4AF37]/50 transition-colors bg-[#0D0D0D]">
                      <div className="w-full md:w-1/2 aspect-square overflow-hidden relative">
                        <div className="absolute inset-0 bg-[#8C2323] mix-blend-overlay opacity-20 group-hover:opacity-0 transition-opacity z-10"></div>
                        <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="w-full md:w-1/2 text-center md:text-left py-4 relative">
                        <Star size={12} className="text-[#D4AF37] mb-2 mx-auto md:mx-0" />
                        <h3 className="font-premium text-xl text-white mb-2">{p.name}</h3>
                        <div className="font-body text-xs text-gray-400 mb-4 tracking-wider leading-relaxed">{p.description}</div>
                        <div className="font-premium text-lg text-[#D4AF37] mb-6">{p.price}</div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
                        
                        <div className="absolute bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[#D4AF37] font-body text-[10px] uppercase tracking-widest border-b border-[#D4AF37] pb-1">View</span>
                        </div>
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

                
                <div className="mt-16 text-center">
                  <button onClick={() => setViewProductsPage(true)} className="inline-block border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-10 py-4 font-body uppercase tracking-[0.2em] text-xs transition-colors">
                    View Full Catalog
                  </button>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-24 px-6 bg-[#111] border-y border-[#1A1A1A]">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-premium text-3xl text-center mb-16 text-white tracking-widest uppercase">The Cellar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <div key={idx} className="aspect-[16/9] overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                        <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-24 px-6 bg-[#0A0A0A]">
              <div className="container mx-auto max-w-5xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="font-premium text-3xl text-white mb-10 tracking-widest uppercase">Private Inquiries</h2>
                    <div className="space-y-8 font-body text-sm font-light text-gray-300">
                      {content.contact_info?.phone && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">Concierge</div>
                          <div className="flex items-center gap-3"><Phone size={16} /> {content.contact_info.phone}</div>
                        </div>
                      )}
                      {content.contact_info?.email && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">Electronic Mail</div>
                          <div className="flex items-center gap-3"><Mail size={16} /> {content.contact_info.email}</div>
                        </div>
                      )}
                      {content.contact_info?.address && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">Location</div>
                          <div className="flex items-start gap-3"><MapPin size={16} className="mt-1 shrink-0" /> <span className="leading-relaxed">{content.contact_info.address}</span></div>
                        </div>
                      )}
                      {content.contact_info?.hours && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">Hours</div>
                          <div className="leading-relaxed whitespace-pre-wrap">{content.contact_info.hours}</div>
                        </div>
                      )}
                      {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.whatsapp) && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-4">Socials</div>
                          <div className="flex gap-4">
                            {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>}
                            {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>}
                            {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>}
                            {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {content.contact_info?.address && (
                    <div className="border border-[#1A1A1A] p-4 bg-[#0D0D0D]">
                      <div className="w-full aspect-square border border-[#1A1A1A]">
                        <iframe 
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                          className="filter grayscale contrast-125 opacity-70"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-24 px-6 bg-[#0A0A0A]">
              <div className="container mx-auto max-w-3xl space-y-12 text-center">
                {content.custom_blocks_json.map((block: any, idx: number) => {
                  if (block.type === 'heading') return <h2 key={idx} className="font-premium text-3xl text-white tracking-widest uppercase">{block.content}</h2>;
                  if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-body text-gray-400 text-sm leading-loose font-light">{block.content}</p>;
                  if (block.type === 'image' && block.url) return <div key={idx} className="border border-[#1A1A1A] p-2 bg-[#111]"><img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700" /></div>;
                  if (block.type === 'divider') return <div key={idx} className="w-px h-16 bg-[#D4AF37] mx-auto opacity-30"></div>;
                  return null;
                })}
              </div>
            </section>
          );

          return null;
        })}
      </main>

      {/* Full Products Page */}
      

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedProduct(null)}>
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(212,175,55,0.05)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10 bg-black/50 p-2" onClick={() => setSelectedProduct(null)}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="w-full md:w-1/2 h-40 sm:h-48 md:h-auto md:min-h-[400px] relative border-b md:border-b-0 md:border-r border-[#1A1A1A] shrink-0">
              <div className="absolute inset-0 bg-[#8C2323] mix-blend-overlay opacity-10"></div>
              <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover filter contrast-125" />
            </div>
            <div className="w-full md:w-1/2 p-5 md:p-10 flex flex-col justify-center">
              <Star size={14} className="text-[#D4AF37] mb-3 md:mb-6" />
              <h3 className="font-premium text-2xl md:text-4xl text-white mb-2 leading-tight">{selectedProduct.name}</h3>
              <div className="font-premium text-lg md:text-xl text-[#D4AF37] mb-4 md:mb-8">{selectedProduct.price}</div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={selectedProduct} content={content} /></div>
              <div className="w-8 md:w-12 h-px bg-[#D4AF37]/50 mb-4 md:mb-8"></div>
              <p className="font-body text-xs md:text-sm text-gray-400 mb-6 md:mb-10 leading-loose font-light">
                {selectedProduct.description}
                <br /><br />
                Sourced from the finest sustainable farms and hand-cut by our master butchers to ensure exceptional quality and flavor.
              </p>
              <button onClick={() => setSelectedProduct(null)} className="w-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black py-3 md:py-4 font-body uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all duration-300">
                Return to Collection
              </button>
            </div>
          </div>
        </div>
      )}

      
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
      <footer id="footer" className="py-16 px-6 bg-[#050505] border-t border-[#1A1A1A]">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown size={24} className="text-[#D4AF37] mx-auto mb-6 opacity-50" />
          <h3 className="font-premium text-xl text-white mb-6 tracking-widest uppercase">{siteName}</h3>
          <p className="font-body text-[10px] text-gray-600 tracking-[0.2em] uppercase mb-12 max-w-md mx-auto leading-loose">
            Excellence in every cut. Purveyors of fine meats.
          </p>
          <div className="font-body text-[10px] tracking-widest text-gray-600 uppercase border-t border-[#1A1A1A] pt-8">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
