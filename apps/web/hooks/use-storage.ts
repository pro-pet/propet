'use client'

import { useLocalStorage, useSessionStorage } from '@propet/hooks'

const STORAGE_KEY_PREFIX = 'propet:v1:'

function getStorageKey(key: string) {
  if (!key.trim())
    throw new TypeError('Storage key must not be empty')

  return `${STORAGE_KEY_PREFIX}${key}`
}

export function usePersistentLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  return useLocalStorage(getStorageKey(key), initialValue, { initializeWithValue: false })
}

export function usePersistentSessionStorage<T>(key: string, initialValue: T | (() => T)) {
  return useSessionStorage(getStorageKey(key), initialValue, { initializeWithValue: false })
}
