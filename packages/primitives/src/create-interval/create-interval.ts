import { type Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js';

export interface CreateIntervalOptions {
  autoInvoke?: boolean;
}

export interface CreateIntervalReturnValue {
  start: () => void;
  stop: () => void;
  toggle: () => void;
  active: Accessor<boolean>;
}

export function createInterval(
  fn: () => void,
  interval: number,
  { autoInvoke = false }: CreateIntervalOptions = {}
): CreateIntervalReturnValue {
  const [active, setActive] = createSignal(false);
  let intervalRef: number | null = null;

  const stop = () => {
    setActive(false);
    if (intervalRef !== null) {
      window.clearInterval(intervalRef);
      intervalRef = null;
    }
  };

  const start = () => {
    if (!active()) {
      intervalRef = window.setInterval(fn, interval);
      setActive(true);
    }
  };

  const toggle = () => {
    active() ? stop() : start();
  };

  onMount(() => {
    if (autoInvoke) {
      start();
    }
  });

  onCleanup(stop);

  return { start, stop, toggle, active };
}
