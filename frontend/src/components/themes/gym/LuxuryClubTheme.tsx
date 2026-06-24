import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, ChevronRight, X, HeartPulse, Shield, Star, Droplets, Menu } from 'lucide-react';

/* ─── Intersection-observer fade-in ─── */
function FadeIn({ children, delay = 0, dir = 'up' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const init = dir === 'left' ? 'opacity-0 -translate-x-12' : dir === 'right' ? 'opacity-0 translate-x-12' : 'opacity-0 translate-y-12';
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[1000ms] ease-out ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function LuxuryClubTheme({ website, content }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewProductsPage, setViewProductsPage] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'Equilibrium Club';
  const address   = content.contact_info?.address || '100 Platinum Drive, Beverly Hills';

  /* ─── Palette ─── */
  const WHITE      = '#FFFFFF';
  const NAVY       = '#0A1128';
  const CHAMPAGNE  = '#D4C5B9';
  const LIGHT_GREY = '#F9F9F9';
  const SLATE      = '#4A5568';

  /* ─── Data ─── */
  const defaultProducts = [
    { name: 'Signature Duffel', time: 'Leather', price: '?250', rating: 4.8, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80', description: 'Handcrafted full-grain leather gym bag with bespoke compartments.' },
    { name: 'Wellness Elixir', time: 'Supplement', price: '?85', rating: 5.0, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80', description: 'Our proprietary blend of superfoods and nootropics for peak performance.' },
    { name: 'Cashmere Hoodie', time: 'Apparel', price: '?400', rating: 4.9, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80', description: 'The ultimate post-workout comfort. 100% pure Mongolian cashmere.' },
  ];

  const products = content.products_json?.length > 0 ? content.products_json.map((p: any) => ({
    name: p.name || p.title || 'Collection Item',
    price: p.price || '?0',
    time: p.subtitle || '',
    description: p.description || 'Exclusive club offering.',
    rating: 5.0,
    image: p.image || defaultProducts[1].image,
  })) : defaultProducts;

  const defaultServices = [
    { title: 'Personalized Coaching', description: 'Bespoke fitness programming tailored to your unique physiology and goals.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
    { title: 'Recovery Spa', description: 'Cold plunges, infrared saunas, and sports massage therapy.', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80' },
    { title: 'Pilates Reformer', description: 'Lengthen and strengthen with our world-class Pilates instructors.', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80' }
  ];

  const clubServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1600&q=80';

  let galleryImages = content.gallery_json?.length > 0 ? content.gallery_json.map((img: string) => img || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80') : [
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  ];


  const hiddenSections: string[] = content.settings_json?.hidden_sections || [];
  const sectionOrder: string[] = content.settings_json?.section_order || ['about', 'services', 'menu', 'gallery', 'contact', 'custom'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        .lc-heading { font-family: 'Playfair Display', serif; }
        .lc-body { font-family: 'Montserrat', sans-serif; }
        .lc-subheading { font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem; font-weight: 500; }

        .lc-bg-white { background-color: ${WHITE}; color: ${NAVY}; }
        .lc-bg-navy { background-color: ${NAVY}; color: ${WHITE}; }
        .lc-bg-grey { background-color: ${LIGHT_GREY}; color: ${NAVY}; }
        .lc-text-champagne { color: ${CHAMPAGNE}; }

        .lc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 3rem;
          background-color: ${NAVY};
          color: ${WHITE};
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 0.4s ease;
          border: 1px solid ${NAVY};
        }
        .lc-btn:hover {
          background-color: transparent;
          color: ${NAVY};
        }
        
        .lc-btn-champagne {
          background-color: ${CHAMPAGNE};
          color: ${NAVY};
          border-color: ${CHAMPAGNE};
        }
        .lc-btn-champagne:hover {
          background-color: transparent;
          color: ${CHAMPAGNE};
        }

        .lc-btn-outline {
          background-color: transparent;
          color: ${WHITE};
          border: 1px solid ${WHITE};
        }
        .lc-btn-outline:hover {
          background-color: ${WHITE};
          color: ${NAVY};
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${WHITE}; }
        ::-webkit-scrollbar-thumb { background: ${CHAMPAGNE}; }
        
        .lc-line {
          width: 1px;
          height: 60px;
          background-color: ${CHAMPAGNE};
          margin: 0 auto;
        }
      `}</style>

      <div className="lc-body w-full min-h-screen overflow-x-hidden lc-bg-white selection:bg-[#D4C5B9] selection:text-[#0A1128]">

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 md:px-16 py-8 flex items-center justify-between absolute top-0 z-50">
          <div className="lc-heading text-2xl tracking-widest text-white flex items-center gap-3">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 object-cover rounded-full shadow-md border border-[#D4C5B9]/30" />
            ) : null}
            {siteName.toUpperCase()}
          </div>
          
          <nav className="hidden md:flex items-center gap-12 lc-subheading text-white">
            {['Philosophy', 'Wellness', 'Membership', 'Spaces', 'Inquire'].map((l, i) => {
              const refs = ['about', 'services', 'menu', 'gallery', 'contact'];
              return (
                <a key={l} href={`#${refs[i]}`} className="hover:text-[#D4C5B9] transition-colors relative group">
                  {l}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#D4C5B9] transition-all group-hover:w-full"></span>
                </a>
              );
            })}
          </nav>
          
          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#0A1128] pt-24 px-6 flex flex-col items-center gap-8 text-center">
            {['Philosophy', 'Wellness', 'Membership', 'Spaces', 'Inquire'].map((l, i) => {
              const refs = ['about', 'services', 'menu', 'gallery', 'contact'];
              return (
                <a 
                  key={l} 
                  href={`#${refs[i]}`} 
                  className="lc-heading text-3xl text-white hover:text-[#D4C5B9] transition-colors font-light italic"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {l}
                </a>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════ */}
        {!hiddenSections.includes('hero') && (
          <div className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 pt-32 pb-16">
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover grayscale-[30%] opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A1128]/80 via-[#0A1128]/40 to-[#0A1128]/80"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
              <FadeIn delay={0}>
                <span className="lc-subheading text-[#D4C5B9] block mb-8">ELEVATE YOUR STANDARD</span>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="lc-heading text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[1.1] text-white mb-8 font-light italic break-words">
                  {content.hero_title || content.settings_json?.hero_title || 'Redefining Wellness'}
                </h1>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed break-words whitespace-pre-wrap">
                  {(() => {
                    const t = content.about_text || content.settings_json?.hero_description || content.hero_text;
                    if (!t || t === 'Add your business description here.' || t.trim() === '') {
                      return 'An exclusive sanctuary for those who demand excellence in fitness, recovery, and lifestyle.';
                    }
                    return t;
                  })()}
                </p>
              </FadeIn>

              <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button className="lc-btn lc-btn-champagne" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                    Explore Memberships
                  </button>
                  <button className="lc-btn lc-btn-outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                    Discover More
                  </button>
                </div>
              </FadeIn>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
              <div className="lc-line opacity-50"></div>
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        {sectionOrder.map(sectionId => {
          if (hiddenSections.includes(sectionId)) return null;

          switch (sectionId) {
            
            /* ── ABOUT ── */
            case 'about': return (
              <section key="about" id="about" className="py-24 md:py-32 px-6 lc-bg-white relative">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                  <FadeIn dir="left">
                    <div className="relative p-4">
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 border-t border-l border-[#D4C5B9]"></div>
                      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-b border-r border-[#D4C5B9]"></div>
                      <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80" alt="Club Interior" className="relative z-10 w-full aspect-[4/5] object-cover" />
                    </div>
                  </FadeIn>
                  <FadeIn dir="right">
                    <div>
                      <span className="lc-subheading text-[#D4C5B9] mb-4 block">The Philosophy</span>
                      <h2 className="lc-heading text-4xl md:text-6xl text-[#0A1128] mb-8 font-light italic leading-tight break-words">
                        {content.settings_json?.about_title || 'A Curated Experience'}
                      </h2>
                      <p className="lc-body text-gray-600 text-sm leading-loose mb-10 font-light break-words whitespace-pre-wrap">
                        {(() => {
                          const t = content.settings_json?.about_description || content.about_text;
                          if (!t || t === 'Add your business description here.' || t.trim() === '') {
                            return 'We believe that true wellness lies at the intersection of vigorous physical training and restorative holistic recovery. Our club is designed with immaculate attention to detail, offering a space where ambition meets tranquility.';
                          }
                          return t;
                        })()}
                      </p>
                      
                      <div className="space-y-6">
                        {[
                          { title: 'World-Class Equipment', desc: 'Curated selection of the finest fitness technology.' },
                          { title: 'Holistic Recovery', desc: 'Comprehensive spa services to rejuvenate mind and body.' },
                        ].map((feat, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-[1px] bg-[#D4C5B9] mt-2 mb-2"></div>
                            <div>
                              <h4 className="lc-subheading text-[#0A1128] mb-1">{feat.title}</h4>
                              <p className="text-xs text-gray-500 font-light">{feat.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </section>
            );

            /* ── SERVICES ── */
            case 'services': return (
              <section key="services" id="services" className="py-24 md:py-32 px-6 lc-bg-grey">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-20">
                      <span className="lc-subheading text-[#D4C5B9] mb-4 block">Our Offerings</span>
                      <h2 className="lc-heading text-4xl md:text-5xl text-[#0A1128] font-light italic">Pillars of Wellness</h2>
                      <div className="lc-line mt-8"></div>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {clubServices.map((s: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150}>
                        <div 
                          className="group cursor-pointer flex flex-col h-full bg-white p-6 shadow-sm hover:shadow-xl transition-shadow duration-500"
                          onClick={() => setSelectedService(s)}
                        >
                          <div className="aspect-[4/3] overflow-hidden mb-6 relative">
                            {s.image ? (
                              <img src={s.image} alt={s.title || s.name} className="w-full h-full object-cover grayscale-[20%] transition-transform duration-1000 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full bg-[#F9F9F9] flex items-center justify-center">
                                <HeartPulse size={48} className="text-[#D4C5B9]" strokeWidth={1} />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-[#0A1128]/0 group-hover:bg-[#0A1128]/10 transition-colors duration-500"></div>
                          </div>
                          <div className="flex-1 flex flex-col text-center">
                            <h3 className="lc-heading text-2xl text-[#0A1128] mb-3 break-words">{s.title || s.name}</h3>
                            <p className="text-gray-500 text-sm leading-loose mb-6 flex-1 font-light break-words whitespace-pre-wrap">{s.description}</p>
                            <span className="lc-subheading text-[#D4C5B9] border-b border-[#D4C5B9] pb-1 mx-auto w-fit group-hover:text-[#0A1128] group-hover:border-[#0A1128] transition-colors">
                              Discover
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
              <section key="menu" id="menu" className="py-24 md:py-32 px-6 lc-bg-navy">
                <div className="max-w-6xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-20">
                      <span className="lc-subheading text-[#D4C5B9] mb-4 block">The Collection</span>
                      <h2 className="lc-heading text-4xl md:text-5xl text-white font-light italic">Signature Products</h2>
                      <div className="lc-line mt-8 opacity-30"></div>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.slice(0, 3).map((product: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150} dir="up">
                        <div
                          className={`flex flex-col border h-full transition-all duration-500 hover:-translate-y-2 group overflow-hidden ${idx === 1 ? 'border-[#D4C5B9] bg-[#D4C5B9]/5' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                        >
                          <div className="w-full h-56 relative border-b border-white/10 overflow-hidden bg-black/20">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          </div>
                          <div className="p-10 flex flex-col flex-1">
                            <h3 className="lc-heading text-3xl text-white mb-2 break-words">{product.name}</h3>
                            <p className={`lc-subheading mb-8 break-words ${idx === 1 ? 'text-[#D4C5B9]' : 'text-gray-400'}`}>{product.time}</p>
                            
                            <div className="text-4xl text-white font-light mb-8 break-words">
                              {product.price}
                            </div>
                            
                            <p className="text-gray-300 text-sm leading-loose mb-10 flex-1 font-light break-words whitespace-pre-wrap">
                              {product.description}
                            </p>
                            
                            <button 
                              onClick={() => setSelectedProduct(product)}
                              className={`w-full py-4 lc-subheading transition-colors border ${idx === 1 ? 'bg-[#D4C5B9] text-[#0A1128] border-[#D4C5B9] hover:bg-transparent hover:text-[#D4C5B9]' : 'bg-transparent text-white border-white/30 hover:border-white hover:bg-white hover:text-[#0A1128]'}`}
                            >
                              Inquire
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
                          className="lc-btn px-12 py-4 text-sm inline-block border border-white text-white hover:bg-white hover:text-[#0A1128]"
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
              <section key="gallery" id="gallery" className="py-24 md:py-32 px-4 lc-bg-white">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-16">
                      <h2 className="lc-heading text-4xl md:text-5xl text-[#0A1128] font-light italic">Curated Spaces</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div
                          onClick={() => setSelectedImage(img)}
                          className={`cursor-pointer overflow-hidden relative group ${idx === 0 || idx === 3 ? 'aspect-square md:aspect-[3/4]' : 'aspect-square'}`}
                        >
                          <img src={img} alt={`Space ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-500"></div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── CONTACT ── */
            case 'contact': return (
              <section key="contact" id="contact" className="py-24 md:py-32 px-6 lc-bg-grey">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-white p-10 md:p-20 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-16">
                    <FadeIn dir="left">
                      <div>
                        <span className="lc-subheading text-[#D4C5B9] mb-4 block">Connect</span>
                        <h2 className="lc-heading text-4xl text-[#0A1128] mb-8 font-light italic">Request an Invitation</h2>
                        <p className="text-gray-500 text-sm leading-loose mb-12 font-light">Membership is strictly limited to ensure an uncompromised experience. Contact our concierge to arrange a private tour.</p>
                        
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <MapPin className="text-[#D4C5B9] mt-1 shrink-0" size={18} strokeWidth={1.5} />
                            <div className="flex-1 min-w-0 break-words">
                              <h4 className="lc-subheading text-[#0A1128] mb-1">Address</h4>
                              <p className="text-gray-500 font-light text-sm">{address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <Phone className="text-[#D4C5B9] mt-1 shrink-0" size={18} strokeWidth={1.5} />
                            <div className="flex-1 min-w-0 break-words">
                              <h4 className="lc-subheading text-[#0A1128] mb-1">Direct Line</h4>
                              <p className="text-gray-500 font-light text-sm">{content.contact_info?.phone || '+1 (800) 555-0199'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4C5B9] mt-1 shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <div className="flex-1 min-w-0 break-words">
                              <h4 className="lc-subheading text-[#0A1128] mb-1">Hours</h4>
                              <p className="text-gray-500 font-light text-sm whitespace-pre-line">{content.contact_info?.hours || "MON-FRI: 06:00-22:00\nSAT-SUN: 07:00-20:00"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200">
                          <a href={content.contact_info?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#D4C5B9] hover:text-[#D4C5B9] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                          <a href={content.contact_info?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#D4C5B9] hover:text-[#D4C5B9] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          <a href={content.contact_info?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#D4C5B9] hover:text-[#D4C5B9] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                        </div>
                      </div>
                    </FadeIn>
                    
                    <FadeIn dir="right">
                      <div className="w-full h-full min-h-[400px] border border-gray-200 relative overflow-hidden shadow-2xl">
                         <iframe 
                           src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                           width="100%" 
                           height="100%" 
                           style={{ border: 0 }} 
                           allowFullScreen={false} 
                           loading="lazy" 
                           referrerPolicy="no-referrer-when-downgrade" 
                           className="w-full h-full filter grayscale contrast-125 opacity-90 hover:opacity-100 transition-opacity duration-300"
                         ></iframe>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </section>
            );

            /* ── CUSTOM ── */
            case 'custom':
              if (!content.custom_blocks_json || content.custom_blocks_json.length === 0) return null;
              return (
                <section key="custom" id="custom" className="py-24 md:py-32 px-6 lc-bg-white relative">
                  <div className="max-w-4xl mx-auto space-y-12 bg-white">
                    {content.custom_blocks_json.map((block: any) => {
                      switch (block.type) {
                        case 'heading':
                          return <h2 key={block.id} className="lc-heading text-4xl md:text-5xl text-[#0A1128] font-light italic text-center mb-8 break-words whitespace-pre-wrap">{block.content}</h2>;
                        case 'paragraph':
                          return <p key={block.id} className="text-gray-600 font-light text-sm leading-loose text-center break-words whitespace-pre-wrap">{block.content}</p>;
                        case 'image':
                          return (
                            <div key={block.id} className="w-full relative overflow-hidden my-12 border border-gray-200 p-2">
                              <img src={block.url} alt="Custom" className="w-full h-auto object-cover grayscale-[20%]" />
                            </div>
                          );
                        case 'divider':
                          return (
                            <div key={block.id} className="flex items-center justify-center py-16">
                              <div className="lc-line"></div>
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
        <footer className="bg-[#0A1128] py-20 px-6 text-center border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-md border border-[#D4C5B9]/30 mx-auto mb-8 bg-[#0A1128]" />
            ) : null}
            <h4 className="lc-heading text-2xl text-white mb-10 tracking-widest">{siteName.toUpperCase()}</h4>
            
            <div className="flex flex-wrap justify-center gap-10 lc-subheading text-[10px] mb-12">
              {['Philosophy', 'Wellness', 'Membership', 'Spaces', 'Inquire'].map(l => (
                <a key={l} href={`#`} className="text-gray-400 hover:text-[#D4C5B9] transition-colors">{l}</a>
              ))}
            </div>

            <p className="text-gray-600 font-light text-xs">
              © {new Date().getFullYear()} {siteName}. All Rights Reserved.<br/>
              <span className="opacity-50 mt-4 inline-block">Powered by Jaalam</span>
            </p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            MODALS
        ════════════════════════════════════════ */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0A1128]/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)}>
            <div
              className="w-full max-w-[320px] md:max-w-sm bg-white text-center relative shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white bg-[#0A1128]/20 hover:bg-[#0A1128] transition-colors">
                <X size={20} />
              </button>
              
              <div className="h-48 md:h-64 w-full relative shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-10 overflow-y-auto shrink">
                <h3 className="lc-heading text-3xl text-[#0A1128] mb-2">{selectedProduct.name}</h3>
                <p className="lc-subheading text-[#D4C5B9] mb-8">{selectedProduct.time}</p>
                <div className="text-4xl text-[#0A1128] font-light mb-8">{selectedProduct.price}</div>
                <p className="text-gray-600 text-sm leading-loose mb-10 font-light">{selectedProduct.description}</p>

                <button
                  className="lc-btn w-full text-[#0A1128] border border-[#0A1128] hover:bg-[#0A1128] hover:text-white"
                  onClick={() => { setSelectedProduct(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0A1128]/80 backdrop-blur-md" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-[320px] md:max-w-sm bg-white text-center relative shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white bg-[#0A1128]/20 hover:bg-[#0A1128] transition-colors">
                <X size={20} />
              </button>
              
              <div className="h-48 md:h-64 w-full relative shrink-0">
                {selectedService.image ? (
                  <img src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#F9F9F9] flex items-center justify-center">
                    <Star size={40} className="text-[#D4C5B9]" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-10 pb-8 md:pb-12 overflow-y-auto shrink">
                <h3 className="lc-heading text-3xl text-[#0A1128] mb-4">{selectedService.title || selectedService.name}</h3>
                <p className="text-gray-600 text-sm leading-loose mb-8 font-light">{selectedService.description}</p>
                <button
                  className="lc-btn w-full text-[#0A1128] border border-[#0A1128] hover:bg-[#0A1128] hover:text-white"
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
            className="fixed inset-0 z-[200] bg-[#0A1128]/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-[#D4C5B9] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {viewProductsPage && (
          <div className="fixed inset-0 z-[300] bg-[#0A1128] overflow-y-auto animate-in fade-in">
            <div className="min-h-screen py-24 px-6 relative bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-fixed bg-blend-overlay bg-[#0A1128]/95">
              <button onClick={() => setViewProductsPage(false)} className="absolute top-8 right-8 text-white hover:text-[#D4C5B9] lc-subheading tracking-widest flex items-center gap-2 transition-colors">
                CLOSE <X size={24} />
              </button>
              
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <span className="lc-subheading text-[#D4C5B9] block mb-4">The Collection</span>
                  <h2 className="lc-heading text-4xl md:text-5xl text-white font-light italic">Signature Products</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: any, idx: number) => (
                    <div key={idx} className="flex flex-col border bg-white/5 border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/10 group overflow-hidden">
                      <div className="w-full h-56 relative border-b border-white/10 bg-black/20">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="p-10 flex flex-col flex-1">
                        <h3 className="lc-heading text-3xl text-white mb-2 break-words whitespace-pre-wrap">{product.name}</h3>
                        <p className="lc-subheading mb-8 text-[#D4C5B9] break-words whitespace-pre-wrap">{product.time}</p>
                        <div className="text-4xl text-white font-light mb-8 break-words whitespace-pre-wrap">{product.price}</div>
                        <p className="text-gray-300 text-sm leading-loose mb-10 flex-1 font-light break-words whitespace-pre-wrap">{product.description}</p>
                        <button 
                          onClick={() => { setViewProductsPage(false); setSelectedProduct(product); }}
                          className="w-full py-4 lc-subheading transition-colors border bg-transparent text-white border-white/30 hover:border-white hover:bg-white hover:text-[#0A1128]"
                        >
                          Inquire
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

