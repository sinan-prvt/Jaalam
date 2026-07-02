import React, { useState } from 'react';
import { Recycle, ArrowRight, MapPin, Mail, Phone, Scale, DollarSign, Truck, X, Clock } from 'lucide-react';
import { Facebook, Instagram, WhatsApp } from './SocialIcons';

export default function ModernScrapTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'GreenTech Recycling';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Copper Scrap', price: '₹500 – ₹800/kg', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80', description: 'Wires, pipes, and pure copper materials.', detailed_description: 'We accept all grades of copper including Bare Bright, #1 Copper, #2 Copper, and insulated copper wire. Clean, unalloyed copper without attachments yields the highest returns.' },
    { name: 'Aluminium Scrap', price: '₹100 – ₹200/kg', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', description: 'Cans, extrusions, wheels, and cast aluminium.', detailed_description: 'Accepted materials include aluminium cans (UBCs), extruded aluminium (window frames, etc.), cast aluminium, and aluminium wheels. Must be free of iron attachments for best pricing.' },
    { name: 'Electronic Waste', price: '₹50 – ₹300/kg', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80', description: 'Laptops, mobile phones, servers.', detailed_description: 'We responsibly recycle all types of e-waste including old computers, servers, smartphones, and bare printed circuit boards (PCBs). Data destruction certificates available upon request.' },
    { name: 'Plastic Scrap', price: '₹10 – ₹30/kg', image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80', description: 'PET bottles, PVC, HDPE, and industrial plastics.', detailed_description: 'We process various grades of recyclable plastics including PET (water bottles), HDPE (milk jugs), and rigid industrial plastics. Must be reasonably clean and sorted by resin code for maximum value.' },
    { name: 'Old Newspapers', price: '₹15 – ₹25/kg', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', description: 'Old newspapers, magazines, cardboard.', detailed_description: 'We accept bundled old newspapers (ONP), corrugated cardboard (OCC), mixed paper, and white office paper. Materials must be dry and free of food waste or grease.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Bulk Pickup', description: 'Free pickup service for lots over 500kg.', icon: Truck },
    { title: 'Corporate Audits', description: 'Comprehensive waste audits for businesses.', icon: Scale },
    { title: 'Instant Payment', description: 'Get paid instantly on the spot via cash or UPI.', icon: DollarSign }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .font-modern { font-family: 'Plus Jakarta Sans', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-10 w-10 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <Recycle size={24} />
              </div>
            )}
            <span className="font-modern text-2xl font-extrabold text-slate-900 tracking-tight">{siteName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-modern font-semibold text-sm text-slate-600">
            <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
            <a href="#products" className="hover:text-emerald-600 transition-colors">Materials</a>
            <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-emerald-600/20">
              Request Pickup
            </button>
          </div>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-20 md:py-32 px-6">
              <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-modern text-sm font-bold mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Market Rates
                  </div>
                  <h1 className="font-modern text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                    {content.hero_title || 'Smart Recycling for a Better Tomorrow.'}
                  </h1>
                  <p className="font-modern text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
                    {content.hero_description || content.hero_text || 'We offer transparent pricing, instant payments, and professional pickup services for all your recyclable materials.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-modern font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20">
                      Check Today's Rates <ArrowRight size={18} />
                    </a>
                    <a href={`tel:${content.contact_info?.phone || '9876543210'}`} className="bg-white hover:bg-slate-50 text-slate-700 font-modern font-bold py-4 px-8 rounded-xl border border-slate-200 transition-colors flex justify-center items-center">
                      Call {content.contact_info?.phone || '98765 43210'}
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-1/2 relative">
                   <div className="absolute inset-0 bg-emerald-500 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                   <img src={content.settings_json?.about_image || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"} alt="Recycling" className="w-full h-auto rounded-3xl shadow-2xl relative z-10" />
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-24 px-6 bg-white border-t border-slate-100">
              <div className="container mx-auto max-w-4xl text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-8">
                  <Recycle size={32} />
                </div>
                <h2 className="font-modern text-4xl font-extrabold text-slate-900 mb-6">
                  {content.settings_json?.about_title || 'Leading the Charge in Sustainable Recycling'}
                </h2>
                <p className="font-modern text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
                  {content.settings_json?.about_description || 'We are committed to building a circular economy by providing state-of-the-art recycling facilities for commercial and residential clients. Our transparent processes ensure you get the best value for your scrap while minimizing environmental impact.'}
                </p>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="font-modern text-4xl font-extrabold text-slate-900 mb-4">Our Services</h2>
                  <p className="font-modern text-slate-500 max-w-2xl mx-auto">Comprehensive waste management solutions for every scale.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((s: any, i: number) => {
                    const Icon = s.icon || Truck;
                    return (
                      <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                        <h3 className="font-modern text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                        <p className="font-modern text-slate-500 leading-relaxed">{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'products') return (
            <section key="products" id="products" className="py-24 bg-white border-t border-slate-100 px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="font-modern text-4xl font-extrabold text-slate-900 mb-4">Live Market Rates</h2>
                    <p className="font-modern text-slate-500 max-w-xl">We offer highly competitive pricing based on current market indices for all recyclable materials.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.slice(0, 3).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
                      {p.image && (
                        <div className="h-48 overflow-hidden relative">
                          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-modern text-xl font-bold text-slate-900">{p.name}</h3>
                          <span className="font-modern font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm whitespace-nowrap ml-4">
                            {p.price}
                          </span>
                        </div>
                        <p className="font-modern text-sm text-slate-500 mt-2 mb-4">{p.description}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                          className="w-full py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length > 0 && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setShowAllProducts(true)}
                      className="bg-white hover:bg-slate-50 text-emerald-600 border border-emerald-200 font-modern font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
                    >
                      View All Materials
                    </button>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-24 bg-slate-50 border-t border-slate-100 px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="font-modern text-4xl font-extrabold text-slate-900 mb-4">Our Facilities</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gallery.map((img: string, i: number) => (
                    <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group">
                      <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-24 bg-white border-t border-slate-100 px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="bg-emerald-600 rounded-3xl p-6 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20">
                  <div className="absolute top-[-10%] right-[-5%] opacity-10"><Recycle size={400} /></div>
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="font-modern text-4xl font-extrabold mb-6">Ready to clear some space?</h2>
                      <p className="text-emerald-100 text-lg mb-8 max-w-md">Schedule a pickup or visit our facility today. Let's make recycling effortless and profitable for you.</p>
                      <ul className="space-y-6">
                        <li className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><Phone size={20} /></div>
                          <div className="min-w-0">
                            <div className="text-emerald-200 text-xs md:text-sm font-bold tracking-wider uppercase">Call Us</div>
                            <div className="text-base md:text-xl font-semibold break-words">{content.contact_info?.phone || '+91 98765 43210'}</div>
                          </div>
                        </li>
                        <li className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><MapPin size={20} /></div>
                          <div className="min-w-0">
                            <div className="text-emerald-200 text-xs md:text-sm font-bold tracking-wider uppercase">Visit Us</div>
                            <div className="text-sm md:text-lg font-semibold break-words">{content.contact_info?.address || 'Industrial Estate, Kerala 682001'}</div>
                          </div>
                        </li>
                        <li className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><Mail size={20} /></div>
                          <div className="min-w-0">
                            <div className="text-emerald-200 text-xs md:text-sm font-bold tracking-wider uppercase">Email</div>
                            <div className="text-sm md:text-lg font-semibold break-words">{content.contact_info?.email || 'contact@greentech.in'}</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-slate-800 flex flex-col h-full">
                      <div className="mb-6">
                        <h3 className="font-modern text-xl md:text-2xl font-bold mb-2 flex items-center gap-2"><Clock size={20} className="text-emerald-600"/> Working Hours</h3>
                        <p className="text-slate-600 font-medium whitespace-pre-line">
                          {content.contact_info?.office_hours || 'Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed'}
                        </p>
                      </div>

                      <div className="mb-6">
                         <h3 className="font-modern text-xl md:text-2xl font-bold mb-4">Connect With Us</h3>
                         <div className="flex gap-4">
                            {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"><Facebook size={20} /></a>}
                            {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"><Instagram size={20} /></a>}
                            {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"><WhatsApp size={20} /></a>}
                            {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.whatsapp && (
                               <div className="flex gap-4">
                                 <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"><Facebook size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"><Instagram size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"><WhatsApp size={20} /></a>
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
      <footer className="bg-slate-900 text-white py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-8 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            ) : (
              <Recycle size={24} className="text-slate-600" />
            )}
            <span className="font-modern text-xl font-bold text-slate-500">{siteName}</span>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl text-center font-modern text-sm text-slate-600 mt-8 pt-8 border-t border-slate-800">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>

      {/* View All Products Modal */}
      {showAllProducts && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 overflow-y-auto">
          <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-20 shadow-sm">
            <h2 className="font-modern text-2xl font-extrabold text-slate-900">All Materials & Rates</h2>
            <button onClick={() => setShowAllProducts(false)} className="bg-slate-100 text-slate-600 p-3 rounded-full hover:bg-slate-200 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 md:p-12">
            <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p: any, i: number) => (
                <div key={i} onClick={() => setSelectedProduct(p)} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
                  {p.image && (
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-modern text-xl font-bold text-slate-900">{p.name}</h3>
                      <span className="font-modern font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm whitespace-nowrap ml-4">
                        {p.price}
                      </span>
                    </div>
                    <p className="font-modern text-sm text-slate-500 mt-2 mb-4">{p.description}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                      className="w-full py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                    >
                      View Details
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-y-auto max-h-[75vh] shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur text-slate-800 p-2 rounded-full hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
            {selectedProduct.image && (
              <div className="h-40 md:h-56 w-full">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-modern text-2xl font-bold text-slate-900">{selectedProduct.name}</h3>
                <span className="font-modern font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {selectedProduct.price}
                </span>
              </div>
              <p className="font-modern text-slate-600 leading-relaxed mb-6">
                {selectedProduct.detailed_description || selectedProduct.description || 'Detailed specifications and processing information for this material.'}
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                <h4 className="font-modern font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">Accepted Conditions</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Minimum quantity requirements apply</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Must be free of hazardous contaminants</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Sorted and unsorted loads accepted</li>
                </ul>
              </div>

              <a href="#contact" onClick={() => setSelectedProduct(null)} className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-modern font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                Request Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
