import { onCleanup } from 'solid-js';

export interface CreateLongPressOptions {
  /** Time in milliseconds to trigger the long press, default is 400ms */
  threshold?: number;

  /** Callback triggered when the long press starts */
  onStart?: (event: MouseEvent | TouchEvent) => void;

  /** Callback triggered when the long press finishes */
  onFinish?: (event: MouseEvent | TouchEvent) => void;

  /** Callback triggered when the long press is canceled */
  onCancel?: (event: MouseEvent | TouchEvent) => void;
}

export interface CreateLongPressReturnValue {
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onMouseLeave: (event: MouseEvent) => void;
  onTouchStart: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
}

function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return window.TouchEvent
    ? event instanceof TouchEvent
    : 'touches' in event;
}

function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return event instanceof MouseEvent;
}

export function createLongPress(
  onLongPress: (event: MouseEvent | TouchEvent) => void,
  options: CreateLongPressOptions = {}
): CreateLongPressReturnValue {
  const { threshold = 400, onStart, onFinish, onCancel } = options;
  let isLongPressActive = false;
  let isPressed = false;
  let timeout = -1;

  onCleanup(() => window.clearTimeout(timeout));

  if (typeof onLongPress !== 'function') {
    return {} as CreateLongPressReturnValue;
  }

  const start = (event: MouseEvent | TouchEvent) => {
    if (!isMouseEvent(event) && !isTouchEvent(event)) {
      return;
    }

    if (onStart) {
      onStart(event);
    }

    isPressed = true;
    timeout = window.setTimeout(() => {
      onLongPress(event);
      isLongPressActive = true;
    }, threshold);
  };

  const cancel = (event: MouseEvent | TouchEvent) => {
    if (!isMouseEvent(event) && !isTouchEvent(event)) {
      return;
    }

    if (isLongPressActive) {
      if (onFinish) {
        onFinish(event);
      }
    } else if (isPressed) {
      if (onCancel) {
        onCancel(event);
      }
    }

    isLongPressActive = false;
    isPressed = false;

    if (timeout) {
      window.clearTimeout(timeout);
    }
  };

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  };
}
