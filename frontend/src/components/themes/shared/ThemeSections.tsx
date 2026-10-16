import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from './ContactForm';

/**
 * Modern About / Services / Gallery / Contact sections shared by business themes.
 *
 * Each theme passes a `look` describing its palette and fonts, so these sections
 * blend in with the theme's own hero, header and footer instead of looking bolted on.
 */
export interface SectionLook {
  /** Business family, used for relevant default copy and imagery. */
  kind: 'textiles' | 'realestate' | 'consulting' | 'fancy' | 'grocery';
  /** Main and alternate section backgrounds (any CSS color). */
  bg: string;
  altBg: string;
  /** Body text and accent colors (any CSS color). */
  text: string;
  accent: string;
  /** Text color used on top of the accent color. */
  onAccent?: string;
  /** Font classes defined by the theme (e.g. 'font-luxury'). */
  headingFont?: string;
  bodyFont?: string;
  /** Corner style of cards and images. */
  radius?: 'none' | 'md' | 'xl';
  /** Uppercase, letter-spaced headings (luxury / editorial themes). */
  uppercase?: boolean;
}

const RADIUS = { none: 'rounded-none', md: 'rounded-lg', xl: 'rounded-3xl' };

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const DEFAULTS: Record<SectionLook['kind'], { about: string; services: { title: string; description: string }[]; gallery: string[] }> = {
  textiles: {
    about: 'From handpicked fabrics to finished garments, we bring you clothing made to be worn, loved and kept. Every piece in our store is chosen for its quality, comfort and craftsmanship.',
    services: [
      { title: 'Curated Fabrics', description: 'Cottons, silks and linens sourced from trusted weavers and mills.' },
      { title: 'Custom Tailoring', description: 'Alterations and made-to-measure fittings by experienced tailors.' },
      { title: 'Bulk & Wholesale', description: 'Special pricing for boutiques, uniforms and family occasions.' },
    ],
    gallery: ['photo-1567401893414-76b7b1e5a7a5', 'photo-1489987707025-afc232f7ea0f', 'photo-1512436991641-6745cdb1723f', 'photo-1528255915607-9012fda0f838', 'photo-1537832816519-689ad163238b'],
  },
  realestate: {
    about: 'We help families and businesses find the right property with honest advice, verified listings and support at every step, from the first visit to the final paperwork.',
    services: [
      { title: 'Buy & Sell', description: 'Verified listings, fair valuations and smooth negotiations.' },
      { title: 'Rentals & Leasing', description: 'Homes and commercial spaces matched to your budget and timeline.' },
      { title: 'Legal & Loans', description: 'Documentation, registration and home-loan assistance under one roof.' },
    ],
    gallery: ['photo-1600596542815-ffad4c1539a9', 'photo-1600585154340-be6161a56a0c', 'photo-1545324418-cc1a3fa10c00', 'photo-1512917774080-9991f1c4c750', 'photo-1583608205776-bfd35f0d9f83'],
  },
  consulting: {
    about: 'We partner with founders and leadership teams to solve their hardest problems. Clear thinking, practical plans and hands-on execution, measured by the results we deliver together.',
    services: [
      { title: 'Strategy', description: 'Market analysis, growth plans and clear priorities for the next stage.' },
      { title: 'Operations', description: 'Leaner processes, better systems and teams that scale with you.' },
      { title: 'Advisory', description: 'Ongoing guidance for leadership on the decisions that matter most.' },
    ],
    gallery: ['photo-1497366216548-37526070297c', 'photo-1522071820081-009f0129c71c', 'photo-1519389950473-47ba0277781c', 'photo-1556761175-5973dc0f32e7', 'photo-1486406146926-c627a92ad1ab'],
  },
  fancy: {
    about: 'A little store full of things that make you smile: jewellery, cosmetics, gifts and accessories, picked with care so you always find something special.',
    services: [
      { title: 'Gift Wrapping', description: 'Beautifully wrapped and ready to give, at no extra cost.' },
      { title: 'New Arrivals Weekly', description: 'Fresh accessories and trends added to our shelves every week.' },
      { title: 'Bridal Collections', description: 'Coordinated sets for weddings, parties and festive occasions.' },
    ],
    gallery: ['photo-1511556820780-d912e42b4980', 'photo-1535632066927-ab7c9ab60908', 'photo-1509319117193-57bab727e09d', 'photo-1534073828943-f801091bb18c', 'photo-1518005020951-eccb494ad742'],
  },
  grocery: {
    about: 'Your neighbourhood store for fresh produce, daily essentials and pantry favourites. Fair prices, friendly faces and quality you can count on, every single day.',
    services: [
      { title: 'Fresh Every Morning', description: 'Fruits, vegetables and dairy restocked daily from local suppliers.' },
      { title: 'Home Delivery', description: 'Order by phone or WhatsApp and get it delivered to your door.' },
      { title: 'Monthly Savings', description: 'Weekly offers and bulk-buy discounts on household essentials.' },
    ],
    gallery: ['photo-1542838132-92c53300491e', 'photo-1578916171728-46686eac8d58', 'photo-1534723452862-4c874018d66d', 'photo-1604719312566-8912e9227c6a', 'photo-1583258292688-d0213dc5a3a8'],
  },
};

interface SectionProps {
  content: any;
  look: SectionLook;
  /** Flex order of the section inside the theme root (sectionOrder index + 1). */
  order: number;
}

function Shell({ id, look, order, alt, children }: { id: string; look: SectionLook; order: number; alt?: boolean; children: ReactNode }) {
  const style = {
    order,
    background: alt ? look.altBg : look.bg,
    color: look.text,
    '--ts-accent': look.accent,
    '--ts-on-accent': look.onAccent || '#fff',
  } as CSSProperties;
  return (
    <section id={id} style={style} className={`py-20 md:py-28 px-6 ${look.bodyFont || ''}`}>
      <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Heading({ look, eyebrow, title, center }: { look: SectionLook; eyebrow: string; title: ReactNode; center?: boolean }) {
  return (
    <div className={`mb-12 md:mb-16 ${center ? 'text-center mx-auto' : ''} max-w-2xl`}>
      <div className={`flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--ts-accent)] ${center ? 'justify-center' : ''}`}>
        <span className="w-8 h-px bg-current" />
        {eyebrow}
      </div>
      <h2 className={`${look.headingFont || ''} text-3xl md:text-5xl leading-tight ${look.uppercase ? 'uppercase tracking-wider font-normal' : 'font-bold tracking-tight'}`}>
        {title}
      </h2>
    </div>
  );
}

const hidden = (content: any, field: string) => (content?.settings_json?.hidden_elements || []).includes(field);

export function ThemeAbout({ content, look, order }: SectionProps) {
  const defaults = DEFAULTS[look.kind];
  const radius = RADIUS[look.radius || 'md'];
  const title = content.settings_json?.about_title || content.about_title || 'About Us';
  const text = content.settings_json?.about_description || content.about_text || defaults.about;
  const gallery = (content.gallery_json || []).map((g: any) => (typeof g === 'string' ? g : g?.url || g?.image)).filter(Boolean);
  const image = content.settings_json?.about_image || gallery[0] || img(defaults.gallery[0]);
  const points = ['Trusted by local customers', 'Quality you can see', 'Friendly, personal service'];

  return (
    <Shell id="about" look={look} order={order}>
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <Heading look={look} eyebrow="Our Story" title={hidden(content, 'about_title') ? null : title} />
          {!hidden(content, 'about_text') && (
            <p className="text-lg leading-relaxed opacity-80 -mt-4 mb-10 whitespace-pre-line">{text}</p>
          )}
          <ul className="space-y-4">
            {points.map(point => (
              <li key={point} className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-[var(--ts-accent)] shrink-0" />
                <span className="font-medium opacity-90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className={`absolute -inset-3 md:-inset-4 border border-[var(--ts-accent)] opacity-40 ${radius} translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4`} />
          <img loading="lazy" src={image} alt={title} className={`relative w-full aspect-[4/5] md:aspect-[5/6] object-cover shadow-2xl ${radius}`} />
        </div>
      </div>
    </Shell>
  );
}

export function ThemeServices({ content, look, order }: SectionProps) {
  const radius = RADIUS[look.radius || 'md'];
  const services = content.services_json?.length ? content.services_json : DEFAULTS[look.kind].services;

  return (
    <Shell id="services" look={look} order={order} alt>
      <Heading look={look} eyebrow="What We Offer" title="Our Services" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv: any, i: number) => {
          const name = typeof srv === 'string' ? srv : srv.title || srv.name;
          return (
            <div key={i} className={`group relative overflow-hidden border border-current/10 hover:border-[var(--ts-accent)] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${radius}`} style={{ background: look.bg }}>
              {srv.image && <img loading="lazy" src={srv.image || undefined} alt={name} className="w-full h-48 object-cover" />}
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <span className={`${look.headingFont || ''} text-4xl font-light text-[var(--ts-accent)]`}>{String(i + 1).padStart(2, '0')}</span>
                  <ArrowUpRight size={20} className="opacity-30 group-hover:opacity-100 group-hover:text-[var(--ts-accent)] transition-all duration-500 group-hover:rotate-45" />
                </div>
                <h3 className={`${look.headingFont || ''} text-xl md:text-2xl mb-3 ${look.uppercase ? 'uppercase tracking-wide' : 'font-semibold'}`}>{name}</h3>
                {srv.description && <p className="opacity-70 leading-relaxed">{srv.description}</p>}
                {srv.price && <p className="mt-4 font-semibold text-[var(--ts-accent)]">{srv.price}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

export function ThemeGallery({ content, look, order }: SectionProps) {
  const radius = RADIUS[look.radius || 'md'];
  const own = (content.gallery_json || []).map((g: any) => (typeof g === 'string' ? g : g?.url || g?.image)).filter(Boolean);
  const images: string[] = own.length ? own : DEFAULTS[look.kind].gallery.map(img);

  return (
    <Shell id="gallery" look={look} order={order}>
      <Heading look={look} eyebrow="Take A Look" title="Gallery" />
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[220px] gap-3 md:gap-4">
        {images.map((src, i) => (
          <div key={i} className={`group overflow-hidden ${radius} ${i % 6 === 0 ? 'col-span-2 row-span-2' : ''}`} style={{ background: look.altBg }}>
            <img loading="lazy" src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function ThemeContact({ content, look, order, websiteId }: SectionProps & { websiteId: number | string }) {
  const radius = RADIUS[look.radius || 'md'];
  const info = content.contact_info || {};
  const address = typeof info.address === 'object' && info.address ? Object.values(info.address).filter(Boolean).join(', ') : info.address;
  const rows = [
    { field: 'contact_phone', icon: Phone, label: 'Call us', value: info.phone, href: info.phone && `tel:${String(info.phone).replace(/\s+/g, '')}` },
    { field: 'contact_email', icon: Mail, label: 'Email', value: info.email, href: info.email && `mailto:${info.email}` },
    { field: 'contact_address', icon: MapPin, label: 'Visit', value: address, href: address && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` },
  ].filter(r => r.value && !hidden(content, r.field));

  return (
    <Shell id="contact" look={look} order={order} alt>
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-2">
          <Heading look={look} eyebrow="Get In Touch" title="Let's talk" />
          <p className="opacity-70 leading-relaxed -mt-6 mb-10">Questions, orders or visits, we would love to hear from you. Reach out directly or leave a message and we will get back to you soon.</p>
          <div className="space-y-3">
            {rows.map(({ field, icon: Icon, label, value, href }) => (
              <a key={field} href={href} target={field === 'contact_address' ? '_blank' : undefined} rel="noreferrer" className={`flex items-center gap-4 p-4 border border-current/10 hover:border-[var(--ts-accent)] transition-colors ${radius}`} style={{ background: look.bg }}>
                <span className={`w-11 h-11 shrink-0 flex items-center justify-center bg-[var(--ts-accent)] text-[var(--ts-on-accent)] ${look.radius === 'none' ? '' : 'rounded-full'}`}>
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-[0.2em] opacity-60">{label}</span>
                  <span className="block font-semibold break-words">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className={`lg:col-span-3 p-6 md:p-10 border border-current/10 shadow-sm ${radius}`} style={{ background: look.bg }}>
          <ContactForm websiteId={websiteId} primaryColor="bg-[var(--ts-accent)] !text-[var(--ts-on-accent)]" primaryColorHover="hover:opacity-90" buttonShape={RADIUS[look.radius === 'xl' ? 'md' : look.radius || 'md']} />
        </div>
      </div>
    </Shell>
  );
}
