import { type Accessor, createMemo } from 'solid-js';
import { createMediaQuery, type CreateMediaQueryOptions } from '../create-media-query/index.js';

export type ColorSchemeValue = 'dark' | 'light';

export function createColorScheme(
  initialValue?: ColorSchemeValue,
  options?: CreateMediaQueryOptions
): Accessor<ColorSchemeValue> {
  const matches = createMediaQuery(
    '(prefers-color-scheme: dark)',
    initialValue === 'dark',
    options
  );

  return createMemo(() => (matches() ? 'dark' : 'light'));
}
