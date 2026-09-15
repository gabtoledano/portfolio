import { useCallback, useEffect, useRef } from "react";
import { useEventListener } from "./useEventListener";

/**
 * Écrit la progression de lecture (0 → 1) dans la variable CSS `--progress`
 * de l'élément ciblé.
 *
 * Volontairement sans `useState` : une barre de progression se met à jour à
 * chaque pixel de scroll, la passer par l'état ferait re-rendre tout l'arbre
 * du header. Ici le composant ne rend qu'une seule fois, c'est le compositeur
 * qui fait le travail.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);

  // Une seule frame en vol à la fois : les dizaines d'évènements `scroll`
  // reçus entre deux rafraîchissements sont coalescés en une seule écriture.
  const update = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = ref.current;
      if (!element) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      element.style.setProperty("--progress", Math.min(1, progress).toFixed(4));
    });
  }, []);

  useEventListener("scroll", update, { passive: true });
  useEventListener("resize", update);

  useEffect(() => {
    update();
    const pending = frame;
    return () => {
      if (pending.current !== null) cancelAnimationFrame(pending.current);
    };
  }, [update]);

  return ref;
}
