import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Wine, Menu, X } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import { ThemeAbout, ThemeContact, ThemeGallery, ThemeServices, type SectionLook } from '../shared/ThemeSections';
import ThemeStats from '../shared/ThemeStats';

const SECTION_LOOK: SectionLook = { kind: 'grocery', bg: '#111111', altBg: '#0A0A0A', text: '#E0D8C8', accent: '#C9A66B', onAccent: '#111111', headingFont: 'font-premium', bodyFont: 'font-body', radius: 'none' };

export default function PremiumGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Luxe Gourmet';
  const hiddenFields = content?.settings_json?.hidden_elements || [];

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Truffle Infused Olive Oil', price: '₹2,400', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', origin: 'Italy' },
    { name: 'Artisanal Sourdough', price: '₹350', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', origin: 'House Bakery' },
    { name: 'Aged Balsamic Vinegar', price: '₹1,800', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', origin: 'Modena' },
    { name: 'Organic Heirloom Tomatoes', price: '₹450/kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', origin: 'Local Farm' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#111111] text-[#E0D8C8] font-sans selection:bg-[#C9A66B] selection:text-[#111111]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400&display=swap');
        .font-premium { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Lato', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        /* Sections without their own inline order sit at the products/menu slot; the hero stays first */
        .theme-root > section:not([style*="order"]) { order: ${Math.max(sectionOrder.indexOf('menu'), sectionOrder.indexOf('products'), 0) + 1}; }
        .theme-root > section:first-of-type:not([style*="order"]) { order: 0; ${hiddenSections.includes('hero') ? 'display: none;' : ''} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#C9A66B]/30 bg-[#0A0A0A]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-10 w-auto object-contain shrink-0" />
            ) : (
              <Wine className="text-[#C9A66B] shrink-0 h-6 w-6 md:h-7 md:w-7" />
            )}
            <span className="font-premium text-xl md:text-3xl tracking-wider md:tracking-widest text-[#C9A66B] uppercase truncate block">{siteName}</span>
          </div>
          <button className="md:hidden text-[#C9A66B]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#curated" className="hover:text-[#C9A66B] transition-colors">Curated Selection</a>
            <a href="#visit" className="hover:text-[#C9A66B] transition-colors">Boutique</a>
          </nav>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A] border-t border-[#C9A66B]/30 px-6 py-4 flex flex-col gap-4 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#curated" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A66B] py-2 transition-colors">Curated Selection</a>
            <a href="#visit" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A66B] py-2 transition-colors">Boutique</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <><section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: `url(${content.settings_json?.hero_image || content.hero_image || 'https://images.unsplash.com/photo-1606103920295-9a091573f160?auto=format&fit=crop&w=1600&q=80'})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <p className="font-body text-[#C9A66B] tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-6">Fine Foods & Groceries</p>
          {!hiddenFields.includes("hero_title") && (
              <h1 className="font-premium text-4xl sm:text-5xl md:text-7xl font-bold mb-8 text-white tracking-wide leading-tight max-w-4xl mx-auto px-2 break-words">
            {content.hero_title || 'An Epicurean Journey Awaits.'}
          </h1>
              )}
          {!hiddenFields.includes("hero_description") && (
              <p className="font-premium italic text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {content.hero_text || 'Discover a meticulously curated selection of gourmet ingredients, imported delicacies, and organic local produce.'}
          </p>
              )}
          <button
            onClick={() => (document.getElementById('curated') || document.getElementById('menu') || document.getElementById('products'))?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-[#C9A66B] text-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#111111] px-10 py-4 font-body text-xs uppercase tracking-widest transition-all duration-300">
            Explore the Aisles
          </button>
        </div>
      </section>
      <ThemeStats content={content} /></>

      {/* Products */}
      <section id="curated" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-20">
            <div className="w-px h-16 bg-[#C9A66B] mb-8"></div>
            <h2 className="font-premium text-4xl text-[#C9A66B] uppercase tracking-widest text-center">The Reserve Collection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative bg-[#1A1A1A]">
                  <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover filter contrast-125 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#C9A66B]/20 pointer-events-none"></div>
                </div>
                <div className="text-center">
                  <div className="font-body text-[10px] text-gray-500 uppercase tracking-widest mb-3">{p.origin}</div>
                  <h3 className="font-premium text-lg text-white mb-3 group-hover:text-[#C9A66B] transition-colors">{p.name}</h3>
                  <div className="font-body text-[#C9A66B] text-sm tracking-wider">{p.price}</div>
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
      <footer id="visit" className="bg-[#111111] pt-24 pb-12 px-6 border-t border-[#1A1A1A]">
        <div className="container mx-auto max-w-5xl text-center">
          <Wine size={32} className="mx-auto text-[#1A1A1A] fill-[#C9A66B] mb-8" />
          <h3 className="font-premium text-3xl text-white mb-6 tracking-widest uppercase">{siteName}</h3>
          <p className="font-body text-sm text-gray-500 tracking-wider leading-loose max-w-lg mx-auto mb-16">
            {content.about_text || "Purveyors of excellence since 2010. Offering an unparalleled grocery shopping experience for the discerning palate."}
          </p>

          <div className="grid md:grid-cols-3 gap-8 font-body text-xs tracking-widest text-gray-400 border-t border-[#1A1A1A] pt-12">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#C9A66B] uppercase">Boutique</span>
              {!hiddenFields.includes('contact_address') && (
                          <span>{content.contact_info?.address || '1 Heritage Square, Kerala'}</span>
                          )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#C9A66B] uppercase">Concierge</span>
              {!hiddenFields.includes('contact_phone') && (
                          <span>{content.contact_info?.phone || '+91 98765 43210'}</span>
                          )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#C9A66B] uppercase">Inquiries</span>
              {!hiddenFields.includes('contact_email') && (
                          <span>{content.contact_info?.email || 'concierge@luxegourmet.in'}</span>
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

