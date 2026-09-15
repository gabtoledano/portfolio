import { site } from "@/data/site";
import { stats, type Stat } from "@/data/stats";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";
import Section from "@/components/ui/Section";
import photoProfil from "@/assets/images/photo-profil.webp";
import styles from "./About.module.css";

/** Un compteur = un composant : le hook d'animation s'isole par valeur. */
function CountStat({
  stat,
  enabled,
}: {
  stat: Extract<Stat, { kind: "count" }>;
  enabled: boolean;
}) {
  const value = useCountUp(stat.value, { enabled });

  return (
    <span className={styles.statValue}>
      {value}
      {stat.suffix}
    </span>
  );
}

export default function About() {
  // Les compteurs ne démarrent qu'une fois la rangée visible, sinon
  // l'animation se joue dans le vide pendant que l'on lit le hero.
  const { ref, isVisible } = useReveal<HTMLDListElement>({ threshold: 0.25, rootMargin: "0px" });

  return (
    <Section id="about">
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
            technique — construits de A à Z, en totale autonomie.
          </p>
          <p>
            Mon background print m'a appris la rigueur, le souci du détail et la
            culture du rendu soigné — des qualités que j'applique aujourd'hui à
            chaque ligne de code.
          </p>

          <dl className={styles.stats} ref={ref}>
            {stats.map((stat) => (
              <div key={stat.id} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd>
                  {stat.kind === "count" ? (
                    <CountStat stat={stat} enabled={isVisible} />
                  ) : (
                    <span className={styles.statBadge} aria-hidden="true">
                      {stat.symbol}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className={styles.figure}>
          <div className={styles.photoFrame}>
            <img
              src={photoProfil}
              alt="Portrait de Gabriel Toledano"
              className={styles.photo}
              width={640}
              height={760}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className={styles.location}>
            <span className={styles.prompt} aria-hidden="true">
              &gt;_
            </span>
            {site.location}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
