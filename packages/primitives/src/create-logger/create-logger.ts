/* eslint-disable no-console */
import { type Accessor, createEffect, onCleanup } from 'solid-js';
import { createDidUpdate } from '../create-did-update/index.js';

export function createLogger(componentName: string, props: Accessor<unknown[]>) {
  createEffect(() => {
    console.log(`${componentName} mounted`, ...props());
    onCleanup(() => console.log(`${componentName} unmounted`));
  });

  createDidUpdate(() => {
    console.log(`${componentName} updated`, ...props());
  }, props);

  return null;
}
