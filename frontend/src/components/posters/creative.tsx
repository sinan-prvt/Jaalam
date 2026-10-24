import type { CSSProperties } from 'react';
import { POSTER_FONTS } from './fonts';
import { BrandMark, Bunting, Cloud, ContactPill, PhoneIcon, Socials } from './kerala';
import { Picture } from './parts';
import { bodyFont, extrude, feather, fit, gradientText, kd, lines, outline, titleSize, type LayoutProps } from './text';

/**
 * Creative ad layouts in the style of Kerala agency posters: full-bleed photos with
 * big Malayalam type, spotlight product shots, tilted banners, billboards, speech
 * bubbles, map pins, surreal skies and festive mascots.
 */

const script = (): CSSProperties => ({ fontFamily: POSTER_FONTS.greatVibes.css, fontWeight: 400 });

/** Pseudo-random but stable numbers, so decorations look the same in every render. */
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Headline lines, each sized to fit `maxWidth`, first line at `first` and the rest at `rest`. */
export function Title({ L, maxWidth, first, rest = first, color, style, center }: { L: LayoutProps; maxWidth: number; first: number; rest?: number; color: string; style?: CSSProperties; center?: boolean }) {
  const { d, st } = L;
  return (
    <div style={{ color, textAlign: center ? 'center' : undefined }}>
      {lines(d.headline).map((t, i) => (
        <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, i === 0 ? first : rest, maxWidth), lineHeight: 1.22, ...style }}>{t}</div>
      ))}
    </div>
  );
}

/** Photo full-bleed, dark wash from the left, big headline, brand box top-right. */
export function CStudio(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: '#fff' }}>
      <Picture d={d} st={st} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${p.bg}f2 0%, ${p.bg}aa 40%, ${p.bg}00 72%)` }} />
      <div className="absolute flex flex-col items-end" style={{ top: u(44), right: u(48), gap: u(10) }}>
        <BrandMark L={L} color="#fff" size={40} />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 800, letterSpacing: '0.2em', background: '#fff', color: p.bg, padding: `${u(4)}px ${u(14)}px` }}>{d.subhead.toUpperCase()}</div>}
      </div>
      <div className="absolute" style={{ left: u(64), top: '22%' }}>
        <Title L={L} maxWidth={w * 0.58} first={100} color="#fff" style={{ textShadow: `0 ${u(6)}px ${u(24)}px rgba(0,0,0,.35)` }} />
        {d.offer && <div style={{ ...bodyFont(st), display: 'inline-block', marginTop: u(26), fontSize: f(28), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(10)}px ${u(26)}px`, borderRadius: u(10) }}>{d.offer}</div>}
      </div>
      <div className="absolute" style={{ left: u(64), bottom: u(52), ...bodyFont(st), fontSize: f(24), lineHeight: 1.4 }}>
        {d.address && <div style={{ fontWeight: 700 }}>{d.address}</div>}
        {d.cta && <div style={{ opacity: 0.9 }}>{d.cta}</div>}
        {d.contact && <div style={{ fontSize: f(38), fontWeight: 800 }}>{d.contact}</div>}
      </div>
    </div>
  );
}

/** Orange spotlight, 3D headline, tagline pill, product on the floor, white brand footer. */
export function CSpotlight(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 42%, ${p.accent}, ${p.bg} 75%)`, color: '#fff' }}>
      <div style={{ marginTop: u(56) }}>
        <Title L={L} maxWidth={w * 0.82} first={86} rest={120} color="#fff" center style={{ textShadow: `${extrude(p.bg, 6, u(1.5))}, 0 ${u(16)}px ${u(30)}px rgba(0,0,0,.35)` }} />
      </div>
      {d.body && (
        <div style={{ ...bodyFont(st), marginTop: u(22), maxWidth: '78%', fontSize: f(24), fontWeight: 700, lineHeight: 1.4, color: p.onAccent, background: `linear-gradient(90deg, ${p.accent2}, #fff3c4)`, padding: `${u(14)}px ${u(34)}px`, borderRadius: u(40), boxShadow: `0 ${u(10)}px ${u(24)}px rgba(0,0,0,.2)` }}>
          {lines(d.body).map((t, i) => <div key={i}>{t}</div>)}
        </div>
      )}
      <div className="relative flex-1 w-full">
        <div className="absolute" style={{ left: '12%', right: '12%', bottom: u(10), height: u(44), borderRadius: '50%', background: 'rgba(0,0,0,.45)', filter: `blur(${u(16)}px)` }} />
        <Picture d={d} st={st} className="absolute" style={{ inset: `${u(16)}px 8% 0`, ...feather('ellipse 52% 50% at 50% 52%', 60) }} />
        {d.offer && <div className="absolute" style={{ ...kd(st), right: u(40), top: u(30), fontSize: f(fit(d.offer, 34, 12)), background: p.accent2, color: p.onAccent, padding: `${u(10)}px ${u(20)}px`, borderRadius: u(12), transform: 'rotate(6deg)' }}>{d.offer}</div>}
      </div>
      <div className="w-full flex items-center justify-center" style={{ background: '#fff', color: '#111', padding: `${u(24)}px ${u(40)}px`, gap: u(30) }}>
        <div style={{ textAlign: 'left' }}>
          <BrandMark L={L} color={p.bg} size={42} />
          {d.address && <div style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 700, marginTop: u(6), opacity: 0.75 }}>{d.address}</div>}
        </div>
        <div style={{ width: u(3), alignSelf: 'stretch', background: p.bg }} />
        <div style={{ ...bodyFont(st), textAlign: 'left' }}>
          {d.contact && <div style={{ fontSize: f(44), fontWeight: 800, lineHeight: 1 }}>{d.contact}</div>}
          {d.cta && <div style={{ fontSize: f(20), fontWeight: 700, marginTop: u(6), opacity: 0.8 }}>{d.cta}</div>}
        </div>
      </div>
    </div>
  );
}

/** Building/photo backdrop, headline on tilted banners, ticks list, dark contact band. */
export function CTiltBanners(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const ttl = lines(d.headline);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: '#fff' }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ filter: 'grayscale(.35)' }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, #ffffffee 0%, #ffffff55 22%, transparent 40%, ${p.bg}cc 70%, ${p.bg} 88%)` }} />
      {d.subhead && <div className="relative text-center" style={{ ...bodyFont(st), color: p.bg, fontSize: f(22), fontWeight: 700, marginTop: u(40) }}>{d.subhead}</div>}
      <div className="relative flex flex-col items-center" style={{ marginTop: u(26), gap: u(14) }}>
        {ttl.map((t, i) => (
          <div key={i} style={{ transform: `rotate(${i % 2 ? 3 : -4}deg)`, background: i === ttl.length - 1 ? p.accent : i % 2 ? '#ffffff' : p.bg2, color: i === ttl.length - 1 ? p.onAccent : i % 2 ? p.bg : '#fff', padding: `${u(10)}px ${u(34)}px`, boxShadow: `0 ${u(12)}px ${u(24)}px rgba(0,0,0,.3)` }}>
            <div style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, i === 1 ? 92 : 64, w * 0.74), lineHeight: 1.25 }}>{t}</div>
          </div>
        ))}
      </div>
      <div className="flex-1" />
      <div className="relative" style={{ padding: `0 ${u(56)}px ${u(24)}px`, ...bodyFont(st), fontSize: f(24), lineHeight: 1.6 }}>
        {lines(d.body).slice(0, 5).map((t, i) => <div key={i}>✓ {t}</div>)}
      </div>
      <div className="relative flex items-end justify-between" style={{ padding: `${u(26)}px ${u(56)}px ${u(40)}px`, borderTop: `${u(2)}px solid #ffffff33`, gap: u(20) }}>
        <div>
          <BrandMark L={L} color="#fff" size={44} />
          {d.address && <div style={{ ...bodyFont(st), fontSize: f(18), opacity: 0.8, marginTop: u(6) }}>{d.address}</div>}
        </div>
        <div style={{ ...bodyFont(st), textAlign: 'right' }}>
          {d.cta && <div style={{ display: 'inline-block', fontSize: f(20), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(4)}px ${u(16)}px`, borderRadius: u(6) }}>{d.cta}</div>}
          {d.contact && <div style={{ fontSize: f(38), fontWeight: 800, marginTop: u(6) }}>{d.contact}</div>}
        </div>
      </div>
    </div>
  );
}

/** Solid brand colour, stacked headline left, person or product cut-out bottom-right. */
export function CSolidCutout(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${p.bg2}, ${p.bg} 60%)`, color: '#fff' }}>
      <div className="absolute" style={{ right: 0, bottom: u(120), width: '56%', height: '58%' }}>
        <Picture d={d} st={st} className="absolute inset-0" style={feather('ellipse 55% 55% at 55% 55%', 55)} />
      </div>
      <div className="absolute" style={{ top: u(44), right: u(48) }}><BrandMark L={L} color="#fff" size={38} /></div>
      <div className="absolute" style={{ left: u(60), top: '16%' }}>
        <Title L={L} maxWidth={w * 0.62} first={70} rest={116} color="#fff" style={{ textShadow: `0 ${u(8)}px ${u(18)}px rgba(0,0,0,.25)` }} />
        {d.subhead && <div style={{ ...kd(st), marginTop: u(26), fontSize: f(fit(d.subhead, 42, 22)), color: p.accent2, maxWidth: w * 0.5, lineHeight: 1.3 }}>{d.subhead}</div>}
        {d.offer && <div style={{ ...bodyFont(st), marginTop: u(16), display: 'inline-block', fontSize: f(26), fontWeight: 800, background: '#fff', color: p.bg, padding: `${u(8)}px ${u(22)}px`, borderRadius: 999 }}>{d.offer}</div>}
      </div>
      <div className="absolute" style={{ left: u(60), bottom: u(150), ...bodyFont(st), fontSize: f(36), fontWeight: 800, display: 'flex', alignItems: 'center', gap: u(12) }}>
        {d.contact && <><PhoneIcon size={u(40)} color="#fff" />{d.contact}</>}
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between" style={{ background: '#fff', color: '#111', padding: `${u(26)}px ${u(48)}px`, gap: u(20) }}>
        <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, lineHeight: 1.3 }}>
          {d.address}
          {d.body && <div style={{ fontSize: f(17), fontWeight: 600, opacity: 0.7 }}>{lines(d.body).join(' / ')}</div>}
        </div>
        {d.cta && <div style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: f(30), background: p.accent, color: p.onAccent, padding: `${u(12)}px ${u(24)}px`, borderRadius: u(8) }}>{d.cta}</div>}
      </div>
    </div>
  );
}

/** A billboard on posts over green hills and sky, the ad inside it. */
export function CBillboard(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, #9fd3ff, #e8f6ff 55%)` }}>
      <Cloud width={u(200)} style={{ position: 'absolute', left: u(40), top: u(60) }} />
      <Cloud width={u(150)} style={{ position: 'absolute', right: u(60), top: u(30) }} />
      <svg className="absolute left-0 right-0 bottom-0" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '34%' }}>
        <path d="M0 120 C200 40 360 100 520 80 C700 55 860 130 1000 90 V300 H0Z" fill="#7cc36a" />
        <path d="M0 180 C250 120 520 200 760 150 C860 130 940 150 1000 160 V300 H0Z" fill="#4f9a45" />
      </svg>
      <div className="absolute" style={{ left: '30%', width: u(22), bottom: '6%', top: '60%', background: '#3d4652' }} />
      <div className="absolute" style={{ right: '30%', width: u(22), bottom: '6%', top: '60%', background: '#3d4652' }} />
      <div className="absolute flex overflow-hidden" style={{ left: '6%', right: '6%', top: '9%', height: '56%', background: '#fff', border: `${u(14)}px solid #2b313a`, boxShadow: `0 ${u(20)}px ${u(40)}px rgba(0,0,0,.25)` }}>
        <div className="relative flex flex-col justify-center" style={{ width: '56%', padding: `${u(24)}px ${u(34)}px`, color: '#111', zIndex: 1 }}>
          <BrandMark L={L} color={p.bg} size={30} />
          <div style={{ marginTop: u(20) }}>
            <Title L={L} maxWidth={w * 0.46} first={58} rest={96} color={p.bg} />
          </div>
          {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(22), fontWeight: 700, marginTop: u(12) }}>{d.subhead}</div>}
          {d.contact && <div style={{ ...bodyFont(st), marginTop: u(16), display: 'inline-flex', alignSelf: 'flex-start', fontSize: f(26), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(6)}px ${u(18)}px`, borderRadius: u(6) }}>{d.contact}</div>}
          {d.address && <div style={{ ...bodyFont(st), fontSize: f(18), marginTop: u(10), opacity: 0.75 }}>{d.address}</div>}
        </div>
        <Picture d={d} st={st} className="absolute" style={{ top: 0, bottom: 0, right: 0, width: '52%', ...feather('ellipse 70% 80% at 70% 50%', 55) }} />
      </div>
    </div>
  );
}

/** Big speech bubble with the slogan over a full photo. */
export function CSpeech(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: '#fff' }}>
      <Picture d={d} st={st} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${p.bg}66, transparent 30%, transparent 70%, ${p.bg}cc)` }} />
      <div className="absolute" style={{ top: u(40), right: u(48) }}><BrandMark L={L} color="#fff" size={44} /></div>
      <div className="absolute" style={{ left: '8%', right: '8%', top: '9%' }}>
        <div className="relative text-center" style={{ background: '#fff', color: p.bg, borderRadius: '50%', padding: `${u(56)}px ${u(60)}px`, border: `${u(8)}px solid ${p.accent}`, boxShadow: `0 ${u(20)}px ${u(40)}px rgba(0,0,0,.3)`, transform: 'rotate(-4deg)' }}>
          {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 76, 14)), color: p.bg, lineHeight: 1.05, letterSpacing: '0.02em' }}>{d.subhead}</div>}
          <Title L={L} maxWidth={w * 0.62} first={74} color={p.accent} center />
          <svg viewBox="0 0 60 60" width={u(90)} className="absolute" style={{ left: '28%', bottom: -u(70) }}><path d="M0 0 L60 0 L10 60 Z" fill="#fff" /></svg>
        </div>
      </div>
      {d.offer && (
        <div className="absolute flex items-center justify-center text-center" style={{ left: u(40), bottom: u(46), width: u(190), height: u(190), borderRadius: '50%', background: '#fff', color: p.bg, border: `${u(6)}px solid ${p.accent}`, padding: u(20) }}>
          <span style={{ ...kd(st), fontSize: f(fit(d.offer, 34, 10)), lineHeight: 1.1 }}>{d.offer}</span>
        </div>
      )}
      <div className="absolute text-right" style={{ right: u(48), bottom: u(46), ...bodyFont(st), fontSize: f(22), fontWeight: 700 }}>
        {d.contact && <div style={{ fontSize: f(34), fontWeight: 800 }}>{d.contact}</div>}
        {d.address && <div style={{ opacity: 0.9 }}>{d.address}</div>}
      </div>
    </div>
  );
}

/** Painted-on-the-wall headline over a coloured wall and wooden floor, product in the room. */
export function CWallType(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: p.bg, color: p.ink }}>
      <div className="absolute left-0 right-0" style={{ bottom: u(150), height: '24%', background: `repeating-linear-gradient(100deg, ${p.bg2} 0 ${u(60)}px, ${p.bg2}dd ${u(60)}px ${u(64)}px)` }} />
      <div className="absolute" style={{ left: 0, right: 0, bottom: u(150), height: '24%', background: 'linear-gradient(to bottom, rgba(0,0,0,.35), transparent 40%)' }} />
      <div className="relative flex justify-between" style={{ padding: `${u(36)}px ${u(48)}px 0`, ...bodyFont(st), fontSize: f(20), opacity: 0.85 }}>
        <span>{d.cta}</span><span>{d.address}</span>
      </div>
      <div className="relative" style={{ marginTop: u(50), padding: `0 ${u(60)}px` }}>
        <Title L={L} maxWidth={w * 0.82} first={84} rest={110} color={p.ink} center style={{ textShadow: `0 ${u(2)}px ${u(2)}px rgba(0,0,0,.18)` }} />
        {d.subhead && <div className="text-center" style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 700, marginTop: u(16), letterSpacing: '0.04em' }}>{d.subhead}</div>}
      </div>
      <div className="relative flex-1">
        <Picture d={d} st={st} className="absolute" style={{ left: '14%', right: '14%', top: u(20), bottom: u(150), ...feather('ellipse 50% 50% at 50% 55%', 58) }} />
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between" style={{ height: u(150), background: '#fff', color: '#111', padding: `0 ${u(48)}px`, gap: u(16) }}>
        <div>
          <div style={{ ...kd(st), fontSize: f(58), lineHeight: 1 }}>{d.brand}</div>
          {d.offer && <div style={{ ...bodyFont(st), fontSize: f(20), opacity: 0.75 }}>{d.offer}</div>}
        </div>
        <ContactPill L={L} bg="#efece8" color="#111" iconBg={p.bg} iconColor="#fff" />
      </div>
    </div>
  );
}

/** Sky, a winding road into the clouds, photo on the road and a golden headline. */
export function CSurreal(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${p.bg2} 0%, #fff6e0 55%, ${p.bg} 100%)`, color: p.ink }}>
      <div className="absolute" style={{ right: '10%', top: '8%', width: u(260), height: u(260), borderRadius: '50%', background: 'radial-gradient(circle, #fff7d1, transparent 70%)' }} />
      <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path d="M30 100 C35 75 70 70 75 50 C80 30 60 18 82 4" fill="none" stroke="#5b6168" strokeWidth="13" strokeLinecap="round" />
        <path d="M30 100 C35 75 70 70 75 50 C80 30 60 18 82 4" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2 2.5" />
      </svg>
      <Cloud width={u(220)} style={{ position: 'absolute', left: '50%', top: '26%' }} />
      <Cloud width={u(180)} style={{ position: 'absolute', left: u(20), top: '14%', opacity: 0.8 }} />
      <div className="absolute" style={{ top: u(40), right: u(48) }}><BrandMark L={L} color={p.ink} size={36} /></div>
      <div className="absolute" style={{ left: '10%', right: '10%', bottom: '14%', height: '42%' }}>
        <Picture d={d} st={st} className="absolute inset-0" style={feather('ellipse 50% 50% at 50% 50%', 60)} />
      </div>
      <div className="absolute" style={{ left: u(60), top: '28%' }}>
        {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 40, 22)), color: p.ink }}>{d.subhead}</div>}
        <Title L={L} maxWidth={w * 0.6} first={130} color={p.accent} style={{ ...gradientText(p.accent2, p.accent), filter: `drop-shadow(0 ${u(6)}px ${u(8)}px rgba(0,0,0,.25))` }} />
      </div>
      <div className="absolute left-0 right-0 text-center" style={{ bottom: u(40), padding: `0 ${u(60)}px`, ...bodyFont(st), color: '#fff', fontSize: f(18), lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>
        {d.body && <div>{lines(d.body).join(' | ')}</div>}
        <div style={{ fontWeight: 800, letterSpacing: '0.25em', fontSize: f(20), marginTop: u(8) }}>{[d.contact, d.address].filter(Boolean).join('  ·  ')}</div>
      </div>
    </div>
  );
}

function Pin({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 32" width={size} height={size * 1.33}>
      <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0z" fill={color} />
      <circle cx="12" cy="12" r="4.6" fill="#fff" />
    </svg>
  );
}

/** Light map with location pins, slanted headline and two people walking in. */
export function CPins(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  const places = d.address.split(/[|,]/).map(s => s.trim()).filter(Boolean).slice(0, 2);
  return (
    <div className="absolute inset-0" style={{ background: p.bg, color: p.ink, backgroundImage: `linear-gradient(${p.bg2} 2px, transparent 2px), linear-gradient(90deg, ${p.bg2} 2px, transparent 2px)`, backgroundSize: `${u(90)}px ${u(90)}px` }}>
      <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.5 }}>
        <path d="M-5 30 C30 40 50 10 105 25 M10 105 C20 60 60 70 70 -5 M-5 80 C40 70 70 95 105 70" fill="none" stroke={p.bg2} strokeWidth="3" />
      </svg>
      <div className="absolute" style={{ top: u(40), left: u(48) }}><BrandMark L={L} color={p.ink} size={36} /></div>
      {places.map((pl, i) => (
        <div key={pl} className="absolute flex flex-col items-center" style={{ right: i ? '6%' : '14%', top: i ? '42%' : '7%' }}>
          <Pin size={u(70)} color={p.accent} />
          <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, marginTop: u(4) }}>{pl}</div>
        </div>
      ))}
      <div className="absolute" style={{ left: u(60), top: '24%', transform: 'rotate(-4deg)' }}>
        <Title L={L} maxWidth={w * 0.66} first={84} color={p.accent2} style={{ textShadow: `${outline('#fff', u(5))}, 0 ${u(10)}px ${u(18)}px rgba(0,0,0,.2)` }} />
        {d.offer && <div style={{ ...bodyFont(st), display: 'inline-block', marginTop: u(14), fontSize: f(22), fontWeight: 800, background: p.accent, color: p.onAccent, padding: `${u(6)}px ${u(20)}px`, borderRadius: u(6) }}>{d.offer}</div>}
      </div>
      <Picture d={d} st={st} className="absolute" style={{ left: '12%', right: '12%', bottom: u(110), height: '40%', ...feather('ellipse 50% 50% at 50% 55%', 58) }} />
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between" style={{ padding: `${u(26)}px ${u(48)}px`, ...bodyFont(st), fontWeight: 800 }}>
        <span style={{ fontSize: f(22), letterSpacing: '0.08em' }}>{d.subhead}</span>
        <span style={{ fontSize: f(30) }}>{d.contact}</span>
      </div>
    </div>
  );
}

/** Magenta glow, gold ribbons, 3D outlined headline, CTA pill and a big cut-out. */
export function CCaricature(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse at 50% 30%, ${p.bg2}, ${p.bg} 75%)`, color: '#fff' }}>
      <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path d="M-5 20 C20 5 30 30 50 15 S80 0 105 12" fill="none" stroke={p.accent2} strokeWidth="2.4" opacity=".8" />
        <path d="M-5 70 C15 60 25 85 45 75" fill="none" stroke={p.accent2} strokeWidth="2" opacity=".6" />
        <path d="M70 90 C80 70 95 80 105 65" fill="none" stroke={p.accent2} strokeWidth="2" opacity=".6" />
      </svg>
      <div className="relative" style={{ marginTop: u(56) }}>
        {d.subhead && <div style={{ ...kd(st), fontSize: f(fit(d.subhead, 40, 22)), opacity: 0.95 }}>{d.subhead}</div>}
        <Title L={L} maxWidth={w * 0.84} first={128} rest={60} color="#fff" center style={{ textShadow: `${outline(p.onAccent, u(5))}, ${extrude(p.onAccent, 8, u(1.4))}` }} />
      </div>
      {d.cta && <div className="relative" style={{ ...bodyFont(st), marginTop: u(18), fontSize: f(26), fontWeight: 800, background: p.accent, color: '#fff', padding: `${u(8)}px ${u(30)}px`, borderRadius: 999 }}>{d.cta}</div>}
      {d.body && <div className="relative" style={{ ...bodyFont(st), marginTop: u(14), fontSize: f(20), fontWeight: 700, lineHeight: 1.45, maxWidth: '80%' }}>{lines(d.body).join(', ')}</div>}
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ inset: `${u(10)}px 14% 0`, ...feather('ellipse 50% 52% at 50% 52%', 60) }} />
      </div>
      <div className="relative" style={{ ...bodyFont(st), fontSize: f(20), fontWeight: 700, padding: `${u(18)}px 0 ${u(30)}px` }}>{[d.brand, d.contact].filter(Boolean).join('  ·  ')}</div>
    </div>
  );
}

/** One product on a flat colour, headline in two tones at the side. */
export function CMinimalProduct(L: LayoutProps) {
  const { d, st, f, u, w, h } = L, p = st.palette;
  const ttl = lines(d.headline);
  const wide = w > h;
  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 40% 45%, ${p.bg2}, ${p.bg} 70%)`, color: p.ink }}>
      <div className="absolute" style={{ top: u(40), left: u(48), ...bodyFont(st), fontSize: f(20), fontWeight: 600, opacity: 0.8 }}>{d.address}</div>
      <div className="absolute" style={{ top: u(36), right: u(48) }}><BrandMark L={L} color={p.ink} size={36} /></div>
      <div className="absolute" style={{ left: '6%', top: '14%', width: wide ? '44%' : '54%', bottom: '14%', filter: `drop-shadow(0 ${u(24)}px ${u(30)}px rgba(0,0,0,.3))` }}>
        <Picture d={d} st={st} className="absolute inset-0" style={{ borderRadius: u(28), transform: 'rotate(-6deg)' }} />
      </div>
      <div className="absolute" style={{ right: u(56), bottom: '20%', maxWidth: '40%', textAlign: 'right' }}>
        {ttl.map((t, i) => (
          <div key={i} style={{ ...kd(st), whiteSpace: 'nowrap', fontSize: titleSize(L, t, i % 2 ? 66 : 92, w * 0.38), lineHeight: 1.2, color: i % 2 ? p.ink : p.accent }}>{t}</div>
        ))}
        {d.offer && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 800, marginTop: u(14), color: p.accent2 }}>{d.offer}</div>}
      </div>
      <div className="absolute" style={{ right: u(56), bottom: u(40), ...bodyFont(st), fontSize: f(26), fontWeight: 800 }}>{d.contact}</div>
    </div>
  );
}

/** Dark, blurred-photo backdrop, script + bold headline, discount circle and contact pill. */
export function CDarkPromo(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: p.bg, color: '#fff' }}>
      <Picture d={d} st={st} className="absolute inset-0" style={{ filter: `blur(${u(18)}px)`, opacity: 0.35, transform: 'scale(1.15)' }} />
      <div className="absolute" style={{ top: u(40), left: u(48) }}><BrandMark L={L} color="#fff" size={34} /></div>
      <div className="relative" style={{ marginTop: u(110) }}>
        {d.subhead && <div style={{ ...script(), fontSize: f(fit(d.subhead, 74, 18)), color: p.accent2, lineHeight: 1 }}>{d.subhead}</div>}
        <Title L={L} maxWidth={w * 0.8} first={110} rest={70} color={p.accent} center />
        {d.cta && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 600, marginTop: u(6), opacity: 0.9 }}>{d.cta}</div>}
      </div>
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ inset: `${u(30)}px 14% ${u(30)}px`, borderRadius: u(30), boxShadow: `0 ${u(30)}px ${u(50)}px rgba(0,0,0,.5)` }} />
        {d.offer && (
          <div className="absolute flex items-center justify-center text-center" style={{ left: '7%', top: '8%', width: u(200), height: u(200), borderRadius: '50%', background: p.accent, color: p.onAccent, transform: 'rotate(-10deg)', padding: u(20), boxShadow: `0 0 0 ${u(10)}px ${p.accent}44` }}>
            <span style={{ ...kd(st), fontSize: f(fit(d.offer, 40, 9)), lineHeight: 1.05 }}>{d.offer}</span>
          </div>
        )}
      </div>
      <div className="relative" style={{ paddingBottom: u(44) }}>
        <ContactPill L={L} bg={p.accent} color={p.onAccent} iconBg="#fff" iconColor={p.bg} />
      </div>
    </div>
  );
}

/** Soft garden bokeh, "Happy" script over the festival word, mascot centre, contact strips. */
export function CFestiveMascot(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse at 50% 30%, #ffffff, ${p.bg2} 60%, ${p.bg})`, color: p.ink }}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="absolute" style={{ left: `${rand(i) * 100}%`, top: `${rand(i + 20) * 70}%`, width: u(80 + rand(i + 40) * 140), height: u(80 + rand(i + 40) * 140), borderRadius: '50%', background: i % 2 ? p.accent : p.accent2, opacity: 0.12, filter: `blur(${u(16)}px)` }} />
      ))}
      <div className="relative w-full flex justify-start" style={{ padding: `${u(40)}px ${u(48)}px 0` }}><BrandMark L={L} color={p.ink} size={34} /></div>
      <div className="relative" style={{ marginTop: u(20) }}>
        {d.subhead && <div style={{ ...script(), fontSize: f(fit(d.subhead, 80, 16)), color: p.accent, lineHeight: 1 }}>{d.subhead}</div>}
        <Title L={L} maxWidth={w * 0.8} first={120} rest={80} color={p.ink} center />
        {d.body && <div style={{ ...bodyFont(st), fontSize: f(22), marginTop: u(8), opacity: 0.85, maxWidth: w * 0.7 }}>{lines(d.body).join(' ')}</div>}
      </div>
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ inset: `${u(10)}px 12% 0`, ...feather('ellipse 50% 50% at 50% 55%', 60) }} />
      </div>
      <div className="relative w-full flex items-center justify-between" style={{ background: '#fff', color: '#111', padding: `${u(20)}px ${u(48)}px`, gap: u(16) }}>
        <div style={{ ...bodyFont(st), fontSize: f(34), fontWeight: 800, display: 'flex', alignItems: 'center', gap: u(10) }}>{d.contact && <><PhoneIcon size={u(34)} color={p.accent} />{d.contact}</>}</div>
        <div style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 600, textAlign: 'right', maxWidth: '50%' }}>{d.address}</div>
      </div>
      <div className="relative w-full flex items-center justify-center" style={{ background: p.bg, padding: `${u(12)}px 0`, gap: u(16) }}>
        <Socials size={u(36)} color={p.bg} bg="#fff" />
        {d.cta && <span style={{ ...bodyFont(st), color: '#fff', fontSize: f(20), fontWeight: 700 }}>{d.cta}</span>}
      </div>
    </div>
  );
}

/** Bright colour, falling golden petals, 3D headline, photo in bloom. */
export function CBloom(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col items-center text-center" style={{ background: `radial-gradient(ellipse at 50% 60%, ${p.bg2}, ${p.bg} 75%)`, color: '#fff' }}>
      {Array.from({ length: 34 }, (_, i) => (
        <div key={i} className="absolute" style={{ left: `${rand(i + 3) * 100}%`, top: `${rand(i + 60) * 100}%`, width: u(14 + rand(i + 9) * 22), height: u(10 + rand(i + 9) * 14), borderRadius: '50% 50% 50% 0', background: p.accent, transform: `rotate(${rand(i) * 360}deg)`, opacity: 0.9 }} />
      ))}
      <div className="relative w-full flex justify-end" style={{ padding: `${u(40)}px ${u(48)}px 0` }}><BrandMark L={L} color="#fff" size={34} /></div>
      <div className="relative" style={{ marginTop: u(16) }}>
        <Title L={L} maxWidth={w * 0.8} first={84} rest={116} color="#fff" center style={{ textShadow: `${extrude(p.onAccent, 6, u(1.5))}, 0 ${u(14)}px ${u(24)}px rgba(0,0,0,.3)` }} />
        {d.subhead && <div style={{ ...bodyFont(st), fontSize: f(26), fontWeight: 700, marginTop: u(10) }}>{d.subhead}</div>}
      </div>
      <div className="relative flex-1 w-full">
        <Picture d={d} st={st} className="absolute" style={{ inset: `${u(20)}px 16% ${u(10)}px`, borderRadius: `${u(300)}px ${u(300)}px ${u(24)}px ${u(24)}px`, border: `${u(10)}px solid ${p.accent}`, boxShadow: `0 ${u(24)}px ${u(40)}px rgba(0,0,0,.3)` }} />
        {d.offer && <div className="absolute" style={{ ...kd(st), left: '50%', bottom: u(30), transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: f(fit(d.offer, 34, 16)), background: p.accent, color: p.onAccent, padding: `${u(10)}px ${u(28)}px`, borderRadius: u(10) }}>{d.offer}</div>}
      </div>
      <div className="relative" style={{ ...bodyFont(st), fontSize: f(18), fontWeight: 700, padding: `${u(16)}px ${u(40)}px ${u(34)}px`, lineHeight: 1.6 }}>
        {d.body && <div>{lines(d.body).join(' | ')}</div>}
        {d.contact && <div style={{ fontSize: f(24) }}>{d.contact}</div>}
      </div>
    </div>
  );
}

/** Festive event: bunting, huge gradient title, date box, chief guest cut-out, info bar. */
export function CEventBanner(L: LayoutProps) {
  const { d, st, f, u, w } = L, p = st.palette;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #fffbe8, ${p.bg2} 70%)`, color: p.ink }}>
      <div className="relative text-center" style={{ padding: `${u(36)}px ${u(48)}px 0` }}>
        <BrandMark L={L} color={p.accent2} size={34} center />
        {d.cta && <div style={{ ...kd(st), fontSize: f(fit(d.cta, 34, 26)), color: p.accent2, marginTop: u(8) }}>{d.cta}</div>}
      </div>
      <div className="relative" style={{ marginTop: u(16) }}><Bunting width={w} height={u(70)} colors={[p.accent, p.accent2, '#22c55e', '#facc15', '#3b82f6']} /></div>
      <div className="relative" style={{ padding: `${u(10)}px ${u(48)}px` }}>
        <Title L={L} maxWidth={w * 0.86} first={150} rest={120} color={p.accent} center style={{ ...gradientText(p.accent, p.accent2, 180), filter: `drop-shadow(${u(4)}px ${u(4)}px 0 #fff) drop-shadow(0 ${u(10)}px ${u(14)}px rgba(0,0,0,.25))` }} />
        {d.subhead && <div className="text-center" style={{ ...kd(st), fontSize: f(fit(d.subhead, 56, 18)), color: p.accent2 }}>{d.subhead}</div>}
      </div>
      <div className="relative flex-1">
        <Picture d={d} st={st} className="absolute" style={{ left: 0, bottom: 0, top: 0, width: '52%', ...feather('ellipse 55% 55% at 45% 55%', 58) }} />
        <div className="absolute flex flex-col items-end" style={{ right: u(56), top: u(20), gap: u(18), maxWidth: '44%' }}>
          {d.date && <div style={{ ...kd(st), fontSize: f(fit(d.date, 64, 10)), background: '#fff', color: p.accent, border: `${u(6)}px solid ${p.accent}`, padding: `${u(10)}px ${u(24)}px`, borderRadius: u(14), textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line' }}>{d.date}</div>}
          {d.body && <div style={{ ...bodyFont(st), fontSize: f(24), fontWeight: 700, textAlign: 'right', lineHeight: 1.45 }}>{lines(d.body).map((t, i) => <div key={i}>{t}</div>)}</div>}
        </div>
      </div>
      <div className="relative" style={{ background: p.accent2, color: '#fff', padding: `${u(18)}px ${u(48)}px`, ...bodyFont(st), fontSize: f(24), fontWeight: 800, textAlign: 'center' }}>
        {[d.offer, d.contact].filter(Boolean).join(' : ')}
      </div>
    </div>
  );
}
