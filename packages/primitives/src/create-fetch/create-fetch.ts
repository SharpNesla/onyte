import { type Accessor, createEffect, createSignal, on, onCleanup } from 'solid-js';

export interface CreateFetchOptions extends RequestInit {
  autoInvoke?: boolean;
}

export interface CreateFetchReturnValue<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  refetch: () => Promise<T | Error>;
  abort: () => void;
}

export function createFetch<T>(
  url: string | Accessor<string>,
  { autoInvoke = true, ...options }: CreateFetchOptions = {}
): CreateFetchReturnValue<T> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  let controller: AbortController | null = null;

  const resolvedUrl = typeof url === 'function' ? url : () => url;

  const refetch = () => {
    if (controller) {
      controller.abort();
    }

    controller = new AbortController();
    setLoading(true);

    return fetch(resolvedUrl(), { signal: controller.signal, ...options })
      .then((res) => res.json())
      .then((res: T) => {
        setData(() => res);
        setLoading(false);
        return res;
      })
      .catch((err: Error) => {
        setLoading(false);
        if (err.name !== 'AbortError') {
          setError(() => err);
        }
        return err;
      });
  };

  const abort = () => {
    controller?.abort('');
  };

  if (autoInvoke) {
    createEffect(on(resolvedUrl, () => {
      refetch();
    }));
  }

  onCleanup(() => {
    controller?.abort('');
  });

  return { data, loading, error, refetch, abort };
}
