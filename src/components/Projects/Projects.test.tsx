import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Projects from "./Projects";

// L'étude de cas est chargée à la demande (lazy) : elle arrive un instant après
// le premier affichage. On attend qu'elle soit là pour tester une section complète.
async function afficherProjets() {
  const user = userEvent.setup();
  render(<Projects />);
  const etudeDeCas = await screen.findByRole("article", { name: /design tokens/i });
  const filtres = screen.getByRole("group", { name: "Filtrer par catégorie" });
  return { user, etudeDeCas, filtres };
}

describe("Projects", () => {
  it("charge l'étude de cas design tokens en tête de section", async () => {
    const { etudeDeCas } = await afficherProjets();

    expect(etudeDeCas).toBeInTheDocument();
  });

  it("affiche tous les projets par défaut", async () => {
    const { filtres } = await afficherProjets();

    expect(within(filtres).getByRole("button", { name: /tous/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("4 projets affichés.");
  });

  it("ne garde que les projets de la catégorie choisie", async () => {
    const { user, filtres } = await afficherProjets();

    await user.click(within(filtres).getByRole("button", { name: /front-end/i }));

    expect(screen.getByRole("heading", { level: 3, name: "Kasa" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "ArgentBank" }),
    ).not.toBeInTheDocument();
    // Le message lu par les lecteurs d'écran suit le filtre.
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 projet affiché dans « Front-end ».",
    );
  });
});
