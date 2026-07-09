import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Briefcase, MapPin, Building, Phone, Mail, Clock, X, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from '../scrap/SocialIcons';

export default function CommercialTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Apex Commercial';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Financial District Tower', price: 'Lease: ₹250/sqft', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', location: 'CBD', type: 'Office Space' },
    { name: 'Tech Park Campus', price: 'Lease: ₹180/sqft', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', location: 'Silicon Valley', type: 'Tech Hub' },
    { name: 'Premium Retail Outlet', price: 'Lease: ₹400/sqft', image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&w=800&q=80', location: 'High Street', type: 'Retail' },
    { name: 'Logistics Warehouse', price: 'Lease: ₹80/sqft', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', location: 'Industrial Area', type: 'Warehouse' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F8F9FA] text-[#212529] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Open+Sans:wght@400;600&display=swap');
        .font-corp { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Open Sans', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-4 border-[#004B87] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <Briefcase className="text-[#004B87]" size={28} />
            )}
            <span className="font-corp font-extrabold text-2xl tracking-tighter text-[#004B87] uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-corp font-semibold text-sm text-[#495057]">
            <a href="#properties" className="hover:text-[#004B87] transition-colors">Properties</a>
            <a href="#services" className="hover:text-[#004B87] transition-colors">Services</a>
            <a href="#contact" className="bg-[#004B87] text-white px-5 py-2 hover:bg-[#003366] transition-colors">Contact Agent</a>
          </nav>
          <button className="md:hidden text-[#004B87]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-[#004B87] shadow-xl py-6 px-6 flex flex-col gap-5 font-corp font-semibold text-sm text-[#495057]">
            <a href="#properties" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#004B87] transition-colors">Properties</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#004B87] transition-colors">Services</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#004B87] text-white px-5 py-2 hover:bg-[#003366] transition-colors text-center">Contact Agent</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative bg-[#004B87] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full">
            <h1 className="font-corp text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-3xl">
              {content.hero_title || 'Strategic Spaces for Business Growth.'}
            </h1>
            <p className="font-body text-lg md:text-xl text-[#E9ECEF] mb-10 max-w-2xl leading-relaxed">
              {content.hero_text || 'Premium office spaces, retail locations, and industrial properties for modern enterprises.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 font-corp font-semibold">
              <a href="#properties" className="inline-block text-center bg-white text-[#004B87] px-8 py-4 hover:bg-[#F8F9FA] transition-colors shadow-lg">
                Find Office Space
              </a>
              <a href="#contact" className="inline-block text-center border-2 border-white text-white px-8 py-4 hover:bg-white/10 transition-colors">
                List Your Property
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="py-20 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-corp text-3xl font-extrabold text-[#212529] mb-4">Featured Commercial Properties</h2>
          <div className="w-24 h-1 bg-[#004B87] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((p: any, i: number) => (
            <div key={i} className="bg-white border border-[#DEE2E6] hover:shadow-xl transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-[#004B87] text-white font-corp font-bold text-xs px-3 py-1 shadow-md">
                  {p.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-corp font-bold text-lg text-[#212529] mb-2 line-clamp-1">{p.name}</h3>
                <div className="flex items-center gap-2 text-[#6C757D] font-body text-sm mb-4">
                  <MapPin size={16} className="text-[#004B87]" /> {p.location}
                </div>
                <div className="border-t border-[#DEE2E6] pt-4 flex justify-between items-center mb-4">
                  <span className="font-corp font-bold text-[#004B87]">{p.price}</span>
                  <Building className="text-[#CED4DA]" size={20} />
                </div>
                <button onClick={() => setSelectedProduct(p)} className="w-full bg-[#F8F9FA] hover:bg-[#004B87] text-[#004B87] hover:text-white font-corp font-bold py-2 transition-colors border border-[#DEE2E6] hover:border-[#004B87]">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button onClick={() => setShowAllProducts(true)} className="bg-[#004B87] hover:bg-[#003366] text-white px-8 py-3 font-corp font-bold transition-colors">
            View All Properties
          </button>
        </div>
      </section>

      
      
      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-16 px-6 bg-white border-b border-[#DEE2E6]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-corp font-bold mb-6 text-[#212529]">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
            <p className="text-lg text-[#6C757D] leading-relaxed max-w-2xl mx-auto font-body">
              {content.about_text || 'Welcome to our firm! We are dedicated to bringing you the best commercial real estate opportunities. Our team works hard to ensure client satisfaction and continuous success.'}
            </p>
          </div>
        </section>
      )}

      {/* Injected Services Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-16 px-6 bg-[#F8F9FA] border-b border-[#DEE2E6]">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-corp font-bold mb-10 text-center text-[#212529]">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services_json?.length ? content.services_json : [
                { title: 'Property Management', description: 'Comprehensive management for your commercial assets.' },
                { title: 'Leasing & Sales', description: 'Expert brokerage services for buyers, sellers, and tenants.' },
                { title: 'Investment Advisory', description: 'Strategic insights to maximize your real estate portfolio.' }
              ]).map((srv: any, i: number) => (
                <div key={i} className="bg-white p-8 border border-[#DEE2E6] hover:shadow-lg transition-shadow text-center">
                  <div className="w-16 h-16 mx-auto bg-[#004B87]/10 text-[#004B87] rounded-full flex items-center justify-center mb-6 overflow-hidden">
                    {srv.image ? <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <Briefcase size={28} />}
                  </div>
                  <h3 className="font-corp font-bold text-xl mb-3 text-[#212529]">{srv.title}</h3>
                  <p className="font-body text-[#6C757D]">{srv.description}</p>
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

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-20 px-6 bg-[#E9ECEF]">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-corp text-3xl font-extrabold text-[#212529] mb-4">Contact Our Agents</h2>
              <div className="w-24 h-1 bg-[#004B87] mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
              <div className="bg-white p-8 border-t-4 border-[#004B87] shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6 text-[#004B87]">
                  <Phone size={28} />
                </div>
                <h4 className="font-corp font-bold text-[#212529] mb-2">Phone</h4>
                <p className="text-[#6C757D] font-semibold">{content.contact_info?.phone || '1800 123 4567'}</p>
              </div>
              <div className="bg-white p-8 border-t-4 border-[#004B87] shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6 text-[#004B87]">
                  <Mail size={28} />
                </div>
                <h4 className="font-corp font-bold text-[#212529] mb-2">Email</h4>
                <p className="text-[#6C757D] font-semibold break-all">{content.contact_info?.email || 'corporate@apex.com'}</p>
              </div>
              <div className="bg-white p-8 border-t-4 border-[#004B87] shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6 text-[#004B87]">
                  <MapPin size={28} />
                </div>
                <h4 className="font-corp font-bold text-[#212529] mb-2">Office</h4>
                <p className="text-[#6C757D] font-semibold">{content.contact_info?.address || 'Level 12, Apex Tower\nBusiness District, Kerala'}</p>
              </div>
              <div className="bg-white p-8 border-t-4 border-[#004B87] shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6 text-[#004B87]">
                  <Clock size={28} />
                </div>
                <h4 className="font-corp font-bold text-[#212529] mb-2">Hours</h4>
                <p className="text-[#6C757D] font-semibold whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Fri: 9AM - 6PM'}</p>
              </div>
            </div>
            
            {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube) && (
              <div className="mt-12 flex justify-center gap-6">
                {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#004B87] shadow-md hover:bg-[#004B87] hover:text-white transition-colors"><Facebook size={20} /></a>}
                {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#004B87] shadow-md hover:bg-[#004B87] hover:text-white transition-colors"><Instagram size={20} /></a>}
                {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#004B87] shadow-md hover:bg-[#004B87] hover:text-white transition-colors"><Twitter size={20} /></a>}
                {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#004B87] shadow-md hover:bg-[#004B87] hover:text-white transition-colors"><Youtube size={20} /></a>}
              </div>
            )}
            
            <div className="mt-12 w-full h-[400px] border-t-4 border-[#004B87] shadow-lg bg-white overflow-hidden">
              <iframe
                title="Corporate Office Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '100 Financial District, Kerala')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="services" className="bg-[#212529] text-[#F8F9FA] py-16 px-6 border-t-8 border-[#004B87]">
        <div className="container mx-auto max-w-3xl text-center font-body">
          <div className="flex items-center justify-center gap-2 mb-6">
             {content?.settings_json?.logo_image ? (
               <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
             ) : (
               <Briefcase className="text-[#004B87]" size={24} />
             )}
             <span className="font-corp font-extrabold text-xl tracking-tighter uppercase">{siteName}</span>
          </div>
          <p className="text-[#ADB5BD] text-sm leading-relaxed max-w-xl mx-auto">
            {content.about_text || "Specializing in commercial real estate solutions. From leasing office spaces to large scale industrial acquisitions, we are your corporate real estate partner."}
          </p>
          <div className="mt-8 text-[#6C757D] text-xs">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
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
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

