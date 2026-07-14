import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Layout,
  Smartphone,
  QrCode,
  Sparkles,
  Check,
  ChevronDown,
  Star,
  Zap,
  Play,
  Globe,
  MapPin,
  Clock,
  Phone,
  ArrowUpRight,
  Eye,
  Settings,
  Layers,
  Search,
  Menu,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ScrollStack, { ScrollStackItem } from '../../components/ui/ScrollStack';
import InfiniteMenu from '../../components/ui/InfiniteMenu';
import ShinyText from '../../components/ui/ShinyText';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

// FAQ Drawer Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 text-left font-medium text-base sm:text-lg text-[#1a1a1a] hover:text-black transition-colors group"
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#888888] group-hover:text-[#1a1a1a]"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[#555555] pb-4 pr-6 leading-relaxed text-sm sm:text-base font-light">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3D Tilt Card Wrapper
function ThreeDTiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`transition-all duration-300 ease-out ${className}`}
    >
      <div style={{ transform: "translateZ(20px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  // Simulator states
  const [businessName, setBusinessName] = useState('Bella Vita Cafe');
  const [industry, setIndustry] = useState<'salon' | 'cafe' | 'restaurant' | 'gym'>('cafe');
  const [accentColor, setAccentColor] = useState<'purple' | 'rose' | 'emerald' | 'amber'>('amber');
  const [layoutStyle, setLayoutStyle] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [simulatorTab, setSimulatorTab] = useState<'home' | 'services' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Accent Color Mapping
  const colorMap = {
    purple: {
      bg: 'bg-indigo-600',
      gradient: 'from-indigo-600 to-violet-600',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
      lightBg: 'bg-indigo-950/20',
      pill: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    rose: {
      bg: 'bg-rose-600',
      gradient: 'from-rose-600 to-pink-600',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      lightBg: 'bg-rose-950/20',
      pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    emerald: {
      bg: 'bg-emerald-600',
      gradient: 'from-emerald-600 to-teal-600',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      lightBg: 'bg-emerald-950/20',
      pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-500',
      gradient: 'from-amber-500 to-orange-500',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      lightBg: 'bg-amber-950/20',
      pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    }
  };

  const selectedAccent = colorMap[accentColor];

  // Industry Template Content
  const industryContent = {
    cafe: {
      slogan: 'Brewed to perfection, served with warmth.',
      desc: 'Discover artisanal pastries, masterfully roasted coffee, and a cozy local atmosphere.',
      services: [
        { name: 'Specialty Espresso', price: '$4.50', desc: 'Single-origin beans pulled with precision.' },
        { name: 'Artisanal Croissant', price: '$3.75', desc: 'Flaky, buttery pastries baked fresh every morning.' },
        { name: 'Organic Cold Brew', price: '$5.00', desc: 'Steeped for 18 hours for maximum smoothness.' },
      ],
      address: '42 Bean Street, Seattle, WA',
      hours: 'Mon-Sun: 7am - 6pm',
      tagline: 'Fresh Brews Daily',
      bgImgGradient: 'from-zinc-900/80 to-zinc-950/95',
    },
    salon: {
      slogan: 'Your hair, your style, your confidence.',
      desc: 'Expert stylists dedicated to highlighting your unique beauty with professional hair care and luxury treatments.',
      services: [
        { name: 'Designer Haircut', price: '$65+', desc: 'Precision cut, wash, blowout, and style consultation.' },
        { name: 'Balayage & Color', price: '$120+', desc: 'Natural-looking hand-painted highlights by our master colorists.' },
        { name: 'Luxury Deep Treatment', price: '$45+', desc: 'Hydrating mask with head message and steam therapy.' },
      ],
      address: '102 Glow Ave, Suite B, Beverly Hills, CA',
      hours: 'Tue-Sat: 9am - 7pm',
      tagline: 'Luxury Hair Care',
      bgImgGradient: 'from-zinc-900/80 to-zinc-950/95',
    },
    restaurant: {
      slogan: 'Authentic taste, unforgettable memories.',
      desc: 'A culinary journey featuring handcrafted seasonal recipes, locally-sourced ingredients, and fine wines.',
      services: [
        { name: 'Wood-Fired Pizza', price: '$18.00', desc: 'San Marzano tomatoes, fresh mozzarella, and aromatic basil.' },
        { name: 'Handmade Pappardelle', price: '$22.00', desc: 'Rich wild boar ragù topped with aged Parmigiano-Reggiano.' },
        { name: 'Seared Octopus', price: '$26.00', desc: 'Fingerling potatoes, Spanish chorizo, and saffron aioli.' },
      ],
      address: '88 Culinary Row, New York, NY',
      hours: 'Mon-Sun: 5pm - 10pm',
      tagline: 'Artisanal Dining',
      bgImgGradient: 'from-zinc-900/80 to-zinc-950/95',
    },
    gym: {
      slogan: 'Transform your body, elevate your mind.',
      desc: 'State-of-the-art facilities, elite coaching staff, and an inspiring community to help you crush your fitness goals.',
      services: [
        { name: 'All-Access Pass', price: '$79/mo', desc: 'Unlimited access to weight room, cardio, and lockers.' },
        { name: 'Elite Personal Training', price: '$60/hr', desc: 'Custom nutrition plan and 1-on-1 coaching sessions.' },
        { name: 'Group HIIT Class', price: '$15/class', desc: 'High-intensity interval training designed to burn maximum fat.' },
      ],
      address: '500 Ironworks Road, Austin, TX',
      hours: '24/7 Access for Members',
      tagline: 'Elite Performance',
      bgImgGradient: 'from-zinc-900/80 to-zinc-950/95',
    }
  };

  const currentContent = industryContent[industry];

  const handleIndustryChange = (ind: 'salon' | 'cafe' | 'restaurant' | 'gym') => {
    setIndustry(ind);
    if (ind === 'salon') setAccentColor('rose');
    else if (ind === 'cafe') setAccentColor('amber');
    else if (ind === 'restaurant') setAccentColor('purple');
    else if (ind === 'gym') setAccentColor('emerald');
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf6f0] font-sans antialiased overflow-x-hidden relative">

      {/* New Peach Hero Section */}
      <section className="relative w-full h-[100vh] min-h-[850px] md:min-h-[700px] overflow-hidden bg-gradient-to-br from-[#e49b6b] to-[#d08757] flex flex-col font-sans">
        {/* Right side large concentric circles - Animated & Layered */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 md:left-auto md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:right-[-20%] w-[600px] md:w-[1200px] h-[600px] md:h-[1200px] rounded-full z-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] bg-gradient-to-tr from-[#cf8553] to-[#e49b6b]"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 md:left-auto md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:right-[-10%] w-[450px] md:w-[900px] h-[450px] md:h-[900px] rounded-full z-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.15),0_20px_50px_rgba(0,0,0,0.2)] bg-gradient-to-tr from-[#c27a48] to-[#e49b6b]"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 md:left-auto md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:right-[5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full z-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.2),0_30px_60px_rgba(0,0,0,0.3)] bg-gradient-to-tr from-[#b86938] to-[#e49b6b]"
        ></motion.div>

        {/* Mobile White Background Top Half */}
        <div className="md:hidden absolute top-0 left-0 w-full h-[58%] bg-[#fbf6f0] z-10 rounded-b-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]"></div>

        {/* Desktop White wavy shape on the left with drop shadow */}
        <svg
          className="hidden md:block absolute top-0 left-0 h-full w-[75%] lg:w-[65%] z-10"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          fill="#fbf6f0"
          style={{ filter: 'drop-shadow(20px 0px 25px rgba(0,0,0,0.15))' }}
        >
          <path d="M0,0 L60,0 C80,0 80,30 65,45 C50,60 80,75 75,100 L0,100 Z" />
        </svg>

        {/* Floating Hero Mockup Card */}
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[82%] md:top-1/2 left-1/2 md:left-auto -translate-x-1/2 md:-translate-x-0 -translate-y-1/2 right-auto md:right-[5%] lg:right-[12%] w-[220px] md:w-[280px] lg:w-[320px] aspect-[4/5] bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-3 shadow-[0_40px_80px_rgba(0,0,0,0.3)] z-30"
        >
          <div className="w-full h-full rounded-[20px] overflow-hidden relative shadow-inner bg-black">
            <img loading="lazy" src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&h=800&q=80"
              alt="Storefront mockup"
              className="w-full h-full object-cover opacity-90"
            />

            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent"></div>

            <div className="absolute top-3 left-0 w-full px-5 flex justify-between items-center text-white">
              <span className="text-[10px] font-bold font-mono">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-2 rounded-[2px] bg-white"></div>
                <div className="w-2.5 h-2 rounded-[2px] bg-white"></div>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
              <h3 className="text-black font-extrabold text-sm tracking-tight">Bistro Cafe Demo</h3>
              <p className="text-gray-500 text-[10px] mt-1 font-medium leading-relaxed">A perfectly structured layout generated in clicks.</p>
              <button className="mt-3 w-full bg-gradient-to-r from-[#e49b6b] to-[#d08757] text-white text-[10px] font-bold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-opacity uppercase tracking-wider">Preview Site</button>
            </div>
          </div>
        </motion.div>

        {/* Floating 3D Spheres */}
        <div className="absolute top-[65%] right-[15%] md:top-[20%] md:left-[35%] w-[50px] md:w-[70px] h-[50px] md:h-[70px] rounded-full z-20 shadow-[0_15px_30px_rgba(180,100,50,0.5)]" style={{ background: 'radial-gradient(circle at 35% 35%, #fce2c6 0%, #e69d6b 40%, #b86938 100%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-[#d08757] shadow-inner opacity-60"></div>
        </div>

        <div className="absolute bottom-[5%] left-[20%] md:bottom-[20%] md:left-[55%] w-[60px] md:w-[90px] h-[60px] md:h-[90px] rounded-full z-20 shadow-[0_20px_40px_rgba(180,100,50,0.6)]" style={{ background: 'radial-gradient(circle at 35% 35%, #fce2c6 0%, #e69d6b 40%, #b86938 100%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 rounded-full bg-[#d08757] shadow-inner opacity-60"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 w-full flex justify-between items-center px-6 md:px-12 py-6 md:py-8">
          <div className="flex items-center gap-12 md:gap-40 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3 cursor-pointer">
              <img loading="lazy" src="/logo.png" alt="Jaalam Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span className="font-extrabold text-[#1a1a1a] tracking-tight text-lg md:text-xl uppercase mt-1">JAALAM</span>
            </div>
            
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#1a1a1a] p-2 z-50">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center gap-12 text-sm font-semibold text-[#1a1a1a]">
              <a href="#simulator" className="hover:opacity-70 transition-opacity">Try</a>
              <a href="#faq" className="hover:opacity-70 transition-opacity">FAQ</a>
              <button className="hover:opacity-70 transition-opacity">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-bold">
            <Link to="/login" className="text-[#1a1a1a] hover:opacity-70 transition-opacity px-4">Log in</Link>
            <Link to="/register" className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-md">Get Started</Link>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-2xl flex flex-col p-8 gap-6 z-40 md:hidden"
              >
                <a href="#simulator" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-[#1a1a1a]">Try Simulator</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-[#1a1a1a]">FAQ</a>
                <div className="h-[1px] w-full bg-black/10 my-2"></div>
                <Link to="/login" className="text-xl font-bold text-[#1a1a1a]">Log in</Link>
                <Link to="/register" className="bg-[#1a1a1a] text-center text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-md">Get Started</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Content */}
        <div className="relative z-30 flex-1 flex flex-col justify-start md:justify-center px-6 pt-12 md:pt-0 md:px-16 max-w-2xl mt-4 md:mt-[-5%]">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#1a1a1a] leading-[1.1] mb-8 md:mb-12 tracking-tight font-display"
          >
            Creative.<br />Site Builder
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-stretch gap-6 md:gap-8 h-[120px] md:h-[140px] relative ml-14 md:ml-16 mt-4"
          >
            {/* Vertical Line */}
            <div className="w-[2px] bg-[#1a1a1a] h-full shrink-0"></div>

            {/* Rotated Text */}
            <span className="absolute -left-[54px] top-1/2 -translate-y-1/2 -rotate-90 text-[11px] uppercase font-bold tracking-[0.2em] text-[#1a1a1a]">
              Creative
            </span>

            <div className="flex flex-col justify-between py-1">
              <p className="text-[#1a1a1a] text-sm md:text-base max-w-[280px] leading-relaxed font-semibold">
                Build your business website in minutes. No coding. Professional and fast.
              </p>

              <div className="text-[#1a1a1a] font-extrabold text-sm tracking-wide">
                4K — LAYOUT
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-20 bg-[#fbf6f0] border-t border-b border-[#e49b6b]/20 px-6 relative">
        <div className="container mx-auto max-w-7xl relative z-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">
              <ShinyText text="✨ Live Interactive Sandbox" speed={3} color="#a1a1aa" shineColor="#1a1a1a" />
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-[#1a1a1a]">
              Try the design engine.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#555555] text-sm sm:text-base leading-relaxed">
              Adjust variables inside the builder panel and watch the mock mobile device compile structural changes in real time.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Input Controls */}
            <div className="lg:col-span-5 bg-white border border-[#e49b6b]/30 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-[#e49b6b]/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#fbf6f0]">
                  <h3 className="text-sm font-bold tracking-wider uppercase text-[#1a1a1a] font-mono flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#e49b6b]" />
                    Builder Controls
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Compiled Live
                  </span>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2 font-mono">
                    1. Brand Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    maxLength={32}
                    className="w-full bg-[#fbf6f0] border border-[#e49b6b]/30 rounded-lg px-3.5 py-2.5 text-[#1a1a1a] font-medium focus:outline-none focus:border-[#e49b6b] transition-all text-sm font-mono"
                    placeholder="E.g. Vintage Salon"
                  />
                </div>

                {/* Category Toggles */}
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2.5 font-mono">
                    2. Industry Archetype
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cafe', name: 'Cafe', icon: '☕' },
                      { id: 'salon', name: 'Salon', icon: '💅' },
                      { id: 'restaurant', name: 'Restaurant', icon: '🍕' },
                      { id: 'gym', name: 'Gym', icon: '💪' },
                    ].map((ind) => (
                      <button
                        key={ind.id}
                        onClick={() => handleIndustryChange(ind.id as any)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border font-medium text-xs text-left transition-all font-mono ${industry === ind.id
                          ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white font-bold'
                          : 'bg-transparent border-[#e49b6b]/30 text-[#555555] hover:border-[#e49b6b]/60 hover:text-[#1a1a1a]'
                          }`}
                      >
                        <span className="text-xs">{ind.icon}</span>
                        <span>{ind.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2.5 font-mono">
                    3. Theme Accent
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'amber', class: 'bg-amber-500', name: 'Amber' },
                      { id: 'rose', class: 'bg-rose-500', name: 'Rose' },
                      { id: 'purple', class: 'bg-indigo-500', name: 'Violet' },
                      { id: 'emerald', class: 'bg-emerald-500', name: 'Emerald' },
                    ].map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setAccentColor(col.id as any)}
                        title={col.name}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${col.class} ${accentColor === col.id
                          ? 'ring-2 ring-offset-2 ring-offset-white ring-[#1a1a1a] scale-105 shadow-md'
                          : 'opacity-60 hover:opacity-100'
                          }`}
                      >
                        {accentColor === col.id && (
                          <Check className="w-4 h-4 text-white font-bold" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Layout Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2.5 font-mono">
                    4. Theme Layout
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['classic', 'modern', 'minimal'].map((layout) => (
                      <button
                        key={layout}
                        onClick={() => setLayoutStyle(layout as any)}
                        className={`px-3 py-2 rounded-lg border font-medium text-xs text-center transition-all capitalize font-mono ${layoutStyle === layout
                          ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white font-bold'
                          : 'bg-transparent border-[#e49b6b]/30 text-[#555555] hover:border-[#e49b6b]/60 hover:text-[#1a1a1a]'
                          }`}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Callout */}
              <div className="mt-8 pt-6 border-t border-[#fbf6f0]">
                <Link
                  to="/register"
                  className="w-full py-3 bg-[#e49b6b] hover:bg-[#d98b5a] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-md shadow-[#e49b6b]/20"
                >
                  <span>Build This Site Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-center block text-[10px] text-[#555555] mt-3 font-mono">
                  Cloud hosting & custom domain included.
                </span>
              </div>
            </div>

            {/* Mobile Mockup Showcase */}
            <div className="lg:col-span-7 flex justify-center items-center">

              {/* iPhone Minimalist Bezel */}
              <div className="w-[310px] sm:w-[330px] aspect-[9/16] bg-white rounded-[2.5rem] border-4 border-zinc-200 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-zinc-200/50">

                {/* Phone Speaker Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-100 rounded-b-xl z-40 flex justify-center items-start">
                  <div className="w-10 h-0.5 bg-zinc-300 rounded-full mt-1.5" />
                </div>

                {/* Status Bar */}
                <div className="h-8 bg-zinc-50 px-5 flex justify-between items-end pb-1 text-[9px] font-mono text-zinc-400 select-none z-30">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1.5 bg-zinc-400 rounded-xs inline-block" />
                  </div>
                </div>

                {/* Content Frame */}
                <div className="flex-1 flex flex-col bg-white overflow-y-auto scrollbar-hide relative text-left">

                  {/* Category Image Header */}
                  <div className={`relative flex flex-col justify-between p-4 shrink-0 border-zinc-100 overflow-hidden ${layoutStyle === 'classic' ? 'h-40 border-b' :
                    layoutStyle === 'modern' ? 'h-48 border-none' :
                      'h-32 border-b'
                    }`}>
                    {layoutStyle === 'classic' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/98 z-0" />
                    )}
                    {layoutStyle === 'modern' && (
                      <div className={`absolute inset-0 opacity-10 ${selectedAccent.bg} z-0`} />
                    )}

                    {/* Mini Brand Navigation */}
                    <div className="flex justify-between items-center z-10">
                      <span className={`font-bold tracking-tight text-[#1a1a1a] max-w-[130px] truncate ${layoutStyle === 'modern' ? 'text-sm' : 'text-[10px]'
                        }`}>
                        {businessName || 'My Website'}
                      </span>
                      {layoutStyle !== 'minimal' && (
                        <span className={`text-[7px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${layoutStyle === 'modern' ? 'bg-black/10 border-transparent text-[#1a1a1a]' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                          }`}>
                          {industry}
                        </span>
                      )}
                    </div>

                    {/* Hero Slogan */}
                    <div className="z-10 mt-auto">
                      {layoutStyle !== 'minimal' && (
                        <span className={`text-[8px] font-mono font-bold uppercase ${layoutStyle === 'modern' ? 'text-[#1a1a1a]/80' : selectedAccent.text
                          } block mb-0.5`}>
                          {currentContent.tagline}
                        </span>
                      )}
                      <h4 className={`text-[#1a1a1a] leading-tight font-display tracking-tight ${layoutStyle === 'modern' ? 'text-xl font-black' :
                        layoutStyle === 'minimal' ? 'text-xs font-medium' :
                          'text-sm font-bold'
                        }`}>
                        {currentContent.slogan}
                      </h4>
                    </div>
                  </div>

                  {/* Local Tab bar */}
                  <div className="flex bg-white border-b border-zinc-100 sticky top-0 z-20">
                    {(['home', 'services', 'contact'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSimulatorTab(tab)}
                        className={`flex-1 text-center py-2 text-[9px] font-bold tracking-wider uppercase border-b transition-colors font-mono ${simulatorTab === tab
                          ? `border-[#1a1a1a] text-[#1a1a1a]`
                          : 'border-transparent text-[#888888] hover:text-[#1a1a1a]'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Render content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <AnimatePresence mode="wait">
                      {simulatorTab === 'home' && (
                        <motion.div
                          key="home"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-4 text-xs font-light text-[#555555] leading-relaxed"
                        >
                          <p>{currentContent.desc}</p>

                          {/* CTA Card */}
                          <div className={`p-4 relative overflow-hidden ${layoutStyle === 'modern' ? `rounded-3xl border-none ${selectedAccent.bg}` :
                            layoutStyle === 'minimal' ? 'rounded-none border-y border-zinc-200 bg-transparent py-4 px-0' :
                              'rounded-xl border border-zinc-200 bg-zinc-50'
                            }`}>
                            <h5 className={`font-bold mb-1 text-[11px] font-mono ${layoutStyle === 'modern' ? 'text-black' : 'text-[#1a1a1a]'}`}>Reserve a Spot</h5>
                            <p className={`text-[9px] mb-3 leading-normal ${layoutStyle === 'modern' ? 'text-black/70 font-medium' : 'text-[#555555]'}`}>Schedule appointments or reservations directly on our website.</p>
                            <button className={`w-full py-1.5 text-[9px] font-bold transition-colors ${layoutStyle === 'modern' ? 'bg-black text-white rounded-full' :
                              layoutStyle === 'minimal' ? 'bg-transparent border border-zinc-300 text-black rounded-sm hover:bg-zinc-100' :
                                'bg-[#1a1a1a] hover:bg-black text-white rounded'
                              }`}>
                              Book Instantly
                            </button>
                          </div>

                          {/* Quick Info Blocks */}
                          <div className="space-y-1.5 text-[9px] text-[#555555] bg-zinc-50 p-3 rounded-lg border border-zinc-200 font-mono">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-[#888888]" />
                              <span>{currentContent.hours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-[#888888]" />
                              <span className="truncate">{currentContent.address}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {simulatorTab === 'services' && (
                        <motion.div
                          key="services"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-3"
                        >
                          <h5 className="text-[10px] font-bold text-[#888888] uppercase tracking-wider font-mono">Menu / Offerings</h5>
                          <div className="space-y-2">
                            {currentContent.services.map((srv, idx) => (
                              <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex justify-between items-start gap-4">
                                <div>
                                  <span className="text-[10px] font-bold text-[#1a1a1a] block">{srv.name}</span>
                                  <span className="text-[8px] text-[#555555] block leading-tight mt-0.5">{srv.desc}</span>
                                </div>
                                <span className={`text-[10px] font-bold ${selectedAccent.text} shrink-0`}>
                                  {srv.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {simulatorTab === 'contact' && (
                        <motion.div
                          key="contact"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-4"
                        >
                          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex flex-col items-center text-center">
                            <div className="bg-white p-2 rounded-lg mb-3 shadow-sm border border-zinc-200">
                              <QRCodeSVG
                                value={`https://jaalam.com/${industry}/${encodeURIComponent(businessName)}`}
                                size={80}
                                level="M"
                              />
                            </div>
                            <span className="text-[9px] font-bold text-[#1a1a1a] block mb-0.5 font-mono">Storefront QR Code</span>
                            <span className="text-[8px] text-[#555555] block max-w-[170px] leading-snug font-light">
                              Download this code to put on doors, table stands, or flyers.
                            </span>
                          </div>

                          <div className="space-y-1.5 bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-[9px] font-mono text-[#555555]">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-[#888888]" />
                              <span>(555) 019-2834</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-3 h-3 text-[#888888]" />
                              <span className="truncate">contact@{businessName.toLowerCase().replace(/\s+/g, '')}.com</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom home indicator line */}
                <div className="h-4 bg-zinc-50 flex justify-center items-center shrink-0 z-30 select-none">
                  <div className="w-20 h-0.5 bg-zinc-300 rounded-full" />
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>



      {/* Interactive 3D Showcase Gallery */}
      <section className="py-24 border-t border-[#e49b6b]/20 bg-white/40 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">
              <ShinyText text="✨ Infinite Exploration" speed={3} color="#a1a1aa" shineColor="#1a1a1a" />
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-[#1a1a1a]">
              Stunning aesthetic presets.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#555555] text-sm sm:text-base font-light">
              Drag, rotate, and interact with our 3D sphere gallery containing real storefront theme layouts.
            </motion.p>
          </motion.div>

          <div className="w-full max-w-4xl mx-auto border border-zinc-200 bg-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl relative overflow-hidden group select-none">
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[80%] bg-[#e49b6b]/20 rounded-full mix-blend-multiply blur-3xl opacity-50 pointer-events-none"></div>

            <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl bg-white/80 border border-zinc-200/50">
              <InfiniteMenu
                items={[
                  { image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Bistro', description: 'Warm, appetizing layout style.' },
                  { image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Retail Boutique', description: 'Elegant fashion storefront.' },
                  { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Fitness Gym', description: 'High-energy, bold designs.' },
                  { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Luxury Villas', description: 'Premium property listings.' },
                  { image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Eco & Scrap', description: 'Clean eco-friendly grids.' },
                  { image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Stationery', description: 'Playful, creative showcases.' },
                  { image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Fine Dining', description: 'Exquisite culinary presentations.' },
                  { image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Casual Eats', description: 'Relaxed and inviting design.' },
                  { image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Cozy Cafe', description: 'Comfortable coffee shop vibes.' },
                  { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Modern Bakery', description: 'Fresh and clean aesthetics.' },
                  { image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Artisan', description: 'Handcrafted premium look.' },
                  { image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Classic Barbershop', description: 'Vintage grooming style.' },
                  { image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Modern Saloon', description: 'Sleek beauty layouts.' },
                  { image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Vintage Barber', description: 'Retro aesthetic for men.' },
                  { image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Royal Saloon', description: 'Luxurious pampering design.' },
                  { image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Glamour Beauty', description: 'High-end cosmetics shop.' },
                  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Zen Yoga Studio', description: 'Peaceful and calm layouts.' },
                  { image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'CrossFit Box', description: 'Intense workout energy.' },
                  { image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Luxury Health Club', description: 'Premium wellness center.' },
                  { image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Combat & MMA Gym', description: 'Fierce and dark themes.' },
                  { image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Urban Apartments', description: 'Modern city living.' },
                  { image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Commercial Real Estate', description: 'Business property listings.' },
                  { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Modern Homes', description: 'Clean architecture.' },
                  { image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Minimalist Real Estate', description: 'Less is more.' },
                  { image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Classic Estates', description: 'Traditional home layouts.' },
                  { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Minimalist Retail', description: 'Sleek product showcases.' },
                  { image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Streetwear', description: 'Urban fashion edge.' },
                  { image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Tech Gadgets', description: 'Futuristic product pages.' },
                  { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Organic Store', description: 'Natural and earthy tones.' },
                  { image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Playful Books', description: 'Fun and colorful.' },
                  { image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Minimal Stationery', description: 'Clean desk setups.' },
                  { image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Ethereal Designs', description: 'Soft and dreamy layouts.' },
                  { image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Modern Books', description: 'Contemporary reading.' },
                  { image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Fancy Boutique', description: 'Chic and stylish.' },
                  { image: 'https://images.unsplash.com/photo-1600164318933-2ebf454c502f?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Minimal Fancy', description: 'Understated elegance.' },
                  { image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Luxury Fancy', description: 'Opulent and grand.' },
                  { image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Playful Fancy', description: 'Vibrant and energetic.' },
                  { image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Classic Fancy', description: 'Timeless and refined.' },
                  { image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Noir Fancy', description: 'Dark and sophisticated.' },
                  { image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Pop Fancy', description: 'Bold and eye-catching.' },
                  { image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Modern Butcher', description: 'Clean lines for meat stalls.' },
                  { image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Playful Butchers', description: 'Approachable and friendly.' },
                  { image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&h=600&q=80', link: '/register', title: 'Rustic Butchers', description: 'Traditional market feel.' }
                ]}
                scale={0.8}
              />
            </div>

            <div className="flex items-center justify-between mt-4 px-2 text-xs text-[#888888] font-mono">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#888888]" /> Click and drag sphere to rotate</span>
              <span>Jaalam Core Engine v2.0</span>
            </div>
          </div>

        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 relative border-t border-[#e49b6b]/20 bg-[#fbf6f0]">
        <div className="container mx-auto max-w-7xl">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3"><ShinyText text="✨ Owner Feedback" speed={3} color="#a1a1aa" shineColor="#1a1a1a" /></motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-[#1a1a1a]">
              Trusted by store owners.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#555555] text-sm sm:text-base font-light">
              Hear how other local entrepreneurs generated storefront layouts and QR menus in clicks.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Jaalam changed the game for us. I put the QR code on our tables, and now customers can scan it to browse our menu. Setup literally took a minute.",
                author: "Marco S.",
                role: "Owner, Bella Vita Cafe",
                rating: 5
              },
              {
                quote: "I'm not tech-savvy at all, but I got my website running in under a minute. Our booking calls have doubled since putting the QR code on our store window!",
                author: "Sarah L.",
                role: "Lead Stylist, Glow Hair Salon",
                rating: 5
              },
              {
                quote: "Clean, fast, and works perfectly on mobile. The automatic QR code is brilliant for onboarding gym members and displaying fitness plans.",
                author: "David K.",
                role: "Founder, IronGym Seattle",
                rating: 5
              }
            ].map((tst, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                whileHover={{
                  y: -5,
                  borderColor: 'rgba(228, 155, 107, 0.4)',
                  boxShadow: '0 10px 25px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
                }}
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between transition-all duration-300 cursor-default"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(tst.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#e49b6b] fill-[#e49b6b]" />
                    ))}
                  </div>
                  <p className="text-[#1a1a1a] italic text-sm leading-relaxed mb-6 font-medium">
                    "{tst.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 font-mono">
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6f0] flex items-center justify-center text-[10px] font-bold text-[#1a1a1a] uppercase">
                    {tst.author.slice(0, 2)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#1a1a1a] block">{tst.author}</span>
                    <span className="text-[9px] text-[#888888] block font-light">{tst.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-24 px-6 border-t border-[#e49b6b]/20 bg-white relative">
        <div className="container mx-auto max-w-4xl">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3"><ShinyText text="✨ Support" speed={3} color="#a1a1aa" shineColor="#1a1a1a" /></motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-[#1a1a1a]">
              Questions & answers.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#555555] text-sm font-light">
              Clear details on pricing, setup, hosting, and domains.
            </motion.p>
          </motion.div>

          <div className="bg-[#fbf6f0] border border-zinc-200 rounded-2xl p-6 sm:p-10 space-y-2">
            <FAQItem
              question="How does Jaalam build a website in 60 seconds?"
              answer="Jaalam hosts pre-structured layouts tailored for local storefronts. You type in your location details, pricing, and operating times, and our compiler automatically shapes a lightweight, custom-themed website. No database configurations or coding required."
            />
            <FAQItem
              question="Do I need to pay for web hosting or domain registration?"
              answer="No. All accounts include secure cloud hosting on our global edge CDN network. You receive a free customizable subdomain (myjaalam.com/business). We maintain SSL certificates, server upkeep, and loading speeds out-of-the-box."
            />
            <FAQItem
              question="What is the purpose of the storefront QR code?"
              answer="The storefront QR code links offline visitors to your digital details. Print and display it on table stands, entry doors, or registers. When clients scan the code, they instantly see menu items, price lists, or booking details on their phones."
            />
            <FAQItem
              question="Can I customize details or upload menu/service items later?"
              answer="Yes. We provide a clean, simple Admin Dashboard. You can modify hours, swap pictures, add or delete pricing tiers, change social links, and rearrange text blocks. Everything updates on the public page in real-time."
            />
            <FAQItem
              question="Are these websites optimized for search engines (SEO)?"
              answer="Yes! Unlike complex site builders that load heavy scripts and slow down, Jaalam generates clean semantic markup. Speed is a top ranking factor for local search, so our lightweight design guarantees rapid load times to help you score higher on Google and Bing."
            />
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden border-t border-[#e49b6b]/20 bg-[#fbf6f0]">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="bg-white border border-[#e49b6b]/30 shadow-xl shadow-[#e49b6b]/10 rounded-2xl p-8 sm:p-16 relative overflow-hidden">

            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tighter font-display text-[#1a1a1a]"
            >
              Ready to launch your business online?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true, margin: "-50px" }}
              className="text-[#555555] text-sm sm:text-base max-w-xl mx-auto mb-10 font-light leading-relaxed"
            >
              Join thousands of salon owners, restaurant managers, gym coaches, and local services using Jaalam to reach local clients.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <Link
                to="/register"
                className="bg-[#e49b6b] hover:bg-[#d98b5a] text-white shadow-md shadow-[#e49b6b]/20 font-bold text-sm px-6 py-3 rounded-lg transition-all hover:scale-102 w-full sm:w-auto"
              >
                Create My Site Free
              </Link>
              <Link
                to="/login"
                className="bg-white border border-zinc-200 hover:bg-zinc-50 text-[#1a1a1a] shadow-sm font-semibold text-sm px-6 py-3 rounded-lg transition-all w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <span>Access Dashboard</span>
                <ArrowUpRight className="w-4 h-4 text-[#555555]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e49b6b]/20 py-12 px-6 bg-[#fbf6f0] text-[#888888] text-xs font-mono">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 max-w-7xl">
          <div className="flex items-center gap-3 cursor-pointer">
            <img loading="lazy" src="/logo.png" alt="Jaalam Logo" className="w-8 h-8 object-contain opacity-80" />
            <span className="font-extrabold text-[#1a1a1a] font-display uppercase tracking-tight text-lg mt-1">JAALAM</span>
          </div>

          <div className="flex gap-6 text-[#888888]">
            <a href="#features" className="hover:text-[#1a1a1a] transition-colors">Features</a>
            <a href="#simulator" className="hover:text-[#1a1a1a] transition-colors">Demo</a>
            <a href="#process" className="hover:text-[#1a1a1a] transition-colors">How it works</a>
          </div>

          <p>© {new Date().getFullYear()} Jaalam Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
