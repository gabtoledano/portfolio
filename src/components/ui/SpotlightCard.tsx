import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./SpotlightCard.module.css";

interface SpotlightCardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

/**
 * Carte dont un halo suit le curseur.
 *
 * La position n'est *pas* stockée dans un état React : un `pointermove`
 * déclenche des dizaines d'évènements par seconde, et re-rendre la carte à
 * chaque fois pour une décoration serait du gâchis. On écrit directement deux
 * variables CSS sur le nœud, dans une frame d'animation — le composant ne rend
 * qu'une fois et c'est le compositeur qui anime.
 *
 * L'effet est désactivé au pointeur grossier (tactile) et si l'utilisateur a
 * demandé à réduire les animations.
 */
export default function SpotlightCard({
  children,
  className,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || frame.current !== null) return;
    const { clientX, clientY } = event;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mx", `${clientX - rect.left}px`);
      element.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  };

  return (
    <div
      {...rest}
      ref={ref}
      onPointerMove={handlePointerMove}
      data-spotlight={enabled}
      className={`${styles.card} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
