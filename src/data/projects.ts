import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: 1,
    title: "ArgentBank",
    tag: "Full Stack",
    description:
      "Application bancaire fullstack développée avec React, Redux Toolkit et Node.js. Système d'authentification complet via JWT et modélisation des routes API en Swagger.",
    stack: ["React", "Redux Toolkit", "Node.js", "JWT", "Swagger"],
    githubUrl: "https://github.com/gabtoledano/argentbank-frontend",
    image: "/assets/images/projects/argentbank.webp",
  },
  {
    id: 2,
    title: "Nina Carducci",
    tag: "Perf & SEO",
    description:
      "Optimisation complète d'un site portfolio de photographe. Performance portée de 73 à 99/100, accessibilité et SEO à 100/100 sur Lighthouse.",
    stack: ["Lighthouse", "WebP", "Schema.org", "SEO", "WCAG"],
    githubUrl: "https://github.com/gabtoledano/ninacarducci",
    liveUrl: "https://gabtoledano.github.io/ninacarducci",
    image: "/assets/images/projects/nina-carducci.webp",
  },
  {
    id: 3,
    title: "Kasa",
    tag: "Front-end",
    description:
      "Application de location d'appartements entre particuliers développée en React. Routing dynamique, composants réutilisables et responsive mobile complet.",
    stack: ["React", "React Router v6", "CSS Modules", "Figma"],
    githubUrl: "https://github.com/gabtoledano/kasa",
    image: "/assets/images/projects/kasa.webp",
  },
  {
    id: 4,
    title: "Menu Maker by Qwenta",
    tag: "Gestion de projet",
    description:
      "Mission de cadrage technique pour une application SaaS de création de menus. Spécifications complètes, Kanban Notion de 23 cartes et veille technologique structurée.",
    stack: ["Kanban", "Agile", "Notion", "Feedly", "Architecture"],
    githubUrl: "https://github.com/gabtoledano/menu-maker",
    image: "/assets/images/projects/menu-maker.webp",
  },
];
