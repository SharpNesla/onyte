import { type Accessor, createSignal } from 'solid-js';
import { clamp } from '../utils/clamp.js';

export interface CreateCounterOptions {
  min?: number;
  max?: number;
}

export interface CreateCounterHandlers {
  increment: () => void;
  decrement: () => void;
  set: (value: number) => void;
  reset: () => void;
}

export type CreateCounterReturnValue = [Accessor<number>, CreateCounterHandlers];

export function createCounter(
  initialValue = 0,
  options?: CreateCounterOptions
): CreateCounterReturnValue {
  const min = options?.min ?? -Infinity;
  const max = options?.max ?? Infinity;
  const [count, setCount] = createSignal(clamp(initialValue, min, max));

  const increment = () => setCount((current) => clamp(current + 1, min, max));
  const decrement = () => setCount((current) => clamp(current - 1, min, max));
  const set = (value: number) => setCount(clamp(value, min, max));
  const reset = () => setCount(clamp(initialValue, min, max));

  return [count, { increment, decrement, set, reset }];
}
