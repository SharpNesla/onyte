import { type Accessor, createSignal } from 'solid-js';

export function getInputOnChange<T>(
  setValue: (value: T) => void
) {
  return (val: null | undefined | T | Event | ((current: T) => T)) => {
    if (!val) {
      setValue(val as T);
    } else if (typeof val === 'function') {
      // Can't use functional updater with createSignal's setter directly here,
      // but this matches the Mantine API shape
      setValue((val as (current: T) => T)(undefined as T));
    } else if (typeof val === 'object' && val instanceof Event) {
      const target = (val as Event).target as HTMLInputElement;
      if (target.type === 'checkbox') {
        setValue(target.checked as unknown as T);
      } else {
        setValue(target.value as unknown as T);
      }
    } else {
      setValue(val as T);
    }
  };
}

export type CreateInputStateReturnValue<T> = [Accessor<T>, (value: null | undefined | T | Event) => void];

export function createInputState<T>(initialState: T): CreateInputStateReturnValue<T> {
  const [value, setValue] = createSignal<T>(initialState);
  return [value, getInputOnChange<T>((v) => setValue(() => v))];
}
