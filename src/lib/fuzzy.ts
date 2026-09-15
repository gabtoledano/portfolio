/**
 * Recherche approximative par sous-séquence, façon palette de commandes
 * d'un éditeur de code.
 *
 * « apr » trouve « À propos », « prj » trouve « Projets ». Les accents sont
 * repliés caractère par caractère afin que les index retournés restent
 * alignés sur le texte d'origine et puissent servir au surlignage.
 */

export interface FuzzyMatch {
  score: number;
  /** Index (en points de code) des caractères de la cible qui ont matché. */
  matches: number[];
}

const BONUS_FIRST = 16;
const BONUS_BOUNDARY = 10;
const BONUS_CONSECUTIVE = 8;
const PENALTY_GAP = -1;
const MAX_GAP_PENALTY = 10;

const BOUNDARIES = new Set([" ", "-", "_", ".", "/", "(", ")", "&", ":", "'"]);

/** Replie un caractère vers sa forme simple ; conserve toujours une longueur 1. */
function foldChar(character: string): string {
  const folded = character
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  return folded.length === 1 ? folded : character.toLowerCase();
}

/** Découpe en points de code puis replie — 1 entrée = 1 caractère visible. */
export function fold(value: string): string[] {
  return Array.from(value, foldChar);
}

export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
  const needle = fold(query.trim());
  const haystack = fold(target);

  if (needle.length === 0) return { score: 0, matches: [] };
  if (needle.length > haystack.length) return null;

  const matches: number[] = [];
  let score = 0;
  let needleIndex = 0;
  let previousMatch = -2;

  for (
    let index = 0;
    index < haystack.length && needleIndex < needle.length;
    index += 1
  ) {
    if (haystack[index] !== needle[needleIndex]) continue;

    let characterScore = 1;
    const previousCharacter = haystack[index - 1];

    if (index === 0) {
      characterScore += BONUS_FIRST;
    } else if (previousCharacter !== undefined && BOUNDARIES.has(previousCharacter)) {
      characterScore += BONUS_BOUNDARY;
    }

    if (index === previousMatch + 1) {
      characterScore += BONUS_CONSECUTIVE;
    } else if (previousMatch >= 0) {
      const gap = Math.min(index - previousMatch - 1, MAX_GAP_PENALTY);
      characterScore += PENALTY_GAP * gap;
    }

    score += characterScore;
    matches.push(index);
    previousMatch = index;
    needleIndex += 1;
  }

  // Tous les caractères de la requête doivent avoir été consommés dans l'ordre.
  if (needleIndex < needle.length) return null;

  // À score égal, une cible courte est plus pertinente qu'une cible longue.
  score += Math.max(0, 12 - (haystack.length - needle.length) / 2);

  return { score, matches };
}

export interface RankableItem {
  label: string;
  /** Termes additionnels cherchables sans être affichés. */
  keywords?: readonly string[];
}

export interface RankedItem<T> {
  item: T;
  matches: number[];
}

/**
 * Filtre et trie une liste : le label est prioritaire, les mots-clés servent
 * de repêchage avec un score minoré (et sans surlignage puisqu'ils ne sont
 * pas affichés).
 */
export function rank<T extends RankableItem>(
  items: readonly T[],
  query: string,
): RankedItem<T>[] {
  const trimmed = query.trim();
  if (trimmed === "") return items.map((item) => ({ item, matches: [] }));

  const scored: { item: T; matches: number[]; score: number }[] = [];

  for (const item of items) {
    const onLabel = fuzzyMatch(trimmed, item.label);
    if (onLabel) {
      scored.push({ item, matches: onLabel.matches, score: onLabel.score });
      continue;
    }

    let best: number | null = null;
    for (const keyword of item.keywords ?? []) {
      const onKeyword = fuzzyMatch(trimmed, keyword);
      if (onKeyword && (best === null || onKeyword.score > best)) {
        best = onKeyword.score;
      }
    }
    if (best !== null) scored.push({ item, matches: [], score: best * 0.6 });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map(({ item, matches }) => ({ item, matches }));
}
