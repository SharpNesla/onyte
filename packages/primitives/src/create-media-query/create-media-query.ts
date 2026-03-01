import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface CreateMediaQueryOptions {
  getInitialValueInEffect?: boolean;
}

function getInitialValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === 'boolean') {
    return initialValue;
  }

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(query).matches;
  }

  return false;
}

export function createMediaQuery(
  query: string,
  initialValue?: boolean,
  options: CreateMediaQueryOptions = { getInitialValueInEffect: true }
): Accessor<boolean> {
  const [matches, setMatches] = createSignal(
    options.getInitialValueInEffect ? (initialValue ?? false) : getInitialValue(query, initialValue)
  );

  createEffect(() => {
    try {
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);

      const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
      mediaQuery.addEventListener('change', handler);
      onCleanup(() => mediaQuery.removeEventListener('change', handler));
    } catch {
      // Safari iframe compatibility issue
    }
  });

  return matches;
}
