import { type Accessor, createEffect, createSignal } from 'solid-js';

export interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

export interface EyeDropperOpenReturnType {
  sRGBHex: string;
}

export interface CreateEyeDropperReturnValue {
  supported: Accessor<boolean>;
  open: (options?: EyeDropperOpenOptions) => Promise<EyeDropperOpenReturnType | undefined>;
}

function isOpera() {
  return navigator.userAgent.includes('OPR');
}

export function createEyeDropper(): CreateEyeDropperReturnValue {
  const [supported, setSupported] = createSignal(false);

  createEffect(() => {
    setSupported(typeof window !== 'undefined' && !isOpera() && 'EyeDropper' in window);
  });

  const open = (
    options: EyeDropperOpenOptions = {}
  ): Promise<EyeDropperOpenReturnType | undefined> => {
    if (supported()) {
      const eyeDropper = new (window as any).EyeDropper();
      return eyeDropper.open(options);
    }

    return Promise.resolve(undefined);
  };

  return { supported, open };
}
