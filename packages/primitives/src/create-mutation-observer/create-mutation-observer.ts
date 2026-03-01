import { createEffect, onCleanup } from 'solid-js';

export function createMutationObserver<T extends HTMLElement = any>(
  callback: MutationCallback,
  options: MutationObserverInit,
  target?: HTMLElement | (() => HTMLElement) | null
): (element: T) => void {
  let observer: MutationObserver | null = null;
  let node: T | null = null;

  const observe = () => {
    observer?.disconnect();

    const targetElement = typeof target === 'function' ? target() : target;
    const elementToObserve = targetElement || node;

    if (elementToObserve) {
      observer = new MutationObserver(callback);
      observer.observe(elementToObserve, options);
    }
  };

  createEffect(() => {
    observe();

    onCleanup(() => {
      observer?.disconnect();
    });
  });

  const ref = (element: T) => {
    node = element;
    observe();

    onCleanup(() => {
      observer?.disconnect();
    });
  };

  return ref;
}
