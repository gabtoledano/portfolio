import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Décalage avant le départ de l'animation, en millisecondes. */
  delay?: number;
}

/**
 * Révèle son contenu à l'entrée dans le viewport.
 *
 * L'attribut `data-revealed` est posé sur le conteneur : les enfants peuvent
 * s'y accrocher en CSS (`[data-revealed="true"] .card`) pour se décaler en
 * cascade, sans qu'aucune prop n'ait à descendre dans l'arbre.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-revealed={isVisible}
      className={`${styles.reveal} ${className ?? ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
