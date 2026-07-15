import React, { useState, useEffect, useRef } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, Mail, ChevronRight, X, Dumbbell, Activity, ShieldCheck, Flame, Menu, Check, Clock } from 'lucide-react';

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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ease-out ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function HardcoreIronTheme({ website, content }: Props) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewProductsPage, setViewProductsPage] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'IRON FORGE';
  const address   = content.contact_info?.address || '100 Heavy Metal Blvd';

  /* ─── Palette ─── */
  const BLACK      = '#0D0D0D';
  const CHARCOAL   = '#1A1A1A';
  const NEON_RED   = '#FF2A2A';
  const WHITE      = '#FFFFFF';
  const GRAY       = '#808080';

  /* ─── Data ─── */
  const defaultProducts = [
    { name: 'Whey Protein Isolate', time: '5 lbs', price: '?59', rating: 4.8, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=500&q=80', description: 'Premium grass-fed whey protein isolate for maximum muscle recovery.' },
    { name: 'Pre-Workout Matrix', time: '30 Servings', price: '?39', rating: 4.9, image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=500&q=80', description: 'High-stimulant pre-workout to crush your heavy lifting sessions.' },
    { name: 'Leather Lifting Belt', time: 'Gear', price: '?75', rating: 5.0, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=500&q=80', description: '10mm thick genuine leather belt for extreme core support.' },
  ];

  const products = content.products_json?.length > 0
    ? content.products_json.map((p: any) => ({
        name: p.name || p.title || 'Product',
        price: p.price || '?0',
        time: p.subtitle || '',
        description: p.description || 'Premium fitness gear.',
        rating: 5.0,
        image: p.image || defaultProducts[0].image,
      }))
    : defaultProducts;

  const defaultServices = [
    { title: 'Personal Training', description: '1-on-1 coaching with elite strength trainers.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
    { title: 'Powerlifting Classes', description: 'Master the big three lifts with expert form correction.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
    { title: 'HIIT Bootcamp', description: 'High-intensity interval training to shred fat.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' }
  ];

  const gymServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80';

  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json.map((img: string) => img || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80') : [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Teko:wght@500;700&family=Inter:wght@400;700;900&display=swap');

        .hi-heading { font-family: 'Teko', sans-serif; text-transform: uppercase; }
        .hi-subheading { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        .hi-body { font-family: 'Inter', sans-serif; }

        .hi-bg-dark { background-color: ${BLACK}; color: ${WHITE}; }
        .hi-bg-charcoal { background-color: ${CHARCOAL}; color: ${WHITE}; }
        .hi-text-neon { color: ${NEON_RED}; }
        .hi-border-neon { border-color: ${NEON_RED}; }

        .hi-btn {
          position: relative;
          background: ${NEON_RED};
          color: ${WHITE};
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          border: 2px solid ${NEON_RED};
          overflow: hidden;
          z-index: 1;
          transform: skewX(-10deg);
        }
        .hi-btn > span {
          display: inline-block;
          transform: skewX(10deg);
        }
        .hi-btn:hover {
          background: transparent;
          color: ${NEON_RED};
        }
        .hi-btn-outline {
          background: transparent;
          color: ${WHITE};
          border: 2px solid ${WHITE};
        }
        .hi-btn-outline:hover {
          background: ${WHITE};
          color: ${BLACK};
          border-color: ${WHITE};
        }

        .hi-card {
          position: relative;
          background: ${CHARCOAL};
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        .hi-card:hover {
          border-left: 4px solid ${NEON_RED};
          transform: translateX(5px);
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${BLACK}; }
        ::-webkit-scrollbar-thumb { background: ${NEON_RED}; }
        
        .diagonal-stripes {
          background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.03) 10px, rgba(255, 255, 255, 0.03) 20px);
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="hi-body w-full min-h-screen overflow-x-hidden hi-bg-dark selection:bg-[#FF2A2A] selection:text-white">

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between absolute top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/10">
          <div className="hi-heading text-3xl md:text-4xl font-bold tracking-wider text-white flex items-center gap-3">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 object-cover rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/20" />
            ) : (
              <Dumbbell size={32} className="hi-text-neon" />
            )}
            <span className="mt-1">{siteName}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 hi-subheading text-lg tracking-wider text-gray-300">
            {['About', 'Training', 'Products', 'Gallery', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#FF2A2A] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          <button className="md:hidden text-white hover:text-[#FF2A2A] transition-colors p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#0D0D0D] pt-24 px-6 flex flex-col gap-6">
            {['About', 'Training', 'Products', 'Gallery', 'Contact'].map(l => (
              <a 
                key={l} 
                href={`#${l.toLowerCase()}`} 
                className="hi-heading text-4xl text-left text-white hover:text-[#FF2A2A] transition-colors pb-4 border-b border-white/10"
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
          <div className="relative min-h-[100svh] flex flex-col justify-center px-6 pt-32 pb-16">
            <div className="absolute inset-0 z-0">
              <img loading="lazy" src={heroImage} alt="Hero" className="w-full h-full object-cover grayscale-[80%] opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent"></div>
              <div className="absolute inset-0 diagonal-stripes"></div>
            </div>
            
            <div className="relative z-10 max-w-5xl mx-auto w-full md:ml-12 lg:ml-24">
              <FadeIn delay={0} dir="left">
                <div className="inline-block bg-[#FF2A2A] text-white px-4 py-1 hi-subheading text-sm md:text-base tracking-widest mb-6 skew-x-[-10deg]">
                  <span className="inline-block skew-x-[10deg]">NO EXCUSES. JUST RESULTS.</span>
                </div>
              </FadeIn>

              <FadeIn delay={200} dir="left">
                <h1 className="hi-heading text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] leading-[0.9] text-white mb-6 break-words uppercase">
                  {content.hero_title || content.settings_json?.hero_title || 'FORGE YOUR LEGACY'}
                </h1>
              </FadeIn>

              <FadeIn delay={400} dir="left">
                <p className="text-base md:text-xl text-gray-400 max-w-xl mb-10 font-bold leading-relaxed break-words whitespace-pre-wrap overflow-hidden px-1 border-l-4 border-[#FF2A2A] pl-4">
                  {(() => {
                    const t = content.about_text || content.settings_json?.hero_description || content.hero_text;
                    if (!t || t === 'Add your business description here.' || t.trim() === '') {
                      return 'Join the elite. Train in a facility designed for maximum intensity and optimal performance.';
                    }
                    return t;
                  })()}
                </p>
              </FadeIn>

              <FadeIn delay={600} dir="up">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <button
                    className="hi-btn px-10 py-4 text-lg w-full sm:w-auto"
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>Join Now</span>
                  </button>
                  <button
                    className="hi-btn hi-btn-outline px-10 py-4 text-lg w-full sm:w-auto"
                    onClick={() => document.getElementById('training')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>View Training</span>
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
              <section key="about" id="about" className="py-20 md:py-32 px-6 hi-bg-charcoal relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                  <Dumbbell size={600} className="absolute -top-20 -right-20 rotate-45" />
                </div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <FadeIn dir="left">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Activity className="hi-text-neon" size={24} />
                        <span className="hi-subheading text-gray-400 tracking-widest text-sm">About The Forge</span>
                      </div>
                      <h2 className="hi-heading text-5xl md:text-7xl text-white mb-8 leading-[0.9] break-words">
                        {content.settings_json?.about_title || 'IRON SHARPENS IRON'}
                      </h2>
                      <p className="text-gray-400 text-lg leading-relaxed mb-8 font-bold break-words whitespace-pre-wrap overflow-hidden">
                        {(() => {
                          const t = content.settings_json?.about_description || content.about_text;
                          if (!t || t === 'Add your business description here.' || t.trim() === '') {
                            return 'We are not just a gym. We are a community of hard workers dedicated to pushing limits and breaking plateaus. Our state-of-the-art facility is equipped with everything you need to build serious strength and endurance.';
                          }
                          return t;
                        })()}
                      </p>
                      <div className="grid grid-cols-2 gap-6 mt-8">
                        {['Elite Equipment', 'Expert Trainers', '24/7 Access', 'Heavy Weights'].map((feat, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <ShieldCheck className="hi-text-neon shrink-0" size={20} />
                            <span className="text-white font-bold text-sm uppercase tracking-wider">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                  <FadeIn dir="right" delay={200}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FF2A2A] translate-x-4 translate-y-4"></div>
                      <img loading="lazy" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" alt="About Gym" className="relative z-10 w-full h-auto object-cover grayscale" />
                    </div>
                  </FadeIn>
                </div>
              </section>
            );

            /* ── SERVICES (TRAINING) ── */
            case 'services': return (
              <section key="services" id="training" className="py-20 md:py-32 px-6 bg-[#0D0D0D]">
                <div className="max-w-6xl mx-auto">
                  <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-2 border-white/10 pb-8">
                      <div>
                        <span className="hi-subheading text-[#FF2A2A] tracking-widest text-sm block mb-2">Our Disciplines</span>
                        <h2 className="hi-heading text-5xl md:text-7xl text-white">TRAINING PROTOCOLS</h2>
                      </div>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gymServices.map((s: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div 
                          className="group cursor-pointer hi-card bg-[#1A1A1A] h-full flex flex-col overflow-hidden"
                          onClick={() => setSelectedService(s)}
                        >
                          <div className="h-48 relative overflow-hidden">
                            {s.image ? (
                              <img loading="lazy" src={s.image} alt={s.title || s.name} className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0" />
                            ) : (
                              <div className="w-full h-full bg-black flex items-center justify-center">
                                <Flame size={48} className="text-[#FF2A2A]" />
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-[#FF2A2A] w-10 h-10 flex items-center justify-center -skew-x-12">
                              <span className="skew-x-12 text-white font-bold">0{idx + 1}</span>
                            </div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                            <h3 className="hi-heading text-3xl text-white mb-3 uppercase tracking-wide break-words">{s.title || s.name}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 font-bold break-words whitespace-pre-wrap">{s.description}</p>
                            <div className="flex items-center gap-2 text-[#FF2A2A] font-bold text-sm tracking-widest uppercase mt-auto hi-subheading">
                              Details <ChevronRight size={18} className="transition-transform group-hover:translate-x-2" />
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── MENU / PRODUCTS ── */
            case 'menu': return (
              <section key="menu" id="products" className="py-20 md:py-32 px-6 bg-[#1A1A1A] diagonal-stripes">
                <div className="max-w-6xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-16">
                      <span className="hi-subheading text-[#FF2A2A] tracking-widest text-sm block mb-2">Products</span>
                      <h2 className="hi-heading text-5xl md:text-7xl text-white bg-[#1A1A1A] inline-block px-4">SHOP GEAR</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.slice(0, 3).map((product: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150} dir="up">
                        <div
                          className={`bg-[#0D0D0D] border-2 flex flex-col p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${idx === 1 ? 'border-[#FF2A2A] shadow-[0_0_30px_rgba(255,42,42,0.15)]' : 'border-white/10 hover:border-white/30'}`}
                        >
                          {idx === 1 && (
                            <div className="absolute top-6 -right-12 bg-[#FF2A2A] text-white hi-subheading text-sm py-1 px-12 rotate-45 tracking-widest shadow-lg z-10">
                              POPULAR
                            </div>
                          )}
                          <div className="w-full h-48 mb-6 overflow-hidden bg-black relative border border-white/10">
                            <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 mix-blend-luminosity hover:mix-blend-normal" />
                          </div>
                          <h3 className="hi-heading text-4xl text-white mb-2 break-words">{product.name}</h3>
                          <div className="flex items-end gap-2 mb-6 break-words">
                            <span className="hi-heading text-5xl text-[#FF2A2A] leading-none break-words">{product.price}</span>
                            {product.time && <span className="text-gray-500 hi-subheading mb-1 uppercase break-words">/ {product.time}</span>}
                          </div>
                          <p className="text-gray-400 text-sm font-bold mb-8 flex-1 min-w-0 break-words whitespace-pre-wrap">{product.description}</p>
                          
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className={`w-full py-4 hi-subheading text-lg tracking-widest uppercase transition-colors border-2 ${idx === 1 ? 'bg-[#FF2A2A] text-white border-[#FF2A2A] hover:bg-transparent hover:text-[#FF2A2A]' : 'bg-transparent text-white border-white/20 hover:border-white hover:bg-white hover:text-black'}`}
                          >
                            View Details
                          </button>
                        </div>
                      </FadeIn>
                    ))}
                  </div>

                  {products.length > 0 && (
                    <FadeIn delay={200} dir="up">
                      <div className="mt-16 text-center">
                        <button
                          className="hi-btn hi-btn-outline px-12 py-4 text-lg inline-block"
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
              <section key="gallery" id="gallery" className="py-20 md:py-32 px-6 bg-[#0D0D0D]">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                      <div>
                        <h2 className="hi-heading text-5xl md:text-7xl text-white">THE FACILITY</h2>
                      </div>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div
                          onClick={() => setSelectedImage(img)}
                          className="aspect-square cursor-pointer relative group overflow-hidden bg-[#1A1A1A]"
                        >
                          <img loading="lazy" src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-[#FF2A2A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/80 p-3 rounded-full">
                              <Activity className="text-[#FF2A2A]" size={24} />
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── CONTACT ── */
            case 'contact': return (
              <section key="contact" id="contact" className="py-20 md:py-32 px-6 bg-[#1A1A1A]">
                <div className="max-w-6xl mx-auto">
                  <div className="bg-[#0D0D0D] border-t-4 border-[#FF2A2A] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <FadeIn dir="left">
                      <div>
                        <h2 className="hi-heading text-5xl md:text-7xl text-white mb-6 uppercase">Join The Ranks</h2>
                        <p className="text-gray-400 mb-10 font-bold leading-relaxed max-w-md">Ready to put in the work? Drop by the facility or send us a message to schedule your orientation.</p>
                        
                        <div className="space-y-6">
                          <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#FF2A2A] transition-colors -skew-x-12">
                              <MapPin className="text-[#FF2A2A] group-hover:text-white skew-x-12 transition-colors" size={20} />
                            </div>
                            <div>
                              <h4 className="hi-subheading text-white text-lg tracking-widest">LOCATION</h4>
                              <p className="text-gray-400 font-bold">{address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#FF2A2A] transition-colors -skew-x-12">
                              <Phone className="text-[#FF2A2A] group-hover:text-white skew-x-12 transition-colors" size={20} />
                            </div>
                            <div>
                              <h4 className="hi-subheading text-white text-lg tracking-widest">PHONE</h4>
                              <p className="text-gray-400 font-bold">{content.contact_info?.phone || '(555) 123-4567'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#FF2A2A] transition-colors -skew-x-12">
                              <Mail className="text-[#FF2A2A] group-hover:text-white skew-x-12 transition-colors" size={20} />
                            </div>
                            <div>
                              <h4 className="hi-subheading text-white text-lg tracking-widest">EMAIL</h4>
                              <p className="text-gray-400 font-bold">{content.contact_info?.email || 'train@ironforge.com'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                    
                    <FadeIn dir="up" delay={200}>
                      <div className="space-y-12">
                        {/* Working Hours */}
                        <div>
                          <div className="flex items-center gap-4 mb-6 group">
                            <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#FF2A2A] transition-colors -skew-x-12">
                              <Clock className="text-[#FF2A2A] group-hover:text-white skew-x-12 transition-colors" size={20} />
                            </div>
                            <h4 className="hi-subheading text-white text-xl tracking-widest uppercase">Training Hours</h4>
                          </div>
                          <div className="space-y-4 pl-[4.5rem]">
                            <div className="text-gray-400 font-bold whitespace-pre-line leading-relaxed border-l-2 border-[#FF2A2A] pl-4">
                              {content.contact_info?.hours || "MONDAY - FRIDAY: 05:00 - 23:00\nSATURDAY: 07:00 - 21:00\nSUNDAY: 08:00 - 20:00"}
                            </div>
                          </div>
                        </div>

                        {/* Social Media & Map */}
                        <div>
                           <div className="flex items-center gap-4 mb-6 group">
                            <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#FF2A2A] transition-colors -skew-x-12">
                              <Activity className="text-[#FF2A2A] group-hover:text-white skew-x-12 transition-colors" size={20} />
                            </div>
                            <h4 className="hi-subheading text-white text-xl tracking-widest uppercase">Connect & Visit</h4>
                          </div>
                          
                          <div className="pl-[4.5rem] space-y-6">
                            <div className="flex gap-4">
                              {/* Instagram */}
                              <a href={content.contact_info?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-white/10 flex items-center justify-center hover:bg-[#FF2A2A] hover:border-[#FF2A2A] transition-all -skew-x-12 group/icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover/icon:text-white skew-x-12 transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                              </a>
                              {/* Facebook */}
                              <a href={content.contact_info?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-white/10 flex items-center justify-center hover:bg-[#FF2A2A] hover:border-[#FF2A2A] transition-all -skew-x-12 group/icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover/icon:text-white skew-x-12 transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                              </a>
                              {/* WhatsApp */}
                              <a href={content.contact_info?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-white/10 flex items-center justify-center hover:bg-[#FF2A2A] hover:border-[#FF2A2A] transition-all -skew-x-12 group/icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover/icon:text-white skew-x-12 transition-colors"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                              </a>
                            </div>
                          </div>
                          <div className="w-full h-64 md:h-80 mt-8 bg-[#1A1A1A] relative overflow-hidden border-2 border-white/10">
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
                        </div>
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
                <section key="custom" id="custom" className="py-24 md:py-32 px-6 bg-[#0D0D0D]">
                  <div className="max-w-4xl mx-auto space-y-8">
                    {content.custom_blocks_json.map((block: any) => {
                      switch (block.type) {
                        case 'heading':
                          return <h2 key={block.id} className="hi-heading text-4xl md:text-5xl text-white tracking-widest text-center mt-12 mb-6 uppercase break-words whitespace-pre-wrap">{block.content}</h2>;
                        case 'paragraph':
                          return <p key={block.id} className="text-gray-400 font-bold whitespace-pre-line leading-relaxed text-lg text-center break-words whitespace-pre-wrap">{block.content}</p>;
                        case 'image':
                          return (
                            <div key={block.id} className="w-full relative group overflow-hidden border-2 border-white/10 my-8">
                              <img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                              <div className="absolute inset-0 bg-[#FF2A2A]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                          );
                        case 'divider':
                          return (
                            <div key={block.id} className="flex items-center justify-center py-12">
                              <div className="w-24 h-1 bg-[#FF2A2A]"></div>
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

      <footer className="bg-[#0D0D0D] py-16 px-6 text-center border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20 mx-auto mb-6" />
            ) : (
              <Dumbbell size={48} className="hi-text-neon mx-auto mb-6" />
            )}
            <h4 className="hi-heading text-5xl text-white mb-8 tracking-widest">{siteName}</h4>
            
            <div className="flex flex-wrap justify-center gap-8 hi-subheading text-sm tracking-widest uppercase mb-12 text-gray-500">
              {['About', 'Training', 'Products', 'Gallery', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>

            <p className="font-bold text-gray-600 text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} {siteName}. No Excuses.<br/>
              <span className="opacity-50 mt-2 inline-block">Powered by Jaalam</span>
            </p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            FULL SCREEN PRODUCTS PAGE
        ════════════════════════════════════════ */}
        

        {/* ═══════════════════════════════════════
            PRODUCT DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0D0D0D]/95 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
            <div
              className="w-full max-w-[320px] sm:max-w-sm bg-[#1A1A1A] border-l-4 border-[#FF2A2A] text-left relative shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-[#FF2A2A] rounded-full transition-colors">
                <X size={16} />
              </button>
              
              <div className="h-32 sm:h-48 w-full relative shrink-0">
                <img loading="lazy" src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover grayscale mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"></div>
              </div>

              <div className="p-5 sm:p-6 -mt-8 relative z-10 overflow-y-auto shrink">
                <h3 className="hi-heading text-3xl text-white mb-1">{selectedProduct.name}</h3>
                
                <div className="flex items-end gap-2 mb-4">
                  <span className="hi-heading text-3xl text-[#FF2A2A] leading-none">{selectedProduct.price}</span>
                  {selectedProduct.time && <span className="hi-subheading text-gray-400 text-sm mb-0.5">/ {selectedProduct.time}</span>}
                </div>
                
                <p className="text-gray-300 font-bold text-sm leading-relaxed mb-5">
                  {selectedProduct.description}
                </p>

                <div className="space-y-2 mb-6">
                  {['Premium Quality', 'Tested for Purity', 'Satisfaction Guaranteed'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={16} className="text-[#FF2A2A]" />
                      <span className="text-white font-bold text-xs uppercase">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="hi-btn w-full py-3 text-base"
                  onClick={() => { setSelectedProduct(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SERVICE DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0D0D0D]/95 backdrop-blur-sm" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-[320px] sm:max-w-sm bg-[#1A1A1A] border-l-4 border-[#FF2A2A] text-left relative shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-[#FF2A2A] rounded-full transition-colors">
                <X size={16} />
              </button>
              
              <div className="h-32 sm:h-48 w-full relative shrink-0">
                {selectedService.image ? (
                  <img loading="lazy" src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover grayscale mix-blend-luminosity" />
                ) : (
                  <div className="w-full h-full bg-[#0D0D0D] flex items-center justify-center">
                    <Flame size={40} className="text-[#FF2A2A] opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent"></div>
              </div>

              <div className="p-5 sm:p-6 -mt-8 relative z-10 overflow-y-auto shrink">
                <h3 className="hi-heading text-3xl text-white mb-4 uppercase leading-none">{selectedService.title || selectedService.name}</h3>
                
                <p className="text-gray-300 font-bold text-sm leading-relaxed mb-6">
                  {selectedService.description}
                </p>

                <button
                  className="hi-btn w-full py-3 text-base"
                  onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            IMAGE LIGHTBOX
        ════════════════════════════════════════ */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-[#FF2A2A] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <img loading="lazy" src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain shadow-2xl border-2 border-[#1A1A1A]"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
    </>
  );
}

