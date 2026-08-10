import type { FC } from "react";
import styles from "./Footer.module.css";
import { IconGithub, IconLinkedin, IconMail } from "../Icons/Icons";

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>
        © 2025 Gabriel Toledano — Du print au code, avec soin.
      </p>
      <div className={styles.socials}>
        <a
          href="https://github.com/gabtoledano"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <IconGithub size={20} />
        </a>
        <a
          href="https://linkedin.com/in/gabrieltoledano"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <IconLinkedin size={20} />
        </a>
        <a href="mailto:gabrieltoledano19@gmail.com" aria-label="Email">
          <IconMail size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
