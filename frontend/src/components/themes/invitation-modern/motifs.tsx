import type { CSSProperties } from 'react';
import type { Motif } from './inviteThemes';
import { motifTile } from './motifTiles';

/**
 * Category motifs drawn as small SVGs: a band
 * (borders between hero and content), a divider glyph (under section headings)
 * and a large medallion (traditional heroes).
 */

/** A decorative strip between the hero and the content, in the category's motif. */
export function MotifBand({ motif, a, b, className = '' }: { motif: Motif; a: string; b: string; className?: string }) {
  const style: CSSProperties = motif === 'kasavu'
    // Kerala kasavu: cream cloth with a gold zari border
    ? { background: `linear-gradient(${b}22, ${b}22), repeating-linear-gradient(90deg, ${a} 0 3px, transparent 3px 7px)`, borderTop: `4px solid ${a}`, borderBottom: `4px solid ${a}`, backgroundColor: '#fbf6e6' }
    : { ...motifTile(motif, a, b, 26), borderTop: `2px solid ${a}`, borderBottom: `2px solid ${a}` };
  return <div aria-hidden="true" className={`h-7 w-full ${className}`} style={style} />;
}

/** Small ornament for under section headings, in currentColor. */
export function MotifGlyph({ motif, className = '' }: { motif: Motif; className?: string }) {
  const paths: Record<Motif, string> = {
    floral: 'M12 4a3 3 0 0 1 0 6 3 3 0 0 1 0-6zm0 10a3 3 0 0 1 0 6 3 3 0 0 1 0-6zm-5-5a3 3 0 0 1 0 6 3 3 0 0 1 0-6zm10 0a3 3 0 0 1 0 6 3 3 0 0 1 0-6z',
    arabesque: 'M12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9z',
    kolam: 'M12 3c5 3 6 4 9 9-3 5-4 6-9 9-5-3-6-4-9-9 3-5 4-6 9-9zm0 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    kasavu: 'M2 12 7 7l5 5 5-5 5 5-5 5-5-5-5 5z',
    phulkari: 'M12 2 22 12 12 22 2 12zm0 6-4 4 4 4 4-4z',
    alpana: 'M12 2c2 4 2 6 0 8-2-2-2-4 0-8zm0 12c2 2 2 4 0 8-2-4-2-6 0-8zM2 12c4-2 6-2 8 0-2 2-4 2-8 0zm12 0c2-2 4-2 8 0-4 2-6 2-8 0z',
    stainedGlass: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 3v14M5 12h14M7 7l10 10M17 7 7 17',
    sparkle: 'M12 2c1 6 3 8 10 10-7 2-9 4-10 10-1-6-3-8-10-10 7-2 9-4 10-10z',
    confetti: 'M4 6h5v3H4zm11-2h3v5h-3zM6 15h3v3H6zm9 1h5v3h-5zm-4-6h2v2h-2z',
    stars: 'M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 16.8 5.8 20.3l1.6-6.8L2.2 8.9l6.9-.6z',
    hearts: 'M12 21C5 15.5 2 12.5 2 8.8A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 10 2.2C22 12.5 19 15.5 12 21z',
    leaves: 'M4 20C4 10 10 4 20 4c0 10-6 16-16 16zm0 0L15 9',
    circuit: 'M2 7h7l3 3v12M22 17h-7l-3-3V2M9 7a1.5 1.5 0 1 0 0 .1M15 17a1.5 1.5 0 1 0 0 .1',
    brush: 'M2 10c6-4 12 4 20-2v4c-8 6-14-2-20 2z',
    stripes: 'M2 22 22 2h-5L2 17zm7 0L22 9v5l-8 8z',
  };
  const stroked = motif === 'leaves' || motif === 'circuit' || motif === 'stainedGlass';
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true"
      fill={stroked ? 'none' : 'currentColor'} stroke={stroked ? 'currentColor' : 'none'} strokeWidth={stroked ? 1.6 : 0} strokeLinecap="round">
      <path d={paths[motif]} />
    </svg>
  );
}

/** Large ornament (currentColor) for traditional heroes: rangoli, rose window, eight-point star... */
export function MotifMedallion({ motif, className = '' }: { motif: Motif; className?: string }) {
  const n = motif === 'arabesque' ? 8 : motif === 'stainedGlass' ? 16 : 12;
  const ring = Array.from({ length: n }, (_, i) => (i * 360) / n);
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="84" strokeDasharray="2 6" strokeLinecap="round" />
      {motif === 'arabesque' && <>
        <rect x="45" y="45" width="110" height="110" />
        <rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)" />
      </>}
      {motif === 'kolam' && Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => (
        <circle key={`${r}-${c}`} cx={60 + c * 20} cy={60 + r * 20} r="2" fill="currentColor" />
      )))}
      {ring.map(deg => (
        motif === 'stainedGlass'
          ? <path key={deg} transform={`rotate(${deg} 100 100)`} d="M100 16 L112 60 L100 74 L88 60 Z" />
          : motif === 'arabesque'
            ? <circle key={deg} transform={`rotate(${deg} 100 100)`} cx="100" cy="24" r="6" />
            : <path key={deg} transform={`rotate(${deg} 100 100)`} d="M100 22 C112 44 112 62 100 76 C88 62 88 44 100 22 Z" />
      ))}
      <circle cx="100" cy="100" r="22" />
      <circle cx="100" cy="100" r="8" fill="currentColor" />
    </svg>
  );
}
