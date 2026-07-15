import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export default function BoutiqueFancyTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Maison Rouge';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Bridal Set - The Heritage', price: '₹4,500', image: 'https://images.unsplash.com/photo-1599643478514-4a4208bd50d6?auto=format&fit=crop&w=600&q=80', description: 'Heavy imitation Kundan bridal set.' },
    { name: 'Evening Clutch', price: '₹1,200', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: 'Velvet clutch with Zardosi embroidery.' },
    { name: 'Chandelier Earrings', price: '₹850', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Gold-plated statement earrings.' },
    { name: 'Designer Bindi Book', price: '₹250', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Premium collection of stone bindis.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FFFDF9] text-[#2C1E16] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;import ProductBuyButton from '../../payments/ProductBuyButton';
500;700&family=Jost:wght@300;400;500&display=swap');
        .font-boutique { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Jost', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="py-8 border-b border-[#E8E1D5]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-boutique text-4xl tracking-[0.2em] uppercase mb-4 text-[#8C2323]">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</h1>
          <nav className="flex justify-center gap-10 font-body text-xs tracking-widest uppercase text-[#5A4A42]">
            <a href="#collections" className="hover:text-[#8C2323] transition-colors">Collections</a>
            <a href="#about" className="hover:text-[#8C2323] transition-colors">The Boutique</a>
            <a href="#contact" className="hover:text-[#8C2323] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 md:pr-12">
            <p className="font-body text-[#8C2323] text-sm tracking-widest uppercase mb-4">Exquisite Collections</p>
            <h2 className="font-boutique text-5xl md:text-6xl leading-tight mb-6">
              {content.hero_title || 'Redefining Elegance for the Modern Woman.'}
            </h2>
            <p className="font-body text-lg text-[#5A4A42] font-light leading-relaxed mb-8">
              {content.hero_text || 'Step into a world of curated beauty. From bridal imitation jewelry to imported cosmetics, find your perfect statement piece.'}
            </p>
            <a href="#collections" className="inline-flex items-center gap-4 bg-[#8C2323] text-white px-8 py-4 font-body text-xs uppercase tracking-widest hover:bg-[#6b1a1a] transition-colors">
              Discover More <ArrowRight size={16} />
            </a>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 border border-[#8C2323] translate-x-4 translate-y-4"></div>
              <img loading="lazy" src="https://images.unsplash.com/photo-1515562141207-7a48fb3c274d?auto=format&fit=crop&w=800&q=80" alt="Boutique" className="relative z-10 w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section id="collections" className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-between items-end mb-16 border-b border-[#E8E1D5] pb-4">
            <h3 className="font-boutique text-3xl text-[#8C2323]">Signature Pieces</h3>
            <a href="#" className="font-body text-sm uppercase tracking-widest text-[#5A4A42] hover:text-[#8C2323]">View All</a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <h4 className="font-boutique text-lg mb-1">{p.name}</h4>
                <div className="font-body text-[#8C2323] tracking-widest">{p.price}</div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
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
      <footer id="contact" className="py-20 px-6 border-t border-[#E8E1D5]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-12">
          <div className="w-full md:w-1/3">
             <h3 className="font-boutique text-2xl tracking-[0.1em] uppercase mb-6 text-[#8C2323]">{siteName}</h3>
             <p className="font-body text-sm text-[#5A4A42] leading-relaxed">
               {content.about_text || "The ultimate destination for luxury fancy items and bridal collections."}
             </p>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-sm text-[#5A4A42]">
             <div>
               <h4 className="uppercase tracking-widest text-[#8C2323] mb-6 border-b border-[#E8E1D5] pb-2 inline-block">Contact</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-3"><Phone size={16} /> {content.contact_info?.phone || '+91 98765 43210'}</div>
                 <div className="flex items-center gap-3"><Mail size={16} /> {content.contact_info?.email || 'boutique@maisonrouge.in'}</div>
               </div>
             </div>
             <div>
               <h4 className="uppercase tracking-widest text-[#8C2323] mb-6 border-b border-[#E8E1D5] pb-2 inline-block">Visit</h4>
               <div className="flex items-start gap-3"><MapPin size={16} className="shrink-0 mt-1" /> <span className="leading-relaxed">{content.contact_info?.address || 'The High Street Boutique, Kerala'}</span></div>
             </div>
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

