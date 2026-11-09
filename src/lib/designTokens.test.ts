import { describe, expect, it } from "vitest";
import { toPlainText } from "./code";
import {
  contrastRatio,
  cssDeclaration,
  jsonToCodeTokens,
  parseTokens,
  themeValue,
  type DesignToken,
} from "./designTokens";

const [navy, mist, bg, zHeader] = parseTokens([
  {
    name: "color.navy.950",
    cssVariable: "--color-navy-950",
    value: "#0a0a14",
    type: "color",
    tier: "primitive",
    alias: null,
    description: null,
  },
  {
    name: "color.mist.50",
    cssVariable: "--color-mist-50",
    value: "#f5f6fb",
    type: "color",
    tier: "primitive",
    alias: null,
    description: null,
  },
  {
    name: "color.bg",
    cssVariable: "--color-bg",
    value: "#0a0a14",
    type: "color",
    tier: "semantic",
    alias: "color.navy.950",
    description: "Fond de la page.",
    themes: {
      dark: { value: "#0a0a14", alias: "color.navy.950" },
      light: { value: "#f5f6fb", alias: "color.mist.50" },
    },
  },
  {
    name: "z.header",
    cssVariable: "--z-header",
    value: 100,
    type: "number",
    tier: "semantic",
    alias: null,
    description: "Niveau du header fixe.",
  },
]) as [DesignToken, DesignToken, DesignToken, DesignToken];

const byName = new Map([navy, mist, bg].map((token) => [token.name, token]));

describe("parseTokens", () => {
  it("ramène tier à son union", () => {
    const [unknown] = parseTokens([{ ...navy, tier: "autre" }]);
    expect(unknown?.tier).toBe("primitive");
    expect(bg.tier).toBe("semantic");
  });

  it("convertit les valeurs numériques en texte", () => {
    expect(zHeader.value).toBe("100");
  });

  it("n'ajoute pas de thèmes à un token qui n'en a pas", () => {
    expect(navy).not.toHaveProperty("themes");
  });
});

describe("themeValue", () => {
  it("donne la valeur et l'alias de chaque thème", () => {
    expect(themeValue(bg, "light")).toEqual({ value: "#f5f6fb", alias: "color.mist.50" });
  });

  it("retombe sur la valeur par défaut pour un token sans thème", () => {
    expect(themeValue(navy, "light")).toEqual({ value: "#0a0a14", alias: null });
  });
});

describe("cssDeclaration", () => {
  it("écrit la valeur brute d'une primitive", () => {
    expect(cssDeclaration(navy, byName)).toEqual({
      property: "--color-navy-950",
      value: "#0a0a14",
    });
  });

  it("fait pointer un token sémantique vers la primitive de chaque thème", () => {
    expect(cssDeclaration(bg, byName, "dark").value).toBe("var(--color-navy-950)");
    expect(cssDeclaration(bg, byName, "light").value).toBe("var(--color-mist-50)");
  });

  it("retombe sur la valeur si l'alias est introuvable", () => {
    expect(cssDeclaration(bg, new Map(), "light").value).toBe("#f5f6fb");
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
    expect(contrastRatio("#ffffff", "#4f46e5")).toBeCloseTo(contrastRatio("#4f46e5", "#ffffff"));
  });

  it("donne 6,29 pour du blanc sur l'indigo de la marque", () => {
    expect(contrastRatio("#ffffff", "#4f46e5")).toBeCloseTo(6.29, 2);
  });
});
