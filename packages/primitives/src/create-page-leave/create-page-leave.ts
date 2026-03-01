import { createEffect, onCleanup } from 'solid-js';

export function createPageLeave(onPageLeave: () => void) {
  createEffect(() => {
    document.documentElement.addEventListener('mouseleave', onPageLeave);
    onCleanup(() => document.documentElement.removeEventListener('mouseleave', onPageLeave));
  });
}
