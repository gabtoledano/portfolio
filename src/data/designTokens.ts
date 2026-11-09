import agents from "design-tokens/build/tokens.agents.json";
import { parseTokens, type DesignToken } from "@/lib/designTokens";

/**
 * Données de l'étude de cas « design tokens ».
 *
 * `tokens.agents.json` vient du paquet design-tokens, comme les variables CSS
 * importées dans `index.css` : la même source, la charte de ce site. Les
 * extraits de code, la galerie et l'aperçu de l'étude de cas sont calculés à
 * partir de ce fichier.
 *
 * Ce module n'est importé que par l'étude de cas, chargée à la demande : le
 * JSON ne pèse pas sur le premier chargement de la page.
 */
export const designTokensRepo = "https://github.com/gabtoledano/design-tokens";
export const designTokensAgentsFileUrl = `${designTokensRepo}/blob/main/build/tokens.agents.json`;

export const tokens: readonly DesignToken[] = parseTokens(agents.tokens);

export const tokensByName: ReadonlyMap<string, DesignToken> = new Map(
  tokens.map((token) => [token.name, token]),
);

export const semanticTokens = tokens.filter((token) => token.tier === "semantic");
export const primitiveTokens = tokens.filter((token) => token.tier === "primitive");
export const themedTokens = tokens.filter((token) => token.themes);

/** Récupère des tokens par leur nom, dans l'ordre demandé. */
export function pickTokens(names: readonly string[]): DesignToken[] {
  return names.flatMap((name) => {
    const token = tokensByName.get(name);
    return token ? [token] : [];
  });
}
