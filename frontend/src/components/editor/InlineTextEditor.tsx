import { useEffect, useMemo, useRef, useState } from 'react';
import { collectContentText, type InlineEdit } from '../../utils/contentPatch';

interface InlineTextEditorProps {
  content: unknown;
  onEdit: (edits: InlineEdit[]) => void;
}

interface Target {
  node: Text;
  text: string;
  rect: DOMRect;
}

interface Editing extends Target {
  style: React.CSSProperties;
  multiline: boolean;
}

/**
 * Click-to-edit for any theme in the editor's live preview. A piece of text is editable when it
 * is exactly one of the site's content strings, so no theme needs its own editing code: the
 * change is sent to the editor as a content edit, and the preview re-renders from there.
 */
export default function InlineTextEditor({ content, onEdit }: InlineTextEditorProps) {
  const texts = useMemo(() => collectContentText(content), [content]);
  const [hover, setHover] = useState<Target | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [draft, setDraft] = useState('');
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const editingRef = useRef(editing);
  useEffect(() => { editingRef.current = editing; }, [editing]);

  // Content text under the pointer, or null
  const hitTest = (x: number, y: number): Target | null => {
    const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null };
    const node = doc.caretRangeFromPoint?.(x, y)?.startContainer ?? doc.caretPositionFromPoint?.(x, y)?.offsetNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.nodeValue?.trim() || '';
    if (!text || !texts.has(text)) return null;
    if (node.parentElement?.closest('[contenteditable="true"], input, textarea, [data-inline-editor]')) return null;
    const range = document.createRange();
    range.selectNodeContents(node);
    // caretRangeFromPoint also answers for points beside the text: only count a hit on the text itself
    if (![...range.getClientRects()].some(r => x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2)) return null;
    return { node: node as Text, text, rect: range.getBoundingClientRect() };
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
      if (!editingRef.current) setHover(hitTest(e.clientX, e.clientY));
    };
    const onClick = (e: MouseEvent) => {
      if (editingRef.current) return;
      const target = hitTest(e.clientX, e.clientY);
      if (!target) return;
      // Don't follow links or run the theme's own click handlers for text being edited
      e.preventDefault();
      e.stopPropagation();
      startEditing(target);
    };
    const onScroll = () => {
      setHover(null);
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
    const places = texts.get(current.text) || [];
    // Keep any spacing the stored text had around it
    onEdit(places.map(({ path, raw }) => ({ path, from: raw, to: raw.replace(current.text, next) })));
  };

  const rect = editing?.rect ?? hover?.rect;
  const pad = 6;

  return (
    <>
      {hover && !editing && rect && (
        <div
          data-inline-editor
          className="fixed pointer-events-none z-[2147483646] rounded-md border-2 border-dashed border-indigo-500 bg-indigo-500/5"
          style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
        >
          <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-indigo-600 px-1.5 py-0.5 font-sans text-[10px] font-bold normal-case tracking-normal text-white shadow">
            Click to edit
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
