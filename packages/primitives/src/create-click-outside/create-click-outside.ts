import { createEffect, onCleanup } from 'solid-js';

type EventType = MouseEvent | TouchEvent;

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

export function createClickOutside<T extends HTMLElement = any>(
  callback: (event: EventType) => void,
  events?: string[] | null,
  nodes?: (HTMLElement | null)[]
): (node: T) => void {
  let ref: T | undefined;
  const eventsList = events || DEFAULT_EVENTS;

  createEffect(() => {
    const listener = (event: Event) => {
      const { target } = event ?? {};
      if (Array.isArray(nodes)) {
        const shouldIgnore =
          !document.body.contains(target as Node) && (target as Element)?.tagName !== 'HTML';
        const shouldTrigger = nodes.every(
          (node) => !!node && !event.composedPath().includes(node)
        );
        shouldTrigger && !shouldIgnore && callback(event as EventType);
      } else if (ref && !ref.contains(target as Node)) {
        callback(event as EventType);
      }
    };

    eventsList.forEach((fn) => document.addEventListener(fn, listener));

    onCleanup(() => {
      eventsList.forEach((fn) => document.removeEventListener(fn, listener));
    });
  });

  return (node: T) => {
    ref = node;
  };
}
