import type { CSSProperties, ReactNode } from 'react';
import { POSTER_FONTS } from './fonts';
import { Picture } from './parts';
import { bodyFont, display, fit, lines, titleSize, type LayoutProps } from './text';

/**
 * English posters in distinct contemporary styles: big type, magazine cover,
 * diagonal split, luxury, retro sunset, neon, event ticket, collage, loud sale,
 * festive wishes, countdown, product card and minimal photo.
 */

const script = (): CSSProperties => ({ fontFamily: POSTER_FONTS.greatVibes.css, fontWeight: 400 });

const rand = (i: number) => {
  const x = Math.sin(i * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Headline lines each sized to fit `maxWidth`. */
function Lines({ L, maxWidth, base, upper, color, style, center }: { L: LayoutProps; maxWidth: number; base: number; upper?: boolean; color: string; style?: CSSProperties; center?: boolean }) {
  const { d, st } = L;
  return (
    <div style={{ color, textAlign: center ? 'center' : undefined }}>
      {lines(d.headline).map((raw, i) => {
        const t = upper ? raw.toUpperCase() : raw;
        return <div key={i} style={{ ...display(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, base, maxWidth), lineHeight: 1.02, ...style }}>{t}</div>;
      })}
    </div>
  );
}

function Barcode({ width, height, color }: { width: number; height: number; color: string }) {
  return <div style={{ width, height, background: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 4px, ${color} 4px 7px, transparent 7px 9px, ${color} 9px 10px, transparent 10px 13px)` }} />;
}

function Pill({ children, bg, color, border, style }: { children: ReactNode; bg: string; color: string; border?: string; style?: CSSProperties }) {
  return <span style={{ display: 'inline-block', background: bg, color, border, borderRadius: 999, whiteSpace: 'nowrap', ...style }}>{children}</span>;
}

/** Stacked giant uppercase type over a photo band. */
export function EBigType(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink, padding: u(48) }}>
      <div className="flex justify-between" style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <span>{d.brand}</span><span>{d.date || d.subhead}</span>
      </div>
      <div style={{ marginTop: u(24) }}>
        <Lines L={L} maxWidth={w - u(96)} base={220} upper color={p.ink} />
      </div>
      <div className="relative flex-1" style={{ marginTop: u(24), minHeight: u(200) }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: u(24) }} />
        {d.offer && (
          <div className="absolute flex items-center justify-center text-center" style={{ right: -u(14), top: -u(40), width: u(200), height: u(200), borderRadius: '50%', background: p.accent, color: p.onAccent, transform: 'rotate(12deg)', padding: u(18) }}>
            <span style={{ ...display(st), fontSize: f(fit(d.offer, 44, 10)), lineHeight: 1 }}>{d.offer}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between" style={{ marginTop: u(24), gap: u(16) }}>
        <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 600, lineHeight: 1.35 }}>{d.contact}<div style={{ opacity: 0.7, fontSize: f(20) }}>{d.address}</div></div>
        {d.cta && <Pill bg={p.ink} color={p.bg} style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, padding: `${u(16)}px ${u(36)}px` }}>{d.cta} →</Pill>}
      </div>
    </div>
  );
}

/** Magazine cover: masthead, full photo, cover lines and a barcode. */
export function EMagazine(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const mast = (d.brand || d.subhead).toUpperCase();
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: '#fff' }}>
      <Picture d={d} st={st} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.35), transparent 30%, transparent 50%, rgba(0,0,0,.75))' }} />
      <div className="absolute left-0 right-0 text-center" style={{ top: u(30) }}>
        {mast && <div style={{ ...display(st), fontSize: titleSize(L, mast, 170, w - u(80)), lineHeight: 0.9, letterSpacing: '-0.02em', color: p.accent }}>{mast}</div>}
        <div style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 700, letterSpacing: '0.3em', marginTop: u(8) }}>{(d.date || 'SPECIAL EDITION').toUpperCase()}</div>
      </div>
      <div className="absolute" style={{ left: u(52), bottom: u(56), maxWidth: '64%' }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 800, letterSpacing: '0.2em', color: p.accent, textTransform: 'uppercase' }}>{d.subhead}</div>}
        <Lines L={L} maxWidth={w * 0.62} base={96} color="#fff" style={{ fontStyle: 'italic', lineHeight: 1.05 }} />
        {lines(d.body).slice(0, 3).map((t, i) => <div key={i} style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 600, marginTop: u(6) }}>— {t}</div>)}
      </div>
      <div className="absolute flex flex-col items-end" style={{ right: u(52), bottom: u(56), gap: u(10) }}>
        {d.offer && <div style={{ ...display(st), fontSize: f(fit(d.offer, 40, 12)), background: p.accent, color: p.onAccent, padding: `${u(8)}px ${u(16)}px` }}>{d.offer}</div>}
        <div style={{ background: '#fff', padding: u(10) }}><Barcode width={u(130)} height={u(60)} color="#111" /></div>
      </div>
    </div>
  );
}

/** Photo on a diagonal, bold copy on the other side. */
export function ESplitDiagonal(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const wide = w > h;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink }}>
      <div className="absolute inset-0" style={{ background: p.accent, clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 30% 100%)' }} />
      <Picture d={d} st={st} className="absolute inset-0" style={{ clipPath: 'polygon(56% 0, 100% 0, 100% 100%, 34% 100%)' }} />
      <div className="absolute flex flex-col" style={{ left: u(56), top: u(56), bottom: u(56), width: wide ? '42%' : '50%' }}>
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.accent }}>{d.brand}</div>
        <div className="flex-1 flex flex-col justify-center">
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 600, opacity: 0.8, marginBottom: u(10) }}>{d.subhead}</div>}
          <Lines L={L} maxWidth={w * (wide ? 0.4 : 0.48)} base={120} upper color={p.ink} />
          {d.offer && <div style={{ marginTop: u(22) }}><Pill bg={p.accent} color={p.onAccent} style={{ ...display(st), fontSize: f(fit(d.offer, 36, 16)), padding: `${u(10)}px ${u(24)}px` }}>{d.offer}</Pill></div>}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), lineHeight: 1.45, marginTop: u(18), opacity: 0.85 }}>{lines(d.body).slice(0, 3).join(' · ')}</div>}
        </div>
        {d.cta && <div><Pill bg="transparent" color={p.ink} border={`${u(3)}px solid ${p.ink}`} style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, padding: `${u(12)}px ${u(30)}px` }}>{d.cta}</Pill></div>}
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, marginTop: u(16) }}>{d.contact}</div>
      </div>
    </div>
  );
}

/** Dark and gold: thin frame, centred serif, rules with a diamond. */
export function ELuxury(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const rule = (
    <div className="flex items-center justify-center" style={{ gap: u(14), margin: `${u(18)}px 0` }}>
      <span style={{ width: u(90), height: 1, background: p.accent }} />
      <span style={{ width: u(12), height: u(12), background: p.accent, transform: 'rotate(45deg)' }} />
      <span style={{ width: u(90), height: 1, background: p.accent }} />
    </div>
  );
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ opacity: 0.45 }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 45%, transparent, ${p.bg}ee 75%)` }} />
      <div className="absolute" style={{ inset: u(34), border: `1px solid ${p.accent}` }} />
      <div className="absolute" style={{ inset: u(46), border: `1px solid ${p.accent}66` }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: u(100) }}>
        <div style={{ ...bodyFont(st), fontSize: f(20), letterSpacing: '0.4em', color: p.accent, textTransform: 'uppercase' }}>{d.brand}</div>
        {rule}
        {d.subhead && <div style={{ ...script(), fontSize: f(fit(d.subhead, 64, 20)), color: p.accent, lineHeight: 1 }}>{d.subhead}</div>}
        <Lines L={L} maxWidth={w * 0.7} base={110} color={p.ink} center style={{ lineHeight: 1.08, fontWeight: 500 }} />
        {rule}
        {d.offer && <div style={{ ...bodyFont(st), fontSize: f(24), letterSpacing: '0.25em', textTransform: 'uppercase', color: p.accent }}>{d.offer}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), lineHeight: 1.6, marginTop: u(14), opacity: 0.85, maxWidth: w * 0.6 }}>{lines(d.body).slice(0, 2).join(' · ')}</div>}
      </div>
      <div className="absolute left-0 right-0 text-center" style={{ bottom: u(70), ...bodyFont(st), fontSize: f(18), letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent }}>
        {[d.cta, d.contact].filter(Boolean).join('  ·  ')}
      </div>
    </div>
  );
}

/** Seventies sunset stripes behind a round photo, chunky shadowed type. */
export function ERetro(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const bands = [p.accent2, p.accent, p.bg2, p.accent, p.accent2];
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: p.ink }}>
      <div className="relative" style={{ marginTop: u(56), padding: `0 ${u(48)}px` }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.accent2 }}>{d.subhead}</div>}
        <Lines L={L} maxWidth={w * 0.84} base={130} color={p.ink} center style={{ textShadow: `${u(6)}px ${u(6)}px 0 ${p.accent}` }} />
      </div>
      <div className="relative flex-1 w-full overflow-hidden">
        <svg className="absolute left-0 right-0 bottom-0" viewBox="0 0 200 100" preserveAspectRatio="none" style={{ width: '100%', height: '78%' }}>
          {bands.map((c, i) => <path key={i} d={`M${10 + i * 18} 100 A${90 - i * 18} ${90 - i * 18} 0 0 1 ${190 - i * 18} 100Z`} fill={c} />)}
        </svg>
        <Picture d={d} st={st} className="absolute" style={{ left: '50%', bottom: u(30), width: '42%', aspectRatio: '1 / 1', transform: 'translateX(-50%)', borderRadius: '50%', border: `${u(10)}px solid ${p.bg}` }} />
        {d.offer && <div className="absolute" style={{ right: u(50), top: u(30), transform: 'rotate(8deg)' }}><Pill bg={p.ink} color={p.bg} style={{ ...display(st), fontSize: f(fit(d.offer, 34, 14)), padding: `${u(10)}px ${u(24)}px` }}>{d.offer}</Pill></div>}
      </div>
      <div className="w-full flex items-center justify-between" style={{ background: p.ink, color: p.bg, padding: `${u(22)}px ${u(48)}px`, ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(26) }}>{d.brand}</span>
        <span style={{ fontSize: f(24) }}>{d.contact}</span>
      </div>
    </div>
  );
}

/** Night wall, glowing neon type and a neon-ringed photo. */
export function ENeon(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const glow = (c: string, s: number) => `0 0 ${u(s)}px ${c}, 0 0 ${u(s * 2.5)}px ${c}, 0 0 ${u(s * 5)}px ${c}`;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: '#fff', backgroundImage: `linear-gradient(${p.bg2} 2px, transparent 2px), linear-gradient(90deg, ${p.bg2} 2px, transparent 2px)`, backgroundSize: `${u(120)}px ${u(60)}px` }}>
      <div style={{ marginTop: u(54), ...bodyFont(st), fontSize: f(22), fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent2, textShadow: glow(p.accent2, 4) }}>{d.subhead}</div>
      <div style={{ marginTop: u(10), padding: `0 ${u(40)}px` }}>
        <Lines L={L} maxWidth={w * 0.84} base={120} color="#fff" center style={{ textShadow: glow(p.accent, 6), lineHeight: 1.1 }} />
      </div>
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ left: '50%', top: '50%', height: '82%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${u(6)}px solid ${p.accent2}`, boxShadow: glow(p.accent2, 8) }} />
      </div>
      {d.offer && <div style={{ ...display(st), fontSize: f(fit(d.offer, 46, 16)), color: p.accent, textShadow: glow(p.accent, 4) }}>{d.offer}</div>}
      <div style={{ margin: `${u(18)}px 0 ${u(48)}px` }}>
        <Pill bg="transparent" color="#fff" border={`${u(3)}px solid ${p.accent}`} style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, padding: `${u(10)}px ${u(30)}px`, boxShadow: glow(p.accent, 3) }}>{[d.cta, d.contact].filter(Boolean).join('  ·  ')}</Pill>
      </div>
    </div>
  );
}

/** An admission ticket: details on the left, tear-off stub on the right. */
export function ETicket(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const field = (label: string, value: string) => value && (
    <div>
      <div style={{ ...bodyFont(st), fontSize: f(15), fontWeight: 800, letterSpacing: '0.2em', opacity: 0.55 }}>{label}</div>
      <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
    </div>
  );
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: p.bg }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ filter: `blur(${u(10)}px)`, opacity: 0.5, transform: 'scale(1.1)' }} />
      {Array.from({ length: 26 }, (_, i) => (
        <span key={i} className="absolute" style={{ left: `${rand(i) * 100}%`, top: `${rand(i + 30) * 100}%`, width: u(14), height: u(26), background: [p.accent, p.accent2, '#fff'][i % 3], transform: `rotate(${rand(i + 7) * 360}deg)`, borderRadius: u(3) }} />
      ))}
      <div className="relative flex" style={{ width: '86%', minHeight: '56%', background: '#fff', color: '#111', borderRadius: u(28), boxShadow: `0 ${u(30)}px ${u(60)}px rgba(0,0,0,.35)`, transform: 'rotate(-3deg)' }}>
        <div className="flex-1 flex flex-col" style={{ padding: u(44), gap: u(18) }}>
          <div style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 800, letterSpacing: '0.3em', color: p.accent }}>{(d.subhead || "YOU'RE INVITED").toUpperCase()}</div>
          <Lines L={L} maxWidth={w * 0.5} base={92} color="#111" style={{ lineHeight: 1.05 }} />
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(20), lineHeight: 1.45, opacity: 0.75 }}>{lines(d.body).slice(0, 2).join(' · ')}</div>}
          <div className="grid grid-cols-2" style={{ gap: u(16), marginTop: 'auto' }}>
            {field('DATE', d.date)}{field('VENUE', d.address)}{field('CONTACT', d.contact)}{field('ENTRY', d.offer)}
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-between" style={{ width: '24%', borderLeft: `${u(4)}px dashed #d4d4d8`, padding: `${u(36)}px ${u(10)}px`, background: p.accent, color: p.onAccent, borderRadius: `0 ${u(28)}px ${u(28)}px 0` }}>
          <span className="absolute" style={{ left: -u(22), top: -u(20), width: u(40), height: u(40), borderRadius: '50%', background: p.bg }} />
          <span className="absolute" style={{ left: -u(22), bottom: -u(20), width: u(40), height: u(40), borderRadius: '50%', background: p.bg }} />
          <div style={{ ...display(st), fontSize: f(34), writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>ADMIT ONE</div>
          <div style={{ background: '#fff', padding: u(6) }}><Barcode width={u(90)} height={u(46)} color="#111" /></div>
        </div>
      </div>
      {d.brand && <div className="absolute left-0 right-0 text-center" style={{ bottom: u(36), ...bodyFont(st), fontSize: f(22), fontWeight: 800, color: '#fff', letterSpacing: '0.12em' }}>{d.brand}</div>}
    </div>
  );
}

/** Three-photo collage over a colour block with the copy. */
export function EGridCollage(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const crop = (origin: string, scale: number, radius: number) => (
    <div className="relative overflow-hidden" style={{ borderRadius: u(radius), height: '100%' }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ transform: `scale(${scale})`, transformOrigin: origin }} />
    </div>
  );
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink, padding: u(40), gap: u(16) }}>
      <div className="grid flex-1" style={{ gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: '1fr 1fr', gap: u(16), minHeight: 0 }}>
        <div style={{ gridRow: 'span 2' }}>{crop('50% 50%', 1, 26)}</div>
        {crop('15% 20%', 1.9, 26)}
        {crop('85% 80%', 2.2, 26)}
      </div>
      <div className="flex items-end justify-between" style={{ gap: u(20), background: p.bg2, borderRadius: u(26), padding: `${u(28)}px ${u(32)}px` }}>
        <div style={{ minWidth: 0 }}>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, color: p.accent }}>{d.subhead}</div>}
          <Lines L={L} maxWidth={w * 0.55} base={84} color={p.ink} />
          <div style={{ ...bodyFont(st), fontSize: f(20), marginTop: u(8), opacity: 0.75 }}>{[d.brand, d.contact].filter(Boolean).join(' · ')}</div>
        </div>
        <div className="flex flex-col items-end" style={{ gap: u(10) }}>
          {d.offer && <Pill bg={p.accent} color={p.onAccent} style={{ ...display(st), fontSize: f(fit(d.offer, 30, 14)), padding: `${u(10)}px ${u(20)}px` }}>{d.offer}</Pill>}
          {d.cta && <Pill bg={p.ink} color={p.bg} style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 800, padding: `${u(10)}px ${u(24)}px` }}>{d.cta} →</Pill>}
        </div>
      </div>
    </div>
  );
}

/** Loud sale: halftone yellow, giant offer in a starburst, tilted photo. */
export function ESaleBurst(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const burst = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2, r = i % 2 ? 40 : 50;
    return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join('') + 'Z';
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink, backgroundImage: `radial-gradient(${p.bg2} 22%, transparent 24%)`, backgroundSize: `${u(26)}px ${u(26)}px` }}>
      <div className="absolute" style={{ left: u(52), top: u(50), right: u(52) }}>
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{d.brand}</div>
        <Lines L={L} maxWidth={w - u(104)} base={170} upper color={p.ink} style={{ WebkitTextStroke: `${u(3)}px ${p.ink}`, textShadow: `${u(8)}px ${u(8)}px 0 ${p.accent}` }} />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 700, marginTop: u(6) }}>{d.subhead}</div>}
      </div>
      <div className="absolute" style={{ right: u(50), bottom: u(110), width: '48%', aspectRatio: '4 / 5', background: '#fff', padding: u(14), transform: 'rotate(5deg)', boxShadow: `${u(14)}px ${u(14)}px 0 ${p.ink}` }}>
        <Picture d={d} st={st} className="w-full h-full" />
      </div>
      {d.offer && (
        <div className="absolute flex items-center justify-center text-center" style={{ left: u(30), bottom: u(140), width: '46%', aspectRatio: '1 / 1' }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full"><path d={burst} fill={p.accent} stroke={p.ink} strokeWidth="1.5" /></svg>
          <span className="relative" style={{ ...display(st), fontSize: f(fit(d.offer, 78, 8)), color: p.onAccent, lineHeight: 0.95, padding: '18%' }}>{d.offer}</span>
        </div>
      )}
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between" style={{ background: p.ink, color: p.bg, padding: `${u(20)}px ${u(52)}px`, ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(26) }}>{d.cta}</span>
        <span style={{ fontSize: f(24) }}>{d.contact}</span>
      </div>
    </div>
  );
}

/** Greeting card: soft colour mesh, script line, elegant headline, round photo. */
export function EWish(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: p.ink }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 15% 20%, ${p.accent}55, transparent 40%), radial-gradient(circle at 85% 30%, ${p.accent2}55, transparent 45%), radial-gradient(circle at 50% 95%, ${p.bg2}, transparent 55%)` }} />
      {Array.from({ length: 14 }, (_, i) => (
        <svg key={i} viewBox="0 0 100 100" className="absolute" style={{ left: `${rand(i + 3) * 92}%`, top: `${rand(i + 11) * 90}%`, width: u(18 + rand(i) * 26), opacity: 0.8 }}>
          <path d="M50 0C54 36 64 46 100 50C64 54 54 64 50 100C46 64 36 54 0 50C36 46 46 36 50 0Z" fill={i % 2 ? p.accent : p.accent2} />
        </svg>
      ))}
      <div className="relative" style={{ marginTop: u(60), ...bodyFont(st), fontSize: f(20), fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.75 }}>{d.brand}</div>
      <div className="relative" style={{ marginTop: u(20), padding: `0 ${u(50)}px` }}>
        {d.subhead && <div style={{ ...script(), fontSize: f(fit(d.subhead, 84, 18)), color: p.accent, lineHeight: 1 }}>{d.subhead}</div>}
        <Lines L={L} maxWidth={w * 0.82} base={128} color={p.ink} center style={{ lineHeight: 1.05 }} />
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(24), lineHeight: 1.5, marginTop: u(14), opacity: 0.85, maxWidth: w * 0.7, marginInline: 'auto' }}>{lines(d.body).join(' ')}</div>}
      </div>
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ left: '50%', top: '50%', height: '80%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)', borderRadius: '50%', boxShadow: `0 0 0 ${u(10)}px #ffffffaa, 0 0 0 ${u(12)}px ${p.accent}` }} />
      </div>
      <div className="relative" style={{ marginBottom: u(46), ...bodyFont(st), fontSize: f(22), fontWeight: 700 }}>{[d.date, d.contact].filter(Boolean).join('  ·  ')}</div>
    </div>
  );
}

/** Coming soon: big headline over date tiles. */
export function ECountdown(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const tiles = (d.date || 'Opening soon').split(/[\s·,]+/).filter(Boolean).slice(0, 3);
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: p.ink }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ opacity: 0.25 }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${p.bg}cc, ${p.bg} 75%)` }} />
      <div className="relative" style={{ marginTop: u(70), ...bodyFont(st), fontSize: f(24), fontWeight: 800, letterSpacing: '0.45em', color: p.accent }}>{(d.subhead || 'COMING SOON').toUpperCase()}</div>
      <div className="relative" style={{ marginTop: u(24), padding: `0 ${u(50)}px` }}>
        <Lines L={L} maxWidth={w * 0.86} base={150} upper color={p.ink} center />
      </div>
      <div className="relative flex justify-center" style={{ gap: u(18), marginTop: u(40) }}>
        {tiles.map((t, i) => (
          <div key={i} style={{ minWidth: u(170), padding: `${u(22)}px ${u(20)}px`, borderRadius: u(22), background: p.bg2, border: `${u(2)}px solid ${p.accent}55` }}>
            <div style={{ ...display(st), fontSize: f(fit(t, 72, 5)), color: p.accent, lineHeight: 1 }}>{t}</div>
          </div>
        ))}
      </div>
      {d.body && <div className="relative" style={{ ...bodyFont(st), fontSize: f(24), lineHeight: 1.5, marginTop: u(34), opacity: 0.85, maxWidth: w * 0.72 }}>{lines(d.body).join(' · ')}</div>}
      <div className="flex-1" />
      <div className="relative flex flex-col items-center" style={{ gap: u(12), marginBottom: u(56) }}>
        {d.offer && <Pill bg={p.accent} color={p.onAccent} style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, padding: `${u(12)}px ${u(34)}px` }}>{d.offer}</Pill>}
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, opacity: 0.85 }}>{[d.brand, d.address].filter(Boolean).join(' · ')}</div>
      </div>
    </div>
  );
}

/** Online-shop product card: photo, price tag, rating, features and a buy button. */
export function EProductCard(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(160deg, ${p.bg}, ${p.bg2})`, color: p.ink, padding: u(44), gap: u(18) }}>
      <div className="flex items-center justify-between" style={{ ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(28) }}>{d.brand}</span>
        {d.subhead && <Pill bg={p.ink} color={p.bg} style={{ fontSize: f(18), padding: `${u(6)}px ${u(16)}px`, letterSpacing: '0.1em' }}>{d.subhead.toUpperCase()}</Pill>}
      </div>
      <div className="relative flex-1" style={{ minHeight: 0 }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: u(36), boxShadow: `0 ${u(30)}px ${u(50)}px rgba(0,0,0,.18)` }} />
        {d.offer && <div className="absolute" style={{ right: u(20), top: u(20) }}><Pill bg={p.accent} color={p.onAccent} style={{ ...display(st), fontSize: f(fit(d.offer, 38, 12)), padding: `${u(12)}px ${u(24)}px`, boxShadow: '0 8px 20px rgba(0,0,0,.2)' }}>{d.offer}</Pill></div>}
      </div>
      <div>
        <div style={{ color: '#f59e0b', fontSize: f(26), letterSpacing: '0.1em' }}>★★★★★ <span style={{ ...bodyFont(st), color: p.ink, fontSize: f(20), fontWeight: 700, letterSpacing: 0, opacity: 0.7 }}>Loved by our customers</span></div>
        <Lines L={L} maxWidth={w - u(88)} base={78} color={p.ink} style={{ lineHeight: 1.1, marginTop: u(6) }} />
        {d.body && <div className="flex flex-wrap" style={{ gap: `${u(6)}px ${u(20)}px`, marginTop: u(10), ...bodyFont(st), fontSize: f(21), fontWeight: 600 }}>{lines(d.body).slice(0, 4).map((t, i) => <span key={i}>✓ {t}</span>)}</div>}
      </div>
      <div className="flex items-center justify-between" style={{ gap: u(16) }}>
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, lineHeight: 1.3 }}>{d.contact}<div style={{ opacity: 0.65, fontSize: f(18) }}>{d.address}</div></div>
        {d.cta && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(16)}px ${u(40)}px`, borderRadius: u(16) }}>{d.cta}</div>}
      </div>
    </div>
  );
}

/** Editorial minimal: full photo, small type in the corners, one large line. */
export function EMinimalPhoto(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: '#fff' }}>
      <Picture d={d} st={st} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.35), transparent 25%, transparent 55%, rgba(0,0,0,.7))' }} />
      <div className="absolute flex justify-between" style={{ left: u(48), right: u(48), top: u(44), ...bodyFont(st), fontSize: f(20), fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <span>{d.brand}</span><span>{d.date || d.subhead}</span>
      </div>
      <div className="absolute" style={{ left: u(48), right: u(48), bottom: u(48) }}>
        {d.subhead && d.date && <div style={{ ...bodyFont(st), fontSize: f(22), letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.85 }}>{d.subhead}</div>}
        <Lines L={L} maxWidth={w * 0.8} base={120} color="#fff" style={{ fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.01em' }} />
        <div className="flex justify-between items-end" style={{ marginTop: u(22), borderTop: '1px solid rgba(255,255,255,.5)', paddingTop: u(16), ...bodyFont(st), fontSize: f(20), gap: u(16) }}>
          <span>{[d.offer, d.contact].filter(Boolean).join(' · ')}</span>
          {d.cta && <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{d.cta} ↗</span>}
        </div>
      </div>
    </div>
  );
}
