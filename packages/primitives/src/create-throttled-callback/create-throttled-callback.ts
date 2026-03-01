import { onCleanup } from 'solid-js';

export function createThrottledCallbackWithClearTimeout<T extends (...args: any[]) => any>(
  callback: T,
  wait: number
): [(...args: Parameters<T>) => void, () => void] {
  let latestInArgs: Parameters<T> | null = null;
  let latestOutArgs: Parameters<T> | null = null;
  let active = true;
  let timeoutRef = -1;

  const clearTimer = () => window.clearTimeout(timeoutRef);

  const callThrottled = (...args: Parameters<T>) => {
    callback(...args);
    latestInArgs = args;
    latestOutArgs = args;
    active = false;
  };

  const timerCallback = () => {
    if (latestInArgs && latestInArgs !== latestOutArgs) {
      callThrottled(...latestInArgs);
      timeoutRef = window.setTimeout(timerCallback, wait);
    } else {
      active = true;
    }
  };

  const throttled = (...args: Parameters<T>) => {
    if (active) {
      callThrottled(...args);
      timeoutRef = window.setTimeout(timerCallback, wait);
    } else {
      latestInArgs = args;
    }
  };

  onCleanup(clearTimer);

  return [throttled, clearTimer];
}

export function createThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number
): (...args: Parameters<T>) => void {
  return createThrottledCallbackWithClearTimeout(callback, wait)[0];
}
