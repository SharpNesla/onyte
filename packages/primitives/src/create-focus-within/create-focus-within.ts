import { type Accessor, createSignal, onCleanup } from 'solid-js';

function containsRelatedTarget(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
    return event.currentTarget.contains(event.relatedTarget);
  }

  return false;
}

export interface CreateFocusWithinOptions {
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

export interface CreateFocusWithinReturnValue {
  ref: (element: HTMLElement) => void;
  focused: Accessor<boolean>;
}

export function createFocusWithin({
  onBlur,
  onFocus,
}: CreateFocusWithinOptions = {}): CreateFocusWithinReturnValue {
  const [focused, setFocused] = createSignal(false);
  let focusedValue = false;

  const _setFocused = (value: boolean) => {
    setFocused(value);
    focusedValue = value;
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!focusedValue) {
      _setFocused(true);
      onFocus?.(event);
    }
  };

  const handleFocusOut = (event: FocusEvent) => {
    if (focusedValue && !containsRelatedTarget(event)) {
      _setFocused(false);
      onBlur?.(event);
    }
  };

  const ref = (element: HTMLElement) => {
    if (element) {
      element.addEventListener('focusin', handleFocusIn);
      element.addEventListener('focusout', handleFocusOut);
    }

    onCleanup(() => {
      if (element) {
        element.removeEventListener('focusin', handleFocusIn);
        element.removeEventListener('focusout', handleFocusOut);
      }
    });
  };

  return { ref, focused };
}
