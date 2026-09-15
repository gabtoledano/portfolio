import type { CSSProperties } from "react";
import type { Project } from "@/types";
import { IconExternalLink, IconGithub } from "@/components/Icons/Icons";
import SpotlightCard from "@/components/ui/SpotlightCard";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  /** Rang dans la grille, utilisé pour décaler l'entrée. */
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <li className={styles.item}>
      <SpotlightCard
        className={styles.card}
        style={{ "--delay": `${index * 80}ms` } as CSSProperties}
      >
        <div className={styles.media}>
          <img
            src={project.image}
            alt={`Aperçu du projet ${project.title}`}
            className={styles.image}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
          />
          <span className={styles.tag}>{project.tag}</span>
          {project.highlight && (
            <span className={styles.highlight}>{project.highlight}</span>
          )}
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.description}>{project.description}</p>

          <ul className={styles.stack}>
            {project.stack.map((tech) => (
              <li key={tech} className={styles.tech}>
                {tech}
              </li>
            ))}
          </ul>

          <div className={styles.links}>
            {!project.hideGithub && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                <IconGithub size={15} />
                Code
                <span className={styles.srOnly}> de {project.title}</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                <IconExternalLink size={15} />
                {project.liveLabel ?? "Démo live"}
                <span className={styles.srOnly}> — {project.title}</span>
              </a>
            )}
          </div>
        </div>
      </SpotlightCard>
    </li>
  );
}
