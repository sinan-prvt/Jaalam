import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth, eased page scrolling for published sites and the live preview (all themes).
 *
 * - Mouse wheel / trackpad: smoothed with Lenis (no more jumpy wheel steps).
 * - Touch screens: left to the phone's own native scrolling (already smooth, keeps momentum).
 * - In-page links (#about, #contact…) glide to their section instead of jumping.
 * - Scrollable areas inside the page (chatbot, menus, product popups) keep scrolling on their own.
 * - When a theme locks the page behind a popup (overflow: hidden), smoothing pauses.
 * - Turned off for visitors who ask their device to reduce motion.
 */
export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1, // lower = smoother/longer glide, higher = snappier
      smoothWheel: true,
      syncTouch: false, // keep native touch scrolling on phones
      anchors: { offset: -80 }, // leave room for fixed headers when jumping to #sections
      allowNestedScroll: true,
      prevent: (node: HTMLElement) =>
        !!node.closest?.('[data-lenis-prevent], .fixed.overflow-y-auto, [role="dialog"], iframe'),
    });

    // Pause smoothing while a popup has locked page scrolling.
    const html = document.documentElement;
    const body = document.body;
    const syncLock = () => {
      // Themes lock the page with an inline style (or Tailwind's overflow-hidden class) on <body>/<html>.
      const locked =
        body.style.overflow === 'hidden' ||
        html.style.overflow === 'hidden' ||
        body.classList.contains('overflow-hidden');
      if (locked && !lenis.isStopped) lenis.stop();
      else if (!locked && lenis.isStopped) lenis.start();
    };
    // Only watch <body>'s class + both inline styles: Lenis itself toggles classes on <html>.
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(body, { attributes: true, attributeFilter: ['style', 'class'] });
    lockObserver.observe(html, { attributes: true, attributeFilter: ['style'] });

    return () => {
      lockObserver.disconnect();
      lenis.destroy();
    };
  }, [enabled]);
}
