import type { CSSProperties } from "react";
import { skills } from "@/data/skills";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SpotlightCard from "@/components/ui/SpotlightCard";
import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <Section id="skills">
      <Reveal className={styles.grid}>
        {skills.map((category, index) => (
          <SpotlightCard
            key={category.id}
            className={styles.card}
            // Le délai voyage en variable CSS : la cascade est décrite en CSS,
            // pas recalculée à chaque rendu.
            style={{ "--delay": `${index * 90}ms` } as CSSProperties}
          >
            <h3 className={styles.cardTitle}>{category.title}</h3>
            <ul className={styles.pills}>
              {category.skills.map((skill) => (
                <li key={skill} className={styles.pill}>
                  {skill}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        ))}
      </Reveal>
    </Section>
  );
}
