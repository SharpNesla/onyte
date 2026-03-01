import { type Accessor, createEffect, createSignal } from 'solid-js';
import { createWindowEventListener } from '../create-window-event-listener/index.js';

export interface ViewportSize {
  width: number;
  height: number;
}

const eventListenerOptions: AddEventListenerOptions = {
  passive: true,
};

export function createViewportSize(): Accessor<ViewportSize> {
  const [size, setSize] = createSignal<ViewportSize>({ width: 0, height: 0 });

  const updateSize = () => {
    setSize({ width: window.innerWidth || 0, height: window.innerHeight || 0 });
  };

  createWindowEventListener('resize', updateSize, eventListenerOptions);
  createWindowEventListener('orientationchange', updateSize, eventListenerOptions);

  createEffect(() => {
    updateSize();
  });

  return size;
}
