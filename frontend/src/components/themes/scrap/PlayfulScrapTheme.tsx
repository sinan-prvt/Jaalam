import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Package, Truck, Phone, Mail, MapPin, DollarSign, X, Clock } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from './SocialIcons';

export default function PlayfulScrapTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const siteName = content.settings_json?.website_name || website.slug || 'Junk Busters!';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Copper Scrap', price: '₹500 – ₹800/kg', description: 'Wires, pipes, and pure copper materials.', detailed_description: 'We accept all grades of copper including Bare Bright, #1 Copper, #2 Copper, and insulated copper wire. Clean, unalloyed copper without attachments yields the highest returns.', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Aluminium Scrap', price: '₹100 – ₹200/kg', description: 'Cans, extrusions, wheels, and cast aluminium.', detailed_description: 'Accepted materials include aluminium cans (UBCs), extruded aluminium (window frames, etc.), cast aluminium, and aluminium wheels. Must be free of iron attachments for best pricing.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electronic Waste', price: '₹50 – ₹300/kg', description: 'Laptops, mobile phones, servers.', detailed_description: 'We responsibly recycle all types of e-waste including old computers, servers, smartphones, and bare printed circuit boards (PCBs). Data destruction certificates available upon request.', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
    { name: 'Plastic Scrap', price: '₹10 – ₹30/kg', description: 'PET bottles, PVC, HDPE, and industrial plastics.', detailed_description: 'We process various grades of recyclable plastics including PET (water bottles), HDPE (milk jugs), and rigid industrial plastics. Must be reasonably clean and sorted by resin code for maximum value.', image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80' },
    { name: 'Old Newspapers', price: '₹15 – ₹25/kg', description: 'Old newspapers, magazines, cardboard.', detailed_description: 'We accept bundled old newspapers (ONP), corrugated cardboard (OCC), mixed paper, and white office paper. Materials must be dry and free of food waste or grease.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Home Pickup', description: 'We come right to your door!', icon: Truck },
    { title: 'Office Clearance', description: 'Clearing out old desks and PCs.', icon: Package },
    { title: 'Instant Pay', description: 'Cash in your hand before we leave.', icon: DollarSign }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FFF4E6] text-[#2B3A67] font-sans overflow-hidden border-[16px] border-[#FF9F1C] box-border">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800&display=swap');
        .font-fun { font-family: 'Fredoka One', cursive; }
        .font-body { font-family: 'Nunito', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="container mx-auto bg-white rounded-3xl border-4 border-[#2B3A67] shadow-[6px_6px_0_#2B3A67] p-4 px-8 flex justify-between items-center transform -rotate-1">
          <div className="flex items-center gap-3">
            {content.settings_json?.logo_image || website.logo_url ? (
              <img loading="lazy" src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-12 w-12 object-contain transform rotate-6" />
            ) : (
              <div className="bg-[#FF9F1C] p-2 rounded-xl text-white transform rotate-6"><Package size={28} /></div>
            )}
            <span className="font-fun text-3xl tracking-wide text-[#FF9F1C]">{siteName}</span>
          </div>
          <div className="hidden md:flex gap-6 font-fun text-[#2B3A67]">
            <a href="#about" className="hover:text-[#FF9F1C] transition-colors">About</a>
            <a href="#services" className="hover:text-[#FF9F1C] transition-colors">Services</a>
            <a href="#products" className="hover:text-[#FF9F1C] transition-colors">Rates</a>
            <a href="#contact" className="hover:text-[#FF9F1C] transition-colors">Call Us</a>
          </div>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-16 px-6 text-center">
              <div className="container mx-auto max-w-4xl relative">
                <div className="absolute top-10 left-0 text-[#4ECDC4] transform -rotate-12"><DollarSign size={80} /></div>
                <div className="absolute bottom-10 right-0 text-[#FF6B6B] transform rotate-12"><Truck size={100} /></div>
                
                <h1 className="font-fun text-6xl md:text-8xl text-[#2B3A67] mb-8 leading-tight drop-shadow-md">
                  {content.hero_title || 'Got Junk? Get Cash!'}
                </h1>
                <p className="font-body text-2xl font-bold text-[#FF9F1C] mb-12 bg-white inline-block px-6 py-2 rounded-2xl border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rotate-2">
                  {content.hero_description || content.hero_text || 'We clear your clutter and pay you for it! Fast, friendly, and super easy scrap pickup.'}
                </p>
                <div className="flex justify-center">
                  <a href="#contact" className="bg-[#4ECDC4] hover:bg-[#45b7b0] text-white font-fun text-2xl py-5 px-12 rounded-[2rem] border-4 border-[#2B3A67] shadow-[8px_8px_0_#2B3A67] active:translate-y-2 active:shadow-none transition-all">
                    Book a Pickup! 🚛
                  </a>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-20 px-6">
              <div className="container mx-auto max-w-4xl bg-[#FF6B6B] text-white rounded-[3rem] p-12 border-4 border-[#2B3A67] shadow-[12px_12px_0_#2B3A67] transform rotate-1 text-center relative">
                <div className="absolute -top-8 -right-8 text-[#FF9F1C] bg-white rounded-full p-4 border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rotate-12">
                  <Package size={48} />
                </div>
                <h2 className="font-fun text-5xl mb-8 drop-shadow-sm">{content.settings_json?.about_title || "We Make Recycling FUN!"}</h2>
                <p className="font-body text-2xl font-bold leading-relaxed max-w-3xl mx-auto">
                  {content.settings_json?.about_description || "Don't throw away your treasures! We take your unwanted scrap, pay you top dollar, and make sure it gets recycled properly to save our planet."}
                </p>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-20 px-6">
              <div className="container mx-auto max-w-5xl">
                <h2 className="font-fun text-5xl text-center text-[#2B3A67] mb-16 drop-shadow-sm">How We Help You!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((s: any, i: number) => {
                    const Icon = s.icon || Truck;
                    return (
                      <div key={i} className={`bg-white rounded-[2rem] p-8 border-4 border-[#2B3A67] shadow-[8px_8px_0_#2B3A67] hover:-translate-y-2 transition-transform transform ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}>
                        <div className="bg-[#4ECDC4] text-white w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 border-[#2B3A67]">
                          <Icon size={40} />
                        </div>
                        <h3 className="font-fun text-2xl text-[#2B3A67] mb-4">{s.title}</h3>
                        <p className="font-body font-bold text-gray-500 text-lg">{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'products') return (
            <section key="products" id="products" className="py-20 px-6 bg-[#2B3A67]">
              <div className="container mx-auto max-w-5xl">
                <h2 className="font-fun text-5xl text-center text-white mb-16 drop-shadow-sm">What We Buy!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className={`bg-white rounded-3xl p-6 border-4 border-[#FF9F1C] shadow-[6px_6px_0_#FF9F1C] hover:-translate-y-2 transition-transform transform cursor-pointer group ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'}`}>
                      <div className="bg-[#FF6B6B] text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border-2 border-[#2B3A67]">
                        <DollarSign size={32} />
                      </div>
                      <h3 className="font-fun text-xl text-[#2B3A67] mb-2">{p.name}</h3>
                      <p className="font-body font-bold text-gray-500 mb-4">{p.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="bg-[#4ECDC4] text-[#2B3A67] font-fun px-3 py-1 rounded-lg inline-block border-2 border-[#2B3A67]">
                          {p.price}
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                          className="bg-[#2B3A67] text-white font-fun px-3 py-1 rounded-lg text-sm hover:bg-[#FF6B6B] transition-colors border-2 border-[#2B3A67]"
                        >
                          Details!
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length > 0 && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setShowAllProducts(true)}
                      className="bg-[#FF9F1C] text-white font-fun text-2xl py-4 px-10 rounded-[2rem] border-4 border-[#2B3A67] shadow-[8px_8px_0_#2B3A67] hover:translate-y-1 hover:shadow-[4px_4px_0_#2B3A67] transition-all"
                    >
                      View All Materials! 📦
                    </button>
                  </div>
                )}
              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-20 px-6">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-fun text-5xl text-center text-[#FF9F1C] mb-16 drop-shadow-sm">The Scrap Yard!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {gallery.map((img: string, i: number) => (
                    <div key={i} className={`rounded-3xl overflow-hidden border-4 border-[#2B3A67] shadow-[8px_8px_0_#2B3A67] aspect-square transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} hover:rotate-0 transition-transform`}>
                      <img loading="lazy" src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-20 px-6">
              <div className="container mx-auto max-w-4xl text-center bg-[#4ECDC4] rounded-[3rem] p-12 border-4 border-[#2B3A67] shadow-[12px_12px_0_#2B3A67] relative">
                <div className="absolute -top-6 -left-6 text-white bg-[#FF9F1C] rounded-full p-4 border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] -rotate-12">
                  <Phone size={48} />
                </div>
                <h2 className="font-fun text-5xl text-white mb-12 drop-shadow-sm">Shout Out To Us!</h2>
                <div className="grid md:grid-cols-3 gap-6 font-fun text-xl">
                  <div className="bg-white p-6 rounded-3xl border-4 border-[#2B3A67] shadow-[6px_6px_0_#2B3A67] flex flex-col items-center gap-3 transform -rotate-2">
                     <Phone className="text-[#FF6B6B]" size={40} />
                     <span className="text-[#2B3A67]">{content.contact_info?.phone || '98765 43210'}</span>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border-4 border-[#2B3A67] shadow-[6px_6px_0_#2B3A67] flex flex-col items-center gap-3 transform rotate-2 mt-4 md:mt-0">
                     <MapPin className="text-[#FF9F1C]" size={40} />
                     <span className="text-[#2B3A67]">{content.contact_info?.address || 'Scrap Yard, Kerala'}</span>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border-4 border-[#2B3A67] shadow-[6px_6px_0_#2B3A67] flex flex-col items-center gap-3 transform -rotate-1 mt-4 md:mt-0">
                     <Mail className="text-[#4ECDC4]" size={40} />
                     <span className="text-[#2B3A67] text-lg break-all">{content.contact_info?.email || 'junk@busters.com'}</span>
                  </div>
                </div>

                <div className="mt-12 bg-white rounded-3xl border-4 border-[#2B3A67] shadow-[8px_8px_0_#2B3A67] p-8 text-left grid md:grid-cols-2 gap-8 transform rotate-1">
                  <div className="flex flex-col h-full">
                    <div className="mb-8">
                      <h3 className="font-fun text-3xl font-bold mb-4 text-[#FF6B6B] flex items-center gap-3"><Clock size={32} className="text-[#FF9F1C]"/> Working Hours</h3>
                      <p className="text-[#2B3A67] font-bold text-xl whitespace-pre-line">
                        {content.contact_info?.office_hours || 'Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed'}
                      </p>
                    </div>

                    <div className="mb-6">
                       <h3 className="font-fun text-3xl font-bold mb-6 text-[#FF6B6B]">Connect With Us</h3>
                       <div className="flex gap-4">
                          {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#FF9F1C] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Facebook size={24} /></a>}
                          {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#FF6B6B] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Instagram size={24} /></a>}
                          {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#4ECDC4] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Twitter size={24} /></a>}
                          {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#FF6B6B] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Youtube size={24} /></a>}
                          {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.twitter && !content.contact_info?.youtube && (
                             <div className="flex gap-4">
                               <a href="#" className="w-12 h-12 bg-[#FF9F1C] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Facebook size={24} /></a>
                               <a href="#" className="w-12 h-12 bg-[#FF6B6B] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Instagram size={24} /></a>
                               <a href="#" className="w-12 h-12 bg-[#4ECDC4] border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] rounded-full flex items-center justify-center text-white hover:-translate-y-1 transition-transform"><Twitter size={24} /></a>
                             </div>
                          )}
                       </div>
                    </div>
                  </div>

                  <div className="flex-grow rounded-2xl border-4 border-[#2B3A67] overflow-hidden min-h-[250px] relative transform -rotate-2">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353155041!3d-37.81720974202167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1620800845348!5m2!1sen!2sin" 
                      className="absolute inset-0 w-full h-full border-0"
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
      <footer className="bg-[#2B3A67] text-white py-16 px-6 border-t-8 border-[#FF6B6B]">
        <div className="container mx-auto max-w-4xl text-center">
          {content.settings_json?.logo_image || website.logo_url ? (
            <img loading="lazy" src={content.settings_json?.logo_image || website.logo_url} alt="Logo" className="h-16 object-contain mx-auto mb-6" />
          ) : null}
          <h3 className="font-fun text-4xl text-[#FF9F1C] mb-6">{siteName}</h3>
          <p className="font-body font-bold text-lg mb-4 text-gray-300">
            {content.about_text || "Making recycling fun and rewarding for everyone!"}
          </p>
          <p className="font-body font-bold text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {siteName}. All junk belongs to us.
          </p>
        </div>
      </footer>

      {/* View All Products Modal */}
      

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#2B3A67]/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-[3rem] w-full max-w-md overflow-y-auto max-h-[75vh] border-4 border-[#2B3A67] shadow-[12px_12px_0_#2B3A67] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-[#FF6B6B] text-white p-2 rounded-full border-4 border-[#2B3A67] hover:scale-110 transition-transform"
            >
              <X size={24} />
            </button>
            {selectedProduct.image && (
              <div className="h-40 md:h-56 w-full border-b-4 border-[#2B3A67]">
                <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-fun text-4xl text-[#2B3A67]">{selectedProduct.name}</h3>
                <span className="font-fun text-xl bg-[#4ECDC4] text-white px-4 py-2 rounded-2xl border-4 border-[#2B3A67] shadow-[4px_4px_0_#2B3A67] transform rotate-3">
                  {selectedProduct.price}
                </span>
              </div>
              <p className="font-body text-xl font-bold text-gray-600 mb-8 leading-relaxed">
                {selectedProduct.detailed_description || selectedProduct.description || 'Awesome details about this scrap material. We love recycling this stuff!'}
              </p>
              
              <div className="bg-[#FFF4E6] p-6 rounded-3xl border-4 border-[#FF9F1C] mb-8">
                <h4 className="font-fun text-[#2B3A67] text-xl mb-4">Good to know!</h4>
                <ul className="font-body font-bold text-gray-600 space-y-3">
                  <li className="flex items-center gap-3">⭐ Minimum quantity requirements apply</li>
                  <li className="flex items-center gap-3">⭐ Must be free of hazardous contaminants</li>
                  <li className="flex items-center gap-3">⭐ Sorted and unsorted loads accepted</li>
                </ul>
              </div>

              <a href="#contact" onClick={() => setSelectedProduct(null)} className="block w-full text-center bg-[#FF9F1C] text-white font-fun text-2xl py-4 rounded-[2rem] border-4 border-[#2B3A67] shadow-[8px_8px_0_#2B3A67] hover:translate-y-1 hover:shadow-[4px_4px_0_#2B3A67] transition-all">
                Let's Recycle It! ♻️
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

