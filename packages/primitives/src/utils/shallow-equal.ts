export function shallowEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  const keys = Object.keys(a);
  const { length } = keys;

  if (length !== Object.keys(b).length) {
    return false;
  }

  for (let i = 0; i < length; i += 1) {
    const key = keys[i]!;

    if (!(key in b)) {
      return false;
    }

    if (a[key as keyof typeof a] !== b[key as keyof typeof b] &&
      !(Number.isNaN(a[key as keyof typeof a]) && Number.isNaN(b[key as keyof typeof b]))) {
      return false;
    }
  }

  return true;
}
