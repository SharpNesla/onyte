import { type Accessor, createSignal, onCleanup, onMount } from 'solid-js';
import { clamp } from '../utils/clamp.js';

export interface CreateMovePosition {
  x: number;
  y: number;
}

export function clampCreateMovePosition(position: CreateMovePosition) {
  return {
    x: clamp(position.x, 0, 1),
    y: clamp(position.y, 0, 1),
  };
}

export interface CreateMoveHandlers {
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
}

export interface CreateMoveReturnValue {
  ref: (element: HTMLElement) => void;
  active: Accessor<boolean>;
}

export function createMove(
  onChange: (value: CreateMovePosition) => void,
  handlers?: CreateMoveHandlers,
  dir: 'ltr' | 'rtl' = 'ltr'
): CreateMoveReturnValue {
  let mounted = false;
  let isSliding = false;
  let frame = 0;
  let node: HTMLElement | null = null;
  const [active, setActive] = createSignal(false);

  onMount(() => {
    mounted = true;
  });

  onCleanup(() => {
    mounted = false;
    if (node) {
      unbindEvents();
    }
    if (frame) {
      cancelAnimationFrame(frame);
    }
  });

  const onScrub = ({ x, y }: CreateMovePosition) => {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      if (mounted && node) {
        node.style.userSelect = 'none';
        const rect = node.getBoundingClientRect();

        if (rect.width && rect.height) {
          const _x = clamp((x - rect.left) / rect.width, 0, 1);
          onChange({
            x: dir === 'ltr' ? _x : 1 - _x,
            y: clamp((y - rect.top) / rect.height, 0, 1),
          });
        }
      }
    });
  };

  const onMouseMove = (event: MouseEvent) => onScrub({ x: event.clientX, y: event.clientY });

  const onTouchMove = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }
    onScrub({ x: event.changedTouches[0]!.clientX, y: event.changedTouches[0]!.clientY });
  };

  const stopScrubbing = () => {
    if (isSliding && mounted) {
      isSliding = false;
      setActive(false);
      unbindEvents();
      setTimeout(() => {
        typeof handlers?.onScrubEnd === 'function' && handlers.onScrubEnd();
      }, 0);
    }
  };

  const bindEvents = () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopScrubbing);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', stopScrubbing);
  };

  const unbindEvents = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopScrubbing);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', stopScrubbing);
  };

  const startScrubbing = () => {
    if (!isSliding && mounted) {
      isSliding = true;
      typeof handlers?.onScrubStart === 'function' && handlers.onScrubStart();
      setActive(true);
      bindEvents();
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    startScrubbing();
    event.preventDefault();
    onMouseMove(event);
  };

  const onTouchStart = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }
    startScrubbing();
    onTouchMove(event);
  };

  const ref = (element: HTMLElement) => {
    // Clean up previous node if it exists
    if (node) {
      node.removeEventListener('mousedown', onMouseDown);
      node.removeEventListener('touchstart', onTouchStart);
    }

    node = element;

    if (node) {
      node.addEventListener('mousedown', onMouseDown);
      node.addEventListener('touchstart', onTouchStart, { passive: false });
    }

    onCleanup(() => {
      if (node) {
        node.removeEventListener('mousedown', onMouseDown);
        node.removeEventListener('touchstart', onTouchStart);
      }
    });
  };

  return { ref, active };
}
