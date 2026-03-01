import { type Accessor, createEffect, createSignal, on } from 'solid-js';

export function createPrevious<T>(value: Accessor<T>): Accessor<T | undefined> {
  const [previous, setPrevious] = createSignal<T | undefined>(undefined);

  createEffect(
    on(value, (_, prev) => {
      setPrevious(() => prev);
    })
  );

  return previous;
}
