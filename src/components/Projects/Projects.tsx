import type { FC } from "react";
import styles from "./Projects.module.css";
import { projects } from "../../data/projects";
import ProjectCard from "./ProjectCard";
import { IconGithub } from "../Icons/Icons";
import useInView from "../../hooks/useInView";

const Projects: FC = () => {
  const { ref, isInView } = useInView();
  return (
    <section
      id="projects"
      ref={ref}
      className={`${styles.projects} fadeIn ${isInView ? "visible" : ""}`}
    >
      <div className={styles.sectionTitle}>
        <span className={styles.number}>03 /</span>
        <h2>Projets</h2>
      </div>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className={styles.more}>
        <a
          href="https://github.com/gabtoledano"
          target="_blank"
          rel="noreferrer"
          className={styles.moreLink}
        >
          <IconGithub size={16} /> Voir tous mes projets sur GitHub
        </a>
      </div>
    </section>
  );
};

export default Projects;
