import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBag } from 'lucide-react';

export default function MinimalTextilesTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'S T U D I O';
  
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
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
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
      <section className="h-screen w-full relative bg-white">
        <div className="absolute inset-0 flex">
           <div className="w-1/2 h-full bg-[#EAEAEA]"></div>
           <div className="w-1/2 h-full bg-[#F5F5F5]"></div>
        </div>
        <img loading="lazy" src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80" alt="Fashion Editorial" className="absolute inset-0 w-full h-full object-cover filter grayscale" />
        
        <div className="absolute bottom-10 left-10 md:left-20 max-w-lg mix-blend-difference text-white">
          <h1 className="font-min text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-6 uppercase">
            {content.hero_title || 'Collection 001'}
          </h1>
          <p className="font-min text-sm md:text-base tracking-widest uppercase opacity-80 mb-8 max-w-sm leading-relaxed">
            {content.hero_text || 'Redefining modern wardrobe staples through minimalist design and premium fabrics.'}
          </p>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="py-32 px-6 md:px-20 bg-[#F5F5F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
          {products.map((p: any, i: number) => (
            <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
              <div className="aspect-[3/4] bg-[#EAEAEA] mb-6 overflow-hidden">
                <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
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
                    {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
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
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-black/5">
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Contact Us</h2>
            <p className="opacity-80 mb-8 max-w-lg mx-auto text-black">Get in touch with us for any inquiries or support.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">📞</span>
                <span className="font-bold text-black">{content.contact_info?.phone || '1800 123 4567'}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">✉️</span>
                <span className="font-bold break-all text-black">{content.contact_info?.email || 'hello@example.com'}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">📍</span>
                <span className="font-bold text-black">{content.contact_info?.address || '123 Market Street'}</span>
              </div>
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
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
              <div>{content.contact_info?.email || 'studio@minimal.com'}</div>
              <div>{content.contact_info?.phone || '+91 98765 43210'}</div>
            </div>
          </div>
          <div>
            <div className="font-bold mb-6 text-gray-500">Location</div>
            <div className="leading-loose">
              {content.contact_info?.address || 'Design District\nKerala, India'}
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}

