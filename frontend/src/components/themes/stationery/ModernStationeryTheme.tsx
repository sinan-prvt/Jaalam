import React from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Book, ArrowRight, MapPin, Mail, Phone, Search, Menu, X } from 'lucide-react';

export default function ModernStationeryTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'Modern Stationery';

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Ergonomic Desk Pen', price: '₹299', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', description: 'Smooth ink flow with a comfortable grip for long writing sessions.' },
    { name: 'Minimalist Notebook', price: '₹150', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Dotted grid pages, lay-flat binding.' },
    { name: 'Geometric Desk Organizer', price: '₹499', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', description: 'Keep your workspace clean and modern.' },
    { name: 'Architect Scale Ruler', price: '₹350', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: 'Precision aluminum scale ruler.' }
  ];


  return (
    <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        .font-modern { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                <Book size={18} />
              </div>
            )}
            <span className="font-modern text-xl font-bold tracking-tight">{siteName}</span>
          </div>
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64">
            <Search size={16} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search products..." className="bg-transparent border-none outline-none text-sm w-full font-modern" />
          </div>
          <nav className="hidden md:flex items-center gap-6 font-modern text-sm font-semibold text-slate-600">
            <a href="#products" onClick={() => setShowAllProducts(false)} className="hover:text-blue-600 transition-colors">Products</a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2 focus:outline-none">
                Explore <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right -translate-y-2 group-hover:translate-y-0 flex flex-col">
                <a href="#gallery" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left border-b border-slate-50">Gallery</a>
                <a href="#custom" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left border-b border-slate-50">Our Promise</a>
                <a href="#contact-info" onClick={() => setShowAllProducts(false)} className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left">Location</a>
              </div>
            </div>
            <a href="#contact" onClick={() => setShowAllProducts(false)} className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
          
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl font-modern text-sm font-semibold text-slate-700 flex flex-col py-2">
            <a href="#products" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-slate-50">Products</a>
            <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-slate-50">Gallery</a>
            <a href="#custom" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-slate-50">Our Promise</a>
            <a href="#contact-info" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-slate-50 hover:text-blue-600 transition-colors">Location & Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      {!showAllProducts ? (
        <>
          {sectionOrder.map((sectionId) => {
            if (hiddenSections.includes(sectionId)) return null;

            if (sectionId === 'hero') return (
              <section key="hero" className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h1 className="font-modern text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                      {content.hero_title || 'Work smart. Create better.'}
                    </h1>
                    <p className="font-modern text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                      {content.about_text || 'Premium, functional, and beautifully designed stationery for the modern workspace.'}
                    </p>
                    <a href="#products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-modern font-semibold py-3 px-8 rounded-lg transition-colors">
                      Shop Now <ArrowRight size={18} />
                    </a>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-blue-50 rounded-3xl overflow-hidden relative">
                      <img loading="lazy" src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80" alt="Workspace" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  </div>
                </div>
              </section>
            );

            if (sectionId === 'about') return (
              <section key="about" id="about" className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">{content.settings_json?.about_title || 'About Us'}</h2>
                  <p className="text-lg opacity-80 leading-relaxed">
                    {content.settings_json?.about_description || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. Our curated collections are designed to inspire.'}
                  </p>
                </div>
              </section>
            );

            if (sectionId === 'services') return (
              <section key="services" id="services" className="py-20 px-6 border-t border-current border-opacity-10">
                <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Our Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {(content.services_json?.length > 0 ? content.services_json : [
                      { title: 'Custom Orders', description: 'Personalized stationery tailored to your exact specifications and brand guidelines.' },
                      { title: 'Bulk Corporate', description: 'Premium supplies for your entire team or office space, delivered seamlessly.' },
                      { title: 'Gift Wrapping', description: 'Beautiful, elegant wrapping for those special occasions, with handwritten notes.' }
                    ]).map((srv: any, idx: number) => {
                      const title = typeof srv === 'string' ? srv : (srv.title || '');
                      const description = typeof srv === 'string' ? '' : (srv.description || '');
                      const image = typeof srv === 'string' ? '' : (srv.image || '');
                      return (
                        <div key={idx} className="p-8 border border-current border-opacity-20 rounded-2xl hover:-translate-y-2 hover:border-opacity-100 transition-all cursor-pointer">
                          {image && (
                            <div className="w-16 h-16 mx-auto mb-6 rounded-xl overflow-hidden bg-slate-100/50">
                              <img loading="lazy" src={image} alt={title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h3 className="text-2xl font-bold mb-4">{title}</h3>
                          <p className="opacity-80">{description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

            if (sectionId === 'menu' || sectionId === 'products') return (
              <section key="products" id="products" className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 max-w-6xl">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="font-modern text-3xl font-extrabold text-slate-900 mb-2">New Arrivals</h2>
                      <p className="font-modern text-slate-500">Upgrade your desk setup.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((p: any, i: number) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-4">
                          <img loading="lazy" src={p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                            alt={p.name || 'Product Image'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <h3 className="font-modern font-semibold text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600">{p.name}</h3>
                        <p className="font-modern text-xs text-slate-500 mb-3 line-clamp-2">{p.description}</p>
                        <div className="mt-auto pt-4">
                          <div className="font-modern font-bold text-lg text-slate-900">{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {products.length > 0 && (
                    <div className="mt-12 text-center">
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="inline-block bg-slate-900 hover:bg-blue-600 text-white font-modern font-semibold py-3 px-8 rounded-lg transition-colors cursor-pointer"
                      >
                        View All Products
                      </button>
                    </div>
                  )}
                </div>
              </section>
            );

            if (sectionId === 'gallery') return (
              <section key="gallery" id="gallery" className="py-20 px-6 border-t border-current border-opacity-10">
                <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {(content.gallery_json?.length > 0 ? content.gallery_json : [
                       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1583341612074-ccea5cd64f6a?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1520038410233-7141be7b6f97?auto=format&fit=crop&w=400&q=80'
                    ]).map((item: any, idx: number) => {
                       const imgUrl = typeof item === 'string' ? item : (item.image || item.url || '');
                       return (
                         <div key={idx} className="aspect-square overflow-hidden group bg-slate-100 cursor-pointer" onClick={() => setSelectedImage(imgUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80')}>
                           <img loading="lazy" src={imgUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'} 
                             onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'; }}
                             alt={`Gallery image ${idx + 1}`} 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0" 
                           />
                         </div>
                       );
                    })}
                  </div>
                </div>
              </section>
            );

            if (sectionId === 'contact') return (
              <section key="contact" id="contact-info" className="py-20 px-6 border-t border-current border-opacity-10">
                <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Contact & Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                      <div className="flex items-center gap-4 text-lg">
                        <span className="opacity-50">📞</span> 
                        <span className="font-semibold">{content.contact_info?.phone || '+91 98765 43210'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-lg">
                        <span className="opacity-50">✉️</span> 
                        <span className="font-semibold">{content.contact_info?.email || 'hello@stationery.com'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-lg">
                        <span className="opacity-50">📍</span> 
                        <span className="font-semibold">{content.contact_info?.address || '123 Paper Street, Design District'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-lg">
                        <span className="opacity-50">⏱️</span> 
                        <span className="font-semibold whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sun: 11:00 AM - 11:00 PM'}</span>
                      </div>
                      
                      <div className="pt-8 border-t border-current border-opacity-10">
                        <h3 className="text-xl font-bold mb-6">Follow Us</h3>
                        <div className="flex gap-6 text-xl">
                          <a href={content.contact_info?.whatsapp || "#"} className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                          <a href={content.contact_info?.facebook || "#"} className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          <a href={content.contact_info?.instagram || "#"} className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="h-80 md:h-full min-h-[400px] border-4 border-current border-opacity-20 p-2 relative">
                      <iframe 
                        src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || content.address || 'Kottakkal')}&output=embed`}
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] border-0 filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                        allowFullScreen={false} 
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </section>
            );

            if (sectionId === 'custom') return (
              <React.Fragment key="custom">
                {content.custom_blocks_json?.length > 0 ? (
                  <section id="custom" className="py-24 px-6 border-t border-current border-opacity-10 text-center">
                    <div className="container mx-auto max-w-3xl">
                      {content.custom_blocks_json.map((block: any, idx: number) => {
                        if (block.type === 'heading') return <h2 key={idx} className="text-3xl md:text-5xl font-bold mb-8">{block.content}</h2>;
                        if (block.type === 'text' || block.type === 'paragraph') return <p key={idx} className="text-xl opacity-80 leading-relaxed mb-8">{block.content}</p>;
                        if (block.type === 'image') return <img loading="lazy" key={idx} src={block.url || block.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'} alt="Custom" className="max-w-full h-auto rounded-lg mb-8 mx-auto" />;
                        if (block.type === 'divider') return <hr key={idx} className="my-10 border-current opacity-20" />;
                        return null;
                      })}
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-10 py-4 border-2 border-current font-bold uppercase tracking-widest hover:-translate-y-1 transition-all mt-6"
                      >
                        Discover More
                      </button>
                    </div>
                  </section>
                ) : (
                  <section id="custom" className="py-24 px-6 border-t border-current border-opacity-10 text-center">
                    <div className="container mx-auto max-w-3xl">
                      <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Promise</h2>
                      <p className="text-xl opacity-80 leading-relaxed mb-10">
                        We believe that the right tools can inspire your best work. That's why we carefully source every item in our collection for unparalleled quality, thoughtful design, and sustainability.
                      </p>
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-10 py-4 border-2 border-current font-bold uppercase tracking-widest hover:-translate-y-1 transition-all"
                      >
                        Discover More
                      </button>
                    </div>
                  </section>
                )}
              </React.Fragment>
            );

            return null;
          })}
        </>
      ) : (
        <section className="py-24 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-6 max-w-6xl">
            <button onClick={() => { setShowAllProducts(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mb-8 font-modern font-semibold flex items-center text-blue-600 hover:underline">
              <ArrowRight size={16} className="rotate-180 mr-2" /> Back to Home
            </button>
            <h2 className="font-modern text-4xl font-extrabold text-slate-900 mb-12">All Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-4">
                    <img loading="lazy" src={p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                      alt={p.name || 'Product Image'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="font-modern font-semibold text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600">{p.name}</h3>
                  <p className="font-modern text-xs text-slate-500 mb-3 line-clamp-2">{p.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="font-modern font-bold text-lg text-slate-900">{p.price}</div>
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
      <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6 text-white">
                {content.settings_json?.logo_image ? (
                  <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 rounded-full object-cover bg-white" />
                ) : (
                  <Book size={24} />
                )}
                <span className="font-modern text-2xl font-bold">{siteName}</span>
              </div>
              <p className="font-modern text-sm text-slate-400 max-w-xs leading-relaxed">
                {content.about_text || "Supplying modern professionals with the tools they need to succeed."}
              </p>
            </div>
            <div className="space-y-4 font-modern text-sm">
              <h4 className="font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
              <div className="flex items-center gap-3"><Phone size={16} /> {content.contact_info?.phone || '+91 98765 43210'}</div>
              <div className="flex items-center gap-3"><Mail size={16} /> {content.contact_info?.email || 'hello@modernstat.com'}</div>
            </div>
            <div className="space-y-4 font-modern text-sm">
              <h4 className="font-bold text-white uppercase tracking-wider mb-4">Location</h4>
              <div className="flex items-start gap-3"><MapPin size={16} className="shrink-0 mt-1" /> <span className="leading-relaxed">{content.contact_info?.address || 'Tech Park, Sector 4, Kerala'}</span></div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Product Modal */}

      {/* Gallery Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm transition-opacity" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img loading="lazy" src={selectedImage} alt="Gallery view" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
