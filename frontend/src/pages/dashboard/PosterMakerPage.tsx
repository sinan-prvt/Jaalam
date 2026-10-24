import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as htmlToImage from 'html-to-image';
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowLeft, ArrowUp, Copy, Download, FolderOpen, Image as ImageIcon, LayoutGrid, Library, ListChecks, Maximize2, MousePointerClick, Store, Palette, Redo2, RotateCcw, Save, Search, Shapes, Sparkles, Trash2, Type, Undo2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import usePlan from '../../hooks/usePlan';
import { PosterPreview } from '../../components/posters/PosterCanvas';
import { CATEGORIES, CATEGORY_GROUPS, POSTER_TEMPLATES, TREND } from '../../components/posters/templates';
import { FAMILY_LABELS, LAYOUTS, type LayoutFamily } from '../../components/posters/registry';
import { POSTER_FONTS, usePosterFonts, type PosterFontKey } from '../../components/posters/fonts';
import { ElementView, type HandleMode } from '../../components/posters/elements';
import { ELEMENT_LIBRARY, cloneElement, newImageElement } from '../../components/posters/library';
import { FORMATS, type ArtKey, type LayoutKey, type Palette as PosterPalette, type PosterData, type PosterElement, type PosterFormat, type PosterStyle, type PosterTemplate } from '../../components/posters/types';

const PAGE = 24;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

type TextField = { key: keyof PosterData; label: string; multiline?: boolean; hint?: string };

/** Text fields, grouped into cards in the sidebar. */
const TEXT_GROUPS: { title: string; icon: typeof Type; fields: TextField[] }[] = [
  {
    title: 'Main text', icon: Type, fields: [
      { key: 'headline', label: 'Headline', multiline: true, hint: 'Enter starts a new line in the title' },
      { key: 'subhead', label: 'Sub heading' },
      { key: 'offer', label: 'Offer / highlight' },
    ],
  },
  {
    title: 'Details', icon: ListChecks, fields: [
      { key: 'body', label: 'Details or list', multiline: true, hint: 'One item per line. Prices: Item - ₹120' },
      { key: 'date', label: 'Date / time' },
      { key: 'cta', label: 'Button text' },
    ],
  },
  {
    title: 'Brand & contact', icon: Store, fields: [
      { key: 'brand', label: 'Brand / shop name' },
      { key: 'contact', label: 'Phone / website' },
      { key: 'address', label: 'Address' },
    ],
  },
];

const COLOR_FIELDS: { key: keyof PosterPalette; label: string }[] = [
  { key: 'bg', label: 'Background' },
  { key: 'bg2', label: 'Panel' },
  { key: 'ink', label: 'Text' },
  { key: 'accent', label: 'Accent' },
  { key: 'accent2', label: 'Accent 2' },
  { key: 'onAccent', label: 'Text on accent' },
];

const ART_OPTIONS: ArtKey[] = ['pookalam', 'konna', 'lamps', 'star', 'crescent', 'confetti', 'waves', 'flag', 'candle', 'laurel', 'rays', 'cross', 'book', 'heart'];

/** Template fields that clicking the poster can select, most specific first. */
const CLICKABLE: (keyof PosterData)[] = ['headline', 'subhead', 'offer', 'cta', 'date', 'contact', 'address', 'brand', 'body'];

/** A saved poster as the library grid lists it. */
interface DraftSummary { id: number; name: string; template_id: string; format: PosterFormat; thumbnail: string; updated_at: string }

/** What a draft stores: the edited poster plus enough of its template to reopen it. */
interface DraftContent { data: PosterData; style: PosterStyle; elements: PosterElement[]; template: { id: string; name: string; category: string } }

/** One step of the editor's undo history. */
interface Snapshot { data: PosterData; style: PosterStyle; elements: PosterElement[]; format: PosterFormat }

// State is never mutated, so unchanged parts keep their identity
const sameSnapshot = (a: Snapshot, b: Snapshot) => a.data === b.data && a.style === b.style && a.elements === b.elements && a.format === b.format;

const HISTORY_LIMIT = 100;

/** Auto-save waits this long after the last edit. */
const AUTOSAVE_DELAY = 3000;
const AUTOSAVE_KEY = 'poster-autosave';
/** Give up on the library thumbnail after this long and save without one. */
const THUMBNAIL_TIMEOUT = 5000;

const readAutoSave = () => {
  try {
    return localStorage.getItem(AUTOSAVE_KEY) !== 'off';
  } catch {
    return true;
  }
};

const DRAFTS_URL = '/api/marketing/poster-drafts/';

/** Re-encodes a large uploaded photo (data URL) as a 1600px JPEG, so drafts stay small enough to save. */
const shrinkImage = (src: string) => new Promise<string>(resolve => {
  if (!src.startsWith('data:image') || src.length < 600_000) return resolve(src);
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * k);
    canvas.height = Math.round(img.height * k);
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
    resolve(canvas.toDataURL('image/jpeg', 0.85));
  };
  img.onerror = () => resolve(src);
  img.src = src;
});

const lines0 = (s: string) => s.split('\n').map(x => x.trim()).find(Boolean) || '';

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return new Date(iso).toLocaleDateString();
};

const readFile = (file: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = reject;
  r.readAsDataURL(file);
});

const imageAspect = (src: string) => new Promise<number>(resolve => {
  const img = new Image();
  img.onload = () => resolve(img.naturalHeight / img.naturalWidth || 1);
  img.onerror = () => resolve(1);
  img.src = src;
});

const norm = (s: string) => s.replace(/[‘’"'>]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

const inputCls = 'w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15 outline-none transition-all';
const labelCls = 'block text-xs font-bold text-slate-600 mb-1.5';
const EFFECT_COLOR_LABEL: Record<PosterElement['effect'], string> = { none: '', outline: 'Outline', shadow: 'Shadow', gradient: 'Gradient end', '3d': 'Depth', glow: 'Glow' };

const chipCls = (on: boolean) => `px-2 py-2 rounded-xl border text-[11px] font-bold transition-all ${on ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'}`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.14em]">{title}</h4>
      {children}
    </div>
  );
}

/** White card with an icon header, used to group sidebar fields. */
function Card({ title, icon: Icon, children }: { title: string; icon: typeof Type; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,.04)]">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Icon size={15} /></span>
        <h4 className="text-[13px] font-black text-slate-800">{title}</h4>
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, suffix = '' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <label className={labelCls}>{label} · {Math.round(value * 100) / 100}{suffix}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-orange-500" />
    </div>
  );
}

function ColorRow({ label, value, onChange, allowNone }: { label: string; value: string; onChange: (v: string) => void; allowNone?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
      <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)} className="w-7 h-7 rounded-lg border-0 p-0 bg-transparent cursor-pointer" />
      <span className="text-xs font-bold text-slate-600 flex-1">{label}{allowNone && !value ? ' · none' : ''}</span>
      {allowNone && value && <button onClick={() => onChange('')} className="text-[11px] font-bold text-slate-400 hover:text-slate-600">None</button>}
    </div>
  );
}

/** Small preview of a library element. */
function LibraryThumb({ el }: { el: PosterElement }) {
  return (
    <div className="relative w-full h-16 overflow-hidden rounded-lg" style={{ background: 'repeating-conic-gradient(#334155 0 25%, #3b4a5f 0 50%) 0 0 / 14px 14px' }}>
      {/* Drawn on a 300px mini poster, then scaled down so text stays legible */}
      <div className="absolute left-1/2 top-1/2" style={{ width: 300, height: 300, transform: 'translate(-50%, -50%) scale(0.5)' }}>
        <ElementView el={{ ...el, x: 50, y: 50, w: Math.min(el.w * 1.4, 95), rotation: el.rotation / 2 }} pw={300} ph={300} />
      </div>
    </div>
  );
}

/** Standalone poster maker: templates, editor and PNG export. Not tied to any website. */
export default function PosterMakerPage() {
  usePosterFonts();
  const { can, requiredPlan } = usePlan();

  // Gallery state
  const [group, setGroup] = useState<string>('All');
  const [look, setLook] = useState<LayoutFamily | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [view, setView] = useState<'templates' | 'library'>('templates');
  const [drafts, setDrafts] = useState<DraftSummary[] | null>(null);

  // Editor state
  const [template, setTemplate] = useState<PosterTemplate | null>(null);
  const [data, setData] = useState<PosterData | null>(null);
  const [style, setStyle] = useState<PosterStyle | null>(null);
  const [format, setFormat] = useState<PosterFormat>('square');
  const [panel, setPanel] = useState<'text' | 'elements' | 'design' | 'image'>('design');
  const [elGroup, setElGroup] = useState('All');
  const [elements, setElements] = useState<PosterElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusField, setFocusField] = useState<keyof PosterData | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  /** Set once this poster is saved to the library; later saves update the same draft. */
  const [draftId, setDraftId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  /** Edits since the poster was opened or last saved. */
  const [dirty, setDirty] = useState(false);
  // Undo history; histPos mirrors it for rendering the buttons
  const history = useRef<{ stack: Snapshot[]; idx: number }>({ stack: [], idx: -1 });
  const restoring = useRef(false);
  const [histPos, setHistPos] = useState({ idx: -1, len: 0 });
  const [autoSave, setAutoSave] = useState(readAutoSave);
  /** Undo step a failed auto-save stopped at: it waits for the next edit instead of retrying in a loop. */
  const [autoSaveFailedAt, setAutoSaveFailedAt] = useState<number | null>(null);
  /** Latest editor state, so a save can tell whether edits arrived while it was running. */
  const latest = useRef<Snapshot | null>(null);
  const [zoom, setZoom] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  // Ctrl + wheel zooms the preview (native listener: React's wheel handler can't block page zoom)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(z - Math.sign(e.deltaY) * 0.1).toFixed(2))));
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [template]);
  const posterRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; mode: HandleMode; sx: number; sy: number; start: PosterElement; rect: DOMRect } | null>(null);
  /** When the last drag ended: the click that follows a drag must not deselect. */
  const dragEnded = useRef(0);

  const library = useMemo(() => ELEMENT_LIBRARY.map(g => ({ ...g, items: g.items.map(p => ({ ...p, preview: p.make() })) })), []);
  const selected = elements.find(e => e.id === selectedId) || null;

  // Categories that have templates in the chosen style (Kerala ads are business-only)
  const available = useMemo(() => new Set(POSTER_TEMPLATES.filter(t => look === 'all' || LAYOUTS[t.style.layout].family === look).map(t => t.category)), [look]);
  const groups = CATEGORY_GROUPS.filter(g => CATEGORIES.some(c => c.group === g && available.has(c.key)));
  const visibleCategories = CATEGORIES.filter(c => available.has(c.key) && (group === 'All' || c.group === group));
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTER_TEMPLATES.filter(t => {
      const cat = CATEGORIES.find(c => c.key === t.category)!;
      if (group !== 'All' && cat.group !== group) return false;
      if (category !== 'all' && t.category !== category) return false;
      if (look !== 'all' && LAYOUTS[t.style.layout].family !== look) return false;
      if (q && !`${t.name} ${t.data.headline} ${t.data.subhead} ${cat.group}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [group, category, query, look]);

  const resetHistory = () => {
    history.current = { stack: [], idx: -1 };
    restoring.current = false;
    setHistPos({ idx: -1, len: 0 });
    setDirty(false);
    setAutoSaveFailedAt(null);
  };

  /** Adds a snapshot after the current step (dropping any redo steps); false when nothing changed. */
  const commitHistory = useCallback((snap: Snapshot) => {
    const h = history.current;
    if (h.idx >= 0 && sameSnapshot(h.stack[h.idx], snap)) return false;
    h.stack = [...h.stack.slice(0, h.idx + 1), snap].slice(-HISTORY_LIMIT);
    h.idx = h.stack.length - 1;
    setHistPos({ idx: h.idx, len: h.stack.length });
    return true;
  }, []);

  // Record edits; typing and dragging settle for a moment before they become one undo step
  useEffect(() => {
    if (!template || !data || !style) return;
    if (restoring.current) {
      restoring.current = false;
      return;
    }
    const first = history.current.idx < 0;
    const timer = setTimeout(() => {
      if (commitHistory({ data, style, elements, format }) && !first) setDirty(true);
    }, first ? 0 : 400);
    return () => clearTimeout(timer);
  }, [template, data, style, elements, format, commitHistory]);

  const restoreSnapshot = (snap: Snapshot) => {
    restoring.current = true;
    setData(snap.data);
    setStyle(snap.style);
    setElements(snap.elements);
    setFormat(snap.format);
    setSelectedId(null);
    setDirty(true);
    setHistPos({ idx: history.current.idx, len: history.current.stack.length });
  };
  const undo = () => {
    if (!data || !style) return;
    // An edit still settling counts as a step, so undo returns to just before it
    commitHistory({ data, style, elements, format });
    const h = history.current;
    if (h.idx <= 0) return;
    h.idx -= 1;
    restoreSnapshot(h.stack[h.idx]);
  };
  const redo = () => {
    const h = history.current;
    if (h.idx >= h.stack.length - 1) return;
    h.idx += 1;
    restoreSnapshot(h.stack[h.idx]);
  };
  const canUndo = histPos.idx > 0;
  const canRedo = histPos.idx < histPos.len - 1;

  const leaveEditor = () => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    setTemplate(null);
    if (view === 'library') loadDrafts();
  };

  const openTemplate = (t: PosterTemplate) => {
    setTemplate(t);
    setData({ ...t.data });
    setStyle({ ...t.style, palette: { ...t.style.palette } });
    setElements([]);
    setSelectedId(null);
    setDraftId(null);
    setSavedAt(null);
    resetHistory();
    setZoom(1);
    setPanel('design');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setField = (key: keyof PosterData, value: string) => setData(d => (d ? { ...d, [key]: value } : d));
  const setStyleField = <K extends keyof PosterStyle>(key: K, value: PosterStyle[K]) => setStyle(s => (s ? { ...s, [key]: value } : s));
  const setColor = (key: keyof PosterPalette, value: string) => setStyle(s => (s ? { ...s, palette: { ...s.palette, [key]: value } } : s));

  // ── free elements ──
  const updateEl = useCallback((id: string, patch: Partial<PosterElement>) => setElements(list => list.map(e => (e.id === id ? { ...e, ...patch } : e))), []);
  const addEl = (el: PosterElement) => {
    const offset = (elements.length % 5) * 3;
    setElements(list => [...list, { ...el, x: el.x + offset, y: el.y + offset }]);
    setSelectedId(el.id);
  };
  const removeEl = (id: string) => { setElements(list => list.filter(e => e.id !== id)); setSelectedId(null); };
  const moveLayer = (id: string, dir: 1 | -1) => setElements(list => {
    const i = list.findIndex(e => e.id === id), j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return list;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  const onElementPointer = (e: ReactPointerEvent, el: PosterElement, mode: HandleMode) => {
    e.stopPropagation();
    e.preventDefault();
    if (!posterRef.current) return;
    setSelectedId(el.id);
    drag.current = { id: el.id, mode, sx: e.clientX, sy: e.clientY, start: el, rect: posterRef.current.getBoundingClientRect() };
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = ((e.clientX - d.sx) / d.rect.width) * 100;
      const dy = ((e.clientY - d.sy) / d.rect.height) * 100;
      if (d.mode === 'move') updateEl(d.id, { x: Math.round((d.start.x + dx) * 10) / 10, y: Math.round((d.start.y + dy) * 10) / 10 });
      else if (d.mode === 'resize') updateEl(d.id, { w: Math.max(3, Math.min(160, d.start.w + dx * 2)) });
      else {
        const cx = d.rect.left + (d.start.x / 100) * d.rect.width, cy = d.rect.top + (d.start.y / 100) * d.rect.height;
        const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
        const snapped = Math.round(angle);
        updateEl(d.id, { rotation: Math.abs(snapped % 90) < 4 ? Math.round(snapped / 90) * 90 : snapped });
      }
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (d && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 3) dragEnded.current = Date.now();
      drag.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [updateEl]);

  // Delete / arrows / Escape for the selected element
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      const el = elements.find(x => x.id === selectedId);
      if (!el) return;
      const step = e.shiftKey ? 2 : 0.5;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeEl(el.id); }
      else if (e.key === 'Escape') setSelectedId(null);
      else if (e.key === 'ArrowLeft') { e.preventDefault(); updateEl(el.id, { x: el.x - step }); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); updateEl(el.id, { x: el.x + step }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); updateEl(el.id, { y: el.y - step }); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); updateEl(el.id, { y: el.y + step }); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [selectedId, elements, updateEl]);

  /** Click on the template: find which text field (or the photo) was clicked and open it in the sidebar. */
  const onSurfaceClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-element]') || !data || Date.now() - dragEnded.current < 400) return;
    setSelectedId(null);
    const surface = e.currentTarget;
    for (let node: HTMLElement | null = target; node && node !== surface; node = node.parentElement) {
      const t = norm(node.textContent || '');
      if (!t) continue;
      const field = CLICKABLE.find(f => {
        const v = norm(data[f] || '');
        return v && (v === t || v.includes(t) || norm(data[f].split('\n').join(' ')).includes(t));
      });
      if (field) {
        setPanel('text');
        setFocusField(field);
        return;
      }
      if (t.length > 80) break;
    }
    if (target.tagName === 'IMG' || target.closest('svg')) {
      setPanel('image');
      setFocusField('image');
    }
  };

  useEffect(() => {
    if (!focusField) return;
    const el = document.getElementById(`pf-${focusField}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus();
    const t = setTimeout(() => setFocusField(null), 1600);
    return () => clearTimeout(t);
  }, [focusField, panel]);

  // ── drafts (My library) ──
  const loadDrafts = useCallback(async () => {
    try {
      const res = await axios.get<DraftSummary[]>(DRAFTS_URL);
      setDrafts(res.data);
    } catch {
      setDrafts([]);
    }
  }, []);
  useEffect(() => {
    axios.get<DraftSummary[]>(DRAFTS_URL).then(res => setDrafts(res.data)).catch(() => setDrafts([]));
  }, []);

  const saveDraft = async ({ silent = false } = {}) => {
    if (!template || !data || !style || saving) return;
    setSaving(true);
    // A manual save clears the selection so the thumbnail has no handles; auto-save must not interrupt editing
    if (!silent) setSelectedId(null);
    const started: Snapshot = { data, style, elements, format };
    const t = silent ? undefined : toast.loading('Saving draft...');
    try {
      // Let the cleared selection repaint before the thumbnail (frames don't run in a background tab, so auto-save skips this)
      if (!silent) await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      let thumbnail = '';
      try {
        // Fonts are skipped (system fallbacks are fine at this size) and a slow capture is abandoned
        if (posterRef.current) {
          const capture = htmlToImage.toJpeg(posterRef.current, { pixelRatio: 0.32, quality: 0.75, skipFonts: true });
          thumbnail = await Promise.race([capture, new Promise<string>(resolve => setTimeout(() => resolve(''), THUMBNAIL_TIMEOUT))]);
        }
      } catch {
        // A thumbnail is nice to have; the draft still saves without one
      }
      const content: DraftContent = {
        data: { ...data, image: await shrinkImage(data.image), logo: await shrinkImage(data.logo) },
        style,
        elements: await Promise.all(elements.map(async el => (el.src ? { ...el, src: await shrinkImage(el.src) } : el))),
        template: { id: template.id, name: template.name, category: template.category },
      };
      const body = { name: (lines0(data.headline) || template.name).slice(0, 200), template_id: template.id, format, content, thumbnail };
      const res = draftId ? await axios.put(`${DRAFTS_URL}${draftId}/`, body) : await axios.post(DRAFTS_URL, body);
      setDraftId(res.data.id);
      setSavedAt(Date.now());
      // Edits made while saving stay unsaved
      setDirty(!!latest.current && !sameSnapshot(started, latest.current));
      setAutoSaveFailedAt(null);
      loadDrafts();
      if (!silent) toast.success('Saved to My library', { id: t });
    } catch (err) {
      const tooBig = axios.isAxiosError(err) && (err.response?.status === 413 || err.response?.status === 400);
      if (silent) setAutoSaveFailedAt(history.current.idx);
      const message = tooBig ? 'Could not save: the photos are too large. Try smaller images.' : 'Could not save the draft. Please try again.';
      // One toast for repeated auto-save failures
      toast.error(silent ? `Auto-save failed. ${message}` : message, { id: t ?? 'autosave-error' });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    latest.current = data && style ? { data, style, elements, format } : null;
  }, [data, style, elements, format]);

  // Auto-save a few seconds after the last edit (each new undo step restarts the wait)
  const autoSaveRef = useRef(saveDraft);
  useEffect(() => { autoSaveRef.current = saveDraft; });
  useEffect(() => {
    if (!autoSave || !dirty || !template || saving || autoSaveFailedAt === histPos.idx) return;
    const timer = setTimeout(() => autoSaveRef.current({ silent: true }), AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [autoSave, dirty, template, saving, histPos, autoSaveFailedAt]);

  const toggleAutoSave = () => {
    const on = !autoSave;
    setAutoSave(on);
    try {
      localStorage.setItem(AUTOSAVE_KEY, on ? 'on' : 'off');
    } catch {
      // Private mode: the choice lasts for this visit only
    }
  };

  // Ctrl + S save, Ctrl + Z / Ctrl + Y (or Ctrl + Shift + Z) undo and redo, Ctrl + D duplicate
  const shortcuts = useRef({ save: () => {}, undo, redo, duplicate: () => {} });
  useEffect(() => {
    const el = elements.find(x => x.id === selectedId);
    shortcuts.current = { save: () => saveDraft(), undo, redo, duplicate: () => { if (el) addEl(cloneElement(el)); } };
  });
  useEffect(() => {
    if (!template) return;
    const key = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 's') {
        e.preventDefault();
        shortcuts.current.save();
        return;
      }
      // Inside a text box the browser's own undo edits the text
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); shortcuts.current.undo(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); shortcuts.current.redo(); }
      else if (k === 'd') { e.preventDefault(); shortcuts.current.duplicate(); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [template]);

  useEffect(() => {
    if (!template || !dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [template, dirty]);

  const openDraft = async (id: number) => {
    const t = toast.loading('Opening...');
    try {
      const res = await axios.get<DraftSummary & { content: DraftContent }>(`${DRAFTS_URL}${id}/`);
      const { content } = res.data;
      // The original template if it still exists, else one rebuilt from the draft (Reset goes back to the draft)
      const original = POSTER_TEMPLATES.find(p => p.id === content.template.id);
      setTemplate(original || { ...content.template, style: content.style, data: content.data });
      setData({ ...content.data });
      setStyle({ ...content.style, palette: { ...content.style.palette } });
      setElements(content.elements || []);
      setFormat(res.data.format);
      setSelectedId(null);
      setDraftId(id);
      setSavedAt(new Date(res.data.updated_at).getTime());
      resetHistory();
      setZoom(1);
      setPanel('design');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.dismiss(t);
    } catch {
      toast.error('Could not open this draft.', { id: t });
    }
  };

  const deleteDraft = async (d: DraftSummary) => {
    if (!window.confirm(`Delete "${d.name}" from your library? This cannot be undone.`)) return;
    try {
      await axios.delete(`${DRAFTS_URL}${d.id}/`);
      setDrafts(list => (list || []).filter(x => x.id !== d.id));
      if (draftId === d.id) setDraftId(null);
      toast.success('Draft deleted');
    } catch {
      toast.error('Could not delete the draft.');
    }
  };

  const handleDownload = async () => {
    if (!posterRef.current || !template) return;
    setDownloading(true);
    setSelectedId(null);
    const t = toast.loading('Preparing your poster...');
    try {
      // Let the selection handles disappear before capturing
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await document.fonts.ready;
      const url = await htmlToImage.toPng(posterRef.current, { pixelRatio: 1, cacheBust: true });
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(data?.headline || template.name).replace(/[^\wഀ-ൿ]+/g, '-').slice(0, 40) || 'poster'}.png`;
      a.click();
      toast.success('Poster downloaded', { id: t });
    } catch (err) {
      console.error(err);
      toast.error('Could not export the poster. Try another image.', { id: t });
    } finally {
      setDownloading(false);
    }
  };

  const handleAi = async () => {
    if (!aiPrompt.trim()) return;
    setAiBusy(true);
    const t = toast.loading('AI is painting your background...');
    try {
      const res = await axios.post('/api/marketing/poster/', { prompt: aiPrompt }, { withCredentials: true });
      setField('image', res.data.image);
      toast.success('Background ready', { id: t });
    } catch (err) {
      const message = axios.isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      toast.error(message || 'Failed to generate image', { id: t });
    } finally {
      setAiBusy(false);
    }
  };

  const readUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return null;
    if (file.size > 8 * 1024 * 1024) { toast.error('Please use an image under 8 MB'); return null; }
    return readFile(file);
  };
  const upload = (key: 'image' | 'logo') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const src = await readUpload(e);
    if (src) setField(key, src);
  };
  const uploadElementImage = async (e: React.ChangeEvent<HTMLInputElement>, replaceId?: string) => {
    const src = await readUpload(e);
    if (!src) return;
    const aspect = await imageAspect(src);
    if (replaceId) updateEl(replaceId, { src, aspect });
    else addEl(newImageElement(src, aspect));
  };

  /** Properties of the selected free element. */
  const renderElementPanel = (el: PosterElement) => {
    const set = (patch: Partial<PosterElement>) => updateEl(el.id, patch);
    const hasText = el.kind === 'text' || el.kind === 'shape';
    const kindLabel = { text: 'Text', shape: 'Shape', icon: 'Icon', image: 'Image' }[el.kind];
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-black text-slate-800">Selected {kindLabel}</h4>
          <div className="flex gap-1.5">
            <button onClick={() => moveLayer(el.id, 1)} title="Bring forward" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"><ArrowUp size={14} /></button>
            <button onClick={() => moveLayer(el.id, -1)} title="Send backward" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"><ArrowDown size={14} /></button>
            <button onClick={() => addEl(cloneElement(el))} title="Duplicate" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"><Copy size={14} /></button>
            <button onClick={() => removeEl(el.id)} title="Delete (Del key)" className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
          </div>
        </div>
        {hasText && (
          <div>
            <label className={labelCls}>Text</label>
            <textarea value={el.text} onChange={e => set({ text: e.target.value })} rows={2} className={`${inputCls} resize-y`} placeholder={el.kind === 'shape' ? 'Optional text inside' : ''} autoFocus />
          </div>
        )}
        {el.kind === 'image' && (
          <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <Upload size={16} /> Replace image
            <input type="file" accept="image/*" className="hidden" onChange={e => uploadElementImage(e, el.id)} />
          </label>
        )}
        {hasText && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <select value={el.font} onChange={e => set({ font: e.target.value as PosterFontKey })} className={inputCls} style={{ fontFamily: POSTER_FONTS[el.font].css }}>
                {(Object.keys(POSTER_FONTS) as PosterFontKey[]).map(k => <option key={k} value={k}>{POSTER_FONTS[k].label}</option>)}
              </select>
              <select value={el.weight} onChange={e => set({ weight: Number(e.target.value) })} className={inputCls}>
                <option value={400}>Regular</option><option value={600}>Semi bold</option><option value={800}>Bold</option><option value={900}>Black</option>
              </select>
            </div>
            <Slider label="Text size" value={el.size} min={12} max={260} onChange={v => set({ size: v })} />
            <div className="flex gap-2">
              {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(([a, Icon]) => (
                <button key={a} onClick={() => set({ align: a })} className={`flex-1 flex justify-center ${chipCls(el.align === a)}`}><Icon size={16} /></button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([['none', 'None'], ['outline', 'Outline'], ['shadow', 'Shadow'], ['gradient', 'Gradient'], ['3d', '3D'], ['glow', 'Glow']] as const).map(([fx, label]) => <button key={fx} onClick={() => set({ effect: fx, stroke: fx === 'shadow' && el.effect !== 'shadow' ? '#00000099' : el.stroke })} className={chipCls(el.effect === fx)}>{label}</button>)}
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-2">
          <ColorRow label={el.kind === 'text' ? 'Text colour' : 'Fill'} value={el.color} onChange={v => set({ color: v })} />
          {el.kind !== 'image' && <ColorRow label={el.kind === 'shape' ? 'Inner text' : 'Background'} value={el.bg} onChange={v => set({ bg: v })} allowNone={el.kind !== 'shape'} />}
          {el.kind === 'image' && <ColorRow label="Border" value={el.bg} onChange={v => set({ bg: v })} allowNone />}
          {hasText && el.effect !== 'none' && <ColorRow label={EFFECT_COLOR_LABEL[el.effect]} value={el.stroke.slice(0, 7)} onChange={v => set({ stroke: el.effect === 'shadow' ? `${v}99` : v })} />}
        </div>
        <Slider label="Width" value={el.w} min={3} max={160} onChange={v => set({ w: v })} suffix="%" />
        {el.kind !== 'text' && <Slider label="Height ratio" value={el.aspect} min={0.05} max={3} step={0.01} onChange={v => set({ aspect: v })} />}
        <Slider label="Rotation" value={el.rotation} min={-180} max={180} onChange={v => set({ rotation: v })} suffix="°" />
        <Slider label="Opacity" value={el.opacity} min={0.1} max={1} step={0.05} onChange={v => set({ opacity: v })} />
        {(el.kind === 'text' || el.kind === 'image') && <Slider label="Corner radius" value={el.radius} min={0} max={200} onChange={v => set({ radius: v })} />}
        <button onClick={() => setSelectedId(null)} className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black">Done</button>
        <p className="text-[11px] text-slate-400">Drag on the poster to move. Orange corner resizes, top dot rotates. Arrow keys nudge, Delete removes, Ctrl + D duplicates, Ctrl + Z undoes.</p>
      </>
    );
  };

  // ───────────── Editor ─────────────
  if (template && data && style) {
    const cat = CATEGORIES.find(c => c.key === template.category)!;
    const fieldCls = (key: keyof PosterData) => `${inputCls} ${focusField === key ? '!border-orange-500 !bg-orange-50 ring-4 ring-orange-500/20' : ''}`;
    return (
      <div className="animate-in fade-in duration-300 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button onClick={leaveEditor} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={16} /> {view === 'library' ? 'My library' : 'All templates'}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={toggleAutoSave} role="switch" aria-checked={autoSave} title="Save to My library automatically while you edit" className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
              <span className={`relative w-8 h-[18px] rounded-full transition-colors ${autoSave ? 'bg-orange-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-all ${autoSave ? 'left-[16px]' : 'left-[2px]'}`} />
              </span>
              Auto-save
            </button>
            {saving
              ? <span className="text-xs font-semibold text-slate-400 mr-1">Saving...</span>
              : dirty
                ? <span className="text-xs font-semibold text-amber-600 mr-1">{autoSave && autoSaveFailedAt !== histPos.idx ? 'Saving soon...' : 'Unsaved changes'}</span>
                : savedAt && <span className="text-xs font-semibold text-slate-400 mr-1">Saved {timeAgo(new Date(savedAt).toISOString())}</span>}
            <div className="inline-flex rounded-xl bg-white border border-slate-200 overflow-hidden">
              <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl + Z)" className="px-3 py-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white"><Undo2 size={16} /></button>
              <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl + Y)" className="px-3 py-2.5 border-l border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white"><Redo2 size={16} /></button>
            </div>
            <button onClick={() => saveDraft()} disabled={saving} title="Save to My library (Ctrl + S)" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-orange-200 text-sm font-black text-orange-600 hover:bg-orange-50 disabled:opacity-60">
              <Save size={16} /> {draftId ? 'Save' : 'Save draft'}
            </button>
            <button onClick={() => { const snap = POSTER_TEMPLATES.find(p => p.id === template.id) || template; setData({ ...snap.data }); setStyle({ ...snap.style, palette: { ...snap.style.palette } }); setElements([]); setSelectedId(null); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50" title="Back to the original template (you can undo this)">
              <RotateCcw size={16} /> Reset
            </button>
            <button onClick={handleDownload} disabled={downloading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-black shadow-md hover:shadow-orange-500/30 disabled:opacity-60">
              <Download size={16} /> {downloading ? 'Exporting...' : 'Download PNG'}
            </button>
          </div>
        </div>

        {/* Both columns share one height so their edges line up; the sidebar scrolls inside */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
          {/* Controls */}
          <div className="lg:col-span-4 lg:h-[calc(100vh-170px)] lg:min-h-[560px] flex flex-col bg-slate-50/90 backdrop-blur-xl rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgba(15,23,42,.06)] overflow-hidden order-2 lg:order-1">
            <div className="p-2 bg-white border-b border-slate-200/70">
              <div role="tablist" className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100">
                {([['design', Palette, 'Design'], ['text', Type, 'Text'], ['elements', Shapes, 'Elements'], ['image', ImageIcon, 'Images']] as const).map(([key, Icon, label]) => {
                  const active = panel === key && !selected;
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={active}
                      onClick={() => { setPanel(key); setSelectedId(null); }}
                      className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold outline-none focus:outline-none transition-all ${active ? 'bg-white text-orange-600 shadow-[0_2px_8px_rgba(15,23,42,.08)]' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'}`}
                    >
                      <Icon size={17} strokeWidth={active ? 2.4 : 2} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 min-h-0 p-4 space-y-4 max-h-[70vh] lg:max-h-none overflow-y-auto [scrollbar-width:thin]">
              {selected ? renderElementPanel(selected) : (
                <>
              {panel === 'text' && (
                <>
                  <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-white shadow-sm">
                    <MousePointerClick size={18} className="mt-0.5 shrink-0" />
                    <p className="text-xs font-semibold leading-relaxed"><span className="font-black">Click any text on the poster</span> to jump straight to it. Leave a field empty to hide it.</p>
                  </div>
                  {TEXT_GROUPS.map(g => (
                    <Card key={g.title} title={g.title} icon={g.icon}>
                      {g.fields.map(fd => (
                        <div key={fd.key}>
                          <div className="flex items-center justify-between">
                            <label htmlFor={`pf-${fd.key}`} className={labelCls}>{fd.label}</label>
                            {data[fd.key] && (
                              <button onClick={() => setField(fd.key, '')} className="mb-1.5 text-[11px] font-semibold text-slate-400 hover:text-red-500">Clear</button>
                            )}
                          </div>
                          {fd.multiline ? (
                            <textarea id={`pf-${fd.key}`} value={data[fd.key]} onChange={e => setField(fd.key, e.target.value)} rows={fd.key === 'headline' ? 2 : 4} className={`${fieldCls(fd.key)} resize-y leading-relaxed`} placeholder="Empty = hidden" />
                          ) : (
                            <input id={`pf-${fd.key}`} value={data[fd.key]} onChange={e => setField(fd.key, e.target.value)} className={fieldCls(fd.key)} placeholder="Empty = hidden" />
                          )}
                          {fd.hint && <p className="text-[11px] text-slate-400 mt-1.5">{fd.hint}</p>}
                        </div>
                      ))}
                    </Card>
                  ))}
                  <p className="text-center text-[11px] text-slate-400 pb-1">മലയാളം works in every field.</p>
                </>
              )}

              {panel === 'elements' && (
                <>
                  <p className="text-xs font-semibold text-slate-500">Click to add, then drag it on the poster. You can add as many as you like.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', ...library.map(g => g.title)].map(t => (
                      <button key={t} onClick={() => setElGroup(t)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${elGroup === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{t}</button>
                    ))}
                  </div>
                  {library.filter(g => elGroup === 'All' || g.title === elGroup).map(g => (
                    <Section key={g.title} title={g.title}>
                      <div className={`grid ${g.title === 'Icons' ? 'grid-cols-4' : 'grid-cols-2'} gap-2`}>
                        {g.items.map(item => (
                          <button key={item.label} onClick={() => addEl(item.make())} title={item.label} className="group rounded-xl border border-slate-200 bg-white p-1.5 hover:border-orange-400 hover:shadow-sm transition-all text-left">
                            <LibraryThumb el={item.preview} />
                            {g.title !== 'Icons' && <span className="block text-[11px] font-bold text-slate-600 mt-1 px-0.5 truncate">{item.label}</span>}
                          </button>
                        ))}
                      </div>
                    </Section>
                  ))}
                  <Section title="Your images">
                    <label className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-orange-600 bg-orange-50 border-2 border-orange-200 hover:bg-orange-100 cursor-pointer">
                      <Upload size={16} /> Add photo / logo / sticker
                      <input type="file" accept="image/*" className="hidden" onChange={e => uploadElementImage(e)} />
                    </label>
                  </Section>
                  {elements.length > 0 && (
                    <Section title={`On this poster (${elements.length})`}>
                      <div className="space-y-1.5">
                        {[...elements].reverse().map(el => (
                          <button key={el.id} onClick={() => setSelectedId(el.id)} className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-orange-400">
                            <span className="truncate">{el.text || el.shape || el.icon || 'Image'}</span><span className="text-slate-400 capitalize">{el.kind}</span>
                          </button>
                        ))}
                      </div>
                    </Section>
                  )}
                </>
              )}
              {panel === 'design' && (
                <>
                  <Section title="Size">
                    <select value={format} onChange={e => setFormat(e.target.value as PosterFormat)} className={inputCls}>
                      {(Object.keys(FORMATS) as PosterFormat[]).map(k => <option key={k} value={k}>{FORMATS[k].label} ({FORMATS[k].w}×{FORMATS[k].h})</option>)}
                    </select>
                  </Section>
                  {(Object.keys(FAMILY_LABELS) as LayoutFamily[]).map(family => (
                    <Section key={family} title={`${FAMILY_LABELS[family]} layouts`}>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(LAYOUTS) as LayoutKey[]).filter(k => LAYOUTS[k].family === family).map(k => (
                          <button key={k} onClick={() => setStyleField('layout', k)} className={`px-2 py-2.5 rounded-xl border text-[11px] font-bold leading-tight transition-all ${style.layout === k ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'}`}>
                            {LAYOUTS[k].label}
                          </button>
                        ))}
                      </div>
                    </Section>
                  ))}
                  <Section title="Colour themes">
                    <div className="flex flex-wrap gap-2">
                      {[...cat.palettes, ...TREND].map((p, i) => (
                        <button key={i} onClick={() => setStyleField('palette', { ...p })} title="Apply colours" className="w-9 h-9 rounded-full border-2 border-white shadow ring-1 ring-slate-200 hover:scale-110 transition-transform overflow-hidden" style={{ background: `conic-gradient(${p.bg} 0 50%, ${p.accent} 50% 75%, ${p.accent2} 75%)` }} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {COLOR_FIELDS.map(c => (
                        <label key={c.key} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 cursor-pointer">
                          <input type="color" value={style.palette[c.key]} onChange={e => setColor(c.key, e.target.value)} className="w-7 h-7 rounded-lg border-0 p-0 bg-transparent cursor-pointer" />
                          <span className="text-xs font-bold text-slate-600">{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </Section>
                  <Section title="Fonts">
                    <div>
                      <label className={labelCls}>Heading font</label>
                      <select value={style.display} onChange={e => setStyleField('display', e.target.value as PosterFontKey)} className={inputCls} style={{ fontFamily: POSTER_FONTS[style.display].css }}>
                        {(Object.keys(POSTER_FONTS) as PosterFontKey[]).map(k => <option key={k} value={k}>{POSTER_FONTS[k].label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Text font</label>
                      <select value={style.body} onChange={e => setStyleField('body', e.target.value as PosterFontKey)} className={inputCls}>
                        {(Object.keys(POSTER_FONTS) as PosterFontKey[]).map(k => <option key={k} value={k}>{POSTER_FONTS[k].label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Text size · {Math.round(style.scale * 100)}%</label>
                      <input type="range" min={0.6} max={1.4} step={0.05} value={style.scale} onChange={e => setStyleField('scale', Number(e.target.value))} className="w-full accent-orange-500" />
                    </div>
                  </Section>
                </>
              )}

              {panel === 'image' && (
                <>
                  <Section title="Main photo">
                    <div className="flex gap-2">
                      <label id="pf-image" className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-orange-600 bg-orange-50 border-2 hover:bg-orange-100 cursor-pointer ${focusField === 'image' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-orange-200'}`}>
                        <Upload size={16} /> {data.image ? 'Change photo' : 'Upload photo'}
                        <input type="file" accept="image/*" className="hidden" onChange={upload('image')} />
                      </label>
                      {data.image && (
                        <button onClick={() => setField('image', '')} className="px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" title="Remove photo and show artwork"><X size={16} /></button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">With no photo, the poster shows the artwork below.</p>
                  </Section>
                  <Section title="Artwork">
                    <div className="grid grid-cols-4 gap-2">
                      {ART_OPTIONS.map(a => (
                        <button key={a} onClick={() => { setStyleField('art', a); setField('image', ''); }} className={`px-1.5 py-2 rounded-xl border text-[11px] font-bold capitalize ${style.art === a && !data.image ? 'border-orange-500 bg-orange-50 text-orange-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'}`}>{a}</button>
                      ))}
                    </div>
                  </Section>
                  <Section title="Logo">
                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <Upload size={16} /> {data.logo ? 'Change logo' : 'Upload logo'}
                        <input type="file" accept="image/*" className="hidden" onChange={upload('logo')} />
                      </label>
                      {data.logo && <button onClick={() => setField('logo', '')} className="px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" title="Remove logo"><X size={16} /></button>}
                    </div>
                  </Section>
                  <Section title="AI background">
                    {can('ai_marketing') ? (
                      <>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="e.g. Kerala backwaters at sunset with a houseboat, photo realistic" />
                        <button onClick={handleAi} disabled={aiBusy || !aiPrompt.trim()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-slate-300 disabled:to-slate-300">
                          <Sparkles size={16} /> {aiBusy ? 'Generating...' : 'Generate with AI'}
                        </button>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">AI backgrounds come with the {requiredPlan('ai_marketing')} plan. Uploading your own photos is free.</p>
                    )}
                  </Section>
                </>
              )}
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8 lg:h-[calc(100vh-170px)] lg:min-h-[560px] order-1 lg:order-2">
            <div className="h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgba(15,23,42,.06)] flex flex-col overflow-hidden">
              {/* Zoom bar */}
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200/70 bg-white/80">
                <span className="text-xs font-bold text-slate-500 truncate">{cat.label} · {LAYOUTS[style.layout].label} · {FORMATS[format].w}×{FORMATS[format].h}px</span>
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 shrink-0">
                  <button onClick={() => setZoom(z => Math.max(ZOOM_MIN, +(z - 0.25).toFixed(2)))} disabled={zoom <= ZOOM_MIN} title="Zoom out" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white disabled:opacity-40"><ZoomOut size={16} /></button>
                  <button onClick={() => setZoom(1)} title="Fit to screen" className="min-w-[58px] h-8 px-2 rounded-lg text-xs font-black text-slate-700 hover:bg-white">{zoom === 1 ? 'Fit' : `${Math.round(zoom * 100)}%`}</button>
                  <button onClick={() => setZoom(z => Math.min(ZOOM_MAX, +(z + 0.25).toFixed(2)))} disabled={zoom >= ZOOM_MAX} title="Zoom in" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white disabled:opacity-40"><ZoomIn size={16} /></button>
                  {zoom !== 1 && <button onClick={() => setZoom(1)} title="Back to fit" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white"><Maximize2 size={15} /></button>}
                </div>
              </div>
              {/* Scrollable stage: m-auto centres the poster at Fit and lets it scroll when zoomed in */}
              <div
                className="flex-1 min-h-0 overflow-auto flex p-4 md:p-6 [scrollbar-width:thin]"
                onPointerDown={e => { if (e.target === e.currentTarget) setSelectedId(null); }}
                ref={stageRef}
              >
                <div className="m-auto shrink-0" style={{ width: `calc(min(100%, calc((100vh - 320px) * ${FORMATS[format].w / FORMATS[format].h}), ${format === 'landscape' ? 900 : 680}px) * ${zoom})` }}>
                  <PosterPreview
                    ref={posterRef}
                    data={data}
                    style={style}
                    format={format}
                    elements={elements}
                    selectedId={downloading ? null : selectedId}
                    onElementPointer={onElementPointer}
                    onSurfaceClick={onSurfaceClick}
                    className="rounded-xl shadow-xl ring-1 ring-slate-200 select-none"
                  />
                </div>
              </div>
              <p className="px-4 py-2.5 border-t border-slate-200/70 text-[11px] font-semibold text-slate-400 text-center bg-white/60">Click text or the photo to edit · drag stickers to move · Ctrl + scroll to zoom</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const viewTabs = (
    <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
      {([['templates', 'Templates', LayoutGrid], ['library', `My library${drafts ? ` (${drafts.length})` : ''}`, Library]] as const).map(([k, label, Icon]) => (
        <button key={k} onClick={() => setView(k)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${view === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Icon size={16} /> {label}
        </button>
      ))}
    </div>
  );

  // ───────────── My library ─────────────
  if (view === 'library') {
    return (
      <div className="animate-in fade-in duration-300 pb-20">
        {viewTabs}
        <div className="mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My library</h2>
          <p className="text-slate-500 mt-2 font-medium text-sm max-w-2xl">Posters you saved while editing. Open one to keep working on it, then download when it's ready.</p>
        </div>
        {drafts === null ? (
          <div className="py-20 text-center text-slate-400 font-bold">Loading your posters...</div>
        ) : drafts.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/60">
            <FolderOpen size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 font-black text-slate-700">No saved posters yet</p>
            <p className="mt-1 text-sm text-slate-500">Open a template, edit it and press <span className="font-bold">Save draft</span> (or Ctrl + S).</p>
            <button onClick={() => setView('templates')} className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-black shadow-md">Browse templates</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {drafts.map(d => (
              <div key={d.id} className="group relative">
                <button onClick={() => openDraft(d.id)} className="block w-full text-left">
                  <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all bg-white flex items-center justify-center" style={{ aspectRatio: `${FORMATS[d.format]?.w || 1} / ${FORMATS[d.format]?.h || 1}` }}>
                    {d.thumbnail ? <img src={d.thumbnail} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-300" />}
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-700 truncate">{d.name}</p>
                  <p className="text-[11px] font-semibold text-slate-400">Edited {timeAgo(d.updated_at)}</p>
                </button>
                <button onClick={() => deleteDraft(d)} title="Delete draft" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center text-slate-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ───────────── Gallery ─────────────
  return (
    <div className="animate-in fade-in duration-300 pb-20">
      {viewTabs}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-700 text-xs font-black uppercase tracking-wider mb-3">
          <LayoutGrid size={14} className="text-orange-500" /> {POSTER_TEMPLATES.length} templates
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pick a poster, make it yours</h2>
        <p className="text-slate-500 mt-2 font-medium text-sm max-w-2xl">{look === 'kerala' ? 'Malayalam ad posters for your business: interiors, builders, shops, clinics, courses, food and more.' : 'Onam, Vishu, festivals, offers, menus, openings, wishes and notices.'} Edit every word, colour, font and photo, then download.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {([['all', 'All styles'], ['kerala', 'Creative ads'], ['modern', 'Modern & trending'], ['classic', 'Classic']] as const).map(([k, label]) => (
          <button key={k} onClick={() => { setLook(k); setGroup('All'); setCategory('all'); setShown(PAGE); }} className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${look === k ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={e => { setQuery(e.target.value); setShown(PAGE); }} placeholder={look === 'kerala' ? 'Search: interior, builders, sale, clinic, food...' : 'Search: onam, sale, menu, birthday...'} className={`${inputCls} pl-10`} />
        </div>
        <div className="flex p-1 bg-slate-200/50 rounded-xl border border-slate-200/60 overflow-x-auto">
          {(groups.length > 1 ? ['All', ...groups] : []).map(g => (
            <button key={g} onClick={() => { setGroup(g); setCategory('all'); setShown(PAGE); }} className={`px-4 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all ${group === g ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{g}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 [scrollbar-width:thin]">
        <button onClick={() => { setCategory('all'); setShown(PAGE); }} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border ${category === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>All</button>
        {visibleCategories.map(c => (
          <button key={c.key} onClick={() => { setCategory(c.key); setShown(PAGE); }} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border ${category === c.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{c.label}</button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center text-slate-400 font-bold">No templates match “{query}”.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.slice(0, shown).map(t => (
              <button key={t.id} onClick={() => openTemplate(t)} className="group text-left">
                <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all bg-white">
                  <PosterPreview data={{ ...t.data, image: t.data.image.replace('w=1200', 'w=480') }} style={t.style} format="square" />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-700 truncate">{t.name}</p>
              </button>
            ))}
          </div>
          {shown < results.length && (
            <div className="text-center mt-8">
              <button onClick={() => setShown(s => s + PAGE)} className="px-6 py-3 rounded-xl bg-white border border-slate-200 font-black text-sm text-slate-700 hover:bg-slate-50">
                Show more ({results.length - shown} left)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
