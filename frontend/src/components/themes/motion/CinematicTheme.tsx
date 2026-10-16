import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Play } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, Marquee, MotionNav, MotionStyles, Sections, mapHref, navLinks, telHref, useMotionData, useProductModals } from './shared';

/** Cinematic: full-screen video hero, oversized type, dark film-like sections. */
export default function CinematicTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const accent = d.preset.accent;

  const sections = {
    hero: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <HeroMedia video={d.video} images={d.heroImages} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-black/40 to-black/30" />
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
            <div className="mt-rise mt-d3 md:col-span-6 flex flex-wrap md:justify-end gap-3">
              <a href="#menu" className="group inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03]" style={{ background: accent }}>
                {d.preset.ctaPrimary} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#about" className="inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <Play size={16} fill="currentColor" /> {d.preset.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm py-4 text-white/80 text-sm uppercase tracking-[0.3em]">
          <Marquee words={d.preset.marquee} />
        </div>
      </section>
    ),
    about: (
      <section id="about" className="py-24 md:py-36 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
              <img loading="lazy" src={d.gallery[0]} alt={d.aboutTitle} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-10 w-40 md:w-52 aspect-square rounded-[1.5rem] overflow-hidden border-4 border-[#07070a] shadow-2xl">
              <img loading="lazy" src={d.gallery[1] || d.gallery[0]} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.35em] mb-6" style={{ color: accent }}>Our Story</p>
            {!d.hideField('about_title') && <h2 className="font-display text-4xl md:text-6xl leading-[1.02] mb-8 [text-wrap:balance]">{d.aboutTitle}</h2>}
            {!d.hideField('about_text') && <p className="text-lg md:text-xl text-white/65 leading-relaxed whitespace-pre-line">{d.aboutText}</p>}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/10">
              {d.stats.map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl md:text-5xl" style={{ color: accent }}>{s.value}</div>
                  <div className="text-xs md:text-sm uppercase tracking-widest text-white/50 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-24 md:py-32 px-5 md:px-8 bg-[#0d0d12]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <h2 className="font-display text-4xl md:text-6xl">What we do</h2>
            <p className="text-white/55 max-w-sm">{d.preset.heroText}</p>
          </div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {d.items.slice(0, 8).map((p, i) => (
              <button key={i} onClick={() => open(p)} className="group text-left">
                <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-white/5">
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
          <button onClick={openAll} className="sm:hidden mt-8 w-full rounded-full border border-white/20 py-4 text-sm uppercase tracking-widest">View all</button>
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-32 bg-[#0d0d12] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8 mb-12">
          <h2 className="font-display text-4xl md:text-6xl">Moments</h2>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory px-5 md:px-8 pb-4 [scrollbar-width:none]" data-lenis-prevent>
          {d.gallery.map((src, i) => (
            <div key={i} className={`snap-start shrink-0 rounded-[1.5rem] overflow-hidden ${i % 2 ? 'w-[70vw] md:w-[30vw] aspect-[3/4]' : 'w-[85vw] md:w-[42vw] aspect-[4/3]'}`}>
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
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10">
            <ContactForm websiteId={website?.id} primaryColor="bg-[var(--mt-accent)] !text-black" primaryColorHover="hover:opacity-90" buttonShape="rounded-full" />
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  return (
    <div className="mt-root min-h-screen bg-[#07070a] text-white font-body" style={{ ['--mt-accent' as any]: accent }}>
      <MotionStyles fonts="family=Syne:wght@600;700;800&family=Inter:wght@400;500;600" />
      <style>{`.mt-root .font-display{font-family:'Syne',sans-serif;font-weight:700}.mt-root .font-body{font-family:'Inter',sans-serif}`}</style>
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass="text-white bg-gradient-to-b from-black/50 to-transparent"
        solidClass="text-white bg-[#07070a]/85 backdrop-blur-md border-b border-white/10"
        menuClass="bg-[#07070a] text-white font-display"
        logoClass="font-display text-lg md:text-xl uppercase tracking-wider"
        cta={<a href="#contact" className="rounded-full px-5 py-2.5 text-sm font-semibold text-black" style={{ background: accent }}>{d.preset.ctaPrimary}</a>}
      />
      <Sections data={d} sections={sections} />
      <footer className="border-t border-white/10 py-10 px-5 text-center text-sm text-white/40">
        © {new Date().getFullYear()} {d.siteName}. All rights reserved.
      </footer>
      {modals}
    </div>
  );
}
