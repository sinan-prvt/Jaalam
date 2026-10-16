import { useEffect, useRef, useState } from 'react';

export interface ThemeStat { value: string; label: string }

/** Owner-entered stats (Editor → Stats), empty rows dropped. */
// eslint-disable-next-line react-refresh/only-export-components
export const getStats = (content: any): ThemeStat[] =>
  (content?.settings_json?.stats || []).filter((s: any) => s && (String(s.value || '').trim() || String(s.label || '').trim()));

/** Counts the number inside a stat up from zero once it scrolls into view ("12+", "₹2.4 Cr", "4.9★"). */
function CountUp({ value }: { value: string }) {
  const match = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match) { setShown(value); return; }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] || '').length;
    const commas = num.includes(',');
    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      return commas ? Number(fixed).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : fixed;
    };
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(p < 1 ? `${prefix}${format(target * eased)}${suffix}` : value);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{shown}</span>;
}

const COLS: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' };

/**
 * Stats / achievements strip placed right after a theme's hero.
 * Renders nothing until the owner adds stats, and inherits the theme's text colour
 * and font so it fits light and dark themes alike. `accent` tints the numbers.
 */
export default function ThemeStats({ content, accent, className = '' }: { content: any; accent?: string; className?: string }) {
  const stats = getStats(content).slice(0, 4);
  const settings = content?.settings_json || {};
  if (!stats.length || (settings.hidden_sections || []).includes('stats')) return null;

  // Sit right after the hero in themes that position sections with CSS order
  const order = Math.max(0, (settings.section_order || ['hero']).indexOf('hero')) + 1;

  return (
    <section id="stats" style={{ order }} className={`relative z-10 w-full px-6 py-10 md:py-14 ${className}`}>
      <div className={`max-w-6xl mx-auto grid ${COLS[stats.length]} border-y border-current/10`}>
        {stats.map((s, i) => (
          <div
            key={i}
            className={`text-center px-3 py-7 md:py-9 ${i > 0 ? 'md:border-l border-current/10' : ''} ${stats.length === 4 && i % 2 === 1 ? 'border-l border-current/10' : ''} ${stats.length !== 4 && i > 0 ? 'border-l border-current/10' : ''} ${stats.length === 4 && i > 1 ? 'border-t md:border-t-0 border-current/10' : ''}`}
          >
            <div className={`${stats.length >= 3 ? 'text-2xl' : 'text-3xl'} sm:text-4xl md:text-5xl font-bold tracking-tight leading-none tabular-nums whitespace-nowrap`} style={accent ? { color: accent } : undefined}>
              <CountUp value={String(s.value || '')} />
            </div>
            {s.label && <div className="mt-3 text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] opacity-60">{s.label}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
