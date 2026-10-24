import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfettiPopper } from '../../../utils/confettiPopper';
import type { Motif, OpeningKind, OpeningVariant } from './inviteThemes';
import { motifTile } from './motifTiles';

/**
 * Opening screens for invitations: what a guest sees before the page, and the
 * animation that plays when they tap. Each theme has its own (envelope, doors,
 * gift box, ticket, lamp...). `onOpen` is called once the animation has played.
 */

export interface OpeningProps {
  kind: OpeningKind;
  variant?: OpeningVariant;
  title: string;
  eyebrow: string;
  greeting: string;
  date: string;
  motif: Motif;
  /** accent, accent2, accent3 as hex. */
  colors: { a: string; b: string; c: string };
  titleFont: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  onOpen: () => void;
}

type Stage = 'idle' | 'opening';

const mix = (c: string, other: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, ${other})`;
const rand = (i: number) => {
  const x = Math.sin(i * 91.17) * 43758.5453;
  return x - Math.floor(x);
};

/** Starts the opening animation once, then calls onOpen after `ms`. */
function useSequence(onOpen: () => void, ms: number): [Stage, () => void] {
  const [stage, setStage] = useState<Stage>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const start = () => {
    if (stage !== 'idle') return;
    setStage('opening');
    timer.current = window.setTimeout(onOpen, ms);
  };
  return [stage, start];
}

function Shell({ stage, onTap, children, style, className = '', hint = 'Tap to open', hintClass = 'text-white/70' }: {
  stage: Stage; onTap: () => void; children: ReactNode; style?: CSSProperties; className?: string; hint?: string; hintClass?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open invitation"
      data-stage={stage}
      onClick={onTap}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } }}
      className={`fixed inset-0 z-[60] overflow-hidden cursor-pointer select-none flex items-center justify-center ${className}`}
      style={style}
    >
      {children}
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.p exit={{ opacity: 0 }} className={`absolute bottom-8 left-0 right-0 text-center text-[11px] uppercase tracking-[0.4em] animate-pulse pointer-events-none ${hintClass}`}>
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Words({ p, className = '', titleClass = '' }: { p: OpeningProps; className?: string; titleClass?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {p.greeting && <p className="text-lg md:text-xl opacity-90">{p.greeting}</p>}
      <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-80">{p.eyebrow}</p>
      <h2 className={`mt-3 text-4xl md:text-6xl leading-tight ${p.titleFont} ${titleClass}`}>{p.title}</h2>
      {p.date && <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.3em] opacity-80">{p.date}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Envelope(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1900);
  const open = stage === 'opening';
  const paper = mix(p.colors.a, '#f5ead7', 30);
  const shade = mix(p.colors.a, '#d9c7a8', 45);
  return (
    <Shell stage={stage} onTap={start} style={{ background: `radial-gradient(circle at 50% 40%, ${mix(p.colors.c, '#000', 70)}, #08080b 75%)` }}>
      <div className="absolute inset-0 opacity-[0.07]" style={motifTile(p.motif, p.colors.a, p.colors.b, 48)} />
      {/* Names above the sealed envelope, so guests see whose invitation it is before opening */}
      <motion.div className="absolute top-[10%] left-0 right-0 text-center px-6" style={{ color: mix(p.colors.a, '#fff', 60) }}
        animate={open ? { opacity: 0, y: -20 } : { opacity: 1 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.45em] opacity-80">{p.eyebrow}</p>
        <h2 className={`mt-3 text-3xl md:text-5xl ${p.titleFont}`}>{p.title}</h2>
        {p.date && <p className="mt-3 text-[11px] uppercase tracking-[0.3em] opacity-70">{p.date}</p>}
      </motion.div>
      <div className="relative mt-24" style={{ width: 'min(86vw, 440px)', aspectRatio: '3 / 2', perspective: 1200 }}>
        <div className="absolute inset-0 rounded-lg shadow-2xl" style={{ background: shade }} />
        <motion.div
          className="absolute inset-x-[6%] top-[6%] bottom-[6%] rounded-md bg-[#fffaf0] text-[#2b2118] flex items-center justify-center px-4 shadow"
          animate={open ? { y: '-62%' } : { y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ zIndex: 1 }}
        >
          <Words p={{ ...p, greeting: '' }} titleClass="text-3xl! md:text-4xl!" />
        </motion.div>
        <div className="absolute inset-0 rounded-lg" style={{ zIndex: 2, background: paper, clipPath: 'polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)' }} />
        <div className="absolute inset-0" style={{ zIndex: 2, background: `linear-gradient(160deg, transparent 40%, ${shade}55)`, clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} />
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top"
          style={{ background: shade, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }}
          initial={{ rotateX: 0, zIndex: 4 }}
          animate={open ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
          transition={{ duration: 0.6, zIndex: { delay: 0.3 } }}
        />
        <motion.div
          className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ zIndex: 5, background: `radial-gradient(circle at 35% 35%, ${mix(p.colors.a, '#fff', 70)}, ${p.colors.a} 60%, ${mix(p.colors.a, '#000', 70)})` }}
          animate={open ? { scale: 0, opacity: 0 } : { scale: [1, 1.06, 1] }}
          transition={open ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
        >
          <p.Icon size={24} strokeWidth={1.6} />
        </motion.div>
      </div>
    </Shell>
  );
}

/** Two panels that part: doors (swing), arch (slide), curtain (draw back) or key (unlock, then swing). */
function Split(p: OpeningProps) {
  const variant = p.kind === 'curtain' ? 'curtain' : p.kind === 'arch' ? 'arch' : p.kind === 'key' ? 'key' : 'doors';
  const [stage, start] = useSequence(p.onOpen, variant === 'key' ? 2100 : 1500);
  const open = stage === 'opening';
  const delay = variant === 'key' ? 0.8 : 0.15;
  const wood = `linear-gradient(90deg, ${mix(p.colors.c, '#000', 75)}, ${mix(p.colors.c, '#000', 90)} 50%, ${mix(p.colors.c, '#000', 75)})`;
  const velvet = `repeating-linear-gradient(90deg, ${p.colors.a} 0 22px, ${mix(p.colors.a, '#000', 55)} 22px 44px)`;
  const stone = `linear-gradient(${mix(p.colors.b, '#fff8ec', 25)}, ${mix(p.colors.b, '#fff8ec', 12)})`;
  const panelBg = variant === 'curtain' ? velvet : variant === 'arch' ? stone : wood;

  const panel = (side: 'left' | 'right') => {
    const swing = variant === 'doors' || variant === 'key';
    const dir = side === 'left' ? -1 : 1;
    return (
      <motion.div
        className={`absolute top-0 bottom-0 w-1/2 ${side === 'left' ? 'left-0 origin-left' : 'right-0 origin-right'} overflow-hidden`}
        style={{ background: panelBg, boxShadow: side === 'left' ? 'inset -12px 0 30px rgba(0,0,0,.35)' : 'inset 12px 0 30px rgba(0,0,0,.35)' }}
        animate={open ? (swing ? { rotateY: dir * 105, opacity: 0.6 } : { x: `${dir * 105}%`, scaleX: variant === 'curtain' ? 0.85 : 1 }) : {}}
        transition={{ delay, duration: variant === 'curtain' ? 1.1 : 1, ease: [0.65, 0, 0.35, 1] }}
      >
        {variant !== 'curtain' && (
          <div className="absolute inset-[6%] border-2 opacity-90" style={{ borderColor: p.colors.a, borderRadius: variant === 'arch' ? (side === 'left' ? '100% 0 0 0' : '0 100% 0 0') : 8 }}>
            <div className="absolute inset-3 opacity-20" style={motifTile(p.motif, p.colors.a, p.colors.b, 34)} />
          </div>
        )}
        {variant !== 'curtain' && (
          <span className={`absolute top-1/2 ${side === 'left' ? 'right-4' : 'left-4'} w-4 h-4 rounded-full shadow`} style={{ background: p.colors.a }} />
        )}
      </motion.div>
    );
  };

  return (
    <Shell stage={stage} onTap={start} hint={variant === 'key' ? 'Tap to unlock' : variant === 'curtain' ? 'Tap to raise the curtain' : 'Tap to open'} hintClass={variant === 'arch' ? 'text-black/60' : 'text-white/80'}>
      <div className="absolute inset-0" style={{ perspective: 1600 }}>
        {panel('left')}
        {panel('right')}
        {p.variant === 'gopuram' && (
          <motion.div className="absolute inset-x-0 top-0 h-[24vh] z-10 flex justify-center" animate={open ? { y: '-120%', opacity: 0 } : {}} transition={{ delay: 0.1, duration: 0.8 }}>
          <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMax meet" className="w-[min(92vw,520px)] h-full">
            {[0, 1, 2, 3, 4].map(i => (
              <rect key={i} x={30 + i * 14} y={100 - i * 20} width={140 - i * 28} height="20" fill={i % 2 ? p.colors.b : p.colors.a} stroke={mix(p.colors.c, '#000', 60)} strokeWidth="1.5" />
            ))}
            <path d="M88 0 h24 l-4 20 h-16 z" fill={p.colors.b} />
            {[0, 1, 2, 3, 4].map(i => <circle key={i} cx={100} cy={110 - i * 20} r="3" fill="#fff8e1" />)}
          </svg>
          </motion.div>
        )}
        {variant === 'curtain' && (
          <motion.div className="absolute top-0 left-0 right-0 h-16 md:h-20 shadow-xl" style={{ ...motifTile(p.motif, p.colors.b, '#fff', 30), backgroundColor: mix(p.colors.a, '#000', 40) }}
            animate={open ? { y: '-110%' } : {}} transition={{ delay: 0.9, duration: 0.5 }} />
        )}
      </div>
      <motion.div
        className={`relative z-10 mx-6 px-8 py-10 md:px-12 md:py-12 rounded-[2rem] text-center shadow-2xl ${variant === 'arch' ? 'text-[#2b1a10]' : 'text-white'}`}
        style={{ background: variant === 'arch' ? 'rgba(255,250,240,.9)' : 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)', border: `1px solid ${p.colors.a}` }}
        animate={open ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
        transition={{ duration: 0.4, delay: variant === 'key' ? 0.5 : 0 }}
      >
        {variant === 'key' && (
          <motion.div className="mx-auto mb-4 w-24" animate={open ? { rotate: [0, 0, 90] } : { x: [0, 4, 0] }} transition={open ? { duration: 0.6, times: [0, 0.3, 1] } : { duration: 1.6, repeat: Infinity }}>
          <svg viewBox="0 0 64 24" className="w-full">
            <circle cx="12" cy="12" r="9" fill="none" stroke={p.colors.a} strokeWidth="3" />
            <path d="M21 12 H60 M50 12 V19 M56 12 V17" stroke={p.colors.a} strokeWidth="3" strokeLinecap="round" />
          </svg>
          </motion.div>
        )}
        <Words p={p} />
      </motion.div>
    </Shell>
  );
}

/** Falling petals / leaves / confetti, rising balloons or twinkling stars around a title card. */
function Particles(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1300);
  const open = stage === 'opening';
  const kind = p.kind;
  const night = kind === 'stars';
  const v = p.variant;
  const palette = v === 'roses' ? ['#be123c', '#e11d48', '#9f1239', '#fb7185']
    : v === 'marigold' ? ['#f59e0b', '#ea580c', '#facc15', '#f97316']
      : v === 'gold' ? ['#d4af37', '#f5d76e', '#b8860b', '#fff1b8']
        : v === 'paint' ? ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7']
          : [p.colors.a, p.colors.b, kind === 'leaves' ? '#4d7c0f' : '#fde68a', mix(p.colors.a, '#fff', 50)];
  const bg = night
    ? `radial-gradient(ellipse at 50% 30%, ${mix(p.colors.c, '#000', 55)}, #05060f 75%)`
    : `linear-gradient(160deg, ${mix(p.colors.b, '#fff', 25)}, ${mix(p.colors.a, '#fff', 30)} 55%, ${mix(p.colors.c, '#fff', 35)})`;
  const N = kind === 'balloons' ? 14 : 26;

  const shape = (i: number) => {
    const color = palette[i % palette.length];
    const s = 10 + rand(i + 3) * 18;
    switch (kind) {
      case 'balloons':
        return (
          <div className="relative" style={{ width: s * 2.4, height: s * 3 }}>
            <div className="absolute inset-0 rounded-[50%] shadow-inner" style={{ background: `radial-gradient(circle at 35% 30%, ${mix(color, '#fff', 55)}, ${color} 60%)` }} />
            <div className="absolute left-1/2 top-full w-px h-16 bg-black/25" />
          </div>
        );
      case 'leaves':
        return <svg viewBox="0 0 24 24" width={s * 1.6} height={s * 1.6}><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" fill={color} /></svg>;
      case 'confetti':
        if (v === 'hearts') return <svg viewBox="0 0 24 24" width={s} height={s}><path d="M12 21C5 15.5 2 12.5 2 8.8A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 10 2.2C22 12.5 19 15.5 12 21z" fill={color} /></svg>;
        if (v === 'marigold') return <div className="rounded-full" style={{ width: s * 0.8, height: s * 0.8, background: `radial-gradient(circle, ${mix(color, '#fff', 40)} 20%, ${color} 70%)` }} />;
        if (v === 'paint') return <div style={{ width: s * 1.4, height: s, background: color, borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', opacity: 0.85 }} />;
        if (v === 'gold') return <div className="rounded-full" style={{ width: s / 2.5, height: s / 2.5, background: color, boxShadow: `0 0 8px ${color}` }} />;
        return <div style={{ width: s * 0.7, height: s * 0.35, background: color, borderRadius: 2 }} />;
      case 'stars':
        return <div className="rounded-full" style={{ width: s / 3, height: s / 3, background: '#fff', boxShadow: `0 0 ${s}px ${mix(p.colors.b, '#fff', 40)}` }} />;
      default:
        if (v === 'marigold') return <div className="rounded-full" style={{ width: s * 0.8, height: s * 0.8, background: `radial-gradient(circle, ${mix(color, '#fff', 40)} 20%, ${color} 70%)` }} />;
        return <div style={{ width: s, height: s * 1.3, background: color, borderRadius: '80% 0 80% 0', opacity: 0.9 }} />;
    }
  };

  return (
    <Shell stage={stage} onTap={start} style={{ background: bg }} hintClass={night ? 'text-white/70' : 'text-black/55'}
      hint={kind === 'balloons' ? 'Tap to pop the balloons' : kind === 'confetti' ? 'Tap to celebrate' : 'Tap to open'}>
      <div className="absolute inset-0 opacity-[0.10]" style={motifTile(p.motif, p.colors.a, p.colors.b, 44)} />
      {Array.from({ length: N }, (_, i) => {
        const x = rand(i) * 100;
        const dur = (kind === 'confetti' ? 4 : kind === 'balloons' ? 9 : 8) + rand(i + 9) * 5;
        const delay = -rand(i + 5) * dur;
        if (kind === 'stars') {
          return (
            <motion.div key={i} className="absolute" style={{ left: `${x}%`, top: `${rand(i + 20) * 100}%` }}
              animate={open ? { scale: 3, opacity: 0, x: (x - 50) * 8, y: (rand(i + 20) * 100 - 50) * 8 } : { opacity: [0.2, 1, 0.2] }}
              transition={open ? { duration: 0.9 } : { duration: 2 + rand(i) * 3, repeat: Infinity, delay: rand(i + 1) * 2 }}>
              {shape(i)}
            </motion.div>
          );
        }
        const rising = kind === 'balloons';
        return (
          <motion.div key={i} className="absolute top-0" style={{ left: `${x}%` }}
            initial={{ y: rising ? '110vh' : '-15vh' }}
            animate={open && rising ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : { y: rising ? '-30vh' : '115vh', x: [0, 30, -20, 0], rotate: rising ? [0, 6, -6, 0] : 360 }}
            transition={open && rising ? { duration: 0.35, delay: rand(i) * 0.4 } : { duration: dur, delay, repeat: Infinity, ease: 'linear' }}>
            {shape(i)}
          </motion.div>
        );
      })}
      <motion.div
        className={`relative z-10 mx-6 px-8 py-10 md:px-14 md:py-14 rounded-[2rem] shadow-2xl ${night ? 'bg-white/10 text-white border border-white/20' : 'bg-white/75 text-[#1f1a17] border border-white'}`}
        style={{ backdropFilter: 'blur(10px)' }}
        animate={open ? { scale: 1.15, opacity: 0 } : { y: [0, -6, 0] }}
        transition={open ? { duration: 0.6, delay: 0.5 } : { duration: 3, repeat: Infinity }}
      >
        <p.Icon size={30} strokeWidth={1.5} className="mx-auto mb-4" />
        <Words p={p} />
      </motion.div>
    </Shell>
  );
}

/** A folded letter whose flaps open. */
function Letter(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1700);
  const open = stage === 'opening';
  const paper = '#fffaf2';
  return (
    <Shell stage={stage} onTap={start} hintClass="text-black/55" hint="Tap to unfold"
      style={{ background: `linear-gradient(150deg, ${mix(p.colors.b, '#fff', 35)}, ${mix(p.colors.a, '#fff', 25)})` }}>
      <div className="absolute inset-0 opacity-[0.12]" style={motifTile(p.motif, p.colors.a, p.colors.b, 40)} />
      <div className="relative" style={{ width: 'min(84vw, 400px)', aspectRatio: '4 / 5', perspective: 1400 }}>
        <div className="absolute inset-0 rounded-sm shadow-2xl flex items-center justify-center px-6 text-[#2b2118]" style={{ background: paper, border: `1px solid ${p.colors.a}55` }}>
          <div className="absolute inset-3 border" style={{ borderColor: `${p.colors.a}66` }} />
          <motion.div animate={open ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.6 }}><Words p={p} /></motion.div>
        </div>
        {(['top', 'bottom'] as const).map(side => (
          <motion.div key={side}
            className={`absolute inset-x-0 h-1/2 ${side === 'top' ? 'top-0 origin-top' : 'bottom-0 origin-bottom'} flex items-center justify-center`}
            style={{ background: `linear-gradient(${side === 'top' ? '180deg' : '0deg'}, ${paper}, #efe4d2)`, borderBottom: side === 'top' ? '1px solid #e2d4bd' : undefined, borderTop: side === 'bottom' ? '1px solid #e2d4bd' : undefined, backfaceVisibility: 'hidden' }}
            animate={open ? { rotateX: side === 'top' ? -178 : 178 } : {}}
            transition={{ duration: 0.8, delay: side === 'top' ? 0 : 0.15, ease: [0.65, 0, 0.35, 1] }}>
            {side === 'top' && (
              <span className={`text-3xl ${p.titleFont}`} style={{ color: p.colors.a }}>{p.eyebrow}</span>
            )}
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

/** A rolled scroll that unrolls. */
function Scroll(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1900);
  const open = stage === 'opening';
  const rod = (
    <div className="relative h-5 md:h-6 w-[min(88vw,460px)] rounded-full shadow-lg" style={{ background: `linear-gradient(${mix(p.colors.c, '#fff', 30)}, ${mix(p.colors.c, '#000', 50)})` }}>
      <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-8 rounded-full" style={{ background: p.colors.a }} />
      <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-8 rounded-full" style={{ background: p.colors.a }} />
    </div>
  );
  return (
    <Shell stage={stage} onTap={start} hint="Tap to unroll" style={{ background: `radial-gradient(circle at 50% 45%, ${mix(p.colors.c, '#000', 50)}, #0b0805 80%)` }}>
      <div className="absolute inset-0 opacity-[0.08]" style={motifTile(p.motif, p.colors.a, p.colors.b, 48)} />
      <div className="relative flex flex-col items-center">
        {rod}
        <motion.div className="w-[min(82vw,420px)] overflow-hidden flex items-center justify-center text-[#3b2410] px-6"
          style={{ background: `linear-gradient(90deg, #e9d8b4, #fbf1dc 15%, #fbf1dc 85%, #e9d8b4)` }}
          initial={{ height: 10 }} animate={{ height: open ? '58vh' : 10 }} transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}>
          <motion.div animate={{ opacity: open ? 1 : 0 }} transition={{ delay: 0.7 }}><Words p={p} /></motion.div>
        </motion.div>
        {rod}
        {!open && <span className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg" style={{ background: p.colors.a }} />}
      </div>
    </Shell>
  );
}

/** A wrapped gift box whose lid pops off with confetti. */
function Gift(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1700);
  const open = stage === 'opening';
  const tap = () => { if (stage === 'idle') triggerConfettiPopper(); start(); };
  return (
    <Shell stage={stage} onTap={tap} hint="Tap to unwrap" hintClass="text-black/55"
      style={{ background: `linear-gradient(160deg, ${mix(p.colors.b, '#fff', 30)}, ${mix(p.colors.a, '#fff', 35)})` }}>
      <div className="absolute inset-0 opacity-[0.15]" style={motifTile(p.motif, p.colors.a, p.colors.b, 40)} />
      <div className="relative flex flex-col items-center">
        <motion.div className="mb-6 text-[#1f1a17]" initial={{ opacity: 0, scale: 0.6, y: 40 }} animate={open ? { opacity: 1, scale: 1, y: -10 } : {}} transition={{ delay: 0.35, type: 'spring' }}>
          <Words p={{ ...p, greeting: '' }} />
        </motion.div>
        <motion.div className="relative" style={{ width: 'min(55vw, 230px)', height: 'min(45vw, 190px)' }}
          animate={open ? {} : { rotate: [0, -3, 3, -2, 0] }} transition={{ duration: 1.2, repeat: open ? 0 : Infinity, repeatDelay: 1 }}>
          <motion.div className="absolute -top-[22%] -left-[6%] -right-[6%] h-[28%] rounded-md shadow-lg z-10" style={{ background: mix(p.colors.a, '#000', 85) }}
            animate={open ? { y: '-55vh', rotate: -30, opacity: 0 } : {}} transition={{ duration: 0.9, ease: 'easeOut' }}>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[16%]" style={{ background: p.colors.b }} />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex">
              <span className="w-10 h-8 rounded-full border-[6px] -rotate-12" style={{ borderColor: p.colors.b }} />
              <span className="w-10 h-8 rounded-full border-[6px] rotate-12" style={{ borderColor: p.colors.b }} />
            </div>
          </motion.div>
          <div className="absolute inset-0 rounded-md shadow-2xl" style={{ background: p.colors.a }}>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[16%]" style={{ background: p.colors.b }} />
          </div>
        </motion.div>
      </div>
    </Shell>
  );
}

/** Light-based openings: an oil lamp, a sunrise, holy rays, a string of bulbs, or a neon sign. */
function Glow(p: OpeningProps) {
  const kind = p.kind;
  const [stage, start] = useSequence(p.onOpen, kind === 'neon' ? 1000 : 1500);
  const open = stage === 'opening';
  // Flames and bulbs glow warm amber whatever the palette; other lights take its colour
  const warm = kind === 'lamp' || kind === 'lights' ? '#ffb347' : mix(p.colors.b, '#ffb347', 50);

  if (kind === 'sunrise') {
    return (
      <Shell stage={stage} onTap={start} hint="Tap to begin">
        <motion.div className="absolute inset-0" initial={{ background: `linear-gradient(#0b1026, ${mix(p.colors.c, '#0b1026', 40)})` }}
          animate={{ background: open ? `linear-gradient(${mix(p.colors.b, '#fff', 40)}, ${p.colors.a})` : `linear-gradient(#0b1026, ${mix(p.colors.c, '#0b1026', 40)})` }} transition={{ duration: 1.2 }} />
        <motion.div className="absolute left-1/2 w-56 h-56 md:w-72 md:h-72 -translate-x-1/2 rounded-full" style={{ background: `radial-gradient(circle, #fff7d6, ${warm} 60%, transparent 72%)` }}
          initial={{ top: '62%' }} animate={{ top: open ? '18%' : '62%' }} transition={{ duration: 1.3, ease: 'easeOut' }} />
        <div className="absolute left-0 right-0 top-[70%] bottom-0" style={{ background: mix(p.colors.c, '#000', 75) }} />
        <div className="absolute left-0 right-0 top-[70%] h-7" style={{ ...motifTile(p.motif, p.colors.a, p.colors.b, 26) }} />
        <motion.div className="relative z-10 text-white mt-[-18vh]" animate={open ? { opacity: 0 } : {}} transition={{ delay: 0.6 }}><Words p={p} /></motion.div>
      </Shell>
    );
  }

  if (kind === 'lights') {
    const bulbs = 11;
    return (
      <Shell stage={stage} onTap={start} hint="Tap to step inside" style={{ background: `radial-gradient(circle at 50% 60%, ${mix(p.colors.c, '#000', 70)}, #0c0806 80%)` }}>
        <svg className="absolute top-6 left-0 w-full h-40" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M-2 4 Q50 30 102 4" stroke={p.variant === 'marigold' ? '#ca8a04' : '#3b3029'} strokeWidth=".5" fill="none" /></svg>
        {Array.from({ length: bulbs }, (_, i) => {
          const t = (i + 0.5) / bulbs, x = t * 100, y = 4 + 26 * 4 * t * (1 - t) * 0.5;
          return (
            p.variant === 'marigold' ? (
              <motion.div key={i} className="absolute flex flex-col items-center" style={{ left: `${x}%`, top: `calc(1.5rem + ${y * 4.4}px)` }}
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, rotate: [0, 3, -3, 0] }} transition={{ delay: 0.2 + i * 0.08, rotate: { duration: 3, repeat: Infinity } }}>
                {[0, 1, 2, 3].map(k => <span key={k} className="w-5 h-5 -mt-1 rounded-full" style={{ background: `radial-gradient(circle, #fde68a 20%, ${k % 2 ? '#ea580c' : '#f59e0b'} 70%)` }} />)}
                <svg viewBox="0 0 24 24" className="w-6 h-6 -mt-1"><path d="M12 2C6 8 6 16 12 22 18 16 18 8 12 2z" fill="#15803d" /></svg>
              </motion.div>
            ) : p.variant === 'lanterns' ? (
              <motion.div key={i} className="absolute flex flex-col items-center" style={{ left: `${x}%`, top: `calc(1.5rem + ${y * 4.4}px)` }}
                animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 3 + (i % 3), repeat: Infinity }}>
                <span className="w-px h-6 bg-[#8a6a3a]" />
                <span className="w-3 h-2 rounded-t-full" style={{ background: p.colors.b }} />
                <motion.span className="w-6 h-9 rounded-md border-2" style={{ borderColor: p.colors.b }}
                  initial={{ background: 'rgba(0,0,0,.3)' }} animate={{ background: warm, boxShadow: `0 0 26px 8px ${warm}` }} transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }} />
              </motion.div>
            ) : (
              <motion.span key={i} className="absolute w-4 h-6 rounded-full" style={{ left: `${x}%`, top: `calc(1.5rem + ${y * 4.4}px)`, background: i % 2 ? p.colors.b : warm }}
                initial={{ opacity: 0.2, boxShadow: '0 0 0 transparent' }}
                animate={{ opacity: 1, boxShadow: `0 0 24px 6px ${i % 2 ? p.colors.b : warm}` }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }} />
            )
          );
        })}
        <motion.div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${warm}, transparent 70%)` }} initial={{ opacity: 0, scale: 0.2 }} animate={open ? { opacity: 0.9, scale: 2.5 } : {}} transition={{ duration: 1.2 }} />
        <div className="relative z-10 text-[#fff4e0]"><Words p={p} /></div>
      </Shell>
    );
  }

  if (kind === 'neon') {
    const neon = (c: string) => `0 0 6px ${c}, 0 0 18px ${c}, 0 0 42px ${c}`;
    return (
      <Shell stage={stage} onTap={start} hint="Tap to start the party" style={{ background: '#0a0612', backgroundImage: 'linear-gradient(#1a1024 2px, transparent 2px), linear-gradient(90deg, #1a1024 2px, transparent 2px)', backgroundSize: '64px 32px' }}>
        <motion.div className="relative z-10 text-center px-6" animate={open ? { scale: 1.2, opacity: 0 } : {}} transition={{ duration: 0.8 }}>
          <motion.p className="text-xs md:text-sm uppercase tracking-[0.5em]" style={{ color: '#fff', textShadow: neon(p.colors.b) }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.3, 1] }} transition={{ duration: 1.2, times: [0, 0.3, 0.45, 1] }}>{p.eyebrow}</motion.p>
          <motion.h2 className={`mt-4 text-5xl md:text-7xl ${p.titleFont}`} style={{ color: '#fff', textShadow: neon(p.colors.a) }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.2, 1, 0.6, 1] }} transition={{ duration: 1.6, delay: 0.4 }}>{p.title}</motion.h2>
          {p.date && <p className="mt-6 text-sm tracking-[0.3em] uppercase" style={{ color: '#fff', textShadow: neon(p.colors.b) }}>{p.date}</p>}
        </motion.div>
        <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={open ? { opacity: [0, 0.8, 0] } : {}} transition={{ duration: 0.6 }} />
      </Shell>
    );
  }

  if (kind === 'rays') {
    return (
      <Shell stage={stage} onTap={start} hint="Tap to enter" style={{ background: `radial-gradient(circle, ${mix(p.colors.c, '#000', 30)}, ${mix(p.colors.c, '#000', 80)})` }}>
        <motion.div className="absolute w-[220vmax] h-[220vmax]" style={{ background: p.variant === 'stained'
          ? 'repeating-conic-gradient(#dc262655 0 8deg, #2563eb55 8deg 16deg, #eab30855 16deg 24deg, #16a34a55 24deg 32deg, transparent 32deg 36deg)'
          : `repeating-conic-gradient(${p.colors.b}33 0 6deg, transparent 6deg 18deg)` }}
          animate={open ? { rotate: 120, scale: 1.8, opacity: 0 } : { rotate: 360 }} transition={open ? { duration: 1.2 } : { duration: 60, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={open ? { opacity: [0, 0.9, 0] } : {}} transition={{ duration: 1.3 }} />
        <div className="relative z-10 text-white">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${p.colors.b}33`, boxShadow: `0 0 60px ${p.colors.b}` }}><p.Icon size={34} strokeWidth={1.4} /></div>
          <Words p={p} />
        </div>
      </Shell>
    );
  }

  // lamp: a lit diya / candle whose glow fills the screen
  return (
    <Shell stage={stage} onTap={start} hint="Tap to light the lamp" style={{ background: '#0b0603' }}>
      <div className="absolute inset-0 opacity-[0.06]" style={motifTile(p.motif, p.colors.a, p.colors.b, 48)} />
      <motion.div className="absolute rounded-full" style={{ width: 120, height: 120, background: `radial-gradient(circle, ${warm}, transparent 70%)` }}
        animate={open ? { scale: 30, opacity: [0.9, 1] } : { scale: [1, 1.15, 1], opacity: 0.7 }} transition={open ? { duration: 1.3, ease: 'easeIn' } : { duration: 1.6, repeat: Infinity }} />
      <div className="relative z-10 flex flex-col items-center text-[#ffe9c2]">
        <Words p={{ ...p, date: '' }} className="mb-10" />
        <svg viewBox="0 0 120 90" className="w-40">
          <motion.path d="M60 6 C70 22 70 34 60 42 C50 34 50 22 60 6 Z" fill="url(#flame)" animate={{ scaleY: [1, 1.12, 0.95, 1] }} style={{ originX: '60px', originY: '42px' }} transition={{ duration: 0.8, repeat: Infinity }} />
          <defs><radialGradient id="flame" cx="50%" cy="70%"><stop offset="0%" stopColor="#fff7c2" /><stop offset="60%" stopColor="#ffb020" /><stop offset="100%" stopColor="#e2541b" /></radialGradient></defs>
          <path d="M10 46 H110 C104 70 84 82 60 82 C36 82 16 70 10 46 Z" fill={p.colors.a} />
          <path d="M10 46 H110" stroke={mix(p.colors.a, '#fff', 50)} strokeWidth="3" />
        </svg>
      </div>
    </Shell>
  );
}

/** Tech fest: terminal boot lines, a glitching title, then a CRT switch-off. */
function Glitch(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1000);
  const open = stage === 'opening';
  const lines = ['> booting fest_os v26.0', '> loading events ........ ok', '> verifying guest pass ... ok', '> ACCESS GRANTED'];
  return (
    <Shell stage={stage} onTap={start} hint="Press to enter" hintClass="text-[#7dfcff]/70" style={{ background: '#04060c' }}>
      <motion.div className="absolute inset-0 flex items-center justify-center" animate={open ? { scaleY: [1, 0.005, 0.005], scaleX: [1, 1, 0], opacity: [1, 1, 0] } : {}} transition={{ duration: 0.8, times: [0, 0.5, 1] }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)' }} />
        <div className="absolute inset-0 opacity-20" style={motifTile(p.motif, p.colors.a, p.colors.b, 48)} />
        <div className="relative z-10 w-[min(90vw,640px)] font-mono text-[#7dfcff]">
          {lines.map((l, i) => (
            <motion.p key={i} className="text-xs md:text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.45 }}>{l}</motion.p>
          ))}
          <div className="relative mt-8 text-center">
            {[p.colors.a, p.colors.b].map((c, i) => (
              <motion.h2 key={i} aria-hidden className={`absolute inset-0 text-4xl md:text-6xl ${p.titleFont}`} style={{ color: c, mixBlendMode: 'screen' }}
                animate={{ x: i ? [0, 3, -2, 0] : [0, -3, 2, 0], y: [0, 1, -1, 0] }} transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 1.2 }}>{p.title}</motion.h2>
            ))}
            <h2 className={`relative text-4xl md:text-6xl text-white ${p.titleFont}`}>{p.title}</h2>
            <p className="mt-4 text-[11px] uppercase tracking-[0.4em] text-white/70">{p.eyebrow}{p.date ? ` // ${p.date}` : ''}</p>
          </div>
        </div>
      </motion.div>
    </Shell>
  );
}

/** An entry ticket whose stub tears off. */
function Ticket(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1500);
  const open = stage === 'opening';
  return (
    <Shell stage={stage} onTap={start} hint="Tap to tear the ticket" style={{ background: `linear-gradient(135deg, ${p.colors.a}, ${mix(p.colors.c, '#000', 30)})` }}>
      <div className="absolute inset-0 opacity-20" style={motifTile(p.motif, '#ffffff', p.colors.b, 44)} />
      <div className="relative flex" style={{ width: 'min(92vw, 560px)' }}>
        <motion.div className="relative flex-1 bg-white text-[#111] rounded-l-2xl p-6 md:p-8 shadow-2xl" animate={open ? { y: '-120vh', rotate: -6 } : {}} transition={{ delay: 0.45, duration: 0.8, ease: 'easeIn' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: p.colors.a }}>{p.eyebrow}</p>
          <h2 className={`mt-3 text-3xl md:text-5xl leading-none ${p.titleFont}`}>{p.title}</h2>
          {p.date && <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-black/60">{p.date}</p>}
        </motion.div>
        <motion.div className="relative w-[30%] bg-white rounded-r-2xl border-l-4 border-dashed border-black/15 flex flex-col items-center justify-between py-6 shadow-2xl"
          style={{ transformOrigin: 'top left' }} animate={open ? { rotate: 28, y: '70vh', x: 40, opacity: 0.8 } : {}} transition={{ duration: 0.8, ease: 'easeIn' }}>
          <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full" style={{ background: mix(p.colors.a, p.colors.c, 60) }} />
          <span className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full" style={{ background: mix(p.colors.a, p.colors.c, 60) }} />
          <span className={`text-sm md:text-base [writing-mode:vertical-rl] rotate-180 ${p.titleFont}`}>ADMIT ONE</span>
          <div className="w-12 h-10" style={{ background: 'repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 7px,transparent 7px 9px)' }} />
        </motion.div>
      </div>
    </Shell>
  );
}

/** Sports: READY? then 3-2-1-GO. */
function Countdown(p: OpeningProps) {
  const steps = ['3', '2', '1', 'GO!'];
  const [stage, start] = useSequence(p.onOpen, steps.length * 450 + 250);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (stage !== 'opening') return;
    const ids = steps.map((_, i) => window.setTimeout(() => setStep(i), i * 450));
    return () => ids.forEach(window.clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);
  return (
    <Shell stage={stage} onTap={start} hint="Tap to kick off" style={{ background: `radial-gradient(circle, ${mix(p.colors.c, '#000', 40)}, #05070d 80%)` }}>
      <div className="absolute inset-0 opacity-25" style={motifTile(p.motif, p.colors.a, p.colors.b, 40)} />
      <div className="relative z-10 text-white text-center">
        <AnimatePresence mode="wait">
          {step < 0 ? (
            <motion.div key="ready" exit={{ scale: 0.5, opacity: 0 }}>
              <motion.p className={`text-6xl md:text-8xl ${p.titleFont}`} style={{ color: p.colors.b }} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1, repeat: Infinity }}>READY?</motion.p>
              <Words p={{ ...p, greeting: '' }} className="mt-6" titleClass="text-3xl! md:text-5xl!" />
            </motion.div>
          ) : (
            <motion.p key={step} className={`text-[28vw] md:text-[14rem] leading-none ${p.titleFont}`} style={{ color: step === steps.length - 1 ? p.colors.b : '#fff', textShadow: `0 0 40px ${p.colors.a}` }}
              initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.25 }}>
              {steps[step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
}

/** Housewarming blueprint: the house outline draws itself, then fills in. */
function Blueprint(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1300);
  const open = stage === 'opening';
  const line = { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 2, ease: 'easeInOut' as const } };
  return (
    <Shell stage={stage} onTap={start} hint="Tap to move in" style={{ background: '#0d3b8c', backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      <motion.div className="relative z-10 flex flex-col items-center text-white" animate={open ? { scale: 1.4, opacity: 0 } : {}} transition={{ delay: 0.5, duration: 0.7 }}>
        <svg viewBox="0 0 200 160" className="w-56 md:w-72" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
          <motion.path d="M20 80 L100 16 L180 80" {...line} />
          <motion.path d="M40 66 V150 H160 V66" {...line} />
          <motion.path d="M86 150 V110 H114 V150" {...line} />
          <motion.path d="M56 90 H80 V112 H56 Z M120 90 H144 V112 H120 Z" {...line} />
          <motion.path d="M40 156 H160 M40 152 V160 M160 152 V160" strokeWidth="1" {...line} />
          <motion.path d="M40 66 V150 H160 V66 L100 18 Z" fill={p.colors.a} stroke="none" initial={{ opacity: 0 }} animate={{ opacity: open ? 0.85 : 0 }} transition={{ duration: 0.4 }} />
        </svg>
        <Words p={{ ...p, greeting: '' }} className="mt-6" />
      </motion.div>
    </Shell>
  );
}

/** Posters pinned to a wall that fly away. */
function Poster(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1300);
  const open = stage === 'opening';
  const cards = [
    { r: -8, x: '-28%', y: '-6%', bg: p.colors.a, fg: '#fff', away: { x: '-120vw', rotate: -40 } },
    { r: 7, x: '26%', y: '8%', bg: p.colors.b, fg: '#111', away: { x: '120vw', rotate: 40 } },
    { r: -2, x: '0%', y: '0%', bg: '#fffdf7', fg: '#111', away: { y: '-120vh', rotate: -10 } },
  ];
  return (
    <Shell stage={stage} onTap={start} hint="Tap to tear down the posters" hintClass="text-black/55" style={{ background: '#e7e2d8' }}>
      <div className="absolute inset-0 opacity-25" style={motifTile(p.motif, p.colors.a, p.colors.b, 56)} />
      {cards.map((c, i) => (
        <motion.div key={i} className="absolute w-[min(68vw,330px)] aspect-[3/4] shadow-2xl p-6 flex flex-col justify-between" style={{ background: c.bg, color: c.fg, left: '50%', top: '50%', marginLeft: 'calc(min(68vw,330px) / -2)', marginTop: 'calc(min(68vw,330px) * -0.666)' }}
          initial={{ rotate: c.r, x: c.x, y: c.y }} animate={open ? { ...c.away, opacity: 0 } : { rotate: c.r, x: c.x, y: c.y }} transition={{ delay: (2 - i) * 0.12, duration: 0.7, ease: 'easeIn' }}>
          <span className="mx-auto w-4 h-4 rounded-full bg-red-500 shadow -mt-3" />
          {i === 2 ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: p.colors.a }}>{p.eyebrow}</p>
              <h2 className={`text-4xl md:text-5xl leading-[0.95] ${p.titleFont}`}>{p.title}</h2>
              <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-60">{p.date}</p>
            </>
          ) : (
            <p className={`text-5xl leading-none opacity-90 ${p.titleFont}`}>{i ? 'LIVE' : 'FEST'}</p>
          )}
        </motion.div>
      ))}
    </Shell>
  );
}

/** Engagement: a velvet ring box whose lid opens and the ring rises. */
function RingBox(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 2000);
  const open = stage === 'opening';
  const velvet = mix(p.colors.a, '#000', 55);
  return (
    <Shell stage={stage} onTap={start} hint="Tap to open the box" style={{ background: `radial-gradient(circle at 50% 45%, ${mix(p.colors.c, '#000', 40)}, #07060a 75%)` }}>
      <div className="absolute inset-0 opacity-[0.07]" style={motifTile(p.motif, p.colors.a, p.colors.b, 48)} />
      <div className="relative flex flex-col items-center">
        <motion.div className="mb-16 text-white" initial={{ opacity: 0 }} animate={{ opacity: open ? 1 : 0.85 }} transition={{ delay: open ? 0.9 : 0 }}>
          <Words p={{ ...p, greeting: '' }} titleClass="text-3xl! md:text-5xl!" />
        </motion.div>
        <div className="relative w-44 h-32" style={{ perspective: 800 }}>
          <motion.div className="absolute left-0 right-0 top-0 z-10 flex justify-center" initial={{ y: 30, opacity: 0 }}
            animate={open ? { y: -46, opacity: 1 } : {}} transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}>
          <svg viewBox="0 0 60 60" className="w-16 overflow-visible">
            <circle cx="30" cy="38" r="16" fill="none" stroke="#e8c770" strokeWidth="4" />
            <path d="M22 18 L30 8 L38 18 L30 26 Z" fill="#e6f4ff" stroke="#9cc9f0" strokeWidth="1" />
            <motion.circle cx="30" cy="16" r="16" fill="#fff" initial={{ opacity: 0 }} animate={open ? { opacity: [0, 0.6, 0], scale: [0.5, 1.6, 2] } : {}} transition={{ delay: 1.1, duration: 0.8 }} />
          </svg>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-20 rounded-xl shadow-2xl" style={{ background: `linear-gradient(${mix(velvet, '#fff', 15)}, ${velvet})` }}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full" style={{ background: mix(velvet, '#000', 50) }} />
          </div>
          <motion.div className="absolute bottom-[4.5rem] left-0 right-0 h-14 rounded-t-2xl origin-bottom shadow-xl" style={{ background: `linear-gradient(${mix(velvet, '#fff', 25)}, ${velvet})` }}
            animate={open ? { rotateX: 110 } : {}} transition={{ duration: 0.6 }}>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{ background: p.colors.b }} />
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}

/** Church: two bells swing, then ring out with light. */
function Bells(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1600);
  const open = stage === 'opening';
  const bell = (flip: boolean) => (
    <motion.div className="w-20 md:w-24" style={{ originX: 0.5, originY: 0 }}
      animate={{ rotate: open ? [0, flip ? -28 : 28, flip ? 22 : -22, 0] : [0, flip ? -8 : 8, 0] }}
      transition={open ? { duration: 0.9 } : { duration: 2.2, repeat: Infinity }}>
    <svg viewBox="0 0 60 70" className="w-full">
      <path d="M30 4 C14 4 12 22 12 36 C12 46 6 50 4 56 H56 C54 50 48 46 48 36 C48 22 46 4 30 4 Z" fill={p.colors.b} stroke={mix(p.colors.b, '#000', 60)} strokeWidth="1.5" />
      <circle cx="30" cy="62" r="6" fill={mix(p.colors.b, '#000', 40)} />
      <path d="M26 2 h8 v6 h-8 z" fill={mix(p.colors.b, '#000', 40)} />
    </svg>
    </motion.div>
  );
  return (
    <Shell stage={stage} onTap={start} hint="Tap to ring the bells" hintClass="text-black/55" style={{ background: `linear-gradient(${mix(p.colors.b, '#fff', 20)}, #fbf7ee 70%)` }}>
      <div className="absolute inset-0 opacity-[0.12]" style={motifTile(p.motif, p.colors.a, p.colors.b, 44)} />
      <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={open ? { opacity: [0, 0, 0.9] } : {}} transition={{ duration: 1.5, times: [0, 0.5, 1] }} />
      <div className="relative z-10 flex flex-col items-center text-[#2b2118]">
        <div className="flex gap-6 -mt-10 mb-8">{bell(false)}{bell(true)}</div>
        <Words p={p} />
      </div>
    </Shell>
  );
}

/** Birthday: tap to blow out the candles. */
function Cake(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1900);
  const open = stage === 'opening';
  const tap = () => { if (stage === 'idle') window.setTimeout(() => triggerConfettiPopper(), 500); start(); };
  const candles = [0, 1, 2];
  return (
    <Shell stage={stage} onTap={tap} hint="Make a wish & tap to blow" hintClass="text-black/55" style={{ background: `linear-gradient(160deg, ${mix(p.colors.b, '#fff', 30)}, ${mix(p.colors.a, '#fff', 35)})` }}>
      <div className="absolute inset-0 opacity-[0.15]" style={motifTile(p.motif, p.colors.a, p.colors.b, 40)} />
      <div className="relative flex flex-col items-center text-[#1f1a17]">
        <Words p={{ ...p, greeting: '' }} className="mb-8" />
        <svg viewBox="0 0 160 150" className="w-52 md:w-64 overflow-visible">
          {candles.map(i => (
            <g key={i} transform={`translate(${52 + i * 28} 0)`}>
              <rect x="-3" y="34" width="6" height="30" rx="2" fill={i % 2 ? p.colors.b : '#fff'} stroke={p.colors.a} strokeWidth="1" />
              <motion.path d="M0 14 C5 22 5 28 0 32 C-5 28 -5 22 0 14 Z" fill="#ffb020" style={{ originX: '0px', originY: '32px' }}
                animate={open ? { scale: 0, opacity: 0 } : { scaleY: [1, 1.15, 0.9, 1] }} transition={open ? { duration: 0.25, delay: i * 0.08 } : { duration: 0.7, repeat: Infinity }} />
              <motion.circle cx="0" cy="22" r="5" fill="#cbd5e1" initial={{ opacity: 0 }} animate={open ? { opacity: [0, 0.7, 0], cy: [22, -10, -40], r: [4, 8, 12] } : {}} transition={{ delay: 0.3 + i * 0.08, duration: 1.2 }} />
            </g>
          ))}
          <rect x="20" y="64" width="120" height="34" rx="6" fill={p.colors.a} />
          <path d="M20 74 q10 10 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <rect x="10" y="96" width="140" height="40" rx="8" fill={mix(p.colors.a, '#000', 85)} />
          <path d="M10 108 q10 10 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke={p.colors.b} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="80" cy="140" rx="78" ry="8" fill="#00000018" />
        </svg>
      </div>
    </Shell>
  );
}

/** Tech fest: a rocket lifts off. */
function Rocket(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1700);
  const open = stage === 'opening';
  return (
    <Shell stage={stage} onTap={start} hint="Tap to launch" style={{ background: 'radial-gradient(ellipse at 50% 100%, #1e1b4b, #03040a 70%)' }}>
      {Array.from({ length: 40 }, (_, i) => (
        <span key={i} className="absolute rounded-full bg-white" style={{ left: `${rand(i) * 100}%`, top: `${rand(i + 40) * 100}%`, width: 2, height: 2, opacity: 0.3 + rand(i + 7) * 0.7 }} />
      ))}
      <div className="relative z-10 text-center text-white">
        <motion.div animate={open ? { opacity: 0 } : {}} transition={{ delay: 0.5 }}><Words p={{ ...p, greeting: '' }} /></motion.div>
      </div>
      <motion.div className="absolute left-0 right-0 bottom-16 z-20 flex justify-center"
        animate={open ? { y: [0, 2, -2, 0, '-120vh'] } : { y: [0, -4, 0] }} transition={open ? { duration: 1.5, times: [0, 0.1, 0.2, 0.3, 1], ease: 'easeIn' } : { duration: 2, repeat: Infinity }}>
      <svg viewBox="0 0 60 140" className="w-14 md:w-16 overflow-visible">
        <path d="M30 4 C44 20 46 50 44 86 H16 C14 50 16 20 30 4 Z" fill="#f8fafc" />
        <circle cx="30" cy="44" r="8" fill={p.colors.a} stroke="#cbd5e1" strokeWidth="3" />
        <path d="M16 70 L4 96 L16 92 Z M44 70 L56 96 L44 92 Z" fill={p.colors.b} />
        <motion.path d="M20 88 C22 110 30 136 30 136 C30 136 38 110 40 88 Z" fill="url(#thrust)" initial={{ scaleY: 0.3 }} animate={{ scaleY: open ? [0.6, 1.4, 1.2] : [0.3, 0.45, 0.3] }} style={{ originY: '88px' }} transition={{ duration: 0.3, repeat: Infinity }} />
        <defs><linearGradient id="thrust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff7c2" /><stop offset="50%" stopColor="#ffb020" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" /></linearGradient></defs>
      </svg>
      </motion.div>
    </Shell>
  );
}

/** Sports: a gleaming trophy, then a burst of gold. */
function Trophy(p: OpeningProps) {
  const [stage, start] = useSequence(p.onOpen, 1500);
  const open = stage === 'opening';
  const tap = () => { if (stage === 'idle') triggerConfettiPopper(); start(); };
  return (
    <Shell stage={stage} onTap={tap} hint="Tap to claim the glory" style={{ background: `radial-gradient(circle, ${mix(p.colors.c, '#000', 40)}, #05070d 75%)` }}>
      <motion.div className="absolute w-[220vmax] h-[220vmax]" style={{ background: 'repeating-conic-gradient(#facc1522 0 5deg, transparent 5deg 15deg)' }} animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="relative z-10 flex flex-col items-center text-white" animate={open ? { scale: 1.3, opacity: 0 } : {}} transition={{ delay: 0.6, duration: 0.6 }}>
        <div className="relative w-32 md:w-40 overflow-hidden">
          <svg viewBox="0 0 100 110" className="w-full">
            <path d="M28 8 H72 V40 C72 58 62 68 50 68 C38 68 28 58 28 40 Z" fill="#facc15" />
            <path d="M28 16 H12 C12 36 20 44 30 46 M72 16 H88 C88 36 80 44 70 46" fill="none" stroke="#facc15" strokeWidth="6" />
            <rect x="44" y="68" width="12" height="18" fill="#eab308" />
            <rect x="30" y="86" width="40" height="10" rx="2" fill="#ca8a04" />
            <rect x="24" y="96" width="52" height="10" rx="2" fill={p.colors.a} />
          </svg>
          <motion.div className="absolute inset-y-0 w-10 -skew-x-12 bg-white/60" initial={{ x: -60 }} animate={{ x: 200 }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }} />
        </div>
        <Words p={{ ...p, greeting: '' }} className="mt-6" />
      </motion.div>
    </Shell>
  );
}

export function InviteOpening(p: OpeningProps) {
  switch (p.kind) {
    case 'envelope': return <Envelope {...p} />;
    case 'doors': case 'arch': case 'curtain': case 'key': return <Split {...p} />;
    case 'petals': case 'leaves': case 'confetti': case 'balloons': case 'stars': return <Particles {...p} />;
    case 'letter': return <Letter {...p} />;
    case 'scroll': return <Scroll {...p} />;
    case 'gift': return <Gift {...p} />;
    case 'lamp': case 'sunrise': case 'rays': case 'lights': case 'neon': return <Glow {...p} />;
    case 'glitch': return <Glitch {...p} />;
    case 'ticket': return <Ticket {...p} />;
    case 'countdown': return <Countdown {...p} />;
    case 'blueprint': return <Blueprint {...p} />;
    case 'poster': return <Poster {...p} />;
    case 'ringbox': return <RingBox {...p} />;
    case 'bells': return <Bells {...p} />;
    case 'cake': return <Cake {...p} />;
    case 'rocket': return <Rocket {...p} />;
    case 'trophy': return <Trophy {...p} />;
  }
}
