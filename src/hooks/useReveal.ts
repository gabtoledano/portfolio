import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Rejoue l'animation à chaque passage plutôt qu'une seule fois. */
  repeat?: boolean;
}

/**
 * Détecte l'entrée d'un élément dans le viewport.
 *
 * Trois garde-fous par rapport à une IntersectionObserver nue :
 * l'élément est révélé immédiatement si l'utilisateur refuse les animations,
 * si l'API n'existe pas, et l'observer se déconnecte dès le premier passage
 * quand `repeat` est `false`.
 *
 * Par défaut, l'élément est révélé dès que son haut passe au-dessus des 85 %
 * de l'écran (seuil 0 et marge basse de -15 %), quelle que soit sa hauteur.
 * Un seuil en proportion de l'élément (l'ancien 0.15) n'est jamais atteint
 * par un bloc plus haut que six écrans, comme l'étude de cas sur mobile, qui
 * restait alors invisible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0,
  rootMargin = "0px 0px -15% 0px",
  repeat = false,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!repeat) observer.disconnect();
          } else if (repeat) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, repeat, reducedMotion]);

  return { ref, isVisible } as const;
}
