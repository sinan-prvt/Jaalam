import { ArrowRight, Mail, MapPin, Phone, Sparkles, Star } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, MotionNav, MotionStyles, Sections, mapHref, navLinks, telHref, useMotionData, useProductModals } from './shared';

/** Aurora: deep night canvas, drifting colour glows, frosted glass cards and a bento grid. */
export default function AuroraTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);
  const { accent, accent2 } = d.preset;
  const glass = 'bg-white/[0.06] border border-white/10 backdrop-blur-xl';

  const sections = {
    hero: (
      <section id="hero" className="relative min-h-[100svh] flex items-center px-5 md:px-8 pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <div>
            <span className={`mt-rise inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/80 mb-8 ${glass}`}>
              <Sparkles size={14} style={{ color: accent }} /> {d.preset.label} · {d.preset.marquee[0]}
            </span>
            {!d.hideField('hero_title') && (
              <h1 className="mt-rise mt-d1 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight [text-wrap:balance]">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(120deg,#fff 30%,${accent} 70%,${accent2})` }}>{d.heroTitle}</span>
              </h1>
            )}
            {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-7 text-lg text-white/65 leading-relaxed max-w-xl">{d.heroText}</p>}
            <div className="mt-rise mt-d3 mt-10 flex flex-wrap gap-3">
              <a href="#menu" className="group inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5" style={{ backgroundImage: `linear-gradient(120deg,${accent},${accent2})`, boxShadow: `0 15px 40px -12px ${accent}` }}>
                {d.preset.ctaPrimary} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#about" className={`inline-flex items-center rounded-2xl px-7 py-4 font-semibold text-white/90 hover:bg-white/10 transition-colors ${glass}`}>{d.preset.ctaSecondary}</a>
            </div>
            <div className="mt-rise mt-d4 mt-12 flex items-center gap-4 text-sm text-white/60">
              <div className="flex">{[0, 1, 2, 3, 4].map(i => <Star key={i} size={16} fill={accent} stroke="none" />)}</div>
              {d.preset.stats[d.preset.stats.length - 1].value} · {d.preset.stats[d.preset.stats.length - 1].label}
            </div>
          </div>
          <div className="mt-rise mt-d2 relative">
            <div className={`relative aspect-[4/5] sm:aspect-[5/5] rounded-[2.5rem] overflow-hidden p-2 ${glass}`}>
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <HeroMedia video={d.video} images={d.heroImages} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
            {d.preset.stats.slice(0, 2).map((s, i) => (
              <div key={s.label} className={`absolute rounded-2xl px-5 py-4 shadow-2xl ${glass} ${i === 0 ? '-left-3 md:-left-8 top-10' : '-right-3 md:-right-6 bottom-12'}`} style={{ animation: `mt-float ${8 + i * 2}s ease-in-out infinite` }}>
                <div className="font-display text-2xl" style={{ color: i ? accent2 : accent }}>{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    about: (
      <section id="about" className="relative py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-6 gap-4 md:gap-5">
          <div className={`md:col-span-4 rounded-[2rem] p-8 md:p-12 ${glass}`}>
            <p className="text-sm font-medium mb-5" style={{ color: accent }}>About us</p>
            {!d.hideField('about_title') && <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6 [text-wrap:balance]">{d.aboutTitle}</h2>}
            {!d.hideField('about_text') && <p className="text-white/65 text-lg leading-relaxed whitespace-pre-line">{d.aboutText}</p>}
          </div>
          <div className="md:col-span-2 rounded-[2rem] overflow-hidden min-h-[260px]">
            <img loading="lazy" src={d.gallery[0]} alt="" className="w-full h-full object-cover" />
          </div>
          {d.preset.stats.map((s, i) => (
            <div key={s.label} className={`md:col-span-2 rounded-[2rem] p-8 ${glass}`}>
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
          <div className="grid md:grid-cols-3 gap-5">
            {d.services.map((s, i) => (
              <div key={i} className={`group relative rounded-[2rem] p-8 overflow-hidden transition-transform hover:-translate-y-1 ${glass}`}>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: i % 2 ? accent2 : accent }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 font-display" style={{ backgroundImage: `linear-gradient(135deg,${accent},${accent2})` }}>{i + 1}</div>
                  <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                  <p className="text-white/60 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {d.items.slice(0, 8).map((p, i) => (
              <button key={i} onClick={() => open(p)} className={`group text-left rounded-[1.75rem] p-2 transition-transform hover:-translate-y-1 ${glass}`}>
                <div className="aspect-square rounded-[1.4rem] overflow-hidden bg-white/5">
                  {p.image && <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
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
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl mb-12">Gallery</h2>
          <div className="columns-2 md:columns-3 gap-4 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
            {d.gallery.map((src, i) => (
              <div key={i} className="break-inside-avoid rounded-[1.5rem] overflow-hidden">
                <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className={`w-full object-cover hover:scale-105 transition-transform duration-700 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    contact: (
      <section id="contact" className="py-24 md:py-32 px-5 md:px-8">
        <div className={`max-w-6xl mx-auto rounded-[2.5rem] p-6 md:p-12 grid lg:grid-cols-2 gap-12 ${glass}`}>
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

  return (
    <div className="mt-root relative min-h-screen bg-[#05060f] text-white font-body overflow-x-clip" style={{ ['--mt-accent' as any]: accent }}>
      <MotionStyles fonts="family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600" />
      <style>{`.mt-root .font-display{font-family:'Space Grotesk',sans-serif;font-weight:600}.mt-root .font-body{font-family:'Inter',sans-serif}`}</style>
      {/* Drifting aurora glows behind the whole page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden mt-motion" aria-hidden>
        <div className="absolute -top-40 -left-32 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] opacity-35" style={{ background: accent, animation: 'mt-float 18s ease-in-out infinite' }} />
        <div className="absolute top-1/3 -right-40 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full blur-[130px] opacity-30" style={{ background: accent2, animation: 'mt-float 22s ease-in-out infinite reverse' }} />
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>
      <div className="relative">
        <MotionNav
          data={d}
          links={navLinks(d)}
          barClass="text-white"
          solidClass="text-white bg-[#05060f]/70 backdrop-blur-xl border-b border-white/10"
          menuClass="bg-[#05060f] text-white font-display"
          logoClass="font-display text-lg md:text-xl"
          cta={<a href="#contact" className="rounded-xl px-5 py-2.5 text-sm font-semibold bg-white text-black">{d.preset.ctaPrimary}</a>}
        />
        <Sections data={d} sections={sections} />
        <footer className="py-10 px-5 text-center text-sm text-white/40">© {new Date().getFullYear()} {d.siteName}</footer>
      </div>
      {modals}
    </div>
  );
}
