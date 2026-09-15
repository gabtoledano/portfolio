import { site } from "@/data/site";
import { IconGithub, IconLinkedin, IconMail } from "@/components/Icons/Icons";
import styles from "./Footer.module.css";

const LINKS = [
  { href: site.github, label: "GitHub", icon: <IconGithub size={18} /> },
  { href: site.linkedin, label: "LinkedIn", icon: <IconLinkedin size={18} /> },
  { href: `mailto:${site.email}`, label: "Email", icon: <IconMail size={18} /> },
] as const;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          {/* Calculé à l'affichage : plus d'année figée à mettre à jour. */}
          © {new Date().getFullYear()} {site.name} — du print au code, avec soin.
        </p>

        <p className={styles.built}>
          Construit avec React, TypeScript et Vite.{" "}
          <kbd className={styles.kbd}>⌘K</kbd> pour naviguer.
        </p>

        <ul className={styles.socials}>
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className={styles.social}
              >
                {link.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
