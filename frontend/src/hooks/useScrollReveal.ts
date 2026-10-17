import { useEffect } from 'react';

/**
 * Site-wide, theme-agnostic scroll animations for published sites and the live preview.
 *
 * - Every <section> (and the <footer>) below the hero fades + slides up as it enters the viewport.
 * - Cards inside grids / wrapped rows in a revealed section appear one after another (stagger).
 * - Elements already animated by framer-motion (inline opacity/transform styles) are left alone.
 * - Sections rendered later (data loading, tab switches, editor changes) are picked up automatically.
 * - Respects "reduce motion" OS settings, and cleans up after itself so theme hover effects keep working.
 *
 * Styles live in index.css (.sr-anim / .sr-hidden / .sr-child).
 */

const SECTION_SELECTOR = 'section, footer';
const GROUP_SELECTOR = '.grid, .flex-wrap, ul';
const MAX_STAGGER_CHILDREN = 12;
const STAGGER_MS = 90;
const CLEANUP_MS = 1400;

const hasOwnMotion = (el: Element) => {
  const style = (el as HTMLElement).getAttribute('style') || '';
  return /opacity|transform/.test(style);
};

const isFirstSection = (el: Element) => {
  if (el.id === 'hero' || el.id === 'home') return true;
  const first = document.querySelector('section');
  return first === el;
};

export default function useScrollReveal(dependencies: any[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const cleanupTimers: number[] = [];

    const reveal = (section: HTMLElement) => {
      section.classList.remove('sr-hidden');
      section.querySelectorAll<HTMLElement>('.sr-child.sr-hidden').forEach((child) => child.classList.remove('sr-hidden'));

      // Hand control back to the theme's own transitions/hover effects once the entrance is done.
      const timer = window.setTimeout(() => {
        section.classList.remove('sr-anim');
        section.querySelectorAll<HTMLElement>('.sr-child').forEach((child) => {
          child.classList.remove('sr-anim', 'sr-child');
          child.style.removeProperty('--sr-delay');
        });
      }, CLEANUP_MS + MAX_STAGGER_CHILDREN * STAGGER_MS);
      cleanupTimers.push(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Very tall sections (long galleries on phones) can never reach 12% visibility,
          // so also reveal once a section covers a third of the screen.
          const coversScreen = entry.intersectionRect.height > window.innerHeight * 0.33;
          if (entry.isIntersecting && (entry.intersectionRatio >= 0.12 || coversScreen)) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: [0, 0.05, 0.12, 0.25], rootMargin: '0px 0px -60px 0px' }
    );

    const prepare = () => {
      const pendingAnim: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((section) => {
        if (section.dataset.sr) return; // already handled
        section.dataset.sr = '1';

        // Nested sections are animated by their parent.
        if (section.parentElement?.closest('[data-sr="1"].sr-hidden')) return;
        if (isFirstSection(section) || hasOwnMotion(section)) return;

        // Already on screen when the page loads: just leave it visible.
        const rect = section.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        if (alreadyVisible) return;

        // Hide first (no transition), switch the transition on after a reflow,
        // so sections don't visibly fade *out* while being prepared.
        section.classList.add('sr-hidden');
        pendingAnim.push(section);

        // Stagger the items of the first card grid / wrapped row inside this section.
        const group = Array.from(section.querySelectorAll<HTMLElement>(GROUP_SELECTOR)).find(
          (g) => g.children.length >= 2 && !hasOwnMotion(g)
        );
        if (group) {
          Array.from(group.children)
            .slice(0, MAX_STAGGER_CHILDREN)
            .forEach((child, i) => {
              const el = child as HTMLElement;
              if (hasOwnMotion(el)) return;
              el.classList.add('sr-child', 'sr-hidden');
              pendingAnim.push(el);
              el.style.setProperty('--sr-delay', `${120 + i * STAGGER_MS}ms`);
            });
        }

        observer.observe(section);
      });

      if (pendingAnim.length) {
        // Commit each element's hidden state, then enable transitions on the next frame,
        // so nothing visibly fades *out* while being prepared.
        pendingAnim.forEach((el) => void getComputedStyle(el).opacity);
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => pendingAnim.forEach((el) => el.classList.add('sr-anim')))
        );
      }
    };

    // Themes render after data arrives, and the editor re-renders often: watch for new sections.
    let scheduled = 0;
    const schedule = () => {
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(() => {
        scheduled = 0;
        prepare();
      });
    };
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    const initial = window.setTimeout(prepare, 80);

    return () => {
      window.clearTimeout(initial);
      if (scheduled) window.cancelAnimationFrame(scheduled);
      cleanupTimers.forEach((t) => window.clearTimeout(t));
      mutations.disconnect();
      observer.disconnect();
      // Never leave anything invisible behind (e.g. when the theme changes in the editor).
      document.querySelectorAll<HTMLElement>('.sr-hidden').forEach((el) => el.classList.remove('sr-hidden'));
      document.querySelectorAll<HTMLElement>('[data-sr]').forEach((el) => delete el.dataset.sr);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
