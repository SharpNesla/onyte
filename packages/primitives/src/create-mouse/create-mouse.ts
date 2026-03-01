import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface CreateMouseReturnValue<T extends HTMLElement = any> {
  x: Accessor<number>;
  y: Accessor<number>;
  ref: (node: T) => void;
}

export function createMouse<T extends HTMLElement = any>(
  options: { resetOnExit?: boolean } = { resetOnExit: false }
): CreateMouseReturnValue<T> {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  let ref: T | undefined;

  const setMousePosition = (event: MouseEvent) => {
    if (ref) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

      const newX = Math.max(
        0,
        Math.round(event.pageX - rect.left - (window.scrollX || window.scrollX))
      );

      const newY = Math.max(
        0,
        Math.round(event.pageY - rect.top - (window.scrollY || window.scrollY))
      );

      setX(newX);
      setY(newY);
    } else {
      setX(event.clientX);
      setY(event.clientY);
    }
  };

  const resetMousePosition = () => {
    setX(0);
    setY(0);
  };

  createEffect(() => {
    const element: HTMLElement | Document = ref ? ref : document;
    element.addEventListener('mousemove', setMousePosition as any);
    if (options.resetOnExit) {
      element.addEventListener('mouseleave', resetMousePosition as any);
    }

    onCleanup(() => {
      element.removeEventListener('mousemove', setMousePosition as any);
      if (options.resetOnExit) {
        element.removeEventListener('mouseleave', resetMousePosition as any);
      }
    });
  });

  const setRef = (node: T) => {
    ref = node;
  };

  return { ref: setRef, x, y };
}
