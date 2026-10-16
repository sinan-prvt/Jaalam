import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Leaf, ShoppingBag, MapPin, Mail, Phone, Sun, Menu, X } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';

const SECTION_LOOK: SectionLook = { kind: 'grocery', bg: '#FDFBF7', altBg: '#F2EFE6', text: '#3E4A3D', accent: '#6B8E23', headingFont: 'font-organic', bodyFont: 'font-body', radius: 'xl' };

export default function OrganicGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Earthly Goods';
  const hiddenFields = content?.settings_json?.hidden_elements || [];

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Organic Kale Bunch', price: '₹80', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', farm: 'Green Acres' },
    { name: 'Raw Wild Honey', price: '₹450', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', farm: 'Valley Apiaries' },
    { name: 'Cold Pressed Coconut Oil', price: '₹320', image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=600&q=80', farm: 'Coastal Mills' },
    { name: 'Heirloom Carrots', price: '₹60/kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', farm: 'Sunrise Farms' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FDFBF7] text-[#3E4A3D] font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;600&display=swap');
        .font-organic { font-family: 'Lora', serif; }
        .font-body { font-family: 'Nunito', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#E8E4D9] py-6 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-10 w-auto object-contain shrink-0" />
            ) : (
              <Leaf className="text-[#6B8E23] shrink-0 h-6 w-6 md:h-7 md:w-7" />
            )}
            <span className="font-organic text-xl md:text-3xl font-semibold tracking-tight truncate block">{siteName}</span>
          </div>
          <button className="md:hidden text-[#6B8E23]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className="hidden md:flex gap-8 font-body text-sm font-semibold text-[#5A6B59] uppercase tracking-widest">
            <a href="#market" className="hover:text-[#6B8E23] transition-colors">Market</a>
            <a href="#farms" className="hover:text-[#6B8E23] transition-colors">Our Farms</a>
          </nav>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#E8E4D9] flex flex-col gap-4 font-body text-sm font-semibold text-[#5A6B59] uppercase tracking-widest">
            <a href="#market" onClick={() => setIsMenuOpen(false)} className="hover:text-[#6B8E23] py-2 transition-colors">Market</a>
            <a href="#farms" onClick={() => setIsMenuOpen(false)} className="hover:text-[#6B8E23] py-2 transition-colors">Our Farms</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          <div className="w-full md:w-1/2">
            {!hiddenFields.includes("hero_title") && (
              <h1 className="font-organic text-5xl md:text-6xl font-semibold mb-6 text-[#2C362B] leading-tight">
              {content.hero_title || 'Fresh from the soil.'}
            </h1>
              )}
            {!hiddenFields.includes("hero_description") && (
              <p className="font-body text-lg text-[#5A6B59] mb-10 leading-relaxed max-w-md">
              {content.hero_text || 'We bring the farmers market to your doorstep. 100% organic, pesticide-free produce grown with love.'}
            </p>
              )}
            <a href="#market" className="bg-[#6B8E23] hover:bg-[#55711C] text-[#FDFBF7] font-body font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2 mt-2 w-fit">
              <ShoppingBag size={18} /> Shop the Harvest
            </a>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-6 -left-6 bg-[#E8E4D9] w-full h-full rounded-full opacity-50"></div>
            <img loading="lazy" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="Organic Produce" className="relative z-10 w-full h-auto rounded-full object-cover aspect-square shadow-sm" />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="market" className="py-20 px-6 bg-[#F4F1EA]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Sun size={32} className="mx-auto text-[#D4A373] mb-4" />
            <h2 className="font-organic text-4xl text-[#2C362B]">This Week's Pick</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-[#FDFBF7]">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="font-body text-xs text-[#8B9A8B] uppercase tracking-wider mb-1">{p.farm}</div>
                <h3 className="font-organic text-lg text-[#2C362B] mb-2">{p.name}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F4F1EA]">
                  <span className="font-body font-semibold text-[#6B8E23] text-lg">{p.price}</span>
                  <button className="text-[#D4A373] hover:text-[#BC8A5F] transition-colors"><ShoppingBag size={20} /></button>
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
      <footer id="farms" className="bg-[#2C362B] text-[#E8E4D9] py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-organic text-3xl mb-6">{siteName}</h3>
          <p className="font-body text-sm max-w-md mx-auto mb-12 opacity-80 leading-relaxed">
            {content.about_text || "Supporting local farmers and sustainable agriculture. Eat well, live well."}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-10 font-body text-sm border-t border-[#3E4A3D] pt-10">
            {!hiddenFields.includes('contact_phone') && (
                      <div className="flex items-center gap-2"><Phone size={16} className="text-[#D4A373]" /> {content.contact_info?.phone || '98765 43210'}</div>
                      )}
            {!hiddenFields.includes('contact_email') && (
                      <div className="flex items-center gap-2"><Mail size={16} className="text-[#D4A373]" /> {content.contact_info?.email || 'hello@earthlygoods.in'}</div>
                      )}
            {!hiddenFields.includes('contact_address') && (
                      <div className="flex items-center gap-2"><MapPin size={16} className="text-[#D4A373]" /> {content.contact_info?.address || 'Organic Lane, Kerala'}</div>
                      )}
          </div>
        </div>
      </footer>

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[9999] bg-[#2C362B]/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors" onClick={() => setSelectedGalleryImage(null)}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="View" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}

