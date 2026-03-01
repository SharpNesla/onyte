import { type Accessor, createEffect, createSignal } from 'solid-js';
import { createWindowEventListener } from '../create-window-event-listener/index.js';

export interface CreateHashOptions {
  getInitialValueInEffect?: boolean;
}

export type CreateHashReturnValue = [Accessor<string>, (value: string) => void];

export function createHash(
  options: CreateHashOptions = {}
): CreateHashReturnValue {
  const { getInitialValueInEffect = true } = options;

  const [hash, setHash] = createSignal<string>(
    getInitialValueInEffect ? '' : window.location.hash || ''
  );

  const setHashHandler = (value: string) => {
    const valueWithHash = value.startsWith('#') ? value : `#${value}`;
    window.location.hash = valueWithHash;
    setHash(valueWithHash);
  };

  createWindowEventListener('hashchange', () => {
    const newHash = window.location.hash;
    if (hash() !== newHash) {
      setHash(newHash);
    }
  });

  createEffect(() => {
    if (getInitialValueInEffect) {
      setHash(window.location.hash);
    }
  });

  return [hash, setHashHandler];
}
