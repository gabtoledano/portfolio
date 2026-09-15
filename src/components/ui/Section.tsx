import type { ReactNode } from "react";
import { SECTIONS, type SectionId } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Section.module.css";

interface SectionProps {
  id: SectionId;
  children: ReactNode;
  /** Phrase d'accroche optionnelle sous le titre. */
  description?: string;
  className?: string;
}

/**
 * Coquille commune à toutes les sections : conteneur centré, numérotation,
 * titre et révélation au scroll.
 *
 * Avant, ces 25 lignes de markup et les trois media queries de gouttière
 * étaient recopiées dans chacune des quatre sections. Le libellé et le numéro
 * sont désormais lus dans `SECTIONS`, donc l'ordre du site se change à un seul
 * endroit.
 */
export default function Section({
  id,
  children,
  description,
  className,
}: SectionProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const descriptor = SECTIONS.find((section) => section.id === id);

  return (
    <section
      id={id}
      ref={ref}
      data-revealed={isVisible}
      className={`${styles.section} ${className ?? ""}`}
      aria-labelledby={`${id}-title`}
    >
      <header className={styles.heading}>
        <span className={styles.index} aria-hidden="true">
          {descriptor?.index} /
        </span>
        <h2 id={`${id}-title`} className={styles.title}>
          {descriptor?.label}
        </h2>
      </header>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
}
