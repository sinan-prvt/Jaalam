import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Menu, X } from 'lucide-react';
import ContactForm from '../shared/ContactForm';

import ContactExtras from '../shared/ContactExtras';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';
import ThemeStats from '../shared/ThemeStats';

const SECTION_LOOK: SectionLook = { kind: 'grocery', bg: '#FFFFFF', altBg: '#F5F5F5', text: '#000000', accent: '#16A34A', headingFont: 'font-min', bodyFont: 'font-min', radius: 'md' };
export default function MinimalGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'essential.';
  const hiddenFields = content?.settings_json?.hidden_elements || [];
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Oat Milk', price: '₹250', size: '1L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coffee Beans', price: '₹450', size: '250g', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sea Salt', price: '₹120', size: '500g', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Olive Oil', price: '₹850', size: '500ml', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .font-min { font-family: 'DM Sans', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Navigation */}
      <nav className="p-4 md:p-12 flex flex-col md:flex-row justify-between items-center fixed w-full top-0 bg-white/90 backdrop-blur z-50 gap-4 md:gap-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-8 w-auto object-contain grayscale shrink-0" />
            ) : (
              <div className="w-6 h-6 md:w-8 md:h-8 bg-black flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[10px] md:text-xs">M</span>
              </div>
            )}
            <span className="text-lg md:text-2xl font-bold tracking-tighter uppercase truncate block">{siteName}</span>
          </div>
          <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        <div className="hidden md:flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium whitespace-nowrap">
          <a href="#shop" className="hover:opacity-50 transition-opacity">shop</a>
          <a href="#about" className="hover:opacity-50 transition-opacity">about</a>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden w-full mt-4 pt-4 border-t border-black/10 flex flex-col gap-4 text-sm font-medium">
            <a href="#shop" onClick={() => setIsMenuOpen(false)} className="hover:opacity-50 py-2 transition-opacity">shop</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:opacity-50 py-2 transition-opacity">about</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <><section className="pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 max-w-5xl mx-auto">
        {!hiddenFields.includes("hero_title") && (
              <h1 className="font-min text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight break-words hyphens-auto">
          {content.hero_title || 'just the good stuff.'}
        </h1>
              )}
        {!hiddenFields.includes("hero_description") && (
              <p className="font-min text-xl text-gray-500 max-w-xl leading-relaxed mb-12">
          {content.hero_text || 'curated daily essentials. no clutter, no overwhelming choices. just quality products.'}
        </p>
              )}
      </section>
      <ThemeStats content={content} /></>

      {/* Products */}
      <section id="shop" className="px-8 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((p: any, i: number) => (
            <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer flex flex-col">
              <div className="aspect-[4/5] bg-gray-50 mb-6 overflow-hidden">
                <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-min font-medium text-lg">{p.name}</h3>
                 <span className="font-min font-bold">{p.price}</span>
              </div>
              <div className="text-gray-400 text-sm mb-4">{p.size}</div>
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url || undefined} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="about" className="bg-gray-50 py-24 px-8 md:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 font-min">
          <div>
            <span className="font-bold text-xl block mb-6">{siteName}</span>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              {content.about_text || "rethinking the supermarket experience through thoughtful curation and minimal design."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
               <div className="font-medium mb-4">contact</div>
               <div className="text-gray-500 space-y-2">
                 {!hiddenFields.includes('contact_email') && (
                              <div>{content.contact_info?.email || 'hello@essential.com'}</div>
                              )}
                 {!hiddenFields.includes('contact_phone') && (
                              <div>{content.contact_info?.phone || '98765 43210'}</div>
                              )}
               </div>
            </div>
            <div>
               <div className="font-medium mb-4">visit</div>
               {!hiddenFields.includes('contact_address') && (
                          <div className="text-gray-500">
                                           {content.contact_info?.address || 'studio 4, quiet lane, kerala'}
                                         </div>
                          )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-2">
          <ContactExtras content={content} showHours={false} />
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
      
      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 rounded-full p-2 z-10"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

