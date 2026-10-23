import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Play } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, Marquee, MotionNav, Sections, ThemeFonts, mapHref, navLinks, pickLook, telHref, useMotionData, useProductModals, type FontKey } from './shared';

interface Look {
  bg: string;
  bg2: string;
  display: FontKey;
  body: FontKey;
  /** frame: full-bleed with title bottom-left · letterbox: widescreen bars · split: text column beside a tall video panel */
  hero: 'frame' | 'letterbox' | 'split';
  /** posters: tall cards · reel: indexed rows · feature: one large card plus a grid */
  items: 'posters' | 'reel' | 'feature';
  services: 'list' | 'cards';
  /** Corner radius for cards and frames. */
  r: string;
  upper?: boolean;
}

/** A different cut of Cinematic for every business category. */
const LOOKS: Record<string, Look> = {
  'Restaurant': { bg: '#120c08', bg2: '#1a120c', display: 'playfair', body: 'inter', hero: 'letterbox', items: 'feature', services: 'cards', r: '1.25rem' },
  'Cafe / Bakery': { bg: '#16100b', bg2: '#1f1610', display: 'dmSerif', body: 'manrope', hero: 'split', items: 'posters', services: 'list', r: '2rem' },
  'Salon / Spa': { bg: '#120a10', bg2: '#1a0f17', display: 'instrument', body: 'outfit', hero: 'frame', items: 'reel', services: 'cards', r: '2rem' },
  'Gym / Fitness': { bg: '#0a0a0a', bg2: '#141414', display: 'bebas', body: 'inter', hero: 'frame', items: 'feature', services: 'list', r: '0px', upper: true },
  'Retail Store': { bg: '#0b0d14', bg2: '#121520', display: 'syne', body: 'inter', hero: 'split', items: 'posters', services: 'cards', r: '1.5rem' },
  'Stationery / Books': { bg: '#0c1020', bg2: '#121831', display: 'fraunces', body: 'inter', hero: 'letterbox', items: 'reel', services: 'list', r: '0.75rem' },
  'Fancy Store': { bg: '#14080e', bg2: '#1d0d16', display: 'bodoni', body: 'jost', hero: 'split', items: 'feature', services: 'cards', r: '2.5rem' },
  'Chicken / Meat Stall': { bg: '#100606', bg2: '#190a0a', display: 'oswald', body: 'inter', hero: 'frame', items: 'reel', services: 'cards', r: '0.5rem', upper: true },
  'Scrap Dealer': { bg: '#0a0d0a', bg2: '#111611', display: 'archivo', body: 'spaceGrotesk', hero: 'letterbox', items: 'reel', services: 'list', r: '0px', upper: true },
  'Supermarket / Grocery': { bg: '#07110b', bg2: '#0c1a11', display: 'bricolage', body: 'manrope', hero: 'split', items: 'posters', services: 'cards', r: '1.75rem' },
  'Textiles / Garments': { bg: '#140a08', bg2: '#1e100c', display: 'cormorant', body: 'jost', hero: 'letterbox', items: 'feature', services: 'list', r: '0px' },
  'Real Estate': { bg: '#080c12', bg2: '#0e141c', display: 'instrument', body: 'manrope', hero: 'frame', items: 'feature', services: 'cards', r: '0.25rem' },
  'Consulting': { bg: '#090b12', bg2: '#10131c', display: 'spaceGrotesk', body: 'inter', hero: 'split', items: 'reel', services: 'list', r: '0.75rem' },
  'Other': { bg: '#07070a', bg2: '#0d0d12', display: 'syne', body: 'inter', hero: 'frame', items: 'posters', services: 'list', r: '1.5rem' },
};

const R = 'rounded-[var(--mt-r)]';

/** Cinematic: video-led hero, oversized type, dark film-like sections. Layout varies by category. */
export default function CinematicTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const look = pickLook(LOOKS, d);
  const accent = d.preset.accent;

  const ctas = (
    <>
      <a href="#menu" className="group inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03]" style={{ background: accent }}>
        {d.preset.ctaPrimary} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </a>
      <a href="#about" className="inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-colors">
        <Play size={16} fill="currentColor" /> {d.preset.ctaSecondary}
      </a>
    </>
  );

  const heroes = {
    frame: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <HeroMedia video={d.video} images={d.heroImages} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${look.bg}, rgba(0,0,0,.4), rgba(0,0,0,.3))` }} />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-5 md:px-8 pb-14 md:pb-20 pt-32">
          <p className="mt-rise flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.35em] text-white/70 mb-6">
            <span className="w-10 h-px" style={{ background: accent }} /> {d.preset.label}
          </p>
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display text-white text-[13vw] sm:text-7xl lg:text-[8.5rem] leading-[0.92] tracking-tight max-w-6xl [text-wrap:balance]">
              {d.heroTitle}
            </h1>
          )}
          <div className="mt-10 grid md:grid-cols-12 gap-8 items-end">
            {!d.hideField('hero_description') && (
              <p className="mt-rise mt-d2 md:col-span-6 text-lg md:text-xl text-white/75 leading-relaxed">{d.heroText}</p>
            )}
            <div className="mt-rise mt-d3 md:col-span-6 flex flex-wrap md:justify-end gap-3">{ctas}</div>
          </div>
        </div>
        <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm py-4 text-white/80 text-sm uppercase tracking-[0.3em]">
          <Marquee words={d.preset.marquee} />
        </div>
      </section>
    ),
    letterbox: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col bg-black pt-16 md:pt-20">
        <div className="flex justify-between items-center px-5 md:px-8 py-4 text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50">
          <span>A {d.preset.label} picture</span>
          <span className="hidden sm:inline">{d.preset.marquee.slice(0, 3).join(' · ')}</span>
        </div>
        <div className="relative flex-1 min-h-[55svh] overflow-hidden">
          <HeroMedia video={d.video} images={d.heroImages} />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 h-full min-h-[55svh] flex flex-col items-center justify-center text-center px-6 py-16">
            <span className="mt-rise w-14 h-px mb-8" style={{ background: accent }} />
            {!d.hideField('hero_title') && (
              <h1 className="mt-rise mt-d1 font-display text-white text-[11vw] sm:text-6xl lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-5xl [text-wrap:balance]">{d.heroTitle}</h1>
            )}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">{d.heroText}</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 px-5 md:px-8 py-6">
          <div className="text-white/60 text-xs md:text-sm uppercase tracking-[0.3em] overflow-hidden"><Marquee words={d.preset.marquee} separator="●" speed={40} /></div>
          <div className="mt-rise mt-d3 flex flex-wrap gap-3">{ctas}</div>
        </div>
      </section>
    ),
    split: (
      <section id="hero" className="relative min-h-[100svh] grid lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col justify-center px-5 md:px-12 lg:px-16 pt-28 pb-14 order-2 lg:order-1">
          <p className="mt-rise text-xs uppercase tracking-[0.35em] mb-8" style={{ color: accent }}>{d.preset.label} — {d.preset.marquee[0]}</p>
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display text-white text-5xl sm:text-6xl xl:text-[5.5rem] leading-[0.95] tracking-tight [text-wrap:balance]">{d.heroTitle}</h1>
          )}
          {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-lg text-white/65 leading-relaxed max-w-lg">{d.heroText}</p>}
          <div className="mt-rise mt-d3 mt-10 flex flex-wrap gap-3">{ctas}</div>
          <div className="mt-14 flex gap-10 border-t border-white/10 pt-8">
            {d.stats.map(s => (
              <div key={s.label}>
                <div className="font-display text-3xl" style={{ color: accent }}>{s.value}</div>
                <div className="text-[11px] uppercase tracking-widest text-white/45 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[60svh] lg:min-h-full overflow-hidden order-1 lg:order-2">
          <HeroMedia video={d.video} images={d.heroImages} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute top-24 right-5 md:right-8 font-mono text-[11px] uppercase tracking-widest text-white/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} /> Now showing
          </div>
          <div className="absolute bottom-6 left-5 right-5 md:left-8 md:right-8 flex justify-between text-[11px] uppercase tracking-[0.3em] text-white/70">
            <span>{d.siteName}</span><span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
    ),
  };

  const itemLayouts = {
    posters: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {d.items.slice(0, 8).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group text-left">
            <div className={`relative aspect-[3/4] ${R} overflow-hidden bg-white/5`}>
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              {p.price && <span className="absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold text-black" style={{ background: accent }}>{p.price}</span>}
              <div className="absolute bottom-0 inset-x-0 p-5">
                <h3 className="font-display text-xl leading-tight">{p.name}</h3>
                {p.description && <p className="text-sm text-white/60 mt-1 line-clamp-2">{p.description}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    ),
    reel: (
      <div className="border-t border-white/10">
        {d.items.slice(0, 8).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group w-full text-left grid grid-cols-[auto_1fr_auto] md:grid-cols-[3rem_9rem_1fr_1fr_auto] items-center gap-4 md:gap-8 py-5 md:py-6 border-b border-white/10 hover:bg-white/[0.03] transition-colors px-1">
            <span className="hidden md:block font-mono text-sm text-white/40">{String(i + 1).padStart(2, '0')}</span>
            <div className={`w-20 md:w-36 aspect-[4/3] ${R} overflow-hidden bg-white/5`}>
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />}
            </div>
            <h3 className="font-display text-xl md:text-3xl leading-tight transition-transform group-hover:translate-x-2">{p.name}</h3>
            <p className="hidden md:block text-white/55 text-sm leading-relaxed">{p.description}</p>
            {p.price && <span className="font-display text-lg md:text-2xl whitespace-nowrap" style={{ color: accent }}>{p.price}</span>}
          </button>
        ))}
      </div>
    ),
    feature: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
        {d.items.slice(0, 7).map((p, i) => (
          <button key={i} onClick={() => open(p)} className={`group relative text-left ${R} overflow-hidden bg-white/5 ${i === 0 ? 'sm:col-span-2 lg:row-span-2 aspect-[4/5] sm:aspect-auto min-h-[320px]' : 'aspect-[4/3]'}`}>
            {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-7">
              {i === 0 && <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>Featured</p>}
              <h3 className={`font-display leading-tight ${i === 0 ? 'text-3xl md:text-5xl' : 'text-xl'}`}>{p.name}</h3>
              {i === 0 && p.description && <p className="text-white/65 mt-3 max-w-md">{p.description}</p>}
              {p.price && <p className="mt-2 font-semibold" style={{ color: accent }}>{p.price}</p>}
            </div>
          </button>
        ))}
      </div>
    ),
  };

  const serviceLayouts = {
    list: (
      <div className="divide-y divide-white/10 border-y border-white/10">
        {d.services.map((s, i) => (
          <div key={i} className="group grid md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 items-baseline transition-colors hover:bg-white/[0.03] px-2">
            <span className="md:col-span-1 font-display text-lg text-white/40">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="md:col-span-5 font-display text-2xl md:text-4xl transition-transform group-hover:translate-x-2">{s.title}</h3>
            <p className="md:col-span-5 text-white/60 leading-relaxed">{s.description}</p>
            <ArrowUpRight className="hidden md:block md:col-span-1 justify-self-end opacity-30 group-hover:opacity-100 transition-all group-hover:rotate-45" style={{ color: accent }} />
          </div>
        ))}
      </div>
    ),
    cards: (
      <div className="grid md:grid-cols-3 gap-5">
        {d.services.map((s, i) => (
          <div key={i} className={`group relative min-h-[380px] ${R} overflow-hidden flex items-end`}>
            <img loading="lazy" src={d.gallery[(i + 2) % d.gallery.length]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
            <div className="relative p-7">
              <span className="block w-8 h-[2px] mb-5 transition-all group-hover:w-16" style={{ background: accent }} />
              <h3 className="font-display text-2xl md:text-3xl mb-3">{s.title}</h3>
              <p className="text-white/70 leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  const sections = {
    hero: heroes[look.hero],
    about: (
      <section id="about" className="py-24 md:py-36 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative">
            <div className={`aspect-[4/5] ${R} overflow-hidden`}>
              <img loading="lazy" src={d.gallery[0]} alt={d.aboutTitle} className="w-full h-full object-cover" />
            </div>
            <div className={`absolute -bottom-6 -right-4 md:-right-10 w-40 md:w-52 aspect-square ${R} overflow-hidden border-4 shadow-2xl`} style={{ borderColor: look.bg }}>
              <img loading="lazy" src={d.gallery[1] || d.gallery[0]} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.35em] mb-6" style={{ color: accent }}>Our Story</p>
            {!d.hideField('about_title') && <h2 className="font-display text-4xl md:text-6xl leading-[1.02] mb-8 [text-wrap:balance]">{d.aboutTitle}</h2>}
            {!d.hideField('about_text') && <p className="text-lg md:text-xl text-white/65 leading-relaxed whitespace-pre-line">{d.aboutText}</p>}
            {look.hero !== 'split' && (
              <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/10">
                {d.stats.map(s => (
                  <div key={s.label}>
                    <div className="font-display text-3xl md:text-5xl" style={{ color: accent }}>{s.value}</div>
                    <div className="text-xs md:text-sm uppercase tracking-widest text-white/50 mt-2">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-24 md:py-32 px-5 md:px-8" style={{ background: look.bg2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <h2 className="font-display text-4xl md:text-6xl">What we do</h2>
            <p className="text-white/55 max-w-sm">{d.preset.heroText}</p>
          </div>
          {serviceLayouts[look.services]}
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-12">
            <h2 className="font-display text-4xl md:text-6xl">{d.preset.itemsTitle}</h2>
            <button onClick={openAll} className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-widest text-white/70 hover:text-white">View all <ArrowRight size={16} /></button>
          </div>
          {itemLayouts[look.items]}
          <button onClick={openAll} className="sm:hidden mt-8 w-full rounded-full border border-white/20 py-4 text-sm uppercase tracking-widest">View all</button>
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-32 overflow-hidden" style={{ background: look.bg2 }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 mb-12">
          <h2 className="font-display text-4xl md:text-6xl">Moments</h2>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory px-5 md:px-8 pb-4 [scrollbar-width:none]" data-lenis-prevent>
          {d.gallery.map((src, i) => (
            <div key={i} className={`snap-start shrink-0 ${R} overflow-hidden ${i % 2 ? 'w-[70vw] md:w-[30vw] aspect-[3/4]' : 'w-[85vw] md:w-[42vw] aspect-[4/3]'}`}>
              <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>
    ),
    contact: (
      <section id="contact" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">
          <div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-10 [text-wrap:balance]">Let’s make it happen.</h2>
            <div className="space-y-5 text-lg">
              {d.contact.phone && !d.hideField('contact_phone') && <a href={telHref(d.contact.phone)} className="flex items-center gap-4 hover:opacity-80"><Phone size={20} style={{ color: accent }} /> {d.contact.phone}</a>}
              {d.contact.email && !d.hideField('contact_email') && <a href={`mailto:${d.contact.email}`} className="flex items-center gap-4 hover:opacity-80 break-all"><Mail size={20} style={{ color: accent }} /> {d.contact.email}</a>}
              {d.contact.address && !d.hideField('contact_address') && <a href={mapHref(d.contact.address)} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:opacity-80"><MapPin size={20} className="mt-1 shrink-0" style={{ color: accent }} /> {d.contact.address}</a>}
            </div>
            <ContactExtras content={content} align="left" className="mt-10" accent={accent} />
          </div>
          <div className={`${R} border border-white/10 bg-white/[0.03] p-6 md:p-10`}>
            <ContactForm websiteId={website?.id} primaryColor="bg-[var(--mt-accent)] !text-black" primaryColorHover="hover:opacity-90" buttonShape="rounded-full" />
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  return (
    <div className="mt-root min-h-screen text-white font-body" style={{ background: look.bg, ['--mt-accent' as any]: accent, ['--mt-r' as any]: look.r }}>
      <ThemeFonts display={look.display} body={look.body} />
      {look.upper && <style>{`.mt-root .font-display{text-transform:uppercase;letter-spacing:.01em}`}</style>}
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass="text-white bg-gradient-to-b from-black/50 to-transparent"
        solidClass="text-white backdrop-blur-md border-b border-white/10"
        menuClass="text-white font-display"
        logoClass="font-display text-lg md:text-xl uppercase tracking-wider"
        cta={<a href="#contact" className="rounded-full px-5 py-2.5 text-sm font-semibold text-black" style={{ background: accent }}>{d.preset.ctaPrimary}</a>}
        bg={look.bg}
      />
      <Sections data={d} sections={sections} />
      <footer className="border-t border-white/10 py-10 px-5 text-center text-sm text-white/40">
        © {new Date().getFullYear()} {d.siteName}. All rights reserved.
      </footer>
      {modals}
    </div>
  );
}
