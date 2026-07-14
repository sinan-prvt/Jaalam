import React, { useState, useEffect, useRef } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, X, Anchor, Activity, Zap, ShieldAlert, ArrowRight, Menu } from 'lucide-react';

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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[600ms] ease-out ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function CrossFitTheme({ website, content }: Props) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewProductsPage, setViewProductsPage] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'BOX 99';
  const address = content.contact_info?.address || '99 Warehouse Ave, Industrial District';

  /* ─── Palette ─── */
  const BLACK = '#111111';
  const OFF_WHITE = '#F5F5F5';
  const YELLOW = '#E6FF00'; // Electric/Neon Yellow
  const DARK_GREY = '#222222';
  const LIGHT_GREY = '#DDDDDD';

  /* ─── Data ─── */
  const defaultProducts = [
    { name: 'Knee Sleeves', time: 'Pair', price: '?45', rating: 4.8, image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=500&q=80', description: '7mm neoprene knee support for heavy lifting.' },
    { name: 'Speed Rope', time: 'Adjustable', price: '?25', rating: 5.0, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80', description: 'Fast, smooth bearing jump rope for double unders.' },
    { name: 'Lifting Belt', time: 'Leather', price: '?60', rating: 4.9, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=500&q=80', description: '4-inch leather belt for core stability during heavy lifts.' },
  ];

  const products = content.products_json?.length > 0 ? content.products_json.map((p: any) => ({
    name: p.name || p.title || 'Equipment',
    price: p.price || '?0',
    time: p.subtitle || '',
    description: p.description || 'Premium fitness gear.',
    rating: 5.0,
    image: p.image || defaultProducts[0].image,
  })) : defaultProducts;

  const defaultServices = [
    { title: 'WOD (Workout of the Day)', description: 'High-intensity functional movements designed to push you to your limits.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80' },
    { title: 'Olympic Weightlifting', description: 'Focus on technique and strength for the Snatch and Clean & Jerk.', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80' },
    { title: 'Endurance & Stamina', description: 'Longer duration workouts combining running, rowing, and bodyweight exercises.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' }
  ];

  const boxServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1600&q=80';

  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json.map((img: string) => img || 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80') : [
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80'
  ];


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Roboto+Mono:wght@400;700&family=Montserrat:wght@400;700;900&display=swap');

        .cf-heading { font-family: 'Anton', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; }
        .cf-subheading { font-family: 'Roboto Mono', monospace; text-transform: uppercase; }
        .cf-body { font-family: 'Montserrat', sans-serif; }

        .cf-bg-dark { background-color: ${BLACK}; color: ${OFF_WHITE}; }
        .cf-bg-light { background-color: ${OFF_WHITE}; color: ${BLACK}; }
        .cf-bg-grey { background-color: ${DARK_GREY}; color: ${OFF_WHITE}; }
        .cf-text-yellow { color: ${YELLOW}; }

        .cf-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1.2rem 2.5rem;
          background-color: ${YELLOW};
          color: ${BLACK};
          font-family: 'Anton', sans-serif;
          font-size: 1.2rem;
          text-transform: uppercase;
          transition: all 0.2s ease;
          border: 3px solid ${YELLOW};
          box-shadow: 6px 6px 0px ${BLACK};
        }
        .cf-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px ${BLACK};
        }
        .cf-btn:active {
          transform: translate(6px, 6px);
          box-shadow: 0px 0px 0px ${BLACK};
        }
        
        .cf-btn-outline {
          background-color: transparent;
          color: ${OFF_WHITE};
          border: 3px solid ${OFF_WHITE};
          box-shadow: 6px 6px 0px ${YELLOW};
        }
        .cf-btn-outline:hover {
          background-color: ${OFF_WHITE};
          color: ${BLACK};
          box-shadow: 4px 4px 0px ${YELLOW};
        }
        .cf-btn-outline:active {
          box-shadow: 0px 0px 0px ${YELLOW};
        }

        .cf-card {
          background-color: ${OFF_WHITE};
          color: ${BLACK};
          border: 4px solid ${BLACK};
          transition: all 0.2s ease;
        }
        .cf-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0px ${YELLOW};
        }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: ${OFF_WHITE}; border-left: 2px solid ${BLACK}; }
        ::-webkit-scrollbar-thumb { background: ${BLACK}; }
        
        .halftone-pattern {
          background-image: radial-gradient(${DARK_GREY} 2px, transparent 2px);
          background-size: 8px 8px;
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="cf-body w-full min-h-screen overflow-x-hidden cf-bg-light selection:bg-[#E6FF00] selection:text-black">

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between absolute top-0 z-50 bg-black/10 backdrop-blur-sm border-b-4 border-black">
          <div className="cf-heading text-4xl text-black flex items-center gap-2">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 object-cover rounded-full shadow-md border-2 border-black" />
            ) : (
              <Anchor size={36} className="text-black fill-black/20" />
            )}
            <span className="mt-1">{siteName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-10 cf-subheading text-sm font-bold text-black">
            {['About', 'Classes', 'Pricing', 'Gallery', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#E6FF00] hover:bg-black px-3 py-1 transition-colors border-2 border-transparent hover:border-black">
                {l}
              </a>
            ))}
          </nav>

          <button className="md:hidden text-black p-2 bg-[#E6FF00] border-2 border-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#E6FF00] pt-24 px-6 flex flex-col gap-6">
            {['About', 'Classes', 'Pricing', 'Gallery', 'Contact'].map(l => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="cf-heading text-6xl text-black hover:text-white transition-colors border-b-4 border-black pb-2"
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
          <div className="relative min-h-[100svh] flex flex-col justify-center px-6 pt-32 pb-16 border-b-8 border-black">
            <div className="absolute inset-0 z-0 bg-[#E6FF00]">
              <img loading="lazy" src={heroImage} alt="Hero" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-60" />
              <div className="absolute inset-0 halftone-pattern opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
              <FadeIn delay={0}>
                <div className="inline-block bg-black text-[#E6FF00] px-4 py-2 cf-subheading text-sm md:text-xl font-bold mb-6 border-4 border-black">
                  COMMUNITY. EFFORT. RESULTS.
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="cf-heading text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] leading-[0.85] text-black mb-8 break-words text-shadow-md">
                  {content.hero_title || content.settings_json?.hero_title || 'EMBRACE THE SUCK'}
                </h1>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="cf-subheading text-lg md:text-2xl text-black max-w-3xl mx-auto mb-12 font-bold bg-white/80 p-4 border-4 border-black break-words whitespace-pre-wrap">
                  {(() => {
                    const t = content.about_text || content.settings_json?.hero_description || content.hero_text;
                    if (!t || t === 'Add your business description here.' || t.trim() === '') {
                      return 'Leave your ego at the door. We build fitter, faster, and stronger humans through constantly varied functional movements.';
                    }
                    return t;
                  })()}
                </p>
              </FadeIn>

              <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button className="cf-btn w-full sm:w-auto" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                    Drop In Today
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
              <section key="about" id="about" className="py-24 md:py-32 px-6 cf-bg-dark border-b-8 border-[#E6FF00]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <FadeIn dir="left">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#E6FF00] translate-x-4 -translate-y-4 border-4 border-black"></div>
                      <img loading="lazy" src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80" alt="About Box" className="relative z-10 w-full h-auto object-cover grayscale border-4 border-black" />
                    </div>
                  </FadeIn>
                  <FadeIn dir="right">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <Zap size={32} className="text-[#E6FF00]" />
                        <span className="cf-subheading text-white text-xl font-bold">WHAT WE DO</span>
                      </div>
                      <h2 className="cf-heading text-6xl md:text-8xl text-white mb-8 leading-[0.9]">
                        {content.settings_json?.about_title || 'FORGING ELITE FITNESS'}
                      </h2>
                      <p className="cf-body text-gray-300 text-lg leading-relaxed mb-8 font-medium break-words whitespace-pre-wrap">
                        {(() => {
                          const t = content.settings_json?.about_description || content.about_text;
                          if (!t || t === 'Add your business description here.' || t.trim() === '') {
                            return 'Our programming is designed for universal scalability making it the perfect application for any committed individual regardless of experience. We scale load and intensity; we don’t change programs.';
                          }
                          return t;
                        })()}
                      </p>

                      <div className="space-y-4 mt-8">
                        {['Constantly Varied', 'High Intensity', 'Functional Movement'].map((feat, i) => (
                          <div key={i} className="flex items-center gap-4 bg-[#222] p-4 border-2 border-black">
                            <ShieldAlert className="text-[#E6FF00]" size={24} />
                            <span className="text-white cf-subheading font-bold text-lg">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </section>
            );

            /* ── SERVICES (CLASSES) ── */
            case 'services': return (
              <section key="services" id="classes" className="py-24 md:py-32 px-6 cf-bg-light border-b-8 border-black halftone-pattern">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                      <div>
                        <h2 className="cf-heading text-6xl md:text-8xl text-black leading-none bg-white inline-block px-4 border-4 border-black mb-2">THE W.O.D.</h2>
                        <span className="cf-subheading text-black font-bold text-xl block bg-[#E6FF00] px-4 py-1 border-4 border-black inline-block">PROGRAMS & CLASSES</span>
                      </div>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {boxServices.map((s: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150}>
                        <div
                          className="cf-card group cursor-pointer h-full flex flex-col"
                          onClick={() => setSelectedService(s)}
                        >
                          <div className="h-64 relative border-b-4 border-black">
                            {s.image ? (
                              <img loading="lazy" src={s.image} alt={s.title || s.name} className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full bg-[#DDDDDD] flex items-center justify-center">
                                <Activity size={64} className="text-black" />
                              </div>
                            )}
                            <div className="absolute top-0 left-0 bg-[#E6FF00] px-4 py-2 cf-heading text-2xl border-r-4 border-b-4 border-black">
                              0{idx + 1}
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col bg-white">
                            <h3 className="cf-heading text-4xl text-black mb-4 break-words">{s.title || s.name}</h3>
                            <p className="cf-body text-gray-700 font-medium leading-relaxed mb-6 flex-1 min-w-0 break-words whitespace-pre-wrap">{s.description}</p>
                            <div className="flex items-center gap-2 text-black cf-subheading font-bold text-lg mt-auto bg-[#E6FF00] px-4 py-2 border-2 border-black w-fit group-hover:bg-black group-hover:text-[#E6FF00] transition-colors">
                              DETAILS <ArrowRight size={20} />
                            </div>
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
              <section key="menu" id="pricing" className="py-24 md:py-32 px-6 cf-bg-dark border-b-8 border-black">
                <div className="max-w-6xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-20">
                      <h2 className="cf-heading text-6xl md:text-8xl text-white mb-4">SHOP GEAR</h2>
                      <span className="cf-subheading text-[#E6FF00] font-bold text-xl">LIFT HEAVY. LOOK GOOD.</span>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.slice(0, 3).map((product: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150} dir="up">
                        <div
                          className={`flex flex-col border-4 relative transition-transform duration-200 hover:-translate-y-2 group ${idx === 1 ? 'bg-[#E6FF00] border-black text-black' : 'bg-[#222] border-white text-white'}`}
                        >
                          {idx === 1 && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-[#E6FF00] cf-subheading font-bold px-6 py-1 border-4 border-black z-10">
                              ESSENTIAL
                            </div>
                          )}
                          <div className={`w-full h-48 border-b-4 ${idx === 1 ? 'border-black bg-black' : 'border-white bg-black'} overflow-hidden relative`}>
                            <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                          </div>
                          <div className={`p-8 border-b-4 ${idx === 1 ? 'border-black' : 'border-white'}`}>
                            <h3 className="cf-heading text-4xl mb-2 break-words">{product.name}</h3>
                            <p className={`cf-subheading font-bold mb-4 break-words ${idx === 1 ? 'text-gray-800' : 'text-gray-400'}`}>{product.time}</p>
                            <div className="cf-heading text-6xl break-words">{product.price}</div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                            <p className={`cf-body font-bold mb-8 flex-1 min-w-0 break-words whitespace-pre-wrap ${idx === 1 ? 'text-black' : 'text-gray-300'}`}>
                              {product.description}
                            </p>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className={`w-full py-4 cf-heading text-2xl border-4 transition-all ${idx === 1 ? 'bg-black text-[#E6FF00] border-black hover:bg-transparent hover:text-black' : 'bg-[#E6FF00] text-black border-[#E6FF00] hover:bg-transparent hover:text-[#E6FF00] hover:border-white'}`}
                            >
                              VIEW DETAILS
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
                          className="cf-btn cf-btn-outline px-12 py-4 text-xl inline-block border-4 border-white text-white hover:bg-white hover:text-black shadow-[6px_6px_0px_#E6FF00]"
                          onClick={() => setViewProductsPage(true)}
                        >
                          <span>VIEW ALL GEAR</span>
                        </button>
                      </div>
                    </FadeIn>
                  )}
                </div>
              </section>
            );

            /* ── GALLERY ── */
            case 'gallery': return (
              <section key="gallery" id="gallery" className="py-24 md:py-32 px-4 cf-bg-light border-b-8 border-black">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="mb-16">
                      <h2 className="cf-heading text-6xl md:text-8xl text-black">INSIDE THE BOX</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div
                          onClick={() => setSelectedImage(img)}
                          className="aspect-square cursor-pointer relative group overflow-hidden border-4 border-black bg-black"
                        >
                          <img loading="lazy" src={img} alt={`Box ${idx + 1}`} className="w-full h-full object-cover grayscale opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-[#E6FF00]/0 group-hover:bg-[#E6FF00]/20 transition-colors duration-300 mix-blend-multiply"></div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── CONTACT ── */
            case 'contact': return (
              <section key="contact" id="contact" className="py-24 md:py-32 px-6 cf-bg-dark halftone-pattern">
                <div className="max-w-6xl mx-auto bg-black border-8 border-[#E6FF00] p-8 md:p-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <FadeIn dir="left">
                      <div>
                        <h2 className="cf-heading text-6xl md:text-8xl text-white mb-6">TIME TO COMMIT</h2>
                        <p className="cf-body text-gray-300 mb-12 font-bold text-lg">First class is on us. Fill out the form or show up early.</p>

                        <div className="space-y-8 cf-subheading font-bold text-lg">
                          <div className="flex items-center gap-6">
                            <div className="bg-[#E6FF00] p-3 border-2 border-white shrink-0">
                              <MapPin className="text-black" size={24} />
                            </div>
                            <p className="text-white flex-1 min-w-0 break-words">{address}</p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="bg-[#E6FF00] p-3 border-2 border-white shrink-0">
                              <Phone className="text-black" size={24} />
                            </div>
                            <p className="text-white flex-1 min-w-0 break-words">{content.contact_info?.phone || '(555) 123-4567'}</p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="bg-[#E6FF00] p-3 border-2 border-white shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <p className="text-white flex-1 min-w-0 break-words whitespace-pre-line">{content.contact_info?.hours || "MON-FRI: 05:00-20:00\nSAT-SUN: 08:00-14:00"}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                          <a href={content.contact_info?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#E6FF00] border-2 border-white flex items-center justify-center text-black hover:bg-black hover:text-[#E6FF00] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                          <a href={content.contact_info?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#E6FF00] border-2 border-white flex items-center justify-center text-black hover:bg-black hover:text-[#E6FF00] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          <a href={content.contact_info?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#E6FF00] border-2 border-white flex items-center justify-center text-black hover:bg-black hover:text-[#E6FF00] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn dir="right">
                      <div className="w-full h-full min-h-[400px] border-4 border-[#444] relative overflow-hidden shadow-[12px_12px_0px_#E6FF00]">
                        <iframe
                          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full filter grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity duration-300"
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
                <section key="custom" id="custom" className="py-24 md:py-32 px-6 cf-bg-light border-b-8 border-black halftone-pattern">
                  <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 border-8 border-black">
                    {content.custom_blocks_json.map((block: any) => {
                      switch (block.type) {
                        case 'heading':
                          return <h2 key={block.id} className="cf-heading text-5xl md:text-6xl text-black text-center mb-6 break-words whitespace-pre-wrap">{block.content}</h2>;
                        case 'paragraph':
                          return <p key={block.id} className="cf-body text-gray-800 font-bold text-lg leading-relaxed text-center bg-[#E6FF00] p-4 border-4 border-black break-words whitespace-pre-wrap">{block.content}</p>;
                        case 'image':
                          return (
                            <div key={block.id} className="w-full relative overflow-hidden border-8 border-black my-8">
                              <img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto object-cover grayscale mix-blend-multiply" />
                            </div>
                          );
                        case 'divider':
                          return (
                            <div key={block.id} className="flex items-center justify-center py-12">
                              <div className="w-32 h-2 bg-black"></div>
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
        
      
      {/* Injected Services Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-16 px-6 bg-black/5 border-b border-black/5">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services_json?.length ? content.services_json : [
                { title: 'Quality Assurance', description: 'We guarantee the highest quality in all our offerings.' },
                { title: 'Fast Delivery', description: 'Quick and reliable delivery to your doorstep.' },
                { title: 'Customer Support', description: '24/7 dedicated support for all your needs.' }
              ]).map((srv: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto bg-black/5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-black">{srv.title}</h3>
                  <p className="opacity-75 text-black">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      <footer className="bg-black py-16 px-6 text-center border-t-8 border-[#E6FF00]">
          <div className="max-w-4xl mx-auto">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-md border-4 border-[#E6FF00] mx-auto mb-6 bg-white" />
            ) : (
              <Anchor size={48} className="text-[#E6FF00] mx-auto mb-6" />
            )}
            <h4 className="cf-heading text-6xl text-white mb-8">{siteName}</h4>

            <div className="flex flex-wrap justify-center gap-8 cf-subheading text-sm font-bold mb-12">
              {['About', 'Classes', 'Pricing', 'Gallery', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-gray-400 hover:text-[#E6FF00] hover:underline transition-colors">{l}</a>
              ))}
            </div>

            <p className="cf-subheading text-gray-600 font-bold text-xs">
              © {new Date().getFullYear()} {siteName}. WORK HARD.<br />
              <span className="opacity-50 mt-2 inline-block">Powered by Jaalam</span>
            </p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            MODALS
        ════════════════════════════════════════ */}
        

        {selectedService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-[320px] md:max-w-sm bg-[#222] border-2 md:border-4 border-white text-center relative overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-2 right-2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:text-[#E6FF00] transition-colors bg-black/50">
                <X size={20} className="md:w-7 md:h-7" />
              </button>

              <div className="h-28 md:h-48 w-full border-b-2 md:border-b-4 border-white shrink-0">
                {selectedService.image ? (
                  <img loading="lazy" src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center">
                    <Activity size={32} className="md:w-12 md:h-12 text-[#E6FF00]" />
                  </div>
                )}
              </div>

              <div className="p-5 md:p-8 overflow-y-auto shrink">
                <h3 className="cf-heading text-2xl md:text-4xl text-white mb-2 md:mb-4">{selectedService.title || selectedService.name}</h3>
                <p className="cf-body font-bold text-xs md:text-base text-gray-300 mb-5 md:mb-8">{selectedService.description}</p>
                <button
                  className="w-full py-2 md:py-4 cf-heading text-lg md:text-2xl border-2 md:border-4 bg-[#E6FF00] text-black border-[#E6FF00] hover:bg-transparent hover:text-[#E6FF00] transition-all"
                  onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Join Class
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-[#E6FF00] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <img loading="lazy" src={selectedImage}
              alt="Gallery Preview"
              className="max-w-full max-h-[90vh] object-contain border-8 border-white shadow-[12px_12px_0px_#E6FF00]"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {viewProductsPage && (
          <div className="fixed inset-0 z-[300] bg-black overflow-y-auto animate-in slide-in-from-bottom">
            <div className="min-h-screen theme-root flex flex-col py-24 px-6 relative halftone-pattern">
              <button onClick={() => setViewProductsPage(false)} className="absolute top-8 right-8 text-white hover:text-[#E6FF00] cf-heading tracking-widest flex items-center gap-2 transition-colors border-2 border-white p-2">
                CLOSE <X size={24} />
              </button>

              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="cf-heading text-6xl md:text-8xl text-white mb-4">ALL GEAR</h2>
                  <span className="cf-subheading text-[#E6FF00] font-bold text-xl">LIFT HEAVY. LOOK GOOD.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: any, idx: number) => (
                    <div key={idx} onClick={() => setSelectedProduct(product)} className="cursor-pointer flex flex-col border-4 bg-[#222] border-white text-white relative transition-transform hover:-translate-y-2 group">
                      <div className="w-full h-56 border-b-4 border-white bg-black">
                        <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <div className="p-8 border-b-4 border-white">
                        <h3 className="cf-heading text-4xl mb-2 break-words whitespace-pre-wrap">{product.name}</h3>
                        <p className="cf-subheading font-bold mb-4 text-gray-400 break-words whitespace-pre-wrap">{product.time}</p>
                        <div className="cf-heading text-6xl break-words whitespace-pre-wrap">{product.price}</div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <p className="cf-body font-bold mb-8 flex-1 text-gray-300 break-words whitespace-pre-wrap">
                          {product.description}
                        </p>
                        <button
                          onClick={() => { setViewProductsPage(false); setSelectedProduct(product); }}
                          className="w-full py-4 cf-heading text-2xl border-4 transition-all bg-[#E6FF00] text-black border-[#E6FF00] hover:bg-transparent hover:text-[#E6FF00] hover:border-white"
                        >
                          SELECT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
          <div className="mt-10 mb-4 text-center w-full flex justify-center col-span-full">
            <button 
              onClick={() => setShowAllProducts(true)} 
              className="px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-bold tracking-wide shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              View All Products
            </button>
          </div>

              </div>
            </div>
          </div>
        )}
      
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
    </>
  );
}

