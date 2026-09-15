import type { ReactNode } from "react";

export interface Project {
  id: number;
  title: string;
  tag: ProjectTag;
  description: string;
  stack: string[];
  githubUrl: string;
  hideGithub?: boolean;
  liveUrl?: string;
  liveLabel?: string;
  image: string;
  /** Résultat chiffré mis en avant sur la carte, quand il y en a un. */
  highlight?: string;
}

/**
 * Dérivé du tableau plutôt que retapé à la main : ajouter une catégorie dans
 * `PROJECT_TAGS` suffit, le typage et les filtres suivent.
 */
export const PROJECT_TAGS = [
  "Full Stack",
  "Front-end",
  "Perf & SEO",
  "Gestion de projet",
] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];

/** `"Tous"` est l'état par défaut du filtre, il n'est porté par aucun projet. */
export type ProjectFilter = ProjectTag | "Tous";

export interface SkillCategory {
  id: number;
  title: string;
  skills: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactForm;

/* ------------------------------- Palette ⌘K ------------------------------- */

export type CommandGroup = "Navigation" | "Projets" | "Actions" | "Thème" | "Liens";

export interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  icon: ReactNode;
  /** Texte secondaire aligné à droite (raccourci, domaine…). */
  hint?: string;
  /** Termes cherchables non affichés. */
  keywords?: readonly string[];
  perform: () => void;
  /** Laisse la palette ouverte après exécution (utile pour le thème). */
  keepOpen?: boolean;
}

/* --------------------------- Bloc de code du hero ------------------------- */

export type TokenKind =
  | "plain"
  | "comment"
  | "keyword"
  | "variable"
  | "punctuation"
  | "key"
  | "string"
  | "boolean"
  | "number";

export interface CodeToken {
  kind: TokenKind;
  text: string;
}
