import { type Accessor, createSignal, onMount } from 'solid-js';

export function createMounted(): Accessor<boolean> {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));
  return mounted;
}
