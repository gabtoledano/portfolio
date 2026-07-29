import type { FC } from "react";
import styles from "./Header.module.css";

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo}>GT</a>
      <nav className={styles.nav}>
        <a href="#about">À propos</a>
        <a href="#skills">Compétences</a>
        <a href="#projects">Projets</a>
      </nav>
      <a href="#contact" className={styles.cta}>
        Me contacter
      </a>
    </header>
  );
};

export default Header;
