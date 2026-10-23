import type { CSSProperties, ReactNode } from 'react';
import { Picture, bodyFont, display, fit, fitWidth, lines, type LayoutProps } from './parts';
import type { PosterStyle } from './types';
import type { Palette, PosterFontKey } from './types';

/**
 * Kerala social-media ad layouts: huge stylised Malayalam headlines (outlined,
 * 3D, gradient, highlight bars), feathered product cut-outs, service lists, date
 * boxes, bunting, lanterns and contact strips, the look of local ad posters.
 */

const pal = (bg: string, bg2: string, ink: string, accent: string, accent2: string, onAccent: string): Palette => ({ bg, bg2, ink, accent, accent2, onAccent });

// ── text effects ──

/** Heading font at poster weight (Malayalam display faces need the heavy cut). */
const kd = (st: PosterStyle): CSSProperties => ({ ...display(st), fontWeight: 800 });

/** Solid outline around text, built from text-shadows (exports reliably). */
const outline = (color: string, r: number, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 ${color}`;
  }).join(',');

/** Stacked shadow for a 3D extruded look. */
const extrude = (color: string, depth: number, step: number) =>
  Array.from({ length: depth }, (_, i) => `${((i + 1) * step).toFixed(1)}px ${((i + 1) * step).toFixed(1)}px 0 ${color}`).join(',');

const gradientText = (from: string, to: string, angle = 180): CSSProperties => ({
  backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
});

/** Gradient-filled line with a solid outline behind it (two layers, exports reliably). */
function GradientLine({ text, style, from, to, ring, ringWidth, shadow }: { text: string; style: CSSProperties; from: string; to: string; ring: string; ringWidth: number; shadow: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <div aria-hidden style={{ ...style, color: ring, textShadow: `${outline(ring, ringWidth)}, ${shadow}` }}>{text}</div>
      <div style={{ ...style, position: 'absolute', inset: 0, ...gradientText(from, to) }}>{text}</div>
    </div>
  );
}

/** Size for a (multi-line) headline so its longest line fits `maxWidth` px without wrapping. */
const titleSize = (L: LayoutProps, text: string, base: number, maxWidth: number) => fitWidth(L, text, base, maxWidth);

/** First grapheme (Malayalam letters can be several code points). */
const firstGrapheme = (s: string) => {
  const seg = new Intl.Segmenter('ml', { granularity: 'grapheme' });
  return [...seg.segment(s.trim())][0]?.segment || '';
};

// ── small graphics ──

function PhoneIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ flexShrink: 0 }}>
      <path fill={color} d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

/** Facebook / Instagram / WhatsApp style icons, as simple glyphs. */
function Socials({ size, color, bg }: { size: number; color: string; bg: string }) {
  const box: CSSProperties = { width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ display: 'flex', gap: size * 0.3 }}>
      <span style={box}><svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55}><path fill={color} d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z" /></svg></span>
      <span style={box}><svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke={color} strokeWidth="2.4" /><circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="2.4" /><circle cx="17.3" cy="6.7" r="1.4" fill={color} /></svg></span>
      <span style={box}><svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55}><path fill={color} d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z" /></svg></span>
    </div>
  );
}

function Cloud({ width, style }: { width: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" width={width} style={style}>
      <g fill="#fff" opacity=".95"><circle cx="35" cy="38" r="20" /><circle cx="60" cy="28" r="26" /><circle cx="88" cy="38" r="20" /><rect x="20" y="38" width="85" height="20" rx="10" /></g>
    </svg>
  );
}

function Palm({ width, flip, style }: { width: number; flip?: boolean; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 160" width={width} style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}>
      <path d="M0 0 Q90 40 200 150" stroke="#3f6212" strokeWidth="4" fill="none" />
      {Array.from({ length: 16 }, (_, i) => {
        const t = 0.06 + i * 0.058, x = 200 * t, y = 150 * t * t + 40 * t * (1 - t) * 2;
        return (
          <g key={i}>
            <path d={`M${x} ${y} q${-20 - i} ${25 + i * 1.5} ${-34 - i * 1.2} ${50 + i * 2}`} stroke="#4d7c0f" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d={`M${x} ${y} q${25 + i} ${-5} ${50 + i * 1.5} ${-12 + i}`} stroke="#65a30d" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

function Lantern({ width, color }: { width: number; color: string }) {
  return (
    <svg viewBox="0 0 60 150" width={width}>
      <line x1="30" y1="0" x2="30" y2="40" stroke={color} strokeWidth="2" />
      <path d="M18 40 h24 l-4 10 h-16z" fill={color} />
      <path d="M14 50 Q30 40 46 50 L50 100 Q30 112 10 100 Z" fill={color} />
      <path d="M20 58 Q30 52 40 58 L42 96 Q30 104 18 96 Z" fill="#fff7d6" opacity=".9" />
      <ellipse cx="30" cy="80" rx="12" ry="18" fill="#ffd56b" opacity=".8" />
      <path d="M22 106 h16 l-8 22z" fill={color} />
      <line x1="30" y1="128" x2="30" y2="146" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function Bunting({ width, height, colors }: { width: number; height: number; colors: string[] }) {
  const n = 18;
  return (
    <svg viewBox={`0 0 ${n * 40} 70`} width={width} height={height} preserveAspectRatio="none">
      <path d={`M0 6 Q${n * 20} 40 ${n * 40} 6`} stroke="#555" strokeWidth="2" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const x = i * 40 + 4, y = 6 + Math.sin((i / (n - 1)) * Math.PI) * 17;
        return <path key={i} d={`M${x} ${y} L${x + 32} ${y} L${x + 16} ${y + 34} Z`} fill={colors[i % colors.length]} />;
      })}
    </svg>
  );
}

function Swirl({ size, color, style }: { size: number; color: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a18 18 0 1 1 -18 -18 a26 26 0 1 1 26 26" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Stylised outline of Kerala (percent points for clip-path). */
const KERALA = 'polygon(10% 0%,16% 10%,22% 20%,28% 30%,34% 40%,42% 50%,50% 60%,58% 70%,66% 80%,74% 90%,84% 100%,88% 100%,93% 90%,95% 80%,92% 70%,89% 60%,82% 50%,71% 40%,59% 30%,48% 20%,38% 10%,29% 0%)';

/** Feathered photo: edges fade into the background, like a cut-out. */
const feather = (shape = 'ellipse 50% 50% at 50% 50%', inner = 62): CSSProperties => ({
  maskImage: `radial-gradient(${shape}, #000 ${inner}%, transparent 100%)`,
  WebkitMaskImage: `radial-gradient(${shape}, #000 ${inner}%, transparent 100%)`,
});

function ContactPill({ L, bg, color, iconBg, iconColor }: { L: LayoutProps; bg: string; color: string; iconBg: string; iconColor: string }) {
  const { d, st, f, u } = L;
  if (!d.contact) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: u(14), background: bg, color, borderRadius: 999, padding: `${u(8)}px ${u(28)}px ${u(8)}px ${u(8)}px` }}>
      <span style={{ width: u(56), height: u(56), borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PhoneIcon size={u(30)} color={iconColor} /></span>
      <span style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 800, whiteSpace: 'nowrap' }}>{d.contact}</span>
    </div>
  );
}

function BrandMark({ L, color, size = 40, center }: { L: LayoutProps; color: string; size?: number; center?: boolean }) {
  const { d, st, f, u } = L;
  if (!d.brand && !d.logo) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: u(14), justifyContent: center ? 'center' : undefined, color }}>
      {d.logo && <img src={d.logo} crossOrigin="anonymous" alt="" style={{ height: f(size * 1.6), width: 'auto' }} />}
      {d.brand && <span style={{ ...bodyFont(st), fontSize: f(size), fontWeight: 800, letterSpacing: '0.02em', lineHeight: 1 }}>{d.brand}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────

/** Brand on top, outlined Malayalam headline, feathered product, tagline, services, phone. */
function AdProduct(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse at 50% 55%, ${p.bg2}, ${p.bg} 75%)`, color: p.ink, padding: `${u(40)}px ${u(50)}px` }}>
      <BrandMark L={L} color={p.ink} size={44} center />
      <div className="relative" style={{ marginTop: u(26) }}>
        <Cloud width={u(150)} style={{ position: 'absolute', left: -u(140), top: -u(10) }} />
        <Cloud width={u(120)} style={{ position: 'absolute', right: -u(120), bottom: -u(20) }} />
        {ttl.map((t, i) => (
          <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, i === 0 ? 120 : 82, w * 0.8), lineHeight: 1.15, color: '#fff', textShadow: `${outline(p.accent, u(6))}, 0 ${u(14)}px ${u(24)}px rgba(0,0,0,.35)` }}>{t}</div>
        ))}
      </div>
      <div className="relative flex-1 w-full" style={{ margin: `${u(14)}px 0` }}>
        <div className="absolute" style={{ left: '15%', right: '15%', bottom: u(4), height: u(40), borderRadius: '50%', background: 'rgba(0,0,0,.35)', filter: `blur(${u(14)}px)` }} />
        <Picture d={d} st={st} className="absolute" style={{ inset: `0 ${w > h ? '20%' : '6%'}`, ...feather('ellipse 50% 50% at 50% 50%', 58) }} />
      </div>
      {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 46, 26)), color: p.ink }}>{d.subhead}</div>}
      {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), opacity: 0.9, marginTop: u(10), lineHeight: 1.4 }}>{lines(d.body).join(', ')}</div>}
      {d.offer && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, color: p.accent2, marginTop: u(8) }}>{d.offer}</div>}
      {d.contact && <div style={{ ...bodyFont(st), fontSize: f(40), fontWeight: 800, marginTop: u(12) }}>{d.contact}</div>}
    </div>
  );
}

/** Giant first letter beside stacked lines, product bottom-right, white footer strip. */
function AdGiantLetter(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const first = firstGrapheme(d.headline);
  const rest = d.headline.trim().slice(first.length).trim();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(160deg, ${p.bg2}, ${p.bg})`, color: p.ink }}>
      <div className="absolute" style={{ right: 0, bottom: u(180), width: '62%', height: '52%' }}>
        <Picture d={d} st={st} className="absolute inset-0" style={feather('ellipse 55% 55% at 55% 55%', 55)} />
      </div>
      <div className="relative flex justify-end" style={{ padding: `${u(36)}px ${u(48)}px 0`, ...bodyFont(st), fontSize: f(22), opacity: 0.8 }}>{d.address}</div>
      <div className="relative flex items-center" style={{ padding: `${u(30)}px ${u(56)}px`, gap: u(22) }}>
        <div style={{ ...kd(st), fontSize: f(330), lineHeight: 0.85, color: p.ink }}>{first}</div>
        <div>
          {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 48, 16)), lineHeight: 1.15, whiteSpace: 'pre-line' }}>{d.subhead}</div>}
          {d.brand && <div style={{ ...bodyFont(st), fontSize: f(34), fontWeight: 700, letterSpacing: '0.1em', margin: `${u(6)}px 0` }}>{d.brand.toUpperCase()}</div>}
          <div style={{ ...kd(st), fontSize: titleSize(L, rest, 88, w * 0.55), lineHeight: 1.05, whiteSpace: 'nowrap' }}>{rest}</div>
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, marginTop: u(16) }}>{lines(d.body).join(' | ')}</div>}
          {d.offer && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, marginTop: u(10), color: p.accent }}>{d.offer}</div>}
        </div>
      </div>
      <div className="flex-1" />
      <div className="relative flex items-center justify-between flex-wrap" style={{ background: '#fff', color: '#111', padding: `${u(28)}px ${u(48)}px`, gap: u(16) }}>
        <div>
          <div style={{ ...kd(st), fontSize: f(64), lineHeight: 1 }}>{d.brand}</div>
          {d.cta && <div style={{ ...bodyFont(st), fontSize: f(24) }}>{d.cta}</div>}
        </div>
        <div className="flex flex-col items-end" style={{ gap: u(6) }}>
          <span style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700 }}>For more information call us:</span>
          <ContactPill L={L} bg="#eceae6" color="#111" iconBg={p.bg} iconColor="#fff" />
        </div>
      </div>
    </div>
  );
}

/** Night-sky services ad: stacked headline, 3D word, services list, house photo, connect bar. */
function AdServices(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  const big = ttl.length > 1 ? ttl[ttl.length - 1] : '';
  const top = big ? ttl.slice(0, -1) : ttl;
  const services = lines(d.body).slice(0, 6);
  const tall = h > w * 1.2;
  const colW = tall ? w - u(96) : ((w - u(126)) * 1.3) / 2.3;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `radial-gradient(ellipse at 70% 0%, ${p.bg2}, ${p.bg} 70%)`, color: p.ink }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffffaa 1px, transparent 1.5px)', backgroundSize: `${u(46)}px ${u(46)}px`, opacity: 0.35, height: '55%' }} />
      <div className="relative flex justify-between items-center" style={{ padding: `${u(36)}px ${u(48)}px` }}>
        <span style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700 }}>{d.address}</span>
        <BrandMark L={L} color={p.ink} size={36} />
      </div>
      <div className={`relative flex ${tall ? 'flex-col' : 'flex-row'} justify-between`} style={{ padding: `0 ${u(48)}px`, gap: u(30) }}>
        <div style={{ flex: 1.3 }}>
          {top.map((t, i) => <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, top.join('\n'), 58, colW), lineHeight: 1.15, textShadow: `0 ${u(4)}px ${u(10)}px rgba(0,0,0,.5)` }}>{t}</div>)}
          {big && <div style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, big, 170, colW), lineHeight: 1.05, color: p.accent, textShadow: `${outline('#fff', u(5))}, ${extrude(p.accent2, 8, u(2))}` }}>{big}</div>}
        </div>
        <div style={{ flex: 1, paddingTop: u(10) }}>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(40), fontWeight: 800, marginBottom: u(10) }}>{d.subhead}</div>}
          {services.map((s, i) => <div key={i} style={{ ...bodyFont(st), fontSize: f(32), lineHeight: 1.45 }}>&gt;{s}</div>)}
          <div style={{ marginTop: u(18) }}><Socials size={u(52)} color={p.bg} bg={p.ink} /></div>
        </div>
      </div>
      <div className="relative flex-1" style={{ minHeight: u(200) }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ maskImage: 'linear-gradient(transparent, #000 30%)', WebkitMaskImage: 'linear-gradient(transparent, #000 30%)' }} />
        {d.cta && (
          <div className="absolute" style={{ left: u(36), bottom: u(30), background: '#fff', color: '#111', padding: `${u(14)}px ${u(22)}px`, borderRadius: u(12), boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
            <div style={{ ...kd(st), fontSize: f(30) }}>{d.cta}</div>
            {d.date && <div style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 700 }}>{d.date}</div>}
          </div>
        )}
      </div>
      <div className="relative flex items-stretch" style={{ background: '#fff', color: '#111' }}>
        <div style={{ flex: 1, padding: `${u(16)}px ${u(40)}px`, ...bodyFont(st), fontSize: f(22), fontWeight: 700, lineHeight: 1.4 }}>
          {d.offer && <div style={{ color: p.accent2, fontWeight: 800, fontSize: f(26) }}>{d.offer}</div>}
          {services.join(' | ')}
        </div>
        <div className="flex flex-col justify-center" style={{ padding: `${u(12)}px ${u(30)}px`, gap: u(6), background: '#fff' }}>
          <span style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(6)}px ${u(16)}px` }}>CONNECT WITH US</span>
          {d.contact && <span className="flex items-center" style={{ ...bodyFont(st), fontSize: f(32), fontWeight: 800, gap: u(8) }}><PhoneIcon size={u(30)} color={p.accent} />{d.contact}</span>}
        </div>
      </div>
    </div>
  );
}

/** Product promo: bold English word + Malayalam lines, price burst, model photo, shop button. */
function AdPromo(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const ttl = lines(d.headline);
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.bg}, ${p.bg2})`, color: p.ink }}>
      <div className="absolute" style={{ right: -u(40), bottom: 0, width: '58%', height: '92%' }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 25%)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 25%)' }} />
      </div>
      <div className="absolute flex justify-between items-center" style={{ top: u(36), left: u(44), right: u(44) }}>
        <BrandMark L={L} color={p.ink} size={34} />
        <Socials size={u(48)} color="#fff" bg={p.accent} />
      </div>
      <div className="absolute flex flex-col items-start" style={{ left: u(44), top: u(140), width: '60%', gap: u(14) }}>
        {ttl.map((t, i) => (
          <div key={i} style={i === 0
            ? { ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, 150, w * 0.56), lineHeight: 0.95, color: p.accent, textShadow: `${outline('#fff', u(5))}, ${u(8)}px ${u(8)}px 0 ${p.ink}` }
            : { ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, 66, w * 0.5), lineHeight: 1.1, background: p.ink, color: p.bg, padding: `${u(4)}px ${u(18)}px`, transform: `rotate(${i % 2 ? -1.5 : 1}deg)` }}>{t}</div>
        ))}
        {d.offer && (
          <div className="flex items-center justify-center text-center" style={{ marginTop: u(10), width: u(230), height: u(230), background: p.accent, color: p.onAccent, borderRadius: '50%', border: `${u(8)}px dashed #fff`, transform: 'rotate(-8deg)', padding: u(20) }}>
            <span style={{ ...kd(st), fontSize: f(fit(d.offer, 52, 8)), lineHeight: 1.05 }}>{d.offer}</span>
          </div>
        )}
        {d.subhead && <span style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 800, background: '#fff', color: p.ink, padding: `${u(12)}px ${u(26)}px`, borderRadius: 999, boxShadow: '0 8px 20px rgba(0,0,0,.15)' }}>{d.subhead}</span>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(24), lineHeight: 1.4, whiteSpace: 'pre-line', maxWidth: '90%' }}>{d.body}</div>}
      </div>
      <div className="absolute flex items-center justify-between" style={{ left: u(44), right: u(44), bottom: u(36), gap: u(16) }}>
        {d.cta && <span style={{ ...kd(st), fontSize: f(38), background: p.ink, color: '#fff', padding: `${u(16)}px ${u(44)}px`, borderRadius: u(14), boxShadow: `${u(6)}px ${u(6)}px 0 ${p.accent}` }}>{d.cta}</span>}
        <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, background: '#ffffffd9', padding: `${u(8)}px ${u(18)}px`, borderRadius: u(10) }}>{d.contact}</div>
      </div>
    </div>
  );
}

/** Church / club event: organiser on top, bunting, gradient title, date box, photo, contact bar. */
function AdEvent(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const ttl = lines(d.headline);
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse at 50% 40%, #ffffff, ${p.bg} 70%)`, color: p.ink }}>
      <div className="absolute" style={{ left: -u(120), top: -u(120), width: u(420), height: u(420), borderRadius: '50%', background: p.bg2, opacity: 0.6 }} />
      <div className="absolute" style={{ right: -u(140), top: u(120), width: u(360), height: u(360), borderRadius: '50%', background: p.bg2, opacity: 0.5 }} />
      <div className="relative flex flex-col items-center" style={{ padding: `${u(40)}px ${u(60)}px 0`, gap: u(6) }}>
        {d.logo && <img src={d.logo} crossOrigin="anonymous" alt="" style={{ height: u(90) }} />}
        {d.brand && <div style={{ ...kd(st), fontSize: f(fit(d.brand, 44, 26)), color: p.accent2 }}>{d.brand}</div>}
        {d.address && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700 }}>{d.address}</div>}
      </div>
      <div className="relative w-full" style={{ marginTop: u(16) }}><Bunting width={w} height={u(70)} colors={[p.accent, p.accent2, '#22c55e', '#facc15', '#3b82f6', '#ec4899']} /></div>
      <div className="relative" style={{ marginTop: u(4) }}>
        {ttl.map((t, i) => (
          <GradientLine key={i} text={t} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, d.headline, 150, w * 0.86), lineHeight: 1.12 }} from={p.accent} to={p.accent2} ring="#ffffff" ringWidth={u(7)} shadow={`0 ${u(12)}px ${u(14)}px rgba(0,0,0,.35)`} />
        ))}
        {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 70, 14)), color: p.accent2, marginTop: u(4) }}>{d.subhead}</div>}
      </div>
      <div className="relative flex-1 w-full flex items-end">
        <div className="relative" style={{ width: '46%', alignSelf: 'stretch' }}>
          <Picture d={d} st={st} className="absolute inset-0" style={feather('ellipse 60% 70% at 50% 70%', 55)} />
        </div>
        <div className="flex flex-col items-center" style={{ flex: 1, gap: u(14), padding: `0 ${u(40)}px ${u(30)}px` }}>
          {d.date && (
            <div style={{ border: `${u(5)}px solid ${p.accent2}`, borderRadius: u(14), padding: `${u(14)}px ${u(26)}px`, background: '#fff', boxShadow: `${u(8)}px ${u(8)}px 0 ${p.accent}` }}>
              <div style={{ ...kd(st), fontSize: f(fit(d.date, 64, 10)), lineHeight: 1.1, color: p.accent2 }}>{d.date}</div>
            </div>
          )}
          {d.offer && <div style={{ ...kd(st), fontSize: f(34) }}>{d.offer}</div>}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, lineHeight: 1.4, whiteSpace: 'pre-line', background: '#ffffffcc', padding: `${u(8)}px ${u(16)}px`, borderRadius: u(10) }}>{d.body}</div>}
        </div>
      </div>
      <div className="relative w-full flex items-center justify-center flex-wrap" style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})`, color: '#fff', padding: `${u(16)}px ${u(30)}px`, gap: u(14), ...bodyFont(st), fontSize: f(26), fontWeight: 800 }}>
        {d.cta && <span>{d.cta}:</span>}<span>{d.contact}</span>
      </div>
    </div>
  );
}

/** Ornate arch with hanging lanterns and a gold title (madrasa / mahfil / Ramadan). */
function AdArch(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  const archTop = h * 0.13;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink }}>
      <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${p.accent}22 0 ${u(2)}px, transparent ${u(2)}px ${u(36)}px), repeating-linear-gradient(-45deg, ${p.accent}22 0 ${u(2)}px, transparent ${u(2)}px ${u(36)}px)` }} />
      <div className="absolute" style={{ left: w * 0.07, right: w * 0.07, top: archTop, bottom: 0, background: p.bg2, borderRadius: `${w * 0.43}px ${w * 0.43}px 0 0`, border: `${u(10)}px solid ${p.accent}`, borderBottom: 'none', boxShadow: `inset 0 0 ${u(80)}px rgba(0,0,0,.45)` }} />
      {[0.2, 0.8].map((x, i) => (
        <div key={i} className="absolute" style={{ left: w * x - u(40), top: archTop + u(30) }}><Lantern width={u(80)} color={p.accent} /></div>
      ))}
      <div className="absolute inset-x-0 flex flex-col items-center text-center" style={{ top: archTop + u(150), bottom: u(40), padding: `0 ${w * 0.14}px`, gap: u(14) }}>
        {d.subhead && <div style={{ ...kd(st), fontSize: f(40), color: p.ink }}>{d.subhead}</div>}
        <div>
          {ttl.map((t, i) => (
            <GradientLine key={i} text={t} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, d.headline, 130, w * 0.64), lineHeight: 1.12 }} from="#fff3b0" to={p.accent} ring="#3a1a00" ringWidth={u(4)} shadow={`0 ${u(10)}px ${u(12)}px rgba(0,0,0,.5)`} />
          ))}
        </div>
        {d.date && (
          <div className="flex items-center" style={{ gap: u(16), ...kd(st), fontSize: f(44), color: p.ink }}>
            <span style={{ width: u(34), height: u(34), borderRadius: '50%', background: p.accent }} />{d.date}
          </div>
        )}
        {d.body && <div style={{ ...kd(st), fontSize: f(30), lineHeight: 1.45, whiteSpace: 'pre-line' }}>{d.body}</div>}
        <div className="flex-1" />
        {d.offer && <div style={{ ...kd(st), fontSize: f(34), color: p.accent }}>{d.offer}</div>}
        {d.brand && <div style={{ ...kd(st), fontSize: f(34) }}>{d.brand}</div>}
        {d.contact && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, opacity: 0.85 }}>{d.contact}</div>}
      </div>
    </div>
  );
}

/** Festival greeting: glowing centre visual, palm leaves, big script greeting at the bottom. */
function AdFestival(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 35%, ${p.accent2}, ${p.bg2} 45%, ${p.bg} 90%)`, color: p.ink }}>
      <div className="absolute" style={{ left: '8%', right: '8%', top: '8%', height: '62%' }}>
        <Picture d={d} st={st} className="absolute inset-0" style={feather('ellipse 50% 50% at 50% 50%', 60)} />
      </div>
      <Palm width={u(320)} style={{ position: 'absolute', left: -u(20), top: -u(10) }} />
      <Palm width={u(320)} flip style={{ position: 'absolute', right: -u(20), top: -u(10) }} />
      <div className="absolute flex justify-between items-center" style={{ top: u(36), left: u(240), right: u(240) }}>
        <div style={{ margin: '0 auto' }}><BrandMark L={L} color={p.ink} size={30} center /></div>
      </div>
      <div className="absolute inset-x-0 flex flex-col items-center text-center" style={{ bottom: u(44), padding: `0 ${u(50)}px`, gap: u(6) }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(34), fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase' }}>{d.subhead}</div>}
        {ttl.map((t, i) => (
          <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, i === 0 ? 170 : 96, w * 0.84), lineHeight: 1.1, color: '#fff', textShadow: `${outline(p.accent, u(7))}, 0 0 ${u(40)}px ${p.accent2}` }}>{t}</div>
        ))}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 600, maxWidth: u(820), lineHeight: 1.4 }}>{d.body}</div>}
        <div className="flex items-center flex-wrap justify-center" style={{ gap: u(16), marginTop: u(10) }}>
          {d.date && <span style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(8)}px ${u(22)}px`, borderRadius: 999 }}>{d.date}</span>}
          {d.offer && <span style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, background: '#fff', color: '#111', padding: `${u(8)}px ${u(22)}px`, borderRadius: 999 }}>{d.offer}</span>}
        </div>
        {d.contact && w <= h * 1.2 && <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, marginTop: u(6) }}>{d.contact}</div>}
      </div>
    </div>
  );
}

/** Winner / felicitation: social-post photo card with medal, swirls, big title below. */
function AdAchievement(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  const card = Math.min(w * 0.46, h * 0.38);
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center overflow-hidden" style={{ background: `linear-gradient(180deg, ${p.bg2}, ${p.bg})`, color: p.ink, padding: `${u(60)}px ${u(40)}px ${u(40)}px` }}>
      <div className="absolute" style={{ top: '40%', left: 0, right: 0, ...kd(st), fontSize: f(150), opacity: 0.07, whiteSpace: 'nowrap', fontStyle: 'italic' }}>{d.subhead} {d.subhead}</div>
      <Swirl size={u(150)} color={`${p.ink}aa`} style={{ position: 'absolute', left: u(90), top: u(260) }} />
      <Swirl size={u(150)} color={`${p.ink}aa`} style={{ position: 'absolute', right: u(90), top: u(220), transform: 'scaleX(-1)' }} />
      <div className="relative" style={{ background: '#fff', padding: `${u(16)}px ${u(16)}px ${u(64)}px`, borderRadius: u(18), transform: 'rotate(-2deg)', boxShadow: '0 24px 60px rgba(0,0,0,.35)' }}>
        <Picture d={d} st={st} style={{ width: card, height: card * 1.05, borderRadius: u(10) }} />
        <div className="absolute flex items-center" style={{ left: u(22), bottom: u(14), gap: u(10), color: '#111', ...bodyFont(st), fontSize: f(26), fontWeight: 800 }}>
          <span style={{ color: '#e11d48' }}>♥</span>{lines(d.body)[0] || d.brand}
        </div>
        <div className="absolute flex items-center justify-center" style={{ right: -u(40), bottom: u(20), width: u(110), height: u(110), borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff3b0, #d4a017 60%, #8a6508)', border: `${u(5)}px solid #fde68a`, ...kd(st), fontSize: f(54), color: '#5b3d00' }}>1</div>
      </div>
      {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700, marginTop: u(46), fontStyle: 'italic', opacity: 0.85 }}>{d.subhead}</div>}
      {d.offer && <div style={{ ...kd(st), fontSize: f(36), marginTop: u(6) }}>{d.offer}</div>}
      <div className="relative" style={{ marginTop: u(8) }}>
        {ttl.map((t, i) => <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, d.headline, 150, w * 0.9), lineHeight: 1.08, color: p.accent }}>{t}</div>)}
      </div>
      <div className="flex-1" />
      <div className="flex items-center" style={{ gap: u(14), ...bodyFont(st), fontSize: f(24), fontWeight: 700 }}>
        <BrandMark L={L} color={p.ink} size={26} />{d.date && <span>| {d.date}</span>}
      </div>
    </div>
  );
}

/** Clinic / course ad: question headline, highlighted box, round photo, badge, contact strip. */
function AdClinic(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  const circle = Math.min(w, h) * 0.46;
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${p.bg}, ${p.bg2})`, color: p.ink }}>
      <div className="absolute" style={{ right: -circle * 0.25, top: h * 0.2, width: circle * 1.3, height: circle * 1.3, borderRadius: '50%', background: '#ffffff55' }} />
      <div className="absolute flex justify-between items-center" style={{ top: u(36), left: u(44), right: u(44) }}>
        <BrandMark L={L} color={p.ink} size={40} />
        <div className="flex items-center" style={{ gap: u(10), ...bodyFont(st), fontSize: f(22), fontWeight: 800 }}>Follow us <Socials size={u(42)} color="#fff" bg={p.accent} /></div>
      </div>
      <div className="absolute" style={{ right: u(40), top: h * 0.24, width: circle, height: circle, borderRadius: '50%', overflow: 'hidden', border: `${u(10)}px solid #fff`, boxShadow: '0 24px 50px rgba(0,0,0,.2)' }}>
        <Picture d={d} st={st} className="absolute inset-0" />
      </div>
      <div className="absolute flex flex-col items-start" style={{ left: u(44), top: h * 0.17, width: w - circle - u(110), gap: u(14) }}>
        {ttl.map((t, i) => <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, d.headline, 66, w - circle - u(110)), lineHeight: 1.2, color: p.ink }}>{t}</div>)}
        {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 54, 12)), lineHeight: 1.05, background: p.accent, color: p.onAccent, padding: `${u(12)}px ${u(24)}px`, borderRadius: u(14), boxShadow: `0 ${u(10)}px ${u(20)}px ${p.accent}55` }}>{d.subhead}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(25), fontWeight: 600, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{d.body}</div>}
        {d.cta && <span style={{ ...kd(st), fontSize: f(32), background: p.ink, color: '#fff', padding: `${u(14)}px ${u(38)}px`, borderRadius: u(12) }}>{d.cta}</span>}
      </div>
      {d.offer && (
        <div className="absolute flex items-center justify-center text-center" style={{ left: u(44), bottom: u(150), width: u(170), height: u(170), borderRadius: '50%', background: '#fff', color: p.accent, border: `${u(6)}px solid ${p.accent}`, padding: u(16), ...kd(st), fontSize: f(fit(d.offer, 34, 8)), lineHeight: 1.05 }}>{d.offer}</div>
      )}
      <div className="absolute flex items-center justify-between flex-wrap" style={{ left: 0, right: 0, bottom: 0, background: '#fff', padding: `${u(22)}px ${u(44)}px`, gap: u(14), color: '#111' }}>
        <ContactPill L={L} bg={`${p.bg2}`} color="#111" iconBg={p.accent} iconColor="#fff" />
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, textAlign: 'right' }}>{d.address}{d.date && <div style={{ color: p.accent }}>{d.date}</div>}</div>
      </div>
    </div>
  );
}

/** News-card style: photo top, quoted headline on black bars, red subline, URL pill. */
function AdNews(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const ttl = lines(d.headline);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#fff', color: '#111' }}>
      <div className="relative" style={{ height: '56%' }}>
        <Picture d={d} st={st} className="absolute inset-0" />
        {d.date && <span className="absolute" style={{ top: u(30), left: u(36), ...bodyFont(st), fontSize: f(28), fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.6)' }}>{d.date}</span>}
      </div>
      <div className="relative flex flex-col items-center text-center flex-1" style={{ marginTop: -u(70), padding: `0 ${u(40)}px ${u(30)}px`, gap: u(10) }}>
        <div className="flex flex-col items-center" style={{ gap: u(8) }}>
          {ttl.map((t, i) => (
            <span key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, d.headline, 104, w * 0.8), lineHeight: 1.12, background: '#0b0b0b', color: p.accent, padding: `${u(2)}px ${u(26)}px`, transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>{i === 0 ? `‘${t}` : t}{i === ttl.length - 1 ? '’' : ''}</span>
          ))}
        </div>
        {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 48, 22)), lineHeight: 1.2, marginTop: u(8) }}>{d.subhead}</div>}
        {d.offer && <div style={{ ...kd(st), fontSize: f(fit(d.offer, 64, 14)), color: p.accent2 }}>{d.offer}</div>}
        <div className="flex-1" />
        <div className="flex flex-col items-center" style={{ gap: u(8) }}>
          {d.brand && <span style={{ ...kd(st), fontSize: f(46), background: p.accent2, color: '#fff', width: u(80), height: u(80), borderRadius: u(14), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{firstGrapheme(d.brand)}</span>}
          {d.contact && <span style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 700, background: '#5fc3e4', color: '#06263a', padding: `${u(8)}px ${u(30)}px`, borderRadius: 999 }}>{d.contact}</span>}
        </div>
      </div>
    </div>
  );
}

/** Food promo: wood board, floating dish, script + serif title, ticket CTA, perspective word. */
function AdFood(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const plate = Math.min(w, h) * 0.56;
  const big = d.offer || lines(d.headline).join(' ');
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `repeating-linear-gradient(92deg, ${p.bg} 0 ${u(30)}px, ${p.bg2} ${u(30)}px ${u(34)}px, ${p.bg} ${u(34)}px ${u(70)}px)`, color: p.ink }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 40% 40%, transparent, rgba(0,0,0,.55))' }} />
      <div className="absolute" style={{ left: '8%', right: '8%', bottom: 0, height: '30%', background: '#fff', transform: 'perspective(500px) rotateX(48deg)', transformOrigin: 'bottom' }} />
      <div className="absolute inset-x-0 text-center" style={{ bottom: u(30), ...kd(st), fontSize: f(fit(big, 140, 10)), lineHeight: 0.9, color: p.accent2, transform: 'perspective(500px) rotateX(30deg)', textTransform: 'uppercase' }}>{big}</div>
      <div className="absolute" style={{ left: -plate * 0.05, top: h * 0.08, width: plate, height: plate, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 ${u(40)}px ${u(60)}px rgba(0,0,0,.6)`, border: `${u(10)}px solid #f5efe6` }}>
        <Picture d={d} st={st} className="absolute inset-0" />
      </div>
      <div className="absolute flex flex-col items-end text-right" style={{ right: u(50), top: h * 0.1, width: w - plate - u(60), gap: u(14) }}>
        <BrandMark L={L} color={p.ink} size={26} />
        {d.subhead && <div style={{ fontFamily: "'Pacifico','Chilanka',cursive", fontSize: f(fit(d.subhead, 56, 12)), color: p.accent }}>{d.subhead}</div>}
        <div style={{ ...kd(st), fontSize: titleSize(L, d.headline, 82, w - plate - u(70)), lineHeight: 1.05, whiteSpace: 'pre', textShadow: '0 6px 16px rgba(0,0,0,.5)' }}>{d.headline}</div>
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), lineHeight: 1.45, opacity: 0.9, whiteSpace: 'pre-line' }}>{lines(d.body).slice(0, 4).join('\n')}</div>}
        {d.cta && (
          <span style={{ ...kd(st), fontSize: f(36), background: '#f3d9a4', color: '#3b2412', padding: `${u(12)}px ${u(34)}px`, clipPath: 'polygon(6% 0,94% 0,100% 50%,94% 100%,6% 100%,0 50%)' }}>{d.cta}</span>
        )}
        {d.contact && <div style={{ ...bodyFont(st), fontSize: f(36), fontWeight: 800, color: p.accent }}>{d.contact}</div>}
        {d.address && <div style={{ ...bodyFont(st), fontSize: f(22) }}>{d.address}</div>}
      </div>
    </div>
  );
}

/** Kerala map filled with the photo/artwork beside a stacked title. */
function AdMap(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  const mapH = h * 0.86, mapW = Math.min(mapH * 0.5, w * 0.4);
  const colW = w - mapW - w * 0.06 - u(110);
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink }}>
      <div className="absolute" style={{ right: w * 0.06, top: (h - mapH) / 2, width: mapW, height: mapH, filter: `drop-shadow(0 ${u(20)}px ${u(20)}px rgba(0,0,0,.25))` }}>
        <div className="absolute inset-0" style={{ clipPath: KERALA, background: p.accent }} />
        <Picture d={d} st={st} className="absolute" style={{ inset: u(6), clipPath: KERALA }} />
      </div>
      <div className="absolute flex flex-col justify-center" style={{ left: u(60), top: 0, bottom: 0, width: colW, gap: u(10) }}>
        <BrandMark L={L} color={p.ink} size={30} />
        {d.date && <div style={{ ...bodyFont(st), fontSize: f(34), fontWeight: 800, color: p.accent2, marginTop: u(20) }}>{d.date}</div>}
        {ttl.map((t, i) => <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, i === ttl.length - 1 && ttl.length > 1 ? 90 : 130, colW), lineHeight: 1.1, color: p.accent }}>{t}</div>)}
        {d.subhead && <div style={{ ...kd(st), fontSize: f(40), color: p.ink }}>{d.subhead}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(26), lineHeight: 1.45, opacity: 0.85, whiteSpace: 'pre-line' }}>{d.body}</div>}
        {d.contact && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, marginTop: u(20) }}>{d.contact}</div>}
      </div>
    </div>
  );
}

type KeralaLayout = { label: string; render: (L: LayoutProps) => ReactNode; palettes: Palette[]; fonts: [PosterFontKey, PosterFontKey][] };

export const KERALA_LAYOUTS: Record<string, KeralaLayout> = {
  adProduct: { label: 'Product showcase', render: AdProduct, fonts: [['anekMl', 'poppins'], ['baloo', 'montserrat']], palettes: [
    pal('#8a8178', '#bdb4a8', '#ffffff', '#3a2f26', '#f5c518', '#ffffff'), pal('#0f3b2e', '#2f6b55', '#ffffff', '#0a2219', '#facc15', '#ffffff'), pal('#3b0d1a', '#7a2440', '#ffffff', '#1a0610', '#fbbf24', '#ffffff')] },
  adGiantLetter: { label: 'Giant letter', render: AdGiantLetter, fonts: [['anekMl', 'poppins'], ['notoSansMl', 'montserrat']], palettes: [
    pal('#6e3a3e', '#8e5258', '#f6eadf', '#e8b4a0', '#fde68a', '#3b1d20'), pal('#25343f', '#3b5262', '#eef4f8', '#7dd3fc', '#fde68a', '#0f1a22'), pal('#3f4a2f', '#5b6b43', '#f4f1e6', '#d9f99d', '#fde68a', '#1f2615')] },
  adServices: { label: 'Services night', render: AdServices, fonts: [['baloo', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#0b1033', '#3b2a7a', '#ffffff', '#f59e0b', '#9a3412', '#111111'), pal('#04211c', '#0f5b4b', '#ffffff', '#facc15', '#a16207', '#111111'), pal('#1a0b2e', '#6d28d9', '#ffffff', '#fb7185', '#9f1239', '#111111')] },
  adPromo: { label: 'Price promo', render: AdPromo, fonts: [['anekMl', 'poppins'], ['baloo', 'montserrat']], palettes: [
    pal('#f6f3ee', '#e9d8c4', '#1a1a1a', '#e11d48', '#111111', '#ffffff'), pal('#fff7e6', '#ffe0a3', '#1f1300', '#ea580c', '#111111', '#ffffff'), pal('#eef6ff', '#cfe3ff', '#0b1b33', '#2563eb', '#111111', '#ffffff')] },
  adEvent: { label: 'Event & bunting', render: AdEvent, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#fef3c7', '#bbf7d0', '#1f1300', '#e11d48', '#7c2d12', '#ffffff'), pal('#ecfccb', '#bae6fd', '#0f1f10', '#9333ea', '#be123c', '#ffffff'), pal('#ffedd5', '#fde68a', '#291400', '#dc2626', '#1d4ed8', '#ffffff')] },
  adArch: { label: 'Arch & lanterns', render: AdArch, fonts: [['notoSerifMl', 'manjari'], ['baloo', 'poppins']], palettes: [
    pal('#3b1d0e', '#5c2a14', '#fdf1d6', '#e9b44c', '#fde68a', '#3b1d0e'), pal('#0c2a24', '#134e43', '#e9fff8', '#d4af37', '#fde68a', '#0c2a24'), pal('#1e1338', '#31205a', '#f4efff', '#e9c46a', '#fde68a', '#1e1338')] },
  adFestival: { label: 'Festival glow', render: AdFestival, fonts: [['chilanka', 'poppins'], ['baloo', 'montserrat'], ['anekMl', 'poppins']], palettes: [
    pal('#3b1a00', '#b45309', '#fff7e6', '#7c2d12', '#fde047', '#ffffff'), pal('#0b3d2e', '#4d9b6e', '#ffffff', '#14532d', '#fef08a', '#ffffff'), pal('#3b0764', '#a855f7', '#ffffff', '#6b21a8', '#f9a8d4', '#ffffff')] },
  adAchievement: { label: 'Winner card', render: AdAchievement, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#04381f', '#0b6b3a', '#ffffff', '#86efac', '#fde68a', '#04381f'), pal('#0b1d4d', '#1d4ed8', '#ffffff', '#93c5fd', '#fde68a', '#0b1d4d'), pal('#4a0d0d', '#9f1239', '#ffffff', '#fda4af', '#fde68a', '#4a0d0d')] },
  adClinic: { label: 'Clinic & course', render: AdClinic, fonts: [['anekMl', 'poppins'], ['notoSansMl', 'montserrat']], palettes: [
    pal('#dff7f3', '#9ee6dc', '#0b3b3a', '#0f766e', '#134e4a', '#ffffff'), pal('#e0f2fe', '#a5d8ff', '#0c2a4a', '#0369a1', '#0c4a6e', '#ffffff'), pal('#fdf2f8', '#fbcfe8', '#4a0d2e', '#be185d', '#831843', '#ffffff')] },
  adNews: { label: 'News card', render: AdNews, fonts: [['anekMl', 'poppins'], ['notoSansMl', 'montserrat']], palettes: [
    pal('#ffffff', '#f1f5f9', '#111111', '#facc15', '#dc2626', '#111111'), pal('#ffffff', '#f1f5f9', '#111111', '#4ade80', '#1d4ed8', '#111111'), pal('#ffffff', '#f1f5f9', '#111111', '#fb923c', '#7c3aed', '#111111')] },
  adFood: { label: 'Food promo', render: AdFood, fonts: [['dmSerif', 'poppins'], ['anekMl', 'poppins']], palettes: [
    pal('#6b3a1e', '#5a3018', '#fff7ed', '#fbbf24', '#3f6212', '#3b2412'), pal('#3a2a1f', '#2e2118', '#fdf6ec', '#f97316', '#166534', '#3b2412'), pal('#4a1d1d', '#3c1717', '#fff1f2', '#fde047', '#15803d', '#3b2412')] },
  adMap: { label: 'Kerala map', render: AdMap, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#ffffff', '#f0fdf4', '#14532d', '#15803d', '#b45309', '#ffffff'), pal('#fffbeb', '#fef3c7', '#422006', '#b45309', '#15803d', '#ffffff'), pal('#f0f9ff', '#e0f2fe', '#0c4a6e', '#0e7490', '#c2410c', '#ffffff')] },
};
