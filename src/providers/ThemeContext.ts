import { createContext, useContext } from "react";

/** Ce que l'utilisateur a choisi — `system` suit la préférence de l'OS. */
export type ThemePreference = "light" | "dark" | "system";

/** Ce qui est réellement appliqué au document. */
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  preference: ThemePreference;
  theme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  /** Bascule clair ⇄ sombre à partir du thème effectivement affiché. */
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Accès au thème. Lève une erreur explicite hors du provider plutôt que de
 * renvoyer `undefined` et de casser trois composants plus loin.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme doit être utilisé à l'intérieur de <ThemeProvider>.");
  }
  return context;
}
