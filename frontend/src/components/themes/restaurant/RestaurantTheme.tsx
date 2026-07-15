import React, { useState, useEffect, useRef } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, Clock, MessageCircle, Utensils, ChevronRight, Menu, X } from 'lucide-react';

import ProductBuyButton from '../../payments/ProductBuyButton';
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
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
}

interface RestaurantThemeProps {
  website: any;
  content: any;
}

export default function RestaurantTheme({ website, content }: RestaurantThemeProps) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
   
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  let primaryColor = 'bg-rose-600';
  let primaryColorHover = 'hover:bg-rose-700';
  let primaryText = 'text-rose-600';
  let headingFont = 'font-sans font-black tracking-tight';
  let bgDark = 'bg-slate-950';
  let bgDarkSec = 'bg-slate-900';
  let bgLight = 'bg-white';
  let bgLightSec = 'bg-slate-50';
  let buttonShape = 'rounded-none';
  let cardShape = 'rounded-none border-slate-700';
  let textDark = 'text-slate-900';
  let textDarkMuted = 'text-slate-600';
  let alignment = 'text-center items-center justify-center';
  let menuStyle = 'classic';
  let galleryStyle = 'grid-square';

  if (website.theme === 'Fine Dining') {
    primaryColor = 'bg-amber-600';
    primaryColorHover = 'hover:bg-amber-700';
    primaryText = 'text-amber-600';
    headingFont = 'font-serif tracking-tight';
    bgDark = 'bg-zinc-950';
    bgDarkSec = 'bg-zinc-900';
    bgLight = 'bg-stone-50';
    bgLightSec = 'bg-stone-100';
    buttonShape = 'rounded-none';
    cardShape = 'rounded-none border-zinc-700';
    textDark = 'text-zinc-900';
    textDarkMuted = 'text-zinc-600';
    alignment = 'text-center items-center justify-center';
    menuStyle = 'minimal-cards';
    galleryStyle = 'masonry';
  } else if (website.theme === 'Casual Eats') {
    primaryColor = 'bg-orange-500';
    primaryColorHover = 'hover:bg-orange-600';
    primaryText = 'text-orange-500';
    headingFont = 'font-sans font-extrabold tracking-wide';
    bgDark = 'bg-indigo-950';
    bgDarkSec = 'bg-indigo-900';
    bgLight = 'bg-white';
    bgLightSec = 'bg-orange-50/30';
    buttonShape = 'rounded-full';
    cardShape = 'rounded-3xl border-transparent shadow-xl';
    textDark = 'text-indigo-950';
    textDarkMuted = 'text-indigo-900/70';
    alignment = 'text-left items-start justify-start';
    menuStyle = 'grid-cards';
    galleryStyle = 'grid-rounded';
  } else if (website.theme === 'Bistro') {
    primaryColor = 'bg-emerald-600';
    primaryColorHover = 'hover:bg-emerald-700';
    primaryText = 'text-emerald-600';
    headingFont = 'font-serif italic tracking-wider';
    bgDark = 'bg-stone-900';
    bgDarkSec = 'bg-stone-800';
    bgLight = 'bg-[#fdfbf7]';
    bgLightSec = 'bg-stone-100/50';
    buttonShape = 'rounded-md shadow-sm border border-emerald-700/20';
    cardShape = 'rounded-md border-stone-200 shadow-md bg-white';
    textDark = 'text-stone-800';
    textDarkMuted = 'text-stone-600';
    alignment = 'text-center items-center justify-center';
    menuStyle = 'classic';
    galleryStyle = 'grid-polaroid';
  } else if (website.theme === 'Vegan Cafe') {
    primaryColor = 'bg-lime-500';
    primaryColorHover = 'hover:bg-lime-600';
    primaryText = 'text-lime-600';
    headingFont = 'font-sans font-medium tracking-tight';
    bgDark = 'bg-green-950';
    bgDarkSec = 'bg-green-900';
    bgLight = 'bg-[#f4f8f4]';
    bgLightSec = 'bg-white';
    buttonShape = 'rounded-2xl shadow-sm';
    cardShape = 'rounded-2xl border-lime-100 shadow-md bg-white';
    textDark = 'text-green-950';
    textDarkMuted = 'text-green-800/80';
    alignment = 'text-left items-start justify-start';
    menuStyle = 'minimal-list';
    galleryStyle = 'grid-circles';
  } else if (website.theme === 'Seafood Grill') {
    primaryColor = 'bg-cyan-600';
    primaryColorHover = 'hover:bg-cyan-700';
    primaryText = 'text-cyan-600';
    headingFont = 'font-serif font-black uppercase tracking-widest';
    bgDark = 'bg-slate-900';
    bgDarkSec = 'bg-slate-800';
    bgLight = 'bg-blue-50/50';
    bgLightSec = 'bg-white';
    buttonShape = 'rounded-sm border-2 border-cyan-600';
    cardShape = 'rounded-none border-b-4 border-cyan-600 shadow-lg bg-white';
    textDark = 'text-slate-800';
    textDarkMuted = 'text-slate-500';
    alignment = 'text-center items-center justify-center';
    menuStyle = 'large-cards';
    galleryStyle = 'grid-wide';
  }

  let defaultProducts = [
    { name: 'Truffle Risotto', price: '₹28', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Arborio rice, wild mushrooms, black truffle shavings, parmesan.' },
    { name: 'Pan-Seared Scallops', price: '₹32', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Cauliflower purée, crispy pancetta, micro-greens.' },
    { name: 'Wagyu Ribeye', price: '₹65', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Grade A5 Wagyu, roasted garlic, rosemary reduction.' },
    { name: 'Lobster Ravioli', price: '₹34', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Handmade pasta, Maine lobster, saffron cream sauce.' },
  ];
  let defaultHeroImage = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

  let defaultGallery = [
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
  let defaultServices = [
    { title: 'Fine Dining', description: 'Experience our award-winning seasonal tasting menus crafted by expert chefs.' },
    { title: 'Private Events', description: 'Exclusive, beautifully appointed spaces designed for your most memorable celebrations.' },
    { title: 'Wine Tasting', description: 'Curated pairings and guided tastings led by our master sommelier.' }
  ];

  if (website.theme === 'Casual Eats') {
    defaultHeroImage = 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    defaultProducts = [
      { name: 'Classic Smash Burger', price: '₹14', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Double beef patty, american cheese, house sauce, brioche bun.' },
      { name: 'Loaded Fries', price: '₹9', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Crispy fries topped with melted cheese, bacon, and jalapenos.' },
      { name: 'Spicy Chicken Sandwich', price: '₹15', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Buttermilk fried chicken, spicy slaw, pickles.' },
      { name: 'Vanilla Bean Shake', price: '₹7', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Hand-spun milkshake with real vanilla bean and whipped cream.' },
    ];
    defaultGallery = [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    defaultServices = [
      { title: 'Dine In', description: 'Enjoy our vibrant, high-energy atmosphere with friends and family.' },
      { title: 'Takeout & Delivery', description: 'Fast, fresh, and securely packaged for you to enjoy at home.' },
      { title: 'Catering', description: 'Bring our bold flavors to your next casual get-together or office party.' }
    ];
  } else if (website.theme === 'Bistro') {
    defaultHeroImage = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    defaultProducts = [
      { name: 'Croque Monsieur', price: '₹16', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Classic French ham and cheese sandwich with gruyère and béchamel.' },
      { name: 'French Onion Soup', price: '₹12', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Caramelized onions, beef broth, croutons, melted provolone.' },
      { name: 'Steak Frites', price: '₹29', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Pan-seared flank steak with herb butter and crispy house fries.' },
      { name: 'Crème Brûlée', price: '₹9', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Rich vanilla custard topped with a contrasting layer of hard caramel.' },
    ];
    defaultGallery = [
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    defaultServices = [
      { title: 'Brunch', description: 'A leisurely morning affair featuring fresh pastries and exceptional coffee.' },
      { title: 'Intimate Dinners', description: 'Cozy, dimly-lit corners perfect for romantic evenings or quiet conversations.' },
      { title: 'Patio Seating', description: 'Watch the world go by from our classic, European-style outdoor terrace.' }
    ];
  } else if (website.theme === 'Vegan Cafe') {
    defaultHeroImage = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    defaultProducts = [
      { name: 'Avocado Toast', price: '₹12', image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Sourdough, smashed avocado, cherry tomatoes, micro-greens.' },
      { name: 'Acai Bowl', price: '₹14', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Blended acai, house granola, fresh berries, coconut flakes.' },
      { name: 'Buddha Bowl', price: '₹16', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Quinoa, roasted sweet potato, kale, chickpeas, tahini dressing.' },
      { name: 'Matcha Latte', price: '₹6', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Ceremonial grade matcha with creamy oat milk.' },
    ];
    defaultGallery = [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    defaultServices = [
      { title: 'Plant-Based Menu', description: '100% organic, cruelty-free meals sourced from local farms.' },
      { title: 'Smoothie Bar', description: 'Freshly pressed juices and nutrient-dense smoothies made to order.' },
      { title: 'Community Events', description: 'Join our weekly wellness workshops and yoga sessions.' }
    ];
  } else if (website.theme === 'Seafood Grill') {
    defaultHeroImage = 'https://images.unsplash.com/photo-1502301197179-65228ab57f78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    defaultProducts = [
      { name: 'Grilled Salmon', price: '₹26', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Atlantic salmon, asparagus, lemon butter caper sauce.' },
      { name: 'Oysters on the Half Shell', price: '₹18', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Half-dozen local oysters, mignonette, fresh lemon.' },
      { name: 'Lobster Roll', price: '₹24', image: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Fresh Maine lobster, light mayo, celery, toasted brioche bun.' },
      { name: 'Calamari Fritti', price: '₹14', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Crispy fried squid rings served with house marinara.' },
    ];
    defaultGallery = [
      'https://images.unsplash.com/photo-1502301197179-65228ab57f78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625938146369-adc83368bda7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    defaultServices = [
      { title: 'Fresh Catch Daily', description: 'We source the freshest seafood straight from local fishermen every morning.' },
      { title: 'Raw Bar', description: 'An exquisite selection of oysters, clams, and chilled crustacean platters.' },
      { title: 'Waterfront Dining', description: 'Enjoy spectacular ocean views from our open-air patio.' }
    ];
  }

  let products = content.products_json && content.products_json.length > 0
    ? [...content.products_json]
    : [...defaultProducts];
  
  const galleryImages = content.gallery_json && content.gallery_json.length > 0
    ? [...content.gallery_json]
    : [...defaultGallery];

  const heroImage = content.settings_json?.hero_image || defaultHeroImage;

  return (
    <>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        * {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        ${content.custom_css || ''}
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>
      <div className="bg-[#FAF9F6] min-h-screen font-sans text-slate-800 selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 lg:px-16 py-6 flex items-center justify-between text-white border-b border-white/10">
        <div className="flex items-center gap-2 lg:gap-3">
          {content.settings_json?.logo_image ? (
            <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover shadow-sm" />
          ) : (
            <Utensils size={24} className={`${primaryText} mt-0.5`} />
          )}
          <span className={`text-xl lg:text-2xl font-bold tracking-widest uppercase ${headingFont}`}>{content.settings_json?.website_name || website.slug || 'Restaurant'}</span>
        </div>
        
        <div className="hidden lg:flex gap-10 text-sm font-semibold tracking-wide uppercase">
          {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
            .filter((s: string) => s !== 'hero' && !(content.settings_json?.hidden_sections || []).includes(s))
            .map((s: string) => {
              const names: Record<string, string> = {
                about: 'Our Story',
                services: 'Services',
                menu: 'Menu',
                gallery: 'Gallery',
                contact: 'Contact'
              };
              return (
                <a key={s} href={`#${s}`} className="hover:text-amber-500 transition-colors">
                  {names[s] || s}
                </a>
              );
            })}
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#contact" className="hidden lg:flex font-bold text-sm hover:text-amber-500 transition-colors uppercase tracking-wider">Reservations</a>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-white hover:text-amber-500 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className={`absolute top-[80px] left-0 w-full ${bgDarkSec}/95 backdrop-blur-xl border-b border-white/10 z-40 lg:hidden shadow-2xl flex flex-col px-6 py-8 gap-6 text-center animate-in fade-in slide-in-from-top-4 duration-300`}>
          {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
            .filter((s: string) => s !== 'hero' && !(content.settings_json?.hidden_sections || []).includes(s))
            .map((s: string) => {
              const names: Record<string, string> = {
                about: 'Our Story',
                services: 'Services',
                menu: 'Menu',
                gallery: 'Gallery',
                contact: 'Contact'
              };
              return (
                <a key={s} href={`#${s}`} onClick={() => setMobileMenuOpen(false)} className="text-white font-bold text-lg hover:text-amber-500 transition-colors uppercase tracking-widest">
                  {names[s] || s}
                </a>
              );
            })}
          <div className="w-12 h-px bg-white/20 mx-auto my-2"></div>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`${primaryColor} ${primaryColorHover} text-white px-8 py-3.5 uppercase tracking-widest text-sm font-bold transition-colors mx-auto ${buttonShape}`}>Book a Table</a>
        </div>
      )}
      {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'])
        .filter((s: string) => !(content.settings_json?.hidden_sections || []).includes(s))
        .map((sectionId: string) => {
        if (sectionId === 'hero') return (
          <div id="home" key="hero" className="relative min-h-[100vh] lg:min-h-[85vh] flex items-center justify-center text-center px-6 pt-24 pb-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img loading="lazy" src={heroImage} alt="Restaurant Interior" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-8 lg:mt-16 w-full">
              <div className="flex items-center gap-4 mb-4 lg:mb-6 opacity-90">
                <div className={`w-8 lg:w-12 h-px ${primaryColor}`}></div>
                <span className="text-white uppercase tracking-[0.3em] text-[10px] lg:text-sm font-semibold">Welcome</span>
                <div className={`w-8 lg:w-12 h-px ${primaryColor}`}></div>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.15] mb-6 drop-shadow-2xl px-2 lg:px-4 ${headingFont}`}>
                {content.hero_title || 'A Culinary Experience Like No Other'}
              </h1>
              <p className="text-slate-200 text-sm sm:text-base md:text-xl font-light max-w-2xl leading-relaxed mb-8 lg:mb-12 px-2 lg:px-4">
                {content.hero_description || content.hero_text || 'Immerse yourself in a world of exquisite flavors, crafted with passion and the finest seasonal ingredients.'}
              </p>
              <div className={`flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto px-4 lg:px-6 ${alignment.replace('items-start', 'items-center').replace('text-left', 'justify-start')}`}>
                <a href="#menu" className={`${primaryColor} ${primaryColorHover} text-white px-6 lg:px-8 py-3.5 lg:py-4 uppercase tracking-widest text-xs lg:text-sm font-bold transition-colors text-center shadow-lg w-full sm:w-auto ${buttonShape}`}>
                  View Menu
                </a>
                <a href="#contact" className={`bg-transparent border border-white text-white hover:bg-white hover:text-slate-900 px-6 lg:px-8 py-3.5 lg:py-4 uppercase tracking-widest text-xs lg:text-sm font-bold transition-colors text-center w-full sm:w-auto ${buttonShape}`}>
                  Book a Table
                </a>
              </div>
            </div>
          </div>
        );

        if (sectionId === 'about') return (
          <div id="about" key="about" className={`py-24 lg:py-32 px-6 lg:px-16 ${bgLight}`}>
            <FadeInView>
              <div className={`max-w-4xl mx-auto flex flex-col gap-8 ${alignment}`}>
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-12 h-px ${primaryColor}`}></div>
                <span className={`uppercase tracking-[0.2em] text-sm font-bold ${primaryText}`}>Our Story</span>
                <div className={`w-12 h-px ${primaryColor}`}></div>
              </div>
              <h2 className={`text-2xl sm:text-3xl lg:text-5xl ${textDark} mb-4 leading-tight break-words ${headingFont}`}>
                {content.settings_json?.about_title || 'Tradition Meets Modern Gastronomy'}
              </h2>
              <p className={`${textDarkMuted} text-base lg:text-lg leading-relaxed mb-4 font-light whitespace-pre-wrap`}>
                {content.settings_json?.about_description || 'Founded with a passion for bringing people together over exceptional food, our restaurant is a celebration of local ingredients and global techniques. Every dish tells a story of heritage, innovation, and culinary dedication.'}
              </p>
            </div>
            </FadeInView>
          </div>
        );

        if (sectionId === 'services') return (
          <div id="services" key="services" className={`py-24 lg:py-32 px-6 lg:px-16 ${bgDark} text-white relative`}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center mix-blend-luminosity pointer-events-none"></div>
            <FadeInView>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className={`mb-16 lg:mb-24 flex flex-col ${alignment}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-8 h-px ${primaryColor}`}></div>
                  <span className={`uppercase tracking-[0.2em] text-sm font-bold ${primaryText}`}>Offerings</span>
                  <div className={`w-8 h-px ${primaryColor}`}></div>
                </div>
                <h2 className={`text-2xl sm:text-3xl lg:text-6xl text-white break-words ${headingFont}`}>Our Services</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {(content.services_json && content.services_json.length > 0 ? content.services_json : defaultServices).map((srv: any, idx: number) => {
                  const title = typeof srv === 'string' ? srv : (srv.title || 'Service');
                  const description = typeof srv === 'string' ? '' : (srv.description || '');
                  return (
                    <div key={idx} className={`${bgDarkSec}/50 backdrop-blur-md p-8 lg:p-12 border hover:border-amber-500/50 transition-colors group flex flex-col ${alignment} ${cardShape.replace('bg-white', '').replace('shadow-md', 'shadow-2xl')}`}>
                      <h3 className={`text-xl lg:text-2xl mb-4 font-bold tracking-wide ${headingFont}`}>{title}</h3>
                      <p className="text-slate-400 leading-relaxed font-light text-sm lg:text-base">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            </FadeInView>
          </div>
        );

        if (sectionId === 'menu') return (
          <div id="menu" key="menu" className="py-24 lg:py-32 px-6 lg:px-16 bg-white">
            <FadeInView>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-8 h-px ${primaryColor}`}></div>
                  <span className={`uppercase tracking-[0.2em] text-sm font-bold ${primaryText}`}>Discover</span>
                  <div className={`w-8 h-px ${primaryColor}`}></div>
                </div>
                <h2 className={`text-2xl sm:text-3xl lg:text-6xl text-slate-900 break-words ${headingFont}`}>Our Specialties</h2>
              </div>

              <div className={`grid gap-8 lg:gap-12 ${
                menuStyle === 'classic' || menuStyle === 'grid-cards' || menuStyle === 'minimal-cards' ? 'grid-cols-1 lg:grid-cols-2' : 
                menuStyle === 'minimal-list' ? 'grid-cols-1 max-w-4xl mx-auto w-full' : 'grid-cols-1'
              }`}>
                {products.slice(0, 4).map((item: any, idx: number) => {
                  const imageSrc = item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  if (menuStyle === 'minimal-cards') {
                    return (
                      <div key={idx} onClick={() => setSelectedProduct(item)} className="flex flex-col group cursor-pointer bg-white p-4 pb-8 transition-transform hover:-translate-y-2 duration-500 shadow-sm hover:shadow-2xl border border-stone-100">
                        <div className="w-full h-72 overflow-hidden mb-6 relative">
                          <img loading="lazy" src={imageSrc} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                        </div>
                        <div className="text-center px-4">
                          <h3 className={`text-2xl font-bold mb-3 text-stone-900 ${headingFont}`}>{item.name}</h3>
                          <span className={`text-lg font-semibold tracking-wider ${primaryText}`}>{item.price}</span>
                          <p className="text-stone-500 text-sm mt-4 font-light leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  if (menuStyle === 'grid-cards') {
                    return (
                      <div key={idx} onClick={() => setSelectedProduct(item)} className="flex flex-col bg-slate-50 rounded-[2rem] p-4 lg:p-6 group cursor-pointer hover:shadow-xl transition-all border border-transparent hover:border-slate-200">
                        <div className="w-full h-64 rounded-3xl overflow-hidden mb-6 relative shadow-inner">
                          <img loading="lazy" src={imageSrc} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                        </div>
                        <div className="flex justify-between items-start mb-3 px-2">
                          <h3 className={`text-2xl font-bold text-slate-900 ${headingFont}`}>{item.name}</h3>
                          <span className={`text-xl font-black bg-white px-4 py-1.5 rounded-full shadow-sm ${primaryText}`}>{item.price}</span>
                        </div>
                        <p className="text-slate-500 px-2 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    );
                  }
                  
                  if (menuStyle === 'minimal-list') {
                    return (
                      <div key={idx} onClick={() => setSelectedProduct(item)} className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-lime-100/50 pb-8 pt-6 group cursor-pointer hover:bg-lime-50/20 px-4 sm:px-6 rounded-2xl transition-colors gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                          <div className="w-full sm:w-24 h-56 sm:h-24 lg:w-32 lg:h-32 shrink-0 rounded-2xl sm:rounded-full overflow-hidden shadow-sm border-2 border-white relative">
                            <img loading="lazy" src={imageSrc} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                          </div>
                          <div className="pr-0 sm:pr-4 max-w-2xl flex-1">
                            <div className="flex justify-between items-start sm:block mb-2 sm:mb-3">
                              <h3 className={`text-2xl lg:text-3xl font-medium text-green-950 ${headingFont}`}>{item.name}</h3>
                              <span className={`text-2xl font-bold sm:hidden shrink-0 ${primaryText}`}>{item.price}</span>
                            </div>
                            <p className="text-slate-500 text-sm lg:text-base font-light leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <span className={`hidden sm:block text-2xl lg:text-3xl font-semibold shrink-0 ${primaryText}`}>{item.price}</span>
                      </div>
                    );
                  }
                  
                  if (menuStyle === 'large-cards') {
                    return (
                      <div key={idx} onClick={() => setSelectedProduct(item)} className="flex flex-col md:flex-row bg-slate-900 text-white group cursor-pointer hover:bg-slate-800 transition-colors shadow-2xl">
                        <div className="w-full md:w-5/12 h-72 md:h-auto overflow-hidden relative">
                          <img loading="lazy" src={imageSrc} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-60"></div>
                        </div>
                        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                            <h3 className={`text-3xl font-bold ${headingFont}`}>{item.name}</h3>
                            <span className={`text-2xl font-bold px-4 py-2 bg-slate-800 ${primaryText} inline-block w-max border border-slate-700`}>{item.price}</span>
                          </div>
                          <p className="text-slate-300 text-lg font-light leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Classic Style
                  return (
                    <div key={idx} onClick={() => setSelectedProduct(item)} className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
                      <div className="w-full sm:w-32 h-48 sm:h-32 rounded-full overflow-hidden shrink-0 shadow-lg border-4 border-slate-50 relative bg-slate-200">
                        <img loading="lazy" src={imageSrc} 
                          alt={item.name} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 bg-slate-100" 
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }}
                        />
                        <div className={`absolute inset-0 ${primaryColor} mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300`}></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-baseline mb-3 border-b border-slate-200 border-dashed pb-3">
                          <h3 className={`text-xl sm:text-2xl font-bold text-slate-900 ${headingFont}`}>{item.name}</h3>
                          <span className={`text-xl font-black shrink-0 ml-4 ${primaryText}`}>{item.price || '?0'}</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed italic">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {products.length > 0 && (
                <div className="mt-16 text-center">
                  <button 
                    onClick={() => setShowAllProducts(true)}
                    className={`bg-transparent border-2 border-slate-900 text-slate-900 ${primaryColorHover} hover:text-white hover:border-transparent px-10 py-4 uppercase tracking-widest text-sm font-bold transition-all duration-300 shadow-sm`}
                  >
                    View Full Menu
                  </button>
                </div>
              )}
            </div>
            </FadeInView>
          </div>
        );

        if (sectionId === 'gallery') return (
          <div id="gallery" key="gallery" className={`py-16 lg:py-24 ${bgLightSec}`}>
            <FadeInView>
            <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-12 flex flex-col items-center text-center">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-8 h-px ${primaryColor}`}></div>
                <span className={`uppercase tracking-[0.2em] text-sm font-bold ${primaryText}`}>Atmosphere</span>
                <div className={`w-8 h-px ${primaryColor}`}></div>
              </div>
              <h2 className={`text-2xl sm:text-3xl lg:text-5xl text-slate-900 break-words ${headingFont}`}>Our Gallery</h2>
            </div>
            <div className={`
              ${galleryStyle === 'grid-square' || galleryStyle === 'grid-wide' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0' : ''}
              ${galleryStyle === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6 px-6 lg:px-16 mx-auto max-w-7xl pt-12' : ''}
              ${galleryStyle === 'grid-rounded' ? 'grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8 px-6 lg:px-16 mx-auto max-w-6xl pt-12' : ''}
              ${galleryStyle === 'grid-polaroid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-16 mx-auto max-w-7xl pt-12' : ''}
              ${galleryStyle === 'grid-circles' ? 'flex flex-wrap justify-center gap-8 lg:gap-12 px-6 py-12 pt-16' : ''}
            `}>
              {galleryImages.slice(0, 6).map((img: string, idx: number) => {
                const imageSrc = (img && typeof img === 'string' && img.trim() !== '') ? img : (defaultGallery[idx] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
                
                if (galleryStyle === 'masonry') {
                  return (
                    <div key={idx} className="mb-6 break-inside-avoid relative group overflow-hidden bg-stone-100 cursor-pointer shadow-md" onClick={() => setSelectedImage(imageSrc)}>
                      <img loading="lazy" src={imageSrc} alt={`Gallery ${idx}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                    </div>
                  );
                }
                if (galleryStyle === 'grid-rounded') {
                  return (
                    <div key={idx} className="aspect-[4/3] rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500" onClick={() => setSelectedImage(imageSrc)}>
                      <img loading="lazy" src={imageSrc} alt={`Gallery ${idx}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                    </div>
                  );
                }
                if (galleryStyle === 'grid-polaroid') {
                  return (
                    <div key={idx} className="bg-white p-4 pb-16 shadow-lg border border-stone-200 transform hover:-translate-y-4 hover:rotate-2 transition-all duration-500 cursor-pointer" onClick={() => setSelectedImage(imageSrc)}>
                      <div className="aspect-square w-full overflow-hidden mb-2 bg-stone-100">
                        <img loading="lazy" src={imageSrc} alt={`Gallery ${idx}`} className="w-full h-full object-cover filter sepia-[0.2] hover:sepia-0 transition-all duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                      </div>
                    </div>
                  );
                }
                if (galleryStyle === 'grid-circles') {
                  return (
                    <div key={idx} className="w-48 h-48 lg:w-72 lg:h-72 rounded-full overflow-hidden relative group cursor-pointer shadow-xl hover:shadow-2xl transition-all ring-8 ring-white" onClick={() => setSelectedImage(imageSrc)}>
                      <img loading="lazy" src={imageSrc} alt={`Gallery ${idx}`} className="w-full h-full object-cover transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                    </div>
                  );
                }
                if (galleryStyle === 'grid-wide') {
                  return (
                    <div key={idx} className="aspect-[4/3] lg:aspect-[2/1] relative group overflow-hidden bg-slate-900 cursor-pointer border-r border-slate-800" onClick={() => setSelectedImage(imageSrc)}>
                      <img loading="lazy" src={imageSrc} alt={`Gallery ${idx}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                    </div>
                  );
                }
                
                // Classic Style
                return (
                  <div key={idx} className="aspect-square relative group overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setSelectedImage(imageSrc)}>
                    <img loading="lazy" src={imageSrc} alt={`Gallery ${idx}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Star size={32} className="text-white drop-shadow-lg" />
                    </div>
                  </div>
                );
              })}
            </div>
            </FadeInView>
          </div>
        );

        if (sectionId === 'contact') return (
          <div id="contact" key="contact" className={`relative py-24 lg:py-32 px-6 ${bgDarkSec} text-white overflow-hidden`}>
            <div className="absolute inset-0 z-0 opacity-20">
              <img loading="lazy" src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Restaurant Ambiance" className="w-full h-full object-cover grayscale" />
            </div>
            <FadeInView>
            <div className={`max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${alignment.replace('items-center justify-center', 'items-start text-left').replace('items-start justify-start text-left', 'items-start text-left')}`}>
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-8 h-px ${primaryColor}`}></div>
                  <span className={`uppercase tracking-[0.2em] text-sm font-bold ${primaryText}`}>Get In Touch</span>
                </div>
                <h2 className={`text-3xl sm:text-4xl lg:text-6xl text-white mb-8 break-words hyphens-auto ${headingFont}`}>Contact & Reservations</h2>
                <p className="text-slate-300 leading-relaxed font-light mb-10 text-lg">
                  We would love to hear from you. Whether you have a question about our menu, want to book a private event, or simply wish to reserve a table for an unforgettable evening.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${primaryColor} flex items-center justify-center shrink-0 shadow-lg`}>
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Location</h4>
                      <p className="text-slate-400 font-light">{content.contact_info?.address || '123 Culinary Avenue, Food District, NY 10012'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${primaryColor} flex items-center justify-center shrink-0 shadow-lg`}>
                      <Phone className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone</h4>
                      <p className="text-slate-400 font-light">{content.contact_info?.phone || '+1 (555) 123-4567'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${primaryColor} flex items-center justify-center shrink-0 shadow-lg`}>
                      <Clock className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Hours</h4>
                      <p className="text-slate-400 font-light whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sun: 11:00 AM - 11:00 PM'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${bgDark}/80 backdrop-blur-xl p-8 lg:p-12 border border-white/5 shadow-2xl flex flex-col items-center text-center ${cardShape.replace('bg-white', '')}`}>
                <h3 className={`text-2xl text-white mb-6 ${headingFont}`}>Follow Our Journey</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Stay connected with us on social media for the latest culinary creations, behind-the-scenes moments, and exclusive events.
                </p>
                
                <div className="flex gap-6 mb-10">
                  <a href={content.contact_info?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className={`w-14 h-14 border border-slate-700 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors bg-slate-900 group`} aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href={content.contact_info?.whatsapp || 'https://wa.me/'} target="_blank" rel="noopener noreferrer" className={`w-14 h-14 border border-slate-700 rounded-full flex items-center justify-center hover:border-green-500 hover:text-green-500 hover:bg-green-500/10 transition-colors bg-slate-900 group`} aria-label="WhatsApp">
                    <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href={content.contact_info?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className={`w-14 h-14 border border-slate-700 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10 transition-colors bg-slate-900 group`} aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  </a>
                </div>
              </div>
            </div>
            </FadeInView>
          </div>
        );

        if (sectionId === 'custom' && content.custom_blocks_json && content.custom_blocks_json.length > 0) return (
          <div id="custom" key="custom" className={`py-24 lg:py-32 px-6 lg:px-16 ${bgLight}`}>
            <FadeInView>
            <div className="max-w-4xl mx-auto space-y-8">
              {content.custom_blocks_json.map((block: any) => {
                if (block.type === 'heading') {
                  return <h2 key={block.id} className={`text-4xl lg:text-5xl text-slate-900 leading-tight text-center ${headingFont}`}>{block.content}</h2>;
                }
                if (block.type === 'paragraph') {
                  return <p key={block.id} className="text-slate-600 text-lg leading-relaxed font-light whitespace-pre-wrap text-center">{block.content}</p>;
                }
                if (block.type === 'image') {
                  return block.url ? <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" /> : null;
                }
                if (block.type === 'divider') {
                  return <div key={block.id} className="w-full h-px bg-slate-200 my-12"></div>;
                }
                return null;
              })}
            </div>
            </FadeInView>
          </div>
        );

        return null;
      })}
      
      {/* Reservation / Footer */}
      
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

      <footer className={`${bgDark} text-slate-400 py-16 lg:py-20 px-6 lg:px-16 border-t border-white/5 relative overflow-hidden`}>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
          
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              {content.settings_json?.logo_image ? (
                <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover shadow-sm" />
              ) : (
                <Utensils size={24} className={primaryText} />
              )}
              <span className={`text-xl lg:text-2xl font-bold tracking-widest uppercase text-white ${headingFont}`}>{content.settings_json?.website_name || website.slug || 'Restaurant'}</span>
            </div>
            <p className="text-sm leading-relaxed mb-8">
              Experience dining at its finest. Join us for an unforgettable culinary journey combining tradition and innovation.
            </p>
            <div className="flex gap-4">
              <a href={content.contact_info?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors group" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={content.contact_info?.whatsapp || 'https://wa.me/'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center hover:border-green-500 hover:text-green-500 hover:bg-green-500/10 transition-colors group" aria-label="WhatsApp">
                <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href={content.contact_info?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-slate-800 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10 transition-colors group" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className={`text-white text-lg mb-6 uppercase tracking-wider ${headingFont}`}>Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className={`shrink-0 ${primaryText}`} />
                <span>{content.contact_info?.address || '123 Culinary Avenue, Food District, NY 10012'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className={`shrink-0 ${primaryText}`} />
                <span>{content.contact_info?.phone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className={`shrink-0 ${primaryText}`} />
                <span>{content.contact_info?.email || 'reservations@restaurant.com'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`text-white text-lg mb-6 uppercase tracking-wider ${headingFont}`}>Hours</h4>
            <div className="space-y-3 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {content.contact_info?.hours || 'Mon - Thu: 11:00 AM - 10:00 PM\nFri - Sat: 11:00 AM - 11:30 PM\nSunday: 10:00 AM - 9:00 PM'}
            </div>
          </div>

          <div>
            <h4 className={`text-white text-lg mb-6 uppercase tracking-wider ${headingFont}`}>Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600 text-white w-full" />
              <button className={`${primaryColor} ${primaryColorHover} px-4 py-3 text-white transition-colors`}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-sm text-center flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>&copy; {new Date().getFullYear()} {content.settings_json?.website_name || website.slug || 'Restaurant'}. All rights reserved.</p>
            <span className="hidden md:inline-block text-slate-700">|</span>
            <p className="text-slate-500">Powered by <span className="font-bold text-slate-300 tracking-wider">Jaalam</span></p>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

    </div>

      {/* Lightbox Modal */}
      

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`bg-white text-slate-900 w-full max-w-sm overflow-hidden shadow-2xl flex flex-col border ${
              cardShape.replace('bg-white', '').replace('shadow-md', '').replace('shadow-xl', '')
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image section */}
            <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
              <img loading="lazy" src={selectedProduct.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }}
              />
              <button 
                onClick={() => setSelectedProduct(null)}
                className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 p-2.5 shadow-md transition-all active:scale-95 z-20 ${
                  buttonShape.includes('rounded-full') ? 'rounded-full' : buttonShape.includes('rounded-md') ? 'rounded-md' : buttonShape.includes('rounded-2xl') ? 'rounded-2xl' : 'rounded-none'
                }`}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content section */}
            <div className="p-5 lg:p-6 space-y-4">
              <div>
                <h3 className={`text-xl lg:text-2xl font-bold leading-tight mb-2 ${textDark} ${headingFont}`}>
                  {selectedProduct.name}
                </h3>
                
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-base lg:text-lg font-bold px-4 py-1.5 text-white ${primaryColor} ${
                    buttonShape.includes('rounded-full') ? 'rounded-full' : buttonShape.includes('rounded-md') ? 'rounded-md' : buttonShape.includes('rounded-2xl') ? 'rounded-2xl' : 'rounded-none'
                  }`}>
                    {selectedProduct.price}
                  </span>
                  
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1.5 shadow-inner">
                    <Star size={14} className={`${primaryText} fill-current`} />
                    <span className="text-slate-800 text-sm font-bold">4.8</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description</h4>
                <p className={`${textDarkMuted} font-light text-sm leading-relaxed`}>
                  {selectedProduct.description || 'No description available for this item. Crafted fresh daily with the finest seasonal ingredients.'}
                </p>
              </div>

              <div className="w-full mt-4"><ProductBuyButton product={selectedProduct} content={content} /></div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Policy Modals */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white text-slate-900 w-full max-w-2xl max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className={`text-xl font-black ${headingFont}`}>{activeModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 lg:p-10 overflow-y-auto whitespace-pre-wrap leading-relaxed text-slate-600 text-sm font-sans">
              {activeModal === 'privacy' ? (
                "This Privacy Policy outlines how your personal information is collected, used, and shared when you visit our website.\n\n" +
                "1. Information We Collect\n" +
                "When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.\n\n" +
                "2. How We Use Your Information\n" +
                "We use the Order Information that we collect generally to fulfill any reservations or orders placed through the Site (including processing your payment information and providing you with order confirmations).\n\n" +
                "3. Sharing Your Personal Information\n" +
                "We share your Personal Information with third parties to help us use your Personal Information, as described above. We may also share your Personal Information to comply with applicable laws and regulations."
              ) : (
                "These Terms of Service govern your use of our website and services. By accessing or using the Service, you agree to be bound by these Terms.\n\n" +
                "1. General Conditions\n" +
                "We reserve the right to refuse service to anyone for any reason at any time. You understand that your content may be transferred unencrypted and involve transmissions over various networks.\n\n" +
                "2. Accuracy of Information\n" +
                "We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only.\n\n" +
                "3. Modifications to the Service\n" +
                "Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time."
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </>
  );
}

