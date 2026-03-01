import { type Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { randomId } from '../utils/random-id.js';

function getHeadingsData(
  headings: HTMLElement[],
  getDepth: (element: HTMLElement) => number,
  getValue: (element: HTMLElement) => string
): CreateScrollSpyHeadingData[] {
  const result: CreateScrollSpyHeadingData[] = [];

  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i]!;
    result.push({
      depth: getDepth(heading),
      value: getValue(heading),
      id: heading.id || randomId(),
      getNode: () => (heading.id ? document.getElementById(heading.id)! : heading),
    });
  }

  return result;
}

function getActiveElement(rects: DOMRect[], offset: number = 0) {
  if (rects.length === 0) {
    return -1;
  }

  const closest = rects.reduce(
    (acc, item, index) => {
      if (Math.abs(acc.position - offset) < Math.abs(item.y - offset)) {
        return acc;
      }

      return {
        index,
        position: item.y,
      };
    },
    { index: 0, position: rects[0]!.y }
  );

  return closest.index;
}

function getDefaultDepth(element: HTMLElement) {
  return Number(element.tagName[1]);
}

function getDefaultValue(element: HTMLElement) {
  return element.textContent || '';
}

export interface CreateScrollSpyHeadingData {
  /** Heading depth, 1-6 */
  depth: number;

  /** Heading text content value */
  value: string;

  /** Heading id */
  id: string;

  /** Function to get heading node */
  getNode: () => HTMLElement;
}

export interface CreateScrollSpyOptions {
  /** Selector to get headings, `'h1, h2, h3, h4, h5, h6'` by default */
  selector?: string;

  /** A function to retrieve depth of heading, by default depth is calculated based on tag name */
  getDepth?: (element: HTMLElement) => number;

  /** A function to retrieve heading value, by default `element.textContent` is used */
  getValue?: (element: HTMLElement) => string;

  /** Host element to attach scroll event listener, if not provided, `window` is used */
  scrollHost?: HTMLElement;

  /** Offset from the top of the viewport to use when determining the active heading, `0` by default */
  offset?: number;
}

export interface CreateScrollSpyReturnValue {
  /** Index of the active heading in the `data` array */
  active: Accessor<number>;

  /** Headings data. If not initialized, data is represented by an empty array. */
  data: Accessor<CreateScrollSpyHeadingData[]>;

  /** True if headings value have been retrieved from the DOM. */
  initialized: Accessor<boolean>;

  /** Function to update headings values after the parent component has mounted. */
  reinitialize: () => void;
}

export function createScrollSpy({
  selector = 'h1, h2, h3, h4, h5, h6',
  getDepth = getDefaultDepth,
  getValue = getDefaultValue,
  offset = 0,
  scrollHost,
}: CreateScrollSpyOptions = {}): CreateScrollSpyReturnValue {
  const [active, setActive] = createSignal(-1);
  const [initialized, setInitialized] = createSignal(false);
  const [data, setData] = createSignal<CreateScrollSpyHeadingData[]>([]);

  let headings: CreateScrollSpyHeadingData[] = [];

  const handleScroll = () => {
    setActive(
      getActiveElement(
        headings.map((d) => d.getNode().getBoundingClientRect()),
        offset
      )
    );
  };

  const initialize = () => {
    headings = getHeadingsData(
      Array.from(document.querySelectorAll(selector)),
      getDepth,
      getValue
    );
    setInitialized(true);
    setData(headings);
    setActive(
      getActiveElement(
        headings.map((d) => d.getNode().getBoundingClientRect()),
        offset
      )
    );
  };

  onMount(() => {
    initialize();

    const host = scrollHost || window;
    host.addEventListener('scroll', handleScroll);
    onCleanup(() => host.removeEventListener('scroll', handleScroll));
  });

  return {
    reinitialize: initialize,
    active,
    initialized,
    data,
  };
}
