import { onCleanup } from 'solid-js';
import { createReducedMotion } from '../create-reduced-motion/create-reduced-motion.js';
import { createWindowEventListener } from '../create-window-event-listener/create-window-event-listener.js';

interface ScrollIntoViewAnimation {
  alignment?: 'start' | 'end' | 'center';
}

export interface CreateScrollIntoViewOptions {
  onScrollFinish?: () => void;
  duration?: number;
  axis?: 'x' | 'y';
  easing?: (t: number) => number;
  offset?: number;
  cancelable?: boolean;
  isList?: boolean;
}

export interface CreateScrollIntoViewReturnValue {
  scrollableRef: (el: HTMLElement) => void;
  targetRef: (el: HTMLElement) => void;
  scrollIntoView: (params?: ScrollIntoViewAnimation) => void;
  cancel: () => void;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getRelativePosition({ axis, target, parent, alignment, offset, isList }: any): number {
  if (!target || (!parent && typeof document === 'undefined')) return 0;
  const isCustomParent = !!parent;
  const parentElement = parent || document.body;
  const parentPosition = parentElement.getBoundingClientRect();
  const targetPosition = target.getBoundingClientRect();

  const getDiff = (property: 'top' | 'left'): number =>
    targetPosition[property] - parentPosition[property];

  if (axis === 'y') {
    const diff = getDiff('top');
    if (diff === 0) return 0;
    if (alignment === 'start') {
      const distance = diff - offset;
      return distance <= targetPosition.height * (isList ? 0 : 1) || !isList ? distance : 0;
    }
    const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight;
    if (alignment === 'end') {
      const distance = diff + offset - parentHeight + targetPosition.height;
      return distance >= -targetPosition.height * (isList ? 0 : 1) || !isList ? distance : 0;
    }
    if (alignment === 'center') return diff - parentHeight / 2 + targetPosition.height / 2;
    return 0;
  }

  if (axis === 'x') {
    const diff = getDiff('left');
    if (diff === 0) return 0;
    if (alignment === 'start') {
      const distance = diff - offset;
      return distance <= targetPosition.width || !isList ? distance : 0;
    }
    const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth;
    if (alignment === 'end') {
      const distance = diff + offset - parentWidth + targetPosition.width;
      return distance >= -targetPosition.width || !isList ? distance : 0;
    }
    if (alignment === 'center') return diff - parentWidth / 2 + targetPosition.width / 2;
    return 0;
  }

  return 0;
}

function getScrollStart({ axis, parent }: any) {
  if (!parent && typeof document === 'undefined') return 0;
  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft';
  if (parent) return parent[method];
  const { body, documentElement } = document;
  return body[method] + documentElement[method];
}

function setScrollParam({ axis, parent, distance }: any) {
  if (!parent && typeof document === 'undefined') return;
  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft';
  if (parent) {
    parent[method] = distance;
  } else {
    const { body, documentElement } = document;
    body[method] = distance;
    documentElement[method] = distance;
  }
}

export function createScrollIntoView({
  duration = 1250,
  axis = 'y',
  onScrollFinish,
  easing = easeInOutQuad,
  offset = 0,
  cancelable = true,
  isList = false,
}: CreateScrollIntoViewOptions = {}): CreateScrollIntoViewReturnValue {
  let frameID = 0;
  let startTime = 0;
  let shouldStop = false;

  let scrollableEl: HTMLElement | null = null;
  let targetEl: HTMLElement | null = null;

  const reducedMotion = createReducedMotion();

  const cancel = () => {
    if (frameID) {
      cancelAnimationFrame(frameID);
    }
  };

  const scrollIntoView = ({ alignment = 'start' }: ScrollIntoViewAnimation = {}) => {
    shouldStop = false;
    if (frameID) cancel();

    const start = getScrollStart({ parent: scrollableEl, axis }) ?? 0;
    const change =
      getRelativePosition({
        parent: scrollableEl,
        target: targetEl,
        axis,
        alignment,
        offset,
        isList,
      }) - (scrollableEl ? 0 : start);

    function animateScroll() {
      if (startTime === 0) startTime = performance.now();
      const elapsed = performance.now() - startTime;
      const t = reducedMotion() || duration === 0 ? 1 : elapsed / duration;
      const distance = start + change * easing(t);

      setScrollParam({ parent: scrollableEl, axis, distance });

      if (!shouldStop && t < 1) {
        frameID = requestAnimationFrame(animateScroll);
      } else {
        onScrollFinish?.();
        startTime = 0;
        frameID = 0;
        cancel();
      }
    }
    animateScroll();
  };

  const handleStop = () => {
    if (cancelable) shouldStop = true;
  };

  createWindowEventListener('wheel', handleStop, { passive: true });
  createWindowEventListener('touchmove', handleStop, { passive: true });

  onCleanup(cancel);

  return {
    scrollableRef: (el: HTMLElement) => { scrollableEl = el; },
    targetRef: (el: HTMLElement) => { targetEl = el; },
    scrollIntoView,
    cancel,
  };
}
