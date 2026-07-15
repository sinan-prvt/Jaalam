import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Smile, Bone, MapPin, Mail, Phone, ShoppingCart, Star } from 'lucide-react';

export default function PlayfulMeatTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Happy Meats!';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Yummy Chicken Lollipops', price: '₹350/kg', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80', description: 'Perfect for kids parties!' },
    { name: 'Mutton Mince (Kheema)', price: '₹850/kg', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: 'Make the best meatballs.' },
    { name: 'Tender Chicken Breast', price: '₹280/kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', description: 'Lean and healthy protein.' },
    { name: 'Fresh Soup Bones', price: '₹150/kg', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', description: 'For hearty, healthy broths.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Super Fast Delivery!', description: 'We bring the goodness right to your door.' },
    { title: 'Kid Friendly Cuts', description: 'Boneless and ready for nuggets.' },
    { title: '100% Smiley Quality', description: 'Only the best for your family dinners.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FFFBEA] text-[#E03A3E] font-sans border-[12px] border-[#E03A3E] box-border relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chewy&family=Quicksand:wght@500;700;900&display=swap');
        .font-playful { font-family: 'Chewy', cursive; }
        .font-body { font-family: 'Quicksand', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Decorative BG Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#F48C06 4px, transparent 4px)', backgroundSize: '40px 40px' }}></div>

      {/* Header */}
      <header className="p-6 relative z-10 sticky top-0 bg-[#FFFBEA]/90 backdrop-blur-sm border-b-[8px] border-[#E03A3E]">
        <div className="container mx-auto bg-white rounded-[2rem] border-4 border-[#E03A3E] shadow-[8px_8px_0_#E03A3E] px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="h-12 object-contain" />
            ) : (
              <>
                <Bone className="text-[#E03A3E] transform -rotate-12" size={32} />
                <span className="font-playful text-4xl text-[#E03A3E]">{siteName}</span>
              </>
            )}
          </div>
          <nav className="flex gap-6 font-body font-black text-[#F48C06] text-lg">
            <a href="#shop" className="hover:text-[#E03A3E] transition-colors">Our Meats</a>
            <a href="#contact" className="hover:text-[#E03A3E] transition-colors">Say Hello</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-16 px-6 text-center">
              <div className="container mx-auto max-w-4xl flex flex-col items-center">
                <div className="relative inline-block mb-6">
                  <h1 className="font-playful text-6xl md:text-8xl text-[#E03A3E] drop-shadow-sm relative z-10">
                    {content.hero_title || 'Fresh. Clean. Super Tasty!'}
                  </h1>
                  <Star className="absolute -top-6 -right-10 text-[#F48C06] fill-[#F48C06] rotate-12" size={48} />
                </div>
                <p className="font-body font-bold text-xl md:text-2xl text-[#F48C06] mb-12 bg-white inline-block px-8 py-4 rounded-[2rem] border-4 border-[#F48C06] -rotate-2 max-w-2xl shadow-[6px_6px_0_#E03A3E]">
                  {content.about_text || content.hero_text || 'Your friendly neighborhood butcher bringing you the absolute best cuts!'}
                </p>
                {content.settings_json?.hero_image && (
                  <div className="w-full max-w-2xl mb-12 rounded-[3rem] overflow-hidden border-8 border-[#E03A3E] shadow-[12px_12px_0_#F48C06] rotate-1">
                    <img loading="lazy" src={content.settings_json.hero_image} alt="Hero" className="w-full h-auto object-cover" />
                  </div>
                )}
                <a href="#shop" className="bg-[#F48C06] hover:bg-[#ff9f1c] text-white font-playful text-3xl md:text-4xl py-4 px-12 rounded-[3rem] border-4 border-[#E03A3E] shadow-[8px_8px_0_#E03A3E] active:translate-y-2 active:shadow-none transition-all flex items-center gap-4 hover:-rotate-3">
                  <ShoppingCart size={32} /> Shop Now!
                </a>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-20 px-6">
              <div className="container mx-auto max-w-5xl bg-[#E03A3E] rounded-[3rem] p-8 md:p-16 border-8 border-white shadow-[12px_12px_0_#F48C06] flex flex-col md:flex-row items-center gap-12 rotate-1">
                <div className="md:w-1/2 text-white text-center md:text-left">
                  <h2 className="font-playful text-5xl mb-6">{content.settings_json?.about_title || content.about_title || 'About Us!'}</h2>
                  <p className="font-body font-bold text-xl leading-relaxed">
                    {content.settings_json?.about_description || content.about_description || 'We are a family-owned butcher shop that believes meat should be fun, fresh, and fantastic! We source from happy farms so you get happy meals.'}
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="rounded-[2rem] overflow-hidden border-8 border-white shadow-[8px_8px_0_#F48C06] -rotate-3 bg-white">
                    <img loading="lazy" src={content.settings_json?.about_image || content.about_image || "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80"} alt="About Us" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-20 px-6">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-playful text-5xl text-center text-[#E03A3E] mb-16 underline decoration-wavy decoration-[#F48C06] underline-offset-8">
                  What We Do Best!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((srv: any, idx: number) => {
                    const title = typeof srv === 'string' ? srv : srv.title;
                    const desc = typeof srv === 'string' ? '' : srv.description;
                    return (
                      <div key={idx} className={`bg-white p-8 rounded-[3rem] border-4 border-[#E03A3E] text-center shadow-[8px_8px_0_#F48C06] transition-transform hover:-translate-y-2 ${idx === 1 ? 'md:-translate-y-8' : ''}`}>
                        <div className="w-20 h-20 bg-[#F48C06] rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#E03A3E] overflow-hidden">
                          {srv.image ? (
                            <img loading="lazy" src={srv.image} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <Smile size={40} className="text-white" />
                          )}
                        </div>
                        <h3 className="font-playful text-3xl text-[#E03A3E] mb-4">{title}</h3>
                        <p className="font-body font-bold text-[#F48C06] text-lg">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="shop" className="py-20 px-6">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-playful text-5xl text-center text-[#E03A3E] mb-16 underline decoration-wavy decoration-[#F48C06] underline-offset-8">
                  Yummy Selections
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {products.map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white rounded-[2rem] p-4 border-4 border-[#E03A3E] hover:-translate-y-4 transition-transform shadow-[8px_8px_0_#F48C06]">
                      <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-4 border-4 border-[#F48C06]">
                        <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-playful text-2xl text-[#E03A3E] mb-2 leading-none">{p.name}</h3>
                      <p className="font-body font-bold text-sm text-[#F48C06] mb-4">{p.description}</p>
                      <div className="flex justify-between items-end mt-auto pt-4 border-t-4 border-dashed border-[#FFFBEA]">
                        <span className="font-body font-black text-xl text-[#F48C06]">{p.price}</span>
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
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-20 px-6">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-playful text-5xl text-center text-[#E03A3E] mb-16 underline decoration-wavy decoration-[#F48C06] underline-offset-8">
                  Meat Pics!
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {gallery.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    // Random rotation for each image to make it playful
                    const rotations = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3'];
                    const rotation = rotations[idx % 4];
                    return (
                      <div key={idx} className={`bg-white p-3 rounded-[2rem] border-4 border-[#E03A3E] shadow-[6px_6px_0_#F48C06] ${rotation} hover:rotate-0 transition-transform hover:scale-105 hover:z-10`}>
                        <div className="aspect-square rounded-[1rem] overflow-hidden">
                          <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-20 px-6">
              <div className="container mx-auto max-w-4xl text-center bg-white p-10 md:p-16 rounded-[3rem] border-8 border-[#E03A3E] shadow-[16px_16px_0_#F48C06] relative">
                <Smile size={64} className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#F48C06] bg-white rounded-full p-2 border-4 border-[#E03A3E]" />
                
                <h2 className="font-playful text-5xl text-[#E03A3E] mb-10">Say Hello!</h2>
                
                <div className="grid md:grid-cols-2 gap-8 text-left mb-12">
                  <div className="space-y-6 font-body font-bold text-xl text-[#F48C06]">
                    {content.contact_info?.phone && (
                      <div className="flex items-center gap-4 bg-[#FFFBEA] p-4 rounded-2xl border-4 border-[#F48C06]">
                        <Phone size={28} className="text-[#E03A3E]" /> 
                        <span>{content.contact_info.phone}</span>
                      </div>
                    )}
                    {content.contact_info?.email && (
                      <div className="flex items-center gap-4 bg-[#FFFBEA] p-4 rounded-2xl border-4 border-[#F48C06]">
                        <Mail size={28} className="text-[#E03A3E]" /> 
                        <span>{content.contact_info.email}</span>
                      </div>
                    )}
                    {content.contact_info?.address && (
                      <div className="flex items-center gap-4 bg-[#FFFBEA] p-4 rounded-2xl border-4 border-[#F48C06]">
                        <MapPin size={28} className="text-[#E03A3E] shrink-0" /> 
                        <span className="text-lg leading-tight">{content.contact_info.address}</span>
                      </div>
                    )}
                  </div>
                  {content.contact_info?.address && (
                    <div className="rounded-3xl border-8 border-[#F48C06] overflow-hidden rotate-2">
                      <iframe 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-20 px-6">
              <div className="container mx-auto max-w-4xl space-y-12">
                {content.custom_blocks_json.map((block: any, idx: number) => {
                  if (block.type === 'heading') return <h2 key={idx} className="font-playful text-5xl text-center text-[#E03A3E] drop-shadow-sm">{block.content}</h2>;
                  if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-body font-bold text-xl text-[#F48C06] text-center bg-white p-8 rounded-[3rem] border-4 border-[#E03A3E] shadow-[8px_8px_0_#E03A3E]">{block.content}</p>;
                  if (block.type === 'image' && block.url) return <div key={idx} className="p-4 bg-white rounded-[3rem] border-4 border-[#E03A3E] shadow-[12px_12px_0_#F48C06] rotate-1 hover:-rotate-1 transition-transform"><img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto rounded-[2rem]" /></div>;
                  if (block.type === 'divider') return <div key={idx} className="flex justify-center gap-4"><Bone className="text-[#F48C06]" size={32}/><Bone className="text-[#E03A3E]" size={32}/><Bone className="text-[#F48C06]" size={32}/></div>;
                  return null;
                })}
              </div>
            </section>
          );

          return null;
        })}
      </main>

      
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
      <footer className="bg-[#E03A3E] text-white py-16 mt-10 rounded-t-[3rem] border-t-[12px] border-[#F48C06] relative z-10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Smile size={48} className="mx-auto text-[#F48C06] mb-4 bg-white rounded-full border-4 border-[#F48C06]" />
          <h3 className="font-playful text-4xl mb-6 text-[#FFFBEA] drop-shadow-md">{siteName}</h3>
          <p className="font-body font-bold text-lg max-w-md mx-auto mb-10 text-[#FFD6BA]">
            {content.about_text || "We love making our customers smile with great meat!"}
          </p>
          <div className="font-body font-black text-sm text-[#F48C06] bg-white inline-block px-6 py-2 rounded-full border-4 border-[#F48C06]">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}
