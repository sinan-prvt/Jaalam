import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Square, ArrowRight } from 'lucide-react';

export default function MinimalRealEstateTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'AURA';
  
  const properties = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Villa No. 14', price: '₹5.5 Cr', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', info: '4 Bed / 4 Bath / 4200 Sqft' },
    { name: 'Penthouse B', price: '₹3.2 Cr', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', info: '3 Bed / 2 Bath / 2800 Sqft' },
    { name: 'Studio 09', price: '₹95 L', image: 'https://images.unsplash.com/photo-1502672260266-1c158bf92faa?auto=format&fit=crop&w=800&q=80', info: '1 Bed / 1 Bath / 850 Sqft' },
    { name: 'Estate 04', price: '₹12 Cr', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', info: '6 Bed / 7 Bath / 9500 Sqft' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap');
        .font-min { font-family: 'Space Grotesk', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="p-8 md:p-12 flex justify-between items-center bg-white sticky top-0 z-50">
        <span className="font-min font-bold text-2xl tracking-tighter uppercase">{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
        <div className="flex gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#properties" className="hover:opacity-50 transition-opacity">Properties</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-32 px-8 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-end">
          <div>
            <h1 className="font-min text-5xl md:text-7xl font-medium tracking-tighter leading-[1.1] mb-8 uppercase">
              {content.hero_title || 'Curated Spaces.'}
            </h1>
            <p className="font-min text-lg text-gray-500 max-w-md leading-relaxed">
              {content.hero_text || 'A minimalist approach to luxury real estate. Discover properties that speak for themselves.'}
            </p>
          </div>
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" alt="Architecture" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="py-20 px-8 md:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-white/20 pb-8">
             <h2 className="font-min text-3xl font-medium tracking-tighter uppercase">Available Now</h2>
             <Square size={24} className="text-white/50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {properties.map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/2] overflow-hidden mb-6 bg-gray-900">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start font-min">
                   <div>
                     <h3 className="text-xl uppercase tracking-tighter mb-2">{p.name}</h3>
                     <div className="text-gray-400 text-sm tracking-wide">{p.info}</div>
                   </div>
                   <span className="text-xl">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      
      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-2xl mx-auto text-black">
              {content.about_text || 'Welcome to our store! We are dedicated to bringing you the best quality products and services. Our team works hard to ensure customer satisfaction and continuous improvement.'}
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
                    {srv.image ? <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
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
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/5">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
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
      <footer id="contact" className="py-32 px-8 md:px-12 bg-white text-black font-min">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 border-t border-black pt-16">
          <div>
            <span className="font-bold text-3xl tracking-tighter uppercase block mb-8">{siteName}</span>
            <p className="text-gray-500 leading-relaxed max-w-sm text-sm">
              {content.about_text || "Redefining real estate through design, architecture, and simplicity."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm uppercase tracking-wide">
            <div>
               <div className="font-bold mb-6">Inquiries</div>
               <div className="space-y-4 text-gray-500">
                 <div>{content.contact_info?.email || 'hello@aura.com'}</div>
                 <div>{content.contact_info?.phone || '+91 98765 43210'}</div>
               </div>
            </div>
            <div>
               <div className="font-bold mb-6">Studio</div>
               <div className="text-gray-500 leading-relaxed">
                 {content.contact_info?.address || 'Design Park\nKerala, India'}
               </div>
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={content?.products_json || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

