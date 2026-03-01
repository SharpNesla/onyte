import { type Accessor, createEffect } from 'solid-js';

export function createDocumentTitle(title: Accessor<string>) {
  createEffect(() => {
    const value = title();
    if (typeof value === 'string' && value.trim().length > 0) {
      document.title = value.trim();
    }
  });
}
