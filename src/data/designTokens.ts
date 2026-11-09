import agents from "./design-tokens.agents.json";
import { parseTokens, type DesignToken } from "@/lib/designTokens";

/**
 * Données de l'étude de cas « design tokens ».
 *
 * `design-tokens.agents.json` est une copie du fichier généré par le dépôt
 * github.com/gabtoledano/design-tokens (build/tokens.agents.json). La galerie,
 * les extraits de code et l'aperçu de la section sont tous calculés à partir
 * de ce fichier : la même source que celle que lisent les agents IA.
 *
 * Pour mettre à jour : recopier build/tokens.agents.json ici.
 */
/** Ancre partageable de l'étude de cas : gabrieltoledano.dev/#design-tokens */
export const caseStudyId = "design-tokens";

export const designTokensRepo = "https://github.com/gabtoledano/design-tokens";
export const designTokensAgentsFileUrl = `${designTokensRepo}/blob/main/build/tokens.agents.json`;

export const tokens: readonly DesignToken[] = parseTokens(agents.tokens);
export const agentRules: readonly string[] = agents.rules;

export const tokensByName: ReadonlyMap<string, DesignToken> = new Map(
  tokens.map((token) => [token.name, token]),
);

export const semanticTokens = tokens.filter((token) => token.tier === "semantic");
export const primitiveTokens = tokens.filter((token) => token.tier === "primitive");
