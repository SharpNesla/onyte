import { type Accessor, createEffect } from 'solid-js';

const MIME_TYPES: Record<string, string> = {
  ico: 'image/x-icon',
  png: 'image/png',
  svg: 'image/svg+xml',
  gif: 'image/gif',
};

export function createFavicon(url: Accessor<string>) {
  let link: HTMLLinkElement | undefined;

  createEffect(() => {
    const value = url();

    if (!value) {
      return;
    }

    if (!link) {
      const existingElements = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');
      existingElements.forEach((element) => document.head.removeChild(element));

      const element = document.createElement('link');
      element.rel = 'shortcut icon';
      link = element;
      document.querySelector('head')!.appendChild(element);
    }

    const splittedUrl = value.split('.');
    const extension = splittedUrl[splittedUrl.length - 1]!.toLowerCase();
    link.setAttribute('type', MIME_TYPES[extension] ?? '');
    link.setAttribute('href', value);
  });
}
