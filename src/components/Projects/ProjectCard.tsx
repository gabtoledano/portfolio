import type { FC } from "react";
import type { Project } from "../../types";
import styles from "./ProjectCard.module.css";
import { FaGithub } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <span className={styles.tag}>{project.tag}</span>
        <div className={styles.imageContent}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.description}>{project.description}</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.stack}>
          {project.stack.map((tech) => (
            <span key={tech} className={styles.pill}>
              {tech}
            </span>
          ))}
        </div>
        <div className={styles.links}>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <FaGithub /> Code
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <HiExternalLink /> Démo live
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
