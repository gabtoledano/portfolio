import type { Project } from "../types";
import argentbank from '../assets/images/projects/argentbank.webp';
import ninaCarducci from '../assets/images/projects/nina-carducci.webp';
import kasa from '../assets/images/projects/kasa.webp';
import menuMaker from '../assets/images/projects/menu-maker.webp';

export const projects: Project[] = [
  {
    id: 1,
    title: "ArgentBank",
    tag: "Full Stack",
    description:
      "Application bancaire fullstack développée avec React, Redux Toolkit et Node.js. Système d'authentification complet via JWT et modélisation des routes API en Swagger.",
    stack: ["React", "Redux Toolkit", "Node.js", "JWT", "Swagger"],
    githubUrl: "https://github.com/gabtoledano/argentbank-frontend",
    liveUrl: "https://github.com/gabtoledano/argentbank-backend",
    liveLabel: "Back-end",
    image: argentbank,
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
    image: ninaCarducci,
  },
  {
    id: 3,
    title: "Kasa",
    tag: "Front-end",
    description:
      "Application de location d'appartements entre particuliers développée en React. Routing dynamique, composants réutilisables et responsive mobile complet.",
    stack: ["React", "React Router v6", "CSS Modules", "Figma"],
    githubUrl: "https://github.com/gabtoledano/kasa",
    liveUrl: "https://gabtoledano.github.io/kasa/",
    image: kasa,
  },
  {
    id: 4,
    title: "Menu Maker by Qwenta",
    tag: "Gestion de projet",
    description:
      "Mission de cadrage technique pour une application SaaS de création de menus. Spécifications complètes, Kanban Notion de 23 cartes et veille technologique structurée.",
    stack: ["Kanban", "Agile", "Notion", "Feedly", "Architecture"],
    githubUrl: "https://github.com/gabtoledano/menu-maker",
    liveUrl:
      "https://jasper-deal-5f1.notion.site/Kanban-Menu-Maker-by-Qwenta-37219b09f5948073919acfcd8f8aaff8",
    liveLabel: "Voir Kanban",
    image: menuMaker,
  },
];
