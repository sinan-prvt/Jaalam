// Per-category colour palettes and imagery for the modern invitation themes.
// Every invitation category gets the same five modern styles, each tinted with
// the category's own palette so the result still feels culturally specific.

export const MODERN_INVITATION_THEMES = ['Glassmorphism', 'Aurora Gradient', 'Bento Grid', 'Editorial', 'Midnight Luxe'] as const;

export type ModernInvitationStyle = (typeof MODERN_INVITATION_THEMES)[number];

// Internal styles that are not offered as a general theme choice (e.g. Bengali "Elegant Traditional").
export type InvitationStyle = ModernInvitationStyle | 'Heritage';

export const getModernInvitationStyle = (theme?: string): ModernInvitationStyle | null => {
  const t = (theme || '').trim().toLowerCase();
  return MODERN_INVITATION_THEMES.find((name) => name.toLowerCase() === t) || null;
};

export type InviteIcon = 'heart' | 'ring' | 'gift' | 'cake' | 'home' | 'zap' | 'palette' | 'trophy' | 'moon' | 'church' | 'flame';

export interface InvitePalette {
  accent: string;
  accent2: string;
  accent3: string;
  icon: InviteIcon;
  eyebrow: string;
  image: string;
}

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

const PALETTES: Record<string, InvitePalette> = {
  // Wedding
  'Wedding Invitation': { accent: '#c8a165', accent2: '#e8b4b8', accent3: '#7a5c3e', icon: 'heart', eyebrow: 'The Wedding Of', image: img('photo-1519741497674-611481863552') },
  'Islamic Invitation': { accent: '#0f766e', accent2: '#d4af37', accent3: '#064e3b', icon: 'moon', eyebrow: 'Nikkah Ceremony', image: img('photo-1584551246679-0daf3d275d0f') },
  'South Indian Wedding': { accent: '#b91c1c', accent2: '#f59e0b', accent3: '#14532d', icon: 'flame', eyebrow: 'Subha Muhurtham', image: img('photo-1583939000185-1bf2df2cbf54') },
  'Kerala Traditional': { accent: '#b8862b', accent2: '#16a34a', accent3: '#7c2d12', icon: 'flame', eyebrow: 'Kalyanam', image: img('photo-1587271407850-8d438ca9fdf2') },
  'Punjabi Traditional': { accent: '#c026d3', accent2: '#f97316', accent3: '#facc15', icon: 'heart', eyebrow: 'Anand Karaj', image: img('photo-1579227114347-15d08fc37cae') },
  'Bengali Wedding': { accent: '#be123c', accent2: '#eab308', accent3: '#7f1d1d', icon: 'flame', eyebrow: 'Shubho Bibaho', image: img('photo-1601296200639-89349ce767cb') },
  'Christian Invitation': { accent: '#64748b', accent2: '#c4b5a0', accent3: '#1e293b', icon: 'church', eyebrow: 'Holy Matrimony', image: img('photo-1465495976277-4387d4b0b4c6') },
  'Engagement Invitation': { accent: '#6366f1', accent2: '#f0abfc', accent3: '#312e81', icon: 'ring', eyebrow: 'The Engagement Of', image: img('photo-1515934751635-c81c6bc9a2d8') },
  'Classic Engagement': { accent: '#c5a880', accent2: '#f4c2c2', accent3: '#5b4636', icon: 'ring', eyebrow: 'Save The Date', image: img('photo-1522673607200-164d1b6ce486') },
  'Modern Engagement': { accent: '#ec4899', accent2: '#8b5cf6', accent3: '#0f172a', icon: 'ring', eyebrow: 'She Said Yes', image: img('photo-1529636798458-92182e662485') },

  // Birthday
  'Kids Birthday': { accent: '#f97316', accent2: '#06b6d4', accent3: '#a855f7', icon: 'cake', eyebrow: "It's Party Time", image: img('photo-1530103862676-de3c9da59c6b') },
  '1st Birthday': { accent: '#f472b6', accent2: '#60a5fa', accent3: '#fbbf24', icon: 'cake', eyebrow: 'One Year Of Joy', image: img('photo-1519689680058-324335c77eba') },
  'Sweet 16 Birthday': { accent: '#db2777', accent2: '#a78bfa', accent3: '#f9a8d4', icon: 'gift', eyebrow: 'Sweet Sixteen', image: img('photo-1511285560929-80b456fea0bc') },
  'Adult Birthday': { accent: '#d4a373', accent2: '#e11d48', accent3: '#18181b', icon: 'gift', eyebrow: 'Birthday Celebration', image: img('photo-1492562080023-ab3db95bfbce') },

  // Housewarming
  'Traditional Housewarming': { accent: '#d97706', accent2: '#dc2626', accent3: '#78350f', icon: 'home', eyebrow: 'Griha Pravesh', image: img('photo-1460500063983-994d4c27756c') },
  'Modern Housewarming': { accent: '#0d9488', accent2: '#c5b396', accent3: '#134e4a', icon: 'home', eyebrow: 'Housewarming Party', image: img('photo-1507290439931-a861b5a38200') },

  // College Fest
  'Tech Fest': { accent: '#06b6d4', accent2: '#8b5cf6', accent3: '#0f172a', icon: 'zap', eyebrow: 'Annual Tech Fest', image: img('photo-1504384308090-c894fdcc538d') },
  'Cultural Fest': { accent: '#e11d48', accent2: '#f59e0b', accent3: '#7c3aed', icon: 'palette', eyebrow: 'Annual Cultural Fest', image: img('photo-1540575467063-178a50c2df87') },
  'Sports Meet': { accent: '#16a34a', accent2: '#facc15', accent3: '#1d4ed8', icon: 'trophy', eyebrow: 'Annual Sports Meet', image: img('photo-1475721025505-23126fbb6b4f') },

  // Religious
  'Mosque Event': { accent: '#047857', accent2: '#d4af37', accent3: '#022c22', icon: 'moon', eyebrow: 'Assalamu Alaikum', image: img('photo-1542816417-0983c9c9ad53') },
  'Church Event': { accent: '#9f1239', accent2: '#c9a96e', accent3: '#1e1b4b', icon: 'church', eyebrow: 'Welcome To Our Parish', image: img('photo-1438032005730-c779502fac39') },
  'Temple Event': { accent: '#ea580c', accent2: '#facc15', accent3: '#7f1d1d', icon: 'flame', eyebrow: 'Om Namah Shivaya', image: img('photo-1590396009804-00d9b4b08709') },
};

const FALLBACK: InvitePalette = { accent: '#6366f1', accent2: '#ec4899', accent3: '#0f172a', icon: 'heart', eyebrow: "You're Invited", image: img('photo-1519225421980-715cb0215aed') };

export const getInvitePalette = (category?: string): InvitePalette => (category && PALETTES[category]) || FALLBACK;
