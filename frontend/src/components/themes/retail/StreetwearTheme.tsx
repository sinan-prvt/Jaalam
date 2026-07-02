import React, { useState } from 'react';
import { ShoppingBag, Search, X, Flame, Zap, ArrowRight, Menu, MapPin, Mail, Phone } from 'lucide-react';

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const Twitter = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
const Facebook = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function StreetwearTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewProductsPage, setViewProductsPage] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const siteName = content.settings_json?.website_name || website.slug || 'DRIP CARTEL';

  const defaultProducts = [
    { name: 'Oversized Graphic Tee', price: '₹3500', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80', description: 'Heavyweight cotton with puff print.' },
    { name: 'Cargo Parachute Pants', price: '₹5500', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', description: 'Nylon blend with adjustable cuffs.' },
    { name: 'Chunky Sneakers', price: '₹8500', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80', description: 'Retro runner silhouette with reflective hits.' },
    { name: 'Distressed Hoodie', price: '₹4500', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80', description: 'French terry custom wash.' }
  ];

  const products = content.products_json?.length > 0 ? content.products_json : defaultProducts;
  
  const defaultServices = [
    { title: 'Personal Styling', description: 'One-on-one sessions to refine your street look.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { title: 'Custom Tailoring', description: 'Perfect fit adjustments for any piece.', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80' },
    { title: 'Exclusive Drops', description: 'VIP access to our most limited releases.', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80' }
  ];
  const services = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const defaultGallery = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
  ];
  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json : defaultGallery;

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#0A0A0A] text-[#F3F4F6] selection:bg-[#ccff00] selection:text-black flex flex-col font-mono overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        .st-font { font-family: 'Space Grotesk', sans-serif; }
        .st-marquee { white-space: nowrap; animation: scroll 20s linear infinite; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .st-brutal-btn {
          background: #0A0A0A;
          color: #ccff00;
          border: 2px solid #ccff00;
          box-shadow: 4px 4px 0px #ccff00;
          transition: all 0.1s;
        }
        .st-brutal-btn:hover { box-shadow: 0px 0px 0px #ccff00; transform: translate(4px, 4px); }
        .st-brutal-card {
          background: #111;
          border: 2px solid #333;
          transition: all 0.2s;
        }
        .st-brutal-card:hover { border-color: #ccff00; }

        /* Hide scrollbars globally */
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Ticker */}
      <div className="bg-[#ccff00] text-black py-2 overflow-hidden flex items-center font-bold text-sm tracking-widest uppercase">
        <div className="st-marquee flex gap-8">
          <span>FREE SHIPPING OVER ₹1500</span>
          <Flame size={16} />
          <span>NEW DROP LIVE</span>
          <Flame size={16} />
          <span>LIMITED STOCK</span>
          <Flame size={16} />
          <span>FREE SHIPPING OVER ?100</span>
          <Flame size={16} />
          <span>NEW DROP LIVE</span>
          <Flame size={16} />
          <span>LIMITED STOCK</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b-2 border-[#333] p-4 flex items-center justify-between sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md">
        <button className="md:hidden text-[#ccff00]" onClick={() => setIsMenuOpen(true)}>
          <Menu size={28} />
        </button>
        <div className="st-font text-3xl font-black italic tracking-tighter text-[#ccff00] flex-1 text-center md:text-left">
          {siteName}
        </div>
        <nav className="hidden md:flex gap-8 font-bold text-sm tracking-widest uppercase text-gray-400">
          <a href="#drop" className="hover:text-[#ccff00]">Shop</a>
          <a href="#vibe" className="hover:text-[#ccff00]">About</a>
        </nav>
        <div className="flex-1 flex justify-end gap-6 text-gray-400 items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#ccff00] cursor-pointer hover:scale-110 transition-transform">
            <img src={content.settings_json?.logo_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#0A0A0A] z-[60] p-6 flex flex-col border-4 border-[#ccff00]">
          <button className="self-end text-[#ccff00] mb-12" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          <nav className="flex flex-col gap-8 st-font text-5xl font-black text-gray-400">
            <a href="#drop" className="hover:text-[#ccff00]" onClick={() => setIsMenuOpen(false)}>SHOP</a>
            <a href="#vibe" className="hover:text-[#ccff00]" onClick={() => setIsMenuOpen(false)}>ABOUT</a>
          </nav>
        </div>
      )}

      {/* Content Sections mapped by section_order */}
      {sectionOrder.map(sectionId => {
        if (hiddenSections.includes(sectionId)) return null;

        if (sectionId === 'hero') return (
          <section key="hero" className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 border-b-2 border-[#333] overflow-hidden">
            <div className="absolute inset-0 opacity-30 mix-blend-luminosity bg-[url('https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
            <div className="relative z-10 text-center w-full max-w-4xl">
              <div className="inline-block bg-[#ccff00] text-black font-bold px-4 py-1 mb-6 rotate-[-2deg]">SEASON 1</div>
              <h1 className="st-font text-6xl md:text-8xl font-black italic uppercase leading-none mb-8 break-words whitespace-pre-wrap tracking-tighter drop-shadow-[4px_4px_0_rgba(204,255,0,0.3)]">
                {content.hero_title || 'STREET UNIFORM'}
              </h1>
              <a href="#drop" className="st-brutal-btn px-10 py-4 font-bold text-xl uppercase tracking-widest mt-4 inline-block">
                Shop Now
              </a>
            </div>
          </section>
        );

        if (sectionId === 'about') return (
          <section key="about" id="vibe" className="p-6 md:p-12 border-b-2 border-[#333] bg-[url('https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-fixed bg-center relative">
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="relative z-10 max-w-4xl text-[#ccff00]">
              <h2 className="st-font text-5xl md:text-7xl font-black italic mb-8 break-words whitespace-pre-wrap">
                {content.settings_json?.about_title || 'BORN IN THE STREETS'}
              </h2>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-white max-w-2xl break-words whitespace-pre-wrap">
                {content.settings_json?.about_description || 'We rebel against fast fashion. Every piece is cut and sewn with intent. Small batches, heavy fabrics, zero compromises.'}
              </p>
            </div>
          </section>
        );

        if (sectionId === 'services') return (
          <section key="services" id="services" className="p-6 md:p-12 border-b-2 border-[#333] bg-[#0A0A0A]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Zap size={32} className="text-[#ccff00] mb-2" />
                <h2 className="st-font text-4xl md:text-6xl font-black italic">SERVICES</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s: any, i: number) => (
                <div key={i} className="st-brutal-card flex flex-col group hover:-translate-y-2 hover:shadow-[8px_8px_0_rgba(204,255,0,1)] transition-all overflow-hidden">
                  {s.image && (
                    <div className="w-full aspect-video border-b-2 border-[#333] overflow-hidden">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <h3 className="st-font font-black text-2xl uppercase text-[#ccff00] mb-4 break-words">{s.title}</h3>
                    <p className="text-gray-400 font-bold leading-relaxed break-words">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

        if (sectionId === 'menu') return (
          <section key="menu" id="drop" className="p-6 md:p-12 border-b-2 border-[#333]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Zap size={32} className="text-[#ccff00] mb-2" />
                <h2 className="st-font text-4xl md:text-6xl font-black italic">LATEST DROP</h2>
              </div>
              <a href="#" className="hidden md:flex font-bold text-[#ccff00] hover:underline items-center gap-2">VIEW ALL <ArrowRight size={20} /></a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p: any, i: number) => (
                <div key={i} className="st-brutal-card flex flex-col group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="w-full aspect-[4/5] bg-[#0A0A0A] overflow-hidden border-b-2 border-[#333] group-hover:border-[#ccff00] transition-colors p-4 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                    <div className="absolute top-4 left-4 bg-white text-black font-bold px-2 py-1 text-xs">NEW</div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="st-font font-bold text-xl uppercase mb-2 flex-1 break-words">{p.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[#ccff00] font-black text-xl">{p.price}</span>
                      <button className="bg-[#333] text-white w-10 h-10 flex items-center justify-center font-black group-hover:bg-[#ccff00] group-hover:text-black transition-colors">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button onClick={() => setViewProductsPage(true)} className="st-brutal-btn px-10 py-4 font-bold text-xl uppercase tracking-widest">
                View All
              </button>
            </div>
          </section>
        );

        if (sectionId === 'gallery') return (
          <section key="gallery" id="gallery" className="p-6 md:p-12 border-b-2 border-[#333]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Zap size={32} className="text-[#ccff00] mb-2" />
                <h2 className="st-font text-4xl md:text-6xl font-black italic uppercase">Lookbook</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {galleryImages.slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="aspect-[3/4] bg-[#111] overflow-hidden border-2 border-[#333] hover:border-[#ccff00] transition-colors relative group cursor-pointer" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </section>
        );

        if (sectionId === 'contact') return (
          <section key="contact" id="contact" className="p-6 md:p-12 border-b-2 border-[#333] bg-[#111]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Zap size={32} className="text-[#ccff00] mb-2" />
                <h2 className="st-font text-4xl md:text-6xl font-black italic uppercase">Hit Us Up</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="st-brutal-card p-8 flex flex-col justify-center space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#ccff00] mt-1 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold uppercase mb-1">HQ</h4>
                    <p className="text-gray-400 font-bold">{content.contact_info?.address || '123 Streetwear Ave, LA / NY / TOKYO'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-[#ccff00] mt-1 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold uppercase mb-1">Inquiries</h4>
                    <p className="text-gray-400 font-bold">{content.contact_info?.email || 'INFO@DRIPCARTEL.COM'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-[#ccff00] mt-1 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold uppercase mb-1">Phone</h4>
                    <p className="text-gray-400 font-bold">{content.contact_info?.phone || '+1 800 555 0199'}</p>
                  </div>
                </div>
                
                <div className="pt-8 border-t-2 border-[#333] flex gap-4">
                  <a href={content.contact_info?.instagram || '#'} className="w-12 h-12 bg-black border-2 border-[#333] hover:border-[#ccff00] text-gray-400 hover:text-[#ccff00] flex items-center justify-center transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href={content.contact_info?.facebook || '#'} className="w-12 h-12 bg-black border-2 border-[#333] hover:border-[#ccff00] text-gray-400 hover:text-[#ccff00] flex items-center justify-center transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href={content.contact_info?.twitter || '#'} className="w-12 h-12 bg-black border-2 border-[#333] hover:border-[#ccff00] text-gray-400 hover:text-[#ccff00] flex items-center justify-center transition-colors">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
              <div className="w-full h-80 md:h-auto border-2 border-[#333] grayscale overflow-hidden hover:grayscale-0 transition-all duration-500">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '123 Streetwear Ave, LA / NY / TOKYO')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy">
                </iframe>
              </div>
            </div>
          </section>
        );

        if (sectionId === 'custom') return (
          <section key="custom" id="custom" className="p-6 md:p-12 border-b-2 border-[#333] bg-[#0A0A0A] text-center flex flex-col items-center py-24">
            {content.custom_blocks_json && content.custom_blocks_json.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-12 w-full flex flex-col items-center">
                {content.custom_blocks_json.map((block: any) => {
                  if (block.type === 'heading') {
                    return <h2 key={block.id} className="st-font text-4xl md:text-6xl font-black italic text-[#ccff00] uppercase break-words w-full">{block.content}</h2>;
                  }
                  if (block.type === 'paragraph') {
                    return <p key={block.id} className="text-xl font-bold text-gray-400 break-words whitespace-pre-wrap w-full">{block.content}</p>;
                  }
                  if (block.type === 'image') {
                    return block.url ? <img key={block.id} src={block.url} alt="Custom content" className="w-full h-auto border-4 border-[#333] grayscale hover:grayscale-0 transition-all duration-500" /> : null;
                  }
                  if (block.type === 'divider') {
                    return <div key={block.id} className="w-24 h-2 bg-[#ccff00] mx-auto my-8"></div>;
                  }
                  return null;
                })}
              </div>
            ) : (
              <>
                <h2 className="st-font text-5xl md:text-7xl font-black italic mb-6 break-words max-w-4xl">{content.settings_json?.custom_title || 'ONLY THE REALEST'}</h2>
                <p className="text-xl md:text-2xl font-bold text-gray-400 max-w-2xl mb-8 break-words">{content.settings_json?.custom_description || 'Join the underground. Never conform. Wear what matters.'}</p>
                <button className="st-brutal-btn px-12 py-4 font-black text-xl uppercase tracking-widest">
                  {content.settings_json?.custom_button || 'STAY CONNECTED'}
                </button>
              </>
            )}
          </section>
        );

        return null;
      })}
      
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
      <footer className="p-6 md:p-12 bg-[#0A0A0A]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-2 border-[#333] p-8 md:p-12">
          <div>
            {content.settings_json?.logo_image && (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-[#ccff00] mb-6" />
            )}
            <h3 className="st-font text-4xl font-black italic text-[#ccff00] mb-6">{siteName}</h3>
          </div>
          <div className="flex flex-col md:items-end justify-between">
            <div className="text-left md:text-right font-bold text-gray-400 space-y-2 uppercase">
              <p className="break-words">{content.contact_info?.address || 'LA / NY / TOKYO'}</p>
              <p className="break-words">{content.contact_info?.hours || 'MON-SAT: 11AM - 8PM'}</p>
              <p className="break-words">{content.contact_info?.email || 'INFO@DRIPCARTEL.COM'}</p>
            </div>
            <div className="flex gap-6 mt-8 md:mt-0">
              <a href={content.contact_info?.instagram || '#'} className="w-12 h-12 border-2 border-[#333] flex items-center justify-center hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedProduct(null)}>
          <div className="st-brutal-card w-full max-w-4xl flex flex-col md:flex-row relative max-h-[85vh] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-[#ccff00] text-[#ccff00] flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-colors" onClick={() => setSelectedProduct(null)}>
              <X size={20} />
            </button>
            <div className="w-full md:w-1/2 h-64 md:h-auto p-4 md:p-12 bg-[#0A0A0A] border-b-2 md:border-b-0 md:border-r-2 border-[#333]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-white text-black font-bold px-3 py-1 text-xs md:text-sm self-start mb-4 md:mb-6 uppercase">Drop 01</div>
              <h2 className="st-font text-3xl md:text-5xl font-black uppercase mb-2 md:mb-4 break-words">{selectedProduct.name}</h2>
              <p className="text-2xl md:text-3xl font-black text-[#ccff00] mb-6 md:mb-8">{selectedProduct.price}</p>
              <p className="text-gray-400 font-bold text-sm md:text-base mb-6 md:mb-8 uppercase leading-relaxed break-words">{selectedProduct.description}</p>
              
              <div className="space-y-4">
                <p className="font-bold uppercase text-sm">Size</p>
                <div className="flex gap-2 md:gap-4">
                  {['S', 'M', 'L', 'XL'].map(s => (
                    <button key={s} className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#333] hover:border-[#ccff00] font-black">{s}</button>
                  ))}
                </div>
              </div>

              <button className="st-brutal-btn w-full mt-8 md:mt-12 py-3 md:py-4 font-black text-lg md:text-xl uppercase tracking-widest" onClick={() => setSelectedProduct(null)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Products Page */}
      {viewProductsPage && (
        <div className="fixed inset-0 z-[200] bg-[#0A0A0A] overflow-y-auto p-6 md:p-12">
          <button className="fixed top-6 right-6 md:top-12 md:right-12 z-50 w-12 h-12 bg-black border-2 border-[#ccff00] text-[#ccff00] flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-colors" onClick={() => setViewProductsPage(false)}>
            <X size={24} />
          </button>
          
          <div className="max-w-7xl mx-auto pt-12 md:pt-0">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Zap size={32} className="text-[#ccff00] mb-2" />
                <h2 className="st-font text-4xl md:text-6xl font-black italic">ALL DROPS</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p: any, i: number) => (
                <div key={i} className="st-brutal-card flex flex-col group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="w-full aspect-[4/5] bg-[#0A0A0A] overflow-hidden border-b-2 border-[#333] group-hover:border-[#ccff00] transition-colors p-4 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="st-font font-bold text-xl uppercase mb-2 flex-1 break-words">{p.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[#ccff00] font-black text-xl">{p.price}</span>
                      <button className="bg-[#333] text-white w-10 h-10 flex items-center justify-center font-black group-hover:bg-[#ccff00] group-hover:text-black transition-colors">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-12 h-12 bg-black border-2 border-[#ccff00] text-[#ccff00] flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-colors" onClick={() => setSelectedGalleryImage(null)}>
            <X size={24} />
          </button>
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain border-4 border-[#333]" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

