import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Truck, Scale, MapPin, Mail, Phone, ChevronRight, BarChart, ShieldCheck, X, Clock } from 'lucide-react';
import { Facebook, Instagram, WhatsApp } from './SocialIcons';

export default function CorporateScrapTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'Apex Metal Recycling';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Copper Scrap', price: '₹500 – ₹800/kg', description: 'Wires, pipes, and pure copper materials.', detailed_description: 'We accept all grades of copper including Bare Bright, #1 Copper, #2 Copper, and insulated copper wire. Clean, unalloyed copper without attachments yields the highest returns.', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Aluminium Scrap', price: '₹100 – ₹200/kg', description: 'Cans, extrusions, wheels, and cast aluminium.', detailed_description: 'Accepted materials include aluminium cans (UBCs), extruded aluminium (window frames, etc.), cast aluminium, and aluminium wheels. Must be free of iron attachments for best pricing.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electronic Waste', price: '₹50 – ₹300/kg', description: 'Laptops, mobile phones, servers.', detailed_description: 'We responsibly recycle all types of e-waste including old computers, servers, smartphones, and bare printed circuit boards (PCBs). Data destruction certificates available upon request.', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
    { name: 'Plastic Scrap', price: '₹10 – ₹30/kg', description: 'PET bottles, PVC, HDPE, and industrial plastics.', detailed_description: 'We process various grades of recyclable plastics including PET (water bottles), HDPE (milk jugs), and rigid industrial plastics. Must be reasonably clean and sorted by resin code for maximum value.', image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80' },
    { name: 'Old Newspapers', price: '₹15 – ₹25/kg', description: 'Old newspapers, magazines, cardboard.', detailed_description: 'We accept bundled old newspapers (ONP), corrugated cardboard (OCC), mixed paper, and white office paper. Materials must be dry and free of food waste or grease.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Commercial Recycling Programs', description: 'Tailored waste management solutions for large facilities.', icon: BarChart },
    { title: 'Data Center Decommissioning', description: 'Secure destruction and recycling of IT assets.', icon: ShieldCheck },
    { title: 'Manufacturing Scrap Management', description: 'Optimized collection and market-linked pricing.', icon: Scale },
    { title: 'Logistics & Transportation', description: 'Fleet of roll-off trucks and flatbeds for seamless removal.', icon: Truck }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#2563EB] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-corp { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Top Bar */}
      <div className="bg-[#1E293B] text-slate-300 text-xs py-2 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>B2B Recycling & Waste Management Solutions</span>
          <div className="flex gap-4">
             <span className="flex items-center gap-1"><Mail size={12} /> {content.contact_info?.email || 'corporate@apexmetal.com'}</span>
             <span className="flex items-center gap-1"><Phone size={12} /> {content.contact_info?.phone || '+91 98765 43210'}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="bg-[#2563EB] text-white p-2 rounded">
                <Scale size={24} />
              </div>
            )}
            <span className="font-corp text-2xl font-bold tracking-tight text-[#0F172A]">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-corp font-medium text-sm text-[#475569]">
            <a href="#about" className="hover:text-[#2563EB] transition-colors">Company</a>
            <a href="#services" className="hover:text-[#2563EB] transition-colors">Capabilities</a>
            <a href="#products" className="hover:text-[#2563EB] transition-colors">Materials</a>
            <a href="#contact" className="hover:text-[#2563EB] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero">
              <div className="py-20 px-6 bg-gradient-to-b from-[#F8FAFC] to-white">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="inline-block bg-blue-50 text-[#2563EB] font-corp text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-6">
                      Industrial Scale Operations
                    </div>
                    <h1 className="font-corp text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6 tracking-tight">
                      {content.hero_title || 'Enterprise Scrap & Metal Recovery.'}
                    </h1>
                    <p className="font-corp text-[#475569] text-lg leading-relaxed mb-8">
                      {content.hero_description || content.hero_text || 'We partner with industries to provide compliant, efficient, and transparent recycling programs that maximize return on scrap materials.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                       <a href="#contact" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                         Request Corporate Audit <ChevronRight size={18} />
                       </a>
                       <a href="#services" className="bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-300 font-medium py-3 px-6 rounded transition-colors text-center">
                         View Capabilities
                       </a>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#2563EB] rounded-lg translate-x-4 translate-y-4 opacity-20"></div>
                    <img src={content.settings_json?.hero_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"} alt="Industrial Facility" className="rounded-lg shadow-xl relative z-10 w-full object-cover aspect-[4/3]" />
                  </div>
                </div>
              </div>

              {/* Features Bar */}
              <div className="bg-[#2563EB] text-white py-8 px-6">
                <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-400">
                   <div className="pt-4 md:pt-0">
                      <div className="font-bold text-3xl mb-1">ISO 14001</div>
                      <div className="text-blue-100 text-sm">Certified Facility</div>
                   </div>
                   <div className="pt-4 md:pt-0">
                      <div className="font-bold text-3xl mb-1">50K+ Tons</div>
                      <div className="text-blue-100 text-sm">Processed Annually</div>
                   </div>
                   <div className="pt-4 md:pt-0">
                      <div className="font-bold text-3xl mb-1">100%</div>
                      <div className="text-blue-100 text-sm">Compliance Guaranteed</div>
                   </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-24 px-6 bg-white">
              <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80" alt="Recycling 1" className="rounded-lg shadow-md w-full h-48 object-cover" />
                    <img src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80" alt="Recycling 2" className="rounded-lg shadow-md w-full h-48 object-cover mt-8" />
                  </div>
                  <div className="order-1 md:order-2">
                    <h2 className="font-corp text-sm font-bold text-[#2563EB] uppercase tracking-wider mb-2">Corporate Profile</h2>
                    <h3 className="font-corp text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">
                      {content.settings_json?.about_title || 'Industry Leaders in Material Recovery'}
                    </h3>
                    <p className="font-corp text-[#475569] leading-relaxed mb-6">
                      {content.settings_json?.about_description || 'With over two decades of experience in commercial recycling, we provide end-to-end waste management solutions for Fortune 500 companies and large manufacturing facilities.'}
                    </p>
                    <p className="font-corp text-[#475569] leading-relaxed mb-8">
                      Our data-driven approach ensures maximum material recovery, complete environmental compliance, and optimized financial returns on your scrap assets.
                    </p>
                    <ul className="space-y-3 font-corp text-[#0F172A] font-medium">
                      <li className="flex items-center gap-3"><ShieldCheck className="text-[#2563EB]" size={20} /> EPA Compliant Processing</li>
                      <li className="flex items-center gap-3"><ShieldCheck className="text-[#2563EB]" size={20} /> Secure Certificates of Destruction</li>
                      <li className="flex items-center gap-3"><ShieldCheck className="text-[#2563EB]" size={20} /> Transparent Market-Linked Pricing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-24 px-6 bg-[#F8FAFC] border-t border-slate-200">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="font-corp text-sm font-bold text-[#2563EB] uppercase tracking-wider mb-2">Core Capabilities</h2>
                  <h3 className="font-corp text-3xl font-bold text-[#0F172A]">Comprehensive B2B Solutions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((s: any, i: number) => {
                    const Icon = s.icon || Truck;
                    return (
                      <div key={i} className="bg-white border border-slate-200 p-8 rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <Icon size={24} />
                        </div>
                        <h4 className="font-corp text-xl font-bold text-[#0F172A] mb-3">{s.title}</h4>
                        <p className="font-corp text-[#475569] text-sm leading-relaxed">{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'products') return (
            <section key="products" id="products" className="py-24 px-6 bg-white border-t border-slate-200">
              <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div className="max-w-2xl">
                    <h2 className="font-corp text-sm font-bold text-[#2563EB] uppercase tracking-wider mb-2">Materials Managed</h2>
                    <h3 className="font-corp text-3xl font-bold text-[#0F172A]">Commodity Processing</h3>
                  </div>
                  <a href="#contact" className="text-[#2563EB] font-medium hover:underline flex items-center gap-1">
                    Request Current Pricing <ChevronRight size={16} />
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="flex border border-slate-200 rounded-lg overflow-hidden hover:border-[#2563EB] transition-colors bg-[#F8FAFC] cursor-pointer">
                      <div className="w-2 bg-[#2563EB]"></div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-corp text-lg font-bold text-[#0F172A]">{p.name}</h4>
                            <span className="bg-blue-100 text-[#2563EB] text-xs font-bold px-2 py-1 rounded">{p.price}</span>
                          </div>
                          <p className="font-corp text-[#475569] text-sm leading-relaxed mb-4">{p.description}</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                            className="text-[#2563EB] font-medium text-sm flex items-center gap-1 hover:underline mt-auto"
                          >
                            View Specifications <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {products.length > 0 && (
                  <div className="mt-10 text-center">
                    <button 
                      onClick={() => setShowAllProducts(true)}
                      className="bg-white border-2 border-[#2563EB] text-[#2563EB] font-corp font-bold uppercase tracking-wider py-3 px-8 rounded hover:bg-[#2563EB] hover:text-white transition-colors"
                    >
                      View All Materials
                    </button>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-24 px-6 bg-[#0F172A] text-white">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="font-corp text-sm font-bold text-[#3B82F6] uppercase tracking-wider mb-2">Facility Overview</h2>
                  <h3 className="font-corp text-3xl font-bold">State-of-the-Art Processing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {gallery.map((img: string, i: number) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-slate-700 aspect-video md:aspect-square">
                      <img src={img} alt={`Facility ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-80 hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-24 px-6 bg-[#F8FAFC]">
              <div className="container mx-auto max-w-6xl">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 bg-[#2563EB] text-white p-10 flex flex-col justify-between">
                    <div>
                      <h3 className="font-corp text-2xl font-bold mb-6">Contact Our Team</h3>
                      <p className="text-blue-100 mb-10 text-sm leading-relaxed">Connect with our corporate accounts team to discuss your facility's recycling and waste management needs.</p>
                      
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <MapPin size={20} className="text-blue-300 shrink-0 mt-1" />
                          <div>
                            <div className="font-bold text-sm">Headquarters</div>
                            <div className="text-blue-100 text-sm mt-1">{content.contact_info?.address || 'Tech Park, Industrial Zone, Kerala'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Phone size={20} className="text-blue-300 shrink-0 mt-1" />
                          <div>
                            <div className="font-bold text-sm">Direct Line</div>
                            <div className="text-blue-100 text-sm mt-1">{content.contact_info?.phone || '+91 98765 43210'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Mail size={20} className="text-blue-300 shrink-0 mt-1" />
                          <div>
                            <div className="font-bold text-sm">Corporate Sales</div>
                            <div className="text-blue-100 text-sm mt-1">{content.contact_info?.email || 'corporate@apexmetal.com'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 p-10 flex flex-col">
                    <div className="mb-6">
                      <h3 className="font-corp text-xl md:text-2xl font-bold mb-2 text-[#0F172A] flex items-center gap-2"><Clock size={20} className="text-[#2563EB]"/> Working Hours</h3>
                      <p className="text-slate-600 font-medium whitespace-pre-line">
                        {content.contact_info?.office_hours || 'Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed'}
                      </p>
                    </div>

                    <div className="mb-6">
                       <h3 className="font-corp text-xl md:text-2xl font-bold mb-4 text-[#0F172A]">Connect With Us</h3>
                       <div className="flex gap-4">
                          {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F8FAFC] border border-slate-200 rounded flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"><Facebook size={20} /></a>}
                            {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F8FAFC] border border-slate-200 rounded flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"><Instagram size={20} /></a>}
                            {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#F8FAFC] border border-slate-200 rounded flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"><WhatsApp size={20} /></a>}
                            {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.whatsapp && (
                               <div className="flex gap-4">
                                 <a href="#" className="w-10 h-10 bg-[#F8FAFC] border border-slate-200 rounded flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"><Facebook size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-[#F8FAFC] border border-slate-200 rounded flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"><Instagram size={20} /></a>
                                 <a href="#" className="w-10 h-10 bg-[#F8FAFC] border border-slate-200 rounded flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"><WhatsApp size={20} /></a>
                               </div>
                            )}
                       </div>
                    </div>

                    <div className="flex-grow rounded border border-slate-200 overflow-hidden min-h-[250px] relative">
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
      <footer className="bg-[#0F172A] text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-4 gap-8 font-corp text-sm mb-8">
          <div className="md:col-span-2">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-8 object-contain mb-4 opacity-80" />
            ) : null}
            <span className="text-xl font-bold text-white mb-4 block">{siteName}</span>
            <p className="max-w-md leading-relaxed text-slate-500">
              {content.about_text || "The trusted partner for industrial metal recycling and waste management."}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-white transition-colors">Company Profile</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Materials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl pt-8 border-t border-slate-800 text-center md:text-left text-xs">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>

      {/* View All Products Modal */}
      

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-xl w-full max-w-xl overflow-y-auto max-h-[75vh] shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-slate-100 text-slate-500 p-2 rounded hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col md:flex-row h-full">
              {selectedProduct.image && (
                <div className="w-full md:w-2/5 bg-slate-100 h-48 md:h-auto">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className={`p-6 md:p-8 ${selectedProduct.image ? 'w-full md:w-3/5' : 'w-full'}`}>
                <div className="inline-block bg-blue-50 text-[#2563EB] font-corp text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-4">
                  {selectedProduct.price}
                </div>
                <h3 className="font-corp text-3xl font-bold text-[#0F172A] mb-4">{selectedProduct.name}</h3>
                
                <p className="font-corp text-[#475569] leading-relaxed mb-6 pb-6 border-b border-slate-100">
                  {selectedProduct.detailed_description || selectedProduct.description || 'Detailed material specifications, grading criteria, and recovery process information.'}
                </p>
                
                <div className="mb-8">
                  <h4 className="font-corp font-bold text-[#0F172A] mb-3 text-sm">Processing Requirements</h4>
                  <ul className="text-sm text-[#475569] space-y-2">
                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#2563EB]" /> Industrial volumes preferred</li>
                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#2563EB]" /> Certificates of destruction available</li>
                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#2563EB]" /> EPA compliant processing guaranteed</li>
                  </ul>
                </div>

                <a href="#contact" onClick={() => setSelectedProduct(null)} className="inline-flex items-center justify-center w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium py-3 px-6 rounded transition-colors gap-2">
                  Request Commercial Pricing <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

