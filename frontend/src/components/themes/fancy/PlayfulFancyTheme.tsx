import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Star, Gift, ShoppingCart, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function PlayfulFancyTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Pixie Dust';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Unicorn Hair Clips', price: '₹150', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Cute colorful hair accessories.' },
    { name: 'Glitter Nail Paint Set', price: '₹299', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80', description: 'Safe, peel-off glitter nail polish.' },
    { name: 'Mermaid Tail Pouch', price: '₹350', image: 'https://images.unsplash.com/photo-1585336261022-680e2a5c0b11?auto=format&fit=crop&w=600&q=80', description: 'Sequin mermaid pouch.' },
    { name: 'Rainbow Choker', price: '₹99', image: 'https://images.unsplash.com/photo-1599643478514-4a4208bd50d6?auto=format&fit=crop&w=600&q=80', description: 'Bright and colorful choker necklace.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FFF0F5] text-purple-900 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&family=Nunito:wght@400;700;900&display=swap');
        .font-playful { font-family: 'Balsamiq Sans', cursive; }
        .font-body { font-family: 'Nunito', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b-4 border-pink-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!content?.settings_json?.logo_image && <Star className="text-yellow-400 fill-current animate-bounce" size={28} />}
            <span className="font-playful text-3xl font-bold text-pink-500 tracking-wider">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          <nav className="hidden md:flex gap-6 font-body font-bold text-lg text-purple-600">
            <a href="#shop" className="hover:text-pink-500 hover:-translate-y-1 transition-transform">Shop</a>
            <a href="#about" className="hover:text-pink-500 hover:-translate-y-1 transition-transform">About</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6 text-center overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-purple-100">
        <div className="absolute top-10 left-10 text-pink-300 opacity-50 rotate-12"><Heart size={64} fill="currentColor" /></div>
        <div className="absolute bottom-10 right-10 text-yellow-300 opacity-50 -rotate-12"><Star size={80} fill="currentColor" /></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-block bg-white border-2 border-pink-300 text-pink-500 font-playful px-6 py-2 rounded-full mb-8 shadow-md">
             ✨ Magic Awaits! ✨
          </div>
          <h1 className="font-playful text-6xl md:text-8xl text-purple-800 mb-8 leading-tight drop-shadow-sm">
            {content.hero_title || 'Cute Finds for Cute Minds!'}
          </h1>
          <p className="font-body font-bold text-xl text-purple-600 mb-12 max-w-2xl mx-auto">
            {content.hero_text || 'Dive into our magical collection of fun accessories, colorful cosmetics, and adorable lifestyle items.'}
          </p>
          <a href="#shop" className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-body font-black text-xl py-4 px-12 rounded-full shadow-[0_6px_0_#d81b60] active:translate-y-2 active:shadow-none transition-all">
            <Gift size={24} /> Shop Now
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <section id="shop" className="py-20 px-6 bg-white relative">
        <div className="absolute top-[-20px] left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.8,188.94,98.67,243.64,82.52,284.18,63.36,321.39,56.44Z" className="fill-[#FFF0F5]"></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-6xl mt-10">
          <h2 className="font-playful text-4xl text-center text-pink-500 mb-16">
            🌈 Featured Goodies
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-purple-50 rounded-[2rem] p-4 border-4 border-purple-200 hover:border-pink-400 hover:-translate-y-2 hover:shadow-xl transition-all group">
                <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-white relative">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-yellow-400 text-white font-playful px-3 py-1 rounded-full text-sm shadow-sm rotate-12">
                    {p.price}
                  </div>
                </div>
                <div className="px-2 pb-2 text-center">
                  <h3 className="font-playful text-xl text-purple-800 mb-2">{p.name}</h3>
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-body font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCart size={18} /> Add
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
      <footer id="about" className="bg-purple-800 text-purple-100 py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Star className="text-yellow-400 fill-current" size={32} />
            <span className="font-playful text-4xl font-bold text-white tracking-wider">{siteName}</span>
          </div>
          <p className="font-body text-lg max-w-lg mx-auto mb-12 font-bold">
            {content.about_text || "Bringing smiles with every accessory! The cutest fancy store in town."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body font-bold bg-purple-900/50 p-6 rounded-3xl">
            <div className="flex flex-col items-center gap-2"><Phone className="text-pink-400" /> {content.contact_info?.phone || '98765 43210'}</div>
            <div className="flex flex-col items-center gap-2"><Mail className="text-yellow-400" /> {content.contact_info?.email || 'hello@pixiedust.in'}</div>
            <div className="flex flex-col items-center gap-2"><MapPin className="text-green-400" /> {content.contact_info?.address || 'Fun Street, Kerala'}</div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

