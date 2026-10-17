// Normalizes the different invitation content schemas (wedding, birthday,
// housewarming, college fest, religious) into one shape the modern themes render.

export type InviteFamily = 'wedding' | 'birthday' | 'housewarming' | 'collegeFest' | 'religious';

export interface InvitePerson {
  name: string;
  role?: string;
  photo?: string;
}

export interface InviteScheduleItem {
  time?: string;
  title: string;
  description?: string;
  date?: string;
  venue?: string;
}

export interface InviteCard {
  title: string;
  description?: string;
  meta?: string;
}

// Fields of the hero/about area that can be edited inline in the editor preview.
export type EditableField = 'title' | 'subtitle' | 'quote' | 'aboutTitle' | 'aboutText';

export interface InviteData {
  family: InviteFamily;
  title: string;
  titleParts: string[];
  subtitle: string;
  quote: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  people: InvitePerson[];
  peopleTitle: string;
  dateText: string;
  dateParts: { day: string; month: string; year: string; weekday: string };
  timeText: string;
  countdownTarget: number | null;
  venueName: string;
  address: string;
  mapUrl: string;
  venuePhoto: string;
  schedule: InviteScheduleItem[];
  scheduleTitle: string;
  cards: InviteCard[];
  cardsTitle: string;
  tags: string[];
  tagsTitle: string;
  gallery: string[];
  phone: string;
  whatsapp: string;
  email: string;
  contactText: string;
  musicUrl: string;
  slug?: string;
  wishCount: number;
  hidden: (section: string) => boolean;
  hiddenFields: string[];
  // Content paths each inline-editable field is saved to (a field may write several paths).
  editPaths: Partial<Record<EditableField, string[][]>>;
}

const clean = (list: unknown): string[] =>
  Array.isArray(list)
    ? list
        .map((g: any) => (typeof g === 'string' ? g : g?.url || g?.image || ''))
        .filter((u: string) => typeof u === 'string' && u.trim() !== '')
    : [];

const parseDate = (raw?: string) => {
  const d = raw ? new Date(raw) : new Date(NaN);
  const valid = !isNaN(d.getTime());
  return {
    valid,
    date: d,
    day: valid ? String(d.getDate()).padStart(2, '0') : '',
    month: valid ? d.toLocaleString('en-US', { month: 'long' }) : '',
    year: valid ? String(d.getFullYear()) : '',
    weekday: valid ? d.toLocaleString('en-US', { weekday: 'long' }) : '',
  };
};

const toTarget = (...candidates: (string | undefined)[]) => {
  for (const c of candidates) {
    if (!c) continue;
    const t = new Date(c).getTime();
    if (!isNaN(t)) return t;
  }
  return null;
};

const sectionVisibility = (sections: any, aliases: Record<string, string[]>) => {
  const list: any[] = Array.isArray(sections) ? sections : [];
  return (section: string) => {
    const ids = aliases[section] || [section];
    const matches = list.filter((s) => ids.includes(s?.id));
    return matches.length > 0 && matches.every((s) => s.visible === false);
  };
};

const splitNames = (raw: string) =>
  raw
    .split(/\s*&\s*|\s+and\s+|\s+weds\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);

const dateTextFrom = (raw: string | undefined, p: ReturnType<typeof parseDate>, explicit?: { day?: string; month?: string; year?: string; weekday?: string }) => {
  const day = explicit?.day || p.day;
  const month = explicit?.month || p.month;
  const year = explicit?.year || p.year;
  const weekday = explicit?.weekday || p.weekday;
  const text = day && month ? `${weekday ? weekday + ', ' : ''}${month} ${Number(day) || day}${year ? ', ' + year : ''}` : raw || '';
  return { text, parts: { day, month, year, weekday } };
};

function weddingAdapter(content: any, category: string): Partial<InviteData> {
  const w = content?.settings_json?.wedding || {};
  const isEngagement = /engagement/i.test(category);
  const title = content?.hero_title || (isEngagement ? 'Aarav & Meera' : 'Arjun & Diya');
  const rawDate = w.date || content?.date;
  const p = parseDate(rawDate);
  const date = dateTextFrom(rawDate, p, { day: w.dateDay, month: w.dateMonth, year: w.dateYear, weekday: w.dateWeekday });
  const names = splitNames(title);
  const people: InvitePerson[] = [];
  if (w.groomPhoto || w.groomParents || names[0]) people.push({ name: names[0] || 'Groom', role: w.groomParents ? `Son of ${w.groomParents}` : undefined, photo: w.groomPhoto });
  if (w.bridePhoto || w.brideParents || names[1]) people.push({ name: names[1] || 'Bride', role: w.brideParents ? `Daughter of ${w.brideParents}` : undefined, photo: w.bridePhoto });
  const venue = w.venue || content?.venue?.name || '';
  return {
    title,
    titleParts: names.length > 1 ? names : [title],
    subtitle: content?.hero_subtitle || (isEngagement ? 'Are Getting Engaged' : 'Are Getting Married'),
    quote: content?.quote || w.quote || content?.tagline || 'Two souls, one heart — join us as we begin our forever.',
    heroImage: content?.hero?.image || w.mainPhoto || '',
    aboutTitle: content?.about_title || w.story_title || 'Our Story',
    aboutText: content?.about_text || 'What began as a chance meeting became a lifetime promise. We would be honoured to have you with us as we celebrate the beginning of our new journey together.',
    people,
    peopleTitle: isEngagement ? 'The Couple' : 'The Bride & Groom',
    dateText: date.text,
    dateParts: date.parts,
    timeText: w.time || content?.time || '',
    countdownTarget: toTarget(w.countdownDate, rawDate),
    venueName: venue,
    address: content?.contact_info?.address || content?.venue?.address || venue,
    mapUrl: w.mapUrl || content?.venue?.mapUrl || '',
    venuePhoto: w.venuePhoto || content?.venue?.image || '',
    schedule: (Array.isArray(w.schedule) ? w.schedule : []).map((s: any) => ({ time: s.time, title: s.event || s.title || s.name || 'Ceremony', date: s.date, venue: s.venue, description: s.description })),
    scheduleTitle: 'Wedding Events',
    gallery: clean(w.gallery),
    contactText: w.contactNumbers || '',
    musicUrl: w.musicUrl || '',
    wishCount: Number(w.wish_count) || 48,
    hidden: sectionVisibility(w.sections, { people: ['about'], about: ['story'], wishes: ['wishes'] }),
    editPaths: { title: [['hero_title']], subtitle: [['hero_subtitle']], quote: [['quote']], aboutTitle: [['about_title']], aboutText: [['about_text']] },
  };
}

function birthdayAdapter(content: any, category: string): Partial<InviteData> {
  const b = content?.settings_json?.birthday || {};
  const name = content?.hero_title || b.name || (category === '1st Birthday' ? 'Little Aanya' : 'Riya');
  const age = b.age ? String(b.age) : category === '1st Birthday' ? '1' : category === 'Sweet 16 Birthday' ? '16' : '';
  const rawDate = b.date || content?.date;
  const p = parseDate(rawDate);
  const date = dateTextFrom(rawDate, p, { day: b.dateDay, month: b.dateMonth, year: b.dateYear, weekday: b.dateWeekday });
  const people: InvitePerson[] = [];
  if (b.parentsName || b.parentsPhoto) people.push({ name: b.parentsName || 'The Family', role: 'Hosted by', photo: b.parentsPhoto });
  const venue = b.venue || content?.venue?.name || '';
  const ordinal = (n: string) => {
    const num = Number(n);
    if (!num) return n;
    const s = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  return {
    title: name,
    titleParts: [name],
    subtitle: content?.hero_subtitle || (age ? `Turns ${age}` : "You're Invited"),
    quote: content?.quote || content?.tagline || b.quote || (age ? `Join us to celebrate the ${ordinal(age)} birthday!` : 'Join us for an unforgettable celebration!'),
    heroImage: b.mainPhoto || content?.hero?.image || '',
    aboutTitle: content?.about_title || b.story_title || 'About The Party',
    aboutText: content?.about_text || 'Cake, laughter, music and the people we love most. Come celebrate with us and make this birthday one to remember.',
    people,
    peopleTitle: 'Hosted By',
    dateText: date.text,
    dateParts: date.parts,
    timeText: b.time || content?.time || '',
    countdownTarget: toTarget(b.countdownDate, rawDate),
    venueName: venue,
    address: content?.contact_info?.address || content?.venue?.address || venue,
    mapUrl: b.mapUrl || content?.venue?.mapUrl || '',
    venuePhoto: b.venuePhoto || content?.venue?.image || '',
    schedule: (Array.isArray(b.schedule) ? b.schedule : []).map((s: any) => ({ time: s.time, title: s.event || s.title || 'Celebration', date: s.date, venue: s.venue })),
    scheduleTitle: 'Party Timeline',
    tags: age ? [ordinal(age) + ' Birthday'] : [],
    gallery: clean(b.gallery),
    contactText: b.contactNumbers || '',
    musicUrl: b.musicUrl || content?.music_url || '',
    wishCount: Number(b.wish_count) || 50,
    hidden: sectionVisibility(b.sections, { people: ['about'], about: ['story'] }),
    editPaths: { title: [['hero_title']], subtitle: [['hero_subtitle']], quote: [['quote']], aboutTitle: [['about_title']], aboutText: [['about_text']] },
  };
}

function housewarmingAdapter(content: any): Partial<InviteData> {
  const h = content?.settings_json?.housewarming || {};
  const host = h.hostName || content?.hero_title || 'The Sharma Family';
  const rawDate = content?.date || h.date;
  const p = parseDate(rawDate);
  const date = dateTextFrom(rawDate, p);
  const venue = h.venue || '';
  return {
    title: host,
    titleParts: [host],
    subtitle: 'Invite You To Our Housewarming',
    quote: h.tagline || content?.tagline || 'A new home, new beginnings — come bless our home with your presence.',
    heroImage: h.venuePhoto || h.hostPhoto || '',
    aboutTitle: content?.about_title || 'Welcome Home',
    aboutText: content?.about_text || 'With joy in our hearts we have moved into our new home. Please join us for the Griha Pravesh ceremony, blessings, and a warm meal together.',
    people: h.hostName || h.hostPhoto ? [{ name: host, role: 'Your Hosts', photo: h.hostPhoto }] : [],
    peopleTitle: 'Your Hosts',
    dateText: date.text,
    dateParts: date.parts,
    timeText: h.time || '',
    countdownTarget: toTarget(rawDate),
    venueName: venue,
    address: content?.contact_info?.address || venue,
    mapUrl: h.mapUrl || '',
    venuePhoto: h.venuePhoto || '',
    schedule: (Array.isArray(h.schedule) ? h.schedule : []).map((s: any) => ({ time: s.time, title: s.event || s.title || 'Ceremony', date: s.date })),
    scheduleTitle: 'Ceremony Schedule',
    gallery: clean(h.gallery),
    contactText: h.contactNumbers || '',
    musicUrl: h.musicUrl || '',
    wishCount: Number(h.wish_count) || 24,
    hidden: sectionVisibility(h.sections, { people: ['hosts'], about: ['story'] }),
    editPaths: {
      title: [['hero_title'], ['settings_json', 'housewarming', 'hostName']],
      quote: [['settings_json', 'housewarming', 'tagline']],
      aboutTitle: [['about_title']],
      aboutText: [['about_text']],
    },
  };
}

function collegeFestAdapter(content: any, category: string): Partial<InviteData> {
  const s = content?.settings_json || {};
  const title = content?.hero_title || s.website_name || (category === 'Sports Meet' ? 'Velocity 2026' : category === 'Cultural Fest' ? 'Utsav 2026' : 'Techtonic 2026');
  const rawDate = content?.date;
  const p = parseDate(rawDate);
  const date = dateTextFrom(rawDate, p);
  const services = Array.isArray(content?.services_json) ? content.services_json : [];
  return {
    title,
    titleParts: [title],
    subtitle: content?.hero_subtitle || category,
    quote: content?.hero_description || content?.hero_text || 'Compete. Create. Celebrate. The biggest campus event of the year is here.',
    heroImage: content?.hero_bg || content?.hero?.image || '',
    aboutTitle: s.about_title || content?.about_title || 'About The Fest',
    aboutText: s.about_description || content?.about_text || 'Three days of competitions, workshops, performances and pure campus energy. Bring your team, bring your best.',
    people: [],
    dateText: date.text,
    dateParts: date.parts,
    timeText: '',
    countdownTarget: toTarget(rawDate),
    venueName: '',
    address: content?.contact_info?.address || '',
    cards: services.map((sv: any) =>
      typeof sv === 'string'
        ? { title: sv }
        : { title: sv.title || sv.name || 'Event', description: sv.description, meta: sv.price ? String(sv.price) : sv.date || undefined },
    ),
    cardsTitle: 'Events & Competitions',
    tags: typeof s.sponsors === 'string' ? s.sponsors.split(',').map((x: string) => x.trim()).filter(Boolean) : [],
    tagsTitle: 'Our Sponsors',
    gallery: clean(content?.gallery_json),
    phone: content?.contact_info?.phone || '',
    whatsapp: content?.contact_info?.whatsapp || '',
    email: content?.contact_info?.email || '',
    musicUrl: s.music_url || '',
    wishCount: 120,
    hidden: (section: string) => {
      const map: Record<string, string> = { about: 'about', cards: 'services', gallery: 'gallery', tags: 'sponsors', contact: 'contact' };
      return Array.isArray(s.hidden_sections) && s.hidden_sections.includes(map[section] || section);
    },
    editPaths: {
      title: [['hero_title']],
      subtitle: [['hero_subtitle']],
      quote: [['hero_description']],
      aboutTitle: [['settings_json', 'about_title']],
      aboutText: [['settings_json', 'about_description']],
    },
  };
}

function religiousAdapter(content: any, category: string): Partial<InviteData> {
  const r = content?.settings_json?.religious_event || {};
  const fallbackTitle = category === 'Mosque Event' ? 'Masjid Al-Noor' : category === 'Church Event' ? "St. Mary's Church" : 'Sri Ganesha Temple';
  const leaders = Array.isArray(r.leaders) ? r.leaders : [];
  return {
    title: r.organization_name || content?.hero_title || fallbackTitle,
    titleParts: [r.organization_name || content?.hero_title || fallbackTitle],
    subtitle: r.subtitle || category,
    quote: r.tagline || 'A place of faith, peace and community for all.',
    heroImage: r.cover_image || '',
    aboutTitle: r.about_title || 'About Us',
    aboutText: [r.about_description || 'We are a community dedicated to faith, service and fellowship. All are welcome to join our prayers, celebrations and programs.', r.vision_mission].filter(Boolean).join('\n\n'),
    people: leaders.map((l: any) => ({ name: l.name || 'Leader', role: [l.title, l.role].filter(Boolean).join(' · '), photo: l.photo })),
    peopleTitle: 'Our Leaders',
    dateText: '',
    dateParts: { day: '', month: '', year: '', weekday: '' },
    timeText: '',
    countdownTarget: null,
    venueName: '',
    address: content?.contact_info?.address || '',
    schedule: (Array.isArray(r.schedule) ? r.schedule : []).map((s: any) => ({ time: s.time, title: s.name || 'Service', description: s.description })),
    scheduleTitle: 'Schedule & Prayers',
    cards: (Array.isArray(r.programs) ? r.programs : []).map((pg: any) => ({ title: pg.name || 'Program', description: pg.description, meta: pg.timing })),
    cardsTitle: 'Programs & Services',
    gallery: clean(r.gallery),
    contactText: r.contactNumbers || '',
    phone: content?.contact_info?.phone || '',
    whatsapp: content?.contact_info?.whatsapp || '',
    wishCount: 33,
    hidden: sectionVisibility(r.sections, { cards: ['programs', 'donations'], people: ['leaders'], venue: ['contact'] }),
    editPaths: {
      title: [['settings_json', 'religious_event', 'organization_name']],
      subtitle: [['settings_json', 'religious_event', 'subtitle']],
      quote: [['settings_json', 'religious_event', 'tagline']],
      aboutTitle: [['settings_json', 'religious_event', 'about_title']],
      // The about text also shows vision & mission, so only edit it inline when that is empty.
      ...(r.vision_mission ? {} : { aboutText: [['settings_json', 'religious_event', 'about_description']] }),
    },
  };
}

export function buildInviteData(family: InviteFamily, content: any, website: any): InviteData {
  const category = website?.business_type || '';
  const partial =
    family === 'wedding'
      ? weddingAdapter(content, category)
      : family === 'birthday'
        ? birthdayAdapter(content, category)
        : family === 'housewarming'
          ? housewarmingAdapter(content)
          : family === 'collegeFest'
            ? collegeFestAdapter(content, category)
            : religiousAdapter(content, category);

  const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];

  return {
    family,
    title: '',
    titleParts: [],
    subtitle: '',
    quote: '',
    heroImage: '',
    aboutTitle: '',
    aboutText: '',
    people: [],
    peopleTitle: '',
    dateText: '',
    dateParts: { day: '', month: '', year: '', weekday: '' },
    timeText: '',
    countdownTarget: null,
    venueName: '',
    address: '',
    mapUrl: '',
    venuePhoto: '',
    schedule: [],
    scheduleTitle: 'Schedule',
    cards: [],
    cardsTitle: '',
    tags: [],
    tagsTitle: '',
    gallery: [],
    phone: content?.contact_info?.phone || '',
    whatsapp: content?.contact_info?.whatsapp || '',
    email: content?.contact_info?.email || '',
    contactText: '',
    musicUrl: '',
    wishCount: 0,
    hidden: () => false,
    editPaths: {},
    ...partial,
    hiddenFields,
    slug: website?.slug,
  } as InviteData;
}

// Returns a copy of `content` with `value` written at every given path.
export function applyEdit(content: any, paths: string[][], value: string) {
  const next = structuredClone(content || {});
  for (const path of paths) {
    let node = next;
    path.slice(0, -1).forEach((key) => {
      if (typeof node[key] !== 'object' || node[key] === null) node[key] = {};
      node = node[key];
    });
    node[path[path.length - 1]] = value;
  }
  return next;
}
