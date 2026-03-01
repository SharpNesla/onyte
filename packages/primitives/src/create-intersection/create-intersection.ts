import { type Accessor, createSignal, onCleanup } from 'solid-js';

export interface CreateIntersectionReturnValue {
  ref: (element: HTMLElement) => void;
  entry: Accessor<IntersectionObserverEntry | null>;
}

export function createIntersection(
  options?: IntersectionObserverInit
): CreateIntersectionReturnValue {
  const [entry, setEntry] = createSignal<IntersectionObserverEntry | null>(null);
  let observer: IntersectionObserver | null = null;

  onCleanup(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });

  const ref = (element: HTMLElement) => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (!element) {
      setEntry(null);
      return;
    }

    observer = new IntersectionObserver(([_entry]) => {
      setEntry(_entry ?? null);
    }, options);

    observer.observe(element);

    onCleanup(() => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });
  };

  return { ref, entry };
}
