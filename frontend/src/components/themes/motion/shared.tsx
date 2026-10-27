import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { MOTION_PRESETS, type MotionItem, type MotionPreset, type MotionService } from './presets';
import { resolveBusinessType } from '../registry';
import ProductModal from '../../shared/ProductModal';
import AllProductsModal from '../../shared/AllProductsModal';
import { getStats } from '../shared/ThemeStats';

/** Everything a motion layout needs, with owner content layered over the category preset. */
export interface MotionData {
  /** Business category key into MOTION_PRESETS (and each theme's per-category looks). */
  category: string;
  preset: MotionPreset;
  siteName: string;
  logo?: string;
  heroTitle: string;
  heroText: string;
  aboutTitle: string;
  aboutText: string;
  services: MotionService[];
  items: MotionItem[];
  gallery: string[];
  heroImages: string[];
  video?: string;
  contact: { phone?: string; email?: string; address?: string; whatsapp?: string };
  order: string[];
  /** True when a whole section is hidden in the editor. */
  isHidden: (section: string) => boolean;
  /** True when a single field is hidden in the editor. */
  hideField: (field: string) => boolean;
  /** Owner stats (Editor → Stats), else the category defaults. */
  stats: { value: string; label: string }[];
  customBlocks: any[];
}

const toUrl = (g: any) => (typeof g === 'string' ? g : g?.url || g?.image);

export function useMotionData(website: any, content: any): MotionData {
  const resolved = resolveBusinessType(website?.business_type);
  const category = MOTION_PRESETS[resolved] ? resolved : 'Other';
  const preset = MOTION_PRESETS[category];
  const s = content?.settings_json || {};
  const hiddenSections: string[] = s.hidden_sections || [];
  const hiddenFields: string[] = s.hidden_elements || [];
  const info = content?.contact_info || {};
  const address = typeof info.address === 'object' && info.address ? Object.values(info.address).filter(Boolean).join(', ') : info.address;

  const ownServices = (content?.services_json || [])
    .map((x: any) => (typeof x === 'string' ? { title: x, description: '' } : { title: x.title || x.name, description: x.description || '' }))
    .filter((x: MotionService) => x.title);
  const ownItems = (content?.products_json || []).filter((p: any) => p?.name);
  const ownGallery = (content?.gallery_json || []).map(toUrl).filter(Boolean);
  const heroImage = s.hero_image || content?.hero_image;

  return {
    category,
    preset,
    siteName: s.website_name || website?.slug || preset.label,
    logo: s.logo_image,
    heroTitle: content?.hero_title || preset.heroTitle,
    heroText: content?.hero_description || content?.hero_text || preset.heroText,
    aboutTitle: s.about_title || content?.about_title || preset.aboutTitle,
    aboutText: s.about_description || content?.about_text || preset.aboutText,
    services: ownServices.length ? ownServices : preset.services,
    items: ownItems.length ? ownItems : preset.items,
    gallery: ownGallery.length ? ownGallery : preset.gallery,
    heroImages: heroImage ? [heroImage, ...preset.hero.slice(1)] : preset.hero,
    video: s.hero_video || content?.hero_video || undefined,
    contact: { phone: info.phone, email: info.email, address, whatsapp: info.whatsapp },
    order: s.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'],
    isHidden: (section: string) => section !== 'hero' && hiddenSections.includes(section),
    hideField: (field: string) => hiddenFields.includes(field),
    stats: getStats(content).length ? getStats(content).slice(0, 4) : preset.stats,
    customBlocks: content?.custom_blocks_json || [],
  };
}

/** Keyframes shared by all motion layouts. */
export function MotionStyles({ fonts }: { fonts: string }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?${fonts}&display=swap');
      @keyframes mt-kenburns { 0% { transform: scale(1.08) translate3d(0,0,0); } 100% { transform: scale(1.22) translate3d(-2%,-2%,0); } }
      @keyframes mt-fade { 0%, 28% { opacity: 1; } 34%, 94% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes mt-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
      @keyframes mt-rise { from { opacity: 0; transform: translate3d(0,28px,0); } to { opacity: 1; transform: none; } }
      @keyframes mt-float { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4%,-6%,0) scale(1.08); } }
      @keyframes mt-spin { to { transform: rotate(360deg); } }
      .mt-rise { animation: mt-rise 1s cubic-bezier(.2,.7,.2,1) both; }
      .mt-d1 { animation-delay: .15s; } .mt-d2 { animation-delay: .3s; } .mt-d3 { animation-delay: .45s; } .mt-d4 { animation-delay: .6s; }
      @media (prefers-reduced-motion: reduce) { .mt-motion, .mt-motion * { animation: none !important; } }
    `}</style>
  );
}

/** Google font pairs the motion looks pick from. `q` is the css2 family query. */
export const FONTS = {
  syne: { q: 'Syne:wght@600;700;800', css: "'Syne',sans-serif", w: 700 },
  inter: { q: 'Inter:wght@400;500;600', css: "'Inter',sans-serif", w: 600 },
  spaceGrotesk: { q: 'Space+Grotesk:wght@400;500;600;700', css: "'Space Grotesk',sans-serif", w: 600 },
  fraunces: { q: 'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400', css: "'Fraunces',serif", w: 400 },
  unbounded: { q: 'Unbounded:wght@500;700;800', css: "'Unbounded',sans-serif", w: 700 },
  jetbrains: { q: 'JetBrains+Mono:wght@400;500', css: "'JetBrains Mono',monospace", w: 500 },
  cormorant: { q: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300', css: "'Cormorant Garamond',serif", w: 400 },
  jost: { q: 'Jost:wght@300;400;500', css: "'Jost',sans-serif", w: 400 },
  playfair: { q: 'Playfair+Display:ital,wght@0,400;0,600;0,800;1,400', css: "'Playfair Display',serif", w: 600 },
  bebas: { q: 'Bebas+Neue', css: "'Bebas Neue',sans-serif", w: 400 },
  oswald: { q: 'Oswald:wght@400;500;600;700', css: "'Oswald',sans-serif", w: 600 },
  dmSerif: { q: 'DM+Serif+Display:ital@0;1', css: "'DM Serif Display',serif", w: 400 },
  manrope: { q: 'Manrope:wght@400;500;600;700', css: "'Manrope',sans-serif", w: 700 },
  outfit: { q: 'Outfit:wght@300;400;500;600;700', css: "'Outfit',sans-serif", w: 600 },
  bricolage: { q: 'Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800', css: "'Bricolage Grotesque',sans-serif", w: 700 },
  instrument: { q: 'Instrument+Serif:ital@0;1', css: "'Instrument Serif',serif", w: 400 },
  poppins: { q: 'Poppins:wght@400;500;600;700', css: "'Poppins',sans-serif", w: 600 },
  archivo: { q: 'Archivo+Black', css: "'Archivo Black',sans-serif", w: 400 },
  orbitron: { q: 'Orbitron:wght@500;700;900', css: "'Orbitron',sans-serif", w: 700 },
  rubikMono: { q: 'Rubik+Mono+One', css: "'Rubik Mono One',sans-serif", w: 400 },
  cinzel: { q: 'Cinzel:wght@400;500;600', css: "'Cinzel',serif", w: 500 },
  italiana: { q: 'Italiana', css: "'Italiana',serif", w: 400 },
  bodoni: { q: 'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400', css: "'Bodoni Moda',serif", w: 500 },
  marcellus: { q: 'Marcellus', css: "'Marcellus',serif", w: 400 },
  lora: { q: 'Lora:ital,wght@0,400;0,600;1,400', css: "'Lora',serif", w: 500 },
} as const;
export type FontKey = keyof typeof FONTS;

/** Loads a look's fonts and maps them onto .font-display / .font-body / .font-mono. */
export function ThemeFonts({ display, body, mono }: { display: FontKey; body: FontKey; mono?: FontKey }) {
  const keys = [...new Set([display, body, ...(mono ? [mono] : [])])];
  const D = FONTS[display], B = FONTS[body], M = mono ? FONTS[mono] : null;
  return (
    <>
      <MotionStyles fonts={keys.map(k => `family=${FONTS[k].q}`).join('&')} />
      <style>{`.mt-root .font-display{font-family:${D.css};font-weight:${D.w}}.mt-root .font-body{font-family:${B.css}}${M ? `.mt-root .font-mono{font-family:${M.css}}` : ''}`}</style>
    </>
  );
}

/** A theme's look for this category, falling back to its 'Other' look. */
export const pickLook = <T,>(looks: Record<string, T>, data: MotionData): T => looks[data.category] || looks.Other;

/**
 * Background video when the site has one, otherwise a slow cross-fading Ken Burns
 * slideshow. Falls back to the slideshow if the video fails to load.
 */
export function HeroMedia({ video, images, className = '' }: { video?: string; images: string[]; className?: string }) {
  // Remember which link failed, so a corrected link gets a fresh try
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const videoFailed = !!video && failedUrl === video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const slides = images.slice(0, 3);

  // A bad link can fail before React's onError is attached, so also check the element itself
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) return;
    const fail = () => setFailedUrl(video);
    if (el.error) fail();
    el.addEventListener('error', fail);
    return () => el.removeEventListener('error', fail);
  }, [video]);

  if (video && !videoFailed) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video}
          poster={slides[0]}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden bg-black mt-motion ${className}`}>
      {slides.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0"
          style={slides.length > 1 ? { animation: `mt-fade ${slides.length * 7}s linear ${i * 7}s infinite`, opacity: i === 0 ? 1 : 0 } : undefined}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover will-change-transform"
            style={{ animation: `mt-kenburns 14s ease-in-out ${i * 7}s infinite alternate` }}
          />
        </div>
      ))}
    </div>
  );
}

export function Marquee({ words, className = '', separator = '✦', speed = 30 }: { words: string[]; className?: string; separator?: string; speed?: number }) {
  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden whitespace-nowrap mt-motion ${className}`}>
      <div className="inline-flex" style={{ animation: `mt-marquee ${speed}s linear infinite` }}>
        {[0, 1].map(k => (
          <span key={k} className="inline-flex items-center">
            {row.map((w, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="px-6">{w}</span>
                <span className="opacity-50">{separator}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Responsive top bar with a full-screen mobile menu. Colours come from the caller. */
export function MotionNav({ data, links, barClass, solidClass, menuClass, cta, logoClass = '', bg }: {
  data: MotionData;
  links: { href: string; label: string }[];
  barClass: string;
  solidClass: string;
  menuClass: string;
  cta?: ReactNode;
  logoClass?: string;
  /** Page background (hex); tints the scrolled bar and fills the mobile menu. */
  bg?: string;
}) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${solid ? solidClass : barClass}`} style={solid && bg ? { background: `${bg}e0` } : undefined}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-6">
          <a href="#hero" className={`flex items-center gap-3 min-w-0 ${logoClass}`}>
            {data.logo && <img src={data.logo} alt={data.siteName} className="h-8 md:h-10 w-auto object-contain" />}
            <span className="truncate">{data.siteName}</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {links.map(l => <a key={l.href} href={l.href} className="opacity-80 hover:opacity-100 transition-opacity">{l.label}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            {cta && <span className="hidden md:inline-flex">{cta}</span>}
            <button className="md:hidden p-2 -mr-2" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={24} /></button>
          </div>
        </div>
      </header>
      {open && (
        <div className={`fixed inset-0 z-[60] flex flex-col p-6 ${menuClass}`} style={bg ? { background: bg } : undefined}>
          <button className="self-end p-2" onClick={() => setOpen(false)} aria-label="Close menu"><X size={28} /></button>
          <nav className="flex-1 flex flex-col justify-center gap-6 text-3xl">
            {links.map((l, i) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="mt-rise" style={{ animationDelay: `${i * 0.06}s` }}>{l.label}</a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

/** Nav links for the sections that are visible, in the owner's order. */
export function navLinks(data: MotionData, labels: Partial<Record<string, string>> = {}) {
  const defaults: Record<string, string> = { about: 'About', services: 'Services', menu: data.preset.itemsTitle.split(' ').slice(-1)[0], gallery: 'Gallery', contact: 'Contact' };
  return data.order
    .filter(s => s !== 'hero' && s !== 'custom' && defaults[s] && !data.isHidden(s))
    .map(s => ({ href: `#${s}`, label: labels[s] || defaults[s] }));
}

/** Renders sections in the owner's order, skipping hidden ones. */
export function Sections({ data, sections }: { data: MotionData; sections: Record<string, ReactNode> }) {
  return (
    <>
      {data.order.map(key => {
        if (data.isHidden(key) || !sections[key]) return null;
        return <div key={key} className="contents">{sections[key]}</div>;
      })}
    </>
  );
}

export function CustomBlocks({ data, className = '' }: { data: MotionData; className?: string }) {
  if (!data.customBlocks.length) return null;
  return (
    <section id="custom" className={`py-20 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {data.customBlocks.map((block: any) => {
          if (block.type === 'heading') return <h2 key={block.id} className="text-3xl md:text-5xl font-bold break-words">{block.content}</h2>;
          if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 whitespace-pre-wrap break-words">{block.content}</p>;
          if (block.type === 'image' && block.url) return <img key={block.id} src={block.url || undefined} alt="" loading="lazy" className="w-full rounded-2xl" />;
          if (block.type === 'divider') return <hr key={block.id} className="opacity-20" />;
          return null;
        })}
      </div>
    </section>
  );
}

/** Product detail + "view all" popups wired to the shared modals. */
export function useProductModals(data: MotionData, content: any) {
  const [selected, setSelected] = useState<any>(null);
  const [showAll, setShowAll] = useState(false);
  const modals = (
    <>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} contactInfo={content?.contact_info || {}} content={content} />}
      <AllProductsModal isOpen={showAll} onClose={() => setShowAll(false)} products={data.items} onProductSelect={setSelected} />
    </>
  );
  return { open: setSelected, openAll: () => setShowAll(true), modals };
}

export const telHref = (phone?: string) => (phone ? `tel:${phone.replace(/\s+/g, '')}` : undefined);
export const mapHref = (address?: string) => (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : undefined);
