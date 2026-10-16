import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBag, Search, Menu, ArrowRight, Heart, User, MapPin } from 'lucide-react';
import ContactForm from '../shared/ContactForm';

import ContactExtras from '../shared/ContactExtras';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';

const SECTION_LOOK: SectionLook = { kind: 'textiles', bg: '#FFFFFF', altBg: '#F8FAFC', text: '#0F172A', accent: '#0F172A', headingFont: 'font-modern', radius: 'md' };
export default function ModernTextilesTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Loom & Weave';
  const hiddenFields = content?.settings_json?.hidden_elements || [];
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Linen Blend Shirt', price: '₹1,299', image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&w=600&q=80', category: 'Men' },
    { name: 'Cotton Maxi Dress', price: '₹2,499', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', category: 'Women' },
    { name: 'Denim Jacket', price: '₹3,499', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', category: 'Unisex' },
    { name: 'Silk Scarf', price: '₹899', image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=600&q=80', category: 'Accessories' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-slate-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
        .font-modern { font-family: 'Jost', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs font-modern text-center py-2 tracking-widest uppercase">
        Free shipping on all orders over ₹2000
      </div>

      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 z-50 bg-white/90 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center md:hidden">
            <Menu size={24} />
            <Search size={20} />
          </div>
          
          <div className="hidden md:flex gap-8 font-modern text-sm font-medium tracking-wide uppercase">
            <a href="#new" className="hover:text-slate-500 transition-colors">New Arrivals</a>
            <a href="#men" className="hover:text-slate-500 transition-colors">Men</a>
            <a href="#women" className="hover:text-slate-500 transition-colors">Women</a>
          </div>

          <span className="font-modern text-2xl font-semibold tracking-widest uppercase absolute left-1/2 transform -translate-x-1/2">
            {content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}
          </span>

          <div className="flex gap-6 items-center">
            <Search size={20} className="hidden md:block cursor-pointer hover:text-slate-500" />
            <User size={20} className="hidden md:block cursor-pointer hover:text-slate-500" />
            <Heart size={20} className="hidden md:block cursor-pointer hover:text-slate-500" />
            <div className="relative cursor-pointer">
               <ShoppingBag size={20} />
               <span className="absolute -top-1 -right-2 bg-slate-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[80vh] bg-slate-50">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${content.settings_json?.hero_image || content.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80'})` }}></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-xl bg-white/90 backdrop-blur p-10 md:p-16">
            {!hiddenFields.includes("hero_title") && (
              <h1 className="font-modern text-4xl md:text-5xl font-medium mb-4 leading-tight">
              {content.hero_title || 'The Summer Edit.'}
            </h1>
              )}
            {!hiddenFields.includes("hero_description") && (
              <p className="font-modern text-slate-600 mb-8 text-lg">
              {content.hero_text || 'Discover our new collection of lightweight linens and breathable cottons perfect for the season.'}
            </p>
              )}
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-modern text-sm tracking-widest uppercase py-4 px-8 flex items-center gap-2 transition-colors">
              Shop Collection <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="relative h-96 group cursor-pointer overflow-hidden">
              <img loading="lazy" src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" alt="Womenswear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                 <h2 className="font-modern text-white text-3xl font-medium tracking-widest uppercase">Womenswear</h2>
              </div>
           </div>
           <div className="relative h-96 group cursor-pointer overflow-hidden">
              <img loading="lazy" src="https://images.unsplash.com/photo-1490578474895-699bc4e3f444?auto=format&fit=crop&w=800&q=80" alt="Menswear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                 <h2 className="font-modern text-white text-3xl font-medium tracking-widest uppercase">Menswear</h2>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-24 px-6 container mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-modern text-2xl font-medium tracking-widest uppercase">New Arrivals</h2>
          <span className="font-modern text-sm tracking-widest uppercase border-b border-slate-900 cursor-pointer">View All</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any, i: number) => (
            <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 bg-slate-100 overflow-hidden">
                <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute bottom-0 left-0 w-full bg-white/90 text-slate-900 font-modern text-xs tracking-widest uppercase py-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  Quick Add
                </button>
              </div>
              <div className="font-modern text-sm text-slate-500 mb-1">{p.category}</div>
              <h3 className="font-modern text-base font-medium mb-1">{p.name}</h3>
              <div className="font-modern text-sm">{p.price}</div>
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-12 font-modern">
          <div className="md:col-span-2">
            <h3 className="text-xl font-medium tracking-widest uppercase mb-6">{siteName}</h3>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed mb-6">
              {content.about_text || "Modern essentials crafted with care. Sustainable materials, ethical production, and timeless design."}
            </p>
          </div>
          <div>
            <h4 className="font-medium tracking-widest uppercase mb-6 text-sm">Customer Care</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>Contact Us</li>
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium tracking-widest uppercase mb-6 text-sm">Visit Store</h4>
            <div className="text-sm text-slate-600 space-y-3">
               <div className="flex items-start gap-2">
                 <MapPin size={16} className="shrink-0 mt-0.5" />
                 {!hiddenFields.includes('contact_address') && (
                              <span>{content.contact_info?.address || 'Fashion Street, Kerala'}</span>
                              )}
               </div>
               {!hiddenFields.includes('contact_email') && (
                          <div>{content.contact_info?.email || 'hello@loomandweave.com'}</div>
                          )}
               {!hiddenFields.includes('contact_phone') && (
                          <div>{content.contact_info?.phone || '+91 98765 43210'}</div>
                          )}
            </div>
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

