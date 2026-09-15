// `vitest/config` réexporte `defineConfig` de Vite en y ajoutant la clé `test` :
// une seule configuration pour le bundler et pour les tests.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Évite les chapelets de `../../..` : tout part de la racine du code.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Un budget explicite : si un chunk dépasse, le build le signale.
    chunkSizeWarningLimit: 250,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
});
