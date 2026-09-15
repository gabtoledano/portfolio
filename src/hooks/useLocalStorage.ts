import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * `getSnapshot` doit renvoyer une valeur *référentiellement stable* tant que
 * rien n'a changé, sinon React boucle à l'infini. On mémorise donc la chaîne
 * brute lue dans le storage et on ne re-parse que lorsqu'elle diffère.
 */
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Safari en navigation privée, cookies bloqués, quota… : jamais bloquant.
    return null;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  // `storage` ne se déclenche que sur les *autres* onglets : synchro gratuite.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * État persisté dans `localStorage`, synchronisé entre les onglets et partagé
 * par toutes les instances du hook montées sur la même clé.
 */
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  parse: (raw: string) => T = JSON.parse as (raw: string) => T,
): [T, (value: T) => void] {
  const getSnapshot = useCallback((): T => {
    const raw = readRaw(key);
    const cached = cache.get(key);
    if (cached && cached.raw === raw) return cached.value as T;

    let value = fallback;
    if (raw !== null) {
      try {
        value = parse(raw);
      } catch {
        value = fallback;
      }
    }
    cache.set(key, { raw, value });
    return value;
  }, [key, fallback, parse]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Écriture impossible : on prévient quand même les abonnés pour que
        // l'UI reste cohérente le temps de la session.
      }
      cache.set(key, { raw: readRaw(key), value: next });
      emit();
    },
    [key],
  );

  return [value, setValue];
}
