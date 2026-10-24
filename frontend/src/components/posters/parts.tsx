import type { CSSProperties } from 'react';
import { PosterArt } from './art';
import { bodyFont, display, fit, type LayoutProps } from './text';
import type { PosterData, PosterStyle } from './types';

/** The photo, or the template's artwork when no photo is set. */
export function Picture({ d, st, style, className = '' }: { d: PosterData; st: PosterStyle; style?: CSSProperties; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      {d.image
        ? <img src={d.image} crossOrigin="anonymous" alt="" className="w-full h-full object-cover block" />
        : <PosterArt art={st.art} palette={st.palette} />}
    </div>
  );
}

export function Logo({ d, size }: { d: PosterData; size: number }) {
  if (!d.logo) return null;
  return <img src={d.logo} crossOrigin="anonymous" alt="" style={{ height: size, width: 'auto', objectFit: 'contain' }} />;
}

/** Brand line with optional logo. */
export function Brand({ d, st, f, u, color, center }: LayoutProps & { color: string; center?: boolean }) {
  if (!d.brand && !d.logo) return null;
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`} style={{ color, gap: u(16) }}>
      <Logo d={d} size={f(64)} />
      {d.brand && <span style={{ ...display(st), fontSize: f(34), letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.1 }}>{d.brand}</span>}
    </div>
  );
}

/** Contact + address footer line. */
export function Footer({ d, st, f, color, center }: LayoutProps & { color: string; center?: boolean }) {
  if (!d.contact && !d.address) return null;
  return (
    <div style={{ ...bodyFont(st), color, fontSize: f(26), lineHeight: 1.35, textAlign: center ? 'center' : 'left', fontWeight: 600 }}>
      {d.contact && <div>{d.contact}</div>}
      {d.address && <div style={{ opacity: 0.85, fontWeight: 400 }}>{d.address}</div>}
    </div>
  );
}

export function Cta({ d, st, f, u, bg, color }: LayoutProps & { bg: string; color: string }) {
  if (!d.cta) return null;
  return (
    <span style={{ ...bodyFont(st), background: bg, color, fontSize: f(28), fontWeight: 800, padding: `${u(18)}px ${u(42)}px`, borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {d.cta}
    </span>
  );
}

/** Round sticker for the offer. */
export function OfferBadge({ d, st, f, u, size = 250, rotate = -10, style }: LayoutProps & { size?: number; rotate?: number; style?: CSSProperties }) {
  if (!d.offer) return null;
  const p = st.palette;
  return (
    <div className="flex items-center justify-center text-center" style={{ width: u(size), height: u(size), borderRadius: '50%', background: p.accent, color: p.onAccent, transform: `rotate(${rotate}deg)`, boxShadow: `0 0 0 ${u(8)}px ${p.accent}55, 0 ${u(20)}px ${u(40)}px rgba(0,0,0,.25)`, padding: u(22), ...style }}>
      <span style={{ ...display(st), fontSize: f(fit(d.offer, size / 5.2, 9) * (d.offer.split(' ').some(w => w.length > 7) ? 0.8 : 1)), lineHeight: 1.05 }}>{d.offer}</span>
    </div>
  );
}
