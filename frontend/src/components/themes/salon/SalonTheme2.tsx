import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Star, Clock, Scissors, Phone, Mail, ChevronLeft, X, ArrowRight, Menu as MenuIcon } from 'lucide-react';

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
/* ─── Fade-in on scroll ─── */
function FadeInView({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Props ─── */
interface SalonTheme2Props {
  website: any;
  content: any;
}

/* ═══════════════════════════════════════════════════
   GLAMOUR BEAUTY THEME
   ═══════════════════════════════════════════════════ */
export default function SalonTheme2({ website, content }: SalonTheme2Props) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Palette ── */
  const gold = '#C9A96E';
  const goldLight = '#D4B483';
  const cream = '#FAF7F2';
  const darkBg = '#1A1612';
  const warmGray = '#8C7E6F';

  /* ── Content ── */
  const siteName = content.settings_json?.website_name || website.slug || 'Beautify';
  const address = content.contact_info?.address || 'Lagos, Nigeria';

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const heroTitle = content.hero_title || content.settings_json?.hero_title || 'Glamorous Transformations';
  const heroDescription = content.hero_description || content.settings_json?.hero_description || content.about_text || 'Experience the art of beauty in a luxurious setting. Our expert stylists create stunning transformations tailored uniquely for you.';

  const defaultStyles = [
    { name: 'Precision Haircut', time: '45 mins', price: '?65.00', rating: 4.9, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Balayage Highlights', time: '120 mins', price: '?180.00', rating: 5.0, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Hydrating Parlour Facial', time: '60 mins', price: '?95.00', rating: 4.8, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Bridal & Parlour Makeup', time: '120 mins', price: '?250.00', rating: 5.0, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  const haircutStyles = content.products_json && content.products_json.length > 0
    ? content.products_json.map((p: any) => ({
      name: p.name || p.title || 'Style',
      price: p.price || '',
      time: (p.description && (p.description.toLowerCase().includes('min') || p.description.toLowerCase().includes('hr') || p.description.length < 12)) ? p.description : '60 mins',
      description: p.description && !(p.description.toLowerCase().includes('min') || p.description.toLowerCase().includes('hr') || p.description.length < 12) ? p.description : `Premium professional ${p.name || p.title || 'styling'} service tailored to perfection. Includes personal consultation.`,
      rating: 4.9,
      image: p.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }))
    : defaultStyles.map(s => ({
      ...s,
      description: `Indulge in our premium ${s.name} service, curated to enhance your natural beauty. Includes consultation, application, and finishing.`
    }));

  const defaultServices = [
    { title: 'Hair Design & Cuts', description: 'Precision haircuts, bespoke styling, and luxury wash & blowout services.', image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Hair Coloring', description: 'Expert custom color, balayage, highlight transformations, and hair health gloss treatments.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Beauty Parlour Facials', description: 'Rejuvenating parlour facial treatments, hydration therapies, and glowing skin routines.', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  const salonServices = content.services_json && content.services_json.length > 0
    ? content.services_json
    : defaultServices;

  const defaultGallery = [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  ];

  let galleryImages = content.gallery_json && content.gallery_json.length > 0
    ? [...content.gallery_json]
    : [...defaultGallery];
  if (galleryImages.length > 0 && galleryImages.length < 6) {
    galleryImages = [...galleryImages, ...defaultGallery.slice(galleryImages.length, 6)];
  }

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap');

        .font-glamour { font-family: 'Playfair Display', 'Georgia', serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
        .font-elegant { font-family: 'Cormorant Garamond', 'Georgia', serif; }

        .glamour-gradient { background: linear-gradient(135deg, ${gold} 0%, ${goldLight} 50%, #E8D5B7 100%); }

        .glamour-text-gradient {
          background: linear-gradient(135deg, ${gold}, ${goldLight});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glamour-line {
          width: 60px;
          height: 2px;
          background: ${gold};
        }

        .glamour-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glamour-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(201, 169, 110, 0.2);
        }

        .glamour-img-zoom {
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glamour-img-zoom:hover {
          transform: scale(1.05);
        }

        .glamour-hero-img {
          clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%);
        }

        @media (max-width: 768px) {
          .glamour-hero-img {
            clip-path: none;
          }
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        h1, h2, h3, h4, h5, h6, p, span, a, li {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }

        ${content.custom_css || ''}
      `}</style>

      <div className="font-body bg-white text-stone-900 relative w-full overflow-x-hidden min-h-screen">

        {/* ═══════════════════════════════════════
            NAVIGATION
            ═══════════════════════════════════════ */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.06)]' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
            {/* Brand */}
            <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2 group">
              <span className={`font-glamour text-2xl font-bold tracking-wide transition-colors duration-300 ${scrolled ? 'text-stone-900' : 'text-stone-900'}`}>
                {siteName}
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={`text-[13px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 hover:opacity-100 ${scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollTo('#contact')}
                className="hidden md:flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-white px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})` }}
              >
                Book Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-stone-100 shadow-xl animate-in slide-in-from-top duration-300">
              <div className="px-6 py-6 flex flex-col gap-1">
                {navLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="text-left text-base font-semibold text-stone-700 hover:text-stone-900 py-3 border-b border-stone-100 last:border-0 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo('#contact')}
                  className="mt-4 text-white font-bold py-3.5 rounded-full text-sm uppercase tracking-wider"
                  style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})` }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* ═══════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════ */}
        {!(content.settings_json?.hidden_sections || []).includes('hero') && (
          <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: cream }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.07]" style={{ background: `radial-gradient(circle, ${gold} 0%, transparent 70%)` }} />
            <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, ${gold} 0%, transparent 70%)` }} />

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12 md:pt-0 md:pb-0">
              <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-0 min-h-[calc(100vh-80px)]">

                {/* Left: Text Content */}
                <div className="flex-1 min-w-0 w-full flex flex-col justify-center text-center md:text-left z-10 md:pr-12 lg:pr-20">
                  <FadeInView>
                    {/* Accent line + subtitle */}
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-6">
                      <div className="glamour-line" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">Beauty & Wellness</span>
                    </div>

                    <h1 className="font-glamour text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-6">
                      {heroTitle.split(' ').map((word: string, i: number) => (
                        <React.Fragment key={i}>
                          {i === 0 && <span className="glamour-text-gradient">{word}</span>}
                          {i !== 0 && <> {word}</>}
                        </React.Fragment>
                      ))}
                    </h1>

                    <p className="text-stone-500 text-base lg:text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-10 font-medium break-words whitespace-pre-wrap">
                      {heroDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                      <button
                        onClick={() => scrollTo('#services')}
                        className="group flex items-center gap-3 text-white font-bold py-4 px-10 rounded-full text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})` }}
                      >
                        Explore Services
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => scrollTo('#gallery')}
                        className="flex items-center gap-2 text-stone-600 font-semibold text-sm uppercase tracking-wider hover:text-stone-900 transition-colors py-4 px-6"
                      >
                        View Gallery
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-12 justify-center md:justify-start">
                      <div>
                        <div className="font-glamour text-3xl font-bold" style={{ color: gold }}>500+</div>
                        <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-1">Happy Clients</div>
                      </div>
                      <div className="w-px h-12 bg-stone-200" />
                      <div>
                        <div className="font-glamour text-3xl font-bold" style={{ color: gold }}>15+</div>
                        <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-1">Expert Stylists</div>
                      </div>
                      <div className="w-px h-12 bg-stone-200" />
                      <div>
                        <div className="font-glamour text-3xl font-bold" style={{ color: gold }}>5.0</div>
                        <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-1">Rating</div>
                      </div>
                    </div>
                  </FadeInView>
                </div>

                {/* Right: Hero Image */}
                <div className="flex-1 relative w-full md:w-auto">
                  <FadeInView delay={200}>
                    <div className="relative">
                      {/* Image */}
                      <div className="glamour-hero-img rounded-3xl md:rounded-none overflow-hidden aspect-[3/4] md:aspect-auto md:h-screen relative">
                        <img
                          src={heroImage}
                          alt="Salon"
                          className="w-full h-full object-cover"
                        />
                        {/* Warm overlay */}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(201,169,110,0.08) 0%, transparent 40%, rgba(26,22,18,0.3) 100%)' }} />
                      </div>

                      {/* Floating card */}
                      <div className="absolute bottom-8 left-4 md:-left-16 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl shadow-stone-900/10 border border-stone-100 max-w-[220px]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${gold}20` }}>
                            <Star size={18} fill={gold} color={gold} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">Top Rated</div>
                            <div className="text-xs text-stone-400 font-medium">Salon in the City</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={gold} color={gold} />)}
                          <span className="text-sm font-bold text-stone-700 ml-2">5.0</span>
                        </div>
                      </div>
                    </div>
                  </FadeInView>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════ */}
        <div className="w-full bg-white">
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-28">

            {(content.settings_json?.section_order || ['about', 'services', 'menu', 'gallery', 'contact', 'custom'])
              .filter((s: string) => s !== 'hero' && !(content.settings_json?.hidden_sections || []).includes(s))
              .map((sectionId: string) => {

                /* ─── ABOUT ─── */
                if (sectionId === 'about') {
                  return (
                    <FadeInView key="about" delay={100}>
                      <section className="mb-24 md:mb-32" id="about">
                        {/* Section Header */}
                        <div className="text-center mb-14">
                          <div className="flex items-center gap-4 justify-center mb-4">
                            <div className="glamour-line" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">About Us</span>
                            <div className="glamour-line" />
                          </div>
                          <h2 className="font-glamour text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900">
                            {content.settings_json?.about_title || 'Our Story'}
                          </h2>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                          {/* Image */}
                          <div className="w-full md:w-1/2 shrink-0">
                            <div className="relative">
                              <img
                                src={content.settings_json?.about_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                alt="About Us"
                                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
                              />
                              {/* Gold border decoration */}
                              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 rounded-2xl -z-10" style={{ borderColor: `${gold}40` }} />
                            </div>
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0 w-full text-center md:text-left">
                            <p className="text-stone-500 text-base md:text-lg leading-relaxed font-medium break-words whitespace-pre-wrap">
                              {(() => {
                                const text = content.settings_json?.about_description || content.about_text;
                                if (!text || text === 'Add your business description here.' || text.trim() === '') {
                                  return 'Welcome to our luxurious beauty sanctuary, where every visit is a transformative experience. Our team of expert stylists and beauticians are dedicated to bringing out your natural radiance with bespoke treatments and world-class products.';
                                }
                                return text;
                              })()}
                            </p>
                            <div className="mt-8">
                              <button
                                onClick={() => scrollTo('#contact')}
                                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors duration-300 group"
                                style={{ color: gold }}
                              >
                                Learn More
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    </FadeInView>
                  );
                }

                /* ─── SERVICES ─── */
                if (sectionId === 'services') {
                  return (
                    <FadeInView key="services" delay={200}>
                      <section className="mb-24 md:mb-32" id="services">
                        <div className="text-center mb-14">
                          <div className="flex items-center gap-4 justify-center mb-4">
                            <div className="glamour-line" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">What We Offer</span>
                            <div className="glamour-line" />
                          </div>
                          <h2 className="font-glamour text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900">
                            Our Services
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                          {salonServices.map((service: any, idx: number) => (
                            <div
                              key={idx}
                              className="glamour-card bg-white rounded-2xl overflow-hidden border border-stone-100 group cursor-pointer"
                            >
                              <div className="aspect-[4/3] overflow-hidden">
                                {service.image ? (
                                  <img
                                    src={service.image}
                                    alt={service.title || service.name}
                                    className="w-full h-full object-cover glamour-img-zoom"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${gold}15` }}>
                                    <Scissors size={40} style={{ color: gold }} />
                                  </div>
                                )}
                              </div>
                              <div className="p-6">
                                <h4 className="font-glamour text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                                  {service.title || service.name}
                                </h4>
                                <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 font-medium">
                                  {service.description}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: gold }}>
                                  Learn More <ArrowRight size={12} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </FadeInView>
                  );
                }

                /* ─── MENU / PRODUCTS ─── */
                if (sectionId === 'menu') {
                  return (
                    <FadeInView key="menu" delay={300}>
                      <section className="mb-24 md:mb-32" id="menu">
                        <div className="flex justify-between items-end mb-10">
                          <div>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="glamour-line" />
                              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">Our Menu</span>
                            </div>
                            <h2 className="font-glamour text-3xl md:text-4xl font-bold text-stone-900">
                              Popular Services
                            </h2>
                          </div>
                          <button
                            onClick={() => setShowAllProducts(true)}
                            className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:opacity-80"
                            style={{ color: gold }}
                          >
                            View All <ArrowRight size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {haircutStyles.slice(0, 4).map((style: any, idx: number) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedStyle(style)}
                              className="glamour-card flex gap-5 items-center cursor-pointer group bg-white border border-stone-100 rounded-2xl p-4 md:p-5 hover:border-amber-200"
                            >
                              <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0">
                                <img src={style.image} alt={style.name} className="w-full h-full object-cover glamour-img-zoom" />
                              </div>
                              <div className="flex-1 py-1 text-left">
                                <h4 className="font-glamour font-bold text-base md:text-lg text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
                                  {style.name}
                                </h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm md:text-base font-bold text-stone-800">{style.price}</span>
                                  <div className="w-1 h-1 rounded-full bg-stone-300" />
                                  <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
                                    <Clock size={13} />
                                    <span>{style.time}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: `${gold}12`, color: gold }}>
                                  <Star size={12} fill={gold} color={gold} />
                                  {style.rating}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setShowAllProducts(true)}
                          className="sm:hidden mt-6 w-full flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider py-3 border border-stone-200 rounded-full hover:border-amber-300 transition-colors"
                          style={{ color: gold }}
                        >
                          View All Services <ArrowRight size={14} />
                        </button>
                      </section>
                    </FadeInView>
                  );
                }

                /* ─── GALLERY ─── */
                if (sectionId === 'gallery') {
                  return (
                    <FadeInView key="gallery" delay={350}>
                      <section className="mb-24 md:mb-32" id="gallery">
                        <div className="text-center mb-14">
                          <div className="flex items-center gap-4 justify-center mb-4">
                            <div className="glamour-line" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">Portfolio</span>
                            <div className="glamour-line" />
                          </div>
                          <h2 className="font-glamour text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900">
                            Our Gallery
                          </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                          {galleryImages.slice(0, 6).map((img: string, idx: number) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedImage(img)}
                              className={`overflow-hidden rounded-2xl relative group cursor-pointer ${idx === 0 ? 'md:row-span-2 md:col-span-1' : ''}`}
                            >
                              <div className={`${idx === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square'}`}>
                                <img
                                  src={img}
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-full h-full object-cover glamour-img-zoom"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" size={24} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </FadeInView>
                  );
                }

                /* ─── CONTACT ─── */
                if (sectionId === 'contact') {
                  return (
                    <FadeInView key="contact" delay={400}>
                      <section className="mb-16" id="contact">
                        <div className="text-center mb-14">
                          <div className="flex items-center gap-4 justify-center mb-4">
                            <div className="glamour-line" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">Get in Touch</span>
                            <div className="glamour-line" />
                          </div>
                          <h2 className="font-glamour text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900">
                            Contact Us
                          </h2>
                        </div>

                        <div className="rounded-3xl overflow-hidden border border-stone-100 shadow-sm">
                          <div className="flex flex-col lg:flex-row">
                            {/* Contact Info */}
                            <div className="flex-1 p-8 md:p-12 space-y-8" style={{ backgroundColor: cream }}>
                              <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${gold}15`, color: gold }}>
                                  <MapPin size={20} />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-1">Location</p>
                                  <p className="text-sm font-bold text-stone-800">{content.contact_info?.address || 'Lagos, Nigeria'}</p>
                                </div>
                              </div>

                              <div className="w-full h-px bg-stone-200/70" />

                              <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${gold}15`, color: gold }}>
                                  <Phone size={20} />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-1">Phone</p>
                                  <p className="text-sm font-bold text-stone-800">{content.contact_info?.phone || '+1 234 567 8900'}</p>
                                </div>
                              </div>

                              <div className="w-full h-px bg-stone-200/70" />

                              <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${gold}15`, color: gold }}>
                                  <Mail size={20} />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-1">Email</p>
                                  <p className="text-sm font-bold text-stone-800">{content.contact_info?.email || 'hello@beautify.com'}</p>
                                </div>
                              </div>

                              <div className="w-full h-px bg-stone-200/70" />

                              {/* Social Links */}
                              <div className="flex items-center gap-4 pt-2">
                                <a
                                  href={content.contact_info?.instagram || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-white hover:border-transparent transition-all duration-300"
                                  style={{ ['--tw-hover-bg' as any]: gold }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = gold; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                >
                                  <InstagramIcon size={18} />
                                </a>
                                <a
                                  href={content.contact_info?.facebook || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-white hover:border-transparent transition-all duration-300"
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = gold; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                >
                                  <FacebookIcon size={18} />
                                </a>
                                <a
                                  href={content.contact_info?.twitter || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-white hover:border-transparent transition-all duration-300"
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = gold; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                >
                                  <TwitterIcon size={18} />
                                </a>
                              </div>
                            </div>

                            {/* Map */}
                            <div className="flex-1 min-h-[300px] lg:min-h-full relative bg-stone-100">
                              <iframe
                                title="Location Map"
                                className="absolute inset-0 w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Lagos, Nigeria')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                              />
                            </div>
                          </div>
                        </div>
                      </section>
                    </FadeInView>
                  );
                }

                /* ─── CUSTOM BLOCKS ─── */
                if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                  return (
                    <FadeInView key="custom">
                      <section className="mb-20 md:mb-28" id="custom">
                        <div className="text-center mb-14">
                          <div className="flex items-center gap-4 justify-center mb-4">
                            <div className="glamour-line" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">More</span>
                            <div className="glamour-line" />
                          </div>
                          <h2 className="font-glamour text-3xl md:text-4xl font-bold text-stone-900">More Details</h2>
                        </div>

                        <div className="rounded-2xl border border-stone-100 p-6 sm:p-8 md:p-10 space-y-8" style={{ backgroundColor: cream }}>
                          {content.custom_blocks_json.map((block: any, idx: number) => {
                            if (block.type === 'heading') {
                              return <h4 key={block.id || idx} className="font-glamour font-bold text-stone-900 text-lg md:text-xl text-center">{block.content}</h4>;
                            }
                            if (block.type === 'paragraph') {
                              return <p key={block.id || idx} className="text-sm md:text-base text-stone-600 leading-relaxed whitespace-pre-wrap text-center font-medium">{block.content}</p>;
                            }
                            if (block.type === 'image') {
                              return block.url ? <img key={block.id || idx} src={block.url} alt="Custom Block" className="w-full h-auto object-cover rounded-2xl shadow-md max-h-[400px] md:max-h-[500px]" /> : null;
                            }
                            if (block.type === 'divider') {
                              return <div key={block.id || idx} className="w-full h-px bg-stone-200 my-6" />;
                            }
                            return null;
                          })}
                        </div>
                      </section>
                    </FadeInView>
                  );
                }

                return null;
              })}
          </div>

          {/* ═══════════════════════════════════════
              FOOTER
              ═══════════════════════════════════════ */}
          <footer className="relative overflow-hidden text-white" style={{ backgroundColor: darkBg }}>
            {/* Gold accent line */}
            <div className="w-full h-1" style={{ background: `linear-gradient(90deg, transparent 0%, ${gold} 50%, transparent 100%)` }} />

            <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-left">
                {/* Brand Column */}
                <div className="space-y-5">
                  <h4 className="font-glamour text-2xl font-bold" style={{ color: gold }}>{siteName}</h4>
                  <p className="text-stone-400 text-sm leading-relaxed font-medium max-w-xs">
                    {heroDescription.length > 120 ? heroDescription.slice(0, 120) + '...' : heroDescription}
                  </p>
                  <div className="flex gap-3 pt-2">
                    <a href={content.contact_info?.instagram || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-500 hover:border-amber-500 hover:text-amber-400 transition-colors">
                      <InstagramIcon size={16} />
                    </a>
                    <a href={content.contact_info?.facebook || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-500 hover:border-amber-500 hover:text-amber-400 transition-colors">
                      <FacebookIcon size={16} />
                    </a>
                    <a href={content.contact_info?.twitter || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-500 hover:border-amber-500 hover:text-amber-400 transition-colors">
                      <TwitterIcon size={16} />
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-5">
                  <h4 className="text-white text-sm font-bold uppercase tracking-widest">Quick Links</h4>
                  <ul className="space-y-3 text-sm font-medium text-stone-400">
                    <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
                    <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                    <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-5">
                  <h4 className="text-white text-sm font-bold uppercase tracking-widest">Contact Info</h4>
                  <ul className="space-y-3 text-sm font-medium text-stone-400">
                    <li className="flex items-start gap-2.5">
                      <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: gold }} />
                      <span className="leading-snug">{address}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone size={16} className="shrink-0" style={{ color: gold }} />
                      <span>{content.contact_info?.phone || '+1 234 567 8900'}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail size={16} className="shrink-0" style={{ color: gold }} />
                      <span>{content.contact_info?.email || 'hello@beautify.com'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-stone-800 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-stone-500 text-xs font-medium">
                  &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
                </p>
                <p className="text-stone-600 text-xs font-medium">
                  Crafted with <span style={{ color: gold }}>&hearts;</span> by <span className="text-white font-bold">Jaalam</span>
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* ═══════════════════════════════════════
            ALL PRODUCTS OVERLAY
            ═══════════════════════════════════════ */}
        {showAllProducts && (
          <div className="fixed inset-0 z-[100] bg-white overflow-y-auto w-full h-full text-left">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
              <button onClick={() => setShowAllProducts(false)} className="flex items-center gap-2 text-stone-800 font-bold hover:opacity-80 transition-colors">
                <ChevronLeft size={24} /> Back
              </button>
              <h2 className="font-glamour text-xl font-bold text-stone-900">All Treatments</h2>
              <div className="w-8" />
            </div>

            <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {haircutStyles.map((style: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedStyle(style)}
                    className="glamour-card flex gap-5 items-center cursor-pointer group bg-white border border-stone-100 rounded-2xl p-4 md:p-5 hover:border-amber-200"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0">
                      <img src={style.image} alt={style.name} className="w-full h-full object-cover glamour-img-zoom" />
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="font-glamour font-bold text-base md:text-lg text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
                        {style.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm md:text-base font-bold text-stone-800">{style.price}</span>
                        <div className="w-1 h-1 rounded-full bg-stone-300" />
                        <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
                          <Clock size={13} />
                          <span>{style.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: `${gold}12`, color: gold }}>
                        <Star size={12} fill={gold} color={gold} />
                        {style.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            STYLE DETAIL MODAL
            ═══════════════════════════════════════ */}
        {selectedStyle && (
          <div
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedStyle(null)}
          >
            <div
              className="bg-white w-full max-w-sm max-h-[85vh] sm:max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left"
              onClick={e => e.stopPropagation()}
            >
              {/* Image Header */}
              <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden shrink-0">
                <img src={selectedStyle.image} alt={selectedStyle.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-stone-800 p-2 rounded-full shadow-md transition-all active:scale-95 z-20"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
                <div>
                  <h3 className="font-glamour text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-2 text-stone-900">
                    {selectedStyle.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs sm:text-sm font-bold px-3 py-1 text-white rounded-full shadow-sm" style={{ backgroundColor: gold }}>
                      {selectedStyle.price}
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md" style={{ backgroundColor: `${gold}12` }}>
                      <Star size={12} fill={gold} color={gold} />
                      <span className="text-xs sm:text-sm font-bold text-stone-800">{selectedStyle.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-400 text-[11px] sm:text-xs font-medium">
                      <Clock size={12} />
                      <span>{selectedStyle.time}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Details</h4>
                  <p className="font-medium text-xs sm:text-sm leading-relaxed text-stone-500">
                    {selectedStyle.description || 'Experience a premium service tailored to your unique preferences. Includes consultation, treatment, and finishing.'}
                  </p>
                </div>

                <div className="pt-2 flex gap-2 sm:gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedStyle(null);
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 text-white font-bold py-2.5 sm:py-3.5 rounded-full transition-all active:scale-95 shadow-md text-center text-xs sm:text-sm"
                    style={{ backgroundColor: gold }}
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className="px-4 sm:px-6 border border-stone-200 text-stone-500 hover:bg-stone-50 font-bold py-2.5 sm:py-3.5 rounded-full transition-all active:scale-95 text-xs sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            LIGHTBOX MODAL
            ═══════════════════════════════════════ */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-black/50 rounded-full hover:bg-black/80"
              onClick={e => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Fullscreen Gallery"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}

