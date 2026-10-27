import type { ReactElement } from 'react';
import type { ArtKey, Palette } from './types';

/**
 * Vector artwork for the image slot, drawn from the poster palette so it
 * always matches. Each piece fills its box (like object-fit: cover).
 */
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Pookalam({ p }: { p: Palette }) {
  // Concentric rings of petals, the classic Onam flower carpet
  const rings = [
    { r: 185, n: 36, c: p.accent, w: 26 },
    { r: 150, n: 30, c: '#f97316', w: 24 },
    { r: 118, n: 24, c: '#facc15', w: 22 },
    { r: 88, n: 20, c: '#dc2626', w: 20 },
    { r: 60, n: 16, c: '#7c3aed', w: 18 },
    { r: 34, n: 12, c: '#16a34a', w: 14 },
  ];
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <circle cx="200" cy="200" r="198" fill="#15803d" />
      {rings.map((ring, k) => (
        <g key={k}>
          <circle cx="200" cy="200" r={ring.r + ring.w / 2} fill={k % 2 ? '#fde68a' : '#fff7ed'} />
          {range(ring.n).map(i => {
            // Pointed petal along the radius
            const tw = ((Math.PI * ring.r) / ring.n) * 1.05, top = 200 - ring.r - ring.w / 2, bot = 200 - ring.r + ring.w / 2;
            return <path key={i} d={`M200 ${top} Q${200 + tw} ${200 - ring.r} 200 ${bot} Q${200 - tw} ${200 - ring.r} 200 ${top}Z`} fill={ring.c} transform={`rotate(${(360 / ring.n) * i} 200 200)`} />;
          })}
        </g>
      ))}
      <circle cx="200" cy="200" r="16" fill="#fbbf24" />
      <circle cx="200" cy="200" r="7" fill="#b91c1c" />
    </svg>
  );
}

function Konna({ p }: { p: Palette }) {
  // Golden shower (Kani Konna) blossoms hanging in strands, for Vishu
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <path d="M0 18 Q200 70 400 10" stroke="#365314" strokeWidth="10" fill="none" />
      {range(16).map(s => {
        const x = 14 + s * 25;
        const len = 120 + ((s * 53) % 170);
        return (
          <g key={s}>
            <line x1={x} y1="30" x2={x + 4} y2={30 + len} stroke="#4d7c0f" strokeWidth="1.5" />
            {range(Math.floor(len / 13)).map(i => (
              <circle key={i} cx={x + 4 * (i / (len / 13)) + (i % 2 ? 5 : -5)} cy={40 + i * 13} r={6 - i * 0.12} fill={i % 3 ? '#facc15' : '#fde047'} stroke="#eab308" strokeWidth="1" />
            ))}
          </g>
        );
      })}
      <ellipse cx="200" cy="370" rx="160" ry="22" fill={p.accent} opacity=".35" />
    </svg>
  );
}

function Lamps({ p }: { p: Palette }) {
  // A row of glowing diyas
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <defs>
        <radialGradient id="glow"><stop offset="0" stopColor="#fde68a" stopOpacity=".9" /><stop offset="1" stopColor="#f59e0b" stopOpacity="0" /></radialGradient>
      </defs>
      {range(40).map(i => <circle key={i} cx={(i * 97) % 400} cy={(i * 53) % 260} r={i % 5 ? 1.5 : 2.5} fill="#fde68a" opacity=".7" />)}
      {[70, 200, 330, 135, 265].map((x, i) => {
        const y = i < 3 ? 300 : 230;
        return (
          <g key={i}>
            <circle cx={x} cy={y - 34} r="46" fill="url(#glow)" />
            <path d={`M${x - 12} ${y - 22} Q${x} ${y - 70} ${x + 12} ${y - 22} Q${x} ${y - 14} ${x - 12} ${y - 22}`} fill="#fbbf24" />
            <path d={`M${x - 6} ${y - 24} Q${x} ${y - 50} ${x + 6} ${y - 24}`} fill="#fff7ed" />
            <path d={`M${x - 46} ${y - 18} Q${x} ${y + 36} ${x + 46} ${y - 18} Z`} fill={p.accent} />
            <path d={`M${x - 46} ${y - 18} Q${x} ${y - 4} ${x + 46} ${y - 18}`} fill="none" stroke="#fde68a" strokeWidth="3" />
          </g>
        );
      })}
    </svg>
  );
}

function StarArt({ p }: { p: Palette }) {
  const star = (cx: number, cy: number, r: number) =>
    range(10).map(i => {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 ? r * 0.42 : r;
      return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
    }).join(' ');
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      {range(70).map(i => <circle key={i} cx={(i * 131) % 400} cy={(i * 71) % 400} r={(i % 3) + 1} fill="#fff" opacity=".6" />)}
      <line x1="200" y1="0" x2="200" y2="70" stroke={p.accent} strokeWidth="3" />
      <polygon points={star(200, 190, 120)} fill={p.accent} stroke="#fff" strokeWidth="4" />
      <polygon points={star(200, 190, 60)} fill="#fff" opacity=".35" />
      {range(12).map(i => <line key={i} x1={130 + i * 12} y1="300" x2={130 + i * 12 + (i % 2 ? 4 : -4)} y2={330 + (i % 3) * 18} stroke={p.accent} strokeWidth="2" />)}
      <polygon points={star(70, 80, 22)} fill="#fff" opacity=".8" />
      <polygon points={star(340, 110, 16)} fill="#fff" opacity=".8" />
    </svg>
  );
}

function Crescent({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      {range(60).map(i => <circle key={i} cx={(i * 113) % 400} cy={(i * 59) % 400} r={(i % 3) * 0.8 + 0.8} fill="#fff" opacity=".55" />)}
      <circle cx="210" cy="160" r="110" fill={p.accent} />
      <circle cx="255" cy="130" r="98" fill={p.bg2} />
      {/* Hanging lanterns */}
      {[90, 320].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="0" x2={x} y2={150 + i * 40} stroke={p.accent} strokeWidth="2" />
          <path d={`M${x - 22} ${170 + i * 40} L${x} ${145 + i * 40} L${x + 22} ${170 + i * 40} L${x + 18} ${225 + i * 40} L${x - 18} ${225 + i * 40} Z`} fill={p.accent} />
          <rect x={x - 11} y={180 + i * 40} width="22" height="34" rx="4" fill="#fde68a" />
        </g>
      ))}
      <path d="M0 400 L0 330 Q60 300 90 330 L90 290 Q130 230 170 290 L170 320 Q200 250 230 320 L230 290 Q270 230 310 290 L310 330 Q340 300 400 330 L400 400 Z" fill={p.ink} opacity=".25" />
    </svg>
  );
}

function Confetti({ p }: { p: Palette }) {
  const colors = [p.accent, p.accent2, '#facc15', '#22d3ee', '#f472b6', '#a3e635'];
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      {range(90).map(i => {
        const x = (i * 89) % 400, y = (i * 47) % 400, c = colors[i % colors.length];
        return i % 3 === 0
          ? <circle key={i} cx={x} cy={y} r={4 + (i % 4)} fill={c} />
          : <rect key={i} x={x} y={y} width="6" height="16" rx="2" fill={c} transform={`rotate(${(i * 37) % 180} ${x} ${y})`} />;
      })}
      {[[110, 150, p.accent], [200, 110, p.accent2], [290, 160, '#facc15']].map(([x, y, c], i) => (
        <g key={i}>
          <path d={`M${x} ${Number(y) + 62} Q${Number(x) + 10} ${Number(y) + 140} ${Number(x) - 6} ${Number(y) + 230}`} stroke={p.ink} strokeWidth="1.5" fill="none" opacity=".5" />
          <ellipse cx={x} cy={y} rx="46" ry="58" fill={String(c)} />
          <ellipse cx={Number(x) - 15} cy={Number(y) - 20} rx="10" ry="16" fill="#fff" opacity=".4" />
        </g>
      ))}
    </svg>
  );
}

function Waves({ p }: { p: Palette }) {
  // Backwaters with coconut palms and a vallam (boat)
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: `linear-gradient(${p.bg2}, ${p.accent2})` }}>
      <circle cx="300" cy="120" r="46" fill="#fde68a" opacity=".9" />
      {[[60, 260, -8], [110, 250, 6], [340, 255, -4]].map(([x, y, tilt], i) => (
        <g key={i} transform={`rotate(${tilt} ${x} ${y})`}>
          <path d={`M${x} ${y} Q${Number(x) + 8} ${Number(y) - 90} ${Number(x) + 2} ${Number(y) - 170}`} stroke="#3f2d1d" strokeWidth="7" fill="none" />
          {range(7).map(k => (
            <path key={k} d={`M${Number(x) + 2} ${Number(y) - 170} q${Math.cos(k) * 50} ${-20 + Math.sin(k * 2) * 25} ${Math.cos(k) * 85} ${25 + k * 3}`} stroke="#14532d" strokeWidth="9" fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}
      <path d="M0 280 Q100 265 200 280 T400 280 V400 H0Z" fill={p.accent} opacity=".55" />
      <path d="M0 310 Q100 295 200 310 T400 310 V400 H0Z" fill={p.accent} opacity=".8" />
      <path d="M150 300 Q220 320 300 292 L292 304 Q220 330 158 308 Z" fill="#3f2d1d" />
      <path d="M0 350 Q100 335 200 350 T400 350 V400 H0Z" fill={p.ink} opacity=".35" />
    </svg>
  );
}

function Flag({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <path d="M-20 90 Q100 40 200 90 T420 90 V170 Q300 120 200 170 T-20 170Z" fill="#ff9933" />
      <path d="M-20 170 Q100 120 200 170 T420 170 V250 Q300 200 200 250 T-20 250Z" fill="#ffffff" />
      <path d="M-20 250 Q100 200 200 250 T420 250 V330 Q300 280 200 330 T-20 330Z" fill="#138808" />
      <circle cx="200" cy="208" r="30" fill="none" stroke="#000080" strokeWidth="4" />
      {range(24).map(i => <line key={i} x1="200" y1="208" x2={200 + 28 * Math.cos((i * Math.PI) / 12)} y2={208 + 28 * Math.sin((i * Math.PI) / 12)} stroke="#000080" strokeWidth="1.5" />)}
    </svg>
  );
}

function Candle({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <defs><radialGradient id="cg"><stop offset="0" stopColor="#fde68a" stopOpacity=".8" /><stop offset="1" stopColor="#fde68a" stopOpacity="0" /></radialGradient></defs>
      <circle cx="200" cy="140" r="130" fill="url(#cg)" />
      <path d="M200 70 Q228 125 200 160 Q172 125 200 70" fill="#fbbf24" />
      <path d="M200 100 Q212 130 200 152 Q188 130 200 100" fill="#fff7ed" />
      <rect x="170" y="165" width="60" height="190" rx="6" fill="#f8fafc" />
      <rect x="170" y="165" width="18" height="190" fill="#e2e8f0" />
      {range(5).map(i => <path key={i} d={`M${60 + i * 70} 400 q10 -40 0 -80`} stroke={p.accent} strokeWidth="2" fill="none" opacity=".3" />)}
    </svg>
  );
}

function Laurel({ p }: { p: Palette }) {
  // Laurel wreath around a trophy/star, for congratulations and results
  const leaves = (side: 1 | -1) => range(11).map(i => {
    const a = (Math.PI * (0.62 + i * 0.07)) * side;
    const x = 200 + 140 * Math.sin(a), y = 210 - 140 * Math.cos(a) * -1;
    return <ellipse key={`${side}${i}`} cx={x} cy={y} rx="26" ry="11" fill={p.accent} transform={`rotate(${(a * 180) / Math.PI + 90 * side} ${x} ${y})`} />;
  });
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <g opacity=".25">{range(36).map(i => <line key={i} x1="200" y1="200" x2={200 + 300 * Math.cos(i * Math.PI / 18)} y2={200 + 300 * Math.sin(i * Math.PI / 18)} stroke={p.accent} strokeWidth="8" />)}</g>
      {leaves(1)}{leaves(-1)}
      <path d="M150 130 H250 V170 Q250 230 200 240 Q150 230 150 170 Z" fill={p.accent} />
      <path d="M150 140 Q115 140 120 175 Q125 200 155 200" stroke={p.accent} strokeWidth="8" fill="none" />
      <path d="M250 140 Q285 140 280 175 Q275 200 245 200" stroke={p.accent} strokeWidth="8" fill="none" />
      <rect x="190" y="238" width="20" height="40" fill={p.accent} />
      <rect x="160" y="276" width="80" height="22" rx="4" fill={p.accent} />
    </svg>
  );
}

function Rays({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.accent }}>
      {range(24).map(i => <path key={i} d={`M200 200 L${200 + 400 * Math.cos(i * Math.PI / 12)} ${200 + 400 * Math.sin(i * Math.PI / 12)} L${200 + 400 * Math.cos((i + 0.5) * Math.PI / 12)} ${200 + 400 * Math.sin((i + 0.5) * Math.PI / 12)} Z`} fill={p.accent2} opacity=".55" />)}
      <circle cx="200" cy="200" r="80" fill={p.bg2} opacity=".3" />
    </svg>
  );
}

function Cross({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      <g opacity=".3">{range(24).map(i => <line key={i} x1="200" y1="160" x2={200 + 320 * Math.cos(i * Math.PI / 12)} y2={160 + 320 * Math.sin(i * Math.PI / 12)} stroke="#fde68a" strokeWidth="5" />)}</g>
      <rect x="185" y="60" width="30" height="260" rx="4" fill={p.accent} />
      <rect x="130" y="120" width="140" height="30" rx="4" fill={p.accent} />
      <path d="M60 400 Q200 320 340 400Z" fill={p.ink} opacity=".2" />
    </svg>
  );
}

function Book({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      {range(30).map(i => <text key={i} x={(i * 97) % 400} y={(i * 61) % 400} fontSize={14 + (i % 3) * 6} fill={p.accent} opacity=".25" fontFamily="serif">{['a', 'അ', '∑', 'π', 'A+', '✎'][i % 6]}</text>)}
      <path d="M60 140 Q130 110 200 140 V320 Q130 290 60 320 Z" fill="#fff" stroke={p.accent} strokeWidth="5" />
      <path d="M340 140 Q270 110 200 140 V320 Q270 290 340 320 Z" fill="#fff" stroke={p.accent} strokeWidth="5" />
      {range(6).map(i => <g key={i}><line x1="80" y1={165 + i * 22} x2="180" y2={160 + i * 22} stroke={p.accent} opacity=".4" strokeWidth="3" /><line x1="220" y1={160 + i * 22} x2="320" y2={165 + i * 22} stroke={p.accent} opacity=".4" strokeWidth="3" /></g>)}
      <path d="M160 60 L200 40 L240 60 L200 80 Z" fill={p.ink} /><line x1="232" y1="64" x2="232" y2="95" stroke={p.ink} strokeWidth="3" />
    </svg>
  );
}

function Heart({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" style={{ background: p.bg2 }}>
      {range(40).map(i => <path key={i} transform={`translate(${(i * 103) % 400} ${(i * 67) % 400}) scale(${0.25 + (i % 3) * 0.15})`} d="M0 10 C0 -5 20 -5 20 10 C20 -5 40 -5 40 10 C40 25 20 35 20 45 C20 35 0 25 0 10Z" fill={p.accent} opacity=".25" />)}
      <path transform="translate(110 100) scale(4.5)" d="M0 10 C0 -5 20 -5 20 10 C20 -5 40 -5 40 10 C40 25 20 35 20 45 C20 35 0 25 0 10Z" fill={p.accent} />
      <circle cx="160" cy="125" r="80" fill="none" stroke="#fde68a" strokeWidth="6" opacity=".9" />
      <circle cx="240" cy="125" r="80" fill="none" stroke="#fde68a" strokeWidth="6" opacity=".9" />
    </svg>
  );
}

const ART: Record<ArtKey, (props: { p: Palette }) => ReactElement> = {
  pookalam: Pookalam, konna: Konna, lamps: Lamps, star: StarArt, crescent: Crescent, confetti: Confetti,
  waves: Waves, flag: Flag, candle: Candle, laurel: Laurel, rays: Rays, cross: Cross, book: Book, heart: Heart,
};

export function PosterArt({ art, palette }: { art: ArtKey; palette: Palette }) {
  const A = ART[art] || Rays;
  return <A p={palette} />;
}
