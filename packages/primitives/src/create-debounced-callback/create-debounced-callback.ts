import { onCleanup } from 'solid-js';

export interface CreateDebouncedCallbackOptions {
  delay: number;
  flushOnUnmount?: boolean;
  leading?: boolean;
}

export type CreateDebouncedCallbackReturnValue<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => void) & { flush: () => void; cancel: () => void };

export function createDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: number | CreateDebouncedCallbackOptions
): CreateDebouncedCallbackReturnValue<T> {
  const { delay, flushOnUnmount = false, leading = false } =
    typeof options === 'number'
      ? { delay: options, flushOnUnmount: false, leading: false }
      : options;

  let debounceTimerRef = 0;
  let isFirstCall = true;

  function clearTimeoutAndReset() {
    window.clearTimeout(debounceTimerRef);
    debounceTimerRef = 0;
    isFirstCall = true;
  }

  const debounced = Object.assign(
    (...args: Parameters<T>) => {
      window.clearTimeout(debounceTimerRef);

      const wasFirstCall = isFirstCall;
      isFirstCall = false;

      if (leading && wasFirstCall) {
        callback(...args);
        debounced.flush = () => {
          if (debounceTimerRef !== 0) {
            clearTimeoutAndReset();
            callback(...args);
          }
        };
        debounced.cancel = clearTimeoutAndReset;
        debounceTimerRef = window.setTimeout(clearTimeoutAndReset, delay);
        return;
      }

      if (leading && !wasFirstCall) {
        debounced.flush = () => {
          if (debounceTimerRef !== 0) {
            clearTimeoutAndReset();
            callback(...args);
          }
        };
        debounced.cancel = clearTimeoutAndReset;
        debounceTimerRef = window.setTimeout(clearTimeoutAndReset, delay);
        return;
      }

      const flush = () => {
        if (debounceTimerRef !== 0) {
          clearTimeoutAndReset();
          callback(...args);
        }
      };

      debounced.flush = flush;
      debounced.cancel = clearTimeoutAndReset;
      debounceTimerRef = window.setTimeout(flush, delay);
    },
    {
      flush: () => {},
      cancel: () => {},
    }
  );

  onCleanup(() => {
    if (flushOnUnmount) {
      debounced.flush();
    } else {
      debounced.cancel();
    }
  });

  return debounced as CreateDebouncedCallbackReturnValue<T>;
}
