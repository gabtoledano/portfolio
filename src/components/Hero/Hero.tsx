import type { CSSProperties } from "react";
import { heroCode, heroFileName } from "@/data/heroCode";
import { site } from "@/data/site";
import { scrollToSection } from "@/lib/scrollToSection";
import CodeWindow from "@/components/ui/CodeWindow";
import {
  IconArrowDown,
  IconArrowRight,
  IconFile,
  IconGithub,
  IconLinkedin,
  IconMail,
} from "@/components/Icons/Icons";
import styles from "./Hero.module.css";

const SOCIALS = [
  { href: site.github, label: "GitHub", icon: <IconGithub size={20} /> },
  { href: site.linkedin, label: "LinkedIn", icon: <IconLinkedin size={20} /> },
  { href: `mailto:${site.email}`, label: "Email", icon: <IconMail size={20} /> },
] as const;

/** Décale l'entrée des blocs les uns après les autres, en CSS. */
const step = (index: number) => ({ "--step": index }) as CSSProperties;

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Présentation">
      <div className={styles.aura} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.badge} style={step(0)}>
            <span className={styles.pulse} aria-hidden="true" />
            Disponible pour des opportunités
          </p>

          <h1 className={styles.title} style={step(1)}>
            Gabriel
            <span className={styles.titleAccent}>Toledano</span>
          </h1>

          <p className={styles.subtitle} style={step(2)}>
            Développeur front-end <strong>junior</strong>
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            ex-graphiste
          </p>

          <p className={styles.description} style={step(3)}>
            Reconverti du print au code, je construis des interfaces React
            soignées avec le même souci du détail qu'en imprimerie — mais avec
            la liberté d'itérer.
          </p>

          <div className={styles.actions} style={step(4)}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => scrollToSection("projects")}
            >
              Voir mes projets
              <IconArrowRight size={16} />
            </button>

            <a
              href={site.cvUrl}
              className={styles.secondary}
              target="_blank"
              rel="noreferrer"
            >
              <IconFile size={16} />
              Mon CV
            </a>
          </div>

          <ul className={styles.socials} style={step(5)}>
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={styles.social}
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.code} style={step(3)}>
          <CodeWindow fileName={heroFileName} tokens={heroCode} />
        </div>
      </div>

      <button
        type="button"
        className={styles.scrollDown}
        onClick={() => scrollToSection("about")}
        aria-label="Aller à la section À propos"
      >
        <IconArrowDown size={18} />
      </button>
    </section>
  );
}
