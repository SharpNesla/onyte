import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export interface CreateOrientationOptions {
  /** Default angle value, used until the real value can be retrieved.
   * If not provided, the default value is `0`.
   */
  defaultAngle?: number;

  /** Default type value, used until the real value can be retrieved.
   * If not provided, the default value is `'landscape-primary'`.
   */
  defaultType?: OrientationType;

  /** If true, the initial value will be resolved inside createEffect (SSR safe).
   * If false, the initial value will be resolved immediately.
   * True by default.
   */
  getInitialValueInEffect?: boolean;
}

export interface OrientationState {
  angle: number;
  type: OrientationType;
}

function getInitialValue(
  initialValue: OrientationState,
  getInitialValueInEffect: boolean
): OrientationState {
  if (getInitialValueInEffect) {
    return initialValue;
  }

  if (typeof window !== 'undefined' && 'screen' in window) {
    return {
      angle: window.screen.orientation?.angle ?? initialValue.angle,
      type: window.screen.orientation?.type ?? initialValue.type,
    };
  }

  return initialValue;
}

export function createOrientation(
  options: CreateOrientationOptions = {}
): Accessor<OrientationState> {
  const {
    defaultAngle = 0,
    defaultType = 'landscape-primary',
    getInitialValueInEffect = true,
  } = options;

  const [orientation, setOrientation] = createSignal<OrientationState>(
    getInitialValue({ angle: defaultAngle, type: defaultType }, getInitialValueInEffect)
  );

  createEffect(() => {
    const handleOrientationChange = (event: Event) => {
      const target = event.currentTarget as ScreenOrientation;
      setOrientation({
        angle: target?.angle || 0,
        type: target?.type || 'landscape-primary',
      });
    };

    window.screen.orientation?.addEventListener('change', handleOrientationChange);
    onCleanup(() =>
      window.screen.orientation?.removeEventListener('change', handleOrientationChange)
    );
  });

  return orientation;
}
