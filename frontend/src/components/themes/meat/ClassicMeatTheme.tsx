import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Scissors, MapPin, Mail, Phone, Clock } from 'lucide-react';

const Facebook = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const WhatsApp = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function ClassicMeatTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [viewProductsPage, setViewProductsPage] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const siteName = content.settings_json?.website_name || website.slug || 'The Local Butcher';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Whole Chicken (With Skin)', price: '₹220/kg', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', description: 'Freshly cut whole chicken.' },
    { name: 'Mutton Biryani Cut', price: '₹820/kg', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: 'Medium sized pieces ideal for biryani.' },
    { name: 'Country Chicken (Nadan)', price: '₹450/kg', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80', description: 'Free range country chicken.' },
    { name: 'Mutton Liver', price: '₹600/kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', description: 'Fresh mutton liver.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Custom Cuts', description: 'Tell us how you want it, and our master butchers will cut it exactly to your specifications.' },
    { title: 'Bulk Orders', description: 'Planning a feast? We provide special pricing and packaging for bulk party orders.' },
    { title: 'Home Delivery', description: 'Fresh meat delivered straight to your doorstep in temperature-controlled packaging.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FDFBF7] text-[#3E2723] font-serif relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rye&family=Roboto+Slab:wght@300;400;700&display=swap');
        .font-butcher { font-family: 'Rye', cursive; }
        .font-body { font-family: 'Roboto Slab', serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}></div>

      {/* Header */}
      <header className="bg-[#3E2723] text-[#FDFBF7] py-6 relative z-10 border-b-8 border-[#B71C1C]">
        <div className="container mx-auto px-6 flex flex-col items-center">
          {content.settings_json?.logo_image ? (
            <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="h-20 object-contain mb-4" />
          ) : (
            <>
              <Scissors size={32} className="text-[#B71C1C] mb-2" />
              <h1 className="font-butcher text-4xl md:text-5xl tracking-widest text-center uppercase mb-2">
                {siteName}
              </h1>
            </>
          )}
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#D7CCC8]">Est. 1995 • Quality Meats</p>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-16 px-6 relative z-10">
              <div className="container mx-auto max-w-4xl text-center">
                <h2 className="font-body text-3xl md:text-4xl font-bold mb-6 text-[#4E342E]">
                  {content.hero_title || 'Traditional Cuts. Exceptional Quality.'}
                </h2>
                <div className="w-16 h-1 bg-[#B71C1C] mx-auto mb-6"></div>
                <p className="font-body text-lg text-[#5D4037] mb-10 leading-relaxed max-w-2xl mx-auto">
                  {content.about_text || content.hero_text || 'We take pride in offering the finest, locally sourced meats cut to perfection by our master butchers.'}
                </p>
                <img loading="lazy" src={content.settings_json?.hero_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80"} alt="Butcher Block" className="w-full h-80 object-cover border-4 border-[#3E2723] shadow-xl" />
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-16 px-6 bg-[#EFEBE9] relative z-10 border-y border-[#D7CCC8]">
              <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <h3 className="font-butcher text-3xl mb-6 text-[#3E2723]">{content.settings_json?.about_title || content.about_title || 'Our Craft'}</h3>
                  <div className="w-12 h-1 bg-[#B71C1C] mb-6"></div>
                  <p className="font-body text-lg text-[#5D4037] leading-relaxed mb-6">
                    {content.settings_json?.about_description || content.about_description || 'With decades of experience behind the counter, we know meat. Our commitment to ethical sourcing and traditional butchery means you get the absolute best cuts for your table.'}
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="border-4 border-[#3E2723] p-2 bg-[#FDFBF7] shadow-[8px_8px_0_#B71C1C]">
                    <img loading="lazy" src={content.settings_json?.about_image || content.about_image || "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80"} alt="About Us" className="w-full aspect-[4/3] object-cover filter contrast-125 saturate-150" />
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-16 px-6 relative z-10">
              <div className="container mx-auto max-w-5xl text-center">
                <h3 className="font-butcher text-3xl mb-4 text-[#3E2723]">Our Services</h3>
                <div className="w-16 h-1 bg-[#B71C1C] mx-auto mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  {services.map((srv: any, idx: number) => {
                    const title = typeof srv === 'string' ? srv : srv.title;
                    const desc = typeof srv === 'string' ? '' : srv.description;
                    return (
                      <div key={idx} className="bg-[#EFEBE9] p-8 border-2 border-[#D7CCC8]">
                        {srv.image && <img loading="lazy" src={srv.image} alt={title} className="w-full h-32 object-cover mb-4 border-2 border-[#D7CCC8]" />}
                        <h4 className="font-body font-bold text-xl text-[#B71C1C] mb-3">{title}</h4>
                        <p className="font-body text-[#5D4037]">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="menu" className="py-16 bg-[#EFEBE9] relative z-10 border-y border-[#D7CCC8]">
              <div className="container mx-auto px-6 max-w-5xl">
                <h3 className="font-butcher text-3xl text-center mb-4 text-[#3E2723]">Daily Fresh Selection</h3>
                <div className="w-16 h-1 bg-[#B71C1C] mx-auto mb-12"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="flex bg-[#FDFBF7] p-4 border-2 border-[#3E2723] shadow-[4px_4px_0_#B71C1C] cursor-pointer hover:bg-[#F5E6E6] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#B71C1C] transition-all">
                      <div className="w-32 h-32 shrink-0 border border-[#8D6E63] overflow-hidden">
                        <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover filter contrast-125 saturate-150" />
                      </div>
                      <div className="ml-4 flex flex-col justify-center">
                        <h4 className="font-body font-bold text-xl text-[#3E2723] mb-1">{p.name}</h4>
                        <p className="font-body text-sm text-[#795548] mb-3 line-clamp-2">{p.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-butcher text-lg text-[#B71C1C]">{p.price}</span>
                          <button className="text-[10px] md:text-xs font-butcher uppercase tracking-widest text-[#3E2723] border border-[#3E2723] px-2 py-1 hover:bg-[#3E2723] hover:text-[#FDFBF7] transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <button onClick={() => setViewProductsPage(true)} className="inline-block border-2 border-[#3E2723] bg-transparent text-[#3E2723] font-butcher text-xl px-8 py-3 hover:bg-[#3E2723] hover:text-[#FDFBF7] transition-colors uppercase tracking-widest">
                    View Full Catalog
                  </button>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-16 px-6 relative z-10">
              <div className="container mx-auto max-w-5xl text-center">
                <h3 className="font-butcher text-3xl mb-4 text-[#3E2723]">From the Block</h3>
                <div className="w-16 h-1 bg-[#B71C1C] mx-auto mb-12"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <div key={idx} className="aspect-square border-4 border-[#3E2723] overflow-hidden group">
                        <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover filter contrast-125 saturate-150 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-16 px-6 bg-[#EFEBE9] relative z-10 border-t border-[#D7CCC8]">
              <div className="container mx-auto max-w-4xl text-center">
                <h3 className="font-butcher text-3xl mb-4 text-[#3E2723]">Visit the Shop</h3>
                <div className="w-16 h-1 bg-[#B71C1C] mx-auto mb-12"></div>
                
                <div className="grid md:grid-cols-2 gap-12 bg-[#FDFBF7] p-8 border-2 border-[#3E2723] shadow-[8px_8px_0_#B71C1C]">
                  <div className="text-left font-body">
                    <h4 className="font-bold text-xl text-[#B71C1C] mb-6">Contact Details</h4>
                    <div className="space-y-4 text-[#5D4037]">
                      <p className="flex items-center gap-3"><Phone size={20} className="text-[#3E2723]" /> {content.contact_info?.phone || '+1 (555) 123-4567'}</p>
                      <p className="flex items-center gap-3"><Mail size={20} className="text-[#3E2723]" /> {content.contact_info?.email || 'shop@thebutcherblock.com'}</p>
                      <p className="flex items-center gap-3"><MapPin size={20} className="text-[#3E2723]" /> {content.contact_info?.address || '123 Market Street, City, State'}</p>
                      <p className="flex items-center gap-3"><Clock size={20} className="text-[#3E2723]" /> <span className="whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sat: 8AM - 6PM\nSun: Closed'}</span></p>
                    </div>
                    
                    <div className="flex gap-4 mt-8 pt-6 border-t border-[#D7CCC8]">
                      <a href={content.contact_info?.facebook || '#'} className="w-10 h-10 bg-[#EFEBE9] rounded-full flex items-center justify-center hover:bg-[#B71C1C] text-[#3E2723] hover:text-white transition-colors">
                        <Facebook size={18} />
                      </a>
                      <a href={content.contact_info?.instagram || '#'} className="w-10 h-10 bg-[#EFEBE9] rounded-full flex items-center justify-center hover:bg-[#B71C1C] text-[#3E2723] hover:text-white transition-colors">
                        <Instagram size={18} />
                      </a>
                      <a href={content.contact_info?.whatsapp || '#'} className="w-10 h-10 bg-[#EFEBE9] rounded-full flex items-center justify-center hover:bg-[#B71C1C] text-[#3E2723] hover:text-white transition-colors">
                        <WhatsApp size={18} />
                      </a>
                    </div>
                  </div>
                  <div className="w-full h-64 border-2 border-[#3E2723] relative">
                    <iframe 
                      src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '123 Market Street, City, State')}&output=embed`}
                      className="absolute inset-0 w-full h-full border-0 filter grayscale contrast-125" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-16 px-6 relative z-10">
              <div className="container mx-auto max-w-4xl space-y-12">
                {content.custom_blocks_json.map((block: any, idx: number) => {
                  if (block.type === 'heading') return <h3 key={idx} className="font-butcher text-3xl text-center text-[#3E2723]">{block.content}</h3>;
                  if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-body text-lg text-[#5D4037] text-center max-w-2xl mx-auto">{block.content}</p>;
                  if (block.type === 'image' && block.url) return <div key={idx} className="border-4 border-[#3E2723] shadow-[8px_8px_0_#B71C1C] p-2 bg-[#FDFBF7]"><img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto" /></div>;
                  if (block.type === 'divider') return <div key={idx} className="w-16 h-1 bg-[#B71C1C] mx-auto"></div>;
                  return null;
                })}
              </div>
            </section>
          );

          return null;
        })}
      </main>

      {/* Full Catalog Overlay */}
      

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[600] bg-black/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
          <div className="relative bg-[#FDFBF7] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 md:p-10 border-4 border-[#3E2723] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}></div>
            
            <button className="absolute top-3 right-3 md:top-6 md:right-6 p-2 text-[#3E2723] hover:text-[#B71C1C] transition-colors z-10 font-bold" onClick={() => setSelectedProduct(null)}>
               <span className="text-3xl leading-none">×</span>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 relative z-10">
              <div className="h-48 md:h-auto md:aspect-square bg-[#EFEBE9] border-2 border-[#8D6E63] shadow-[4px_4px_0_#3E2723] overflow-hidden">
                <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover filter contrast-125 saturate-150" />
              </div>
              <div className="flex flex-col justify-center mt-2 md:mt-0">
                <h2 className="text-2xl md:text-5xl font-butcher mb-2 text-[#3E2723] uppercase">{selectedProduct.name}</h2>
                <div className="flex items-center gap-4 mb-3 md:mb-4">
                  <p className="text-xl md:text-4xl font-butcher text-[#B71C1C]">{selectedProduct.price}</p>
                </div>
                <div className="w-12 md:w-16 h-1 bg-[#3E2723] mb-4 md:mb-6"></div>
                <p className="font-body text-sm md:text-lg text-[#5D4037] leading-relaxed mb-6 md:mb-8">{selectedProduct.description}</p>
                
                <div className="mt-auto">
                  <button className="bg-[#B71C1C] text-white font-butcher text-lg md:text-xl py-3 md:py-4 px-6 md:px-8 border-2 border-[#3E2723] shadow-[4px_4px_0_#3E2723] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-full uppercase tracking-widest" onClick={() => setSelectedProduct(null)}>
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <footer className="bg-[#3E2723] text-[#D7CCC8] py-16 relative z-10 border-t-8 border-[#B71C1C]">
        <div className="container mx-auto px-6 max-w-4xl text-center font-body text-sm">
          <p className="mb-8 max-w-md mx-auto italic">
            {content.about_text || "Your neighborhood butcher shop dedicated to providing the freshest chicken and mutton with personalized service."}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-[#EFEBE9] border-t border-[#5D4037] pt-8">
            <div className="flex items-center gap-2 justify-center"><Phone size={18} className="text-[#B71C1C]" /> {content.contact_info?.phone || 'Call the Shop: 98765 43210'}</div>
            <div className="flex items-center gap-2 justify-center"><MapPin size={18} className="text-[#B71C1C]" /> {content.contact_info?.address || '12 Butcher Lane, Kerala'}</div>
          </div>
          <p className="mt-8 text-xs text-[#8D6E63]">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}
