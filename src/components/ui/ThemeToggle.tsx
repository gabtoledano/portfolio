import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "@/providers/ThemeContext";
import type { ThemePreference } from "@/providers/ThemeContext";
import { IconMonitor, IconMoon, IconSun } from "@/components/Icons/Icons";
import styles from "./ThemeToggle.module.css";

interface Option {
  value: ThemePreference;
  label: string;
  icon: ReactNode;
}

const OPTIONS: readonly Option[] = [
  { value: "light", label: "Thème clair", icon: <IconSun size={15} /> },
  { value: "system", label: "Thème système", icon: <IconMonitor size={15} /> },
  { value: "dark", label: "Thème sombre", icon: <IconMoon size={15} /> },
];

/**
 * Sélecteur clair / système / sombre.
 *
 * Implémente le motif « radiogroup » plutôt qu'une rangée de boutons : les
 * lecteurs d'écran annoncent « 2 sur 3 » et les flèches du clavier parcourent
 * le groupe. La pastille active glisse grâce à une variable CSS, sans
 * mesurer quoi que ce soit en JavaScript.
 */
export default function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const activeIndex = OPTIONS.findIndex(
    (option) => option.value === preference,
  );

  return (
    <div
      role="radiogroup"
      aria-label="Apparence du site"
      className={styles.group}
      style={{ "--active-index": activeIndex } as CSSProperties}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={preference === option.value}
          aria-label={option.label}
          title={option.label}
          className={styles.button}
          onClick={() => setPreference(option.value)}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
