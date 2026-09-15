import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { rank } from "@/lib/fuzzy";
import type { Command, CommandGroup } from "@/types";
import { IconSearch } from "@/components/Icons/Icons";
import Highlight from "./Highlight";
import { useCommands } from "./useCommands";
import styles from "./CommandPalette.module.css";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface Entry {
  command: Command;
  matches: number[];
  /** Position dans la liste aplatie : c'est elle qui pilote le clavier. */
  index: number;
}

/**
 * Palette de commandes façon ⌘K.
 *
 * Points notables :
 * - rendue dans un portail, elle échappe au `overflow` et aux z-index des
 *   sections tout en restant dans l'arbre React (le contexte thème la suit) ;
 * - la recherche passe par `useDeferredValue` : la frappe reste prioritaire,
 *   le filtrage est calculé en tâche de fond ;
 * - le regroupement visuel n'affecte pas la navigation clavier, qui travaille
 *   sur une liste aplatie ;
 * - motif « combobox » du WAI-ARIA : `aria-activedescendant` garde le focus
 *   réel dans le champ pendant que la sélection visuelle se déplace.
 */
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const commands = useCommands();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeIndex, setActiveIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = useCallback(
    (index: number) => `${baseId}-option-${index}`,
    [baseId],
  );

  useLockBodyScroll(open);
  useFocusTrap(open, dialogRef);

  const results = useMemo(
    () => rank(commands, deferredQuery),
    [commands, deferredQuery],
  );

  // Groupes pour l'affichage, index plat conservé pour le clavier.
  const groups = useMemo(() => {
    const grouped = new Map<CommandGroup, Entry[]>();
    results.forEach(({ item, matches }, index) => {
      const entries = grouped.get(item.group) ?? [];
      entries.push({ command: item, matches, index });
      grouped.set(item.group, entries);
    });
    return Array.from(grouped, ([group, entries]) => ({ group, entries }));
  }, [results]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
  }, [open]);

  // Une nouvelle recherche replace la sélection en tête de liste.
  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  // Garde l'option sélectionnée visible lors de la navigation au clavier.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, optionId, results]);

  const run = useCallback(
    (command: Command) => {
      command.perform();
      if (!command.keepOpen) onClose();
    },
    [onClose],
  );

  const move = useCallback(
    (delta: number) => {
      setActiveIndex((current) => {
        if (results.length === 0) return 0;
        // Modulo qui reste positif : la liste boucle dans les deux sens.
        return (current + delta + results.length) % results.length;
      });
    },
    [results.length],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        onClose();
        break;
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(Math.max(0, results.length - 1));
        break;
      case "Enter": {
        event.preventDefault();
        const selected = results[activeIndex];
        if (selected) run(selected.item);
        break;
      }
      default:
        break;
    }
  };

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Palette de commandes"
        className={styles.dialog}
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.searchRow}>
          <IconSearch size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            className={styles.input}
            placeholder="Rechercher une section, un projet, une action…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-expanded
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              results.length > 0 ? optionId(activeIndex) : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.escHint}>esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className={styles.empty}>
            Aucun résultat pour « <strong>{query}</strong> ».
          </p>
        ) : (
          <ul id={listId} role="listbox" className={styles.list}>
            {groups.map(({ group, entries }) => (
              <li key={group} role="presentation" className={styles.group}>
                <p className={styles.groupLabel}>{group}</p>
                <ul role="group" aria-label={group} className={styles.groupList}>
                  {entries.map(({ command, matches, index }) => (
                    <li
                      key={command.id}
                      id={optionId(index)}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={`${styles.option} ${
                        index === activeIndex ? styles.optionActive : ""
                      }`}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => run(command)}
                    >
                      <span className={styles.optionIcon}>{command.icon}</span>
                      <span className={styles.optionLabel}>
                        <Highlight text={command.label} matches={matches} />
                      </span>
                      {command.hint && (
                        <span className={styles.optionHint}>{command.hint}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        <footer className={styles.footer}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> naviguer
          </span>
          <span>
            <kbd>↵</kbd> ouvrir
          </span>
          <span>
            <kbd>esc</kbd> fermer
          </span>
          <span className={styles.count} aria-live="polite">
            {results.length} commande{results.length > 1 ? "s" : ""}
          </span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
