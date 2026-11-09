import type { CSSProperties } from "react";
import { pickTokens } from "@/data/designTokens";
import { themeValue } from "@/lib/designTokens";
import styles from "./TokenGallery.module.css";

/** Une sélection lisible : le site compte une soixantaine de tokens sémantiques. */
const colors = pickTokens([
  "color.bg",
  "color.bg.elevated",
  "color.text",
  "color.text.muted",
  "color.primary",
  "color.accent",
  "color.border",
  "color.success",
]);

const spacings = pickTokens(["spacing.xs", "spacing.sm", "spacing.md", "spacing.lg"]);

/**
 * Galerie des tokens : une pastille par couleur, une barre par espacement.
 *
 * Les pastilles sont peintes avec la variable CSS elle-même, pas avec une
 * valeur recopiée : elles changent avec le thème, comme le reste du site.
 * Noms, descriptions et valeurs de chaque thème viennent du JSON.
 */
export default function TokenGallery() {
  return (
    <div className={styles.gallery}>
      <ul className={styles.list}>
        {colors.map((token) => (
          <li key={token.name} className={styles.item}>
            <span
              className={styles.swatch}
              style={{ background: `var(${token.cssVariable})` }}
              aria-hidden="true"
            />
            <div className={styles.body}>
              <code className={styles.name}>{token.name}</code>
              <p className={styles.description}>{token.description}</p>
              <p className={styles.meta}>
                <span>sombre {themeValue(token, "dark").value}</span>
                <span>clair {themeValue(token, "light").value}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <ul className={styles.list}>
        {spacings.map((token) => (
          <li key={token.name} className={styles.item}>
            <span className={styles.spacingTrack} aria-hidden="true">
              <span
                className={styles.spacingBar}
                style={{ "--size": `var(${token.cssVariable})` } as CSSProperties}
              />
            </span>
            <div className={styles.body}>
              <code className={styles.name}>{token.name}</code>
              <p className={styles.description}>{token.description}</p>
              <p className={styles.meta}>
                <span>{token.value}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
