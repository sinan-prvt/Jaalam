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
  Layers
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
    <div className="border-b border-zinc-800/80 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 text-left font-medium text-base sm:text-lg text-zinc-200 hover:text-white transition-colors group"
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-500 group-hover:text-zinc-300"
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
            <p className="text-zinc-400 pb-4 pr-6 leading-relaxed text-sm sm:text-base font-light">
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased overflow-x-hidden relative bg-grid-pattern">

      {/* Top soft center light - clean, low-opacity depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/5 to-transparent blur-[80px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-6 z-50 mx-auto max-w-5xl w-[92%] backdrop-blur-xl bg-zinc-950/60 border border-zinc-800/80 px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.6)]"
      >
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" className="w-7 h-7 object-contain" alt="Jaalam Logo" />
            <span className="text-base font-bold tracking-tight font-display text-white">
              Jaalam
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 bg-zinc-900/50 px-6 py-2 rounded-full border border-zinc-800/50">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold tracking-wide">Features</a>
            <a href="#simulator" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold tracking-wide">Demo</a>
            <a href="#process" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold tracking-wide">Process</a>
            <a href="#testimonials" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold tracking-wide">Stories</a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold tracking-wide">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-zinc-300 hover:text-white transition-colors text-xs font-semibold px-2 py-1">
              Log in
            </Link>
            <Link to="/register" className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Hero Left Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <ShinyText text="Lightning Fast Site Generator" speed={3} color="#a1a1aa" shineColor="#ffffff" />
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.08] mb-6 font-display text-white"
              >
                Create your business website <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
                  in 60 seconds.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-zinc-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-light"
              >
                No coding. No complicated builders. Just enter your business details and instantly launch a clean, professional, mobile-ready site with a scan-to-order QR code.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto"
              >
                <Link
                  to="/register"
                  className="bg-white hover:bg-zinc-200 text-black font-semibold text-base px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-97"
                >
                  Create Your Website Now
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
                <a
                  href="#simulator"
                  className="bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-200 border border-zinc-800 font-medium text-base px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-zinc-400 fill-zinc-400/20" />
                  Try Simulator
                </a>
              </motion.div>

              {/* Minimal Trust Badge row */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-zinc-900 w-full text-zinc-500"
              >
                <div>
                  <div className="flex items-center text-zinc-300 mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500/80" />
                    <span className="ml-1 text-xs font-bold">4.9/5 Rating</span>
                  </div>
                  <span className="text-[11px] font-light">From 500+ local owners</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-300 block mb-0.5">10k+ Live Sites</span>
                  <span className="text-[11px] font-light">Hosted globally</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-300 block mb-0.5">100% Free Trial</span>
                  <span className="text-[11px] font-light">No credit card needed</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right: Clean, realistic editor interface mockup */}
            <div className="lg:col-span-6 flex justify-center relative perspective-1000">
              <ThreeDTiltCard className="w-full max-w-[540px]">
                <div className="w-full rounded-xl border border-zinc-800 bg-[#09090b]/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden relative">

                  {/* Mockup Top Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d11] border-b border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <Layers className="w-3.5 h-3.5" />
                      <span>editor.jaalam.com/workspace</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800" />
                    </div>
                  </div>

                  {/* Desktop Layout Split */}
                  <div className="grid grid-cols-12 h-[320px] bg-[#09090b]">

                    {/* Mock Editor Sidebar */}
                    <div className="col-span-4 border-r border-zinc-800/80 p-3.5 space-y-4 text-left font-mono">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-2 font-bold">Element Layers</span>
                        <div className="space-y-1">
                          {[
                            { name: 'Header & Brand', active: true },
                            { name: 'Hero Block', active: true },
                            { name: 'Services Catalog', active: false },
                            { name: 'Contact Cards', active: false },
                          ].map((layer, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between px-2 py-1.5 rounded text-[9px] ${layer.active ? 'bg-zinc-900 text-zinc-200 border border-zinc-800/50' : 'text-zinc-500'
                                }`}
                            >
                              <span className="truncate">{layer.name}</span>
                              <Eye className="w-3 h-3 text-zinc-500" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-2 font-bold">Preferences</span>
                        <div className="p-2 rounded bg-zinc-900/50 border border-zinc-800/50 space-y-1.5">
                          <div className="flex justify-between items-center text-[8px] text-zinc-400">
                            <span>Mobile Optimization</span>
                            <span className="text-emerald-500 font-bold">Active</span>
                          </div>
                          <div className="flex justify-between items-center text-[8px] text-zinc-400">
                            <span>CDN Server Edge</span>
                            <span className="text-zinc-500">US-West</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editor Main Canvas */}
                    <div className="col-span-8 p-4 bg-zinc-950/40 flex flex-col justify-between relative">

                      {/* Grid background on canvas */}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                      {/* Header inside Canvas */}
                      <div className="flex justify-between items-center z-10">
                        <span className="font-extrabold text-[10px] tracking-tight text-white flex items-center gap-1">
                          ☕ Bean & Brew
                        </span>
                        <span className="text-[8px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                          Live Preview
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="my-auto z-10 text-center py-4 space-y-2">
                        <h2 className="text-base font-black text-white leading-tight font-display tracking-tight">
                          Freshly Roasted Coffee,<br />Crafted Daily.
                        </h2>
                        <p className="text-[9px] text-zinc-400 max-w-[200px] mx-auto leading-normal">
                          Premium single origin espresso, pastries, and local Seattle hospitality.
                        </p>
                        <div className="flex justify-center gap-1.5 pt-1">
                          <span className="bg-zinc-100 text-black font-semibold text-[8px] px-2.5 py-1 rounded">
                            View Menu
                          </span>
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[8px] px-2.5 py-1 rounded">
                            Contact Us
                          </span>
                        </div>
                      </div>

                      {/* Bottom Footer Details */}
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-900 z-10 text-[7px] text-zinc-500 font-mono">
                        <span>Built with Jaalam</span>
                        <span>myjaalam.com/beanbrew</span>
                      </div>

                    </div>
                  </div>

                  {/* Mockup Toolbar Overlay */}
                  <div className="px-4 py-2 bg-[#0d0d11] border-t border-zinc-800/80 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                    <div className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Auto-saving changes...</span>
                    </div>
                    <span className="text-emerald-500 font-bold">● Live on Cloud</span>
                  </div>

                </div>
              </ThreeDTiltCard>
            </div>

          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-20 bg-[#09090b]/80 border-t border-b border-zinc-900 px-6 relative">
        <div className="container mx-auto max-w-7xl relative z-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">
              <ShinyText text="✨ Live Interactive Sandbox" speed={3} color="#71717a" shineColor="#ffffff" />
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-white">
              Try the design engine.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Adjust variables inside the builder panel and watch the mock mobile device compile structural changes in real time.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Input Controls */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-400 font-mono flex items-center gap-2">
                    <Settings className="w-4 h-4 text-zinc-500" />
                    Builder Controls
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                    Compiled Live
                  </span>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 font-mono">
                    1. Brand Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    maxLength={32}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 font-medium focus:outline-none focus:border-zinc-500 transition-all text-sm font-mono"
                    placeholder="E.g. Vintage Salon"
                  />
                </div>

                {/* Category Toggles */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 font-mono">
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
                          ? 'bg-zinc-900 border-zinc-700 text-white font-bold'
                          : 'bg-transparent border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'
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
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 font-mono">
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
                          ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-white scale-105 shadow-md'
                          : 'opacity-60 hover:opacity-100'
                          }`}
                      >
                        {accentColor === col.id && (
                          <Check className="w-4 h-4 text-black font-bold" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Layout Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 font-mono">
                    4. Theme Layout
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['classic', 'modern', 'minimal'].map((layout) => (
                      <button
                        key={layout}
                        onClick={() => setLayoutStyle(layout as any)}
                        className={`px-3 py-2 rounded-lg border font-medium text-xs text-center transition-all capitalize font-mono ${layoutStyle === layout
                          ? 'bg-zinc-900 border-zinc-700 text-white font-bold'
                          : 'bg-transparent border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'
                          }`}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Callout */}
              <div className="mt-8 pt-6 border-t border-zinc-900">
                <Link
                  to="/register"
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-black rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm shadow-sm"
                >
                  <span>Build This Site Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-center block text-[10px] text-zinc-600 mt-3 font-mono">
                  Cloud hosting & custom domain included.
                </span>
              </div>
            </div>

            {/* Mobile Mockup Showcase */}
            <div className="lg:col-span-7 flex justify-center items-center">

              {/* iPhone Minimalist Bezel */}
              <div className="w-[310px] sm:w-[330px] aspect-[9/16] bg-[#000000] rounded-[2.5rem] border-4 border-zinc-800 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-zinc-900">

                {/* Phone Speaker Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-800 rounded-b-xl z-40 flex justify-center items-start">
                  <div className="w-10 h-0.5 bg-black rounded-full mt-1.5" />
                </div>

                {/* Status Bar */}
                <div className="h-8 bg-zinc-950 px-5 flex justify-between items-end pb-1 text-[9px] font-mono text-zinc-500 select-none z-30">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1.5 bg-zinc-500 rounded-xs inline-block" />
                  </div>
                </div>

                {/* Content Frame */}
                <div className="flex-1 flex flex-col bg-[#09090b] overflow-y-auto scrollbar-hide relative text-left">

                  {/* Category Image Header */}
                  <div className={`relative flex flex-col justify-between p-4 shrink-0 border-zinc-900 overflow-hidden ${layoutStyle === 'classic' ? 'h-40 border-b' :
                    layoutStyle === 'modern' ? 'h-48 border-none' :
                      'h-32 border-b'
                    }`}>
                    {layoutStyle === 'classic' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-zinc-950/98 z-0" />
                    )}
                    {layoutStyle === 'modern' && (
                      <div className={`absolute inset-0 opacity-20 ${selectedAccent.bg} z-0`} />
                    )}

                    {/* Mini Brand Navigation */}
                    <div className="flex justify-between items-center z-10">
                      <span className={`font-bold tracking-tight text-white max-w-[130px] truncate ${layoutStyle === 'modern' ? 'text-sm' : 'text-[10px]'
                        }`}>
                        {businessName || 'My Website'}
                      </span>
                      {layoutStyle !== 'minimal' && (
                        <span className={`text-[7px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${layoutStyle === 'modern' ? 'bg-black/40 border-transparent text-white' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
                          }`}>
                          {industry}
                        </span>
                      )}
                    </div>

                    {/* Hero Slogan */}
                    <div className="z-10 mt-auto">
                      {layoutStyle !== 'minimal' && (
                        <span className={`text-[8px] font-mono font-bold uppercase ${layoutStyle === 'modern' ? 'text-white/80' : selectedAccent.text
                          } block mb-0.5`}>
                          {currentContent.tagline}
                        </span>
                      )}
                      <h4 className={`text-white leading-tight font-display tracking-tight ${layoutStyle === 'modern' ? 'text-xl font-black' :
                        layoutStyle === 'minimal' ? 'text-xs font-medium' :
                          'text-sm font-bold'
                        }`}>
                        {currentContent.slogan}
                      </h4>
                    </div>
                  </div>

                  {/* Local Tab bar */}
                  <div className="flex bg-[#09090b] border-b border-zinc-900 sticky top-0 z-20">
                    {(['home', 'services', 'contact'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSimulatorTab(tab)}
                        className={`flex-1 text-center py-2 text-[9px] font-bold tracking-wider uppercase border-b transition-colors font-mono ${simulatorTab === tab
                          ? `border-white text-white`
                          : 'border-transparent text-zinc-600 hover:text-zinc-400'
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
                          className="space-y-4 text-xs font-light text-zinc-400 leading-relaxed"
                        >
                          <p>{currentContent.desc}</p>

                          {/* CTA Card */}
                          <div className={`p-4 relative overflow-hidden ${layoutStyle === 'modern' ? `rounded-3xl border-none ${selectedAccent.bg}` :
                            layoutStyle === 'minimal' ? 'rounded-none border-y border-zinc-800 bg-transparent py-4 px-0' :
                              'rounded-xl border border-zinc-800 bg-zinc-900/30'
                            }`}>
                            <h5 className={`font-bold mb-1 text-[11px] font-mono ${layoutStyle === 'modern' ? 'text-black' : 'text-zinc-200'}`}>Reserve a Spot</h5>
                            <p className={`text-[9px] mb-3 leading-normal ${layoutStyle === 'modern' ? 'text-black/70 font-medium' : 'text-zinc-500'}`}>Schedule appointments or reservations directly on our website.</p>
                            <button className={`w-full py-1.5 text-[9px] font-bold transition-colors ${layoutStyle === 'modern' ? 'bg-black text-white rounded-full' :
                              layoutStyle === 'minimal' ? 'bg-transparent border border-zinc-700 text-white rounded-sm hover:bg-zinc-900' :
                                'bg-zinc-100 hover:bg-zinc-200 text-black rounded'
                              }`}>
                              Book Instantly
                            </button>
                          </div>

                          {/* Quick Info Blocks */}
                          <div className="space-y-1.5 text-[9px] text-zinc-500 bg-zinc-950 p-3 rounded-lg border border-zinc-900 font-mono">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-zinc-600" />
                              <span>{currentContent.hours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-zinc-600" />
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
                          <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Menu / Offerings</h5>
                          <div className="space-y-2">
                            {currentContent.services.map((srv, idx) => (
                              <div key={idx} className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg flex justify-between items-start gap-4">
                                <div>
                                  <span className="text-[10px] font-bold text-zinc-200 block">{srv.name}</span>
                                  <span className="text-[8px] text-zinc-500 block leading-tight mt-0.5">{srv.desc}</span>
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
                          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex flex-col items-center text-center">
                            <div className="bg-white p-2 rounded-lg mb-3 shadow-inner">
                              <QRCodeSVG
                                value={`https://jaalam.com/${industry}/${encodeURIComponent(businessName)}`}
                                size={80}
                                level="M"
                              />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-200 block mb-0.5 font-mono">Storefront QR Code</span>
                            <span className="text-[8px] text-zinc-500 block max-w-[170px] leading-snug font-light">
                              Download this code to put on doors, table stands, or flyers.
                            </span>
                          </div>

                          <div className="space-y-1.5 bg-zinc-900/30 p-3 rounded-lg border border-zinc-900 text-[9px] font-mono text-zinc-400">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-zinc-600" />
                              <span>(555) 019-2834</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-3 h-3 text-zinc-600" />
                              <span className="truncate">contact@{businessName.toLowerCase().replace(/\s+/g, '')}.com</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom home indicator line */}
                <div className="h-4 bg-zinc-950 flex justify-center items-center shrink-0 z-30 select-none">
                  <div className="w-20 h-0.5 bg-zinc-800 rounded-full" />
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-7xl">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">
              <ShinyText text="✨ Core Toolkit" speed={3} color="#71717a" shineColor="#ffffff" />
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-white">
              Designed for physical storefronts.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm sm:text-base font-light">
              Simple, high-contrast layouts packed with tools that bridge offline traffic to your online hub.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Layout className="text-zinc-300 w-5 h-5" />,
                title: 'Niche Structure Blocks',
                desc: 'Optimized page sections tailored specifically for local restaurants, beauty salons, gyms, and contract services.'
              },
              {
                icon: <Smartphone className="text-zinc-300 w-5 h-5" />,
                title: 'Mobile-First Framework',
                desc: 'Over 85% of local web traffic starts on a phone. Your page loads instantly and displays beautifully on all mobile views.'
              },
              {
                icon: <QrCode className="text-zinc-300 w-5 h-5" />,
                title: 'Printable Storefront QR',
                desc: 'Automatically generate high-contrast vector QR codes to place on store windows, tables, or brochures.'
              },
              {
                icon: <Sparkles className="text-zinc-300 w-5 h-5" />,
                title: 'Distraction-Free Editor',
                desc: 'Upload menus, edit services lists, add scheduling triggers, and publish updates in single clicks.'
              },
              {
                icon: <Globe className="text-zinc-300 w-5 h-5" />,
                title: 'SaaS Cloud Hosting',
                desc: 'No server configurations, database builds, or SSL certificates. Your site resides on a fast edge CDN out-of-the-box.'
              },
              {
                icon: <Zap className="text-zinc-300 w-5 h-5" />,
                title: 'Local SEO Engine',
                desc: 'Semantic HTML markup structure optimized for Google Lighthouse and local web crawler rankings.'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                whileHover={{
                  y: -6,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                }}
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="bg-zinc-950 border border-zinc-900 p-8 rounded-2xl flex flex-col justify-between transition-colors duration-300 group cursor-default relative overflow-hidden"
              >
                <div>
                  <div className="bg-[#09090b] border border-zinc-800 w-10 h-10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-zinc-700 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2.5 text-zinc-100 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive 3D Showcase Gallery */}
      <section className="py-24 border-t border-zinc-900 bg-[#09090b]/40 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">
              <ShinyText text="✨ Infinite Exploration" speed={3} color="#71717a" shineColor="#ffffff" />
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-white">
              Stunning aesthetic presets.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm sm:text-base font-light">
              Drag, rotate, and interact with our 3D sphere gallery containing real storefront theme layouts.
            </motion.p>
          </motion.div>

          <div className="w-full max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden group select-none">
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[80%] bg-indigo-500/5 rounded-full mix-blend-multiply blur-3xl opacity-50 pointer-events-none"></div>

            <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl bg-black/40 border border-zinc-800/50">
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

            <div className="flex items-center justify-between mt-4 px-2 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-zinc-500" /> Click and drag sphere to rotate</span>
              <span>Jaalam Core Engine v2.0</span>
            </div>
          </div>

        </div>
      </section>

      {/* Timeline Section */}
      <section id="process" className="py-24 bg-zinc-950/40 border-t border-zinc-900 px-6 relative">
        <div className="container mx-auto max-w-7xl">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">
              <ShinyText text="✨ Direct Flow" speed={3} color="#71717a" shineColor="#ffffff" />
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-white">
              Launch in three steps.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm sm:text-base font-light">
              No developer hiring delays, no lengthy designs. Go live without traditional complexity.
            </motion.p>
          </motion.div>

          {/* SCROLLSTACK CARDS FOR LANDING PAGE */}
          <ScrollStack
            useWindowScroll={true}
            itemDistance={150}
            itemStackDistance={24}
            baseScale={0.93}
            itemScale={0.025}
            className="pb-[80vh] md:pb-[100vh]"
          >
            {/* STEP 1 */}
            <ScrollStackItem itemClassName="bg-[#121214] border border-zinc-800/80 shadow-2xl rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:h-[350px] min-h-[300px] w-full relative overflow-hidden mb-12">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full opacity-60 pointer-events-none" style={{ filter: 'blur(40px)', willChange: 'transform' }}></div>

              <div className="flex-1 flex flex-col justify-between h-full z-10 text-left">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-mono font-bold text-xs mb-4">01</div>
                  <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2 font-display">1. Input Store Details</h4>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
                    Enter your business metadata, choose a matching typographic structure, and select a predefined style configuration to dynamically render your storefront.
                  </p>
                </div>
                <div className="mt-6">
                  <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-lg font-semibold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md">
                    Try Sandbox <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-80 h-48 md:h-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden select-none z-10 shrink-0">
                <div className="space-y-3 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">Typography presets</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-300 text-center cursor-pointer hover:border-zinc-700">
                      Inter / Sans
                    </div>
                    <div className="p-2 bg-zinc-900 rounded-lg border border-indigo-500/20 text-xs font-semibold text-indigo-400 text-center cursor-pointer">
                      Playfair / Serif
                    </div>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono mt-2">Brand Accent</div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 ring-2 ring-offset-2 ring-offset-zinc-950 ring-indigo-500"></span>
                    <span className="w-5 h-5 rounded-full bg-rose-500"></span>
                    <span className="w-5 h-5 rounded-full bg-emerald-500"></span>
                    <span className="w-5 h-5 rounded-full bg-amber-500"></span>
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-[10px] text-zinc-400 flex items-center justify-between font-mono">
                  <span>Theme: Elegant Amber</span>
                  <span className="text-amber-400">Preview</span>
                </div>
              </div>
            </ScrollStackItem>

            {/* STEP 2 */}
            <ScrollStackItem itemClassName="bg-[#121214] border border-zinc-800/80 shadow-2xl rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:h-[350px] min-h-[300px] w-full relative overflow-hidden mb-12">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full opacity-60 pointer-events-none" style={{ filter: 'blur(40px)', willChange: 'transform' }}></div>

              <div className="flex-1 flex flex-col justify-between h-full z-10 text-left">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-mono font-bold text-xs mb-4">02</div>
                  <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2 font-display">2. Add Services & Products</h4>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
                    Quickly populate your price list tiers, product catalogs, or appointment scheduling options. No complicated configurations or developer delay.
                  </p>
                </div>
                <div className="mt-6">
                  <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-lg font-semibold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md">
                    Start Free Trial <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-80 h-48 md:h-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden select-none z-10 shrink-0">
                <div className="space-y-3 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">Mock Offerings</div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">💅</span>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-200">Designer Cut & Blow</div>
                          <div className="text-[8px] text-zinc-500">Wash, style consultation</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300">$65.00</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-xl opacity-80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">💇</span>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-200">Balayage Color</div>
                          <div className="text-[8px] text-zinc-500">Hand-painted highlights</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300">$120.00</span>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-[10px] text-zinc-400 flex items-center justify-between font-mono">
                  <span>Auto-syncing menu</span>
                  <span className="text-emerald-400 animate-pulse font-bold">Live</span>
                </div>
              </div>
            </ScrollStackItem>

            {/* STEP 3 */}
            <ScrollStackItem itemClassName="bg-[#121214] border border-zinc-800/80 shadow-2xl rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:h-[350px] min-h-[300px] w-full relative overflow-hidden mb-12">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full opacity-60 pointer-events-none" style={{ filter: 'blur(40px)', willChange: 'transform' }}></div>

              <div className="flex-1 flex flex-col justify-between h-full z-10 text-left">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-mono font-bold text-xs mb-4">03</div>
                  <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2 font-display">3. Deploy & Download QR</h4>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
                    Deploy your page instantly onto our secure global edge CDN. Automatically generate and download unique vector QR codes to place on doors, table stands, or flyers.
                  </p>
                </div>
                <div className="mt-6">
                  <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md">
                    Go Live Now <Globe size={12} />
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-80 h-48 md:h-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center justify-between shadow-inner relative overflow-hidden select-none z-10 shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono w-full text-left">Deploy status</div>

                <div className="bg-white p-2.5 rounded-xl flex items-center justify-center w-24 h-24 my-2 hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-zinc-950 rounded flex flex-col justify-between p-1">
                    <div className="flex justify-between w-full">
                      <div className="w-3.5 h-3.5 bg-white rounded-[1.5px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-zinc-950 rounded-[0.5px]"></div></div>
                      <div className="w-3.5 h-3.5 bg-white rounded-[1.5px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-zinc-950 rounded-[0.5px]"></div></div>
                    </div>
                    <div className="flex justify-between items-end w-full">
                      <div className="w-3.5 h-3.5 bg-white rounded-[1.5px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-zinc-950 rounded-[0.5px]"></div></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-[1px] flex items-center justify-center"><div className="w-1 h-1 bg-zinc-950 rounded-[0.5px]"></div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-[9px] text-zinc-400 font-mono truncate max-w-full text-center">
                  jaalam.app/vintage-glow
                </div>
              </div>
            </ScrollStackItem>

            {/* Spacer to increase scroll duration and prevent overlap with next section */}
            <div className="h-[50vh] md:h-[80vh] w-full pointer-events-none" />
          </ScrollStack>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 relative border-t border-zinc-900">
        <div className="container mx-auto max-w-7xl">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">Owner Feedback</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-white">
              Trusted by store owners.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm sm:text-base font-light">
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
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 10px 25px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)'
                }}
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 flex flex-col justify-between transition-colors duration-300 cursor-default"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(tst.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-zinc-400 fill-zinc-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 italic text-sm leading-relaxed mb-6 font-light">
                    "{tst.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-900/60 font-mono">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-200 uppercase">
                    {tst.author.slice(0, 2)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-zinc-200 block">{tst.author}</span>
                    <span className="text-[9px] text-zinc-500 block font-light">{tst.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/20 relative">
        <div className="container mx-auto max-w-4xl">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-3">Support</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tighter font-display text-white">
              Questions & answers.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm font-light">
              Clear details on pricing, setup, hosting, and domains.
            </motion.p>
          </motion.div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-10 space-y-2">
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
      <section className="py-24 px-6 relative overflow-hidden border-t border-zinc-900">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 sm:p-16 relative overflow-hidden">

            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tighter font-display text-white"
            >
              Ready to launch your business online?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true, margin: "-50px" }}
              className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-10 font-light leading-relaxed"
            >
              Join thousands of salon owners, restaurant managers, gym coaches, and local services using Jaalam to reach local clients.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <Link
                to="/register"
                className="bg-white hover:bg-zinc-200 text-black font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-all hover:scale-102 w-full sm:w-auto"
              >
                Create My Site Free
              </Link>
              <Link
                to="/login"
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold text-sm px-6 py-3 rounded-lg transition-all w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <span>Access Dashboard</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 bg-[#09090b] text-zinc-500 text-xs font-mono">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 max-w-7xl">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="w-6 h-6 object-contain" alt="Jaalam Logo" />
            <span className="font-extrabold text-zinc-300 font-display">Jaalam</span>
          </div>

          <div className="flex gap-6 text-zinc-500">
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#simulator" className="hover:text-zinc-300 transition-colors">Demo</a>
            <a href="#process" className="hover:text-zinc-300 transition-colors">How it works</a>
          </div>

          <p>© {new Date().getFullYear()} Jaalam Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

