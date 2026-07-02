import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShieldCheck, Truck, Clock, MapPin, Mail, Phone, Search, ChevronRight } from 'lucide-react';

const Facebook = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function ModernMeatTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [viewProductsPage, setViewProductsPage] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const siteName = content.settings_json?.website_name || website.slug || 'Prime Cuts Delivery';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Fresh Chicken Breast', price: '₹280/kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', description: 'Skinless, boneless, hormone-free.' },
    { name: 'Premium Mutton Curry Cut', price: '₹850/kg', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: 'Tender pieces perfect for curries.' },
    { name: 'Chicken Drumsticks', price: '₹320/kg', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80', description: 'Juicy drumsticks for roasting or frying.' },
    { name: 'Fresh Chicken Keema', price: '₹350/kg', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: 'Finely minced fresh chicken.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Hygienic & Safe', description: 'Processed in an ISO certified facility with strict safety standards.', icon: ShieldCheck },
    { title: 'Cold Chain Delivery', description: 'Temperature controlled delivery bags ensure maximum freshness.', icon: Truck },
    { title: 'Everyday Fresh', description: 'We never freeze our meat. Cut fresh every single morning.', icon: Clock }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-slate-800 font-sans selection:bg-red-500 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .font-modern { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 md:px-6 text-xs font-semibold flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
        <div className="flex justify-center gap-4">
           <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-red-500 shrink-0" /> 100% Halal Certified</span>
           <span className="hidden md:flex items-center gap-1"><Clock size={14} className="text-red-500 shrink-0" /> Express Delivery in 45 Mins</span>
        </div>
        <div className="flex items-center gap-1"><Phone size={14} className="text-red-500 shrink-0" /> {content.contact_info?.phone || 'Order Now: 98765 43210'}</div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 py-4 px-6 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="bg-red-600 text-white p-2 rounded-lg font-bold text-xl">PC</div>
            )}
            <span className="font-modern text-xl font-bold tracking-tight text-slate-900">{siteName}</span>
          </div>
          <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 w-72">
             <Search size={18} className="text-slate-400 mr-2" />
             <input type="text" placeholder="Search for Chicken, Mutton..." className="bg-transparent outline-none w-full text-sm font-modern" />
          </div>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="bg-red-50 py-16 px-6">
              <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                  <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-6 inline-block">Farm Fresh Daily</span>
                  <h1 className="font-modern text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                    {content.hero_title || 'Premium Quality Fresh Meat, Delivered.'}
                  </h1>
                  <p className="font-modern text-lg text-slate-600 mb-8 max-w-md">
                    {content.about_text || content.hero_text || 'Hygienically cut, cleaned, and vacuum packed. Order fresh chicken and mutton straight from our farm to your kitchen.'}
                  </p>
                  <a href="#menu" className="inline-flex w-fit bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl items-center gap-2 transition-colors">
                    Explore Categories <ChevronRight size={20} />
                  </a>
                </div>
                <div className="w-full md:w-1/2">
                  <img src={content.settings_json?.about_image || "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80"} alt="Fresh Meat" className="w-full h-auto rounded-3xl shadow-2xl border-8 border-white" />
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-20 px-6 bg-white">
              <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="w-full md:w-1/2">
                  <h2 className="font-modern text-4xl font-extrabold text-slate-900 mb-6">{content.settings_json?.about_title || content.about_title || 'Why Choose Us?'}</h2>
                  <div className="w-20 h-1 bg-red-600 mb-6"></div>
                  <p className="font-modern text-lg text-slate-600 leading-relaxed mb-6">
                    {content.settings_json?.about_description || content.about_description || 'We are committed to delivering the highest quality, most hygienic meat products directly to your doorstep. Our farms maintain strict ethical standards and our processing units are ISO certified.'}
                  </p>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80" alt="Meat 1" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                    <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80" alt="Meat 2" className="w-full h-48 object-cover rounded-2xl shadow-lg mt-8" />
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="bg-slate-900 text-white py-20 px-6">
              <div className="container mx-auto">
                <h2 className="font-modern text-3xl font-extrabold text-center mb-16">Our Guarantees</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  {services.map((srv: any, idx: number) => {
                    const title = typeof srv === 'string' ? srv : srv.title;
                    const desc = typeof srv === 'string' ? '' : srv.description;
                    const Icon = srv.icon || ShieldCheck;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                          {srv.image ? (
                            <img src={srv.image} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            typeof srv === 'object' && srv.icon ? <Icon size={40} className="text-red-500" /> : <ShieldCheck size={40} className="text-red-500" />
                          )}
                        </div>
                        <h3 className="font-bold text-xl mb-3">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="menu" className="py-20 px-6 bg-slate-50">
              <div className="container mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-red-600 font-bold tracking-wider uppercase text-sm mb-2 block">Shop</span>
                    <h2 className="font-modern text-3xl font-extrabold text-slate-900">Bestsellers</h2>
                  </div>
                  <button onClick={() => setViewProductsPage(true)} className="text-red-600 font-bold hover:text-red-700 transition-colors flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow bg-white flex flex-col cursor-pointer hover:-translate-y-1 transform duration-300">
                      <div className="h-48 overflow-hidden bg-slate-100 relative">
                        {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Fresh</div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-modern font-bold text-slate-900 mb-1">{p.name}</h3>
                        <p className="text-xs text-slate-500 mb-4 flex-1">{p.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="font-modern font-extrabold text-red-600 text-lg">{p.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-20 px-6 bg-white">
              <div className="container mx-auto">
                <h2 className="font-modern text-3xl font-extrabold text-center mb-12 text-slate-900">Fresh Cuts Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <div key={idx} onClick={() => setSelectedImage(imgUrl)} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-20 px-6 bg-red-50">
              <div className="container mx-auto max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 p-12">
                  <h2 className="font-modern text-3xl font-extrabold text-slate-900 mb-8">Get in Touch</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0"><MapPin size={20} className="text-red-600" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Store Location</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{content.contact_info?.address || '123 Business St, Fresh Valley, NY 10001'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0"><Phone size={20} className="text-red-600" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Phone Number</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{content.contact_info?.phone || '+1 (555) 000-0000'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0"><Mail size={20} className="text-red-600" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Email Address</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{content.contact_info?.email || 'hello@example.com'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0"><Clock size={20} className="text-red-600" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Working Hours</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{content.contact_info?.hours || 'Mon-Sun: 11:00 AM - 11:00 PM'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                      <a href={content.contact_info?.facebook || '#'} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
                        <Facebook size={18} />
                      </a>
                      <a href={content.contact_info?.instagram || '#'} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
                        <Instagram size={18} />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 bg-slate-200 min-h-[300px] relative">
                  <iframe 
                    src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'New York, NY')}&output=embed`}
                    className="absolute inset-0 w-full h-full border-0" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-20 px-6 bg-white">
              <div className="container mx-auto max-w-4xl space-y-12">
                {content.custom_blocks_json.map((block: any, idx: number) => {
                  if (block.type === 'heading') return <h2 key={idx} className="font-modern text-3xl font-extrabold text-slate-900 text-center">{block.content}</h2>;
                  if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="text-slate-600 text-lg leading-relaxed text-center">{block.content}</p>;
                  if (block.type === 'image' && block.url) return <div key={idx} className="rounded-3xl overflow-hidden shadow-xl"><img src={block.url} alt="Custom" className="w-full h-auto" /></div>;
                  if (block.type === 'divider') return <div key={idx} className="w-full h-px bg-slate-200 my-12"></div>;
                  return null;
                })}
              </div>
            </section>
          );

          return null;
        })}
      </main>

      {/* View All Products Page Overlay */}
      

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[400] bg-slate-900/50 backdrop-blur-sm p-4 md:p-6 animate-in fade-in flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 md:p-12 rounded-3xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full z-10 transition-colors" onClick={() => setSelectedProduct(null)}>
               <span className="text-xl font-bold leading-none px-2 py-1">×</span>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12">
              <div className="h-48 md:h-auto md:aspect-square bg-slate-50 rounded-2xl overflow-hidden relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-green-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded uppercase tracking-wider shadow-md">Fresh Cut</div>
              </div>
              <div className="flex flex-col justify-center font-modern">
                <span className="text-red-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-1 md:mb-2 block">Premium Quality</span>
                <h2 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-4 text-slate-900 leading-tight">{selectedProduct.name}</h2>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <p className="text-xl md:text-3xl font-extrabold text-red-600">{selectedProduct.price}</p>
                </div>
                <div className="w-12 md:w-16 h-1 bg-red-600 mb-4 md:mb-8"></div>
                <p className="text-sm md:text-lg text-slate-600 leading-relaxed mb-6 md:mb-8">{selectedProduct.description}</p>
                <div className="mt-auto">
                  <button className="bg-red-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl hover:bg-red-700 transition-colors w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200" onClick={() => setSelectedProduct(null)}>
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[500] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full z-10 transition-colors" onClick={() => setSelectedImage(null)}>
            <span className="text-xl font-bold leading-none px-2 py-1">×</span>
          </button>
          <img src={selectedImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
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
      <footer className="bg-slate-900 py-12 px-6 text-white border-t border-slate-800">
        <div className="container mx-auto grid md:grid-cols-3 gap-12 text-sm">
           <div>
             <div className="flex items-center gap-2 mb-6">
                <div className="bg-red-600 text-white p-2 rounded-lg font-bold text-xl">PC</div>
                <h4 className="font-modern font-bold text-xl">{siteName}</h4>
             </div>
             <p className="text-slate-400 max-w-sm leading-relaxed">{content.about_text || "Committed to delivering the highest quality, most hygienic meat products directly to your doorstep."}</p>
           </div>
           <div>
             <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs text-slate-500">Contact Us</h4>
             <div className="space-y-3">
               <div className="text-slate-400 flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Phone size={16} className="text-red-500" /> {content.contact_info?.phone || '98765 43210'}</div>
               <div className="text-slate-400 flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Mail size={16} className="text-red-500" /> {content.contact_info?.email || 'support@primecuts.in'}</div>
             </div>
           </div>
           <div>
             <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs text-slate-500">Store Location</h4>
             <div className="text-slate-400 flex items-start gap-2 leading-relaxed">
                <MapPin size={16} className="mt-1 shrink-0 text-red-500" /> 
                <span>{content.contact_info?.address || 'Shop 12, Main Market, Kerala'}</span>
             </div>
           </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}
