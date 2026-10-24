import type { ArtKey, LayoutKey, Palette, PosterData, PosterFontKey, PosterTemplate } from './types';
import { CREATIVE_LAYOUTS, ENGLISH_LAYOUTS, KERALA_LAYOUTS, LAYOUTS } from './registry';

type FontPair = [PosterFontKey, PosterFontKey];

interface Category {
  key: string;
  label: string;
  group: 'Kerala Festivals' | 'Festivals & Days' | 'Business' | 'Events & Notices';
  art: ArtKey;
  /** Photos used across the category's templates; none = artwork. */
  images?: string[];
  palettes: Palette[];
  fonts: FontPair[];
  /** Layouts that suit this category best, shown first. */
  featured: LayoutKey[];
  data: Partial<PosterData>;
  /** Malayalam copy used by the Kerala ad layouts (falls back to data). */
  ml?: Partial<PosterData>;
  /** Kerala ad layouts that suit this category; all when omitted. */
  kerala?: LayoutKey[];
}

/** Stock photo URL (Unsplash). Posters keep their own photos, separate from website themes. */
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const pal = (bg: string, bg2: string, ink: string, accent: string, accent2: string, onAccent: string): Palette => ({ bg, bg2, ink, accent, accent2, onAccent });

const BASE: PosterData = {
  brand: 'Your Brand', headline: '', subhead: '', offer: '', body: '', cta: '',
  contact: '+91 98765 43210', address: 'MG Road, Kochi', date: '', image: '', logo: '',
};

export const CATEGORIES: Category[] = [
  // ── Kerala festivals ──
  {
    key: 'onam', label: 'Onam', group: 'Kerala Festivals', art: 'pookalam',
    palettes: [pal('#fbf3df', '#f3e3b6', '#3b2a12', '#c99a2e', '#7a1f1f', '#ffffff'), pal('#14532d', '#166534', '#fefce8', '#facc15', '#f97316', '#14532d'), pal('#7a1f1f', '#5c1414', '#fff7e6', '#e8b64c', '#fde68a', '#3b0d0d')],
    fonts: [['baloo', 'poppins'], ['notoSerifMl', 'manjari'], ['cinzel', 'baloo']],
    featured: ['kasavu', 'frame', 'circle'],
    data: { headline: 'ഓണാശംസകൾ', subhead: 'Happy Onam', body: 'May this Onam bring prosperity and joy to your home', offer: 'Onam Offer 30% OFF', date: 'Thiruvonam · 5 September' },
    ml: {"headline": "ഓണാശംസകൾ", "subhead": "Happy Onam", "body": "ഏവർക്കും ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ", "offer": "ഓണം ഓഫർ 30% വരെ കിഴിവ്", "date": "തിരുവോണം · സെപ്റ്റംബർ 5", "cta": "കൂടുതൽ വിവരങ്ങൾക്ക്"},
  },
  {
    key: 'vishu', label: 'Vishu', group: 'Kerala Festivals', art: 'konna',
    palettes: [pal('#fffbea', '#fef3c7', '#422006', '#ca8a04', '#15803d', '#ffffff'), pal('#14532d', '#1a3d24', '#fefce8', '#facc15', '#fde047', '#14532d'), pal('#422006', '#2d1604', '#fef9c3', '#facc15', '#f59e0b', '#422006')],
    fonts: [['baloo', 'outfit'], ['notoSerifMl', 'poppins'], ['playfair', 'manjari']],
    featured: ['kasavu', 'circle', 'frame'],
    data: { headline: 'വിഷു ആശംസകൾ', subhead: 'Happy Vishu', body: 'Wishing you a prosperous year ahead', offer: 'Vishu Kaineettam Offers', date: '14 April' },
    ml: {"headline": "വിഷു\nആശംസകൾ", "subhead": "Happy Vishu", "body": "ഐശ്വര്യത്തിന്റെയും സമൃദ്ധിയുടെയും പൊൻകണി", "offer": "വിഷു കൈനീട്ടം ഓഫറുകൾ", "date": "ഏപ്രിൽ 14"},
  },
  {
    key: 'kerala-piravi', label: 'Kerala Piravi', group: 'Kerala Festivals', art: 'waves',
    palettes: [pal('#ecfdf5', '#bbf7d0', '#052e16', '#15803d', '#0e7490', '#ffffff'), pal('#0c4a6e', '#075985', '#f0f9ff', '#facc15', '#22c55e', '#0c4a6e'), pal('#fefce8', '#d9f99d', '#1a2e05', '#4d7c0f', '#0369a1', '#ffffff')],
    fonts: [['baloo', 'poppins'], ['notoSerifMl', 'outfit'], ['dmSerif', 'manjari']],
    featured: ['frame', 'hero', 'kasavu'],
    data: { headline: 'കേരളപ്പിറവി ആശംസകൾ', subhead: 'Happy Kerala Day', body: "God's Own Country turns another year older", date: '1 November' },
    ml: {"headline": "കേരളപ്പിറവി\nആശംസകൾ", "subhead": "ദൈവത്തിന്റെ സ്വന്തം നാട്", "body": "മലയാളത്തിന്റെ മണ്ണിന് പിറന്നാൾ ആശംസകൾ", "date": "നവംബർ 1"},
  },
  {
    key: 'temple-utsavam', label: 'Temple Utsavam', group: 'Kerala Festivals', art: 'lamps',
    palettes: [pal('#450a0a', '#2b0606', '#fef3c7', '#f59e0b', '#dc2626', '#450a0a'), pal('#fff7ed', '#fed7aa', '#431407', '#c2410c', '#a16207', '#ffffff'), pal('#1c1917', '#292524', '#fde68a', '#eab308', '#ea580c', '#1c1917')],
    fonts: [['notoSerifMl', 'manjari'], ['cinzel', 'baloo'], ['baloo', 'poppins']],
    featured: ['frame', 'kasavu', 'card'],
    data: { headline: 'ഉത്സവം 2026', subhead: 'Thiruvutsavam', body: 'Kodiyettam · Ezhunnallathu · Aarattu\nAll devotees are warmly welcome', date: '10 – 17 March', brand: 'Sree Temple Committee' },
    ml: {"headline": "തിരുവുത്സവം\n2026", "subhead": "ശ്രീ മഹാദേവ ക്ഷേത്രം", "body": "കൊടിയേറ്റം · എഴുന്നള്ളത്ത് · ആറാട്ട്\nഏവർക്കും സ്വാഗതം", "date": "മാർച്ച് 10 – 17", "brand": "ക്ഷേത്ര ഉപദേശക സമിതി", "cta": "കൂടുതൽ വിവരങ്ങൾക്ക്"},
  },
  // ── Festivals & days ──
  {
    key: 'christmas', label: 'Christmas', group: 'Festivals & Days', art: 'star',
    palettes: [pal('#7f1d1d', '#991b1b', '#fff7ed', '#facc15', '#16a34a', '#7f1d1d'), pal('#052e16', '#14532d', '#f0fdf4', '#ef4444', '#facc15', '#ffffff'), pal('#0f172a', '#1e293b', '#f8fafc', '#fbbf24', '#ef4444', '#0f172a')],
    fonts: [['greatVibes', 'poppins'], ['playfair', 'outfit'], ['lobster', 'baloo']],
    featured: ['frame', 'circle', 'polaroid'],
    data: { headline: 'Merry Christmas', subhead: 'ക്രിസ്മസ് ആശംസകൾ', body: 'Peace, love and joy to you and your family', offer: 'Xmas Sale 40% OFF', date: '25 December' },
    ml: {"headline": "ക്രിസ്മസ്\nആശംസകൾ", "subhead": "Merry Christmas", "body": "സ്നേഹത്തിന്റെയും സമാധാനത്തിന്റെയും ക്രിസ്മസ്", "offer": "ക്രിസ്മസ് സെയിൽ 40% കിഴിവ്", "date": "ഡിസംബർ 25"},
  },
  {
    key: 'new-year', label: 'New Year', group: 'Festivals & Days', art: 'confetti',
    palettes: [pal('#0b0b14', '#18181b', '#fafafa', '#eab308', '#a855f7', '#0b0b14'), pal('#1e1b4b', '#312e81', '#eef2ff', '#f472b6', '#22d3ee', '#1e1b4b'), pal('#fff7ed', '#fde68a', '#1c1917', '#d97706', '#db2777', '#ffffff')],
    fonts: [['anton', 'poppins'], ['playfair', 'outfit'], ['righteous', 'baloo']],
    featured: ['bold', 'frame', 'circle'],
    data: { headline: 'Happy New Year 2027', subhead: 'പുതുവത്സരാശംസകൾ', body: 'Thank you for being with us all year', offer: 'New Year Sale', date: '1 January' },
    ml: {"headline": "പുതുവത്സര\nആശംസകൾ", "subhead": "Happy New Year 2027", "body": "പുതിയ പ്രതീക്ഷകളുടെ പുതുവർഷം", "offer": "ന്യൂ ഇയർ സെയിൽ", "date": "ജനുവരി 1"},
  },
  {
    key: 'eid', label: 'Eid Mubarak', group: 'Festivals & Days', art: 'crescent',
    palettes: [pal('#064e3b', '#065f46', '#ecfdf5', '#facc15', '#a7f3d0', '#064e3b'), pal('#1e1b4b', '#0f0d33', '#f5f3ff', '#e9c46a', '#a78bfa', '#1e1b4b'), pal('#fefce8', '#fef08a', '#14532d', '#047857', '#ca8a04', '#ffffff')],
    fonts: [['cinzel', 'poppins'], ['marcellus', 'baloo'], ['greatVibes', 'outfit']],
    featured: ['frame', 'kasavu', 'card'],
    data: { headline: 'Eid Mubarak', subhead: 'ഈദ് മുബാറക്', body: 'May Allah bless you with happiness and peace', offer: 'Eid Special Offers', date: 'Eid ul-Fitr' },
    ml: {"headline": "ഈദ്\nമുബാറക്", "subhead": "ചെറിയ പെരുന്നാൾ ആശംസകൾ", "body": "സ്നേഹത്തിന്റെയും സാഹോദര്യത്തിന്റെയും പെരുന്നാൾ", "offer": "പെരുന്നാൾ ഓഫറുകൾ"},
  },
  {
    key: 'ramadan', label: 'Ramadan', group: 'Festivals & Days', art: 'crescent',
    palettes: [pal('#0c1a33', '#132744', '#f1f5f9', '#e9c46a', '#38bdf8', '#0c1a33'), pal('#3b0764', '#2e1065', '#faf5ff', '#fbbf24', '#c084fc', '#3b0764'), pal('#f8fafc', '#e2e8f0', '#0f172a', '#0f766e', '#b45309', '#ffffff')],
    fonts: [['marcellus', 'poppins'], ['cinzel', 'outfit'], ['playfair', 'baloo']],
    featured: ['frame', 'menu', 'card'],
    data: { headline: 'Ramadan Kareem', subhead: 'Iftar Specials', body: 'Chicken Biriyani - ₹180\nPathiri & Curry - ₹120\nTharikanji - ₹60\nFruit Platter - ₹90', offer: 'Iftar Box ₹249', date: 'Every evening 6:30 PM' },
    ml: {"headline": "റമദാൻ\nകരീം", "subhead": "ഇഫ്താർ സ്പെഷ്യൽ", "body": "ചിക്കൻ ബിരിയാണി - ₹180\nപത്തിരിയും കറിയും - ₹120\nതരിക്കഞ്ഞി - ₹60\nഫ്രൂട്ട് പ്ലേറ്റർ - ₹90", "offer": "ഇഫ്താർ ബോക്സ് ₹249", "date": "വൈകിട്ട് 6:30 മുതൽ"},
  },
  {
    key: 'diwali', label: 'Diwali', group: 'Festivals & Days', art: 'lamps',
    palettes: [pal('#2a0a3b', '#3b0d52', '#fff7ed', '#f59e0b', '#ec4899', '#2a0a3b'), pal('#7c2d12', '#9a3412', '#fff7ed', '#fde047', '#fb923c', '#7c2d12'), pal('#fff7ed', '#ffedd5', '#431407', '#ea580c', '#be123c', '#ffffff')],
    fonts: [['baloo', 'poppins'], ['cinzel', 'outfit'], ['lobster', 'manjari']],
    featured: ['frame', 'circle', 'ribbon'],
    data: { headline: 'Happy Diwali', subhead: 'ദീപാവലി ആശംസകൾ', body: 'May the festival of lights brighten your life', offer: 'Festive Offer 25% OFF', date: 'Festival of Lights' },
    ml: {"headline": "ദീപാവലി\nആശംസകൾ", "subhead": "Happy Diwali", "body": "ദീപങ്ങളുടെ ഉത്സവം നിങ്ങളുടെ ജീവിതത്തിൽ വെളിച്ചം നിറയ്ക്കട്ടെ", "offer": "ഫെസ്റ്റിവൽ ഓഫർ 25% കിഴിവ്"},
  },
  {
    key: 'independence', label: 'Independence Day', group: 'Festivals & Days', art: 'flag',
    palettes: [pal('#ffffff', '#f1f5f9', '#0f172a', '#ea580c', '#15803d', '#ffffff'), pal('#0b1d4d', '#13286b', '#ffffff', '#ff9933', '#22c55e', '#0b1d4d'), pal('#fff7ed', '#ffedd5', '#1e3a8a', '#16a34a', '#ea580c', '#ffffff')],
    fonts: [['anton', 'poppins'], ['playfair', 'baloo'], ['montserrat', 'outfit']],
    featured: ['frame', 'hero', 'card'],
    data: { headline: 'Happy Independence Day', subhead: 'സ്വാതന്ത്ര്യ ദിനാശംസകൾ', body: 'Saluting the spirit of a free nation', date: '15 August' },
    ml: {"headline": "സ്വാതന്ത്ര്യ ദിന\nആശംസകൾ", "subhead": "Happy Independence Day", "body": "ജയ് ഹിന്ദ്", "date": "ഓഗസ്റ്റ് 15"},
  },
  {
    key: 'easter', label: 'Easter & Church Feast', group: 'Festivals & Days', art: 'cross',
    palettes: [pal('#fdf4ff', '#f5d0fe', '#3b0764', '#a21caf', '#ca8a04', '#ffffff'), pal('#1e1b4b', '#312e81', '#f5f3ff', '#fbbf24', '#f9a8d4', '#1e1b4b'), pal('#fffbeb', '#fef3c7', '#422006', '#b45309', '#7c3aed', '#ffffff')],
    fonts: [['cormorant', 'poppins'], ['cinzel', 'outfit'], ['playfair', 'manjari']],
    featured: ['frame', 'kasavu', 'card'],
    data: { headline: 'Happy Easter', subhead: 'He is risen', body: 'Holy Mass · Procession · Fellowship\nAll are welcome', date: 'Sunday 7:00 AM', brand: 'St. Mary’s Church' },
    ml: {"headline": "ഈസ്റ്റർ\nആശംസകൾ", "subhead": "ഉയിർപ്പ് തിരുനാൾ", "body": "വിശുദ്ധ കുർബാന · പ്രദക്ഷിണം\nഏവർക്കും സ്വാഗതം", "date": "ഞായർ രാവിലെ 7:00", "brand": "സെന്റ് മേരീസ് പള്ളി", "cta": "കൂടുതൽ വിവരങ്ങൾക്ക്"},
  },
  // ── Business ──
  {
    key: 'grand-opening', label: 'Grand Opening', group: 'Business', art: 'confetti',
    palettes: [pal('#7f1d1d', '#991b1b', '#fff7ed', '#facc15', '#f97316', '#7f1d1d'), pal('#0f172a', '#1e293b', '#f8fafc', '#f59e0b', '#ef4444', '#0f172a'), pal('#fff7ed', '#fed7aa', '#431407', '#dc2626', '#d97706', '#ffffff')],
    fonts: [['baloo', 'poppins'], ['anton', 'outfit'], ['cinzel', 'manjari']],
    featured: ['frame', 'ribbon', 'bold'],
    data: { headline: 'ഉദ്ഘാടനം', subhead: 'Grand Opening', body: 'Inauguration by our honourable guests\nYou and your family are cordially invited', offer: 'Opening Offer 20% OFF', date: 'Sunday · 10:00 AM', cta: 'Visit Us' },
    ml: {"headline": "ഉദ്ഘാടനം", "subhead": "നിങ്ങളുടെ സാന്നിധ്യം സ്നേഹപൂർവ്വം പ്രതീക്ഷിക്കുന്നു", "body": "Grand Opening\nഏവർക്കും സ്വാഗതം", "offer": "ഉദ്ഘാടന ഓഫർ 20% കിഴിവ്", "date": "ഞായർ രാവിലെ 10 മണി", "cta": "കൂടുതൽ വിവരങ്ങൾക്ക്"},
  },
  {
    key: 'sale', label: 'Mega Sale', group: 'Business', art: 'rays',
    images: [u('photo-1441984904996-e0b6ba687e04', 1200), u('photo-1555041469-a586c61ea9bc', 1200), u('photo-1529139574466-a303027c1d8b', 1200)],
    palettes: [pal('#fef08a', '#fde047', '#111827', '#dc2626', '#111827', '#ffffff'), pal('#111827', '#1f2937', '#f9fafb', '#facc15', '#ef4444', '#111827'), pal('#dc2626', '#b91c1c', '#ffffff', '#fde047', '#111827', '#7f1d1d')],
    fonts: [['anton', 'poppins'], ['bebas', 'outfit'], ['archivo', 'baloo']],
    featured: ['bold', 'ribbon', 'split'],
    data: { headline: 'Mega Sale', subhead: 'Limited time only', offer: 'Flat 50% OFF', body: 'On all products · This weekend only', cta: 'Shop Now', date: 'Fri – Sun' },
    ml: {"headline": "മെഗാ\nസെയിൽ", "subhead": "ഈ ആഴ്ച മാത്രം", "body": "എല്ലാ ഉൽപ്പന്നങ്ങൾക്കും\nഓഫർ സ്റ്റോക്ക് തീരും വരെ", "offer": "50% വരെ കിഴിവ്", "cta": "Shop Now", "date": "വെള്ളി – ഞായർ"},
  },
  {
    key: 'restaurant', label: 'Restaurant & Hotel', group: 'Business', art: 'rays',
    images: [u('photo-1546069901-ba9599a7e63c', 1200), u('photo-1555939594-58d7cb561ad1', 1200), u('photo-1414235077428-338989a2e8c0', 1200), u('photo-1514933651103-005eec06c04b', 1200)],
    palettes: [pal('#1c1917', '#292524', '#fafaf9', '#f59e0b', '#ef4444', '#1c1917'), pal('#fff7ed', '#ffedd5', '#431407', '#c2410c', '#15803d', '#ffffff'), pal('#14532d', '#166534', '#f0fdf4', '#facc15', '#fb923c', '#14532d')],
    fonts: [['playfair', 'poppins'], ['bebas', 'outfit'], ['lobster', 'baloo']],
    featured: ['menu', 'hero', 'split'],
    data: { headline: 'Taste of Kerala', subhead: 'Today’s Special', body: 'Kerala Sadhya - ₹180\nKarimeen Pollichathu - ₹320\nBeef Fry & Porotta - ₹160\nAppam & Stew - ₹140\nMalabar Biriyani - ₹220', offer: 'Free Delivery', cta: 'Order Now', brand: 'Hotel Kerala Kitchen' },
    ml: {"headline": "നാടൻ രുചിയുടെ\nപുതിയ അനുഭവം", "subhead": "Today’s Special", "body": "കേരള സദ്യ - ₹180\nകരിമീൻ പൊള്ളിച്ചത് - ₹320\nബീഫ് ഫ്രൈ & പൊറോട്ട - ₹160\nഅപ്പവും സ്റ്റ്യൂവും - ₹140", "offer": "ഫ്രീ ഹോം ഡെലിവറി", "cta": "ഓർഡർ ചെയ്യൂ"},
  },
  {
    key: 'bakery', label: 'Bakery & Cafe', group: 'Business', art: 'heart',
    images: [u('photo-1578985545062-69928b1d9587', 1200), u('photo-1509042239860-f550ce710b93', 1200), u('photo-1555507036-ab1f4038808a', 1200), u('photo-1554118811-1e0d58224f24', 1200)],
    palettes: [pal('#fdf2f8', '#fce7f3', '#4a1d2f', '#db2777', '#92400e', '#ffffff'), pal('#3b2416', '#2a190f', '#fdf6ec', '#f59e0b', '#fb7185', '#3b2416'), pal('#fffbeb', '#fef3c7', '#451a03', '#b45309', '#be185d', '#ffffff')],
    fonts: [['pacifico', 'poppins'], ['dmSerif', 'outfit'], ['lobster', 'baloo']],
    featured: ['polaroid', 'circle', 'menu'],
    data: { headline: 'Freshly Baked', subhead: 'Cakes · Puffs · Coffee', body: 'Black Forest 1kg - ₹650\nChicken Puffs - ₹30\nCappuccino - ₹120\nPlum Cake - ₹350', offer: 'Buy 1 Get 1', cta: 'Order Cake', brand: 'Sweet Crumbs Bakery' },
    ml: {"headline": "മധുരം നിറഞ്ഞ\nനിമിഷങ്ങൾക്ക്", "subhead": "Cakes · Puffs · Coffee", "body": "ബർത്ത്ഡേ കേക്കുകൾ\nകസ്റ്റം കേക്കുകൾ\nഫ്രഷ് പഫ്സ് & സ്നാക്ക്സ്", "offer": "ഒന്ന് വാങ്ങിയാൽ ഒന്ന് ഫ്രീ", "cta": "ഓർഡർ ചെയ്യൂ"},
  },
  {
    key: 'textiles', label: 'Textiles & Sarees', group: 'Business', art: 'rays',
    images: [u('photo-1617627143750-d86bc21e42bb', 1200), u('photo-1489987707025-afc232f7ea0f', 1200), u('photo-1567401893414-76b7b1e5a7a5', 1200)],
    palettes: [pal('#fbf3df', '#f3e3b6', '#3b0d0d', '#b8860b', '#7a1f1f', '#ffffff'), pal('#4a0e17', '#350a10', '#fff1f2', '#e8b64c', '#fda4af', '#4a0e17'), pal('#0f172a', '#1e293b', '#f8fafc', '#d4af37', '#e11d48', '#0f172a')],
    fonts: [['cinzel', 'poppins'], ['cormorant', 'outfit'], ['playfair', 'baloo']],
    featured: ['kasavu', 'magazine', 'split'],
    data: { headline: 'Onam Collection', subhead: 'Kasavu · Silk · Handloom', offer: 'Up to 40% OFF', body: 'Set Mundu · Kerala Sarees · Kurtas · Kids wear', cta: 'Visit Showroom', brand: 'Kerala Silks' },
    ml: {"headline": "ഓണക്കോടി\nകളക്ഷൻ", "subhead": "കസവ് · സിൽക്ക് · ഹാൻഡ്‌ലൂം", "body": "സെറ്റ് മുണ്ട്\nകേരള സാരി\nകുർത്ത\nകിഡ്സ് വെയർ", "offer": "40% വരെ കിഴിവ്", "cta": "Shop Now"},
  },
  {
    key: 'jewellery', label: 'Jewellery & Gold', group: 'Business', art: 'rays',
    images: [u('photo-1535632066927-ab7c9ab60908', 1200), u('photo-1605100804763-247f67b3557e', 1200), u('photo-1599643477877-530eb83abc8e', 1200)],
    palettes: [pal('#1a1206', '#2a1d0a', '#fef3c7', '#d4af37', '#f5d27a', '#1a1206'), pal('#fffbeb', '#fef3c7', '#422006', '#b8860b', '#7f1d1d', '#ffffff'), pal('#3b0a1e', '#2b0716', '#fdf2f8', '#e8b64c', '#f9a8d4', '#3b0a1e')],
    fonts: [['cinzel', 'poppins'], ['cormorant', 'outfit'], ['marcellus', 'baloo']],
    featured: ['frame', 'menu', 'card'],
    data: { headline: 'Bridal Collection', subhead: 'Today’s Gold Rate', body: '22K 1 gram - ₹7,150\n22K 8 gram (pavan) - ₹57,200\n18K 1 gram - ₹5,860\nSilver 1 gram - ₹98', offer: 'Zero Making Charge', cta: 'Visit Showroom', brand: 'Kerala Gold & Diamonds' },
    ml: {"headline": "വിവാഹ\nആഭരണങ്ങൾ", "subhead": "ഇന്നത്തെ സ്വർണ്ണ വില", "body": "22K 1 ഗ്രാം - ₹7,150\n22K 1 പവൻ - ₹57,200\n18K 1 ഗ്രാം - ₹5,860", "offer": "പണിക്കൂലി ഇല്ല", "cta": "ഷോറൂം സന്ദർശിക്കൂ"},
  },
  {
    key: 'supermarket', label: 'Supermarket', group: 'Business', art: 'rays',
    images: [u('photo-1542838132-92c53300491e', 1200), u('photo-1610832958506-aa56368176cf', 1200), u('photo-1540420773420-3366772f4999', 1200)],
    palettes: [pal('#f0fdf4', '#dcfce7', '#052e16', '#16a34a', '#f97316', '#ffffff'), pal('#facc15', '#fde047', '#14532d', '#15803d', '#dc2626', '#ffffff'), pal('#14532d', '#166534', '#f0fdf4', '#facc15', '#fb923c', '#14532d')],
    fonts: [['anton', 'poppins'], ['righteous', 'outfit'], ['baloo', 'manjari']],
    featured: ['menu', 'bold', 'ribbon'],
    data: { headline: 'Weekly Offers', subhead: 'Fresh & Fast', body: 'Matta Rice 5kg - ₹249\nCoconut Oil 1L - ₹199\nSugar 1kg - ₹42\nTea Powder 500g - ₹165\nOnion 1kg - ₹35', offer: 'Free Home Delivery', cta: 'Order on WhatsApp', brand: 'Fresh Mart' },
    ml: {"headline": "എല്ലാം ഇനി\nഒരു കുടക്കീഴിൽ", "subhead": "Weekly Offers", "body": "മട്ട അരി 5kg - ₹249\nവെളിച്ചെണ്ണ 1L - ₹199\nപഞ്ചസാര 1kg - ₹42\nചായപ്പൊടി 500g - ₹165", "offer": "ഫ്രീ ഹോം ഡെലിവറി", "cta": "WhatsApp ചെയ്യൂ"},
  },
  {
    key: 'salon', label: 'Salon & Beauty', group: 'Business', art: 'heart',
    images: [u('photo-1560066984-138dadb4c035', 1200), u('photo-1522337360788-8b13dee7a37e', 1200), u('photo-1570172619644-dfd03ed5d881', 1200)],
    palettes: [pal('#fdf2f8', '#fce7f3', '#500724', '#db2777', '#a855f7', '#ffffff'), pal('#18181b', '#27272a', '#fafafa', '#e8b4a0', '#f472b6', '#18181b'), pal('#2e1065', '#3b0764', '#faf5ff', '#f0abfc', '#fbbf24', '#2e1065')],
    fonts: [['cormorant', 'poppins'], ['greatVibes', 'outfit'], ['marcellus', 'baloo']],
    featured: ['circle', 'menu', 'magazine'],
    data: { headline: 'Bridal Makeover', subhead: 'Hair · Skin · Spa', body: 'Haircut & Styling - ₹400\nFacial - ₹900\nBridal Makeup - ₹8,000\nHair Spa - ₹1,200', offer: '20% OFF First Visit', cta: 'Book Now', brand: 'Glow Beauty Salon' },
    ml: {"headline": "നിങ്ങളുടെ സൗന്ദര്യം\nഞങ്ങളുടെ കരുതൽ", "subhead": "Hair · Skin · Bridal", "body": "ഹെയർ കട്ട് & സ്റ്റൈലിംഗ്\nഫേഷ്യൽ\nബ്രൈഡൽ മേക്കപ്പ്\nഹെയർ സ്പാ", "offer": "ആദ്യ സന്ദർശനത്തിന് 20% കിഴിവ്", "cta": "ബുക്ക് ചെയ്യൂ"},
  },
  {
    key: 'gym', label: 'Gym & Fitness', group: 'Business', art: 'rays',
    images: [u('photo-1534438327276-14e5300c3a48', 1200), u('photo-1571019614242-c5c5dee9f50b', 1200), u('photo-1517838277536-f5f99be501cd', 1200)],
    palettes: [pal('#0a0a0a', '#171717', '#fafafa', '#ef4444', '#facc15', '#ffffff'), pal('#facc15', '#fde047', '#0a0a0a', '#0a0a0a', '#ef4444', '#facc15'), pal('#082f49', '#0c4a6e', '#f0f9ff', '#22d3ee', '#a3e635', '#082f49')],
    fonts: [['bebas', 'montserrat'], ['anton', 'poppins'], ['archivo', 'outfit']],
    featured: ['bold', 'split', 'ribbon'],
    data: { headline: 'No Pain No Gain', subhead: 'Join Today', offer: '₹999 / month', body: 'Personal training · Cardio · CrossFit · Zumba', cta: 'Free Trial', brand: 'Iron Fitness Club' },
    ml: {"headline": "FITNESS\nഇനി എളുപ്പം", "subhead": "Join Today", "body": "Personal Training\nCardio\nCrossFit\nZumba", "offer": "₹999 / മാസം", "cta": "Free Trial"},
  },
  {
    key: 'real-estate', label: 'Real Estate', group: 'Business', art: 'rays',
    images: [u('photo-1600596542815-ffad4c1539a9', 1200), u('photo-1600585154340-be6161a56a0c', 1200), u('photo-1512917774080-9991f1c4c750', 1200)],
    palettes: [pal('#0b1220', '#111a2e', '#f1f5f9', '#c9a227', '#38bdf8', '#0b1220'), pal('#ffffff', '#f1f5f9', '#0f172a', '#0ea5e9', '#c9a227', '#ffffff'), pal('#14532d', '#0f3d22', '#f0fdf4', '#facc15', '#a3e635', '#14532d')],
    fonts: [['montserrat', 'poppins'], ['playfair', 'outfit'], ['cinzel', 'baloo']],
    featured: ['split', 'magazine', 'card'],
    data: { headline: 'Dream Villa For Sale', subhead: '4 BHK · 3200 sq ft', body: 'Near NH 66 · 12 cents · Car porch · Well water', offer: '₹1.25 Cr', cta: 'Call Now', brand: 'Kerala Homes Realty' },
    ml: {"headline": "പുതിയൊരു തുടക്കത്തിനായി\nനിങ്ങളോടൊപ്പം\nഎന്നും", "subhead": "Our Services", "body": "Architecture\nConstruction\nInterior and Exterior\nPlan & Approval", "offer": "Free Plan and Elevation", "cta": "Book Now", "date": "Adding value to your dreams"},
  },
  {
    key: 'electronics', label: 'Mobiles & Electronics', group: 'Business', art: 'rays',
    images: [u('photo-1505740420928-5e560c06d30e', 1200), u('photo-1523275335684-37898b6baf30', 1200), u('photo-1518770660439-4636190af475', 1200)],
    palettes: [pal('#020617', '#0f172a', '#f8fafc', '#22d3ee', '#a855f7', '#020617'), pal('#eef2ff', '#e0e7ff', '#1e1b4b', '#4f46e5', '#06b6d4', '#ffffff'), pal('#18181b', '#27272a', '#fafafa', '#f97316', '#facc15', '#18181b')],
    fonts: [['montserrat', 'poppins'], ['righteous', 'outfit'], ['bebas', 'baloo']],
    featured: ['split', 'bold', 'circle'],
    data: { headline: 'Festival Mega Deals', subhead: 'Mobiles · Laptops · Accessories', offer: 'EMI from ₹999', body: 'Exchange offers · Zero down payment', cta: 'Visit Store', brand: 'Smart Mobiles' },
    ml: {"headline": "ഫെസ്റ്റിവൽ\nമെഗാ ഡീൽസ്", "subhead": "Mobiles · Laptops · Accessories", "body": "എക്സ്ചേഞ്ച് ഓഫറുകൾ\nസീറോ ഡൗൺ പേയ്മെന്റ്", "offer": "EMI ₹999 മുതൽ", "cta": "Shop Now"},
  },
  {
    key: 'education', label: 'Admission & Tuition', group: 'Business', art: 'book',
    palettes: [pal('#eff6ff', '#dbeafe', '#172554', '#2563eb', '#f59e0b', '#ffffff'), pal('#172554', '#1e3a8a', '#eff6ff', '#facc15', '#38bdf8', '#172554'), pal('#fefce8', '#fef9c3', '#1c1917', '#16a34a', '#2563eb', '#ffffff')],
    fonts: [['montserrat', 'poppins'], ['baloo', 'outfit'], ['dmSerif', 'manjari']],
    featured: ['split', 'card', 'hero'],
    data: { headline: 'Admission Open', subhead: '2026 – 27 Batch', body: 'Plus One · Plus Two · NEET · JEE · KEAM\nExpert faculty · Small batches', offer: '100% Results', cta: 'Enroll Now', brand: 'Bright Future Academy' },
    ml: {"headline": "കരിയറിനെ കുറിച്ച്\nകൺഫ്യൂഷനിൽ\nആണോ?", "subhead": "ADMISSION OPEN", "body": "Plus One · Plus Two · NEET · JEE\n3 മാസം കൊണ്ട് സ്വപ്ന കരിയർ", "offer": "100% Placement", "cta": "Enroll Now"},
  },
  {
    key: 'medical', label: 'Hospital & Medical Camp', group: 'Business', art: 'heart',
    palettes: [pal('#f0fdfa', '#ccfbf1', '#134e4a', '#0d9488', '#ef4444', '#ffffff'), pal('#0c4a6e', '#075985', '#f0f9ff', '#5eead4', '#fca5a5', '#0c4a6e'), pal('#ffffff', '#f1f5f9', '#0f172a', '#dc2626', '#0ea5e9', '#ffffff')],
    fonts: [['montserrat', 'poppins'], ['outfit', 'manjari'], ['baloo', 'poppins']],
    featured: ['card', 'split', 'hero'],
    data: { headline: 'Free Medical Camp', subhead: 'സൗജന്യ മെഡിക്കൽ ക്യാമ്പ്', body: 'BP · Sugar · Eye check-up · Dental\nSpecialist doctors available', date: 'Sunday · 9 AM – 1 PM', cta: 'Register Free', brand: 'City Care Hospital' },
    ml: {"headline": "സൗജന്യ മെഡിക്കൽ\nക്യാമ്പ്", "subhead": "FREE MEDICAL CAMP", "body": "BP · ഷുഗർ · കണ്ണ് പരിശോധന · ഡെന്റൽ\nവിദഗ്ധ ഡോക്ടർമാരുടെ സേവനം", "offer": "100% Free", "date": "ഞായർ രാവിലെ 9 – 1", "cta": "Register Now"},
  },
  {
    key: 'hiring', label: 'We Are Hiring', group: 'Business', art: 'rays',
    images: [u('photo-1522071820081-009f0129c71c', 1200), u('photo-1552664730-d307ca884978', 1200), u('photo-1519389950473-47ba0277781c', 1200)],
    palettes: [pal('#fef9c3', '#fde047', '#1c1917', '#1c1917', '#2563eb', '#fef9c3'), pal('#1e1b4b', '#312e81', '#eef2ff', '#a3e635', '#f472b6', '#1e1b4b'), pal('#ffffff', '#f1f5f9', '#0f172a', '#ea580c', '#0ea5e9', '#ffffff')],
    fonts: [['anton', 'poppins'], ['montserrat', 'outfit'], ['archivo', 'baloo']],
    featured: ['bold', 'menu', 'split'],
    data: { headline: 'We Are Hiring', subhead: 'Join our team', body: 'Sales Executive - 2 posts\nAccountant - 1 post\nDelivery Staff - 3 posts\nShop Assistant - 2 posts', offer: 'Walk-in Interview', cta: 'Apply Now', date: 'Mon – Sat · 10 AM' },
    ml: {"headline": "ഞങ്ങൾ\nനിയമിക്കുന്നു", "subhead": "WE ARE HIRING", "body": "Sales Executive - 2\nAccountant - 1\nDelivery Staff - 3", "offer": "Walk-in Interview", "cta": "Apply Now"},
  },
  {
    key: 'interior', label: 'Interior Design', group: 'Business', art: 'rays',
    images: [u('photo-1586023492125-27b2c045efd7', 1200), u('photo-1618221195710-dd6b41faaea6', 1200), u('photo-1600210492486-724fe5c67fb0', 1200)],
    palettes: [pal('#f4efe8', '#e6dccf', '#2a2018', '#8a6a4f', '#c9a227', '#ffffff'), pal('#1f1a17', '#2b241f', '#f5ede4', '#c8a27a', '#e8d5b7', '#1f1a17'), pal('#eef2ef', '#d8e2dc', '#1f2b24', '#5f7a64', '#c9a227', '#ffffff')],
    fonts: [['cormorant', 'poppins'], ['playfair', 'outfit'], ['marcellus', 'baloo']],
    featured: ['magazine', 'split', 'card'],
    data: { headline: 'The Art of Interiors', subhead: 'Kitchen · Living · Dining · Bedroom', body: 'Residential Interiors\nOffice Space Planning\nModular Kitchen\nLandscape Design', offer: 'Free 3D Design', cta: 'Book a Visit', brand: 'Decor Studio' },
    ml: { headline: 'മനോഹരമായ\nഇന്റീരിയർ ഡിസൈൻ', subhead: 'ഇനി കാലതാമസമില്ലാതെ പൂർത്തിയാക്കാം!', body: 'Residential Interior Design\nOffice Space Planning\nModular Kitchen\nLandscape Design', offer: 'Free 3D Design', cta: 'the art of interiors' },
  },
  {
    key: 'builders', label: 'Builders & Construction', group: 'Business', art: 'rays',
    images: [u('photo-1600596542815-ffad4c1539a9', 1200), u('photo-1541888946425-d81bb19240f5', 1200), u('photo-1512917774080-9991f1c4c750', 1200)],
    palettes: [pal('#0f172a', '#1e293b', '#f8fafc', '#f59e0b', '#ef4444', '#0f172a'), pal('#fff7ed', '#fed7aa', '#1c1917', '#ea580c', '#1d4ed8', '#ffffff'), pal('#ecfeff', '#cffafe', '#083344', '#0e7490', '#f59e0b', '#ffffff')],
    fonts: [['montserrat', 'poppins'], ['oswald', 'outfit'], ['bebas', 'baloo']],
    featured: ['split', 'hero', 'magazine'],
    data: { headline: 'Build Your Dream Home', subhead: 'Plan · Build · Deliver', body: 'Architecture\nConstruction\nInterior & Exterior\nWater Proofing', offer: 'Free Plan & Elevation', cta: 'Book Now', brand: 'Kerala Builders' },
    ml: { headline: 'സ്വപ്ന ഭവനം\nഇനി യാഥാർത്ഥ്യം', subhead: 'Our Services', body: 'Architecture\nConstruction\nInterior and Exterior\nWater Proofing', offer: 'Free Plan and Elevation | Free Govt. Sanction', cta: 'Book Now', date: 'Adding value to your dreams' },
  },
  {
    key: 'sports', label: 'Sports Shop', group: 'Business', art: 'rays',
    images: [u('photo-1579952363873-27f3bade9f55', 1200), u('photo-1461896836934-ffe607ba8211', 1200), u('photo-1517649763962-0c623066013b', 1200)],
    palettes: [pal('#f1f5f9', '#e2e8f0', '#0f172a', '#dc2626', '#0f172a', '#ffffff'), pal('#052e16', '#14532d', '#f0fdf4', '#facc15', '#22c55e', '#052e16'), pal('#111827', '#1f2937', '#f9fafb', '#f97316', '#3b82f6', '#111827')],
    fonts: [['bebas', 'montserrat'], ['anton', 'poppins'], ['oswald', 'baloo']],
    featured: ['bold', 'split', 'ribbon'],
    data: { headline: 'Gear Up & Play', subhead: 'Cricket · Football · Badminton · Fitness', body: 'All sports equipment under one roof', offer: 'Up to 40% OFF', cta: 'Shop Now', brand: 'Sports Kerala' },
    ml: { headline: 'എല്ലാം ഇനി\nഒരു കുടക്കീഴിൽ', subhead: 'Cricket · Football · Badminton', body: 'ക്രിക്കറ്റ് കിറ്റുകൾ\nഫുട്ബോൾ & ജേഴ്സികൾ\nഫിറ്റ്നസ് ഉപകരണങ്ങൾ', offer: '40% വരെ കിഴിവ്', cta: 'Shop Now', contact: 'www.sportskerala.com' },
  },
  {
    key: 'printing', label: 'T-shirt & Printing', group: 'Business', art: 'rays',
    images: [u('photo-1521572163474-6864f9cf17ab', 1200), u('photo-1583743814966-8936f5b7be1a', 1200), u('photo-1576566588028-4147f3842f27', 1200)],
    palettes: [pal('#f8fafc', '#e2e8f0', '#0f172a', '#e11d48', '#0f172a', '#ffffff'), pal('#18181b', '#27272a', '#fafafa', '#facc15', '#f43f5e', '#18181b'), pal('#eff6ff', '#dbeafe', '#172554', '#2563eb', '#f97316', '#ffffff')],
    fonts: [['anton', 'poppins'], ['righteous', 'outfit'], ['bebas', 'baloo']],
    featured: ['bold', 'split', 'circle'],
    data: { headline: 'Custom T-Shirts', subhead: 'Minimum order 30 pcs', body: 'Front embroidery · Front and back print\nCollege · Office · Events', offer: '₹300 only', cta: 'Order Now', brand: 'Print Hub' },
    ml: { headline: 'T-SHIRT\nഇനി നിങ്ങൾക്കുതന്നെ\nDesign ചെയ്യാം', subhead: 'Minimum Order Quantity 30 Pcs', body: 'Including Front Embroidery / Front and Back Print', offer: 'RS 300/- ONLY', cta: 'SHOP NOW', contact: 'www.printhub.in' },
  },
  {
    key: 'dental', label: 'Dental Clinic', group: 'Business', art: 'heart',
    images: [u('photo-1606811971618-4486d14f3f99', 1200), u('photo-1629909613654-28e377c37b09', 1200), u('photo-1588776814546-1ffcf47267a5', 1200)],
    palettes: [pal('#f0fdfa', '#ccfbf1', '#134e4a', '#0d9488', '#0ea5e9', '#ffffff'), pal('#ffffff', '#e0f2fe', '#0c4a6e', '#0284c7', '#14b8a6', '#ffffff'), pal('#083344', '#155e75', '#ecfeff', '#5eead4', '#fde68a', '#083344')],
    fonts: [['montserrat', 'poppins'], ['outfit', 'manjari'], ['dmSerif', 'poppins']],
    featured: ['circle', 'split', 'card'],
    data: { headline: 'Smile with Confidence', subhead: 'Clear Aligner Treatment', body: 'Braces · Implants · Root Canal · Whitening', offer: 'Free Consultation', cta: 'Book Appointment', brand: 'Modern Dental Clinic' },
    ml: { headline: 'ഇനി എല്ലാവർക്കും\n"CLEAR" പുഞ്ചിരി', subhead: 'CLEAR ALIGNER TREATMENT', body: 'Braces · Implants · Root Canal\nവിദഗ്ധ ഡോക്ടർമാരുടെ സേവനം', offer: 'Free Check-up', cta: 'Book Appointment' },
  },
  {
    key: 'automobile', label: 'Car & Bike Showroom', group: 'Business', art: 'rays',
    images: [u('photo-1494976388531-d1058494cdd8', 1200), u('photo-1503376780353-7e6692767b70', 1200), u('photo-1533473359331-0135ef1b58bf', 1200)],
    palettes: [pal('#0a0a0a', '#171717', '#fafafa', '#ef4444', '#f59e0b', '#ffffff'), pal('#f8fafc', '#e2e8f0', '#0f172a', '#1d4ed8', '#dc2626', '#ffffff'), pal('#1c1917', '#292524', '#fafaf9', '#facc15', '#38bdf8', '#1c1917')],
    fonts: [['bebas', 'montserrat'], ['oswald', 'poppins'], ['anton', 'baloo']],
    featured: ['split', 'bold', 'magazine'],
    data: { headline: 'Drive Home Your Dream', subhead: 'New & Pre-owned Cars', body: 'Easy finance · Exchange offers · Free service', offer: 'Down payment ₹49,999', cta: 'Book Test Drive', brand: 'Kerala Motors' },
    ml: { headline: 'സ്വപ്ന വാഹനം\nഇനി സ്വന്തമാക്കാം', subhead: 'New & Pre-owned Cars', body: 'എളുപ്പത്തിൽ ലോൺ\nഎക്സ്ചേഞ്ച് ഓഫറുകൾ\nഫ്രീ സർവീസ്', offer: 'Down payment ₹49,999 മാത്രം', cta: 'Book Test Drive' },
  },
  {
    key: 'travel', label: 'Travel & Tours', group: 'Business', art: 'waves',
    images: [u('photo-1602216056096-3b40cc0c9944', 1200), u('photo-1593693397690-362cb9666fc2', 1200), u('photo-1507525428034-b723cf961d3e', 1200)],
    palettes: [pal('#ecfeff', '#a5f3fc', '#083344', '#0e7490', '#f59e0b', '#ffffff'), pal('#052e16', '#166534', '#f0fdf4', '#facc15', '#38bdf8', '#052e16'), pal('#fff7ed', '#fed7aa', '#1c1917', '#ea580c', '#0e7490', '#ffffff')],
    fonts: [['playfair', 'poppins'], ['righteous', 'outfit'], ['dmSerif', 'baloo']],
    featured: ['hero', 'frame', 'polaroid'],
    data: { headline: 'Explore Kerala', subhead: 'Houseboat · Munnar · Wayanad', body: '3 Days / 2 Nights packages\nHotel · Transport · Sightseeing', offer: 'From ₹4,999', cta: 'Book Your Trip', brand: 'Kerala Holidays' },
    ml: { headline: 'കേരളം കാണാം\nകൂടെ വരൂ', subhead: 'Houseboat · Munnar · Wayanad', body: 'ഹൗസ്ബോട്ട് പാക്കേജുകൾ\nഹിൽ സ്റ്റേഷൻ ടൂറുകൾ\nഫാമിലി & ഹണിമൂൺ പാക്കേജുകൾ', offer: '₹4,999 മുതൽ', cta: 'Book Now' },
  },
  {
    key: 'furniture', label: 'Furniture', group: 'Business', art: 'rays',
    images: [u('photo-1555041469-a586c61ea9bc', 1200), u('photo-1567538096630-e0c55bd6374c', 1200), u('photo-1524758631624-e2822e304c36', 1200)],
    palettes: [pal('#f5efe6', '#e7dccb', '#2b2118', '#a16207', '#7c2d12', '#ffffff'), pal('#1c1917', '#292524', '#fafaf9', '#d6a35c', '#f59e0b', '#1c1917'), pal('#f0fdf4', '#dcfce7', '#14532d', '#15803d', '#a16207', '#ffffff')],
    fonts: [['dmSerif', 'poppins'], ['cormorant', 'outfit'], ['montserrat', 'baloo']],
    featured: ['split', 'magazine', 'hero'],
    data: { headline: 'Comfort Meets Style', subhead: 'Sofa · Beds · Dining · Office', body: 'Teak wood furniture · Custom sizes', offer: 'Up to 35% OFF', cta: 'Visit Showroom', brand: 'Home Comfort Furniture' },
    ml: { headline: 'നിങ്ങളുടെ വീടിന്\nപുതിയ ഭംഗി', subhead: 'Sofa | Bed | Dining | Office', body: 'തേക്ക് ഫർണിച്ചർ\nകസ്റ്റം സൈസ്\nഫ്രീ ഡെലിവറി', offer: '35% വരെ കിഴിവ്', cta: 'Visit Showroom' },
  },
  // ── Events & notices ──
  {
    key: 'birthday', label: 'Birthday Wishes', group: 'Events & Notices', art: 'confetti',
    palettes: [pal('#fdf2f8', '#fbcfe8', '#500724', '#ec4899', '#8b5cf6', '#ffffff'), pal('#1e1b4b', '#312e81', '#f5f3ff', '#facc15', '#f472b6', '#1e1b4b'), pal('#ecfeff', '#cffafe', '#083344', '#0891b2', '#f97316', '#ffffff')],
    fonts: [['pacifico', 'poppins'], ['lobster', 'outfit'], ['chilanka', 'baloo']],
    featured: ['polaroid', 'circle', 'tribute'],
    data: { headline: 'Happy Birthday', subhead: 'ജന്മദിനാശംസകൾ', body: 'Wishing you a day full of love and laughter', offer: 'Ammu', date: 'Turning 5 today!', brand: 'With love, Family' },
    ml: {"headline": "ജന്മദിന\nആശംസകൾ", "subhead": "Happy Birthday", "body": "അമ്മു", "offer": "5-ാം പിറന്നാൾ", "date": "ഒക്ടോബർ 23"},
    kerala: ["adFestival", "adAchievement", "adEvent", "adPromo", "adGiantLetter", "adNews", "adProduct"] as LayoutKey[],
  },
  {
    key: 'wedding', label: 'Wedding & Save the Date', group: 'Events & Notices', art: 'heart',
    palettes: [pal('#fdfaf3', '#f5ecd7', '#3f2a14', '#b8860b', '#9f1239', '#ffffff'), pal('#4a0e17', '#350a10', '#fff1f2', '#e8b64c', '#fecdd3', '#4a0e17'), pal('#f0fdf4', '#dcfce7', '#14532d', '#ca8a04', '#be123c', '#ffffff')],
    fonts: [['greatVibes', 'cormorant'], ['cinzel', 'poppins'], ['playfair', 'manjari']],
    featured: ['kasavu', 'frame', 'polaroid'],
    data: { headline: 'Arun & Meera', subhead: 'Save the Date', body: 'Together with their families invite you to celebrate their wedding', date: 'Sunday · 12 December 2026', address: 'St. Thomas Auditorium, Kottayam', brand: '', contact: '' },
    ml: {"headline": "അരുൺ\n& മീര", "subhead": "Save the Date", "body": "വിവാഹ ചടങ്ങിലേക്ക് ഏവരെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു", "date": "2026 ഡിസംബർ 12", "address": "സെന്റ് തോമസ് ഓഡിറ്റോറിയം, കോട്ടയം"},
    kerala: ["adFestival", "adArch", "adEvent", "adGiantLetter", "adAchievement", "adProduct", "adNews", "adMap"] as LayoutKey[],
  },
  {
    key: 'congratulations', label: 'Congratulations', group: 'Events & Notices', art: 'laurel',
    palettes: [pal('#0f172a', '#1e293b', '#f8fafc', '#fbbf24', '#38bdf8', '#0f172a'), pal('#fffbeb', '#fef3c7', '#422006', '#ca8a04', '#2563eb', '#ffffff'), pal('#14532d', '#166534', '#f0fdf4', '#facc15', '#f97316', '#14532d')],
    fonts: [['baloo', 'poppins'], ['cinzel', 'outfit'], ['playfair', 'manjari']],
    featured: ['tribute', 'circle', 'card'],
    data: { headline: 'Anjali K', subhead: 'അഭിനന്ദനങ്ങൾ', offer: 'Full A+ in SSLC', body: 'Proud of your achievement!', brand: 'Friends of Ward 12', date: '2026' },
    ml: {"headline": "അഭിനന്ദനങ്ങൾ", "subhead": "Congratulations", "body": "Anjali K", "offer": "SSLC Full A+", "date": "2026"},
    kerala: ["adAchievement", "adEvent", "adFestival", "adGiantLetter", "adNews", "adMap", "adArch"] as LayoutKey[],
  },
  {
    key: 'condolence', label: 'Condolence (Aadaranjali)', group: 'Events & Notices', art: 'candle',
    palettes: [pal('#0a0a0a', '#1c1917', '#f5f5f4', '#d6d3d1', '#a8a29e', '#0a0a0a'), pal('#f8fafc', '#e2e8f0', '#0f172a', '#475569', '#94a3b8', '#ffffff'), pal('#1e1b2e', '#2a2640', '#ede9fe', '#c4b5fd', '#e9d5ff', '#1e1b2e')],
    fonts: [['notoSerifMl', 'manjari'], ['cormorant', 'baloo'], ['marcellus', 'poppins']],
    featured: ['tribute', 'card', 'frame'],
    data: { headline: 'Joseph Varghese (78)', subhead: 'ആദരാഞ്ജലികൾ', date: '1948 – 2026', body: 'Funeral service at St. George Church, 3 PM', brand: 'Deeply missed by family & friends', contact: '', address: '', offer: '' },
    ml: {"headline": "ആദരാഞ്ജലികൾ", "subhead": "ജോസഫ് വർഗീസ് (78)", "body": "സംസ്കാര ശുശ്രൂഷ സെന്റ് ജോർജ് പള്ളിയിൽ 3 മണിക്ക്", "date": "1948 – 2026"},
    kerala: ["adArch", "adAchievement", "adGiantLetter", "adNews", "adMap"] as LayoutKey[],
  },
];

/** Trending colour palettes used by the modern layouts. */
export const TREND: Palette[] = [
  pal('#0a0a0a', '#1c1c1c', '#f5f5f5', '#c6ff3d', '#8b5cf6', '#0a0a0a'), // electric lime
  pal('#ffe8dc', '#ffbe98', '#2b1b17', '#ff5e3a', '#7b61ff', '#ffffff'), // peach fuzz
  pal('#f2f2ee', '#dce3ff', '#0b0b0b', '#2f4bff', '#ff4d8d', '#ffffff'), // cobalt
  pal('#fff4d6', '#ffd84d', '#111111', '#ff5c39', '#3ddc97', '#111111'), // brutal yellow
  pal('#ede3d9', '#d9c4b0', '#2a1e17', '#a47864', '#e9b872', '#ffffff'), // mocha mousse
  pal('#1b0b2e', '#3a1260', '#ffffff', '#ff4fd8', '#45f0ff', '#1b0b2e'), // neon night
  pal('#e8fff3', '#b8f5d6', '#06261a', '#00b37a', '#ff7a59', '#ffffff'), // mint
  pal('#06121f', '#0e2a47', '#eaf6ff', '#3bd5ff', '#ffb347', '#06121f'), // ocean
  pal('#fff8f0', '#ffe1d2', '#1a1a1a', '#e63b2e', '#1f6feb', '#ffffff'), // tomato
  pal('#eee9ff', '#cfc3ff', '#1d1340', '#6d4aff', '#ff8a3d', '#ffffff'), // lavender
  pal('#f4f1ea', '#e6dfd0', '#1f1d1a', '#d1495b', '#00798c', '#ffffff'), // retro
  pal('#101418', '#1e252c', '#f1f5f9', '#ff8a00', '#00e0b8', '#101418'), // tangerine dark
];

/** Font pairs that suit each modern layout. */
const MODERN_FONTS: Record<string, FontPair[]> = {
  bento: [['bricolage', 'dmSans'], ['syne', 'interTight']],
  glass: [['sora', 'dmSans'], ['unbounded', 'interTight']],
  brutal: [['spaceGrotesk', 'spaceGrotesk'], ['archivo', 'dmSans']],
  kinetic: [['unbounded', 'interTight'], ['anton', 'dmSans']],
  swiss: [['interTight', 'interTight'], ['montserrat', 'interTight']],
  grain: [['instrument', 'dmSans'], ['fraunces', 'interTight']],
  chrome: [['syne', 'spaceGrotesk'], ['unbounded', 'sora']],
  duotone: [['anton', 'interTight'], ['delaGothic', 'dmSans']],
  stickers: [['bricolage', 'dmSans'], ['delaGothic', 'sora']],
  archMinimal: [['instrument', 'dmSans'], ['fraunces', 'interTight']],
};

/**
 * Every template: each category in every layout. Modern layouts use trending
 * palettes and fonts; classic layouts use the category's own colours.
 */
const EVENT_ADS: LayoutKey[] = ['adArch', 'adFestival', 'adAchievement'];

/**
 * Layouts left out of the gallery because they look dated next to the newer styles.
 * They stay registered so drafts that use them still open.
 */
const RETIRED = new Set<LayoutKey>(['frame', 'card', 'ribbon', 'kinetic', 'swiss', 'adMap']);
/** Kept only where they fit: price lists, and the Kerala kasavu border for Kerala festivals. */
const MENU_CATEGORIES = ['restaurant', 'bakery', 'supermarket', 'salon'];

/** English poster styles per category (by key, else by group). */
const ENGLISH_BY_KEY: Record<string, LayoutKey[]> = {
  sale: ['eSaleBurst', 'eBigType', 'eSplitDiagonal', 'eNeon', 'eProductCard'],
  'grand-opening': ['eCountdown', 'eBigType', 'eNeon', 'eLuxury', 'eSplitDiagonal'],
  restaurant: ['eGridCollage', 'eMinimalPhoto', 'eRetro', 'eNeon', 'eSplitDiagonal'],
  bakery: ['eGridCollage', 'eRetro', 'eProductCard', 'eMinimalPhoto', 'eWish'],
  textiles: ['eMagazine', 'eLuxury', 'eMinimalPhoto', 'eProductCard', 'eSplitDiagonal'],
  jewellery: ['eLuxury', 'eMagazine', 'eMinimalPhoto', 'eProductCard', 'eSplitDiagonal'],
  electronics: ['eProductCard', 'eSaleBurst', 'eNeon', 'eSplitDiagonal', 'eBigType'],
  supermarket: ['eProductCard', 'eSaleBurst', 'eGridCollage', 'eSplitDiagonal', 'eRetro'],
  furniture: ['eProductCard', 'eMinimalPhoto', 'eLuxury', 'eGridCollage', 'eSplitDiagonal'],
  salon: ['eMagazine', 'eLuxury', 'eMinimalPhoto', 'eSplitDiagonal', 'eGridCollage'],
  gym: ['eBigType', 'eNeon', 'eSplitDiagonal', 'eMagazine', 'eCountdown'],
  sports: ['eTicket', 'eBigType', 'eNeon', 'eSplitDiagonal', 'eRetro'],
  'real-estate': ['eLuxury', 'eMinimalPhoto', 'eSplitDiagonal', 'eGridCollage', 'eMagazine'],
  builders: ['eSplitDiagonal', 'eLuxury', 'eMinimalPhoto', 'eBigType', 'eGridCollage'],
  interior: ['eMinimalPhoto', 'eLuxury', 'eMagazine', 'eGridCollage', 'eSplitDiagonal'],
  travel: ['eMinimalPhoto', 'eMagazine', 'eRetro', 'eGridCollage', 'eSplitDiagonal'],
  automobile: ['eSplitDiagonal', 'eBigType', 'eNeon', 'eMinimalPhoto', 'eMagazine'],
  hiring: ['eBigType', 'eSplitDiagonal', 'eRetro', 'eGridCollage', 'eCountdown'],
  'new-year': ['eNeon', 'eCountdown', 'eWish', 'eLuxury', 'eRetro'],
  birthday: ['eWish', 'eTicket', 'eNeon', 'eRetro', 'eGridCollage'],
  wedding: ['eLuxury', 'eWish', 'eTicket', 'eMinimalPhoto'],
  congratulations: ['eWish', 'eLuxury', 'eMagazine', 'eBigType', 'eRetro'],
  condolence: ['eLuxury', 'eMinimalPhoto'],
};
const ENGLISH_BY_GROUP: Record<Category['group'], LayoutKey[]> = {
  'Kerala Festivals': ['eWish', 'eLuxury', 'eRetro', 'eMinimalPhoto', 'eNeon'],
  'Festivals & Days': ['eWish', 'eLuxury', 'eRetro', 'eNeon', 'eMinimalPhoto'],
  Business: ['eSplitDiagonal', 'eBigType', 'eGridCollage', 'eMinimalPhoto', 'eRetro'],
  'Events & Notices': ['eWish', 'eTicket', 'eLuxury', 'eMagazine'],
};

const MALAYALAM = /[\u0D00-\u0D7F]/;

/** English copy for a category: Malayalam headlines give way to the English line, other Malayalam fields are dropped. */
const englishCopy = (cat: Category): Partial<PosterData> => {
  const d: Partial<PosterData> = { ...cat.data };
  if (d.headline && MALAYALAM.test(d.headline) && d.subhead && !MALAYALAM.test(d.subhead)) [d.headline, d.subhead] = [d.subhead, ''];
  for (const k of Object.keys(d) as (keyof PosterData)[]) if (d[k] && MALAYALAM.test(d[k] as string)) d[k] = '';
  return { ...d, ...EN_EXTRA[cat.key] };
};
/** Small English touches where the source copy is Malayalam-only. */
const EN_EXTRA: Record<string, Partial<PosterData>> = {
  condolence: { subhead: 'In Loving Memory' },
  congratulations: { subhead: 'Congratulations' },
};

const ENGLISH_TEMPLATES: PosterTemplate[] = CATEGORIES.flatMap((cat, ci) => (ENGLISH_BY_KEY[cat.key] || ENGLISH_BY_GROUP[cat.group]).map((layout, i) => {
  const en = ENGLISH_LAYOUTS[layout];
  const [display, body] = en.fonts[(ci + i) % en.fonts.length];
  return {
    id: `${cat.key}-${layout}`,
    name: `${cat.label} · ${en.label}`,
    category: cat.key,
    style: { layout, palette: en.palettes[(ci + i) % en.palettes.length], display, body, art: cat.art, scale: 1 },
    data: { ...BASE, ...englishCopy(cat), image: cat.images ? cat.images[(i + 1) % cat.images.length] : '' },
  };
}));

/** Creative ads: a layout, the category it belongs to and its own copy. */
const CREATIVE: [LayoutKey, string, Partial<PosterData>][] = [
  // Photo studio
  ['cStudio', 'salon', { headline: 'സ്നേഹത്തോടെ\nനിങ്ങളുടെ\nസൗന്ദര്യം', subhead: 'Skin · Hair · Face', brand: 'Glow Aesthetic Studio', offer: 'ആദ്യ സന്ദർശനത്തിന് 20% കിഴിവ്', cta: 'Book your appointment now', address: 'Kottakkal, Malappuram' }],
  ['cStudio', 'education', { headline: 'ചുവടുവെക്കൂ\nപുതിയ\nസ്വപ്നങ്ങളിലേക്ക്', subhead: 'Aviation · Logistics', brand: 'SkyWings Academy', offer: 'Admission Open 2026', cta: 'For more details', address: 'Near Bus Stand, Perinthalmanna' }],
  ['cStudio', 'jewellery', { headline: 'ഓരോ നിമിഷവും\nതിളങ്ങട്ടെ', subhead: 'Bridal Collection', brand: 'Swarna Jewellers', offer: 'പണിക്കൂലിയിൽ 50% വരെ കിഴിവ്', cta: 'Visit our showroom', address: 'Round North, Thrissur' }],
  ['cStudio', 'textiles', { headline: 'ഈ സീസണിലെ\nപുതിയ ട്രെൻഡ്', subhead: 'Wedding · Festive · Casual', brand: 'Rangoli Silks', offer: 'Flat 30% OFF', cta: 'Shop the new collection', address: 'Mavoor Road, Kozhikode' }],
  // Product spotlight
  ['cSpotlight', 'electronics', { headline: 'ഇനി\nകണ്ടറിയാം\nകേട്ടറിയാം', body: 'LED / Smart TV, Home Theatre\nകുറഞ്ഞ വിലയിൽ സ്വന്തമാക്കാം', offer: 'EMI ലഭ്യം', brand: 'Star Mobiles', cta: 'Sales & Service', address: 'Near Town Hall, Kanjirappally' }],
  ['cSpotlight', 'electronics', { headline: 'പുതിയ ഫോൺ\nപുതിയ വേഗം', body: 'Exchange offer\nZero down payment', offer: '₹999 മുതൽ EMI', brand: 'Smart Mobiles', cta: 'Visit store today', address: 'Manjeri' }],
  ['cSpotlight', 'jewellery', { headline: 'വിവാഹ\nആഭരണങ്ങൾ', body: 'Light weight · Antique · Diamond', offer: 'Gold Rate Protection', brand: 'Swarna Jewellers', cta: 'BIS Hallmarked', address: 'Thrissur' }],
  ['cSpotlight', 'automobile', { headline: 'സ്വപ്ന വാഹനം\nഇനി സ്വന്തം', body: 'Easy finance\nExchange bonus ₹25,000 വരെ', offer: 'Test Drive', brand: 'Malabar Motors', cta: 'Book now', address: 'Kannur' }],
  // Tilted banners
  ['cTiltBanners', 'education', { headline: 'പ്ലസ് വൺ അലോട്ട്മെന്റ്\nകിട്ടിയില്ലേ?\nമികച്ച പഠനം ഇവിടെയുണ്ട്', subhead: 'A Space For Quality Education', body: 'Smart classrooms\nExperienced faculty\nHostel facility\nTransport facility', brand: 'Bright Path Academy', cta: 'Contact Us', address: 'Morayur, Malappuram' }],
  ['cTiltBanners', 'hiring', { headline: 'ജോലി തേടുകയാണോ?\nWE ARE HIRING\nഇന്ന് തന്നെ അപേക്ഷിക്കൂ', subhead: 'Walk-in Interview · Monday 10 AM', body: 'Sales Executive\nAccountant\nDelivery Staff\nStore Manager', brand: 'Fresh Mart Group', cta: 'Send your CV', address: 'Edappally, Kochi' }],
  ['cTiltBanners', 'real-estate', { headline: 'സ്വന്തം വീട്\nസ്വപ്നം\nഇനി യാഥാർഥ്യം', subhead: 'Premium Villas & Apartments', body: '2 & 3 BHK apartments\nBank loan assistance\nRERA approved\nNear city centre', brand: 'Green Nest Builders', cta: 'Book a site visit', address: 'Kakkanad, Kochi' }],
  ['cTiltBanners', 'medical', { headline: 'നിങ്ങളുടെ ആരോഗ്യം\nഞങ്ങളുടെ കരുതൽ\nസൗജന്യ മെഡിക്കൽ ക്യാമ്പ്', subhead: 'Free Medical Camp · Sunday', body: 'Diabetes check-up\nBP check-up\nEye screening\nFree medicines', brand: 'City Care Hospital', cta: 'Register now', address: 'Tirur' }],
  // Solid colour cut-out
  ['cSolidCutout', 'electronics', { headline: 'പുറത്ത് കൂൾ\nഅകത്ത്\nസൂപ്പർ കൂൾ', subhead: 'മികച്ച ഓഫറിൽ സ്മാർട്ട് AC സ്വന്തമാക്കൂ', body: 'Perinthalmanna\nNilambur\nCalicut\nManjeri', offer: 'EMI · Credit · Debit Card', brand: 'Cool Point Electronics', cta: 'Our branches', address: 'Kodathipadi, Mannarkkad' }],
  ['cSolidCutout', 'gym', { headline: 'ഫിറ്റ് ആകാം\nഇനി\nസ്റ്റൈലായി', subhead: 'Personal training · Zumba · CrossFit', offer: '3 മാസം + 1 മാസം ഫ്രീ', brand: 'Iron Fit Gym', cta: 'Join Now', address: 'Stadium Road, Palakkad' }],
  ['cSolidCutout', 'dental', { headline: 'ചിരിക്കൂ\nമനസ്സ്\nനിറഞ്ഞ്', subhead: 'Braces · Implants · Whitening', offer: 'Free consultation', brand: 'Smile Dental Clinic', cta: 'Book Appointment', address: 'KK Road, Kottayam' }],
  ['cSolidCutout', 'sale', { headline: 'മെഗാ\nഓഫർ\nസെയിൽ', subhead: 'എല്ലാ ഉൽപ്പന്നങ്ങൾക്കും വൻ വിലക്കുറവ്', offer: 'Up to 60% OFF', brand: 'Big Bazaar Kerala', cta: 'Shop Now', address: 'Chinnakada, Kollam' }],
  // Billboard
  ['cBillboard', 'travel', { headline: 'ഇങ്ങനെ നടന്നാ\nമതിയോ..?\nനാട് വിട്ടാലോ..', subhead: 'Study & work abroad', brand: 'Global Path Education', address: 'Perinthalmanna | Calicut | Vadakara' }],
  ['cBillboard', 'grand-opening', { headline: 'ഉദ്ഘാടനം\nഉടൻ', subhead: 'New showroom opening this Friday', brand: 'Home Comfort', address: 'Kottakkal' }],
  ['cBillboard', 'automobile', { headline: 'ഓരോ യാത്രയും\nസുഖകരം', subhead: 'Car service & detailing', brand: 'AutoCare Hub', address: 'Kunnummal, Malappuram' }],
  ['cBillboard', 'real-estate', { headline: 'പ്ലോട്ടുകൾ\nവിൽപ്പനയ്ക്ക്', subhead: 'Residential plots from ₹4.5 lakh/cent', brand: 'Green Nest Builders', address: 'Kakkanad, Kochi' }],
  // Speech bubble
  ['cSpeech', 'supermarket', { subhead: 'FRESH', headline: 'നാട്ടിലെ നല്ല രുചി', offer: 'ഫ്രീ ഹോം ഡെലിവറി', brand: 'Nadan Dairy', address: 'www.nadandairy.in' }],
  ['cSpeech', 'sale', { subhead: 'SALE!', headline: 'ഇത് വൻ ഓഫർ ആണ്!', offer: '50% OFF', brand: 'Fashion Hub', address: 'MG Road, Kochi' }],
  ['cSpeech', 'restaurant', { subhead: 'TASTY', headline: 'ഇത് വേറെ ലെവൽ ആണ്!', offer: 'Family Combo ₹499', brand: 'Spice Route', address: 'Beach Road, Kozhikode' }],
  ['cSpeech', 'gym', { subhead: 'STRONG', headline: 'ഇനി നമ്മൾ ഫിറ്റ്!', offer: 'First week FREE', brand: 'Iron Fit Gym', address: 'Palakkad' }],
  // Wall type
  ['cWallType', 'interior', { headline: 'ആധുനികതയുടെ\nസൗന്ദര്യം', subhead: 'Kitchen | Living | Dining | Bedroom', brand: 'Decor Studio', offer: 'the art of interiors', cta: 'decorstudio@gmail.com', address: 'Kowdiar, Trivandrum' }],
  ['cWallType', 'furniture', { headline: 'ഒത്തുചേരലുകൾ\nമനോഹരമാക്കാൻ!', subhead: 'Dining sets · Sofas · Beds', brand: 'Oak & Teak', offer: 'Up to 35% OFF', cta: 'www.oakandteak.in', address: 'Thiruvalla' }],
  ['cWallType', 'builders', { headline: 'നിങ്ങളുടെ സ്വപ്ന\nഭവനം', subhead: 'Plan · Build · Interiors', brand: 'Strong Base', offer: 'Builders & Developers', cta: 'strongbase.in', address: 'Kottayam' }],
  ['cWallType', 'textiles', { headline: 'ട്രെൻഡിന്റെ\nപുതിയ നിറം', subhead: 'Curtains · Upholstery · Linen', brand: 'Weave House', offer: 'Free measurement', cta: 'weavehouse.in', address: 'Thrissur' }],
  // Surreal sky
  ['cSurreal', 'printing', { subhead: 'മികച്ച ബ്രാൻഡിംഗ്', headline: 'തുടരും', body: 'Branding\nContent Creation\nSocial Media\nWeb Development\nVideo Production', brand: 'Northstar Creative', contact: 'www.northstar.in', address: '' }],
  ['cSurreal', 'travel', { subhead: 'ഒരുമിച്ച്', headline: 'യാത്ര പോകാം', body: 'Munnar\nWayanad\nVagamon\nAlleppey', brand: 'Kerala Holidays', address: 'Kochi' }],
  ['cSurreal', 'automobile', { subhead: 'ഓരോ വഴിയിലും', headline: 'കൂടെ', body: 'Service\nSpares\nInsurance\nFinance', brand: 'Malabar Motors', address: 'Kannur' }],
  ['cSurreal', 'real-estate', { subhead: 'ആകാശം തൊടാം', headline: 'ഉയരങ്ങളിലേക്ക്', body: 'Sky view apartments\nClub house\nInfinity pool', brand: 'Skyline Homes', address: 'Marine Drive, Kochi' }],
  // Map pins
  ['cPins', 'education', { headline: 'പഠനത്തിന്റെ\nപുതുവഴിയിലേക്ക്', offer: 'Offline tuition classes 8th to 12th', subhead: 'IRINJALAKUDA | MALA', brand: 'New Turn Tuition', address: 'Irinjalakuda | Mala' }],
  ['cPins', 'grand-opening', { headline: 'ഇനി ഞങ്ങൾ\nനിങ്ങളുടെ അടുത്ത്', offer: 'New branch now open', subhead: 'KOCHI | THRISSUR', brand: 'Fresh Mart', address: 'Kochi | Thrissur' }],
  ['cPins', 'medical', { headline: 'ഇപ്പോൾ\n2 ശാഖകളിൽ', offer: '24x7 Pharmacy & Lab', subhead: 'TIRUR | KUTTIPPURAM', brand: 'City Care Clinic', address: 'Tirur | Kuttippuram' }],
  ['cPins', 'bakery', { headline: 'മധുരം\nഎല്ലായിടത്തും', offer: 'Free delivery within 5 km', subhead: 'KOTTAYAM | PALA', brand: 'Sweet Spot Bakery', address: 'Kottayam | Pala' }],
  // Caricature pop
  ['cCaricature', 'printing', { subhead: 'നിങ്ങളുടെ', headline: 'കണ്ടന്റിനെ\nഞങ്ങൾ മികച്ചതാക്കി തരും', cta: "We'll make your CONTENT the best!", body: 'Posters, Logos, Caricature\nBranding, Digital Marketing\nVideo Production, Website', brand: 'A to Z Creatives' }],
  ['cCaricature', 'gym', { subhead: 'ഇനി', headline: 'ഫിറ്റ്നസ്\nനിങ്ങളുടെ കൈയിൽ', cta: 'Join Today', body: 'Weight loss, Muscle gain\nPersonal training', brand: 'Iron Fit Gym' }],
  ['cCaricature', 'birthday', { subhead: 'ഹാപ്പി', headline: 'ബർത്ത്ഡേ\nഡിയർ റാഫി', cta: 'Happy Birthday!', body: 'Wishing you a fabulous year ahead', brand: 'From: Gang 2008', contact: '' }],
  ['cCaricature', 'hiring', { subhead: 'ഞങ്ങൾക്ക് വേണം', headline: 'ഡിസൈനർമാരെ\nഉടൻ ആവശ്യമുണ്ട്', cta: 'Apply Now', body: 'Graphic Designer\nVideo Editor\nSocial Media Executive', brand: 'Pixel Studio' }],
  // Minimal product
  ['cMinimalProduct', 'bakery', { headline: 'അളന്ന്\nകഴിക്കാതെ\nആസ്വദിച്ചു\nകഴിക്കാം', offer: 'Sugar free range', brand: 'Lite Bakes', address: 'litebakes.in' }],
  ['cMinimalProduct', 'jewellery', { headline: 'ഒരു\nതിളക്കം\nമതി', offer: 'Daily wear collection', brand: 'Swarna Jewellers', address: 'swarnajewels.in' }],
  ['cMinimalProduct', 'restaurant', { headline: 'ഒരു കപ്പ്\nചായ\nഒരു കഥ', offer: 'Evening snacks ₹49 മുതൽ', brand: 'Chai Point Cafe', address: 'Fort Kochi' }],
  ['cMinimalProduct', 'salon', { headline: 'നിങ്ങളുടെ\nചർമ്മം\nനിങ്ങളുടെ\nഅഭിമാനം', offer: 'Natural skin care range', brand: 'Glow Naturals', address: 'glownaturals.in' }],
  // Dark promo
  ['cDarkPromo', 'supermarket', { subhead: 'Fresh & healthy', headline: 'GROCERY\nഫ്രീ ഹോം ഡെലിവറി', cta: 'Fresh vegetables & fruits every day', offer: '30% DISCOUNT', brand: 'Fresh Mart' }],
  ['cDarkPromo', 'restaurant', { subhead: 'Delicious', headline: 'BIRIYANI\nFESTIVAL', cta: 'Malabar · Thalassery · Hyderabadi', offer: 'Buy 1 Get 1', brand: 'Spice Route' }],
  ['cDarkPromo', 'bakery', { subhead: 'Freshly baked', headline: 'CAKES\nORDER NOW', cta: 'Birthday · Wedding · Custom designs', offer: '20% OFF', brand: 'Sweet Spot Bakery' }],
  ['cDarkPromo', 'sale', { subhead: 'Black Friday', headline: 'MEGA SALE', cta: 'Electronics · Fashion · Home', offer: '70% OFF', brand: 'Big Bazaar Kerala' }],
  // Festive mascot
  ['cFestiveMascot', 'onam', { subhead: 'Happy', headline: 'Onam', body: 'From tradition to trend, wishing you a vibrant Onam!', brand: 'Tile World', cta: '@tileworld_kannur', address: 'Kakkad Road, Kannur' }],
  ['cFestiveMascot', 'vishu', { subhead: 'Happy', headline: 'Vishu', body: 'ഐശ്വര്യവും സമൃദ്ധിയും നിറഞ്ഞ വിഷു ആശംസകൾ', brand: 'Rangoli Silks', cta: '@rangolisilks', address: 'Kozhikode' }],
  ['cFestiveMascot', 'christmas', { subhead: 'Merry', headline: 'Christmas', body: 'Joy, peace and love to you and your family', brand: 'Sweet Spot Bakery', cta: '@sweetspot', address: 'Kottayam' }],
  ['cFestiveMascot', 'eid', { subhead: 'Eid', headline: 'Mubarak', body: 'ഏവർക്കും ഹൃദയം നിറഞ്ഞ ഈദ് ആശംസകൾ', brand: 'Malabar Textiles', cta: '@malabartextiles', address: 'Malappuram' }],
  ['cFestiveMascot', 'new-year', { subhead: 'Happy', headline: 'New Year 2027', body: 'Thank you for being with us all year', brand: 'Smart Mobiles', cta: '@smartmobiles', address: 'Manjeri' }],
  // Golden bloom
  ['cBloom', 'printing', { headline: 'പൂക്കാത്ത\nBRAND\nഇനി പൂക്കും', subhead: 'Advertising Agency', body: 'Branding\nPackaging\nPosters\nVideo Editing\nDigital Marketing', brand: 'Bloom Ads' }],
  ['cBloom', 'vishu', { headline: 'കണിക്കൊന്ന\nപൂത്തു', subhead: 'Vishu offers are here', offer: 'വിഷു ഓഫർ 25% കിഴിവ്', brand: 'Rangoli Silks' }],
  ['cBloom', 'grand-opening', { headline: 'ഇനി\nനിങ്ങളുടെ\nനഗരത്തിൽ', subhead: 'Grand opening · 1 November', offer: 'Opening day offers', brand: 'Fresh Mart' }],
  ['cBloom', 'wedding', { headline: 'ഒരുമിച്ച്\nഎന്നെന്നും', subhead: 'Anu weds Arun · 12 December', offer: 'Save the date', brand: 'With love', contact: '' }],
  // Event banner
  ['cEventBanner', 'temple-utsavam', { brand: 'Sree Krishna Temple Committee', cta: 'Annual Festival', headline: 'ഉത്സവം\n2026', subhead: 'ക്ഷേത്ര മഹോത്സവം', date: '2026\nഏപ്രിൽ\n06', body: 'Chenda melam\nAana ezhunnallippu\nKathakali', offer: 'വിവരങ്ങൾക്ക്' }],
  ['cEventBanner', 'education', { brand: 'Youth Club Mukkada', cta: 'St. Thomas Parish Hall', headline: 'മഹാ\nക്വിസ്', subhead: 'ക്വിസ് മത്സരം', date: '2026\nഒക്ടോബർ\n06', body: 'Sunday 1.30 PM\nLast date to register: Oct 2', offer: 'കൂടുതൽ വിവരങ്ങൾക്ക്' }],
  ['cEventBanner', 'sports', { brand: 'Friends Arts & Sports Club', cta: 'All Kerala', headline: 'ഫുട്ബോൾ\nടൂർണമെന്റ്', subhead: 'Sevens Football', date: 'May\n15 - 20', body: 'Prize money ₹1,00,000\nFlood light matches', offer: 'Team registration' }],
  ['cEventBanner', 'kerala-piravi', { brand: 'Govt. HSS Kondotty', cta: 'Malayala Dinam', headline: 'കേരളപ്പിറവി\nആഘോഷം', subhead: 'കലാപരിപാടികൾ', date: 'നവംബർ\n01', body: 'Thiruvathira\nOppana\nSpeech competition', offer: 'എല്ലാവർക്കും സ്വാഗതം' }],
];

const CREATIVE_TEMPLATES: PosterTemplate[] = CREATIVE.map(([layout, catKey, copy], i) => {
  const cat = CATEGORIES.find(c => c.key === catKey)!;
  const ad = CREATIVE_LAYOUTS[layout];
  const [display, body] = ad.fonts[i % ad.fonts.length];
  return {
    id: `${catKey}-${layout}-${i}`,
    name: `${cat.label} · ${ad.label}`,
    category: catKey,
    style: { layout, palette: ad.palettes[i % ad.palettes.length], display, body, art: cat.art, scale: 1 },
    data: { ...BASE, ...copy, image: cat.images ? cat.images[i % cat.images.length] : '' },
  };
});

/** More creative ad styles, each paired with the categories it suits; copy comes from the category's Malayalam text. */
const CREATIVE_EXTRA: Partial<Record<LayoutKey, string[]>> = {
  cPolaroid: ['bakery', 'restaurant', 'travel', 'birthday', 'wedding', 'textiles', 'salon', 'sports', 'interior', 'grand-opening', 'gym', 'education', 'christmas', 'new-year'],
  cCircleHero: ['salon', 'dental', 'gym', 'medical', 'jewellery', 'electronics', 'supermarket', 'restaurant', 'bakery', 'onam', 'vishu', 'eid', 'diwali', 'congratulations'],
  cGlassCard: ['electronics', 'education', 'hiring', 'real-estate', 'builders', 'travel', 'automobile', 'gym', 'printing', 'sale', 'new-year', 'independence', 'grand-opening', 'sports'],
  cComic: ['sale', 'grand-opening', 'restaurant', 'bakery', 'electronics', 'supermarket', 'printing', 'gym', 'sports', 'birthday', 'hiring', 'education', 'textiles', 'automobile'],
  cPhone: ['restaurant', 'supermarket', 'bakery', 'electronics', 'textiles', 'education', 'printing', 'hiring', 'travel', 'salon', 'jewellery', 'furniture', 'sale', 'medical'],
  cArchWindow: ['interior', 'real-estate', 'builders', 'furniture', 'jewellery', 'salon', 'wedding', 'textiles', 'condolence', 'temple-utsavam', 'easter', 'ramadan', 'eid', 'christmas'],
  cStripeBold: ['sale', 'builders', 'automobile', 'electronics', 'hiring', 'grand-opening', 'supermarket', 'printing', 'sports', 'gym', 'furniture', 'real-estate', 'education', 'independence'],
  cTornPaper: ['restaurant', 'travel', 'bakery', 'education', 'real-estate', 'sports', 'medical', 'dental', 'interior', 'onam', 'kerala-piravi', 'vishu', 'birthday', 'congratulations'],
  cBrushReveal: ['salon', 'textiles', 'jewellery', 'gym', 'sports', 'travel', 'restaurant', 'printing', 'interior', 'automobile', 'onam', 'diwali', 'wedding', 'birthday'],
  cWaves: ['travel', 'medical', 'dental', 'education', 'supermarket', 'real-estate', 'kerala-piravi', 'independence', 'ramadan', 'easter', 'christmas', 'new-year', 'hiring', 'builders'],
  cGoldFrame: ['onam', 'vishu', 'temple-utsavam', 'diwali', 'eid', 'ramadan', 'christmas', 'easter', 'wedding', 'condolence', 'congratulations', 'jewellery', 'textiles', 'kerala-piravi'],
  cSplitBanner: ['restaurant', 'gym', 'real-estate', 'builders', 'automobile', 'electronics', 'furniture', 'education', 'medical', 'salon', 'sale', 'grand-opening', 'travel', 'interior'],
  cStickerPop: ['birthday', 'bakery', 'sale', 'textiles', 'education', 'supermarket', 'printing', 'salon', 'restaurant', 'grand-opening', 'new-year', 'christmas', 'sports', 'gym'],
  cDuoCircle: ['salon', 'dental', 'gym', 'medical', 'interior', 'builders', 'automobile', 'furniture', 'education', 'real-estate', 'wedding', 'congratulations', 'sports', 'printing'],
  cCalendar: ['grand-opening', 'sale', 'temple-utsavam', 'onam', 'vishu', 'christmas', 'eid', 'new-year', 'independence', 'birthday', 'wedding', 'education', 'sports', 'medical'],
  cMosaic: ['restaurant', 'bakery', 'supermarket', 'textiles', 'salon', 'gym', 'travel', 'interior', 'furniture', 'education', 'onam', 'christmas', 'birthday', 'wedding'],
};

const CREATIVE_EXTRA_TEMPLATES: PosterTemplate[] = (Object.entries(CREATIVE_EXTRA) as [LayoutKey, string[]][]).flatMap(([layout, keys], li) => keys.map((catKey, i) => {
  const cat = CATEGORIES.find(c => c.key === catKey)!;
  const ad = CREATIVE_LAYOUTS[layout];
  const [display, body] = ad.fonts[(li + i) % ad.fonts.length];
  return {
    id: `${catKey}-${layout}`,
    name: `${cat.label} · ${ad.label}`,
    category: catKey,
    style: { layout, palette: ad.palettes[(li + i) % ad.palettes.length], display, body, art: cat.art, scale: 1 },
    data: { ...BASE, ...cat.data, ...cat.ml, image: cat.images ? cat.images[(li + i) % cat.images.length] : '' },
  };
}));

export const POSTER_TEMPLATES: PosterTemplate[] = [...CREATIVE_TEMPLATES, ...CREATIVE_EXTRA_TEMPLATES, ...ENGLISH_TEMPLATES, ...CATEGORIES.flatMap((cat, ci) => {
  const keys = (Object.keys(LAYOUTS) as LayoutKey[]).filter(k => !RETIRED.has(k)
    && (k !== 'menu' || MENU_CATEGORIES.includes(cat.key))
    && (k !== 'kasavu' || cat.group === 'Kerala Festivals'));
  // Ad layouts are for business categories; event-style ones (arch, festival, winner) are left out
  const kerala = cat.group === 'Business' ? keys.filter(k => k in KERALA_LAYOUTS && (cat.kerala ? cat.kerala.includes(k) : !EVENT_ADS.includes(k))) : [];
  const modern = keys.filter(k => LAYOUTS[k].family === 'modern');
  const classic = keys.filter(k => LAYOUTS[k].family === 'classic');
  const featured = cat.featured.filter(l => classic.includes(l));
  const classicOrder = [...featured, ...classic.filter(l => !featured.includes(l))];

  const make = (layout: LayoutKey, i: number, palette: Palette, [display, body]: FontPair, copy: Partial<PosterData> = cat.data): PosterTemplate => ({
    id: `${cat.key}-${layout}`,
    name: `${cat.label} · ${LAYOUTS[layout].label}`,
    category: cat.key,
    style: { layout, palette, display, body, art: cat.art, scale: 1 },
    data: { ...BASE, ...copy, image: cat.images ? cat.images[i % cat.images.length] : '' },
  });

  return [
    ...kerala.map((layout, i) => {
      const k = KERALA_LAYOUTS[layout];
      return make(layout, i, k.palettes[(ci + i) % k.palettes.length], k.fonts[ci % k.fonts.length], { ...cat.data, ...cat.ml });
    }),
    ...modern.map((layout, i) => make(layout, i, TREND[(ci * 5 + i) % TREND.length], MODERN_FONTS[layout][ci % 2])),
    ...classicOrder.map((layout, i) => make(layout, i, cat.palettes[i % cat.palettes.length], cat.fonts[i % cat.fonts.length])),
  ];
})];

export const CATEGORY_GROUPS = ['Kerala Festivals', 'Festivals & Days', 'Business', 'Events & Notices'] as const;
