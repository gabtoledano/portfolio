import CodeWindow from "@/components/ui/CodeWindow";
import { IconExternalLink, IconGithub } from "@/components/Icons/Icons";
import {
  caseStudyId,
  designTokensAgentsFileUrl,
  designTokensRepo,
  primitiveTokens,
  semanticTokens,
  tokens,
  tokensByName,
} from "@/data/designTokens";
import { cssDeclaration, jsonToCodeTokens } from "@/lib/designTokens";
import type { CodeToken } from "@/types";
import TokenGallery from "./TokenGallery";
import TokenPreview from "./TokenPreview";
import styles from "./CaseStudy.module.css";

const STACK = ["DTCG", "Style Dictionary 5.8", "GitHub Actions", "Node.js"];

/* Les extraits de code sont calculés à partir du JSON, pas recopiés. */
const CSS_EXCERPT_NAMES = [
  "color.blue.500",
  "color.action.primary",
  "color.action.primary-hover",
  "space.inset.md",
];

const cssExcerpt: CodeToken[] = [
  { kind: "comment", text: "/* Extrait de tokens.css */" },
  { kind: "punctuation", text: "\n" },
  { kind: "keyword", text: ":root" },
  { kind: "punctuation", text: " {\n" },
  ...CSS_EXCERPT_NAMES.flatMap((name): CodeToken[] => {
    const token = tokensByName.get(name);
    if (!token) return [];
    const { property, value } = cssDeclaration(token, tokensByName);
    return [
      { kind: "punctuation", text: "  " },
      { kind: "key", text: property },
      { kind: "punctuation", text: ": " },
      { kind: "string", text: value },
      { kind: "punctuation", text: ";\n" },
    ];
  }),
  { kind: "punctuation", text: "}" },
];

const agentExample = tokensByName.get("color.background.surface");
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
    text: "Le format CSS standard, plus un format maison « json/agents ».",
  },
  {
    label: "Sorties",
    file: "tokens.css · tokens.agents.json",
    text: "Des variables CSS pour le code, un JSON à plat pour les agents IA.",
  },
  {
    label: "Contrôle",
    file: "GitHub Actions",
    text: "Une description manque ou le build n'est pas à jour : la CI passe au rouge.",
  },
];

/**
 * Étude de cas mise en avant en tête de la section Projets.
 *
 * Le contenu chiffré (nombre de tokens, extraits, galerie, aperçu, contraste)
 * est entièrement dérivé de `tokens.agents.json` : la section démontre ce
 * qu'elle raconte.
 */
export default function CaseStudy() {
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
          token, son alias et surtout sa description, c'est-à-dire quand
          l'utiliser.
        </p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Les tokens sémantiques</h4>
        <p className={styles.text}>
          Cette galerie n'est pas recopiée à la main : elle est lue dans{" "}
          <code className={styles.inlineCode}>tokens.agents.json</code>, le même
          fichier que celui que lisent les agents.
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
