import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Building2, MapPin, ArrowRight, ArrowUpRight, Phone, Mail, Clock, X, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from '../scrap/SocialIcons';
import ContactForm from '../shared/ContactForm';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';

const SECTION_LOOK: SectionLook = { kind: 'realestate', bg: '#FFFFFF', altBg: '#F1F5F9', text: '#0F172A', accent: '#2563EB', headingFont: 'font-urban', bodyFont: 'font-urban', radius: 'xl' };

export default function UrbanApartmentsTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Metro Living';
  const hiddenFields = content?.settings_json?.hidden_elements || [];

  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Skyline Penthouse', price: '₹4.5 Cr', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', location: 'Downtown', type: '3 BHK' },
    { name: 'Loft Studio', price: '₹1.2 Cr', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', location: 'Arts District', type: 'Studio' },
    { name: 'Highrise Suite', price: '₹2.8 Cr', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', location: 'Tech Park', type: '2 BHK' },
    { name: 'Garden Duplex', price: '₹3.5 Cr', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', location: 'Suburbs', type: '4 BHK' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-slate-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap');
        .font-urban { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Navigation */}
      <nav className="p-6 md:p-8 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {content?.settings_json?.logo_image ? (
            <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
          ) : (
            <Building2 size={24} className="text-blue-600" />
          )}
          <span className="font-urban font-black text-xl tracking-tight">{siteName}</span>
        </div>
        <div className="hidden md:flex gap-8 font-urban text-sm font-medium text-slate-500">
          <a href="#properties" className="hover:text-blue-600 transition-colors">Listings</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
        <button className="md:hidden text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 px-6 flex flex-col gap-4 font-urban text-sm font-medium text-slate-600">
            <a href="#properties" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Listings</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            {!hiddenFields.includes("hero_title") && (
              <h1 className="font-urban text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-slate-900">
              {content.hero_title || 'Find your place in the city.'}
            </h1>
              )}
            {!hiddenFields.includes("hero_description") && (
              <p className="font-urban text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
              {content.hero_text || 'Modern apartments, lofts, and penthouses in the most desirable urban neighborhoods.'}
            </p>
              )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <img loading="lazy" src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" className="rounded-2xl rounded-tr-[4rem] shadow-xl" alt="Urban Appt" />
              <img loading="lazy" src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80" className="rounded-2xl rounded-bl-[4rem] shadow-xl mt-12" alt="Urban Loft" />
            </div>
          </div>
        </div>
      </section>

      {/* Properties List */}
      <section id="properties" className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-urban text-3xl font-black tracking-tight text-slate-900">Latest Listings</h2>
            <button onClick={() => setShowAllProducts(true)} className="text-blue-600 font-urban font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="aspect-square overflow-hidden relative">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 font-urban font-bold text-xs px-2 py-1 rounded-md">
                    {p.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-blue-600 font-urban font-black text-xl mb-1">{p.price}</div>
                  <h3 className="font-urban font-bold text-slate-900 mb-2 truncate">{p.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 font-urban text-xs mb-4">
                    <MapPin size={12} /> {p.location}
                  </div>
                  <button onClick={() => setSelectedProduct(p)} className="w-full border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-urban font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm">
                    View Details <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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

      {/* Shared Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <ThemeContact content={content} look={SECTION_LOOK} order={sectionOrder.indexOf('contact') + 1} websiteId={website.id} />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 font-urban text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-6">
              {content?.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <Building2 size={24} className="text-blue-400" />
              )}
              <span className="font-black text-xl tracking-tight">{siteName}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {content.about_text || "Your trusted partner in navigating the urban real estate market. We make finding your next home simple and transparent."}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end justify-center">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
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

