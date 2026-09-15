import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copie dans le presse-papier avec un retour visuel auto-réinitialisé.
 * Le timer est annulé au démontage pour ne pas appeler `setState` sur un
 * composant disparu.
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        return false;
      }
    },
    [resetDelay],
  );

  return { copied, copy } as const;
}
