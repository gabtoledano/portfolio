import type { FC } from "react";
import styles from "./Footer.module.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

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
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/gabrieltoledano"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>
        <a href="mailto:gabrieltoledano19@gmail.com">
          <HiMail />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
