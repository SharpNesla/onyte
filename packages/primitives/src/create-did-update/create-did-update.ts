import { createEffect, on, type Accessor } from 'solid-js';

export function createDidUpdate(fn: () => void | (() => void), deps: Accessor<unknown>) {
  let mounted = false;

  createEffect(
    on(deps, () => {
      if (mounted) {
        return fn();
      }

      mounted = true;
      return undefined;
    })
  );
}
