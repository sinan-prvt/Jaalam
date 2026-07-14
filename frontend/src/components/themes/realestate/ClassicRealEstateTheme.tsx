import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Home, MapPin, Phone, Mail, Award, Clock, X, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from '../scrap/SocialIcons';

export default function ClassicRealEstateTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Heritage Homes';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Colonial Estate', price: '₹8.5 Cr', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', location: 'Heritage District', details: '5 Beds | 4 Baths | Large Garden' },
    { name: 'Suburban Family Home', price: '₹2.2 Cr', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', location: 'Oakwood Suburbs', details: '4 Beds | 3 Baths | 2 Car Garage' },
    { name: 'Country Manor', price: '₹12 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', location: 'Countryside', details: '6 Beds | 5 Baths | Pool' },
    { name: 'Classic Townhouse', price: '₹3.8 Cr', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', location: 'City Historic Center', details: '3 Beds | 2.5 Baths | Terrace' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FDFBF7] text-[#2C3E50] font-serif border-t-8 border-[#1A252C]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+Pro:wght@400;600&display=swap');
        .font-classic { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Source Sans Pro', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="py-6 px-6 border-b border-[#EAE3D2] bg-white">
        <div className="container mx-auto flex justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <Home className="text-[#1A252C]" size={32} />
            )}
            <span className="font-classic text-3xl font-bold tracking-tight text-[#1A252C]">{siteName}</span>
          </div>
          <div className="hidden md:flex gap-8 font-body font-semibold text-[#5A6C7D] uppercase tracking-wider text-sm">
            <a href="#featured" className="hover:text-[#1A252C] transition-colors">Featured Listings</a>
            <a href="#about" className="hover:text-[#1A252C] transition-colors">Our History</a>
            <div className="flex items-center gap-2 text-[#1A252C]">
               <Phone size={16} />
               <span>{content.contact_info?.phone || '1-800-ESTATE'}</span>
            </div>
          </div>
          <button className="md:hidden text-[#1A252C]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 w-full bg-white border-b border-[#EAE3D2] shadow-xl py-6 px-6 flex flex-col gap-6 font-body font-semibold text-[#5A6C7D] uppercase tracking-wider text-sm z-50">
            <a href="#featured" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1A252C] transition-colors">Featured Listings</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1A252C] transition-colors">Our History</a>
            <div className="flex items-center gap-2 text-[#1A252C]">
               <Phone size={16} />
               <span>{content.contact_info?.phone || '1-800-ESTATE'}</span>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-6 text-[#8B9DAE]">
               <Award size={20} />
               <span className="font-body font-semibold uppercase tracking-widest text-sm">Trusted Professionals</span>
            </div>
            <h1 className="font-classic text-5xl md:text-6xl font-bold mb-6 text-[#1A252C] leading-tight">
              {content.hero_title || 'Tradition. Trust. Real Estate.'}
            </h1>
            <p className="font-body text-lg text-[#5A6C7D] mb-10 leading-relaxed max-w-md">
              {content.hero_text || 'Guiding families to their dream homes with integrity and generations of local market expertise.'}
            </p>

          </div>
          <div className="w-full md:w-1/2 relative p-4 bg-white border border-[#EAE3D2] shadow-sm">
             <img loading="lazy" src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" alt="Classic Home" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="featured" className="py-20 px-6 bg-[#EFECE5]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-classic text-4xl font-bold text-[#1A252C] mb-4">Featured Listings</h2>
            <p className="font-body text-[#5A6C7D]">A selection of our finest properties currently on the market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((p: any, i: number) => (
              <div key={i} className="bg-white border border-[#EAE3D2] p-4 flex flex-col md:flex-row gap-6 group hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="w-full md:w-3/5 py-2 flex flex-col justify-between">
                  <div>
                    <h3 className="font-classic font-bold text-2xl text-[#1A252C] mb-2 group-hover:text-[#3B5266] transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-1 text-[#8B9DAE] font-body text-sm mb-4">
                      <MapPin size={16} /> {p.location}
                    </div>
                  </div>
                  <div>
                    <div className="font-body text-[#5A6C7D] mb-4 pb-4 border-b border-[#EAE3D2] text-sm">
                      {p.details}
                    </div>
                    <div className="font-classic font-bold text-2xl text-[#1A252C] mb-4">
                      {p.price}
                    </div>
                    <button onClick={() => setSelectedProduct(p)} className="bg-[#1A252C] hover:bg-[#2C3E50] text-white font-body font-semibold py-2 px-6 transition-colors shadow-sm text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button onClick={() => setShowAllProducts(true)} className="border-2 border-[#1A252C] text-[#1A252C] hover:bg-[#1A252C] hover:text-white font-body font-bold py-3 px-10 transition-colors uppercase tracking-widest text-sm">
              View All Listings
            </button>
          </div>
        </div>
      </section>

      
      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-20 px-6 bg-white border-b border-[#EAE3D2]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-classic font-bold mb-6 text-[#1A252C]">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
            <div className="w-16 h-1 bg-[#1A252C] mx-auto mb-8"></div>
            <p className="text-lg text-[#5A6C7D] leading-relaxed max-w-2xl mx-auto font-body">
              {content.about_text || 'Welcome to our agency. We are dedicated to bringing you the best real estate options available. Our team works hard to ensure client satisfaction and continuous trust.'}
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
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-20 px-6 bg-white border-t border-[#EAE3D2]">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-classic text-4xl font-bold text-[#1A252C] mb-4">Contact Our Office</h2>
              <p className="font-body text-[#5A6C7D]">We welcome your inquiries and look forward to assisting you.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 border border-[#EAE3D2] p-8 md:p-12 shadow-sm bg-[#FDFBF7]">
              <div className="space-y-8 font-body">
                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-[#1A252C] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A252C] uppercase tracking-wider mb-1 text-sm">Telephone</h4>
                    <p className="text-lg text-[#5A6C7D]">{content.contact_info?.phone || '1-800-ESTATE'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail size={24} className="text-[#1A252C] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A252C] uppercase tracking-wider mb-1 text-sm">Electronic Mail</h4>
                    <p className="text-lg text-[#5A6C7D] break-all">{content.contact_info?.email || 'contact@heritagehomes.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-[#1A252C] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A252C] uppercase tracking-wider mb-1 text-sm">Office Location</h4>
                    <p className="text-lg text-[#5A6C7D]">{content.contact_info?.address || '100 Main Street, Kerala'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8 font-body">
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-[#1A252C] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A252C] uppercase tracking-wider mb-1 text-sm">Business Hours</h4>
                    <p className="text-lg text-[#5A6C7D] whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sat: 9:00 AM - 6:00 PM'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#1A252C] uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                    Social Presence
                  </h4>
                  {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube) ? (
                    <div className="flex gap-4">
                      {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#EAE3D2] rounded-full flex items-center justify-center text-[#1A252C] hover:bg-[#1A252C] hover:text-white transition-colors"><Facebook size={18} /></a>}
                      {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#EAE3D2] rounded-full flex items-center justify-center text-[#1A252C] hover:bg-[#1A252C] hover:text-white transition-colors"><Instagram size={18} /></a>}
                      {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#EAE3D2] rounded-full flex items-center justify-center text-[#1A252C] hover:bg-[#1A252C] hover:text-white transition-colors"><Twitter size={18} /></a>}
                      {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#EAE3D2] rounded-full flex items-center justify-center text-[#1A252C] hover:bg-[#1A252C] hover:text-white transition-colors"><Youtube size={18} /></a>}
                    </div>
                  ) : (
                    <p className="text-[#5A6C7D] text-sm">Social links not configured.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-16 w-full h-[400px] border border-[#EAE3D2] p-2 bg-white shadow-sm">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '100 Main Street, Kerala')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
      <footer id="about" className="bg-[#1A252C] text-[#EFECE5] py-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          {content?.settings_json?.logo_image ? (
            <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="mx-auto h-12 w-auto object-contain mb-6 filter brightness-0 invert opacity-70" />
          ) : (
            <Home className="mx-auto text-[#8B9DAE] mb-6" size={40} />
          )}
          <h3 className="font-classic text-3xl mb-6">{siteName}</h3>
          <p className="font-body max-w-2xl mx-auto mb-12 text-[#8B9DAE] leading-relaxed">
            {content.about_text || "With over 35 years of experience, we pride ourselves on building lasting relationships and providing unmatched real estate services to our community."}
          </p>
          <div className="border-t border-[#2C3E50] pt-12">
            <p className="font-body text-[#8B9DAE] text-sm uppercase tracking-widest">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={properties} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Image Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A252C]/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-[#EFECE5]/70 hover:text-[#EFECE5] transition-colors">
            <X size={32} />
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain border-4 border-white shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

