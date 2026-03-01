import { type Accessor, createSignal, onCleanup } from 'solid-js';

export interface CreateDebouncedSignalOptions {
  leading?: boolean;
}

export type CreateDebouncedSignalReturnValue<T> = [Accessor<T>, (newValue: T | ((prev: T) => T)) => void];

export function createDebouncedSignal<T = any>(
  defaultValue: T,
  wait: number,
  options: CreateDebouncedSignalOptions = { leading: false }
): CreateDebouncedSignalReturnValue<T> {
  const [value, setValue] = createSignal<T>(defaultValue);
  let timeoutRef: number | null = null;
  let leadingRef = true;

  const clearTimer = () => {
    if (timeoutRef !== null) {
      window.clearTimeout(timeoutRef);
      timeoutRef = null;
    }
  };

  onCleanup(clearTimer);

  const debouncedSetValue = (newValue: T | ((prev: T) => T)) => {
    clearTimer();
    if (leadingRef && options.leading) {
      setValue(newValue as any);
    } else {
      timeoutRef = window.setTimeout(() => {
        leadingRef = true;
        setValue(newValue as any);
      }, wait);
    }
    leadingRef = false;
  };

  return [value, debouncedSetValue];
}
