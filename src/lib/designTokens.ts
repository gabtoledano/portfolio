import type { CodeToken } from "@/types";

/**
 * Un token tel que le décrit `tokens.agents.json`, le fichier que le dépôt
 * design-tokens génère pour les agents IA.
 */
export interface DesignToken {
  name: string;
  cssVariable: string;
  value: string;
  type: string;
  tier: "primitive" | "semantic";
  alias: string | null;
  description: string | null;
}

/** Forme brute d'une entrée du JSON, avant validation. */
interface RawToken {
  name: string;
  cssVariable: string;
  value: string;
  type: string;
  tier: string;
  alias: string | null;
  description: string | null;
}

/**
 * Transforme les entrées du JSON en tokens typés. Le JSON importé ne connaît
 * que des `string` : `tier` est donc ramené explicitement à son union, sans
 * transtypage aveugle.
 */
export function parseTokens(raw: readonly RawToken[]): DesignToken[] {
  return raw.map((token) => ({
    ...token,
    tier: token.tier === "semantic" ? "semantic" : "primitive",
  }));
}

/**
 * Déclaration CSS d'un token, telle que Style Dictionary l'écrit avec
 * `outputReferences` : un token sémantique pointe vers la variable de sa
 * primitive au lieu de recopier la valeur.
 */
export function cssDeclaration(
  token: DesignToken,
  byName: ReadonlyMap<string, DesignToken>,
): { property: string; value: string } {
  const target = token.alias ? byName.get(token.alias) : undefined;
  return {
    property: token.cssVariable,
    value: target ? `var(${target.cssVariable})` : token.value,
  };
}

/* ------------------------------ Coloration JSON ---------------------------- */

const plain = (text: string): CodeToken => ({ kind: "punctuation", text });

/**
 * Convertit une valeur JSON en tokens colorés pour `<CodeWindow>`, indentée
 * sur deux espaces comme `JSON.stringify(value, null, 2)`.
 *
 * Fonction pure : le texte produit est identique, caractère pour caractère, à
 * celui de `JSON.stringify`, ce que vérifient les tests.
 */
export function jsonToCodeTokens(value: unknown, depth = 0): CodeToken[] {
  if (value === null) return [{ kind: "boolean", text: "null" }];
  if (typeof value === "boolean") return [{ kind: "boolean", text: String(value) }];
  if (typeof value === "number") return [{ kind: "number", text: String(value) }];
  if (typeof value === "string") return [{ kind: "string", text: JSON.stringify(value) }];

  const indent = "  ".repeat(depth + 1);
  const closingIndent = "  ".repeat(depth);

  if (Array.isArray(value)) {
    if (value.length === 0) return [plain("[]")];
    const tokens: CodeToken[] = [plain("[\n")];
    value.forEach((item, index) => {
      tokens.push(plain(indent), ...jsonToCodeTokens(item, depth + 1));
      tokens.push(plain(index < value.length - 1 ? ",\n" : "\n"));
    });
    tokens.push(plain(`${closingIndent}]`));
    return tokens;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return [plain("{}")];
    const tokens: CodeToken[] = [plain("{\n")];
    entries.forEach(([key, item], index) => {
      tokens.push(
        plain(indent),
        { kind: "key", text: JSON.stringify(key) },
        plain(": "),
        ...jsonToCodeTokens(item, depth + 1),
        plain(index < entries.length - 1 ? ",\n" : "\n"),
      );
    });
    tokens.push(plain(`${closingIndent}}`));
    return tokens;
  }

  return [];
}

/* -------------------------------- Contraste -------------------------------- */

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [red = 0, green = 0, blue = 0] = channels;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/**
 * Rapport de contraste WCAG 2 entre deux couleurs `#rrggbb`, de 1 à 21.
 * Calculé à partir des vraies valeurs des tokens : si la palette change, le
 * chiffre affiché suit.
 */
export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}
