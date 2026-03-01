import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import { createWindowEventListener } from '../create-window-event-listener/index.js';

export interface NetworkStatus {
  online: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown';
}

function getConnection(): Omit<NetworkStatus, 'online'> {
  if (typeof navigator === 'undefined') {
    return {};
  }

  const _navigator = navigator as any;
  const connection: any =
    _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;

  if (!connection) {
    return {};
  }

  return {
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type,
  };
}

export function createNetwork(): Accessor<NetworkStatus> {
  const [status, setStatus] = createSignal<NetworkStatus>({ online: true });

  const handleConnectionChange = () => {
    setStatus((current) => ({ ...current, ...getConnection() }));
  };

  createWindowEventListener('online', () =>
    setStatus({ online: true, ...getConnection() })
  );
  createWindowEventListener('offline', () =>
    setStatus({ online: false, ...getConnection() })
  );

  createEffect(() => {
    const _navigator = navigator as any;

    if (_navigator.connection) {
      setStatus({ online: _navigator.onLine, ...getConnection() });
      _navigator.connection.addEventListener('change', handleConnectionChange);
      onCleanup(() =>
        _navigator.connection.removeEventListener('change', handleConnectionChange)
      );
      return;
    }

    if (typeof _navigator.onLine === 'boolean') {
      setStatus((current) => ({ ...current, online: _navigator.onLine }));
    }
  });

  return status;
}
