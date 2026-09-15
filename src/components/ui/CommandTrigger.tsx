import { useCommandPalette } from "@/providers/CommandContext";
import { IconSearch } from "@/components/Icons/Icons";
import styles from "./CommandTrigger.module.css";

/** `⌘` sur Apple, `Ctrl` ailleurs — le raccourci affiché doit être le vrai. */
const IS_APPLE = /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
const MODIFIER = IS_APPLE ? "⌘" : "Ctrl";
const SHORTCUT = IS_APPLE ? "⌘K" : "Ctrl K";

/**
 * Bouton d'ouverture de la palette.
 *
 * Il existe surtout pour rendre le raccourci découvrable : un ⌘K que personne
 * ne voit n'existe pas.
 */
export default function CommandTrigger() {
  const { open } = useCommandPalette();

  return (
    <button
      type="button"
      className={styles.trigger}
      onClick={open}
      aria-keyshortcuts="Meta+K Control+K"
      aria-label={`Ouvrir la palette de commandes (${MODIFIER} K)`}
    >
      <IconSearch size={15} />
      <span className={styles.label}>Rechercher</span>
      <kbd className={styles.kbd}>{SHORTCUT}</kbd>
    </button>
  );
}
