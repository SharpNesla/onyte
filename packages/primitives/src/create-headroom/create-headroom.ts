import { type Accessor, createEffect, createMemo, createSignal, on, onCleanup } from 'solid-js';

function createScrollDirection(): Accessor<boolean> {
  const [lastScrollTop, setLastScrollTop] = createSignal(0);
  const [isScrollingUp, setIsScrollingUp] = createSignal(false);
  const [isResizing, setIsResizing] = createSignal(false);
  let resizeTimer: number | undefined;

  const onResize = () => {
    setIsResizing(true);
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => setIsResizing(false), 300);
  };

  const onScroll = () => {
    if (isResizing()) return;
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    setIsScrollingUp(currentScrollTop < lastScrollTop());
    setLastScrollTop(currentScrollTop);
  };

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);

  onCleanup(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    clearTimeout(resizeTimer);
  });

  return isScrollingUp;
}

export interface CreateHeadroomOptions {
  fixedAt?: number;
  onPin?: () => void;
  onFix?: () => void;
  onRelease?: () => void;
}

export function createHeadroom({
  fixedAt = 0,
  onPin,
  onFix,
  onRelease,
}: CreateHeadroomOptions = {}): Accessor<boolean> {
  const isScrollingUp = createScrollDirection();
  const [scrollY, setScrollY] = createSignal(
    typeof window !== 'undefined' ? window.scrollY : 0
  );

  let isCurrentlyPinned = false;

  const onScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', onScroll, { passive: true });
  onCleanup(() => window.removeEventListener('scroll', onScroll));

  createEffect(
    on(scrollY, (y) => {
      const isFixed = y <= fixedAt;

      if (isFixed && !isCurrentlyPinned) {
        isCurrentlyPinned = true;
        onPin?.();
      } else if (!isFixed && isScrollingUp() && !isCurrentlyPinned) {
        isCurrentlyPinned = true;
        onPin?.();
      } else if (!isFixed && isCurrentlyPinned && !isScrollingUp()) {
        isCurrentlyPinned = false;
        onRelease?.();
      }

      if (isFixed) {
        onFix?.();
      }
    })
  );

  return createMemo(() => scrollY() <= fixedAt || isScrollingUp());
}
