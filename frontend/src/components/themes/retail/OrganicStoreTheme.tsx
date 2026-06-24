import React, { useState } from 'react';
import { Leaf, ShoppingBag, Search, Menu, X } from 'lucide-react';

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const WhatsApp = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.525.146-.18.194-.3.297-.495.099-.21.05-.39-.025-.54-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.095 3.2 5.076 4.485.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.426.248-.705.248-1.31.173-1.426-.074-.115-.272-.18-.572-.33z" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.756.453 3.409 1.248 4.862L2 22l5.297-1.164A9.957 9.957 0 0012 22z" /></svg>
);

export default function OrganicStoreTheme({ website, content }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const siteName = content.settings_json?.website_name || website.slug || 'EARTH BOUND';

  const defaultProducts = [
    { name: 'Organic Matcha Powder', price: '₹24', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Ceremonial grade matcha from Uji, Japan.' },
    { name: 'Rosewater Mist', price: '₹18', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Hydrating facial mist with pure rose extract.' },
    { name: 'Hemp Seed Oil', price: '₹32', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Cold-pressed organic hemp seed oil.' },
    { name: 'Bamboo Brush Set', price: '₹28', image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Zero-waste bamboo toothbrushes.' },
    { name: 'Lavender Bath Salts', price: '₹22', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Relaxing bath salts infused with organic lavender.' },
    { name: 'Clay Face Mask', price: '₹30', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Detoxifying natural clay mask for all skin types.' },
    { name: 'Organic Cotton Towel', price: '₹35', image: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Ultra-soft, 100% organic cotton bath towel.' },
    { name: 'Eco-Friendly Soap', price: '₹15', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Handcrafted soap with natural essential oils.' }
  ];

  const products = content.products_json?.length > 0 ? content.products_json : defaultProducts;
  const hiddenSections = content.settings_json?.hidden_sections || [];

  const defaultServices = [
    { title: 'Organic Sourcing', description: 'Partnering directly with local organic farmers.', image: 'https://images.unsplash.com/photo-1502301197179-65228ab57f78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Zero Waste Packaging', description: 'All products use 100% biodegradable or recyclable materials.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Carbon Neutral Shipping', description: 'We offset 100% of carbon emissions from our deliveries.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
  ];
  const services = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const defaultGallery = [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json : defaultGallery;

  const sectionOrder: string[] = content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A5D23] selection:bg-[#4A5D23] selection:text-white flex flex-col font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        .os-heading { font-family: 'Lora', serif; }
        .os-body { font-family: 'Outfit', sans-serif; }
        
        .os-blob-1 {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 8s ease-in-out infinite;
        }
        .os-blob-2 {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: morph 8s ease-in-out infinite reverse;
        }
        
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        .os-card-hover {
          transition: all 0.4s ease;
        }
        .os-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(74, 93, 35, 0.08);
        }
      `}</style>

      {/* Decorative Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#E8EDDF] os-blob-1 z-0 opacity-50 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F5E6D3] os-blob-2 z-0 opacity-50 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-50 py-6 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {content.settings_json?.logo_image ? (
            <img src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <Leaf className="text-[#8B5A2B]" size={28} />
          )}
          <span className="os-heading font-semibold text-2xl tracking-wide text-[#8B5A2B]">{siteName}</span>
        </div>

        <nav className="hidden md:flex gap-8 lg:gap-10 os-body font-medium text-[#4A5D23]">
          <a href="#about" className="hover:text-[#8B5A2B] transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full"></span>
          </a>
          <a href="#services" className="hover:text-[#8B5A2B] transition-colors relative group">
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full"></span>
          </a>
          <a href="#shop" className="hover:text-[#8B5A2B] transition-colors relative group">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full"></span>
          </a>
          <a href="#gallery" className="hover:text-[#8B5A2B] transition-colors relative group">
            Gallery
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full"></span>
          </a>
          <a href="#contact" className="hover:text-[#8B5A2B] transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full"></span>
          </a>
        </nav>

        <div className="flex items-center gap-6 text-[#4A5D23]">
          <Search size={22} className="hidden md:block cursor-pointer hover:text-[#8B5A2B] transition-colors" />
          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#FDFBF7] z-[60] flex flex-col p-8">
          <button className="self-end text-[#8B5A2B] mb-12" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          <nav className="flex flex-col gap-6 os-heading text-4xl text-[#4A5D23] text-center">
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#shop" onClick={() => setIsMenuOpen(false)}>Shop</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </nav>
        </div>
      )}

      {sectionOrder.map((sectionId) => {
        if (hiddenSections.includes(sectionId)) return null;

        if (sectionId === 'hero') return (
          <section key="hero" id="hero" className="relative z-10 py-12 md:py-24 px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto w-full">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="os-heading text-5xl md:text-7xl font-semibold mb-6 text-[#4A5D23] leading-tight break-words whitespace-pre-wrap">
                {content.hero_title || 'Pure & Natural.'}
              </h1>
              <p className="os-body text-lg md:text-xl text-[#6B705C] mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed break-words whitespace-pre-wrap">
                {content.about_text || 'Sustainable products for a mindful lifestyle. Sourced ethically from nature.'}
              </p>
              <a href="#shop" className="inline-block bg-[#4A5D23] text-white os-body font-medium px-8 py-4 rounded-full hover:bg-[#3A4A1C] transition-colors shadow-lg shadow-[#4A5D23]/20">
                Explore Collection
              </a>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/5] md:aspect-square relative overflow-hidden os-blob-1 border-4 border-white shadow-xl">
                <img
                  src={content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#E8EDDF] rounded-full mix-blend-multiply opacity-70 blur-xl"></div>
            </div>
          </section>
        );

        if (sectionId === 'about') return (
          <section key="about" id="about" className="relative z-10 py-24 px-6 md:px-12 bg-[#4A5D23] text-[#FDFBF7]">
            <div className="max-w-4xl mx-auto text-center">
              <Leaf className="mx-auto mb-8 opacity-80" size={40} />
              <h2 className="os-heading text-4xl md:text-5xl font-semibold mb-8 leading-snug break-words whitespace-pre-wrap">
                {content.settings_json?.about_title || 'Rooted in Nature'}
              </h2>
              <p className="os-body text-lg text-[#E8EDDF] leading-relaxed max-w-2xl mx-auto break-words whitespace-pre-wrap">
                {content.settings_json?.about_description || 'We believe that what goes on your body and in your home should be as close to nature as possible. Our commitment is to provide 100% organic, cruelty-free, and sustainably sourced goods.'}
              </p>
            </div>
          </section>
        );

        if (sectionId === 'services') return (
          <section key="services" id="services" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="os-heading text-4xl text-[#4A5D23] mb-4">Our Commitment</h2>
              <p className="os-body text-[#6B705C]">How we care for you and the planet.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {services.map((srv: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="aspect-square mx-auto max-w-[200px] rounded-full overflow-hidden mb-8 border-4 border-[#E8EDDF]">
                    <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="os-heading text-2xl font-semibold text-[#4A5D23] mb-4">{srv.title}</h3>
                  <p className="os-body text-[#6B705C] leading-relaxed">{srv.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

        if (sectionId === 'menu') return (
          <section key="menu" id="shop" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="os-heading text-4xl text-[#4A5D23] mb-4">Daily Essentials</h2>
              <p className="os-body text-[#6B705C]">Mindfully crafted for your wellbeing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((p: any, i: number) => (
                <div key={i} className="os-card-hover bg-white rounded-3xl p-4 cursor-pointer border border-[#E8EDDF]" onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#FDFBF7] mb-6">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="os-heading font-semibold text-lg text-[#4A5D23] mb-2 break-words">{p.name}</h3>
                    <p className="os-body font-medium text-[#8B5A2B]">{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
            {products.length > 4 && (
              <div className="mt-12 text-center">
                <button onClick={() => setShowAllProducts(true)} className="inline-block bg-white text-[#4A5D23] border border-[#4A5D23] os-body font-medium px-8 py-3 rounded-full hover:bg-[#FDFBF7] transition-colors shadow-sm">
                  View All Essentials
                </button>
              </div>
            )}
          </section>
        );

        if (sectionId === 'gallery') return (
          <section key="gallery" id="gallery" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[#E8EDDF]/50 rounded-[3rem] my-12">
            <div className="text-center mb-12">
              <h2 className="os-heading text-4xl text-[#4A5D23] mb-4">Our Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.slice(0, 6).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-white cursor-pointer relative group" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#4A5D23]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Search className="text-white drop-shadow-md" size={32} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

        if (sectionId === 'contact') return (
          <section key="contact" id="contact" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="bg-[#4A5D23] rounded-[3rem] p-8 md:p-16 text-[#FDFBF7] flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2 space-y-8">
                <h2 className="os-heading text-4xl md:text-5xl font-semibold">Get in Touch</h2>
                <div className="space-y-4 os-body text-lg text-[#E8EDDF]">
                  <p><strong>Location:</strong> {content.contact_info?.address || 'Green Valley, California'}</p>
                  <p><strong>Email:</strong> {content.contact_info?.email || 'hello@earthbound.com'}</p>
                  <p><strong>Phone:</strong> {content.contact_info?.phone || '+1 800 555 0199'}</p>
                  <p><strong>Hours:</strong> {content.contact_info?.hours || 'Mon-Fri: 9AM - 6PM'}</p>
                </div>
                <div className="flex gap-4 pt-4 text-[#FDFBF7]">
                  <a href={content.contact_info?.instagram || '#'} className="hover:text-[#8B5A2B] transition-colors bg-white/10 p-3 rounded-full"><Instagram size={24} /></a>
                  <a href={content.contact_info?.facebook || '#'} className="hover:text-[#8B5A2B] transition-colors bg-white/10 p-3 rounded-full"><Facebook size={24} /></a>
                  <a href={content.contact_info?.whatsapp || '#'} className="hover:text-[#8B5A2B] transition-colors bg-white/10 p-3 rounded-full"><WhatsApp size={24} /></a>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-64 md:h-96 bg-[#3A4A1C] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                <iframe
                  title="Store Location"
                  className="w-full h-full border-0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Green Valley, California')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </section>
        );

        if (sectionId === 'custom') return (
          <section key="custom" id="custom" className="relative z-10 py-16 px-6 md:px-12 max-w-4xl mx-auto w-full">
            {content.custom_blocks_json?.map((block: any, idx: number) => (
              <div key={idx} className="mb-12 last:mb-0">
                {block.type === 'heading' && <h3 className="os-heading text-3xl font-semibold text-[#4A5D23] mb-6 text-center">{block.content}</h3>}
                {block.type === 'paragraph' && <p className="os-body text-lg text-[#6B705C] leading-relaxed break-words whitespace-pre-wrap text-center">{block.content}</p>}
                {block.type === 'image' && <img src={block.url} alt="Custom" className="w-full rounded-3xl my-8 object-cover shadow-lg" />}
                {block.type === 'divider' && <hr className="my-12 border-t-2 border-[#E8EDDF] w-1/3 mx-auto" />}
              </div>
            ))}
          </section>
        );

        return null;
      })}

      {/* Footer */}
      <footer className="relative z-10 bg-[#F5E6D3] pt-16 pb-8 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#D4C3B3] pt-8">
          <div className="flex items-center gap-2">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <Leaf className="text-[#8B5A2B]" size={20} />
            )}
            <span className="os-heading font-semibold text-lg text-[#8B5A2B]">{siteName}</span>
          </div>
          <div className="flex items-center gap-4 text-[#8B5A2B]">
            <a href={content.contact_info?.instagram || '#'} className="hover:text-[#4A5D23] transition-colors"><Instagram size={20} /></a>
            <a href={content.contact_info?.facebook || '#'} className="hover:text-[#4A5D23] transition-colors"><Facebook size={20} /></a>
            <a href={content.contact_info?.whatsapp || '#'} className="hover:text-[#4A5D23] transition-colors"><WhatsApp size={20} /></a>
          </div>
          <div className="text-center os-body text-sm text-[#8B5A2B]/80">
            &copy; {new Date().getFullYear()} {siteName}. Handcrafted with care.
          </div>
        </div>
      </footer>

      {/* All Products Modal */}
      {showAllProducts && (
        <div className="fixed inset-0 z-[80] bg-[#FDFBF7] overflow-y-auto pt-24 pb-12 px-6 scrollbar-hide">
          <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#E8EDDF] os-blob-1 z-0 opacity-50 pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F5E6D3] os-blob-2 z-0 opacity-50 pointer-events-none"></div>
          <button className="fixed top-6 right-6 z-50 text-[#6B705C] hover:text-[#4A5D23] bg-white rounded-full p-3 shadow-md border border-[#E8EDDF]" onClick={() => setShowAllProducts(false)}>
            <X size={28} />
          </button>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="os-heading text-4xl md:text-5xl text-[#4A5D23] mb-4">Complete Catalog</h2>
              <p className="os-body text-xl text-[#6B705C]">All our natural essentials in one place.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p: any, i: number) => (
                <div key={i} className="os-card-hover bg-white rounded-3xl p-4 cursor-pointer border border-[#E8EDDF]" onClick={() => { setShowAllProducts(false); setSelectedProduct(p); }}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#FDFBF7] mb-6 relative group">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full os-body font-medium text-[#4A5D23] transform translate-y-4 group-hover:translate-y-0 transition-all">
                        View Details
                      </div>
                    </div>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="os-heading font-semibold text-lg text-[#4A5D23] mb-2 break-words">{p.name}</h3>
                    <p className="os-body font-medium text-[#8B5A2B]">{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-[#4A5D23]/90 backdrop-blur-sm flex items-center justify-center p-4 pt-16 md:p-8" onClick={() => setSelectedProduct(null)}>
          <div className="relative w-full max-w-4xl max-h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-12 right-0 md:-top-4 md:-right-12 z-50 text-white hover:text-[#E8EDDF] bg-black/20 p-2 rounded-full transition-colors shrink-0" onClick={() => setSelectedProduct(null)}>
              <X size={32} />
            </button>
            <div className="bg-[#FDFBF7] w-full overflow-y-auto scrollbar-hide rounded-[2rem] flex flex-col md:flex-row shadow-2xl">
              <div className="w-full md:w-1/2 bg-[#E8EDDF] relative flex items-center justify-center p-6 md:p-8 aspect-video md:aspect-auto shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="relative z-10 w-full h-full object-cover rounded-2xl shadow-lg" />
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                <h2 className="os-heading text-2xl md:text-3xl font-semibold text-[#4A5D23] mb-2 break-words">{selectedProduct.name}</h2>
                <div className="os-body text-xl md:text-2xl font-medium text-[#8B5A2B] mb-6">
                  {selectedProduct.price}
                </div>
                <div className="w-10 h-1 bg-[#8B5A2B]/30 rounded-full mb-8"></div>
                <p className="os-body text-[#6B705C] leading-relaxed mb-10 break-words text-lg">{selectedProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[110] bg-[#4A5D23]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 z-50 text-white hover:text-[#E8EDDF] bg-black/20 p-2 rounded-full" onClick={() => setSelectedGalleryImage(null)}>
            <X size={32} />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center relative">
            <img src={selectedGalleryImage} alt="Gallery Full View" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}

