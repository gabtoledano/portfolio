import type { FC } from "react";
import styles from "./About.module.css";
import photoProfil from "../../assets/images/photo-profil.webp";

const About: FC = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.sectionTitle}>
        <span className={styles.number}>01 /</span>
        <h2>À propos</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.text}>
          <p>
            Pendant 5 ans, j'ai travaillé comme{" "}
            <strong>graphiste dans le monde de l'impression</strong> — identités
            visuelles, mise en page, préparation de fichiers pour l'imprimerie.
            Un métier de précision, où chaque détail compte et où le rendu final
            ne se corrige pas après coup.
          </p>
          <p>
            En <span className={styles.accent}>mars 2025</span>, j'ai pris la
            décision de me reconvertir dans le développement web. L'envie de
            créer autrement, dans un medium vivant et interactif, là où on peut
            itérer, corriger, améliorer en permanence.
          </p>
          <p>
            J'ai suivi la formation{" "}
            <strong>Intégrateur Web d'OpenClassrooms</strong>, que je termine
            aujourd'hui. En un peu plus d'un an, j'ai travaillé sur des projets
            concrets en React, Redux Toolkit, Node.js et gestion de projet
            technique — construits de A à Z, seul, sans filet.
          </p>
          <p>
            Mon background print m'a appris la rigueur, le souci du détail et la
            culture du rendu soigné — des qualités que j'applique aujourd'hui à
            chaque ligne de code.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>Projets réalisés</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>Ans en graphisme</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statCheck}>✓</span>
              <span className={styles.statLabel}>Formation OpenClassrooms</span>
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.photoContainer}>
            <img
              src={photoProfil}
              alt="Gabriel Toledano"
              className={styles.photo}
            />
            <div className={styles.photoOverlay}></div>
          </div>
          <span className={styles.location}>
            <span className={styles.locationIcon}>&gt;_</span>
            Paris, France
          </span>
        </div>
      </div>
    </section>
  );
};

export default About;
