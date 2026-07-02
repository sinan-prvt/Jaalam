import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Star, Clock, X, ChevronRight, Scissors, Crown, CheckCircle, Menu } from 'lucide-react';

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

export default function RoyalSaloonTheme({ website, content }: Props) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullMenuPage, setShowFullMenuPage] = useState(false);

  const siteName = content.settings_json?.website_name || website.slug || 'Royal Crown';
  const address   = content.contact_info?.address || '1 King Street, London';

  /* ─── Palette ─── */
  const ROYAL_BLUE = '#0B132B';
  const RICH_GOLD  = '#D4AF37';
  const IVORY      = '#FFFFF0';

  /* ─── Data ─── */
  const defaultStyles = [
    { name: 'The Sovereign Cut', time: '60 mins', price: '?80', rating: 5.0, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Royal Hot Lather Shave', time: '45 mins', price: '?55', rating: 4.9, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80' },
    { name: 'Monarch Fade', time: '50 mins', price: '?70', rating: 4.9, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=500&q=80' },
    { name: 'Beard Sculpting', time: '30 mins', price: '?40', rating: 4.8, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=500&q=80' },
  ];

  const haircutStyles = content.products_json?.length > 0
    ? content.products_json.map((p: any) => ({
        name: p.name || p.title || 'Signature Service',
        price: p.price || '?0',
        time: (p.description && (p.description.toLowerCase().includes('min') || p.description.length < 12)) ? p.description : '60 mins',
        description: p.description && !p.description.toLowerCase().includes('min') && p.description.length > 12 ? p.description : `A premium ${p.name || 'service'} delivered with utmost precision.`,
        rating: 5.0,
        image: p.image || defaultStyles[0].image,
      }))
    : defaultStyles.map(s => ({ ...s, description: `Our luxurious ${s.name} service, tailored for royalty.` }));

  const defaultServices = [
    { title: 'Premium Hair Styling', description: 'Bespoke cuts by master stylists.', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80' },
    { title: 'Luxury Shaving', description: 'Traditional straight razor shave with essential oils.', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80' },
    { title: 'Grooming Packages', description: 'Complete head-to-toe detailing for special occasions.', image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=600&q=80' }
  ];

  const salonServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80';

  let galleryImages = content.gallery_json?.length > 0 ? [...content.gallery_json] : [
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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

        .rs-heading { font-family: 'Cinzel', serif; }
        .rs-body    { font-family: 'Lato', sans-serif; }

        .rs-bg-dark { background-color: ${ROYAL_BLUE}; color: ${IVORY}; }
        .rs-bg-light { background-color: ${IVORY}; color: ${ROYAL_BLUE}; }
        .rs-text-gold { color: ${RICH_GOLD}; }
        .rs-border-gold { border-color: ${RICH_GOLD}; }

        .rs-btn {
          position: relative;
          background: ${RICH_GOLD};
          color: ${ROYAL_BLUE};
          font-family: 'Cinzel', serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.4s ease;
          border: 1px solid ${RICH_GOLD};
          overflow: hidden;
          z-index: 1;
        }
        .rs-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 0%; height: 100%;
          background: ${IVORY};
          transition: all 0.4s ease;
          z-index: -1;
        }
        .rs-btn:hover::before { width: 100%; }
        
        .rs-btn-outline {
          background: transparent;
          color: ${RICH_GOLD};
        }
        .rs-btn-outline::before { background: ${RICH_GOLD}; }
        .rs-btn-outline:hover { color: ${ROYAL_BLUE}; }

        .rs-card {
          position: relative;
          background: ${ROYAL_BLUE};
          border: 1px solid rgba(212, 175, 55, 0.2);
          transition: all 0.5s ease;
        }
        .rs-card:hover {
          border-color: ${RICH_GOLD};
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.1);
          transform: translateY(-5px);
        }

        .rs-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        .rs-separator::before, .rs-separator::after {
          content: '';
          height: 1px;
          background: ${RICH_GOLD};
          flex: 1;
          opacity: 0.5;
        }

        .rs-image-overlay {
          position: relative;
        }
        .rs-image-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, ${ROYAL_BLUE} 0%, transparent 50%);
          opacity: 0.8;
          pointer-events: none;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${ROYAL_BLUE}; }
        ::-webkit-scrollbar-thumb { background: ${RICH_GOLD}; border-radius: 10px; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="rs-body w-full min-h-screen overflow-x-hidden rs-bg-dark">

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <header className="w-full px-6 md:px-16 py-6 flex items-center justify-between absolute top-0 z-50 bg-gradient-to-b from-[#0B132B]/90 to-transparent backdrop-blur-sm">
          <div className="rs-heading text-2xl md:text-3xl font-bold tracking-widest text-white flex items-center gap-3">
            <Crown size={28} className="rs-text-gold" />
            {siteName}
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase">
            {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-white hover:text-[#D4AF37] transition-colors relative group">
                {l}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-[#D4AF37] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          <button className="md:hidden text-white hover:text-[#D4AF37] transition-colors p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#0B132B]/95 backdrop-blur-md pt-24 px-6 flex flex-col gap-6">
            {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
              <a 
                key={l} 
                href={`#${l.toLowerCase()}`} 
                className="rs-heading text-2xl text-center text-white hover:text-[#D4AF37] transition-colors pb-4 border-b border-[#D4AF37]/20"
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
          <div className="relative min-h-[100svh] flex flex-col justify-center text-center px-6 pt-32 pb-16">
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/50 via-[#0B132B]/60 to-[#0B132B]"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto w-full">
              <FadeIn delay={0}>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-px bg-[#D4AF37] hidden sm:block"></div>
                  <span className="rs-heading text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase rs-text-gold leading-relaxed">
                    Premium Grooming Experience
                  </span>
                  <div className="w-12 h-px bg-[#D4AF37] hidden sm:block"></div>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="rs-heading text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[1.1] text-white mb-8 break-words drop-shadow-2xl">
                  {content.hero_title || content.settings_json?.hero_title || 'Experience True Royalty'}
                </h1>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed break-words overflow-hidden px-2">
                  {(() => {
                    const t = content.about_text || content.settings_json?.hero_description || content.hero_text;
                    if (!t || t === 'Add your business description here.' || t.trim() === '') {
                      return 'Indulge in bespoke grooming services designed for the modern gentleman. Precision, luxury, and unmatched elegance await.';
                    }
                    return t;
                  })()}
                </p>
              </FadeIn>

              <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button
                    className="rs-btn px-10 py-4 text-sm w-full sm:w-auto"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Reserve an Appointment
                  </button>
                  <button
                    className="rs-btn rs-btn-outline px-10 py-4 text-sm w-full sm:w-auto"
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Services
                  </button>
                </div>
              </FadeIn>
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
                <section key="about" id="about" className="py-24 md:py-32 px-6">
                  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <FadeIn dir="left">
                      <div className="relative p-4 border border-[#D4AF37]/30 group">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37] -translate-x-2 -translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37] translate-x-2 translate-y-2 transition-transform group-hover:-translate-x-0 group-hover:-translate-y-0"></div>
                        <img 
                          src={content.gallery_json?.[0] || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'} 
                          alt="About" 
                          className="w-full h-auto object-cover grayscale-[30%] contrast-125"
                        />
                      </div>
                    </FadeIn>
                    
                    <FadeIn dir="right">
                      <div className="rs-heading text-sm tracking-[0.2em] rs-text-gold uppercase mb-4">Our Heritage</div>
                      <h2 className="rs-heading text-4xl md:text-5xl text-white mb-8 leading-tight">
                        {content.settings_json?.about_title || 'Crafting Elegance Since 2026'}
                      </h2>
                      <p className="text-gray-300 text-base leading-relaxed mb-8 font-light break-words overflow-hidden">
                        {(() => {
                          const t = content.settings_json?.about_description || content.about_text;
                          if (!t || t === 'Add your business description here.' || t.trim() === '') {
                            return 'Step into an oasis of luxury. We combine traditional barbering techniques with modern sophistication, ensuring every client leaves feeling like royalty.';
                          }
                          return t;
                        })()}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6 mt-8">
                        {[['Master', 'Barbers'], ['Premium', 'Products'], ['Luxury', 'Ambience'], ['Bespoke', 'Service']].map(([top, bot], i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center rs-text-gold">
                              <CheckCircle size={18} />
                            </div>
                            <div>
                              <div className="text-white font-bold">{top}</div>
                              <div className="text-sm text-gray-400">{bot}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FadeIn>
                  </div>
                </section>
              );

              /* ── SERVICES ── */
              if (sectionId === 'services') return (
                <section key="services" id="services" className="py-24 md:py-32 px-6 bg-[#070b1a]">
                  <div className="max-w-7xl mx-auto">
                    <FadeIn>
                      <div className="text-center mb-16">
                        <div className="rs-separator">
                          <Crown size={24} className="rs-text-gold" />
                        </div>
                        <h2 className="rs-heading text-4xl md:text-5xl text-white">Signature Services</h2>
                      </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {salonServices.map((s: any, i: number) => (
                        <FadeIn key={i} delay={i * 100}>
                          <div 
                            onClick={() => setSelectedService(s)} 
                            className="rs-card group cursor-pointer h-full flex flex-col overflow-hidden"
                          >
                            <div className="h-64 overflow-hidden relative rs-image-overlay">
                              <img 
                                src={s.image} 
                                alt={s.title || s.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%]" 
                              />
                            </div>
                            <div className="p-8 flex-1 flex flex-col relative z-10 bg-[#0B132B]">
                              <h3 className="rs-heading text-2xl text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{s.title || s.name}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{s.description}</p>
                              <div className="flex items-center gap-2 rs-text-gold font-bold text-xs tracking-widest uppercase mt-auto">
                                Discover <ChevronRight size={16} className="transition-transform group-hover:translate-x-2" />
                              </div>
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
                <section key="menu" id="menu" className="py-24 md:py-32 px-6">
                  <div className="max-w-4xl mx-auto">
                    <FadeIn>
                      <div className="text-center mb-16">
                        <h2 className="rs-heading text-4xl md:text-5xl text-white mb-4">The Royal Menu</h2>
                        <p className="text-gray-400 uppercase tracking-widest text-sm">Curated Styles & Treatments</p>
                      </div>
                    </FadeIn>

                    <div className="border border-[#D4AF37]/30 p-4 md:p-8 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B132B] px-4">
                        <Crown size={32} className="rs-text-gold" />
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        {haircutStyles.slice(0, 2).map((style: any, idx: number) => (
                          <FadeIn key={idx} delay={idx * 100}>
                            <div
                              onClick={() => setSelectedStyle(style)}
                              className="group cursor-pointer p-4 hover:bg-[#D4AF37]/5 transition-colors border-b border-[#D4AF37]/10 pb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4"
                            >
                              <div className="text-center sm:text-left flex-1">
                                <h3 className="rs-heading text-xl md:text-2xl text-white group-hover:text-[#D4AF37] transition-colors mb-2">{style.name}</h3>
                                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs uppercase tracking-widest text-gray-500">
                                  <span className="flex items-center gap-1"><Clock size={12} /> {style.time}</span>
                                  <span>|</span>
                                  <span className="flex items-center gap-1"><Star size={12} className="rs-text-gold" /> {style.rating}</span>
                                </div>
                              </div>
                              <div className="hidden sm:block flex-1 border-b border-dashed border-[#D4AF37]/30 mx-4 relative top-[-10px]"></div>
                              <span className="rs-heading text-2xl rs-text-gold">{style.price}</span>
                            </div>
                          </FadeIn>
                        ))}
                      </div>

                      {haircutStyles.length > 2 && (
                        <div className="mt-12 text-center">
                          <button 
                            onClick={() => setShowFullMenuPage(true)}
                            className="rs-btn rs-btn-outline px-8 py-3 text-xs"
                          >
                            View Full Menu
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );

              /* ── GALLERY ── */
              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="py-24 md:py-32 px-6 bg-[#070b1a]">
                  <div className="max-w-7xl mx-auto">
                    <FadeIn>
                      <div className="flex flex-col items-center mb-16">
                        <h2 className="rs-heading text-4xl md:text-5xl text-white mb-6">Gallery of Kings</h2>
                        <div className="w-24 h-px bg-[#D4AF37]"></div>
                      </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                        <FadeIn key={idx} delay={idx * 100}>
                          <div
                            onClick={() => setSelectedImage(img)}
                            className="aspect-[4/5] cursor-pointer relative group overflow-hidden border border-[#D4AF37]/20"
                          >
                            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[40%]" />
                            <div className="absolute inset-0 bg-[#0B132B]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <span className="rs-heading text-white text-lg tracking-widest border border-white px-6 py-2 uppercase">View</span>
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
                <section key="contact" id="contact" className="py-24 md:py-32 px-6 relative border-t border-[#D4AF37]/20">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center bg-fixed opacity-10"></div>
                  
                  <div className="max-w-5xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <FadeIn dir="left">
                        <div className="bg-[#0B132B]/90 backdrop-blur-md p-10 border border-[#D4AF37]/30 shadow-2xl">
                          <h2 className="rs-heading text-4xl text-white mb-10">Royal Quarters</h2>
                          <div className="space-y-8">
                            {[
                              { Icon: MapPin, label: 'Location', value: content.contact_info?.address || '1 King Street, London' },
                              { Icon: Phone, label: 'Reservations', value: content.contact_info?.phone || '+44 20 7123 4567' },
                              { Icon: Mail, label: 'Enquiries', value: content.contact_info?.email || 'concierge@royalsaloon.com' },
                            ].map(({ Icon, label, value }) => (
                              <div key={label} className="flex items-start gap-5">
                                <div className="mt-1 w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center rs-text-gold bg-[#D4AF37]/10 shrink-0">
                                  <Icon size={20} />
                                </div>
                                <div>
                                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">{label}</div>
                                  <div className="text-white text-lg">{value}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FadeIn>

                      <FadeIn dir="right">
                        <div className="h-[400px] md:h-[500px] border border-[#D4AF37]/30 p-2 bg-[#0B132B]/50">
                          <iframe
                            title="Map"
                            className="w-full h-full grayscale opacity-80"
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'London, UK')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          />
                        </div>
                      </FadeIn>
                    </div>
                  </div>
                </section>
              );

              /* ── CUSTOM BLOCKS ── */
              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="py-24 px-6 bg-[#070b1a]">
                  <div className="max-w-4xl mx-auto p-10 border border-[#D4AF37]/20 bg-[#0B132B]">
                    <h2 className="rs-heading text-4xl mb-12 text-center text-white">Announcements</h2>
                    <div className="space-y-8 text-center text-gray-300">
                      {content.custom_blocks_json.map((block: any, i: number) => {
                        if (block.type === 'heading') return <h3 key={block.id || i} className="rs-heading text-2xl text-white mt-8">{block.content}</h3>;
                        if (block.type === 'paragraph') return <p key={block.id || i} className="text-lg leading-relaxed">{block.content}</p>;
                        if (block.type === 'image' && block.url) return <div key={block.id || i} className="border border-[#D4AF37]/30 my-8 p-2"><img src={block.url} alt="" className="w-full h-auto" /></div>;
                        if (block.type === 'divider') return <div key={block.id || i} className="rs-separator"></div>;
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
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      <footer className="bg-[#040712] py-20 px-6 text-center border-t border-[#D4AF37]/20">
          <div className="max-w-4xl mx-auto">
            <Crown size={40} className="rs-text-gold mx-auto mb-6" />
            <h4 className="rs-heading text-3xl text-white mb-10 tracking-widest">{siteName}</h4>
            
            <div className="flex flex-wrap justify-center gap-8 text-xs tracking-[0.2em] uppercase mb-12 text-gray-500">
              {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors">{l}</a>
              ))}
            </div>

            <p className="text-xs text-gray-600 tracking-widest uppercase">
              © {new Date().getFullYear()} {siteName}. Excellence Assured.<br/>
              <span className="opacity-50 mt-2 inline-block">Powered by Jaalam</span>
            </p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            STYLE DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedStyle && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#040712]/90 backdrop-blur-md" onClick={() => setSelectedStyle(null)}>
            <div
              className="w-full max-w-sm bg-[#0B132B] border border-[#D4AF37] text-left relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedStyle(null)} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-[#D4AF37] text-[#0B132B] hover:bg-white transition-colors">
                <X size={16} />
              </button>
              
              <div className="h-40 w-full relative">
                <img src={selectedStyle.image} alt={selectedStyle.name} className="w-full h-full object-cover grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] to-transparent"></div>
              </div>

              <div className="p-5 -mt-8 relative z-10">
                <h3 className="rs-heading text-xl text-white mb-3">{selectedStyle.name}</h3>
                
                <div className="flex items-center gap-4 mb-5 text-xs uppercase tracking-widest text-[#D4AF37]">
                  <span className="text-xl font-bold">{selectedStyle.price}</span>
                  <div className="w-px h-5 bg-[#D4AF37]/30"></div>
                  <span className="flex items-center gap-1"><Clock size={12} /> {selectedStyle.time}</span>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
                  {selectedStyle.description || 'Experience the pinnacle of grooming. This service is designed to deliver a flawless result tailored perfectly to your unique style.'}
                </p>

                <button
                  className="rs-btn w-full py-3 text-xs"
                  onClick={() => { setSelectedStyle(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Reserve This Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SERVICE DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#040712]/90 backdrop-blur-md" onClick={() => setSelectedService(null)}>
            <div
              className="w-full max-w-sm bg-[#0B132B] border border-[#D4AF37] text-left relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-[#D4AF37] text-[#0B132B] hover:bg-white transition-colors">
                <X size={16} />
              </button>
              
              <div className="h-40 w-full relative">
                {selectedService.image ? (
                  <img src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover grayscale-[20%]" />
                ) : (
                  <div className="w-full h-full bg-[#070b1a] flex items-center justify-center">
                    <Crown size={48} className="rs-text-gold opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] to-transparent"></div>
              </div>

              <div className="p-5 -mt-8 relative z-10">
                <h3 className="rs-heading text-xl text-white mb-4">{selectedService.title || selectedService.name}</h3>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
                  {selectedService.description}
                </p>

                <button
                  className="rs-btn w-full py-3 text-xs"
                  onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Inquire Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            LIGHTBOX
        ════════════════════════════════════════ */}
        {selectedImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#040712]/95 backdrop-blur-sm p-4 md:p-12 cursor-pointer" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all"
              onClick={e => { e.stopPropagation(); setSelectedImage(null); }}>
              <X size={24} />
            </button>
            <div className="p-2 border border-[#D4AF37]/50 bg-[#0B132B]" onClick={e => e.stopPropagation()}>
              <img src={selectedImage} alt="Gallery" className="max-w-full max-h-[85vh] object-contain" />
            </div>
          </div>
        )}

        {/* FULL MENU PAGE MODAL */}
        {showFullMenuPage && (
          <div className="fixed inset-0 z-[120] bg-[#070b1a] overflow-y-auto animate-in fade-in slide-in-from-bottom-8">
            <div className="min-h-screen theme-root flex flex-col px-6 py-12 md:py-20 max-w-4xl mx-auto relative">
              <button 
                onClick={() => setShowFullMenuPage(false)} 
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-[#0B132B] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center mb-16 text-center mt-8">
                <Crown size={40} className="rs-text-gold mb-4" />
                <h2 className="rs-heading text-3xl md:text-5xl text-white mb-6">All Styles</h2>
                <div className="w-24 h-px bg-[#D4AF37]"></div>
                <p className="text-gray-400 mt-6 max-w-lg mx-auto text-sm">Browse our full selection of premium grooming services and luxurious treatments.</p>
              </div>

              <div className="space-y-4">
                {haircutStyles.map((style: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedStyle(style)}
                    className="group cursor-pointer p-6 bg-[#0B132B] border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-colors flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6"
                  >
                    <div className="text-center sm:text-left flex-1 w-full">
                      <h3 className="rs-heading text-2xl text-white group-hover:text-[#D4AF37] transition-colors mb-3">{style.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 font-light hidden sm:block">{style.description}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-xs uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {style.time}</span>
                        <span>|</span>
                        <span className="flex items-center gap-1"><Star size={12} className="rs-text-gold" /> {style.rating}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block flex-1 border-b border-dashed border-[#D4AF37]/30 mx-4 relative top-[-20px]"></div>
                    <span className="rs-heading text-3xl rs-text-gold shrink-0">{style.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

