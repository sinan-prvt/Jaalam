import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, MotionNav, Sections, ThemeFonts, mapHref, navLinks, pickLook, telHref, useMotionData, useProductModals, type FontKey } from './shared';

interface Look {
  bg: string;
  bg2: string;
  /** Metallic accent (gold, rose gold, silver...). */
  metal: string;
  text: string;
  display: FontKey;
  body: FontKey;
  /** framed: full-bleed video in a hairline frame · arch: text beside an arched window · oval: headline around an oval portrait */
  hero: 'framed' | 'arch' | 'oval';
  /** arches: arched cards · menu: two-column printed menu · alternate: large alternating rows */
  items: 'arches' | 'menu' | 'alternate';
  services: 'columns' | 'panels';
}

/** A different finish of Luxe Motion for every business category. */
const LOOKS: Record<string, Look> = {
  'Restaurant': { bg: '#14100c', bg2: '#1c1712', metal: '#C9A96E', text: '#f3ece2', display: 'cormorant', body: 'jost', hero: 'framed', items: 'menu', services: 'columns' },
  'Cafe / Bakery': { bg: '#1a120d', bg2: '#22180f', metal: '#D4A373', text: '#f5ebe0', display: 'playfair', body: 'jost', hero: 'arch', items: 'arches', services: 'panels' },
  'Salon / Spa': { bg: '#1a0f14', bg2: '#22141b', metal: '#E8B4A0', text: '#f7ebe8', display: 'italiana', body: 'jost', hero: 'oval', items: 'menu', services: 'panels' },
  'Gym / Fitness': { bg: '#0c0c0c', bg2: '#151515', metal: '#D4AF37', text: '#f2f2f2', display: 'cinzel', body: 'outfit', hero: 'framed', items: 'alternate', services: 'panels' },
  'Retail Store': { bg: '#0e0e10', bg2: '#17171a', metal: '#C0C7D1', text: '#f1f2f4', display: 'bodoni', body: 'jost', hero: 'arch', items: 'arches', services: 'columns' },
  'Stationery / Books': { bg: '#0b1220', bg2: '#111a2e', metal: '#C9A96E', text: '#eef0f5', display: 'marcellus', body: 'lora', hero: 'oval', items: 'alternate', services: 'columns' },
  'Fancy Store': { bg: '#170a12', bg2: '#21101a', metal: '#E8B4A0', text: '#f9ecef', display: 'bodoni', body: 'jost', hero: 'oval', items: 'arches', services: 'panels' },
  'Chicken / Meat Stall': { bg: '#140a08', bg2: '#1d0f0c', metal: '#C8915A', text: '#f3e9e2', display: 'cinzel', body: 'jost', hero: 'framed', items: 'menu', services: 'columns' },
  'Scrap Dealer': { bg: '#0a1410', bg2: '#0f1d17', metal: '#C9A96E', text: '#e9f0ec', display: 'marcellus', body: 'outfit', hero: 'arch', items: 'menu', services: 'panels' },
  'Supermarket / Grocery': { bg: '#0d140c', bg2: '#141d12', metal: '#CDB36E', text: '#eff2e6', display: 'playfair', body: 'jost', hero: 'framed', items: 'arches', services: 'columns' },
  'Textiles / Garments': { bg: '#1a0b0a', bg2: '#241110', metal: '#D4AF37', text: '#f7ece1', display: 'cormorant', body: 'jost', hero: 'arch', items: 'alternate', services: 'panels' },
  'Real Estate': { bg: '#0b1220', bg2: '#111a2e', metal: '#C9A96E', text: '#eef0f5', display: 'italiana', body: 'jost', hero: 'framed', items: 'alternate', services: 'columns' },
  'Consulting': { bg: '#0f1114', bg2: '#171a1f', metal: '#B8C2CC', text: '#eef1f4', display: 'cinzel', body: 'manrope', hero: 'oval', items: 'menu', services: 'columns' },
  'Other': { bg: '#14100c', bg2: '#1c1712', metal: '#C9A96E', text: '#f3ece2', display: 'cormorant', body: 'jost', hero: 'framed', items: 'arches', services: 'columns' },
};

function Ornament({ color, className = 'justify-center' }: { color: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 my-6 ${className}`} style={{ color }}>
      <span className="w-12 h-px bg-current opacity-60" /><span className="w-1.5 h-1.5 rotate-45 bg-current" /><span className="w-12 h-px bg-current opacity-60" />
    </div>
  );
}

function Heading({ eyebrow, title, color }: { eyebrow: string; title: string; color: string }) {
  return (
    <div className="text-center mb-14 md:mb-20">
      <p className="text-[11px] uppercase tracking-[0.45em]" style={{ color }}>{eyebrow}</p>
      <Ornament color={color} />
      <h2 className="font-display text-4xl md:text-6xl font-light">{title}</h2>
    </div>
  );
}

/** Luxe Motion: deep tones and metallic detail, slow cinematic fades. Layout varies by category. */
export default function LuxeTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const look = pickLook(LOOKS, d);
  const { metal: GOLD, bg: BG, bg2: BG2 } = look;

  const ctas = (center: boolean) => (
    <div className={`mt-rise mt-d3 mt-12 flex flex-col sm:flex-row gap-4 ${center ? 'justify-center' : ''}`}>
      <a href="#menu" className="px-10 py-4 text-xs uppercase tracking-[0.3em] text-center transition-colors hover:bg-white" style={{ background: GOLD, color: BG }}>{d.preset.ctaPrimary}</a>
      <a href="#about" className="px-10 py-4 text-xs uppercase tracking-[0.3em] text-center border hover:bg-white/5 transition-colors" style={{ borderColor: GOLD, color: GOLD }}>{d.preset.ctaSecondary}</a>
    </div>
  );

  const heroes = {
    framed: (
      <section id="hero" className="relative min-h-[100svh] flex items-center justify-center text-center overflow-hidden">
        <HeroMedia video={d.video} images={d.heroImages} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${BG}59, ${BG}eb)` }} />
        <div className="absolute inset-5 md:inset-10 border pointer-events-none" style={{ borderColor: `${GOLD}55` }} />
        <div className="relative z-10 max-w-4xl px-8 pt-20">
          <p className="mt-rise text-[11px] md:text-xs uppercase tracking-[0.5em]" style={{ color: GOLD }}>{d.preset.label}</p>
          <Ornament color={GOLD} />
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display font-light text-5xl sm:text-7xl lg:text-8xl leading-[1.02] [text-wrap:balance]">{d.heroTitle}</h1>
          )}
          {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-base md:text-lg opacity-70 leading-relaxed max-w-2xl mx-auto font-light">{d.heroText}</p>}
          {ctas(true)}
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] opacity-50">
          Scroll <span className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>
    ),
    arch: (
      <section id="hero" className="relative min-h-[100svh] flex items-center px-6 md:px-8 pt-28 pb-16">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
          <div className="order-2 lg:order-1">
            <p className="mt-rise text-[11px] uppercase tracking-[0.5em]" style={{ color: GOLD }}>{d.preset.label} · Est. {new Date().getFullYear() - 12}</p>
            <Ornament color={GOLD} className="justify-start" />
            {!d.hideField('hero_title') && (
              <h1 className="mt-rise mt-d1 font-display font-light text-5xl sm:text-6xl lg:text-7xl leading-[1.04] [text-wrap:balance]">{d.heroTitle}</h1>
            )}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-base md:text-lg opacity-70 leading-loose max-w-xl font-light">{d.heroText}</p>}
            {ctas(false)}
          </div>
          <div className="order-1 lg:order-2 mt-rise mt-d1 relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 rounded-t-full border" style={{ borderColor: `${GOLD}66` }} />
            <div className="relative aspect-[3/4] rounded-t-full overflow-hidden">
              <HeroMedia video={d.video} images={d.heroImages} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${BG}99, transparent 50%)` }} />
            </div>
            <div className="absolute -left-6 bottom-12 px-6 py-4 text-center" style={{ background: BG, border: `1px solid ${GOLD}55` }}>
              <div className="font-display text-3xl font-light" style={{ color: GOLD }}>{d.stats[0].value}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 mt-1">{d.stats[0].label}</div>
            </div>
          </div>
        </div>
      </section>
    ),
    oval: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">
        <p className="mt-rise text-[11px] uppercase tracking-[0.5em]" style={{ color: GOLD }}>{d.preset.label}</p>
        <Ornament color={GOLD} />
        {!d.hideField('hero_title') && (
          <h1 className="mt-rise mt-d1 font-display font-light text-5xl sm:text-6xl lg:text-7xl leading-[1.04] max-w-4xl [text-wrap:balance]">{d.heroTitle}</h1>
        )}
        <div className="mt-12 w-full max-w-5xl grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-12">
          <div className="text-right">
            <div className="font-display text-3xl md:text-5xl font-light" style={{ color: GOLD }}>{d.stats[0].value}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 mt-2">{d.stats[0].label}</div>
          </div>
          <div className="mt-rise mt-d2 relative w-44 sm:w-60 md:w-72 aspect-[3/4] rounded-[50%] overflow-hidden ring-1 ring-offset-8" style={{ ['--tw-ring-color' as any]: `${GOLD}88`, ['--tw-ring-offset-color' as any]: BG }}>
            <HeroMedia video={d.video} images={d.heroImages} />
          </div>
          <div className="text-left">
            <div className="font-display text-3xl md:text-5xl font-light" style={{ color: GOLD }}>{(d.stats[1] || d.stats[0]).value}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 mt-2">{(d.stats[1] || d.stats[0]).label}</div>
          </div>
        </div>
        {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-12 text-base md:text-lg opacity-70 leading-relaxed max-w-2xl font-light">{d.heroText}</p>}
        {ctas(true)}
      </section>
    ),
  };

  const itemLayouts = {
    arches: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {d.items.slice(0, 8).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group text-center">
            <div className="aspect-[3/4] rounded-t-full overflow-hidden mb-6 border p-2" style={{ borderColor: `${GOLD}44` }}>
              <div className="w-full h-full rounded-t-full overflow-hidden bg-white/5">
                {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />}
              </div>
            </div>
            <h3 className="font-display text-2xl">{p.name}</h3>
            {p.price && <p className="mt-2 text-sm tracking-[0.2em]" style={{ color: GOLD }}>{p.price}</p>}
          </button>
        ))}
      </div>
    ),
    menu: (
      <div className="max-w-5xl mx-auto border p-6 sm:p-10 md:p-16 relative" style={{ borderColor: `${GOLD}44` }}>
        <div className="absolute inset-2 border pointer-events-none" style={{ borderColor: `${GOLD}22` }} />
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {d.items.slice(0, 10).map((p, i) => (
            <button key={i} onClick={() => open(p)} className="group text-left">
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-xl md:text-2xl group-hover:opacity-80">{p.name}</h3>
                <span className="flex-1 border-b border-dotted translate-y-[-5px]" style={{ borderColor: `${GOLD}66` }} />
                {p.price && <span className="font-display text-lg shrink-0" style={{ color: GOLD }}>{p.price}</span>}
              </div>
              {p.description && <p className="mt-2 text-sm italic font-light opacity-55">{p.description}</p>}
            </button>
          ))}
        </div>
      </div>
    ),
    alternate: (
      <div className="space-y-16 md:space-y-24">
        {d.items.slice(0, 4).map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group w-full text-left grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className={`relative aspect-[4/3] overflow-hidden ${i % 2 ? 'md:order-2' : ''}`}>
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />}
              <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: `${GOLD}66` }} />
            </div>
            <div className={i % 2 ? 'md:text-right' : ''}>
              <div className="font-display italic text-6xl font-light opacity-30">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-display text-3xl md:text-5xl font-light mt-2">{p.name}</h3>
              {p.description && <p className="mt-5 opacity-60 leading-loose font-light">{p.description}</p>}
              {p.price && <p className="mt-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>{p.price}</p>}
            </div>
          </button>
        ))}
      </div>
    ),
  };

  const serviceLayouts = {
    columns: (
      <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x" style={{ borderColor: `${GOLD}33` }}>
        {d.services.map((s, i) => (
          <div key={i} className="text-center md:px-10" style={{ borderColor: `${GOLD}33` }}>
            <div className="font-display italic text-5xl font-light mb-6" style={{ color: GOLD }}>{String(i + 1).padStart(2, '0')}</div>
            <h3 className="font-display text-2xl md:text-3xl mb-4">{s.title}</h3>
            <p className="opacity-55 leading-relaxed font-light">{s.description}</p>
          </div>
        ))}
      </div>
    ),
    panels: (
      <div className="grid md:grid-cols-3 gap-5">
        {d.services.map((s, i) => (
          <div key={i} className="group relative min-h-[420px] overflow-hidden flex items-center justify-center text-center p-10">
            <img loading="lazy" src={d.gallery[(i + 2) % d.gallery.length]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
            <div className="absolute inset-0" style={{ background: `${BG}bf` }} />
            <div className="absolute inset-4 border transition-all duration-700 group-hover:inset-6" style={{ borderColor: `${GOLD}66` }} />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>No. {i + 1}</p>
              <Ornament color={GOLD} />
              <h3 className="font-display text-3xl font-light mb-4">{s.title}</h3>
              <p className="opacity-70 leading-relaxed font-light">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  const sections = {
    hero: heroes[look.hero],
    about: (
      <section id="about" className="py-24 md:py-36 px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative h-[420px] md:h-[560px]">
            <div className="absolute left-0 top-0 w-[70%] h-[80%] overflow-hidden">
              <img loading="lazy" src={d.gallery[0]} alt="" className="w-full h-full object-cover" style={{ animation: 'mt-kenburns 20s ease-in-out infinite alternate' }} />
            </div>
            <div className="absolute right-0 bottom-0 w-[55%] h-[55%] overflow-hidden border-8" style={{ borderColor: BG }}>
              <img loading="lazy" src={d.gallery[1] || d.gallery[0]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -left-4 bottom-10 w-24 h-24 border" style={{ borderColor: GOLD }} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.45em] mb-6" style={{ color: GOLD }}>Our Heritage</p>
            {!d.hideField('about_title') && <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.05] mb-8 [text-wrap:balance]">{d.aboutTitle}</h2>}
            {!d.hideField('about_text') && <p className="opacity-65 text-lg leading-loose font-light whitespace-pre-line">{d.aboutText}</p>}
            <div className="flex gap-10 mt-12">
              {d.stats.map(s => (
                <div key={s.label}>
                  <div className="font-display text-4xl font-light" style={{ color: GOLD }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] opacity-45 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-24 md:py-36 px-6 md:px-8" style={{ background: BG2 }}>
        <div className={`${look.services === 'panels' ? 'max-w-7xl' : 'max-w-5xl'} mx-auto`}>
          <Heading eyebrow="The Experience" title="Our Services" color={GOLD} />
          {serviceLayouts[look.services]}
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-24 md:py-36 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Heading eyebrow="Curated For You" title={d.preset.itemsTitle} color={GOLD} />
          {itemLayouts[look.items]}
          <div className="text-center mt-14">
            <button onClick={openAll} className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.35em] border-b pb-2" style={{ color: GOLD, borderColor: GOLD }}>Discover all <ArrowRight size={14} /></button>
          </div>
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-36 px-6 md:px-8" style={{ background: BG2 }}>
        <div className="max-w-7xl mx-auto">
          <Heading eyebrow="Glimpses" title="Gallery" color={GOLD} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {d.gallery.slice(0, 6).map((src, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 || i === 5 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}>
                <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    contact: (
      <section id="contact" className="py-24 md:py-36 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Heading eyebrow="Reservations & Enquiries" title="Visit Us" color={GOLD} />
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
              {d.contact.phone && !d.hideField('contact_phone') && <a href={telHref(d.contact.phone)} className="block"><Phone size={18} className="mx-auto lg:mx-0 mb-3" style={{ color: GOLD }} /><span className="font-display text-2xl">{d.contact.phone}</span></a>}
              {d.contact.email && !d.hideField('contact_email') && <a href={`mailto:${d.contact.email}`} className="block"><Mail size={18} className="mx-auto lg:mx-0 mb-3" style={{ color: GOLD }} /><span className="font-display text-2xl break-all">{d.contact.email}</span></a>}
              {d.contact.address && !d.hideField('contact_address') && <a href={mapHref(d.contact.address)} target="_blank" rel="noreferrer" className="block"><MapPin size={18} className="mx-auto lg:mx-0 mb-3" style={{ color: GOLD }} /><span className="font-display text-2xl">{d.contact.address}</span></a>}
              <ContactExtras content={content} align="left" accent={GOLD} />
            </div>
            <div className="lg:col-span-3 border p-6 md:p-10" style={{ borderColor: `${GOLD}44` }}>
              <ContactForm websiteId={website?.id} primaryColor="bg-[var(--mt-metal)] !text-[var(--mt-bg)]" primaryColorHover="hover:bg-white" buttonShape="rounded-none" />
            </div>
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  return (
    <div className="mt-root min-h-screen font-body" style={{ background: BG, color: look.text, ['--mt-metal' as any]: GOLD, ['--mt-bg' as any]: BG }}>
      <ThemeFonts display={look.display} body={look.body} />
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass=""
        solidClass="backdrop-blur-md border-b border-white/10"
        menuClass="font-display"
        logoClass="font-display text-xl md:text-2xl uppercase tracking-[0.25em]"
        cta={<a href="#contact" className="px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] border border-[var(--mt-metal)] text-[var(--mt-metal)] transition-colors hover:bg-[var(--mt-metal)] hover:text-[var(--mt-bg)]">{d.preset.ctaPrimary}</a>}
        bg={BG}
      />
      <Sections data={d} sections={sections} />
      <footer className="py-14 px-6 text-center border-t" style={{ borderColor: `${GOLD}22` }}>
        <div className="font-display text-3xl uppercase tracking-[0.3em]">{d.siteName}</div>
        <Ornament color={GOLD} />
        <p className="text-[10px] uppercase tracking-[0.35em] opacity-40">© {new Date().getFullYear()} · All rights reserved</p>
      </footer>
      {modals}
    </div>
  );
}
