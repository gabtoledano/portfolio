/**
 * Source de vérité unique pour l'identité et les liens du site.
 * Le hero, le footer, la section contact et la palette ⌘K lisent tous d'ici :
 * changer une URL se fait à un seul endroit.
 */
export const site = {
  name: "Gabriel Toledano",
  role: "Développeur front-end junior",
  email: "gabrieltoledano19@gmail.com",
  location: "Paris, France",
  cvUrl: "/cv_gabriel_dev-web-front.pdf",
  github: "https://github.com/gabtoledano",
  linkedin: "https://linkedin.com/in/gabrieltoledano",
} as const;

export interface SectionDescriptor {
  id: string;
  label: string;
  /** Numéro affiché à côté du titre (« 01 / À propos »). */
  index: string;
}

/**
 * Pilote à la fois la navigation du header, le scroll spy, la numérotation des
 * titres et les entrées « Navigation » de la palette de commandes.
 */
export const SECTIONS = [
  { id: "about", label: "À propos", index: "01" },
  { id: "skills", label: "Compétences", index: "02" },
  { id: "projects", label: "Projets", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
] as const satisfies readonly SectionDescriptor[];

/**
 * `satisfies` valide la forme des objets tout en conservant leurs types
 * littéraux : `SectionId` vaut donc "about" | "skills" | "projects" | "contact",
 * et une faute de frappe dans `<Section id="...">` échoue à la compilation.
 */
export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map(
  (section) => section.id,
);
