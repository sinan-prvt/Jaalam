import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, Marquee, MotionNav, Sections, ThemeFonts, mapHref, navLinks, pickLook, telHref, useMotionData, useProductModals, type FontKey } from './shared';

interface Look {
  paper: string;
  ink: string;
  display: FontKey;
  body: FontKey;
  /** arch: headline beside an arched frame · masthead: newspaper front page · portrait: headline over an oval portrait */
  hero: 'arch' | 'masthead' | 'portrait';
  /** scroll: sliding cards · pricelist: dotted-leader menu · catalogue: numbered plates */
  items: 'scroll' | 'pricelist' | 'catalogue';
  /** ink: dark band · columns: ruled columns with drop caps */
  services: 'ink' | 'columns';
  upper?: boolean;
}

/** A different issue of Editorial for every business category. */
const LOOKS: Record<string, Look> = {
  'Restaurant': { paper: '#f6f1ea', ink: '#1c1917', display: 'fraunces', body: 'inter', hero: 'masthead', items: 'pricelist', services: 'ink' },
  'Cafe / Bakery': { paper: '#f4ead9', ink: '#3b2416', display: 'dmSerif', body: 'manrope', hero: 'arch', items: 'pricelist', services: 'columns' },
  'Salon / Spa': { paper: '#f7ece8', ink: '#2a1520', display: 'instrument', body: 'outfit', hero: 'portrait', items: 'pricelist', services: 'columns' },
  'Gym / Fitness': { paper: '#eeeeea', ink: '#111111', display: 'bebas', body: 'inter', hero: 'masthead', items: 'catalogue', services: 'ink', upper: true },
  'Retail Store': { paper: '#f2f0eb', ink: '#141414', display: 'syne', body: 'inter', hero: 'portrait', items: 'scroll', services: 'ink' },
  'Stationery / Books': { paper: '#f4efe1', ink: '#1e293b', display: 'lora', body: 'inter', hero: 'masthead', items: 'catalogue', services: 'columns' },
  'Fancy Store': { paper: '#f8eef0', ink: '#3a1225', display: 'bodoni', body: 'jost', hero: 'arch', items: 'scroll', services: 'columns' },
  'Chicken / Meat Stall': { paper: '#f3ece4', ink: '#2b0f0f', display: 'oswald', body: 'inter', hero: 'masthead', items: 'pricelist', services: 'ink', upper: true },
  'Scrap Dealer': { paper: '#eef0ea', ink: '#16241b', display: 'archivo', body: 'spaceGrotesk', hero: 'portrait', items: 'pricelist', services: 'ink', upper: true },
  'Supermarket / Grocery': { paper: '#edf2ea', ink: '#14301f', display: 'bricolage', body: 'manrope', hero: 'arch', items: 'catalogue', services: 'columns' },
  'Textiles / Garments': { paper: '#f5ede3', ink: '#3d1410', display: 'cormorant', body: 'jost', hero: 'portrait', items: 'scroll', services: 'ink' },
  'Real Estate': { paper: '#eef0f2', ink: '#0f172a', display: 'instrument', body: 'manrope', hero: 'masthead', items: 'scroll', services: 'columns' },
  'Consulting': { paper: '#f1f1ee', ink: '#111827', display: 'fraunces', body: 'manrope', hero: 'portrait', items: 'catalogue', services: 'ink' },
  'Other': { paper: '#f6f1ea', ink: '#1c1917', display: 'fraunces', body: 'inter', hero: 'arch', items: 'scroll', services: 'ink' },
};

function Label({ n, accent, children }: { n: string; accent: string; children: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] mb-8 text-stone-500">
      <span className="font-display italic text-base normal-case tracking-normal" style={{ color: accent }}>{n}</span>
      <span className="h-px flex-1 bg-stone-300" />
      {children}
    </div>
  );
}

/** Editorial: magazine layout on warm paper with oversized serif type. Layout varies by category. */
export default function EditorialTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const look = pickLook(LOOKS, d);
  const { ink: INK, paper: PAPER } = look;
  const accent = d.preset.accent2;
  const year = new Date().getFullYear();

  const ctas = (
    <>
      <a href="#menu" className="group inline-flex items-center justify-between gap-4 px-6 py-4 text-white rounded-full" style={{ background: INK }}>
        {d.preset.ctaPrimary} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </a>
      <a href="#about" className="inline-flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-stone-400 hover:bg-black/5 transition-colors">
        {d.preset.ctaSecondary} <ArrowUpRight size={18} />
      </a>
    </>
  );

  const heroes = {
    arch: (
      <section id="hero" className="pt-28 md:pt-32 pb-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] text-stone-500 border-y border-stone-300 py-3 mb-10 md:mb-14">
            <span>{d.preset.label}</span>
            <span className="hidden sm:inline">Vol. {year % 100} — {d.preset.marquee.slice(0, 2).join(' & ')}</span>
            <span>Est. {year - 8}</span>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              {!d.hideField('hero_title') && (
                <h1 className="mt-rise font-display text-[14vw] sm:text-7xl lg:text-[7.5rem] leading-[0.9] tracking-[-0.03em] [text-wrap:balance]">{d.heroTitle}</h1>
              )}
              <div className="mt-rise mt-d2 mt-10 grid sm:grid-cols-2 gap-8 items-start">
                {!d.hideField('hero_description') && <p className="text-lg leading-relaxed text-stone-600">{d.heroText}</p>}
                <div className="flex flex-col gap-3">{ctas}</div>
              </div>
            </div>
            <div className="lg:col-span-5 mt-rise mt-d1">
              <div className="relative aspect-[4/5] rounded-t-full overflow-hidden shadow-[0_40px_80px_-30px_rgba(28,25,23,.5)]">
                <HeroMedia video={d.video} images={d.heroImages} />
              </div>
              <p className="mt-4 text-xs italic text-stone-500 font-display">Fig. 1 — {d.preset.marquee[0]}, {d.preset.marquee[1]?.toLowerCase()}.</p>
            </div>
          </div>
        </div>
      </section>
    ),
    masthead: (
      <section id="hero" className="pt-24 md:pt-28 pb-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-t-4" style={{ borderColor: INK }} />
          <div className="mt-1 border-t" style={{ borderColor: INK }} />
          <div className="flex justify-between text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-stone-500 py-3 border-b border-stone-300">
            <span>No. {year % 100}{(year % 7) + 1}</span>
            <span>The {d.preset.label} Edition</span>
            <span className="hidden sm:inline">{d.preset.marquee.slice(0, 3).join(' · ')}</span>
          </div>
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise font-display text-center text-[13vw] sm:text-7xl lg:text-[8rem] leading-[0.88] tracking-[-0.03em] py-8 md:py-12 [text-wrap:balance]">{d.heroTitle}</h1>
          )}
          <div className="mt-rise mt-d1 relative aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <HeroMedia video={d.video} images={d.heroImages} />
          </div>
          <div className="mt-rise mt-d2 grid md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-stone-300 pt-8 border-t border-stone-300 mt-4">
            {!d.hideField('hero_description') && (
              <p className="md:pr-8 text-lg leading-relaxed text-stone-600 first-letter:font-display first-letter:text-6xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85]">{d.heroText}</p>
            )}
            <div className="md:px-8 flex flex-col gap-3">{ctas}</div>
            <div className="md:pl-8 grid grid-cols-3 gap-4">
              {d.stats.map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl" style={{ color: accent }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    portrait: (
      <section id="hero" className="pt-28 md:pt-32 pb-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mt-rise text-[11px] uppercase tracking-[0.4em] text-stone-500 mb-6">{d.preset.label} · Est. {year - 8}</p>
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display text-[12vw] sm:text-7xl lg:text-[6.5rem] leading-[0.92] tracking-[-0.02em] max-w-5xl mx-auto [text-wrap:balance]">{d.heroTitle}</h1>
          )}
          <div className="mt-12 grid md:grid-cols-[1fr_1.1fr_1fr] gap-10 items-center text-left">
            <div className="mt-rise mt-d2 order-2 md:order-1">
              {!d.hideField('hero_description') && <p className="text-lg leading-relaxed text-stone-600 mb-8">{d.heroText}</p>}
              <div className="flex flex-col gap-3">{ctas}</div>
            </div>
            <div className="mt-rise mt-d1 order-1 md:order-2 relative aspect-[3/4] rounded-[50%] overflow-hidden mx-auto w-full max-w-sm border-[10px]" style={{ borderColor: '#fff' }}>
              <HeroMedia video={d.video} images={d.heroImages} />
            </div>
            <div className="mt-rise mt-d3 order-3 space-y-6">
              {d.stats.map(s => (
                <div key={s.label} className="border-b border-stone-300 pb-4 flex items-baseline justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-stone-500">{s.label}</span>
                  <span className="font-display text-4xl" style={{ color: accent }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  };

  const itemLayouts = {
    scroll: (
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-5 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-6 [scrollbar-width:none]" data-lenis-prevent>
        {d.items.map((p, i) => (
          <button key={i} onClick={() => open(p)} className="group snap-start shrink-0 w-[75vw] sm:w-[340px] text-left">
            <div className="aspect-[4/5] overflow-hidden bg-stone-200 mb-5">
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-stone-300 pb-3">
              <h3 className="font-display text-2xl">{p.name}</h3>
              {p.price && <span className="shrink-0 text-stone-600">{p.price}</span>}
            </div>
            {p.description && <p className="text-stone-500 mt-3 text-sm leading-relaxed">{p.description}</p>}
          </button>
        ))}
      </div>
    ),
    pricelist: (
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-28 aspect-[3/4] overflow-hidden bg-stone-200">
            <img loading="lazy" src={d.items[0]?.image || d.gallery[0]} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-8 content-start">
          {d.items.slice(0, 12).map((p, i) => (
            <button key={i} onClick={() => open(p)} className="group text-left">
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-xl md:text-2xl group-hover:italic">{p.name}</h3>
                <span className="flex-1 border-b border-dotted border-stone-400 translate-y-[-4px]" />
                {p.price && <span className="font-display text-lg shrink-0" style={{ color: accent }}>{p.price}</span>}
              </div>
              {p.description && <p className="text-stone-500 mt-2 text-sm leading-relaxed">{p.description}</p>}
            </button>
          ))}
        </div>
      </div>
    ),
    catalogue: (
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {d.items.slice(0, 6).map((p, i) => (
          <button key={i} onClick={() => open(p)} className={`group text-left ${i % 3 === 1 ? 'lg:translate-y-12' : ''}`}>
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.25em]">Plate {String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 items-baseline">
              <h3 className="font-display text-2xl">{p.name}</h3>
              {p.price && <span className="text-sm uppercase tracking-widest" style={{ color: accent }}>{p.price}</span>}
            </div>
            {p.description && <p className="text-stone-500 mt-2 text-sm leading-relaxed italic">{p.description}</p>}
          </button>
        ))}
      </div>
    ),
  };

  const servicesSection = look.services === 'ink' ? (
    <section id="services" className="py-20 md:py-28 px-5 md:px-8 text-white" style={{ background: INK }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] mb-12 text-white/50">
          <span className="font-display italic text-base normal-case tracking-normal" style={{ color: accent }}>02</span>
          <span className="h-px flex-1 bg-white/20" /> Services
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-white/15">
          {d.services.map((s, i) => (
            <div key={i} className="p-8 md:p-10" style={{ background: INK }}>
              <div className="font-display italic text-6xl mb-10" style={{ color: accent }}>{['i', 'ii', 'iii', 'iv', 'v', 'vi'][i] || i + 1}.</div>
              <h3 className="font-display text-2xl md:text-3xl mb-4">{s.title}</h3>
              <p className="text-white/60 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ) : (
    <section id="services" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Label accent={accent} n="02">Services</Label>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-14 max-w-3xl [text-wrap:balance]">{d.preset.heroText}</h2>
        <div className="grid md:grid-cols-3 md:divide-x divide-stone-300 border-y border-stone-300">
          {d.services.map((s, i) => (
            <div key={i} className="py-10 md:px-8 first:md:pl-0 last:md:pr-0">
              <p className="text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>Chapter {i + 1}</p>
              <h3 className="font-display text-3xl mb-5">{s.title}</h3>
              <p className="text-stone-600 leading-relaxed first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const sections = {
    hero: heroes[look.hero],
    about: (
      <section id="about" className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Label accent={accent} n="01">About</Label>
          <div className="grid lg:grid-cols-12 gap-10">
            {!d.hideField('about_title') && <h2 className="lg:col-span-5 font-display text-4xl md:text-6xl leading-[1] tracking-tight [text-wrap:balance]">{d.aboutTitle}</h2>}
            <div className="lg:col-span-6 lg:col-start-7">
              {!d.hideField('about_text') && <p className="text-xl md:text-2xl leading-relaxed text-stone-700 font-display whitespace-pre-line">{d.aboutText}</p>}
              {look.hero === 'arch' && (
                <div className="grid grid-cols-3 gap-4 mt-12">
                  {d.stats.map(s => (
                    <div key={s.label} className="border-t pt-4" style={{ borderColor: INK }}>
                      <div className="font-display text-3xl md:text-4xl">{s.value}</div>
                      <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    services: servicesSection,
    menu: (
      <section id="menu" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Label accent={accent} n="03">{d.preset.itemsTitle}</Label>
          <div className="flex items-end justify-between gap-6 mb-10">
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">{d.preset.itemsTitle}</h2>
            <button onClick={openAll} className="text-sm underline underline-offset-4 decoration-stone-400 hover:decoration-current">See everything</button>
          </div>
        </div>
        {itemLayouts[look.items]}
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Label accent={accent} n="04">Gallery</Label>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
            {d.gallery.slice(0, 6).map((src, i) => {
              const span = ['md:col-span-7 md:row-span-2', 'md:col-span-5', 'md:col-span-5', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4'][i];
              return (
                <figure key={i} className={`${span} ${i === 0 ? 'col-span-2' : ''}`}>
                  <div className={`overflow-hidden bg-stone-200 ${i === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/3]'}`}>
                    <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    ),
    contact: (
      <section id="contact" className="py-20 md:py-28 px-5 md:px-8 border-t border-stone-300">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Label accent={accent} n="05">Contact</Label>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight mb-10">Write to us.</h2>
            <dl className="space-y-6">
              {d.contact.phone && !d.hideField('contact_phone') && <div><dt className="text-[11px] uppercase tracking-[0.3em] text-stone-500 mb-1">Telephone</dt><dd><a href={telHref(d.contact.phone)} className="font-display text-2xl hover:italic">{d.contact.phone}</a></dd></div>}
              {d.contact.email && !d.hideField('contact_email') && <div><dt className="text-[11px] uppercase tracking-[0.3em] text-stone-500 mb-1">Email</dt><dd><a href={`mailto:${d.contact.email}`} className="font-display text-2xl hover:italic break-all">{d.contact.email}</a></dd></div>}
              {d.contact.address && !d.hideField('contact_address') && <div><dt className="text-[11px] uppercase tracking-[0.3em] text-stone-500 mb-1">Visit</dt><dd><a href={mapHref(d.contact.address)} target="_blank" rel="noreferrer" className="font-display text-2xl hover:italic">{d.contact.address}</a></dd></div>}
            </dl>
            <ContactExtras content={content} align="left" className="mt-8" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 bg-white p-6 md:p-10 shadow-[0_30px_60px_-30px_rgba(28,25,23,.35)]">
            <ContactForm websiteId={website?.id} primaryColor="bg-[var(--mt-ink)]" primaryColorHover="hover:opacity-85" buttonShape="rounded-full" />
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  return (
    <div className="mt-root min-h-screen font-body" style={{ background: PAPER, color: INK, ['--mt-ink' as any]: INK }}>
      <ThemeFonts display={look.display} body={look.body} />
      {look.upper && <style>{`.mt-root h1.font-display,.mt-root h2.font-display,.mt-root h3.font-display{text-transform:uppercase;letter-spacing:.01em}`}</style>}
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass=""
        solidClass="backdrop-blur-md border-b border-stone-300"
        menuClass="font-display"
        logoClass="font-display text-xl md:text-2xl"
        cta={<a href="#contact" className="rounded-full px-5 py-2.5 text-sm text-white" style={{ background: INK }}>{d.preset.ctaPrimary}</a>}
        bg={PAPER}
      />
      <Sections data={d} sections={sections} />
      <div className="border-y border-stone-300 py-6 font-display italic text-3xl md:text-5xl text-stone-400">
        <Marquee words={d.preset.marquee} separator="—" speed={40} />
      </div>
      <footer className="py-10 px-5 md:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-2 text-sm text-stone-500">
        <span className="font-display text-lg" style={{ color: INK }}>{d.siteName}</span>
        <span>© {year}. All rights reserved.</span>
      </footer>
      {modals}
    </div>
  );
}
