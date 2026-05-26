import { useState, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (val: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      // ignore
    }
    return defaultValue;
  });

  const set = useCallback(
    (val: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // ignore
      }
      setValue(val);
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, set, remove];
}
