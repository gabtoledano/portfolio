import type { CodeToken } from "@/types";

/** Longueur totale du fragment, en caractères visibles. */
export function countCharacters(tokens: readonly CodeToken[]): number {
  return tokens.reduce((total, token) => total + token.text.length, 0);
}

/**
 * Tronque une suite de tokens à `count` caractères, en coupant le dernier
 * token au milieu si nécessaire.
 *
 * Fonction pure, extraite du composant : c'est elle qui porte toute la logique
 * de l'effet machine à écrire, et elle se teste sans monter de rendu React.
 */
export function sliceTokens(
  tokens: readonly CodeToken[],
  count: number,
): CodeToken[] {
  if (count <= 0) return [];

  const visible: CodeToken[] = [];
  let remaining = count;

  for (const token of tokens) {
    if (remaining <= 0) break;
    if (token.text.length <= remaining) {
      visible.push(token);
      remaining -= token.text.length;
    } else {
      visible.push({ kind: token.kind, text: token.text.slice(0, remaining) });
      remaining = 0;
    }
  }

  return visible;
}

/** Version texte brut, pour le bouton « copier ». */
export function toPlainText(tokens: readonly CodeToken[]): string {
  return tokens.map((token) => token.text).join("");
}
