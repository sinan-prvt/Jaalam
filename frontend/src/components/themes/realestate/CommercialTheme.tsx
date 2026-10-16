import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Briefcase, MapPin, Building, Phone, Mail, Clock, X, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from '../scrap/SocialIcons';
import ContactForm from '../shared/ContactForm';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';

const SECTION_LOOK: SectionLook = { kind: 'realestate', bg: '#FFFFFF', altBg: '#F8F9FA', text: '#212529', accent: '#004B87', headingFont: 'font-corp', bodyFont: 'font-body', radius: 'md' };

export default function CommercialTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Apex Commercial';
  const hiddenFields = content?.settings_json?.hidden_elements || [];
  
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
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-4 border-[#004B87] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
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
        <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: `url(${content.settings_json?.hero_image || content.hero_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'})` }}></div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full">
            {!hiddenFields.includes("hero_title") && (
              <h1 className="font-corp text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-3xl">
              {content.hero_title || 'Strategic Spaces for Business Growth.'}
            </h1>
              )}
            {!hiddenFields.includes("hero_description") && (
              <p className="font-body text-lg md:text-xl text-[#E9ECEF] mb-10 max-w-2xl leading-relaxed">
              {content.hero_text || 'Premium office spaces, retail locations, and industrial properties for modern enterprises.'}
            </p>
              )}
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
                <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

      
      
      {/* Shared About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <ThemeAbout content={content} look={SECTION_LOOK} order={sectionOrder.indexOf('about') + 1} />
      )}

      {/* Shared Services Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <ThemeServices content={content} look={SECTION_LOOK} order={sectionOrder.indexOf('services') + 1} />
      )}

      {/* Shared Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <ThemeGallery content={content} look={SECTION_LOOK} order={sectionOrder.indexOf('gallery') + 1} />
      )}

      {/* Shared Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <ThemeContact content={content} look={SECTION_LOOK} order={sectionOrder.indexOf('contact') + 1} websiteId={website.id} />
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
      <footer id="services" className="bg-[#212529] text-[#F8F9FA] py-16 px-6 border-t-8 border-[#004B87]">
        <div className="container mx-auto max-w-3xl text-center font-body">
          <div className="flex items-center justify-center gap-2 mb-6">
             {content?.settings_json?.logo_image ? (
               <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
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
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />

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

