import { createEffect, onCleanup } from 'solid-js';

export function createWindowEventListener<K extends string>(
  type: K,
  listener: K extends keyof WindowEventMap
    ? (this: Window, ev: WindowEventMap[K]) => void
    : (this: Window, ev: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions
) {
  createEffect(() => {
    window.addEventListener(type as string, listener as EventListener, options);
    onCleanup(() => window.removeEventListener(type as string, listener as EventListener, options));
  });
}
