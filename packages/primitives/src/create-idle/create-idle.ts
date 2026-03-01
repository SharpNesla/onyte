import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface CreateIdleOptions {
  events?: (keyof DocumentEventMap)[];
  initialState?: boolean;
}

const DEFAULT_OPTIONS: Required<CreateIdleOptions> = {
  events: ['keydown', 'mousemove', 'touchmove', 'click', 'scroll', 'wheel'],
  initialState: true,
};

export function createIdle(timeout: number, options?: CreateIdleOptions): Accessor<boolean> {
  const { events, initialState } = { ...DEFAULT_OPTIONS, ...options };
  const [idle, setIdle] = createSignal(initialState);
  let timer = -1;

  createEffect(() => {
    const handleEvents = () => {
      setIdle(false);

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        setIdle(true);
      }, timeout);
    };

    events.forEach((event) => document.addEventListener(event, handleEvents));

    // Start the timer immediately instead of waiting for the first event to happen
    timer = window.setTimeout(() => {
      setIdle(true);
    }, timeout);

    onCleanup(() => {
      events.forEach((event) => document.removeEventListener(event, handleEvents));
      window.clearTimeout(timer);
      timer = -1;
    });
  });

  return idle;
}
