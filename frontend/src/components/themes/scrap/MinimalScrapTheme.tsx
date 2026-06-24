import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { Facebook, Instagram, WhatsApp } from './SocialIcons';

export default function MinimalScrapTheme({ website, content }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'SCRAP.';
  const hiddenSections = content.settings_json?.hidden_sections || [];
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'COPPER SCRAP', price: '₹500 – ₹800/KG', description: 'Wires, pipes, and pure copper materials.', detailed_description: 'We accept all grades of copper including Bare Bright, #1 Copper, #2 Copper, and insulated copper wire. Clean, unalloyed copper without attachments yields the highest returns.', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80' },
    { name: 'ALUMINIUM SCRAP', price: '₹100 – ₹200/KG', description: 'Cans, extrusions, wheels, and cast aluminium.', detailed_description: 'Accepted materials include aluminium cans (UBCs), extruded aluminium (window frames, etc.), cast aluminium, and aluminium wheels. Must be free of iron attachments for best pricing.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
    { name: 'ELECTRONIC WASTE', price: '₹50 – ₹300/KG', description: 'Laptops, mobile phones, servers.', detailed_description: 'We responsibly recycle all types of e-waste including old computers, servers, smartphones, and bare printed circuit boards (PCBs). Data destruction certificates available upon request.', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
    { name: 'PLASTIC SCRAP', price: '₹10 – ₹30/KG', description: 'PET bottles, PVC, HDPE, and industrial plastics.', detailed_description: 'We process various grades of recyclable plastics including PET (water bottles), HDPE (milk jugs), and rigid industrial plastics. Must be reasonably clean and sorted by resin code for maximum value.', image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80' },
    { name: 'OLD NEWSPAPERS', price: '₹15 – ₹25/KG', description: 'Old newspapers, magazines, cardboard.', detailed_description: 'We accept bundled old newspapers (ONP), corrugated cardboard (OCC), mixed paper, and white office paper. Materials must be dry and free of food waste or grease.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'BIN RENTAL', description: 'INDUSTRIAL BINS DELIVERED TO SITE.' },
    { title: 'FLEET PICKUP', description: 'FLATBEDS AND ROLL-OFFS AVAILABLE.' },
    { title: 'SITE CLEANUP', description: 'FULL FACTORY CLEARANCE SERVICE.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-black font-mono uppercase tracking-widest selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        .font-minimal { font-family: 'Space Mono', monospace; }
      `}</style>

      {/* Header */}
      <header className="p-6 md:p-12 border-b-4 border-black flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white">
        <div className="flex items-end gap-4">
          {content.settings_json?.logo_image || website.logo_url ? (
            <img src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-12 object-contain" />
          ) : null}
          <span className="font-bold text-4xl">{siteName}</span>
        </div>
        <nav className="flex gap-6 text-sm font-bold flex-wrap">
          <a href="#about" className="hover:underline decoration-4 underline-offset-4">ABOUT</a>
          <a href="#services" className="hover:underline decoration-4 underline-offset-4">SERVICES</a>
          <a href="#products" className="hover:underline decoration-4 underline-offset-4">RATES</a>
          <a href="#contact" className="hover:underline decoration-4 underline-offset-4">CONTACT</a>
        </nav>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="p-6 md:p-12 border-b-4 border-black bg-white">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                {content.hero_title || 'TURN TRASH INTO CASH.'}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl border-l-8 border-black pl-6 mb-12 py-2">
                {content.hero_description || content.hero_text || 'BRING YOUR SCRAP METAL AND E-WASTE. WE WEIGH IT. WE PAY YOU. SIMPLE AS THAT.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="#products" className="inline-block bg-black text-white px-8 py-5 font-bold text-center hover:bg-gray-800 transition-colors">
                  VIEW RATES
                </a>
                <a href="#contact" className="inline-block bg-white text-black border-4 border-black px-8 py-5 font-bold text-center hover:bg-black hover:text-white transition-colors">
                  CALL {content.contact_info?.phone || '98765 43210'}
                </a>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="p-6 md:p-12 border-b-4 border-black bg-[#E5E5E5]">
              <div className="max-w-4xl">
                <h2 className="text-3xl font-bold mb-8">{content.settings_json?.about_title || 'WE RECYCLE. NO NONSENSE.'}</h2>
                <div className="text-lg md:text-xl leading-relaxed space-y-6">
                  <p>{content.settings_json?.about_description || 'ESTABLISHED IN 2010. WE PROVIDE HONEST WEIGHTS AND INSTANT PAYMENTS. OUR FACILITY HANDLES TONS OF SCRAP DAILY.'}</p>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="p-6 md:p-12 border-b-4 border-black bg-white">
              <h2 className="text-3xl font-bold mb-8">SERVICES.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black bg-black">
                {services.map((s: any, i: number) => (
                  <div key={i} className="bg-white border-[2px] border-black p-8 hover:bg-[#E5E5E5] transition-colors">
                    <h3 className="font-bold text-2xl mb-4">{s.title}</h3>
                    <p className="text-sm font-bold">{s.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );

          if (sectionId === 'products') return (
            <section key="products" id="products" className="p-6 md:p-12 border-b-4 border-black bg-[#E5E5E5]">
              <h2 className="text-3xl font-bold mb-8">TODAY'S RATES.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-4 border-black bg-black">
                {products.slice(0, 3).map((p: any, i: number) => (
                  <div key={i} onClick={() => setSelectedProduct(p)} className="bg-white border-[2px] border-black p-8 flex flex-col justify-between hover:bg-black hover:text-white transition-colors cursor-pointer group">
                    <div>
                      <h3 className="font-bold text-xl mb-4">{p.name}</h3>
                      {p.description && <p className="text-xs mb-6 opacity-70 group-hover:opacity-100">{p.description}</p>}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-4xl font-bold">{p.price}</div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                        className="bg-black text-white group-hover:bg-white group-hover:text-black px-4 py-2 font-bold text-xs uppercase transition-colors"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {products.length > 0 && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setShowAllProducts(true)}
                    className="bg-transparent border-4 border-black text-black hover:bg-black hover:text-white font-bold text-xl uppercase py-4 px-12 transition-colors"
                  >
                    VIEW ALL RATES
                  </button>
                </div>
              )}
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="p-6 md:p-12 border-b-4 border-black bg-white">
              <h2 className="text-3xl font-bold mb-8">THE YARD.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gallery.map((img: string, i: number) => (
                  <div key={i} className="border-4 border-black aspect-square">
                    <img src={img} alt={`Facility ${i+1}`} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="p-6 md:p-12 border-b-4 border-black bg-[#E5E5E5]">
              <h2 className="text-3xl font-bold mb-8">CONTACT & LOCATION.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8 text-xl font-bold">
                  <div className="border-b-4 border-black pb-4">
                    <div className="text-sm mb-2 opacity-50">CALL US</div>
                    <div>{content.contact_info?.phone || '98765 43210'}</div>
                  </div>
                  <div className="border-b-4 border-black pb-4">
                    <div className="text-sm mb-2 opacity-50">EMAIL US</div>
                    <div>{content.contact_info?.email || 'HELLO@SCRAP.COM'}</div>
                  </div>
                  <div className="border-b-4 border-black pb-4">
                    <div className="text-sm mb-2 opacity-50">VISIT US</div>
                    <div>{content.contact_info?.address || 'PLOT 4, INDUSTRIAL AREA, KERALA'}</div>
                  </div>
                </div>
                <div className="border-4 border-black bg-white p-4 md:p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-4 uppercase flex items-center gap-2"><Clock size={20}/> HOURS</h3>
                    <p className="font-bold text-lg whitespace-pre-line">
                      {content.contact_info?.office_hours || 'MON-FRI: 08:00 - 18:00\nSAT: 08:00 - 14:00\nSUN: CLOSED'}
                    </p>
                  </div>

                  <div className="mb-6 border-t-4 border-black pt-6">
                     <h3 className="font-bold text-xl mb-4 uppercase">SOCIALS</h3>
                     <div className="flex gap-4">
                        {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Facebook size={24} /></a>}
                        {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Instagram size={24} /></a>}
                        {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Twitter size={24} /></a>}
                        {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Youtube size={24} /></a>}
                        {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.twitter && !content.contact_info?.youtube && (
                           <div className="flex gap-4">
                             <a href="#" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Facebook size={24} /></a>
                             <a href="#" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Instagram size={24} /></a>
                             <a href="#" className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Twitter size={24} /></a>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex-grow border-4 border-black overflow-hidden min-h-[250px] relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353155041!3d-37.81720974202167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1620800845348!5m2!1sen!2sin" 
                      className="absolute inset-0 w-full h-full border-0 grayscale"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" className="py-16 bg-white border-t border-slate-100">
               <div className="container mx-auto px-6 max-w-4xl">
                 {content.custom_blocks_json.map((block: any, idx: number) => (
                    <div key={idx} className="mb-12 last:mb-0">
                      {block.type === 'heading' && <h2 className="text-3xl md:text-4xl font-bold mb-6">{block.content}</h2>}
                      {block.type === 'paragraph' && <p className="text-lg text-slate-600 mb-6 whitespace-pre-wrap">{block.content}</p>}
                      {block.type === 'image' && <img src={block.url || block.image} className="w-full rounded-2xl mb-6 shadow-md" alt="" />}
                      {block.type === 'divider' && <hr className="my-12 border-t-2 border-slate-100" />}
                    </div>
                 ))}
               </div>
            </section>
          );

          return null;
        })}
        {content.custom_blocks_json?.length > 0 && content.settings_json?.section_order && !content.settings_json.section_order.includes('custom') && (
            <section key="custom-fallback" className="py-16 bg-white border-t border-slate-100">
               <div className="container mx-auto px-6 max-w-4xl">
                 {content.custom_blocks_json.map((block: any, idx: number) => (
                    <div key={idx} className="mb-12 last:mb-0">
                      {block.type === 'heading' && <h2 className="text-3xl md:text-4xl font-bold mb-6">{block.content}</h2>}
                      {block.type === 'paragraph' && <p className="text-lg text-slate-600 mb-6 whitespace-pre-wrap">{block.content}</p>}
                      {block.type === 'image' && <img src={block.url || block.image} className="w-full rounded-2xl mb-6 shadow-md" alt="" />}
                      {block.type === 'divider' && <hr className="my-12 border-t-2 border-slate-100" />}
                    </div>
                 ))}
               </div>
            </section>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 md:p-12 bg-black text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          {content.settings_json?.logo_image || website.logo_url ? (
            <img src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-8 object-contain filter invert" />
          ) : null}
          <span className="font-bold text-2xl">{siteName}</span>
        </div>
        <p className="text-sm font-bold opacity-50 text-center md:text-right">
          &copy; {new Date().getFullYear()} {siteName}. {content.about_text || "HONEST WEIGHTS. INSTANT CASH."}
        </p>
      </footer>

      {/* View All Products Modal */}
      {showAllProducts && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b-4 border-black p-6 flex justify-between items-center z-20">
            <h2 className="font-bold text-3xl">ALL RATES</h2>
            <button onClick={() => setShowAllProducts(false)} className="bg-black text-white p-2 hover:bg-white hover:text-black border-2 border-black transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 md:p-12">
            <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-4 border-black bg-black">
              {products.map((p: any, i: number) => (
                <div key={i} onClick={() => setSelectedProduct(p)} className="bg-white border-[2px] border-black p-8 flex flex-col justify-between hover:bg-black hover:text-white transition-colors cursor-pointer group">
                  <div>
                    <h3 className="font-bold text-xl mb-4">{p.name}</h3>
                    {p.description && <p className="text-xs mb-6 opacity-70 group-hover:opacity-100">{p.description}</p>}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-4xl font-bold">{p.price}</div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                      className="bg-black text-white group-hover:bg-white group-hover:text-black px-4 py-2 font-bold text-xs uppercase transition-colors"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white border-4 border-black w-full max-w-md overflow-y-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-black text-white p-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
            >
              <X size={20} />
            </button>
            {selectedProduct.image && (
              <div className="h-40 md:h-56 w-full border-b-4 border-black">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover filter grayscale" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
                <h3 className="font-bold text-3xl">{selectedProduct.name}</h3>
                <span className="font-bold text-2xl">
                  {selectedProduct.price}
                </span>
              </div>
              <p className="text-lg leading-relaxed mb-8 opacity-80">
                {selectedProduct.detailed_description || selectedProduct.description || 'DETAILED SPECIFICATIONS AND PROCESSING INFORMATION FOR THIS MATERIAL.'}
              </p>
              
              <div className="bg-[#E5E5E5] p-6 border-2 border-black mb-8">
                <h4 className="font-bold mb-4 uppercase">ACCEPTED CONDITIONS</h4>
                <ul className="text-sm font-bold space-y-3 opacity-80">
                  <li>- MINIMUM QUANTITY REQUIREMENTS APPLY</li>
                  <li>- MUST BE FREE OF HAZARDOUS CONTAMINANTS</li>
                  <li>- SORTED AND UNSORTED LOADS ACCEPTED</li>
                </ul>
              </div>

              <a href="#contact" onClick={() => setSelectedProduct(null)} className="block w-full text-center bg-black text-white font-bold py-4 hover:bg-[#E5E5E5] hover:text-black border-4 border-black transition-colors">
                REQUEST QUOTE
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

