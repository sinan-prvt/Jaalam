import DOMPurify from 'dompurify';

// Site owners can add their own HTML (custom HTML, text blocks). Public sites run on the app's
// own domain, so a script in there (<script>, onerror=, javascript: links) would run with the
// visitor's Jaalam login: an owner could take over an admin's account just by being visited.
// Everything owner-written goes through here before it is put on the page.

const EMBED_HOSTS = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com|google\.com\/maps|maps\.google\.com)\//i;

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  // Video and map embeds are fine, other frames are not
  if (data.tagName === 'iframe') {
    const src = (node as Element).getAttribute('src') || '';
    if (!EMBED_HOSTS.test(src)) node.parentNode?.removeChild(node);
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function safeHtml(html: string | null | undefined): string {
  return DOMPurify.sanitize(html || '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target'],
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'object', 'embed', 'base', 'meta', 'link'],
  });
}
