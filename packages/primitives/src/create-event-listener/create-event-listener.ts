import { onCleanup } from 'solid-js';

export function createEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = any>(
  type: K,
  listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): (node: T) => void {
  let previousNode: T | undefined;
  let previousListener: Function | undefined;

  onCleanup(() => {
    if (previousNode && previousListener) {
      previousNode.removeEventListener(type, previousListener as any, options);
    }
  });

  return (node: T) => {
    if (!node) {
      return;
    }

    if (previousNode && previousListener) {
      previousNode.removeEventListener(type, previousListener as any, options);
    }

    node.addEventListener(type, listener as any, options);
    previousNode = node;
    previousListener = listener;
  };
}
