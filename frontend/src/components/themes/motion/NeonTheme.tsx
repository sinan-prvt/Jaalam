import { ArrowRight, Mail, MapPin, Phone, Zap } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, Marquee, MotionNav, MotionStyles, Sections, mapHref, navLinks, telHref, useMotionData, useProductModals } from './shared';

function Title({ kicker, accent, children }: { kicker: string; accent: string; children: string }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>// {kicker}</p>
      <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">{children}</h2>
    </div>
  );
}

/** Neon Pulse: black canvas, glowing accent, crossed marquees and a tilted video card. */
export default function NeonTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const { accent, accent2 } = d.preset;
  const glow = { textShadow: `0 0 24px ${accent}99` };

  const sections = {
    hero: (
      <section id="hero" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-10">
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse at center,black 30%,transparent 75%)' }} />
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <span className="mt-rise inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] border px-3 py-1.5 mb-8" style={{ borderColor: accent, color: accent }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} /> Live · {d.preset.label}
            </span>
            {!d.hideField('hero_title') && (
              <h1 className="mt-rise mt-d1 font-display uppercase text-[12vw] sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tight [text-wrap:balance]">
                {d.heroTitle}
              </h1>
            )}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-lg text-white/60 max-w-xl leading-relaxed">{d.heroText}</p>}
            <div className="mt-rise mt-d3 mt-10 flex flex-wrap gap-4">
              <a href="#menu" className="group inline-flex items-center gap-3 px-7 py-4 font-display uppercase text-sm text-black transition-shadow" style={{ background: accent, boxShadow: `0 0 0 0 ${accent}`, }} onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${accent}`)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                {d.preset.ctaPrimary} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#about" className="inline-flex items-center px-7 py-4 font-display uppercase text-sm border border-white/30 hover:border-white transition-colors">{d.preset.ctaSecondary}</a>
            </div>
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
        <div className="relative mt-16 space-y-0">
          <div className="-rotate-2 scale-105 py-3 font-display uppercase text-xl md:text-3xl text-black" style={{ background: accent }}>
            <Marquee words={d.preset.marquee} separator="✺" speed={25} />
          </div>
          <div className="rotate-1 scale-105 -mt-2 py-3 font-display uppercase text-xl md:text-3xl border-y border-white/20 bg-black text-white/90">
            <Marquee words={[...d.preset.marquee].reverse()} separator="✺" speed={35} />
          </div>
        </div>
      </section>
    ),
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
          <div className="grid md:grid-cols-3 gap-4">
            {d.services.map((s, i) => (
              <div key={i} className="group relative border border-white/15 p-8 min-h-[280px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1" onMouseEnter={e => (e.currentTarget.style.borderColor = accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = '')}>
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
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6">
            <Title accent={accent} kicker="catalogue">{d.preset.itemsTitle}</Title>
            <button onClick={openAll} className="mb-12 font-mono text-xs uppercase tracking-widest border-b pb-1" style={{ color: accent, borderColor: accent }}>All →</button>
          </div>
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

  return (
    <div className="mt-root min-h-screen bg-black text-white font-body overflow-x-clip" style={{ ['--mt-accent' as any]: accent }}>
      <MotionStyles fonts="family=Unbounded:wght@500;700;800&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500" />
      <style>{`.mt-root .font-display{font-family:'Unbounded',sans-serif;font-weight:700}.mt-root .font-body{font-family:'Space Grotesk',sans-serif}.mt-root .font-mono{font-family:'JetBrains Mono',monospace}`}</style>
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass="text-white"
        solidClass="text-white bg-black/80 backdrop-blur-md border-b border-white/10"
        menuClass="bg-black text-white font-display uppercase"
        logoClass="font-display uppercase text-base md:text-lg tracking-tight"
        cta={<a href="#contact" className="px-5 py-2.5 text-sm font-display uppercase text-black" style={{ background: accent }}>{d.preset.ctaPrimary}</a>}
      />
      <Sections data={d} sections={sections} />
      <footer className="border-t border-white/10 py-10 px-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-3 font-mono text-xs uppercase tracking-widest text-white/40">
          <span>{d.siteName}</span><span>© {new Date().getFullYear()} — All rights reserved</span>
        </div>
      </footer>
      {modals}
    </div>
  );
}
