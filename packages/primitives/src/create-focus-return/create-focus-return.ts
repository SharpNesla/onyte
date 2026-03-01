import { onCleanup } from 'solid-js';
import { createDidUpdate } from '../create-did-update/index.js';

export interface CreateFocusReturnOptions {
  opened: () => boolean;
  shouldReturnFocus?: boolean;
}

export type CreateFocusReturnReturnValue = () => void;

export function createFocusReturn({
  opened,
  shouldReturnFocus = true,
}: CreateFocusReturnOptions): CreateFocusReturnReturnValue {
  let lastActiveElement: HTMLElement | null = null;

  const returnFocus = () => {
    if (
      lastActiveElement &&
      'focus' in lastActiveElement &&
      typeof lastActiveElement.focus === 'function'
    ) {
      lastActiveElement?.focus({ preventScroll: true });
    }
  };

  createDidUpdate(() => {
    let timeout = -1;

    const clearFocusTimeout = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        window.clearTimeout(timeout);
      }
    };

    document.addEventListener('keydown', clearFocusTimeout);

    if (opened()) {
      lastActiveElement = document.activeElement as HTMLElement;
    } else if (shouldReturnFocus) {
      timeout = window.setTimeout(returnFocus, 10);
    }

    onCleanup(() => {
      window.clearTimeout(timeout);
      document.removeEventListener('keydown', clearFocusTimeout);
    });
  }, opened);

  return returnFocus;
}
