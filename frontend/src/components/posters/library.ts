import type { IconKey, PosterElement, ShapeKey } from './types';

/** SVG paths (viewBox 0 0 100 100) for shapes. */
export const SHAPES: Record<ShapeKey, string> = {
  rect: 'M0 0H100V100H0Z',
  rounded: 'M14 0H86Q100 0 100 14V86Q100 100 86 100H14Q0 100 0 86V14Q0 0 14 0Z',
  circle: 'M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z',
  star: 'M50 0L61 35H98L68 57L79 92L50 70L21 92L32 57L2 35H39Z',
  burst: Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 40 : 50;
    return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join('') + 'Z',
  ribbon: 'M0 0H100L90 50L100 100H0L10 50Z',
  arrow: 'M0 38H68V12L100 50L68 88V62H0Z',
  line: 'M0 40H100V60H0Z',
  blob: 'M78 12C94 24 102 48 92 70C82 92 56 102 34 94C12 86 -2 64 2 42C6 20 24 4 46 2C58 1 68 4 78 12Z',
  heart: 'M50 92C20 70 0 52 0 30C0 12 14 0 30 0C40 0 47 6 50 12C53 6 60 0 70 0C86 0 100 12 100 30C100 52 80 70 50 92Z',
  triangle: 'M50 0L100 100H0Z',
  bubble: 'M12 0H88Q100 0 100 12V64Q100 76 88 76H40L18 100L22 76H12Q0 76 0 64V12Q0 0 12 0Z',
  hexagon: 'M25 0H75L100 50L75 100H25L0 50Z',
  seal: Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2, r = i % 2 ? 45 : 50;
    return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join('') + 'Z',
  wave: 'M0 20Q25 0 50 20T100 20V80Q75 100 50 80T0 80Z',
  tag: 'M0 0H72L100 50L72 100H0Z M80 42A8 8 0 1 0 80 58A8 8 0 1 0 80 42Z',
  splash: 'M2 40C10 20 40 28 60 22C78 16 96 20 98 34C100 50 92 60 96 74C88 86 60 76 40 82C20 88 4 80 6 64C8 52 0 50 2 40Z',
  pill: 'M20 0H80C91 0 100 22 100 50C100 78 91 100 80 100H20C9 100 0 78 0 50C0 22 9 0 20 0Z',
  ring: 'M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z M50 10A40 40 0 1 0 50 90A40 40 0 1 0 50 10Z',
  diamond: 'M50 0L100 50L50 100L0 50Z',
  cloud: 'M25 90C10 90 0 78 0 64C0 50 10 40 23 40C25 20 38 6 55 6C72 6 85 20 87 38C95 41 100 51 100 62C100 77 89 90 75 90Z',
  leaf: 'M5 95C5 40 40 5 95 5C95 60 60 95 5 95Z',
  shield: 'M50 0L95 15V45C95 72 75 90 50 100C25 90 5 72 5 45V15Z',
  chevron: 'M0 0H85L100 50L85 100H0L15 50Z',
  sparkle: 'M50 0C54 36 64 46 100 50C64 54 54 64 50 100C46 64 36 54 0 50C36 46 46 36 50 0Z',
  frame: 'M0 0H100V100H0Z M4 4V96H96V4Z',
};

/** SVG paths (viewBox 0 0 24 24) for icons. */
export const ICONS: Record<IconKey, string> = {
  phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z',
  whatsapp: 'M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z',
  location: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  mail: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.5L4 7.3V17h16V7.3z M4.4 7h15.2L12 11.7z',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.4 3.5 2.1-.8 1.3L11 13V7h2z',
  star: 'M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5 9 8.9z',
  check: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5-4.2-4.2 1.4-1.4 2.8 2.8 5.8-5.8 1.4 1.4z',
  heart: 'M12 21s-8-5.3-8-11.3A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8 3.3C20 15.7 12 21 12 21z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
  facebook: 'M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z',
  youtube: 'M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3z',
  cart: 'M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5.2 4H2V2h4.6l.9 2H21l-3.4 8.4a2 2 0 0 1-1.9 1.3H8.1l-.9 1.6V16H19v2H5v-2.7L6.6 12z',
  gift: 'M20 7h-2.2A3 3 0 0 0 12 4.4 3 3 0 0 0 6.2 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM15 6a1 1 0 1 1 0 2h-2a2 2 0 0 1 2-2zM9 6a2 2 0 0 1 2 2H9a1 1 0 1 1 0-2zm2 14H6v-8h5zm0-10H5V9h6zm7 10h-5v-8h5zm1-10h-6V9h6z',
  truck: 'M3 5h11v9h1.2a3 3 0 0 1 5.6 0H22v-4l-3-4h-4V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h.2a3 3 0 0 1 5.6 0H13V6H3zm3 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  tag: 'M21.4 11.6 12.4 2.6A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8zM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8z',
  percent: 'M5.4 19.6 18.6 4.4l1.5 1.3L6.9 20.9zM7 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 8a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  bolt: 'M13 2 4 14h7l-2 8 9-12h-7z',
  fire: 'M12 2c.6 3.6 5.5 6 5.5 11.5a5.5 5.5 0 0 1-11 0c0-2.6 1.3-4.3 2.6-5.6.2 1.6.9 2.8 2 3.4-.4-3.6.1-6.6.9-9.3z',
  calendar: 'M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2zM5 9v11h14V9z',
  trophy: 'M7 3h10v2h4v3a4 4 0 0 1-4 4h-.4A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 7.4 12H7a4 4 0 0 1-4-4V5h4zm-2 4v1a2 2 0 0 0 2 2V7zm12 0v3a2 2 0 0 0 2-2V7z',
  quote: 'M4 18h5l2-5V6H4v7h3zm9 0h5l2-5V6h-7v7h3z',
};

let seq = 0;
const base = (): Omit<PosterElement, 'kind'> => ({
  id: `el-${Date.now().toString(36)}-${seq++}`, x: 50, y: 50, w: 40, rotation: 0, opacity: 1, color: '#ffffff', bg: '', aspect: 1, radius: 0,
  text: '', font: 'anekMl', size: 60, weight: 800, align: 'center', effect: 'none', stroke: '#000000',
});

type Preset = { label: string; make: () => PosterElement };

const text = (label: string, o: Partial<PosterElement>): Preset => ({ label, make: () => ({ ...base(), kind: 'text', ...o }) });
const shape = (label: string, shapeKey: ShapeKey, o: Partial<PosterElement> = {}): Preset => ({ label, make: () => ({ ...base(), kind: 'shape', shape: shapeKey, color: '#f97316', w: 26, ...o }) });
const icon = (iconKey: IconKey, o: Partial<PosterElement> = {}): Preset => ({ label: iconKey, make: () => ({ ...base(), kind: 'icon', icon: iconKey, color: '#ffffff', bg: '#16a34a', w: 9, ...o }) });

export const ELEMENT_LIBRARY: { title: string; items: Preset[] }[] = [
  {
    title: 'Headings',
    items: [
      text('Heading', { text: 'Add a heading', size: 90, w: 70, color: '#ffffff', effect: 'shadow', stroke: '#00000088' }),
      text('Gradient title', { text: 'MEGA OFFER', size: 110, w: 76, font: 'anton', weight: 400, color: '#facc15', effect: 'gradient', stroke: '#f97316' }),
      text('3D title', { text: 'BIG SALE', size: 110, w: 70, font: 'archivo', weight: 400, color: '#ffffff', effect: '3d', stroke: '#b91c1c' }),
      text('Neon glow', { text: 'Open Now', size: 90, w: 64, font: 'righteous', weight: 400, color: '#ffffff', effect: 'glow', stroke: '#ec4899' }),
      text('Outline title', { text: 'NEW ARRIVALS', size: 84, w: 76, font: 'bebas', weight: 400, color: '#ffffff', effect: 'outline', stroke: '#111111' }),
      text('Script', { text: 'Special Offer', size: 70, w: 56, font: 'greatVibes', weight: 400, color: '#fde68a', effect: 'shadow', stroke: '#00000099' }),
      text('Modern grotesk', { text: 'Make it bold.', size: 80, w: 70, font: 'bricolage', weight: 800, color: '#ffffff' }),
      text('Editorial serif', { text: 'The Collection', size: 80, w: 70, font: 'instrument', weight: 400, color: '#ffffff', effect: 'shadow', stroke: '#00000066' }),
    ],
  },
  {
    title: 'Malayalam',
    items: [
      text('Outlined title', { text: 'പുതിയ ഓഫർ', size: 110, w: 70, color: '#ffffff', effect: 'outline', stroke: '#b91c1c' }),
      text('Gradient title', { text: 'ഓണാശംസകൾ', size: 96, w: 80, font: 'notoSansMl', color: '#fde047', effect: 'gradient', stroke: '#ea580c' }),
      text('3D title', { text: 'സ്വാഗതം', size: 120, w: 64, font: 'anekMl', color: '#ffffff', effect: '3d', stroke: '#1d4ed8' }),
      text('Glow title', { text: 'ഉടൻ വരുന്നു', size: 96, w: 72, font: 'baloo', color: '#ffffff', effect: 'glow', stroke: '#22d3ee' }),
      text('Highlight bar', { text: 'ഇന്ന് മാത്രം', size: 54, w: 50, bg: '#111111', color: '#facc15' }),
      text('Hand-written', { text: 'സ്നേഹപൂർവ്വം', size: 80, w: 60, font: 'chilanka', weight: 400, color: '#ffffff', effect: 'shadow', stroke: '#00000088' }),
      text('Inauguration', { text: 'ഉദ്ഘാടനം', size: 110, w: 64, font: 'notoSerifMl', color: '#fde68a', effect: 'outline', stroke: '#7c2d12' }),
      text('Malayalam pill', { text: 'ഇപ്പോൾ ബുക്ക് ചെയ്യൂ', size: 40, w: 56, bg: '#dc2626', color: '#ffffff', radius: 999 }),
    ],
  },
  {
    title: 'Body text',
    items: [
      text('Subheading', { text: 'Add a subheading', size: 48, w: 60, weight: 700, font: 'poppins' }),
      text('Body text', { text: 'Add some details here', size: 30, w: 50, weight: 500, font: 'poppins' }),
      text('Spaced label', { text: 'L I M I T E D   E D I T I O N', size: 26, w: 60, weight: 700, font: 'montserrat' }),
      text('Quote', { text: '“Best service in town”', icon: 'quote', size: 36, w: 60, weight: 600, font: 'fraunces', bg: '#ffffff', color: '#111111', radius: 20 }),
      text('Bullet list', { text: '✓ Free delivery\n✓ Best price\n✓ Easy EMI', size: 36, w: 46, weight: 700, font: 'poppins', align: 'left' }),
      text('Terms', { text: '*Terms and conditions apply', size: 20, w: 46, weight: 500, font: 'poppins', opacity: 0.8 }),
    ],
  },
  {
    title: 'Offers & prices',
    items: [
      text('Price tag', { text: '₹999 only', size: 56, w: 34, bg: '#dc2626', color: '#ffffff', radius: 14, rotation: -4 }),
      shape('50% OFF burst', 'burst', { color: '#dc2626', text: '50%\nOFF', bg: '#ffffff', size: 64, font: 'anton', weight: 400, w: 24 }),
      shape('Seal badge', 'seal', { color: '#facc15', text: 'BEST\nPRICE', bg: '#111111', size: 44, font: 'anton', weight: 400, w: 22 }),
      shape('Swing tag', 'tag', { color: '#16a34a', text: '₹499', bg: '#ffffff', size: 60, font: 'anton', weight: 400, aspect: 0.5, w: 30, rotation: -10 }),
      shape('Brush SALE', 'splash', { color: '#e11d48', text: 'SALE', bg: '#ffffff', size: 80, font: 'anton', weight: 400, aspect: 0.55, w: 40, rotation: -6 }),
      shape('Buy 1 Get 1', 'hexagon', { color: '#7c3aed', text: 'BUY 1\nGET 1', bg: '#ffffff', size: 44, font: 'anton', weight: 400, aspect: 0.88, w: 24 }),
      shape('Flat chevron', 'chevron', { color: '#0ea5e9', text: 'FLAT 30% OFF', bg: '#ffffff', size: 40, font: 'montserrat', aspect: 0.24, w: 50 }),
      text('Limited time', { text: 'LIMITED TIME', icon: 'clock', size: 36, w: 44, bg: '#111111', color: '#facc15', radius: 999, font: 'montserrat' }),
      text('Old / new price', { text: '₹1,499  ➜  ₹999', size: 52, w: 56, color: '#facc15', font: 'anton', weight: 400, effect: 'shadow', stroke: '#00000099' }),
      text('Percent pill', { text: 'Up to 70% OFF', icon: 'percent', size: 40, w: 50, bg: '#f97316', color: '#ffffff', radius: 999, font: 'poppins' }),
    ],
  },
  {
    title: 'Badges & stickers',
    items: [
      shape('NEW ribbon', 'ribbon', { color: '#facc15', text: 'NEW ARRIVAL', bg: '#111111', size: 40, font: 'montserrat', aspect: 0.22, w: 46, rotation: -6 }),
      shape('Offer circle', 'circle', { color: '#16a34a', text: 'ഓഫർ', bg: '#ffffff', size: 70, w: 22 }),
      shape('Star badge', 'star', { color: '#facc15', text: 'BEST', bg: '#7c2d12', size: 40, font: 'anton', weight: 400, w: 22 }),
      shape('Speech bubble', 'bubble', { color: '#ffffff', text: 'Hurry up!', bg: '#111111', size: 44, font: 'poppins', aspect: 0.7, w: 36 }),
      shape('Trusted shield', 'shield', { color: '#1d4ed8', text: '100%\nTRUSTED', bg: '#ffffff', size: 34, font: 'montserrat', aspect: 1.1, w: 20 }),
      shape('Cloud bubble', 'cloud', { color: '#ffffff', text: 'Wow!', bg: '#ec4899', size: 60, font: 'righteous', weight: 400, aspect: 0.75, w: 30 }),
      text('Rating', { text: '★★★★★  4.9', size: 44, w: 40, color: '#facc15', font: 'poppins', effect: 'shadow', stroke: '#00000088' }),
      text('Hot deal', { text: 'HOT DEAL', icon: 'fire', size: 40, w: 38, bg: '#dc2626', color: '#ffffff', radius: 12, font: 'montserrat', rotation: 4 }),
      text('Winner', { text: 'No.1 in Kerala', icon: 'trophy', size: 38, w: 48, bg: '#facc15', color: '#111111', radius: 999, font: 'poppins' }),
      shape('Seal "Since"', 'seal', { color: '#111111', text: 'SINCE\n1998', bg: '#facc15', size: 38, font: 'cinzel', weight: 700, w: 20 }),
    ],
  },
  {
    title: 'Contact & social',
    items: [
      text('Call pill', { text: '+91 98765 43210', icon: 'phone', size: 40, w: 52, bg: '#ffffff', color: '#111111', radius: 999, font: 'poppins' }),
      text('WhatsApp pill', { text: 'Order on WhatsApp', icon: 'whatsapp', size: 38, w: 56, bg: '#16a34a', color: '#ffffff', radius: 999, font: 'poppins' }),
      text('Location pill', { text: 'MG Road, Kochi', icon: 'location', size: 36, w: 46, bg: '#111111', color: '#ffffff', radius: 999, font: 'poppins' }),
      text('Website', { text: 'www.yourbrand.in', icon: 'globe', size: 34, w: 46, color: '#ffffff', font: 'poppins' }),
      text('Instagram', { text: '@yourbrand', icon: 'instagram', size: 36, w: 40, bg: '#db2777', color: '#ffffff', radius: 999, font: 'poppins' }),
      text('Facebook', { text: '/yourbrand', icon: 'facebook', size: 36, w: 40, bg: '#2563eb', color: '#ffffff', radius: 999, font: 'poppins' }),
      text('Email', { text: 'hello@yourbrand.in', icon: 'mail', size: 32, w: 50, bg: '#ffffff', color: '#111111', radius: 12, font: 'poppins' }),
      text('Timing', { text: '9 AM – 9 PM', icon: 'clock', size: 36, w: 40, bg: '#111111', color: '#ffffff', radius: 12, font: 'poppins' }),
      text('Date', { text: '15 August 2026', icon: 'calendar', size: 36, w: 46, bg: '#ffffff', color: '#111111', radius: 12, font: 'poppins' }),
      text('Free delivery', { text: 'Free Delivery', icon: 'truck', size: 38, w: 44, bg: '#f97316', color: '#ffffff', radius: 14, font: 'poppins' }),
    ],
  },
  {
    title: 'Buttons & banners',
    items: [
      text('Button', { text: 'SHOP NOW', size: 40, w: 34, bg: '#111111', color: '#ffffff', radius: 999, font: 'montserrat' }),
      shape('Pill button', 'pill', { color: '#facc15', text: 'BOOK NOW', bg: '#111111', size: 40, font: 'montserrat', aspect: 0.28, w: 36 }),
      text('Action button', { text: 'Call Now', icon: 'bolt', size: 40, w: 34, bg: '#dc2626', color: '#ffffff', radius: 14, font: 'poppins' }),
      shape('Wave banner', 'wave', { color: '#0ea5e9', text: 'GRAND OPENING', bg: '#ffffff', size: 42, font: 'anton', weight: 400, aspect: 0.3, w: 60 }),
      shape('Chevron banner', 'chevron', { color: '#111111', text: 'ADMISSION OPEN', bg: '#facc15', size: 40, font: 'montserrat', aspect: 0.2, w: 60 }),
      shape('Brush banner', 'splash', { color: '#facc15', text: 'ഇന്ന് മുതൽ', bg: '#111111', size: 52, aspect: 0.4, w: 50 }),
      shape('Full-width bar', 'rect', { color: '#111111', text: 'For more details: +91 98765 43210', bg: '#ffffff', size: 32, font: 'poppins', aspect: 0.1, w: 100 }),
    ],
  },
  {
    title: 'Shapes',
    items: [
      shape('Square', 'rect'), shape('Rounded', 'rounded'), shape('Circle', 'circle'), shape('Pill', 'pill', { aspect: 0.4, w: 36 }),
      shape('Star', 'star', { color: '#facc15' }), shape('Sparkle', 'sparkle', { color: '#fde68a', w: 16 }), shape('Burst', 'burst', { color: '#dc2626' }), shape('Seal', 'seal', { color: '#16a34a' }),
      shape('Hexagon', 'hexagon', { color: '#7c3aed', aspect: 0.88 }), shape('Diamond', 'diamond', { color: '#0ea5e9' }), shape('Triangle', 'triangle', { color: '#0ea5e9' }), shape('Heart', 'heart', { color: '#e11d48' }),
      shape('Blob', 'blob', { color: '#a855f7', w: 40 }), shape('Cloud', 'cloud', { color: '#ffffff', aspect: 0.75 }), shape('Leaf', 'leaf', { color: '#16a34a' }), shape('Shield', 'shield', { color: '#1d4ed8', aspect: 1.1 }),
      shape('Ribbon', 'ribbon', { aspect: 0.25, w: 44 }), shape('Chevron', 'chevron', { aspect: 0.3, w: 40 }), shape('Arrow', 'arrow', { aspect: 0.5 }), shape('Bubble', 'bubble', { color: '#ffffff', aspect: 0.7 }),
    ],
  },
  {
    title: 'Decor & frames',
    items: [
      shape('Line', 'line', { aspect: 0.05, w: 50, color: '#ffffff' }),
      shape('Thin divider', 'rect', { aspect: 0.008, w: 60, color: '#ffffff', opacity: 0.8 }),
      shape('Ring frame', 'ring', { color: '#facc15', w: 40 }),
      shape('Square frame', 'frame', { color: '#ffffff', w: 50, aspect: 1.2 }),
      shape('Brush stroke', 'splash', { color: '#f97316', aspect: 0.4, w: 50, opacity: 0.9 }),
      shape('Wave', 'wave', { color: '#ffffff', aspect: 0.3, w: 100, opacity: 0.25 }),
      shape('Sparkles', 'sparkle', { color: '#ffffff', w: 10 }),
      shape('Glow dot', 'circle', { color: '#facc15', w: 30, opacity: 0.35 }),
      shape('Big leaf', 'leaf', { color: '#15803d', w: 34, rotation: -20, opacity: 0.9 }),
      shape('Corner triangle', 'triangle', { color: '#f97316', w: 30, rotation: 180 }),
    ],
  },
  {
    title: 'Icons',
    items: (['phone', 'whatsapp', 'location', 'mail', 'globe', 'clock', 'calendar', 'star', 'check', 'heart', 'instagram', 'facebook', 'youtube', 'cart', 'gift', 'truck', 'tag', 'percent', 'bolt', 'fire', 'trophy', 'quote'] as IconKey[]).map(k =>
      icon(k, { bg: k === 'whatsapp' ? '#16a34a' : k === 'instagram' ? '#db2777' : k === 'facebook' ? '#2563eb' : k === 'youtube' || k === 'fire' ? '#dc2626' : k === 'trophy' || k === 'bolt' ? '#f59e0b' : '#111111' })),
  },
];

export const newImageElement = (src: string, aspect: number): PosterElement => ({ ...base(), kind: 'image', src, aspect, w: 36, radius: 16 });
export const cloneElement = (el: PosterElement): PosterElement => ({ ...el, id: base().id, x: Math.min(95, el.x + 4), y: Math.min(95, el.y + 4) });
