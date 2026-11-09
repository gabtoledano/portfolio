import type { CSSProperties } from "react";
import { tokens, tokensByName } from "@/data/designTokens";
import { contrastRatio } from "@/lib/designTokens";
import styles from "./TokenPreview.module.css";

/**
 * Les tokens deviennent des variables CSS *locales* à l'aperçu, exactement
 * comme le ferait tokens.css sur :root, sans déborder sur le reste du site.
 */
const scopedVariables = Object.fromEntries(
  tokens.map((token) => [token.cssVariable, token.value]),
) as CSSProperties;

const onAction = tokensByName.get("color.text.on-action")?.value;
const action = tokensByName.get("color.action.primary")?.value;
const ratio = onAction && action ? contrastRatio(onAction, action) : null;

/**
 * Un mini écran de réglages stylé uniquement avec les tokens sémantiques.
 * C'est une maquette : rien n'y est cliquable, elle est donc masquée aux
 * technologies d'assistance et décrite par sa légende.
 */
export default function TokenPreview() {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame} style={scopedVariables} aria-hidden="true">
        <div className={styles.card}>
          <p className={styles.cardTitle}>Notifications</p>
          <p className={styles.cardText}>
            Recevoir un résumé de la veille chaque lundi matin.
          </p>
          <div className={styles.actions}>
            <span className={styles.button}>Enregistrer</span>
            <span className={styles.link}>Annuler</span>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        Aperçu stylé uniquement avec les tokens sémantiques : couleurs et
        espacements.
        {ratio !== null && (
          <>
            {" "}
            Texte du bouton : contraste{" "}
            <strong>{ratio.toFixed(2).replace(".", ",")}:1</strong>
            {ratio >= 4.5 ? " (WCAG AA)." : "."}
          </>
        )}
      </figcaption>
    </figure>
  );
}
