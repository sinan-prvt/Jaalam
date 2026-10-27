import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Zap } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, Marquee, MotionNav, Sections, ThemeFonts, mapHref, navLinks, pickLook, telHref, useMotionData, useProductModals, type FontKey } from './shared';

interface Look {
  bg: string;
  display: FontKey;
  body: FontKey;
  /** tilt: text beside a tilted video card · billboard: giant headline over a video band · scanline: full-bleed video with a CRT overlay */
  hero: 'tilt' | 'billboard' | 'scanline';
  /** grid: square cards · ticker: terminal-style price rows · cut: clipped-corner cards */
  items: 'grid' | 'ticker' | 'cut';
  services: 'tiles' | 'rows';
  pattern: 'grid' | 'dots' | 'lines';
}

/** A different signal of Neon Pulse for every business category. */
const LOOKS: Record<string, Look> = {
  'Restaurant': { bg: '#050302', display: 'archivo', body: 'spaceGrotesk', hero: 'scanline', items: 'ticker', services: 'rows', pattern: 'lines' },
  'Cafe / Bakery': { bg: '#07040a', display: 'rubikMono', body: 'outfit', hero: 'billboard', items: 'cut', services: 'tiles', pattern: 'dots' },
  'Salon / Spa': { bg: '#09020a', display: 'syne', body: 'outfit', hero: 'tilt', items: 'ticker', services: 'rows', pattern: 'dots' },
  'Gym / Fitness': { bg: '#000000', display: 'bebas', body: 'inter', hero: 'scanline', items: 'cut', services: 'tiles', pattern: 'grid' },
  'Retail Store': { bg: '#020208', display: 'unbounded', body: 'spaceGrotesk', hero: 'billboard', items: 'grid', services: 'rows', pattern: 'grid' },
  'Stationery / Books': { bg: '#020617', display: 'orbitron', body: 'manrope', hero: 'tilt', items: 'cut', services: 'tiles', pattern: 'dots' },
  'Fancy Store': { bg: '#0a0208', display: 'syne', body: 'outfit', hero: 'billboard', items: 'cut', services: 'rows', pattern: 'dots' },
  'Chicken / Meat Stall': { bg: '#080000', display: 'oswald', body: 'inter', hero: 'tilt', items: 'ticker', services: 'tiles', pattern: 'lines' },
  'Scrap Dealer': { bg: '#000805', display: 'orbitron', body: 'spaceGrotesk', hero: 'scanline', items: 'ticker', services: 'rows', pattern: 'grid' },
  'Supermarket / Grocery': { bg: '#000a03', display: 'rubikMono', body: 'manrope', hero: 'tilt', items: 'grid', services: 'tiles', pattern: 'dots' },
  'Textiles / Garments': { bg: '#0a0306', display: 'unbounded', body: 'jost', hero: 'scanline', items: 'cut', services: 'rows', pattern: 'lines' },
  'Real Estate': { bg: '#00040a', display: 'spaceGrotesk', body: 'inter', hero: 'billboard', items: 'cut', services: 'tiles', pattern: 'grid' },
  'Consulting': { bg: '#03030a', display: 'orbitron', body: 'inter', hero: 'billboard', items: 'ticker', services: 'rows', pattern: 'lines' },
  'Other': { bg: '#000000', display: 'unbounded', body: 'spaceGrotesk', hero: 'tilt', items: 'grid', services: 'tiles', pattern: 'grid' },
};

const CUT = 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))';

function Title({ kicker, accent, children }: { kicker: string; accent: string; children: string }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>// {kicker}</p>
      <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.95] break-words">{children}</h2>
    </div>
  );
}

/** Neon Pulse: black canvas, glowing accent and restless motion. Layout varies by category. */
export default function NeonTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const look = pickLook(LOOKS, d);
  const { accent, accent2 } = d.preset;
  const glow = { textShadow: `0 0 24px ${accent}99` };

  const ctas = (
    <>
      <a href="#menu" className="group inline-flex items-center gap-3 px-7 py-4 font-display uppercase text-sm text-black transition-shadow hover:shadow-[0_0_40px_var(--mt-accent)]" style={{ background: accent }}>
        {d.preset.ctaPrimary} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </a>
      <a href="#about" className="inline-flex items-center px-7 py-4 font-display uppercase text-sm border border-white/30 hover:border-white transition-colors">{d.preset.ctaSecondary}</a>
    </>
  );
  const marquees = (
    <div className="relative mt-16">
      <div className="-rotate-2 scale-105 py-3 font-display uppercase text-xl md:text-3xl text-black" style={{ background: accent }}>
        <Marquee words={d.preset.marquee} separator="✺" speed={25} />
      </div>
      <div className="rotate-1 scale-105 -mt-2 py-3 font-display uppercase text-xl md:text-3xl border-y border-white/20 text-white/90" style={{ background: look.bg }}>
        <Marquee words={[...d.preset.marquee].reverse()} separator="✺" speed={35} />
      </div>
    </div>
  );

  const heroes = {
    tilt: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-10">
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <span className="mt-rise inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] border px-3 py-1.5 mb-8" style={{ borderColor: accent, color: accent }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} /> Live · {d.preset.label}
            </span>
            {!d.hideField('hero_title') && (
              <h1 className="mt-rise mt-d1 font-display uppercase text-[12vw] sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tight break-words [text-wrap:balance]">{d.heroTitle}</h1>
            )}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-lg text-white/60 max-w-xl leading-relaxed">{d.heroText}</p>}
            <div className="mt-rise mt-d3 mt-10 flex flex-wrap gap-4">{ctas}</div>
          </div>
          <div className="lg:col-span-5 mt-rise mt-d2">
            <div className="relative aspect-[4/5] rotate-3 hover:rotate-0 transition-transform duration-700 rounded-3xl overflow-hidden border-2" style={{ borderColor: accent, boxShadow: `0 0 60px -10px ${accent}, inset 0 0 40px ${accent}33` }}>
              <HeroMedia video={d.video} images={d.heroImages} />
              <div className="absolute inset-0 mix-blend-color opacity-25" style={{ background: accent }} />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[11px] uppercase tracking-widest text-white/80">
                <span>● REC</span><span>{d.stats[0].value} {d.stats[0].label}</span>
              </div>
            </div>
          </div>
        </div>
        {marquees}
      </section>
    ),
    billboard: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-10">
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8">
          <div className="mt-rise flex justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6">
            <span style={{ color: accent }}>● {d.preset.label}</span><span>{d.preset.marquee.slice(0, 2).join(' / ')}</span>
          </div>
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display uppercase text-[11vw] lg:text-[6rem] leading-[0.9] tracking-tight break-words [text-wrap:balance]">
              {d.heroTitle.split(' ').map((w, i) => (
                <span key={i} style={i % 2 ? { WebkitTextStroke: `2px ${accent}`, color: 'transparent' } : undefined}>{w} </span>
              ))}
            </h1>
          )}
        </div>
        <div className="mt-rise mt-d2 relative h-[38svh] md:h-[44svh] mt-10 overflow-hidden border-y-2" style={{ borderColor: accent, boxShadow: `0 0 50px -10px ${accent}` }}>
          <HeroMedia video={d.video} images={d.heroImages} />
          <div className="absolute inset-0 mix-blend-color opacity-30" style={{ background: accent2 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-5 md:px-8 flex flex-col justify-end md:justify-center gap-6 pb-6 md:pb-0">
            {!d.hideField('hero_description') && <p className="text-base md:text-lg text-white/85 max-w-md leading-relaxed">{d.heroText}</p>}
            <div className="flex flex-wrap gap-3">{ctas}</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-5 md:px-8 mt-8 grid grid-cols-3 gap-4">
          {d.stats.map(s => (
            <div key={s.label} className="border-l-2 pl-4" style={{ borderColor: accent }}>
              <div className="font-display text-xl md:text-3xl" style={glow}>{s.value}</div>
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    ),
    scanline: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden px-5 pt-24 pb-28">
        <HeroMedia video={d.video} images={d.heroImages} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.6) 0 2px, transparent 2px 4px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 160px ${look.bg}` }} />
        {['top-24 left-5 md:left-8', 'top-24 right-5 md:right-8', 'bottom-8 left-5 md:left-8', 'bottom-8 right-5 md:right-8'].map((pos, i) => (
          <span key={pos} className={`absolute ${pos} font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/70`}>
            {[`● ${d.preset.label}`, `CH-${String(new Date().getFullYear() % 100).padStart(2, '0')}`, `${d.stats[0].value} ${d.stats[0].label}`, `${d.stats[1]?.value || ''} ${d.stats[1]?.label || ''}`][i]}
          </span>
        ))}
        <div className="relative z-10 max-w-5xl">
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display uppercase text-[12vw] sm:text-6xl lg:text-[6.5rem] leading-[0.92] tracking-tight break-words [text-wrap:balance]" style={{ textShadow: `3px 0 0 ${accent}, -3px 0 0 ${accent2}` }}>
              {d.heroTitle}
            </h1>
          )}
          {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">{d.heroText}</p>}
          <div className="mt-rise mt-d3 mt-10 flex flex-wrap justify-center gap-4">{ctas}</div>
        </div>
        <div className="absolute bottom-0 inset-x-0 py-2.5 font-mono uppercase text-xs md:text-sm text-black" style={{ background: accent }}>
          <Marquee words={d.preset.marquee} separator="///" speed={22} />
        </div>
      </section>
    ),
  };

  const itemLayouts = {
    grid: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {d.items.slice(0, 8).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group text-left border border-white/15 hover:border-white/60 transition-colors">
            <div className="aspect-square overflow-hidden relative">
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />}
              {p.price && <span className="absolute top-0 right-0 px-3 py-1.5 font-mono text-sm text-black" style={{ background: accent }}>{p.price}</span>}
            </div>
            <div className="p-5">
              <h3 className="font-display uppercase text-lg leading-tight">{p.name}</h3>
              {p.description && <p className="text-sm text-white/50 mt-2 line-clamp-2">{p.description}</p>}
            </div>
          </button>
        ))}
      </div>
    ),
    ticker: (
      <div className="border border-white/15 font-mono">
        <div className="flex justify-between px-4 md:px-6 py-3 border-b border-white/15 text-[11px] uppercase tracking-widest text-white/40">
          <span>Item</span><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} /> Live price</span>
        </div>
        {d.items.slice(0, 10).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 px-4 md:px-6 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/[0.04] transition-colors">
            <div className="w-14 h-14 md:w-16 md:h-16 overflow-hidden border border-white/15">
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-display uppercase text-base md:text-xl leading-tight truncate"><span className="text-white/30 mr-2">&gt;</span>{p.name}</h3>
              {p.description && <p className="text-xs md:text-sm text-white/45 mt-1 truncate">{p.description}</p>}
            </div>
            {p.price && <span className="text-base md:text-xl whitespace-nowrap" style={{ color: accent, ...glow }}>{p.price}</span>}
          </button>
        ))}
      </div>
    ),
    cut: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {d.items.slice(0, 6).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group text-left p-[2px] transition-all duration-500" style={{ clipPath: CUT, background: i % 2 ? accent2 : accent }}>
            <div className="h-full" style={{ clipPath: CUT, background: look.bg }}>
              <div className="aspect-[4/3] overflow-hidden relative">
                {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
                <span className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-widest text-white/80">#{String(i + 1).padStart(3, '0')}</span>
              </div>
              <div className="p-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display uppercase text-lg md:text-xl leading-tight">{p.name}</h3>
                  {p.description && <p className="text-sm text-white/50 mt-2 line-clamp-2">{p.description}</p>}
                </div>
                {p.price && <span className="font-mono text-sm shrink-0" style={{ color: i % 2 ? accent2 : accent }}>{p.price}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    ),
  };

  const serviceLayouts = {
    tiles: (
      <div className="grid md:grid-cols-3 gap-4">
        {d.services.map((s, i) => (
          <div key={i} className="group relative border border-white/15 hover:border-[var(--mt-accent)] p-8 min-h-[280px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <span className="font-display text-6xl text-white/10 group-hover:text-white/30 transition-colors">{String(i + 1).padStart(2, '0')}</span>
              <Zap size={22} style={{ color: i % 2 ? accent2 : accent }} />
            </div>
            <div>
              <h3 className="font-display uppercase text-2xl mb-3">{s.title}</h3>
              <p className="text-white/55 leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    rows: (
      <div className="border-t border-white/15">
        {d.services.map((s, i) => (
          <div key={i} className="group relative overflow-hidden border-b border-white/15">
            <div className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: accent }} />
            <div className="relative grid md:grid-cols-12 gap-3 md:gap-8 items-center py-8 md:py-10 px-2 md:px-4 group-hover:text-black transition-colors duration-500">
              <span className="md:col-span-1 font-mono text-sm opacity-50">0{i + 1}</span>
              <h3 className="md:col-span-5 font-display uppercase text-2xl md:text-4xl leading-tight">{s.title}</h3>
              <p className="md:col-span-5 opacity-70 leading-relaxed">{s.description}</p>
              <ArrowUpRight className="hidden md:block md:col-span-1 justify-self-end" />
            </div>
          </div>
        ))}
      </div>
    ),
  };

  const sections = {
    hero: heroes[look.hero],
    about: (
      <section id="about" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Title accent={accent} kicker="about">{d.hideField('about_title') ? '' : d.aboutTitle}</Title>
            {!d.hideField('about_text') && <p className="text-lg text-white/65 leading-relaxed -mt-4 whitespace-pre-line">{d.aboutText}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {d.stats.map(s => (
              <div key={s.label} className="aspect-square border border-white/15 flex flex-col justify-end p-4 md:p-6 hover:border-white/60 transition-colors">
                <div className="font-display text-2xl md:text-4xl" style={{ color: accent, ...glow }}>{s.value}</div>
                <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50 mt-2">{s.label}</div>
              </div>
            ))}
            <div className="col-span-3 aspect-[3/1] overflow-hidden">
              <img loading="lazy" src={d.gallery[0]} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <Title accent={accent} kicker="services">What we do</Title>
          {serviceLayouts[look.services]}
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6">
            <Title accent={accent} kicker="catalogue">{d.preset.itemsTitle}</Title>
            <button onClick={openAll} className="mb-12 font-mono text-xs uppercase tracking-widest border-b pb-1 shrink-0" style={{ color: accent, borderColor: accent }}>All →</button>
          </div>
          {itemLayouts[look.items]}
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <Title accent={accent} kicker="gallery">In the wild</Title>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {d.gallery.map((src, i) => (
              <div key={i} className={`relative overflow-hidden group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover aspect-square grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: `inset 0 0 0 2px ${accent}` }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    contact: (
      <section id="contact" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">
          <div>
            <h2 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] mb-10">Let’s<br /><span style={{ color: accent, ...glow }}>talk</span></h2>
            <div className="space-y-4 font-mono">
              {d.contact.phone && !d.hideField('contact_phone') && <a href={telHref(d.contact.phone)} className="flex items-center gap-4 hover:text-white text-white/75"><Phone size={18} style={{ color: accent }} /> {d.contact.phone}</a>}
              {d.contact.email && !d.hideField('contact_email') && <a href={`mailto:${d.contact.email}`} className="flex items-center gap-4 hover:text-white text-white/75 break-all"><Mail size={18} style={{ color: accent }} /> {d.contact.email}</a>}
              {d.contact.address && !d.hideField('contact_address') && <a href={mapHref(d.contact.address)} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:text-white text-white/75"><MapPin size={18} className="mt-0.5 shrink-0" style={{ color: accent }} /> {d.contact.address}</a>}
            </div>
            <ContactExtras content={content} align="left" className="mt-10" accent={accent} />
          </div>
          <div className="border border-white/15 p-6 md:p-10">
            <ContactForm websiteId={website?.id} primaryColor="bg-[var(--mt-accent)] !text-black" primaryColorHover="hover:opacity-90" buttonShape="rounded-none" />
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  const pattern = {
    grid: { backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' },
    dots: { backgroundImage: 'radial-gradient(#fff 1.2px, transparent 1.2px)', backgroundSize: '26px 26px' },
    lines: { backgroundImage: 'repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 22px)' },
  }[look.pattern];

  return (
    <div className="mt-root relative min-h-screen text-white font-body overflow-x-clip" style={{ background: look.bg, ['--mt-accent' as any]: accent }}>
      <ThemeFonts display={look.display} body={look.body} mono="jetbrains" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[120svh] opacity-[0.1]" style={{ ...pattern, maskImage: 'radial-gradient(ellipse at 50% 30%,black 20%,transparent 70%)' }} aria-hidden />
      <div className="relative">
        <MotionNav
          data={d}
          links={navLinks(d)}
          barClass="text-white"
          solidClass="text-white backdrop-blur-md border-b border-white/10"
          menuClass="text-white font-display uppercase"
          logoClass="font-display uppercase text-base md:text-lg tracking-tight"
          cta={<a href="#contact" className="px-5 py-2.5 text-sm font-display uppercase text-black" style={{ background: accent }}>{d.preset.ctaPrimary}</a>}
          bg={look.bg}
        />
        <Sections data={d} sections={sections} />
        <footer className="border-t border-white/10 py-10 px-5 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-3 font-mono text-xs uppercase tracking-widest text-white/40">
            <span>{d.siteName}</span><span>© {new Date().getFullYear()} — All rights reserved</span>
          </div>
        </footer>
      </div>
      {modals}
    </div>
  );
}
