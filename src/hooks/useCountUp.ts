import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface CountUpOptions {
  /** Durée totale de l'animation, en millisecondes. */
  duration?: number;
  /** Tant que `false`, le compteur reste à zéro (on attend le scroll). */
  enabled?: boolean;
}

/** Décélération douce : rapide au début, posée sur la fin. */
const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

/**
 * Anime un entier de 0 jusqu'à `target`.
 *
 * Cadencé sur `requestAnimationFrame` et calculé depuis l'horodatage réel :
 * la durée perçue est la même sur un écran 60 Hz et sur un 120 Hz.
 */
export function useCountUp(
  target: number,
  { duration = 1400, enabled = true }: CountUpOptions = {},
): number {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    if (reducedMotion || duration <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / duration);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled, reducedMotion]);

  return value;
}
