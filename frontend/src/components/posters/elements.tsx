import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { POSTER_FONTS } from './fonts';
import { ICONS, SHAPES } from './library';
import { extrude } from './text';
import type { PosterElement } from './types';

const outline = (color: string, r: number, n = 20) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 ${color}`;
  }).join(',');

export type HandleMode = 'move' | 'resize' | 'rotate';

interface ViewProps {
  el: PosterElement;
  /** Poster size in px. */
  pw: number;
  ph: number;
  selected?: boolean;
  /** 1 / preview scale: keeps handles a constant size on screen. */
  ui?: number;
  onPointer?: (e: ReactPointerEvent, el: PosterElement, mode: HandleMode) => void;
}

/** One free element at its poster position. Handles show only while selected (never in exports). */
export function ElementView({ el, pw, ph, selected, ui = 1, onPointer }: ViewProps) {
  const unit = Math.min(pw, ph) / 1080;
  const width = (el.w / 100) * pw;
  const fixedHeight = el.kind !== 'text' ? width * el.aspect : undefined;
  const textStyle: CSSProperties = {
    fontFamily: POSTER_FONTS[el.font]?.css, fontSize: el.size * unit, fontWeight: el.weight, color: el.kind === 'shape' && !el.text ? undefined : el.color,
    textAlign: el.align, lineHeight: 1.15, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    textShadow: el.effect === 'outline' ? outline(el.stroke, Math.max(1.5, el.size * unit * 0.06))
      : el.effect === 'shadow' ? `0 ${4 * unit}px ${14 * unit}px ${el.stroke}`
      : el.effect === '3d' ? `${extrude(el.stroke, 7, Math.max(1, el.size * unit * 0.025))}, 0 ${el.size * unit * 0.2}px ${el.size * unit * 0.3}px rgba(0,0,0,.35)`
      : el.effect === 'glow' ? `0 0 ${el.size * unit * 0.12}px ${el.stroke}, 0 0 ${el.size * unit * 0.3}px ${el.stroke}, 0 0 ${el.size * unit * 0.6}px ${el.stroke}`
      : undefined,
  };
  /** Gradient fill goes on the text itself, so a background pill behind it stays solid. */
  const gradient: CSSProperties | undefined = el.effect === 'gradient'
    ? { backgroundImage: `linear-gradient(180deg, ${el.color}, ${el.stroke})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
    : undefined;

  let body;
  if (el.kind === 'shape') {
    body = (
      <>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <path d={SHAPES[el.shape || 'rect']} fillRule="evenodd" fill={el.color} stroke={el.effect === 'outline' ? el.stroke : undefined} strokeWidth={el.effect === 'outline' ? 3 : undefined} vectorEffect="non-scaling-stroke" />
        </svg>
        {el.text && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '12%', ...textStyle, color: el.bg || '#ffffff' }}><span style={gradient}>{el.text}</span></div>
        )}
      </>
    );
  } else if (el.kind === 'icon') {
    body = (
      <div className="w-full h-full flex items-center justify-center" style={{ background: el.bg || undefined, borderRadius: '50%' }}>
        <svg viewBox="0 0 24 24" style={{ width: el.bg ? '62%' : '100%', height: el.bg ? '62%' : '100%' }}><path d={ICONS[el.icon || 'star']} fill={el.color} /></svg>
      </div>
    );
  } else if (el.kind === 'image') {
    body = el.src ? <img src={el.src} crossOrigin="anonymous" alt="" className="w-full h-full object-cover" style={{ borderRadius: el.radius * unit, border: el.bg ? `${8 * unit}px solid ${el.bg}` : undefined }} /> : null;
  } else {
    body = (
      <div style={{ ...textStyle, background: el.bg || undefined, borderRadius: el.radius * unit, padding: el.bg ? `${0.3 * el.size * unit}px ${0.6 * el.size * unit}px` : 0, display: 'flex', alignItems: 'center', justifyContent: el.align === 'left' ? 'flex-start' : el.align === 'right' ? 'flex-end' : 'center', gap: 0.35 * el.size * unit }}>
        {el.icon && <svg viewBox="0 0 24 24" style={{ width: el.size * unit * 1.1, height: el.size * unit * 1.1, flexShrink: 0 }}><path d={ICONS[el.icon]} fill={el.color} /></svg>}
        <span style={gradient}>{el.text}</span>
      </div>
    );
  }

  const handle = 14 * ui;
  return (
    <div
      data-element={el.id}
      onPointerDown={onPointer ? e => onPointer(e, el, 'move') : undefined}
      style={{
        position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, width, height: fixedHeight,
        transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`, opacity: el.opacity,
        cursor: onPointer ? 'move' : undefined, touchAction: 'none',
        outline: selected ? `${2 * ui}px solid #f97316` : undefined, outlineOffset: 4 * ui,
      }}
    >
      {body}
      {selected && onPointer && (
        <>
          <span onPointerDown={e => { e.stopPropagation(); onPointer(e, el, 'resize'); }} style={{ position: 'absolute', right: -handle, bottom: -handle, width: handle * 1.4, height: handle * 1.4, background: '#fff', border: `${2 * ui}px solid #f97316`, borderRadius: 4 * ui, cursor: 'nwse-resize' }} />
          <span onPointerDown={e => { e.stopPropagation(); onPointer(e, el, 'rotate'); }} style={{ position: 'absolute', left: '50%', top: -handle * 3.2, width: handle * 1.4, height: handle * 1.4, transform: 'translateX(-50%)', background: '#f97316', border: `${2 * ui}px solid #fff`, borderRadius: '50%', cursor: 'grab' }} />
        </>
      )}
    </div>
  );
}
