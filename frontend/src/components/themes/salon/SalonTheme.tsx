import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Star, Clock, Scissors, Activity, Grid, ChevronDown, Phone, Mail, ChevronLeft, X } from 'lucide-react';

function FadeInView({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
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
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      {children}
    </div>
  );
}

interface SalonThemeProps {
  website: any;
  content: any;
}

export default function SalonTheme({ website, content }: SalonThemeProps) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Theme Configuration
  const theme = website.theme || 'Classic Barbershop';

  // Default theme settings (Classic Barbershop - using original gold/beige styling)
  let primaryGold = '#C69B38'; // vintage gold
  let bgColor = 'bg-white'; // original white bg
  let bgSecondaryHex = '#ffffff';
  let textColor = 'text-stone-900';
  let textMuted = 'text-gray-500';
  let fontHeading = ''; // original font
  let fontBody = 'font-sans';
  let buttonShape = 'rounded-full';
  let cardShape = 'rounded-3xl border border-amber-100/50 shadow-sm';
  let blockShadow = '';
  let heroTheme = 'dark';
  let heroBg = 'bg-black';
  let heroTextColor = 'text-white';
  let heroSubtextColor = 'text-gray-300';
  let footerBg = 'bg-stone-900';
  let footerTextColor = 'text-stone-400';
  let footerAccentColor = '#C69B38';
  let accentBorder = 'border-stone-100';
  let categoryCardClass = (isActive: boolean) => `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-white border-2 border-gray-100 shadow-md scale-105' : 'bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-gray-200 group-hover:shadow-md'}`;
  let itemCardClass = `flex gap-4 md:gap-6 items-center cursor-pointer transition-all duration-300 group bg-white border border-stone-100 rounded-2xl p-4 md:p-5 hover:border-stone-250 hover:shadow-lg`;
  let serviceCardClass = `bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:border-gray-200 transition-all`;
  let accentPole = false;

  if (theme === 'Modern Saloon') {
    primaryGold = '#E0115F'; // vibrant ruby magenta
    bgColor = 'bg-[#0F0F12]'; // dark charcoal
    bgSecondaryHex = '#1A1A22';
    textColor = 'text-slate-200';
    textMuted = 'text-slate-400';
    fontHeading = 'font-modern font-black tracking-tight uppercase';
    fontBody = 'font-modern';
    buttonShape = 'rounded-md';
    cardShape = 'rounded-xl border border-stone-800 bg-[#1A1A22] shadow-[0_8px_30px_rgb(0,0,0,0.4)]';
    blockShadow = 'shadow-[0_0_15px_rgba(224,17,95,0.2)]';
    heroTheme = 'dark';
    heroBg = 'bg-[#0F0F12]';
    heroTextColor = 'text-white';
    heroSubtextColor = 'text-slate-300';
    footerBg = 'bg-[#070709]';
    footerTextColor = 'text-slate-400';
    footerAccentColor = '#E0115F';
    accentBorder = 'border-stone-850';
    categoryCardClass = (isActive: boolean) => `w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-[#1A1A22] border-2 border-[#E0115F] shadow-md scale-105 text-white' : 'bg-stone-900 border border-stone-850 group-hover:bg-[#1A1A22]'}`;
    itemCardClass = `flex gap-4 md:gap-6 items-center cursor-pointer transition-all duration-300 group bg-[#1A1A22] border border-stone-800 rounded-xl p-4 md:p-5 hover:border-[#E0115F]`;
    serviceCardClass = `bg-[#1A1A22] rounded-xl p-5 shadow-sm border border-stone-800 flex items-center gap-5 hover:border-[#E0115F] transition-all`;
  } else if (theme === 'Vintage Barber') {
    primaryGold = '#E63946'; // Crimson red
    bgColor = 'bg-[#FAF6F0]'; // warm parchment cream
    bgSecondaryHex = '#EAE5DC';
    textColor = 'text-[#1D3557]';
    textMuted = 'text-slate-500';
    fontHeading = 'font-modern font-extrabold tracking-wide uppercase';
    fontBody = 'font-sans';
    buttonShape = 'rounded-md';
    cardShape = 'rounded-2xl border-4 border-dashed border-[#1D3557] bg-white shadow-md';
    blockShadow = '';
    heroTheme = 'light';
    heroBg = 'bg-[#EAE5DC]';
    heroTextColor = 'text-[#1D3557]';
    heroSubtextColor = 'text-[#1D3557]/80';
    footerBg = 'bg-[#1D3557]';
    footerTextColor = 'text-slate-300';
    footerAccentColor = '#E63946';
    accentBorder = 'border-[#EAE5DC]';
    accentPole = true; // Show retro barber pole styling
    categoryCardClass = (isActive: boolean) => `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border-2 border-slate-200 ${isActive ? 'bg-white border-4 border-[#E63946] shadow-md scale-105' : 'bg-[#FAF6F0] group-hover:bg-white'}`;
    itemCardClass = `flex gap-4 md:gap-6 items-center cursor-pointer transition-all duration-300 group bg-white border border-slate-100 rounded-2xl p-4 md:p-5 hover:border-[#E63946] hover:shadow-md`;
    serviceCardClass = `bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-5 hover:border-[#E63946] hover:shadow-md transition-all`;
  } else if (theme === 'Royal Saloon') {
    primaryGold = '#D4AF37'; // deep gold
    bgColor = 'bg-[#0B0F19]'; // royal dark blue/charcoal background
    bgSecondaryHex = '#131A2E';
    textColor = 'text-slate-100';
    textMuted = 'text-slate-400';
    fontHeading = 'font-barber font-bold tracking-widest';
    fontBody = 'font-luxury';
    buttonShape = 'rounded-[2rem]';
    cardShape = 'rounded-[2rem] border border-[#D4AF37]/30 bg-[#131A2E] shadow-[0_10px_35px_rgba(212,175,55,0.08)]';
    blockShadow = 'shadow-[0_4px_25px_rgba(212,175,55,0.15)]';
    heroTheme = 'dark';
    heroBg = 'bg-[#0B0F19]';
    heroTextColor = 'text-white';
    heroSubtextColor = 'text-slate-300';
    footerBg = 'bg-[#060910]';
    footerTextColor = 'text-slate-500';
    footerAccentColor = '#D4AF37';
    accentBorder = 'border-stone-850';
    categoryCardClass = (isActive: boolean) => `w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-[#131A2E] border-2 border-[#D4AF37] shadow-md scale-105 text-[#D4AF37]' : 'bg-[#0B0F19] border border-[#D4AF37]/20 group-hover:bg-[#131A2E]'}`;
    itemCardClass = `flex gap-4 md:gap-6 items-center cursor-pointer transition-all duration-300 group bg-[#131A2E] border border-[#D4AF37]/20 rounded-3xl p-4 md:p-5 hover:border-[#D4AF37] hover:shadow-lg`;
    serviceCardClass = `bg-[#131A2E] rounded-3xl border border-[#D4AF37]/20 p-5 shadow-sm flex items-center gap-5 hover:border-[#D4AF37] transition-all`;
  }

  const siteName = content.settings_json?.website_name || website.slug || 'Barber';
  const address = content.contact_info?.address || 'Lagos, Nigeria';

  const categories = [
    { name: 'All', icon: <Grid size={24} /> },
    { name: 'Haircut', icon: <Scissors size={24} /> },
    { name: 'Shaving', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l3-3 3 3-3 3-3-3z" /><path d="M17 9l-4 4-2-2-4 4 2 2 4-4 2 2 4-4z" /></svg> },
    { name: 'Modeling', icon: <Activity size={24} /> },
  ];

  const defaultStyles = [
    { name: 'Classic Fade', time: '45 mins', price: '?35.00', rating: 4.8, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Textured Crop', time: '60 mins', price: '?45.00', rating: 4.9, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Beard Trim & Line Up', time: '30 mins', price: '?25.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Signature Styling', time: '45 mins', price: '?40.00', rating: 5.0, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  ];

  const haircutStyles = content.products_json && content.products_json.length > 0
    ? content.products_json.map((p: any) => ({
      name: p.name || p.title || 'Style',
      price: p.price || '',
      time: (p.description && (p.description.toLowerCase().includes('min') || p.description.toLowerCase().includes('hr') || p.description.length < 12)) ? p.description : '45 mins',
      description: p.description && !(p.description.toLowerCase().includes('min') || p.description.toLowerCase().includes('hr') || p.description.length < 12) ? p.description : `Premium professional ${p.name || p.title || 'styling'} service tailored to perfection. Includes personal consultation.`,
      rating: 4.9,
      image: p.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }))
    : defaultStyles.map(s => ({
      ...s,
      description: `Indulge in our professional ${s.name} service, custom-tailored to suit your preferences and enhance your style. Includes a wash, styling, and premium finishing products.`
    }));

  const defaultServices = [
    { title: 'Haircut & Styling', description: 'Professional haircut, wash, and premium styling.', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { title: 'Beard Grooming', description: 'Trimming, shaping, and conditioning with premium oils.', image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { title: 'Hot Towel Shave', description: 'Traditional straight razor shave with hot towel treatment.', image: 'https://images.unsplash.com/photo-1534294228306-bd54eb9a7ba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  ];

  const salonServices = content.services_json && content.services_json.length > 0
    ? content.services_json
    : defaultServices;

  // const salonProducts = [
  //   { name: 'Matte Clay Pomade', price: '?24.00', image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  //   { name: 'Premium Beard Oil', price: '?18.50', image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  //   { name: 'Hydrating Shampoo', price: '?22.00', image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  // ];

  const heroImage = content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const defaultGallery = [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  ];

  let galleryImages = content.gallery_json && content.gallery_json.length > 0
    ? [...content.gallery_json]
    : [...defaultGallery];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
        
        .font-luxury {
          font-family: 'Playfair Display', serif;
        }
        .font-modern {
          font-family: 'Montserrat', sans-serif;
        }
        .font-wellness {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-barber {
          font-family: 'Cinzel', serif;
        }

        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        ${content.custom_css || ''}
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Main Container */}
      <div className={`font-sans ${bgColor} ${textColor} relative w-full overflow-x-hidden min-h-screen ${fontBody}`}>

        {/* =========================================
            SECTION 1: HERO (Theme Adapted)
            ========================================= */}
        {!(content.settings_json?.hidden_sections || []).includes('hero') && (
          <div className={`relative min-h-[100svh] flex flex-col justify-between ${heroBg} w-full overflow-hidden`}>

            {/* Inner border effect */}
            <div className={`absolute inset-4 sm:inset-6 rounded-3xl border opacity-30 pointer-events-none z-10`} style={{ borderColor: primaryGold }}></div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="Barber" className={`w-full h-full object-cover ${heroTheme === 'dark' ? 'opacity-40' : 'opacity-20'}`} />
              <div className={`absolute inset-0`} style={heroTheme === 'light' ? { background: `linear-gradient(to top, ${bgSecondaryHex} 0%, ${bgSecondaryHex}d0 60%, transparent 100%)` } : { background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 60%, transparent 100%)' }}></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-12 w-full max-w-full overflow-hidden">
              <FadeInView>
                {/* Barber pole styling for Vintage Barber */}
                {accentPole && (
                  <div className="flex gap-1.5 justify-center mb-6 animate-pulse">
                    <div className="w-2.5 h-10 bg-[#E63946]"></div>
                    <div className="w-2.5 h-10 bg-white"></div>
                    <div className="w-2.5 h-10 bg-[#1D3557]"></div>
                    <div className="w-2.5 h-10 bg-white"></div>
                    <div className="w-2.5 h-10 bg-[#E63946]"></div>
                  </div>
                )}

                <h1 className={`${heroTextColor} text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-xl break-words w-full ${fontHeading}`}>
                  {content.hero_title || content.settings_json?.hero_title || siteName}
                </h1>

                <p className={`${heroSubtextColor} text-sm md:text-base font-medium px-4 mb-10 max-w-md mx-auto leading-relaxed break-all sm:break-words w-full`}>
                  {content.hero_description || content.settings_json?.hero_description || content.about_text || 'Find a barber close to you and book at your convenience'}
                </p>

                {/* Action Buttons */}
                <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
                  <button
                    onClick={() => {
                      document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full text-white font-bold py-4 transition-transform active:scale-95 shadow-xl ${buttonShape} ${blockShadow}`}
                    style={{ backgroundColor: primaryGold }}
                  >
                    Explore Now
                  </button>
                </div>
              </FadeInView>

              <div
                className="absolute bottom-16 md:bottom-28 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-20"
                onClick={() => document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ChevronDown className={`${heroTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-stone-800/60 hover:text-stone-900'} transition-colors`} size={32} />
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            SECTION 2: HOME CONTENT (Theme Colors)
            ========================================= */}
        <div className={`w-full ${bgColor} rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 md:-mt-20 relative z-20 ${theme === 'Modern Saloon' ? 'shadow-[0_-10px_40px_rgba(0,0,0,0.5)]' : 'shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'}`}>
          <div id="home-content" className="w-full max-w-6xl mx-auto pt-10 md:pt-16 px-6 sm:px-10 lg:px-16 pb-24">

            <FadeInView delay={100}>
              {/* Featured Highlight Card */}
              <div className={`rounded-[2rem] p-6 sm:p-10 md:p-12 relative overflow-hidden mb-12 md:mb-20 shadow-lg flex items-center ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18]' : ''}`} style={{ backgroundColor: primaryGold }}>
                <div className="relative z-10 w-2/3 sm:w-3/4 md:w-1/2 text-white">
                  <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2 md:mb-4 drop-shadow-sm ${fontHeading}`}>Premium Experience</h3>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium mb-3 md:mb-5">Expert Stylists</p>
                  <div className="flex items-center gap-1 mb-6 md:mb-8">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="white" color="white" />)}
                    <span className="text-white text-sm font-bold ml-2">5.0</span>
                  </div>
                  <button className={`bg-white text-gray-900 text-xs sm:text-sm font-bold py-3 px-6 hover:bg-gray-50 transition-colors shadow-sm active:scale-95 ${buttonShape}`}>
                    Book Appointment
                  </button>
                </div>

                {/* Highlight Image overlaid on right side */}
                <div className="absolute right-0 bottom-0 w-1/2 md:w-[45%] h-full flex items-end justify-end pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Premium Experience" className="h-[120%] md:h-[140%] object-cover object-bottom drop-shadow-2xl" />
                </div>
              </div>
            </FadeInView>

            {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
              .filter((s: string) => s !== 'hero' && !(content.settings_json?.hidden_sections || []).includes(s))
              .map((sectionId: string) => {
                if (sectionId === 'about') {
                  return (
                    <React.Fragment key="about">
                      <FadeInView delay={150}>
                        {/* About Section */}
                        <div className="mb-12 md:mb-20" id="about">
                          <h3 className={`font-bold ${textColor} text-xl md:text-2xl mb-6 ${fontHeading}`}>{content.settings_json?.about_title || 'About Us'}</h3>
                          <div className={`p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 ${cardShape} ${theme === 'Wellness' ? 'bg-[#EAF4EE]/30' : theme === 'Modern Saloon' ? 'bg-[#1A1A22]' : theme === 'Classic Barbershop' ? 'bg-white' : 'bg-amber-50/40'}`}>
                            <div className="flex-1">
                              <p className={`text-sm md:text-base ${textColor} leading-relaxed opacity-95`}>
                                {(() => {
                                  const text = content.settings_json?.about_description || content.about_text;
                                  if (!text || text === 'Add your business description here.' || text.trim() === '') {
                                    return 'Step into our luxurious salon, where expert stylists are dedicated to bringing your vision to life. From precision cuts to vibrant colors and revitalizing treatments, we offer a premium styling experience tailored just for you.';
                                  }
                                  return text;
                                })()}
                              </p>
                            </div>
                            <div className="w-full md:w-1/2 shrink-0">
                              <img
                                src={content.settings_json?.about_image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                alt="About Us"
                                className={`w-full h-48 md:h-64 object-cover ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-2xl'} shadow-md`}
                              />
                            </div>
                          </div>
                        </div>
                      </FadeInView>

                      <FadeInView delay={200}>
                        {/* Categories */}
                        <div className="mb-12 md:mb-20">
                          <div className="flex gap-4 sm:gap-6 md:gap-10 overflow-x-auto hide-scrollbar pb-4 md:justify-center md:flex-wrap">
                            {categories.map((cat, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer shrink-0 group">
                                <div className={categoryCardClass(idx === 0)}>
                                  <div className={idx === 0 ? (theme === 'Modern Saloon' ? 'text-[#E0115F]' : theme === 'Vintage Barber' ? 'text-[#E63946]' : textColor) : 'text-gray-400 group-hover:text-gray-600'}>
                                    {cat.icon}
                                  </div>
                                </div>
                                <span className={`text-xs sm:text-sm font-bold ${idx === 0 ? textColor : 'text-gray-400 group-hover:text-gray-600'}`}>
                                  {cat.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FadeInView>
                    </React.Fragment>
                  );
                }

                if (sectionId === 'services') {
                  return (
                    <FadeInView delay={300} key="services">
                      {/* Services Section */}
                      <div className="mb-12 md:mb-20" id="services">
                        <div className="flex justify-between items-end mb-6 md:mb-8">
                          <h3 className={`font-bold ${textColor} text-xl md:text-2xl ${fontHeading}`}>Our Services</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                          {salonServices.map((service: any, idx: number) => (
                            <div key={idx} className={`${serviceCardClass}`}>
                              <div className={`w-16 h-16 md:w-20 md:h-20 ${buttonShape === 'rounded-none' ? 'rounded-none border border-[#1E1B18]' : 'rounded-xl'} overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center`}>
                                {service.image ? (
                                  <img src={service.image} alt={service.title || service.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Scissors style={{ color: primaryGold }} size={28} />
                                )}
                              </div>
                              <div>
                                <h4 className={`font-bold text-base ${textColor} mb-1 ${fontHeading}`}>{service.title || service.name}</h4>
                                <p className={`text-sm ${textMuted} line-clamp-2`}>{service.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInView>
                  );
                }

                if (sectionId === 'menu') {
                  return (
                    <FadeInView delay={400} key="menu">
                      {/* Haircut Styles (Menu) */}
                      <div className="mb-12 md:mb-20" id="menu">
                        <div className="flex justify-between items-end mb-6 md:mb-8">
                          <h3 className={`font-bold ${textColor} text-xl md:text-2xl ${fontHeading}`}>Popular Styles</h3>
                          <button onClick={() => setShowAllProducts(true)} className="text-sm font-bold hover:opacity-80 transition" style={{ color: primaryGold }}>View all</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          {haircutStyles.slice(0, 4).map((style: any, idx: number) => (
                            <div key={idx} onClick={() => setSelectedStyle(style)} className={`${itemCardClass}`}>
                              <div className={`w-20 h-20 md:w-28 md:h-28 ${buttonShape === 'rounded-none' ? 'rounded-none border border-[#1E1B18]' : 'rounded-[1.25rem]'} overflow-hidden shrink-0 shadow-inner`}>
                                <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                              <div className="flex-1 py-1 text-left">
                                <h4 className={`font-bold text-base md:text-xl ${textColor} mb-1.5 md:mb-2 ${fontHeading}`}>{style.name}</h4>
                                <div className="flex items-center gap-2 mb-2 md:mb-3">
                                  <span className={`text-sm md:text-base font-bold ${textColor}`}>
                                    {style.price}
                                  </span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                  <div className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm font-medium">
                                    <Clock size={14} />
                                    <span className="line-clamp-1">{style.time}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className={`flex items-center gap-1 text-xs md:text-sm ${textColor} font-bold px-2.5 py-1 ${buttonShape === 'rounded-none' ? 'border border-[#1E1B18] bg-[#F4EFE6]' : 'bg-amber-50/50'} rounded-md`}>
                                    <Star size={14} style={{ color: primaryGold }} fill={primaryGold} />
                                    {style.rating}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInView>
                  );
                }

                if (sectionId === 'gallery') {
                  return (
                    <FadeInView delay={450} key="gallery">
                      {/* Gallery Section */}
                      <div className="mb-12 md:mb-20" id="gallery">
                        <div className="flex justify-between items-end mb-6 md:mb-8">
                          <h3 className={`font-bold ${textColor} text-xl md:text-2xl ${fontHeading}`}>Our Gallery</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                          {galleryImages.slice(0, 6).map((img, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedImage(img)}
                              className={`aspect-square ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18] hover:shadow-[6px_6px_0px_#1E1B18]' : 'rounded-2xl'} overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300`}
                            >
                              <img
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInView>
                  );
                }

                if (sectionId === 'contact') {
                  return (
                    <FadeInView delay={500} key="contact">
                      {/* Contact Section */}
                      <div className="mb-10" id="contact">
                        <h3 className={`font-bold ${textColor} text-xl md:text-2xl mb-6 md:mb-8 ${fontHeading}`}>Contact Us</h3>
                        <div className={`p-6 sm:p-8 lg:p-10 border ${accentBorder} ${theme === 'Modern Saloon' ? 'bg-[#1A1A22]' : theme === 'Classic Barbershop' ? 'bg-white border-2 border-[#1E1B18]' : theme === 'Royal Saloon' ? 'bg-[#131A2E]' : 'bg-gray-50'} ${buttonShape === 'rounded-none' ? 'rounded-none shadow-[6px_6px_0px_#1E1B18]' : 'rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]'}`}>

                          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Left Side: Contact Info */}
                            <div className="flex-1 space-y-6 text-left">
                              <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0`} style={{ color: primaryGold }}>
                                  <MapPin size={20} />
                                </div>
                                <div>
                                  <p className={`text-xs ${textMuted} font-bold tracking-wider uppercase mb-1`}>Location</p>
                                  <p className={`text-sm font-bold ${textColor}`}>{content.contact_info?.address || 'Lagos, Nigeria'}</p>
                                </div>
                              </div>

                              <div className={`w-full h-px ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}`}></div>

                              <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0`} style={{ color: primaryGold }}>
                                  <Phone size={20} />
                                </div>
                                <div>
                                  <p className={`text-xs ${textMuted} font-bold tracking-wider uppercase mb-1`}>Phone Number</p>
                                  <p className={`text-sm font-bold ${textColor}`}>{content.contact_info?.phone || '+1 234 567 8900'}</p>
                                </div>
                              </div>

                              <div className={`w-full h-px ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}`}></div>

                              <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-full'} ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900' : 'bg-white'} flex items-center justify-center shadow-sm shrink-0`} style={{ color: primaryGold }}>
                                  <Mail size={20} />
                                </div>
                                <div>
                                  <p className={`text-xs ${textMuted} font-bold tracking-wider uppercase mb-1`}>Email Address</p>
                                  <p className={`text-sm font-bold ${textColor}`}>{content.contact_info?.email || 'hello@saloo.com'}</p>
                                </div>
                              </div>

                              <div className={`w-full h-px ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-800' : 'bg-gray-200/60'}`}></div>

                              <div className="flex items-center justify-start gap-6 pt-2">
                                <a href={content.contact_info?.instagram || '#'} target="_blank" rel="noreferrer" className={`${textMuted} hover:scale-110 transition-transform hover:text-amber-500`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </a>
                                <a href={content.contact_info?.facebook || '#'} target="_blank" rel="noreferrer" className={`${textMuted} hover:scale-110 transition-transform hover:text-amber-500`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                </a>
                                <a href={content.contact_info?.twitter || '#'} target="_blank" rel="noreferrer" className={`${textMuted} hover:scale-110 transition-transform hover:text-amber-500`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 11c-1.1 0-2-.5-2-.5s.7-2.1 2-3.4C1 6 4 6 4 6s1.6-1.5 3-1.5c2 0 3.7 1.6 3.7 3.6 0 .5-.1 1-.2 1.5 1.5-.1 3-.7 4.2-1.7.9 1 1.2 2 1 3-1.3-.8-2.6-1.3-4-1.5 2.5 1 3.8 2.7 4.5 4.5.3 1 .6 2 1 3z" /></svg>
                                </a>
                              </div>
                            </div>

                            {/* Right Side: Map Embed */}
                            <div className={`flex-1 min-h-[250px] lg:min-h-full w-full ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-2xl'} overflow-hidden shadow-inner bg-gray-100 relative`}>
                              <iframe
                                title="Location Map"
                                className="absolute inset-0 w-full h-full border-0 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Lagos, Nigeria')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                              ></iframe>
                            </div>
                          </div>

                        </div>
                      </div>
                    </FadeInView>
                  );
                }

                if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                  return (
                    <FadeInView key="custom">
                      <div className="mb-16 md:mb-24" id="custom">
                        <h3 className={`font-bold ${textColor} text-xl md:text-2xl mb-6 md:mb-8 ${fontHeading}`}>More Details</h3>
                        <div className={`p-6 sm:p-8 md:p-10 border space-y-8 ${cardShape} ${theme === 'Wellness' ? 'bg-[#EAF4EE]/30' : theme === 'Modern Saloon' ? 'bg-[#1A1A22]' : theme === 'Royal Saloon' ? 'bg-[#131A2E]' : 'bg-amber-50/40'}`}>
                          {content.custom_blocks_json.map((block: any, idx: number) => {
                            if (block.type === 'heading') {
                              return (
                                <h4 key={block.id || idx} className={`font-bold ${textColor} text-lg md:text-xl text-center ${fontHeading}`}>
                                  {block.content}
                                </h4>
                              );
                            }
                            if (block.type === 'paragraph') {
                              return (
                                <p key={block.id || idx} className={`text-sm md:text-base ${textColor} leading-relaxed whitespace-pre-wrap text-center opacity-90`}>
                                  {block.content}
                                </p>
                              );
                            }
                            if (block.type === 'image') {
                              return block.url ? (
                                <img
                                  key={block.id || idx}
                                  src={block.url}
                                  alt="Custom Block"
                                  className={`w-full h-auto object-cover ${buttonShape === 'rounded-none' ? 'rounded-none border-2 border-[#1E1B18]' : 'rounded-2xl'} shadow-md max-h-[400px] md:max-h-[500px]`}
                                />
                              ) : null;
                            }
                            if (block.type === 'divider') {
                              return <div key={block.id || idx} className={`w-full h-px ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-850' : 'bg-gray-250/80'} my-6`}></div>;
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </FadeInView>
                  );
                }

                return null;
              })}

          </div>

          {/* Premium Footer */}
          
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

      <footer className={`${footerBg} ${footerTextColor} py-16 px-6 sm:px-10 lg:px-16 rounded-t-[2.5rem] md:rounded-t-[4rem] relative overflow-hidden`}>
            {/* Elegant Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: footerAccentColor }}></div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10 text-left">
              {/* Brand Column */}
              <div className="space-y-5">
                <h4 className={`text-white text-xl font-bold tracking-wider uppercase ${fontHeading}`} style={{ color: footerAccentColor }}>
                  {siteName}
                </h4>
                <p className="text-sm leading-relaxed font-medium">
                  {content.hero_description || content.settings_json?.hero_description || 'Find a barber close to you and book at your convenience. Premium experience tailored just for you.'}
                </p>
                {/* Social Links */}
                <div className="flex gap-4 pt-2">
                  <a href={content.contact_info?.instagram || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 border border-stone-850 rounded-full flex items-center justify-center hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/10 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                  <a href={content.contact_info?.facebook || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 border border-stone-850 rounded-full flex items-center justify-center hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/10 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                  <a href={content.contact_info?.twitter || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 border border-stone-850 rounded-full flex items-center justify-center hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/10 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 11c-1.1 0-2-.5-2-.5s.7-2.1 2-3.4C1 6 4 6 4 6s1.6-1.5 3-1.5c2 0 3.7 1.6 3.7 3.6 0 .5-.1 1-.2 1.5 1.5-.1 3-.7 4.2-1.7.9 1 1.2 2 1 3-1.3-.8-2.6-1.3-4-1.5 2.5 1 3.8 2.7 4.5 4.5.3 1 .6 2 1 3z" /></svg>
                  </a>
                </div>
              </div>

              {/* Navigation Links Column */}
              <div className="space-y-5">
                <h4 className="text-white text-lg font-bold tracking-wider uppercase">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <a href="#about" className="hover:text-white transition-colors">About Us</a>
                  </li>
                  <li>
                    <a href="#services" className="hover:text-white transition-colors">Our Services</a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                  </li>
                </ul>
              </div>

              {/* Contact Information Column */}
              <div className="space-y-5">
                <h4 className="text-white text-lg font-bold tracking-wider uppercase">
                  Contact Info
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li className="flex items-start gap-2.5">
                    <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: footerAccentColor }} />
                    <span className="leading-snug">{address}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone size={16} className="shrink-0" style={{ color: footerAccentColor }} />
                    <span>{content.contact_info?.phone || '+1 234 567 8900'}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail size={16} className="shrink-0" style={{ color: footerAccentColor }} />
                    <span>{content.contact_info?.email || 'hello@saloo.com'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Divider Line */}
            <div className="w-full h-px my-10" style={{ backgroundColor: theme === 'Modern Saloon' ? '#27272a' : theme === 'Vintage Barber' ? '#457b9d/30' : theme === 'Royal Saloon' ? '#131a2e' : '#2e2a27' }}></div>

            {/* Copyright & Site Info */}
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-500">
              <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
              <p className="normal-case tracking-normal text-stone-600">Powered by <span className="font-bold text-stone-500 tracking-wider uppercase text-[10px]">Jaalam</span></p>
            </div>
          </footer>

        </div>

        {/* Bottom Navigation removed as per request */}

        {/* All Products Modal */}
        {showAllProducts && (
          <div className={`fixed inset-0 z-[100] ${bgColor} overflow-y-auto w-full h-full text-left`}>
            <div className={`sticky top-0 ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-[#131A2E] border-stone-800' : 'bg-white'} border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm`}>
              <button onClick={() => setShowAllProducts(false)} className={`flex items-center gap-2 ${textColor} font-bold hover:opacity-80 transition-colors`}>
                <ChevronLeft size={24} /> Back
              </button>
              <h2 className={`text-xl font-bold ${textColor} ${fontHeading}`}>All Styles</h2>
              <div className="w-8"></div>
            </div>

            <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {haircutStyles.map((style: any, idx: number) => (
                  <div key={idx} onClick={() => setSelectedStyle(style)} className={`${itemCardClass}`}>
                    <div className={`w-20 h-20 md:w-28 md:h-28 ${buttonShape === 'rounded-none' ? 'rounded-none border border-[#1E1B18]' : 'rounded-[1.25rem]'} overflow-hidden shrink-0 shadow-inner`}>
                      <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className={`font-bold text-base md:text-xl ${textColor} mb-1.5 md:mb-2 ${fontHeading}`}>{style.name}</h4>
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <span className={`text-sm md:text-base font-bold ${textColor}`}>
                          {style.price}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm font-medium">
                          <Clock size={14} />
                          <span className="line-clamp-1">{style.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-1 text-xs md:text-sm ${textColor} font-bold px-2.5 py-1 ${buttonShape === 'rounded-none' ? 'border border-[#1E1B18] bg-[#F4EFE6]' : 'bg-amber-50/50'} rounded-md`}>
                          <Star size={14} style={{ color: primaryGold }} fill={primaryGold} />
                          {style.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Style Detail Modal */}
        {selectedStyle && (
          <div
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedStyle(null)}
          >
            <div
              className={`${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-[#131A2E] text-slate-100 border border-stone-800' : 'bg-white text-stone-900 border border-stone-100'} w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 text-left`}
              style={buttonShape === 'rounded-none' ? { borderRadius: '0', borderWidth: '2px', borderColor: '#1E1B18' } : {}}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Header */}
              <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                <img
                  src={selectedStyle.image}
                  alt={selectedStyle.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-stone-800 p-2.5 rounded-full shadow-md transition-all active:scale-95 z-20"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className={`text-xl md:text-2xl font-bold leading-tight mb-2 ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'text-white' : 'text-stone-900'} ${fontHeading}`}>
                    {selectedStyle.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-left">
                    <span className={`text-sm md:text-base font-bold px-4 py-1.5 text-white ${buttonShape} shadow-sm`} style={{ backgroundColor: primaryGold }}>
                      {selectedStyle.price}
                    </span>

                    <div className={`flex items-center gap-1 ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'bg-stone-900/60' : 'bg-amber-50/50'} border border-amber-100/30 px-3 py-1.5 rounded-md`}>
                      <Star size={14} style={{ color: primaryGold }} fill={primaryGold} />
                      <span className={`text-sm font-bold ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'text-white' : 'text-stone-800'}`}>{selectedStyle.rating}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-400 text-xs md:text-sm font-medium animate-none">
                      <Clock size={14} />
                      <span>{selectedStyle.time}</span>
                    </div>
                  </div>
                </div>

                <div className={`border-t ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'border-stone-800' : 'border-stone-100'} pt-4`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Details & Description</h4>
                  <p className={`font-medium text-sm leading-relaxed ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'text-slate-300' : 'text-stone-600'}`}>
                    {selectedStyle.description || 'Experience a precision service custom-tailored to suit your preferences. Includes personalized consultation, wash, styling, and premium finish.'}
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedStyle(null);
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex-1 text-white font-bold py-3.5 transition-all active:scale-95 shadow-md text-center text-sm ${buttonShape}`}
                    style={{ backgroundColor: primaryGold }}
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className={`px-6 border ${theme === 'Modern Saloon' || theme === 'Royal Saloon' ? 'border-stone-800 text-slate-300 hover:bg-stone-800' : 'border-stone-200 text-stone-500 hover:bg-stone-50'} font-bold py-3.5 transition-all active:scale-95 text-sm ${buttonShape}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-black/50 rounded-full hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Fullscreen Gallery"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </div>
    </>
  );
}

