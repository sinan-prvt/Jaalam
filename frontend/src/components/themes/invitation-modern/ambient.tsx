import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { AmbientKind } from './inviteThemes';
import { ambientFor, findInviteTheme } from './inviteThemes';
import { getInvitePalette } from './palettes';

/**
 * A sparse, slow layer of falling petals / confetti / leaves, or drifting gold dust
 * and twinkling stars, over an opened invitation. Plain CSS animation (cheap on
 * phones), clicks pass through, and it is switched off for reduced-motion users.
 */

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const KEYFRAMES = `
@keyframes jl-fall { 0% { transform: translate3d(0,-12vh,0) rotate(0deg); } 50% { transform: translate3d(var(--sway),48vh,0) rotate(200deg); } 100% { transform: translate3d(0,112vh,0) rotate(400deg); } }
@keyframes jl-rise { 0% { transform: translate3d(0,0,0); opacity: 0; } 15% { opacity: var(--glow); } 85% { opacity: var(--glow); } 100% { transform: translate3d(var(--sway),-40vh,0); opacity: 0; } }
@keyframes jl-twinkle { 0%, 100% { opacity: .15; transform: scale(.7); } 50% { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .jl-ambient { display: none; } }
`;

interface Shape { node: ReactNode; size: number }

function shape(kind: AmbientKind, i: number, colors: string[]): Shape {
  const c = colors[i % colors.length];
  const s = 10 + rand(i + 3) * 9;
  const petal = (fill: string, radius = '150% 0 150% 0'): Shape => ({ size: s, node: <span style={{ display: 'block', width: s, height: s * 1.2, background: fill, borderRadius: radius, opacity: 0.85, boxShadow: '0 1px 2px rgba(0,0,0,.08)' }} /> });
  switch (kind) {
    case 'roses': return petal(['#9f1239', '#be123c', '#e11d48', '#fda4af'][i % 4]);
    case 'marigold': return petal(['#f59e0b', '#ea580c', '#facc15'][i % 3], '50% 50% 50% 50% / 60% 60% 40% 40%');
    case 'jasmine': return petal('#fffdf5', '60% 40% 60% 40%');
    case 'blossom': return petal(['#ffffff', '#fde2e8', '#fef3f2'][i % 3], '60% 0 60% 0');
    case 'confetti': return { size: s, node: <span style={{ display: 'block', width: s * 0.8, height: s * 0.4, borderRadius: 2, background: [c, '#facc15', '#22d3ee', '#f472b6'][i % 4] }} /> };
    case 'hearts': return { size: s, node: <svg viewBox="0 0 24 24" width={s} height={s}><path d="M12 21C5 15.5 2 12.5 2 8.8A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 10 2.2C22 12.5 19 15.5 12 21z" fill={c} opacity=".8" /></svg> };
    case 'leaves': return { size: s, node: <svg viewBox="0 0 24 24" width={s * 1.3} height={s * 1.3}><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" fill={['#4d7c0f', '#65a30d', '#15803d'][i % 3]} opacity=".85" /></svg> };
    default: return petal(c);
  }
}

export function AmbientParticles({ kind, colors }: { kind: AmbientKind; colors: string[] }) {
  const floating = kind === 'dust' || kind === 'sparkles';
  const count = kind === 'stars' ? 40 : floating ? 34 : kind === 'confetti' ? 20 : 14;
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  const glowColor = kind === 'dust' ? '#e8c770' : colors[0];

  return (
    <div className="jl-ambient pointer-events-none fixed inset-0 z-[45] overflow-hidden" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      {particles.map(i => {
        const left = `${rand(i) * 100}%`;
        const sway = `${(rand(i + 7) - 0.5) * 18}vw`;
        if (kind === 'stars') {
          const size = 2 + rand(i + 2) * 2.5;
          return <span key={i} style={{ position: 'absolute', left, top: `${rand(i + 11) * 100}%`, width: size, height: size, borderRadius: '50%', background: '#fff', boxShadow: `0 0 ${size * 3}px ${glowColor}`, animation: `jl-twinkle ${2 + rand(i + 5) * 4}s ease-in-out ${-rand(i + 9) * 6}s infinite` }} />;
        }
        if (floating) {
          const size = 1.5 + rand(i + 2) * 3.5;
          const style = { position: 'absolute', left, top: `${40 + rand(i + 11) * 70}%`, width: size, height: size, borderRadius: '50%', background: glowColor, boxShadow: `0 0 ${size * 4}px ${glowColor}`, '--sway': sway, '--glow': 0.5 + rand(i + 4) * 0.5, animation: `jl-rise ${14 + rand(i + 5) * 14}s linear ${-rand(i + 9) * 28}s infinite` } as CSSProperties;
          return <span key={i} style={style} />;
        }
        const { node } = shape(kind, i, colors);
        const duration = 18 + rand(i + 5) * 14;
        const style = { position: 'absolute', left, top: 0, '--sway': sway, animation: `jl-fall ${duration}s linear ${-rand(i + 9) * duration}s infinite` } as CSSProperties;
        return <span key={i} style={style}>{node}</span>;
      })}
    </div>
  );
}

/**
 * For invitation layouts that run their own cover screen: start the ambient layer
 * on the guest's first tap (the tap that opens the cover).
 */
export function AmbientAfterTap({ category, theme }: { category: string; theme?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (on) return;
    const start = () => setOn(true);
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => { window.removeEventListener('pointerdown', start); window.removeEventListener('keydown', start); };
  }, [on]);
  if (!on) return null;
  const palette = getInvitePalette(category);
  return <AmbientParticles kind={ambientFor(category, findInviteTheme(theme))} colors={[palette.accent, palette.accent2, palette.accent3]} />;
}
