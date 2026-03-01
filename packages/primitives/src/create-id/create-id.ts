import { randomId } from '../utils/random-id.js';

export function createId(staticId?: string): string {
  if (typeof staticId === 'string') {
    return staticId;
  }

  return randomId();
}
