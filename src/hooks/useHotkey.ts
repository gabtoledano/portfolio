import { useEffect, useRef } from "react";

interface HotkeyOptions {
  /** Désactive l'écouteur sans casser l'ordre des hooks. */
  enabled?: boolean;
  /** Ignore le raccourci quand le focus est dans un champ de saisie. */
  ignoreInputs?: boolean;
}

interface ParsedHotkey {
  key: string;
  mod: boolean;
  shift: boolean;
  alt: boolean;
}

/** "mod+k" → ⌘K sur macOS, Ctrl+K partout ailleurs. */
function parse(combo: string): ParsedHotkey {
  const parts = combo.toLowerCase().split("+");
  const key = parts[parts.length - 1] ?? "";
  return {
    key,
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
  };
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

/** Raccourci clavier global, déclaratif et nettoyé au démontage. */
export function useHotkey(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  { enabled = true, ignoreInputs = true }: HotkeyOptions = {},
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const { key, mod, shift, alt } = parse(combo);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key) return;
      if (mod !== (event.metaKey || event.ctrlKey)) return;
      if (shift !== event.shiftKey) return;
      if (alt !== event.altKey) return;
      if (ignoreInputs && !mod && isEditable(event.target)) return;

      event.preventDefault();
      savedHandler.current(event);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [combo, enabled, ignoreInputs]);
}
