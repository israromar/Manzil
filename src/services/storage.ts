import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  settings: '@manzil/settings',
  progress: '@manzil/progress',
  audio: '@manzil/audio',
} as const;

export async function getStoredValue<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Avoid breaking the app on storage failures.
  }
}
