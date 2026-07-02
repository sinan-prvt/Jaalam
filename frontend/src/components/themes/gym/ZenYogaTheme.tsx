import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, ChevronRight, X, Heart, Wind, Sunrise, Leaf, Menu } from 'lucide-react';

/* ─── Intersection-observer fade-in ─── */
function FadeIn({ children, delay = 0, dir = 'up', className = '' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right'; className?: string }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const init = dir === 'left' ? 'opacity-0 -translate-x-8' : dir === 'right' ? 'opacity-0 translate-x-8' : 'opacity-0 translate-y-8';
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[1500ms] ease-out ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init} ${className}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function ZenYogaTheme({ website, content }: Props) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewProductsPage, setViewProductsPage] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'Zen Yoga Studio';
  const address   = content.contact_info?.address || '101 Serenity Path, Wellness Valley';

  /* ─── Palette ─── */
  const SAGE_GREEN = '#8CA392';
  const SAND       = '#F4F1EA';
  const BONE       = '#FFFFFF';
  const FOREST     = '#2C402E';
  const TAUPE      = '#A89E92';

  /* ─── Data ─── */
  const defaultProducts = [
    { name: 'Eco Yoga Mat', time: 'Gear', price: '?89', rating: 4.8, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=500&q=80', description: 'Sustainable, non-slip cork yoga mat for your daily practice.' },
    { name: 'Meditation Cushion', time: 'Accessories', price: '?45', rating: 4.9, image: 'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=500&q=80', description: 'Organic cotton zafu cushion for comfortable seated meditation.' },
    { name: 'Aromatherapy Set', time: 'Wellness', price: '?65', rating: 5.0, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80', description: 'Essential oils set to cleanse your space and clear your mind.' },
  ];

  const products = content.products_json?.length > 0 ? content.products_json.map((p: any) => ({
    name: p.name || p.title || 'Wellness Product',
    price: p.price || '?0',
    time: p.subtitle || '',
    description: p.description || 'Premium wellness item.',
    rating: 5.0,
    image: p.image || defaultProducts[0].image,
  })) : defaultProducts;

  const defaultServices = [
    { title: 'Vinyasa Flow', description: 'Synchronize movement with breath in this dynamic, flowing class.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' },
    { title: 'Restorative Yin', description: 'Deep, prolonged stretching to target fascia and calm the mind.', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80' },
    { title: 'Guided Meditation', description: 'Find your center with focused mindfulness techniques.', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80' }
  ];

  const studioServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80';

  let galleryImages = content.gallery_json?.length > 0 ? content.gallery_json.map((img: string) => img || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80') : [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80'
  ];


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap');

        .zy-heading { font-family: 'Cormorant Garamond', serif; }
        .zy-body { font-family: 'Jost', sans-serif; font-weight: 300; }
        .zy-subheading { font-family: 'Jost', sans-serif; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500; }

        .zy-bg-sand { background-color: ${SAND}; color: ${FOREST}; }
        .zy-bg-bone { background-color: ${BONE}; color: ${FOREST}; }
        .zy-bg-forest { background-color: ${FOREST}; color: ${SAND}; }
        .zy-text-sage { color: ${SAGE_GREEN}; }
        .zy-text-taupe { color: ${TAUPE}; }

        .zy-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2.5rem;
          background-color: ${SAGE_GREEN};
          color: ${BONE};
          border-radius: 999px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Jost', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          border: 1px solid ${SAGE_GREEN};
        }
        .zy-btn:hover {
          background-color: ${FOREST};
          border-color: ${FOREST};
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(44, 64, 46, 0.1);
        }
        .zy-btn-outline {
          background-color: transparent;
          color: ${FOREST};
          border: 1px solid ${FOREST};
        }
        .zy-btn-outline:hover {
          background-color: ${FOREST};
          color: ${BONE};
        }

        .zy-card {
          background-color: ${BONE};
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.5s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .zy-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(44, 64, 46, 0.08);
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${SAND}; }
        ::-webkit-scrollbar-thumb { background: ${SAGE_GREEN}; border-radius: 10px; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="zy-body w-full min-h-screen overflow-x-hidden zy-bg-sand">

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 md:px-12 py-6 flex items-center justify-between absolute top-0 z-50 bg-white/20 backdrop-blur-md">
          <div className="zy-heading text-3xl text-[#2C402E] flex items-center gap-2">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 object-cover rounded-full shadow-md" />
            ) : (
              <Leaf size={24} className="text-[#8CA392]" />
            )}
            <span className="font-light">{siteName}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 zy-subheading text-xs text-gray-700">
            {['About', 'Classes', 'Pricing', 'Gallery', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#8CA392] transition-colors relative group">
                {l}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8CA392] opacity-0 transition-opacity group-hover:opacity-100"></span>
              </a>
            ))}
          </nav>
          
          <button className="md:hidden text-gray-800 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#F4F1EA] pt-24 px-6 flex flex-col gap-8 text-center">
            {['About', 'Classes', 'Pricing', 'Gallery', 'Contact'].map(l => (
              <a 
                key={l} 
                href={`#${l.toLowerCase()}`} 
                className="zy-heading text-3xl text-gray-800 hover:text-[#8CA392] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {l}
              </a>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════ */}
        {!hiddenSections.includes('hero') && (
          <div className="relative min-h-[90svh] flex flex-col justify-center items-center text-center px-6 pt-32 pb-16 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#F4F1EA]/50 via-transparent to-[#F4F1EA]"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <FadeIn delay={0}>
                <Wind size={40} className="text-[#8CA392] mb-8" />
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="zy-heading text-6xl md:text-8xl lg:text-[7rem] text-[#2C402E] mb-6 leading-tight font-light break-words">
                  {content.hero_title || content.settings_json?.hero_title || 'Breathe. Flow. Be.'}
                </h1>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed break-words whitespace-pre-wrap">
                  {(() => {
                    const t = content.about_text || content.settings_json?.hero_description || content.hero_text;
                    if (!t || t === 'Add your business description here.' || t.trim() === '') {
                      return 'Discover tranquility and strength in our serene oasis. A space dedicated to mindful movement and inner peace.';
                    }
                    return t;
                  })()}
                </p>
              </FadeIn>

              <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="zy-btn" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                    Start Your Journey
                  </button>
                  <button className="zy-btn zy-btn-outline" onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}>
                    View Schedule
                  </button>
                </div>
              </FadeIn>
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        {sectionOrder.map(sectionId => {
          if (hiddenSections.includes(sectionId)) return null;

          switch (sectionId) {
            
            /* ── ABOUT ── */
            case 'about': return (
              <section key="about" id="about" className="py-24 md:py-32 px-6 zy-bg-bone">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <FadeIn dir="left">
                      <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4]">
                        <img src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800&q=80" alt="About Studio" className="w-full h-full object-cover" />
                      </div>
                    </FadeIn>
                    <FadeIn dir="right">
                      <div>
                        <span className="zy-subheading text-[#8CA392] text-xs mb-4 block">Our Philosophy</span>
                        <h2 className="zy-heading text-4xl md:text-6xl text-[#2C402E] mb-8 font-light leading-tight break-words">
                          {content.settings_json?.about_title || 'Sanctuary For The Soul'}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 break-words whitespace-pre-wrap">
                          {(() => {
                            const t = content.settings_json?.about_description || content.about_text;
                            if (!t || t === 'Add your business description here.' || t.trim() === '') {
                              return 'We believe that yoga is for everyone. Our studio offers a warm, inclusive environment where you can disconnect from the outside world and reconnect with yourself through mindful movement and breath.';
                            }
                            return t;
                          })()}
                        </p>
                        <div className="flex items-center gap-6 text-[#A89E92]">
                          <div className="flex flex-col items-center gap-2">
                            <Sunrise size={32} strokeWidth={1} />
                            <span className="zy-subheading text-[10px]">Morning Flow</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <Wind size={32} strokeWidth={1} />
                            <span className="zy-subheading text-[10px]">Breathwork</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <Heart size={32} strokeWidth={1} />
                            <span className="zy-subheading text-[10px]">Community</span>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </section>
            );

            /* ── SERVICES (CLASSES) ── */
            case 'services': return (
              <section key="services" id="classes" className="py-24 md:py-32 px-6 zy-bg-sand">
                <div className="max-w-6xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-20">
                      <span className="zy-subheading text-[#8CA392] text-xs mb-4 block">Practice With Us</span>
                      <h2 className="zy-heading text-4xl md:text-6xl text-[#2C402E] font-light">Class Offerings</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {studioServices.map((s: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150} dir="up">
                        <div 
                          className="zy-card group cursor-pointer h-full flex flex-col"
                          onClick={() => setSelectedService(s)}
                        >
                          <div className="h-64 relative overflow-hidden p-3 pb-0">
                            <div className="w-full h-full rounded-t-[1.25rem] overflow-hidden relative">
                              {s.image ? (
                                <img src={s.image} alt={s.title || s.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-full bg-[#F4F1EA] flex items-center justify-center">
                                  <Leaf size={48} className="text-[#8CA392] opacity-50" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="p-8 text-center flex-1 flex flex-col items-center">
                            <h3 className="zy-heading text-2xl text-[#2C402E] mb-4 break-words">{s.title || s.name}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 min-w-0 break-words whitespace-pre-wrap">{s.description}</p>
                            <span className="zy-subheading text-xs text-[#8CA392] flex items-center gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              Learn More <ChevronRight size={14} />
                            </span>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── MENU / PRICING ── */
            case 'menu': return (
              <section key="menu" id="pricing" className="py-24 md:py-32 px-6 zy-bg-bone">
                <div className="max-w-5xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-20">
                      <span className="zy-subheading text-[#8CA392] text-xs mb-4 block">Nourish Your Practice</span>
                      <h2 className="zy-heading text-4xl md:text-6xl text-[#2C402E] font-light">Wellness Products</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.slice(0, 3).map((product: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150} dir="up" className="flex-1 w-full">
                        <div
                          className={`rounded-[2rem] flex flex-col items-center text-center h-full transition-transform duration-500 hover:-translate-y-2 overflow-hidden ${idx === 1 ? 'bg-[#2C402E] text-white shadow-2xl' : 'bg-[#F4F1EA] text-[#2C402E]'}`}
                        >
                          <div className="w-full h-48 bg-white/20">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-8 w-full flex flex-col items-center flex-1">
                            <h3 className="zy-heading text-3xl mb-2 break-words">{product.name}</h3>
                            <p className={`text-sm mb-6 break-words ${idx === 1 ? 'text-[#8CA392]' : 'text-gray-500'}`}>{product.time}</p>
                            
                            <div className="text-5xl font-light mb-6 break-words">
                              {product.price}
                            </div>
                            
                            <p className={`text-sm leading-relaxed mb-8 flex-1 min-w-0 break-words whitespace-pre-wrap ${idx === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                              {product.description}
                            </p>
                            
                            <button 
                              onClick={() => setSelectedProduct(product)}
                              className={`w-full py-4 rounded-full zy-subheading text-xs transition-colors border ${idx === 1 ? 'bg-[#8CA392] border-[#8CA392] text-white hover:bg-transparent hover:text-white' : 'bg-transparent border-[#2C402E] text-[#2C402E] hover:bg-[#2C402E] hover:text-white'}`}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>

                  {products.length > 0 && (
                    <FadeIn delay={200} dir="up">
                      <div className="mt-16 text-center">
                        <button
                          className="zy-btn border border-[#2C402E] bg-transparent text-[#2C402E] hover:bg-[#2C402E] hover:text-white px-12 py-4 text-lg inline-block rounded-full"
                          onClick={() => setViewProductsPage(true)}
                        >
                          <span>VIEW ALL PRODUCTS</span>
                        </button>
                      </div>
                    </FadeIn>
                  )}
                </div>
              </section>
            );

            /* ── GALLERY ── */
            case 'gallery': return (
              <section key="gallery" id="gallery" className="py-24 md:py-32 px-4 zy-bg-sand">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-16">
                      <h2 className="zy-heading text-4xl md:text-6xl text-[#2C402E] font-light">Studio Spaces</h2>
                    </div>
                  </FadeIn>

                  <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div
                          onClick={() => setSelectedImage(img)}
                          className="cursor-pointer group overflow-hidden rounded-2xl break-inside-avoid relative"
                        >
                          <img src={img} alt={`Studio ${idx + 1}`} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-[#2C402E]/0 group-hover:bg-[#2C402E]/20 transition-colors duration-300"></div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── CONTACT ── */
            case 'contact': return (
              <section key="contact" id="contact" className="py-24 md:py-32 px-6 zy-bg-forest relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8CA392]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                  <FadeIn dir="left">
                    <div>
                      <h2 className="zy-heading text-4xl md:text-6xl text-[#F4F1EA] mb-8 font-light">Reach Out</h2>
                      <p className="text-[#8CA392] mb-12 font-light text-lg">We would love to welcome you to our community. Send us a message or visit the studio.</p>
                      
                      <div className="space-y-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full border border-[#8CA392]/30 flex items-center justify-center shrink-0">
                            <MapPin className="text-[#8CA392]" size={20} />
                          </div>
                          <div className="flex-1 min-w-0 break-words">
                            <p className="text-[#F4F1EA] font-light">{address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full border border-[#8CA392]/30 flex items-center justify-center shrink-0">
                            <Phone className="text-[#8CA392]" size={20} />
                          </div>
                          <div className="flex-1 min-w-0 break-words">
                            <p className="text-[#F4F1EA] font-light">{content.contact_info?.phone || '(555) 123-4567'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full border border-[#8CA392]/30 flex items-center justify-center shrink-0">
                            <Mail className="text-[#8CA392]" size={20} />
                          </div>
                          <div className="flex-1 min-w-0 break-words">
                            <p className="text-[#F4F1EA] font-light">{content.contact_info?.email || 'namaste@zenyoga.com'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full border border-[#8CA392]/30 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8CA392]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          </div>
                          <div className="flex-1 min-w-0 break-words">
                            <p className="text-[#F4F1EA] font-light whitespace-pre-line">{content.contact_info?.hours || "MON-FRI: 06:00-20:00\nSAT-SUN: 08:00-18:00"}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <a href={content.contact_info?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#8CA392]/30 flex items-center justify-center text-[#8CA392] hover:bg-[#8CA392] hover:text-[#2C402E] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                          <a href={content.contact_info?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#8CA392]/30 flex items-center justify-center text-[#8CA392] hover:bg-[#8CA392] hover:text-[#2C402E] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          <a href={content.contact_info?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#8CA392]/30 flex items-center justify-center text-[#8CA392] hover:bg-[#8CA392] hover:text-[#2C402E] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                </FadeIn>
                  
                    <FadeIn dir="right">
                      <div className="w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden border border-[#8CA392]/30 relative shadow-2xl">
                         <iframe 
                           src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                           width="100%" 
                           height="100%" 
                           style={{ border: 0 }} 
                           allowFullScreen={false} 
                           loading="lazy" 
                           referrerPolicy="no-referrer-when-downgrade" 
                           className="w-full h-full filter grayscale opacity-70 hover:opacity-90 transition-opacity duration-300"
                         ></iframe>
                      </div>
                    </FadeIn>
                </div>
              </section>
            );

            /* ── CUSTOM ── */
            case 'custom':
              if (!content.custom_blocks_json || content.custom_blocks_json.length === 0) return null;
              return (
                <section key="custom" id="custom" className="py-24 md:py-32 px-6 zy-bg-bone">
                  <div className="max-w-4xl mx-auto space-y-12">
                    {content.custom_blocks_json.map((block: any) => {
                      switch (block.type) {
                        case 'heading':
                          return <h2 key={block.id} className="zy-heading text-4xl md:text-5xl text-[#2C402E] font-light text-center break-words whitespace-pre-wrap">{block.content}</h2>;
                        case 'paragraph':
                          return <p key={block.id} className="text-[#2C402E]/70 font-light text-lg leading-relaxed text-center break-words whitespace-pre-wrap">{block.content}</p>;
                        case 'image':
                          return (
                            <div key={block.id} className="w-full relative overflow-hidden rounded-[2rem] shadow-sm my-8">
                              <img src={block.url} alt="Custom" className="w-full h-auto object-cover" />
                            </div>
                          );
                        case 'divider':
                          return (
                            <div key={block.id} className="flex items-center justify-center py-8">
                              <div className="w-16 h-[1px] bg-[#8CA392]/50"></div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </section>
              );

            default: return null;
          }
        })}

        {/* ═══════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        
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

      <footer className="zy-bg-bone py-12 px-6 text-center text-[#2C402E]">
          <div className="max-w-4xl mx-auto">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-md mx-auto mb-6" />
            ) : (
              <Leaf size={32} className="text-[#8CA392] mx-auto mb-6" />
            )}
            <h4 className="zy-heading text-3xl mb-8 font-light">{siteName}</h4>
            
            <div className="flex flex-wrap justify-center gap-8 zy-subheading text-[10px] mb-12">
              {['About', 'Classes', 'Pricing', 'Gallery', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#8CA392] transition-colors">{l}</a>
              ))}
            </div>

            <p className="text-gray-500 text-xs font-light">
              © {new Date().getFullYear()} {siteName}. All rights reserved.<br/>
              <span className="opacity-50 mt-2 inline-block">Powered by Jaalam</span>
            </p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            MODALS
        ════════════════════════════════════════ */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#2C402E]/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)}>
            <div
              className="w-full max-w-[320px] md:max-w-sm bg-[#F4F1EA] rounded-[2rem] text-center relative shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 text-[#2C402E] hover:bg-white rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <div className="h-40 md:h-48 w-full relative shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-10 overflow-y-auto shrink">
                <h3 className="zy-heading text-4xl text-[#2C402E] mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-500 mb-8">{selectedProduct.price}</p>
                <p className="text-gray-600 font-light leading-relaxed mb-10">{selectedProduct.description}</p>

                <button
                  className="zy-btn w-full"
                  onClick={() => { setSelectedProduct(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#2C402E]/60 backdrop-blur-md" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-[320px] md:max-w-sm bg-[#F4F1EA] rounded-[2rem] text-center relative shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 text-[#2C402E] hover:bg-white rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <div className="h-40 md:h-48 w-full relative shrink-0">
                {selectedService.image ? (
                  <img src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#8CA392]/20 flex items-center justify-center">
                    <Wind size={40} className="text-[#8CA392]" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 pb-8 md:pb-10 overflow-y-auto shrink">
                <h3 className="zy-heading text-3xl text-[#2C402E] mb-4">{selectedService.title || selectedService.name}</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-8">{selectedService.description}</p>
                <button
                  className="zy-btn w-full"
                  onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div 
            className="fixed inset-0 z-[200] bg-[#2C402E]/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {viewProductsPage && (
          <div className="fixed inset-0 z-[300] bg-[#F4F1EA] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="min-h-screen theme-root flex flex-col py-24 px-6 relative">
              <button onClick={() => setViewProductsPage(false)} className="absolute top-8 right-8 text-[#2C402E] hover:text-[#8CA392] zy-subheading tracking-widest flex items-center gap-2 transition-colors">
                CLOSE <X size={24} />
              </button>
              
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <span className="zy-subheading text-[#8CA392] text-xs mb-4 block">Nourish Your Practice</span>
                  <h2 className="zy-heading text-4xl md:text-6xl text-[#2C402E] font-light">All Products</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-[2rem] flex flex-col items-center text-center shadow-lg transition-transform hover:-translate-y-2 overflow-hidden">
                      <div className="w-full h-48 bg-gray-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-10 w-full flex flex-col items-center flex-1">
                        <h3 className="zy-heading text-3xl mb-2 text-[#2C402E] break-words whitespace-pre-wrap">{product.name}</h3>
                        <p className="text-sm mb-6 text-[#8CA392] break-words whitespace-pre-wrap">{product.time}</p>
                        <div className="text-5xl font-light mb-6 text-[#2C402E] break-words whitespace-pre-wrap">{product.price}</div>
                        <p className="text-sm leading-relaxed mb-8 flex-1 text-gray-600 break-words whitespace-pre-wrap">{product.description}</p>
                        <button 
                          onClick={() => { setViewProductsPage(false); setSelectedProduct(product); }}
                          className="w-full py-4 rounded-full zy-subheading text-xs transition-colors border bg-transparent border-[#2C402E] text-[#2C402E] hover:bg-[#2C402E] hover:text-white"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

