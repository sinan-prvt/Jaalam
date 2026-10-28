/** One text change made by clicking on the live preview (see InlineTextEditor). */
export interface InlineEdit {
  path: (string | number)[];
  from: string;
  to: string;
}

/** Every string in the site content with where it lives, keyed by its trimmed text. */
export function collectContentText(content: unknown): Map<string, { path: (string | number)[]; raw: string }[]> {
  const found = new Map<string, { path: (string | number)[]; raw: string }[]>();
  const walk = (value: unknown, path: (string | number)[]) => {
    if (typeof value === 'string') {
      const key = value.trim();
      if (key) found.set(key, [...(found.get(key) || []), { path, raw: value }]);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, [...path, i]));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => walk(v, [...path, k]));
    }
  };
  walk(content, []);
  return found;
}

/**
 * Applies inline edits to the editor's own content. An edit is skipped when the field no longer
 * holds the text the preview showed (e.g. the address, which the preview flattens to one line).
 */
export function applyInlineEdits<T>(content: T, edits: InlineEdit[]): T {
  const next = structuredClone(content);
  for (const { path, from, to } of edits) {
    let parent: unknown = next;
    for (const key of path.slice(0, -1)) {
      parent = (parent as Record<string | number, unknown> | null)?.[key];
      if (!parent || typeof parent !== 'object') break;
    }
    const last = path[path.length - 1];
    const holder = parent as Record<string | number, unknown> | null;
    if (holder && typeof holder === 'object' && holder[last] === from) holder[last] = to;
  }
  return next;
}
