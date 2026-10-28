import { useEffect } from 'react';
import { collectContentText } from '../utils/contentPatch';

// Text nodes this hook rewrote: the theme's own wording, and what is shown instead
const replaced = new WeakMap<Text, { original: string; shown: string }>();
// Pictures it swapped: the theme's own image address, and the site's image
const swapped = new WeakMap<HTMLElement, { original: string; shown: string }>();

/** The theme's own wording of a label the site has replaced, or undefined. */
export function originalLabel(node: Text): string | undefined {
  const entry = replaced.get(node);
  return entry && node.nodeValue?.trim() === entry.shown ? entry.original : undefined;
}

/** The theme's own image address of a picture the site has replaced, or undefined. */
export function originalImage(el: Element): string | undefined {
  return swapped.get(el as HTMLElement)?.original;
}

const cssUrl = (backgroundImage: string) => /url\(["']?(.*?)["']?\)/.exec(backgroundImage)?.[1] || '';

/**
 * Shows the site's own wording and pictures in place of a theme's built-in ones ("Our Story",
 * stock photos...), stored in settings_json.text_overrides / image_overrides as
 * { "theme original": "site's version" }. Themes don't know about it: matching text nodes and
 * images are rewritten after render, and again whenever the page re-renders. Text and images
 * that come from the site content are left alone.
 */
export default function useTextOverrides(settings: { text_overrides?: Record<string, string>; image_overrides?: Record<string, string> } | undefined, content: unknown) {
  const key = JSON.stringify([settings?.text_overrides || {}, settings?.image_overrides || {}]);
  useEffect(() => {
    const [wording, pictures]: Record<string, string>[] = JSON.parse(key);
    if (!Object.keys(wording).length && !Object.keys(pictures).length) return;
    const contentTexts = collectContentText(content);
    const touched = new Set<Text>();
    const touchedImages = new Set<HTMLElement>();

    const fixImage = (el: HTMLElement) => {
      const entry = swapped.get(el);
      const isImg = el instanceof HTMLImageElement;
      const current = isImg ? el.getAttribute('src') || '' : cssUrl(el.style.backgroundImage || getComputedStyle(el).backgroundImage);
      if (entry && current === entry.shown && pictures[entry.original] === entry.shown) return;
      const original = entry && current === entry.shown ? entry.original : current;
      const shown = pictures[original];
      if (!original || shown === undefined || contentTexts.has(original)) return;
      if (isImg) {
        el.setAttribute('src', shown);
        el.removeAttribute('srcset');
      } else {
        el.style.backgroundImage = `url("${shown}")`;
      }
      swapped.set(el, { original, shown });
      touchedImages.add(el);
    };

    const fix = (node: Text) => {
      const current = node.nodeValue || '';
      const text = current.trim();
      if (!text) return;
      const entry = replaced.get(node);
      // Still showing our replacement: nothing to do
      if (entry && text === entry.shown && wording[entry.original] === entry.shown) return;
      const original = entry && text === entry.shown ? entry.original : text;
      if (contentTexts.has(original) || node.parentElement?.closest('[data-inline-editor], script, style, textarea')) return;
      const shown = wording[original];
      if (shown === undefined) return;
      node.nodeValue = current.replace(text, shown);
      replaced.set(node, { original, shown });
      touched.add(node);
    };

    const sweep = () => {
      if (Object.keys(wording).length) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) fix(n as Text);
      }
      if (Object.keys(pictures).length) {
        // Backgrounds: only elements that set one inline or with a Tailwind bg-[url(...)] class
        document.querySelectorAll<HTMLElement>('img, [style*="url("], [class*="bg-[url"]').forEach((el) => {
          if (!el.closest('[data-inline-editor]')) fixImage(el);
        });
      }
    };
    sweep();
    // Right after each re-render, before it is painted, so the theme's wording never flashes.
    // The sweep's own writes cause one more (no-op) pass.
    let queued = false;
    let active = true;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => { queued = false; if (active) sweep(); });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['src', 'style'] });
    return () => {
      observer.disconnect();
      active = false;
      // Put the theme's wording back; the next run applies the current replacements
      touched.forEach((node) => {
        const entry = replaced.get(node);
        if (entry && node.nodeValue?.trim() === entry.shown) node.nodeValue = node.nodeValue.replace(entry.shown, entry.original);
        replaced.delete(node);
      });
      touchedImages.forEach((el) => {
        const entry = swapped.get(el);
        if (entry && el instanceof HTMLImageElement) el.setAttribute('src', entry.original);
        else if (entry) el.style.backgroundImage = `url("${entry.original}")`;
        swapped.delete(el);
      });
    };
  }, [key, content]);
}
