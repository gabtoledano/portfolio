import { describe, expect, it } from "vitest";
import { toPlainText } from "./code";
import {
  contrastRatio,
  cssDeclaration,
  jsonToCodeTokens,
  parseTokens,
  type DesignToken,
} from "./designTokens";

const [blue, primary] = parseTokens([
  {
    name: "color.blue.500",
    cssVariable: "--color-blue-500",
    value: "#2563eb",
    type: "color",
    tier: "primitive",
    alias: null,
    description: null,
  },
  {
    name: "color.action.primary",
    cssVariable: "--color-action-primary",
    value: "#2563eb",
    type: "color",
    tier: "semantic",
    alias: "color.blue.500",
    description: "Fond des boutons principaux.",
  },
]) as [DesignToken, DesignToken];

const byName = new Map([blue, primary].map((token) => [token.name, token]));

describe("parseTokens", () => {
  it("ramène tier à son union", () => {
    const [unknown] = parseTokens([{ ...blue, tier: "autre" }]);
    expect(unknown?.tier).toBe("primitive");
    expect(primary.tier).toBe("semantic");
  });
});

describe("cssDeclaration", () => {
  it("écrit la valeur brute d'une primitive", () => {
    expect(cssDeclaration(blue, byName)).toEqual({
      property: "--color-blue-500",
      value: "#2563eb",
    });
  });

  it("fait pointer un token sémantique vers sa primitive", () => {
    expect(cssDeclaration(primary, byName)).toEqual({
      property: "--color-action-primary",
      value: "var(--color-blue-500)",
    });
  });

  it("retombe sur la valeur si l'alias est introuvable", () => {
    expect(cssDeclaration(primary, new Map()).value).toBe("#2563eb");
  });
});

describe("jsonToCodeTokens", () => {
  it("produit exactement le texte de JSON.stringify", () => {
    const value = { name: "a", alias: null, nested: { list: [1, true, "x"], empty: [] } };
    expect(toPlainText(jsonToCodeTokens(value))).toBe(JSON.stringify(value, null, 2));
  });

  it("colore les clés et les valeurs selon leur nature", () => {
    const kinds = jsonToCodeTokens({ alias: null }).map((token) => token.kind);
    expect(kinds).toContain("key");
    expect(kinds).toContain("boolean");
  });
});

describe("contrastRatio", () => {
  it("vaut 21 entre le noir et le blanc", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("ne dépend pas de l'ordre des couleurs", () => {
    expect(contrastRatio("#ffffff", "#2563eb")).toBeCloseTo(contrastRatio("#2563eb", "#ffffff"));
  });

  it("donne 5,17 pour du blanc sur le bleu d'action", () => {
    expect(contrastRatio("#ffffff", "#2563eb")).toBeCloseTo(5.17, 2);
  });
});
