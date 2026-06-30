import React, { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  scrollContainerSelector?: string;
  onStackComplete?: () => void;
}

interface CardTransform {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  scrollContainerSelector = '',
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef<Map<number, CardTransform>>(new Map());
  const isUpdatingRef = useRef<boolean>(false);

  // Cached layout offset values to prevent layout thrashing on scroll
  const cardOffsetsRef = useRef<number[]>([]);
  const endElementOffsetRef = useRef<number>(0);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else if (scrollContainerSelector) {
      const container = document.querySelector(scrollContainerSelector) as HTMLElement;
      return {
        scrollTop: container ? container.scrollTop : 0,
        containerHeight: container ? container.clientHeight : 0,
        scrollContainer: container || document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll, scrollContainerSelector]);

  // Performance-optimized offset calculator that is independent of CSS translations
  const calculateOffsets = useCallback(() => {
    const { scrollContainer } = getScrollData();
    if (!scrollContainer) return;

    const getAbsoluteOffset = (el: HTMLElement) => {
      if (useWindowScroll) {
        let top = 0;
        let current: HTMLElement | null = el;
        while (current) {
          top += current.offsetTop;
          current = current.offsetParent as HTMLElement;
        }
        return top;
      } else {
        let top = 0;
        let current: HTMLElement | null = el;
        while (current && current !== scrollContainer) {
          top += current.offsetTop;
          current = current.offsetParent as HTMLElement;
        }
        return top;
      }
    };

    cardOffsetsRef.current = cardsRef.current.map(card => (card ? getAbsoluteOffset(card) : 0));

    const endElement = scrollContainer.querySelector('.scroll-stack-end') as HTMLElement;
    endElementOffsetRef.current = endElement ? getAbsoluteOffset(endElement) : 0;
  }, [useWindowScroll, getScrollData]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endElementOffsetRef.current;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardOffsetsRef.current[i] || 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCard = cardsRef.current[j];
          if (!jCard) continue;
          const jCardTop = cardOffsetsRef.current[j] || 0;
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollContainerSelector
        ? (document.querySelector(scrollContainerSelector) as HTMLElement)
        : scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.firstElementChild as HTMLElement || scroller,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll, scrollContainerSelector]);

  useLayoutEffect(() => {
    const scroller = scrollContainerSelector
      ? (document.querySelector(scrollContainerSelector) as HTMLElement)
      : scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller!.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      (card.style as any).webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      (card.style as any).webkitPerspective = '1000px';
    });

    setupLenis();

    // Trigger initial layout caching immediately and after a short render delay
    calculateOffsets();
    updateCardTransforms();

    const layoutTimer = setTimeout(() => {
      calculateOffsets();
      updateCardTransforms();
    }, 150);

    const handleResize = () => {
      calculateOffsets();
      updateCardTransforms();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    // Dynamic resize observer to refresh offsets if content heights change (such as dynamic images/lists)
    const resizeObserver = new ResizeObserver(() => {
      calculateOffsets();
      updateCardTransforms();
    });

    if (scroller) {
      resizeObserver.observe(scroller);
    } else if (useWindowScroll) {
      resizeObserver.observe(document.body);
    }

    return () => {
      clearTimeout(layoutTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    scrollContainerSelector,
    onStackComplete,
    setupLenis,
    calculateOffsets,
    updateCardTransforms
  ]);

  const containerStyles: React.CSSProperties = useWindowScroll || scrollContainerSelector
    ? {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }
    : {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      };

  const containerClassName = useWindowScroll || scrollContainerSelector
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  // If using selector, the outer wrapper isn't the scroller, so we render a simple wrapper.
  if (scrollContainerSelector) {
    return (
      <div className={containerClassName} style={containerStyles}>
        <div className="scroll-stack-inner pt-[10vh] px-4 pb-[20rem]">
          {children}
          <div className="scroll-stack-end w-full h-px" />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName} ref={scrollerRef} style={containerStyles}>
      <div className="scroll-stack-inner pt-[10vh] px-4 pb-[20rem]">
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
