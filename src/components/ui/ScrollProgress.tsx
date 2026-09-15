import { useScrollProgress } from "@/hooks/useScrollProgress";
import styles from "./ScrollProgress.module.css";

/**
 * Barre de progression de lecture, collée sous le header.
 *
 * Le composant ne rend qu'une seule fois : le hook écrit la progression dans
 * une variable CSS que la transformation consomme (voir `useScrollProgress`).
 */
export default function ScrollProgress() {
  const ref = useScrollProgress<HTMLDivElement>();

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={ref} className={styles.bar} />
    </div>
  );
}
