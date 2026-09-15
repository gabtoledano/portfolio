import { useCallback, useSyncExternalStore } from "react";

/**
 * Lit une media query en s'appuyant sur `useSyncExternalStore`.
 *
 * C'est l'API prévue par React pour brancher une source externe : elle évite
 * le flash `useEffect` du premier rendu et reste correcte en mode concurrent.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // Pas de matchMedia hors navigateur : on retombe sur `false`.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
