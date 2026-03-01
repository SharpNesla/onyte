import { type Accessor, createSignal } from 'solid-js';
import { createDidUpdate } from '../create-did-update/index.js';

export interface CreateSelectionInput<T> {
  /** The array of items to select from */
  data: () => T[];

  /** The initial selection, empty array by default */
  defaultSelection?: T[];

  /** If true, selection is reset when data changes */
  resetSelectionOnDataChange?: boolean;
}

export interface CreateSelectionHandlers<T> {
  /** Add an item to the selection */
  select: (selected: T) => void;

  /** Remove an item from the selection */
  deselect: (deselected: T) => void;

  /** Toggle an item's selection state */
  toggle: (toggled: T) => void;

  /** Returns true if all items from the `data` are selected */
  isAllSelected: () => boolean;

  /** Returns true if at least one item from the `data` is selected */
  isSomeSelected: () => boolean;

  /** Set the selection to a specific array of items */
  setSelection: (selection: T[]) => void;

  /** Clear all selections */
  resetSelection: () => void;
}

export type CreateSelectionReturnValue<T> = readonly [Accessor<T[]>, CreateSelectionHandlers<T>];

export function createSelection<T>(
  input: CreateSelectionInput<T>
): CreateSelectionReturnValue<T> {
  const [selectionSet, setSelectionSet] = createSignal<Set<T>>(
    new Set(input.defaultSelection || [])
  );

  createDidUpdate(() => {
    if (input.resetSelectionOnDataChange) {
      setSelectionSet(new Set<T>());
    }
  }, input.data);

  const select = (selected: T) => {
    setSelectionSet((state) => {
      if (!state.has(selected)) {
        const newSet = new Set(state);
        newSet.add(selected);
        return newSet;
      }
      return state;
    });
  };

  const deselect = (deselected: T) => {
    setSelectionSet((state) => {
      if (state.has(deselected)) {
        const newSet = new Set(state);
        newSet.delete(deselected);
        return newSet;
      }
      return state;
    });
  };

  const toggle = (toggled: T) => {
    setSelectionSet((state) => {
      const newSet = new Set(state);
      if (state.has(toggled)) {
        newSet.delete(toggled);
      } else {
        newSet.add(toggled);
      }
      return newSet;
    });
  };

  const resetSelection = () => {
    setSelectionSet(new Set<T>());
  };

  const setSelection = (selection: T[]) => {
    setSelectionSet(new Set(selection));
  };

  const isAllSelected = (): boolean => {
    const data = input.data();
    if (data.length === 0) {
      return false;
    }
    const current = selectionSet();
    return data.every((item) => current.has(item));
  };

  const isSomeSelected = (): boolean => {
    const current = selectionSet();
    return input.data().some((item) => current.has(item));
  };

  return [
    () => Array.from(selectionSet()),
    {
      select,
      deselect,
      toggle,
      isAllSelected,
      isSomeSelected,
      setSelection,
      resetSelection,
    },
  ] as const;
}
