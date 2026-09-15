import { useMediaQuery } from "./useMediaQuery";

/**
 * `true` si l'utilisateur a demandé à réduire les animations.
 * Le CSS coupe déjà les transitions ; ce hook sert aux animations pilotées en
 * JS (machine à écrire, spotlight au curseur) qu'aucune règle CSS n'atteint.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
