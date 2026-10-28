/**
 * One change made by clicking on the live preview (see InlineTextEditor): a content field, or a
 * theme's own label or picture, which is stored as a per-site replacement in
 * settings_json.text_overrides / image_overrides (keyed by the theme's original).
 */
export type InlineEdit =
  | { path: (string | number)[]; from: string; to: string }
  | { label: string; to: string; image?: boolean };

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
      Object.entries(value).forEach(([k, v]) => {
        // Replacements are matched by the theme's original wording or picture, not as content
        if (!(/^(text|image)_overrides$/.test(k) && path.length === 1 && path[0] === 'settings_json')) walk(v, [...path, k]);
      });
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
  for (const edit of edits) {
    if ('label' in edit) {
      const site = next as { settings_json?: Record<string, Record<string, string>> } | null;
      if (!site || typeof site !== 'object') continue;
      const settings = (site.settings_json = { ...(site.settings_json || {}) });
      const field = edit.image ? 'image_overrides' : 'text_overrides';
      const overrides = (settings[field] = { ...(settings[field] || {}) });
      // Going back to the theme's own wording (or picture) removes the replacement
      if (edit.to === edit.label) delete overrides[edit.label];
      else overrides[edit.label] = edit.to;
      continue;
    }
    const { path, from, to } = edit;
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
