import { type Accessor, createSignal } from 'solid-js';

export interface CreateClipboardOptions {
  timeout?: number;
}

export interface CreateClipboardReturnValue {
  copy: (value: string) => void;
  reset: () => void;
  error: Accessor<Error | null>;
  copied: Accessor<boolean>;
}

export function createClipboard(
  options: CreateClipboardOptions = { timeout: 2000 }
): CreateClipboardReturnValue {
  const [error, setError] = createSignal<Error | null>(null);
  const [copied, setCopied] = createSignal(false);
  let copyTimeout: number | null = null;

  const handleCopyResult = (value: boolean) => {
    if (copyTimeout !== null) {
      window.clearTimeout(copyTimeout);
    }
    copyTimeout = window.setTimeout(() => setCopied(false), options.timeout);
    setCopied(value);
  };

  const copy = (value: string) => {
    if ('clipboard' in navigator) {
      navigator.clipboard
        .writeText(value)
        .then(() => handleCopyResult(true))
        .catch((err) => setError(err));
    } else {
      setError(new Error('createClipboard: navigator.clipboard is not supported'));
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
    if (copyTimeout !== null) {
      window.clearTimeout(copyTimeout);
    }
  };

  return { copy, reset, error, copied };
}
