import { createEffect, onCleanup } from 'solid-js';
import { getHotkeyMatcher, type HotkeyItemOptions } from './parse-hotkey.js';

export type { HotkeyItemOptions };
export { getHotkeyHandler } from './parse-hotkey.js';

export type HotkeyItem = [string, (event: KeyboardEvent) => void, HotkeyItemOptions?];

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false
) {
  if (event.target instanceof HTMLElement) {
    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(event.target.tagName);
    }

    return !event.target.isContentEditable && !tagsToIgnore.includes(event.target.tagName);
  }

  return true;
}

export function createHotkeys(
  hotkeys: HotkeyItem[],
  tagsToIgnore: string[] = ['INPUT', 'TEXTAREA', 'SELECT'],
  triggerOnContentEditable = false
) {
  createEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      hotkeys.forEach(
        ([hotkey, handler, options = { preventDefault: true, usePhysicalKeys: false }]) => {
          if (
            getHotkeyMatcher(hotkey, options.usePhysicalKeys)(event) &&
            shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
          ) {
            if (options.preventDefault) {
              event.preventDefault();
            }

            handler(event);
          }
        }
      );
    };

    document.documentElement.addEventListener('keydown', keydownListener);
    onCleanup(() => document.documentElement.removeEventListener('keydown', keydownListener));
  });
}
