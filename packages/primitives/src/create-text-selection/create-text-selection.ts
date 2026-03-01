import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export function createTextSelection(): Accessor<Selection | null> {
  const [version, setVersion] = createSignal(0);
  let currentSelection: Selection | null = null;

  const handleSelectionChange = () => {
    currentSelection = document.getSelection();
    // Bump version to trigger reactivity even when the Selection object reference is the same
    setVersion((v) => v + 1);
  };

  createEffect(() => {
    currentSelection = document.getSelection();
    setVersion((v) => v + 1);
    document.addEventListener('selectionchange', handleSelectionChange);
    onCleanup(() => document.removeEventListener('selectionchange', handleSelectionChange));
  });

  return () => {
    // Read version signal to establish tracking dependency
    version();
    return currentSelection;
  };
}
