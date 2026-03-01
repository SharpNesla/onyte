import { type Accessor, createMemo } from 'solid-js';
import { createResizeObserver } from '../create-resize-observer/create-resize-observer.js';

export interface CreateElementSizeReturnValue {
  ref: (element: HTMLElement) => void;
  width: Accessor<number>;
  height: Accessor<number>;
}

export function createElementSize(options?: ResizeObserverOptions): CreateElementSizeReturnValue {
  const { ref, rect } = createResizeObserver(options);
  const width = createMemo(() => rect().width);
  const height = createMemo(() => rect().height);
  return { ref, width, height };
}
