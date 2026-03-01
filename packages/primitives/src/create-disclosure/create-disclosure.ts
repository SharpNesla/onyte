import { type Accessor, createSignal } from 'solid-js';

export interface CreateDisclosureOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export interface CreateDisclosureHandlers {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export type CreateDisclosureReturnValue = [Accessor<boolean>, CreateDisclosureHandlers];

export function createDisclosure(
  initialState = false,
  options: CreateDisclosureOptions = {}
): CreateDisclosureReturnValue {
  const [opened, setOpened] = createSignal(initialState);

  const open = () => {
    setOpened((isOpened) => {
      if (!isOpened) {
        options.onOpen?.();
        return true;
      }
      return isOpened;
    });
  };

  const close = () => {
    setOpened((isOpened) => {
      if (isOpened) {
        options.onClose?.();
        return false;
      }
      return isOpened;
    });
  };

  const toggle = () => {
    opened() ? close() : open();
  };

  return [opened, { open, close, toggle }];
}
