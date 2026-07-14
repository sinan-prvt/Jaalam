import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBag, MapPin, Mail, Phone, Star } from 'lucide-react';

export default function PlayfulTextilesTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Color Pop Apparel';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Graphic Print Tee', price: '₹499', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', tag: 'New!' },
    { name: 'Kids Denim Overalls', price: '₹899', image: 'https://images.unsplash.com/photo-1519238263530-99abca9665ae?auto=format&fit=crop&w=600&q=80', tag: 'Cute!' },
    { name: 'Colorful Sneaker Socks', price: '₹299', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80', tag: 'Pack of 3' },
    { name: 'Neon Windbreaker', price: '₹1,299', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', tag: 'Trending' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F0F4FF] text-[#1D3557] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800;900&display=swap');
        .font-fun { font-family: 'Fredoka One', cursive; }
        .font-body { font-family: 'Nunito', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="p-4 md:p-8 relative z-10">
        <div className="container mx-auto bg-white rounded-full border-4 border-[#1D3557] shadow-[6px_6px_0_#1D3557] px-8 py-4 flex justify-between items-center transform rotate-1">
          <span className="font-fun text-3xl text-[#E63946]">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          <nav className="hidden md:flex gap-8 font-fun text-[#457B9D] text-lg">
            <a href="#shop" className="hover:text-[#E63946] transition-colors">Shop</a>
            <a href="#contact" className="hover:text-[#E63946] transition-colors">Contact</a>
            <span className="bg-[#E63946] text-white px-4 py-1 rounded-full border-2 border-[#1D3557]">Cart (0)</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 text-center relative">
        <div className="absolute top-10 left-10 text-[#FFD166] animate-spin-slow"><Star size={60} /></div>
        <div className="absolute bottom-10 right-20 text-[#06D6A0] animate-bounce"><Star size={40} /></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="font-fun text-6xl md:text-8xl text-[#1D3557] mb-8 leading-tight">
            {content.hero_title || 'Dress Happy!'}
          </h1>
          <p className="font-body font-black text-2xl text-[#E63946] mb-12 bg-white inline-block px-8 py-3 rounded-2xl border-4 border-[#1D3557] shadow-[4px_4px_0_#457B9D] transform -rotate-2">
            {content.hero_text || 'Fun, colorful, and super comfy clothes for kids and adults who are young at heart.'}
          </p>
          <div className="flex justify-center">
            <a href="#shop" className="bg-[#06D6A0] hover:bg-[#05b586] text-white font-fun text-3xl py-5 px-12 rounded-full border-4 border-[#1D3557] shadow-[8px_8px_0_#1D3557] active:translate-y-2 active:shadow-none transition-all flex items-center gap-4">
              <ShoppingBag size={32} /> Let's Go!
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-fun text-5xl text-center text-[#E63946] mb-16">Fresh Drops 🔥</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} className={`bg-white rounded-3xl p-4 border-4 border-[#1D3557] shadow-[6px_6px_0_#E63946] hover:-translate-y-3 transition-transform relative ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <div className="absolute -top-4 -left-4 bg-[#FFD166] text-[#1D3557] font-fun text-sm px-4 py-2 rounded-xl border-2 border-[#1D3557] transform -rotate-12 z-10">
                  {p.tag}
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-[#F0F4FF]">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-fun text-xl text-[#1D3557] mb-2">{p.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-body font-black text-2xl text-[#457B9D]">{p.price}</span>
                  <button className="bg-[#E63946] text-white p-3 rounded-full hover:bg-red-600 transition-colors border-2 border-[#1D3557]">
                    <ShoppingBag size={20} />
                  </button>
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
      <footer id="contact" className="bg-[#1D3557] text-white py-16 px-6 mt-12 border-t-[12px] border-[#E63946]">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-fun text-4xl mb-6 text-[#FFD166]">{siteName}</h3>
          <p className="font-body font-bold text-xl mb-12 max-w-md mx-auto">
            {content.about_text || "Bringing color to your wardrobe everyday!"}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 font-fun text-xl">
            <div className="bg-white/10 p-6 rounded-3xl border-2 border-[#457B9D] flex flex-col items-center gap-3 hover:bg-[#E63946] transition-colors">
               <Phone size={32} />
               <span>{content.contact_info?.phone || '98765 43210'}</span>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border-2 border-[#457B9D] flex flex-col items-center gap-3 hover:bg-[#06D6A0] transition-colors">
               <MapPin size={32} />
               <span>{content.contact_info?.address || 'Fashion Hub, Kerala'}</span>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border-2 border-[#457B9D] flex flex-col items-center gap-3 hover:bg-[#FFD166] transition-colors text-white hover:text-[#1D3557]">
               <Mail size={32} />
               <span>{content.contact_info?.email || 'hello@colorpop.com'}</span>
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

