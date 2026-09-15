import { useEffect, useMemo, useState } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { countCharacters, sliceTokens, toPlainText } from "@/lib/code";
import type { CodeToken } from "@/types";
import { IconCheck, IconCopy } from "@/components/Icons/Icons";
import styles from "./CodeWindow.module.css";

interface CodeWindowProps {
  fileName: string;
  tokens: readonly CodeToken[];
  /** Vitesse de frappe, en caractères par seconde. */
  charactersPerSecond?: number;
}

const WINDOW_DOTS = ["#ff5f57", "#febc2e", "#28c840"] as const;

/**
 * Fenêtre d'éditeur qui se dactylographie au chargement.
 *
 * L'avancement est cadencé sur `requestAnimationFrame` et calculé à partir du
 * temps écoulé, pas d'un compteur incrémenté : l'animation dure le même temps
 * quel que soit le taux de rafraîchissement de l'écran, et un onglet mis en
 * arrière-plan la rattrape au lieu de la rejouer au ralenti.
 *
 * Si l'utilisateur a demandé à réduire les animations, le bloc s'affiche
 * directement en entier.
 */
export default function CodeWindow({
  fileName,
  tokens,
  charactersPerSecond = 120,
}: CodeWindowProps) {
  const reducedMotion = usePrefersReducedMotion();
  const total = useMemo(() => countCharacters(tokens), [tokens]);
  const [typed, setTyped] = useState(() => (reducedMotion ? total : 0));
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    if (reducedMotion) {
      setTyped(total);
      return;
    }

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      startedAt ??= now;
      const characters = Math.floor(
        ((now - startedAt) / 1000) * charactersPerSecond,
      );

      if (characters >= total) {
        setTyped(total);
        return;
      }

      setTyped(characters);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, reducedMotion, charactersPerSecond]);

  const visible = useMemo(() => sliceTokens(tokens, typed), [tokens, typed]);
  const isTyping = typed < total;

  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <div className={styles.dots} aria-hidden="true">
          {WINDOW_DOTS.map((color) => (
            <span
              key={color}
              className={styles.dot}
              style={{ background: color }}
            />
          ))}
        </div>
        <span className={styles.fileName}>{fileName}</span>
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => void copy(toPlainText(tokens))}
          aria-label={copied ? "Code copié" : "Copier le code"}
        >
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        </button>
      </div>

      <pre className={styles.code}>
        {/* Le contenu complet est exposé aux lecteurs d'écran d'emblée : ils
            n'ont pas à subir l'animation de frappe. */}
        <code aria-label={toPlainText(tokens)}>
          <span aria-hidden="true">
            {visible.map((token, index) => (
              <span key={index} className={styles[token.kind]}>
                {token.text}
              </span>
            ))}
            {isTyping && <span className={styles.caret} />}
          </span>
        </code>
      </pre>
    </div>
  );
}
