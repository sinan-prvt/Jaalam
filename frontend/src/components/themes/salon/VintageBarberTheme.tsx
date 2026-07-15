import React, { useState, useEffect, useRef } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, Mail, Star, Clock, X, Scissors, Quote, Camera, Menu } from 'lucide-react';

/* ─── Intersection-observer fade-in ─── */
function FadeIn({ children, delay = 0, dir = 'up' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const init = dir === 'left' ? 'opacity-0 -translate-x-8' : dir === 'right' ? 'opacity-0 translate-x-8' : 'opacity-0 translate-y-12';
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[1200ms] ease-out ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function VintageBarberTheme({ website, content }: Props) {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'The Classic';
  const address   = content.contact_info?.address || '1920 Retro Ave, NY';

  /* ─── Palette ─── */
  const PARCHMENT = '#F4EFE6'; 
  const ESPRESSO  = '#2A231C'; 
  const CRIMSON   = '#9E2A2B';
  const GOLD      = '#B08D57';

  /* ─── Data ─── */
  const defaultStyles = [
    { name: 'The Gentleman', time: '45 mins', price: '?42', rating: 4.9, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=500&q=80' },
    { name: 'Pompadour', time: '50 mins', price: '?38', rating: 5.0, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Hot Towel Shave', time: '30 mins', price: '?28', rating: 4.8, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80' },
    { name: 'Classic Fade', time: '60 mins', price: '?55', rating: 5.0, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=500&q=80' },
  ];

  const haircutStyles = content.products_json?.length > 0
    ? content.products_json.map((p: any) => ({
        name: p.name || p.title || 'Classic Cut',
        price: p.price || '?0',
        time: (p.description && (p.description.toLowerCase().includes('min') || p.description.length < 12)) ? p.description : '45 mins',
        description: p.description && !p.description.toLowerCase().includes('min') && p.description.length > 12 ? p.description : `An old-school ${p.name || 'cut'} crafted with precision.`,
        rating: 4.9,
        image: p.image || defaultStyles[0].image,
      }))
    : defaultStyles.map(s => ({ ...s, description: `A time-honored ${s.name} service for the modern gentleman.` }));

  const defaultServices = [
    { title: 'Hair Cutting', description: 'Traditional shears and clipper work.', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80' },
    { title: 'Hot Lather Shave', description: 'Straight razor shave with hot towels.', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80' },
    { title: 'Beard Trimming', description: 'Sculpting and conditioning for your beard.', image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=400&q=80' },
    { title: 'Shoe Shining', description: 'Classic leather polish and buffing.', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80' },
  ];

  const salonServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80';

  const galleryImages = content.gallery_json?.length > 0 ? [...content.gallery_json] : [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80'
  ];


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rye&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        .vb-display { font-family: 'Rye', serif; letter-spacing: 0.05em; text-transform: uppercase; }
        .vb-body    { font-family: 'Courier Prime', monospace; }
        .vb-serif   { font-family: 'Playfair Display', serif; }

        .vb-paper {
          background-color: ${PARCHMENT};
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
        }

        .vb-border { border: 2px solid ${ESPRESSO}; }
        .vb-border-dashed { border: 2px dashed ${ESPRESSO}; }

        .vb-btn {
          position: relative;
          background: ${ESPRESSO};
          color: ${PARCHMENT};
          font-family: 'Courier Prime', monospace;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.3s;
          border: 2px solid ${ESPRESSO};
        }
        .vb-btn:hover {
          background: ${CRIMSON};
          border-color: ${CRIMSON};
          box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
          transform: translate(-2px, -2px);
        }
        .vb-btn-outline {
          background: transparent;
          color: ${ESPRESSO};
        }
        .vb-btn-outline:hover {
          background: ${ESPRESSO};
          color: ${PARCHMENT};
        }

        .vb-card {
          background: #fff;
          border: 2px solid ${ESPRESSO};
          box-shadow: 6px 6px 0 ${ESPRESSO}20;
          transition: all 0.3s;
        }
        .vb-card:hover {
          transform: translateY(-4px);
          box-shadow: 8px 8px 0 ${CRIMSON}40;
        }

        .vb-sepia-img {
          filter: sepia(0.6) contrast(1.1) brightness(0.9);
          transition: filter 0.5s ease;
        }
        .vb-card:hover .vb-sepia-img, .group:hover .vb-sepia-img {
          filter: sepia(0) contrast(1) brightness(1);
        }

        .vb-ribbon {
          position: relative;
          display: inline-block;
          background: ${CRIMSON};
          color: ${PARCHMENT};
          padding: 8px 24px;
        }
        .vb-ribbon::before, .vb-ribbon::after {
          content: '';
          position: absolute;
          bottom: -8px;
          border: 4px solid transparent;
        }
        .vb-ribbon::before { left: 0; border-right-color: #5A1819; border-top-color: #5A1819; }
        .vb-ribbon::after { right: 0; border-left-color: #5A1819; border-top-color: #5A1819; }

        .vb-line-decor {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .vb-line-decor::before, .vb-line-decor::after {
          content: '';
          height: 1px;
          background: ${ESPRESSO};
          flex: 1;
          opacity: 0.3;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${PARCHMENT}; border-left: 1px solid ${ESPRESSO}; }
        ::-webkit-scrollbar-thumb { background: ${ESPRESSO}; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="vb-body w-full min-h-screen overflow-x-hidden vb-paper" style={{ color: ESPRESSO }}>

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b-2" style={{ borderColor: ESPRESSO }}>
          <div className="vb-display text-2xl sm:text-3xl tracking-wider">{content?.settings_json?.logo_image ? <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</div>
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm">
            {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#9E2A2B] transition-colors relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9E2A2B] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          <button
            className="vb-btn px-6 py-2.5 text-xs tracking-widest hidden sm:block"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            EST. 2026
          </button>
          <button 
            className="md:hidden p-2 hover:bg-black/5 transition-colors border-2" 
            style={{ borderColor: ESPRESSO }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-b-2 bg-[#F4EFE6] px-6 py-4 flex flex-col gap-4 absolute w-full z-50 shadow-xl" style={{ borderColor: ESPRESSO }}>
            {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
              <a 
                key={l} 
                href={`#${l.toLowerCase()}`} 
                className="font-bold text-sm uppercase tracking-widest hover:text-[#9E2A2B] transition-colors"
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
          <div className="relative min-h-[90svh] flex flex-col md:flex-row border-b-2" style={{ borderColor: ESPRESSO }}>
            
            {/* Left text */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-16 relative z-10 border-r-2" style={{ borderColor: ESPRESSO }}>
              <FadeIn delay={0} dir="left">
                <div className="inline-block border-2 px-4 py-1 mb-8 text-xs font-bold tracking-widest uppercase bg-white" style={{ borderColor: ESPRESSO }}>
                  Traditional Grooming
                </div>
              </FadeIn>

              <FadeIn delay={200} dir="left">
                <h1 className="vb-display text-4xl sm:text-5xl md:text-[5.5rem] leading-[1.1] mb-8 break-words">
                  {content.hero_title || content.settings_json?.hero_title || siteName}
                </h1>
              </FadeIn>

              <FadeIn delay={400} dir="left">
                <p className="vb-serif text-lg sm:text-xl italic max-w-md mb-10 opacity-90 leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {(() => {
                    const t = content.settings_json?.hero_description || content.hero_text;
                    if (!t || t === 'Add your business description here.' || t.trim() === '') {
                      return 'Step back in time. We offer classic cuts, hot towel shaves, and an atmosphere of old-world charm tailored for the modern gentleman.';
                    }
                    return t;
                  })()}
                </p>
              </FadeIn>

              <FadeIn delay={600} dir="left">
                <div className="flex flex-wrap gap-4">
                  <button
                    className="vb-btn px-8 py-4 text-sm"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Book a Chair
                  </button>
                  <button
                    className="vb-btn vb-btn-outline px-8 py-4 text-sm"
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Services
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right image */}
            <div className="w-full md:w-[45%] h-[50vh] md:h-auto relative overflow-hidden bg-black">
              <img loading="lazy" src={heroImage} alt="Barbershop" className="w-full h-full object-cover opacity-80 vb-sepia-img" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-8 right-8 bg-white p-4 text-center vb-border transform rotate-[-5deg] shadow-lg">
                <div className="vb-border-dashed p-3">
                  <Scissors size={24} className="mx-auto mb-2" style={{ color: CRIMSON }} />
                  <div className="vb-display text-xl mb-1">WALK-INS</div>
                  <div className="text-xs font-bold uppercase">Welcome</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            CONTENT SECTIONS
        ════════════════════════════════════════ */}
        <div id="home-content">
          {sectionOrder
            .filter(s => s !== 'hero' && !hiddenSections.includes(s))
            .map(sectionId => {

              /* ── ABOUT ── */
              if (sectionId === 'about') return (
                <section key="about" id="about" className="py-20 sm:py-32 px-6 sm:px-12 relative border-b-2" style={{ borderColor: ESPRESSO }}>
                  <div className="max-w-5xl mx-auto text-center">
                    <FadeIn>
                      <div className="vb-ribbon mb-8 text-sm tracking-widest font-bold">OUR STORY</div>
                      <h2 className="vb-display text-4xl sm:text-5xl mb-10">
                        {content.settings_json?.about_title || 'A TRADITION OF EXCELLENCE'}
                      </h2>
                    </FadeIn>

                    <FadeIn delay={200}>
                      <div className="bg-white p-8 sm:p-12 vb-card relative text-left">
                        <Quote size={40} className="absolute top-6 left-6 opacity-10" />
                        <p className="vb-serif text-lg sm:text-2xl leading-relaxed italic text-center max-w-3xl mx-auto break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {(() => {
                            const t = content.settings_json?.about_description || content.about_text;
                            if (!t || t === 'Add your business description here.' || t.trim() === '') {
                              return 'Founded on the principles of old-school craftsmanship, our barbershop is a sanctuary for those who appreciate a quality cut, a straight razor shave, and good conversation.';
                            }
                            return t;
                          })()}
                        </p>
                      </div>
                    </FadeIn>

                    <FadeIn delay={400}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
                        {[['Master', 'Barbers'], ['Premium', 'Products'], ['Hot Towel', 'Shaves'], ['Classic', 'Atmosphere']].map(([top, bot], i) => (
                          <div key={i} className="p-4 border-2" style={{ borderColor: ESPRESSO, backgroundColor: 'rgba(255,255,255,0.4)' }}>
                            <div className="font-bold text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: CRIMSON }}>{top}</div>
                            <div className="vb-display text-sm sm:text-base lg:text-xl mt-1 truncate">{bot}</div>
                          </div>
                        ))}
                      </div>
                    </FadeIn>
                  </div>
                </section>
              );

              /* ── SERVICES ── */
              if (sectionId === 'services') return (
                <section key="services" id="services" className="py-20 sm:py-32 px-6 sm:px-12 border-b-2" style={{ borderColor: ESPRESSO, backgroundColor: '#EFE9DD' }}>
                  <div className="max-w-6xl mx-auto">
                    <FadeIn>
                      <div className="vb-line-decor mb-6">
                        <span className="vb-display text-4xl sm:text-5xl px-4">THE OFFERING</span>
                      </div>
                      <p className="text-center font-bold text-sm tracking-widest uppercase mb-16 opacity-70">Expert Grooming Services</p>
                    </FadeIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {salonServices.map((s: any, i: number) => (
                        <FadeIn key={i} delay={i * 100}>
                          <div 
                            onClick={() => setSelectedService(s)} 
                            className="vb-card flex flex-col sm:flex-row group cursor-pointer h-full"
                          >
                            <div className="w-full sm:w-2/5 h-48 sm:h-auto border-b-2 sm:border-b-0 sm:border-r-2 relative overflow-hidden" style={{ borderColor: ESPRESSO }}>
                              {s.image ? (
                                <img loading="lazy" src={s.image} alt={s.title || s.name} className="w-full h-full object-cover vb-sepia-img" />
                              ) : (
                                <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                                  <Scissors size={32} />
                                </div>
                              )}
                            </div>
                            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                              <h3 className="vb-display text-2xl mb-3 group-hover:text-[#9E2A2B] transition-colors">{s.title || s.name}</h3>
                              <p className="vb-serif text-base opacity-80 leading-relaxed mb-4">{s.description}</p>
                              <div className="mt-auto font-bold text-xs uppercase tracking-widest" style={{ color: CRIMSON }}>Read More ⟶</div>
                            </div>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                </section>
              );

              /* ── MENU / POPULAR STYLES ── */
              if (sectionId === 'menu') return (
                <section key="menu" id="menu" className="py-20 sm:py-32 px-6 sm:px-12 border-b-2" style={{ borderColor: ESPRESSO }}>
                  <div className="max-w-4xl mx-auto">
                    <FadeIn>
                      <div className="text-center mb-16">
                        <div className="inline-block vb-border-dashed p-4 bg-white shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                          <h2 className="vb-display text-4xl sm:text-5xl">BARBER MENU</h2>
                        </div>
                      </div>
                    </FadeIn>

                    <div className="space-y-6">
                      {haircutStyles.slice(0, 5).map((style: any, idx: number) => (
                        <FadeIn key={idx} delay={idx * 100}>
                          <div
                            onClick={() => setSelectedStyle(style)}
                            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 cursor-pointer p-4 hover:bg-black/5 transition-colors group border-b border-black/10 pb-6"
                          >
                            <div className="w-16 h-16 rounded-full overflow-hidden vb-border shrink-0 hidden sm:block">
                              <img loading="lazy" src={style.image} alt={style.name} className="w-full h-full object-cover vb-sepia-img" />
                            </div>
                            
                            <div className="flex-1 w-full text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                <h3 className="vb-display text-2xl group-hover:text-[#9E2A2B] transition-colors">{style.name}</h3>
                                <div className="hidden sm:block border-b-2 border-dotted border-black/30 flex-1 mx-4 relative top-[-6px]"></div>
                                <span className="vb-display text-2xl" style={{ color: CRIMSON }}>{style.price}</span>
                              </div>
                              <div className="flex items-center justify-center sm:justify-start gap-4 font-bold text-xs uppercase tracking-widest opacity-60">
                                <span className="flex items-center gap-1"><Clock size={12} /> {style.time}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Star size={12} /> {style.rating}</span>
                              </div>
                            </div>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                    
                    <FadeIn delay={600}>
                      <div className="text-center mt-12">
                        <button onClick={() => setShowAllProducts(true)} className="vb-btn vb-btn-outline px-8 py-3 text-sm">
                          View Full Menu
                        </button>
                      </div>
                    </FadeIn>
                  </div>
                </section>
              );

              /* ── GALLERY ── */
              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="py-20 sm:py-32 px-6 sm:px-12 border-b-2" style={{ borderColor: ESPRESSO, backgroundColor: '#EFE9DD' }}>
                  <div className="max-w-6xl mx-auto">
                    <FadeIn>
                      <div className="flex items-center justify-between mb-12">
                        <h2 className="vb-display text-4xl sm:text-5xl">THE GALLERY</h2>
                        <Camera size={32} className="opacity-50" />
                      </div>
                    </FadeIn>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                        <FadeIn key={idx} delay={idx * 100}>
                          <div
                            onClick={() => setSelectedImage(img)}
                            className="aspect-square bg-stone-300 vb-border cursor-pointer relative group overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.1)]"
                          >
                            <img loading="lazy" src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover vb-sepia-img" />
                            <div className="absolute inset-0 bg-[#9E2A2B]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="vb-display text-white text-xl border-2 border-white px-4 py-2">VIEW</span>
                            </div>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                </section>
              );

              /* ── CONTACT ── */
              if (sectionId === 'contact') return (
                <section key="contact" id="contact" className="py-20 sm:py-32 px-6 sm:px-12 border-b-2" style={{ borderColor: ESPRESSO }}>
                  <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <FadeIn dir="left">
                        <div className="vb-card p-8 sm:p-12 bg-white">
                          <h2 className="vb-display text-4xl mb-8">VISIT US</h2>
                          <div className="space-y-6">
                            {[
                              { Icon: MapPin, label: 'Location', value: content.contact_info?.address || '1920 Retro Ave, NY' },
                              { Icon: Phone, label: 'Telephone', value: content.contact_info?.phone || '+1 234 567 8900' },
                              { Icon: Mail, label: 'Telegram', value: content.contact_info?.email || 'hello@classic.com' },
                            ].map(({ Icon, label, value }) => (
                              <div key={label} className="flex items-start gap-4">
                                <div className="mt-1"><Icon size={20} style={{ color: CRIMSON }} /></div>
                                <div>
                                  <div className="font-bold text-xs uppercase tracking-widest opacity-60 mb-1">{label}</div>
                                  <div className="vb-serif text-lg font-bold">{value}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-10 pt-8 border-t-2" style={{ borderColor: ESPRESSO }}>
                            <div className="font-bold text-xs uppercase tracking-widest opacity-60 mb-3">Operating Hours</div>
                            <div className="vb-serif text-base space-y-1">
                              <div className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 7:00 PM</span></div>
                              <div className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 5:00 PM</span></div>
                              <div className="flex justify-between"><span>Sunday:</span> <span style={{ color: CRIMSON }}>Closed</span></div>
                            </div>
                          </div>
                        </div>
                      </FadeIn>

                      <FadeIn dir="right">
                        <div className="h-80 md:h-[500px] vb-border bg-stone-300 relative shadow-[8px_8px_0_rgba(0,0,0,0.15)]">
                          <iframe
                            title="Map"
                            className="absolute inset-0 w-full h-full grayscale contrast-125 sepia-[0.3]"
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'New York, USA')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          />
                        </div>
                      </FadeIn>
                    </div>
                  </div>
                </section>
              );

              /* ── CUSTOM BLOCKS ── */
              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="py-20 px-6 sm:px-12 border-b-2" style={{ borderColor: ESPRESSO }}>
                  <div className="max-w-4xl mx-auto vb-card p-8 sm:p-12 bg-white">
                    <h2 className="vb-display text-4xl mb-10 text-center">NOTICES</h2>
                    <div className="space-y-6">
                      {content.custom_blocks_json.map((block: any, i: number) => {
                        if (block.type === 'heading') return <h3 key={block.id || i} className="vb-display text-2xl text-center mt-8">{block.content}</h3>;
                        if (block.type === 'paragraph') return <p key={block.id || i} className="vb-serif text-lg leading-relaxed text-center">{block.content}</p>;
                        if (block.type === 'image' && block.url) return <div key={block.id || i} className="vb-border my-6"><img loading="lazy" src={block.url} alt="" className="w-full h-auto vb-sepia-img" /></div>;
                        if (block.type === 'divider') return <div key={block.id || i} className="vb-line-decor my-8"></div>;
                        return null;
                      })}
                    </div>
                  </div>
                </section>
              );

              return null;
            })}
        </div>

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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      <footer className="bg-[#1A130F] text-[#F4EFE6] py-16 px-6 sm:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h4 className="vb-display text-4xl mb-6">{siteName}</h4>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#F4EFE6] opacity-30"></div>
              <Scissors size={20} className="opacity-50" />
              <div className="w-12 h-px bg-[#F4EFE6] opacity-30"></div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold tracking-widest uppercase mb-12 opacity-80">
              {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#9E2A2B] transition-colors">{l}</a>
              ))}
            </div>

            <div className="text-xs opacity-50 space-y-2 font-bold tracking-wider uppercase">
              <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
              <p>Powered by Jaalam</p>
            </div>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            ALL PRODUCTS MODAL
        ════════════════════════════════════════ */}

        {/* ═══════════════════════════════════════
            STYLE DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedStyle && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStyle(null)}>
            <div
              className="w-full max-w-md bg-[#F4EFE6] vb-border shadow-[12px_12px_0_rgba(0,0,0,0.4)] text-left relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedStyle(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white vb-border hover:bg-black hover:text-white transition-colors">
                <X size={18} />
              </button>
              
              <div className="h-56 w-full bg-stone-900 overflow-hidden border-b-2" style={{ borderColor: ESPRESSO }}>
                <img loading="lazy" src={selectedStyle.image} alt={selectedStyle.name} className="w-full h-full object-cover vb-sepia-img" />
              </div>

              <div className="p-8">
                <h3 className="vb-display text-3xl mb-2">{selectedStyle.name}</h3>
                <div className="flex items-center gap-4 mb-6 font-bold text-xs uppercase tracking-widest opacity-80">
                  <span className="vb-display text-2xl opacity-100" style={{ color: CRIMSON }}>{selectedStyle.price}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {selectedStyle.time}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Star size={12} /> {selectedStyle.rating}</span>
                </div>

                <div className="w-full h-px bg-black/10 mb-6"></div>
                
                <p className="vb-serif text-base leading-relaxed mb-8">
                  {selectedStyle.description || 'A timeless cut executed with precision and care, guaranteed to leave a lasting impression.'}
                </p>

                <div className="flex gap-4">
                  <button
                    className="flex-1 vb-btn py-3"
                    onClick={() => { setSelectedStyle(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SERVICE DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedService && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-md bg-[#F4EFE6] vb-border shadow-[12px_12px_0_rgba(0,0,0,0.4)] text-left relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white vb-border hover:bg-black hover:text-white transition-colors">
                <X size={18} />
              </button>
              
              <div className="h-56 w-full bg-stone-900 overflow-hidden border-b-2" style={{ borderColor: ESPRESSO }}>
                {selectedService.image ? (
                  <img loading="lazy" src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover vb-sepia-img" />
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                    <Scissors size={40} />
                  </div>
                )}
              </div>

              <div className="p-8">
                <h3 className="vb-display text-3xl mb-4">{selectedService.title || selectedService.name}</h3>
                
                <div className="w-full h-px bg-black/10 mb-6"></div>
                
                <p className="vb-serif text-base leading-relaxed mb-8">
                  {selectedService.description}
                </p>

                <div className="flex gap-4">
                  <button
                    className="flex-1 vb-btn py-3"
                    onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Book Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            LIGHTBOX
        ════════════════════════════════════════ */}
        {selectedImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1A130F]/95 p-4 md:p-12 cursor-pointer" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white border-2 border-white/20 hover:bg-white hover:text-black transition-all"
              onClick={e => { e.stopPropagation(); setSelectedImage(null); }}>
              <X size={24} />
            </button>
            <img loading="lazy" src={selectedImage} alt="Gallery" className="max-w-full max-h-full object-contain vb-border shadow-[16px_16px_0_rgba(0,0,0,0.5)] bg-[#F4EFE6] p-2" onClick={e => e.stopPropagation()} />
          </div>
        )}

      
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={content?.products_json || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
    </>
  );
}

