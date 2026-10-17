import { useEffect } from 'react';

// "Powered by Jaalam", "Designed with Jaalam", "Made with love by Jaalam",
// "Crafted with ♥ by Jaalam", "Crafted on Jaalam"...
const CREDIT = /^(powered by|designed with|made with( love)? by|crafted (on|with .{0,3} by)|built with)\s*jaalam\.?$/i;

/**
 * Hides the theme's Jaalam credit when the site owner's plan includes "Remove branding".
 * Themes word and place the credit differently, so this finds the smallest element whose
 * whole text is the credit, and keeps doing so as the page re-renders.
 */
export default function useHideBranding(hide: boolean) {
  useEffect(() => {
    if (!hide) return;
    const sweep = () => {
      document.querySelectorAll<HTMLElement>('footer p, footer span, footer div, p, span').forEach((el) => {
        if (el.dataset.brandingHidden) return;
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length > 60 || !CREDIT.test(text)) return;
        el.dataset.brandingHidden = '1';
        el.style.display = 'none';
      });
    };
    sweep();
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; sweep(); });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      document.querySelectorAll<HTMLElement>('[data-branding-hidden]').forEach((el) => {
        el.style.display = '';
        delete el.dataset.brandingHidden;
      });
    };
  }, [hide]);
}
