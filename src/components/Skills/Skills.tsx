import type { FC } from "react";
import styles from "./Skills.module.css";
import { skills } from "../../data/skills";
import useInView from "../../hooks/useInView";

const Skills: FC = () => {
  const { ref, isInView } = useInView();

  return (
    <section
      id="skills"
      ref={ref}
      className={`${styles.skills} fadeIn ${isInView ? "visible" : ""}`}
    >
      <div className={styles.sectionTitle}>
        <span className={styles.number}>02 /</span>
        <h2>Compétences</h2>
      </div>

      <div className={styles.grid}>
        {skills.map((category) => (
          <div key={category.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{category.title}</h3>
            <div className={styles.pills}>
              {category.skills.map((skill) => (
                <span key={skill} className={styles.pill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
