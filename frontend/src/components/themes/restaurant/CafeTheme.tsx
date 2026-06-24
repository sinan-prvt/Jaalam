import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, ChevronRight, Star, MapPin, Phone, Search, ChevronLeft, Mail, MessageCircle } from 'lucide-react';

interface CafeThemeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  website: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

interface Location {
  name: string;
  address: string;
  phone?: string;
}

export default function CafeTheme({ website, content }: CafeThemeProps) {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // View Router & UI State
  const [currentView, setCurrentView] = useState<'home' | 'menu'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // eslint-disable-next-line no-restricted-imports
  useEffect(() => {
    if (content?.contact_info?.address) {
      const defaultLocation: Location = {
        name: content.contact_info.address.split(',')[0] || 'Local Cafe',
        address: content.contact_info.address || 'Main Location',
        phone: content.contact_info.phone
      };
      setSelectedLocation(defaultLocation);
    }
  }, [content]);

  // Premium Cafe Color Palette
  const colors = {
    primary: 'bg-[#C19A6B]', // Gold/Caramel Accent
    primaryText: 'text-[#C19A6B]',
    bgDark: 'bg-[#1C1917]', // Warm Charcoal
    bgLight: 'bg-[#FAF8F5]', // Off-white/Cream
    cardBg: 'bg-white',
    textDark: 'text-[#292524]',
    textMuted: 'text-[#78716C]',
  };

  // Mock Data if none provided
  const defaultCategories = [
    { title: 'Artisan Breads', image: '🥖', description: 'Freshly baked daily with organic stone-ground flour.' },
    { title: 'Signature Pastries', image: '🥐', description: 'Flaky, buttery perfection crafted by master bakers.' },
    { title: 'Specialty Coffee', image: '☕', description: 'Ethically sourced beans roasted to perfection.' },
  ];

  const categories = content.services_json && content.services_json.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? content.services_json.map((s: any, i: number) => ({
      title: typeof s === 'string' ? s : s.title,
      description: typeof s === 'string' ? '' : s.description,
      image: defaultCategories[i % defaultCategories.length]?.image || '🍰'
    }))
    : defaultCategories;

  const defaultProducts = [
    { name: 'Classic Butter Croissant', price: '₹250', rating: '4.9', image: '/media/placeholder_pastry.png', description: 'Authentic French recipe with 24 layers of buttery goodness.' },
    { name: 'Dark Chocolate Babka', price: '₹450', rating: '4.8', image: '/media/placeholder_pastry.png', description: 'Rich brioche dough braided with premium Belgian chocolate.' },
    { name: 'Sourdough Loaf', price: '₹300', rating: '5.0', image: '/media/placeholder_pastry.png', description: 'Naturally leavened with a perfect crust and chewy interior.' },
    { name: 'Vanilla Bean Éclair', price: '₹200', rating: '4.7', image: '/media/placeholder_pastry.png', description: 'Choux pastry filled with Madagascar vanilla pastry cream.' },
    { name: 'Almond Biscotti', price: '₹150', rating: '4.6', image: '/media/placeholder_pastry.png', description: 'Twice-baked Italian cookies perfect for dipping in coffee.' },
    { name: 'Seasonal Fruit Tart', price: '₹350', rating: '4.9', image: '/media/placeholder_pastry.png', description: 'Buttery tart shell filled with custard and fresh berries.' },
  ];

  const products = content.products_json && content.products_json.length > 0
    ? content.products_json
    : defaultProducts;

  // Filter products for the menu view
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredProducts = products.filter((prod: any) =>
    prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prod.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // AI Generated Images
  const heroImage = "/media/hero.png";

  const defaultGallery = [
    '/media/placeholder_pastry.png',
    '/media/hero.png',
    '/media/promo.png',
    '/media/placeholder_pastry.png',
    '/media/promo.png',
    '/media/hero.png'
  ];

  let galleryImages = content.gallery_json && content.gallery_json.length > 0
    ? [...content.gallery_json]
    : [...defaultGallery];

  const handleNavClick = (view: 'home' | 'menu', e: React.MouseEvent, scrollToId?: string) => {
    e.preventDefault();
    setCurrentView(view);
    setMenuOpen(false);
    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine if navbar should be solid based on scroll OR if we are in the menu view
  const isNavSolid = scrolled || menuOpen || currentView === 'menu';

  if (website.theme === 'App Style') {
    return (
      <div className="min-h-screen bg-[#FAF9F5] font-sans selection:bg-[#E88C5E] selection:text-white flex justify-center">
        <style>{`
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Full Responsive Container */}
        <div className="w-full bg-[#FAF9F5] min-h-screen relative overflow-hidden">

          {/* Header Gradient Area */}
          <div className="bg-gradient-to-b from-[#EF8F63] to-[#F1A276] pt-10 pb-16 lg:pt-12 lg:pb-20 relative overflow-hidden min-h-[400px] lg:min-h-[550px] flex flex-col">

            {/* Wavy background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <div className="absolute top-1/2 left-[-20%] w-[150%] h-[150%] bg-[#f4a97f] rounded-t-full rounded-l-[40%] opacity-50 mix-blend-screen -translate-y-1/4"></div>
              <div className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] bg-[#e37e51] rounded-full opacity-30 mix-blend-multiply blur-xl"></div>
            </div>

            {/* Unified Content Wrapper */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-20 flex-1 flex flex-col">

              {/* Navigation */}
              <div className="flex items-center justify-between mb-8 lg:mb-16 text-white w-full relative">
                <span onClick={(e) => handleNavClick('home', e as any)} className="font-black text-xl lg:text-2xl tracking-widest uppercase cursor-pointer hover:opacity-85">{content.settings_json?.website_name || 'Cafe'}</span>

                {/* Desktop Menu */}
                <div className="hidden lg:flex gap-10 font-bold text-sm">
                  <a href="#home" onClick={(e) => handleNavClick('home', e)} className="hover:text-[#4A3B32] transition-colors">Home</a>
                  <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className="hover:text-[#4A3B32] transition-colors">Menu</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className="hover:text-[#4A3B32] transition-colors">Gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className="hover:text-[#4A3B32] transition-colors">Contact</a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden p-2 text-white hover:opacity-80 active:scale-95 transition-transform"
                >
                  {menuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>

                {/* Mobile Dropdown Panel */}
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 flex flex-col gap-4 z-[99]"
                  >
                    <a href="#home" onClick={(e) => handleNavClick('home', e)} className="text-[#A65E36] hover:text-[#4A3B32] font-black text-sm tracking-wide py-2 border-b border-slate-100">Home</a>
                    <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className="text-[#A65E36] hover:text-[#4A3B32] font-black text-sm tracking-wide py-2 border-b border-slate-100">Menu</a>
                    <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className="text-[#A65E36] hover:text-[#4A3B32] font-black text-sm tracking-wide py-2 border-b border-slate-100">Gallery</a>
                    <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className="text-[#A65E36] hover:text-[#4A3B32] font-black text-sm tracking-wide py-2">Contact</a>
                  </motion.div>
                )}
              </div>

              {/* Hero Content (Text + Image) */}
              <div className="flex-1 flex flex-col lg:flex-row items-center justify-between relative w-full">

                {/* Text Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center pb-12 lg:pb-0 z-20">
                  <h1 className="text-white text-[2.5rem] lg:text-[4.5rem] font-extrabold tracking-tight leading-tight mb-4 drop-shadow-sm whitespace-pre-line">
                    {content.hero_title || `Welcome to,\n${content.settings_json?.website_name || 'Cafe'}`}
                  </h1>
                  <p className="text-white/90 text-sm lg:text-base font-bold max-w-lg mb-6 leading-relaxed drop-shadow-sm">
                    {content.about_text || 'Experience the warmth of fresh artisan breads, exquisite pastries, and masterfully roasted coffee in the heart of the city.'}
                  </p>
                  <div className="relative mt-4 lg:mt-6">
                    <button
                      onClick={() => setLocationOpen(!locationOpen)}
                      className="flex items-center gap-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full px-4 lg:px-6 py-2.5 lg:py-3 transition-all duration-200 group text-slate-800 shadow-sm border border-white/50"
                    >
                      <MapPin size={18} strokeWidth={2.5} className="text-[#EF8F63] shrink-0" />
                      <span className="text-slate-800 font-bold text-sm lg:text-base leading-none">
                        {selectedLocation?.name || 'Select Location'}
                      </span>
                      <ChevronRight size={16} strokeWidth={2.5} className={`text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors duration-300 ${locationOpen ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Centered Illustration Wrapper for perfect laptop/desktop alignment and bottom placement */}
            <div className="absolute inset-0 max-w-7xl mx-auto w-full px-6 lg:px-8 pointer-events-none z-10 flex justify-end overflow-hidden">
              <div className="w-[85%] lg:w-[45%] h-full flex items-end justify-end relative">
                <img
                  src="/media/chef_transparent_fixed.png"
                  alt="Chef"
                  className="w-full h-full object-contain object-right-bottom opacity-100 drop-shadow-2xl origin-bottom-right translate-y-4 lg:translate-y-6"
                  style={{
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 98%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 98%)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Unified Overlapping Search Bar */}
          <div className="px-6 lg:px-8 -mt-8 lg:-mt-10 relative z-30 max-w-7xl mx-auto w-full flex justify-center lg:justify-start">
            <div className="bg-white rounded-full shadow-[0_15px_40px_rgb(0,0,0,0.15)] p-1.5 pl-6 lg:p-2 lg:pl-8 flex items-center justify-between border border-slate-50 w-full lg:max-w-xl hover:shadow-[0_20px_50px_rgb(0,0,0,0.2)] transition-shadow duration-300 active:scale-95">
              <input
                type="text"
                placeholder="Search for something tasty..."
                className="bg-transparent outline-none flex-1 text-slate-800 placeholder-slate-400 text-sm lg:text-base font-bold h-10 lg:h-12 focus:placeholder-slate-300 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (currentView !== 'menu') {
                      setCurrentView('menu');
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  if (currentView !== 'menu') {
                    setCurrentView('menu');
                  }
                }}
                className="w-12 h-12 lg:w-14 lg:h-14 bg-[#86B479] hover:bg-[#76A569] active:scale-95 transition-all rounded-full flex items-center justify-center text-white shrink-0 shadow-md duration-200"
              >
                <Search size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {currentView === 'home' ? (
            <div className="pb-32 lg:pb-16 max-w-7xl mx-auto">
              {(content.settings_json?.section_order || ['about', 'services', 'menu', 'gallery', 'contact', 'custom'])
                .filter((s: string) => s !== 'hero' && !(content.settings_json?.hidden_sections || []).includes(s))
                .map((sectionId: string) => {
                  if (sectionId === 'services') {
                    return (
                      <div key="services" className="mt-8 lg:mt-16 px-6 lg:px-24">
                        <div className="flex items-center justify-between mb-4 lg:mb-8">
                          <h2 className="text-slate-900 font-black text-xl lg:text-3xl tracking-tight">Top categories</h2>
                        </div>

                        <div className="flex gap-3 lg:gap-6 overflow-x-auto pt-2 pb-6 px-2 -mx-2 snap-x lg:snap-none">
                          {categories.map((cat: any, idx: number) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              whileHover={{ scale: 1.05, y: -4 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 lg:gap-4 px-5 lg:px-8 py-3.5 lg:py-5 rounded-full snap-start shrink-0 font-bold text-sm lg:text-lg transition-all shadow-md border active:scale-95 duration-200 focus:outline-none ${idx === 0 ? 'bg-[#FFCC99] border-[#FFCC99] text-[#A65E36] hover:shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-[#FFCC99] hover:text-[#A65E36] hover:shadow-lg'}`}
                            >
                              <span className="lg:text-2xl text-lg">{cat.image || '🍰'}</span> {cat.title}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'menu') {
                    return (
                      <div key="menu" className="mt-6 lg:mt-12 px-6 lg:px-24 mb-8">
                        <div className="flex items-center justify-between mb-4 lg:mb-8">
                          <h2 className="text-slate-900 font-black text-xl lg:text-3xl tracking-tight">Popular Menus</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {products.slice(0, 3).map((prod: any, idx: number) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                              onClick={() => setSelectedProduct(prod)}
                              className="w-full bg-white rounded-[2rem] lg:rounded-[3rem] p-3 lg:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] border border-slate-50 flex flex-col group hover:-translate-y-2 transition-all duration-300 cursor-pointer active:scale-95"
                            >
                              {/* Image Container */}
                              <div className="w-full aspect-square lg:aspect-[4/3] bg-[#FFECD6] rounded-[1.5rem] lg:rounded-[2rem] mb-2 lg:mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-[#FFDFBF] transition-colors duration-300">
                                <motion.img
                                  src={prod.image || '/media/placeholder_pastry.png'}
                                  alt={prod.name}
                                  className="w-5/6 h-5/6 object-cover rounded-2xl lg:rounded-3xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                  whileHover={{ scale: 1.05 }}
                                />
                              </div>

                              {/* Details */}
                              <div className="px-1 lg:px-3 pb-1 lg:pb-3 pt-2 lg:pt-4 flex items-center gap-3 lg:gap-4">
                                <motion.div
                                  className="w-12 h-12 lg:w-16 lg:h-16 bg-[#EF8F63] hover:bg-[#E87D47] rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.1)] flex items-center justify-center shrink-0 -mt-10 lg:-mt-14 z-10 border border-white transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="font-black text-white text-sm lg:text-lg">{prod.price}</span>
                                </motion.div>
                                <div className="flex flex-col flex-1 pb-1">
                                  <h3 className="font-black text-slate-900 leading-tight text-sm lg:text-xl mb-1 line-clamp-1 lg:line-clamp-2">{prod.name}</h3>
                                  <div className="flex items-center gap-0.5 lg:gap-1 mt-1">
                                    <Star size={10} className="lg:w-3.5 lg:h-3.5 fill-[#e5533d] text-[#e5533d]" />
                                    <span className="text-slate-500 text-[10px] lg:text-xs font-bold ml-1">{prod.rating || '4.8'}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {filteredProducts.length > 0 && (
                          <div className="mt-8 lg:mt-12 flex justify-center">
                            <button
                              onClick={(e) => handleNavClick('menu', e)}
                              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-[#EF8F63] border-2 border-[#EF8F63] rounded-full font-black text-sm lg:text-base transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2"
                            >
                              View Full Menu
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (sectionId === 'about') {
                    return (
                      <div key="about" id="story" className="mt-12 lg:mt-24 px-6 lg:px-24">
                        <div className="bg-white rounded-[2.5rem] p-6 lg:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                          {/* Promo Image */}
                          <div className="w-full lg:w-1/2 aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-md">
                            <img
                              src="/media/promo.png"
                              alt="Our Craft"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          {/* About Content */}
                          <div className="w-full lg:w-1/2 space-y-6">
                            <div>
                              <span className="text-[#A65E36] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Our Story</span>
                              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                {content.settings_json?.about_title || 'The Art of Traditional Baking'}
                              </h2>
                            </div>
                            <p className="text-slate-500 font-bold leading-relaxed text-sm lg:text-base">
                              {content.settings_json?.about_description || 'Every morning begins before dawn. We source the finest organic ingredients and rely on time-honored techniques to create pastries and breads that awaken the senses. From our flaky, 24-layer croissants to our perfectly balanced espresso, we believe in taking no shortcuts.'}
                            </p>

                            {/* Stats badges */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-slate-100/50">
                                <span className="block text-2xl lg:text-3xl font-black text-[#A65E36]">15+</span>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Daily Pastries</span>
                              </div>
                              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-slate-100/50">
                                <span className="block text-2xl lg:text-3xl font-black text-[#A65E36]">100%</span>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Organic Flour</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'gallery') {
                    return (
                      <div key="gallery" id="gallery" className="mt-12 lg:mt-24 px-6 lg:px-24">
                        <div className="flex items-center justify-between mb-6 lg:mb-8">
                          <div>
                            <span className="text-[#A65E36] font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Our Atmosphere</span>
                            <h2 className="text-slate-900 font-black text-xl lg:text-3xl tracking-tight">Gallery</h2>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                          {galleryImages.map((imgSrc, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.03, y: -4 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden rounded-[1.5rem] lg:rounded-[2.5rem] group cursor-pointer aspect-square bg-slate-100 relative shadow-sm border border-slate-50"
                              onClick={() => setSelectedImage(imgSrc)}
                            >
                              <img
                                src={imgSrc}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                                <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={28} />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'contact') {
                    return (
                      <div key="contact" id="contact-info" className="mt-12 lg:mt-24 px-6 lg:px-24">
                        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-10">
                          {/* Details Card */}
                          <div className="w-full lg:w-1/2 bg-white rounded-[2.5rem] p-6 lg:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col justify-between">
                            <div>
                              <span className="text-[#A65E36] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Visit Us</span>
                              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                                We'd love to see you
                              </h2>

                              <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-slate-100 flex items-center justify-center shrink-0">
                                    <MapPin className="text-[#A65E36]" size={20} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Location</h4>
                                    <p className="text-slate-500 font-bold text-xs lg:text-sm">{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-slate-100 flex items-center justify-center shrink-0">
                                    <Phone className="text-[#A65E36]" size={20} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Phone</h4>
                                    <p className="text-slate-500 font-bold text-xs lg:text-sm">{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-slate-100 flex items-center justify-center shrink-0">
                                    <Mail className="text-[#A65E36]" size={20} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Email</h4>
                                    <p className="text-slate-500 font-bold text-xs lg:text-sm">{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Operating hours */}
                            <div className="border-t border-slate-100 pt-6 mt-8 space-y-3">
                              <h4 className="font-bold text-slate-800 text-sm mb-2">Opening Hours</h4>
                              <div className="flex items-center justify-between text-xs lg:text-sm text-slate-500 font-bold">
                                <span>Mon - Fri</span>
                                <span className="text-slate-700 font-black">7:00 AM - 7:00 PM</span>
                              </div>
                              <div className="flex items-center justify-between text-xs lg:text-sm text-slate-500 font-bold">
                                <span>Saturday</span>
                                <span className="text-slate-700 font-black">8:00 AM - 8:00 PM</span>
                              </div>
                              <div className="flex items-center justify-between text-xs lg:text-sm text-slate-500 font-bold">
                                <span>Sunday</span>
                                <span className="text-slate-700 font-black">8:00 AM - 5:00 PM</span>
                              </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="border-t border-slate-100 pt-6 mt-6">
                              <h4 className="font-bold text-slate-800 text-sm mb-3">Follow Us</h4>
                              <div className="flex items-center gap-4">
                                <a
                                  href={content.contact_info?.facebook || 'https://facebook.com'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-slate-100 flex items-center justify-center text-slate-600 hover:text-[#EF8F63] hover:border-[#EF8F63]/50 transition-colors shadow-sm"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                                <a
                                  href={content.contact_info?.instagram || 'https://instagram.com'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-slate-100 flex items-center justify-center text-slate-600 hover:text-[#EF8F63] hover:border-[#EF8F63]/50 transition-colors shadow-sm"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                </a>
                                <a
                                  href={content.contact_info?.whatsapp ? `https://wa.me/${content.contact_info.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-slate-100 flex items-center justify-center text-slate-600 hover:text-[#EF8F63] hover:border-[#EF8F63]/50 transition-colors shadow-sm"
                                >
                                  <MessageCircle size={18} />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Google Map Card */}
                          <div className="w-full lg:w-1/2 bg-white rounded-[2.5rem] p-3 shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden relative min-h-[300px] lg:min-h-full">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Kerala, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full rounded-[2rem] grayscale contrast-125 opacity-95 hover:grayscale-0 hover:opacity-100 transition-all duration-700 min-h-[300px] lg:min-h-[450px]"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                    return (
                      <div key="custom" className="mt-12 lg:mt-24 px-6 lg:px-24">
                        <div className="bg-white rounded-[2.5rem] p-6 lg:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-50 space-y-8">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {content.custom_blocks_json.map((block: any, idx: number) => {
                            if (block.type === 'heading') {
                              return <h2 key={idx} className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-4 mt-6 leading-tight">{block.content || 'Heading'}</h2>;
                            }
                            if (block.type === 'paragraph') {
                              return <p key={idx} className="text-slate-500 font-bold leading-relaxed text-sm lg:text-base whitespace-pre-wrap">{block.content || 'Text content'}</p>;
                            }
                            if (block.type === 'image') {
                              return <img key={idx} src={block.url || '/media/placeholder_pastry.png'} alt="Custom element" className="w-full h-auto rounded-[1.5rem] lg:rounded-[2rem] mb-6 mt-4 shadow-sm" />;
                            }
                            if (block.type === 'divider') {
                              return <hr key={idx} className="my-8 border-t-2 border-slate-100 w-1/4 mx-auto" />;
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
            </div>
          ) : (
            /* --- MENU VIEW FOR APP STYLE --- */
            <div className="pt-16 pb-32 max-w-7xl mx-auto px-6 lg:px-24">

              {/* Menu Header & Search/Back */}
              <div className="mb-12">
                <button
                  onClick={(e) => handleNavClick('home', e)}
                  className="flex items-center gap-2 text-slate-500 hover:text-[#E88C5E] transition-colors font-bold uppercase tracking-wider text-xs mb-8"
                >
                  <ChevronLeft size={18} /> Back to Home
                </button>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <span className="text-[#A65E36] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Complete Catalog</span>
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight break-words">Our Full Menu</h1>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {filteredProducts.map((prod: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      onClick={() => setSelectedProduct(prod)}
                      className="w-full bg-white rounded-[2rem] lg:rounded-[3rem] p-3 lg:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] border border-slate-50 flex flex-col group hover:-translate-y-2 transition-all duration-300 cursor-pointer active:scale-95"
                    >
                      {/* Image Container */}
                      <div className="w-full aspect-square lg:aspect-[4/3] bg-[#FFECD6] rounded-[1.5rem] lg:rounded-[2rem] mb-2 lg:mb-4 flex items-center justify-center relative overflow-hidden">
                        <img
                          src={prod.image || '/media/placeholder_pastry.png'}
                          alt={prod.name}
                          className="w-5/6 h-5/6 object-cover rounded-2xl lg:rounded-3xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div className="px-1 lg:px-3 pb-1 lg:pb-3 pt-2 lg:pt-4 flex items-center gap-3 lg:gap-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#EF8F63] rounded-full flex items-center justify-center shrink-0 border border-white text-white font-black text-sm lg:text-lg">
                          {prod.price}
                        </div>
                        <div className="flex flex-col flex-1 pb-1 min-w-0">
                          <h3 className="font-black text-slate-900 leading-tight text-sm lg:text-xl mb-0.5 truncate">{prod.name}</h3>
                          <p className="text-slate-400 text-xs line-clamp-1">{prod.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <Coffee size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-2xl font-black text-slate-800 mb-2">No items found</h3>
                  <p className="text-slate-500">We couldn't find anything matching "{searchQuery}"</p>
                  <button onClick={() => setSearchQuery('')} className="mt-6 text-[#E88C5E] font-bold hover:underline">Clear Search</button>
                </div>
              )}
            </div>
          )}

          {/* Premium Dark Footer for App Style */}
          <footer id="contact" className="bg-[#1C1917] text-white pt-20 pb-28 lg:pb-12 border-t border-slate-200/5 relative z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    {content.settings_json?.logo_image ? (
                      <img src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#C19A6B] flex items-center justify-center">
                        <Coffee size={24} className="text-white" />
                      </div>
                    )}
                    <span className="text-2xl font-black tracking-wider uppercase">
                      {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}
                    </span>
                  </div>
                  <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                    Thank you for visiting. We are dedicated to bringing you the best flavors, fresh ingredients, and a welcoming atmosphere.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-6 tracking-wide uppercase">Contact Us</h4>
                  <ul className="space-y-4 text-slate-400 text-sm">
                    <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                      <MapPin size={20} className="shrink-0 mt-1 text-[#C19A6B]" />
                      <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                    </li>
                    <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <Phone size={20} className="shrink-0 text-[#C19A6B]" />
                      <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-6 tracking-wide uppercase">Opening Hours</h4>
                  <ul className="space-y-4 text-slate-400 text-sm">
                    <li className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span>Mon - Fri</span>
                      <span className="text-white font-medium">7:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span>Saturday</span>
                      <span className="text-white font-medium">8:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span>Sunday</span>
                      <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}. All rights reserved.</p>
                <p>Designed with <span className="text-[#C19A6B] font-bold">Jaalam</span></p>
              </div>
            </div>
          </footer>

          {/* Lightbox Modal for App Style */}
          {selectedImage && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedImage(null)}>
              <button className="absolute top-6 right-6 text-white hover:text-[#C19A6B] transition-colors p-2" aria-label="Close">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <img src={selectedImage} alt="Fullscreen Gallery" className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
          )}

          {/* Product Detail Modal for App Style */}
          {selectedProduct && (
            <div
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative bg-white max-w-sm w-full overflow-hidden shadow-2xl ${website.theme === 'App Style' ? 'rounded-[2.5rem]' : 'rounded-sm'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image section */}
                <div className="relative aspect-[16/10] w-full bg-[#FFECD6] overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedProduct.image || '/media/placeholder_pastry.png'}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 p-2.5 shadow-md transition-all active:scale-95 z-20 ${website.theme === 'App Style' ? 'rounded-full' : 'rounded-sm'
                      }`}
                    aria-label="Close"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Content section */}
                <div className="p-5 lg:p-6 space-y-4">
                  <div>
                    <h3 className={`text-xl lg:text-2xl font-black text-slate-900 leading-tight mb-2 ${website.theme === 'App Style' ? 'font-sans' : 'font-serif'
                      }`}>
                      {selectedProduct.name}
                    </h3>

                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-lg lg:text-xl font-black px-4 py-1.5 rounded-full text-white ${website.theme === 'App Style' ? 'bg-[#EF8F63] shadow-[0_4px_12px_rgba(239,143,99,0.2)]' : `${colors.primary} shadow-sm`
                        }`}>
                        {selectedProduct.price}
                      </span>

                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full shadow-inner">
                        <Star size={14} className={`${website.theme === 'App Style' ? 'text-[#e5533d] fill-[#e5533d]' : 'text-[#C19A6B] fill-[#C19A6B]'
                          }`} />
                        <span className="text-slate-800 text-sm font-black">{selectedProduct.rating || '4.8'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description</h4>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                      {selectedProduct.description || 'No description available for this item. Baked fresh with the finest ingredients.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(null)}
                    className={`w-full font-black py-3 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-white ${website.theme === 'App Style'
                        ? 'bg-[#EF8F63] hover:bg-[#E87D47] rounded-full'
                        : 'bg-[#C19A6B] hover:bg-[#b08b5e] rounded-sm'
                      }`}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    );
  }

  if (website.theme === 'Modern Bakery') {
    const bakeryColors = {
      primary: 'bg-[#C5A880]',
      primaryHover: 'hover:bg-[#B3966E]',
      primaryText: 'text-[#C5A880]',
      primaryBorder: 'border-[#C5A880]',
      bgDark: 'bg-[#0E0D0C]',
      bgCream: 'bg-[#FAF7F2]',
      cardBg: 'bg-[#FCFAF7]',
      cardBorder: 'border-[#EBE6DD]',
      textDark: 'text-[#1E1B18]',
      textMuted: 'text-[#6B6155]',
    };

    const scatterBreads = [
      { id: 1, name: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=350&q=80', style: 'left-[4%] top-[18%] w-20 h-16 lg:w-36 lg:h-28 rotate-[12deg] block' },
      { id: 2, name: 'Sourdough Loaf', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=350&q=80', style: 'right-[4%] top-[15%] w-24 h-18 lg:w-40 lg:h-32 rotate-[-10deg] block' },
      { id: 3, name: 'Baguette', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=350&q=80', style: 'left-[5%] bottom-[15%] w-28 h-20 lg:w-44 lg:h-32 rotate-[20deg] block' },
      { id: 4, name: 'Pretzel', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=350&q=80', style: 'right-[4%] bottom-[12%] w-20 h-20 lg:w-36 lg:h-36 rotate-[-15deg] block' },
      { id: 5, name: 'Bread Rolls', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=350&q=80', style: 'left-[45%] top-[8%] w-20 h-20 lg:w-28 lg:h-28 rotate-[-8deg] md:block hidden' }
    ];

    return (
      <div className={`min-h-screen ${bakeryColors.bgCream} font-outfit selection:bg-[#C5A880] selection:text-white relative overflow-x-hidden`}>
        <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          .font-outfit {
            font-family: 'Outfit', sans-serif;
          }
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Sticky Header */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavSolid ? 'bg-[#FCFAF7] border-b border-[#EBE6DD] py-3 shadow-sm' : 'bg-transparent py-5'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleNavClick('home', e)}>
              {content.settings_json?.logo_image ? (
                <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white" />
              ) : (
                <div className={`w-10 h-10 rounded-full ${bakeryColors.primary} flex items-center justify-center`}>
                  <Coffee size={18} className="text-white" />
                </div>
              )}
              <span className={`text-xl font-bold font-playfair tracking-wide capitalize ${isNavSolid ? bakeryColors.textDark : 'text-white'}`}>
                {content.settings_json?.website_name || website.slug || 'Bread Bakew'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-outfit text-sm font-bold tracking-wide">
              <a href="#home" onClick={(e) => handleNavClick('home', e)} className={`transition-colors hover:text-[#C5A880] ${isNavSolid ? bakeryColors.textDark : 'text-white/90'}`}>home</a>
              <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className={`transition-colors hover:text-[#C5A880] ${isNavSolid ? bakeryColors.textDark : 'text-white/90'}`}>shop</a>
              {currentView === 'home' && (
                <>
                  <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className={`transition-colors hover:text-[#C5A880] ${isNavSolid ? bakeryColors.textDark : 'text-white/90'}`}>about</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className={`transition-colors hover:text-[#C5A880] ${isNavSolid ? bakeryColors.textDark : 'text-white/90'}`}>gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className={`transition-colors hover:text-[#C5A880] ${isNavSolid ? bakeryColors.textDark : 'text-white/90'}`}>contact</a>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={(e) => handleNavClick('menu', e)}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold font-outfit uppercase tracking-wider transition-all duration-300 active:scale-95 ${isNavSolid
                    ? `${bakeryColors.primary} text-white hover:bg-[#B3966E] rounded-full shadow-sm`
                    : 'bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20'
                  }`}
              >
                Checkout
              </button>

              {/* Mobile Toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-1.5 rounded-full ${isNavSolid ? bakeryColors.textDark : 'text-white'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#FCFAF7] border-b border-[#EBE6DD] shadow-xl py-4 px-6 flex flex-col gap-3 z-50 font-outfit text-sm font-bold uppercase tracking-wider">
              <a href="#home" onClick={(e) => handleNavClick('home', e)} className="py-2 border-b border-[#EBE6DD]/60 text-slate-800 hover:text-[#C5A880]">home</a>
              <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className="py-2 border-b border-[#EBE6DD]/60 text-slate-800 hover:text-[#C5A880]">shop</a>
              {currentView === 'home' && (
                <>
                  <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className="py-2 border-b border-[#EBE6DD]/60 text-slate-800 hover:text-[#C5A880]">about</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className="py-2 border-b border-[#EBE6DD]/60 text-slate-800 hover:text-[#C5A880]">gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className="py-2 text-slate-800 hover:text-[#C5A880]">contact</a>
                </>
              )}
            </div>
          )}
        </nav>

        {currentView === 'home' ? (
          <main>
            {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
              .filter((s: string) => !(content.settings_json?.hidden_sections || []).includes(s))
              .map((sectionId: string) => {
                if (sectionId === 'hero') {
                  return (
                    <section key="hero" id="home" className={`relative h-screen flex items-center justify-center overflow-hidden ${bakeryColors.bgDark}`}>
                      {/* Scattered Bread Items with float effects */}
                      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        {scatterBreads.map((bread, index) => (
                          <motion.div
                            key={bread.id}
                            className={`absolute ${bread.style}`}
                            animate={{ y: [0, -10, 0], rotate: [index % 2 === 0 ? 0 : 3, index % 2 === 0 ? -3 : 0, 0] }}
                            transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                          >
                            <img
                              src={bread.url}
                              alt={bread.name}
                              className="w-full h-full object-cover rounded-2xl shadow-2xl opacity-90 border border-white/5"
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <span className="block text-[#C5A880] font-bold font-outfit uppercase tracking-[0.2em] text-xs lg:text-sm mb-4">
                          Artisan Quality
                        </span>
                        <h2 className="text-white text-5xl lg:text-7xl font-playfair font-black tracking-tight leading-[1.1] mb-6 whitespace-pre-line drop-shadow-lg">
                          {content.hero_title || 'Quality breads\nand flavors'}
                        </h2>
                        <p className="text-white/80 font-outfit text-sm lg:text-base font-medium max-w-xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
                          {content.about_text || 'Experience the warmth of fresh artisan breads, exquisite pastries, and masterfully roasted coffee in the heart of the city.'}
                        </p>
                        <button
                          onClick={(e) => handleNavClick('menu', e)}
                          className="bg-[#C5A880] hover:bg-[#B3966E] text-white px-8 py-3.5 rounded-full font-bold font-outfit uppercase tracking-wider text-xs shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 group"
                        >
                          Explore shop
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'about') {
                  return (
                    <section key="about" id="story" className="py-24 bg-[#FAF7F2]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="bg-[#FCFAF7] rounded-[2.5rem] border border-[#EBE6DD] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-sm">
                          <div className="w-full lg:w-1/2 space-y-6">
                            <span className="text-[#C5A880] font-bold font-outfit tracking-[0.25em] uppercase text-xs block">about us</span>
                            <h2 className="text-3xl lg:text-5xl font-playfair font-black text-[#1E1B18] tracking-tight leading-tight">
                              {content.settings_json?.about_title || 'The Art of Traditional Baking'}
                            </h2>
                            <p className="text-[#6B6155] font-outfit font-medium leading-relaxed text-sm lg:text-base whitespace-pre-line">
                              {content.settings_json?.about_description || 'Every morning begins before dawn. We source the finest organic ingredients and rely on time-honored techniques to create pastries and breads that awaken the senses.\n\nFrom our flaky, 24-layer croissants to our perfectly balanced espresso, we believe in taking no shortcuts.'}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EBE6DD]">
                              <div>
                                <span className="block text-3xl font-playfair font-black text-[#C5A880]">15+</span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Daily Pastries</span>
                              </div>
                              <div>
                                <span className="block text-3xl font-playfair font-black text-[#C5A880]">100%</span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Organic Flour</span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
                            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-[#EBE6DD]">
                              <img
                                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
                                alt="Wheat Ears and Flour"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                            {/* Decorative wheat drawing layout overlay */}
                            <div className="absolute -bottom-6 -left-6 bg-[#C5A880] text-white p-4 rounded-2xl shadow-lg lg:block hidden">
                              <span className="text-xs font-bold font-outfit uppercase tracking-widest block">Est. 2026</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'services') {
                  return (
                    <section key="services" className="py-24 bg-[#FAF7F2] border-t border-[#EBE6DD]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                          <span className="text-[#C5A880] font-bold font-outfit tracking-[0.25em] uppercase text-xs block mb-3">What We Offer</span>
                          <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#1E1B18]">Our Specialties</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {categories.map((cat: any, idx: number) => (
                            <div key={idx} className="bg-[#FCFAF7] border border-[#EBE6DD] p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative group">
                              <h3 className="text-xl font-playfair font-bold text-[#1E1B18] mb-3">{cat.title}</h3>
                              <p className="text-[#6B6155] text-sm leading-relaxed font-outfit">{cat.description || 'Crafted fresh daily using high-quality local organic flour and ingredients.'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'menu') {
                  return (
                    <section key="menu" className="py-24 bg-[#FAF7F2] border-t border-[#EBE6DD]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                          <div>
                            <span className="text-[#C5A880] font-bold font-outfit tracking-[0.25em] uppercase text-xs block mb-3">our products</span>
                            <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#1E1B18]">Featured Selections</h2>
                          </div>
                          <button
                            onClick={(e) => handleNavClick('menu', e)}
                            className="text-xs font-bold uppercase font-outfit tracking-widest text-[#1E1B18] hover:text-[#C5A880] transition-colors border-b border-[#C5A880] pb-1 flex items-center gap-1 group"
                          >
                            View Full Menu
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {products.slice(0, 6).map((prod: any, idx: number) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedProduct(prod)}
                              className="bg-[#FCFAF7] border border-[#EBE6DD] rounded-[2rem] p-4 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-98"
                            >
                              <div>
                                <div className="aspect-[4/3] rounded-2xl bg-[#FAF7F2] border border-[#EBE6DD]/60 overflow-hidden flex items-center justify-center mb-4 relative">
                                  <img
                                    src={prod.image || '/media/placeholder_pastry.png'}
                                    alt={prod.name}
                                    className="w-5/6 h-5/6 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-3 right-3 bg-[#FCFAF7]/95 backdrop-blur-sm border border-[#EBE6DD] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <Star size={10} className="text-[#C5A880] fill-[#C5A880]" />
                                    <span className="text-[10px] font-black text-slate-800">{prod.rating || '4.8'}</span>
                                  </div>
                                </div>
                                <div className="px-2">
                                  <h3 className="text-lg font-playfair font-bold text-[#1E1B18] mb-1.5 leading-snug truncate">{prod.name}</h3>
                                  <p className="text-[#6B6155] font-outfit text-xs leading-relaxed line-clamp-2 mb-4">{prod.description}</p>
                                </div>
                              </div>

                              <div className="px-2 pt-2 border-t border-[#EBE6DD]/40 flex items-center justify-between">
                                <span className="text-[#C5A880] font-outfit font-black text-lg">{prod.price}</span>
                                <span className="text-[10px] font-bold font-outfit uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full group-hover:bg-[#C5A880] group-hover:text-white transition-colors duration-300">
                                  Details
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'gallery') {
                  return (
                    <section key="gallery" id="gallery" className="py-24 bg-[#FAF7F2] border-t border-[#EBE6DD]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                          <span className="text-[#C5A880] font-bold font-outfit tracking-[0.25em] uppercase text-xs block mb-3">gallery</span>
                          <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#1E1B18]">Our Bakery Life</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {galleryImages.map((imgSrc, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedImage(imgSrc)}
                              className="overflow-hidden rounded-2xl group cursor-pointer aspect-square bg-[#FAF7F2] border border-[#EBE6DD] relative shadow-sm"
                            >
                              <img
                                src={imgSrc}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-[#0E0D0C]/0 group-hover:bg-[#0E0D0C]/40 transition-colors duration-300 flex items-center justify-center">
                                <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'contact') {
                  return (
                    <section key="contact" id="contact-info" className="py-24 bg-[#FAF7F2] border-t border-[#EBE6DD]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-stretch gap-10">
                          {/* Contact card */}
                          <div className="w-full lg:w-1/2 bg-[#FCFAF7] border border-[#EBE6DD] rounded-[2.5rem] p-8 lg:p-12 shadow-sm flex flex-col justify-between">
                            <div>
                              <span className="text-[#C5A880] font-bold font-outfit tracking-[0.25em] uppercase text-xs block mb-3">contact</span>
                              <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#1E1B18] mb-8 leading-tight">
                                Come visit us
                              </h2>

                              <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EBE6DD] flex items-center justify-center shrink-0">
                                    <MapPin className="text-[#C5A880]" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 font-outfit uppercase tracking-wider">Location</h4>
                                    <p className="text-[#6B6155] font-medium text-xs lg:text-sm">{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EBE6DD] flex items-center justify-center shrink-0">
                                    <Phone className="text-[#C5A880]" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 font-outfit uppercase tracking-wider">Phone</h4>
                                    <p className="text-[#6B6155] font-medium text-xs lg:text-sm">{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EBE6DD] flex items-center justify-center shrink-0">
                                    <Mail className="text-[#C5A880]" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 font-outfit uppercase tracking-wider">Email</h4>
                                    <p className="text-[#6B6155] font-medium text-xs lg:text-sm">{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hours and social links */}
                            <div className="border-t border-[#EBE6DD]/60 pt-6 mt-8">
                              <h4 className="font-bold text-slate-800 text-sm mb-4 font-outfit uppercase tracking-wider">Opening Hours</h4>
                              <div className="space-y-2 text-xs lg:text-sm text-[#6B6155] font-medium">
                                <div className="flex justify-between">
                                  <span>Mon - Fri</span>
                                  <span className="text-slate-800 font-bold">7:00 AM - 7:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Saturday</span>
                                  <span className="text-slate-800 font-bold">8:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sunday</span>
                                  <span className="text-slate-800 font-bold">8:00 AM - 5:00 PM</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#EBE6DD]/40">
                                <a href={content.contact_info?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EBE6DD] flex items-center justify-center text-slate-600 hover:text-[#C5A880] transition-colors shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                                <a href={content.contact_info?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EBE6DD] flex items-center justify-center text-slate-600 hover:text-[#C5A880] transition-colors shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                </a>
                                <a href={content.contact_info?.whatsapp ? `https://wa.me/${content.contact_info.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EBE6DD] flex items-center justify-center text-slate-600 hover:text-[#C5A880] transition-colors shadow-sm">
                                  <MessageCircle size={16} />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Maps Card */}
                          <div className="w-full lg:w-1/2 bg-[#FCFAF7] border border-[#EBE6DD] rounded-[2.5rem] p-3 shadow-sm overflow-hidden min-h-[300px] lg:min-h-full">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Kerala, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full rounded-3xl grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 min-h-[300px] lg:min-h-[450px]"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                  return (
                    <section key="custom" className="py-24 bg-[#FAF7F2] border-t border-[#EBE6DD]">
                      <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
                        {content.custom_blocks_json.map((block: any, idx: number) => {
                          if (block.type === 'heading') {
                            return <h2 key={idx} className="text-3xl lg:text-4xl font-playfair font-black text-[#1E1B18] tracking-tight mb-6 mt-8">{block.content || 'Heading'}</h2>;
                          }
                          if (block.type === 'paragraph') {
                            return <p key={idx} className="text-[#6B6155] font-outfit text-sm lg:text-base leading-relaxed whitespace-pre-wrap">{block.content || 'Text content'}</p>;
                          }
                          if (block.type === 'image') {
                            return <img key={idx} src={block.url || '/media/placeholder_pastry.png'} alt="Custom element" className="w-full h-auto rounded-3xl mb-8 mt-4 shadow-md border border-[#EBE6DD]" />;
                          }
                          if (block.type === 'divider') {
                            return <hr key={idx} className="my-12 border-t border-[#EBE6DD] w-1/4 mx-auto" />;
                          }
                          return null;
                        })}
                      </div>
                    </section>
                  );
                }

                return null;
              })}
          </main>
        ) : (
          /* --- MENU/SHOP VIEW --- */
          <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <button
                onClick={(e) => handleNavClick('home', e)}
                className="flex items-center gap-2 text-slate-500 hover:text-[#C5A880] transition-colors font-bold font-outfit uppercase tracking-wider text-xs mb-8"
              >
                <ChevronLeft size={16} /> Back to Home
              </button>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#EBE6DD] pb-8">
                <div>
                  <span className="text-[#C5A880] font-bold font-outfit tracking-[0.25em] uppercase text-xs block mb-3">Complete Catalog</span>
                  <h1 className="text-2xl sm:text-3xl lg:text-6xl font-playfair font-black text-[#1E1B18] break-words">Our Full Menu</h1>
                </div>

                <div className="w-full lg:w-96 relative">
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FCFAF7] border border-[#EBE6DD] rounded-full py-3.5 pl-12 pr-4 outline-none focus:border-[#C5A880] transition-colors text-slate-700 shadow-sm font-outfit text-sm"
                  />
                  <Search size={18} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((prod: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedProduct(prod)}
                    className="bg-[#FCFAF7] border border-[#EBE6DD] rounded-3xl p-4 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-98"
                  >
                    <div>
                      <div className="aspect-square rounded-2xl bg-[#FAF7F2] border border-[#EBE6DD]/60 overflow-hidden flex items-center justify-center mb-4 relative">
                        <img
                          src={prod.image || '/media/placeholder_pastry.png'}
                          alt={prod.name}
                          className="w-5/6 h-5/6 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-[#FCFAF7]/95 backdrop-blur-sm border border-[#EBE6DD] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star size={10} className="text-[#C5A880] fill-[#C5A880]" />
                          <span className="text-[10px] font-black text-slate-800">{prod.rating || '4.8'}</span>
                        </div>
                      </div>

                      <div className="px-2">
                        <h3 className="text-base font-playfair font-bold text-[#1E1B18] mb-1.5 leading-snug truncate">{prod.name}</h3>
                        <p className="text-[#6B6155] font-outfit text-[11px] leading-relaxed line-clamp-2">{prod.description}</p>
                      </div>
                    </div>

                    <div className="px-2 pt-4 mt-4 border-t border-[#EBE6DD]/40 flex items-center justify-between">
                      <span className="text-[#C5A880] font-outfit font-black text-base">{prod.price}</span>
                      <span className="text-[10px] font-bold font-outfit uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full group-hover:bg-[#C5A880] group-hover:text-white transition-colors duration-300">
                        Details
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#FCFAF7] border border-[#EBE6DD] rounded-3xl">
                <Coffee size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-playfair font-bold text-slate-800 mb-1">No items found</h3>
                <p className="text-slate-500 text-sm">We couldn't find anything matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-[#C5A880] font-bold text-sm hover:underline">Clear Search</button>
              </div>
            )}
          </main>
        )}

        {/* Footer */}
        <footer id="contact" className={`${bakeryColors.bgDark} text-white pt-20 pb-12`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  {content.settings_json?.logo_image ? (
                    <img src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#C5A880] flex items-center justify-center">
                      <Coffee size={24} className="text-white" />
                    </div>
                  )}
                  <span className="text-2xl font-playfair font-bold tracking-wide capitalize">
                    {content.settings_json?.website_name || website.slug || 'Bread Bakew'}
                  </span>
                </div>
                <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                  Dedicated to bringing you the best flavors, fresh local ingredients, and traditional baking techniques daily.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-playfair font-bold text-[#C5A880] mb-6">Contact Us</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                    <MapPin size={18} className="shrink-0 mt-1 text-[#C5A880]" />
                    <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                  </li>
                  <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                    <Phone size={18} className="shrink-0 text-[#C5A880]" />
                    <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-playfair font-bold text-[#C5A880] mb-6">Opening Hours</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Mon - Fri</span>
                    <span className="text-white font-medium">7:00 AM - 7:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Saturday</span>
                    <span className="text-white font-medium">8:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} {content.settings_json?.website_name || website.slug || 'Bread Bakew'}. All rights reserved.</p>
              <p>Designed with <span className="text-[#C5A880] font-bold">Jaalam</span></p>
            </div>
          </div>
        </footer>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 text-white hover:text-[#C5A880] transition-colors p-2" aria-label="Close">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img src={selectedImage} alt="Fullscreen Gallery" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative bg-[#FCFAF7] border border-[#EBE6DD] max-w-sm w-full overflow-hidden shadow-2xl rounded-[2.5rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full bg-[#FAF7F2] overflow-hidden flex items-center justify-center border-b border-[#EBE6DD]">
                <img
                  src={selectedProduct.image || '/media/placeholder_pastry.png'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-[#FCFAF7]/90 backdrop-blur-sm hover:bg-[#FCFAF7] text-slate-800 p-2 rounded-full shadow-md transition-all active:scale-95 z-20 border border-[#EBE6DD]"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-playfair font-black text-[#1E1B18] leading-tight mb-2">
                    {selectedProduct.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-base font-outfit font-black px-4 py-1.5 rounded-full text-white bg-[#C5A880] shadow-[0_4px_12px_rgba(197,168,128,0.25)]">
                      {selectedProduct.price}
                    </span>

                    <div className="flex items-center gap-1 bg-[#FAF7F2] border border-[#EBE6DD] px-3 py-1 rounded-full shadow-inner">
                      <Star size={12} className="text-[#C5A880] fill-[#C5A880]" />
                      <span className="text-slate-800 text-xs font-black">{selectedProduct.rating || '4.8'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#EBE6DD] pt-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 font-outfit">Description</h4>
                  <p className="text-[#6B6155] font-outfit text-sm leading-relaxed">
                    {selectedProduct.description || 'No description available for this item. Baked fresh with the finest ingredients.'}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-[#C5A880] hover:bg-[#B3966E] font-outfit font-bold py-3 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-white rounded-full text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  if (website.theme === 'Artisan') {
    const artisanColors = {
      primary: 'bg-[#C27D56]',
      primaryHover: 'hover:bg-[#B06E49]',
      primaryText: 'text-[#C27D56]',
      primaryBorder: 'border-[#C27D56]',
      secondaryText: 'text-[#2A4B3A]',
      bgDark: 'bg-[#2A4B3A]',
      bgCream: 'bg-[#FAF5ED]',
      cardBg: 'bg-[#FAF5ED]',
      cardBorder: 'border-[#E6DEC9]',
      textDark: 'text-[#1C2B21]',
      textMuted: 'text-[#5E6B61]',
    };

    return (
      <div className={`min-h-screen ${artisanColors.bgCream} font-montserrat selection:bg-[#C27D56] selection:text-white relative overflow-x-hidden`}>
        <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          .font-montserrat {
            font-family: 'Montserrat', sans-serif;
          }
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Sticky Header */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavSolid ? 'bg-[#FAF5ED] border-b border-[#E6DEC9] py-3 shadow-sm' : 'bg-transparent py-5'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleNavClick('home', e)}>
              {content.settings_json?.logo_image ? (
                <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white" />
              ) : (
                <div className={`w-10 h-10 rounded-full ${artisanColors.primary} flex items-center justify-center`}>
                  <Coffee size={18} className="text-white" />
                </div>
              )}
              <span className={`text-xl font-bold font-playfair tracking-wide capitalize ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]'}`}>
                {content.settings_json?.website_name || website.slug || website.business_type || 'Our Bakery'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-montserrat text-sm font-bold tracking-wide">
              <a href="#home" onClick={(e) => handleNavClick('home', e)} className={`transition-colors hover:text-[#C27D56] ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]/80'}`}>home</a>
              <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className={`transition-colors hover:text-[#C27D56] ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]/80'}`}>shop</a>
              {currentView === 'home' && (
                <>
                  <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className={`transition-colors hover:text-[#C27D56] ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]/80'}`}>about</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className={`transition-colors hover:text-[#C27D56] ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]/80'}`}>gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className={`transition-colors hover:text-[#C27D56] ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]/80'}`}>contact</a>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-1.5 rounded-full ${isNavSolid ? artisanColors.textDark : 'text-[#2A4B3A]'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAF5ED] border-b border-[#E6DEC9] shadow-xl py-4 px-6 flex flex-col gap-3 z-50 font-montserrat text-sm font-bold uppercase tracking-wider">
              <a href="#home" onClick={(e) => handleNavClick('home', e)} className="py-2 border-b border-[#E6DEC9]/60 text-slate-800 hover:text-[#C27D56]">home</a>
              <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className="py-2 border-b border-[#E6DEC9]/60 text-slate-800 hover:text-[#C27D56]">shop</a>
              {currentView === 'home' && (
                <>
                  <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className="py-2 border-b border-[#E6DEC9]/60 text-slate-800 hover:text-[#C27D56]">about</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className="py-2 border-b border-[#E6DEC9]/60 text-slate-800 hover:text-[#C27D56]">gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className="py-2 text-slate-800 hover:text-[#C27D56]">contact</a>
                </>
              )}
            </div>
          )}
        </nav>

        {currentView === 'home' ? (
          <main>
            {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
              .filter((s: string) => !(content.settings_json?.hidden_sections || []).includes(s))
              .map((sectionId: string) => {
                if (sectionId === 'hero') {
                  return (
                    <section key="hero" id="home" className={`relative min-h-screen flex items-center justify-center pt-24 pb-12 ${artisanColors.bgCream}`}>
                      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6 text-left">
                          <span className="block text-[#C27D56] font-bold font-montserrat uppercase tracking-[0.2em] text-xs lg:text-sm">
                            Artisan Quality
                          </span>
                          <h2 className="text-[#2A4B3A] text-5xl lg:text-7xl font-playfair font-black tracking-tight leading-[1.1] whitespace-pre-line">
                            {content.hero_title || 'Baked With\nPassion & Craft'}
                          </h2>
                          <p className="text-[#5E6B61] font-montserrat text-sm lg:text-base font-medium max-w-xl leading-relaxed">
                            {content.about_text || 'Experience the warmth of fresh artisan breads, exquisite pastries, and masterfully roasted coffee in the heart of the city.'}
                          </p>
                          <button
                            onClick={(e) => handleNavClick('menu', e)}
                            className="bg-[#C27D56] hover:bg-[#B06E49] text-white px-8 py-3.5 rounded-full font-bold font-montserrat uppercase tracking-wider text-xs shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 group"
                          >
                            Explore shop
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                        <div className="lg:col-span-6 flex justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(42,75,58,0.15)] border-4 border-white"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                              alt="Kneading Dough"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'about') {
                  return (
                    <section key="about" id="story" className="py-24 bg-[#FAF5ED]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="bg-[#FAF5ED] rounded-[2.5rem] border border-[#E6DEC9] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-sm">
                          <div className="w-full lg:w-1/2 space-y-6">
                            <span className="text-[#C27D56] font-bold font-montserrat tracking-[0.25em] uppercase text-xs block">our story</span>
                            <h2 className="text-3xl lg:text-5xl font-playfair font-black text-[#2A4B3A] tracking-tight leading-tight">
                              {content.settings_json?.about_title || 'The Art of Traditional Baking'}
                            </h2>
                            <p className="text-[#5E6B61] font-montserrat font-medium leading-relaxed text-sm lg:text-base whitespace-pre-line">
                              {content.settings_json?.about_description || 'Every morning begins before dawn. We source the finest organic ingredients and rely on time-honored techniques to create pastries and breads that awaken the senses.\n\nFrom our flaky, 24-layer croissants to our perfectly balanced espresso, we believe in taking no shortcuts.'}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E6DEC9]">
                              <div>
                                <span className="block text-3xl font-playfair font-black text-[#C27D56]">15+</span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Daily Pastries</span>
                              </div>
                              <div>
                                <span className="block text-3xl font-playfair font-black text-[#C27D56]">100%</span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Organic Flour</span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
                            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-[#E6DEC9]">
                              <img
                                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80"
                                alt="Wheat Ears and Flour"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-[#C27D56] text-white p-4 rounded-2xl shadow-lg lg:block hidden">
                              <span className="text-xs font-bold font-montserrat uppercase tracking-widest block">Est. 2026</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'services') {
                  return (
                    <section key="services" className="py-24 bg-[#FAF5ED] border-t border-[#E6DEC9]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                          <span className="text-[#C27D56] font-bold font-montserrat tracking-[0.25em] uppercase text-xs block mb-3">What We Offer</span>
                          <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#2A4B3A]">Our Specialties</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {categories.map((cat: any, idx: number) => (
                            <div key={idx} className="bg-[#FAF5ED] border border-[#E6DEC9] p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative group">
                              <h3 className="text-xl font-playfair font-bold text-[#2A4B3A] mb-3">{cat.title}</h3>
                              <p className="text-[#5E6B61] text-sm leading-relaxed font-montserrat">{cat.description || 'Crafted fresh daily using high-quality local organic flour and ingredients.'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'menu') {
                  return (
                    <section key="menu" className="py-24 bg-[#FAF5ED] border-t border-[#E6DEC9]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                          <div>
                            <span className="text-[#C27D56] font-bold font-montserrat tracking-[0.25em] uppercase text-xs block mb-3">our products</span>
                            <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#2A4B3A]">Featured Selections</h2>
                          </div>
                          <button
                            onClick={(e) => handleNavClick('menu', e)}
                            className="text-xs font-bold uppercase font-montserrat tracking-widest text-[#2A4B3A] hover:text-[#C27D56] transition-colors border-b border-[#C27D56] pb-1 flex items-center gap-1 group"
                          >
                            View Full Menu
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {products.slice(0, 6).map((prod: any, idx: number) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedProduct(prod)}
                              className="bg-[#FAF5ED] border border-[#E6DEC9] rounded-[2rem] p-4 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-98"
                            >
                              <div>
                                <div className="aspect-[4/3] rounded-2xl bg-[#FAF5ED] border border-[#E6DEC9]/60 overflow-hidden flex items-center justify-center mb-4 relative">
                                  <img
                                    src={prod.image || '/media/placeholder_pastry.png'}
                                    alt={prod.name}
                                    className="w-5/6 h-5/6 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-3 right-3 bg-[#FAF5ED]/95 backdrop-blur-sm border border-[#E6DEC9] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <Star size={10} className="text-[#C27D56] fill-[#C27D56]" />
                                    <span className="text-[10px] font-black text-slate-800">{prod.rating || '4.8'}</span>
                                  </div>
                                </div>
                                <div className="px-2">
                                  <h3 className="text-lg font-playfair font-bold text-[#2A4B3A] mb-1.5 leading-snug truncate">{prod.name}</h3>
                                  <p className="text-[#5E6B61] font-montserrat text-xs leading-relaxed line-clamp-2 mb-4">{prod.description}</p>
                                </div>
                              </div>

                              <div className="px-2 pt-2 border-t border-[#E6DEC9]/40 flex items-center justify-between">
                                <span className="text-[#C27D56] font-montserrat font-black text-lg">{prod.price}</span>
                                <span className="text-[10px] font-bold font-montserrat uppercase tracking-wider text-[#5E6B61] bg-[#E6DEC9]/50 px-3 py-1 rounded-full group-hover:bg-[#C27D56] group-hover:text-white transition-colors duration-300">
                                  Details
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'gallery') {
                  return (
                    <section key="gallery" id="gallery" className="py-24 bg-[#FAF5ED] border-t border-[#E6DEC9]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                          <span className="text-[#C27D56] font-bold font-montserrat tracking-[0.25em] uppercase text-xs block mb-3">gallery</span>
                          <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#2A4B3A]">Our Bakery Life</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {galleryImages.map((imgSrc, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedImage(imgSrc)}
                              className="overflow-hidden rounded-2xl group cursor-pointer aspect-square bg-[#FAF5ED] border border-[#E6DEC9] relative shadow-sm"
                            >
                              <img
                                src={imgSrc}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-[#2A4B3A]/0 group-hover:bg-[#2A4B3A]/40 transition-colors duration-300 flex items-center justify-center">
                                <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'contact') {
                  return (
                    <section key="contact" id="contact-info" className="py-24 bg-[#FAF5ED] border-t border-[#E6DEC9]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-stretch gap-10">
                          <div className="w-full lg:w-1/2 bg-[#FAF5ED] border border-[#E6DEC9] rounded-[2.5rem] p-8 lg:p-12 shadow-sm flex flex-col justify-between">
                            <div>
                              <span className="text-[#C27D56] font-bold font-montserrat tracking-[0.25em] uppercase text-xs block mb-3">contact</span>
                              <h2 className="text-3xl lg:text-4xl font-playfair font-black text-[#2A4B3A] mb-8 leading-tight">
                                Come visit us
                              </h2>

                              <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#E6DEC9] flex items-center justify-center shrink-0">
                                    <MapPin className="text-[#C27D56]" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[#2A4B3A] text-sm mb-1 font-montserrat uppercase tracking-wider">Location</h4>
                                    <p className="text-[#5E6B61] font-medium text-xs lg:text-sm">{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#E6DEC9] flex items-center justify-center shrink-0">
                                    <Phone className="text-[#C27D56]" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[#2A4B3A] text-sm mb-1 font-montserrat uppercase tracking-wider">Phone</h4>
                                    <p className="text-[#5E6B61] font-medium text-xs lg:text-sm">{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#E6DEC9] flex items-center justify-center shrink-0">
                                    <Mail className="text-[#C27D56]" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[#2A4B3A] text-sm mb-1 font-montserrat uppercase tracking-wider">Email</h4>
                                    <p className="text-[#5E6B61] font-medium text-xs lg:text-sm">{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-[#E6DEC9] pt-6 mt-8">
                              <h4 className="font-bold text-[#2A4B3A] text-sm mb-4 font-montserrat uppercase tracking-wider">Opening Hours</h4>
                              <div className="space-y-2 text-xs lg:text-sm text-[#5E6B61] font-medium">
                                <div className="flex justify-between">
                                  <span>Mon - Fri</span>
                                  <span className="text-[#2A4B3A] font-bold">7:00 AM - 7:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Saturday</span>
                                  <span className="text-[#2A4B3A] font-bold">8:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sunday</span>
                                  <span className="text-[#2A4B3A] font-bold">8:00 AM - 5:00 PM</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#E6DEC9]">
                                <a href={content.contact_info?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#FAF5ED] border border-[#E6DEC9] flex items-center justify-center text-[#2A4B3A] hover:text-[#C27D56] transition-colors shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                                <a href={content.contact_info?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#FAF5ED] border border-[#E6DEC9] flex items-center justify-center text-[#2A4B3A] hover:text-[#C27D56] transition-colors shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                </a>
                                <a href={content.contact_info?.whatsapp ? `https://wa.me/${content.contact_info.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#FAF5ED] border border-[#E6DEC9] flex items-center justify-center text-[#2A4B3A] hover:text-[#C27D56] transition-colors shadow-sm">
                                  <MessageCircle size={16} />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2 bg-[#FAF5ED] border border-[#E6DEC9] rounded-[2.5rem] p-3 shadow-sm overflow-hidden min-h-[300px] lg:min-h-full">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Kerala, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full rounded-3xl grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 min-h-[300px] lg:min-h-[450px]"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                  return (
                    <section key="custom" className="py-24 bg-[#FAF5ED] border-t border-[#E6DEC9]">
                      <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
                        {content.custom_blocks_json.map((block: any, idx: number) => {
                          if (block.type === 'heading') {
                            return <h2 key={idx} className="text-3xl lg:text-4xl font-playfair font-black text-[#2A4B3A] tracking-tight mb-6 mt-8">{block.content || 'Heading'}</h2>;
                          }
                          if (block.type === 'paragraph') {
                            return <p key={idx} className="text-[#5E6B61] font-montserrat text-sm lg:text-base leading-relaxed whitespace-pre-wrap">{block.content || 'Text content'}</p>;
                          }
                          if (block.type === 'image') {
                            return <img key={idx} src={block.url || '/media/placeholder_pastry.png'} alt="Custom element" className="w-full h-auto rounded-3xl mb-8 mt-4 shadow-md border border-[#E6DEC9]" />;
                          }
                          if (block.type === 'divider') {
                            return <hr key={idx} className="my-12 border-t border-[#E6DEC9] w-1/4 mx-auto" />;
                          }
                          return null;
                        })}
                      </div>
                    </section>
                  );
                }

                return null;
              })}
          </main>
        ) : (
          /* --- MENU/SHOP VIEW --- */
          <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <button
                onClick={(e) => handleNavClick('home', e)}
                className="flex items-center gap-2 text-[#5E6B61] hover:text-[#C27D56] transition-colors font-bold font-montserrat uppercase tracking-wider text-xs mb-8"
              >
                <ChevronLeft size={16} /> Back to Home
              </button>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#E6DEC9] pb-8">
                <div>
                  <span className="text-[#C27D56] font-bold font-montserrat tracking-[0.25em] uppercase text-xs block mb-3">Complete Catalog</span>
                  <h1 className="text-2xl sm:text-3xl lg:text-6xl font-playfair font-black text-[#2A4B3A] break-words">Our Full Menu</h1>
                </div>

                <div className="w-full lg:w-96 relative">
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF5ED] border border-[#E6DEC9] rounded-full py-3.5 pl-12 pr-4 outline-none focus:border-[#C27D56] transition-colors text-slate-700 shadow-sm font-montserrat text-sm"
                  />
                  <Search size={18} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((prod: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedProduct(prod)}
                    className="bg-[#FAF5ED] border border-[#E6DEC9] rounded-3xl p-4 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-98"
                  >
                    <div>
                      <div className="aspect-square rounded-2xl bg-[#FAF5ED] border border-[#E6DEC9]/60 overflow-hidden flex items-center justify-center mb-4 relative">
                        <img
                          src={prod.image || '/media/placeholder_pastry.png'}
                          alt={prod.name}
                          className="w-5/6 h-5/6 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-[#FAF5ED]/95 backdrop-blur-sm border border-[#E6DEC9] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star size={10} className="text-[#C27D56] fill-[#C27D56]" />
                          <span className="text-[10px] font-black text-slate-800">{prod.rating || '4.8'}</span>
                        </div>
                      </div>

                      <div className="px-2">
                        <h3 className="text-base font-playfair font-bold text-[#2A4B3A] mb-1.5 leading-snug truncate">{prod.name}</h3>
                        <p className="text-[#5E6B61] font-montserrat text-[11px] leading-relaxed line-clamp-2">{prod.description}</p>
                      </div>
                    </div>

                    <div className="px-2 pt-4 mt-4 border-t border-[#E6DEC9]/40 flex items-center justify-between">
                      <span className="text-[#C27D56] font-montserrat font-black text-base">{prod.price}</span>
                      <span className="text-[10px] font-bold font-montserrat uppercase tracking-wider text-[#5E6B61] bg-[#E6DEC9]/50 px-3 py-1 rounded-full group-hover:bg-[#C27D56] group-hover:text-white transition-colors duration-300">
                        Details
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#FAF5ED] border border-[#E6DEC9] rounded-3xl">
                <Coffee size={40} className="mx-auto text-[#E6DEC9] mb-4" />
                <h3 className="text-xl font-playfair font-bold text-slate-800 mb-1">No items found</h3>
                <p className="text-slate-500 text-sm">We couldn't find anything matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-[#C27D56] font-bold text-sm hover:underline">Clear Search</button>
              </div>
            )}
          </main>
        )}

        {/* Footer */}
        <footer id="contact" className={`${artisanColors.bgDark} text-white pt-20 pb-12`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  {content.settings_json?.logo_image ? (
                    <img src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#C27D56] flex items-center justify-center">
                      <Coffee size={24} className="text-white" />
                    </div>
                  )}
                  <span className="text-2xl font-playfair font-bold tracking-wide capitalize">
                    {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}
                  </span>
                </div>
                <p className="text-[#FAF5ED]/70 max-w-sm leading-relaxed text-sm">
                  Dedicated to bringing you the best flavors, fresh local ingredients, and traditional baking techniques daily.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-playfair font-bold text-[#C27D56] mb-6">Contact Us</h4>
                <ul className="space-y-4 text-[#FAF5ED]/70 text-sm">
                  <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                    <MapPin size={18} className="shrink-0 mt-1 text-[#C27D56]" />
                    <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                  </li>
                  <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                    <Phone size={18} className="shrink-0 text-[#C27D56]" />
                    <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-playfair font-bold text-[#C27D56] mb-6">Opening Hours</h4>
                <ul className="space-y-3 text-[#FAF5ED]/70 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Mon - Fri</span>
                    <span className="text-white font-medium">7:00 AM - 7:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Saturday</span>
                    <span className="text-white font-medium">8:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#FAF5ED]/50">
              <p>&copy; {new Date().getFullYear()} {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}. All rights reserved.</p>
              <p>Designed with <span className="text-[#C27D56] font-bold">Jaalam</span></p>
            </div>
          </div>
        </footer>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 text-white hover:text-[#C27D56] transition-colors p-2" aria-label="Close">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img src={selectedImage} alt="Fullscreen Gallery" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative bg-[#FAF5ED] border border-[#E6DEC9] max-w-sm w-full overflow-hidden shadow-2xl rounded-[2.5rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full bg-[#FAF5ED] overflow-hidden flex items-center justify-center border-b border-[#E6DEC9]">
                <img
                  src={selectedProduct.image || '/media/placeholder_pastry.png'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-[#FAF5ED]/90 backdrop-blur-sm hover:bg-[#FAF5ED] text-slate-800 p-2 rounded-full shadow-md transition-all active:scale-95 z-20 border border-[#E6DEC9]"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-playfair font-black text-[#2A4B3A] leading-tight mb-2">
                    {selectedProduct.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-base font-montserrat font-black px-4 py-1.5 rounded-full text-white bg-[#C27D56] shadow-[0_4px_12px_rgba(194,125,86,0.25)]">
                      {selectedProduct.price}
                    </span>

                    <div className="flex items-center gap-1 bg-[#FAF5ED] border border-[#E6DEC9] px-3 py-1 rounded-full shadow-inner">
                      <Star size={12} className="text-[#C27D56] fill-[#C27D56]" />
                      <span className="text-slate-800 text-xs font-black">{selectedProduct.rating || '4.8'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E6DEC9] pt-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 font-montserrat">Description</h4>
                  <p className="text-[#5E6B61] font-montserrat text-sm leading-relaxed">
                    {selectedProduct.description || 'No description available for this item. Baked fresh with the finest ingredients.'}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-[#C27D56] hover:bg-[#B06E49] font-montserrat font-bold py-3 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-white rounded-full text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  if (website.theme === 'Boutique') {
    const customColors = {
      primary: 'bg-[#111111]',
      accent: 'bg-[#D4A373]',
      accentText: 'text-[#D4A373]',
      accentBorder: 'border-[#D4A373]',
      bgDark: 'bg-[#111111]',
      bgLight: 'bg-[#F9F9FB]',
      cardBg: 'bg-white',
      cardBorder: 'border-[#EAEAEA]',
      textDark: 'text-[#111111]',
      textMuted: 'text-[#7A7A7A]',
    };

    return (
      <div className={`min-h-screen ${customColors.bgLight} font-inter selection:bg-[#D4A373] selection:text-[#111111] relative overflow-x-hidden`}>
        <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&display=swap');
          .font-syne {
            font-family: 'Syne', sans-serif;
          }
          .font-grotesk {
            font-family: 'Space Grotesk', sans-serif;
          }
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Sticky Header */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavSolid ? 'bg-[#F9F9FB] border-b border-[#EAEAEA] py-3 shadow-sm' : 'bg-transparent py-5'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleNavClick('home', e)}>
              {content.settings_json?.logo_image ? (
                <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white" />
              ) : (
                <div className={`w-10 h-10 rounded-full ${customColors.primary} flex items-center justify-center`}>
                  <Coffee size={18} className="text-[#D4A373]" />
                </div>
              )}
              <span className={`text-xl font-bold font-syne tracking-tight capitalize ${isNavSolid ? customColors.textDark : 'text-white'}`}>
                {content.settings_json?.website_name || website.slug || website.business_type || 'Our Bakery'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-grotesk text-sm font-bold tracking-wider uppercase">
              <a href="#home" onClick={(e) => handleNavClick('home', e)} className={`transition-colors hover:text-[#D4A373] ${isNavSolid ? customColors.textDark : 'text-white/90'}`}>home</a>
              <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className={`transition-colors hover:text-[#D4A373] ${isNavSolid ? customColors.textDark : 'text-white/90'}`}>shop</a>
              {currentView === 'home' && (
                <>
                  <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className={`transition-colors hover:text-[#D4A373] ${isNavSolid ? customColors.textDark : 'text-white/90'}`}>about</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className={`transition-colors hover:text-[#D4A373] ${isNavSolid ? customColors.textDark : 'text-white/90'}`}>gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className={`transition-colors hover:text-[#D4A373] ${isNavSolid ? customColors.textDark : 'text-white/90'}`}>contact</a>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-1.5 ${isNavSolid ? customColors.textDark : 'text-white'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#F9F9FB] border-b border-[#EAEAEA] shadow-xl py-4 px-6 flex flex-col gap-3 z-50 font-grotesk text-sm font-bold uppercase tracking-widest">
              <a href="#home" onClick={(e) => handleNavClick('home', e)} className="py-2 border-b border-[#EAEAEA]/60 text-slate-800 hover:text-[#D4A373]">home</a>
              <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className="py-2 border-b border-[#EAEAEA]/60 text-slate-800 hover:text-[#D4A373]">shop</a>
              {currentView === 'home' && (
                <>
                  <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className="py-2 border-b border-[#EAEAEA]/60 text-slate-800 hover:text-[#D4A373]">about</a>
                  <a href="#gallery" onClick={(e) => handleNavClick('home', e, 'gallery')} className="py-2 border-b border-[#EAEAEA]/60 text-slate-800 hover:text-[#D4A373]">gallery</a>
                  <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className="py-2 text-slate-800 hover:text-[#D4A373]">contact</a>
                </>
              )}
            </div>
          )}
        </nav>

        {currentView === 'home' ? (
          <main>
            {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
              .filter((s: string) => !(content.settings_json?.hidden_sections || []).includes(s))
              .map((sectionId: string) => {
                if (sectionId === 'hero') {
                  return (
                    <section key="hero" id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#111111]">
                      {/* Typographic Subtle Overlay */}
                      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
                        <span className="text-[12rem] lg:text-[24rem] font-syne font-black text-white whitespace-nowrap tracking-tighter">
                          BOUTIQUE
                        </span>
                      </div>

                      {/* Floating Core Graphic */}
                      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 lg:opacity-50">
                        <motion.div
                          animate={{ y: [0, -15, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                          className="w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border border-white/10 p-2"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
                            alt="Premium Close-up Pastry"
                            className="w-full h-full object-cover rounded-full filter grayscale"
                          />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <span className="block text-[#D4A373] font-bold font-grotesk uppercase tracking-[0.3em] text-xs lg:text-sm mb-4">
                          {content.settings_json?.website_name || website.slug || 'Luxury Boutique'}
                        </span>
                        <h2 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-syne font-extrabold tracking-tight leading-[1.05] mb-6 uppercase break-words w-full">
                          {content.hero_title || 'Design & Taste'}
                        </h2>
                        <p className="text-slate-300 font-inter text-sm lg:text-base font-light max-w-lg mx-auto mb-10 leading-relaxed">
                          {content.about_text || 'Experience the warmth of fresh artisan breads, exquisite pastries, and masterfully roasted coffee in the heart of the city.'}
                        </p>
                        <button
                          onClick={(e) => handleNavClick('menu', e)}
                          className="bg-[#D4A373] hover:bg-[#C29262] text-[#111111] px-8 py-4 rounded-none font-bold font-grotesk uppercase tracking-widest text-xs shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                          Explore boutique
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'about') {
                  return (
                    <section key="about" id="story" className="py-32 bg-[#F9F9FB]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                          <div className="lg:col-span-7 space-y-8">
                            <span className="text-[#D4A373] font-bold font-grotesk tracking-[0.3em] uppercase text-xs block">our story</span>
                            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-syne font-extrabold text-[#111111] tracking-tight leading-tight uppercase break-words w-full">
                              {content.settings_json?.about_title || 'The Art of Traditional Baking'}
                            </h2>
                            <p className="text-[#7A7A7A] font-inter font-light leading-relaxed text-sm lg:text-base whitespace-pre-line">
                              {content.settings_json?.about_description || 'Every morning begins before dawn. We source the finest organic ingredients and rely on time-honored techniques to create pastries and breads that awaken the senses.\n\nFrom our flaky, 24-layer croissants to our perfectly balanced espresso, we believe in taking no shortcuts.'}
                            </p>
                          </div>

                          <div className="lg:col-span-5 grid grid-cols-2 gap-8 border-l border-[#EAEAEA] pl-8 lg:pl-16">
                            <div className="space-y-2">
                              <span className="block text-3xl font-syne font-extrabold text-[#111111]">15+</span>
                              <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-bold font-grotesk">Daily Creations</span>
                            </div>
                            <div className="space-y-2">
                              <span className="block text-3xl font-syne font-extrabold text-[#111111]">100%</span>
                              <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-bold font-grotesk">Organic Ingredients</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'services') {
                  return (
                    <section key="services" className="py-24 bg-[#F9F9FB] border-t border-[#EAEAEA]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="mb-20">
                          <span className="text-[#D4A373] font-bold font-grotesk tracking-[0.3em] uppercase text-xs block mb-3">curated range</span>
                          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-syne font-extrabold text-[#111111] uppercase break-words">Our Specialties</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                          {categories.map((cat: any, idx: number) => (
                            <div key={idx} className="border-t border-[#D4A373] pt-8 flex flex-col justify-between group hover:border-[#111111] transition-colors duration-300">
                              <div>
                                <span className="block text-xs font-bold font-grotesk text-[#D4A373] mb-4">0{idx + 1}</span>
                                <h3 className="text-2xl font-syne font-bold text-[#111111] mb-4 uppercase">{cat.title}</h3>
                                <p className="text-[#7A7A7A] text-sm leading-relaxed font-inter font-light">{cat.description || 'Crafted fresh daily using high-quality local organic flour and ingredients.'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'menu') {
                  return (
                    <section key="menu" className="py-24 bg-[#F9F9FB] border-t border-[#EAEAEA]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                          <div>
                            <span className="text-[#D4A373] font-bold font-grotesk tracking-[0.3em] uppercase text-xs block mb-3">selected items</span>
                            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-syne font-extrabold text-[#111111] uppercase break-words">The Collection</h2>
                          </div>
                          <button
                            onClick={(e) => handleNavClick('menu', e)}
                            className="text-xs font-bold uppercase font-grotesk tracking-widest text-[#111111] hover:text-[#D4A373] transition-colors border-b-2 border-[#111111] pb-1 flex items-center gap-1 group"
                          >
                            View Full Range
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                          {products.slice(0, 6).map((prod: any, idx: number) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedProduct(prod)}
                              className="border border-[#EAEAEA] hover:border-[#D4A373] p-6 flex flex-col justify-between group transition-all duration-300 cursor-pointer bg-white"
                            >
                              <div>
                                <div className="aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center mb-6 relative">
                                  <img
                                    src={prod.image || '/media/placeholder_pastry.png'}
                                    alt={prod.name}
                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                  />
                                  <div className="absolute top-3 right-3 bg-white px-2.5 py-1 flex items-center gap-1 shadow-sm border border-[#EAEAEA]">
                                    <Star size={10} className="text-[#D4A373] fill-[#D4A373]" />
                                    <span className="text-[10px] font-bold font-grotesk text-slate-800">{prod.rating || '4.8'}</span>
                                  </div>
                                </div>
                                <h3 className="text-xl font-syne font-extrabold text-[#111111] mb-2 uppercase truncate">{prod.name}</h3>
                                <p className="text-[#7A7A7A] font-inter text-xs font-light leading-relaxed line-clamp-2 mb-6">{prod.description}</p>
                              </div>

                              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                                <span className="text-[#111111] font-grotesk font-bold text-lg">{prod.price}</span>
                                <span className="text-[10px] font-bold font-grotesk uppercase tracking-widest text-[#D4A373] group-hover:text-[#111111] transition-colors">
                                  Detail [→]
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'gallery') {
                  return (
                    <section key="gallery" id="gallery" className="py-24 bg-[#F9F9FB] border-t border-[#EAEAEA]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="mb-20 text-left">
                          <span className="text-[#D4A373] font-bold font-grotesk tracking-[0.3em] uppercase text-xs block mb-3">visual archive</span>
                          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-syne font-extrabold text-[#111111] uppercase break-words">Atmosphere</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {galleryImages.map((imgSrc, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedImage(imgSrc)}
                              className="overflow-hidden group cursor-pointer aspect-square bg-white border border-[#EAEAEA] hover:border-[#D4A373] transition-colors p-2 relative shadow-sm"
                            >
                              <img
                                src={imgSrc}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'contact') {
                  return (
                    <section key="contact" id="contact-info" className="bg-[#111111] text-white py-32 border-t border-[#222222]">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
                          <div className="lg:col-span-6 flex flex-col justify-between">
                            <div>
                              <span className="text-[#D4A373] font-bold font-grotesk tracking-[0.3em] uppercase text-xs block mb-4">connect</span>
                              <h2 className="text-2xl sm:text-3xl lg:text-6xl font-syne font-extrabold text-white mb-8 uppercase leading-tight break-words w-full">
                                Store Locator
                              </h2>

                              <div className="space-y-8 font-inter font-light">
                                <div className="flex items-start gap-4">
                                  <MapPin className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Address</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <Phone className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Phone</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4">
                                  <Mail className="text-[#D4A373] shrink-0 mt-1" size={18} />
                                  <div>
                                    <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-1">Email</h4>
                                    <p className="text-slate-400 text-sm">{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-[#222222] pt-8 mt-12">
                              <h4 className="font-bold text-white text-xs font-grotesk uppercase tracking-widest mb-6">Opening Hours</h4>
                              <div className="space-y-3 text-sm text-slate-400 font-inter font-light">
                                <div className="flex justify-between border-b border-[#222222] pb-2">
                                  <span>Mon - Fri</span>
                                  <span className="text-white font-bold">7:00 AM - 7:00 PM</span>
                                </div>
                                <div className="flex justify-between border-b border-[#222222] pb-2">
                                  <span>Saturday</span>
                                  <span className="text-white font-bold">8:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sunday</span>
                                  <span className="text-white font-bold">8:00 AM - 5:00 PM</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-12 pt-8 border-t border-[#222222]">
                                <a href={content.contact_info?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#222222] flex items-center justify-center text-slate-400 hover:text-[#D4A373] hover:border-[#D4A373]/50 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                                <a href={content.contact_info?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#222222] flex items-center justify-center text-slate-400 hover:text-[#D4A373] hover:border-[#D4A373]/50 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                </a>
                                <a href={content.contact_info?.whatsapp ? `https://wa.me/${content.contact_info.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#222222] flex items-center justify-center text-slate-400 hover:text-[#D4A373] hover:border-[#D4A373]/50 transition-colors">
                                  <MessageCircle size={16} />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-6 bg-[#222222] p-2 border border-[#222222] overflow-hidden min-h-[350px] lg:min-h-full">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Kerala, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 min-h-[350px] lg:min-h-[450px]"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                  return (
                    <section key="custom" className="py-24 bg-[#F9F9FB] border-t border-[#EAEAEA]">
                      <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
                        {content.custom_blocks_json.map((block: any, idx: number) => {
                          if (block.type === 'heading') {
                            return <h2 key={idx} className="text-3xl lg:text-4xl font-syne font-extrabold text-[#111111] tracking-tight mb-6 mt-8 uppercase">{block.content || 'Heading'}</h2>;
                          }
                          if (block.type === 'paragraph') {
                            return <p key={idx} className="text-[#7A7A7A] font-inter text-sm lg:text-base leading-relaxed font-light whitespace-pre-wrap">{block.content || 'Text content'}</p>;
                          }
                          if (block.type === 'image') {
                            return <img key={idx} src={block.url || '/media/placeholder_pastry.png'} alt="Custom element" className="w-full h-auto rounded-none mb-8 mt-4 shadow-sm border border-[#EAEAEA]" />;
                          }
                          if (block.type === 'divider') {
                            return <hr key={idx} className="my-12 border-t border-[#EAEAEA] w-1/4 mx-auto" />;
                          }
                          return null;
                        })}
                      </div>
                    </section>
                  );
                }

                return null;
              })}
          </main>
        ) : (
          /* --- MENU/SHOP VIEW --- */
          <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <button
                onClick={(e) => handleNavClick('home', e)}
                className="flex items-center gap-2 text-[#7A7A7A] hover:text-[#D4A373] transition-colors font-bold font-grotesk uppercase tracking-widest text-xs mb-8"
              >
                <ChevronLeft size={16} /> Back to Home
              </button>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#EAEAEA] pb-8">
                <div>
                  <span className="text-[#D4A373] font-bold font-grotesk tracking-[0.3em] uppercase text-xs block mb-3">Complete Collection</span>
                  <h1 className="text-2xl sm:text-3xl lg:text-6xl font-syne font-extrabold text-[#111111] uppercase break-words">Our Full Menu</h1>
                </div>

                <div className="w-full lg:w-96 relative">
                  <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F9F9FB] border border-[#EAEAEA] py-3.5 pl-12 pr-4 outline-none focus:border-[#D4A373] transition-colors text-slate-700 shadow-sm font-grotesk text-sm rounded-none"
                  />
                  <Search size={18} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((prod: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedProduct(prod)}
                    className="bg-white border border-[#EAEAEA] hover:border-[#D4A373] p-4 flex flex-col justify-between group transition-all duration-300 cursor-pointer"
                  >
                    <div>
                      <div className="aspect-square bg-slate-50 overflow-hidden flex items-center justify-center mb-4 relative">
                        <img
                          src={prod.image || '/media/placeholder_pastry.png'}
                          alt={prod.name}
                          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-white border border-[#EAEAEA] px-2.5 py-1 flex items-center gap-1 shadow-sm">
                          <Star size={10} className="text-[#D4A373] fill-[#D4A373]" />
                          <span className="text-[10px] font-bold font-grotesk text-slate-800">{prod.rating || '4.8'}</span>
                        </div>
                      </div>

                      <div className="px-2">
                        <h3 className="text-base font-syne font-extrabold text-[#111111] mb-1.5 leading-snug uppercase truncate">{prod.name}</h3>
                        <p className="text-[#7A7A7A] font-inter text-[11px] font-light leading-relaxed line-clamp-2">{prod.description}</p>
                      </div>
                    </div>

                    <div className="px-2 pt-4 mt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                      <span className="text-[#111111] font-grotesk font-bold text-base">{prod.price}</span>
                      <span className="text-[10px] font-bold font-grotesk uppercase tracking-widest text-[#D4A373] group-hover:text-[#111111] transition-colors">
                        Detail [→]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white border border-[#EAEAEA]">
                <Coffee size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-syne font-extrabold text-[#111111] mb-1 uppercase">No items found</h3>
                <p className="text-slate-500 text-sm">We couldn't find anything matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-[#D4A373] font-bold text-sm hover:underline">Clear Search</button>
              </div>
            )}
          </main>
        )}

        {/* Footer */}
        <footer id="contact" className={`${customColors.bgDark} text-white pt-20 pb-12`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-[#222222] pb-16">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  {content.settings_json?.logo_image ? (
                    <img src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#D4A373] flex items-center justify-center">
                      <Coffee size={24} className="text-[#111111]" />
                    </div>
                  )}
                  <span className="text-2xl font-syne font-extrabold tracking-tight capitalize">
                    {content.settings_json?.website_name || website.slug || 'Custom Bakery'}
                  </span>
                </div>
                <p className="text-slate-400 max-w-sm leading-relaxed text-sm font-light">
                  Dedicated to bringing you the best flavors, fresh local ingredients, and traditional baking techniques daily.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-syne font-bold text-[#D4A373] mb-6 uppercase">Contact Us</h4>
                <ul className="space-y-4 text-slate-400 text-sm font-light">
                  <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer" onClick={(e) => handleNavClick('home', e as any)}>
                    <MapPin size={18} className="shrink-0 mt-1 text-[#D4A373]" />
                    <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                  </li>
                  <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                    <Phone size={18} className="shrink-0 text-[#D4A373]" />
                    <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-syne font-bold text-[#D4A373] mb-6 uppercase">Opening Hours</h4>
                <ul className="space-y-3 text-slate-400 text-sm font-light">
                  <li className="flex justify-between border-b border-[#222222] pb-2">
                    <span>Mon - Fri</span>
                    <span className="text-white font-medium">7:00 AM - 7:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-[#222222] pb-2">
                    <span>Saturday</span>
                    <span className="text-white font-medium">8:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-light">
              <p>&copy; {new Date().getFullYear()} {content.settings_json?.website_name || website.slug || 'Custom Bakery'}. All rights reserved.</p>
              <p>Designed with <span className="text-[#D4A373] font-bold">Jaalam</span></p>
            </div>
          </div>
        </footer>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 text-white hover:text-[#D4A373] transition-colors p-2" aria-label="Close">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img src={selectedImage} alt="Fullscreen Gallery" className="max-w-full max-h-[90vh] object-contain rounded-none shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative bg-white border border-[#EAEAEA] max-w-sm w-full overflow-hidden shadow-2xl rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full bg-[#F9F9FB] overflow-hidden flex items-center justify-center border-b border-[#EAEAEA]">
                <img
                  src={selectedProduct.image || '/media/placeholder_pastry.png'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover filter grayscale"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 p-2 shadow-md transition-all active:scale-95 z-20 border border-[#EAEAEA] rounded-none"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-syne font-extrabold text-[#111111] leading-tight mb-2 uppercase">
                    {selectedProduct.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-base font-grotesk font-bold px-4 py-1.5 text-[#111111] bg-[#D4A373] shadow-sm">
                      {selectedProduct.price}
                    </span>

                    <div className="flex items-center gap-1 bg-[#F9F9FB] border border-[#EAEAEA] px-3 py-1 shadow-inner">
                      <Star size={12} className="text-[#D4A373] fill-[#D4A373]" />
                      <span className="text-slate-800 text-xs font-bold font-grotesk">{selectedProduct.rating || '4.8'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#EAEAEA] pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-grotesk">Description</h4>
                  <p className="text-[#7A7A7A] font-inter text-sm leading-relaxed font-light">
                    {selectedProduct.description || 'No description available for this item. Baked fresh with the finest ingredients.'}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-[#111111] hover:bg-[#222222] font-grotesk font-bold py-3 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-white rounded-none text-xs uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen scrollbar-hide ${colors.bgLight} font-sans selection:bg-[#C19A6B] selection:text-white`}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavSolid ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

          <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleNavClick('home', e)}>
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-white" />
            ) : (
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${colors.primary} flex items-center justify-center`}>
                <Coffee size={20} className="text-white" />
              </div>
            )}
            <h1 className={`text-xl md:text-2xl font-black tracking-wider uppercase transition-colors ${isNavSolid ? colors.textDark : 'text-white'}`}>
              {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" onClick={(e) => handleNavClick('home', e)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${isNavSolid ? 'text-slate-600 hover:text-[#C19A6B]' : 'text-white/90 hover:text-white'}`}>Home</a>
            <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${isNavSolid ? 'text-slate-600 hover:text-[#C19A6B]' : 'text-white/90 hover:text-white'}`}>Full Menu</a>
            {currentView === 'home' && (
              <>
                <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${isNavSolid ? 'text-slate-600 hover:text-[#C19A6B]' : 'text-white/90 hover:text-white'}`}>Our Story</a>
                <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${isNavSolid ? 'text-slate-600 hover:text-[#C19A6B]' : 'text-white/90 hover:text-white'}`}>Visit Us</a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 ${isNavSolid ? colors.textDark : 'text-white'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl py-4 px-6 flex flex-col gap-4 z-50">
            <a href="#home" onClick={(e) => handleNavClick('home', e)} className={`text-sm font-bold uppercase tracking-widest ${colors.textDark} hover:text-[#C19A6B]`}>Home</a>
            <a href="#menu" onClick={(e) => handleNavClick('menu', e)} className={`text-sm font-bold uppercase tracking-widest ${colors.textDark} hover:text-[#C19A6B]`}>Full Menu</a>
            {currentView === 'home' && (
              <>
                <a href="#story" onClick={(e) => handleNavClick('home', e, 'story')} className={`text-sm font-bold uppercase tracking-widest ${colors.textDark} hover:text-[#C19A6B]`}>Our Story</a>
                <a href="#contact" onClick={(e) => handleNavClick('home', e, 'contact-info')} className={`text-sm font-bold uppercase tracking-widest ${colors.textDark} hover:text-[#C19A6B]`}>Visit Us</a>
              </>
            )}
          </div>
        )}
      </nav>

      {/* --- HOME VIEW --- */}
      {currentView === 'home' && (
        <main>
          {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
            .filter((s: string) => !(content.settings_json?.hidden_sections || []).includes(s))
            .map((sectionId: string) => {
              if (sectionId === 'hero') {
                return (
                  <section key="hero" id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                      <img src={heroImage} alt="Bakery Interior" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
                      <span className="block text-[#C19A6B] font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-4 drop-shadow-md">
                        Artisan Quality
                      </span>
                      <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight font-serif drop-shadow-xl whitespace-pre-line">
                        {content.hero_title || 'Baked With Passion & Craft'}
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                        {content.about_text || 'Experience the warmth of fresh artisan breads, exquisite pastries, and masterfully roasted coffee in the heart of the city.'}
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={(e) => handleNavClick('menu', e)} className={`${colors.primary} text-white px-8 py-4 rounded-none font-bold uppercase tracking-widest hover:bg-white hover:text-[#292524] transition-all duration-300 flex items-center gap-2 group`}>
                          Explore Full Menu
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </section>
                );
              }

              if (sectionId === 'about') {
                return (
                  <section key="about" id="story" className="py-20 md:py-32 bg-white">
                    <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center max-w-3xl">
                      <span className={`${colors.primaryText} font-bold tracking-[0.2em] uppercase text-sm mb-3 block`}>Our Craft</span>
                      <h2 className={`text-4xl md:text-5xl font-serif font-black ${colors.textDark} mb-6 leading-tight`}>
                        {content.settings_json?.about_title || 'The Art of Traditional Baking'}
                      </h2>
                      <p className={`${colors.textMuted} text-lg mb-10 leading-relaxed`}>
                        {content.settings_json?.about_description || 'Every morning begins before dawn. We source the finest organic ingredients and rely on time-honored techniques to create pastries and breads that awaken the senses. From our flaky, 24-layer croissants to our perfectly balanced espresso, we believe in taking no shortcuts.'}
                      </p>
                      <div className="flex items-center justify-center gap-12">
                        <div>
                          <h4 className={`text-4xl font-black ${colors.textDark}`}>15+</h4>
                          <p className={`text-sm uppercase tracking-wider ${colors.textMuted} font-bold mt-2`}>Daily Pastries</p>
                        </div>
                        <div className="w-px h-16 bg-slate-200"></div>
                        <div>
                          <h4 className={`text-4xl font-black ${colors.textDark}`}>100%</h4>
                          <p className={`text-sm uppercase tracking-wider ${colors.textMuted} font-bold mt-2`}>Organic Flour</p>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }

              if (sectionId === 'services') {
                return (
                  <section key="services" className={`py-24 ${colors.bgLight}`}>
                    <div className="container mx-auto px-6 md:px-12">
                      <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className={`${colors.primaryText} font-bold tracking-[0.2em] uppercase text-sm mb-3 block`}>What We Offer</span>
                        <h2 className={`text-4xl font-serif font-black ${colors.textDark}`}>Our Specialties</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {categories.map((cat: any, idx: number) => (
                          <div key={idx} className="bg-white p-10 text-center group hover:shadow-2xl transition-all duration-500 border border-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#C19A6B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out opacity-5"></div>
                            <h3 className={`text-2xl font-serif font-bold ${colors.textDark} mb-4`}>{cat.title}</h3>
                            <p className={colors.textMuted}>{cat.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              if (sectionId === 'menu') {
                return (
                  <section key="menu" className="py-24 bg-white">
                    <div className="container mx-auto px-6 md:px-12">
                      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                          <span className={`${colors.primaryText} font-bold tracking-[0.2em] uppercase text-sm mb-3 block`}>Fresh from the oven</span>
                          <h2 className={`text-4xl font-serif font-black ${colors.textDark}`}>Popular Menus</h2>
                        </div>
                        <button
                          onClick={(e) => handleNavClick('menu', e)}
                          className={`text-sm font-bold uppercase tracking-widest ${colors.textDark} hover:text-[#C19A6B] transition-colors border-b-2 border-[#C19A6B] pb-1 flex items-center gap-1`}
                        >
                          View Full Menu <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {products.slice(0, 6).map((prod: any, idx: number) => (
                          <div key={idx} onClick={() => setSelectedProduct(prod)} className="group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            <div className="relative overflow-hidden mb-6 aspect-[4/3] rounded-sm bg-slate-100">
                              <img src={prod.image || '/media/placeholder_pastry.png'} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 bg-white px-3 py-1.5 flex items-center gap-1 shadow-sm rounded-sm">
                                <Star size={12} className="text-[#C19A6B] fill-current" />
                                <span className="text-xs font-bold text-slate-800">{prod.rating || '4.5'}</span>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className={`text-xl font-serif font-bold ${colors.textDark} pr-4 group-hover:${colors.primaryText} transition-colors`}>{prod.name}</h3>
                                <span className={`text-xl font-black ${colors.primaryText}`}>{prod.price}</span>
                              </div>
                              <p className={`${colors.textMuted} text-sm leading-relaxed mb-4`}>{prod.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              if (sectionId === 'gallery') {
                return (
                  <section key="gallery" className="pb-24 bg-white">
                    <div className="container mx-auto px-6 md:px-12">
                      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                          <span className={`${colors.primaryText} font-bold tracking-[0.2em] uppercase text-sm mb-2 block`}>Our Atmosphere</span>
                          <h2 className={`text-4xl font-serif font-black ${colors.textDark}`}>Gallery</h2>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {galleryImages.map((imgSrc, idx) => (
                          <div key={idx} className="overflow-hidden rounded-sm group cursor-pointer aspect-square bg-slate-100 relative" onClick={() => setSelectedImage(imgSrc)}>
                            <img src={imgSrc} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                              <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" size={32} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              if (sectionId === 'contact') {
                return (
                  <section key="contact" id="contact-info" className="py-24 bg-[#FAF8F5]">
                    <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
                      <div className="md:w-1/2">
                        <span className={`${colors.primaryText} font-bold tracking-[0.2em] uppercase text-sm mb-3 block`}>Visit Us</span>
                        <h2 className={`text-4xl md:text-5xl font-serif font-black ${colors.textDark} mb-8 leading-tight`}>We'd love to <br />see you</h2>
                        <p className={`${colors.textMuted} text-lg mb-8 leading-relaxed`}>
                          Stop by our bakery for fresh coffee, warm pastries, and a welcoming atmosphere. We bake everything fresh daily.
                        </p>
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <MapPin className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Location</h4>
                              <p className={colors.textMuted}>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <Phone className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Phone</h4>
                              <p className={colors.textMuted}>{content.contact_info?.phone || '+1 (234) 567-8900'}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <Mail className={`${colors.primaryText} shrink-0 mt-1`} size={24} />
                            <div>
                              <h4 className={`font-bold ${colors.textDark} mb-1`}>Email</h4>
                              <p className={colors.textMuted}>{content.contact_info?.email || 'info@artisanbakery.com'}</p>
                            </div>
                          </div>

                          {/* Social Media Links */}
                          <div className="pt-4">
                            <h4 className={`font-bold ${colors.textDark} text-sm mb-3 uppercase tracking-wider`}>Follow Us</h4>
                            <div className="flex items-center gap-4">
                              <a
                                href={content.contact_info?.facebook || 'https://facebook.com'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#C19A6B] hover:border-[#C19A6B]/50 transition-colors bg-white shadow-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                              </a>
                              <a
                                href={content.contact_info?.instagram || 'https://instagram.com'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#C19A6B] hover:border-[#C19A6B]/50 transition-colors bg-white shadow-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                              </a>
                              <a
                                href={content.contact_info?.whatsapp ? `https://wa.me/${content.contact_info.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#C19A6B] hover:border-[#C19A6B]/50 transition-colors bg-white shadow-sm"
                              >
                                <MessageCircle size={18} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 w-full bg-slate-200 aspect-square md:aspect-[4/3] rounded-sm overflow-hidden relative border border-slate-100">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Kerala, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                          className="absolute inset-0 grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                        ></iframe>
                      </div>
                    </div>
                  </section>
                );
              }

              if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) {
                return (
                  <section key="custom" className="py-24 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {content.custom_blocks_json.map((block: any, idx: number) => {
                        if (block.type === 'heading') {
                          return <h2 key={idx} className={`text-4xl font-serif font-black ${colors.textDark} mb-6 mt-8 leading-tight`}>{block.content || 'Heading'}</h2>;
                        }
                        if (block.type === 'paragraph') {
                          return <p key={idx} className={`${colors.textMuted} text-lg mb-6 leading-relaxed whitespace-pre-wrap`}>{block.content || 'Text content'}</p>;
                        }
                        if (block.type === 'image') {
                          return <img key={idx} src={block.url || '/media/placeholder_pastry.png'} alt="Custom element" className="w-full h-auto rounded-sm mb-8 mt-4 shadow-sm" />;
                        }
                        if (block.type === 'divider') {
                          return <hr key={idx} className="my-12 border-t-2 border-slate-100 w-1/4 mx-auto" />;
                        }
                        return null;
                      })}
                    </div>
                  </section>
                );
              }
              return null;
            })}
        </main>
      )}

      {/* --- MENU VIEW --- */}
      {currentView === 'menu' && (
        <main className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
          <div className="container mx-auto px-6 md:px-12">

            {/* Menu Header & Search */}
            <div className="mb-16">
              <button onClick={(e) => handleNavClick('home', e)} className="flex items-center gap-2 text-slate-500 hover:text-[#C19A6B] transition-colors font-bold uppercase tracking-wider text-sm mb-8">
                <ChevronLeft size={18} /> Back to Home
              </button>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                  <span className={`${colors.primaryText} font-bold tracking-[0.2em] uppercase text-sm mb-3 block`}>Complete Catalog</span>
                  <h1 className={`text-5xl md:text-6xl font-serif font-black ${colors.textDark}`}>Our Full Menu</h1>
                </div>

                <div className="w-full lg:w-96 relative">
                  <input
                    type="text"
                    placeholder="Search for pastries, coffee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-sm py-4 pl-12 pr-4 outline-none focus:border-[#C19A6B] transition-colors text-slate-700 shadow-sm"
                  />
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {filteredProducts.map((prod: any, idx: number) => (
                  <div key={idx} onClick={() => setSelectedProduct(prod)} className="bg-white rounded-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between">
                    <div>
                      <div className="relative overflow-hidden aspect-square bg-slate-100">
                        <img src={prod.image || '/media/placeholder_pastry.png'} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 shadow-sm rounded-sm">
                          <Star size={10} className="text-[#C19A6B] fill-current" />
                          <span className="text-[10px] font-bold text-slate-800">{prod.rating || '4.5'}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h3 className={`text-lg font-serif font-bold ${colors.textDark} group-hover:${colors.primaryText} transition-colors leading-tight`}>{prod.name}</h3>
                          <span className={`text-lg font-black ${colors.primaryText}`}>{prod.price}</span>
                        </div>
                        <p className={`${colors.textMuted} text-xs leading-relaxed line-clamp-2`}>{prod.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-sm border border-slate-100">
                <Coffee size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">No items found</h3>
                <p className="text-slate-500">We couldn't find anything matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-6 text-[#C19A6B] font-bold hover:underline">Clear Search</button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Premium Dark Footer - Shared across views */}
      <footer id="contact" className={`${colors.bgDark} text-white pt-24 pb-12`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">

            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                {content.settings_json?.logo_image ? (
                  <img src={content.settings_json.logo_image} alt="Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
                ) : (
                  <div className={`w-12 h-12 rounded-full ${colors.primary} flex items-center justify-center`}>
                    <Coffee size={24} className="text-white" />
                  </div>
                )}
                <span className="text-2xl font-black tracking-wider uppercase">
                  {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}
                </span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Thank you for visiting. We are dedicated to bringing you the best flavors, fresh ingredients, and a welcoming atmosphere.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold text-white mb-6 tracking-wide">Contact Us</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer">
                  <MapPin size={20} className="shrink-0 mt-1 text-[#C19A6B]" />
                  <span>{content.contact_info?.address || '123 Artisan Ave, Bakery District, NY 10012'}</span>
                </li>
                <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                  <Phone size={20} className="shrink-0 text-[#C19A6B]" />
                  <span>{content.contact_info?.phone || '+1 (234) 567-8900'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold text-white mb-6 tracking-wide">Opening Hours</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Mon - Fri</span>
                  <span className="text-white font-medium">7:00 AM - 7:00 PM</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Saturday</span>
                  <span className="text-white font-medium">8:00 AM - 8:00 PM</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Sunday</span>
                  <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} {content.settings_json?.website_name || website.slug || 'Artisan Bakery'}. All rights reserved.</p>
            <p>Designed with <span className="text-[#C19A6B] font-bold">Jaalam</span></p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-[#C19A6B] transition-colors p-2" aria-label="Close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img src={selectedImage} alt="Fullscreen Gallery" className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative bg-white max-w-sm w-full overflow-hidden shadow-2xl ${website.theme === 'App Style' ? 'rounded-[2.5rem]' : 'rounded-sm'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image section */}
            <div className="relative aspect-[16/10] w-full bg-[#FFECD6] overflow-hidden flex items-center justify-center">
              <img
                src={selectedProduct.image || '/media/placeholder_pastry.png'}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 p-2.5 shadow-md transition-all active:scale-95 z-20 ${website.theme === 'App Style' ? 'rounded-full' : 'rounded-sm'
                  }`}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content section */}
            <div className="p-5 lg:p-6 space-y-4">
              <div>
                <h3 className={`text-xl lg:text-2xl font-black text-slate-900 leading-tight mb-2 ${website.theme === 'App Style' ? 'font-sans' : 'font-serif'
                  }`}>
                  {selectedProduct.name}
                </h3>

                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-lg lg:text-xl font-black px-4 py-1.5 rounded-full text-white ${website.theme === 'App Style' ? 'bg-[#EF8F63] shadow-[0_4px_12px_rgba(239,143,99,0.2)]' : `${colors.primary} shadow-sm`
                    }`}>
                    {selectedProduct.price}
                  </span>

                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full shadow-inner">
                    <Star size={14} className={`${website.theme === 'App Style' ? 'text-[#e5533d] fill-[#e5533d]' : 'text-[#C19A6B] fill-[#C19A6B]'
                      }`} />
                    <span className="text-slate-800 text-sm font-black">{selectedProduct.rating || '4.8'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description</h4>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                  {selectedProduct.description || 'No description available for this item. Baked fresh with the finest ingredients.'}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className={`w-full font-black py-3 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-white ${website.theme === 'App Style'
                    ? 'bg-[#EF8F63] hover:bg-[#E87D47] rounded-full'
                    : 'bg-[#C19A6B] hover:bg-[#b08b5e] rounded-sm'
                  }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

