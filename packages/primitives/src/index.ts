// Utilities
export { clamp } from './utils/clamp.js';
export { lowerFirst } from './utils/lower-first.js';
export { upperFirst } from './utils/upper-first.js';
export { randomId } from './utils/random-id.js';
export { range } from './utils/range.js';
export { shallowEqual } from './utils/shallow-equal.js';

// Primitives — Batch 1 (foundation)
export { createWindowEventListener } from './create-window-event-listener/index.js';
export { createMediaQuery } from './create-media-query/index.js';
export type { CreateMediaQueryOptions } from './create-media-query/index.js';
export { createDidUpdate } from './create-did-update/index.js';

// Primitives — Batch 2 (state)
export { createDisclosure } from './create-disclosure/index.js';
export type { CreateDisclosureOptions, CreateDisclosureHandlers, CreateDisclosureReturnValue } from './create-disclosure/index.js';
export { createToggle } from './create-toggle/index.js';
export type { CreateToggleReturnValue } from './create-toggle/index.js';
export { createCounter } from './create-counter/index.js';
export type { CreateCounterOptions, CreateCounterHandlers, CreateCounterReturnValue } from './create-counter/index.js';
export { createListState } from './create-list-state/index.js';
export type { CreateListStateHandlers, CreateListStateReturnValue } from './create-list-state/index.js';
export { createValidatedState } from './create-validated-state/index.js';
export type { CreateValidatedStateValue, CreateValidatedStateReturnValue } from './create-validated-state/index.js';
export { createQueue } from './create-queue/index.js';
export type { CreateQueueOptions, CreateQueueReturnValue } from './create-queue/index.js';
export { createStateHistory } from './create-state-history/index.js';
export type { CreateStateHistoryHandlers, CreateStateHistoryValue, CreateStateHistoryReturnValue } from './create-state-history/index.js';
export { createInputState, getInputOnChange } from './create-input-state/index.js';
export type { CreateInputStateReturnValue } from './create-input-state/index.js';
export { createMounted } from './create-mounted/index.js';

// Primitives — Batch 3 (DOM interaction)
export { createClickOutside } from './create-click-outside/index.js';
export { createHover } from './create-hover/index.js';
export type { CreateHoverReturnValue } from './create-hover/index.js';
export { createHotkeys, getHotkeyHandler, parseHotkey, getHotkeyMatcher } from './create-hotkeys/index.js';
export type { HotkeyItem, HotkeyItemOptions, KeyboardModifiers, Hotkey } from './create-hotkeys/index.js';
export { createEventListener } from './create-event-listener/index.js';
export { createPageLeave } from './create-page-leave/index.js';
export { createDocumentVisibility } from './create-document-visibility/index.js';
export { createIdle } from './create-idle/index.js';
export type { CreateIdleOptions } from './create-idle/index.js';
export { createMouse } from './create-mouse/index.js';
export type { CreateMouseReturnValue } from './create-mouse/index.js';
export { createLongPress } from './create-long-press/index.js';
export type { CreateLongPressOptions, CreateLongPressReturnValue } from './create-long-press/index.js';

// Primitives — Batch 4 (DOM observers & movement)
export { createMove, clampCreateMovePosition } from './create-move/index.js';
export type { CreateMovePosition, CreateMoveHandlers, CreateMoveReturnValue } from './create-move/index.js';
export { createRadialMove, normalizeRadialValue } from './create-radial-move/index.js';
export type { CreateRadialMoveOptions, CreateRadialMoveReturnValue } from './create-radial-move/index.js';
export { createMutationObserver } from './create-mutation-observer/index.js';
export { createResizeObserver } from './create-resize-observer/index.js';
export type { ObserverRect, CreateResizeObserverReturnValue } from './create-resize-observer/index.js';
export { createElementSize } from './create-element-size/index.js';
export type { CreateElementSizeReturnValue } from './create-element-size/index.js';
export { createIntersection } from './create-intersection/index.js';
export type { CreateIntersectionReturnValue } from './create-intersection/index.js';
export { createInViewport } from './create-in-viewport/index.js';
export type { CreateInViewportReturnValue } from './create-in-viewport/index.js';
export { createFullscreen } from './create-fullscreen/index.js';
export type { CreateFullscreenReturnValue } from './create-fullscreen/index.js';
export { createFocusWithin } from './create-focus-within/index.js';
export type { CreateFocusWithinOptions, CreateFocusWithinReturnValue } from './create-focus-within/index.js';
export { createFocusTrap } from './create-focus-trap/index.js';
export { scopeTab, FOCUS_SELECTOR, focusable, tabbable, findTabbableDescendants } from './create-focus-trap/index.js';

// Primitives — Batch 5 (timers & debounce)
export { createInterval } from './create-interval/index.js';
export type { CreateIntervalOptions, CreateIntervalReturnValue } from './create-interval/index.js';
export { createTimeout } from './create-timeout/index.js';
export type { CreateTimeoutOptions, CreateTimeoutReturnValue } from './create-timeout/index.js';
export { createDebouncedSignal } from './create-debounced-signal/index.js';
export type { CreateDebouncedSignalOptions, CreateDebouncedSignalReturnValue } from './create-debounced-signal/index.js';
export { createDebouncedValue } from './create-debounced-value/index.js';
export type { CreateDebouncedValueOptions, CreateDebouncedValueReturnValue } from './create-debounced-value/index.js';
export { createDebouncedCallback } from './create-debounced-callback/index.js';
export type { CreateDebouncedCallbackOptions, CreateDebouncedCallbackReturnValue } from './create-debounced-callback/index.js';

// Primitives — Batch 6 (misc leaf)
export { createClipboard } from './create-clipboard/index.js';
export type { CreateClipboardOptions, CreateClipboardReturnValue } from './create-clipboard/index.js';
export { createFetch } from './create-fetch/index.js';
export type { CreateFetchOptions, CreateFetchReturnValue } from './create-fetch/index.js';
export { createPrevious } from './create-previous/index.js';
export { createId } from './create-id/index.js';
export { createScrollSpy } from './create-scroll-spy/index.js';
export type { CreateScrollSpyOptions, CreateScrollSpyHeadingData, CreateScrollSpyReturnValue } from './create-scroll-spy/index.js';
export { mergeRefs } from './merge-refs/index.js';

// Level 2 — composite hooks (depend on Level 1)
export { createColorScheme } from './create-color-scheme/index.js';
export { createReducedMotion } from './create-reduced-motion/index.js';
export { createWindowScroll } from './create-window-scroll/index.js';
export { createHash } from './create-hash/index.js';
export { createViewportSize } from './create-viewport-size/index.js';
export { createNetwork } from './create-network/index.js';
export { createDocumentTitle } from './create-document-title/index.js';
export { createEyeDropper } from './create-eye-dropper/index.js';
export { createFavicon } from './create-favicon/index.js';
export { createOrientation } from './create-orientation/index.js';
export { createLocalStorage } from './create-local-storage/index.js';
export { createSessionStorage } from './create-session-storage/index.js';
export { createOs } from './create-os/index.js';
export { createFocusReturn } from './create-focus-return/index.js';
export { createLogger } from './create-logger/index.js';
export { createSelection } from './create-selection/index.js';
export { createFileDialog } from './create-file-dialog/index.js';
export { createTextSelection } from './create-text-selection/index.js';
export { createReactiveMap } from './create-reactive-map/index.js';
export { createReactiveSet } from './create-reactive-set/index.js';

// Level 3 — composite hooks (depend on Level 2)
export { createHeadroom } from './create-headroom/index.js';
export type { CreateHeadroomOptions } from './create-headroom/index.js';
export { createScrollIntoView } from './create-scroll-into-view/index.js';
export type { CreateScrollIntoViewOptions, CreateScrollIntoViewReturnValue } from './create-scroll-into-view/index.js';
export { createPagination, DOTS } from './create-pagination/index.js';
export type { CreatePaginationOptions, CreatePaginationReturnValue } from './create-pagination/index.js';
export { createThrottledCallback, createThrottledCallbackWithClearTimeout } from './create-throttled-callback/index.js';
export { createThrottledSignal } from './create-throttled-signal/index.js';
export { createThrottledValue } from './create-throttled-value/index.js';
