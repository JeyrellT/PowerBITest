import { useCallback, useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Hook de autosave configurable
 * @param {Object} options
 * @param {boolean} options.enabled - Habilita o deshabilita el autosave.
 * @param {boolean} options.dirty - Indica si existen cambios pendientes.
 * @param {Function} options.onSave - Acción a ejecutar cuando se dispara el autosave.
 * @param {number} [options.debounceMs=3000] - Tiempo de espera antes de guardar (clamp 2000-5000).
 * @param {Function} [options.onError] - Callback opcional para manejar errores.
 * @param {Array} [options.dependencies=[]] - Dependencias adicionales que disparan el autosave.
 * @returns {{ flush: Function, cancel: Function }}
 */
export function useAutosave({
  enabled = true,
  dirty,
  onSave,
  debounceMs = 3000,
  onError,
  dependencies = []
}) {
  const timerRef = useRef(null);
  const latestOnSave = useRef(onSave);

  useEffect(() => {
    latestOnSave.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled || !dirty || typeof latestOnSave.current !== 'function') {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }

    const delay = clamp(debounceMs, 2000, 5000);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      Promise.resolve(latestOnSave.current())
        .catch((error) => {
          if (typeof onError === 'function') {
            onError(error);
          } else {
            console.error('Autosave error:', error);
          }
        })
        .finally(() => {
          timerRef.current = null;
        });
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, dirty, debounceMs, onError, dependencies]);

  const flush = useCallback(async () => {
    if (!enabled || typeof latestOnSave.current !== 'function') return null;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    try {
      return await Promise.resolve(latestOnSave.current());
    } catch (error) {
      if (typeof onError === 'function') {
        onError(error);
      } else {
        console.error('Autosave flush error:', error);
      }
      throw error;
    }
  }, [enabled, onError]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { flush, cancel };
}
