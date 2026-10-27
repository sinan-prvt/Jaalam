// Invitation themes. Every theme is a page style (engine), an opening animation and
// title fonts. Each category offers two signature themes of its own plus three of its
// event family's five, so no two categories share the same set; the category also
// adds its motif (kolam, kasavu, arabesque...) and greeting.
import type { InviteFamily } from './adapters';
import type { InvitationStyle } from './palettes';

export type OpeningKind =
  | 'envelope' | 'doors' | 'petals' | 'letter' | 'sunrise'
  | 'gift' | 'balloons' | 'confetti' | 'neon' | 'stars'
  | 'key' | 'blueprint' | 'lights' | 'leaves'
  | 'glitch' | 'ticket' | 'curtain' | 'countdown' | 'poster'
  | 'lamp' | 'arch' | 'scroll' | 'rays'
  | 'ringbox' | 'bells' | 'cake' | 'rocket' | 'trophy';

/** Opening variants: decorations or particle shapes for an opening kind. */
export type OpeningVariant = 'lanterns' | 'marigold' | 'gopuram' | 'roses' | 'hearts' | 'gold' | 'paint' | 'stained';

export interface InviteThemeDef {
  name: string;
  engine: InvitationStyle;
  opening: OpeningKind;
  variant?: OpeningVariant;
  /** Title font: `raw` for the opening screen, `page` (h1/h2 overrides) for the invitation page. */
  font: Font;
}

interface Font { raw: string; page: string }

// Written out in full so Tailwind generates every class.
// Great Vibes has very narrow spaces, so "A & B" would run together as "A&B": widen them
const SCRIPT: Font = {
  raw: "font-['Great_Vibes'] font-normal! normal-case! [word-spacing:0.3em]",
  page: "[&_h1]:font-['Great_Vibes'] [&_h1]:font-normal! [&_h1]:normal-case! [&_h1]:[word-spacing:0.3em]",
};
const SERIF: Font = {
  raw: "font-['Playfair_Display']",
  page: "[&_h1]:font-['Playfair_Display']",
};
const CINZEL: Font = {
  raw: "font-['Cinzel'] tracking-wide",
  page: "[&_h1]:font-['Cinzel'] [&_h1]:tracking-wide [&_h2]:font-['Cinzel']",
};
const PLAYFUL: Font = {
  raw: "font-['Baloo_2'] font-extrabold!",
  page: "[&_h1]:font-['Baloo_2'] [&_h1]:font-extrabold! [&_h2]:font-['Baloo_2'] [&_h2]:font-extrabold!",
};
const DISPLAY: Font = {
  raw: "font-['Outfit'] font-black! tracking-tight uppercase",
  page: "[&_h1]:font-['Outfit'] [&_h1]:font-black! [&_h1]:uppercase [&_h1]:tracking-tight",
};
const PARTY: Font = {
  raw: "font-['Outfit'] font-black!",
  page: "[&_h1]:font-['Outfit'] [&_h1]:font-black! [&_h2]:font-['Outfit'] [&_h2]:font-bold!",
};
const TECH: Font = {
  raw: "font-['Orbitron'] font-bold! uppercase tracking-wider",
  page: "[&_h1]:font-['Orbitron'] [&_h1]:font-bold! [&_h1]:uppercase [&_h2]:font-['Orbitron'] [&_h2]:font-bold!",
};

export const FAMILY_THEMES: Record<InviteFamily, InviteThemeDef[]> = {
  wedding: [
    { name: 'Royal Envelope', engine: 'Midnight Luxe', opening: 'envelope', font: CINZEL },
    { name: 'Grand Doors', engine: 'Heritage', opening: 'doors', font: SERIF },
    { name: 'Petal Shower', engine: 'Glassmorphism', opening: 'petals', font: SCRIPT },
    { name: 'Love Letter', engine: 'Editorial', opening: 'letter', font: SCRIPT },
    { name: 'Golden Sunrise', engine: 'Aurora Gradient', opening: 'sunrise', font: SERIF },
  ],
  birthday: [
    { name: 'Gift Box Surprise', engine: 'Aurora Gradient', opening: 'gift', font: PLAYFUL },
    { name: 'Balloon Pop', engine: 'Bento Grid', opening: 'balloons', font: PLAYFUL },
    { name: 'Confetti Blast', engine: 'Glassmorphism', opening: 'confetti', font: DISPLAY },
    { name: 'Neon Party', engine: 'Midnight Luxe', opening: 'neon', font: PARTY },
    { name: 'Starry Wish', engine: 'Editorial', opening: 'stars', font: SCRIPT },
  ],
  housewarming: [
    { name: 'Key To Home', engine: 'Heritage', opening: 'key', font: SERIF },
    { name: 'Blueprint', engine: 'Bento Grid', opening: 'blueprint', font: DISPLAY },
    { name: 'Warm Lights', engine: 'Midnight Luxe', opening: 'lights', font: SCRIPT },
    { name: 'Garden Leaves', engine: 'Glassmorphism', opening: 'leaves', font: SERIF },
    { name: 'Welcome Doors', engine: 'Aurora Gradient', opening: 'doors', font: PLAYFUL },
  ],
  collegeFest: [
    { name: 'Neon Glitch', engine: 'Midnight Luxe', opening: 'glitch', font: TECH },
    { name: 'Event Pass', engine: 'Bento Grid', opening: 'ticket', font: DISPLAY },
    { name: 'Stage Curtain', engine: 'Aurora Gradient', opening: 'curtain', font: DISPLAY },
    { name: 'Kickoff Countdown', engine: 'Glassmorphism', opening: 'countdown', font: TECH },
    { name: 'Poster Wall', engine: 'Editorial', opening: 'poster', font: DISPLAY },
  ],
  religious: [
    { name: 'Sacred Light', engine: 'Heritage', opening: 'lamp', font: SERIF },
    { name: 'Holy Arch', engine: 'Midnight Luxe', opening: 'arch', font: CINZEL },
    { name: 'Blessing Scroll', engine: 'Editorial', opening: 'scroll', font: CINZEL },
    { name: 'Divine Rays', engine: 'Aurora Gradient', opening: 'rays', font: SERIF },
    { name: 'Prayer Petals', engine: 'Glassmorphism', opening: 'petals', font: SERIF },
  ],
};

/** Two signature themes per category, with openings that fit its culture or occasion. */
const CATEGORY_THEMES: Record<string, InviteThemeDef[]> = {
  // Weddings
  'Wedding Invitation': [
    { name: 'Rose Garden', engine: 'Aurora Gradient', opening: 'petals', variant: 'roses', font: SCRIPT },
    { name: 'Vintage Lace', engine: 'Editorial', opening: 'letter', font: CINZEL },
  ],
  'Islamic Invitation': [
    { name: 'Crescent Arch', engine: 'Midnight Luxe', opening: 'arch', font: CINZEL },
    { name: 'Lantern Night', engine: 'Glassmorphism', opening: 'lights', variant: 'lanterns', font: SERIF },
  ],
  'South Indian Wedding': [
    { name: 'Gopuram Gates', engine: 'Heritage', opening: 'doors', variant: 'gopuram', font: SERIF },
    { name: 'Marigold Toran', engine: 'Aurora Gradient', opening: 'lights', variant: 'marigold', font: SERIF },
  ],
  'Kerala Traditional': [
    { name: 'Nilavilakku', engine: 'Heritage', opening: 'lamp', font: SERIF },
    { name: 'Kasavu Gold', engine: 'Midnight Luxe', opening: 'doors', font: CINZEL },
  ],
  'Punjabi Traditional': [
    { name: 'Phulkari Curtain', engine: 'Aurora Gradient', opening: 'curtain', font: SERIF },
    { name: 'Dhol Baaje', engine: 'Bento Grid', opening: 'confetti', variant: 'marigold', font: PLAYFUL },
  ],
  'Bengali Wedding': [
    { name: 'Shubho Drishti', engine: 'Heritage', opening: 'doors', font: SERIF },
    { name: 'Alpona Petals', engine: 'Glassmorphism', opening: 'petals', variant: 'marigold', font: SERIF },
  ],
  'Christian Invitation': [
    { name: 'Chapel Bells', engine: 'Editorial', opening: 'bells', font: CINZEL },
    { name: 'Stained Glass', engine: 'Midnight Luxe', opening: 'rays', variant: 'stained', font: CINZEL },
  ],
  'Engagement Invitation': [
    { name: 'Ring Box', engine: 'Midnight Luxe', opening: 'ringbox', font: CINZEL },
    { name: 'Sparkle Promise', engine: 'Glassmorphism', opening: 'stars', font: SCRIPT },
  ],
  'Classic Engagement': [
    { name: 'Pearl Ring Box', engine: 'Editorial', opening: 'ringbox', font: SCRIPT },
    { name: 'Rose Petals', engine: 'Aurora Gradient', opening: 'petals', variant: 'roses', font: SERIF },
  ],
  'Modern Engagement': [
    { name: 'She Said Yes', engine: 'Bento Grid', opening: 'ringbox', font: DISPLAY },
    { name: 'Neon Proposal', engine: 'Midnight Luxe', opening: 'neon', font: PARTY },
  ],
  // Birthdays
  'Kids Birthday': [
    { name: 'Blow The Candles', engine: 'Aurora Gradient', opening: 'cake', font: PLAYFUL },
    { name: 'Circus Balloons', engine: 'Bento Grid', opening: 'balloons', font: PLAYFUL },
  ],
  '1st Birthday': [
    { name: 'First Candle', engine: 'Glassmorphism', opening: 'cake', font: PLAYFUL },
    { name: 'Baby Stars', engine: 'Editorial', opening: 'stars', font: SCRIPT },
  ],
  'Sweet 16 Birthday': [
    { name: 'Pink Neon', engine: 'Midnight Luxe', opening: 'neon', font: PARTY },
    { name: 'Heart Confetti', engine: 'Aurora Gradient', opening: 'confetti', variant: 'hearts', font: SCRIPT },
  ],
  'Adult Birthday': [
    { name: 'Champagne Toast', engine: 'Midnight Luxe', opening: 'confetti', variant: 'gold', font: CINZEL },
    { name: 'Midnight Cake', engine: 'Editorial', opening: 'cake', font: SERIF },
  ],
  // Housewarming
  'Traditional Housewarming': [
    { name: 'Griha Pravesh Doors', engine: 'Heritage', opening: 'doors', variant: 'gopuram', font: SERIF },
    { name: 'Mango Leaf Toran', engine: 'Aurora Gradient', opening: 'lights', variant: 'marigold', font: SERIF },
  ],
  'Modern Housewarming': [
    { name: 'New Keys', engine: 'Bento Grid', opening: 'key', font: DISPLAY },
    { name: 'Cozy Lights', engine: 'Midnight Luxe', opening: 'lights', font: SCRIPT },
  ],
  // College fests
  'Tech Fest': [
    { name: 'Launch Sequence', engine: 'Midnight Luxe', opening: 'rocket', font: TECH },
    { name: 'Code Boot', engine: 'Bento Grid', opening: 'glitch', font: TECH },
  ],
  'Cultural Fest': [
    { name: 'Spotlight', engine: 'Aurora Gradient', opening: 'curtain', font: DISPLAY },
    { name: 'Colour Splash', engine: 'Glassmorphism', opening: 'confetti', variant: 'paint', font: PLAYFUL },
  ],
  'Sports Meet': [
    { name: 'Trophy Glory', engine: 'Midnight Luxe', opening: 'trophy', font: DISPLAY },
    { name: 'Starting Whistle', engine: 'Bento Grid', opening: 'countdown', font: TECH },
  ],
  // Religious
  'Mosque Event': [
    { name: 'Crescent Moon', engine: 'Midnight Luxe', opening: 'arch', font: CINZEL },
    { name: 'Lantern Glow', engine: 'Glassmorphism', opening: 'lights', variant: 'lanterns', font: SERIF },
  ],
  'Church Event': [
    { name: 'Church Bells', engine: 'Editorial', opening: 'bells', font: CINZEL },
    { name: 'Stained Glass Light', engine: 'Midnight Luxe', opening: 'rays', variant: 'stained', font: CINZEL },
  ],
  'Temple Event': [
    { name: 'Deepam', engine: 'Heritage', opening: 'lamp', font: SERIF },
    { name: 'Temple Gopuram', engine: 'Aurora Gradient', opening: 'doors', variant: 'gopuram', font: SERIF },
  ],
};

const ALL_THEMES = [...Object.values(CATEGORY_THEMES).flat(), ...Object.values(FAMILY_THEMES).flat()];

/**
 * A category's five themes: its two signatures, then three of the family's five,
 * picked by the category's position so neighbouring categories get different sets.
 */
export const themeNamesForCategory = (category: string, family: InviteFamily, position: number) => {
  const own = CATEGORY_THEMES[category] || [];
  const ownOpenings = own.map(t => t.opening);
  const pool = FAMILY_THEMES[family].filter(t => !ownOpenings.includes(t.opening));
  const start = position % pool.length;
  const picked = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 5 - own.length);
  return [...own, ...picked].map(t => t.name);
};

/** The theme definition for a theme name, preferring the given family's own themes. */
export const findInviteTheme = (theme?: string, family?: InviteFamily | null): InviteThemeDef | null => {
  const t = (theme || '').trim().toLowerCase();
  if (!t) return null;
  const own = family ? FAMILY_THEMES[family].find(d => d.name.toLowerCase() === t) : undefined;
  return own || ALL_THEMES.find(d => d.name.toLowerCase() === t) || null;
};

/* ------------------------------------------------------------------ */
/* Category motifs and greetings                                       */
/* ------------------------------------------------------------------ */

export type Motif =
  | 'floral' | 'arabesque' | 'kolam' | 'kasavu' | 'phulkari' | 'alpana' | 'stainedGlass' | 'sparkle'
  | 'confetti' | 'stars' | 'hearts' | 'leaves' | 'circuit' | 'brush' | 'stripes';

const MOTIFS: Record<string, Motif> = {
  'Wedding Invitation': 'floral',
  'Islamic Invitation': 'arabesque',
  'South Indian Wedding': 'kolam',
  'Kerala Traditional': 'kasavu',
  'Punjabi Traditional': 'phulkari',
  'Bengali Wedding': 'alpana',
  'Christian Invitation': 'stainedGlass',
  'Engagement Invitation': 'sparkle',
  'Classic Engagement': 'floral',
  'Modern Engagement': 'sparkle',
  'Kids Birthday': 'confetti',
  '1st Birthday': 'stars',
  'Sweet 16 Birthday': 'hearts',
  'Adult Birthday': 'sparkle',
  'Traditional Housewarming': 'kolam',
  'Modern Housewarming': 'leaves',
  'Tech Fest': 'circuit',
  'Cultural Fest': 'brush',
  'Sports Meet': 'stripes',
  'Mosque Event': 'arabesque',
  'Church Event': 'stainedGlass',
  'Temple Event': 'kolam',
};

export const motifFor = (category?: string): Motif => (category && MOTIFS[category]) || 'floral';

/** A short greeting in the category's own script, shown in traditional heroes and openings. */
const GREETINGS: Record<string, string> = {
  'Bengali Wedding': 'শুভ বিবাহ',
  'South Indian Wedding': 'சுப முகூர்த்தம்',
  'Kerala Traditional': 'ശുഭ മുഹൂർത്തം',
  'Punjabi Traditional': 'ਅਨੰਦ ਕਾਰਜ',
  'Islamic Invitation': 'بِسْمِ ٱللَّٰهِ',
  'Mosque Event': 'ٱلسَّلَامُ عَلَيْكُمْ',
  'Temple Event': 'ॐ',
  'Traditional Housewarming': 'गृह प्रवेश',
  'Christian Invitation': 'In God’s Grace',
  'Church Event': 'Peace Be With You',
  'Wedding Invitation': 'Together Forever',
  'Classic Engagement': 'Two Hearts, One Promise',
  'Modern Housewarming': 'Home Sweet Home',
};

export const greetingFor = (category?: string) => (category && GREETINGS[category]) || '';

/* ------------------------------------------------------------------ */
/* Ambient background (falling petals, gold dust...) once opened       */
/* ------------------------------------------------------------------ */

export type AmbientKind = 'petals' | 'roses' | 'marigold' | 'jasmine' | 'blossom' | 'dust' | 'confetti' | 'hearts' | 'leaves' | 'sparkles' | 'stars';

const AMBIENT_BY_CATEGORY: Record<string, AmbientKind> = {
  'Wedding Invitation': 'petals',
  'Islamic Invitation': 'dust',
  'South Indian Wedding': 'marigold',
  'Kerala Traditional': 'jasmine',
  'Punjabi Traditional': 'marigold',
  'Bengali Wedding': 'roses',
  'Christian Invitation': 'blossom',
  'Engagement Invitation': 'sparkles',
  'Classic Engagement': 'petals',
  'Modern Engagement': 'hearts',
  'Kids Birthday': 'confetti',
  '1st Birthday': 'confetti',
  'Sweet 16 Birthday': 'hearts',
  'Adult Birthday': 'sparkles',
  'Traditional Housewarming': 'marigold',
  'Modern Housewarming': 'leaves',
  'Tech Fest': 'sparkles',
  'Cultural Fest': 'confetti',
  'Sports Meet': 'confetti',
  'Mosque Event': 'dust',
  'Church Event': 'blossom',
  'Temple Event': 'marigold',
};

/** What drifts behind the page once an invitation is opened: the theme's own flavour, else the category's. */
export const ambientFor = (category?: string, theme?: InviteThemeDef | null): AmbientKind => {
  switch (theme?.variant) {
    case 'roses': return 'roses';
    case 'marigold': return 'marigold';
    case 'hearts': return 'hearts';
    case 'gold': return 'dust';
    case 'paint': return 'confetti';
  }
  if (theme?.opening === 'stars') return 'stars';
  if (theme?.opening === 'leaves') return 'leaves';
  if (theme?.opening === 'neon' || theme?.opening === 'lights' || theme?.opening === 'glitch') return 'sparkles';
  return (category && AMBIENT_BY_CATEGORY[category]) || 'petals';
};
