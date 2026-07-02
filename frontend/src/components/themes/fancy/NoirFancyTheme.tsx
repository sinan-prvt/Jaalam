import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Menu, MapPin, Mail, Phone, Clock, ArrowLeft } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Twitter = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

export default function NoirFancyTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showAllProducts]);

  const siteName = content.settings_json?.website_name || website.slug || 'NOIR';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Onyx Ring', price: '$450', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80', description: 'Solid titanium band.' },
    { name: 'Matte Watch', price: '$890', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80', description: 'Stealth tactical aesthetic.' },
    { name: 'Obsidian Perfume', price: '$220', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80', description: 'Smoke and black pepper.' },
    { name: 'Leather Duffle', price: '$550', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80', description: 'Italian leather, midnight.' },
    { name: 'Carbon Wallet', price: '$120', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', description: 'Ultra-thin, RFID blocking.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Bespoke Curation', description: 'Hand-selected artifacts tailored to your precise aesthetic and functional requirements.' },
    { title: 'Global Concierge', description: 'Discreet, secure worldwide delivery and sourcing of rare objects.' },
    { title: 'Private Viewing', description: 'Exclusive access to our archives by appointment only.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-black text-zinc-400 font-sans selection:bg-white selection:text-black scroll-smooth">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Jost:wght@300;400;500&display=swap');
        .font-noir-display { font-family: 'Cinzel', serif; }
        .font-noir-body { font-family: 'Jost', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .blend-diff { mix-blend-mode: difference; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Fullscreen Navigation Overlay */}
      <div className={`fixed inset-0 bg-black z-[100] transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] flex flex-col justify-center items-center ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:rotate-90 transition-transform duration-500 z-[110]">
          <X size={40} strokeWidth={1} className="w-10 h-10 md:w-12 md:h-12" />
        </button>
        <nav className="flex flex-col items-center gap-8 w-full px-6">
          {['hero', 'collection', 'ethos', 'gallery', 'contact'].map((section) => {
            if (hiddenSections.includes(section === 'collection' ? 'menu' : section === 'ethos' ? 'about' : section)) return null;
            const names: any = { hero: '01. Home', collection: '02. Archive', ethos: '03. Ethos', gallery: '04. Visuals', contact: '05. Inquire' };
            return (
              <a
                key={section}
                href={`#${section}`}
                onClick={() => { setIsMenuOpen(false); setShowAllProducts(false); }}
                className="font-noir-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-zinc-600 hover:text-white transition-colors duration-500 uppercase tracking-widest whitespace-nowrap"
              >
                {names[section]}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Minimal Header */}
      <header className={`fixed w-full top-0 z-50 p-8 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent'}`}>
        <a href="#" className="font-noir-display text-2xl text-white tracking-[0.5em] uppercase z-40 blend-diff">
          {content.settings_json?.logo_image ? (
            <img src={content.settings_json.logo_image} alt="Logo" className="h-6 filter invert" />
          ) : siteName}
        </a>
        <button onClick={() => setIsMenuOpen(true)} className="text-white hover:text-zinc-400 transition-colors z-40 blend-diff flex items-center gap-4 group">
          <span className="font-noir-body text-xs tracking-[0.3em] uppercase hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">Menu</span>
          <Menu size={32} strokeWidth={1} />
        </button>
      </header>

      <main>
        {!showAllProducts ? (
          <>
            {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
              if (hiddenSections.includes(sectionId)) return null;

              if (sectionId === 'hero') return (
                <section id="hero" key="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">
                  {content.settings_json?.about_image && (
                    <>
                      <div className="absolute inset-0 bg-black/60 z-10"></div>
                      <img src={content.settings_json.about_image} alt="Hero" className="absolute inset-0 w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite] filter grayscale contrast-125" />
                    </>
                  )}
                  <div className="relative z-20 text-center px-6 w-full max-w-7xl">
                    <h1 className="font-noir-display text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] text-white font-black uppercase tracking-widest leading-tight mb-12 drop-shadow-2xl">
                      {content.hero_title || 'N O I R'}
                    </h1>
                    <p className="font-noir-body text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
                      {content.about_text || content.hero_text || 'The absence of color is the presence of everything.'}
                    </p>
                    <div className="mt-16 md:mt-24">
                      <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-white to-transparent mx-auto"></div>
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'about') return (
                <section id="ethos" key="about" className="py-40 px-6 lg:px-20">
                  <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-20">
                    <div className="md:w-1/3">
                      <span className="font-noir-body text-xs tracking-[0.4em] uppercase text-zinc-500 block mb-4 border-l border-zinc-800 pl-4">The Ethos</span>
                      <h2 className="font-noir-display text-3xl md:text-4xl text-white tracking-widest uppercase">{content.settings_json?.about_title || 'Silence.'}</h2>
                    </div>
                    <div className="md:w-2/3">
                      <p className="font-noir-display text-xl sm:text-2xl md:text-4xl lg:text-5xl text-zinc-400 leading-tight">
                        {content.settings_json?.about_description || 'We strip away the unnecessary. What remains is pure form, undeniable function, and absolute darkness. Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.'}
                      </p>
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'services') return (
                <section id="services" key="services" className="py-20 px-6 lg:px-20 border-t border-zinc-900">
                  <div className="max-w-[1400px] mx-auto">
                    <span className="font-noir-body text-xs tracking-[0.4em] uppercase text-zinc-500 block mb-12 text-center">Services</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {services.map((service: any, idx: number) => (
                        <div key={idx} className="border border-zinc-900 p-12 hover:bg-zinc-900/50 transition-colors group">
                          <span className="font-noir-body text-xs tracking-[0.3em] text-zinc-600 block mb-6">{(idx + 1).toString().padStart(2, '0')}</span>
                          <h3 className="font-noir-display text-2xl text-white tracking-widest uppercase mb-4">{service.title}</h3>
                          <p className="font-noir-body text-zinc-400 font-light leading-relaxed">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'menu') return (
                <section id="collection" key="menu" className="py-40 border-y border-zinc-900">
                  <div className="px-6 lg:px-20 mb-20 flex justify-between items-end gap-4">
                    <h2 className="font-noir-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-widest">Archive</h2>
                    {products.length > 3 && (
                      <button onClick={() => setShowAllProducts(true)} className="font-noir-body text-[10px] sm:text-xs tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap text-right text-balance">
                        Full Collection <ArrowRight size={14} className="shrink-0" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1 px-6 lg:px-20 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12">
                    {products.slice(0, 6).map((product: any, idx: number) => (
                      <div key={idx} className="shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] snap-center group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="aspect-[4/3] bg-zinc-950 overflow-hidden relative border border-zinc-900 group-hover:border-zinc-700 transition-colors">
                          <img src={product.image} className="w-full h-full object-cover filter grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt={product.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                          <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <h3 className="font-noir-display text-3xl text-white uppercase tracking-widest mb-2">{product.name}</h3>
                            <span className="font-noir-body text-sm tracking-[0.2em] text-zinc-400">{product.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

              if (sectionId === 'gallery') return (
                <section id="gallery" key="gallery" className="py-40 px-6 lg:px-20">
                  <span className="font-noir-body text-xs tracking-[0.4em] uppercase text-zinc-500 block mb-20 text-center">Visual Study</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {gallery.slice(0, 8).map((img: any, idx: number) => {
                      const imgUrl = typeof img === 'string' ? img : img.url;
                      const spanClasses = idx === 0 ? 'col-span-2 row-span-2 aspect-square' :
                        idx === 3 ? 'col-span-2 aspect-[2/1]' : 'col-span-1 aspect-square';

                      return (
                        <div key={idx} className={`${spanClasses} overflow-hidden cursor-pointer group relative bg-zinc-950`} onClick={() => setSelectedGalleryImage(imgUrl)}>
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-700 z-10"></div>
                          <img src={imgUrl} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Visual" />
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

              if (sectionId === 'contact') return (
                <section id="contact" key="contact" className="py-40 px-6 lg:px-20 border-t border-zinc-900 bg-zinc-950">
                  <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between gap-20">
                    <div className="lg:w-1/2">
                      <h2 className="font-noir-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-widest mb-20">Inquire.</h2>
                      <ul className="space-y-12">
                        {content.contact_info?.email && (
                          <li className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-zinc-900 pb-12">
                            <span className="font-noir-body text-xs tracking-[0.3em] uppercase text-zinc-600 w-32">Email</span>
                            <span className="font-noir-display text-2xl md:text-4xl text-white">{content.contact_info.email}</span>
                          </li>
                        )}
                        {content.contact_info?.phone && (
                          <li className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-zinc-900 pb-12">
                            <span className="font-noir-body text-xs tracking-[0.3em] uppercase text-zinc-600 w-32">Phone</span>
                            <span className="font-noir-display text-2xl md:text-4xl text-white">{content.contact_info.phone}</span>
                          </li>
                        )}
                        {content.contact_info?.address && (
                          <li className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-zinc-900 pb-12">
                            <span className="font-noir-body text-xs tracking-[0.3em] uppercase text-zinc-600 w-32">Studio</span>
                            <span className="font-noir-display text-2xl md:text-3xl text-white leading-relaxed">{content.contact_info.address}</span>
                          </li>
                        )}
                        {content.contact_info?.hours && (
                          <li className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-zinc-900 pb-12">
                            <span className="font-noir-body text-xs tracking-[0.3em] uppercase text-zinc-600 w-32 shrink-0">Hours</span>
                            <span className="font-noir-display text-xl md:text-3xl text-white leading-relaxed">{content.contact_info.hours}</span>
                          </li>
                        )}
                        {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.whatsapp) && (
                          <li className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-zinc-900 pb-12">
                            <span className="font-noir-body text-xs tracking-[0.3em] uppercase text-zinc-600 w-32 shrink-0">Socials</span>
                            <div className="flex flex-wrap gap-6 md:gap-12">
                              {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="font-noir-display text-xl md:text-3xl text-white hover:text-zinc-500 transition-colors uppercase tracking-widest">Facebook</a>}
                              {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="font-noir-display text-xl md:text-3xl text-white hover:text-zinc-500 transition-colors uppercase tracking-widest">Instagram</a>}
                              {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="font-noir-display text-xl md:text-3xl text-white hover:text-zinc-500 transition-colors uppercase tracking-widest">Twitter</a>}
                              {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="font-noir-display text-xl md:text-3xl text-white hover:text-zinc-500 transition-colors uppercase tracking-widest">WhatsApp</a>}
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                    {content.contact_info?.address && (
                      <div className="lg:w-5/12 aspect-square border border-zinc-900 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-1000 z-10 pointer-events-none"></div>
                        <iframe
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                          className="filter grayscale invert contrast-150 hover:grayscale-0 hover:invert-0 transition-all duration-1000"
                        />
                      </div>
                    )}
                  </div>
                </section>
              );

              if (sectionId === 'custom') {
                if (!content.custom_blocks_json || content.custom_blocks_json.length === 0) return null;
                return (
                  <section id="custom" key="custom" className="py-20 px-6 lg:px-20 border-t border-zinc-900 bg-black">
                    <div className="max-w-[1000px] mx-auto space-y-12">
                      {content.custom_blocks_json.map((block: any, idx: number) => {
                        if (block.type === 'heading') return <h2 key={idx} className="font-noir-display text-3xl md:text-5xl lg:text-6xl text-white uppercase tracking-widest text-center">{block.content}</h2>;
                        if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-noir-body text-lg md:text-2xl text-zinc-400 leading-relaxed text-center font-light whitespace-pre-wrap">{block.content}</p>;
                        if (block.type === 'image' && block.url) return <div key={idx} className="w-full relative overflow-hidden border border-zinc-900"><img src={block.url} alt="Custom block" className="w-full h-auto object-cover filter grayscale contrast-125" /></div>;
                        if (block.type === 'divider') return <div key={idx} className="w-full h-[1px] bg-zinc-900 my-16"></div>;
                        return null;
                      })}
                    </div>
                  </section>
                );
              }

              return null;
            })}
          </>
        ) : (
          /* ALL PRODUCTS LISTING (Minimalist text list) */
          <section className="py-40 px-6 lg:px-20 min-h-screen">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-24 border-b border-zinc-900 pb-12 gap-8">
                <h2 className="font-noir-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-widest">Complete Archive</h2>
                <button onClick={() => setShowAllProducts(false)} className="font-noir-body text-xs tracking-[0.3em] uppercase text-zinc-500 hover:text-white flex items-center gap-4 transition-colors whitespace-nowrap">
                  <ArrowLeft size={16} className="shrink-0" /> Return
                </button>
              </div>

              <div className="space-y-4">
                {products.map((product: any, idx: number) => (
                  <div key={idx} className="group cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center p-8 hover:bg-zinc-950 border border-transparent hover:border-zinc-900 transition-colors" onClick={() => setSelectedProduct(product)}>
                    <div className="flex items-center gap-12 w-full md:w-auto mb-6 md:mb-0">
                      <span className="font-noir-body text-xs tracking-widest text-zinc-600">{(idx + 1).toString().padStart(2, '0')}</span>
                      <h3 className="font-noir-display text-2xl md:text-4xl text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">{product.name}</h3>
                    </div>
                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                      <span className="font-noir-body text-sm tracking-[0.2em] text-zinc-500">{product.price}</span>
                      <div className="w-16 h-16 bg-zinc-900 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <img src={product.image} className="w-full h-full object-cover filter grayscale" alt={product.name} />
                      </div>
                    </div>
                  </div>
                ))}
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      <footer className="bg-black py-20 border-t border-zinc-900 text-center">
        <h2 className="font-noir-display text-2xl text-white tracking-[1em] uppercase mb-12 ml-[1em]">{siteName}</h2>
        <div className="flex justify-center gap-12 mb-12">
          {content.contact_info?.facebook && <a href={content.contact_info.facebook} className="text-zinc-600 hover:text-white transition-colors"><Facebook size={20} strokeWidth={1} /></a>}
          {content.contact_info?.instagram && <a href={content.contact_info.instagram} className="text-zinc-600 hover:text-white transition-colors"><Instagram size={20} strokeWidth={1} /></a>}
          {content.contact_info?.twitter && <a href={content.contact_info.twitter} className="text-zinc-600 hover:text-white transition-colors"><Twitter size={20} strokeWidth={1} /></a>}
        </div>
        <p className="font-noir-body text-xs text-zinc-600 uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
      </footer>

      {/* Extreme Minimal Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto no-scrollbar" onClick={() => setSelectedProduct(null)}>
          <button className="fixed top-6 right-6 md:top-8 md:right-8 text-white hover:rotate-90 transition-transform duration-500 z-[110]" onClick={() => setSelectedProduct(null)}>
            <X size={32} strokeWidth={1} className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-0 lg:gap-20 bg-zinc-950/90 border border-zinc-900 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="w-full lg:w-1/2 h-[30vh] md:h-[40vh] lg:h-[70vh]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover filter grayscale contrast-125" />
            </div>
            <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center relative">
              <span className="font-noir-body text-[10px] md:text-xs tracking-[0.4em] uppercase text-zinc-600 mb-4 md:mb-12 border-b border-zinc-800 pb-2 md:pb-4 inline-block w-fit">Item Details</span>
              <h3 className="font-noir-display text-2xl md:text-5xl lg:text-6xl text-white uppercase tracking-widest mb-4 md:mb-8 leading-tight">{selectedProduct.name}</h3>
              <p className="font-noir-body text-lg md:text-2xl text-zinc-400 tracking-[0.2em] mb-4 md:mb-12">{selectedProduct.price}</p>
              <p className="font-noir-body text-sm md:text-lg text-zinc-500 font-light leading-relaxed mb-6 md:mb-20 max-w-md">{selectedProduct.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform duration-500 z-10" onClick={() => setSelectedGalleryImage(null)}>
            <X size={40} strokeWidth={1} />
          </button>
          <img src={selectedGalleryImage} alt="Enlarged" className="max-w-[90vw] max-h-[90vh] object-contain filter grayscale contrast-125" onClick={e => e.stopPropagation()} />
        </div>
      )}


    </div>
  );
}
