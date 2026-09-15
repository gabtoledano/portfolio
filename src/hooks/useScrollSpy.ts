import { useEffect, useRef, useState } from "react";

/**
 * Renvoie l'identifiant de la section actuellement la plus visible.
 *
 * Les ratios sont stockés dans une ref et l'état n'est mis à jour que lorsque
 * la section gagnante change : le scroll ne provoque donc pas de rendu à
 * chaque pixel, contrairement à un écouteur `scroll` classique.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const ratios = useRef(new Map<string, number>());
  const [activeId, setActiveId] = useState<string | null>(null);

  // `ids` est un littéral recréé à chaque rendu : on le sérialise pour ne pas
  // relancer l'observer sans raison.
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|").filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    // Copié dans une variable locale : à l'exécution du nettoyage, `ref.current`
    // peut déjà pointer ailleurs.
    const measured = ratios.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          measured.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let best: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = measured.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }

        // React bail-out : pas de rendu si la valeur est identique.
        setActiveId(best);
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: "-20% 0px -35% 0px",
      },
    );

    for (const element of elements) observer.observe(element);
    return () => {
      observer.disconnect();
      measured.clear();
    };
  }, [key]);

  return activeId;
}
