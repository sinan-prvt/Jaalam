import type { ReactNode } from 'react';
import { Brand, Cta, Footer, OfferBadge, Picture, bodyFont, display, fit, lines, splitPrice, type LayoutProps } from './parts';
import { POSTER_FONTS } from './fonts';
import { MODERN_LAYOUTS } from './modern';
import { KERALA_LAYOUTS } from './kerala';
import type { LayoutKey } from './types';

// ───────────────────────── layouts ─────────────────────────

function Hero(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg }}>
      <div className="relative" style={{ flex: 1.35 }}>
        <Picture d={d} st={st} className="absolute inset-0" />
        <div className="absolute" style={{ top: u(40), left: u(40), background: p.bg, padding: `${u(14)}px ${u(26)}px`, borderRadius: 999 }}>
          <Brand {...L} color={p.ink} />
        </div>
        {d.offer && <OfferBadge {...L} style={{ position: 'absolute', right: u(50), bottom: -u(110) }} />}
      </div>
      <div className="flex flex-col justify-between" style={{ flex: 1, padding: `${u(56)}px ${u(60)}px ${u(48)}px`, color: p.ink, gap: u(20) }}>
        <div style={{ paddingRight: d.offer ? u(250) : 0 }}>
          {d.subhead && <div style={{ ...bodyFont(st), color: p.accent, fontSize: f(30), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: u(10) }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 92, 14)), lineHeight: 1.02 }}>{d.headline}</div>
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(28), opacity: 0.8, marginTop: u(16), lineHeight: 1.4, whiteSpace: 'pre-line' }}>{d.body}</div>}
        </div>
        <div className="flex items-end justify-between flex-wrap" style={{ gap: u(20) }}>
          <Footer {...L} color={p.ink} />
          <Cta {...L} bg={p.accent} color={p.onAccent} />
        </div>
      </div>
    </div>
  );
}

function Frame(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: p.bg }}>
      <Picture d={d} st={st} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${p.bg}26 0%, ${p.bg}33 35%, ${p.bg}e6 72%, ${p.bg} 100%)` }} />
      <div className="absolute" style={{ inset: u(34), border: `${u(4)}px solid ${p.accent}` }} />
      <div className="absolute" style={{ inset: u(48), border: `${u(1.5)}px solid ${p.accent}` }} />
      <div className="absolute inset-0 flex flex-col items-center justify-between text-center" style={{ padding: `${u(90)}px ${u(100)}px`, color: p.ink }}>
        <Brand {...L} color={p.ink} center />
        <div className="flex flex-col items-center" style={{ gap: u(18) }}>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(30), letterSpacing: '0.3em', textTransform: 'uppercase', color: p.accent, fontWeight: 700 }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 108, 13)), lineHeight: 1.02, textShadow: `0 ${u(4)}px ${u(24)}px ${p.bg}` }}>{d.headline}</div>
          <div style={{ width: u(160), height: u(4), background: p.accent }} />
          {d.offer && <div style={{ ...display(st), fontSize: f(56), color: p.accent }}>{d.offer}</div>}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(28), opacity: 0.9, lineHeight: 1.45, whiteSpace: 'pre-line', maxWidth: u(760) }}>{d.body}</div>}
          {d.date && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700, background: p.accent, color: p.onAccent, padding: `${u(10)}px ${u(30)}px` }}>{d.date}</div>}
          <Cta {...L} bg={p.ink} color={p.bg} />
          <Footer {...L} color={p.ink} center />
        </div>
      </div>
    </div>
  );
}

function Split(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const tall = h > w * 1.4;
  return (
    <div className={`absolute inset-0 flex ${tall ? 'flex-col-reverse' : 'flex-row'}`} style={{ background: p.bg }}>
      <div className="relative flex flex-col justify-between" style={{ flex: tall ? 1.1 : 1, padding: u(64), color: p.ink, zIndex: 1, gap: u(24) }}>
        <Brand {...L} color={p.ink} />
        <div>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 700, color: p.accent, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, tall ? 100 : 84, 11)), lineHeight: 1.02, marginTop: u(14) }}>{d.headline}</div>
          {d.offer && (
            <div style={{ ...display(st), display: 'inline-block', marginTop: u(28), fontSize: f(58), background: p.accent, color: p.onAccent, padding: `${u(8)}px ${u(26)}px` }}>{d.offer}</div>
          )}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(27), opacity: 0.8, marginTop: u(24), lineHeight: 1.45, whiteSpace: 'pre-line' }}>{d.body}</div>}
          {d.date && <div style={{ ...bodyFont(st), fontSize: f(30), marginTop: u(20), fontWeight: 700, color: p.accent }}>{d.date}</div>}
        </div>
        <div className="flex flex-col items-start" style={{ gap: u(22) }}>
          <Cta {...L} bg={p.accent} color={p.onAccent} />
          <Footer {...L} color={p.ink} />
        </div>
      </div>
      <div className="relative" style={{ flex: 1 }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ clipPath: tall ? `polygon(0 0,100% 0,100% 100%,0 ${100 - 12}%)` : 'polygon(14% 0,100% 0,100% 100%,0 100%)' }} />
        {tall && <div className="absolute" style={{ left: 0, right: 0, bottom: 0, height: u(14), background: p.accent }} />}
      </div>
    </div>
  );
}

function Circle(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const size = Math.min(w, h) * 0.5;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between text-center" style={{ background: `radial-gradient(circle at 50% 45%, ${p.bg2}, ${p.bg} 70%)`, color: p.ink, padding: `${u(60)}px ${u(70)}px` }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${p.accent}33 ${u(3)}px, transparent ${u(3)}px)`, backgroundSize: `${u(40)}px ${u(40)}px` }} />
      <div className="relative flex flex-col items-center" style={{ gap: u(10) }}>
        <Brand {...L} color={p.ink} center />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(28), letterSpacing: '0.2em', textTransform: 'uppercase', color: p.accent, fontWeight: 700, marginTop: u(14) }}>{d.subhead}</div>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 86, 16)), lineHeight: 1.02 }}>{d.headline}</div>
      </div>
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute" style={{ inset: -u(26), borderRadius: '50%', border: `${u(4)}px dashed ${p.accent}` }} />
        <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: '50%', border: `${u(10)}px solid ${p.accent}` }} />
        <OfferBadge {...L} size={210} rotate={12} style={{ position: 'absolute', right: -u(120), top: -u(30) }} />
      </div>
      <div className="relative flex flex-col items-center" style={{ gap: u(18) }}>
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(28), lineHeight: 1.4, opacity: 0.85, whiteSpace: 'pre-line' }}>{d.body}</div>}
        {d.date && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700, color: p.accent }}>{d.date}</div>}
        <Cta {...L} bg={p.accent} color={p.onAccent} />
        <Footer {...L} color={p.ink} center />
      </div>
    </div>
  );
}

function Ribbon(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  const star = 'polygon(50% 0%,61% 12%,77% 6%,80% 22%,96% 25%,90% 40%,100% 52%,88% 62%,93% 78%,77% 80%,72% 96%,57% 89%,44% 100%,35% 87%,19% 93%,16% 77%,0% 71%,9% 58%,2% 43%,16% 35%,15% 18%,31% 17%,38% 2%)';
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg }}>
      <div className="relative flex-1">
        <Picture d={d} st={st} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,.35), transparent 30%, transparent 70%, rgba(0,0,0,.35))` }} />
        <div className="absolute" style={{ top: u(44), left: u(48) }}><Brand {...L} color="#fff" /></div>
        {d.offer && (
          <div className="absolute flex items-center justify-center text-center" style={{ right: u(40), top: u(40), width: u(290), height: u(290), background: p.accent2, clipPath: star, color: p.onAccent, padding: u(50) }}>
            <span style={{ ...display(st), fontSize: f(fit(d.offer, 54, 10)), lineHeight: 1, transform: 'rotate(-8deg)' }}>{d.offer}</span>
          </div>
        )}
        <div className="absolute left-0 right-0 text-center" style={{ top: '50%', transform: 'translateY(-50%) rotate(-5deg)', background: p.accent, color: p.onAccent, padding: `${u(30)}px ${u(60)}px`, marginLeft: -u(40), marginRight: -u(40), boxShadow: `0 ${u(18)}px ${u(40)}px rgba(0,0,0,.35)` }}>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.9 }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 104, 14)), lineHeight: 1 }}>{d.headline}</div>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap" style={{ background: p.bg2, color: p.ink, padding: `${u(36)}px ${u(50)}px`, gap: u(20) }}>
        <div>
          {d.date && <div style={{ ...display(st), fontSize: f(40), color: p.accent }}>{d.date}</div>}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(26), opacity: 0.85, whiteSpace: 'pre-line' }}>{d.body}</div>}
          <Footer {...L} color={p.ink} />
        </div>
        <Cta {...L} bg={p.accent} color={p.onAccent} />
      </div>
    </div>
  );
}

function Kasavu(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const band = (top: boolean) => (
    <div className="absolute left-0 right-0" style={{ [top ? 'top' : 'bottom']: 0, height: u(70), background: `repeating-linear-gradient(90deg, ${p.accent} 0 ${u(10)}px, ${p.accent}cc ${u(10)}px ${u(14)}px)`, borderBottom: top ? `${u(6)}px solid ${p.accent2}` : undefined, borderTop: top ? undefined : `${u(6)}px solid ${p.accent2}` }} />
  );
  const archW = Math.min(w * 0.56, h * 0.42);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ background: p.bg, color: p.ink, padding: `${u(110)}px ${u(80)}px`, gap: u(22) }}>
      {band(true)}{band(false)}
      <div className="absolute" style={{ inset: `${u(90)}px ${u(30)}px`, border: `${u(2)}px solid ${p.accent}` }} />
      <Brand {...L} color={p.accent2} center />
      {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(30), color: p.accent2, letterSpacing: '0.18em', fontWeight: 700 }}>{d.subhead}</div>}
      <div className="relative" style={{ width: archW, height: archW * 1.15 }}>
        <div className="absolute" style={{ inset: -u(14), borderRadius: `${archW}px ${archW}px 0 0`, border: `${u(3)}px solid ${p.accent}` }} />
        <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: `${archW}px ${archW}px 0 0` }} />
      </div>
      <div style={{ ...display(st), fontSize: f(fit(d.headline, 96, 14)), lineHeight: 1.05, color: p.accent2 }}>{d.headline}</div>
      <div className="flex items-center" style={{ gap: u(14), color: p.accent }}>
        <span style={{ width: u(80), height: u(2), background: 'currentColor' }} />
        <span style={{ width: u(14), height: u(14), background: 'currentColor', transform: 'rotate(45deg)' }} />
        <span style={{ width: u(80), height: u(2), background: 'currentColor' }} />
      </div>
      {d.offer && <div style={{ ...display(st), fontSize: f(50), color: p.accent }}>{d.offer}</div>}
      {d.body && <div style={{ ...bodyFont(st), fontSize: f(27), lineHeight: 1.45, opacity: 0.85, whiteSpace: 'pre-line', maxWidth: u(780) }}>{d.body}</div>}
      {d.date && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700 }}>{d.date}</div>}
      <Cta {...L} bg={p.accent2} color={p.bg} />
      <Footer {...L} color={p.ink} center />
    </div>
  );
}

function Bold(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.accent, color: p.onAccent }}>
      <div className="flex justify-between items-start" style={{ padding: `${u(50)}px ${u(56)}px 0` }}>
        <Brand {...L} color={p.onAccent} />
        {d.date && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 800, border: `${u(3)}px solid currentColor`, padding: `${u(8)}px ${u(18)}px` }}>{d.date}</div>}
      </div>
      <div style={{ padding: `${u(24)}px ${u(56)}px` }}>
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(32), fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d.subhead}</div>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 150, 8)), lineHeight: 0.92, textTransform: 'uppercase' }}>{d.headline}</div>
      </div>
      {d.offer && (
        <div style={{ margin: `0 ${u(56)}px`, background: p.bg, color: p.accent, padding: `${u(18)}px ${u(34)}px`, alignSelf: 'flex-start', transform: 'rotate(-2deg)' }}>
          <span style={{ ...display(st), fontSize: f(110), lineHeight: 1 }}>{d.offer}</span>
        </div>
      )}
      <div className="relative flex-1" style={{ marginTop: u(40), minHeight: u(200) }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ clipPath: 'polygon(0 12%,100% 0,100% 100%,0 100%)' }} />
        <div className="absolute left-0 right-0 bottom-0 flex items-end justify-between flex-wrap" style={{ padding: u(44), gap: u(16), background: 'linear-gradient(transparent, rgba(0,0,0,.65))' }}>
          <Footer {...L} color="#fff" />
          <Cta {...L} bg={p.accent2} color={p.onAccent} />
        </div>
      </div>
    </div>
  );
}

function Card(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: p.bg2, padding: u(70) }}>
      <Picture d={d} st={st} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,.35)' }} />
      <div className="relative w-full flex flex-col items-center text-center" style={{ background: p.bg, color: p.ink, padding: `${u(70)}px ${u(64)}px`, borderTop: `${u(14)}px solid ${p.accent}`, boxShadow: `0 ${u(30)}px ${u(80)}px rgba(0,0,0,.4)`, gap: u(18), maxWidth: u(900) }}>
        <Brand {...L} color={p.accent} center />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(28), fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>{d.subhead}</div>}
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 84, 16)), lineHeight: 1.05 }}>{d.headline}</div>
        {d.offer && <div style={{ ...display(st), fontSize: f(52), color: p.accent }}>{d.offer}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(27), lineHeight: 1.5, opacity: 0.8, whiteSpace: 'pre-line' }}>{d.body}</div>}
        {d.date && <div style={{ ...bodyFont(st), fontSize: f(30), fontWeight: 700, color: p.accent }}>{d.date}</div>}
        <Cta {...L} bg={p.accent} color={p.onAccent} />
        <Footer {...L} color={p.ink} center />
      </div>
    </div>
  );
}

function Tribute(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const pw = Math.min(w * 0.46, h * 0.4);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ background: `linear-gradient(180deg, ${p.bg}, ${p.bg2})`, color: p.ink, padding: u(80), gap: u(22) }}>
      <div className="absolute" style={{ inset: u(30), border: `${u(2)}px solid ${p.accent}88` }} />
      {d.subhead && <div style={{ ...display(st), fontSize: f(72), color: p.accent, lineHeight: 1.1 }}>{d.subhead}</div>}
      <div className="relative" style={{ width: pw, height: pw * 1.25 }}>
        <div className="absolute" style={{ inset: -u(18), borderRadius: '50%', border: `${u(6)}px solid ${p.accent}` }} />
        <div className="absolute" style={{ inset: -u(32), borderRadius: '50%', border: `${u(2)}px solid ${p.accent}88` }} />
        <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: '50%' }} />
      </div>
      <div style={{ ...display(st), fontSize: f(fit(d.headline, 78, 18)), lineHeight: 1.05, marginTop: u(20) }}>{d.headline}</div>
      {d.offer && <div style={{ ...bodyFont(st), fontSize: f(34), fontWeight: 700, color: p.accent }}>{d.offer}</div>}
      {d.date && <div style={{ ...bodyFont(st), fontSize: f(30), letterSpacing: '0.1em' }}>{d.date}</div>}
      {d.body && <div style={{ ...bodyFont(st), fontSize: f(27), lineHeight: 1.5, opacity: 0.85, whiteSpace: 'pre-line', maxWidth: u(800) }}>{d.body}</div>}
      <div style={{ width: u(120), height: u(2), background: p.accent }} />
      <Brand {...L} color={p.ink} center />
      <Footer {...L} color={p.ink} center />
    </div>
  );
}

function Magazine(L: LayoutProps) {
  const { d, st, f, u } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink, padding: u(54) }}>
      <div className="flex items-center justify-between" style={{ borderTop: `${u(8)}px solid ${p.ink}`, borderBottom: `${u(2)}px solid ${p.ink}`, padding: `${u(14)}px 0` }}>
        <Brand {...L} color={p.ink} />
        <span style={{ ...bodyFont(st), fontSize: f(22), letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>{d.date || d.subhead}</span>
      </div>
      <div className="relative flex-1" style={{ margin: `${u(40)}px ${u(30)}px ${u(30)}px 0` }}>
        <div className="absolute" style={{ inset: 0, transform: `translate(${u(30)}px, ${u(30)}px)`, background: p.accent }} />
        <Picture d={d} st={st} className="absolute inset-0" />
        <div className="absolute" style={{ left: -u(10), bottom: u(40), maxWidth: '82%', background: p.bg, padding: `${u(24)}px ${u(34)}px` }}>
          {d.subhead && d.date && <div style={{ ...bodyFont(st), fontSize: f(24), color: p.accent, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 88, 12)), lineHeight: 1, fontStyle: 'italic' }}>{d.headline}</div>
        </div>
      </div>
      <div className="flex items-end justify-between flex-wrap" style={{ gap: u(20), paddingTop: u(20) }}>
        <div style={{ maxWidth: '60%' }}>
          {d.offer && <div style={{ ...display(st), fontSize: f(56), color: p.accent, lineHeight: 1 }}>{d.offer}</div>}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(25), opacity: 0.8, marginTop: u(10), lineHeight: 1.4, whiteSpace: 'pre-line' }}>{d.body}</div>}
          <Footer {...L} color={p.ink} />
        </div>
        <Cta {...L} bg={p.ink} color={p.bg} />
      </div>
    </div>
  );
}

function Menu(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const items = lines(d.body).slice(0, 12);
  const wide = w > h * 1.2;
  const img = Math.min(w, h) * 0.3;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink, padding: `${u(60)}px ${u(64)}px` }}>
      <div className="absolute" style={{ inset: u(24), border: `${u(3)}px double ${p.accent}`, borderWidth: u(6) }} />
      <div className="relative flex items-center justify-between" style={{ gap: u(30) }}>
        <div>
          <Brand {...L} color={p.accent} />
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginTop: u(14) }}>{d.subhead}</div>}
          <div style={{ ...display(st), fontSize: f(fit(d.headline, 86, 12)), lineHeight: 1.02 }}>{d.headline}</div>
        </div>
        <div className="relative shrink-0" style={{ width: img, height: img }}>
          <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: '50%', border: `${u(8)}px solid ${p.accent}` }} />
        </div>
      </div>
      <div className="relative flex-1 flex flex-col justify-center" style={{ marginTop: u(30) }}>
        <div style={{ display: 'grid', gridTemplateColumns: wide || items.length > 7 ? '1fr 1fr' : '1fr', columnGap: u(60), rowGap: u(18) }}>
          {items.map((line, i) => {
            const [name, price] = splitPrice(line);
            return (
              <div key={i} className="flex items-baseline" style={{ gap: u(14), ...bodyFont(st), fontSize: f(32) }}>
                <span style={{ fontWeight: 700 }}>{name}</span>
                <span className="flex-1" style={{ borderBottom: `${u(3)}px dotted ${p.accent}`, transform: `translateY(-${u(8)}px)` }} />
                {price && <span style={{ ...display(st), color: p.accent, fontSize: f(36) }}>{price}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative flex items-end justify-between flex-wrap" style={{ gap: u(16), marginTop: u(20) }}>
        <div>
          {d.offer && <div style={{ ...display(st), fontSize: f(44), color: p.accent }}>{d.offer}</div>}
          {d.date && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 700 }}>{d.date}</div>}
          <Footer {...L} color={p.ink} />
        </div>
        <Cta {...L} bg={p.accent} color={p.onAccent} />
      </div>
    </div>
  );
}

function Polaroid(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const pw = Math.min(w * 0.62, h * 0.5);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between text-center" style={{ background: p.bg, color: p.ink, padding: `${u(60)}px ${u(60)}px` }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${p.accent}55 ${u(6)}px, transparent ${u(6)}px), radial-gradient(${p.accent2}55 ${u(4)}px, transparent ${u(4)}px)`, backgroundSize: `${u(120)}px ${u(120)}px, ${u(90)}px ${u(90)}px`, backgroundPosition: `0 0, ${u(45)}px ${u(60)}px` }} />
      <div className="relative flex flex-col items-center" style={{ gap: u(8) }}>
        <Brand {...L} color={p.accent} center />
        <div style={{ ...display(st), fontSize: f(fit(d.headline, 96, 14)), lineHeight: 1.02, color: p.ink }}>{d.headline}</div>
      </div>
      <div className="relative" style={{ transform: 'rotate(-4deg)', background: '#fff', padding: `${u(26)}px ${u(26)}px ${u(90)}px`, boxShadow: `0 ${u(26)}px ${u(60)}px rgba(0,0,0,.25)` }}>
        <div className="absolute" style={{ top: -u(24), left: '50%', width: u(180), height: u(48), background: `${p.accent2}bb`, transform: 'translateX(-50%) rotate(3deg)' }} />
        <Picture d={d} st={st} style={{ width: pw, height: pw * 0.92 }} />
        {d.subhead && <div className="absolute left-0 right-0" style={{ bottom: u(18), fontFamily: POSTER_FONTS.pacifico.css, fontSize: f(38), color: '#334155' }}>{d.subhead}</div>}
        <OfferBadge {...L} size={200} rotate={14} style={{ position: 'absolute', right: -u(80), bottom: -u(60) }} />
      </div>
      <div className="relative flex flex-col items-center" style={{ gap: u(14) }}>
        {d.date && <div style={{ ...display(st), fontSize: f(40), color: p.accent }}>{d.date}</div>}
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(27), opacity: 0.85, whiteSpace: 'pre-line' }}>{d.body}</div>}
        <Cta {...L} bg={p.accent} color={p.onAccent} />
        <Footer {...L} color={p.ink} center />
      </div>
    </div>
  );
}

const CLASSIC_LAYOUTS = {
  hero: { label: 'Photo top', render: Hero },
  frame: { label: 'Festive frame', render: Frame },
  split: { label: 'Diagonal split', render: Split },
  circle: { label: 'Circle spotlight', render: Circle },
  ribbon: { label: 'Ribbon sale', render: Ribbon },
  kasavu: { label: 'Kerala kasavu', render: Kasavu },
  bold: { label: 'Big & bold', render: Bold },
  card: { label: 'Centre card', render: Card },
  tribute: { label: 'Portrait tribute', render: Tribute },
  magazine: { label: 'Magazine', render: Magazine },
  menu: { label: 'Menu / price list', render: Menu },
  polaroid: { label: 'Polaroid', render: Polaroid },
};

export type LayoutFamily = 'kerala' | 'modern' | 'classic';
type LayoutEntry = { label: string; render: (L: LayoutProps) => ReactNode; family: LayoutFamily };

export const FAMILY_LABELS: Record<LayoutFamily, string> = { kerala: 'Kerala ads', modern: 'Modern & trending', classic: 'Classic' };

/** Every layout: Kerala ads first, then modern, then classic. */
export const LAYOUTS = {
  ...Object.fromEntries(Object.entries(KERALA_LAYOUTS).map(([k, v]) => [k, { label: v.label, render: v.render, family: 'kerala' }])),
  ...Object.fromEntries(Object.entries(MODERN_LAYOUTS).map(([k, v]) => [k, { ...v, family: 'modern' }])),
  ...Object.fromEntries(Object.entries(CLASSIC_LAYOUTS).map(([k, v]) => [k, { ...v, family: 'classic' }])),
} as Record<LayoutKey, LayoutEntry>;
