import React, { useState, useEffect } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ArrowRight, X, Menu, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Twitter = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const WhatsApp = ({ size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
);

export default function PopFancyTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showAllProducts]);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'POP';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Vibrant Sneaks', price: '$120', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', description: 'Comfort meets bold colors.' },
    { name: 'Neon Jacket', price: '$210', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', description: 'Stand out in any crowd.' },
    { name: 'Cherry Shades', price: '$85', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80', description: 'Retro frames, modern tint.' },
    { name: 'Pixel Ring', price: '$45', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80', description: 'Hot pink enamel finish.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Personal Styling', description: '1-on-1 curation tailored to your unique vibe.' },
    { title: 'Custom Fits', description: 'Bespoke tailoring for our premium collection items.' },
    { title: 'Global Shipping', description: 'Fast, secure worldwide delivery in eco-packaging.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-fuchsia-500 selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
        .font-pop-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-pop-body { font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-gradient { background: linear-gradient(to right, #ec4899, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <a href="#" className="font-pop-display text-2xl font-extrabold tracking-tight text-slate-900">{siteName}</a>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {!hiddenSections.includes('about') && <a href="#about" className="font-pop-body text-sm font-medium text-slate-600 hover:text-fuchsia-500 transition-colors">About</a>}
          {!hiddenSections.includes('services') && <a href="#services" className="font-pop-body text-sm font-medium text-slate-600 hover:text-fuchsia-500 transition-colors">Services</a>}
          {!hiddenSections.includes('menu') && <a href="#collection" className="font-pop-body text-sm font-medium text-slate-600 hover:text-fuchsia-500 transition-colors">Collection</a>}
          {!hiddenSections.includes('gallery') && <a href="#gallery" className="font-pop-body text-sm font-medium text-slate-600 hover:text-fuchsia-500 transition-colors">Gallery</a>}
          {!hiddenSections.includes('contact') && <a href="#contact" className="font-pop-body text-sm font-medium text-white bg-slate-900 px-5 py-2 rounded-full hover:bg-fuchsia-600 shadow-md transition-all">Contact</a>}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-900" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col p-8">
          <button className="self-end text-slate-900 mb-12" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={32} />
          </button>
          <nav className="flex flex-col gap-8 items-start">
            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="font-pop-display text-4xl font-bold text-slate-900 hover:text-fuchsia-500">Home</a>
            {!hiddenSections.includes('about') && <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="font-pop-display text-4xl font-bold text-slate-900 hover:text-fuchsia-500">About</a>}
            {!hiddenSections.includes('services') && <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="font-pop-display text-4xl font-bold text-slate-900 hover:text-fuchsia-500">Services</a>}
            {!hiddenSections.includes('menu') && <a href="#collection" onClick={() => setIsMobileMenuOpen(false)} className="font-pop-display text-4xl font-bold text-slate-900 hover:text-fuchsia-500">Collection</a>}
            {!hiddenSections.includes('gallery') && <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="font-pop-display text-4xl font-bold text-slate-900 hover:text-fuchsia-500">Gallery</a>}
            {!hiddenSections.includes('contact') && <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="font-pop-display text-4xl font-bold text-slate-900 hover:text-fuchsia-500">Contact</a>}
          </nav>
        </div>
      )}

      <main className="pt-24 pb-20">
        {!showAllProducts ? (
          <>
            {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
              if (hiddenSections.includes(sectionId)) return null;

              if (sectionId === 'hero') return (
                <section id="hero" key="hero" className="relative px-6 lg:px-20 py-16 md:py-24 max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                  <div className="w-full lg:w-1/2 flex flex-col justify-center items-start z-10">
                    <h1 className="font-pop-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-slate-900">
                      {content.hero_title || 'STAY LOUD.'}
                    </h1>
                    <p className="font-pop-body text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                      {content.about_text || content.hero_text || 'Premium quality for those who want to stand out. Bold aesthetics meets modern craftsmanship.'}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {!hiddenSections.includes('menu') && (
                        <a href="#collection" className="font-pop-body text-base font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-violet-600 px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                          Shop Collection
                        </a>
                      )}
                      {!hiddenSections.includes('about') && (
                        <a href="#about" className="font-pop-body text-base font-semibold text-slate-700 bg-white border border-slate-200 px-8 py-4 rounded-full shadow-sm hover:bg-slate-50 transition-all">
                          Our Story
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 relative h-[50vh] md:h-[60vh] lg:h-[75vh] rounded-3xl overflow-hidden shadow-2xl">
                    <img loading="lazy" src={content.settings_json?.about_image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </section>
              );

              if (sectionId === 'about') return (
                <section id="about" key="about" className="py-24 px-6 lg:px-20 bg-white">
                  <div className="max-w-[1000px] mx-auto text-center">
                    <span className="font-pop-display text-sm font-bold tracking-widest uppercase text-fuchsia-500 mb-4 block">About Us</span>
                    <h2 className="font-pop-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">{content.settings_json?.about_title || 'The Vision.'}</h2>
                    <p className="font-pop-body text-xl md:text-3xl text-slate-600 leading-relaxed font-light">
                      {content.settings_json?.about_description || 'We blend cutting-edge design with premium materials to create pieces that speak for themselves. Welcome to the future of style.'}
                    </p>
                  </div>
                </section>
              );

              if (sectionId === 'services') return (
                <section id="services" key="services" className="py-24 px-6 lg:px-20 bg-slate-50">
                  <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                      <span className="font-pop-display text-sm font-bold tracking-widest uppercase text-violet-500 mb-4 block">What We Do</span>
                      <h2 className="font-pop-display text-4xl md:text-5xl font-extrabold text-slate-900">Our Services</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {services.map((service: any, idx: number) => (
                        <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                          <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center font-pop-display text-xl font-bold mb-6">
                            {(idx + 1).toString().padStart(2, '0')}
                          </div>
                          <h3 className="font-pop-display text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                          <p className="font-pop-body text-slate-600 leading-relaxed">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'menu') return (
                <section id="collection" key="menu" className="py-24 px-6 lg:px-20 bg-white">
                  <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
                      <div>
                        <span className="font-pop-display text-sm font-bold tracking-widest uppercase text-cyan-500 mb-4 block">Shop</span>
                        <h2 className="font-pop-display text-4xl md:text-5xl font-extrabold text-slate-900">Featured Collection</h2>
                      </div>
                      {products.length > 3 && (
                        <button onClick={() => setShowAllProducts(true)} className="font-pop-body text-sm font-semibold text-slate-600 hover:text-cyan-500 flex items-center gap-2 group">
                          View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {products.slice(0, 8).map((product: any, idx: number) => (
                        <div key={idx} className="group cursor-pointer flex flex-col" onClick={() => setSelectedProduct(product)}>
                          <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 mb-6 relative shadow-sm group-hover:shadow-lg transition-all duration-300">
                            <img loading="lazy" src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                            <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          <h3 className="font-pop-display text-xl font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
                          <span className="font-pop-body text-lg font-medium text-slate-600">{product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'gallery') return (
                <section id="gallery" key="gallery" className="py-24 px-6 lg:px-20 bg-slate-50">
                  <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                      <span className="font-pop-display text-sm font-bold tracking-widest uppercase text-fuchsia-500 mb-4 block">Lookbook</span>
                      <h2 className="font-pop-display text-4xl md:text-5xl font-extrabold text-slate-900">Visuals</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.slice(0, 8).map((img: any, idx: number) => {
                        const imgUrl = typeof img === 'string' ? img : img.url;
                        const spanClasses = idx === 0 || idx === 3 ? 'col-span-2 row-span-2 aspect-square' : 'col-span-1 aspect-square';

                        return (
                          <div key={idx} className={`${spanClasses} rounded-2xl overflow-hidden cursor-pointer group relative bg-slate-200 shadow-sm hover:shadow-xl transition-all duration-300`} onClick={() => setSelectedGalleryImage(imgUrl)}>
                            <img loading="lazy" src={imgUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Gallery" />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300"></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

              if (sectionId === 'contact') return (
                <section id="contact" key="contact" className="py-24 px-6 lg:px-20 bg-white border-t border-slate-100">
                  <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[3rem] p-10 md:p-20 flex flex-col lg:flex-row justify-between gap-20 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-fuchsia-500/20 to-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="lg:w-1/2 relative z-10">
                      <span className="font-pop-display text-sm font-bold tracking-widest uppercase text-cyan-400 mb-4 block">Get in Touch</span>
                      <h2 className="font-pop-display text-4xl md:text-6xl font-extrabold text-white mb-12">Contact Us</h2>
                      
                      <div className="space-y-8">
                        {content.contact_info?.email && (
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><Mail size={20} /></div>
                            <div>
                              <span className="font-pop-body text-xs text-slate-400 uppercase tracking-wider block mb-1">Email</span>
                              <span className="font-pop-display text-xl text-white">{content.contact_info.email}</span>
                            </div>
                          </div>
                        )}
                        {content.contact_info?.phone && (
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><Phone size={20} /></div>
                            <div>
                              <span className="font-pop-body text-xs text-slate-400 uppercase tracking-wider block mb-1">Phone</span>
                              <span className="font-pop-display text-xl text-white">{content.contact_info.phone}</span>
                            </div>
                          </div>
                        )}
                        {content.contact_info?.address && (
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><MapPin size={20} /></div>
                            <div>
                              <span className="font-pop-body text-xs text-slate-400 uppercase tracking-wider block mb-1">Location</span>
                              <span className="font-pop-display text-xl text-white">{content.contact_info.address}</span>
                            </div>
                          </div>
                        )}
                        {content.contact_info?.hours && (
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><Clock size={20} /></div>
                            <div>
                              <span className="font-pop-body text-xs text-slate-400 uppercase tracking-wider block mb-1">Hours</span>
                              <span className="font-pop-display text-xl text-white whitespace-pre-wrap">{content.contact_info.hours}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.whatsapp) && (
                        <div className="mt-16 flex gap-4">
                          {content.contact_info?.facebook && <a href={content.contact_info.facebook} className="w-12 h-12 bg-white text-slate-900 hover:bg-cyan-400 hover:text-white rounded-full flex items-center justify-center transition-colors"><Facebook size={20} /></a>}
                          {content.contact_info?.instagram && <a href={content.contact_info.instagram} className="w-12 h-12 bg-white text-slate-900 hover:bg-fuchsia-400 hover:text-white rounded-full flex items-center justify-center transition-colors"><Instagram size={20} /></a>}
                          {content.contact_info?.twitter && <a href={content.contact_info.twitter} className="w-12 h-12 bg-white text-slate-900 hover:bg-violet-400 hover:text-white rounded-full flex items-center justify-center transition-colors"><Twitter size={20} /></a>}
                          {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} className="w-12 h-12 bg-white text-slate-900 hover:bg-green-400 hover:text-white rounded-full flex items-center justify-center transition-colors"><WhatsApp size={20} /></a>}
                        </div>
                      )}
                    </div>

                    {content.contact_info?.address && (
                      <div className="w-full lg:w-5/12 aspect-square rounded-3xl overflow-hidden relative shadow-inner z-10 border border-white/10">
                        <iframe
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                          className="filter contrast-125"
                        />
                      </div>
                    )}
                  </div>
                </section>
              );

              if (sectionId === 'custom') {
                if (!content.custom_blocks_json || content.custom_blocks_json.length === 0) return null;
                return (
                  <section id="custom" key="custom" className="py-24 px-6 lg:px-20 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto space-y-12">
                      {content.custom_blocks_json.map((block: any, idx: number) => {
                        if (block.type === 'heading') return <h2 key={idx} className="font-pop-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 text-center">{block.content}</h2>;
                        if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-pop-body text-xl md:text-2xl text-slate-600 leading-relaxed text-center whitespace-pre-wrap">{block.content}</p>;
                        if (block.type === 'image' && block.url) return <div key={idx} className="w-full relative overflow-hidden rounded-3xl shadow-xl"><img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto object-cover" /></div>;
                        if (block.type === 'divider') return <div key={idx} className="w-full h-[1px] bg-slate-200 my-16"></div>;
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
          /* ALL PRODUCTS LISTING */
          <section className="py-12 px-6 lg:px-20 bg-slate-50 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 border-b border-slate-200 pb-8 gap-6">
                <h2 className="font-pop-display text-4xl md:text-5xl font-extrabold text-slate-900">Complete Archive</h2>
                <button onClick={() => setShowAllProducts(false)} className="font-pop-body text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-6 py-3 rounded-full shadow-sm hover:bg-slate-100 flex items-center gap-2 transition-colors">
                  <ArrowRight size={16} className="rotate-180" /> Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product: any, idx: number) => (
                  <div key={idx} className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col" onClick={() => setSelectedProduct(product)}>
                    <div className="w-full aspect-square bg-slate-100 relative overflow-hidden">
                      <img loading="lazy" src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                    </div>
                    <div className="p-6">
                      <h3 className="font-pop-display text-xl font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
                      <span className="font-pop-body text-lg font-medium text-slate-600">{product.price}</span>
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-200 text-center">
        <h2 className="font-pop-display text-2xl font-extrabold text-slate-900 mb-6">{siteName}</h2>
        <p className="font-pop-body text-sm text-slate-500 font-medium">&copy; {new Date().getFullYear()} {siteName}. Designed for the bold.</p>
      </footer>

      {/* Product Modal */}

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10" onClick={() => setSelectedGalleryImage(null)}>
            <X size={28} strokeWidth={2} />
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Enlarged" className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()} />
        </div>
      )}
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}
