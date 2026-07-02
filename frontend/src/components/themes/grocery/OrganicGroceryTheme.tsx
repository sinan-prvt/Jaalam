import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Leaf, ShoppingBag, MapPin, Mail, Phone, Sun } from 'lucide-react';

export default function OrganicGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Earthly Goods';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Organic Kale Bunch', price: '₹80', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', farm: 'Green Acres' },
    { name: 'Raw Wild Honey', price: '₹450', image: 'https://images.unsplash.com/photo-1587049352847-4d4b126a61fc?auto=format&fit=crop&w=600&q=80', farm: 'Valley Apiaries' },
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
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#E8E4D9] py-6 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            {!content?.settings_json?.logo_image && <Leaf size={28} className="text-[#6B8E23]" />}
            <span className="font-organic text-3xl font-semibold tracking-tight">{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          <nav className="flex gap-8 font-body text-sm font-semibold text-[#5A6B59] uppercase tracking-widest">
            <a href="#market" className="hover:text-[#6B8E23] transition-colors">Market</a>
            <a href="#farms" className="hover:text-[#6B8E23] transition-colors">Our Farms</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          <div className="w-full md:w-1/2">
            <h1 className="font-organic text-5xl md:text-6xl font-semibold mb-6 text-[#2C362B] leading-tight">
              {content.hero_title || 'Fresh from the soil.'}
            </h1>
            <p className="font-body text-lg text-[#5A6B59] mb-10 leading-relaxed max-w-md">
              {content.hero_text || 'We bring the farmers market to your doorstep. 100% organic, pesticide-free produce grown with love.'}
            </p>
            <button className="bg-[#6B8E23] hover:bg-[#55711C] text-[#FDFBF7] font-body font-semibold py-3 px-8 rounded-full transition-colors flex items-center gap-2">
              <ShoppingBag size={18} /> Shop the Harvest
            </button>
          </div>
          <div className="w-full md:w-1/2 relative">
             <div className="absolute -top-6 -left-6 bg-[#E8E4D9] w-full h-full rounded-full opacity-50"></div>
             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="Organic Produce" className="relative z-10 w-full h-auto rounded-full object-cover aspect-square shadow-sm" />
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
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="font-body text-xs text-[#8B9A8B] uppercase tracking-wider mb-1">{p.farm}</div>
                <h3 className="font-organic text-lg text-[#2C362B] mb-2">{p.name}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F4F1EA]">
                  <span className="font-body font-semibold text-[#6B8E23] text-lg">{p.price}</span>
                  <button className="text-[#D4A373] hover:text-[#BC8A5F] transition-colors"><ShoppingBag size={20}/></button>
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
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
            <div className="flex items-center gap-2"><Phone size={16} className="text-[#D4A373]" /> {content.contact_info?.phone || '98765 43210'}</div>
            <div className="flex items-center gap-2"><Mail size={16} className="text-[#D4A373]" /> {content.contact_info?.email || 'hello@earthlygoods.in'}</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-[#D4A373]" /> {content.contact_info?.address || 'Organic Lane, Kerala'}</div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

