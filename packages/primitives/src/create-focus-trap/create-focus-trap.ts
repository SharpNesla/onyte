import { createEffect, onCleanup } from 'solid-js';
import { scopeTab } from './scope-tab.js';
import { FOCUS_SELECTOR, focusable, tabbable } from './tabbable.js';

export function createFocusTrap(active = true): (element: HTMLElement) => void {
  let node: HTMLElement | null = null;

  const focusNode = (target: HTMLElement) => {
    let focusElement: HTMLElement | null = target.querySelector('[data-autofocus]');

    if (!focusElement) {
      const children = Array.from<HTMLElement>(target.querySelectorAll(FOCUS_SELECTOR));
      focusElement = children.find(tabbable) || children.find(focusable) || null;
      if (!focusElement && focusable(target)) {
        focusElement = target;
      }
    }

    if (focusElement) {
      focusElement.focus({ preventScroll: true });
    } else if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        '[@onyte/hooks/create-focus-trap] Failed to find focusable element within provided node',
        target
      );
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && node) {
      scopeTab(node, event);
    }
  };

  createEffect(() => {
    if (!active) {
      return;
    }

    if (node) {
      setTimeout(() => focusNode(node!));
    }

    document.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  const ref = (element: HTMLElement) => {
    if (!active) {
      return;
    }

    if (node === element) {
      return;
    }

    if (element) {
      // Delay processing the HTML node by a frame. This ensures focus is assigned correctly.
      setTimeout(() => {
        if (element.getRootNode()) {
          focusNode(element);
        } else if (import.meta.env?.DEV) {
          // eslint-disable-next-line no-console
          console.warn(
            '[@onyte/hooks/create-focus-trap] Ref node is not part of the dom',
            element
          );
        }
      });

      node = element;
    } else {
      node = null;
    }

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  };

  return ref;
}
