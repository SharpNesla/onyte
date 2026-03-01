import { type Accessor, createEffect, createSignal, on, onCleanup } from 'solid-js';
import { createThrottledCallbackWithClearTimeout } from '../create-throttled-callback/create-throttled-callback.js';

export function createThrottledValue<T>(value: Accessor<T>, wait: number): Accessor<T> {
  const [throttledValue, setThrottledValue] = createSignal<T>(value());

  const [throttledSetValue, clearTimer] = createThrottledCallbackWithClearTimeout(
    (v: T) => setThrottledValue(() => v),
    wait
  );

  createEffect(
    on(value, (val) => {
      throttledSetValue(val);
    })
  );

  onCleanup(clearTimer);

  return throttledValue;
}
