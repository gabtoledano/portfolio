import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useHotkey } from "@/hooks/useHotkey";
import { CommandContext, type CommandContextValue } from "./CommandContext";

/**
 * La palette part dans son propre chunk : elle embarque le moteur de recherche
 * et tout son catalogue, pour une surface que la plupart des visiteurs
 * n'ouvriront jamais. Elle n'est téléchargée qu'au premier ⌘K.
 */
const CommandPalette = lazy(
  () => import("@/components/CommandPalette/CommandPalette"),
);

interface CommandProviderProps {
  children: ReactNode;
}

/**
 * Détient l'état d'ouverture de la palette et enregistre ses raccourcis
 * globaux, pour que n'importe quel composant puisse l'ouvrir via
 * `useCommandPalette()` sans faire descendre une prop à travers l'arbre.
 */
export function CommandProvider({ children }: CommandProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((previous) => !previous), []);

  useHotkey("mod+k", toggle, { ignoreInputs: false });
  useHotkey("/", open, { enabled: !isOpen });

  const value = useMemo<CommandContextValue>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <CommandContext value={value}>
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <CommandPalette open onClose={close} />
        </Suspense>
      )}
    </CommandContext>
  );
}
