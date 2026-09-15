import { useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { PROJECT_TAGS, type ProjectFilter } from "@/types";
import { IconGithub } from "@/components/Icons/Icons";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import ProjectCard from "./ProjectCard";
import styles from "./Projects.module.css";

/**
 * Nombre de projets par catégorie, calculé une fois pour toutes au chargement
 * du module : les données sont statiques, ça n'a rien à faire dans un rendu.
 */
const COUNTS = new Map<ProjectFilter, number>([
  ["Tous", projects.length],
  ...PROJECT_TAGS.map(
    (tag) =>
      [tag, projects.filter((project) => project.tag === tag).length] as const,
  ),
]);

/** On n'affiche pas un filtre qui ne ramènerait aucun projet. */
const FILTERS: ProjectFilter[] = [
  "Tous",
  ...PROJECT_TAGS.filter((tag) => (COUNTS.get(tag) ?? 0) > 0),
];

export default function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>("Tous");

  // État *dérivé*, pas dupliqué : la liste visible se recalcule à partir du
  // filtre plutôt que de vivre dans un second `useState` à resynchroniser.
  const visible = useMemo(
    () =>
      filter === "Tous"
        ? projects
        : projects.filter((project) => project.tag === filter),
    [filter],
  );

  return (
    <Section id="projects">
      <div className={styles.toolbar} role="group" aria-label="Filtrer par catégorie">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            className={styles.filter}
            onClick={() => setFilter(option)}
          >
            {option}
            <span className={styles.count}>{COUNTS.get(option)}</span>
          </button>
        ))}
      </div>

      {/* Annonce discrète du résultat pour les lecteurs d'écran : sans ça,
          cliquer un filtre ne produit aucun retour perceptible. */}
      <p className={styles.status} role="status">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché
        {visible.length > 1 ? "s" : ""}
        {filter !== "Tous" && ` dans « ${filter} »`}.
      </p>

      <Reveal>
        <ul className={styles.grid}>
          {visible.map((project, index) => (
            // La clé inclut le filtre : changer de catégorie remonte les
            // cartes, ce qui rejoue l'animation d'entrée.
            <ProjectCard
              key={`${filter}-${project.id}`}
              project={project}
              index={index}
            />
          ))}
        </ul>
      </Reveal>

      <div className={styles.more}>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className={styles.moreLink}
        >
          <IconGithub size={16} />
          Voir tous mes projets sur GitHub
        </a>
      </div>
    </Section>
  );
}
