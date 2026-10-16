import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, Marquee, MotionNav, MotionStyles, Sections, mapHref, navLinks, telHref, useMotionData, useProductModals } from './shared';

const INK = '#1c1917';
const PAPER = '#f6f1ea';

function Label({ n, accent, children }: { n: string; accent: string; children: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] mb-8 text-stone-500">
      <span className="font-display italic text-base normal-case tracking-normal" style={{ color: accent }}>{n}</span>
      <span className="h-px flex-1 bg-stone-300" />
      {children}
    </div>
  );
}

/** Editorial: magazine layout on warm paper, oversized serif type and an arched video frame. */
export default function EditorialTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const accent = d.preset.accent2;
  const year = new Date().getFullYear();

  const sections = {
    hero: (
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
                <h1 className="mt-rise font-display text-[14vw] sm:text-7xl lg:text-[7.5rem] leading-[0.9] tracking-[-0.03em] [text-wrap:balance]">
                  {d.heroTitle}
                </h1>
              )}
              <div className="mt-rise mt-d2 mt-10 grid sm:grid-cols-2 gap-8 items-start">
                {!d.hideField('hero_description') && <p className="text-lg leading-relaxed text-stone-600">{d.heroText}</p>}
                <div className="flex flex-col gap-3">
                  <a href="#menu" className="group inline-flex items-center justify-between gap-4 px-6 py-4 text-white rounded-full" style={{ background: INK }}>
                    {d.preset.ctaPrimary} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="#about" className="inline-flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-stone-400 hover:bg-stone-900 hover:text-white transition-colors">
                    {d.preset.ctaSecondary} <ArrowUpRight size={18} />
                  </a>
                </div>
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
    about: (
      <section id="about" className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Label accent={accent} n="01">About</Label>
          <div className="grid lg:grid-cols-12 gap-10">
            {!d.hideField('about_title') && <h2 className="lg:col-span-5 font-display text-4xl md:text-6xl leading-[1] tracking-tight [text-wrap:balance]">{d.aboutTitle}</h2>}
            <div className="lg:col-span-6 lg:col-start-7">
              {!d.hideField('about_text') && <p className="text-xl md:text-2xl leading-relaxed text-stone-700 font-display whitespace-pre-line">{d.aboutText}</p>}
              <div className="grid grid-cols-3 gap-4 mt-12">
                {d.preset.stats.map(s => (
                  <div key={s.label} className="border-t border-stone-900 pt-4">
                    <div className="font-display text-3xl md:text-4xl">{s.value}</div>
                    <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-20 md:py-28 px-5 md:px-8 text-white" style={{ background: INK }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] mb-12 text-stone-400">
            <span className="font-display italic text-base normal-case tracking-normal" style={{ color: accent }}>02</span>
            <span className="h-px flex-1 bg-stone-700" /> Services
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-stone-700">
            {d.services.map((s, i) => (
              <div key={i} className="p-8 md:p-10" style={{ background: INK }}>
                <div className="font-display italic text-6xl mb-10" style={{ color: accent }}>{['i', 'ii', 'iii', 'iv', 'v', 'vi'][i] || i + 1}.</div>
                <h3 className="font-display text-2xl md:text-3xl mb-4">{s.title}</h3>
                <p className="text-stone-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Label accent={accent} n="03">{d.preset.itemsTitle}</Label>
          <div className="flex items-end justify-between gap-6 mb-10">
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">{d.preset.itemsTitle}</h2>
            <button onClick={openAll} className="text-sm underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900">See everything</button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-5 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-6 [scrollbar-width:none]" data-lenis-prevent>
          {d.items.map((p, i) => (
            <button key={i} onClick={() => open(p)} className="group snap-start shrink-0 w-[75vw] sm:w-[340px] text-left">
              <div className="aspect-[4/5] overflow-hidden bg-stone-200 mb-5">
                {p.image && <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-stone-300 pb-3">
                <h3 className="font-display text-2xl">{p.name}</h3>
                {p.price && <span className="shrink-0 text-stone-600">{p.price}</span>}
              </div>
              {p.description && <p className="text-stone-500 mt-3 text-sm leading-relaxed">{p.description}</p>}
            </button>
          ))}
        </div>
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
            <ContactForm websiteId={website?.id} primaryColor="bg-stone-900" primaryColorHover="hover:bg-stone-700" buttonShape="rounded-full" />
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  return (
    <div className="mt-root min-h-screen font-body" style={{ background: PAPER, color: INK }}>
      <MotionStyles fonts="family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600" />
      <style>{`.mt-root .font-display{font-family:'Fraunces',serif;font-weight:400}.mt-root .font-body{font-family:'Inter',sans-serif}`}</style>
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass="text-stone-900"
        solidClass="text-stone-900 bg-[#f6f1ea]/90 backdrop-blur-md border-b border-stone-300"
        menuClass="bg-[#f6f1ea] text-stone-900 font-display"
        logoClass="font-display text-xl md:text-2xl"
        cta={<a href="#contact" className="rounded-full px-5 py-2.5 text-sm text-white" style={{ background: INK }}>{d.preset.ctaPrimary}</a>}
      />
      <Sections data={d} sections={sections} />
      <div className="border-y border-stone-300 py-6 font-display italic text-3xl md:text-5xl text-stone-400">
        <Marquee words={d.preset.marquee} separator="—" speed={40} />
      </div>
      <footer className="py-10 px-5 md:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-2 text-sm text-stone-500">
        <span className="font-display text-stone-900 text-lg">{d.siteName}</span>
        <span>© {year}. All rights reserved.</span>
      </footer>
      {modals}
    </div>
  );
}
