import { describe, expect, it } from "vitest";
import { fuzzyMatch, rank } from "./fuzzy";

describe("fuzzyMatch", () => {
  it("accepte une sous-séquence non contiguë", () => {
    const result = fuzzyMatch("prj", "Projets");
    expect(result).not.toBeNull();
    expect(result?.matches).toEqual([0, 1, 3]);
  });

  it("rejette les caractères hors ordre", () => {
    expect(fuzzyMatch("jrp", "Projets")).toBeNull();
  });

  it("rejette une requête plus longue que la cible", () => {
    expect(fuzzyMatch("compétences", "Kasa")).toBeNull();
  });

  it("ignore les accents et la casse", () => {
    expect(fuzzyMatch("a propos", "À propos")).not.toBeNull();
    expect(fuzzyMatch("À PROPOS", "à propos")).not.toBeNull();
  });

  it("garde les index alignés sur le texte accentué d'origine", () => {
    // « À » doit rester un seul caractère : sinon le surlignage se décale.
    expect(fuzzyMatch("àp", "À propos")?.matches).toEqual([0, 2]);
  });

  it("note mieux un début de mot qu'un milieu de mot", () => {
    const start = fuzzyMatch("p", "Projets");
    const middle = fuzzyMatch("j", "Projets");
    expect(start?.score).toBeGreaterThan(middle?.score ?? 0);
  });

  it("note mieux des lettres contiguës qu'éparpillées", () => {
    const contiguous = fuzzyMatch("pro", "Projets");
    const scattered = fuzzyMatch("pjt", "Projets");
    expect(contiguous?.score).toBeGreaterThan(scattered?.score ?? 0);
  });

  it("traite une requête vide comme un match neutre", () => {
    expect(fuzzyMatch("", "Projets")).toEqual({ score: 0, matches: [] });
  });
});

describe("rank", () => {
  const items = [
    { label: "Projets" },
    { label: "Contact" },
    { label: "Thème sombre", keywords: ["dark", "apparence"] },
  ];

  it("renvoie tout, dans l'ordre, quand la requête est vide", () => {
    expect(rank(items, "   ").map((r) => r.item.label)).toEqual([
      "Projets",
      "Contact",
      "Thème sombre",
    ]);
  });

  it("écarte ce qui ne correspond pas", () => {
    expect(rank(items, "zzz")).toHaveLength(0);
  });

  it("repêche par mot-clé, sans surligner ce qui n'est pas affiché", () => {
    const [first] = rank(items, "dark");
    expect(first?.item.label).toBe("Thème sombre");
    expect(first?.matches).toEqual([]);
  });

  it("classe une correspondance de libellé avant une correspondance de mot-clé", () => {
    const results = rank(
      [{ label: "Apparence" }, { label: "Thème", keywords: ["apparence"] }],
      "apparence",
    );
    expect(results[0]?.item.label).toBe("Apparence");
  });
});
