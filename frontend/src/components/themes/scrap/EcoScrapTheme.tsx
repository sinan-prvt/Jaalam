import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Leaf, Recycle, TreePine, MapPin, Mail, Phone, ArrowRight, X, Clock, Shield, RefreshCw } from 'lucide-react';
import { Facebook, Instagram, WhatsApp } from './SocialIcons';

export default function EcoScrapTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'EcoCycle Solutions';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Copper Scrap', price: '₹500 – ₹800/kg', description: 'Wires, pipes, and pure copper materials.', detailed_description: 'We accept all grades of copper including Bare Bright, #1 Copper, #2 Copper, and insulated copper wire. Clean, unalloyed copper without attachments yields the highest returns.', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Aluminium Scrap', price: '₹100 – ₹200/kg', description: 'Cans, extrusions, wheels, and cast aluminium.', detailed_description: 'Accepted materials include aluminium cans (UBCs), extruded aluminium (window frames, etc.), cast aluminium, and aluminium wheels. Must be free of iron attachments for best pricing.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electronic Waste', price: '₹50 – ₹300/kg', description: 'Laptops, mobile phones, servers.', detailed_description: 'We responsibly recycle all types of e-waste including old computers, servers, smartphones, and bare printed circuit boards (PCBs). Data destruction certificates available upon request.', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
    { name: 'Plastic Scrap', price: '₹10 – ₹30/kg', description: 'PET bottles, PVC, HDPE, and industrial plastics.', detailed_description: 'We process various grades of recyclable plastics including PET (water bottles), HDPE (milk jugs), and rigid industrial plastics. Must be reasonably clean and sorted by resin code for maximum value.', image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80' },
    { name: 'Old Newspapers', price: '₹15 – ₹25/kg', description: 'Old newspapers, magazines, cardboard.', detailed_description: 'We accept bundled old newspapers (ONP), corrugated cardboard (OCC), mixed paper, and white office paper. Materials must be dry and free of food waste or grease.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Corporate ESG Audits', description: 'We help you measure and improve your recycling impact.', icon: Shield },
    { title: 'Zero Waste Programs', description: 'Complete solutions to divert 100% of waste from landfills.', icon: TreePine },
    { title: 'Circular Economy', description: 'Returning materials to the manufacturing lifecycle.', icon: RefreshCw }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F0F4F1] text-[#2C4A3B] font-sans selection:bg-[#4CAF50] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        .font-eco { font-family: 'Outfit', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#D1E2D6]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#4CAF50]">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img loading="lazy" src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-10 object-contain" />
            ) : (
              <Leaf size={28} />
            )}
            <span className="font-eco text-2xl font-extrabold tracking-tight text-[#2C4A3B]">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-eco font-semibold text-sm text-[#5D806B]">
            <a href="#about" className="hover:text-[#4CAF50] transition-colors">About</a>
            <a href="#services" className="hover:text-[#4CAF50] transition-colors">Services</a>
            <a href="#products" className="hover:text-[#4CAF50] transition-colors">Materials</a>
            <a href="#contact" className="hover:text-[#4CAF50] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-24 px-6 relative overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] opacity-10"><TreePine size={400} className="text-[#4CAF50]" /></div>
              <div className="absolute bottom-[-10%] right-[-5%] opacity-10"><Recycle size={300} className="text-[#4CAF50]" /></div>
              
              <div className="container mx-auto max-w-5xl text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#E1EFE5] text-[#2C4A3B] px-4 py-2 rounded-full font-eco text-sm font-bold mb-8">
                  <span className="text-[#4CAF50]">●</span> Zero Waste to Landfill Goal
                </div>
                <h1 className="font-eco text-5xl md:text-7xl font-extrabold text-[#1A2E24] mb-8 leading-tight">
                  {content.hero_title || 'Recycle Today for a Greener Tomorrow.'}
                </h1>
                <p className="font-eco text-lg text-[#5D806B] mb-12 max-w-2xl mx-auto leading-relaxed">
                  {content.hero_description || content.hero_text || 'We are dedicated to sustainable scrap management. Turn your waste into resources while protecting our planet.'}
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <a href="#products" className="inline-flex items-center gap-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-eco font-bold py-4 px-10 rounded-full transition-all shadow-[0_8px_20px_rgba(76,175,80,0.3)] hover:-translate-y-1">
                    Start Recycling <ArrowRight size={20} />
                  </a>
                  <a href="#contact" className="inline-flex items-center gap-2 bg-white hover:bg-[#E1EFE5] text-[#2C4A3B] font-eco font-bold py-4 px-10 rounded-full transition-all shadow-sm border border-[#D1E2D6]">
                    Contact Us
                  </a>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-24 px-6 bg-white">
              <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2">
                  <img loading="lazy" src={content.settings_json?.about_image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"} alt="Nature" className="w-full h-auto rounded-[3rem] rounded-tl-none shadow-2xl" />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-2 text-[#4CAF50] font-bold mb-4">
                    <Leaf size={20} />
                    <span className="uppercase tracking-widest text-sm">Our Mission</span>
                  </div>
                  <h2 className="font-eco text-4xl md:text-5xl font-extrabold text-[#1A2E24] mb-6 leading-tight">
                    {content.settings_json?.about_title || 'Protecting Nature Through Circular Economy.'}
                  </h2>
                  <p className="font-eco text-lg text-[#5D806B] leading-relaxed mb-8">
                    {content.settings_json?.about_description || 'We partner with communities and businesses to divert thousands of tons of recyclable materials from landfills every year. Our state-of-the-art sorting facilities ensure maximum material recovery with a minimal carbon footprint.'}
                  </p>
                  <div className="grid grid-cols-2 gap-8 border-t border-[#D1E2D6] pt-8">
                    <div>
                      <div className="text-4xl font-extrabold text-[#4CAF50] mb-2">99%</div>
                      <div className="font-eco text-sm text-[#5D806B] font-bold">Material Recovery Rate</div>
                    </div>
                    <div>
                      <div className="text-4xl font-extrabold text-[#4CAF50] mb-2">50k+</div>
                      <div className="font-eco text-sm text-[#5D806B] font-bold">Tons Diverted Annually</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-24 bg-[#E1EFE5] px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="font-eco text-4xl font-extrabold text-[#1A2E24] mb-4">Sustainable Services</h2>
                  <p className="font-eco text-[#5D806B] max-w-2xl mx-auto">Comprehensive environmental solutions for businesses and residential communities.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((s: any, i: number) => {
                    const Icon = s.icon || Recycle;
                    return (
                      <div key={i} className="bg-white rounded-3xl p-10 hover:shadow-xl transition-all border border-white hover:border-[#4CAF50]/30 group">
                        <div className="w-16 h-16 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] mb-6 group-hover:bg-[#4CAF50] group-hover:text-white transition-colors">
                          <Icon size={28} />
                        </div>
                        <h3 className="font-eco text-xl font-bold text-[#1A2E24] mb-4">{s.title}</h3>
                        <p className="font-eco text-[#5D806B] leading-relaxed">{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'products') return (
            <section key="products" id="products" className="py-24 px-6 bg-white">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="font-eco text-4xl font-extrabold text-[#1A2E24] mb-4">What We Recover</h2>
                  <p className="font-eco text-[#5D806B] max-w-2xl mx-auto">Every item recycled is a step towards a circular economy. Check our current recovery rates.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="bg-[#F0F4F1] rounded-3xl overflow-hidden hover:shadow-lg transition-all border border-[#D1E2D6] group flex flex-col cursor-pointer">
                      {p.image && (
                        <div className="h-40 overflow-hidden relative">
                           <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-eco text-xl font-bold text-[#1A2E24] mb-3">{p.name}</h3>
                        <p className="font-eco text-sm text-[#5D806B] mb-6 flex-grow">{p.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="font-eco font-bold text-[#4CAF50] bg-[#E1EFE5] inline-block px-4 py-2 rounded-xl text-center">{p.price}</div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                            className="font-eco font-bold text-white bg-[#4CAF50] hover:bg-[#388E3C] px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length > 0 && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setShowAllProducts(true)}
                      className="bg-white hover:bg-[#F0F4F1] text-[#4CAF50] border border-[#4CAF50] font-eco font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
                    >
                      View All Materials
                    </button>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-24 px-6 bg-[#F0F4F1]">
              <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="font-eco text-4xl font-extrabold text-[#1A2E24] mb-4">Our Facilities</h2>
                    <p className="font-eco text-[#5D806B]">Take a look inside our state-of-the-art sorting centers.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {gallery.map((img: string, i: number) => (
                    <div key={i} className={`rounded-3xl overflow-hidden ${i === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : ''}`}>
                      <img loading="lazy" src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 min-h-[200px]" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-24 px-6 bg-white">
              <div className="container mx-auto max-w-5xl">
                <div className="bg-[#1A2E24] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-16 relative overflow-hidden text-white">
                  <div className="absolute right-0 bottom-0 opacity-10"><Leaf size={300} /></div>
                  <div className="w-full md:w-1/2 relative z-10">
                    <h2 className="font-eco text-4xl font-extrabold mb-6">Let's Clean Up the Planet Together.</h2>
                    <p className="text-[#A3BDB0] mb-12 text-lg">Reach out to us to schedule a bulk pickup or learn more about our corporate recycling programs.</p>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2C4A3B] rounded-full flex items-center justify-center text-[#4CAF50]"><Phone size={20} /></div>
                        <div>
                          <div className="text-sm text-[#A3BDB0] font-bold uppercase tracking-wider mb-1">Call Us</div>
                          <div className="font-eco text-xl font-bold">{content.contact_info?.phone || '98765 43210'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2C4A3B] rounded-full flex items-center justify-center text-[#4CAF50]"><Mail size={20} /></div>
                        <div>
                          <div className="text-sm text-[#A3BDB0] font-bold uppercase tracking-wider mb-1">Email Us</div>
                          <div className="font-eco text-lg font-bold">{content.contact_info?.email || 'hello@ecocycle.org'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2C4A3B] rounded-full flex items-center justify-center text-[#4CAF50]"><MapPin size={20} /></div>
                        <div>
                          <div className="text-sm text-[#A3BDB0] font-bold uppercase tracking-wider mb-1">Visit Us</div>
                          <div className="font-eco text-lg font-bold">{content.contact_info?.address || 'Eco Park, Green Belt, Kerala'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 relative z-10">
                    <div className="bg-white rounded-3xl p-8 flex flex-col h-full">
                      <div className="mb-6">
                        <h3 className="font-eco text-xl md:text-2xl font-bold mb-2 text-[#1A2E24] flex items-center gap-2"><Clock size={20} className="text-[#4CAF50]"/> Working Hours</h3>
                        <p className="text-[#5D806B] font-medium whitespace-pre-line">
                          {content.contact_info?.office_hours || 'Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed'}
                        </p>
                      </div>

                      <div className="mb-6">
                         <h3 className="font-eco text-xl md:text-2xl font-bold mb-4 text-[#1A2E24]">Connect With Us</h3>
                         <div className="flex gap-4">
                            {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"><Facebook size={20} /></a>}
                            {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"><Instagram size={20} /></a>}
                            {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"><WhatsApp size={20} /></a>}
                            {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.whatsapp && (
                               <div className="flex gap-4">
                                 <a href="#" className="w-10 h-10 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"><Facebook size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"><Instagram size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-[#F0F4F1] rounded-full flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"><WhatsApp size={20} /></a>
                               </div>
                            )}
                         </div>
                      </div>

                      <div className="flex-grow rounded-xl overflow-hidden min-h-[250px] relative">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353155041!3d-37.81720974202167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1620800845348!5m2!1sen!2sin" 
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
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
                      {block.type === 'image' && <img loading="lazy" src={block.url || block.image} className="w-full rounded-2xl mb-6 shadow-md" alt="" />}
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
                      {block.type === 'image' && <img loading="lazy" src={block.url || block.image} className="w-full rounded-2xl mb-6 shadow-md" alt="" />}
                      {block.type === 'divider' && <hr className="my-12 border-t-2 border-slate-100" />}
                    </div>
                 ))}
               </div>
            </section>
        )}
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
      <footer className="bg-[#1A2E24] text-[#D1E2D6] py-12 px-6 border-t border-[#2C4A3B]">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#4CAF50]">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img loading="lazy" src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-8 object-contain opacity-80" />
            ) : (
              <Leaf size={24} />
            )}
            <span className="text-xl font-bold text-white font-eco">{siteName}</span>
          </div>
          <div className="text-sm font-eco text-[#A3BDB0]">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* View All Products Modal */}
      

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1A2E24]/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-y-auto max-h-[75vh] shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur text-[#2C4A3B] p-2 rounded-full hover:bg-white transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
            {selectedProduct.image && (
              <div className="h-40 md:h-56 w-full">
                <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-eco text-2xl font-bold text-[#1A2E24]">{selectedProduct.name}</h3>
                <span className="font-eco font-bold text-[#4CAF50] bg-[#E1EFE5] px-3 py-1 rounded-lg">
                  {selectedProduct.price}
                </span>
              </div>
              <p className="font-eco text-[#5D806B] leading-relaxed mb-6">
                {selectedProduct.detailed_description || selectedProduct.description || 'Detailed specifications and recycling impact for this material.'}
              </p>
              
              <div className="bg-[#F0F4F1] rounded-xl p-4 border border-[#D1E2D6] mb-6">
                <h4 className="font-eco font-bold text-[#1A2E24] mb-2 text-sm uppercase tracking-wider">Recycling Guidelines</h4>
                <ul className="text-sm text-[#5D806B] space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></div> Minimum quantity requirements apply</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></div> Must be free of hazardous contaminants</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></div> Sorted loads yield better rates</li>
                </ul>
              </div>

              <a href="#contact" onClick={() => setSelectedProduct(null)} className="block w-full text-center bg-[#4CAF50] hover:bg-[#388E3C] text-white font-eco font-bold py-3 rounded-xl transition-colors shadow-[0_4px_10px_rgba(76,175,80,0.2)]">
                Request Quote
              </a>
            </div>
          </div>
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}

