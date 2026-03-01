import { onCleanup, onMount } from 'solid-js';

export interface CreateTimeoutOptions {
  autoInvoke?: boolean;
}

export interface CreateTimeoutReturnValue {
  start: (...args: any[]) => void;
  clear: () => void;
}

export function createTimeout(
  callback: (...args: any[]) => void,
  delay: number,
  options: CreateTimeoutOptions = { autoInvoke: false }
): CreateTimeoutReturnValue {
  let timeoutRef: number | null = null;

  const start = (...args: any[]) => {
    if (timeoutRef === null) {
      timeoutRef = window.setTimeout(() => {
        callback(...args);
        timeoutRef = null;
      }, delay);
    }
  };

  const clear = () => {
    if (timeoutRef !== null) {
      window.clearTimeout(timeoutRef);
      timeoutRef = null;
    }
  };

  onMount(() => {
    if (options.autoInvoke) {
      start();
    }
  });

  onCleanup(clear);

  return { start, clear };
}
