/**
 * Union discriminée : un chiffre s'anime en comptant, un jalon s'affiche avec
 * une coche. Le composant fait un `switch` sur `kind` et TypeScript garantit
 * qu'aucun cas n'est oublié.
 */
export type Stat = { id: string; label: string } & (
  | { kind: "count"; value: number; suffix?: string }
  | { kind: "badge"; symbol: string }
);

export const stats: readonly Stat[] = [
  {
    id: "projects",
    kind: "count",
    value: 10,
    suffix: "+",
    label: "Projets réalisés",
  },
  { id: "graphics", kind: "count", value: 5, label: "Ans en graphisme" },
  {
    id: "training",
    kind: "badge",
    symbol: "✓",
    label: "Formation OpenClassrooms",
  },
];
