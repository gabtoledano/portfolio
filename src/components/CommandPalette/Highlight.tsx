import type { FC } from "react";
import styles from "./CommandPalette.module.css";

interface HighlightProps {
  text: string;
  /** Index (points de code) renvoyés par `fuzzyMatch`. */
  matches: number[];
}

interface Segment {
  text: string;
  matched: boolean;
}

/** Regroupe les caractères consécutifs pour ne pas générer un <mark> par lettre. */
function toSegments(text: string, matches: number[]): Segment[] {
  const matchedIndexes = new Set(matches);
  const characters = Array.from(text);
  const segments: Segment[] = [];

  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index] ?? "";
    const matched = matchedIndexes.has(index);
    const last = segments[segments.length - 1];

    if (last && last.matched === matched) {
      last.text += character;
    } else {
      segments.push({ text: character, matched });
    }
  }

  return segments;
}

/** Surligne dans le libellé les caractères qui ont satisfait la recherche. */
const Highlight: FC<HighlightProps> = ({ text, matches }) => {
  if (matches.length === 0) return <>{text}</>;

  return (
    <>
      {toSegments(text, matches).map((segment, index) =>
        segment.matched ? (
          <mark key={index} className={styles.mark}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
};

export default Highlight;
