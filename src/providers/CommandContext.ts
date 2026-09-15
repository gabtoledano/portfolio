import { createContext, useContext } from "react";

export interface CommandContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommandPalette(): CommandContextValue {
  const context = useContext(CommandContext);
  if (context === null) {
    throw new Error(
      "useCommandPalette doit être utilisé à l'intérieur de <CommandProvider>.",
    );
  }
  return context;
}
