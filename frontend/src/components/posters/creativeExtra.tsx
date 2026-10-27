import type { CSSProperties } from 'react';
import { Title } from './creative';
import { BrandMark, ContactPill, Lantern, PhoneIcon } from './kerala';
import { Picture } from './parts';
import { bodyFont, extrude, fit, gradientText, kd, lines, outline, type LayoutProps } from './text';

/**
 * More Malayalam ad styles: polaroids, circle hero, glass card, comic pop, phone
 * mockup, arch window, hazard stripes, torn paper, brush reveal, waves, gold frame,
 * split banner, sticker pop, before/after circles, calendar page and mosaic tiles.
 */

const rand = (i: number) => {
  const x = Math.sin(i * 39.3467) * 43758.5453;
  return x - Math.floor(x);
};

const svgUrl = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

/** Brush-stroke shaped mask for photos. */
const BRUSH_MASK = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M4 18C14 4 34 10 52 6C70 2 92 4 97 18C101 32 93 42 97 56C101 70 96 88 82 94C64 100 44 92 26 96C10 99 1 86 3 70C5 56 0 46 2 34C3 26 1 22 4 18Z" fill="black"/></svg>');

const masked = (url: string): CSSProperties => ({ maskImage: url, WebkitMaskImage: url, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' });

function Star({ size, color, style }: { size: number; color: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 100 100" width={size} height={size} style={style}><path d="M50 0L61 35H98L68 57L79 92L50 70L21 92L32 57L2 35H39Z" fill={color} /></svg>;
}

function Badge({ text, L, bg, color, size, rotate = -10, style }: { text: string; L: LayoutProps; bg: string; color: string; size: number; rotate?: number; style?: CSSProperties }) {
  const { st, f, u } = L;
  if (!text) return null;
  return (
    <div className="absolute flex items-center justify-center text-center" style={{ width: u(size), height: u(size), borderRadius: '50%', background: bg, color, transform: `rotate(${rotate}deg)`, padding: u(size * 0.12), boxShadow: '0 10px 24px rgba(0,0,0,.25)', ...style }}>
      <span style={{ ...kd(st), fontSize: f(fit(text, size / 5.5, 10)), lineHeight: 1.1 }}>{text}</span>
    </div>
  );
}

/** Pinned polaroids on a soft board, handwritten-style headline. */
export function CPolaroid(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const tape = (style: CSSProperties) => <span className="absolute" style={{ width: u(110), height: u(34), background: '#ffffffaa', boxShadow: '0 2px 4px rgba(0,0,0,.1)', ...style }} />;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink, backgroundImage: `radial-gradient(${p.bg2} 1.5px, transparent 2px)`, backgroundSize: `${u(28)}px ${u(28)}px` }}>
      <div className="flex justify-between items-center" style={{ padding: `${u(40)}px ${u(48)}px 0` }}>
        <BrandMark L={L} color={p.ink} size={32} />
        {d.subhead && <span style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 700, opacity: 0.75 }}>{d.subhead}</span>}
      </div>
      <div style={{ padding: `${u(18)}px ${u(48)}px 0` }}>
        <Title L={L} maxWidth={w - u(96)} first={92} rest={92} color={p.ink} style={{ textDecoration: `underline ${u(8)}px ${p.accent}`, textUnderlineOffset: u(10) }} />
      </div>
      <div className="relative flex-1">
        <div className="absolute" style={{ left: '8%', top: '8%', width: '58%', height: '80%', background: '#fff', padding: `${u(16)}px ${u(16)}px ${u(70)}px`, transform: 'rotate(-6deg)', boxShadow: `0 ${u(18)}px ${u(34)}px rgba(0,0,0,.25)` }}>
          {tape({ left: '38%', top: -u(16), transform: 'rotate(-4deg)' })}
          <Picture d={d} st={st} className="w-full h-full" />
          <div className="absolute left-0 right-0 text-center" style={{ bottom: u(16), ...kd(st), fontSize: f(fit(d.offer || d.brand, 32, 22)), color: p.ink }}>{d.offer || d.brand}</div>
        </div>
        <div className="absolute overflow-hidden" style={{ right: '7%', top: '22%', width: '34%', height: '50%', background: '#fff', padding: `${u(12)}px ${u(12)}px ${u(46)}px`, transform: 'rotate(7deg)', boxShadow: `0 ${u(14)}px ${u(26)}px rgba(0,0,0,.22)` }}>
          {tape({ left: '30%', top: -u(14), transform: 'rotate(6deg)' })}
          <div className="relative w-full h-full overflow-hidden"><Picture d={d} st={st} className="absolute inset-0" style={{ transform: 'scale(1.8)', transformOrigin: '70% 40%' }} /></div>
        </div>
      </div>
      <div className="flex justify-center" style={{ paddingBottom: u(40) }}><ContactPill L={L} bg={p.ink} color={p.bg} iconBg={p.accent} iconColor="#fff" /></div>
    </div>
  );
}

/** Large ringed circle photo with orbit dots, headline beneath, colour footer. */
export function CCircleHero(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(circle at 50% 35%, ${p.bg2}, ${p.bg} 70%)`, color: p.ink }}>
      <div className="w-full flex justify-between" style={{ padding: `${u(36)}px ${u(48)}px 0` }}><BrandMark L={L} color={p.ink} size={30} /><span style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 700 }}>{d.date}</span></div>
      <div className="relative flex-1 w-full">
        <div className="absolute" style={{ left: '50%', top: '50%', height: '96%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${u(3)}px dashed ${p.accent}88` }} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <span key={i} className="absolute" style={{ left: `calc(50% + ${Math.cos(a) * 46}% * 0.6)`, top: `${50 + Math.sin(a) * 47}%`, width: u(16), height: u(16), borderRadius: '50%', background: i % 2 ? p.accent : p.accent2 }} />;
        })}
        <Picture d={d} st={st} className="absolute" style={{ left: '50%', top: '50%', height: '80%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${u(12)}px solid ${p.accent}`, boxShadow: `0 ${u(20)}px ${u(40)}px rgba(0,0,0,.25)` }} />
        <Badge text={d.offer} L={L} bg={p.accent2} color={p.onAccent} size={180} style={{ right: '12%', bottom: '4%' }} />
      </div>
      <div style={{ padding: `${u(10)}px ${u(48)}px ${u(18)}px` }}>
        <Title L={L} maxWidth={w * 0.86} first={86} rest={70} color={p.ink} center />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 600, marginTop: u(6), opacity: 0.8 }}>{d.subhead}</div>}
      </div>
      <div className="w-full flex items-center justify-between" style={{ background: p.accent, color: p.onAccent, padding: `${u(20)}px ${u(48)}px`, ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(22) }}>{d.address}</span>
        <span style={{ fontSize: f(28), display: 'flex', alignItems: 'center', gap: u(10) }}>{d.contact && <><PhoneIcon size={u(28)} color={p.onAccent} />{d.contact}</>}</span>
      </div>
    </div>
  );
}

/** Vivid gradient blobs behind a frosted glass card. */
export function CGlassCard(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: '#fff' }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 20%, ${p.accent}, transparent 45%), radial-gradient(circle at 85% 30%, ${p.accent2}, transparent 45%), radial-gradient(circle at 60% 90%, ${p.bg2}, transparent 55%)` }} />
      <Picture d={d} st={st} className="absolute" style={{ right: '6%', top: '5%', height: '40%', aspectRatio: '1 / 1', borderRadius: '50%', border: `${u(8)}px solid #ffffff55`, boxShadow: `0 ${u(30)}px ${u(60)}px rgba(0,0,0,.3)` }} />
      <div className="absolute" style={{ left: '6%', right: '6%', bottom: '6%', minHeight: '46%', padding: u(48), borderRadius: u(40), background: 'linear-gradient(145deg, rgba(255,255,255,.28), rgba(255,255,255,.08))', border: `${u(2)}px solid rgba(255,255,255,.5)`, boxShadow: `0 ${u(30)}px ${u(60)}px rgba(0,0,0,.25)`, backdropFilter: 'blur(14px)' }}>
        <BrandMark L={L} color="#fff" size={30} />
        <div style={{ marginTop: u(18) }}><Title L={L} maxWidth={w * 0.78} first={90} rest={74} color="#fff" style={{ textShadow: '0 4px 18px rgba(0,0,0,.25)' }} /></div>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 600, marginTop: u(10), opacity: 0.95 }}>{d.subhead}</div>}
        {d.body && <div className="flex flex-wrap" style={{ gap: u(10), marginTop: u(16) }}>{lines(d.body).slice(0, 4).map((t, i) => <span key={i} style={{ ...bodyFont(st), fontSize: f(19), fontWeight: 700, background: 'rgba(255,255,255,.2)', padding: `${u(6)}px ${u(16)}px`, borderRadius: 999 }}>{t}</span>)}</div>}
        <div className="flex items-center justify-between flex-wrap" style={{ marginTop: u(24), gap: u(14) }}>
          {d.offer && <span style={{ ...kd(st), fontSize: f(fit(d.offer, 34, 18)), background: '#fff', color: p.bg, padding: `${u(10)}px ${u(24)}px`, borderRadius: 999 }}>{d.offer}</span>}
          <span style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 800 }}>{d.contact}</span>
        </div>
      </div>
    </div>
  );
}

/** Comic panels: thick borders, speed lines, halftone and a burst. */
export function CComic(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const border = `${u(8)}px solid #111`;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, padding: u(30), gap: u(20), backgroundImage: `radial-gradient(${p.bg2} 25%, transparent 27%)`, backgroundSize: `${u(20)}px ${u(20)}px` }}>
      <div className="relative flex-1 overflow-hidden" style={{ border, borderRadius: u(10), background: `repeating-conic-gradient(from 0deg at 50% 60%, ${p.accent2} 0 4deg, ${p.bg} 4deg 12deg)` }}>
        <Picture d={d} st={st} className="absolute" style={{ inset: '8% 12% 0', border, borderBottom: 'none', borderRadius: `${u(20)}px ${u(20)}px 0 0` }} />
        <div className="absolute" style={{ left: u(18), top: u(18), background: '#fff', border, padding: `${u(6)}px ${u(16)}px`, ...kd(st), fontSize: f(26), color: '#111', transform: 'rotate(-3deg)' }}>{d.brand}</div>
        {d.offer && (
          <div className="absolute flex items-center justify-center text-center" style={{ right: u(10), top: u(10), width: u(230), height: u(230) }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full"><path d="M50 2L58 26L82 10L74 36L98 38L78 54L94 74L68 70L66 96L50 78L34 96L32 70L6 74L22 54L2 38L26 36L18 10L42 26Z" fill={p.accent} stroke="#111" strokeWidth="3" strokeLinejoin="round" /></svg>
            <span className="relative" style={{ ...kd(st), fontSize: f(fit(d.offer, 38, 9)), color: p.onAccent, padding: '22%', lineHeight: 1.05 }}>{d.offer}</span>
          </div>
        )}
      </div>
      <div style={{ background: '#fff', border, borderRadius: u(10), padding: `${u(24)}px ${u(30)}px`, boxShadow: `${u(10)}px ${u(10)}px 0 #111` }}>
        <Title L={L} maxWidth={w - u(140)} first={80} rest={80} color="#111" />
        <div className="flex items-center justify-between flex-wrap" style={{ marginTop: u(12), gap: u(12), ...bodyFont(st), fontWeight: 800 }}>
          <span style={{ fontSize: f(22) }}>{d.subhead}</span>
          <span style={{ fontSize: f(26), background: p.accent, color: p.onAccent, border: `${u(4)}px solid #111`, padding: `${u(4)}px ${u(16)}px` }}>{d.contact}</span>
        </div>
      </div>
    </div>
  );
}

/** Smartphone mockup with the photo, floating chips and order call-to-action. */
export function CPhone(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const tall = h > w * 1.1;
  const phone = (
    <div className="relative" style={{ height: tall ? '100%' : '84%', aspectRatio: '9 / 18', background: '#111', borderRadius: u(56), padding: u(14), boxShadow: `0 ${u(40)}px ${u(70)}px rgba(0,0,0,.35)` }}>
      <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: u(44), background: '#fff' }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ height: '72%' }} />
        <div className="absolute left-0 right-0 bottom-0" style={{ height: '32%', background: '#fff', borderRadius: `${u(30)}px ${u(30)}px 0 0`, padding: u(20), color: '#111' }}>
          <div style={{ ...kd(st), fontSize: f(26), lineHeight: 1.2 }}>{d.brand}</div>
          <div style={{ color: '#f59e0b', fontSize: f(20), marginTop: u(4) }}>★★★★★</div>
          <div style={{ marginTop: u(10), background: p.accent, color: p.onAccent, borderRadius: u(14), textAlign: 'center', padding: `${u(10)}px 0`, ...bodyFont(st), fontSize: f(20), fontWeight: 800 }}>{d.cta || 'Order Now'}</div>
        </div>
        <span className="absolute" style={{ left: '50%', top: u(10), width: u(90), height: u(22), borderRadius: 999, background: '#111', transform: 'translateX(-50%)' }} />
      </div>
      {d.offer && <div className="absolute" style={{ left: -u(70), top: '18%', ...kd(st), fontSize: f(fit(d.offer, 28, 16)), background: p.accent2, color: p.onAccent, padding: `${u(10)}px ${u(20)}px`, borderRadius: u(16), boxShadow: '0 10px 24px rgba(0,0,0,.2)', transform: 'rotate(-6deg)', whiteSpace: 'nowrap' }}>{d.offer}</div>}
    </div>
  );
  return (
    <div className={`absolute inset-0 flex ${tall ? 'flex-col' : 'flex-row'} items-center`} style={{ background: `linear-gradient(150deg, ${p.bg}, ${p.bg2})`, color: '#fff', padding: u(52), gap: u(30) }}>
      <div style={{ flex: tall ? '0 0 auto' : '1 1 0', minWidth: 0 }}>
        <BrandMark L={L} color="#fff" size={30} />
        <div style={{ marginTop: u(18) }}><Title L={L} maxWidth={tall ? w - u(104) : w * 0.5} first={88} rest={72} color="#fff" /></div>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 600, marginTop: u(8), opacity: 0.9 }}>{d.subhead}</div>}
        {!tall && d.body && <div style={{ ...bodyFont(st), fontSize: f(22), lineHeight: 1.6, marginTop: u(16) }}>{lines(d.body).slice(0, 4).map((t, i) => <div key={i}>✓ {t}</div>)}</div>}
        <div style={{ marginTop: u(22) }}><ContactPill L={L} bg="#fff" color="#111" iconBg={p.accent} iconColor="#fff" /></div>
      </div>
      <div className="flex justify-center" style={{ flex: tall ? '1 1 0' : '0 0 auto', minHeight: 0, height: tall ? undefined : '100%', alignItems: 'center' }}>{phone}</div>
    </div>
  );
}

/** Cream page, tall arched photo with an offset outline, elegant type. */
export function CArchWindow(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const arch = (extra: CSSProperties) => ({ borderRadius: '999px 999px 0 0', ...extra });
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: p.ink }}>
      <div style={{ marginTop: u(40), ...bodyFont(st), fontSize: f(20), letterSpacing: '0.3em', fontWeight: 700, color: p.accent }}>{(d.brand || '').toUpperCase()}</div>
      <div style={{ padding: `${u(14)}px ${u(50)}px 0` }}>
        <Title L={L} maxWidth={w * 0.84} first={84} rest={72} color={p.ink} center />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(22), marginTop: u(6), opacity: 0.8 }}>{d.subhead}</div>}
      </div>
      <div className="relative flex-1 w-full" style={{ marginTop: u(20) }}>
        <div className="absolute" style={arch({ left: '50%', bottom: 0, top: u(10), aspectRatio: '3 / 4', transform: 'translateX(-46%)', border: `${u(3)}px solid ${p.accent}` })} />
        <Picture d={d} st={st} className="absolute" style={arch({ left: '50%', bottom: u(14), top: u(24), aspectRatio: '3 / 4', transform: 'translateX(-54%)' })} />
        {[0, 1].map(i => (
          <svg key={i} viewBox="0 0 60 140" className="absolute" style={{ [i ? 'right' : 'left']: u(30), bottom: 0, width: u(90), transform: i ? 'scaleX(-1)' : undefined }}>
            <path d="M30 140C30 100 28 60 34 10" stroke={p.accent2} strokeWidth="3" fill="none" />
            {Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={k % 2 ? 44 : 20} cy={30 + k * 18} rx="12" ry="6" transform={`rotate(${k % 2 ? -30 : 30} ${k % 2 ? 44 : 20} ${30 + k * 18})`} fill={p.accent2} />)}
          </svg>
        ))}
      </div>
      <div className="w-full flex items-center justify-between" style={{ borderTop: `1px solid ${p.accent}`, margin: `0 ${u(48)}px`, padding: `${u(18)}px ${u(48)}px ${u(30)}px`, ...bodyFont(st), fontSize: f(22), fontWeight: 700 }}>
        <span>{d.offer || d.address}</span><span>{d.contact}</span>
      </div>
    </div>
  );
}

/** Hazard-stripe bands, headline on a tilted white plate, framed photo. */
export function CStripeBold(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const band = <div style={{ height: u(46), background: `repeating-linear-gradient(-45deg, ${p.accent} 0 ${u(30)}px, #111 ${u(30)}px ${u(60)}px)` }} />;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: '#fff' }}>
      {band}
      <div className="flex justify-between items-center" style={{ padding: `${u(22)}px ${u(44)}px 0` }}><BrandMark L={L} color="#fff" size={30} /><span style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 800, color: p.accent }}>{d.subhead}</span></div>
      <div style={{ margin: `${u(22)}px ${u(36)}px 0`, background: '#fff', padding: `${u(18)}px ${u(26)}px`, transform: 'rotate(-2deg)', boxShadow: `${u(12)}px ${u(12)}px 0 ${p.accent}` }}>
        <Title L={L} maxWidth={w - u(124)} first={96} rest={96} color="#111" />
      </div>
      <div className="relative flex-1" style={{ margin: `${u(30)}px ${u(44)}px ${u(20)}px` }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ border: `${u(8)}px solid ${p.accent}` }} />
        {d.offer && <div className="absolute" style={{ right: -u(14), bottom: u(24), ...kd(st), fontSize: f(fit(d.offer, 40, 14)), background: p.accent, color: '#111', padding: `${u(12)}px ${u(26)}px`, transform: 'rotate(-4deg)', boxShadow: '0 10px 24px rgba(0,0,0,.3)' }}>{d.offer}</div>}
      </div>
      <div className="flex items-center justify-between" style={{ padding: `0 ${u(44)}px ${u(20)}px`, ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(20), opacity: 0.85 }}>{d.address}</span>
        <span style={{ fontSize: f(30) }}>{d.contact}</span>
      </div>
      {band}
    </div>
  );
}

/** Photo top, torn paper edge, copy on the paper below. */
export function CTornPaper(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const tear = Array.from({ length: 41 }, (_, i) => `${i * 2.5} ${4 + rand(i) * 8}`).join(' L');
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink }}>
      <div className="relative" style={{ height: '54%' }}>
        <Picture d={d} st={st} className="absolute inset-0" />
        <div className="absolute" style={{ left: u(40), top: u(36), background: '#000000aa', padding: `${u(10)}px ${u(20)}px`, borderRadius: 999 }}><BrandMark L={L} color="#fff" size={26} /></div>
        <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="absolute left-0 right-0" style={{ bottom: -1, width: '100%', height: u(60) }}>
          <path d={`M0 14 L${tear} L100 14Z`} fill={p.bg} />
          <path d={`M0 ${4 + rand(0) * 8} L${tear}`} fill="none" stroke="#00000022" strokeWidth="0.6" />
        </svg>
        {d.offer && <div className="absolute" style={{ right: u(40), bottom: u(46), ...kd(st), fontSize: f(fit(d.offer, 30, 16)), background: p.accent, color: p.onAccent, padding: `${u(10)}px ${u(22)}px`, transform: 'rotate(3deg)' }}>{d.offer}</div>}
      </div>
      <div className="flex-1 flex flex-col" style={{ padding: `${u(20)}px ${u(52)}px ${u(40)}px` }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 800, color: p.accent, letterSpacing: '0.06em' }}>{d.subhead}</div>}
        <Title L={L} maxWidth={w - u(104)} first={90} rest={78} color={p.ink} />
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), lineHeight: 1.5, marginTop: u(10), opacity: 0.85 }}>{lines(d.body).slice(0, 3).join(' · ')}</div>}
        <div className="flex-1" />
        <ContactPill L={L} bg={p.ink} color={p.bg} iconBg={p.accent} iconColor="#fff" />
      </div>
    </div>
  );
}

/** Photo revealed through a brush stroke, headline over a highlight bar. */
export function CBrushReveal(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink }}>
      <div className="absolute" style={{ left: '6%', right: '-4%', top: '8%', height: '58%', background: p.accent, transform: 'rotate(-4deg) translate(3%, 3%)', ...masked(BRUSH_MASK) }} />
      <Picture d={d} st={st} className="absolute" style={{ left: '4%', right: '-2%', top: '6%', height: '58%', transform: 'rotate(-4deg)', ...masked(BRUSH_MASK) }} />
      <div className="absolute" style={{ right: u(44), top: u(36) }}><BrandMark L={L} color={p.ink} size={30} /></div>
      <div className="absolute" style={{ left: u(52), right: u(52), bottom: u(140) }}>
        {d.subhead && <div style={{ display: 'inline-block', ...bodyFont(st), fontSize: f(22), fontWeight: 800, background: p.ink, color: p.bg, padding: `${u(4)}px ${u(14)}px`, marginBottom: u(10) }}>{d.subhead}</div>}
        <Title L={L} maxWidth={w - u(104)} first={96} rest={84} color={p.ink} style={{ backgroundImage: `linear-gradient(transparent 62%, ${p.accent2} 62%)`, display: 'inline-block' }} />
      </div>
      <div className="absolute left-0 right-0 flex items-center justify-between" style={{ bottom: u(44), padding: `0 ${u(52)}px`, gap: u(16) }}>
        <ContactPill L={L} bg={p.accent} color={p.onAccent} iconBg="#fff" iconColor={p.accent} />
        {d.offer && <span style={{ ...kd(st), fontSize: f(fit(d.offer, 30, 16)), color: p.accent }}>{d.offer}</span>}
      </div>
    </div>
  );
}

/** Layered waves at the bottom with a round photo riding on them. */
export function CWaves(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `linear-gradient(180deg, ${p.bg2}, ${p.bg} 70%)`, color: p.ink }}>
      <div style={{ marginTop: u(40) }}><BrandMark L={L} color={p.ink} size={30} center /></div>
      <div style={{ padding: `${u(18)}px ${u(48)}px 0` }}>
        <Title L={L} maxWidth={w * 0.86} first={88} rest={74} color={p.ink} center />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 600, marginTop: u(6), opacity: 0.85 }}>{d.subhead}</div>}
      </div>
      <svg className="absolute left-0 right-0 bottom-0" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ width: '100%', height: '42%' }}>
        <path d="M0 18 C20 6 35 28 55 16 S85 4 100 14 V60 H0Z" fill={p.accent2} opacity=".55" />
        <path d="M0 28 C18 18 38 36 58 26 S88 16 100 26 V60 H0Z" fill={p.accent} opacity=".85" />
        <path d="M0 40 C22 32 40 48 62 40 S90 32 100 40 V60 H0Z" fill={p.ink} />
      </svg>
      <Picture d={d} st={st} className="absolute" style={{ left: '50%', bottom: '18%', width: '40%', aspectRatio: '1 / 1', transform: 'translateX(-50%)', borderRadius: '50%', border: `${u(10)}px solid #fff`, boxShadow: `0 ${u(20)}px ${u(40)}px rgba(0,0,0,.25)` }} />
      <Badge text={d.offer} L={L} bg={p.accent} color={p.onAccent} size={170} rotate={10} style={{ left: '16%', bottom: '34%' }} />
      <div className="absolute left-0 right-0 flex items-center justify-between" style={{ bottom: u(30), padding: `0 ${u(48)}px`, color: p.bg, ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(20) }}>{d.address}</span>
        <span style={{ fontSize: f(28) }}>{d.contact}</span>
      </div>
    </div>
  );
}

/** Traditional gold frame with corner ornaments, lamps and a medallion photo. */
export function CGoldFrame(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const corner = (pos: CSSProperties, rot: number) => (
    <svg viewBox="0 0 60 60" className="absolute" style={{ width: u(90), ...pos, transform: `rotate(${rot}deg)` }}>
      <path d="M4 56V20C4 10 10 4 20 4H56" stroke={p.accent} strokeWidth="3" fill="none" />
      <path d="M12 56V26C12 18 18 12 26 12H56" stroke={p.accent} strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="20" r="5" fill={p.accent} /><rect x="30" y="1" width="6" height="6" transform="rotate(45 33 4)" fill={p.accent} />
    </svg>
  );
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse at 50% 40%, ${p.bg2}, ${p.bg} 75%)`, color: p.ink }}>
      <div className="absolute" style={{ inset: u(30), border: `${u(3)}px solid ${p.accent}` }} />
      <div className="absolute" style={{ inset: u(42), border: `1px solid ${p.accent}88` }} />
      {corner({ left: u(22), top: u(22) }, 0)}{corner({ right: u(22), top: u(22) }, 90)}{corner({ right: u(22), bottom: u(22) }, 180)}{corner({ left: u(22), bottom: u(22) }, 270)}
      <div className="absolute" style={{ left: u(80), top: u(42) }}><Lantern width={u(56)} color={p.accent} /></div>
      <div className="absolute" style={{ right: u(80), top: u(42) }}><Lantern width={u(56)} color={p.accent} /></div>
      <div style={{ marginTop: u(80), ...bodyFont(st), fontSize: f(20), letterSpacing: '0.2em', fontWeight: 700, color: p.accent }}>{d.brand}</div>
      <div style={{ padding: `${u(12)}px ${u(120)}px 0` }}>
        <Title L={L} maxWidth={w * 0.72} first={100} rest={80} color={p.accent} center style={{ ...gradientText(p.accent2, p.accent), filter: `drop-shadow(0 ${u(4)}px ${u(6)}px rgba(0,0,0,.35))` }} />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), marginTop: u(6) }}>{d.subhead}</div>}
      </div>
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ left: '50%', top: '50%', height: '86%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${u(8)}px solid ${p.accent}`, boxShadow: `0 0 0 ${u(10)}px ${p.bg}, 0 0 0 ${u(13)}px ${p.accent}88` }} />
      </div>
      <div style={{ marginBottom: u(80), ...bodyFont(st), fontSize: f(24), fontWeight: 700, color: p.accent }}>{[d.date, d.offer, d.contact].filter(Boolean).join('  ·  ')}</div>
    </div>
  );
}

/** Photo top, colour bottom, headline on a tilted banner across the seam. */
export function CSplitBanner(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: '#fff' }}>
      <div className="relative" style={{ height: '56%' }}>
        <Picture d={d} st={st} className="absolute inset-0" />
        <div className="absolute" style={{ left: u(40), top: u(36), background: '#fff', padding: `${u(10)}px ${u(18)}px`, borderRadius: u(12) }}><BrandMark L={L} color="#111" size={26} /></div>
      </div>
      <div className="relative" style={{ marginTop: -u(70), marginLeft: -u(30), marginRight: -u(30), background: p.accent, color: p.onAccent, padding: `${u(22)}px ${u(80)}px`, transform: 'rotate(-3deg)', boxShadow: `0 ${u(16)}px ${u(30)}px rgba(0,0,0,.3)` }}>
        <Title L={L} maxWidth={w - u(160)} first={90} rest={78} color={p.onAccent} />
      </div>
      <div className="flex-1 flex flex-col" style={{ padding: `${u(30)}px ${u(52)}px ${u(36)}px` }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 700 }}>{d.subhead}</div>}
        {d.body && <div className="flex flex-wrap" style={{ gap: u(10), marginTop: u(14) }}>{lines(d.body).slice(0, 4).map((t, i) => <span key={i} style={{ ...bodyFont(st), fontSize: f(19), fontWeight: 700, border: `${u(2)}px solid #ffffff88`, padding: `${u(6)}px ${u(14)}px`, borderRadius: 999 }}>{t}</span>)}</div>}
        <div className="flex-1" />
        <div className="flex items-center justify-between" style={{ gap: u(14) }}>
          {d.offer && <span style={{ ...kd(st), fontSize: f(fit(d.offer, 32, 16)), color: p.accent2 }}>{d.offer}</span>}
          <ContactPill L={L} bg="#fff" color="#111" iconBg={p.accent} iconColor={p.onAccent} />
        </div>
      </div>
    </div>
  );
}

/** Playful stickers: blob photo with a white cut line, stars and squiggles. */
export function CStickerPop(L: LayoutProps) {
  const { d, st, u, w } = L, p = st.palette;
  const cut = `drop-shadow(${u(7)}px 0 0 #fff) drop-shadow(-${u(7)}px 0 0 #fff) drop-shadow(0 ${u(7)}px 0 #fff) drop-shadow(0 -${u(7)}px 0 #fff) drop-shadow(0 ${u(14)}px ${u(16)}px rgba(0,0,0,.25))`;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink }}>
      {Array.from({ length: 9 }, (_, i) => <Star key={i} size={u(26 + rand(i) * 40)} color={[p.accent, p.accent2, '#fff'][i % 3]} style={{ position: 'absolute', left: `${rand(i + 5) * 92}%`, top: `${rand(i + 15) * 92}%`, transform: `rotate(${rand(i) * 60}deg)` }} />)}
      <svg viewBox="0 0 200 40" className="absolute" style={{ left: '8%', bottom: '30%', width: u(220) }}><path d="M5 20 Q25 0 45 20 T85 20 T125 20 T165 20 T205 20" stroke={p.accent2} strokeWidth="8" fill="none" strokeLinecap="round" /></svg>
      <div className="absolute" style={{ left: u(48), top: u(40) }}><BrandMark L={L} color={p.ink} size={30} /></div>
      <div className="absolute" style={{ left: u(48), right: u(48), top: u(110) }}>
        <Title L={L} maxWidth={w - u(96)} first={100} rest={86} color={p.accent} style={{ textShadow: `${outline('#fff', u(7))}, 0 ${u(12)}px ${u(18)}px rgba(0,0,0,.2)` }} />
      </div>
      <div className="absolute" style={{ right: '8%', bottom: '14%', width: '56%', aspectRatio: '1 / 1', filter: cut }}>
        <Picture d={d} st={st} className="w-full h-full" style={{ borderRadius: '42% 58% 55% 45% / 50% 40% 60% 50%' }} />
      </div>
      <Badge text={d.offer} L={L} bg={p.accent2} color={p.onAccent} size={190} rotate={-12} style={{ left: '8%', bottom: '38%', border: `${u(6)}px solid #fff` }} />
      <div className="absolute" style={{ left: u(48), bottom: u(40) }}><ContactPill L={L} bg="#fff" color="#111" iconBg={p.accent} iconColor="#fff" /></div>
    </div>
  );
}

/** Before / after: two overlapping circles with labels. */
export function CDuoCircle(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const label = (t: string, bg: string, color: string) => <span style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 800, background: bg, color, padding: `${u(6)}px ${u(18)}px`, borderRadius: 999 }}>{t}</span>;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: p.ink }}>
      <div className="w-full flex justify-between items-center" style={{ padding: `${u(40)}px ${u(48)}px 0` }}><BrandMark L={L} color={p.ink} size={30} />{d.subhead && <span style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 700, opacity: 0.8 }}>{d.subhead}</span>}</div>
      <div style={{ padding: `${u(16)}px ${u(48)}px 0` }}><Title L={L} maxWidth={w * 0.86} first={86} rest={74} color={p.ink} center /></div>
      <div className="relative flex-1 w-full">
        <div className="absolute flex flex-col items-center" style={{ left: '8%', top: '12%', width: '46%', gap: u(12) }}>
          <Picture d={d} st={st} className="w-full" style={{ aspectRatio: '1 / 1', borderRadius: '50%', filter: 'grayscale(1) brightness(.9)', border: `${u(8)}px solid ${p.bg2}` }} />
          {label('BEFORE', p.bg2, p.ink)}
        </div>
        <div className="absolute flex flex-col items-center" style={{ right: '8%', top: '4%', width: '50%', gap: u(12) }}>
          <Picture d={d} st={st} className="w-full" style={{ aspectRatio: '1 / 1', borderRadius: '50%', border: `${u(8)}px solid ${p.accent}`, boxShadow: `0 ${u(20)}px ${u(40)}px rgba(0,0,0,.25)` }} />
          {label('AFTER', p.accent, p.onAccent)}
        </div>
        <svg viewBox="0 0 100 40" className="absolute" style={{ left: '40%', top: '46%', width: u(130) }}><path d="M5 30 Q50 0 90 22" stroke={p.accent2} strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M80 12 L92 23 L78 30" stroke={p.accent2} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div className="w-full flex items-center justify-between" style={{ padding: `${u(14)}px ${u(48)}px ${u(40)}px`, gap: u(14) }}>
        {d.offer && <span style={{ ...kd(st), fontSize: f(fit(d.offer, 30, 16)), color: p.accent }}>{d.offer}</span>}
        <ContactPill L={L} bg={p.ink} color={p.bg} iconBg={p.accent} iconColor={p.onAccent} />
      </div>
    </div>
  );
}

/** A tear-off calendar page with the date, headline above. */
export function CCalendar(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const day = (d.date.match(/\d{1,2}(?!\d)/) || [''])[0];
  const label = d.date.replace(day, '').replace(/[·,\-–]+/g, ' ').trim() || d.subhead;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `linear-gradient(170deg, ${p.bg}, ${p.bg2})`, color: p.ink }}>
      <Picture d={d} st={st} className="absolute" style={{ right: -u(60), bottom: -u(60), width: '52%', aspectRatio: '1 / 1', borderRadius: '50%', opacity: 0.9, border: `${u(10)}px solid #fff` }} />
      <div style={{ marginTop: u(40) }}><BrandMark L={L} color={p.ink} size={30} center /></div>
      <div style={{ padding: `${u(14)}px ${u(48)}px 0` }}><Title L={L} maxWidth={w * 0.86} first={86} rest={74} color={p.ink} center /></div>
      <div className="relative" style={{ marginTop: u(36), width: '46%', background: '#fff', borderRadius: u(28), boxShadow: `0 ${u(30)}px ${u(50)}px rgba(0,0,0,.2)`, transform: 'rotate(-3deg)', overflow: 'hidden' }}>
        <div className="relative" style={{ background: p.accent, color: p.onAccent, padding: `${u(26)}px ${u(16)}px ${u(16)}px`, ...kd(st), fontSize: f(fit(label, 34, 14)) }}>
          {[0, 1].map(i => <span key={i} className="absolute" style={{ top: u(8), [i ? 'right' : 'left']: '22%', width: u(16), height: u(26), borderRadius: 999, background: '#fff' }} />)}
          {label}
        </div>
        <div style={{ ...kd(st), fontSize: f(day ? 200 : 60), lineHeight: 1.1, color: '#111', padding: `${u(10)}px 0 ${u(20)}px` }}>{day || '★'}</div>
      </div>
      {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), lineHeight: 1.5, marginTop: u(30), maxWidth: w * 0.6 }}>{lines(d.body).slice(0, 2).join(' · ')}</div>}
      <div className="flex-1" />
      <div className="self-start" style={{ margin: `0 0 ${u(40)}px ${u(48)}px` }}><ContactPill L={L} bg={p.ink} color={p.bg} iconBg={p.accent} iconColor={p.onAccent} /></div>
    </div>
  );
}

/** Mosaic tiles: photo crops and colour tiles carrying the copy. */
export function CMosaic(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const crop = (origin: string, scale: number) => (
    <div className="relative overflow-hidden" style={{ borderRadius: u(28) }}><Picture d={d} st={st} className="absolute inset-0" style={{ transform: `scale(${scale})`, transformOrigin: origin }} /></div>
  );
  return (
    <div className="absolute inset-0 grid" style={{ background: p.bg, padding: u(30), gap: u(18), gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1.15fr 1fr 0.8fr' }}>
      <div className="flex flex-col justify-between" style={{ background: p.accent, color: p.onAccent, borderRadius: u(28), padding: u(32) }}>
        <BrandMark L={L} color={p.onAccent} size={26} />
        <Title L={L} maxWidth={w * 0.4} first={96} rest={84} color={p.onAccent} />
      </div>
      {crop('50% 50%', 1)}
      {crop('20% 30%', 1.7)}
      <div className="flex flex-col justify-center" style={{ background: p.bg2, color: p.ink, borderRadius: u(28), padding: u(30) }}>
        {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 40, 14)), lineHeight: 1.2 }}>{d.subhead}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(19), lineHeight: 1.5, marginTop: u(10), opacity: 0.85 }}>{lines(d.body).slice(0, 3).map((t, i) => <div key={i}>• {t}</div>)}</div>}
      </div>
      <div className="flex items-center justify-between" style={{ gridColumn: 'span 2', background: '#111', color: '#fff', borderRadius: u(28), padding: `0 ${u(36)}px`, gap: u(16) }}>
        {d.offer && <span style={{ ...kd(st), fontSize: f(fit(d.offer, 40, 16)), color: p.accent2, textShadow: extrude('#00000066', 3, u(1.5)) }}>{d.offer}</span>}
        <span style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 800, display: 'flex', alignItems: 'center', gap: u(10) }}>{d.contact && <><PhoneIcon size={u(30)} color={p.accent2} />{d.contact}</>}</span>
      </div>
    </div>
  );
}
