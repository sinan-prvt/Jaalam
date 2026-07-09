import React, { useState, useEffect, useRef } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, Mail, Star, Clock, X, Scissors, Sparkles, Zap } from 'lucide-react';

/* ─── Intersection-observer fade-in ─── */
function SlideIn({ children, delay = 0, dir = 'up' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const init = dir === 'left' ? 'opacity-0 -translate-x-10' : dir === 'right' ? 'opacity-0 translate-x-10' : 'opacity-0 translate-y-10';
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-x-0 translate-y-0' : init}`}>
      {children}
    </div>
  );
}

interface Props { website: any; content: any; }

export default function ModernSaloonTheme({ website, content }: Props) {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const siteName = content.settings_json?.website_name || website.slug || 'Studio';
  const address   = content.contact_info?.address || 'New York, USA';

  /* ─── Palette ─── */
  const TEAL   = '#00C9B1';   // electric teal
  const NAVY   = '#090E1A';   // deep midnight
  const PANEL  = '#111827';   // card/panel bg
  const BORDER = 'rgba(0,201,177,0.18)';

  /* ─── Data ─── */
  const defaultStyles = [
    { name: 'Precision Cut', time: '45 mins', price: '?42', rating: 4.9, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=500&q=80' },
    { name: 'Fade & Taper', time: '50 mins', price: '?38', rating: 5.0, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Beard Sculpt', time: '30 mins', price: '?28', rating: 4.8, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80' },
    { name: 'Signature Style', time: '60 mins', price: '?55', rating: 5.0, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=500&q=80' },
  ];

  const haircutStyles = content.products_json?.length > 0
    ? content.products_json.map((p: any) => ({
        name: p.name || p.title || 'Style',
        price: p.price || '?0',
        time: (p.description && (p.description.toLowerCase().includes('min') || p.description.length < 12)) ? p.description : '45 mins',
        description: p.description && !p.description.toLowerCase().includes('min') && p.description.length > 12 ? p.description : `Premium ${p.name || 'styling'} crafted to perfection.`,
        rating: 4.9,
        image: p.image || defaultStyles[0].image,
      }))
    : defaultStyles.map(s => ({ ...s, description: `Premium ${s.name} service designed for the modern client. Includes consultation, wash & finish.` }));

  const defaultServices = [
    { title: 'Hair Cutting', description: 'Expert cuts tailored to your face shape and lifestyle.', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80' },
    { title: 'Beauty Parlour', description: 'Full beauty treatments for a radiant, polished look.', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80' },
    { title: 'Color & Highlights', description: 'Bold, vibrant colors mixed by expert colorists.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
    { title: 'Hair Care & Wash', description: 'Nourishing hair wash and conditioning treatments.', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80' },
  ];

  const salonServices = content.services_json?.length > 0 ? content.services_json : defaultServices;

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80';

  const defaultGallery = [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
  ];
  const galleryImages = content.gallery_json?.length > 0 ? [...content.gallery_json] : [...defaultGallery];


  const tabs = ['Haircut', 'Beauty', 'Color'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ms-font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .ms-font-body    { font-family: 'Space Grotesk', sans-serif; }
        .ms-font-sub     { font-family: 'DM Sans', sans-serif; }

        .ms-glow  { box-shadow: 0 0 32px rgba(0,201,177,0.25), 0 0 64px rgba(0,201,177,0.08); }
        .ms-glow-sm { box-shadow: 0 0 16px rgba(0,201,177,0.20); }
        .ms-glow-text { text-shadow: 0 0 24px rgba(0,201,177,0.6); }

        @keyframes ms-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .ms-pulse-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #00C9B1;
          animation: ms-pulse-ring 2s ease-out infinite;
        }

        @keyframes ms-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ms-ticker-inner { animation: ms-ticker 22s linear infinite; }

        @keyframes ms-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .ms-float { animation: ms-float 4s ease-in-out infinite; }

        @keyframes ms-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ms-shimmer-text {
          background: linear-gradient(90deg, #00C9B1 0%, #ffffff 50%, #00C9B1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ms-shimmer 3s linear infinite;
        }

        .ms-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ms-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,201,177,0.18); }

        .ms-scrollbar::-webkit-scrollbar { height: 3px; }
        .ms-scrollbar::-webkit-scrollbar-track { background: #111827; }
        .ms-scrollbar::-webkit-scrollbar-thumb { background: #00C9B1; border-radius: 9999px; }

        ::-webkit-scrollbar { width: 0; background: transparent; }

        .ms-grid-bg {
          background-image: linear-gradient(rgba(0,201,177,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,201,177,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .ms-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .ms-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ms-btn:hover::after { opacity: 1; }
        .ms-btn:active { transform: scale(0.97); }

        ${content.custom_css || ''}
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      <div className="ms-font-body w-full min-h-screen overflow-x-hidden" style={{ backgroundColor: NAVY, color: '#E2E8F0' }}>

        {/* ═══════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════ */}
        {!hiddenSections.includes('hero') && (
          <div className="relative min-h-[100svh] flex flex-col overflow-hidden ms-grid-bg" style={{ backgroundColor: NAVY }}>

            {/* Ambient blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${TEAL}, transparent 70%)`, filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle, #7C3AED, transparent 70%)`, filter: 'blur(60px)' }} />

            {/* Sticky nav */}
            <header className="sticky top-0 z-50 w-full px-6 sm:px-10 py-4 flex items-center justify-between" style={{ background: 'rgba(9,14,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}` }}>
              <div className="ms-font-display text-2xl tracking-widest ms-glow-text" style={{ color: TEAL }}>{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</div>
              <nav className="hidden md:flex items-center gap-8 text-sm ms-font-sub font-medium text-slate-400">
                {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors duration-200 hover:underline underline-offset-4 decoration-[#00C9B1]">{l}</a>
                ))}
              </nav>
              <button
                className="ms-btn text-xs ms-font-sub font-bold px-5 py-2.5 rounded-full text-black transition-all ms-glow-sm"
                style={{ background: `linear-gradient(135deg, ${TEAL}, #00A896)` }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Now
              </button>
            </header>

            {/* Hero body */}
            <div className="flex-1 flex flex-col lg:flex-row items-center gap-10 px-6 sm:px-10 lg:px-16 py-16 max-w-7xl mx-auto w-full">
              {/* Left text */}
              <div className="flex-1 z-10">
                <SlideIn delay={0} dir="left">
                  <span className="inline-flex items-center gap-2 text-xs ms-font-sub font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ border: `1px solid ${BORDER}`, color: TEAL, background: 'rgba(0,201,177,0.08)' }}>
                    <Sparkles size={12} /> Premium Salon Studio
                  </span>
                </SlideIn>

                <SlideIn delay={80} dir="left">
                  <h1 className="ms-font-display text-[clamp(3.5rem,10vw,8rem)] leading-none mb-6">
                    <span className="block text-white">{content.hero_title || content.settings_json?.hero_title || siteName}</span>
                    <span className="ms-shimmer-text block">REDEFINED</span>
                  </h1>
                </SlideIn>

                <SlideIn delay={160} dir="left">
                  <p className="ms-font-sub text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mb-10 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {(() => {
                      const t = content.settings_json?.hero_description || content.hero_text;
                      if (!t || t === 'Add your business description here.' || t.trim() === '') {
                        return 'Where precision meets artistry. Step into a modern salon experience unlike any other — tailored for you.';
                      }
                      return t;
                    })()}
                  </p>
                </SlideIn>

                <SlideIn delay={240} dir="left">
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="ms-btn font-bold px-8 py-4 rounded-xl text-sm text-black ms-glow"
                      style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #00A896 100%)` }}
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Book Appointment
                    </button>
                    <button
                      className="ms-btn font-bold px-8 py-4 rounded-xl text-sm text-white"
                      style={{ border: `1.5px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)' }}
                      onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Our Services
                    </button>
                  </div>
                </SlideIn>

                {/* Stats row */}
                <SlideIn delay={320} dir="left">
                  <div className="flex gap-8 mt-12 text-left">
                    {[['500+', 'Clients Served'], ['4.9★', 'Avg Rating'], ['10+', 'Expert Stylists']].map(([num, label]) => (
                      <div key={label}>
                        <div className="ms-font-display text-2xl sm:text-3xl" style={{ color: TEAL }}>{num}</div>
                        <div className="text-xs ms-font-sub text-slate-500 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                </SlideIn>
              </div>

              {/* Right image panel */}
              <SlideIn delay={100} dir="right">
                <div className="relative w-full lg:w-[480px] shrink-0 ms-float">
                  {/* Teal ring */}
                  <div className="absolute -inset-4 rounded-[2.5rem] opacity-20 blur-2xl" style={{ background: `linear-gradient(135deg, ${TEAL}, #7C3AED)` }} />
                  <div className="relative rounded-[2rem] overflow-hidden ms-glow" style={{ border: `1.5px solid ${BORDER}` }}>
                    <img src={heroImage} alt="Salon" className="w-full h-[420px] lg:h-[540px] object-cover" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY}CC 0%, transparent 60%)` }} />

                    {/* Floating badge */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl flex items-center gap-4 ms-glow-sm"
                      style={{ background: 'rgba(9,14,26,0.80)', backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}` }}>
                      <div className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 ms-pulse-ring" style={{ background: `linear-gradient(135deg, ${TEAL}, #00A896)` }}>
                        <Sparkles size={16} color="#000" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm ms-font-sub">Premium Quality</p>
                        <p className="text-xs ms-font-sub" style={{ color: TEAL }}>Top Rated Studio</p>
                      </div>
                      <button 
                        className="ml-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg text-black ms-card-hover" 
                        style={{ background: TEAL }}
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              </SlideIn>
            </div>

            {/* Scrolling ticker */}
            <div className="w-full overflow-hidden py-3" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: 'rgba(0,201,177,0.04)' }}>
              <div className="ms-ticker-inner flex gap-16 whitespace-nowrap">
                {[...Array(2)].map((_, rep) => (
                  ['Hair Cutting', 'Beauty Parlour', 'Color & Highlights', 'Precision Cuts', 'Fade & Taper', 'Spa Treatment', 'Beard Sculpt', 'Nail Care'].map((item, i) => (
                    <span key={`${rep}-${i}`} className="ms-font-display text-sm tracking-widest" style={{ color: TEAL }}>
                      {item} <span className="text-slate-700 mx-6">✦</span>
                    </span>
                  ))
                ))}
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
                <React.Fragment key="about">
                  <section id="about" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden" style={{ backgroundColor: PANEL }}>
                    {/* decorative line */}
                    <div className="absolute left-0 top-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL}60, transparent)` }} />

                    <div className="max-w-6xl mx-auto">
                      <SlideIn delay={0}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-px" style={{ background: TEAL }} />
                          <span className="text-xs ms-font-sub font-bold uppercase tracking-widest" style={{ color: TEAL }}>About Us</span>
                        </div>
                        <h2 className="ms-font-display text-5xl sm:text-7xl text-white mb-12 leading-none">
                          {content.settings_json?.about_title || 'OUR STORY'}
                        </h2>
                      </SlideIn>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <SlideIn delay={100} dir="left">
                          <div className="space-y-6">
                            <p className="ms-font-sub text-slate-300 text-base sm:text-lg leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              {(() => {
                                const t = content.settings_json?.about_description || content.about_text;
                                if (!t || t === 'Add your business description here.' || t.trim() === '') {
                                  return 'We are a modern salon studio dedicated to crafting personalized looks that express who you are. Our team of expert stylists combines cutting-edge techniques with premium products to deliver results that exceed expectations every single visit.';
                                }
                                return t;
                              })()}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                              {[['Hair Cutting', Scissors], ['Beauty Parlour', Sparkles], ['Color & Highlights', Zap], ['Hair Care & Wash', Star]].map(([label, Icon]: any) => (
                                <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,201,177,0.06)', border: `1px solid ${BORDER}` }}>
                                  <Icon size={16} style={{ color: TEAL }} />
                                  <span className="text-sm ms-font-sub font-medium text-slate-300">{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </SlideIn>

                        <SlideIn delay={180} dir="right">
                          <div className="relative">
                            <div className="absolute -inset-2 rounded-[1.5rem] opacity-15 blur-xl" style={{ background: TEAL }} />
                            <img
                              src={content.settings_json?.about_image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                              alt="About"
                              className="relative w-full h-72 sm:h-80 object-cover rounded-[1.5rem]"
                              style={{ border: `1.5px solid ${BORDER}` }}
                            />
                            {/* count chips */}
                            <div className="absolute -bottom-5 -right-4 px-5 py-3 rounded-2xl ms-glow-sm" style={{ background: PANEL, border: `1.5px solid ${BORDER}` }}>
                              <span className="ms-font-display text-2xl block" style={{ color: TEAL }}>10+</span>
                              <span className="text-xs text-slate-400 ms-font-sub">Yrs Experience</span>
                            </div>
                          </div>
                        </SlideIn>
                      </div>
                    </div>
                  </section>

                  {/* Tab filter strip */}
                  <section className="py-6 px-6 sm:px-10 lg:px-16 sticky z-40" style={{ top: '65px', backgroundColor: NAVY, borderBottom: `1px solid ${BORDER}` }}>
                    <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto ms-scrollbar pb-1">
                      {tabs.map((tab, i) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(i)}
                          className="shrink-0 text-xs ms-font-sub font-bold uppercase tracking-widest px-5 py-2 rounded-full transition-all ms-btn"
                          style={{
                            background: activeTab === i ? TEAL : 'rgba(0,201,177,0.06)',
                            color: activeTab === i ? '#000' : '#94a3b8',
                            border: `1px solid ${activeTab === i ? TEAL : BORDER}`,
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </section>
                </React.Fragment>
              );

              /* ── SERVICES ── */
              if (sectionId === 'services') return (
                <section key="services" id="services" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16" style={{ backgroundColor: NAVY }}>
                  <div className="max-w-6xl mx-auto">
                    <SlideIn>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px" style={{ background: TEAL }} />
                        <span className="text-xs ms-font-sub font-bold uppercase tracking-widest" style={{ color: TEAL }}>What We Offer</span>
                      </div>
                      <h2 className="ms-font-display text-5xl sm:text-7xl text-white mb-14 leading-none">OUR SERVICES</h2>
                    </SlideIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {salonServices.map((s: any, i: number) => (
                        <SlideIn key={i} delay={i * 70}>
                          <div onClick={() => setSelectedService(s)} className="ms-card-hover rounded-2xl overflow-hidden cursor-pointer group" style={{ background: PANEL, border: `1.5px solid ${BORDER}` }}>
                            <div className="relative h-48 overflow-hidden">
                              {s.image
                                ? <img src={s.image} alt={s.title || s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                : <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, #111827, #0F172A)` }}>
                                    <Scissors size={40} style={{ color: TEAL }} />
                                  </div>
                              }
                              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${PANEL}EE 0%, transparent 60%)` }} />
                              <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: TEAL }}>
                                <Zap size={14} color="#000" />
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="ms-font-display text-xl text-white mb-2 group-hover:underline" style={{ textDecorationColor: TEAL }}>{s.title || s.name}</h3>
                              <p className="text-sm ms-font-sub text-slate-400 line-clamp-2">{s.description}</p>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-[11px] ms-font-sub uppercase tracking-widest font-bold" style={{ color: TEAL }}>Learn More →</span>
                              </div>
                            </div>
                          </div>
                        </SlideIn>
                      ))}
                    </div>
                  </div>
                </section>
              );

              /* ── MENU / POPULAR STYLES ── */
              if (sectionId === 'menu') return (
                <section key="menu" id="menu" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden" style={{ backgroundColor: PANEL }}>
                  <div className="absolute right-0 top-0 w-[300px] h-[300px] opacity-5 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${TEAL}, transparent 70%)`, filter: 'blur(40px)' }} />

                  <div className="max-w-6xl mx-auto">
                    <SlideIn>
                      <div className="flex items-center justify-between mb-14 flex-wrap gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px" style={{ background: TEAL }} />
                            <span className="text-xs ms-font-sub font-bold uppercase tracking-widest" style={{ color: TEAL }}>Menu</span>
                          </div>
                          <h2 className="ms-font-display text-5xl sm:text-7xl text-white leading-none">POPULAR STYLES</h2>
                        </div>
                        <button
                          onClick={() => setShowAllProducts(true)}
                          className="ms-btn text-sm ms-font-sub font-bold px-6 py-3 rounded-xl"
                          style={{ border: `1.5px solid ${BORDER}`, color: TEAL, background: 'rgba(0,201,177,0.06)' }}
                        >
                          View All →
                        </button>
                      </div>
                    </SlideIn>

                    {/* Big horizontal cards */}
                    <div className="space-y-5">
                      {haircutStyles.slice(0, 4).map((style: any, idx: number) => (
                        <SlideIn key={idx} delay={idx * 80}>
                          <div
                            onClick={() => setSelectedStyle(style)}
                            className="ms-card-hover flex flex-col sm:flex-row gap-4 sm:gap-8 sm:items-center cursor-pointer p-5 sm:p-6 rounded-2xl group"
                            style={{ background: NAVY, border: `1.5px solid ${BORDER}` }}
                          >
                            {/* Mobile Top Row */}
                            <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
                              <span className="ms-font-display text-4xl sm:text-6xl font-normal shrink-0 w-8 sm:w-12 text-center select-none" style={{ color: `${TEAL}30` }}>
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0" style={{ border: `1.5px solid ${BORDER}` }}>
                                <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="shrink-0 text-right ml-auto sm:hidden">
                                <span className="ms-font-display text-2xl" style={{ color: TEAL }}>{style.price}</span>
                                <div className="text-[9px] ms-font-sub text-slate-500 mt-0.5 uppercase tracking-wider">per session</div>
                              </div>
                            </div>

                            {/* Info & Desktop Actions */}
                            <div className="flex-1 min-w-0 flex items-center justify-between w-full mt-2 sm:mt-0">
                              <div className="min-w-0 w-full pr-4 sm:pr-0">
                                <h3 className="ms-font-display text-xl sm:text-3xl text-white group-hover:text-[#00C9B1] transition-colors truncate">{style.name}</h3>
                                <div className="flex items-center gap-3 sm:gap-4 mt-1.5 flex-wrap">
                                  <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm ms-font-sub">
                                    <Clock size={13} />
                                    <span>{style.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs sm:text-sm ms-font-sub font-bold" style={{ color: TEAL }}>
                                    <Star size={13} fill={TEAL} />
                                    <span>{style.rating}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="hidden sm:flex items-center gap-8">
                                <div className="shrink-0 text-right">
                                  <span className="ms-font-display text-3xl" style={{ color: TEAL }}>{style.price}</span>
                                  <div className="text-[10px] ms-font-sub text-slate-500 mt-0.5 uppercase tracking-wider">per session</div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:ms-glow-sm"
                                  style={{ background: 'rgba(0,201,177,0.08)', border: `1px solid ${BORDER}` }}>
                                  <span className="text-sm" style={{ color: TEAL }}>→</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SlideIn>
                      ))}
                    </div>
                  </div>
                </section>
              );

              /* ── GALLERY ── */
              if (sectionId === 'gallery') return (
                <section key="gallery" id="gallery" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16" style={{ backgroundColor: NAVY }}>
                  <div className="max-w-6xl mx-auto">
                    <SlideIn>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px" style={{ background: TEAL }} />
                        <span className="text-xs ms-font-sub font-bold uppercase tracking-widest" style={{ color: TEAL }}>Portfolio</span>
                      </div>
                      <h2 className="ms-font-display text-5xl sm:text-7xl text-white mb-14 leading-none">OUR GALLERY</h2>
                    </SlideIn>

                    {/* Masonry-style 3-column grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                      {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                        <SlideIn key={idx} delay={idx * 50}>
                          <div
                            onClick={() => setSelectedImage(img)}
                            className={`ms-card-hover overflow-hidden rounded-2xl cursor-pointer group relative ${idx === 0 || idx === 5 ? 'row-span-1 aspect-video sm:aspect-square' : 'aspect-square'}`}
                            style={{ border: `1.5px solid ${BORDER}` }}
                          >
                            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ background: 'rgba(0,201,177,0.25)', backdropFilter: 'blur(4px)' }}>
                              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: TEAL }}>
                                <span className="text-black font-bold text-lg">↗</span>
                              </div>
                            </div>
                          </div>
                        </SlideIn>
                      ))}
                    </div>
                  </div>
                </section>
              );

              /* ── CONTACT ── */
              if (sectionId === 'contact') return (
                <section key="contact" id="contact" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden" style={{ backgroundColor: PANEL }}>
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] opacity-5 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse, ${TEAL}, transparent 70%)`, filter: 'blur(40px)' }} />

                  <div className="max-w-6xl mx-auto">
                    <SlideIn>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px" style={{ background: TEAL }} />
                        <span className="text-xs ms-font-sub font-bold uppercase tracking-widest" style={{ color: TEAL }}>Get In Touch</span>
                      </div>
                      <h2 className="ms-font-display text-5xl sm:text-7xl text-white mb-14 leading-none">CONTACT US</h2>
                    </SlideIn>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Left: info */}
                      <SlideIn delay={50} dir="left">
                        <div className="space-y-5">
                          {[
                            { Icon: MapPin, label: 'Location', value: content.contact_info?.address || 'New York, USA' },
                            { Icon: Phone, label: 'Phone', value: content.contact_info?.phone || '+1 234 567 8900' },
                            { Icon: Mail, label: 'Email', value: content.contact_info?.email || 'hello@studio.com' },
                          ].map(({ Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: NAVY, border: `1.5px solid ${BORDER}` }}>
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `rgba(0,201,177,0.12)`, border: `1px solid ${BORDER}` }}>
                                <Icon size={20} style={{ color: TEAL }} />
                              </div>
                              <div>
                                <p className="text-[10px] ms-font-sub uppercase tracking-widest font-bold text-slate-500">{label}</p>
                                <p className="text-sm ms-font-sub font-semibold text-slate-200 mt-0.5">{value}</p>
                              </div>
                            </div>
                          ))}

                          {/* Social row */}
                          <div className="flex gap-4 pt-2">
                            {[
                              { href: content.contact_info?.instagram || '#', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                              { href: content.contact_info?.facebook || '#', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                            ].map(({ href, icon }, i) => (
                              <a key={i} href={href} target="_blank" rel="noreferrer"
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all ms-btn"
                                style={{ border: `1.5px solid ${BORDER}`, background: NAVY }}>
                                {icon}
                              </a>
                            ))}
                          </div>
                        </div>
                      </SlideIn>

                      {/* Right: map */}
                      <SlideIn delay={120} dir="right">
                        <div className="rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-full min-h-[260px] relative" style={{ border: `1.5px solid ${BORDER}` }}>
                          <iframe
                            title="Map"
                            className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'New York, USA')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          />
                        </div>
                      </SlideIn>
                    </div>
                  </div>
                </section>
              );

              /* ── CUSTOM BLOCKS ── */
              if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
                <section key="custom" id="custom" className="py-20 px-6 sm:px-10 lg:px-16" style={{ backgroundColor: NAVY }}>
                  <div className="max-w-6xl mx-auto">
                    <h2 className="ms-font-display text-5xl text-white mb-12">MORE DETAILS</h2>
                    <div className="space-y-8 p-8 rounded-2xl" style={{ background: PANEL, border: `1.5px solid ${BORDER}` }}>
                      {content.custom_blocks_json.map((block: any, i: number) => {
                        if (block.type === 'heading') return <h3 key={block.id || i} className="ms-font-display text-3xl text-white text-center">{block.content}</h3>;
                        if (block.type === 'paragraph') return <p key={block.id || i} className="ms-font-sub text-slate-300 leading-relaxed text-center">{block.content}</p>;
                        if (block.type === 'image' && block.url) return <img key={block.id || i} src={block.url} alt="" className="w-full rounded-2xl max-h-[500px] object-cover" />;
                        if (block.type === 'divider') return <div key={block.id || i} className="w-full h-px" style={{ background: BORDER }} />;
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

      <footer className="py-16 px-6 sm:px-10 lg:px-16 relative" style={{ backgroundColor: NAVY, borderTop: `1px solid ${BORDER}` }}>
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL}80, transparent)` }} />

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="space-y-4">
              <h4 className="ms-font-display text-3xl ms-glow-text" style={{ color: TEAL }}>{siteName}</h4>
              <p className="text-sm ms-font-sub text-slate-400 leading-relaxed max-w-xs">
                {content.hero_description || content.settings_json?.hero_description || 'Modern salon experiences crafted for the discerning client.'}
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="ms-font-display text-xl text-white tracking-widest">QUICK LINKS</h5>
              <ul className="space-y-3 text-sm ms-font-sub">
                {['About', 'Services', 'Menu', 'Gallery', 'Contact'].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors hover:underline underline-offset-4" style={{ textDecorationColor: TEAL }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="ms-font-display text-xl text-white tracking-widest">CONTACT INFO</h5>
              <ul className="space-y-3 text-sm ms-font-sub text-slate-400">
                <li className="flex items-start gap-2"><MapPin size={14} style={{ color: TEAL, marginTop: 2, flexShrink: 0 }} />{address}</li>
                <li className="flex items-center gap-2"><Phone size={14} style={{ color: TEAL, flexShrink: 0 }} />{content.contact_info?.phone || '+1 234 567 8900'}</li>
                <li className="flex items-center gap-2"><Mail size={14} style={{ color: TEAL, flexShrink: 0 }} />{content.contact_info?.email || 'hello@studio.com'}</li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ms-font-sub text-slate-600" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
            <p>Powered by <span className="font-bold text-slate-400">Jaalam</span></p>
          </div>
        </footer>

        {/* ═══════════════════════════════════════
            ALL PRODUCTS MODAL
        ════════════════════════════════════════ */}

        {/* ═══════════════════════════════════════
            STYLE DETAIL MODAL
        ════════════════════════════════════════ */}
        {selectedStyle && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedStyle(null)}>
            <div
              className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden text-left"
              style={{ background: PANEL, border: `1.5px solid ${BORDER}`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 w-full bg-stone-900 overflow-hidden">
                <img src={selectedStyle.image} alt={selectedStyle.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${PANEL}DD 0%, transparent 50%)` }} />
                <button onClick={() => setSelectedStyle(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 text-white transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="ms-font-display text-2xl text-white">{selectedStyle.name}</h3>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-base ms-font-display font-normal px-3 py-1 rounded-lg text-black" style={{ background: TEAL }}>{selectedStyle.price}</span>
                    <span className="flex items-center gap-1 text-xs ms-font-sub font-bold" style={{ color: TEAL }}><Star size={12} fill={TEAL} />{selectedStyle.rating}</span>
                    <span className="flex items-center gap-1 text-xs ms-font-sub text-slate-400"><Clock size={12} />{selectedStyle.time}</span>
                  </div>
                </div>

                <div className="pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <p className="text-[9px] ms-font-sub uppercase tracking-widest text-slate-500 mb-1.5">Description</p>
                  <p className="text-xs ms-font-sub text-slate-300 leading-relaxed">
                    {selectedStyle.description || 'A precision service custom-tailored for you. Includes consultation, wash, styling and premium finish.'}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 ms-btn text-xs ms-font-sub font-bold py-2.5 rounded-xl text-black ms-glow"
                    style={{ background: `linear-gradient(135deg, ${TEAL}, #00A896)` }}
                    onClick={() => { setSelectedStyle(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Book Appointment
                  </button>
                  <button
                    className="ms-btn px-4 py-2.5 rounded-xl text-xs ms-font-sub font-bold text-slate-300 hover:text-white transition-colors"
                    style={{ border: `1.5px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}
                    onClick={() => setSelectedStyle(null)}
                  >
                    Close
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
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedService(null)}>
            <div
              className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden text-left"
              style={{ background: PANEL, border: `1.5px solid ${BORDER}`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 w-full bg-stone-900 overflow-hidden">
                {selectedService.image ? (
                  <img src={selectedService.image} alt={selectedService.title || selectedService.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, #111827, #0F172A)` }}>
                    <Scissors size={40} style={{ color: TEAL }} />
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${PANEL}DD 0%, transparent 50%)` }} />
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 text-white transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="ms-font-display text-2xl text-white">{selectedService.title || selectedService.name}</h3>
                </div>

                <div className="pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <p className="text-[9px] ms-font-sub uppercase tracking-widest text-slate-500 mb-1.5">Description</p>
                  <p className="text-xs ms-font-sub text-slate-300 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 ms-btn text-xs ms-font-sub font-bold py-2.5 rounded-xl text-black ms-glow"
                    style={{ background: `linear-gradient(135deg, ${TEAL}, #00A896)` }}
                    onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Learn More
                  </button>
                  <button
                    className="ms-btn px-4 py-2.5 rounded-xl text-xs ms-font-sub font-bold text-slate-300 hover:text-white transition-colors"
                    style={{ border: `1.5px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}
                    onClick={() => setSelectedService(null)}
                  >
                    Close
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
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-all"
              onClick={e => { e.stopPropagation(); setSelectedImage(null); }}>
              <X size={22} />
            </button>
            <img src={selectedImage} alt="Gallery" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
          </div>
        )}

      
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={content?.products_json || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
    </>
  );
}

