import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
  useMotionValueEvent,
  animate,
  type MotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Star,
  Globe,
  MapPin,
  Clock,
  Phone,
  Settings,
  Menu,
  X,
  Smartphone,
  QrCode,
  LayoutTemplate,
  PenLine,
  ShieldCheck,
  Search,
  Zap,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

/*
  Performance notes
  - Scroll effects are framer-motion scroll-linked transforms/opacity only
    (compositor-friendly, no layout or paint work while scrolling).
  - No backdrop-filter / SVG filters over animated content, no WebGL.
  - Looping motion is CSS transform-only and disabled for reduced-motion users,
    and parallax ranges collapse to 0 for them too.
  - Images are sized for display, lazy-loaded below the fold, decoded async.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

const img = (id: string, w = 480, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: EASE },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/* ───────── Small building blocks ───────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#d08757] via-[#e49b6b] to-[#b86938]"
    />
  );
}

function Counter({ to, suffix = '', duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration]);
  return <span ref={ref}>0{suffix}</span>;
}

function Word({ children, progress, range, className = '' }: { children: string; progress: MotionValue<number>; range: [number, number]; className?: string }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={`inline-block ${className}`}>
      {children}
      &nbsp;
    </motion.span>
  );
}

function ScrollRevealText({ text, highlight = [] }: { text: string; highlight?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="flex flex-wrap font-display text-[1.75rem] font-extrabold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl">
      {words.map((w, i) => {
        const cls = highlight.includes(w.replace(/[.,]/g, '')) ? 'text-[#d08757]' : '';
        if (reduce) {
          return (
            <span key={i} className={`inline-block ${cls}`}>
              {w}&nbsp;
            </span>
          );
        }
        const start = i / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} className={cls}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
        dark ? 'border-white/15 text-[#fce2c6]' : 'border-[#e49b6b]/30 bg-white text-[#b86938]'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#e49b6b]" />
      {children}
    </span>
  );
}

function SectionHead({ label, title, sub }: { label: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div {...reveal} className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a] sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-[#5c5249]">{sub}</p>}
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-colors ${isOpen ? 'border-[#e49b6b]/40 bg-white' : 'border-transparent bg-white/60'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-[#1a1a1a] sm:px-6 sm:py-5 sm:text-base"
      >
        <span>{question}</span>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-[#1a1a1a] text-white' : 'bg-[#fbf6f0] text-[#1a1a1a]'}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pr-12 text-sm leading-relaxed text-[#5c5249] sm:px-6 sm:pb-6 sm:pr-14 sm:text-base">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── Data ───────── */

const TEMPLATES = [
  { id: 'photo-1559339352-11d035aa65de', title: 'Bistro' },
  { id: 'photo-1441984904996-e0b6ba687e04', title: 'Retail Boutique' },
  { id: 'photo-1534438327276-14e5300c3a48', title: 'Fitness Gym' },
  { id: 'photo-1600596542815-ffad4c1539a9', title: 'Luxury Villas' },
  { id: 'photo-1554118811-1e0d58224f24', title: 'Cozy Cafe' },
  { id: 'photo-1503951914875-452162b0f3f1', title: 'Barbershop' },
  { id: 'photo-1580618672591-eb180b1a973f', title: 'Modern Salon' },
  { id: 'photo-1544367567-0f2fcb009e0b', title: 'Yoga Studio' },
  { id: 'photo-1514933651103-005eec06c04b', title: 'Fine Dining' },
  { id: 'photo-1542838132-92c53300491e', title: 'Organic Store' },
  { id: 'photo-1523381210434-271e8be1f52b', title: 'Streetwear' },
  { id: 'photo-1545324418-cc1a3fa10c00', title: 'Urban Apartments' },
];

const INDUSTRIES = ['Cafes', 'Salons', 'Gyms', 'Restaurants', 'Real estate', 'Boutiques', 'Weddings', 'Birthdays', 'Grocery', 'Stationery', 'Consulting', 'Textiles'];

const STEPS = [
  { n: '01', title: 'Pick a template', desc: 'Choose your industry and a style you love.' },
  { n: '02', title: 'Add your details', desc: 'Name, services, prices, hours and photos.' },
  { n: '03', title: 'Publish & share', desc: 'Go live with a link and a printable QR code.' },
];

const TESTIMONIALS = [
  { quote: 'Jaalam changed the game for us. I put the QR code on our tables, and now customers can scan it to browse our menu. Setup literally took a minute.', author: 'Marco S.', role: 'Owner, Bella Vita Cafe' },
  { quote: "I'm not tech-savvy at all, but I got my website running in under a minute. Our booking calls have doubled since putting the QR code on our store window!", author: 'Sarah L.', role: 'Lead Stylist, Glow Hair Salon' },
  { quote: 'Clean, fast, and works perfectly on mobile. The automatic QR code is brilliant for onboarding gym members and displaying fitness plans.', author: 'David K.', role: 'Founder, IronGym Seattle' },
];

/* ───────── Page ───────── */

export default function LandingPage() {
  const [businessName, setBusinessName] = useState('Bella Vita Cafe');
  const [industry, setIndustry] = useState<'salon' | 'cafe' | 'restaurant' | 'gym'>('cafe');
  const [accentColor, setAccentColor] = useState<'purple' | 'rose' | 'emerald' | 'amber'>('amber');
  const [layoutStyle, setLayoutStyle] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [simulatorTab, setSimulatorTab] = useState<'home' | 'services' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  const reduce = useReducedMotion();
  const k = reduce ? 0 : 1; // parallax multiplier

  // Page scroll → nav state + mobile sticky CTA (setState only when value flips)
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const s = y > 12;
    if (s !== scrolled) setScrolled(s);
    const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 700;
    const c = y > 640 && !nearBottom;
    if (c !== showMobileCta) setShowMobileCta(c);
  });

  // Smooth anchor scrolling while on this page
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = reduce ? 'auto' : 'smooth';
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, [reduce]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Hero parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroCopyY = useTransform(heroP, [0, 1], [0, -90 * k]);
  const heroCopyOpacity = useTransform(heroP, [0, 0.75], [1, reduce ? 1 : 0]);
  const heroVisualY = useTransform(heroP, [0, 1], [0, 70 * k]);
  const heroVisualRotate = useTransform(heroP, [0, 1], [0, -4 * k]);
  const heroVisualScale = useTransform(heroP, [0, 1], [1, 1 - 0.06 * k]);
  const chipAY = useTransform(heroP, [0, 1], [0, -60 * k]);
  const chipBY = useTransform(heroP, [0, 1], [0, 40 * k]);

  // Feature card image parallax
  const featRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: featP } = useScroll({ target: featRef, offset: ['start end', 'end start'] });
  const featImgY = useTransform(featP, [0, 1], [30 * k, -30 * k]);

  // Steps timeline fill
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsP } = useScroll({ target: stepsRef, offset: ['start 0.8', 'end 0.55'] });
  const stepsFill = useSpring(stepsP, { stiffness: 120, damping: 30 });

  // Templates rows drift with scroll
  const tplRef = useRef<HTMLElement>(null);
  const { scrollYProgress: tplP } = useScroll({ target: tplRef, offset: ['start end', 'end start'] });
  const row1X = useTransform(tplP, [0, 1], [60 * k, -120 * k]);
  const row2X = useTransform(tplP, [0, 1], [-120 * k, 60 * k]);

  // CTA zoom-in
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ctaP } = useScroll({ target: ctaRef, offset: ['start end', 'center 0.65'] });
  const ctaScale = useTransform(ctaP, [0, 1], [reduce ? 1 : 0.88, 1]);
  const ctaRadius = useTransform(ctaP, [0, 1], [64, 40]);

  const colorMap = {
    purple: { bg: 'bg-indigo-600', text: 'text-indigo-500' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-500' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600' },
  };
  const selectedAccent = colorMap[accentColor];

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
    },
    salon: {
      slogan: 'Your hair, your style, your confidence.',
      desc: 'Expert stylists dedicated to highlighting your unique beauty with professional hair care and luxury treatments.',
      services: [
        { name: 'Designer Haircut', price: '$65+', desc: 'Precision cut, wash, blowout, and style consultation.' },
        { name: 'Balayage & Color', price: '$120+', desc: 'Natural-looking hand-painted highlights by our master colorists.' },
        { name: 'Luxury Deep Treatment', price: '$45+', desc: 'Hydrating mask with head massage and steam therapy.' },
      ],
      address: '102 Glow Ave, Suite B, Beverly Hills, CA',
      hours: 'Tue-Sat: 9am - 7pm',
      tagline: 'Luxury Hair Care',
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
    },
  };
  const currentContent = industryContent[industry];

  const handleIndustryChange = (ind: 'salon' | 'cafe' | 'restaurant' | 'gym') => {
    setIndustry(ind);
    if (ind === 'salon') setAccentColor('rose');
    else if (ind === 'cafe') setAccentColor('amber');
    else if (ind === 'restaurant') setAccentColor('purple');
    else if (ind === 'gym') setAccentColor('emerald');
  };

  // In-page navigation: close menu + release scroll lock first, then scroll
  const goTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    });
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how', label: 'How it works' },
    { href: '#simulator', label: 'Try it' },
    { href: '#templates', label: 'Templates' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        @keyframes jl-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @keyframes jl-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-10px,0); } }
        .jl-marquee { animation: jl-marquee var(--jl-dur, 40s) linear infinite; will-change: transform; }
        .jl-marquee-wrap:hover .jl-marquee { animation-play-state: paused; }
        .jl-float { animation: jl-float 5s ease-in-out infinite; will-change: transform; }
        .jl-float-delay { animation-delay: -2.5s; }
        .jl-fade-edges { -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .jl-root h1, .jl-root h2, .jl-root h3, .jl-root p, .jl-root span, .jl-root a, .jl-root div { white-space: normal; overflow-wrap: normal; word-break: normal; }
        @media (prefers-reduced-motion: reduce) { .jl-marquee, .jl-float { animation: none; } }
      `}</style>

      <ScrollProgress />

      <div className="jl-root relative min-h-screen overflow-x-clip bg-[#fbf6f0] font-sans text-[#1a1a1a] antialiased">
        {/* ───────── NAV ───────── */}
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
          <nav
            className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border py-2 pl-3 pr-2 transition-all duration-300 sm:px-6 sm:py-2.5 ${
              scrolled || isMobileMenuOpen ? 'border-[#e49b6b]/25 bg-white/95 shadow-[0_8px_30px_-12px_rgba(184,105,56,0.35)]' : 'border-transparent bg-transparent'
            }`}
          >
            <a href="#top" onClick={(e) => goTo(e, '#top')} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Jaalam" width={36} height={36} className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
              <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">JAALAM</span>
            </a>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={(e) => goTo(e, l.href)} className="rounded-full px-4 py-2 text-sm font-semibold text-[#5c5249] transition-colors hover:bg-[#fbf6f0] hover:text-[#1a1a1a]">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold transition-colors hover:bg-[#fbf6f0]">Log in</Link>
              <Link to="/register" className="group inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Link to="/register" className="rounded-full bg-[#1a1a1a] px-4 py-2 text-xs font-bold text-white sm:text-sm">Get Started</Link>
              <button onClick={() => setIsMobileMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={isMobileMenuOpen} className="grid h-10 w-10 place-items-center rounded-full bg-[#fbf6f0]">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="mx-auto mt-2 flex max-h-[calc(100dvh-90px)] max-w-6xl origin-top flex-col gap-1 overflow-y-auto rounded-3xl border border-[#e49b6b]/20 bg-white p-3 shadow-xl lg:hidden"
              >
                {navLinks.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => goTo(e, l.href)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-bold hover:bg-[#fbf6f0]"
                  >
                    {l.label}
                    <ArrowRight className="h-4 w-4 text-[#e49b6b]" />
                  </motion.a>
                ))}
                <div className="my-2 h-px bg-[#1a1a1a]/10" />
                <Link to="/login" className="rounded-2xl px-4 py-3.5 text-lg font-bold hover:bg-[#fbf6f0]">Log in</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ───────── HERO ───────── */}
        <section ref={heroRef} id="top" className="relative px-4 pb-16 pt-28 sm:px-6 sm:pt-36 md:pt-40 lg:pb-28">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full sm:h-[640px] sm:w-[640px]" style={{ background: 'radial-gradient(closest-side, rgba(228,155,107,0.35), rgba(228,155,107,0))' }} />
            <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full sm:h-[520px] sm:w-[520px]" style={{ background: 'radial-gradient(closest-side, rgba(252,226,198,0.9), rgba(252,226,198,0))' }} />
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: 'linear-gradient(rgba(26,26,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.05) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse at 50% 30%, #000 30%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, #000 30%, transparent 75%)',
              }}
            />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            {/* Copy */}
            <motion.div style={{ y: heroCopyY, opacity: heroCopyOpacity }} className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#e49b6b]/30 bg-white py-1 pl-1 pr-3 text-[11px] font-semibold text-[#5c5249] shadow-sm sm:text-xs">
                  <span className="rounded-full bg-[#e49b6b] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">New</span>
                  40+ industry templates, ready to launch
                </span>
              </motion.div>

              <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-tight min-[400px]:text-5xl sm:text-6xl lg:text-7xl">
                {['Your', 'business,'].map((w, i) => (
                  <motion.span key={w} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 + i * 0.07, ease: EASE }} className="mr-[0.25em] inline-block">
                    {w}
                  </motion.span>
                ))}
                <br />
                {['online', 'in'].map((w, i) => (
                  <motion.span key={w} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.19 + i * 0.07, ease: EASE }} className="mr-[0.25em] inline-block">
                    {w}
                  </motion.span>
                ))}
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.33, ease: EASE }} className="relative inline-block whitespace-nowrap">
                  <span className="bg-gradient-to-r from-[#d08757] via-[#e49b6b] to-[#b86938] bg-clip-text text-transparent">60 seconds.</span>
                  <svg aria-hidden viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-[#e49b6b]">
                    <motion.path
                      d="M2 12 C 70 2, 150 2, 298 10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
                    />
                  </svg>
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
                className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[#5c5249] sm:mt-7 sm:text-lg lg:mx-0"
              >
                Jaalam is the creative site builder for local businesses. Pick a template, add your details, and publish a fast, mobile-first website with its own QR code. No coding.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
                className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link to="/register" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-7 py-4 text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(26,26,26,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                  Start building free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#simulator" onClick={(e) => goTo(e, '#simulator')} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1a1a1a]/15 bg-white px-7 py-4 text-base font-bold transition-colors hover:border-[#e49b6b] active:scale-[0.98]">
                  Try live demo
                </a>
              </motion.div>

              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.65 } } }}
                className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-[#5c5249] sm:mt-9 lg:justify-start"
              >
                {['No coding', 'Free hosting & SSL', 'QR code included'].map((t) => (
                  <motion.li key={t} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e49b6b]/15">
                      <Check className="h-3 w-3 text-[#b86938]" strokeWidth={3} />
                    </span>
                    {t}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="relative mx-auto w-full max-w-[460px] px-2 sm:max-w-[520px] sm:px-0"
            >
              <motion.div style={{ y: heroVisualY, rotate: heroVisualRotate, scale: heroVisualScale }} className="relative">
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e49b6b] to-[#c27a48] p-4 shadow-[0_40px_80px_-30px_rgba(184,105,56,0.7)] sm:rounded-[2.5rem] sm:p-10">
                  <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border-[40px] border-white/10" />
                  <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full border-[30px] border-black/5" />

                  <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl">
                    <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-[#fbf6f0] px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff6159]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c941]" />
                      <div className="ml-2 flex-1 truncate rounded-full bg-white px-3 py-1 text-[10px] font-medium text-zinc-500 sm:ml-3 sm:text-[11px]">jaalam.com/bistro-cafe</div>
                    </div>
                    <div className="relative aspect-[4/3]">
                      <img
                        src={img('photo-1559339352-11d035aa65de', 800, 600)}
                        alt="Bistro Cafe demo website"
                        width={800}
                        height={600}
                        decoding="async"
                        fetchPriority="high"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-white sm:px-5 sm:py-4">
                        <span className="font-display text-sm font-extrabold">Bistro Cafe</span>
                        <span className="hidden gap-4 text-[11px] font-semibold opacity-90 sm:flex"><span>Menu</span><span>About</span><span>Book</span></span>
                        <Menu className="h-4 w-4 sm:hidden" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#fce2c6] sm:text-[10px]">Fresh brews daily</p>
                        <p className="mt-1 font-display text-lg font-extrabold leading-tight sm:text-2xl">Brewed to perfection,<br />served with warmth.</p>
                        <span className="mt-2.5 inline-block rounded-full bg-[#e49b6b] px-3.5 py-1.5 text-[10px] font-bold sm:mt-3 sm:px-4 sm:py-2 sm:text-[11px]">Reserve a table</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating chips — outside the clipped panel so they can overhang */}
                <motion.div style={{ y: chipAY }} className="absolute -left-1 -top-5 sm:-left-8 sm:top-20">
                  <div className="jl-float flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-xl sm:gap-3 sm:px-4 sm:py-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#1a1a1a] text-white sm:h-10 sm:w-10"><QrCode className="h-4 w-4 sm:h-5 sm:w-5" /></span>
                    <div className="text-left">
                      <p className="text-[11px] font-bold sm:text-xs">QR menu ready</p>
                      <p className="hidden text-[11px] text-zinc-500 sm:block">Print & place on tables</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div style={{ y: chipBY }} className="absolute -bottom-5 -right-1 sm:-right-8 sm:bottom-10">
                  <div className="jl-float jl-float-delay flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-xl sm:gap-3 sm:px-4 sm:py-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white sm:h-10 sm:w-10"><Check className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} /></span>
                    <div className="text-left">
                      <p className="text-[11px] font-bold sm:text-xs">Site published</p>
                      <p className="hidden text-[11px] text-zinc-500 sm:block">Live on mobile & desktop</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ───────── INDUSTRY MARQUEE ───────── */}
        <section aria-label="Industries" className="border-y border-[#e49b6b]/20 bg-white py-5 sm:py-6">
          <div className="jl-fade-edges overflow-hidden">
            <div className="jl-marquee flex w-max gap-8 sm:gap-10" style={{ '--jl-dur': '35s' } as React.CSSProperties}>
              {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
                <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-lg font-bold text-[#1a1a1a]/70 sm:gap-10 sm:text-xl">
                  {name}
                  <span className="text-[#e49b6b]">✦</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── STATS ───────── */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerParent}
            className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {[
              { to: 60, suffix: 's', label: 'to launch your site' },
              { to: 40, suffix: '+', label: 'ready-made templates' },
              { to: 15, suffix: '+', label: 'industries covered' },
              { to: 100, suffix: '%', label: 'mobile-ready pages' },
            ].map((s) => (
              <motion.div key={s.label} variants={staggerChild} className="rounded-3xl border border-[#e49b6b]/20 bg-white p-5 text-center sm:p-7">
                <p className="font-display text-4xl font-extrabold tracking-tight text-[#1a1a1a] sm:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-1.5 text-xs font-semibold text-[#5c5249] sm:text-sm">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ───────── STATEMENT (scroll-linked word reveal) ───────── */}
        <section className="px-4 pb-4 sm:px-6 sm:pb-8">
          <div className="mx-auto max-w-4xl">
            <ScrollRevealText
              text="Your customers search on their phones first. Jaalam gives every local business a beautiful, fast website and a QR code, without the cost or the code."
              highlight={['phones', 'beautiful', 'fast', 'QR']}
            />
          </div>
        </section>

        {/* ───────── FEATURES (BENTO) ───────── */}
        <section id="features" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHead label="Features" title={<>Everything a local business <span className="text-[#d08757]">needs online.</span></>} sub="One builder for your website, menu, bookings and QR code — designed to look professional from the first click." />

            <motion.div
              ref={featRef}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerParent}
              className="grid gap-3 sm:gap-4 md:grid-cols-6"
            >
              <motion.div variants={staggerChild} className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-6 text-white sm:p-8 md:col-span-4 md:row-span-2">
                <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(228,155,107,0.55), transparent)' }} />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e49b6b]"><LayoutTemplate className="h-6 w-6" /></span>
                <h3 className="mt-6 font-display text-2xl font-extrabold sm:text-3xl">40+ templates crafted for your industry</h3>
                <p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">Cafes, salons, gyms, real estate, retail, weddings, events and more — each with layouts built for what that business actually sells.</p>
                <motion.div style={{ y: featImgY }} className="mt-7 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
                  {TEMPLATES.slice(0, 3).map((t, i) => (
                    <div key={t.id} className={`overflow-hidden rounded-xl sm:rounded-2xl ${i === 1 ? 'translate-y-4' : ''}`}>
                      <img src={img(t.id, 300, 380)} alt={t.title} width={300} height={380} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {[
                { icon: Smartphone, title: 'Mobile-first', desc: 'Looks sharp on every phone, where your customers actually are.' },
                { icon: QrCode, title: 'Instant QR code', desc: 'A storefront QR for doors, tables and flyers — generated for you.' },
                { icon: PenLine, title: 'Easy live editor', desc: 'Change prices, photos and hours from your dashboard. Updates go live instantly.' },
                { icon: ShieldCheck, title: 'Hosting & SSL included', desc: 'Secure cloud hosting and a free subdomain. Nothing to configure.' },
                { icon: Search, title: 'SEO-ready & fast', desc: 'Clean, lightweight pages that load quickly and rank well in local search.' },
              ].map((f) => (
                <motion.div
                  variants={staggerChild}
                  key={f.title}
                  className="group flex items-start gap-4 rounded-3xl border border-[#e49b6b]/20 bg-white p-5 transition-colors hover:border-[#e49b6b]/50 sm:block sm:p-7 md:col-span-2"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e49b6b]/15 text-[#b86938] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold sm:mt-5">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#5c5249] sm:mt-2">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───────── HOW IT WORKS (scroll-filled timeline) ───────── */}
        <section id="how" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHead label="How it works" title="Three steps. One minute." />

            <div ref={stepsRef} className="relative">
              {/* Track + fill: vertical on mobile, horizontal on desktop */}
              <div aria-hidden className="absolute bottom-6 left-6 top-6 w-0.5 bg-[#e49b6b]/20 md:hidden" />
              <motion.div aria-hidden style={{ scaleY: stepsFill }} className="absolute bottom-6 left-6 top-6 w-0.5 origin-top bg-[#e49b6b] md:hidden" />
              <div aria-hidden className="absolute left-[16%] right-[16%] top-6 hidden h-0.5 bg-[#e49b6b]/20 md:block" />
              <motion.div aria-hidden style={{ scaleX: stepsFill }} className="absolute left-[16%] right-[16%] top-6 hidden h-0.5 origin-left bg-[#e49b6b] md:block" />

              <motion.ol
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
                className="relative grid gap-6 md:grid-cols-3 md:gap-8"
              >
                {STEPS.map((s) => (
                  <motion.li key={s.n} variants={staggerChild} className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                    <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1a1a1a] font-display text-sm font-extrabold text-white ring-8 ring-white">
                      {s.n}
                    </span>
                    <div className="flex-1 rounded-3xl bg-[#fbf6f0] p-5 transition-colors hover:bg-[#fcefe2] sm:p-6 md:mt-6 md:w-full md:p-8">
                      <h3 className="font-display text-lg font-extrabold sm:text-xl">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-[#5c5249] sm:text-base">{s.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        </section>

        {/* ───────── SIMULATOR ───────── */}
        <section id="simulator" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHead label="Live sandbox" title="Try the design engine." sub="Change the settings and watch the phone preview update in real time." />

            <div className="grid items-center gap-10 lg:grid-cols-12">
              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="order-2 rounded-3xl border border-[#e49b6b]/25 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(184,105,56,0.35)] sm:p-8 lg:order-1 lg:col-span-5"
              >
                <div className="mb-6 flex items-center justify-between border-b border-[#fbf6f0] pb-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <Settings className="h-4 w-4 text-[#e49b6b]" /> Builder controls
                  </h3>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="jl-brand" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5c5249]">1. Brand name</label>
                    <input
                      id="jl-brand"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      maxLength={32}
                      placeholder="E.g. Vintage Salon"
                      className="w-full rounded-xl border border-[#e49b6b]/30 bg-[#fbf6f0] px-4 py-3 text-base font-semibold text-[#1a1a1a] outline-none transition-colors focus:border-[#e49b6b] sm:text-sm"
                    />
                  </div>

                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5c5249]">2. Industry</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'cafe', name: 'Cafe', icon: '☕' },
                        { id: 'salon', name: 'Salon', icon: '💅' },
                        { id: 'restaurant', name: 'Restaurant', icon: '🍕' },
                        { id: 'gym', name: 'Gym', icon: '💪' },
                      ].map((ind) => (
                        <button
                          key={ind.id}
                          onClick={() => handleIndustryChange(ind.id as 'cafe')}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors sm:px-4 ${
                            industry === ind.id ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#e49b6b]/30 text-[#5c5249] hover:border-[#e49b6b]'
                          }`}
                        >
                          <span>{ind.icon}</span>
                          {ind.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5c5249]">3. Accent</span>
                    <div className="flex gap-3">
                      {[
                        { id: 'amber', cls: 'bg-amber-500', name: 'Amber' },
                        { id: 'rose', cls: 'bg-rose-500', name: 'Rose' },
                        { id: 'purple', cls: 'bg-indigo-500', name: 'Violet' },
                        { id: 'emerald', cls: 'bg-emerald-500', name: 'Emerald' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setAccentColor(c.id as 'amber')}
                          title={c.name}
                          aria-label={c.name}
                          className={`grid h-10 w-10 place-items-center rounded-full transition-transform ${c.cls} ${
                            accentColor === c.id ? 'scale-110 ring-2 ring-[#1a1a1a] ring-offset-2' : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          {accentColor === c.id && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5c5249]">4. Layout</span>
                    <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#fbf6f0] p-1">
                      {(['classic', 'modern', 'minimal'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLayoutStyle(l)}
                          className={`rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors ${
                            layoutStyle === l ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#5c5249] hover:text-[#1a1a1a]'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Link to="/register" className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e49b6b] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#d08757]">
                  Build this site free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 text-center text-xs text-[#5c5249]">Cloud hosting & subdomain included.</p>
              </motion.div>

              {/* Phone preview — shown first on mobile so people see the result */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: EASE }}
                className="order-1 flex justify-center lg:order-2 lg:col-span-7"
              >
                <div className="relative">
                  <div aria-hidden className="absolute inset-0 -z-10 scale-110 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(228,155,107,0.35), transparent)' }} />
                  <div className="relative flex aspect-[9/18] w-[min(300px,82vw)] flex-col overflow-hidden rounded-[2.5rem] border-[9px] border-[#1a1a1a] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] sm:w-[320px] sm:rounded-[2.75rem] sm:border-[10px]">
                    <div className="absolute left-1/2 top-2 z-40 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
                    <div className="flex h-10 shrink-0 items-end justify-between px-6 pb-1 text-[10px] font-semibold text-zinc-500">
                      <span>9:41</span>
                      <span className="h-2 w-4 rounded-sm bg-zinc-400" />
                    </div>

                    <div className="scrollbar-hide relative flex flex-1 flex-col overflow-y-auto overscroll-contain text-left">
                      <div className={`relative flex shrink-0 flex-col justify-between overflow-hidden p-4 ${layoutStyle === 'classic' ? 'h-40 border-b border-zinc-100' : layoutStyle === 'modern' ? 'h-48' : 'h-32 border-b border-zinc-100'}`}>
                        {layoutStyle === 'modern' && <div className={`absolute inset-0 opacity-15 ${selectedAccent.bg}`} />}
                        {layoutStyle === 'classic' && <div className="absolute inset-0 bg-gradient-to-b from-[#fbf6f0] to-white" />}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className={`max-w-[150px] truncate font-bold tracking-tight ${layoutStyle === 'modern' ? 'text-sm' : 'text-[11px]'}`}>{businessName || 'My Website'}</span>
                          {layoutStyle !== 'minimal' && (
                            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-zinc-600">{industry}</span>
                          )}
                        </div>
                        <div className="relative z-10 mt-auto">
                          {layoutStyle !== 'minimal' && <span className={`mb-0.5 block text-[9px] font-bold uppercase ${selectedAccent.text}`}>{currentContent.tagline}</span>}
                          <h4 className={`font-display leading-tight tracking-tight ${layoutStyle === 'modern' ? 'text-xl font-black' : layoutStyle === 'minimal' ? 'text-xs font-medium' : 'text-sm font-bold'}`}>
                            {currentContent.slogan}
                          </h4>
                        </div>
                      </div>

                      <div className="sticky top-0 z-20 flex border-b border-zinc-100 bg-white">
                        {(['home', 'services', 'contact'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setSimulatorTab(tab)}
                            className={`flex-1 border-b-2 py-2.5 text-[9px] font-bold uppercase tracking-wider transition-colors ${simulatorTab === tab ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-zinc-400'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <AnimatePresence mode="wait">
                          {simulatorTab === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-4 text-xs leading-relaxed text-[#5c5249]">
                              <p>{currentContent.desc}</p>
                              <div className={`relative overflow-hidden p-4 ${layoutStyle === 'modern' ? `rounded-3xl ${selectedAccent.bg}` : layoutStyle === 'minimal' ? 'border-y border-zinc-200 px-0' : 'rounded-xl border border-zinc-200 bg-zinc-50'}`}>
                                <h5 className={`mb-1 text-[11px] font-bold ${layoutStyle === 'modern' ? 'text-white' : 'text-[#1a1a1a]'}`}>Reserve a spot</h5>
                                <p className={`mb-3 text-[9px] ${layoutStyle === 'modern' ? 'text-white/80' : ''}`}>Schedule appointments or reservations directly on our website.</p>
                                <button className={`w-full py-1.5 text-[9px] font-bold ${layoutStyle === 'modern' ? 'rounded-full bg-white text-black' : layoutStyle === 'minimal' ? 'rounded-sm border border-zinc-300 text-black' : 'rounded bg-[#1a1a1a] text-white'}`}>
                                  Book instantly
                                </button>
                              </div>
                              <div className="space-y-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-[9px]">
                                <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-zinc-400" /><span>{currentContent.hours}</span></div>
                                <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-zinc-400" /><span className="truncate">{currentContent.address}</span></div>
                              </div>
                            </motion.div>
                          )}

                          {simulatorTab === 'services' && (
                            <motion.div key="services" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-2">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Menu / offerings</h5>
                              {currentContent.services.map((srv) => (
                                <div key={srv.name} className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                                  <div>
                                    <span className="block text-[10px] font-bold text-[#1a1a1a]">{srv.name}</span>
                                    <span className="mt-0.5 block text-[8px] leading-tight text-[#5c5249]">{srv.desc}</span>
                                  </div>
                                  <span className={`shrink-0 text-[10px] font-bold ${selectedAccent.text}`}>{srv.price}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}

                          {simulatorTab === 'contact' && (
                            <motion.div key="contact" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-4">
                              <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                                <div className="mb-3 rounded-lg border border-zinc-200 bg-white p-2">
                                  <QRCodeSVG value={`https://jaalam.com/${industry}/${encodeURIComponent(businessName)}`} size={80} level="M" />
                                </div>
                                <span className="mb-0.5 block text-[9px] font-bold text-[#1a1a1a]">Storefront QR code</span>
                                <span className="block max-w-[170px] text-[8px] leading-snug text-[#5c5249]">Put this on doors, table stands, or flyers.</span>
                              </div>
                              <div className="space-y-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-[9px] text-[#5c5249]">
                                <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-zinc-400" /><span>(555) 019-2834</span></div>
                                <div className="flex items-center gap-2"><Globe className="h-3 w-3 text-zinc-400" /><span className="truncate">contact@{businessName.toLowerCase().replace(/\s+/g, '')}.com</span></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="flex h-5 shrink-0 items-center justify-center"><div className="h-1 w-24 rounded-full bg-zinc-300" /></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───────── TEMPLATES (marquee + scroll drift) ───────── */}
        <section ref={tplRef} id="templates" className="scroll-mt-24 overflow-hidden bg-[#1a1a1a] py-16 text-white sm:py-24">
          <div className="mx-auto mb-10 max-w-6xl px-4 sm:mb-14 sm:px-6">
            <motion.div {...reveal} className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <SectionLabel dark>Templates</SectionLabel>
                <h2 className="mt-5 max-w-xl font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">Stunning presets for every storefront.</h2>
              </div>
              <Link to="/register" className="group inline-flex items-center gap-2 rounded-full bg-[#e49b6b] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[#d08757]">
                Browse all templates <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          <div className="jl-marquee-wrap jl-fade-edges space-y-4 sm:space-y-5">
            {[TEMPLATES.slice(0, 6), TEMPLATES.slice(6)].map((row, r) => (
              <motion.div key={r} style={{ x: r === 0 ? row1X : row2X }}>
                <div
                  className="jl-marquee flex w-max gap-4 sm:gap-5"
                  style={{ '--jl-dur': r === 0 ? '45s' : '55s', animationDirection: r === 1 ? 'reverse' : 'normal' } as React.CSSProperties}
                >
                  {[...row, ...row].map((t, i) => (
                    <Link to="/register" key={`${t.id}-${i}`} className="group relative block w-[220px] shrink-0 overflow-hidden rounded-2xl sm:w-[300px] sm:rounded-3xl">
                      <img src={img(t.id, 480, 336)} alt={t.title} width={480} height={336} loading="eager" decoding="async" className="aspect-[10/7] w-full bg-[#2a2420] object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-3 left-4 font-display text-base font-bold sm:bottom-4 sm:text-lg">{t.title}</span>
                      <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white text-[#1a1a1a] opacity-0 transition-opacity group-hover:opacity-100 sm:bottom-4 sm:right-4 sm:h-9 sm:w-9">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───────── TESTIMONIALS (swipe on mobile, grid on desktop) ───────── */}
        <section id="testimonials" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHead label="Owner feedback" title="Loved by local store owners." />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerParent}
              className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0"
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.figure
                  variants={staggerChild}
                  key={t.author}
                  className={`flex w-[85%] shrink-0 snap-center flex-col justify-between rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:w-[60%] sm:p-8 md:w-auto ${i === 1 ? 'bg-[#e49b6b] text-white' : 'border border-[#e49b6b]/20 bg-white'}`}
                >
                  <div>
                    <div className="mb-5 flex gap-1">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${i === 1 ? 'fill-white text-white' : 'fill-[#e49b6b] text-[#e49b6b]'}`} />
                      ))}
                    </div>
                    <blockquote className={`text-[15px] font-medium leading-relaxed sm:text-base ${i === 1 ? 'text-white' : 'text-[#1a1a1a]'}`}>“{t.quote}”</blockquote>
                  </div>
                  <figcaption className={`mt-8 flex items-center gap-3 border-t pt-5 ${i === 1 ? 'border-white/25' : 'border-zinc-100'}`}>
                    <span className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold uppercase ${i === 1 ? 'bg-white text-[#b86938]' : 'bg-[#fbf6f0] text-[#1a1a1a]'}`}>{t.author.slice(0, 2)}</span>
                    <div>
                      <span className="block text-sm font-bold">{t.author}</span>
                      <span className={`block text-xs ${i === 1 ? 'text-white/80' : 'text-zinc-500'}`}>{t.role}</span>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
            <p className="mt-4 text-center text-xs font-semibold text-[#5c5249] md:hidden">Swipe for more →</p>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section id="faq" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <motion.div {...reveal} className="text-center lg:text-left">
              <SectionLabel>Support</SectionLabel>
              <h2 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">Questions & answers.</h2>
              <p className="mt-4 text-[#5c5249]">Clear details on pricing, setup, hosting, and domains.</p>
              <Link to="/register" className="mt-6 inline-flex items-center gap-2 font-bold text-[#b86938] hover:underline sm:mt-8">
                Still curious? Try it free <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerParent}
              className="space-y-2 rounded-[1.75rem] bg-[#fbf6f0] p-2 sm:space-y-3 sm:rounded-[2rem] sm:p-4"
            >
              {[
                { q: 'How does Jaalam build a website in 60 seconds?', a: 'Jaalam hosts pre-structured layouts tailored for local storefronts. You type in your location details, pricing, and operating times, and our compiler automatically shapes a lightweight, custom-themed website. No database configurations or coding required.' },
                { q: 'Do I need to pay for web hosting or domain registration?', a: 'No. All accounts include secure cloud hosting on our global edge CDN network. You receive a free customizable subdomain (myjaalam.com/business). We maintain SSL certificates, server upkeep, and loading speeds out-of-the-box.' },
                { q: 'What is the purpose of the storefront QR code?', a: 'The storefront QR code links offline visitors to your digital details. Print and display it on table stands, entry doors, or registers. When clients scan the code, they instantly see menu items, price lists, or booking details on their phones.' },
                { q: 'Can I customize details or upload menu/service items later?', a: 'Yes. We provide a clean, simple Admin Dashboard. You can modify hours, swap pictures, add or delete pricing tiers, change social links, and rearrange text blocks. Everything updates on the public page in real-time.' },
                { q: 'Are these websites optimized for search engines (SEO)?', a: 'Yes! Unlike complex site builders that load heavy scripts and slow down, Jaalam generates clean semantic markup. Speed is a top ranking factor for local search, so our lightweight design helps you score higher on Google and Bing.' },
              ].map((f) => (
                <motion.div key={f.q} variants={staggerChild}>
                  <FAQItem question={f.q} answer={f.a} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───────── CTA (zooms in with scroll) ───────── */}
        <section className="px-3 py-16 sm:px-6 sm:py-24">
          <motion.div
            ref={ctaRef}
            style={{ scale: ctaScale, borderRadius: ctaRadius }}
            className="relative mx-auto max-w-6xl overflow-hidden bg-gradient-to-br from-[#e49b6b] to-[#b86938] px-5 py-14 text-center text-white sm:px-16 sm:py-20"
          >
            <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full border-[36px] border-white/10" />
            <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-16 h-96 w-96 rounded-full border-[40px] border-black/10" />
            <motion.div initial={{ scale: 0, rotate: -30 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="relative mx-auto w-fit">
              <Zap className="h-10 w-10 text-[#fce2c6]" />
            </motion.div>
            <motion.h2 {...reveal} className="relative mx-auto mt-6 max-w-2xl font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Ready to launch your business online?
            </motion.h2>
            <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="relative mx-auto mt-5 max-w-xl text-sm text-white/85 sm:text-base">
              Join salon owners, restaurant managers, gym coaches, and local services using Jaalam to reach local clients.
            </motion.p>
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.2 }} className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
              <Link to="/register" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto">
                Create my site free <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 font-bold transition-colors hover:bg-white/10 sm:w-auto">
                Access dashboard <ArrowUpRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ───────── FOOTER ───────── */}
        <footer className="border-t border-[#e49b6b]/20 px-4 pb-28 pt-12 sm:px-6 md:pb-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-[#5c5249] md:flex-row">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Jaalam" width={32} height={32} loading="lazy" className="h-8 w-8 object-contain" />
              <span className="font-display text-lg font-extrabold text-[#1a1a1a]">JAALAM</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={(e) => goTo(e, l.href)} className="transition-colors hover:text-[#1a1a1a]">{l.label}</a>
              ))}
            </div>
            <p className="text-center">© {new Date().getFullYear()} Jaalam Inc. All rights reserved.</p>
          </div>
        </footer>

        {/* ───────── MOBILE STICKY CTA ───────── */}
        <AnimatePresence>
          {showMobileCta && !isMobileMenuOpen && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed inset-x-3 z-40 md:hidden"
              style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center justify-between gap-3 rounded-full bg-[#1a1a1a] py-2 pl-5 pr-2 text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]">
                <span className="text-sm font-semibold">Launch your site in 60s</span>
                <Link to="/register" className="inline-flex items-center gap-1.5 rounded-full bg-[#e49b6b] px-4 py-2.5 text-sm font-bold">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
