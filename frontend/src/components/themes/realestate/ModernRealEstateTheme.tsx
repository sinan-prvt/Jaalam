import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Home, MapPin, ChevronRight, Phone, Mail, Clock, X, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from '../scrap/SocialIcons';

export default function ModernRealEstateTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Haven Real Estate';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Modern Family Home', price: '₹1.5 Cr', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', location: 'Suburbs', beds: 4, baths: 3 },
    { name: 'Minimalist Townhouse', price: '₹2.1 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', location: 'City Center', beds: 3, baths: 2 },
    { name: 'Lakefront Cabin', price: '₹85 L', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80', location: 'Lake District', beds: 2, baths: 1 },
    { name: 'Contemporary Villa', price: '₹3.2 Cr', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', location: 'Hills', beds: 5, baths: 4 }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-800 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        .font-modern { font-family: 'Poppins', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Home className="text-white" size={24} />
              </div>
            )}
            <span className="font-modern font-bold text-xl text-slate-900">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-modern text-sm font-medium">
            <a href="#properties" className="text-slate-600 hover:text-emerald-500 transition-colors">Properties</a>
            <a href="#about" className="text-slate-600 hover:text-emerald-500 transition-colors">About</a>
            <a href="#contact" className="text-slate-600 hover:text-emerald-500 transition-colors">Contact</a>
          </nav>
          <button className="md:hidden text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 px-6 flex flex-col gap-4 font-modern text-sm font-medium text-slate-600">
            <a href="#properties" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-500 transition-colors">Properties</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-500 transition-colors">About</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-12 px-6">
        <div className="container mx-auto bg-emerald-50 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative">
          <div className="w-full md:w-1/2 p-10 md:p-16 z-10">
            <h1 className="font-modern text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {content.hero_title || 'Find your perfect place.'}
            </h1>
            <p className="font-modern text-slate-600 text-lg max-w-md">
              {content.hero_text || 'Discover homes that match your lifestyle. Buying or renting, we make it easy.'}
            </p>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-full min-h-[500px] bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center md:absolute right-0 top-0">
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="buy" className="py-20 px-6 container mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-modern text-3xl font-bold text-slate-900 mb-2">Explore Homes</h2>
            <p className="font-modern text-slate-500">Handpicked properties for you</p>
          </div>
          <button onClick={() => setShowAllProducts(true)} className="text-emerald-500 font-modern font-semibold flex items-center gap-1 hover:gap-2 transition-all">
             See All <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden relative p-3 pb-0">
                <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-slate-900 font-modern font-bold text-sm px-3 py-1 rounded-lg shadow-sm">
                  {p.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-modern font-bold text-lg text-slate-900 mb-1 truncate">{p.name}</h3>
                <div className="flex items-center gap-1 text-slate-500 font-modern text-sm mb-4">
                  <MapPin size={14} /> {p.location}
                </div>
                 <div className="flex gap-4 border-t border-slate-100 pt-4 text-slate-600 font-modern text-sm mb-4">
                   <div className="flex items-center gap-1"><span className="font-bold text-slate-900">{p.beds}</span> Beds</div>
                   <div className="flex items-center gap-1"><span className="font-bold text-slate-900">{p.baths}</span> Baths</div>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }} className="w-full bg-slate-50 hover:bg-emerald-50 text-emerald-600 font-modern font-semibold py-2 rounded-lg transition-colors border border-emerald-100">
                   View Details
                 </button>
              </div>
            </div>
          ))}
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
                    {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
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
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-20 px-6 bg-slate-900 text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-modern text-3xl md:text-5xl font-bold mb-4">Let's Talk.</h2>
              <p className="opacity-80 max-w-lg mx-auto font-modern">Get in touch with us for any inquiries or support. We're here to help.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 font-modern">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-400 font-semibold mb-1">Call Us</h4>
                    <p className="text-lg font-medium">{content.contact_info?.phone || '98765 43210'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-400 font-semibold mb-1">Email Us</h4>
                    <p className="text-lg font-medium break-all">{content.contact_info?.email || 'hello@haven.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-400 font-semibold mb-1">Visit Us</h4>
                    <p className="text-lg font-medium whitespace-pre-wrap">{content.contact_info?.address || 'Tech Hub, Kerala'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-8 rounded-3xl">
                <div className="flex items-start gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-400 font-semibold mb-1">Working Hours</h4>
                    <p className="text-lg font-medium whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Fri: 9AM - 6PM'}</p>
                  </div>
                </div>
                
                <h4 className="text-sm text-slate-400 font-semibold mb-4">Connect With Us</h4>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube) ? (
                  <div className="flex gap-4">
                    {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-slate-300"><Facebook size={20} /></a>}
                    {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-slate-300"><Instagram size={20} /></a>}
                    {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-slate-300"><Twitter size={20} /></a>}
                    {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-slate-300"><Youtube size={20} /></a>}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Social media links will appear here once added in the editor.</p>
                )}
              </div>
            </div>
            
            <div className="mt-12 w-full h-[400px] rounded-3xl overflow-hidden bg-slate-800">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Tech Hub, Kerala')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
      <footer id="sell" className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 font-modern">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              {content?.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <div className="bg-emerald-500 p-2 rounded-lg inline-block">
                  <Home className="text-white" size={20} />
                </div>
              )}
              <span className="font-bold text-xl text-slate-900">{siteName}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
              {content.about_text || "We're on a mission to change how real estate works. Transparent, digital, and customer-first."}
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          </div>
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
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

