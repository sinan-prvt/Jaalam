/**
 * The website chatbot's answers. Everything comes from the site's own content
 * (contact details, services, menu, hours, socials...); when something isn't on
 * the site the bot says so and points to the real contact options, never made-up ones.
 */

export interface BotLink { label: string; href: string }
export interface BotReply { text: string; links?: BotLink[] }

interface Item { name: string; price: string; description: string }

export interface Knowledge {
  name: string;
  tagline: string;
  about: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  socials: BotLink[];
  services: Item[];
  products: Item[];
  stats: string[];
  upi: string;
  extraText: string[];
  photos: number;
  dateText: string;
}

/* ------------------------------------------------------------------ */
/* Knowledge from the site content                                     */
/* ------------------------------------------------------------------ */

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');
const digits = (s: string) => s.replace(/[^\d]/g, '');

const SOCIAL_SITES: [key: string, label: string, base: string][] = [
  ['instagram', 'Instagram', 'https://instagram.com/'],
  ['facebook', 'Facebook', 'https://facebook.com/'],
  ['youtube', 'YouTube', 'https://youtube.com/@'],
  ['twitter', 'X (Twitter)', 'https://x.com/'],
  ['linkedin', 'LinkedIn', 'https://linkedin.com/in/'],
];

const toUrl = (value: string, base: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w.-]+\.[a-z]{2,}\//i.test(value)) return `https://${value}`;
  return base + value.replace(/^@/, '');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildKnowledge(content: any): Knowledge {
  const c = content || {};
  const s = c.settings_json || {};
  const info = c.contact_info || {};
  const hiddenFields: string[] = s.hidden_elements || [];
  const hiddenSections: string[] = s.hidden_sections || [];
  const shown = (field: string) => !hiddenFields.includes(field);
  const section = (id: string) => !hiddenSections.includes(id);

  const phone = shown('contact_phone') ? str(info.phone) || str(s.cta_phone_number) : '';
  const whatsapp = shown('contact_whatsapp') ? str(s.cta_whatsapp_number) || str(info.whatsapp) || phone : '';

  const items = (list: unknown, nameKey: 'name' | 'title'): Item[] => (Array.isArray(list) ? list : [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((x: any) => (typeof x === 'string'
      ? { name: x, price: '', description: '' }
      : { name: str(x?.[nameKey] || x?.name || x?.title), price: str(x?.price), description: str(x?.description) }))
    .filter(x => x.name && !/^new (item|service)$/i.test(x.name));

  return {
    name: str(s.website_name) || str(c.hero_title),
    tagline: str(c.hero_description || c.hero_text || s.hero_description),
    about: section('about') ? str(s.about_description || c.about_text) : '',
    phone,
    whatsapp,
    email: shown('contact_email') ? str(info.email) : '',
    address: shown('contact_address') ? str(info.address) : '',
    hours: str(info.hours),
    socials: SOCIAL_SITES.filter(([key]) => str(info[key]) && shown(`contact_${key}`))
      .map(([key, label, base]) => ({ label, href: toUrl(str(info[key]), base) })),
    services: section('services') ? items(c.services_json, 'title') : [],
    products: section('menu') ? items(c.products_json, 'name') : [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stats: (Array.isArray(s.stats) ? s.stats : []).map((x: any) => [str(x?.value), str(x?.label)].filter(Boolean).join(' ')).filter(Boolean),
    upi: str(s.upi_id),
    extraText: section('custom')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (Array.isArray(c.custom_blocks_json) ? c.custom_blocks_json : []).filter((b: any) => b?.type === 'heading' || b?.type === 'paragraph').map((b: any) => str(b.content)).filter(Boolean)
      : [],
    photos: section('gallery') && Array.isArray(c.gallery_json) ? c.gallery_json.length : 0,
    dateText: str(c.date),
  };
}

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

const normalize = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'does', 'you', 'your', 'have', 'has', 'what', 'whats', 'can', 'i', 'me', 'my', 'we', 'of', 'for', 'to', 'in', 'on', 'and', 'or', 'any', 'there', 'please', 'tell', 'how', 'it', 'this', 'that', 'with', 'get', 'give', 'show', 'need', 'want', 'know', 'u', 'pls', 'plz']);
const words = (s: string) => normalize(s).split(' ').filter(w => w && !STOP.has(w));

/** True when two words match allowing one typo (for words of 4+ letters). */
function close(a: string, b: string) {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4 || Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** How strongly a question matches a list of keywords (phrases count double). */
function score(q: string, qWords: string[], keys: string[]) {
  let total = 0;
  for (const k of keys) {
    if (k.includes(' ')) { if (q.includes(k)) total += 2; continue; }
    if (qWords.some(w => close(w, k) || (k.length >= 5 && w.startsWith(k)))) total += 1;
  }
  return total;
}

/**
 * The menu items or services the question names. A short name must match half its
 * words; otherwise one distinctive word (5+ letters, e.g. "biriyani") is enough.
 * Returns every item with the best match, so "biriyani" finds all biriyanis.
 */
function findItems(qWords: string[], list: Item[]): Item[] {
  let best: Item[] = [], bestScore = 0;
  for (const item of list) {
    const nameWords = words(item.name);
    const matched = nameWords.filter(n => qWords.some(w => close(w, n)));
    const ok = matched.length > 0 && (matched.length / nameWords.length >= 0.5 || matched.some(m => m.length >= 5));
    if (!ok) continue;
    const s = matched.length / nameWords.length;
    if (s > bestScore) { best = [item]; bestScore = s; } else if (s === bestScore) best.push(item);
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Answers                                                             */
/* ------------------------------------------------------------------ */

const callLink = (k: Knowledge): BotLink[] => (k.phone ? [{ label: 'Call', href: `tel:${k.phone.replace(/[^\d+]/g, '')}` }] : []);
const waLink = (k: Knowledge): BotLink[] => (k.whatsapp && digits(k.whatsapp).length >= 8 ? [{ label: 'WhatsApp', href: `https://wa.me/${digits(k.whatsapp)}` }] : []);
const mailLink = (k: Knowledge): BotLink[] => (k.email ? [{ label: 'Email', href: `mailto:${k.email}` }] : []);
const mapLink = (k: Knowledge): BotLink[] => (k.address ? [{ label: 'Open in Maps', href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(k.address)}` }] : []);
const contactLinks = (k: Knowledge) => [...callLink(k), ...waLink(k), ...mailLink(k)];

const bullets = (lines: string[], max = 8) => {
  const shown = lines.slice(0, max).map(l => `• ${l}`);
  if (lines.length > max) shown.push(`…and ${lines.length - max} more on the website.`);
  return shown.join('\n');
};
const itemLine = (i: Item) => (i.price ? `${i.name} – ${i.price}` : i.name);

/** When the site doesn't list something: say so plainly and offer the real ways to ask. */
function notListed(k: Knowledge, what: string): BotReply {
  const links = contactLinks(k);
  return {
    text: links.length
      ? `${k.name || 'This business'} hasn't added ${what} to the website yet. You can ask them directly:`
      : `${k.name || 'This business'} hasn't added ${what} to the website yet.`,
    links,
  };
}

interface Intent {
  id: string;
  keys: string[];
  answer: (k: Knowledge, q: string) => BotReply;
}

const NETWORKS: [label: string, re: RegExp][] = [
  ['Instagram', /\binst[a-z]*/], ['Facebook', /\b(facebook|fb)\b/], ['YouTube', /\byou ?tube\b/], ['X (Twitter)', /\b(twitter|x)\b/], ['LinkedIn', /\blinked ?in\b/],
];

/** Social answer: the network asked about if listed, an honest "not listed" if not. */
function socialAnswer(k: Knowledge, q: string): BotReply {
  if (!k.socials.length) return notListed(k, 'social media pages');
  const asked = NETWORKS.filter(([, re]) => re.test(q)).map(([label]) => label);
  const found = k.socials.filter(s => asked.includes(s.label));
  const missing = asked.filter(label => !k.socials.some(s => s.label === label));
  if (found.length && !missing.length) return { text: found.map(s => `Here's ${k.name ? `${k.name}'s` : 'the'} ${s.label} page 👇`).join('\n'), links: found };
  if (missing.length) {
    return {
      text: `${k.name || 'This business'} hasn't listed a ${missing.join(' or ')} page on the website. You can follow them on ${k.socials.map(s => s.label).join(' and ')}:`,
      links: k.socials,
    };
  }
  return { text: `Follow ${k.name || 'us'} on social media:\n${k.socials.map(s => `• ${s.label}`).join('\n')}`, links: k.socials };
}

const INTENTS: Intent[] = [
  {
    id: 'hours',
    keys: ['hour', 'hours', 'open', 'opening', 'close', 'closing', 'timing', 'timings', 'time', 'working', 'sunday', 'monday', 'today', 'holiday', 'when'],
    answer: k => (k.hours ? { text: `🕒 Opening hours: ${k.hours}`, links: callLink(k) } : notListed(k, 'opening hours')),
  },
  {
    id: 'location',
    keys: ['where', 'location', 'locate', 'located', 'address', 'direction', 'directions', 'map', 'maps', 'reach', 'place', 'route', 'near', 'shop', 'store', 'branch', 'visit'],
    answer: k => (k.address ? { text: `📍 You'll find ${k.name || 'us'} at:\n${k.address}`, links: mapLink(k) } : notListed(k, 'an address')),
  },
  {
    id: 'whatsapp',
    keys: ['whatsapp', 'whats app', 'watsapp', 'wa'],
    answer: k => (waLink(k).length ? { text: `💬 Chat on WhatsApp: ${k.whatsapp}`, links: waLink(k) } : notListed(k, 'a WhatsApp number')),
  },
  {
    id: 'email',
    keys: ['email', 'mail', 'gmail', 'e mail'],
    answer: k => (k.email ? { text: `✉️ Email: ${k.email}`, links: mailLink(k) } : notListed(k, 'an email address')),
  },
  {
    id: 'phone',
    keys: ['phone', 'call', 'number', 'mobile', 'contact', 'reach you', 'talk', 'speak', 'ring'],
    answer: k => {
      const lines = [k.phone && `📞 Phone: ${k.phone}`, k.whatsapp && k.whatsapp !== k.phone && `💬 WhatsApp: ${k.whatsapp}`, k.email && `✉️ Email: ${k.email}`].filter(Boolean) as string[];
      return lines.length ? { text: `Here's how to reach ${k.name || 'us'}:\n${lines.join('\n')}`, links: contactLinks(k) } : notListed(k, 'contact details');
    },
  },
  {
    id: 'social',
    keys: ['instagram', 'insta', 'facebook', 'fb', 'youtube', 'twitter', 'linkedin', 'social', 'follow', 'page', 'handle', 'profile', 'reels'],
    answer: socialAnswer,
  },
  {
    id: 'services',
    keys: ['service', 'services', 'offer', 'offering', 'provide', 'specialize', 'speciality', 'specialty', 'what do', 'treatment', 'package', 'packages'],
    answer: k => (k.services.length
      ? { text: `Here's what ${k.name || 'we'} offer${k.name ? 's' : ''}:\n${bullets(k.services.map(itemLine))}\n\nAsk me about any of them for details.` }
      : k.products.length ? INTENTS.find(i => i.id === 'menu')!.answer(k, '') : notListed(k, 'a list of services')),
  },
  {
    id: 'menu',
    keys: ['menu', 'product', 'products', 'item', 'items', 'price', 'prices', 'pricing', 'cost', 'rate', 'rates', 'charge', 'charges', 'fee', 'food', 'dish', 'dishes', 'sell', 'catalog', 'how much', 'collection'],
    answer: k => (k.products.length
      ? { text: `Here's the list with prices:\n${bullets(k.products.map(itemLine), 10)}` }
      : k.services.some(s => s.price) ? { text: `Prices:\n${bullets(k.services.filter(s => s.price).map(itemLine))}` } : notListed(k, 'prices')),
  },
  {
    id: 'payment',
    keys: ['pay', 'payment', 'payments', 'upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'card', 'cash', 'online payment'],
    answer: k => (k.upi
      ? { text: `💳 You can pay by UPI (GPay, PhonePe, Paytm…) to: ${k.upi}\nTap the "Make a Payment" button on the website to scan the QR code.` }
      : notListed(k, 'payment details')),
  },
  {
    id: 'booking',
    keys: ['book', 'booking', 'appointment', 'reserve', 'reservation', 'order', 'enquiry', 'inquiry', 'table', 'slot', 'schedule', 'register', 'admission', 'quote'],
    answer: k => {
      const links = [...waLink(k), ...callLink(k), ...mailLink(k)];
      return links.length
        ? { text: `To book or order with ${k.name || 'us'}, message or call directly — they'll confirm the details.${k.hours ? `\n🕒 ${k.hours}` : ''}`, links }
        : { text: `Use the contact form on this page to send your request — ${k.name || 'the business'} will get back to you.` };
    },
  },
  {
    id: 'about',
    keys: ['about', 'story', 'who', 'history', 'company', 'business', 'founded', 'since', 'background', 'owner'],
    answer: k => {
      const text = [k.tagline, k.about].filter(Boolean).join('\n\n');
      return text ? { text: `${k.name ? `About ${k.name}:\n` : ''}${text}` } : notListed(k, 'an about section');
    },
  },
  {
    id: 'stats',
    keys: ['experience', 'years', 'customers', 'clients', 'rating', 'ratings', 'reviews', 'review', 'trusted', 'achievements', 'awards'],
    answer: k => (k.stats.length ? { text: `A few highlights:\n${bullets(k.stats)}` } : notListed(k, 'ratings or highlights')),
  },
  {
    id: 'gallery',
    keys: ['photo', 'photos', 'picture', 'pictures', 'image', 'images', 'gallery', 'pics', 'video'],
    answer: k => (k.photos ? { text: `📸 There ${k.photos === 1 ? 'is 1 photo' : `are ${k.photos} photos`} in the Gallery section — scroll down the page to see ${k.photos === 1 ? 'it' : 'them'}.` } : notListed(k, 'photos')),
  },
  {
    id: 'delivery',
    keys: ['delivery', 'deliver', 'home delivery', 'shipping', 'ship', 'courier', 'takeaway', 'parcel', 'cod'],
    answer: k => {
      const found = [k.about, k.tagline, ...k.extraText, ...k.services.map(s => `${s.name} ${s.description}`)].find(t => /deliver|shipping|takeaway|parcel/i.test(t));
      return found ? { text: found, links: contactLinks(k) } : notListed(k, 'delivery details');
    },
  },
];

const GREETING = /^(hi+|hello|hey|hai|hlo|helo|namaste|namaskaram|good (morning|afternoon|evening)|yo)\b/;
const THANKS = /\b(thanks?|thank you|thx|tnx|great|awesome|nice|cool|ok(ay)?)\b/;

export function welcome(k: Knowledge): BotReply {
  return { text: `Hi! 👋 I'm the assistant for ${k.name || 'this website'}. Ask me anything about it — or tap a question below.` };
}

export function answer(question: string, k: Knowledge): BotReply {
  const q = normalize(question);
  const qWords = words(question);
  if (!q) return welcome(k);

  // A named menu item or service gets its own details
  const products = findItems(qWords, k.products);
  const named = products.length ? products : findItems(qWords, k.services);

  const ranked = INTENTS.map(i => ({ i, s: score(q, qWords, i.keys) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s);

  if (named.length && (!ranked.length || ranked[0].i.id === 'menu' || ranked[0].i.id === 'services')) {
    if (named.length > 1) return { text: `Here's what matches:\n${bullets(named.map(itemLine))}` };
    const item = named[0];
    const lines = [item.price && `💰 Price: ${item.price}`, item.description].filter(Boolean);
    return { text: `${item.name}${lines.length ? `\n${lines.join('\n')}` : ''}`, links: [...waLink(k), ...callLink(k)].slice(0, 1) };
  }

  if (ranked.length) {
    // Several topics in one question ("phone and address"): answer the top two
    const top = ranked.filter(x => x.s === ranked[0].s).slice(0, 2);
    if (top.length === 2) {
      const [a, b] = top.map(x => x.i.answer(k, q));
      return { text: `${a.text}\n\n${b.text}`, links: [...(a.links || []), ...(b.links || [])].slice(0, 4) };
    }
    return ranked[0].i.answer(k, q);
  }

  if (GREETING.test(q)) return { text: `Hello! 👋 How can I help you with ${k.name || 'this website'} today?` };
  if (THANKS.test(q)) return { text: `You're welcome! 😊 Anything else you'd like to know?` };

  // Anything else: look for it in the site's own text
  const corpus = [...k.services.map(s => `${s.name}: ${s.description}`), ...k.products.map(p => `${p.name}${p.price ? ` (${p.price})` : ''}: ${p.description}`), k.about, k.tagline, ...k.extraText].filter(Boolean);
  let best = '', bestHits = 0;
  for (const text of corpus) {
    const tw = words(text);
    const hits = qWords.filter(w => w.length > 2 && tw.some(t => close(w, t))).length;
    if (hits > bestHits) { best = text; bestHits = hits; }
  }
  if (best && bestHits >= Math.min(2, qWords.length)) return { text: `Here's what the website says:\n${best}` };

  const links = contactLinks(k);
  return {
    text: `I couldn't find that on this website.${links.length ? ` ${k.name || 'The business'} can answer it directly:` : ''}`,
    links,
  };
}

/** Suggested questions, built only from what this site actually has. */
export function suggestions(k: Knowledge, asked: Set<string>, lastIntent?: string): string[] {
  const all: [id: string, question: string, available: boolean][] = [
    ['services', 'What services do you offer?', k.services.length > 0],
    ['menu', k.products.length ? 'Show me the menu & prices' : 'What are your prices?', k.products.length > 0 || k.services.some(s => s.price)],
    ['hours', 'What are your opening hours?', !!k.hours],
    ['location', 'Where are you located?', !!k.address],
    ['phone', 'How can I contact you?', !!(k.phone || k.email || k.whatsapp)],
    ['booking', 'How do I book or order?', !!(k.phone || k.whatsapp || k.email)],
    ['social', k.socials.length === 1 ? `Do you have ${k.socials[0].label}?` : 'Are you on Instagram or Facebook?', k.socials.length > 0],
    ['payment', 'Can I pay by UPI?', !!k.upi],
    ['about', `Tell me about ${k.name || 'the business'}`, !!(k.about || k.tagline)],
    ['stats', 'How experienced are you?', k.stats.length > 0],
    ['gallery', 'Can I see photos?', k.photos > 0],
  ];
  const products = k.products.slice(0, 2).map(p => [`item:${p.name}`, `How much is ${p.name}?`, true] as [string, string, boolean]);
  return [...all, ...products]
    .filter(([id, question, ok]) => ok && id !== lastIntent && !asked.has(question))
    .slice(0, 4)
    .map(([, question]) => question);
}

/** Which topic a question was about (so suggestions don't repeat it). */
export function intentOf(question: string): string | undefined {
  const q = normalize(question);
  const qWords = words(question);
  return INTENTS.map(i => ({ id: i.id, s: score(q, qWords, i.keys) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s)[0]?.id;
}
