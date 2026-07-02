import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingCart, Star, MapPin, Mail, Phone, Smile } from 'lucide-react';

export default function PlayfulGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Super Yummy Mart!';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Rainbow Cereal', price: '₹250', image: 'https://images.unsplash.com/photo-1518133527339-b9d99723ecdb?auto=format&fit=crop&w=600&q=80', tag: 'Kids Favorite!' },
    { name: 'Juicy Apples', price: '₹120/kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&w=600&q=80', tag: 'Super Fresh!' },
    { name: 'Choco Chip Cookies', price: '₹80', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80', tag: 'Yum!' },
    { name: 'Orange Juice', price: '₹95', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', tag: 'Healthy!' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#E0F7FA] text-[#006064] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@500;700;900&display=swap');
        .font-fun { font-family: 'Fredoka One', cursive; }
        .font-body { font-family: 'Quicksand', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white p-4 mx-4 mt-4 rounded-full border-4 border-[#FF4081] shadow-[4px_4px_0_#FF4081] sticky top-4 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            {!content?.settings_json?.logo_image && <Smile size={32} className="text-[#FFB300]" />}
            <span className="font-fun text-2xl text-[#FF4081]">{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          <nav className="hidden md:flex gap-6 font-fun text-[#00ACC1] text-lg">
            <a href="#aisles" className="hover:text-[#FFB300] transition-colors">Aisles</a>
            <a href="#hello" className="hover:text-[#FFB300] transition-colors">Say Hello</a>
            <div className="bg-[#FFB300] text-white px-4 py-1 rounded-full border-2 border-[#FF4081]">
               Cart: 0
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center relative">
        <div className="absolute top-10 left-10 text-[#FF4081] animate-bounce"><Star size={40} /></div>
        <div className="absolute top-20 right-20 text-[#FFB300] animate-bounce" style={{animationDelay: '0.5s'}}><Star size={60} /></div>
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <h1 className="font-fun text-5xl md:text-7xl text-[#00ACC1] mb-6 drop-shadow-sm leading-tight">
            {content.hero_title || 'Grocery shopping made super fun!'}
          </h1>
          <p className="font-body font-bold text-2xl text-[#FF4081] mb-10 bg-white inline-block px-6 py-2 rounded-2xl border-4 border-[#FFB300] transform rotate-1">
            {content.hero_text || 'Everything your family needs, delivered with a big smile! 😊'}
          </p>
          <div className="flex justify-center">
            <button className="bg-[#FF4081] hover:bg-[#F50057] text-white font-fun text-3xl py-4 px-10 rounded-full border-4 border-[#00ACC1] shadow-[6px_6px_0_#00ACC1] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3">
              <ShoppingCart size={28} /> Start Shopping!
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="aisles" className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-fun text-4xl text-center text-[#FFB300] mb-12 bg-white inline-block px-8 py-3 rounded-full border-4 border-[#00ACC1] transform -rotate-2 mx-auto flex items-center justify-center w-fit">
            Yummy Picks!
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white rounded-3xl p-4 border-4 border-[#00ACC1] hover:-translate-y-3 transition-transform shadow-[6px_6px_0_#FFB300] relative">
                <div className="absolute -top-4 -right-4 bg-[#FF4081] text-white font-fun text-sm px-3 py-1 rounded-full border-2 border-white transform rotate-12 z-10">
                  {p.tag}
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-[#E0F7FA]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-fun text-xl text-[#006064] mb-2">{p.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-fun text-2xl text-[#FF4081]">{p.price}</span>
                  <button className="bg-[#00ACC1] text-white p-3 rounded-full hover:bg-[#0097A7] transition-colors border-2 border-[#006064]">
                    <ShoppingCart size={20} />
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
      <footer id="hello" className="bg-[#00ACC1] text-white py-16 mt-10 rounded-t-[4rem] border-t-8 border-[#FFB300]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h3 className="font-fun text-4xl mb-6 text-white drop-shadow-md">{siteName}</h3>
          <p className="font-body font-bold text-xl mb-10 max-w-md mx-auto">
            {content.about_text || "The happiest supermarket in town!"}
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 font-fun text-xl">
            <div className="bg-white text-[#00ACC1] p-4 rounded-2xl border-4 border-[#FF4081] flex items-center gap-2 shadow-[4px_4px_0_#FFB300]">
               <Phone size={24} /> {content.contact_info?.phone || '98765 43210'}
            </div>
            <div className="bg-white text-[#00ACC1] p-4 rounded-2xl border-4 border-[#FF4081] flex items-center gap-2 shadow-[4px_4px_0_#FFB300]">
               <MapPin size={24} /> {content.contact_info?.address || 'Happy Lane, Kerala'}
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

