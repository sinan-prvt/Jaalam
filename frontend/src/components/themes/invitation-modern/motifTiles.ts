import type { CSSProperties } from 'react';
import type { Motif } from './inviteThemes';

/** Tile contents on a 40×40 grid, in the two accent colours. */
const TILES: Record<Motif, (a: string, b: string) => string> = {
  floral: (a, b) => `<g fill="${a}"><circle cx="20" cy="13" r="5"/><circle cx="27" cy="20" r="5"/><circle cx="20" cy="27" r="5"/><circle cx="13" cy="20" r="5"/></g><circle cx="20" cy="20" r="3.5" fill="${b}"/>`,
  arabesque: (a, b) => `<g fill="none" stroke="${a}" stroke-width="1.6"><rect x="10" y="10" width="20" height="20"/><rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)"/></g><circle cx="20" cy="20" r="3" fill="${b}"/><circle cx="0" cy="0" r="3" fill="${b}"/><circle cx="40" cy="40" r="3" fill="${b}"/><circle cx="40" cy="0" r="3" fill="${b}"/><circle cx="0" cy="40" r="3" fill="${b}"/>`,
  kolam: (a, b) => `<g fill="${b}"><circle cx="10" cy="10" r="2"/><circle cx="30" cy="10" r="2"/><circle cx="10" cy="30" r="2"/><circle cx="30" cy="30" r="2"/><circle cx="20" cy="20" r="2"/></g><g fill="none" stroke="${a}" stroke-width="1.5"><path d="M20 4 C30 10 30 10 36 20 C30 30 30 30 20 36 C10 30 10 30 4 20 C10 10 10 10 20 4 Z"/></g>`,
  kasavu: (a, b) => `<rect width="40" height="40" fill="none"/><g fill="${a}"><rect x="0" y="6" width="40" height="3"/><rect x="0" y="31" width="40" height="3"/></g><path d="M0 20 L10 14 L20 20 L30 14 L40 20 L30 26 L20 20 L10 26 Z" fill="${b}" opacity=".7"/>`,
  phulkari: (a, b) => `<path d="M20 2 L38 20 L20 38 L2 20 Z" fill="${a}"/><path d="M20 10 L30 20 L20 30 L10 20 Z" fill="${b}"/><path d="M20 16 L24 20 L20 24 L16 20 Z" fill="${a}"/>`,
  alpana: (a, b) => `<g fill="none" stroke="${a}" stroke-width="1.4">${[0, 45, 90, 135, 180, 225, 270, 315].map(d => `<path transform="rotate(${d} 20 20)" d="M20 5 C24 11 24 15 20 18 C16 15 16 11 20 5 Z"/>`).join('')}</g><circle cx="20" cy="20" r="2.5" fill="${b}"/>`,
  stainedGlass: (a, b) => `<path d="M0 0 H20 L0 20 Z" fill="${a}"/><path d="M20 0 H40 V20 Z" fill="${b}"/><path d="M40 20 V40 H20 Z" fill="${a}"/><path d="M0 20 L20 40 H0 Z" fill="${b}"/><path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#1f1f2e" stroke-width="2"/><path d="M0 0 L40 40 M40 0 L0 40" stroke="#1f1f2e" stroke-width="1.2"/>`,
  sparkle: (a, b) => `<path d="M12 4 C13 10 14 11 20 12 C14 13 13 14 12 20 C11 14 10 13 4 12 C10 11 11 10 12 4 Z" fill="${a}"/><path d="M30 22 C30.6 26 31.4 26.8 35 27.5 C31.4 28.2 30.6 29 30 33 C29.4 29 28.6 28.2 25 27.5 C28.6 26.8 29.4 26 30 22 Z" fill="${b}"/>`,
  confetti: (a, b) => `<rect x="5" y="6" width="7" height="3" rx="1" fill="${a}" transform="rotate(25 8 7)"/><rect x="26" y="10" width="7" height="3" rx="1" fill="${b}" transform="rotate(-30 29 11)"/><circle cx="14" cy="28" r="2.5" fill="${b}"/><circle cx="32" cy="31" r="2" fill="${a}"/><rect x="18" y="18" width="5" height="3" rx="1" fill="#facc15" transform="rotate(60 20 19)"/>`,
  stars: (a, b) => `<path d="M12 4 L14.4 9.6 L20.5 10.1 L15.8 14 L17.3 20 L12 16.8 L6.7 20 L8.2 14 L3.5 10.1 L9.6 9.6 Z" fill="${a}"/><circle cx="30" cy="28" r="2" fill="${b}"/><circle cx="34" cy="10" r="1.2" fill="${b}"/>`,
  hearts: (a, b) => `<path d="M14 26 C6 20 4 16 4 13 A5 5 0 0 1 14 11 A5 5 0 0 1 24 13 C24 16 22 20 14 26 Z" fill="${a}"/><path d="M31 36 C27 33 26 31 26 29.5 A2.5 2.5 0 0 1 31 28.5 A2.5 2.5 0 0 1 36 29.5 C36 31 35 33 31 36 Z" fill="${b}"/>`,
  leaves: (a, b) => `<path d="M8 32 C8 18 18 8 32 8 C32 22 22 32 8 32 Z" fill="${a}"/><path d="M8 32 L26 14" stroke="${b}" stroke-width="1.5"/>`,
  circuit: (a, b) => `<g fill="none" stroke="${a}" stroke-width="1.5"><path d="M0 10 H14 L20 16 V40"/><path d="M40 28 H28 L24 24 V0"/></g><g fill="${b}"><circle cx="14" cy="10" r="2.5"/><circle cx="20" cy="30" r="2.5"/><circle cx="28" cy="28" r="2.5"/></g>`,
  brush: (a, b) => `<path d="M2 14 C10 8 22 18 38 10 L38 15 C24 22 12 13 2 19 Z" fill="${a}"/><path d="M4 31 C14 26 24 34 36 28 L36 32 C24 37 14 30 4 35 Z" fill="${b}"/>`,
  stripes: (a, b) => `<path d="M0 40 L40 0 H30 L0 30 Z" fill="${a}"/><path d="M10 40 L40 10 V18 L18 40 Z" fill="${b}"/>`,
};

const svgUrl = (inner: string, size = 40) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 40 40'>${inner}</svg>`)}")`;

/** Background style for a repeating motif tile. */
export const motifTile = (motif: Motif, a: string, b: string, size = 40): CSSProperties => ({
  backgroundImage: svgUrl(TILES[motif](a, b)),
  backgroundSize: `${size}px ${size}px`,
});
