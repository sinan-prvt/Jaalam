import { forwardRef, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { LAYOUTS } from './layouts';
import { POSTER_FONTS_HREF } from './fonts';
import { ElementView, type HandleMode } from './elements';
import { FORMATS, type PosterData, type PosterElement, type PosterFormat, type PosterStyle } from './types';

/** Adds the poster fonts stylesheet to the page once. */
export function usePosterFonts() {
  useEffect(() => {
    if (document.getElementById('poster-fonts')) return;
    const link = document.createElement('link');
    link.id = 'poster-fonts';
    link.rel = 'stylesheet';
    link.href = POSTER_FONTS_HREF;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }, []);
}

/** Re-renders when web fonts finish loading, so text measured before then is resized. */
function useFontsLoaded() {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion(v => v + 1);
    document.fonts.addEventListener('loadingdone', bump);
    return () => document.fonts.removeEventListener('loadingdone', bump);
  }, []);
}

interface Props {
  data: PosterData;
  style: PosterStyle;
  format: PosterFormat;
  /** Free elements layered over the template. */
  elements?: PosterElement[];
  /** Editor only: selected element (shows handles) and pointer handler. */
  selectedId?: string | null;
  onElementPointer?: (e: ReactPointerEvent, el: PosterElement, mode: HandleMode) => void;
  /** Editor only: click on the template itself (not on an element). */
  onSurfaceClick?: (e: ReactMouseEvent<HTMLDivElement>) => void;
  /** 1 / preview scale, so handles keep their on-screen size. */
  ui?: number;
}

/**
 * The poster at its real export size (1080px wide etc.). The ref points at this
 * full-size node, which is what gets exported to PNG.
 */
export const PosterSurface = forwardRef<HTMLDivElement, Props>(function PosterSurface({ data, style, format, elements = [], selectedId, onElementPointer, onSurfaceClick, ui = 1 }, ref) {
  useFontsLoaded();
  const { w, h } = FORMATS[format];
  const unit = Math.min(w, h) / 1080;
  const Layout = LAYOUTS[style.layout].render;
  return (
    <div ref={ref} className="relative overflow-hidden" style={{ width: w, height: h, background: style.palette.bg, cursor: onSurfaceClick ? 'pointer' : undefined }} onClick={onSurfaceClick}>
      <Layout d={data} st={style} w={w} h={h} u={n => n * unit} f={n => n * unit * style.scale} />
      {elements.map(el => (
        <ElementView key={el.id} el={el} pw={w} ph={h} selected={el.id === selectedId} ui={ui} onPointer={onElementPointer} />
      ))}
    </div>
  );
});

/** A poster scaled down to fit its container width (used for previews, thumbnails and the editor). */
export const PosterPreview = forwardRef<HTMLDivElement, Props & { className?: string }>(function PosterPreview({ className = '', ...props }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { w, h } = FORMATS[props.format];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const scale = width / w;
  return (
    <div ref={box} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      {width > 0 && (
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: w, height: h, position: 'absolute', top: 0, left: 0 }}>
          <PosterSurface ref={ref} ui={1 / scale} {...props} />
        </div>
      )}
    </div>
  );
});
