import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBag } from 'lucide-react';
import ContactForm from '../shared/ContactForm';

import ContactExtras from '../shared/ContactExtras';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';
import ThemeStats from '../shared/ThemeStats';

const SECTION_LOOK: SectionLook = { kind: 'textiles', bg: '#F5F5F5', altBg: '#EAEAEA', text: '#111111', accent: '#111111', headingFont: 'font-min', bodyFont: 'font-min', radius: 'none', uppercase: true };
export default function MinimalTextilesTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'S T U D I O';
  const hiddenFields = content?.settings_json?.hidden_elements || [];
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Oversized Blazer', price: '₹5,999', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', material: 'Wool Blend' },
    { name: 'Pleated Trousers', price: '₹3,499', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80', material: 'Cotton Gabardine' },
    { name: 'Silk Slip Dress', price: '₹4,999', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', material: '100% Silk' },
    { name: 'Ribbed Knit Top', price: '₹1,999', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=600&q=80', material: 'Merino Wool' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F5F5F5] text-[#111111] font-sans selection:bg-[#111111] selection:text-[#F5F5F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;700&display=swap');
        .font-min { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="p-6 md:p-10 flex justify-between items-center fixed w-full top-0 mix-blend-difference text-white z-50 pointer-events-none">
        <span className="font-min font-bold text-2xl tracking-tighter uppercase pointer-events-auto">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
        <div className="flex gap-8 text-sm font-medium tracking-widest uppercase pointer-events-auto">
          <a href="#shop" className="hover:opacity-50 transition-opacity hidden md:block">Shop</a>
          <a href="#info" className="hover:opacity-50 transition-opacity hidden md:block">Info</a>
          <button><ShoppingBag size={20} /></button>
        </div>
      </header>

      {/* Hero */}
      <><section className="h-screen w-full relative bg-white">
        <div className="absolute inset-0 flex">
           <div className="w-1/2 h-full bg-[#EAEAEA]"></div>
           <div className="w-1/2 h-full bg-[#F5F5F5]"></div>
        </div>
        <img loading="lazy" src={content.settings_json?.hero_image || content.hero_image || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80'} alt="Fashion Editorial" className="absolute inset-0 w-full h-full object-cover filter grayscale" />
        
        <div className="absolute bottom-10 left-10 md:left-20 max-w-lg mix-blend-difference text-white">
          {!hiddenFields.includes("hero_title") && (
              <h1 className="font-min text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-6 uppercase">
            {content.hero_title || 'Collection 001'}
          </h1>
              )}
          {!hiddenFields.includes("hero_description") && (
              <p className="font-min text-sm md:text-base tracking-widest uppercase opacity-80 mb-8 max-w-sm leading-relaxed">
            {content.hero_text || 'Redefining modern wardrobe staples through minimalist design and premium fabrics.'}
          </p>
              )}
        </div>
      </section>
      <ThemeStats content={content} /></>

      {/* Products */}
      <section id="shop" className="py-32 px-6 md:px-20 bg-[#F5F5F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
          {products.map((p: any, i: number) => (
            <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
              <div className="aspect-[3/4] bg-[#EAEAEA] mb-6 overflow-hidden">
                <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex justify-between items-start font-min text-sm tracking-widest uppercase">
                 <div>
                   <h3 className="font-bold mb-1">{p.name}</h3>
                   <div className="text-gray-500 text-xs">{p.material}</div>
                 </div>
                 <span className="font-medium">{p.price}</span>
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
      <footer id="info" className="py-20 px-6 md:px-20 bg-[#111111] text-[#F5F5F5] font-min text-xs tracking-widest uppercase">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="font-bold text-2xl tracking-tighter block mb-6">{siteName}</span>
            <p className="text-gray-400 leading-loose max-w-sm">
              {content.about_text || "Minimalist aesthetics. Maximum impact. Designed and crafted with precision."}
            </p>
          </div>
          <div>
            <div className="font-bold mb-6 text-gray-500">Contact</div>
            <div className="space-y-4">
              {!hiddenFields.includes('contact_email') && (
                          <div>{content.contact_info?.email || 'studio@minimal.com'}</div>
                          )}
              {!hiddenFields.includes('contact_phone') && (
                          <div>{content.contact_info?.phone || '+91 98765 43210'}</div>
                          )}
            </div>
          </div>
          <div>
            <div className="font-bold mb-6 text-gray-500">Location</div>
            {!hiddenFields.includes('contact_address') && (
                      <div className="leading-loose">
                                    {content.contact_info?.address || 'Design District\nKerala, India'}
                                  </div>
                      )}
          </div>
        </div>
        <div className="px-6 pb-2">
          <ContactExtras content={content} />
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}

