import type { FC } from "react";
import styles from "./Hero.module.css";
import { IconGithub, IconLinkedin, IconMail } from "../Icons/Icons";

const Hero: FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.badge}>
          <span className={styles.dot}></span>
          Disponible pour des opportunités
        </span>
        <h1 className={styles.title}>
          Gabriel <br />
          <span className={styles.titleAccent}>Toledano</span>
        </h1>
        <p className={styles.subtitle}>
          Développeur front-end{" "}
          <strong style={{ color: "var(--color-accent)" }}>junior</strong> —
          ex-Graphiste
        </p>
        <p className={styles.description}>
          Reconverti du print au code, je construis des interfaces React
          soignées avec le même souci du détail qu'en imprimerie — mais avec la
          liberté d'itérer.
        </p>
        <div className={styles.actions}>
          <a href="#projects" className={styles.btnPrimary}>
            Voir mes projets →
          </a>
          <a
            href="/cv_gabriel_dev-web-front.pdf"
            className={styles.btnSecondary}
            target="_blank"
          >
            CV
          </a>
        </div>
        <div className={styles.socials}>
          <a
            href="https://github.com/gabtoledano"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <IconGithub size={22} />
          </a>
          <a
            href="https://linkedin.com/in/gabrieltoledano"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <IconLinkedin size={22} />
          </a>
          <a href="mailto:gabrieltoledano19@gmail.com" aria-label="Email">
            <IconMail size={22} />
          </a>
        </div>
      </div>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}>
          <span
            className={styles.windowDot}
            style={{ background: "#ff5f57" }}
          ></span>
          <span
            className={styles.windowDot}
            style={{ background: "#febc2e" }}
          ></span>
          <span
            className={styles.windowDot}
            style={{ background: "#28c840" }}
          ></span>
          <span className={styles.fileName}>portfolio.tsx</span>
        </div>
        <pre className={styles.code}>
          <code>
            <span className={styles.comment}>
              {"// Graphiste devenu développeur"}
            </span>
            {"\n"}
            <span className={styles.keyword}>const </span>
            <span className={styles.variable}>developer</span>
            <span className={styles.punctuation}>{" = {"}</span>
            {"\n"}
            {"  "}
            <span className={styles.key}>name</span>
            <span className={styles.punctuation}>: </span>
            <span className={styles.string}>"Gabriel Toledano"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"  "}
            <span className={styles.key}>formation</span>
            <span className={styles.punctuation}>: </span>
            <span className={styles.string}>"OpenClassrooms"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"  "}
            <span className={styles.key}>stack</span>
            <span className={styles.punctuation}>: [</span>
            {"\n"}
            {"    "}
            <span className={styles.string}>"React"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"    "}
            <span className={styles.string}>"Redux Toolkit"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"    "}
            <span className={styles.string}>"Node.js"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"    "}
            <span className={styles.string}>"TypeScript"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"  "}
            <span className={styles.punctuation}>],</span>
            {"\n"}
            {"  "}
            <span className={styles.key}>background</span>
            <span className={styles.punctuation}>: </span>
            <span className={styles.string}>"5 ans graphiste"</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            {"  "}
            <span className={styles.key}>openToWork</span>
            <span className={styles.punctuation}>: </span>
            <span className={styles.boolean}>true</span>
            <span className={styles.punctuation}>,</span>
            {"\n"}
            <span className={styles.punctuation}>{"}"}</span>
          </code>
        </pre>
      </div>
      <a href="#about" className={styles.scrollDown}>
        <span>↓</span>
      </a>
    </section>
  );
};

export default Hero;
