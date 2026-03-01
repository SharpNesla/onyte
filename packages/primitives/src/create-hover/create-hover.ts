import { type Accessor, createSignal, onCleanup } from 'solid-js';

export interface CreateHoverReturnValue<T extends HTMLElement = any> {
  hovered: Accessor<boolean>;
  ref: (node: T) => void;
}

export function createHover<T extends HTMLElement = any>(): CreateHoverReturnValue<T> {
  const [hovered, setHovered] = createSignal(false);
  let previousNode: T | undefined;

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  onCleanup(() => {
    if (previousNode) {
      previousNode.removeEventListener('mouseenter', handleMouseEnter);
      previousNode.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  const ref = (node: T) => {
    if (previousNode) {
      previousNode.removeEventListener('mouseenter', handleMouseEnter);
      previousNode.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
    }

    previousNode = node;
  };

  return { ref, hovered };
}
