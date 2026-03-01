import { type Accessor, createEffect, createSignal } from 'solid-js';
import { createWindowEventListener } from '../create-window-event-listener/index.js';

export interface WindowScrollPosition {
  x: number;
  y: number;
}

export type WindowScrollTo = (position: Partial<WindowScrollPosition>) => void;
export type CreateWindowScrollReturnValue = [Accessor<WindowScrollPosition>, WindowScrollTo];

function getScrollPosition(): WindowScrollPosition {
  return typeof window !== 'undefined'
    ? { x: window.scrollX, y: window.scrollY }
    : { x: 0, y: 0 };
}

function scrollTo({ x, y }: Partial<WindowScrollPosition>) {
  if (typeof window !== 'undefined') {
    const scrollOptions: ScrollToOptions = { behavior: 'smooth' };

    if (typeof x === 'number') {
      scrollOptions.left = x;
    }

    if (typeof y === 'number') {
      scrollOptions.top = y;
    }

    window.scrollTo(scrollOptions);
  }
}

export function createWindowScroll(): CreateWindowScrollReturnValue {
  const [position, setPosition] = createSignal<WindowScrollPosition>({ x: 0, y: 0 });

  createWindowEventListener('scroll', () => setPosition(getScrollPosition()));
  createWindowEventListener('resize', () => setPosition(getScrollPosition()));

  createEffect(() => {
    setPosition(getScrollPosition());
  });

  return [position, scrollTo];
}
