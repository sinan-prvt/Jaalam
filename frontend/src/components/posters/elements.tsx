import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { POSTER_FONTS } from './fonts';
import type { IconKey, PosterElement, ShapeKey } from './types';

/** SVG paths (viewBox 0 0 100 100) for shapes. */
const SHAPES: Record<ShapeKey, string> = {
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
};

const outline = (color: string, r: number, n = 20) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 ${color}`;
  }).join(',');

export type HandleMode = 'move' | 'resize' | 'rotate';

interface ViewProps {
  el: PosterElement;
  /** Poster size in px. */
  pw: number;
  ph: number;
  selected?: boolean;
  /** 1 / preview scale: keeps handles a constant size on screen. */
  ui?: number;
  onPointer?: (e: ReactPointerEvent, el: PosterElement, mode: HandleMode) => void;
}

/** One free element at its poster position. Handles show only while selected (never in exports). */
export function ElementView({ el, pw, ph, selected, ui = 1, onPointer }: ViewProps) {
  const unit = Math.min(pw, ph) / 1080;
  const width = (el.w / 100) * pw;
  const fixedHeight = el.kind !== 'text' ? width * el.aspect : undefined;
  const textStyle: CSSProperties = {
    fontFamily: POSTER_FONTS[el.font]?.css, fontSize: el.size * unit, fontWeight: el.weight, color: el.kind === 'shape' && !el.text ? undefined : el.color,
    textAlign: el.align, lineHeight: 1.15, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    textShadow: el.effect === 'outline' ? outline(el.stroke, Math.max(1.5, el.size * unit * 0.06)) : el.effect === 'shadow' ? `0 ${4 * unit}px ${14 * unit}px ${el.stroke}` : undefined,
  };

  let body;
  if (el.kind === 'shape') {
    body = (
      <>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <path d={SHAPES[el.shape || 'rect']} fill={el.color} stroke={el.effect === 'outline' ? el.stroke : undefined} strokeWidth={el.effect === 'outline' ? 3 : undefined} vectorEffect="non-scaling-stroke" />
        </svg>
        {el.text && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '12%', ...textStyle, color: el.bg || '#ffffff' }}>{el.text}</div>
        )}
      </>
    );
  } else if (el.kind === 'icon') {
    body = (
      <div className="w-full h-full flex items-center justify-center" style={{ background: el.bg || undefined, borderRadius: '50%' }}>
        <svg viewBox="0 0 24 24" style={{ width: el.bg ? '62%' : '100%', height: el.bg ? '62%' : '100%' }}><path d={ICONS[el.icon || 'star']} fill={el.color} /></svg>
      </div>
    );
  } else if (el.kind === 'image') {
    body = el.src ? <img src={el.src} crossOrigin="anonymous" alt="" className="w-full h-full object-cover" style={{ borderRadius: el.radius * unit, border: el.bg ? `${8 * unit}px solid ${el.bg}` : undefined }} /> : null;
  } else {
    body = (
      <div style={{ ...textStyle, background: el.bg || undefined, borderRadius: el.radius * unit, padding: el.bg ? `${0.3 * el.size * unit}px ${0.6 * el.size * unit}px` : 0, display: 'flex', alignItems: 'center', justifyContent: el.align === 'left' ? 'flex-start' : el.align === 'right' ? 'flex-end' : 'center', gap: 0.35 * el.size * unit }}>
        {el.icon && <svg viewBox="0 0 24 24" style={{ width: el.size * unit * 1.1, height: el.size * unit * 1.1, flexShrink: 0 }}><path d={ICONS[el.icon]} fill={el.color} /></svg>}
        <span>{el.text}</span>
      </div>
    );
  }

  const handle = 14 * ui;
  return (
    <div
      data-element={el.id}
      onPointerDown={onPointer ? e => onPointer(e, el, 'move') : undefined}
      style={{
        position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, width, height: fixedHeight,
        transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`, opacity: el.opacity,
        cursor: onPointer ? 'move' : undefined, touchAction: 'none',
        outline: selected ? `${2 * ui}px solid #f97316` : undefined, outlineOffset: 4 * ui,
      }}
    >
      {body}
      {selected && onPointer && (
        <>
          <span onPointerDown={e => { e.stopPropagation(); onPointer(e, el, 'resize'); }} style={{ position: 'absolute', right: -handle, bottom: -handle, width: handle * 1.4, height: handle * 1.4, background: '#fff', border: `${2 * ui}px solid #f97316`, borderRadius: 4 * ui, cursor: 'nwse-resize' }} />
          <span onPointerDown={e => { e.stopPropagation(); onPointer(e, el, 'rotate'); }} style={{ position: 'absolute', left: '50%', top: -handle * 3.2, width: handle * 1.4, height: handle * 1.4, transform: 'translateX(-50%)', background: '#f97316', border: `${2 * ui}px solid #fff`, borderRadius: '50%', cursor: 'grab' }} />
        </>
      )}
    </div>
  );
}

// ── element library ──

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
    title: 'Text',
    items: [
      text('Heading', { text: 'Add a heading', size: 90, w: 70, color: '#ffffff', effect: 'shadow', stroke: '#00000088' }),
      text('Malayalam title', { text: 'പുതിയ ഓഫർ', size: 110, w: 70, color: '#ffffff', effect: 'outline', stroke: '#b91c1c' }),
      text('Subheading', { text: 'Add a subheading', size: 48, w: 60, weight: 700, font: 'poppins' }),
      text('Body text', { text: 'Add some details here', size: 30, w: 50, weight: 500, font: 'poppins' }),
      text('Highlight bar', { text: 'ഇന്ന് മാത്രം', size: 54, w: 50, bg: '#111111', color: '#facc15' }),
      text('Price tag', { text: '₹999 only', size: 56, w: 34, bg: '#dc2626', color: '#ffffff', radius: 14, rotation: -4 }),
      text('Button', { text: 'SHOP NOW', size: 40, w: 34, bg: '#111111', color: '#ffffff', radius: 999, font: 'montserrat' }),
      text('Script', { text: 'Special Offer', size: 70, w: 56, font: 'greatVibes', weight: 400, color: '#fde68a', effect: 'shadow', stroke: '#00000099' }),
    ],
  },
  {
    title: 'Badges & stickers',
    items: [
      shape('50% OFF burst', 'burst', { color: '#dc2626', text: '50%\nOFF', bg: '#ffffff', size: 64, font: 'anton', weight: 400, w: 24 }),
      shape('NEW ribbon', 'ribbon', { color: '#facc15', text: 'NEW ARRIVAL', bg: '#111111', size: 40, font: 'montserrat', aspect: 0.22, w: 46, rotation: -6 }),
      shape('Offer circle', 'circle', { color: '#16a34a', text: 'ഓഫർ', bg: '#ffffff', size: 70, w: 22 }),
      shape('Star badge', 'star', { color: '#facc15', text: 'BEST', bg: '#7c2d12', size: 40, font: 'anton', weight: 400, w: 22 }),
      shape('Speech bubble', 'bubble', { color: '#ffffff', text: 'Hurry up!', bg: '#111111', size: 44, font: 'poppins', aspect: 0.7, w: 36 }),
      text('Call pill', { text: '+91 98765 43210', icon: 'phone', size: 40, w: 52, bg: '#ffffff', color: '#111111', radius: 999, font: 'poppins' }),
      text('WhatsApp pill', { text: 'Order on WhatsApp', icon: 'whatsapp', size: 38, w: 56, bg: '#16a34a', color: '#ffffff', radius: 999, font: 'poppins' }),
      text('Location pill', { text: 'MG Road, Kochi', icon: 'location', size: 36, w: 46, bg: '#111111', color: '#ffffff', radius: 999, font: 'poppins' }),
      text('Rating', { text: '★★★★★  4.9', size: 44, w: 40, color: '#facc15', font: 'poppins', effect: 'shadow', stroke: '#00000088' }),
      text('Free delivery', { text: 'Free Delivery', icon: 'truck', size: 38, w: 44, bg: '#f97316', color: '#ffffff', radius: 14, font: 'poppins' }),
    ],
  },
  {
    title: 'Shapes',
    items: [
      shape('Square', 'rect'), shape('Rounded', 'rounded'), shape('Circle', 'circle'), shape('Star', 'star', { color: '#facc15' }),
      shape('Burst', 'burst', { color: '#dc2626' }), shape('Ribbon', 'ribbon', { aspect: 0.25, w: 44 }), shape('Arrow', 'arrow', { aspect: 0.5 }),
      shape('Line', 'line', { aspect: 0.05, w: 50, color: '#ffffff' }), shape('Blob', 'blob', { color: '#a855f7', w: 40 }), shape('Heart', 'heart', { color: '#e11d48' }),
      shape('Triangle', 'triangle', { color: '#0ea5e9' }), shape('Bubble', 'bubble', { color: '#ffffff', aspect: 0.7 }),
    ],
  },
  {
    title: 'Icons',
    items: (['phone', 'whatsapp', 'location', 'mail', 'globe', 'clock', 'star', 'check', 'heart', 'instagram', 'facebook', 'youtube', 'cart', 'gift', 'truck', 'tag'] as IconKey[]).map(k =>
      icon(k, { bg: k === 'whatsapp' ? '#16a34a' : k === 'instagram' ? '#db2777' : k === 'facebook' ? '#2563eb' : k === 'youtube' ? '#dc2626' : '#111111' })),
  },
];

export const newImageElement = (src: string, aspect: number): PosterElement => ({ ...base(), kind: 'image', src, aspect, w: 36, radius: 16 });
export const cloneElement = (el: PosterElement): PosterElement => ({ ...el, id: base().id, x: Math.min(95, el.x + 4), y: Math.min(95, el.y + 4) });
export { SHAPES };
