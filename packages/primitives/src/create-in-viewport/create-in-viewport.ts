import { type Accessor, createSignal, onCleanup } from 'solid-js';

export interface CreateInViewportReturnValue {
  inViewport: Accessor<boolean>;
  ref: (element: HTMLElement) => void;
}

export function createInViewport(): CreateInViewportReturnValue {
  let observer: IntersectionObserver | null = null;
  const [inViewport, setInViewport] = createSignal(false);

  onCleanup(() => {
    observer?.disconnect();
  });

  const ref = (element: HTMLElement) => {
    if (typeof IntersectionObserver !== 'undefined') {
      if (observer) {
        observer.disconnect();
      }

      if (element) {
        observer = new IntersectionObserver((entries) => {
          // Entries might be batched (e.g. when scrolling very fast), so we need to use the last entry to get the most recent state
          const lastEntry = entries[entries.length - 1]!;
          setInViewport(lastEntry.isIntersecting);
        });
        observer.observe(element);
      } else {
        setInViewport(false);
      }
    }

    onCleanup(() => {
      observer?.disconnect();
    });
  };

  return { ref, inViewport };
}
