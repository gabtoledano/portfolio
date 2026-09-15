import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  ThemeContext,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemePreference,
} from "./ThemeContext";

/** Doit rester aligné avec le script anti-flash de `index.html`. */
export const THEME_STORAGE_KEY = "gt-theme";

const PREFERENCES: readonly ThemePreference[] = ["light", "dark", "system"];

/** Défini au niveau module : une référence stable évite de relancer le hook. */
function parsePreference(raw: string): ThemePreference {
  const value: unknown = JSON.parse(raw);
  return PREFERENCES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : "system";
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useLocalStorage<ThemePreference>(
    THEME_STORAGE_KEY,
    "system",
    parsePreference,
  );

  const prefersLight = useMediaQuery("(prefers-color-scheme: light)");

  const theme: ResolvedTheme =
    preference === "system" ? (prefersLight ? "light" : "dark") : preference;

  // Une seule écriture dans le DOM : tout le CSS réagit à `[data-theme]`.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta instanceof HTMLMetaElement) {
      meta.content = theme === "light" ? "#f5f6fb" : "#0a0a14";
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setPreference(theme === "dark" ? "light" : "dark");
  }, [theme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setPreference, toggle }),
    [preference, theme, setPreference, toggle],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
