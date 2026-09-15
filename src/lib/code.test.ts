import { describe, expect, it } from "vitest";
import { countCharacters, sliceTokens, toPlainText } from "./code";
import type { CodeToken } from "@/types";

const tokens: CodeToken[] = [
  { kind: "keyword", text: "const " },
  { kind: "variable", text: "dev" },
  { kind: "punctuation", text: " = 1;" },
];

describe("countCharacters", () => {
  it("additionne la longueur de tous les tokens", () => {
    expect(countCharacters(tokens)).toBe(14);
  });

  it("vaut zéro sur une liste vide", () => {
    expect(countCharacters([])).toBe(0);
  });
});

describe("sliceTokens", () => {
  it("ne renvoie rien avant le premier caractère", () => {
    expect(sliceTokens(tokens, 0)).toEqual([]);
    expect(sliceTokens(tokens, -5)).toEqual([]);
  });

  it("coupe au milieu d'un token en conservant sa nature", () => {
    expect(sliceTokens(tokens, 3)).toEqual([
      { kind: "keyword", text: "con" },
    ]);
  });

  it("s'arrête pile à la frontière d'un token", () => {
    expect(sliceTokens(tokens, 6)).toEqual([
      { kind: "keyword", text: "const " },
    ]);
  });

  it("renvoie tout au-delà de la longueur totale", () => {
    expect(sliceTokens(tokens, 999)).toEqual(tokens);
  });

  it("produit toujours un préfixe du texte complet", () => {
    const full = toPlainText(tokens);
    for (let count = 0; count <= full.length; count += 1) {
      expect(toPlainText(sliceTokens(tokens, count))).toBe(
        full.slice(0, count),
      );
    }
  });
});
