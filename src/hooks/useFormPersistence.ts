import { useState, useEffect, useRef, useMemo } from 'react';
import { debounce } from '@/lib/utils';
import { isValidPersistedState, type PersistedState } from '@/lib/formPersistence';

interface UseFormPersistenceOptions<T> {
  serialize?: (value: T) => any;
  deserialize?: (value: any) => T | null;
}

/**
 * Custom hook that wraps useState with automatic sessionStorage persistence
 *
 * @param key - Unique key for sessionStorage
 * @param initialValue - Initial value if no persisted data exists
 * @param options - Optional serialization/deserialization functions
 * @returns Tuple of [value, setValue, clearStorage]
 */
export function useFormPersistence<T>(
  key: string,
  initialValue: T,
  options?: UseFormPersistenceOptions<T>
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  // Flag to track if we've loaded from storage
  const hasLoadedRef = useRef(false);

  // Initialize state - load from sessionStorage if available
  const [value, setValueInternal] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Validate structure
        if (isValidPersistedState(parsed)) {
          // Use custom deserializer if provided
          if (options?.deserialize) {
            const deserialized = options.deserialize(parsed.data);
            if (deserialized !== null) {
              hasLoadedRef.current = true;
              return deserialized;
            }
          } else {
            hasLoadedRef.current = true;
            return parsed.data as T;
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load persisted state for key "${key}":`, error);
    }

    return initialValue;
  });

  // Debounced save function
  const debouncedSave = useMemo(
    () => debounce((valueToSave: T) => {
      try {
        // Use custom serializer if provided
        const dataToStore = options?.serialize
          ? options.serialize(valueToSave)
          : valueToSave;

        const persistedState: PersistedState<typeof dataToStore> = {
          version: 1,
          timestamp: Date.now(),
          data: dataToStore,
        };

        sessionStorage.setItem(key, JSON.stringify(persistedState));
      } catch (error) {
        // Handle storage quota exceeded or other errors
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn(`SessionStorage quota exceeded for key "${key}"`);
        } else {
          console.error(`Failed to save to sessionStorage for key "${key}":`, error);
        }
      }
    }, 500),
    [key, options]
  );

  // Save to sessionStorage whenever value changes (after initial load)
  useEffect(() => {
    // Don't save on initial mount - we just loaded from storage
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      return;
    }

    debouncedSave(value);
  }, [value, debouncedSave]);

  // Clear storage function
  const clearStorage = () => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear sessionStorage for key "${key}":`, error);
    }
  };

  return [value, setValueInternal, clearStorage];
}
