import { useEffect, useRef } from "react";

/**
 * Abonnement typé à un évènement de `window`.
 *
 * Le handler est conservé dans une ref : on peut donc passer une fonction
 * inline sans réabonner l'écouteur à chaque rendu.
 */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  const savedListener = useRef(listener);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    const handler = (event: WindowEventMap[K]) => savedListener.current(event);
    window.addEventListener(type, handler as EventListener, options);
    return () =>
      window.removeEventListener(type, handler as EventListener, options);
  }, [type, options]);
}
