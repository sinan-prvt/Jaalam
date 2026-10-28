import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { collectContentText, type InlineEdit } from '../../utils/contentPatch';
import { originalImage, originalLabel } from '../../hooks/useTextOverrides';
import { apiError } from '../../utils/apiError';

interface InlineTextEditorProps {
  content: unknown;
  onEdit: (edits: InlineEdit[]) => void;
}

interface Target {
  node: Text;
  text: string;
  rect: DOMRect;
  // The theme's own wording when this is a built-in label rather than content text
  label?: string;
}

interface ImageTarget {
  el: Element;
  url: string;
  rect: DOMRect;
  // The theme's own picture (rather than one from the site content)
  themeImage?: string;
}

interface Editing extends Target {
  style: React.CSSProperties;
  multiline: boolean;
}

// The platform credit stays as it is ("Remove branding" is a plan feature)
const BRANDING = /jaalam/i;

/**
 * Click-to-edit for any theme in the editor's live preview, with no editing code in the themes:
 * - text that is one of the site's content strings edits that content field;
 * - any other text is a theme label, and gets a per-site replacement (see useTextOverrides);
 * - any picture can be replaced by uploading a new one (a content image, or a per-site
 *   replacement for one of the theme's own).
 * Changes are sent to the editor as content edits, and the preview re-renders from there.
 */
export default function InlineTextEditor({ content, onEdit }: InlineTextEditorProps) {
  const texts = useMemo(() => collectContentText(content), [content]);
  const [hover, setHover] = useState<Target | null>(null);
  const [imageHover, setImageHover] = useState<ImageTarget | null>(null);
  const [uploading, setUploading] = useState<ImageTarget | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const pickingRef = useRef<ImageTarget | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [draft, setDraft] = useState('');
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const editingRef = useRef(editing);
  useEffect(() => { editingRef.current = editing; }, [editing]);
  // Off: the preview behaves like the live site (links, buttons, invitation covers)
  const [enabled, setEnabled] = useState(() => {
    try { return sessionStorage.getItem('inline-edit') !== 'off'; } catch { return true; }
  });
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
    try { sessionStorage.setItem('inline-edit', enabled ? 'on' : 'off'); } catch { /* storage blocked */ }
  }, [enabled]);

  // Text under the pointer, or null
  const hitTest = (x: number, y: number): Target | null => {
    const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null };
    const node = doc.caretRangeFromPoint?.(x, y)?.startContainer ?? doc.caretPositionFromPoint?.(x, y)?.offsetNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.nodeValue?.trim() || '';
    if (!text || BRANDING.test(text)) return null;
    if (node.parentElement?.closest('[contenteditable="true"], input, textarea, select, option, script, style, [data-inline-editor]')) return null;
    const range = document.createRange();
    range.selectNodeContents(node);
    // caretRangeFromPoint also answers for points beside the text: only count a hit on the text itself
    if (![...range.getClientRects()].some(r => x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2)) return null;
    const rect = range.getBoundingClientRect();
    const label = originalLabel(node as Text);
    if (label) return { node: node as Text, text, rect, label };
    if (texts.has(text)) return { node: node as Text, text, rect };
    // A theme label: only real words (not countdown digits or separators)
    if (!/\p{L}/u.test(text)) return null;
    return { node: node as Text, text, rect, label: text };
  };

  // Picture under the pointer (an <img> or a CSS background), or null
  const imageAt = (x: number, y: number): ImageTarget | null => {
    const inContent = (url: string) => [url, url.replace(window.location.origin, '')].find(u => texts.has(u));
    for (const el of document.elementsFromPoint(x, y).slice(0, 8)) {
      if (el.closest('[data-inline-editor]')) return null;
      const src = el instanceof HTMLImageElement ? el.getAttribute('src') || '' : '';
      // Backgrounds as useTextOverrides finds them, so a replaced one always shows
      const bgEl = !src && el instanceof HTMLElement && el.matches('[style*="url("], [class*="bg-[url"]') ? el : null;
      const bg = bgEl ? /url\(["']?(.*?)["']?\)/.exec(bgEl.style.backgroundImage || getComputedStyle(bgEl).backgroundImage)?.[1] || '' : '';
      const found = src || bg;
      if (!found || found.startsWith('data:')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) continue;  // icons and logos marks
      const theme = originalImage(el);
      if (theme) return { el, url: found, rect, themeImage: theme };
      const url = inContent(found);
      if (url) return { el, url, rect };
      return { el, url: found, rect, themeImage: found };
    }
    return null;
  };

  const startEditing = (target: Target) => {
    const el = target.node.parentElement!;
    const css = getComputedStyle(el);
    // Cover the original text with the nearest solid background, or a white box over photos
    let background = '';
    for (let p: HTMLElement | null = el; p; p = p.parentElement) {
      const bg = getComputedStyle(p);
      if (bg.backgroundImage !== 'none') break;
      if (bg.backgroundColor && !/rgba\(.*,\s*0\)|transparent/.test(bg.backgroundColor)) { background = bg.backgroundColor; break; }
    }
    const lineHeight = parseFloat(css.lineHeight) || parseFloat(css.fontSize) * 1.3;
    setHover(null);
    setDraft(target.text);
    setEditing({
      ...target,
      multiline: target.text.includes('\n') || target.rect.height > lineHeight * 1.5,
      style: {
        fontFamily: css.fontFamily,
        fontSize: css.fontSize,
        fontWeight: css.fontWeight,
        fontStyle: css.fontStyle,
        letterSpacing: css.letterSpacing,
        lineHeight: css.lineHeight,
        textTransform: css.textTransform as React.CSSProperties['textTransform'],
        textAlign: css.textAlign as React.CSSProperties['textAlign'],
        color: background ? css.color : '#0f172a',
        background: background || 'rgba(255,255,255,0.97)',
      },
    });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (editingRef.current || !enabledRef.current) return;
      const text = hitTest(e.clientX, e.clientY);
      setHover(text);
      setImageHover(text ? null : imageAt(e.clientX, e.clientY));
    };
    const onClick = (e: MouseEvent) => {
      if (editingRef.current || !enabledRef.current) return;
      const target = hitTest(e.clientX, e.clientY);
      const image = target ? null : imageAt(e.clientX, e.clientY);
      if (!target && !image) return;
      // Don't follow links or run the theme's own click handlers for what is being edited
      e.preventDefault();
      e.stopPropagation();
      if (target) startEditing(target);
      else if (image) { pickingRef.current = image; setUploadError(''); fileRef.current?.click(); }
    };
    const onScroll = () => {
      setHover(null);
      setImageHover(null);
      const current = editingRef.current;
      if (current && current.node.isConnected) {
        const range = document.createRange();
        range.selectNodeContents(current.node);
        setEditing({ ...current, rect: range.getBoundingClientRect() });
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('click', onClick, true);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [texts]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !editing) return;
    box.focus();
    box.select();
  }, [editing?.node]); // eslint-disable-line react-hooks/exhaustive-deps

  // Grow with the text
  useEffect(() => {
    const box = boxRef.current;
    if (box) { box.style.height = 'auto'; box.style.height = `${box.scrollHeight}px`; }
  }, [draft, editing]);

  const finish = (save: boolean) => {
    const current = editingRef.current;
    if (!current) return;
    setEditing(null);
    const next = draft.trim();
    if (!save || !next || next === current.text) return;
    if (current.label) { onEdit([{ label: current.label, to: next }]); return; }
    const places = texts.get(current.text) || [];
    // Keep any spacing the stored text had around it
    onEdit(places.map(({ path, raw }) => ({ path, from: raw, to: raw.replace(current.text, next) })));
  };

  const uploadImage = async (file: File) => {
    const image = pickingRef.current;
    pickingRef.current = null;
    if (!image) return;
    setUploading(image);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await axios.post('/api/websites/upload/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (image.themeImage) { onEdit([{ label: image.themeImage, to: res.data.url, image: true }]); return; }
      const places = texts.get(image.url) || [];
      onEdit(places.map(({ path, raw }) => ({ path, from: raw, to: res.data.url })));
    } catch (err) {
      setUploadError(apiError(err, 'Upload failed. Please try another image.'));
      setTimeout(() => setUploadError(''), 4000);
    } finally {
      setUploading(null);
    }
  };

  const rect = editing?.rect ?? hover?.rect;
  const pad = 6;
  const imageBox = uploading ?? imageHover;

  return (
    <>
      <button
        type="button"
        data-inline-editor
        onClick={() => { setEnabled(v => !v); setHover(null); setImageHover(null); }}
        className={`fixed top-2 left-1/2 -translate-x-1/2 z-[2147483647] rounded-full px-3 py-1 font-sans text-[11px] font-bold normal-case tracking-normal shadow-lg transition-colors ${enabled ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-600 ring-1 ring-slate-200'}`}
        title={enabled ? 'Turn off to click links and buttons like a visitor' : 'Turn on to click any text or image to change it'}
      >
        {enabled ? '✎ Edit mode on' : '✎ Edit mode off'}
      </button>
      <input
        ref={fileRef}
        data-inline-editor
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) uploadImage(file); }}
      />
      {imageBox && !editing && !hover && (
        <div
          data-inline-editor
          className="fixed pointer-events-none z-[2147483646] rounded-md border-2 border-dashed border-emerald-500 bg-emerald-500/10"
          style={{ left: imageBox.rect.left, top: imageBox.rect.top, width: imageBox.rect.width, height: imageBox.rect.height }}
        >
          <span className="absolute top-2 left-2 whitespace-nowrap rounded bg-emerald-600 px-1.5 py-0.5 font-sans text-[10px] font-bold normal-case tracking-normal text-white shadow">
            {uploading ? 'Uploading…' : 'Click to change image'}
          </span>
        </div>
      )}
      {uploadError && (
        <div data-inline-editor className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2147483647] rounded-lg bg-rose-600 px-3 py-2 font-sans text-xs font-bold text-white shadow-xl">
          {uploadError}
        </div>
      )}
      {hover && !editing && rect && (
        <div
          data-inline-editor
          className="fixed pointer-events-none z-[2147483646] rounded-md border-2 border-dashed border-indigo-500 bg-indigo-500/5"
          style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
        >
          <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-indigo-600 px-1.5 py-0.5 font-sans text-[10px] font-bold normal-case tracking-normal text-white shadow">
            {hover.label ? 'Click to edit · changes this label everywhere' : 'Click to edit'}
          </span>
        </div>
      )}
      {editing && rect && (
        <div
          data-inline-editor
          className="fixed z-[2147483647]"
          style={{ left: rect.left - pad, top: rect.top - pad, width: Math.max(rect.width + pad * 2, 160) }}
        >
          <textarea
            ref={boxRef}
            value={draft}
            rows={1}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => finish(true)}
            onKeyDown={e => {
              if (e.key === 'Escape') { e.preventDefault(); finish(false); }
              else if (e.key === 'Enter' && (!editing.multiline || e.ctrlKey || e.metaKey)) { e.preventDefault(); finish(true); }
            }}
            className="block w-full resize-none overflow-hidden rounded-md p-1.5 outline-none ring-2 ring-indigo-500 shadow-xl"
            style={editing.style}
          />
          <div className="mt-1 inline-block rounded bg-slate-900/90 px-1.5 py-0.5 font-sans text-[10px] font-medium text-white">
            {editing.multiline ? 'Ctrl+Enter to save' : 'Enter to save'} · Esc to cancel
          </div>
        </div>
      )}
    </>
  );
}
