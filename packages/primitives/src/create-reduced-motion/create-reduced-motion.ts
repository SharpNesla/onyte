import { type Accessor } from 'solid-js';
import { createMediaQuery, type CreateMediaQueryOptions } from '../create-media-query/index.js';

export function createReducedMotion(
  initialValue?: boolean,
  options?: CreateMediaQueryOptions
): Accessor<boolean> {
  return createMediaQuery('(prefers-reduced-motion: reduce)', initialValue, options);
}
