import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBasket, MapPin, Phone, Tag, Menu, X } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';
import ThemeStats from '../shared/ThemeStats';

const SECTION_LOOK: SectionLook = { kind: 'grocery', bg: '#FFFFFF', altBg: '#F8F9FA', text: '#212529', accent: '#0033A0', headingFont: 'font-classic', bodyFont: 'font-classic', radius: 'md' };

export default function ClassicGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Family Supermarket';
  const hiddenFields = content?.settings_json?.hidden_elements || [];
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Basmati Rice (Premium)', price: '₹220/kg', image: 'https://images.unsplash.com/photo-1574323347407-15e5a4b51a8d?auto=format&fit=crop&w=600&q=80', originalPrice: '₹250' },
    { name: 'Refined Sunflower Oil', price: '₹145/L', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', originalPrice: '₹160' },
    { name: 'Red Onions', price: '₹40/kg', image: 'https://images.unsplash.com/photo-1587049352847-81a56d773c1c?auto=format&fit=crop&w=600&q=80', originalPrice: '₹55' },
    { name: 'Washing Powder', price: '₹190/kg', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80', originalPrice: '₹210' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F8F9FA] text-[#212529] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        .font-classic { font-family: 'Roboto', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root > header { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-[#E50914] text-white sticky top-0 z-50 border-b-4 border-[#0033A0]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 min-w-0 pr-4">
              {content?.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-12 w-auto object-contain shrink-0" />
              ) : (
                <ShoppingBasket className="text-[#FFD100] shrink-0 h-7 w-7 md:h-8 md:w-8" />
              )}
              <span className="font-classic text-2xl md:text-3xl font-black italic tracking-tighter shadow-sm truncate block">{siteName}</span>
            </div>
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <div className="hidden md:flex items-center gap-6 font-classic font-bold text-sm">
              <a href="#offers" className="hover:text-[#FFD100] transition-colors flex items-center gap-1"><Tag size={16}/> Weekly Offers</a>
              <a href="#visit" className="hover:text-[#FFD100] transition-colors">Find Us</a>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 flex flex-col gap-4 font-classic font-bold text-sm">
              <a href="#offers" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FFD100] py-2 transition-colors flex items-center gap-2"><Tag size={16}/> Weekly Offers</a>
              <a href="#visit" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FFD100] py-2 transition-colors">Find Us</a>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <><section className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0033A0] transform skew-x-12 translate-x-16 opacity-10"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative z-10">
          <div className="w-full md:w-1/2 pr-0 md:pr-12">
            {!hiddenFields.includes("hero_title") && (
              <h1 className="font-classic text-4xl md:text-6xl font-black text-[#0033A0] mb-4 uppercase leading-none">
              {content.hero_title || 'Everyday Low Prices.'}
            </h1>
              )}
            {!hiddenFields.includes("hero_description") && (
              <p className="font-classic text-xl font-medium text-gray-600 mb-8">
              {content.hero_text || 'Your one-stop shop for daily groceries, household items, and fresh produce at unbeatable rates.'}
            </p>
              )}
            <button className="bg-[#FFD100] hover:bg-[#F2C700] text-[#212529] font-classic font-bold text-lg py-3 px-8 rounded shadow-[2px_2px_0_#212529] active:shadow-none active:translate-y-[2px] transition-all" onClick={() => (document.getElementById('menu') || document.getElementById('offers') || document.getElementById('products') || document.getElementById('about'))?.scrollIntoView({ behavior: 'smooth' })}>
              View Weekly Flyer
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
             <div className="bg-white p-4 border-4 border-[#0033A0] transform rotate-2 shadow-xl">
               <img loading="lazy" src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80" alt="Supermarket Aisle" className="w-full h-auto" />
             </div>
          </div>
        </div>
      </section>
      <ThemeStats content={content} /></>

      {/* Products */}
      <section id="offers" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-classic text-3xl font-black text-[#E50914] uppercase bg-white px-4 py-2 border-2 border-[#E50914] inline-block shadow-[4px_4px_0_#E50914]">
              Mega Savings
            </h2>
            <div className="h-1 flex-1 bg-[#0033A0]"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white border-2 border-gray-200 p-4 hover:border-[#0033A0] transition-colors flex flex-col h-full relative">
                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-[#E50914] text-white font-black text-xs px-2 py-1 rounded shadow-sm z-10">
                  SAVE!
                </div>
                
                <div className="aspect-square bg-white mb-4 flex items-center justify-center overflow-hidden">
                  <img loading="lazy" src={p.image || undefined} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <h3 className="font-classic font-bold text-lg text-[#0033A0] leading-tight mb-2 flex-grow">{p.name}</h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <div className="text-gray-400 line-through text-sm font-medium">{p.originalPrice}</div>
                    <div className="font-classic font-black text-2xl text-[#E50914]">{p.price}</div>
                  </div>
                  
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url || undefined} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
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
      <footer id="visit" className="bg-[#212529] text-white py-12 px-4 border-t-8 border-[#FFD100]">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="font-classic text-2xl font-black italic mb-4 text-[#FFD100]">{siteName}</h3>
          <p className="font-classic mb-8 text-gray-400 max-w-md mx-auto">
            {content.about_text || "Serving the community with quality products and friendly service since 1995."}
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 font-classic font-bold bg-[#343A40] p-6 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="text-[#FFD100]" /> 
              {!hiddenFields.includes('contact_phone') && (
                          <span>{content.contact_info?.phone || '0484 234 5678'}</span>
                          )}
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <MapPin className="text-[#FFD100]" /> 
              {!hiddenFields.includes('contact_address') && (
                          <span>{content.contact_info?.address || 'Main Road Junction, Kerala'}</span>
                          )}
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 rounded-full w-12 h-12 flex items-center justify-center transition-colors border border-white/30"
            onClick={(e) => { e.stopPropagation(); setSelectedGalleryImage(null); }}
          >
            <span className="text-2xl font-bold">×</span>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery full size" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}

