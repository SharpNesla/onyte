export function randomId(prefix = 'onyte-'): string {
  return `${prefix}${Math.random().toString(36).slice(2, 11)}`;
}
