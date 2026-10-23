import { ArrowRight, Mail, MapPin, Phone, Sparkles, Star } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, MotionNav, Sections, ThemeFonts, mapHref, navLinks, pickLook, telHref, useMotionData, useProductModals, type FontKey } from './shared';

interface Look {
  bg: string;
  display: FontKey;
  body: FontKey;
  /** split: text beside a glass video frame · stage: centred title over a wide glass screen · immersive: full-bleed video with a glass card */
  hero: 'split' | 'stage' | 'immersive';
  /** grid: glass cards · carousel: tall sliding cards · rows: two-column price list */
  items: 'grid' | 'carousel' | 'rows';
  services: 'cards' | 'bento';
  r: string;
  texture: 'dots' | 'grid' | 'none';
}

/** A different mood of Aurora for every business category. */
const LOOKS: Record<string, Look> = {
  'Restaurant': { bg: '#0d0705', display: 'playfair', body: 'manrope', hero: 'immersive', items: 'rows', services: 'bento', r: '2rem', texture: 'none' },
  'Cafe / Bakery': { bg: '#0f0906', display: 'dmSerif', body: 'outfit', hero: 'split', items: 'carousel', services: 'cards', r: '2.25rem', texture: 'dots' },
  'Salon / Spa': { bg: '#0c0514', display: 'instrument', body: 'outfit', hero: 'stage', items: 'rows', services: 'bento', r: '2.5rem', texture: 'none' },
  'Gym / Fitness': { bg: '#05070a', display: 'unbounded', body: 'inter', hero: 'immersive', items: 'grid', services: 'cards', r: '1rem', texture: 'grid' },
  'Retail Store': { bg: '#05060f', display: 'spaceGrotesk', body: 'inter', hero: 'stage', items: 'carousel', services: 'bento', r: '1.75rem', texture: 'dots' },
  'Stationery / Books': { bg: '#060a18', display: 'fraunces', body: 'manrope', hero: 'split', items: 'grid', services: 'bento', r: '1.25rem', texture: 'grid' },
  'Fancy Store': { bg: '#12050c', display: 'bodoni', body: 'outfit', hero: 'stage', items: 'carousel', services: 'cards', r: '2.5rem', texture: 'dots' },
  'Chicken / Meat Stall': { bg: '#0d0405', display: 'oswald', body: 'manrope', hero: 'split', items: 'rows', services: 'cards', r: '1rem', texture: 'none' },
  'Scrap Dealer': { bg: '#030d08', display: 'spaceGrotesk', body: 'manrope', hero: 'immersive', items: 'rows', services: 'bento', r: '0.75rem', texture: 'grid' },
  'Supermarket / Grocery': { bg: '#03100a', display: 'bricolage', body: 'outfit', hero: 'split', items: 'grid', services: 'cards', r: '2rem', texture: 'dots' },
  'Textiles / Garments': { bg: '#0f0508', display: 'cormorant', body: 'jost', hero: 'immersive', items: 'carousel', services: 'bento', r: '1.5rem', texture: 'none' },
  'Real Estate': { bg: '#040b14', display: 'manrope', body: 'inter', hero: 'immersive', items: 'carousel', services: 'cards', r: '1.25rem', texture: 'none' },
  'Consulting': { bg: '#05060f', display: 'spaceGrotesk', body: 'inter', hero: 'stage', items: 'grid', services: 'bento', r: '1.25rem', texture: 'grid' },
  'Other': { bg: '#05060f', display: 'spaceGrotesk', body: 'inter', hero: 'split', items: 'grid', services: 'cards', r: '2rem', texture: 'dots' },
};

const R = 'rounded-[var(--mt-r)]';

/** Aurora: deep night canvas, drifting colour glows and frosted glass. Layout varies by category. */
export default function AuroraTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const look = pickLook(LOOKS, d);
  const { accent, accent2 } = d.preset;
  const glass = 'bg-white/[0.06] border border-white/10 backdrop-blur-xl';
  const grad = `linear-gradient(120deg,${accent},${accent2})`;

  const badge = (
    <span className={`mt-rise inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/80 mb-8 ${glass}`}>
      <Sparkles size={14} style={{ color: accent }} /> {d.preset.label} · {d.preset.marquee[0]}
    </span>
  );
  const title = (cls: string) => !d.hideField('hero_title') && (
    <h1 className={`mt-rise mt-d1 font-display leading-[1.02] tracking-tight [text-wrap:balance] ${cls}`}>
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(120deg,#fff 30%,${accent} 70%,${accent2})` }}>{d.heroTitle}</span>
    </h1>
  );
  const ctas = (
    <>
      <a href="#menu" className={`group inline-flex items-center gap-2 ${R} px-7 py-4 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5`} style={{ backgroundImage: grad, boxShadow: `0 15px 40px -12px ${accent}` }}>
        {d.preset.ctaPrimary} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </a>
      <a href="#about" className={`inline-flex items-center ${R} px-7 py-4 font-semibold text-white/90 hover:bg-white/10 transition-colors ${glass}`}>{d.preset.ctaSecondary}</a>
    </>
  );
  const rating = d.stats[d.stats.length - 1];

  const heroes = {
    split: (
      <section id="hero" className="relative min-h-[100svh] flex items-center px-5 md:px-8 pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <div>
            {badge}
            {title('text-5xl sm:text-6xl lg:text-7xl')}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-7 text-lg text-white/65 leading-relaxed max-w-xl">{d.heroText}</p>}
            <div className="mt-rise mt-d3 mt-10 flex flex-wrap gap-3">{ctas}</div>
            <div className="mt-rise mt-d4 mt-12 flex items-center gap-4 text-sm text-white/60">
              <div className="flex">{[0, 1, 2, 3, 4].map(i => <Star key={i} size={16} fill={accent} stroke="none" />)}</div>
              {rating.value} · {rating.label}
            </div>
          </div>
          <div className="mt-rise mt-d2 relative">
            <div className={`relative aspect-[4/5] sm:aspect-square ${R} overflow-hidden p-2 ${glass}`}>
              <div className={`relative w-full h-full ${R} overflow-hidden`}>
                <HeroMedia video={d.video} images={d.heroImages} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
            {d.stats.slice(0, 2).map((s, i) => (
              <div key={s.label} className={`absolute rounded-2xl px-5 py-4 shadow-2xl ${glass} ${i === 0 ? '-left-3 md:-left-8 top-10' : '-right-3 md:-right-6 bottom-12'}`} style={{ animation: `mt-float ${8 + i * 2}s ease-in-out infinite` }}>
                <div className="font-display text-2xl" style={{ color: i ? accent2 : accent }}>{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    stage: (
      <section id="hero" className="relative px-5 md:px-8 pt-32 md:pt-40 pb-16 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          {badge}
          {title('text-5xl sm:text-6xl lg:text-[5.5rem]')}
          {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-7 text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">{d.heroText}</p>}
          <div className="mt-rise mt-d3 mt-10 flex flex-wrap justify-center gap-3">{ctas}</div>
        </div>
        <div className="mt-rise mt-d4 relative max-w-6xl mx-auto mt-16">
          <div className="absolute -inset-x-10 -top-10 h-40 blur-3xl opacity-50 rounded-full" style={{ backgroundImage: grad }} />
          <div className={`relative aspect-[16/10] md:aspect-[21/9] ${R} overflow-hidden p-2 ${glass}`}>
            <div className={`relative w-full h-full ${R} overflow-hidden`}><HeroMedia video={d.video} images={d.heroImages} /></div>
          </div>
          <div className={`relative -mt-10 mx-auto w-fit flex flex-wrap justify-center gap-6 md:gap-12 rounded-2xl px-6 md:px-10 py-5 ${glass}`}>
            {d.stats.map((s, i) => (
              <div key={s.label}>
                <div className="font-display text-2xl md:text-3xl" style={{ color: i % 2 ? accent2 : accent }}>{s.value}</div>
                <div className="text-xs text-white/55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    immersive: (
      <section id="hero" className="relative min-h-[100svh] flex items-end px-5 md:px-8 pt-28 pb-10 md:pb-16 overflow-hidden">
        <HeroMedia video={d.video} images={d.heroImages} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${look.bg} 2%, ${look.bg}66 45%, transparent)` }} />
        <div className="absolute inset-0 mix-blend-soft-light opacity-60" style={{ backgroundImage: grad }} />
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.4fr_1fr] gap-8 items-end">
          <div className={`${R} p-7 md:p-10 ${glass}`}>
            {badge}
            {title('text-4xl sm:text-5xl lg:text-6xl')}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-6 text-lg text-white/70 leading-relaxed">{d.heroText}</p>}
            <div className="mt-rise mt-d3 mt-8 flex flex-wrap gap-3">{ctas}</div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            {d.stats.map((s, i) => (
              <div key={s.label} className={`mt-rise ${R} px-5 py-4 ${glass}`} style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                <div className="font-display text-2xl md:text-3xl" style={{ color: i % 2 ? accent2 : accent }}>{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  };

  const itemLayouts = {
    grid: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {d.items.slice(0, 8).map((p, i) => (
          <button key={i} onClick={() => open(p)} className={`group text-left ${R} p-2 transition-transform hover:-translate-y-1 ${glass}`}>
            <div className={`aspect-square ${R} overflow-hidden bg-white/5`}>
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg leading-snug">{p.name}</h3>
                {p.price && <span className="shrink-0 text-sm font-semibold" style={{ color: accent }}>{p.price}</span>}
              </div>
              {p.description && <p className="text-sm text-white/55 mt-1.5 line-clamp-2">{p.description}</p>}
            </div>
          </button>
        ))}
      </div>
    ),
    carousel: (
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-5 px-5 md:-mx-8 md:px-8 [scrollbar-width:none]" data-lenis-prevent>
        {d.items.map((p, i) => (
          <button key={i} onClick={() => open(p)} className={`group snap-start shrink-0 w-[78vw] sm:w-[360px] relative aspect-[3/4] text-left ${R} overflow-hidden ${glass}`}>
            {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className={`absolute bottom-3 inset-x-3 ${R} p-5 ${glass}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl leading-snug">{p.name}</h3>
                {p.price && <span className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ backgroundImage: grad }}>{p.price}</span>}
              </div>
              {p.description && <p className="text-sm text-white/65 mt-1.5 line-clamp-2">{p.description}</p>}
            </div>
          </button>
        ))}
      </div>
    ),
    rows: (
      <div className="grid md:grid-cols-2 gap-4">
        {d.items.slice(0, 10).map((p, i) => (
          <button key={i} onClick={() => open(p)} className={`group text-left flex items-center gap-5 ${R} p-3 pr-6 transition-colors hover:bg-white/[0.1] ${glass}`}>
            <div className={`w-20 h-20 md:w-24 md:h-24 shrink-0 ${R} overflow-hidden bg-white/5`}>
              {p.image && <img loading="lazy" src={p.image || undefined} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg md:text-xl leading-snug">{p.name}</h3>
              {p.description && <p className="text-sm text-white/55 mt-1 line-clamp-1">{p.description}</p>}
            </div>
            {p.price && <span className="shrink-0 font-display text-lg bg-clip-text text-transparent" style={{ backgroundImage: grad }}>{p.price}</span>}
          </button>
        ))}
      </div>
    ),
  };

  const serviceLayouts = {
    cards: (
      <div className="grid md:grid-cols-3 gap-5">
        {d.services.map((s, i) => (
          <div key={i} className={`group relative ${R} p-8 overflow-hidden transition-transform hover:-translate-y-1 ${glass}`}>
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: i % 2 ? accent2 : accent }} />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 font-display" style={{ backgroundImage: grad }}>{i + 1}</div>
              <h3 className="font-display text-2xl mb-3">{s.title}</h3>
              <p className="text-white/60 leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    bento: (
      <div className="grid md:grid-cols-3 md:grid-rows-2 gap-5">
        {d.services.map((s, i) => (
          <div key={i} className={`group relative ${R} overflow-hidden ${glass} ${i === 0 ? 'md:col-span-2 md:row-span-2 min-h-[360px] flex items-end' : 'p-8'}`}>
            {i === 0 && (
              <>
                <img loading="lazy" src={d.gallery[2 % d.gallery.length]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${look.bg}, transparent)` }} />
              </>
            )}
            <div className={`relative ${i === 0 ? 'p-8 md:p-10' : ''}`}>
              <Sparkles size={22} className="mb-6" style={{ color: i % 2 ? accent2 : accent }} />
              <h3 className={`font-display mb-3 ${i === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{s.title}</h3>
              <p className="text-white/65 leading-relaxed max-w-lg">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  const sections = {
    hero: heroes[look.hero],
    about: (
      <section id="about" className="relative py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-6 gap-4 md:gap-5">
          <div className={`md:col-span-4 ${R} p-8 md:p-12 ${glass}`}>
            <p className="text-sm font-medium mb-5" style={{ color: accent }}>About us</p>
            {!d.hideField('about_title') && <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6 [text-wrap:balance]">{d.aboutTitle}</h2>}
            {!d.hideField('about_text') && <p className="text-white/65 text-lg leading-relaxed whitespace-pre-line">{d.aboutText}</p>}
          </div>
          <div className={`md:col-span-2 ${R} overflow-hidden min-h-[260px]`}>
            <img loading="lazy" src={d.gallery[0]} alt="" className="w-full h-full object-cover" />
          </div>
          {d.stats.map((s, i) => (
            <div key={s.label} className={`md:col-span-2 ${R} p-8 ${glass}`}>
              <div className="font-display text-4xl md:text-5xl" style={{ color: i % 2 ? accent2 : accent }}>{s.value}</div>
              <div className="text-white/55 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl text-center mb-4">Services</h2>
          <p className="text-center text-white/55 mb-14 max-w-xl mx-auto">{d.preset.heroText}</p>
          {serviceLayouts[look.services]}
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 gap-6">
            <h2 className="font-display text-4xl md:text-6xl">{d.preset.itemsTitle}</h2>
            <button onClick={openAll} className={`rounded-full px-5 py-2.5 text-sm hover:bg-white/10 transition-colors ${glass}`}>View all</button>
          </div>
          {itemLayouts[look.items]}
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl mb-12">Gallery</h2>
          <div className="columns-2 md:columns-3 gap-4 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
            {d.gallery.map((src, i) => (
              <div key={i} className={`break-inside-avoid ${R} overflow-hidden`}>
                <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className={`w-full object-cover hover:scale-105 transition-transform duration-700 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    contact: (
      <section id="contact" className="py-24 md:py-32 px-5 md:px-8">
        <div className={`max-w-6xl mx-auto ${R} p-6 md:p-12 grid lg:grid-cols-2 gap-12 ${glass}`}>
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Say hello</h2>
            <p className="text-white/60 mb-10 leading-relaxed">Questions, bookings or orders, send us a message and we’ll reply quickly.</p>
            <div className="space-y-3">
              {[
                { show: d.contact.phone && !d.hideField('contact_phone'), icon: Phone, label: d.contact.phone, href: telHref(d.contact.phone) },
                { show: d.contact.email && !d.hideField('contact_email'), icon: Mail, label: d.contact.email, href: `mailto:${d.contact.email}` },
                { show: d.contact.address && !d.hideField('contact_address'), icon: MapPin, label: d.contact.address, href: mapHref(d.contact.address) },
              ].filter(r => r.show).map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                  <span className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundImage: `linear-gradient(135deg,${accent},${accent2})` }}><Icon size={18} /></span>
                  <span className="break-words min-w-0">{label}</span>
                </a>
              ))}
            </div>
            <ContactExtras content={content} align="left" className="mt-8" accent={accent} />
          </div>
          <ContactForm websiteId={website?.id} primaryColor="bg-[var(--mt-accent)]" primaryColorHover="hover:opacity-90" buttonShape="rounded-2xl" />
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  const texture = {
    dots: { backgroundImage: 'radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '28px 28px' },
    grid: { backgroundImage: 'linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px)', backgroundSize: '72px 72px' },
    none: null,
  }[look.texture];

  return (
    <div className="mt-root relative min-h-screen text-white font-body overflow-x-clip" style={{ background: look.bg, ['--mt-accent' as any]: accent, ['--mt-r' as any]: look.r }}>
      <ThemeFonts display={look.display} body={look.body} />
      {/* Drifting aurora glows behind the whole page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden mt-motion" aria-hidden>
        <div className="absolute -top-40 -left-32 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] opacity-35" style={{ background: accent, animation: 'mt-float 18s ease-in-out infinite' }} />
        <div className="absolute top-1/3 -right-40 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full blur-[130px] opacity-30" style={{ background: accent2, animation: 'mt-float 22s ease-in-out infinite reverse' }} />
        {texture && <div className="absolute inset-0 opacity-[0.15]" style={texture} />}
      </div>
      <div className="relative">
        <MotionNav
          data={d}
          links={navLinks(d)}
          barClass="text-white"
          solidClass="text-white backdrop-blur-xl border-b border-white/10"
          menuClass="text-white font-display"
          logoClass="font-display text-lg md:text-xl"
          cta={<a href="#contact" className={`${R} px-5 py-2.5 text-sm font-semibold bg-white text-black`}>{d.preset.ctaPrimary}</a>}
          bg={look.bg}
        />
        <Sections data={d} sections={sections} />
        <footer className="py-10 px-5 text-center text-sm text-white/40">© {new Date().getFullYear()} {d.siteName}</footer>
      </div>
      {modals}
    </div>
  );
}
