import { type Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js';

function getFullscreenElement(): HTMLElement | null {
  const _document = window.document as any;

  const fullscreenElement =
    _document.fullscreenElement ||
    _document.webkitFullscreenElement ||
    _document.mozFullScreenElement ||
    _document.msFullscreenElement;

  return fullscreenElement;
}

function exitFullscreen() {
  const _document = window.document as any;

  if (typeof _document.exitFullscreen === 'function') {
    return _document.exitFullscreen();
  }
  if (typeof _document.msExitFullscreen === 'function') {
    return _document.msExitFullscreen();
  }
  if (typeof _document.webkitExitFullscreen === 'function') {
    return _document.webkitExitFullscreen();
  }
  if (typeof _document.mozCancelFullScreen === 'function') {
    return _document.mozCancelFullScreen();
  }

  return null;
}

function enterFullScreen(element: HTMLElement) {
  const _element = element as any;

  return (
    _element.requestFullscreen?.() ||
    _element.msRequestFullscreen?.() ||
    _element.webkitEnterFullscreen?.() ||
    _element.webkitRequestFullscreen?.() ||
    _element.mozRequestFullscreen?.()
  );
}

const prefixes = ['', 'webkit', 'moz', 'ms'];

function addEvents(
  element: HTMLElement,
  {
    onFullScreen,
    onError,
  }: { onFullScreen: (event: Event) => void; onError: (event: Event) => void }
) {
  prefixes.forEach((prefix) => {
    element.addEventListener(`${prefix}fullscreenchange`, onFullScreen);
    element.addEventListener(`${prefix}fullscreenerror`, onError);
  });

  return () => {
    prefixes.forEach((prefix) => {
      element.removeEventListener(`${prefix}fullscreenchange`, onFullScreen);
      element.removeEventListener(`${prefix}fullscreenerror`, onError);
    });
  };
}

export interface CreateFullscreenReturnValue {
  ref: (element: HTMLElement) => void;
  toggle: () => Promise<void>;
  fullscreen: Accessor<boolean>;
}

export function createFullscreen(): CreateFullscreenReturnValue {
  const [fullscreen, setFullscreen] = createSignal<boolean>(false);
  let _element: HTMLElement | null = null;
  let removeEvents: (() => void) | undefined;

  const handleFullscreenChange = (event: Event) => {
    setFullscreen(event.target === getFullscreenElement());
  };

  const handleFullscreenError = (event: Event) => {
    setFullscreen(false);
    // eslint-disable-next-line no-console
    console.error(
      `[@onyte/hooks] createFullscreen: Error attempting full-screen mode method: ${event} (${event.target})`
    );
  };

  const toggle = async () => {
    if (!getFullscreenElement()) {
      await enterFullScreen(_element || window.document.documentElement);
    } else {
      await exitFullscreen();
    }
  };

  const setupEvents = () => {
    removeEvents?.();
    const el = _element || window.document.documentElement;
    removeEvents = addEvents(el, {
      onFullScreen: handleFullscreenChange,
      onError: handleFullscreenError,
    });
  };

  const ref = (element: HTMLElement) => {
    _element = element;
    setupEvents();

    onCleanup(() => {
      removeEvents?.();
    });
  };

  // Set up events on document element by default (when no ref is used)
  onMount(() => {
    if (!_element && window.document) {
      setupEvents();
    }
  });

  onCleanup(() => {
    removeEvents?.();
  });

  return { ref, toggle, fullscreen };
}
