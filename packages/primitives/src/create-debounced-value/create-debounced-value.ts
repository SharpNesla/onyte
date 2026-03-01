import { type Accessor, createEffect, createSignal, on, onCleanup } from 'solid-js';

export interface CreateDebouncedValueOptions {
  leading?: boolean;
}

export type CreateDebouncedValueReturnValue<T> = [Accessor<T>, () => void];

export function createDebouncedValue<T = any>(
  value: Accessor<T>,
  wait: number,
  options: CreateDebouncedValueOptions = { leading: false }
): CreateDebouncedValueReturnValue<T> {
  const [debounced, setDebounced] = createSignal<T>(value());
  let timeoutRef: number | null = null;
  let cooldownRef = false;
  let mounted = false;

  const cancel = () => {
    if (timeoutRef !== null) {
      window.clearTimeout(timeoutRef);
      timeoutRef = null;
    }
  };

  createEffect(
    on(value, (val) => {
      if (mounted) {
        if (!cooldownRef && options.leading) {
          cooldownRef = true;
          setDebounced(() => val);
        } else {
          cancel();
          timeoutRef = window.setTimeout(() => {
            cooldownRef = false;
            setDebounced(() => val);
          }, wait);
        }
      }
    })
  );

  // Mark as mounted after first run
  mounted = true;

  onCleanup(cancel);

  return [debounced, cancel];
}
