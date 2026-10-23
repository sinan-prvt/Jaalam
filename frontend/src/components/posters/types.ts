/** Everything the owner can edit on a poster. */
export interface PosterData {
  brand: string;
  headline: string;
  subhead: string;
  offer: string;
  /** Free text; layouts that show lists (menu, price list) split it by line. */
  body: string;
  cta: string;
  contact: string;
  address: string;
  date: string;
  image: string;
  logo: string;
}

export interface Palette {
  /** Main background. */
  bg: string;
  /** Second surface (panels, bands). */
  bg2: string;
  /** Text on bg. */
  ink: string;
  accent: string;
  accent2: string;
  /** Text on accent. */
  onAccent: string;
}

export type LayoutKey =
  | 'adProduct' | 'adGiantLetter' | 'adServices' | 'adPromo' | 'adEvent' | 'adArch'
  | 'adFestival' | 'adAchievement' | 'adClinic' | 'adNews' | 'adFood' | 'adMap'
  | 'bento' | 'glass' | 'brutal' | 'kinetic' | 'swiss' | 'grain' | 'chrome' | 'duotone' | 'stickers' | 'archMinimal'
  | 'hero' | 'frame' | 'split' | 'circle' | 'ribbon' | 'kasavu'
  | 'bold' | 'card' | 'tribute' | 'magazine' | 'menu' | 'polaroid';

/** Decorative artwork shown in the image slot when no photo is set. */
export type ArtKey =
  | 'pookalam' | 'konna' | 'lamps' | 'star' | 'crescent' | 'confetti'
  | 'waves' | 'flag' | 'candle' | 'laurel' | 'rays' | 'cross' | 'book' | 'heart';

import type { PosterFontKey } from './fonts';
export type { PosterFontKey };

export interface PosterStyle {
  layout: LayoutKey;
  palette: Palette;
  display: PosterFontKey;
  body: PosterFontKey;
  art: ArtKey;
  /** Multiplies every text size (0.7 to 1.4). */
  scale: number;
}

export type ShapeKey = 'rect' | 'rounded' | 'circle' | 'star' | 'burst' | 'ribbon' | 'arrow' | 'line' | 'blob' | 'heart' | 'triangle' | 'bubble';
export type IconKey = 'phone' | 'whatsapp' | 'location' | 'mail' | 'globe' | 'clock' | 'star' | 'check' | 'heart' | 'instagram' | 'facebook' | 'youtube' | 'cart' | 'gift' | 'truck' | 'tag';

/**
 * A free element placed on top of the template: added from the Elements panel,
 * then moved, resized and rotated on the poster. Positions are % of the poster;
 * sizes are in 1080px-poster units.
 */
export interface PosterElement {
  id: string;
  kind: 'text' | 'shape' | 'icon' | 'image';
  /** Centre position, % of poster width / height. */
  x: number;
  y: number;
  /** Width, % of poster width. */
  w: number;
  rotation: number;
  opacity: number;
  /** Fill (shape, icon) or text colour. */
  color: string;
  /** Background behind text / icon ('' for none). */
  bg: string;
  /** Height / width ratio for shapes, icons and images. */
  aspect: number;
  radius: number;
  text: string;
  font: PosterFontKey;
  size: number;
  weight: number;
  align: 'left' | 'center' | 'right';
  effect: 'none' | 'outline' | 'shadow';
  /** Outline / effect colour. */
  stroke: string;
  shape?: ShapeKey;
  icon?: IconKey;
  src?: string;
}

export interface PosterTemplate {
  id: string;
  name: string;
  category: string;
  style: PosterStyle;
  data: PosterData;
}

export type PosterFormat = 'square' | 'portrait' | 'story' | 'a4' | 'landscape';

export const FORMATS: Record<PosterFormat, { label: string; w: number; h: number }> = {
  square: { label: 'Square post 1:1', w: 1080, h: 1080 },
  portrait: { label: 'Instagram 4:5', w: 1080, h: 1350 },
  story: { label: 'Story / Status 9:16', w: 1080, h: 1920 },
  a4: { label: 'Print A4', w: 1080, h: 1527 },
  landscape: { label: 'Banner 16:9', w: 1920, h: 1080 },
};
