import { useState } from 'react';
import type { FC } from "react";
import styles from "./Header.module.css";

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo}>
        GT
      </a>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <a href="#about" onClick={closeMenu}>
          À propos
        </a>
        <a href="#skills" onClick={closeMenu}>
          Compétences
        </a>
        <a href="#projects" onClick={closeMenu}>
          Projets
        </a>
        <a href="#contact" onClick={closeMenu} className={styles.ctaMobile}>
          Me contacter
        </a>
      </nav>

      <a href="#contact" className={styles.cta}>
        Me contacter
      </a>

      <button className={styles.burger} onClick={toggleMenu} aria-label="Menu">
        <span
          className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen1 : ""}`}
        ></span>
        <span
          className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen2 : ""}`}
        ></span>
        <span
          className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen3 : ""}`}
        ></span>
      </button>
    </header>
  );
};

export default Header;
