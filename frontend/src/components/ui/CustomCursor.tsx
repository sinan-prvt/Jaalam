import React, { useEffect, useRef } from 'react';

/*
  Lightweight custom cursor.
  - Renders only on mouse/trackpad devices.
  - rAF runs only when the mouse actually moves (no idle 60fps loop).
  - No mix-blend-mode (that forced the whole page to re-composite every frame),
    no getComputedStyle on hover, no CSS transition lag on position.
*/
const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = cursorRef.current;
    if (!el) return;

    let x = -100;
    let y = -100;
    let hovering = false;
    let raf = 0;

    const render = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
      el.dataset.hovering = hovering ? 'true' : 'false';
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = '1';
      schedule();
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      hovering = !!t?.closest?.('a, button, [role="button"], select, label, summary');
      schedule();
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      data-hovering="false"
      className="group pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 [@media(pointer:fine)]:block"
      style={{ opacity: 0, willChange: 'transform', transform: 'translate3d(-100px,-100px,0)' }}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full border-[1.5px] border-[#d08757] shadow-[0_0_0_1px_rgba(255,255,255,0.7)] transition-transform duration-150 ease-out group-data-[hovering=true]:scale-150 group-data-[hovering=true]:bg-[#e49b6b]/15">
        <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a1a] transition-transform duration-150 group-data-[hovering=true]:scale-0" />
      </div>
    </div>
  );
};

export default CustomCursor;
