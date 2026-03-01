/* eslint-disable no-console */
import { type Accessor, createEffect, createSignal, on } from 'solid-js';
import { createWindowEventListener } from '../create-window-event-listener/index.js';

export type StorageType = 'localStorage' | 'sessionStorage';

export interface CreateStorageOptions<T> {
  /** Storage key */
  key: string;

  /** Default value that will be set if value is not found in storage */
  defaultValue?: T;

  /** If set to true, value will be updated in an effect after mount. Default value is true. */
  getInitialValueInEffect?: boolean;

  /** Determines whether the value must be synced between browser tabs, `true` by default */
  sync?: boolean;

  /** Function to serialize value into string to be saved in storage */
  serialize?: (value: T) => string;

  /** Function to deserialize string value from storage to value */
  deserialize?: (value: string | undefined) => T;
}

function serializeJSON<T>(value: T, hookName: string = 'create-local-storage') {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new Error(`@onyte/hooks ${hookName}: Failed to serialize the value`);
  }
}

function deserializeJSON(value: string | undefined) {
  try {
    return value && JSON.parse(value);
  } catch {
    return value;
  }
}

function createStorageHandler(type: StorageType) {
  const getItem = (key: string) => {
    try {
      return window[type].getItem(key);
    } catch (error) {
      console.warn(
        'create-local-storage: Failed to get value from storage, localStorage is blocked'
      );
      return null;
    }
  };

  const setItem = (key: string, value: string) => {
    try {
      window[type].setItem(key, value);
    } catch (error) {
      console.warn(
        'create-local-storage: Failed to set value to storage, localStorage is blocked'
      );
    }
  };

  const removeItem = (key: string) => {
    try {
      window[type].removeItem(key);
    } catch (error) {
      console.warn(
        'create-local-storage: Failed to remove value from storage, localStorage is blocked'
      );
    }
  };

  return { getItem, setItem, removeItem };
}

export type CreateStorageReturnValue<T> = [
  Accessor<T>, // current value accessor
  (val: T | ((prevState: T) => T)) => void, // callback to set value in storage
  () => void, // callback to remove value from storage
];

export function createStorage<T>(type: StorageType, hookName: string) {
  const eventName =
    type === 'localStorage' ? 'mantine-local-storage' : 'mantine-session-storage';
  const { getItem, setItem, removeItem } = createStorageHandler(type);

  return function useStorage({
    key,
    defaultValue,
    getInitialValueInEffect = true,
    sync = true,
    deserialize = deserializeJSON,
    serialize = (value: T) => serializeJSON(value, hookName),
  }: CreateStorageOptions<T>): CreateStorageReturnValue<T> {
    const readStorageValue = (skipStorage?: boolean): T => {
      let storageBlockedOrSkipped;

      try {
        storageBlockedOrSkipped =
          typeof window === 'undefined' ||
          !(type in window) ||
          window[type] === null ||
          !!skipStorage;
      } catch (_e) {
        storageBlockedOrSkipped = true;
      }

      if (storageBlockedOrSkipped) {
        return defaultValue as T;
      }

      const storageValue = getItem(key);
      return storageValue !== null ? deserialize(storageValue) : (defaultValue as T);
    };

    const [value, setValue] = createSignal<T>(readStorageValue(getInitialValueInEffect));

    const setStorageValue = (val: T | ((prevState: T) => T)) => {
      if (val instanceof Function) {
        const current = value();
        const result = val(current);
        setItem(key, serialize(result));
        queueMicrotask(() => {
          window.dispatchEvent(
            new CustomEvent(eventName, { detail: { key, value: result } })
          );
        });
        setValue(() => result);
      } else {
        setItem(key, serialize(val));
        window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: val } }));
        setValue(() => val);
      }
    };

    const removeStorageValue = () => {
      removeItem(key);
      setValue(() => defaultValue as T);
      window.dispatchEvent(
        new CustomEvent(eventName, { detail: { key, value: defaultValue } })
      );
    };

    createWindowEventListener('storage', (event: StorageEvent) => {
      if (sync) {
        if (event.storageArea === window[type] && event.key === key) {
          setValue(() => deserialize(event.newValue ?? undefined));
        }
      }
    });

    createWindowEventListener(eventName, ((event: CustomEvent) => {
      if (sync) {
        if (event.detail.key === key) {
          setValue(() => event.detail.value);
        }
      }
    }) as EventListener);

    // If defaultValue is set but storage has no value, persist the default
    createEffect(() => {
      const current = value();
      if (defaultValue !== undefined && current === undefined) {
        setStorageValue(defaultValue);
      }
    });

    // Re-read storage value when key changes
    createEffect(
      on(
        () => key,
        () => {
          const val = readStorageValue();
          if (val !== undefined) {
            setStorageValue(val);
          }
        }
      )
    );

    return [
      () => {
        const v = value();
        return v === undefined ? (defaultValue as T) : v;
      },
      setStorageValue,
      removeStorageValue,
    ];
  };
}

export function readValue(type: StorageType) {
  const { getItem } = createStorageHandler(type);

  return function read<T>({
    key,
    defaultValue,
    deserialize = deserializeJSON,
  }: CreateStorageOptions<T>) {
    let storageBlockedOrSkipped;

    try {
      storageBlockedOrSkipped =
        typeof window === 'undefined' || !(type in window) || window[type] === null;
    } catch (_e) {
      storageBlockedOrSkipped = true;
    }

    if (storageBlockedOrSkipped) {
      return defaultValue as T;
    }

    const storageValue = getItem(key);
    return storageValue !== null ? deserialize(storageValue) : (defaultValue as T);
  };
}
