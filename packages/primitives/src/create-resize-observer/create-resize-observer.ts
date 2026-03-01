import { type Accessor, createSignal, onCleanup } from 'solid-js';

export type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

export interface CreateResizeObserverReturnValue {
  ref: (element: HTMLElement) => void;
  rect: Accessor<ObserverRect>;
}

export function createResizeObserver<T extends HTMLElement = any>(
  options?: ResizeObserverOptions
): CreateResizeObserverReturnValue {
  let frameID = 0;
  let node: T | null = null;
  const [rect, setRect] = createSignal<ObserverRect>(defaultState);

  const observer =
    typeof window !== 'undefined'
      ? new ResizeObserver((entries) => {
          const entry = entries[0];

          if (entry) {
            cancelAnimationFrame(frameID);

            frameID = requestAnimationFrame(() => {
              if (node) {
                const boxSize = entry.borderBoxSize?.[0] || entry.contentBoxSize?.[0];
                if (boxSize) {
                  const width = boxSize.inlineSize;
                  const height = boxSize.blockSize;

                  setRect({
                    width,
                    height,
                    x: entry.contentRect.x,
                    y: entry.contentRect.y,
                    top: entry.contentRect.top,
                    left: entry.contentRect.left,
                    bottom: entry.contentRect.bottom,
                    right: entry.contentRect.right,
                  });
                } else {
                  setRect(entry.contentRect);
                }
              }
            });
          }
        })
      : null;

  onCleanup(() => {
    observer?.disconnect();
    if (frameID) {
      cancelAnimationFrame(frameID);
    }
  });

  const ref = (element: T) => {
    // Disconnect from previous element
    if (node) {
      observer?.unobserve(node);
    }

    node = element;

    if (node) {
      observer?.observe(node, options);
    }

    onCleanup(() => {
      if (node) {
        observer?.unobserve(node);
      }
    });
  };

  return { ref: ref as (element: HTMLElement) => void, rect };
}
