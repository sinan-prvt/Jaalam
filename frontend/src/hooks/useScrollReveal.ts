import { useEffect } from 'react';

export default function useScrollReveal(dependencies: any[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-12');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    cxX
    CXCXCXCXCXCXcxCxcx
    c
    xcx
    CXCXCXCXCXCXcxCxcxcx
    cxcx
    cx
    cxcx
    cx
    cx
    cx
    cxcxc

    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.theme-root section');
      sections.forEach((section) => {
        // Skip hero section (should be visible immediately) and elements already handled
        if (section.id !== 'hero' && !section.classList.contains('scroll-reveal-applied')) {
          section.classList.add('opacity-0', 'translate-y-12', 'transition-all', 'duration-1000', 'transform', 'scroll-reveal-applied');
          observer.observe(section);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);
}
