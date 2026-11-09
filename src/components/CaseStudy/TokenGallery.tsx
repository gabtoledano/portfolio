import type { CSSProperties } from "react";
import { semanticTokens } from "@/data/designTokens";
import styles from "./TokenGallery.module.css";

const colors = semanticTokens.filter((token) => token.type === "color");
const spacings = semanticTokens.filter((token) => token.type === "dimension");

/**
 * Galerie des tokens sémantiques : une pastille par couleur, une barre par
 * espacement. Les valeurs, noms, alias et descriptions viennent du JSON.
 */
export default function TokenGallery() {
  return (
    <div className={styles.gallery}>
      <ul className={styles.list}>
        {colors.map((token) => (
          <li key={token.name} className={styles.item}>
            <span
              className={styles.swatch}
              style={{ background: token.value }}
              aria-hidden="true"
            />
            <div className={styles.body}>
              <code className={styles.name}>{token.name}</code>
              <p className={styles.description}>{token.description}</p>
              <p className={styles.meta}>
                <span>{token.alias ? `→ ${token.alias}` : "valeur brute"}</span>
                <span>{token.value}</span>
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
                style={{ "--size": token.value } as CSSProperties}
              />
            </span>
            <div className={styles.body}>
              <code className={styles.name}>{token.name}</code>
              <p className={styles.description}>{token.description}</p>
              <p className={styles.meta}>
                <span>{token.alias ? `→ ${token.alias}` : "valeur brute"}</span>
                <span>{token.value}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
