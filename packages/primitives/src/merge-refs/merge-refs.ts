type SolidRef<T> = ((el: T) => void) | undefined;

export function mergeRefs<T>(...refs: SolidRef<T>[]): (el: T) => void {
  return (el: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(el);
      }
    });
  };
}
