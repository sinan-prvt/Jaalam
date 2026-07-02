import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Wine, Search, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function PremiumGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Luxe Gourmet';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Truffle Infused Olive Oil', price: '₹2,400', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', origin: 'Italy' },
    { name: 'Artisanal Sourdough', price: '₹350', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', origin: 'House Bakery' },
    { name: 'Aged Balsamic Vinegar', price: '₹1,800', image: 'https://images.unsplash.com/photo-1548811579-017fd2a2a2c5?auto=format&fit=crop&w=600&q=80', origin: 'Modena' },
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
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="border-b border-[#C9A66B]/30 bg-[#0A0A0A]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {!content?.settings_json?.logo_image && <Wine className="text-[#C9A66B]" size={28} />}
            <span className="font-premium text-3xl tracking-widest text-[#C9A66B] uppercase">{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase text-gray-400">
            <a href="#curated" className="hover:text-[#C9A66B] transition-colors">Curated Selection</a>
            <a href="#visit" className="hover:text-[#C9A66B] transition-colors">Boutique</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606103920295-9a091573f160?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="font-body text-[#C9A66B] tracking-[0.3em] text-xs uppercase mb-6">Fine Foods & Groceries</p>
          <h1 className="font-premium text-5xl md:text-7xl font-bold mb-8 text-white tracking-wide leading-tight max-w-4xl mx-auto">
            {content.hero_title || 'An Epicurean Journey Awaits.'}
          </h1>
          <p className="font-premium italic text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {content.hero_text || 'Discover a meticulously curated selection of gourmet ingredients, imported delicacies, and organic local produce.'}
          </p>
          <button className="border border-[#C9A66B] text-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#111111] px-10 py-4 font-body text-xs uppercase tracking-widest transition-all duration-300">
            Explore the Aisles
          </button>
        </div>
      </section>

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
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
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

      
      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">Have questions or want to reach out? Contact our support team.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="font-bold text-gray-800">{content.contact_info?.phone || '1800 123 4567'}</span>
              </div>
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="font-bold text-gray-800 break-all">{content.contact_info?.email || 'hello@example.com'}</span>
              </div>
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="font-bold text-gray-800 text-sm max-w-[200px] truncate">{content.contact_info?.address || '123 Main Street'}</span>
              </div>
            </div>
            
            {/* Embedded Map */}
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-inner border border-gray-100 relative mt-8">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798902705!2d-74.25986548248684!3d40.697670067823786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1689264426578!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
            
          </div>
        </section>
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
               <span>{content.contact_info?.address || '1 Heritage Square, Kerala'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
               <span className="text-[#C9A66B] uppercase">Concierge</span>
               <span>{content.contact_info?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
               <span className="text-[#C9A66B] uppercase">Inquiries</span>
               <span>{content.contact_info?.email || 'concierge@luxegourmet.in'}</span>
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

