import React, { useState, useEffect, useRef } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, Mail, X, Swords, Target, Flame, ArrowRight, Menu } from 'lucide-react';

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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[400ms] ease-out ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function CombatGymTheme({ website, content }: Props) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewProductsPage, setViewProductsPage] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'BLOODSPORT ACADEMY';
  const address   = content.contact_info?.address || 'Underground Level 4, Fight District';

  /* ─── Palette ─── */
  const BLACK      = '#050505';
  const OFF_BLACK  = '#111111';
  const BLOOD_RED  = '#D90429';
  const DARK_RED   = '#8D0801';
  const WHITE      = '#FFFFFF';
  const SLATE      = '#2B2D42';

  /* ─── Data ─── */
  const defaultProducts = [
    { name: 'Boxing Gloves', time: '16oz', price: '?85', rating: 4.8, image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=500&q=80', description: 'Premium leather training gloves for bag work and sparring.' },
    { name: 'Shin Guards', time: 'Pro', price: '?75', rating: 5.0, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80', description: 'High-density foam protection for heavy kicks.' },
    { name: 'Recovery Shake', time: 'Protein', price: '?45', rating: 5.0, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=500&q=80', description: 'Post-training recovery formula to rebuild muscle.' },
  ];

  const products = content.products_json?.length > 0 ? content.products_json.map((p: any) => ({
    name: p.name || p.title || 'Gear',
    price: p.price || '?0',
    time: p.subtitle || '',
    description: p.description || 'Premium combat gear.',
    rating: 5.0,
    image: p.image || defaultProducts[0].image,
  })) : defaultProducts;

  const defaultServices = [
    { title: 'Muay Thai', description: 'The art of eight limbs. Devastating strikes using fists, elbows, knees, and shins.', image: 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&w=600&q=80' },
    { title: 'Brazilian Jiu-Jitsu', description: 'Ground fighting and submission grappling. Technique overcomes strength.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80' },
    { title: 'Boxing', description: 'Sweet science. Footwork, head movement, and heavy hands.', image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=80' }
  ];

  const gymServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1600&q=80';

  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json.map((img: string) => img || 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&w=600&q=80') : [
    'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1622599511051-16f55a1234d0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  ];


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;import ProductBuyButton from '../../payments/ProductBuyButton';
700&family=Oswald:wght@400;700&display=swap');

        .cg-heading { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 1; }
        .cg-body { font-family: 'Oswald', sans-serif; }
        .cg-subheading { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }

        .cg-bg-black { background-color: ${BLACK}; color: ${WHITE}; }
        .cg-bg-offblack { background-color: ${OFF_BLACK}; color: ${WHITE}; }
        .cg-bg-red { background-color: ${BLOOD_RED}; color: ${WHITE}; }
        .cg-text-red { color: ${BLOOD_RED}; }

        .cg-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 3rem;
          background-color: ${BLOOD_RED};
          color: ${WHITE};
          font-family: 'Teko', sans-serif;
          font-size: 1.8rem;
          text-transform: uppercase;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .cg-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; h-full;
          background-color: ${WHITE};
          transition: left 0.3s ease;
          z-index: -1;
        }
        .cg-btn:hover::before {
          left: 0;
        }
        .cg-btn:hover {
          color: ${BLOOD_RED};
        }
        
        .cg-btn-outline {
          background-color: transparent;
          color: ${WHITE};
          border: 2px solid ${WHITE};
        }
        .cg-btn-outline::before {
          background-color: ${WHITE};
        }
        .cg-btn-outline:hover {
          color: ${BLACK};
          border-color: ${WHITE};
        }

        .cg-card {
          background-color: ${OFF_BLACK};
          border-left: 4px solid transparent;
          transition: all 0.3s ease;
        }
        .cg-card:hover {
          border-left-color: ${BLOOD_RED};
          transform: translateX(8px);
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${BLACK}; }
        ::-webkit-scrollbar-thumb { background: ${BLOOD_RED}; }
        
        .diagonal-cut {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 4rem), 0 100%);
        }
        .diagonal-cut-bottom {
          clip-path: polygon(0 4rem, 100% 0, 100% 100%, 0 100%);
        }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="cg-body w-full min-h-screen overflow-x-hidden cg-bg-black selection:bg-[#D90429] selection:text-white">

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 md:px-12 py-4 flex items-center justify-between absolute top-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
          <div className="cg-heading text-5xl text-white flex items-center gap-2 tracking-wide">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 object-cover rounded-full shadow-lg border border-white/20" />
            ) : (
              <Swords size={32} className="text-[#D90429]" />
            )}
            <span className="mt-2">{siteName}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 cg-subheading text-lg text-white">
            {['Discipline', 'Arts', 'Enlist', 'Arena', 'Contact'].map((l, i) => {
              const refs = ['about', 'services', 'menu', 'gallery', 'contact'];
              return (
                <a key={l} href={`#${refs[i]}`} className="hover:text-[#D90429] transition-colors relative group">
                  {l}
                </a>
              );
            })}
          </nav>
          
          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#050505] pt-24 px-6 flex flex-col gap-6 items-center">
            {['Discipline', 'Arts', 'Enlist', 'Arena', 'Contact'].map((l, i) => {
              const refs = ['about', 'services', 'menu', 'gallery', 'contact'];
              return (
                <a 
                  key={l} 
                  href={`#${refs[i]}`} 
                  className="cg-heading text-6xl text-white hover:text-[#D90429] transition-colors"
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
          <div className="relative min-h-[100svh] flex flex-col justify-center px-6 pt-32 pb-16 diagonal-cut">
            <div className="absolute inset-0 z-0 bg-black">
              <img loading="lazy" src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-40 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <FadeIn delay={0} dir="left">
                  <div className="inline-flex items-center gap-2 bg-[#D90429] text-white px-4 py-1 cg-subheading text-lg mb-6">
                    <Flame size={18} /> NO EXCUSES. NO LIMITS.
                  </div>
                </FadeIn>

                <FadeIn delay={200} dir="left">
                  <h1 className="cg-heading text-7xl sm:text-8xl md:text-[8rem] text-white mb-6 break-words whitespace-pre-wrap">
                    {content.hero_title || content.settings_json?.hero_title || 'FORGE YOUR WEAPON'}
                  </h1>
                </FadeIn>

                <FadeIn delay={400} dir="left">
                  <p className="cg-body text-xl text-gray-300 max-w-xl mb-12 font-light break-words whitespace-pre-wrap">
                    {(() => {
                      const t = content.about_text || content.settings_json?.hero_description || content.hero_text;
                      if (!t || t === 'Add your business description here.' || t.trim() === '') {
                        return 'Train alongside champions. Whether you want to step into the cage or just get into fighting shape, our elite coaches will push you beyond your breaking point.';
                      }
                      return t;
                    })()}
                  </p>
                </FadeIn>

                <FadeIn delay={600} dir="left">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <button className="cg-btn" onClick={() => (document.getElementById('menu') || document.getElementById('offers') || document.getElementById('products') || document.getElementById('about'))?.scrollIntoView({ behavior: 'smooth' })}>
                      Start Training
                    </button>
                    <button className="cg-btn cg-btn-outline" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                      View Disciplines
                    </button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        {sectionOrder.map(sectionId => {
          if (hiddenSections.includes(sectionId)) return null;

          switch (sectionId) {
            
            /* ── ABOUT ── */
            case 'about': return (
              <section key="about" id="about" className="py-24 md:py-32 px-6 cg-bg-black mt-[-5svh]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 order-2 lg:order-1">
                    <FadeIn dir="left">
                      <span className="cg-subheading text-[#D90429] mb-2 block">THE ACADEMY</span>
                      <h2 className="cg-heading text-6xl md:text-7xl text-white mb-6 break-words whitespace-pre-wrap">
                        {content.settings_json?.about_title || 'BLOOD, SWEAT, AND RESPECT'}
                      </h2>
                      <div className="w-16 h-1 bg-[#D90429] mb-8"></div>
                      <p className="cg-body text-gray-400 text-lg leading-relaxed mb-8 break-words whitespace-pre-wrap">
                        {(() => {
                          const t = content.settings_json?.about_description || content.about_text;
                          if (!t || t === 'Add your business description here.' || t.trim() === '') {
                            return 'We don’t do cardio kickboxing. We teach authentic combat sports. Our facility is home to professional fighters, aspiring amateurs, and dedicated martial artists who are serious about their craft.';
                          }
                          return t;
                        })()}
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="cg-heading text-4xl text-[#D90429]">10+</h4>
                          <p className="cg-subheading text-gray-400 text-sm">PRO FIGHTERS</p>
                        </div>
                        <div>
                          <h4 className="cg-heading text-4xl text-[#D90429]">25</h4>
                          <p className="cg-subheading text-gray-400 text-sm">ELITE COACHES</p>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                  <div className="lg:col-span-7 order-1 lg:order-2">
                    <FadeIn dir="right">
                      <div className="relative">
                        <img loading="lazy" src="https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&w=1000&q=80" alt="Training" className="w-full h-auto object-cover grayscale brightness-75 contrast-125" />
                        <div className="absolute top-0 right-0 w-full h-full border-4 border-[#D90429] translate-x-4 -translate-y-4 -z-10"></div>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </section>
            );

            /* ── SERVICES (ARTS) ── */
            case 'services': return (
              <section key="services" id="services" className="py-24 md:py-32 px-6 cg-bg-offblack">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="mb-16">
                      <span className="cg-subheading text-[#D90429] mb-2 block">DISCIPLINES</span>
                      <h2 className="cg-heading text-6xl md:text-7xl text-white">MARTIAL ARTS</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {gymServices.map((s: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div 
                          className="cg-card group cursor-pointer flex flex-col h-full bg-[#050505] overflow-hidden"
                          onClick={() => setSelectedService(s)}
                        >
                          <div className="h-64 relative overflow-hidden">
                            {s.image ? (
                              <img loading="lazy" src={s.image} alt={s.title || s.name} className="w-full h-full object-cover grayscale opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                            ) : (
                              <div className="w-full h-full bg-[#111] flex items-center justify-center">
                                <Target size={64} className="text-[#333]" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050505] to-transparent"></div>
                            <h3 className="absolute bottom-4 left-6 right-6 cg-heading text-5xl text-white z-10 break-words">{s.title || s.name}</h3>
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <p className="cg-body text-gray-400 text-lg leading-relaxed flex-1 mb-6 break-words whitespace-pre-wrap">{s.description}</p>
                            <div className="flex items-center gap-2 text-[#D90429] cg-subheading group-hover:text-white transition-colors">
                              ENTER THE DOJO <ArrowRight size={20} />
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
              <section key="menu" id="menu" className="py-24 md:py-32 px-6 cg-bg-black diagonal-cut-bottom">
                <div className="max-w-6xl mx-auto">
                  <FadeIn>
                    <div className="text-center mb-20">
                      <h2 className="cg-heading text-6xl md:text-7xl text-white mb-2">EQUIPMENT</h2>
                      <span className="cg-subheading text-[#D90429]">FORGE YOUR ARMOR</span>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.slice(0, 3).map((product: any, idx: number) => (
                      <FadeIn key={idx} delay={idx * 150} dir="up">
                        <div
                          className={`flex flex-col bg-[#111] p-8 h-full border border-[#222] transition-transform duration-300 hover:-translate-y-2 group ${idx === 1 ? 'border-[#D90429]' : ''}`}
                        >
                          {idx === 1 && (
                            <div className="bg-[#D90429] text-white text-center cg-subheading py-1 mb-6">BEST SELLER</div>
                          )}
                          <div className="w-full h-48 mb-6 overflow-hidden bg-black border border-[#222]">
                            <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                          </div>
                          <h3 className="cg-heading text-5xl text-white mb-1 break-words">{product.name}</h3>
                          <p className="cg-subheading text-gray-500 mb-6 break-words">{product.time}</p>
                          
                          <div className="cg-heading text-6xl text-[#D90429] mb-6 break-words">
                            {product.price}
                          </div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={product} content={content} /></div>
                          
                          <p className="cg-body text-gray-400 leading-relaxed mb-8 flex-1 min-w-0 break-words whitespace-pre-wrap">
                            {product.description}
                          </p>
                          
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className={`w-full py-4 cg-subheading tracking-widest uppercase transition-colors border ${idx === 1 ? 'bg-[#D90429] text-white border-[#D90429] hover:bg-transparent hover:text-[#D90429]' : 'bg-transparent text-white border-[#333] hover:border-white'}`}
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
                          className="cg-btn cg-btn-outline px-12 py-4 text-lg inline-block border border-white text-white hover:bg-white hover:text-black"
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
              <section key="gallery" id="gallery" className="py-24 md:py-32 px-4 cg-bg-offblack">
                <div className="max-w-7xl mx-auto">
                  <FadeIn>
                    <div className="mb-12 text-center">
                      <h2 className="cg-heading text-6xl md:text-7xl text-white">THE ARENA</h2>
                    </div>
                  </FadeIn>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                      <FadeIn key={idx} delay={idx * 100}>
                        <div
                          onClick={() => setSelectedImage(img)}
                          className="aspect-square cursor-pointer overflow-hidden relative group"
                        >
                          <img loading="lazy" src={img} alt={`Gym ${idx + 1}`} className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0" />
                          <div className="absolute inset-0 bg-[#D90429]/0 group-hover:bg-[#D90429]/20 transition-colors duration-300 mix-blend-overlay"></div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>
            );

            /* ── CONTACT ── */
            case 'contact': return (
              <section key="contact" id="contact" className="py-24 md:py-32 px-6 cg-bg-black">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-[#111] border-l-4 border-[#D90429] p-8 md:p-12">
                    <FadeIn dir="left">
                      <div>
                        <h2 className="cg-heading text-6xl text-white mb-6">STEP INTO THE RING</h2>
                        <p className="cg-body text-gray-400 text-lg mb-10">Ready to test yourself? Send us a message or drop by the gym during operating hours.</p>
                        
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <MapPin className="text-[#D90429] shrink-0" size={24} />
                            <p className="cg-subheading text-white flex-1 min-w-0 break-words">{address}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Phone className="text-[#D90429] shrink-0" size={24} />
                            <p className="cg-subheading text-white flex-1 min-w-0 break-words">{content.contact_info?.phone || '(555) 123-4567'}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Mail className="text-[#D90429] shrink-0" size={24} />
                            <p className="cg-subheading text-white flex-1 min-w-0 break-words">{content.contact_info?.email || 'fight@bloodsport.com'}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D90429] shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <p className="cg-subheading text-white whitespace-pre-line leading-relaxed flex-1 min-w-0 break-words">{content.contact_info?.hours || "MON-FRI: 05:00-23:00\nSAT-SUN: 07:00-21:00"}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                          {/* Instagram */}
                          <a href={content.contact_info?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-[#333] flex items-center justify-center hover:bg-[#D90429] hover:border-[#D90429] transition-all text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                          {/* Facebook */}
                          <a href={content.contact_info?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-[#333] flex items-center justify-center hover:bg-[#D90429] hover:border-[#D90429] transition-all text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          {/* WhatsApp */}
                          <a href={content.contact_info?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-[#333] flex items-center justify-center hover:bg-[#D90429] hover:border-[#D90429] transition-all text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                        </div>
                      </div>
                    </FadeIn>
                    
                    <FadeIn dir="right">
                      <div className="w-full h-full min-h-[400px] border border-[#333] relative overflow-hidden shadow-2xl">
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
                <section key="custom" id="custom" className="py-24 md:py-32 px-6 cg-bg-black">
                  <div className="max-w-4xl mx-auto space-y-8">
                    {content.custom_blocks_json.map((block: any) => {
                      switch (block.type) {
                        case 'heading':
                          return <h2 key={block.id} className="cg-heading text-5xl md:text-6xl text-white tracking-widest text-center mt-12 mb-6 break-words whitespace-pre-wrap">{block.content}</h2>;
                        case 'paragraph':
                          return <p key={block.id} className="cg-body text-gray-400 text-lg leading-relaxed text-center break-words whitespace-pre-wrap">{block.content}</p>;
                        case 'image':
                          return (
                            <div key={block.id} className="w-full relative overflow-hidden border-2 border-[#D90429] my-8">
                              <img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto object-cover grayscale" />
                            </div>
                          );
                        case 'divider':
                          return (
                            <div key={block.id} className="flex items-center justify-center py-12">
                              <div className="w-24 h-1 bg-[#D90429]"></div>
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      <footer className="bg-[#050505] py-16 px-6 text-center border-t border-[#222]">
          <div className="max-w-4xl mx-auto">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-16 h-16 object-cover rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-[#D90429] mx-auto mb-8" />
            ) : (
              <h4 className="cg-heading text-5xl text-[#D90429] mb-8">{siteName}</h4>
            )}
            
            <div className="flex flex-wrap justify-center gap-8 cg-subheading text-sm mb-12">
              {['Discipline', 'Arts', 'Enlist', 'Arena', 'Contact'].map(l => (
                <a key={l} href={`#`} className="text-gray-500 hover:text-[#D90429] transition-colors">{l}</a>
              ))}
            </div>

            <p className="cg-body text-gray-600 text-sm">
              © {new Date().getFullYear()} {siteName}. SURVIVAL OF THE FITTEST.<br/>
              <span className="opacity-50 mt-2 inline-block">Powered by Jaalam</span>
            </p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            MODALS
        ════════════════════════════════════════ */}
        

        {selectedService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-[320px] md:max-w-md bg-[#111] relative border border-[#333] animate-in zoom-in-95 flex flex-col max-h-[85vh] md:max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black transition-colors rounded">
                <X size={24} />
              </button>
              
              <div className="h-48 md:h-56 w-full shrink-0">
                {selectedService.image ? (
                  <img loading="lazy" src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center">
                    <Target size={48} className="text-[#444]" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 overflow-y-auto shrink">
                <h3 className="cg-heading text-5xl text-white mb-4 break-words whitespace-pre-wrap">{selectedService.title || selectedService.name}</h3>
                <p className="cg-body text-gray-400 text-lg leading-relaxed mb-8 break-words whitespace-pre-wrap">{selectedService.description}</p>
                <button
                  className="cg-btn cg-btn-outline w-full"
                  onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  JOIN CLASS
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div 
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-8 animate-in fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <img loading="lazy" src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain border-4 border-[#222]"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {viewProductsPage && (
          <div className="fixed inset-0 z-[300] bg-[#050505] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="min-h-screen theme-root flex flex-col py-24 px-6 relative diagonal-cut-bottom">
              <button onClick={() => setViewProductsPage(false)} className="absolute top-8 right-8 text-white hover:text-[#D90429] cg-heading tracking-widest flex items-center gap-2 transition-colors">
                CLOSE <X size={24} />
              </button>
              
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="cg-heading text-6xl md:text-8xl text-white mb-4">COMBAT GEAR</h2>
                  <span className="cg-subheading text-[#D90429]">EQUIP YOURSELF</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: any, idx: number) => (
                    <div key={idx} onClick={() => setSelectedProduct(product)} className="cursor-pointer flex flex-col bg-[#111] border border-[#222] transition-transform hover:-translate-y-2 group">
                      <div className="w-full h-56 bg-black border-b border-[#222]">
                        <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="cg-heading text-5xl text-white mb-1">{product.name}</h3>
                        <p className="cg-subheading text-gray-500 mb-6">{product.time}</p>
                        <div className="cg-heading text-6xl text-[#D90429] mb-6">{product.price}</div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={product} content={content} /></div>
                        <p className="cg-body text-gray-400 leading-relaxed mb-8 flex-1">{product.description}</p>
                        <button 
                          onClick={() => { setViewProductsPage(false); setSelectedProduct(product); }}
                          className="w-full py-4 cg-subheading tracking-widest uppercase transition-colors border bg-transparent text-white border-[#333] hover:border-white"
                        >
                          View Details
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

