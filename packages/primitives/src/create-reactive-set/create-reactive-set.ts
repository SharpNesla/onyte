import { createSignal } from 'solid-js';

function readonlySetLikeToSet<T>(input: ReadonlySetLike<T>): Set<T> {
  if (input instanceof Set) {
    return input;
  }
  const result = new Set<T>();
  for (const item of input as unknown as Iterable<T>) {
    result.add(item);
  }
  return result;
}

export interface ReactiveSet<T> {
  /** Add a value to the set */
  add: (value: T) => Set<T>;
  /** Check if the set contains the given value */
  has: (value: T) => boolean;
  /** Delete a value from the set */
  delete: (value: T) => boolean;
  /** Remove all values from the set */
  clear: () => void;
  /** Get the number of values in the set */
  readonly size: number;
  /** Get an iterator over the entries */
  entries: () => IterableIterator<[T, T]>;
  /** Get an iterator over the keys (same as values for Set) */
  keys: () => IterableIterator<T>;
  /** Get an iterator over the values */
  values: () => IterableIterator<T>;
  /** Execute a callback for each value */
  forEach: (callbackfn: (value: T, value2: T, set: Set<T>) => void) => void;
  /** Return a new set that is the union of this set and the other */
  union: <U>(other: ReadonlySetLike<U>) => Set<T | U>;
  /** Return a new set containing only values present in both sets */
  intersection: <U>(other: ReadonlySetLike<U>) => Set<T & U>;
  /** Return a new set containing values in this set but not in the other */
  difference: <U>(other: ReadonlySetLike<U>) => Set<T>;
  /** Return a new set containing values in either set but not both */
  symmetricDifference: <U>(other: ReadonlySetLike<U>) => Set<T | U>;
  /** Iterator protocol */
  [Symbol.iterator]: () => IterableIterator<T>;
}

export function createReactiveSet<T>(values?: T[]): ReactiveSet<T> {
  const set = new Set<T>(values);
  const [version, setVersion] = createSignal(0);

  const track = () => {
    version();
  };

  const trigger = () => {
    setVersion((v) => v + 1);
  };

  return {
    add(value: T): Set<T> {
      set.add(value);
      trigger();
      return set;
    },

    has(value: T): boolean {
      track();
      return set.has(value);
    },

    delete(value: T): boolean {
      const result = set.delete(value);
      trigger();
      return result;
    },

    clear(): void {
      set.clear();
      trigger();
    },

    get size(): number {
      track();
      return set.size;
    },

    entries(): IterableIterator<[T, T]> {
      track();
      return set.entries();
    },

    keys(): IterableIterator<T> {
      track();
      return set.keys();
    },

    values(): IterableIterator<T> {
      track();
      return set.values();
    },

    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void): void {
      track();
      set.forEach(callbackfn);
    },

    union<U>(other: ReadonlySetLike<U>): Set<T | U> {
      track();
      const result = new Set<T | U>(set);
      readonlySetLikeToSet(other).forEach((item) => result.add(item));
      return result;
    },

    intersection<U>(other: ReadonlySetLike<U>): Set<T & U> {
      track();
      const result = new Set<T & U>();
      const otherSet = readonlySetLikeToSet(other);
      set.forEach((item) => {
        if (otherSet.has(item as unknown as U)) {
          result.add(item as T & U);
        }
      });
      return result;
    },

    difference<U>(other: ReadonlySetLike<U>): Set<T> {
      track();
      const result = new Set<T>();
      const otherSet = readonlySetLikeToSet(other);
      set.forEach((item) => {
        if (!otherSet.has(item as unknown as U)) {
          result.add(item);
        }
      });
      return result;
    },

    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U> {
      track();
      const result = new Set<T | U>();
      const otherSet = readonlySetLikeToSet(other);

      set.forEach((item) => {
        if (!otherSet.has(item as unknown as U)) {
          result.add(item);
        }
      });

      otherSet.forEach((item) => {
        if (!set.has(item as unknown as T)) {
          result.add(item);
        }
      });

      return result;
    },

    [Symbol.iterator](): IterableIterator<T> {
      track();
      return set[Symbol.iterator]();
    },
  };
}
