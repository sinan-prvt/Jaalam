import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Home, Key, MapPin, Phone, Mail, CheckCircle2, X, Clock, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from '../scrap/SocialIcons';

export default function LuxuryVillasTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'The Grand Estates';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Beverly Hills Mansion', price: '₹25 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', location: 'Beverly Hills, CA', beds: 6, baths: 8, sqft: '12,500' },
    { name: 'Malibu Beachfront Villa', price: '₹18 Cr', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', location: 'Malibu, CA', beds: 5, baths: 6, sqft: '8,200' },
    { name: 'Alpine Retreat', price: '₹12 Cr', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', location: 'Aspen, CO', beds: 4, baths: 4, sqft: '6,000' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F5F3ED] text-[#2C2C2C] font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
        .font-luxury { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Lato', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="absolute top-0 w-full z-50 bg-gradient-to-b from-black/70 to-transparent pt-6 pb-12 px-6">
        <div className="container mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain shrink-0" />
            ) : (
              <Key className="text-[#D4AF37] shrink-0" size={28} />
            )}
            <span className="font-luxury text-2xl tracking-[0.2em] uppercase truncate block">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase">
            <a href="#properties" className="hover:text-[#D4AF37] transition-colors">Estates</a>
            <a href="#about" className="hover:text-[#D4AF37] transition-colors">Philosophy</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </nav>
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-6 font-body text-xs tracking-[0.2em] uppercase text-white">
            <a href="#properties" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">Estates</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">Philosophy</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-6 w-full max-w-4xl">
          <h1 className="font-luxury text-5xl md:text-7xl font-bold mb-6 tracking-widest drop-shadow-lg">
            {content.hero_title || 'Redefining Luxury Living.'}
          </h1>
          <p className="font-body text-lg md:text-xl tracking-wider max-w-2xl mx-auto mb-10 text-gray-200">
            {content.hero_text || 'Exclusive access to the most coveted estates and architectural masterpieces.'}
          </p>
          <a href="#properties" className="inline-block border border-[#D4AF37] bg-[#D4AF37]/20 backdrop-blur hover:bg-[#D4AF37] hover:text-black text-white font-body text-sm tracking-[0.2em] uppercase py-4 px-10 transition-all duration-300">
            View Portfolio
          </a>
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="py-24 px-6 bg-[#F5F3ED]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-body text-[#8C7A50] text-xs tracking-[0.3em] uppercase mb-4 block">Exclusive Listings</span>
            <h2 className="font-luxury text-4xl text-[#2C2C2C] uppercase tracking-widest">Featured Estates</h2>
            <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {properties.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-white font-body text-xs tracking-wider px-3 py-1 z-20 shadow-md">
                    {p.price}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-luxury text-xl mb-3 text-[#2C2C2C] group-hover:text-[#D4AF37] transition-colors">{p.name}</h3>
                  {p.location && (
                    <div className="flex items-center gap-2 text-gray-500 font-body text-sm mb-6">
                      <MapPin size={14} /> {p.location}
                    </div>
                  )}
                  {p.description ? (
                    <div className="border-t border-gray-100 pt-6 font-body text-sm text-gray-600 line-clamp-3">
                      {p.description}
                    </div>
                  ) : (p.beds || p.baths || p.sqft) ? (
                    <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 font-body text-xs text-gray-600">
                      <div className="text-center">
                        <span className="block font-bold text-[#2C2C2C] text-lg mb-1">{p.beds}</span> Beds
                      </div>
                      <div className="text-center border-x border-gray-100">
                        <span className="block font-bold text-[#2C2C2C] text-lg mb-1">{p.baths}</span> Baths
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-[#2C2C2C] text-lg mb-1">{p.sqft}</span> Sq.Ft.
                      </div>
                    </div>
                  ) : null}
                  <button 
                    onClick={() => setSelectedProduct(p)}
                    className="w-full mt-6 bg-[#D4AF37] hover:bg-black text-white font-body tracking-[0.2em] uppercase text-xs py-4 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <button 
              onClick={() => setShowAllProducts(true)}
              className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-body tracking-[0.2em] uppercase text-sm py-4 px-12 transition-colors inline-block"
            >
              View All Estates
            </button>
          </div>
        </div>
      </section>

      
      
      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-2xl mx-auto text-black">
              {content.about_text || 'Welcome to our store! We are dedicated to bringing you the best quality products and services. Our team works hard to ensure customer satisfaction and continuous improvement.'}
            </p>
          </div>
        </section>
      )}

      {/* Injected Services Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-16 px-6 bg-black/5 border-b border-black/5">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services_json?.length ? content.services_json : [
                { title: 'Quality Assurance', description: 'We guarantee the highest quality in all our offerings.' },
                { title: 'Fast Delivery', description: 'Quick and reliable delivery to your doorstep.' },
                { title: 'Customer Support', description: '24/7 dedicated support for all your needs.' }
              ]).map((srv: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto bg-black/5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {srv.image ? <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-black">{srv.title}</h3>
                  <p className="opacity-75 text-black">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length ? content.gallery_json : [
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/5 cursor-pointer" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-20 px-6 bg-[#1A1A1A] border-t-4 border-[#D4AF37]">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-luxury text-3xl md:text-4xl text-white tracking-[0.2em] uppercase mb-4">Contact Us</h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 text-white font-body">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-[#D4AF37] mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Phone</h4>
                    <p className="text-lg">{content.contact_info?.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail size={24} className="text-[#D4AF37] mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Email</h4>
                    <p className="text-lg">{content.contact_info?.email || 'estates@luxury.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-[#D4AF37] mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Address</h4>
                    <p className="text-lg">{content.contact_info?.address || '1 Luxury Lane, Kerala'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-[#D4AF37] mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Office Hours</h4>
                    <p className="text-lg whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sat: 9AM - 8PM'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#222] p-8 md:p-12 border border-[#333]">
                <h3 className="font-luxury text-2xl mb-8 tracking-widest text-[#D4AF37] uppercase">Connect</h3>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube) ? (
                  <div className="flex gap-6">
                    {content.contact_info?.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <Facebook size={32} />
                      </a>
                    )}
                    {content.contact_info?.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <Instagram size={32} />
                      </a>
                    )}
                    {content.contact_info?.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <Twitter size={32} />
                      </a>
                    )}
                    {content.contact_info?.youtube && (
                      <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <Youtube size={32} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">Social media links will appear here once added in the editor.</p>
                )}
              </div>
            </div>

            <div className="mt-12 w-full h-[400px] bg-[#222] border border-[#333]">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '1 Luxury Lane, Kerala')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#111] text-white py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          {content?.settings_json?.logo_image ? (
            <img src={content.settings_json.logo_image} alt={siteName} className="mx-auto h-12 w-auto object-contain mb-6" />
          ) : (
            <Key className="mx-auto text-[#D4AF37] mb-6" size={32} />
          )}
          <h3 className="font-luxury text-2xl mb-6 tracking-[0.2em] uppercase">{siteName}</h3>
          <p className="font-body text-sm text-gray-500 tracking-wider leading-loose max-w-2xl mx-auto">
            {content.about_text || "A premier luxury real estate brokerage dedicated to providing exceptional service and unparalleled expertise in the high-end market."}
          </p>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={properties} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Image Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

