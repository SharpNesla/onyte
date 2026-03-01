import { type Accessor, createSignal } from 'solid-js';

export type CreateToggleReturnValue<T> = [Accessor<T>, (value?: T | ((current: T) => T)) => void];

export function createToggle<T = boolean>(
  options: readonly T[] = [false, true] as unknown as T[]
): CreateToggleReturnValue<T> {
  const [state, setState] = createSignal<T[]>([...options]);

  const toggle = (value?: T | ((current: T) => T)) => {
    setState((current) => {
      const resolved = value instanceof Function ? value(current[0] as T) : (value ?? current[0] as T);
      const index = Math.abs(current.indexOf(resolved as T));
      return current.slice(index).concat(current.slice(0, index));
    });
  };

  return [() => state()[0] as T, toggle];
}
