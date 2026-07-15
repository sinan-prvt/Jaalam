import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Truck, Scale, MapPin, Mail, Phone, AlertTriangle, Hammer, Factory, X, Clock } from 'lucide-react';
import { Facebook, Instagram, WhatsApp } from './SocialIcons';

export default function ClassicScrapTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'Heavy Metal Scrap';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Copper Scrap', price: '₹500 – ₹800/kg', description: 'Wires, pipes, and pure copper materials.', detailed_description: 'We accept all grades of copper including Bare Bright, #1 Copper, #2 Copper, and insulated copper wire. Clean, unalloyed copper without attachments yields the highest returns.', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Aluminium Scrap', price: '₹100 – ₹200/kg', description: 'Cans, extrusions, wheels, and cast aluminium.', detailed_description: 'Accepted materials include aluminium cans (UBCs), extruded aluminium (window frames, etc.), cast aluminium, and aluminium wheels. Must be free of iron attachments for best pricing.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electronic Waste', price: '₹50 – ₹300/kg', description: 'Laptops, mobile phones, servers.', detailed_description: 'We responsibly recycle all types of e-waste including old computers, servers, smartphones, and bare printed circuit boards (PCBs). Data destruction certificates available upon request.', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
    { name: 'Plastic Scrap', price: '₹10 – ₹30/kg', description: 'PET bottles, PVC, HDPE, and industrial plastics.', detailed_description: 'We process various grades of recyclable plastics including PET (water bottles), HDPE (milk jugs), and rigid industrial plastics. Must be reasonably clean and sorted by resin code for maximum value.', image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80' },
    { name: 'Old Newspapers', price: '₹15 – ₹25/kg', description: 'Old newspapers, magazines, cardboard.', detailed_description: 'We accept bundled old newspapers (ONP), corrugated cardboard (OCC), mixed paper, and white office paper. Materials must be dry and free of food waste or grease.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Fleet Pickup Service', description: 'Roll-off bins and trucks available for industrial sites.', icon: Truck },
    { title: 'On-Site Dismantling', description: 'Expert team for cutting and removing large structures.', icon: Hammer },
    { title: 'Factory Clearance', description: 'Complete clearing of abandoned or relocating plants.', icon: Factory }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F4F4F4] text-[#1A1A1A] font-sans border-t-[12px] border-[#FFC107] selection:bg-[#FFC107] selection:text-[#1A1A1A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;import ProductBuyButton from '../../payments/ProductBuyButton';
700&family=Roboto:wght@400;700;900&display=swap');
        .font-industrial { font-family: 'Oswald', sans-serif; }
        .font-body { font-family: 'Roboto', sans-serif; }
        .stripe-bg {
          background-image: repeating-linear-gradient(45deg, #FFC107, #FFC107 20px, #1A1A1A 20px, #1A1A1A 40px);
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-[#1A1A1A] text-white py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img loading="lazy" src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 bg-[#FFC107] flex items-center justify-center text-[#1A1A1A] rounded-sm transform -skew-x-12">
                 <AlertTriangle size={28} className="transform skew-x-12" />
              </div>
            )}
            <span className="font-industrial text-4xl uppercase tracking-wider">{siteName}</span>
          </div>
          <div className="flex gap-4 md:gap-6 font-industrial text-lg md:text-xl flex-wrap justify-center">
            <a href="#about" className="text-[#FFC107] hover:text-white transition-colors uppercase">About</a>
            <a href="#services" className="text-[#FFC107] hover:text-white transition-colors uppercase">Services</a>
            <a href="#products" className="text-[#FFC107] hover:text-white transition-colors uppercase">Rates</a>
            <a href="#contact" className="text-[#FFC107] hover:text-white transition-colors uppercase">Contact</a>
          </div>
        </div>
      </header>

      {/* Warning Tape Divider */}
      <div className="h-4 w-full stripe-bg"></div>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-24 md:py-32 px-6 bg-[url('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-[#1A1A1A]/80"></div>
              <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-3/4">
                  <h1 className="font-industrial text-6xl md:text-8xl lg:text-9xl text-white uppercase mb-6 leading-none">
                    <span className="text-[#FFC107]">{content.hero_title?.split(' ')[0] || 'TOP'}</span> {content.hero_title?.substring(content.hero_title?.indexOf(' ') + 1) || 'CASH FOR SCRAP.'}
                  </h1>
                  <p className="font-body text-xl text-gray-300 mb-10 max-w-2xl font-bold border-l-4 border-[#FFC107] pl-6 py-2">
                    {content.hero_description || content.hero_text || 'We buy all types of ferrous and non-ferrous metals. Industrial, commercial, and residential pickup available.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <a href="#contact" className="bg-[#FFC107] hover:bg-[#ffb300] text-[#1A1A1A] font-industrial text-2xl uppercase py-5 px-12 rounded-sm transform skew-x-[-10deg] shadow-[6px_6px_0_#1A1A1A] transition-transform active:translate-y-1 active:shadow-none inline-block text-center">
                      <span className="inline-block transform skew-x-[10deg]">Call {content.contact_info?.phone || '98765 43210'}</span>
                    </a>
                    <a href="#products" className="bg-transparent border-4 border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-[#1A1A1A] font-industrial text-2xl uppercase py-4 px-10 rounded-sm transform skew-x-[-10deg] transition-all inline-block text-center">
                      <span className="inline-block transform skew-x-[10deg]">View Rates</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-20 px-6 bg-white">
              <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-16 items-center">
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute inset-0 bg-[#FFC107] transform translate-x-4 translate-y-4"></div>
                  <img loading="lazy" src={content.settings_json?.about_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"} alt="Facility" className="relative z-10 w-full object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-500 border-4 border-[#1A1A1A]" />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-1 bg-[#FFC107]"></div>
                     <h2 className="font-industrial text-2xl uppercase text-[#1A1A1A] tracking-wider">About Our Yard</h2>
                  </div>
                  <h3 className="font-industrial text-5xl uppercase text-[#1A1A1A] mb-8 leading-tight">
                    {content.settings_json?.about_title || 'HEAVY DUTY RECYCLING. HONEST SCALES.'}
                  </h3>
                  <div className="font-body text-lg text-gray-700 font-bold space-y-6">
                    <p>{content.settings_json?.about_description || 'We process thousands of tons of metal monthly. Our industrial-grade scales are calibrated daily to ensure you get paid exactly what your material is worth.'}</p>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-dashed border-gray-300">
                      <div>
                        <div className="font-industrial text-4xl text-[#FFC107]">50+</div>
                        <div className="uppercase text-sm">Years Experience</div>
                      </div>
                      <div>
                        <div className="font-industrial text-4xl text-[#FFC107]">100%</div>
                        <div className="uppercase text-sm">Accurate Weights</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="bg-[#1A1A1A] text-white py-20 px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="flex items-center gap-4 mb-16">
                   <h2 className="font-industrial text-5xl uppercase text-[#FFC107]">Industrial Services</h2>
                   <div className="flex-1 h-1 bg-[#333]"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((s: any, i: number) => {
                    const Icon = s.icon || Truck;
                    return (
                      <div key={i} className="border-4 border-[#333] p-8 hover:border-[#FFC107] transition-colors group">
                        <Icon size={48} className="text-[#FFC107] mb-6" />
                        <h3 className="font-industrial text-2xl uppercase mb-4 text-white group-hover:text-[#FFC107] transition-colors">{s.title}</h3>
                        <p className="font-body font-bold text-gray-400">{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'products') return (
            <section key="products" id="products" className="py-20 px-6 bg-[#F4F4F4]">
              <div className="container mx-auto max-w-6xl">
                <div className="flex items-center gap-4 mb-16">
                   <div className="flex-1 h-1 bg-[#1A1A1A]"></div>
                   <h2 className="font-industrial text-5xl uppercase text-[#1A1A1A]">Materials Accepted</h2>
                   <div className="flex-1 h-1 bg-[#1A1A1A]"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="bg-white border-4 border-[#1A1A1A] p-6 md:p-8 flex flex-col sm:flex-row gap-6 hover:bg-[#FFC107] transition-colors group cursor-pointer relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Scale size={150} />
                      </div>
                      <div className="w-16 h-16 shrink-0 bg-[#1A1A1A] text-white flex items-center justify-center rounded-sm z-10">
                        <Scale size={32} />
                      </div>
                      <div className="z-10">
                        <h3 className="font-industrial text-3xl uppercase mb-2 text-[#1A1A1A]">{p.name}</h3>
                        <div className="font-body font-black text-[#1A1A1A] bg-[#FFC107] group-hover:bg-white inline-block px-3 py-1 text-lg mb-4 uppercase border-2 border-[#1A1A1A]">
                          {p.price}
                        </div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={p} content={content} /></div>
                        <div className="flex justify-between items-end">
                          <p className="font-body font-bold text-gray-600 group-hover:text-[#1A1A1A]">{p.description}</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                            className="bg-[#1A1A1A] text-white font-industrial uppercase px-4 py-2 text-sm hover:bg-white hover:text-[#1A1A1A] transition-colors border-2 border-transparent hover:border-[#1A1A1A]"
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
                      className="bg-transparent border-4 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-industrial text-xl uppercase py-3 px-10 rounded-sm transform skew-x-[-10deg] transition-all inline-block text-center shadow-[4px_4px_0_#FFC107]"
                    >
                      <span className="inline-block transform skew-x-[10deg]">VIEW ALL RATES</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-20 px-6 bg-white">
              <div className="container mx-auto max-w-6xl">
                <div className="flex items-center gap-4 mb-16">
                   <h2 className="font-industrial text-5xl uppercase text-[#1A1A1A]">The Yard</h2>
                   <div className="flex-1 h-1 bg-[#1A1A1A]"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gallery.map((img: string, i: number) => (
                    <div key={i} className="border-4 border-[#1A1A1A] aspect-square relative group overflow-hidden bg-black">
                      <img loading="lazy" src={img} alt={`Facility ${i+1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 border-8 border-transparent group-hover:border-[#FFC107] transition-colors duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-20 px-6 bg-[#F4F4F4]">
              <div className="container mx-auto max-w-6xl">
                <div className="bg-[#1A1A1A] border-8 border-[#FFC107] p-4 md:p-16 flex flex-col lg:flex-row gap-16 relative">
                  <div className="w-full lg:w-1/2 text-white">
                    <h2 className="font-industrial text-5xl uppercase mb-8 text-[#FFC107]">Drop Off Point</h2>
                    <p className="font-body font-bold text-gray-300 mb-12 text-lg">Bring your scrap to our yard. Drive right onto our industrial weighbridge for instant evaluation.</p>
                    
                    <div className="space-y-8 font-body font-bold text-xl">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#FFC107] p-3 text-[#1A1A1A]"><Phone size={24} /></div>
                        <div>
                          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Call Scale House</div>
                          <div>{content.contact_info?.phone || '98765 43210'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-[#FFC107] p-3 text-[#1A1A1A]"><MapPin size={24} /></div>
                        <div>
                          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Yard Location</div>
                          <div>{content.contact_info?.address || 'Industrial Area, Phase 2, Kerala'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-[#FFC107] p-3 text-[#1A1A1A]"><Mail size={24} /></div>
                        <div>
                          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Email Quotes</div>
                          <div>{content.contact_info?.email || 'weighbridge@heavymetal.in'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-1/2 bg-white p-4 md:p-8 border-4 border-[#1A1A1A] flex flex-col h-full">
                    <div className="mb-6">
                      <h3 className="font-industrial text-xl md:text-2xl uppercase font-bold mb-2 text-[#1A1A1A] flex items-center gap-2"><Clock size={20} className="text-[#FFC107]"/> Working Hours</h3>
                      <p className="text-gray-800 font-bold whitespace-pre-line font-body">
                        {content.contact_info?.office_hours || 'Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed'}
                      </p>
                    </div>

                    <div className="mb-6">
                       <h3 className="font-industrial text-xl md:text-2xl uppercase font-bold mb-4 text-[#1A1A1A]">Connect With Us</h3>
                       <div className="flex gap-4">
                          {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F4F4F4] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-colors"><Facebook size={20} /></a>}
                            {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F4F4F4] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-colors"><Instagram size={20} /></a>}
                            {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F4F4F4] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-colors"><WhatsApp size={20} /></a>}
                            {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.whatsapp && (
                               <div className="flex gap-4">
                                 <a href="#" className="w-10 h-10 bg-[#F4F4F4] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-colors"><Facebook size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-[#F4F4F4] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-colors"><Instagram size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-[#F4F4F4] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-colors"><WhatsApp size={20} /></a>
                               </div>
                            )}
                       </div>
                    </div>

                    <div className="flex-grow border-4 border-[#1A1A1A] overflow-hidden min-h-[250px] relative">
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
      <footer className="bg-[#2D2D2D] text-white py-16 px-6 border-t-[8px] border-[#1A1A1A]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img loading="lazy" src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-10 object-contain grayscale" />
            ) : (
              <AlertTriangle size={32} className="text-[#FFC107]" />
            )}
            <h3 className="font-industrial text-3xl uppercase text-white">{siteName}</h3>
          </div>
          <div className="font-body font-bold text-gray-400">
            &copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* View All Products Modal */}
      

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1A1A1A]/90 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white border-8 border-[#1A1A1A] w-full max-w-lg overflow-y-auto max-h-[75vh] shadow-[12px_12px_0_#FFC107] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-[#FFC107] text-[#1A1A1A] p-2 hover:bg-[#1A1A1A] hover:text-[#FFC107] border-4 border-[#1A1A1A] transition-colors"
            >
              <X size={24} />
            </button>
            
            {selectedProduct.image && (
              <div className="h-40 md:h-56 w-full border-b-8 border-[#1A1A1A] relative">
                <div className="absolute inset-0 bg-[#FFC107]/20 z-10"></div>
                <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover grayscale" />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6 border-b-4 border-dashed border-gray-300 pb-6">
                <h3 className="font-industrial text-4xl uppercase text-[#1A1A1A] leading-tight">{selectedProduct.name}</h3>
                <span className="font-industrial text-2xl bg-[#FFC107] text-[#1A1A1A] px-4 py-2 border-4 border-[#1A1A1A] transform rotate-2">
                  {selectedProduct.price}
                </span>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={selectedProduct} content={content} /></div>
              </div>
              
              <p className="font-body font-bold text-xl text-gray-700 leading-relaxed mb-8">
                {selectedProduct.detailed_description || selectedProduct.description || 'Detailed scrap requirements and industrial processing specifications.'}
              </p>
              
              <div className="bg-[#F4F4F4] p-6 border-4 border-[#1A1A1A] mb-8 relative">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#FFC107] border-l-4 border-b-4 border-[#1A1A1A]"></div>
                <h4 className="font-industrial text-2xl uppercase text-[#1A1A1A] mb-4">Acceptance Criteria</h4>
                <ul className="font-body font-bold text-gray-600 space-y-3">
                  <li className="flex items-center gap-3"><AlertTriangle size={16} className="text-[#FFC107]" /> Clean and uncontaminated materials</li>
                  <li className="flex items-center gap-3"><AlertTriangle size={16} className="text-[#FFC107]" /> Minimum volume requirements for pickup</li>
                  <li className="flex items-center gap-3"><AlertTriangle size={16} className="text-[#FFC107]" /> Identification required for cash payments</li>
                </ul>
              </div>

              <a href="#contact" onClick={() => setSelectedProduct(null)} className="block w-full text-center bg-[#1A1A1A] hover:bg-[#FFC107] text-white hover:text-[#1A1A1A] font-industrial text-2xl uppercase py-4 border-4 border-[#1A1A1A] transition-colors">
                Contact Scale House
              </a>
            </div>
          </div>
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

