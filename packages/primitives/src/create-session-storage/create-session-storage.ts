import { createStorage, readValue, type CreateStorageOptions } from '../create-local-storage/create-storage.js';

export function createSessionStorage<T = string>(props: CreateStorageOptions<T>) {
  return createStorage<T>('sessionStorage', 'create-session-storage')(props);
}

export const readSessionStorageValue = readValue('sessionStorage');
