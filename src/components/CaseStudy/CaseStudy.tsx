import { useEffect } from "react";
import CodeWindow from "@/components/ui/CodeWindow";
import { IconExternalLink, IconGithub } from "@/components/Icons/Icons";
import {
  designTokensAgentsFileUrl,
  designTokensRepo,
  primitiveTokens,
  semanticTokens,
  themedTokens,
  tokens,
  tokensByName,
} from "@/data/designTokens";
import { caseStudyId } from "@/data/site";
import { cssDeclaration, jsonToCodeTokens, type Theme } from "@/lib/designTokens";
import { scrollToSection } from "@/lib/scrollToSection";
import type { CodeToken } from "@/types";
import TokenGallery from "./TokenGallery";
import TokenPreview from "./TokenPreview";
import styles from "./CaseStudy.module.css";

const STACK = ["DTCG", "Style Dictionary 5.8", "Thèmes clair / sombre", "GitHub Actions"];

/* Les extraits de code sont calculés à partir du JSON, pas recopiés. Ils
   reprennent la structure réelle de tokens.css : la palette et les valeurs
   communes sur :root, puis un bloc par thème. */
const CSS_BLOCKS: { selector: string; theme: Theme; names: string[] }[] = [
  { selector: ":root", theme: "dark", names: ["color.indigo.600", "spacing.md"] },
  { selector: ':root, [data-theme="dark"]', theme: "dark", names: ["color.bg", "color.primary"] },
  { selector: '[data-theme="light"]', theme: "light", names: ["color.bg", "color.primary"] },
];

const cssExcerpt: CodeToken[] = [
  { kind: "comment", text: "/* Extrait de tokens.css */" },
  ...CSS_BLOCKS.flatMap(({ selector, theme, names }): CodeToken[] => [
    { kind: "punctuation", text: "\n" },
    { kind: "keyword", text: selector },
    { kind: "punctuation", text: " {\n" },
    ...names.flatMap((name): CodeToken[] => {
      const token = tokensByName.get(name);
      if (!token) return [];
      const { property, value } = cssDeclaration(token, tokensByName, theme);
      return [
        { kind: "punctuation", text: "  " },
        { kind: "key", text: property },
        { kind: "punctuation", text: ": " },
        { kind: "string", text: value },
        { kind: "punctuation", text: ";\n" },
      ];
    }),
    { kind: "punctuation", text: "}" },
  ]),
];

const agentExample = tokensByName.get("color.bg");
const jsonExcerpt: CodeToken[] = agentExample ? jsonToCodeTokens(agentExample) : [];

const PIPELINE = [
  {
    label: "Source",
    file: "tokens/*.json",
    text: `${tokens.length} tokens au format DTCG : ${primitiveTokens.length} primitives et ${semanticTokens.length} tokens sémantiques, tous décrits.`,
  },
  {
    label: "Build",
    file: "Style Dictionary 5.8",
    text: `Deux thèmes (${themedTokens.length} tokens chacun) dans un seul fichier CSS, plus un format maison « json/agents ».`,
  },
  {
    label: "Sorties",
    file: "tokens.css · tokens.agents.json",
    text: "Les variables de ce site, et un JSON à plat pour les agents IA.",
  },
  {
    label: "Contrôle",
    file: "GitHub Actions",
    text: "Description manquante, thème incomplet ou build pas à jour : la CI passe au rouge.",
  },
];

/**
 * Étude de cas mise en avant en tête de la section Projets.
 *
 * Le contenu chiffré (nombre de tokens, extraits, galerie, contraste) est
 * entièrement dérivé de `tokens.agents.json`, et les couleurs du site viennent
 * du même dépôt : la section démontre ce qu'elle raconte.
 */
export default function CaseStudy() {
  // Chargée à la demande, la section n'existe pas encore quand le navigateur
  // traite l'ancre d'un lien partagé (/#design-tokens) : on fait le saut ici.
  useEffect(() => {
    if (window.location.hash === `#${caseStudyId}`) scrollToSection(caseStudyId, "auto");
  }, []);

  return (
    <article
      id={caseStudyId}
      className={styles.caseStudy}
      aria-labelledby={`${caseStudyId}-title`}
    >
      <header className={styles.intro}>
        <p className={styles.kicker}>Projet à la une · Design system</p>
        <h3 id={`${caseStudyId}-title`} className={styles.title}>
          Des design tokens lisibles par les humains et par l'IA
        </h3>
        <p className={styles.lead}>
          Un design system garantit un plancher de qualité, pas un plafond. Ce
          projet protège le plancher quand une IA écrit l'interface : chaque
          token dit à quoi il sert, et la CI refuse ceux qui ne le disent pas.
          Le plafond, lui, reste une affaire de designer.
        </p>
        <p className={styles.proof}>
          Le site que vous regardez l'utilise : toutes ses couleurs,
          ses espacements et ses deux thèmes sortent de ce dépôt.
        </p>
        <ul className={styles.stack} aria-label="Technologies">
          {STACK.map((tech) => (
            <li key={tech} className={styles.tech}>
              {tech}
            </li>
          ))}
        </ul>
      </header>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Le problème</h4>
        <p className={styles.text}>
          Donnez une palette à une IA sans contexte : elle choisit une couleur
          qui <em>ressemble</em>, pas celle qui a le bon rôle. Chaque décision
          qui n'est pas écrite devient une supposition, et une supposition
          répétée sur des centaines d'écrans devient une dérive.
        </p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Une source, deux lecteurs</h4>
        <ol className={styles.pipeline}>
          {PIPELINE.map((step, index) => (
            <li key={step.label} className={styles.step}>
              <span className={styles.stepIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.stepLabel}>{step.label}</span>
              <code className={styles.stepFile}>{step.file}</code>
              <span className={styles.stepText}>{step.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Ce que lisent le code et l'agent</h4>
        <div className={styles.codeGrid}>
          <CodeWindow fileName="build/tokens.css" tokens={cssExcerpt} />
          <CodeWindow fileName="build/tokens.agents.json" tokens={jsonExcerpt} />
        </div>
        <p className={styles.note}>
          Le JSON pour agents ajoute ce que le CSS ne dit pas : le niveau du
          token, son alias dans chaque thème et surtout sa description,
          c'est-à-dire quand l'utiliser.
        </p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Les tokens de ce site</h4>
        <p className={styles.text}>
          Une sélection lue dans{" "}
          <code className={styles.inlineCode}>tokens.agents.json</code>. Les
          pastilles utilisent les mêmes variables que le reste de la page :
          changez de thème en haut de l'écran, elles suivent.
        </p>
        <div className={styles.galleryGrid}>
          <TokenGallery />
          <TokenPreview />
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Deux leviers, et la place de l'humain</h4>
        <div className={styles.levers}>
          <div className={styles.lever}>
            <span className={styles.badgeDone}>Couvert</span>
            <p className={styles.leverTitle}>Contraindre la génération</p>
            <p className={styles.leverText}>
              Tokens sémantiques décrits, liste fermée de valeurs, règles
              d'usage écrites pour l'IA.
            </p>
          </div>
          <div className={styles.lever}>
            <span className={styles.badgeNext}>Prochaine étape</span>
            <p className={styles.leverTitle}>Vérifier ce qui est produit</p>
            <p className={styles.leverText}>
              Un contrôle en CI qui refuse le code généré s'il contient une
              couleur en dur ou une variable qui n'existe pas.
            </p>
          </div>
        </div>
        <p className={styles.text}>
          Tout ne s'écrit pas : une partie du jugement de design reste tacite.
          Ce projet tient le plancher. Le plafond demande toujours un regard de
          designer, et c'est là que mes cinq ans de graphisme comptent.
        </p>
      </div>

      <div className={styles.links}>
        <a
          href={designTokensRepo}
          target="_blank"
          rel="noreferrer"
          className={styles.primaryLink}
        >
          <IconGithub size={16} />
          Voir le code sur GitHub
        </a>
        <a
          href={designTokensAgentsFileUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.secondaryLink}
        >
          <IconExternalLink size={15} />
          Ouvrir le JSON pour agents
        </a>
      </div>
    </article>
  );
}
