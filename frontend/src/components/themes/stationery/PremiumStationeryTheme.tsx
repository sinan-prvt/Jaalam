import AllProductsModal from '../../shared/AllProductsModal';
import React, { useState } from 'react';
import { PenTool, Diamond, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';
import ContactForm from '../shared/ContactForm';

import ContactExtras from '../shared/ContactExtras';
import ThemeStats from '../shared/ThemeStats';
export default function PremiumStationeryTheme({ website, content }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Luxe Stationery Co.';
  const hiddenFields = content?.settings_json?.hidden_elements || [];
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: '18K Gold Nib Fountain Pen', price: '₹15,000', image: 'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80', description: 'Masterfully crafted resin body with solid 18k gold nib.' },
    { name: 'Executive Leather Compendium', price: '₹4,500', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Full-grain Italian leather folio.' },
    { name: 'Crystal Inkwell', price: '₹2,200', image: 'https://images.unsplash.com/photo-1590740924976-13a8fc6470aa?auto=format&fit=crop&w=600&q=80', description: 'Hand-cut crystal inkwell with silver lid.' },
    { name: 'Bespoke Stationery Set', price: '₹3,000', image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', description: 'Custom monogrammed Egyptian cotton paper.' }
  ];

  const defaultServices = [
    { title: 'Custom Orders', description: 'Personalized stationery tailored to your exact specifications.' },
    { title: 'Corporate Gifting', description: 'Premium supplies for your esteemed colleagues and clients.' },
    { title: 'Complimentary Wrapping', description: 'Elegant presentation for those special occasions.' }
  ];
  const services = content.services_json?.length > 0 ? content.services_json : defaultServices;

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#0A0A0A] text-[#D4AF37] font-sans selection:bg-[#D4AF37] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@200;300;400;600&display=swap');
        .font-luxury { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt="Logo" className="h-8 w-8 object-contain" /> : <Diamond size={24} className="text-[#D4AF37]" />}
            <span className="font-luxury text-2xl tracking-[0.2em] uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#collection" className="hover:text-[#D4AF37] transition-colors">The Collection</a>
            <a href="#bespoke" className="hover:text-[#D4AF37] transition-colors">Bespoke Services</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">Boutique</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <><section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" style={{ backgroundImage: `url(${content.settings_json?.hero_image || content.hero_image || 'https://images.unsplash.com/photo-1497032205567-50458fd251f6?auto=format&fit=crop&w=1600&q=80'})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          {!hiddenFields.includes("hero_title") && (
              <h1 className="font-luxury text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
            {content.hero_title || 'Elevate Your Writing.'}
          </h1>
              )}
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>
          {!hiddenFields.includes("hero_description") && (
              <p className="font-body text-sm md:text-base text-gray-300 font-light tracking-widest leading-loose mb-12">
            {content.hero_text || content.about_text || 'Discover our exclusive range of fine writing instruments and luxury desk accessories crafted for discerning individuals.'}
          </p>
              )}
          <a href="#collection" className="inline-flex items-center gap-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-10 py-4 font-body uppercase tracking-[0.2em] text-xs transition-all duration-500">
            Explore Collection <ChevronRight size={14} />
          </a>
        </div>
      </section>
      <ThemeStats content={content} /></>

      {/* Products Grid */}
      <section id="collection" className="py-32 px-6 bg-[#0A0A0A]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-luxury text-4xl md:text-5xl text-center mb-20 text-white tracking-wider">Curated Excellence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {products.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden mb-8 border border-[#D4AF37]/10">
                  <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-luxury text-2xl text-white mb-2 tracking-wide">{p.name}</h3>
                  <p className="font-body text-xs text-gray-400 tracking-wider mb-4 leading-relaxed max-w-xs mx-auto">{p.description}</p>
                  <div className="font-body text-sm tracking-widest text-[#D4AF37]">{p.price}</div>
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

      {/* About */}
      <section id="about" className="py-32 px-6 bg-[#050505]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-luxury text-4xl md:text-5xl mb-8 tracking-widest text-white">{content.settings_json?.about_title || content.about_title || 'The Heritage'}</h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-10"></div>
          <p className="font-body text-sm text-gray-400 tracking-widest leading-loose">
            {content.settings_json?.about_description || content.about_text || 'We are dedicated to providing the highest quality stationery products for your creative and professional needs. Our curated collections are designed to inspire.'}
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#D4AF37]/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-luxury text-4xl md:text-5xl text-center mb-8 tracking-widest text-white">Bespoke Services</h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-20"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {services.map((service: any, i: number) => (
            <div key={i} className="p-12 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-700 cursor-pointer group bg-[#050505]">
              {service.image && <img loading="lazy" src={service.image || undefined} alt={service.title} className="w-full h-40 object-cover mb-6" />}
              <h3 className="font-luxury text-2xl text-[#D4AF37] mb-6 tracking-wide group-hover:scale-105 transition-transform duration-500">{service.title || service.name}</h3>
              <p className="font-body text-xs text-gray-400 tracking-widest leading-relaxed">{service.description}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Menus */}
      <section id="menus" className="py-32 px-6 bg-[#050505] border-t border-[#D4AF37]/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-luxury text-4xl md:text-5xl mb-8 tracking-widest text-white">Categories</h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-16"></div>
          <div className="flex flex-wrap justify-center gap-6">
             {['Fine Pens', 'Leather Journals', 'Desk Architecture', 'Artisan Paper', 'Inks & Refills'].map((item, idx) => (
                <div key={idx} className="px-8 py-4 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 cursor-pointer font-body uppercase tracking-[0.2em] text-xs text-gray-300">
                  {item}
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#D4AF37]/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-luxury text-4xl md:text-5xl text-center mb-8 tracking-widest text-white">Atelier</h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-20"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {(content.gallery_json?.length > 0 ? content.gallery_json.map((g: any) => (typeof g === 'string' ? g : g.url || g.image)) : [
               'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80',
               'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
               'https://images.unsplash.com/photo-1590740924976-13a8fc6470aa?auto=format&fit=crop&w=600&q=80',
               'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80'
             ]).map((img: string, idx: number) => (
                <div key={idx} className="aspect-[4/5] overflow-hidden group">
                  <img loading="lazy" src={img} alt="Gallery image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100" />
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact-info" className="py-32 px-6 bg-[#050505] border-t border-[#D4AF37]/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-luxury text-4xl md:text-5xl text-center mb-8 tracking-widest text-white">The Boutique</h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-20"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
              <div className="border-l-2 border-[#D4AF37] pl-8">
                <h3 className="text-[#D4AF37] mb-4">Concierge</h3>
                {!hiddenFields.includes('contact_phone') && (
                              <div className="mb-2">{content.contact_info?.phone || '+91 98765 43210'}</div>
                              )}
                {!hiddenFields.includes('contact_email') && (
                              <div>{content.contact_info?.email || 'concierge@luxe.co'}</div>
                              )}
              </div>
              <div className="border-l-2 border-[#D4AF37] pl-8">
                <h3 className="text-[#D4AF37] mb-4">Location</h3>
                {!hiddenFields.includes('contact_address') && (
                              <div className="leading-relaxed max-w-xs">{content.contact_info?.address || '1 Luxury Avenue, Design District, Kerala'}</div>
                              )}
              </div>
              
              <div className="pt-12 border-t border-[#D4AF37]/20 flex gap-8">
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">INSTAGRAM</a>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">PINTEREST</a>
                  <a href="#" className="hover:text-[#D4AF37] transition-colors">JOURNAL</a>
              </div>
            </div>
            <div className="h-96 border border-[#D4AF37]/30 p-2 relative">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || siteName)}&output=embed`} 
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] border-0 filter grayscale invert opacity-50 hover:opacity-80 transition-opacity duration-1000" 
                allowFullScreen={false} 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Section */}
      <section id="custom" className="py-32 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#050505] text-center border-t border-[#D4AF37]/10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-luxury text-4xl md:text-5xl mb-8 tracking-widest text-white">Our Promise</h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-10"></div>
          <p className="font-body text-sm text-gray-400 tracking-widest leading-loose mb-16">
            We believe that the right tools can inspire your best work. That's why we carefully source every item in our collection for unparalleled quality, thoughtful design, and sustainability.
          </p>
          <a href="#collection" className="inline-flex items-center gap-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-10 py-4 font-body uppercase tracking-[0.2em] text-xs transition-all duration-500">
            Discover More
          </a>
        </div>
      </section>

      
      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url || undefined} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className="border-t border-[#D4AF37]/20 py-24 px-6 bg-[#050505]">
        <div className="container mx-auto max-w-4xl text-center">
          <PenTool size={32} className="mx-auto mb-8 text-[#D4AF37] opacity-50" />
          <h3 className="font-luxury text-3xl text-white mb-8 tracking-widest uppercase">{siteName}</h3>
          
          <div className="flex flex-col md:flex-row justify-center gap-12 font-body text-xs tracking-widest text-gray-400 mb-16">
            <div className="flex flex-col items-center gap-3">
              <Phone size={16} className="text-[#D4AF37]" />
              {!hiddenFields.includes('contact_phone') && (
                          <span>{content.contact_info?.phone || 'Premium Support: +91 98765 43210'}</span>
                          )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin size={16} className="text-[#D4AF37]" />
              {!hiddenFields.includes('contact_address') && (
                          <span>{content.contact_info?.address || '1 Luxury Avenue, Kerala'}</span>
                          )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <Mail size={16} className="text-[#D4AF37]" />
              {!hiddenFields.includes('contact_email') && (
                          <span>{content.contact_info?.email || 'concierge@luxe.co'}</span>
                          )}
            </div>
          </div>
          
          <div className="text-[10px] font-body tracking-[0.3em] text-gray-600 uppercase">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      
            <div className="mt-12 w-full z-20 relative"><ContactForm websiteId={website.id} /></div>
            <div className="px-6 pb-2">
              <ContactExtras content={content} />
            </div>
          </footer>

      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
    </div>
  );
}

