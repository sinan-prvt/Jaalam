import type { CSSProperties, ReactNode } from 'react';
import { Brand, Footer, Picture } from './parts';
import { bodyFont, display, fit, type LayoutProps } from './text';

/**
 * Modern, social-media style layouts: bento grids, glassmorphism, neo-brutalism,
 * kinetic type, Swiss grids, grain gradients, Y2K chrome, duotone, stickers and
 * minimal arches.
 */

/** True when a hex colour is dark (for picking contrasting glass and lines). */
const isDark = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
};

/** Pill tag. */
function Tag({ children, bg, color, border, style, L }: { children: ReactNode; bg: string; color: string; border?: string; style?: CSSProperties; L: LayoutProps }) {
  return (
    <span style={{ ...bodyFont(L.st), display: 'inline-flex', alignItems: 'center', gap: L.u(10), background: bg, color, border, borderRadius: 999, padding: `${L.u(12)}px ${L.u(28)}px`, fontSize: L.f(26), fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  );
}

/** Four-point sparkle. */
function Sparkle({ size, color, style }: { size: number; color: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill={color} />
    </svg>
  );
}

const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`;

// ─────────────────────────────────────────────

export function Bento(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const tall = h > w * 1.25;
  const areas = tall
    ? `"head head" "img img" "img img" "offer date" "brand cta"`
    : `"head head img img" "head head img img" "offer date img img" "brand brand cta cta"`;
  const tile = (area: string, style: CSSProperties, children?: ReactNode) => (
    <div style={{ gridArea: area, borderRadius: u(40), overflow: 'hidden', position: 'relative', padding: u(34), display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...style }}>{children}</div>
  );
  return (
    <div className="absolute inset-0" style={{ background: p.bg, padding: u(36), display: 'grid', gridTemplateAreas: areas, gridTemplateColumns: tall ? '1fr 1fr' : 'repeat(4, 1fr)', gridAutoRows: '1fr', gap: u(20) }}>
      {tile('head', { background: p.accent, color: p.onAccent }, (
        <>
          {d.subhead ? <Tag L={L} bg={p.onAccent} color={p.accent} style={{ alignSelf: 'flex-start' }}>{d.subhead}</Tag> : <span />}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 92, tall ? 14 : 9)), lineHeight: 0.98, letterSpacing: '-0.02em' }}>{d.headline}</div>
        </>
      ))}
      {tile('img', { padding: 0 }, <Picture d={d} st={st} className="absolute inset-0" />)}
      {tile('offer', { background: p.ink, color: p.bg, justifyContent: 'flex-end' }, (
        <div style={{ ...display(st), fontSize: f(fit(d.offer || d.cta, 52, 16, 5.5)), lineHeight: 1 }}>{d.offer || d.cta}</div>
      ))}
      {tile('date', { background: p.bg2, color: p.ink }, (
        <>
          <span style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{d.date ? 'When' : 'Info'}</span>
          <div style={{ ...bodyFont(st), fontSize: f(d.date ? fit(d.date, 34, 40, 8) : 24), fontWeight: 700, lineHeight: 1.2, whiteSpace: 'pre-line' }}>{d.date || d.body.split('\n')[0]}</div>
        </>
      ))}
      {tile('brand', { background: p.bg2, color: p.ink, justifyContent: 'center', gap: u(10) }, (
        <>
          <Brand {...L} color={p.ink} />
          <Footer {...L} color={p.ink} />
        </>
      ))}
      {tile('cta', { background: p.accent2, color: p.onAccent, flexDirection: 'row', alignItems: 'center' }, (
        <>
          <span style={{ ...display(st), fontSize: f(40), lineHeight: 1 }}>{d.cta || 'Contact us'}</span>
          <span style={{ width: u(84), height: u(84), borderRadius: '50%', background: p.onAccent, color: p.accent2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: f(44), fontWeight: 800, flexShrink: 0 }}>↗</span>
        </>
      ))}
    </div>
  );
}

export function Glass(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  const dark = isDark(p.bg);
  const glass: CSSProperties = {
    background: dark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.55)',
    border: `${u(2)}px solid ${dark ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.9)'}`,
    boxShadow: `0 ${u(30)}px ${u(80)}px rgba(0,0,0,.25), inset 0 ${u(2)}px 0 rgba(255,255,255,.5)`,
    borderRadius: u(56),
  };
  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(60% 50% at 15% 10%, ${p.accent} 0%, transparent 70%), radial-gradient(55% 55% at 90% 30%, ${p.accent2} 0%, transparent 70%), radial-gradient(70% 60% at 50% 100%, ${p.bg2} 0%, transparent 70%), ${p.bg}` }}>
      <div className="absolute inset-0" style={{ backgroundImage: NOISE, opacity: 0.25, mixBlendMode: 'overlay' }} />
      <div className="absolute" style={{ top: u(44), left: u(44), right: u(44), bottom: '42%', borderRadius: u(56), overflow: 'hidden', border: `${u(2)}px solid rgba(255,255,255,.5)` }}>
        <Picture d={d} st={st} className="absolute inset-0" />
        <div className="absolute" style={{ top: u(28), left: u(28), ...glass, borderRadius: 999, padding: `${u(12)}px ${u(26)}px`, background: 'rgba(255,255,255,.75)' }}>
          <Brand {...L} color="#111" />
        </div>
      </div>
      <div className="absolute flex flex-col justify-between" style={{ left: u(44), right: u(44), bottom: u(44), top: '50%', padding: u(52), color: p.ink, ...glass }}>
        <div className="flex flex-wrap" style={{ gap: u(12) }}>
          {d.subhead && <Tag L={L} bg={p.ink} color={p.bg}>{d.subhead}</Tag>}
          {d.date && <Tag L={L} bg="transparent" color={p.ink} border={`${u(2)}px solid ${p.ink}`}>{d.date}</Tag>}
        </div>
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 96, 14)), lineHeight: 1, letterSpacing: '-0.02em' }}>{d.headline}</div>
        <div className="flex items-end justify-between flex-wrap" style={{ gap: u(16) }}>
          <div>
            {d.offer && <div style={{ ...display(st), fontSize: f(44), color: dark ? p.accent : p.ink }}>{d.offer}</div>}
            <Footer {...L} color={p.ink} />
          </div>
          {d.cta && <Tag L={L} bg={p.ink} color={p.bg} style={{ fontSize: f(28), padding: `${u(18)}px ${u(40)}px` }}>{d.cta} →</Tag>}
        </div>
      </div>
    </div>
  );
}

export function Brutal(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  const ink = isDark(p.bg) ? '#ffffff' : '#111111';
  const edge = (shadow = 12): CSSProperties => ({ border: `${u(6)}px solid ${ink}`, boxShadow: `${u(shadow)}px ${u(shadow)}px 0 ${ink}` });
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: ink, padding: u(50), gap: u(30) }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${ink}22 ${u(2.5)}px, transparent ${u(2.5)}px)`, backgroundSize: `${u(34)}px ${u(34)}px` }} />
      <div className="relative flex justify-between items-center" style={{ gap: u(16) }}>
        <div style={{ ...edge(6), background: p.bg2, borderRadius: 999, padding: `${u(10)}px ${u(26)}px` }}><Brand {...L} color={ink} /></div>
        {d.date && <span style={{ ...bodyFont(st), ...edge(6), background: p.accent2, color: '#111', fontSize: f(24), fontWeight: 800, padding: `${u(10)}px ${u(22)}px`, borderRadius: u(14) }}>{d.date}</span>}
      </div>
      <div className="relative" style={{ ...edge(), background: p.accent, color: p.onAccent, padding: `${u(26)}px ${u(36)}px`, borderRadius: u(28), transform: 'rotate(-1.5deg)' }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.subhead}</div>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 104, 12)), lineHeight: 0.95, textTransform: 'uppercase' }}>{d.headline}</div>
      </div>
      <div className="relative flex-1" style={{ minHeight: u(200) }}>
        <div className="absolute" style={{ inset: 0, right: u(20), ...edge(), borderRadius: u(28), overflow: 'hidden', transform: 'rotate(1deg)' }}>
          <Picture d={d} st={st} className="absolute inset-0" />
        </div>
        {d.offer && (
          <div className="absolute flex items-center justify-center text-center" style={{ right: -u(10), top: -u(40), width: u(230), height: u(230), borderRadius: '50%', background: p.accent2, color: '#111', ...edge(8), padding: u(26), transform: 'rotate(10deg)' }}>
            <span style={{ ...display(st), fontSize: f(fit(d.offer, 44, 10)), lineHeight: 1 }}>{d.offer}</span>
          </div>
        )}
      </div>
      <div className="relative flex items-center justify-between flex-wrap" style={{ gap: u(16) }}>
        <Footer {...L} color={ink} />
        {d.cta && <span style={{ ...bodyFont(st), ...edge(8), background: ink, color: p.bg, fontSize: f(30), fontWeight: 800, padding: `${u(18)}px ${u(36)}px`, borderRadius: u(18), textTransform: 'uppercase' }}>{d.cta} →</span>}
      </div>
    </div>
  );
}

export function Kinetic(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const bg = isDark(p.bg) ? p.bg : p.ink, fg = isDark(p.bg) ? p.ink : p.bg;
  const word = d.headline || d.brand;
  const rows = Math.max(5, Math.round(h / (w * 0.2)));
  const size = f(fit(word, 150, 7));
  const circle = Math.min(w, h) * 0.46;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg, color: fg }}>
      <div className="absolute inset-0 flex flex-col justify-center" style={{ gap: u(4) }}>
        {Array.from({ length: rows }, (_, i) => {
          const mid = i === Math.floor(rows / 2);
          return (
            <div key={i} style={{ ...display(st), fontSize: size, lineHeight: 0.95, whiteSpace: 'nowrap', textTransform: 'uppercase', marginLeft: -u(60) - (i % 3) * u(120), color: mid ? p.accent : 'transparent', WebkitTextStroke: mid ? undefined : `${u(2.5)}px ${fg}55` }}>
              {`${word} • ${word} • ${word}`}
            </div>
          );
        })}
      </div>
      <div className="absolute" style={{ width: circle, height: circle, right: u(70), top: '50%', transform: 'translateY(-50%)', borderRadius: '50%', overflow: 'hidden', border: `${u(10)}px solid ${p.accent}`, boxShadow: `0 0 0 ${u(16)}px ${bg}` }}>
        <Picture d={d} st={st} className="absolute inset-0" />
      </div>
      <div className="absolute flex justify-between items-start" style={{ top: u(48), left: u(52), right: u(52) }}>
        <Brand {...L} color={fg} />
        {d.date && <span style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{d.date}</span>}
      </div>
      <div className="absolute flex items-end justify-between flex-wrap" style={{ left: u(52), right: u(52), bottom: u(48), gap: u(16) }}>
        <div>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700, marginBottom: u(10) }}>{d.subhead}</div>}
          <Footer {...L} color={fg} />
        </div>
        {(d.offer || d.cta) && <Tag L={L} bg={p.accent} color={p.onAccent} style={{ fontSize: f(32), padding: `${u(18)}px ${u(40)}px` }}>{d.offer || d.cta}</Tag>}
      </div>
    </div>
  );
}

export function Swiss(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ink = p.ink;
  const big = d.offer || d.date;
  const tall = h > w * 1.25;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: ink }}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} className="absolute top-0 bottom-0" style={{ left: `${((i + 1) * 100) / 12}%`, width: 1, background: `${ink}14` }} />)}
      <div className="absolute" style={{ right: -u(160), top: -u(160), width: u(520), height: u(520), borderRadius: '50%', background: p.accent2, opacity: 0.9 }} />
      <div className="absolute flex flex-col" style={{ inset: u(56), gap: u(24) }}>
        <div className="flex justify-between items-start" style={{ borderTop: `${u(6)}px solid ${ink}`, paddingTop: u(14) }}>
          <Brand {...L} color={ink} />
          <span style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', maxWidth: '40%', textAlign: 'right' }}>{d.subhead}</span>
        </div>
        {big && <div style={{ ...display(st), fontSize: f(fit(big, 200, 6)), lineHeight: 0.85, letterSpacing: '-0.05em', color: p.accent, marginTop: u(10) }}>{big}</div>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 96, tall ? 12 : 9)), lineHeight: 0.95, letterSpacing: '-0.03em', maxWidth: tall ? '100%' : '62%' }}>{d.headline}</div>
        <div className="flex-1 relative" style={{ display: 'grid', gridTemplateColumns: tall ? '1fr' : '1fr 1fr', gap: u(28), minHeight: u(180) }}>
          <div className="flex flex-col justify-end" style={{ gap: u(14), order: tall ? 2 : 1 }}>
            {d.body && <div style={{ ...bodyFont(st), fontSize: f(26), lineHeight: 1.4, whiteSpace: 'pre-line' }}>{d.body}</div>}
            {d.date && d.offer && <div style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 800 }}>{d.date}</div>}
            <Footer {...L} color={ink} />
            {d.cta && <div style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 800, borderBottom: `${u(4)}px solid ${p.accent}`, alignSelf: 'flex-start', paddingBottom: u(4) }}>{d.cta} →</div>}
          </div>
          <div className="relative" style={{ order: tall ? 1 : 2, minHeight: u(240) }}>
            <Picture d={d} st={st} className="absolute inset-0" style={{ filter: 'grayscale(1) contrast(1.1)' }} />
            <div className="absolute" style={{ left: 0, bottom: 0, width: u(70), height: u(70), background: p.accent }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Grain(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const dark = isDark(p.bg);
  const ink = dark ? '#ffffff' : p.ink;
  const pic = Math.min(w, h) * 0.3;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between text-center" style={{ background: `radial-gradient(80% 60% at 20% 15%, ${p.accent} 0%, transparent 65%), radial-gradient(70% 70% at 85% 80%, ${p.accent2} 0%, transparent 65%), radial-gradient(60% 60% at 60% 30%, ${p.bg2} 0%, transparent 70%), ${p.bg}`, color: ink, padding: `${u(64)}px ${u(64)}px` }}>
      <div className="absolute inset-0" style={{ backgroundImage: NOISE, opacity: 0.45, mixBlendMode: 'overlay' }} />
      <div className="relative w-full flex justify-between items-center">
        <Brand {...L} color={ink} />
        {d.date && <Tag L={L} bg="transparent" color={ink} border={`${u(2)}px solid ${ink}`}>{d.date}</Tag>}
      </div>
      <div className="relative flex flex-col items-center" style={{ gap: u(22) }}>
        {d.subhead && <Tag L={L} bg={ink} color={dark ? p.bg : '#fff'}>{d.subhead}</Tag>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 130, 12)), lineHeight: 0.95, letterSpacing: '-0.02em', fontStyle: 'italic' }}>{d.headline}</div>
        {d.offer && <div style={{ ...display(st), fontSize: f(54) }}>{d.offer}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(26), lineHeight: 1.45, maxWidth: u(760), opacity: 0.85, whiteSpace: 'pre-line' }}>{d.body}</div>}
      </div>
      <div className="relative w-full flex items-end justify-between" style={{ gap: u(20) }}>
        <div style={{ width: pic, height: pic * 1.15, borderRadius: u(36), overflow: 'hidden', border: `${u(4)}px solid ${ink}33`, transform: 'rotate(-4deg)', flexShrink: 0 }}>
          <Picture d={d} st={st} className="w-full h-full" />
        </div>
        <div className="flex flex-col items-end text-right" style={{ gap: u(16) }}>
          <Footer {...L} color={ink} />
          {d.cta && <Tag L={L} bg={ink} color={dark ? p.bg : '#fff'} style={{ fontSize: f(28), padding: `${u(18)}px ${u(40)}px` }}>{d.cta}</Tag>}
        </div>
      </div>
    </div>
  );
}

export function Chrome(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const bg = '#07070b';
  const chrome: CSSProperties = { backgroundImage: 'linear-gradient(180deg,#ffffff 0%,#d9dde3 30%,#8c939c 48%,#ffffff 52%,#b9c0c8 70%,#ffffff 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 ${u(4)}px ${u(10)}px ${p.accent}88)` };
  const capW = Math.min(w * 0.7, h * 0.42);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between text-center overflow-hidden" style={{ background: `radial-gradient(70% 45% at 50% 0%, ${p.accent}66, transparent 70%), radial-gradient(60% 40% at 50% 100%, ${p.accent2}55, transparent 70%), ${bg}`, color: '#fff', padding: `${u(56)}px ${u(56)}px` }}>
      {/* Perspective grid floor */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: '38%', backgroundImage: `linear-gradient(${p.accent}88 ${u(2)}px, transparent ${u(2)}px), linear-gradient(90deg, ${p.accent}88 ${u(2)}px, transparent ${u(2)}px)`, backgroundSize: `${u(80)}px ${u(80)}px`, transform: 'perspective(400px) rotateX(60deg)', transformOrigin: 'bottom', opacity: 0.6 }} />
      <Sparkle size={u(90)} color="#fff" style={{ position: 'absolute', left: u(80), top: u(200) }} />
      <Sparkle size={u(54)} color={p.accent} style={{ position: 'absolute', right: u(110), top: u(140) }} />
      <Sparkle size={u(70)} color={p.accent2} style={{ position: 'absolute', right: u(90), bottom: '30%' }} />
      <div className="relative w-full flex justify-between items-center">
        <Brand {...L} color="#fff" />
        {d.date && <Tag L={L} bg="transparent" color="#fff" border={`${u(2)}px solid rgba(255,255,255,.6)`}>{d.date}</Tag>}
      </div>
      <div className="relative flex flex-col items-center" style={{ gap: u(20) }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(28), letterSpacing: '0.35em', textTransform: 'uppercase', color: p.accent, fontWeight: 700 }}>{d.subhead}</div>}
        <div style={{ ...display(st), ...chrome, fontSize: f(fit(d.headline, 120, 11)), lineHeight: 0.95, textTransform: 'uppercase' }}>{d.headline}</div>
      </div>
      <div className="relative" style={{ width: capW, height: capW * 0.62, borderRadius: 999, padding: u(6), background: `linear-gradient(90deg, ${p.accent}, #fff, ${p.accent2})` }}>
        <div className="w-full h-full overflow-hidden relative" style={{ borderRadius: 999 }}>
          <Picture d={d} st={st} className="absolute inset-0" />
        </div>
      </div>
      <div className="relative flex flex-col items-center" style={{ gap: u(16) }}>
        {d.offer && <Tag L={L} bg="transparent" color="#fff" border={`${u(3)}px solid ${p.accent}`} style={{ fontSize: f(36), padding: `${u(14)}px ${u(40)}px`, boxShadow: `0 0 ${u(30)}px ${p.accent}` }}>{d.offer}</Tag>}
        <Footer {...L} color="#ffffffcc" center />
      </div>
    </div>
  );
}

export function Duotone(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: p.accent }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ filter: 'grayscale(1) contrast(1.15)', mixBlendMode: 'multiply' }} />
      <div className="absolute inset-0" style={{ background: p.accent2, mixBlendMode: 'lighten', opacity: 0.55 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.3), transparent 35%, transparent 55%, rgba(0,0,0,.45))' }} />
      <div className="absolute flex justify-between items-start" style={{ top: u(48), left: u(52), right: u(52), color: '#fff' }}>
        <Brand {...L} color="#fff" />
        {d.date && <Tag L={L} bg="#fff" color="#111">{d.date}</Tag>}
      </div>
      {d.offer && (
        <div className="absolute flex items-center justify-center text-center" style={{ right: u(52), top: u(150), width: u(220), height: u(220), borderRadius: '50%', border: `${u(4)}px solid #fff`, color: '#fff', padding: u(24), transform: 'rotate(12deg)' }}>
          <span style={{ ...display(st), fontSize: f(fit(d.offer, 44, 10)), lineHeight: 1 }}>{d.offer}</span>
        </div>
      )}
      <div className="absolute left-0 right-0" style={{ bottom: u(36), padding: `0 ${u(40)}px`, color: '#fff' }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700, marginBottom: u(6), marginLeft: u(12) }}>{d.subhead}</div>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 210, 7)), lineHeight: 0.88, textTransform: 'uppercase', letterSpacing: '-0.03em', color: '#ffffff', textShadow: `0 ${u(6)}px ${u(30)}px rgba(0,0,0,.45)` }}>{d.headline}</div>
        <div className="flex items-end justify-between flex-wrap" style={{ marginTop: u(40), gap: u(16), padding: `0 ${u(12)}px` }}>
          <Footer {...L} color="#fff" />
          {d.cta && <Tag L={L} bg="#fff" color="#111" style={{ fontSize: f(28), padding: `${u(16)}px ${u(36)}px` }}>{d.cta}</Tag>}
        </div>
      </div>
    </div>
  );
}

export function Stickers(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const size = Math.min(w * 0.7, h * 0.5);
  const sticker = (rot: number, bg: string, color: string): CSSProperties => ({ ...display(st), position: 'absolute', background: bg, color, border: `${u(7)}px solid #fff`, borderRadius: u(30), padding: `${u(14)}px ${u(30)}px`, transform: `rotate(${rot}deg)`, boxShadow: `0 ${u(10)}px ${u(24)}px rgba(0,0,0,.18)`, whiteSpace: 'nowrap', lineHeight: 1.05 });
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between text-center overflow-hidden" style={{ background: p.bg, color: p.ink, padding: `${u(56)}px ${u(50)}px` }}>
      <div className="absolute" style={{ width: u(520), height: u(520), left: -u(200), top: -u(160), background: p.accent2, borderRadius: '58% 42% 63% 37% / 45% 55% 45% 55%', opacity: 0.55 }} />
      <div className="absolute" style={{ width: u(460), height: u(460), right: -u(180), bottom: -u(140), background: p.accent, borderRadius: '42% 58% 37% 63% / 55% 45% 55% 45%', opacity: 0.45 }} />
      <div className="relative flex flex-col items-center" style={{ gap: u(10) }}>
        <Brand {...L} color={p.ink} center />
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 104, 12)), lineHeight: 0.98, letterSpacing: '-0.02em' }}>{d.headline}</div>
      </div>
      <div className="relative" style={{ width: size, height: size * 0.95 }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%', border: `${u(12)}px solid #fff`, boxShadow: `0 ${u(24)}px ${u(50)}px rgba(0,0,0,.2)` }}>
          <Picture d={d} st={st} className="absolute inset-0" />
        </div>
        {d.subhead && <span style={{ ...sticker(-8, p.accent, p.onAccent), left: -u(50), top: u(20), fontSize: f(32) }}>{d.subhead}</span>}
        {d.offer && <span style={{ ...sticker(7, p.accent2, p.onAccent), right: -u(60), bottom: u(40), fontSize: f(fit(d.offer, 44, 12)) }}>{d.offer}</span>}
        {d.date && <span style={{ ...sticker(-4, p.ink, p.bg), left: u(10), bottom: -u(30), fontSize: f(26), ...bodyFont(st), fontWeight: 800 }}>{d.date}</span>}
        <Sparkle size={u(80)} color={p.accent} style={{ position: 'absolute', right: -u(20), top: -u(30) }} />
      </div>
      <div className="relative flex flex-col items-center" style={{ gap: u(14) }}>
        {d.cta && <Tag L={L} bg={p.ink} color={p.bg} style={{ fontSize: f(30), padding: `${u(18)}px ${u(44)}px` }}>{d.cta}</Tag>}
        <Footer {...L} color={p.ink} center />
      </div>
    </div>
  );
}

export function ArchMinimal(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const tall = h > w * 1.2;
  const ink = p.ink;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: ink, padding: u(56) }}>
      <div className="flex justify-between items-center" style={{ paddingBottom: u(18), borderBottom: `${u(1.5)}px solid ${ink}55` }}>
        <Brand {...L} color={ink} />
        <span style={{ ...bodyFont(st), fontSize: f(22), letterSpacing: '0.2em', textTransform: 'uppercase' }}>{d.date}</span>
      </div>
      <div className={`flex-1 flex ${tall ? 'flex-col' : 'flex-row'} items-stretch`} style={{ gap: u(48), paddingTop: u(40) }}>
        <div className="relative" style={{ flex: tall ? 1.2 : 1 }}>
          <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: `${u(600)}px ${u(600)}px ${u(8)}px ${u(8)}px` }} />
        </div>
        <div className="flex flex-col justify-center" style={{ flex: 1, gap: u(22) }}>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(22), letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent, fontWeight: 700 }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 96, 12)), lineHeight: 0.98, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{d.headline}</div>
          <div style={{ width: u(80), height: u(2), background: ink }} />
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(25), lineHeight: 1.55, opacity: 0.75, whiteSpace: 'pre-line' }}>{d.body}</div>}
          {d.offer && <div style={{ ...display(st), fontSize: f(46), color: p.accent }}>{d.offer}</div>}
          {d.cta && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: `${u(2)}px solid ${ink}`, alignSelf: 'flex-start', paddingBottom: u(6) }}>{d.cta} →</div>}
          <Footer {...L} color={ink} />
        </div>
      </div>
    </div>
  );
}
