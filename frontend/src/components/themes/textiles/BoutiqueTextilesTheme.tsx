import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react';

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function BoutiqueTextilesTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Kanjivaram Silks';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Bridal Kanjivaram Silk', price: '₹45,000', image: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=600&q=80', description: 'Pure silk with pure zari work.' },
    { name: 'Banarasi Brocade', price: '₹18,500', image: 'https://images.unsplash.com/photo-1583391733958-d15fa693d221?auto=format&fit=crop&w=600&q=80', description: 'Traditional weaving technique.' },
    { name: 'Soft Silk Saree', price: '₹8,500', image: 'https://images.unsplash.com/photo-1615886753866-79396abc446e?auto=format&fit=crop&w=600&q=80', description: 'Lightweight and elegant.' },
    { name: 'Handloom Cotton', price: '₹2,400', image: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&w=600&q=80', description: 'Comfortable daily wear.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FAFAF8] text-[#4A3B32] font-serif border-x-[16px] border-x-[#8C3A3A] box-border">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400&display=swap');
        .font-elegant { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
        .bg-pattern {
          background-color: #FAFAF8;
          background-image: radial-gradient(#D9C5B2 1px, transparent 1px);
          background-size: 20px 20px;
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="py-8 px-6 border-b border-[#D9C5B2] bg-white relative z-10">
        <div className="container mx-auto text-center">
          <Sparkles className="mx-auto text-[#D4AF37] mb-4" size={24} />
          <h1 className="font-elegant text-5xl md:text-6xl text-[#8C3A3A] tracking-wider mb-6">
            {content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}
          </h1>
          <nav className="flex justify-center gap-10 font-body text-[10px] tracking-[0.3em] uppercase text-[#6B5A4E]">
            <a href="#collection" className="hover:text-[#8C3A3A] transition-colors">Collections</a>
            <a href="#heritage" className="hover:text-[#8C3A3A] transition-colors">Our Heritage</a>
            <a href="#visit" className="hover:text-[#8C3A3A] transition-colors">Visit Boutique</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-pattern relative">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
             <div className="absolute inset-0 bg-[#8C3A3A] translate-x-4 translate-y-4"></div>
             <img loading="lazy" src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=800&q=80" alt="Silk Saree" className="relative z-10 w-full h-auto object-cover shadow-xl border-4 border-white" />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="font-elegant text-4xl md:text-5xl font-bold mb-6 text-[#4A3B32] leading-tight">
              {content.hero_title || 'Six Yards of Pure Elegance.'}
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto md:mx-0 mb-8"></div>
            <p className="font-elegant text-xl italic text-[#6B5A4E] mb-10 leading-relaxed">
              {content.hero_text || 'Exquisite handwoven silk sarees directly from the master weavers of Kanchipuram and Banaras.'}
            </p>
            <button className="bg-[#8C3A3A] hover:bg-[#7A3333] text-white font-body text-xs tracking-[0.2em] uppercase py-4 px-10 transition-colors">
              Explore Silks
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="collection" className="py-24 px-6 bg-white border-y border-[#D9C5B2]">
        <div className="container mx-auto max-w-6xl">
          <h3 className="font-elegant text-4xl text-center text-[#8C3A3A] mb-16 tracking-widest uppercase">Bridal Trousseau</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer flex gap-6 group cursor-pointer">
                <div className="w-1/2 aspect-[3/4] relative overflow-hidden bg-[#FAFAF8]">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 border-2 border-[#D4AF37]/30 m-4 pointer-events-none"></div>
                </div>
                <div className="w-1/2 flex flex-col justify-center py-6 pr-6">
                  <h4 className="font-elegant text-2xl text-[#4A3B32] mb-3 leading-snug">{p.name}</h4>
                  <p className="font-body text-xs text-[#6B5A4E] leading-loose mb-6">{p.description}</p>
                  <div className="font-body text-[#8C3A3A] tracking-widest">{p.price}</div>
                  <button className="mt-8 border-b border-[#D4AF37] text-[#D4AF37] self-start font-body text-[10px] tracking-[0.2em] uppercase pb-1 group-hover:text-[#8C3A3A] group-hover:border-[#8C3A3A] transition-colors">
                    Inquire Now
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
      <footer id="visit" className="bg-[#4A3B32] text-[#FAFAF8] py-20 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h3 className="font-elegant text-4xl text-[#D4AF37] mb-8">{siteName}</h3>
          <p className="font-body text-xs tracking-widest leading-loose max-w-xl mx-auto mb-16 opacity-80">
            {content.about_text || "Preserving the rich weaving heritage of India. Every piece in our boutique is carefully selected to offer you the finest quality textiles."}
          </p>
          
          <div className="flex justify-center gap-6 mb-12">
             <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#4A3B32] transition-colors cursor-pointer"><Instagram size={18} /></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 font-body text-[10px] tracking-[0.2em] uppercase border-t border-[#6B5A4E] pt-12">
             <div className="flex flex-col items-center gap-3">
               <Phone className="text-[#D4AF37]" size={16} />
               <span>{content.contact_info?.phone || '98765 43210'}</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <MapPin className="text-[#D4AF37]" size={16} />
               <span>{content.contact_info?.address || 'Silk Street, Kerala'}</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Mail className="text-[#D4AF37]" size={16} />
               <span>{content.contact_info?.email || 'boutique@silks.com'}</span>
             </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

