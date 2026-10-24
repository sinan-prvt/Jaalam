import type { CSSProperties } from 'react';
import { POSTER_FONTS } from './fonts';
import type { PosterData, PosterStyle } from './types';

/** What every layout receives: content, style and a size helper. */
export interface LayoutProps {
  d: PosterData;
  st: PosterStyle;
  w: number;
  h: number;
  /** Size in px for a value designed on a 1080px poster, with the text scale applied. */
  f: (n: number) => number;
  /** Size in px for a value designed on a 1080px poster (spacing, no text scale). */
  u: (n: number) => number;
}

/** Shrinks a text's base size when it is long, so it doesn't break mid-word. */
export const fit = (text: string, base: number, chars: number, wordChars = chars * 0.8) => {
  // Malayalam letters render wider than Latin ones
  const width = (s: string) => [...s].reduce((n, c) => n + (/[ഀ-ൿ]/.test(c) ? 1.6 : 1), 0);
  const total = width(text);
  const longest = Math.max(0, ...text.split(/\s+/).map(width));
  const k = Math.min(1, total > chars ? chars / total : 1, longest > wordChars ? wordChars / longest : 1);
  return base * Math.max(0.4, k);
};

let measureCtx: CanvasRenderingContext2D | null = null;

/** Rendered width of text in a given CSS font (canvas measurement). */
export const measureText = (text: string, font: string) => {
  measureCtx ??= document.createElement('canvas').getContext('2d');
  if (!measureCtx) return text.length * 0.6;
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
};

/**
 * Font size (px) so the longest line of `text` fits `maxWidth` px in the heading font,
 * never larger than `base` (a 1080px-poster size, text scale applied).
 */
export const fitWidth = (L: LayoutProps, text: string, base: number, maxWidth: number, weight = 800) => {
  const px = L.f(base);
  const longest = Math.max(1, ...text.split('\n').map(t => measureText(t.trim(), `${weight} ${px}px ${POSTER_FONTS[L.st.display].css}`)));
  return Math.min(px, (px * maxWidth) / longest);
};

export const display = (st: PosterStyle): CSSProperties => ({ fontFamily: POSTER_FONTS[st.display].css });
export const bodyFont = (st: PosterStyle): CSSProperties => ({ fontFamily: POSTER_FONTS[st.body].css });

export const lines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean);

/** "Item - ₹120" → ["Item", "₹120"] */
export const splitPrice = (line: string) => {
  const m = line.match(/^(.*?)\s*[-–:|]\s*([^-–:|]+)$/);
  return m ? [m[1], m[2]] : [line, ''];
};

// ── text effects (exports reliably with html-to-image) ──

/** Heading font at poster weight (Malayalam display faces need the heavy cut). */
export const kd = (st: PosterStyle): CSSProperties => ({ ...display(st), fontWeight: 800 });

/** Solid outline around text, built from text-shadows (exports reliably). */
export const outline = (color: string, r: number, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 ${color}`;
  }).join(',');

/** Stacked shadow for a 3D extruded look. */
export const extrude = (color: string, depth: number, step: number) =>
  Array.from({ length: depth }, (_, i) => `${((i + 1) * step).toFixed(1)}px ${((i + 1) * step).toFixed(1)}px 0 ${color}`).join(',');

export const gradientText = (from: string, to: string, angle = 180): CSSProperties => ({
  backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
});

/** Size for a (multi-line) headline so its longest line fits `maxWidth` px without wrapping. */
export const titleSize = (L: LayoutProps, text: string, base: number, maxWidth: number) => fitWidth(L, text, base, maxWidth);

/** First grapheme (Malayalam letters can be several code points). */
export const firstGrapheme = (s: string) => {
  const seg = new Intl.Segmenter('ml', { granularity: 'grapheme' });
  return [...seg.segment(s.trim())][0]?.segment || '';
};

/** Feathered photo: edges fade into the background, like a cut-out. */
export const feather = (shape = 'ellipse 50% 50% at 50% 50%', inner = 62): CSSProperties => ({
  maskImage: `radial-gradient(${shape}, #000 ${inner}%, transparent 100%)`,
  WebkitMaskImage: `radial-gradient(${shape}, #000 ${inner}%, transparent 100%)`,
});
