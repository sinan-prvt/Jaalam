import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBasket, MapPin, Phone, Tag } from 'lucide-react';

export default function ClassicGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Family Supermarket';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Basmati Rice (Premium)', price: '₹220/kg', image: 'https://images.unsplash.com/photo-1574323347407-15e5a4b51a8d?auto=format&fit=crop&w=600&q=80', originalPrice: '₹250' },
    { name: 'Refined Sunflower Oil', price: '₹145/L', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', originalPrice: '₹160' },
    { name: 'Red Onions', price: '₹40/kg', image: 'https://images.unsplash.com/photo-1587049352847-81a56d773c1c?auto=format&fit=crop&w=600&q=80', originalPrice: '₹55' },
    { name: 'Washing Powder', price: '₹190/kg', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80', originalPrice: '₹210' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F8F9FA] text-[#212529] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        .font-classic { font-family: 'Roboto', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root > header { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-[#E50914] text-white sticky top-0 z-50 border-b-4 border-[#0033A0]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              {!content?.settings_json?.logo_image && <ShoppingBasket size={32} className="text-[#FFD100]" />}
              <span className="font-classic text-3xl font-black italic tracking-tighter shadow-sm">{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-10 md:h-12 w-auto object-contain" /> : siteName}</span>
            </div>
            <div className="hidden md:flex items-center gap-6 font-classic font-bold text-sm">
              <a href="#offers" className="hover:text-[#FFD100] transition-colors flex items-center gap-1"><Tag size={16}/> Weekly Offers</a>
              <a href="#visit" className="hover:text-[#FFD100] transition-colors">Find Us</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0033A0] transform skew-x-12 translate-x-16 opacity-10"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative z-10">
          <div className="w-full md:w-1/2 pr-0 md:pr-12">
            <h1 className="font-classic text-4xl md:text-6xl font-black text-[#0033A0] mb-4 uppercase leading-none">
              {content.hero_title || 'Everyday Low Prices.'}
            </h1>
            <p className="font-classic text-xl font-medium text-gray-600 mb-8">
              {content.hero_text || 'Your one-stop shop for daily groceries, household items, and fresh produce at unbeatable rates.'}
            </p>
            <button className="bg-[#FFD100] hover:bg-[#F2C700] text-[#212529] font-classic font-bold text-lg py-3 px-8 rounded shadow-[2px_2px_0_#212529] active:shadow-none active:translate-y-[2px] transition-all" onClick={() => (document.getElementById('menu') || document.getElementById('offers') || document.getElementById('products') || document.getElementById('about'))?.scrollIntoView({ behavior: 'smooth' })}>
              View Weekly Flyer
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
             <div className="bg-white p-4 border-4 border-[#0033A0] transform rotate-2 shadow-xl">
               <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80" alt="Supermarket Aisle" className="w-full h-auto" />
             </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="offers" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-classic text-3xl font-black text-[#E50914] uppercase bg-white px-4 py-2 border-2 border-[#E50914] inline-block shadow-[4px_4px_0_#E50914]">
              Mega Savings
            </h2>
            <div className="h-1 flex-1 bg-[#0033A0]"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white border-2 border-gray-200 p-4 hover:border-[#0033A0] transition-colors flex flex-col h-full relative">
                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-[#E50914] text-white font-black text-xs px-2 py-1 rounded shadow-sm z-10">
                  SAVE!
                </div>
                
                <div className="aspect-square bg-white mb-4 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <h3 className="font-classic font-bold text-lg text-[#0033A0] leading-tight mb-2 flex-grow">{p.name}</h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <div className="text-gray-400 line-through text-sm font-medium">{p.originalPrice}</div>
                    <div className="font-classic font-black text-2xl text-[#E50914]">{p.price}</div>
                  </div>
                  
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
      <footer id="visit" className="bg-[#212529] text-white py-12 px-4 border-t-8 border-[#FFD100]">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="font-classic text-2xl font-black italic mb-4 text-[#FFD100]">{siteName}</h3>
          <p className="font-classic mb-8 text-gray-400 max-w-md mx-auto">
            {content.about_text || "Serving the community with quality products and friendly service since 1995."}
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 font-classic font-bold bg-[#343A40] p-6 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="text-[#FFD100]" /> 
              <span>{content.contact_info?.phone || '0484 234 5678'}</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <MapPin className="text-[#FFD100]" /> 
              <span>{content.contact_info?.address || 'Main Road Junction, Kerala'}</span>
            </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

