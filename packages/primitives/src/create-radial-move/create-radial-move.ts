import { type Accessor, createSignal, onCleanup, onMount } from 'solid-js';
import { clamp } from '../utils/clamp.js';

function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

function getElementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return [rect.left + rect.width / 2, rect.top + rect.height / 2];
}

function getAngle(coordinates: [number, number], element: HTMLElement) {
  const center = getElementCenter(element);
  const x = coordinates[0]! - center[0]!;
  const y = coordinates[1]! - center[1]!;
  const deg = radiansToDegrees(Math.atan2(x, y)) + 180;
  return 360 - deg;
}

function toFixed(value: number, digits: number) {
  return parseFloat(value.toFixed(digits));
}

function getDigitsAfterDot(value: number) {
  return value.toString().split('.')[1]?.length || 0;
}

export function normalizeRadialValue(degree: number, step: number) {
  const clamped = clamp(degree, 0, 360);
  const high = Math.ceil(clamped / step);
  const low = Math.round(clamped / step);
  return toFixed(
    high >= clamped / step ? (high * step === 360 ? 0 : high * step) : low * step,
    getDigitsAfterDot(step)
  );
}

export interface CreateRadialMoveOptions {
  /** Number by which value is incremented/decremented with mouse and touch events, `0.01` by default */
  step?: number;

  /** Called in `onMouseUp` and `onTouchEnd` events with the current value */
  onChangeEnd?: (value: number) => void;

  /** Called in `onMouseDown` and `onTouchStart` events */
  onScrubStart?: () => void;

  /** Called in `onMouseUp` and `onTouchEnd` events */
  onScrubEnd?: () => void;
}

export interface CreateRadialMoveReturnValue {
  /** Ref setter to be passed to the element that should be used for radial move */
  ref: (element: HTMLElement) => void;

  /** Indicates whether the radial move is active */
  active: Accessor<boolean>;
}

export function createRadialMove(
  onChange: (value: number) => void,
  { step = 0.01, onChangeEnd, onScrubStart, onScrubEnd }: CreateRadialMoveOptions = {}
): CreateRadialMoveReturnValue {
  let mounted = false;
  let node: HTMLElement | null = null;
  const [active, setActive] = createSignal(false);

  onMount(() => {
    mounted = true;
  });

  onCleanup(() => {
    mounted = false;
  });

  const update = (event: MouseEvent, done = false) => {
    if (node) {
      node.style.userSelect = 'none';
      const deg = getAngle([event.clientX, event.clientY], node);
      const newValue = normalizeRadialValue(deg, step || 1);

      onChange(newValue);
      done && onChangeEnd?.(newValue);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    update(event);
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    update(event.touches[0] as any);
  };

  const endTracking = () => {
    onScrubEnd?.();
    setActive(false);
    document.removeEventListener('mousemove', handleMouseMove, false);
    document.removeEventListener('mouseup', handleMouseUp, false);
    document.removeEventListener('touchmove', handleTouchMove, false);
    document.removeEventListener('touchend', handleTouchEnd, false);
  };

  const handleMouseUp = (event: MouseEvent) => {
    update(event, true);
    endTracking();
  };

  const handleTouchEnd = (event: TouchEvent) => {
    update(event.changedTouches[0] as any, true);
    endTracking();
  };

  const beginTracking = () => {
    onScrubStart?.();
    setActive(true);
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, false);
  };

  const onMouseDown = (event: MouseEvent) => {
    beginTracking();
    update(event);
  };

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    beginTracking();
    update(event.touches[0] as any);
  };

  const ref = (element: HTMLElement) => {
    // Clean up previous node if it exists
    if (node) {
      node.removeEventListener('mousedown', onMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
    }

    node = element;

    if (node) {
      node.addEventListener('mousedown', onMouseDown);
      node.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    onCleanup(() => {
      if (node) {
        node.removeEventListener('mousedown', onMouseDown);
        node.removeEventListener('touchstart', handleTouchStart);
        endTracking();
      }
    });
  };

  return { ref, active };
}
