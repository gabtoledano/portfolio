import type { CodeToken, TokenKind } from "@/types";

/**
 * Le bloc de code du hero, décrit en données plutôt qu'en JSX.
 *
 * L'ancienne version était une centaine de `<span className={styles.x}>`
 * imbriqués à la main : impossible à relire, et impossible à animer. Ici le
 * contenu est une liste de tokens typés que `<CodeWindow>` sait afficher,
 * colorer et dérouler caractère par caractère.
 */
const token =
  (kind: TokenKind) =>
  (text: string): CodeToken => ({ kind, text });

const comment = token("comment");
const keyword = token("keyword");
const variable = token("variable");
const punctuation = token("punctuation");
const key = token("key");
const string = token("string");
const boolean = token("boolean");
const number = token("number");

const newline = punctuation("\n");
const indent = punctuation("  ");

export const heroFileName = "portfolio.ts";

export const heroCode: readonly CodeToken[] = [
  comment("// Graphiste devenu développeur"),
  newline,
  keyword("const "),
  variable("developer"),
  punctuation(" = {"),
  newline,

  indent,
  key("name"),
  punctuation(": "),
  string('"Gabriel Toledano"'),
  punctuation(","),
  newline,

  indent,
  key("formation"),
  punctuation(": "),
  string('"OpenClassrooms"'),
  punctuation(","),
  newline,

  indent,
  key("stack"),
  punctuation(": ["),
  string('"React"'),
  punctuation(", "),
  string('"TypeScript"'),
  punctuation(", "),
  string('"Node.js"'),
  punctuation("],"),
  newline,

  indent,
  key("anneesEnGraphisme"),
  punctuation(": "),
  number("5"),
  punctuation(","),
  newline,

  indent,
  key("openToWork"),
  punctuation(": "),
  boolean("true"),
  punctuation(","),
  newline,

  punctuation("} "),
  keyword("as const"),
  punctuation(";"),
];
