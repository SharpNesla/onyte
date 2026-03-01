import { createStorage, readValue, type CreateStorageOptions } from './create-storage.js';

export function createLocalStorage<T = string>(props: CreateStorageOptions<T>) {
  return createStorage<T>('localStorage', 'create-local-storage')(props);
}

export const readLocalStorageValue = readValue('localStorage');
