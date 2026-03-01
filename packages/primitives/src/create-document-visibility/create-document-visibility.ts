import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export function createDocumentVisibility(): Accessor<DocumentVisibilityState> {
  const [documentVisibility, setDocumentVisibility] =
    createSignal<DocumentVisibilityState>('visible');

  createEffect(() => {
    setDocumentVisibility(document.visibilityState);
    const listener = () => setDocumentVisibility(document.visibilityState);
    document.addEventListener('visibilitychange', listener);
    onCleanup(() => document.removeEventListener('visibilitychange', listener));
  });

  return documentVisibility;
}
