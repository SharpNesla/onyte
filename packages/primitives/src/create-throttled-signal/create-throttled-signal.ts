import { type Accessor, createSignal, onCleanup } from 'solid-js';
import { createThrottledCallbackWithClearTimeout } from '../create-throttled-callback/create-throttled-callback.js';

export function createThrottledSignal<T = any>(
  defaultValue: T,
  wait: number
): [Accessor<T>, (value: T) => void] {
  const [value, setValue] = createSignal<T>(defaultValue);

  const [setThrottledValue, clearTimer] = createThrottledCallbackWithClearTimeout(
    (v: T) => setValue(() => v),
    wait
  );

  onCleanup(clearTimer);

  return [value, setThrottledValue];
}
