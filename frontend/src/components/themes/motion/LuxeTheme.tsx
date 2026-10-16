import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../shared/ContactForm';
import ContactExtras from '../shared/ContactExtras';
import { CustomBlocks, HeroMedia, MotionNav, MotionStyles, Sections, mapHref, navLinks, telHref, useMotionData, useProductModals } from './shared';

const GOLD = '#C9A96E';
const BG = '#14100c';
const BG2 = '#1c1712';

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-6" style={{ color: GOLD }}>
      <span className="w-12 h-px bg-current opacity-60" /><span className="w-1.5 h-1.5 rotate-45 bg-current" /><span className="w-12 h-px bg-current opacity-60" />
    </div>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-14 md:mb-20">
      <p className="text-[11px] uppercase tracking-[0.45em]" style={{ color: GOLD }}>{eyebrow}</p>
      <Ornament />
      <h2 className="font-display text-4xl md:text-6xl font-light">{title}</h2>
    </div>
  );
}

/** Luxe Motion: espresso and gold, slow cinematic fades, framed video and arched cards. */
export default function LuxeTheme({ website, content }: any) {
  const d = useMotionData(website, content);
  const { open, openAll, modals } = useProductModals(d, content);

  const sections = {
    hero: (
      <section id="hero" className="relative min-h-[100svh] flex items-center justify-center text-center overflow-hidden">
        <HeroMedia video={d.video} images={d.heroImages} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,16,12,.35),rgba(20,16,12,.92))]" />
        <div className="absolute inset-5 md:inset-10 border pointer-events-none" style={{ borderColor: `${GOLD}55` }} />
        <div className="relative z-10 max-w-4xl px-8 pt-20">
          <p className="mt-rise text-[11px] md:text-xs uppercase tracking-[0.5em]" style={{ color: GOLD }}>{d.preset.label}</p>
          <Ornament />
          {!d.hideField('hero_title') && (
            <h1 className="mt-rise mt-d1 font-display font-light text-5xl sm:text-7xl lg:text-8xl leading-[1.02] [text-wrap:balance]">{d.heroTitle}</h1>
          )}
          {!d.hideField('hero_description') && <p className="mt-rise mt-d2 mt-8 text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto font-light">{d.heroText}</p>}
          <div className="mt-rise mt-d3 mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#menu" className="px-10 py-4 text-xs uppercase tracking-[0.3em] text-[#14100c] transition-colors hover:bg-white" style={{ background: GOLD }}>{d.preset.ctaPrimary}</a>
            <a href="#about" className="px-10 py-4 text-xs uppercase tracking-[0.3em] border hover:bg-white/5 transition-colors" style={{ borderColor: GOLD, color: GOLD }}>{d.preset.ctaSecondary}</a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/50">
          Scroll <span className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>
    ),
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
            {!d.hideField('about_text') && <p className="text-white/65 text-lg leading-loose font-light whitespace-pre-line">{d.aboutText}</p>}
            <div className="flex gap-10 mt-12">
              {d.stats.map(s => (
                <div key={s.label}>
                  <div className="font-display text-4xl font-light" style={{ color: GOLD }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/45 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    services: (
      <section id="services" className="py-24 md:py-36 px-6 md:px-8" style={{ background: BG2 }}>
        <div className="max-w-5xl mx-auto">
          <Heading eyebrow="The Experience" title="Our Services" />
          <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x" style={{ borderColor: `${GOLD}33` }}>
            {d.services.map((s, i) => (
              <div key={i} className="text-center md:px-10" style={{ borderColor: `${GOLD}33` }}>
                <div className="font-display italic text-5xl font-light mb-6" style={{ color: GOLD }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display text-2xl md:text-3xl mb-4">{s.title}</h3>
                <p className="text-white/55 leading-relaxed font-light">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    menu: (
      <section id="menu" className="py-24 md:py-36 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Heading eyebrow="Curated For You" title={d.preset.itemsTitle} />
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
          <div className="text-center mt-14">
            <button onClick={openAll} className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.35em] border-b pb-2" style={{ color: GOLD, borderColor: GOLD }}>Discover all <ArrowRight size={14} /></button>
          </div>
        </div>
      </section>
    ),
    gallery: (
      <section id="gallery" className="py-24 md:py-36 px-6 md:px-8" style={{ background: BG2 }}>
        <div className="max-w-7xl mx-auto">
          <Heading eyebrow="Glimpses" title="Gallery" />
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
          <Heading eyebrow="Reservations & Enquiries" title="Visit Us" />
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
              {d.contact.phone && !d.hideField('contact_phone') && <a href={telHref(d.contact.phone)} className="block"><Phone size={18} className="mx-auto lg:mx-0 mb-3" style={{ color: GOLD }} /><span className="font-display text-2xl">{d.contact.phone}</span></a>}
              {d.contact.email && !d.hideField('contact_email') && <a href={`mailto:${d.contact.email}`} className="block"><Mail size={18} className="mx-auto lg:mx-0 mb-3" style={{ color: GOLD }} /><span className="font-display text-2xl break-all">{d.contact.email}</span></a>}
              {d.contact.address && !d.hideField('contact_address') && <a href={mapHref(d.contact.address)} target="_blank" rel="noreferrer" className="block"><MapPin size={18} className="mx-auto lg:mx-0 mb-3" style={{ color: GOLD }} /><span className="font-display text-2xl">{d.contact.address}</span></a>}
              <ContactExtras content={content} align="left" accent={GOLD} />
            </div>
            <div className="lg:col-span-3 border p-6 md:p-10" style={{ borderColor: `${GOLD}44` }}>
              <ContactForm websiteId={website?.id} primaryColor="bg-[#C9A96E] !text-[#14100c]" primaryColorHover="hover:bg-white" buttonShape="rounded-none" />
            </div>
          </div>
        </div>
      </section>
    ),
    custom: <CustomBlocks data={d} />,
  };

  return (
    <div className="mt-root min-h-screen text-[#f3ece2] font-body" style={{ background: BG }}>
      <MotionStyles fonts="family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@300;400;500" />
      <style>{`.mt-root .font-display{font-family:'Cormorant Garamond',serif}.mt-root .font-body{font-family:'Jost',sans-serif}`}</style>
      <MotionNav
        data={d}
        links={navLinks(d)}
        barClass="text-[#f3ece2]"
        solidClass="text-[#f3ece2] bg-[#14100c]/85 backdrop-blur-md border-b border-[#C9A96E]/20"
        menuClass="bg-[#14100c] text-[#f3ece2] font-display"
        logoClass="font-display text-xl md:text-2xl uppercase tracking-[0.25em]"
        cta={<a href="#contact" className="px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#14100c] transition-colors">{d.preset.ctaPrimary}</a>}
      />
      <Sections data={d} sections={sections} />
      <footer className="py-14 px-6 text-center border-t" style={{ borderColor: `${GOLD}22` }}>
        <div className="font-display text-3xl uppercase tracking-[0.3em]">{d.siteName}</div>
        <Ornament />
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">© {new Date().getFullYear()} · All rights reserved</p>
      </footer>
      {modals}
    </div>
  );
}
