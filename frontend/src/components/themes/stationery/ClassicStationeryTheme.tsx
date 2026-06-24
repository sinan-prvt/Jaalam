import React from 'react';
import { BookOpen, Feather, Search, MapPin, Mail, Phone, Menu, X } from 'lucide-react';

export default function ClassicStationeryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'The Classic Quill';
  
  const hiddenSections = content.settings_json?.hidden_sections || [];
  const sectionOrder: string[] = content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Leather Bound Journal', price: '₹850', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Handcrafted leather journal with thick, acid-free pages.' },
    { name: 'Calligraphy Fountain Pen', price: '₹1200', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', description: 'Gold-plated nib with a classic wood finish body.' },
    { name: 'Wax Seal Kit', price: '₹650', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', description: 'Traditional wax seal kit with custom stamp options.' },
    { name: 'Parchment Paper Set', price: '₹400', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: 'Aged parchment paper for elegant letter writing.' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');
        .font-classic { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Lora', serif; }
      `}</style>

      {/* Header */}
      <header className="bg-[#FDFBF7] border-b border-[#E6DFD3] py-6 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between md:justify-center items-center relative">
          <div className="flex items-center gap-3 md:absolute md:left-6">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <Feather size={24} className="text-[#8C6D53]" />
            )}
            <span className="font-classic text-2xl md:text-3xl font-bold tracking-wide">{siteName}</span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-classic text-sm uppercase tracking-widest text-[#8C6D53]">
            <a href="#collection" onClick={() => setShowAllProducts(false)} className="hover:text-[#4A3B32] transition-colors py-2">Collection</a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[#4A3B32] transition-colors py-2 focus:outline-none uppercase tracking-widest">
                Explore <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-[#FDFBF7] shadow-xl border border-[#E6DFD3] py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 flex flex-col text-sm tracking-wider">
                <a href="#about" onClick={() => setShowAllProducts(false)} className="px-4 py-3 hover:bg-[#F5EFE6] text-[#8C6D53] hover:text-[#4A3B32] transition-colors text-center border-b border-[#E6DFD3]">Heritage</a>
                <a href="#services" onClick={() => setShowAllProducts(false)} className="px-4 py-3 hover:bg-[#F5EFE6] text-[#8C6D53] hover:text-[#4A3B32] transition-colors text-center border-b border-[#E6DFD3]">Services</a>
                <a href="#gallery" onClick={() => setShowAllProducts(false)} className="px-4 py-3 hover:bg-[#F5EFE6] text-[#8C6D53] hover:text-[#4A3B32] transition-colors text-center border-b border-[#E6DFD3]">Gallery</a>
                <a href="#custom" onClick={() => setShowAllProducts(false)} className="px-4 py-3 hover:bg-[#F5EFE6] text-[#8C6D53] hover:text-[#4A3B32] transition-colors text-center">Our Promise</a>
              </div>
            </div>
            <a href="#visit" onClick={() => setShowAllProducts(false)} className="hover:text-[#4A3B32] transition-colors py-2">Visit</a>
          </nav>
          
          <button 
            className="md:hidden p-2 text-[#8C6D53] focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#E6DFD3] shadow-xl font-classic text-sm font-semibold text-[#8C6D53] flex flex-col py-2 uppercase tracking-widest text-center">
            <a href="#collection" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-[#F5EFE6] hover:text-[#4A3B32] transition-colors border-b border-[#E6DFD3]">Collection</a>
            <a href="#about" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-[#F5EFE6] hover:text-[#4A3B32] transition-colors border-b border-[#E6DFD3]">Heritage</a>
            <a href="#services" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-[#F5EFE6] hover:text-[#4A3B32] transition-colors border-b border-[#E6DFD3]">Services</a>
            <a href="#gallery" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-[#F5EFE6] hover:text-[#4A3B32] transition-colors border-b border-[#E6DFD3]">Gallery</a>
            <a href="#custom" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-[#F5EFE6] hover:text-[#4A3B32] transition-colors border-b border-[#E6DFD3]">Our Promise</a>
            <a href="#visit" onClick={() => { setIsMobileMenuOpen(false); setShowAllProducts(false); }} className="px-6 py-4 hover:bg-[#F5EFE6] hover:text-[#4A3B32] transition-colors">Visit & Contact</a>
          </div>
        )}
      </header>

      {!showAllProducts ? (
        <>
          {sectionOrder.map((sectionId) => {
            if (hiddenSections.includes(sectionId)) return null;

            if (sectionId === 'hero') return (
              <section key="hero" className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                  <h1 className="font-classic text-5xl md:text-6xl font-bold mb-6 text-[#2C241E] leading-tight">
                    {content.hero_title || 'The Art of Fine Writing'}
                  </h1>
                  <p className="font-body text-lg text-[#6A5A4A] mb-12 max-w-2xl mx-auto italic">
                    {content.about_text || 'Discover our curated collection of premium fountain pens, handcrafted leather journals, and timeless stationery accessories.'}
                  </p>
                  <img src={content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=80'} alt="Classic Stationery" className="w-full h-96 object-cover shadow-2xl border-4 border-white" />
                </div>
              </section>
            );

            if (sectionId === 'about') return (
              <section key="about" id="about" className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 font-classic">{content.settings_json?.about_title || 'Our Heritage'}</h2>
                  <p className="text-lg opacity-80 leading-relaxed font-body">
                    {content.settings_json?.about_description || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. Our curated collections are designed to inspire.'}
                  </p>
                </div>
              </section>
            );

            if (sectionId === 'services') return (
              <section key="services" id="services" className="py-20 px-6 border-t border-current border-opacity-10">
                <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 font-classic">Our Services</h2>
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
                        <div key={idx} className="p-8 border border-current border-opacity-20 rounded-2xl hover:-translate-y-2 hover:border-opacity-100 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md">
                          {image && (
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden bg-[#F5EFE6] border-2 border-[#E6DFD3]">
                              <img src={image} alt={title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h3 className="text-2xl font-bold mb-4 font-classic">{title}</h3>
                          <p className="opacity-80 font-body">{description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

            if (sectionId === 'menu' || sectionId === 'products') return (
              <section key="collection" id="collection" className="py-24 bg-[#F5EFE6]">
                <div className="container mx-auto px-6 max-w-5xl">
                  <h2 className="font-classic text-3xl font-bold text-center mb-16 text-[#2C241E]">Curated Collection</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {products.slice(0, 4).map((p: any, i: number) => (
                      <div key={i} className="flex gap-6 group cursor-pointer bg-white p-4 shadow-sm hover:shadow-xl transition-shadow" onClick={() => setSelectedProduct(p)}>
                        <div className="w-1/2 aspect-[3/4] overflow-hidden bg-[#FDFBF7] shadow-inner p-2">
                          <img 
                            src={p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-125" 
                          />
                        </div>
                        <div className="w-1/2 flex flex-col justify-center">
                          <h3 className="font-classic text-xl font-bold text-[#2C241E] mb-2">{p.name}</h3>
                          <div className="font-classic text-[#8C6D53] italic mb-4 font-semibold">{p.price}</div>
                          <p className="font-body text-sm text-[#6A5A4A] leading-relaxed line-clamp-3">{p.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {products.length > 0 && (
                    <div className="mt-16 text-center">
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="inline-block bg-transparent border-2 border-[#2C241E] hover:bg-[#2C241E] hover:text-[#FDFBF7] text-[#2C241E] font-classic font-bold py-3 px-10 tracking-widest uppercase transition-colors cursor-pointer shadow-md hover:shadow-lg"
                      >
                        View Full Collection
                      </button>
                    </div>
                  )}
                </div>
              </section>
            );

            if (sectionId === 'gallery') return (
              <section key="gallery" id="gallery" className="py-20 px-6 border-t border-current border-opacity-10">
                <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 font-classic">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {(content.gallery_json?.length > 0 ? content.gallery_json : [
                       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
                       'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=400&q=80'
                     ]).map((item: any, idx: number) => {
                       const imgUrl = typeof item === 'string' ? item : (item.image || item.url || '');
                       return (
                        <div key={idx} className="aspect-square overflow-hidden group cursor-pointer border-4 border-white shadow-sm" onClick={() => setSelectedImage(imgUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80')}>
                          <img 
                            src={imgUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'} 
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'; }}
                            alt={`Gallery image ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter sepia-[.3] group-hover:sepia-0" 
                          />
                        </div>
                       );
                     })}
                  </div>
                </div>
              </section>
            );

            if (sectionId === 'contact') return (
              <section key="contact" id="visit" className="py-20 px-6 border-t border-current border-opacity-10 bg-[#F5EFE6]">
                <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 font-classic">Visit & Contact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 bg-white p-10 shadow-lg border border-[#E6DFD3]">
                      <h3 className="text-2xl font-bold mb-4 font-classic">Get in Touch</h3>
                      <div className="flex items-center gap-4 text-lg font-body">
                        <span className="opacity-50"><Phone size={20} /></span> 
                        <span className="font-semibold">{content.contact_info?.phone || '+91 98765 43210'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-lg font-body">
                        <span className="opacity-50"><Mail size={20} /></span> 
                        <span className="font-semibold">{content.contact_info?.email || 'heritage@classicquill.com'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-lg font-body">
                        <span className="opacity-50"><MapPin size={20} /></span> 
                        <span className="font-semibold">{content.contact_info?.address || 'Heritage Line, Fort Kochi, Kerala'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-lg font-body">
                        <span className="opacity-50">⏱️</span> 
                        <span className="font-semibold whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sat: 10:00 AM - 08:00 PM'}</span>
                      </div>
                      
                      <div className="pt-8 border-t border-current border-opacity-10">
                        <h3 className="text-xl font-bold mb-6 font-classic">Follow Our Legacy</h3>
                        <div className="flex gap-6 text-xl">
                          <a href={content.contact_info?.whatsapp || "#"} className="text-[#8C6D53] hover:text-[#4A3B32] hover:-translate-y-1 transition-all">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                          <a href={content.contact_info?.facebook || "#"} className="text-[#8C6D53] hover:text-[#4A3B32] hover:-translate-y-1 transition-all">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          <a href={content.contact_info?.instagram || "#"} className="text-[#8C6D53] hover:text-[#4A3B32] hover:-translate-y-1 transition-all">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="h-80 md:h-full min-h-[450px] border-8 border-white shadow-xl relative">
                      <iframe 
                        src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || content.address || 'Kottakkal')}&output=embed`}
                        className="absolute inset-0 w-full h-full border-0 filter grayscale-[0.8] contrast-[1.2] hover:grayscale-0 transition-all duration-700" 
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
                  <section id="custom" className="py-24 px-6 border-t border-[#E6DFD3] text-center bg-[#FDFBF7]">
                    <div className="container mx-auto max-w-3xl">
                      {content.custom_blocks_json.map((block: any, idx: number) => {
                        if (block.type === 'heading') return <h2 key={idx} className="font-classic text-3xl md:text-5xl font-bold mb-8 text-[#2C241E]">{block.content}</h2>;
                        if (block.type === 'text' || block.type === 'paragraph') return <p key={idx} className="font-body text-xl opacity-90 leading-relaxed mb-8 italic text-[#6A5A4A]">{block.content}</p>;
                        if (block.type === 'image') return <img key={idx} src={block.url || block.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'} alt="Custom" className="max-w-full h-auto border-4 border-white shadow-lg mb-8 mx-auto" />;
                        if (block.type === 'divider') return <div key={idx} className="flex justify-center my-10"><Feather className="text-[#E6DFD3]" size={32} /></div>;
                        return null;
                      })}
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="mt-8 inline-block bg-transparent border-2 border-[#2C241E] hover:bg-[#2C241E] hover:text-[#FDFBF7] text-[#2C241E] font-classic font-bold py-3 px-10 tracking-widest uppercase transition-colors cursor-pointer shadow-md hover:shadow-lg"
                      >
                        Explore More
                      </button>
                    </div>
                  </section>
                ) : (
                  <section id="custom" className="py-24 px-6 border-t border-[#E6DFD3] text-center bg-[#FDFBF7]">
                    <div className="container mx-auto max-w-3xl">
                      <h2 className="font-classic text-3xl md:text-5xl font-bold mb-8 text-[#2C241E]">Our Promise</h2>
                      <p className="font-body text-xl opacity-90 leading-relaxed mb-10 italic text-[#6A5A4A]">
                        We believe that the right tools can inspire your best work. That's why we carefully source every item in our collection for unparalleled quality, thoughtful design, and sustainability.
                      </p>
                      <button 
                        onClick={(e) => { e.preventDefault(); setShowAllProducts(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="inline-block bg-transparent border-2 border-[#2C241E] hover:bg-[#2C241E] hover:text-[#FDFBF7] text-[#2C241E] font-classic font-bold py-3 px-10 tracking-widest uppercase transition-colors cursor-pointer shadow-md hover:shadow-lg"
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
        <section className="py-24 bg-[#F5EFE6] min-h-screen">
          <div className="container mx-auto px-6 max-w-6xl">
            <button 
              onClick={() => { setShowAllProducts(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mb-8 flex items-center gap-2 text-[#8C6D53] hover:text-[#2C241E] font-classic font-bold uppercase tracking-widest transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Heritage
            </button>
            <h2 className="font-classic text-4xl md:text-6xl font-bold text-[#2C241E] mb-4">Complete Collection</h2>
            <p className="font-body text-lg text-[#6A5A4A] mb-12 italic">All our timeless writing instruments and stationery.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p: any, i: number) => (
                <div key={i} className="bg-white p-6 shadow-md hover:shadow-2xl transition-all group cursor-pointer border border-[#E6DFD3]" onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-[4/5] bg-[#FDFBF7] mb-6 overflow-hidden relative">
                    <img 
                      src={p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter contrast-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-classic uppercase tracking-widest text-sm border border-white px-4 py-2 backdrop-blur-sm">View Details</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-classic text-xl font-bold text-[#2C241E] mb-2">{p.name}</h3>
                    <div className="font-classic text-[#8C6D53] italic font-semibold">{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#2C241E] text-[#D8CBB6] py-16 mt-auto">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 rounded-full object-cover bg-white" />
            ) : (
              <Feather size={32} />
            )}
          </div>
          <p className="font-body italic max-w-md mx-auto mb-12 leading-relaxed">
            {content.about_text || "Preserving the tradition of thoughtful correspondence and elegant desk accessories since 1994."}
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 font-classic text-sm tracking-widest uppercase border-t border-[#4A3B32] pt-8">
            <div className="flex items-center gap-2 text-[#8C6D53] hover:text-[#D8CBB6] transition-colors"><Phone size={14} /> {content.contact_info?.phone || '+91 98765 43210'}</div>
            <div className="flex items-center gap-2 text-[#8C6D53] hover:text-[#D8CBB6] transition-colors"><Mail size={14} /> {content.contact_info?.email || 'heritage@classicquill.com'}</div>
            <div className="flex items-center gap-2 text-[#8C6D53] hover:text-[#D8CBB6] transition-colors"><MapPin size={14} /> {content.contact_info?.address || 'Heritage Line, Fort Kochi, Kerala'}</div>
          </div>
          <div className="mt-12 font-classic text-xs text-[#6A5A4A] tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-[#2C241E]/80 backdrop-blur-md transition-opacity" onClick={() => setSelectedProduct(null)}>
          <div className="bg-[#FDFBF7] rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-4 border-white scrollbar-hide relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 p-2 text-[#8C6D53] hover:text-[#2C241E] bg-white rounded-full shadow-md transition-colors">
              <X size={20} />
            </button>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto md:h-full bg-[#F5EFE6] relative">
                <img 
                  src={selectedProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover md:absolute inset-0"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center min-h-[300px] mt-4 md:mt-0">
                <div className="flex items-center gap-2 text-[#8C6D53] mb-4"><Feather size={16} /> <span className="font-classic text-xs tracking-widest uppercase">Classic Collection</span></div>
                <h2 className="font-classic text-3xl md:text-4xl font-bold text-[#2C241E] mb-3 leading-tight">{selectedProduct.name}</h2>
                <div className="font-classic font-bold text-2xl text-[#8C6D53] mb-6">{selectedProduct.price}</div>
                <div className="w-12 h-1 bg-[#E6DFD3] mb-6"></div>
                <p className="font-body text-[#6A5A4A] text-lg leading-relaxed whitespace-pre-wrap italic">
                  {selectedProduct.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#2C241E]/95 backdrop-blur-sm transition-opacity" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 md:-right-12 text-[#D8CBB6] hover:text-white p-2 border border-[#D8CBB6] rounded-full">
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Gallery view" className="max-w-full max-h-[85vh] object-contain border-8 border-white shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
