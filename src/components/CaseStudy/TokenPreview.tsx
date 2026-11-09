import { tokensByName } from "@/data/designTokens";
import { contrastRatio, themeValue, type Theme } from "@/lib/designTokens";
import styles from "./TokenPreview.module.css";

const formatRatio = (ratio: number) => `${ratio.toFixed(2).replace(".", ",")}:1`;

/** Contraste du texte du bouton principal, calculé dans chaque thème. */
function buttonContrast(theme: Theme): number | null {
  const text = tokensByName.get("color.on-primary");
  const background = tokensByName.get("color.primary");
  if (!text || !background) return null;
  return contrastRatio(themeValue(text, theme).value, themeValue(background, theme).value);
}

const dark = buttonContrast("dark");
const light = buttonContrast("light");

/**
 * Un mini écran de réglages écrit uniquement avec les tokens sémantiques du
 * site. C'est une maquette : rien n'y est cliquable, elle est donc masquée aux
 * technologies d'assistance et décrite par sa légende.
 */
export default function TokenPreview() {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame} aria-hidden="true">
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
        Un composant écrit uniquement avec des tokens sémantiques : il change de
        thème sans une ligne de code en plus.
        {dark !== null && light !== null && (
          <>
            {" "}
            Texte du bouton : contraste{" "}
            {dark.toFixed(2) === light.toFixed(2) ? (
              <>
                <strong>{formatRatio(dark)}</strong> dans les deux thèmes
              </>
            ) : (
              <>
                <strong>{formatRatio(dark)}</strong> en sombre,{" "}
                <strong>{formatRatio(light)}</strong> en clair
              </>
            )}
            {Math.min(dark, light) >= 4.5 ? " (WCAG AA)." : "."}
          </>
        )}
      </figcaption>
    </figure>
  );
}
