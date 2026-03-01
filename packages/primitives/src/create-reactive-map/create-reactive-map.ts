import { createSignal } from 'solid-js';

export interface ReactiveMap<K, V> {
  /** Get the value associated with the given key */
  get: (key: K) => V | undefined;
  /** Set a key-value pair in the map */
  set: (key: K, value: V) => Map<K, V>;
  /** Check if the map contains the given key */
  has: (key: K) => boolean;
  /** Delete the entry with the given key */
  delete: (key: K) => boolean;
  /** Remove all entries from the map */
  clear: () => void;
  /** Get the number of entries in the map */
  readonly size: number;
  /** Get an iterator over the entries */
  entries: () => IterableIterator<[K, V]>;
  /** Get an iterator over the keys */
  keys: () => IterableIterator<K>;
  /** Get an iterator over the values */
  values: () => IterableIterator<V>;
  /** Execute a callback for each entry */
  forEach: (callbackfn: (value: V, key: K, map: Map<K, V>) => void) => void;
  /** Iterator protocol */
  [Symbol.iterator]: () => IterableIterator<[K, V]>;
}

export function createReactiveMap<K, V>(initialState?: [K, V][]): ReactiveMap<K, V> {
  const map = new Map<K, V>(initialState);
  const [version, setVersion] = createSignal(0);

  const track = () => {
    version();
  };

  const trigger = () => {
    setVersion((v) => v + 1);
  };

  return {
    get(key: K): V | undefined {
      track();
      return map.get(key);
    },

    set(key: K, value: V): Map<K, V> {
      map.set(key, value);
      trigger();
      return map;
    },

    has(key: K): boolean {
      track();
      return map.has(key);
    },

    delete(key: K): boolean {
      const result = map.delete(key);
      trigger();
      return result;
    },

    clear(): void {
      map.clear();
      trigger();
    },

    get size(): number {
      track();
      return map.size;
    },

    entries(): IterableIterator<[K, V]> {
      track();
      return map.entries();
    },

    keys(): IterableIterator<K> {
      track();
      return map.keys();
    },

    values(): IterableIterator<V> {
      track();
      return map.values();
    },

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
      track();
      map.forEach(callbackfn);
    },

    [Symbol.iterator](): IterableIterator<[K, V]> {
      track();
      return map[Symbol.iterator]();
    },
  };
}
